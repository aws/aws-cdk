import { UnscopedValidationError } from 'aws-cdk-lib';

/**
 * Partition projection type.
 *
 * Determines how Athena projects partition values.
 *
 * @see https://docs.aws.amazon.com/athena/latest/ug/partition-projection-supported-types.html
 */
export enum PartitionProjectionType {
  /**
   * Project partition values as integers within a range.
   */
  INTEGER = 'integer',

  /**
   * Project partition values as dates within a range.
   */
  DATE = 'date',

  /**
   * Project partition values from an explicit list of values.
   */
  ENUM = 'enum',

  /**
   * Project partition values that are injected at query time.
   */
  INJECTED = 'injected',
}

/**
 * Date interval unit for partition projection.
 *
 * @see https://docs.aws.amazon.com/athena/latest/ug/partition-projection-supported-types.html#partition-projection-date-type
 */
export enum DateIntervalUnit {
  /**
   * Year interval.
   */
  YEARS = 'YEARS',

  /**
   * Month interval.
   */
  MONTHS = 'MONTHS',

  /**
   * Week interval.
   */
  WEEKS = 'WEEKS',

  /**
   * Day interval (default).
   */
  DAYS = 'DAYS',

  /**
   * Hour interval.
   */
  HOURS = 'HOURS',

  /**
   * Minute interval.
   */
  MINUTES = 'MINUTES',

  /**
   * Second interval.
   */
  SECONDS = 'SECONDS',
}

/**
 * Properties for INTEGER partition projection configuration.
 */
export interface IntegerPartitionProjectionConfigurationProps {
  /**
   * Minimum value for the integer partition range (inclusive).
   *
   * @example 2020
   * @example 0
   */
  readonly min: number;

  /**
   * Maximum value for the integer partition range (inclusive).
   *
   * @example 2023
   * @example 100
   */
  readonly max: number;

  /**
   * Interval between partition values.
   *
   * @default 1
   */
  readonly interval?: number;

  /**
   * Number of digits to pad the partition value with leading zeros.
   *
   * With digits: 4, partition values: 0001, 0002, ..., 0100
   *
   * @default - no padding
   */
  readonly digits?: number;
}

/**
 * Properties for DATE partition projection configuration.
 */
export interface DatePartitionProjectionConfigurationProps {
  /**
   * Start date for the partition range (inclusive).
   *
   * Can be either:
   * - Fixed date in the format specified by `format` property
   *   (e.g., '2020-01-01' for format 'yyyy-MM-dd')
   * - Relative date using NOW syntax
   *   (e.g., 'NOW', 'NOW-3YEARS', 'NOW+1MONTH')
   *
   * @see https://docs.aws.amazon.com/athena/latest/ug/partition-projection-supported-types.html#partition-projection-date-type
   *
   * @example '2020-01-01'
   * @example 'NOW-3YEARS'
   * @example '2020-01-01-00-00-00'
   */
  readonly min: string;

  /**
   * End date for the partition range (inclusive).
   *
   * Can be either:
   * - Fixed date in the format specified by `format` property
   * - Relative date using NOW syntax
   *
   * Same format constraints as `min`.
   *
   * @example '2023-12-31'
   * @example 'NOW'
   * @example 'NOW+1MONTH'
   */
  readonly max: string;

  /**
   * Date format for partition values.
   *
   * Uses Java SimpleDateFormat patterns.
   *
   * @see https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html
   *
   * @example 'yyyy-MM-dd'
   * @example 'yyyy-MM-dd-HH-mm-ss'
   * @example 'yyyyMMdd'
   */
  readonly format: string;

  /**
   * Interval between partition values.
   *
   * @default 1
   */
  readonly interval?: number;

  /**
   * Unit for the interval.
   *
   * @default DateIntervalUnit.DAYS
   */
  readonly intervalUnit?: DateIntervalUnit;
}

/**
 * Properties for ENUM partition projection configuration.
 */
export interface EnumPartitionProjectionConfigurationProps {
  /**
   * Explicit list of partition values.
   *
   * @example ['us-east-1', 'us-west-2', 'eu-west-1']
   */
  readonly values: string[];
}

