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
   */
  readonly min: number;

  /**
   * Maximum value for the integer partition range (inclusive).
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
   * @default - no static number of digits and no leading zeroes
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
   */
  readonly max: string;

  /**
   * Date format for partition values.
   *
   * Uses Java SimpleDateFormat patterns.
   *
   * @see https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html
   */
  readonly format: string;

  /**
   * Interval between partition values.
   *
   * When the provided dates are at single-day or single-month precision,
   * the interval is optional and defaults to 1 day or 1 month, respectively.
   * Otherwise, interval is required.
   *
   * @default - 1 for single-day or single-month precision, otherwise required
   */
  readonly interval?: number;

  /**
   * Unit for the interval.
   *
   * When the provided dates are at single-day or single-month precision,
   * the intervalUnit is optional and defaults to 1 day or 1 month, respectively.
   * Otherwise, the intervalUnit is required.
   *
   * @default - DAYS for single-day precision, MONTHS for single-month precision, otherwise required
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
 * Internal properties for PartitionProjectionConfiguration.
 */
interface PartitionProjectionConfigurationProps {
  /**
   * The type of partition projection.
   */
  readonly type: PartitionProjectionType;

  /**
   * Range of partition values for INTEGER type.
   *
   * Array of [min, max] as numbers.
   */
  readonly integerRange?: number[];

  /**
   * Range of partition values for DATE type.
   *
   * Array of [start, end] as date strings.
   */
  readonly dateRange?: string[];

  /**
   * Interval between partition values.
   */
  readonly interval?: number;

  /**
   * Number of digits to pad INTEGER partition values.
   */
  readonly digits?: number;

  /**
   * Date format for DATE partition values (Java SimpleDateFormat).
   */
  readonly format?: string;

  /**
   * Unit for DATE partition interval.
   */
  readonly intervalUnit?: DateIntervalUnit;

  /**
   * Explicit list of values for ENUM partitions.
   */
  readonly values?: string[];
}

/**
 * Factory class for creating partition projection configurations.
 */
export class PartitionProjectionConfiguration {
  /**
   * Create an INTEGER partition projection configuration.
   */
  public static integer(props: IntegerPartitionProjectionConfigurationProps): PartitionProjectionConfiguration {
    return new PartitionProjectionConfiguration({
      type: PartitionProjectionType.INTEGER,
      integerRange: [props.min, props.max],
      interval: props.interval,
      digits: props.digits,
    });
  }

  /**
   * Create a DATE partition projection configuration.
   */
  public static date(props: DatePartitionProjectionConfigurationProps): PartitionProjectionConfiguration {
    return new PartitionProjectionConfiguration({
      type: PartitionProjectionType.DATE,
      dateRange: [props.min, props.max],
      interval: props.interval,
      format: props.format,
      intervalUnit: props.intervalUnit,
    });
  }

  /**
   * Create an ENUM partition projection configuration.
   */
  public static enum(props: EnumPartitionProjectionConfigurationProps): PartitionProjectionConfiguration {
    return new PartitionProjectionConfiguration({
      type: PartitionProjectionType.ENUM,
      values: props.values,
    });
  }

  /**
   * Create an INJECTED partition projection configuration.
   *
   * Partition values are injected at query time through the query statement.
   *
   * @see https://docs.aws.amazon.com/athena/latest/ug/partition-projection-supported-types.html#partition-projection-injected-type
   */
  public static injected(): PartitionProjectionConfiguration {
    return new PartitionProjectionConfiguration({
      type: PartitionProjectionType.INJECTED,
    });
  }

  /**
   * The type of partition projection.
   */
  public readonly type: PartitionProjectionType;

  /**
   * Range of partition values for INTEGER type.
   *
   * Array of [min, max] as numbers.
   */
  public readonly integerRange?: number[];

  /**
   * Range of partition values for DATE type.
   *
   * Array of [start, end] as date strings.
   */
  public readonly dateRange?: string[];

  /**
   * Interval between partition values.
   */
  public readonly interval?: number;

  /**
   * Number of digits to pad INTEGER partition values.
   */
  public readonly digits?: number;

  /**
   * Date format for DATE partition values (Java SimpleDateFormat).
   */
  public readonly format?: string;

