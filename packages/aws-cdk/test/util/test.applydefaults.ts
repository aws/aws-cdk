import { Test } from 'nodeunit';
import { applyDefaults } from '../../lib/util';

export = {
  'applyDefaults() works'(test: Test) {
    const given = { a: 1 };
    const defaults = { a: 2, b: 2 };

    const output = applyDefaults(given, defaults);

    test.deepEqual({ a: 1, b: 2}, output);
    test.done();
  }
};
