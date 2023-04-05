/* eslint-disable no-console */
export async function handler(event: any) {
  console.log('Event: %j', event);
  return event;
}
