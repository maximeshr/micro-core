const test = require('ava');
const {load, is, development, staging, test: _test, production} = require('.');

test.beforeEach(t => {
	t.context = {
		env: {
			NODE_ENV: 'test',
			FOO: 'bar'
		}
	};
});

test('should load beforeEach environment correctly', t => {
	t.is(t.context.env.NODE_ENV, 'test');
	t.is(t.context.env.FOO, 'bar');
});

test('should load environment correctly', t => {
	const config = load(t.context.env, {NODE_ENV: 'development', FOO: 'buz'});
	t.is(config.NODE_ENV, 'test');
	t.is(config.FOO, 'bar');
});

test('should overwrite configuration if environment variable is undefined', t => {
	const config = load(t.context.env, {FOW: 'buz'});
	t.is(config.FOW, 'buz');
});

test('should not load environment if variable is not specify', t => {
	const config = load(t.context.env, {});
	t.is(config.FOO, undefined);
});

test('should check if NODE_ENV is the same as configured', t => {
	t.truthy(is({NODE_ENV: 'production'})('production'));
	t.falsy(is({NODE_ENV: 'test'})('production'));
});

test('should check if we are in development', t => {
	t.truthy(development({NODE_ENV: 'development'}));
	t.falsy(development({NODE_ENV: 'foo'}));
});

test('should check if we are in staging', t => {
	t.truthy(staging({NODE_ENV: 'staging'}));
	t.falsy(staging({NODE_ENV: 'foo'}));
});

test('should check if we are in test', t => {
	t.truthy(_test({NODE_ENV: 'test'}));
	t.falsy(_test({NODE_ENV: 'foo'}));
});

test('should check if we are in production', t => {
	t.truthy(production({NODE_ENV: 'production'}));
	t.falsy(production({NODE_ENV: 'foo'}));
});
