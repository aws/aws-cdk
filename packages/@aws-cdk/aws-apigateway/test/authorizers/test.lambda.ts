import { expect, haveResource, ResourcePart } from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Duration, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { AuthorizationType, IdentitySource, RequestAuthorizer, RestApi, TokenAuthorizer } from '../../lib';

export = {
  'default token authorizer'(test: Test) {
    const stack = new Stack();

    const func = new lambda.Function(stack, 'myfunction', {
      handler: 'handler',
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const auth = new TokenAuthorizer(stack, 'myauthorizer', {
      handler: func,
    });

    const restApi = new RestApi(stack, 'myrestapi');
    restApi.root.addMethod('ANY', undefined, {
      authorizer: auth,
      authorizationType: AuthorizationType.CUSTOM,
    });

    expect(stack).to(haveResource('AWS::ApiGateway::Authorizer', {
      Type: 'TOKEN',
      RestApiId: stack.resolve(restApi.restApiId),
      IdentitySource: 'method.request.header.Authorization',
      AuthorizerUri: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':apigateway:',
            {
              Ref: 'AWS::Region',
            },
            ':lambda:path/2015-03-31/functions/',
            {
              'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
            },
            '/invocations',
          ],
        ],
      },
    }));

    expect(stack).to(haveResource('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      Principal: 'apigateway.amazonaws.com',
    }));

    test.ok(auth.authorizerArn.endsWith(`/authorizers/${auth.authorizerId}`), 'Malformed authorizer ARN');

    test.done();
  },

  'default request authorizer'(test: Test) {
    const stack = new Stack();

    const func = new lambda.Function(stack, 'myfunction', {
      handler: 'handler',
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_12_X,
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

    expect(stack).to(haveResource('AWS::ApiGateway::Authorizer', {
      Type: 'REQUEST',
      RestApiId: stack.resolve(restApi.restApiId),
      AuthorizerUri: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':apigateway:',
            {
              Ref: 'AWS::Region',
            },
            ':lambda:path/2015-03-31/functions/',
            {
              'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
            },
            '/invocations',
          ],
        ],
      },
    }));

    expect(stack).to(haveResource('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      Principal: 'apigateway.amazonaws.com',
    }));

    test.ok(auth.authorizerArn.endsWith(`/authorizers/${auth.authorizerId}`), 'Malformed authorizer ARN');

    test.done();
  },

  'invalid request authorizer config'(test: Test) {
    const stack = new Stack();

    const func = new lambda.Function(stack, 'myfunction', {
      handler: 'handler',
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_12_X,
    });

    test.throws(() => new RequestAuthorizer(stack, 'myauthorizer', {
      handler: func,
      resultsCacheTtl: Duration.seconds(1),
      identitySources: [],
    }), Error, 'At least one Identity Source is required for a REQUEST-based Lambda authorizer if caching is enabled.');

    test.done();
  },

  'token authorizer with all parameters specified'(test: Test) {
    const stack = new Stack();

    const func = new lambda.Function(stack, 'myfunction', {
      handler: 'handler',
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_10_X,
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

    expect(stack).to(haveResource('AWS::ApiGateway::Authorizer', {
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
              Ref: 'AWS::Partition',
            },
            ':apigateway:',
            {
              Ref: 'AWS::Region',
            },
            ':lambda:path/2015-03-31/functions/',
            {
              'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
            },
            '/invocations',
          ],
        ],
      },
    }));

    test.done();
  },

  'request authorizer with all parameters specified'(test: Test) {
    const stack = new Stack();

    const func = new lambda.Function(stack, 'myfunction', {
      handler: 'handler',
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_12_X,
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

    expect(stack).to(haveResource('AWS::ApiGateway::Authorizer', {
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
              Ref: 'AWS::Partition',
            },
            ':apigateway:',
            {
              Ref: 'AWS::Region',
            },
            ':lambda:path/2015-03-31/functions/',
            {
              'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
            },
            '/invocations',
          ],
        ],
      },
    }));

    test.done();
  },

  'token authorizer with assume role'(test: Test) {
    const stack = new Stack();

    const func = new lambda.Function(stack, 'myfunction', {
      handler: 'handler',
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_10_X,
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

    expect(stack).to(haveResource('AWS::ApiGateway::Authorizer', {
      Type: 'TOKEN',
      RestApiId: stack.resolve(restApi.restApiId),
      AuthorizerUri: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':apigateway:',
            {
              Ref: 'AWS::Region',
            },
            ':lambda:path/2015-03-31/functions/',
            {
              'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
            },
            '/invocations',
          ],
        ],
      },
    }));

    expect(stack).to(haveResource('AWS::IAM::Role'));

    expect(stack).to(haveResource('AWS::IAM::Policy', {
      Roles: [
        stack.resolve(role.roleName),
      ],
      PolicyDocument: {
        Statement: [
          {
            Resource: stack.resolve(func.functionArn),
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
          },
        ],
      },
    }, ResourcePart.Properties, true));

    expect(stack).notTo(haveResource('AWS::Lambda::Permission'));

    test.done();
  },

  'request authorizer with assume role'(test: Test) {
    const stack = new Stack();

    const func = new lambda.Function(stack, 'myfunction', {
      handler: 'handler',
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_12_X,
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

    expect(stack).to(haveResource('AWS::ApiGateway::Authorizer', {
      Type: 'REQUEST',
      RestApiId: stack.resolve(restApi.restApiId),
      AuthorizerUri: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':apigateway:',
            {
              Ref: 'AWS::Region',
            },
            ':lambda:path/2015-03-31/functions/',
            {
              'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
            },
            '/invocations',
          ],
        ],
      },
    }));

    expect(stack).to(haveResource('AWS::IAM::Role'));

    expect(stack).to(haveResource('AWS::IAM::Policy', {
      Roles: [
        stack.resolve(role.roleName),
      ],
      PolicyDocument: {
        Statement: [
          {
            Resource: stack.resolve(func.functionArn),
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
          },
        ],
      },
    }, ResourcePart.Properties, true));

    expect(stack).notTo(haveResource('AWS::Lambda::Permission'));

    test.done();
  },

  'token authorizer throws when not attached to a rest api'(test: Test) {
    const stack = new Stack();
    const func = new lambda.Function(stack, 'myfunction', {
      handler: 'handler',
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_12_X,
    });
    const auth = new TokenAuthorizer(stack, 'myauthorizer', {
      handler: func,
    });

    test.throws(() => stack.resolve(auth.authorizerArn), /must be attached to a RestApi/);

    test.done();
  },

  'request authorizer throws when not attached to a rest api'(test: Test) {
    const stack = new Stack();
    const func = new lambda.Function(stack, 'myfunction', {
      handler: 'handler',
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_12_X,
    });
    const auth = new RequestAuthorizer(stack, 'myauthorizer', {
      handler: func,
      identitySources: [ IdentitySource.header('myheader') ],
    });

    test.throws(() => stack.resolve(auth.authorizerArn), /must be attached to a RestApi/);

    test.done();
  },
};
