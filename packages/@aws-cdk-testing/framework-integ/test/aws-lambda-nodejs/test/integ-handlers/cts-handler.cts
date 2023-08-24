/* eslint-disable no-console */
const crypto = require('crypto');

async function handler(): Promise<void> {
  console.log(crypto.createHash('sha512').update('cdk').digest('hex'));
}
module.exports = { handler }
