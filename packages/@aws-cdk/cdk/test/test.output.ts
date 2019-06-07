import { Test } from 'nodeunit';
import { CfnOutput, CfnResource, Stack } from '../lib';
import { toCloudFormation } from './util';

export = {
  'outputs can be added to the stack'(test: Test) {
    const stack = new Stack();
    const res = new CfnResource(stack, 'MyResource', { type: 'R' });
    const ref = res.ref;

    new CfnOutput(stack, 'MyOutput', {
      export: 'ExportName',
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

  'outputs cannot be referenced'(test: Test) {
    const stack = new Stack();
    const output = new CfnOutput(stack, 'MyOutput', { description: 'My CfnOutput', value: 'boom' });
    test.throws(() => output.ref);
    test.done();
  },

  'disableExport can be used to disable the auto-export behavior'(test: Test) {
    const stack = new Stack();
    const output = new CfnOutput(stack, 'MyOutput', { disableExport: true, value: 'boom' });

    test.equal(output.export, null);

    // cannot specify `export` and `disableExport` at the same time.
    test.throws(() => new CfnOutput(stack, 'YourOutput', {
      disableExport: true,
      export: 'bla',
      value: 'boom'
    }), /Cannot set `disableExport` and specify an export name/);

    test.done();
  },

  'if stack name is undefined, we will only use the logical ID for the export name'(test: Test) {
    const stack = new Stack();
    const output = new CfnOutput(stack, 'MyOutput', { value: 'boom' });
    test.deepEqual(stack.resolve(output.makeImportValue()), { 'Fn::ImportValue': 'Stack:MyOutput' });
    test.done();
  },

  'makeImportValue can be used to create an Fn::ImportValue from an output'(test: Test) {
    const stack = new Stack(undefined, 'MyStack');
    const output = new CfnOutput(stack, 'MyOutput', { value: 'boom' });
    test.deepEqual(stack.resolve(output.makeImportValue()), { 'Fn::ImportValue': 'MyStack:MyOutput' });

    test.deepEqual(toCloudFormation(stack), {
      Outputs: {
        MyOutput: {
          Value: 'boom',
          Export: { Name: 'MyStack:MyOutput' }
        }
      }
    });
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
