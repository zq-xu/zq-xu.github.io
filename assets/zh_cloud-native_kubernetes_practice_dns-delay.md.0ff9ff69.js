import{_ as s,c as a,o as n,a as l}from"./app.09261a68.js";const p="/images/cloud-native/kubernetes/statefulset-stable-network-id.png",h=JSON.parse('{"title":"StatefulSet资源的Pod域名解析延迟问题验证","description":"","frontmatter":{"date":"2022-10-31T00:00:00.000Z"},"headers":[{"level":2,"title":"官方解释","slug":"官方解释","link":"#官方解释","children":[]},{"level":2,"title":"操作体验","slug":"操作体验","link":"#操作体验","children":[{"level":3,"title":"启动后域名解析","slug":"启动后域名解析","link":"#启动后域名解析","children":[]}]},{"level":2,"title":"修改CoreDNS缓存时间","slug":"修改coredns缓存时间","link":"#修改coredns缓存时间","children":[]},{"level":2,"title":"重新创建Pod","slug":"重新创建pod","link":"#重新创建pod","children":[]}],"relativePath":"zh/cloud-native/kubernetes/practice/dns-delay.md"}'),e={name:"zh/cloud-native/kubernetes/practice/dns-delay.md"},o=l('<h1 id="statefulset资源的pod域名解析延迟问题验证" tabindex="-1">StatefulSet资源的Pod域名解析延迟问题验证 <a class="header-anchor" href="#statefulset资源的pod域名解析延迟问题验证" aria-hidden="true">#</a></h1><p>在k8s环境中，服务地址常常以域名表示，需要k8s环境中DNS进行解析。</p><p>K8S环境中的DNS通常使用CoreDNS，其存在30s缓存。</p><p>因此，新创建的StatefulSet资源生成的Pod实例对应的headless service域名常常需要在pod创建完成之后30s左右的时间才可以被解析。</p><h2 id="官方解释" tabindex="-1">官方解释 <a class="header-anchor" href="#官方解释" aria-hidden="true">#</a></h2><p><a href="https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/#stable-network-id" target="_blank" rel="noreferrer">Stable Network ID</a>，整体可参考下图：</p><p><img src="'+p+`" alt="statefulset-stable-network-id"></p><h2 id="操作体验" tabindex="-1">操作体验 <a class="header-anchor" href="#操作体验" aria-hidden="true">#</a></h2><p>根据官方文档说明，在pod启动后解析pod域名，并调整CoreDNS的缓存时间，检查解析时间是否变化。</p><h3 id="启动后域名解析" tabindex="-1">启动后域名解析 <a class="header-anchor" href="#启动后域名解析" aria-hidden="true">#</a></h3><p>StatefulSet资源生成的Pod实例启动后解析本Pod的域名。解析脚本如下：</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#676E95;font-style:italic;">#!/bin/sh</span></span>
<span class="line"><span style="color:#A6ACCD;">waitSeconds</span><span style="color:#89DDFF;">=</span><span style="color:#F78C6C;">0</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">while</span><span style="color:#A6ACCD;"> :</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">do</span></span>
<span class="line"><span style="color:#A6ACCD;">  parse</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">$(</span><span style="color:#FFCB6B;">nslookup</span><span style="color:#C3E88D;"> ddb-xzq-dn-</span><span style="color:#F78C6C;">0</span><span style="color:#C3E88D;">-0.ddb-xzq-dn.develop.svc.cluster.local</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">  result</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">$(</span><span style="color:#82AAFF;">echo</span><span style="color:#C3E88D;"> </span><span style="color:#A6ACCD;">$parse</span><span style="color:#C3E88D;"> </span><span style="color:#89DDFF;">|</span><span style="color:#C3E88D;"> </span><span style="color:#FFCB6B;">grep</span><span style="color:#C3E88D;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">server can&#39;t find</span><span style="color:#89DDFF;">&quot;)</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[[</span><span style="color:#89DDFF;"> &quot;</span><span style="color:#A6ACCD;">$result</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">!=</span><span style="color:#89DDFF;"> &quot;&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">]]</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;font-style:italic;">then</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#FFCB6B;">sleep</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">1</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#82AAFF;">let</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">waitSeconds++</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#82AAFF;">echo</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">wait... </span><span style="color:#89DDFF;">\${</span><span style="color:#C3E88D;">waitSeconds</span><span style="color:#89DDFF;">}</span><span style="color:#C3E88D;">s</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;font-style:italic;">else</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#82AAFF;">echo</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">$parse</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#82AAFF;">exit</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">1</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;font-style:italic;">fi</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">done</span></span>
<span class="line"></span></code></pre></div><p>Pod启动后日志如下：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">wait... 1s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 2s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 3s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 4s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 5s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 6s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 7s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 8s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 9s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 10s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 11s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 12s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 13s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 14s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 15s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 16s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 17s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 18s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 19s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 20s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 21s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 22s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 23s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 24s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 25s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 26s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 27s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 28s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 29s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 30s</span></span>
<span class="line"><span style="color:#A6ACCD;">Server:		10.96.0.10</span></span>
<span class="line"><span style="color:#A6ACCD;">Address:	10.96.0.10:53</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">Name:	ddb-xzq-dn-0-0.ddb-xzq-dn.develop.svc.cluster.local</span></span>
<span class="line"><span style="color:#A6ACCD;">Address: 172.17.0.27</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h2 id="修改coredns缓存时间" tabindex="-1">修改CoreDNS缓存时间 <a class="header-anchor" href="#修改coredns缓存时间" aria-hidden="true">#</a></h2><p>查看CoreDNS缓存：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">$ kubectl -nkube-system get cm coredns -oyaml</span></span>
<span class="line"><span style="color:#A6ACCD;">apiVersion: v1</span></span>
<span class="line"><span style="color:#A6ACCD;">data:</span></span>
<span class="line"><span style="color:#A6ACCD;">  Corefile: |</span></span>
<span class="line"><span style="color:#A6ACCD;">    .:53 {</span></span>
<span class="line"><span style="color:#A6ACCD;">        errors</span></span>
<span class="line"><span style="color:#A6ACCD;">        health {</span></span>
<span class="line"><span style="color:#A6ACCD;">           lameduck 5s</span></span>
<span class="line"><span style="color:#A6ACCD;">        }</span></span>
<span class="line"><span style="color:#A6ACCD;">        ready</span></span>
<span class="line"><span style="color:#A6ACCD;">        kubernetes cluster.local in-addr.arpa ip6.arpa {</span></span>
<span class="line"><span style="color:#A6ACCD;">           pods insecure</span></span>
<span class="line"><span style="color:#A6ACCD;">           fallthrough in-addr.arpa ip6.arpa</span></span>
<span class="line"><span style="color:#A6ACCD;">           ttl 30</span></span>
<span class="line"><span style="color:#A6ACCD;">        }</span></span>
<span class="line"><span style="color:#A6ACCD;">        prometheus :9153</span></span>
<span class="line"><span style="color:#A6ACCD;">        hosts {</span></span>
<span class="line"><span style="color:#A6ACCD;">           127.0.0.1 host.minikube.internal</span></span>
<span class="line"><span style="color:#A6ACCD;">           fallthrough</span></span>
<span class="line"><span style="color:#A6ACCD;">        }</span></span>
<span class="line"><span style="color:#A6ACCD;">        forward . /etc/resolv.conf {</span></span>
<span class="line"><span style="color:#A6ACCD;">           max_concurrent 1000</span></span>
<span class="line"><span style="color:#A6ACCD;">        }</span></span>
<span class="line"><span style="color:#A6ACCD;">        cache 30</span></span>
<span class="line"><span style="color:#A6ACCD;">        loop</span></span>
<span class="line"><span style="color:#A6ACCD;">        reload</span></span>
<span class="line"><span style="color:#A6ACCD;">        loadbalance</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">kind: ConfigMap</span></span>
<span class="line"><span style="color:#A6ACCD;">metadata:</span></span>
<span class="line"><span style="color:#A6ACCD;">  creationTimestamp: &quot;2022-05-26T08:41:00Z&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">  name: coredns</span></span>
<span class="line"><span style="color:#A6ACCD;">  namespace: kube-system</span></span>
<span class="line"><span style="color:#A6ACCD;">  resourceVersion: &quot;8885014&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">  uid: 2b7d5f37-c8d9-428f-a250-df9fd3cb18dc</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>将第24行的”cache 30”修改为”cache 10”.</p><h2 id="重新创建pod" tabindex="-1">重新创建Pod <a class="header-anchor" href="#重新创建pod" aria-hidden="true">#</a></h2><p>重启创建Pod并查看Pod日志：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">wait... 1s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 2s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 3s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 4s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 5s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 6s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 7s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 8s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 9s</span></span>
<span class="line"><span style="color:#A6ACCD;">wait... 10s</span></span>
<span class="line"><span style="color:#A6ACCD;">Server:		10.96.0.10</span></span>
<span class="line"><span style="color:#A6ACCD;">Address:	10.96.0.10:53</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">Name:	ddb-xzq-dn-0-0.ddb-xzq-dn.develop.svc.cluster.local</span></span>
<span class="line"><span style="color:#A6ACCD;">Address: 172.17.0.27</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>由此可见，StatefulSet资源的Pod资源对应的Pod域名解析时间基本与CoreDNS缓存时间一致，验证官方解释。</p>`,22),t=[o];function c(r,i,C,A,D,y){return n(),a("div",null,t)}const u=s(e,[["render",c]]);export{h as __pageData,u as default};
