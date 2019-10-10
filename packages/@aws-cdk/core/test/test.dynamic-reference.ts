import { Test } from 'nodeunit';
import { CfnDynamicReference, CfnDynamicReferenceService, Stack } from '../lib';

export = {
  'can create dynamic references with service and key with colons'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const ref = new CfnDynamicReference(CfnDynamicReferenceService.SSM, 'a:b:c');

    // THEN
    test.equal(stack.resolve(ref), '{{resolve:ssm:a:b:c}}');

    test.done();
  },
};
