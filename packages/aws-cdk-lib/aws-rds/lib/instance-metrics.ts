import * as cloudwatch from '../../aws-cloudwatch';
import type { aws_rds } from '../../interfaces';

/**
 * CloudWatch metrics for a database instance.
 *
 * Works with any reference to a database instance: a `DatabaseInstance`, an
 * imported instance or a `CfnDBInstance`.
 */
export class DatabaseInstanceMetrics {
  /**
   * Creates the metrics for the given database instance.
   *
   * @param instance The database instance to create the metrics for
   */
  public static fromDatabaseInstance(instance: aws_rds.IDBInstanceRef): DatabaseInstanceMetrics {
    return new DatabaseInstanceMetrics(instance);
  }

  private constructor(private readonly instance: aws_rds.IDBInstanceRef) {}

  /**
   * Return the given named metric for this database instance.
   *
   * If `dimensionsMap` is set, it replaces the default `DBInstanceIdentifier`
   * dimension, so the metric no longer refers to this instance unless the new
   * dimensions include it.
   *
   * @param metricName The name of the metric in the `AWS/RDS` namespace
   * @param props Properties to override on the metric
   */
  public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/RDS',
      metricName,
      dimensionsMap: { DBInstanceIdentifier: this.instance.dbInstanceRef.dbInstanceIdentifier },
      ...props,
    }).attachTo(this.instance);
  }

  /**
   * The percentage of CPU utilization.
   *
   * @default - average over 5 minutes
   */
  public cpuUtilization(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('CPUUtilization', { statistic: 'Average', ...props });
  }

  /**
   * The number of client network connections to the database instance.
   *
   * @default - average over 5 minutes
   */
  public databaseConnections(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('DatabaseConnections', { statistic: 'Average', ...props });
  }

  /**
   * The amount of available storage space.
   *
   * @default - average over 5 minutes
   */
  public freeStorageSpace(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('FreeStorageSpace', { statistic: 'Average', ...props });
  }

  /**
   * The amount of available random access memory.
   *
   * @default - average over 5 minutes
   */
  public freeableMemory(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('FreeableMemory', { statistic: 'Average', ...props });
  }

  /**
   * The average number of disk read I/O operations per second.
   *
   * @default - average over 5 minutes
   */
  public readIOPS(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('ReadIOPS', { statistic: 'Average', ...props });
  }

  /**
   * The average number of disk write I/O operations per second.
   *
   * @default - average over 5 minutes
   */
  public writeIOPS(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('WriteIOPS', { statistic: 'Average', ...props });
  }

  /**
   * The incoming (receive) network traffic on the DB instance, including both
   * customer database traffic and Amazon RDS traffic used for monitoring and replication.
   *
   * @default - average over 5 minutes
   */
  public networkReceiveThroughput(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('NetworkReceiveThroughput', { statistic: 'Average', ...props });
  }

  /**
   * The outgoing (transmit) network traffic on the DB instance, including both
   * customer database traffic and Amazon RDS traffic used for monitoring and replication.
   *
   * @default - average over 5 minutes
   */
  public networkTransmitThroughput(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('NetworkTransmitThroughput', { statistic: 'Average', ...props });
  }

  /**
   * The average amount of time taken per disk I/O read operation.
   *
   * @default - average over 5 minutes
   */
  public readLatency(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('ReadLatency', { statistic: 'Average', ...props });
  }

  /**
   * The average amount of time taken per disk I/O write operation.
   *
   * @default - average over 5 minutes
   */
  public writeLatency(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('WriteLatency', { statistic: 'Average', ...props });
  }

  /**
   * The average number of bytes read from disk per second.
   *
   * @default - average over 5 minutes
   */
  public readThroughput(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('ReadThroughput', { statistic: 'Average', ...props });
  }

  /**
   * The average number of bytes written to disk per second.
   *
   * @default - average over 5 minutes
   */
  public writeThroughput(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('WriteThroughput', { statistic: 'Average', ...props });
  }

  /**
   * The amount of swap space used on the DB instance.
   *
   * This metric is available for MariaDB, MySQL, Oracle, and PostgreSQL DB instances.
   *
   * @default - average over 5 minutes
   */
  public swapUsage(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('SwapUsage', { statistic: 'Average', ...props });
  }

  /**
   * The number of outstanding I/Os (read/write requests) waiting to access the disk.
   *
   * @default - average over 5 minutes
   */
  public diskQueueDepth(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('DiskQueueDepth', { statistic: 'Average', ...props });
  }

  /**
   * The percent of burst-bucket I/O credits available.
   *
   * This metric is available for DB instances that use General Purpose SSD (gp2) storage.
   *
   * @default - average over 5 minutes
   */
  public burstBalance(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('BurstBalance', { statistic: 'Average', ...props });
  }

  /**
   * For read replica configurations, the amount of time a read replica DB instance
   * lags behind the source DB instance.
   *
   * This metric is available for MariaDB, Microsoft SQL Server, MySQL, Oracle, and PostgreSQL read replicas.
   *
   * @default - average over 5 minutes
   */
  public replicaLag(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('ReplicaLag', { statistic: 'Average', ...props });
  }
}
