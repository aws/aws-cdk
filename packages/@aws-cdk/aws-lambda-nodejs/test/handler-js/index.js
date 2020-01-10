import got from 'got';

export async function handler() {
  const response = await got('https://aws.amazon.com');
  console.log(response.body);
}
