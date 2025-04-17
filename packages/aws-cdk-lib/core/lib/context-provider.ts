import { Construct, Node } from 'constructs';
import { Annotations } from './annotations';
import { Stack } from './stack';
import { Token } from './token';
import * as cxschema from '../../cloud-assembly-schema';
import * as cxapi from '../../cx-api';

/**
 */
export interface GetContextKeyOptions {
  /**
   * The context provider to query.
   */
  readonly provider: string;

  /**
   * Provider-specific properties.
   */
  readonly props?: { [key: string]: any };

  /**
   * Whether to include the stack's account and region automatically.
   *
   * @default true
   */
  readonly includeEnvironment?: boolean;
}

/**
 */
export interface GetContextValueOptions extends GetContextKeyOptions {
  /**
   * The value to return if the lookup has not yet been performed.
   *
   * Upon first synthesis, the lookups has not yet been performed. The
   * `getValue()` operation returns this value instead, so that synthesis can
   * proceed. After synthesis completes the first time, the actual lookup will
   * be performed and synthesis will run again with the *real* value.
   *
   * Dummy values should preferably have valid shapes so that downstream
   * consumers of lookup values don't throw validation exceptions if they
   * encounter a dummy value (or all possible downstream consumers need to
   * effectively check for the well-known shape of the dummy value); throwing an
   * exception would error out the synthesis operation and prevent the lookup
   * and the second, real, synthesis from happening.
   *
   * ## Connection to mustExist
   *
   * `dummyValue` is also used as the official value to return if the lookup has
   * failed and `mustExist == false`.
   */
  readonly dummyValue: any;

  /**
   * Whether the resource must exist
   *
   * If this is set (the default), the query fails if the value or resource we
   * tried to look up doesn't exist.
   *
   * If this is `false` and the value we tried to look up could not be found, the
   * failure is suppressed and `dummyValue` is officially returned instead.
   *
   * When this happens, `dummyValue` is encoded into cached context and it will
   * never be refreshed anymore until the user runs `cdk context --reset <key>`.
   *
   * Note that it is not possible for the CDK app code to make a distinction
   * between "the lookup has not been performed yet" and "the lookup didn't
   * find anything and we returned a default value instead".
   *
   * ## Context providers
   *
   * This feature must explicitly be supported by context providers. It is
   * currently supported by:
   *
   * - KMS key provider
   * - SSM parameter provider
   *
   * ## Note to implementors
   *
   * The dummy value should not be returned for all SDK lookup failures. For
   * example, "no network" or "no credentials" or "malformed query" should
   * not lead to the dummy value being returned. Only the case of "no such
   * resource" should.
   *
   * @default true
   */
  readonly mustExist?: boolean;

  /**
   * Ignore a lookup failure and return the `dummyValue` instead
   *
   * `mustExist` is the recommended alias for this deprecated
   * property (note that its value is reversed).
   *
   * @default false
   * @deprecated Use mustExist instead
   */
  readonly ignoreErrorOnMissingContext?: boolean;
}

/**
 */
export interface GetContextKeyResult {
  readonly key: string;
  readonly props: { [key: string]: any };
}

/**
 */
export interface GetContextValueResult {
  readonly value?: any;
}

/**
 * Base class for the model side of context providers
 *
 * Instances of this class communicate with context provider plugins in the 'cdk
 * toolkit' via context variables (input), outputting specialized queries for
 * more context variables (output).
 *
 * ContextProvider needs access to a Construct to hook into the context mechanism.
 *
 */
export class ContextProvider {
  /**
   * @returns the context key or undefined if a key cannot be rendered (due to tokens used in any of the props)
   */
  public static getKey(scope: Construct, options: GetContextKeyOptions): GetContextKeyResult {
    const stack = Stack.of(scope);

    const props = options.includeEnvironment ?? true
      ? { account: stack.account, region: stack.region, ...options.props }
      : (options.props ?? {});

    if (Object.values(props).find(x => Token.isUnresolved(x))) {
      throw new Error(
        `Cannot determine scope for context provider ${options.provider}.\n` +
        'This usually happens when one or more of the provider props have unresolved tokens');
    }

    const propStrings = propsToArray(props);
    return {
      key: `${options.provider}:${propStrings.join(':')}`,
      props,
    };
  }

  public static getValue(scope: Construct, options: GetContextValueOptions): GetContextValueResult {
    if ((options.mustExist !== undefined) && (options.ignoreErrorOnMissingContext !== undefined)) {
      throw new Error('Only supply one of \'mustExist\' and \'ignoreErrorOnMissingContext\'');
    }

    const stack = Stack.of(scope);

    if (Token.isUnresolved(stack.account) || Token.isUnresolved(stack.region)) {
      throw new Error(`Cannot retrieve value from context provider ${options.provider} since account/region ` +
                      'are not specified at the stack level. Configure "env" with an account and region when ' +
                      'you define your stack.' +
                      'See https://docs.aws.amazon.com/cdk/latest/guide/environments.html for more details.');
    }

    const { key, props } = this.getKey(scope, options);
    const value = Node.of(scope).tryGetContext(key);
    const providerError = extractProviderError(value);

    // if context is missing or an error occurred during context retrieval,
    // report and return a dummy value.
    if (value === undefined || providerError !== undefined) {
      // Render 'ignoreErrorOnMissingContext' iff one of the parameters is supplied.
      const ignoreErrorOnMissingContext = options.mustExist !== undefined || options.ignoreErrorOnMissingContext !== undefined
        ? (options.mustExist !== undefined ? !options.mustExist : options.ignoreErrorOnMissingContext)
        : undefined;

      // build a version of the props which includes the dummyValue and ignoreError flag
      const extendedProps: { [p: string]: any } = {
        dummyValue: options.dummyValue,

        // Even though we renamed the user-facing property, the field in the
        // cloud assembly still has the original name, which is somewhat wrong
        // because it's not about missing context.
        ignoreErrorOnMissingContext,
        ...props,
      };

      // We'll store the extendedProps in the missingContextKey report
      // so that we can retrieve the dummyValue and ignoreError flag
      // in the aws-cdk's ssm-context and kms key provider
      stack.reportMissingContextKey({
        key,
        provider: options.provider as cxschema.ContextProvider,
        props: extendedProps as cxschema.ContextQueryProperties,
      });

      if (providerError !== undefined) {
        Annotations.of(scope).addError(providerError);
      }

      return { value: options.dummyValue };
    }

    return { value };
  }

  private constructor() { }
}

/**
 * If the context value represents an error, return the error message
 */
function extractProviderError(value: any): string | undefined {
  if (typeof value === 'object' && value !== null) {
    return value[cxapi.PROVIDER_ERROR_KEY];
  }
  return undefined;
}

/**
 * Quote colons in all strings so that we can undo the quoting at a later point
 *
 * We'll use $ as a quoting character, for no particularly good reason other
 * than that \ is going to lead to quoting hell when the keys are stored in JSON.
 */
function colonQuote(xs: string): string {
  return xs.replace(/\$/g, '$$').replace(/:/g, '$:');
}

function propsToArray(props: {[key: string]: any}, keyPrefix = ''): string[] {
  const ret: string[] = [];

  for (const key of Object.keys(props)) {
    // skip undefined values
    if (props[key] === undefined) {
      continue;
    }

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
