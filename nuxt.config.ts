// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  srcDir: 'src',
  modules: [
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@vee-validate/nuxt',
    '@pinia/nuxt',
    '@prisma/nuxt'
  ],
  prisma: {
    generateClient: false,
    runMigration: false
  },
  runtimeConfig: {
    public: {
      supabase:{
        url: process.env.NUXT_PUBLIC_SUPABASE_URL,
        key: process.env.NUXT_PUBLIC_SUPABASE_KEY
      }
    }
  }
})