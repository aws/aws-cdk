import cxapi = require('@aws-cdk/cx-api');
import { Construct } from './construct';
import { Stack } from './stack';
import { Token } from './token';

type ContextProviderProps = {[key: string]: any};

/**
 * Methods for CDK-related context information.
 */
export class Context {
  /**
   * Returns the default region as passed in through the CDK CLI.
   *
   * @returns The default region as specified in context or `undefined` if the region is not specified.
   */
  public static getDefaultRegion(scope: Construct) { return scope.node.tryGetContext(cxapi.DEFAULT_REGION_CONTEXT_KEY); }

  /**
   * Returns the default account ID as passed in through the CDK CLI.
   *
   * @returns The default account ID as specified in context or `undefined` if the account ID is not specified.
   */
  public static getDefaultAccount(scope: Construct) { return scope.node.tryGetContext(cxapi.DEFAULT_ACCOUNT_CONTEXT_KEY); }

  /**
   * Returnst the list of AZs in the scope's environment (account/region).
   *
   * If they are not available in the context, returns a set of dummy values and
   * reports them as missing, and let the CLI resolve them by calling EC2
   * `DescribeAvailabilityZones` on the target environment.
   */
  public static getAvailabilityZones(scope: Construct) {
    return new AvailabilityZoneProvider(scope).availabilityZones;
  }

  /**
   * Retrieves the value of an SSM parameter.
   * @param scope Some construct scope.
   * @param parameterName The name of the parameter
   * @param options Options
   */
  public static getSsmParameter(scope: Construct, parameterName: string, options: SsmParameterOptions = { }) {
    return new SsmParameterProvider(scope, parameterName).parameterValue(options.defaultValue);
  }

  private constructor() { }
}

export interface SsmParameterOptions {
  /**
   * The default/dummy value to return if the SSM parameter is not available in the context.
   */
  readonly defaultValue?: string;
}

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

    const stack = Stack.of(context);

    let account: undefined | string = stack.account;
    let region: undefined | string = stack.region;

    // stack.account and stack.region will defer to deploy-time resolution
    // (AWS::Region, AWS::AccountId) if user did not explicitly specify them
    // when they defined the stack, but this is not good enough for
    // environmental context because we need concrete values during synthesis.
    if (!account || Token.isUnresolved(account)) {
      account = Context.getDefaultAccount(this.context);
    }

    if (!region || Token.isUnresolved(region)) {
      region = Context.getDefaultRegion(this.context);
    }

    // this is probably an issue. we can't have only account but no region specified
    if (account && !region) {
      throw new Error(`A region must be specified in order to obtain environmental context: ${provider}`);
    }

    this.props = {
      account,
      region,
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
    const value = this.context.node.tryGetContext(this.key);
    if (value != null) {
      return value;
    }

    // if account or region is not defined this is probably a test mode, so we just
    // return the default value
    if (!this.props.account || !this.props.region) {
      this.context.node.addError(formatMissingScopeError(this.provider, this.props));
      return defaultValue;
    }

    this.reportMissingContext({
      key: this.key,
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
    const value = this.context.node.tryGetContext(this.key);

    if (value != null) {
      if (typeof value !== 'string') {
        throw new TypeError(`Expected context parameter '${this.key}' to be a string, but got '${JSON.stringify(value)}'`);
      }
      return value;
    }

    // if scope is undefined, this is probably a test mode, so we just
    // return the default value
    if (!this.props.account || !this.props.region) {
      this.context.node.addError(formatMissingScopeError(this.provider, this.props));
      return defaultValue;
    }

    this.reportMissingContext({
      key: this.key,
      provider: this.provider,
      props: this.props,
    });

    return defaultValue;
  }

  /**
   * Read a provider value, verifying it's a list
   * @param defaultValue The value to return if there is no value defined for this context key
   */
  public getStringListValue(defaultValue: string[]): string[] {
    const value = this.context.node.tryGetContext(this.key);

    if (value != null) {
      if (!value.map) {
        throw new Error(`Context value '${this.key}' is supposed to be a list, got '${JSON.stringify(value)}'`);
      }
      return value;
    }

    // if scope is undefined, this is probably a test mode, so we just
    // return the default value and report an error so this in not accidentally used
    // in the toolkit
    if (!this.props.account || !this.props.region) {
      this.context.node.addError(formatMissingScopeError(this.provider, this.props));
      return defaultValue;
    }

    this.reportMissingContext({
      key: this.key,
      provider: this.provider,
      props: this.props,
    });

    return defaultValue;
  }

  protected reportMissingContext(report: cxapi.MissingContext) {
    Stack.of(this.context).reportMissingContext(report);
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
class AvailabilityZoneProvider {
  private provider: ContextProvider;

  constructor(context: Construct) {
    this.provider = new ContextProvider(context, cxapi.AVAILABILITY_ZONE_PROVIDER);
  }

  /**
   * Returns the context key the AZ provider looks up in the context to obtain
   * the list of AZs in the current environment.
   */
  public get key() {
    return this.provider.key;
  }

  /**
   * Return the list of AZs for the current account and region
   */
  public get availabilityZones(): string[] {
    return this.provider.getStringListValue(['dummy1a', 'dummy1b', 'dummy1c']);
  }
}

/**
 * Context provider that will read values from the SSM parameter store in the indicated account and region
 */
class SsmParameterProvider {
  private provider: ContextProvider;

  constructor(context: Construct, parameterName: string) {
    this.provider = new ContextProvider(context, cxapi.SSM_PARAMETER_PROVIDER, { parameterName });
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
