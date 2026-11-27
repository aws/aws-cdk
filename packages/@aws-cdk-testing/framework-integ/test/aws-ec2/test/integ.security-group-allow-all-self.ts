import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';

const app = new App();
const stack = new Stack(app, 'integ-security-group-allow-all-self');

const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2, natGateways: 0 });

// allowAllSelf with the default allowAllOutbound (true): the self-referencing
// egress rule must still be emitted alongside the implicit all-outbound rule.
// This is the exact configuration EFA network interfaces require.
new SecurityGroup(stack, 'EfaSecurityGroup', {
  vpc,
  allowAllSelf: true,
});

// allowAllSelf combined with allowAllOutbound: false: the placeholder
// "no traffic" egress rule is replaced by the self-referencing egress rule.
new SecurityGroup(stack, 'RestrictedEfaSecurityGroup', {
  vpc,
  allowAllSelf: true,
  allowAllOutbound: false,
});

new IntegTest(app, 'integ-test', {
  testCases: [stack],
  diffAssets: true,
});

app.synth();
