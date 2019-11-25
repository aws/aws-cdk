import iam = require('@aws-cdk/aws-iam');
import { Construct, IResource, Resource, Duration, Lazy } from '@aws-cdk/core';
import { Connection } from './connection'
import { CfnJob } from './glue.generated';

/**
 * The Python version being used to execute a Python shell job.
 */
export enum JobCommandPythonVersion {
  PYTHON_2 = '2',
  PYTHON_3 = '3'
}

/**
 * The type of job command
 */
export enum JobCommandTypes {
  SPARK_ETL = 'glueetl',
  PYTHON_SHELL = 'pythonshell'
}

/**
 * The Python version being used to execute a Python shell job.
 */
export enum GlueVersion {
  GLUE0_9 = '0.9',
  ONE = '1.0'
}

/**
 * The type of predefined worker that is allocated when a job runs.
 */
export enum WorkerType {
  STANDARD = 'STANDARD',
  G1_X = 'G1.X',
  G2_X = 'G2.X'
}

/**
 * Specifies code executed when a job is run.
 */
export interface IJobCommand {
  /**
   * @attribute
   */
  readonly name?: JobCommandTypes;

  /**
   * @attribute
   */
  readonly scriptLocation?: string;

  /**
   * @attribute
   */
  readonly pythonVersion?: JobCommandPythonVersion;
}

export interface IJob extends IResource {
  /**
   * @attribute
   */
  readonly allocatedCapacity?: number;

  /**
   * @attribute
   */
  readonly command: IJobCommand;

  /**
   * @attribute
   */
  readonly connections?: Connection[];

  /**
   * @attribute
   */
  readonly defaultArguments?: object;

  /**
   * @attribute
   */
  readonly description?: string;

  /**
   * @attribute
   */
  readonly maxConcurrentRuns?: number;

  /**
   * @attribute
   */
  readonly glueVersion?: GlueVersion;

  /**
   * @attribute
   */
  readonly logUri?: string;

  /**
   * @attribute
   */
  readonly maxCapacity?: number;

  /**
   * @attribute
   */
  readonly maxRetries?: number;

  /**
   * @attribute
   */
  readonly name?: string;

  /**
   * @attribute
   */
  readonly notifyDelayAfter?: number;

  /**
   * @attribute
   */
  readonly numberOfWorkers?: number;

  /**
   * @attribute
   */
  readonly role: iam.Role;

  /**
   * @attribute
   */
  readonly securityConfiguration?: string;

  /**
   * @attribute
   */
  readonly tags?: object;

  /**
   * @attribute
   */
  readonly timeout?: Duration;

  /**
   * @attribute
   */
  readonly workerType?: WorkerType;

  /**
   * @attribute
   */
  readonly jobName: string;
}

export interface ConnectionInputAttributes {
  readonly allocatedCapacity?: number;
  readonly command: IJobCommand;
  readonly connections?: Connection[];
  readonly defaultArguments?: object;
  readonly description?: string;
  readonly maxConcurrentRuns?: number;
  readonly glueVersion?: GlueVersion;
  readonly logUri?: string;
  readonly maxCapacity?: number;
  readonly name?: string;
  readonly notifyDelayAfter?: number;
  readonly numberOfWorkers?: number;
  readonly role: iam.Role;
  readonly securityConfiguration?: string;
  readonly tags?: object;
  readonly timeout?: Duration;
  readonly workerType?: WorkerType;
}

export interface ConnectionInputProps {
  readonly allocatedCapacity?: number;
  readonly command: IJobCommand;
  readonly connections?: Connection[];
  readonly defaultArguments?: object;
  readonly description?: string;
  readonly maxConcurrentRuns?: number;
  readonly glueVersion?: GlueVersion;
  readonly logUri?: string;
  readonly maxCapacity?: number;
  readonly maxRetries?: number;
  readonly name?: string;
  readonly notifyDelayAfter?: number;
  readonly numberOfWorkers?: number;
  readonly role?: iam.Role;
  readonly securityConfiguration?: string;
  readonly tags?: object;
  readonly timeout?: Duration;
  readonly workerType?: WorkerType;
}

export class Job extends Resource implements IJob {
  // /** TODO
  //  * Imports a glue job from the specified job ARN.
  //  */
  // public static fromJobArn(scope: Construct, id: string, jobArn: string): IJob {
  //   // TODO
  // }

  /**
   * TThe number of capacity units that are allocated to this job.
   */
  public readonly allocatedCapacity?: number;

  /**
   * The code that executes a job.
   */
  public readonly command: IJobCommand;

  /**
   * The connections used for this job.
   */
  public readonly connections?: Connection[];

  /**
   * The default arguments for this job, specified as name-value pairs.
   * 
   * You can specify arguments here that your own job-execution script consumes,
   * in addition to arguments that AWS Glue itself consumes.
   * 
   * For information about how to specify and consume your own job arguments,
   * see Calling AWS Glue APIs in Python in the AWS Glue Developer Guide.
   * 
   * For information about the key-value pairs that AWS Glue consumes to set
   * up your job, see Special Parameters Used by AWS Glue in the AWS Glue
   * Developer Guide.
   */
  public readonly defaultArguments?: object;

  /**
   * A description of the job.
   */
  public readonly description: string;

  /**
   * The maximum number of concurrent runs allowed for the job. The default is 1.
   * An error is returned when this threshold is reached. The maximum value you can
   * specify is controlled by a service limit.
   */
  public readonly maxConcurrentRuns?: number;

