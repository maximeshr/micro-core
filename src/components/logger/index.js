const pino = require('pino');
const pinoHttp = require('pino-http');

const logger = options => pino(options);
const logreq = logger => pinoHttp({logger});

module.exports = {
	logger,
	logreq
};