/**
 * Factory class for creating partition projection configurations.
 *
 * Provides static factory methods for each partition projection type.
 *
 * @example
 * // Integer partition
 * const intConfig = PartitionProjectionConfiguration.integer({
 *   min: 2020,
 *   max: 2023,
 *   interval: 1,
 *   digits: 4,
 * });
 *
 * // Date partition
 * const dateConfig = PartitionProjectionConfiguration.date({
 *   min: '2020-01-01',
 *   max: '2023-12-31',
 *   format: 'yyyy-MM-dd',
 *   intervalUnit: DateIntervalUnit.DAYS,
 * });
 *
 * // Enum partition
 * const enumConfig = PartitionProjectionConfiguration.Enum({
 *   values: ['us-east-1', 'us-west-2'],
 * });
 *
 * // Injected partition
 * const injectedConfig = PartitionProjectionConfiguration.Injected();
 */
export class PartitionProjectionConfiguration {
  /**
   * Create an INTEGER partition projection configuration.
   *
   * @param props Configuration properties
   */
  public static integer(props: IntegerPartitionProjectionConfigurationProps): PartitionProjectionConfiguration {
    return new PartitionProjectionConfiguration(
      PartitionProjectionType.INTEGER,
      [props.min, props.max],
      props.interval,
      props.digits,
      undefined,
      undefined,
      undefined,
    );
  }

  /**
   * Create a DATE partition projection configuration.
   *
   * @param props Configuration properties
   */
  public static date(props: DatePartitionProjectionConfigurationProps): PartitionProjectionConfiguration {
    return new PartitionProjectionConfiguration(
      PartitionProjectionType.DATE,
      [props.min, props.max],
      props.interval,
      undefined,
      props.format,
      props.intervalUnit,
      undefined,
    );
  }

  /**
   * Create an ENUM partition projection configuration.
   *
   * @param props Configuration properties
   */
  public static enum(props: EnumPartitionProjectionConfigurationProps): PartitionProjectionConfiguration {
    return new PartitionProjectionConfiguration(
      PartitionProjectionType.ENUM,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      props.values,
    );
  }

  /**
   * Create an INJECTED partition projection configuration.
   *
   * Partition values are injected at query time through the query statement.
   *
   * @see https://docs.aws.amazon.com/athena/latest/ug/partition-projection-supported-types.html#partition-projection-injected-type
   */
  public static injected(): PartitionProjectionConfiguration {
    return new PartitionProjectionConfiguration(
      PartitionProjectionType.INJECTED,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    );
  }

  private constructor(
    /**
     * The type of partition projection.
     */
    public readonly type: PartitionProjectionType,

    /**
     * Range of partition values.
     *
     * For INTEGER: [min, max] as numbers
     * For DATE: [start, end] as ISO 8601 strings
     */
    public readonly range?: number[] | string[],

    /**
     * Interval between partition values.
     */
    public readonly interval?: number,

    /**
     * Number of digits to pad INTEGER partition values.
     */
    public readonly digits?: number,

    /**
     * Date format for DATE partition values (Java SimpleDateFormat).
     */
    public readonly format?: string,

    /**
     * Unit for DATE partition interval.
     */
    public readonly intervalUnit?: DateIntervalUnit,

    /**
     * Explicit list of values for ENUM partitions.
     */
    public readonly values?: string[],
  ) {}

  /**
   * Renders CloudFormation parameters for this partition projection configuration.
   *
   * @param columnName - The partition column name
   * @returns CloudFormation parameters as key-value pairs
   * @internal
   */
  public _renderParameters(columnName: string): { [key: string]: string } {
    const params: { [key: string]: string } = {
      [`projection.${columnName}.type`]: this.type,
    };

    switch (this.type) {
      case PartitionProjectionType.INTEGER: {
        const intRange = this.range as number[];
        params[`projection.${columnName}.range`] = `${intRange[0]},${intRange[1]}`;
        if (this.interval !== undefined) {
          params[`projection.${columnName}.interval`] = this.interval.toString();
        }
        if (this.digits !== undefined) {
          params[`projection.${columnName}.digits`] = this.digits.toString();
        }
        break;
      }
      case PartitionProjectionType.DATE: {
        const dateRange = this.range as string[];
        params[`projection.${columnName}.range`] = `${dateRange[0]},${dateRange[1]}`;
        params[`projection.${columnName}.format`] = this.format!;
        if (this.interval !== undefined) {
          params[`projection.${columnName}.interval`] = this.interval.toString();
        }
        if (this.intervalUnit !== undefined) {
          params[`projection.${columnName}.interval.unit`] = this.intervalUnit;
        }
        break;
      }
      case PartitionProjectionType.ENUM: {
        params[`projection.${columnName}.values`] = this.values!.join(',');
        break;
      }
      case PartitionProjectionType.INJECTED: {
        // INJECTED has no additional parameters
        break;
      }
      default: {
        // TypeScript exhaustiveness check
        const exhaustiveCheck: never = this.type;
        throw new UnscopedValidationError(
          `Unknown partition projection type for "${columnName}": ${exhaustiveCheck}`,
        );
      }
    }

    return params;
  }
}

