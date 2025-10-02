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
 * Configuration for INTEGER partition projection.
 *
 * @see https://docs.aws.amazon.com/athena/latest/ug/partition-projection-supported-types.html#partition-projection-integer-type
 */
export interface IntegerPartitionConfiguration {
  /**
   * The type of partition projection.
   */
  readonly type: PartitionProjectionType.INTEGER;

  /**
   * Range of integer partition values [min, max] (inclusive).
   *
   * Array must contain exactly 2 elements: [min, max]
   *
   * @example [0, 100]
   */
  readonly range: number[];

  /**
   * Interval between partition values.
   *
   * @default 1
   */
  readonly interval?: number;

  /**
   * Number of digits to pad the partition value with leading zeros.
   *
   * @default - no padding
   *
   * @example
   * // With digits: 4, partition values: 0001, 0002, ..., 0100
   * digits: 4
   */
  readonly digits?: number;
}

/**
 * Configuration for DATE partition projection.
 *
 * @see https://docs.aws.amazon.com/athena/latest/ug/partition-projection-supported-types.html#partition-projection-date-type
 */
export interface DatePartitionConfiguration {
  /**
   * The type of partition projection.
   */
  readonly type: PartitionProjectionType.DATE;

  /**
   * Range of date partition values [start, end] (inclusive) in ISO 8601 format.
   *
   * Array must contain exactly 2 elements: [start, end]
   *
   * @example ['2020-01-01', '2023-12-31']
   * @example ['2020-01-01-00-00-00', '2023-12-31-23-59-59']
   */
  readonly range: string[];

  /**
   * Date format for partition values.
   *
   * Uses Java SimpleDateFormat patterns.
   *
   * @see https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html
   *
   * @example
   * 'yyyy-MM-dd'
   * 'yyyy-MM-dd-HH-mm-ss'
   * 'yyyyMMdd'
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
   * @default DAYS
   */
  readonly intervalUnit?: 'YEARS' | 'MONTHS' | 'WEEKS' | 'DAYS' | 'HOURS' | 'MINUTES' | 'SECONDS';
}

/**
 * Configuration for ENUM partition projection.
 *
 * @see https://docs.aws.amazon.com/athena/latest/ug/partition-projection-supported-types.html#partition-projection-enum-type
 */
export interface EnumPartitionConfiguration {
  /**
   * The type of partition projection.
   */
  readonly type: PartitionProjectionType.ENUM;

  /**
   * Explicit list of partition values.
   *
   * @example ['us-east-1', 'us-west-2', 'eu-west-1']
   */
  readonly values: string[];
}

/**
 * Configuration for INJECTED partition projection.
 *
 * Partition values are injected at query time through the query statement.
 *
 * @see https://docs.aws.amazon.com/athena/latest/ug/partition-projection-supported-types.html#partition-projection-injected-type
 */
export interface InjectedPartitionConfiguration {
  /**
   * The type of partition projection.
   */
  readonly type: PartitionProjectionType.INJECTED;
}

/**
 * Partition projection configuration.
 *
 * Discriminated union of partition projection types.
 */
export type PartitionConfiguration =
  | IntegerPartitionConfiguration
  | DatePartitionConfiguration
  | EnumPartitionConfiguration
  | InjectedPartitionConfiguration;

/**
 * Partition projection configuration for a table.
 *
 * Maps partition column names to their projection configurations.
 * The key is the partition column name, the value is the partition configuration.
 *
 * @example
 * {
 *   year: {
 *     type: PartitionProjectionType.INTEGER,
 *     range: [2020, 2023],
 *   },
 *   region: {
 *     type: PartitionProjectionType.ENUM,
 *     values: ['us-east-1', 'us-west-2'],
 *   },
 * }
 */
export type PartitionProjection = { [columnName: string]: PartitionConfiguration };

/**
 * Validates INTEGER partition projection configuration.
 *
 * @param columnName - The partition column name
 * @param config - The INTEGER partition configuration
 * @throws {UnscopedValidationError} if the configuration is invalid
 */
