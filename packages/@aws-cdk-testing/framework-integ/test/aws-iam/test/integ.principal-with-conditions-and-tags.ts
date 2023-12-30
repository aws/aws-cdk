import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new App();
const stack = new Stack(app, 'integ-principal-with-conditions-and-tags');

const basePrincipal = new iam.AnyPrincipal()
  .withConditions({
    StringLike: { 'aws:PrincipalTag/owner': 'foo' },
    Bool: { 'aws:MultiFactorAuthPresent': 'true' },
  })
  .withSessionTags();

new iam.Role(stack, 'TestRole2', {
  assumedBy: basePrincipal,
});

new IntegTest(app, 'PrincipalWithConditionAndTags', {
  testCases: [stack],
});

app.synth();
