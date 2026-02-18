import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-infrastructure-configuration-default-parameters');

new imagebuilder.InfrastructureConfiguration(stack, 'InfrastructureConfiguration');

new integ.IntegTest(app, 'InfrastructureConfigurationTest', {
  testCases: [stack],
});
