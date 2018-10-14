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

```
⌐■_■ - v8.12.0 mini-core [master*] curl -v localhost:3000
* Rebuilt URL to: localhost:3000/
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 3000 (#0)
> GET / HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.54.0
> Accept: */*
>
< HTTP/1.1 200 OK
< Date: Sun, 14 Oct 2018 16:21:49 GMT
< Connection: keep-alive
< Content-Length: 0
<
* Connection #0 to host localhost left intact
```

```
⌐■_■ - v10.12.0 mini-core [master*] node src/index.js
{"level":30,"time":1539534011537,"msg":"Server started on :3000","pid":22862,"hostname":"laptop.local","v":1}
{"level":30,"time":1539534037351,"msg":"pong","pid":22862,"hostname":"laptop.local","v":1}
{"level":30,"time":1539534037376,"msg":"request completed","pid":22862,"hostname":"laptop.local","req":{"id":1,"method":"GET","url":"/","headers":{"host":"localhost:3000","user-agent":"curl/7.54.0","accept":"*/*"},"remoteAddress":"::1","remotePort":59124},"res":{"statusCode":200,"headers":{}},"responseTime":26,"v":1}
{"level":30,"time":1539534109392,"msg":"pong","pid":22862,"hostname":"laptop.local","v":1}
{"level":30,"time":1539534109393,"msg":"request completed","pid":22862,"hostname":"laptop.local","req":{"id":2,"method":"GET","url":"/","headers":{"host":"localhost:3000","user-agent":"curl/7.54.0","accept":"*/*"},"remoteAddress":"::1","remotePort":59422},"res":{"statusCode":200,"headers":{}},"responseTime":1,"v":1}
```
