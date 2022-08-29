import * as iam from '@aws-cdk/aws-iam';
import { Construct } from 'constructs';
import { Mapping } from './aws-auth-mapping';
import { Cluster } from './cluster';
export interface AwsAuthProps {
    /**
     * The EKS cluster to apply this configuration to.
     *
     * [disable-awslint:ref-via-interface]
     */
    readonly cluster: Cluster;
}
/**
 * Manages mapping between IAM users and roles to Kubernetes RBAC configuration.
 *
 * @see https://docs.aws.amazon.com/en_us/eks/latest/userguide/add-user-role.html
 */
export declare class AwsAuth extends Construct {
    private readonly stack;
    private readonly roleMappings;
    private readonly userMappings;
    private readonly accounts;
    constructor(scope: Construct, id: string, props: AwsAuthProps);
    /**
     * Adds the specified IAM role to the `system:masters` RBAC group, which means
     * that anyone that can assume it will be able to administer this Kubernetes system.
     *
     * @param role The IAM role to add
     * @param username Optional user (defaults to the role ARN)
     */
    addMastersRole(role: iam.IRole, username?: string): void;
    /**
     * Adds a mapping between an IAM role to a Kubernetes user and groups.
     *
     * @param role The IAM role to map
     * @param mapping Mapping to k8s user name and groups
     */
    addRoleMapping(role: iam.IRole, mapping: Mapping): void;
    /**
     * Adds a mapping between an IAM user to a Kubernetes user and groups.
     *
     * @param user The IAM user to map
     * @param mapping Mapping to k8s user name and groups
     */
    addUserMapping(user: iam.IUser, mapping: Mapping): void;
    /**
     * Additional AWS account to add to the aws-auth configmap.
     * @param accountId account number
     */
    addAccount(accountId: string): void;
    private synthesizeMapRoles;
    private synthesizeMapUsers;
    private synthesizeMapAccounts;
}
