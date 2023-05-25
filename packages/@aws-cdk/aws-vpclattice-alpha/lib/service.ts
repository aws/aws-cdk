import * as core from 'aws-cdk-lib';
import {
  aws_vpclattice,
  aws_iam as iam,
  aws_certificatemanager as certificatemanager,
  aws_ram as ram,
}
  from 'aws-cdk-lib';
import * as constructs from 'constructs';
import * as vpclattice from './index';

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
  addListener(props: vpclattice.ListenerProps): vpclattice.Listener;
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
}


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
 * Properties for a Lattice Service
 */
export interface LatticeServiceProps {
  /**
   * Name for the service
   * @default cloudformation will provide a name
   */
  readonly name?: string | undefined
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
  authType: vpclattice.AuthType | undefined;
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

  constructor(scope: constructs.Construct, id: string, props: LatticeServiceProps) {
    super(scope, id);

    this.name = props.name;

    const service = new aws_vpclattice.CfnService(this, 'Resource', {
      authType: this.authType ?? vpclattice.AuthType.NONE,
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
  public grantAccess(principals: iam.IPrincipal[]): iam.PolicyDocument {

    let policyDocument: iam.PolicyDocument = new iam.PolicyDocument();
    let policyStatement: iam.PolicyStatement = new iam.PolicyStatement();

    // create the policy document

    principals.forEach((principal) => {
      principal.addToPrincipalPolicy(policyStatement);
    });
    policyStatement.addActions('vpc-lattice-svcs:Invoke');
    policyStatement.addResources(this.serviceArn + '/*');


    if (policyDocument.validateForResourcePolicy().length > 0) {
      throw new Error('policyDocument.validateForResourcePolicy() failed');
    }

    this.authType = vpclattice.AuthType.IAM;

    new aws_vpclattice.CfnAuthPolicy(this, 'AuthPolicy', {
      policy: policyDocument.toJSON(),
      resourceIdentifier: this.serviceId,
    });

    return policyDocument;
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

  public addCustomDomain(domain: string): void {

    // TODO:validate the domain is ok
    this.customDomain = domain;
  }

  public addDNSEntry(dnsEntry: aws_vpclattice.CfnService.DnsEntryProperty): void {

    this.dnsEntry = dnsEntry;
  }

  public addListener(props: vpclattice.addListenerProps): vpclattice.Listener {

    // check the the port is in range if it is specificed
    if (props.port) {
      if (props.port < 0 || props.port > 65535) {
        throw new Error('Port out of range');
      }
    }

    // default to using HTTPS
    let protocol = props.protocol ?? vpclattice.Protocol.HTTPS;

    // if its not specified, set it to the default port based on the protcol
    let port: number;
    switch (protocol) {
      case vpclattice.Protocol.HTTP:
        port = props.port ?? 80;
        break;
      case vpclattice.Protocol.HTTPS:
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
          statusCode: vpclattice.FixedResponse.NOT_FOUND,
        },
      };
    }

    const listener = new vpclattice.Listener(this, `Listener-${props.name}`, {
      defaultAction: defaultAction,
      protocol: protocol,
      port: port,
      serviceIdentifier: this.serviceId,
      name: props.name,
    });

    return listener;
  }

  public share(props: ShareServiceProps): void {

    new ram.CfnResourceShare(this, 'ServiceNetworkShare', {
      name: props.name,
      resourceArns: [this.serviceArn],
      allowExternalPrincipals: props.allowExternalPrincipals,
      principals: props.principals,
    });
	  }
}


