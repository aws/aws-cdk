import { expect, haveResource } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { AuthorizationType, RestApi, TokenAuthorizer } from '../../lib';

export = {
  'token authorizer'(test: Test) {
    const stack = new Stack();

    const func = new lambda.Function(stack, 'myfunction', {
      handler: 'handler',
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_8_10,
    });

    const auth = new TokenAuthorizer(stack, 'myauthorizer', {
      headerName: 'whoami',
      function: func
    });

    const restApi = new RestApi(stack, 'myrestapi');
    restApi.root.addMethod('ANY', undefined, {
      authorizer: auth,
      authorizationType: AuthorizationType.CUSTOM
    });

    expect(stack).to(haveResource('AWS::ApiGateway::Authorizer', {
      Type: 'TOKEN',
      RestApiId: stack.resolve(restApi.restApiId),
      IdentitySource: 'method.request.header.whoami'
    }));

    expect(stack).to(haveResource('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      Principal: 'apigateway.amazonaws.com',
    }));

    test.ok(auth.authorizerArn.endsWith(`/authorizers/${auth.authorizerId}`), 'Malformed authorizer ARN');

    test.done();
  },

  'token authorizer with assume role'(test: Test) {
    const stack = new Stack();

    const func = new lambda.Function(stack, 'myfunction', {
      handler: 'handler',
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_8_10,
    });

    const role = new iam.Role(stack, 'myassumerole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
      inlinePolicies: {
        lambda: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [ 'lambda:InvokeFunction' ],
              resources: [ func.functionArn ]
            })
          ]
        })
      }
    });

    const auth = new TokenAuthorizer(stack, 'myauthorizer', {
      headerName: 'whoami',
      function: func,
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
      IdentitySource: 'method.request.header.whoami'
    }));

    expect(stack).to(haveResource('AWS::IAM::Role'));

    expect(stack).notTo(haveResource('AWS::Lambda::Permission'));

    test.ok(auth.authorizerArn.endsWith(`/authorizers/${auth.authorizerId}`), 'Malformed authorizer ARN');

    test.done();
  }
};
