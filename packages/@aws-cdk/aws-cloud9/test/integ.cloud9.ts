import * as cdk from '@aws-cdk/core';
import * as cloud9 from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-cloud9-integ');

const c9env = new cloud9.EnvironmentEC2(stack, 'C9Env');

new cdk.CfnOutput(stack, 'URL', { value: c9env.ideUrl });