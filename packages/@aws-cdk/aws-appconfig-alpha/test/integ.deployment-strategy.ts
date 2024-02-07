import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { DeploymentStrategy, RolloutStrategy } from '../lib';

const app = new App();

const stack = new Stack(app, 'aws-appconfig-deployment-strategy');

// create basic deployment strategy
new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
  rolloutStrategy: RolloutStrategy.linear({
    growthFactor: 15,
    deploymentDuration: Duration.minutes(5),
  }),
});

new IntegTest(app, 'appconfig-deployment-strategy', {
  testCases: [stack],
});
