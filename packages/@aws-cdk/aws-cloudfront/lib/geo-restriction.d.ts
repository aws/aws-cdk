/**
 * Controls the countries in which content is distributed.
 */
export declare class GeoRestriction {
    readonly restrictionType: 'whitelist' | 'blacklist';
    readonly locations: string[];
    /**
     * Allow specific countries which you want CloudFront to distribute your content.
     *
     * @param locations Two-letter, uppercase country code for a country
     * that you want to allow. Include one element for each country.
     * See ISO 3166-1-alpha-2 code on the *International Organization for Standardization* website
     */
    static allowlist(...locations: string[]): GeoRestriction;
    /**
     * Deny specific countries which you don't want CloudFront to distribute your content.
     *
     * @param locations Two-letter, uppercase country code for a country
     * that you want to deny. Include one element for each country.
     * See ISO 3166-1-alpha-2 code on the *International Organization for Standardization* website
     */
    static denylist(...locations: string[]): GeoRestriction;
    /**
     * DEPRECATED
     * @deprecated use `allowlist`
     */
    static whitelist(...locations: string[]): GeoRestriction;
    /**
     * DEPRECATED
     * @deprecated use `denylist`
     */
    static blacklist(...locations: string[]): GeoRestriction;
    private static LOCATION_REGEX;
    private static validateLocations;
    /**
     * Creates an instance of GeoRestriction for internal use
     *
     * @param restrictionType Specifies the restriction type to impose
     * @param locations Two-letter, uppercase country code for a country
     * that you want to allow/deny. Include one element for each country.
     * See ISO 3166-1-alpha-2 code on the *International Organization for Standardization* website
     */
    private constructor();
}
