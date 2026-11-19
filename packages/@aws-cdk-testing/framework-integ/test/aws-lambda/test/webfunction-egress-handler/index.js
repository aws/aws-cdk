// A WebFunction runs this file as a long-lived HTTP server. The platform passes the address
// to listen on in AWS_LAMBDA_HTTP_ENDPOINT (for example "0.0.0.0:3000").
//
// Each request fetches OBJECT_URL and returns its body. The bucket only serves that object
// through the VPC's S3 gateway endpoint, so a 200 here shows both that the handler runs and
// that its egress goes through the network connector into the VPC.
const http = require('http');
const https = require('https');

function fetchObject(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: 5000 }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('timeout', () => req.destroy(new Error('timed out')));
    req.on('error', reject);
  });
}

const server = http.createServer(async (_req, res) => {
  let status;
  let result;
  try {
    const object = await fetchObject(process.env.OBJECT_URL);
    status = object.status === 200 ? 200 : 502;
    result = { objectStatus: object.status, object: object.body };
  } catch (err) {
    status = 502;
    result = { error: err.message };
  }
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(result));
});

const endpoint = (process.env.AWS_LAMBDA_HTTP_ENDPOINT || '0.0.0.0:3000').replace(/^[a-z]+:\/\//, '');
const sep = endpoint.lastIndexOf(':');
server.listen(Number(endpoint.slice(sep + 1)) || 3000, endpoint.slice(0, sep) || '0.0.0.0');
