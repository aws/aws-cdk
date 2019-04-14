import * as cdk from '@aws-cdk/cdk';
import { CfnVirtualService } from './appmesh.generated';
import { Mesh } from './mesh';
import { NAME_TAG } from './shared-interfaces';
import { VirtualRouter } from './virtual-router';

// TODO: Add import() and eport() capabilities

export interface VirtualServiceBaseProps {
  readonly virtualServiceName?: string;
  readonly virtualRouter: VirtualRouter;
}

export interface VirtualServiceProps extends VirtualServiceBaseProps {
  readonly mesh: Mesh;
}

export class VirtualService extends cdk.Construct {
  public readonly mesh: Mesh;
  public readonly router: VirtualRouter;
  public readonly virtualServiceName: string;
  public readonly virtaulServiceMeshName: string;
  public readonly virtaulServiceArn: string;

  constructor(scope: cdk.Construct, id: string, props: VirtualServiceProps) {
    super(scope, id);

    this.mesh = props.mesh;
    this.router = props.virtualRouter;

    this.node.apply(new cdk.Tag(NAME_TAG, this.node.path));
    const name = props.virtualServiceName || id;

    const svc = new CfnVirtualService(this, 'VirtualService', {
      meshName: this.mesh.meshName,
      virtualServiceName: name,
      spec: {
        provider: {
          virtualRouter: {
            virtualRouterName: this.router.virtualRouterName,
          },
        },
      },
    });

    this.virtaulServiceArn = svc.virtualServiceArn;
    this.virtualServiceName = svc.virtualServiceName;
    this.virtaulServiceMeshName = svc.virtualServiceMeshName;
  }
}
