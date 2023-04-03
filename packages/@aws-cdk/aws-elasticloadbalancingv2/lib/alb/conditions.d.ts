/**
 * ListenerCondition providers definition.
 */
export declare abstract class ListenerCondition {
    /**
     * Create a host-header listener rule condition
     *
     * @param values Hosts for host headers
     */
    static hostHeaders(values: string[]): ListenerCondition;
    /**
     * Create a http-header listener rule condition
     *
     * @param name HTTP header name
     * @param values HTTP header values
     */
    static httpHeader(name: string, values: string[]): ListenerCondition;
    /**
     * Create a http-request-method listener rule condition
     *
     * @param values HTTP request methods
     */
    static httpRequestMethods(values: string[]): ListenerCondition;
    /**
     * Create a path-pattern listener rule condition
     *
     * @param values Path patterns
     */
    static pathPatterns(values: string[]): ListenerCondition;
    /**
     * Create a query-string listener rule condition
     *
     * @param values Query string key/value pairs
     */
    static queryStrings(values: QueryStringCondition[]): ListenerCondition;
    /**
     * Create a source-ip listener rule condition
     *
     * @param values Source ips
     */
    static sourceIps(values: string[]): ListenerCondition;
    /**
     * Render the raw Cfn listener rule condition object.
     */
    abstract renderRawCondition(): any;
}
/**
 * Properties for the key/value pair of the query string
 */
export interface QueryStringCondition {
    /**
     * The query string key for the condition
     *
     * @default - Any key can be matched.
     */
    readonly key?: string;
    /**
     * The query string value for the condition
     */
    readonly value: string;
}
