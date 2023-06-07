import { aws_iam as iam, aws_ec2 as ec2, aws_s3 as s3, aws_logs as logs, aws_kinesis as kinesis } from 'aws-cdk-lib';
import * as core from 'aws-cdk-lib';
import * as constructs from 'constructs';
import { Service } from './index';
export declare enum AuthType {
    NONE = "NONE",
    AWS_IAM = "AWS_IAM"
}
/**
 * Properties to share a Service Network
 */
export interface ShareServiceNetworkProps {
    /**
     * The name of the share.
     */
    readonly name: string;
    /**
     * Are external Principals allowed
     * @default false;
     */
    readonly allowExternalPrincipals?: boolean | undefined;
    /**
     * Principals to share the Service Network with
     * @default none
     */
    readonly principals?: string[] | undefined;
}
/**
 * Properties to associate a VPC with a Service Network
 */
export interface AssociateVPCProps {
    /**
     * The VPC to associate with the Service Network
     */
    readonly vpc: ec2.IVpc;
    /**
     * The security groups to associate with the Service Network
     * @default a security group that allows inbound 443 will be permitted.
     */
    readonly securityGroups?: ec2.SecurityGroup[] | undefined;
}
/**
 * Create a vpc lattice service network.
 * Implemented by `ServiceNetwork`.
 */
export interface IServiceNetwork extends core.IResource {
    /**
    * The Amazon Resource Name (ARN) of the service network.
    */
    readonly serviceNetworkArn: string;
    /**
     * The Id of the Service Network
     */
    readonly serviceNetworkId: string;
    /**
     * Grant Princopals access to the Service Network
     */
    grantAccessToServiceNetwork(principal: iam.IPrincipal[]): void;
    /**
     * Add Lattice Service Policy
     */
    addService(service: Service): void;
    /**
     * Associate a VPC with the Service Network
     */
    associateVPC(props: AssociateVPCProps): void;
    /**
     * Log To S3
     */
    logToS3(bucket: s3.Bucket | s3.IBucket): void;
    /**
     * Send Events to Cloud Watch
     */
    sendToCloudWatch(log: logs.LogGroup | logs.ILogGroup): void;
    /**
     * Stream to Kinesis
     */
    streamToKinesis(stream: kinesis.Stream | kinesis.IStream): void;
    /**
     * Share the ServiceNetwork
     */
    share(props: ShareServiceNetworkProps): void;
    /**
     * Create and Add an auth policy to the Service Network
     */
    applyAuthPolicyToServiceNetwork(): void;
}
/**
 * The properties for the ServiceNetwork.
 */
export interface ServiceNetworkProps {
    /** The name of the Service Network. If not provided Cloudformation will provide
     * a name
     * @default cloudformation generated name
     */
    readonly name?: string;
    /** The type of  authentication to use with the Service Network.
     * @default 'AWS_IAM'
     */
    readonly authType?: AuthType | undefined;
    /**
     * S3 buckets for access logs
     * @default no s3 logging
     */
    readonly s3LogDestination?: s3.IBucket[] | undefined;
    /**
     * Cloudwatch Logs
     * @default no logging to cloudwatch
     */
    readonly cloudwatchLogs?: logs.ILogGroup[] | undefined;
    /**
     * kinesis streams
     * @default no streaming to Kinesis
     */
    readonly kinesisStreams?: kinesis.IStream[];
    /**
     * Lattice Services that are assocaited with this Service Network
     * @default no services are associated with the service network
     */
    readonly services?: Service[] | undefined;
    /**
     * Vpcs that are associated with this Service Network
     * @default no vpcs are associated
     */
    readonly vpcs?: ec2.IVpc[] | undefined;
    /**
     * Account principals that are permitted to use this service
     * @default none
     */
    readonly accounts?: iam.AccountPrincipal[] | undefined;
    /**
     * arnToShareWith, use this for specifying Orgs and OU's
     * @default false
     */
    readonly arnToShareServiceWith?: string[] | undefined;
    /**
     * Allow external principals
     * @default false
     */
    readonly allowExternalPrincipals?: boolean | undefined;
    /**
     * Reject Anonymous Access to the Service
     * @default false
     */
    readonly rejectAnonymousAccess?: boolean | undefined;
}
/**
 * Create a vpcLattice Service Network.
 */
export declare class ServiceNetwork extends core.Resource implements IServiceNetwork {
    /**
     * The Arn of the service network
     */
    readonly serviceNetworkArn: string;
    /**
     * The Id of the Service Network
     */
    readonly serviceNetworkId: string;
    /**
     * the authType of the service network
     */
    authType: AuthType | undefined;
    /**
     * policy document to be used.
     */
    /**
     * A managed Policy that is the auth policy
     */
    authPolicy: iam.PolicyDocument;
    constructor(scope: constructs.Construct, id: string, props: ServiceNetworkProps);
    /**
     * This will give the principals access to all resources that are on this
     * service network. This is a broad permission.
     * Consider granting Access at the Service
     * addToResourcePolicy()
     *
     */
    grantAccessToServiceNetwork(principals: iam.IPrincipal[]): void;
    applyAuthPolicyToServiceNetwork(): void;
    /**
     * Add A lattice service to a lattice network
     * @param service
     */
    addService(service: Service): void;
    /**
     * Associate a VPC with the Service Network
     * This provides an opinionated default of adding a security group to allow inbound 443
     */
    associateVPC(props: AssociateVPCProps): void;
    /**
     * Send logs to a S3 bucket.
     * @param bucket
     */
    logToS3(bucket: s3.Bucket | s3.IBucket): void;
    /**
     * Send event to Cloudwatch
     * @param log
     */
    sendToCloudWatch(log: logs.LogGroup | logs.ILogGroup): void;
    /**
     * Stream Events to Kinesis
     * @param stream
     */
    streamToKinesis(stream: kinesis.Stream | kinesis.IStream): void;
    /**
     * Share the The Service network using RAM
     * @param props ShareServiceNetwork
     */
    share(props: ShareServiceNetworkProps): void;
}
