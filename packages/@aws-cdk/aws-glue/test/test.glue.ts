import { Test, testCase } from 'nodeunit';

export = testCase({
  notTested(test: Test) {
    test.ok(true, 'No tests are specified for this package.');
    test.done();
  }
});
