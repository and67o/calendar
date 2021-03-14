package router

import (
	"encoding/json"
	"fmt"
	"github.com/and67o/calendar/server/internal/interfaces"
	"github.com/and67o/calendar/server/internal/response"
	"github.com/gorilla/mux"
	"io/ioutil"
	"net/http"
)

type Router struct {
	muxRouter *mux.Router
}

func New() interfaces.Router {
	var router Router

	r := mux.NewRouter()
	router.initRoutes(r)

	return &Router{
		muxRouter: r,
	}
}

func (r *Router) initRoutes(router *mux.Router) {
	router.HandleFunc("/api/hello", r.Hello).Methods(http.MethodGet)

	router.HandleFunc("/api/calendar", r.Calendar).Methods(http.MethodGet)

	router.HandleFunc("/api/login", r.Login).Methods(http.MethodPost)

	router.HandleFunc("/api/user", r.CreateUser).Methods(http.MethodPost)
	router.HandleFunc("/api/user/{id:[0-9]+}", r.GetUser).Methods(http.MethodGet)
	router.HandleFunc("/api/users", r.GetUsers).Methods(http.MethodGet)
	router.HandleFunc("/api/user/{id:[0-9]+}", r.DeleteUser).Methods(http.MethodDelete)
	router.HandleFunc("/api/user/{id:[0-9]+}", r.UpdateUser).Methods(http.MethodPatch)
}

func (r *Router) Hello(w http.ResponseWriter, _ *http.Request) {
	w.Header().Set("Content-type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]string{"message": "hello-world"})
}

func (r *Router) GetRouter() *mux.Router {
	return r.muxRouter
}

func (r *Router) CreateUser(w http.ResponseWriter, request *http.Request) {
	panic("implement me")
}

func (r *Router) GetUser(w http.ResponseWriter, request *http.Request) {
	panic("implement me")
}

func (r *Router) GetUsers(w http.ResponseWriter, request *http.Request) {
	panic("implement me")
}

func (r *Router) DeleteUser(w http.ResponseWriter, request *http.Request) {
	panic("implement me")
}

func (r *Router) UpdateUser(w http.ResponseWriter, request *http.Request) {
	panic("implement me")
}

func (r *Router) Calendar(w http.ResponseWriter, request *http.Request) {
	panic("implement me")
}

func (r *Router) Login(w http.ResponseWriter, request *http.Request) {
	body, err := ioutil.ReadAll(request.Body)
	if err != nil {
		response.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}
	fmt.Println(body)
}
