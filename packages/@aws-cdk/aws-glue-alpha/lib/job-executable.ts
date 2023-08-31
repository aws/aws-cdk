import { Code } from './code';
import { GlueVersion, JobType, PythonVersion, Runtime, JobLanguage } from './constants';

interface PythonExecutableProps {
  /**
   * The Python version to use.
   */
  readonly pythonVersion: PythonVersion;

  /**
   * Additional Python files that AWS Glue adds to the Python path before executing your script.
   * Only individual files are supported, directories are not supported.
   *
   * @default - no extra python files and argument is not set
   *
   * @see `--extra-py-files` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly extraPythonFiles?: Code[];
}

interface SharedJobExecutableProps {
  /**
   * Runtime. It is required for Ray jobs.
   *
   */
  readonly runtime?: Runtime;

  /**
   * Glue version.
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/release-notes.html
   */
  readonly glueVersion: GlueVersion;

  /**
   * The script that executes a job.
   */
  readonly script: Code;

  /**
   * Additional files, such as configuration files that AWS Glue copies to the working directory of your script before executing it.
   * Only individual files are supported, directories are not supported.
   *
   * @default [] - no extra files are copied to the working directory
   *
   * @see `--extra-files` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly extraFiles?: Code[];
}

interface SharedSparkJobExecutableProps extends SharedJobExecutableProps {
  /**
   * Additional Java .jar files that AWS Glue adds to the Java classpath before executing your script.
   * Only individual files are supported, directories are not supported.
   *
   * @default [] - no extra jars are added to the classpath
   *
   * @see `--extra-jars` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly extraJars?: Code[];

  /**
   * Setting this value to true prioritizes the customer's extra JAR files in the classpath.
   *
   * @default false - priority is not given to user-provided jars
   *
   * @see `--user-jars-first` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly extraJarsFirst?: boolean;
}

/**
 * Props for creating a Scala Spark (ETL or Streaming) job executable
 */
export interface ScalaJobExecutableProps extends SharedSparkJobExecutableProps {
  /**
   * The fully qualified Scala class name that serves as the entry point for the job.
   *
   * @see `--class` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly className: string;
}

/**
 * Props for creating a Python Spark (ETL or Streaming) job executable
 */
export interface PythonSparkJobExecutableProps extends SharedSparkJobExecutableProps, PythonExecutableProps {}

/**
 * Props for creating a Python shell job executable
 */
export interface PythonShellExecutableProps extends SharedJobExecutableProps, PythonExecutableProps {}

/**
 * Props for creating a Python Ray job executable
 */
export interface PythonRayExecutableProps extends SharedJobExecutableProps, PythonExecutableProps {}

/**
 * The executable properties related to the Glue job's GlueVersion, JobType and code
 */
export class JobExecutable {

  /**
   * Create Scala executable props for Apache Spark ETL job.
   *
   * @param props Scala Apache Spark Job props
   */
  public static scalaEtl(props: ScalaJobExecutableProps): JobExecutable {
    return new JobExecutable({
      ...props,
      type: JobType.ETL,
      language: JobLanguage.SCALA,
    });
  }

  /**
   * Create Scala executable props for Apache Spark Streaming job.
   *
   * @param props Scala Apache Spark Job props
   */
  public static scalaStreaming(props: ScalaJobExecutableProps): JobExecutable {
    return new JobExecutable({
      ...props,
      type: JobType.STREAMING,
      language: JobLanguage.SCALA,
    });
  }

  /**
   * Create Python executable props for Apache Spark ETL job.
   *
   * @param props Python Apache Spark Job props
   */
  public static pythonEtl(props: PythonSparkJobExecutableProps): JobExecutable {
    return new JobExecutable({
      ...props,
      type: JobType.ETL,
      language: JobLanguage.PYTHON,
    });
  }

  /**
   * Create Python executable props for Apache Spark Streaming job.
   *
   * @param props Python Apache Spark Job props
   */
  public static pythonStreaming(props: PythonSparkJobExecutableProps): JobExecutable {
    return new JobExecutable({
      ...props,
      type: JobType.STREAMING,
      language: JobLanguage.PYTHON,
    });
  }

  /**
   * Create Python executable props for python shell jobs.
   *
   * @param props Python Shell Job props.
   */
  public static pythonShell(props: PythonShellExecutableProps): JobExecutable {
    return new JobExecutable({
      ...props,
      type: JobType.PYTHON_SHELL,
      language: JobLanguage.PYTHON,
    });
  }

  /**
   * Create Python executable props for Ray jobs.
   *
   * @param props Ray Job props.
   */
  public static pythonRay(props: PythonRayExecutableProps): JobExecutable {
    return new JobExecutable({
      ...props,
      type: JobType.RAY,
      language: JobLanguage.PYTHON,
    });
  }

