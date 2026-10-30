import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack, RemovalPolicy } from 'aws-cdk-lib';
import { Key } from 'aws-cdk-lib/aws-kms';
import {
  Application,
  ConfigurationContent,
  HostedConfiguration,
} from 'aws-cdk-lib/aws-appconfig';
import * as path from 'path';

const app = new App();

const stack = new Stack(app, 'aws-appconfig-configuration-kms');

const kmsKey = new Key(stack, 'MyKey', {
  removalPolicy: RemovalPolicy.DESTROY,
});

const appConfigApp = new Application(stack, 'MyAppConfig', {
  applicationName: 'AppForConfigTest',
});

const hostedConfig = new HostedConfiguration(stack, 'MyHostedConfigFromFile', {
  application: appConfigApp,
  content: ConfigurationContent.fromFile(path.join(__dirname, 'config.json')),
  kmsKey,
});

const integ = new IntegTest(app, 'appconfig-configuration-kms', {
  testCases: [stack],
});

integ.assertions.awsApiCall('AppConfig', 'getConfigurationProfile', {
  ApplicationId: appConfigApp.applicationId,
  ConfigurationProfileId: hostedConfig.configurationProfileId,
}).expect(ExpectedResult.objectLike({
  KmsKeyArn: kmsKey.keyArn,
}));

