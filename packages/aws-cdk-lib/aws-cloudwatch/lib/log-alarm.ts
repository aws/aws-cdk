import type { Construct } from 'constructs';
import type { ComparisonOperator, TreatMissingData } from './alarm';
import type { IAlarmAction } from './alarm-action';
import type { IAlarm } from './alarm-base';
import { AlarmBase } from './alarm-base';
import { CfnLogAlarm } from './cloudwatch.generated';
import { isAnomalyDetectionOperator } from './private/anomaly-detection';
import type { IRole } from '../../aws-iam';
import { PolicyStatement, Role, ServicePrincipal } from '../../aws-iam';
import { Annotations, ArnFormat, Stack, Token, Tokenization, ValidationError } from '../../core';
import type { Duration } from '../../core';
import { memoizedGetter } from '../../core/lib/helpers-internal';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { lit } from '../../core/lib/private/literal-string';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import type { ILogGroupRef } from '../../interfaces/generated/aws-logs-interfaces.generated';

/**
 * Schedule for the CloudWatch Logs scheduled query that backs a log alarm.
 */
export interface ScheduledQuerySchedule {
  /**
   * How often the scheduled query runs.
   *
   * Rendered to a `rate(...)` schedule expression, so only whole numbers of
   * minutes or hours are supported.
   */
  readonly rate: Duration;

  /**
   * How far into the past the query window starts, relative to each run.
   *
   * Must be between 1 second and 2592000 seconds (30 days). This is required by
   * the scheduled query service; omitting it causes the alarm creation to be
   * rejected at deploy time.
   */
  readonly startTimeOffset: Duration;

  /**
   * How far into the past the query window ends, relative to each run.
   *
   * Must be between 0 seconds and 2592000 seconds (30 days).
   *
   * @default - no end offset
   */
  readonly endTimeOffset?: Duration;
}

/**
 * Configuration of the scheduled query that a log alarm evaluates.
 */
export interface ScheduledQueryConfiguration {
  /**
   * The query to run against the log groups.
   */
  readonly queryString: string;

  /**
   * The aggregation expression applied to the query results.
   *
   * For example `count(*)` or `avg(latency) by host`.
   */
  readonly aggregationExpression: string;

  /**
   * The log groups that the query runs against.
   *
   * Up to 50 log groups can be specified. Not required for CWLI queries that
   * select their log groups inline via a `SOURCE` clause.
   *
   * Log groups that live outside the current app can be referenced with
   * `LogGroup.fromLogGroupName()` or `LogGroup.fromLogGroupArn()`.
   *
   * @default - no log groups; the query must select its log groups inline
   */
  readonly logGroups?: ILogGroupRef[];

  /**
   * The IAM role that grants CloudWatch permission to run the scheduled query.
   *
   * Typed as `IRole` rather than `IRoleRef` because the construct adds the query
   * permissions to this role's policy, which requires `addToPrincipalPolicy`.
   *
   * [disable-awslint:prefer-ref-interface]
   *
   * @default - a role that CloudWatch Logs can assume to run the query is created automatically
   */
  readonly scheduledQueryRole?: IRole;

  /**
   * The schedule on which the query runs and the time window it evaluates.
   */
  readonly schedule: ScheduledQuerySchedule;

  /**
   * Tags to apply to the scheduled query that backs the alarm.
   *
   * The scheduled query is a separate CloudWatch Logs resource, so these are
   * independent of the tags applied to the alarm itself. At most 50 tags.
   *
   * @default - no tags
   */
  readonly tags?: { [key: string]: string };
}

/**
 * Properties for creating a log alarm.
 */
export interface LogAlarmProps {
  /**
   * The value against which the aggregated query result is compared.
   */
  readonly threshold: number;

  /**
   * The comparison used to test the aggregated query result against the threshold.
   *
   * Only the static-threshold operators are supported; anomaly-detection
   * operators are not valid for a log alarm.
   */
  readonly comparisonOperator: ComparisonOperator;

