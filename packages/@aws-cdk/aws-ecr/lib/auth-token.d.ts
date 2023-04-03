import * as iam from '@aws-cdk/aws-iam';
/**
 * Authorization token to access private ECR repositories in the current environment via Docker CLI.
 *
 * @see https://docs.aws.amazon.com/AmazonECR/latest/userguide/registry_auth.html
 */
export declare class AuthorizationToken {
    /**
     * Grant access to retrieve an authorization token.
     */
    static grantRead(grantee: iam.IGrantable): void;
    private constructor();
}
/**
 * Authorization token to access the global public ECR Gallery via Docker CLI.
 *
 * @see https://docs.aws.amazon.com/AmazonECR/latest/public/public-registries.html#public-registry-auth
 */
export declare class PublicGalleryAuthorizationToken {
    /**
     * Grant access to retrieve an authorization token.
     */
    static grantRead(grantee: iam.IGrantable): void;
    private constructor();
}
