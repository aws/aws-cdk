import { Template } from '@aws-cdk/assertions';
import { App, Duration, Stack } from '@aws-cdk/core';
import { HeadersFrameOption, HeadersReferrerPolicy, ResponseHeadersPolicy } from '../lib';

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

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::ResponseHeadersPolicy', {
      ResponseHeadersPolicyConfig: {
        Name: 'StackResponseHeadersPolicy7B76F936',
      },
    });
  });

  test('maximum example', () => {
    new ResponseHeadersPolicy(stack, 'ResponseHeadersPolicy', {
      responseHeadersPolicyName: 'MyPolicy',
      comment: 'A default policy',
      corsBehavior: {
        accessControlAllowCredentials: false,
        accessControlAllowHeaders: ['X-Custom-Header-1', 'X-Custom-Header-2'],
        accessControlAllowMethods: ['GET', 'POST'],
        accessControlAllowOrigins: ['*'],
        accessControlExposeHeaders: ['X-Custom-Header-1', 'X-Custom-Header-2'],
        accessControlMaxAge: Duration.seconds(600),
        originOverride: true,
      },
      customHeadersBehavior: {
        customHeaders: [
          { header: 'X-Custom-Header-1', value: 'application/json', override: true },
          { header: 'X-Custom-Header-2', value: '0', override: false },
        ],
      },
      securityHeadersBehavior: {
        contentSecurityPolicy: { contentSecurityPolicy: 'default-src https:;', override: true },
        contentTypeOptions: { override: true },
        frameOptions: { frameOption: HeadersFrameOption.DENY, override: true },
        referrerPolicy: { referrerPolicy: HeadersReferrerPolicy.NO_REFERRER, override: true },
        strictTransportSecurity: { accessControlMaxAge: Duration.seconds(600), includeSubdomains: true, override: true },
        xssProtection: { protection: true, modeBlock: true, reportUri: 'https://example.com/csp-report', override: true },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::ResponseHeadersPolicy', {
      ResponseHeadersPolicyConfig: {
        Comment: 'A default policy',
        CorsConfig: {
          AccessControlAllowCredentials: false,
          AccessControlAllowHeaders: {
            Items: [
              'X-Custom-Header-1',
              'X-Custom-Header-2',
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
              'X-Custom-Header-1',
              'X-Custom-Header-2',
            ],
          },
          AccessControlMaxAgeSec: 600,
          OriginOverride: true,
        },
        CustomHeadersConfig: {
          Items: [
            {
              Header: 'X-Custom-Header-1',
              Override: true,
              Value: 'application/json',
            },
            {
              Header: 'X-Custom-Header-2',
              Override: false,
              Value: '0',
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

  test('it truncates long auto-generated names', () => {
    new ResponseHeadersPolicy(stack, 'AVeryLongIdThatMightSeemRidiculousButSometimesHappensInCdkPipelinesBecauseTheStageNamesConcatenatedWithTheRegionAreQuiteLongMuchLongerThanYouWouldExpect');

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::ResponseHeadersPolicy', {
      ResponseHeadersPolicyConfig: {
        Name: 'StackAVeryLongIdThatMightSeemRidiculousButSometimesHappensIntenatedWithTheRegionAreQuiteLongMuchLongerThanYouWouldExpect39083892',
      },
    });
  });
});
