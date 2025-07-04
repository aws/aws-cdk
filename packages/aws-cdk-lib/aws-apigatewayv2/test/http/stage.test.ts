import { Template } from '../../../assertions';
import * as apigateway from '../../../aws-apigateway';
import { Certificate } from '../../../aws-certificatemanager';
import { Metric } from '../../../aws-cloudwatch';
import * as logs from '../../../aws-logs';
import { Lazy, Stack } from '../../../core';
import { DomainName, HttpApi, HttpStage, LogGroupLogDestination } from '../../lib';

let stack: Stack;
let api: HttpApi;

beforeEach(() => {
  stack = new Stack();
  api = new HttpApi(stack, 'Api', {
    createDefaultStage: false,
  });
});

describe('HttpStage', () => {
  test('default', () => {
    new HttpStage(stack, 'Stage', {
      httpApi: api,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Stage', {
      ApiId: stack.resolve(api.apiId),
      StageName: '$default',
    });
  });

  test('import', () => {
    const stage = new HttpStage(stack, 'Stage', {
      httpApi: api,
    });

    const imported = HttpStage.fromHttpStageAttributes(stack, 'Import', {
      stageName: stage.stageName,
      api,
    });

    expect(imported.stageName).toEqual(stage.stageName);
  });

  test('url returns the correct path', () => {
    const defaultStage = new HttpStage(stack, 'DefaultStage', {
      httpApi: api,
    });

    const betaStage = new HttpStage(stack, 'BetaStage', {
      httpApi: api,
      stageName: 'beta',
    });

    expect(defaultStage.url.endsWith('/')).toBe(true);
    expect(betaStage.url.endsWith('/')).toBe(false);
  });

  test('get metric', () => {
    // GIVEN
    const stage = new HttpStage(stack, 'Stage', {
      httpApi: api,
    });
    const metricName = '4xx';
    const statistic = 'Sum';
    const apiId = api.apiId;

    // WHEN
    const countMetric = stage.metric(metricName, { statistic });

    // THEN
    expect(countMetric.namespace).toEqual('AWS/ApiGateway');
    expect(countMetric.metricName).toEqual(metricName);
    expect(countMetric.dimensions).toEqual({
      ApiId: apiId,
      Stage: '$default',
    });
    expect(countMetric.statistic).toEqual(statistic);
  });

  test('Exercise metrics', () => {
    // GIVEN
    const stage = new HttpStage(stack, 'Stage', {
      httpApi: api,
    });
    const color = '#00ff00';
    const apiId = api.apiId;

    // WHEN
    const metrics = new Array<Metric>();
    metrics.push(stage.metricClientError({ color }));
    metrics.push(stage.metricServerError({ color }));
    metrics.push(stage.metricDataProcessed({ color }));
    metrics.push(stage.metricLatency({ color }));
    metrics.push(stage.metricIntegrationLatency({ color }));
    metrics.push(stage.metricCount({ color }));
    // THEN
    for (const metric of metrics) {
      expect(metric.namespace).toEqual('AWS/ApiGateway');
      expect(metric.dimensions).toEqual({
        ApiId: apiId,
        Stage: '$default',
      });
      expect(metric.color).toEqual(color);
    }
    const metricNames = metrics.map(m => m.metricName);
    expect(metricNames).toEqual(['4xx', '5xx', 'DataProcessed', 'Latency', 'IntegrationLatency', 'Count']);
  });

  test('if only the custom log destination log group is set', () => {
    // WHEN
    const testLogGroup = new logs.LogGroup(stack, 'LogGroup');
    new HttpStage(stack, 'my-stage', {
      httpApi: api,
      accessLogSettings: {
        destination: new LogGroupLogDestination(testLogGroup),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Stage', {
      AccessLogSettings: {
        DestinationArn: {
          'Fn::GetAtt': [
            'LogGroupF5B46931',
            'Arn',
          ],
        },
        Format: '$context.identity.sourceIp $context.identity.caller $context.identity.user [$context.requestTime] "$context.httpMethod $context.resourcePath $context.protocol" $context.status $context.responseLength $context.requestId',
      },
    });
  });

  test('if the custom log destination log group and format is set', () => {
    // WHEN
    const testLogGroup = new logs.LogGroup(stack, 'LogGroup');
    const testFormat = apigateway.AccessLogFormat.jsonWithStandardFields();
    new HttpStage(stack, 'my-stage', {
      httpApi: api,
      accessLogSettings: {
        destination: new LogGroupLogDestination(testLogGroup),
        format: testFormat,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Stage', {
      AccessLogSettings: {
        DestinationArn: {
          'Fn::GetAtt': [
            'LogGroupF5B46931',
            'Arn',
          ],
        },
        Format: '{"requestId":"$context.requestId","ip":"$context.identity.sourceIp","user":"$context.identity.user","caller":"$context.identity.caller","requestTime":"$context.requestTime","httpMethod":"$context.httpMethod","resourcePath":"$context.resourcePath","status":"$context.status","protocol":"$context.protocol","responseLength":"$context.responseLength"}',
      },
    });
  });

  describe('access log check', () => {
    test('fails when access log format does not contain `contextRequestId()` or `contextExtendedRequestId()', () => {
      // WHEN
      const testLogGroup = new logs.LogGroup(stack, 'LogGroup');
      const testFormat = apigateway.AccessLogFormat.custom('');

      // THEN
      expect(() => new HttpStage(stack, 'my-stage', {
        httpApi: api,
        accessLogSettings: {
          destination: new LogGroupLogDestination(testLogGroup),
          format: testFormat,
        },
      })).toThrow('Access log must include either `AccessLogFormat.contextRequestId()` or `AccessLogFormat.contextExtendedRequestId()`');
    });

    test('succeeds when access log format contains `contextRequestId()`', () => {
      // WHEN
      const testLogGroup = new logs.LogGroup(stack, 'LogGroup');
      const testFormat = apigateway.AccessLogFormat.custom(JSON.stringify({
        requestId: apigateway.AccessLogField.contextRequestId(),
      }));

      // THEN
      expect(() => new HttpStage(stack, 'my-stage', {
        httpApi: api,
        accessLogSettings: {
          destination: new LogGroupLogDestination(testLogGroup),
          format: testFormat,
        },
      })).not.toThrow();
    });

    test('succeeds when access log format contains `contextExtendedRequestId()`', () => {
      // WHEN
      const testLogGroup = new logs.LogGroup(stack, 'LogGroup');
      const testFormat = apigateway.AccessLogFormat.custom(JSON.stringify({
        extendedRequestId: apigateway.AccessLogField.contextExtendedRequestId(),
      }));

      // THEN
      expect(() => new HttpStage(stack, 'my-stage', {
        httpApi: api,
        accessLogSettings: {
          destination: new LogGroupLogDestination(testLogGroup),
          format: testFormat,
        },
      })).not.toThrow();
    });

    test('succeeds when access log format contains both `contextRequestId()` and `contextExtendedRequestId`', () => {
      // WHEN
      const testLogGroup = new logs.LogGroup(stack, 'LogGroup');
      const testFormat = apigateway.AccessLogFormat.custom(JSON.stringify({
        requestId: apigateway.AccessLogField.contextRequestId(),
        extendedRequestId: apigateway.AccessLogField.contextExtendedRequestId(),
      }));

      // THEN
      expect(() => new HttpStage(stack, 'my-stage', {
        httpApi: api,
        accessLogSettings: {
          destination: new LogGroupLogDestination(testLogGroup),
          format: testFormat,
        },
      })).not.toThrow();
    });

    test('fails when access log format contains `contextRequestIdXxx`', () => {
      // WHEN
      const testLogGroup = new logs.LogGroup(stack, 'LogGroup');
      const testFormat = apigateway.AccessLogFormat.custom(JSON.stringify({
        requestIdXxx: '$context.requestIdXxx',
      }));

      // THEN
      expect(() => new HttpStage(stack, 'my-stage', {
        httpApi: api,
        accessLogSettings: {
          destination: new LogGroupLogDestination(testLogGroup),
          format: testFormat,
        },
      })).toThrow('Access log must include either `AccessLogFormat.contextRequestId()` or `AccessLogFormat.contextExtendedRequestId()`');
    });

    test('does not fail when access log format is a token', () => {
      // WHEN
      const testLogGroup = new logs.LogGroup(stack, 'LogGroup');
      const testFormat = apigateway.AccessLogFormat.custom(Lazy.string({ produce: () => 'test' }));

      // THEN
      expect(() => new HttpStage(stack, 'my-stage', {
        httpApi: api,
        accessLogSettings: {
          destination: new LogGroupLogDestination(testLogGroup),
          format: testFormat,
        },
      })).not.toThrow();
    });
  });
  test('can add stage variables after creation', () => {
    // WHEN
    const stage = new HttpStage(stack, 'DefaultStage', {
      httpApi: api,
      stageVariables: {
        env: 'prod',
      },
    });

    stage.addStageVariable('timeout', '300');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Stage', {
      ApiId: stack.resolve(api.apiId),
      StageName: '$default',
      StageVariables: {
        env: 'prod',
        timeout: '300',
      },
    });
  });
});

