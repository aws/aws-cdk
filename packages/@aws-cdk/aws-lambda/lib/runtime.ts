export interface LambdaRuntimeProps {
  /**
   * Whether the ``ZipFile`` (aka inline code) property can be used with this runtime.
   * @default false
   */
  readonly supportsInlineCode?: boolean;
}

export enum RuntimeFamily {
  NODEJS,
  JAVA,
  PYTHON,
  DOTNET_CORE,
  GO,
  RUBY,
  OTHER
}

/**
 * Lambda function runtime environment.
 *
 * If you need to use a runtime name that doesn't exist as a static member, you
 * can instantiate a `Runtime` object, e.g: `new Runtime('nodejs99.99')`.
 */
export class Runtime {
  /** A list of all known `Runtime`'s. */
  public static readonly ALL = new Array<Runtime>();

  /** @deprecated Use {@link NODEJS_10_X} */
  public static readonly NODEJS =       new Runtime('nodejs',         RuntimeFamily.NODEJS, { supportsInlineCode: true });
  /** @deprecated Use {@link NODEJS_10_X} */
  public static readonly NODEJS_4_3 =     new Runtime('nodejs4.3',      RuntimeFamily.NODEJS, { supportsInlineCode: true });
  /** @deprecated Use {@link NODEJS_10_X} */
  public static readonly NODEJS_6_10 =    new Runtime('nodejs6.10',     RuntimeFamily.NODEJS, { supportsInlineCode: true });
  /** @deprecated Use {@link NODEJS_10_X} */
  public static readonly NODEJS_8_10 =    new Runtime('nodejs8.10',     RuntimeFamily.NODEJS, { supportsInlineCode: true });
  public static readonly NODEJS_10_X =    new Runtime('nodejs10.x',     RuntimeFamily.NODEJS, { supportsInlineCode: true });
  public static readonly PYTHON_2_7 =     new Runtime('python2.7',      RuntimeFamily.PYTHON, { supportsInlineCode: true });
  public static readonly PYTHON_3_6 =     new Runtime('python3.6',      RuntimeFamily.PYTHON, { supportsInlineCode: true });
  public static readonly PYTHON_3_7 =     new Runtime('python3.7',      RuntimeFamily.PYTHON, { supportsInlineCode: true });
  public static readonly PYTHON_3_8 =     new Runtime('python3.8',      RuntimeFamily.PYTHON, { supportsInlineCode: true });
  public static readonly JAVA_8 =        new Runtime('java8',          RuntimeFamily.JAVA);
  public static readonly DOTNET_CORE_1 =  new Runtime('dotnetcore1.0',  RuntimeFamily.DOTNET_CORE);
  /** @deprecated Use {@link DotNetCore21} */
  public static readonly DOTNET_CORE_2 =  new Runtime('dotnetcore2.0',  RuntimeFamily.DOTNET_CORE);
  public static readonly DOTNET_CORE_2_1 = new Runtime('dotnetcore2.1',  RuntimeFamily.DOTNET_CORE);
  public static readonly GO_1_X =         new Runtime('go1.x',          RuntimeFamily.GO);
  public static readonly RUBY_2_5 =       new Runtime('ruby2.5',        RuntimeFamily.RUBY, { supportsInlineCode: true });
  public static readonly PROVIDED =     new Runtime('provided',       RuntimeFamily.OTHER);

  /**
   * The name of this runtime, as expected by the Lambda resource.
   */
  public readonly name: string;

  /**
   * Whether the ``ZipFile`` (aka inline code) property can be used with this
   * runtime.
   */
  public readonly supportsInlineCode: boolean;

  /**
   * The runtime family.
   */
  public readonly family?: RuntimeFamily;

  constructor(name: string, family?: RuntimeFamily, props: LambdaRuntimeProps = { }) {
    this.name = name;
    this.supportsInlineCode = !!props.supportsInlineCode;
    this.family = family;

    Runtime.ALL.push(this);
  }

  public toString(): string {
    return this.name;
  }

  public runtimeEquals(other: Runtime): boolean {
    return other.name === this.name &&
           other.family === this.family &&
           other.supportsInlineCode === this.supportsInlineCode;
  }
}
