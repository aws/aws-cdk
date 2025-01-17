/**
 * Represents a Mapping Value.
 */
export interface IMappingValue {
  /**
   * Represents a Mapping Value.
   */
  readonly value: string;
};

/**
 * Represents a Mapping Value.
 */
export class MappingValue implements IMappingValue {
  /**
  * Creates an empty mapping value.
  */
  public static readonly NONE = new MappingValue('');

  /**
   * Creates a header mapping value.
   */
  public static requestHeader(name: string) { return new MappingValue(`$request.header.${name}`); }

  /**
   * Creates a query string mapping value.
   */
  public static requestQueryString(name: string) { return new MappingValue(`$request.querystring.${name}`); }

  /**
   * Creates a request body mapping value.
   */
  public static requestBody(name: string) { return new MappingValue(`$request.body.${name}`); }

  /**
   * Creates a request path mapping value.
   */
  public static requestPath() { return new MappingValue('$request.path'); }

  /**
   * Creates a request path parameter mapping value.
   */
  public static requestPathParam(name: string) { return new MappingValue(`$request.path.${name}`); }

  /**
   * Creates a context variable mapping value.
   */
  public static contextVariable(variableName: string) { return new MappingValue(`$context.${variableName}`); }

  /**
   * Creates a stage variable mapping value.
   */
  public static stageVariable(variableName: string) { return new MappingValue(`$stageVariables.${variableName}`); }

  /**
   * Creates a custom mapping value.
   */
  public static custom(value: string) { return new MappingValue(value); }

  /**
   * Represents a Mapping Value.
   */
  public readonly value: string;

  protected constructor(value: string) {
    this.value = value;
  }
}

/**
 * Represents a Parameter Mapping.
 */
export class ParameterMapping {

  /**
   * Creates a mapping from an object.
   */
  public static fromObject(obj: { [key: string]: MappingValue }): ParameterMapping {
    const mapping = new ParameterMapping();
    for (const [k, m] of Object.entries(obj)) {
      mapping.custom(k, m.value);
    }
    return mapping;
  }

  /**
  * Represents all created parameter mappings.
  */
  public readonly mappings: { [key: string]: string };
  constructor() {
    this.mappings = {};
  }

  /**
   * Creates a mapping to append a header.
   */
  public appendHeader(name: string, value: MappingValue): ParameterMapping {
    this.mappings[`append:header.${name}`] = value.value;
    return this;
  }

  /**
   * Creates a mapping to overwrite a header.
   */
  public overwriteHeader(name: string, value: MappingValue): ParameterMapping {
    this.mappings[`overwrite:header.${name}`] = value.value;
    return this;
  }

  /**
   * Creates a mapping to remove a header.
   */
  public removeHeader(name: string): ParameterMapping {
    this.mappings[`remove:header.${name}`] = '';
    return this;
  }

  /**
   * Creates a mapping to append a query string.
   */
  public appendQueryString(name: string, value: MappingValue): ParameterMapping {
    this.mappings[`append:querystring.${name}`] = value.value;
    return this;
  }

  /**
   * Creates a mapping to overwrite a querystring.
   */
  public overwriteQueryString(name: string, value: MappingValue): ParameterMapping {
    this.mappings[`overwrite:querystring.${name}`] = value.value;
    return this;
  }

  /**
   * Creates a mapping to remove a querystring.
   */
  public removeQueryString(name: string): ParameterMapping {
    this.mappings[`remove:querystring.${name}`] = '';
    return this;
  }

  /**
   * Creates a mapping to overwrite a path.
   */
  public overwritePath(value: MappingValue): ParameterMapping {
    this.mappings['overwrite:path'] = value.value;
    return this;
  }

  /**
   * Creates a custom mapping.
   */
  public custom(key: string, value: string): ParameterMapping {
    this.mappings[key] = value;
    return this;
  }
}
