import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';

import { App, Stack } from 'aws-cdk-lib';
import { Application, Environment } from 'aws-cdk-lib/aws-appconfig';

const app = new App();

const stack = new Stack(app, 'aws-appconfig-environment-grant');

const appForEnv = new Application(stack, 'MyApplicationForEnv', {
  applicationName: 'AppForEnvTest',
});

const env = new Environment(stack, 'MyEnvironment', {
  application: appForEnv,
});

const user = new iam.User(stack, 'MyUser');
env.grantReadConfig(user);

new IntegTest(app, 'appconfig-environment', {
  testCases: [stack],
});
