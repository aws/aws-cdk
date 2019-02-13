import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
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
  securityGroup?: ec2.ISecurityGroup;

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
  public static import(scope: cdk.Construct, id: string, props: ApplicationLoadBalancerImportProps): IApplicationLoadBalancer {
    return new ImportedApplicationLoadBalancer(scope, id, props);
  }

  public readonly connections: ec2.Connections;
  private readonly securityGroup: ec2.ISecurityGroup;

  constructor(scope: cdk.Construct, id: string, props: ApplicationLoadBalancerProps) {
    super(scope, id, props, {
      type: "application",
      securityGroups: new cdk.Token(() => [this.securityGroup.securityGroupId]),
      ipAddressType: props.ipAddressType,
    });

    this.securityGroup = props.securityGroup || new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc: props.vpc,
      description: `Automatically created Security Group for ELB ${this.node.uniqueId}`,
      allowAllOutbound: false
    });
    this.connections = new ec2.Connections({ securityGroups: [this.securityGroup] });

    if (props.http2Enabled === false) { this.setAttribute('routing.http2.enabled', 'false'); }
    if (props.idleTimeoutSecs !== undefined) { this.setAttribute('idle_timeout.timeout_seconds', props.idleTimeoutSecs.toString()); }
  }

  /**
   * Enable access logging for this load balancer
   */
  public logAccessLogs(bucket: s3.IBucket, prefix?: string) {
    this.setAttribute('access_logs.s3.enabled', 'true');
    this.setAttribute('access_logs.s3.bucket', bucket.bucketName.toString());
    this.setAttribute('access_logs.s3.prefix', prefix);

    const region = this.node.stack.requireRegion('Enable ELBv2 access logging');
    const account = ELBV2_ACCOUNTS[region];
    if (!account) {
      throw new Error(`Cannot enable access logging; don't know ELBv2 account for region ${region}`);
    }

    // FIXME: can't use grantPut() here because that only takes IAM objects, not arbitrary principals
    bucket.addToResourcePolicy(new iam.PolicyStatement()
      .addPrincipal(new iam.AccountPrincipal(account))
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
  public export(): ApplicationLoadBalancerImportProps {
    return {
      loadBalancerArn: new cdk.Output(this, 'LoadBalancerArn', { value: this.loadBalancerArn }).makeImportValue().toString(),
      securityGroupId: this.securityGroup.export().securityGroupId,
    };
  }

  /**
   * Return the given named metric for this Application Load Balancer
   *
   * @default Average over 5 minutes
   */
  public metric(metricName: string, props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/ApplicationELB',
      metricName,
      dimensions: { LoadBalancer: this.fullName },
      ...props
    });
  }

  /**
   * The total number of concurrent TCP connections active from clients to the
   * load balancer and from the load balancer to targets.
   *
   * @default Sum over 5 minutes
   */
  public metricActiveConnectionCount(props?: cloudwatch.MetricCustomization) {
    return this.metric('ActiveConnectionCount', {
      statistic: 'sum',
      ...props
    });
  }

  /**
   * The number of TLS connections initiated by the client that did not
   * establish a session with the load balancer. Possible causes include a
   * mismatch of ciphers or protocols.
   *
   * @default Sum over 5 minutes
   */
  public metricClientTlsNegotiationErrorCount(props?: cloudwatch.MetricCustomization) {
    return this.metric('ClientTLSNegotiationErrorCount', {
      statistic: 'sum',
      ...props
    });
  }

  /**
   * The number of load balancer capacity units (LCU) used by your load balancer.
   *
   * @default Sum over 5 minutes
   */
  public metricConsumedLCUs(props?: cloudwatch.MetricCustomization) {
    return this.metric('ConsumedLCUs', {
      statistic: 'sum',
      ...props
    });
  }

  /**
   * The number of fixed-response actions that were successful.
   *
   * @default Sum over 5 minutes
   */
  public metricHttpFixedResponseCount(props?: cloudwatch.MetricCustomization) {
    return this.metric('HTTP_Fixed_Response_Count', {
      statistic: 'Sum',
      ...props
    });
  }

  /**
   * The number of redirect actions that were successful.
   *
   * @default Sum over 5 minutes
   */
  public metricHttpRedirectCount(props?: cloudwatch.MetricCustomization) {
    return this.metric('HTTP_Redirect_Count', {
      statistic: 'Sum',
      ...props
    });
  }

  /**
   * The number of redirect actions that couldn't be completed because the URL
   * in the response location header is larger than 8K.
   *
   * @default Sum over 5 minutes
   */
  public metricHttpRedirectUrlLimitExceededCount(props?: cloudwatch.MetricCustomization) {
    return this.metric('HTTP_Redirect_Url_Limit_Exceeded_Count', {
      statistic: 'Sum',
      ...props
    });
  }

  /**
   * The number of HTTP 3xx/4xx/5xx codes that originate from the load balancer.
   *
   * This does not include any response codes generated by the targets.
   *
   * @default Sum over 5 minutes
   */
  public metricHttpCodeElb(code: HttpCodeElb, props?: cloudwatch.MetricCustomization) {
    return this.metric(code, {
      statistic: 'Sum',
      ...props
    });
  }

  /**
   * The number of HTTP 2xx/3xx/4xx/5xx response codes generated by all targets
   * in the load balancer.
   *
   * This does not include any response codes generated by the load balancer.
   *
   * @default Sum over 5 minutes
   */
  public metricHttpCodeTarget(code: HttpCodeTarget, props?: cloudwatch.MetricCustomization) {
    return this.metric(code, {
      statistic: 'Sum',
      ...props
    });
  }

  /**
   * The total number of bytes processed by the load balancer over IPv6.
   *
   * @default Sum over 5 minutes
   */
  public metricIPv6ProcessedBytes(props?: cloudwatch.MetricCustomization) {
    return this.metric('IPv6ProcessedBytes', {
      statistic: 'Sum',
      ...props
    });
  }

  /**
   * The number of IPv6 requests received by the load balancer.
   *
   * @default Sum over 5 minutes
   */
  public metricIPv6RequestCount(props?: cloudwatch.MetricCustomization) {
    return this.metric('IPv6RequestCount', {
      statistic: 'Sum',
      ...props
    });
  }

  /**
   * The total number of new TCP connections established from clients to the
   * load balancer and from the load balancer to targets.
   *
   * @default Sum over 5 minutes
   */
  public metricNewConnectionCount(props?: cloudwatch.MetricCustomization) {
    return this.metric('NewConnectionCount', {
      statistic: 'Sum',
      ...props
    });
  }

  /**
   * The total number of bytes processed by the load balancer over IPv4 and IPv6.
   *
   * @default Sum over 5 minutes
   */
  public metricProcessedBytes(props?: cloudwatch.MetricCustomization) {
    return this.metric('ProcessedBytes', {
      statistic: 'Sum',
      ...props
    });
  }

  /**
   * The number of connections that were rejected because the load balancer had
   * reached its maximum number of connections.
   *
   * @default Sum over 5 minutes
   */
  public metricRejectedConnectionCount(props?: cloudwatch.MetricCustomization) {
    return this.metric('RejectedConnectionCount', {
      statistic: 'Sum',
      ...props
    });
  }

  /**
   * The number of requests processed over IPv4 and IPv6.
   *
   * This count includes only the requests with a response generated by a target of the load balancer.
   *
   * @default Sum over 5 minutes
   */
  public metricRequestCount(props?: cloudwatch.MetricCustomization) {
    return this.metric('RequestCount', {
      statistic: 'Sum',
      ...props
    });
  }

  /**
   * The number of rules processed by the load balancer given a request rate averaged over an hour.
   *
   * @default Sum over 5 minutes
   */
  public metricRuleEvaluations(props?: cloudwatch.MetricCustomization) {
    return this.metric('RuleEvaluations', {
      statistic: 'Sum',
      ...props
    });
  }

  /**
   * The number of connections that were not successfully established between the load balancer and target.
   *
   * @default Sum over 5 minutes
   */
  public metricTargetConnectionErrorCount(props?: cloudwatch.MetricCustomization) {
    return this.metric('TargetConnectionErrorCount', {
      statistic: 'Sum',
      ...props
    });
  }

  /**
   * The time elapsed, in seconds, after the request leaves the load balancer until a response from the target is received.
   *
   * @default Average over 5 minutes
   */
  public metricTargetResponseTime(props?: cloudwatch.MetricCustomization) {
    return this.metric('TargetResponseTime', {
      statistic: 'Average',
      ...props
    });
  }

  /**
   * The number of TLS connections initiated by the load balancer that did not establish a session with the target.
   *
   * Possible causes include a mismatch of ciphers or protocols.
   *
   * @default Sum over 5 minutes
   */
  public metricTargetTLSNegotiationErrorCount(props?: cloudwatch.MetricCustomization) {
    return this.metric('TargetTLSNegotiationErrorCount', {
      statistic: 'Sum',
      ...props
    });
  }

  /**
   * The number of user authentications that could not be completed
   *
   * Because an authenticate action was misconfigured, the load balancer
   * couldn't establish a connection with the IdP, or the load balancer
   * couldn't complete the authentication flow due to an internal error.
   *
   * @default Sum over 5 minutes
   */
  public metricElbAuthError(props?: cloudwatch.MetricCustomization) {
    return this.metric('ELBAuthError', {
      statistic: 'Sum',
      ...props
    });
  }

  /**
   * The number of user authentications that could not be completed because the
   * IdP denied access to the user or an authorization code was used more than
   * once.
   *
   * @default Sum over 5 minutes
   */
  public metricElbAuthFailure(props?: cloudwatch.MetricCustomization) {
    return this.metric('ELBAuthFailure', {
      statistic: 'Sum',
      ...props
    });
  }

  /**
   * The time elapsed, in milliseconds, to query the IdP for the ID token and user info.
   *
   * If one or more of these operations fail, this is the time to failure.
   *
   * @default Average over 5 minutes
   */
  public metricElbAuthLatency(props?: cloudwatch.MetricCustomization) {
    return this.metric('ELBAuthLatency', {
      statistic: 'Average',
      ...props
    });
  }

  /**
   * The number of authenticate actions that were successful.
   *
   * This metric is incremented at the end of the authentication workflow,
   * after the load balancer has retrieved the user claims from the IdP.
   *
   * @default Sum over 5 minutes
   */
  public metricElbAuthSuccess(props?: cloudwatch.MetricCustomization) {
    return this.metric('ELBAuthSuccess', {
      statistic: 'Sum',
      ...props
    });
  }
}

