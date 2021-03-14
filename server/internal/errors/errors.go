package errors

import "fmt"

type UnauthorizedError struct {
	UserId        int
	OriginalError error
}

func UnauthorizedUser(userId int) error {
	err := fmt.Errorf("sesion invalid for user id %d", userId)

	return &UnauthorizedError{
		UserId:        userId,
		OriginalError: err,
	}
}

func (httpErr *UnauthorizedError) Error() string {
	return fmt.Sprintf(
		"User %d unauthorized Error: %v",
		httpErr.UserId,
		httpErr.OriginalError,
	)
}

type DefaultError struct {
	Name          string
	OriginalError error
}

func Default(name string, errString string) error {
	err := fmt.Errorf("error %s: %v", name, errString)
	return &DefaultError{
		OriginalError: err,
		Name:          name,
	}
}

func (e *DefaultError) Error() string {
	return fmt.Sprintf(
		"Error %s: %v",
		e.Name,
		e.OriginalError,
	)
}
