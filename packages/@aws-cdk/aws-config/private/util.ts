import { CfnConfigRule, Scope } from '../lib';

/**
 * renders the CloudFormation scope property configuration for AWS Config rule
 * @param scope The resources that will be tracked by AWS Config
 */
export function renderScope(scope?: Scope): CfnConfigRule.ScopeProperty | undefined {
  return scope ? {
    complianceResourceId: scope.resourceId,
    complianceResourceTypes: scope.resourceTypes?.map(resource => resource.resourceType),
    tagKey: scope.key,
    tagValue: scope.value,
  } : undefined;
}