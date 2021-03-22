package auth

import (
	jwt "github.com/dgrijalva/jwt-go"
)

type Claims struct {
	UserId int `json:"id"`
	jwt.StandardClaims
}

type Token struct {
	AccessToken   string
	//RefreshToken  string
	AccessExpires int64
}
