package app

import "calendar/server/interfaces"

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
