export interface LambdaRuntimeProps {
  /**
   * Whether the ``ZipFile`` (aka inline code) property can be used with this runtime.
   * @default false
   */
  readonly supportsInlineCode?: boolean;
}

/**
 * Lambda function runtime environment.
 */
export class Runtime implements InlinableRuntime, InlinableJavaScriptRuntime {
  /* tslint:disable variable-name */
  public static readonly NodeJS = new Runtime('nodejs', { supportsInlineCode: true }) as InlinableJavaScriptRuntime;
  // Using ``as InlinableLambdaRuntime`` because that class cannot be defined just yet
  public static readonly NodeJS43 = new Runtime('nodejs4.3', { supportsInlineCode: true }) as InlinableJavaScriptRuntime;
  public static readonly NodeJS43Edge = new Runtime('nodejs4.3-edge');
  // Using ``as InlinableLambdaRuntime`` because that class cannot be defined just yet
  public static readonly NodeJS610 = new Runtime('nodejs6.10', { supportsInlineCode: true }) as InlinableJavaScriptRuntime;
  public static readonly NodeJS810 = new Runtime('nodejs8.10');
  public static readonly Java8 = new Runtime('java8');
  // Using ``as InlinableLambdaRuntime`` because that class cannot be defined just yet
  public static readonly Python27 = new Runtime('python2.7', { supportsInlineCode: true }) as InlinableRuntime;
  // Using ``as InlinableLambdaRuntime`` because that class cannot be defined just yet
  public static readonly Python36 = new Runtime('python3.6', { supportsInlineCode: true }) as InlinableRuntime;
  public static readonly DotNetCore1 = new Runtime('dotnetcore1.0');
  public static readonly DotNetCore2 = new Runtime('dotnetcore2.0');
  public static readonly DotNetCore21 = new Runtime('dotnetcore2.1');
  public static readonly Go1x = new Runtime('go1.x');
  /* tslint:enable variable-name */

  /** The name of this runtime, as expected by the Lambda resource. */
  public readonly name: string;
  /** Whether the ``ZipFile`` (aka inline code) property can be used with this runtime. */
  public readonly supportsInlineCode: boolean;

  constructor(name: string, props: LambdaRuntimeProps = {}) {
    this.name = name;
    this.supportsInlineCode = !!props.supportsInlineCode;
  }

  public toString(): string {
    return this.name;
  }
}

/**
 * A ``LambdaRuntime`` that can be used in conjunction with the ``ZipFile``
 * property of the ``AWS::Lambda::Function`` resource.
 */
export interface InlinableRuntime {
  readonly name: string;
  readonly supportsInlineCode: boolean;
}

/**
 * A ``LambdaRuntime`` that can be used for inlining JavaScript.
 */
// tslint:disable-next-line:no-empty-interface this is a marker to allow type-safe declarations
export interface InlinableJavaScriptRuntime extends InlinableRuntime {}
