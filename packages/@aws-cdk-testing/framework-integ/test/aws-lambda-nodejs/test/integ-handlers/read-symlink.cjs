const fs = require('fs');
const path = require('path');

exports.handler = async () => fs.readFileSync(path.join(__dirname, 'layer/message.txt'), 'utf8').trim();
