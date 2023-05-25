import {
  aws_vpclattice,
  aws_iam as iam,
  aws_ec2 as ec2,
  aws_s3 as s3,
  aws_logs as logs,
  aws_kinesis as kinesis,
  aws_ram as ram,
}
  from 'aws-cdk-lib';
import * as core from 'aws-cdk-lib';
import * as constructs from 'constructs';
import * as vpclattice from './index';

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
  readonly allowExternalPrincipals?: boolean | undefined
  /**
   * Principals to share the Service Network with
   * @default none
   */
  readonly principals?: string[] | undefined
}

export interface associateVPCProps {
  /**
   * The VPC to associate with the Service Network
   */
  readonly vpc: ec2.Vpc;
  /**
   * The security groups to associate with the Service Network
   * @default none
   */
  readonly securityGroups?: ec2.SecurityGroup[] | undefined

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
   * Add LatticeAuthPolicy
   */
  grantAccess(policyDocument: iam.IPrincipal[]): void;
  /**
   * Add Lattice Service Policy
   */
  addService(service: vpclattice.Service): void;
  /**
   * Associate a VPC with the Service Network
   */
  associateVPC(props: associateVPCProps): void;
  /**
   * Log To S3
   */
  logToS3(bucket: s3.Bucket | s3.IBucket ): void;
  /**
   * Send Events to Cloud Watch
   */
  sendToCloudWatch(log: logs.LogGroup | logs.ILogGroup ): void;
  /**
   * Stream to Kinesis
   */
  streamToKinesis(stream: kinesis.Stream | kinesis.IStream ): void;
  /**
   * Share the ServiceNetwork
   */
  share(props: ShareServiceNetworkProps): void;

}
/**
 * The properties for the ServiceNetwork.
 */
export interface ServiceNetworkProps {
  /** The name of the Service Network. If not set Cloudformation will provide
   * a name
   * @default cloudformation generated name
   */
  readonly name?: string
}

/**
 * Create a vpcLattice Service Network.
 */
export class ServiceNetwork extends core.Resource implements IServiceNetwork {
  /**
   * The Arn of the service network
   */
  public readonly serviceNetworkArn: string;
  /**
   * The Id of the Service Network
   */
  public readonly serviceNetworkId: string;
  /**
   * the authType of the service network
   */
  authType: vpclattice.AuthType | undefined;
  /**
   * policy document to be used.
   */
  authPolicy: iam.PolicyDocument;

  constructor(scope: constructs.Construct, id: string, props: ServiceNetworkProps) {
    super(scope, id);

    this.authPolicy = new iam.PolicyDocument();

    const serviceNetwork = new aws_vpclattice.CfnServiceNetwork(this, 'Resource', {
      name: props.name,
      authType: this.authType ?? vpclattice.AuthType.NONE,
    });

    this.serviceNetworkId = serviceNetwork.attrId;
    this.serviceNetworkArn = serviceNetwork.attrArn;

    new aws_vpclattice.CfnAuthPolicy(this, 'AuthPolicy', {
      policy: this.authPolicy.toJSON(),
      resourceIdentifier: this.serviceNetworkId,
    });
  }

  /**
   * - Add an IAM policy to the service network. statements should only
   * contain a single action 'vpc-lattice-svcs:Invoke' and a single resource
   * which is the service network ARN. The policy statements resource and action
   * are optional. If they are not provided, the correct values will be set.
   *
   * @param policyStatements
   */
  public grantAccess(principals: iam.IPrincipal[]): void {

    let policyStatement: iam.PolicyStatement = new iam.PolicyStatement();

    principals.forEach((principal) => {
      principal.addToPrincipalPolicy(policyStatement);
    });
    policyStatement.addActions('vpc-lattice-svcs:Invoke');
    policyStatement.addResources(this.serviceNetworkArn + '/*');

    this.authType = vpclattice.AuthType.IAM;
    this.authPolicy.addStatements(policyStatement);

  }
  /**
   * Add A lattice service to a lattice network
   * @param service
   */
  public addService(service: vpclattice.Service): void {

    new aws_vpclattice.CfnServiceNetworkServiceAssociation(this, 'LatticeServiceAssociation', {
      serviceIdentifier: service.serviceId,
      serviceNetworkIdentifier: this.serviceNetworkId,
    });
  }
  /**
   * Associate a VPC with the Service Network
   * @param vpc
   * @param securityGroups
   */
  public associateVPC(props: associateVPCProps): void {

    const securityGroupIds: string[] = [];
    if (props.securityGroups) {
      props.securityGroups.forEach((securityGroup) => {
        securityGroupIds.push(securityGroup.securityGroupId);
      });
    }

    new aws_vpclattice.CfnServiceNetworkVpcAssociation(this, 'VpcAssociation', /* all optional props */ {
      securityGroupIds: securityGroupIds,
      serviceNetworkIdentifier: this.serviceNetworkId,
      vpcIdentifier: props.vpc.vpcId,
    });
  }

  public logToS3(bucket: s3.Bucket | s3.IBucket): void {
    new aws_vpclattice.CfnAccessLogSubscription(this, 'LatticeLoggingtoS3', {
      destinationArn: bucket.bucketArn,
      resourceIdentifier: this.serviceNetworkArn,
    });
  }

  public sendToCloudWatch(log: logs.LogGroup | logs.ILogGroup): void {
    new aws_vpclattice.CfnAccessLogSubscription(this, 'LattiCloudwatch', {
      destinationArn: log.logGroupArn,
      resourceIdentifier: this.serviceNetworkId,
    });
  }

  public streamToKinesis(stream: kinesis.Stream | kinesis.IStream): void {
    new aws_vpclattice.CfnAccessLogSubscription(this, 'LatticeKinesis', {
      destinationArn: stream.streamArn,
      resourceIdentifier: this.serviceNetworkId,
    });
  }

  public share(props: vpclattice.ShareServiceNetworkProps): void {
    new ram.CfnResourceShare(this, 'ServiceNetworkShare', {
      name: props.name,
      resourceArns: [this.serviceNetworkArn],
      allowExternalPrincipals: props.allowExternalPrincipals,
      principals: props.principals,
    });
  }

}