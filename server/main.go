package main

import (
	"calendar/server/router"
	"fmt"
	"log"
	"net/http"
)

func main()  {
	r:=router.Router()
	fmt.Println("start")
	log.Fatal(http.ListenAndServe("localhost:8001", r))
}

