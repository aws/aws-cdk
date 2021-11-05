import '@aws-cdk/assert-internal/jest';
import { App, Duration, Stack } from '@aws-cdk/core';
import { ResponseHeadersPolicy } from '../lib';

describe('ResponseHeadersPolicy', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'testregion' },
    });
  });

  test('import existing policy by id', () => {
    const responseHeadersPolicyId = '344f6fe5-7ce5-4df0-a470-3f14177c549c';
    const responseHeadersPolicy = ResponseHeadersPolicy.fromResponseHeadersPolicyId(stack, 'MyPolicy', responseHeadersPolicyId);
    expect(responseHeadersPolicy.responseHeadersPolicyId).toEqual(responseHeadersPolicyId);
  });

  test('managed policies are provided', () => {
    expect(ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS.responseHeadersPolicyId).toEqual('60669652-455b-4ae9-85a4-c4c02393f86c');
    expect(ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT.responseHeadersPolicyId).toEqual('5cc3b908-e619-4b99-88e5-2cf7f45965bd');
    expect(ResponseHeadersPolicy.SECURITY_HEADERS.responseHeadersPolicyId).toEqual('67f7725c-6f97-4210-82d7-5512b31e9d03');
    expect(ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_AND_SECURITY_HEADERS.responseHeadersPolicyId).toEqual('e61eb60c-9c35-4d20-a928-2b84e02af89c');
    expect(ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT_AND_SECURITY_HEADERS.responseHeadersPolicyId).toEqual('eaab4381-ed33-4a86-88ca-d9558dc6cd63');
  });

  test('minimal example', () => {
    new ResponseHeadersPolicy(stack, 'ResponseHeadersPolicy');

    expect(stack).toHaveResource('AWS::CloudFront::ResponseHeadersPolicy', {
      ResponseHeadersPolicyConfig: {
        Name: 'StackResponseHeadersPolicy7B76F936',
      },
    });
  });

  test('maximum example', () => {
    new ResponseHeadersPolicy(stack, 'ResponseHeadersPolicy', {
      responseHeadersPolicyName: 'MyPolicy',
      comment: 'A default policy',
      corsBehaivor: {
        accessControlAllowCredentials: true,
        accessControlAllowHeaders: ['X-Amz-Date', 'X-Amz-Security-Token'],
        accessControlAllowMethods: ['GET', 'POST'],
        accessControlAllowOrigins: ['*'],
        accessControlExposeHeaders: ['X-Amz-Date', 'X-Amz-Security-Token'],
        accessControlMaxAge: Duration.seconds(600),
        originOverride: true,
      },
      customHeadersBehavior: {
        customHeaders: [
          { header: 'X-Amz-Date', value: 'some-value', override: true },
          { header: 'X-Amz-Security-Token', value: 'some-value', override: false },
        ],
      },
      securityHeadersBehavior: {
        contentSecurityPolicy: { contentSecurityPolicy: 'default-src https:;', override: true },
        contentTypeOptions: { override: true },
        frameOptions: { frameOption: 'DENY', override: true },
        referrerPolicy: { referrerPolicy: 'no-referrer', override: true },
        strictTransportSecurity: { accessControlMaxAge: Duration.seconds(600), includeSubdomains: true, override: true },
        xssProtection: { protection: true, modeBlock: true, reportUri: 'https://example.com/csp-report', override: true },
      },
    });

    expect(stack).toHaveResource('AWS::CloudFront::ResponseHeadersPolicy', {
      ResponseHeadersPolicyConfig: {
        Comment: 'A default policy',
        CorsConfig: {
          AccessControlAllowCredentials: true,
          AccessControlAllowHeaders: {
            Items: [
              'X-Amz-Date',
              'X-Amz-Security-Token',
            ],
          },
          AccessControlAllowMethods: {
            Items: [
              'GET',
              'POST',
            ],
          },
          AccessControlAllowOrigins: {
            Items: [
              '*',
            ],
          },
          AccessControlExposeHeaders: {
            Items: [
              'X-Amz-Date',
              'X-Amz-Security-Token',
            ],
          },
          AccessControlMaxAgeSec: 600,
          OriginOverride: true,
        },
        CustomHeadersConfig: {
          Items: [
            {
              Header: 'X-Amz-Date',
              Override: true,
              Value: 'some-value',
            },
            {
              Header: 'X-Amz-Security-Token',
              Override: false,
              Value: 'some-value',
            },
          ],
        },
        Name: 'MyPolicy',
        SecurityHeadersConfig: {
          ContentSecurityPolicy: {
            ContentSecurityPolicy: 'default-src https:;',
            Override: true,
          },
          ContentTypeOptions: {
            Override: true,
          },
          FrameOptions: {
            FrameOption: 'DENY',
            Override: true,
          },
          ReferrerPolicy: {
            Override: true,
            ReferrerPolicy: 'no-referrer',
          },
          StrictTransportSecurity: {
            AccessControlMaxAgeSec: 600,
            IncludeSubdomains: true,
            Override: true,
          },
          XSSProtection: {
            ModeBlock: true,
            Override: true,
            Protection: true,
            ReportUri: 'https://example.com/csp-report',
          },
        },
      },
    });
  });
});
