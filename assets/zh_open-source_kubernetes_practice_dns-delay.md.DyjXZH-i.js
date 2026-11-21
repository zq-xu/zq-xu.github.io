import{_ as a,o as n,c as p,ag as i}from"./chunks/framework.BJFNwp4n.js";const e="/images/open-source/kubernetes/statefulset-stable-network-id.png",u=JSON.parse('{"title":"StatefulSet资源的Pod域名解析延迟问题验证","description":"","frontmatter":{"date":"2022-10-31T00:00:00.000Z"},"headers":[],"relativePath":"zh/open-source/kubernetes/practice/dns-delay.md","filePath":"zh/open-source/kubernetes/practice/dns-delay.md"}'),l={name:"zh/open-source/kubernetes/practice/dns-delay.md"};function t(h,s,c,d,r,k){return n(),p("div",{"data-pagefind-body":!0,"data-pagefind-meta":"date:1667174400000"},[...s[0]||(s[0]=[i('<h1 id="statefulset资源的pod域名解析延迟问题验证" tabindex="-1">StatefulSet资源的Pod域名解析延迟问题验证 <a class="header-anchor" href="#statefulset资源的pod域名解析延迟问题验证" aria-label="Permalink to &quot;StatefulSet资源的Pod域名解析延迟问题验证&quot;">​</a></h1><p>在k8s环境中，服务地址常常以域名表示，需要k8s环境中DNS进行解析。</p><p>K8S环境中的DNS通常使用CoreDNS，其存在30s缓存。</p><p>因此，新创建的StatefulSet资源生成的Pod实例对应的headless service域名常常需要在pod创建完成之后30s左右的时间才可以被解析。</p><h2 id="官方解释" tabindex="-1">官方解释 <a class="header-anchor" href="#官方解释" aria-label="Permalink to &quot;官方解释&quot;">​</a></h2><p><a href="https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/#stable-network-id" target="_blank" rel="noreferrer">Stable Network ID</a>，整体可参考下图：</p><p><img src="'+e+`" alt="statefulset-stable-network-id"></p><h2 id="操作体验" tabindex="-1">操作体验 <a class="header-anchor" href="#操作体验" aria-label="Permalink to &quot;操作体验&quot;">​</a></h2><p>根据官方文档说明，在pod启动后解析pod域名，并调整CoreDNS的缓存时间，检查解析时间是否变化。</p><h3 id="启动后域名解析" tabindex="-1">启动后域名解析 <a class="header-anchor" href="#启动后域名解析" aria-label="Permalink to &quot;启动后域名解析&quot;">​</a></h3><p>StatefulSet资源生成的Pod实例启动后解析本Pod的域名。解析脚本如下：</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#!/bin/sh</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">waitSeconds</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">0</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">while</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> :</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">do</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  parse</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nslookup</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ddb-xzq-dn-0-0.ddb-xzq-dn.develop.svc.cluster.local</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  result</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">echo</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $parse </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">|</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> grep</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;server can&#39;t find&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [[ </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$result</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> !=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ]]</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  then</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    sleep</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    let</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> waitSeconds++</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;wait... \${</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">waitSeconds</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}s&quot;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  else</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$parse</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    exit</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  fi</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">done</span></span></code></pre></div><p>Pod启动后日志如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>wait... 1s</span></span>
<span class="line"><span>wait... 2s</span></span>
<span class="line"><span>wait... 3s</span></span>
<span class="line"><span>wait... 4s</span></span>
<span class="line"><span>wait... 5s</span></span>
<span class="line"><span>wait... 6s</span></span>
<span class="line"><span>wait... 7s</span></span>
<span class="line"><span>wait... 8s</span></span>
<span class="line"><span>wait... 9s</span></span>
<span class="line"><span>wait... 10s</span></span>
<span class="line"><span>wait... 11s</span></span>
<span class="line"><span>wait... 12s</span></span>
<span class="line"><span>wait... 13s</span></span>
<span class="line"><span>wait... 14s</span></span>
<span class="line"><span>wait... 15s</span></span>
<span class="line"><span>wait... 16s</span></span>
<span class="line"><span>wait... 17s</span></span>
<span class="line"><span>wait... 18s</span></span>
<span class="line"><span>wait... 19s</span></span>
<span class="line"><span>wait... 20s</span></span>
<span class="line"><span>wait... 21s</span></span>
<span class="line"><span>wait... 22s</span></span>
<span class="line"><span>wait... 23s</span></span>
<span class="line"><span>wait... 24s</span></span>
<span class="line"><span>wait... 25s</span></span>
<span class="line"><span>wait... 26s</span></span>
<span class="line"><span>wait... 27s</span></span>
<span class="line"><span>wait... 28s</span></span>
<span class="line"><span>wait... 29s</span></span>
<span class="line"><span>wait... 30s</span></span>
<span class="line"><span>Server:		10.96.0.10</span></span>
<span class="line"><span>Address:	10.96.0.10:53</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Name:	ddb-xzq-dn-0-0.ddb-xzq-dn.develop.svc.cluster.local</span></span>
<span class="line"><span>Address: 172.17.0.27</span></span></code></pre></div><h2 id="修改coredns缓存时间" tabindex="-1">修改CoreDNS缓存时间 <a class="header-anchor" href="#修改coredns缓存时间" aria-label="Permalink to &quot;修改CoreDNS缓存时间&quot;">​</a></h2><p>查看CoreDNS缓存：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ kubectl -nkube-system get cm coredns -oyaml</span></span>
<span class="line"><span>apiVersion: v1</span></span>
<span class="line"><span>data:</span></span>
<span class="line"><span>  Corefile: |</span></span>
<span class="line"><span>    .:53 {</span></span>
<span class="line"><span>        errors</span></span>
<span class="line"><span>        health {</span></span>
<span class="line"><span>           lameduck 5s</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        ready</span></span>
<span class="line"><span>        kubernetes cluster.local in-addr.arpa ip6.arpa {</span></span>
<span class="line"><span>           pods insecure</span></span>
<span class="line"><span>           fallthrough in-addr.arpa ip6.arpa</span></span>
<span class="line"><span>           ttl 30</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        prometheus :9153</span></span>
<span class="line"><span>        hosts {</span></span>
<span class="line"><span>           127.0.0.1 host.minikube.internal</span></span>
<span class="line"><span>           fallthrough</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        forward . /etc/resolv.conf {</span></span>
<span class="line"><span>           max_concurrent 1000</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        cache 30</span></span>
<span class="line"><span>        loop</span></span>
<span class="line"><span>        reload</span></span>
<span class="line"><span>        loadbalance</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>kind: ConfigMap</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span>  creationTimestamp: &quot;2022-05-26T08:41:00Z&quot;</span></span>
<span class="line"><span>  name: coredns</span></span>
<span class="line"><span>  namespace: kube-system</span></span>
<span class="line"><span>  resourceVersion: &quot;8885014&quot;</span></span>
<span class="line"><span>  uid: 2b7d5f37-c8d9-428f-a250-df9fd3cb18dc</span></span></code></pre></div><p>将第24行的”cache 30”修改为”cache 10”.</p><h2 id="重新创建pod" tabindex="-1">重新创建Pod <a class="header-anchor" href="#重新创建pod" aria-label="Permalink to &quot;重新创建Pod&quot;">​</a></h2><p>重启创建Pod并查看Pod日志：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>wait... 1s</span></span>
<span class="line"><span>wait... 2s</span></span>
<span class="line"><span>wait... 3s</span></span>
<span class="line"><span>wait... 4s</span></span>
<span class="line"><span>wait... 5s</span></span>
<span class="line"><span>wait... 6s</span></span>
<span class="line"><span>wait... 7s</span></span>
<span class="line"><span>wait... 8s</span></span>
<span class="line"><span>wait... 9s</span></span>
<span class="line"><span>wait... 10s</span></span>
<span class="line"><span>Server:		10.96.0.10</span></span>
<span class="line"><span>Address:	10.96.0.10:53</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Name:	ddb-xzq-dn-0-0.ddb-xzq-dn.develop.svc.cluster.local</span></span>
<span class="line"><span>Address: 172.17.0.27</span></span></code></pre></div><p>由此可见，StatefulSet资源的Pod资源对应的Pod域名解析时间基本与CoreDNS缓存时间一致，验证官方解释。</p>`,22)])])}const g=a(l,[["render",t]]);export{u as __pageData,g as default};
