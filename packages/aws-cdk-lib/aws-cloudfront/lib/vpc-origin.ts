import { Construct } from 'constructs';
import { CfnVpcOrigin } from './cloudfront.generated';
import { OriginProtocolPolicy, OriginSslPolicy } from '../';
import { IInstance } from '../../aws-ec2';
import { IApplicationLoadBalancer, INetworkLoadBalancer } from '../../aws-elasticloadbalancingv2';
import { Names, Resource, Stack } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';

export interface IVpcOrigin {
  /**
   * The VPC origin ARN.
   * @attribute
   */
  readonly vpcOriginArn: string;
  /**
   * The VPC origin ID.
   * @attribute
   */
  readonly vpcOriginId: string;
  /**
   * The domain name of the CloudFront VPC origin endpoint configuration.
   */
  readonly domainName?: string;
}

export interface VpcOriginOptions {
  /**
   * The HTTP port for the CloudFront VPC origin endpoint configuration.
   * @default 80
   */
  readonly httpPort?: number;
  /**
   * The HTTPS port of the CloudFront VPC origin endpoint configuration.
   * @default 443
   */
  readonly httpsPort?: number;
  /**
   * The name of the CloudFront VPC origin endpoint configuration.
   * @default - CDK will generate
   */
  readonly vpcOriginName?: string;
  /**
   * The origin protocol policy for the CloudFront VPC origin endpoint configuration.
   * @default OriginProtocolPolicy.MATCH_VIEWER
   */
  readonly protocolPolicy?: OriginProtocolPolicy;
  /**
   * A list that contains allowed SSL/TLS protocols for this distribution.
   * @default - TLSv1.2
   */
  readonly originSslProtocols?: OriginSslPolicy[];
}

export interface VpcOriginProps extends VpcOriginOptions {
  /**
   * The VPC origin endpoint.
   */
  readonly endpoint: VpcOriginEndpoint;
}

export interface VpcOriginEndpointProps {
  /**
   * The ARN of the CloudFront VPC origin endpoint configuration.
   */
  readonly endpointArn: string;
  /*
   * The domain name of the CloudFront VPC origin endpoint configuration.
   */
  readonly domainName?: string;
}

export class VpcOriginEndpoint {
  /**
   * @param instance The EC2 instance as the CloudFront VPC origin endpoint.
   */
  public static fromEc2Instance(instance: IInstance): VpcOriginEndpoint {
    const endpointArn = Stack.of(instance).formatArn({
      service: 'ec2',
      resource: 'instance',
      resourceName: instance.instanceId,
    });
    return new VpcOriginEndpoint({ endpointArn, domainName: instance.instancePrivateDnsName });
  }

  /**
   * @param loadBalancer The Application Load Balancer as the CloudFront VPC origin endpoint.
   */
  public static fromApplicationLoadBalancer(loadBalancer: IApplicationLoadBalancer): VpcOriginEndpoint {
    return new VpcOriginEndpoint({ endpointArn: loadBalancer.loadBalancerArn, domainName: loadBalancer.loadBalancerDnsName });
  }

  /**
   * @param loadBalancer The Network Load Balancer as the CloudFront VPC origin endpoint.
   */
  public static fromNetworkLoadBalancer(loadBalancer: INetworkLoadBalancer): VpcOriginEndpoint {
    return new VpcOriginEndpoint({ endpointArn: loadBalancer.loadBalancerArn, domainName: loadBalancer.loadBalancerDnsName });
  }

  /**
   * The ARN of the CloudFront VPC origin endpoint configuration.
   */
  readonly endpointArn: string;
  /*
   * The domain name of the CloudFront VPC origin endpoint configuration.
   */
  readonly domainName?: string;

  /**
   * @param endpointArn The ARN of the CloudFront VPC origin endpoint configuration.
   * @param defaultDomainName The default domain name of the CloudFront VPC origin endpoint configuration.
   */
  constructor(props: VpcOriginEndpointProps) {
    this.endpointArn = props.endpointArn;
    this.domainName = props.domainName;
  }
}

export class VpcOrigin extends Resource implements IVpcOrigin {
  public static fromVpcOriginId(scope: Construct, id: string, vpcOriginId: string): IVpcOrigin {
    const vpcOriginArn = Stack.of(scope).formatArn({
      service: 'cloudfront',
      region: '',
      resource: 'vpcorigin',
      resourceName: vpcOriginId,
    });

    class Import extends Resource implements IVpcOrigin {
      readonly vpcOriginArn = vpcOriginArn;
      readonly vpcOriginId = vpcOriginId;
      readonly domainName?: string = undefined;
    }

    return new Import(scope, id);
  }

  /**
   * The VPC origin ARN.
   * @attribute
   */
  readonly vpcOriginArn: string;
  /**
   * The VPC origin ID.
   * @attribute
   */
  readonly vpcOriginId: string;
  /**
   * The domain name of the CloudFront VPC origin endpoint configuration.
   */
  readonly domainName?: string;

  constructor(scope: Construct, id:string, props: VpcOriginProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    const resource = new CfnVpcOrigin(this, 'Resource', {
      vpcOriginEndpointConfig: {
        arn: props.endpoint.endpointArn,
        httpPort: props.httpPort,
        httpsPort: props.httpsPort,
        name: props.vpcOriginName ?? Names.uniqueResourceName(this, {}),
        originProtocolPolicy: props.protocolPolicy,
        originSslProtocols: props.originSslProtocols,
      },
    });

    this.vpcOriginArn = this.getResourceArnAttribute(resource.attrArn, {
      service: 'cloudfront',
      region: '',
      resource: 'vpcorigin',
      resourceName: resource.attrId,
    });
    this.vpcOriginId = resource.attrId;
    this.domainName = props.endpoint.domainName;
  }
}
