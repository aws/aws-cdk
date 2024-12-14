import { Template } from '../../assertions';
import { IVpcEndpointServiceLoadBalancer, VpcEndpointService } from '../../aws-ec2';
import { Stack } from '../../core';
import { PublicHostedZone, VpcEndpointServiceDomainName } from '../lib';

let stack: Stack;
let nlb: IVpcEndpointServiceLoadBalancer;
let vpces: VpcEndpointService;
let zone: PublicHostedZone;

/**
 * A load balancer that can host a VPC Endpoint Service
 */
class DummyEndpointLoadBalancer implements IVpcEndpointServiceLoadBalancer {
  /**
   * The ARN of the load balancer that hosts the VPC Endpoint Service
   */
  public readonly loadBalancerArn: string;
  constructor(arn: string) {
    this.loadBalancerArn = arn;
  }
}

beforeEach(() => {
  stack = new Stack();
  nlb = new DummyEndpointLoadBalancer('arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a');
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
    publicHostedZone: zone,
  });

  // THEN
  Template.fromStack(stack).hasResource('Custom::AWS', {
    Properties: {
      Create: {
        'Fn::Join': [
          '',
          [
            '{"service":"EC2","action":"modifyVpcEndpointServiceConfiguration","parameters":{"ServiceId":"',
            {
              Ref: 'VPCES3AE7D565',
            },
            '","PrivateDnsName":"my-stuff.aws-cdk.dev"},"physicalResourceId":{"id":"VPCES"}}',
          ],
        ],
      },
      Update: {
        'Fn::Join': [
          '',
          [
            '{"service":"EC2","action":"modifyVpcEndpointServiceConfiguration","parameters":{"ServiceId":"',
            {
              Ref: 'VPCES3AE7D565',
            },
            '","PrivateDnsName":"my-stuff.aws-cdk.dev"},"physicalResourceId":{"id":"VPCES"}}',
          ],
        ],
      },
      Delete: {
        'Fn::Join': [
          '',
          [
            '{"service":"EC2","action":"modifyVpcEndpointServiceConfiguration","parameters":{"ServiceId":"',
            {
              Ref: 'VPCES3AE7D565',
            },
            '","RemovePrivateDnsName":true}}',
          ],
        ],
      },
    },
    DependsOn: [
      'EndpointDomainEnableDnsCustomResourcePolicy5E6DE7EB',
      'VPCES3AE7D565',
    ],
  });

  // Have to use `haveResourceLike` because there is a property that, by design, changes on every build
  Template.fromStack(stack).hasResource('Custom::AWS', {
    Properties: {
      Create: {
        'Fn::Join': [
          '',
          [
            '{"service":"EC2","action":"describeVpcEndpointServiceConfigurations","parameters":{"ServiceIds":["',
            {
              Ref: 'VPCES3AE7D565',
            },
            '"]},"physicalResourceId":{"id":"fcd2563479244a851a9a59af60831b01"}}',
          ],
        ],
      },
      Update: {
        'Fn::Join': [
          '',
          [
            '{"service":"EC2","action":"describeVpcEndpointServiceConfigurations","parameters":{"ServiceIds":["',
            {
              Ref: 'VPCES3AE7D565',
            },
            '"]},"physicalResourceId":{"id":"fcd2563479244a851a9a59af60831b01"}}',
          ],
        ],
      },
    },
    DependsOn: [
      'EndpointDomainEnableDnsCustomResourcePolicy5E6DE7EB',
      'EndpointDomainEnableDnsDACBF5A6',
      'EndpointDomainGetNamesCustomResourcePolicy141775B1',
      'VPCES3AE7D565',
    ],
  });

  Template.fromStack(stack).hasResource('AWS::Route53::RecordSet', {
    Properties: {
      Name: {
        'Fn::Join': [
          '',
          [
            {
              'Fn::GetAtt': [
                'EndpointDomainGetNames9E697ED2',
                'ServiceConfigurations.0.PrivateDnsNameConfiguration.Name',
              ],
            },
            '.aws-cdk.dev.',
          ],
        ],
      },
      Type: 'TXT',
      HostedZoneId: {
        Ref: 'PHZ45BE903D',
      },
      ResourceRecords: [
        {
          'Fn::Join': [
            '',
            [
              '\"',
              {
                'Fn::GetAtt': [
                  'EndpointDomainGetNames9E697ED2',
                  'ServiceConfigurations.0.PrivateDnsNameConfiguration.Value',
                ],
              },
              '\"',
            ],
          ],
        },
      ],
      TTL: '1800',
    },
    DependsOn: [
      'VPCES3AE7D565',
    ],
  });

  Template.fromStack(stack).hasResource('Custom::AWS', {
    Properties: {
      Create: {
        'Fn::Join': [
          '',
          [
            '{"service":"EC2","action":"startVpcEndpointServicePrivateDnsVerification","parameters":{"ServiceId":"',
            {
              Ref: 'VPCES3AE7D565',
            },
            '"},"physicalResourceId":{"id":"',
            {
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
            '"}}',
          ],
        ],
      },
      Update: {
        'Fn::Join': [
          '',
          [
            '{"service":"EC2","action":"startVpcEndpointServicePrivateDnsVerification","parameters":{"ServiceId":"',
            {
              Ref: 'VPCES3AE7D565',
            },
            '"},"physicalResourceId":{"id":"',
            {
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
            '"}}',
          ],
        ],
      },
    },
    DependsOn: [
      'EndpointDomainDnsVerificationRecord66623BDA',
      'EndpointDomainStartVerificationCustomResourcePolicyD2BAC9A6',
      'VPCES3AE7D565',
    ],
  });
});

test('throws if creating multiple domains for a single service', () => {
  // GIVEN
  vpces = new VpcEndpointService(stack, 'VPCES-2', {
    vpcEndpointServiceLoadBalancers: [nlb],
  });

  new VpcEndpointServiceDomainName(stack, 'EndpointDomain', {
    endpointService: vpces,
    domainName: 'my-stuff-1.aws-cdk.dev',
    publicHostedZone: zone,
  });

  // WHEN / THEN
  expect(() => {
    new VpcEndpointServiceDomainName(stack, 'EndpointDomain2', {
      endpointService: vpces,
      domainName: 'my-stuff-2.aws-cdk.dev',
      publicHostedZone: zone,
    });
  }).toThrow(/Cannot create a VpcEndpointServiceDomainName for service/);
});

test('endpoint domain name property equals input domain name', () => {
  // GIVEN
  vpces = new VpcEndpointService(stack, 'NameTest', {
    vpcEndpointServiceLoadBalancers: [nlb],
  });

  const dn = new VpcEndpointServiceDomainName(stack, 'EndpointDomain', {
    endpointService: vpces,
    domainName: 'name-test.aws-cdk.dev',
    publicHostedZone: zone,
  });
  expect(dn.domainName).toEqual('name-test.aws-cdk.dev');
});
