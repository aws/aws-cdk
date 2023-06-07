"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolVersion = exports.IpAddressType = exports.PathMatchType = exports.MatchOperator = exports.HTTPMethods = exports.FixedResponse = exports.Protocol = void 0;
/**
 * HTTP/HTTPS methods
 */
var Protocol;
(function (Protocol) {
    /**
     * HTTP Protocol
     */
    Protocol["HTTP"] = "HTTP";
    /**
     * HTTPS Protocol
     */
    Protocol["HTTPS"] = "HTTPS";
})(Protocol = exports.Protocol || (exports.Protocol = {}));
/**
 * Fixed response codes
 */
var FixedResponse;
(function (FixedResponse) {
    /**
     * Not Found 404
     */
    FixedResponse[FixedResponse["NOT_FOUND"] = 404] = "NOT_FOUND";
    /**
     * OK 200
     */
    FixedResponse[FixedResponse["OK"] = 200] = "OK";
})(FixedResponse = exports.FixedResponse || (exports.FixedResponse = {}));
/**
 * HTTP Methods
 */
var HTTPMethods;
(function (HTTPMethods) {
    /**
     * GET Method
     */
    HTTPMethods["GET"] = "GET";
    /**
     * POST Method
     */
    HTTPMethods["POST"] = "POST";
    /**
     * PUT Method
     */
    HTTPMethods["PUT"] = "PUT";
    /**
     * Delete Method
     */
    HTTPMethods["DELETE"] = "DELETE";
})(HTTPMethods = exports.HTTPMethods || (exports.HTTPMethods = {}));
/**
 * Operators for Matches
 */
var MatchOperator;
(function (MatchOperator) {
    /**
     * Contains Match
     */
    MatchOperator["CONTAINS"] = "CONTAINS";
    /**
     * Exact Match
     */
    MatchOperator["EXACT"] = "EXACT";
    /**
     * Prefix Match
     */
    MatchOperator["PREFIX"] = "PREFIX";
})(MatchOperator = exports.MatchOperator || (exports.MatchOperator = {}));
/**
 * Operators for Path Matches
 */
var PathMatchType;
(function (PathMatchType) {
    /**
     * Exact Match
     */
    PathMatchType["EXACT"] = "EXACT";
    /**
     * Prefix Match
     */
    PathMatchType["PREFIX"] = "PREFIX";
})(PathMatchType = exports.PathMatchType || (exports.PathMatchType = {}));
/**
 * Ip Address Types
 */
var IpAddressType;
(function (IpAddressType) {
    /**
     * IPv4
     */
    IpAddressType["IPV4"] = "ipv4";
    /**
     * Ipv6
     */
    IpAddressType["IPV6"] = "ipv6";
})(IpAddressType = exports.IpAddressType || (exports.IpAddressType = {}));
/**
 * Protococol Versions
 */
