import cxapi = require('@aws-cdk/cx-api');
import { Construct } from './construct';

type ContextProviderProps = {[key: string]: any};
/**
 * Base class for the model side of context providers
 *
 * Instances of this class communicate with context provider plugins in the 'cdk
 * toolkit' via context variables (input), outputting specialized queries for
 * more context variables (output).
 *
 * ContextProvider needs access to a Construct to hook into the context mechanism.
 */
export class ContextProvider {

  private readonly props: ContextProviderProps;

  constructor(private readonly context: Construct,
              private readonly provider: string,
              props: ContextProviderProps = {}) {
    this.props = {
      account: context.node.stack.env.account,
      region: context.node.stack.env.region,
      ...props,
    };
  }

  public get key(): string {
    const propStrings: string[] = propsToArray(this.props);
    return `${this.provider}:${propStrings.join(':')}`;
  }

  /**
   * Read a provider value and verify it is not `null`
   */
  public getValue(defaultValue: any): any {
    // if account or region is not defined this is probably a test mode, so we just
    // return the default value
    if (!this.props.account || !this.props.region) {
      this.context.node.addError(formatMissingScopeError(this.provider, this.props));
      return defaultValue;
    }

    const value = this.context.node.getContext(this.key);

    if (value != null) {
      return value;
    }

    this.context.node.stack.reportMissingContext(this.key, {
      provider: this.provider,
      props: this.props,
    });
    return defaultValue;
  }
  /**
   * Read a provider value, verifying it's a string
   * @param defaultValue The value to return if there is no value defined for this context key
   */
  public getStringValue( defaultValue: string): string {
    // if scope is undefined, this is probably a test mode, so we just
    // return the default value
    if (!this.props.account || !this.props.region) {
      this.context.node.addError(formatMissingScopeError(this.provider, this.props));
      return defaultValue;
    }

    const value = this.context.node.getContext(this.key);

    if (value != null) {
      if (typeof value !== 'string') {
        throw new TypeError(`Expected context parameter '${this.key}' to be a string, but got '${JSON.stringify(value)}'`);
      }
      return value;
    }

    this.context.node.stack.reportMissingContext(this.key, {
      provider: this.provider,
      props: this.props,
    });
    return defaultValue;
  }

  /**
   * Read a provider value, verifying it's a list
   * @param defaultValue The value to return if there is no value defined for this context key
   */
  public getStringListValue(
    defaultValue: string[]): string[] {
      // if scope is undefined, this is probably a test mode, so we just
      // return the default value and report an error so this in not accidentally used
      // in the toolkit
      if (!this.props.account || !this.props.region) {
        this.context.node.addError(formatMissingScopeError(this.provider, this.props));
        return defaultValue;
      }

      const value = this.context.node.getContext(this.key);

      if (value != null) {
        if (!value.map) {
          throw new Error(`Context value '${this.key}' is supposed to be a list, got '${JSON.stringify(value)}'`);
        }
        return value;
      }

      this.context.node.stack.reportMissingContext(this.key, {
        provider: this.provider,
        props: this.props,
      });

      return defaultValue;
    }
}

/**
 * Quote colons in all strings so that we can undo the quoting at a later point
 *
 * We'll use $ as a quoting character, for no particularly good reason other
 * than that \ is going to lead to quoting hell when the keys are stored in JSON.
 */
function colonQuote(xs: string): string {
  return xs.replace('$', '$$').replace(':', '$:');
}

/**
 * Context provider that will return the availability zones for the current account and region
 */
export class AvailabilityZoneProvider {
  private provider: ContextProvider;

  constructor(context: Construct) {
    this.provider = new ContextProvider(context, cxapi.AVAILABILITY_ZONE_PROVIDER);
  }

  /**
   * Return the list of AZs for the current account and region
   */
  public get availabilityZones(): string[] {

    return this.provider.getStringListValue(['dummy1a', 'dummy1b', 'dummy1c']);
  }
}

export interface SSMParameterProviderProps {
  /**
   * The name of the parameter to lookup
   */
  readonly parameterName: string;
}
/**
 * Context provider that will read values from the SSM parameter store in the indicated account and region
 */
export class SSMParameterProvider {
  private provider: ContextProvider;

  constructor(context: Construct, props: SSMParameterProviderProps) {
    this.provider = new ContextProvider(context, cxapi.SSM_PARAMETER_PROVIDER, props);
  }

  /**
   * Return the SSM parameter string with the indicated key
   */
  public parameterValue(defaultValue = 'dummy'): any {
    return this.provider.getStringValue(defaultValue);
  }
}

function formatMissingScopeError(provider: string, props: {[key: string]: string}) {
  let s = `Cannot determine scope for context provider ${provider}`;
  const propsString = Object.keys(props).map( key => (`${key}=${props[key]}`));
  s += ` with props: ${propsString}.`;
  s += '\n';
  s += 'This usually happens when AWS credentials are not available and the default account/region cannot be determined.';
  return s;
}

function propsToArray(props: {[key: string]: any}, keyPrefix = ''): string[] {
  const ret: string[] = [];

  for (const key of Object.keys(props)) {
    switch (typeof props[key]) {
      case 'object': {
        ret.push(...propsToArray(props[key], `${keyPrefix}${key}.`));
        break;
      }
      case 'string': {
        ret.push(`${keyPrefix}${key}=${colonQuote(props[key])}`);
        break;
      }
      default: {
        ret.push(`${keyPrefix}${key}=${JSON.stringify(props[key])}`);
        break;
      }
    }
  }

  ret.sort();
  return ret;
}
