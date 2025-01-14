import { Template } from '../../assertions';
import { StringParameter } from '../../aws-ssm';
import { App, Aws, Duration, Lazy, Stack, Token } from '../../core';
import { CachePolicy, CacheCookieBehavior, CacheHeaderBehavior, CacheQueryStringBehavior } from '../lib';

describe('CachePolicy', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'testregion' },
    });
  });

  test('import existing policy by id', () => {
    const cachePolicyId = '344f6fe5-7ce5-4df0-a470-3f14177c549c';
    const cachePolicy = CachePolicy.fromCachePolicyId(stack, 'MyPolicy', cachePolicyId);
    expect(cachePolicy.cachePolicyId).toEqual(cachePolicyId);
  });

  test('minimal example', () => {
    new CachePolicy(stack, 'CachePolicy');

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::CachePolicy', {
      CachePolicyConfig: {
        Name: 'StackCachePolicy0D6FCBC0-testregion',
        MinTTL: 0,
        DefaultTTL: 86400,
        MaxTTL: 31536000,
        ParametersInCacheKeyAndForwardedToOrigin: {
          CookiesConfig: {
            CookieBehavior: 'none',
          },
          EnableAcceptEncodingGzip: false,
          EnableAcceptEncodingBrotli: false,
          HeadersConfig: {
            HeaderBehavior: 'none',
          },
          QueryStringsConfig: {
            QueryStringBehavior: 'none',
          },
        },
      },
    });
  });

  test('maximum example', () => {
    new CachePolicy(stack, 'CachePolicy', {
      cachePolicyName: 'MyPolicy',
      comment: 'A default policy',
      defaultTtl: Duration.days(2),
      minTtl: Duration.minutes(1),
      maxTtl: Duration.days(10),
      cookieBehavior: CacheCookieBehavior.all(),
      headerBehavior: CacheHeaderBehavior.allowList('X-CustomHeader'),
      queryStringBehavior: CacheQueryStringBehavior.denyList('username'),
      enableAcceptEncodingGzip: true,
      enableAcceptEncodingBrotli: true,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::CachePolicy', {
      CachePolicyConfig: {
        Name: 'MyPolicy',
        Comment: 'A default policy',
        MinTTL: 60,
        DefaultTTL: 172800,
        MaxTTL: 864000,
        ParametersInCacheKeyAndForwardedToOrigin: {
          CookiesConfig: {
            CookieBehavior: 'all',
          },
          HeadersConfig: {
            HeaderBehavior: 'whitelist',
            Headers: ['X-CustomHeader'],
          },
          QueryStringsConfig: {
            QueryStringBehavior: 'allExcept',
            QueryStrings: ['username'],
          },
          EnableAcceptEncodingGzip: true,
          EnableAcceptEncodingBrotli: true,
        },
      },
    });
  });

  test('throws on long policy names over 128 characters', () => {
    const errorMessage = /'cachePolicyName' cannot be longer than 128 characters/;
    expect(() => new CachePolicy(stack, 'CachePolicy1', { cachePolicyName: 'FooBarBaz'.repeat(15) })).toThrow(errorMessage);
  });

  test('throws if cachePolicyName contains invalid characters', () => {
    const errorMessage = /'cachePolicyName' can only include '-', '_', and alphanumeric characters/;
    expect(() => new CachePolicy(stack, 'CachePolicy1', { cachePolicyName: 'My Policy' })).toThrow(errorMessage);
    expect(() => new CachePolicy(stack, 'CachePolicy2', { cachePolicyName: 'MyPolicy!' })).toThrow(errorMessage);
    expect(() => new CachePolicy(stack, 'CachePolicy3', { cachePolicyName: 'MyPolicy,New' })).toThrow(errorMessage);

    expect(() => new CachePolicy(stack, 'CachePolicy4', { cachePolicyName: 'MyPolicy' })).not.toThrow();
    expect(() => new CachePolicy(stack, 'CachePolicy5', { cachePolicyName: 'My-Policy' })).not.toThrow();
    expect(() => new CachePolicy(stack, 'CachePolicy6', { cachePolicyName: 'My_Policy' })).not.toThrow();
  });

  test('does not throw if cachePolicyName is a token', () => {
    expect(() => new CachePolicy(stack, 'CachePolicy', {
      cachePolicyName: Aws.STACK_NAME,
    })).not.toThrow();
  });

  test('throws on long comment over 128 characters', () => {
    const errorMessage = /'comment' cannot be longer than 128 characters, got: 129/;
    expect(() => new CachePolicy(stack, 'CachePolicy1', { comment: 'a'.repeat(129) })).toThrow(errorMessage);
  });

  describe('TTLs', () => {
    test('default TTLs', () => {
      new CachePolicy(stack, 'CachePolicy', { cachePolicyName: 'MyPolicy' });

      Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::CachePolicy', {
        CachePolicyConfig: {
          MinTTL: 0,
          DefaultTTL: 86400,
          MaxTTL: 31536000,
        },
      });
    });

    test('defaultTTL defaults to minTTL if minTTL is more than 1 day', () => {
      new CachePolicy(stack, 'CachePolicy', {
        cachePolicyName: 'MyPolicy',
        minTtl: Duration.days(2),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::CachePolicy', {
        CachePolicyConfig: {
          MinTTL: 172800,
          DefaultTTL: 172800,
          MaxTTL: 31536000,
        },
      });
    });

    test('maxTTL defaults to defaultTTL if defaultTTL is more than 1 year', () => {
      new CachePolicy(stack, 'CachePolicy', {
        cachePolicyName: 'MyPolicy',
        defaultTtl: Duration.days(400),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::CachePolicy', {
        CachePolicyConfig: {
          MinTTL: 0,
          DefaultTTL: 34560000,
          MaxTTL: 34560000,
        },
      });
    });

    test('sorting TTLs is not performed when using Tokens', () => {
      new CachePolicy(stack, 'CachePolicy', {
        cachePolicyName: 'MyPolicy',
        minTtl: Duration.seconds(Lazy.number({ produce: () => 30 })),
        defaultTtl: Duration.seconds(Lazy.number({ produce: () => 20 })),
        maxTtl: Duration.seconds(Lazy.number({ produce: () => 10 })),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::CachePolicy', {
        CachePolicyConfig: {
          MinTTL: 30,
          DefaultTTL: 20,
          MaxTTL: 10,
        },
      });
    });

    test('respects Tokens', () => {
      new CachePolicy(stack, 'CachePolicy', {
        cachePolicyName: 'MyPolicy',
        minTtl: Duration.seconds(Token.asNumber(StringParameter.valueForStringParameter(stack, '/Min'))),
        defaultTtl: Duration.seconds(Token.asNumber(StringParameter.valueForStringParameter(stack, '/Default'))),
        maxTtl: Duration.seconds(Token.asNumber(StringParameter.valueForStringParameter(stack, '/Max'))),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::CachePolicy', {
        CachePolicyConfig: {
          MinTTL: { Ref: 'SsmParameterValueMinC96584B6F00A464EAD1953AFF4B05118Parameter' },
          DefaultTTL: { Ref: 'SsmParameterValueDefaultC96584B6F00A464EAD1953AFF4B05118Parameter' },
          MaxTTL: { Ref: 'SsmParameterValueMaxC96584B6F00A464EAD1953AFF4B05118Parameter' },
        },
      });
    });
  });
});

