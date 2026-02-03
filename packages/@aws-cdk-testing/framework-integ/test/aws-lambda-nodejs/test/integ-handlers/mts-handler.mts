/* eslint-disable no-console */
import * as crypto from 'crypto';

export async function handler(): Promise<void> {
  console.log(crypto.createHash('sha512').update('cdk').digest('hex'));
}
