/**
 * Routing based on geographical location.
 */
export class GeoLocation {
  /**
   * Geolocation resource record based on continent code.
   * @param continentCode Code of the continent. Valid codes are AF (Africa), AN (Antarctica), AS (Asia),
   * EU (Europe), OC (Oceania), NA (North America), SA (South America).
   * @returns Continent-based geolocation record
   */
  public static continent(continentCode: string) {
    return new GeoLocation(continentCode, undefined, undefined);
  }

  /**
   * Geolocation resource record based on country code.
   * @param countryCode Two-letter, uppercase country code for the country.
   * See ISO 3166-1-alpha-2 code on the *International Organization for Standardization* website
   * @returns Country-based geolocation record
   */
  public static country(countryCode: string) {
    return new GeoLocation(undefined, countryCode, undefined);
  }

  /**
   * Geolocation resource record based on subdivision code (e.g. state of the United States).
   * @param subdivisionCode Code of the subdivision (e.g. state of the United States)
   * @param countryCode Country code (ISO 3166-1-alpha-2) of this record, by default US (United States).
   * @returns Subdivision-based geolocation record
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

  private static CONTINENT_REGEX = /\b(?:AF|AN|AS|EU|OC|NA|SA)\b/;
  private static COUNTRY_REGEX = /(^[A-Z]{2}|^\*{1})$/;
  private static SUBDEVISION_REGEX = /^[A-Z0-9]{1,3}$/;

  private static validateContinent(continent: string) {
    if (!GeoLocation.CONTINENT_REGEX.test(continent)) {
      // eslint-disable-next-line max-len
      throw new Error(`Invalid format for continent: ${continent}, only these continent codes are valid: AF, AN, AS, EU, OC, NA, SA`);
    }
  }

  private static validateCountry(country: string) {
    if (!GeoLocation.COUNTRY_REGEX.test(country)) {
      // eslint-disable-next-line max-len
      throw new Error(`Invalid country format for country: ${country}, country should be two-letter and uppercase country ISO 3166-1-alpha-2 code`);
    }
  }

  private static validateSubDivision(subDivision: string) {
    if (!GeoLocation.SUBDEVISION_REGEX.test(subDivision)) {
      // eslint-disable-next-line max-len
      throw new Error(`Invalid subdivision format for subdivision: ${subDivision}, subdivision should be alphanumeric and between 1 and 3 characters`);
    }
  }

  private constructor(readonly continentCode: string | undefined, readonly countryCode: string | undefined,
    readonly subdivisionCode: string | undefined) {
    if (continentCode) {
      GeoLocation.validateContinent(continentCode);
    }
    if (countryCode) {
      GeoLocation.validateCountry(countryCode);
    }
    if (subdivisionCode) {
      GeoLocation.validateSubDivision(subdivisionCode);
    }
  }
}
