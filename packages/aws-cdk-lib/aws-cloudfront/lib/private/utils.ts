import { IDistribution } from '..';
import * as iam from '../../../aws-iam';
import { Stack } from '../../../core';

// List of CloudFront actions not supporting resource-level permissions
// https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazoncloudfront.html#amazoncloudfront-actions-as-permissions
const wildcardOnlyActions = [
  'cloudfront:CreateFieldLevelEncryptionConfig',
  'cloudfront:CreateFieldLevelEncryptionProfile',
  'cloudfront:CreateKeyGroup',
  'cloudfront:CreateMonitoringSubscription',
  'cloudfront:CreateOriginAccessControl',
  'cloudfront:CreatePublicKey',
  'cloudfront:CreateSavingsPlan',
  'cloudfront:DeleteKeyGroup',
  'cloudfront:DeleteMonitoringSubscription',
  'cloudfront:DeletePublicKey',
  'cloudfront:GetKeyGroup',
  'cloudfront:GetKeyGroupConfig',
  'cloudfront:GetMonitoringSubscription',
  'cloudfront:GetPublicKey',
  'cloudfront:GetPublicKeyConfig',
  'cloudfront:GetSavingsPlan',
  'cloudfront:ListAnycastIpLists',
  'cloudfront:ListCachePolicies',
  'cloudfront:ListCloudFrontOriginAccessIdentities',
  'cloudfront:ListContinuousDeploymentPolicies',
  'cloudfront:ListDistributions',
  'cloudfront:ListDistributionsByAnycastIpListId',
  'cloudfront:ListDistributionsByCachePolicyId',
  'cloudfront:ListDistributionsByKeyGroup',
  'cloudfront:ListDistributionsByLambdaFunction',
  'cloudfront:ListDistributionsByOriginRequestPolicyId',
  'cloudfront:ListDistributionsByRealtimeLogConfig',
  'cloudfront:ListDistributionsByResponseHeadersPolicyId',
  'cloudfront:ListDistributionsByVpcOriginId',
  'cloudfront:ListDistributionsByWebACLId',
  'cloudfront:ListFieldLevelEncryptionConfigs',
  'cloudfront:ListFieldLevelEncryptionProfiles',
  'cloudfront:ListFunctions',
  'cloudfront:ListKeyGroups',
  'cloudfront:ListKeyValueStores',
  'cloudfront:ListOriginAccessControls',
  'cloudfront:ListOriginRequestPolicies',
  'cloudfront:ListPublicKeys',
  'cloudfront:ListRateCards',
  'cloudfront:ListRealtimeLogConfigs',
  'cloudfront:ListResponseHeadersPolicies',
  'cloudfront:ListSavingsPlans',
  'cloudfront:ListStreamingDistributions',
  'cloudfront:ListUsages',
  'cloudfront:ListVpcOrigins',
  'cloudfront:UpdateFieldLevelEncryptionConfig',
  'cloudfront:UpdateKeyGroup',
  'cloudfront:UpdatePublicKey',
  'cloudfront:UpdateSavingsPlan',
];

/**
 * Format distribution ARN from stack and distribution ID.
 */
export function formatDistributionArn(dist: IDistribution) {
  return Stack.of(dist).formatArn({
    service: 'cloudfront',
    region: '',
    resource: 'distribution',
    resourceName: dist.distributionId,
  });
}

/**
 * Adds an IAM policy statement associated with this distribution to an IAM
 * principal's policy.
 */
export function grant(dist: IDistribution, grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
  const wildcardActions = [];
  const resourceLevelSupportedActions = [];
  let wildcardGrant: iam.Grant;
  let resourceLevelGrant: iam.Grant;

  for (const action of actions) {
    if (wildcardOnlyActions.includes(action)) {
      wildcardActions.push(action);
    } else {
      resourceLevelSupportedActions.push(action);
    }
  }

  if (wildcardActions.length > 0) {
    wildcardGrant = iam.Grant.addToPrincipal({
      grantee,
      actions: wildcardActions,
      resourceArns: ['*'],
    });
  }

  if (resourceLevelSupportedActions.length > 0) {
    resourceLevelGrant = iam.Grant.addToPrincipal({
      grantee,
      actions: resourceLevelSupportedActions,
      resourceArns: [formatDistributionArn(dist)],
    });
  }

  if (wildcardActions.length > 0 && resourceLevelSupportedActions.length > 0) {
    return resourceLevelGrant!.combine(wildcardGrant!);
  }

  return wildcardActions.length > 0 ? wildcardGrant! : resourceLevelGrant!;
}
