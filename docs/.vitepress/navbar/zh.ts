import { DefaultTheme } from 'vitepress'

export const navbarZh: DefaultTheme.NavItem[] = [
    {
        text: 'DevOps',
        items: [
            {
                text: 'Tekton',
                link: '/zh/devops/tekton/index'
            }
        ]
    },
    {
        text: 'Kubernetes笔记',
        items: [
            {
                text: 'Kubernetes简介',
                link: '/zh/kubernetes/overview'
            },
            {
                text: 'Kubernetes安装部署',
                link: '/zh/kubernetes/installation'
            },
            {
                text: 'Kubernetes常用配置',
                link: '/zh/kubernetes/configuration'
            },
            {
                text: 'CRD && Operator',
                link: '/zh/kubernetes/crd-operator'
            }
        ]
    },
    {
        text: '常用工具',
        items: [
            {
                text: 'Docker环境',
                link: '/zh/tools/docker'
            },
            {
                text: 'Harbor镜像仓库',
                link: '/zh/tools/harbor'
            },
            {
                text: 'Kubeadm工具',
                link: '/zh/tools/kubeadm'
            },
            {
                text: 'Kubectl工具',
                link: '/zh/tools/kubectl'
            },
            {
                text: 'Helm工具',
                link: '/zh/tools/helm'
            },
            {
                text: 'Helm-Push插件',
                link: '/zh/tools/helm-push'
            },
            {
                text: 'Helm仓库',
                link: '/zh/tools/helm-chartmuseum'
            },
            {
                text: 'NFS Server',
                link: '/zh/tools/nfs-server'
            },
            {
                text: 'NFS Client',
                link: '/zh/tools/nfs-client'
            }
        ]
    }
]