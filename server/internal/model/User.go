package model

import (
	"github.com/jinzhu/gorm"
	"golang.org/x/crypto/bcrypt"
	"html"
	"strings"
	"time"
)

type User struct {
	ID        int       `gorm:"primary_key;auto_increment" json:"id"`
	Login     string    `gorm:"size:255;not null;unique" json:"login"`
	Password  string    `gorm:"size:100;not null" json:"password"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`

	gorm.Model

}

func Hash(password string) ([]byte, error) {
	return bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
}

func VerifyPassword(hashedPassword string, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}

func (u *User) BeforeSave() error {
	hashedPassword, err := Hash(u.Password)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)
	return nil
}
func (u *User) Prepare() {
	u.ID = 0
	u.Login = html.EscapeString(strings.TrimSpace(u.Login))
	u.CreatedAt = time.Now()
	u.UpdatedAt = time.Now()
}

//func (u *User) Validate(action string) error {
//	switch strings.ToLower(action) {
//	case "update":
//		if u.Nickname == "" {
//			return errors.New("Required Nickname")
//		}
//		if u.Password == "" {
//			return errors.New("Required Password")
//		}
//		if u.Email == "" {
//			return errors.New("Required Email")
//		}
//		if err := checkmail.ValidateFormat(u.Email); err != nil {
//			return errors.New("Invalid Email")
//		}
//
//		return nil
//	case "login":
//		if u.Password == "" {
//			return errors.New("Required Password")
//		}
//
//		if err := checkmail.ValidateFormat(u.Email); err != nil {
//			return errors.New("Invalid Email")
//		}
//		return nil
//
//	default:
//		if u.Nickname == "" {
//			return errors.New("Required Nickname")
//		}
//		if u.Password == "" {
//			return errors.New("Required Password")
//		}
//		if u.Email == "" {
//			return errors.New("Required Email")
//		}
//		if err := checkmail.ValidateFormat(u.Email); err != nil {
//			return errors.New("Invalid Email")
//		}
//		return nil
//	}
//}


func (u *User) SaveUser(db *gorm.DB) (*User, error) {

	var err error
	err = db.Debug().Create(&u).Error
	if err != nil {
		return &User{}, err
	}
	return u, nil
}