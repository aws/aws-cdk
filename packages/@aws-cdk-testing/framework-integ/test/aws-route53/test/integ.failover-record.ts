import { App, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as route53 from 'aws-cdk-lib/aws-route53';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const hostedZone = new route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: 'cdk.dev',
    });

    const healthCheck = new route53.HealthCheck(this, 'HealthCheck', {
      type: route53.HealthCheckType.HTTP,
      fqdn: 'example.com',
      port: 80,
      resourcePath: '/health',
      failureThreshold: 3,
      requestInterval: Duration.seconds(30),
    });

    // Primary failover record with health check
    new route53.ARecord(this, 'ARecordFailoverPrimary', {
      zone: hostedZone,
      recordName: 'failover',
      target: route53.RecordTarget.fromIpAddresses('1.2.3.4'),
      failover: route53.Failover.PRIMARY,
      healthCheck,
      setIdentifier: 'failover-primary',
      ttl: Duration.seconds(60),
    });

    // Secondary failover record
    new route53.ARecord(this, 'ARecordFailoverSecondary', {
      zone: hostedZone,
      recordName: 'failover',
      target: route53.RecordTarget.fromIpAddresses('5.6.7.8'),
      failover: route53.Failover.SECONDARY,
      setIdentifier: 'failover-secondary',
      ttl: Duration.seconds(60),
    });
  }
}

const app = new App();
new TestStack(app, 'failover-record');

app.synth();
