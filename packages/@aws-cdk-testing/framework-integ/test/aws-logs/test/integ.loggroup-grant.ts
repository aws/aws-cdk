import { App, Stack } from 'aws-cdk-lib';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/*
 * Stack verification steps:
 * * The stack deploys successfully.
 * * The policy of each role lists the log group ARN and the log stream ARN (':*') as resources.
 */
const app = new App();
const stack = new Stack(app, 'aws-cdk-loggroup-grant-integ');

const role = new Role(stack, 'Role', {
  assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
});

const logGroup = new LogGroup(stack, 'LogGroup');
logGroup.grant(role, 'logs:DescribeLogStreams');

LogGroup.fromLogGroupName(stack, 'ImportedByName', 'imported-by-name')
  .grant(role, 'logs:DescribeLogStreams');

LogGroup.fromLogGroupArn(stack, 'ImportedByArn', `arn:${stack.partition}:logs:${stack.region}:${stack.account}:log-group:imported-by-arn:*`)
  .grant(role, 'logs:DescribeLogStreams');

new IntegTest(app, 'loggroup-grant', {
  testCases: [stack],
});
