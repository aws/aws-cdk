import { Code } from './code';

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
   * @deprecated Reached end of support
   */
  public static readonly V0_9 = new GlueVersion('0.9');

  /**
   * Glue version using Spark 2.4.3, Python 2.7 and Python 3.6
   * @deprecated Reached end of support
   */
  public static readonly V1_0 = new GlueVersion('1.0');

  /**
   * Glue version using Spark 2.4.3 and Python 3.7
   * @deprecated Reached end of support
   */
  public static readonly V2_0 = new GlueVersion('2.0');

  /**
   * Glue version using Spark 3.1.1 and Python 3.7
   */
  public static readonly V3_0 = new GlueVersion('3.0');

  /**
   * Glue version using Spark 3.3.0 and Python 3.10
   */
  public static readonly V4_0 = new GlueVersion('4.0');

  /**
   * Glue version using Spark 3.5.2 and Python 3.11
   */
  public static readonly V5_0 = new GlueVersion('5.0');

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

  /**
   * Python 3.9 (the exact version depends on GlueVersion and JobCommand used)
   */
  THREE_NINE = '3.9',
}

/**
 * AWS Glue runtime determines the runtime engine of the job.
 *
 */
export class Runtime {
  /**
   * Runtime for a Glue for Ray 2.4.
   */
  public static readonly RAY_TWO_FOUR = new Runtime('Ray2.4');

  /**
   * Custom runtime
   * @param runtime custom runtime
   */
  public static of(runtime: string): Runtime {
    return new Runtime(runtime);
  }

  /**
   * The name of this Runtime.
   */
  public readonly name: string;

  private constructor(name: string) {
    this.name = name;
  }
}

/**
 * The job type.
 *
 * If you need to use a JobType that doesn't exist as a static member, you
 * can instantiate a `JobType` object, e.g: `JobType.of('other name')`.
 */
export class JobType {
  /**
   * Command for running a Glue Spark job.
   */
  public static readonly ETL = new JobType('glueetl');

  /**
   * Command for running a Glue Spark streaming job.
   */
  public static readonly STREAMING = new JobType('gluestreaming');

  /**
   * Command for running a Glue python shell job.
   */
  public static readonly PYTHON_SHELL = new JobType('pythonshell');

  /**
   * Command for running a Glue Ray job.
   */
  public static readonly RAY = new JobType('glueray');

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

interface PythonExecutableProps {
  /**
   * The Python version to use.
   */
  readonly pythonVersion: PythonVersion;

  /**
   * Additional Python files that AWS Glue adds to the Python path before executing your script.
   * Only individual files are supported, directories are not supported.
   * Equivalent to a job parameter `--extra-py-files`.
   *
   * @default - no extra python files and argument is not set
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly extraPythonFiles?: Code[];
}

interface RayExecutableProps {
  /**
   * The Python version to use.
   */
  readonly pythonVersion: PythonVersion;

