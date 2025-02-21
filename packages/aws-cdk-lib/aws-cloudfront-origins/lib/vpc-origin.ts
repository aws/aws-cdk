import { Construct } from 'constructs';
import * as cloudfront from '../../aws-cloudfront';
import { IInstance } from '../../aws-ec2';
import { IApplicationLoadBalancer, INetworkLoadBalancer } from '../../aws-elasticloadbalancingv2';
import * as cdk from '../../core';
import { validateSecondsInRangeOrUndefined } from './private/utils';

/**
 * Properties to define a VPC origin.
 */
export interface VpcOriginProps extends cloudfront.OriginProps {
  /**
   * The domain name associated with your VPC origin.
   * @default - The default domain name of the endpoint.
   */
  readonly domainName?: string;

  /**
   * Specifies how long, in seconds, CloudFront waits for a response from the origin, also known as the origin response timeout.
   * The valid range is from 1 to 180 seconds, inclusive.
   *
   * Note that values over 60 seconds are possible only after a limit increase request for the origin response timeout quota
   * has been approved in the target account; otherwise, values over 60 seconds will produce an error at deploy time.
   *
   * @default Duration.seconds(30)
   */
  readonly readTimeout?: cdk.Duration;

  /**
   * Specifies how long, in seconds, CloudFront persists its connection to the origin.
   * The valid range is from 1 to 180 seconds, inclusive.
   *
   * Note that values over 60 seconds are possible only after a limit increase request for the origin response timeout quota
   * has been approved in the target account; otherwise, values over 60 seconds will produce an error at deploy time.
   *
   * @default Duration.seconds(5)
   */
  readonly keepaliveTimeout?: cdk.Duration;
}

/**
 * Properties to define a VPC origin with endpoint.
 */
export interface VpcOriginWithEndpointProps extends VpcOriginProps, cloudfront.VpcOriginOptions {
}

/**
 * Represents a distribution's VPC origin.
 */
export abstract class VpcOrigin extends cloudfront.OriginBase {
  /**
   * Create a VPC origin with an existing VPC origin resource.
   */
  public static withVpcOrigin(origin: cloudfront.IVpcOrigin, props?: VpcOriginProps): VpcOrigin {
    return new VpcOriginWithVpcOrigin(origin, props);
  }

  /**
   * Create a VPC origin with an EC2 instance.
   */
  public static withEc2Instance(instance: IInstance, props?: VpcOriginWithEndpointProps): VpcOrigin {
    return new VpcOriginWithEndpoint(cloudfront.VpcOriginEndpoint.ec2Instance(instance), props);
  }

  /**
   * Create a VPC origin with an Application Load Balancer.
   */
  public static withApplicationLoadBalancer(alb: IApplicationLoadBalancer, props?: VpcOriginWithEndpointProps): VpcOrigin {
    return new VpcOriginWithEndpoint(cloudfront.VpcOriginEndpoint.applicationLoadBalancer(alb), props);
  }

  /**
   * Create a VPC origin with a Network Load Balancer.
   */
  public static withNetworkLoadBalancer(nlb: INetworkLoadBalancer, props?: VpcOriginWithEndpointProps): VpcOrigin {
    return new VpcOriginWithEndpoint(cloudfront.VpcOriginEndpoint.networkLoadBalancer(nlb), props);
  }

  protected vpcOrigin?: cloudfront.IVpcOrigin;

  protected constructor(domainName: string, protected readonly props: VpcOriginProps) {
    super(domainName, props);

    validateSecondsInRangeOrUndefined('readTimeout', 1, 180, props.readTimeout);
    validateSecondsInRangeOrUndefined('keepaliveTimeout', 1, 180, props.keepaliveTimeout);
  }

  protected renderVpcOriginConfig(): cloudfront.CfnDistribution.VpcOriginConfigProperty | undefined {
    if (!this.vpcOrigin) {
      throw new cdk.UnscopedValidationError('VPC origin cannot be undefined.');
    }
    return {
      vpcOriginId: this.vpcOrigin.vpcOriginId,
      originReadTimeout: this.props.readTimeout?.toSeconds(),
      originKeepaliveTimeout: this.props.keepaliveTimeout?.toSeconds(),
    };
  }
}

class VpcOriginWithVpcOrigin extends VpcOrigin {
  constructor(protected vpcOrigin: cloudfront.IVpcOrigin, props: VpcOriginProps = {}) {
    const domainName = props.domainName ?? vpcOrigin.domainName;
    if (!domainName) {
      throw new cdk.UnscopedValidationError("'domainName' must be specified when no default domain name is defined.");
    }
    super(domainName, props);
  }
}

class VpcOriginWithEndpoint extends VpcOrigin {
  constructor(private readonly vpcOriginEndpoint: cloudfront.VpcOriginEndpoint, protected readonly props: VpcOriginWithEndpointProps = {}) {
    const domainName = props.domainName ?? vpcOriginEndpoint.domainName;
    if (!domainName) {
      throw new cdk.UnscopedValidationError("'domainName' must be specified when no default domain name is defined.");
    }
    super(domainName, props);
  }

  public bind(_scope: Construct, options: cloudfront.OriginBindOptions): cloudfront.OriginBindConfig {
    this.vpcOrigin ??= new cloudfront.VpcOrigin(_scope, 'VpcOrigin', {
      endpoint: this.vpcOriginEndpoint,
      vpcOriginName: this.props.vpcOriginName,
      httpPort: this.props.httpPort,
      httpsPort: this.props.httpsPort,
      protocolPolicy: this.props.protocolPolicy,
      originSslProtocols: this.props.originSslProtocols,
    });
    return super.bind(_scope, options);
  }
}
