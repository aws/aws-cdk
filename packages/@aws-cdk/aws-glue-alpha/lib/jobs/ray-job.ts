import { CfnJob } from 'aws-cdk-lib/aws-glue';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Job, JobProps } from './job';
import { Construct } from 'constructs';
import { JobType, GlueVersion, WorkerType, Runtime } from '../constants';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import { ValidationError } from 'aws-cdk-lib/core';

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

  /**
   * Specifies whether job run queuing is enabled for the job runs for this job.
   * A value of true means job run queuing is enabled for the job runs.
   * If false or not populated, the job runs will not be considered for queueing.
   * If this field does not match the value set in the job run, then the value from
   * the job run field will be used. This property must be set to false for flex jobs.
   * If this property is enabled, maxRetries must be set to zero.
   *
   * @default - no job run queuing
   */
  readonly jobRunQueuingEnabled?: boolean;

  /**
   * Enable profiling metrics for the Glue job.
   *
   * When enabled, adds '--enable-metrics' to job arguments.
   *
   * @default true
   */
  readonly enableMetrics?: boolean;

  /**
   * Enable observability metrics for the Glue job.
   *
   * When enabled, adds '--enable-observability-metrics': 'true' to job arguments.
   *
   * @default true
   */
  readonly enableObservabilityMetrics?: boolean;
}

/**
 * Ray Jobs class
 *
 * Glue Ray jobs use worker type Z.2X and Glue version 4.0.
 * These are not overrideable since these are the only configuration that
 * Glue Ray jobs currently support. The runtime defaults to Ray2.4 and min
 * workers defaults to 3.
 */
@propertyInjectable
export class RayJob extends Job {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-glue-alpha.RayJob';
  public readonly jobArn: string;
  public readonly jobName: string;
  public readonly role: iam.IRole;
  public readonly grantPrincipal: iam.IPrincipal;

  /**
   * RayJob constructor
   */
  constructor(scope: Construct, id: string, props: RayJobProps) {
    super(scope, id, {
      physicalName: props.jobName,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.jobName = props.jobName ?? '';

    // Set up role and permissions for principal
    this.role = props.role;
    this.grantPrincipal = this.role;

    // Enable CloudWatch metrics and continuous logging by default as a best practice
    const continuousLoggingArgs = this.setupContinuousLogging(this.role, props.continuousLogging);

    // Conditionally include metrics arguments (default to enabled for backward compatibility)
    const profilingMetricsArgs = (props.enableMetrics ?? true) ? { '--enable-metrics': '' } : {};
    const observabilityMetricsArgs = (props.enableObservabilityMetrics ?? true) ? { '--enable-observability-metrics': 'true' } : {};

    // Combine command line arguments into a single line item
    const defaultArguments = {
      ...this.checkNoReservedArgs(props.defaultArguments),
      ...continuousLoggingArgs,
      ...profilingMetricsArgs,
      ...observabilityMetricsArgs,
    };

    if (props.workerType && props.workerType !== WorkerType.Z_2X) {
      throw new ValidationError('Ray jobs only support Z.2X worker type', this);
    }

    const jobResource = new CfnJob(this, 'Resource', {
      name: props.jobName,
      description: props.description,
      role: this.role.roleArn,
      command: {
        name: JobType.RAY,
        scriptLocation: this.codeS3ObjectUrl(props.script),
        runtime: props.runtime ? props.runtime : Runtime.RAY_TWO_FOUR,
      },
      glueVersion: GlueVersion.V4_0,
      workerType: props.workerType ? props.workerType : WorkerType.Z_2X,
      numberOfWorkers: props.numberOfWorkers ? props.numberOfWorkers: 3,
      maxRetries: props.jobRunQueuingEnabled ? 0 : props.maxRetries,
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
}
