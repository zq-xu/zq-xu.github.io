---
hidden: true
date: 2022-11-24
---

# NFS Server

## 概览

NFS Server管理一个或多个文件目录，使得这些文件目录可以被挂载到多台服务器上，成为多台服务器共享的文件目录。

## 环境说明

通过如下指令查看系统环境：

```
$ cat /etc/redhat-release 
CentOS Linux release 7.9.2009 (Core)
```

## 安装NFS Server

```
$ sudo yum install nfs-utils
```

只安装 nfs-utils 即可，rpcbind 属于它的依赖，也会安装上。

## 配置NFS Server

1. 设置 NFS 服务开机启动
    ```
    $ sudo systemctl enable rpcbind
    $ sudo systemctl enable nfs
    ```

2. 启动 NFS 服务
    ```
    $ sudo systemctl start rpcbind
    $ sudo systemctl start nfs
    ```

3. 打开防火墙 rpc-bind 和 nfs 的服务
如果防火墙未开启，则可以跳过此步骤：
    ```
    $ sudo firewall-cmd --zone=public --permanent --add-service={rpc-bind,mountd,nfs}
    success
    $ sudo firewall-cmd --reload
    success
    ```

## 配置共享目录

1. 创建在服务器之间共享的目录
```
$ sudo mkdir -p /home/nfs/data
$ sudo chmod 755 /home/nfs/data
```

2. 导出相应配置目录
    - 编辑导出文件：
    ```
    $ sudo vi /etc/exports
    ```
    
    - 添加如下配置
    ```
    /home/nfs/data/     192.168.1.0/24(rw,sync,no_root_squash,no_all_squash)
    ```
    
    - 配置说明：
        
        - `/data`: 共享目录位置。
        - `192.168.1.0/24`: 客户端 IP 范围，`*` 代表所有，即没有限制。
        - `rw`: 权限设置，可读可写。
        - `sync`: 同步共享目录。
        - `no_root_squash`: 可以使用 root 授权。
        - `no_all_squash`: 可以使用普通用户授权。
            

## 重启 NFS Server

重启NFS Server:
```
$ sudo systemctl restart nfs
```

检查一下本地的共享目录:
```
$ showmount -e localhost
Export list for localhost:
/home/nfs/data 192.168.1.0/24
```

这样，服务端就配置好了，接下来配置客户端，连接服务端，使用共享目录。