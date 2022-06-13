import { rangeFromSemver } from '../../lib/util/version-range';

describe('rangeFromSemver', () => {
  describe('bracket', () => {
    test('valid', () => {
      expect(rangeFromSemver('1.2.3', 'bracket')).toEqual('1.2.3');
      expect(rangeFromSemver('^1.2.3', 'bracket')).toEqual('[1.2.3,2.0.0)');
    });
  });

  describe('pep', () => {
    test('valid', () => {
      expect(rangeFromSemver('1.2.3', 'pep')).toEqual('==1.2.3');
      expect(rangeFromSemver('^1.2.3', 'pep')).toEqual('>=1.2.3,<2.0.0');
    });
  });

  test('invalid', () => {
    expect(() => rangeFromSemver('1.2', 'bracket')).toThrow();
    expect(() => rangeFromSemver('~1.2.3', 'bracket')).toThrow();
    expect(() => rangeFromSemver('1.2.3-1.4.5', 'bracket')).toThrow();
    expect(() => rangeFromSemver('>2.4.5', 'bracket')).toThrow();
    expect(() => rangeFromSemver('2.*', 'bracket')).toThrow();
  });
});