  /**
   * The number of most recent query results to evaluate.
   *
   * This is the "N" of the M-out-of-N evaluation and must be between 1 and 100.
   */
  readonly queryResultsToEvaluate: number;

  /**
   * The number of breaching query results within the evaluation window that put the alarm into ALARM state.
   *
   * This is the "M" of the M-out-of-N evaluation and must not exceed
   * `queryResultsToEvaluate`.
   */
  readonly queryResultsToAlarm: number;

  /**
   * Configuration of the scheduled query that this alarm evaluates.
   */
  readonly scheduledQueryConfiguration: ScheduledQueryConfiguration;

  /**
   * Name of the alarm.
   *
   * Must be between 1 and 255 characters. Changing the name of an existing
   * alarm replaces it, because the name is the alarm's physical identifier.
   *
   * @default - Automatically generated name
   */
  readonly logAlarmName?: string;

  /**
   * Description for the alarm.
   *
   * @default - No description
   */
  readonly alarmDescription?: string;

  /**
   * Whether the actions for this alarm are enabled.
   *
   * @default true
   */
  readonly actionsEnabled?: boolean;

  /**
   * How the alarm treats missing query results.
   *
   * @default - the service default of MISSING
   */
  readonly treatMissingData?: TreatMissingData;

  /**
   * The number of matching log lines to include in alarm notifications.
   *
   * Must be between 0 and 50.
   *
   * @default - no log lines are included in notifications
   */
  readonly actionLogLineCount?: number;

  /**
   * The IAM role used to read the log lines included in notifications.
   *
   * Typed as `IRole` rather than `IRoleRef` because the construct adds the
   * log-line read permission to this role's policy, which requires
   * `addToPrincipalPolicy`.
   *
   * [disable-awslint:prefer-ref-interface]
   *
   * @default - when actionLogLineCount is greater than 0, a role that CloudWatch can assume to
   * read the log lines is created automatically; otherwise no role
   */
  readonly actionLogLineRole?: IRole;

  /**
   * Actions to invoke when the alarm transitions to ALARM state.
   *
   * @default - no alarm actions; actions can also be added with addAlarmAction()
   */
  readonly alarmActions?: IAlarmAction[];

  /**
   * Actions to invoke when the alarm transitions to OK state.
   *
   * @default - no OK actions; actions can also be added with addOkAction()
   */
  readonly okActions?: IAlarmAction[];

  /**
   * Actions to invoke when the alarm transitions to INSUFFICIENT_DATA state.
   *
   * @default - no insufficient-data actions; actions can also be added with addInsufficientDataAction()
   */
  readonly insufficientDataActions?: IAlarmAction[];

  /**
   * Tags to apply to the alarm.
   *
   * At most 50 tags.
   *
   * @default - no tags
   */
  readonly tags?: { [key: string]: string };
}

/**
 * A CloudWatch alarm evaluated against the results of a scheduled Logs query.
 *
 * Unlike a metric alarm, a log alarm runs a query against one or more log
 * groups on a schedule and alarms on the aggregated results.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-logalarm.html
 * @resource AWS::CloudWatch::LogAlarm
 */
