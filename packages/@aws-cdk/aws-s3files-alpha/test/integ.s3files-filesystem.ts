import * as cdk from 'aws-cdk-lib';
import { RemovalPolicies } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { FileSystem } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'test-s3files-filesystem-integ');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const bucket = new s3.Bucket(stack, 'Bucket', {
  autoDeleteObjects: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  versioned: true,
});

const fileSystem = new FileSystem(stack, 'FileSystem', {
  bucket,
  vpc,
});

const accessPoint = fileSystem.addAccessPoint('AccessPoint', {
  path: '/data',
  createAcl: { ownerUid: '1000', ownerGid: '1000', permissions: '0755' },
  posixUser: { uid: '1000', gid: '1000' },
});

const mountTester = new lambda.Function(stack, 'MountTester', {
  runtime: lambda.Runtime.NODEJS_LATEST,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
const fs = require('fs');
const path = require('path');
exports.handler = async () => {
  const dir = '/mnt/data';
  const file = path.join(dir, 'integ-' + Date.now() + '-' + Math.random().toString(36).slice(2) + '.txt');
  const content = 'hello-s3files-' + Math.random().toString(36).slice(2);
  fs.writeFileSync(file, content);
  const got = fs.readFileSync(file, 'utf8');
  fs.unlinkSync(file);
  return { ok: got === content, file: file, content: got };
};
`),
  vpc,
  filesystem: lambda.FileSystem.fromS3FilesAccessPoint(accessPoint, '/mnt/data'),
  timeout: cdk.Duration.seconds(30),
});

RemovalPolicies.of(app).destroy();

const test = new integ.IntegTest(app, 'test-s3files-filesystem-integ-test', {
  testCases: [stack],
});

test.assertions
  .invokeFunction({ functionName: mountTester.functionName })
  .expect(integ.ExpectedResult.objectLike({
    Payload: integ.Match.serializedJson(integ.Match.objectLike({ ok: true })),
  }));
