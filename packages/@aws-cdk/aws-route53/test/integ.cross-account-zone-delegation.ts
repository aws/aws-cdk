import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { PublicHostedZone, CrossAccountZoneDelegationRecord } from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-route53-cross-account-integ');

const parentZone = new PublicHostedZone(stack, 'ParentHostedZone', {
  zoneName: 'myzone.com',
  crossAccountZoneDelegationPrincipal: new iam.AccountPrincipal(cdk.Aws.ACCOUNT_ID),
});

const childZone = new PublicHostedZone(stack, 'ChildHostedZone', {
  zoneName: 'sub.myzone.com',
});
new CrossAccountZoneDelegationRecord(stack, 'Delegation', {
  delegatedZone: childZone,
  parentHostedZoneId: parentZone.hostedZoneId,
  delegationRole: parentZone.crossAccountZoneDelegationRole!,
});

app.synth();
