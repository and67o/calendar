package main

import (
	"calendar/server/interfaces"
	"calendar/server/internal/app"
	"calendar/server/internal/configuration"
	"calendar/server/internal/logger"
	internalhttp "calendar/server/internal/server/http"
	"calendar/server/storage"
	"context"
	"flag"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"
)

var configFile string

func init() {
	flag.StringVar(&configFile, "config", "./configs/config.toml", "Path to configuration file")
}

func main()  {
	flag.Parse()

	config, err := configuration.New(configFile)
	if err != nil {
		log.Fatal(err)
	}

	logg, err := logger.New(config.Logger)
	if err != nil {
		log.Fatal(err)
	}

	storageSql, err := storage.New(config.DB)
	if err != nil {
		log.Fatal(err)
	}

	calendar := app.New(logg, storageSql)

	httpServer:=internalhttp.New(calendar, config.Rest)

	_, cancel := context.WithCancel(context.Background())
	defer cancel()

	go watchSignals(httpServer, logg, cancel)

	logg.Info("calendar start")

	err = httpServer.Start()
	if err != nil {
		logg.Error("failed to start http server: " + err.Error())
		os.Exit(1) //nolint:gocritic
	}
}

func watchSignals(httpServer interfaces.HTTPApp, logg interfaces.Logger, cancel context.CancelFunc) {
	signals := make(chan os.Signal, 1)
	signal.Notify(signals, os.Interrupt, syscall.SIGTERM)

	<-signals
	signal.Stop(signals)
	cancel()

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*3)
	defer cancel()

	err := httpServer.Stop(ctx)
	if err != nil {
		logg.Error("failed to stop http server: " + err.Error())
	}

}