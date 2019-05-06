import { Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { Grant } from '../lib';
import iam = require('../lib');

export = {
  'Grant.drop() returns a no-op grant'(test: Test) {
    const stack = new Stack();
    const user = new iam.User(stack, 'poo');
    const grant = Grant.drop(user, 'dropping me');

    test.ok(!grant.success, 'grant should not be successul');
    test.deepEqual(grant.principalStatement, undefined);
    test.deepEqual(grant.resourceStatement, undefined);
    test.done();
  }
};