const first = require('@first');
const second = require('@second');

exports.handler = async () => first.mult(3, 4) + second.mult(2, 3);
