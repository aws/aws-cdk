export enum RuntimeFamily {
  NODEJS,
  PYTHON,
  JAVA,
  RUBY,
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
   * The NodeJs 14.x runtime (nodejs14.x)
   */
  public static readonly NODEJS_12_X = new Runtime('nodejs12.x', RuntimeFamily.NODEJS, {
    isDeprecated: true,
  });

  /**
   * The NodeJs 14.x runtime (nodejs14.x)
   */
  public static readonly NODEJS_14_X = new Runtime('nodejs14.x', RuntimeFamily.NODEJS, {
    isDeprecated: true,
  });

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
   * The Python 2.7 runtime (python2.7)
   */
  public static readonly PYTHON_2_7 = new Runtime('python2.7', RuntimeFamily.PYTHON, {
    isDeprecated: true,
  });

  /**
   * The Python 3.6 runtime (python3.6)
   */
  public static readonly PYTHON_3_6 = new Runtime('python3.6', RuntimeFamily.PYTHON, {
    isDeprecated: true,
  });

  /**
   * The Python 3.7 runtime (python3.7)
   */
  public static readonly PYTHON_3_7 = new Runtime('python3.7', RuntimeFamily.PYTHON);

  /**
   * The Python 3.9 runtime (python3.9)
   */
  public static readonly PYTHON_3_9 = new Runtime('python3.9', RuntimeFamily.PYTHON);

  /**
   * The Python 3.10 runtime (python3.10)
   */
  public static readonly PYTHON_3_10 = new Runtime('python3.10', RuntimeFamily.PYTHON);

  /**
   * The Python 3.11 runtime (python3.11)
   */
  public static readonly PYTHON_3_11 = new Runtime('python3.11', RuntimeFamily.PYTHON);

  /**
   * The Python 3.12 runtime (python3.12)
   */
  public static readonly PYTHON_3_12 = new Runtime('python3.12', RuntimeFamily.PYTHON);

  /**
   * The Java 17 runtime (java17)
   */
  public static readonly JAVA_17 = new Runtime('java17', RuntimeFamily.JAVA);

  /**
   * The Ruby 3.2 runtime (ruby3.2)
   */
  public static readonly RUBY_3_2 = new Runtime('ruby3.2', RuntimeFamily.RUBY);

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
