package internalhttp

import (
	"calendar/server/interfaces"
	"calendar/server/internal/app"
	"calendar/server/internal/configuration"
	router2 "calendar/server/internal/router"
	"context"
	"fmt"
	"net"
	"net/http"
)

type Server struct {
	app    *app.App
	server *http.Server
}

func New(app *app.App, config configuration.HTTPConf) interfaces.HTTPApp {
	return &Server{
		app: app,
		server: &http.Server{
			Handler: router2.New(),
			Addr:    net.JoinHostPort(config.Host, config.Port),
		},
	}
}

func (s *Server) Start() error {
	err := s.server.ListenAndServe()
	if err != nil {
		return fmt.Errorf("server start: %w", err)
	}
	return err
}

func (s *Server) Stop(ctx context.Context) error {
	s.app.Logger.Info("http server shutdown")

	err := s.server.Shutdown(ctx)
	if err != nil {
		return fmt.Errorf("shutdown error: %w", err)
	}

	return nil
}
