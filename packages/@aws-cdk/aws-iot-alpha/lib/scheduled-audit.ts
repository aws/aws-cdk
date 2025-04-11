import { Resource, Stack, IResource, Token, ArnFormat } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as iot from 'aws-cdk-lib/aws-iot';
import { IAccountAuditConfiguration } from './audit-configuration';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';

/**
 * Represents AWS IoT Scheduled Audit
 */
export interface IScheduledAudit extends IResource {
  /**
   * The scheduled audit name
   * @attribute
   */
  readonly scheduledAuditName: string;

  /**
   * The ARN of the scheduled audit
   * @attribute
   */
  readonly scheduledAuditArn: string;
}

/**
 * Construction properties for a Scheduled Audit
 */
export interface ScheduledAuditAttributes {
  /**
   * The scheduled audit name
   */
  readonly scheduledAuditName: string;

  /**
   * The ARN of the scheduled audit
   */
  readonly scheduledAuditArn: string;
}

/**
 * The AWS IoT Device Defender audit checks
 *
 * @see https://docs.aws.amazon.com/iot-device-defender/latest/devguide/device-defender-audit-checks.html
 */
export enum AuditCheck {
  /**
   * Checks the permissiveness of an authenticated Amazon Cognito identity pool role.
   *
   * For this check, AWS IoT Device Defender audits all Amazon Cognito identity pools that have been used to connect to the AWS IoT message broker
   * during the 31 days before the audit is performed.
   */
  AUTHENTICATED_COGNITO_ROLE_OVERLY_PERMISSIVE_CHECK = 'AUTHENTICATED_COGNITO_ROLE_OVERLY_PERMISSIVE_CHECK',

  /**
   * Checks if a CA certificate is expiring.
   *
   * This check applies to CA certificates expiring within 30 days or that have expired.
   */
  CA_CERTIFICATE_EXPIRING_CHECK = 'CA_CERTIFICATE_EXPIRING_CHECK',

  /**
   * Checks the quality of the CA certificate key.
   *
   * The quality checks if the key is in a valid format, not expired, and if the key meets a minimum required size.
   *
   * This check applies to CA certificates that are ACTIVE or PENDING_TRANSFER.
   */
  CA_CERTIFICATE_KEY_QUALITY_CHECK = 'CA_CERTIFICATE_KEY_QUALITY_CHECK',

  /**
   * Checks if multiple devices connect using the same client ID.
   */
  CONFLICTING_CLIENT_IDS_CHECK = 'CONFLICTING_CLIENT_IDS_CHECK',

  /**
   * Checks if a device certificate is expiring.
   *
   * This check applies to device certificates expiring within 30 days or that have expired.
   */
  DEVICE_CERTIFICATE_EXPIRING_CHECK = 'DEVICE_CERTIFICATE_EXPIRING_CHECK',

  /**
   * Checks the quality of the device certificate key.
   *
   * The quality checks if the key is in a valid format, not expired, signed by a registered certificate authority,
   * and if the key meets a minimum required size.
   */
  DEVICE_CERTIFICATE_KEY_QUALITY_CHECK = 'DEVICE_CERTIFICATE_KEY_QUALITY_CHECK',

  /**
   * Checks if multiple concurrent connections use the same X.509 certificate to authenticate with AWS IoT.
   */
  DEVICE_CERTIFICATE_SHARED_CHECK = 'DEVICE_CERTIFICATE_SHARED_CHECK',

  /**
   * Checks the permissiveness of a policy attached to an authenticated Amazon Cognito identity pool role.
   */
  IOT_POLICY_OVERLY_PERMISSIVE_CHECK = 'IOT_POLICY_OVERLY_PERMISSIVE_CHECK',

  /**
   * Checks if a role alias has access to services that haven't been used for the AWS IoT device in the last year.
   */
  IOT_ROLE_ALIAS_ALLOWS_ACCESS_TO_UNUSED_SERVICES_CHECK = 'IOT_ROLE_ALIAS_ALLOWS_ACCESS_TO_UNUSED_SERVICES_CHECK',

