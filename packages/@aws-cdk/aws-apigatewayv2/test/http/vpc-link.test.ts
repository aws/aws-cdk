import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import { Stack } from '@aws-cdk/core';
import { VpcLink } from '../../lib';

describe('VpcLink', () => {
  test('default setup', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new VpcLink(stack, 'VpcLink', {
      vpcLinkName: 'MyLink',
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::VpcLink', {
      Name: 'MyLink',
      SubnetIds: [
        {
          Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
        },
        {
          Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
        },
      ],
      SecurityGroupIds: [],
    });
  });

  test('subnets and security security groups in props', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const subnet1 = new ec2.Subnet(stack, 'subnet1', {
      vpcId: vpc.vpcId,
      availabilityZone: vpc.availabilityZones[0],
      cidrBlock: vpc.vpcCidrBlock,
    });
    const subnet2 = new ec2.Subnet(stack, 'subnet2', {
      vpcId: vpc.vpcId,
      availabilityZone: vpc.availabilityZones[1],
      cidrBlock: vpc.vpcCidrBlock,
    });
    const sg1 = new ec2.SecurityGroup(stack, 'SG1', { vpc });
    const sg2 = new ec2.SecurityGroup(stack, 'SG2', { vpc });
    const sg3 = new ec2.SecurityGroup(stack, 'SG3', { vpc });

    // WHEN
    new VpcLink(stack, 'VpcLink', {
      vpc,
      subnets: { subnets: [subnet1, subnet2] },
      securityGroups: [sg1, sg2, sg3],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::VpcLink', {
      Name: 'VpcLink',
      SubnetIds: [
        {
          Ref: 'subnet1Subnet16A4B3BD',
        },
        {
          Ref: 'subnet2SubnetF9569CD3',
        },
      ],
      SecurityGroupIds: [
        {
          'Fn::GetAtt': [
            'SG1BA065B6E',
            'GroupId',
          ],
        },
        {
          'Fn::GetAtt': [
            'SG20CE3219C',
            'GroupId',
          ],
        },
        {
          'Fn::GetAtt': [
            'SG351782A25',
            'GroupId',
          ],
        },
      ],
    });
  });

  test('subnets can be added using addSubnets', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const subnet = new ec2.Subnet(stack, 'subnet', {
      vpcId: vpc.vpcId,
      availabilityZone: vpc.availabilityZones[0],
      cidrBlock: vpc.vpcCidrBlock,
    });

    // WHEN
    const vpcLink = new VpcLink(stack, 'VpcLink', { vpc });
    vpcLink.addSubnets(subnet);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::VpcLink', {
      Name: 'VpcLink',
      SubnetIds: [
        {
          Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
        },
        {
          Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
        },
        {
          Ref: 'subnetSubnet39D20FD5',
        },
      ],
    });
  });

  test('security groups can be added using addSecurityGroups', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const sg1 = new ec2.SecurityGroup(stack, 'SG1', { vpc });
    const sg2 = new ec2.SecurityGroup(stack, 'SG2', { vpc });
    const sg3 = new ec2.SecurityGroup(stack, 'SG3', { vpc });


    // WHEN
    const vpcLink = new VpcLink(stack, 'VpcLink', {
      vpc,
    });
    vpcLink.addSecurityGroups(sg1, sg2, sg3);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::VpcLink', {
      Name: 'VpcLink',
      SubnetIds: [
        {
          Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
        },
        {
          Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
        },
      ],
      SecurityGroupIds: [
        {
          'Fn::GetAtt': [
            'SG1BA065B6E',
            'GroupId',
          ],
        },
        {
          'Fn::GetAtt': [
            'SG20CE3219C',
            'GroupId',
          ],
        },
        {
          'Fn::GetAtt': [
            'SG351782A25',
            'GroupId',
          ],
        },
      ],
    });
  });

  test('importing an existing vpc link', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    VpcLink.fromVpcLinkAttributes(stack, 'ImportedVpcLink', {
      vpcLinkId: 'vpclink-id',
      vpc: ec2.Vpc.fromVpcAttributes(stack, 'ImportedVpc', {
        vpcId: 'vpc-12345',
        availabilityZones: ['us-east-1'],
      }),
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::ApiGatewayV2::VpcLink', 0);
  });
});
