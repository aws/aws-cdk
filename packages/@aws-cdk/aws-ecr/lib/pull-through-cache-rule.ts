import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnPullThroughCacheRule } from './ecr.generated';

/**
 * Properties for pull through cache rule
 */
export interface PullThroughCacheRuleProps {
  /**
   * The Amazon ECR repository prefix associated with the pull through cache rule.
   */
  readonly ecrRepositoryPrefix: string;

  /**
   * The upstream registry URL associated with the pull through cache rule.
   */
  readonly upstreamRegistryUrl: string;
}

/**
 * Define a ECR pull through cache rule. A pull through cache rule provides a way to cache images from an external public registry in your Amazon ECR private registry.
 */
export class PullThroughCacheRule extends Resource {

  constructor(scope: Construct, id: string, props: PullThroughCacheRuleProps) {
    super(scope, id);

    new CfnPullThroughCacheRule(this, 'Resource', {
      ecrRepositoryPrefix: props.ecrRepositoryPrefix,
      upstreamRegistryUrl: props.upstreamRegistryUrl,
    });
  }

}
