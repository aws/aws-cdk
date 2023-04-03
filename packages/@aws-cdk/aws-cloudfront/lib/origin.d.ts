import { Duration } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDistribution } from './cloudfront.generated';
/**
 * The failover configuration used for Origin Groups,
 * returned in `OriginBindConfig.failoverConfig`.
 */
export interface OriginFailoverConfig {
    /** The origin to use as the fallback origin. */
    readonly failoverOrigin: IOrigin;
    /**
     * The HTTP status codes of the response that trigger querying the failover Origin.
     *
     * @default - 500, 502, 503 and 504
     */
    readonly statusCodes?: number[];
}
/** The struct returned from `IOrigin.bind`. */
export interface OriginBindConfig {
    /**
     * The CloudFormation OriginProperty configuration for this Origin.
     *
     * @default - nothing is returned
     */
    readonly originProperty?: CfnDistribution.OriginProperty;
    /**
     * The failover configuration for this Origin.
     *
     * @default - nothing is returned
     */
    readonly failoverConfig?: OriginFailoverConfig;
}
/**
 * Represents the concept of a CloudFront Origin.
 * You provide one or more origins when creating a Distribution.
 */
export interface IOrigin {
    /**
     * The method called when a given Origin is added
     * (for the first time) to a Distribution.
     */
    bind(scope: Construct, options: OriginBindOptions): OriginBindConfig;
}
/**
 * Options to define an Origin.
 */
export interface OriginOptions {
    /**
     * The number of seconds that CloudFront waits when trying to establish a connection to the origin.
     * Valid values are 1-10 seconds, inclusive.
     *
     * @default Duration.seconds(10)
     */
    readonly connectionTimeout?: Duration;
    /**
     * The number of times that CloudFront attempts to connect to the origin; valid values are 1, 2, or 3 attempts.
     *
     * @default 3
     */
    readonly connectionAttempts?: number;
    /**
     * A list of HTTP header names and values that CloudFront adds to requests it sends to the origin.
     *
     * @default {}
     */
    readonly customHeaders?: Record<string, string>;
    /**
     * When you enable Origin Shield in the AWS Region that has the lowest latency to your origin, you can get better network performance
     *
     * @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/origin-shield.html
     *
     * @default - origin shield not enabled
     */
    readonly originShieldRegion?: string;
    /**
     * Origin Shield is enabled by setting originShieldRegion to a valid region, after this to disable Origin Shield again you must set this flag to false.
     *
     * @default - true
     */
    readonly originShieldEnabled?: boolean;
    /**
     * A unique identifier for the origin. This value must be unique within the distribution.
     *
     * @default - an originid will be generated for you
     */
    readonly originId?: string;
}
/**
 * Properties to define an Origin.
 */
export interface OriginProps extends OriginOptions {
    /**
     * An optional path that CloudFront appends to the origin domain name when CloudFront requests content from the origin.
     * Must begin, but not end, with '/' (e.g., '/production/images').
     *
     * @default '/'
     */
    readonly originPath?: string;
}
/**
 * Options passed to Origin.bind().
 */
export interface OriginBindOptions {
    /**
     * The identifier of this Origin,
     * as assigned by the Distribution this Origin has been used added to.
     */
    readonly originId: string;
}
/**
 * Represents a distribution origin, that describes the Amazon S3 bucket, HTTP server (for example, a web server),
 * Amazon MediaStore, or other server from which CloudFront gets your files.
 */
export declare abstract class OriginBase implements IOrigin {
    private readonly domainName;
    private readonly originPath?;
    private readonly connectionTimeout?;
    private readonly connectionAttempts?;
    private readonly customHeaders?;
    private readonly originShieldRegion?;
    private readonly originShieldEnabled;
    private readonly originId?;
    protected constructor(domainName: string, props?: OriginProps);
    /**
     * Binds the origin to the associated Distribution. Can be used to grant permissions, create dependent resources, etc.
     */
    bind(_scope: Construct, options: OriginBindOptions): OriginBindConfig;
    protected renderS3OriginConfig(): CfnDistribution.S3OriginConfigProperty | undefined;
    protected renderCustomOriginConfig(): CfnDistribution.CustomOriginConfigProperty | undefined;
    private renderCustomHeaders;
    /**
     * If the path is defined, it must start with a '/' and not end with a '/'.
     * This method takes in the originPath, and returns it back (if undefined) or adds/removes the '/' as appropriate.
     */
    private validateOriginPath;
    /**
     * Takes origin shield region and converts to CfnDistribution.OriginShieldProperty
     */
    private renderOriginShield;
}
