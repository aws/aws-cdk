import { Resource, SecretValue } from '@aws-cdk/core';
import { Construct } from 'constructs';
/**
 * Creation properties for `GitHubSourceCredentials`.
 */
export interface GitHubSourceCredentialsProps {
    /**
     * The personal access token to use when contacting the GitHub API.
     */
    readonly accessToken: SecretValue;
}
/**
 * The source credentials used when contacting the GitHub API.
 *
 * **Note**: CodeBuild only allows a single credential for GitHub
 * to be saved in a given AWS account in a given region -
 * any attempt to add more than one will result in an error.
 *
 * @resource AWS::CodeBuild::SourceCredential
 */
export declare class GitHubSourceCredentials extends Resource {
    constructor(scope: Construct, id: string, props: GitHubSourceCredentialsProps);
}
/**
 * Creation properties for `GitHubEnterpriseSourceCredentials`.
 */
export interface GitHubEnterpriseSourceCredentialsProps {
    /**
     * The personal access token to use when contacting the
     * instance of the GitHub Enterprise API.
     */
    readonly accessToken: SecretValue;
}
/**
 * The source credentials used when contacting the GitHub Enterprise API.
 *
 * **Note**: CodeBuild only allows a single credential for GitHub Enterprise
 * to be saved in a given AWS account in a given region -
 * any attempt to add more than one will result in an error.
 *
 * @resource AWS::CodeBuild::SourceCredential
 */
export declare class GitHubEnterpriseSourceCredentials extends Resource {
    constructor(scope: Construct, id: string, props: GitHubEnterpriseSourceCredentialsProps);
}
/**
 * Construction properties of `BitBucketSourceCredentials`.
 */
export interface BitBucketSourceCredentialsProps {
    /** Your BitBucket username. */
    readonly username: SecretValue;
    /** Your BitBucket application password. */
    readonly password: SecretValue;
}
/**
 * The source credentials used when contacting the BitBucket API.
 *
 * **Note**: CodeBuild only allows a single credential for BitBucket
 * to be saved in a given AWS account in a given region -
 * any attempt to add more than one will result in an error.
 *
 * @resource AWS::CodeBuild::SourceCredential
 */
export declare class BitBucketSourceCredentials extends Resource {
    constructor(scope: Construct, id: string, props: BitBucketSourceCredentialsProps);
}
