import { Construct } from 'constructs';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { CfnParameter, CfnResource, Stack } from '../lib';
import { toCloudFormation } from './util';

nodeunitShim({
  'parameters can be used and referenced using param.ref'(test: Test) {
    const stack = new Stack();

    const child = new Construct(stack, 'Child');
    const param = new CfnParameter(child, 'MyParam', {
      default: 10,
      type: 'Integer',
      description: 'My first parameter',
    });

    new CfnResource(stack, 'Resource', { type: 'Type', properties: { ReferenceToParam: param.value } });

    test.deepEqual(toCloudFormation(stack), {
      Parameters: {
        ChildMyParam3161BF5D: {
          Default: 10,
          Type: 'Integer',
          Description: 'My first parameter',
        },
      },
      Resources: {
        Resource: {
          Type: 'Type',
          Properties: { ReferenceToParam: { Ref: 'ChildMyParam3161BF5D' } },
        },
      },
    });

    test.done();
  },

  'parameters are tokens, so they can be assigned without .ref and their Ref will be taken'(test: Test) {
    const stack = new Stack();
    const param = new CfnParameter(stack, 'MyParam', { type: 'String' });

    test.deepEqual(stack.resolve(param), { Ref: 'MyParam' });
    test.done();
  },
});
