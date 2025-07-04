/**
 * This integration test tests the case of a customer setting a permissions boundary using a custom aspect,
 * then trying to override at a more specific level using the PermissionsBoundary.of() API.
 *
 * Overriding should work.
 */
import { App, Stack, IAspect, Aspects } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { CfnRole, ManagedPolicy, PermissionsBoundary, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { IConstruct } from 'constructs';

class CustomAspect implements IAspect {
  public visit(node: IConstruct): void {
    if (node instanceof CfnRole) {
      node.addPropertyOverride('PermissionsBoundary', 'arn:aws:iam::aws:policy/ReadOnlyAccess');
    }
  }
}

const app = new App({
  postCliContext: {
    // Force the intended behavior, from before we found this bug
    '@aws-cdk/core:aspectPrioritiesMutating': false,
  },
});

const stack = new Stack(app, 'integ-permissions-boundary', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
  },
});

Aspects.of(stack).add(new CustomAspect());

new Role(stack, 'NormalRole', {
  assumedBy: new ServicePrincipal('sqs.amazonaws.com'),
});

const powerRole = new Role(stack, 'PowerRole', {
  assumedBy: new ServicePrincipal('sqs.amazonaws.com'),
});

PermissionsBoundary.of(powerRole).apply(ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));

new IntegTest(app, 'integ-test', {
  testCases: [stack],
});

app.synth();
