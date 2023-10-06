import { App, Stack, CfnOutput } from 'aws-cdk-lib';
import { InstanceProfile, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();

const stack = new Stack(app, 'aws-cdk-iam-instance-profile');

const role = new Role(stack, 'MyRole', {
  assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
});

new InstanceProfile(stack, 'MyInstanceProfile', {
  role,
  instanceProfileName: 'my-instance-profile',
  path: '/sample/path/',
});

const instanceProfileImportedByArn = InstanceProfile.fromInstanceProfileArn(
  stack,
  'ImportedProfileByArn',
  'arn:aws:iam::123456789012:instance-profile/MyInstanceProfile',
);
const instanceProfileImportedByArnWithPath = InstanceProfile.fromInstanceProfileArn(
  stack,
  'ImportedProfileByArnWithPath',
  'arn:aws:iam::123456789012:instance-profile/path/MyInstanceProfile',
);
const instanceProfileImportedByArnPathMultiple = InstanceProfile.fromInstanceProfileArn(
  stack,
  'ImportedProfileByArnWithPathMultiple',
  'arn:aws:iam::123456789012:instance-profile/p/a/t/h/MyInstanceProfile',
);
const instanceProfileImportedByAttributesWithRole = InstanceProfile.fromInstanceProfileAttributes(stack, 'AttributesWithRole', {
  instanceProfileArn: 'arn:aws:iam::123456789012:instance-profile/MyInstanceProfile',
  role,
});
const instanceProfileImportedByAttributesPathMultiple = InstanceProfile.fromInstanceProfileAttributes(stack, 'AttributesPathMultiple', {
  instanceProfileArn: 'arn:aws:iam::123456789012:instance-profile/p/a/t/h/MyInstanceProfile',
});
const instanceProfileImportedByName = InstanceProfile.fromInstanceProfileName(stack, 'ImportedProfileBy', 'MyInstanceProfile');

new CfnOutput(
  stack,
  'NameForProfileImportedByArn',
  { value: instanceProfileImportedByArn.instanceProfileName },
);
new CfnOutput(
  stack,
  'NameForProfileImportedByArnPath',
  { value: instanceProfileImportedByArnWithPath.instanceProfileName },
);
new CfnOutput(
  stack,
  'NameForProfileImportedByArnPathMultiple',
  { value: instanceProfileImportedByArnPathMultiple.instanceProfileName },
);
new CfnOutput(
  stack,
  'NameForProfileImportedByAttributesWithRole',
  { value: instanceProfileImportedByAttributesWithRole.instanceProfileName },
);
new CfnOutput(
  stack,
  'NameForProfileImportedByAttributesPathMultiple',
  { value: instanceProfileImportedByAttributesPathMultiple.instanceProfileName },
);
new CfnOutput(
  stack,
  'NameForProfileImportedByName',
  { value: instanceProfileImportedByName.instanceProfileName },
);

new IntegTest(app, 'iam-instance-profile-test', {
  testCases: [stack],
});

app.synth();

