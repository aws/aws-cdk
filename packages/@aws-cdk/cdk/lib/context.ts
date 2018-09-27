import { Stack } from './cloudformation/stack';
import { Construct } from './core/construct';

const AVAILABILITY_ZONES_PROVIDER = 'availability-zones';
const SSM_PARAMETER_PROVIDER = 'ssm';

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

  constructor(private context: Construct) {
    this.stack = Stack.find(context);
  }

  /**
   * Read a provider value, verifying it's a string
   * @param provider The name of the context provider
   * @param scope The scope (e.g. account/region) for the value
   * @param args Any arguments
   * @param defaultValue The value to return if there is no value defined for this context key
   */
  public getStringValue(
    provider: string,
    scope: undefined | string[],
    args: string[],
    defaultValue: string): string {
    // if scope is undefined, this is probably a test mode, so we just
    // return the default value
    if (!scope) {
      this.context.addError(formatMissingScopeError(provider, args));
      return defaultValue;
    }
    const key = colonQuote([provider].concat(scope).concat(args)).join(':');
    const value = this.context.getContext(key);
    if (value != null) {
      if (typeof value !== 'string') {
        throw new TypeError(`Expected context parameter '${key}' to be a string, but got '${value}'`);
      }
      return value;
    }

    this.stack.reportMissingContext(key, { provider, scope, args });
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
    provider: string,
    scope: undefined | string[],
    args: string[],
    defaultValue: string[]): string[] {
    // if scope is undefined, this is probably a test mode, so we just
    // return the default value and report an error so this in not accidentally used
    // in the toolkit
    if (!scope) {
      // tslint:disable-next-line:max-line-length
      this.context.addError(formatMissingScopeError(provider, args));
      return defaultValue;
    }

    const key = colonQuote([provider].concat(scope).concat(args)).join(':');
    const value = this.context.getContext(key);

    if (value != null) {
      if (!value.map) {
        throw new Error(`Context value '${key}' is supposed to be a list, got '${value}'`);
      }
      return value;
    }

    this.stack.reportMissingContext(key, { provider, scope, args });
    return defaultValue;
  }

  /**
   * Helper function to wrap up account and region into a scope tuple
   */
  public accountRegionScope(providerDescription: string): undefined | string[] {
    const stack = Stack.find(this.context);
    if (!stack) {
      throw new Error(`${providerDescription}: construct must be in a stack`);
    }

    const account = stack.env.account;
    const region = stack.env.region;

    if (account == null || region == null) {
      return undefined;
    }

    return [account, region];
  }
}

/**
 * Quote colons in all strings so that we can undo the quoting at a later point
 *
 * We'll use $ as a quoting character, for no particularly good reason other
 * than that \ is going to lead to quoting hell when the keys are stored in JSON.
 */
function colonQuote(xs: string[]): string[] {
  return xs.map(x => x.replace('$', '$$').replace(':', '$:'));
}

/**
 * Context provider that will return the availability zones for the current account and region
 */
export class AvailabilityZoneProvider {
  private provider: ContextProvider;

  constructor(context: Construct) {
    this.provider = new ContextProvider(context);
  }

  /**
   * Return the list of AZs for the current account and region
   */
  public get availabilityZones(): string[] {
    return this.provider.getStringListValue(AVAILABILITY_ZONES_PROVIDER,
                        this.provider.accountRegionScope('AvailabilityZoneProvider'),
                        [],
                        ['dummy1a', 'dummy1b', 'dummy1c']);
  }
}

/**
 * Context provider that will read values from the SSM parameter store in the indicated account and region
 */
export class SSMParameterProvider {
  private provider: ContextProvider;

  constructor(context: Construct) {
    this.provider = new ContextProvider(context);
  }

  /**
   * Return the SSM parameter string with the indicated key
   */
  public getString(parameterName: string): any {
    const scope = this.provider.accountRegionScope('SSMParameterProvider');
    return this.provider.getStringValue(SSM_PARAMETER_PROVIDER, scope, [parameterName], 'dummy');
  }
}

function formatMissingScopeError(provider: string, args: string[]) {
  let s = `Cannot determine scope for context provider ${provider}`;
  if (args.length > 0) {
    s += JSON.stringify(args);
  }
  s += '.';
  s += '\n';
  s += 'This usually happens when AWS credentials are not available and the default account/region cannot be determined.';
  return s;
}
