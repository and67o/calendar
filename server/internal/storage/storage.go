package storage

import (
	"fmt"
	"github.com/and67o/calendar/server/internal/configuration"
	"github.com/and67o/calendar/server/internal/interfaces"
	"github.com/and67o/calendar/server/internal/model"
	_ "github.com/go-sql-driver/mysql" // nolint: gci
	"github.com/jinzhu/gorm"
)

type Storage struct {
	db *gorm.DB
}

const driverName = "mysql"
const format = "2006-01-02 15:04:05"

func New(config configuration.DBConf) (interfaces.Storage, error) {
	db, err := gorm.Open(driverName, dataSourceName(config))
	if err != nil {
		return nil, fmt.Errorf("connect db: %w", err)
	}

	return &Storage{
		db: db,
	}, nil
}

func (s *Storage) Close() error {
	err := s.db.Close()
	if err != nil {
		return fmt.Errorf("close connect: %w", err)
	}

	return nil
}

func (s *Storage) GetDb() *gorm.DB {
	return s.db
}

func dataSourceName(config configuration.DBConf) string {
	return fmt.Sprintf("%s:%s@(%s:%d)/%s?charset=utf8&parseTime=True",
		config.User,
		config.Pass,
		config.Host,
		config.Port,
		config.DBName,
	)
}

func (s *Storage) GetByEmail(email string) (*model.User, error) {
	user := model.User{}

	err := s.db.Model(model.User{}).
		Where("email = ?", email).
		Take(&user).
		Error

	if err != nil {
		return &user, err
	}

	return &user, err
}

func (s *Storage) SaveUser(u model.User) (*model.User, error) {
	var err error

	err = s.db.Debug().Create(&u).Error
	if err != nil {
		return &model.User{}, err
	}

	return &u, nil
}
