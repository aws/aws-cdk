import ec2 = require('@aws-cdk/aws-ec2');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import { BaseLoadBalancer, BaseLoadBalancerProps } from '../shared/base-load-balancer';
import { IpAddressType } from '../shared/enums';
import { ApplicationListener, BaseApplicationListenerProps } from './application-listener';

/**
 * Properties for defining an Application Load Balancer
 */
export interface ApplicationLoadBalancerProps extends BaseLoadBalancerProps {
  /**
   * Security group to associate with this load balancer
   *
   * @default A security group is created
   */
  securityGroup?: ec2.SecurityGroupRef;

  /**
   * The type of IP addresses to use
   *
   * Only applies to application load balancers.
   *
   * @default IpAddressType.Ipv4
   */
  ipAddressType?: IpAddressType;

  /**
   * Indicates whether HTTP/2 is enabled.
   *
   * @default true
   */
  http2Enabled?: boolean;

  /**
   * The load balancer idle timeout, in seconds
   *
   * @default 60
   */
  idleTimeoutSecs?: number;
}

/**
 * Define an Application Load Balancer
 */
export class ApplicationLoadBalancer extends BaseLoadBalancer implements IApplicationLoadBalancer {
  /**
   * Import an existing Application Load Balancer
   */
  public static import(parent: cdk.Construct, id: string, props: ApplicationLoadBalancerRefProps): IApplicationLoadBalancer {
    return new ImportedApplicationLoadBalancer(parent, id, props);
  }

  public readonly connections: ec2.Connections;
  private readonly securityGroup: ec2.SecurityGroupRef;

  constructor(parent: cdk.Construct, id: string, props: ApplicationLoadBalancerProps) {
    super(parent, id, props, {
      type: "application",
      securityGroups: new cdk.Token(() => [this.securityGroup.securityGroupId]),
      ipAddressType: props.ipAddressType,
    });

    this.securityGroup = props.securityGroup || new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc: props.vpc,
      description: `Automatically created Security Group for ELB ${this.uniqueId}`
    });
    this.connections = new ec2.Connections({ securityGroup: this.securityGroup });

    if (props.http2Enabled === false) { this.setAttribute('routing.http2.enabled', 'false'); }
    if (props.idleTimeoutSecs !== undefined) { this.setAttribute('idle_timeout.timeout_seconds', props.idleTimeoutSecs.toString()); }
  }

  /**
   * Enable access logging for this load balancer
   */
  public logAccessLogs(bucket: s3.BucketRef, prefix?: string) {
    this.setAttribute('access_logs.s3.enabled', 'true');
    this.setAttribute('access_logs.s3.bucket', bucket.bucketName.toString());
    this.setAttribute('access_logs.s3.prefix', prefix);

    const stack = cdk.Stack.find(this);

    const region = stack.requireRegion('Enable ELBv2 access logging');
    const account = ELBV2_ACCOUNTS[region];
    if (!account) {
      throw new Error(`Cannot enable access logging; don't know ELBv2 account for region ${region}`);
    }

    // FIXME: can't use grantPut() here because that only takes IAM objects, not arbitrary principals
    bucket.addToResourcePolicy(new cdk.PolicyStatement()
      .addPrincipal(new cdk.AccountPrincipal(account))
      .addAction('s3:PutObject')
      .addResource(bucket.arnForObjects(prefix || '', '*')));
  }

  /**
   * Add a new listener to this load balancer
   */
  public addListener(id: string, props: BaseApplicationListenerProps): ApplicationListener {
    return new ApplicationListener(this, id, {
      loadBalancer: this,
      ...props
    });
  }

  /**
   * Export this load balancer
   */
  public export(): ApplicationLoadBalancerRefProps {
    return {
      loadBalancerArn: new cdk.Output(this, 'LoadBalancerArn', { value: this.loadBalancerArn }).makeImportValue().toString(),
      securityGroupId: this.securityGroup.export().securityGroupId,
    };
  }
}

/**
 * An application load balancer
 */
export interface IApplicationLoadBalancer extends ec2.IConnectable {
  /**
   * The ARN of this load balancer
   */
  readonly loadBalancerArn: string;

  /**
   * The VPC this load balancer has been created in (if available)
   */
  readonly vpc?: ec2.VpcNetworkRef;

  /**
   * Add a new listener to this load balancer
   */
  addListener(id: string, props: BaseApplicationListenerProps): ApplicationListener;
}

/**
 * Properties to reference an existing load balancer
 */
export interface ApplicationLoadBalancerRefProps {
  /**
   * ARN of the load balancer
   */
  loadBalancerArn: string;

  /**
   * ID of the load balancer's security group
   */
  securityGroupId: string;
}

// https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-access-logs.html#access-logging-bucket-permissions
const ELBV2_ACCOUNTS: {[region: string]: string } = {
  'us-east-1': '127311923021',
  'us-east-2': '033677994240',
  'us-west-1': '027434742980',
  'us-west-2': '797873946194',
  'ca-central-1': '985666609251',
  'eu-central-1': '054676820928',
  'eu-west-1': '156460612806',
  'eu-west-2': '652711504416',
  'eu-west-3': '009996457667',
  'ap-northeast-1': '582318560864',
  'ap-northeast-2': '600734575887',
  'ap-northeast-3': '383597477331',
  'ap-southeast-1': '114774131450',
  'ap-southeast-2': '783225319266',
  'ap-south-1': '718504428378',
  'sa-east-1': '507241528517',
  'us-gov-west-1': '048591011584',
  'cn-north-1': '638102146993',
  'cn-northwest-1': '037604701340',
};

/**
 * An ApplicationLoadBalancer that has been defined elsewhere
 */
class ImportedApplicationLoadBalancer extends cdk.Construct implements IApplicationLoadBalancer, ec2.IConnectable {
  /**
   * Manage connections for this load balancer
   */
  public readonly connections: ec2.Connections;

  /**
   * ARN of the load balancer
   */
  public readonly loadBalancerArn: string;

  /**
   * VPC of the load balancer
   *
   * Always undefined.
   */
  public readonly vpc?: ec2.VpcNetworkRef;

  constructor(parent: cdk.Construct, id: string, props: ApplicationLoadBalancerRefProps) {
    super(parent, id);

    this.loadBalancerArn = props.loadBalancerArn;
    this.connections = new ec2.Connections({
      securityGroup: ec2.SecurityGroupRef.import(this, 'SecurityGroup', { securityGroupId: props.securityGroupId })
    });
  }

  public addListener(id: string, props: BaseApplicationListenerProps): ApplicationListener {
    return new ApplicationListener(this, id, {
      loadBalancer: this,
      ...props
    });
  }
}
