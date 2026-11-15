import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { REDSHIFT_SINGLETON_PROVIDER } from 'aws-cdk-lib/cx-api';
import * as redshift from '../lib';

const app = new cdk.App({ context: { [REDSHIFT_SINGLETON_PROVIDER]: true } });
const stack = new cdk.Stack(app, 'redshift-singleton-provider');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, natGateways: 0 });
const databaseName = 'integ';
const cluster = new redshift.Cluster(stack, 'Cluster', {
  vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  publiclyAccessible: false,
  nodeType: redshift.NodeType.RA3_LARGE,
  masterUser: { masterUsername: 'admin' },
  defaultDatabaseName: databaseName,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const options = { cluster, databaseName, removalPolicy: cdk.RemovalPolicy.DESTROY };
const user = new redshift.User(stack, 'User', { ...options, username: 'integ_user' });
const table = new redshift.Table(stack, 'Table', {
  ...options,
  tableName: 'integ_table',
  tableColumns: [{ name: 'id', dataType: 'integer' }],
});
table.grant(user, redshift.TableAction.SELECT);

// Redshift statement polling must use the same IAM role that executed the query.
const verifier = new lambda.Function(stack, 'VerifyPrivilege', {
  runtime: lambda.Runtime.NODEJS_LATEST,
  handler: 'index.handler',
  timeout: cdk.Duration.minutes(2),
  code: lambda.Code.fromInline(`
    const { RedshiftDataClient, ExecuteStatementCommand, DescribeStatementCommand,
      GetStatementResultCommand } = require('@aws-sdk/client-redshift-data');
    const client = new RedshiftDataClient({});
    exports.handler = async (parameters, context) => {
      const { Id } = await client.send(new ExecuteStatementCommand(parameters));
      while (context.getRemainingTimeInMillis() > 5000) {
        const statement = await client.send(new DescribeStatementCommand({ Id }));
        if (statement.Status === 'FINISHED') {
          const result = await client.send(new GetStatementResultCommand({ Id }));
          return { Records: result.Records };
        }
        if (statement.Status === 'FAILED' || statement.Status === 'ABORTED') {
          throw new Error(statement.Error || statement.Status);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      throw new Error('Timed out waiting for the privilege query');
    };
  `),
});
cluster.secret!.grantRead(verifier);
verifier.addToRolePolicy(new iam.PolicyStatement({
  actions: ['redshift-data:ExecuteStatement'],
  resources: [stack.formatArn({
    service: 'redshift',
    resource: 'cluster',
    resourceName: cluster.clusterName,
    arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
  })],
}));
verifier.addToRolePolicy(new iam.PolicyStatement({
  actions: ['redshift-data:DescribeStatement', 'redshift-data:GetStatementResult'],
  resources: ['*'],
}));

const test = new integ.IntegTest(app, 'SingletonProviderTest', { testCases: [stack] });
test.assertions.invokeFunction({
  functionName: verifier.functionName,
  payload: JSON.stringify({
    ClusterIdentifier: cluster.clusterName,
    Database: databaseName,
    SecretArn: cluster.secret!.secretArn,
    Sql: "SELECT has_table_privilege('integ_user', 'integ_table', 'select') AS granted",
  }),
}).expect(integ.ExpectedResult.objectLike({
  Payload: JSON.stringify({ Records: [[{ booleanValue: true }]] }),
}));
