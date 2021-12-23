import * as cdk from '@aws-cdk/core';
import { Instance, Bundle, Platform, LinuxOSBlueprint } from '../lib';

const app = new cdk.App();

const env = {
  region: process.env.CDK_DEFAULT_REGION,
  account: process.env.CDK_DEFAULT_ACCOUNT,
};

const stack = new cdk.Stack(app, 'integ-lightsail-instance', { env });

new Instance(stack, 'Instance', {
  bundle: Bundle.SMALL_2_0,
  image: Platform.linuxOS({ blueprint: LinuxOSBlueprint.AMAZON_LINUX_2 }),
});
