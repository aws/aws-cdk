import { CfnJob } from 'aws-cdk-lib/aws-glue';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Job, JobProperties } from './job';
import { Construct } from 'constructs';
import { JobType, GlueVersion, WorkerType, Runtime } from '../constants';

/**
 * Ray Jobs class
 *
 * Glue ray only supports worker type Z.2X and Glue version 4.0.
 * Runtime will default to Ray2.4 and min workers will default to 3.
 *
 */

/**
 * Properties for creating a Ray Glue job
 */
export interface RayJobProps extends JobProperties {
  /**
   * Sets the Ray runtime environment version
   *
   * @default - Runtime version will default to Ray2.4
   */
  readonly runtime?: Runtime;
}

/**
 * A Ray Glue Job
 */
export class RayJob extends Job {

  // Implement abstract Job attributes
  public readonly jobArn: string;
  public readonly jobName: string;
  public readonly role: iam.IRole;
  public readonly grantPrincipal: iam.IPrincipal;

  /**
   * RayJob constructor
   *
   * @param scope
   * @param id
   * @param props
   */

  constructor(scope: Construct, id: string, props: RayJobProps) {
    super(scope, id, {
      physicalName: props.jobName,
    });

    // List of supported Glue versions by Ray
    const supportedGlueVersions = [
      GlueVersion.V4_0,
    ];

    // Set up role and permissions for principal
    this.role = props.role, {
      assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSGlueServiceRole')],
    };
    this.grantPrincipal = this.role;

    // Combine command line arguments into a single line item
    const defaultArguments = {
      ...this.checkNoReservedArgs(props.defaultArguments),
    };

    if (props.workerType && props.workerType !== WorkerType.Z_2X) {
      throw new Error('Ray jobs only support Z.2X worker type');
    };

    if (props.glueVersion && !(supportedGlueVersions.includes(props.glueVersion))) {
      throw new Error('You must set GlueVersion to 4.0 or greater');
    };

    const jobResource = new CfnJob(this, 'Resource', {
      name: props.jobName,
      description: props.description,
      role: this.role.roleArn,
      command: {
        name: JobType.RAY,
        scriptLocation: this.codeS3ObjectUrl(props.script),
        runtime: props.runtime ? props.runtime : Runtime.RAY_TWO_FOUR,
      },
      glueVersion: props.glueVersion ? props.glueVersion : GlueVersion.V4_0,
      workerType: props.workerType ? props.workerType : WorkerType.Z_2X,
      numberOfWorkers: props.numberOrWorkers,
      maxRetries: props.maxRetries,
      executionProperty: props.maxConcurrentRuns ? { maxConcurrentRuns: props.maxConcurrentRuns } : undefined,
      //notificationProperty: props.notifyDelayAfter ? { notifyDelayAfter: props.notifyDelayAfter.toMinutes() } : undefined,
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