package app

import "github.com/and67o/calendar/server/internal/interfaces"

type App struct {
	Logger  interfaces.Logger
	Storage interfaces.Storage
}

func New(logger interfaces.Logger, storage interfaces.Storage) *App {
	return &App{
		Logger:  logger,
		Storage: storage,
	}
}