  /**
   * Unit for DATE partition interval.
   */
  public readonly intervalUnit?: DateIntervalUnit;

  /**
   * Explicit list of values for ENUM partitions.
   */
  public readonly values?: string[];

  private constructor(props: PartitionProjectionConfigurationProps) {
    this.type = props.type;
    this.integerRange = props.integerRange;
    this.dateRange = props.dateRange;
    this.interval = props.interval;
    this.digits = props.digits;
    this.format = props.format;
    this.intervalUnit = props.intervalUnit;
    this.values = props.values;
  }

  /**
   * Renders CloudFormation parameters for this partition projection configuration.
   *
   * @param columnName - The partition column name
   * @internal
   */
  public _renderParameters(columnName: string): { [key: string]: string } {
    const params: { [key: string]: string } = {
      [`projection.${columnName}.type`]: this.type,
    };

    switch (this.type) {
      case PartitionProjectionType.INTEGER: {
        if (!this.integerRange) {
          throw new UnscopedValidationError(
            `INTEGER partition projection for "${columnName}" is missing integerRange configuration`,
          );
        }
        const [min, max] = this.integerRange;
        params[`projection.${columnName}.range`] = `${min},${max}`;
        if (this.interval !== undefined) {
          params[`projection.${columnName}.interval`] = this.interval.toString();
        }
        if (this.digits !== undefined) {
          params[`projection.${columnName}.digits`] = this.digits.toString();
        }
        break;
      }
      case PartitionProjectionType.DATE: {
        if (!this.dateRange) {
          throw new UnscopedValidationError(
            `DATE partition projection for "${columnName}" is missing dateRange configuration`,
          );
        }
        if (!this.format) {
          throw new UnscopedValidationError(
            `DATE partition projection for "${columnName}" is missing format configuration`,
          );
        }
        const [start, end] = this.dateRange;
        params[`projection.${columnName}.range`] = `${start},${end}`;
        params[`projection.${columnName}.format`] = this.format;
        if (this.interval !== undefined) {
          params[`projection.${columnName}.interval`] = this.interval.toString();
        }
        if (this.intervalUnit !== undefined) {
          params[`projection.${columnName}.interval.unit`] = this.intervalUnit;
        }
        break;
      }
      case PartitionProjectionType.ENUM: {
        if (!this.values) {
          throw new UnscopedValidationError(
            `ENUM partition projection for "${columnName}" is missing values configuration`,
          );
        }
        params[`projection.${columnName}.values`] = this.values.join(',');
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
 */
export type PartitionProjection = {
  [columnName: string]: PartitionProjectionConfiguration;
};

/**
 * Validates INTEGER partition projection configuration.
 *
 * @param columnName - The partition column name
 * @param config - The partition configuration
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

  // Validate integerRange
  if (!config.integerRange || config.integerRange.length !== 2) {
    throw new UnscopedValidationError(
      `INTEGER partition projection integerRange for "${columnName}" must be [min, max], but got array of length ${config.integerRange?.length ?? 0}`,
    );
  }

  const [min, max] = config.integerRange;
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new UnscopedValidationError(
      `INTEGER partition projection integerRange for "${columnName}" must contain integers, but got [${min}, ${max}]`,
    );
  }

  if (min > max) {
    throw new UnscopedValidationError(
      `INTEGER partition projection integerRange for "${columnName}" must be [min, max] where min <= max, but got [${min}, ${max}]`,
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

  // Validate dateRange
  if (!config.dateRange || config.dateRange.length !== 2) {
    throw new UnscopedValidationError(
      `DATE partition projection dateRange for "${columnName}" must be [start, end], but got array of length ${config.dateRange?.length ?? 0}`,
    );
  }

  const [start, end] = config.dateRange;
  if (typeof start !== 'string' || typeof end !== 'string') {
    throw new UnscopedValidationError(
      `DATE partition projection dateRange for "${columnName}" must contain strings, but got [${typeof start}, ${typeof end}]`,
    );
  }

  if (start.trim() === '' || end.trim() === '') {
    throw new UnscopedValidationError(
      `DATE partition projection dateRange for "${columnName}" must not contain empty strings`,
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
