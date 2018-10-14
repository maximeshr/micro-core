const load = (env, defaults) =>
	Object.keys(defaults).reduce(
		(output, key) => ({
			...output,
			[key]: env[key] || defaults[key]
		}),
		{}
	);

module.exports = {
	load
};
