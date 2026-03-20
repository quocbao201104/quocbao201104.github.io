<template>
  <aside class="h-full flex flex-col p-8 md:p-10 overflow-y-auto">
    <!-- Profile Header -->
    <div class="text-center mb-10">
      <div class="inline-block relative mb-6 group">
        <div class="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-primary-500/30 overflow-hidden mx-auto transition-all duration-300 bg-dark-800 flex items-center justify-center relative tech-glow group-hover:shadow-[0_0_45px_rgba(217,70,239,0.24)]">
            <img src="/IMG_6939.jpg" alt="Profile Avatar" class="w-full h-full object-cover" />
        </div>
        <div class="absolute inset-0 rounded-full border border-secondary-400 opacity-0 scale-110 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500"></div>
      </div>
      
    
      <h1 class="text-3xl md:text-4xl font-bold mb-2 tracking-tight gradient-text font-display-custom">
        {{ personalInfo.fullName.split(' ').pop() }}
      </h1>
      <h2 class="text-lg md:text-xl text-gray-300 font-medium">
        {{ personalInfo.fullName }}
      </h2>
      <div class="mt-4 px-4 py-1.5 inline-block accent-pill">
        <span class="gradient-text font-medium text-sm tracking-wide uppercase font-code-custom">{{ personalInfo.title }}</span>
      </div>
    </div>

    <!-- Contact Info -->
    <div class="space-y-4 mb-10 text-sm">
      <div class="flex items-center gap-3 text-gray-300 hover:text-primary-200 transition-colors p-2 rounded-lg hover:bg-white/5 cursor-pointer">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center accent-icon">
          <MapPin :size="18" />
        </div>
        <span>{{ personalInfo.location }}</span>
      </div>
      
      <a :href="`mailto:${contactEmail}`" class="flex items-center gap-3 text-gray-300 hover:text-primary-200 transition-colors p-2 rounded-lg hover:bg-white/5">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center accent-icon">
          <Mail :size="18" />
        </div>
        <span class="truncate">{{ contactEmail }}</span>
      </a>

      <div v-for="link in socialLinks" :key="link.name">
        <a 
          :href="link.url" 
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-3 text-gray-300 hover:text-primary-200 transition-colors p-2 rounded-lg hover:bg-white/5"
        >
          <div class="w-8 h-8 rounded-lg flex items-center justify-center accent-icon">
             <Github v-if="link.icon === 'github'" :size="18" />
             <Linkedin v-if="link.icon === 'linkedin'" :size="18" />
             <Phone v-if="link.icon === 'phone'" :size="18" />
             <Twitter v-if="link.icon === 'twitter'" :size="18" />
          </div>
          <span>{{ link.display || link.name }}</span>
        </a>
      </div>
    </div>

    <!-- Quick Stats/Skills -->
    <div class="mt-8 md:mt-auto">
      <h3 class="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 font-display-custom">Core Tech</h3>
      <div class="flex flex-wrap gap-2">
        <span class="tech-tag">Node.js</span>
        <span class="tech-tag">Express</span>
        <span class="tech-tag">MySQL</span>
        <span class="tech-tag">JWT & RBAC</span>
        <span class="tech-tag">Redis</span>
        <span class="tech-tag">Socket.io</span>
      </div>
      
      <div class="mt-8 pt-8 border-t border-gray-800 text-center">
        <a 
          href="/Vo-Dinh-Quoc-Bao-CV-E.pdf" 
          class="inline-flex items-center justify-center gap-2 w-full py-3 text-white rounded-lg transition-all font-medium bg-gradient-to-r from-indigo-600 to-purple-600 opacity-90 hover:opacity-100"
        >
            <Download :size="18" />
            <span>Download CV</span>
        </a>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { personalInfo } from '@/data/personal'
import { contactEmail, socialLinks } from '@/data/contact'
import { MapPin, Mail, Github, Linkedin, Phone, Twitter, Download } from 'lucide-vue-next'
</script>
