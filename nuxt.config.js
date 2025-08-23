// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  // Modules
  modules: [
    '@nuxtjs/mdc',
    '@nuxtjs/algolia',
    '@nuxtjs/google-fonts',
    '@nuxtjs/i18n',
    'nuxt-tiptap-editor',
    'nuxt-monaco-editor',
    'nuxt-echarts',
    '@nuxt/image',
    '@nuxt/icon'
  ],

  // Fonts
  googleFonts: {
      download: true,
      inject: true,
      families: {
          'Nunito': [400, 700],
          'JetBrains Mono': [400, 700]
      }
  },

  // Search
  algolia: {
      applicationId: 'VFMYZHO190',
      apiKey: '8bfbcf46b5b82261235aa088be5d1b79',
      docSearch: {
          indexName: 'william278',
          langAttribute: 'lang',
          facetFilters: ''
      }
  },

  // SEO and meta
  app: {
      layoutTransition: { 
          name: 'layout', 
          mode: 'out-in' 
      },
      head: {
          charset: 'utf-16',
          viewport: 'width=device-width, initial-scale=1',
          title: 'William278.net - Open source Minecraft server software & game projects.',
          meta: [
              { name: 'description', content: 'Easily-accessible documentation and information site for all of William278\'s Minecraft plugins, projects & games!' },
              { name: 'theme-color', content: '#00fb9a' },
              { name: 'twitter:card', content: 'summary' },
              { name: 'twitter:site', content: '@William27528' },
              { name: 'twitter:description', content: 'Easily-accessible documentation and information site for all of William278\'s Minecraft plugins, projects & games!' },
              { name: 'twitter:image', content: '/images/icons/william278.png' },
              { name: 'twitter:image:alt', content: 'William278.net' },
              { name: 'og:title', content: 'William278.net' },
              { name: 'og:description', content: 'Easily-accessible documentation and information site for all of William278\'s Minecraft plugins, projects & games!' },
              { name: 'og:image', content: '/images/icons/william278.png' },
              { name: 'og:url', content: 'https://william278.net' },
              { name: 'og:site_name', content: 'William278.net - Open source Minecraft server software & game projects' },
              { name: 'og:type', content: 'website' },
              { name: 'og:locale', content: 'en_GB' },
              { name: 'og:locale:alternate', content: 'en_US' },
          ],
          script: [
              { defer: true, 'data-domain': 'william278.net', src: 'https://analytics.william278.net/js/script.js' }
          ]
      }
  },

  routeRules: {
    '/terms': { redirect: '/docs/website/terms-and-conditions' },
    '/project': { redirect: '/' },
    '/sitemap': { redirect: '/sitemap.xml' },
    '/rss': { redirect: '/rss.xml' },
    '/feed': { redirect: '/rss.xml' },
    '/feed.xml': { redirect: '/rss.xml' },
    '/contact': { redirect: '/?show_contact=1' },
  },

  // Components
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  // Runtime parameters
  runtimeConfig: {
      public: {
          GIT_URL: process.env.GIT_URL,
          GIT_HASH: require('child_process').execSync('git rev-parse --short HEAD').toString().trim(),
          GIT_BRANCH: require('child_process').execSync('git branch --show-current').toString().trim(),
          API_BASE_URL: process.env.API_BASE_URL,
          FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL,
          ASSETS_BASE_URL: process.env.ASSETS_BASE_URL,
          DUMPS_BYTEBIN_URL: process.env.DUMPS_BYTEBIN_URL,
          TRANSCRIPT_BUCKET_URL: process.env.TRANSCRIPT_BUCKET_URL,
          CURRENCY_SYMBOL: process.env.CURRENCY_SYMBOL,
          COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
          SESSION_EXPIRY_DAYS: process.env.SESSION_EXPIRY_DAYS,
      }
  },

  // Images
  image: {
    domains: [ 
        process.env.ASSETS_BASE_URL,
        process.env.FRONTEND_BASE_URL,
        'repo.william278.net',
        'haroohie.club',
        'cdn.discordapp.com',
        'raw.githubusercontent.com',
        'img.shields.io',
        'crafthead.net'
    ]
  },

  // ECharts
  echarts: {
    ssr: true,
    renderer: ['canvas'],
    charts: ['BarChart', 'MapChart'],
    components: [
        'DatasetComponent',
        'GridComponent',
        'TooltipComponent',
        'ToolboxComponent',
        'GeoComponent',
        'VisualMapComponent',
    ],
  },

  // Build config
  build: {
      transpile: ['@odiffey/discord-markdown'],
  },

  // Content config (https://content.nuxtjs.org/api/configuration)
  content: {
     build: {
      markdown: {
        highlight: {
          theme: 'github-dark-dimmed',
          langs: ['js', 'java', 'yaml','toml', 'xml', 'groovy']
        }
      }
    }
  },

  // Internationalization
  i18n: {
    bundle: {
      optimizeTranslationDirective: true
    },
    detectBrowserLanguage: {
          useCookie: false,
          redirectOn: 'root',
      },
      locales: [
          { code: 'en', language: 'en', file: 'en.json', dir: 'ltr' },
      ],
      defaultLocale: 'en'
  },

  // Fetch necessary assets / documentation from GitHub
  hooks: {
      'build:before': () => {
          require('./hooks/prepareEmulators').prepareEmulators()
      }
  },

  // Tiptap editor components
  tiptap: {
      prefix: 'Tiptap',
      lowlight: {
          theme: 'github-dark',
      }
  },

  // Dev tools
  devtools: {
    timeline: {
      enabled: true,
      lowlight: {
        theme: 'github-dark',
      },
    }
  },

  compatibilityDate: '2024-07-09'
})