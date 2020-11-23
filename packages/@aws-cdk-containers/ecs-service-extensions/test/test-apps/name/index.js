// Setup the APM instrumentation
if (process.env.TEST_DATADOG == 'true') {
  require('dd-trace').init();
} else if (process.env.TEST_NEWRELIC == 'true') {
  require('newrelic');
}

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const os = require('os');
const hostname = os.hostname();

var names = [
  'James', 'Mary',
  'John', 'Patricia',
  'Robert', 'Jennifer',
  'Michael', 'Linda',
  'William', 'Elizabeth',
  'David', 'Barbara',
  'Richard', 'Susan',
  'Joseph', 'Jessica',
  'Thomas', 'Sarah',
  'Charles', 'Karen'
];

app.get('*', function (req, res) {
  res.send(names[Math.floor(Math.random() * names.length)] + ` (${hostname})`);
});

app.listen(port, () => console.log(`Listening on port ${port}!`));

// This causes the process to respond to "docker stop" faster
process.on('SIGTERM', function () {
  console.log('Received SIGTERM, shutting down');
  app.close();
});