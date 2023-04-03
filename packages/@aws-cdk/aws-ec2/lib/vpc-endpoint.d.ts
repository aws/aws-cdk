import * as iam from '@aws-cdk/aws-iam';
import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Connections, IConnectable } from './connections';
import { ISecurityGroup } from './security-group';
import { IVpc, SubnetSelection } from './vpc';
/**
 * A VPC endpoint.
 */
export interface IVpcEndpoint extends IResource {
    /**
     * The VPC endpoint identifier.
     * @attribute
     */
    readonly vpcEndpointId: string;
}
export declare abstract class VpcEndpoint extends Resource implements IVpcEndpoint {
    abstract readonly vpcEndpointId: string;
    protected policyDocument?: iam.PolicyDocument;
    /**
     * Adds a statement to the policy document of the VPC endpoint. The statement
     * must have a Principal.
     *
     * Not all interface VPC endpoints support policy. For more information
     * see https://docs.aws.amazon.com/vpc/latest/userguide/vpce-interface.html
     *
     * @param statement the IAM statement to add
     */
    addToPolicy(statement: iam.PolicyStatement): void;
}
/**
 * A gateway VPC endpoint.
 */
export interface IGatewayVpcEndpoint extends IVpcEndpoint {
}
/**
 * The type of VPC endpoint.
 */
export declare enum VpcEndpointType {
    /**
     * Interface
     *
     * An interface endpoint is an elastic network interface with a private IP
     * address that serves as an entry point for traffic destined to a supported
     * service.
     */
    INTERFACE = "Interface",
    /**
     * Gateway
     *
     * A gateway endpoint is a gateway that is a target for a specified route in
     * your route table, used for traffic destined to a supported AWS service.
     */
    GATEWAY = "Gateway"
}
/**
 * A service for a gateway VPC endpoint.
 */
export interface IGatewayVpcEndpointService {
    /**
     * The name of the service.
     */
    readonly name: string;
}
/**
 * An AWS service for a gateway VPC endpoint.
 */
export declare class GatewayVpcEndpointAwsService implements IGatewayVpcEndpointService {
    static readonly DYNAMODB: GatewayVpcEndpointAwsService;
    static readonly S3: GatewayVpcEndpointAwsService;
    /**
     * The name of the service.
     */
    readonly name: string;
    constructor(name: string, prefix?: string);
}
/**
 * Options to add a gateway endpoint to a VPC.
 */
export interface GatewayVpcEndpointOptions {
    /**
     * The service to use for this gateway VPC endpoint.
     */
    readonly service: IGatewayVpcEndpointService;
    /**
     * Where to add endpoint routing.
     *
     * By default, this endpoint will be routable from all subnets in the VPC.
     * Specify a list of subnet selection objects here to be more specific.
     *
     * @default - All subnets in the VPC
     * @example
     *
     * declare const vpc: ec2.Vpc;
     *
     * vpc.addGatewayEndpoint('DynamoDbEndpoint', {
     *   service: ec2.GatewayVpcEndpointAwsService.DYNAMODB,
     *   // Add only to ISOLATED subnets
     *   subnets: [
     *     { subnetType: ec2.SubnetType.PRIVATE_ISOLATED }
     *   ]
     * });
     *
     *
     */
    readonly subnets?: SubnetSelection[];
}
/**
 * Construction properties for a GatewayVpcEndpoint.
 */
export interface GatewayVpcEndpointProps extends GatewayVpcEndpointOptions {
    /**
     * The VPC network in which the gateway endpoint will be used.
     */
    readonly vpc: IVpc;
}
/**
 * A gateway VPC endpoint.
 * @resource AWS::EC2::VPCEndpoint
 */
export declare class GatewayVpcEndpoint extends VpcEndpoint implements IGatewayVpcEndpoint {
    static fromGatewayVpcEndpointId(scope: Construct, id: string, gatewayVpcEndpointId: string): IGatewayVpcEndpoint;
    /**
     * The gateway VPC endpoint identifier.
     */
    readonly vpcEndpointId: string;
    /**
     * The date and time the gateway VPC endpoint was created.
     * @attribute
     */
    readonly vpcEndpointCreationTimestamp: string;
    /**
     * @attribute
     */
    readonly vpcEndpointNetworkInterfaceIds: string[];
    /**
     * @attribute
     */
    readonly vpcEndpointDnsEntries: string[];
    constructor(scope: Construct, id: string, props: GatewayVpcEndpointProps);
}
/**
 * A service for an interface VPC endpoint.
 */
