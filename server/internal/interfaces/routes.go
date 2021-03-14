package interfaces

import (
	"github.com/gorilla/mux"
	"net/http"
)

type Router interface {
	Hello(w http.ResponseWriter, _ *http.Request)
	GetRouter() *mux.Router
	User
	Calendar
}

type User interface {
	CreateUser(w http.ResponseWriter, request_ *http.Request)
	Login(w http.ResponseWriter, request *http.Request)
	GetUser(w http.ResponseWriter, request *http.Request)
	GetUsers(w http.ResponseWriter, request *http.Request)
	DeleteUser(w http.ResponseWriter, request *http.Request)
	UpdateUser(w http.ResponseWriter, request *http.Request)
}

type Calendar interface {
	Calendar(w http.ResponseWriter, _ *http.Request)
}