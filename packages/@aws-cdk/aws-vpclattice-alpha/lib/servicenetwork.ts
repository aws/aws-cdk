import {
  aws_vpclattice,
  aws_iam as iam,
  aws_ec2 as ec2,
  aws_ram as ram,
  custom_resources as cr,
}
  from 'aws-cdk-lib';
import * as core from 'aws-cdk-lib';
import * as constructs from 'constructs';
import {
  IService,
  AuthType,
  LoggingDestination,
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
  readonly vpc: ec2.IVpc;
  /**
   * The security groups to associate with the Service Network
   * @default a security group that allows inbound 443 will be permitted.
   */
  readonly securityGroups?: ec2.SecurityGroup[] | undefined
}
/**
 * Properties to add a logging Destination
 */

export interface AddloggingDestinationProps{
  /**
   * The logging destination
   */
  readonly destination: LoggingDestination
}

// addService Props
/**
 * Properties to add a Service to a Service Network
 */
export interface AddServiceProps {
  /**
   * The Service to add to the Service Network
   */
  readonly service: IService;
  /**
   * The Service Network to add the Service to
   */
  readonly serviceNetworkId: string;
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
   * Add Lattice Service
   */
  addService(props: AddServiceProps): void;
  /**
   * Associate a VPC with the Service Network
   */
  associateVPC(props: AssociateVPCProps): void;
  /**
   * Add a logging Destination.
   */
  addloggingDestination(props: AddloggingDestinationProps): void;
  /**
   * Share the ServiceNetwork, Consider if it is more appropriate to do this at the service.
   */
  share(props: ShareServiceNetworkProps): void;

  /**
   * Add a statement to the auth policy. This should be high level coarse policy, consider only adding
   * statements here that have DENY effects
   * @param statement the policy statement to add.
   */
  addStatementToAuthPolicy(statement: iam.PolicyStatement): void;
  /**
  * Apply auth policy to the Service Network
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
  readonly name?: string

  /**
   * The type of  authentication to use with the Service Network
   * @default 'AWS_IAM'
   */
  readonly authType?: AuthType | undefined;

  /**
   * Logging destinations
   * @default: no logging
   */
  readonly loggingDestinations?: LoggingDestination[];

  /**
   * Lattice Services that are assocaited with this Service Network
   * @default no services are associated with the service network
   */
  readonly services?: IService[] | undefined;

  /**
   * Vpcs that are associated with this Service Network
   * @default no vpcs are associated
   */
  readonly vpcs?: ec2.IVpc[] | undefined;
  /**
   * Allow external principals
   * @default false
   */
  readonly allowExternalPrincipals?: boolean | undefined;

  /**
   * Allow unauthenticated access
   * @default false
   */
  readonly allowUnauthenticatedAccess?: boolean | undefined;
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
  authType: AuthType | undefined;
  /**
   * policy document to be used.
   */
  //authPolicy: iam.PolicyDocument = new iam.PolicyDocument();
  /**
   * A managed Policy that is the auth policy
   */
  authPolicy: iam.PolicyDocument

