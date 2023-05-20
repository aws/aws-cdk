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
   * Add An Authentication Policy to the Service.
   * @param policyStatements
   */
  addLatticeAuthPolicy(policyStatements: iam.PolicyStatement[]): iam.PolicyDocument;

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
}