  /**
   * Checks if the temporary credentials provided by AWS IoT role aliases are overly permissive.
   */
  IOT_ROLE_ALIAS_OVERLY_PERMISSIVE_CHECK = 'IOT_ROLE_ALIAS_OVERLY_PERMISSIVE_CHECK',

  /**
   * Checks if AWS IoT logs are disabled.
   */
  LOGGING_DISABLED_CHECK = 'LOGGING_DISABLED_CHECK',

  /**
   * Checks if a revoked CA certificate is still active.
   */
  REVOKED_CA_CERTIFICATE_STILL_ACTIVE_CHECK = 'REVOKED_CA_CERTIFICATE_STILL_ACTIVE_CHECK',

  /**
   * Checks if a revoked device certificate is still active.
   */
  REVOKED_DEVICE_CERTIFICATE_STILL_ACTIVE_CHECK = 'REVOKED_DEVICE_CERTIFICATE_STILL_ACTIVE_CHECK',

  /**
   * Checks if policy attached to an unauthenticated Amazon Cognito identity pool role is too permissive.
   */
  UNAUTHENTICATED_COGNITO_ROLE_OVERLY_PERMISSIVE_CHECK = 'UNAUTHENTICATED_COGNITO_ROLE_OVERLY_PERMISSIVE_CHECK',
}

/**
 * The day of the week on which the scheduled audit takes place.
 */
export enum DayOfWeek {
  /**
   * Sunday
   */
  SUNDAY = 'SUN',

  /**
   * Monday
   */
  MONDAY = 'MON',

  /**
   * Tuesday
   */
  TUESDAY = 'TUE',

  /**
   * Wednesday
   */
  WEDNESDAY = 'WED',

  /**
   * Thursday
   */
  THURSDAY = 'THU',

  /**
   * Friday
   */
  FRIDAY = 'FRI',

  /**
   * Saturday
   */
  SATURDAY = 'SAT',

  /**
   * UNSET_VALUE
   */
  UNSET_VALUE = 'UNSET_VALUE',
}

/**
 * The day of the month on which the scheduled audit takes place.
 */
export class DayOfMonth {
  /**
   * The last day of the month
   */
  public static readonly LAST_DAY = new DayOfMonth('LAST');

  /**
   * Custom day of the month
   * @param day the day of the month
   */
  public static of(day: number): DayOfMonth {
    if (day < 1 || day > 31) {
      throw new Error(`Day of month must be between 1 and 31, got: ${day}`);
    }
    if (!Number.isInteger(day)) {
      throw new Error(`Day of month must be an integer, got: ${day}`);
    }
    return new DayOfMonth(String(day));
  }

  /**
   *
   * @param day The day of the month
   */
  private constructor(public readonly day: string) {}
}

/**
 * The frequency at which the scheduled audit takes place.
 */
export enum Frequency {
  /**
   * Daily
   */
  DAILY = 'DAILY',

  /**
   * Weekly
   */
  WEEKLY = 'WEEKLY',

  /**
   * Bi-weekly
   */
  BI_WEEKLY = 'BIWEEKLY',

  /**
   * Monthly
   */
  MONTHLY = 'MONTHLY',
}

/**
 * Properties for defining AWS IoT Scheduled Audit
 */
export interface ScheduledAuditProps {
  /**
   * Which checks are performed during the scheduled audit.
   *
   * Checks must be enabled for your account.
   */
  readonly auditChecks: AuditCheck[];

  /**
   * Account audit configuration.
   *
   * The audit checks specified in `auditChecks` must be enabled in this configuration.
   */
  readonly accountAuditConfiguration: IAccountAuditConfiguration;

  /**
   * The day of the week on which the scheduled audit is run (if the frequency is "WEEKLY" or "BIWEEKLY").
   *
   * @default - required if frequency is "WEEKLY" or "BIWEEKLY", not allowed otherwise
   */
  readonly dayOfWeek?: DayOfWeek;

  /**
   * The day of the month on which the scheduled audit is run (if the frequency is "MONTHLY").
   *
   * If days 29-31 are specified, and the month does not have that many days, the audit takes place on the "LAST" day of the month.
   *
   * @default - required if frequency is "MONTHLY", not allowed otherwise
   */
  readonly dayOfMonth?: DayOfMonth;

