import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const hostedZone = new route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: 'cdk.dev',
    });

    const record1 = new route53.ARecord(this, 'ARecordIpBased1', {
      zone: hostedZone,
      recordName: 'www',
      target: route53.RecordTarget.fromIpAddresses('1.2.3.4'),
      cidrRoutingConfig: {
        cidrList: ['192.168.1.0/24', '192.168.16.0/20'],
        locationName: 'TokyoServer',
        collectionName: 'myCollection',
      },
    });

    // same collection, different location
    new route53.ARecord(this, 'ARecordIpBased2', {
      zone: hostedZone,
      recordName: 'www',
      target: route53.RecordTarget.fromIpAddresses('2.3.4.5'),
      cidrRoutingConfig: {
        cidrList: ['192.168.2.0/24', '192.168.48.0/20'],
        locationName: 'LondonServer',
        collection: record1.cidrCollection,
      },
    });

    // default location
    new route53.ARecord(this, 'ARecordIpBased3', {
      zone: hostedZone,
      recordName: 'xxx',
      target: route53.RecordTarget.fromIpAddresses('3.4.5.6'),
      cidrRoutingConfig: {
        locationName: '*',
      },
    });
  };
}

const app = new App();
const stack = new TestStack(app, 'ip-based-routing');

new IntegTest(app, 'Route53IpBasedRoutingInteg', {
  testCases: [stack],
});
app.synth();
