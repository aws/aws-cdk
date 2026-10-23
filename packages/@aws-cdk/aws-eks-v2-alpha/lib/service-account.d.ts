import { AddToPrincipalPolicyResult, IPrincipal, IRole, PolicyStatement, PrincipalPolicyFragment } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { ICluster } from './cluster';
/**
 * Enum representing the different identity types that can be used for a Kubernetes service account.
 */
export declare enum IdentityType {
    /**
     * Use the IAM Roles for Service Accounts (IRSA) identity type.
     * IRSA allows you to associate an IAM role with a Kubernetes service account.
     * This provides a way to grant permissions to Kubernetes pods by associating an IAM role with a Kubernetes service account.
     * The IAM role can then be used to provide AWS credentials to the pods, allowing them to access other AWS resources.
     *
     * When enabled, the openIdConnectProvider of the cluster would be created when you create the ServiceAccount.
     *
     * @see https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html
     */
    IRSA = "IRSA",
    /**
     * Use the EKS Pod Identities identity type.
     * EKS Pod Identities provide the ability to manage credentials for your applications, similar to the way that Amazon EC2 instance profiles
     * provide credentials to Amazon EC2 instances. Instead of creating and distributing your AWS credentials to the containers or using the
     * Amazon EC2 instance's role, you associate an IAM role with a Kubernetes service account and configure your Pods to use the service account.
     *
     * When enabled, the Pod Identity Agent AddOn of the cluster would be created when you create the ServiceAccount.
     *
     * @see https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html
     */
    POD_IDENTITY = "POD_IDENTITY"
}
/**
 * Options for `ServiceAccount`
 */
export interface ServiceAccountOptions {
    /**
     * The name of the service account.
     *
     * The name of a ServiceAccount object must be a valid DNS subdomain name.
     * https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/
     * @default - If no name is given, it will use the id of the resource.
     */
    readonly name?: string;
    /**
     * The namespace of the service account.
     *
     * All namespace names must be valid RFC 1123 DNS labels.
     * https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/#namespaces-and-dns
     * @default "default"
     */
    readonly namespace?: string;
    /**
     * Additional annotations of the service account.
     *
     * @default - no additional annotations
     */
    readonly annotations?: {
        [key: string]: string;
    };
    /**
     * Additional labels of the service account.
     *
     * @default - no additional labels
     */
    readonly labels?: {
        [key: string]: string;
    };
    /**
     * The identity type to use for the service account.
     * @default IdentityType.IRSA
     */
    readonly identityType?: IdentityType;
}
export interface ServiceAccountOptions {
    /**
     * The name of the service account.
     *
     * The name of a ServiceAccount object must be a valid DNS subdomain name.
     * https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/
     * @default - If no name is given, it will use the id of the resource.
     */
    readonly name?: string;
    /**
     * The namespace of the service account.
     *
     * All namespace names must be valid RFC 1123 DNS labels.
     * https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/#namespaces-and-dns
     * @default "default"
     */
    readonly namespace?: string;
    /**
     * Additional annotations of the service account.
     *
     * @default - no additional annotations
     */
    readonly annotations?: {
        [key: string]: string;
    };
    /**
     * Additional labels of the service account.
     *
     * @default - no additional labels
     */
    readonly labels?: {
        [key: string]: string;
    };
}
/**
 * Properties for defining service accounts
 */
export interface ServiceAccountProps extends ServiceAccountOptions {
    /**
     * The cluster to apply the patch to.
     */
    readonly cluster: ICluster;
}
/**
 * Service Account
 */
export declare class ServiceAccount extends Construct implements IPrincipal {
    /**
     * The role which is linked to the service account.
     */
    readonly role: IRole;
    readonly assumeRoleAction: string;
    readonly grantPrincipal: IPrincipal;
    readonly policyFragment: PrincipalPolicyFragment;
    /**
     * The name of the service account.
     */
    readonly serviceAccountName: string;
    /**
     * The namespace where the service account is located in.
     */
    readonly serviceAccountNamespace: string;
    constructor(scope: Construct, id: string, props: ServiceAccountProps);
    /**
     * @deprecated use `addToPrincipalPolicy()`
     */
    addToPolicy(statement: PolicyStatement): boolean;
    addToPrincipalPolicy(statement: PolicyStatement): AddToPrincipalPolicyResult;
    /**
     * If the value is a DNS subdomain name as defined in RFC 1123, from K8s docs.
     *
     * https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names
     */
    private isValidDnsSubdomainName;
    /**
     * If the value follows DNS label standard as defined in RFC 1123, from K8s docs.
     *
     * https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-label-names
     */
    private isValidDnsLabelName;
}
