import { App, Duration, Stack, StackProps } from 'aws-cdk-lib';
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
      { target: '1.2.3.4', weight: 20, recordId: 'id1' },
      { target: '2.3.4.5', weight: 30, recordId: 'id2' },
      { target: '3.4.5.6', weight: 50, recordId: 'id3' },
    ].forEach((data, index) => {
      new route53.ARecord(this, `WeightedRecord${index}`, {
        zone: hostedZone,
        recordName: 'www',
        weight: data.weight,
        ttl: Duration.seconds(10),
        setIdentifier: data.recordId,
        target: route53.RecordTarget.fromIpAddresses(data.target),
      });
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'weighted-record');

new IntegTest(app, 'Route53WeightedRecordInteg', {
  testCases: [stack],
  diffAssets: true,
});
app.synth();
