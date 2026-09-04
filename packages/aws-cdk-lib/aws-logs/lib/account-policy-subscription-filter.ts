import type { Construct } from 'constructs';
import { AccountPolicyDocument } from './account-policy';
import type { Distribution } from './log-group';
import type { IFilterPattern } from './pattern';
import type { AccountPolicyDocumentConfig } from './private/account-policy-config';
import type { ILogSubscriptionDestination } from './subscription-filter';
import { KinesisDestination } from '../../aws-logs-destinations';
import { ArnFormat, Resource, Stack, Token, ValidationError } from '../../core';
import { lit } from '../../core/lib/private/literal-string';
import type { ILogGroupRef, LogGroupReference } from '../../interfaces/generated/aws-logs-interfaces.generated';

/**
 * Properties for a subscription filter account policy.
 */
export interface SubscriptionFilterPolicyProps {
  /**
   * The destination to send matching log events to.
   *
   * Supports the same destinations as a log-group-level `SubscriptionFilter`: an Kinesis
   * Data Streams data stream, a Firehose data stream, a Lambda function, or a
   * cross-account logical destination.
   */
  readonly destination: ILogSubscriptionDestination;

  /**
   * The filter pattern to apply.
   *
   * Required by CloudWatch Logs for account-level subscription filter policies (unlike the
   * log-group-level `SubscriptionFilter`'s equivalent property, this cannot be omitted — the
   * service rejects a policy document with no `FilterPattern`). Use `FilterPattern.allEvents()`
   * to match every log event.
   */
  readonly filterPattern: IFilterPattern;

  /**
   * The method used to distribute log data to the destination.
   *
   * This property can only be used when `destination` is a Kinesis Data Streams data
   * stream.
   *
   * @default Distribution.BY_LOG_STREAM
   */
  readonly distribution?: Distribution;

  /**
   * Log groups to exclude from this policy.
   *
   * All other log groups in the account are subscribed. Cannot be used together with
   * `selectionCriteria`.
   *
   * @default - the policy applies to every log group in the account
   */
  readonly excludeLogGroups?: string[];

  /**
   * Escape hatch: the raw `selectionCriteria` expression to send to CloudFormation.
   *
   * Use this if `excludeLogGroups` doesn't cover your case, for example if AWS adds a new
   * `selectionCriteria` operator for subscription filter policies that isn't yet modeled by
   * `excludeLogGroups`. Cannot be used together with `excludeLogGroups`.
   *
   * @default - derived from `excludeLogGroups`
   */
  readonly selectionCriteria?: string;
}

/**
 * A CloudWatch Logs account policy that subscribes every log group in the account (or a
 * subset of them) to a single destination.
 *
 * Create instances of this class using `AccountPolicyDocument.subscriptionFilter()`.
 */
export class SubscriptionFilterPolicyDocument extends AccountPolicyDocument {
  constructor(private readonly props: SubscriptionFilterPolicyProps) {
    super();
  }

  /**
   * @internal
   */
  public _bind(scope: Construct): AccountPolicyDocumentConfig {
    if (this.props.excludeLogGroups && this.props.selectionCriteria) {
      throw new ValidationError(lit`ConflictingSelectionCriteria`, 'excludeLogGroups and selectionCriteria cannot both be specified', scope);
    }

    if (
      this.props.distribution &&
      !Token.isUnresolved(this.props.distribution) &&
      !Token.isUnresolved(this.props.destination) &&
      !(this.props.destination instanceof KinesisDestination)
    ) {
      throw new ValidationError(lit`DistributionPropertyKinesisDestination`, 'distribution property can only be used with KinesisDestination.', scope);
    }

    const sourceLogGroup = getOrCreateAccountWideLogGroupRef(scope);
    const destConfig = this.props.destination.bind(scope, sourceLogGroup);

    return {
      policyType: 'SUBSCRIPTION_FILTER_POLICY',
      policyDocument: JSON.stringify({
        DestinationArn: destConfig.arn,
        RoleArn: destConfig.role?.roleArn,
        FilterPattern: this.props.filterPattern.logPatternString,
        Distribution: this.props.distribution,
      }),
      selectionCriteria: this.props.selectionCriteria ?? renderExcludeLogGroups(this.props.excludeLogGroups),
    };
  }
}

function renderExcludeLogGroups(excludeLogGroups: string[] | undefined): string | undefined {
  if (!excludeLogGroups || excludeLogGroups.length === 0) {
    return undefined;
  }
  return `LogGroupName NOT IN ${JSON.stringify(excludeLogGroups)}`;
}

const ACCOUNT_WIDE_LOG_GROUP_REF_ID = 'AccountWideLogGroupRef';

function getOrCreateAccountWideLogGroupRef(scope: Construct): ILogGroupRef {
  const existing = scope.node.tryFindChild(ACCOUNT_WIDE_LOG_GROUP_REF_ID);
  if (existing) {
    return existing as AccountWideLogGroupRef;
  }
  return new AccountWideLogGroupRef(scope, ACCOUNT_WIDE_LOG_GROUP_REF_ID);
}

/**
 * A stand-in for a "log group" that represents every log group in the account.
 *
 * `ILogSubscriptionDestination` implementations (in particular `LambdaDestination`) expect a
 * real `ILogGroupRef` to scope their permissions to. Since an account policy has no single
 * log group, this construct provides a wildcard log group ARN
 * (`arn:aws:logs:<region>:<account>:log-group:*`) instead.
 */
class AccountWideLogGroupRef extends Resource implements ILogGroupRef {
  public readonly logGroupRef: LogGroupReference;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const arn = Stack.of(this).formatArn({
      service: 'logs',
      resource: 'log-group',
      resourceName: '*',
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });
    this.logGroupRef = { logGroupName: '*', logGroupArn: arn };
  }
}
