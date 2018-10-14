```
const {server, listen, dispatch, status, compose} = require('./components/http');
const {logger, logreq} = require('./components/logger');
const {load} = require('./components/config');

const config = load(process.env, {NODE_ENV: 'development', PORT: 3000});
const l = logger({enabled: true});
const lr = logreq(l);

const {send} = server;

const hello = (req, res) => send(res, 200);

const router = dispatch()
	.dispatch('/', 'GET', hello)
	.otherwise(status(405));

const lm = fn => (req, res, ...args) => {
	lr(req, res);

	return fn(req, res, ...args);
};

const ping = fn => (req, res, ...args) => {
	l.info('pong');

	return fn(req, res, ...args);
};

const m = compose(
	lm,
	ping
);

const endpoint = server(m(router));

(() => {
	try {
		listen(endpoint)(config.PORT, () => l.info(`Server started on :${config.PORT}`));
	} catch (error) {
		l.fatal(error);
		process.emit('SIGINT');
	}
})();

process.on('SIGINT', () => {
	process.exit(1);
});
```
