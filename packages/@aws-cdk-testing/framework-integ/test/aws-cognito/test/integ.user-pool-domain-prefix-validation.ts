import { App, CfnOutput, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { UserPool } from 'aws-cdk-lib/aws-cognito';

/*
 * Stack verification steps:
 * * Verify that the user pool domain is created with a prefix that starts and
 *   ends with a lowercase alphanumeric character (no leading/trailing hyphens).
 */

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new Stack(app, 'integ-user-pool-domain-prefix-validation');

const userpool = new UserPool(stack, 'UserPool', {
  removalPolicy: RemovalPolicy.DESTROY,
});

// A prefix that exercises the tightened validation: hyphens in the middle are
// allowed, but the prefix must start and end with a lowercase alphanumeric.
const domain = userpool.addDomain('Domain', {
  cognitoDomain: {
    domainPrefix: 'cdk-integ-user-pool-domain',
  },
});

new CfnOutput(stack, 'Domain', {
  value: domain.domainName,
});