export interface IInterfaceVpcEndpointService {
    /**
     * The name of the service.
     */
    readonly name: string;
    /**
     * The port of the service.
     */
    readonly port: number;
    /**
     * Whether Private DNS is supported by default.
     */
    readonly privateDnsDefault?: boolean;
}
/**
 * A custom-hosted service for an interface VPC endpoint.
 */
export declare class InterfaceVpcEndpointService implements IInterfaceVpcEndpointService {
    /**
     * The name of the service.
     */
    readonly name: string;
    /**
     * The port of the service.
     */
    readonly port: number;
    /**
     * Whether Private DNS is supported by default.
     */
    readonly privateDnsDefault?: boolean;
    constructor(name: string, port?: number);
}
/**
 * An AWS service for an interface VPC endpoint.
 */
export declare class InterfaceVpcEndpointAwsService implements IInterfaceVpcEndpointService {
    static readonly SAGEMAKER_STUDIO: InterfaceVpcEndpointAwsService;
    static readonly SAGEMAKER_NOTEBOOK: InterfaceVpcEndpointAwsService;
    static readonly KENDRA_RANKING: InterfaceVpcEndpointAwsService;
    static readonly ACCESS_ANALYZER: InterfaceVpcEndpointAwsService;
    static readonly ACCOUNT_MANAGEMENT: InterfaceVpcEndpointAwsService;
    static readonly APP_MESH: InterfaceVpcEndpointAwsService;
    static readonly APP_RUNNER: InterfaceVpcEndpointAwsService;
    static readonly APP_RUNNER_REQUESTS: InterfaceVpcEndpointAwsService;
    static readonly APPLICATION_MIGRATION_SERVICE: InterfaceVpcEndpointAwsService;
    static readonly APPSTREAM_API: InterfaceVpcEndpointAwsService;
    static readonly APPSTREAM_STREAMING: InterfaceVpcEndpointAwsService;
    static readonly ATHENA: InterfaceVpcEndpointAwsService;
    static readonly AUDIT_MANAGER: InterfaceVpcEndpointAwsService;
    static readonly APPLICATION_AUTOSCALING: InterfaceVpcEndpointAwsService;
    static readonly AUTOSCALING: InterfaceVpcEndpointAwsService;
    static readonly AUTOSCALING_PLANS: InterfaceVpcEndpointAwsService;
    static readonly BACKUP: InterfaceVpcEndpointAwsService;
    static readonly BACKUP_GATEWAY: InterfaceVpcEndpointAwsService;
    static readonly BATCH: InterfaceVpcEndpointAwsService;
    static readonly BILLING_CONDUCTOR: InterfaceVpcEndpointAwsService;
    static readonly BRAKET: InterfaceVpcEndpointAwsService;
    static readonly PRIVATE_CERTIFICATE_AUTHORITY: InterfaceVpcEndpointAwsService;
    static readonly CLOUD_CONTROL_API: InterfaceVpcEndpointAwsService;
    static readonly CLOUD_CONTROL_API_FIPS: InterfaceVpcEndpointAwsService;
    static readonly CLOUD_DIRECTORY: InterfaceVpcEndpointAwsService;
    static readonly CLOUDFORMATION: InterfaceVpcEndpointAwsService;
    static readonly CLOUDHSM: InterfaceVpcEndpointAwsService;
    static readonly CLOUDTRAIL: InterfaceVpcEndpointAwsService;
    static readonly CLOUDWATCH_EVIDENTLY: InterfaceVpcEndpointAwsService;
    static readonly CLOUDWATCH_EVIDENTLY_DATAPLANE: InterfaceVpcEndpointAwsService;
    static readonly CLOUDWATCH_MONITORING: InterfaceVpcEndpointAwsService;
    static readonly CLOUDWATCH_RUM: InterfaceVpcEndpointAwsService;
    static readonly CLOUDWATCH_RUM_DATAPLANE: InterfaceVpcEndpointAwsService;
    static readonly CLOUDWATCH_SYNTHETICS: InterfaceVpcEndpointAwsService;
    static readonly CODEARTIFACT_API: InterfaceVpcEndpointAwsService;
    static readonly CODEARTIFACT_REPOSITORIES: InterfaceVpcEndpointAwsService;
    static readonly CODEBUILD: InterfaceVpcEndpointAwsService;
    static readonly CODEBUILD_FIPS: InterfaceVpcEndpointAwsService;
    static readonly CODECOMMIT: InterfaceVpcEndpointAwsService;
    static readonly CODECOMMIT_FIPS: InterfaceVpcEndpointAwsService;
    static readonly CODEDEPLOY: InterfaceVpcEndpointAwsService;
    static readonly CODEDEPLOY_COMMANDS_SECURE: InterfaceVpcEndpointAwsService;
    static readonly CODEGURU_PROFILER: InterfaceVpcEndpointAwsService;
    static readonly CODEGURU_REVIEWER: InterfaceVpcEndpointAwsService;
    static readonly CODEPIPELINE: InterfaceVpcEndpointAwsService;
    static readonly CODESTAR_CONNECTIONS: InterfaceVpcEndpointAwsService;
    static readonly COMPREHEND: InterfaceVpcEndpointAwsService;
    static readonly COMPREHEND_MEDICAL: InterfaceVpcEndpointAwsService;
    static readonly CONFIG: InterfaceVpcEndpointAwsService;
    static readonly CONNECT_APP_INTEGRATIONS: InterfaceVpcEndpointAwsService;
    static readonly CONNECT_CASES: InterfaceVpcEndpointAwsService;
    static readonly CONNECT_CONNECT_CAMPAIGNS: InterfaceVpcEndpointAwsService;
    static readonly CONNECT_PROFILE: InterfaceVpcEndpointAwsService;
    static readonly CONNECT_VOICEID: InterfaceVpcEndpointAwsService;
    static readonly CONNECT_WISDOM: InterfaceVpcEndpointAwsService;
    static readonly DATA_EXCHANGE: InterfaceVpcEndpointAwsService;
    static readonly DATABASE_MIGRATION_SERVICE: InterfaceVpcEndpointAwsService;
    static readonly DATABASE_MIGRATION_SERVICE_FIPS: InterfaceVpcEndpointAwsService;
    static readonly DATASYNC: InterfaceVpcEndpointAwsService;
    static readonly DEVOPS_GURU: InterfaceVpcEndpointAwsService;
    static readonly EBS_DIRECT: InterfaceVpcEndpointAwsService;
    static readonly EC2: InterfaceVpcEndpointAwsService;
    static readonly EC2_MESSAGES: InterfaceVpcEndpointAwsService;
    static readonly IMAGE_BUILDER: InterfaceVpcEndpointAwsService;
    static readonly ECR: InterfaceVpcEndpointAwsService;
    static readonly ECR_DOCKER: InterfaceVpcEndpointAwsService;
    static readonly ECS: InterfaceVpcEndpointAwsService;
    static readonly ECS_AGENT: InterfaceVpcEndpointAwsService;
    static readonly ECS_TELEMETRY: InterfaceVpcEndpointAwsService;
    static readonly EKS: InterfaceVpcEndpointAwsService;
    static readonly ELASTIC_BEANSTALK: InterfaceVpcEndpointAwsService;
    static readonly ELASTIC_BEANSTALK_HEALTH: InterfaceVpcEndpointAwsService;
    static readonly ELASTIC_DISASTER_RECOVERY: InterfaceVpcEndpointAwsService;
    static readonly ELASTIC_FILESYSTEM: InterfaceVpcEndpointAwsService;
    static readonly ELASTIC_FILESYSTEM_FIPS: InterfaceVpcEndpointAwsService;
    static readonly ELASTIC_INFERENCE_RUNTIME: InterfaceVpcEndpointAwsService;
    static readonly ELASTIC_LOAD_BALANCING: InterfaceVpcEndpointAwsService;
    static readonly ELASTICACHE: InterfaceVpcEndpointAwsService;
    static readonly ELASTICACHE_FIPS: InterfaceVpcEndpointAwsService;
    static readonly EMR: InterfaceVpcEndpointAwsService;
    static readonly EMR_EKS: InterfaceVpcEndpointAwsService;
    static readonly EMR_SERVERLESS: InterfaceVpcEndpointAwsService;
    static readonly CLOUDWATCH_EVENTS: InterfaceVpcEndpointAwsService;
    static readonly EVENTBRIDGE: InterfaceVpcEndpointAwsService;
    static readonly APIGATEWAY: InterfaceVpcEndpointAwsService;
    static readonly FAULT_INJECTION_SIMULATOR: InterfaceVpcEndpointAwsService;
    static readonly FINSPACE: InterfaceVpcEndpointAwsService;
    static readonly FINSPACE_API: InterfaceVpcEndpointAwsService;
    static readonly FORECAST: InterfaceVpcEndpointAwsService;
    static readonly FORECAST_QUERY: InterfaceVpcEndpointAwsService;
    static readonly FORECAST_FIPS: InterfaceVpcEndpointAwsService;
    static readonly FORECAST_QUERY_FIPS: InterfaceVpcEndpointAwsService;
    static readonly FRAUD_DETECTOR: InterfaceVpcEndpointAwsService;
    static readonly FSX: InterfaceVpcEndpointAwsService;
    static readonly FSX_FIPS: InterfaceVpcEndpointAwsService;
    static readonly CODECOMMIT_GIT: InterfaceVpcEndpointAwsService;
    static readonly CODECOMMIT_GIT_FIPS: InterfaceVpcEndpointAwsService;
    static readonly GLUE: InterfaceVpcEndpointAwsService;
    static readonly GLUE_DATABREW: InterfaceVpcEndpointAwsService;
    static readonly GRAFANA: InterfaceVpcEndpointAwsService;
    static readonly GRAFANA_WORKSPACE: InterfaceVpcEndpointAwsService;
    static readonly GROUNDSTATION: InterfaceVpcEndpointAwsService;
    static readonly HEALTHLAKE: InterfaceVpcEndpointAwsService;
    static readonly IAM_IDENTITY_CENTER: InterfaceVpcEndpointAwsService;
    static readonly IAM_ROLES_ANYWHERE: InterfaceVpcEndpointAwsService;
    static readonly INSPECTOR: InterfaceVpcEndpointAwsService;
    static readonly IOT_CORE: InterfaceVpcEndpointAwsService;
    static readonly IOT_CORE_DEVICE_ADVISOR: InterfaceVpcEndpointAwsService;
    static readonly IOT_CORE_FOR_LORAWAN: InterfaceVpcEndpointAwsService;
    static readonly IOT_LORAWAN_CUPS: InterfaceVpcEndpointAwsService;
    static readonly IOT_LORAWAN_LNS: InterfaceVpcEndpointAwsService;
    static readonly IOT_GREENGRASS: InterfaceVpcEndpointAwsService;
    static readonly IOT_ROBORUNNER: InterfaceVpcEndpointAwsService;
    static readonly IOT_SITEWISE_API: InterfaceVpcEndpointAwsService;
    static readonly IOT_SITEWISE_DATA: InterfaceVpcEndpointAwsService;
    static readonly IOT_TWINMAKER_API: InterfaceVpcEndpointAwsService;
    static readonly IOT_TWINMAKER_DATA: InterfaceVpcEndpointAwsService;
    static readonly KENDRA: InterfaceVpcEndpointAwsService;
    static readonly KEYSPACES: InterfaceVpcEndpointAwsService;
    static readonly KEYSPACES_FIPS: InterfaceVpcEndpointAwsService;
    static readonly KINESIS_STREAMS: InterfaceVpcEndpointAwsService;
    static readonly KINESIS_FIREHOSE: InterfaceVpcEndpointAwsService;
    static readonly KMS: InterfaceVpcEndpointAwsService;
    static readonly KMS_FIPS: InterfaceVpcEndpointAwsService;
    static readonly LAKE_FORMATION: InterfaceVpcEndpointAwsService;
    static readonly CLOUDWATCH_LOGS: InterfaceVpcEndpointAwsService;
    static readonly CLOUDWATCH: InterfaceVpcEndpointAwsService;
    static readonly LAMBDA: InterfaceVpcEndpointAwsService;
    static readonly LEX_MODELS: InterfaceVpcEndpointAwsService;
    static readonly LEX_RUNTIME: InterfaceVpcEndpointAwsService;
    static readonly LICENSE_MANAGER: InterfaceVpcEndpointAwsService;
    static readonly LICENSE_MANAGER_FIPS: InterfaceVpcEndpointAwsService;
    static readonly LOOKOUT_EQUIPMENT: InterfaceVpcEndpointAwsService;
    static readonly LOOKOUT_METRICS: InterfaceVpcEndpointAwsService;
    static readonly LOOKOUT_VISION: InterfaceVpcEndpointAwsService;
    static readonly MACIE: InterfaceVpcEndpointAwsService;
    static readonly MAINFRAME_MODERNIZATION: InterfaceVpcEndpointAwsService;
    static readonly PROMETHEUS: InterfaceVpcEndpointAwsService;
    static readonly PROMETHEUS_WORKSPACES: InterfaceVpcEndpointAwsService;
    static readonly AIRFLOW_API: InterfaceVpcEndpointAwsService;
    static readonly AIRFLOW_ENV: InterfaceVpcEndpointAwsService;
    static readonly AIRFLOW_OPS: InterfaceVpcEndpointAwsService;
    static readonly MEMORY_DB: InterfaceVpcEndpointAwsService;
    static readonly MEMORY_DB_FIPS: InterfaceVpcEndpointAwsService;
    static readonly MIGRATIONHUB_ORCHESTRATOR: InterfaceVpcEndpointAwsService;
    static readonly MIGRATIONHUB_REFACTOR_SPACES: InterfaceVpcEndpointAwsService;
    static readonly MIGRATIONHUB_STRATEGY: InterfaceVpcEndpointAwsService;
    static readonly NIMBLE_STUDIO: InterfaceVpcEndpointAwsService;
    static readonly OMICS_ANALYTICS: InterfaceVpcEndpointAwsService;
    static readonly OMICS_CONTROL_STORAGE: InterfaceVpcEndpointAwsService;
    static readonly OMICS_STORAGE: InterfaceVpcEndpointAwsService;
    static readonly OMICS_TAGS: InterfaceVpcEndpointAwsService;
    static readonly OMICS_WORKFLOWS: InterfaceVpcEndpointAwsService;
    static readonly PANORAMA: InterfaceVpcEndpointAwsService;
    static readonly PINPOINT: InterfaceVpcEndpointAwsService;
    static readonly POLLY: InterfaceVpcEndpointAwsService;
    static readonly PRIVATE_5G: InterfaceVpcEndpointAwsService;
    static readonly PROTON: InterfaceVpcEndpointAwsService;
    static readonly QLDB: InterfaceVpcEndpointAwsService;
    static readonly RDS: InterfaceVpcEndpointAwsService;
    static readonly RDS_DATA: InterfaceVpcEndpointAwsService;
    static readonly ROBOMAKER: InterfaceVpcEndpointAwsService;
    static readonly REDSHIFT: InterfaceVpcEndpointAwsService;
    static readonly REDSHIFT_FIPS: InterfaceVpcEndpointAwsService;
    static readonly REDSHIFT_DATA: InterfaceVpcEndpointAwsService;
    static readonly S3: InterfaceVpcEndpointAwsService;
    static readonly S3_MULTI_REGION_ACCESS_POINTS: InterfaceVpcEndpointAwsService;
    static readonly S3_OUTPOSTS: InterfaceVpcEndpointAwsService;
    static readonly SAGEMAKER_API: InterfaceVpcEndpointAwsService;
    static readonly SAGEMAKER_FEATURESTORE_RUNTIME: InterfaceVpcEndpointAwsService;
    static readonly SAGEMAKER_METRICS: InterfaceVpcEndpointAwsService;
    static readonly SAGEMAKER_RUNTIME: InterfaceVpcEndpointAwsService;
    static readonly SAGEMAKER_RUNTIME_FIPS: InterfaceVpcEndpointAwsService;
    static readonly SECRETS_MANAGER: InterfaceVpcEndpointAwsService;
    static readonly SERVICE_CATALOG: InterfaceVpcEndpointAwsService;
    static readonly SERVICE_CATALOG_APPREGISTRY: InterfaceVpcEndpointAwsService;
    static readonly SERVER_MIGRATION_SERVICE: InterfaceVpcEndpointAwsService;
    static readonly SERVER_MIGRATION_SERVICE_FIPS: InterfaceVpcEndpointAwsService;
    static readonly SERVER_MIGRATION_SERVICE_AWSCONNECTOR: InterfaceVpcEndpointAwsService;
    static readonly SES: InterfaceVpcEndpointAwsService;
    static readonly SNS: InterfaceVpcEndpointAwsService;
    static readonly SQS: InterfaceVpcEndpointAwsService;
    static readonly SSM: InterfaceVpcEndpointAwsService;
    static readonly SSM_MESSAGES: InterfaceVpcEndpointAwsService;
    static readonly SSM_CONTACTS: InterfaceVpcEndpointAwsService;
    static readonly SSM_INCIDENTS: InterfaceVpcEndpointAwsService;
    static readonly STS: InterfaceVpcEndpointAwsService;
    static readonly SNOW_DEVICE_MANAGEMENT: InterfaceVpcEndpointAwsService;
    static readonly TEXTRACT: InterfaceVpcEndpointAwsService;
    static readonly TEXTRACT_FIPS: InterfaceVpcEndpointAwsService;
    static readonly TRANSFER: InterfaceVpcEndpointAwsService;
    static readonly TRANSFER_SERVER: InterfaceVpcEndpointAwsService;
    static readonly TRANSLATE: InterfaceVpcEndpointAwsService;
    static readonly STORAGE_GATEWAY: InterfaceVpcEndpointAwsService;
    static readonly REKOGNITION: InterfaceVpcEndpointAwsService;
    static readonly REKOGNITION_FIPS: InterfaceVpcEndpointAwsService;
    static readonly STEP_FUNCTIONS: InterfaceVpcEndpointAwsService;
    static readonly STEP_FUNCTIONS_SYNC: InterfaceVpcEndpointAwsService;
    static readonly TRANSCRIBE: InterfaceVpcEndpointAwsService;
    static readonly TRANSCRIBE_STREAMING: InterfaceVpcEndpointAwsService;
    static readonly WORKSPACES: InterfaceVpcEndpointAwsService;
    static readonly XRAY: InterfaceVpcEndpointAwsService;
    static readonly SECURITYHUB: InterfaceVpcEndpointAwsService;
    static readonly EMAIL_SMTP: InterfaceVpcEndpointAwsService;
    /**
     * The name of the service. e.g. com.amazonaws.us-east-1.ecs
     */
    readonly name: string;
    /**
     * The short name of the service. e.g. ecs
     */
    readonly shortName: string;
    /**
     * The port of the service.
     */
    readonly port: number;
    /**
     * Whether Private DNS is supported by default.
     */
    readonly privateDnsDefault?: boolean;
    constructor(name: string, prefix?: string, port?: number);
    /**
     * Get the endpoint prefix for the service in the specified region
     * because the prefix for some of the services in cn-north-1 and cn-northwest-1 are different
     *
     * For future maintenance， the vpc endpoint services could be fetched using AWS CLI Commmand:
     * aws ec2 describe-vpc-endpoint-services
     */
    private getDefaultEndpointPrefix;
    /**
     * Get the endpoint suffix for the service in the specified region.
     * In cn-north-1 and cn-northwest-1, the vpc endpoint of transcribe is:
     *   cn.com.amazonaws.cn-north-1.transcribe.cn
     *   cn.com.amazonaws.cn-northwest-1.transcribe.cn
     * so suffix '.cn' should be return in these scenarios.
     *
     * For future maintenance， the vpc endpoint services could be fetched using AWS CLI Commmand:
     * aws ec2 describe-vpc-endpoint-services
     */
    private getDefaultEndpointSuffix;
}
/**
 * Options to add an interface endpoint to a VPC.
 */
