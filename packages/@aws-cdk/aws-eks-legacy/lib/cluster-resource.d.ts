import * as iam from '@aws-cdk/aws-iam';
import { Construct } from 'constructs';
import { CfnClusterProps } from './eks.generated';
/**
 * A low-level CFN resource Amazon EKS cluster implemented through a custom
 * resource.
 *
 * Implements EKS create/update/delete through a CloudFormation custom resource
 * in order to allow us to control the IAM role which creates the cluster. This
 * is required in order to be able to allow CloudFormation to interact with the
 * cluster via `kubectl` to enable Kubernetes management capabilities like apply
 * manifest and IAM role/user RBAC mapping.
 */
export declare class ClusterResource extends Construct {
    /**
     * The AWS CloudFormation resource type used for this resource.
     */
    static readonly RESOURCE_TYPE = "Custom::AWSCDK-EKS-Cluster";
    readonly attrEndpoint: string;
    readonly attrArn: string;
    readonly attrCertificateAuthorityData: string;
    readonly ref: string;
    /**
     * The IAM role which created the cluster. Initially this is the only IAM role
     * that gets administrator privilages on the cluster (`system:masters`), and
     * will be able to issue `kubectl` commands against it.
     */
    readonly creationRole: iam.IRole;
    constructor(scope: Construct, id: string, props: CfnClusterProps);
}
