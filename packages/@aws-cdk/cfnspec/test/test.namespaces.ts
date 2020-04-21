import { Test, testCase } from 'nodeunit';
import { namespaces } from '../lib/index';

export = testCase({
  'namespaces() includes some namespaces'(test: Test) {
    test.ok(namespaces().length > 10);
    test.done();
  },
});
