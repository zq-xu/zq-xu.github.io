import{_ as s,c as a,o as n,a as l}from"./app.09261a68.js";const b=JSON.parse('{"title":"Harbor仓库","description":"","frontmatter":{"date":"2022-11-30T00:00:00.000Z"},"headers":[{"level":2,"title":"安装Harbor","slug":"安装harbor","link":"#安装harbor","children":[{"level":3,"title":"安装环境","slug":"安装环境","link":"#安装环境","children":[]},{"level":3,"title":"准备Harbor安装包","slug":"准备harbor安装包","link":"#准备harbor安装包","children":[]},{"level":3,"title":"准备配置文件","slug":"准备配置文件","link":"#准备配置文件","children":[]},{"level":3,"title":"执行安装脚本","slug":"执行安装脚本","link":"#执行安装脚本","children":[]}]},{"level":2,"title":"访问Harbor","slug":"访问harbor","link":"#访问harbor","children":[{"level":3,"title":"浏览器访问Harbor","slug":"浏览器访问harbor","link":"#浏览器访问harbor","children":[]},{"level":3,"title":"Docker访问Harbor","slug":"docker访问harbor","link":"#docker访问harbor","children":[]}]}],"relativePath":"zh/tools/harbor.md"}'),e={name:"zh/tools/harbor.md"},o=l(`<h1 id="harbor仓库" tabindex="-1">Harbor仓库 <a class="header-anchor" href="#harbor仓库" aria-hidden="true">#</a></h1><p>Harbor仓库常用来作为Docker镜像的私有镜像仓库使用，本文使用容器的方式来进行本地搭建。</p><h2 id="安装harbor" tabindex="-1">安装Harbor <a class="header-anchor" href="#安装harbor" aria-hidden="true">#</a></h2><h3 id="安装环境" tabindex="-1">安装环境 <a class="header-anchor" href="#安装环境" aria-hidden="true">#</a></h3><ul><li>安装机器：Linux服务器，本文中使用服务器的IP为<code>192.168.10.122</code>；</li><li>Docker环境：参考<a href="/zh/tools/docker.html">安装Docker</a>；</li><li>Docker Compose环境：参考如下脚本安装：<div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#FFCB6B;">sudo</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">curl</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-L</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">https://github.com/docker/compose/releases/download/1.24.1/docker-compose-</span><span style="color:#89DDFF;">$(</span><span style="color:#FFCB6B;">uname</span><span style="color:#C3E88D;"> -s</span><span style="color:#89DDFF;">)</span><span style="color:#C3E88D;">-</span><span style="color:#89DDFF;">$(</span><span style="color:#FFCB6B;">uname</span><span style="color:#C3E88D;"> -m</span><span style="color:#89DDFF;">)&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-o</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/usr/local/bin/docker-compose</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFCB6B;">sudo</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">chmod</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">+x</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/usr/local/bin/docker-compose</span></span>
<span class="line"></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>harbor安装过程中可能出现docker-compose未安装或者权限不足，需要创建个软连接</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#FFCB6B;">sudo</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">ln</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-s</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/usr/local/bin/docker-compose</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/usr/bin/docker-compose</span></span>
<span class="line"></span></code></pre></div></div></li></ul><h3 id="准备harbor安装包" tabindex="-1">准备Harbor安装包 <a class="header-anchor" href="#准备harbor安装包" aria-hidden="true">#</a></h3><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#676E95;font-style:italic;"># 下载Harbor包</span></span>
<span class="line"><span style="color:#FFCB6B;">wget</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">https://storage.googleapis.com/harbor-releases/release-1.8.0/harbor-online-installer-v1.8.1.tgz</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># 解压Harbor包</span></span>
<span class="line"><span style="color:#FFCB6B;">tar</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">zxvf</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">harbor-online-installer-v1.8.1.tgz</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">cd</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">harbor</span></span>
<span class="line"></span></code></pre></div><h3 id="准备配置文件" tabindex="-1">准备配置文件 <a class="header-anchor" href="#准备配置文件" aria-hidden="true">#</a></h3><p>Harbor的配置文件为<code>harbor.yml</code>:</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#676E95;font-style:italic;"># Configuration file of Harbor</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># The IP address or hostname to access admin UI and registry service.</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># DO NOT use localhost or 127.0.0.1, because Harbor needs to be accessed by external clients.</span></span>
<span class="line"><span style="color:#FFCB6B;">hostname:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">115.239.209.123</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># http related config</span></span>
<span class="line"><span style="color:#FFCB6B;">http:</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#676E95;font-style:italic;"># port for http, default is 80. If https enabled, this port will redirect to https port</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#FFCB6B;">port:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">80</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># https related config</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># https:</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#   # https port for harbor, default is 443</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#   port: 443</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#   # The path of cert and key files for nginx</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#   certificate: /your/certificate/path</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#   private_key: /your/private/key/path</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># Uncomment external_url if you want to enable external proxy</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># And when it enabled the hostname will no longer used</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># external_url: https://reg.mydomain.com:8433</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># The initial password of Harbor admin</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># It only works in first time to install harbor</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># Remember Change the admin password from UI after launching Harbor.</span></span>
<span class="line"><span style="color:#FFCB6B;">harbor_admin_password:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">Harbor12345</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># Harbor DB configuration</span></span>
<span class="line"><span style="color:#FFCB6B;">database:</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#676E95;font-style:italic;"># The password for the root user of Harbor DB. Change this before any production use.</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#FFCB6B;">password:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">root123</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># The default data volume</span></span>
<span class="line"><span style="color:#FFCB6B;">data_volume:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/home/zqxu/xzq/harbor_data</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># Harbor Storage settings by default is using /data dir on local filesystem</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># Uncomment storage_service setting If you want to using external storage</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># storage_service:</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#   # ca_bundle is the path to the custom root ca certificate, which will be injected into the truststore</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#   # of registry&#39;s and chart repository&#39;s containers.  This is usually needed when the user hosts a internal storage with self signed certificate.</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#   ca_bundle:</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#   # storage backend, default is filesystem, options include filesystem, azure, gcs, s3, swift and oss</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#   # for more info about this configuration please refer https://docs.docker.com/registry/configuration/</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#   filesystem:</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#     maxthreads: 100</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#   # set disable to true when you want to disable registry redirect</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#   redirect:</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#     disabled: false</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># Clair configuration</span></span>
<span class="line"><span style="color:#FFCB6B;">clair:</span><span style="color:#A6ACCD;"> </span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#676E95;font-style:italic;"># The interval of clair updaters, the unit is hour, set to 0 to disable the updaters.</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#FFCB6B;">updaters_interval:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">12</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#676E95;font-style:italic;"># Config http proxy for Clair, e.g. http://my.proxy.com:3128</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#676E95;font-style:italic;"># Clair doesn&#39;t need to connect to harbor internal components via http proxy.</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#FFCB6B;">http_proxy:</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#FFCB6B;">https_proxy:</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#FFCB6B;">no_proxy:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">127.0.0.1,localhost,core,registry</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFCB6B;">jobservice:</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#676E95;font-style:italic;"># Maximum number of job workers in job service  </span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#FFCB6B;">max_job_workers:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">10</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFCB6B;">chart:</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#676E95;font-style:italic;"># Change the value of absolute_url to enabled can enable absolute url in chart</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#FFCB6B;">absolute_url:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">disabled</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># Log configurations</span></span>
<span class="line"><span style="color:#FFCB6B;">log:</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#676E95;font-style:italic;"># options are debug, info, warning, error, fatal</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#FFCB6B;">level:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">info</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#676E95;font-style:italic;"># Log files are rotated log_rotate_count times before being removed. If count is 0, old versions are removed rather than rotated.</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#FFCB6B;">rotate_count:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">50</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#676E95;font-style:italic;"># Log files are rotated only if they grow bigger than log_rotate_size bytes. If size is followed by k, the size is assumed to be in kilobytes. </span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#676E95;font-style:italic;"># If the M is used, the size is in megabytes, and if G is used, the size is in gigabytes. So size 100, size 100k, size 100M and size 100G </span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#676E95;font-style:italic;"># are all valid.</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#FFCB6B;">rotate_size:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">200M</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#676E95;font-style:italic;"># The directory on your host that store log</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#FFCB6B;">location:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/home/zqxu/xzq/harbor/log</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#This attribute is for migrator to detect the version of the .cfg file, DO NOT MODIFY!</span></span>
<span class="line"><span style="color:#FFCB6B;">_version:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">1.8.0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># Uncomment external_database if using external database.</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># external_database:</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#   harbor:</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#     host: harbor_db_host</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#     port: harbor_db_port</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#     db_name: harbor_db_name</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#     username: harbor_db_username</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#     password: harbor_db_password</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#     ssl_mode: disable</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#   clair:</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#     host: clair_db_host</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#     port: clair_db_port</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#     db_name: clair_db_name</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#     username: clair_db_username</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#     password: clair_db_password</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#     ssl_mode: disable</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#   notary_signer:</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#     host: notary_signer_db_host</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#     port: notary_signer_db_port</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#     db_name: notary_signer_db_name</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#     username: notary_signer_db_username</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#     password: notary_signer_db_password</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#     ssl_mode: disable</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#   notary_server:</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#     host: notary_server_db_host</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#     port: notary_server_db_port</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#     db_name: notary_server_db_name</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#     username: notary_server_db_username</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#     password: notary_server_db_password</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#     ssl_mode: disable</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># Uncomment external_redis if using external Redis server</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># external_redis:</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#   host: redis</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#   port: 6379</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#   password:</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#   # db_index 0 is for core, it&#39;s unchangeable</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#   registry_db_index: 1</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#   jobservice_db_index: 2</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#   chartmuseum_db_index: 3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># Uncomment uaa for trusting the certificate of uaa instance that is hosted via self-signed cert.</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># uaa:</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#   ca_file: /path/to/ca</span></span>
<span class="line"></span>
<span class="line"></span></code></pre></div><h4 id="修改hostname为本机ip地址" tabindex="-1">修改hostname为本机ip地址 <a class="header-anchor" href="#修改hostname为本机ip地址" aria-hidden="true">#</a></h4><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">hostname: 192.168.10.122</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h4 id="修改data路径" tabindex="-1">修改data路径 <a class="header-anchor" href="#修改data路径" aria-hidden="true">#</a></h4><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;"># The default data volume</span></span>
<span class="line"><span style="color:#A6ACCD;">data_volume: /home/zqxu/xzq/harbor_data</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h4 id="修改log路径" tabindex="-1">修改log路径 <a class="header-anchor" href="#修改log路径" aria-hidden="true">#</a></h4><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">log:</span></span>
<span class="line"><span style="color:#A6ACCD;">  # The directory on your host that store log</span></span>
<span class="line"><span style="color:#A6ACCD;">  location: /home/zqxu/xzq/harbor/log</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h3 id="执行安装脚本" tabindex="-1">执行安装脚本 <a class="header-anchor" href="#执行安装脚本" aria-hidden="true">#</a></h3><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#82AAFF;">.</span><span style="color:#FFCB6B;">/install.sh</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># 控制台打印信息</span></span>
<span class="line"><span style="color:#FFCB6B;">✔</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">----Harbor</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">has</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">been</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">installed</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">and</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">started</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">successfully.</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFCB6B;">----Now</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">you</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">should</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">be</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">able</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">to</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">visit</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">the</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">admin</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">portal</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">at</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">http://192.168.10.122.</span></span>
<span class="line"><span style="color:#FFCB6B;">For</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">more</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">details,</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">please</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">visit</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">https://github.com/goharbor/harbor</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">.</span></span>
<span class="line"></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>之后如果你想修改某一个配置,先修改<code>harbor.yaml</code>文件,之后重新执行<code>install.sh</code>脚本就可以了。</p></div><h2 id="访问harbor" tabindex="-1">访问Harbor <a class="header-anchor" href="#访问harbor" aria-hidden="true">#</a></h2><h3 id="浏览器访问harbor" tabindex="-1">浏览器访问Harbor <a class="header-anchor" href="#浏览器访问harbor" aria-hidden="true">#</a></h3><p>在浏览器中打开以下地址：</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#676E95;font-style:italic;"># $hostname：\`harbor.yaml\`中配置的\`hostname\`的值</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># 登录账号：admin</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># 登录密码：Harbor12345</span></span>
<span class="line"><span style="color:#FFCB6B;">http://</span><span style="color:#A6ACCD;">$hostname</span><span style="color:#FFCB6B;">/</span></span>
<span class="line"></span></code></pre></div><h3 id="docker访问harbor" tabindex="-1">Docker访问Harbor <a class="header-anchor" href="#docker访问harbor" aria-hidden="true">#</a></h3><h4 id="配置docker" tabindex="-1">配置Docker <a class="header-anchor" href="#配置docker" aria-hidden="true">#</a></h4><p>参考 <a href="/zh/tools/docker.html#配置docker">配置Docker</a>.</p><h4 id="登录harbor" tabindex="-1">登录Harbor <a class="header-anchor" href="#登录harbor" aria-hidden="true">#</a></h4><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#676E95;font-style:italic;"># $hostname：\`harbor.yaml\`中配置的\`hostname\`的值</span></span>
<span class="line"><span style="color:#FFCB6B;">docker</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">login</span><span style="color:#A6ACCD;"> $hostname </span><span style="color:#C3E88D;">-u</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">admin</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-p</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">Harbor12345</span></span>
<span class="line"></span></code></pre></div><h4 id="上传镜像至harbor镜像" tabindex="-1">上传镜像至Harbor镜像 <a class="header-anchor" href="#上传镜像至harbor镜像" aria-hidden="true">#</a></h4><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#676E95;font-style:italic;"># $hostname：\`harbor.yaml\`中配置的\`hostname\`的值</span></span>
<span class="line"><span style="color:#FFCB6B;">docker</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">push</span><span style="color:#A6ACCD;"> $hostname</span><span style="color:#C3E88D;">/</span><span style="color:#A6ACCD;">$repository</span><span style="color:#C3E88D;">/</span><span style="color:#A6ACCD;">$name</span><span style="color:#C3E88D;">:</span><span style="color:#A6ACCD;">$tag</span></span>
<span class="line"></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>需要先登录Harbor页面，创建项目<code>$repository</code>.</p></div>`,31),p=[o];function t(r,c,i,y,d,C){return n(),a("div",null,p)}const A=s(e,[["render",t]]);export{b as __pageData,A as default};
