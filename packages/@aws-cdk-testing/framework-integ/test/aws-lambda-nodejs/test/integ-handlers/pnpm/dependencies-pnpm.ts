// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';

export async function handler() {
  await axios.get('https://www.google.com');
}
