import * as assertions from '../../../assertions';
import * as cdk from '../../../core';
import * as sam from '../../lib';

test('generation of alts from CfnFunction', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'Stack');
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