/**
 * Partition projection configuration for a table.
 *
 * Maps partition column names to their projection configurations.
 * The key is the partition column name, the value is the partition configuration.
 *
 * @example
 * {
 *   year: PartitionProjectionConfiguration.Integer({
 *     range: [2020, 2023],
 *   }),
 *   region: PartitionProjectionConfiguration.Enum({
 *     values: ['us-east-1', 'us-west-2'],
 *   }),
 * }
 */
export type PartitionProjection = {
  [columnName: string]: PartitionProjectionConfiguration;
};

/**
 * Validates INTEGER partition projection configuration.
 *
 * @param columnName - The partition column name
 * @param config - The partition configuration
 * @throws {UnscopedValidationError} if the configuration is invalid
 */
export function validateIntegerPartition(
  columnName: string,
  config: PartitionProjectionConfiguration,
): void {
  if (config.type !== PartitionProjectionType.INTEGER) {
    throw new UnscopedValidationError(
      `Expected INTEGER partition type for "${columnName}", but got ${config.type}`,
    );
  }

  // Validate range
  if (!config.range || config.range.length !== 2) {
    throw new UnscopedValidationError(
      `INTEGER partition projection range for "${columnName}" must be [min, max], but got array of length ${config.range?.length ?? 0}`,
    );
  }

  const range = config.range as number[];
  const [min, max] = range;
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new UnscopedValidationError(
      `INTEGER partition projection range for "${columnName}" must contain integers, but got [${min}, ${max}]`,
    );
  }

  if (min > max) {
    throw new UnscopedValidationError(
      `INTEGER partition projection range for "${columnName}" must be [min, max] where min <= max, but got [${min}, ${max}]`,
    );
  }

  // Validate interval
  if (config.interval !== undefined) {
    if (!Number.isInteger(config.interval) || config.interval <= 0) {
      throw new UnscopedValidationError(
        `INTEGER partition projection interval for "${columnName}" must be a positive integer, but got ${config.interval}`,
      );
    }
  }

  // Validate digits
  if (config.digits !== undefined) {
    if (!Number.isInteger(config.digits) || config.digits < 1) {
      throw new UnscopedValidationError(
        `INTEGER partition projection digits for "${columnName}" must be an integer >= 1, but got ${config.digits}`,
      );
    }
  }
}

/**
 * Validates DATE partition projection configuration.
 *
 * @param columnName - The partition column name
 * @param config - The partition configuration
 * @throws {UnscopedValidationError} if the configuration is invalid
 */