  constructor(scope: constructs.Construct, id: string, props: ServiceNetworkProps) {
    super(scope, id);

    if (props.name !== undefined) {
      if (props.name.match(/^[a-z0-9\-]{3,63}$/) === null) {
        throw new Error('Theservice network name must be between 3 and 63 characters long. The name can only contain alphanumeric characters and hyphens. The name must be unique to the account.');
      }
    }
    // the opinionated default for the servicenetwork is to use AWS_IAM as the
    // authentication method. Provide 'NONE' to props.authType to disable.

    this.authType = props.authType ?? AuthType.AWS_IAM;
    const serviceNetwork = new aws_vpclattice.CfnServiceNetwork(this, 'Resource', {
      name: props.name,
      authType: this.authType,
    });

    this.serviceNetworkId = serviceNetwork.attrId;
    this.serviceNetworkArn = serviceNetwork.attrArn;

    if (props.loggingDestinations !== undefined) {
      props.loggingDestinations.forEach((destination) => {
        this.addloggingDestination({
          destination: destination,
        });
      });
    }

    // associate vpcs
    if (props.vpcs !== undefined) {
      props.vpcs.forEach((vpc) => {
        this.associateVPC({ vpc: vpc });
      });
    };

    //associate services
    if (props.services !== undefined) {
      props.services.forEach((service) => {
        this.addService({
          service: service,
          serviceNetworkId: this.serviceNetworkId,
        });
      });
    };

    // create a managedPolicy for the lattice ServiceNetwork.
    this.authPolicy = new iam.PolicyDocument();

    const statement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['vpc-lattice-svcs:Invoke'],
      resources: ['*'],
      principals: [new iam.AnyPrincipal()],
    });

    if ((props.allowExternalPrincipals ?? false) === false) {

      // get my orgId
      const orgIdCr = new cr.AwsCustomResource(this, 'getOrgId', {
        onCreate: {
          region: 'us-east-1',
          service: 'Organizations',
          action: 'describeOrganization',
          physicalResourceId: cr.PhysicalResourceId.of('orgId'),
        },
        policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
          resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
        }),
      });

      const orgId = orgIdCr.getResponseField('Organization.Id');

      // add the condition that requires that the principal is from this org
      statement.addCondition('StringEquals', { 'aws:PrincipalOrgID': [orgId] } );
    };
    if ((props.allowUnauthenticatedAccess ?? false) === false) {
      // add the condition that the principal is not anonymous
      statement.addCondition('StringNotEqualsIgnoreCase', { 'aws:PrincipalType': 'anonymous' } );
    };

    this.authPolicy.addStatements(statement);

  };

  /**
   * This will give the principals access to all resources that are on this
   * service network. This is a broad permission.
   * Consider granting Access at the Service
   * addToResourcePolicy()
   *
   */
  addStatementToAuthPolicy(statement: iam.PolicyStatement): void {
    this.authPolicy.addStatements(statement);
  }

  // addToResourcePolicy(permission)
  public applyAuthPolicyToServiceNetwork(): void {

    // check to see if there are any errors with the auth policy
    if (this.authPolicy.validateForResourcePolicy().length > 0) {
      throw new Error(`Auth Policy for granting access on  Service Network is invalid\n, ${this.authPolicy}`);
    }
    // check to see if the AuthType is AWS_IAM
    if (this.authType !== AuthType.AWS_IAM ) {
      throw new Error(`AuthType must be ${AuthType.AWS_IAM} to add an Auth Policy`);
    }

    // attach the AuthPolicy to the Service Network
    new aws_vpclattice.CfnAuthPolicy(this, 'AuthPolicy', {
      policy: this.authPolicy.toJSON(),
      resourceIdentifier: this.serviceNetworkArn,
    });

  }
  /**
   * Add A lattice service to a lattice network
   */
  public addService(props: AddServiceProps): void {

    new ServiceAssociation(this, `ServiceAssociation${props.service.node.addr}`, {
      service: props.service,
      serviceNetworkId: this.serviceNetworkId,
    });
  }

  /**
   * Associate a VPC with the Service Network
   * This provides an opinionated default of adding a security group to allow inbound 443
   */
  public associateVPC(props: AssociateVPCProps): void {

    new AssociateVpc(this, `AssociateVPC${props.vpc.node.addr}`, {
      vpc: props.vpc,
      securityGroups: props.securityGroups,
      serviceNetworkId: this.serviceNetworkId,
    });
  };

  /**
   * send logs to a destination
   */
  public addloggingDestination(props: AddloggingDestinationProps): void {

    new aws_vpclattice.CfnAccessLogSubscription(this, `AccessLogSubscription${props.destination.addr}`, {
      destinationArn: props.destination.arn,
      resourceIdentifier: this.serviceNetworkId,
    });
  };

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

/**
 * Props to Associate a VPC with a Service Network
 */
export interface AssociateVpcProps {
  /**
   * security groups for the lattice endpoint
   * @default a security group that will permit inbound 443
   */
  readonly securityGroups?: ec2.ISecurityGroup[],
  /**
   * The VPC to associate with
   */
  readonly vpc: ec2.IVpc,
  /**
   * Service Network Identifier
   */
  readonly serviceNetworkId: string,
}
/**
 * Associate a VPO with Lattice Service Network
 */
export class AssociateVpc extends core.Resource {

  constructor(scope: constructs.Construct, id: string, props: AssociateVpcProps) {
    super(scope, id);

    const securityGroupIds: string[] = [];

    if (props.securityGroups === undefined) {
      const securityGroup = new ec2.SecurityGroup(this, `ServiceNetworkSecurityGroup${this.node.addr}`, {
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

    new aws_vpclattice.CfnServiceNetworkVpcAssociation(this, `VpcAssociation${this.node.addr}`, {
      securityGroupIds: securityGroupIds,
      serviceNetworkIdentifier: props.serviceNetworkId,
      vpcIdentifier: props.vpc.vpcId,
    });
  };
};

/**
 * Props for Service Assocaition
 */
export interface ServiceAssociationProps {
  /**
   * lattice Service
   */
  readonly service: IService;
  /**
   * Lattice ServiceId
   */
  readonly serviceNetworkId: string;
}

/**
 * Creates an Association Between a Lattice Service and a Service Network
 */
export class ServiceAssociation extends core.Resource {

  constructor(scope: constructs.Construct, id: string, props: ServiceAssociationProps) {
    super(scope, id);

    new aws_vpclattice.CfnServiceNetworkServiceAssociation(this, `LatticeService${this.node.addr}`, {
      serviceIdentifier: props.service.serviceId,
      serviceNetworkIdentifier: props.serviceNetworkId,
    });
  };
};

/**
 * Props for LoggingSubscription
 */
export interface LoggingSubscriptionProps {
  /**
   * destination for the logs
   */
  readonly destination: LoggingDestination;
  /**
   * serviceNetwork Id
   */
  readonly serviceNetworkId: string;
}

/**
 * A Lattice Service Network Logging subscription
 */
export class LoggingSubscription extends core.Resource {

  constructor(scope: constructs.Construct, id: string, props: LoggingSubscriptionProps) {
    super(scope, id);

    new aws_vpclattice.CfnAccessLogSubscription(this, `AccessLogSubscription${this.node.addr}`, {
      destinationArn: props.destination.arn,
      resourceIdentifier: props.serviceNetworkId,
    });
  };
}