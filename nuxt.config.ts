// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  srcDir: 'src/',
  imports: {
    dirs: [
      'composables/**',
      'utils',
      'validation'
    ]
  },
  modules: [
    '@nuxt/devtools',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    '@vee-validate/nuxt',
    '@prisma/nuxt',
    '@hebilicious/vue-query-nuxt'
  ],
  prisma: {
    generateClient: false,
    runMigration: false,
    installStudio: false,
    prismaRoot: './src/server',
    prismaSchemaPath: './src/server/prisma',
  },
  supabase: {
    redirect: false,
  },
  runtimeConfig: {
    public: {
      supabase:{
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_KEY
      }
    }
  }
})