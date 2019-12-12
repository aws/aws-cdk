import iam = require('@aws-cdk/aws-iam');
import { Aws, Construct, IResource, Lazy, Resource } from '@aws-cdk/core';
import { Connections, IConnectable } from './connections';
import { CfnVPCEndpoint } from './ec2.generated';
import { Port } from './port';
import { ISecurityGroup, SecurityGroup } from './security-group';
import { allRouteTableIds } from './util';
import { IVpc, SubnetSelection, SubnetType } from './vpc';

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

export abstract class VpcEndpoint extends Resource implements IVpcEndpoint {
  public abstract readonly vpcEndpointId: string;

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
  public addToPolicy(statement: iam.PolicyStatement) {
    if (!statement.hasPrincipal) {
      throw new Error('Statement must have a `Principal`.');
    }

    if (!this.policyDocument) {
      this.policyDocument = new iam.PolicyDocument();
    }

    this.policyDocument.addStatements(statement);
  }
}

/**
 * A gateway VPC endpoint.
 */
export interface IGatewayVpcEndpoint extends IVpcEndpoint {
}

/**
 * The type of VPC endpoint.
 */
export enum VpcEndpointType {
  /**
   * Interface
   *
   * An interface endpoint is an elastic network interface with a private IP
   * address that serves as an entry point for traffic destined to a supported
   * service.
   */
  INTERFACE = 'Interface',

  /**
   * Gateway
   *
   * A gateway endpoint is a gateway that is a target for a specified route in
   * your route table, used for traffic destined to a supported AWS service.
   */
  GATEWAY = 'Gateway'
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
export class GatewayVpcEndpointAwsService implements IGatewayVpcEndpointService {
  public static readonly DYNAMODB = new GatewayVpcEndpointAwsService('dynamodb');
  public static readonly S3 = new GatewayVpcEndpointAwsService('s3');

  /**
   * The name of the service.
   */
  public readonly name: string;

  constructor(name: string, prefix?: string) {
    this.name = `${prefix || 'com.amazonaws'}.${Aws.REGION}.${name}`;
  }
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
   * @default private subnets
   */
  readonly subnets?: SubnetSelection[]
}

/**
 * Construction properties for a GatewayVpcEndpoint.
 */
export interface GatewayVpcEndpointProps extends GatewayVpcEndpointOptions {
  /**
   * The VPC network in which the gateway endpoint will be used.
   */
  readonly vpc: IVpc
}

/**
 * A gateway VPC endpoint.
 * @resource AWS::EC2::VPCEndpoint
 */
export class GatewayVpcEndpoint extends VpcEndpoint implements IGatewayVpcEndpoint {

  public static fromGatewayVpcEndpointId(scope: Construct, id: string, gatewayVpcEndpointId: string): IGatewayVpcEndpoint {
    class Import extends VpcEndpoint {
      public vpcEndpointId = gatewayVpcEndpointId;
    }

    return new Import(scope, id);
  }

  /**
   * The gateway VPC endpoint identifier.
   */
  public readonly vpcEndpointId: string;

  /**
   * The date and time the gateway VPC endpoint was created.
   * @attribute
   */
  public readonly vpcEndpointCreationTimestamp: string;

  /**
   * @attribute
   */
  public readonly vpcEndpointNetworkInterfaceIds: string[];

  /**
   * @attribute
   */
  public readonly vpcEndpointDnsEntries: string[];

