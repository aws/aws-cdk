import {
  aws_vpclattice,
  aws_iam as iam,
  aws_ec2 as ec2,
  aws_s3 as s3,
  aws_logs as logs,
  aws_kinesis as kinesis,
  aws_ram as ram,
  custom_resources as cr,
}
  from 'aws-cdk-lib';
import * as core from 'aws-cdk-lib';
import * as constructs from 'constructs';
import {
  Service,
  AuthType,
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
  readonly name?: string

  /**
   * The type of  authentication to use with the Service Network
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
    const serviceNetwork = new aws_vpclattice.CfnServiceNetwork(this, 'Resource', {
      name: props.name,
      authType: props.authType ?? 'AWS_IAM',
    });

    // log to s3
    if (props.s3LogDestination !== undefined) {
      props.s3LogDestination.forEach((bucket) => {
        this.logToS3(bucket);
      });
    };

    // log to cloudwatch
    if (props.cloudwatchLogs !== undefined) {
      props.cloudwatchLogs.forEach((log) => {
        this.sendToCloudWatch(log);
      });
    };

    // log to kinesis
    if (props.kinesisStreams !== undefined) {
      props.kinesisStreams.forEach((stream) => {
        this.streamToKinesis(stream);
      });
    };

    // associate vpcs
    if (props.vpcs !== undefined) {
      props.vpcs.forEach((vpc) => {
        this.associateVPC({ vpc: vpc });
      });
    };

    //associate services
    if (props.services !== undefined) {
      props.services.forEach((service) => {
        this.addService(service);
      });
    };

    // create a managedPolicy for the lattice Service.
    this.authPolicy = new iam.PolicyDocument();

    const allowExternalPrincipals = props.allowExternalPrincipals ?? false;

    // An AWS account ID
    // An Amazon Resource Name (ARN) of an organization in AWS Organizations
    // An ARN of an organizational unit (OU) in AWS Organizations
    //

    // share the service network, and permit the account principals to use it
    if (props.accounts !== undefined) {
      props.accounts.forEach((account) => {
        this.grantAccessToServiceNetwork([account]);
        this.share({
          name: 'Share',
          principals: [account.accountId],
          allowExternalPrincipals: allowExternalPrincipals,
        });
      });
    }
    // share the service network and permit this to be used;
    if (props.arnToShareServiceWith!== undefined) {
      props.arnToShareServiceWith.forEach((resource) => {
        //check if resource is a valid arn;
        this.grantAccessToServiceNetwork([new iam.ArnPrincipal(resource)]);
        this.share({
          name: 'Share',
          principals: [resource],
          allowExternalPrincipals: allowExternalPrincipals,
        });
      });
    }

    this.serviceNetworkId = serviceNetwork.attrId;
    this.serviceNetworkArn = serviceNetwork.attrArn;

    if ((props.allowExternalPrincipals ?? false) == false) {
      // add an explict deny, so that the service network cannot be used by principals
      // that are outside of the org which this service network is deployed in

      // get my orgId
      const orgIdCr = new cr.AwsCustomResource(this, 'getOrgId', {
        onCreate: {
          service: 'Organizations',
          action: 'describeOrganization',
          physicalResourceId: cr.PhysicalResourceId.of('orgId'),
        },
        policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
          resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
        }),
      });

      const orgId = orgIdCr.getResponseField('Organization.Id');

      this.authPolicy.addStatements(
        new iam.PolicyStatement({
          effect: iam.Effect.DENY,
          actions: ['vpc-lattice-svcs:Invoke'],
          resources: ['*'],
          conditions: {
            StringNotEquals: {
              'aws:PrincipalOrgID': [orgId],
            },
          },
        }),
      );
    };

    if ((props.allowUnauthenticatedAccess ?? false) == false) {
      // add an explict deny, so that the service network cannot be be accessed by non authenticated
      // requestors.
      this.authPolicy.addStatements(
        new iam.PolicyStatement({
          effect: iam.Effect.DENY,
          actions: ['vpc-lattice-svcs:Invoke'],
          resources: ['*'],
          conditions: {
            StringNotEqualsIgnoreCase: {
              'aws:PrincipalType': 'anonymous',
            },
          },
        }),
      );
    };
  };

  /**
   * This will give the principals access to all resources that are on this
   * service network. This is a broad permission.
   * Consider granting Access at the Service
   * addToResourcePolicy()
   *
   */
  public grantAccessToServiceNetwork(principals: iam.IPrincipal[]): void {

    let policyStatement: iam.PolicyStatement = new iam.PolicyStatement();
    policyStatement.addActions('vpc-lattice-svcs:Invoke');
    policyStatement.addResources(this.serviceNetworkArn);
    policyStatement.effect = iam.Effect.ALLOW;

    principals.forEach((principal) => {
      policyStatement.addPrincipals(principal);
    });

    this.authPolicy.addStatements(policyStatement);
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
   * @param service
   */
  public addService(service: Service): void {
    new aws_vpclattice.CfnServiceNetworkServiceAssociation(this, `LatticeService$${service.serviceId}`, {
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
      const securityGroup = new ec2.SecurityGroup(this, `ServiceNetworkSecurityGroup${props.vpc.vpcId}`, {
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

    new aws_vpclattice.CfnServiceNetworkVpcAssociation(this, `${props.vpc.vpcId}VpcAssociation`, /* all optional props */ {
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
    new aws_vpclattice.CfnAccessLogSubscription(this, `LoggingtoS3${bucket.bucketName}`, {
      destinationArn: bucket.bucketArn,
      resourceIdentifier: this.serviceNetworkArn,
    });
  }
  /**
   * Send event to Cloudwatch
   * @param log
   */
  public sendToCloudWatch(log: logs.LogGroup | logs.ILogGroup): void {
    new aws_vpclattice.CfnAccessLogSubscription(this, `LattiCloudwatch${log.logGroupName}`, {
      destinationArn: log.logGroupArn,
      resourceIdentifier: this.serviceNetworkArn,
    });
  }

  /**
   * Stream Events to Kinesis
   * @param stream
   */
  public streamToKinesis(stream: kinesis.Stream | kinesis.IStream): void {
    new aws_vpclattice.CfnAccessLogSubscription(this, `LatticeKinesis${stream.streamName}`, {
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

