package router

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"net/http"
)

func Router() *mux.Router {
	router := mux.NewRouter()

	router.HandleFunc("/api/hello", hello).Methods(http.MethodGet)

	return router
}

func hello(w http.ResponseWriter, _ *http.Request) {
	w.Header().Set("Content-type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]string{"message": "hello-world"})
}