  constructor(scope: Construct, id: string, props: GatewayVpcEndpointProps) {
    super(scope, id);

    const subnets = props.subnets || [{ subnetType: SubnetType.PRIVATE }];
    const routeTableIds = allRouteTableIds(...subnets.map(s => props.vpc.selectSubnets(s)));

    if (routeTableIds.length === 0) {
      throw new Error(`Can't add a gateway endpoint to VPC; route table IDs are not available`);
    }

    const endpoint = new CfnVPCEndpoint(this, 'Resource', {
      policyDocument: Lazy.anyValue({ produce: () => this.policyDocument }),
      routeTableIds,
      serviceName: props.service.name,
      vpcEndpointType: VpcEndpointType.GATEWAY,
      vpcId: props.vpc.vpcId
    });

    this.vpcEndpointId = endpoint.ref;
    this.vpcEndpointCreationTimestamp = endpoint.attrCreationTimestamp;
    this.vpcEndpointDnsEntries = endpoint.attrDnsEntries;
    this.vpcEndpointNetworkInterfaceIds = endpoint.attrNetworkInterfaceIds;
  }
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
}

/**
 * An AWS service for an interface VPC endpoint.
 */
export class InterfaceVpcEndpointAwsService implements IInterfaceVpcEndpointService {
  public static readonly SAGEMAKER_NOTEBOOK = new InterfaceVpcEndpointAwsService('notebook', 'aws.sagemaker');
  public static readonly CLOUDFORMATION = new InterfaceVpcEndpointAwsService('cloudformation');
  public static readonly CLOUDTRAIL = new InterfaceVpcEndpointAwsService('cloudtrail');
  public static readonly CODEBUILD = new InterfaceVpcEndpointAwsService('codebuild');
  public static readonly CODEBUILD_FIPS = new InterfaceVpcEndpointAwsService('codebuild-fips');
  public static readonly CODECOMMIT = new InterfaceVpcEndpointAwsService('codecommit');
  public static readonly CODECOMMIT_FIPS = new InterfaceVpcEndpointAwsService('codecommit-fips');
  public static readonly CODEPIPELINE = new InterfaceVpcEndpointAwsService('codepipeline');
  public static readonly CONFIG = new InterfaceVpcEndpointAwsService('config');
  public static readonly EC2 = new InterfaceVpcEndpointAwsService('ec2');
  public static readonly EC2_MESSAGES = new InterfaceVpcEndpointAwsService('ec2messages');
  public static readonly ECR = new InterfaceVpcEndpointAwsService('ecr.api');
  public static readonly ECR_DOCKER = new InterfaceVpcEndpointAwsService('ecr.dkr');
  public static readonly ECS = new InterfaceVpcEndpointAwsService('ecs');
  public static readonly ECS_AGENT = new InterfaceVpcEndpointAwsService('ecs-agent');
  public static readonly ECS_TELEMETRY = new InterfaceVpcEndpointAwsService('ecs-telemetry');
  public static readonly ELASTIC_INFERENCE_RUNTIME = new InterfaceVpcEndpointAwsService('elastic-inference.runtime');
  public static readonly ELASTIC_LOAD_BALANCING = new InterfaceVpcEndpointAwsService('elasticloadbalancing');
  public static readonly CLOUDWATCH_EVENTS = new InterfaceVpcEndpointAwsService('events');
  public static readonly APIGATEWAY = new InterfaceVpcEndpointAwsService('execute-api');
  public static readonly CODECOMMIT_GIT = new InterfaceVpcEndpointAwsService('git-codecommit');
  public static readonly CODECOMMIT_GIT_FIPS = new InterfaceVpcEndpointAwsService('git-codecommit-fips');
  public static readonly KINESIS_STREAMS = new InterfaceVpcEndpointAwsService('kinesis-streams');
  public static readonly KMS = new InterfaceVpcEndpointAwsService('kms');
  public static readonly CLOUDWATCH_LOGS = new InterfaceVpcEndpointAwsService('logs');
  public static readonly CLOUDWATCH = new InterfaceVpcEndpointAwsService('monitoring');
  public static readonly SAGEMAKER_API = new InterfaceVpcEndpointAwsService('sagemaker.api');
  public static readonly SAGEMAKER_RUNTIME = new InterfaceVpcEndpointAwsService('sagemaker.runtime');
  public static readonly SAGEMAKER_RUNTIME_FIPS = new InterfaceVpcEndpointAwsService('sagemaker.runtime-fips');
  public static readonly SECRETS_MANAGER = new InterfaceVpcEndpointAwsService('secretsmanager');
  public static readonly SERVICE_CATALOG = new InterfaceVpcEndpointAwsService('servicecatalog');
  public static readonly SNS = new InterfaceVpcEndpointAwsService('sns');
  public static readonly SQS = new InterfaceVpcEndpointAwsService('sqs');
  public static readonly SSM = new InterfaceVpcEndpointAwsService('ssm');
  public static readonly SSM_MESSAGES = new InterfaceVpcEndpointAwsService('ssmmessages');
  public static readonly STS = new InterfaceVpcEndpointAwsService('sts');
  public static readonly TRANSFER = new InterfaceVpcEndpointAwsService('transfer.server');
  public static readonly STORAGE_GATEWAY = new InterfaceVpcEndpointAwsService('storagegateway');
  public static readonly REKOGNITION = new InterfaceVpcEndpointAwsService('rekognition');
  public static readonly REKOGNITION_FIPS = new InterfaceVpcEndpointAwsService('rekognition-fips');

