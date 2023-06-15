import * as core from 'aws-cdk-lib';
import {
  aws_vpclattice,
  aws_iam as iam,
  aws_certificatemanager as certificatemanager,
  aws_ram as ram,
  custom_resources as cr,
}
  from 'aws-cdk-lib';
import * as constructs from 'constructs';
import {
  IListener,
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
  readonly accounts: string[] | undefined
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
   * Annon Access Allowed
   */
  readonly anonymousAccessAllowed: boolean;
  /**
   * Allow access from Principals that are not in this organisation
   */
  readonly externalPrincipalsAllowed: boolean;
  /**
   * Allow an Odd
   */
  readonly orgId: string | undefined;
  /**
   * Add A vpc listener to the Service.
   * @param props
   */
  shareToAccounts(props: ShareServiceProps): void;

  /**
   * Grant Access to other principals
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
   * @default no listeners
  */
  readonly listeners?: IListener[] | undefined;

  /**
   * A certificate that may be used by the service
   * @default no custom certificate is used
   */
  readonly certificate?: certificatemanager.Certificate | undefined;
  /**
   * A customDomain used by the service
   * @default no customdomain is used
   */
  readonly customDomain?: string | undefined;
  /**
   * A custom hosname
   * @default no hostname is used
   */
  readonly dnsEntry?: aws_vpclattice.CfnService.DnsEntryProperty | undefined;

  /**
   * Share Service
   *@default no sharing of the service
   */
  readonly shares?: ShareServiceProps[] | undefined;

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
  readonly serviceArn: string;
  /**
   * Annon Access Allowed
   */
  readonly anonymousAccessAllowed: boolean;
  /**
   * Allow access from Principals that are not in this organisation
   */
  readonly externalPrincipalsAllowed: boolean;
  /**
   * the discovered OrgId
   */
  readonly orgId: string | undefined;
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

  /**
  * Allow external principals
  */
  allowExternalPrincipals: boolean | undefined;

  /**
    * Allow unauthenticated access
    */
  allowUnauthenticatedAccess?: boolean | undefined;

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
    this.externalPrincipalsAllowed = props.allowExternalPrincipals ?? false;
    this.anonymousAccessAllowed = props.allowUnauthenticatedAccess ?? false;

    if (this.allowExternalPrincipals === false) {

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

      this.orgId = orgIdCr.getResponseField('Organization.Id');

    }
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

    // eslint-disable-next-line no-console
    console.log(JSON.stringify(this.authPolicy));

    if (this.authType === 'NONE') {
      throw new Error('Can not apply a policy when authType is NONE');
    }

    if (this.authPolicy.validateForResourcePolicy().length > 0) {
      throw new Error(
        `The following errors were found in the policy: \n${this.authPolicy.validateForResourcePolicy()} \n ${this.authPolicy}`);
    }

    // interate over all statements and add conditons.

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
   * Share the service to other accounts via RAM
   * @param props SharedServiceProps
   */
  public shareToAccounts(props: ShareServiceProps): void {

    new ram.CfnResourceShare(this, 'ServiceNetworkShare', {
      name: props.name,
      resourceArns: [this.serviceArn],
      allowExternalPrincipals: props.allowExternalPrincipals,
      principals: props.accounts,
    });
  }
}