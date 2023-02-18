import { DefaultTheme } from 'vitepress'

export const navbarZh: DefaultTheme.NavItem[] = [
    {
        text: '开源杂记',
        items: [
            { text: 'Tekton', link: '/zh/open-source/tekton/index' }
        ]
    },
    {
        text: '云原生',
        items: [
            {
                text: 'Kubernetes',
                items: [
                    { text: 'Kubernetes基础', link: '/zh/cloud-native/kubernetes/overview' },
                    { text: 'Kubernetes安装', link: '/zh/cloud-native/kubernetes/installation' },
                    { text: 'Kubernetes配置', link: '/zh/cloud-native/kubernetes/configuration' },
                    { text: 'CRD && Operator', link: '/zh/cloud-native/kubernetes/crd-operator' },
                    { text: 'Kubernetes实践', link: '/zh/cloud-native/kubernetes/practice' }
                ]
            },
        ]
    },
    {
        text: '手撕代码',
        items: [
            {
                text: 'Golang编程',
                items: [
                    { text: 'Golang编码规范', link: '/zh/coding/golang/standards' },
                    { text: 'Golang设计模式', link: '/zh/coding/golang/design-patterns' }
                ]
            },
            {
                text: 'Vue笔记',
                items: []
            },
        ]
    },
    

    {
        text: '常用工具',
        items: [
            { text: 'Git工具', link: '/zh/tools/git' },
            { text: 'Docker环境', link: '/zh/tools/docker' },
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
            { text: '个人简介', link: '/zh/aboutme' }
        ]
    }
]