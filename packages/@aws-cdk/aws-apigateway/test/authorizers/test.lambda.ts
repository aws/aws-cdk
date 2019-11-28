import { expect, haveResource, ResourcePart } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import { Duration, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { AuthorizationType, RestApi, TokenAuthorizer } from '../../lib';

export = {
  'default token authorizer'(test: Test) {
    const stack = new Stack();

    const func = new lambda.Function(stack, 'myfunction', {
      handler: 'handler',
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_8_10,
    });

    const auth = new TokenAuthorizer(stack, 'myauthorizer', {
      handler: func
    });

    const restApi = new RestApi(stack, 'myrestapi');
    restApi.root.addMethod('ANY', undefined, {
      authorizer: auth,
      authorizationType: AuthorizationType.CUSTOM
    });

    expect(stack).to(haveResource('AWS::ApiGateway::Authorizer', {
      Type: 'TOKEN',
      RestApiId: stack.resolve(restApi.restApiId),
      IdentitySource: 'method.request.header.Authorizer'
    }));

    expect(stack).to(haveResource('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      Principal: 'apigateway.amazonaws.com',
    }));

    test.ok(auth.authorizerArn.endsWith(`/authorizers/${auth.authorizerId}`), 'Malformed authorizer ARN');

    test.done();
  },

  'token authorizer with all parameters specified'(test: Test) {
    const stack = new Stack();

    const func = new lambda.Function(stack, 'myfunction', {
      handler: 'handler',
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_8_10,
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
      authorizationType: AuthorizationType.CUSTOM
    });

    expect(stack).to(haveResource('AWS::ApiGateway::Authorizer', {
      Type: 'TOKEN',
      RestApiId: stack.resolve(restApi.restApiId),
      IdentitySource: 'method.request.header.whoami',
      IdentityValidationExpression: 'a-hacker',
      Name: 'myauthorizer',
      AuthorizerResultTtlInSeconds: 60
    }));

    test.done();
  },

  'token authorizer with assume role'(test: Test) {
    const stack = new Stack();

    const func = new lambda.Function(stack, 'myfunction', {
      handler: 'handler',
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_8_10,
    });

    const role = new iam.Role(stack, 'authorizerassumerole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
      roleName: 'authorizerassumerole'
    });

    const auth = new TokenAuthorizer(stack, 'myauthorizer', {
      handler: func,
      assumeRole: role
    });

    const restApi = new RestApi(stack, 'myrestapi');
    restApi.root.addMethod('ANY', undefined, {
      authorizer: auth,
      authorizationType: AuthorizationType.CUSTOM
    });

    expect(stack).to(haveResource('AWS::ApiGateway::Authorizer', {
      Type: 'TOKEN',
      RestApiId: stack.resolve(restApi.restApiId),
    }));

    expect(stack).to(haveResource('AWS::IAM::Role'));

    expect(stack).to(haveResource('AWS::IAM::Policy', {
      Roles: [
        stack.resolve(role.roleName)
      ],
      PolicyDocument: {
        Statement: [
          {
            Resource: stack.resolve(func.functionArn),
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
          }
        ],
      }
    }, ResourcePart.Properties, true));

    expect(stack).notTo(haveResource('AWS::Lambda::Permission'));

    test.done();
  }
};
