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
      callerAccountId: apigateway.AccessLogField.contextCallerAccountId(),
      ownerAccountId: apigateway.AccessLogField.contextOwnerAccountId(),
      userContext: {
        sub: apigateway.AccessLogField.contextAuthorizerClaims('sub'),
        email: apigateway.AccessLogField.contextAuthorizerClaims('email'),
      },
      clientCertPem: apigateway.AccessLogField.contextIdentityClientCertPem(),
      subjectDN: apigateway.AccessLogField.contextIdentityClientCertSubjectDN(),
      issunerDN: apigateway.AccessLogField.contextIdentityClientCertIssunerDN(),
      serialNumber: apigateway.AccessLogField.contextIdentityClientCertSerialNumber(),
      validityNotBefore: apigateway.AccessLogField.contextIdentityClientCertValidityNotBefore(),
      validityNotAfter: apigateway.AccessLogField.contextIdentityClientCertValidityNotAfter(),
    }));
    expect(testFormat.toString()).toEqual('{"requestId":"$context.requestId","sourceIp":"$context.identity.sourceIp","method":"$context.httpMethod","callerAccountId":"$context.identity.accountId","ownerAccountId":"$context.accountId","userContext":{"sub":"$context.authorizer.claims.sub","email":"$context.authorizer.claims.email"},"clientCertPem":"$context.identity.clientCert.clientCertPem","subjectDN":"$context.identity.clientCert.subjectDN","issunerDN":"$context.identity.clientCert.issuerDN","serialNumber":"$context.identity.clientCert.serialNumber","validityNotBefore":"$context.identity.clientCert.validity.notBefore","validityNotAfter":"$context.identity.clientCert.validity.notAfter"}');
  });
});
