package middlewares

import (
	"github.com/and67o/calendar/server/internal/apiError"
	"github.com/and67o/calendar/server/internal/auth"
	"github.com/and67o/calendar/server/internal/errors"
	"github.com/and67o/calendar/server/internal/response"
	"net/http"
)

func isAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := auth.TokenValid(r)
		if err != nil {
			response.ERROR1(w, apiError.ApiError{
				Message: "session invalid for user id",
				Code:   http.StatusUnauthorized,
			})
			return
		}
		next(w, r)
	}
}

func SetMiddlewareJSON(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		next(w, r)
	}
}
