import { Construct } from 'constructs';
import { CustomResourceProviderBase } from './custom-resource-provider-base';
import { CustomResourceProviderOptions } from './shared';
import { CdkHandler } from '../../../handler-framework/lib/cdk-handler';
import { Stack } from '../stack';

/**
 * Initialization properties for `CdkCustomResourceProvider`
 */
export interface CdkCustomResourceProviderProps extends CustomResourceProviderOptions {
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
   * @returns the service token of the custom resource provider, which should be
   * used when defining a `CustomResource`.
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
      codeDirectory: props.handler.entrypoint,
      runtimeName: props.handler.runtime.name,
    });
  }
}
