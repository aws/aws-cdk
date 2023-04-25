import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 2,
});
const subnetGroup = new rds.SubnetGroup(stack, 'SubnetGroup', {
  vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  description: 'My Subnet Group',
  subnetGroupName: 'MyNotLowerCaseSubnetGroupName',
});

const cluster = new rds.ServerlessCluster(stack, 'Serverless Database', {
  engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
  credentials: {
    username: 'admin',
    password: cdk.SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6'),
  },
  vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  subnetGroup,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
cluster.connections.allowDefaultPortFromAnyIpv4('Open to the world');

const noCopyTagsCluster = new rds.ServerlessCluster(stack, 'Serverless Database Without Copy Tags', {
  engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
  credentials: {
    username: 'admin',
    password: cdk.SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6'),
  },
  vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  subnetGroup,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  copyTagsToSnapshot: false,
});
noCopyTagsCluster.connections.allowDefaultPortFromAnyIpv4('Open to the world');

app.synth();
