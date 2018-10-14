const pino = require('pino');
const pinoHttp = require('pino-http');

const logger = (enabled = true) => pino({enabled});
const logreq = pinoHttp({logger});

module.exports = {
	logger,
	logreq
};
