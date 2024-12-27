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

  test('Should return true for overlapping IP ranges where one range is completely inside the other', () => {
    const testCidr = new CidrBlock('10.0.0.0/16');
    const range1 = ['10.0.0.0', '10.0.127.255'] as [string, string];
    const range2 = ['10.0.64.0', '10.0.65.255'] as [string, string];
    expect(testCidr.rangesOverlap(range1, range2)).toBe(true);
  });

  test('Should return true for overlapping IP ranges where the last IP of one range is the first IP of the other', () => {
    const testCidr = new CidrBlock('10.0.0.0/16');
    const range1 = ['10.0.0.0', '10.0.15.255'] as [string, string];
    const range2 = ['10.0.15.255', '10.0.255.255'] as [string, string];
    expect(testCidr.rangesOverlap(range1, range2)).toBe(true);
  });

  test('Should return false for non-overlapping IP ranges where one range starts immediately after the other ends', () => {
    const testCidr = new CidrBlock('10.0.0.0/16');
    const range1 = ['10.0.0.0', '10.0.15.255'] as [string, string];
    const range2 = ['10.0.16.0', '10.0.19.255'] as [string, string];
    expect(testCidr.rangesOverlap(range1, range2)).toBe(false);
  });
});
