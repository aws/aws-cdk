import { Test, testCase } from 'nodeunit';
import {} from '../lib';

exports = testCase({
  notTested(test: Test) {
    test.ok(true, 'No tests are specified for this package.');
    test.done();
  }
});
