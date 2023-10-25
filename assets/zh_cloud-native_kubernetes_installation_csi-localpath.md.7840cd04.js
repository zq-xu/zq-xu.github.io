import{_ as s,o as a,c as n,Q as e}from"./chunks/framework.48927342.js";const m=JSON.parse('{"title":"LocalPath CSI安装","description":"","frontmatter":{"date":"2022-12-28T00:00:00.000Z"},"headers":[],"relativePath":"zh/cloud-native/kubernetes/installation/csi-localpath.md","filePath":"zh/cloud-native/kubernetes/installation/csi-localpath.md"}'),p={name:"zh/cloud-native/kubernetes/installation/csi-localpath.md"},l=e(`<h1 id="localpath-csi安装" tabindex="-1">LocalPath CSI安装 <a class="header-anchor" href="#localpath-csi安装" aria-label="Permalink to &quot;LocalPath CSI安装&quot;">​</a></h1><p>在Kubernetes环境中，如果想使用本机路径作为为CSI提供的PV存在，则需要提供相应的Provisioner来为本机路径动态分配PV.</p><p>Kubernetes官方提供了<a href="https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner" target="_blank" rel="noreferrer">sig-storage-local-static-provisioner</a>动态绑定本机路径作为PV, 但需要预先在监听的本机路径下创建好挂载点(该路径下的子路径mount了磁盘或者其他路径)，无法动态供应本地卷(mount了几个子路径就是几个pv)，使用起来十分不便。</p><p>本文将介绍如何使用<a href="https://github.com/rancher/local-path-provisioner" target="_blank" rel="noreferrer">Local path provisioner</a>来实现使用本机路径绑定CSI动态分配PV.</p><h2 id="初始化本机磁盘" tabindex="-1">初始化本机磁盘 <a class="header-anchor" href="#初始化本机磁盘" aria-label="Permalink to &quot;初始化本机磁盘&quot;">​</a></h2><p>本小节介绍如何将一个磁盘初始化并挂载到指定路径。</p><p>如果你已经有了需要使用的路径，则可以跳过此小节。</p><p>如果你的Kubernetes环境对应了多个节点，则这些节点上都要准备相应的本机路径。</p><ol><li><p>使用”lsblk”指令查看本机磁盘现状：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">lsblk</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;"># 控制台输出</span></span>
<span class="line"><span style="color:#e1e4e8;">NAME            FSTYPE      LABEL UUID                                   MOUNTPOINT</span></span>
<span class="line"><span style="color:#e1e4e8;">nvme0n1         259:1    0  3.5T  0 disk</span></span>
<span class="line"><span style="color:#e1e4e8;">├─nvme0n1p1     259:2    0  200M  0 part /boot/efi</span></span>
<span class="line"><span style="color:#e1e4e8;">├─nvme0n1p2     259:3    0    1G  0 part /boot</span></span>
<span class="line"><span style="color:#e1e4e8;">└─nvme0n1p3     259:4    0  3.5T  0 part</span></span>
<span class="line"><span style="color:#e1e4e8;">  ├─centos-root 253:0    0   50G  0 lvm  /</span></span>
<span class="line"><span style="color:#e1e4e8;">  ├─centos-swap 253:1    0    4G  0 lvm</span></span>
<span class="line"><span style="color:#e1e4e8;">  └─centos-home 253:2    0  3.4T  0 lvm  /home</span></span>
<span class="line"><span style="color:#e1e4e8;">nvme1n1         259:0    0  3.5T  0 disk</span></span>
<span class="line"><span style="color:#e1e4e8;">├─nvme1n1p1     259:7    0 1024G  0 part</span></span>
<span class="line"><span style="color:#e1e4e8;">├─nvme1n1p2     259:8    0    1T  0 part</span></span>
<span class="line"><span style="color:#e1e4e8;">└─nvme1n1p3     259:9    0    1T  0 part</span></span>
<span class="line"><span style="color:#e1e4e8;">nvme2n1         259:5    0  3.5T  0 disk</span></span>
<span class="line"><span style="color:#e1e4e8;">nvme3n1         259:6    0  3.5T  0 disk</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">lsblk</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;"># 控制台输出</span></span>
<span class="line"><span style="color:#24292e;">NAME            FSTYPE      LABEL UUID                                   MOUNTPOINT</span></span>
<span class="line"><span style="color:#24292e;">nvme0n1         259:1    0  3.5T  0 disk</span></span>
<span class="line"><span style="color:#24292e;">├─nvme0n1p1     259:2    0  200M  0 part /boot/efi</span></span>
<span class="line"><span style="color:#24292e;">├─nvme0n1p2     259:3    0    1G  0 part /boot</span></span>
<span class="line"><span style="color:#24292e;">└─nvme0n1p3     259:4    0  3.5T  0 part</span></span>
<span class="line"><span style="color:#24292e;">  ├─centos-root 253:0    0   50G  0 lvm  /</span></span>
<span class="line"><span style="color:#24292e;">  ├─centos-swap 253:1    0    4G  0 lvm</span></span>
<span class="line"><span style="color:#24292e;">  └─centos-home 253:2    0  3.4T  0 lvm  /home</span></span>
<span class="line"><span style="color:#24292e;">nvme1n1         259:0    0  3.5T  0 disk</span></span>
<span class="line"><span style="color:#24292e;">├─nvme1n1p1     259:7    0 1024G  0 part</span></span>
<span class="line"><span style="color:#24292e;">├─nvme1n1p2     259:8    0    1T  0 part</span></span>
<span class="line"><span style="color:#24292e;">└─nvme1n1p3     259:9    0    1T  0 part</span></span>
<span class="line"><span style="color:#24292e;">nvme2n1         259:5    0  3.5T  0 disk</span></span>
<span class="line"><span style="color:#24292e;">nvme3n1         259:6    0  3.5T  0 disk</span></span></code></pre></div><p>可以看到当前磁盘“nvme2n1”和“nvme3n1”空闲，以下将把磁盘“nvme2n1”分为一个分区并挂载到本机路径“/localpv”下，并用于后续的PV的分配；</p></li><li><p>使用”parted”指定对磁盘“nvme2n1”进行分区：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">parted -s /dev/nvme2n1 mklabel gpt mkpart primary  0 3.5TB</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">lsblk</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;"># 控制台输出</span></span>
<span class="line"><span style="color:#e1e4e8;">NAME            FSTYPE      LABEL UUID                                   MOUNTPOINT</span></span>
<span class="line"><span style="color:#e1e4e8;">nvme0n1         259:1    0  3.5T  0 disk</span></span>
<span class="line"><span style="color:#e1e4e8;">├─nvme0n1p1     259:2    0  200M  0 part /boot/efi</span></span>
<span class="line"><span style="color:#e1e4e8;">├─nvme0n1p2     259:3    0    1G  0 part /boot</span></span>
<span class="line"><span style="color:#e1e4e8;">└─nvme0n1p3     259:4    0  3.5T  0 part</span></span>
<span class="line"><span style="color:#e1e4e8;">  ├─centos-root 253:0    0   50G  0 lvm  /</span></span>
<span class="line"><span style="color:#e1e4e8;">  ├─centos-swap 253:1    0    4G  0 lvm</span></span>
<span class="line"><span style="color:#e1e4e8;">  └─centos-home 253:2    0  3.4T  0 lvm  /home</span></span>
<span class="line"><span style="color:#e1e4e8;">nvme1n1         259:0    0  3.5T  0 disk</span></span>
<span class="line"><span style="color:#e1e4e8;">├─nvme1n1p1     259:7    0 1024G  0 part</span></span>
<span class="line"><span style="color:#e1e4e8;">├─nvme1n1p2     259:8    0    1T  0 part</span></span>
<span class="line"><span style="color:#e1e4e8;">└─nvme1n1p3     259:9    0    1T  0 part</span></span>
<span class="line"><span style="color:#e1e4e8;">nvme2n1         259:5    0  3.5T  0 disk</span></span>
<span class="line"><span style="color:#e1e4e8;">└─nvme2n1p1     259:10   0  3.5T  0 part </span></span>
<span class="line"><span style="color:#e1e4e8;">nvme3n1         259:6    0  3.5T  0 disk</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">parted -s /dev/nvme2n1 mklabel gpt mkpart primary  0 3.5TB</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">lsblk</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;"># 控制台输出</span></span>
<span class="line"><span style="color:#24292e;">NAME            FSTYPE      LABEL UUID                                   MOUNTPOINT</span></span>
<span class="line"><span style="color:#24292e;">nvme0n1         259:1    0  3.5T  0 disk</span></span>
<span class="line"><span style="color:#24292e;">├─nvme0n1p1     259:2    0  200M  0 part /boot/efi</span></span>
<span class="line"><span style="color:#24292e;">├─nvme0n1p2     259:3    0    1G  0 part /boot</span></span>
<span class="line"><span style="color:#24292e;">└─nvme0n1p3     259:4    0  3.5T  0 part</span></span>
<span class="line"><span style="color:#24292e;">  ├─centos-root 253:0    0   50G  0 lvm  /</span></span>
<span class="line"><span style="color:#24292e;">  ├─centos-swap 253:1    0    4G  0 lvm</span></span>
<span class="line"><span style="color:#24292e;">  └─centos-home 253:2    0  3.4T  0 lvm  /home</span></span>
<span class="line"><span style="color:#24292e;">nvme1n1         259:0    0  3.5T  0 disk</span></span>
<span class="line"><span style="color:#24292e;">├─nvme1n1p1     259:7    0 1024G  0 part</span></span>
<span class="line"><span style="color:#24292e;">├─nvme1n1p2     259:8    0    1T  0 part</span></span>
<span class="line"><span style="color:#24292e;">└─nvme1n1p3     259:9    0    1T  0 part</span></span>
<span class="line"><span style="color:#24292e;">nvme2n1         259:5    0  3.5T  0 disk</span></span>
<span class="line"><span style="color:#24292e;">└─nvme2n1p1     259:10   0  3.5T  0 part </span></span>
<span class="line"><span style="color:#24292e;">nvme3n1         259:6    0  3.5T  0 disk</span></span></code></pre></div><p>磁盘“nvme2n1”分区之后得到一个分区“nvme2n1p1”；</p></li><li><p>格式化磁盘“nvme2n1”分区之后得到的分区“nvme2n1p1”：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">mkfs.ext4 /dev/nvme2n1p1</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">mkfs.ext4 /dev/nvme2n1p1</span></span></code></pre></div></li><li><p>将初始化之后的“nvme2n1p1”挂载到本机路径“/localpv”：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">mount /dev/nvme2n1p1 /localpv</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">lsblk</span></span>
<span class="line"><span style="color:#e1e4e8;">NAME            MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT</span></span>
<span class="line"><span style="color:#e1e4e8;">nvme0n1         259:1    0  3.5T  0 disk</span></span>
<span class="line"><span style="color:#e1e4e8;">├─nvme0n1p1     259:2    0  200M  0 part /boot/efi</span></span>
<span class="line"><span style="color:#e1e4e8;">├─nvme0n1p2     259:3    0    1G  0 part /boot</span></span>
<span class="line"><span style="color:#e1e4e8;">└─nvme0n1p3     259:4    0  3.5T  0 part</span></span>
<span class="line"><span style="color:#e1e4e8;">  ├─centos-root 253:0    0   50G  0 lvm  /</span></span>
<span class="line"><span style="color:#e1e4e8;">  ├─centos-swap 253:1    0    4G  0 lvm</span></span>
<span class="line"><span style="color:#e1e4e8;">  └─centos-home 253:2    0  3.4T  0 lvm  /home</span></span>
<span class="line"><span style="color:#e1e4e8;">nvme1n1         259:0    0  3.5T  0 disk</span></span>
<span class="line"><span style="color:#e1e4e8;">├─nvme1n1p1     259:7    0 1024G  0 part</span></span>
<span class="line"><span style="color:#e1e4e8;">├─nvme1n1p2     259:8    0    1T  0 part</span></span>
<span class="line"><span style="color:#e1e4e8;">└─nvme1n1p3     259:9    0    1T  0 part</span></span>
<span class="line"><span style="color:#e1e4e8;">nvme2n1         259:5    0  3.5T  0 disk</span></span>
<span class="line"><span style="color:#e1e4e8;">└─nvme2n1p1     259:10   0  3.5T  0 part /localpv</span></span>
<span class="line"><span style="color:#e1e4e8;">nvme3n1         259:6    0  3.5T  0 disk</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">mount /dev/nvme2n1p1 /localpv</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">lsblk</span></span>
<span class="line"><span style="color:#24292e;">NAME            MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT</span></span>
<span class="line"><span style="color:#24292e;">nvme0n1         259:1    0  3.5T  0 disk</span></span>
<span class="line"><span style="color:#24292e;">├─nvme0n1p1     259:2    0  200M  0 part /boot/efi</span></span>
<span class="line"><span style="color:#24292e;">├─nvme0n1p2     259:3    0    1G  0 part /boot</span></span>
<span class="line"><span style="color:#24292e;">└─nvme0n1p3     259:4    0  3.5T  0 part</span></span>
<span class="line"><span style="color:#24292e;">  ├─centos-root 253:0    0   50G  0 lvm  /</span></span>
<span class="line"><span style="color:#24292e;">  ├─centos-swap 253:1    0    4G  0 lvm</span></span>
<span class="line"><span style="color:#24292e;">  └─centos-home 253:2    0  3.4T  0 lvm  /home</span></span>
<span class="line"><span style="color:#24292e;">nvme1n1         259:0    0  3.5T  0 disk</span></span>
<span class="line"><span style="color:#24292e;">├─nvme1n1p1     259:7    0 1024G  0 part</span></span>
<span class="line"><span style="color:#24292e;">├─nvme1n1p2     259:8    0    1T  0 part</span></span>
<span class="line"><span style="color:#24292e;">└─nvme1n1p3     259:9    0    1T  0 part</span></span>
<span class="line"><span style="color:#24292e;">nvme2n1         259:5    0  3.5T  0 disk</span></span>
<span class="line"><span style="color:#24292e;">└─nvme2n1p1     259:10   0  3.5T  0 part /localpv</span></span>
<span class="line"><span style="color:#24292e;">nvme3n1         259:6    0  3.5T  0 disk</span></span></code></pre></div></li></ol><h2 id="安装local-path-provisioner" tabindex="-1">安装local-path-provisioner <a class="header-anchor" href="#安装local-path-provisioner" aria-label="Permalink to &quot;安装local-path-provisioner&quot;">​</a></h2><h3 id="获取安装文件" tabindex="-1">获取安装文件 <a class="header-anchor" href="#获取安装文件" aria-label="Permalink to &quot;获取安装文件&quot;">​</a></h3><p>配置好的安装文件如<a href="/downloads/cloud-native/kubernetes/installation/local-path-storage.yaml">LocalPath安装文件</a></p><p>该安装文件中配置StorageClass名称为默认值“local-path”，本机路径为“/localpv/local-path-provisioner”.<br> 以下将介绍该安装文件的获取方法和相关配置：</p><ol><li><p>从github上下载local-path-provisioner的安装文件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">wget https://raw.githubusercontent.com/rancher/local-path-provisioner/master/deploy/local-path-storage.yaml</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">wget https://raw.githubusercontent.com/rancher/local-path-provisioner/master/deploy/local-path-storage.yaml</span></span></code></pre></div></li><li><p>修改安装文件配置（详情可以参考<a href="https://github.com/rancher/local-path-provisioner#configuration" target="_blank" rel="noreferrer">local-path-provisioner配置</a>）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">修改分配PV的本机路径：</span></span>
<span class="line"><span style="color:#e1e4e8;">  找到名为&quot;local-path-config&quot;的ConfigMap资源，其data字段中有&quot;config.json&quot;，其中的&quot;paths&quot;即为分配的本机路径，如果配置多个，则分配PV时将在这几个路径中随机选取。</span></span>
<span class="line"><span style="color:#e1e4e8;">附件中配置的路径为&quot;/ssd/ssd0/localpv&quot;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">修改分配PV的本机路径：</span></span>
<span class="line"><span style="color:#24292e;">  找到名为&quot;local-path-config&quot;的ConfigMap资源，其data字段中有&quot;config.json&quot;，其中的&quot;paths&quot;即为分配的本机路径，如果配置多个，则分配PV时将在这几个路径中随机选取。</span></span>
<span class="line"><span style="color:#24292e;">附件中配置的路径为&quot;/ssd/ssd0/localpv&quot;</span></span></code></pre></div></li></ol><h3 id="部署local-path-provisioner" tabindex="-1">部署local-path-provisioner <a class="header-anchor" href="#部署local-path-provisioner" aria-label="Permalink to &quot;部署local-path-provisioner&quot;">​</a></h3><ol><li><p>在Kubernetes环境中部署：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">kubectl apply -f  local-path-storage.yaml</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">kubectl apply -f  local-path-storage.yaml</span></span></code></pre></div><p>local-path-provisioner对应的资源将会被部署到名为”local-path-storage”的namespace中；</p></li><li><p>查看部署的local-path-provisioner的pod：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">kubectl get po -n local-path-storage</span></span>
<span class="line"><span style="color:#e1e4e8;">NAME                                      READY   STATUS    RESTARTS   AGE</span></span>
<span class="line"><span style="color:#e1e4e8;">local-path-provisioner-556d4466c8-xc6jq   1/1     Running   0          1m</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">kubectl get po -n local-path-storage</span></span>
<span class="line"><span style="color:#24292e;">NAME                                      READY   STATUS    RESTARTS   AGE</span></span>
<span class="line"><span style="color:#24292e;">local-path-provisioner-556d4466c8-xc6jq   1/1     Running   0          1m</span></span></code></pre></div></li><li><p>查看部署的local-path-provisioner的StorageClass：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">kubectl get sc</span></span>
<span class="line"><span style="color:#e1e4e8;">NAME                        PROVISIONER                  RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE</span></span>
<span class="line"><span style="color:#e1e4e8;">local-path                  rancher.io/local-path        Delete          WaitForFirstConsumer   false                  1m</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">kubectl get sc</span></span>
<span class="line"><span style="color:#24292e;">NAME                        PROVISIONER                  RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE</span></span>
<span class="line"><span style="color:#24292e;">local-path                  rancher.io/local-path        Delete          WaitForFirstConsumer   false                  1m</span></span></code></pre></div><p>该结果表示StorageClass名称为”local-path”，当pod绑定指定了该StorageClass的PVC时才为相应的PVC动态分配PV.当PVC被删除时，相应的PV也会被删除。</p></li></ol><h2 id="验证部署结果" tabindex="-1">验证部署结果 <a class="header-anchor" href="#验证部署结果" aria-label="Permalink to &quot;验证部署结果&quot;">​</a></h2><p>当前Kubernetes环境中已经部署了local-path-provisioner，通过pod和pvc来验证local-path-provisioner是否能使用指定的本机路径动态分配pv.</p><h3 id="准备pod和pvc" tabindex="-1">准备Pod和PVC <a class="header-anchor" href="#准备pod和pvc" aria-label="Permalink to &quot;准备Pod和PVC&quot;">​</a></h3><ul><li><p>pod-test.yaml:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">apiVersion: v1</span></span>
<span class="line"><span style="color:#e1e4e8;">kind: Pod</span></span>
<span class="line"><span style="color:#e1e4e8;">metadata:</span></span>
<span class="line"><span style="color:#e1e4e8;">  name: volume-test</span></span>
<span class="line"><span style="color:#e1e4e8;">spec:</span></span>
<span class="line"><span style="color:#e1e4e8;">  containers:</span></span>
<span class="line"><span style="color:#e1e4e8;">  - name: volume-test</span></span>
<span class="line"><span style="color:#e1e4e8;">    image: nginx:stable-alpine</span></span>
<span class="line"><span style="color:#e1e4e8;">    imagePullPolicy: IfNotPresent</span></span>
<span class="line"><span style="color:#e1e4e8;">    volumeMounts:</span></span>
<span class="line"><span style="color:#e1e4e8;">    - name: volv</span></span>
<span class="line"><span style="color:#e1e4e8;">      mountPath: /data</span></span>
<span class="line"><span style="color:#e1e4e8;">    ports:</span></span>
<span class="line"><span style="color:#e1e4e8;">    - containerPort: 80</span></span>
<span class="line"><span style="color:#e1e4e8;">  volumes:</span></span>
<span class="line"><span style="color:#e1e4e8;">  - name: volv</span></span>
<span class="line"><span style="color:#e1e4e8;">    persistentVolumeClaim:</span></span>
<span class="line"><span style="color:#e1e4e8;">      claimName: local-path-pvc</span></span>
<span class="line"><span style="color:#e1e4e8;">  affinity:</span></span>
<span class="line"><span style="color:#e1e4e8;">    nodeAffinity:</span></span>
<span class="line"><span style="color:#e1e4e8;">      requiredDuringSchedulingIgnoredDuringExecution:</span></span>
<span class="line"><span style="color:#e1e4e8;">        nodeSelectorTerms:</span></span>
<span class="line"><span style="color:#e1e4e8;">        - matchExpressions:</span></span>
<span class="line"><span style="color:#e1e4e8;">          - key: kubernetes.io/hostname</span></span>
<span class="line"><span style="color:#e1e4e8;">            operator: In</span></span>
<span class="line"><span style="color:#e1e4e8;">            values:</span></span>
<span class="line"><span style="color:#e1e4e8;">            - ib-2</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">apiVersion: v1</span></span>
<span class="line"><span style="color:#24292e;">kind: Pod</span></span>
<span class="line"><span style="color:#24292e;">metadata:</span></span>
<span class="line"><span style="color:#24292e;">  name: volume-test</span></span>
<span class="line"><span style="color:#24292e;">spec:</span></span>
<span class="line"><span style="color:#24292e;">  containers:</span></span>
<span class="line"><span style="color:#24292e;">  - name: volume-test</span></span>
<span class="line"><span style="color:#24292e;">    image: nginx:stable-alpine</span></span>
<span class="line"><span style="color:#24292e;">    imagePullPolicy: IfNotPresent</span></span>
<span class="line"><span style="color:#24292e;">    volumeMounts:</span></span>
<span class="line"><span style="color:#24292e;">    - name: volv</span></span>
<span class="line"><span style="color:#24292e;">      mountPath: /data</span></span>
<span class="line"><span style="color:#24292e;">    ports:</span></span>
<span class="line"><span style="color:#24292e;">    - containerPort: 80</span></span>
<span class="line"><span style="color:#24292e;">  volumes:</span></span>
<span class="line"><span style="color:#24292e;">  - name: volv</span></span>
<span class="line"><span style="color:#24292e;">    persistentVolumeClaim:</span></span>
<span class="line"><span style="color:#24292e;">      claimName: local-path-pvc</span></span>
<span class="line"><span style="color:#24292e;">  affinity:</span></span>
<span class="line"><span style="color:#24292e;">    nodeAffinity:</span></span>
<span class="line"><span style="color:#24292e;">      requiredDuringSchedulingIgnoredDuringExecution:</span></span>
<span class="line"><span style="color:#24292e;">        nodeSelectorTerms:</span></span>
<span class="line"><span style="color:#24292e;">        - matchExpressions:</span></span>
<span class="line"><span style="color:#24292e;">          - key: kubernetes.io/hostname</span></span>
<span class="line"><span style="color:#24292e;">            operator: In</span></span>
<span class="line"><span style="color:#24292e;">            values:</span></span>
<span class="line"><span style="color:#24292e;">            - ib-2</span></span></code></pre></div><p>该”pod.yaml”文件定义了一个pod，该pod绑定了一个名为”local-path-pvc”的PVC. 且指定Pod调度的节点为”ib-2”；</p></li><li><p>pvc-test.yaml：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">apiVersion: v1</span></span>
<span class="line"><span style="color:#e1e4e8;">kind: PersistentVolumeClaim</span></span>
<span class="line"><span style="color:#e1e4e8;">metadata:</span></span>
<span class="line"><span style="color:#e1e4e8;">  name: local-path-pvc</span></span>
<span class="line"><span style="color:#e1e4e8;">spec:</span></span>
<span class="line"><span style="color:#e1e4e8;">  accessModes:</span></span>
<span class="line"><span style="color:#e1e4e8;">    - ReadWriteOnce</span></span>
<span class="line"><span style="color:#e1e4e8;">  storageClassName: local-path</span></span>
<span class="line"><span style="color:#e1e4e8;">  resources:</span></span>
<span class="line"><span style="color:#e1e4e8;">    requests:</span></span>
<span class="line"><span style="color:#e1e4e8;">      storage: 128Mi</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">apiVersion: v1</span></span>
<span class="line"><span style="color:#24292e;">kind: PersistentVolumeClaim</span></span>
<span class="line"><span style="color:#24292e;">metadata:</span></span>
<span class="line"><span style="color:#24292e;">  name: local-path-pvc</span></span>
<span class="line"><span style="color:#24292e;">spec:</span></span>
<span class="line"><span style="color:#24292e;">  accessModes:</span></span>
<span class="line"><span style="color:#24292e;">    - ReadWriteOnce</span></span>
<span class="line"><span style="color:#24292e;">  storageClassName: local-path</span></span>
<span class="line"><span style="color:#24292e;">  resources:</span></span>
<span class="line"><span style="color:#24292e;">    requests:</span></span>
<span class="line"><span style="color:#24292e;">      storage: 128Mi</span></span></code></pre></div><p>该”pvc.yaml”文件定义了一个pvc，该pvc指定了指定了StorageClass为”local-path”.</p></li></ul><h3 id="部署pod和pvc" tabindex="-1">部署Pod和PVC <a class="header-anchor" href="#部署pod和pvc" aria-label="Permalink to &quot;部署Pod和PVC&quot;">​</a></h3><p>在Kubernetes环境中部署pod和pvc：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">kubectl -n local-path-storage apply -f pod-test.yaml -f pvc-test.yaml</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">kubectl -n local-path-storage apply -f pod-test.yaml -f pvc-test.yaml</span></span></code></pre></div><h3 id="获取pod-pvc和pv" tabindex="-1">获取Pod,PVC和PV <a class="header-anchor" href="#获取pod-pvc和pv" aria-label="Permalink to &quot;获取Pod,PVC和PV&quot;">​</a></h3><p>在Kubernetes环境中获取刚刚部署的pod和pvc以及分配的pv：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">kubectl -n local-path-storage get po,pvc,pv</span></span>
<span class="line"><span style="color:#e1e4e8;">NAME                                          READY   STATUS    RESTARTS   AGE</span></span>
<span class="line"><span style="color:#e1e4e8;">pod/volume-test                               1/1     Running   0          63m</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">NAME                                   STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE</span></span>
<span class="line"><span style="color:#e1e4e8;">persistentvolumeclaim/local-path-pvc   Bound    pvc-7be0fda1-8d90-40a7-bdaa-fbbb85b91798   128Mi      RWO            local-path     63m</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">NAME                                                        CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS     CLAIM                                        STORAGECLASS      REASON   AGE</span></span>
<span class="line"><span style="color:#e1e4e8;">persistentvolume/pvc-7be0fda1-8d90-40a7-bdaa-fbbb85b91798   128Mi      RWO            Delete           Bound      local-path-storage/local-path-pvc            local-path                 63m</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">kubectl -n local-path-storage get po,pvc,pv</span></span>
<span class="line"><span style="color:#24292e;">NAME                                          READY   STATUS    RESTARTS   AGE</span></span>
<span class="line"><span style="color:#24292e;">pod/volume-test                               1/1     Running   0          63m</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">NAME                                   STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE</span></span>
<span class="line"><span style="color:#24292e;">persistentvolumeclaim/local-path-pvc   Bound    pvc-7be0fda1-8d90-40a7-bdaa-fbbb85b91798   128Mi      RWO            local-path     63m</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">NAME                                                        CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS     CLAIM                                        STORAGECLASS      REASON   AGE</span></span>
<span class="line"><span style="color:#24292e;">persistentvolume/pvc-7be0fda1-8d90-40a7-bdaa-fbbb85b91798   128Mi      RWO            Delete           Bound      local-path-storage/local-path-pvc            local-path                 63m</span></span></code></pre></div><p>以上信息表示，创建的pod成功挂载了目标pvc，并且该pvc也绑定了pv；</p><h3 id="查看分配的pv的详情" tabindex="-1">查看分配的pv的详情 <a class="header-anchor" href="#查看分配的pv的详情" aria-label="Permalink to &quot;查看分配的pv的详情&quot;">​</a></h3><p>在Kubernetes环境中获取pv详情：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">kubectl describe pv pvc-7be0fda1-8d90-40a7-bdaa-fbbb85b91798</span></span>
<span class="line"><span style="color:#e1e4e8;">Name:              pvc-7be0fda1-8d90-40a7-bdaa-fbbb85b91798</span></span>
<span class="line"><span style="color:#e1e4e8;">Labels:            &lt;none&gt;</span></span>
<span class="line"><span style="color:#e1e4e8;">Annotations:       pv.kubernetes.io/provisioned-by: rancher.io/local-path</span></span>
<span class="line"><span style="color:#e1e4e8;">Finalizers:        [kubernetes.io/pv-protection]</span></span>
<span class="line"><span style="color:#e1e4e8;">StorageClass:      local-path</span></span>
<span class="line"><span style="color:#e1e4e8;">Status:            Bound</span></span>
<span class="line"><span style="color:#e1e4e8;">Claim:             local-path-storage/local-path-pvc</span></span>
<span class="line"><span style="color:#e1e4e8;">Reclaim Policy:    Delete</span></span>
<span class="line"><span style="color:#e1e4e8;">Access Modes:      RWO</span></span>
<span class="line"><span style="color:#e1e4e8;">VolumeMode:        Filesystem</span></span>
<span class="line"><span style="color:#e1e4e8;">Capacity:          128Mi</span></span>
<span class="line"><span style="color:#e1e4e8;">Node Affinity:</span></span>
<span class="line"><span style="color:#e1e4e8;">  Required Terms:</span></span>
<span class="line"><span style="color:#e1e4e8;">    Term 0:        kubernetes.io/hostname in [ib-2]</span></span>
<span class="line"><span style="color:#e1e4e8;">Message:</span></span>
<span class="line"><span style="color:#e1e4e8;">Source:</span></span>
<span class="line"><span style="color:#e1e4e8;">    Type:          HostPath (bare host directory volume)</span></span>
<span class="line"><span style="color:#e1e4e8;">    Path:          /localpv/local-path-provisioner/pvc-7be0fda1-8d90-40a7-bdaa-fbbb85b91798_local-path-storage_local-path-pvc</span></span>
<span class="line"><span style="color:#e1e4e8;">    HostPathType:  DirectoryOrCreate</span></span>
<span class="line"><span style="color:#e1e4e8;">Events:            &lt;none&gt;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">kubectl describe pv pvc-7be0fda1-8d90-40a7-bdaa-fbbb85b91798</span></span>
<span class="line"><span style="color:#24292e;">Name:              pvc-7be0fda1-8d90-40a7-bdaa-fbbb85b91798</span></span>
<span class="line"><span style="color:#24292e;">Labels:            &lt;none&gt;</span></span>
<span class="line"><span style="color:#24292e;">Annotations:       pv.kubernetes.io/provisioned-by: rancher.io/local-path</span></span>
<span class="line"><span style="color:#24292e;">Finalizers:        [kubernetes.io/pv-protection]</span></span>
<span class="line"><span style="color:#24292e;">StorageClass:      local-path</span></span>
<span class="line"><span style="color:#24292e;">Status:            Bound</span></span>
<span class="line"><span style="color:#24292e;">Claim:             local-path-storage/local-path-pvc</span></span>
<span class="line"><span style="color:#24292e;">Reclaim Policy:    Delete</span></span>
<span class="line"><span style="color:#24292e;">Access Modes:      RWO</span></span>
<span class="line"><span style="color:#24292e;">VolumeMode:        Filesystem</span></span>
<span class="line"><span style="color:#24292e;">Capacity:          128Mi</span></span>
<span class="line"><span style="color:#24292e;">Node Affinity:</span></span>
<span class="line"><span style="color:#24292e;">  Required Terms:</span></span>
<span class="line"><span style="color:#24292e;">    Term 0:        kubernetes.io/hostname in [ib-2]</span></span>
<span class="line"><span style="color:#24292e;">Message:</span></span>
<span class="line"><span style="color:#24292e;">Source:</span></span>
<span class="line"><span style="color:#24292e;">    Type:          HostPath (bare host directory volume)</span></span>
<span class="line"><span style="color:#24292e;">    Path:          /localpv/local-path-provisioner/pvc-7be0fda1-8d90-40a7-bdaa-fbbb85b91798_local-path-storage_local-path-pvc</span></span>
<span class="line"><span style="color:#24292e;">    HostPathType:  DirectoryOrCreate</span></span>
<span class="line"><span style="color:#24292e;">Events:            &lt;none&gt;</span></span></code></pre></div><p>以上信息表示该pv是由名为”local-path”的StorageClass在节点”ib-2”上创建的，对应节点”ib-2”上的本机路径”/localpv/local-path-provisioner/pvc-7be0fda1-8d90-40a7-bdaa-fbbb85b91798_local-path-storage_local-path-pvc”.</p>`,31),o=[l];function c(t,i,r,d,y,v){return a(),n("div",null,o)}const u=s(p,[["render",c]]);export{m as __pageData,u as default};
