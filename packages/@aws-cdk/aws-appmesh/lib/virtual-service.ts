import cdk = require('@aws-cdk/cdk');

import { CfnVirtualService } from './appmesh.generated';
import { IMesh } from './mesh';
import { NAME_TAG } from './shared-interfaces';
import { IVirtualNode } from './virtual-node';
import { IVirtualRouter } from './virtual-router';

/**
 * Interface with properties ncecessary to import a reusable VirtualService
 */
export interface VirtualServiceImportProps {
  /**
   * The name of the VirtualService, it is recommended this follows the fully-qualified domain name format.
   */
  readonly virtualServiceName: string;

  /**
   * The Amazon Resource Name (ARN) for the virtual service
   */
  readonly virtualServiceArn: string;

  /**
   * The unique identifier for the virtual service
   */
  readonly virtualServiceUid: string;
}

/**
 * Represents the interface which all VirtualService based classes MUST implement
 */
export interface IVirtualService extends cdk.IConstruct {
  /**
   * The name of the VirtualService, it is recommended this follows the fully-qualified domain name format.
   */
  readonly virtualServiceName: string;

  /**
   * The Amazon Resource Name (ARN) for the virtual service
   */
  readonly virtualServiceArn: string;

  /**
   * The unique identifier for the virtual service
   */
  readonly virtualServiceUid: string;

  /**
   * Exports properties for VirtualService reusability
   */
  export(): VirtualServiceImportProps;
}

/**
 * The base properties which all classes in VirtualService will inherit from
 */
export interface VirtualServiceBaseProps {
  /**
   * The name of the VirtualService, it is recommended this follows the fully-qualified domain name format.
   *
   * @example service.domain.local
   */
  readonly virtualServiceName: string;

  /**
   * The VirtualRouter which the VirtualService uses as provider
   */
  readonly virtualRouter?: IVirtualRouter;

  /**
   * The VirtualNode attached to the virtual service
   */
  readonly virtualNode?: IVirtualNode;
}

/**
 * The properties applied to the VirtualService being define
 */
export interface VirtualServiceProps extends VirtualServiceBaseProps {
  /**
   * The AppMesh mesh name for whiich the VirtualService belongs to
   */
  readonly mesh: IMesh;
}

/**
 * Represents a new oor imported VirtualService
 */
export abstract class VirtualServiceBase extends cdk.Construct implements IVirtualService {
  /**
   * The name of the VirtualService, it is recommended this follows the fully-qualified domain name format.
   */
  public abstract readonly virtualServiceName: string;

  /**
   * The Amazon Resource Name (ARN) for the virtual service
   */
  public abstract readonly virtualServiceArn: string;

  /**
   * The unique identifier for the virtual service
   */
  public abstract readonly virtualServiceUid: string;

  /**
   * Exports properties for VirtualService reusability
   */
  public abstract export(): VirtualServiceImportProps;
}

/**
 * VirtualService represents a service inside an AppMesh
 *
 * @see https://docs.aws.amazon.com/app-mesh/latest/userguide/virtual_services.html
 */
export class VirtualService extends VirtualServiceBase {
  /**
   * A static method to import a VirtualService an make it re-usable accross stacks
   */
  public static import(scope: cdk.Construct, id: string, props: VirtualServiceImportProps): IVirtualService {
    return new ImportedVirtualService(scope, id, props);
  }

  /**
   * The name of the VirtualService, it is recommended this follows the fully-qualified domain name format.
   */
  public readonly virtualServiceName: string;

  /**
   * The Amazon Resource Name (ARN) for the virtual service
   */
  public readonly virtualServiceArn: string;

  /**
   * The unique identifier for the virtual service
   */
  public readonly virtualServiceUid: string;

  /**
   * The AppMesh mesh name for whiich the VirtualService belongs to
   */
  public readonly virtualServiceMeshName: string;

  /**
   * The name of the VirtualRouter which the VirtualService uses as provider
   */
  public readonly virtualRouterName?: string;

  /**
   * The name of the VirtualNode attached to the virtual service
   */
  public readonly virtualNodeName?: string;

  private readonly virtualServiceProvider?: CfnVirtualService.VirtualServiceProviderProperty;

  constructor(scope: cdk.Construct, id: string, props: VirtualServiceProps) {
    super(scope, id);

    if (props.virtualNode && props.virtualRouter) {
      throw new Error('Must provide only one of virtualNode or virtualRouter for the provider');
    }

    this.virtualServiceMeshName = props.mesh.meshName;

    // Check which provider to use node or router
    if (props.virtualRouter) {
      this.virtualRouterName = props.virtualRouter.virtualRouterName;
      this.virtualServiceProvider = this.addVirtualRouter(this.virtualRouterName);
    } else if (props.virtualNode) {
      this.virtualNodeName = props.virtualNode.virtualNodeName;
      this.virtualServiceProvider = this.addVirtualNode(this.virtualNodeName);
    }

    this.node.apply(new cdk.Tag(NAME_TAG, this.node.path));
    const name = props.virtualServiceName;

    const svc = new CfnVirtualService(this, 'VirtualService', {
      meshName: this.virtualServiceMeshName,
      virtualServiceName: name,
      spec: {
        provider: this.virtualServiceProvider,
      },
    });

    this.virtualServiceArn = svc.virtualServiceArn;
    this.virtualServiceName = svc.virtualServiceName;
    this.virtualServiceUid = svc.virtualServiceUid;
  }

  /**
   * Exports properties for VirtualService reusability
   */
  public export(): VirtualServiceImportProps {
    return {
      virtualServiceName: this.virtualServiceName,
      virtualServiceArn: this.virtualServiceArn,
      virtualServiceUid: this.virtualServiceUid,
    };
  }

  private addVirtualRouter(name: string): CfnVirtualService.VirtualServiceProviderProperty {
    return {
      virtualRouter: {
        virtualRouterName: name,
      },
    };
  }

  private addVirtualNode(name: string): CfnVirtualService.VirtualServiceProviderProperty {
    return {
      virtualNode: {
        virtualNodeName: name,
      },
    };
  }
}

/**
 * Returns properties that allows a VirtualService to be imported
 */
export class ImportedVirtualService extends VirtualServiceBase {
  /**
   * The name of the VirtualService, it is recommended this follows the fully-qualified domain name format.
   */
  public readonly virtualServiceName: string;

  /**
   * The Amazon Resource Name (ARN) for the virtual service
   */
  public readonly virtualServiceArn: string;

  /**
   * The unique identifier for the virtual service
   */
  public readonly virtualServiceUid: string;

  constructor(scope: cdk.Construct, id: string, props: VirtualServiceImportProps) {
    super(scope, id);

    this.virtualServiceName = props.virtualServiceName;
    this.virtualServiceArn = props.virtualServiceArn;
    this.virtualServiceUid = props.virtualServiceUid;
  }

  /**
   * Exports properties for VirtualService reusability
   */
  public export(): VirtualServiceImportProps {
    return {
      virtualServiceName: this.virtualServiceName,
      virtualServiceArn: this.virtualServiceArn,
      virtualServiceUid: this.virtualServiceUid,
    };
  }
}
