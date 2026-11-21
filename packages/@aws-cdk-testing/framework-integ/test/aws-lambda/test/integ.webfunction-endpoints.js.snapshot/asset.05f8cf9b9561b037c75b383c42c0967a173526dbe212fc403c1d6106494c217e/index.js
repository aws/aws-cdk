// A WebFunction runs this file as a long-lived HTTP server. The platform passes the address
// to listen on in AWS_LAMBDA_HTTP_ENDPOINT (for example "0.0.0.0:3000").
const http = require('http');

const server = http.createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok' }));
});

const endpoint = (process.env.AWS_LAMBDA_HTTP_ENDPOINT || '0.0.0.0:3000').replace(/^[a-z]+:\/\//, '');
const sep = endpoint.lastIndexOf(':');
server.listen(Number(endpoint.slice(sep + 1)) || 3000, endpoint.slice(0, sep) || '0.0.0.0');
