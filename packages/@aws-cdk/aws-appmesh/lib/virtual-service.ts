import * as cdk from '@aws-cdk/cdk';
import { CfnVirtualService } from './appmesh.generated';
import { NAME_TAG } from './shared-interfaces';

// TODO: Add import() and eport() capabilities

/**
 * The base properties which all classes in VirtualService will inherit from
 */
export interface VirtualServiceBaseProps {
  /**
   * The name of the VirtualService, it is recommended this follows the fully-qualified domain name format.
   *
   * @example service.domain.local
   */
  readonly virtualServiceName?: string;
  readonly virtualRouterName: string;
}

export interface VirtualServiceProps extends VirtualServiceBaseProps {
  readonly meshName: string;
}

export class VirtualService extends cdk.Construct {
  public readonly meshName: string;
  public readonly virtualRouterName: string;
  public readonly virtualServiceName: string;
  public readonly virtaulServiceMeshName: string;
  public readonly virtaulServiceArn: string;

  constructor(scope: cdk.Construct, id: string, props: VirtualServiceProps) {
    super(scope, id);

    this.meshName = props.meshName;
    this.virtualRouterName = props.virtualRouterName;

    this.node.apply(new cdk.Tag(NAME_TAG, this.node.path));
    const name = props.virtualServiceName || id;

    const svc = new CfnVirtualService(this, 'VirtualService', {
      meshName: this.meshName,
      virtualServiceName: name,
      spec: {
        provider: {
          virtualRouter: {
            virtualRouterName: this.virtualRouterName,
          },
        },
      },
    });

    this.virtaulServiceArn = svc.virtualServiceArn;
    this.virtualServiceName = svc.virtualServiceName;
    this.virtaulServiceMeshName = svc.virtualServiceMeshName;
  }
}
