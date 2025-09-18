#!/usr/bin/env node
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-s3');

const bucket = new s3.Bucket(stack, 'MyBucket', {
  encryption: s3.BucketEncryption.KMS,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

bucket.encryptionKey?.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

const otherwiseEncryptedBucket = new s3.Bucket(stack, 'MyOtherBucket', {
  encryption: s3.BucketEncryption.S3_MANAGED,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const user = new iam.User(stack, 'MyUser');
bucket.grantReadWrite(user);
otherwiseEncryptedBucket.grantRead(user);

// Add VPC-dependent resource with non-existent VPC - will pass synth but fail deploy
const vpc = ec2.Vpc.fromVpcAttributes(stack, 'InvalidVpc', {
  vpcId: 'vpc-nonexistent123',
  availabilityZones: ['us-east-1a', 'us-east-1b'],
});

new ec2.SecurityGroup(stack, 'TestSecurityGroup', {
  vpc: vpc,
  description: 'Test security group with invalid VPC',
});

new IntegTest(app, 'cdk-integ-s3-bucket', {
  testCases: [stack],
});
