import { App, Stack } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as iam from '../lib/index';

const app = new App();
const stack = new Stack(app, 'integ-principal-with-conditions');

const basePrincipal = new iam.AnyPrincipal();
const principal = new iam.PrincipalWithConditions(basePrincipal, {
  StringLike: { 'aws:username': 'foo-*' },
});
principal.addCondition('StringLike', { 'aws:PrincipalTag/owner': 'foo' });
principal.addCondition('Bool', { 'aws:MultiFactorAuthPresent': 'true' });

new iam.Role(stack, 'TestRole', {
  assumedBy: principal,
});


new IntegTest(app, 'PrincipalWithCondition', {
  testCases: [stack],
});

app.synth();
