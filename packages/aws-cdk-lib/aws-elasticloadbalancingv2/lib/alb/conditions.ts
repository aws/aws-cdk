import { UnscopedValidationError } from '../../../core/lib/errors';

/**
 * Validates that each value in the array does not exceed the maximum length
 */
function validateMaxLength(
  fieldName: string,
  maxLength: number,
  ...values: string[]
): void {
  for (const value of values) {
    if (value.length > maxLength) {
      throw new UnscopedValidationError(
        `${fieldName} '${value}' exceeds the maximum length of ${maxLength} characters`,
      );
    }
  }
}
/**
 * Validates that each value is non-empty
 */
function validateNonEmpty(fieldName: string, ...values: string[]): void {
  for (const value of values) {
    if (value.length === 0) {
      throw new UnscopedValidationError(`${fieldName} must be non-empty`);
    }
  }
}

/**
 * Validates that the number of values does not exceed the maximum count
 */
function validateMaxCount(fieldName: string, maxCount: number, ...values: string[]): void {
  if (values && values.length > maxCount) {
    throw new UnscopedValidationError(
      `${fieldName} can only have '${maxCount}' condition values`,
    );
  }
}

/**
 * Validates that each value matches a given regex pattern
 */
function validatePattern(
  fieldName: string,
  pattern: RegExp,
  allowedCharsMessage: string,
  ...values: string[]
): void {
  for (const value of values) {
    if (!pattern.test(value)) {
      throw new UnscopedValidationError(
        `${fieldName} '${value}' contains invalid characters. ${allowedCharsMessage}`,
      );
    }
  }
}

/**
 * ListenerCondition providers definition.
 */
export abstract class ListenerCondition {
  /**
   * Create a host-header listener rule condition
   *
   * @param values Hosts for host headers
   */
  public static hostHeaders(values: string[]): ListenerCondition {
    return new HostHeaderListenerCondition(values);
  }

  /**
   * Create a host-header listener rule condition using regular expressions
   *
   * @param values Regular expression patterns to match against the host header
   */
  public static hostHeadersRegex(values: string[]): ListenerCondition {
    return new HostHeaderRegexListenerCondition(values);
  }

  /**
   * Create a http-header listener rule condition
   *
   * @param name HTTP header name
   * @param values HTTP header values
   */
  public static httpHeader(name: string, values: string[]): ListenerCondition {
    return new HttpHeaderListenerCondition(name, values);
  }

  /**
   * Create a http-header listener rule condition using regular expressions
   *
   * @param name HTTP header name
   * @param values Regular expression patterns to match against the HTTP header value
   */
  public static httpHeaderRegex(
    name: string,
    values: string[],
  ): ListenerCondition {
    return new HttpHeaderRegexListenerCondition(name, values);
  }

  /**
   * Create a http-request-method listener rule condition
   *
   * @param values HTTP request methods
   */
  public static httpRequestMethods(values: string[]): ListenerCondition {
    return new HttpRequestMethodListenerCondition(values);
  }

  /**
   * Create a path-pattern listener rule condition
   *
   * @param values Path patterns
   */
  public static pathPatterns(values: string[]): ListenerCondition {
    return new PathPatternListenerCondition(values);
  }

  /**
   * Create a path-pattern listener rule condition using regular expressions
   *
   * @param values Regular expression patterns to match against the request URL path
   */
  public static pathPatternsRegex(values: string[]): ListenerCondition {
    return new PathPatternRegexListenerCondition(values);
  }

  /**
   * Create a query-string listener rule condition
   *
   * @param values Query string key/value pairs
   */
  public static queryStrings(
    values: QueryStringCondition[],
  ): ListenerCondition {
    return new QueryStringListenerCondition(values);
  }

  /**
   * Create a source-ip listener rule condition
   *
   * @param values Source ips
   */
  public static sourceIps(values: string[]): ListenerCondition {
    return new SourceIpListenerCondition(values);
  }

  /**
   * Render the raw Cfn listener rule condition object.
   */
  public abstract renderRawCondition(): any;
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

/**
 * Host header config of the listener rule condition
 */
class HostHeaderListenerCondition extends ListenerCondition {
  constructor(public readonly values: string[]) {
    super();
    validateMaxLength('Host header value', 128, ...values);
  }

