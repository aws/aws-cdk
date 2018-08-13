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
        simplifyFragments(fragments);

        if (fragments.length === 0) { return ''; }
        if (fragments.length === 1) { return fragments[0].value; }

        const engines = Array.from(new Set<string>(fragments.filter(f => f.intrinsicEngine !== undefined).map(f => f.intrinsicEngine!)));
        if (engines.length === 0) {
            throw new Error('Should not happen; no intrinsics found in StringFragment list.');
        }
        if (engines.length > 1) {
            throw new Error(`Combining different engines in one string fragment: ${engines.join(', ')}`);
        }

        const engine = engines[0];
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
    Intrinsic = 'Intrinsic'
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
 * Global handler map
 */
const HANDLERS: {[engine: string]: IProvisioningEngine} = {};

/**
 * Combine adjacent string literals in the fragment list
 *
 * List is modified in-place.
 */
function simplifyFragments(fragments: StringFragment[]) {
    let i = 0;
    while (i < fragments.length - 1) {
        if (fragments[i].source === FragmentSource.Literal && fragments[i + 1].source === FragmentSource.Literal) {
            fragments[i].value += fragments[i + 1].value;
            fragments.splice(i + 1, 1);
        } else {
            i++;
        }
    }
}