---
date: 2022-11-23
---

# NFS Client

## 概览

NFS Client可以挂载NFS Server管理的共享目录，使得多台服务器可以风筒管理共享目录，NFS支持多点挂载，即在多个服务器上同时挂载同一个共享目录。

## 环境说明

- NFS Server所在服务器IP：192.168.1.240 
- NFS Client安装服务器IP：192.168.1.241
    

## 安装NFS Client

### 安装 NFS 工具及其依赖

```
$ sudo yum install nfs-utils
```

### 客户端配置

1. 设置 rpcbind 服务的开机启动
    ```
    $ sudo systemctl enable rpcbind
    ```

2. 启动 rpcbind 服务
    ```
    $ sudo systemctl start rpcbind
    ```

客户端不需要打开防火墙，因为客户端时发出请求方，网络能连接到服务端即可。  
客户端也不需要开启 NFS 服务，因为不共享目录。

## 客户端连接 NFS Server

1. 查询NFS Server的共享目录
    ```
    $ showmount -e 192.168.1.240
    Export list for 192.168.1.240:
    /home/nfs/data *
    ```

2. 在客户端创建目录
    ```
    $ sudo mkdir /home/nfs/mount-data
    ```

3. 挂载共享目录
    ```
    $ sudo mount -t nfs 192.168.1.240:/home/nfs/data /home/nfs/mount-data
    ```

4. 查看挂载
    ```
    $ mount
    ...
    ...
    192.168.1.240:/home/nfs/data on /home/nfs/mount-data type nfs4 (rw,relatime,vers=4.1,rsize=1048576,wsize=1048576,namlen=255,hard,proto=tcp,timeo=600,retrans=2,sec=sys,clientaddr=192.168.1.241,local_lock=none,addr=192.168.1.240)
    ```

这说明已经挂载成功了。

## 测试 NFS

1. 在客户端向共享目录创建一个文件
    ```
    $ cd /home/nfs/mount-data
    $ sudo touch abc
    ```

2. 在NFS 服务端 `192.168.1.240` 查看一下
    ```
    $ cd /home/nfs/data
    $ ll
    total 0
    -rw-r--r--. 1 root  7 Mar 10 03:54 abc
    ```

可以看到，共享目录已经写入了。