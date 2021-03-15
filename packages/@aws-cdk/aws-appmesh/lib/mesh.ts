import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnMesh } from './appmesh.generated';
import { VirtualGateway, VirtualGatewayBaseProps } from './virtual-gateway';
import { VirtualNode, VirtualNodeBaseProps } from './virtual-node';
import { VirtualRouter, VirtualRouterBaseProps } from './virtual-router';

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
 * Interface wich all Mesh based classes MUST implement
 */
export interface IMesh extends cdk.IResource {
  /**
   * The name of the AppMesh mesh
   *
   * @attribute
   */
  readonly meshName: string;

  /**
   * The Amazon Resource Name (ARN) of the AppMesh mesh
   *
   * @attribute
   */
  readonly meshArn: string;

  /**
   * Adds a VirtualRouter to the Mesh with the given id and props
   */
  addVirtualRouter(id: string, props?: VirtualRouterBaseProps): VirtualRouter;

  /**
   * Adds a VirtualNode to the Mesh
   */
  addVirtualNode(id: string, props?: VirtualNodeBaseProps): VirtualNode;

  /**
   * Adds a VirtualGateway to the Mesh
   */
  addVirtualGateway(id: string, props?: VirtualGatewayBaseProps): VirtualGateway;

  /**
   * Grants the given entity permissions to read all resources in the mesh.
   */
  grantReadOnlyAllMeshResources(identity: iam.IGrantable): iam.Grant;

  /**
   * Grants the given entity all permissions for this mesh.
   */
  grantAll(identity: iam.IGrantable): iam.Grant;

  /**
   * Grant the specified actions for this mesh.
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;
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
  public addVirtualRouter(id: string, props: VirtualRouterBaseProps = {}): VirtualRouter {
    return new VirtualRouter(this, id, {
      ...props,
      mesh: this,
    });
  }

  /**
   * Adds a VirtualNode to the Mesh
   */
  public addVirtualNode(id: string, props: VirtualNodeBaseProps = {}): VirtualNode {
    return new VirtualNode(this, id, {
      ...props,
      mesh: this,
    });
  }

  /**
   * Adds a VirtualGateway to the Mesh
   */
  addVirtualGateway(id: string, props?: VirtualGatewayBaseProps): VirtualGateway {
    return new VirtualGateway(this, id, {
      ...props,
      mesh: this,
    });
  }

  public grantReadOnlyAllMeshResources(identity: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee: identity,
      actions: [
        'appmesh:DescribeMesh',
        'appmesh:ListMeshes',
        'appmesh:DescribeVirtualService',
        'appmesh:ListVirtualServices',
        'appmesh:DescribeVirtualRouter',
        'appmesh:ListVirtualRouter',
        'appmesh:DescribeRoute',
        'appmesh:ListRoutes',
        'appmesh:DescribeVirtualNode',
        'appmesh:ListVirtualNodes',
        'appmesh:DescribeVirtualGateway',
        'appmesh:ListVirtualGateways',
        'appmesh:DescribeGatewayRoute',
        'appmesh:ListGatewayRoutes',
      ],
      resourceArns: [this.meshArn + '/*'],
    });
  }

  public grantAll(identity: iam.IGrantable): iam.Grant {
    return this.grant(identity,
      'appmesh:DescribeMesh',
      'appmesh:UpdateMesh',
      'appmesh:DeleteMesh',
      'appmesh:TagResource',
      'appmesh:UntagResource',
    );
  }

  public grant(grantee: iam.IGrantable, ...actions: string[]) {
    return iam.Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.meshArn],
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
   * Egress filter to be applied to the Mesh
   *
   * @default DROP_ALL
   */
  readonly egressFilter?: MeshFilterType;
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
  public static fromMeshArn(scope: Construct, id: string, meshArn: string): IMesh {
    const parts = cdk.Stack.of(scope).parseArn(meshArn);

    class Import extends MeshBase {
      public meshName = parts.resourceName || '';
      public meshArn = meshArn;
    }

    return new Import(scope, id);
  }

  /**
   * Import an existing mesh by name
   */
  public static fromMeshName(scope: Construct, id: string, meshName: string): IMesh {
    const arn = cdk.Stack.of(scope).formatArn({
      service: 'appmesh',
      resource: 'mesh',
      resourceName: meshName,
    });

    class Import extends MeshBase {
      public meshName = meshName;
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

  constructor(scope: Construct, id: string, props: MeshProps = {}) {
    super(scope, id, {
      physicalName: props.meshName || cdk.Lazy.string({ produce: () => cdk.Names.uniqueId(this) }),
    });

    const mesh = new CfnMesh(this, 'Resource', {
      meshName: this.physicalName,
      spec: {
        egressFilter: props.egressFilter ? {
          type: props.egressFilter,
        } : undefined,
      },
    });

    this.meshName = this.getResourceNameAttribute(mesh.attrMeshName);
    this.meshArn = this.getResourceArnAttribute(mesh.ref, {
      service: 'appmesh',
      resource: 'mesh',
      resourceName: this.physicalName,
    });
  }
}
