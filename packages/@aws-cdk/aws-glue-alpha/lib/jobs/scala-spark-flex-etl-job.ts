import { Construct } from 'constructs';
import { JobType, GlueVersion, JobLanguage, WorkerType, ExecutionClass } from '../constants';
import { SparkJob, SparkJobProps } from './spark-job';
import { Job } from './job';

/**
 * Flex Jobs class
 *
 * Flex jobs supports Python and Scala language.
 * The flexible execution class is appropriate for non-urgent jobs such as
 * pre-production jobs, testing, and one-time data loads.
 * Flexible job runs are supported for jobs using AWS Glue version 3.0 or later and G.1X or
 * G.2X worker types but will default to the latest version of Glue (currently Glue 3.0.)
 *
 * Similar to ETL, we’ll enable these features: —enable-metrics, —enable-spark-ui,
 * —enable-continuous-cloudwatch-log
 *
 */
export interface ScalaSparkFlexEtlJobProps extends SparkJobProps {
  /**
   * The fully qualified Scala class name that serves as the entry point for the job.
   *
   * @see `--class` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly className: string;
}

/**
 * Spark ETL Jobs class
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
export class ScalaSparkFlexEtlJob extends SparkJob {
  public readonly jobArn: string;
  public readonly jobName: string;

  /**
   * ScalaSparkFlexEtlJob constructor
   */
  constructor(scope: Construct, id: string, props: ScalaSparkFlexEtlJobProps) {
    super(scope, id, props);

    // Combine command line arguments into a single line item
    const defaultArguments = {
      ...this.executableArguments(props),
      ...this.nonExecutableCommonArguments(props),
    };

    const jobResource = Job.setupJobResource(this, props, {
      role: this.role!.roleArn,
      command: {
        name: JobType.ETL,
        scriptLocation: this.codeS3ObjectUrl(props.script),
      },
      glueVersion: props.glueVersion ? props.glueVersion : GlueVersion.V3_0,
      workerType: props.workerType ? props.workerType : WorkerType.G_1X,
      numberOfWorkers: props.numberOfWorkers ? props.numberOfWorkers : 10,
      maxRetries: props.maxRetries,
      executionClass: ExecutionClass.FLEX,
      jobRunQueuingEnabled: false,
      defaultArguments,
    });

    const resourceName = this.getResourceNameAttribute(jobResource.ref);
    this.jobArn = Job.buildJobArn(this, resourceName);
    this.jobName = resourceName;
  }

  /**
   * Set the executable arguments with best practices enabled by default
   *
   * @returns An array of arguments for Glue to use on execution
   */
  private executableArguments(props: ScalaSparkFlexEtlJobProps) {
    const args: { [key: string]: string } = {};
    args['--job-language'] = JobLanguage.SCALA;
    args['--class'] = props.className;
    this.setupExtraCodeArguments(args, props);
    return args;
  }
}