var ProtocolVersion;
(function (ProtocolVersion) {
    /**
     * HTTP1
     */
    ProtocolVersion["HTTP1"] = "HTTP1";
    /**
     * HTTP2
     */
    ProtocolVersion["HTTP2"] = "HTTP2";
    /**
     * GRPC
     */
    ProtocolVersion["GRPC"] = "GRPC";
})(ProtocolVersion = exports.ProtocolVersion || (exports.ProtocolVersion = {}));
/**
 * Allows Actions
 */ 
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW51bXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlbnVtcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQTs7R0FFRztBQUNILElBQVksUUFTWDtBQVRELFdBQVksUUFBUTtJQUNsQjs7T0FFRztJQUNILHlCQUFhLENBQUE7SUFDYjs7T0FFRztJQUNILDJCQUFlLENBQUE7QUFDakIsQ0FBQyxFQVRXLFFBQVEsR0FBUixnQkFBUSxLQUFSLGdCQUFRLFFBU25CO0FBR0Q7O0dBRUc7QUFDSCxJQUFZLGFBU1g7QUFURCxXQUFZLGFBQWE7SUFDdkI7O09BRUc7SUFDSCw2REFBZSxDQUFBO0lBQ2Y7O09BRUc7SUFDSCwrQ0FBUSxDQUFBO0FBQ1YsQ0FBQyxFQVRXLGFBQWEsR0FBYixxQkFBYSxLQUFiLHFCQUFhLFFBU3hCO0FBRUQ7O0dBRUc7QUFDSCxJQUFZLFdBaUJYO0FBakJELFdBQVksV0FBVztJQUNyQjs7T0FFRztJQUNILDBCQUFXLENBQUE7SUFDWDs7T0FFRztJQUNILDRCQUFhLENBQUE7SUFDYjs7T0FFRztJQUNILDBCQUFXLENBQUE7SUFDWDs7T0FFRztJQUNILGdDQUFpQixDQUFBO0FBQ25CLENBQUMsRUFqQlcsV0FBVyxHQUFYLG1CQUFXLEtBQVgsbUJBQVcsUUFpQnRCO0FBRUQ7O0dBRUc7QUFDSCxJQUFZLGFBYVg7QUFiRCxXQUFZLGFBQWE7SUFDdkI7O09BRUc7SUFDSCxzQ0FBcUIsQ0FBQTtJQUNyQjs7T0FFRztJQUNILGdDQUFlLENBQUE7SUFDZjs7T0FFRztJQUNILGtDQUFpQixDQUFBO0FBQ25CLENBQUMsRUFiVyxhQUFhLEdBQWIscUJBQWEsS0FBYixxQkFBYSxRQWF4QjtBQUVEOztHQUVHO0FBQ0gsSUFBWSxhQVNYO0FBVEQsV0FBWSxhQUFhO0lBQ3ZCOztPQUVHO0lBQ0gsZ0NBQWUsQ0FBQTtJQUNmOztPQUVHO0lBQ0gsa0NBQWlCLENBQUE7QUFDbkIsQ0FBQyxFQVRXLGFBQWEsR0FBYixxQkFBYSxLQUFiLHFCQUFhLFFBU3hCO0FBQ0Q7O0dBRUc7QUFDSCxJQUFZLGFBU1g7QUFURCxXQUFZLGFBQWE7SUFDdkI7O09BRUc7SUFDSCw4QkFBYSxDQUFBO0lBQ2I7O09BRUc7SUFDSCw4QkFBYSxDQUFBO0FBQ2YsQ0FBQyxFQVRXLGFBQWEsR0FBYixxQkFBYSxLQUFiLHFCQUFhLFFBU3hCO0FBRUQ7O0dBRUc7QUFDSCxJQUFZLGVBYVg7QUFiRCxXQUFZLGVBQWU7SUFDekI7O09BRUc7SUFDSCxrQ0FBZSxDQUFBO0lBQ2Y7O09BRUc7SUFDSCxrQ0FBZSxDQUFBO0lBQ2Y7O09BRUc7SUFDSCxnQ0FBYSxDQUFBO0FBQ2YsQ0FBQyxFQWJXLGVBQWUsR0FBZix1QkFBZSxLQUFmLHVCQUFlLFFBYTFCO0FBQ0Q7O0dBRUciLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEhUVFAvSFRUUFMgbWV0aG9kc1xuICovXG5leHBvcnQgZW51bSBQcm90b2NvbCB7XG4gIC8qKlxuICAgKiBIVFRQIFByb3RvY29sXG4gICAqL1xuICBIVFRQID0gJ0hUVFAnLFxuICAvKipcbiAgICogSFRUUFMgUHJvdG9jb2xcbiAgICovXG4gIEhUVFBTID0gJ0hUVFBTJyxcbn1cblxuXG4vKipcbiAqIEZpeGVkIHJlc3BvbnNlIGNvZGVzXG4gKi9cbmV4cG9ydCBlbnVtIEZpeGVkUmVzcG9uc2Uge1xuICAvKipcbiAgICogTm90IEZvdW5kIDQwNFxuICAgKi9cbiAgTk9UX0ZPVU5EID0gNDA0LFxuICAvKipcbiAgICogT0sgMjAwXG4gICAqL1xuICBPSyA9IDIwMFxufVxuXG4vKipcbiAqIEhUVFAgTWV0aG9kc1xuICovXG5leHBvcnQgZW51bSBIVFRQTWV0aG9kcyB7XG4gIC8qKlxuICAgKiBHRVQgTWV0aG9kXG4gICAqL1xuICBHRVQgPSAnR0VUJyxcbiAgLyoqXG4gICAqIFBPU1QgTWV0aG9kXG4gICAqL1xuICBQT1NUID0gJ1BPU1QnLFxuICAvKipcbiAgICogUFVUIE1ldGhvZFxuICAgKi9cbiAgUFVUID0gJ1BVVCcsXG4gIC8qKlxuICAgKiBEZWxldGUgTWV0aG9kXG4gICAqL1xuICBERUxFVEUgPSAnREVMRVRFJyxcbn1cblxuLyoqXG4gKiBPcGVyYXRvcnMgZm9yIE1hdGNoZXNcbiAqL1xuZXhwb3J0IGVudW0gTWF0Y2hPcGVyYXRvciB7XG4gIC8qKlxuICAgKiBDb250YWlucyBNYXRjaFxuICAgKi9cbiAgQ09OVEFJTlMgPSAnQ09OVEFJTlMnLFxuICAvKipcbiAgICogRXhhY3QgTWF0Y2hcbiAgICovXG4gIEVYQUNUID0gJ0VYQUNUJyxcbiAgLyoqXG4gICAqIFByZWZpeCBNYXRjaFxuICAgKi9cbiAgUFJFRklYID0gJ1BSRUZJWCdcbn1cblxuLyoqXG4gKiBPcGVyYXRvcnMgZm9yIFBhdGggTWF0Y2hlc1xuICovXG5leHBvcnQgZW51bSBQYXRoTWF0Y2hUeXBlIHtcbiAgLyoqXG4gICAqIEV4YWN0IE1hdGNoXG4gICAqL1xuICBFWEFDVCA9ICdFWEFDVCcsXG4gIC8qKlxuICAgKiBQcmVmaXggTWF0Y2hcbiAgICovXG4gIFBSRUZJWCA9ICdQUkVGSVgnXG59XG4vKipcbiAqIElwIEFkZHJlc3MgVHlwZXNcbiAqL1xuZXhwb3J0IGVudW0gSXBBZGRyZXNzVHlwZSB7XG4gIC8qKlxuICAgKiBJUHY0XG4gICAqL1xuICBJUFY0ID0gJ2lwdjQnLFxuICAvKipcbiAgICogSXB2NlxuICAgKi9cbiAgSVBWNiA9ICdpcHY2J1xufVxuXG4vKipcbiAqIFByb3RvY29jb2wgVmVyc2lvbnNcbiAqL1xuZXhwb3J0IGVudW0gUHJvdG9jb2xWZXJzaW9uIHtcbiAgLyoqXG4gICAqIEhUVFAxXG4gICAqL1xuICBIVFRQMSA9ICdIVFRQMScsXG4gIC8qKlxuICAgKiBIVFRQMlxuICAgKi9cbiAgSFRUUDIgPSAnSFRUUDInLFxuICAvKipcbiAgICogR1JQQ1xuICAgKi9cbiAgR1JQQyA9ICdHUlBDJ1xufVxuLyoqXG4gKiBBbGxvd3MgQWN0aW9uc1xuICovIl19