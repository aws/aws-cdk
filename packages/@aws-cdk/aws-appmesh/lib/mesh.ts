import cdk = require('@aws-cdk/cdk');

import { CfnMesh } from './appmesh.generated';
import { ListenerProps, NAME_TAG } from './shared-interfaces';
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
  readonly namespaceName: string;
  /**
   * The backend services this node expects to send traffic to
   *
   * @default none
   */
  readonly backends?: VirtualNodeBackendProps[];
  /**
   * @default none
   * if not specified must call addListeners(), addPortMappings() or addPortAndHealthCheckMappings()
   */
  readonly listeners?: ListenerProps;
}

/**
 * A utility enum defined for the egressFilter type property, the default of DROP_ALL,
 * allows traffic only to other resources inside the mesh, or API calls to amazon resources.
 *
 * @default Drop_All
 */
export enum MeshFilterType {
  /**
   * Allows all outbound traffic
   */
  Allow_All = 'ALLOW_ALL',
  /**
   * Allows traffic only to other resources inside the mesh, or API calls to amazon resources
   */
  Drop_All = 'DROP_ALL',
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
 * Used for importing and exporting Mesh(es)
 */
export interface MeshImportProps {
  /**
   * The AppMesh name to import
   */
  readonly meshName: string;
  /**
   * The Amazon Resource Name (ARN) of the AppMesh mesh
   */
  readonly meshArn: string;
  /**
   * The unique identifier for the mesh
   */
  readonly meshUid: string;
}

/**
 * Interface wich all Mesh based classes MUST implement
 */
export interface IMesh extends cdk.IConstruct {
  /**
   * The name of the AppMesh mesh
   */
  readonly meshName: string;
  /**
   * The Amazon Resource Name (ARN) of the AppMesh mesh
   */
  readonly meshArn: string;
  /**
   * The unique identifier for the mesh
   */
  readonly meshUid: string;
  /**
   * Adds a VirtualRouter to the Mesh with the given id and props
   *
   * @param id the name for the virtual router
   * @param props set of VirtualRouterBaseProps to apply to the virtual router
   */
  addVirtualRouter(id: string, props: VirtualRouterBaseProps): VirtualRouter;
  /**
   * Adds a VirtualService with the given id
   *
   * @param id the name for the given service
   * @param props a set of VirtualServiceBaseProps to define the service
   */
  addVirtualService(id: string, props: VirtualServiceBaseProps): VirtualService;
  /**
   * Adds a VirtualNode to the Mesh
   *
   * @param id the name for the VirtualNode
   * @param props a set of AddVirtualNodeProps
   */
  addVirtualNode(id: string, props: AddVirtualNodeProps): VirtualNode;
  /**
   * Exports the Mesh properties to re-use in other stacks
   */
  export(): MeshImportProps;
}

/**
 * Represents a new or imported AppMesh mesh
 *
 * @example cdk.Construct
 * @implements IMesh
 */
export abstract class MeshBase extends cdk.Construct implements IMesh {
  /**
   * The name of the AppMesh mesh
   *
   * @abstract
   * @type {string}
   * @memberof MeshBase
   */
  public abstract readonly meshName: string;
  /**
   * The Amazon Resource Name (ARN) of the AppMesh mesh
   *
   * @abstract
   * @type {string}
   * @memberof MeshBase
   */
  public abstract readonly meshArn: string;

  /**
   * The unique identifier for the mesh
   *
   * @abstract
   * @type {string}
   * @memberof MeshBase
   */
  public abstract readonly meshUid: string;

  /**
   * Adds a VirtualRouter to the Mesh with the given id and props
   *
   * @param {string} id
   * @param {VirtualRouterBaseProps} props
   * @returns {VirtualRouter}
   * @memberof MeshBase
   */
  public addVirtualRouter(id: string, props: VirtualRouterBaseProps): VirtualRouter {
    return new VirtualRouter(this, id, {
      meshName: this.meshName,
      virtualRouterName: props.virtualRouterName,
      portMappings: props.portMappings,
    });
  }

  /**
   * Adds a VirtualService with the given id
   *
   * @param {string} id
   * @param {VirtualServiceBaseProps} props
   * @returns {VirtualService}
   * @memberof MeshBase
   */
  public addVirtualService(id: string, props: VirtualServiceBaseProps): VirtualService {
    return new VirtualService(this, id, {
      ...props,
      meshName: this.meshName,
    });
  }

