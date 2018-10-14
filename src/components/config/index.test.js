const test = require('ava');
const {load} = require('.');

test.beforeEach(t => {
	t.context = {
		env: {
			FOO: 'bar'
		}
	};
});

test('it loads beforeEach environment correctly', t => {
	t.is(t.context.env.FOO, 'bar');
});

test('it loads environment correctly', t => {
	const config = load(t.context.env, {FOO: 'buz'});
	t.is(config.FOO, 'bar');
});

test('it overwrite configuration if environment variable is undefined', t => {
	const config = load(t.context.env, {FOW: 'buz'});
	t.is(config.FOW, 'buz');
});

test('it doesnt load environment if variable is not specify', t => {
	const config = load(t.context.env, {});
	t.is(config.FOO, undefined);
});
