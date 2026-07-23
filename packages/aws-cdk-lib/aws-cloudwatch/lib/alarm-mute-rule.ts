import type { Construct } from 'constructs';
import { CfnAlarmMuteRule as _CfnAlarmMuteRule } from './cloudwatch.generated';
import { Annotations, ArnFormat, Lazy, Names, Resource, Stack, Token, UnscopedValidationError, ValidationError } from '../../core';
import type { IResource, Duration } from '../../core';
import { memoizedGetter } from '../../core/lib/helpers-internal';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import type { IAlarmRef, IAlarmMuteRuleRef, AlarmMuteRuleReference } from '../../interfaces/generated/aws-cloudwatch-interfaces.generated';

/**
 * Represents a CloudWatch Alarm Mute Rule.
 */
export interface IAlarmMuteRule extends IResource, IAlarmMuteRuleRef {
  /**
   * The ARN of the alarm mute rule.
   *
   * @attribute
   */
  readonly alarmMuteRuleArn: string;

  /**
   * The name of the alarm mute rule.
   *
   * @attribute
   */
  readonly alarmMuteRuleName: string;
}

/**
 * Schedule expression for an alarm mute rule.
 *
 * You can use either a cron expression for recurring mutes
 * or an at expression for one-time mutes.
 */
export class MuteSchedule {
  /**
   * Create a recurring mute schedule using a cron expression.
   *
   * @param options The cron schedule options
   *
   * @example
   * // Mute every day at 2:00 AM UTC
   * MuteSchedule.cron({ hour: '2', minute: '0' })
   */
  public static cron(options: MuteScheduleCronOptions): MuteSchedule {
    if (options.weekDay !== undefined && options.day !== undefined) {
      throw new UnscopedValidationError('CannotSupplyBothDayAndWeekDay', 'Cannot supply both \'day\' and \'weekDay\', use at most one');
    }

    const minute = options.minute ?? '*';
    const hour = options.hour ?? '*';
    const day = options.day ?? '*';
    const month = options.month ?? '*';
    const weekDay = options.weekDay ?? '*';

    const cronExpression = `cron(${minute} ${hour} ${day} ${month} ${weekDay})`;

    if (!options.minute) {
      return new MuteSchedule(cronExpression, true);
    }

    return new MuteSchedule(cronExpression);
  }

  /**
   * Create a one-time mute schedule at a specific date and time.
   *
   * @param options The date and time for the one-time mute
   *
   * @example
   * MuteSchedule.at({ year: 2025, month: 1, day: 15, hour: 2, minute: 0 })
   */
  public static at(options: MuteDateTimeOptions): MuteSchedule {
    validateDateTime(options);

    const year = String(options.year);
    const month = String(options.month).padStart(2, '0');
    const day = String(options.day).padStart(2, '0');
    const hour = String(options.hour).padStart(2, '0');
    const minute = String(options.minute).padStart(2, '0');
    return new MuteSchedule(`at(${year}-${month}-${day}T${hour}:${minute})`);
  }

  /**
   * Create a mute schedule from a raw expression string.
   *
   * Use this if the expression type is not yet supported by the `cron` or `at` methods.
   *
   * @param expression The raw schedule expression
   */
  public static expression(expression: string): MuteSchedule {
    return new MuteSchedule(expression);
  }

  /**
   * The schedule expression string.
   */
  public readonly expressionString: string;

  /**
   * @internal
   */
  readonly _warnIfMinuteNotSet: boolean;

  private constructor(expressionString: string, warnIfMinuteNotSet: boolean = false) {
    this.expressionString = expressionString;
    this._warnIfMinuteNotSet = warnIfMinuteNotSet;
  }
}

/**
 * Options for a cron-based mute schedule.
 *
 * All fields are strings so you can use complex expressions. Absence of
 * a field implies '*'.
 *
 * CloudWatch AlarmMuteRule uses a 5-field cron format: `cron(Minutes Hours Day-of-month Month Day-of-week)`.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_Schedule.html
 */
export interface MuteScheduleCronOptions {
  /**
   * The minute to run this rule at.
   *
   * @default - Every minute
   */
  readonly minute?: string;

  /**
   * The hour to run this rule at.
   *
   * @default - Every hour
   */
  readonly hour?: string;

  /**
   * The day of the month to run this rule at.
   *
   * @default - Every day of the month
   */
  readonly day?: string;

  /**
   * The month to run this rule at.
   *
   * @default - Every month
   */
  readonly month?: string;

  /**
   * The day of the week to run this rule at.
   *
   * @default - Any day of the week
   */
  readonly weekDay?: string;
}

/**
 * Options for specifying a date and time with minute-level precision.
 *
 * All fields are required and represent a point in time interpreted
 * in the timezone specified by the `timezone` property of the mute rule
 * (defaults to UTC).
 */