export function validateDatePartition(
  columnName: string,
  config: PartitionProjectionConfiguration,
): void {
  if (config.type !== PartitionProjectionType.DATE) {
    throw new UnscopedValidationError(
      `Expected DATE partition type for "${columnName}", but got ${config.type}`,
    );
  }

  // Validate range
  if (!config.range || config.range.length !== 2) {
    throw new UnscopedValidationError(
      `DATE partition projection range for "${columnName}" must be [start, end], but got array of length ${config.range?.length ?? 0}`,
    );
  }

  const range = config.range as string[];
  const [start, end] = range;
  if (typeof start !== 'string' || typeof end !== 'string') {
    throw new UnscopedValidationError(
      `DATE partition projection range for "${columnName}" must contain strings, but got [${typeof start}, ${typeof end}]`,
    );
  }

  if (start.trim() === '' || end.trim() === '') {
    throw new UnscopedValidationError(
      `DATE partition projection range for "${columnName}" must not contain empty strings`,
    );
  }

  // Validate format
  if (typeof config.format !== 'string' || config.format.trim() === '') {
    throw new UnscopedValidationError(
      `DATE partition projection format for "${columnName}" must be a non-empty string`,
    );
  }

  // Validate interval
  if (config.interval !== undefined) {
    if (!Number.isInteger(config.interval) || config.interval <= 0) {
      throw new UnscopedValidationError(
        `DATE partition projection interval for "${columnName}" must be a positive integer, but got ${config.interval}`,
      );
    }
  }

  // Validate interval unit
  if (config.intervalUnit !== undefined) {
    const validUnits = Object.values(DateIntervalUnit);
    if (!validUnits.includes(config.intervalUnit)) {
      throw new UnscopedValidationError(
        `DATE partition projection interval unit for "${columnName}" must be one of ${validUnits.join(', ')}, but got ${config.intervalUnit}`,
      );
    }
  }
}

/**
 * Validates ENUM partition projection configuration.
 *
 * @param columnName - The partition column name
 * @param config - The partition configuration
 * @throws {UnscopedValidationError} if the configuration is invalid
 */
export function validateEnumPartition(
  columnName: string,
  config: PartitionProjectionConfiguration,
): void {
  if (config.type !== PartitionProjectionType.ENUM) {
    throw new UnscopedValidationError(
      `Expected ENUM partition type for "${columnName}", but got ${config.type}`,
    );
  }

  // Validate values
  if (!Array.isArray(config.values) || config.values.length === 0) {
    throw new UnscopedValidationError(
      `ENUM partition projection values for "${columnName}" must be a non-empty array`,
    );
  }

  for (let i = 0; i < config.values.length; i++) {
    const value = config.values[i];
    if (typeof value !== 'string') {
      throw new UnscopedValidationError(
        `ENUM partition projection values for "${columnName}" must contain only strings, but found ${typeof value} at index ${i}`,
      );
    }
    if (value.trim() === '') {
      throw new UnscopedValidationError(
        `ENUM partition projection values for "${columnName}" must not contain empty strings`,
      );
    }
  }
}

/**
 * Validates INJECTED partition projection configuration.
 *
 * @param _columnName - The partition column name
 * @param config - The partition configuration
 * @throws {UnscopedValidationError} if the configuration is invalid
 */
export function validateInjectedPartition(
  _columnName: string,
  config: PartitionProjectionConfiguration,
): void {
  if (config.type !== PartitionProjectionType.INJECTED) {
    throw new UnscopedValidationError(
      `Expected INJECTED partition type for "${_columnName}", but got ${config.type}`,
    );
  }

  // INJECTED type has no additional properties to validate
}

/**
 * Validates partition projection configuration based on its type.
 *
 * @param columnName - The partition column name
 * @param config - The partition configuration
 * @throws {UnscopedValidationError} if the configuration is invalid
 */
export function validatePartitionConfiguration(
  columnName: string,
  config: PartitionProjectionConfiguration,
): void {
  switch (config.type) {
    case PartitionProjectionType.INTEGER:
      validateIntegerPartition(columnName, config);
      break;
    case PartitionProjectionType.DATE:
      validateDatePartition(columnName, config);
      break;
    case PartitionProjectionType.ENUM:
      validateEnumPartition(columnName, config);
      break;
    case PartitionProjectionType.INJECTED:
      validateInjectedPartition(columnName, config);
      break;
    default: {
      // TypeScript exhaustiveness check
      const exhaustiveCheck: never = config.type;
      throw new UnscopedValidationError(
        `Unknown partition projection type for "${columnName}": ${exhaustiveCheck}`,
      );
    }
  }
}

/**
 * Generates CloudFormation parameters for partition projection configuration.
 *
 * @param columnName - The partition column name
 * @param config - The partition configuration
 * @returns CloudFormation parameters
 */
export function generatePartitionProjectionParameters(
  columnName: string,
  config: PartitionProjectionConfiguration,
): { [key: string]: string } {
  return config._renderParameters(columnName);
}
