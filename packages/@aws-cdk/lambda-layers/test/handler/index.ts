import AWS = require('aws-sdk');

export async function handler() {
  console.log(`AWS SDK VERSION: ${(AWS as any).VERSION}`); // tslint:disable-line no-console
}
