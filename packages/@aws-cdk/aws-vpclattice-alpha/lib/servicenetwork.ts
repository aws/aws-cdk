import {
  aws_vpclattice,
  aws_iam as iam,
  aws_ec2 as ec2,
  aws_s3 as s3,
  aws_logs as logs,
  aws_kinesis as kinesis,
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
  name: string;
  /**
   * Are external Principals allowed
   * @default false;
   */
  allowExternalPrincipals?: boolean | undefined
  /**
   * Principals to share the Service Network with
   */
  principals?: string[] | undefined
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
  addLatticeAuthPolicy(policyDocument: iam.PolicyStatement[]): void;
  /**
   * Add Lattice Service Policy
   */
  addService(service: vpclattice.Service): void;
  /**
   * Associate a VPC with the Service Network
   */
  associateVPC(vpc: ec2.Vpc, securityGroups: ec2.SecurityGroup[]): void;
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
  public authType: vpclattice.AuthType | undefined;

  constructor(scope: constructs.Construct, id: string, props: ServiceNetworkProps) {
    super(scope, id);

    const serviceNetwork = new aws_vpclattice.CfnServiceNetwork(this, 'Resource', {
      name: props.name,
    });

    this.serviceNetworkId = serviceNetwork.attrId;
    this.serviceNetworkArn = serviceNetwork.attrArn;
  }

  /**
   * - Add an IAM policy to the service network. statements should only
   * contain a single action 'vpc-lattice-svcs:Invoke' and a single resource
   * which is the service network ARN. The policy statements resource and action
   * are optional. If they are not provided, the correct values will be set.
   *
   * @param policyStatements
   */
  public addLatticeAuthPolicy(policyStatements: iam.PolicyStatement[]): void {

    let policyDocument: iam.PolicyDocument = new iam.PolicyDocument();

    // create the policy document and validdate the action
    const validAction = ['vpc-lattice-svcs:Invoke'];
    const validResources = [this.serviceNetworkArn];

    policyStatements.forEach((statement) => {
      if (statement.actions === undefined) {
        statement.addActions('vpc-lattice-svcs:Invoke');
      }
      if (statement.resources === undefined) {
        statement.addResources(this.serviceNetworkArn);
      }
      policyDocument.addStatements(statement);

      if (statement.actions !== validAction) {
        throw new Error('The actions for the policy statement are invalid, They must only be [\'vpc-lattice-svcs:Invoke\']');
      }
      if (statement.resources !== validResources) {
        throw new Error('The resources for the policy statement are invalid, They must only be [\'' + this.serviceNetworkArn + '\']');
      }
    });

    if (policyDocument.validateForResourcePolicy().length > 0) {
      throw new Error('policyDocument.validateForResourcePolicy() failed');
    }

    this.authType = vpclattice.AuthType.IAM;

    new aws_vpclattice.CfnAuthPolicy(this, 'AuthPolicy', {
      policy: policyDocument.toJSON(),
      resourceIdentifier: this.serviceNetworkId,
    });
  }

  public addService(service: vpclattice.Service): void {

    new aws_vpclattice.CfnServiceNetworkServiceAssociation(this, 'LatticeServiceAssociation', {
      serviceIdentifier: service.serviceId,
      serviceNetworkIdentifier: this.serviceNetworkId,
    });

  }
}
