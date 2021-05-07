import '@aws-cdk/assert-internal/jest';
import { expect as expectStack } from '@aws-cdk/assert-internal';
import { App, Stack } from '@aws-cdk/core';
import { Function, FunctionCode } from '../lib';

describe('CloudFront Function', () => {

  test('minimal example', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'testregion' },
    });
    new Function(stack, 'CF2', {
      code: FunctionCode.fromInline('code'),
    });

    expectStack(stack).toMatch({
      Resources: {
        CF278071F3D: {
          Type: 'AWS::CloudFront::Function',
          Properties: {
            Code: '',
            Name: '',
          },
        },
      },
    });
  });

  test('minimal example in environment agnostic stack', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new Function(stack, 'CF2', {
      code: FunctionCode.fromInline('code'),
    });

    expectStack(stack).toMatch({
      Resources: {
        CF278071F3D: {
          Type: 'AWS::CloudFront::Function',
          Properties: {
            Code: '',
            Name: '',
          },
        },
      },
    });
  });

  test('maximum example', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'testregion' },
    });
    new Function(stack, 'CF2', {
      code: FunctionCode.fromInline('code'),
      comment: 'My super comment',
      name: 'FunctionName',
    });

    expectStack(stack).toMatch({
      Resources: {
        CF278071F3D: {
          Type: 'AWS::CloudFront::Function',
          Properties: {
            Code: '',
            Name: 'FunctionName',
          },
        },
      },
    });
  });

});