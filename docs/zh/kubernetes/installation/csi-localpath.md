---
hidden: true
date: 2022-12-28
---

# LocalPath CSI安装

在Kubernetes环境中，如果想使用本机路径作为为CSI提供的PV存在，则需要提供相应的Provisioner来为本机路径动态分配PV.

Kubernetes官方提供了[sig-storage-local-static-provisioner](https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner)动态绑定本机路径作为PV, 但需要预先在监听的本机路径下创建好挂载点(该路径下的子路径mount了磁盘或者其他路径)，无法动态供应本地卷(mount了几个子路径就是几个pv)，使用起来十分不便。

本文将介绍如何使用[Local path provisioner](https://github.com/rancher/local-path-provisioner)来实现使用本机路径绑定CSI动态分配PV.

## 初始化本机磁盘

本小节介绍如何将一个磁盘初始化并挂载到指定路径。

如果你已经有了需要使用的路径，则可以跳过此小节。

如果你的Kubernetes环境对应了多个节点，则这些节点上都要准备相应的本机路径。

1. 使用”lsblk”指令查看本机磁盘现状：
    ```
    lsblk
    
    # 控制台输出
    NAME            FSTYPE      LABEL UUID                                   MOUNTPOINT
    nvme0n1         259:1    0  3.5T  0 disk
    ├─nvme0n1p1     259:2    0  200M  0 part /boot/efi
    ├─nvme0n1p2     259:3    0    1G  0 part /boot
    └─nvme0n1p3     259:4    0  3.5T  0 part
      ├─centos-root 253:0    0   50G  0 lvm  /
      ├─centos-swap 253:1    0    4G  0 lvm
      └─centos-home 253:2    0  3.4T  0 lvm  /home
    nvme1n1         259:0    0  3.5T  0 disk
    ├─nvme1n1p1     259:7    0 1024G  0 part
    ├─nvme1n1p2     259:8    0    1T  0 part
    └─nvme1n1p3     259:9    0    1T  0 part
    nvme2n1         259:5    0  3.5T  0 disk
    nvme3n1         259:6    0  3.5T  0 disk
    ```
    
    可以看到当前磁盘“nvme2n1”和“nvme3n1”空闲，以下将把磁盘“nvme2n1”分为一个分区并挂载到本机路径“/localpv”下，并用于后续的PV的分配；
    
2. 使用”parted”指定对磁盘“nvme2n1”进行分区：
    ```
    parted -s /dev/nvme2n1 mklabel gpt mkpart primary  0 3.5TB
    
    lsblk
    
    # 控制台输出
    NAME            FSTYPE      LABEL UUID                                   MOUNTPOINT
    nvme0n1         259:1    0  3.5T  0 disk
    ├─nvme0n1p1     259:2    0  200M  0 part /boot/efi
    ├─nvme0n1p2     259:3    0    1G  0 part /boot
    └─nvme0n1p3     259:4    0  3.5T  0 part
      ├─centos-root 253:0    0   50G  0 lvm  /
      ├─centos-swap 253:1    0    4G  0 lvm
      └─centos-home 253:2    0  3.4T  0 lvm  /home
    nvme1n1         259:0    0  3.5T  0 disk
    ├─nvme1n1p1     259:7    0 1024G  0 part
    ├─nvme1n1p2     259:8    0    1T  0 part
    └─nvme1n1p3     259:9    0    1T  0 part
    nvme2n1         259:5    0  3.5T  0 disk
    └─nvme2n1p1     259:10   0  3.5T  0 part 
    nvme3n1         259:6    0  3.5T  0 disk
    ```
    
    磁盘“nvme2n1”分区之后得到一个分区“nvme2n1p1”；
    
3. 格式化磁盘“nvme2n1”分区之后得到的分区“nvme2n1p1”：
    ```
    mkfs.ext4 /dev/nvme2n1p1
    ```
    
4. 将初始化之后的“nvme2n1p1”挂载到本机路径“/localpv”：
    ```
    mount /dev/nvme2n1p1 /localpv
    
    lsblk
    NAME            MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
    nvme0n1         259:1    0  3.5T  0 disk
    ├─nvme0n1p1     259:2    0  200M  0 part /boot/efi
    ├─nvme0n1p2     259:3    0    1G  0 part /boot
    └─nvme0n1p3     259:4    0  3.5T  0 part
      ├─centos-root 253:0    0   50G  0 lvm  /
      ├─centos-swap 253:1    0    4G  0 lvm
      └─centos-home 253:2    0  3.4T  0 lvm  /home
    nvme1n1         259:0    0  3.5T  0 disk
    ├─nvme1n1p1     259:7    0 1024G  0 part
    ├─nvme1n1p2     259:8    0    1T  0 part
    └─nvme1n1p3     259:9    0    1T  0 part
    nvme2n1         259:5    0  3.5T  0 disk
    └─nvme2n1p1     259:10   0  3.5T  0 part /localpv
    nvme3n1         259:6    0  3.5T  0 disk
    ```
    

## 安装local-path-provisioner

### 获取安装文件

配置好的安装文件如[LocalPath安装文件](/downloads/kubernetes/installation/local-path-storage.yaml)

该安装文件中配置StorageClass名称为默认值“local-path”，本机路径为“/localpv/local-path-provisioner”.  
以下将介绍该安装文件的获取方法和相关配置：

1. 从github上下载local-path-provisioner的安装文件：
    ```
    wget https://raw.githubusercontent.com/rancher/local-path-provisioner/master/deploy/local-path-storage.yaml
    ```
    
2. 修改安装文件配置（详情可以参考[local-path-provisioner配置](https://github.com/rancher/local-path-provisioner#configuration)）：
    ```
    修改分配PV的本机路径：
      找到名为"local-path-config"的ConfigMap资源，其data字段中有"config.json"，其中的"paths"即为分配的本机路径，如果配置多个，则分配PV时将在这几个路径中随机选取。
    附件中配置的路径为"/ssd/ssd0/localpv"
    ```
    

### 部署local-path-provisioner

1. 在Kubernetes环境中部署：
    ```
    kubectl apply -f  local-path-storage.yaml
    ```
    
    local-path-provisioner对应的资源将会被部署到名为”local-path-storage”的namespace中；
    
2. 查看部署的local-path-provisioner的pod：
    ```
    kubectl get po -n local-path-storage
    NAME                                      READY   STATUS    RESTARTS   AGE
    local-path-provisioner-556d4466c8-xc6jq   1/1     Running   0          1m
    ```
    
3. 查看部署的local-path-provisioner的StorageClass：
    ```
    kubectl get sc
    NAME                        PROVISIONER                  RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
    local-path                  rancher.io/local-path        Delete          WaitForFirstConsumer   false                  1m
    ```
    
    该结果表示StorageClass名称为”local-path”，当pod绑定指定了该StorageClass的PVC时才为相应的PVC动态分配PV.当PVC被删除时，相应的PV也会被删除。
    

## 验证部署结果

当前Kubernetes环境中已经部署了local-path-provisioner，通过pod和pvc来验证local-path-provisioner是否能使用指定的本机路径动态分配pv.

### 准备Pod和PVC

- pod-test.yaml:
    ```
    apiVersion: v1
    kind: Pod
    metadata:
      name: volume-test
    spec:
      containers:
      - name: volume-test
        image: nginx:stable-alpine
        imagePullPolicy: IfNotPresent
        volumeMounts:
        - name: volv
          mountPath: /data
        ports:
        - containerPort: 80
      volumes:
      - name: volv
        persistentVolumeClaim:
          claimName: local-path-pvc
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
            - matchExpressions:
              - key: kubernetes.io/hostname
                operator: In
                values:
                - ib-2
    ```
    
    该”pod.yaml”文件定义了一个pod，该pod绑定了一个名为”local-path-pvc”的PVC. 且指定Pod调度的节点为”ib-2”；
    
- pvc-test.yaml： 
    ```
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: local-path-pvc
    spec:
      accessModes:
        - ReadWriteOnce
      storageClassName: local-path
      resources:
        requests:
          storage: 128Mi
    ```
    
    该”pvc.yaml”文件定义了一个pvc，该pvc指定了指定了StorageClass为”local-path”.
    

### 部署Pod和PVC

在Kubernetes环境中部署pod和pvc：
```
kubectl -n local-path-storage apply -f pod-test.yaml -f pvc-test.yaml
```

### 获取Pod,PVC和PV

在Kubernetes环境中获取刚刚部署的pod和pvc以及分配的pv：
```
kubectl -n local-path-storage get po,pvc,pv
NAME                                          READY   STATUS    RESTARTS   AGE
pod/volume-test                               1/1     Running   0          63m

NAME                                   STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
persistentvolumeclaim/local-path-pvc   Bound    pvc-7be0fda1-8d90-40a7-bdaa-fbbb85b91798   128Mi      RWO            local-path     63m

NAME                                                        CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS     CLAIM                                        STORAGECLASS      REASON   AGE
persistentvolume/pvc-7be0fda1-8d90-40a7-bdaa-fbbb85b91798   128Mi      RWO            Delete           Bound      local-path-storage/local-path-pvc            local-path                 63m
```

以上信息表示，创建的pod成功挂载了目标pvc，并且该pvc也绑定了pv；

### 查看分配的pv的详情

在Kubernetes环境中获取pv详情：
```
kubectl describe pv pvc-7be0fda1-8d90-40a7-bdaa-fbbb85b91798
Name:              pvc-7be0fda1-8d90-40a7-bdaa-fbbb85b91798
Labels:            <none>
Annotations:       pv.kubernetes.io/provisioned-by: rancher.io/local-path
Finalizers:        [kubernetes.io/pv-protection]
StorageClass:      local-path
Status:            Bound
Claim:             local-path-storage/local-path-pvc
Reclaim Policy:    Delete
Access Modes:      RWO
VolumeMode:        Filesystem
Capacity:          128Mi
Node Affinity:
  Required Terms:
    Term 0:        kubernetes.io/hostname in [ib-2]
Message:
Source:
    Type:          HostPath (bare host directory volume)
    Path:          /localpv/local-path-provisioner/pvc-7be0fda1-8d90-40a7-bdaa-fbbb85b91798_local-path-storage_local-path-pvc
    HostPathType:  DirectoryOrCreate
Events:            <none>
```

以上信息表示该pv是由名为”local-path”的StorageClass在节点”ib-2”上创建的，对应节点”ib-2”上的本机路径”/localpv/local-path-provisioner/pvc-7be0fda1-8d90-40a7-bdaa-fbbb85b91798\_local-path-storage\_local-path-pvc”.