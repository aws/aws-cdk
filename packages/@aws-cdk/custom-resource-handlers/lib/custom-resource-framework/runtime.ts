export enum RuntimeFamily {
  NODEJS,
  PYTHON,
}

/**
 * Properties used to initialize a framework runtime.
 */
interface RuntimeProps {
  /**
   * Whether or not this runtime is deprecated.
   *
   * @default false
   */
  readonly isDeprecated?: boolean;
}

/**
 * Custom resource framework runtimes used for code generation.
 */
export class Runtime {
  /**
   * The NodeJS 16.x runtime (nodejs16.x)
   */
  public static readonly NODEJS_16_X = new Runtime('nodejs16.x', RuntimeFamily.NODEJS);

  /**
   * The NodeJS 18.x runtime (nodejs18.x)
   */
  public static readonly NODEJS_18_X = new Runtime('nodejs18.x', RuntimeFamily.NODEJS);

  /**
   * The NodeJS 20.x runtime (nodejs20.x)
   */
  public static readonly NODEJS_20_X = new Runtime('nodejs20.x', RuntimeFamily.NODEJS);

  /**
   * The Python 3.9 runtime (python3.9)
   */
  public static readonly PYTHON_3_9 = new Runtime('python3.9', RuntimeFamily.PYTHON);

  /**
   * The Python 3.10 runtime (python3.10)
   */
  public static readonly PYTHON_3_10 = new Runtime('python3.10', RuntimeFamily.PYTHON);

  public readonly name: string;
  public readonly family: RuntimeFamily;
  public readonly isDeprecated: boolean;

  private constructor(name: string, family: RuntimeFamily, props: RuntimeProps = {}) {
    this.name = name;
    this.family = family;
    this.isDeprecated = props.isDeprecated ?? false;
  }

  public runtimeEquals(other: Runtime): boolean {
    return other.name === this.name && other.family === this.family;
  }

  public toLambdaRuntime() {
    switch (this.name) {
      case 'nodejs16.x': {
        return 'lambda.Runtime.NODEJS_16_X';
      }
      case 'nodejs18.x': {
        return 'lambda.Runtime.NODEJS_18_X';
      }
      case 'python3.9': {
        return 'lambda.Runtime.PYTHON_3_9';
      }
      case 'python3.10': {
        return 'lambda.Runtime.PYTHON_3_10';
      }
    }
    throw new Error('Unable to convert runtime to lambda runtime');
  }
}
