import{_ as s,o as a,c as n,Q as l}from"./chunks/framework.48927342.js";const F=JSON.parse('{"title":"Helm-Push插件","description":"","frontmatter":{"date":"2022-11-25T00:00:00.000Z"},"headers":[],"relativePath":"zh/tools/helm-push.md","filePath":"zh/tools/helm-push.md"}'),p={name:"zh/tools/helm-push.md"},o=l(`<h1 id="helm-push插件" tabindex="-1">Helm-Push插件 <a class="header-anchor" href="#helm-push插件" aria-label="Permalink to &quot;Helm-Push插件&quot;">​</a></h1><p>Helm Push插件本质上是一个二进制可执行文件,主要用于将Chart包推送到Chart仓库中。</p><h2 id="安装helm-push插件" tabindex="-1">安装Helm Push插件 <a class="header-anchor" href="#安装helm-push插件" aria-label="Permalink to &quot;安装Helm Push插件&quot;">​</a></h2><h3 id="获取helm插件路径" tabindex="-1">获取Helm插件路径 <a class="header-anchor" href="#获取helm插件路径" aria-label="Permalink to &quot;获取Helm插件路径&quot;">​</a></h3><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;"># 通过指令查看helm环境变量</span></span>
<span class="line"><span style="color:#B392F0;">helm</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">env</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 终端打印信息如下</span></span>
<span class="line"><span style="color:#E1E4E8;">HELM_BIN</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;helm&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">HELM_CACHE_HOME</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;/root/.cache/helm&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">HELM_CONFIG_HOME</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;/root/.config/helm&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">HELM_DATA_HOME</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;/root/.local/share/helm&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">HELM_DEBUG</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;false&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">HELM_KUBEAPISERVER</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">HELM_KUBEASGROUPS</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">HELM_KUBEASUSER</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">HELM_KUBECAFILE</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">HELM_KUBECONTEXT</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">HELM_KUBETOKEN</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">HELM_MAX_HISTORY</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;10&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">HELM_NAMESPACE</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;default&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">HELM_PLUGINS</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;/root/.local/share/helm/plugins&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">HELM_REGISTRY_CONFIG</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;/root/.config/helm/registry.json&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">HELM_REPOSITORY_CACHE</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;/root/.cache/helm/repository&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">HELM_REPOSITORY_CONFIG</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;/root/.config/helm/repositories.yaml&quot;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;"># 通过指令查看helm环境变量</span></span>
<span class="line"><span style="color:#6F42C1;">helm</span><span style="color:#24292E;"> </span><span style="color:#032F62;">env</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 终端打印信息如下</span></span>
<span class="line"><span style="color:#24292E;">HELM_BIN</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;helm&quot;</span></span>
<span class="line"><span style="color:#24292E;">HELM_CACHE_HOME</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;/root/.cache/helm&quot;</span></span>
<span class="line"><span style="color:#24292E;">HELM_CONFIG_HOME</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;/root/.config/helm&quot;</span></span>
<span class="line"><span style="color:#24292E;">HELM_DATA_HOME</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;/root/.local/share/helm&quot;</span></span>
<span class="line"><span style="color:#24292E;">HELM_DEBUG</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;false&quot;</span></span>
<span class="line"><span style="color:#24292E;">HELM_KUBEAPISERVER</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;&quot;</span></span>
<span class="line"><span style="color:#24292E;">HELM_KUBEASGROUPS</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;&quot;</span></span>
<span class="line"><span style="color:#24292E;">HELM_KUBEASUSER</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;&quot;</span></span>
<span class="line"><span style="color:#24292E;">HELM_KUBECAFILE</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;&quot;</span></span>
<span class="line"><span style="color:#24292E;">HELM_KUBECONTEXT</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;&quot;</span></span>
<span class="line"><span style="color:#24292E;">HELM_KUBETOKEN</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;&quot;</span></span>
<span class="line"><span style="color:#24292E;">HELM_MAX_HISTORY</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;10&quot;</span></span>
<span class="line"><span style="color:#24292E;">HELM_NAMESPACE</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;default&quot;</span></span>
<span class="line"><span style="color:#24292E;">HELM_PLUGINS</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;/root/.local/share/helm/plugins&quot;</span></span>
<span class="line"><span style="color:#24292E;">HELM_REGISTRY_CONFIG</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;/root/.config/helm/registry.json&quot;</span></span>
<span class="line"><span style="color:#24292E;">HELM_REPOSITORY_CACHE</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;/root/.cache/helm/repository&quot;</span></span>
<span class="line"><span style="color:#24292E;">HELM_REPOSITORY_CONFIG</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;/root/.config/helm/repositories.yaml&quot;</span></span></code></pre></div><p>以上打印信息中的<code>HELM_PLUGINS</code>，其值为<code>/root/.local/share/helm/plugins</code>，代表Helm插件路径。</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>如果Helm插件路径实际上并不存在，则手动创建：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">mkdir</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-p</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">/root/.local/share/helm/plugins</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">mkdir</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-p</span><span style="color:#24292E;"> </span><span style="color:#032F62;">/root/.local/share/helm/plugins</span></span></code></pre></div></div><h3 id="下载并安装helm-push插件" tabindex="-1">下载并安装Helm Push插件 <a class="header-anchor" href="#下载并安装helm-push插件" aria-label="Permalink to &quot;下载并安装Helm Push插件&quot;">​</a></h3><p>此处选择的Helm Push插件的<code>v0.10.0</code>版本，更多Helm版本可参考 <a href="https://github.com/chartmuseum/helm-push/releases" target="_blank" rel="noreferrer">Helm Push Realease</a>.</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;"># 从GitHub上进行下载Helm Push插件安装包</span></span>
<span class="line"><span style="color:#B392F0;">wget</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">https://github.com/chartmuseum/helm-push/releases/download/v0.10.0/helm-push_0.10.0_linux_amd64.tar.gz</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 将下载好的helm-push插件解压到helm插件路径下的helm-push文件夹中</span></span>
<span class="line"><span style="color:#B392F0;">mkdir</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-p</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">/root/.local/share/helm/plugins/helm-push</span></span>
<span class="line"><span style="color:#B392F0;">tar</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-zxvf</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">helm-push_0.10.0_linux_amd64.tar.gz</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-C</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">/root/.local/share/helm/plugins/helm-push</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 通过指令查看已安装的helm插件</span></span>
<span class="line"><span style="color:#B392F0;">helm</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">plugin</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">list</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 终端打印信息如下，表示helm-push安装完成</span></span>
<span class="line"><span style="color:#B392F0;">NAME</span><span style="color:#E1E4E8;">   	</span><span style="color:#9ECBFF;">VERSION</span><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">DESCRIPTION</span><span style="color:#E1E4E8;">                      </span></span>
<span class="line"><span style="color:#B392F0;">cm-push</span><span style="color:#E1E4E8;">	</span><span style="color:#79B8FF;">0.10</span><span style="color:#9ECBFF;">.0</span><span style="color:#E1E4E8;"> 	</span><span style="color:#9ECBFF;">Push</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">chart</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">package</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">to</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">ChartMuseum</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;"># 从GitHub上进行下载Helm Push插件安装包</span></span>
<span class="line"><span style="color:#6F42C1;">wget</span><span style="color:#24292E;"> </span><span style="color:#032F62;">https://github.com/chartmuseum/helm-push/releases/download/v0.10.0/helm-push_0.10.0_linux_amd64.tar.gz</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 将下载好的helm-push插件解压到helm插件路径下的helm-push文件夹中</span></span>
<span class="line"><span style="color:#6F42C1;">mkdir</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-p</span><span style="color:#24292E;"> </span><span style="color:#032F62;">/root/.local/share/helm/plugins/helm-push</span></span>
<span class="line"><span style="color:#6F42C1;">tar</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-zxvf</span><span style="color:#24292E;"> </span><span style="color:#032F62;">helm-push_0.10.0_linux_amd64.tar.gz</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-C</span><span style="color:#24292E;"> </span><span style="color:#032F62;">/root/.local/share/helm/plugins/helm-push</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 通过指令查看已安装的helm插件</span></span>
<span class="line"><span style="color:#6F42C1;">helm</span><span style="color:#24292E;"> </span><span style="color:#032F62;">plugin</span><span style="color:#24292E;"> </span><span style="color:#032F62;">list</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 终端打印信息如下，表示helm-push安装完成</span></span>
<span class="line"><span style="color:#6F42C1;">NAME</span><span style="color:#24292E;">   	</span><span style="color:#032F62;">VERSION</span><span style="color:#24292E;">	</span><span style="color:#032F62;">DESCRIPTION</span><span style="color:#24292E;">                      </span></span>
<span class="line"><span style="color:#6F42C1;">cm-push</span><span style="color:#24292E;">	</span><span style="color:#005CC5;">0.10</span><span style="color:#032F62;">.0</span><span style="color:#24292E;"> 	</span><span style="color:#032F62;">Push</span><span style="color:#24292E;"> </span><span style="color:#032F62;">chart</span><span style="color:#24292E;"> </span><span style="color:#032F62;">package</span><span style="color:#24292E;"> </span><span style="color:#032F62;">to</span><span style="color:#24292E;"> </span><span style="color:#032F62;">ChartMuseum</span></span></code></pre></div><h2 id="使用helm-push插件上传chart包" tabindex="-1">使用Helm Push插件上传Chart包 <a class="header-anchor" href="#使用helm-push插件上传chart包" aria-label="Permalink to &quot;使用Helm Push插件上传Chart包&quot;">​</a></h2><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;"># chartName: 本地chart包路径， \`.\`表示当前路径</span></span>
<span class="line"><span style="color:#6A737D;"># $repoName Chart仓库的名称；</span></span>
<span class="line"><span style="color:#B392F0;">helm</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">cm-push</span><span style="color:#E1E4E8;"> $chartName $repoName</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;"># chartName: 本地chart包路径， \`.\`表示当前路径</span></span>
<span class="line"><span style="color:#6A737D;"># $repoName Chart仓库的名称；</span></span>
<span class="line"><span style="color:#6F42C1;">helm</span><span style="color:#24292E;"> </span><span style="color:#032F62;">cm-push</span><span style="color:#24292E;"> $chartName $repoName</span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>如果本地没有chart包，可通过helm指令创建：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;"># $chartName: chart名称</span></span>
<span class="line"><span style="color:#B392F0;">helm</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">create</span><span style="color:#E1E4E8;"> $chartName</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;"># $chartName: chart名称</span></span>
<span class="line"><span style="color:#6F42C1;">helm</span><span style="color:#24292E;"> </span><span style="color:#032F62;">create</span><span style="color:#24292E;"> $chartName</span></span></code></pre></div></div>`,13),e=[o];function t(c,r,E,y,h,i){return a(),n("div",null,e)}const m=s(p,[["render",t]]);export{F as __pageData,m as default};
