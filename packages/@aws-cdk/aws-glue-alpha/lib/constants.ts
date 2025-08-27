/**
 * The type of predefined worker that is allocated when a job runs.
 */
export enum WorkerType {
  /**
   * Standard Worker Type
   * 4 vCPU, 16 GB of memory and a 50GB disk, and 2 executors per worker.
   */
  STANDARD = 'Standard',

  /**
   * G.1X Worker Type
   * 1 DPU (4 vCPU, 16 GB of memory, 64 GB disk), and provides 1 executor per worker. Suitable for memory-intensive jobs.
   */
  G_1X = 'G.1X',

  /**
   * G.2X Worker Type
   * 2 DPU (8 vCPU, 32 GB of memory, 128 GB disk), and provides 1 executor per worker. Suitable for memory-intensive jobs.
   */
  G_2X = 'G.2X',

  /**
   * G.4X Worker Type
   * 4 DPU (16 vCPU, 64 GB of memory, 256 GB disk), and provides 1 executor per worker.
   * We recommend this worker type for jobs whose workloads contain your most demanding transforms,
   * aggregations, joins, and queries. This worker type is available only for AWS Glue version 3.0 or later jobs.
   */
  G_4X = 'G.4X',

  /**
   * G.8X Worker Type
   * 8 DPU (32 vCPU, 128 GB of memory, 512 GB disk), and provides 1 executor per worker. We recommend this worker
   * type for jobs whose workloads contain your most demanding transforms, aggregations, joins, and queries.
   * This worker type is available only for AWS Glue version 3.0 or later jobs.
   */
  G_8X = 'G.8X',

  /**
   * G.12X Worker Type
   * 12 DPU (48 vCPU, 192 GB of memory, 768 GB disk), and provides 1 executor per worker.
   * We recommend this worker type for jobs with very large and resource-intensive workloads
   * that require significant compute capacity. This worker type is available only for
   * AWS Glue version 3.0 or later jobs.
   */
  G_12X = 'G.12X',

  /**
   * G.16X Worker Type
   * 16 DPU (64 vCPU, 256 GB of memory, 1024 GB disk), and provides 1 executor per worker.
   * We recommend this worker type for jobs with the largest and most resource-intensive workloads
   * that require maximum compute capacity. This worker type is available only for
   * AWS Glue version 3.0 or later jobs.
   */
  G_16X = 'G.16X',

  /**
   * G.025X Worker Type
   * 0.25 DPU (2 vCPU, 4 GB of memory, 64 GB disk), and provides 1 executor per worker. Suitable for low volume streaming jobs.
   */
  G_025X = 'G.025X',

  /**
   * Z.2X Worker Type
   */
  Z_2X = 'Z.2X',

  /**
   * R.1X Worker Type
   * 1 M-DPU (4 vCPUs, 32 GB memory), We recommend this worker type for memory-intensive workloads
   * that frequently encounter out-of-memory errors or require high memory-to-CPU ratios.
   */
  R_1X = 'R.1X',

  /**
   * R.2X Worker Type
   * 2 M-DPU (8 vCPUs, 64 GB memory), We recommend this worker type for memory-intensive workloads
   * that frequently encounter out-of-memory errors or require high memory-to-CPU ratios.
   */
  R_2X = 'R.2X',

  /**
   * R.4X Worker Type
   * 4 M-DPU (16 vCPUs, 128 GB memory), We recommend this worker type for large memory-intensive workloads
   * that frequently encounter out-of-memory errors or require high memory-to-CPU ratios.
   */
  R_4X = 'R.4X',

  /**
   * R.8X Worker Type
   * 8 M-DPU (32 vCPUs, 256 GB memory), We recommend this worker type for very large memory-intensive workloads
   * that frequently encounter out-of-memory errors or require high memory-to-CPU ratios.
   */
  R_8X = 'R.8X',
}

/**
 * The number of workers of a defined workerType that are allocated when a job runs.
 *
 * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-jobs-job.html
 */

/**
 * Job states emitted by Glue to CloudWatch Events.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/EventTypes.html#glue-event-types for more information.
 */
export enum JobState {
  /**
   * State indicating job run succeeded
   */
  SUCCEEDED = 'SUCCEEDED',

  /**
   * State indicating job run failed
   */
  FAILED = 'FAILED',

  /**
   * State indicating job run timed out
   */
  TIMEOUT = 'TIMEOUT',

  /**
   * State indicating job is starting
   */
  STARTING = 'STARTING',

  /**
   * State indicating job is running
   */
  RUNNING = 'RUNNING',

  /**
   * State indicating job is stopping
   */
  STOPPING = 'STOPPING',

  /**
   * State indicating job stopped
   */
  STOPPED = 'STOPPED',
}

