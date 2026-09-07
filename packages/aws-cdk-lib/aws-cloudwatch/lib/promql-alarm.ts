import type { Construct } from 'constructs';
import type { IAlarm } from './alarm-base';
import { AlarmBase } from './alarm-base';
import { CfnAlarm } from './cloudwatch.generated';
import { ArnFormat, Stack, Token, ValidationError } from '../../core';
import type { Duration } from '../../core';
import { memoizedGetter } from '../../core/lib/helpers-internal';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { lit } from '../../core/lib/private/literal-string';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * Properties for creating a PromQL Alarm.
 */
export interface PromQLAlarmProps {
  /**
   * Name of the alarm.
   *
   * @default - Automatically generated name
   */
  readonly alarmName?: string;

  /**
   * Description for the alarm.
   *
   * @default - No description
   */
  readonly alarmDescription?: string;

  /**
   * The duration that a contributor must continuously breach before the contributor transitions to ALARM state.
   *
   * @default - No pending period
   */
  readonly pendingPeriod?: Duration;

  /**
   * The duration that a contributor must continuously not be breaching before it transitions back to the OK state.
   *
   * @default - No recovery period
   */
  readonly recoveryPeriod?: Duration;

  /**
   * The PromQL query that the alarm evaluates.
   */
  readonly query: string;

  /**
   * The frequency at which the alarm is evaluated.
   *
   * Must be between 10 seconds and 3600 seconds.
   */
  readonly evaluationInterval: Duration;

  /**
   * Whether the actions for this alarm are enabled.
   *
   * @default true
   */
  readonly actionsEnabled?: boolean;
}

/**
 * A CloudWatch Alarm based on a PromQL query expression.
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/alarm-promql.html
 * @resource AWS::CloudWatch::Alarm
 */
@propertyInjectable
export class PromQLAlarm extends AlarmBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-cloudwatch.PromQLAlarm';

  /**
   * Import an existing CloudWatch alarm provided an ARN.
   */
  public static fromPromQLAlarmArn(scope: Construct, id: string, alarmArn: string): IAlarm {
    class Import extends AlarmBase implements IAlarm {
      public readonly alarmArn = alarmArn;
      public readonly alarmName = Stack.of(scope).splitArn(alarmArn, ArnFormat.COLON_RESOURCE_NAME).resourceName!;
    }
    return new Import(scope, id);
  }

  /**
   * Import an existing CloudWatch alarm provided a Name.
   */
  public static fromPromQLAlarmName(scope: Construct, id: string, alarmName: string): IAlarm {
    const stack = Stack.of(scope);
    return this.fromPromQLAlarmArn(scope, id, stack.formatArn({
      service: 'cloudwatch',
      resource: 'alarm',
      resourceName: alarmName,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    }));
  }

  private readonly alarm: CfnAlarm;

  constructor(scope: Construct, id: string, props: PromQLAlarmProps) {
    super(scope, id, {
      physicalName: props.alarmName,
    });

    addConstructMetadata(this, props);

    const evaluationInterval = props.evaluationInterval.toSeconds();
    if (!Token.isUnresolved(evaluationInterval) && (evaluationInterval < 10 || evaluationInterval > 3600)) {
      throw new ValidationError(lit`InvalidEvaluationInterval`, `evaluationInterval must be between 10 and 3600 seconds, got ${evaluationInterval}`, this);
    }

    const pendingPeriod = props.pendingPeriod?.toSeconds();
    if (pendingPeriod !== undefined && !Token.isUnresolved(pendingPeriod) && (pendingPeriod < 0 || pendingPeriod > 86400)) {
      throw new ValidationError(lit`InvalidPendingPeriod`, `pendingPeriod must be between 0 and 86400 seconds, got ${pendingPeriod}`, this);
    }

    const recoveryPeriod = props.recoveryPeriod?.toSeconds();
    if (recoveryPeriod !== undefined && !Token.isUnresolved(recoveryPeriod) && (recoveryPeriod < 0 || recoveryPeriod > 86400)) {
      throw new ValidationError(lit`InvalidRecoveryPeriod`, `recoveryPeriod must be between 0 and 86400 seconds, got ${recoveryPeriod}`, this);
    }

    if (!Token.isUnresolved(props.query) && (props.query.length < 1 || props.query.length > 10000)) {
      throw new ValidationError(lit`InvalidQuery`, `query must be between 1 and 10000 characters, got ${props.query.length}`, this);
    }

    this.alarm = new CfnAlarm(this, 'Resource', {
      alarmDescription: props.alarmDescription,
      alarmName: this.physicalName,
      actionsEnabled: props.actionsEnabled,
      alarmActions: Token.asList(this._alarmActionArns),
      insufficientDataActions: Token.asList(this._insufficientDataActionArns),
      okActions: Token.asList(this._okActionArns),
      evaluationCriteria: {
        promQlCriteria: {
          query: props.query,
          pendingPeriod: pendingPeriod,
          recoveryPeriod: recoveryPeriod,
        },
      },
      evaluationInterval: evaluationInterval,
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
}
