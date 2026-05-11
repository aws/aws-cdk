import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { Effect, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { UnscopedValidationError } from 'aws-cdk-lib/core';
import { lit } from 'aws-cdk-lib/core/lib/helpers-internal';
import type { Construct } from 'constructs';
import type { IOriginEndpoint } from './endpoint';
import type { IChannelGroup } from './group';
import type { CdnAuthConfiguration } from './origin-endpoint-policy';

/**
 * Properties for a MediaPackage V2 Origin with OAC.
 */
export interface MediaPackageV2OriginProps extends cloudfront.OriginProps {
  /**
   * The channel group that the origin endpoint belongs to.
   *
   * Used to derive the egress domain for the CloudFront origin.
   */
  readonly channelGroup: IChannelGroup;

  /**
   * An optional Origin Access Control.
   *
   * @default - an Origin Access Control will be created automatically.
   */
  readonly originAccessControl?: cloudfront.IOriginAccessControlRef;

  /**
   * Optional CDN authorization configuration.
   *
   * If you need CDN auth on this endpoint, provide it here so it is configured
   * on the first `addToResourcePolicy` call. If CDN auth is added separately
   * after this origin is bound, it will be ignored.
   *
   * @default - no CDN authorization
   */
  readonly cdnAuth?: CdnAuthConfiguration;
}

/**
 * A CloudFront Origin for AWS Elemental MediaPackage V2 endpoints.
 *
 * Automatically creates an OAC and wires the origin endpoint policy
 * to grant the CloudFront distribution access.
 *
 * Uses `addToResourcePolicy()` on the origin endpoint, which is compatible
 * with other policy statements added to the same endpoint. Do not use this
 * alongside a manually created `OriginEndpointPolicy` construct for the same endpoint.
 *
 * @example
 *
 *    declare const endpoint: OriginEndpoint;
 *    declare const group: ChannelGroup;
 *
 *    new cloudfront.Distribution(this, 'Dist', {
 *      defaultBehavior: {
 *        origin: new MediaPackageV2Origin(endpoint, {
 *          channelGroup: group,
 *        }),
 *      },
 *    });
 *
 * @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-mediapackage.html
 */
export class MediaPackageV2Origin extends cloudfront.OriginBase {
  private originAccessControl?: cloudfront.IOriginAccessControlRef;
  private readonly endpoint: IOriginEndpoint;
  private readonly cdnAuth?: CdnAuthConfiguration;

  constructor(endpoint: IOriginEndpoint, props: MediaPackageV2OriginProps) {
    if (!props.channelGroup.egressDomain) {
      throw new UnscopedValidationError(
        lit`MissingEgressDomain`,
        'The channel group must have an egressDomain to use as a CloudFront origin. Provide egressDomain when importing the channel group.',
      );
    }
    super(props.channelGroup.egressDomain, props);
    this.endpoint = endpoint;
    this.originAccessControl = props.originAccessControl;
    this.cdnAuth = props.cdnAuth;
  }

  protected renderCustomOriginConfig(): cloudfront.CfnDistribution.CustomOriginConfigProperty | undefined {
    return {
      originSslProtocols: [cloudfront.OriginSslPolicy.TLS_V1_2],
      originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
    };
  }

  public bind(scope: Construct, options: cloudfront.OriginBindOptions): cloudfront.OriginBindConfig {
    const originBindConfig = super.bind(scope, options);

    if (!this.originAccessControl) {
      this.originAccessControl = new cloudfront.MediaPackageV2OriginAccessControl(scope, 'MediaPackageV2OAC');
    }

    // Grant the CloudFront distribution access to the MediaPackage V2 origin endpoint
    // Includes GetHeadObject for MQAR (Media Quality-Aware Resiliency) support
    // @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-mediapackage.html
    this.endpoint.addToResourcePolicy(
      new PolicyStatement({
        sid: 'AllowCloudFrontServicePrincipal',
        effect: Effect.ALLOW,
        principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
        actions: ['mediapackagev2:GetObject', 'mediapackagev2:GetHeadObject'],
        resources: [this.endpoint.originEndpointArn],
        conditions: {
          StringEquals: {
            'aws:SourceArn': cdk.Stack.of(scope).formatArn({
              service: 'cloudfront',
              region: '',
              resource: 'distribution',
              resourceName: options.distributionId,
            }),
          },
        },
      }),
      this.cdnAuth,
    );

    return {
      ...originBindConfig,
      originProperty: {
        ...originBindConfig.originProperty!,
        originAccessControlId: this.originAccessControl.originAccessControlRef.originAccessControlId,
      },
    };
  }
}
