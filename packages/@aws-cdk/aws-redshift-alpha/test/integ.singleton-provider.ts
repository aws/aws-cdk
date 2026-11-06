import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
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

const test = new integ.IntegTest(app, 'SingletonProviderTest', { testCases: [stack] });
const statement = test.assertions.awsApiCall('RedshiftData', 'executeStatement', {
  ClusterIdentifier: cluster.clusterName,
  Database: databaseName,
  SecretArn: cluster.secret!.secretArn,
  Sql: "SELECT has_table_privilege('integ_user', 'integ_table', 'select') AS granted",
});
const finished = test.assertions.awsApiCall('RedshiftData', 'describeStatement', {
  Id: statement.getAttString('Id'),
}).expect(integ.ExpectedResult.objectLike({ Status: 'FINISHED' }))
  .waitForAssertions({ totalTimeout: cdk.Duration.minutes(2) });
statement.next(finished);
const result = test.assertions.awsApiCall('RedshiftData', 'getStatementResult', {
  Id: statement.getAttString('Id'),
}).expect(integ.ExpectedResult.objectLike({ Records: [[{ booleanValue: true }]] }));
finished.next(result);
