import { UnscopedValidationError } from '../../core';

/**
 * Properties required for setting up a daily automatic backup time.
 */
export interface DailyAutomaticBackupStartTimeProps {
  /**
   * The hour of the day (from 0-23) for automatic backup starts.
   * @default 22
   */
  readonly hour?: number;
  /**
   * The minute of the hour (from 0-59) for automatic backup starts.
   * @default 0
   */
  readonly minute?: number;
}

/**
 * Class for scheduling a daily automatic backup time.
 */
export class DailyAutomaticBackupStartTime {
  /**
   * The start hour of the automatic backup time in Coordinated Universal Time (UTC), using 24-hour time.
   * For example, 17 refers to 5:00 P.M. UTC.
   */
  private readonly hour: string;
  /**
   * The start minute of the automatic backup time, in UTC.
   */
  private readonly minute: string;

  /**
   * Creates a new DailyAutomaticBackupStartTime instance.
   * @param props Configuration properties (defaults to hour:22, minute:0)
   */
  constructor(props: DailyAutomaticBackupStartTimeProps = {}) {
    const hour = props.hour ?? 22;
    const minute = props.minute ?? 0;
    this.validate(hour, minute);

    this.hour = this.getTwoDigitString(hour);
    this.minute = this.getTwoDigitString(minute);
  }

  /**
   * Creates an instance from a "HH:MM" formatted string.
   * @param timeString Time string in "HH:MM" format (24-hour)
   * @returns New DailyAutomaticBackupStartTime instance
   * @throws UnscopedValidationError if format is invalid
   */
  public static fromString(timeString: string): DailyAutomaticBackupStartTime {
    const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(timeString)) {
      throw new UnscopedValidationError(`Time must be in "HH:MM" format (24-hour). Received: ${timeString}`);
    }

    const [hour, minute] = timeString.split(':').map(Number);
    return new DailyAutomaticBackupStartTime({ hour, minute });
  }

  /**
   * Converts the time to "HH:MM" string format.
   * @returns Time string in "HH:MM" format
   */
  public toTimestamp(): string {
    return `${this.hour}:${this.minute}`;
  }

  /**
   * Pad an integer to 2 digits. Assumes the number is a positive integer.
   * @param n Number to pad
   * @returns 2-digit string representation
   */
  private getTwoDigitString(n: number): string {
    return n.toString().padStart(2, '0');
  }

  /**
   * Validates hour and minute values.
   * @param hour Hour value (0-23)
   * @param minute Minute value (0-59)
   * @throws UnscopedValidationError if validation fails
   */
  private validate(hour: number, minute: number): void {
    if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
      throw new UnscopedValidationError(`hour must be an integer between 0 and 23. Received: ${hour}`);
    }
    if (!Number.isInteger(minute) || minute < 0 || minute > 59) {
      throw new UnscopedValidationError(`minute must be an integer between 0 and 59. Received: ${minute}`);
    }
  }
}
