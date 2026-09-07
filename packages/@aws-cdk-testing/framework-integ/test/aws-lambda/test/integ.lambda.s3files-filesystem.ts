import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3files from 'aws-cdk-lib/aws-s3files';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new cdk.Stack(app, 'test-lambda-s3files-integ');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 3, natGateways: 1, restrictDefaultSecurityGroup: false });
const bucket = new s3.Bucket(stack, 'Bucket', { removalPolicy: cdk.RemovalPolicy.DESTROY, versioned: true });

// IAM role for S3 Files to access the bucket
const role = new iam.Role(stack, 'S3FilesRole', {
  assumedBy: new iam.ServicePrincipal('elasticfilesystem.amazonaws.com'),
});
role.addToPolicy(new iam.PolicyStatement({
  actions: ['s3:ListBucket*'],
  resources: [bucket.bucketArn],
}));
role.addToPolicy(new iam.PolicyStatement({
  actions: ['s3:AbortMultipartUpload', 's3:DeleteObject', 's3:GetObject*', 's3:List*', 's3:PutObject*'],
  resources: [bucket.arnForObjects('*')],
}));
role.addToPolicy(new iam.PolicyStatement({
  actions: [
    'events:DeleteRule', 'events:DisableRule', 'events:EnableRule',
    'events:PutRule', 'events:PutTargets', 'events:RemoveTargets',
  ],
  resources: [`arn:${cdk.Aws.PARTITION}:events:*:*:rule/DO-NOT-DELETE-S3-Files*`],
  conditions: { StringEquals: { 'events:ManagedBy': 'elasticfilesystem.amazonaws.com' } },
}));
role.addToPolicy(new iam.PolicyStatement({
  actions: ['events:DescribeRule', 'events:ListRuleNamesByTarget', 'events:ListRules', 'events:ListTargetsByRule'],
  resources: [`arn:${cdk.Aws.PARTITION}:events:*:*:rule/*`],
}));

// L1 file system
const fileSystem = new s3files.CfnFileSystem(stack, 'S3FilesFs', {
  bucket: bucket.bucketArn,
  roleArn: role.roleArn,
});
fileSystem.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

// Security group for mount targets
const sg = new ec2.SecurityGroup(stack, 'MountTargetSG', { vpc });

// Mount targets in private subnets
vpc.privateSubnets.forEach((subnet, i) =>
  new s3files.CfnMountTarget(stack, `MountTarget${i}`, {
    fileSystemId: fileSystem.attrFileSystemId,
    subnetId: subnet.subnetId,
    securityGroups: [sg.securityGroupId],
  }),
);

// L1 access point
const accessPoint = new s3files.CfnAccessPoint(stack, 'AccessPoint', {
  fileSystemId: fileSystem.attrFileSystemId,
  rootDirectory: {
    path: '/export/lambda',
    creationPermissions: { ownerGid: '1001', ownerUid: '1001', permissions: '750' },
  },
  posixUser: { gid: '1001', uid: '1001' },
});

new lambda.Function(stack, 'MyLambda', {
  code: lambda.Code.fromAsset(path.join(__dirname, 's3files-handler')),
  handler: 'index.handler',
  runtime: lambda.Runtime.PYTHON_3_12,
  vpc,
  filesystem: lambda.FileSystem.fromS3FilesAccessPoint(accessPoint, '/mnt/data'),
});

new integ.IntegTest(app, 'LambdaS3FilesIntegTest', {
  testCases: [stack],
});

app.synth();
