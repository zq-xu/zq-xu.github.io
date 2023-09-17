import { getThemeConfig, defineConfig } from '@sugarat/theme/node'
import packageJSON from '../../package.json'
import { navbarZh } from './navbar'
import { head } from './head'
import { chineseSearchOptimize, pagefindPlugin } from 'vitepress-plugin-pagefind'

const blogTheme = getThemeConfig({
  // 文章默认作者
  author: '鸢涯',
  recommend: {
    showSelf: true
  },
  friend: [
    {
      nickname: '粥里有勺糖',
      des: '你的指尖用于改变世界的力量',
      avatar:
        'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTE2NzAzMA==674995167030',
      url: 'https://sugarat.top'
    },
    {
      nickname: 'Vitepress',
      des: 'Vite & Vue Powered Static Site Generator',
      avatar:
        'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTI2NzY1Ng==674995267656',
      url: 'https://vitepress.vuejs.org/'
    }
  ],
  popover: {
    title: '公告',
    duration: -1,
    body: [
      {
        type: 'text',
        content: '👇 微信 👇 欢迎大家私信交流'
      },
      {
        type: 'image',
        src: '/images/more/wechat-qrcode.png'
      }
    ]
  },
  search: 'pagefind'
})

export default defineConfig({
  base: '/',
  head,
  lang: 'zh-cmn-Hans',
  title: 'ZQ-XU',
  description: 'ZQ-XU的个人博客',
  vite: {
    optimizeDeps: {
      include: ['element-plus'],
      exclude: ['@sugarat/theme']
    },
    plugins: [pagefindPlugin({
      customSearchQuery: chineseSearchOptimize,
      btnPlaceholder: '搜索',
      placeholder: '搜索文档',
      emptyText: '空空如也',
      heading: '共: {{searchResult}} 条结果'
    })],
  },
  extends: blogTheme,
  themeConfig:{
    logo: '/logo.png',
    outline: [2, 6],
    nav: navbarZh,
    lastUpdatedText: '上次更新于',
    footer: {
      message: '~~~我是有底线的~~~',
      copyright:
        'MIT Licensed | <a target="_blank" href="https://theme.sugarat.top/"> ZQ-XU </a>'
    },
    // editLink: {
    //   pattern:
    //     'https://github.com/ATQQ/sugar-blog/tree/master/packages/blogpress/:path',
    //   text: '去 GitHub 上编辑内容'
    // },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/zq-xu/zq-xu.github.io'
      }
    ]
  }
})