/**
 * Count of HTTP status originating from the load balancer
 *
 * This count does not include any response codes generated by the targets.
 */
export enum HttpCodeElb {
  /**
   * The number of HTTP 3XX redirection codes that originate from the load balancer.
   */
  Elb3xxCount = 'HTTPCode_ELB_3XX_Count',

  /**
   * The number of HTTP 4XX client error codes that originate from the load balancer.
   *
   * Client errors are generated when requests are malformed or incomplete.
   * These requests have not been received by the target. This count does not
   * include any response codes generated by the targets.
   */
  Elb4xxCount = 'HTTPCode_ELB_4XX_Count',

  /**
   * The number of HTTP 5XX server error codes that originate from the load balancer.
   */
  Elb5xxCount = 'HTTPCode_ELB_5XX_Count',
}

/**
 * Count of HTTP status originating from the targets
 */
export enum HttpCodeTarget {
  /**
   * The number of 2xx response codes from targets
   */
  Target2xxCount = 'HTTPCode_Target_2XX_Count',

  /**
   * The number of 3xx response codes from targets
   */
  Target3xxCount = 'HTTPCode_Target_3XX_Count',

  /**
   * The number of 4xx response codes from targets
   */
  Target4xxCount = 'HTTPCode_Target_4XX_Count',

