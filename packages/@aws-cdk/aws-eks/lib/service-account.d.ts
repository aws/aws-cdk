import { AddToPrincipalPolicyResult, IPrincipal, IRole, PolicyStatement, PrincipalPolicyFragment } from '@aws-cdk/aws-iam';
import { Construct } from 'constructs';
import { ICluster } from './cluster';
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
