"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoRestriction = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * Controls the countries in which content is distributed.
 */
class GeoRestriction {
    /**
     * Creates an instance of GeoRestriction for internal use
     *
     * @param restrictionType Specifies the restriction type to impose
     * @param locations Two-letter, uppercase country code for a country
     * that you want to allow/deny. Include one element for each country.
     * See ISO 3166-1-alpha-2 code on the *International Organization for Standardization* website
     */
    constructor(restrictionType, locations) {
        this.restrictionType = restrictionType;
        this.locations = locations;
    }
    /**
     * Allow specific countries which you want CloudFront to distribute your content.
     *
     * @param locations Two-letter, uppercase country code for a country
     * that you want to allow. Include one element for each country.
     * See ISO 3166-1-alpha-2 code on the *International Organization for Standardization* website
     */
    static allowlist(...locations) {
        return new GeoRestriction('whitelist', GeoRestriction.validateLocations(locations));
    }
    /**
     * Deny specific countries which you don't want CloudFront to distribute your content.
     *
     * @param locations Two-letter, uppercase country code for a country
     * that you want to deny. Include one element for each country.
     * See ISO 3166-1-alpha-2 code on the *International Organization for Standardization* website
     */
    static denylist(...locations) {
        return new GeoRestriction('blacklist', GeoRestriction.validateLocations(locations));
    }
    /**
     * DEPRECATED
     * @deprecated use `allowlist`
     */
    static whitelist(...locations) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-cloudfront.GeoRestriction#whitelist", "use `allowlist`");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.whitelist);
            }
            throw error;
        }
        return GeoRestriction.allowlist(...locations);
    }
    /**
     * DEPRECATED
     * @deprecated use `denylist`
     */
    static blacklist(...locations) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-cloudfront.GeoRestriction#blacklist", "use `denylist`");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.blacklist);
            }
            throw error;
        }
        return GeoRestriction.denylist(...locations);
    }
    static validateLocations(locations) {
        if (locations.length === 0) {
            throw new Error('Should provide at least 1 location');
        }
        locations.forEach(location => {
            if (!GeoRestriction.LOCATION_REGEX.test(location)) {
                // eslint-disable-next-line max-len
                throw new Error(`Invalid location format for location: ${location}, location should be two-letter and uppercase country ISO 3166-1-alpha-2 code`);
            }
        });
        return locations;
    }
}
exports.GeoRestriction = GeoRestriction;
_a = JSII_RTTI_SYMBOL_1;
GeoRestriction[_a] = { fqn: "@aws-cdk/aws-cloudfront.GeoRestriction", version: "0.0.0" };
GeoRestriction.LOCATION_REGEX = /^[A-Z]{2}$/;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VvLXJlc3RyaWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2VvLXJlc3RyaWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztHQUVHO0FBQ0gsTUFBYSxjQUFjO0lBdUR6Qjs7Ozs7OztPQU9HO0lBQ0gsWUFBNkIsZUFBMEMsRUFBVyxTQUFtQjtRQUF4RSxvQkFBZSxHQUFmLGVBQWUsQ0FBMkI7UUFBVyxjQUFTLEdBQVQsU0FBUyxDQUFVO0tBQUk7SUE3RHpHOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxTQUFtQjtRQUM1QyxPQUFPLElBQUksY0FBYyxDQUFDLFdBQVcsRUFBRSxjQUFjLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztLQUNyRjtJQUVEOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxTQUFtQjtRQUMzQyxPQUFPLElBQUksY0FBYyxDQUFDLFdBQVcsRUFBRSxjQUFjLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztLQUNyRjtJQUVEOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxTQUFtQjs7Ozs7Ozs7OztRQUM1QyxPQUFPLGNBQWMsQ0FBQyxTQUFTLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQztLQUMvQztJQUVEOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxTQUFtQjs7Ozs7Ozs7OztRQUM1QyxPQUFPLGNBQWMsQ0FBQyxRQUFRLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQztLQUM5QztJQUlPLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxTQUFtQjtRQUNsRCxJQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzFCLE1BQU0sSUFBSSxLQUFLLENBQUMsb0NBQW9DLENBQUMsQ0FBQztTQUN2RDtRQUNELFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDM0IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUNqRCxtQ0FBbUM7Z0JBQ25DLE1BQU0sSUFBSSxLQUFLLENBQUMseUNBQXlDLFFBQVEsK0VBQStFLENBQUMsQ0FBQzthQUNuSjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxTQUFTLENBQUM7S0FDbEI7O0FBckRILHdDQWdFQzs7O0FBeEJnQiw2QkFBYyxHQUFHLFlBQVksQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29udHJvbHMgdGhlIGNvdW50cmllcyBpbiB3aGljaCBjb250ZW50IGlzIGRpc3RyaWJ1dGVkLlxuICovXG5leHBvcnQgY2xhc3MgR2VvUmVzdHJpY3Rpb24ge1xuXG4gIC8qKlxuICAgKiBBbGxvdyBzcGVjaWZpYyBjb3VudHJpZXMgd2hpY2ggeW91IHdhbnQgQ2xvdWRGcm9udCB0byBkaXN0cmlidXRlIHlvdXIgY29udGVudC5cbiAgICpcbiAgICogQHBhcmFtIGxvY2F0aW9ucyBUd28tbGV0dGVyLCB1cHBlcmNhc2UgY291bnRyeSBjb2RlIGZvciBhIGNvdW50cnlcbiAgICogdGhhdCB5b3Ugd2FudCB0byBhbGxvdy4gSW5jbHVkZSBvbmUgZWxlbWVudCBmb3IgZWFjaCBjb3VudHJ5LlxuICAgKiBTZWUgSVNPIDMxNjYtMS1hbHBoYS0yIGNvZGUgb24gdGhlICpJbnRlcm5hdGlvbmFsIE9yZ2FuaXphdGlvbiBmb3IgU3RhbmRhcmRpemF0aW9uKiB3ZWJzaXRlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFsbG93bGlzdCguLi5sb2NhdGlvbnM6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIG5ldyBHZW9SZXN0cmljdGlvbignd2hpdGVsaXN0JywgR2VvUmVzdHJpY3Rpb24udmFsaWRhdGVMb2NhdGlvbnMobG9jYXRpb25zKSk7XG4gIH1cblxuICAvKipcbiAgICogRGVueSBzcGVjaWZpYyBjb3VudHJpZXMgd2hpY2ggeW91IGRvbid0IHdhbnQgQ2xvdWRGcm9udCB0byBkaXN0cmlidXRlIHlvdXIgY29udGVudC5cbiAgICpcbiAgICogQHBhcmFtIGxvY2F0aW9ucyBUd28tbGV0dGVyLCB1cHBlcmNhc2UgY291bnRyeSBjb2RlIGZvciBhIGNvdW50cnlcbiAgICogdGhhdCB5b3Ugd2FudCB0byBkZW55LiBJbmNsdWRlIG9uZSBlbGVtZW50IGZvciBlYWNoIGNvdW50cnkuXG4gICAqIFNlZSBJU08gMzE2Ni0xLWFscGhhLTIgY29kZSBvbiB0aGUgKkludGVybmF0aW9uYWwgT3JnYW5pemF0aW9uIGZvciBTdGFuZGFyZGl6YXRpb24qIHdlYnNpdGVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZGVueWxpc3QoLi4ubG9jYXRpb25zOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiBuZXcgR2VvUmVzdHJpY3Rpb24oJ2JsYWNrbGlzdCcsIEdlb1Jlc3RyaWN0aW9uLnZhbGlkYXRlTG9jYXRpb25zKGxvY2F0aW9ucykpO1xuICB9XG5cbiAgLyoqXG4gICAqIERFUFJFQ0FURURcbiAgICogQGRlcHJlY2F0ZWQgdXNlIGBhbGxvd2xpc3RgXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHdoaXRlbGlzdCguLi5sb2NhdGlvbnM6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIEdlb1Jlc3RyaWN0aW9uLmFsbG93bGlzdCguLi5sb2NhdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERFUFJFQ0FURURcbiAgICogQGRlcHJlY2F0ZWQgdXNlIGBkZW55bGlzdGBcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYmxhY2tsaXN0KC4uLmxvY2F0aW9uczogc3RyaW5nW10pIHtcbiAgICByZXR1cm4gR2VvUmVzdHJpY3Rpb24uZGVueWxpc3QoLi4ubG9jYXRpb25zKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIExPQ0FUSU9OX1JFR0VYID0gL15bQS1aXXsyfSQvO1xuXG4gIHByaXZhdGUgc3RhdGljIHZhbGlkYXRlTG9jYXRpb25zKGxvY2F0aW9uczogc3RyaW5nW10pIHtcbiAgICBpZiAobG9jYXRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTaG91bGQgcHJvdmlkZSBhdCBsZWFzdCAxIGxvY2F0aW9uJyk7XG4gICAgfVxuICAgIGxvY2F0aW9ucy5mb3JFYWNoKGxvY2F0aW9uID0+IHtcbiAgICAgIGlmICghR2VvUmVzdHJpY3Rpb24uTE9DQVRJT05fUkVHRVgudGVzdChsb2NhdGlvbikpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGxvY2F0aW9uIGZvcm1hdCBmb3IgbG9jYXRpb246ICR7bG9jYXRpb259LCBsb2NhdGlvbiBzaG91bGQgYmUgdHdvLWxldHRlciBhbmQgdXBwZXJjYXNlIGNvdW50cnkgSVNPIDMxNjYtMS1hbHBoYS0yIGNvZGVgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gbG9jYXRpb25zO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgR2VvUmVzdHJpY3Rpb24gZm9yIGludGVybmFsIHVzZVxuICAgKlxuICAgKiBAcGFyYW0gcmVzdHJpY3Rpb25UeXBlIFNwZWNpZmllcyB0aGUgcmVzdHJpY3Rpb24gdHlwZSB0byBpbXBvc2VcbiAgICogQHBhcmFtIGxvY2F0aW9ucyBUd28tbGV0dGVyLCB1cHBlcmNhc2UgY291bnRyeSBjb2RlIGZvciBhIGNvdW50cnlcbiAgICogdGhhdCB5b3Ugd2FudCB0byBhbGxvdy9kZW55LiBJbmNsdWRlIG9uZSBlbGVtZW50IGZvciBlYWNoIGNvdW50cnkuXG4gICAqIFNlZSBJU08gMzE2Ni0xLWFscGhhLTIgY29kZSBvbiB0aGUgKkludGVybmF0aW9uYWwgT3JnYW5pemF0aW9uIGZvciBTdGFuZGFyZGl6YXRpb24qIHdlYnNpdGVcbiAgICovXG4gIHByaXZhdGUgY29uc3RydWN0b3IocmVhZG9ubHkgcmVzdHJpY3Rpb25UeXBlOiAnd2hpdGVsaXN0JyB8ICdibGFja2xpc3QnLCByZWFkb25seSBsb2NhdGlvbnM6IHN0cmluZ1tdKSB7fVxufVxuIl19