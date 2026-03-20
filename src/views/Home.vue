<template>
  <div class="cv-page min-h-screen bg-tech-pattern text-gray-300 font-sans selection:bg-secondary-500/20 selection:text-white">
    <div class="max-w-8xl mx-auto md:h-screen md:overflow-hidden flex flex-col md:flex-row">
      <aside class="w-full md:w-80 lg:w-96 md:h-full bg-dark-900/80 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/5 md:flex-shrink-0 z-20 relative">
        <SideProfile />
      </aside>

      <main class="flex-1 md:h-full md:overflow-y-auto relative z-10 scroll-smooth">
        <div class="container-custom py-10 md:py-16 md:px-12 max-w-5xl mx-auto space-y-12">
          <section class="animate-fade-in-up">
            <h2 class="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-3 font-display-custom">
              <span class="w-8 h-1 accent-line rounded-full opacity-80"></span>
              <span class="gradient-text">About Me</span>
            </h2>
            <div class="glass-card p-6 md:p-8">
              <p class="text-lg leading-relaxed text-gray-300">
                {{ personalInfo.summary }}
              </p>
            </div>
          </section>

          <section class="animate-fade-in-up" style="animation-delay: 100ms;">
            <h2 class="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-3 font-display-custom">
              <span class="w-8 h-1 accent-line rounded-full opacity-80"></span>
              <span class="gradient-text">Experience</span>
            </h2>
            <div class="relative pl-4 space-y-8">
              <div class="absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary-500/50 via-secondary-500/20 to-transparent"></div>

              <div
                v-for="exp in sortedExperiences"
                :key="exp.id"
                class="relative pl-8 group"
              >
                <div class="absolute left-[-5px] top-2 w-4 h-4 rounded-full bg-dark-950 border-2 border-primary-700 group-hover:bg-primary-500 group-hover:shadow-[0_0_14px_rgba(79,70,229,0.3)] transition-all duration-300 z-10"></div>

                <div class="glass-card p-6 border-l-4 border-l-[#4C1D95] hover:border-l-purple-600 transition-colors">
                  <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div>
                      <h3 class="text-xl font-bold text-gray-100 group-hover:text-secondary-200 transition-colors font-display-custom">{{ exp.title }}</h3>
                      <p class="text-lg text-gray-400 font-medium">{{ exp.company }}</p>
                    </div>
                    <div class="mt-2 md:mt-0 px-3 py-1 text-sm whitespace-nowrap accent-pill font-code-custom">
                      <span class="gradient-text">{{ formatDate(exp.startDate) }} - {{ formatDate(exp.endDate) }}</span>
                    </div>
                  </div>

                  <ul class="space-y-2 card-muted-text">
                    <li v-for="(desc, idx) in exp.description" :key="idx" class="flex gap-3">
                      <span class="text-secondary-400 mt-1.5">▹</span>
                      <span>{{ desc }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section class="md:hidden animate-fade-in-up" style="animation-delay: 200ms;">
            <h2 class="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-3 font-display-custom">
              <span class="w-8 h-1 accent-line rounded-full opacity-80"></span>
              <span class="gradient-text">Technical Skills</span>
            </h2>
            <SkillsGrid :skills="skills" />
          </section>

          <section class="animate-fade-in-up" style="animation-delay: 300ms;">
            <h2 class="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-3 font-display-custom">
              <span class="w-8 h-1 accent-line rounded-full opacity-80"></span>
              <span class="gradient-text">Featured Projects</span>
            </h2>
            <div class="grid gap-8">
              <div
                v-for="project in projects"
                :key="project.id"
                class="glass-card neon-project-card overflow-hidden group"
              >
                <div class="bg-dark-950/50 px-6 py-3 border-b border-white/5 flex items-center justify-between">
                  <div class="flex gap-1.5">
                    <div class="w-3 h-3 rounded-full bg-primary-900/80 border border-primary-700/60"></div>
                    <div class="w-3 h-3 rounded-full bg-secondary-900/70 border border-secondary-700/50"></div>
                    <div class="w-3 h-3 rounded-full bg-secondary-700/40 border border-secondary-500/35"></div>
                  </div>
                  <div class="text-xs font-mono text-gray-500">project-{{ project.id }}.ts</div>
                </div>

                <div class="p-6 md:p-8">
                  <div class="grid md:grid-cols-[minmax(0,1fr)_auto] gap-4 md:gap-6 items-start mb-6">
                    <div class="min-w-0">
                      <h3 class="project-title text-2xl font-bold text-gray-100 mb-2 transition-all font-display-custom">
                        {{ project.name }}
                      </h3>
                      <p class="card-muted-text leading-relaxed max-w-2xl">
                        {{ project.description }}
                      </p>
                    </div>
                    <div class="flex gap-3 flex-wrap md:justify-self-end md:self-start">
                      <a
                        v-if="project.liveUrl"
                        :href="project.liveUrl"
                        target="_blank"
                        class="flex items-center gap-2 px-4 py-2 rounded-lg border text-gray-100 transition-all text-sm font-medium gradient-button"
                        title="Live Demo"
                      >
                        <i class="fas fa-external-link-alt"></i>
                        <span>Live Demo</span>
                      </a>
                      <a
                        v-if="project.githubUrl"
                        :href="project.githubUrl"
                        target="_blank"
                        class="flex items-center gap-2 px-4 py-2 rounded-lg border text-gray-300 transition-all text-sm font-medium gradient-outline-button"
                        title="Source Code"
                      >
                        <i class="fab fa-github"></i>
                        <span>View Source Code</span>
                      </a>
                      <div
                        v-if="project.sourceNote"
                        class="px-3 py-2 rounded-lg border text-xs text-gray-300 gradient-outline-button font-code-custom"
                      >
                        Source: {{ project.sourceNote }}
                      </div>
                    </div>
                  </div>

                  <div class="flex flex-wrap gap-2 mb-6">
                    <span
                      v-for="tech in project.techStack.slice(0, 5)"
                      :key="tech"
                      class="tech-tag"
                    >
                      {{ tech }}
                    </span>
                  </div>

                  <div class="grid md:grid-cols-2 gap-6 p-4 rounded-xl bg-dark-950/30 border border-white/5">
                    <div>
                      <h4 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 font-display-custom">Key Features</h4>
                      <ul class="space-y-2">
                        <li v-for="(feat, idx) in project.features.slice(0, 4)" :key="idx" class="flex gap-2 text-sm card-muted-text">
                          <span class="text-secondary-400">▹</span>
                          <span class="line-clamp-2">{{ feat }}</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 font-display-custom">Architecture</h4>
                      <ul class="space-y-2">
                        <li v-for="(arch, idx) in project.architecture?.slice(0, 4)" :key="idx" class="flex gap-2 text-sm card-muted-text">
                          <span class="text-primary-300">▹</span>
                          <span class="line-clamp-2">{{ arch }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div class="text-center pt-20 pb-10 text-gray-600 text-sm">
            <p>Designed & Built by <span class="gradient-text">Quoc Bao</span></p>
            <p class="mt-1 text-xs opacity-50 font-code-custom">v2.0.0 • Tech Stack: Vue 3 + Tailwind</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SideProfile from '@/components/SideProfile.vue'
import SkillsGrid from '@/components/SkillsGrid.vue'
import { personalInfo } from '@/data/personal'
import { skills } from '@/data/skills'
import { experiences } from '@/data/experience'
import { projects } from '@/data/projects'

const formatDate = (date: string): string => {
  if (date === 'Present') return 'Present'
  const [year, month] = date.split('-')
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${monthNames[parseInt(month) - 1]} ${year}`
}

const sortedExperiences = computed(() => {
  return [...experiences].sort((a, b) => {
    const dateA = a.endDate === 'Present' ? '9999-12' : a.endDate
    const dateB = b.endDate === 'Present' ? '9999-12' : b.endDate
    return dateB.localeCompare(dateA)
  })
})
</script>

<style scoped>
.group:hover .project-title {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 52%, #c026d3 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

@media print {
  .cv-page {
    background: white;
  }

  .project-item {
    page-break-inside: avoid;
  }
}
</style>
