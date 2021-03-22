package router

import (
	"encoding/json"
	"fmt"
	"github.com/and67o/calendar/server/internal/app"
	"github.com/and67o/calendar/server/internal/interfaces"
	"github.com/and67o/calendar/server/internal/model"
	"github.com/and67o/calendar/server/internal/response"
	"github.com/gorilla/mux"
	"io/ioutil"
	"net/http"
	"strconv"
	"time"
)

type Router struct {
	muxRouter *mux.Router
	app       *app.App
}

func New(app *app.App) interfaces.Router {
	var router Router

	router.app = app

	r := mux.NewRouter()
	router.initRoutes(r)

	router.muxRouter = r

	return &router
}

func (r *Router) initRoutes(router *mux.Router) {
	router.HandleFunc("/api/hello", r.Hello).Methods(http.MethodGet)

	router.HandleFunc("/api/calendar", r.Calendar).Methods(http.MethodGet)

	router.HandleFunc("/api/register", r.CreateUser).Methods(http.MethodPost)
	router.HandleFunc("/api/login", r.Login).Methods(http.MethodPost)
	router.HandleFunc("/api/logout", r.Login).Methods(http.MethodPost)

	router.HandleFunc("/api/user/{id:[0-9]+}", r.GetUser).Methods(http.MethodGet)
	router.HandleFunc("/api/users", r.GetUsers).Methods(http.MethodGet)
	router.HandleFunc("/api/user/{id:[0-9]+}", r.DeleteUser).Methods(http.MethodDelete)
	router.HandleFunc("/api/user/{id:[0-9]+}", r.UpdateUser).Methods(http.MethodPatch)
}

func (r *Router) Hello(w http.ResponseWriter, _ *http.Request) {
	response.JSON(w, http.StatusOK, map[string]string{"message": "hello-world"})
}

func (r *Router) GetRouter() *mux.Router {
	return r.muxRouter
}

func (r *Router) CreateUser(w http.ResponseWriter, request *http.Request) {
	defer request.Body.Close()

	body, err := ioutil.ReadAll(request.Body)
	if err != nil {
		response.JSON(
			w, http.StatusUnprocessableEntity,
			response.Answer{Error: err.Error()},
		)
		return
	}

	var user model.User

	err = json.Unmarshal(body, &user)
	if err != nil {
		response.JSON(
			w, http.StatusBadRequest,
			response.Answer{Error: err.Error()},
		)
		return
	}

	_, err = r.app.Storage.GetByEmail(user.Email)
	if err == nil {
		response.JSON(
			w, http.StatusConflict,
			response.Answer{Error: "email busy"},
		)
		return
	}

	err = user.HashPassword()
	if err != nil {
		response.JSON(
			w, http.StatusBadRequest,
			response.Answer{Error: fmt.Sprintf("hash password err: %v", err.Error())},
		)
		return
	}

	newUser, err := r.app.Storage.SaveUser(user)
	if err != nil {
		response.JSON(
			w, http.StatusBadRequest,
			response.Answer{Error: fmt.Sprintf("create user err: %v", err.Error())},
		)
		return
	}

	tokens, err := newUser.CreateToken(r.app.Config.GetToken())
	if err != nil {
		response.JSON(
			w, http.StatusInternalServerError,
			response.Answer{Error: fmt.Sprintf("token err: %v", err.Error())},
		)
		return
	}

	http.SetCookie(w,  &http.Cookie{
		Name:       "token",
		Value:      tokens.AccessToken,
		Expires:    time.Unix(tokens.AccessExpires, 0),
		HttpOnly:   true,
	})

	response.JSON(w, http.StatusOK, response.Answer{Data: tokens})
	return
}

func (r *Router) GetUser(w http.ResponseWriter, request *http.Request) {
	vars := mux.Vars(request)
	uid, err := strconv.ParseUint(vars["id"], 10, 32)
	if err != nil {
		response.JSON(
			w, http.StatusBadRequest,
			response.Answer{Error:  err.Error()},
		)
		return
	}

	userGotten, err := r.app.Storage.GetById(uid)
	if err != nil {
		response.JSON(
			w, http.StatusBadRequest,
			response.Answer{Error:  err.Error()},
		)
		return
	}

	response.JSON(
		w, http.StatusOK,
		response.Answer{Data: userGotten},
	)
}

func (r *Router) GetUsers(w http.ResponseWriter, request *http.Request) {
	panic("implement me")
}

