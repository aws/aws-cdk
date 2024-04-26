import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { ARecord, PrivateHostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-route53-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 1,
  restrictDefaultSecurityGroup: false,
});

const privateZone = new PrivateHostedZone(stack, 'PrivateZone', {
  zoneName: 'cdk.local', vpc,
});
// Target A record to be passed as input
const target = new ARecord(stack, 'AManual', {
  zone: privateZone,
  recordName: 'existing.test.record',
  target: RecordTarget.fromIpAddresses('192.0.1.1'),
});
const Arecord = ARecord.fromARecordAttributes(stack, 'A', {
  zone: privateZone,
  recordName: 'r53-integ-test',
  targetDNS: 'existing.test.record.cdk.local',
});

Arecord.node.addDependency(target);

new IntegTest(app, 'AwsCdkARecordDnsIntegTest', {
  testCases: [stack],
});
app.synth();
