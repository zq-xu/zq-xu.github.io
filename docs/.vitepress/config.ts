import { getThemeConfig, defineConfig } from '@sugarat/theme/node'
import packageJSON from '../../package.json'
import { navbarZh, navbarEn } from './navbar'
import { head } from './head'
import { chineseSearchOptimize } from 'vitepress-plugin-pagefind'

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
  // 全文搜索：主题内置 pagefind，直接在这里传插件参数即可
  search: {
    customSearchQuery: chineseSearchOptimize,
    btnPlaceholder: '搜索',
    placeholder: '搜索文档',
    emptyText: '空空如也',
    heading: '共: {{searchResult}} 条结果'
  },
  // 英文站点的主题文案（页面列表由主题按 /en 前缀自动切分）
  locales: {
    en: {
      author: 'ZQ-XU',
      hotArticle: {
        title: 'Featured',
        empty: 'No featured posts yet'
      },
      friend: {
        title: 'Links',
        list: [
          {
            nickname: '粥里有勺糖',
            des: 'Power to change the world at your fingertips',
            avatar: 'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTE2NzAzMA==674995167030',
            url: 'https://sugarat.top'
          },
          {
            nickname: 'Vitepress',
            des: 'Vite & Vue Powered Static Site Generator',
            avatar: 'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTI2NzY1Ng==674995267656',
            url: 'https://vitepress.vuejs.org/'
          }
        ]
      }
    }
  }
})

export default defineConfig({
  base: '/',
  head,
  lang: 'zh-cmn-Hans',
  title: 'ZQ-XU',
  description: 'ZQ-XU的个人博客',
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-cmn-Hans'
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'ZQ-XU',
      description: 'ZQ-XU · Personal blog',
      themeConfig: {
        nav: navbarEn,
        outline: [2, 6],
        lastUpdatedText: 'Last updated',
        footer: {
          message: '~~~ That is the end ~~~',
          copyright:
            'MIT Licensed | <a target="_blank" href="https://theme.sugarat.top/"> ZQ-XU </a>'
        }
      }
    }
  },
  // /downloads/ 下是 static 附件（.cfg/.tgz 等），VitePress 死链检查只认 .html，这里显式忽略
  ignoreDeadLinks: [/^\/downloads\//],
  vite: {
    optimizeDeps: {
      include: ['element-plus']
    }
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
