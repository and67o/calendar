package router

import (
	"encoding/json"
	"fmt"
	"github.com/and67o/calendar/server/internal/app"
	"github.com/and67o/calendar/server/internal/auth"
	"github.com/and67o/calendar/server/internal/interfaces"
	"github.com/and67o/calendar/server/internal/model"
	"github.com/and67o/calendar/server/internal/response"
	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"
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
	router.HandleFunc("/api/refresh_token", r.Refresh).Methods(http.MethodPost)

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

	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    tokens.AccessToken,
		Expires:  time.Unix(tokens.AccessExpires, 0),
		HttpOnly: true,
	})

	response.JSON(w, http.StatusOK, response.Answer{Data: tokens})
	return
}

func (r *Router) GetUser(w http.ResponseWriter, request *http.Request) {
	vars := mux.Vars(request)
	id, err := strconv.ParseInt(vars["id"], 10, 32)
	if err != nil {
		response.JSON(
			w, http.StatusBadRequest,
			response.Answer{Error: err.Error()},
		)
		return
	}

	userGotten, err := r.app.Storage.GetById(id)
	if err != nil {
		response.JSON(
			w, http.StatusBadRequest,
			response.Answer{Error: err.Error()},
		)
		return
	}

	response.JSON(
		w, http.StatusOK,
		response.Answer{Data: userGotten},
	)
}

func (r *Router) GetUsers(w http.ResponseWriter, request *http.Request) {
	users, err := r.app.Storage.GetUsers()
	if err != nil {
		response.JSON(
			w, http.StatusBadRequest,
			response.Answer{Error: err.Error()},
		)
		return
	}

	response.JSON(
		w, http.StatusOK,
		response.Answer{Data: users},
	)
}

func (r *Router) DeleteUser(w http.ResponseWriter, request *http.Request) {
	vars := mux.Vars(request)
	uid, err := strconv.ParseUint(vars["id"], 10, 32)
	if err != nil {
		response.JSON(
			w, http.StatusBadRequest,
			response.Answer{Error: err.Error()},
		)
		return
	}

	err = r.app.Storage.DeleteUser(uid)
	if err != nil {
		response.JSON(
			w, http.StatusBadRequest,
			response.Answer{Error: err.Error()},
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

	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    tokens.AccessToken,
		Expires:  time.Unix(tokens.AccessExpires, 0),
		HttpOnly: true,
	})

	response.JSON(w, http.StatusOK, response.Answer{Data: tokens})
	return
}

func (r *Router) LogOut(w http.ResponseWriter, request *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    "",
		Expires:  time.Unix(-1, 0),
		HttpOnly: true,
	})
}

func (r *Router) Refresh(w http.ResponseWriter, request *http.Request) {
	defer request.Body.Close()
	authorizationBearer := request.Header.Get("Authorization")

	accessToken := strings.Split(authorizationBearer, " ")[1]

	var claims auth.Claims

	token, err := jwt.ParseWithClaims(
		accessToken,
		&claims,
		func(token *jwt.Token) (interface{}, error) {
			return []byte(r.app.Config.GetToken().ApiAccessKey), nil
		})
	if err != nil {
		response.JSON(
			w, http.StatusInternalServerError,
			response.Answer{Error: fmt.Sprintf("token err: %v", err.Error())},
		)
		return
	}

	tokenValid := token.Valid
	if !tokenValid {
		response.JSON(
			w, http.StatusInternalServerError,
			response.Answer{Error: "token not valid"},
		)
		return
	}

	user, err := r.app.Storage.GetById(int64(claims.UserId))
	if err != nil {
		response.JSON(
			w, http.StatusBadRequest,
			response.Answer{Error: err.Error()},
		)
		return
	}

	tokens, err := user.CreateToken(r.app.Config.GetToken())
	if err != nil {
		response.JSON(
			w, http.StatusInternalServerError,
			response.Answer{Error: fmt.Sprintf("token err: %v", err.Error())},
		)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    tokens.AccessToken,
		Expires:  time.Unix(tokens.AccessExpires, 0),
		HttpOnly: true,
	})

	response.JSON(w, http.StatusOK, response.Answer{Data: tokens})
	return
}
