import { INamespace } from '@aws-cdk/aws-servicediscovery';
import cdk = require('@aws-cdk/core');

import { CfnMesh } from './appmesh.generated';
import { ListenerProps } from './shared-interfaces';
import { VirtualNode, VirtualNodeBackendProps } from './virtual-node';
import { VirtualRouter, VirtualRouterBaseProps } from './virtual-router';
import { VirtualService, VirtualServiceBaseProps } from './virtual-service';

/**
 * These properties are used when adding a VirtualNode through the Mesh type
 */
export interface AddVirtualNodeProps {
  /**
   * The name of the VirtualNode, only used as identifier
   *
   * @default optional if not provided, the id property will be used
   */
  readonly nodeName?: string;

  /**
   * The hostname for which to identify the VirtualNode, NOT the full FQDN
   *
   * @example serviceb NOT serviceb.domain.local
   */
  readonly hostname: string;

  /**
   * The service discovery namespace name
   * @example domain.local
   */
  readonly namespace: INamespace;

  /**
   * The backend services this node expects to send traffic to
   *
   * @default none
   */
  readonly backends?: VirtualNodeBackendProps[];

  /**
   * @default none
   * if not specified must call addListener(), addPortMappings() or addPortAndHealthCheckMappings()
   */
  readonly listener?: ListenerProps;
}

/**
 * A utility enum defined for the egressFilter type property, the default of DROP_ALL,
 * allows traffic only to other resources inside the mesh, or API calls to amazon resources.
 *
 * @default DROP_ALL
 */
export enum MeshFilterType {
  /**
   * Allows all outbound traffic
   */
  ALLOW_ALL = 'ALLOW_ALL',
  /**
   * Allows traffic only to other resources inside the mesh, or API calls to amazon resources
   */
  DROP_ALL = 'DROP_ALL',
}

/**
 * Used to populate the spec property for the mesh, only available option today is egressFilter
 *
 */
export interface MeshSpec {
  /**
   * Egress filter to be applied to the Mesh
   *
   * @default DROP_ALL
   */
  readonly egressFilter?: MeshFilterType;
}

/**
 * Interface wich all Mesh based classes MUST implement
 */
export interface IMesh extends cdk.IResource {
  /**
   * The name of the AppMesh mesh
   */
  readonly meshName: string;

  /**
   * The Amazon Resource Name (ARN) of the AppMesh mesh
   */
  readonly meshArn: string;

  /**
   * Adds a VirtualRouter to the Mesh with the given id and props
   */
  addVirtualRouter(id: string, props: VirtualRouterBaseProps): VirtualRouter;

  /**
   * Adds a VirtualService with the given id
   */
  addVirtualService(id: string, props: VirtualServiceBaseProps): VirtualService;

  /**
   * Adds a VirtualNode to the Mesh
   */
  addVirtualNode(id: string, props: AddVirtualNodeProps): VirtualNode;
}

/**
 * Represents a new or imported AppMesh mesh
 */
abstract class MeshBase extends cdk.Resource implements IMesh {
  /**
   * The name of the AppMesh mesh
   */
  public abstract readonly meshName: string;

  /**
   * The Amazon Resource Name (ARN) of the AppMesh mesh
   */
  public abstract readonly meshArn: string;

  /**
   * Adds a VirtualRouter to the Mesh with the given id and props
   */
  public addVirtualRouter(id: string, props: VirtualRouterBaseProps): VirtualRouter {
    return new VirtualRouter(this, id, {
      mesh: this,
      virtualRouterName: props.virtualRouterName,
      portMappings: props.portMappings,
    });
  }

  /**
   * Adds a VirtualService with the given id
   */
  public addVirtualService(id: string, props: VirtualServiceBaseProps): VirtualService {
    return new VirtualService(this, id, {
      ...props,
      mesh: this,
    });
  }

  /**
   * Adds a VirtualNode to the Mesh
   */
  public addVirtualNode(id: string, props: AddVirtualNodeProps): VirtualNode {
    return new VirtualNode(this, id, {
      ...props,
      mesh: this,
      namespace: props.namespace,
    });
  }
}

/**
 * The set of properties used when creating a Mesh
 */
export interface MeshProps {
  /**
   * The name of the Mesh being defined
   *
   * @default - A name is autmoatically generated
   */
  readonly meshName?: string;

  /**
   * The spec to be applied to the mesh
   *
   * At this point only egressFilter is available.
   */
  readonly meshSpec?: MeshSpec;
}

/**
 * Define a new AppMesh mesh
 *
 * @see https://docs.aws.amazon.com/app-mesh/latest/userguide/meshes.html
 */
export class Mesh extends MeshBase {
  /**
   * Import an existing mesh by arn
   */
  public static fromMeshArn(scope: cdk.Construct, id: string, arn: string): IMesh {
    const parts = cdk.Stack.of(scope).parseArn(arn);

    class Import extends MeshBase {
      public meshName = parts.resourceName || '';
      public meshArn = arn;
    }

    return new Import(scope, id);
  }

  /**
   * Import an existing mesh by name
   */
  public static fromMeshName(scope: cdk.Construct, id: string, name: string): IMesh {
    const arn = cdk.Stack.of(scope).formatArn({
      service: 'appmesh',
      resource: 'mesh',
      resourceName: name,
    });

    class Import extends MeshBase {
      public meshName = name;
      public meshArn = arn;
    }

    return new Import(scope, id);
  }

  /**
   * The name of the AppMesh mesh
   */
  public readonly meshName: string;

  /**
   * The Amazon Resource Name (ARN) of the AppMesh mesh
   */
  public readonly meshArn: string;

  constructor(scope: cdk.Construct, id: string, props: MeshProps = {}) {
    super(scope, id);

    const name = props.meshName || this.node.id;

    const filter = (props.meshSpec && props.meshSpec.egressFilter) || MeshFilterType.DROP_ALL;

    const mesh = new CfnMesh(this, 'AppMesh', {
      meshName: name,
      spec: {
        egressFilter: {
          type: filter,
        },
      },
    });

    this.meshName = mesh.meshName;
    this.meshArn = mesh.ref;
  }
}