import { App, CfnOutput, CfnResource, ConstructNode, Stack, ValidationError } from '../lib';
import { toCloudFormation } from './util';

let app: App;
let stack: Stack;
beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack');
});

describe('output', () => {
  test('outputs can be added to the stack', () => {
    const res = new CfnResource(stack, 'MyResource', { type: 'R' });
    const ref = res.ref;

    new CfnOutput(stack, 'MyOutput', {
      exportName: 'ExportName',
      value: ref,
      description: 'CfnOutput properties',
    });
    expect(toCloudFormation(stack)).toEqual({
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

  });

  test('No export is created by default', () => {
    // WHEN
    new CfnOutput(stack, 'SomeOutput', { value: 'x' });

    // THEN
    expect(toCloudFormation(stack)).toEqual({
      Outputs: {
        SomeOutput: {
          Value: 'x',
        },
      },
    });


  });

  test('importValue can be used to obtain a Fn::ImportValue expression', () => {
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
    expect(toCloudFormation(stack2)).toEqual({
      Resources: {
        Resource: {
          Type: 'Some::Resource',
          Properties: {
            input: { 'Fn::ImportValue': 'asdf' },
          },
        },
      },
    });


  });

  test('importValue used inside the same stack produces an error', () => {
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


  });

  test('error message if importValue is used and Output is not exported', () => {
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

    expect(() => {
      toCloudFormation(stack2);
    }).toThrow(/Add an exportName to the CfnOutput/);


  });

  test('Verify maximum length of export name', () => {
    new CfnOutput(stack, 'SomeOutput', { value: 'x', exportName: 'x'.repeat(260) });

    const errors = ConstructNode.validate(stack.node).map((v: ValidationError) => v.message);

    expect(errors).toEqual([
      expect.stringContaining('Export name cannot exceed 255 characters'),
    ]);


  });
});
