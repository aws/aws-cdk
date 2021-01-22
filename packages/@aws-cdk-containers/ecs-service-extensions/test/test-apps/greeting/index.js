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

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const os = require('os');
const hostname = os.hostname();

var greetings = [
  'Hey',
  'Hi',
  'Hello',
  'Greetings'
];

if (process.env.TEST_XRAY == 'true') {
  app.use(AWSXRay.express.openSegment('greeting'));
}

app.get('*', function (req, res) {
  res.send(greetings[Math.floor(Math.random() * greetings.length)] + ` (${hostname})`);
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