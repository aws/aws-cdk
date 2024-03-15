import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { Application, ConfigurationContent, DeploymentStrategy, Environment, HostedConfiguration, RolloutStrategy } from 'aws-cdk-lib/aws-appconfig';

/**
 * Test case:
 * - Single Environment
 * - Two Configurations
 * - Both have non-zero deployment duration
 *
 * If this was done via the L1 constructs alone, Cfn would fail due to
 * violating AppConfig's simultaneous deployment rule.
 */

const app = new App();
const stack = new Stack(app, 'aws-appconfig-multi-config-env');
const application = new Application(stack, 'MyApplicationForEnv');
const env = new Environment(stack, 'MultiConfigEnvironment', {
  application,
});
const deploymentStrategy = new DeploymentStrategy(stack, 'QuickDeploymentStrategy',
  {
    rolloutStrategy: RolloutStrategy.linear({
      deploymentDuration: Duration.minutes(1),
      growthFactor: 50,
    }),
  });

new HostedConfiguration(stack, 'MyFirstConfig', {
  application,
  content: ConfigurationContent.fromInline('first config content'),
  deploymentStrategy,
  deployTo: [env],
});
new HostedConfiguration(stack, 'MySecondConfig', {
  application,
  content: ConfigurationContent.fromInline('second config content'),
  deploymentStrategy,
  deployTo: [env],
});

new IntegTest(app, 'appconfig-multi-config-env', {
  testCases: [stack],
});
