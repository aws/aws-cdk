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
   * Create a http-header listener rule condition
   *
   * @param name HTTP header name
   * @param values HTTP header values
   */
  public static httpHeader(name: string, values: string[]): ListenerCondition {
    return new HttpHeaderListenerCondition(name, values);
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
   * Create a query-string listener rule condition
   *
   * @param values Query string key/value pairs
   */
  public static queryStrings(values: QueryStringCondition[]): ListenerCondition {
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
 * HTTP header config of the listener rule condition
 */
class HttpHeaderListenerCondition extends ListenerCondition {
  constructor(public readonly name: string, public readonly values: string[]) {
    super();
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
 * HTTP reqeust method config of the listener rule condition
 */
class HttpRequestMethodListenerCondition extends ListenerCondition {
  constructor(public readonly values: string[]) {
    super();
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
    if (values && values.length > 5) {
      throw new Error("A rule can only have '5' condition values");
    }
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
 * Query string config of the listener rule condition
 */
class QueryStringListenerCondition extends ListenerCondition {
  constructor(public readonly values: QueryStringCondition[]) {
    super();
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
