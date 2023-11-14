import { Server } from 'http';
import { mult } from './util';

// Create simple http server
const server = new Server((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`${mult(3, 4)}`);
  console.log(mult(3, 4)); // eslint-disable-line no-console
});

const port = parseInt(process.env.PORT || '3001', 10);
server.listen(port);
