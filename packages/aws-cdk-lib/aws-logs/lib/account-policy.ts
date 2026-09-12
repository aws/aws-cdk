import type { Construct } from 'constructs';
import type { DataProtectionPolicy } from './data-protection-policy';
import type { FieldIndexPolicy } from './field-index-policy';
import type { Distribution } from './log-group';
import { CfnAccountPolicy } from './logs.generated';
import type { IFilterPattern } from './pattern';
import type { AccountPolicyDocumentConfig } from './private/account-policy-config';
import type { ILogSubscriptionDestination } from './subscription-filter';
import type { IProcessor } from './transformer';
import { KinesisDestination } from '../../aws-logs-destinations';
import { ArnFormat, Resource, Stack, Token, ValidationError } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { lit } from '../../core/lib/private/literal-string';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import type { AccountPolicyReference, IAccountPolicyRef, ILogGroupRef, LogGroupReference } from '../../interfaces/generated/aws-logs-interfaces.generated';

/**
 * Represents the contents of an account-level CloudWatch Logs policy.
 *
 * `AccountPolicy` applies a single policy document to an entire account, as opposed to
 * a single log group. Use one of the static factory methods (for example
 * `AccountPolicyDocument.subscriptionFilter()`) to create an instance for a specific
 * policy type.
 */
export abstract class AccountPolicyDocument {
  /**
   * Creates a subscription filter policy that applies to every log group in the account.
   */
  public static subscriptionFilter(props: SubscriptionFilterPolicyProps): AccountPolicyDocument {
    return new SubscriptionFilterPolicyDocument(props);
  }

  /**
   * Creates a data protection policy that applies to every log group in the account.
   */
  public static dataProtection(policy: DataProtectionPolicy): AccountPolicyDocument {
    return new DataProtectionAccountPolicyDocument(policy);
  }

  /**
   * Creates a field index policy that applies to every log group in the account (or a
   * subset of them).
   */
  public static fieldIndex(props: FieldIndexAccountPolicyProps): AccountPolicyDocument {
    return new FieldIndexAccountPolicyDocument(props);
  }

  /**
   * Creates a transformer policy that applies to every log group in the account (or a
   * subset of them).
   */
  public static transformer(props: TransformerAccountPolicyProps): AccountPolicyDocument {
    return new TransformerAccountPolicyDocument(props);
  }

  /**
   * Renders the CloudFormation representation of this policy document.
   *
   * @internal
   */
  public abstract _bind(scope: Construct): AccountPolicyDocumentConfig;
}

/**
 * Properties for an `AccountPolicy`.
 */
export interface AccountPolicyProps {
  /**
   * A name for the policy.
   *
   * This must be unique within the account.
   */
  readonly policyName: string;

  /**
   * The policy to apply to the account.
   *
   * Use one of the static factory methods on `AccountPolicyDocument`, for example
   * `AccountPolicyDocument.subscriptionFilter()`.
   */
  readonly policy: AccountPolicyDocument;
}

const ACCOUNT_POLICY_SYMBOL = Symbol.for('@aws-cdk/aws-logs.AccountPolicy');

/**
 * An account-level CloudWatch Logs policy.
 *
 * Unlike a log-group-level policy, an `AccountPolicy` applies to every log group in the
 * account (optionally scoped down to a subset of log groups).
 */
@propertyInjectable
export class AccountPolicy extends Resource implements IAccountPolicyRef {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-logs.AccountPolicy';

  /**
   * Return whether the given object is an `AccountPolicy`.
   */
  public static isAccountPolicy(x: any): x is AccountPolicy {
    return x !== null && typeof x === 'object' && ACCOUNT_POLICY_SYMBOL in x;
  }

  /**
   * The account ID of the account where this policy was created. For example, `123456789012`.
   *
   * @attribute
   */
  public readonly accountId: string;

  /**
   * The name of this policy.
   *
   * @attribute
   */
  public readonly policyName: string;

  /**
   * The type of this policy.
   *
   * @attribute
   */
  public readonly policyType: string;

