import type { Construct } from 'constructs';
import { AccountPolicyDocument } from './account-policy';
import type { FieldIndexPolicy } from './field-index-policy';
import type { AccountPolicyDocumentConfig } from './private/account-policy-config';
import { ValidationError } from '../../core';
import { lit } from '../../core/lib/private/literal-string';

/**
 * A CloudWatch Logs vended-log data source, identified by a name and type pair.
 *
 * Used to scope a field index policy to a specific AWS log source (for example, VPC Flow
 * Logs) instead of a log group name prefix.
 */
export class FieldIndexDataSource {
  /**
   * VPC Flow Logs.
   */
  public static readonly VPC_FLOW_LOGS = new FieldIndexDataSource('amazon_vpc', 'flow');

  /**
   * Route 53 resolver query logs.
   */
  public static readonly ROUTE53_RESOLVER_QUERY_LOGS = new FieldIndexDataSource('amazon_route53', 'resolver_query');

  /**
   * AWS WAF access logs.
   */
  public static readonly WAF_ACCESS_LOGS = new FieldIndexDataSource('aws_waf', 'access');

  /**
   * AWS CloudTrail data events.
   */
  public static readonly CLOUDTRAIL_DATA_EVENTS = new FieldIndexDataSource('aws_cloudtrail', 'data');

  /**
   * AWS CloudTrail management events.
   */
  public static readonly CLOUDTRAIL_MANAGEMENT_EVENTS = new FieldIndexDataSource('aws_cloudtrail', 'management');

  /**
   * Create a data source not in the list of static members. This is used to maintain
   * forward compatibility, in case AWS adds a new data source not yet reflected in CDK.
   *
   * @param name the data source name
   * @param type the data source type
   */
  constructor(public readonly name: string, public readonly type: string) {
  }
}

/**
 * Properties for a field index account policy.
 */
export interface FieldIndexAccountPolicyProps {
  /**
   * The field index policy to apply.
   */
  readonly policy: FieldIndexPolicy;

  /**
   * Restrict this policy to log groups whose name starts with this prefix.
   *
   * Cannot be used together with `dataSource` or `selectionCriteria`.
   *
   * @default - applies to all log groups in the account
   */
  readonly logGroupNamePrefix?: string;

  /**
   * Restrict this policy to a specific vended-log data source, for example VPC Flow Logs.
   *
   * Cannot be used together with `logGroupNamePrefix` or `selectionCriteria`.
   *
   * @default - not restricted by data source
   */
  readonly dataSource?: FieldIndexDataSource;

  /**
   * Escape hatch: the raw `selectionCriteria` expression to send to CloudFormation.
   *
   * Use this if `logGroupNamePrefix` and `dataSource` don't cover your case. Cannot be used
   * together with `logGroupNamePrefix` or `dataSource`.
   *
   * @default - derived from `logGroupNamePrefix` or `dataSource`
   */
  readonly selectionCriteria?: string;
}

/**
 * A CloudWatch Logs account policy that applies a field index policy to every log group
 * in the account (or a subset of them).
 *
 * Create instances of this class using `AccountPolicyDocument.fieldIndex()`.
 */
export class FieldIndexAccountPolicyDocument extends AccountPolicyDocument {
  constructor(private readonly props: FieldIndexAccountPolicyProps) {
    super();
  }

  /**
   * @internal
   */
  public _bind(scope: Construct): AccountPolicyDocumentConfig {
    const specifiedCount = [this.props.logGroupNamePrefix, this.props.dataSource, this.props.selectionCriteria]
      .filter(value => value !== undefined).length;
    if (specifiedCount > 1) {
      throw new ValidationError(lit`ConflictingSelectionCriteria`, 'only one of logGroupNamePrefix, dataSource, or selectionCriteria can be specified', scope);
    }

    return {
      policyType: 'FIELD_INDEX_POLICY',
      policyDocument: JSON.stringify(this.props.policy._bind(scope)),
      selectionCriteria: this.renderSelectionCriteria(),
    };
  }

  private renderSelectionCriteria(): string | undefined {
    if (this.props.selectionCriteria) {
      return this.props.selectionCriteria;
    }
    if (this.props.logGroupNamePrefix !== undefined) {
      return `LogGroupNamePrefix = "${this.props.logGroupNamePrefix}"`;
    }
    if (this.props.dataSource) {
      return `DataSourceName = "${this.props.dataSource.name}" AND DataSourceType = "${this.props.dataSource.type}"`;
    }
    return undefined;
  }
}
