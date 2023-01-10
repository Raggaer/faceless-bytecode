package main

import (
	"encoding/hex"
)

type bytecode struct {
	buff []byte
}

func generateBytecode(data string) string {
	b := &bytecode{
		buff: []byte{},
	}

	bytecodeLen := len(data) / 2
	if bytecodeLen > 255 {
		b.push2(bytecodeLen) // PUSH2 uses 3 bytes
		b.push1(15)          // hex string starts at osset 15
	} else {
		b.push1(bytecodeLen) // PUSH1 uses 2 bytes
		b.push1(13)          // hex string starts at offset 13
	}
	b.push1(0)
	b.codecopy()

	if bytecodeLen > 255 {
		b.push2(bytecodeLen)
	} else {
		b.push1(bytecodeLen)
	}
	b.push1(0)
	b.ret()  // Return code
	b.stop() // Halt

	// Append hex string directly instead of adding to the buffer
	return hex.EncodeToString(b.buff) + data
}

func (b *bytecode) stop() {
	b.buff = append(b.buff, 0x00)
}

func (b *bytecode) ret() {
	b.buff = append(b.buff, 0xF3)
}

func (b *bytecode) codecopy() {
	b.buff = append(b.buff, 0x39)
}

func (b *bytecode) push1(v int) {
	b.buff = append(b.buff, []byte{
		0x60,
		uint8(v),
	}...)
}

func (b *bytecode) push2(v int) {
	b.buff = append(b.buff, []byte{
		0x61,
		uint8(v >> 8),
		uint8(v),
	}...)
}
