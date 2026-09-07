import type { IConstruct } from 'constructs';
import type { IAspect } from '../../../core';
import { CfnResource, Stack, Token, UnscopedValidationError } from '../../../core';
import { lit } from '../../../core/lib/private/literal-string';
import { CfnSubscriptionFilter } from '../logs.generated';

/**
 * Properties for `SubscriptionFilterSequencingAspect`.
 */
export interface SubscriptionFilterSequencingAspectProps {
  /**
   * The maximum number of subscription filters that CloudFormation may deploy
   * concurrently in each stack.
   *
   * Subscription filters are distributed round-robin over this many parallel
   * dependency chains, so at most this many filters are created, updated or
   * deleted at the same time.
   *
   * The default matches the default rate limit of the CloudWatch Logs API
   * that throttles these deployments (`DescribeSubscriptionFilters`, 5
   * requests per second), so values above 5 do not speed up deployment and
   * reintroduce the risk of throttling. Lower the value if your deployments
   * are still throttled, for example because other workloads in the account
   * consume the same rate limit.
   *
   * @default 5
   */
  readonly maxConcurrency?: number;
}

/**
 * An aspect that limits how many CloudWatch Logs subscription filters
 * CloudFormation deploys in parallel, to avoid "Rate exceeded" errors.
 *
 * CloudFormation creates independent `AWS::Logs::SubscriptionFilter` resources
 * in parallel. The resource handler for this type calls the
 * `DescribeSubscriptionFilters` API, which has a low rate limit, so stacks
 * containing many subscription filters can fail to deploy with a
 * "Rate exceeded" error.
 *
 * Applying this aspect chains the subscription filters in each stack with
 * dependencies, so CloudFormation deploys at most `maxConcurrency` of them
 * at the same time instead of all at once. Filters are chained in construct
 * tree order, which is stable across synthesis of an unchanged app.
 *
 * The dependencies also apply to updates, replacements and deletes, so
 * deployments that touch many subscription filters will be slower; only apply
 * this aspect if you are affected by the rate limit. Subscription filters are
 * chained independently per stack, including nested stacks, because
 * CloudFormation dependencies cannot span stacks.
 */
export class SubscriptionFilterSequencingAspect implements IAspect {
  private readonly maxConcurrency: number;
  private readonly chainTails = new Map<Stack, CfnResource[]>();
  private readonly filterCount = new Map<Stack, number>();
  private readonly visited = new Set<CfnResource>();

  constructor(props: SubscriptionFilterSequencingAspectProps = {}) {
    const maxConcurrency = props.maxConcurrency ?? 5;
    if (Token.isUnresolved(maxConcurrency)) {
      throw new UnscopedValidationError(lit`MaxConcurrencyUnresolvedToken`, 'maxConcurrency cannot be an unresolved token');
    }
    if (!Number.isInteger(maxConcurrency) || maxConcurrency < 1) {
      throw new UnscopedValidationError(lit`MaxConcurrencyNotPositiveInteger`, `maxConcurrency must be a positive integer, got ${JSON.stringify(maxConcurrency)}`);
    }
    this.maxConcurrency = maxConcurrency;
  }

  public visit(node: IConstruct): void {
    if (
      !CfnResource.isCfnResource(node) ||
      node.cfnResourceType !== CfnSubscriptionFilter.CFN_RESOURCE_TYPE_NAME ||
      this.visited.has(node)
    ) {
      return;
    }
    this.visited.add(node);

    const stack = Stack.of(node);
    const count = this.filterCount.get(stack) ?? 0;
    this.filterCount.set(stack, count + 1);

    let tails = this.chainTails.get(stack);
    if (tails === undefined) {
      tails = [];
      this.chainTails.set(stack, tails);
    }

    const chainIndex = count % this.maxConcurrency;
    const previous = tails[chainIndex];
    if (previous !== undefined) {
      node.addResourceDependency(previous);
    }
    tails[chainIndex] = node;
  }
}
