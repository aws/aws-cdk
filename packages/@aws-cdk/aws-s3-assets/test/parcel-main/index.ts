import { add, mult } from '../parcel-utils';

export function addMult(a: number, b: number, c: number): number {
  return mult(add(a, b), c);
}
