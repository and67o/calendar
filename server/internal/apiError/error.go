package apiError

import "fmt"

type ApiError struct {
	Message string `json:"message"`
	Code    int    `json:"code"`
}

func (a *ApiError) Error() string {
	return fmt.Sprintf("code[%v] -- %s", a.Code, a.Message)
}
