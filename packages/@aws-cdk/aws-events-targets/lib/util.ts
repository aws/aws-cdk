import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import { Construct, IConstruct } from "@aws-cdk/core";

/**
 * Obtain the Role for the CloudWatch event
 *
 * If a role already exists, it will be returned. This ensures that if multiple
 * events have the same target, they will share a role.
 */
export function singletonEventRole(scope: IConstruct, policyStatements: iam.PolicyStatement[]): iam.IRole {
  const id = 'EventsRole';
  const existing = scope.node.tryFindChild(id) as iam.IRole;
  if (existing) { return existing; }

  const role = new iam.Role(scope as Construct, id, {
    assumedBy: new iam.ServicePrincipal('events.amazonaws.com')
  });

  policyStatements.forEach(role.addToPolicy.bind(role));

  return role;
}

/**
 * Allows a Lambda function to be called from a rule
 */
export function addLambdaPermission(rule: events.IRule, handler: lambda.IFunction): void {
  const permissionId = `AllowEventRule${rule.node.uniqueId}`;
  if (!handler.permissionsNode.tryFindChild(permissionId)) {
    handler.addPermission(permissionId, {
      action: 'lambda:InvokeFunction',
      principal: new iam.ServicePrincipal('events.amazonaws.com'),
      sourceArn: rule.ruleArn
    });
  }
}
