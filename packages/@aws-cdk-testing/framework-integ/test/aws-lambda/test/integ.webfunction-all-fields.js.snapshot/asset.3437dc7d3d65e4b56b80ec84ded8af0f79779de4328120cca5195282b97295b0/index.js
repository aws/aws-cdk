// A WebFunction runs this file as a long-lived server process: it must listen on PORT.
const http = require('http');

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok' }));
}).listen(process.env.PORT || 3000);
