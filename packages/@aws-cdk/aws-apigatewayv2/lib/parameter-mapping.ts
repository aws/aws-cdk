export interface IMappingValue {
  readonly value: string;
};

export class MappingValue implements IMappingValue {
  public static readonly NONE = new MappingValue('');
  public static requestHeader(name: string) { return new MappingValue(`$request.header.${name}`); }
  public static requestQueryString(name: string) { return new MappingValue(`$request.querystring.${name}`); }
  public static requestBody(name: string) { return new MappingValue(`$request.body.${name}`); }
  public static requestPathFull() { return new MappingValue('$request.path'); }
  public static requestPath(name: string) { return new MappingValue(`$request.path.${name}`); }
  public static contextVariable(variableName: string) { return new MappingValue(`$context.${variableName}`); }
  public static stageVariablesVariable(variableName: string) { return new MappingValue(`$stageVariables.${variableName}`); }
  public static custom(value: string) { return new MappingValue(value); }
  protected constructor(public readonly value: string) { }
}

export class ParameterMapping {
  public readonly mappings: { [key: string]: string }
  constructor() {
    this.mappings = {};
  }

  public appendHeader(name: string, value: MappingValue): ParameterMapping {
    this.mappings[`append:header.${name}`] = value.value;
    return this;
  }

  public overwriteHeader(name: string, value: MappingValue): ParameterMapping {
    this.mappings[`overwrite:header.${name}`] = value.value;
    return this;
  }

  public removeHeader(name: string): ParameterMapping {
    this.mappings[`remove:header.${name}`] = '';
    return this;
  }

  public appendQueryString(name: string, value: MappingValue): ParameterMapping {
    this.mappings[`append:querystring.${name}`] = value.value;
    return this;
  }
  public overwriteQueryString(name: string, value: MappingValue): ParameterMapping {
    this.mappings[`overwrite:querystring.${name}`] = value.value;
    return this;
  }
  public removeQueryString(name: string): ParameterMapping {
    this.mappings[`remove:querystring.${name}`] = '';
    return this;
  }

  public overwritePath(value: MappingValue): ParameterMapping {
    this.mappings['overwrite:path'] = value.value;
    return this;
  }

  public custom(key: string, value: string): ParameterMapping {
    this.mappings[key] = value;
    return this;
  }
}