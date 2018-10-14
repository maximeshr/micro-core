const load = (env, defaults) =>
	Object.keys(defaults).reduce(
		(output, key) => ({
			...output,
			[key]: env[key] || defaults[key]
		}),
		{}
	);

const is = config => prefix => config.NODE_ENV === prefix;

const development = config => is(config)('development');
const staging = config => is(config)('staging');
const test = config => is(config)('test');
const production = config => is(config)('production');

module.exports = {
	load,
	is,
	development,
	staging,
	test,
	production
};
