import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Names } from '@aws-cdk/core';
import { IConstruct } from 'constructs';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from 'constructs';

/**
 * Obtain the Role for the EventBridge event
 *
 * If a role already exists, it will be returned. This ensures that if multiple
 * events have the same target, they will share a role.
 */
export function singletonEventRole(scope: IConstruct, policyStatements: iam.PolicyStatement[]): iam.IRole {
  const id = 'EventsRole';
  const existing = scope.node.tryFindChild(id) as iam.IRole;
  if (existing) { return existing; }

  const role = new iam.Role(scope, id, {
    assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
  });

  policyStatements.forEach(role.addToPolicy.bind(role));

  return role;
}

/**
 * Allows a Lambda function to be called from a rule
 */
export function addLambdaPermission(rule: events.IRule, handler: lambda.IFunction): void {
  let scope: Construct | undefined;
  let node = handler.permissionsNode;
  if (rule instanceof Construct) {
    // Place the Permission resource in the same stack as Rule rather than the Function
    // This is to reduce circular dependency when the lambda handler and the rule are across stacks.
    scope = rule;
    node = rule.node;
  }
  const permissionId = `AllowEventRule${Names.nodeUniqueId(rule.node)}`;
  if (!node.tryFindChild(permissionId)) {
    handler.addPermission(permissionId, {
      scope,
      action: 'lambda:InvokeFunction',
      principal: new iam.ServicePrincipal('events.amazonaws.com'),
      sourceArn: rule.ruleArn,
    });
  }
}
