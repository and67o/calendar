package auth

import (
	jwt "github.com/dgrijalva/jwt-go"
	"net/http"
	"strings"
	"time"
)

func CreateToken(userId int) (string, error) {
	claims := jwt.MapClaims{}
	claims["authorized"] = true
	claims["user_id"] = userId
	claims["exp"] = time.Now().Add(time.Hour * 1).Unix()
	token:=jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte("apisecret"))
}

func TokenValid(r *http.Request)  {

}

func extractToken(r *http.Request) string {
	keys:=r.URL.Query()
	token:=keys.Get("token")
	if token !="" {
		return token
	}

	bearerToken:=r.Header.Get("Authorization")
	if len(strings.Split(bearerToken, " ")) == 2 {
		return strings.Split(bearerToken, " ")[1]
	}
	return ""
}