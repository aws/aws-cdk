import { Template } from '../../assertions';
import { LambdaFunction } from '../../aws-events-targets';
import { Code, Runtime, Function } from '../../aws-lambda';
import { Bucket } from '../../aws-s3';
import { App, Stack } from '../../core';
import { Match } from '../lib';

describe(Match, () => {
  const app = new App();
  const stack = new Stack(app, 'stack');

  test('anythingBut', () => {
    expect(stack.resolve(Match.anythingBut(1, 2, 3))).toEqual([
      { 'anything-but': [1, 2, 3] },
    ]);

    expect(stack.resolve(Match.anythingBut('foo', 'bar'))).toEqual([
      { 'anything-but': ['foo', 'bar'] },
    ]);

    expect(() => stack.resolve(Match.anythingBut(1, 'foo'))).toThrow(/only strings or only numbers/);
    expect(() => stack.resolve(Match.anythingBut({ foo: 42 }))).toThrow(/only strings or only numbers/);
    expect(() => stack.resolve(Match.anythingBut())).toThrow(/must be non-empty lists/);
  });

  test('anythingButPrefix', () => {
    expect(stack.resolve(Match.anythingButPrefix('foo'))).toEqual([
      { 'anything-but': { prefix: 'foo' } },
    ]);

    expect(stack.resolve(Match.anythingButPrefix('foo', 'bar'))).toEqual([
      { 'anything-but': { prefix: ['foo', 'bar'] } },
    ]);

    expect(() => stack.resolve(Match.anythingButPrefix())).toThrow(/must be non-empty lists/);
  });

  test('anythingButSuffix', () => {
    expect(stack.resolve(Match.anythingButSuffix('foo'))).toEqual([
      { 'anything-but': { suffix: 'foo' } },
    ]);

    expect(stack.resolve(Match.anythingButSuffix('foo', 'bar'))).toEqual([
      { 'anything-but': { suffix: ['foo', 'bar'] } },
    ]);

    expect(() => stack.resolve(Match.anythingButPrefix())).toThrow(/must be non-empty lists/);
  });

  test('anythingButWildcard', () => {
    expect(stack.resolve(Match.anythingButWildcard('*.txt'))).toEqual([
      { 'anything-but': { wildcard: '*.txt' } },
    ]);

    expect(stack.resolve(Match.anythingButWildcard('*.txt', '*.json'))).toEqual([
      { 'anything-but': { wildcard: ['*.txt', '*.json'] } },
    ]);

    expect(() => stack.resolve(Match.anythingButPrefix())).toThrow(/must be non-empty lists/);
  });

  test('anythingButEqualsIgnoreCase', () => {
    expect(stack.resolve(Match.anythingButEqualsIgnoreCase('foo'))).toEqual([
      { 'anything-but': { 'equals-ignore-case': 'foo' } },
    ]);

    expect(stack.resolve(Match.anythingButEqualsIgnoreCase('foo', 'bar'))).toEqual([
      { 'anything-but': { 'equals-ignore-case': ['foo', 'bar'] } },
    ]);

    expect(() => stack.resolve(Match.anythingButPrefix())).toThrow(/must be non-empty lists/);
  });

  test('numeric', () => {
    expect(stack.resolve(Match.allOf(Match.greaterThan(-100), Match.lessThanOrEqual(200)))).toEqual([
      { numeric: ['>', -100, '<=', 200] },
    ]);

    expect(() => stack.resolve(Match.allOf())).toThrow(/A list of matchers must contain at least one element/);

    expect(() => stack.resolve(Match.allOf(Match.prefixEqualsIgnoreCase('test')))).toThrow(/Only numeric matchers can be merged into a single matcher./);
  });

  test('interval', () => {
    expect(stack.resolve(Match.interval(0, 100))).toEqual([
      { numeric: ['>=', 0, '<=', 100] },
    ]);

    expect(() => stack.resolve(Match.interval(1, 0))).toThrow('Invalid interval: [1, 0]');
  });

  test('cidr', () => {
    // IPv4
    expect(stack.resolve(Match.cidr('198.51.100.14/24'))).toEqual([
      { cidr: '198.51.100.14/24' },
    ]);

    // IPv6
    expect(stack.resolve(Match.cidr('2001:db8::/48'))).toEqual([
      { cidr: '2001:db8::/48' },
    ]);

    // Invalid
    expect(() => stack.resolve(Match.cidr('a.b.c/31'))).toThrow(/Invalid IP address range/);
  });

  test('anyOf', () => {
    expect(stack.resolve(Match.anyOf(Match.equal(0), Match.equal(1)))).toEqual([
      { numeric: ['=', 0] },
      { numeric: ['=', 1] },
    ]);

    expect(() => stack.resolve(Match.anyOf())).toThrow(/A list of matchers must contain at least one element/);
  });

  test('anyOf with raw strings', () => {
    // Test raw strings only (regression test for issue #36902)
    expect(stack.resolve(Match.anyOf('string1', 'string2'))).toEqual([
      'string1',
      'string2',
    ]);

    // Test single raw string
    expect(stack.resolve(Match.anyOf('single-string'))).toEqual([
      'single-string',
    ]);
  });

  test('anyOf with mixed inputs', () => {
    // Test mixed raw strings and Match method results (regression test for issue #36902)
    expect(stack.resolve(Match.anyOf('raw-string', Match.prefix('pre')))).toEqual([
      'raw-string',
      { prefix: 'pre' },
    ]);

    // Test mixed with multiple Match methods
    expect(stack.resolve(Match.anyOf('string1', Match.prefix('pre'), Match.suffix('suf')))).toEqual([
      'string1',
      { prefix: 'pre' },
      { suffix: 'suf' },
    ]);

    // Test mixed with raw string at the end
    expect(stack.resolve(Match.anyOf(Match.prefix('pre'), 'raw-string'))).toEqual([
      { prefix: 'pre' },
      'raw-string',
    ]);
  });

  test('prefix', () => {
    expect(stack.resolve(Match.prefix('foo'))).toEqual([
      { prefix: 'foo' },
    ]);
  });

  test('suffix', () => {
    expect(stack.resolve(Match.suffix('foo'))).toEqual([
      { suffix: 'foo' },
    ]);
  });

  test('prefixEqualsIgnoreCase', () => {
    expect(stack.resolve(Match.prefixEqualsIgnoreCase('foo'))).toEqual([
      { prefix: { 'equals-ignore-case': 'foo' } },
    ]);
  });

  test('suffixEqualsIgnoreCase', () => {
    expect(stack.resolve(Match.suffixEqualsIgnoreCase('foo'))).toEqual([
      { suffix: { 'equals-ignore-case': 'foo' } },
    ]);
  });

  test('wildcard', () => {
    expect(stack.resolve(Match.wildcard('*.json'))).toEqual([
      { wildcard: '*.json' },
    ]);
  });

  test('equalsIgnoreCase', () => {
    expect(stack.resolve(Match.equalsIgnoreCase('foo'))).toEqual([
      { 'equals-ignore-case': 'foo' },
    ]);
  });

  test('nullValue', () => {
    expect(stack.resolve(Match.nullValue())).toEqual([
      null,
    ]);
  });

  test('exists', () => {
    expect(stack.resolve(Match.exists())).toEqual([
      { exists: true },
    ]);
  });

  test('doesNotExist', () => {
    expect(stack.resolve(Match.doesNotExist())).toEqual([
      { exists: false },
    ]);
  });

  test('exactString', () => {
    expect(stack.resolve(Match.exactString('test-value'))).toEqual([
      'test-value',
    ]);
  });

  test('greaterThan', () => {
    expect(stack.resolve(Match.greaterThan(100))).toEqual([
      { numeric: ['>', 100] },
    ]);
  });

  test('greaterThanOrEqual', () => {
    expect(stack.resolve(Match.greaterThanOrEqual(100))).toEqual([
      { numeric: ['>=', 100] },
    ]);
  });

  test('lessThan', () => {
    expect(stack.resolve(Match.lessThan(100))).toEqual([
      { numeric: ['<', 100] },
    ]);
  });

  test('lessThanOrEqual', () => {
    expect(stack.resolve(Match.lessThanOrEqual(100))).toEqual([
      { numeric: ['<=', 100] },
    ]);
  });

  test('equal', () => {
    expect(stack.resolve(Match.equal(100))).toEqual([
      { numeric: ['=', 100] },
    ]);
  });

  test('ipAddressRange', () => {
    // IPv4
    expect(stack.resolve(Match.ipAddressRange('192.168.1.0/24'))).toEqual([
      { cidr: '192.168.1.0/24' },
    ]);

    // IPv6
    expect(stack.resolve(Match.ipAddressRange('2001:db8::/32'))).toEqual([
      { cidr: '2001:db8::/32' },
    ]);

    // Invalid
    expect(() => stack.resolve(Match.ipAddressRange('invalid-range'))).toThrow(/Invalid IP address range/);
  });
});

