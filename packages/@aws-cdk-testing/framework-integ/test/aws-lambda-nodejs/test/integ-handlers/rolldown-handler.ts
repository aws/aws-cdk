/* eslint-disable no-console */

export async function handler(event: any): Promise<any> {
  console.log('Event:', JSON.stringify(event, null, 2));

  // Use some modern ES features to verify bundling works
  const result = {
    message: 'Hello from Rolldown bundler!',
    timestamp: new Date().toISOString(),
    event,
    // Test async/await
    delayed: await Promise.resolve('async works'),
    // Test optional chaining
    optional: event?.test?.value ?? 'default',
    // Test array methods
    numbers: [1, 2, 3, 4, 5].map((n) => n * 2),
  };

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
}
