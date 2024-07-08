import { Template } from '../../assertions';
import * as cloudwatch from '../../aws-cloudwatch';
import * as lambda from '../../aws-lambda';
import { CfnRoutingControl } from '../../aws-route53recoverycontrol';
import * as cdk from '../../core';
import { HealthCheck, HealthCheckProps, HealthCheckType } from '../lib';

describe('health check', () => {
  describe('properly sets health check properties', () => {
    test.each`
      props                                                                        | expectedProps
      ${{ fqdn: 'lb.cdk.test' }}                                                   | ${{ FullyQualifiedDomainName: 'lb.cdk.test', Port: 80, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ fqdn: 'lb.cdk.test', port: 8080 }}                                       | ${{ FullyQualifiedDomainName: 'lb.cdk.test', Port: 8080, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ ipAddress: '1.2.3.4' }}                                                  | ${{ IPAddress: '1.2.3.4', Port: 80, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ ipAddress: '2001:0db8:85a3:0000:0000:abcd:0001:2345' }}                  | ${{ IPAddress: '2001:0db8:85a3:0000:0000:abcd:0001:2345', Port: 80, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ ipAddress: '1.2.3.4', fqdn: 'lb.cdk.test' }}                             | ${{ FullyQualifiedDomainName: 'lb.cdk.test', IPAddress: '1.2.3.4', Port: 80, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ fqdn: 'lb.cdk.test', resourcePath: 'health-check' }}                     | ${{ FullyQualifiedDomainName: 'lb.cdk.test', ResourcePath: 'health-check', Port: 80, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ fqdn: 'lb.cdk.test', requestInterval: cdk.Duration.seconds(20) }}        | ${{ FullyQualifiedDomainName: 'lb.cdk.test', RequestInterval: 20, Port: 80, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ fqdn: 'lb.cdk.test', failureThreshold: 5 }}                              | ${{ FullyQualifiedDomainName: 'lb.cdk.test', FailureThreshold: 5, Port: 80, RequestInterval: 30, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ fqdn: 'lb.cdk.test', measureLatency: true }}                             | ${{ FullyQualifiedDomainName: 'lb.cdk.test', MeasureLatency: true, Port: 80, RequestInterval: 30, FailureThreshold: 3, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ fqdn: 'lb.cdk.test', inverted: true }}                                   | ${{ FullyQualifiedDomainName: 'lb.cdk.test', Inverted: true, Port: 80, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
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
      ${{ fqdn: 'lb-ssl.cdk.test' }}                                                                     | ${{ FullyQualifiedDomainName: 'lb-ssl.cdk.test', Port: 443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ fqdn: 'lb-ssl.cdk.test', port: 8443 }}                                                         | ${{ FullyQualifiedDomainName: 'lb-ssl.cdk.test', Port: 8443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ ipAddress: '1.2.3.4' }}                                                                        | ${{ IPAddress: '1.2.3.4', Port: 443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ ipAddress: '2001:0db8:85a3:0000:0000:abcd:0001:2345' }}                                        | ${{ IPAddress: '2001:0db8:85a3:0000:0000:abcd:0001:2345', Port: 443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ ipAddress: '1.2.3.4', fqdn: 'lb-ssl.cdk.test' }}                                               | ${{ FullyQualifiedDomainName: 'lb-ssl.cdk.test', IPAddress: '1.2.3.4', Port: 443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ fqdn: 'lb-ssl.cdk.test', resourcePath: 'health-check' }}                                       | ${{ FullyQualifiedDomainName: 'lb-ssl.cdk.test', ResourcePath: 'health-check', Port: 443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ fqdn: 'lb-ssl.cdk.test', requestInterval: cdk.Duration.seconds(20) }}                          | ${{ FullyQualifiedDomainName: 'lb-ssl.cdk.test', RequestInterval: 20, Port: 443, EnableSNI: true, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ fqdn: 'lb-ssl.cdk.test', failureThreshold: 5 }}                                                | ${{ FullyQualifiedDomainName: 'lb-ssl.cdk.test', FailureThreshold: 5, Port: 443, EnableSNI: true, RequestInterval: 30, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ fqdn: 'lb-ssl.cdk.test', measureLatency: true }}                                               | ${{ FullyQualifiedDomainName: 'lb-ssl.cdk.test', MeasureLatency: true, Port: 443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ fqdn: 'lb-ssl.cdk.test', inverted: true }}                                                     | ${{ FullyQualifiedDomainName: 'lb-ssl.cdk.test', Inverted: true, Port: 443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ fqdn: 'lb-ssl.cdk.test', enableSNI: true }}                                                    | ${{ FullyQualifiedDomainName: 'lb-ssl.cdk.test', EnableSNI: true, Port: 443, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
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
      ${{ searchString: 'searchString', fqdn: 'lb.cdk.test' }}                                                                                | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb.cdk.test', Port: 80, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ searchString: 'searchString', fqdn: 'lb.cdk.test', port: 8080 }}                                                                    | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb.cdk.test', Port: 8080, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ searchString: 'searchString', ipAddress: '1.2.3.4' }}                                                                               | ${{ SearchString: 'searchString', IPAddress: '1.2.3.4', Port: 80, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ searchString: 'searchString', ipAddress: '2001:0db8:85a3:0000:0000:abcd:0001:2345' }}                                               | ${{ SearchString: 'searchString', IPAddress: '2001:0db8:85a3:0000:0000:abcd:0001:2345', Port: 80, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ searchString: 'searchString', ipAddress: '1.2.3.4', fqdn: 'lb.cdk.test' }}                                                          | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb.cdk.test', IPAddress: '1.2.3.4', Port: 80, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ searchString: 'searchString', fqdn: 'lb.cdk.test', resourcePath: 'health-check' }}                                                  | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb.cdk.test', ResourcePath: 'health-check', Port: 80, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ searchString: 'searchString', fqdn: 'lb.cdk.test', requestInterval: cdk.Duration.seconds(20) }}                                     | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb.cdk.test', RequestInterval: 20, Port: 80, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ searchString: 'searchString', fqdn: 'lb.cdk.test', failureThreshold: 5 }}                                                           | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb.cdk.test', FailureThreshold: 5, Port: 80, RequestInterval: 30, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ searchString: 'searchString', fqdn: 'lb.cdk.test', measureLatency: true }}                                                          | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb.cdk.test', MeasureLatency: true, Port: 80, RequestInterval: 30, FailureThreshold: 3, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
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
      ${{ searchString: 'searchString', fqdn: 'lb-ssl.cdk.test' }}                                                                     | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb-ssl.cdk.test', Port: 443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ searchString: 'searchString', fqdn: 'lb-ssl.cdk.test', port: 8443 }}                                                         | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb-ssl.cdk.test', Port: 8443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ searchString: 'searchString', ipAddress: '1.2.3.4' }}                                                                        | ${{ SearchString: 'searchString', IPAddress: '1.2.3.4', Port: 443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ searchString: 'searchString', ipAddress: '2001:0db8:85a3:0000:0000:abcd:0001:2345' }}                                        | ${{ SearchString: 'searchString', IPAddress: '2001:0db8:85a3:0000:0000:abcd:0001:2345', Port: 443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ searchString: 'searchString', ipAddress: '1.2.3.4', fqdn: 'lb-ssl.cdk.test' }}                                               | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb-ssl.cdk.test', IPAddress: '1.2.3.4', Port: 443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ searchString: 'searchString', fqdn: 'lb-ssl.cdk.test', resourcePath: 'health-check' }}                                       | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb-ssl.cdk.test', ResourcePath: 'health-check', Port: 443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ searchString: 'searchString', fqdn: 'lb-ssl.cdk.test', requestInterval: cdk.Duration.seconds(20) }}                          | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb-ssl.cdk.test', RequestInterval: 20, Port: 443, EnableSNI: true, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ searchString: 'searchString', fqdn: 'lb-ssl.cdk.test', failureThreshold: 5 }}                                                | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb-ssl.cdk.test', FailureThreshold: 5, Port: 443, EnableSNI: true, RequestInterval: 30, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ searchString: 'searchString', fqdn: 'lb-ssl.cdk.test', measureLatency: true }}                                               | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb-ssl.cdk.test', MeasureLatency: true, Port: 443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ searchString: 'searchString', fqdn: 'lb-ssl.cdk.test', inverted: true }}                                                     | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb-ssl.cdk.test', Inverted: true, Port: 443, EnableSNI: true, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
      ${{ searchString: 'searchString', fqdn: 'lb-ssl.cdk.test', enableSNI: true }}                                                    | ${{ SearchString: 'searchString', FullyQualifiedDomainName: 'lb-ssl.cdk.test', EnableSNI: true, Port: 443, RequestInterval: 30, FailureThreshold: 3, MeasureLatency: false, Inverted: false, Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'] }}
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
      type                               | props
      ${HealthCheckType.HTTP}            | ${{ fqdn: 'lb.cdk.test' }}
      ${HealthCheckType.HTTPS}           | ${{ fqdn: 'lb-ssl.cdk.test' }}
      ${HealthCheckType.HTTP_STR_MATCH}  | ${{ fqdn: 'lb.cdk.test', searchString: 'search' }}
      ${HealthCheckType.HTTPS_STR_MATCH} | ${{ fqdn: 'lb-ssl.cdk.test', searchString: 'search' }}
      ${HealthCheckType.TCP}             | ${{ fqdn: 'lb-tcp.cdk.test' }}
    `('regions defaults to all regions', () => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      new HealthCheck(stack, 'HealthCheck', {
        type: HealthCheckType.HTTP,
        fqdn: 'lb.cdk.test',
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Route53::HealthCheck', {
        HealthCheckConfig: {
          Regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'],
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

  describe('properties validation', () => {
    test.each([undefined, []])('calculated health check requires child health checks', (childHealthChecks) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck1', {
          type: HealthCheckType.CALCULATED,
          childHealthChecks,
        });
      }).toThrow(/ChildHealthChecks is required for health check type: CALCULATED/);
    });

    test.each`
      type                                 | props
      ${HealthCheckType.HTTP}              | ${{}}
      ${HealthCheckType.HTTPS}             | ${{}}
      ${HealthCheckType.HTTP_STR_MATCH}    | ${{ searchString: 'search' }}
      ${HealthCheckType.HTTPS_STR_MATCH}   | ${{ searchString: 'search' }}
      ${HealthCheckType.TCP}               | ${{}}
      ${HealthCheckType.CLOUDWATCH_METRIC} | ${{ alarmIdentifier: { name: 'alarm-name', region: 'us-east-1' } }}
      ${HealthCheckType.RECOVERY_CONTROL}  | ${{ routingControl: 'arn:aws:route53resolver:us-east-1:123456789012:routing-control/routing-control-id' }}
    `('child health checks are not allowed for $type health check', ({ type, props }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type,
          ...props,
          childHealthChecks: ['child1', 'child2'],
        });
      }).toThrow(/ChildHealthChecks is only supported for health check type:/);
    });

    test('health threshold is allowed for calculated health checks', () => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      const childHealthCheck = new HealthCheck(stack, 'ChildHealthCheck', {
        type: HealthCheckType.HTTP,
        fqdn: 'lb.cdk.test',
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type: HealthCheckType.CALCULATED,
          childHealthChecks: [childHealthCheck],
          healthThreshold: 1,
        });
      }).not.toThrow();
    });

    test.each`
      type                                 | props
      ${HealthCheckType.HTTP}              | ${{}}
      ${HealthCheckType.HTTPS}             | ${{}}
      ${HealthCheckType.HTTP_STR_MATCH}    | ${{ searchString: 'search' }}
      ${HealthCheckType.HTTPS_STR_MATCH}   | ${{ searchString: 'search' }}
      ${HealthCheckType.TCP}               | ${{}}
      ${HealthCheckType.CLOUDWATCH_METRIC} | ${{ alarmIdentifier: { name: 'alarm-name', region: 'us-east-1' } }}
      ${HealthCheckType.RECOVERY_CONTROL}  | ${{ routingControl: 'arn:aws:route53resolver:us-east-1:123456789012:routing-control/routing-control-id' }}
    `('health threshold is not allowed for $type health check', ({ type, props }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type,
          ...props,
          healthThreshold: 1,
        });
      }).toThrow(/HealthThreshold is not supported for health check type:/);
    });

    test.each([HealthCheckType.HTTP_STR_MATCH, HealthCheckType.HTTPS_STR_MATCH])(
      'http_str_match and https_str_match require search string',
      (type) => {
        const stack = new cdk.Stack(undefined, 'TestStack', {
          env: { account: '123456789012', region: 'us-east-1' },
        });

        expect(() => {
          new HealthCheck(stack, 'HttpStrMatchHealthCheck', {
            type,
          });
        }).toThrow(/SearchString is required for health check type:/);
      },
    );

    test.each(['', 'a'.repeat(256)])(
      'http_str_match and https_str_match require search string length between 1 and 255 characters long',
      (searchString) => {
        const stack = new cdk.Stack(undefined, 'TestStack', {
          env: { account: '123456789012', region: 'us-east-1' },
        });

        expect(() => {
          new HealthCheck(stack, 'HttpStrMatchHealthCheck', {
            type: HealthCheckType.HTTP_STR_MATCH,
            searchString,
          });
        }).toThrow(/SearchString must be between 1 and 255 characters long/);
      },
    );

    test.each`
      type                                 | props
      ${HealthCheckType.HTTP}              | ${{}}
      ${HealthCheckType.HTTPS}             | ${{}}
      ${HealthCheckType.TCP}               | ${{}}
      ${HealthCheckType.CALCULATED}        | ${{ childHealthChecks: ['child1', 'child2'] }}
      ${HealthCheckType.CLOUDWATCH_METRIC} | ${{ alarmIdentifier: { name: 'alarm-name', region: 'us-east-1' } }}
      ${HealthCheckType.RECOVERY_CONTROL}  | ${{ routingControl: 'arn:aws:route53resolver:us-east-1:123456789012:routing-control/routing-control-id' }}
    `('search string is not supported for $type health check', ({ type, props }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type,
          ...props,
          searchString: 'search',
        });
      }).toThrow(/SearchString is only supported for health check types: HTTP_STR_MATCH, HTTPS_STR_MATCH/);
    });

    test('recovery control requires routing control', () => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'RecoveryControlHealthCheck', {
          type: HealthCheckType.RECOVERY_CONTROL,
        });
      }).toThrow(/RoutingControl is required for health check type: RECOVERY_CONTROL/);
    });

    test.each`
      type                                 | props
      ${HealthCheckType.HTTP}              | ${{}}
      ${HealthCheckType.HTTPS}             | ${{}}
      ${HealthCheckType.HTTP_STR_MATCH}    | ${{ searchString: 'search' }}
      ${HealthCheckType.HTTPS_STR_MATCH}   | ${{ searchString: 'search' }}
      ${HealthCheckType.TCP}               | ${{}}
      ${HealthCheckType.CALCULATED}        | ${{ childHealthChecks: ['child1', 'child2'] }}
      ${HealthCheckType.CLOUDWATCH_METRIC} | ${{ alarmIdentifier: { name: 'alarm-name', region: 'us-east-1' } }}
    `('recovery control is not supported for $type health check', ({ type, props }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type,
          ...props,
          routingControl: 'arn:aws:route53resolver:us-east-1:123456789012:routing-control/routing-control-id',
        });
      }).toThrow(/RoutingControl is not supported for health check type:/);
    });

    test('fqdn max length is 255 characters', () => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type: HealthCheckType.HTTP,
          fqdn: 'a'.repeat(256),
        });
      }).toThrow(/FQDN must be between 0 and 255 characters long/);
    });

    test.each`
      type                               | props
      ${HealthCheckType.HTTP}            | ${{}}
      ${HealthCheckType.HTTPS}           | ${{}}
      ${HealthCheckType.HTTP_STR_MATCH}  | ${{ searchString: 'search' }}
      ${HealthCheckType.HTTPS_STR_MATCH} | ${{ searchString: 'search' }}
      ${HealthCheckType.TCP}             | ${{}}
    `('failure threshold is allowed for $type health check', ({ type, props }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type,
          fqdn: 'lb.cdk.test',
          ...props,
          failureThreshold: 5,
        });
      }).not.toThrow();
    });

    test.each`
      type                                 | props
      ${HealthCheckType.CALCULATED}        | ${{ childHealthChecks: ['child1', 'child2'] }}
      ${HealthCheckType.CLOUDWATCH_METRIC} | ${{ alarmIdentifier: { name: 'alarm-name', region: 'us-east-1' } }}
      ${HealthCheckType.RECOVERY_CONTROL}  | ${{ routingControl: 'arn:aws:route53resolver:us-east-1:123456789012:routing-control/routing-control-id' }}
    `('failure threshold is not allowed for $type health check', ({ type, props }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type,
          ...props,
          failureThreshold: 5,
        });
      }).toThrow(/FailureThreshold is not supported for health check type:/);
    });

    test.each([0, 11])('failure threshold must be between 1 and 10', (threshold) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type: HealthCheckType.HTTP,
          fqdn: 'lb.cdk.test',
          failureThreshold: threshold,
        });
      }).toThrow(/FailureThreshold must be between 1 and 10/);
    });

    test.each`
      type                               | props
      ${HealthCheckType.HTTP}            | ${{}}
      ${HealthCheckType.HTTPS}           | ${{}}
      ${HealthCheckType.HTTP_STR_MATCH}  | ${{ searchString: 'search' }}
      ${HealthCheckType.HTTPS_STR_MATCH} | ${{ searchString: 'search' }}
      ${HealthCheckType.TCP}             | ${{}}
    `('request interval is allowed for $type health check', ({ type, props }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type,
          ...props,
          fqdn: 'lb.cdk.test',
          requestInterval: cdk.Duration.seconds(20),
        });
      }).not.toThrow();
    });

    test.each`
      type                                 | props
      ${HealthCheckType.CALCULATED}        | ${{ childHealthChecks: ['child1', 'child2'] }}
      ${HealthCheckType.CLOUDWATCH_METRIC} | ${{ alarmIdentifier: { name: 'alarm-name', region: 'us-east-1' } }}
      ${HealthCheckType.RECOVERY_CONTROL}  | ${{ routingControl: 'arn:aws:route53resolver:us-east-1:123456789012:routing-control/routing-control-id' }}
    `('request interval is not allowed for $type health check', ({ type, props }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type,
          ...props,
          requestInterval: cdk.Duration.seconds(20),
        });
      }).toThrow(/RequestInterval is not supported for health check type:/);
    });

    test.each([cdk.Duration.seconds(0), cdk.Duration.seconds(31)])('request interval must be between 10 and 30 seconds', (interval) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type: HealthCheckType.HTTP,
          fqdn: 'lb.cdk.test',
          requestInterval: interval,
        });
      }).toThrow(/RequestInterval must be between 10 and 30 seconds/);
    });

    test.each`
      type                               | props
      ${HealthCheckType.HTTP}            | ${{}}
      ${HealthCheckType.HTTPS}           | ${{}}
      ${HealthCheckType.HTTP_STR_MATCH}  | ${{ searchString: 'search' }}
      ${HealthCheckType.HTTPS_STR_MATCH} | ${{ searchString: 'search' }}
      ${HealthCheckType.TCP}             | ${{}}
    `('port is allowed for $type health check', ({ type, props }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type,
          fqdn: 'lb.cdk.test',
          ...props,
          port: 80,
        });
      }).not.toThrow();
    });

    test.each`
      type                                 | props
      ${HealthCheckType.CALCULATED}        | ${{ childHealthChecks: ['child1', 'child2'] }}
      ${HealthCheckType.CLOUDWATCH_METRIC} | ${{ alarmIdentifier: { name: 'alarm-name', region: 'us-east-1' } }}
      ${HealthCheckType.RECOVERY_CONTROL}  | ${{ routingControl: 'arn:aws:route53resolver:us-east-1:123456789012:routing-control/routing-control-id' }}
    `('port is not allowed for $type health check', ({ type, props }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type,
          ...props,
          port: 80,
        });
      }).toThrow(/Port is not supported for health check type:/);
    });

    test('alaram identifier is required for CLOUDWATCH_METRIC health checks', () => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type: HealthCheckType.CLOUDWATCH_METRIC,
        });
      }).toThrow(/AlarmIdentifier is required for health check type: CLOUDWATCH_METRIC/);
    });

    test.each`
      type                                | props
      ${HealthCheckType.HTTP}             | ${{}}
      ${HealthCheckType.HTTPS}            | ${{}}
      ${HealthCheckType.HTTP_STR_MATCH}   | ${{}}
      ${HealthCheckType.HTTPS_STR_MATCH}  | ${{}}
      ${HealthCheckType.TCP}              | ${{}}
      ${HealthCheckType.CALCULATED}       | ${{ childHealthChecks: ['child1', 'child2'] }}
      ${HealthCheckType.RECOVERY_CONTROL} | ${{}}
    `('alarm identifier is not supported for $type', ({ type, props }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type,
          ...props,
          alarmIdentifier: {
            name: 'alarm-name',
            region: 'us-east-1',
          },
        });
      }).toThrow(/AlarmIdentifier is not supported for health check type:/);
    });

    test.each`
      type                              | props
      ${HealthCheckType.HTTP}           | ${{ ipAddress: '' }}
      ${HealthCheckType.HTTP_STR_MATCH} | ${{ ipAddress: '', searchString: 'search' }}
      ${HealthCheckType.TCP}            | ${{ ipAddress: '' }}
      ${HealthCheckType.HTTP}           | ${{ ipAddress: 'invalid' }}
      ${HealthCheckType.HTTP}           | ${{ ipAddress: '1.2.3' }}
      ${HealthCheckType.HTTPS}          | ${{ ipAddress: '1.2' }}
      ${HealthCheckType.HTTP_STR_MATCH} | ${{ ipAddress: '1', searchString: 'search' }}
      ${HealthCheckType.HTTP}           | ${{ ipAddress: '2001:' }}
      ${HealthCheckType.TCP}            | ${{ ipAddress: '2001:::::::7334' }}
    `('validates IP address for TCP health checks, ip address: $props.ipAddress', ({ type, props }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type,
          ...props,
        });
      }).toThrow(/IpAddress must be a valid IPv4 or IPv6 address/);
    });

    test.each`
      type                               | props
      ${HealthCheckType.HTTP}            | ${{}}
      ${HealthCheckType.HTTPS}           | ${{}}
      ${HealthCheckType.HTTP_STR_MATCH}  | ${{ searchString: 'search' }}
      ${HealthCheckType.HTTPS_STR_MATCH} | ${{ searchString: 'search' }}
      ${HealthCheckType.TCP}             | ${{}}
    `('regions is allowed for $type health check', ({ type, props }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type,
          ...props,
          fqdn: 'lb.cdk.test',
          regions: ['us-east-1', 'us-west-1', 'us-west-2'],
        });
      }).not.toThrow();
    });

    test.each`
      type                                 | props
      ${HealthCheckType.CALCULATED}        | ${{ childHealthChecks: ['child1', 'child2'] }}
      ${HealthCheckType.CLOUDWATCH_METRIC} | ${{ alarmIdentifier: { name: 'alarm-name', region: 'us-east-1' } }}
      ${HealthCheckType.RECOVERY_CONTROL}  | ${{ routingControl: 'arn:aws:route53resolver:us-east-1:123456789012:routing-control/routing-control-id' }}
    `('regions is not allowed for $type health check', ({ type, props }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type,
          ...props,
          regions: ['us-east-1'],
        });
      }).toThrow(/Regions is not supported for health check type:/);
    });

    test.each`
      regions
      ${['us-east-1', 'us-east-1', 'us-west-1']}
      ${['us-east-1', 'us-west-1']}
      ${['us-east-1']}
      ${[]}
    `('regions must be a list of at least three regions', ({ regions }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type: HealthCheckType.HTTP,
          fqdn: 'lb.cdk.test',
          regions,
        });
      }).toThrow(/Regions must be a list of at least three regions/);
    });
  });
});
