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
export class FunctionRuntime {
    public static readonly NodeJS = new FunctionRuntime('nodejs', { supportsInlineCode: true }) as InlinableFunctionRuntime;
    // Using ``as InlinableLambdaRuntime`` because that calss cannot be defined just yet
    public static readonly NodeJS43 = new FunctionRuntime('nodejs4.3', { supportsInlineCode: true }) as InlinableFunctionRuntime;
    public static readonly NodeJS43Edge = new FunctionRuntime('nodejs4.3-edge');
    // Using ``as InlinableLambdaRuntime`` because that calss cannot be defined just yet
    public static readonly NodeJS610 = new FunctionRuntime('nodejs6.10', { supportsInlineCode: true }) as InlinableFunctionRuntime;
    public static readonly NodeJS810 = new FunctionRuntime('nodejs8.10');
    public static readonly Java8 = new FunctionRuntime('java8');
    // Using ``as InlinableLambdaRuntime`` because that calss cannot be defined just yet
    public static readonly Python27 = new FunctionRuntime('python2.7', { supportsInlineCode: true }) as InlinableFunctionRuntime;
    // Using ``as InlinableLambdaRuntime`` because that calss cannot be defined just yet
    public static readonly Python36 = new FunctionRuntime('python3.6', { supportsInlineCode: true }) as InlinableFunctionRuntime;
    public static readonly DotNetCore1 = new FunctionRuntime('dotnetcore1.0');
    public static readonly DotNetCore2 = new FunctionRuntime('dotnetcore2.0');
    public static readonly Go1x = new FunctionRuntime('go1.x');

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
export interface InlinableFunctionRuntime {
    readonly name: string;
    readonly supportsInlineCode: true;
}

/**
 * A ``LambdaRuntime`` that can be used for inlining JavaScript.
 */
// tslint:disable-next-line:no-empty-interface this is a marker to allow type-safe declarations
export interface InlinableJavascriptFunctionRuntime extends InlinableFunctionRuntime {}
