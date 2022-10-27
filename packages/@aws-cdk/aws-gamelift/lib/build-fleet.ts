import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IBuild } from './build';
import { FleetBase, FleetProps, IFleet, FleetAttributes } from './fleet-base';
import { InboundPermission } from './inbound-permission';

/**
 *
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
   */
  readonly inboundPermission: InboundPermission[];
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
  static fromFleetId(scope: Construct, id: string, fleetId: string): IBuildFleet {
    return this.fromFleetAttributes(scope, id, { fleetId });
  }

  /**
   * Import an existing fleet from its ARN.
   */
  static fromFleetArn(scope: Construct, id: string, fleetArn: string): IBuildFleet {
    return this.fromFleetAttributes(scope, id, { fleetArn });
  }

  /**
   * Import an existing fleet from its attributes.
   */
  static fromFleetAttributes(scope: Construct, id: string, attrs: FleetAttributes): IBuildFleet {
    if (!attrs.fleetId && !attrs.fleetId) {
      throw new Error('Either fleetId or fleetArn must be provided in FleetAttributes');
    }
    const fleetId = attrs.fleetId ??
      cdk.Stack.of(scope).splitArn(attrs.fleetArn!, cdk.ArnFormat.SLASH_RESOURCE_NAME).resourceName;

    if (!fleetId) {
      throw new Error(`No fleet identifier found in ARN: '${attrs.fleetArn}'`);
    }
    const fleetArn = attrs.fleetArn ?? cdk.Stack.of(scope).formatArn({
      service: 'gamelift',
      resource: 'fleet',
      resourceName: attrs.fleetId,
      arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
    });
    class Import extends FleetBase {
      public readonly fleetId = fleetId;
      public readonly fleetArn = fleetArn;
      public readonly grantPrincipal = attrs.role ?? new iam.UnknownPrincipal({ resource: this });
    }
    return new Import(scope, id);
  }

  /**
   * The Identifier of the fleet.
   */
  public readonly fleetId: string;

  /**
   * The name of the fleet.
   */
  public readonly fleetName: string;

  /**
   * The ARN of the fleet.
   */
  public readonly fleetArn: string;

  /**
   * The IAM role GameLift assumes by fleet instances to access AWS ressources.
   */
  public readonly role: iam.IRole;

  /**
   * The principal this GameLift fleet is using.
   */
  public readonly grantPrincipal: iam.IPrincipal;

  constructor(scope: Construct, id: string, props: BuildFleetProps) {
    super(scope, id, {
      physicalName: props.fleetName,
    });

    if (props.fleetName && !cdk.Token.isUnresolved(props.fleetName)) {
      if (props.fleetName.length > 1024) {
        throw new Error(`Fleet name can not be longer than 1024 characters but has ${props.fleetName.length} characters.`);
      }
    }

    if (props.description && !cdk.Token.isUnresolved(props.description)) {
      if (props.description.length > 1024) {
        throw new Error(`Fleet description can not be longer than 1024 characters but has ${props.description.length} characters.`);
      }
    }

    if (props.peerVpc) {
      this.warnVpcPeeringAuthorizations(this);
    }

    if (props.inboundPermission && props.inboundPermission?.length > 50) {
      throw new Error(`No more than 50 inbound traffic permission rules are allowed per fleet, given ${props.inboundPermission.length}`);
    }

    if (props.locations && props.locations?.length > 100) {
      throw new Error(`No more than 100 locations are allowed per fleet, given ${props.locations.length}`);
    }
  }
}

/**
 * Given an opaque (token) ARN, returns a CloudFormation expression that extracts the script
 * identifier from the ARN.
 *
 * Script ARNs look like this:
 *
 *   arn:aws:gamelift:region:account-id:script/script-identifier
 *
 * ..which means that in order to extract the `script-identifier` component from the ARN, we can
 * split the ARN using ":" and select the component in index 5 then split using "/" and select the component in index 1.
 *
 * @returns the script identifier from his ARN
 */
function extractIdFromArn(arn: string) {
  const splitValue = cdk.Fn.select(5, cdk.Fn.split(':', arn));
  return cdk.Fn.select(1, cdk.Fn.split('/', splitValue));
}