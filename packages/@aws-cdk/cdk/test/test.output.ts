import { Test } from 'nodeunit';
import { CfnOutput, CfnResource, Stack } from '../lib';
import { toCloudFormation } from './util';

export = {
  'outputs can be added to the stack'(test: Test) {
    const stack = new Stack();
    const res = new CfnResource(stack, 'MyResource', { type: 'R' });
    const ref = res.ref;

    new CfnOutput(stack, 'MyOutput', {
      exportName: 'ExportName',
      value: ref,
      description: 'CfnOutput properties'
    });
    test.deepEqual(toCloudFormation(stack), { Resources: { MyResource: { Type: 'R' } },
    Outputs:
     { MyOutput:
      { Description: 'CfnOutput properties',
        Export: { Name: 'ExportName' },
        Value: { Ref: 'MyResource' } } } });
    test.done();
  },

  'No export is created by default'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new CfnOutput(stack, 'SomeOutput', { value: 'x' });

    // THEN
    test.deepEqual(toCloudFormation(stack), {
      Outputs: {
        SomeOutput: {
          Value: 'x'
        }
      }
    });

    test.done();
  },
};
