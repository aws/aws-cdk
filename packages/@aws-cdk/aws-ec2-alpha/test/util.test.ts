import { CidrBlock } from '../lib/util';

describe('Tests for the CidrBlock.rangesOverlap method to check if IPv4 ranges overlap', () =>{
  test('Should return false for non-overlapping IP ranges', () => {
    const range1 = new CidrBlock('10.0.0.0/20');
    const range2 = new CidrBlock('10.0.128.0/20');
    expect(CidrBlock.rangesOverlap(range1, range2)).toBe(false);
  });

  test('Should return true for overlapping IP ranges', () => {
    const range1 = new CidrBlock('54.0.0.0/17');
    const range2 = new CidrBlock('54.0.100.0/22');
    expect(CidrBlock.rangesOverlap(range1, range2)).toBe(true);
  });

  test('Should return true for overlapping IP ranges where one range is completely inside the other', () => {
    const range1 = new CidrBlock('10.0.0.0/17');
    const range2 = new CidrBlock('10.0.64.0/24');
    expect(CidrBlock.rangesOverlap(range1, range2)).toBe(true);
  });

  test('Should return true for overlapping IP ranges where the last IP of one range is the first IP of the other', () => {
    const range1 = new CidrBlock('10.0.0.0/20');
    const range2 = new CidrBlock('10.0.15.255/32');
    expect(CidrBlock.rangesOverlap(range1, range2)).toBe(true);
  });

  test('Should return false for non-overlapping IP ranges where one range starts immediately after the other ends', () => {
    const range1 = new CidrBlock('10.0.0.0/20');
    const range2 = new CidrBlock('10.0.16.0/22');
    expect(CidrBlock.rangesOverlap(range1, range2)).toBe(false);
  });
});
