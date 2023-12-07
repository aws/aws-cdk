/**
* The partition projection type.
*
* @see https://docs.aws.amazon.com/athena/latest/ug/partition-projection-supported-types.html#partition-projection-date-type
*/
export enum PartitionProjectionType {
  /**
   * ENUM_TYPE
   */
  ENUM_TYPE = 'enum',
  /**
   * INTEGER_TYPE
   */
  INTEGER_TYPE = 'integer',
  /**
   * DATE_TYPE
   */
  DATE_TYPE = 'date',
  /**
   * INJECTED_TYPE
   */
  INJECTED_TYPE = 'injected',
}

/**
* Dynamic Partition Projection Class
*
* @see https://docs.aws.amazon.com/athena/latest/ug/partition-projection.html
*
*/
export abstract class PartitionProjection {
  constructor(
    /**
    * the type of the partition projection
    * @see https://docs.aws.amazon.com/athena/latest/ug/partition-projection-setting-up.html#partition-projection-specifying-custom-s3-storage-locations
    */
    public readonly type: PartitionProjectionType,
    /**
    * Required. The projection use for column columnName.
    */
    public readonly columnName: string,
    /**
    * The prefix format of the S3 bucket and keys that store the partitions.
    */
    public readonly storageLocationTemplate: string) {}

  /**
  * Get the parameter key for the partition projection
  * @param paramName the name of the parameter
  * @returns the parameter key for the partition projection
  */
  public getParameterKey(paramName: string): string {
    return `${this.columnName}.${paramName}`;
  }
  /**
  * Create the output format for the partition projection
  * @returns the output format for the partition projection
  */
  public toOutputFormat(): any {
    throw new Error('Method not implemented.');
  }
}

/**
* A time unit word that represents the serialized form of a ChronoUnit.
* Possible values are YEARS, MONTHS, WEEKS, DAYS, HOURS, MINUTES, SECONDS, or MILLISECONDS. These values are case insensitive.
* @see https://docs.aws.amazon.com/athena/latest/ug/partition-projection-supported-types.html#partition-projection-date-type
*/
export enum DateIntervalUnit {
  /**
   * YEARS
   */
  YEARS = 'YEARS',
  /**
   * MONTHS
  */
  MONTHS = 'MONTHS',
  /**
   * WEEKS
  */
  WEEKS = 'WEEKS',
  /**
   * DAYS
  */
  DAYS = 'DAYS',
  /**
   * HOURS
  */
  HOURS = 'HOURS',
  /**
   * MINUTES
  */
  MINUTES = 'MINUTES',
  /**
   * SECONDS
  */
  SECONDS = 'SECONDS',
  /**
   * MILLISECONDS
  */
  MILLISECONDS = 'MILLISECONDS',
}

/**
* Implementation of DatePartitionProjection
*
* @see https://docs.aws.amazon.com/athena/latest/ug/partition-projection-supported-types.html#partition-projection-date-type
* @public
*/
export class DatePartitionProjection extends PartitionProjection {
  /**
  * @param columnName
  * @param storageLocationTemplate
  * @param range
  * @param format
  * @param interval
  * @param intervalUnit
  */
  constructor(
    /**
    * Required. The projection use for column columnName.
    */
    public readonly columnName: string,
    /**
    * The prefix format of the S3 bucket and keys that store the partitions.
    * @see https://docs.aws.amazon.com/athena/latest/ug/partition-projection-setting-up.html#partition-projection-specifying-custom-s3-storage-locations
    */
    public readonly storageLocationTemplate: string,
    /**
    * Required. A two-element, comma-separated list which provides the minimum and maximum range values for the column columnName. These values are inclusive and can use any format compatible with the Java java.time.* date types. Both the minimum and maximum values must use the same format. The format specified in the .format property must be the format used for these values.
    *
    * This column can also contain relative date strings, formatted in this regular expression pattern:
    *
    * \s*NOW\s*(([\+\-])\s*([0-9]+)\s*(YEARS?|MONTHS?|WEEKS?|DAYS?|HOURS?|MINUTES?|SECONDS?)\s*)?
    *
    * White spaces are allowed, but in date literals are considered part of the date strings themselves.
    */
    public readonly range: string,
    /**
    * Required. A date format string based on the Java date format DateTimeFormatter. Can be any supported Java.time.* type.
    */
    public readonly format: string,
    /**
    * A positive integer that specifies the interval between successive partition values for column columnName. For example, a range value of 2017-01,2018-12 with an interval value of 1 and an interval.unit value of MONTHS produces the values 2017-01, 2017-02, 2017-03, and so on. The same range value with an interval value of 2 and an interval.unit value of MONTHS produces the values 2017-01, 2017-03, 2017-05, and so on. Leading and trailing white space is allowed.
    *
    * When the provided dates are at single-day or single-month precision, the interval is optional and defaults to 1 day or 1 month, respectively. Otherwise, interval is required.
    */
    public readonly interval?: number,
    /**
    * A time unit word that represents the serialized form of a ChronoUnit. Possible values are YEARS, MONTHS, WEEKS, DAYS, HOURS, MINUTES, SECONDS, or MILLISECONDS. These values are case insensitive.
    */
    public readonly intervalUnit?: DateIntervalUnit,
  ) {
    super(
      PartitionProjectionType.DATE_TYPE,
      columnName,
      storageLocationTemplate);
  }

