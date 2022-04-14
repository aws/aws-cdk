import { Template } from '@aws-cdk/assertions';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import { Metric } from '@aws-cdk/aws-cloudwatch';
import { Stack } from '@aws-cdk/core';
import { DomainName, HttpApi, HttpStage } from '../../lib';

describe('HttpStage', () => {
  test('default', () => {
    const stack = new Stack();
    const api = new HttpApi(stack, 'Api', {
      createDefaultStage: false,
    });

    new HttpStage(stack, 'Stage', {
      httpApi: api,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Stage', {
      ApiId: stack.resolve(api.apiId),
      StageName: '$default',
    });
  });

  test('import', () => {
    const stack = new Stack();
    const api = new HttpApi(stack, 'Api', {
      createDefaultStage: false,
    });

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
    const stack = new Stack();
    const api = new HttpApi(stack, 'Api', {
      createDefaultStage: false,
    });

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
    const stack = new Stack();
    const api = new HttpApi(stack, 'test-api', {
      createDefaultStage: false,
    });
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
    const stack = new Stack();
    const api = new HttpApi(stack, 'test-api', {
      createDefaultStage: false,
    });
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
});

describe('HttpStage with domain mapping', () => {
  const domainName = 'example.com';
  const certArn = 'arn:aws:acm:us-east-1:111111111111:certificate';

  test('domainUrl returns the correct path', () => {
    const stack = new Stack();
    const api = new HttpApi(stack, 'Api', {
      createDefaultStage: false,
    });

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
    const stack = new Stack();
    const api = new HttpApi(stack, 'Api', {
      createDefaultStage: false,
    });

    const stage = new HttpStage(stack, 'DefaultStage', {
      httpApi: api,
    });

    const t = () => {
      stage.domainUrl;
    };

    expect(t).toThrow(/domainUrl is not available when no API mapping is associated with the Stage/);
  });

  test('correctly sets throttle settings', () => {
    // GIVEN
    const stack = new Stack();
    const api = new HttpApi(stack, 'Api', {
      createDefaultStage: false,
    });

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
});
