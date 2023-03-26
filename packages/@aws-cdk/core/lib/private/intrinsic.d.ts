import { IResolvable, IResolveContext } from '../resolvable';
import { ResolutionTypeHint } from '../type-hints';
/**
 * Customization properties for an Intrinsic token
 *
 */
export interface IntrinsicProps {
    /**
     * Capture the stack trace of where this token is created
     *
     * @default true
     */
    readonly stackTrace?: boolean;
    /**
     *
     * Type that this token is expected to evaluate to
     *
     * @default ResolutionTypeHint.STRING
     */
    readonly typeHint?: ResolutionTypeHint;
}
/**
 * Token subclass that represents values intrinsic to the target document language
 *
 * WARNING: this class should not be externally exposed, but is currently visible
 * because of a limitation of jsii (https://github.com/aws/jsii/issues/524).
 *
 * This class will disappear in a future release and should not be used.
 *
 */
export declare class Intrinsic implements IResolvable {
    /**
     * The captured stack trace which represents the location in which this token was created.
     */
    readonly creationStack: string[];
    /**
     * Type that the Intrinsic is expected to evaluate to.
     */
    readonly typeHint?: ResolutionTypeHint;
    private readonly value;
    constructor(value: any, options?: IntrinsicProps);
    resolve(_context: IResolveContext): any;
    /**
     * Convert an instance of this Token to a string
     *
     * This method will be called implicitly by language runtimes if the object
     * is embedded into a string. We treat it the same as an explicit
     * stringification.
     */
    toString(): string;
    /**
     * Convert an instance of this Token to a string list
     *
     * This method will be called implicitly by language runtimes if the object
     * is embedded into a list. We treat it the same as an explicit
     * stringification.
     */
    toStringList(): string[];
    /**
     * Turn this Token into JSON
     *
     * Called automatically when JSON.stringify() is called on a Token.
     */
    toJSON(): any;
    /**
     * Creates a throwable Error object that contains the token creation stack trace.
     * @param message Error message
     */
    protected newError(message: string): any;
}
