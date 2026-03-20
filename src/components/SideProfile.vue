<template>
  <aside class="h-full flex flex-col p-8 md:p-10 overflow-y-auto">
    <!-- Profile Header -->
    <div class="text-center mb-10">
      <div class="inline-block relative mb-6 group">
        <div class="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-primary-500/30 overflow-hidden mx-auto shadow-[0_0_30px_rgba(34,197,94,0.1)] group-hover:shadow-[0_0_50px_rgba(34,197,94,0.2)] transition-all duration-300 bg-dark-800 flex items-center justify-center relative">
            <img src="/IMG_6939.jpg" alt="Profile Avatar" class="w-full h-full object-cover" />
        </div>
        <div class="absolute inset-0 rounded-full border border-primary-400 opacity-0 scale-110 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500"></div>
      </div>
      
    
      <h1 class="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
        {{ personalInfo.fullName.split(' ').pop() }}
      </h1>
      <h2 class="text-lg md:text-xl text-gray-400 font-medium">
        {{ personalInfo.fullName }}
      </h2>
      <div class="mt-4 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 inline-block">
        <span class="text-primary-400 font-medium text-sm tracking-wide uppercase">{{ personalInfo.title }}</span>
      </div>
    </div>

    <!-- Contact Info -->
    <div class="space-y-4 mb-10 text-sm">
      <div class="flex items-center gap-3 text-gray-300 hover:text-primary-400 transition-colors p-2 rounded-lg hover:bg-white/5 cursor-pointer">
        <div class="w-8 h-8 rounded-lg bg-dark-800 flex items-center justify-center text-primary-400">
          <MapPin :size="18" />
        </div>
        <span>{{ personalInfo.location }}</span>
      </div>
      
      <a :href="`mailto:${contactEmail}`" class="flex items-center gap-3 text-gray-300 hover:text-primary-400 transition-colors p-2 rounded-lg hover:bg-white/5">
        <div class="w-8 h-8 rounded-lg bg-dark-800 flex items-center justify-center text-primary-400">
          <Mail :size="18" />
        </div>
        <span class="truncate">{{ contactEmail }}</span>
      </a>

      <div v-for="link in socialLinks" :key="link.name">
        <a 
          :href="link.url" 
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-3 text-gray-300 hover:text-primary-400 transition-colors p-2 rounded-lg hover:bg-white/5"
        >
          <div class="w-8 h-8 rounded-lg bg-dark-800 flex items-center justify-center text-primary-400">
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
    <div class="mt-auto">
      <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Core Tech</h3>
      <div class="flex flex-wrap gap-2">
        <span class="px-3 py-1 bg-dark-800 border border-gray-700 rounded text-xs text-gray-300 font-mono">Node.js</span>
        <span class="px-3 py-1 bg-dark-800 border border-gray-700 rounded text-xs text-gray-300 font-mono">Express</span>
        <span class="px-3 py-1 bg-dark-800 border border-gray-700 rounded text-xs text-gray-300 font-mono">MySQL</span>
        <span class="px-3 py-1 bg-dark-800 border border-gray-700 rounded text-xs text-gray-300 font-mono">JWT & RBAC</span>
        <span class="px-3 py-1 bg-dark-800 border border-gray-700 rounded text-xs text-gray-300 font-mono">Redis</span>
        <span class="px-3 py-1 bg-dark-800 border border-gray-700 rounded text-xs text-gray-300 font-mono">Socket.io</span>
      </div>
      
      <div class="mt-8 pt-8 border-t border-gray-800 text-center">
        <a 
          href="/Vo-Dinh-Quoc-Bao-CV-E.pdf" 
          class="inline-flex items-center justify-center gap-2 w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-all font-medium shadow-lg shadow-primary-600/20"
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
