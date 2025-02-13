import { Construct } from 'constructs';
import { CfnVpcOrigin } from './cloudfront.generated';
import { OriginProtocolPolicy, OriginSslPolicy } from '../';
import { IInstance } from '../../aws-ec2';
import { IApplicationLoadBalancer, INetworkLoadBalancer } from '../../aws-elasticloadbalancingv2';
import { ArnFormat, IResource, ITaggableV2, Names, Resource, Stack, TagManager, Token, ValidationError } from '../../core';
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
 * The properties to import from the VPC origin
 */
export interface VpcOriginAttributes {
  /**
   * The ARN of the VPC origin.
   *
   * At least one of vpcOriginArn and vpcOriginId must be provided.
   *
   * @default - derived from `vpcOriginId`.
   */
  readonly vpcOriginArn?: string;
  /**
   * The ID of the VPC origin.
   *
   * At least one of vpcOriginArn and vpcOriginId must be provided.
   *
   * @default - derived from `vpcOriginArn`.
   */
  readonly vpcOriginId?: string;
  /**
   * The domain name of the CloudFront VPC origin endpoint configuration.
   * @default - No domain name configured
   */
  readonly domainName?: string;
}

/**
 * Represents the VPC origin endpoint.
 */
export abstract class VpcOriginEndpoint {
  /**
   * A VPC origin endpoint from an EC2 instance.
   */
  public static ec2Instance(instance: IInstance): VpcOriginEndpoint {
    const endpointArn = Stack.of(instance).formatArn({
      service: 'ec2',
      resource: 'instance',
      resourceName: instance.instanceId,
    });
    return { endpointArn, domainName: instance.instancePrivateDnsName };
  }

  /**
   * A VPC origin endpoint from an Application Load Balancer.
   */
  public static applicationLoadBalancer(alb: IApplicationLoadBalancer): VpcOriginEndpoint {
    return { endpointArn: alb.loadBalancerArn, domainName: alb.loadBalancerDnsName };
  }

  /**
   * A VPC origin endpoint from an Network Load Balancer.
   */
  public static networkLoadBalancer(nlb: INetworkLoadBalancer): VpcOriginEndpoint {
    return { endpointArn: nlb.loadBalancerArn, domainName: nlb.loadBalancerDnsName };
  }

  /**
   * The ARN of the CloudFront VPC origin endpoint configuration.
   */
  abstract readonly endpointArn: string;
  /**
   * The domain name of the CloudFront VPC origin endpoint configuration.
   * @default - No domain name configured
   */
  abstract readonly domainName?: string;
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
    return this.fromVpcOriginAttributes(scope, id, { vpcOriginId });
  }

  /**
   * Import an existing VPC origin from its ARN.
   */
  public static fromVpcOriginArn(scope: Construct, id: string, vpcOriginArn: string): IVpcOrigin {
    return this.fromVpcOriginAttributes(scope, id, { vpcOriginArn });
  }

  /**
   * Import an existing VPC origin from its attributes.
   */
  public static fromVpcOriginAttributes(scope: Construct, id: string, attrs: VpcOriginAttributes): IVpcOrigin {
    if (!attrs.vpcOriginArn && !attrs.vpcOriginId) {
      throw new ValidationError('Either vpcOriginId or vpcOriginArn must be provided in VpcOriginAttributes', scope);
    }
    const vpcOriginId = attrs.vpcOriginId
      ?? Stack.of(scope).splitArn(attrs.vpcOriginArn!, ArnFormat.SLASH_RESOURCE_NAME).resourceName;
    if (!vpcOriginId) {
      throw new ValidationError(`No VPC origin ID found in ARN: '${attrs.vpcOriginArn}'`, scope);
    }

    const vpcOriginArn = attrs.vpcOriginArn ?? Stack.of(scope).formatArn({
      service: 'cloudfront',
      region: '',
      resource: 'vpcorigin',
      resourceName: vpcOriginId,
    });

    class Import extends Resource implements IVpcOrigin {
      readonly vpcOriginArn = vpcOriginArn;
      readonly vpcOriginId = vpcOriginId!;
      readonly domainName = attrs.domainName;
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

    this.validatePortNumber(props.httpPort, 'httpPort');
    this.validatePortNumber(props.httpsPort, 'httpsPort');

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

  private validatePortNumber(port: number | undefined, attrName: string) {
    if (port && !Token.isUnresolved(port) && !([80, 443].includes(port) || (port >= 1024 && port <= 65535))) {
      throw new ValidationError(`'${attrName}' must be 80, 443, or a value between 1024 and 65535, got ${port}`, this);
    }
  }
}
