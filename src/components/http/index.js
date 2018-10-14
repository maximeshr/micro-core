const micro = require('micro');
const {send} = require('micro');

const status = n => (req, res) => send(res, n);

const server = micro;

const compose = (...fns) =>
	fns.reduce(
		(f, g) => (...args) => (g ? f(g(...args)) : f(...args)),
		fn => async (...args) => await fn(...args) // eslint-disable-line no-return-await
	);

const listen = server => port => fn => server.listen(port, fn);

module.exports = {
	status,
	server,
	compose,
	listen
};
