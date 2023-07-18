import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codebuild-file-system-locations');
const vpc = new ec2.Vpc(stack, 'MyVPC', {
  maxAzs: 1,
  natGateways: 1,
  restrictDefaultSecurityGroup: false,
});
const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup1', {
  allowAllOutbound: true,
  description: 'Example',
  securityGroupName: 'Jane',
  vpc,
});

new codebuild.Project(stack, 'MyProject', {
  buildSpec: codebuild.BuildSpec.fromObject({
    version: '0.2',
  }),
  environment: {
    privileged: true,
  },
  vpc,
  securityGroups: [securityGroup],
  fileSystemLocations: [codebuild.FileSystemLocation.efs({
    identifier: 'myidentifier',
    location: `fs-c8d04839.efs.${cdk.Aws.REGION}.amazonaws.com:/mnt`,
    mountOptions: 'nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2',
    mountPoint: '/media',
  })],
  grantReportGroupPermissions: false,
});

app.synth();
