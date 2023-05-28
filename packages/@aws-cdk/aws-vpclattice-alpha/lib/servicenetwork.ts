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
import {
  Service,
} from './index';

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
/**
 * Properties to associate a VPC with a Service Network
 */
export interface AssociateVPCProps {
  /**
   * The VPC to associate with the Service Network
   */
  readonly vpc: ec2.Vpc;
  /**
   * The security groups to associate with the Service Network
   * @default a security group that allows inbound 443 will be permitted.
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
  addService(service: Service): void;
  /**
   * Associate a VPC with the Service Network
   */
  associateVPC(props: AssociateVPCProps): void;
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

  /** The type of  authentication to use with the Service Network.
   * @default 'AWS_IAM'
   */
  readonly authType?: string | undefined;
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
  authType: string | undefined;
  /**
   * policy document to be used.
   */
  authPolicy: iam.PolicyDocument = new iam.PolicyDocument();


  constructor(scope: constructs.Construct, id: string, props: ServiceNetworkProps) {
    super(scope, id);


    if (props.name !== undefined) {
      if (props.name.match(/^[a-z0-9\-]{3,63}$/) === null) {
        throw new Error('Theservice network name must be between 3 and 63 characters long. The name can only contain alphanumeric characters and hyphens. The name must be unique to the account.');
      }
    }

    // the opinionated default for the servicenetwork is to use AWS_IAM as the
    // authentication method. Provide 'NONE' to props.authType to disable.
    const serviceNetwork = new aws_vpclattice.CfnServiceNetwork(this, 'Resource', {
      name: props.name,
      authType: props.authType ?? 'AWS_IAM',
    });

    this.serviceNetworkId = serviceNetwork.attrId;
    this.serviceNetworkArn = serviceNetwork.attrArn;
  }

  /**
   * This will give the principals access to all resources that are on this
   * service network. This is a broad permission.
   * Consider granting Access at the Service
   *
   */
  public grantAccess(principals: iam.IPrincipal[]): void {

    let policyStatement: iam.PolicyStatement = new iam.PolicyStatement();
    policyStatement.addActions('vpc-lattice-svcs:Invoke');
    policyStatement.addResources(this.serviceNetworkArn);
    policyStatement.effect = iam.Effect.ALLOW;

    principals.forEach((principal) => {
      policyStatement.addPrincipals(principal);
    });

    this.authPolicy.addStatements(policyStatement);

    if (this.authPolicy.validateForResourcePolicy().length > 0) {
      throw new Error(`Auth Policy for granting access on  Service Network is invalid\n, ${this.authPolicy}`);
    }

    new aws_vpclattice.CfnAuthPolicy(this, 'AuthPolicy', {
      policy: this.authPolicy.toJSON(),
      resourceIdentifier: this.serviceNetworkArn,
    });

  }
  /**
   * Add A lattice service to a lattice network
   * @param service
   */
  public addService(service: Service): void {

    new aws_vpclattice.CfnServiceNetworkServiceAssociation(this, 'LatticeServiceAssociation', {
      serviceIdentifier: service.serviceId,
      serviceNetworkIdentifier: this.serviceNetworkId,
    });
  }
  /**
   * Associate a VPC with the Service Network
   * This provides an opinionated default of adding a security group to allow inbound 443
   */
  public associateVPC(props: AssociateVPCProps): void {

    const securityGroupIds: string[] = [];

    if (props.securityGroups === undefined) {
      const securityGroup = new ec2.SecurityGroup(this, 'ServiceNetworkSecurityGroup', {
        vpc: props.vpc,
        allowAllOutbound: true,
        description: 'ServiceNetworkSecurityGroup',
      });

      securityGroup.addIngressRule(
        ec2.Peer.ipv4(props.vpc.vpcCidrBlock),
        ec2.Port.tcp(443),
      );

      securityGroupIds.push(securityGroup.securityGroupId);

    }


    new aws_vpclattice.CfnServiceNetworkVpcAssociation(this, 'VpcAssociation', /* all optional props */ {
      securityGroupIds: securityGroupIds,
      serviceNetworkIdentifier: this.serviceNetworkId,
      vpcIdentifier: props.vpc.vpcId,
    });
  }

  /**
   * Send logs to a S3 bucket.
   * @param bucket
   */
  public logToS3(bucket: s3.Bucket | s3.IBucket): void {
    new aws_vpclattice.CfnAccessLogSubscription(this, 'LatticeLoggingtoS3', {
      destinationArn: bucket.bucketArn,
      resourceIdentifier: this.serviceNetworkArn,
    });
  }
  /**
   * Send event to Cloudwatch
   * @param log
   */
  public sendToCloudWatch(log: logs.LogGroup | logs.ILogGroup): void {
    new aws_vpclattice.CfnAccessLogSubscription(this, 'LattiCloudwatch', {
      destinationArn: log.logGroupArn,
      resourceIdentifier: this.serviceNetworkArn,
    });
  }

  /**
   * Stream Events to Kinesis
   * @param stream
   */
  public streamToKinesis(stream: kinesis.Stream | kinesis.IStream): void {
    new aws_vpclattice.CfnAccessLogSubscription(this, 'LatticeKinesis', {
      destinationArn: stream.streamArn,
      resourceIdentifier: this.serviceNetworkArn,
    });
  }

  /**
   * Share the The Service network using RAM
   * @param props ShareServiceNetwork
   */
  public share(props: ShareServiceNetworkProps): void {
    new ram.CfnResourceShare(this, 'ServiceNetworkShare', {
      name: props.name,
      resourceArns: [this.serviceNetworkArn],
      allowExternalPrincipals: props.allowExternalPrincipals,
      principals: props.principals,
    });
  }

}