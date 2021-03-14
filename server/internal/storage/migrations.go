package storage

import "github.com/and67o/calendar/server/internal/model"

func (s *Storage) Migration() {
	s.db.AutoMigrate(
		&model.User{},
	)
}
