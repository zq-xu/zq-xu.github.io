---
tag:
 - Golang
categories:
 - Golang
recommend: 1
---

# Float类型处理

使用`Golang`原生库进行`Float`类型数据处理的时候，常常会遇到数据失真的问题。

以下引用[Go语言浮点类型（小数类型）](http://c.biancheng.net/view/14.html)简要介绍一下`Golang`中的`Float`类型：
> Go语言提供了两种精度的浮点数 float32 和 float64，它们的算术规范由 IEEE754 浮点数国际标准定义，该浮点数规范被所有现代的 CPU 支持。

> 这些浮点数类型的取值范围可以从很微小到很巨大。浮点数取值范围的极限值可以在 math 包中找到：
> 常量 math.MaxFloat32 表示 float32 能取到的最大数值，大约是 3.4e38；
> 常量 math.MaxFloat64 表示 float64 能取到的最大数值，大约是 1.8e308；
> float32 和 float64 能表示的最小值分别为 1.4e-45 和 4.9e-324。
> 
> 一个 float32 类型的浮点数可以提供大约 6 个十进制数的精度，而 float64 则可以提供约 15 个十进制数的精度，通常应该优先使用 float64 类型，因为 > > float32 类型的累计计算误差很容易扩散，并且 float32 能精确表示的正整数并不是很大。

更多资料可参考：
- [Golang 笔记之深入浮点数](https://github.com/kingreatwill/open/blob/master/golang/float.md)：详细解释`Golang`中的`Float`类型；
- [shopspring/decimal](https://github.com/shopspring/decimal)：用于解析`Golang`中`Float`类型数据的开源项目。

此处引用开源库`shopspring/decimal`演示`Golang`中`Float`类型（以`float64`为例）的处理。

## 输出保留N位小数的字符串

代码如下：
```go
package main

import (
	"fmt"

	"github.com/shopspring/decimal"
)

func main() {
	var a float64 = 12345.12345
	for i := 8; i < 20; i++ {
		rawFmt := fmt.Sprintf("fmt %d float64 is %%.%df\n", i, i)
		fmt.Printf(rawFmt, a)

		decimalFmt := fmt.Sprintf("decimal %d float64 is %%s\n", i)
		fmt.Printf(decimalFmt, decimal.NewFromFloat(a).StringFixed(int32(i)))
	}
}
```

输出如下：
```bash
fmt 8 float64 is 12345.12345000
decimal 8 float64 is 12345.12345000
fmt 9 float64 is 12345.123450000
decimal 9 float64 is 12345.123450000
fmt 10 float64 is 12345.1234500000
decimal 10 float64 is 12345.1234500000
fmt 11 float64 is 12345.12345000000
decimal 11 float64 is 12345.12345000000
fmt 12 float64 is 12345.123449999999
decimal 12 float64 is 12345.123450000000
fmt 13 float64 is 12345.1234499999991
decimal 13 float64 is 12345.1234500000000
fmt 14 float64 is 12345.12344999999914
decimal 14 float64 is 12345.12345000000000
fmt 15 float64 is 12345.123449999999139
decimal 15 float64 is 12345.123450000000000
fmt 16 float64 is 12345.1234499999991385
decimal 16 float64 is 12345.1234500000000000
fmt 17 float64 is 12345.12344999999913853
decimal 17 float64 is 12345.12345000000000000
fmt 18 float64 is 12345.123449999999138527
decimal 18 float64 is 12345.123450000000000000
fmt 19 float64 is 12345.1234499999991385266
decimal 19 float64 is 12345.1234500000000000000
```


## 使用Go原生库处理Float64类型

```go
package utils

import (
	"math"
	"strconv"
)

// Decimal float64 Keep the decimal places
// value float64 the incoming parameter
// prec int Keep the number of digits after the decimal point
func Decimal(number float64, prec int) float64 {
	number, _ = strconv.ParseFloat(strconv.FormatFloat(number, 'f', prec, 64), 64)
	return number
}

// RoundFloat64 float64 Keep the decimal places
// value float64 the incoming parameter
// prec int Keep the number of digits after the decimal point
func RoundFloat64(number float64, decimalPlaces int) float64 {
	shift := math.Pow(10, float64(decimalPlaces))
	return math.Round(number*shift) / shift
}

// TruncateFloat64 float64 Keep the decimal places and drop the extra digits
// value float64 the incoming parameter
// prec int Keep the number of digits after the decimal point
func TruncateFloat64(number float64, prec int) float64 {
	scale := 1.0
	for i := 0; i < prec; i++ {
		scale *= 10.0
	}
	return float64(int(number*scale)) / scale
}
```
