import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as fsx from 'aws-cdk-lib/aws-fsx';

const app = new App();

const stack = new Stack(app, 'AwsCdkFsxLustre');

const vpc = new ec2.Vpc(stack, 'VPC', { restrictDefaultSecurityGroup: false });

const bucket = new s3.Bucket(stack, 'ImportBucket', {
  removalPolicy: RemovalPolicy.DESTROY,
});

const storageCapacity = 1200;
const lustreConfiguration = {
  deploymentType: fsx.LustreDeploymentType.SCRATCH_2,
  importPath: bucket.s3UrlForObject(),
  autoImportPolicy: fsx.LustreAutoImportPolicy.NEW_CHANGED_DELETED,
};

new fsx.LustreFileSystem(stack, 'FsxLustreFileSystem', {
  lustreConfiguration,
  storageCapacityGiB: storageCapacity,
  vpc,
  vpcSubnet: vpc.privateSubnets[0],
  removalPolicy: RemovalPolicy.DESTROY,
});

new integ.IntegTest(app, 'FsxLustreWithS3Test', {
  testCases: [stack],
});

app.synth();
