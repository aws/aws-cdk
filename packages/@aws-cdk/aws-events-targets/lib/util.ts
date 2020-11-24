import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sqs from '@aws-cdk/aws-sqs';
import { Construct, ConstructNode, IConstruct, Names, Stack } from '@aws-cdk/core';

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

  const role = new iam.Role(scope as Construct, id, {
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
  let node: ConstructNode = handler.permissionsNode;
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


export function addToDeadLetterQueueResourcePolicy(rule: events.IRule, queue: sqs.IQueue) {
  const ruleParsedStack = Stack.of(rule);
  const queueParsedStack = Stack.of(queue);

  if (ruleParsedStack.region !== queueParsedStack.region) {
    throw new Error(`Cannot assign Dead Letter Queue to the rule ${rule}. Both the queue and the rule must be in the same region`);
  }

  // Skip Resource Policy creation if the Queue is not in the same account.
  // There is no way to add a target onto an imported rule, so we can assume we will run the following code only
  // in the account where the rule is created.

  if (ruleParsedStack.account === queueParsedStack.account) {
    const policyStatementId = `AllowEventRule${Names.nodeUniqueId(rule.node)}`;

    queue.addToResourcePolicy(new iam.PolicyStatement({
      sid: policyStatementId,
      principals: [new iam.ServicePrincipal('events.amazonaws.com')],
      effect: iam.Effect.ALLOW,
      actions: ['sqs:SendMessage'],
      resources: [queue.queueArn],
      conditions: {
        ArnEquals: {
          'aws:SourceArn': rule.ruleArn,
        },
      },
    }));
  } else {
    // Maybe we could post a warning telling the user to create the permission in the target account manually ?
  }
}
