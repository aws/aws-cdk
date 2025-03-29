import { Construct } from 'constructs';
import { JobType, GlueVersion, JobLanguage, WorkerType } from '../constants';
import { SparkJob, SparkJobProps } from './spark-job';
import { Job } from './job';

/**
 * Properties for creating a Scala Spark ETL job
 */
export interface ScalaSparkStreamingJobProps extends SparkJobProps {
  /**
   * Class name (required for Scala scripts)
   * Package and class name for the entry point of Glue job execution for
   * Java scripts
   **/
  readonly className: string;
}

/**
 * Scala Streaming Jobs class
 *
 * A Streaming job is similar to an ETL job, except that it performs ETL on data streams
 * using the Apache Spark Structured Streaming framework.
 * These jobs will default to use Python 3.9.
 *
 * Similar to ETL jobs, streaming job supports Scala and Python languages. Similar to ETL,
 * it supports G1 and G2 worker type and 2.0, 3.0 and 4.0 version. We’ll default to G2 worker
 * and 4.0 version for streaming jobs which developers can override.
 * We will enable —enable-metrics, —enable-spark-ui, —enable-continuous-cloudwatch-log.
 */
export class ScalaSparkStreamingJob extends SparkJob {
  public readonly jobArn: string;
  public readonly jobName: string;

  /**
   * ScalaSparkStreamingJob constructor
   */
  constructor(scope: Construct, id: string, props: ScalaSparkStreamingJobProps) {
    super(scope, id, props);

    // Combine command line arguments into a single line item
    const defaultArguments = {
      ...this.executableArguments(props),
      ...this.nonExecutableCommonArguments(props),
    };

    if ((!props.workerType && props.numberOfWorkers !== undefined) || (props.workerType && props.numberOfWorkers === undefined)) {
      throw new Error('Both workerType and numberOfWorkers must be set');
    }

    const jobResource = Job.setupJobResource(this, props, {
      role: this.role!.roleArn,
      command: {
        name: JobType.STREAMING,
        scriptLocation: this.codeS3ObjectUrl(props.script),
      },
      glueVersion: props.glueVersion ? props.glueVersion : GlueVersion.V4_0,
      workerType: props.workerType ? props.workerType : WorkerType.G_1X,
      numberOfWorkers: props.numberOfWorkers ? props.numberOfWorkers : 10,
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
  private executableArguments(props: ScalaSparkStreamingJobProps) {
    const args: { [key: string]: string } = {};
    args['--job-language'] = JobLanguage.SCALA;
    args['--class'] = props.className;
    this.setupExtraCodeArguments(args, props);
    return args;
  }
}
