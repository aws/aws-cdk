import { resolve } from "./tokens";

/**
 * Interface point for provisioning engines to register themselves
 */
export class ProvisioningEngine {
    /**
     * Register a handler for all intrinsics for the given engine
     */
    public static register(engineName: string, handler: IProvisioningEngine) {
        HANDLERS[engineName] = handler;
    }

    /**
     * Combine resolved fragments using the appropriate engine.
     *
     * Resolves the result.
     */
    public static combineStringFragments(fragments: StringFragment[]): any {
        if (fragments.length === 0) { return ''; }
        if (fragments.length === 1) { return fragments[0].value; }

        const engines = Array.from(new Set<string>(fragments.filter(f => f.intrinsicEngine !== undefined).map(f => f.intrinsicEngine!)));
        if (engines.length > 1) {
            throw new Error(`Combining different engines in one string fragment: ${engines.join(', ')}`);
        }

        const engine = engines.length > 0 ? engines[0] : DEFAULT_ENGINE_NAME;
        if (!(engine in HANDLERS)) {
            throw new Error(`No Token handler registered for engine: ${engine}`);
        }

        return resolve(HANDLERS[engine].combineStringFragments(fragments));
    }
}

/**
 * A (resolved) fragment of a string to be combined.
 *
 * The values may be string literals or intrinsics.
 */
export interface StringFragment {
    /**
     * Source of the fragment
     */
    source: FragmentSource;

    /**
     * String value
     *
     * Either a string literal or an intrinsic.
     */
    value: any;

    /**
     * The intrinsic engine
     */
    intrinsicEngine?: string;
}

/**
 * Where the resolved fragment came from (a string literal or a Token)
 */
export enum FragmentSource {
    Literal = 'Literal',
    Token = 'Token'
}

/**
 * Interface for engine-specific Token marker handlers
 */
export interface IProvisioningEngine {
    /**
     * Return the language intrinsic that will combine the strings in the given engine
     */
    combineStringFragments(fragments: StringFragment[]): any;
}

/**
 * The engine that will be used if no Tokens are found
 */
export const DEFAULT_ENGINE_NAME = 'default';

/**
 * Global handler map
 */
const HANDLERS: {[engine: string]: IProvisioningEngine} = {};
