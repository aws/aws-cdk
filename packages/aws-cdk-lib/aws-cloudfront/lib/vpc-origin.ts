import { Construct } from 'constructs';
import { CfnVpcOrigin } from './cloudfront.generated';
import { OriginProtocolPolicy, OriginSslPolicy } from '../';
import { IInstance } from '../../aws-ec2';
import { IApplicationLoadBalancer, INetworkLoadBalancer } from '../../aws-elasticloadbalancingv2';
import { IResource, ITaggableV2, Names, Resource, Stack, TagManager, Token, ValidationError } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';

/**
 * Represents a VPC origin.
 */
export interface IVpcOrigin extends IResource {
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

/**
 * VPC origin endpoint configuration.
 */
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
   * @default - generated from the `id`
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

/**
 * VPC origin endpoint configuration.
 */
export interface VpcOriginProps extends VpcOriginOptions {
  /**
   * The VPC origin endpoint.
   */
  readonly endpoint: VpcOriginEndpoint;
}

/**
 * Properties for the VPC origin endpoint configuration.
 */
export interface VpcOriginEndpointProps {
  /**
   * The ARN of the CloudFront VPC origin endpoint configuration.
   */
  readonly endpointArn: string;
  /**
   * The domain name of the CloudFront VPC origin endpoint configuration.
   * @default - No domain name configured
   */
  readonly domainName?: string;
}

/**
 * Represents the VPC origin endpoint.
 */
export class VpcOriginEndpoint {
  /**
   * A VPC origin endpoint from an EC2 instance.
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
   * A VPC origin endpoint from an Application Load Balancer.
   * @param loadBalancer The Application Load Balancer as the CloudFront VPC origin endpoint.
   */
  public static fromApplicationLoadBalancer(loadBalancer: IApplicationLoadBalancer): VpcOriginEndpoint {
    return new VpcOriginEndpoint({ endpointArn: loadBalancer.loadBalancerArn, domainName: loadBalancer.loadBalancerDnsName });
  }

  /**
   * A VPC origin endpoint from an Network Load Balancer.
   * @param loadBalancer The Network Load Balancer as the CloudFront VPC origin endpoint.
   */
  public static fromNetworkLoadBalancer(loadBalancer: INetworkLoadBalancer): VpcOriginEndpoint {
    return new VpcOriginEndpoint({ endpointArn: loadBalancer.loadBalancerArn, domainName: loadBalancer.loadBalancerDnsName });
  }

  /**
   * The ARN of the CloudFront VPC origin endpoint configuration.
   */
  readonly endpointArn: string;
  /**
   * The domain name of the CloudFront VPC origin endpoint configuration.
   * @default - No domain name configured
   */
  readonly domainName?: string;

  constructor(props: VpcOriginEndpointProps) {
    this.endpointArn = props.endpointArn;
    this.domainName = props.domainName;
  }
}

/**
 * A CloudFront VPC Origin configuration.
 *
 * @resource AWS::CloudFront::VpcOrigin
 */
export class VpcOrigin extends Resource implements IVpcOrigin, ITaggableV2 {
  /**
   * Import an existing VPC origin from its ID.
   */
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

  readonly cdkTagManager: TagManager;

  constructor(scope: Construct, id: string, props: VpcOriginProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    for (const key of ['httpPort', 'httpsPort'] as const) {
      const port = props[key];
      if (port && !Token.isUnresolved(port) && !([80, 443].includes(port) || (port >= 1024 && port <= 65535))) {
        throw new ValidationError(`'${key}' must be 80, 443, or a value between 1024 and 65535, got ${port}`, this);
      }
    }

    const resource = new CfnVpcOrigin(this, 'Resource', {
      vpcOriginEndpointConfig: {
        arn: props.endpoint.endpointArn,
        httpPort: props.httpPort,
        httpsPort: props.httpsPort,
        name: props.vpcOriginName ?? Names.uniqueResourceName(this, { maxLength: 64 }),
        originProtocolPolicy: props.protocolPolicy,
        originSslProtocols: props.originSslProtocols ?? [OriginSslPolicy.TLS_V1_2],
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
    this.cdkTagManager = resource.cdkTagManager;
  }
}
