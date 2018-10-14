const test = require('ava');
const request = require('request-promise');
const listen = require('test-listen');
const {compose, server, status} = require('.');

const {send} = server;

const getUrl = fn => listen(server(fn));

test('should send(200, <String>)', async t => {
	const fn = (req, res) => {
		send(res, 200, 'foo');
	};

	const url = await getUrl(fn);
	const res = await request(url, {resolveWithFullResponse: true});

	t.is(res.statusCode, 200);
	t.is(res.body, 'foo');
});

test('should send(200, <Empty>)', async t => {
	const fn = status(200);

	const url = await getUrl(fn);
	const res = await request(url, {resolveWithFullResponse: true});

	t.is(res.statusCode, 200);
	t.is(res.body, '');
});

const first = fn => (first, second) => {
	return fn(first, second, 'third');
};

const second = fn => (...args) => {
	args.push('another one');
	return fn(...args);
};

const third = fn => async (first, second, ...args) => {
	const lrp = () =>
		new Promise(resolve => {
			setTimeout(() => {
				resolve('last');
			}, 10);
		});
	const last = await lrp();
	args.push(last);
	return fn(first, second, ...args);
};

test('should compose correct', async t => {
	const composed = compose(
		first,
		second,
		third
	)((...args) => {
		t.is(args.length, 5);
		t.is(args[0], 'first');
		t.is(args[1], 'second');
		t.is(args[2], 'third');
		t.is(args[3], 'another one');
		t.is(args[4], 'last');
	});

	await composed('first', 'second');
});
