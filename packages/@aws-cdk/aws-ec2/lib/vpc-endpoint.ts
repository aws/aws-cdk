import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { Connections, IConnectable } from './connections';
import { CfnVPCEndpoint } from './ec2.generated';
import { SecurityGroup } from './security-group';
import { VpcSubnet } from './vpc';
import { IVpcNetwork, IVpcSubnet, SubnetSelection } from './vpc-ref';

/**
 * A VPC endpoint.
 */
export interface IVpcEndpoint extends cdk.IConstruct {
  /**
   * The VPC endpoint identifier.
   */
  readonly vpcEndpointId: string;
}

/**
 * A VPC gateway endpoint.
 */
export interface IVpcGatewayEndpoint extends IVpcEndpoint {
  /**
   * Exports this VPC endpoint from the stack.
   */
  export(): VpcGatewayEndpointImportProps;
}

/**
 * The type of VPC endpoint.
 */
export enum VpcEndpointType {
  /**
   * Interface
   */
  Interface = 'Interface',

  /**
   * Gateway
   */
  Gateway = 'Gateway'
}

/**
 * A VPC endpoint service.
 */
export class VpcEndpointService {
  constructor(public readonly name: string, public readonly type: VpcEndpointType) {}
}

/**
 * A VPC endpoint AWS service.
 */
export class VpcEndpointAwsService extends VpcEndpointService {
  public static readonly SageMakeNotebook = new VpcEndpointAwsService('sagemaker', VpcEndpointType.Interface, 'aws.sagemaker');
  public static readonly CloudFormation = new VpcEndpointAwsService('cloudformation');
  public static readonly CloudTrail = new VpcEndpointAwsService('cloudtrail');
  public static readonly CodeBuild = new VpcEndpointAwsService('codebuild');
  public static readonly CodeBuildFips = new VpcEndpointAwsService('codebuil-fips');
  public static readonly CodeCommit = new VpcEndpointAwsService('codecommit');
  public static readonly CodeCommitFips = new VpcEndpointAwsService('codecommit-fips');
  public static readonly CodePipeline = new VpcEndpointAwsService('codepipeline');
  public static readonly Config = new VpcEndpointAwsService('config');
  public static readonly DynamoDb = new VpcEndpointAwsService('dynamodb', VpcEndpointType.Gateway);
  public static readonly Ec2 = new VpcEndpointAwsService('ec2');
  public static readonly Ec2Messages = new VpcEndpointAwsService('ec2messages');
  public static readonly Ecr = new VpcEndpointAwsService('ecr.api');
  public static readonly EcrDocker = new VpcEndpointAwsService('ecr.dkr');
  public static readonly Ecs = new VpcEndpointAwsService('ecs');
  public static readonly EcsAgent = new VpcEndpointAwsService('ecs-agent');
  public static readonly EcsTelemetry = new VpcEndpointAwsService('ecs-telemetry');
  public static readonly ElasticInferenceRuntime = new VpcEndpointAwsService('elastic-inference.runtime');
  public static readonly ElasticLoadBalancing = new VpcEndpointAwsService('elasticloadbalancing');
  public static readonly CloudWatchEvents = new VpcEndpointAwsService('events');
  public static readonly ApiGateway = new VpcEndpointAwsService('execute-api');
  public static readonly CodeCommitGit = new VpcEndpointAwsService('git-codecommit');
  public static readonly CodeCommitGitFips = new VpcEndpointAwsService('git-codecommit-fips');
  public static readonly KinesisStreams = new VpcEndpointAwsService('kinesis-streams');
  public static readonly Kms = new VpcEndpointAwsService('kms');
  public static readonly CloudWatchLogs = new VpcEndpointAwsService('logs');
  public static readonly CloudWatch = new VpcEndpointAwsService('monitoring');
  public static readonly S3 = new VpcEndpointAwsService('s3', VpcEndpointType.Gateway);
  public static readonly SageMakerApi = new VpcEndpointAwsService('sagemaker.api');
  public static readonly SageMakerRuntime = new VpcEndpointAwsService('sagemaker.runtime');
  public static readonly SageMakerRuntimeFips = new VpcEndpointAwsService('sagemaker.runtime-fips');
  public static readonly SecretsManager = new VpcEndpointAwsService('secretsmanager');
  public static readonly ServiceCatalog = new VpcEndpointAwsService('servicecatalog');
  public static readonly Sns = new VpcEndpointAwsService('sns');
  public static readonly Sqs = new VpcEndpointAwsService('sqs');
  public static readonly Ssm = new VpcEndpointAwsService('ssm');
  public static readonly SsmMessages = new VpcEndpointAwsService('ssmmessages');
  public static readonly Sts = new VpcEndpointAwsService('sts');
  public static readonly Transfer = new VpcEndpointAwsService('transfer.server');

