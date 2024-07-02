import * as cdk from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-route53-health-check');

const zone = new route53.HostedZone(stack, 'HostedZone', {
  zoneName: 'cdk.test',
});

const healthCheckHttp = new route53.HealthCheck(stack, 'HealthCheckHttp', {
  type: route53.HealthCheckType.HTTP,
  fqdn: 'lb.cdk.test',
  resourcePath: '/health',
});

new route53.ARecord(stack, 'ARecordHttp', {
  zone,
  target: route53.RecordTarget.fromValues('1.2.3.4'),
  healthCheck: healthCheckHttp,
  weight: 100,
});
new route53.ARecord(stack, 'ARecordHttp2', {
  zone,
  target: route53.RecordTarget.fromValues('5.6.7.8'),
  weight: 0,
});

const healthCheckHttps = new route53.HealthCheck(stack, 'HealthCheckHttps', {
  type: route53.HealthCheckType.HTTPS,
  fqdn: 'lb-ssl.cdk.test',
  resourcePath: '/health',
  port: 443,
});

new route53.ARecord(stack, 'ARecordHttps', {
  zone,
  recordName: '_foo',
  target: route53.RecordTarget.fromValues('1.2.3.4'),
  healthCheck: healthCheckHttps,
  weight: 100,
});
new route53.ARecord(stack, 'ARecordHttps2', {
  zone,
  recordName: '_foo',
  target: route53.RecordTarget.fromValues('5.6.7.8'),
  weight: 0,
});

const healthCheckTcp = new route53.HealthCheck(stack, 'HealthCheckTcp', {
  type: route53.HealthCheckType.TCP,
  fqdn: 'lb-tcp.cdk.test',
  port: 443,
});

new route53.ARecord(stack, 'ARecordTcp', {
  zone,
  recordName: '_bar',
  target: route53.RecordTarget.fromValues('1.2.3.4'),
  healthCheck: healthCheckTcp,
  weight: 100,
});
new route53.ARecord(stack, 'ARecordTcp2', {
  zone,
  recordName: '_bar',
  target: route53.RecordTarget.fromValues('5.6.7.8'),
  weight: 0,
});

new IntegTest(app, 'integ-test', {
  testCases: [stack],
  diffAssets: true,
  enableLookups: true,
});
