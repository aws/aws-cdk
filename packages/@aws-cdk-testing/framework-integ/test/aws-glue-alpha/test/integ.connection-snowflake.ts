import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as glue from '@aws-cdk/aws-glue-alpha';

const app = new App();
const stack = new Stack(app, 'GlueSnowflakeConnectionStack');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 1 });

new glue.Connection(stack, 'SnowflakeConnection', {
  type: glue.ConnectionType.SNOWFLAKE,
  properties: {
    JDBC_CONNECTION_URL: 'jdbc:snowflake://account.snowflakecomputing.com',
    USERNAME: 'user',
    PASSWORD: 'pass',
  },
  subnet: vpc.privateSubnets[0],
  securityGroups: [new ec2.SecurityGroup(stack, 'SG', { vpc })],
});

new IntegTest(app, 'GlueSnowflakeConnectionInteg', {
  testCases: [stack],
});
