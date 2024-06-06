import { TypeCoercionStateMachine } from './parameter-types';
type ApiParameters = {
    [param: string]: any;
};
/**
 * Given a minimal AWS SDKv3 call definition (service, action, parameters),
 * coerces nested parameter values into a Uint8Array if that's what the SDKv3 expects.
 */
export declare function coerceApiParameters(v3service: string, action: string, parameters?: ApiParameters): ApiParameters;
/**
 * Make this a class in order to have multiple entry points for testing that can all share convenience functions
 */
export declare class Coercer {
    private readonly typeMachine;
    constructor(typeMachine: TypeCoercionStateMachine);
    coerceApiParameters(v3service: string, action: string, parameters?: ApiParameters): ApiParameters;
    testCoerce(value: unknown): any;
    private recurse;
    /**
     * From a given state, return the state we would end up in if we followed this field
     */
    private progress;
}
export {};
