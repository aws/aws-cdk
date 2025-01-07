import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { UserPool, FeaturePlan } from 'aws-cdk-lib/aws-cognito';

const app = new App();
const stack = new Stack(app, 'integ-user-pool-feature-plans');

new UserPool(stack, 'userpool-lite-plan', {
  featurePlan: FeaturePlan.LITE,
  removalPolicy: RemovalPolicy.DESTROY,
});

new UserPool(stack, 'userpool-essentials-plan', {
  featurePlan: FeaturePlan.ESSENTIALS,
  removalPolicy: RemovalPolicy.DESTROY,
});

new UserPool(stack, 'userpool-plus-plan', {
  featurePlan: FeaturePlan.PLUS,
  removalPolicy: RemovalPolicy.DESTROY,
});

new IntegTest(app, 'IntegTest', { testCases: [stack] });
