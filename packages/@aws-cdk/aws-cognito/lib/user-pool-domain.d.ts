import { ICertificate } from '@aws-cdk/aws-certificatemanager';
import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IUserPool } from './user-pool';
import { UserPoolClient } from './user-pool-client';
/**
 * Represents a user pool domain.
 */
export interface IUserPoolDomain extends IResource {
    /**
     * The domain that was specified to be created.
     * If `customDomain` was selected, this holds the full domain name that was specified.
     * If the `cognitoDomain` was used, it contains the prefix to the Cognito hosted domain.
     * @attribute
     */
    readonly domainName: string;
}
/**
 * Options while specifying custom domain
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-add-custom-domain.html
 */
export interface CustomDomainOptions {
    /**
     * The custom domain name that you would like to associate with this User Pool.
     */
    readonly domainName: string;
    /**
     * The certificate to associate with this domain.
     */
    readonly certificate: ICertificate;
}
/**
 * Options while specifying a cognito prefix domain.
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-assign-domain-prefix.html
 */
export interface CognitoDomainOptions {
    /**
     * The prefix to the Cognito hosted domain name that will be associated with the user pool.
     */
    readonly domainPrefix: string;
}
/**
 * Options to create a UserPoolDomain
 */
export interface UserPoolDomainOptions {
    /**
     * Associate a custom domain with your user pool
     * Either `customDomain` or `cognitoDomain` must be specified.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-add-custom-domain.html
     * @default - not set if `cognitoDomain` is specified, otherwise, throws an error.
     */
    readonly customDomain?: CustomDomainOptions;
    /**
     * Associate a cognito prefix domain with your user pool
     * Either `customDomain` or `cognitoDomain` must be specified.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-assign-domain-prefix.html
     * @default - not set if `customDomain` is specified, otherwise, throws an error.
     */
    readonly cognitoDomain?: CognitoDomainOptions;
}
/**
 * Props for UserPoolDomain construct
 */
export interface UserPoolDomainProps extends UserPoolDomainOptions {
    /**
     * The user pool to which this domain should be associated.
     */
    readonly userPool: IUserPool;
}
/**
 * Define a user pool domain
 */
export declare class UserPoolDomain extends Resource implements IUserPoolDomain {
    /**
     * Import a UserPoolDomain given its domain name
     */
    static fromDomainName(scope: Construct, id: string, userPoolDomainName: string): IUserPoolDomain;
    readonly domainName: string;
    private isCognitoDomain;
    private cloudFrontCustomResource?;
    constructor(scope: Construct, id: string, props: UserPoolDomainProps);
    /**
     * The domain name of the CloudFront distribution associated with the user pool domain.
     */
    get cloudFrontDomainName(): string;
    /**
     * The URL to the hosted UI associated with this domain
     *
     * @param options options to customize baseUrl
     */
    baseUrl(options?: BaseUrlOptions): string;
    /**
     * The URL to the sign in page in this domain using a specific UserPoolClient
     * @param client [disable-awslint:ref-via-interface] the user pool client that the UI will use to interact with the UserPool
     * @param options options to customize signInUrl.
     */
    signInUrl(client: UserPoolClient, options: SignInUrlOptions): string;
}
/**
 * Options to customize the behaviour of `baseUrl()`
 */
export interface BaseUrlOptions {
    /**
     * Whether to return the FIPS-compliant endpoint
     *
     * @default return the standard URL
     */
    readonly fips?: boolean;
}
/**
 * Options to customize the behaviour of `signInUrl()`
 */
export interface SignInUrlOptions extends BaseUrlOptions {
    /**
     * Where to redirect to after sign in
     */
    readonly redirectUri: string;
    /**
     * The path in the URI where the sign-in page is located
     * @default '/login'
     */
    readonly signInPath?: string;
}
