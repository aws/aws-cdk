import * as iam from '@aws-cdk/aws-iam';
import { IConstruct, PhysicalName } from '@aws-cdk/core';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * Obtain the Role for the TopicRule
 *
 * If a role already exists, it will be returned. This ensures that if a rule have multiple
 * actions, they will share a role.
 * @internal
 */
export function singletonActionRole(scope: IConstruct): iam.IRole {
  const id = 'TopicRuleActionRole';
  const existing = scope.node.tryFindChild(id) as iam.IRole;
  if (existing) {
    return existing;
  };

  const role = new iam.Role(scope as Construct, id, {
    roleName: PhysicalName.GENERATE_IF_NEEDED,
    assumedBy: new iam.ServicePrincipal('iot.amazonaws.com'),
  });
  return role;
}
