package interfaces

import (
	"context"
	"github.com/and67o/calendar/server/internal/configuration"
	"github.com/and67o/calendar/server/internal/model"
	"github.com/jinzhu/gorm"
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
	Close() error
	GetDb() *gorm.DB
	GetByEmail(email string) (*model.User, error)
	GetById(id int64) (*model.User, error)
	GetUsers() (*[]model.User, error)
	DeleteUser(id uint64) error
	SaveUser(u model.User) (*model.User, error)
}

type Config interface {
	GetLogger() configuration.LoggerConf
	GetHTTP() configuration.HTTPConf
	GetDB() configuration.DBConf
	GetToken() configuration.TokenConf
}