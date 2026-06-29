import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const requireFromTest = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

function loadChatCore({ rpcResult }) {
  const filename = resolve(__dirname, '_chat_core.ts');
  const source = readFileSync(filename, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;

  const module = { exports: {} };
  const localRequire = (specifier) => {
    if (specifier === '@supabase/supabase-js') {
      return {
        createClient: () => ({
          rpc: async () => rpcResult,
        }),
      };
    }
    return requireFromTest(specifier);
  };

  const run = new Function(
    'exports',
    'require',
    'module',
    '__filename',
    '__dirname',
    compiled,
  );
  run(module.exports, localRequire, module, filename, __dirname);
  return module.exports;
}

test('RAG chat falls back to LLM when Supabase retrieval is unavailable', async () => {
  const originalEnv = { ...process.env };
  const originalFetch = globalThis.fetch;
  const originalConsoleError = console.error;

  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key';
  process.env.LLM_BASE_URL = 'https://llm.example/v1';
  process.env.LLM_API_KEY = 'llm-key';
  process.env.LLM_MODEL = 'test-model';

  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        choices: [{ message: { content: 'fallback answer' } }],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  console.error = () => {};

  try {
    const { runChat } = loadChatCore({
      rpcResult: { data: null, error: { message: 'Error: internal error' } },
    });

    const result = await runChat({
      command: 'rag',
      userInput: 'What is Bao focused on?',
      message: 'What is Bao focused on?',
      mode: 'rag',
      persona: 'bao',
    });

    assert.equal(result.answer, 'fallback answer');
    assert.deepEqual(result.sources, []);
    assert.ok(result.trace?.some((step) => step.label === 'Retrieve knowledge' && step.status === 'failed'));
    assert.ok(result.metadata?.warnings?.includes('retrieval_unavailable'));
    assert.deepEqual(result.metadata?.usedTools, ['llm_generate']);
  } finally {
    process.env = originalEnv;
    globalThis.fetch = originalFetch;
    console.error = originalConsoleError;
  }
});

function withChatEnv(fn) {
  return async () => {
    const originalEnv = { ...process.env };
    const originalFetch = globalThis.fetch;
    const originalConsoleError = console.error;

    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key';
    process.env.LLM_BASE_URL = 'https://llm.example/v1';
    process.env.LLM_API_KEY = 'llm-key';
    process.env.LLM_MODEL = 'test-model';

    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({ choices: [{ message: { content: 'ok' } }] }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    console.error = () => {};

    try {
      await fn();
    } finally {
      process.env = originalEnv;
      globalThis.fetch = originalFetch;
      console.error = originalConsoleError;
    }
  };
}

test(
  'ambiguous tokens do not unlock PII — email stays redacted',
  withChatEnv(async () => {
    const { runChat } = loadChatCore({
      rpcResult: {
        data: [
          {
            id: 'c1',
            content: 'Reach me at bao@example.com any time.',
            title: 'Contact note',
            similarity: 0.9,
            status: 'private',
          },
        ],
        error: null,
      },
    });

    // "@" and "number" used to flip on allowPii; they must not anymore.
    const result = await runChat({
      command: 'rag',
      userInput: 'what is the @ version number here?',
      message: 'what is the @ version number here?',
      mode: 'rag',
      persona: 'bao',
    });

    assert.equal(result.sources?.length, 1);
    assert.ok(result.sources[0].content.includes('[redacted-email]'));
    assert.ok(!result.sources[0].content.includes('bao@example.com'));
  }),
);

test(
  'local paths stay redacted even under a contact intent',
  withChatEnv(async () => {
    const { runChat } = loadChatCore({
      rpcResult: {
        data: [
          {
            id: 'c2',
            content:
              'Email bao@example.com\nRepo at https://github.com/acme/secret\nMy machine is at C:\\Users\\bao\\secret.txt',
            title: 'Mixed note',
            similarity: 0.9,
            status: 'private',
          },
        ],
        error: null,
      },
    });

    // Genuine contact intent: email is allowed through, but local paths and
    // private repo links must still be redacted.
    const result = await runChat({
      command: 'rag',
      userInput: 'what is your contact email?',
      message: 'what is your contact email?',
      mode: 'rag',
      persona: 'bao',
    });

    const content = result.sources?.[0]?.content ?? '';
    assert.ok(content.includes('bao@example.com'), 'email should be allowed under contact intent');
    assert.ok(content.includes('[redacted-local-path]'), 'local path must stay redacted');
    assert.ok(content.includes('[redacted-repo-link]'), 'repo link must stay redacted');
    assert.ok(!content.includes('C:\\Users'), 'raw local path must not leak');
  }),
);

