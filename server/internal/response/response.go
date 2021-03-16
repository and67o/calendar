package response

import (
	"encoding/json"
	"fmt"
	"github.com/and67o/calendar/server/internal/apiError"
	"net/http"
)

type Answer struct {
	Data  interface{}
	Error string
}

//
//func respondWithJSON(w http.ResponseWriter, code int, res Answer) {
//	response, err := json.Marshal(res)
//	err != nil{
//
//	}
//	w.Header().Set("Content-Type", "application/json")
//	w.WriteHeader(code)
//	w.Write(response)
//}

func JSON(w http.ResponseWriter, statusCode int, data interface{}) {
	w.Header().Set("Content-type", "application/json")
	w.WriteHeader(statusCode)

	err := json.NewEncoder(w).Encode(data)
	if err != nil {
		_, _ = fmt.Fprintf(w, "%s", err.Error())
	}
	return
}

func ERROR(w http.ResponseWriter, statusCode int, err error) {
	JSON(w, statusCode, Answer{
		Data:  nil,
		Error: err.Error(),
	})
	return
}

func ERROR1(w http.ResponseWriter, apiError apiError.ApiError) {
	JSON(w, apiError.Code, Answer{
		Data:  nil,
		Error: apiError.Message,
	})
	return
}
