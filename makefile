BIN_LOGGER = "./bin/"

build:
	go build -v -o ${BIN_LOGGER} ./server/

run_server:
	${BIN_LOGGER}server