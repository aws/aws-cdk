import { Construct } from 'constructs';

/**
 * The type returned from the `bind()` method in `IotSql`.
 */
export interface IotSqlConfig {
  /**
   * The version of the SQL rules engine to use when evaluating the rule.
   */
  readonly awsIotSqlVersion: string;

  /**
   * The SQL statement used to query the topic.
   */
  readonly sql: string;
}

/**
 * Defines AWS IoT SQL.
 */
export abstract class IotSql {
  /**
   * Uses the original SQL version built on 2015-10-08.
   *
   * @param sql The actual SQL-like syntax query
   * @returns Instance of IotSql
   */
  public static fromStringAsVer20151008(sql: string): IotSql {
    return new IotSqlImpl('2015-10-08', sql);
  }

  /**
   * Uses the SQL version built on 2016-03-23.
   *
   * @param sql The actual SQL-like syntax query
   * @returns Instance of IotSql
   */
  public static fromStringAsVer20160323(sql: string): IotSql {
    return new IotSqlImpl('2016-03-23', sql);
  }

  /**
   * Uses the most recent beta SQL version. If you use this version, it might
   * introduce breaking changes to your rules.
   *
   * @param sql The actual SQL-like syntax query
   * @returns Instance of IotSql
   */
  public static fromStringAsVerNewestUnstable(sql: string): IotSql {
    return new IotSqlImpl('beta', sql);
  }

  /**
   * Returns the IoT SQL configuration.
   */
  public abstract bind(scope: Construct): IotSqlConfig;
}

class IotSqlImpl extends IotSql {
  constructor(private readonly version: string, private readonly sql: string) {
    super();

    if (sql === '') {
      throw new Error('IoT SQL string cannot be empty');
    }
  }

  bind(_scope: Construct): IotSqlConfig {
    return {
      awsIotSqlVersion: this.version,
      sql: this.sql,
    };
  }
}