  /**
   * Create the output format for the partition projection
   * @returns the output format for the partition projection
   */
  toOutputFormat(): any {
    const baseKey = `projection.${this.columnName}`;
    return {
      ['projection.enabled']: true,
      ['storage.location.template']: this.storageLocationTemplate,
      [`${baseKey}.type`]: this.type,
      [`${baseKey}.format`]: this.format,
      [`${baseKey}.range`]: this.range,
      [`${baseKey}.interval`]: this.interval ? String(this.interval) : undefined,
      [`${baseKey}.interval.unit`]: this.intervalUnit ? this.intervalUnit : undefined,
    };
  }
}

/**
* Implementation of IntegerPartitionProjection
*
* @see https://docs.aws.amazon.com/athena/latest/ug/partition-projection-supported-types.html#partition-projection-integer-type
*/
export class IntegerPartitionProjection extends PartitionProjection {
  constructor(
    /**
    * Required. The projection use for column columnName.
    */
    public readonly columnName: string,
    /**
    * The prefix format of the S3 bucket and keys that store the partitions.
    * @see https://docs.aws.amazon.com/athena/latest/ug/partition-projection-setting-up.html#partition-projection-specifying-custom-s3-storage-locations
    */
    public readonly storageLocationTemplate: string,
    /**
    * Required. A two-element comma-separated list that provides the minimum and maximum range values to be returned by queries on the column columnName. Note that the values must be separated by a comma, not a hyphen. These values are inclusive, can be negative, and can have leading zeroes. Leading and trailing white space is allowed.
    */
    public readonly range: string,
    /**
    * Optional. A positive integer that specifies the interval between successive partition values for the column columnName. For example, a range value of "1,3" with an interval value of "1" produces the values 1, 2, and 3. The same range value with an interval value of "2" produces the values 1 and 3, skipping 2. Leading and trailing white space is allowed. The default is 1.
    */
    public readonly interval?: number,
    /**
    * Optional. A positive integer that specifies the number of digits to include in the partition value's final representation for column columnName. For example, a range value of "1,3" that has a digits value of "1" produces the values 1, 2, and 3. The same range value with a digits value of "2" produces the values 01, 02, and 03. Leading and trailing white space is allowed. The default is no static number of digits and no leading zeroes.
    */
    public readonly digits?: number) {
    super(
      PartitionProjectionType.INTEGER_TYPE,
      columnName,
      storageLocationTemplate);
  }

  /**
  * Create the output format for the partition projection
  * @returns the output format for the partition projection
  */
  toOutputFormat(): any {
    const baseKey = `projection.${this.columnName}`;
    return {
      ['projection.enabled']: true,
      ['storage.location.template']: this.storageLocationTemplate,
      [`${baseKey}.type`]: this.type,
      [`${baseKey}.range`]: this.range,
      [`${baseKey}.interval`]: this.interval ? String(this.interval) : undefined,
      [`${baseKey}.digits`]: this.digits ? String(this.digits) : undefined,
    };
  }

}
/**
 * Implenetation of EnumPartitionProjection
 *
 * @see https://docs.aws.amazon.com/athena/latest/ug/partition-projection-supported-types.html#partition-projection-enum-type
 */
export class EnumPartitionProjection extends PartitionProjection {
  constructor(
    /**
    * Required. The projection use for column columnName.
    */
    public readonly columnName: string,
    /**
    * The prefix format of the S3 bucket and keys that store the partitions.
    * @see https://docs.aws.amazon.com/athena/latest/ug/partition-projection-setting-up.html#partition-projection-specifying-custom-s3-storage-locations
    */
    public readonly storageLocationTemplate: string,
    /**
    * Required. A comma-separated list of enumerated partition values for column columnName. Any white space is considered part of an enum value.
    */
    public readonly values: string) {
    super(
      PartitionProjectionType.ENUM_TYPE,
      columnName,
      storageLocationTemplate,
    );
  }

  /**
  * Create the output format for the partition projection
  * @returns the output format for the partition projection
  */
  toOutputFormat(): any {
    const baseKey = `projection.${this.columnName}`;
    return {
      ['projection.enabled']: true,
      ['storage.location.template']: this.storageLocationTemplate,
      [`${baseKey}.type`]: this.type,
      [`${baseKey}.values`]: this.values,
    };
  }

}

/**
 * Implementation of InjectedPartitionProjection
 *
 * @see https://docs.aws.amazon.com/athena/latest/ug/partition-projection-supported-types.html#partition-projection-injected-type
 */
export class InjectedPartitionProjection extends PartitionProjection {
  constructor(
    /**
    * Required. The projection use for column columnName.
    */
    public readonly columnName: string,
    /**
    * The prefix format of the S3 bucket and keys that store the partitions.
    *
    * @see https://docs.aws.amazon.com/athena/latest/ug/partition-projection-setting-up.html#partition-projection-specifying-custom-s3-storage-locations
    */
    public readonly storageLocationTemplate: string) {
    super(
      PartitionProjectionType.INJECTED_TYPE,
      columnName,
      storageLocationTemplate);
  }
}