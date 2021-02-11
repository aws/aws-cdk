import { nodeunitShim, Test } from 'nodeunit-shim';
import { App, CfnOutput, CfnResource, Stack } from '../lib';
import { toCloudFormation } from './util';

let app: App;
let stack: Stack;
beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack');
});

nodeunitShim({
  'outputs can be added to the stack'(test: Test) {
    const res = new CfnResource(stack, 'MyResource', { type: 'R' });
    const ref = res.ref;

    new CfnOutput(stack, 'MyOutput', {
      exportName: 'ExportName',
      value: ref,
      description: 'CfnOutput properties',
    });
    test.deepEqual(toCloudFormation(stack), {
      Resources: { MyResource: { Type: 'R' } },
      Outputs:
     {
       MyOutput:
      {
        Description: 'CfnOutput properties',
        Export: { Name: 'ExportName' },
        Value: { Ref: 'MyResource' },
      },
     },
    });
    test.done();
  },

  'No export is created by default'(test: Test) {
    // WHEN
    new CfnOutput(stack, 'SomeOutput', { value: 'x' });

    // THEN
    test.deepEqual(toCloudFormation(stack), {
      Outputs: {
        SomeOutput: {
          Value: 'x',
        },
      },
    });

    test.done();
  },

  'importValue can be used to obtain a Fn::ImportValue expression'(test: Test) {
    // GIVEN
    const stack2 = new Stack(app, 'Stack2');

    // WHEN
    const output = new CfnOutput(stack, 'SomeOutput', { value: 'x', exportName: 'asdf' });
    new CfnResource(stack2, 'Resource', {
      type: 'Some::Resource',
      properties: {
        input: output.importValue,
      },
    });

    // THEN
    test.deepEqual(toCloudFormation(stack2), {
      Resources: {
        Resource: {
          Type: 'Some::Resource',
          Properties: {
            input: { 'Fn::ImportValue': 'asdf' },
          },
        },
      },
    });

    test.done();
  },

  'importValue used inside the same stack produces an error'(test: Test) {
    // WHEN
    const output = new CfnOutput(stack, 'SomeOutput', { value: 'x', exportName: 'asdf' });
    new CfnResource(stack, 'Resource', {
      type: 'Some::Resource',
      properties: {
        input: output.importValue,
      },
    });

    // THEN
    expect(() => toCloudFormation(stack)).toThrow(/should only be used in a different Stack/);

    test.done();
  },

  'error message if importValue is used and Output is not exported'(test: Test) {
    // GIVEN
    const stack2 = new Stack(app, 'Stack2');

    // WHEN
    const output = new CfnOutput(stack, 'SomeOutput', { value: 'x' });
    new CfnResource(stack2, 'Resource', {
      type: 'Some::Resource',
      properties: {
        input: output.importValue,
      },
    });

    test.throws(() => {
      toCloudFormation(stack2);
    }, /Add an exportName to the CfnOutput/);

    test.done();
  },

  'Verify maximum length of export name'(test: Test) {
    const output = new CfnOutput(stack, 'SomeOutput', { value: 'x', exportName: 'x'.repeat(260) });
    const errors = output.node.validate();

    expect(errors).toEqual([
      expect.stringContaining('Export name cannot exceed 255 characters'),
    ]);

    test.done();
  },
});
