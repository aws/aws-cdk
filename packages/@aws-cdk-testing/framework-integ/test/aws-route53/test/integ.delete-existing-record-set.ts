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

    // Simulate existing record
    const existingRecord = new route53.ARecord(this, 'ExistingRecord', {
      target: route53.RecordTarget.fromIpAddresses('1.2.3.4'),
      zone: hostedZone,
      recordName: 'integ',
    });

    const newRecord = new route53.ARecord(this, 'NewRecord', {
      target: route53.RecordTarget.fromIpAddresses('5.6.7.8'),
      ttl: Duration.hours(2),
      zone: hostedZone,
      recordName: 'integ',
      deleteExisting: true,
    });
    newRecord.node.addDependency(existingRecord);
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-route53-integ-delete-existing-record-set');

new IntegTest(app, 'Rooute53DeleteExistingRecordSetInteg', {
  testCases: [stack],
  diffAssets: true,
});
app.synth();
