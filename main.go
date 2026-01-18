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

