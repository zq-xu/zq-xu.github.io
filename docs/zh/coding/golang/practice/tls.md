---
tag:
 - Golang
categories:
 - Golang
recommend: 2
---

# TLS的Golang应用

## TLS简介

`TLS`通常是指传输层安全(Transport Layer Security),是一种广泛使用的安全性协议。其由`Netscape`公司开发的安全套接字层(Secure Socket Layer，简称SSL)演变而来，`TLS`的1.0版本实际上就是`SSL`的3.1版本，是由`IETF`(Internet Engineering Task Force，Internet工程任务组)对`SSL`的3.0版本进行了标准化处理并添加了少数机制，可以看作是SSL的升级版。事实上我们现在用的都是TLS，但因为历史上习惯了SSL这个称呼。

`TLS`通常用于网络传输加密，我们常见的`HTTPS`就是在`HTTP`的基础上进行了`TLS`加密，从而使得网络传输更加安全可靠。  
如今，受`TLS`保护的`HTTPS`是网站的标准做法。

## TLS原理

此处参考[TLS和SSL](https://zhuyasen.com/post/certificate.html)

### TLS认证方式

`TLS`有单向认证和双向认证两种方式：
- 单向认证指的是只有一个对象校验对端的证书合法性，通常都是client来校验服务器的合法性，那么client需要一个ca.crt，服务器需要server.crt、server.key。
- 双向认证指的是相互校验，服务器需要校验每个client，client也需要校验服务器。server需要server.key 、server.crt 、ca.crt文件；client也需要client.key 、client.crt 、ca.crt文件。

### TLS握手通信机制

TLS/SSL协议的基本过程：

客户端向服务器端索要并验证公钥。
双方协商生成”对话密钥”。
双方采用”对话密钥”进行加密通信。
客户端和服务器端在正式通信之前经过握手阶段，”握手阶段”涉及四次通信，如下图所示：

![TLS握手流程](/images/coding/golang/TLS_handshake.png)

“握手阶段”的所有通信都是明文的，握手完成之后是通信内容是经过秘钥加密的.

握手过程说明如下：

1. 客户端发出请求(ClientHello)

    首先，客户端(通常是浏览器)先向服务器发出加密通信的请求，这被叫做ClientHello请求，在这一步客户端主要向服务器提供以下信息。

    - 支持的协议版本，比如TLS 1.0版。
    - 一个客户端生成的随机数，稍后用于生成”对话密钥”。
    - 支持的加密方法，比如RSA公钥加密。
    - 支持的压缩方法。

    这里需要注意的是，客户端发送的信息之中不包括服务器的域名。也就是说，理论上服务器只能包含一个网站，否则会分不清应该向客户端提供哪一个网站的数字证书。这就是为什么通常一台服务器只能有一张数字证书的原因。对于虚拟主机的用户来说，这当然很不方便。2006年，TLS协议加入了一个Server Name Indication扩展，允许客户端向服务器提供它所请求的域名。

2. 服务器回应(SeverHello)

    服务器收到客户端请求后，向客户端发出回应，这叫做SeverHello，服务器的回应包含以下内容：

    - 确认使用的加密通信协议版本，比如TLS 1.0版本。如果浏览器与服务器支持的版本不一致，服务器关闭加密通信。
    - 一个服务器生成的随机数，稍后用于生成”对话密钥”。
    - 确认使用的加密方法，比如RSA公钥加密。
    - 服务器证书。

    除了上面这些信息，如果服务器需要确认客户端的身份，就会再包含一项请求，要求客户端提供”客户端证书”。比如，金融机构往往只允许认证客户连入自己的网络，就会向正式客户提供USB密钥，里面就包含了一张客户端证书。

3. 客户端回应

    客户端收到服务器回应以后，首先验证服务器证书。如果证书不是可信机构颁布、或者证书中的域名与实际域名不一致、或者证书已经过期，就会向访问者显示一个警告，由其选择是否还要继续通信。如果证书没有问题，客户端就会从证书中取出服务器的公钥。然后，向服务器发送下面三项信息：

    - 一个随机数。该随机数用服务器公钥加密，防止被窃听。
    - 编码改变通知，表示随后的信息都将用双方商定的加密方法和密钥发送。
    - 客户端握手结束通知，表示客户端的握手阶段已经结束。这一项同时也是前面发送的所有内容的hash值，用来供服务器校验。

    上面第一项的随机数，是整个握手阶段出现的第三个随机数，又称”pre-master key”。有了它以后，客户端和服务器就同时有了三个随机数，接着双方就用事先商定的加密方法，各自生成本次会话所用的同一把”会话密钥”。

    注：如果前一步服务器要求客户端证书，客户端会在这一步发送证书及相关信息。

4. 服务器的最后回应

    服务器收到客户端的第三个随机数pre-master key之后，计算生成本次会话所用的”会话密钥”，向客户端最后发送下面信息：

    - 编码改变通知，表示随后的信息都将用双方商定的加密方法和密钥发送。
    - 服务器握手结束通知，表示服务器的握手阶段已经结束。这一项同时也是前面发送的所有内容的hash值，用来供客户端校验。

    整个握手阶段全部结束，接下来客户端与服务器进入加密通信，就完全是使用普通的HTTP协议，只不过用”会话密钥”加密内容。

## TLS服务准备

使用`TLS`加密需要加载相应的证书。`TLS`证书由证书权威机构颁发给拥有域的个人或企业，该证书包含有关域所有者的重要信息以及服务器的公钥。

在开发环境中，也可以使用`openssl`工具制作自签名证书来作为`TLS`证书使用：
```sh
openssl genrsa -out server.key 2048
openssl req -new -x509 -key server.key -out server.pem -days 3650
```

以上指令生成了自签名私钥文件`server.key`和证书文件`server.pem`，可作为开发环境中的`TLS`证书使用。

如需在`Golang`项目中通过代码自动生成自签名`TLS`证书，可参考[Golang实现自签名证书](#golang实现自签名证书)。

::: tip
生产环境的`TLS`证书最好还是去专业的机构申请。
:::
## Gin框架启动HTTPS服务

在`Golang`的Web项目中，可以使用`TLS`实现网络传输加密，从而构建相应的`HTTPS`服务。
此处以`Gin`框架为例，运行`HTTPS`服务：
```go
package router

import (
	"net"

	"github.com/gin-gonic/gin"
)

var (
	RouterCfg = &RouterConfig{}
)

type RouterConfig struct {
	IP   string
	Port string

	DisableTLS bool

	// For develop, use the command below to generate the private key and cert:
	//     for key:  openssl genrsa -out server.key 2048
	//     for cert: openssl req -new -x509 -key server.key -out server.pem -days 3650
	KeyPath  string
	CertPath string
}

func StartRouter(r *gin.Engine) error {
	addr := net.JoinHostPort(RouterCfg.IP, RouterCfg.Port)

	if RouterCfg.DisableTLS {
		return r.Run(addr)
	}

	return r.RunTLS(addr, RouterCfg.CertPath, RouterCfg.KeyPath)
}

```

以上部分代码使用`Gin`框架加载指定路径的`TLS`证书，从而启动`HTTPS`服务。

## Golang实现自签名证书

对于Golang项目，在开发环境或者Demo项目中，为了方便起见，往往需要在代码层面自动生成自签名`TLS`证书。

以下代码借鉴[argo-cd](https://github.com/argoproj/argo-cd/blob/master/util/tls/tls.go)，实现自签名`TLS`证书的生成：
```go
package router

import (
	"crypto"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/rsa"
	"crypto/tls"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/pem"
	"fmt"
	"math/big"
	"net"
	"os"
	"time"
)

const (
	DefaultRSABits = 2048
)

type CertOptions struct {
	// Hostnames and IPs to generate a certificate for
	Hosts []string
	// Name of organization in certificate
	Organization string
	// Creation date
	ValidFrom time.Time
	// Duration that certificate is valid for
	ValidFor time.Duration
	// whether this cert should be its own Certificate Authority
	IsCA bool
	// Size of RSA key to generate. Ignored if --ecdsa-curve is set
	RSABits int
	// ECDSA curve to use to generate a key. Valid values are P224, P256 (recommended), P384, P521
	ECDSACurve string
}

// GeneratePEM generates a new certificate and key and returns it as PEM encoded bytes
// refers to the argo-cd: https://github.com/argoproj/argo-cd/blob/master/util/tls/tls.go
func GeneratePEM(opts CertOptions) ([]byte, []byte, error) {
	certBytes, privateKey, err := generate(opts)
	if err != nil {
		return nil, nil, err
	}
	certpem := pem.EncodeToMemory(&pem.Block{Type: "CERTIFICATE", Bytes: certBytes})
	keypem := pem.EncodeToMemory(pemBlockForKey(privateKey))
	return certpem, keypem, nil
}

// GenerateX509KeyPair generates a X509 key pair
func GenerateX509KeyPair(opts CertOptions) (*tls.Certificate, error) {
	certpem, keypem, err := GeneratePEM(opts)
	if err != nil {
		return nil, err
	}
	cert, err := tls.X509KeyPair(certpem, keypem)
	if err != nil {
		return nil, err
	}
	return &cert, nil
}

func generate(opts CertOptions) ([]byte, crypto.PrivateKey, error) {
	if len(opts.Hosts) == 0 {
		return nil, nil, fmt.Errorf("hosts not supplied")
	}

	var privateKey crypto.PrivateKey
	var err error
	switch opts.ECDSACurve {
	case "":
		rsaBits := DefaultRSABits
		if opts.RSABits != 0 {
			rsaBits = opts.RSABits
		}
		privateKey, err = rsa.GenerateKey(rand.Reader, rsaBits)
	case "P224":
		privateKey, err = ecdsa.GenerateKey(elliptic.P224(), rand.Reader)
	case "P256":
		privateKey, err = ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	case "P384":
		privateKey, err = ecdsa.GenerateKey(elliptic.P384(), rand.Reader)
	case "P521":
		privateKey, err = ecdsa.GenerateKey(elliptic.P521(), rand.Reader)
	default:
		return nil, nil, fmt.Errorf("Unrecognized elliptic curve: %q", opts.ECDSACurve)
	}
	if err != nil {
		return nil, nil, fmt.Errorf("failed to generate private key: %s", err)
	}

	var notBefore time.Time
	if opts.ValidFrom.IsZero() {
		notBefore = time.Now()
	} else {
		notBefore = opts.ValidFrom
	}
	var validFor time.Duration
	if opts.ValidFor == 0 {
		validFor = 365 * 24 * time.Hour
	} else {
		validFor = opts.ValidFor
	}
	notAfter := notBefore.Add(validFor)

	serialNumberLimit := new(big.Int).Lsh(big.NewInt(1), 128)
	serialNumber, err := rand.Int(rand.Reader, serialNumberLimit)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to generate serial number: %s", err)
	}

	if opts.Organization == "" {
		return nil, nil, fmt.Errorf("organization not supplied")
	}
	template := x509.Certificate{
		SerialNumber: serialNumber,
		Subject: pkix.Name{
			Organization: []string{opts.Organization},
		},
		NotBefore: notBefore,
		NotAfter:  notAfter,

		KeyUsage:              x509.KeyUsageKeyEncipherment | x509.KeyUsageDigitalSignature,
		ExtKeyUsage:           []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth},
		BasicConstraintsValid: true,
	}

	for _, h := range opts.Hosts {
		if ip := net.ParseIP(h); ip != nil {
			template.IPAddresses = append(template.IPAddresses, ip)
		} else {
			template.DNSNames = append(template.DNSNames, h)
		}
	}

	if opts.IsCA {
		template.IsCA = true
		template.KeyUsage |= x509.KeyUsageCertSign
	}

	certBytes, err := x509.CreateCertificate(rand.Reader, &template, &template, publicKey(privateKey), privateKey)
	if err != nil {
		return nil, nil, fmt.Errorf("Failed to create certificate: %s", err)
	}
	return certBytes, privateKey, nil
}

func pemBlockForKey(priv interface{}) *pem.Block {
	switch k := priv.(type) {
	case *rsa.PrivateKey:
		return &pem.Block{Type: "RSA PRIVATE KEY", Bytes: x509.MarshalPKCS1PrivateKey(k)}
	case *ecdsa.PrivateKey:
		b, err := x509.MarshalECPrivateKey(k)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Unable to marshal ECDSA private key: %v", err)
			os.Exit(2)
		}
		return &pem.Block{Type: "EC PRIVATE KEY", Bytes: b}
	default:
		return nil
	}
}

func publicKey(priv interface{}) interface{} {
	switch k := priv.(type) {
	case *rsa.PrivateKey:
		return &k.PublicKey
	case *ecdsa.PrivateKey:
		return &k.PublicKey
	default:
		return nil
	}
}

```

调用上述代码中的`GeneratePEM(opts CertOptions) ([]byte, []byte, error)`方法即可生成自签名`TLS`证书，其返回值分别对应证书文件和密钥文件。

其简单调用如下：
```go
// GenerateTLSCert generates the self-signed certs.
// return certPem, keyPem, err
func GenerateTLSCert() ([]byte, []byte, error) {
	return router.GeneratePEM(router.CertOptions{
		Hosts:        []string{"localhost"},
		Organization: "GroupName",
		IsCA:         false,
	})

}
```

生成自签名证书之后，可根据项目需要将其进行持久化处理等操作。
