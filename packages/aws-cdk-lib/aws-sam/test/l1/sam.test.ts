import * as assertions from '../../../assertions';
import * as cdk from '../../../core';
import * as sam from '../../lib';

test('generation of alts from CfnFunction', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'Stack');
  // This is a minimal L1 fixture that omits Runtime/Handler, so the SAM transform (which requires
  // them for a Zip-packaged function) rejects it. The test only verifies event transformation.
  cdk.Validations.of(stack).acknowledge({ id: 'CloudFormation-Validate::E0001', reason: 'Minimal SAM function fixture omits Runtime/Handler; not a deployable template' });
  new sam.CfnFunction(stack, 'MyAPI', {
    codeUri: 'build/',
    events: {
      GetResource: {
        type: 'Api',
        properties: {
          restApiId: '12345',
          path: '/myPath',
          method: 'POST',
        },
      },
    },
  });

  const template = assertions.Template.fromStack(stack);
  template.hasResourceProperties('AWS::Serverless::Function', {
    Events: {
      GetResource: {
        Properties: {
          Method: 'POST',
          Path: '/myPath',
          RestApiId: '12345',
        },
      },
    },
  });
});
