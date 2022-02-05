import { JavaScript, JavaScriptRegExp } from '../../lib/private/code-snippet';

describe('JavaScript.stringify', () => {
  test('Boolean properties', () => {
    const js = JavaScript.stringify({
      allowCookies: true,
      enableXRay: false,
    });
    expect(js).toBe('{allowCookies:true,enableXRay:false}');
  });

  test('String properties', () => {
    const js = JavaScript.stringify({
      endpoint: 'https://dataplane.rum.some-region.amazonaws.com',
    });
    expect(js).toBe("{endpoint:'https://dataplane.rum.some-region.amazonaws.com'}");
  });

  test('Number properties', () => {
    const js = JavaScript.stringify({
      sessionSampleRate: 0.1,
    });
    expect(js).toBe('{sessionSampleRate:0.1}');
  });

  test('Array properties', () => {
    const js = JavaScript.stringify({
      telemetries: ['performance', 'http'],
    });
    expect(js).toBe("{telemetries:['performance','http']}");
  });

  test('Nested array properties', () => {
    const js = JavaScript.stringify({
      telemetries: [['performance'], 'http'],
    });
    expect(js).toBe("{telemetries:[['performance'],'http']}");
  });

  test('Object properties in array', () => {
    const js = JavaScript.stringify({
      telemetries: [['performance', { eventLimit: 5 }], 'http'],
    });
    expect(js).toBe("{telemetries:[['performance',{eventLimit:5}],'http']}");
  });

  test('RegExp properties', () => {
    const js = JavaScript.stringify({
      pagesToInclude: [new JavaScriptRegExp('/https:\\/\\/amazon.com\\/foo/')],
    });
    expect(js).toBe('{pagesToInclude:[/https:\\/\\/amazon.com\\/foo/]}');
  });

  test('Undefined properties are ignore', () => {
    const js = JavaScript.stringify({
      allowCookies: true,
      enableXRay: undefined,
    });
    expect(js).toBe('{allowCookies:true}');
  });
});