/**
 * The Glue CloudWatch metric type.
 *
 * @see https://docs.aws.amazon.com/glue/latest/dg/monitoring-awsglue-with-cloudwatch-metrics.html
 */
export enum MetricType {
  /**
   * A value at a point in time.
   */
  GAUGE = 'gauge',

  /**
   * An aggregate number.
   */
  COUNT = 'count',
}

/**
 * The ExecutionClass whether the job is run with a standard or flexible execution class.
 *
 * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-jobs-job.html#aws-glue-api-jobs-job-Job
 * @see https://docs.aws.amazon.com/glue/latest/dg/add-job.html
 */
export enum ExecutionClass {
  /**
   * The flexible execution class is appropriate for time-insensitive jobs whose start
   * and completion times may vary.
   */
  FLEX = 'FLEX',

  /**
   * The standard execution class is ideal for time-sensitive workloads that require fast job
   * startup and dedicated resources.
   */
  STANDARD = 'STANDARD',
}

/**
 * AWS Glue version determines the versions of Apache Spark and Python that are available to the job.
 *
 * @see https://docs.aws.amazon.com/glue/latest/dg/add-job.html.
 */
export enum GlueVersion {
  /**
   * Glue version using Spark 2.2.1 and Python 2.7
   */
  V0_9 = '0.9',

  /**
   * Glue version using Spark 2.4.3, Python 2.7 and Python 3.6
   */
  V1_0 = '1.0',

  /**
   * Glue version using Spark 2.4.3 and Python 3.7
   */
  V2_0 = '2.0',

  /**
   * Glue version using Spark 3.1.1 and Python 3.7
   */
  V3_0 = '3.0',

  /**
   * Glue version using Spark 3.3.0 and Python 3.10
   */
  V4_0 = '4.0',

  /**
   * Glue version using Spark 3.5.2 and Python 3.11
   */
  V5_0 = '5.0',

}

/**
 * Runtime language of the Glue job
 */
export enum JobLanguage {
  /**
   * Scala
   */
  SCALA = 'scala',

  /**
   * Python
   */
  PYTHON = 'python',
}

/**
 * Python version
 */
export enum PythonVersion {
  /**
   * Python 2 (the exact version depends on GlueVersion and JobCommand used)
   */
  TWO = '2',

  /**
   * Python 3 (the exact version depends on GlueVersion and JobCommand used)
   */
  THREE = '3',

  /**
   * Python 3.9 (the exact version depends on GlueVersion and JobCommand used)
   */
  THREE_NINE = '3.9',

}

/**
 * AWS Glue runtime determines the runtime engine of the job.
 *
 */
export enum Runtime {
  /**
   * Runtime for a Glue for Ray 2.4.
   */
  RAY_TWO_FOUR = 'Ray2.4',
}

/**
 * The job type.
 */
export enum JobType {
  /**
   * Command for running a Glue Spark job.
   */
  ETL = 'glueetl',

  /**
   * Command for running a Glue Spark streaming job.
   */
  STREAMING = 'gluestreaming',

  /**
   * Command for running a Glue python shell job.
   */
  PYTHON_SHELL = 'pythonshell',

  /**
   * Command for running a Glue Ray job.
   */
  RAY = 'glueray',

}

/**
 * The number of AWS Glue data processing units (DPUs) that can be allocated when this job runs. A DPU is a relative measure of processing power that consists of 4 vCPUs of compute capacity and 16 GB of memory.
 */
export enum MaxCapacity {
  /**
   * DPU value of 1/16th
   */
  DPU_1_16TH = 0.0625,

  /**
   * DPU value of 1
   */
  DPU_1 = 1,
}

/*
 * Represents the logical operator for combining multiple conditions in the Glue Trigger API.
 */
export enum PredicateLogical {
  /**
   * All conditions must be true for the predicate to be true.
   */
  AND = 'AND',

  /**
   * At least one condition must be true for the predicate to be true.
   */
  ANY = 'ANY',
}

/**
 * Represents the logical operator for evaluating a single condition in the Glue Trigger API.
 */
export enum ConditionLogicalOperator {
  /** The condition is true if the values are equal. */
  EQUALS = 'EQUALS',
}

/**
 * Represents the state of a crawler for a condition in the Glue Trigger API.
 */
export enum CrawlerState {
  /** The crawler is currently running. */
  RUNNING = 'RUNNING',

  /** The crawler is in the process of being cancelled. */
  CANCELLING = 'CANCELLING',

  /** The crawler has been cancelled. */
  CANCELLED = 'CANCELLED',

  /** The crawler has completed its operation successfully. */
  SUCCEEDED = 'SUCCEEDED',

  /** The crawler has failed to complete its operation. */
  FAILED = 'FAILED',

  /** The crawler encountered an error during its operation. */
  ERROR = 'ERROR',
}
