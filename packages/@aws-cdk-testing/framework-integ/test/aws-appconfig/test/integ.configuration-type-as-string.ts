import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import {
  Application,
  ConfigurationContent,
  HostedConfiguration,
} from 'aws-cdk-lib/aws-appconfig';

const app = new App();
const stack = new Stack(app, 'aws-appconfig-configuration-type-as-string');

const appConfigApp = new Application(stack, 'MyAppConfig', {
  applicationName: 'AppForTypeAsStringTest',
});

// Test typeAsString with existing enum value
new HostedConfiguration(stack, 'MyConfigWithTypeAsString', {
  application: appConfigApp,
  name: 'TestConfigWithTypeAsString',
  typeAsString: 'AWS.AppConfig.FeatureFlags',
  content: ConfigurationContent.fromInlineText('This is my configuration content.'),
});

new IntegTest(app, 'appconfig-configuration-type-as-string', {
  testCases: [stack],
  cdkCommandOptions: {
    destroy: {
      args: {
        force: true,
      },
    },
  },
});
