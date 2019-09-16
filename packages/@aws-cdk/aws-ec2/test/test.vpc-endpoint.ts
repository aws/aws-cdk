import { expect, haveResource } from '@aws-cdk/assert';
import { AnyPrincipal, PolicyStatement } from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
// tslint:disable-next-line:max-line-length
import { GatewayVpcEndpoint, GatewayVpcEndpointAwsService, InterfaceVpcEndpoint, InterfaceVpcEndpointAwsService, SubnetType, Vpc } from '../lib';

export = {
  'gateway endpoint': {
    'add an endpoint to a vpc'(test: Test) {
      // GIVEN
      const stack = new Stack();

      // WHEN
      new Vpc(stack, 'VpcNetwork', {
        gatewayEndpoints: {
          S3: {
            service: GatewayVpcEndpointAwsService.S3
          }
        }
      });

      // THEN
      expect(stack).to(haveResource('AWS::EC2::VPCEndpoint', {
        ServiceName: {
          'Fn::Join': [
            '',
            [
              'com.amazonaws.',
              {
                Ref: 'AWS::Region'
              },
              '.s3'
            ]
          ]
        },
        VpcId: {
          Ref: 'VpcNetworkB258E83A'
        },
        RouteTableIds: [
          {
            Ref: 'VpcNetworkPrivateSubnet1RouteTableCD085FF1'
          },
          {
            Ref: 'VpcNetworkPrivateSubnet2RouteTableE97B328B'
          },
        ],
        VpcEndpointType: 'Gateway'
      }));

      test.done();
    },

    'routing on private and public subnets'(test: Test) {
      // GIVEN
      const stack = new Stack();

      // WHEN
      new Vpc(stack, 'VpcNetwork', {
        gatewayEndpoints: {
          S3: {
            service: GatewayVpcEndpointAwsService.S3,
            subnets: [
              {
                subnetType: SubnetType.PUBLIC
              },
              {
                subnetType: SubnetType.PRIVATE
              }
            ]
          }
        }
      });

      // THEN
      expect(stack).to(haveResource('AWS::EC2::VPCEndpoint', {
        ServiceName: {
          'Fn::Join': [
            '',
            [
              'com.amazonaws.',
              {
                Ref: 'AWS::Region'
              },
              '.s3'
            ]
          ]
        },
        VpcId: {
          Ref: 'VpcNetworkB258E83A'
        },
        RouteTableIds: [
          {
            Ref: 'VpcNetworkPublicSubnet1RouteTable25CCC53F'
          },
          {
            Ref: 'VpcNetworkPublicSubnet2RouteTableE5F348DF'
          },
          {
            Ref: 'VpcNetworkPrivateSubnet1RouteTableCD085FF1'
          },
          {
            Ref: 'VpcNetworkPrivateSubnet2RouteTableE97B328B'
          },
        ],
        VpcEndpointType: 'Gateway'
      }));

      test.done();
    },

    'add statements to policy'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VpcNetwork');
      const endpoint = vpc.addGatewayEndpoint('S3', {
        service: GatewayVpcEndpointAwsService.S3
      });

      // WHEN
      endpoint.addToPolicy(new PolicyStatement({
        principals: [new AnyPrincipal()],
        actions: ['s3:GetObject', 's3:ListBucket'],
        resources: ['*']
      }));

      // THEN
      expect(stack).to(haveResource('AWS::EC2::VPCEndpoint', {
        PolicyDocument: {
          Statement: [
            {
              Action: [
                's3:GetObject',
                's3:ListBucket'
              ],
              Effect: 'Allow',
              Principal: '*',
              Resource: '*'
            }
          ],
          Version: '2012-10-17'
        }
      }));

      test.done();
    },

    'throws when adding a statement without a principal'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VpcNetwork');
      const endpoint = vpc.addGatewayEndpoint('S3', {
        service: GatewayVpcEndpointAwsService.S3
      });

      // THEN
      test.throws(() => endpoint.addToPolicy(new PolicyStatement({
        actions: ['s3:GetObject', 's3:ListBucket'],
        resources: ['*']
      })), /`Principal`/);

      test.done();
    },

    'import/export'(test: Test) {
      // GIVEN
      const stack2 = new Stack();

      // WHEN
      const ep = GatewayVpcEndpoint.fromGatewayVpcEndpointId(stack2, 'ImportedEndpoint', 'endpoint-id');

      // THEN
      test.deepEqual(ep.vpcEndpointId, 'endpoint-id');
      test.done();
    },

    'works with an imported vpc'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const vpc = Vpc.fromVpcAttributes(stack, 'VPC', {
        vpcId: 'id',
        privateSubnetIds: ['1', '2', '3'],
        privateSubnetRouteTableIds: ['rt1', 'rt2', 'rt3'],
        availabilityZones: ['a', 'b', 'c']
      });

      // THEN
      vpc.addGatewayEndpoint('Gateway', { service: GatewayVpcEndpointAwsService.S3 });

      expect(stack).to(haveResource('AWS::EC2::VPCEndpoint', {
        ServiceName: { 'Fn::Join': ['', ['com.amazonaws.', { Ref: 'AWS::Region' }, '.s3']] },
        VpcId: 'id',
        RouteTableIds: ['rt1', 'rt2', 'rt3'],
        VpcEndpointType: 'Gateway',
      }));

      test.done();
    },

    'throws with an imported vpc without route tables ids'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const vpc = Vpc.fromVpcAttributes(stack, 'VPC', {
        vpcId: 'id',
        privateSubnetIds: ['1', '2', '3'],
        availabilityZones: ['a', 'b', 'c']
      });

      test.throws(() => vpc.addGatewayEndpoint('Gateway', { service: GatewayVpcEndpointAwsService.S3 }), /route table/);

      test.done();
    }
  },

  'interface endpoint': {
    'add an endpoint to a vpc'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VpcNetwork');

      // WHEN
      vpc.addInterfaceEndpoint('EcrDocker', {
        service: InterfaceVpcEndpointAwsService.ECR_DOCKER
      });

      // THEN
      expect(stack).to(haveResource('AWS::EC2::VPCEndpoint', {
        ServiceName: {
          'Fn::Join': [
            '',
            [
              'com.amazonaws.',
              {
                Ref: 'AWS::Region'
              },
              '.ecr.dkr'
            ]
          ]
        },
        VpcId: {
          Ref: 'VpcNetworkB258E83A'
        },
        PrivateDnsEnabled: true,
        SecurityGroupIds: [
          {
            'Fn::GetAtt': [
              'VpcNetworkEcrDockerSecurityGroup7C91D347',
              'GroupId'
            ]
          }
        ],
        SubnetIds: [
          {
            Ref: 'VpcNetworkPrivateSubnet1Subnet07BA143B'
          },
          {
            Ref: 'VpcNetworkPrivateSubnet2Subnet5E4189D6'
          },
        ],
        VpcEndpointType: 'Interface'
      }));

      expect(stack).to(haveResource('AWS::EC2::SecurityGroup', {
        GroupDescription: 'VpcNetwork/EcrDocker/SecurityGroup',
        VpcId: {
          Ref: 'VpcNetworkB258E83A'
        }
      }));

      test.done();
    },

    'import/export'(test: Test) {
      // GIVEN
      const stack2 = new Stack();

      // WHEN
      const importedEndpoint = InterfaceVpcEndpoint.fromInterfaceVpcEndpointAttributes(stack2, 'ImportedEndpoint', {
        securityGroupId: 'security-group-id',
        vpcEndpointId: 'vpc-endpoint-id',
        port: 80
      });
      importedEndpoint.connections.allowDefaultPortFromAnyIpv4();

      // THEN
      expect(stack2).to(haveResource('AWS::EC2::SecurityGroupIngress', {
        GroupId: 'security-group-id'
      }));
      test.deepEqual(importedEndpoint.vpcEndpointId, 'vpc-endpoint-id');

      test.done();
    }
  }
};