  constructor(scope: Construct, id: string, props: AccountPolicyProps) {
    super(scope, id, {
      physicalName: props.policyName,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    Object.defineProperty(this, ACCOUNT_POLICY_SYMBOL, { value: true });

    const config = props.policy._bind(this);

    const resource = new CfnAccountPolicy(this, 'Resource', {
      policyName: this.physicalName,
      policyType: config.policyType,
      policyDocument: config.policyDocument,
      selectionCriteria: config.selectionCriteria,
    });

    this.accountId = resource.attrAccountId;
    this.policyName = resource.policyName;
    this.policyType = resource.policyType;
  }

  /**
   * A reference to this `AccountPolicy` resource.
   */
  public get accountPolicyRef(): AccountPolicyReference {
    return {
      accountId: this.accountId,
      policyType: this.policyType,
      policyName: this.policyName,
    };
  }
}

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

/**
 * A CloudWatch Logs account policy that applies a data protection policy to every log
 * group in the account.
 *
 * Create instances of this class using `AccountPolicyDocument.dataProtection()`.
 */
export class DataProtectionAccountPolicyDocument extends AccountPolicyDocument {
  constructor(private readonly policy: DataProtectionPolicy) {
    super();
  }

  /**
   * @internal
   */
  public _bind(scope: Construct): AccountPolicyDocumentConfig {
    const config = this.policy._bind(scope);

    return {
      policyType: 'DATA_PROTECTION_POLICY',
      policyDocument: JSON.stringify({
        Name: config.name,
        Description: config.description,
        Version: config.version,
        Statement: config.statement,
        Configuration: config.configuration,
      }),
    };
  }
}

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

/**
 * `IProcessor._render()` returns a single-entry object keyed by the camelCase processor
 * name (for example `parseToOcsf`). Unlike the log-group-level `AWS::Logs::Transformer`
 * resource — whose L1 property conversion PascalCases every key, including nested option
 * fields — the account-level `policyDocument` expects the processor's *own* raw camelCase
 * shape for everything except the top-level processor name itself, which must have its
 * acronym spelled out (for example `parseToOCSF`, not `parseToOcsf`) while keeping the
 * first letter lowercase. Nested fields (`ocsfVersion`, `overwriteIfExists`, etc.) must
 * stay exactly as `_render()` produced them — PascalCasing them is silently ignored by the
 * service rather than rejected.
 *
 * Confirmed against the real `PutAccountPolicy` API (not just documentation): a live test
 * call showed a PascalCased nested field is silently dropped, and the `InvalidParameterException`
 * for an unrecognized processor name lists the exact expected spelling for every processor.
 */
const PROCESSOR_KEY_OVERRIDES: Record<string, string> = {
  parseJson: 'parseJSON',
  parseToOcsf: 'parseToOCSF',
  parseVpc: 'parseVPC',
  parseWaf: 'parseWAF',
};

function toAccountPolicyProcessor(rendered: Record<string, any>): Record<string, any> {
  const [key, value] = Object.entries(rendered)[0];
  return { [PROCESSOR_KEY_OVERRIDES[key] ?? key]: value };
}

/**
 * Properties for a transformer account policy.
 */
export interface TransformerAccountPolicyProps {
  /**
   * The processors to apply, in order.
   */
  readonly processors: IProcessor[];

  /**
   * Restrict this policy to log groups whose name starts with this prefix.
   *
   * Cannot be used together with `selectionCriteria`.
   *
   * @default - applies to all log groups in the account
   */
  readonly logGroupNamePrefix?: string;

  /**
   * Escape hatch: the raw `selectionCriteria` expression to send to CloudFormation.
   *
   * Use this if `logGroupNamePrefix` doesn't cover your case. Cannot be used together with
   * `logGroupNamePrefix`.
   *
   * @default - derived from `logGroupNamePrefix`
   */
  readonly selectionCriteria?: string;
}

/**
 * A CloudWatch Logs account policy that applies a transformer policy to every log group in
 * the account (or a subset of them).
 *
 * Create instances of this class using `AccountPolicyDocument.transformer()`.
 */
export class TransformerAccountPolicyDocument extends AccountPolicyDocument {
  constructor(private readonly props: TransformerAccountPolicyProps) {
    super();
  }

  /**
   * @internal
   */
  public _bind(scope: Construct): AccountPolicyDocumentConfig {
    if (this.props.logGroupNamePrefix !== undefined && this.props.selectionCriteria) {
      throw new ValidationError(lit`ConflictingSelectionCriteria`, 'logGroupNamePrefix and selectionCriteria cannot both be specified', scope);
    }

    return {
      policyType: 'TRANSFORMER_POLICY',
      // Unlike the log-group-level AWS::Logs::Transformer resource (whose CfnTransformer.transformerConfig
      // CFN property is named TransformerConfig), the account-level policyDocument is just the processor
      // array on its own — no wrapping object. Confirmed via a live PutAccountPolicy call.
      policyDocument: JSON.stringify(this.props.processors.map(processor => toAccountPolicyProcessor(processor._render()))),
      selectionCriteria: this.props.selectionCriteria
        ?? (this.props.logGroupNamePrefix !== undefined ? `LogGroupNamePrefix = "${this.props.logGroupNamePrefix}"` : undefined),
    };
  }
}
