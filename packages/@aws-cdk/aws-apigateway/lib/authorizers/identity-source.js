"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentitySource = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * Represents an identity source.
 *
 * The source can be specified either as a literal value (e.g: `Auth`) which
 * cannot be blank, or as an unresolved string token.
 */
class IdentitySource {
    /**
     * Provides a properly formatted header identity source.
     * @param headerName the name of the header the `IdentitySource` will represent.
     *
     * @returns a header identity source.
     */
    static header(headerName) {
        return IdentitySource.toString(headerName, 'method.request.header');
    }
    /**
     * Provides a properly formatted query string identity source.
     * @param queryString the name of the query string the `IdentitySource` will represent.
     *
     * @returns a query string identity source.
     */
    static queryString(queryString) {
        return IdentitySource.toString(queryString, 'method.request.querystring');
    }
    /**
     * Provides a properly formatted API Gateway stage variable identity source.
     * @param stageVariable the name of the stage variable the `IdentitySource` will represent.
     *
     * @returns an API Gateway stage variable identity source.
     */
    static stageVariable(stageVariable) {
        return IdentitySource.toString(stageVariable, 'stageVariables');
    }
    /**
     * Provides a properly formatted request context identity source.
     * @param context the name of the context variable the `IdentitySource` will represent.
     *
     * @returns a request context identity source.
     */
    static context(context) {
        return IdentitySource.toString(context, 'context');
    }
    static toString(source, type) {
        if (!source.trim()) {
            throw new Error('IdentitySources must be a non-empty string.');
        }
        return `${type}.${source}`;
    }
}
exports.IdentitySource = IdentitySource;
_a = JSII_RTTI_SYMBOL_1;
IdentitySource[_a] = { fqn: "@aws-cdk/aws-apigateway.IdentitySource", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWRlbnRpdHktc291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaWRlbnRpdHktc291cmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7Ozs7O0dBS0c7QUFDSCxNQUFhLGNBQWM7SUFDekI7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQWtCO1FBQ3JDLE9BQU8sY0FBYyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztLQUNyRTtJQUVEOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLFdBQVcsQ0FBQyxXQUFtQjtRQUMzQyxPQUFPLGNBQWMsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLDRCQUE0QixDQUFDLENBQUM7S0FDM0U7SUFFRDs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxhQUFhLENBQUMsYUFBcUI7UUFDL0MsT0FBTyxjQUFjLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0tBQ2pFO0lBRUQ7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQWU7UUFDbkMsT0FBTyxjQUFjLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztLQUNwRDtJQUVPLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBYyxFQUFFLElBQVk7UUFDbEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNsQixNQUFNLElBQUksS0FBSyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7U0FDaEU7UUFFRCxPQUFPLEdBQUcsSUFBSSxJQUFJLE1BQU0sRUFBRSxDQUFDO0tBQzVCOztBQS9DSCx3Q0FnREMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFJlcHJlc2VudHMgYW4gaWRlbnRpdHkgc291cmNlLlxuICpcbiAqIFRoZSBzb3VyY2UgY2FuIGJlIHNwZWNpZmllZCBlaXRoZXIgYXMgYSBsaXRlcmFsIHZhbHVlIChlLmc6IGBBdXRoYCkgd2hpY2hcbiAqIGNhbm5vdCBiZSBibGFuaywgb3IgYXMgYW4gdW5yZXNvbHZlZCBzdHJpbmcgdG9rZW4uXG4gKi9cbmV4cG9ydCBjbGFzcyBJZGVudGl0eVNvdXJjZSB7XG4gIC8qKlxuICAgKiBQcm92aWRlcyBhIHByb3Blcmx5IGZvcm1hdHRlZCBoZWFkZXIgaWRlbnRpdHkgc291cmNlLlxuICAgKiBAcGFyYW0gaGVhZGVyTmFtZSB0aGUgbmFtZSBvZiB0aGUgaGVhZGVyIHRoZSBgSWRlbnRpdHlTb3VyY2VgIHdpbGwgcmVwcmVzZW50LlxuICAgKlxuICAgKiBAcmV0dXJucyBhIGhlYWRlciBpZGVudGl0eSBzb3VyY2UuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGhlYWRlcihoZWFkZXJOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBJZGVudGl0eVNvdXJjZS50b1N0cmluZyhoZWFkZXJOYW1lLCAnbWV0aG9kLnJlcXVlc3QuaGVhZGVyJyk7XG4gIH1cblxuICAvKipcbiAgICogUHJvdmlkZXMgYSBwcm9wZXJseSBmb3JtYXR0ZWQgcXVlcnkgc3RyaW5nIGlkZW50aXR5IHNvdXJjZS5cbiAgICogQHBhcmFtIHF1ZXJ5U3RyaW5nIHRoZSBuYW1lIG9mIHRoZSBxdWVyeSBzdHJpbmcgdGhlIGBJZGVudGl0eVNvdXJjZWAgd2lsbCByZXByZXNlbnQuXG4gICAqXG4gICAqIEByZXR1cm5zIGEgcXVlcnkgc3RyaW5nIGlkZW50aXR5IHNvdXJjZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcXVlcnlTdHJpbmcocXVlcnlTdHJpbmc6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIElkZW50aXR5U291cmNlLnRvU3RyaW5nKHF1ZXJ5U3RyaW5nLCAnbWV0aG9kLnJlcXVlc3QucXVlcnlzdHJpbmcnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm92aWRlcyBhIHByb3Blcmx5IGZvcm1hdHRlZCBBUEkgR2F0ZXdheSBzdGFnZSB2YXJpYWJsZSBpZGVudGl0eSBzb3VyY2UuXG4gICAqIEBwYXJhbSBzdGFnZVZhcmlhYmxlIHRoZSBuYW1lIG9mIHRoZSBzdGFnZSB2YXJpYWJsZSB0aGUgYElkZW50aXR5U291cmNlYCB3aWxsIHJlcHJlc2VudC5cbiAgICpcbiAgICogQHJldHVybnMgYW4gQVBJIEdhdGV3YXkgc3RhZ2UgdmFyaWFibGUgaWRlbnRpdHkgc291cmNlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzdGFnZVZhcmlhYmxlKHN0YWdlVmFyaWFibGU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIElkZW50aXR5U291cmNlLnRvU3RyaW5nKHN0YWdlVmFyaWFibGUsICdzdGFnZVZhcmlhYmxlcycpO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb3ZpZGVzIGEgcHJvcGVybHkgZm9ybWF0dGVkIHJlcXVlc3QgY29udGV4dCBpZGVudGl0eSBzb3VyY2UuXG4gICAqIEBwYXJhbSBjb250ZXh0IHRoZSBuYW1lIG9mIHRoZSBjb250ZXh0IHZhcmlhYmxlIHRoZSBgSWRlbnRpdHlTb3VyY2VgIHdpbGwgcmVwcmVzZW50LlxuICAgKlxuICAgKiBAcmV0dXJucyBhIHJlcXVlc3QgY29udGV4dCBpZGVudGl0eSBzb3VyY2UuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbnRleHQoY29udGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gSWRlbnRpdHlTb3VyY2UudG9TdHJpbmcoY29udGV4dCwgJ2NvbnRleHQnKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIHRvU3RyaW5nKHNvdXJjZTogc3RyaW5nLCB0eXBlOiBzdHJpbmcpIHtcbiAgICBpZiAoIXNvdXJjZS50cmltKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSWRlbnRpdHlTb3VyY2VzIG11c3QgYmUgYSBub24tZW1wdHkgc3RyaW5nLicpO1xuICAgIH1cblxuICAgIHJldHVybiBgJHt0eXBlfS4ke3NvdXJjZX1gO1xuICB9XG59XG4iXX0=