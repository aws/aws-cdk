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
  constructor(scope: Construct, id: string, props: VpcEndpointServiceDomainNameProps) {
    super(scope, id);
    const serviceId = props.endpointService.vpcEndpointServiceId;
    const privateDnsName = props.domainName;

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

    // We're always going to check the DNS details of the endpoint service
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
    const name = getNames.getResponseField('ServiceConfigurations.0.PrivateDnsNameConfiguration.Name');
    const value = getNames.getResponseField('ServiceConfigurations.0.PrivateDnsNameConfiguration.Value');

    const verificationRecord = new TxtRecord(this, 'DnsVerificationRecord', {
      recordName: name,
      values: [value],
      zone: props.publicZone,
    });
    verificationRecord.node.addDependency(getNames);

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
    startVerification.node.addDependency(verificationRecord);

    this.node.addDependency(props.endpointService);
  }
}

/**
 * Generate a random hex string
 */
function randomString(): string {
  return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8);
}