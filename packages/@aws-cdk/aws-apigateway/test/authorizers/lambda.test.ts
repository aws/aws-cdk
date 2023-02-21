import { Match, Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Duration, Stack } from '@aws-cdk/core';
import { AuthorizationType, IdentitySource, RequestAuthorizer, RestApi, TokenAuthorizer } from '../../lib';

describe('lambda authorizer', () => {
  test('default token authorizer', () => {
    const stack = new Stack();

    const func = new lambda.Function(stack, 'myfunction', {
      handler: 'handler',
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    const auth = new TokenAuthorizer(stack, 'myauthorizer', {
      handler: func,
    });

    const restApi = new RestApi(stack, 'myrestapi');
    restApi.root.addMethod('ANY', undefined, {
      authorizer: auth,
      authorizationType: AuthorizationType.CUSTOM,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Authorizer', {
      Type: 'TOKEN',
      RestApiId: stack.resolve(restApi.restApiId),
      IdentitySource: 'method.request.header.Authorization',
      AuthorizerUri: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              'Fn::Select': [
                1,
                {
                  'Fn::Split': [
                    ':',
                    {
                      'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
                    },
                  ],
                },
              ],
            },
            ':apigateway:',
            {
              'Fn::Select': [
                3,
                {
                  'Fn::Split': [
                    ':',
                    {
                      'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
                    },
                  ],
                },
              ],
            },
            ':lambda:path/2015-03-31/functions/',
            {
              'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
            },
            '/invocations',
          ],
        ],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      Principal: 'apigateway.amazonaws.com',
    });

    expect(auth.authorizerArn.endsWith(`/authorizers/${auth.authorizerId}`)).toBeTruthy();
  });

  test('default request authorizer', () => {
    const stack = new Stack();

    const func = new lambda.Function(stack, 'myfunction', {
      handler: 'handler',
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    const auth = new RequestAuthorizer(stack, 'myauthorizer', {
      handler: func,
      resultsCacheTtl: Duration.seconds(0),
      identitySources: [],
    });

    const restApi = new RestApi(stack, 'myrestapi');
    restApi.root.addMethod('ANY', undefined, {
      authorizer: auth,
      authorizationType: AuthorizationType.CUSTOM,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Authorizer', {
      Type: 'REQUEST',
      RestApiId: stack.resolve(restApi.restApiId),
      AuthorizerUri: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              'Fn::Select': [
                1,
                {
                  'Fn::Split': [
                    ':',
                    {
                      'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
                    },
                  ],
                },
              ],
            },
            ':apigateway:',
            {
              'Fn::Select': [
                3,
                {
                  'Fn::Split': [
                    ':',
                    {
                      'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
                    },
                  ],
                },
              ],
            },
            ':lambda:path/2015-03-31/functions/',
            {
              'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
            },
            '/invocations',
          ],
        ],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      Principal: 'apigateway.amazonaws.com',
    });

    expect(auth.authorizerArn.endsWith(`/authorizers/${auth.authorizerId}`)).toBeTruthy();


  });

  test('invalid request authorizer config', () => {
    const stack = new Stack();

    const func = new lambda.Function(stack, 'myfunction', {
      handler: 'handler',
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    expect(() => new RequestAuthorizer(stack, 'myauthorizer', {
      handler: func,
      resultsCacheTtl: Duration.seconds(1),
      identitySources: [],
    })).toThrow('At least one Identity Source is required for a REQUEST-based Lambda authorizer if caching is enabled.');
  });

  test('token authorizer with all parameters specified', () => {
    const stack = new Stack();

    const func = new lambda.Function(stack, 'myfunction', {
      handler: 'handler',
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    const auth = new TokenAuthorizer(stack, 'myauthorizer', {
      handler: func,
      identitySource: 'method.request.header.whoami',
      validationRegex: 'a-hacker',
      authorizerName: 'myauthorizer',
      resultsCacheTtl: Duration.minutes(1),
    });

    const restApi = new RestApi(stack, 'myrestapi');
    restApi.root.addMethod('ANY', undefined, {
      authorizer: auth,
      authorizationType: AuthorizationType.CUSTOM,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Authorizer', {
      Type: 'TOKEN',
      RestApiId: stack.resolve(restApi.restApiId),
      IdentitySource: 'method.request.header.whoami',
      IdentityValidationExpression: 'a-hacker',
      Name: 'myauthorizer',
      AuthorizerResultTtlInSeconds: 60,
      AuthorizerUri: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              'Fn::Select': [
                1,
                {
                  'Fn::Split': [
                    ':',
                    {
                      'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
                    },
                  ],
                },
              ],
            },
            ':apigateway:',
            {
              'Fn::Select': [
                3,
                {
                  'Fn::Split': [
                    ':',
                    {
                      'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
                    },
                  ],
                },
              ],
            },
            ':lambda:path/2015-03-31/functions/',
            {
              'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
            },
            '/invocations',
          ],
        ],
      },
    });
  });

  test('request authorizer with all parameters specified', () => {
    const stack = new Stack();

    const func = new lambda.Function(stack, 'myfunction', {
      handler: 'handler',
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    const auth = new RequestAuthorizer(stack, 'myauthorizer', {
      handler: func,
      identitySources: [IdentitySource.header('whoami')],
      authorizerName: 'myauthorizer',
      resultsCacheTtl: Duration.minutes(1),
    });

    const restApi = new RestApi(stack, 'myrestapi');
    restApi.root.addMethod('ANY', undefined, {
      authorizer: auth,
      authorizationType: AuthorizationType.CUSTOM,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Authorizer', {
      Type: 'REQUEST',
      RestApiId: stack.resolve(restApi.restApiId),
      IdentitySource: 'method.request.header.whoami',
      Name: 'myauthorizer',
      AuthorizerResultTtlInSeconds: 60,
      AuthorizerUri: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              'Fn::Select': [
                1,
                {
                  'Fn::Split': [
                    ':',
                    {
                      'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
                    },
                  ],
                },
              ],
            },
            ':apigateway:',
            {
              'Fn::Select': [
                3,
                {
                  'Fn::Split': [
                    ':',
                    {
                      'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
                    },
                  ],
                },
              ],
            },
            ':lambda:path/2015-03-31/functions/',
            {
              'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
            },
            '/invocations',
          ],
        ],
      },
    });
  });

  test('token authorizer with assume role', () => {
    const stack = new Stack();

    const func = new lambda.Function(stack, 'myfunction', {
      handler: 'handler',
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    const role = new iam.Role(stack, 'authorizerassumerole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
      roleName: 'authorizerassumerole',
    });

    const auth = new TokenAuthorizer(stack, 'myauthorizer', {
      handler: func,
      assumeRole: role,
    });

    const restApi = new RestApi(stack, 'myrestapi');
    restApi.root.addMethod('ANY', undefined, {
      authorizer: auth,
      authorizationType: AuthorizationType.CUSTOM,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Authorizer', {
      Type: 'TOKEN',
      RestApiId: stack.resolve(restApi.restApiId),
      AuthorizerUri: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              'Fn::Select': [
                1,
                {
                  'Fn::Split': [
                    ':',
                    {
                      'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
                    },
                  ],
                },
              ],
            },
            ':apigateway:',
            {
              'Fn::Select': [
                3,
                {
                  'Fn::Split': [
                    ':',
                    {
                      'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
                    },
                  ],
                },
              ],
            },
            ':lambda:path/2015-03-31/functions/',
            {
              'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
            },
            '/invocations',
          ],
        ],
      },
    });

    Template.fromStack(stack).hasResource('AWS::IAM::Role', Match.anyValue());

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      Roles: [
        stack.resolve(role.roleName),
      ],
      PolicyDocument: {
        Statement: [
          {
            Resource: stack.resolve(func.resourceArnsForGrantInvoke),
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
          },
        ],
      },
    });

    Template.fromStack(stack).resourceCountIs('AWS::Lambda::Permission', 0);
  });

  test('request authorizer with assume role', () => {
    const stack = new Stack();

    const func = new lambda.Function(stack, 'myfunction', {
      handler: 'handler',
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    const role = new iam.Role(stack, 'authorizerassumerole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
      roleName: 'authorizerassumerole',
    });

    const auth = new RequestAuthorizer(stack, 'myauthorizer', {
      handler: func,
      assumeRole: role,
      resultsCacheTtl: Duration.seconds(0),
      identitySources: [],
    });

    const restApi = new RestApi(stack, 'myrestapi');
    restApi.root.addMethod('ANY', undefined, {
      authorizer: auth,
      authorizationType: AuthorizationType.CUSTOM,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Authorizer', {
      Type: 'REQUEST',
      RestApiId: stack.resolve(restApi.restApiId),
      AuthorizerUri: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              'Fn::Select': [
                1,
                {
                  'Fn::Split': [
                    ':',
                    {
                      'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
                    },
                  ],
                },
              ],
            },
            ':apigateway:',
            {
              'Fn::Select': [
                3,
                {
                  'Fn::Split': [
                    ':',
                    {
                      'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
                    },
                  ],
                },
              ],
            },
            ':lambda:path/2015-03-31/functions/',
            {
              'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
            },
            '/invocations',
          ],
        ],
      },
    });

    Template.fromStack(stack).hasResource('AWS::IAM::Role', Match.anyValue());

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      Roles: [
        stack.resolve(role.roleName),
      ],
      PolicyDocument: {
        Statement: [
          {
            Resource: stack.resolve(func.resourceArnsForGrantInvoke),
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
          },
        ],
      },
    });

    Template.fromStack(stack).resourceCountIs('AWS::Lambda::Permission', 0);
  });

  test('token authorizer throws when not attached to a rest api', () => {
    const stack = new Stack();
    const func = new lambda.Function(stack, 'myfunction', {
      handler: 'handler',
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_14_X,
    });
    const auth = new TokenAuthorizer(stack, 'myauthorizer', {
      handler: func,
    });

    expect(() => stack.resolve(auth.authorizerArn)).toThrow(/must be attached to a RestApi/);
  });

  test('request authorizer throws when not attached to a rest api', () => {
    const stack = new Stack();
    const func = new lambda.Function(stack, 'myfunction', {
      handler: 'handler',
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_14_X,
    });
    const auth = new RequestAuthorizer(stack, 'myauthorizer', {
      handler: func,
      identitySources: [IdentitySource.header('myheader')],
    });

    expect(() => stack.resolve(auth.authorizerArn)).toThrow(/must be attached to a RestApi/);
  });

  test('rest api depends on the token authorizer when @aws-cdk/aws-apigateway:authorizerChangeDeploymentLogicalId is enabled', () => {
    const stack = new Stack();
    stack.node.setContext('@aws-cdk/aws-apigateway:authorizerChangeDeploymentLogicalId', true);

    const func = new lambda.Function(stack, 'myfunction', {
      handler: 'handler',
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_18_X,
    });

    const auth = new TokenAuthorizer(stack, 'myauthorizer', {
      handler: func,
    });

    const restApi = new RestApi(stack, 'myrestapi');
    restApi.root.addMethod('ANY', undefined, {
      authorizer: auth,
      authorizationType: AuthorizationType.CUSTOM,
    });

    const template = Template.fromStack(stack);

    const authorizerId = Object.keys(template.findResources('AWS::ApiGateway::Authorizer'))[0];
    const deployment = Object.values(template.findResources('AWS::ApiGateway::Deployment'))[0];

    expect(deployment.DependsOn).toEqual(expect.arrayContaining([authorizerId]));
  });

  test('rest api depends on the request authorizer when @aws-cdk/aws-apigateway:authorizerChangeDeploymentLogicalId is enabled', () => {
    const stack = new Stack();
    stack.node.setContext('@aws-cdk/aws-apigateway:authorizerChangeDeploymentLogicalId', true);

    const func = new lambda.Function(stack, 'myfunction', {
      handler: 'handler',
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    const auth = new RequestAuthorizer(stack, 'myauthorizer', {
      handler: func,
      resultsCacheTtl: Duration.seconds(0),
      identitySources: [],
    });

    const restApi = new RestApi(stack, 'myrestapi');
    restApi.root.addMethod('ANY', undefined, {
      authorizer: auth,
      authorizationType: AuthorizationType.CUSTOM,
    });

    const template = Template.fromStack(stack);

    const authorizerId = Object.keys(template.findResources('AWS::ApiGateway::Authorizer'))[0];
    const deployment = Object.values(template.findResources('AWS::ApiGateway::Deployment'))[0];

    expect(deployment.DependsOn).toEqual(expect.arrayContaining([authorizerId]));
  });

  test('a new deployment is created when a lambda function changes name and @aws-cdk/aws-apigateway:authorizerChangeDeploymentLogicalId is enabled', () => {
    const createApiTemplate = (lambdaFunctionName: string) => {
      const stack = new Stack();
      stack.node.setContext('@aws-cdk/aws-apigateway:authorizerChangeDeploymentLogicalId', true);

      const func = new lambda.Function(stack, 'myfunction', {
        handler: 'handler',
        functionName: lambdaFunctionName,
        code: lambda.Code.fromInline('foo'),
        runtime: lambda.Runtime.NODEJS_18_X,
      });

      const auth = new RequestAuthorizer(stack, 'myauthorizer', {
        handler: func,
        resultsCacheTtl: Duration.seconds(0),
        identitySources: [],
      });

      const restApi = new RestApi(stack, 'myrestapi');
      restApi.root.addMethod('ANY', undefined, {
        authorizer: auth,
        authorizationType: AuthorizationType.CUSTOM,
      });

      return Template.fromStack(stack);
    };

    const oldTemplate = createApiTemplate('foo');
    const newTemplate = createApiTemplate('bar');

    const oldDeploymentId = Object.keys(oldTemplate.findResources('AWS::ApiGateway::Deployment'))[0];
    const newDeploymentId = Object.keys(newTemplate.findResources('AWS::ApiGateway::Deployment'))[0];

    expect(oldDeploymentId).not.toEqual(newDeploymentId);
  });

  test('a new deployment is created when an imported lambda function changes name and @aws-cdk/aws-apigateway:authorizerChangeDeploymentLogicalId is enabled', () => {
    const createApiTemplate = (lambdaFunctionName: string) => {
      const stack = new Stack();
      stack.node.setContext('@aws-cdk/aws-apigateway:authorizerChangeDeploymentLogicalId', true);

      const func = lambda.Function.fromFunctionName(stack, 'myfunction', lambdaFunctionName);

      const auth = new RequestAuthorizer(stack, 'myauthorizer', {
        handler: func,
        resultsCacheTtl: Duration.seconds(0),
        identitySources: [],
      });

      const restApi = new RestApi(stack, 'myrestapi');
      restApi.root.addMethod('ANY', undefined, {
        authorizer: auth,
        authorizationType: AuthorizationType.CUSTOM,
      });

      return Template.fromStack(stack);
    };

    const oldTemplate = createApiTemplate('foo');
    const newTemplate = createApiTemplate('bar');

    const oldDeploymentId = Object.keys(oldTemplate.findResources('AWS::ApiGateway::Deployment'))[0];
    const newDeploymentId = Object.keys(newTemplate.findResources('AWS::ApiGateway::Deployment'))[0];

    expect(oldDeploymentId).not.toEqual(newDeploymentId);
  });
});