  /**
   * Create a custom JobExecutable.
   *
   * @param config custom job executable configuration.
   */
  public static of(config: JobExecutableConfig): JobExecutable {
    return new JobExecutable(config);
  }

  private config: JobExecutableConfig;

  private constructor(config: JobExecutableConfig) {
    const glueVersion = config.glueVersion;
    const type = config.type;
    if (JobType.PYTHON_SHELL === type) {
      if (config.language !== JobLanguage.PYTHON) {
        throw new Error('Python shell requires the language to be set to Python');
      }
      if ([GlueVersion.V0_9, GlueVersion.V4_0].includes(glueVersion)) {
        throw new Error(`Specified GlueVersion ${glueVersion} does not support Python Shell`);
      }
    }
    if (JobType.RAY === type) {
      if (config.language !== JobLanguage.PYTHON) {
        throw new Error('Ray requires the language to be set to Python');
      }
      if ([GlueVersion.V0_9, GlueVersion.V1_0, GlueVersion.V2_0, GlueVersion.V3_0].includes(glueVersion)) {
        throw new Error(`Specified GlueVersion ${glueVersion} does not support Ray`);
      }
    }
    if (config.extraJarsFirst && [GlueVersion.V0_9, GlueVersion.V1_0].includes(glueVersion)) {
      throw new Error(`Specified GlueVersion ${glueVersion} does not support extraJarsFirst`);
    }
    if (config.pythonVersion === PythonVersion.TWO && ![GlueVersion.V0_9, GlueVersion.V1_0].includes(glueVersion)) {
      throw new Error(`Specified GlueVersion ${glueVersion} does not support PythonVersion ${config.pythonVersion}`);
    }
    if (JobLanguage.PYTHON !== config.language && config.extraPythonFiles) {
      throw new Error('extraPythonFiles is not supported for languages other than JobLanguage.PYTHON');
    }
    if (config.pythonVersion === PythonVersion.THREE_NINE && type !== JobType.PYTHON_SHELL && type !== JobType.RAY) {
      throw new Error('Specified PythonVersion PythonVersion.THREE_NINE is only supported for JobType Python Shell and Ray');
    }
    if (config.pythonVersion === PythonVersion.THREE && type === JobType.RAY) {
      throw new Error('Specified PythonVersion PythonVersion.THREE is not supported for Ray');
    }
    if (config.runtime === undefined && type === JobType.RAY) {
      throw new Error('Runtime is required for Ray jobs.');
    }
    this.config = config;
  }

  /**
   * Called during Job initialization to get JobExecutableConfig.
   */
  public bind(): JobExecutableConfig {
    return this.config;
  }
}

/**
 * Result of binding a `JobExecutable` into a `Job`.
 */
export interface JobExecutableConfig {
  /**
   * Glue version.
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/release-notes.html
   */
  readonly glueVersion: GlueVersion;

  /**
   * The language of the job (Scala or Python).
   *
   * @see `--job-language` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly language: JobLanguage;

  /**
   * Specify the type of the job whether it's an Apache Spark ETL or streaming one or if it's a Python shell job.
   */
  readonly type: JobType;

  /**
   * The Python version to use.
   *
   * @default - no python version specified
   */
  readonly pythonVersion?: PythonVersion;

  /**
   * The Runtime to use.
   *
   * @default - no runtime specified
   */
  readonly runtime?: Runtime;

  /**
   * The script that is executed by a job.
   */
  readonly script: Code;

  /**
   * The Scala class that serves as the entry point for the job. This applies only if your the job langauage is Scala.
   *
   * @default - no scala className specified
   *
   * @see `--class` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly className?: string;

  /**
   * Additional Java .jar files that AWS Glue adds to the Java classpath before executing your script.
   *
   * @default - no extra jars specified.
   *
   * @see `--extra-jars` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly extraJars?: Code[];

  /**
   * Additional Python files that AWS Glue adds to the Python path before executing your script.
   *
   * @default - no extra python files specified.
   *
   * @see `--extra-py-files` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly extraPythonFiles?: Code[];

  /**
   * Additional files, such as configuration files that AWS Glue copies to the working directory of your script before executing it.
   *
   * @default - no extra files specified.
   *
   * @see `--extra-files` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly extraFiles?: Code[];

  /**
   * Setting this value to true prioritizes the customer's extra JAR files in the classpath.
   *
   * @default - extra jars are not prioritized.
   *
   * @see `--user-jars-first` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly extraJarsFirst?: boolean;
}
