import{_ as s,o as a,c as n,Q as l}from"./chunks/framework.48927342.js";const b=JSON.parse('{"title":"Harbor仓库","description":"","frontmatter":{"date":"2022-11-30T00:00:00.000Z"},"headers":[],"relativePath":"zh/tools/harbor.md","filePath":"zh/tools/harbor.md"}'),o={name:"zh/tools/harbor.md"},p=l(`<h1 id="harbor仓库" tabindex="-1">Harbor仓库 <a class="header-anchor" href="#harbor仓库" aria-label="Permalink to &quot;Harbor仓库&quot;">​</a></h1><p>Harbor仓库常用来作为Docker镜像的私有镜像仓库使用，本文使用容器的方式来进行本地搭建。</p><h2 id="安装harbor" tabindex="-1">安装Harbor <a class="header-anchor" href="#安装harbor" aria-label="Permalink to &quot;安装Harbor&quot;">​</a></h2><h3 id="安装环境" tabindex="-1">安装环境 <a class="header-anchor" href="#安装环境" aria-label="Permalink to &quot;安装环境&quot;">​</a></h3><ul><li>安装机器：Linux服务器，本文中使用服务器的IP为<code>192.168.10.122</code>；</li><li>Docker环境：参考<a href="/zh/tools/docker.html">安装Docker</a>；</li><li>Docker Compose环境：参考如下脚本安装：<div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">sudo</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">curl</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-L</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(</span><span style="color:#B392F0;">uname</span><span style="color:#9ECBFF;"> </span><span style="color:#79B8FF;">-s</span><span style="color:#9ECBFF;">)-$(</span><span style="color:#B392F0;">uname</span><span style="color:#9ECBFF;"> </span><span style="color:#79B8FF;">-m</span><span style="color:#9ECBFF;">)&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-o</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">/usr/local/bin/docker-compose</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">sudo</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">chmod</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">+x</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">/usr/local/bin/docker-compose</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">sudo</span><span style="color:#24292E;"> </span><span style="color:#032F62;">curl</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-L</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(</span><span style="color:#6F42C1;">uname</span><span style="color:#032F62;"> </span><span style="color:#005CC5;">-s</span><span style="color:#032F62;">)-$(</span><span style="color:#6F42C1;">uname</span><span style="color:#032F62;"> </span><span style="color:#005CC5;">-m</span><span style="color:#032F62;">)&quot;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-o</span><span style="color:#24292E;"> </span><span style="color:#032F62;">/usr/local/bin/docker-compose</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">sudo</span><span style="color:#24292E;"> </span><span style="color:#032F62;">chmod</span><span style="color:#24292E;"> </span><span style="color:#032F62;">+x</span><span style="color:#24292E;"> </span><span style="color:#032F62;">/usr/local/bin/docker-compose</span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>harbor安装过程中可能出现docker-compose未安装或者权限不足，需要创建个软连接</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">sudo</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">ln</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-s</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">/usr/local/bin/docker-compose</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">/usr/bin/docker-compose</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">sudo</span><span style="color:#24292E;"> </span><span style="color:#032F62;">ln</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-s</span><span style="color:#24292E;"> </span><span style="color:#032F62;">/usr/local/bin/docker-compose</span><span style="color:#24292E;"> </span><span style="color:#032F62;">/usr/bin/docker-compose</span></span></code></pre></div></div></li></ul><h3 id="准备harbor安装包" tabindex="-1">准备Harbor安装包 <a class="header-anchor" href="#准备harbor安装包" aria-label="Permalink to &quot;准备Harbor安装包&quot;">​</a></h3><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;"># 下载Harbor包</span></span>
<span class="line"><span style="color:#B392F0;">wget</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">https://storage.googleapis.com/harbor-releases/release-1.8.0/harbor-online-installer-v1.8.1.tgz</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 解压Harbor包</span></span>
<span class="line"><span style="color:#B392F0;">tar</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">zxvf</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">harbor-online-installer-v1.8.1.tgz</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF;">cd</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">harbor</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;"># 下载Harbor包</span></span>
<span class="line"><span style="color:#6F42C1;">wget</span><span style="color:#24292E;"> </span><span style="color:#032F62;">https://storage.googleapis.com/harbor-releases/release-1.8.0/harbor-online-installer-v1.8.1.tgz</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 解压Harbor包</span></span>
<span class="line"><span style="color:#6F42C1;">tar</span><span style="color:#24292E;"> </span><span style="color:#032F62;">zxvf</span><span style="color:#24292E;"> </span><span style="color:#032F62;">harbor-online-installer-v1.8.1.tgz</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;">cd</span><span style="color:#24292E;"> </span><span style="color:#032F62;">harbor</span></span></code></pre></div><h3 id="准备配置文件" tabindex="-1">准备配置文件 <a class="header-anchor" href="#准备配置文件" aria-label="Permalink to &quot;准备配置文件&quot;">​</a></h3><p>Harbor的配置文件为<code>harbor.yml</code>:</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;"># Configuration file of Harbor</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># The IP address or hostname to access admin UI and registry service.</span></span>
<span class="line"><span style="color:#6A737D;"># DO NOT use localhost or 127.0.0.1, because Harbor needs to be accessed by external clients.</span></span>
<span class="line"><span style="color:#B392F0;">hostname:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">115.239</span><span style="color:#9ECBFF;">.209.123</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># http related config</span></span>
<span class="line"><span style="color:#B392F0;">http:</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;"># port for http, default is 80. If https enabled, this port will redirect to https port</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">port:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">80</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># https related config</span></span>
<span class="line"><span style="color:#6A737D;"># https:</span></span>
<span class="line"><span style="color:#6A737D;">#   # https port for harbor, default is 443</span></span>
<span class="line"><span style="color:#6A737D;">#   port: 443</span></span>
<span class="line"><span style="color:#6A737D;">#   # The path of cert and key files for nginx</span></span>
<span class="line"><span style="color:#6A737D;">#   certificate: /your/certificate/path</span></span>
<span class="line"><span style="color:#6A737D;">#   private_key: /your/private/key/path</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># Uncomment external_url if you want to enable external proxy</span></span>
<span class="line"><span style="color:#6A737D;"># And when it enabled the hostname will no longer used</span></span>
<span class="line"><span style="color:#6A737D;"># external_url: https://reg.mydomain.com:8433</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># The initial password of Harbor admin</span></span>
<span class="line"><span style="color:#6A737D;"># It only works in first time to install harbor</span></span>
<span class="line"><span style="color:#6A737D;"># Remember Change the admin password from UI after launching Harbor.</span></span>
<span class="line"><span style="color:#B392F0;">harbor_admin_password:</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">Harbor12345</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># Harbor DB configuration</span></span>
<span class="line"><span style="color:#B392F0;">database:</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;"># The password for the root user of Harbor DB. Change this before any production use.</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">password:</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">root123</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># The default data volume</span></span>
<span class="line"><span style="color:#B392F0;">data_volume:</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">/home/zqxu/xzq/harbor_data</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># Harbor Storage settings by default is using /data dir on local filesystem</span></span>
<span class="line"><span style="color:#6A737D;"># Uncomment storage_service setting If you want to using external storage</span></span>
<span class="line"><span style="color:#6A737D;"># storage_service:</span></span>
<span class="line"><span style="color:#6A737D;">#   # ca_bundle is the path to the custom root ca certificate, which will be injected into the truststore</span></span>
<span class="line"><span style="color:#6A737D;">#   # of registry&#39;s and chart repository&#39;s containers.  This is usually needed when the user hosts a internal storage with self signed certificate.</span></span>
<span class="line"><span style="color:#6A737D;">#   ca_bundle:</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">#   # storage backend, default is filesystem, options include filesystem, azure, gcs, s3, swift and oss</span></span>
<span class="line"><span style="color:#6A737D;">#   # for more info about this configuration please refer https://docs.docker.com/registry/configuration/</span></span>
<span class="line"><span style="color:#6A737D;">#   filesystem:</span></span>
<span class="line"><span style="color:#6A737D;">#     maxthreads: 100</span></span>
<span class="line"><span style="color:#6A737D;">#   # set disable to true when you want to disable registry redirect</span></span>
<span class="line"><span style="color:#6A737D;">#   redirect:</span></span>
<span class="line"><span style="color:#6A737D;">#     disabled: false</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># Clair configuration</span></span>
<span class="line"><span style="color:#B392F0;">clair:</span><span style="color:#E1E4E8;"> </span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;"># The interval of clair updaters, the unit is hour, set to 0 to disable the updaters.</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">updaters_interval:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">12</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;"># Config http proxy for Clair, e.g. http://my.proxy.com:3128</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;"># Clair doesn&#39;t need to connect to harbor internal components via http proxy.</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">http_proxy:</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">https_proxy:</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">no_proxy:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">127.0</span><span style="color:#9ECBFF;">.0.1,localhost,core,registry</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">jobservice:</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;"># Maximum number of job workers in job service  </span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">max_job_workers:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">10</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">chart:</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;"># Change the value of absolute_url to enabled can enable absolute url in chart</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">absolute_url:</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">disabled</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># Log configurations</span></span>
<span class="line"><span style="color:#B392F0;">log:</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;"># options are debug, info, warning, error, fatal</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">level:</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">info</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;"># Log files are rotated log_rotate_count times before being removed. If count is 0, old versions are removed rather than rotated.</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">rotate_count:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">50</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;"># Log files are rotated only if they grow bigger than log_rotate_size bytes. If size is followed by k, the size is assumed to be in kilobytes. </span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;"># If the M is used, the size is in megabytes, and if G is used, the size is in gigabytes. So size 100, size 100k, size 100M and size 100G </span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;"># are all valid.</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">rotate_size:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">200</span><span style="color:#9ECBFF;">M</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;"># The directory on your host that store log</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">location:</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">/home/zqxu/xzq/harbor/log</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">#This attribute is for migrator to detect the version of the .cfg file, DO NOT MODIFY!</span></span>
<span class="line"><span style="color:#B392F0;">_version:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">1.8</span><span style="color:#9ECBFF;">.0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># Uncomment external_database if using external database.</span></span>
<span class="line"><span style="color:#6A737D;"># external_database:</span></span>
<span class="line"><span style="color:#6A737D;">#   harbor:</span></span>
<span class="line"><span style="color:#6A737D;">#     host: harbor_db_host</span></span>
<span class="line"><span style="color:#6A737D;">#     port: harbor_db_port</span></span>
<span class="line"><span style="color:#6A737D;">#     db_name: harbor_db_name</span></span>
<span class="line"><span style="color:#6A737D;">#     username: harbor_db_username</span></span>
<span class="line"><span style="color:#6A737D;">#     password: harbor_db_password</span></span>
<span class="line"><span style="color:#6A737D;">#     ssl_mode: disable</span></span>
<span class="line"><span style="color:#6A737D;">#   clair:</span></span>
<span class="line"><span style="color:#6A737D;">#     host: clair_db_host</span></span>
<span class="line"><span style="color:#6A737D;">#     port: clair_db_port</span></span>
<span class="line"><span style="color:#6A737D;">#     db_name: clair_db_name</span></span>
<span class="line"><span style="color:#6A737D;">#     username: clair_db_username</span></span>
<span class="line"><span style="color:#6A737D;">#     password: clair_db_password</span></span>
<span class="line"><span style="color:#6A737D;">#     ssl_mode: disable</span></span>
<span class="line"><span style="color:#6A737D;">#   notary_signer:</span></span>
<span class="line"><span style="color:#6A737D;">#     host: notary_signer_db_host</span></span>
<span class="line"><span style="color:#6A737D;">#     port: notary_signer_db_port</span></span>
<span class="line"><span style="color:#6A737D;">#     db_name: notary_signer_db_name</span></span>
<span class="line"><span style="color:#6A737D;">#     username: notary_signer_db_username</span></span>
<span class="line"><span style="color:#6A737D;">#     password: notary_signer_db_password</span></span>
<span class="line"><span style="color:#6A737D;">#     ssl_mode: disable</span></span>
<span class="line"><span style="color:#6A737D;">#   notary_server:</span></span>
<span class="line"><span style="color:#6A737D;">#     host: notary_server_db_host</span></span>
<span class="line"><span style="color:#6A737D;">#     port: notary_server_db_port</span></span>
<span class="line"><span style="color:#6A737D;">#     db_name: notary_server_db_name</span></span>
<span class="line"><span style="color:#6A737D;">#     username: notary_server_db_username</span></span>
<span class="line"><span style="color:#6A737D;">#     password: notary_server_db_password</span></span>
<span class="line"><span style="color:#6A737D;">#     ssl_mode: disable</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># Uncomment external_redis if using external Redis server</span></span>
<span class="line"><span style="color:#6A737D;"># external_redis:</span></span>
<span class="line"><span style="color:#6A737D;">#   host: redis</span></span>
<span class="line"><span style="color:#6A737D;">#   port: 6379</span></span>
<span class="line"><span style="color:#6A737D;">#   password:</span></span>
<span class="line"><span style="color:#6A737D;">#   # db_index 0 is for core, it&#39;s unchangeable</span></span>
<span class="line"><span style="color:#6A737D;">#   registry_db_index: 1</span></span>
<span class="line"><span style="color:#6A737D;">#   jobservice_db_index: 2</span></span>
<span class="line"><span style="color:#6A737D;">#   chartmuseum_db_index: 3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># Uncomment uaa for trusting the certificate of uaa instance that is hosted via self-signed cert.</span></span>
<span class="line"><span style="color:#6A737D;"># uaa:</span></span>
<span class="line"><span style="color:#6A737D;">#   ca_file: /path/to/ca</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;"># Configuration file of Harbor</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># The IP address or hostname to access admin UI and registry service.</span></span>
<span class="line"><span style="color:#6A737D;"># DO NOT use localhost or 127.0.0.1, because Harbor needs to be accessed by external clients.</span></span>
<span class="line"><span style="color:#6F42C1;">hostname:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">115.239</span><span style="color:#032F62;">.209.123</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># http related config</span></span>
<span class="line"><span style="color:#6F42C1;">http:</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;"># port for http, default is 80. If https enabled, this port will redirect to https port</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">port:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">80</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># https related config</span></span>
<span class="line"><span style="color:#6A737D;"># https:</span></span>
<span class="line"><span style="color:#6A737D;">#   # https port for harbor, default is 443</span></span>
<span class="line"><span style="color:#6A737D;">#   port: 443</span></span>
<span class="line"><span style="color:#6A737D;">#   # The path of cert and key files for nginx</span></span>
<span class="line"><span style="color:#6A737D;">#   certificate: /your/certificate/path</span></span>
<span class="line"><span style="color:#6A737D;">#   private_key: /your/private/key/path</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># Uncomment external_url if you want to enable external proxy</span></span>
<span class="line"><span style="color:#6A737D;"># And when it enabled the hostname will no longer used</span></span>
<span class="line"><span style="color:#6A737D;"># external_url: https://reg.mydomain.com:8433</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># The initial password of Harbor admin</span></span>
<span class="line"><span style="color:#6A737D;"># It only works in first time to install harbor</span></span>
<span class="line"><span style="color:#6A737D;"># Remember Change the admin password from UI after launching Harbor.</span></span>
<span class="line"><span style="color:#6F42C1;">harbor_admin_password:</span><span style="color:#24292E;"> </span><span style="color:#032F62;">Harbor12345</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># Harbor DB configuration</span></span>
<span class="line"><span style="color:#6F42C1;">database:</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;"># The password for the root user of Harbor DB. Change this before any production use.</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">password:</span><span style="color:#24292E;"> </span><span style="color:#032F62;">root123</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># The default data volume</span></span>
<span class="line"><span style="color:#6F42C1;">data_volume:</span><span style="color:#24292E;"> </span><span style="color:#032F62;">/home/zqxu/xzq/harbor_data</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># Harbor Storage settings by default is using /data dir on local filesystem</span></span>
<span class="line"><span style="color:#6A737D;"># Uncomment storage_service setting If you want to using external storage</span></span>
<span class="line"><span style="color:#6A737D;"># storage_service:</span></span>
<span class="line"><span style="color:#6A737D;">#   # ca_bundle is the path to the custom root ca certificate, which will be injected into the truststore</span></span>
<span class="line"><span style="color:#6A737D;">#   # of registry&#39;s and chart repository&#39;s containers.  This is usually needed when the user hosts a internal storage with self signed certificate.</span></span>
<span class="line"><span style="color:#6A737D;">#   ca_bundle:</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">#   # storage backend, default is filesystem, options include filesystem, azure, gcs, s3, swift and oss</span></span>
<span class="line"><span style="color:#6A737D;">#   # for more info about this configuration please refer https://docs.docker.com/registry/configuration/</span></span>
<span class="line"><span style="color:#6A737D;">#   filesystem:</span></span>
<span class="line"><span style="color:#6A737D;">#     maxthreads: 100</span></span>
<span class="line"><span style="color:#6A737D;">#   # set disable to true when you want to disable registry redirect</span></span>
<span class="line"><span style="color:#6A737D;">#   redirect:</span></span>
<span class="line"><span style="color:#6A737D;">#     disabled: false</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># Clair configuration</span></span>
<span class="line"><span style="color:#6F42C1;">clair:</span><span style="color:#24292E;"> </span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;"># The interval of clair updaters, the unit is hour, set to 0 to disable the updaters.</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">updaters_interval:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">12</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;"># Config http proxy for Clair, e.g. http://my.proxy.com:3128</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;"># Clair doesn&#39;t need to connect to harbor internal components via http proxy.</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">http_proxy:</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">https_proxy:</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">no_proxy:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">127.0</span><span style="color:#032F62;">.0.1,localhost,core,registry</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">jobservice:</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;"># Maximum number of job workers in job service  </span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">max_job_workers:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">10</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">chart:</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;"># Change the value of absolute_url to enabled can enable absolute url in chart</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">absolute_url:</span><span style="color:#24292E;"> </span><span style="color:#032F62;">disabled</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># Log configurations</span></span>
<span class="line"><span style="color:#6F42C1;">log:</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;"># options are debug, info, warning, error, fatal</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">level:</span><span style="color:#24292E;"> </span><span style="color:#032F62;">info</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;"># Log files are rotated log_rotate_count times before being removed. If count is 0, old versions are removed rather than rotated.</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">rotate_count:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">50</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;"># Log files are rotated only if they grow bigger than log_rotate_size bytes. If size is followed by k, the size is assumed to be in kilobytes. </span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;"># If the M is used, the size is in megabytes, and if G is used, the size is in gigabytes. So size 100, size 100k, size 100M and size 100G </span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;"># are all valid.</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">rotate_size:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">200</span><span style="color:#032F62;">M</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;"># The directory on your host that store log</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">location:</span><span style="color:#24292E;"> </span><span style="color:#032F62;">/home/zqxu/xzq/harbor/log</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">#This attribute is for migrator to detect the version of the .cfg file, DO NOT MODIFY!</span></span>
<span class="line"><span style="color:#6F42C1;">_version:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1.8</span><span style="color:#032F62;">.0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># Uncomment external_database if using external database.</span></span>
<span class="line"><span style="color:#6A737D;"># external_database:</span></span>
<span class="line"><span style="color:#6A737D;">#   harbor:</span></span>
<span class="line"><span style="color:#6A737D;">#     host: harbor_db_host</span></span>
<span class="line"><span style="color:#6A737D;">#     port: harbor_db_port</span></span>
<span class="line"><span style="color:#6A737D;">#     db_name: harbor_db_name</span></span>
<span class="line"><span style="color:#6A737D;">#     username: harbor_db_username</span></span>
<span class="line"><span style="color:#6A737D;">#     password: harbor_db_password</span></span>
<span class="line"><span style="color:#6A737D;">#     ssl_mode: disable</span></span>
<span class="line"><span style="color:#6A737D;">#   clair:</span></span>
<span class="line"><span style="color:#6A737D;">#     host: clair_db_host</span></span>
<span class="line"><span style="color:#6A737D;">#     port: clair_db_port</span></span>
<span class="line"><span style="color:#6A737D;">#     db_name: clair_db_name</span></span>
<span class="line"><span style="color:#6A737D;">#     username: clair_db_username</span></span>
<span class="line"><span style="color:#6A737D;">#     password: clair_db_password</span></span>
<span class="line"><span style="color:#6A737D;">#     ssl_mode: disable</span></span>
<span class="line"><span style="color:#6A737D;">#   notary_signer:</span></span>
<span class="line"><span style="color:#6A737D;">#     host: notary_signer_db_host</span></span>
<span class="line"><span style="color:#6A737D;">#     port: notary_signer_db_port</span></span>
<span class="line"><span style="color:#6A737D;">#     db_name: notary_signer_db_name</span></span>
<span class="line"><span style="color:#6A737D;">#     username: notary_signer_db_username</span></span>
<span class="line"><span style="color:#6A737D;">#     password: notary_signer_db_password</span></span>
<span class="line"><span style="color:#6A737D;">#     ssl_mode: disable</span></span>
<span class="line"><span style="color:#6A737D;">#   notary_server:</span></span>
<span class="line"><span style="color:#6A737D;">#     host: notary_server_db_host</span></span>
<span class="line"><span style="color:#6A737D;">#     port: notary_server_db_port</span></span>
<span class="line"><span style="color:#6A737D;">#     db_name: notary_server_db_name</span></span>
<span class="line"><span style="color:#6A737D;">#     username: notary_server_db_username</span></span>
<span class="line"><span style="color:#6A737D;">#     password: notary_server_db_password</span></span>
<span class="line"><span style="color:#6A737D;">#     ssl_mode: disable</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># Uncomment external_redis if using external Redis server</span></span>
<span class="line"><span style="color:#6A737D;"># external_redis:</span></span>
<span class="line"><span style="color:#6A737D;">#   host: redis</span></span>
<span class="line"><span style="color:#6A737D;">#   port: 6379</span></span>
<span class="line"><span style="color:#6A737D;">#   password:</span></span>
<span class="line"><span style="color:#6A737D;">#   # db_index 0 is for core, it&#39;s unchangeable</span></span>
<span class="line"><span style="color:#6A737D;">#   registry_db_index: 1</span></span>
<span class="line"><span style="color:#6A737D;">#   jobservice_db_index: 2</span></span>
<span class="line"><span style="color:#6A737D;">#   chartmuseum_db_index: 3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># Uncomment uaa for trusting the certificate of uaa instance that is hosted via self-signed cert.</span></span>
<span class="line"><span style="color:#6A737D;"># uaa:</span></span>
<span class="line"><span style="color:#6A737D;">#   ca_file: /path/to/ca</span></span></code></pre></div><h4 id="修改hostname为本机ip地址" tabindex="-1">修改hostname为本机ip地址 <a class="header-anchor" href="#修改hostname为本机ip地址" aria-label="Permalink to &quot;修改hostname为本机ip地址&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">hostname: 192.168.10.122</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">hostname: 192.168.10.122</span></span></code></pre></div><h4 id="修改data路径" tabindex="-1">修改data路径 <a class="header-anchor" href="#修改data路径" aria-label="Permalink to &quot;修改data路径&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;"># The default data volume</span></span>
<span class="line"><span style="color:#e1e4e8;">data_volume: /home/zqxu/xzq/harbor_data</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;"># The default data volume</span></span>
<span class="line"><span style="color:#24292e;">data_volume: /home/zqxu/xzq/harbor_data</span></span></code></pre></div><h4 id="修改log路径" tabindex="-1">修改log路径 <a class="header-anchor" href="#修改log路径" aria-label="Permalink to &quot;修改log路径&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">log:</span></span>
<span class="line"><span style="color:#e1e4e8;">  # The directory on your host that store log</span></span>
<span class="line"><span style="color:#e1e4e8;">  location: /home/zqxu/xzq/harbor/log</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">log:</span></span>
<span class="line"><span style="color:#24292e;">  # The directory on your host that store log</span></span>
<span class="line"><span style="color:#24292e;">  location: /home/zqxu/xzq/harbor/log</span></span></code></pre></div><h3 id="执行安装脚本" tabindex="-1">执行安装脚本 <a class="header-anchor" href="#执行安装脚本" aria-label="Permalink to &quot;执行安装脚本&quot;">​</a></h3><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">./install.sh</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 控制台打印信息</span></span>
<span class="line"><span style="color:#B392F0;">✔</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">----Harbor</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">has</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">been</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">installed</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">and</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">started</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">successfully.</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">----Now</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">you</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">should</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">be</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">able</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">to</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">visit</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">the</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">admin</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">portal</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">at</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">http://192.168.10.122.</span></span>
<span class="line"><span style="color:#B392F0;">For</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">more</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">details,</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">please</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">visit</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">https://github.com/goharbor/harbor</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">.</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">./install.sh</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 控制台打印信息</span></span>
<span class="line"><span style="color:#6F42C1;">✔</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">----Harbor</span><span style="color:#24292E;"> </span><span style="color:#032F62;">has</span><span style="color:#24292E;"> </span><span style="color:#032F62;">been</span><span style="color:#24292E;"> </span><span style="color:#032F62;">installed</span><span style="color:#24292E;"> </span><span style="color:#032F62;">and</span><span style="color:#24292E;"> </span><span style="color:#032F62;">started</span><span style="color:#24292E;"> </span><span style="color:#032F62;">successfully.</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">----Now</span><span style="color:#24292E;"> </span><span style="color:#032F62;">you</span><span style="color:#24292E;"> </span><span style="color:#032F62;">should</span><span style="color:#24292E;"> </span><span style="color:#032F62;">be</span><span style="color:#24292E;"> </span><span style="color:#032F62;">able</span><span style="color:#24292E;"> </span><span style="color:#032F62;">to</span><span style="color:#24292E;"> </span><span style="color:#032F62;">visit</span><span style="color:#24292E;"> </span><span style="color:#032F62;">the</span><span style="color:#24292E;"> </span><span style="color:#032F62;">admin</span><span style="color:#24292E;"> </span><span style="color:#032F62;">portal</span><span style="color:#24292E;"> </span><span style="color:#032F62;">at</span><span style="color:#24292E;"> </span><span style="color:#032F62;">http://192.168.10.122.</span></span>
<span class="line"><span style="color:#6F42C1;">For</span><span style="color:#24292E;"> </span><span style="color:#032F62;">more</span><span style="color:#24292E;"> </span><span style="color:#032F62;">details,</span><span style="color:#24292E;"> </span><span style="color:#032F62;">please</span><span style="color:#24292E;"> </span><span style="color:#032F62;">visit</span><span style="color:#24292E;"> </span><span style="color:#032F62;">https://github.com/goharbor/harbor</span><span style="color:#24292E;"> </span><span style="color:#032F62;">.</span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>之后如果你想修改某一个配置,先修改<code>harbor.yaml</code>文件,之后重新执行<code>install.sh</code>脚本就可以了。</p></div><h2 id="访问harbor" tabindex="-1">访问Harbor <a class="header-anchor" href="#访问harbor" aria-label="Permalink to &quot;访问Harbor&quot;">​</a></h2><h3 id="浏览器访问harbor" tabindex="-1">浏览器访问Harbor <a class="header-anchor" href="#浏览器访问harbor" aria-label="Permalink to &quot;浏览器访问Harbor&quot;">​</a></h3><p>在浏览器中打开以下地址：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;"># $hostname：\`harbor.yaml\`中配置的\`hostname\`的值</span></span>
<span class="line"><span style="color:#6A737D;"># 登录账号：admin</span></span>
<span class="line"><span style="color:#6A737D;"># 登录密码：Harbor12345</span></span>
<span class="line"><span style="color:#B392F0;">http://$hostname/</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;"># $hostname：\`harbor.yaml\`中配置的\`hostname\`的值</span></span>
<span class="line"><span style="color:#6A737D;"># 登录账号：admin</span></span>
<span class="line"><span style="color:#6A737D;"># 登录密码：Harbor12345</span></span>
<span class="line"><span style="color:#6F42C1;">http://$hostname/</span></span></code></pre></div><h3 id="docker访问harbor" tabindex="-1">Docker访问Harbor <a class="header-anchor" href="#docker访问harbor" aria-label="Permalink to &quot;Docker访问Harbor&quot;">​</a></h3><h4 id="配置docker" tabindex="-1">配置Docker <a class="header-anchor" href="#配置docker" aria-label="Permalink to &quot;配置Docker&quot;">​</a></h4><p>参考 <a href="/zh/tools/docker.html#配置docker">配置Docker</a>.</p><h4 id="登录harbor" tabindex="-1">登录Harbor <a class="header-anchor" href="#登录harbor" aria-label="Permalink to &quot;登录Harbor&quot;">​</a></h4><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;"># $hostname：\`harbor.yaml\`中配置的\`hostname\`的值</span></span>
<span class="line"><span style="color:#B392F0;">docker</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">login</span><span style="color:#E1E4E8;"> $hostname </span><span style="color:#79B8FF;">-u</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">admin</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-p</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">Harbor12345</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;"># $hostname：\`harbor.yaml\`中配置的\`hostname\`的值</span></span>
<span class="line"><span style="color:#6F42C1;">docker</span><span style="color:#24292E;"> </span><span style="color:#032F62;">login</span><span style="color:#24292E;"> $hostname </span><span style="color:#005CC5;">-u</span><span style="color:#24292E;"> </span><span style="color:#032F62;">admin</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-p</span><span style="color:#24292E;"> </span><span style="color:#032F62;">Harbor12345</span></span></code></pre></div><h4 id="上传镜像至harbor镜像" tabindex="-1">上传镜像至Harbor镜像 <a class="header-anchor" href="#上传镜像至harbor镜像" aria-label="Permalink to &quot;上传镜像至Harbor镜像&quot;">​</a></h4><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;"># $hostname：\`harbor.yaml\`中配置的\`hostname\`的值</span></span>
<span class="line"><span style="color:#B392F0;">docker</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">push</span><span style="color:#E1E4E8;"> $hostname</span><span style="color:#9ECBFF;">/</span><span style="color:#E1E4E8;">$repository</span><span style="color:#9ECBFF;">/</span><span style="color:#E1E4E8;">$name</span><span style="color:#9ECBFF;">:</span><span style="color:#E1E4E8;">$tag</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;"># $hostname：\`harbor.yaml\`中配置的\`hostname\`的值</span></span>
<span class="line"><span style="color:#6F42C1;">docker</span><span style="color:#24292E;"> </span><span style="color:#032F62;">push</span><span style="color:#24292E;"> $hostname</span><span style="color:#032F62;">/</span><span style="color:#24292E;">$repository</span><span style="color:#032F62;">/</span><span style="color:#24292E;">$name</span><span style="color:#032F62;">:</span><span style="color:#24292E;">$tag</span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>需要先登录Harbor页面，创建项目<code>$repository</code>.</p></div>`,31),e=[p];function r(t,c,i,y,d,h){return a(),n("div",null,e)}const u=s(o,[["render",r]]);export{b as __pageData,u as default};