export interface InterfaceVpcEndpointOptions {
    /**
     * The service to use for this interface VPC endpoint.
     */
    readonly service: IInterfaceVpcEndpointService;
    /**
     * Whether to associate a private hosted zone with the specified VPC. This
     * allows you to make requests to the service using its default DNS hostname.
     *
     * @default set by the instance of IInterfaceVpcEndpointService, or true if
     * not defined by the instance of IInterfaceVpcEndpointService
     */
    readonly privateDnsEnabled?: boolean;
    /**
     * The subnets in which to create an endpoint network interface. At most one
     * per availability zone.
     *
     * @default - private subnets
     */
    readonly subnets?: SubnetSelection;
    /**
     * The security groups to associate with this interface VPC endpoint.
     *
     * @default - a new security group is created
     */
    readonly securityGroups?: ISecurityGroup[];
    /**
     * Whether to automatically allow VPC traffic to the endpoint
     *
     * If enabled, all traffic to the endpoint from within the VPC will be
     * automatically allowed. This is done based on the VPC's CIDR range.
     *
     * @default true
     */
    readonly open?: boolean;
    /**
     * Limit to only those availability zones where the endpoint service can be created
     *
     * Setting this to 'true' requires a lookup to be performed at synthesis time. Account
     * and region must be set on the containing stack for this to work.
     *
     * @default false
     */
    readonly lookupSupportedAzs?: boolean;
}
/**
 * Construction properties for an InterfaceVpcEndpoint.
 */
