import * as cdk from '@aws-cdk/cdk';
import { CfnVirtualRouter } from './appmesh.generated';
import { Mesh } from './mesh';
import { NAME_TAG, PortMappingProps, Protocol } from './shared-interfaces';
import { AddVirtualRouteProps, VirtualRoute } from './virtual-route';

// TODO: Add import() and eport() capabilities

export interface VirtualRouterBaseProps {
  readonly portMappings: PortMappingProps[];
}

export interface VirtualRouterProps extends VirtualRouterBaseProps {
  readonly mesh: Mesh;
  readonly name?: string;
}

export class VirtualRouter extends cdk.Construct {
  public readonly virtualRouterName: string;
  public readonly virtualRouterMeshName: string;
  public readonly virtualRouterArn: string;
  public readonly mesh: Mesh;
  public readonly routes: VirtualRoute[] = [];

  private readonly listeners: CfnVirtualRouter.VirtualRouterListenerProperty[] = [];

  constructor(scope: cdk.Construct, id: string, props: VirtualRouterProps) {
    super(scope, id);

    this.mesh = props.mesh;

    this.node.apply(new cdk.Tag(NAME_TAG, this.node.path));
    const name = props && props.name ? props.name : this.node.id;

    this.addListeners(props);

    const router = new CfnVirtualRouter(this, 'VirtualRouter', {
      virtualRouterName: name,
      meshName: this.mesh.meshName,
      spec: {
        listeners: this.listeners,
      },
    });

    this.virtualRouterName = router.virtualRouterName;
    this.virtualRouterArn = router.virtualRouterArn;
    this.virtualRouterMeshName = router.virtualRouterMeshName;
  }

  public addRoute(id: string, props: AddVirtualRouteProps) {
    const route = new VirtualRoute(this, id, {
      name: id,
      mesh: this.mesh,
      router: this,
      routeTargets: props.routeTargets,
      isHttpRoute: props.isHttpRoute,
      prefix: props.prefix,
    });
    this.routes.push(route);

    return route;
  }

  private addListeners(props: VirtualRouterBaseProps) {
    if (props && props.portMappings) {
      this.addPortMappings(props.portMappings);
    } else {
      const portMappings = [{ port: 8080, protocol: Protocol.HTTP }];
      this.addPortMappings(portMappings);
    }
  }

  private addPortMappings(props: PortMappingProps[]) {
    props.forEach(p => {
      this.listeners.push({
        portMapping: {
          port: p.port,
          protocol: p.protocol,
        },
      });
    });
  }
}
