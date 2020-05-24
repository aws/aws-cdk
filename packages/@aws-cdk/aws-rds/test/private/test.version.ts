import { Test } from 'nodeunit';
import { compare } from '../../lib/private/version';

export = {
  'compare - same versions'(test: Test) {
    test.equals(compare('1', '1'), 0);
    test.equals(compare('1.0', '1.0'), 0);
    test.done();
  },

  'compare - a < b'(test: Test) {
    test.equals(compare('1', '2'), -1);
    test.equals(compare('1.0', '1.2'), -1);
    test.equals(compare('1.3', '4'), -1);
    test.equals(compare('1', '1.2'), -1);
    test.equals(compare('1.0', '2.0'), -1);
    test.equals(compare('4', '10'), -1);
    test.done();
  },

  'compare - a > b'(test: Test) {
    test.equals(compare('2', '1'), 1);
    test.equals(compare('1.2', '1.0'), 1);
    test.equals(compare('1.2', '1'), 1);
    test.equals(compare('4', '1.2'), 1);
    test.equals(compare('2.0', '1.0'), 1);
    test.equals(compare('10', '4'), 1);
    test.done();
  },

  'compare - NaN'(test: Test) {
    test.throws(() => compare('1', ''), /only compare version strings with numbers/);
    test.throws(() => compare('', '1'), /only compare version strings with numbers/);
    test.throws(() => compare('', ''), /only compare version strings with numbers/);
    test.throws(() => compare('4x', '1.0'), /only compare version strings with numbers/);
    test.done();
  },
};