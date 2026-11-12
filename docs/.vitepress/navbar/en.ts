import { DefaultTheme } from 'vitepress'

export const navbarEn: DefaultTheme.NavItem[] = [
    {
        text: 'Open Source',
        items: [
            {
                text: '<span class="nav-item"><img class="nav-logo nav-logo-kafka" src="/icons/kafka.svg" alt="" />Kafka -- Local Setup & Golang Verification</span>',
                link: '/en/open-source/kafka/index'
            }
        ]
    },
    {
        text: 'Maltese',
        items: [
            { text: 'Maltese Learning', link: '/en/more/maltese/index' }
        ]
    },
    {
        text: 'More',
        items: [
            { text: 'DockerHub', link: 'https://hub.docker.com/u/zqxu1993' }
        ]
    }
]
