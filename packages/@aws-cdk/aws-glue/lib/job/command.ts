
/**
 * The Python version being used to execute a Python shell job.
 */
export enum JobCommandPythonVersion {
  TWO = '2',
  THREE = '3'
}

/**
 * The type of job command
 */
export enum JobCommandTypes {
  SPARK_ETL = 'glueetl',
  PYTHON_SHELL = 'pythonshell'
}

/**
 * Specifies code executed when a job is run.
 */
export class IJobCommand {
  /**
   * @attribute
   */
  readonly name?: string;

  /**
   * @attribute
   */
  readonly scriptLocation?: string;
}

export class SparkETLJob implements IJobCommand {
  /**
   * The name of the job command. For an Apache Spark ETL job,
   * this must be glueetl.
   */
  public readonly name: JobCommandTypes = JobCommandTypes.SPARK_ETL;
}

export class IPythonShellJobCommand extends IJobCommand {
  /**
   * @attribute
   */
  readonly pythonVersion?: JobCommandPythonVersion;
}

export interface PythonShellJobProps {
  readonly pythonVersion?: JobCommandPythonVersion;
}

export class PythonShellJob implements IPythonShellJobCommand{
  /**
   * The name of the job command. For a Python shell job, it
   * must be pythonshell.
   */
  public readonly name: JobCommandTypes;

  /**
   * The Python version being used to execute a Python shell job. Allowed
   * values are 2 or 3.
   */
  public readonly pythonVersion: JobCommandPythonVersion;

  constructor(props: PythonShellJobProps) {
    this.name = JobCommandTypes.PYTHON_SHELL
    this.pythonVersion = props.pythonVersion
  }
}
