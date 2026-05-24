export async function handler(): Promise<{ statusCode: number; body: string }> {
  return {
    statusCode: 200,
    body: JSON.stringify({ bundler: 'rolldown' }),
  };
}
