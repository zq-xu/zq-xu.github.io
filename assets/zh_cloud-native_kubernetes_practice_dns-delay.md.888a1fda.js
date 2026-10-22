import{_ as s,o as a,c as n,Q as e}from"./chunks/framework.48927342.js";const l="/images/cloud-native/kubernetes/statefulset-stable-network-id.png",w=JSON.parse('{"title":"StatefulSet资源的Pod域名解析延迟问题验证","description":"","frontmatter":{"date":"2022-10-31T00:00:00.000Z"},"headers":[],"relativePath":"zh/cloud-native/kubernetes/practice/dns-delay.md","filePath":"zh/cloud-native/kubernetes/practice/dns-delay.md"}'),p={name:"zh/cloud-native/kubernetes/practice/dns-delay.md"},o=e('<h1 id="statefulset资源的pod域名解析延迟问题验证" tabindex="-1">StatefulSet资源的Pod域名解析延迟问题验证 <a class="header-anchor" href="#statefulset资源的pod域名解析延迟问题验证" aria-label="Permalink to &quot;StatefulSet资源的Pod域名解析延迟问题验证&quot;">​</a></h1><p>在k8s环境中，服务地址常常以域名表示，需要k8s环境中DNS进行解析。</p><p>K8S环境中的DNS通常使用CoreDNS，其存在30s缓存。</p><p>因此，新创建的StatefulSet资源生成的Pod实例对应的headless service域名常常需要在pod创建完成之后30s左右的时间才可以被解析。</p><h2 id="官方解释" tabindex="-1">官方解释 <a class="header-anchor" href="#官方解释" aria-label="Permalink to &quot;官方解释&quot;">​</a></h2><p><a href="https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/#stable-network-id" target="_blank" rel="noreferrer">Stable Network ID</a>，整体可参考下图：</p><p><img src="'+l+`" alt="statefulset-stable-network-id"></p><h2 id="操作体验" tabindex="-1">操作体验 <a class="header-anchor" href="#操作体验" aria-label="Permalink to &quot;操作体验&quot;">​</a></h2><p>根据官方文档说明，在pod启动后解析pod域名，并调整CoreDNS的缓存时间，检查解析时间是否变化。</p><h3 id="启动后域名解析" tabindex="-1">启动后域名解析 <a class="header-anchor" href="#启动后域名解析" aria-label="Permalink to &quot;启动后域名解析&quot;">​</a></h3><p>StatefulSet资源生成的Pod实例启动后解析本Pod的域名。解析脚本如下：</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">#!/bin/sh</span></span>
<span class="line"><span style="color:#E1E4E8;">waitSeconds</span><span style="color:#F97583;">=</span><span style="color:#79B8FF;">0</span></span>
<span class="line"><span style="color:#F97583;">while</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">:</span></span>
<span class="line"><span style="color:#F97583;">do</span></span>
<span class="line"><span style="color:#E1E4E8;">  parse</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">$(</span><span style="color:#B392F0;">nslookup</span><span style="color:#9ECBFF;"> ddb-xzq-dn-0-0.ddb-xzq-dn.develop.svc.cluster.local)</span></span>
<span class="line"><span style="color:#E1E4E8;">  result</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">$(</span><span style="color:#79B8FF;">echo</span><span style="color:#9ECBFF;"> </span><span style="color:#E1E4E8;">$parse</span><span style="color:#9ECBFF;"> </span><span style="color:#F97583;">|</span><span style="color:#9ECBFF;"> </span><span style="color:#B392F0;">grep</span><span style="color:#9ECBFF;"> &quot;server can&#39;t find&quot;)</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> [[ </span><span style="color:#9ECBFF;">&quot;</span><span style="color:#E1E4E8;">$result</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;&quot;</span><span style="color:#E1E4E8;"> ]]</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">then</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">sleep</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">1</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">let</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">waitSeconds++</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">echo</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;wait... \${</span><span style="color:#E1E4E8;">waitSeconds</span><span style="color:#9ECBFF;">}s&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">else</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">echo</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;</span><span style="color:#E1E4E8;">$parse</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">exit</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">1</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">fi</span></span>
<span class="line"><span style="color:#F97583;">done</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">#!/bin/sh</span></span>
<span class="line"><span style="color:#24292E;">waitSeconds</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">0</span></span>
<span class="line"><span style="color:#D73A49;">while</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">:</span></span>
<span class="line"><span style="color:#D73A49;">do</span></span>
<span class="line"><span style="color:#24292E;">  parse</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">$(</span><span style="color:#6F42C1;">nslookup</span><span style="color:#032F62;"> ddb-xzq-dn-0-0.ddb-xzq-dn.develop.svc.cluster.local)</span></span>
<span class="line"><span style="color:#24292E;">  result</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">$(</span><span style="color:#005CC5;">echo</span><span style="color:#032F62;"> </span><span style="color:#24292E;">$parse</span><span style="color:#032F62;"> </span><span style="color:#D73A49;">|</span><span style="color:#032F62;"> </span><span style="color:#6F42C1;">grep</span><span style="color:#032F62;"> &quot;server can&#39;t find&quot;)</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> [[ </span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">$result</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;&quot;</span><span style="color:#24292E;"> ]]</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">then</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">sleep</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">let</span><span style="color:#24292E;"> </span><span style="color:#032F62;">waitSeconds++</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">echo</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;wait... \${</span><span style="color:#24292E;">waitSeconds</span><span style="color:#032F62;">}s&quot;</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">else</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">echo</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">$parse</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">exit</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">fi</span></span>
<span class="line"><span style="color:#D73A49;">done</span></span></code></pre></div><p>Pod启动后日志如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">wait... 1s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 2s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 3s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 4s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 5s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 6s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 7s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 8s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 9s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 10s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 11s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 12s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 13s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 14s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 15s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 16s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 17s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 18s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 19s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 20s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 21s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 22s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 23s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 24s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 25s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 26s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 27s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 28s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 29s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 30s</span></span>
<span class="line"><span style="color:#e1e4e8;">Server:		10.96.0.10</span></span>
<span class="line"><span style="color:#e1e4e8;">Address:	10.96.0.10:53</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">Name:	ddb-xzq-dn-0-0.ddb-xzq-dn.develop.svc.cluster.local</span></span>
<span class="line"><span style="color:#e1e4e8;">Address: 172.17.0.27</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">wait... 1s</span></span>
<span class="line"><span style="color:#24292e;">wait... 2s</span></span>
<span class="line"><span style="color:#24292e;">wait... 3s</span></span>
<span class="line"><span style="color:#24292e;">wait... 4s</span></span>
<span class="line"><span style="color:#24292e;">wait... 5s</span></span>
<span class="line"><span style="color:#24292e;">wait... 6s</span></span>
<span class="line"><span style="color:#24292e;">wait... 7s</span></span>
<span class="line"><span style="color:#24292e;">wait... 8s</span></span>
<span class="line"><span style="color:#24292e;">wait... 9s</span></span>
<span class="line"><span style="color:#24292e;">wait... 10s</span></span>
<span class="line"><span style="color:#24292e;">wait... 11s</span></span>
<span class="line"><span style="color:#24292e;">wait... 12s</span></span>
<span class="line"><span style="color:#24292e;">wait... 13s</span></span>
<span class="line"><span style="color:#24292e;">wait... 14s</span></span>
<span class="line"><span style="color:#24292e;">wait... 15s</span></span>
<span class="line"><span style="color:#24292e;">wait... 16s</span></span>
<span class="line"><span style="color:#24292e;">wait... 17s</span></span>
<span class="line"><span style="color:#24292e;">wait... 18s</span></span>
<span class="line"><span style="color:#24292e;">wait... 19s</span></span>
<span class="line"><span style="color:#24292e;">wait... 20s</span></span>
<span class="line"><span style="color:#24292e;">wait... 21s</span></span>
<span class="line"><span style="color:#24292e;">wait... 22s</span></span>
<span class="line"><span style="color:#24292e;">wait... 23s</span></span>
<span class="line"><span style="color:#24292e;">wait... 24s</span></span>
<span class="line"><span style="color:#24292e;">wait... 25s</span></span>
<span class="line"><span style="color:#24292e;">wait... 26s</span></span>
<span class="line"><span style="color:#24292e;">wait... 27s</span></span>
<span class="line"><span style="color:#24292e;">wait... 28s</span></span>
<span class="line"><span style="color:#24292e;">wait... 29s</span></span>
<span class="line"><span style="color:#24292e;">wait... 30s</span></span>
<span class="line"><span style="color:#24292e;">Server:		10.96.0.10</span></span>
<span class="line"><span style="color:#24292e;">Address:	10.96.0.10:53</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">Name:	ddb-xzq-dn-0-0.ddb-xzq-dn.develop.svc.cluster.local</span></span>
<span class="line"><span style="color:#24292e;">Address: 172.17.0.27</span></span></code></pre></div><h2 id="修改coredns缓存时间" tabindex="-1">修改CoreDNS缓存时间 <a class="header-anchor" href="#修改coredns缓存时间" aria-label="Permalink to &quot;修改CoreDNS缓存时间&quot;">​</a></h2><p>查看CoreDNS缓存：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">$ kubectl -nkube-system get cm coredns -oyaml</span></span>
<span class="line"><span style="color:#e1e4e8;">apiVersion: v1</span></span>
<span class="line"><span style="color:#e1e4e8;">data:</span></span>
<span class="line"><span style="color:#e1e4e8;">  Corefile: |</span></span>
<span class="line"><span style="color:#e1e4e8;">    .:53 {</span></span>
<span class="line"><span style="color:#e1e4e8;">        errors</span></span>
<span class="line"><span style="color:#e1e4e8;">        health {</span></span>
<span class="line"><span style="color:#e1e4e8;">           lameduck 5s</span></span>
<span class="line"><span style="color:#e1e4e8;">        }</span></span>
<span class="line"><span style="color:#e1e4e8;">        ready</span></span>
<span class="line"><span style="color:#e1e4e8;">        kubernetes cluster.local in-addr.arpa ip6.arpa {</span></span>
<span class="line"><span style="color:#e1e4e8;">           pods insecure</span></span>
<span class="line"><span style="color:#e1e4e8;">           fallthrough in-addr.arpa ip6.arpa</span></span>
<span class="line"><span style="color:#e1e4e8;">           ttl 30</span></span>
<span class="line"><span style="color:#e1e4e8;">        }</span></span>
<span class="line"><span style="color:#e1e4e8;">        prometheus :9153</span></span>
<span class="line"><span style="color:#e1e4e8;">        hosts {</span></span>
<span class="line"><span style="color:#e1e4e8;">           127.0.0.1 host.minikube.internal</span></span>
<span class="line"><span style="color:#e1e4e8;">           fallthrough</span></span>
<span class="line"><span style="color:#e1e4e8;">        }</span></span>
<span class="line"><span style="color:#e1e4e8;">        forward . /etc/resolv.conf {</span></span>
<span class="line"><span style="color:#e1e4e8;">           max_concurrent 1000</span></span>
<span class="line"><span style="color:#e1e4e8;">        }</span></span>
<span class="line"><span style="color:#e1e4e8;">        cache 30</span></span>
<span class="line"><span style="color:#e1e4e8;">        loop</span></span>
<span class="line"><span style="color:#e1e4e8;">        reload</span></span>
<span class="line"><span style="color:#e1e4e8;">        loadbalance</span></span>
<span class="line"><span style="color:#e1e4e8;">    }</span></span>
<span class="line"><span style="color:#e1e4e8;">kind: ConfigMap</span></span>
<span class="line"><span style="color:#e1e4e8;">metadata:</span></span>
<span class="line"><span style="color:#e1e4e8;">  creationTimestamp: &quot;2022-05-26T08:41:00Z&quot;</span></span>
<span class="line"><span style="color:#e1e4e8;">  name: coredns</span></span>
<span class="line"><span style="color:#e1e4e8;">  namespace: kube-system</span></span>
<span class="line"><span style="color:#e1e4e8;">  resourceVersion: &quot;8885014&quot;</span></span>
<span class="line"><span style="color:#e1e4e8;">  uid: 2b7d5f37-c8d9-428f-a250-df9fd3cb18dc</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">$ kubectl -nkube-system get cm coredns -oyaml</span></span>
<span class="line"><span style="color:#24292e;">apiVersion: v1</span></span>
<span class="line"><span style="color:#24292e;">data:</span></span>
<span class="line"><span style="color:#24292e;">  Corefile: |</span></span>
<span class="line"><span style="color:#24292e;">    .:53 {</span></span>
<span class="line"><span style="color:#24292e;">        errors</span></span>
<span class="line"><span style="color:#24292e;">        health {</span></span>
<span class="line"><span style="color:#24292e;">           lameduck 5s</span></span>
<span class="line"><span style="color:#24292e;">        }</span></span>
<span class="line"><span style="color:#24292e;">        ready</span></span>
<span class="line"><span style="color:#24292e;">        kubernetes cluster.local in-addr.arpa ip6.arpa {</span></span>
<span class="line"><span style="color:#24292e;">           pods insecure</span></span>
<span class="line"><span style="color:#24292e;">           fallthrough in-addr.arpa ip6.arpa</span></span>
<span class="line"><span style="color:#24292e;">           ttl 30</span></span>
<span class="line"><span style="color:#24292e;">        }</span></span>
<span class="line"><span style="color:#24292e;">        prometheus :9153</span></span>
<span class="line"><span style="color:#24292e;">        hosts {</span></span>
<span class="line"><span style="color:#24292e;">           127.0.0.1 host.minikube.internal</span></span>
<span class="line"><span style="color:#24292e;">           fallthrough</span></span>
<span class="line"><span style="color:#24292e;">        }</span></span>
<span class="line"><span style="color:#24292e;">        forward . /etc/resolv.conf {</span></span>
<span class="line"><span style="color:#24292e;">           max_concurrent 1000</span></span>
<span class="line"><span style="color:#24292e;">        }</span></span>
<span class="line"><span style="color:#24292e;">        cache 30</span></span>
<span class="line"><span style="color:#24292e;">        loop</span></span>
<span class="line"><span style="color:#24292e;">        reload</span></span>
<span class="line"><span style="color:#24292e;">        loadbalance</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;">kind: ConfigMap</span></span>
<span class="line"><span style="color:#24292e;">metadata:</span></span>
<span class="line"><span style="color:#24292e;">  creationTimestamp: &quot;2022-05-26T08:41:00Z&quot;</span></span>
<span class="line"><span style="color:#24292e;">  name: coredns</span></span>
<span class="line"><span style="color:#24292e;">  namespace: kube-system</span></span>
<span class="line"><span style="color:#24292e;">  resourceVersion: &quot;8885014&quot;</span></span>
<span class="line"><span style="color:#24292e;">  uid: 2b7d5f37-c8d9-428f-a250-df9fd3cb18dc</span></span></code></pre></div><p>将第24行的”cache 30”修改为”cache 10”.</p><h2 id="重新创建pod" tabindex="-1">重新创建Pod <a class="header-anchor" href="#重新创建pod" aria-label="Permalink to &quot;重新创建Pod&quot;">​</a></h2><p>重启创建Pod并查看Pod日志：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">wait... 1s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 2s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 3s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 4s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 5s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 6s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 7s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 8s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 9s</span></span>
<span class="line"><span style="color:#e1e4e8;">wait... 10s</span></span>
<span class="line"><span style="color:#e1e4e8;">Server:		10.96.0.10</span></span>
<span class="line"><span style="color:#e1e4e8;">Address:	10.96.0.10:53</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">Name:	ddb-xzq-dn-0-0.ddb-xzq-dn.develop.svc.cluster.local</span></span>
<span class="line"><span style="color:#e1e4e8;">Address: 172.17.0.27</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">wait... 1s</span></span>
<span class="line"><span style="color:#24292e;">wait... 2s</span></span>
<span class="line"><span style="color:#24292e;">wait... 3s</span></span>
<span class="line"><span style="color:#24292e;">wait... 4s</span></span>
<span class="line"><span style="color:#24292e;">wait... 5s</span></span>
<span class="line"><span style="color:#24292e;">wait... 6s</span></span>
<span class="line"><span style="color:#24292e;">wait... 7s</span></span>
<span class="line"><span style="color:#24292e;">wait... 8s</span></span>
<span class="line"><span style="color:#24292e;">wait... 9s</span></span>
<span class="line"><span style="color:#24292e;">wait... 10s</span></span>
<span class="line"><span style="color:#24292e;">Server:		10.96.0.10</span></span>
<span class="line"><span style="color:#24292e;">Address:	10.96.0.10:53</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">Name:	ddb-xzq-dn-0-0.ddb-xzq-dn.develop.svc.cluster.local</span></span>
<span class="line"><span style="color:#24292e;">Address: 172.17.0.27</span></span></code></pre></div><p>由此可见，StatefulSet资源的Pod资源对应的Pod域名解析时间基本与CoreDNS缓存时间一致，验证官方解释。</p>`,22),c=[o];function t(r,i,y,d,u,E){return a(),n("div",null,c)}const F=s(p,[["render",t]]);export{w as __pageData,F as default};
