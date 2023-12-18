import { Construct } from 'constructs';
import { CustomResourceProviderBase } from './custom-resource-provider-base';
import { CustomResourceProviderOptions } from './shared';
import { Stack } from '../stack';

/**
 * Initialization properties for `CustomResourceProvider`.
 *
 */
export interface CustomResourceProviderProps extends CustomResourceProviderOptions {
  /**
   * A local file system directory with the provider's code. The code will be
   * bundled into a zip asset and wired to the provider's AWS Lambda function.
   */
  readonly codeDirectory: string;

  /**
   * The AWS Lambda runtime and version to use for the provider.
   */
  readonly runtime: CustomResourceProviderRuntime;
}

/**
 * The lambda runtime to use for the resource provider. This also indicates
 * which language is used for the handler.
 */
export enum CustomResourceProviderRuntime {
  /**
   * Node.js 12.x
   * @deprecated Use latest version
   */
  NODEJS_12_X = 'nodejs12.x',

  /**
   * Node.js 12.x
   * @deprecated Use latest version
   */
  NODEJS_12 = 'deprecated_nodejs12.x',

  /**
   * Node.js 14.x
   * @deprecated Use latest version
   */
  NODEJS_14_X = 'nodejs14.x',

  /**
   * Node.js 16.x
   */
  NODEJS_16_X = 'nodejs16.x',

  /**
   * Node.js 18.x
   */
  NODEJS_18_X = 'nodejs18.x',
}

/**
 * An AWS-Lambda backed custom resource provider, for CDK Construct Library constructs
 *
 * This is a provider for `CustomResource` constructs, backed by an AWS Lambda
 * Function. It only supports NodeJS runtimes.
 *
 * > **Application builders do not need to use this provider type**. This is not
 * > a generic custom resource provider class. It is specifically
 * > intended to be used only by constructs in the AWS CDK Construct Library, and
 * > only exists here because of reverse dependency issues (for example, it cannot
 * > use `iam.PolicyStatement` objects, since the `iam` library already depends on
 * > the CDK `core` library and we cannot have cyclic dependencies).
 *
 * If you are not writing constructs for the AWS Construct Library, you should
 * use the `Provider` class in the `custom-resources` module instead, which has
 * a better API and supports all Lambda runtimes, not just Node.
 *
 * N.B.: When you are writing Custom Resource Providers, there are a number of
 * lifecycle events you have to pay attention to. These are documented in the
 * README of the `custom-resources` module. Be sure to give the documentation
 * in that module a read, regardless of whether you end up using the Provider
 * class in there or this one.
 */
export class CustomResourceProvider extends CustomResourceProviderBase {
  /**
   * Returns a stack-level singleton ARN (service token) for the custom resource
   * provider.
   *
   * @param scope Construct scope
   * @param uniqueid A globally unique id that will be used for the stack-level
   * construct.
   * @param props Provider properties which will only be applied when the
   * provider is first created.
   * @returns the service token of the custom resource provider, which should be
   * used when defining a `CustomResource`.
   */
  public static getOrCreate(scope: Construct, uniqueid: string, props: CustomResourceProviderProps) {
    return this.getOrCreateProvider(scope, uniqueid, props).serviceToken;
  }

  /**
   * Returns a stack-level singleton for the custom resource provider.
   *
   * @param scope Construct scope
   * @param uniqueid A globally unique id that will be used for the stack-level
   * construct.
   * @param props Provider properties which will only be applied when the
   * provider is first created.
   * @returns the service token of the custom resource provider, which should be
   * used when defining a `CustomResource`.
   */
  public static getOrCreateProvider(scope: Construct, uniqueid: string, props: CustomResourceProviderProps) {
    const id = `${uniqueid}CustomResourceProvider`;
    const stack = Stack.of(scope);
    const provider = stack.node.tryFindChild(id) as CustomResourceProvider
      ?? new CustomResourceProvider(stack, id, props);
    return provider;
  }

  protected constructor(scope: Construct, id: string, props: CustomResourceProviderProps) {
    super(scope, id, {
      ...props,
      runtimeName: customResourceProviderRuntimeToString(props.runtime),
    });
  }
}

function customResourceProviderRuntimeToString(x: CustomResourceProviderRuntime): string {
  switch (x) {
    case CustomResourceProviderRuntime.NODEJS_12:
    case CustomResourceProviderRuntime.NODEJS_12_X:
      return 'nodejs12.x';
    case CustomResourceProviderRuntime.NODEJS_14_X:
      return 'nodejs14.x';
    case CustomResourceProviderRuntime.NODEJS_16_X:
      return 'nodejs16.x';
    case CustomResourceProviderRuntime.NODEJS_18_X:
      return 'nodejs18.x';
  }
}