test('managed policies are provided', () => {
  expect(CachePolicy.CACHING_OPTIMIZED.cachePolicyId).toEqual('658327ea-f89d-4fab-a63d-7e88639e58f6');
  expect(CachePolicy.CACHING_OPTIMIZED_FOR_UNCOMPRESSED_OBJECTS.cachePolicyId).toEqual('b2884449-e4de-46a7-ac36-70bc7f1ddd6d');
  expect(CachePolicy.CACHING_DISABLED.cachePolicyId).toEqual('4135ea2d-6df8-44a3-9df3-4b5a84be39ad');
  expect(CachePolicy.ELEMENTAL_MEDIA_PACKAGE.cachePolicyId).toEqual('08627262-05a9-4f76-9ded-b50ca2e3a84f');
});

// CookieBehavior and QueryStringBehavior have identical behavior
describe.each([
  ['CookieBehavior', CacheCookieBehavior, 'cookie', (c: CacheCookieBehavior) => c.cookies],
  ['QueryStringBehavior', CacheQueryStringBehavior, 'query string', (qs: CacheQueryStringBehavior) => qs.queryStrings],
])('%s', (_className, clazz, type, items) => {
  test('none()', () => {
    const behavior = clazz.none();

    expect(behavior.behavior).toEqual('none');
    expect(items(behavior)).toBeUndefined();
  });

  test('all()', () => {
    const behavior = clazz.all();

    expect(behavior.behavior).toEqual('all');
    expect(items(behavior)).toBeUndefined();
  });

  test('allowList()', () => {
    const behavior = clazz.allowList('SESSION_ID', 'secrets');

    expect(behavior.behavior).toEqual('whitelist');
    expect(items(behavior)).toEqual(['SESSION_ID', 'secrets']);
  });

  test('allowList() throws if list is empty', () => {
    expect(() => clazz.allowList()).toThrow(new RegExp(`At least one ${type} to allow must be provided`));
  });

  test('denyList()', () => {
    const behavior = clazz.denyList('SESSION_ID', 'secrets');

    expect(behavior.behavior).toEqual('allExcept');
    expect(items(behavior)).toEqual(['SESSION_ID', 'secrets']);
  });

  test('denyList() throws if list is empty', () => {
    expect(() => clazz.denyList()).toThrow(new RegExp(`At least one ${type} to deny must be provided`));
  });

});

describe('HeaderBehavior', () => {
  test('none()', () => {
    const headers = CacheHeaderBehavior.none();

    expect(headers.behavior).toEqual('none');
    expect(headers.headers).toBeUndefined();
  });

  test('allowList()', () => {
    const headers = CacheHeaderBehavior.allowList('X-CustomHeader', 'X-AnotherHeader');

    expect(headers.behavior).toEqual('whitelist');
    expect(headers.headers).toEqual(['X-CustomHeader', 'X-AnotherHeader']);
  });

  test('allowList() throws if list is empty', () => {
    expect(() => CacheHeaderBehavior.allowList()).toThrow(/At least one header to allow must be provided/);
  });
});
