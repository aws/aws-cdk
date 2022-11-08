import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IBuild } from './build';
import { FleetBase, FleetProps, IFleet } from './fleet-base';
import { CfnFleet } from './gamelift.generated';
import { Port, IPeer, IngressRule } from './ingress-rule';

/**
 * Represents a GameLift Fleet used to run a custom game build.
 */
export interface IBuildFleet extends IFleet {}

/**
 * Properties for a new Gamelift build fleet
 */
export interface BuildFleetProps extends FleetProps {

  /**
     * A build to be deployed on the fleet.
     * The build must have been successfully uploaded to Amazon GameLift and be in a `READY` status.
     *
     * This fleet setting cannot be changed once the fleet is created.
     */
  readonly content: IBuild;

  /**
   * The allowed IP address ranges and port settings that allow inbound traffic to access game sessions on this fleet.
   *
   * This property must be set before players can connect to game sessions.
   *
   * @default no inbound traffic allowed
   */
  readonly ingressRules?: IngressRule[];
}

/**
 * A fleet contains Amazon Elastic Compute Cloud (Amazon EC2) instances that GameLift hosts.
 * A fleet uses the configuration and scaling logic that you define to run your game server build. You can use a fleet directly without a queue.
 * You can also associate multiple fleets with a GameLift queue.
 *
 * For example, you can use Spot Instance fleets configured with your preferred locations, along with a backup On-Demand Instance fleet with the same locations.
 * Using multiple Spot Instance fleets of different instance types reduces the chance of needing On-Demand Instance placement.
 *
 * @resource AWS::GameLift::Fleet
 */
export class BuildFleet extends FleetBase implements IBuildFleet {

  /**
   * Import an existing fleet from its identifier.
   */
  static fromBuildFleetId(scope: Construct, id: string, buildFleetId: string): IBuildFleet {
    return this.fromFleetAttributes(scope, id, { fleetId: buildFleetId });
  }

  /**
   * Import an existing fleet from its ARN.
   */
  static fromBuildFleetArn(scope: Construct, id: string, buildFleetArn: string): IBuildFleet {
    return this.fromFleetAttributes(scope, id, { fleetArn: buildFleetArn });
  }

  /**
   * The Identifier of the fleet.
   */
  public readonly fleetId: string;

  /**
   * The ARN of the fleet.
   */
  public readonly fleetArn: string;

  /**
   * The build content of the fleet
   */
  public readonly content: IBuild;

  /**
   * The IAM role GameLift assumes by fleet instances to access AWS ressources.
   */
  public readonly role: iam.IRole;

  /**
   * The principal this GameLift fleet is using.
   */
  public readonly grantPrincipal: iam.IPrincipal;

  private readonly ingressRules: IngressRule[] = [];

  constructor(scope: Construct, id: string, props: BuildFleetProps) {
    super(scope, id, {
      physicalName: props.fleetName,
    });

    if (!cdk.Token.isUnresolved(props.fleetName)) {
      if (props.fleetName.length > 1024) {
        throw new Error(`Fleet name can not be longer than 1024 characters but has ${props.fleetName.length} characters.`);
      }
    }

    if (props.description && !cdk.Token.isUnresolved(props.description)) {
      if (props.description.length > 1024) {
        throw new Error(`Fleet description can not be longer than 1024 characters but has ${props.description.length} characters.`);
      }
    }

    if (props.minSize && props.minSize < 0) {
      throw new Error(`The minimum number of instances allowed in the Fleet cannot be lower than 0, given ${props.minSize}`);
    }

    if (props.maxSize && props.maxSize < 0) {
      throw new Error(`The maximum number of instances allowed in the Fleet cannot be lower than 0, given ${props.maxSize}`);
    }

    if (props.peerVpc) {
      this.warnVpcPeeringAuthorizations(this);
    }

    // Add all locations
    if (props.locations && props.locations?.length > 100) {
      throw new Error(`No more than 100 locations are allowed per fleet, given ${props.locations.length}`);
    }
    (props.locations || []).forEach(this.addInternalLocation.bind(this));


    // Add all Ingress rules
    if (props.ingressRules && props.ingressRules?.length > 50) {
      throw new Error(`No more than 50 ingress rules are allowed per fleet, given ${props.ingressRules.length}`);
    }
    (props.ingressRules || []).forEach(this.addInternalIngressRule.bind(this));

    this.content = props.content;
    this.role = props.role ?? new iam.Role(this, 'ServiceRole', {
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('gamelift.amazonaws.com'),
        new iam.ServicePrincipal('ec2.amazonaws.com')),
    });
    this.grantPrincipal = this.role;

    const resource = new CfnFleet(this, 'Resource', {
      buildId: this.content.buildId,
      certificateConfiguration: {
        certificateType: props.useCertificate ? 'GENERATED': 'DISABLED',
      },
      description: props.description,
      desiredEc2Instances: props.desiredCapacity,
      ec2InboundPermissions: cdk.Lazy.any({ produce: () => this.parseIngressRules() }),
      ec2InstanceType: props.instanceType.toString(),
      fleetType: props.useSpot ? 'SPOT' : 'ON_DEMAND',
      instanceRoleArn: this.role.roleArn,
      locations: cdk.Lazy.any({ produce: () => this.parseLocations() }),
      maxSize: props.maxSize ? props.maxSize : 1,
      minSize: props.minSize ? props.minSize : 0,
      name: this.physicalName,
      newGameSessionProtectionPolicy: props.protectNewGameSession ? 'FullProtection' : 'NoProtection',
      peerVpcAwsAccountId: props.peerVpc && props.peerVpc.env.account,
      peerVpcId: props.peerVpc && props.peerVpc.vpcId,
      resourceCreationLimitPolicy: this.parseResourceCreationLimitPolicy(props),
      runtimeConfiguration: this.parseRuntimeConfiguration(props),
    });

    this.fleetId = this.getResourceNameAttribute(resource.ref);
    this.fleetArn = cdk.Stack.of(scope).formatArn({
      service: 'gamelift',
      resource: 'fleet',
      resourceName: this.fleetId,
      arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
    });
  }

  /**
   * Adds an ingress rule to allow inbound traffic to access game sessions on this fleet.
   *
   * @param source A range of allowed IP addresses
   * @param port The port range used for ingress traffic
   */
  public addIngressRule(source: IPeer, port: Port) {
    this.addInternalIngressRule({
      source: source,
      port: port,
    });
  }

  private addInternalIngressRule(ingressRule: IngressRule) {
    if (this.ingressRules.length == 50) {
      throw new Error('No more than 50 ingress rules are allowed per fleet');
    }
    this.ingressRules.push(ingressRule);
  }

  private parseIngressRules(): CfnFleet.IpPermissionProperty[] | undefined {
    if (!this.ingressRules || this.ingressRules.length === 0) {
      return undefined;
    }

    return this.ingressRules.map(parseIngressRule);

    function parseIngressRule(ingressRule: IngressRule): CfnFleet.IpPermissionProperty {
      return {
        ...ingressRule.port.toJson(),
        ...ingressRule.source.toJson(),
      };
    }
  }
}