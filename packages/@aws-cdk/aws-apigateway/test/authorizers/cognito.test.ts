import '@aws-cdk/assert/jest';
import * as cognito from '@aws-cdk/aws-cognito';
import { Duration, Stack } from '@aws-cdk/core';
import { AuthorizationType, CognitoUserPoolsAuthorizer, RestApi } from '../../lib';

describe('Cognito Authorizer', () => {
  test('default cognito authorizer', () => {
    // GIVEN
    const stack = new Stack();
    const userPool = new cognito.UserPool(stack, 'UserPool');

    // WHEN
    const authorizer = new CognitoUserPoolsAuthorizer(stack, 'myauthorizer', {
      cognitoUserPools: [userPool],
    });

    const restApi = new RestApi(stack, 'myrestapi');
    restApi.root.addMethod('ANY', undefined, {
      authorizer,
      authorizationType: AuthorizationType.COGNITO,
    });

    // THEN
    expect(stack).toHaveResource('AWS::ApiGateway::Authorizer', {
      Type: 'COGNITO_USER_POOLS',
      RestApiId: stack.resolve(restApi.restApiId),
      IdentitySource: 'method.request.header.Authorization',
      ProviderARNs: [stack.resolve(userPool.userPoolArn)],
    });

    expect(authorizer.authorizerArn.endsWith(`/authorizers/${authorizer.authorizerId}`)).toBeTruthy();
  });

  test('cognito authorizer with all parameters specified', () => {
    // GIVEN
    const stack = new Stack();
    const userPool1 = new cognito.UserPool(stack, 'UserPool1');
    const userPool2 = new cognito.UserPool(stack, 'UserPool2');

    // WHEN
    const authorizer = new CognitoUserPoolsAuthorizer(stack, 'myauthorizer', {
      cognitoUserPools: [userPool1, userPool2],
      identitySource: 'method.request.header.whoami',
      authorizerName: 'myauthorizer',
      resultsCacheTtl: Duration.minutes(1),
    });

    const restApi = new RestApi(stack, 'myrestapi');
    restApi.root.addMethod('ANY', undefined, {
      authorizer,
      authorizationType: AuthorizationType.COGNITO,
    });

    // THEN
    expect(stack).toHaveResource('AWS::ApiGateway::Authorizer', {
      Type: 'COGNITO_USER_POOLS',
      Name: 'myauthorizer',
      RestApiId: stack.resolve(restApi.restApiId),
      IdentitySource: 'method.request.header.whoami',
      AuthorizerResultTtlInSeconds: 60,
      ProviderARNs: [stack.resolve(userPool1.userPoolArn), stack.resolve(userPool2.userPoolArn)],
    });

    expect(authorizer.authorizerArn.endsWith(`/authorizers/${authorizer.authorizerId}`)).toBeTruthy();
  });
});
