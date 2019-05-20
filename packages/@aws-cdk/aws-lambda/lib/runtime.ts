export interface LambdaRuntimeProps {
  /**
   * Whether the ``ZipFile`` (aka inline code) property can be used with this runtime.
   * @default false
   */
  readonly supportsInlineCode?: boolean;
}

export enum RuntimeFamily {
  NodeJS,
  Java,
  Python,
  DotNetCore,
  Go,
  Ruby,
  Other
}

/**
 * Lambda function runtime environment.
 *
 * If you need to use a runtime name that doesn't exist as a static member, you
 * can instantiate a `Runtime` object, e.g: `new Runtime('nodejs99.99')`.
 */
export class Runtime {
  /** A list of all known `Runtime`'s. */
  public static readonly All = new Array<Runtime>();

  /** @deprecated Use `NodeJS810` or `NodeJS10x` */
  public static readonly NodeJS =       new Runtime('nodejs',         RuntimeFamily.NodeJS, { supportsInlineCode: true });
  /** @deprecated Use `NodeJS810` or `NodeJS10x` */
  public static readonly NodeJS43 =     new Runtime('nodejs4.3',      RuntimeFamily.NodeJS, { supportsInlineCode: true });
  /** @deprecated Use `NodeJS810` or `NodeJS10x` */
  public static readonly NodeJS610 =    new Runtime('nodejs6.10',     RuntimeFamily.NodeJS, { supportsInlineCode: true });
  public static readonly NodeJS810 =    new Runtime('nodejs8.10',     RuntimeFamily.NodeJS, { supportsInlineCode: true });
  public static readonly NodeJS10x =    new Runtime('nodejs10.x',     RuntimeFamily.NodeJS, { supportsInlineCode: false });
  public static readonly Python27 =     new Runtime('python2.7',      RuntimeFamily.Python, { supportsInlineCode: true });
  public static readonly Python36 =     new Runtime('python3.6',      RuntimeFamily.Python, { supportsInlineCode: true });
  public static readonly Python37 =     new Runtime('python3.7',      RuntimeFamily.Python, { supportsInlineCode: true });
  public static readonly Java8 =        new Runtime('java8',          RuntimeFamily.Java);
  public static readonly DotNetCore1 =  new Runtime('dotnetcore1.0',  RuntimeFamily.DotNetCore);
  /** @deprecated Use `DotNetCore21` */
  public static readonly DotNetCore2 =  new Runtime('dotnetcore2.0',  RuntimeFamily.DotNetCore);
  public static readonly DotNetCore21 = new Runtime('dotnetcore2.1',  RuntimeFamily.DotNetCore);
  public static readonly Go1x =         new Runtime('go1.x',          RuntimeFamily.Go);
  public static readonly Ruby25 =       new Runtime('ruby2.5',        RuntimeFamily.Ruby, { supportsInlineCode: true });
  public static readonly Provided =     new Runtime('provided',       RuntimeFamily.Other);

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

    Runtime.All.push(this);
  }

  public toString(): string {
    return this.name;
  }

  public equals(other: Runtime): boolean {
    return other.name === this.name &&
           other.family === this.family &&
           other.supportsInlineCode === this.supportsInlineCode;
  }
}
