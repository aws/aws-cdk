import { IConstruct } from 'constructs';
/**
 * Includes API for attaching annotations such as warning messages to constructs.
 */
export declare class Annotations {
    private readonly scope;
    /**
     * Returns the annotations API for a construct scope.
     * @param scope The scope
     */
    static of(scope: IConstruct): Annotations;
    private readonly stackTraces;
    private constructor();
    /**
     * Adds a warning metadata entry to this construct.
     *
     * The CLI will display the warning when an app is synthesized, or fail if run
     * in --strict mode.
     *
     * @param message The warning message.
     */
    addWarning(message: string): void;
    /**
     * Adds an info metadata entry to this construct.
     *
     * The CLI will display the info message when apps are synthesized.
     *
     * @param message The info message.
     */
    addInfo(message: string): void;
    /**
     * Adds an { "error": <message> } metadata entry to this construct.
     * The toolkit will fail deployment of any stack that has errors reported against it.
     * @param message The error message.
     */
    addError(message: string): void;
    /**
     * Adds a deprecation warning for a specific API.
     *
     * Deprecations will be added only once per construct as a warning and will be
     * deduplicated based on the `api`.
     *
     * If the environment variable `CDK_BLOCK_DEPRECATIONS` is set, this method
     * will throw an error instead with the deprecation message.
     *
     * @param api The API being deprecated in the format `module.Class.property`
     * (e.g. `@aws-cdk/core.Construct.node`).
     * @param message The deprecation message to display, with information about
     * alternatives.
     */
    addDeprecation(api: string, message: string): void;
    /**
     * Adds a message metadata entry to the construct node, to be displayed by the CDK CLI.
     *
     * Records the message once per construct.
     * @param level The message level
     * @param message The message itself
     */
    private addMessage;
}