  /**
   * Glue version determines the versions of Apache Spark and Python that AWS Glue
   * supports. The Python version indicates the version supported for jobs of type Spark.
   * 
   * For more information about the available AWS Glue versions and corresponding
   * Spark and Python versions, see Glue version in the developer guide.
   * 
   * Jobs that are created without specifying a Glue version default to Glue 0.9.
   */
  public readonly glueVersion?: GlueVersion;

  /**
   * This field is reserved for future use.
   */
  public readonly logUri?: string;

  /**
   * The number of AWS Glue data processing units (DPUs) that can be allocated when
   * this job runs. A DPU is a relative measure of processing power that consists of
   * 4 vCPUs of compute capacity and 16 GB of memory.
   * 
   * Do not set Max Capacity if using WorkerType and NumberOfWorkers.
   * 
   * The value that can be allocated for MaxCapacity depends on whether you are running
   * a Python shell job or an Apache Spark ETL job:
   * 
   *      When you specify a Python shell job (JobCommand.Name="pythonshell"), you can
   *      allocate either 0.0625 or 1 DPU. The default is 0.0625 DPU.
   * 
   *      When you specify an Apache Spark ETL job (JobCommand.Name="glueetl"), you can
   *      allocate from 2 to 100 DPUs. The default is 10 DPUs. This job type cannot have
   *      a fractional DPU allocation.
   */
  public readonly maxCapacity?: number;

  /**
   * The maximum number of times to retry this job after a JobRun fails.
   */
  public readonly maxRetries?: number;

  /**
   * The name you assign to this job definition.
   */
  public readonly name?: string;

  /**
   * After a job run starts, the number of minutes to wait before sending a job run
   * delay notification.
   */
  public readonly notifyDelayAfter?: number;

  /**
   * The number of workers of a defined workerType that are allocated when a job runs.
   * 
   * The maximum number of workers you can define are 299 for G.1X, and 149 for G.2X.
   */
  public readonly numberOfWorkers?: number;

  /**
   * The name or Amazon Resource Name (ARN) of the IAM role associated with this job.
   */
  public readonly role: iam.Role;

  /**
   * The name of the SecurityConfiguration structure to be used with this job.
   */
  public readonly securityConfiguration?: string;

  /**
   * The tags to use with this job.
   */
  public readonly tags?: object;

  /**
   * The job timeout in minutes. This is the maximum time that a job run can consume
   * resources before it is terminated and enters TIMEOUT status.
   * The default is 2,880 minutes (48 hours).
   */
  public readonly timeout?: Duration;

  /**
   * The type of predefined worker that is allocated when a job runs. Accepts a value of
   * Standard, G.1X, or G.2X.
   * 
   *    For the Standard worker type, each worker provides 4 vCPU, 16 GB of memory and a
   *    50GB disk, and 2 executors per worker.
   * 
   *    For the G.1X worker type, each worker maps to 1 DPU (4 vCPU, 16 GB of memory,
   *    64 GB disk), and provides 1 executor per worker. We recommend this worker type
   *    for memory-intensive jobs.
   * 
   *    For the G.2X worker type, each worker maps to 2 DPU (8 vCPU, 32 GB of memory,
   *    128 GB disk), and provides 1 executor per worker. We recommend this worker type
   *    for memory-intensive jobs.
   */
  public readonly workerType?: WorkerType;
  
  /**
   * The job name
   */
  public readonly jobName: string;

  constructor(scope: Construct, id: string, props: ConnectionInputProps) {
    super(scope, id);

    this.allocatedCapacity = props.allocatedCapacity;
    this.command = props.command;

    if (props.connections) {
      props.connections.forEach(c => this.addConnection(c));
    }

    this.defaultArguments = props.defaultArguments;
    this.description = props.description;
    this.maxConcurrentRuns = props.maxConcurrentRuns;
    this.glueVersion = props.glueVersion;
    this.logUri = props.logUri;
    this.maxCapacity = props.maxCapacity;
    this.maxRetries = props.maxRetries;
    this.name = props.name;
    this.notifyDelayAfter = props.notifyDelayAfter;
    this.numberOfWorkers = props.numberOfWorkers;

    // TODO: add role
    if (!(props.role)) {
      this.role = new iam.Role(this, 'JobRole')
    }

    this.securityConfiguration = props.securityConfiguration;
    this.tags = props.tags;
    this.timeout = props.timeout;
    this.workerType = props.workerType;

    const jobResource = new CfnJob(this, 'Job', {
      allocatedCapacity: this.allocatedCapacity,
      command: this.command,
      connections: Lazy.anyValue({ produce: () => this.connections }, { omitEmptyArray: true }),
      defaultArguments: JSON.stringify(this.defaultArguments),
      description: this.description,
      
      executionProperty: {
        maxConcurrentRuns: this.maxConcurrentRuns
      },

      glueVersion: this.glueVersion,
      logUri: this.logUri,
      maxCapacity: this.maxCapacity,
      maxRetries: this.maxRetries,
      name: this.name,

      notificationProperty: {
        notifyDelayAfter: this.notifyDelayAfter
      },

      numberOfWorkers: this.numberOfWorkers,

      role: this.role,
      securityConfiguration: this.securityConfiguration,
      tags: this.tags,
      timeout: this.timeout.toMinutes(),
      workerType: this.workerType
    })

    this.jobName = this.getResourceNameAttribute(jobResource.ref);

    // TODO
    // this.jobArn = this.stack.formatArn({
    //   service: 'glue',
    //   resource: 'job',
    //   // resourceName: `${this.database.databaseName}/${this.tableName}`
    // });

    this.node.defaultChild = jobResource
  }


  /**
   * Adds a connection to the glue job.
   */
  public addConnection(connection: Connection) {
    this.connections.push(connection);
  }
}
