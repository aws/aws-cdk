/* eslint-disable no-console */
// @ts-ignore
import delay from 'delay';

export async function handler() {
  await delay(5);
  console.log('log after delay');
}