  /**
   * How often the scheduled audit occurs.
   */
  readonly frequency: Frequency;

  /**
   * The name of the scheduled audit.
   *
   * @default - auto generated name
   */
  readonly scheduledAuditName?: string;
}

/**
 * Defines AWS IoT Scheduled Audit
 */
export class ScheduledAudit extends Resource implements IScheduledAudit {
  /**
   * Import an existing AWS IoT Scheduled Audit from its ARN.
   *
   * @param scope The parent creating construct (usually `this`)
   * @param id The construct's name
   * @param scheduledAuditArn The ARN of the scheduled audit
   */
  public static fromScheduledAuditArn(scope: Construct, id: string, scheduledAuditArn: string): IScheduledAudit {
    const name = Stack.of(scope).splitArn(scheduledAuditArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName;
    if (!name) {
      throw new Error(`No scheduled audit name found in ARN: '${scheduledAuditArn}'`);
    }

    return this.fromScheduledAuditAttributes(scope, id, { scheduledAuditArn: scheduledAuditArn, scheduledAuditName: name });
  }

  /**
   * Import an existing AWS IoT Scheduled Audit from its attributes.
   *
   * @param scope The parent creating construct (usually `this`)
   * @param id The construct's name
   * @param attrs The scheduled audit attributes
   */
  public static fromScheduledAuditAttributes(scope: Construct, id: string, attrs: ScheduledAuditAttributes): IScheduledAudit {
    class Import extends Resource implements IScheduledAudit {
      public readonly scheduledAuditArn = attrs.scheduledAuditArn;
      public readonly scheduledAuditName = attrs.scheduledAuditName;
    }
    return new Import(scope, id);
  }

  /**
   * The scheduled audit name
   * @attribute
   */
  public readonly scheduledAuditName: string;

  /**
   * The ARN of the scheduled audit
   * @attribute
   */
  public readonly scheduledAuditArn: string;

  constructor(scope: Construct, id: string, props: ScheduledAuditProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    if (props.auditChecks.length === 0) {
      throw new Error('At least one \'auditChecks\' must be specified.');
    }

    switch (props.frequency) {
      case Frequency.DAILY:
        if (props.dayOfWeek) {
          throw new Error('Day of the week must not be specified for daily audits.');
        }
        if (props.dayOfMonth) {
          throw new Error('Day of the month must not be specified for daily audits.');
        }
        break;
      case Frequency.WEEKLY:
      case Frequency.BI_WEEKLY:
        if (!props.dayOfWeek) {
          throw new Error('Day of the week must be specified for weekly or bi-weekly audits.');
        }
        if (props.dayOfMonth) {
          throw new Error('Day of the month must not be specified for weekly or bi-weekly audits.');
        }
        break;
      case Frequency.MONTHLY:
        if (!props.dayOfMonth) {
          throw new Error('Day of the month must be specified for monthly audits.');
        }
        if (props.dayOfWeek) {
          throw new Error('Day of the week must not be specified for monthly audits.');
        }
        break;
      default:
        throw new Error('Invalid frequency specified.');
    }

    if (props.scheduledAuditName !== undefined && !Token.isUnresolved(props.scheduledAuditName)) {
      if (props.scheduledAuditName.length < 1 || props.scheduledAuditName.length > 128) {
        throw new Error(`Scheduled audit name must be between 1 and 128 characters, got: ${props.scheduledAuditName.length}`);
      }
      if (!/^[a-zA-Z0-9:_-]+$/.test(props.scheduledAuditName)) {
        throw new Error(`Scheduled audit name must be alphanumeric and may include colons, underscores, and hyphens, got: ${props.scheduledAuditName}`);
      }
    }

    const resource = new iot.CfnScheduledAudit(this, 'Resource', {
      scheduledAuditName: props.scheduledAuditName,
      targetCheckNames: props.auditChecks,
      dayOfWeek: props.dayOfWeek,
      dayOfMonth: props.dayOfMonth?.day,
      frequency: props.frequency,
    });

    this.scheduledAuditName = resource.ref;
    this.scheduledAuditArn = resource.attrScheduledAuditArn;

    resource.node.addDependency(props.accountAuditConfiguration);
  }
}

