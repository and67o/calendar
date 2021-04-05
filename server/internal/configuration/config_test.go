package configuration

import (
	"github.com/stretchr/testify/require"
	"testing"
)

type test struct {
	path string
	err  error
}

func TestNew(t *testing.T) {
	t.Run("errors", func(t *testing.T) {
		for _, tst := range [...]test{
			{
				path: "",
				err:  EmptyPathError,
			},
		} {
			_, err := New(tst.path)
			require.Equal(t, tst.err, err)
		}
	})

	t.Run("wrong path", func(t *testing.T) {
		for _, tst := range [...]test{
			{
				path: "./configs/wrong_path.env",
			},
			{
				path: "wrong_path",
			},
		} {
			_, err := New(tst.path)
			require.Error(t, err)
			require.Contains(t, err.Error(),"viper read error:")
		}
	})

	t.Run("pass result", func(t *testing.T) {
		for _, tst := range [...]test{
			{
				path: "./testdata/config.yaml",
			},
		} {
			c, err := New(tst.path)
			require.Nil(t, err)
			require.Equal(t, c.Logger.File, "logfile")
		}
	})
}