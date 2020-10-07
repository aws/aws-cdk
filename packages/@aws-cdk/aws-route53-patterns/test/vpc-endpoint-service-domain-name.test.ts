import '@aws-cdk/assert/jest';
import { Vpc, VpcEndpointService } from '@aws-cdk/aws-ec2';
import { NetworkLoadBalancer } from '@aws-cdk/aws-elasticloadbalancingv2';
import { PublicHostedZone } from '@aws-cdk/aws-route53';
import { Stack } from '@aws-cdk/core';
import { VpcEndpointServiceDomainName } from '../lib';

let stack: Stack;
let vpc: Vpc;
let nlb: NetworkLoadBalancer;
let vpces: VpcEndpointService;
let zone: PublicHostedZone;

beforeEach(() => {
  stack = new Stack();
  vpc = new Vpc(stack, 'VPC');
  nlb = new NetworkLoadBalancer(stack, 'NLB', {
    vpc,
  });
  vpces = new VpcEndpointService(stack, 'VPCES', {
    vpcEndpointServiceLoadBalancers: [nlb],
  });
  zone = new PublicHostedZone(stack, 'PHZ', {
    zoneName: 'aws-cdk.dev',
  });
});

test('create domain name resource', () => {
  // GIVEN

  // WHEN
  new VpcEndpointServiceDomainName(stack, 'EndpointDomain', {
    endpointService: vpces,
    domainName: 'my-stuff.aws-cdk.dev',
    publicZone: zone,
  });

  // THEN
  expect(stack).toHaveResource('Custom::AWS', {
    Create: {
      action: 'modifyVpcEndpointServiceConfiguration',
      service: 'EC2',
      parameters: {
        PrivateDnsName: 'my-stuff.aws-cdk.dev',
        ServiceId: {
          Ref: 'VPCES3AE7D565',
        },
      },
      physicalResourceId: {
        id: 'EndpointDomain',
      },
    },
    Update: {
      action: 'modifyVpcEndpointServiceConfiguration',
      service: 'EC2',
      parameters: {
        PrivateDnsName: 'my-stuff.aws-cdk.dev',
        ServiceId: {
          Ref: 'VPCES3AE7D565',
        },
      },
      physicalResourceId: {
        id: 'EndpointDomain',
      },
    },
    Delete: {
      action: 'modifyVpcEndpointServiceConfiguration',
      service: 'EC2',
      parameters: {
        RemovePrivateDnsName: 'TRUE:BOOLEAN',
        ServiceId: {
          Ref: 'VPCES3AE7D565',
        },
      },
    },
  });

  expect(stack).toHaveResourceLike('Custom::AWS', {
    Create: {
      action: 'describeVpcEndpointServiceConfigurations',
      service: 'EC2',
      parameters: {
        ServiceIds: [{
          Ref: 'VPCES3AE7D565',
        }],
      },
    },
    Update: {
      action: 'describeVpcEndpointServiceConfigurations',
      service: 'EC2',
      parameters: {
        ServiceIds: [{
          Ref: 'VPCES3AE7D565',
        }],
      },
    },
  });

  expect(stack).toHaveResource('Custom::AWS', {
    Create: {
      action: 'startVpcEndpointServicePrivateDnsVerification',
      service: 'EC2',
      parameters: {
        ServiceId: {
          Ref: 'VPCES3AE7D565',
        },
      },
      physicalResourceId: {
        id: {
          'Fn::Join': [
            ':',
            [
              {
                'Fn::GetAtt': [
                  'EndpointDomainGetNames9E697ED2',
                  'ServiceConfigurations.0.PrivateDnsNameConfiguration.Name',
                ],
              },
              {
                'Fn::GetAtt': [
                  'EndpointDomainGetNames9E697ED2',
                  'ServiceConfigurations.0.PrivateDnsNameConfiguration.Value',
                ],
              },
            ],
          ],
        },
      },
    },
    Update: {
      action: 'startVpcEndpointServicePrivateDnsVerification',
      service: 'EC2',
      parameters: {
        ServiceId: {
          Ref: 'VPCES3AE7D565',
        },
      },
      physicalResourceId: {
        id: {
          'Fn::Join': [
            ':',
            [
              {
                'Fn::GetAtt': [
                  'EndpointDomainGetNames9E697ED2',
                  'ServiceConfigurations.0.PrivateDnsNameConfiguration.Name',
                ],
              },
              {
                'Fn::GetAtt': [
                  'EndpointDomainGetNames9E697ED2',
                  'ServiceConfigurations.0.PrivateDnsNameConfiguration.Value',
                ],
              },
            ],
          ],
        },
      },
    },
  });
});

test('throws if creating multiple domains for a single service', () => {
  // GIVEN

  new VpcEndpointServiceDomainName(stack, 'EndpointDomain', {
    endpointService: vpces,
    domainName: 'my-stuff-1.aws-cdk.dev',
    publicZone: zone,
  });

  // WHEN / THEN
  expect(() => {
    new VpcEndpointServiceDomainName(stack, 'EndpointDomain2', {
      endpointService: vpces,
      domainName: 'my-stuff-2.aws-cdk.dev',
      publicZone: zone,
    });
  }).toThrow();
});