package middlewares

import (
	"github.com/and67o/calendar/server/internal/auth"
	"github.com/and67o/calendar/server/internal/errors"
	"github.com/and67o/calendar/server/internal/response"
	"net/http"
)

func isAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := auth.TokenValid(r)
		if err != nil {
			response.ERROR(
				w,
				http.StatusUnauthorized,
				errors.UnauthorizedUser(1),
			)
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
