import { nodeunitShim, Test } from 'nodeunit-shim';
import { CfnParameter, Stack } from '../lib';

nodeunitShim({
  'valueAsString supports both string and number types'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const numberParam = new CfnParameter(stack, 'numberParam', { type: 'Number', default: 10 });
    const stringParam = new CfnParameter(stack, 'stringParam', { type: 'String', default: 'a-default' });

    // WHEN
    const numVal = numberParam.valueAsString;
    const strVal = stringParam.valueAsString;

    // THEN
    test.deepEqual(stack.resolve(numVal), { Ref: 'numberParam' });
    test.deepEqual(stack.resolve(strVal), { Ref: 'stringParam' });

    test.done();
  },

  'valueAsString fails for unsupported types'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const listParam = new CfnParameter(stack, 'listParam', { type: 'List', default: 10 });

    // WHEN - THEN
    test.throws(() => listParam.valueAsList, /Parameter type \(List\)/);

    test.done();
  },
});
