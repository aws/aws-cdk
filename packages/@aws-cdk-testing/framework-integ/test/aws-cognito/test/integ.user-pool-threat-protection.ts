import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { UserPool, FeaturePlan, StandardThreatProtectionMode, CustomThreatProtectionMode } from 'aws-cdk-lib/aws-cognito';

const app = new App();
const stack = new Stack(app, 'integ-user-pool-threat-protection');

new UserPool(stack, 'userpool-standard-threat-protection', {
  featurePlan: FeaturePlan.PLUS,
  standardThreatProtectionMode: StandardThreatProtectionMode.FULL_FUNCTION,
  removalPolicy: RemovalPolicy.DESTROY,
});

new UserPool(stack, 'userpool-custom-threat-protection', {
  featurePlan: FeaturePlan.PLUS,
  customThreatProtectionMode: CustomThreatProtectionMode.FULL_FUNCTION,
  removalPolicy: RemovalPolicy.DESTROY,
});

new IntegTest(app, 'IntegTest', { testCases: [stack] });
