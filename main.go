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
	const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	code := make([]byte, 6)
	for i := range code {
		code[i] = chars[rand.Intn(len(chars))]
	}
	return string(code)
}

func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func shortenHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == "OPTIONS" {
		return
	}

	var data struct {
		URL string `json:"url"`
	}

	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	shortCode := generateShortCode()
	urlMap[shortCode] = data.URL

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"short": shortCode})
	
	log.Printf("Created: %s -> %s", shortCode, data.URL)
}

func redirectHandler(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Path[len("/r/"):]
	
	if originalURL, exists := urlMap[code]; exists {
		log.Printf("Redirecting: %s -> %s", code, originalURL)
		http.Redirect(w, r, originalURL, http.StatusFound)
		return
	}
	
	http.Error(w, "URL not found", http.StatusNotFound)
}

func main() {
	rand.Seed(time.Now().UnixNano())

	http.HandleFunc("/shorten", shortenHandler)
	http.HandleFunc("/r/", redirectHandler)

	port := ":3000"
	fmt.Printf("\n Server running on http://localhost%s\n", port)
	fmt.Println(" Ready to shorten URLs!\n")
	
	log.Fatal(http.ListenAndServe(port, nil))
}