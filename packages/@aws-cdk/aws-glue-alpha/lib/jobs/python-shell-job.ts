import { CfnJob } from 'aws-cdk-lib/aws-glue';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Job, JobProps } from './job';
import { Construct } from 'constructs';
import { JobType, GlueVersion, PythonVersion, MaxCapacity, JobLanguage } from '../constants';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';

/**
 * Properties for creating a Python Shell job
 */
export interface PythonShellJobProps extends JobProps {
  /**
   * Python Version
   * The version of Python to use to execute this job
   * @default 3.9 for Shell Jobs
   **/
  readonly pythonVersion?: PythonVersion;

  /**
   * The total number of DPU to assign to the Python Job
   *
   * @default 0.0625
   */
  readonly maxCapacity?: MaxCapacity;

  /**
   * Specifies whether job run queuing is enabled for the job runs for this job.
   * A value of true means job run queuing is enabled for the job runs.
   * If false or not populated, the job runs will not be considered for queueing.
   * If this field does not match the value set in the job run, then the value from
   * the job run field will be used. This property must be set to false for flex jobs.
   * If this property is enabled, maxRetries must be set to zero.
   *
   * @default false
   */
  readonly jobRunQueuingEnabled?: boolean;
}

/**
 * Python Shell Jobs class
 *
 * A Python shell job runs Python scripts as a shell and supports a Python version that
 * depends on the AWS Glue version you are using.
 * This can be used to schedule and run tasks that don't require an Apache Spark environment.
 */
export class PythonShellJob extends Job {
  public readonly jobArn: string;
  public readonly jobName: string;
  public readonly role: iam.IRole;
  public readonly grantPrincipal: iam.IPrincipal;

  /**
   * PythonShellJob constructor
   */
  constructor(scope: Construct, id: string, props: PythonShellJobProps) {
    super(scope, id, { physicalName: props.jobName });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // Set up role and permissions for principal
    this.role = props.role;
    this.grantPrincipal = this.role;

    // Enable CloudWatch metrics and continuous logging by default as a best practice
    const continuousLoggingArgs = this.setupContinuousLogging(this.role, props.continuousLogging);
    const profilingMetricsArgs = { '--enable-metrics': '' };
    const observabilityMetricsArgs = { '--enable-observability-metrics': 'true' };

    // Gather executable arguments
    const executableArgs = this.executableArguments(props);

    // Combine command line arguments into a single line item
    const defaultArguments = {
      ...executableArgs,
      ...continuousLoggingArgs,
      ...profilingMetricsArgs,
      ...observabilityMetricsArgs,
      ...this.checkNoReservedArgs(props.defaultArguments),
    };

    const jobResource = new CfnJob(this, 'Resource', {
      name: props.jobName,
      description: props.description,
      role: this.role.roleArn,
      command: {
        name: JobType.PYTHON_SHELL,
        scriptLocation: this.codeS3ObjectUrl(props.script),
        pythonVersion: props.pythonVersion ? props.pythonVersion : PythonVersion.THREE_NINE,
      },
      glueVersion: props.glueVersion ? props.glueVersion : GlueVersion.V3_0,
      maxCapacity: props.maxCapacity ? props.maxCapacity : MaxCapacity.DPU_1_16TH,
      maxRetries: props.jobRunQueuingEnabled ? 0 : props.maxRetries ? props.maxRetries : 0,
      jobRunQueuingEnabled: props.jobRunQueuingEnabled ? props.jobRunQueuingEnabled : false,
      executionProperty: props.maxConcurrentRuns ? { maxConcurrentRuns: props.maxConcurrentRuns } : undefined,
      timeout: props.timeout?.toMinutes(),
      connections: props.connections ? { connections: props.connections.map((connection) => connection.connectionName) } : undefined,
      securityConfiguration: props.securityConfiguration?.securityConfigurationName,
      tags: props.tags,
      defaultArguments,
    });

    const resourceName = this.getResourceNameAttribute(jobResource.ref);
    this.jobArn = this.buildJobArn(this, resourceName);
    this.jobName = resourceName;
  }

  /**
   * Set the executable arguments with best practices enabled by default
   *
   * @returns An array of arguments for Glue to use on execution
   */
  private executableArguments(props: PythonShellJobProps) {
    const args: { [key: string]: string } = {};
    args['--job-language'] = JobLanguage.PYTHON;

    // If no Python version set (default 3.9) or the version is set to 3.9 then set library-set argument
    if (!props.pythonVersion || props.pythonVersion == PythonVersion.THREE_NINE) {
      // Selecting this option includes common libraries for Python 3.9
      args['library-set'] = 'analytics';
    }

    return args;
  }
}
