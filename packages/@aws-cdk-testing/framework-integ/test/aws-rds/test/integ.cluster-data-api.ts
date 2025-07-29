import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as lambda from 'aws-cdk-lib/aws-lambda';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new cdk.Stack(app, 'cluster-data-api');
const vpc = new ec2.Vpc(stack, 'VPC');

const fucntion = new lambda.Function(stack, 'Function', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = async (event) => { return "hello"; }'),
});

const cluster = new rds.DatabaseCluster(stack, 'Database', {
  engine: rds.DatabaseClusterEngine.auroraPostgres({ version: rds.AuroraPostgresEngineVersion.VER_16_1 }),
  writer: rds.ClusterInstance.serverlessV2('writerInstance'),
  vpc,
  enableDataApi: true,
});

cluster.grantDataApiAccess(fucntion);

new integ.IntegTest(app, 'integ-cluster-data-api', {
  testCases: [stack],
});

app.synth();