export interface MuteDateTimeOptions {
  /**
   * The year (e.g. 2025)
   */
  readonly year: number;

  /**
   * The month (1-12)
   */
  readonly month: number;

  /**
   * The day of the month (1-31)
   */
  readonly day: number;

  /**
   * The hour (0-23)
   */
  readonly hour: number;

  /**
   * The minute (0-59)
   */
  readonly minute: number;
}

/**
 * Properties for creating an Alarm Mute Rule
 */
export interface AlarmMuteRuleProps {
  /**
   * Name of the alarm mute rule
   *
   * @default - Automatically generated name.
   */
  readonly alarmMuteRuleName?: string;

  /**
   * Description for the alarm mute rule
   *
   * @default - No description.
   */
  readonly description?: string;

  /**
   * The schedule expression that defines when the mute rule is active.
   *
   * Use `MuteSchedule.cron()` for recurring mutes or `MuteSchedule.at()` for one-time mutes.
   */
  readonly schedule: MuteSchedule;

  /**
   * The duration of the mute window each time the schedule triggers.
   *
   * This is specified as an ISO 8601 duration string (e.g. 'PT1H' for 1 hour, 'PT30M' for 30 minutes).
   */
  readonly duration: Duration;

  /**
   * The timezone for the schedule expression.
   *
   * @default - UTC
   */
  readonly timezone?: string;

  /**
   * The alarms to mute when this rule is active.
   *
   * Accepts any construct that implements `IAlarmRef`, including L2 `Alarm`,
   * `CompositeAlarm`, and L1 `CfnAlarm`.
   *
   * You can also add alarms after construction using `addAlarm()`.
   *
   * @default - No alarms are targeted.
   */
  readonly alarms?: IAlarmRef[];

  /**
   * The date and time after which the mute rule takes effect.
   *
   * Interpreted in the timezone specified by the `timezone` property
   * (defaults to UTC).
   *
   * @default - The mute rule takes effect immediately.
   */
  readonly startDate?: MuteDateTimeOptions;

  /**
   * The date and time after which the mute rule expires.
   *
   * Interpreted in the timezone specified by the `timezone` property
   * (defaults to UTC).
   * After this time, the rule status becomes EXPIRED and will no longer mute the targeted alarms.
   *
   * @default - The mute rule does not expire.
   */
  readonly expireDate?: MuteDateTimeOptions;
}

/**
 * A CloudWatch Alarm Mute Rule.
 *
 * @resource AWS::CloudWatch::AlarmMuteRule
 */
@propertyInjectable
export class AlarmMuteRule extends Resource implements IAlarmMuteRule {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-cloudwatch.AlarmMuteRule';

  /**
   * Import an existing alarm mute rule provided an ARN.
   *
   * @param scope The parent creating construct (usually `this`)
   * @param id The construct's name
   * @param alarmMuteRuleArn Alarm Mute Rule ARN (i.e. arn:aws:cloudwatch:<region>:<account-id>:alarm-mute-rule:AlarmMuteRuleName)
   */
  public static fromAlarmMuteRuleArn(scope: Construct, id: string, alarmMuteRuleArn: string): IAlarmMuteRule {
    class Import extends Resource implements IAlarmMuteRule {
      public readonly alarmMuteRuleArn = alarmMuteRuleArn;
      public readonly alarmMuteRuleName = Stack.of(scope).splitArn(alarmMuteRuleArn, ArnFormat.COLON_RESOURCE_NAME).resourceName!;
      public get alarmMuteRuleRef(): AlarmMuteRuleReference {
        return { alarmMuteRuleArn: this.alarmMuteRuleArn };
      }
    }
    return new Import(scope, id);
  }

  /**
   * Import an existing alarm mute rule provided a Name.
   *
   * @param scope The parent creating construct (usually `this`)
   * @param id The construct's name
   * @param alarmMuteRuleName Alarm Mute Rule Name
   */
  public static fromAlarmMuteRuleName(scope: Construct, id: string, alarmMuteRuleName: string): IAlarmMuteRule {
    const stack = Stack.of(scope);
    return this.fromAlarmMuteRuleArn(scope, id, stack.formatArn({
      service: 'cloudwatch',
      resource: 'alarm-mute-rule',
      resourceName: alarmMuteRuleName,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    }));
  }

  /**
   * ARN of this alarm mute rule
   *
   * @attribute
   */
  @memoizedGetter
  get alarmMuteRuleArn(): string {
    return this.getResourceArnAttribute(this.resource.attrArn, {
      service: 'cloudwatch',
      resource: 'alarm-mute-rule',
      resourceName: this.physicalName,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });
  }

  /**
   * Name of this alarm mute rule.
   *
   * @attribute
   */
  @memoizedGetter
  get alarmMuteRuleName(): string {
    return this.getResourceNameAttribute(this.physicalName);
  }