  constructor(name: string, type?: VpcEndpointType, prefix?: string) {
    super(`${prefix || 'com.amazonaws'}.${cdk.Aws.region}.${name}`, type || VpcEndpointType.Interface);
  }
}

/**
 * Options to add an endpoint to a VPC.
 */
export interface VpcEndpointOptions {
  /**
   * The name of the service.
   */
  service: VpcEndpointService;
}

/**
 * Options to add a gateway endpoint to a VPC.
 */
export interface VpcGatewayEndpointOptions extends VpcEndpointOptions {
  /**
   * Where to add endpoint routing.
   *
   * @default private subnets
   */
  subnets?: SubnetSelection[]
}

/**
 * Construction properties for a GatewayEndpoint.
 */
export interface VpcGatewayEndpointProps extends VpcGatewayEndpointOptions {
  /**
   * The VPC network in which the gateway endpoint will be used.
   */
  vpc: IVpcNetwork
}

/**
 * A VPC gateway endpoint.
 */
export class VpcGatewayEndpoint extends cdk.Construct implements IVpcGatewayEndpoint {
  /**
   * Imports an existing gateway endpoint.
   */
  public static import(scope: cdk.Construct, id: string, props: VpcGatewayEndpointImportProps): IVpcGatewayEndpoint {
    return new ImportedVpcGatewayEndpoint(scope, id, props);
  }

  /**
   * The VPC gateway endpoint identifier.
   */
  public readonly vpcEndpointId: string;

  /**
   * The date and time the VPC gateway endpoint was created.
   */
  public readonly creationTimestamp: string;

  private policyDocument?: iam.PolicyDocument;

  constructor(scope: cdk.Construct, id: string, props: VpcGatewayEndpointProps) {
    super(scope, id);

    if (props.service.type !== VpcEndpointType.Gateway) {
      throw new Error('The service endpoint type must be `Gateway`');
    }

    let subnets: IVpcSubnet[] = [];
    if (props.subnets) {
      for (const selection of props.subnets) {
        subnets.push(...props.vpc.subnets(selection));
      }
    } else {
      subnets = props.vpc.subnets();
    }

    const routeTableIds = (subnets as VpcSubnet[]).map(subnet => subnet.routeTableId);

    const endpoint = new CfnVPCEndpoint(this, 'Resource', {
      policyDocument: new cdk.Token(() => this.policyDocument),
      routeTableIds,
      serviceName: props.service.name,
      vpcEndpointType: VpcEndpointType.Gateway,
      vpcId: props.vpc.vpcId
    });

    this.vpcEndpointId = endpoint.vpcEndpointId;
    this.creationTimestamp = endpoint.vpcEndpointCreationTimestamp;
  }

  /**
   * Adds a statement to the policy document.
   *
   * @param statement the statement to add
   */
  public addToPolicy(statement: iam.PolicyStatement) {
    if (!statement.hasPrincipal) {
      throw new Error('Statement must have a `Principal`.');
    }

    if (!this.policyDocument) {
      this.policyDocument = new iam.PolicyDocument();
    }

    this.policyDocument.addStatement(statement);
  }

  /**
   * Exports this VPC gateway endpoint from the stack.
   */
  public export(): VpcGatewayEndpointImportProps {
    return {
      vpcEndpointId: new cdk.CfnOutput(this, 'VpcEndpointId', { value: this.vpcEndpointId }).makeImportValue().toString()
    };
  }
}

/**
 * Construction properties for an ImportedVpcGatewayEndpoint.
 */
export interface VpcGatewayEndpointImportProps {
  /**
   * The VPC gateway endpoint identifier.
   */
  vpcEndpointId: string;
}

/**
 * An imported VPC gateway endpoint.
 */
class ImportedVpcGatewayEndpoint extends cdk.Construct implements IVpcGatewayEndpoint {
  /**
   * The VPC gateway endpoint identifier.
   */
  public readonly vpcEndpointId: string;

  constructor(scope: cdk.Construct, id: string, private readonly props: VpcGatewayEndpointImportProps) {
    super(scope, id);

    this.vpcEndpointId = props.vpcEndpointId;
  }

  /**
   * Exports this VPC gateway endpoint from the stack.
   */
  public export(): VpcGatewayEndpointImportProps {
    return this.props;
  }
}

/**
 * Options to add an interface endpoint to a VPC.
 */
export interface VpcInterfaceEndpointOptions extends VpcEndpointOptions {
  /**
   * Whether to associate a private hosted zone with the specified VPC. This
   * allows you to make requests to the service using its default DNS hostname.
   *
   * @default true
   */
  privateDnsEnabled?: boolean;

  /**
   * The subnets in which to create an endpoint network interface. One per
   * availability zone.
   */
  subnets?: SubnetSelection;
}

/**
 * Construction properties for a VpcInterfaceEndpoint.
 */
