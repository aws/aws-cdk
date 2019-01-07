import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { HostedZoneImportProps, IHostedZone } from './hosted-zone-ref';
import { CfnHostedZone } from './route53.generated';
import { validateZoneName } from './util';

/**
 * Properties of a new hosted zone
 */
export interface PublicHostedZoneProps {
  /**
   * The fully qualified domain name for the hosted zone
   */
  zoneName: string;

  /**
   * Any comments that you want to include about the hosted zone.
   *
   * @default no comment
   */
  comment?: string;

  /**
   * The Amazon Resource Name (ARN) for the log group that you want Amazon Route 53 to send query logs to.
   *
   * @default no DNS query logging
   */
  queryLogsLogGroupArn?: string;
}

export abstract class HostedZone extends cdk.Construct implements IHostedZone {
  public static import(scope: cdk.Construct, id: string, props: HostedZoneImportProps): IHostedZone {
    return new ImportedHostedZone(scope, id, props);
  }

  public abstract readonly hostedZoneId: string;
  public abstract readonly zoneName: string;

  public export(): HostedZoneImportProps {
    return {
      hostedZoneId: new cdk.Output(this, 'HostedZoneId', { value: this.hostedZoneId }).makeImportValue().toString(),
      zoneName: this.zoneName,
    };
  }
}

/**
 * Create a Route53 public hosted zone.
 */
export class PublicHostedZone extends HostedZone {
  /**
   * Identifier of this hosted zone
   */
  public readonly hostedZoneId: string;

  /**
   * Fully qualified domain name for the hosted zone
   */
  public readonly zoneName: string;

  /**
   * Nameservers for this public hosted zone
   */
  public readonly nameServers: string[];

  constructor(scope: cdk.Construct, id: string, props: PublicHostedZoneProps) {
    super(scope, id);

    validateZoneName(props.zoneName);

    const hostedZone = new CfnHostedZone(this, 'Resource', {
      ...determineHostedZoneProps(props)
    });

    this.hostedZoneId = hostedZone.ref;
    this.nameServers = hostedZone.hostedZoneNameServers;
    this.zoneName = props.zoneName;
  }
}

/**
 * Properties for a private hosted zone.
 */
export interface PrivateHostedZoneProps extends PublicHostedZoneProps {
  /**
   * One VPC that you want to associate with this hosted zone.
   */
  vpc: ec2.IVpcNetwork;
}

/**
 * Create a Route53 private hosted zone for use in one or more VPCs.
 *
 * Note that `enableDnsHostnames` and `enableDnsSupport` must have been enabled
 * for the VPC you're configuring for private hosted zones.
 */
export class PrivateHostedZone extends HostedZone {
  /**
   * Identifier of this hosted zone
   */
  public readonly hostedZoneId: string;

  /**
   * Fully qualified domain name for the hosted zone
   */
  public readonly zoneName: string;

  /**
   * VPCs to which this hosted zone will be added
   */
  private readonly vpcs: CfnHostedZone.VPCProperty[] = [];

  constructor(scope: cdk.Construct, id: string, props: PrivateHostedZoneProps) {
    super(scope, id);

    validateZoneName(props.zoneName);

    const hostedZone = new CfnHostedZone(this, 'Resource', {
      vpcs: new cdk.Token(() => this.vpcs ? this.vpcs : undefined),
      ...determineHostedZoneProps(props)
    });

    this.hostedZoneId = hostedZone.ref;
    this.zoneName = props.zoneName;

    this.addVpc(props.vpc);
  }

  /**
   * Add another VPC to this private hosted zone.
   *
   * @param vpc the other VPC to add.
   */
  public addVpc(vpc: ec2.IVpcNetwork) {
    this.vpcs.push(toVpcProperty(vpc));
  }
}

function toVpcProperty(vpc: ec2.IVpcNetwork): CfnHostedZone.VPCProperty {
  return { vpcId: vpc.vpcId, vpcRegion: new cdk.AwsRegion() };
}

function determineHostedZoneProps(props: PublicHostedZoneProps) {
  const name = props.zoneName + '.';
  const hostedZoneConfig = props.comment ? { comment: props.comment } : undefined;
  const queryLoggingConfig = props.queryLogsLogGroupArn ? { cloudWatchLogsLogGroupArn: props.queryLogsLogGroupArn } : undefined;

  return { name, hostedZoneConfig, queryLoggingConfig };
}

/**
 * Imported hosted zone
 */
class ImportedHostedZone extends cdk.Construct implements IHostedZone {
  public readonly hostedZoneId: string;

  public readonly zoneName: string;

  constructor(scope: cdk.Construct, name: string, private readonly props: HostedZoneImportProps) {
    super(scope, name);

    this.hostedZoneId = props.hostedZoneId;
    this.zoneName = props.zoneName;
  }

  public export() {
    return this.props;
  }
}
