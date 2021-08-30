/**
 * AWS Glue version determines the versions of Apache Spark and Python that are available to the job.
 *
 * @see https://docs.aws.amazon.com/glue/latest/dg/add-job.html.
 *
 * If you need to use a GlueVersion that doesn't exist as a static member, you
 * can instantiate a `GlueVersion` object, e.g: `GlueVersion.of('1.5')`.
 */
export class GlueVersion {
  /**
   * Glue version using Spark 2.2.1 and Python 2.7
   */
  public static readonly V0_9 = new GlueVersion('0.9');

  /**
   * Glue version using Spark 2.4.3, Python 2.7 and Python 3.6
   */
  public static readonly V1_0 = new GlueVersion('1.0');

  /**
   * Glue version using Spark 2.4.3 and Python 3.7
   */
  public static readonly V2_0 = new GlueVersion('2.0');

  /**
   * Glue version using Spark 3.1.1 and Python 3.7
   */
  public static readonly V3_0 = new GlueVersion('3.0');

  /**
   * Custom Glue version
   * @param version custom version
   */
  public static of(version: string): GlueVersion {
    return new GlueVersion(version);
  }

  /**
   * The name of this GlueVersion, as expected by Job resource.
   */
  public readonly name: string;

  private constructor(name: string) {
    this.name = name;
  }
}

/**
 * Runtime language of the Glue job
 */
export enum JobLanguage {
  /**
   * Scala
   */
  SCALA = 'scala',

  /**
   * Python
   */
  PYTHON = 'python',
}

/**
 * Python version
 */
export enum PythonVersion {
  /**
   * Python 2 (the exact version depends on GlueVersion and JobCommand used)
   */
  TWO = '2',

  /**
   * Python 3 (the exact version depends on GlueVersion and JobCommand used)
   */
  THREE = '3',
}

/**
 * The job type.
 *
 * If you need to use a JobType that doesn't exist as a static member, you
 * can instantiate a `JobType` object, e.g: `JobType.of('other name')`.
 */
export class JobType {
  /**
   * Command for running a Glue ETL job.
   */
  public static readonly ETL = new JobType('glueetl');

  /**
   * Command for running a Glue streaming job.
   */
  public static readonly STREAMING = new JobType('gluestreaming');

  /**
   * Command for running a Glue python shell job.
   */
  public static readonly PYTHON_SHELL = new JobType('pythonshell');

  /**
   * Custom type name
   * @param name type name
   */
  public static of(name: string): JobType {
    return new JobType(name);
  }

  /**
   * The name of this JobType, as expected by Job resource.
   */
  public readonly name: string;

  private constructor(name: string) {
    this.name = name;
  }
}

interface SharedJobExecutableProps {
  /**
   * Glue version.
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/release-notes.html
   */
  readonly glueVersion: GlueVersion;

  /**
   * Specifies the Amazon Simple Storage Service (Amazon S3) path to a script that executes a job.
   */
  readonly scriptLocation: string;

  /**
   * The Amazon S3 paths to additional files, such as configuration files that AWS Glue copies to the working directory of your script before executing it.
   * Only individual files are supported, not a directory path.
   *
   * @default - no extra files and argument is not set
   *
   * @see `--extra-files` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly extraFiles?: string[];
}

interface SharedSparkJobExecutableProps extends SharedJobExecutableProps {
  /**
   * The Amazon S3 paths to additional Java .jar files that AWS Glue adds to the Java classpath before executing your script.
   * Only individual files are supported, not a directory path.
   *
   * @default - no extra jars and argument is not set
   *
   * @see `--extra-jars` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly extraJars?: string[];

  /**
   * Setting this value to true prioritizes the customer's extra JAR files in the classpath.
   *
   * @default - priortiy is not given to extra jars and argument is not set
   *
   * @see `--user-jars-first` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly extraJarsFirst?: boolean;
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
   * @see `--job-languae` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
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
   * Specifies the Amazon Simple Storage Service (Amazon S3) path to a script that executes a job.
   */
  readonly scriptLocation: string;