  public renderRawCondition(): any {
    return {
      field: 'host-header',
      hostHeaderConfig: {
        values: this.values,
      },
    };
  }
}

/**
 * Host header regex config of the listener rule condition
 */
class HostHeaderRegexListenerCondition extends ListenerCondition {
  constructor(public readonly values: string[]) {
    super();
    validateMaxLength('Host header regex value', 128, ...values);
  }

  public renderRawCondition(): any {
    return {
      field: 'host-header',
      hostHeaderConfig: {
        regexValues: this.values,
      },
    };
  }
}

/**
 * HTTP header config of the listener rule condition
 */
class HttpHeaderListenerCondition extends ListenerCondition {
  constructor(public readonly name: string, public readonly values: string[]) {
    super();
    validateNonEmpty('HTTP header name', name);
    validateMaxLength('HTTP header name', 40, name);
    validateMaxLength('HTTP header value', 128, ...values);
  }

  public renderRawCondition(): any {
    return {
      field: 'http-header',
      httpHeaderConfig: {
        httpHeaderName: this.name,
        values: this.values,
      },
    };
  }
}

/**
 * HTTP header regex config of the listener rule condition
 */
class HttpHeaderRegexListenerCondition extends ListenerCondition {
  constructor(public readonly name: string, public readonly values: string[]) {
    super();
    validateNonEmpty('HTTP header name', name);
    validateMaxLength('HTTP header name', 40, name);
    validateMaxLength('HTTP header regex', 128, ...values);
  }

  public renderRawCondition(): any {
    return {
      field: 'http-header',
      httpHeaderConfig: {
        httpHeaderName: this.name,
        regexValues: this.values,
      },
    };
  }
}

/**
 * HTTP reqeust method config of the listener rule condition
 */
class HttpRequestMethodListenerCondition extends ListenerCondition {
  constructor(public readonly values: string[]) {
    super();
    validateNonEmpty('HTTP request method', ...values);
    validateMaxLength('HTTP request method', 40, ...values);
    validatePattern(
      'HTTP request method',
      /^[A-Z\-_]+$/,
      'Only A-Z, hyphen (-), and underscore (_) are allowed',
      ...values,
    );
  }

  public renderRawCondition(): any {
    return {
      field: 'http-request-method',
      httpRequestMethodConfig: {
        values: this.values,
      },
    };
  }
}

/**
 * Path pattern config of the listener rule condition
 */
class PathPatternListenerCondition extends ListenerCondition {
  constructor(public readonly values: string[]) {
    super();
    validateMaxCount('Path pattern value', 5, ...values);
    validateMaxLength('Path pattern value', 128, ...values);
  }

  public renderRawCondition(): any {
    return {
      field: 'path-pattern',
      pathPatternConfig: {
        values: this.values,
      },
    };
  }
}

/**
 * Path pattern regex config of the listener rule condition
 */
class PathPatternRegexListenerCondition extends ListenerCondition {
  constructor(public readonly values: string[]) {
    super();
    validateMaxCount('Path pattern regex value', 5, ...values);
    validateMaxLength('Path pattern regex value', 128, ...values);
  }

  public renderRawCondition(): any {
    return {
      field: 'path-pattern',
      pathPatternConfig: {
        regexValues: this.values,
      },
    };
  }
}

/**
 * Query string config of the listener rule condition
 */
class QueryStringListenerCondition extends ListenerCondition {
  constructor(public readonly values: QueryStringCondition[]) {
    super();
    validateMaxLength( 'Query string key', 128, ...values.filter(v => v.key !== undefined).map(v => v.key!));
    validateMaxLength( 'Query string value', 128, ...values.map(v => v.value));
  }

  public renderRawCondition(): any {
    return {
      field: 'query-string',
      queryStringConfig: {
        values: this.values,
      },
    };
  }
}

/**
 * Source ip config of the listener rule condition
 */
class SourceIpListenerCondition extends ListenerCondition {
  constructor(public readonly values: string[]) {
    super();
  }

  public renderRawCondition(): any {
    return {
      field: 'source-ip',
      sourceIpConfig: {
        values: this.values,
      },
    };
  }
}
