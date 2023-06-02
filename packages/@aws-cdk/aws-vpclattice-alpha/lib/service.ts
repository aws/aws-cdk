import * as core from 'aws-cdk-lib';
import {
  aws_vpclattice,
  aws_iam as iam,
  aws_certificatemanager as certificatemanager,
  aws_ram as ram,
}
  from 'aws-cdk-lib';
import * as constructs from 'constructs';
import {
  AddListenerProps,
  IListener,
  Listener,
  FixedResponse,
  Protocol,
}
  from './index';




/**
 * Properties to Share the Service
 */
export interface ShareServiceProps {
  /**
   * The name of the service
   */
  readonly name: string;
  /**
   * Allow External Principals
   * @default false
   */
  readonly allowExternalPrincipals?: boolean | undefined
  /**
   * Principals to share the service with.
   * TO DO, this needs some work
   * @default none
   */
  readonly principals: string[] | undefined
}

/**
 * Create a vpcLattice service network.
 * Implemented by `Service`.
 */
export interface IService extends core.IResource {
  /**
  * The Amazon Resource Name (ARN) of the service.
  */
  readonly serviceArn: string;
  /**
  * The Id of the Service Network
  */
  readonly serviceId: string;

  /**
   * Add A vpc listener to the Service.
   * @param props
   */
  addListener(props: AddListenerProps ): Listener;
  /**
   * Share the service to other accounts via RAM
   * @param props
   */
  share(props: ShareServiceProps): void;

  /**
  * Create a DNS entry in R53 for the service.
  */
  addDNSEntry(props: aws_vpclattice.CfnService.DnsEntryProperty): void;

  /**
   * Add a certificate to the service
   * @param certificate
   */
  addCertificate(certificate: certificatemanager.Certificate): void;

  /**
   * add a custom domain to the service
   * @param domain
   */
  addCustomDomain(domain: string): void;

  /**
   * add a name for the service
   * @default cloudformation will provide a name
   */
  addName(name: string): void;
  /**
   * grant access to the service
   *
   */
  grantAccess(principals: iam.IPrincipal[]): void;
  /**
   * Apply the authAuthPolicy to the Service
   */
  applyAuthPolicy(): iam.PolicyDocument;
  /**
   * Add A policyStatement to the Auth Policy
   */
  addPolicyStatement(statement: iam.PolicyStatement): void;
}


/**
 * Properties for a Lattice Service
 */
export interface LatticeServiceProps {

  /**
   * Name for the service
   * @default cloudformation will provide a name
   */
  readonly name?: string | undefined;

  /**
   * The authType of the Service
   * @default 'AWS_IAM'
   */
  readonly authType?: string | undefined;

  /**
   * Listeners that will be attached to the service
  */
  readonly listeners?: IListener[] | undefined;

  /**
   * A certificate that may be used by the service
   */
  readonly certificate?: certificatemanager.Certificate | undefined;
  /**
   * A customDomain used by the service
   */
  readonly customDomain?: string | undefined;
  /**
   * A customDomain 
   */
  readonly dnsEntry?: aws_vpclattice.CfnService.DnsEntryProperty | undefined;
  /**
   * 
   */
  readonly shares: ShareServiceProps[]; undefined;

}

/**
 * Create a vpcLattice Service
 */
export class Service extends core.Resource implements IService {
  /**
   * The Id of the Service
   */
  readonly serviceId: string
  /**
   * The Arn of the Service
   */
  readonly serviceArn: string
  /**
   * The authType of the service.
   */
  authType: string | undefined;
  /**
   * A certificate that may be used by the service
   */
  certificate: certificatemanager.Certificate | undefined;
  /**
   * A custom Domain used by the service
   */
  customDomain: string | undefined;
  /**
   * A DNS Entry for the service
   */
  dnsEntry: aws_vpclattice.CfnService.DnsEntryProperty | undefined;
  /**
  * A name for the service
  */
  name: string | undefined;
  /**
   * The auth Policy for the service.
   */
  authPolicy: iam.PolicyDocument;

  constructor(scope: constructs.Construct, id: string, props: LatticeServiceProps) {
    super(scope, id);

    this.name = props.name;
    this.authPolicy = new iam.PolicyDocument();

    if (props.name !== undefined) {
      if (props.name.match(/^[a-z0-9\-]{3,63}$/) === null) {
        throw new Error('The service  name must be between 3 and 63 characters long. The name can only contain alphanumeric characters and hyphens. The name must be unique to the account.');
      }
    }

    const service = new aws_vpclattice.CfnService(this, 'Resource', {
      authType: props.authType ?? 'AWS_IAM',
      certificateArn: this.certificate?.certificateArn,
      customDomainName: this.customDomain,
      dnsEntry: this.dnsEntry,
      name: this.name,
    });

    this.serviceId = service.attrId;
    this.serviceArn = service.attrArn;

  }

