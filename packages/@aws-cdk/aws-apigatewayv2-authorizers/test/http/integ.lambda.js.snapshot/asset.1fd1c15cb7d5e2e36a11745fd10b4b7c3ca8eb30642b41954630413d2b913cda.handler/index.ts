export const handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from authenticated lambda' }),
    headers: {
      'Content-Type': 'application/json',
    },
  };
};