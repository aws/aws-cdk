import cxapi = require('@aws-cdk/cx-api');
import { Stack } from './cloudformation/stack';
import { Construct } from './core/construct';

const AVAILABILITY_ZONES_PROVIDER = 'availability-zones';
const SSM_PARAMETER_PROVIDER = 'ssm';
const HOSTED_ZONE_PROVIDER = 'hosted-zone';

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

  private readonly stack: Stack;
  private readonly provider: string;
  private readonly props: {[key: string]: any};

  constructor(private context: Construct, provider: string, props: {[key: string]: any} = {}) {
    this.stack = Stack.find(context);
    this.provider = provider;
    this.props = props;
  }

  public get key(): string {
    const account = this.account;
    const region = this.region;
    let keyStr = `${this.provider}:${account}:${region}`;
    const propStrings: string[] = this.objectToString(this.props);
    if (propStrings.length > 0) {
      keyStr += ':';
      keyStr += propStrings.join(':');
    }
    return keyStr;
  }
  /**
   * Read a provider value, verifying it's a string
   * @param provider The name of the context provider
   * @param scope The scope (e.g. account/region) for the value
   * @param args Any arguments
   * @param defaultValue The value to return if there is no value defined for this context key
   */
  public getStringValue( defaultValue: string): string {
    // if scope is undefined, this is probably a test mode, so we just
    // return the default value
    if (!this.account || !this.region) {
      this.context.addError(formatMissingScopeError(this.provider, this.props));
      return defaultValue;
    }

    const value = this.context.getContext(this.key);

    if (value != null) {
      if (typeof value !== 'string') {
        throw new TypeError(`Expected context parameter '${this.key}' to be a string, but got '${value}'`);
      }
      return value;
    }

    this.stack.reportMissingContext(this.key, {
      provider: this.provider,
      account: this.account,
      region: this.region,
      props: this.props,
    });
    return defaultValue;
  }

  /**
   * Read a provider value, verifying it's a list
   * @param provider The name of the context provider
   * @param scope The scope (e.g. account/region) for the value
   * @param args Any arguments
   * @param defaultValue The value to return if there is no value defined for this context key
   */
  public getStringListValue(
    defaultValue: string[]): string[] {
      // if scope is undefined, this is probably a test mode, so we just
      // return the default value and report an error so this in not accidentally used
      // in the toolkit
      if (!this.account || !this.region) {
        this.context.addError(formatMissingScopeError(this.provider, this.props));
        return defaultValue;
      }

      const value = this.context.getContext(this.key);

      if (value != null) {
        if (!value.map) {
          throw new Error(`Context value '${this.key}' is supposed to be a list, got '${value}'`);
        }
        return value;
      }

      this.stack.reportMissingContext(this.key, {
        provider: this.provider,
        account: this.account,
        region: this.region,
        props: this.props,
      });

      return defaultValue;
    }

  private objectToString(obj: any): string[] {
    const objStr: string[] = [];
    const keys = Object.keys(obj);
    keys.sort();
    for (const key of keys) {
      switch (typeof obj[key]) {
        case 'object': {
          const childObjStrs = this.objectToString(obj[key]);
          const qualifiedChildStr = childObjStrs.map( child => (`${key}${child}`)).join(':');
          objStr.push(qualifiedChildStr);
          break;
        }
        case 'string': {
          objStr.push(`${key}=${colonQuote(obj[key])}`);
          break;
        }
        default: {
          objStr.push(`${key}=${JSON.stringify(obj[key])}`);
          break;
        }
      }
    }
    return objStr;
  }

  private get account(): string | undefined {
    return this.stack.env.account;
  }

  private get region(): string | undefined {
    return this.stack.env.region;
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
    this.provider = new ContextProvider(context, AVAILABILITY_ZONES_PROVIDER);
  }

  /**
   * Return the list of AZs for the current account and region
   */
  public get availabilityZones(): string[] {

    return this.provider.getStringListValue(['dummy1a', 'dummy1b', 'dummy1c']);
  }
}

export interface SSMParameterProviderProps {
  parameterName: string;
}
/**
 * Context provider that will read values from the SSM parameter store in the indicated account and region
 */
export class SSMParameterProvider {
  private provider: ContextProvider;

  constructor(context: Construct, props: SSMParameterProviderProps) {
    this.provider = new ContextProvider(context, SSM_PARAMETER_PROVIDER, props);
  }

  /**
   * Return the SSM parameter string with the indicated key
   */
  public parameterValue(): any {
    return this.provider.getStringValue('dummy');
  }
}

/**
 * Context provider that will lookup the Hosted Zone ID for the given arguments
 */
export class HostedZoneProvider {
  private provider: ContextProvider;
  constructor(context: Construct, props: cxapi.HostedZoneProviderProps) {
    this.provider = new ContextProvider(context, HOSTED_ZONE_PROVIDER, props);
  }
  /**
   * Return the hosted zone meeting the filter
   */
  public zoneId(): string {
    return this.provider.getStringValue('dummy-zone');
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
