package configuration

type Config struct {
	Logger LoggerConf
	Rest   HTTPConf
	DB     DBConf
	Token  TokenConf
}

type LoggerConf struct {
	Level   string `mapstructure:"log_level"`
	File    string `mapstructure:"log_file"`
	IsProd  bool   `mapstructure:"log_trace_on"`
	TraceOn bool   `mapstructure:"log_prod_on"`
}

type HTTPConf struct {
	Host string `mapstructure:"server_host"`
	Port string `mapstructure:"server_port"`
}

type DBConf struct {
	User   string `mapstructure:"db_user"`
	Pass   string `mapstructure:"db_password"`
	DBName string `mapstructure:"db_database"`
	Host   string `mapstructure:"db_host"`
	Port   int    `mapstructure:"db_port"`
}

type TokenConf struct {
	AccessTimeExp  int    `mapstructure:"token_access_expire_time"`
	RefreshTimeExp int    `mapstructure:"token_refresh_expire_time"`
	ApiAccessKey   string `mapstructure:"token_api_access_key"`
	ApiRefreshKey  string `mapstructure:"token_api_refresh_key"`
}

func (c *Config) GetToken() TokenConf {
	return c.Token
}

func (c *Config) GetLogger() LoggerConf {
	return c.Logger
}

func (c Config) GetHTTP() HTTPConf {
	return c.Rest
}

func (c Config) GetDB() DBConf {
	return c.DB
}
