/**
 * Routing based on geographical location.
 */
export class GeoLocation {
  /**
   * Geolocation resource record based on continent code.
   * @param continentCode Continent.
   * @returns Continent-based geolocation record
   */
  public static continent(continentCode: Continent) {
    return new GeoLocation(continentCode, undefined, undefined);
  }

  /**
   * Geolocation resource record based on country code.
   * @param countryCode Two-letter, uppercase country code for the country.
   * See ISO 3166-1-alpha-2 code on the *International Organization for Standardization* website
   * @see https://docs.aws.amazon.com/Route53/latest/APIReference/API_GeoLocation.html#Route53-Type-GeoLocation-CountryCode
   * @see https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
   * @returns Country-based geolocation record
   */
  public static country(countryCode: string) {
    return new GeoLocation(undefined, countryCode, undefined);
  }

  /**
   * Geolocation resource record based on subdivision code (e.g. state of the United States).
   * @param subdivisionCode Code of the subdivision (e.g. state of the United States)
   * @param countryCode Country code (ISO 3166-1-alpha-2) of this record, by default US (United States).
   * @see https://pe.usps.com/text/pub28/28apb.htm
   * @see https://docs.aws.amazon.com/Route53/latest/APIReference/API_GeoLocation.html#Route53-Type-GeoLocation-SubdivisionCode
   */
  public static subdivision(subdivisionCode: string, countryCode: string = 'US') {
    return new GeoLocation(undefined, countryCode, subdivisionCode);
  }

  /**
   * Default (wildcard) routing record if no specific geolocation record is found.
   * @returns Wildcard routing record
   */
  public static default() {
    return new GeoLocation(undefined, '*', undefined);
  }

  private static COUNTRY_REGEX = /(^[A-Z]{2}|^\*{1})$/;
  private static COUNTRY_FOR_SUBDIVISION_REGEX = /\b(?:UA|US)\b/;
  private static SUBDIVISION_REGEX = /^[A-Z0-9]{1,3}$/;

  private static validateCountry(country: string) {
    if (!GeoLocation.COUNTRY_REGEX.test(country)) {
      // eslint-disable-next-line max-len
      throw new Error(`Invalid country format for country: ${country}, country should be two-letter and uppercase country ISO 3166-1-alpha-2 code`);
    }
  }

  private static validateCountryForSubdivision(country: string) {
    if (!GeoLocation.COUNTRY_FOR_SUBDIVISION_REGEX.test(country)) {
      // eslint-disable-next-line max-len
      throw new Error(`Invalid country for subdivisions geolocation: ${country}, only UA (Ukraine) and US (United states) are supported`);
    }
  }

  private static validateSubDivision(subDivision: string) {
    if (!GeoLocation.SUBDIVISION_REGEX.test(subDivision)) {
      // eslint-disable-next-line max-len
      throw new Error(`Invalid subdivision format for subdivision: ${subDivision}, subdivision should be alphanumeric and between 1 and 3 characters`);
    }
  }

  private constructor(readonly continentCode: Continent | undefined, readonly countryCode: string | undefined,
    readonly subdivisionCode: string | undefined) {
    if (subdivisionCode && countryCode) {
      GeoLocation.validateCountryForSubdivision(countryCode);
      GeoLocation.validateSubDivision(subdivisionCode);
    }
    if (countryCode) {
      GeoLocation.validateCountry(countryCode);
    }
  }
}

/**
 * Continents for geolocation routing.
 */
export enum Continent {
  /**
   * Africa
  */
  AFRICA = 'AF',
  /**
   * Antarctica
   */
  ANTARCTICA = 'AN',
  /**
   * Asia
   */
  ASIA = 'AS',
  /**
   * Europe
   */
  EUROPE = 'EU',
  /**
   * Oceania
   */
  OCEANIA = 'OC',
  /**
   * North America
   */
  NORTH_AMERICA = 'NA',
  /**
   * South America
   */
  SOUTH_AMERICA = 'SA',
}
