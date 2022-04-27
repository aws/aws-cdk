import * as rds from '@aws-cdk/aws-rds';
import * as cdk from '@aws-cdk/core';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-sls-cluster-no-vpc-integ');

const cluster = new rds.ServerlessCluster(stack, 'Serverless Database Without VPC', {
  engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
  credentials: {
    username: 'admin',
    password: cdk.SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6'),
  },
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
cluster.connections.allowDefaultPortFromAnyIpv4('Open to the world');

app.synth();