export interface VpcInterfaceEndpointProps extends VpcInterfaceEndpointOptions {
  /**
   * The VPC network in which the endpoint will be used.
   */
  vpc: IVpcNetwork
}

/**
 * A VPC interface endpoint.
 */
export interface IVpcInterfaceEndpoint extends IVpcEndpoint, IConnectable {
  /**
   * Exports this VPC interface endpoint from the stack.
   */
  export(): VpcInterfaceEndpointImportProps;
}

/**
 * A VPC interface endpoint.
 */
export class VpcInterfaceEndpoint extends cdk.Construct implements IVpcInterfaceEndpoint {
  /**
   * Imports an existing interface endpoint.
   */
  public static import(scope: cdk.Construct, id: string, props: VpcInterfaceEndpointImportProps): IVpcInterfaceEndpoint {
    return new ImportedVpcInterfaceEndpoint(scope, id, props);
  }

  /**
   * The VPC interface endpoint identifier.
   */
  public readonly vpcEndpointId: string;

  /**
   * The date and time the VPC interface endpoint was created.
   */
  public readonly creationTimestamp: string;

  /**
   * The DNS entries for the VPC interface endpoint.
   */
  public readonly dnsEntries: string[];

  /**
   * One or more network interfaces for the VPC interface endpoint.
   */
  public readonly networkInterfaceIds: string[];

  /**
   * The identifier of the security group associated with this VPC interface
   * endpoint.
   */
  public readonly securityGroupId: string;

  /**
   * Access to network connections.
   */
  public readonly connections: Connections;

  constructor(scope: cdk.Construct, id: string, props: VpcInterfaceEndpointProps) {
    super(scope, id);

    if (props.service.type !== VpcEndpointType.Interface) {
      throw new Error('The service endpoint type must be `Interface`');
    }

    const securityGroup = new SecurityGroup(this, 'SecurityGroup', {
      vpc: props.vpc
    });
    this.securityGroupId = securityGroup.securityGroupId;
    this.connections = new Connections({ securityGroups: [securityGroup] });

    const subnets = props.vpc.subnets(props.subnets);

    const availabilityZones = new Set(subnets.map(s => s.availabilityZone));

    if (availabilityZones.size !== subnets.length) {
      throw new Error('Only one subnet per availability zone is allowed.');
    }

    const endpoint = new CfnVPCEndpoint(this, 'Resource', {
      privateDnsEnabled: props.privateDnsEnabled || true,
      securityGroupIds: [this.securityGroupId],
      serviceName: props.service.name,
      vpcEndpointType: VpcEndpointType.Interface,
      subnetIds: subnets.map(s => s.subnetId),
      vpcId: props.vpc.vpcId
    });

    this.vpcEndpointId = endpoint.vpcEndpointId;
    this.creationTimestamp = endpoint.vpcEndpointCreationTimestamp;
    this.dnsEntries = endpoint.vpcEndpointDnsEntries;
    this.networkInterfaceIds = endpoint.vpcEndpointNetworkInterfaceIds;
  }

  /**
   * Exports this VPC interface endpoint from the stack.
   */
  public export(): VpcInterfaceEndpointImportProps {
    return {
      vpcEndpointId: new cdk.CfnOutput(this, 'VpcEndpointId', { value: this.vpcEndpointId }).makeImportValue().toString(),
      securityGroupId: new cdk.CfnOutput(this, 'SecurityGroupId', { value: this.securityGroupId }).makeImportValue().toString()
    };
  }
}

/**
 * Construction properties for an ImportedVpcInterfaceEndpoint.
 */
export interface VpcInterfaceEndpointImportProps {
  /**
   * The VPC interface endpoint identifier.
   */
  vpcEndpointId: string;

  /**
   * The identifier of the security group associated with the VPC interface endpoint.
   */
  securityGroupId: string;
}

/**
 * An imported VPC interface endpoint.
 */
class ImportedVpcInterfaceEndpoint extends cdk.Construct implements IVpcInterfaceEndpoint {
  /**
   * The VPC interface endpoint identifier.
   */
  public readonly vpcEndpointId: string;

  /**
   * The identifier of the security group associated with the VPC interface endpoint.
   */
  public readonly securityGroupId: string;

  /**
   * Access to network connections.
   */
  public readonly connections: Connections;

  constructor(scope: cdk.Construct, id: string, private readonly props: VpcInterfaceEndpointImportProps) {
    super(scope, id);

    this.vpcEndpointId = props.vpcEndpointId;

    this.securityGroupId = props.securityGroupId;

    this.connections = new Connections({
      securityGroups: [SecurityGroup.import(this, 'SecurityGroup', props)],
    });
  }

  /**
   * Exports this VPC endpoint from the stack.
   */
  public export(): VpcInterfaceEndpointImportProps {
    return this.props;
  }
}
