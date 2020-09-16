import * as appmesh from '@aws-cdk/aws-appmesh';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import { Service } from '../service';
import { Container } from './container';
import { ServiceExtension, ServiceBuild } from './extension-interfaces';

/**
 * The settings for the App Mesh extension
 */
export interface MeshProps {
  /**
   * The service mesh into which to register the service
   */
  readonly mesh: appmesh.Mesh;

  /**
   * The protocol of the service: Protocol.HTTP, Protocol.HTTP2,
   * Protocol.TCP, Protocol.GRPC
   * @default - Protocol.HTTP
   */
  readonly protocol?: appmesh.Protocol;
}

/**
 * This extension adds an Envoy sidecar to the task definition and
 * creates the App Mesh resources required to route network traffic
 * to the container in a service mesh
 */
export class AppMeshExtension extends ServiceExtension {
  protected virtualNode!: appmesh.VirtualNode;
  protected virtualService!: appmesh.VirtualService;
  protected virtualRouter!: appmesh.VirtualRouter;
  protected route!: appmesh.Route;
  private mesh: appmesh.Mesh;

  /**
   * The protocol of the service, for App Mesh routing purposes.
   */
  public readonly protocol: appmesh.Protocol;

  constructor(props: MeshProps) {
    super('appmesh');
    this.mesh = props.mesh;

    if (props.protocol) {
      this.protocol = props.protocol;
    } else {
      this.protocol = appmesh.Protocol.HTTP;
    }
  }

  public prehook(service: Service, scope: cdk.Construct) {
    this.parentService = service;
    this.scope = scope;

    // Make sure that the parent cluster for this service has
    // a namespace attached.
    if (!this.parentService.cluster.defaultCloudMapNamespace) {
      this.parentService.cluster.addDefaultCloudMapNamespace({
        name: 'internal',
      });
    }
  }

  public mutateTaskDefinitionProps(props: ecs.TaskDefinitionProps) {
    // Find the app extension, to get its port
    const containerextension = this.parentService.serviceDescription.get('service-container') as Container;

    if (!containerextension) {
      throw new Error('Appmesh extension requires an application extension');
    }

    return {
      ...props,

      // App Mesh requires AWS VPC networking mode so that each
      // task can have its own IP address
      networkMode: ecs.NetworkMode.AWS_VPC,

      // This configures the envoy container as a proxy for all
      // traffic going into and out of the task, with a few exceptions
      // for metadata endpoints or other ports that need direct
      // communication
      proxyConfiguration: new ecs.AppMeshProxyConfiguration({
        containerName: 'envoy',
        properties: {
          appPorts: [containerextension.trafficPort],
          proxyEgressPort: 15001,
          proxyIngressPort: 15000,
          ignoredUID: 1337,
          ignoredGID: 1338,
          egressIgnoredIPs: [
            '169.254.170.2', // Allow services to talk directly to ECS metadata endpoints
            '169.254.169.254', // and EC2 instance endpoint
          ],
          // Note that at some point we will need other extensions like
          // MySQL to be able to add their ports to this egress ignored
          // ports automatically.
          egressIgnoredPorts: [
          ],
        },
      }),
    } as ecs.TaskDefinitionProps;
  }

  public useTaskDefinition(taskDefinition: ecs.TaskDefinition) {
    var region = cdk.Stack.of(this.scope).region;
    var appMeshRepo;
    var ownerAccount;

    // This is currently necessary because App Mesh has different images in each region,
    // and some regions have their images in a different account. See:
    // https://docs.aws.amazon.com/app-mesh/latest/userguide/envoy.html
    if (region === 'me-south-1') {
      ownerAccount = 772975370895;
    } else if (region === 'ap-east-1') {
      ownerAccount = 856666278305;
    } else {
      ownerAccount = 840364872350;
    }

    appMeshRepo = ecr.Repository.fromRepositoryArn(
      this.scope,
      `${this.parentService.id}-envoy-repo`,
      `arn:aws:ecr:us-east-1:${ownerAccount}:repository/aws-appmesh-envoy`,
    );

    this.container = taskDefinition.addContainer('envoy', {
      image: ecs.ContainerImage.fromEcrRepository(appMeshRepo, 'v1.15.0.0-prod'),
      essential: true,
      environment: {
        APPMESH_VIRTUAL_NODE_NAME: `mesh/${this.mesh.meshName}/virtualNode/${this.parentService.id}`,
        AWS_REGION: cdk.Stack.of(this.parentService).region,
        ENABLE_ENVOY_STATS_TAGS: '1',
        ENABLE_ENVOY_DOG_STATSD: '1',
      },
      healthCheck: {
        command: [
          'CMD-SHELL',
          'curl -s http://localhost:9901/server_info | grep state | grep -q LIVE',
        ],
        startPeriod: cdk.Duration.seconds(10),
        interval: cdk.Duration.seconds(5),
        timeout: cdk.Duration.seconds(2),
      },
      memoryReservationMiB: 128,
      user: '1337',
      logging: new ecs.AwsLogDriver({ streamPrefix: 'envoy' }),
    });

    // Raise the number of open file descriptors allowed.
    this.container.addUlimits({
      softLimit: 1024000,
      hardLimit: 1024000,
      name: ecs.UlimitName.NOFILE,
    });
  }

