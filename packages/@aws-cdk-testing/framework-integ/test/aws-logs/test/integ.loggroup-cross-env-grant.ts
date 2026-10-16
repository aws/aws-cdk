import { AccountRootPrincipal, Role } from 'aws-cdk-lib/aws-iam';
import { App, PhysicalName, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { LogGroup } from 'aws-cdk-lib/aws-logs';

/*
 * A LogGroup granted to a role in a stack in another region. The granted
 * resource must include the ':*' suffix so the role can act on the log streams.
 */
const app = new App();
const account = process.env.CDK_INTEG_ACCOUNT || '123456789012';

const logGroupStack = new Stack(app, 'aws-cdk-loggroup-cross-env-grant-log-group', {
  env: { account, region: 'us-east-1' },
});
const logGroup = new LogGroup(logGroupStack, 'LogGroup', {
  logGroupName: PhysicalName.GENERATE_IF_NEEDED,
});

const roleStack = new Stack(app, 'aws-cdk-loggroup-cross-env-grant-role', {
  env: { account, region: 'us-west-2' },
});
const role = new Role(roleStack, 'Role', {
  assumedBy: new AccountRootPrincipal(),
});
logGroup.grantWrite(role);
logGroup.grantRead(role);

new IntegTest(app, 'loggroup-cross-env-grant', {
  testCases: [logGroupStack, roleStack],
});
