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
export class LambdaRuntime {
    public static readonly NodeJS = new LambdaRuntime('nodejs', { supportsInlineCode: true }) as InlinableJavascriptLambdaRuntime;
    // Using ``as InlinableLambdaRuntime`` because that calss cannot be defined just yet
    public static readonly NodeJS43 = new LambdaRuntime('nodejs4.3', { supportsInlineCode: true }) as InlinableJavascriptLambdaRuntime;
    public static readonly NodeJS43Edge = new LambdaRuntime('nodejs4.3-edge');
    // Using ``as InlinableLambdaRuntime`` because that calss cannot be defined just yet
    public static readonly NodeJS610 = new LambdaRuntime('nodejs6.10', { supportsInlineCode: true }) as InlinableJavascriptLambdaRuntime;
    public static readonly NodeJS810 = new LambdaRuntime('nodejs8.10');
    public static readonly Java8 = new LambdaRuntime('java8');
    // Using ``as InlinableLambdaRuntime`` because that calss cannot be defined just yet
    public static readonly Python27 = new LambdaRuntime('python2.7', { supportsInlineCode: true }) as InlinableLambdaRuntime;
    // Using ``as InlinableLambdaRuntime`` because that calss cannot be defined just yet
    public static readonly Python36 = new LambdaRuntime('python3.6', { supportsInlineCode: true }) as InlinableLambdaRuntime;
    public static readonly DotNetCore1 = new LambdaRuntime('dotnetcore1.0');
    public static readonly DotNetCore2 = new LambdaRuntime('dotnetcore2.0');
    public static readonly Go1x = new LambdaRuntime('go1.x');

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
export interface InlinableLambdaRuntime {
    readonly name: string;
    readonly supportsInlineCode: true;
}

/**
 * A ``LambdaRuntime`` that can be used for inlining JavaScript.
 */
// tslint:disable-next-line:no-empty-interface this is a marker to allow type-safe declarations
export interface InlinableJavascriptLambdaRuntime extends InlinableLambdaRuntime {}
