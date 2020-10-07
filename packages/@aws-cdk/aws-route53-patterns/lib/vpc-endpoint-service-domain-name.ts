import { IVpcEndpointService } from '@aws-cdk/aws-ec2';
import { IPublicHostedZone, TxtRecord } from '@aws-cdk/aws-route53';
import { Fn } from '@aws-cdk/core';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from '@aws-cdk/custom-resources';
import { Construct } from 'constructs';

// v2 - keep this import as a separate section to reduce merge conflict when forward merging with the v2 branch.
// eslint-disable-next-line
import { Construct as CoreConstruct } from '@aws-cdk/core';

/**
 * Properties to configure a VPC Endpoint Service domain name
 */
export interface VpcEndpointServiceDomainNameProps {

  /**
   * The VPC Endpoint Service to configure Private DNS for
   */
  readonly endpointService: IVpcEndpointService;

  /**
   * The domain name to use.
   *
   * This domain name must be verifiably owned by this account, or otherwise
   * delegated to this account.
   * https://docs.aws.amazon.com/vpc/latest/userguide/endpoint-services-dns-validation.html
   */
  readonly domainName: string;

  /**
   * The public hosted zone to use for the domain.
   */
  readonly publicZone: IPublicHostedZone;
}

/**
 * A Private DNS configuration for a VPC endpoint service.
 */
export class VpcEndpointServiceDomainName extends CoreConstruct {

  // Track all domain names created, so someone doesn't accidentally associate two domains with a single service
  private static readonly endpointServices: IVpcEndpointService[] = [];

  // The way this class works is by using three custom resources and a TxtRecord in conjunction
  // The first custom resource tells the VPC endpoint service to use the given DNS name
  // The VPC endpoint service will then say:
  // "ok, create a TXT record using these two values to prove you own the domain"
  // The second custom resource retrieves these two values from the service
  // The TxtRecord is created from these two values
  // The third custom resource tells the VPC Endpoint Service to verify the domain ownership
  constructor(scope: Construct, id: string, props: VpcEndpointServiceDomainNameProps) {
    super(scope, id);

    // Make sure a user doesn't accidentally add multiple domains
    this.validateParams(props);
    VpcEndpointServiceDomainName.endpointServices.push(props.endpointService);

    const serviceId = props.endpointService.vpcEndpointServiceId;
    const privateDnsName = props.domainName;

    // Turns creates the Private DNS configuration on the endpoint service
    const enable = new AwsCustomResource(this, 'EnableDns', {
      onCreate: {
        service: 'EC2',
        action: 'modifyVpcEndpointServiceConfiguration',
        parameters: {
          ServiceId: serviceId,
          PrivateDnsName: privateDnsName,
        },
        physicalResourceId: PhysicalResourceId.of(id),
      },
      onUpdate: {
        service: 'EC2',
        action: 'modifyVpcEndpointServiceConfiguration',
        parameters: {
          ServiceId: serviceId,
          PrivateDnsName: privateDnsName,
        },
        physicalResourceId: PhysicalResourceId.of(id),
      },
      onDelete: {
        service: 'EC2',
        action: 'modifyVpcEndpointServiceConfiguration',
        parameters: {
          ServiceId: serviceId,
          RemovePrivateDnsName: true,
        },
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });

    // Get the name/value pair for the TxtRecord
    // We're always going to check the name/value because it's harmless
    const guaranteeAlwaysLookup = randomString();
    const getNames = new AwsCustomResource(this, 'GetNames', {
      onCreate: {
        service: 'EC2',
        action: 'describeVpcEndpointServiceConfigurations',
        parameters: {
          ServiceIds: [serviceId],
        },
        physicalResourceId: PhysicalResourceId.of(guaranteeAlwaysLookup),
      },
      onUpdate: {
        service: 'EC2',
        action: 'describeVpcEndpointServiceConfigurations',
        parameters: {
          ServiceIds: [serviceId],
        },
        physicalResourceId: PhysicalResourceId.of(guaranteeAlwaysLookup),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });
    // We only want to call and get the TXT DNS details after we've enabled private DNS
    getNames.node.addDependency(enable);

    // Here are the name/value we get from the endpoint service
    const name = getNames.getResponseField('ServiceConfigurations.0.PrivateDnsNameConfiguration.Name');
    const value = getNames.getResponseField('ServiceConfigurations.0.PrivateDnsNameConfiguration.Value');

    // Create the TXT record in the provided hosted zone
    const verificationRecord = new TxtRecord(this, 'DnsVerificationRecord', {
      recordName: name,
      values: [value],
      zone: props.publicZone,
    });
    // Only try making it once we have the values
    verificationRecord.node.addDependency(getNames);

    // Tell the endpoint service to verify the domain ownership
    const startVerification = new AwsCustomResource(this, 'StartVerification', {
      onCreate: {
        service: 'EC2',
        action: 'startVpcEndpointServicePrivateDnsVerification',
        parameters: {
          ServiceId: serviceId,
        },
        physicalResourceId: PhysicalResourceId.of(Fn.join(':', [name, value])),
      },
      onUpdate: {
        service: 'EC2',
        action: 'startVpcEndpointServicePrivateDnsVerification',
        parameters: {
          ServiceId: serviceId,
        },
        physicalResourceId: PhysicalResourceId.of(Fn.join(':', [name, value])),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });
    // Only verify after the record has been created
    startVerification.node.addDependency(verificationRecord);

    // Finally, don't do any of the above before the endpoint service is created
    this.node.addDependency(props.endpointService);
  }

  private validateParams(props: VpcEndpointServiceDomainNameProps): void {
    if (VpcEndpointServiceDomainName.endpointServices.includes(props.endpointService)) {
      throw new Error(
        'Cannot create a VpcEndpointServiceDomainName for service ' +
        props.endpointService.node.uniqueId +
        ', another VpcEndpointServiceDomainName is already associated with it');
    }
  }
}

/**
 * Generate a random hex string
 */
function randomString(): string {
  return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8);
}