  /**
   * .grantAccess on a lattice service, will permit the principals to
   * access all of the service. Consider using more granual permissions
   * at the rule level.
   *
   * @param principals
   */
  public grantAccess(principals: iam.IPrincipal[]): void {

    let policyStatement: iam.PolicyStatement = new iam.PolicyStatement();

    principals.forEach((principal) => {
      policyStatement.addPrincipals(principal);
    });
    policyStatement.addActions('vpc-lattice-svcs:Invoke');
    policyStatement.addResources('*');
    policyStatement.effect = iam.Effect.ALLOW;


    this.authPolicy.addStatements(policyStatement);

  }
  public applyAuthPolicy(): iam.PolicyDocument {

    if (this.authType === 'NONE') {
      throw new Error('Can not apply a policy when authType is NONE');
    }

    if (this.authPolicy.validateForResourcePolicy().length > 0) {
      throw new Error('policyDocument.validateForResourcePolicy() failed');
    }

    new aws_vpclattice.CfnAuthPolicy(this, 'ServiceAuthPolicy', {
      policy: this.authPolicy.toJSON(),
      resourceIdentifier: this.serviceId,
    });

    return this.authPolicy;
  }

  public addPolicyStatement(statement: iam.PolicyStatement): void {
    this.authPolicy.addStatements(statement);
  }

  /**
   * Provide an ACM certificate to the service
   * @param certificate
   */
  public addCertificate(certificate: core.aws_certificatemanager.Certificate): void {
    this.certificate = certificate;
  }

  /**
   * Add a name to the Service
   * @param name
   */
  public addName(name: string): void {

    // TODO:validate the name is ok
    this.name = name;
  }
  /**
   * Add a custom domain to the service
   * @param domain the domain
   */
  public addCustomDomain(domain: string): void {

    // TODO:validate the domain is ok
    this.customDomain = domain;
  }
  /**
   * Add a DNS entry for the service
   * @param dnsEntry
   */
  public addDNSEntry(dnsEntry: aws_vpclattice.CfnService.DnsEntryProperty): void {

    this.dnsEntry = dnsEntry;
  }
  /**
   * Adds a listener to the service.
   * @param props AddListenerProps
   * @returns Listener
   */
  public addListener(props: AddListenerProps): Listener {

    // check the the port is in range if it is specificed
    if (props.port) {
      if (props.port < 0 || props.port > 65535) {
        throw new Error('Port out of range');
      }
    }

    // default to using HTTPS
    let protocol = props.protocol ?? Protocol.HTTPS;

    // if its not specified, set it to the default port based on the protcol
    let port: number;
    switch (protocol) {
      case Protocol.HTTP:
        port = props.port ?? 80;
        break;
      case Protocol.HTTPS:
        port = props.port ?? 443;
        break;
      default:
        throw new Error('Protocol not supported');
    }

    let defaultAction: aws_vpclattice.CfnListener.DefaultActionProperty = {};
    // the default action is a not found
    if (props.defaultAction === undefined) {
      defaultAction = {
        fixedResponse: {
          statusCode: FixedResponse.NOT_FOUND,
        },
      };
    };

    if (props.name !== undefined) {
      if (props.name.match(/^[a-z0-9\-]{3,63}$/) === null) {
        throw new Error('The listener name must be between 3 and 63 characters long. The name can only contain  lower case alphanumeric characters and hyphens. The name must be unique to the account.');
      }
    }


    const listener = new Listener(this, `Listener-${props.name}`, {
      defaultAction: defaultAction,
      protocol: protocol,
      port: port,
      serviceId: this.serviceId,
      serviceAuthPolicy: this.authPolicy,
      name: props.name,
    });

    return listener;
  }
  /**
   * Share the service to other accounts via RAM
   * @param props SharedServiceProps
   */
  public share(props: ShareServiceProps): void {

    new ram.CfnResourceShare(this, 'ServiceNetworkShare', {
      name: props.name,
      resourceArns: [this.serviceArn],
      allowExternalPrincipals: props.allowExternalPrincipals,
      principals: props.principals,
    });
	  }
}


