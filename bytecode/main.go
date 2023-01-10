package main

import (
	"flag"
	"fmt"
)

func main() {
	var input string
	flag.StringVar(&input, "i", "", "Hex string to use as the contract bytecode")
	flag.Parse()

	if len(input) <= 0 {
		return
	}

	if input[0:2] == "0x" {
		input = input[2:]
	}
	fmt.Println(generateBytecode(input))
}
