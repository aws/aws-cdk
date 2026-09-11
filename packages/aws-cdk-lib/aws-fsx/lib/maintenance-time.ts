import { UnscopedValidationError } from '../../core';
import { lit } from '../../core/lib/private/literal-string';

/**
 * Enum for representing all the days of the week
 */
export enum Weekday {
  /**
   * Monday
   */
  MONDAY = '1',
  /**
   * Tuesday
   */
  TUESDAY = '2',
  /**
   * Wednesday
   */
  WEDNESDAY = '3',
  /**
   * Thursday
   */
  THURSDAY = '4',
  /**
   * Friday
   */
  FRIDAY = '5',
  /**
   * Saturday
   */
  SATURDAY = '6',
  /**
   * Sunday
   */
  SUNDAY = '7',
}

/**
 * Properties required for setting up a weekly maintenance time
 */
export interface LustreMaintenanceTimeProps {
  /**
   * The day of the week for maintenance to be performed.
   */
  readonly day: Weekday;
  /**
   * The hour of the day (from 0-23) for maintenance to be performed.
   */
  readonly hour: number;
  /**
   * The minute of the hour (from 0-59) for maintenance to be performed.
   */
  readonly minute: number;
}

/**
 * Class for scheduling a weekly maintenance time.
 */
export class LustreMaintenanceTime {
  /**
   * The day of the week for maintenance to be performed.
   */
  private readonly day: Weekday;
  /**
   * The hour of the day (from 00-23) for maintenance to be performed.
   */
  private readonly hour: string;
  /**
   * The minute of the hour (from 00-59) for maintenance to be performed.
   */
  private readonly minute: string;

  constructor(props: LustreMaintenanceTimeProps) {
    this.validate(props.hour, props.minute);

    this.day = props.day;
    this.hour = this.getTwoDigitString(props.hour);
    this.minute = this.getTwoDigitString(props.minute);
  }
  /**
   * Converts a day, hour, and minute into a timestamp as used by FSx for Lustre's weeklyMaintenanceStartTime field.
   */
  public toTimestamp(): string {
    return `${this.day.valueOf()}:${this.hour}:${this.minute}`;
  }

  /**
   * Pad an integer so that it always contains at least 2 digits. Assumes the number is a positive integer.
   */
  private getTwoDigitString(n: number): string {
    const numberString = n.toString();
    if (numberString.length === 1) {
      return `0${n}`;
    }
    return numberString;
  }

  /**
   * Validation needed for the values of the maintenance time.
   */
  private validate(hour: number, minute: number) {
    if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
      throw new UnscopedValidationError(lit`MaintenanceTimeHourMustBeInteger`, 'Maintenance time hour must be an integer between 0 and 23');
    }
    if (!Number.isInteger(minute) || minute < 0 || minute > 59) {
      throw new UnscopedValidationError(lit`MaintenanceTimeMinuteMustBeInteger`, 'Maintenance time minute must be an integer between 0 and 59');
    }
  }
}

/**
 * Properties required for setting up a weekly maintenance time.
 *
 * Suitable for any FSx file system type (Lustre, ONTAP, OpenZFS, Windows). The
 * timestamp format `d:HH:MM` (UTC) is identical across all FSx file system types.
 */
export interface MaintenanceTimeProps extends LustreMaintenanceTimeProps {}

/**
 * Class for scheduling a weekly maintenance time on any FSx file system type.
 *
 * The timestamp format `d:HH:MM` in UTC is identical across all FSx file system
 * types (Lustre, ONTAP, OpenZFS, Windows), so this class is interchangeable with
 * `LustreMaintenanceTime` and can be used wherever a maintenance time is required.
 *
 * The explicit constructor (rather than an empty subclass) ensures the JSII
 * surface for non-TypeScript languages (Python, Java, .NET, Go) exposes a
 * neutral `MaintenanceTimeProps` rather than the Lustre-named props interface.
 */
export class MaintenanceTime extends LustreMaintenanceTime {
  constructor(props: MaintenanceTimeProps) {
    super(props);
  }
}
