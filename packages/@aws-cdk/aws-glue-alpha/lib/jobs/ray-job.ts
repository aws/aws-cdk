import { Job, JobProps } from './job';
import { Construct } from 'constructs';
import { JobType, GlueVersion, WorkerType, Runtime } from '../constants';

/**
 * Properties for creating a Ray Glue job
 */
export interface RayJobProps extends JobProps {
  /**
   * Sets the Ray runtime environment version
   *
   * @default - Runtime version will default to Ray2.4
   */
  readonly runtime?: Runtime;
}

/**
 * Ray Jobs class
 *
 * Glue Ray jobs use worker type Z.2X and Glue version 4.0.
 * These are not overrideable since these are the only configuration that
 * Glue Ray jobs currently support. The runtime defaults to Ray2.4 and min
 * workers defaults to 3.
 */
export class RayJob extends Job {
  public readonly jobArn: string;
  public readonly jobName: string;

  /**
   * RayJob constructor
   */
  constructor(scope: Construct, id: string, props: RayJobProps) {
    super(scope, id, props);

    // Enable CloudWatch metrics and continuous logging by default as a best practice
    const continuousLoggingArgs = this.setupContinuousLogging(props.continuousLogging);
    const profilingMetricsArgs = { '--enable-metrics': '' };
    const observabilityMetricsArgs = { '--enable-observability-metrics': 'true' };

    // Combine command line arguments into a single line item
    const defaultArguments = {
      ...this.checkNoReservedArgs(props.defaultArguments),
      ...continuousLoggingArgs,
      ...profilingMetricsArgs,
      ...observabilityMetricsArgs,
    };

    if (props.workerType && props.workerType !== WorkerType.Z_2X) {
      throw new Error('Ray jobs only support Z.2X worker type');
    }

    const jobResource = Job.setupJobResource(this, props, {
      role: this.role!.roleArn,
      command: {
        name: JobType.RAY,
        scriptLocation: this.codeS3ObjectUrl(props.script),
        runtime: props.runtime ? props.runtime : Runtime.RAY_TWO_FOUR,
      },
      glueVersion: GlueVersion.V4_0,
      workerType: props.workerType ? props.workerType : WorkerType.Z_2X,
      numberOfWorkers: props.numberOfWorkers ? props.numberOfWorkers: 3,
      defaultArguments,
    });

    const resourceName = this.getResourceNameAttribute(jobResource.ref);
    this.jobArn = Job.buildJobArn(this, resourceName);
    this.jobName = resourceName;
  }
}
