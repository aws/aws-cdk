import got from 'got';

export async function handler(): Promise<void> {
  const response = await got('https://aws.amazon.com');
  console.log(response.body); // tslint:disable-line no-console
}
