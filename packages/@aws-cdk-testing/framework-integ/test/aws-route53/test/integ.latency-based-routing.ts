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

    [
      { target: '1.2.3.4', region: route53.LatencyBasedRoutingRegion.US_EAST_1 },
      { target: '2.3.4.5', region: route53.LatencyBasedRoutingRegion.AP_NORTHEAST_1 },
      { target: '3.4.5.6', region: route53.LatencyBasedRoutingRegion.EU_WEST_1 },
    ].forEach((data, index) => {
      new route53.ARecord(this, `LatencyBasedRouting${index}`, {
        zone: hostedZone,
        recordName: 'www',
        region: data.region,
        target: route53.RecordTarget.fromIpAddresses(data.target),
      });
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'latency-based-routing');

new IntegTest(app, 'Route53LatencyBasedRoutingInteg', {
  testCases: [stack],
});
app.synth();