describe('HttpStage with domain mapping', () => {
  const domainName = 'example.com';
  const certArn = 'arn:aws:acm:us-east-1:111111111111:certificate';

  test('domainUrl returns the correct path', () => {
    const dn = new DomainName(stack, 'DN', {
      domainName,
      certificate: Certificate.fromCertificateArn(stack, 'cert', certArn),
    });

    const stage = new HttpStage(stack, 'DefaultStage', {
      httpApi: api,
      domainMapping: {
        domainName: dn,
      },
    });

    expect(stack.resolve(stage.domainUrl)).toEqual({
      'Fn::Join': ['', [
        'https://', { Ref: 'DNFDC76583' }, '/',
      ]],
    });
  });

  test('domainUrl throws error if domainMapping is not configured', () => {
    const stage = new HttpStage(stack, 'DefaultStage', {
      httpApi: api,
    });

    const t = () => {
      stage.domainUrl;
    };

    expect(t).toThrow(/domainUrl is not available when no API mapping is associated with the Stage/);
  });

  test('correctly sets throttle settings', () => {
    // WHEN
    new HttpStage(stack, 'DefaultStage', {
      httpApi: api,
      throttle: {
        burstLimit: 1000,
        rateLimit: 1000,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Stage', {
      ApiId: stack.resolve(api.apiId),
      StageName: '$default',
      DefaultRouteSettings: {
        ThrottlingBurstLimit: 1000,
        ThrottlingRateLimit: 1000,
      },
    });
  });

  test('correctly sets details metrics settings', () => {
    // WHEN
    new HttpStage(stack, 'DefaultStage', {
      httpApi: api,
      detailedMetricsEnabled: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Stage', {
      ApiId: stack.resolve(api.apiId),
      StageName: '$default',
      DefaultRouteSettings: {
        DetailedMetricsEnabled: true,
      },
    });
  });

  test('correctly sets route settings', () => {
    // WHEN
    new HttpStage(stack, 'DefaultStage', {
      httpApi: api,
      throttle: {
        burstLimit: 1000,
        rateLimit: 1000,
      },
      detailedMetricsEnabled: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Stage', {
      ApiId: stack.resolve(api.apiId),
      StageName: '$default',
      DefaultRouteSettings: {
        ThrottlingBurstLimit: 1000,
        ThrottlingRateLimit: 1000,
        DetailedMetricsEnabled: true,
      },
    });
  });

  test('specify description', () => {
    // WHEN
    new HttpStage(stack, 'DefaultStage', {
      httpApi: api,
      description: 'My Stage',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Stage', {
      Description: 'My Stage',
    });
  });
});
