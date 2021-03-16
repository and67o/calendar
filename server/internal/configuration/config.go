package configuration

import (
	"errors"
	"fmt"
	"github.com/spf13/viper"
)

var (
	EmptyPathError = errors.New("path empty")
)

func New(path string) (*Config, error) {
	var configuration = new(Config)

	if path == "" {
		return configuration, EmptyPathError
	}

	viper.SetConfigFile(path)

	err := viper.ReadInConfig()
	if err != nil {
		return configuration, fmt.Errorf("viper read error: %w", err)
	}

	err = viper.Unmarshal(&configuration)
	if err != nil {
		return configuration, fmt.Errorf("viper unmarshal error: %w", err)
	}

	return configuration, nil
}
