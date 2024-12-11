import { CidrBlock } from '../lib/util';

describe('Tests for the CidrBlock.rangesOverlap method to check if IPv4 ranges overlap', () =>{
  test('Should return false for non-overlapping IP ranges', () => {
    const testCidr = new CidrBlock('10.0.0.0/16');
    const range1 = ['10.0.0.0', '10.0.15.255'] as [string, string];
    const range2 = ['10.0.128.0', '10.0.143.255'] as [string, string];
    expect(testCidr.rangesOverlap(range1, range2)).toBe(false);
  });

  test('Should return true for overlapping IP ranges', () => {
    const testCidr = new CidrBlock('54.0.0.0/17');
    const range1 = ['54.0.0.0', '54.0.127.255'] as [string, string];
    const range2 = ['54.0.100.0', '54.0.192.255'] as [string, string];
    expect(testCidr.rangesOverlap(range1, range2)).toBe(true);
  });
});
