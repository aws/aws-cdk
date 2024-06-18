import { CfnJob } from 'aws-cdk-lib/aws-glue';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Job, JobProperties } from './job';
import { Construct } from 'constructs';
import { JobType, GlueVersion, PythonVersion, MaxCapacity } from '../constants';

/**
 * Python Shell Jobs class
 *
 * A Python shell job runs Python scripts as a shell and supports a Python version that
 * depends on the AWS Glue version you are using.
 * This can be used to schedule and run tasks that don't require an Apache Spark environment.
 *
 */

/**
 * Properties for creating a Python Shell job
 */
export interface PythonShellJobProps extends JobProperties {
  /**
  * Python Version
  * The version of Python to use to execute this job
  * @default 3.9 for Shell Jobs
  **/
  readonly pythonVersion?: PythonVersion;

  /**
   * The total number of DPU to assign to the Python Job
   * @default 0.0625
   */
  readonly maxCapacity?: MaxCapacity;
}

/**
 * A Python Shell Glue Job
 */
export class PythonShellJob extends Job {

  // Implement abstract Job attributes
  public readonly jobArn: string;
  public readonly jobName: string;
  public readonly role: iam.IRole;
  public readonly grantPrincipal: iam.IPrincipal;

  /**
  * PythonShellJob constructor
  *
  * @param scope
  * @param id
  * @param props
  */
  constructor(scope: Construct, id: string, props: PythonShellJobProps) {
    super(scope, id, { physicalName: props.jobName });

    // Set up role and permissions for principal
    this.role = props.role, {
      assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSGlueServiceRole')],
    };
    this.grantPrincipal = this.role;

    // Gather executable arguments
    const executableArgs = this.executableArguments(props);

    // Combine command line arguments into a single line item
    const defaultArguments = {
      ...executableArgs,
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
      maxRetries: props.maxRetries ? props.maxRetries : 0,
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
  * @param props
  * @returns An array of arguments for Glue to use on execution
  */
  private executableArguments(props: PythonShellJobProps) {
    const args: { [key: string]: string } = {};

    //If no Python version set (default 3.9) or the version is set to 3.9 then set library-set argument
    if (!props.pythonVersion || props.pythonVersion == PythonVersion.THREE_NINE) {
      //Selecting this option includes common libraries for Python 3.9
      args['library-set'] = 'analytics';
    }

    return args;
  }
}