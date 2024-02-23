/**
 * The type of predefined worker that is allocated when a job runs.
 *
 * If you need to use a WorkerType that doesn't exist as a static member, you
 * can instantiate a `WorkerType` object, e.g: `WorkerType.of('other type')`
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
   * G.025X Worker Type
   * 0.25 DPU (2 vCPU, 4 GB of memory, 64 GB disk), and provides 1 executor per worker. Suitable for low volume streaming jobs.
   */
  G_025X = 'G.025X',

  /**
   * Z.2X Worker Type
   */
  Z_2X = 'Z.2X',
}

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
 *
 * If you need to use a JobType that doesn't exist as a static member, you
 * can instantiate a `JobType` object, e.g: `JobType.of('other name')`.
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

