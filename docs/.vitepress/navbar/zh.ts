import { DefaultTheme } from 'vitepress'

export const navbarZh: DefaultTheme.NavItem[] = [
    {
        text: '开源杂记',
        items: [
            { text: '<span class="nav-item"><img class="nav-logo" src="/icons/kubernetes.svg" alt="" />Kubernetes -- 容器编排平台</span>', link: '/zh/open-source/kubernetes/index' },
            { text: '<span class="nav-item"><img class="nav-logo" src="/icons/tekton.svg" alt="" />Tekton -- 云原生CI工具</span>', link: '/zh/open-source/tekton/index' },
            { text: '<span class="nav-item"><img class="nav-logo" src="/icons/vitess.svg" alt="" />Vitess -- 数据库分库分表解决方案</span>', link: '/zh/open-source/vitess/index' },
            { text: '<span class="nav-item"><img class="nav-logo nav-logo-kafka" src="/icons/kafka.svg" alt="" />Kafka -- 本地运行与Golang验证</span>', link: '/zh/open-source/kafka/index' }
        ]
    },
    {
        text: '手撕代码',
        items: [
            {
                text: 'Golang',
                items: [
                    { text: 'Golang参考资源', link: '/zh/coding/golang/reference' },
                    { text: 'Golang编码规范', link: '/zh/coding/golang/standards' },
                    { text: 'Golang设计模式', link: '/zh/coding/golang/design-patterns' },
                    { text: 'Golang实践', link: '/zh/coding/golang/practice' }
                ]
            },
            {
                text: 'Vue & Vite',
                items: [
                    { text: 'Vue/Vite参考资源', link: '/zh/coding/vue-vite/reference' },
                    { text: 'Web示例/文档/博客构建', link: '/zh/coding/vue-vite/docs-build' },
                    { text: 'Github Pages部署', link: '/zh/coding/vue-vite/gh-pages' },
                    { text: 'Vue/Vite常用指令', link: '/zh/coding/vue-vite/command' }
                ]
            },
        ]
    },
    {
        text: '常用工具',
        items: [
            { text: 'Git工具', link: '/zh/tools/git' },
            { text: 'Docker', link: '/zh/tools/docker' },
            { text: 'Harbor镜像仓库', link: '/zh/tools/harbor' },
            { text: 'Kubeadm工具', link: '/zh/tools/kubeadm' },
            { text: 'Kubectl工具', link: '/zh/tools/kubectl' },
            { text: 'Helm工具', link: '/zh/tools/helm' },
            { text: 'Helm-Push插件', link: '/zh/tools/helm-push' },
            { text: 'Helm仓库', link: '/zh/tools/helm-chartmuseum' },
            { text: 'NFS Server', link: '/zh/tools/nfs-server' },
            { text: 'NFS Client', link: '/zh/tools/nfs-client' }
        ]
    },
    {
        text: '了解更多',
        items: [
            { text: '个人简介', link: '/zh/more/aboutme' },
            { text: '资源分享', link: '/zh/more/resource-share' },
            { text: '马耳他语', link: '/zh/more/maltese/index' },
            { text: 'DockerHub', link: 'https://hub.docker.com/u/zqxu1993' }
        ]
    }
]