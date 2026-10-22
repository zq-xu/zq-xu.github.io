import{_ as s,o as e,c as a,Q as n}from"./chunks/framework.48927342.js";const u=JSON.parse('{"title":"马耳他语练习文档要求","description":"","frontmatter":{},"headers":[],"relativePath":"zh/more/maltese/practice/00-requirements.md","filePath":"zh/more/maltese/practice/00-requirements.md"}'),l={name:"zh/more/maltese/practice/00-requirements.md"},p=n(`<h1 id="马耳他语练习文档要求" tabindex="-1">马耳他语练习文档要求 <a class="header-anchor" href="#马耳他语练习文档要求" aria-label="Permalink to &quot;马耳他语练习文档要求&quot;">​</a></h1><p>本套资料用于马耳他语初学者练习。每篇先完整列出马耳他语短文；短文中的人名使用英语或马耳他语拼写；随后逐句翻译，并逐词说明。每项内容单独保存为 Markdown 文件，另设一个文件作为目录。</p><h2 id="情景对话" tabindex="-1">情景对话 <a class="header-anchor" href="#情景对话" aria-label="Permalink to &quot;情景对话&quot;">​</a></h2><ol><li>两人对话：预约医院的时间。</li><li>两人对话：失物招领，并预约到警局领取失物的时间。</li><li>两人对话：参加周末派对。</li><li>两人对话：询问当前时间。</li><li>两人对话：闲聊今天、明天、本周末、下周、下个月和明年的计划。</li></ol><h2 id="邮件" tabindex="-1">邮件 <a class="header-anchor" href="#邮件" aria-label="Permalink to &quot;邮件&quot;">​</a></h2><ol start="6"><li>邀请参加生日派对。</li><li>回复生日派对邀请。</li><li>邀请参加婚礼。</li><li>回复婚礼邀请。</li><li>邀请参加晚餐。</li><li>回复晚餐邀请。</li></ol><h2 id="文档与格式" tabindex="-1">文档与格式 <a class="header-anchor" href="#文档与格式" aria-label="Permalink to &quot;文档与格式&quot;">​</a></h2><ul><li>本要求说明作为第一篇 Markdown 文档。</li><li>邮件分类编号按列出顺序从 <code>01</code> 递增；新增邮件主题接在原有邮件之后。</li><li>情景对话和邮件分别放入独立文件夹：<code>dialogues/</code> 与 <code>emails/</code>。</li><li>每个对话或邮件主题各自使用一个 Markdown 文件，并在所属分类中按原始列出顺序从 <code>01</code> 开始编号。</li><li>根目录提供总目录；<code>dialogues/</code> 和 <code>emails/</code> 中也各自提供一个分类目录页。</li><li>每篇短文先完整呈现，再提供逐句中文翻译和逐词拆解。</li><li>短文中的人名使用英语或马耳他语拼写。</li></ul><h2 id="目录结构" tabindex="-1">目录结构 <a class="header-anchor" href="#目录结构" aria-label="Permalink to &quot;目录结构&quot;">​</a></h2><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">practice/</span></span>
<span class="line"><span style="color:#e1e4e8;">├── 00-requirements.md</span></span>
<span class="line"><span style="color:#e1e4e8;">├── index.md</span></span>
<span class="line"><span style="color:#e1e4e8;">├── dialogues/</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── index.md</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── 01-hospital-appointment.md</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── 02-lost-property.md</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── 03-weekend-party.md</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── 04-asking-the-time.md</span></span>
<span class="line"><span style="color:#e1e4e8;">│   └── 05-weekend-plans.md</span></span>
<span class="line"><span style="color:#e1e4e8;">└── emails/</span></span>
<span class="line"><span style="color:#e1e4e8;"> ├── index.md</span></span>
<span class="line"><span style="color:#e1e4e8;"> ├── 01-birthday-invitation.md</span></span>
<span class="line"><span style="color:#e1e4e8;"> ├── 02-birthday-reply.md</span></span>
<span class="line"><span style="color:#e1e4e8;"> ├── 03-wedding-invitation.md</span></span>
<span class="line"><span style="color:#e1e4e8;"> ├── 04-wedding-reply.md</span></span>
<span class="line"><span style="color:#e1e4e8;"> ├── 05-dinner-invitation.md</span></span>
<span class="line"><span style="color:#e1e4e8;"> └── 06-dinner-reply.md</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">practice/</span></span>
<span class="line"><span style="color:#24292e;">├── 00-requirements.md</span></span>
<span class="line"><span style="color:#24292e;">├── index.md</span></span>
<span class="line"><span style="color:#24292e;">├── dialogues/</span></span>
<span class="line"><span style="color:#24292e;">│   ├── index.md</span></span>
<span class="line"><span style="color:#24292e;">│   ├── 01-hospital-appointment.md</span></span>
<span class="line"><span style="color:#24292e;">│   ├── 02-lost-property.md</span></span>
<span class="line"><span style="color:#24292e;">│   ├── 03-weekend-party.md</span></span>
<span class="line"><span style="color:#24292e;">│   ├── 04-asking-the-time.md</span></span>
<span class="line"><span style="color:#24292e;">│   └── 05-weekend-plans.md</span></span>
<span class="line"><span style="color:#24292e;">└── emails/</span></span>
<span class="line"><span style="color:#24292e;"> ├── index.md</span></span>
<span class="line"><span style="color:#24292e;"> ├── 01-birthday-invitation.md</span></span>
<span class="line"><span style="color:#24292e;"> ├── 02-birthday-reply.md</span></span>
<span class="line"><span style="color:#24292e;"> ├── 03-wedding-invitation.md</span></span>
<span class="line"><span style="color:#24292e;"> ├── 04-wedding-reply.md</span></span>
<span class="line"><span style="color:#24292e;"> ├── 05-dinner-invitation.md</span></span>
<span class="line"><span style="color:#24292e;"> └── 06-dinner-reply.md</span></span></code></pre></div>`,10),i=[p];function o(t,c,r,d,m,y){return e(),a("div",null,i)}const _=s(l,[["render",o]]);export{u as __pageData,_ as default};