  /**
   * The name of the service.
   */
  public readonly name: string;

  /**
   * The port of the service.
   */
  public readonly port: number;

  constructor(name: string, prefix?: string, port?: number) {
    this.name = `${prefix || 'com.amazonaws'}.${Aws.REGION}.${name}`;
    this.port = port || 443;
  }
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
   * @default true
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
}

/**
 * Construction properties for an InterfaceVpcEndpoint.
 */
export interface InterfaceVpcEndpointProps extends InterfaceVpcEndpointOptions {
  /**
   * The VPC network in which the interface endpoint will be used.
   */
  readonly vpc: IVpc
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
export class InterfaceVpcEndpoint extends VpcEndpoint implements IInterfaceVpcEndpoint {
  /**
   * Imports an existing interface VPC endpoint.
   */
  public static fromInterfaceVpcEndpointAttributes(scope: Construct, id: string, attrs: InterfaceVpcEndpointAttributes): IInterfaceVpcEndpoint {
    if (!attrs.securityGroups && !attrs.securityGroupId) {
      throw new Error('Either `securityGroups` or `securityGroupId` must be specified.');
    }

    const securityGroups = attrs.securityGroupId
      ? [SecurityGroup.fromSecurityGroupId(scope, 'SecurityGroup', attrs.securityGroupId)]
      : attrs.securityGroups;

    class Import extends Resource implements IInterfaceVpcEndpoint {
      public readonly vpcEndpointId = attrs.vpcEndpointId;
      public readonly connections = new Connections({
        defaultPort: Port.tcp(attrs.port),
        securityGroups,
      });
    }

    return new Import(scope, id);
  }

  /**
   * The interface VPC endpoint identifier.
   */
  public readonly vpcEndpointId: string;

  /**
   * The date and time the interface VPC endpoint was created.
   * @attribute
   */
  public readonly vpcEndpointCreationTimestamp: string;

  /**
   * The DNS entries for the interface VPC endpoint.
   * @attribute
   */
  public readonly vpcEndpointDnsEntries: string[];

  /**
   * One or more network interfaces for the interface VPC endpoint.
   * @attribute
   */
  public readonly vpcEndpointNetworkInterfaceIds: string[];

  /**
   * The identifier of the first security group associated with this interface
   * VPC endpoint.
   *
   * @deprecated use the `connections` object
   */
  public readonly securityGroupId: string;

  /**
   * Access to network connections.
   */
  public readonly connections: Connections;

  constructor(scope: Construct, id: string, props: InterfaceVpcEndpointProps) {
    super(scope, id);

    const securityGroups = props.securityGroups || [new SecurityGroup(this, 'SecurityGroup', {
      vpc: props.vpc
    })];
    this.securityGroupId = securityGroups[0].securityGroupId;
    this.connections = new Connections({
      defaultPort: Port.tcp(props.service.port),
      securityGroups
    });

    const subnets = props.vpc.selectSubnets({ ...props.subnets, onePerAz: true });
    const subnetIds = subnets.subnetIds;

    const endpoint = new CfnVPCEndpoint(this, 'Resource', {
      privateDnsEnabled: props.privateDnsEnabled !== undefined ? props.privateDnsEnabled : true,
      policyDocument: Lazy.anyValue({ produce: () => this.policyDocument }),
      securityGroupIds: securityGroups.map(s => s.securityGroupId),
      serviceName: props.service.name,
      vpcEndpointType: VpcEndpointType.INTERFACE,
      subnetIds,
      vpcId: props.vpc.vpcId
    });

    this.vpcEndpointId = endpoint.ref;
    this.vpcEndpointCreationTimestamp = endpoint.attrCreationTimestamp;
    this.vpcEndpointDnsEntries = endpoint.attrDnsEntries;
    this.vpcEndpointNetworkInterfaceIds = endpoint.attrNetworkInterfaceIds;
  }
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
   */
  readonly securityGroups?: ISecurityGroup[];

  /**
   * The port of the service of the interface VPC endpoint.
   */
  readonly port: number;
}
