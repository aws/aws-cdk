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
  AWSXRay.captureHTTPsGlobal(require('http'));
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
  app.use(AWSXRay.express.openSegment('greeter'));
}

app.get('*', function (req, res) {
  var greeting, name;
  request(GREETING_URL, function (err, resp, body) {
    if (err) {
      console.error('Error talking to the greeting service: ' + err);
      return res.send(200, 'Failed to communciate to the greeting service, check logs');
    }

    greeting = body;

    request(NAME_URL, function (err, resp, body) {
      if (err) {
        console.error('Error talking to the name service: ' + err);
        return res.send(200, 'Failed to communciate to the name service, check logs');
      }

      name = body;

      res.send(`From ${hostname}: ${greeting} ${name}`);
    })
  })
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