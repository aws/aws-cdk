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
   * Add An Authentication Policy to the Service.
   * @param policyStatement[];
   */
  addLatticeAuthPolicy(policyStatement: iam.PolicyStatement[]): iam.PolicyDocument;
  /**
   * Add A vpc listener to the Service.
   * @param props
   */
  addListener(props: AddListenerProps): vpclattice.Listener;
  /**
   * Share the service to other accounts via RAM
   * @param props
   */
  share(props: ShareServiceProps): void;

  /**
  * Create a DNS entry in R53 for the service.
  */
  addDNSEntry(props: AddDNSEntryProps): void;

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
   * add Tags to the service
   * @deafult
   */

}


export interface LatticeServiceProps {
  /**
   * Name for the service
   */
  readonly name?: string | undefined
}

/**
 * Create a vpcLattice Service
 */
export class Service extends core.Resource implements IService {

  serviceId: string
  serviceArn: string
  authType: vpclattice.AuthType | undefined;
  certificate: certificatemanager.Certificate | undefined;
  customDomain: string | undefined;
  dnsEntry: string | undefined;
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
   * add an IAM policy to the service network. statements should only
   * contain a single action 'vpc-lattice-svcs:Invoke' and a single resource
   * which is the service network ARN. The policy statements resource and action
   * are optional. If they are not provided, the correct values will be set.
   *
   * @param policyStatements
   */
  public addLatticeAuthPolicy(policyStatements: iam.PolicyStatement[]): iam.PolicyDocument {

    let policyDocument: iam.PolicyDocument = new iam.PolicyDocument();

    // create the policy document and validdate the action
    const validAction = ['vpc-lattice-svcs:Invoke'];
    const validResources = [this.serviceArn];

    policyStatements.forEach((statement) => {
      if (statement.actions === undefined) {
        statement.addActions('vpc-lattice-svcs:Invoke');
      }
      if (statement.resources === undefined) {
        statement.addResources(this.serviceArn);
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

  public addDNSEntry(props: AddDNSEntryProps): void {
    
  }

}
