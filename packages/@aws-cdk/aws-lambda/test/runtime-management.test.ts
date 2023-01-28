import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as lambda from '../lib';

describe('runtime', () => {
  test('Runtime Management Auto', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    new lambda.Function(stack, 'Lambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      runtimeManagement: {
        mode: lambda.UpdateRuntimeOn.AUTO,
      },
    });
    // WHEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      RuntimeManagementConfig: {
        UpdateRuntimeOn: 'Auto',
      },
    });
  });
  test('Runtime Management Function Update', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    new lambda.Function(stack, 'Lambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      runtimeManagement: {
        arn: 'arn:aws:lambda:ap-northeast-1::runtime:07a48df201798d627f2b950f03bb227aab4a655a1d019c3296406f95937e2525',
        mode: lambda.UpdateRuntimeOn.FUNCTION_UPDATE,
      },
    });
    // WHEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      RuntimeManagementConfig: {
        RuntimeVersionArn: 'arn:aws:lambda:ap-northeast-1::runtime:07a48df201798d627f2b950f03bb227aab4a655a1d019c3296406f95937e2525',
        UpdateRuntimeOn: 'Function update',
      },
    });
  });
  test('Runtime Management MANUAL', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    new lambda.Function(stack, 'Lambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      runtimeManagement: {
        arn: 'arn:aws:lambda:ap-northeast-1::runtime:07a48df201798d627f2b950f03bb227aab4a655a1d019c3296406f95937e2525',
        mode: lambda.UpdateRuntimeOn.MANUAL,
      },
    });
    // WHEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      RuntimeManagementConfig: {
        RuntimeVersionArn: 'arn:aws:lambda:ap-northeast-1::runtime:07a48df201798d627f2b950f03bb227aab4a655a1d019c3296406f95937e2525',
        UpdateRuntimeOn: 'Manual',
      },
    });

  });

});
