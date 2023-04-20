---
tag:
 - Golang
categories:
 - Golang
recommend: 3
---

# JWT鉴权

## JWT定义

JSON Web Token (JWT) 是一个开放标准 ( RFC 7519 )，它定义了一种紧凑且自包含的方式，用于在各方之间以 JSON 对象的形式安全传输信息。此信息可以验证和信任，因为它是数字签名的。JWT 可以使用密钥（使用HMAC算法）或使用RSA或ECDSA的公钥/私钥对进行签名。

最常用的场景是登录授权。用户登录后，每个后续请求都将包含 JWT，从而允许用户访问该令牌允许的路由、服务和资源。单点登录是当今广泛使用 JWT 的一项功能，因为它的开销很小并且能够在不同的域中轻松使用。

以上介绍引用自[JWT鉴权详解与实战](https://www.sulvblog.cn/posts/tech/jwt/)。

简单来说，`JWT`鉴权就是先通过`Login`来检查用户名密码等信息，合法时返回加密的`Token`信息作为合法凭证，该`Token`加入到后续的请求的`Header`中，用于后续的请求验证。

::: tip
Token的有效期默认为1h,过期后需要重新申请。
:::

## Golang中的JWT鉴权

在Golang项目中，可以使用`JWT`进行身份认证，较为常用的做法是定义相应的中间件，并加载到相应的路由中。

此处以`Gin`框架为例，演示加载`JWT`中间件。

### 定义JWT中间件

此处引用库`github.com/appleboy/gin-jwt`，定义`JWT`中间件`AuthMiddleware`:
```go
package auth

import (
	"time"

	jwt "github.com/appleboy/gin-jwt/v2"
)

const (
	AuthUserKey = "auth_user"
)

var (
	AuthMiddleware *jwt.GinJWTMiddleware

	gjm = &jwt.GinJWTMiddleware{
		Key:             []byte("secret key"),
		Timeout:         time.Hour,
		MaxRefresh:      time.Hour,
		IdentityKey:     AuthUserKey,
		PayloadFunc:     generatePayLoad,
		IdentityHandler: identityHandler,
		Authenticator:   authenticate,
		Authorizator:    authorize,
		LoginResponse:   loginResponse,
		RefreshResponse: loginResponse,
		LogoutResponse:  logoutResponse,
		Unauthorized:    unauthorized,
		// TokenLookup is a string in the form of "<source>:<name>" that is used
		// to extract token from the request.
		// Optional. Default value "header:Authorization".
		// Possible values:
		// - "header:<name>"
		// - "query:<name>"
		// - "cookie:<name>"
		// - "param:<name>"
		TokenLookup: "header: Authorization, query: token, cookie: jwt",
		// TokenLookup: "query:token",
		// TokenLookup: "cookie:token",

		// TokenHeadName is a string in the header. Default value is "Bearer"
		TokenHeadName: "Bearer",

		// TimeFunc provides the current time. You can override it to use another time value. This is useful for testing or if your server uses a different time zone than your tokens.
		TimeFunc: time.Now,
	}
)

func init() {
	AuthMiddleware, _ = jwt.New(gjm)
}
```

在上述代码定义的`JWT`中间件中，需要实现的方法如下：
- `PayloadFunc`: 捕捉到请求时，解析其中的token等`JWT`鉴权信息，并解析；
- `IdentityHandler`: 对解析出来的信息进行相应的校验和转化处理；
- `Authenticator`: 用于登录验证，校验账户密码等信息；
- `Authorizator`: 对每个接收到的请求进行权限校验,非必要方法；
- `LoginResponse`: 登录成功的返回；
- `RefreshResponse`: 刷新`JWT`鉴权信息，常在token等超时时使用；
- `LogoutResponse`: 登出成功的返回；
- `Unauthorized`: 鉴权失败时调用；

### JWT中间件方法实现

以下代码是`JWT`中间件中需要实现的方法的示例：
```go
package auth

import (
	"fmt"
	"net/http"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
)

type User struct {
	Username string `form:"username" json:"username" binding:"required"`
	Password string `form:"password" json:"password" binding:"required"`
}

type LoginResp struct {
	Token  string `json:"token"`
	Expire string `json:"expire"`
}

type UnauthorizedResp struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

func init() {
	AuthMiddleware, _ = jwt.New(gjm)
}

func generatePayLoad(data interface{}) jwt.MapClaims {
	if v, ok := data.(*User); ok {
		return jwt.MapClaims{
			AuthUserKey: v.Username,
		}
	}
	return jwt.MapClaims{}
}

func identityHandler(c *gin.Context) interface{} {
	claims := jwt.ExtractClaims(c)
	u := &User{
		Username: claims[AuthUserKey].(string),
	}

	c.Set(AuthUserKey, u)
	return u
}

func authenticate(c *gin.Context) (interface{}, error) {
	user := &User{}
	if err := c.ShouldBind(user); err != nil {
		return "", jwt.ErrMissingLoginValues
	}

	err := validateUser(user)
	if err != nil {
		return nil, jwt.ErrFailedAuthentication
	}

	return user, nil
}

func validateUser(u *User) error {
    // TODO add the code to validate the username or password,
    // and delete this line.

	return nil
}

func loginResponse(c *gin.Context, code int, token string, expire time.Time) {
	c.JSON(http.StatusCreated,
		&LoginResp{
			Token:  token,
			Expire: expire.Format(time.RFC3339),
		})
}

func logoutResponse(c *gin.Context, code int) {
	c.JSON(http.StatusCreated, struct{}{})
}

func authorize(data interface{}, c *gin.Context) bool {
	_, ok := data.(*User)
	if !ok {
		return false
	}

	return true
}

func unauthorized(c *gin.Context, code int, message string) {
	c.JSON(code,
		&UnauthorizedResp{
			Code:    code,
			Message: message,
		},
	)
}
```

### 注册Login/Logout/RefreshToken方法

可直接引用`JWT`中间件的方法：
```go
package auth

import (
	"github.com/gin-gonic/gin"
)

func Login(ctx *gin.Context) {
	AuthMiddleware.LoginHandler(ctx)
}

func Logout(ctx *gin.Context) {
	AuthMiddleware.LogoutHandler(ctx)
}

func RefreshToken(ctx *gin.Context) {
	AuthMiddleware.RefreshHandler(ctx)
}

```

### Gin框架加载JWT中间件

示例代码如下：
```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"auth"
)

func main() {
	r := gin.New()
	r.Use(gin.Recovery())

	// register the login API
	r.POST("/login", auth.Login)

	// register the APIs verified by the jwt middleware
	rg := r.Group("/v1")
	rg.Use(auth.AuthMiddleware.MiddlewareFunc())
	rg.Handle(http.MethodGet, "/jwt", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, "JWT Pass")
	})

	// start the gin router
	_ = r.Run("0.0.0.0:8080")
}
```
::: warning
在某个路径对应的路由中加载`JWT`中间件，则该路由中的所有方法都会进行`JWT`鉴权。

因此，Login方法需要单独注册到这个路由之外(此API调用之前，没有鉴权信息)。
:::

### 验证JWT

在加载`JWT`中间件并注册好`Login`方法之后，可使用如下指令进行验证：
- 调用`Login`API：
```sh
# 登录指令
curl -k -i -X POST http://127.0.0.1:8080/login \
--header 'Content-Type: application/json' \
--data-raw  '{"username":"admin","password":"admin"}'

# 得到返回如下：
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Date: Thu, 20 Apr 2023 09:06:29 GMT
Content-Length: 210

{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoX3VzZXIiOiJhZG1pbiIsImV4cCI6MTY4MTk4NTE4OSwib3JpZ19pYXQiOjE2ODE5ODE1ODl9.-SUHs7SUvASsNHt-fYZhnqyQWWq7YoT7ot-ttKNGUZI","expire":"2023-04-20T18:06:29+08:00"}
```
- 将成功登录得到的`Token`加入到API调用的Header中：
```sh
# 调用代码中注册的用于JWT测试的API
curl -k -i -X GET http://127.0.0.1:8080/v1/jwt \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoX3VzZXIiOiJhZG1pbiIsImV4cCI6MTY4MTk4NTE4OSwib3JpZ19pYXQiOjE2ODE5ODE1ODl9.-SUHs7SUvASsNHt-fYZhnqyQWWq7YoT7ot-ttKNGUZI'

# 得到返回如下：
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Date: Thu, 20 Apr 2023 09:07:38 GMT
Content-Length: 10

"JWT Pass"
```