  /**
   * The Scala class that serves as the entry point for the job. This applies only if your the job langauage is Scala.
   *
   * @default - no scala className specified
   *
   * @see `--class` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly className?: string;

  /**
   * The Amazon S3 paths to additional Java .jar files that AWS Glue adds to the Java classpath before executing your script.
   * Only individual files are supported, not a directory path.
   *
   * @default - no extra jars specified.
   *
   * @see `--extra-jars` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly extraJars?: string[];

  /**
   * The Amazon S3 paths to additional Python modules that AWS Glue adds to the Python path before executing your script.
   * Only individual files are supported, not a directory path.
   *
   * @default - no extra python files specified.
   *
   * @see `--extra-py-files` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly extraPythonFiles?: string[];

  /**
   * The Amazon S3 paths to additional files, such as configuration files that AWS Glue copies to the working directory of your script before executing it.
   * Only individual files are supported, not a directory path.
   *
   * @default - no extra files specified.
   *
   * @see `--extra-files` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly extraFiles?: string[];

  /**
   * Setting this value to true prioritizes the customer's extra JAR files in the classpath.
   *
   * @default - extra jars are not prioritized.
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
export interface PythonJobExecutableProps extends SharedSparkJobExecutableProps {

  /**
   * The Python version to use.
   */
  readonly pythonVersion: PythonVersion;

  /**
   * The Amazon S3 paths to additional Python modules that AWS Glue adds to the Python path before executing your script.
   * Only individual files are supported, not a directory path.
   *
   * @default - no extra python files and argument is not set
   *
   * @see `--extra-py-files` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly extraPythonFiles?: string[];

  /**
   * Setting this value to true prioritizes the customer's extra JAR files in the classpath.
   *
   * @default - priortiy is not given to extra jars and argument is not set
   * @see `--user-jars-first` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly extraJarsFirst?: boolean;
}

/**
 * Props for creating a Python shell job executable
 */
export interface PythonShellExecutableProps extends SharedJobExecutableProps {

  /**
   * The Python version to use.
   */
  readonly pythonVersion: PythonVersion;

  /**
   * The Amazon S3 paths to additional Python modules that AWS Glue adds to the Python path before executing your script.
   * Only individual files are supported, not a directory path.
   *
   * @default - no extra python files and argument is not set
   *
   * @see `--extra-py-files` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly extraPythonFiles?: string[];
}

/**
 * The executable properties related to the Glue job's GlueVersion, JobType and code
 *
 * TODO test for exceptions
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
  public static pythonEtl(props: PythonJobExecutableProps): JobExecutable {
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
  public static pythonStreaming(props: PythonJobExecutableProps): JobExecutable {
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
   * Create a custom JobExecutable.
   *
   * @param config custom job executable configuration.
   */
  public static of(config: JobExecutableConfig): JobExecutable {
    return new JobExecutable(config);
  }

  private config: JobExecutableConfig;

  private constructor(config: JobExecutableConfig) {
    if (JobType.PYTHON_SHELL === config.type) {
      if (config.language !== JobLanguage.PYTHON) {
        throw new Error('Python shell requires the language to be set to Python');
      }
      if ([GlueVersion.V0_9, GlueVersion.V1_0].includes(config.glueVersion)) {
        throw new Error(`Specified GlueVersion ${config.glueVersion.name} does not support Python Shell`);
      }
    }
    if (config.extraJarsFirst && [GlueVersion.V0_9, GlueVersion.V1_0].includes(config.glueVersion)) {
      throw new Error(`Specified GlueVersion ${config.glueVersion.name} does not support extraJarsFirst`);
    }
    if (config.pythonVersion === PythonVersion.TWO && ![GlueVersion.V0_9, GlueVersion.V1_0].includes(config.glueVersion)) {
      throw new Error(`Specified GlueVersion ${config.glueVersion.name} does not support PythonVersion ${config.pythonVersion}`);
    }
    this.config = config;
  }

  public bind(): JobExecutableConfig {
    return this.config;
  }
}
