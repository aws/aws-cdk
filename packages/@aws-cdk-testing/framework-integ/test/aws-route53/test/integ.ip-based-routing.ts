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
      routing: route53.Routing.cidrListIpBasedRouting(
        ['192.168.1.0/24', '192.168.16.0/20'],
        'TokyoServer',
        'myCollection',
      ),
    });

    const cidrCollection = record1.cidrCollection;
    if (!cidrCollection) {
      throw new Error('cidrCollection is not defined');
    }

    // same collection, different location
    new route53.ARecord(this, 'ARecordIpBased2', {
      zone: hostedZone,
      recordName: 'www',
      target: route53.RecordTarget.fromIpAddresses('2.3.4.5'),
      routing: route53.Routing.existingCollectionIpBasedRouting(
        ['192.168.2.0/24', '192.168.48.0/20'],
        'LondonServer',
        record1.cidrCollection,
      ),
    });

    // default location
    new route53.ARecord(this, 'ARecordIpBased3', {
      zone: hostedZone,
      recordName: 'xxx',
      target: route53.RecordTarget.fromIpAddresses('3.4.5.6'),
      routing: route53.Routing.defaultIpBasedRouting(),
    });
  };
}

const app = new App();
const stack = new TestStack(app, 'ip-based-routing');

new IntegTest(app, 'Route53IpBasedRoutingInteg', {
  testCases: [stack],
});
