import { Template } from '../../assertions';
import * as cloudwatch from '../../aws-cloudwatch';
import * as lambda from '../../aws-lambda';
import { CfnRoutingControl } from '../../aws-route53recoverycontrol';
import * as cdk from '../../core';
import { HealthCheck, HealthCheckType } from '../lib';

describe('health check', () => {
  describe('properly sets health check properties', () => {
    test.each`
      props                                                                        | expectedProps
      ${{ fqdn: 'lb.cdk.test' }}                                                   | ${{ FullyQualifiedDomainName: 'lb.cdk.test', Port: 80, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false }}
      ${{ fqdn: 'lb.cdk.test', port: 8080 }}                                       | ${{ FullyQualifiedDomainName: 'lb.cdk.test', Port: 8080, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false }}
      ${{ ipAddress: '1.2.3.4' }}                                                  | ${{ IPAddress: '1.2.3.4', Port: 80, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false }}
      ${{ ipAddress: '2001:0db8:85a3:0000:0000:abcd:0001:2345' }}                  | ${{ IPAddress: '2001:0db8:85a3:0000:0000:abcd:0001:2345', Port: 80, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false }}
      ${{ ipAddress: '1.2.3.4', fqdn: 'lb.cdk.test' }}                             | ${{ FullyQualifiedDomainName: 'lb.cdk.test', IPAddress: '1.2.3.4', Port: 80, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false }}
      ${{ fqdn: 'lb.cdk.test', resourcePath: 'health-check' }}                     | ${{ FullyQualifiedDomainName: 'lb.cdk.test', ResourcePath: 'health-check', Port: 80, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false }}
      ${{ fqdn: 'lb.cdk.test', requestInterval: cdk.Duration.seconds(20) }}        | ${{ FullyQualifiedDomainName: 'lb.cdk.test', RequestInterval: 20, Port: 80, FailureThreshold: 3, MeasureLatency: false, Inverted: false }}
      ${{ fqdn: 'lb.cdk.test', failureThreshold: 5 }}                              | ${{ FullyQualifiedDomainName: 'lb.cdk.test', FailureThreshold: 5, Port: 80, RequestInterval: 30, MeasureLatency: false, Inverted: false }}
      ${{ fqdn: 'lb.cdk.test', measureLatency: true }}                             | ${{ FullyQualifiedDomainName: 'lb.cdk.test', MeasureLatency: true, Port: 80, RequestInterval: 30, FailureThreshold: 3, Inverted: false }}
      ${{ fqdn: 'lb.cdk.test', inverted: true }}                                   | ${{ FullyQualifiedDomainName: 'lb.cdk.test', Inverted: true, Port: 80, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false }}
      ${{ fqdn: 'lb.cdk.test', regions: ['us-east-1', 'us-west-1', 'us-west-2'] }} | ${{ FullyQualifiedDomainName: 'lb.cdk.test', Port: 80, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2'] }}
    `('http health check', ({ props, expectedProps }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      new HealthCheck(stack, 'HealthCheck', {
        type: HealthCheckType.HTTP,
        ...props,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Route53::HealthCheck', {
        HealthCheckConfig: {
          Type: 'HTTP',
          ...expectedProps,
        },
      });
    });

    test.each`
      props                                                                                              | expectedProps
      ${{ fqdn: 'lb-ssl.cdk.test' }}                                                                     | ${{ FullyQualifiedDomainName: 'lb-ssl.cdk.test', Port: 443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false }}
      ${{ fqdn: 'lb-ssl.cdk.test', port: 8443 }}                                                         | ${{ FullyQualifiedDomainName: 'lb-ssl.cdk.test', Port: 8443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false }}
      ${{ ipAddress: '1.2.3.4' }}                                                                        | ${{ IPAddress: '1.2.3.4', Port: 443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false }}
      ${{ ipAddress: '2001:0db8:85a3:0000:0000:abcd:0001:2345' }}                                        | ${{ IPAddress: '2001:0db8:85a3:0000:0000:abcd:0001:2345', Port: 443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false }}
      ${{ ipAddress: '1.2.3.4', fqdn: 'lb-ssl.cdk.test' }}                                               | ${{ FullyQualifiedDomainName: 'lb-ssl.cdk.test', IPAddress: '1.2.3.4', Port: 443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false }}
      ${{ fqdn: 'lb-ssl.cdk.test', resourcePath: 'health-check' }}                                       | ${{ FullyQualifiedDomainName: 'lb-ssl.cdk.test', ResourcePath: 'health-check', Port: 443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false }}
      ${{ fqdn: 'lb-ssl.cdk.test', requestInterval: cdk.Duration.seconds(20) }}                          | ${{ FullyQualifiedDomainName: 'lb-ssl.cdk.test', RequestInterval: 20, Port: 443, EnableSNI: true, FailureThreshold: 3, MeasureLatency: false, Inverted: false }}
      ${{ fqdn: 'lb-ssl.cdk.test', failureThreshold: 5 }}                                                | ${{ FullyQualifiedDomainName: 'lb-ssl.cdk.test', FailureThreshold: 5, Port: 443, EnableSNI: true, RequestInterval: 30, MeasureLatency: false, Inverted: false }}
      ${{ fqdn: 'lb-ssl.cdk.test', measureLatency: true }}                                               | ${{ FullyQualifiedDomainName: 'lb-ssl.cdk.test', MeasureLatency: true, Port: 443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, Inverted: false }}
      ${{ fqdn: 'lb-ssl.cdk.test', inverted: true }}                                                     | ${{ FullyQualifiedDomainName: 'lb-ssl.cdk.test', Inverted: true, Port: 443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false }}
      ${{ fqdn: 'lb-ssl.cdk.test', enableSNI: true }}                                                    | ${{ FullyQualifiedDomainName: 'lb-ssl.cdk.test', EnableSNI: true, Port: 443, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false }}
      ${{ fqdn: 'lb-ssl.cdk.test', enableSNI: false, regions: ['us-east-1', 'us-west-1', 'us-west-2'] }} | ${{ FullyQualifiedDomainName: 'lb-ssl.cdk.test', EnableSNI: false, Port: 443, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2'] }}
    `('https health check', ({ props, expectedProps }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      new HealthCheck(stack, 'HealthCheck', {
        type: HealthCheckType.HTTPS,
        ...props,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Route53::HealthCheck', {
        HealthCheckConfig: {
          Type: 'HTTPS',
          ...expectedProps,
        },
      });
    });

    test.each`
      props                                                                                                                                   | expectedProps
      ${{ searchString: 'searchString', fqdn: 'lb.cdk.test' }}                                                                                | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb.cdk.test', Port: 80, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false }}
      ${{ searchString: 'searchString', fqdn: 'lb.cdk.test', port: 8080 }}                                                                    | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb.cdk.test', Port: 8080, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false }}
      ${{ searchString: 'searchString', ipAddress: '1.2.3.4' }}                                                                               | ${{ SearchString: 'searchString', IPAddress: '1.2.3.4', Port: 80, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false }}
      ${{ searchString: 'searchString', ipAddress: '2001:0db8:85a3:0000:0000:abcd:0001:2345' }}                                               | ${{ SearchString: 'searchString', IPAddress: '2001:0db8:85a3:0000:0000:abcd:0001:2345', Port: 80, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false }}
      ${{ searchString: 'searchString', ipAddress: '1.2.3.4', fqdn: 'lb.cdk.test' }}                                                          | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb.cdk.test', IPAddress: '1.2.3.4', Port: 80, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false }}
      ${{ searchString: 'searchString', fqdn: 'lb.cdk.test', resourcePath: 'health-check' }}                                                  | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb.cdk.test', ResourcePath: 'health-check', Port: 80, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false }}
      ${{ searchString: 'searchString', fqdn: 'lb.cdk.test', requestInterval: cdk.Duration.seconds(20) }}                                     | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb.cdk.test', RequestInterval: 20, Port: 80, FailureThreshold: 3, MeasureLatency: false, Inverted: false }}
      ${{ searchString: 'searchString', fqdn: 'lb.cdk.test', failureThreshold: 5 }}                                                           | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb.cdk.test', FailureThreshold: 5, Port: 80, RequestInterval: 30, MeasureLatency: false, Inverted: false }}
      ${{ searchString: 'searchString', fqdn: 'lb.cdk.test', measureLatency: true }}                                                          | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb.cdk.test', MeasureLatency: true, Port: 80, RequestInterval: 30, FailureThreshold: 3, Inverted: false }}
      ${{ searchString: 'searchString', fqdn: 'lb.cdk.test', inverted: true, regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1'] }} | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb.cdk.test', Inverted: true, Port: 80, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1'] }}
    `('http_str_match health check', ({ props, expectedProps }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      new HealthCheck(stack, 'HealthCheck', {
        type: HealthCheckType.HTTP_STR_MATCH,
        ...props,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Route53::HealthCheck', {
        HealthCheckConfig: {
          Type: 'HTTP_STR_MATCH',
          ...expectedProps,
        },
      });
    });

    test.each`
      props                                                                                                                            | expectedProps
      ${{ searchString: 'searchString', fqdn: 'lb-ssl.cdk.test' }}                                                                     | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb-ssl.cdk.test', Port: 443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false }}
      ${{ searchString: 'searchString', fqdn: 'lb-ssl.cdk.test', port: 8443 }}                                                         | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb-ssl.cdk.test', Port: 8443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false }}
      ${{ searchString: 'searchString', ipAddress: '1.2.3.4' }}                                                                        | ${{ SearchString: 'searchString', IPAddress: '1.2.3.4', Port: 443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false }}
      ${{ searchString: 'searchString', ipAddress: '2001:0db8:85a3:0000:0000:abcd:0001:2345' }}                                        | ${{ SearchString: 'searchString', IPAddress: '2001:0db8:85a3:0000:0000:abcd:0001:2345', Port: 443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false }}
      ${{ searchString: 'searchString', ipAddress: '1.2.3.4', fqdn: 'lb-ssl.cdk.test' }}                                               | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb-ssl.cdk.test', IPAddress: '1.2.3.4', Port: 443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false }}
      ${{ searchString: 'searchString', fqdn: 'lb-ssl.cdk.test', resourcePath: 'health-check' }}                                       | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb-ssl.cdk.test', ResourcePath: 'health-check', Port: 443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false }}
      ${{ searchString: 'searchString', fqdn: 'lb-ssl.cdk.test', requestInterval: cdk.Duration.seconds(20) }}                          | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb-ssl.cdk.test', RequestInterval: 20, Port: 443, EnableSNI: true, FailureThreshold: 3, MeasureLatency: false, Inverted: false }}
      ${{ searchString: 'searchString', fqdn: 'lb-ssl.cdk.test', failureThreshold: 5 }}                                                | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb-ssl.cdk.test', FailureThreshold: 5, Port: 443, EnableSNI: true, RequestInterval: 30, MeasureLatency: false, Inverted: false }}
      ${{ searchString: 'searchString', fqdn: 'lb-ssl.cdk.test', measureLatency: true }}                                               | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb-ssl.cdk.test', MeasureLatency: true, Port: 443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, Inverted: false }}
      ${{ searchString: 'searchString', fqdn: 'lb-ssl.cdk.test', inverted: true }}                                                     | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb-ssl.cdk.test', Inverted: true, Port: 443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false }}
      ${{ searchString: 'searchString', fqdn: 'lb-ssl.cdk.test', enableSNI: true }}                                                    | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb-ssl.cdk.test', EnableSNI: true, Port: 443, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false }}
      ${{ searchString: 'searchString', fqdn: 'lb-ssl.cdk.test', enableSNI: false, regions: ['us-east-1', 'us-west-1', 'us-west-2'] }} | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb-ssl.cdk.test', EnableSNI: false, Port: 443, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2'] }}
    `('https_str_match health check', ({ props, expectedProps }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      new HealthCheck(stack, 'HealthCheck', {
        type: HealthCheckType.HTTPS_STR_MATCH,
        ...props,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Route53::HealthCheck', {
        HealthCheckConfig: {
          Type: 'HTTPS_STR_MATCH',
          ...expectedProps,
        },
      });
    });

    test.each`
      props                     | expectedProps
      ${{ healthThreshold: 1 }} | ${{ HealthThreshold: 1, Inverted: false }}
      ${{ inverted: true }}     | ${{ Inverted: true, HealthThreshold: 3 }}
    `('calculated health check', ({ props, expectedProps }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      const childHealthCheck1 = new HealthCheck(stack, 'ChildHealthCheck1', {
        type: HealthCheckType.HTTP,
        fqdn: 'lb1.cdk.test',
      });

      const childHealthCheck2 = new HealthCheck(stack, 'ChildHealthCheck2', {
        type: HealthCheckType.HTTP,
        fqdn: 'lb2.cdk.test',
      });

      const childHealthCheck3 = new HealthCheck(stack, 'ChildHealthCheck3', {
        type: HealthCheckType.HTTP,
        fqdn: 'lb3.cdk.test',
      });

      new HealthCheck(stack, 'HealthCheck', {
        type: HealthCheckType.CALCULATED,
        childHealthChecks: [childHealthCheck1, childHealthCheck2, childHealthCheck3],
        ...props,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Route53::HealthCheck', {
        HealthCheckConfig: {
          Type: 'CALCULATED',
          ...expectedProps,
        },
      });
    });

    test.each`
      props                 | expectedProps
      ${{ inverted: true }} | ${{ Inverted: true }}
    `('cloudwatch metric health check', ({ props, expectedProps }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      const lambdaFunction = new lambda.Function(stack, 'LambdaFunction', {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async function(event, context) { return { statusCode: 200 }; }'),
      });

      const cloudwatchAlarm = new cloudwatch.Alarm(stack, 'Alarm', {
        metric: new cloudwatch.Metric({
          namespace: 'AWS/Lambda',
          metricName: 'Errors',
          dimensions: {
            FunctionName: lambdaFunction.functionName,
          },
          statistic: 'Sum',
        }),
        threshold: 1,
        evaluationPeriods: 1,
      });

      new HealthCheck(stack, 'HealthCheck', {
        type: HealthCheckType.CLOUDWATCH_METRIC,
        ...props,
        alarmIdentifier: {
          name: cloudwatchAlarm.alarmName,
          region: stack.region,
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Route53::HealthCheck', {
        HealthCheckConfig: {
          Type: 'CLOUDWATCH_METRIC',
          ...expectedProps,
          AlarmIdentifier: {
            Name: stack.resolve(cloudwatchAlarm.alarmName),
            Region: stack.region,
          },
        },
      });
    });

    test('routing control health check', () => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      const routingControl = new CfnRoutingControl(stack, 'RoutingControl', {
        name: 'routing-control-name',
      });

      new HealthCheck(stack, 'HealthCheck', {
        type: HealthCheckType.RECOVERY_CONTROL,
        routingControl: routingControl.attrRoutingControlArn,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Route53::HealthCheck', {
        HealthCheckConfig: {
          Type: 'RECOVERY_CONTROL',
          RoutingControlArn: stack.resolve(routingControl.attrRoutingControlArn),
        },
      });
    });
  });

  test('import health check from id', () => {
    const stack = new cdk.Stack(undefined, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const healthCheck = HealthCheck.fromHealthCheckId(stack, 'HealthCheck', 'health-check-id');

    expect(healthCheck.healthCheckId).toEqual('health-check-id');
  });

  describe('defaults', () => {
    test.each`
      type                               | props
      ${HealthCheckType.HTTP}            | ${{}}
      ${HealthCheckType.HTTPS}           | ${{}}
      ${HealthCheckType.HTTP_STR_MATCH}  | ${{ searchString: 'search' }}
      ${HealthCheckType.HTTPS_STR_MATCH} | ${{ searchString: 'search' }}
      ${HealthCheckType.TCP}             | ${{ port: 443 }}
    `('failure threshold defaults to 3', ({ type, props }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      new HealthCheck(stack, 'HealthCheck', {
        type,
        fqdn: 'lb.cdk.test',
        ...props,
        failureThreshold: undefined,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Route53::HealthCheck', {
        HealthCheckConfig: {
          FailureThreshold: 3,
        },
      });
    });

    test('health threshold defaults to number of child health checks for calculated health checks', () => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      const childHealthCheck1 = new HealthCheck(stack, 'ChildHealthCheck1', {
        type: HealthCheckType.HTTP,
        fqdn: 'lb1.cdk.test',
      });
      const childHealthCheck2 = new HealthCheck(stack, 'ChildHealthCheck2', {
        type: HealthCheckType.HTTP,
        fqdn: 'lb2.cdk.test',
      });
      const childHealthCheck3 = new HealthCheck(stack, 'ChildHealthCheck3', {
        type: HealthCheckType.HTTP,
        fqdn: 'lb3.cdk.test',
      });

      new HealthCheck(stack, 'HealthCheck1', {
        type: HealthCheckType.CALCULATED,
        childHealthChecks: [childHealthCheck1],
      });

      new HealthCheck(stack, 'HealthCheck2', {
        type: HealthCheckType.CALCULATED,
        childHealthChecks: [childHealthCheck1, childHealthCheck2],
      });

      new HealthCheck(stack, 'HealthCheck3', {
        type: HealthCheckType.CALCULATED,
        childHealthChecks: [childHealthCheck1, childHealthCheck2, childHealthCheck3],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Route53::HealthCheck', {
        HealthCheckConfig: {
          HealthThreshold: 1,
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Route53::HealthCheck', {
        HealthCheckConfig: {
          HealthThreshold: 2,
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Route53::HealthCheck', {
        HealthCheckConfig: {
          HealthThreshold: 3,
        },
      });
    });

    test.each`
      type                               | props
      ${HealthCheckType.HTTP}            | ${{}}
      ${HealthCheckType.HTTPS}           | ${{}}
      ${HealthCheckType.HTTP_STR_MATCH}  | ${{ searchString: 'search' }}
      ${HealthCheckType.HTTPS_STR_MATCH} | ${{ searchString: 'search' }}
      ${HealthCheckType.TCP}             | ${{ port: 443 }}
    `('request interval defaults to 30 seconds', ({ type, props }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      new HealthCheck(stack, 'HealthCheck', {
        type,
        ...props,
        fqdn: 'lb.cdk.test',
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Route53::HealthCheck', {
        HealthCheckConfig: {
          RequestInterval: 30,
        },
      });
    });

    test.each`
      type                               | defaultPort | props
      ${HealthCheckType.HTTP}            | ${80}       | ${{}}
      ${HealthCheckType.HTTPS}           | ${443}      | ${{}}
      ${HealthCheckType.HTTP_STR_MATCH}  | ${80}       | ${{ searchString: 'search' }}
      ${HealthCheckType.HTTPS_STR_MATCH} | ${443}      | ${{ searchString: 'search' }}
    `('port defaults to $defaultPort for $type health check', ({ type, defaultPort, props }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      new HealthCheck(stack, 'HealthCheck', {
        type,
        fqdn: 'lb.cdk.test',
        ...props,
        port: undefined,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Route53::HealthCheck', {
        HealthCheckConfig: {
          Port: defaultPort,
        },
      });
    });

    test.each`
      type                               | enableSni | props
      ${HealthCheckType.HTTPS}           | ${true}   | ${{}}
      ${HealthCheckType.HTTPS_STR_MATCH} | ${true}   | ${{ searchString: 'search' }}
    `('enableSni defaults to $enableSni for $type health check', ({ type, enableSni, props }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      new HealthCheck(stack, 'HealthCheck', {
        type,
        fqdn: 'lb-ssl.cdk.test',
        ...props,
        enableSNI: undefined,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Route53::HealthCheck', {
        HealthCheckConfig: {
          EnableSNI: enableSni,
        },
      });
    });

    test('insufficient data health check defaults to LastKnownStatus', () => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      new HealthCheck(stack, 'HealthCheck', {
        type: HealthCheckType.CLOUDWATCH_METRIC,
        alarmIdentifier: {
          name: 'alarm-name',
          region: 'us-east-1',
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Route53::HealthCheck', {
        HealthCheckConfig: {
          InsufficientDataHealthStatus: 'LastKnownStatus',
        },
      });
    });

    test.each`
      type                               | measureLatency | props
      ${HealthCheckType.HTTP}            | ${false}       | ${{ fqdn: 'lb.cdk.test' }}
      ${HealthCheckType.HTTPS}           | ${false}       | ${{ fqdn: 'lb-ssl.cdk.test' }}
      ${HealthCheckType.HTTP_STR_MATCH}  | ${false}       | ${{ fqdn: 'lb.cdk.test', searchString: 'search' }}
      ${HealthCheckType.HTTPS_STR_MATCH} | ${false}       | ${{ fqdn: 'lb-ssl.cdk.test', searchString: 'search' }}
      ${HealthCheckType.TCP}             | ${false}       | ${{ fqdn: 'lb-tcp.cdk.test' }}
    `('measure latency defaults to $measureLatency for $type health check', ({ type, measureLatency, props }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      new HealthCheck(stack, 'HealthCheck', {
        type,
        ...props,
        measureLatency: undefined,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Route53::HealthCheck', {
        HealthCheckConfig: {
          MeasureLatency: measureLatency,
        },
      });
    });

    test.each`
      type                               | props
      ${HealthCheckType.HTTP}            | ${{}}
      ${HealthCheckType.HTTPS}           | ${{}}
      ${HealthCheckType.HTTP_STR_MATCH}  | ${{ searchString: 'search' }}
      ${HealthCheckType.HTTPS_STR_MATCH} | ${{ searchString: 'search' }}
    `('resource path defaults to empty string for $type health check', ({ type, props }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      new HealthCheck(stack, 'HealthCheck', {
        type,
        fqdn: 'lb.cdk.test',
        ...props,
        resourcePath: undefined,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Route53::HealthCheck', {
        HealthCheckConfig: {
          ResourcePath: '',
        },
      });
    });

    test.each`
      type                                 | props
      ${HealthCheckType.HTTP}              | ${{ fqdn: 'lb.cdk.test' }}
      ${HealthCheckType.HTTPS}             | ${{ fqdn: 'lb-ssl.cdk.test' }}
      ${HealthCheckType.HTTP_STR_MATCH}    | ${{ fqdn: 'lb.cdk.test', searchString: 'search' }}
      ${HealthCheckType.HTTPS_STR_MATCH}   | ${{ fqdn: 'lb-ssl.cdk.test', searchString: 'search' }}
      ${HealthCheckType.TCP}               | ${{ fqdn: 'lb-tcp.cdk.test' }}
      ${HealthCheckType.CALCULATED}        | ${{ childHealthChecks: ['child1', 'child2'] }}
      ${HealthCheckType.CLOUDWATCH_METRIC} | ${{ alarmIdentifier: { name: 'alarm-name', region: 'us-east-1' } }}
      ${HealthCheckType.RECOVERY_CONTROL}  | ${{ routingControl: 'arn:aws:route53resolver:us-east-1:123456789012:routing-control/routing-control-id' }}
    `('inverted defaults to false', ({ type, props }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      new HealthCheck(stack, 'HealthCheck', {
        type,
        ...props,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Route53::HealthCheck', {
        HealthCheckConfig: {
          Inverted: false,
        },
      });
    });
  });
});
