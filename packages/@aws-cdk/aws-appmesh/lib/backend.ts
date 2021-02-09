
import { CfnVirtualNode } from './appmesh.generated';
import { ClientPolicy } from './client-policy';
import { IVirtualService } from './virtual-service';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * Represents the properties needed to define backend defaults
 */
export interface BackendDefaultsOptions {
  /**
   * Client policy for backend defaults
   *
   * @default none
   */
  readonly clientPolicy?: ClientPolicy;
}

/**
 * Represents the properties needed to define a backend
 */
export interface BackendOptions {
  /**
   * The Virtual Service this backend points to
   */
  readonly virtualService: IVirtualService;
  /**
   * Client policy for a backend
   *
   * @default none
   */
  readonly clientPolicy?: ClientPolicy;
}

/**
 * Provides static factory methods to generate backend API structures
 */
export class Backends {
  /**
   * Creates a backend defaults
   */
  public static backendDefaults(props: BackendDefaultsOptions): BackendDefaults {
    return new BackendDefaults(props.clientPolicy);
  }
  /**
   * Creates a named backend
   */
  public static backend(props: BackendOptions): Backend {
    return new Backend(props.virtualService, props.clientPolicy);
  }
}

/**
 * Represents all the backends that aren't specifically defined using the backend .
 */
export class BackendDefaults {

  constructor (private readonly clientPolicy: ClientPolicy | undefined) {}

  /**
   * Return backend defaults config
   */
  public bind(_scope: Construct): CfnVirtualNode.BackendDefaultsProperty {
    return {
      clientPolicy: this.clientPolicy?.bind(_scope).clientPolicy,
    };
  }
}

/**
 * Represents the backend that a virtual node will send outbound traffic to
 */
export class Backend {

  constructor (private readonly virtualService: IVirtualService,
    private readonly clientPolicy: ClientPolicy | undefined) {}

  /**
   * Return backend config
   */
  public bind(_scope: Construct): CfnVirtualNode.BackendProperty {
    return {
      virtualService: {
        virtualServiceName: this.virtualService.virtualServiceName,
        clientPolicy: this.clientPolicy?.bind(_scope).clientPolicy,
      },
    };
  }
}
