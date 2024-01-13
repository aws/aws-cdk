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
      { target: 'xxx', weight: 20, recordId: 'id1' },
      { target: 'yyy', weight: 30, recordId: 'id2' },
      { target: 'zzz', weight: 50, recordId: 'id3' },
    ].forEach((data, index) => {
      new route53.RecordSet(this, `WeightedRecordSet${index}`, {
        zone: hostedZone,
        recordName: 'www',
        recordType: route53.RecordType.CNAME,
        target: route53.RecordTarget.fromValues(data.target),
        weight: data.weight,
        ttl: Duration.seconds(10),
        setIdentifier: data.recordId,
      });
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'weighted-record-set');

new IntegTest(app, 'Route53WeightedRecordSetInteg', {
  testCases: [stack],
  diffAssets: true,
});
app.synth();