export interface InterfaceVpcEndpointProps extends InterfaceVpcEndpointOptions {
    /**
     * The VPC network in which the interface endpoint will be used.
     */
    readonly vpc: IVpc;
}
/**
 * An interface VPC endpoint.
 */
export interface IInterfaceVpcEndpoint extends IVpcEndpoint, IConnectable {
}
/**
 * A interface VPC endpoint.
 * @resource AWS::EC2::VPCEndpoint
 */
export declare class InterfaceVpcEndpoint extends VpcEndpoint implements IInterfaceVpcEndpoint {
    /**
     * Imports an existing interface VPC endpoint.
     */
    static fromInterfaceVpcEndpointAttributes(scope: Construct, id: string, attrs: InterfaceVpcEndpointAttributes): IInterfaceVpcEndpoint;
    /**
     * The interface VPC endpoint identifier.
     */
    readonly vpcEndpointId: string;
    /**
     * The date and time the interface VPC endpoint was created.
     * @attribute
     */
    readonly vpcEndpointCreationTimestamp: string;
    /**
     * The DNS entries for the interface VPC endpoint.
     * Each entry is a combination of the hosted zone ID and the DNS name.
     * The entries are ordered as follows: regional public DNS, zonal public DNS, private DNS, and wildcard DNS.
     * This order is not enforced for AWS Marketplace services.
     *
     * The following is an example. In the first entry, the hosted zone ID is Z1HUB23UULQXV
     * and the DNS name is vpce-01abc23456de78f9g-12abccd3.ec2.us-east-1.vpce.amazonaws.com.
     *
     * ["Z1HUB23UULQXV:vpce-01abc23456de78f9g-12abccd3.ec2.us-east-1.vpce.amazonaws.com",
     * "Z1HUB23UULQXV:vpce-01abc23456de78f9g-12abccd3-us-east-1a.ec2.us-east-1.vpce.amazonaws.com",
     * "Z1C12344VYDITB0:ec2.us-east-1.amazonaws.com"]
     *
     * If you update the PrivateDnsEnabled or SubnetIds properties, the DNS entries in the list will change.
     * @attribute
     */
    readonly vpcEndpointDnsEntries: string[];
    /**
     * One or more network interfaces for the interface VPC endpoint.
     * @attribute
     */
    readonly vpcEndpointNetworkInterfaceIds: string[];
    /**
     * The identifier of the first security group associated with this interface
     * VPC endpoint.
     *
     * @deprecated use the `connections` object
     */
    readonly securityGroupId: string;
    /**
     * Access to network connections.
     */
    readonly connections: Connections;
    constructor(scope: Construct, id: string, props: InterfaceVpcEndpointProps);
    /**
     * Determine which subnets to place the endpoint in. This is in its own function
     * because there's a lot of code.
     */
    private endpointSubnets;
    /**
     * Sanity checking when looking up AZs for an endpoint service, to make sure it won't fail
     */
    private validateCanLookupSupportedAzs;
    private availableAvailabilityZones;
}
/**
 * Construction properties for an ImportedInterfaceVpcEndpoint.
 */
export interface InterfaceVpcEndpointAttributes {
    /**
     * The interface VPC endpoint identifier.
     */
    readonly vpcEndpointId: string;
    /**
     * The identifier of the security group associated with the interface VPC endpoint.
     *
     * @deprecated use `securityGroups` instead
     */
    readonly securityGroupId?: string;
    /**
     * The security groups associated with the interface VPC endpoint.
     *
     * If you wish to manage the network connections associated with this endpoint,
     * you will need to specify its security groups.
     */
    readonly securityGroups?: ISecurityGroup[];
    /**
     * The port of the service of the interface VPC endpoint.
     */
    readonly port: number;
}
