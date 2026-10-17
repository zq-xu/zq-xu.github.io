import{_ as s,o as n,c as a,Q as l}from"./chunks/framework.48927342.js";const u=JSON.parse('{"title":"自定义时间类型的JSON字符","description":"","frontmatter":{"tag":["Golang"],"categories":["Golang"],"recommend":4},"headers":[],"relativePath":"zh/coding/golang/practice/time-json.md","filePath":"zh/coding/golang/practice/time-json.md"}'),p={name:"zh/coding/golang/practice/time-json.md"},o=l(`<h1 id="自定义时间类型的json字符" tabindex="-1">自定义时间类型的JSON字符 <a class="header-anchor" href="#自定义时间类型的json字符" aria-label="Permalink to &quot;自定义时间类型的JSON字符&quot;">​</a></h1><p>Go语言中，原生库<code>time.Time</code>表示的时间类型在<code>json</code>序列化或反序列化时对应着固定格式的字符序列，因此，如果希望使用特定格式的字符序列或者使用时间戳等形式，则可以通过自定义类型，并使其继承<code>json.Marshaler</code>和<code>json.Unmarshaler</code>接口来实现。</p><h2 id="代码实现" tabindex="-1">代码实现 <a class="header-anchor" href="#代码实现" aria-label="Permalink to &quot;代码实现&quot;">​</a></h2><div class="language-go vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">package</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">utils</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> (</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">encoding/json</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">time</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">type</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">CustomTime</span><span style="color:#E1E4E8;"> time.Time</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// MarshalJSON implements json.Marshaler.</span></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> (t CustomTime) </span><span style="color:#B392F0;">MarshalJSON</span><span style="color:#E1E4E8;">() ([]</span><span style="color:#F97583;">byte</span><span style="color:#E1E4E8;">, </span><span style="color:#F97583;">error</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">	str </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> time.</span><span style="color:#79B8FF;">Time</span><span style="color:#E1E4E8;">(t).</span><span style="color:#79B8FF;">Format</span><span style="color:#E1E4E8;">(time.DateOnly)</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// return []byte(&quot;\\&quot;&quot; + str + &quot;\\&quot;&quot;), nil</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> json.</span><span style="color:#79B8FF;">Marshal</span><span style="color:#E1E4E8;">(str)</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// UnmarshalJSON implements json.Unmarshaler.</span></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> (t </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">CustomTime) </span><span style="color:#B392F0;">UnmarshalJSON</span><span style="color:#E1E4E8;">(data []</span><span style="color:#F97583;">byte</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">error</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> timeStr </span><span style="color:#F97583;">string</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> json.</span><span style="color:#79B8FF;">Unmarshal</span><span style="color:#E1E4E8;">(data, </span><span style="color:#F97583;">&amp;</span><span style="color:#E1E4E8;">timeStr); err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> err</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// Parse the time string using your desired format</span></span>
<span class="line"><span style="color:#E1E4E8;">	parsedTime, err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> time.</span><span style="color:#79B8FF;">Parse</span><span style="color:#E1E4E8;">(time.DateOnly, timeStr)</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> err</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">t </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">CustomTime</span><span style="color:#E1E4E8;">(parsedTime)</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">package</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">utils</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> (</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">encoding/json</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">time</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">type</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">CustomTime</span><span style="color:#24292E;"> time.Time</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// MarshalJSON implements json.Marshaler.</span></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> (t CustomTime) </span><span style="color:#6F42C1;">MarshalJSON</span><span style="color:#24292E;">() ([]</span><span style="color:#D73A49;">byte</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">error</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">	str </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> time.</span><span style="color:#005CC5;">Time</span><span style="color:#24292E;">(t).</span><span style="color:#005CC5;">Format</span><span style="color:#24292E;">(time.DateOnly)</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// return []byte(&quot;\\&quot;&quot; + str + &quot;\\&quot;&quot;), nil</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> json.</span><span style="color:#005CC5;">Marshal</span><span style="color:#24292E;">(str)</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// UnmarshalJSON implements json.Unmarshaler.</span></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> (t </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">CustomTime) </span><span style="color:#6F42C1;">UnmarshalJSON</span><span style="color:#24292E;">(data []</span><span style="color:#D73A49;">byte</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">error</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">var</span><span style="color:#24292E;"> timeStr </span><span style="color:#D73A49;">string</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> json.</span><span style="color:#005CC5;">Unmarshal</span><span style="color:#24292E;">(data, </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">timeStr); err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> err</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// Parse the time string using your desired format</span></span>
<span class="line"><span style="color:#24292E;">	parsedTime, err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> time.</span><span style="color:#005CC5;">Parse</span><span style="color:#24292E;">(time.DateOnly, timeStr)</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> err</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">*</span><span style="color:#24292E;">t </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">CustomTime</span><span style="color:#24292E;">(parsedTime)</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div>`,4),e=[o];function t(r,c,E,y,i,m){return n(),a("div",null,e)}const d=s(p,[["render",t]]);export{u as __pageData,d as default};