  /**
   * The number of 5xx response codes from targets
   */
  Target5xxCount = 'HTTPCode_Target_5XX_Count'
}

/**
 * An application load balancer
 */
export interface IApplicationLoadBalancer extends cdk.IConstruct, ec2.IConnectable {
  /**
   * The ARN of this load balancer
   */
  readonly loadBalancerArn: string;

  /**
   * The VPC this load balancer has been created in (if available)
   */
  readonly vpc?: ec2.IVpcNetwork;

  /**
   * Add a new listener to this load balancer
   */
  addListener(id: string, props: BaseApplicationListenerProps): ApplicationListener;

  /**
   * Export this load balancer
   */
  export(): ApplicationLoadBalancerImportProps;
}

/**
 * Properties to reference an existing load balancer
 */
export interface ApplicationLoadBalancerImportProps {
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
class ImportedApplicationLoadBalancer extends cdk.Construct implements IApplicationLoadBalancer {
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
  public readonly vpc?: ec2.IVpcNetwork;

  constructor(scope: cdk.Construct, id: string, private readonly props: ApplicationLoadBalancerImportProps) {
    super(scope, id);

    this.loadBalancerArn = props.loadBalancerArn;
    this.connections = new ec2.Connections({
      securityGroups: [ec2.SecurityGroup.import(this, 'SecurityGroup', { securityGroupId: props.securityGroupId })]
    });
  }

  public export() {
    return this.props;
  }

  public addListener(id: string, props: BaseApplicationListenerProps): ApplicationListener {
    return new ApplicationListener(this, id, {
      loadBalancer: this,
      ...props
    });
  }
}