  public get alarmMuteRuleRef(): AlarmMuteRuleReference {
    return { alarmMuteRuleArn: this.alarmMuteRuleArn };
  }

  /**
   * Maximum number of alarms that can be targeted by a single mute rule.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_MuteTargets.html
   */
  private static readonly MAX_MUTE_TARGET_ALARMS = 100;

  private readonly resource: InstanceType<typeof _CfnAlarmMuteRule>;
  private readonly _alarms: IAlarmRef[] = [];

  constructor(scope: Construct, id: string, props: AlarmMuteRuleProps) {
    super(scope, id, {
      physicalName: props.alarmMuteRuleName ?? Lazy.string({ produce: () => this.generateUniqueId() }),
    });

    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    if (!Token.isUnresolved(props.duration.toSeconds()) && props.duration.toSeconds() < 60) {
      throw new ValidationError(
        'DurationTooShort',
        'Duration must be at least 1 minute.',
        this,
      );
    }

    if (!Token.isUnresolved(props.duration.toSeconds()) && props.duration.toSeconds() > 15 * 24 * 60 * 60) {
      throw new ValidationError(
        'DurationTooLong',
        'Duration must be at most 15 days.',
        this,
      );
    }

    if (props.alarms) {
      for (const alarm of props.alarms) {
        this.addAlarm(alarm);
      }
    }

    if (props.schedule._warnIfMinuteNotSet) {
      Annotations.of(this).addWarningV2('@aws-cdk/aws-cloudwatch:scheduleWillRunEveryMinute', 'cron: If you don\'t pass \'minute\', by default the event runs every minute. Pass \'minute: \'*\'\' if that\'s what you intend, or \'minute: 0\' to run once per hour instead.');
    }

    if (props.startDate && props.expireDate) {
      const start = new Date(
        props.startDate.year, props.startDate.month - 1, props.startDate.day,
        props.startDate.hour, props.startDate.minute,
      );
      const expire = new Date(
        props.expireDate.year, props.expireDate.month - 1, props.expireDate.day,
        props.expireDate.hour, props.expireDate.minute,
      );
      if (start >= expire) {
        throw new ValidationError(
          'StartDateAfterExpireDate',
          'startDate must be before expireDate.',
          this,
        );
      }
    }

    this.resource = new _CfnAlarmMuteRule(this, 'Resource', {
      name: this.physicalName,
      description: props.description,
      rule: {
        schedule: {
          expression: props.schedule.expressionString,
          duration: props.duration.toIsoString(),
          timezone: props.timezone,
        },
      },
      muteTargets: Lazy.any({
        produce: () => this._alarms.length > 0
          ? { alarmNames: this._alarms.map(a => a.alarmRef.alarmName) }
          : undefined,
      }),
      startDate: props.startDate ? formatDateTime(props.startDate) : undefined,
      expireDate: props.expireDate ? formatDateTime(props.expireDate) : undefined,
    });
  }

  /**
   * Add an alarm to be muted by this rule.
   *
   * @param alarm The alarm to mute
   */
  public addAlarm(alarm: IAlarmRef): void {
    if (this._alarms.length >= AlarmMuteRule.MAX_MUTE_TARGET_ALARMS) {
      throw new ValidationError(
        'MaxAlarmsMuteRule',
        `An alarm mute rule can target a maximum of ${AlarmMuteRule.MAX_MUTE_TARGET_ALARMS} alarms.`,
        this,
      );
    }
    this._alarms.push(alarm);
  }

  private generateUniqueId(): string {
    const name = Names.uniqueId(this);
    if (name.length > 240) {
      return name.substring(0, 120) + name.substring(name.length - 120);
    }
    return name;
  }
}

/**
 * Validate the fields of a MuteDateTimeOptions.
 */
function validateDateTime(options: MuteDateTimeOptions): void {
  if (options.month < 1 || options.month > 12) {
    throw new UnscopedValidationError('InvalidMonth', 'month must be between 1 and 12');
  }
  if (options.day < 1 || options.day > 31) {
    throw new UnscopedValidationError('InvalidDay', 'day must be between 1 and 31');
  }
  if (options.hour < 0 || options.hour > 23) {
    throw new UnscopedValidationError('InvalidHour', 'hour must be between 0 and 23');
  }
  if (options.minute < 0 || options.minute > 59) {
    throw new UnscopedValidationError('InvalidMinute', 'minute must be between 0 and 59');
  }
}

/**
 * Format a MuteDateTimeOptions to an ISO 8601 date-time string without timezone offset.
 *
 * The timezone is controlled by the schedule's timezone property.
 */
function formatDateTime(options: MuteDateTimeOptions): string {
  validateDateTime(options);
  const year = String(options.year);
  const month = String(options.month).padStart(2, '0');
  const day = String(options.day).padStart(2, '0');
  const hour = String(options.hour).padStart(2, '0');
  const minute = String(options.minute).padStart(2, '0');
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

