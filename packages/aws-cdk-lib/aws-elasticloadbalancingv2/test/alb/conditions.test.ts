import * as elbv2 from '../../lib';

describe('tests', () => {
  test('pathPatterns length greater than 5 will throw exception', () => {
    // GIVEN
    const array = ['/u1', '/u2', '/u3', '/u4', '/u5'];

    // WHEN
    elbv2.ListenerCondition.pathPatterns(array); // Does not throw
    array.push('/u6');

    // THEN
    expect(() => {
      elbv2.ListenerCondition.pathPatterns(array);
    }).toThrow(/Path pattern value can only have '5' condition values/);
  });

  test('pathPatternsRegex length greater than 5 will throw exception', () => {
    // GIVEN
    const array = ['/u1.*', '/u2.*', '/u3.*', '/u4.*', '/u5.*'];

    // WHEN
    elbv2.ListenerCondition.pathPatternsRegex(array); // Does not throw
    array.push('/u6.*');

    // THEN
    expect(() => {
      elbv2.ListenerCondition.pathPatternsRegex(array);
    }).toThrow(/Path pattern regex value can only have '5' condition values/);
  });

  test('pathPatternsRegex renders with regexValues', () => {
    // GIVEN
    const condition = elbv2.ListenerCondition.pathPatternsRegex(['/api/v[0-9]+/.*', '/admin/.*']);

    // WHEN
    const rendered = condition.renderRawCondition();

    // THEN
    expect(rendered).toEqual({
      field: 'path-pattern',
      pathPatternConfig: {
        regexValues: ['/api/v[0-9]+/.*', '/admin/.*'],
      },
    });
  });

  test('pathPatterns renders with values', () => {
    // GIVEN
    const condition = elbv2.ListenerCondition.pathPatterns(['/api/*', '/admin/*']);

    // WHEN
    const rendered = condition.renderRawCondition();

    // THEN
    expect(rendered).toEqual({
      field: 'path-pattern',
      pathPatternConfig: {
        values: ['/api/*', '/admin/*'],
      },
    });
  });

  test('hostHeaders validates maximum length of 128 characters', () => {
    // GIVEN
    const validValue = 'a'.repeat(128);
    const invalidValue = 'a'.repeat(129);

    // WHEN/THEN
    expect(() => {
      elbv2.ListenerCondition.hostHeaders([validValue]);
    }).not.toThrow();

    expect(() => {
      elbv2.ListenerCondition.hostHeaders([invalidValue]);
    }).toThrow(/exceeds the maximum length of 128 characters/);
  });

  test('hostHeaders renders with values', () => {
    // GIVEN
    const condition = elbv2.ListenerCondition.hostHeaders(['example.com', '*.example.com']);

    // WHEN
    const rendered = condition.renderRawCondition();

    // THEN
    expect(rendered).toEqual({
      field: 'host-header',
      hostHeaderConfig: {
        values: ['example.com', '*.example.com'],
      },
    });
  });

  test('hostHeadersRegex validates maximum length of 128 characters', () => {
    // GIVEN
    const validValue = 'a'.repeat(128);
    const invalidValue = 'a'.repeat(129);

    // WHEN/THEN
    expect(() => {
      elbv2.ListenerCondition.hostHeadersRegex([validValue]);
    }).not.toThrow();

    expect(() => {
      elbv2.ListenerCondition.hostHeadersRegex([invalidValue]);
    }).toThrow(/exceeds the maximum length of 128 characters/);
  });

  test('hostHeadersRegex renders with regexValues', () => {
    // GIVEN
    const condition = elbv2.ListenerCondition.hostHeadersRegex(['^[a-z]+\\.example\\.com$']);

    // WHEN
    const rendered = condition.renderRawCondition();

    // THEN
    expect(rendered).toEqual({
      field: 'host-header',
      hostHeaderConfig: {
        regexValues: ['^[a-z]+\\.example\\.com$'],
      },
    });
  });

  test('httpHeader validates header name is non-empty', () => {
    // WHEN/THEN
    expect(() => {
      elbv2.ListenerCondition.httpHeader('', ['value']);
    }).toThrow(/HTTP header name must be non-empty/);
  });

  test('httpHeader validates header name maximum length of 40 characters', () => {
    // GIVEN
    const validName = 'a'.repeat(40);
    const invalidName = 'a'.repeat(41);

    // WHEN/THEN
    expect(() => {
      elbv2.ListenerCondition.httpHeader(validName, ['value']);
    }).not.toThrow();

    expect(() => {
      elbv2.ListenerCondition.httpHeader(invalidName, ['value']);
    }).toThrow(/exceeds the maximum length of 40 characters/);
  });

  test('httpHeader validates header value maximum length of 128 characters', () => {
    // GIVEN
    const validValue = 'a'.repeat(128);
    const invalidValue = 'a'.repeat(129);

    // WHEN/THEN
    expect(() => {
      elbv2.ListenerCondition.httpHeader('X-Custom-Header', [validValue]);
    }).not.toThrow();

    expect(() => {
      elbv2.ListenerCondition.httpHeader('X-Custom-Header', [invalidValue]);
    }).toThrow(/exceeds the maximum length of 128 characters/);
  });

  test('httpHeader renders with values', () => {
    // GIVEN
    const condition = elbv2.ListenerCondition.httpHeader('X-Custom-Header', ['value1', 'value2']);

    // WHEN
    const rendered = condition.renderRawCondition();

    // THEN
    expect(rendered).toEqual({
      field: 'http-header',
      httpHeaderConfig: {
        httpHeaderName: 'X-Custom-Header',
        values: ['value1', 'value2'],
      },
    });
  });

  test('httpHeaderRegex validates header name is non-empty', () => {
    // WHEN/THEN
    expect(() => {
      elbv2.ListenerCondition.httpHeaderRegex('', ['.*']);
    }).toThrow(/HTTP header name must be non-empty/);
  });

  test('httpHeaderRegex validates header name maximum length of 40 characters', () => {
    // GIVEN
    const validName = 'a'.repeat(40);
    const invalidName = 'a'.repeat(41);

    // WHEN/THEN
    expect(() => {
      elbv2.ListenerCondition.httpHeaderRegex(validName, ['.*']);
    }).not.toThrow();

    expect(() => {
      elbv2.ListenerCondition.httpHeaderRegex(invalidName, ['.*']);
    }).toThrow(/exceeds the maximum length of 40 characters/);
  });

  test('httpHeaderRegex validates regex value maximum length of 128 characters', () => {
    // GIVEN
    const validValue = 'a'.repeat(128);
    const invalidValue = 'a'.repeat(129);

    // WHEN/THEN
    expect(() => {
      elbv2.ListenerCondition.httpHeaderRegex('X-Custom-Header', [validValue]);
    }).not.toThrow();

    expect(() => {
      elbv2.ListenerCondition.httpHeaderRegex('X-Custom-Header', [invalidValue]);
    }).toThrow(/exceeds the maximum length of 128 characters/);
  });

  test('httpHeaderRegex renders with regexValues', () => {
    // GIVEN
    const condition = elbv2.ListenerCondition.httpHeaderRegex('X-Custom-Header', ['^value[0-9]+$']);

    // WHEN
    const rendered = condition.renderRawCondition();

    // THEN
    expect(rendered).toEqual({
      field: 'http-header',
      httpHeaderConfig: {
        httpHeaderName: 'X-Custom-Header',
        regexValues: ['^value[0-9]+$'],
      },
    });
  });

  test('httpRequestMethods validates method is non-empty', () => {
    // WHEN/THEN
    expect(() => {
      elbv2.ListenerCondition.httpRequestMethods(['']);
    }).toThrow(/HTTP request method must be non-empty/);
  });

  test('httpRequestMethods validates method maximum length of 40 characters', () => {
    // GIVEN
    const validMethod = 'A'.repeat(40);
    const invalidMethod = 'A'.repeat(41);

    // WHEN/THEN
    expect(() => {
      elbv2.ListenerCondition.httpRequestMethods([validMethod]);
    }).not.toThrow();

    expect(() => {
      elbv2.ListenerCondition.httpRequestMethods([invalidMethod]);
    }).toThrow(/exceeds the maximum length of 40 characters/);
  });

  test('httpRequestMethods validates method contains only valid characters', () => {
    // WHEN/THEN
    expect(() => {
      elbv2.ListenerCondition.httpRequestMethods(['GET']);
    }).not.toThrow();

    expect(() => {
      elbv2.ListenerCondition.httpRequestMethods(['CUSTOM-METHOD']);
    }).not.toThrow();

    expect(() => {
      elbv2.ListenerCondition.httpRequestMethods(['CUSTOM_METHOD']);
    }).not.toThrow();

    expect(() => {
      elbv2.ListenerCondition.httpRequestMethods(['invalid method']);
    }).toThrow(/contains invalid characters/);

    expect(() => {
      elbv2.ListenerCondition.httpRequestMethods(['get']);
    }).toThrow(/contains invalid characters/);
  });

  test('httpRequestMethods renders with values', () => {
    // GIVEN
    const condition = elbv2.ListenerCondition.httpRequestMethods(['GET', 'POST']);

    // WHEN
    const rendered = condition.renderRawCondition();

    // THEN
    expect(rendered).toEqual({
      field: 'http-request-method',
      httpRequestMethodConfig: {
        values: ['GET', 'POST'],
      },
    });
  });

  test('pathPatterns validates maximum length of 128 characters', () => {
    // GIVEN
    const validValue = '/'.concat('a'.repeat(127));
    const invalidValue = '/'.concat('a'.repeat(128));

    // WHEN/THEN
    expect(() => {
      elbv2.ListenerCondition.pathPatterns([validValue]);
    }).not.toThrow();

    expect(() => {
      elbv2.ListenerCondition.pathPatterns([invalidValue]);
    }).toThrow(/exceeds the maximum length of 128 characters/);
  });

  test('pathPatternsRegex validates maximum length of 128 characters', () => {
    // GIVEN
    const validValue = '/'.concat('a'.repeat(127));
    const invalidValue = '/'.concat('a'.repeat(128));

    // WHEN/THEN
    expect(() => {
      elbv2.ListenerCondition.pathPatternsRegex([validValue]);
    }).not.toThrow();

    expect(() => {
      elbv2.ListenerCondition.pathPatternsRegex([invalidValue]);
    }).toThrow(/exceeds the maximum length of 128 characters/);
  });

  test('queryStrings renders with values', () => {
    // GIVEN
    const condition = elbv2.ListenerCondition.queryStrings([
      { key: 'version', value: 'v1' },
      { value: 'test' },
    ]);

    // WHEN
    const rendered = condition.renderRawCondition();

    // THEN
    expect(rendered).toEqual({
      field: 'query-string',
      queryStringConfig: {
        values: [
          { key: 'version', value: 'v1' },
          { value: 'test' },
        ],
      },
    });
  });

  test('sourceIps renders with values', () => {
    // GIVEN
    const condition = elbv2.ListenerCondition.sourceIps(['192.168.1.0/24', '10.0.0.0/8']);

    // WHEN
    const rendered = condition.renderRawCondition();

    // THEN
    expect(rendered).toEqual({
      field: 'source-ip',
      sourceIpConfig: {
        values: ['192.168.1.0/24', '10.0.0.0/8'],
      },
    });
  });
});
