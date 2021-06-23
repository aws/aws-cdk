import '@aws-cdk/assert-internal/jest';
import * as apigateway from '../lib';

describe('access log', () => {
  test('if jsonWithStandardFields method called with no parameter', () => {
    const testFormat = apigateway.AccessLogFormat.jsonWithStandardFields();
    expect(testFormat.toString()).toEqual('{"requestId":"$context.requestId","ip":"$context.identity.sourceIp","user":"$context.identity.user","caller":"$context.identity.caller","requestTime":"$context.requestTime","httpMethod":"$context.httpMethod","resourcePath":"$context.resourcePath","status":"$context.status","protocol":"$context.protocol","responseLength":"$context.responseLength"}');
  });

  test('if jsonWithStandardFields method called with all parameters false', () => {
    const testFormat = apigateway.AccessLogFormat.jsonWithStandardFields({
      caller: false,
      httpMethod: false,
      ip: false,
      protocol: false,
      requestTime: false,
      resourcePath: false,
      responseLength: false,
      status: false,
      user: false,
    });
    expect(testFormat.toString()).toEqual('{"requestId":"$context.requestId"}');
  });

  test('if clf method called', () => {
    const testFormat = apigateway.AccessLogFormat.clf();
    expect(testFormat.toString()).toEqual('$context.identity.sourceIp $context.identity.caller $context.identity.user [$context.requestTime] "$context.httpMethod $context.resourcePath $context.protocol" $context.status $context.responseLength $context.requestId');
  });

  test('if custom method called', () => {
    const testFormat = apigateway.AccessLogFormat.custom(JSON.stringify({
      requestId: apigateway.AccessLogField.contextRequestId(),
      sourceIp: apigateway.AccessLogField.contextIdentitySourceIp(),
      method: apigateway.AccessLogField.contextHttpMethod(),
      accountId: apigateway.AccessLogField.contextAccountId(),
      userContext: {
        sub: apigateway.AccessLogField.contextAuthorizerClaims('sub'),
        email: apigateway.AccessLogField.contextAuthorizerClaims('email'),
      },
    }));
    expect(testFormat.toString()).toEqual('{"requestId":"$context.requestId","sourceIp":"$context.identity.sourceIp","method":"$context.httpMethod","accountId":"$context.identity.accountId","userContext":{"sub":"$context.authorizer.claims.sub","email":"$context.authorizer.claims.email"}}');
  });
});
