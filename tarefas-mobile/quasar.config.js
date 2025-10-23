const { configure } = require('quasar/wrappers');

module.exports = configure(function (ctx) {
  return {
    build: {
      vueRouterMode: 'hash',
    },

    devServer: {
      https: false,
      port: 8080,
      open: true,
    },

    framework: {
      config: {},
      plugins: [
        'Notify',
        'Dialog',
        'Loading'
      ]
    },

    animations: [],

    pwa: {
      workboxPluginMode: 'GenerateSW',
      workboxOptions: {},
      manifest: {
        name: `Sistema de Tarefas`,
        short_name: `Tarefas`,
        description: `Sistema completo para gerenciamento de tarefas pessoais`,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#667eea',
        icons: [
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    },

    capacitor: {
      hideSplashscreen: true
    }
  }
});