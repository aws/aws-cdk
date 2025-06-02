import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack, RemovalPolicy } from 'aws-cdk-lib';
import { Key } from 'aws-cdk-lib/aws-kms';
import {
  Application,
  ConfigurationContent,
  HostedConfiguration,
} from 'aws-cdk-lib/aws-appconfig';

const app = new App();

const stack = new Stack(app, 'aws-appconfig-configuration-kms');

const kmsKey = new Key(stack, 'MyKey', {
  removalPolicy: RemovalPolicy.DESTROY,
});

const appConfigApp = new Application(stack, 'MyAppConfig', {
  applicationName: 'AppForConfigTest',
});

new HostedConfiguration(stack, 'MyHostedConfigFromFile', {
  application: appConfigApp,
  content: ConfigurationContent.fromFile('config.json'),
  kmsKey,
});

new IntegTest(app, 'appconfig-configuration-kms', {
  testCases: [stack],
});

