import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as lambda from '@aws-cdk/aws-lambda';
import { ArnComponents } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnCluster } from './eks.generated';
export interface ClusterResourceProps {
    readonly resourcesVpcConfig: CfnCluster.ResourcesVpcConfigProperty;
    readonly roleArn: string;
    readonly encryptionConfig?: Array<CfnCluster.EncryptionConfigProperty>;
    readonly kubernetesNetworkConfig?: CfnCluster.KubernetesNetworkConfigProperty;
    readonly name: string;
    readonly version?: string;
    readonly endpointPrivateAccess: boolean;
    readonly endpointPublicAccess: boolean;
    readonly publicAccessCidrs?: string[];
    readonly vpc: ec2.IVpc;
    readonly environment?: {
        [key: string]: string;
    };
    readonly subnets?: ec2.ISubnet[];
    readonly secretsEncryptionKey?: kms.IKey;
    readonly onEventLayer?: lambda.ILayerVersion;
    readonly clusterHandlerSecurityGroup?: ec2.ISecurityGroup;
    readonly tags?: {
        [key: string]: string;
    };
    readonly logging?: {
        [key: string]: [{
            [key: string]: any;
        }];
    };
}
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
    readonly attrEndpoint: string;
    readonly attrArn: string;
    readonly attrCertificateAuthorityData: string;
    readonly attrClusterSecurityGroupId: string;
    readonly attrEncryptionConfigKeyArn: string;
    readonly attrOpenIdConnectIssuerUrl: string;
    readonly attrOpenIdConnectIssuer: string;
    readonly ref: string;
    readonly adminRole: iam.Role;
    constructor(scope: Construct, id: string, props: ClusterResourceProps);
    private createAdminRole;
}
export declare function clusterArnComponents(clusterName: string): ArnComponents;
