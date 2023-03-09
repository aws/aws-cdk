import { Construct } from 'constructs';
import { toCloudFormation } from './util';
import { CfnParameter, CfnResource, Stack } from '../lib';

describe('parameter', () => {
  test('parameters can be used and referenced using param.ref', () => {
    const stack = new Stack();

    const child = new Construct(stack, 'Child');
    const param = new CfnParameter(child, 'MyParam', {
      default: 10,
      type: 'Integer',
      description: 'My first parameter',
    });

    new CfnResource(stack, 'Resource', { type: 'Type', properties: { ReferenceToParam: param.value } });

    expect(toCloudFormation(stack)).toEqual({
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
  });

  test('parameters are tokens, so they can be assigned without .ref and their Ref will be taken', () => {
    const stack = new Stack();
    const param = new CfnParameter(stack, 'MyParam', { type: 'String' });

    expect(stack.resolve(param)).toEqual({ Ref: 'MyParam' });
  });
});
