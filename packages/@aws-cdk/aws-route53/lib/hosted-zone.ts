import ec2 = require('@aws-cdk/aws-ec2');
import { CfnOutput, Construct, Resource, Token } from '@aws-cdk/cdk';
import { HostedZoneAttributes, IHostedZone } from './hosted-zone-ref';
import { ZoneDelegationRecord } from './records';
import { CfnHostedZone } from './route53.generated';
import { validateZoneName } from './util';

export interface CommonHostedZoneProps {
  /**
   * The name of the domain. For resource record types that include a domain
   * name, specify a fully qualified domain name.
   */
  readonly zoneName: string;

  /**
   * Any comments that you want to include about the hosted zone.
   *
   * @default none
   */
  readonly comment?: string;

  /**
   * The Amazon Resource Name (ARN) for the log group that you want Amazon Route 53 to send query logs to.
   *
   * @default disabled
   */
  readonly queryLogsLogGroupArn?: string;
}

/**
 * Properties of a new hosted zone
 */
export interface HostedZoneProps extends CommonHostedZoneProps {
  /**
   * A VPC that you want to associate with this hosted zone. When you specify
   * this property, a private hosted zone will be created.
   *
   * You can associate additional VPCs to this private zone using `addVpc(vpc)`.
   *
   * @default public (no VPCs associated)
   */
  readonly vpcs?: ec2.IVpcNetwork[];
}

export class HostedZone extends Resource implements IHostedZone {

  public static fromHostedZoneId(scope: Construct, id: string, hostedZoneId: string): IHostedZone {
    class Import extends Construct implements IHostedZone {
      public readonly hostedZoneId = hostedZoneId;
      public get zoneName(): string {
        throw new Error(`HostedZone.fromHostedZoneId doesn't support "zoneName"`);
      }
      public export(): HostedZoneAttributes {
        return {
          hostedZoneId: this.hostedZoneId,
          zoneName: this.zoneName
        };
      }
    }

    return new Import(scope, id);
  }

  /**
   * Imports a hosted zone from another stack.
   */
  public static fromHostedZoneAttributes(scope: Construct, id: string, attrs: HostedZoneAttributes): IHostedZone {
    class Import extends Construct implements IHostedZone {
      public readonly hostedZoneId = attrs.hostedZoneId;
      public readonly zoneName = attrs.zoneName;
      public export() {
        return attrs;
      }
    }

    return new Import(scope, id);
  }

  public readonly hostedZoneId: string;
  public readonly zoneName: string;
  public readonly hostedZoneNameServers?: string[];

  /**
   * VPCs to which this hosted zone will be added
   */
  protected readonly vpcs = new Array<CfnHostedZone.VPCProperty>();

  constructor(scope: Construct, id: string, props: HostedZoneProps) {
    super(scope, id);

    validateZoneName(props.zoneName);

    const resource = new CfnHostedZone(this, 'Resource', {
      name: props.zoneName + '.',
      hostedZoneConfig: props.comment ? { comment: props.comment } : undefined,
      queryLoggingConfig: props.queryLogsLogGroupArn ? { cloudWatchLogsLogGroupArn: props.queryLogsLogGroupArn } : undefined,
      vpcs: new Token(() => this.vpcs.length === 0 ? undefined : this.vpcs)
    });

    this.hostedZoneId = resource.ref;
    this.hostedZoneNameServers = resource.hostedZoneNameServers;
    this.zoneName = props.zoneName;

    for (const vpc of props.vpcs || []) {
      this.addVpc(vpc);
    }
  }

  public export(): HostedZoneAttributes {
    return {
      hostedZoneId: new CfnOutput(this, 'HostedZoneId', { value: this.hostedZoneId }).makeImportValue(),
      zoneName: this.zoneName,
    };
  }

  /**
   * Add another VPC to this private hosted zone.
   *
   * @param vpc the other VPC to add.
   */
  public addVpc(vpc: ec2.IVpcNetwork) {
    this.vpcs.push({ vpcId: vpc.vpcId, vpcRegion: vpc.vpcRegion });
  }
}

export interface PublicHostedZoneProps extends CommonHostedZoneProps { }
export interface IPublicHostedZone extends IHostedZone { }

/**
 * Create a Route53 public hosted zone.
 *
 * @resource AWS::Route53::HostedZone
 */
export class PublicHostedZone extends HostedZone implements IPublicHostedZone {

  public static fromPublicHostedZoneId(scope: Construct, id: string, publicHostedZoneId: string): IPublicHostedZone {
    class Import extends Resource implements IPublicHostedZone {
      public readonly hostedZoneId = publicHostedZoneId;
      public get zoneName(): string { throw new Error(`cannot retrieve "zoneName" from an an imported hosted zone`); }
      public export(): HostedZoneAttributes {
        return {
          hostedZoneId: this.hostedZoneId,
          zoneName: this.zoneName
        };
      }
    }
    return new Import(scope, id);
  }

  constructor(scope: Construct, id: string, props: PublicHostedZoneProps) {
    super(scope, id, props);
  }

  public addVpc(_vpc: ec2.IVpcNetwork) {
    throw new Error('Cannot associate public hosted zones with a VPC');
  }

  /**
   * Adds a delegation from this zone to a designated zone.
   *
   * @param delegate the zone being delegated to.
   * @param opts     options for creating the DNS record, if any.
   */
  public addDelegation(delegate: PublicHostedZone, opts: ZoneDelegationOptions = {}): void {
    new ZoneDelegationRecord(this, `${this.zoneName} -> ${delegate.zoneName}`, {
      zone: this,
      delegatedZoneName: delegate.zoneName,
      nameServers: delegate.hostedZoneNameServers!, // PublicHostedZones always have name servers!
      comment: opts.comment,
      ttl: opts.ttl,
    });
  }
}

/**
 * Options available when creating a delegation relationship from one PublicHostedZone to another.
 */
export interface ZoneDelegationOptions {
  /**
   * A comment to add on the DNS record created to incorporate the delegation.
   *
   * @default none
   */
  readonly comment?: string;

  /**
   * The TTL (Time To Live) of the DNS delegation record in DNS caches.
   *
   * @default 172800
   */
  readonly ttl?: number;
}

export interface PrivateHostedZoneProps extends CommonHostedZoneProps {
  /**
   * A VPC that you want to associate with this hosted zone.
   *
   * Private hosted zones must be associated with at least one VPC. You can
   * associated additional VPCs using `addVpc(vpc)`.
   */
  readonly vpc: ec2.IVpcNetwork;
}

export interface IPrivateHostedZone extends IHostedZone {}

/**
 * Create a Route53 private hosted zone for use in one or more VPCs.
 *
 * Note that `enableDnsHostnames` and `enableDnsSupport` must have been enabled
 * for the VPC you're configuring for private hosted zones.
 *
 * @resource AWS::Route53::HostedZone
 */
export class PrivateHostedZone extends HostedZone implements IPrivateHostedZone {

  public static fromPrivateHostedZoneId(scope: Construct, id: string, privateHostedZoneId: string): IPrivateHostedZone {
    class Import extends Resource implements IPrivateHostedZone {
      public readonly hostedZoneId = privateHostedZoneId;
      public get zoneName(): string { throw new Error(`cannot retrieve "zoneName" from an an imported hosted zone`); }
      public export(): HostedZoneAttributes {
        return {
          hostedZoneId: this.hostedZoneId,
          zoneName: this.zoneName
        };
      }
    }
    return new Import(scope, id);
  }

  constructor(scope: Construct, id: string, props: PrivateHostedZoneProps) {
    super(scope, id, props);

    this.addVpc(props.vpc);
  }
}
