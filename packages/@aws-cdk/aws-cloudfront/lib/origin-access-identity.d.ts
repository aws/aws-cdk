import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
/**
 * Properties of CloudFront OriginAccessIdentity
 */
export interface OriginAccessIdentityProps {
    /**
     * Any comments you want to include about the origin access identity.
     *
     * @default "Allows CloudFront to reach the bucket"
     */
    readonly comment?: string;
}
/**
 * Interface for CloudFront OriginAccessIdentity
 */
export interface IOriginAccessIdentity extends cdk.IResource, iam.IGrantable {
    /**
     * The Origin Access Identity Id (physical id)
     * It is misnamed and superseded by the correctly named originAccessIdentityId
     *
     * @deprecated use originAccessIdentityId instead
     */
    readonly originAccessIdentityName: string;
    /**
     * The Origin Access Identity Id (physical id)
     * This was called originAccessIdentityName before
     */
    readonly originAccessIdentityId: string;
}
declare abstract class OriginAccessIdentityBase extends cdk.Resource {
    /**
     * The Origin Access Identity Id (physical id)
     * It is misnamed and superseded by the correctly named originAccessIdentityId
     *
     * @deprecated use originAccessIdentityId instead
     */
    abstract readonly originAccessIdentityName: string;
    /**
     * The Origin Access Identity Id (physical id)
     * This was called originAccessIdentityName before
     */
    abstract readonly originAccessIdentityId: string;
    /**
     * Derived principal value for bucket access
     */
    abstract readonly grantPrincipal: iam.IPrincipal;
    /**
     * The ARN to include in S3 bucket policy to allow CloudFront access
     */
    protected arn(): string;
}
/**
 * An origin access identity is a special CloudFront user that you can
 * associate with Amazon S3 origins, so that you can secure all or just some of
 * your Amazon S3 content.
 *
 * @resource AWS::CloudFront::CloudFrontOriginAccessIdentity
 */
export declare class OriginAccessIdentity extends OriginAccessIdentityBase implements IOriginAccessIdentity {
    /**
     * Creates a OriginAccessIdentity by providing the OriginAccessIdentityId.
     * It is misnamed and superseded by the correctly named fromOriginAccessIdentityId.
     *
     * @deprecated use `fromOriginAccessIdentityId`
     */
    static fromOriginAccessIdentityName(scope: Construct, id: string, originAccessIdentityName: string): IOriginAccessIdentity;
    /**
     * Creates a OriginAccessIdentity by providing the OriginAccessIdentityId.
     */
    static fromOriginAccessIdentityId(scope: Construct, id: string, originAccessIdentityId: string): IOriginAccessIdentity;
    /**
     * The Amazon S3 canonical user ID for the origin access identity, used when
     * giving the origin access identity read permission to an object in Amazon
     * S3.
     *
     * @attribute
     */
    readonly cloudFrontOriginAccessIdentityS3CanonicalUserId: string;
    /**
     * Derived principal value for bucket access
     */
    readonly grantPrincipal: iam.IPrincipal;
    /**
     * The Origin Access Identity Id (physical id)
     * It is misnamed and superseded by the correctly named originAccessIdentityId
     *
     * @attribute
     * @deprecated use originAccessIdentityId instead
     */
    get originAccessIdentityName(): string;
    /**
     * The Origin Access Identity Id (physical id)
     * This was called originAccessIdentityName before
     *
     * @attribute
     */
    readonly originAccessIdentityId: string;
    /**
     * CDK L1 resource
     */
    private readonly resource;
    constructor(scope: Construct, id: string, props?: OriginAccessIdentityProps);
}
export {};
