package storage

import (
	"calendar/server/interfaces"
	"calendar/server/internal/configuration"
	"fmt"
	_ "github.com/go-sql-driver/mysql" // nolint: gci
	"github.com/jmoiron/sqlx"
)

type Storage struct {
	db *sqlx.DB
}

const driverName = "mysql"
const format = "2006-01-02 15:04:05"

func New(config configuration.DBConf) (interfaces.Storage, error) {
	db, err := sqlx.Open(driverName, dataSourceName(config))
	if err != nil {
		return nil, fmt.Errorf("connect db: %w", err)
	}

	err = db.Ping()
	if err != nil {
		return nil, fmt.Errorf("check ping db: %w", err)
	}

	return &Storage{
		db: db,
	}, nil
}

func dataSourceName(config configuration.DBConf) string {
	return fmt.Sprintf("%s:%s@(%s:%d)/%s",
		config.User,
		config.Pass,
		config.Host,
		config.Port,
		config.DBName,
	)
}

func (s *Storage) Close() error {
	err := s.db.Close()
	if err != nil {
		return fmt.Errorf("close connect: %w", err)
	}

	return nil
}