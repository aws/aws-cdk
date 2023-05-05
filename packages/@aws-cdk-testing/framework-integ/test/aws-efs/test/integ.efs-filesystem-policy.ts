import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { AccountRootPrincipal, PolicyDocument, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as integ from '@aws-cdk/integ-tests-alpha';
import { AccessPoint, FileSystem } from 'aws-cdk-lib/aws-efs';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'test-efs-integ');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 3, natGateways: 1, restrictDefaultSecurityGroup: false });

const myFileSystemPolicy = new PolicyDocument({
  statements: [new PolicyStatement({
    actions: [
      'elasticfilesystem:ClientWrite',
      'elasticfilesystem:ClientMount',
    ],
    principals: [new AccountRootPrincipal()],
    resources: ['*'],
    conditions: {
      Bool: {
        'elasticfilesystem:AccessedViaMountTarget': 'true',
      },
    },
  })],
});

const fileSystem = new FileSystem(stack, 'FileSystem', {
  vpc,
  fileSystemPolicy: myFileSystemPolicy,
});
fileSystem.addToResourcePolicy(new PolicyStatement({
  actions: [
    'elasticfilesystem:ClientRootAccess',
  ],
  principals: [new AccountRootPrincipal()],
  resources: ['*'],
  conditions: {
    Bool: {
      'elasticfilesystem:AccessedViaMountTarget': 'true',
    },
  },
}));

const accessPoint = new AccessPoint(stack, 'AccessPoint', {
  fileSystem,
});
cdk.Tags.of(accessPoint).add('Name', 'MyAccessPoint');

new integ.IntegTest(app, 'FileSystemPolicyTest', {
  testCases: [stack],
});
app.synth();
