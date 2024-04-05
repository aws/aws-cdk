import type { AwsCredentialIdentityProvider } from '@smithy/types';
export interface InvokeOptions {
    /**
     * The SDKv3 package for the service.
     *
     * @default - Load the package automatically
     */
    readonly sdkPackage?: any;
    /**
     * Override API version
     *
     * @default - Use default API version
     */
    readonly apiVersion?: string;
    /**
     * Override region
     *
     * @default - Current region
     */
    readonly region?: string;
    /**
     * Override credentials
     *
     * @default - Default credentials
     */
    readonly credentials?: AwsCredentialIdentityProvider;
    /**
     * Parameters to the API call
     *
     * @default {}
     */
    readonly parameters?: Record<string, unknown>;
    /**
     * Flatten the response object
     *
     * Instead of a nested object structure, return a map of `{ string -> value }`, with the keys
     * being the paths to each primitive value.
     *
     * @default false
     */
    readonly flattenResponse?: boolean;
}
/**
 * Wrapper to make an SDKv3 API call, with SDKv2 compatibility
 */
export declare class ApiCall {
    readonly service: string;
    readonly action: string;
    readonly v3PackageName: string;
    v3Package?: any;
    client?: any;
    constructor(service: string, action: string);
    invoke(options: InvokeOptions): Promise<Record<string, unknown>>;
    initializePackage(packageOverride?: any): any;
    initializeClient(options: Pick<InvokeOptions, 'apiVersion' | 'credentials' | 'region'>): any;
    findCommandClass(): new (input: any) => any;
    private findConstructor;
}
/**
 * Flattens a nested object
 *
 * @param object the object to be flattened
 * @returns a flat object with path as keys
 */
export declare function flatten(root: unknown): {
    [key: string]: any;
};
export declare function coerceSdkv3Response(value: unknown): Promise<unknown>;
