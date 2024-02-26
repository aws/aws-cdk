import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { DeploymentStrategy, RolloutStrategy } from 'aws-cdk-lib/aws-appconfig';

const app = new App();

const stack = new Stack(app, 'aws-appconfig-deployment-strategy');

// create basic deployment strategy
new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
  rolloutStrategy: RolloutStrategy.linear({
    growthFactor: 15,
    deploymentDuration: Duration.minutes(5),
  }),
});

/* resource deployment alone is sufficient because we already have the
   corresponding resource handler tests to assert that resources can be
   used after created */

new IntegTest(app, 'appconfig-deployment-strategy', {
  testCases: [stack],
});
