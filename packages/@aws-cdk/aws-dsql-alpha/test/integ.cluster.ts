import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Cluster } from '../lib';
import { Construct } from 'constructs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const func = new lambda.Function(this, 'Function', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async (event) => { return "hello"; }'),
    });

    const cluster = new Cluster(this, 'Database', {
      clusterName: 'my-dsql-cluster',
      deletionProtection: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const importedCluster = Cluster.fromClusterAttributes(this, 'ImportedCluster', {
      clusterIdentifier: cluster.clusterIdentifier,
      clusterName: cluster.clusterName,
      vpcEndpointServiceName: cluster.vpcEndpointServiceName,
    });

    importedCluster.grantConnect(func);
    importedCluster.grantConnectAdmin(func);
  }
}

const app = new cdk.App();

const stack = new TestStack(app, 'aws-cdk-dsql-stack');

new IntegTest(app, 'aws-cdk-dsql-integ', {
  testCases: [stack],
});