@propertyInjectable
export class LogAlarm extends AlarmBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-cloudwatch.LogAlarm';

  /**
   * Import an existing log alarm provided an ARN.
   */
  public static fromLogAlarmArn(scope: Construct, id: string, alarmArn: string): IAlarm {
    class Import extends AlarmBase implements IAlarm {
      public readonly alarmArn = alarmArn;
      public readonly alarmName = Stack.of(scope).splitArn(alarmArn, ArnFormat.COLON_RESOURCE_NAME).resourceName!;
    }
    return new Import(scope, id);
  }

  /**
   * Import an existing log alarm provided a Name.
   */
  public static fromLogAlarmName(scope: Construct, id: string, alarmName: string): IAlarm {
    const stack = Stack.of(scope);
    return this.fromLogAlarmArn(scope, id, stack.formatArn({
      service: 'cloudwatch',
      resource: 'alarm',
      resourceName: alarmName,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    }));
  }

  /**
   * The IAM role that CloudWatch Logs assumes to run the scheduled query.
   *
   * This is the role passed via `scheduledQueryConfiguration.scheduledQueryRole`, or the role
   * created automatically when none was provided.
   */
  public readonly scheduledQueryRole: IRole;

  /**
   * The IAM role that CloudWatch assumes to read log lines for notifications.
   *
   * This is the role passed via `actionLogLineRole`, or the role created automatically when
   * `actionLogLineCount` is greater than 0 and no role was provided. Undefined when no log lines
   * are included in notifications.
   */
  public readonly actionLogLineRole?: IRole;

  private readonly alarm: CfnLogAlarm;

  constructor(scope: Construct, id: string, props: LogAlarmProps) {
    super(scope, id, {
      physicalName: props.logAlarmName,
    });

    addConstructMetadata(this, props);

    if (isAnomalyDetectionOperator(props.comparisonOperator)) {
      throw new ValidationError(lit`InvalidComparisonOperator`, `comparisonOperator ${JSON.stringify(props.comparisonOperator)} is not supported by log alarms; use one of the static-threshold operators`, this);
    }

    if (!Token.isUnresolved(props.queryResultsToEvaluate)
      && (!Number.isInteger(props.queryResultsToEvaluate) || props.queryResultsToEvaluate < 1 || props.queryResultsToEvaluate > 100)) {
      throw new ValidationError(lit`InvalidQueryResultsToEvaluate`, `queryResultsToEvaluate must be an integer between 1 and 100, got ${props.queryResultsToEvaluate}`, this);
    }

    if (!Token.isUnresolved(props.queryResultsToAlarm) && (!Number.isInteger(props.queryResultsToAlarm) || props.queryResultsToAlarm < 1)) {
      throw new ValidationError(lit`InvalidQueryResultsToAlarm`, `queryResultsToAlarm must be a positive integer, got ${props.queryResultsToAlarm}`, this);
    }

    if (!Token.isUnresolved(props.queryResultsToEvaluate) && !Token.isUnresolved(props.queryResultsToAlarm)
      && props.queryResultsToAlarm > props.queryResultsToEvaluate) {
      throw new ValidationError(lit`InvalidQueryResults`, `queryResultsToAlarm must not exceed queryResultsToEvaluate, got ${props.queryResultsToAlarm} > ${props.queryResultsToEvaluate}`, this);
    }

    if (props.actionLogLineCount !== undefined && !Token.isUnresolved(props.actionLogLineCount)
      && (!Number.isInteger(props.actionLogLineCount) || props.actionLogLineCount < 0 || props.actionLogLineCount > 50)) {
      throw new ValidationError(lit`InvalidActionLogLineCount`, `actionLogLineCount must be an integer between 0 and 50, got ${props.actionLogLineCount}`, this);
    }

    const sqc = props.scheduledQueryConfiguration;

    if (props.logAlarmName !== undefined && !Token.isUnresolved(props.logAlarmName)
      && (props.logAlarmName.length < 1 || props.logAlarmName.length > 255)) {
      throw new ValidationError(lit`InvalidLogAlarmName`, `logAlarmName must be between 1 and 255 characters, got ${props.logAlarmName.length}`, this);
    }

    this.validateTagCount('tags', props.tags);
    this.validateTagCount('scheduledQueryConfiguration.tags', sqc.tags);

    // The scheduled query service requires between 1 and 50 log groups when the
    // property is present; an empty array is rejected at deploy time.
    const logGroups = sqc.logGroups;
    if (logGroups !== undefined && !Token.isUnresolved(logGroups) && (logGroups.length < 1 || logGroups.length > 50)) {
      throw new ValidationError(lit`InvalidLogGroups`, `logGroups must contain between 1 and 50 entries, got ${logGroups.length}`, this);
    }

    if (!Token.isUnresolved(sqc.queryString) && (sqc.queryString.length < 1 || sqc.queryString.length > 10000)) {
      throw new ValidationError(lit`InvalidQueryString`, `queryString must be between 1 and 10000 characters, got ${sqc.queryString.length}`, this);
    }

    if (!Token.isUnresolved(sqc.aggregationExpression) && sqc.aggregationExpression.length > 2048) {
      throw new ValidationError(lit`InvalidAggregationExpression`, `aggregationExpression can be at most 2048 characters, got ${sqc.aggregationExpression.length}`, this);
    }

    if (!sqc.schedule.startTimeOffset.isUnresolved()) {
      const startOffsetSeconds = sqc.schedule.startTimeOffset.toSeconds();
      if (startOffsetSeconds < 1 || startOffsetSeconds > 2592000) {
        throw new ValidationError(lit`InvalidStartTimeOffset`, `startTimeOffset must be between 1 second and 2592000 seconds (30 days), got ${startOffsetSeconds} seconds`, this);
      }
    }

    if (sqc.schedule.endTimeOffset !== undefined && !sqc.schedule.endTimeOffset.isUnresolved()) {
      const endOffsetSeconds = sqc.schedule.endTimeOffset.toSeconds();
      if (endOffsetSeconds < 0 || endOffsetSeconds > 2592000) {
        throw new ValidationError(lit`InvalidEndTimeOffset`, `endTimeOffset must be between 0 seconds and 2592000 seconds (30 days), got ${endOffsetSeconds} seconds`, this);
      }
    }

    props.alarmActions?.forEach(action => this.addAlarmAction(action));
    props.okActions?.forEach(action => this.addOkAction(action));
    props.insufficientDataActions?.forEach(action => this.addInsufficientDataAction(action));

    this.scheduledQueryRole = sqc.scheduledQueryRole
      ?? this.createServiceRole('ScheduledQueryRole', 'logs.amazonaws.com', 'logs', 'scheduled-query');
    this.grantRunQuery(this.scheduledQueryRole, sqc.logGroups);

    const includesLogLines = props.actionLogLineCount !== undefined
      && (Token.isUnresolved(props.actionLogLineCount) || props.actionLogLineCount > 0);
    if (props.actionLogLineRole !== undefined && !includesLogLines) {
      throw new ValidationError(lit`ActionLogLineRoleWithoutLogLines`, 'actionLogLineRole is only used when actionLogLineCount is greater than 0; set actionLogLineCount or remove the role', this);
    }
    this.actionLogLineRole = props.actionLogLineRole
      ?? (includesLogLines ? this.createServiceRole('LogLineRole', 'cloudwatch.amazonaws.com', 'cloudwatch', 'alarm') : undefined);
    if (this.actionLogLineRole !== undefined) {
      this.grantReadLogLines(this.actionLogLineRole, sqc.logGroups);
    }

    this.alarm = new CfnLogAlarm(this, 'Resource', {
      alarmName: this.physicalName,
      alarmDescription: props.alarmDescription,
      actionsEnabled: props.actionsEnabled,
      comparisonOperator: props.comparisonOperator,
      threshold: props.threshold,
      queryResultsToEvaluate: props.queryResultsToEvaluate,
      queryResultsToAlarm: props.queryResultsToAlarm,
      treatMissingData: props.treatMissingData,
      actionLogLineCount: props.actionLogLineCount,
      actionLogLineRoleArn: this.actionLogLineRole?.roleArn,
      alarmActions: Token.asList(this._alarmActionArns),
      insufficientDataActions: Token.asList(this._insufficientDataActionArns),
      okActions: Token.asList(this._okActionArns),
      tags: this.renderTags(props.tags),
      scheduledQueryConfiguration: this.renderScheduledQuery(sqc),
    });
  }

  /**
   * ARN of this alarm.
   *
   * @attribute
   */
  @memoizedGetter
  public get alarmArn(): string {
    return this.getResourceArnAttribute(this.alarm.attrArn, {
      service: 'cloudwatch',
      resource: 'alarm',
      resourceName: this.physicalName,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });
  }

  /**
   * Name of this alarm.
   *
   * @attribute
   */
  @memoizedGetter
  public get alarmName(): string {
    return this.getResourceNameAttribute(this.alarm.ref);
  }

  /**
   * Trigger these actions when the alarm transitions to ALARM state.
   *
   * Log alarms support SNS notification, Lambda, and Systems Manager OpsItem
   * actions. Other action types (for example CloudWatch investigation or
   * Systems Manager Incident) are not supported and are ignored by the service.
   */
  public addAlarmAction(...actions: IAlarmAction[]) {
    this._alarmActionArns.push(...actions.map(a => this.bindAndWarn(a)));
  }

  /**
   * Trigger these actions when the alarm transitions to OK state.
   *
   * Log alarms support SNS notification, Lambda, and Systems Manager OpsItem
   * actions. Other action types (for example CloudWatch investigation or
   * Systems Manager Incident) are not supported and are ignored by the service.
   */
  public addOkAction(...actions: IAlarmAction[]) {
    this._okActionArns.push(...actions.map(a => this.bindAndWarn(a)));
  }

  /**
   * Trigger these actions when the alarm transitions to INSUFFICIENT_DATA state.
   *
   * Log alarms support SNS notification, Lambda, and Systems Manager OpsItem
   * actions. Other action types (for example CloudWatch investigation or
   * Systems Manager Incident) are not supported and are ignored by the service.
   */
  public addInsufficientDataAction(...actions: IAlarmAction[]) {
    this._insufficientDataActionArns.push(...actions.map(a => this.bindAndWarn(a)));
  }

  private bindAndWarn(action: IAlarmAction): string {
    const arn = action.bind(this, this).alarmActionArn;
    // Action ARNs are frequently unresolved tokens (derived from other constructs), which
    // cannot be inspected at synth time; this is a best-effort check on literal ARNs only.
    if (!Token.isUnresolved(arn)) {
      const service = Stack.of(this).splitArn(arn, ArnFormat.COLON_RESOURCE_NAME).service;
      if (service === 'aiops' || service === 'ssm-incidents') {
        Annotations.of(this).addWarningV2('aws-cdk-lib/aws-cloudwatch:logAlarmUnsupportedAction',
          `log alarms do not support ${service} actions; supported actions are SNS, Lambda, and Systems Manager OpsItem. This action will be ignored by the service. Got ${JSON.stringify(arn)}`);
      }
    }
    return arn;
  }

  private validateTagCount(propName: string, tags?: { [key: string]: string }): void {
    if (tags !== undefined && Object.keys(tags).length > 50) {
      throw new ValidationError(lit`TooManyTags`, `${propName} can contain at most 50 tags, got ${Object.keys(tags).length}`, this);
    }
  }

  private renderTags(tags?: { [key: string]: string }): Array<{ key: string; value: string }> | undefined {
    return tags && Object.entries(tags).map(([key, value]) => ({ key, value }));
  }

  private renderScheduledQuery(config: ScheduledQueryConfiguration): CfnLogAlarm.ScheduledQueryConfigurationProperty {
    return {
      queryString: config.queryString,
      aggregationExpression: config.aggregationExpression,
      logGroupIdentifiers: config.logGroups?.map(lg => lg.logGroupRef.logGroupName),
      scheduledQueryRoleArn: this.scheduledQueryRole.roleArn,
      scheduleConfiguration: {
        scheduleExpression: this.renderRate(config.schedule.rate),
        startTimeOffset: config.schedule.startTimeOffset.toSeconds(),
        endTimeOffset: config.schedule.endTimeOffset?.toSeconds(),
      },
      tags: this.renderTags(config.tags),
    };
  }

  /**
   * Add a statement to the policy of the role that runs the scheduled query.
   *
   * No-ops if the role was imported as immutable.
   */
  public addToRolePolicy(statement: PolicyStatement): void {
    this.scheduledQueryRole.addToPrincipalPolicy(statement);
  }

  /**
   * Create a role that a CloudWatch service principal can assume, restricted to
   * this account and to the given source ARN pattern to prevent confused-deputy
   * access.
   */
  private createServiceRole(id: string, servicePrincipal: string, sourceService: string, sourceResource: string): IRole {
    const stack = Stack.of(this);
    return new Role(this, id, {
      assumedBy: new ServicePrincipal(servicePrincipal, {
        conditions: {
          StringEquals: { 'aws:SourceAccount': stack.account },
          ArnLike: {
            'aws:SourceArn': stack.formatArn({
              service: sourceService,
              resource: sourceResource,
              resourceName: '*',
              arnFormat: ArnFormat.COLON_RESOURCE_NAME,
            }),
          },
        },
      }),
    });
  }

  /**
   * Grant a role the permissions needed to run the scheduled query.
   *
   * Applied to the role this construct creates and to a role passed in by the
   * caller. Passing an imported immutable role (`Role.fromRoleArn` with
   * `mutable: false`) turns these additions into no-ops.
   */
  private grantRunQuery(role: IRole, logGroups?: ILogGroupRef[]): void {
    role.addToPrincipalPolicy(new PolicyStatement({
      actions: ['logs:StartQuery', 'logs:StopQuery', 'logs:GetQueryResults'],
      resources: this.logGroupPolicyResources(logGroups),
    }));
    role.addToPrincipalPolicy(new PolicyStatement({
      actions: ['logs:DescribeLogGroups'],
      resources: ['*'],
    }));
  }

  private grantReadLogLines(role: IRole, logGroups?: ILogGroupRef[]): void {
    role.addToPrincipalPolicy(new PolicyStatement({
      actions: ['logs:GetQueryResults'],
      resources: this.logGroupPolicyResources(logGroups),
    }));
  }

  /**
   * Resource ARNs to scope log group permissions to.
   *
   * Uses `logGroupArn`, which carries the trailing `:*` that IAM expects for log
   * group resources. Falls back to every log group in the region when the query
   * selects its log groups inline.
   */
  private logGroupPolicyResources(logGroups?: ILogGroupRef[]): string[] {
    if (logGroups === undefined || Token.isUnresolved(logGroups) || logGroups.length === 0) {
      return [Stack.of(this).formatArn({ service: 'logs', account: '*', resource: 'log-group', resourceName: '*', arnFormat: ArnFormat.COLON_RESOURCE_NAME })];
    }
    return logGroups.map(logGroup => logGroup.logGroupRef.logGroupArn);
  }

  private renderRate(rate: Duration): string {
    const minutes = rate.toMinutes({ integral: false });
    // A tokenized rate is only known at deploy time, so the unit cannot be singularised
    // and whole hours cannot be collapsed. Render minutes and let the service validate.
    if (Token.isUnresolved(minutes)) {
      return `rate(${Tokenization.stringifyNumber(minutes)} minutes)`;
    }
    if (!Number.isInteger(minutes) || minutes < 1) {
      throw new ValidationError(lit`InvalidScheduleRate`, `schedule rate must be a whole number of minutes and at least 1 minute, got ${rate.toSeconds()} seconds`, this);
    }
    if (minutes % 60 === 0) {
      const hours = minutes / 60;
      return `rate(${hours} ${hours === 1 ? 'hour' : 'hours'})`;
    }
    return `rate(${minutes} ${minutes === 1 ? 'minute' : 'minutes'})`;
  }
}
