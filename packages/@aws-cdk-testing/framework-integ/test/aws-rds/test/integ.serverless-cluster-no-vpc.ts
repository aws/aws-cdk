import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';

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

const noCopyTagsCluster = new rds.ServerlessCluster(stack, 'Serverless Database Without VPC and Copy Tags', {
  engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
  credentials: {
    username: 'admin',
    password: cdk.SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6'),
  },
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  copyTagsToSnapshot: false,
});
noCopyTagsCluster.connections.allowDefaultPortFromAnyIpv4('Open to the world');

app.synth();
