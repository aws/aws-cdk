import { Match, Template } from '@aws-cdk/assertions';
import { AnyPrincipal, PolicyStatement } from '@aws-cdk/aws-iam';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { ContextProvider, Fn, Stack } from '@aws-cdk/core';
// eslint-disable-next-line max-len
import { GatewayVpcEndpoint, GatewayVpcEndpointAwsService, InterfaceVpcEndpoint, InterfaceVpcEndpointAwsService, InterfaceVpcEndpointService, SecurityGroup, SubnetFilter, SubnetType, Vpc } from '../lib';

describe('vpc endpoint', () => {
  describe('gateway endpoint', () => {
    test('add an endpoint to a vpc', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      new Vpc(stack, 'VpcNetwork', {
        gatewayEndpoints: {
          S3: {
            service: GatewayVpcEndpointAwsService.S3,
          },
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
        ServiceName: {
          'Fn::Join': [
            '',
            [
              'com.amazonaws.',
              {
                Ref: 'AWS::Region',
              },
              '.s3',
            ],
          ],
        },
        VpcId: {
          Ref: 'VpcNetworkB258E83A',
        },
        RouteTableIds: [
          { Ref: 'VpcNetworkPrivateSubnet1RouteTableCD085FF1' },
          { Ref: 'VpcNetworkPrivateSubnet2RouteTableE97B328B' },
          { Ref: 'VpcNetworkPublicSubnet1RouteTable25CCC53F' },
          { Ref: 'VpcNetworkPublicSubnet2RouteTableE5F348DF' },
        ],
        VpcEndpointType: 'Gateway',
      });


    });

    test('routing on private and public subnets', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      new Vpc(stack, 'VpcNetwork', {
        gatewayEndpoints: {
          S3: {
            service: GatewayVpcEndpointAwsService.S3,
            subnets: [
              {
                subnetType: SubnetType.PUBLIC,
              },
              {
                subnetType: SubnetType.PRIVATE_WITH_NAT,
              },
            ],
          },
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
        ServiceName: {
          'Fn::Join': [
            '',
            [
              'com.amazonaws.',
              {
                Ref: 'AWS::Region',
              },
              '.s3',
            ],
          ],
        },
        VpcId: {
          Ref: 'VpcNetworkB258E83A',
        },
        RouteTableIds: [
          {
            Ref: 'VpcNetworkPublicSubnet1RouteTable25CCC53F',
          },
          {
            Ref: 'VpcNetworkPublicSubnet2RouteTableE5F348DF',
          },
          {
            Ref: 'VpcNetworkPrivateSubnet1RouteTableCD085FF1',
          },
          {
            Ref: 'VpcNetworkPrivateSubnet2RouteTableE97B328B',
          },
        ],
        VpcEndpointType: 'Gateway',
      });


    });

    test('add statements to policy', () => {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VpcNetwork');
      const endpoint = vpc.addGatewayEndpoint('S3', {
        service: GatewayVpcEndpointAwsService.S3,
      });

      // WHEN
      endpoint.addToPolicy(new PolicyStatement({
        principals: [new AnyPrincipal()],
        actions: ['s3:GetObject', 's3:ListBucket'],
        resources: ['*'],
      }));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
        PolicyDocument: {
          Statement: [
            {
              Action: [
                's3:GetObject',
                's3:ListBucket',
              ],
              Effect: 'Allow',
              Principal: { AWS: '*' },
              Resource: '*',
            },
          ],
          Version: '2012-10-17',
        },
      });


    });

    test('throws when adding a statement without a principal', () => {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VpcNetwork');
      const endpoint = vpc.addGatewayEndpoint('S3', {
        service: GatewayVpcEndpointAwsService.S3,
      });

      // THEN
      expect(() => endpoint.addToPolicy(new PolicyStatement({
        actions: ['s3:GetObject', 's3:ListBucket'],
        resources: ['*'],
      }))).toThrow(/`Principal`/);


    });

    test('import/export', () => {
      // GIVEN
      const stack2 = new Stack();

      // WHEN
      const ep = GatewayVpcEndpoint.fromGatewayVpcEndpointId(stack2, 'ImportedEndpoint', 'endpoint-id');

      // THEN
      expect(ep.vpcEndpointId).toEqual('endpoint-id');

    });

    test('works with an imported vpc', () => {
      // GIVEN
      const stack = new Stack();
      const vpc = Vpc.fromVpcAttributes(stack, 'VPC', {
        vpcId: 'id',
        privateSubnetIds: ['1', '2', '3'],
        privateSubnetRouteTableIds: ['rt1', 'rt2', 'rt3'],
        availabilityZones: ['a', 'b', 'c'],
      });

      // THEN
      vpc.addGatewayEndpoint('Gateway', { service: GatewayVpcEndpointAwsService.S3 });

      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
        ServiceName: { 'Fn::Join': ['', ['com.amazonaws.', { Ref: 'AWS::Region' }, '.s3']] },
        VpcId: 'id',
        RouteTableIds: ['rt1', 'rt2', 'rt3'],
        VpcEndpointType: 'Gateway',
      });


    });

    test('throws with an imported vpc without route tables ids', () => {
      // GIVEN
      const stack = new Stack();
      const vpc = Vpc.fromVpcAttributes(stack, 'VPC', {
        vpcId: 'id',
        privateSubnetIds: ['1', '2', '3'],
        availabilityZones: ['a', 'b', 'c'],
      });

      expect(() => vpc.addGatewayEndpoint('Gateway', { service: GatewayVpcEndpointAwsService.S3 })).toThrow(/route table/);


    });
  });

  describe('interface endpoint', () => {
    test('add an endpoint to a vpc', () => {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VpcNetwork');

      // WHEN
      vpc.addInterfaceEndpoint('EcrDocker', {
        service: InterfaceVpcEndpointAwsService.ECR_DOCKER,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
        ServiceName: {
          'Fn::Join': [
            '',
            [
              'com.amazonaws.',
              {
                Ref: 'AWS::Region',
              },
              '.ecr.dkr',
            ],
          ],
        },
        VpcId: {
          Ref: 'VpcNetworkB258E83A',
        },
        PrivateDnsEnabled: true,
        SecurityGroupIds: [
          {
            'Fn::GetAtt': [
              'VpcNetworkEcrDockerSecurityGroup7C91D347',
              'GroupId',
            ],
          },
        ],
        SubnetIds: [
          {
            Ref: 'VpcNetworkPrivateSubnet1Subnet07BA143B',
          },
          {
            Ref: 'VpcNetworkPrivateSubnet2Subnet5E4189D6',
          },
        ],
        VpcEndpointType: 'Interface',
      });

      Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
        GroupDescription: 'Default/VpcNetwork/EcrDocker/SecurityGroup',
        VpcId: {
          Ref: 'VpcNetworkB258E83A',
        },
      });


    });

    describe('interface endpoint retains service name in shortName property', () => {
      test('shortName property', () => {
        expect(InterfaceVpcEndpointAwsService.ECS.shortName).toBe('ecs');
        expect(InterfaceVpcEndpointAwsService.ECR_DOCKER.shortName).toBe('ecr.dkr');
      });
    });

    describe('add interface endpoint to looked-up VPC', () => {
      test('initial run', () => {
        // GIVEN
        const stack = new Stack(undefined, undefined, { env: { account: '1234', region: 'us-east-1' } });
        const vpc = Vpc.fromLookup(stack, 'Vpc', {
          vpcId: 'doesnt-matter',
        });

        // THEN: doesn't throw
        vpc.addInterfaceEndpoint('SecretsManagerEndpoint', {
          service: InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
          subnets: {
            subnetFilters: [SubnetFilter.byIds(['1234'])],
          },
        });
      });
    });


    test('import/export', () => {
      // GIVEN
      const stack2 = new Stack();

      // WHEN
      const importedEndpoint = InterfaceVpcEndpoint.fromInterfaceVpcEndpointAttributes(stack2, 'ImportedEndpoint', {
        securityGroups: [SecurityGroup.fromSecurityGroupId(stack2, 'SG', 'security-group-id')],
        vpcEndpointId: 'vpc-endpoint-id',
        port: 80,
      });
      importedEndpoint.connections.allowDefaultPortFromAnyIpv4();

      // THEN
      Template.fromStack(stack2).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
        GroupId: 'security-group-id',
      });
      expect(importedEndpoint.vpcEndpointId).toEqual('vpc-endpoint-id');


    });

    test('import/export without security group', () => {
      // GIVEN
      const stack2 = new Stack();

      // WHEN
      const importedEndpoint = InterfaceVpcEndpoint.fromInterfaceVpcEndpointAttributes(stack2, 'ImportedEndpoint', {
        vpcEndpointId: 'vpc-endpoint-id',
        port: 80,
      });
      importedEndpoint.connections.allowDefaultPortFromAnyIpv4();

      // THEN
      expect(importedEndpoint.vpcEndpointId).toEqual('vpc-endpoint-id');
      expect(importedEndpoint.connections.securityGroups.length).toEqual(0);


    });

    test('with existing security groups', () => {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VpcNetwork');

      // WHEN
      vpc.addInterfaceEndpoint('EcrDocker', {
        service: InterfaceVpcEndpointAwsService.ECR_DOCKER,
        securityGroups: [SecurityGroup.fromSecurityGroupId(stack, 'SG', 'existing-id')],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
        SecurityGroupIds: ['existing-id'],
      });


    });
    test('with existing security groups for efs', () => {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VpcNetwork');

      // WHEN
      vpc.addInterfaceEndpoint('Efs', {
        service: InterfaceVpcEndpointAwsService.ELASTIC_FILESYSTEM,
        securityGroups: [SecurityGroup.fromSecurityGroupId(stack, 'SG', 'existing-id')],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
        SecurityGroupIds: ['existing-id'],
      });


    });
    test('security group has ingress by default', () => {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VpcNetwork');

      // WHEN
      vpc.addInterfaceEndpoint('SecretsManagerEndpoint', {
        service: InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
        SecurityGroupIngress: [
          Match.objectLike({
            CidrIp: { 'Fn::GetAtt': ['VpcNetworkB258E83A', 'CidrBlock'] },
            FromPort: 443,
            IpProtocol: 'tcp',
            ToPort: 443,
          }),
        ],
      });


    });
    test('non-AWS service interface endpoint', () => {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VpcNetwork');

      // WHEN
      vpc.addInterfaceEndpoint('YourService', {
        service: new InterfaceVpcEndpointService('com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc', 443),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
        ServiceName: 'com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc',
        PrivateDnsEnabled: false,
      });


    });
    test('marketplace partner service interface endpoint', () => {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VpcNetwork');

      // WHEN
      vpc.addInterfaceEndpoint('YourService', {
        service: {
          name: 'com.amazonaws.vpce.us-east-1.vpce-svc-mktplacesvcwprdns',
          port: 443,
          privateDnsDefault: true,
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
        ServiceName: 'com.amazonaws.vpce.us-east-1.vpce-svc-mktplacesvcwprdns',
        PrivateDnsEnabled: true,
      });


    });
    test('test endpoint service context azs discovered', () => {
      // GIVEN
      const stack = new Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-east-1' } });

      // Setup context for stack AZs
      stack.node.setContext(
        ContextProvider.getKey(stack, {
          provider: cxschema.ContextProvider.AVAILABILITY_ZONE_PROVIDER,
        }).key,
        ['us-east-1a', 'us-east-1b', 'us-east-1c']);
      // Setup context for endpoint service AZs
      stack.node.setContext(
        ContextProvider.getKey(stack, {
          provider: cxschema.ContextProvider.ENDPOINT_SERVICE_AVAILABILITY_ZONE_PROVIDER,
          props: {
            serviceName: 'com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc',
          },
        }).key,
        ['us-east-1a', 'us-east-1c']);

      const vpc = new Vpc(stack, 'VPC');

      // WHEN
      vpc.addInterfaceEndpoint('YourService', {
        service: {
          name: 'com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc',
          port: 443,
        },
        lookupSupportedAzs: true,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
        ServiceName: 'com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc',
        SubnetIds: [
          {
            Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
          },
          {
            Ref: 'VPCPrivateSubnet3Subnet3EDCD457',
          },
        ],
      });


    });
    test('endpoint service setup with stack AZ context but no endpoint context', () => {
      // GIVEN
      const stack = new Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-east-1' } });

      // Setup context for stack AZs
      stack.node.setContext(
        ContextProvider.getKey(stack, {
          provider: cxschema.ContextProvider.AVAILABILITY_ZONE_PROVIDER,
        }).key,
        ['us-east-1a', 'us-east-1b', 'us-east-1c']);

      const vpc = new Vpc(stack, 'VPC');

      // WHEN
      vpc.addInterfaceEndpoint('YourService', {
        service: {
          name: 'com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc',
          port: 443,
        },
        lookupSupportedAzs: true,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
        ServiceName: 'com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc',
        SubnetIds: [
          {
            Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
          },
          {
            Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
          },
          {
            Ref: 'VPCPrivateSubnet3Subnet3EDCD457',
          },
        ],
      });


    });
    test('test endpoint service context with aws service', () => {
      // GIVEN
      const stack = new Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-east-1' } });

      // Setup context for stack AZs
      stack.node.setContext(
        ContextProvider.getKey(stack, {
          provider: cxschema.ContextProvider.AVAILABILITY_ZONE_PROVIDER,
        }).key,
        ['us-east-1a', 'us-east-1b', 'us-east-1c']);
      // Setup context for endpoint service AZs
      stack.node.setContext(
        ContextProvider.getKey(stack, {
          provider: cxschema.ContextProvider.ENDPOINT_SERVICE_AVAILABILITY_ZONE_PROVIDER,
          props: {
            serviceName: 'com.amazonaws.us-east-1.execute-api',
          },
        }).key,
        ['us-east-1a', 'us-east-1c']);

      const vpc = new Vpc(stack, 'VPC');

      // WHEN
      vpc.addInterfaceEndpoint('API Gateway', {
        service: InterfaceVpcEndpointAwsService.APIGATEWAY,
        lookupSupportedAzs: true,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
        ServiceName: 'com.amazonaws.us-east-1.execute-api',
        SubnetIds: [
          {
            Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
          },
          {
            Ref: 'VPCPrivateSubnet3Subnet3EDCD457',
          },
        ],
      });


    });
    test('lookupSupportedAzs fails if account is unresolved', () => {
      // GIVEN
      const stack = new Stack(undefined, 'TestStack', { env: { region: 'us-east-1' } });
      const vpc = new Vpc(stack, 'VPC');
      // WHEN
      expect(() =>vpc.addInterfaceEndpoint('YourService', {
        service: {
          name: 'com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc',
          port: 443,
        },
        lookupSupportedAzs: true,
      })).toThrow();

    });
    test('lookupSupportedAzs fails if region is unresolved', () => {
      // GIVEN
      const stack = new Stack(undefined, 'TestStack', { env: { account: '123456789012' } });
      const vpc = new Vpc(stack, 'VPC');
      // WHEN
      expect(() =>vpc.addInterfaceEndpoint('YourService', {
        service: {
          name: 'com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc',
          port: 443,
        },
        lookupSupportedAzs: true,
      })).toThrow();

    });
    test('lookupSupportedAzs fails if subnet AZs are tokens', () => {
      // GIVEN
      const stack = new Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-east-1' } });
      const tokenAZs = [
        'us-east-1a',
        Fn.select(1, Fn.getAzs()),
        Fn.select(2, Fn.getAzs()),
      ];
      // Setup context for stack AZs
      stack.node.setContext(
        ContextProvider.getKey(stack, {
          provider: cxschema.ContextProvider.AVAILABILITY_ZONE_PROVIDER,
        }).key,
        tokenAZs);
      const vpc = new Vpc(stack, 'VPC');

      // WHEN
      expect(() =>vpc.addInterfaceEndpoint('YourService', {
        service: {
          name: 'com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc',
          port: 443,
        },
        lookupSupportedAzs: true,
      })).toThrow();

    });
    test('vpc endpoint fails if no subnets provided', () => {
      // GIVEN
      const stack = new Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-east-1' } });
      const vpc = new Vpc(stack, 'VPC');
      // WHEN
      expect(() =>vpc.addInterfaceEndpoint('YourService', {
        service: {
          name: 'com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc',
          port: 443,
        },
        subnets: vpc.selectSubnets({
          subnets: [],
        }),
      })).toThrow();

    });
    test('test vpc interface endpoint with cn.com.amazonaws prefix can be created correctly in cn-north-1', () => {
      //GIVEN
      const stack = new Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'cn-north-1' } });
      const vpc = new Vpc(stack, 'VPC');

      //WHEN
      vpc.addInterfaceEndpoint('ECR Endpoint', {
        service: InterfaceVpcEndpointAwsService.ECR,
      });

      //THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
        ServiceName: 'cn.com.amazonaws.cn-north-1.ecr.api',
      });


    });
    test('test vpc interface endpoint with cn.com.amazonaws prefix can be created correctly in cn-northwest-1', () => {
      //GIVEN
      const stack = new Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'cn-northwest-1' } });
      const vpc = new Vpc(stack, 'VPC');

      //WHEN
      vpc.addInterfaceEndpoint('Lambda Endpoint', {
        service: InterfaceVpcEndpointAwsService.LAMBDA,
      });

      //THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
        ServiceName: 'cn.com.amazonaws.cn-northwest-1.lambda',
      });


    });
    test('test vpc interface endpoint without cn.com.amazonaws prefix can be created correctly in cn-north-1', () => {
      //GIVEN
      const stack = new Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'cn-north-1' } });
      const vpc = new Vpc(stack, 'VPC');

      //WHEN
      vpc.addInterfaceEndpoint('ECS Endpoint', {
        service: InterfaceVpcEndpointAwsService.ECS,
      });

      //THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
        ServiceName: 'com.amazonaws.cn-north-1.ecs',
      });


    });
    test('test vpc interface endpoint without cn.com.amazonaws prefix can be created correctly in cn-northwest-1', () => {
      //GIVEN
      const stack = new Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'cn-northwest-1' } });
      const vpc = new Vpc(stack, 'VPC');

      //WHEN
      vpc.addInterfaceEndpoint('Glue Endpoint', {
        service: InterfaceVpcEndpointAwsService.GLUE,
      });

      //THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
        ServiceName: 'com.amazonaws.cn-northwest-1.glue',
      });


    });
    test('test vpc interface endpoint for transcribe can be created correctly in non-china regions', () => {
      //GIVEN
      const stack = new Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-east-1' } });
      const vpc = new Vpc(stack, 'VPC');

      //WHEN
      vpc.addInterfaceEndpoint('Transcribe Endpoint', {
        service: InterfaceVpcEndpointAwsService.TRANSCRIBE,
      });

      //THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
        ServiceName: 'com.amazonaws.us-east-1.transcribe',
      });


    });
    test('test vpc interface endpoint for transcribe can be created correctly in cn-north-1', () => {
      //GIVEN
      const stack = new Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'cn-north-1' } });
      const vpc = new Vpc(stack, 'VPC');

      //WHEN
      vpc.addInterfaceEndpoint('Transcribe Endpoint', {
        service: InterfaceVpcEndpointAwsService.TRANSCRIBE,
      });

      //THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
        ServiceName: 'cn.com.amazonaws.cn-north-1.transcribe.cn',
      });


    });
    test('test vpc interface endpoint for transcribe can be created correctly in cn-northwest-1', () => {
      //GIVEN
      const stack = new Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'cn-northwest-1' } });
      const vpc = new Vpc(stack, 'VPC');

      //WHEN
      vpc.addInterfaceEndpoint('Transcribe Endpoint', {
        service: InterfaceVpcEndpointAwsService.TRANSCRIBE,
      });

      //THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
        ServiceName: 'cn.com.amazonaws.cn-northwest-1.transcribe.cn',
      });


    });
  });
});
