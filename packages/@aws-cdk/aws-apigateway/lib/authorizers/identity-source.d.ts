/**
 * Represents an identity source.
 *
 * The source can be specified either as a literal value (e.g: `Auth`) which
 * cannot be blank, or as an unresolved string token.
 */
export declare class IdentitySource {
    /**
     * Provides a properly formatted header identity source.
     * @param headerName the name of the header the `IdentitySource` will represent.
     *
     * @returns a header identity source.
     */
    static header(headerName: string): string;
    /**
     * Provides a properly formatted query string identity source.
     * @param queryString the name of the query string the `IdentitySource` will represent.
     *
     * @returns a query string identity source.
     */
    static queryString(queryString: string): string;
    /**
     * Provides a properly formatted API Gateway stage variable identity source.
     * @param stageVariable the name of the stage variable the `IdentitySource` will represent.
     *
     * @returns an API Gateway stage variable identity source.
     */
    static stageVariable(stageVariable: string): string;
    /**
     * Provides a properly formatted request context identity source.
     * @param context the name of the context variable the `IdentitySource` will represent.
     *
     * @returns a request context identity source.
     */
    static context(context: string): string;
    private static toString;
}