  // Enable cloudmap for the service
  public mutateServiceProps(props: ServiceBuild) {
    var maxPercent;

    // Based on the desired count of tasks, adjust
    // the maximum task rolling speed, by constraining
    // the maximum number of health tasks. See:
    // https://docs.aws.amazon.com/app-mesh/latest/userguide/best-practices.html#reduce-deployment-velocity
    if (!props.desiredCount || props.desiredCount < 4) {
      maxPercent = 150;
    } else {
      maxPercent = 125;
    }

    return {
      ...props,

      // We must make sure that service tasks are registered into
      // CloudMap so that the App Mesh proxy can find them.
      cloudMapOptions: {
        dnsRecordType: 'A',
        dnsTtl: cdk.Duration.seconds(10),
        failureThreshold: 2,
        name: this.parentService.id,
      },

      // These specific deployment settings are currently required in order to
      // maintain availability during a rolling deploy of the service with App Mesh
      // https://docs.aws.amazon.com/app-mesh/latest/userguide/best-practices.html#reduce-deployment-velocity
      minHealthyPercent: 100,
      maxHealthyPercent: maxPercent,
    } as ServiceBuild;
  }

  // Now that the service is defined we can create the AppMesh virtual service
  // and virtual node for the real service
  public useService(service: ecs.Ec2Service | ecs.FargateService) {
    const containerextension = this.parentService.serviceDescription.get('service-container') as Container;

    if (!containerextension) {
      throw new Error('Firelens extension requires an application extension');
    }

    const cloudmapNamespace = this.parentService.cluster.defaultCloudMapNamespace;

    if (!cloudmapNamespace) {
      throw new Error('You must add a CloudMap namespace to the ECS cluster in order to use the AppMesh extension');
    }

    // Create a virtual node for the name service
    this.virtualNode = new appmesh.VirtualNode(this.scope, `${this.parentService.id}-virtual-node`, {
      mesh: this.mesh,
      virtualNodeName: this.parentService.id,
      cloudMapService: service.cloudMapService,
      listener: {
        portMapping: {
          port: containerextension.trafficPort,
          protocol: this.protocol,
        },
      },
    });

    // Create a virtual router for this service. This allows for retries
    // and other similar behaviors.
    this.virtualRouter = new appmesh.VirtualRouter(this.scope, `${this.parentService.id}-virtual-router`, {
      mesh: this.mesh,
      listener: {
        portMapping: {
          port: containerextension.trafficPort,
          protocol: this.protocol,
        },
      },
      virtualRouterName: `${this.parentService.id}`,
    });

    // Now add the virtual node as a route in the virtual router
    this.route = this.virtualRouter.addRoute(`${this.parentService.id}-route`, {
      routeTargets: [{
        virtualNode: this.virtualNode,
        weight: 1,
      }],
      // Ensure that the route type matches the protocol type.
      routeType: this.protocol == appmesh.Protocol.HTTP ? appmesh.RouteType.HTTP : appmesh.RouteType.TCP,
    });

    // Now create a virtual service. Relationship goes like this:
    // virtual service -> virtual router -> virtual node
    this.virtualService = new appmesh.VirtualService(this.scope, `${this.parentService.id}-virtual-service`, {
      mesh: this.mesh,
      virtualRouter: this.virtualRouter,
      virtualServiceName: `${this.parentService.id}.${cloudmapNamespace.namespaceName}`,
    });
  }

  // Connect the app mesh extension for this service to an app mesh
  // extension on another service.
  public connectToService(otherService: Service) {
    const otherAppMesh = otherService.serviceDescription.get('appmesh') as AppMeshExtension;
    const otherContainer = otherService.serviceDescription.get('service-container') as Container;

    // First allow this service to talk to the other service
    // at a network level. This opens the security groups so that
    // the security groups of these two services to each other
    this.parentService.service.connections.allowTo(
      otherService.service,
      ec2.Port.tcp(otherContainer.trafficPort),
      `Accept inbound traffic from ${this.parentService.id}`,
    );

    // Next update the app mesh config so that the local Envoy
    // proxy on this service knows how to route traffic to
    // nodes from the other service.
    this.virtualNode.addBackends(otherAppMesh.virtualService);
  }
}