  /**
   * Additional Python modules that AWS Glue adds to the Python path before executing your script.
   * Equivalent to a job parameter `--s3-py-modules`.
   *
   * @default - no extra python files and argument is not set
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/author-job-ray-job-parameters.html
   */
  readonly s3PythonModules?: Code[];
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
   * Equivalent to a job parameter `--extra-files`.
   *
   * @default [] - no extra files are copied to the working directory
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly extraFiles?: Code[];
}

interface SharedSparkJobExecutableProps extends SharedJobExecutableProps {
  /**
   * Additional Java .jar files that AWS Glue adds to the Java classpath before executing your script.
   * Only individual files are supported, directories are not supported.
   * Equivalent to a job parameter `--extra-jars`.
   *
   * @default [] - no extra jars are added to the classpath
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly extraJars?: Code[];

  /**
   * Setting this value to true prioritizes the customer's extra JAR files in the classpath.
   * Equivalent to a job parameter `--user-jars-first`.
   *
   * @default false - priority is not given to user-provided jars
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly extraJarsFirst?: boolean;
}

/**
 * Props for creating a Scala Spark (ETL or Streaming) job executable
 */
export interface ScalaJobExecutableProps extends SharedSparkJobExecutableProps {
  /**
   * The fully qualified Scala class name that serves as the entry point for the job.
   * Equivalent to a job parameter `--class`.
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
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
export interface PythonRayExecutableProps extends SharedJobExecutableProps, RayExecutableProps {}

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
    const glueVersion = config.glueVersion.name;
    const type = config.type.name;
    if (JobType.PYTHON_SHELL.name === type) {
      if (config.language !== JobLanguage.PYTHON) {
        throw new Error('Python shell requires the language to be set to Python');
      }
      if ([GlueVersion.V0_9.name, GlueVersion.V4_0.name].includes(glueVersion)) {
        throw new Error(`Specified GlueVersion ${glueVersion} does not support Python Shell`);
      }
    }
    if (JobType.RAY.name === type) {
      if (config.language !== JobLanguage.PYTHON) {
        throw new Error('Ray requires the language to be set to Python');
      }
      if ([GlueVersion.V0_9.name, GlueVersion.V1_0.name, GlueVersion.V2_0.name, GlueVersion.V3_0.name].includes(glueVersion)) {
        throw new Error(`Specified GlueVersion ${glueVersion} does not support Ray`);
      }
    }
    if (config.extraJarsFirst && [GlueVersion.V0_9.name, GlueVersion.V1_0.name].includes(glueVersion)) {
      throw new Error(`Specified GlueVersion ${glueVersion} does not support extraJarsFirst`);
    }
    if (config.pythonVersion === PythonVersion.TWO && ![GlueVersion.V0_9.name, GlueVersion.V1_0.name].includes(glueVersion)) {
      throw new Error(`Specified GlueVersion ${glueVersion} does not support PythonVersion ${config.pythonVersion}`);
    }
    if (JobLanguage.PYTHON !== config.language && config.extraPythonFiles) {
      throw new Error('extraPythonFiles is not supported for languages other than JobLanguage.PYTHON');
    }
    if (config.extraPythonFiles && type === JobType.RAY.name) {
      throw new Error('extraPythonFiles is not supported for Ray jobs');
    }
    if (config.pythonVersion === PythonVersion.THREE_NINE && type !== JobType.PYTHON_SHELL.name && type !== JobType.RAY.name) {
      throw new Error('Specified PythonVersion PythonVersion.THREE_NINE is only supported for JobType Python Shell and Ray');
    }
    if (config.pythonVersion === PythonVersion.THREE && type === JobType.RAY.name) {
      throw new Error('Specified PythonVersion PythonVersion.THREE is not supported for Ray');
    }
    if (config.runtime === undefined && type === JobType.RAY.name) {
      throw new Error('Runtime is required for Ray jobs');
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
   * Equivalent to a job parameter `--job-language`.
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
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
   * Equivalent to a job parameter `--class`.
   *
   * @default - no scala className specified
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly className?: string;

  /**
   * Additional Java .jar files that AWS Glue adds to the Java classpath before executing your script.
   * Equivalent to a job parameter `--extra-jars`.
   *
   * @default - no extra jars specified.
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly extraJars?: Code[];

  /**
   * Additional Python files that AWS Glue adds to the Python path before executing your script.
   * Equivalent to a job parameter `--extra-py-files`.
   *
   * @default - no extra python files specified.
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly extraPythonFiles?: Code[];

  /**
   * Additional Python modules that AWS Glue adds to the Python path before executing your script.
   * Equivalent to a job parameter `--s3-py-modules`.
   *
   * @default - no extra python files specified.
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/author-job-ray-job-parameters.html
   */
  readonly s3PythonModules?: Code[];

  /**
   * Additional files, such as configuration files that AWS Glue copies to the working directory of your script before executing it.
   * Equivalent to a job parameter `--extra-files`.
   *
   * @default - no extra files specified.
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly extraFiles?: Code[];

  /**
   * Setting this value to true prioritizes the customer's extra JAR files in the classpath.
   * Equivalent to a job parameter `--user-jars-first`.
   *
   * @default - extra jars are not prioritized.
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly extraJarsFirst?: boolean;
}
