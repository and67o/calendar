
package main

import (
	"github.com/jinzhu/gorm"
)

type User struct {
	gorm.Model
	Name string
}

// Up is executed when this migration is applied
func Up_20210313120414(txn *gorm.DB) {
	txn.CreateTable(&User{})
}

// Down is executed when this migration is rolled back
func Down_20210313120414(txn *gorm.DB) {
	txn.DropTableIfExists(&User{})
}
