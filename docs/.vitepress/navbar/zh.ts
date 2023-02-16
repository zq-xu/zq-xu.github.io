import { DefaultTheme } from 'vitepress'
import packageJSON from '../../../package.json'

export const navbarZh: DefaultTheme.NavItem[] = [
    {
        text: packageJSON.version,
        link: '/changelog'
    },
    {
        text: '线上作品',
        items: [
            {
                text: '轻取(文件收集)',
                link: 'https://ep2.sugarat.top'
            },
            {
                text: '个人图床',
                link: 'https://imgbed.sugarat.top'
            },
            {
                text: '考勤小程序',
                link: 'https://hdkq.sugarat.top/'
            },
            {
                text: '时光恋人',
                link: 'https://lover.sugarat.top'
            },
            {
                text: '在线简历生成',
                link: 'https://resume.sugarat.top/'
            }
        ]
    }
]