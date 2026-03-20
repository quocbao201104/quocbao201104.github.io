<template>
  <div class="skills-grid">
    <div 
      v-for="category in categories" 
      :key="category.name"
      class="skill-category mb-6 print:mb-3"
    >
      <h3 class="text-xl font-bold text-gray-200 mb-4 print:text-lg print:text-black print:mb-2">
        {{ category.name }}
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 print:grid-cols-4 print:gap-2">
        <div 
          v-for="skill in category.skills" 
          :key="skill.name"
          class="skill-item bg-dark-800 border border-gray-700 rounded-lg p-3 hover:border-secondary-400 transition-colors print:bg-white print:border-gray-300 print:p-2"
        >
          <div class="flex items-center justify-between mb-2 print:mb-1">
            <span class="font-medium text-gray-100 print:text-sm print:text-black">{{ skill.name }}</span>
            <span 
              class="text-xs px-2 py-0.5 rounded-full print:hidden"
              :class="getLevelClass(skill.level)"
            >
              {{ skill.level }}
            </span>
          </div>
          <div class="h-1.5 bg-dark-700 rounded-full overflow-hidden print:bg-gray-200">
            <div 
              class="h-full bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full transition-all print:bg-gray-700"
              :style="{ width: getLevelWidth(skill.level) }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Skill } from '@/types'

const props = defineProps<{
  skills: Skill[]
}>()

const categories = computed(() => {
  const categoryMap: Record<string, { name: string; skills: Skill[] }> = {}
  
  props.skills.forEach(skill => {
    const categoryName = getCategoryDisplayName(skill.category)
    if (!categoryMap[categoryName]) {
      categoryMap[categoryName] = { name: categoryName, skills: [] }
    }
    categoryMap[categoryName].skills.push(skill)
  })
  
  return Object.values(categoryMap)
})

const getCategoryDisplayName = (category: string): string => {
  const displayNames: Record<string, string> = {
    'backend': 'Backend Development',
    'frontend': 'Frontend Development',
    'database': 'Database & Cloud',
    'tools': 'Tools & DevOps'
  }
  return displayNames[category] || category
}

const getLevelClass = (level: string): string => {
  const classes: Record<string, string> = {
    'expert': 'bg-secondary-500/20 text-secondary-300',
    'advanced': 'bg-primary-500/20 text-primary-300',
    'intermediate': 'bg-fuchsia-500/20 text-fuchsia-300',
    'beginner': 'bg-gray-500/20 text-gray-400'
  }
  return classes[level] || classes.beginner
}

const getLevelWidth = (level: string): string => {
  const widths: Record<string, string> = {
    'expert': '100%',
    'advanced': '80%',
    'intermediate': '60%',
    'beginner': '40%'
  }
  return widths[level] || '40%'
}
</script>

<style scoped>
@media print {
  .skill-item:hover {
    border-color: #d1d5db !important;
  }
}
</style>
