const micro = require('micro');
const dispatch = require('micro-route/dispatch');
const match = require('micro-route/match');

const {send} = micro;

const status = n => (req, res) => send(res, n);

const server = micro;

const compose = (...fns) =>
	fns.reduce(
		(f, g) => (...args) => (g ? f(g(...args)) : f(...args)),
		fn => async (...args) => await fn(...args) // eslint-disable-line no-return-await
	);

const listen = server => (port, fn) => server.listen(port, fn());

module.exports = {
	server,
	status,
	compose,
	listen,
	dispatch,
	match
};
