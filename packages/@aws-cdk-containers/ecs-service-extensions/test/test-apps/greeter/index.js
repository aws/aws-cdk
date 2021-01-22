// Setup the APM instrumentation
var AWSXRay;

if (process.env.TEST_DATADOG == 'true') {
  require('dd-trace').init();
}

if (process.env.TEST_NEWRELIC == 'true') {
  require('newrelic');
}

if (process.env.TEST_XRAY == 'true') {
  AWSXRay = require('aws-xray-sdk');
}

var request = require('request-promise-native');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const GREETING_URL = process.env.GREETING_URL;
const NAME_URL = process.env.NAME_URL;

const os = require('os');
const hostname = os.hostname();

if (!GREETING_URL) {
  throw new Error('Process requires that environment variable GREETING_URL be passed');
}

if (!NAME_URL) {
  throw new Error('Process requires that environment variable NAME_URL be passed');
}

if (process.env.TEST_XRAY == 'true') {
  app.use(AWSXRay.express.openSegment('greeting'));
}

app.get('*', async function (req, res) {
  res.send(`From ${hostname}: ` + await request(GREETING_URL) + ' ' + await request(NAME_URL));
});

if (process.env.TEST_XRAY == 'true') {
  app.use(AWSXRay.express.closeSegment());
}


app.listen(port, () => console.log(`Listening on port ${port}!`));

// This causes the process to respond to "docker stop" faster
process.on('SIGTERM', function () {
  console.log('Received SIGTERM, shutting down');
  app.close();
});