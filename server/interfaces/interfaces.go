package interfaces

import (
	"context"
)

type Logger interface {
	Info(msg string)
	Error(msg string)
}

type HTTPApp interface {
	Start() error
	Stop(ctx context.Context) error
}

type Storage interface {
}