func (r *Router) DeleteUser(w http.ResponseWriter, request *http.Request) {
	vars := mux.Vars(request)
	uid, err := strconv.ParseUint(vars["id"], 10, 32)
	if err != nil {
		response.JSON(
			w, http.StatusBadRequest,
			response.Answer{Error:  err.Error()},
		)
		return
	}

	err = r.app.Storage.DeleteUser(uid)
	if err != nil {
		response.JSON(
			w, http.StatusBadRequest,
			response.Answer{Error:  err.Error()},
		)
		return
	}

	response.JSON(
		w, http.StatusOK,
		response.Answer{},
	)
}

func (r *Router) UpdateUser(w http.ResponseWriter, request *http.Request) {
	panic("implement me")
}

func (r *Router) Calendar(w http.ResponseWriter, request *http.Request) {
	panic("implement me")
}

func (r *Router) Login(w http.ResponseWriter, request *http.Request) {
	defer request.Body.Close()

	body, err := ioutil.ReadAll(request.Body)
	if err != nil {
		response.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	var user model.User
	err = json.Unmarshal(body, &user)
	if err != nil {
		response.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}
	user.Prepare()

	userDb, err := r.app.Storage.GetByEmail(user.Email)
	if err != nil {
		response.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	err = userDb.VerifyPassword(user.Password)
	if err != nil {
		response.ERROR(w, http.StatusUnauthorized, err)
		return
	}

	tokens, err := userDb.CreateToken(r.app.Config.GetToken())
	if err != nil {
		response.JSON(
			w, http.StatusInternalServerError,
			response.Answer{Error: fmt.Sprintf("token err: %v", err.Error())},
		)
		return
	}

	http.SetCookie(w,  &http.Cookie{
		Name:       "token",
		Value:      tokens.AccessToken,
		Expires:    time.Unix(tokens.AccessExpires, 0),
		HttpOnly:   true,
	})

	response.JSON(w, http.StatusOK, response.Answer{Data: tokens})
	return
}

func (r *Router) LogOut(w http.ResponseWriter, request *http.Request) {
	panic("implement me")
}

//func Refresh(c *gin.Context) {
	//mapToken := map[string]string{}
	//if err := c.ShouldBindJSON(&mapToken); err != nil {
	//	c.JSON(http.StatusUnprocessableEntity, err.Error())
	//	return
	//}
	//refreshToken := mapToken["refresh_token"]
	//
	////verify the token
	//os.Setenv("R EFRESH_SECRET", "mcmvmkmsdnfsdmfdsjf") //this should be in an env file
	//token, err := jwt.Parse(refreshToken, func(token *jwt.Token) (interface{}, error) {
	//	//Make sure that the token method conform to "SigningMethodHMAC"
	//	if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
	//		return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
	//	}
	//	return []byte(os.Getenv("REFRESH_SECRET")), nil
	//})
	////if there is an error, the token must have expired
	//if err != nil {
	//	c.JSON(http.StatusUnauthorized, "Refresh token expired")
	//	return
	//}
	////is token valid?
	//if _, ok := token.Claims.(jwt.Claims); !ok && !token.Valid {
	//	c.JSON(http.StatusUnauthorized, err)
	//	return
	//}
	////Since token is valid, get the uuid:
	//claims, ok := token.Claims.(jwt.MapClaims) //the token claims should conform to MapClaims
	//if ok && token.Valid {
	//	refreshUuid, ok := claims["refresh_uuid"].(string) //convert the interface to string
	//	if !ok {
	//		c.JSON(http.StatusUnprocessableEntity, err)
	//		return
	//	}
	//	userId, err := strconv.ParseUint(fmt.Sprintf("%.f", claims["user_id"]), 10, 64)
	//	if err != nil {
	//		c.JSON(http.StatusUnprocessableEntity, "Error occurred")
	//		return
	//	}
	//	//Delete the previous Refresh Token
	//	deleted, delErr := DeleteAuth(refreshUuid)
	//	if delErr != nil || deleted == 0 { //if any goes wrong
	//		c.JSON(http.StatusUnauthorized, "unauthorized")
	//		return
	//	}
	//	//Create new pairs of refresh and access tokens
	//	ts, createErr := CreateToken(userId)
	//	if createErr != nil {
	//		c.JSON(http.StatusForbidden, createErr.Error())
	//		return
	//	}
	//	//save the tokens metadata to redis
	//	saveErr := CreateAuth(userId, ts)
	//	if saveErr != nil {
	//		c.JSON(http.StatusForbidden, saveErr.Error())
	//		return
	//	}
	//	tokens := map[string]string{
	//		"access_token":  ts.AccessToken,
	//		"refresh_token": ts.RefreshToken,
	//	}
	//	c.JSON(http.StatusCreated, tokens)
	//} else {
	//	c.JSON(http.StatusUnauthorized, "refresh expired")
	//}
//}
