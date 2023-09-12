import { Construct } from 'constructs';
import { EksContainerDefinition } from './eks-container-definition';
import { IJobDefinition, JobDefinitionBase, JobDefinitionProps } from './job-definition-base';
/**
 * A JobDefinition that uses Eks orchestration
 */
export interface IEksJobDefinition extends IJobDefinition {
    /**
     * The container this Job Definition will run
     */
    readonly container: EksContainerDefinition;
    /**
     * The DNS Policy of the pod used by this Job Definition
     *
     * @see https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/#pod-s-dns-policy
     *
     * @default `DnsPolicy.CLUSTER_FIRST`
     */
    readonly dnsPolicy?: DnsPolicy;
    /**
     * If specified, the Pod used by this Job Definition will use the host's network IP address.
     * Otherwise, the Kubernetes pod networking model is enabled.
     * Most AWS Batch workloads are egress-only and don't require the overhead of IP allocation for each pod for incoming connections.
     *
     * @default true
     *
     * @see https://kubernetes.io/docs/concepts/security/pod-security-policy/#host-namespaces
     * @see https://kubernetes.io/docs/concepts/workloads/pods/#pod-networking
     */
    readonly useHostNetwork?: boolean;
    /**
     * The name of the service account that's used to run the container.
     * service accounts are Kubernetes method of identification and authentication,
     * roughly analogous to IAM users.
     *
     * @see https://docs.aws.amazon.com/eks/latest/userguide/service-accounts.html
     * @see https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/
     * @see https://docs.aws.amazon.com/eks/latest/userguide/associate-service-account-role.html
     *
     * @default - the default service account of the container
     */
    readonly serviceAccount?: string;
}
/**
 * Props for EksJobDefinition
 */
export interface EksJobDefinitionProps extends JobDefinitionProps {
    /**
     * The container this Job Definition will run
     */
    readonly container: EksContainerDefinition;
    /**
     * The DNS Policy of the pod used by this Job Definition
     *
     * @see https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/#pod-s-dns-policy
     *
     * @default `DnsPolicy.CLUSTER_FIRST`
     */
    readonly dnsPolicy?: DnsPolicy;
    /**
     * If specified, the Pod used by this Job Definition will use the host's network IP address.
     * Otherwise, the Kubernetes pod networking model is enabled.
     * Most AWS Batch workloads are egress-only and don't require the overhead of IP allocation for each pod for incoming connections.
     *
     * @default true
     *
     * @see https://kubernetes.io/docs/concepts/security/pod-security-policy/#host-namespaces
     * @see https://kubernetes.io/docs/concepts/workloads/pods/#pod-networking
     */
    readonly useHostNetwork?: boolean;
    /**
     * The name of the service account that's used to run the container.
     * service accounts are Kubernetes method of identification and authentication,
     * roughly analogous to IAM users.
     *
     * @see https://docs.aws.amazon.com/eks/latest/userguide/service-accounts.html
     * @see https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/
     * @see https://docs.aws.amazon.com/eks/latest/userguide/associate-service-account-role.html
     *
     * @default - the default service account of the container
     */
    readonly serviceAccount?: string;
}
/**
 * The DNS Policy for the pod used by the Job Definition
 *
 * @see https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/#pod-s-dns-policy
 */
export declare enum DnsPolicy {
    /**
     * The Pod inherits the name resolution configuration from the node that the Pods run on
     */
    DEFAULT = "Default",
    /**
     * Any DNS query that does not match the configured cluster domain suffix, such as `"www.kubernetes.io"`,
     * is forwarded to an upstream nameserver by the DNS server.
     * Cluster administrators may have extra stub-domain and upstream DNS servers configured.
     */
    CLUSTER_FIRST = "ClusterFirst",
    /**
     * For Pods running with `hostNetwork`, you should explicitly set its DNS policy to `CLUSTER_FIRST_WITH_HOST_NET`.
     * Otherwise, Pods running with `hostNetwork` and `CLUSTER_FIRST` will fallback to the behavior of the `DEFAULT` policy.
     */
    CLUSTER_FIRST_WITH_HOST_NET = "ClusterFirstWithHostNet"
}
/**
 * A JobDefinition that uses Eks orchestration
 *
 * @resource AWS::Batch::JobDefinition
 */
export declare class EksJobDefinition extends JobDefinitionBase implements IEksJobDefinition {
    /**
     * Import an EksJobDefinition by its arn
     */
    static fromEksJobDefinitionArn(scope: Construct, id: string, eksJobDefinitionArn: string): IEksJobDefinition;
    readonly container: EksContainerDefinition;
    readonly dnsPolicy?: DnsPolicy;
    readonly useHostNetwork?: boolean;
    readonly serviceAccount?: string;
    readonly jobDefinitionArn: string;
    readonly jobDefinitionName: string;
    constructor(scope: Construct, id: string, props: EksJobDefinitionProps);
}
