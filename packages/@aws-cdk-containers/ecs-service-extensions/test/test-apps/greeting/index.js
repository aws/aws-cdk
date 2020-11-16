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

app.get('*', function (req, res) {
  res.send(greetings[Math.floor(Math.random() * greetings.length)] + ` (${hostname})`);
});

app.listen(port, () => console.log(`Listening on port ${port}!`));

// This causes the process to respond to "docker stop" faster
process.on('SIGTERM', function () {
  console.log('Received SIGTERM, shutting down');
  app.close();
});