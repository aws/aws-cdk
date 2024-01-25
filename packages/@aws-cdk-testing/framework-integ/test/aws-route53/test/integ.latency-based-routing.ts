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
      { target: '1.2.3.4', region: 'us-east-1' },
      { target: '2.3.4.5', region: 'ap-northeast-1' },
      { target: '3.4.5.6', region: 'eu-west-1' },
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
