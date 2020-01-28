import { mult } from './util';

export async function handler(): Promise<void> {
  console.log(mult(3, 4)); // tslint:disable-line no-console
}