  /**
   * Adds a VirtualNode to the Mesh
   *
   * @param {string} id
   * @param {AddVirtualNodeProps} props
   * @returns {VirtualNode}
   * @memberof MeshBase
   */
  public addVirtualNode(id: string, props: AddVirtualNodeProps): VirtualNode {
    return new VirtualNode(this, id, {
      ...props,
      meshName: this.meshName,
      namespaceName: props.namespaceName,
    });
  }

  /**
   * Exports the Mesh properties to re-use in other stacks
   */
  public abstract export(): MeshImportProps;
}

/**
 * The set of properties used when creating a Mesh
 */
export interface MeshProps {
  /**
   * The name of the Mesh being defined
   */
  readonly meshName?: string;
  /**
   * The spec to be applied to the mesh, at this point, only egressFilter is available
   */
  readonly meshSpec?: MeshSpec;
}

/**
 * Defines a new AppMesh mesh
 *
 * @see https://docs.aws.amazon.com/app-mesh/latest/userguide/meshes.html
 */
export class Mesh extends MeshBase {
  /**
   * A static method to import a mesh an make it re-usable accross stacks
   *
   * @static
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {MeshImportProps} props
   * @returns {IMesh}
   * @memberof Mesh
   */
  public static import(scope: cdk.Construct, id: string, props: MeshImportProps): IMesh {
    return new ImportedMesh(scope, id, props);
  }

  /**
   * The name of the AppMesh mesh
   *
   * @type {string}
   * @memberof Mesh
   */
  public readonly meshName: string;
  /**
   * The Amazon Resource Name (ARN) of the AppMesh mesh
   *
   * @type {string}
   * @memberof Mesh
   */
  public readonly meshArn: string;

  /**
   * The unique identifier for the mesh
   *
   * @type {string}
   * @memberof Mesh
   */
  public readonly meshUid: string;

  constructor(scope: cdk.Construct, id: string, props?: MeshProps) {
    super(scope, id);

    this.node.apply(new cdk.Tag(NAME_TAG, this.node.path));

    const name = props && props.meshName ? props.meshName : this.node.id;

    let filter: MeshFilterType;
    if (props && props.meshSpec && props.meshSpec.egressFilter) {
      filter = props.meshSpec.egressFilter;
    } else {
      filter = MeshFilterType.Drop_All;
    }

    const mesh = new CfnMesh(this, 'AppMesh', {
      meshName: name,
      spec: {
        egressFilter: {
          type: filter,
        },
      },
    });

    this.meshName = mesh.meshName;
    this.meshArn = mesh.meshArn;
    this.meshUid = mesh.meshUid;
  }

  /**
   * Exports the Mesh properties to re-use in other stacks
   *
   * @returns {MeshImportProps}
   * @memberof Mesh
   */
  public export(): MeshImportProps {
    return {
      meshName: this.meshName,
      meshArn: this.meshArn,
      meshUid: this.meshUid,
    };
  }
}

/**
 * Use when import is called on Mesh.import(), returns properties that allows the mesh to be used
 * accross stacks.
 *
 * @extends MeshBase
 * @implements IMesh
 */
export class ImportedMesh extends MeshBase {
  /**
   * The name of the AppMesh mesh
   *
   * @type {string}
   * @memberof ImportedMesh
   */
  public readonly meshName: string;
  /**
   * The Amazon Resource Name (ARN) of the AppMesh mesh
   *
   * @type {string}
   * @memberof Mesh
   */
  public readonly meshArn: string;
  /**
   * The unique identifier for the mesh
   *
   * @type {string}
   * @memberof ImportedMesh
   */
  public readonly meshUid: string;

  constructor(scope: cdk.Construct, id: string, props: MeshImportProps) {
    super(scope, id);

    this.meshName = props.meshName;
    this.meshArn = props.meshArn;
    this.meshUid = props.meshUid;
  }

  /**
   * Exports the Mesh properties to re-use in other stacks
   */
  public export(): MeshImportProps {
    return {
      meshName: this.meshName,
      meshArn: this.meshArn,
      meshUid: this.meshUid,
    };
  }
}
