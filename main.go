package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"time"
)

type URL struct {
	Original string    `json:"original"`
	Short    string    `json:"short"`
	Created  time.Time `json:"created"`
}

var urlMap = make(map[string]string)

func generateShortCode() string {
}



func main() {

	http.HandleFunc("/shorten", shortenHandler)
	http.HandleFunc("/r/", redirectHandler)

}


