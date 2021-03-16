package model

import (
	"github.com/and67o/calendar/server/internal/auth"
	"github.com/and67o/calendar/server/internal/configuration"
	"github.com/dgrijalva/jwt-go"
	"github.com/jinzhu/gorm"
	"golang.org/x/crypto/bcrypt"
	"html"
	"strings"
	"time"
)

type User struct {
	ID        int       `gorm:"primary_key;auto_increment" json:"id"`
	Email     string    `gorm:"size:255;not null;unique" json:"email"`
	FirstName string    `gorm:"size:255;not null;column:firstname" json:"firstname"`
	LastName  string    `gorm:"size:255;not null;column:lastname" json:"lastname"`
	Password  string    `gorm:"size:100;not null" json:"password"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}

func VerifyPassword(hashedPassword string, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}

func (u *User) HashPassword() error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)
	return nil
}

func (u *User) Prepare() {
	u.ID = 0
	u.Email = html.EscapeString(strings.TrimSpace(u.Email))
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

func (u *User) GetByEmail(db *gorm.DB, email string) (User, error) {
	user := User{}
	err := db.Model(User{}).
		Where("email = ?", email).
		Take(&user).
		Error
	if err != nil {
		return User{}, err
	}
	return User{}, err
}

func token(key []byte, userId int, exp int) (string, int64, error) {
	ext := time.Now().Add(time.Hour * time.Duration(exp)).Unix()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, auth.Claims{
		UserId: userId,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: ext,
		},
	})
	signedToken, err := token.SignedString(key)
	if err != nil {
		return "", 0, err
	}
	return signedToken, ext, nil
}

func (u *User) CreateToken(conf configuration.TokenConf) (*auth.Token, error) {
	accessToken, AccessTokenExt, err := token([]byte(conf.ApiAccessKey), u.ID, conf.AccessTimeExp)
	if err != nil {
		return nil, err
	}

	refreshToken, _, err := token([]byte(conf.ApiRefreshKey), u.ID, conf.RefreshTimeExp)
	if err != nil {
		return nil, err
	}

	return &auth.Token{
		AccessToken:   accessToken,
		RefreshToken:  refreshToken,
		AccessExpires: AccessTokenExt,
	}, nil
}
