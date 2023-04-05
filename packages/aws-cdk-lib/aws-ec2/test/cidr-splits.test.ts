import { calculateCidrSplits } from '../lib/cidr-splits';

describe('Cidr split results', () => {
  test('3 big subnets then 6 small ones', () => {
    expect(calculateCidrSplits(22, [24, 24, 24, 28, 28, 28, 28, 28, 28])).toEqual([
      { netmask: 24, count: 4, index: 0 },
      { netmask: 24, count: 4, index: 1 },
      { netmask: 24, count: 4, index: 2 },
      { netmask: 28, count: 64, index: 48 },
      { netmask: 28, count: 64, index: 49 },
      { netmask: 28, count: 64, index: 50 },
      { netmask: 28, count: 64, index: 51 },
      { netmask: 28, count: 64, index: 52 },
      { netmask: 28, count: 64, index: 53 },
    ]);
  });

  test('3 small subnets then 2 big ones', () => {
    expect(calculateCidrSplits(22, [27, 27, 27, 24, 24])).toEqual([
      { netmask: 27, count: 32, index: 0 },
      { netmask: 27, count: 32, index: 1 },
      { netmask: 27, count: 32, index: 2 },
      { netmask: 24, count: 4, index: 1 },
      { netmask: 24, count: 4, index: 2 },
    ]);
  });

  test('small big small', () => {
    expect (calculateCidrSplits(22, [28, 24, 28])).toEqual([
      { netmask: 28, count: 64, index: 0 },
      { netmask: 24, count: 4, index: 1 },
      { netmask: 28, count: 64, index: 32 },
    ]);
  });

  test('allocation too big', () => {
    expect(() => calculateCidrSplits(22, [23, 23, 23])).toThrow(/not big enough/);
  });
});