import * as ec2 from '../../aws-ec2';
import { AccountRootPrincipal, PolicyDocument, PolicyStatement } from '../../aws-iam';
import * as cdk from '../../core';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as integ from '../../integ-tests';
import { FileSystem } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'test-efs-integ');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 3, natGateways: 1 });

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

new FileSystem(stack, 'FileSystem', {
  vpc,
  fileSystemPolicy: myFileSystemPolicy,
});

new integ.IntegTest(app, 'FileSystemPolicyTest', {
  testCases: [stack],
});
app.synth();