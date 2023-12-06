/*
* @see https://docs.aws.amazon.com/athena/latest/ug/partition-projection-supported-types.html#partition-projection-date-type
*/
export enum PartitionProjectionType {
  ENUM_TYPE = 'enum',
  INTEGER_TYPE = 'integer',
  DATE_TYPE = 'date',
  INJECTED_TYPE = 'injected',
}

/*
* Dynamic Partition Projection Class
*
* @see https://docs.aws.amazon.com/athena/latest/ug/partition-projection.html
*
*/
export abstract class PartitionProjection {
  constructor(
    public readonly type: PartitionProjectionType,
    public readonly columnName: string,
    public readonly storageLocationTemplate: string) {}

  public getParameterKey(paramName: string): string {
    return `${this.columnName}.${paramName}`;
  }
  public toOutputFormat(): any {
    throw new Error('Method not implemented.');
  }
}

/*
* @see https://docs.aws.amazon.com/athena/latest/ug/partition-projection-supported-types.html#partition-projection-date-type
* A time unit word that represents the serialized form of a ChronoUnit.
* Possible values are YEARS, MONTHS, WEEKS, DAYS, HOURS, MINUTES, SECONDS, or MILLISECONDS. These values are case insensitive.
*/
export enum DateIntervalUnit {
  YEARS = 'YEARS',
  MONTHS = 'MONTHS',
  WEEKS = 'WEEKS',
  DAYS = 'DAYS',
  HOURS = 'HOURS',
  MINUTES = 'MINUTES',
  SECONDS = 'SECONDS',
  MILLISECONDS = 'MILLISECONDS',
}

export class DatePartitionProjection extends PartitionProjection {
  constructor(
    public readonly columnName: string,
    public readonly storageLocationTemplate: string,
    public readonly range: string,
    public readonly format: string,
    public readonly interval?: number,
    public readonly intervalUnit?: DateIntervalUnit,
  ) {
    super(
      PartitionProjectionType.DATE_TYPE,
      columnName,
      storageLocationTemplate);
  }

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

export class IntegerPartitionProjection extends PartitionProjection {
  constructor(
    public readonly columnName: string,
    public readonly storageLocationTemplate: string,
    public readonly range: string,
    public readonly interval?: number,
    public readonly digits?: number) {
    super(
      PartitionProjectionType.INTEGER_TYPE,
      columnName,
      storageLocationTemplate);
  }

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
export class EnumPartitionProjection extends PartitionProjection {
  constructor(
    public readonly columnName: string,
    public readonly storageLocationTemplate: string,
    public readonly values: string) {
    super(
      PartitionProjectionType.ENUM_TYPE,
      columnName,
      storageLocationTemplate,
    );
  }

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

export class InjectedPartitionProjection extends PartitionProjection {
  constructor(
    public readonly columnName: string,
    public readonly storageLocationTemplate: string) {
    super(
      PartitionProjectionType.INJECTED_TYPE,
      columnName,
      storageLocationTemplate);
  }
}