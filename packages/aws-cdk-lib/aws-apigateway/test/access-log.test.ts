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

  test('if jsonWithStandardFields method called with only some fields switched off, the others stay on', () => {
    const testFormat = apigateway.AccessLogFormat.jsonWithStandardFields({
      ip: false,
      user: false,
    });
    expect(testFormat.toString()).toEqual('{"requestId":"$context.requestId","caller":"$context.identity.caller","requestTime":"$context.requestTime","httpMethod":"$context.httpMethod","resourcePath":"$context.resourcePath","status":"$context.status","protocol":"$context.protocol","responseLength":"$context.responseLength"}');
  });

  test('if jsonWithStandardFields method called with additionalFields, they follow the standard fields', () => {
    const testFormat = apigateway.AccessLogFormat.jsonWithStandardFields({
      additionalFields: {
        path: apigateway.AccessLogField.contextPath(),
        errorMessage: apigateway.AccessLogField.contextErrorMessage(),
        sub: apigateway.AccessLogField.contextAuthorizerClaims('sub'),
      },
    });
    expect(testFormat.toString()).toEqual('{"requestId":"$context.requestId","ip":"$context.identity.sourceIp","user":"$context.identity.user","caller":"$context.identity.caller","requestTime":"$context.requestTime","httpMethod":"$context.httpMethod","resourcePath":"$context.resourcePath","status":"$context.status","protocol":"$context.protocol","responseLength":"$context.responseLength","path":"$context.path","errorMessage":"$context.error.message","sub":"$context.authorizer.claims.sub"}');
  });

  test('if jsonWithStandardFields method called with additionalFields and all standard fields off', () => {
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
      additionalFields: {
        path: apigateway.AccessLogField.contextPath(),
      },
    });
    expect(testFormat.toString()).toEqual('{"requestId":"$context.requestId","path":"$context.path"}');
  });

  test('if jsonWithStandardFields method called with an empty additionalFields', () => {
    const testFormat = apigateway.AccessLogFormat.jsonWithStandardFields({ additionalFields: {} });
    expect(testFormat.toString()).toEqual(apigateway.AccessLogFormat.jsonWithStandardFields().toString());
  });

  test('if an additional field replaces a standard field that is switched off', () => {
    const testFormat = apigateway.AccessLogFormat.jsonWithStandardFields({
      resourcePath: false,
      additionalFields: {
        resourcePath: apigateway.AccessLogField.contextPath(),
      },
    });
    expect(testFormat.toString()).toContain('"resourcePath":"$context.path"');
    expect(testFormat.toString()).not.toContain('$context.resourcePath');
  });

  test('if an additional field replaces a switched off standard field, it keeps the position of that field', () => {
    const testFormat = apigateway.AccessLogFormat.jsonWithStandardFields({
      ip: false,
      user: false,
      caller: false,
      requestTime: false,
      httpMethod: false,
      resourcePath: true,
      status: false,
      protocol: false,
      responseLength: false,
      additionalFields: {
        extra: apigateway.AccessLogField.contextPath(),
        status: apigateway.AccessLogField.contextErrorMessage(),
      },
    });
    expect(testFormat.toString()).toEqual('{"requestId":"$context.requestId","resourcePath":"$context.resourcePath","status":"$context.error.message","extra":"$context.path"}');
  });

  test('if an additional field is named like an inherited object property, it is accepted', () => {
    const testFormat = apigateway.AccessLogFormat.jsonWithStandardFields({
      additionalFields: {
        constructor: apigateway.AccessLogField.contextPath(),
        toString: apigateway.AccessLogField.contextErrorMessage(),
      },
    });
    expect(testFormat.toString()).toContain('"constructor":"$context.path","toString":"$context.error.message"');
  });

  test('if an additional field has the name of a standard field that is switched on, it throws', () => {
    expect(() => apigateway.AccessLogFormat.jsonWithStandardFields({
      additionalFields: { status: apigateway.AccessLogField.contextPath() },
    })).toThrow(/additionalFields cannot contain 'status'/);
  });

  test('if an additional field is called requestId, it throws', () => {
    expect(() => apigateway.AccessLogFormat.jsonWithStandardFields({
      additionalFields: { requestId: apigateway.AccessLogField.contextPath() },
    })).toThrow(/additionalFields cannot contain 'requestId'/);
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
