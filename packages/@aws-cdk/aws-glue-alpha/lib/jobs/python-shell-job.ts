import { CfnJob } from 'aws-cdk-lib/aws-glue';
import type * as iam from 'aws-cdk-lib/aws-iam';
import { memoizedGetter } from 'aws-cdk-lib/core/lib/helpers-internal';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
import type { JobProps } from './job';
import { Job } from './job';
import type { Code } from '../code';
import { JobType, GlueVersion, PythonVersion, MaxCapacity, JobLanguage, LibrarySet } from '../constants';

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
   * The set of pre-installed Python libraries to make available to the job.
   *
   * Only applies to jobs running Python 3.9. Set to `LibrarySet.NONE` when your libraries are
   * custom or conflict with the pre-installed ones.
   *
   * @default LibrarySet.ANALYTICS when running Python 3.9, otherwise no library set is configured
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/add-job-python.html#python-shell-supported-library
   */
  readonly librarySet?: LibrarySet;

  /**
   * Additional Python files that AWS Glue adds to the Python path before executing your script.
   * Only individual files are supported, directories are not supported.
   * Equivalent to the `--extra-py-files` job argument.
   *
   * @default - no extra Python files
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly extraPythonFiles?: Code[];

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
@propertyInjectable
export class PythonShellJob extends Job {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-glue-alpha.PythonShellJob';
  public readonly role: iam.IRole;
  public readonly grantPrincipal: iam.IPrincipal;
  private resource: CfnJob;

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

    // Enable continuous logging by default as a best practice. Note: the --enable-metrics and
    // --enable-observability-metrics arguments are intentionally NOT set here. Those profiling
    // metrics require the Spark/GlueContext instrumentation that Python shell jobs do not have, so
    // Glue accepts but ignores them for the pythonshell command (verified: a pythonshell run with
    // --enable-metrics emits no JobName-dimensioned CloudWatch metrics). See SparkJob/RayJob for
    // the job types where these metrics apply.
    const continuousLoggingArgs = this.setupContinuousLogging(this.role, props.continuousLogging, props.securityConfiguration);

    // Gather executable arguments
    const executableArgs = this.executableArguments(props);

    // Set up extra Python files argument
    const extraPythonFilesArgs: {[key: string]: string} = {};
    if (props.extraPythonFiles && props.extraPythonFiles.length > 0) {
      extraPythonFilesArgs['--extra-py-files'] = props.extraPythonFiles.map(code => this.codeS3ObjectUrl(code)).join(',');
    }

    // Combine command line arguments into a single line item
    const managedArguments = {
      ...executableArgs,
      ...extraPythonFilesArgs,
      ...continuousLoggingArgs,
    };
    const defaultArguments = this.mergeManagedArguments(managedArguments, props.defaultArguments);

    this.resource = new CfnJob(this, 'Resource', {
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
  }

  @memoizedGetter
  public get jobArn(): string {
    return this.buildJobArn(this, this.jobName);
  }

  @memoizedGetter
  public get jobName(): string {
    return this.getResourceNameAttribute(this.resource.ref);
  }

  /**
   * Set the executable arguments with best practices enabled by default
   *
   * @returns An array of arguments for Glue to use on execution
   */
  private executableArguments(props: PythonShellJobProps) {
    const args: { [key: string]: string } = {};
    args['--job-language'] = JobLanguage.PYTHON;

    // The library-set option only applies to Python 3.9 (the default version). Default to the
    // common analytics libraries, but let the caller override it (e.g. LibrarySet.NONE) via the
    // typed prop. Note: Glue names this argument `library-set`, without the `--` prefix.
    if (!props.pythonVersion || props.pythonVersion == PythonVersion.THREE_NINE) {
      args['library-set'] = props.librarySet ?? LibrarySet.ANALYTICS;
    }

    return args;
  }
}
