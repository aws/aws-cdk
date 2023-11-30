import { Construct } from 'constructs';
import { CdkHandler } from './cdk-handler';
import { Stack, CustomResourceProviderBase, CustomResourceProviderOptions } from '../../core';

/**
 * Initialization properties for `CdkCustomResourceProvider`
 */
export interface CdkCustomResourceProviderProps extends CustomResourceProviderOptions {
  /**
   * The source code, compatible runtimes, and the method within your code that Lambda calls to execute your function.
   */
  readonly handler: CdkHandler
}

export class CdkCustomResourceProvider extends CustomResourceProviderBase {
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
  public static getOrCreate(scope: Construct, uniqueid: string, props: CdkCustomResourceProviderProps) {
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
   * @returns the custom resource provider.
   */
  public static getOrCreateProvider(scope: Construct, uniqueid: string, props: CdkCustomResourceProviderProps) {
    const id = `${uniqueid}CustomResourceProvider`;
    const stack = Stack.of(scope);
    const provider = stack.node.tryFindChild(id) as CdkCustomResourceProvider
      ?? new CdkCustomResourceProvider(stack, id, props);
    return provider;
  }

  protected constructor(scope: Construct, id: string, props: CdkCustomResourceProviderProps) {
    super(scope, id, {
      ...props,
      codeDirectory: props.handler.codeDirectory,
      runtimeName: props.handler.runtime.name,
    });
  }
}
