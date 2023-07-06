import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { PublicHostedZone, CrossAccountZoneDelegationRecord } from 'aws-cdk-lib/aws-route53';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-route53-cross-account-integ');

const parentZone = new PublicHostedZone(stack, 'ParentHostedZone', {
  zoneName: 'myzone.com',
  crossAccountZoneDelegationPrincipal: new iam.AccountPrincipal(cdk.Aws.ACCOUNT_ID),
});

// with zoneId
const childZoneWithZoneId = new PublicHostedZone(stack, 'ChildHostedZoneWithZoneId', {
  zoneName: 'sub.myzone.com',
});
new CrossAccountZoneDelegationRecord(stack, 'DelegationWithZoneId', {
  delegatedZone: childZoneWithZoneId,
  parentHostedZoneId: parentZone.hostedZoneId,
  delegationRole: parentZone.crossAccountZoneDelegationRole!,
});

// with zoneName
const childZoneWithZoneName = new PublicHostedZone(stack, 'ChildHostedZoneWithZoneName', {
  zoneName: 'anothersub.myzone.com',
});
new CrossAccountZoneDelegationRecord(stack, 'DelegationWithZoneName', {
  delegatedZone: childZoneWithZoneName,
  parentHostedZoneName: 'myzone.com',
  delegationRole: parentZone.crossAccountZoneDelegationRole!,
});

new IntegTest(app, 'Route53CrossAccountInteg', {
  testCases: [stack],
  diffAssets: true,
});
app.synth();
