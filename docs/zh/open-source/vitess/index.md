---
description: Vitess是一个用于部署，扩展和管理大型开源数据库实例集群的数据库解决方案。通俗点说，就是在云环境下对大型数据库及数据库集群进行分库分表并提供可靠性处理的方案。
cover: /images/open-source/vitess/vitess-horizontal-color.svg
hiddenCover: true 
date: 2021-11-10
tag:
 - Vitess
tags:
 - Kubernetes
 - CNCF
categories:
 - Open Source
---

# Vitess

Vitess是一个用于部署，扩展和管理大型开源数据库实例集群的数据库解决方案。通俗点说，就是在云环境下对大型数据库及数据库集群进行分库分表并提供可靠性处理的方案,详情可参见[Vitess官方文档](https://vitess.io/docs/)。
Vitess目前支持数据库类型如下：
- Mysql(5.6-8.0)；
- Percona(5.6-8.0)；
- MariaDB(10.0-10.3)

Vitess在github开源，是CNCF少有的毕业项目之一,其项目地址[Vitess Github](https://github.com/vitessio/vitess)。

## Vitess运行时架构

![architecture_Fotor.png](/images/open-source/vitess/vitess-architecture.png)

如图1所示,Vitess是基于微服务的框架进行设计的，其运行时设计整体看来是非常简单的，负责数据库请求处理的核心组件是VTGate和VTTablet，设计思想是路由转发：
- VTGate:  路由中心，所有数据库请求由VTGate进行分发处理，并最终汇总处理结果返回给请求端；
- VTTablet: 作为mysql实例的sidecar存在，每个mysql实例都有一个VTTablet伴生，其接受由VTGate分发的指令进行相应处理并将结果汇总至VTGate。

Vitess的集群管理是由图1中Topology组件来负责的，其存储了Vitess集群中各组件的状态信息和分库分表的规则、读写权限等元数据信息，作用相当于k8s集群中的etcd.
事实上Vitess在其官方Opeator的处理上还是使用3节点的etcd集群作为Topology的实现。

Vitess也提供了交互工具:
- vtctld作为serer存在，提供RestAPI接口供外部访问Topology中的集群信息,同时提供可视化界面，可由浏览器进行访问；
- vtctl作为命令行工具，可以以client的身份进行Vitess集群进行交互，其功能类似于k8s中的kubectl。

# Vitess基础概念
| cell | 物理上的可用区，可理解为一台服务器、一个k8s集群或者一个数据中心等。 |
| :---: | --- |
| keyspace | keyspace是逻辑上的数据库，可以由多个分片(shard)组成，也就是所谓的分库，即将单个数据库实例中的数据拆分到多个数据库实例中，这些实例对外呈现为一个对象，这个对象就是keyspace。每个keyspace由一个区间内的keyspace ID组成。 |
| keyspace ID | keyspace ID本身是使用数据中某些列的功能（例如用户ID）来计算的,Vitess允许根据需求自定义计算方法。 |
| shard | 一个shard就是在一个keyspace中的一个水平分片。每个shard都覆盖一个区间内的keyspace ID,都会包含一个master实例、多个replica实例和多个ReadOnly实例，而且不同的shard之间绝对不会存在数据重叠的现象。 |
| master | 主库提供读写服务 |
| replicate | 提供读服务，缓解主库读压力 |
| rdonly | 会与主库断开复制，允许异步的服务（备份、分析）使用 |


# Vitess部署操作
Vitess官方提供了四种安装方式：
- 通过docker进行本地安装；
- 通过命令行指令进行本地安装；
- 基于k8s的operator安装；
- helm包安装，此安装方式已停止维护。

此次选择使用基于k8s的operator进行Vitess(8.0版本)的安装，vitess的Operator在Github上开源[Vitess-Operator Github项目地址](https://github.com/planetscale/vitess-operator)。

## 前期准备

附件[vitess-deploy.tar.gz](/downloads/open-source/vitess/vitess-deploy.tgz)中有部署过程中的部分内容。

### 下载vitess开源代码

从github上下载vitess源代码[Vitess Github](https://github.com/vitessio/vitess)，指定release-8.0分支。

### 下载vtctlclient

可从github上的vitess发布版本中下载编译好的vtctlclient文件，位于/bin目录下[vitess-8.0.0](https://github.com/vitessio/vitess/releases/tag/v8.0.0)，将其置于vitess源码的/examples/operator/目录下。

### 安装mysql

可参考[CentOS 7 下 MySQL 5.7 的安装与配置](https://www.jianshu.com/p/1dab9a4d0d5f)

### 准备local-pv

准备11个本地目录作为local-pv，并赋予该目录读写权限，pv文件模板如下：
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-hostpath-1
  labels:
    type: local
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/root/xzq/vitess/pv/pv1"
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - qfusion
```

## 安装Vitess-Operator

进入到下载的vitess目录下，根据operator文件进行部署。
```sh
#cd vitess-release-8.0/examples/operator/
#kubectl apply -f operator.yaml  -nxzq
customresourcedefinition.apiextensions.k8s.io/etcdlockservers.planetscale.com created
customresourcedefinition.apiextensions.k8s.io/vitessbackups.planetscale.com created
customresourcedefinition.apiextensions.k8s.io/vitessbackupstorages.planetscale.com created
customresourcedefinition.apiextensions.k8s.io/vitesscells.planetscale.com created
customresourcedefinition.apiextensions.k8s.io/vitessclusters.planetscale.com created
customresourcedefinition.apiextensions.k8s.io/vitesskeyspaces.planetscale.com created
customresourcedefinition.apiextensions.k8s.io/vitessshards.planetscale.com created
serviceaccount/vitess-operator created
role.rbac.authorization.k8s.io/vitess-operator created
rolebinding.rbac.authorization.k8s.io/vitess-operator created
priorityclass.scheduling.k8s.io/vitess created
priorityclass.scheduling.k8s.io/vitess-operator-control-plane created
deployment.apps/vitess-operator created
```
    从部署的打印信息来看，operator在部署时创建了一系列crd资源、权限权限、调度优先级资源，其运行实例是个deployment.

## 创建Vitess集群

从项目自带的vitess相关的yaml信息，可以创建出一个初始化的vitess集群。
```sh
#kubectl apply -f 101_initial_cluster.yaml -nxzq
vitesscluster.planetscale.com/example created
secret/example-cluster-config created
```

获取此刻vitess相关资源信息如下：
```sh
#sh get_resoure.sh
NAME                                                 READY   STATUS    RESTARTS   AGE     IP                NODE      NOMINATED NODE   READINESS GATES
pod/example-etcd-faf13de3-1                          1/1     Running   1          100s    101.244.217.179   qfusion   <none>           <none>
pod/example-etcd-faf13de3-2                          1/1     Running   1          100s    101.244.217.135   qfusion   <none>           <none>
pod/example-etcd-faf13de3-3                          1/1     Running   1          100s    101.244.217.176   qfusion   <none>           <none>
pod/example-vttablet-zone1-2469782763-bfadd780       3/3     Running   2          100s    101.244.217.149   qfusion   <none>           <none>
pod/example-vttablet-zone1-2548885007-46a852d0       3/3     Running   3          100s    101.244.217.182   qfusion   <none>           <none>
pod/example-zone1-vtctld-1d4dcad0-cf87d58cb-r2cvg    1/1     Running   2          100s    101.244.217.185   qfusion   <none>           <none>
pod/example-zone1-vtgate-bc6cde92-685d69cc5c-4w54k   1/1     Running   3          100s    101.244.217.140   qfusion   <none>           <none>
pod/vitess-operator-6b495ddbb-cq988                  1/1     Running   3          2d21h   101.244.217.248   qfusion   <none>           <none>

NAME                                    TYPE        CLUSTER-IP        EXTERNAL-IP   PORT(S)                        AGE    SELECTOR
service/example-etcd-faf13de3-client    ClusterIP   101.97.55.121     <none>        2379/TCP                       100s   etcd.planetscale.com/lockserver=example-etcd-faf13de3
service/example-etcd-faf13de3-peer      ClusterIP   None              <none>        2380/TCP                       100s   etcd.planetscale.com/lockserver=example-etcd-faf13de3
service/example-vtctld-625ee430         ClusterIP   101.99.245.244    <none>        15000/TCP,15999/TCP            100s   planetscale.com/cluster=example,planetscale.com/component=vtctld
service/example-vtgate-ae7df4b6         ClusterIP   101.102.28.49     <none>        15000/TCP,15999/TCP,3306/TCP   100s   planetscale.com/cluster=example,planetscale.com/component=vtgate
service/example-vttablet-08646a59       ClusterIP   None              <none>        15000/TCP,15999/TCP,9104/TCP   100s   planetscale.com/cluster=example,planetscale.com/component=vttablet
service/example-zone1-vtgate-bc6cde92   ClusterIP   101.106.170.227   <none>        15000/TCP,15999/TCP,3306/TCP   100s   planetscale.com/cell=zone1,planetscale.com/cluster=example,planetscale.com/component=vtgate

NAME                                                               STATUS   VOLUME           CAPACITY   ACCESS MODES   STORAGECLASS   AGE    VOLUMEMODE
persistentvolumeclaim/example-etcd-faf13de3-1                      Bound    pv-hostpath-12   10Gi       RWO                           100s   Filesystem
persistentvolumeclaim/example-etcd-faf13de3-2                      Bound    pv-hostpath-11   10Gi       RWO                           100s   Filesystem
persistentvolumeclaim/example-etcd-faf13de3-3                      Bound    pv-hostpath-13   10Gi       RWO                           100s   Filesystem
persistentvolumeclaim/example-vttablet-zone1-2469782763-bfadd780   Bound    pv-hostpath-2    10Gi       RWO                           100s   Filesystem
persistentvolumeclaim/example-vttablet-zone1-2548885007-46a852d0   Bound    pv-hostpath-9    10Gi       RWO                           100s   Filesystem
```

从vitess创建完成的资源信息可见，vitess集群部署时会有2个vttablet的实例，和3个etcd的实例，且这五个实例各自单独挂载一份local-pv.

下图为在vtvtld提供的可视化界面上得到的信息，两个vttablet实例是主备关系：
![image.png](/images/open-source/vitess/image2-vtvtld.png)

设置vtctlclient(release发布获取)和mysql以便于查看数据库信息：
```sh
alias vtctlclient="./vtctlclient -server=$(kubectl get svc -nxzq | grep example-vtctld-625ee430 | awk '{print $3}'):15999"
alias mysql="mysql -h $(kubectl get svc -nxzq | grep example-zone1-vtgate-bc6cde92 | awk '{print $3}') -P 3306 -u user"
```

设置Schema,此处操作是在commerce的keyspace中创建了三张表(product,customer和corder)并设置schema：
```sh
vtctlclient ApplySchema -sql="$(cat create_commerce_schema.sql)" commerce
vtctlclient ApplyVSchema -vschema="$(cat vschema_commerce_initial.json)" commerce
```

至此，即完成了vitess集群的初始化操作。

## 拆分键空间(垂直分库)

将commerce的keyspace中的三张表进行拆分，使product单独一个keyspace,而customer和corder在另一个名为customer的keyspace.

### 初始化commerce的keyspace

初始化commerce内容，通过如下指令向commerce的keyspace中插入数据：
```sh
#cat ../common/insert_commerce_data.sql
insert into customer(email) values('alice@domain.com');
insert into customer(email) values('bob@domain.com');
insert into customer(email) values('charlie@domain.com');
insert into customer(email) values('dan@domain.com');
insert into customer(email) values('eve@domain.com');
insert into product(sku, description, price) values('SKU-1001', 'Monitor', 100);
insert into product(sku, description, price) values('SKU-1002', 'Keyboard', 30);
insert into corder(customer_id, sku, price) values(1, 'SKU-1001', 100);
insert into corder(customer_id, sku, price) values(2, 'SKU-1002', 30);
insert into corder(customer_id, sku, price) values(3, 'SKU-1002', 30);
insert into corder(customer_id, sku, price) values(4, 'SKU-1002', 30);
insert into corder(customer_id, sku, price) values(5, 'SKU-1002', 30);

#mysql < ../common/insert_commerce_data.sql

#mysql --table < select_commerce_data.sql
Using commerce
Customer
+-------------+--------------------+
| customer_id | email              |
+-------------+--------------------+
|           1 | alice@domain.com   |
|           2 | bob@domain.com     |
|           3 | charlie@domain.com |
|           4 | dan@domain.com     |
|           5 | eve@domain.com     |
+-------------+--------------------+
Product
+----------+-------------+-------+
| sku      | description | price |
+----------+-------------+-------+
| SKU-1001 | Monitor     |   100 |
| SKU-1002 | Keyboard    |    30 |
+----------+-------------+-------+
COrder
+----------+-------------+----------+-------+
| order_id | customer_id | sku      | price |
+----------+-------------+----------+-------+
|        1 |           1 | SKU-1001 |   100 |
|        2 |           2 | SKU-1002 |    30 |
|        3 |           3 | SKU-1002 |    30 |
|        4 |           4 | SKU-1002 |    30 |
|        5 |           5 | SKU-1002 |    30 |
+----------+-------------+----------+-------+
```

查看vitess的tablets信息，可知当前运行两个tablets实例：
```sh
# echo "show vitess_tablets;" | mysql --table
+-------+----------+-------+------------+---------+------------------+-----------------+
| Cell  | Keyspace | Shard | TabletType | State   | Alias            | Hostname        |
+-------+----------+-------+------------+---------+------------------+-----------------+
| zone1 | commerce | -     | MASTER     | SERVING | zone1-2548885007 | 101.244.217.182 |
| zone1 | commerce | -     | REPLICA    | SERVING | zone1-2469782763 | 101.244.217.149 |
+-------+----------+-------+------------+---------+------------------+-----------------+
```

### 创建新的keyspace

创建新的名为customer的keyspace:
```sh
#kubectl apply -f 201_customer_tablets.yaml -nxzq
vitesscluster.planetscale.com/example configured
```

201_customer_tablets.yaml和101_initial_cluster.yaml相比,多出如下信息：
```sh
keyspaces:
  ……
- name: customer
    turndownPolicy: Immediate
    partitionings:
    - equal:
        parts: 1
        shardTemplate:
          databaseInitScriptSecret:
            name: example-cluster-config
            key: init_db.sql
          replication:
            enforceSemiSync: false
          tabletPools:
          - cell: zone1
            type: replica
            replicas: 2
            vttablet:
              extraFlags:
                db_charset: utf8mb4
              resources:
                requests:
                  cpu: 100m
                  memory: 256Mi
            mysqld:
              resources:
                requests:
                  cpu: 100m
                  memory: 256Mi
            dataVolumeClaimTemplate:
              accessModes: ["ReadWriteOnce"]
              resources:
                requests:
                  storage: 10Gi
```

更新完成后，重新获取资源如下：
```sh
#sh get_resoure.sh
NAME                                                 READY   STATUS    RESTARTS   AGE     IP                NODE      NOMINATED NODE   READINESS GATES
pod/example-etcd-faf13de3-1                          1/1     Running   1          59m     101.244.217.179   qfusion   <none>           <none>
pod/example-etcd-faf13de3-2                          1/1     Running   1          59m     101.244.217.135   qfusion   <none>           <none>
pod/example-etcd-faf13de3-3                          1/1     Running   1          59m     101.244.217.176   qfusion   <none>           <none>
pod/example-vttablet-zone1-1250593518-17c58396       3/3     Running   1          3m37s   101.244.217.239   qfusion   <none>           <none>
pod/example-vttablet-zone1-2469782763-bfadd780       3/3     Running   2          59m     101.244.217.149   qfusion   <none>           <none>
pod/example-vttablet-zone1-2548885007-46a852d0       3/3     Running   3          59m     101.244.217.182   qfusion   <none>           <none>
pod/example-vttablet-zone1-3778123133-6f4ed5fc       3/3     Running   1          3m37s   101.244.217.241   qfusion   <none>           <none>
pod/example-zone1-vtctld-1d4dcad0-cf87d58cb-r2cvg    1/1     Running   2          59m     101.244.217.185   qfusion   <none>           <none>
pod/example-zone1-vtgate-bc6cde92-685d69cc5c-4w54k   1/1     Running   3          59m     101.244.217.140   qfusion   <none>           <none>
pod/vitess-operator-6b495ddbb-cq988                  1/1     Running   3          2d22h   101.244.217.248   qfusion   <none>           <none>

NAME                                    TYPE        CLUSTER-IP        EXTERNAL-IP   PORT(S)                        AGE   SELECTOR
service/example-etcd-faf13de3-client    ClusterIP   101.97.55.121     <none>        2379/TCP                       59m   etcd.planetscale.com/lockserver=example-etcd-faf13de3
service/example-etcd-faf13de3-peer      ClusterIP   None              <none>        2380/TCP                       59m   etcd.planetscale.com/lockserver=example-etcd-faf13de3
service/example-vtctld-625ee430         ClusterIP   101.99.245.244    <none>        15000/TCP,15999/TCP            59m   planetscale.com/cluster=example,planetscale.com/component=vtctld
service/example-vtgate-ae7df4b6         ClusterIP   101.102.28.49     <none>        15000/TCP,15999/TCP,3306/TCP   59m   planetscale.com/cluster=example,planetscale.com/component=vtgate
service/example-vttablet-08646a59       ClusterIP   None              <none>        15000/TCP,15999/TCP,9104/TCP   59m   planetscale.com/cluster=example,planetscale.com/component=vttablet
service/example-zone1-vtgate-bc6cde92   ClusterIP   101.106.170.227   <none>        15000/TCP,15999/TCP,3306/TCP   59m   planetscale.com/cell=zone1,planetscale.com/cluster=example,planetscale.com/component=vtgate

NAME                                                               STATUS   VOLUME           CAPACITY   ACCESS MODES   STORAGECLASS   AGE     VOLUMEMODE
persistentvolumeclaim/example-etcd-faf13de3-1                      Bound    pv-hostpath-12   10Gi       RWO                           59m     Filesystem
persistentvolumeclaim/example-etcd-faf13de3-2                      Bound    pv-hostpath-11   10Gi       RWO                           59m     Filesystem
persistentvolumeclaim/example-etcd-faf13de3-3                      Bound    pv-hostpath-13   10Gi       RWO                           59m     Filesystem
persistentvolumeclaim/example-vttablet-zone1-1250593518-17c58396   Bound    pv-hostpath-7    10Gi       RWO                           3m37s   Filesystem
persistentvolumeclaim/example-vttablet-zone1-2469782763-bfadd780   Bound    pv-hostpath-2    10Gi       RWO                           59m     Filesystem
persistentvolumeclaim/example-vttablet-zone1-2548885007-46a852d0   Bound    pv-hostpath-9    10Gi       RWO                           59m     Filesystem
persistentvolumeclaim/example-vttablet-zone1-3778123133-6f4ed5fc   Bound    pv-hostpath-10   10Gi       RWO                           3m37s   Filesystem
```

相比于创建Vitess集群时的资源，多出了两个vttablet的pod和两个pvc.

查看vitess的tablets信息，可知当前运行四个tablets实例：
```sh
# echo "show vitess_tablets;" | mysql --table
+-------+----------+-------+------------+---------+------------------+-----------------+
| Cell  | Keyspace | Shard | TabletType | State   | Alias            | Hostname        |
+-------+----------+-------+------------+---------+------------------+-----------------+
| zone1 | commerce | -     | MASTER     | SERVING | zone1-2548885007 | 101.244.217.182 |
| zone1 | commerce | -     | REPLICA    | SERVING | zone1-2469782763 | 101.244.217.149 |
| zone1 | customer | -     | MASTER     | SERVING | zone1-1250593518 | 101.244.217.239 |
| zone1 | customer | -     | REPLICA    | SERVING | zone1-3778123133 | 101.244.217.241 |
+-------+----------+-------+------------+---------+------------------+-----------------+
```

### 开始移动操作

Vitess的移动表操作实际上是复制操作，在此期间，对于数据库的读写操作无影响，通过如下指令开始移动操作：
```sh
vtctlclient MoveTables -workflow=commerce2customer commerce customer '{"customer":{}, "corder":{}}'
```

此时查看路由可发现，数据库指向customer表和corder表的操作均会分配到commerce的keyspace:
```sh
#vtctlclient GetRoutingRules commerce
{
  "rules": [
    {
      "fromTable": "customer",
      "toTables": [
        "commerce.customer"
      ]
    },
    {
      "fromTable": "customer.customer",
      "toTables": [
        "commerce.customer"
      ]
    },
    {
      "fromTable": "corder",
      "toTables": [
        "commerce.corder"
      ]
    },
    {
      "fromTable": "customer.corder",
      "toTables": [
        "commerce.corder"
      ]
    }
  ]
}
```

### 查看移动进度

当表的数据非常大的时候，表的移动操作会耗时较久，此时可通过如下指令查看具体进度：
```sh
vtctlclient VReplicationExec zone1-0000000200 "select * from _vt.copy_state"
```

可通过如下指令查看表数据同步情况：
```sh
#vtctlclient VDiff customer.commerce2customer
Summary for corder: {ProcessedRows:5 MatchingRows:5 MismatchedRows:0 ExtraRowsSource:0 ExtraRowsTarget:0}
Summary for customer: {ProcessedRows:5 MatchingRows:5 MismatchedRows:0 ExtraRowsSource:0 ExtraRowsTarget:0}
```

### 转移读取路由

在同步好customer的keyspace数据之后,可以将对customer表和corder表的读取操作全部从commerce的keyspace转移过来并查看路由信息：
```sh
#vtctlclient SwitchReads -tablet_type=rdonly customer.commerce2customer
#vtctlclient SwitchReads -tablet_type=replica customer.commerce2customer
#vtctlclient GetRoutingRules commerce
{
  "rules": [
    {
      "fromTable": "customer@rdonly",
      "toTables": [
        "customer.customer"
      ]
    },
    {
      "fromTable": "commerce.customer@rdonly",
      "toTables": [
        "customer.customer"
      ]
    },
    {
      "fromTable": "customer.corder@replica",
      "toTables": [
        "customer.corder"
      ]
    },
    {
      "fromTable": "commerce.corder@replica",
      "toTables": [
        "customer.corder"
      ]
    },
    {
      "fromTable": "customer.customer@replica",
      "toTables": [
        "customer.customer"
      ]
    },
    {
      "fromTable": "customer",
      "toTables": [
        "commerce.customer"
      ]
    },
    {
      "fromTable": "customer.corder",
      "toTables": [
        "commerce.corder"
      ]
    },
    {
      "fromTable": "commerce.corder@rdonly",
      "toTables": [
        "customer.corder"
      ]
    },
    {
      "fromTable": "customer.customer@rdonly",
      "toTables": [
        "customer.customer"
      ]
    },
    {
      "fromTable": "corder@replica",
      "toTables": [
        "customer.corder"
      ]
    },
    {
      "fromTable": "commerce.customer@replica",
      "toTables": [
        "customer.customer"
      ]
    },
    {
      "fromTable": "customer.corder@rdonly",
      "toTables": [
        "customer.corder"
      ]
    },
    {
      "fromTable": "customer.customer",
      "toTables": [
        "commerce.customer"
      ]
    },
    {
      "fromTable": "corder",
      "toTables": [
        "commerce.corder"
      ]
    },
    {
      "fromTable": "corder@rdonly",
      "toTables": [
        "customer.corder"
      ]
    },
    {
      "fromTable": "customer@replica",
      "toTables": [
        "customer.customer"
      ]
    }
  ]
}
```

### 转移写路由

将对customer表和corder表的写操作从commerce的keyspace转移过来并查看路由信息：
```sh
#vtctlclient SwitchWrites customer.commerce2customer
#vtctlclient GetRoutingRules commerce
{
  "rules": [
    {
      "fromTable": "commerce.customer",
      "toTables": [
        "customer.customer"
      ]
    },
    {
      "fromTable": "customer",
      "toTables": [
        "customer.customer"
      ]
    },
    {
      "fromTable": "commerce.corder",
      "toTables": [
        "customer.corder"
      ]
    },
    {
      "fromTable": "corder",
      "toTables": [
        "customer.corder"
      ]
    }
  ]
}
```

至此，vitess集群中原先commerce的keyspace中关于customer表和corder表的所有操作都将路由到新创建的customer的keyspace中，且在整个转移过程中，Vitess会自动创建一个反向工作流，将对customer表和corder表有修改的操作同步到commerce的keyspace中，因此，假如转移过程中出现了故障，原commerce的keyspace也能保证不丢失数据。

### 丢弃源数据

在完成customer表和corder表数据转移和操作权限转移之后，需要将commerce的keyspace中的customer表和corder表移除，可通过以下指令来完成(需要将../common/select_commerce_data.sql文件中的commerce/0改为commerce/-，因为operator部署的commerce默认分片名称是-)：
```sh
 vtctlclient DropSources customer.commerce2customer
 #mysql --table < ../common/select_commerce_data.sql
Using commerce/-
Customer
ERROR 1146 (42S02) at line 4: vtgate: http://example-zone1-vtgate-bc6cde92-685d69cc5c-4w54k:15000/: target: commerce.-.master, used tablet: zone1-2548885007 (101.244.217.182): vttablet: rpc error: code = NotFound desc = Table 'vt_commerce.customer' doesn't exist (errno 1146) (sqlstate 42S02) (CallerID: user): Sql: "select * from customer", BindVars: {}
```

至此，完成了将一个keyspace中的表移动到另一个keyspace的操作。

## keyspace分片(水平分表)

Vitess中的每个实例可视为一个分片(shard),将单个实例数据水平拆分在Vitess中被称为重新分片(resharding)。

### 顺序

在进行水平分表的时候，常常涉及到自增长的列，此时需要通过设置Vitess集群中的VShema来指定自增长规则，在Vitess的实现中，可使用指定表中表示顺序的列来替代自增长属性，当有数据插入时，自增长的列会从这个表示顺序的列中取出来一个值来代替自增长的值。

以下指令创建了customer_seq表和order_seq表作为sequence表并声明相应的VSchema:
```sh
#cat create_commerce_seq.sql
create table customer_seq(id int, next_id bigint, cache bigint, primary key(id)) comment 'vitess_sequence';
insert into customer_seq(id, next_id, cache) values(0, 1000, 100);
create table order_seq(id int, next_id bigint, cache bigint, primary key(id)) comment 'vitess_sequence';
insert into order_seq(id, next_id, cache) values(0, 1000, 100);

#vtctlclient ApplySchema -sql="$(cat create_commerce_seq.sql)" commerce

#vtctlclient ApplyVSchema -vschema="$(cat vschema_commerce_seq.json)" commerce
New VSchema object:
{
  "tables": {
    "customer_seq": {
      "type": "sequence"
    },
    "order_seq": {
      "type": "sequence"
    },
    "product": {

    }
  }
}
If this is not what you expected, check the input data (as JSON parsing will skip unexpected fields).

#cat create_customer_sharded.sql
alter table customer change customer_id customer_id bigint not null;
alter table corder change order_id order_id bigint not null;

#vtctlclient ApplySchema -sql="$(cat create_customer_sharded.sql)" customer

```

### Vindexes

Vindexes可以理解为水平分表之后的分布式索引，便于vttablet快速进行查询等操作，其根据选择的列的数据类型可以有以下选择：
- 对于BIGINT列，请使用hash;
- 对于VARCHAR列，请使用unicode_loose_md5或unicode_loose_xxhash；
- 对于VARBINARY，使用binary_md5或xxhash.

执行如下语句，应用VShema指定corder表和customer表的Vindexes和自增长规则：
```sh
#vtctlclient ApplyVSchema -vschema="$(cat vschema_customer_sharded.json)" customer
New VSchema object:
{
  "sharded": true,
  "vindexes": {
    "hash": {
      "type": "hash"
    }
  },
  "tables": {
    "corder": {
      "columnVindexes": [
        {
          "column": "customer_id",
          "name": "hash"
        }
      ],
      "autoIncrement": {
        "column": "order_id",
        "sequence": "order_seq"
      }
    },
    "customer": {
      "columnVindexes": [
        {
          "column": "customer_id",
          "name": "hash"
        }
      ],
      "autoIncrement": {
        "column": "customer_id",
        "sequence": "customer_seq"
      }
    }
  }
}
If this is not what you expected, check the input data (as JSON parsing will skip unexpected fields).
```

应用VSchema就表示原keyspace已分片，如果此时出现查询有失败情况发生，则可以将VSchema还原，修复所有查询后再进行分片。

### 创建新的分片

执行如下指令，为customer的keyspace添加新的分片：
```sh
#kubectl apply -f 302_new_shards.yaml -nxzq
vitesscluster.planetscale.com/example configured
```

302_new_shards.yaml文件和201_customer_tablets.yaml区别在于多出了如下内容：
```sh
  keyspaces:
  ……
    - name: customer
    ……
      partitionings:
      - equal:
          parts: 2
          shardTemplate:
            databaseInitScriptSecret:
              name: example-cluster-config
              key: init_db.sql
            replication:
              enforceSemiSync: false
            tabletPools:
            - cell: zone1
              type: replica
              replicas: 2
              vttablet:
                extraFlags:
                  db_charset: utf8mb4
                resources:
                  requests:
                    cpu: 100m
                    memory: 256Mi
              mysqld:
                resources:
                  requests:
                    cpu: 100m
                    memory: 256Mi
              dataVolumeClaimTemplate:
                accessModes: ["ReadWriteOnce"]
                resources:
                  requests:
                    storage: 10Gi
```

更新完成后，资源如下：
```sh
#sh get_resoure.sh
NAME                                                 READY   STATUS    RESTARTS   AGE     IP                NODE      NOMINATED NODE   READINESS GATES
pod/example-etcd-faf13de3-1                          1/1     Running   1          17h     101.244.217.179   qfusion   <none>           <none>
pod/example-etcd-faf13de3-2                          1/1     Running   1          17h     101.244.217.135   qfusion   <none>           <none>
pod/example-etcd-faf13de3-3                          1/1     Running   1          17h     101.244.217.176   qfusion   <none>           <none>
pod/example-vttablet-zone1-0118374573-10d08e80       3/3     Running   1          8m46s   101.244.218.29    qfusion   <none>           <none>
pod/example-vttablet-zone1-0120139806-fed29577       3/3     Running   1          8m46s   101.244.218.25    qfusion   <none>           <none>
pod/example-vttablet-zone1-1250593518-17c58396       3/3     Running   1          16h     101.244.217.239   qfusion   <none>           <none>
pod/example-vttablet-zone1-2289928654-7de47379       3/3     Running   1          8m46s   101.244.218.26    qfusion   <none>           <none>
pod/example-vttablet-zone1-2469782763-bfadd780       3/3     Running   2          17h     101.244.217.149   qfusion   <none>           <none>
pod/example-vttablet-zone1-2548885007-46a852d0       3/3     Running   3          17h     101.244.217.182   qfusion   <none>           <none>
pod/example-vttablet-zone1-3778123133-6f4ed5fc       3/3     Running   1          16h     101.244.217.241   qfusion   <none>           <none>
pod/example-vttablet-zone1-4277914223-0f04a9a6       3/3     Running   1          8m46s   101.244.218.35    qfusion   <none>           <none>
pod/example-zone1-vtctld-1d4dcad0-cf87d58cb-r2cvg    1/1     Running   2          17h     101.244.217.185   qfusion   <none>           <none>
pod/example-zone1-vtgate-bc6cde92-685d69cc5c-4w54k   1/1     Running   3          17h     101.244.217.140   qfusion   <none>           <none>
pod/vitess-operator-6b495ddbb-cq988                  1/1     Running   3          3d15h   101.244.217.248   qfusion   <none>           <none>

NAME                                    TYPE        CLUSTER-IP        EXTERNAL-IP   PORT(S)                        AGE   SELECTOR
service/example-etcd-faf13de3-client    ClusterIP   101.97.55.121     <none>        2379/TCP                       17h   etcd.planetscale.com/lockserver=example-etcd-faf13de3
service/example-etcd-faf13de3-peer      ClusterIP   None              <none>        2380/TCP                       17h   etcd.planetscale.com/lockserver=example-etcd-faf13de3
service/example-vtctld-625ee430         ClusterIP   101.99.245.244    <none>        15000/TCP,15999/TCP            17h   planetscale.com/cluster=example,planetscale.com/component=vtctld
service/example-vtgate-ae7df4b6         ClusterIP   101.102.28.49     <none>        15000/TCP,15999/TCP,3306/TCP   17h   planetscale.com/cluster=example,planetscale.com/component=vtgate
service/example-vttablet-08646a59       ClusterIP   None              <none>        15000/TCP,15999/TCP,9104/TCP   17h   planetscale.com/cluster=example,planetscale.com/component=vttablet
service/example-zone1-vtgate-bc6cde92   ClusterIP   101.106.170.227   <none>        15000/TCP,15999/TCP,3306/TCP   17h   planetscale.com/cell=zone1,planetscale.com/cluster=example,planetscale.com/component=vtgate

NAME                                                               STATUS   VOLUME           CAPACITY   ACCESS MODES   STORAGECLASS   AGE     VOLUMEMODE
persistentvolumeclaim/example-etcd-faf13de3-1                      Bound    pv-hostpath-12   10Gi       RWO                           17h     Filesystem
persistentvolumeclaim/example-etcd-faf13de3-2                      Bound    pv-hostpath-11   10Gi       RWO                           17h     Filesystem
persistentvolumeclaim/example-etcd-faf13de3-3                      Bound    pv-hostpath-13   10Gi       RWO                           17h     Filesystem
persistentvolumeclaim/example-vttablet-zone1-0118374573-10d08e80   Bound    pv-hostpath-1    10Gi       RWO                           8m46s   Filesystem
persistentvolumeclaim/example-vttablet-zone1-0120139806-fed29577   Bound    pv-hostpath-4    10Gi       RWO                           8m46s   Filesystem
persistentvolumeclaim/example-vttablet-zone1-1250593518-17c58396   Bound    pv-hostpath-7    10Gi       RWO                           16h     Filesystem
persistentvolumeclaim/example-vttablet-zone1-2289928654-7de47379   Bound    pv-hostpath-3    10Gi       RWO                           8m46s   Filesystem
persistentvolumeclaim/example-vttablet-zone1-2469782763-bfadd780   Bound    pv-hostpath-2    10Gi       RWO                           17h     Filesystem
persistentvolumeclaim/example-vttablet-zone1-2548885007-46a852d0   Bound    pv-hostpath-9    10Gi       RWO                           17h     Filesystem
persistentvolumeclaim/example-vttablet-zone1-3778123133-6f4ed5fc   Bound    pv-hostpath-10   10Gi       RWO                           16h     Filesystem
persistentvolumeclaim/example-vttablet-zone1-4277914223-0f04a9a6   Bound    pv-hostpath-6    10Gi       RWO                           8m46s   Filesystem

```

可见比起拆分键空间(垂直分库)时多出了4个vttablet的pod,查看此刻的vttablets如下：
```sh
# echo "show vitess_tablets;" | mysql --table
+-------+----------+-------+------------+---------+------------------+-----------------+
| Cell  | Keyspace | Shard | TabletType | State   | Alias            | Hostname        |
+-------+----------+-------+------------+---------+------------------+-----------------+
| zone1 | commerce | -     | MASTER     | SERVING | zone1-2548885007 | 101.244.217.182 |
| zone1 | commerce | -     | REPLICA    | SERVING | zone1-2469782763 | 101.244.217.149 |
| zone1 | customer | -     | MASTER     | SERVING | zone1-1250593518 | 101.244.217.239 |
| zone1 | customer | -     | REPLICA    | SERVING | zone1-3778123133 | 101.244.217.241 |
| zone1 | customer | -80   | MASTER     | SERVING | zone1-0120139806 | 101.244.218.25  |
| zone1 | customer | -80   | REPLICA    | SERVING | zone1-2289928654 | 101.244.218.26  |
| zone1 | customer | 80-   | MASTER     | SERVING | zone1-0118374573 | 101.244.218.29  |
| zone1 | customer | 80-   | REPLICA    | SERVING | zone1-4277914223 | 101.244.218.35  |
+-------+----------+-------+------------+---------+------------------+-----------------+
```

可见customer的keyspace多出了-80和80-两个片分区，各自分别有一个主备。

### 启动分片

执行如下语句，启动分片，即可将原分片内容分到两个新的分片中，并验证其正确性，此过程不会影响数据库的读写操作：
```sh
#vtctlclient Reshard customer.cust2cust '-' '-80,80-'

#vtctlclient VDiff customer.cust2cust
Summary for corder: {ProcessedRows:5 MatchingRows:5 MismatchedRows:0 ExtraRowsSource:0 ExtraRowsTarget:0}
Summary for customer: {ProcessedRows:5 MatchingRows:5 MismatchedRows:0 ExtraRowsSource:0 ExtraRowsTarget:0}
```

至此，可查询-分片、-80分片和80-分片中的内容,此处需要修改"../common/select_customer0_data.sql"文件，将其中的"customer/0"改为"customer/-"：
```sh
#mysql --table < ../common/select_customer0_data.sql
Using customer/-
Customer
+-------------+--------------------+
| customer_id | email              |
+-------------+--------------------+
|           1 | alice@domain.com   |
|           2 | bob@domain.com     |
|           3 | charlie@domain.com |
|           4 | dan@domain.com     |
|           5 | eve@domain.com     |
+-------------+--------------------+
COrder
+----------+-------------+----------+-------+
| order_id | customer_id | sku      | price |
+----------+-------------+----------+-------+
|        1 |           1 | SKU-1001 |   100 |
|        2 |           2 | SKU-1002 |    30 |
|        3 |           3 | SKU-1002 |    30 |
|        4 |           4 | SKU-1002 |    30 |
|        5 |           5 | SKU-1002 |    30 |
+----------+-------------+----------+-------+

#mysql --table < ../common/select_customer-80_data.sql
Using customer/-80
Customer
+-------------+--------------------+
| customer_id | email              |
+-------------+--------------------+
|           1 | alice@domain.com   |
|           2 | bob@domain.com     |
|           3 | charlie@domain.com |
|           5 | eve@domain.com     |
+-------------+--------------------+
COrder
+----------+-------------+----------+-------+
| order_id | customer_id | sku      | price |
+----------+-------------+----------+-------+
|        1 |           1 | SKU-1001 |   100 |
|        2 |           2 | SKU-1002 |    30 |
|        3 |           3 | SKU-1002 |    30 |
|        5 |           5 | SKU-1002 |    30 |
+----------+-------------+----------+-------+

#mysql --table < ../common/select_customer80-_data.sql
Using customer/80-
Customer
+-------------+----------------+
| customer_id | email          |
+-------------+----------------+
|           4 | dan@domain.com |
+-------------+----------------+
COrder
+----------+-------------+----------+-------+
| order_id | customer_id | sku      | price |
+----------+-------------+----------+-------+
|        4 |           4 | SKU-1002 |    30 |
+----------+-------------+----------+-------+
```

可见，customer/-分片中的数据已经被拆分到了customer/80-和customer/-80中。

### 切换读取

在完成分片之后需要将读取操作切换到新的切片中，指令如下：
```sh
vtctlclient SwitchReads -tablet_type=rdonly customer.cust2cust
vtctlclient SwitchReads -tablet_type=replica customer.cust2cust
```

### 切换写入

切换好读取权限之后将写操作也切换到新的切片中，指令如下：
```sh
vtctlclient SwitchWrites customer.cust2cust
```

### 清理原分片

在权限切换完成之后即可清理原分片数据
```sh
kubectl apply -f 306_down_shard_0.yaml -nxzq
```
    306_down_shard_0.yaml和302_new_shards.yaml相比，删除了如下部分：
```sh

  keyspaces:
	……
  - name: customer
	……
    partitionings:
    - equal:
        parts: 1
        shardTemplate:
          databaseInitScriptSecret:
            name: example-cluster-config
            key: init_db.sql
          replication:
            enforceSemiSync: false
          tabletPools:
          - cell: zone1
            type: replica
            replicas: 2
            vttablet:
              extraFlags:
                db_charset: utf8mb4
              resources:
                requests:
                  cpu: 100m
                  memory: 256Mi
            mysqld:
              resources:
                requests:
                  cpu: 100m
                  memory: 256Mi
            dataVolumeClaimTemplate:
              accessModes: ["ReadWriteOnce"]
              resources:
                requests:
                  storage: 10Gi
```

从yaml中少去的部分可知，清理操作是将customer原有的分片移除了，查看此时的资源如下：
```sh
#sh get_resoure.sh
NAME                                                 READY   STATUS    RESTARTS   AGE     IP                NODE      NOMINATED NODE   READINESS GATES
pod/example-etcd-faf13de3-1                          1/1     Running   1          18h     101.244.217.179   qfusion   <none>           <none>
pod/example-etcd-faf13de3-2                          1/1     Running   1          18h     101.244.217.135   qfusion   <none>           <none>
pod/example-etcd-faf13de3-3                          1/1     Running   1          18h     101.244.217.176   qfusion   <none>           <none>
pod/example-vttablet-zone1-0118374573-10d08e80       3/3     Running   0          32s     101.244.217.149   qfusion   <none>           <none>
pod/example-vttablet-zone1-0120139806-fed29577       3/3     Running   0          32s     101.244.217.241   qfusion   <none>           <none>
pod/example-vttablet-zone1-2289928654-7de47379       3/3     Running   1          56m     101.244.218.26    qfusion   <none>           <none>
pod/example-vttablet-zone1-2469782763-bfadd780       3/3     Running   0          32s     101.244.217.239   qfusion   <none>           <none>
pod/example-vttablet-zone1-2548885007-46a852d0       3/3     Running   3          18h     101.244.217.182   qfusion   <none>           <none>
pod/example-vttablet-zone1-4277914223-0f04a9a6       3/3     Running   1          56m     101.244.218.35    qfusion   <none>           <none>
pod/example-zone1-vtctld-1d4dcad0-cf87d58cb-r2cvg    1/1     Running   2          18h     101.244.217.185   qfusion   <none>           <none>
pod/example-zone1-vtgate-bc6cde92-685d69cc5c-4w54k   1/1     Running   3          18h     101.244.217.140   qfusion   <none>           <none>
pod/vitess-operator-6b495ddbb-cq988                  1/1     Running   3          3d16h   101.244.217.248   qfusion   <none>           <none>

NAME                                    TYPE        CLUSTER-IP        EXTERNAL-IP   PORT(S)                        AGE   SELECTOR
service/example-etcd-faf13de3-client    ClusterIP   101.97.55.121     <none>        2379/TCP                       18h   etcd.planetscale.com/lockserver=example-etcd-faf13de3
service/example-etcd-faf13de3-peer      ClusterIP   None              <none>        2380/TCP                       18h   etcd.planetscale.com/lockserver=example-etcd-faf13de3
service/example-vtctld-625ee430         ClusterIP   101.99.245.244    <none>        15000/TCP,15999/TCP            18h   planetscale.com/cluster=example,planetscale.com/component=vtctld
service/example-vtgate-ae7df4b6         ClusterIP   101.102.28.49     <none>        15000/TCP,15999/TCP,3306/TCP   18h   planetscale.com/cluster=example,planetscale.com/component=vtgate
service/example-vttablet-08646a59       ClusterIP   None              <none>        15000/TCP,15999/TCP,9104/TCP   18h   planetscale.com/cluster=example,planetscale.com/component=vttablet
service/example-zone1-vtgate-bc6cde92   ClusterIP   101.106.170.227   <none>        15000/TCP,15999/TCP,3306/TCP   18h   planetscale.com/cell=zone1,planetscale.com/cluster=example,planetscale.com/component=vtgate

NAME                                                               STATUS   VOLUME           CAPACITY   ACCESS MODES   STORAGECLASS   AGE   VOLUMEMODE
persistentvolumeclaim/example-etcd-faf13de3-1                      Bound    pv-hostpath-12   10Gi       RWO                           18h   Filesystem
persistentvolumeclaim/example-etcd-faf13de3-2                      Bound    pv-hostpath-11   10Gi       RWO                           18h   Filesystem
persistentvolumeclaim/example-etcd-faf13de3-3                      Bound    pv-hostpath-13   10Gi       RWO                           18h   Filesystem
persistentvolumeclaim/example-vttablet-zone1-0118374573-10d08e80   Bound    pv-hostpath-1    10Gi       RWO                           56m   Filesystem
persistentvolumeclaim/example-vttablet-zone1-0120139806-fed29577   Bound    pv-hostpath-4    10Gi       RWO                           56m   Filesystem
persistentvolumeclaim/example-vttablet-zone1-2289928654-7de47379   Bound    pv-hostpath-3    10Gi       RWO                           56m   Filesystem
persistentvolumeclaim/example-vttablet-zone1-2469782763-bfadd780   Bound    pv-hostpath-2    10Gi       RWO                           18h   Filesystem
persistentvolumeclaim/example-vttablet-zone1-2548885007-46a852d0   Bound    pv-hostpath-9    10Gi       RWO                           18h   Filesystem
persistentvolumeclaim/example-vttablet-zone1-4277914223-0f04a9a6   Bound    pv-hostpath-6    10Gi       RWO                           56m   Filesystem
```

可见少了两个vttablet的pod及其绑定的pvc,再查看vttablet的状态如下：
```sh
# echo "show vitess_tablets;" | mysql --table
+-------+----------+-------+------------+---------+------------------+-----------------+
| Cell  | Keyspace | Shard | TabletType | State   | Alias            | Hostname        |
+-------+----------+-------+------------+---------+------------------+-----------------+
| zone1 | commerce | -     | MASTER     | SERVING | zone1-2548885007 | 101.244.217.182 |
| zone1 | commerce | -     | REPLICA    | SERVING | zone1-2469782763 | 101.244.217.239 |
| zone1 | customer | -80   | MASTER     | SERVING | zone1-2289928654 | 101.244.218.26  |
| zone1 | customer | -80   | REPLICA    | SERVING | zone1-0120139806 | 101.244.217.241 |
| zone1 | customer | 80-   | MASTER     | SERVING | zone1-4277914223 | 101.244.218.35  |
| zone1 | customer | 80-   | REPLICA    | SERVING | zone1-0118374573 | 101.244.217.149 |
+-------+----------+-------+------------+---------+------------------+-----------------+
```

customer的keyspace原有的分片customer/-已经被移除。

### 清理元数据

最终，我们需要清除元数据，可通过执行一下数据完成清理：
```sh
vtctlclient DeleteShard -recursive customer/-
```
### 清理磁盘

最终，只需要将local-pv中的数据清理掉即可。

