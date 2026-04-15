<template>
  <div class="portfolio-shell bg-grid-surface text-gray-100">
    <main class="container-custom relative z-10 py-6 md:py-14">
      <section class="hero-panel animate-fade-in">
        <div class="hero-grid">
          <div class="space-y-6">
            <div class="space-y-4">
              <p class="section-label">Backend engineer portfolio</p>
              <div class="space-y-3">
                <h1 class="hero-title">{{ personalInfo.fullName }}</h1>
                <p class="hero-subtitle">{{ personalInfo.title }}</p>
                <p class="max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                  {{ personalInfo.intro }}
                </p>
              </div>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                v-if="githubLink"
                :href="githubLink.url"
                target="_blank"
                rel="noreferrer"
                class="button-primary mobile-full-button"
              >
                <Github :size="16" />
                <span>GitHub</span>
              </a>
              <a :href="`mailto:${contactEmail}`" class="button-secondary mobile-full-button">
                <Mail :size="16" />
                <span>Contact</span>
              </a>
            </div>

            <div class="flex flex-col items-start gap-3 text-sm text-slate-400 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <div class="inline-flex items-center gap-2">
                <MapPin :size="14" />
                <span>{{ personalInfo.location }}</span>
              </div>
              <div class="inline-flex items-center gap-2">
                <span class="status-dot"></span>
                <span>{{ personalInfo.yearsOfExperience }}+ years building with Node.js</span>
              </div>
              <a href="/Vo-Dinh-Quoc-Bao-CV-E.pdf" class="inline-flex items-center gap-2 transition-colors hover:text-slate-200">
                <Download :size="14" />
                <span>Download CV</span>
              </a>
            </div>
          </div>

          <aside class="surface-panel profile-card">
            <div class="profile-avatar-shell">
              <img src="/IMG_6939.jpg" alt="Portrait of Vo Dinh Quoc Bao" class="profile-avatar" />
            </div>
            <div class="space-y-4">
              <div>
                <p class="section-label">Current focus</p>
                <p class="mt-2 text-sm leading-6 text-slate-300">
                  APIs, authorization, caching strategy, and background job workflows for content-heavy platforms.
                </p>
              </div>
              <div class="space-y-3 border-t border-white/8 pt-4 text-sm text-slate-400">
                <div class="flex items-center justify-between gap-3">
                  <span>Email</span>
                  <a :href="`mailto:${contactEmail}`" class="text-slate-200 transition-colors hover:text-white">
                    {{ contactEmail }}
                  </a>
                </div>
                <div class="flex items-center justify-between gap-3">
                  <span>Phone</span>
                  <span class="text-slate-200">{{ phoneDisplay }}</span>
                </div>
                <div class="flex items-center justify-between gap-3">
                  <span>Languages</span>
                  <span class="text-slate-200">{{ personalInfo.languages.join(' / ') }}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section class="section-shell animate-slide-up">
        <div class="section-heading">
          <p class="section-label">Overview</p>
          <h2 class="section-title">A quick read on how I work</h2>
        </div>

        <div class="bento-grid">
          <article
            v-for="card in overviewCards"
            :key="card.id"
            :class="['surface-panel bento-card', card.size === 'wide' ? 'md:col-span-2' : '']"
          >
            <div class="space-y-4">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="section-label">{{ card.label }}</p>
                  <h3 class="mt-2 text-xl font-semibold tracking-tight text-white">{{ card.title }}</h3>
                </div>
                <span v-if="card.metric" class="metric-pill">{{ card.metric }}</span>
              </div>

              <p class="max-w-xl text-sm leading-6 text-slate-300">
                {{ card.body }}
              </p>

              <div v-if="card.items?.length" class="flex flex-wrap gap-2">
                <span v-for="item in card.items" :key="item" class="stack-pill">
                  {{ item }}
                </span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="section-shell animate-slide-up">
        <div class="section-heading">
          <p class="section-label">Projects</p>
          <h2 class="section-title">Backend systems and data-heavy workflows</h2>
          <p class="section-copy">
            The projects below focus on API reliability, background processing, storage design, and traffic-aware delivery patterns.
          </p>
        </div>

        <div class="space-y-4 sm:space-y-5">
          <article v-for="project in projects" :key="project.id" class="surface-panel project-panel">
            <div class="space-y-5 sm:space-y-6">
              <div class="project-header">
                <div class="project-copy">
                  <p class="section-label">Project {{ project.id }}</p>
                  <div class="space-y-2 sm:space-y-3">
                    <h3 class="project-name">{{ project.name }}</h3>
                    <p class="text-sm leading-6 text-slate-300 md:text-base">
                      {{ project.summary }}
                    </p>
                  </div>
                </div>

                <div class="project-links">
                  <a
                    v-for="link in project.links"
                    :key="link.url"
                    :href="link.url"
                    target="_blank"
                    rel="noreferrer"
                    class="button-secondary compact-button mobile-project-link"
                  >
                    <span>{{ link.label }}</span>
                    <ArrowUpRight :size="14" />
                  </a>
                  <span v-if="project.sourceNote" class="meta-pill">
                    {{ project.sourceNote }}
                  </span>
                </div>
              </div>

              <div class="impact-panel">
                <p class="section-label">Impact</p>
                <p class="mt-2 text-sm leading-6 text-slate-200 md:text-base">
                  {{ project.impact }}
                </p>
              </div>

              <div class="project-stack">
                <span v-for="tech in project.techStack" :key="tech" class="stack-pill">
                  {{ tech }}
                </span>
              </div>

              <div class="project-detail-grid">
                <div class="detail-block">
                  <p class="section-label">Highlights</p>
                  <ul class="mt-3 space-y-3 text-sm leading-6 text-slate-300">
                    <li v-for="highlight in project.highlights" :key="highlight" class="detail-list-item">
                      <span class="detail-bullet"></span>
                      <span>{{ highlight }}</span>
                    </li>
                  </ul>
                </div>

                <div class="detail-block">
                  <p class="section-label">Architecture</p>
                  <ul class="mt-3 space-y-3 text-sm leading-6 text-slate-300">
                    <li v-for="item in project.architecture" :key="item" class="detail-list-item">
                      <span class="detail-bullet"></span>
                      <span>{{ item }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="section-shell animate-slide-up">
        <div class="section-heading">
          <p class="section-label">Experience</p>
          <h2 class="section-title">Execution over long-form biography</h2>
        </div>

        <div class="timeline-stack">
          <article v-for="experience in experiences" :key="experience.id" class="surface-panel timeline-card">
            <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 class="text-xl font-semibold tracking-tight text-white">{{ experience.role }}</h3>
                <p class="mt-1 text-sm text-slate-400 md:text-base">{{ experience.org }}</p>
              </div>
              <span class="meta-pill">{{ experience.period }}</span>
            </div>

            <ul class="mt-5 space-y-3 text-sm leading-6 text-slate-300">
              <li v-for="bullet in experience.bullets" :key="bullet" class="detail-list-item">
                <span class="detail-bullet"></span>
                <span>{{ bullet }}</span>
              </li>
            </ul>
          </article>
        </div>
      </section>

      <section class="section-shell animate-slide-up">
        <div class="section-heading">
          <p class="section-label">System design</p>
          <h2 class="section-title">How I think about backend architecture</h2>
          <p class="section-copy">
            A lightweight snapshot of the patterns I lean on when requests, data flows, and automation start to matter.
          </p>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <article v-for="area in systemDesignAreas" :key="area.id" class="surface-panel system-card">
            <p class="section-label">{{ area.label }}</p>
            <h3 class="mt-2 text-xl font-semibold tracking-tight text-white">{{ area.title }}</h3>
            <p class="mt-3 text-sm leading-6 text-slate-300">
              {{ area.description }}
            </p>

            <ul class="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              <li v-for="detail in area.details" :key="detail" class="detail-list-item">
                <span class="detail-bullet"></span>
                <span>{{ detail }}</span>
              </li>
            </ul>
          </article>
        </div>
      </section>

      <footer class="footer-shell">
        <p class="text-sm text-slate-400">Built with Vue 3 and Tailwind. Designed as a backend-focused portfolio, not a visual showcase.</p>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRight, Download, Github, Mail, MapPin } from 'lucide-vue-next'
import { contactEmail, socialLinks } from '@/data/contact'
import { experiences } from '@/data/experience'
import { overviewCards, systemDesignAreas } from '@/data/overview'
import { personalInfo } from '@/data/personal'
import { projects } from '@/data/projects'

const githubLink = computed(() => socialLinks.find((link) => link.name === 'GitHub'))
const phoneDisplay = computed(() => socialLinks.find((link) => link.name === 'Phone')?.display ?? 'Available on request')
</script>
