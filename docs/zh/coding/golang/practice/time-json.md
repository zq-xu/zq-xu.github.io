---
tag:
 - Golang
categories:
 - Golang
recommend: 4
---

# 自定义时间类型的JSON字符

Go语言中，原生库`time.Time`表示的时间类型在`json`序列化或反序列化时对应着固定格式的字符序列，因此，如果希望使用特定格式的字符序列或者使用时间戳等形式，则可以通过自定义类型，并使其继承`json.Marshaler`和`json.Unmarshaler`接口来实现。

## 代码实现

```go
package utils

import (
	"encoding/json"
	"time"
)

type CustomTime time.Time

// MarshalJSON implements json.Marshaler.
func (t CustomTime) MarshalJSON() ([]byte, error) {
	str := time.Time(t).Format(time.DateOnly)
	// return []byte("\"" + str + "\""), nil
	return json.Marshal(str)
}

// UnmarshalJSON implements json.Unmarshaler.
func (t *CustomTime) UnmarshalJSON(data []byte) error {
	var timeStr string
	if err := json.Unmarshal(data, &timeStr); err != nil {
		return err
	}

	// Parse the time string using your desired format
	parsedTime, err := time.Parse(time.DateOnly, timeStr)
	if err != nil {
		return err
	}

	*t = CustomTime(parsedTime)
	return nil
}

```