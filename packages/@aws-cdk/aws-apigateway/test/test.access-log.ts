import {Test} from 'nodeunit';
import * as apigateway from '../lib';

export = {
  'if jsonWithStandardFields method called with no parameter'(test: Test) {
    const testFormat = apigateway.AccessLogFormat.jsonWithStandardFields();
    test.deepEqual(testFormat.toString(), '{"requestId":"$context.requestId","ip":"$context.identity.sourceIp","user":"$context.identity.user","caller":"$context.identity.caller","requestTime":"$context.requestTime","httpMethod":"$context.httpMethod","resourcePath":"$context.resourcePath","status":"$context.status","protocol":"$context.protocol","responseLength":"$context.responseLength"}');

    test.done();
  },

  'if jsonWithStandardFields method called with all parameters false'(test: Test) {
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
    test.deepEqual(testFormat.toString(), '{"requestId":"$context.requestId"}');

    test.done();
  },

  'if clf method called'(test: Test) {
    const testFormat = apigateway.AccessLogFormat.clf();
    test.deepEqual(testFormat.toString(), '$context.identity.sourceIp $context.identity.caller $context.identity.user [$context.requestTime] "$context.httpMethod $context.resourcePath $context.protocol" $context.status $context.responseLength $context.requestId');

    test.done();
  },

  'if custom method called'(test: Test) {
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
    test.deepEqual(testFormat.toString(), '{"requestId":"$context.requestId","sourceIp":"$context.identity.sourceIp","method":"$context.httpMethod","accountId":"$context.identity.accountId","userContext":{"sub":"$context.authorizer.claims.sub","email":"$context.authorizer.claims.email"}}');

    test.done();
  },
};
