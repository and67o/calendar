package app

import "github.com/and67o/calendar/server/internal/interfaces"

type App struct {
	Logger  interfaces.Logger
	Storage interfaces.Storage
	Config  interfaces.Config
}

func New(logger interfaces.Logger, storage interfaces.Storage, config interfaces.Config) *App {
	return &App{
		Logger:  logger,
		Storage: storage,
		Config: config,
	}
}
