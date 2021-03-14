package internalhttp

import (
	"context"
	"errors"
	"fmt"
	"github.com/and67o/calendar/server/internal/app"
	"github.com/and67o/calendar/server/internal/configuration"
	"github.com/and67o/calendar/server/internal/interfaces"
	"github.com/and67o/calendar/server/internal/router"
	"net"
	"net/http"
)

var (
	EmptyConf = errors.New("empty path")
)

type Server struct {
	app    *app.App
	server *http.Server
}

func New(app *app.App, config configuration.HTTPConf) (interfaces.HTTPApp, error) {
	r := router.New()
fmt.Println(r.GetRouter())
	addr, err := getAddr(config)
	if err != nil {
		return nil, err
	}

	return &Server{
		app: app,
		server: &http.Server{
			Handler: r.GetRouter(),
			Addr:    addr,
		},
	}, nil
}

func getAddr(config configuration.HTTPConf) (string, error) {
	if config.Host == "" || config.Port == "" {
		return "", EmptyConf
	}
	return net.JoinHostPort(config.Host, config.Port), nil
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