export function validateIntegerPartition(columnName: string, config: IntegerPartitionConfiguration): void {
  // Validate range
  if (config.range.length !== 2) {
    throw new UnscopedValidationError(
      `INTEGER partition projection range for "${columnName}" must be [min, max], but got array of length ${config.range.length}`,
    );
  }

  const [min, max] = config.range;
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
 * @param config - The DATE partition configuration
 * @throws {UnscopedValidationError} if the configuration is invalid
 */
export function validateDatePartition(columnName: string, config: DatePartitionConfiguration): void {
  // Validate range
  if (config.range.length !== 2) {
    throw new UnscopedValidationError(
      `DATE partition projection range for "${columnName}" must be [start, end], but got array of length ${config.range.length}`,
    );
  }

  const [start, end] = config.range;
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
    const validUnits = ['YEARS', 'MONTHS', 'WEEKS', 'DAYS', 'HOURS', 'MINUTES', 'SECONDS'];
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
 * @param config - The ENUM partition configuration
 * @throws {UnscopedValidationError} if the configuration is invalid
 */
export function validateEnumPartition(columnName: string, config: EnumPartitionConfiguration): void {
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
 * @param _config - The INJECTED partition configuration
 * @throws {UnscopedValidationError} if the configuration is invalid
 */
export function validateInjectedPartition(_columnName: string, _config: InjectedPartitionConfiguration): void {
  // INJECTED type has no additional properties to validate
  // This function exists for completeness and future extensibility
}

/**
 * Validates partition projection configuration based on its type.
 *
 * @param columnName - The partition column name
 * @param config - The partition configuration
 * @throws {UnscopedValidationError} if the configuration is invalid
 */
export function validatePartitionConfiguration(columnName: string, config: PartitionConfiguration): void {
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
    default:
      // TypeScript exhaustiveness check
      const exhaustiveCheck: never = config;
      throw new UnscopedValidationError(
        `Unknown partition projection type for "${columnName}": ${(exhaustiveCheck as any).type}`,
      );
  }
}

/**
 * Generates CloudFormation parameters for INTEGER partition projection.
 *
 * @param columnName - The partition column name
 * @param config - The INTEGER partition configuration
 * @returns CloudFormation parameters
 */
function generateIntegerParameters(columnName: string, config: IntegerPartitionConfiguration): { [key: string]: string } {
  const params: { [key: string]: string } = {
    [`projection.${columnName}.type`]: 'integer',
    [`projection.${columnName}.range`]: `${config.range[0]},${config.range[1]}`,
  };

  if (config.interval !== undefined) {
    params[`projection.${columnName}.interval`] = config.interval.toString();
  }

  if (config.digits !== undefined) {
    params[`projection.${columnName}.digits`] = config.digits.toString();
  }

  return params;
}

/**
 * Generates CloudFormation parameters for DATE partition projection.
 *
 * @param columnName - The partition column name
 * @param config - The DATE partition configuration
 * @returns CloudFormation parameters
 */
function generateDateParameters(columnName: string, config: DatePartitionConfiguration): { [key: string]: string } {
  const params: { [key: string]: string } = {
    [`projection.${columnName}.type`]: 'date',
    [`projection.${columnName}.range`]: `${config.range[0]},${config.range[1]}`,
    [`projection.${columnName}.format`]: config.format,
  };

  if (config.interval !== undefined) {
    params[`projection.${columnName}.interval`] = config.interval.toString();
  }

  if (config.intervalUnit !== undefined) {
    params[`projection.${columnName}.interval.unit`] = config.intervalUnit;
  }

  return params;
}

/**
 * Generates CloudFormation parameters for ENUM partition projection.
 *
 * @param columnName - The partition column name
 * @param config - The ENUM partition configuration
 * @returns CloudFormation parameters
 */
function generateEnumParameters(columnName: string, config: EnumPartitionConfiguration): { [key: string]: string } {
  return {
    [`projection.${columnName}.type`]: 'enum',
    [`projection.${columnName}.values`]: config.values.join(','),
  };
}

/**
 * Generates CloudFormation parameters for INJECTED partition projection.
 *
 * @param columnName - The partition column name
 * @param _config - The INJECTED partition configuration
 * @returns CloudFormation parameters
 */
function generateInjectedParameters(columnName: string, _config: InjectedPartitionConfiguration): { [key: string]: string } {
  return {
    [`projection.${columnName}.type`]: 'injected',
  };
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
  config: PartitionConfiguration,
): { [key: string]: string } {
  switch (config.type) {
    case PartitionProjectionType.INTEGER:
      return generateIntegerParameters(columnName, config);
    case PartitionProjectionType.DATE:
      return generateDateParameters(columnName, config);
    case PartitionProjectionType.ENUM:
      return generateEnumParameters(columnName, config);
    case PartitionProjectionType.INJECTED:
      return generateInjectedParameters(columnName, config);
    default:
      // TypeScript exhaustiveness check
      const exhaustiveCheck: never = config;
      throw new UnscopedValidationError(
        `Unknown partition projection type for "${columnName}": ${(exhaustiveCheck as any).type}`,
      );
  }
}
