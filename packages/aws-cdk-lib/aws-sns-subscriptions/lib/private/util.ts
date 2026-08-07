import type { Construct } from 'constructs';
import * as iam from '../../../aws-iam';
import * as sns from '../../../aws-sns';
import { Annotations, ArnFormat, Stack, Token, ValidationError } from '../../../core';
import type { IResource } from '../../../core';
import { lit } from '../../../core/lib/private/literal-string';
import { Fact, FactName } from '../../../region-info';

export function regionFromArn(topic: sns.ITopic, resource: IResource): string | undefined {
  // no need to specify `region` for topics defined within the same stack.
  if (topic instanceof sns.Topic) {
    if (topic.stack !== resource.stack) {
      // only if we know the region, will not work for
      // env agnostic stacks
      if (!Token.isUnresolved(topic.env.region) && topic.env.region !== resource.env.region) {
        return topic.env.region;
      }
    }
    return undefined;
  }
  return Stack.of(topic).splitArn(topic.topicArn, ArnFormat.SLASH_RESOURCE_NAME).region;
}

/**
 * Options controlling which SNS service principals should be granted permission
 * on a subscription target.
 */
export interface SnsServicePrincipalOptions {
  /**
   * Whether to include the default SNS service principal (`sns.amazonaws.com`).
   */
  readonly includeDefault: boolean;

  /**
   * Opt-in regions whose regionalized SNS service principals
   * (`sns.<region>.amazonaws.com`) should be included.
   */
  readonly regions: readonly string[];
}

/**
 * An SNS service principal selected by {@link snsServicePrincipals}, paired with a
 * stable suffix callers can append to per-principal CloudFormation logical IDs.
 */
export interface SnsServicePrincipal {
  /**
   * Logical-ID suffix for per-principal resources. `''` for the default principal
   * (preserves the pre-existing logical ID for backwards compatibility); the
   * region code for regional principals.
   */
  readonly idSuffix: string;

  /**
   * The IAM service principal.
   */
  readonly principal: iam.IPrincipal;
}

const SNS_OPT_IN_REGION_WARNING_CODE = '@aws-cdk/aws-sns-subscriptions:unknownOptInRegion';

/**
 * Build the list of SNS service principals that should be allowed to invoke a
 * subscriber, including the default `sns.amazonaws.com` principal and any
 * additional opt-in region principals (`sns.<region>.amazonaws.com`) configured
 * by the caller.
 *
 * Synthesis-time validation:
 *   - Tokenized region values are rejected — CloudFormation logical IDs cannot
 *     contain tokens, so the regional principal must be expressible as a literal.
 *   - Known opt-in regions are accepted.
 *   - Known default-enabled regions are rejected — the regionalized principal
 *     would be a no-op for them.
 *   - Regions unknown to `RegionInfo` produce a synth-time warning, since
 *     `RegionInfo` may lag behind newly launched AWS regions.
 *
 * Throws if the result would be empty (default disabled with no regions).
 */
export function snsServicePrincipals(
  scope: Construct,
  options: SnsServicePrincipalOptions,
): SnsServicePrincipal[] {
  const result: SnsServicePrincipal[] = [];

  if (options.includeDefault) {
    result.push({ idSuffix: '', principal: new iam.ServicePrincipal('sns.amazonaws.com') });
  }

  for (const region of options.regions) {
    validateRegion(scope, region);
    result.push({
      idSuffix: region,
      principal: new iam.ServicePrincipal(`sns.${region}.amazonaws.com`),
    });
  }

  if (result.length === 0) {
    throw new ValidationError(
      lit`NoSnsServicePrincipalsConfigured`,
      'at least one SNS service principal must be configured: keep includeDefaultServicePrincipal enabled or provide at least one entry in additionalServicePrincipalRegions',
      scope,
    );
  }

  return result;
}

function validateRegion(scope: Construct, region: string): void {
  if (Token.isUnresolved(region)) {
    throw new ValidationError(
      lit`SnsRegionalPrincipalUnresolvedRegion`,
      'additionalServicePrincipalRegions does not support tokenized region values; pass a literal opt-in region name',
      scope,
    );
  }

  const fact = Fact.find(region, FactName.IS_OPT_IN_REGION);
  if (fact === 'NO') {
    throw new ValidationError(
      lit`SnsRegionalPrincipalNotOptIn`,
      `region ${JSON.stringify(region)} in additionalServicePrincipalRegions is not an opt-in region; the regionalized SNS service principal is only required for opt-in regions`,
      scope,
    );
  }
  if (fact === undefined) {
    Annotations.of(scope).addWarningV2(
      SNS_OPT_IN_REGION_WARNING_CODE,
      `region ${JSON.stringify(region)} in additionalServicePrincipalRegions is not recognized by aws-cdk-lib/region-info; verify that it is an opt-in region`,
    );
  }
}
