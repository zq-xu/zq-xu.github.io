import{_ as s,o as n,c as a,Q as l}from"./chunks/framework.48927342.js";const d=JSON.parse('{"title":"JWT鉴权","description":"","frontmatter":{"tag":["Golang"],"categories":["Golang"],"recommend":3},"headers":[],"relativePath":"zh/coding/golang/practice/jwt.md","filePath":"zh/coding/golang/practice/jwt.md"}'),p={name:"zh/coding/golang/practice/jwt.md"},o=l(`<h1 id="jwt鉴权" tabindex="-1">JWT鉴权 <a class="header-anchor" href="#jwt鉴权" aria-label="Permalink to &quot;JWT鉴权&quot;">​</a></h1><h2 id="jwt定义" tabindex="-1">JWT定义 <a class="header-anchor" href="#jwt定义" aria-label="Permalink to &quot;JWT定义&quot;">​</a></h2><p>JSON Web Token (JWT) 是一个开放标准 ( RFC 7519 )，它定义了一种紧凑且自包含的方式，用于在各方之间以 JSON 对象的形式安全传输信息。此信息可以验证和信任，因为它是数字签名的。JWT 可以使用密钥（使用HMAC算法）或使用RSA或ECDSA的公钥/私钥对进行签名。</p><p>最常用的场景是登录授权。用户登录后，每个后续请求都将包含 JWT，从而允许用户访问该令牌允许的路由、服务和资源。单点登录是当今广泛使用 JWT 的一项功能，因为它的开销很小并且能够在不同的域中轻松使用。</p><p>以上介绍引用自<a href="https://www.sulvblog.cn/posts/tech/jwt/" target="_blank" rel="noreferrer">JWT鉴权详解与实战</a>。</p><p>简单来说，<code>JWT</code>鉴权就是先通过<code>Login</code>来检查用户名密码等信息，合法时返回加密的<code>Token</code>信息作为合法凭证，该<code>Token</code>加入到后续的请求的<code>Header</code>中，用于后续的请求验证。</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>Token的有效期默认为1h,过期后需要重新申请。</p></div><h2 id="golang中的jwt鉴权" tabindex="-1">Golang中的JWT鉴权 <a class="header-anchor" href="#golang中的jwt鉴权" aria-label="Permalink to &quot;Golang中的JWT鉴权&quot;">​</a></h2><p>在Golang项目中，可以使用<code>JWT</code>进行身份认证，较为常用的做法是定义相应的中间件，并加载到相应的路由中。</p><p>此处以<code>Gin</code>框架为例，演示加载<code>JWT</code>中间件。</p><h3 id="定义jwt中间件" tabindex="-1">定义JWT中间件 <a class="header-anchor" href="#定义jwt中间件" aria-label="Permalink to &quot;定义JWT中间件&quot;">​</a></h3><p>此处引用库<code>github.com/appleboy/gin-jwt</code>，定义<code>JWT</code>中间件<code>AuthMiddleware</code>:</p><div class="language-go vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki github-dark has-diff vp-code-dark"><code><span class="line"><span style="color:#F97583;">package</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">auth</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> (</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">time</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#B392F0;">jwt</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">github.com/appleboy/gin-jwt/v2</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> (</span></span>
<span class="line"><span style="color:#E1E4E8;">	AuthUserKey </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;auth_user&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> (</span></span>
<span class="line"><span style="color:#E1E4E8;">	AuthMiddleware </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">jwt.GinJWTMiddleware</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	gjm </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&amp;</span><span style="color:#E1E4E8;">jwt.GinJWTMiddleware{</span></span>
<span class="line"><span style="color:#E1E4E8;">		Key:             []</span><span style="color:#79B8FF;">byte</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;secret key&quot;</span><span style="color:#E1E4E8;">),</span></span>
<span class="line"><span style="color:#E1E4E8;">		Timeout:         time.Hour,</span></span>
<span class="line"><span style="color:#E1E4E8;">		MaxRefresh:      time.Hour,</span></span>
<span class="line"><span style="color:#E1E4E8;">		IdentityKey:     AuthUserKey,</span></span>
<span class="line"><span style="color:#E1E4E8;">		PayloadFunc:     generatePayLoad,</span></span>
<span class="line"><span style="color:#E1E4E8;">		IdentityHandler: identityHandler,</span></span>
<span class="line"><span style="color:#E1E4E8;">		Authenticator:   authenticate,</span></span>
<span class="line"><span style="color:#E1E4E8;">		Authorizator:    authorize,</span></span>
<span class="line"><span style="color:#E1E4E8;">		LoginResponse:   loginResponse,</span></span>
<span class="line"><span style="color:#E1E4E8;">		RefreshResponse: loginResponse,</span></span>
<span class="line"><span style="color:#E1E4E8;">		LogoutResponse:  logoutResponse,</span></span>
<span class="line"><span style="color:#E1E4E8;">		Unauthorized:    unauthorized,</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#6A737D;">// TokenLookup is a string in the form of &quot;&lt;source&gt;:&lt;name&gt;&quot; that is used</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#6A737D;">// to extract token from the request.</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#6A737D;">// Optional. Default value &quot;header:Authorization&quot;.</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#6A737D;">// Possible values:</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#6A737D;">// - &quot;header:&lt;name&gt;&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#6A737D;">// - &quot;query:&lt;name&gt;&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#6A737D;">// - &quot;cookie:&lt;name&gt;&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#6A737D;">// - &quot;param:&lt;name&gt;&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">		TokenLookup: </span><span style="color:#9ECBFF;">&quot;header: Authorization, query: token, cookie: jwt&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#6A737D;">// TokenLookup: &quot;query:token&quot;,</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#6A737D;">// TokenLookup: &quot;cookie:token&quot;,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#6A737D;">// TokenHeadName is a string in the header. Default value is &quot;Bearer&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">		TokenHeadName: </span><span style="color:#9ECBFF;">&quot;Bearer&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#6A737D;">// TimeFunc provides the current time. You can override it to use another time value. This is useful for testing or if your server uses a different time zone than your tokens.</span></span>
<span class="line"><span style="color:#E1E4E8;">		TimeFunc: time.Now,</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">init</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">	AuthMiddleware, _ </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> jwt.</span><span style="color:#79B8FF;">New</span><span style="color:#E1E4E8;">(gjm)</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light has-diff vp-code-light"><code><span class="line"><span style="color:#D73A49;">package</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">auth</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> (</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">time</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6F42C1;">jwt</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">github.com/appleboy/gin-jwt/v2</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> (</span></span>
<span class="line"><span style="color:#24292E;">	AuthUserKey </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;auth_user&quot;</span></span>
<span class="line"><span style="color:#24292E;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">var</span><span style="color:#24292E;"> (</span></span>
<span class="line"><span style="color:#24292E;">	AuthMiddleware </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">jwt.GinJWTMiddleware</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	gjm </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">jwt.GinJWTMiddleware{</span></span>
<span class="line"><span style="color:#24292E;">		Key:             []</span><span style="color:#005CC5;">byte</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;secret key&quot;</span><span style="color:#24292E;">),</span></span>
<span class="line"><span style="color:#24292E;">		Timeout:         time.Hour,</span></span>
<span class="line"><span style="color:#24292E;">		MaxRefresh:      time.Hour,</span></span>
<span class="line"><span style="color:#24292E;">		IdentityKey:     AuthUserKey,</span></span>
<span class="line"><span style="color:#24292E;">		PayloadFunc:     generatePayLoad,</span></span>
<span class="line"><span style="color:#24292E;">		IdentityHandler: identityHandler,</span></span>
<span class="line"><span style="color:#24292E;">		Authenticator:   authenticate,</span></span>
<span class="line"><span style="color:#24292E;">		Authorizator:    authorize,</span></span>
<span class="line"><span style="color:#24292E;">		LoginResponse:   loginResponse,</span></span>
<span class="line"><span style="color:#24292E;">		RefreshResponse: loginResponse,</span></span>
<span class="line"><span style="color:#24292E;">		LogoutResponse:  logoutResponse,</span></span>
<span class="line"><span style="color:#24292E;">		Unauthorized:    unauthorized,</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#6A737D;">// TokenLookup is a string in the form of &quot;&lt;source&gt;:&lt;name&gt;&quot; that is used</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#6A737D;">// to extract token from the request.</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#6A737D;">// Optional. Default value &quot;header:Authorization&quot;.</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#6A737D;">// Possible values:</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#6A737D;">// - &quot;header:&lt;name&gt;&quot;</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#6A737D;">// - &quot;query:&lt;name&gt;&quot;</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#6A737D;">// - &quot;cookie:&lt;name&gt;&quot;</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#6A737D;">// - &quot;param:&lt;name&gt;&quot;</span></span>
<span class="line"><span style="color:#24292E;">		TokenLookup: </span><span style="color:#032F62;">&quot;header: Authorization, query: token, cookie: jwt&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#6A737D;">// TokenLookup: &quot;query:token&quot;,</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#6A737D;">// TokenLookup: &quot;cookie:token&quot;,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#6A737D;">// TokenHeadName is a string in the header. Default value is &quot;Bearer&quot;</span></span>
<span class="line"><span style="color:#24292E;">		TokenHeadName: </span><span style="color:#032F62;">&quot;Bearer&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#6A737D;">// TimeFunc provides the current time. You can override it to use another time value. This is useful for testing or if your server uses a different time zone than your tokens.</span></span>
<span class="line"><span style="color:#24292E;">		TimeFunc: time.Now,</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">init</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">	AuthMiddleware, _ </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> jwt.</span><span style="color:#005CC5;">New</span><span style="color:#24292E;">(gjm)</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>在上述代码定义的<code>JWT</code>中间件中，需要实现的方法如下：</p><ul><li><code>PayloadFunc</code>: 捕捉到请求时，解析其中的token等<code>JWT</code>鉴权信息，并解析；</li><li><code>IdentityHandler</code>: 对解析出来的信息进行相应的校验和转化处理；</li><li><code>Authenticator</code>: 用于登录验证，校验账户密码等信息；</li><li><code>Authorizator</code>: 对每个接收到的请求进行权限校验,非必要方法；</li><li><code>LoginResponse</code>: 登录成功的返回；</li><li><code>RefreshResponse</code>: 刷新<code>JWT</code>鉴权信息，常在token等超时时使用；</li><li><code>LogoutResponse</code>: 登出成功的返回；</li><li><code>Unauthorized</code>: 鉴权失败时调用；</li></ul><h3 id="jwt中间件方法实现" tabindex="-1">JWT中间件方法实现 <a class="header-anchor" href="#jwt中间件方法实现" aria-label="Permalink to &quot;JWT中间件方法实现&quot;">​</a></h3><p>以下代码是<code>JWT</code>中间件中需要实现的方法的示例：</p><div class="language-go vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">package</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">auth</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> (</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">fmt</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">net/http</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#B392F0;">jwt</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">github.com/appleboy/gin-jwt/v2</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">github.com/gin-gonic/gin</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">type</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">User</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">struct</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">	Username </span><span style="color:#F97583;">string</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">\`form:&quot;username&quot; json:&quot;username&quot; binding:&quot;required&quot;\`</span></span>
<span class="line"><span style="color:#E1E4E8;">	Password </span><span style="color:#F97583;">string</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">\`form:&quot;password&quot; json:&quot;password&quot; binding:&quot;required&quot;\`</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">type</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">LoginResp</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">struct</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">	Token  </span><span style="color:#F97583;">string</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">\`json:&quot;token&quot;\`</span></span>
<span class="line"><span style="color:#E1E4E8;">	Expire </span><span style="color:#F97583;">string</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">\`json:&quot;expire&quot;\`</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">type</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">UnauthorizedResp</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">struct</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">	Code    </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;">    </span><span style="color:#9ECBFF;">\`json:&quot;code&quot;\`</span></span>
<span class="line"><span style="color:#E1E4E8;">	Message </span><span style="color:#F97583;">string</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">\`json:&quot;message&quot;\`</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">init</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">	AuthMiddleware, _ </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> jwt.</span><span style="color:#79B8FF;">New</span><span style="color:#E1E4E8;">(gjm)</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">generatePayLoad</span><span style="color:#E1E4E8;">(data </span><span style="color:#F97583;">interface</span><span style="color:#E1E4E8;">{}) jwt.MapClaims {</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> v, ok </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> data.(</span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">User); ok {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> jwt.MapClaims{</span></span>
<span class="line"><span style="color:#E1E4E8;">			AuthUserKey: v.Username,</span></span>
<span class="line"><span style="color:#E1E4E8;">		}</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> jwt.MapClaims{}</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">identityHandler</span><span style="color:#E1E4E8;">(c </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">gin.Context) </span><span style="color:#F97583;">interface</span><span style="color:#E1E4E8;">{} {</span></span>
<span class="line"><span style="color:#E1E4E8;">	claims </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> jwt.</span><span style="color:#79B8FF;">ExtractClaims</span><span style="color:#E1E4E8;">(c)</span></span>
<span class="line"><span style="color:#E1E4E8;">	u </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&amp;</span><span style="color:#E1E4E8;">User{</span></span>
<span class="line"><span style="color:#E1E4E8;">		Username: claims[AuthUserKey].(</span><span style="color:#F97583;">string</span><span style="color:#E1E4E8;">),</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	c.</span><span style="color:#79B8FF;">Set</span><span style="color:#E1E4E8;">(AuthUserKey, u)</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> u</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">authenticate</span><span style="color:#E1E4E8;">(c </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">gin.Context) (</span><span style="color:#F97583;">interface</span><span style="color:#E1E4E8;">{}, </span><span style="color:#F97583;">error</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">	user </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&amp;</span><span style="color:#E1E4E8;">User{}</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> c.</span><span style="color:#79B8FF;">ShouldBind</span><span style="color:#E1E4E8;">(user); err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;&quot;</span><span style="color:#E1E4E8;">, jwt.ErrMissingLoginValues</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">validateUser</span><span style="color:#E1E4E8;">(user)</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;">, jwt.ErrFailedAuthentication</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> user, </span><span style="color:#79B8FF;">nil</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">validateUser</span><span style="color:#E1E4E8;">(u </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">User) </span><span style="color:#F97583;">error</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// TODO add the code to validate the username or password,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// and delete this line.</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">loginResponse</span><span style="color:#E1E4E8;">(c </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">gin.Context, code </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;">, token </span><span style="color:#F97583;">string</span><span style="color:#E1E4E8;">, expire time.Time) {</span></span>
<span class="line"><span style="color:#E1E4E8;">	c.</span><span style="color:#79B8FF;">JSON</span><span style="color:#E1E4E8;">(http.StatusCreated,</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">&amp;</span><span style="color:#E1E4E8;">LoginResp{</span></span>
<span class="line"><span style="color:#E1E4E8;">			Token:  token,</span></span>
<span class="line"><span style="color:#E1E4E8;">			Expire: expire.</span><span style="color:#79B8FF;">Format</span><span style="color:#E1E4E8;">(time.RFC3339),</span></span>
<span class="line"><span style="color:#E1E4E8;">		})</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">logoutResponse</span><span style="color:#E1E4E8;">(c </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">gin.Context, code </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">	c.</span><span style="color:#79B8FF;">JSON</span><span style="color:#E1E4E8;">(http.StatusCreated, </span><span style="color:#F97583;">struct</span><span style="color:#E1E4E8;">{}{})</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">authorize</span><span style="color:#E1E4E8;">(data </span><span style="color:#F97583;">interface</span><span style="color:#E1E4E8;">{}, c </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">gin.Context) </span><span style="color:#F97583;">bool</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">	_, ok </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> data.(</span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">User)</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">!</span><span style="color:#E1E4E8;">ok {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">false</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">true</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">unauthorized</span><span style="color:#E1E4E8;">(c </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">gin.Context, code </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;">, message </span><span style="color:#F97583;">string</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">	c.</span><span style="color:#79B8FF;">JSON</span><span style="color:#E1E4E8;">(code,</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">&amp;</span><span style="color:#E1E4E8;">UnauthorizedResp{</span></span>
<span class="line"><span style="color:#E1E4E8;">			Code:    code,</span></span>
<span class="line"><span style="color:#E1E4E8;">			Message: message,</span></span>
<span class="line"><span style="color:#E1E4E8;">		},</span></span>
<span class="line"><span style="color:#E1E4E8;">	)</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">package</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">auth</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> (</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">fmt</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">net/http</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6F42C1;">jwt</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">github.com/appleboy/gin-jwt/v2</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">github.com/gin-gonic/gin</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">type</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">User</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">struct</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">	Username </span><span style="color:#D73A49;">string</span><span style="color:#24292E;"> </span><span style="color:#032F62;">\`form:&quot;username&quot; json:&quot;username&quot; binding:&quot;required&quot;\`</span></span>
<span class="line"><span style="color:#24292E;">	Password </span><span style="color:#D73A49;">string</span><span style="color:#24292E;"> </span><span style="color:#032F62;">\`form:&quot;password&quot; json:&quot;password&quot; binding:&quot;required&quot;\`</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">type</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">LoginResp</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">struct</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">	Token  </span><span style="color:#D73A49;">string</span><span style="color:#24292E;"> </span><span style="color:#032F62;">\`json:&quot;token&quot;\`</span></span>
<span class="line"><span style="color:#24292E;">	Expire </span><span style="color:#D73A49;">string</span><span style="color:#24292E;"> </span><span style="color:#032F62;">\`json:&quot;expire&quot;\`</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">type</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">UnauthorizedResp</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">struct</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">	Code    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;">    </span><span style="color:#032F62;">\`json:&quot;code&quot;\`</span></span>
<span class="line"><span style="color:#24292E;">	Message </span><span style="color:#D73A49;">string</span><span style="color:#24292E;"> </span><span style="color:#032F62;">\`json:&quot;message&quot;\`</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">init</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">	AuthMiddleware, _ </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> jwt.</span><span style="color:#005CC5;">New</span><span style="color:#24292E;">(gjm)</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">generatePayLoad</span><span style="color:#24292E;">(data </span><span style="color:#D73A49;">interface</span><span style="color:#24292E;">{}) jwt.MapClaims {</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> v, ok </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> data.(</span><span style="color:#D73A49;">*</span><span style="color:#24292E;">User); ok {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> jwt.MapClaims{</span></span>
<span class="line"><span style="color:#24292E;">			AuthUserKey: v.Username,</span></span>
<span class="line"><span style="color:#24292E;">		}</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> jwt.MapClaims{}</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">identityHandler</span><span style="color:#24292E;">(c </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">gin.Context) </span><span style="color:#D73A49;">interface</span><span style="color:#24292E;">{} {</span></span>
<span class="line"><span style="color:#24292E;">	claims </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> jwt.</span><span style="color:#005CC5;">ExtractClaims</span><span style="color:#24292E;">(c)</span></span>
<span class="line"><span style="color:#24292E;">	u </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">User{</span></span>
<span class="line"><span style="color:#24292E;">		Username: claims[AuthUserKey].(</span><span style="color:#D73A49;">string</span><span style="color:#24292E;">),</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	c.</span><span style="color:#005CC5;">Set</span><span style="color:#24292E;">(AuthUserKey, u)</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> u</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">authenticate</span><span style="color:#24292E;">(c </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">gin.Context) (</span><span style="color:#D73A49;">interface</span><span style="color:#24292E;">{}, </span><span style="color:#D73A49;">error</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">	user </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">User{}</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> c.</span><span style="color:#005CC5;">ShouldBind</span><span style="color:#24292E;">(user); err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;&quot;</span><span style="color:#24292E;">, jwt.ErrMissingLoginValues</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">validateUser</span><span style="color:#24292E;">(user)</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;">, jwt.ErrFailedAuthentication</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> user, </span><span style="color:#005CC5;">nil</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">validateUser</span><span style="color:#24292E;">(u </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">User) </span><span style="color:#D73A49;">error</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// TODO add the code to validate the username or password,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// and delete this line.</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">loginResponse</span><span style="color:#24292E;">(c </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">gin.Context, code </span><span style="color:#D73A49;">int</span><span style="color:#24292E;">, token </span><span style="color:#D73A49;">string</span><span style="color:#24292E;">, expire time.Time) {</span></span>
<span class="line"><span style="color:#24292E;">	c.</span><span style="color:#005CC5;">JSON</span><span style="color:#24292E;">(http.StatusCreated,</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">LoginResp{</span></span>
<span class="line"><span style="color:#24292E;">			Token:  token,</span></span>
<span class="line"><span style="color:#24292E;">			Expire: expire.</span><span style="color:#005CC5;">Format</span><span style="color:#24292E;">(time.RFC3339),</span></span>
<span class="line"><span style="color:#24292E;">		})</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">logoutResponse</span><span style="color:#24292E;">(c </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">gin.Context, code </span><span style="color:#D73A49;">int</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">	c.</span><span style="color:#005CC5;">JSON</span><span style="color:#24292E;">(http.StatusCreated, </span><span style="color:#D73A49;">struct</span><span style="color:#24292E;">{}{})</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">authorize</span><span style="color:#24292E;">(data </span><span style="color:#D73A49;">interface</span><span style="color:#24292E;">{}, c </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">gin.Context) </span><span style="color:#D73A49;">bool</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">	_, ok </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> data.(</span><span style="color:#D73A49;">*</span><span style="color:#24292E;">User)</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">!</span><span style="color:#24292E;">ok {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">false</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">true</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">unauthorized</span><span style="color:#24292E;">(c </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">gin.Context, code </span><span style="color:#D73A49;">int</span><span style="color:#24292E;">, message </span><span style="color:#D73A49;">string</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">	c.</span><span style="color:#005CC5;">JSON</span><span style="color:#24292E;">(code,</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">UnauthorizedResp{</span></span>
<span class="line"><span style="color:#24292E;">			Code:    code,</span></span>
<span class="line"><span style="color:#24292E;">			Message: message,</span></span>
<span class="line"><span style="color:#24292E;">		},</span></span>
<span class="line"><span style="color:#24292E;">	)</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="注册login-logout-refreshtoken方法" tabindex="-1">注册Login/Logout/RefreshToken方法 <a class="header-anchor" href="#注册login-logout-refreshtoken方法" aria-label="Permalink to &quot;注册Login/Logout/RefreshToken方法&quot;">​</a></h3><p>可直接引用<code>JWT</code>中间件的方法：</p><div class="language-go vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">package</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">auth</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> (</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">github.com/gin-gonic/gin</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Login</span><span style="color:#E1E4E8;">(ctx </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">gin.Context) {</span></span>
<span class="line"><span style="color:#E1E4E8;">	AuthMiddleware.</span><span style="color:#79B8FF;">LoginHandler</span><span style="color:#E1E4E8;">(ctx)</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Logout</span><span style="color:#E1E4E8;">(ctx </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">gin.Context) {</span></span>
<span class="line"><span style="color:#E1E4E8;">	AuthMiddleware.</span><span style="color:#79B8FF;">LogoutHandler</span><span style="color:#E1E4E8;">(ctx)</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">RefreshToken</span><span style="color:#E1E4E8;">(ctx </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">gin.Context) {</span></span>
<span class="line"><span style="color:#E1E4E8;">	AuthMiddleware.</span><span style="color:#79B8FF;">RefreshHandler</span><span style="color:#E1E4E8;">(ctx)</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">package</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">auth</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> (</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">github.com/gin-gonic/gin</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Login</span><span style="color:#24292E;">(ctx </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">gin.Context) {</span></span>
<span class="line"><span style="color:#24292E;">	AuthMiddleware.</span><span style="color:#005CC5;">LoginHandler</span><span style="color:#24292E;">(ctx)</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Logout</span><span style="color:#24292E;">(ctx </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">gin.Context) {</span></span>
<span class="line"><span style="color:#24292E;">	AuthMiddleware.</span><span style="color:#005CC5;">LogoutHandler</span><span style="color:#24292E;">(ctx)</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">RefreshToken</span><span style="color:#24292E;">(ctx </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">gin.Context) {</span></span>
<span class="line"><span style="color:#24292E;">	AuthMiddleware.</span><span style="color:#005CC5;">RefreshHandler</span><span style="color:#24292E;">(ctx)</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="gin框架加载jwt中间件" tabindex="-1">Gin框架加载JWT中间件 <a class="header-anchor" href="#gin框架加载jwt中间件" aria-label="Permalink to &quot;Gin框架加载JWT中间件&quot;">​</a></h3><p>示例代码如下：</p><div class="language-go vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">package</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">main</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> (</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">net/http</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">github.com/gin-gonic/gin</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">auth</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">main</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">	r </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> gin.</span><span style="color:#79B8FF;">New</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"><span style="color:#E1E4E8;">	r.</span><span style="color:#79B8FF;">Use</span><span style="color:#E1E4E8;">(gin.</span><span style="color:#79B8FF;">Recovery</span><span style="color:#E1E4E8;">())</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// register the login API</span></span>
<span class="line"><span style="color:#E1E4E8;">	r.</span><span style="color:#79B8FF;">POST</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;/login&quot;</span><span style="color:#E1E4E8;">, auth.Login)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// register the APIs verified by the jwt middleware</span></span>
<span class="line"><span style="color:#E1E4E8;">	rg </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> r.</span><span style="color:#79B8FF;">Group</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;/v1&quot;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">	rg.</span><span style="color:#79B8FF;">Use</span><span style="color:#E1E4E8;">(auth.AuthMiddleware.</span><span style="color:#79B8FF;">MiddlewareFunc</span><span style="color:#E1E4E8;">())</span></span>
<span class="line"><span style="color:#E1E4E8;">	rg.</span><span style="color:#79B8FF;">Handle</span><span style="color:#E1E4E8;">(http.MethodGet, </span><span style="color:#9ECBFF;">&quot;/jwt&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#F97583;">func</span><span style="color:#E1E4E8;">(ctx </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">gin.Context) {</span></span>
<span class="line"><span style="color:#E1E4E8;">		ctx.</span><span style="color:#79B8FF;">JSON</span><span style="color:#E1E4E8;">(http.StatusOK, </span><span style="color:#9ECBFF;">&quot;JWT Pass&quot;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">	})</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// start the gin router</span></span>
<span class="line"><span style="color:#E1E4E8;">	_ </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> r.</span><span style="color:#79B8FF;">Run</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;0.0.0.0:8080&quot;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">package</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> (</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">net/http</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">github.com/gin-gonic/gin</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">auth</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">	r </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> gin.</span><span style="color:#005CC5;">New</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">	r.</span><span style="color:#005CC5;">Use</span><span style="color:#24292E;">(gin.</span><span style="color:#005CC5;">Recovery</span><span style="color:#24292E;">())</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// register the login API</span></span>
<span class="line"><span style="color:#24292E;">	r.</span><span style="color:#005CC5;">POST</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;/login&quot;</span><span style="color:#24292E;">, auth.Login)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// register the APIs verified by the jwt middleware</span></span>
<span class="line"><span style="color:#24292E;">	rg </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> r.</span><span style="color:#005CC5;">Group</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;/v1&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">	rg.</span><span style="color:#005CC5;">Use</span><span style="color:#24292E;">(auth.AuthMiddleware.</span><span style="color:#005CC5;">MiddlewareFunc</span><span style="color:#24292E;">())</span></span>
<span class="line"><span style="color:#24292E;">	rg.</span><span style="color:#005CC5;">Handle</span><span style="color:#24292E;">(http.MethodGet, </span><span style="color:#032F62;">&quot;/jwt&quot;</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">func</span><span style="color:#24292E;">(ctx </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">gin.Context) {</span></span>
<span class="line"><span style="color:#24292E;">		ctx.</span><span style="color:#005CC5;">JSON</span><span style="color:#24292E;">(http.StatusOK, </span><span style="color:#032F62;">&quot;JWT Pass&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">	})</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// start the gin router</span></span>
<span class="line"><span style="color:#24292E;">	_ </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> r.</span><span style="color:#005CC5;">Run</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;0.0.0.0:8080&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>在某个路径对应的路由中加载<code>JWT</code>中间件，则该路由中的所有方法都会进行<code>JWT</code>鉴权。</p><p>因此，Login方法需要单独注册到这个路由之外(此API调用之前，没有鉴权信息)。</p></div><h3 id="验证jwt" tabindex="-1">验证JWT <a class="header-anchor" href="#验证jwt" aria-label="Permalink to &quot;验证JWT&quot;">​</a></h3><p>在加载<code>JWT</code>中间件并注册好<code>Login</code>方法之后，可使用如下指令进行验证：</p><ul><li>调用<code>Login</code>API：</li></ul><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;"># 登录指令</span></span>
<span class="line"><span style="color:#B392F0;">curl</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-k</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-i</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-X</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">POST</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">http://127.0.0.1:8080/login</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">\\</span></span>
<span class="line"><span style="color:#E1E4E8;">--header </span><span style="color:#9ECBFF;">&#39;Content-Type: application/json&#39;</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">\\</span></span>
<span class="line"><span style="color:#E1E4E8;">--data-raw  </span><span style="color:#9ECBFF;">&#39;{&quot;username&quot;:&quot;admin&quot;,&quot;password&quot;:&quot;admin&quot;}&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 得到返回如下：</span></span>
<span class="line"><span style="color:#B392F0;">HTTP/1.1</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">201</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">Created</span></span>
<span class="line"><span style="color:#B392F0;">Content-Type:</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">application/json</span><span style="color:#E1E4E8;">; charset</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">utf-8</span></span>
<span class="line"><span style="color:#B392F0;">Date:</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">Thu,</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">20</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">Apr</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">2023</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">09</span><span style="color:#9ECBFF;">:06:29</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">GMT</span></span>
<span class="line"><span style="color:#B392F0;">Content-Length:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">210</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span><span style="color:#B392F0;">&quot;token&quot;</span><span style="color:#79B8FF;">:</span><span style="color:#B392F0;">&quot;eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoX3VzZXIiOiJhZG1pbiIsImV4cCI6MTY4MTk4NTE4OSwib3JpZ19pYXQiOjE2ODE5ODE1ODl9.-SUHs7SUvASsNHt-fYZhnqyQWWq7YoT7ot-ttKNGUZI&quot;</span><span style="color:#B392F0;">,</span><span style="color:#B392F0;">&quot;expire&quot;</span><span style="color:#79B8FF;">:</span><span style="color:#B392F0;">&quot;2023-04-20T18:06:29+08:00&quot;</span><span style="color:#B392F0;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;"># 登录指令</span></span>
<span class="line"><span style="color:#6F42C1;">curl</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-k</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-i</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-X</span><span style="color:#24292E;"> </span><span style="color:#032F62;">POST</span><span style="color:#24292E;"> </span><span style="color:#032F62;">http://127.0.0.1:8080/login</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">\\</span></span>
<span class="line"><span style="color:#24292E;">--header </span><span style="color:#032F62;">&#39;Content-Type: application/json&#39;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">\\</span></span>
<span class="line"><span style="color:#24292E;">--data-raw  </span><span style="color:#032F62;">&#39;{&quot;username&quot;:&quot;admin&quot;,&quot;password&quot;:&quot;admin&quot;}&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 得到返回如下：</span></span>
<span class="line"><span style="color:#6F42C1;">HTTP/1.1</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">201</span><span style="color:#24292E;"> </span><span style="color:#032F62;">Created</span></span>
<span class="line"><span style="color:#6F42C1;">Content-Type:</span><span style="color:#24292E;"> </span><span style="color:#032F62;">application/json</span><span style="color:#24292E;">; charset</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">utf-8</span></span>
<span class="line"><span style="color:#6F42C1;">Date:</span><span style="color:#24292E;"> </span><span style="color:#032F62;">Thu,</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">20</span><span style="color:#24292E;"> </span><span style="color:#032F62;">Apr</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">2023</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">09</span><span style="color:#032F62;">:06:29</span><span style="color:#24292E;"> </span><span style="color:#032F62;">GMT</span></span>
<span class="line"><span style="color:#6F42C1;">Content-Length:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">210</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span><span style="color:#6F42C1;">&quot;token&quot;</span><span style="color:#005CC5;">:</span><span style="color:#6F42C1;">&quot;eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoX3VzZXIiOiJhZG1pbiIsImV4cCI6MTY4MTk4NTE4OSwib3JpZ19pYXQiOjE2ODE5ODE1ODl9.-SUHs7SUvASsNHt-fYZhnqyQWWq7YoT7ot-ttKNGUZI&quot;</span><span style="color:#6F42C1;">,</span><span style="color:#6F42C1;">&quot;expire&quot;</span><span style="color:#005CC5;">:</span><span style="color:#6F42C1;">&quot;2023-04-20T18:06:29+08:00&quot;</span><span style="color:#6F42C1;">}</span></span></code></pre></div><ul><li>将成功登录得到的<code>Token</code>加入到API调用的Header中：</li></ul><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;"># 调用代码中注册的用于JWT测试的API</span></span>
<span class="line"><span style="color:#B392F0;">curl</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-k</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-i</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-X</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">GET</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">http://127.0.0.1:8080/v1/jwt</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">\\</span></span>
<span class="line"><span style="color:#E1E4E8;">--header </span><span style="color:#9ECBFF;">&#39;Content-Type: application/json&#39;</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">\\</span></span>
<span class="line"><span style="color:#E1E4E8;">--header </span><span style="color:#9ECBFF;">&#39;Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoX3VzZXIiOiJhZG1pbiIsImV4cCI6MTY4MTk4NTE4OSwib3JpZ19pYXQiOjE2ODE5ODE1ODl9.-SUHs7SUvASsNHt-fYZhnqyQWWq7YoT7ot-ttKNGUZI&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 得到返回如下：</span></span>
<span class="line"><span style="color:#B392F0;">HTTP/1.1</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">200</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">OK</span></span>
<span class="line"><span style="color:#B392F0;">Content-Type:</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">application/json</span><span style="color:#E1E4E8;">; charset</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">utf-8</span></span>
<span class="line"><span style="color:#B392F0;">Date:</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">Thu,</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">20</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">Apr</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">2023</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">09</span><span style="color:#9ECBFF;">:07:38</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">GMT</span></span>
<span class="line"><span style="color:#B392F0;">Content-Length:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">10</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">&quot;JWT Pass&quot;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;"># 调用代码中注册的用于JWT测试的API</span></span>
<span class="line"><span style="color:#6F42C1;">curl</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-k</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-i</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-X</span><span style="color:#24292E;"> </span><span style="color:#032F62;">GET</span><span style="color:#24292E;"> </span><span style="color:#032F62;">http://127.0.0.1:8080/v1/jwt</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">\\</span></span>
<span class="line"><span style="color:#24292E;">--header </span><span style="color:#032F62;">&#39;Content-Type: application/json&#39;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">\\</span></span>
<span class="line"><span style="color:#24292E;">--header </span><span style="color:#032F62;">&#39;Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoX3VzZXIiOiJhZG1pbiIsImV4cCI6MTY4MTk4NTE4OSwib3JpZ19pYXQiOjE2ODE5ODE1ODl9.-SUHs7SUvASsNHt-fYZhnqyQWWq7YoT7ot-ttKNGUZI&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 得到返回如下：</span></span>
<span class="line"><span style="color:#6F42C1;">HTTP/1.1</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">200</span><span style="color:#24292E;"> </span><span style="color:#032F62;">OK</span></span>
<span class="line"><span style="color:#6F42C1;">Content-Type:</span><span style="color:#24292E;"> </span><span style="color:#032F62;">application/json</span><span style="color:#24292E;">; charset</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">utf-8</span></span>
<span class="line"><span style="color:#6F42C1;">Date:</span><span style="color:#24292E;"> </span><span style="color:#032F62;">Thu,</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">20</span><span style="color:#24292E;"> </span><span style="color:#032F62;">Apr</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">2023</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">09</span><span style="color:#032F62;">:07:38</span><span style="color:#24292E;"> </span><span style="color:#032F62;">GMT</span></span>
<span class="line"><span style="color:#6F42C1;">Content-Length:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">10</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">&quot;JWT Pass&quot;</span></span></code></pre></div>`,31),e=[o];function t(c,r,E,y,i,u){return n(),a("div",null,e)}const C=s(p,[["render",t]]);export{d as __pageData,C as default};
