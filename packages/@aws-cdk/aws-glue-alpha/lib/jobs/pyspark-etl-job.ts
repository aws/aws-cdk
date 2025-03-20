import { Construct } from 'constructs';
import { JobType, GlueVersion, JobLanguage, PythonVersion, WorkerType } from '../constants';
import { Code } from '../code';
import { SparkJob, SparkJobProps } from './spark-job';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';

/**
 * Properties for creating a Python Spark ETL job
 */
export interface PySparkEtlJobProps extends SparkJobProps {
  /**
   * Extra Python Files S3 URL (optional)
   * S3 URL where additional python dependencies are located
   *
   * @default - no extra files
   */
  readonly extraPythonFiles?: Code[];
}

/**
 * PySpark ETL Jobs class
 *
 * ETL jobs support pySpark and Scala languages, for which there are separate
 * but similar constructors. ETL jobs default to the G2 worker type, but you
 * can override this default with other supported worker type values
 * (G1, G2, G4 and G8). ETL jobs defaults to Glue version 4.0, which you can
 * override to 3.0. The following ETL features are enabled by default:
 * —enable-metrics, —enable-spark-ui, —enable-continuous-cloudwatch-log.
 * You can find more details about version, worker type and other features
 * in Glue's public documentation.
 */
export class PySparkEtlJob extends SparkJob {
  public readonly jobArn: string;
  public readonly jobName: string;

  /**
   * PySparkEtlJob constructor
   */
  constructor(scope: Construct, id: string, props: PySparkEtlJobProps) {
    super(scope, id, props);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // Combine command line arguments into a single line item
    const defaultArguments = {
      ...this.executableArguments(props),
      ...this.nonExecutableCommonArguments(props),
    };

    const jobResource = PySparkEtlJob.setupJobResource(this, props, {
      role: this.role.roleArn,
      command: {
        name: JobType.ETL,
        scriptLocation: this.codeS3ObjectUrl(props.script),
        pythonVersion: PythonVersion.THREE,
      },
      glueVersion: props.glueVersion ?? GlueVersion.V4_0,
      workerType: props.workerType ?? WorkerType.G_1X,
      numberOfWorkers: props.numberOfWorkers ? props.numberOfWorkers : 10,
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
  private executableArguments(props: PySparkEtlJobProps) {
    const args: { [key: string]: string } = {};
    args['--job-language'] = JobLanguage.PYTHON;
    this.setupExtraCodeArguments(args, props);
    return args;
  }
}
