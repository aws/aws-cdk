// Minimal HTTP server for tests. Lambda sets AWS_LAMBDA_HTTP_ENDPOINT to the host and port to bind.
const http = require('http');

const [host, port] = process.env.AWS_LAMBDA_HTTP_ENDPOINT.split(':');
http.createServer((_req, res) => res.end('ok')).listen(Number(port), host);
