import type { HeadConfig } from 'vitepress'
    
export const head: HeadConfig[] =  [
  ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/images/favicon.png', type: 'image/png' }],
    [
      'link',
      {
        rel: 'alternate icon',
        href: '/images/favicon.png',
        type: 'image/png',
        sizes: '16x16'
      }
    ],
    ['meta', { name: 'author', content: 'ZQ-XU' }],
    ['link', { rel: 'mask-icon', href: '/images/favicon.png', color: '#ffffff' }],
    [
      'link',
      { rel: 'apple-touch-icon', href: '/images/favicon.png', sizes: '180x180' }
    ]
]