describe('Match with Tokens', () => {
  let app: App = new App();
  let stack: Stack = new Stack(app, 'TokenTestStack');
  let bucket: Bucket;
  let lambdaFunction: Function;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TokenTestStack');
    bucket = new Bucket(stack, 'Bucket');

    lambdaFunction = new Function(stack, 'Function', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: Code.fromInline(`
        exports.handler = async (event) => {
          console.log("Event:", JSON.stringify(event, null, 2));
          return {};
        };
      `),
    });
  });

  test('wildcard with Token', () => {
    bucket.onCloudTrailEvent('WildcardEvents', {
      target: new LambdaFunction(lambdaFunction),
      eventPattern: { detail: { resources: { ARN: Match.wildcard(`${bucket.bucketName}/directoryA/*`) } } },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        detail: {
          resources: {
            ARN: [
              {
                wildcard: {
                  'Fn::Join': [
                    '',
                    [
                      {
                        Ref: 'Bucket83908E77',
                      },
                      '/directoryA/*',
                    ],
                  ],
                },
              },
              {
                'Fn::GetAtt': [
                  'Bucket83908E77',
                  'Arn',
                ],
              },
            ],
          },
        },
      },
    });
  });

  test('prefix with Token', () => {
    bucket.onCloudTrailEvent('PrefixEvents', {
      target: new LambdaFunction(lambdaFunction),
      eventPattern: { detail: { resources: { ARN: Match.prefix(`${bucket.bucketName}/logs/`) } } },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        detail: {
          resources: {
            ARN: [
              {
                prefix: {
                  'Fn::Join': [
                    '',
                    [
                      {
                        Ref: 'Bucket83908E77',
                      },
                      '/logs/',
                    ],
                  ],
                },
              },
              {
                'Fn::GetAtt': [
                  'Bucket83908E77',
                  'Arn',
                ],
              },
            ],
          },
        },
      },
    });
  });

  test('suffix with Token', () => {
    bucket.onCloudTrailEvent('SuffixEvents', {
      target: new LambdaFunction(lambdaFunction),
      eventPattern: { detail: { resources: { ARN: Match.suffix(`${bucket.bucketName}/test.json`) } } },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        detail: {
          resources: {
            ARN: [
              {
                suffix: {
                  'Fn::Join': [
                    '',
                    [
                      {
                        Ref: 'Bucket83908E77',
                      },
                      '/test.json',
                    ],
                  ],
                },
              },
              {
                'Fn::GetAtt': [
                  'Bucket83908E77',
                  'Arn',
                ],
              },
            ],
          },
        },
      },
    });
  });

  test('exactString with Token', () => {
    bucket.onCloudTrailEvent('ExactEvents', {
      target: new LambdaFunction(lambdaFunction),
      eventPattern: { detail: { resources: { ARN: Match.exactString(`${bucket.bucketArn}/test.json`) } } },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        detail: {
          resources: {
            ARN: [
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        'Bucket83908E77',
                        'Arn',
                      ],
                    },
                    '/test.json',
                  ],
                ],
              },
              {
                'Fn::GetAtt': [
                  'Bucket83908E77',
                  'Arn',
                ],
              },
            ],
          },
        },
      },
    });
  });

  test('equalsIgnoreCase with Token', () => {
    bucket.onCloudTrailEvent('IgnoreCaseEvents', {
      target: new LambdaFunction(lambdaFunction),
      eventPattern: { detail: { resources: { ARN: Match.equalsIgnoreCase(`${bucket.bucketName}/Test.json`) } } },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        detail: {
          resources: {
            ARN: [
              {
                'equals-ignore-case': {
                  'Fn::Join': [
                    '',
                    [
                      {
                        Ref: 'Bucket83908E77',
                      },
                      '/Test.json',
                    ],
                  ],
                },
              },
              {
                'Fn::GetAtt': [
                  'Bucket83908E77',
                  'Arn',
                ],
              },
            ],
          },
        },
      },
    });
  });

  test('prefixEqualsIgnoreCase with Token', () => {
    bucket.onCloudTrailEvent('PrefixIgnoreCaseEvents', {
      target: new LambdaFunction(lambdaFunction),
      eventPattern: { detail: { resources: { ARN: Match.prefixEqualsIgnoreCase(`${bucket.bucketName}/Test.json`) } } },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        detail: {
          resources: {
            ARN: [
              {
                prefix: {
                  'equals-ignore-case': {
                    'Fn::Join': [
                      '',
                      [
                        {
                          Ref: 'Bucket83908E77',
                        },
                        '/Test.json',
                      ],
                    ],
                  },
                },
              },
              {
                'Fn::GetAtt': [
                  'Bucket83908E77',
                  'Arn',
                ],
              },
            ],
          },
        },
      },
    });
  });

  test('suffixEqualsIgnoreCase with Token', () => {
    bucket.onCloudTrailEvent('SuffixIgnoreCaseEvents', {
      target: new LambdaFunction(lambdaFunction),
      eventPattern: { detail: { resources: { ARN: Match.suffixEqualsIgnoreCase(`${bucket.bucketName}/Test.json`) } } },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        detail: {
          resources: {
            ARN: [
              {
                suffix: {
                  'equals-ignore-case': {
                    'Fn::Join': [
                      '',
                      [
                        {
                          Ref: 'Bucket83908E77',
                        },
                        '/Test.json',
                      ],
                    ],
                  },
                },
              },
              {
                'Fn::GetAtt': [
                  'Bucket83908E77',
                  'Arn',
                ],
              },
            ],
          },
        },
      },
    });
  });

  test('anythingButPrefix with Token', () => {
    bucket.onCloudTrailEvent('AnythingButPrefixEvents', {
      target: new LambdaFunction(lambdaFunction),
      eventPattern: { detail: { resources: { ARN: Match.anythingButPrefix(`${bucket.bucketArn}/temp/`) } } },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        detail: {
          resources: {
            ARN: [
              {
                'anything-but': {
                  prefix: {
                    'Fn::Join': [
                      '',
                      [
                        {
                          'Fn::GetAtt': [
                            'Bucket83908E77',
                            'Arn',
                          ],
                        },
                        '/temp/',
                      ],
                    ],
                  },
                },
              },
              {
                'Fn::GetAtt': [
                  'Bucket83908E77',
                  'Arn',
                ],
              },
            ],
          },
        },
      },
    });
  });

  test('anythingButSuffix with Token', () => {
    bucket.onCloudTrailEvent('AnythingButSuffixEvents', {
      target: new LambdaFunction(lambdaFunction),
      eventPattern: { detail: { resources: { ARN: Match.anythingButSuffix(`${bucket.bucketArn}/temp/`) } } },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        detail: {
          resources: {
            ARN: [
              {
                'anything-but': {
                  suffix: {
                    'Fn::Join': [
                      '',
                      [
                        {
                          'Fn::GetAtt': [
                            'Bucket83908E77',
                            'Arn',
                          ],
                        },
                        '/temp/',
                      ],
                    ],
                  },
                },
              },
              {
                'Fn::GetAtt': [
                  'Bucket83908E77',
                  'Arn',
                ],
              },
            ],
          },
        },
      },
    });
  });

  test('anythingButWildcard with Token', () => {
    bucket.onCloudTrailEvent('AnythingButWildcardEvents', {
      target: new LambdaFunction(lambdaFunction),
      eventPattern: { detail: { resources: { ARN: Match.anythingButWildcard(`${bucket.bucketArn}/temp/*`) } } },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        detail: {
          resources: {
            ARN: [
              {
                'anything-but': {
                  wildcard: {
                    'Fn::Join': [
                      '',
                      [
                        {
                          'Fn::GetAtt': [
                            'Bucket83908E77',
                            'Arn',
                          ],
                        },
                        '/temp/*',
                      ],
                    ],
                  },
                },
              },
              {
                'Fn::GetAtt': [
                  'Bucket83908E77',
                  'Arn',
                ],
              },
            ],
          },
        },
      },
    });
  });

  test('anythingButEqualsIgnoreCase with Token', () => {
    bucket.onCloudTrailEvent('AnythingButEqualsIgnoreCaseEvents', {
      target: new LambdaFunction(lambdaFunction),
      eventPattern: { detail: { resources: { ARN: Match.anythingButEqualsIgnoreCase(`${bucket.bucketArn}/Temp`) } } },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        detail: {
          resources: {
            ARN: [
              {
                'anything-but': {
                  'equals-ignore-case': {
                    'Fn::Join': [
                      '',
                      [
                        {
                          'Fn::GetAtt': [
                            'Bucket83908E77',
                            'Arn',
                          ],
                        },
                        '/Temp',
                      ],
                    ],
                  },
                },
              },
              {
                'Fn::GetAtt': [
                  'Bucket83908E77',
                  'Arn',
                ],
              },
            ],
          },
        },
      },
    });
  });

  test('anyOf with Tokens', () => {
    bucket.onCloudTrailEvent('AnythingButEqualsIgnoreCaseEvents', {
      target: new LambdaFunction(lambdaFunction),
      eventPattern: { detail: { resources: { ARN: Match.anyOf(Match.wildcard(`${bucket.bucketName}/directoryA/*`), Match.wildcard(`${bucket.bucketName}/directoryB/*`)) } } },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        detail: {
          resources: {
            ARN: [
              {
                wildcard: {
                  'Fn::Join': [
                    '',
                    [
                      {
                        Ref: 'Bucket83908E77',
                      },
                      '/directoryA/*',
                    ],
                  ],
                },
              },
              {
                wildcard: {
                  'Fn::Join': [
                    '',
                    [
                      {
                        Ref: 'Bucket83908E77',
                      },
                      '/directoryB/*',
                    ],
                  ],
                },
              },
              {
                'Fn::GetAtt': [
                  'Bucket83908E77',
                  'Arn',
                ],
              },
            ],
          },
        },
      },
    });
  });
});
