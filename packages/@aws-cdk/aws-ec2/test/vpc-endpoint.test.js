"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const cxschema = require("@aws-cdk/cloud-assembly-schema");
const core_1 = require("@aws-cdk/core");
// eslint-disable-next-line max-len
const lib_1 = require("../lib");
describe('vpc endpoint', () => {
    describe('gateway endpoint', () => {
        test('add an endpoint to a vpc', () => {
            // GIVEN
            const stack = new core_1.Stack();
            // WHEN
            new lib_1.Vpc(stack, 'VpcNetwork', {
                gatewayEndpoints: {
                    S3: {
                        service: lib_1.GatewayVpcEndpointAwsService.S3,
                    },
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
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
            const stack = new core_1.Stack();
            // WHEN
            new lib_1.Vpc(stack, 'VpcNetwork', {
                gatewayEndpoints: {
                    S3: {
                        service: lib_1.GatewayVpcEndpointAwsService.S3,
                        subnets: [
                            {
                                subnetType: lib_1.SubnetType.PUBLIC,
                            },
                            {
                                subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS,
                            },
                        ],
                    },
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
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
            const stack = new core_1.Stack();
            const vpc = new lib_1.Vpc(stack, 'VpcNetwork');
            const endpoint = vpc.addGatewayEndpoint('S3', {
                service: lib_1.GatewayVpcEndpointAwsService.S3,
            });
            // WHEN
            endpoint.addToPolicy(new aws_iam_1.PolicyStatement({
                principals: [new aws_iam_1.AnyPrincipal()],
                actions: ['s3:GetObject', 's3:ListBucket'],
                resources: ['*'],
            }));
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
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
            const stack = new core_1.Stack();
            const vpc = new lib_1.Vpc(stack, 'VpcNetwork');
            const endpoint = vpc.addGatewayEndpoint('S3', {
                service: lib_1.GatewayVpcEndpointAwsService.S3,
            });
            // THEN
            expect(() => endpoint.addToPolicy(new aws_iam_1.PolicyStatement({
                actions: ['s3:GetObject', 's3:ListBucket'],
                resources: ['*'],
            }))).toThrow(/`Principal`/);
        });
        test('import/export', () => {
            // GIVEN
            const stack2 = new core_1.Stack();
            // WHEN
            const ep = lib_1.GatewayVpcEndpoint.fromGatewayVpcEndpointId(stack2, 'ImportedEndpoint', 'endpoint-id');
            // THEN
            expect(ep.vpcEndpointId).toEqual('endpoint-id');
        });
        test('works with an imported vpc', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = lib_1.Vpc.fromVpcAttributes(stack, 'VPC', {
                vpcId: 'id',
                privateSubnetIds: ['1', '2', '3'],
                privateSubnetRouteTableIds: ['rt1', 'rt2', 'rt3'],
                availabilityZones: ['a', 'b', 'c'],
            });
            // THEN
            vpc.addGatewayEndpoint('Gateway', { service: lib_1.GatewayVpcEndpointAwsService.S3 });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
                ServiceName: { 'Fn::Join': ['', ['com.amazonaws.', { Ref: 'AWS::Region' }, '.s3']] },
                VpcId: 'id',
                RouteTableIds: ['rt1', 'rt2', 'rt3'],
                VpcEndpointType: 'Gateway',
            });
        });
        test('throws with an imported vpc without route tables ids', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = lib_1.Vpc.fromVpcAttributes(stack, 'VPC', {
                vpcId: 'id',
                privateSubnetIds: ['1', '2', '3'],
                availabilityZones: ['a', 'b', 'c'],
            });
            expect(() => vpc.addGatewayEndpoint('Gateway', { service: lib_1.GatewayVpcEndpointAwsService.S3 })).toThrow(/route table/);
        });
    });
    describe('interface endpoint', () => {
        test('add an endpoint to a vpc', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new lib_1.Vpc(stack, 'VpcNetwork');
            // WHEN
            vpc.addInterfaceEndpoint('EcrDocker', {
                service: lib_1.InterfaceVpcEndpointAwsService.ECR_DOCKER,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
                GroupDescription: 'Default/VpcNetwork/EcrDocker/SecurityGroup',
                VpcId: {
                    Ref: 'VpcNetworkB258E83A',
                },
            });
        });
        describe('interface endpoint retains service name in shortName property', () => {
            test('shortName property', () => {
                expect(lib_1.InterfaceVpcEndpointAwsService.ECS.shortName).toBe('ecs');
                expect(lib_1.InterfaceVpcEndpointAwsService.ECR_DOCKER.shortName).toBe('ecr.dkr');
            });
        });
        describe('add interface endpoint to looked-up VPC', () => {
            test('initial run', () => {
                // GIVEN
                const stack = new core_1.Stack(undefined, undefined, { env: { account: '1234', region: 'us-east-1' } });
                const vpc = lib_1.Vpc.fromLookup(stack, 'Vpc', {
                    vpcId: 'doesnt-matter',
                });
                // THEN: doesn't throw
                vpc.addInterfaceEndpoint('SecretsManagerEndpoint', {
                    service: lib_1.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
                    subnets: {
                        subnetFilters: [lib_1.SubnetFilter.byIds(['1234'])],
                    },
                });
            });
        });
        test('import/export', () => {
            // GIVEN
            const stack2 = new core_1.Stack();
            // WHEN
            const importedEndpoint = lib_1.InterfaceVpcEndpoint.fromInterfaceVpcEndpointAttributes(stack2, 'ImportedEndpoint', {
                securityGroups: [lib_1.SecurityGroup.fromSecurityGroupId(stack2, 'SG', 'security-group-id')],
                vpcEndpointId: 'vpc-endpoint-id',
                port: 80,
            });
            importedEndpoint.connections.allowDefaultPortFromAnyIpv4();
            // THEN
            assertions_1.Template.fromStack(stack2).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
                GroupId: 'security-group-id',
            });
            expect(importedEndpoint.vpcEndpointId).toEqual('vpc-endpoint-id');
        });
        test('import/export without security group', () => {
            // GIVEN
            const stack2 = new core_1.Stack();
            // WHEN
            const importedEndpoint = lib_1.InterfaceVpcEndpoint.fromInterfaceVpcEndpointAttributes(stack2, 'ImportedEndpoint', {
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
            const stack = new core_1.Stack();
            const vpc = new lib_1.Vpc(stack, 'VpcNetwork');
            // WHEN
            vpc.addInterfaceEndpoint('EcrDocker', {
                service: lib_1.InterfaceVpcEndpointAwsService.ECR_DOCKER,
                securityGroups: [lib_1.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'existing-id')],
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
                SecurityGroupIds: ['existing-id'],
            });
        });
        test('with existing security groups for efs', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new lib_1.Vpc(stack, 'VpcNetwork');
            // WHEN
            vpc.addInterfaceEndpoint('Efs', {
                service: lib_1.InterfaceVpcEndpointAwsService.ELASTIC_FILESYSTEM,
                securityGroups: [lib_1.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'existing-id')],
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
                SecurityGroupIds: ['existing-id'],
            });
        });
        test('security group has ingress by default', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new lib_1.Vpc(stack, 'VpcNetwork');
            // WHEN
            vpc.addInterfaceEndpoint('SecretsManagerEndpoint', {
                service: lib_1.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
                SecurityGroupIngress: [
                    assertions_1.Match.objectLike({
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
            const stack = new core_1.Stack();
            const vpc = new lib_1.Vpc(stack, 'VpcNetwork');
            // WHEN
            vpc.addInterfaceEndpoint('YourService', {
                service: new lib_1.InterfaceVpcEndpointService('com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc', 443),
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
                ServiceName: 'com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc',
                PrivateDnsEnabled: false,
            });
        });
        test('marketplace partner service interface endpoint', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new lib_1.Vpc(stack, 'VpcNetwork');
            // WHEN
            vpc.addInterfaceEndpoint('YourService', {
                service: {
                    name: 'com.amazonaws.vpce.us-east-1.vpce-svc-mktplacesvcwprdns',
                    port: 443,
                    privateDnsDefault: true,
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
                ServiceName: 'com.amazonaws.vpce.us-east-1.vpce-svc-mktplacesvcwprdns',
                PrivateDnsEnabled: true,
            });
        });
        test('test endpoint service context azs discovered', () => {
            // GIVEN
            const stack = new core_1.Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-east-1' } });
            // Setup context for stack AZs
            stack.node.setContext(core_1.ContextProvider.getKey(stack, {
                provider: cxschema.ContextProvider.AVAILABILITY_ZONE_PROVIDER,
            }).key, ['us-east-1a', 'us-east-1b', 'us-east-1c']);
            // Setup context for endpoint service AZs
            stack.node.setContext(core_1.ContextProvider.getKey(stack, {
                provider: cxschema.ContextProvider.ENDPOINT_SERVICE_AVAILABILITY_ZONE_PROVIDER,
                props: {
                    serviceName: 'com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc',
                },
            }).key, ['us-east-1a', 'us-east-1c']);
            const vpc = new lib_1.Vpc(stack, 'VPC');
            // WHEN
            vpc.addInterfaceEndpoint('YourService', {
                service: {
                    name: 'com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc',
                    port: 443,
                },
                lookupSupportedAzs: true,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
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
            const stack = new core_1.Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-east-1' } });
            // Setup context for stack AZs
            stack.node.setContext(core_1.ContextProvider.getKey(stack, {
                provider: cxschema.ContextProvider.AVAILABILITY_ZONE_PROVIDER,
            }).key, ['us-east-1a', 'us-east-1b', 'us-east-1c']);
            const vpc = new lib_1.Vpc(stack, 'VPC');
            // WHEN
            vpc.addInterfaceEndpoint('YourService', {
                service: {
                    name: 'com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc',
                    port: 443,
                },
                lookupSupportedAzs: true,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
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
            const stack = new core_1.Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-east-1' } });
            // Setup context for stack AZs
            stack.node.setContext(core_1.ContextProvider.getKey(stack, {
                provider: cxschema.ContextProvider.AVAILABILITY_ZONE_PROVIDER,
            }).key, ['us-east-1a', 'us-east-1b', 'us-east-1c']);
            // Setup context for endpoint service AZs
            stack.node.setContext(core_1.ContextProvider.getKey(stack, {
                provider: cxschema.ContextProvider.ENDPOINT_SERVICE_AVAILABILITY_ZONE_PROVIDER,
                props: {
                    serviceName: 'com.amazonaws.us-east-1.execute-api',
                },
            }).key, ['us-east-1a', 'us-east-1c']);
            const vpc = new lib_1.Vpc(stack, 'VPC');
            // WHEN
            vpc.addInterfaceEndpoint('API Gateway', {
                service: lib_1.InterfaceVpcEndpointAwsService.APIGATEWAY,
                lookupSupportedAzs: true,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
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
            const stack = new core_1.Stack(undefined, 'TestStack', { env: { region: 'us-east-1' } });
            const vpc = new lib_1.Vpc(stack, 'VPC');
            // WHEN
            expect(() => vpc.addInterfaceEndpoint('YourService', {
                service: {
                    name: 'com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc',
                    port: 443,
                },
                lookupSupportedAzs: true,
            })).toThrow();
        });
        test('lookupSupportedAzs fails if region is unresolved', () => {
            // GIVEN
            const stack = new core_1.Stack(undefined, 'TestStack', { env: { account: '123456789012' } });
            const vpc = new lib_1.Vpc(stack, 'VPC');
            // WHEN
            expect(() => vpc.addInterfaceEndpoint('YourService', {
                service: {
                    name: 'com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc',
                    port: 443,
                },
                lookupSupportedAzs: true,
            })).toThrow();
        });
        test('lookupSupportedAzs fails if subnet AZs are tokens', () => {
            // GIVEN
            const stack = new core_1.Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-east-1' } });
            const tokenAZs = [
                'us-east-1a',
                core_1.Fn.select(1, core_1.Fn.getAzs()),
                core_1.Fn.select(2, core_1.Fn.getAzs()),
            ];
            // Setup context for stack AZs
            stack.node.setContext(core_1.ContextProvider.getKey(stack, {
                provider: cxschema.ContextProvider.AVAILABILITY_ZONE_PROVIDER,
            }).key, tokenAZs);
            const vpc = new lib_1.Vpc(stack, 'VPC');
            // WHEN
            expect(() => vpc.addInterfaceEndpoint('YourService', {
                service: {
                    name: 'com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc',
                    port: 443,
                },
                lookupSupportedAzs: true,
            })).toThrow();
        });
        test('vpc endpoint fails if no subnets provided', () => {
            // GIVEN
            const stack = new core_1.Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-east-1' } });
            const vpc = new lib_1.Vpc(stack, 'VPC');
            // WHEN
            expect(() => vpc.addInterfaceEndpoint('YourService', {
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
            const stack = new core_1.Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'cn-north-1' } });
            const vpc = new lib_1.Vpc(stack, 'VPC');
            //WHEN
            vpc.addInterfaceEndpoint('ECR Endpoint', {
                service: lib_1.InterfaceVpcEndpointAwsService.ECR,
            });
            //THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
                ServiceName: 'cn.com.amazonaws.cn-north-1.ecr.api',
            });
        });
        test('test vpc interface endpoint with cn.com.amazonaws prefix can be created correctly in cn-northwest-1', () => {
            //GIVEN
            const stack = new core_1.Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'cn-northwest-1' } });
            const vpc = new lib_1.Vpc(stack, 'VPC');
            //WHEN
            vpc.addInterfaceEndpoint('Lambda Endpoint', {
                service: lib_1.InterfaceVpcEndpointAwsService.LAMBDA,
            });
            //THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
                ServiceName: 'cn.com.amazonaws.cn-northwest-1.lambda',
            });
        });
        test('test vpc interface endpoint without cn.com.amazonaws prefix can be created correctly in cn-north-1', () => {
            //GIVEN
            const stack = new core_1.Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'cn-north-1' } });
            const vpc = new lib_1.Vpc(stack, 'VPC');
            //WHEN
            vpc.addInterfaceEndpoint('ECS Endpoint', {
                service: lib_1.InterfaceVpcEndpointAwsService.ECS,
            });
            //THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
                ServiceName: 'com.amazonaws.cn-north-1.ecs',
            });
        });
        test('test vpc interface endpoint without cn.com.amazonaws prefix can be created correctly in cn-northwest-1', () => {
            //GIVEN
            const stack = new core_1.Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'cn-northwest-1' } });
            const vpc = new lib_1.Vpc(stack, 'VPC');
            //WHEN
            vpc.addInterfaceEndpoint('Glue Endpoint', {
                service: lib_1.InterfaceVpcEndpointAwsService.GLUE,
            });
            //THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
                ServiceName: 'com.amazonaws.cn-northwest-1.glue',
            });
        });
        test('test vpc interface endpoint for transcribe can be created correctly in non-china regions', () => {
            //GIVEN
            const stack = new core_1.Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-east-1' } });
            const vpc = new lib_1.Vpc(stack, 'VPC');
            //WHEN
            vpc.addInterfaceEndpoint('Transcribe Endpoint', {
                service: lib_1.InterfaceVpcEndpointAwsService.TRANSCRIBE,
            });
            //THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
                ServiceName: 'com.amazonaws.us-east-1.transcribe',
            });
        });
        test('test vpc interface endpoint for transcribe can be created correctly in cn-north-1', () => {
            //GIVEN
            const stack = new core_1.Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'cn-north-1' } });
            const vpc = new lib_1.Vpc(stack, 'VPC');
            //WHEN
            vpc.addInterfaceEndpoint('Transcribe Endpoint', {
                service: lib_1.InterfaceVpcEndpointAwsService.TRANSCRIBE,
            });
            //THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
                ServiceName: 'cn.com.amazonaws.cn-north-1.transcribe.cn',
            });
        });
        test('test vpc interface endpoint for transcribe can be created correctly in cn-northwest-1', () => {
            //GIVEN
            const stack = new core_1.Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'cn-northwest-1' } });
            const vpc = new lib_1.Vpc(stack, 'VPC');
            //WHEN
            vpc.addInterfaceEndpoint('Transcribe Endpoint', {
                service: lib_1.InterfaceVpcEndpointAwsService.TRANSCRIBE,
            });
            //THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
                ServiceName: 'cn.com.amazonaws.cn-northwest-1.transcribe.cn',
            });
        });
        test('test codeartifact vpc interface endpoint in us-west-2', () => {
            //GIVEN
            const stack = new core_1.Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-west-2' } });
            const vpc = new lib_1.Vpc(stack, 'VPC');
            //WHEN
            vpc.addInterfaceEndpoint('CodeArtifact API Endpoint', {
                service: lib_1.InterfaceVpcEndpointAwsService.CODEARTIFACT_API,
            });
            vpc.addInterfaceEndpoint('CodeArtifact Repositories Endpoint', {
                service: lib_1.InterfaceVpcEndpointAwsService.CODEARTIFACT_REPOSITORIES,
            });
            //THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
                ServiceName: 'com.amazonaws.us-west-2.codeartifact.repositories',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
                ServiceName: 'com.amazonaws.us-west-2.codeartifact.api',
            });
        });
        test('test s3 vpc interface endpoint in us-west-2', () => {
            //GIVEN
            const stack = new core_1.Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-west-2' } });
            const vpc = new lib_1.Vpc(stack, 'VPC');
            //WHEN
            vpc.addInterfaceEndpoint('CodeArtifact API Endpoint', {
                service: lib_1.InterfaceVpcEndpointAwsService.S3,
            });
            //THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
                ServiceName: 'com.amazonaws.us-west-2.s3',
            });
        });
        test('test batch vpc interface endpoint in us-west-2', () => {
            //GIVEN
            const stack = new core_1.Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-west-2' } });
            const vpc = new lib_1.Vpc(stack, 'VPC');
            //WHEN
            vpc.addInterfaceEndpoint('CodeArtifact API Endpoint', {
                service: lib_1.InterfaceVpcEndpointAwsService.BATCH,
            });
            //THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
                ServiceName: 'com.amazonaws.us-west-2.batch',
            });
        });
        test('test autoscaling vpc interface endpoint in us-west-2', () => {
            //GIVEN
            const stack = new core_1.Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-west-2' } });
            const vpc = new lib_1.Vpc(stack, 'VPC');
            //WHEN
            vpc.addInterfaceEndpoint('Autoscaling API Endpoint', {
                service: lib_1.InterfaceVpcEndpointAwsService.AUTOSCALING,
            });
            vpc.addInterfaceEndpoint('Autoscaling-plan API Endpoint', {
                service: lib_1.InterfaceVpcEndpointAwsService.AUTOSCALING_PLANS,
            });
            vpc.addInterfaceEndpoint('Application-Autoscaling API Endpoint', {
                service: lib_1.InterfaceVpcEndpointAwsService.APPLICATION_AUTOSCALING,
            });
            //THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
                ServiceName: 'com.amazonaws.us-west-2.autoscaling',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
                ServiceName: 'com.amazonaws.us-west-2.autoscaling-plans',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
                ServiceName: 'com.amazonaws.us-west-2.application-autoscaling',
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnBjLWVuZHBvaW50LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2cGMtZW5kcG9pbnQudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFzRDtBQUN0RCw4Q0FBaUU7QUFDakUsMkRBQTJEO0FBQzNELHdDQUEyRDtBQUMzRCxtQ0FBbUM7QUFDbkMsZ0NBQTJNO0FBRTNNLFFBQVEsQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFO0lBQzVCLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7UUFDaEMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtZQUNwQyxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUUxQixPQUFPO1lBQ1AsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtnQkFDM0IsZ0JBQWdCLEVBQUU7b0JBQ2hCLEVBQUUsRUFBRTt3QkFDRixPQUFPLEVBQUUsa0NBQTRCLENBQUMsRUFBRTtxQkFDekM7aUJBQ0Y7YUFDRixDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsdUJBQXVCLEVBQUU7Z0JBQ3ZFLFdBQVcsRUFBRTtvQkFDWCxVQUFVLEVBQUU7d0JBQ1YsRUFBRTt3QkFDRjs0QkFDRSxnQkFBZ0I7NEJBQ2hCO2dDQUNFLEdBQUcsRUFBRSxhQUFhOzZCQUNuQjs0QkFDRCxLQUFLO3lCQUNOO3FCQUNGO2lCQUNGO2dCQUNELEtBQUssRUFBRTtvQkFDTCxHQUFHLEVBQUUsb0JBQW9CO2lCQUMxQjtnQkFDRCxhQUFhLEVBQUU7b0JBQ2IsRUFBRSxHQUFHLEVBQUUsNENBQTRDLEVBQUU7b0JBQ3JELEVBQUUsR0FBRyxFQUFFLDRDQUE0QyxFQUFFO29CQUNyRCxFQUFFLEdBQUcsRUFBRSwyQ0FBMkMsRUFBRTtvQkFDcEQsRUFBRSxHQUFHLEVBQUUsMkNBQTJDLEVBQUU7aUJBQ3JEO2dCQUNELGVBQWUsRUFBRSxTQUFTO2FBQzNCLENBQUMsQ0FBQztRQUdMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHVDQUF1QyxFQUFFLEdBQUcsRUFBRTtZQUNqRCxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUUxQixPQUFPO1lBQ1AsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtnQkFDM0IsZ0JBQWdCLEVBQUU7b0JBQ2hCLEVBQUUsRUFBRTt3QkFDRixPQUFPLEVBQUUsa0NBQTRCLENBQUMsRUFBRTt3QkFDeEMsT0FBTyxFQUFFOzRCQUNQO2dDQUNFLFVBQVUsRUFBRSxnQkFBVSxDQUFDLE1BQU07NkJBQzlCOzRCQUNEO2dDQUNFLFVBQVUsRUFBRSxnQkFBVSxDQUFDLG1CQUFtQjs2QkFDM0M7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7YUFDRixDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsdUJBQXVCLEVBQUU7Z0JBQ3ZFLFdBQVcsRUFBRTtvQkFDWCxVQUFVLEVBQUU7d0JBQ1YsRUFBRTt3QkFDRjs0QkFDRSxnQkFBZ0I7NEJBQ2hCO2dDQUNFLEdBQUcsRUFBRSxhQUFhOzZCQUNuQjs0QkFDRCxLQUFLO3lCQUNOO3FCQUNGO2lCQUNGO2dCQUNELEtBQUssRUFBRTtvQkFDTCxHQUFHLEVBQUUsb0JBQW9CO2lCQUMxQjtnQkFDRCxhQUFhLEVBQUU7b0JBQ2I7d0JBQ0UsR0FBRyxFQUFFLDJDQUEyQztxQkFDakQ7b0JBQ0Q7d0JBQ0UsR0FBRyxFQUFFLDJDQUEyQztxQkFDakQ7b0JBQ0Q7d0JBQ0UsR0FBRyxFQUFFLDRDQUE0QztxQkFDbEQ7b0JBQ0Q7d0JBQ0UsR0FBRyxFQUFFLDRDQUE0QztxQkFDbEQ7aUJBQ0Y7Z0JBQ0QsZUFBZSxFQUFFLFNBQVM7YUFDM0IsQ0FBQyxDQUFDO1FBR0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO1lBQ3BDLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBQzFCLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBRyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztZQUN6QyxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFO2dCQUM1QyxPQUFPLEVBQUUsa0NBQTRCLENBQUMsRUFBRTthQUN6QyxDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLHlCQUFlLENBQUM7Z0JBQ3ZDLFVBQVUsRUFBRSxDQUFDLElBQUksc0JBQVksRUFBRSxDQUFDO2dCQUNoQyxPQUFPLEVBQUUsQ0FBQyxjQUFjLEVBQUUsZUFBZSxDQUFDO2dCQUMxQyxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUM7YUFDakIsQ0FBQyxDQUFDLENBQUM7WUFFSixPQUFPO1lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsdUJBQXVCLEVBQUU7Z0JBQ3ZFLGNBQWMsRUFBRTtvQkFDZCxTQUFTLEVBQUU7d0JBQ1Q7NEJBQ0UsTUFBTSxFQUFFO2dDQUNOLGNBQWM7Z0NBQ2QsZUFBZTs2QkFDaEI7NEJBQ0QsTUFBTSxFQUFFLE9BQU87NEJBQ2YsU0FBUyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRTs0QkFDdkIsUUFBUSxFQUFFLEdBQUc7eUJBQ2Q7cUJBQ0Y7b0JBQ0QsT0FBTyxFQUFFLFlBQVk7aUJBQ3RCO2FBQ0YsQ0FBQyxDQUFDO1FBR0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsb0RBQW9ELEVBQUUsR0FBRyxFQUFFO1lBQzlELFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBQzFCLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBRyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztZQUN6QyxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFO2dCQUM1QyxPQUFPLEVBQUUsa0NBQTRCLENBQUMsRUFBRTthQUN6QyxDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSx5QkFBZSxDQUFDO2dCQUNwRCxPQUFPLEVBQUUsQ0FBQyxjQUFjLEVBQUUsZUFBZSxDQUFDO2dCQUMxQyxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUM7YUFDakIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7UUFHOUIsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtZQUN6QixRQUFRO1lBQ1IsTUFBTSxNQUFNLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUUzQixPQUFPO1lBQ1AsTUFBTSxFQUFFLEdBQUcsd0JBQWtCLENBQUMsd0JBQXdCLENBQUMsTUFBTSxFQUFFLGtCQUFrQixFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBRWxHLE9BQU87WUFDUCxNQUFNLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUVsRCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUU7WUFDdEMsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsTUFBTSxHQUFHLEdBQUcsU0FBRyxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLEtBQUssRUFBRSxJQUFJO2dCQUNYLGdCQUFnQixFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7Z0JBQ2pDLDBCQUEwQixFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7Z0JBQ2pELGlCQUFpQixFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7YUFDbkMsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsRUFBRSxPQUFPLEVBQUUsa0NBQTRCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUVoRixxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx1QkFBdUIsRUFBRTtnQkFDdkUsV0FBVyxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxHQUFHLEVBQUUsYUFBYSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRTtnQkFDcEYsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsYUFBYSxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7Z0JBQ3BDLGVBQWUsRUFBRSxTQUFTO2FBQzNCLENBQUMsQ0FBQztRQUdMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHNEQUFzRCxFQUFFLEdBQUcsRUFBRTtZQUNoRSxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixNQUFNLEdBQUcsR0FBRyxTQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtnQkFDOUMsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsZ0JBQWdCLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztnQkFDakMsaUJBQWlCLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQzthQUNuQyxDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSxrQ0FBNEIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBR3ZILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFFO1FBQ2xDLElBQUksQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7WUFDcEMsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBRXpDLE9BQU87WUFDUCxHQUFHLENBQUMsb0JBQW9CLENBQUMsV0FBVyxFQUFFO2dCQUNwQyxPQUFPLEVBQUUsb0NBQThCLENBQUMsVUFBVTthQUNuRCxDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsdUJBQXVCLEVBQUU7Z0JBQ3ZFLFdBQVcsRUFBRTtvQkFDWCxVQUFVLEVBQUU7d0JBQ1YsRUFBRTt3QkFDRjs0QkFDRSxnQkFBZ0I7NEJBQ2hCO2dDQUNFLEdBQUcsRUFBRSxhQUFhOzZCQUNuQjs0QkFDRCxVQUFVO3lCQUNYO3FCQUNGO2lCQUNGO2dCQUNELEtBQUssRUFBRTtvQkFDTCxHQUFHLEVBQUUsb0JBQW9CO2lCQUMxQjtnQkFDRCxpQkFBaUIsRUFBRSxJQUFJO2dCQUN2QixnQkFBZ0IsRUFBRTtvQkFDaEI7d0JBQ0UsWUFBWSxFQUFFOzRCQUNaLDBDQUEwQzs0QkFDMUMsU0FBUzt5QkFDVjtxQkFDRjtpQkFDRjtnQkFDRCxTQUFTLEVBQUU7b0JBQ1Q7d0JBQ0UsR0FBRyxFQUFFLHdDQUF3QztxQkFDOUM7b0JBQ0Q7d0JBQ0UsR0FBRyxFQUFFLHdDQUF3QztxQkFDOUM7aUJBQ0Y7Z0JBQ0QsZUFBZSxFQUFFLFdBQVc7YUFDN0IsQ0FBQyxDQUFDO1lBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMseUJBQXlCLEVBQUU7Z0JBQ3pFLGdCQUFnQixFQUFFLDRDQUE0QztnQkFDOUQsS0FBSyxFQUFFO29CQUNMLEdBQUcsRUFBRSxvQkFBb0I7aUJBQzFCO2FBQ0YsQ0FBQyxDQUFDO1FBR0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsK0RBQStELEVBQUUsR0FBRyxFQUFFO1lBQzdFLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUU7Z0JBQzlCLE1BQU0sQ0FBQyxvQ0FBOEIsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNqRSxNQUFNLENBQUMsb0NBQThCLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM5RSxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLHlDQUF5QyxFQUFFLEdBQUcsRUFBRTtZQUN2RCxJQUFJLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtnQkFDdkIsUUFBUTtnQkFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUNqRyxNQUFNLEdBQUcsR0FBRyxTQUFHLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7b0JBQ3ZDLEtBQUssRUFBRSxlQUFlO2lCQUN2QixDQUFDLENBQUM7Z0JBRUgsc0JBQXNCO2dCQUN0QixHQUFHLENBQUMsb0JBQW9CLENBQUMsd0JBQXdCLEVBQUU7b0JBQ2pELE9BQU8sRUFBRSxvQ0FBOEIsQ0FBQyxlQUFlO29CQUN2RCxPQUFPLEVBQUU7d0JBQ1AsYUFBYSxFQUFFLENBQUMsa0JBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO3FCQUM5QztpQkFDRixDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBR0gsSUFBSSxDQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUU7WUFDekIsUUFBUTtZQUNSLE1BQU0sTUFBTSxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFFM0IsT0FBTztZQUNQLE1BQU0sZ0JBQWdCLEdBQUcsMEJBQW9CLENBQUMsa0NBQWtDLENBQUMsTUFBTSxFQUFFLGtCQUFrQixFQUFFO2dCQUMzRyxjQUFjLEVBQUUsQ0FBQyxtQkFBYSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztnQkFDdEYsYUFBYSxFQUFFLGlCQUFpQjtnQkFDaEMsSUFBSSxFQUFFLEVBQUU7YUFDVCxDQUFDLENBQUM7WUFDSCxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsMkJBQTJCLEVBQUUsQ0FBQztZQUUzRCxPQUFPO1lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMscUJBQXFCLENBQUMsZ0NBQWdDLEVBQUU7Z0JBQ2pGLE9BQU8sRUFBRSxtQkFBbUI7YUFDN0IsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBR3BFLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHNDQUFzQyxFQUFFLEdBQUcsRUFBRTtZQUNoRCxRQUFRO1lBQ1IsTUFBTSxNQUFNLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUUzQixPQUFPO1lBQ1AsTUFBTSxnQkFBZ0IsR0FBRywwQkFBb0IsQ0FBQyxrQ0FBa0MsQ0FBQyxNQUFNLEVBQUUsa0JBQWtCLEVBQUU7Z0JBQzNHLGFBQWEsRUFBRSxpQkFBaUI7Z0JBQ2hDLElBQUksRUFBRSxFQUFFO2FBQ1QsQ0FBQyxDQUFDO1lBQ0gsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLDJCQUEyQixFQUFFLENBQUM7WUFFM0QsT0FBTztZQUNQLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUNsRSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFHeEUsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsK0JBQStCLEVBQUUsR0FBRyxFQUFFO1lBQ3pDLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBQzFCLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBRyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztZQUV6QyxPQUFPO1lBQ1AsR0FBRyxDQUFDLG9CQUFvQixDQUFDLFdBQVcsRUFBRTtnQkFDcEMsT0FBTyxFQUFFLG9DQUE4QixDQUFDLFVBQVU7Z0JBQ2xELGNBQWMsRUFBRSxDQUFDLG1CQUFhLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQzthQUNoRixDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsdUJBQXVCLEVBQUU7Z0JBQ3ZFLGdCQUFnQixFQUFFLENBQUMsYUFBYSxDQUFDO2FBQ2xDLENBQUMsQ0FBQztRQUdMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLHVDQUF1QyxFQUFFLEdBQUcsRUFBRTtZQUNqRCxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQUcsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFFekMsT0FBTztZQUNQLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUU7Z0JBQzlCLE9BQU8sRUFBRSxvQ0FBOEIsQ0FBQyxrQkFBa0I7Z0JBQzFELGNBQWMsRUFBRSxDQUFDLG1CQUFhLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQzthQUNoRixDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsdUJBQXVCLEVBQUU7Z0JBQ3ZFLGdCQUFnQixFQUFFLENBQUMsYUFBYSxDQUFDO2FBQ2xDLENBQUMsQ0FBQztRQUdMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLHVDQUF1QyxFQUFFLEdBQUcsRUFBRTtZQUNqRCxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQUcsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFFekMsT0FBTztZQUNQLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyx3QkFBd0IsRUFBRTtnQkFDakQsT0FBTyxFQUFFLG9DQUE4QixDQUFDLGVBQWU7YUFDeEQsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHlCQUF5QixFQUFFO2dCQUN6RSxvQkFBb0IsRUFBRTtvQkFDcEIsa0JBQUssQ0FBQyxVQUFVLENBQUM7d0JBQ2YsTUFBTSxFQUFFLEVBQUUsWUFBWSxFQUFFLENBQUMsb0JBQW9CLEVBQUUsV0FBVyxDQUFDLEVBQUU7d0JBQzdELFFBQVEsRUFBRSxHQUFHO3dCQUNiLFVBQVUsRUFBRSxLQUFLO3dCQUNqQixNQUFNLEVBQUUsR0FBRztxQkFDWixDQUFDO2lCQUNIO2FBQ0YsQ0FBQyxDQUFDO1FBR0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsb0NBQW9DLEVBQUUsR0FBRyxFQUFFO1lBQzlDLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBQzFCLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBRyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztZQUV6QyxPQUFPO1lBQ1AsR0FBRyxDQUFDLG9CQUFvQixDQUFDLGFBQWEsRUFBRTtnQkFDdEMsT0FBTyxFQUFFLElBQUksaUNBQTJCLENBQUMseURBQXlELEVBQUUsR0FBRyxDQUFDO2FBQ3pHLENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx1QkFBdUIsRUFBRTtnQkFDdkUsV0FBVyxFQUFFLHlEQUF5RDtnQkFDdEUsaUJBQWlCLEVBQUUsS0FBSzthQUN6QixDQUFDLENBQUM7UUFHTCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxnREFBZ0QsRUFBRSxHQUFHLEVBQUU7WUFDMUQsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBRXpDLE9BQU87WUFDUCxHQUFHLENBQUMsb0JBQW9CLENBQUMsYUFBYSxFQUFFO2dCQUN0QyxPQUFPLEVBQUU7b0JBQ1AsSUFBSSxFQUFFLHlEQUF5RDtvQkFDL0QsSUFBSSxFQUFFLEdBQUc7b0JBQ1QsaUJBQWlCLEVBQUUsSUFBSTtpQkFDeEI7YUFDRixDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsdUJBQXVCLEVBQUU7Z0JBQ3ZFLFdBQVcsRUFBRSx5REFBeUQ7Z0JBQ3RFLGlCQUFpQixFQUFFLElBQUk7YUFDeEIsQ0FBQyxDQUFDO1FBR0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsOENBQThDLEVBQUUsR0FBRyxFQUFFO1lBQ3hELFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRTNHLDhCQUE4QjtZQUM5QixLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FDbkIsc0JBQWUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO2dCQUM1QixRQUFRLEVBQUUsUUFBUSxDQUFDLGVBQWUsQ0FBQywwQkFBMEI7YUFDOUQsQ0FBQyxDQUFDLEdBQUcsRUFDTixDQUFDLFlBQVksRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUM5Qyx5Q0FBeUM7WUFDekMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQ25CLHNCQUFlLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTtnQkFDNUIsUUFBUSxFQUFFLFFBQVEsQ0FBQyxlQUFlLENBQUMsMkNBQTJDO2dCQUM5RSxLQUFLLEVBQUU7b0JBQ0wsV0FBVyxFQUFFLHlEQUF5RDtpQkFDdkU7YUFDRixDQUFDLENBQUMsR0FBRyxFQUNOLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFFaEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRWxDLE9BQU87WUFDUCxHQUFHLENBQUMsb0JBQW9CLENBQUMsYUFBYSxFQUFFO2dCQUN0QyxPQUFPLEVBQUU7b0JBQ1AsSUFBSSxFQUFFLHlEQUF5RDtvQkFDL0QsSUFBSSxFQUFFLEdBQUc7aUJBQ1Y7Z0JBQ0Qsa0JBQWtCLEVBQUUsSUFBSTthQUN6QixDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsdUJBQXVCLEVBQUU7Z0JBQ3ZFLFdBQVcsRUFBRSx5REFBeUQ7Z0JBQ3RFLFNBQVMsRUFBRTtvQkFDVDt3QkFDRSxHQUFHLEVBQUUsaUNBQWlDO3FCQUN2QztvQkFDRDt3QkFDRSxHQUFHLEVBQUUsaUNBQWlDO3FCQUN2QztpQkFDRjthQUNGLENBQUMsQ0FBQztRQUdMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLHNFQUFzRSxFQUFFLEdBQUcsRUFBRTtZQUNoRixRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUUzRyw4QkFBOEI7WUFDOUIsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQ25CLHNCQUFlLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTtnQkFDNUIsUUFBUSxFQUFFLFFBQVEsQ0FBQyxlQUFlLENBQUMsMEJBQTBCO2FBQzlELENBQUMsQ0FBQyxHQUFHLEVBQ04sQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFFOUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRWxDLE9BQU87WUFDUCxHQUFHLENBQUMsb0JBQW9CLENBQUMsYUFBYSxFQUFFO2dCQUN0QyxPQUFPLEVBQUU7b0JBQ1AsSUFBSSxFQUFFLHlEQUF5RDtvQkFDL0QsSUFBSSxFQUFFLEdBQUc7aUJBQ1Y7Z0JBQ0Qsa0JBQWtCLEVBQUUsSUFBSTthQUN6QixDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsdUJBQXVCLEVBQUU7Z0JBQ3ZFLFdBQVcsRUFBRSx5REFBeUQ7Z0JBQ3RFLFNBQVMsRUFBRTtvQkFDVDt3QkFDRSxHQUFHLEVBQUUsaUNBQWlDO3FCQUN2QztvQkFDRDt3QkFDRSxHQUFHLEVBQUUsaUNBQWlDO3FCQUN2QztvQkFDRDt3QkFDRSxHQUFHLEVBQUUsaUNBQWlDO3FCQUN2QztpQkFDRjthQUNGLENBQUMsQ0FBQztRQUdMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLGdEQUFnRCxFQUFFLEdBQUcsRUFBRTtZQUMxRCxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUUzRyw4QkFBOEI7WUFDOUIsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQ25CLHNCQUFlLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTtnQkFDNUIsUUFBUSxFQUFFLFFBQVEsQ0FBQyxlQUFlLENBQUMsMEJBQTBCO2FBQzlELENBQUMsQ0FBQyxHQUFHLEVBQ04sQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDOUMseUNBQXlDO1lBQ3pDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUNuQixzQkFBZSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7Z0JBQzVCLFFBQVEsRUFBRSxRQUFRLENBQUMsZUFBZSxDQUFDLDJDQUEyQztnQkFDOUUsS0FBSyxFQUFFO29CQUNMLFdBQVcsRUFBRSxxQ0FBcUM7aUJBQ25EO2FBQ0YsQ0FBQyxDQUFDLEdBQUcsRUFDTixDQUFDLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBRWhDLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztZQUVsQyxPQUFPO1lBQ1AsR0FBRyxDQUFDLG9CQUFvQixDQUFDLGFBQWEsRUFBRTtnQkFDdEMsT0FBTyxFQUFFLG9DQUE4QixDQUFDLFVBQVU7Z0JBQ2xELGtCQUFrQixFQUFFLElBQUk7YUFDekIsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHVCQUF1QixFQUFFO2dCQUN2RSxXQUFXLEVBQUUscUNBQXFDO2dCQUNsRCxTQUFTLEVBQUU7b0JBQ1Q7d0JBQ0UsR0FBRyxFQUFFLGlDQUFpQztxQkFDdkM7b0JBQ0Q7d0JBQ0UsR0FBRyxFQUFFLGlDQUFpQztxQkFDdkM7aUJBQ0Y7YUFDRixDQUFDLENBQUM7UUFHTCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxtREFBbUQsRUFBRSxHQUFHLEVBQUU7WUFDN0QsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ2xGLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNsQyxPQUFPO1lBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFBLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLEVBQUU7Z0JBQ2xELE9BQU8sRUFBRTtvQkFDUCxJQUFJLEVBQUUseURBQXlEO29CQUMvRCxJQUFJLEVBQUUsR0FBRztpQkFDVjtnQkFDRCxrQkFBa0IsRUFBRSxJQUFJO2FBQ3pCLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRWhCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLGtEQUFrRCxFQUFFLEdBQUcsRUFBRTtZQUM1RCxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDdEYsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2xDLE9BQU87WUFDUCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUEsR0FBRyxDQUFDLG9CQUFvQixDQUFDLGFBQWEsRUFBRTtnQkFDbEQsT0FBTyxFQUFFO29CQUNQLElBQUksRUFBRSx5REFBeUQ7b0JBQy9ELElBQUksRUFBRSxHQUFHO2lCQUNWO2dCQUNELGtCQUFrQixFQUFFLElBQUk7YUFDekIsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFaEIsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsbURBQW1ELEVBQUUsR0FBRyxFQUFFO1lBQzdELFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzNHLE1BQU0sUUFBUSxHQUFHO2dCQUNmLFlBQVk7Z0JBQ1osU0FBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsU0FBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUN6QixTQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxTQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDMUIsQ0FBQztZQUNGLDhCQUE4QjtZQUM5QixLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FDbkIsc0JBQWUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO2dCQUM1QixRQUFRLEVBQUUsUUFBUSxDQUFDLGVBQWUsQ0FBQywwQkFBMEI7YUFDOUQsQ0FBQyxDQUFDLEdBQUcsRUFDTixRQUFRLENBQUMsQ0FBQztZQUNaLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztZQUVsQyxPQUFPO1lBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFBLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLEVBQUU7Z0JBQ2xELE9BQU8sRUFBRTtvQkFDUCxJQUFJLEVBQUUseURBQXlEO29CQUMvRCxJQUFJLEVBQUUsR0FBRztpQkFDVjtnQkFDRCxrQkFBa0IsRUFBRSxJQUFJO2FBQ3pCLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRWhCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLDJDQUEyQyxFQUFFLEdBQUcsRUFBRTtZQUNyRCxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMzRyxNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDbEMsT0FBTztZQUNQLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQSxHQUFHLENBQUMsb0JBQW9CLENBQUMsYUFBYSxFQUFFO2dCQUNsRCxPQUFPLEVBQUU7b0JBQ1AsSUFBSSxFQUFFLHlEQUF5RDtvQkFDL0QsSUFBSSxFQUFFLEdBQUc7aUJBQ1Y7Z0JBQ0QsT0FBTyxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUM7b0JBQ3pCLE9BQU8sRUFBRSxFQUFFO2lCQUNaLENBQUM7YUFDSCxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUVoQixDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxpR0FBaUcsRUFBRSxHQUFHLEVBQUU7WUFDM0csT0FBTztZQUNQLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDNUcsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRWxDLE1BQU07WUFDTixHQUFHLENBQUMsb0JBQW9CLENBQUMsY0FBYyxFQUFFO2dCQUN2QyxPQUFPLEVBQUUsb0NBQThCLENBQUMsR0FBRzthQUM1QyxDQUFDLENBQUM7WUFFSCxNQUFNO1lBQ04scUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsdUJBQXVCLEVBQUU7Z0JBQ3ZFLFdBQVcsRUFBRSxxQ0FBcUM7YUFDbkQsQ0FBQyxDQUFDO1FBR0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMscUdBQXFHLEVBQUUsR0FBRyxFQUFFO1lBQy9HLE9BQU87WUFDUCxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDaEgsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRWxDLE1BQU07WUFDTixHQUFHLENBQUMsb0JBQW9CLENBQUMsaUJBQWlCLEVBQUU7Z0JBQzFDLE9BQU8sRUFBRSxvQ0FBOEIsQ0FBQyxNQUFNO2FBQy9DLENBQUMsQ0FBQztZQUVILE1BQU07WUFDTixxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx1QkFBdUIsRUFBRTtnQkFDdkUsV0FBVyxFQUFFLHdDQUF3QzthQUN0RCxDQUFDLENBQUM7UUFHTCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxvR0FBb0csRUFBRSxHQUFHLEVBQUU7WUFDOUcsT0FBTztZQUNQLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDNUcsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRWxDLE1BQU07WUFDTixHQUFHLENBQUMsb0JBQW9CLENBQUMsY0FBYyxFQUFFO2dCQUN2QyxPQUFPLEVBQUUsb0NBQThCLENBQUMsR0FBRzthQUM1QyxDQUFDLENBQUM7WUFFSCxNQUFNO1lBQ04scUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsdUJBQXVCLEVBQUU7Z0JBQ3ZFLFdBQVcsRUFBRSw4QkFBOEI7YUFDNUMsQ0FBQyxDQUFDO1FBR0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsd0dBQXdHLEVBQUUsR0FBRyxFQUFFO1lBQ2xILE9BQU87WUFDUCxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDaEgsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRWxDLE1BQU07WUFDTixHQUFHLENBQUMsb0JBQW9CLENBQUMsZUFBZSxFQUFFO2dCQUN4QyxPQUFPLEVBQUUsb0NBQThCLENBQUMsSUFBSTthQUM3QyxDQUFDLENBQUM7WUFFSCxNQUFNO1lBQ04scUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsdUJBQXVCLEVBQUU7Z0JBQ3ZFLFdBQVcsRUFBRSxtQ0FBbUM7YUFDakQsQ0FBQyxDQUFDO1FBR0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsMEZBQTBGLEVBQUUsR0FBRyxFQUFFO1lBQ3BHLE9BQU87WUFDUCxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzNHLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztZQUVsQyxNQUFNO1lBQ04sR0FBRyxDQUFDLG9CQUFvQixDQUFDLHFCQUFxQixFQUFFO2dCQUM5QyxPQUFPLEVBQUUsb0NBQThCLENBQUMsVUFBVTthQUNuRCxDQUFDLENBQUM7WUFFSCxNQUFNO1lBQ04scUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsdUJBQXVCLEVBQUU7Z0JBQ3ZFLFdBQVcsRUFBRSxvQ0FBb0M7YUFDbEQsQ0FBQyxDQUFDO1FBR0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsbUZBQW1GLEVBQUUsR0FBRyxFQUFFO1lBQzdGLE9BQU87WUFDUCxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzVHLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztZQUVsQyxNQUFNO1lBQ04sR0FBRyxDQUFDLG9CQUFvQixDQUFDLHFCQUFxQixFQUFFO2dCQUM5QyxPQUFPLEVBQUUsb0NBQThCLENBQUMsVUFBVTthQUNuRCxDQUFDLENBQUM7WUFFSCxNQUFNO1lBQ04scUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsdUJBQXVCLEVBQUU7Z0JBQ3ZFLFdBQVcsRUFBRSwyQ0FBMkM7YUFDekQsQ0FBQyxDQUFDO1FBR0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsdUZBQXVGLEVBQUUsR0FBRyxFQUFFO1lBQ2pHLE9BQU87WUFDUCxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDaEgsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRWxDLE1BQU07WUFDTixHQUFHLENBQUMsb0JBQW9CLENBQUMscUJBQXFCLEVBQUU7Z0JBQzlDLE9BQU8sRUFBRSxvQ0FBOEIsQ0FBQyxVQUFVO2FBQ25ELENBQUMsQ0FBQztZQUVILE1BQU07WUFDTixxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx1QkFBdUIsRUFBRTtnQkFDdkUsV0FBVyxFQUFFLCtDQUErQzthQUM3RCxDQUFDLENBQUM7UUFHTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyx1REFBdUQsRUFBRSxHQUFHLEVBQUU7WUFDakUsT0FBTztZQUNQLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDM0csTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRWxDLE1BQU07WUFDTixHQUFHLENBQUMsb0JBQW9CLENBQUMsMkJBQTJCLEVBQUU7Z0JBQ3BELE9BQU8sRUFBRSxvQ0FBOEIsQ0FBQyxnQkFBZ0I7YUFDekQsQ0FBQyxDQUFDO1lBRUgsR0FBRyxDQUFDLG9CQUFvQixDQUFDLG9DQUFvQyxFQUFFO2dCQUM3RCxPQUFPLEVBQUUsb0NBQThCLENBQUMseUJBQXlCO2FBQ2xFLENBQUMsQ0FBQztZQUVILE1BQU07WUFDTixxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx1QkFBdUIsRUFBRTtnQkFDdkUsV0FBVyxFQUFFLG1EQUFtRDthQUNqRSxDQUFDLENBQUM7WUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx1QkFBdUIsRUFBRTtnQkFDdkUsV0FBVyxFQUFFLDBDQUEwQzthQUN4RCxDQUFDLENBQUM7UUFFTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyw2Q0FBNkMsRUFBRSxHQUFHLEVBQUU7WUFDdkQsT0FBTztZQUNQLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDM0csTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRWxDLE1BQU07WUFDTixHQUFHLENBQUMsb0JBQW9CLENBQUMsMkJBQTJCLEVBQUU7Z0JBQ3BELE9BQU8sRUFBRSxvQ0FBOEIsQ0FBQyxFQUFFO2FBQzNDLENBQUMsQ0FBQztZQUVILE1BQU07WUFFTixxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx1QkFBdUIsRUFBRTtnQkFDdkUsV0FBVyxFQUFFLDRCQUE0QjthQUMxQyxDQUFDLENBQUM7UUFFTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxnREFBZ0QsRUFBRSxHQUFHLEVBQUU7WUFDMUQsT0FBTztZQUNQLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDM0csTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRWxDLE1BQU07WUFDTixHQUFHLENBQUMsb0JBQW9CLENBQUMsMkJBQTJCLEVBQUU7Z0JBQ3BELE9BQU8sRUFBRSxvQ0FBOEIsQ0FBQyxLQUFLO2FBQzlDLENBQUMsQ0FBQztZQUVILE1BQU07WUFFTixxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx1QkFBdUIsRUFBRTtnQkFDdkUsV0FBVyxFQUFFLCtCQUErQjthQUM3QyxDQUFDLENBQUM7UUFFTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxzREFBc0QsRUFBRSxHQUFHLEVBQUU7WUFDaEUsT0FBTztZQUNQLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDM0csTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRWxDLE1BQU07WUFDTixHQUFHLENBQUMsb0JBQW9CLENBQUMsMEJBQTBCLEVBQUU7Z0JBQ25ELE9BQU8sRUFBRSxvQ0FBOEIsQ0FBQyxXQUFXO2FBQ3BELENBQUMsQ0FBQztZQUVILEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQywrQkFBK0IsRUFBRTtnQkFDeEQsT0FBTyxFQUFFLG9DQUE4QixDQUFDLGlCQUFpQjthQUMxRCxDQUFDLENBQUM7WUFFSCxHQUFHLENBQUMsb0JBQW9CLENBQUMsc0NBQXNDLEVBQUU7Z0JBQy9ELE9BQU8sRUFBRSxvQ0FBOEIsQ0FBQyx1QkFBdUI7YUFDaEUsQ0FBQyxDQUFDO1lBRUgsTUFBTTtZQUVOLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHVCQUF1QixFQUFFO2dCQUN2RSxXQUFXLEVBQUUscUNBQXFDO2FBQ25ELENBQUMsQ0FBQztZQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHVCQUF1QixFQUFFO2dCQUN2RSxXQUFXLEVBQUUsMkNBQTJDO2FBQ3pELENBQUMsQ0FBQztZQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHVCQUF1QixFQUFFO2dCQUN2RSxXQUFXLEVBQUUsaURBQWlEO2FBQy9ELENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hdGNoLCBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgQW55UHJpbmNpcGFsLCBQb2xpY3lTdGF0ZW1lbnQgfSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGN4c2NoZW1hIGZyb20gJ0Bhd3MtY2RrL2Nsb3VkLWFzc2VtYmx5LXNjaGVtYSc7XG5pbXBvcnQgeyBDb250ZXh0UHJvdmlkZXIsIEZuLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbmltcG9ydCB7IEdhdGV3YXlWcGNFbmRwb2ludCwgR2F0ZXdheVZwY0VuZHBvaW50QXdzU2VydmljZSwgSW50ZXJmYWNlVnBjRW5kcG9pbnQsIEludGVyZmFjZVZwY0VuZHBvaW50QXdzU2VydmljZSwgSW50ZXJmYWNlVnBjRW5kcG9pbnRTZXJ2aWNlLCBTZWN1cml0eUdyb3VwLCBTdWJuZXRGaWx0ZXIsIFN1Ym5ldFR5cGUsIFZwYyB9IGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCd2cGMgZW5kcG9pbnQnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdnYXRld2F5IGVuZHBvaW50JywgKCkgPT4ge1xuICAgIHRlc3QoJ2FkZCBhbiBlbmRwb2ludCB0byBhIHZwYycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgVnBjKHN0YWNrLCAnVnBjTmV0d29yaycsIHtcbiAgICAgICAgZ2F0ZXdheUVuZHBvaW50czoge1xuICAgICAgICAgIFMzOiB7XG4gICAgICAgICAgICBzZXJ2aWNlOiBHYXRld2F5VnBjRW5kcG9pbnRBd3NTZXJ2aWNlLlMzLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpWUENFbmRwb2ludCcsIHtcbiAgICAgICAgU2VydmljZU5hbWU6IHtcbiAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgJ2NvbS5hbWF6b25hd3MuJyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJy5zMycsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIFZwY0lkOiB7XG4gICAgICAgICAgUmVmOiAnVnBjTmV0d29ya0IyNThFODNBJyxcbiAgICAgICAgfSxcbiAgICAgICAgUm91dGVUYWJsZUlkczogW1xuICAgICAgICAgIHsgUmVmOiAnVnBjTmV0d29ya1ByaXZhdGVTdWJuZXQxUm91dGVUYWJsZUNEMDg1RkYxJyB9LFxuICAgICAgICAgIHsgUmVmOiAnVnBjTmV0d29ya1ByaXZhdGVTdWJuZXQyUm91dGVUYWJsZUU5N0IzMjhCJyB9LFxuICAgICAgICAgIHsgUmVmOiAnVnBjTmV0d29ya1B1YmxpY1N1Ym5ldDFSb3V0ZVRhYmxlMjVDQ0M1M0YnIH0sXG4gICAgICAgICAgeyBSZWY6ICdWcGNOZXR3b3JrUHVibGljU3VibmV0MlJvdXRlVGFibGVFNUYzNDhERicgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVnBjRW5kcG9pbnRUeXBlOiAnR2F0ZXdheScsXG4gICAgICB9KTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdyb3V0aW5nIG9uIHByaXZhdGUgYW5kIHB1YmxpYyBzdWJuZXRzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBWcGMoc3RhY2ssICdWcGNOZXR3b3JrJywge1xuICAgICAgICBnYXRld2F5RW5kcG9pbnRzOiB7XG4gICAgICAgICAgUzM6IHtcbiAgICAgICAgICAgIHNlcnZpY2U6IEdhdGV3YXlWcGNFbmRwb2ludEF3c1NlcnZpY2UuUzMsXG4gICAgICAgICAgICBzdWJuZXRzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZQQ0VuZHBvaW50Jywge1xuICAgICAgICBTZXJ2aWNlTmFtZToge1xuICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAnY29tLmFtYXpvbmF3cy4nLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnLnMzJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgVnBjSWQ6IHtcbiAgICAgICAgICBSZWY6ICdWcGNOZXR3b3JrQjI1OEU4M0EnLFxuICAgICAgICB9LFxuICAgICAgICBSb3V0ZVRhYmxlSWRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnVnBjTmV0d29ya1B1YmxpY1N1Ym5ldDFSb3V0ZVRhYmxlMjVDQ0M1M0YnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnVnBjTmV0d29ya1B1YmxpY1N1Ym5ldDJSb3V0ZVRhYmxlRTVGMzQ4REYnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnVnBjTmV0d29ya1ByaXZhdGVTdWJuZXQxUm91dGVUYWJsZUNEMDg1RkYxJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ1ZwY05ldHdvcmtQcml2YXRlU3VibmV0MlJvdXRlVGFibGVFOTdCMzI4QicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVnBjRW5kcG9pbnRUeXBlOiAnR2F0ZXdheScsXG4gICAgICB9KTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhZGQgc3RhdGVtZW50cyB0byBwb2xpY3knLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWcGNOZXR3b3JrJyk7XG4gICAgICBjb25zdCBlbmRwb2ludCA9IHZwYy5hZGRHYXRld2F5RW5kcG9pbnQoJ1MzJywge1xuICAgICAgICBzZXJ2aWNlOiBHYXRld2F5VnBjRW5kcG9pbnRBd3NTZXJ2aWNlLlMzLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGVuZHBvaW50LmFkZFRvUG9saWN5KG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBwcmluY2lwYWxzOiBbbmV3IEFueVByaW5jaXBhbCgpXSxcbiAgICAgICAgYWN0aW9uczogWydzMzpHZXRPYmplY3QnLCAnczM6TGlzdEJ1Y2tldCddLFxuICAgICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgfSkpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZQQ0VuZHBvaW50Jywge1xuICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgICAnczM6R2V0T2JqZWN0JyxcbiAgICAgICAgICAgICAgICAnczM6TGlzdEJ1Y2tldCcsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUHJpbmNpcGFsOiB7IEFXUzogJyonIH0sXG4gICAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3dzIHdoZW4gYWRkaW5nIGEgc3RhdGVtZW50IHdpdGhvdXQgYSBwcmluY2lwYWwnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWcGNOZXR3b3JrJyk7XG4gICAgICBjb25zdCBlbmRwb2ludCA9IHZwYy5hZGRHYXRld2F5RW5kcG9pbnQoJ1MzJywge1xuICAgICAgICBzZXJ2aWNlOiBHYXRld2F5VnBjRW5kcG9pbnRBd3NTZXJ2aWNlLlMzLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiBlbmRwb2ludC5hZGRUb1BvbGljeShuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgYWN0aW9uczogWydzMzpHZXRPYmplY3QnLCAnczM6TGlzdEJ1Y2tldCddLFxuICAgICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgfSkpKS50b1Rocm93KC9gUHJpbmNpcGFsYC8pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2ltcG9ydC9leHBvcnQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGVwID0gR2F0ZXdheVZwY0VuZHBvaW50LmZyb21HYXRld2F5VnBjRW5kcG9pbnRJZChzdGFjazIsICdJbXBvcnRlZEVuZHBvaW50JywgJ2VuZHBvaW50LWlkJyk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChlcC52cGNFbmRwb2ludElkKS50b0VxdWFsKCdlbmRwb2ludC1pZCcpO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCd3b3JrcyB3aXRoIGFuIGltcG9ydGVkIHZwYycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gVnBjLmZyb21WcGNBdHRyaWJ1dGVzKHN0YWNrLCAnVlBDJywge1xuICAgICAgICB2cGNJZDogJ2lkJyxcbiAgICAgICAgcHJpdmF0ZVN1Ym5ldElkczogWycxJywgJzInLCAnMyddLFxuICAgICAgICBwcml2YXRlU3VibmV0Um91dGVUYWJsZUlkczogWydydDEnLCAncnQyJywgJ3J0MyddLFxuICAgICAgICBhdmFpbGFiaWxpdHlab25lczogWydhJywgJ2InLCAnYyddLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIHZwYy5hZGRHYXRld2F5RW5kcG9pbnQoJ0dhdGV3YXknLCB7IHNlcnZpY2U6IEdhdGV3YXlWcGNFbmRwb2ludEF3c1NlcnZpY2UuUzMgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBDRW5kcG9pbnQnLCB7XG4gICAgICAgIFNlcnZpY2VOYW1lOiB7ICdGbjo6Sm9pbic6IFsnJywgWydjb20uYW1hem9uYXdzLicsIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sICcuczMnXV0gfSxcbiAgICAgICAgVnBjSWQ6ICdpZCcsXG4gICAgICAgIFJvdXRlVGFibGVJZHM6IFsncnQxJywgJ3J0MicsICdydDMnXSxcbiAgICAgICAgVnBjRW5kcG9pbnRUeXBlOiAnR2F0ZXdheScsXG4gICAgICB9KTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0aHJvd3Mgd2l0aCBhbiBpbXBvcnRlZCB2cGMgd2l0aG91dCByb3V0ZSB0YWJsZXMgaWRzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBWcGMuZnJvbVZwY0F0dHJpYnV0ZXMoc3RhY2ssICdWUEMnLCB7XG4gICAgICAgIHZwY0lkOiAnaWQnLFxuICAgICAgICBwcml2YXRlU3VibmV0SWRzOiBbJzEnLCAnMicsICczJ10sXG4gICAgICAgIGF2YWlsYWJpbGl0eVpvbmVzOiBbJ2EnLCAnYicsICdjJ10sXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KCgpID0+IHZwYy5hZGRHYXRld2F5RW5kcG9pbnQoJ0dhdGV3YXknLCB7IHNlcnZpY2U6IEdhdGV3YXlWcGNFbmRwb2ludEF3c1NlcnZpY2UuUzMgfSkpLnRvVGhyb3coL3JvdXRlIHRhYmxlLyk7XG5cblxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaW50ZXJmYWNlIGVuZHBvaW50JywgKCkgPT4ge1xuICAgIHRlc3QoJ2FkZCBhbiBlbmRwb2ludCB0byBhIHZwYycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZwY05ldHdvcmsnKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgdnBjLmFkZEludGVyZmFjZUVuZHBvaW50KCdFY3JEb2NrZXInLCB7XG4gICAgICAgIHNlcnZpY2U6IEludGVyZmFjZVZwY0VuZHBvaW50QXdzU2VydmljZS5FQ1JfRE9DS0VSLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBDRW5kcG9pbnQnLCB7XG4gICAgICAgIFNlcnZpY2VOYW1lOiB7XG4gICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICdjb20uYW1hem9uYXdzLicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICcuZWNyLmRrcicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIFZwY0lkOiB7XG4gICAgICAgICAgUmVmOiAnVnBjTmV0d29ya0IyNThFODNBJyxcbiAgICAgICAgfSxcbiAgICAgICAgUHJpdmF0ZURuc0VuYWJsZWQ6IHRydWUsXG4gICAgICAgIFNlY3VyaXR5R3JvdXBJZHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ1ZwY05ldHdvcmtFY3JEb2NrZXJTZWN1cml0eUdyb3VwN0M5MUQzNDcnLFxuICAgICAgICAgICAgICAnR3JvdXBJZCcsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFN1Ym5ldElkczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ1ZwY05ldHdvcmtQcml2YXRlU3VibmV0MVN1Ym5ldDA3QkExNDNCJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ1ZwY05ldHdvcmtQcml2YXRlU3VibmV0MlN1Ym5ldDVFNDE4OUQ2JyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWcGNFbmRwb2ludFR5cGU6ICdJbnRlcmZhY2UnLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U2VjdXJpdHlHcm91cCcsIHtcbiAgICAgICAgR3JvdXBEZXNjcmlwdGlvbjogJ0RlZmF1bHQvVnBjTmV0d29yay9FY3JEb2NrZXIvU2VjdXJpdHlHcm91cCcsXG4gICAgICAgIFZwY0lkOiB7XG4gICAgICAgICAgUmVmOiAnVnBjTmV0d29ya0IyNThFODNBJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdpbnRlcmZhY2UgZW5kcG9pbnQgcmV0YWlucyBzZXJ2aWNlIG5hbWUgaW4gc2hvcnROYW1lIHByb3BlcnR5JywgKCkgPT4ge1xuICAgICAgdGVzdCgnc2hvcnROYW1lIHByb3BlcnR5JywgKCkgPT4ge1xuICAgICAgICBleHBlY3QoSW50ZXJmYWNlVnBjRW5kcG9pbnRBd3NTZXJ2aWNlLkVDUy5zaG9ydE5hbWUpLnRvQmUoJ2VjcycpO1xuICAgICAgICBleHBlY3QoSW50ZXJmYWNlVnBjRW5kcG9pbnRBd3NTZXJ2aWNlLkVDUl9ET0NLRVIuc2hvcnROYW1lKS50b0JlKCdlY3IuZGtyJyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdhZGQgaW50ZXJmYWNlIGVuZHBvaW50IHRvIGxvb2tlZC11cCBWUEMnLCAoKSA9PiB7XG4gICAgICB0ZXN0KCdpbml0aWFsIHJ1bicsICgpID0+IHtcbiAgICAgICAgLy8gR0lWRU5cbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2sodW5kZWZpbmVkLCB1bmRlZmluZWQsIHsgZW52OiB7IGFjY291bnQ6ICcxMjM0JywgcmVnaW9uOiAndXMtZWFzdC0xJyB9IH0pO1xuICAgICAgICBjb25zdCB2cGMgPSBWcGMuZnJvbUxvb2t1cChzdGFjaywgJ1ZwYycsIHtcbiAgICAgICAgICB2cGNJZDogJ2RvZXNudC1tYXR0ZXInLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUSEVOOiBkb2Vzbid0IHRocm93XG4gICAgICAgIHZwYy5hZGRJbnRlcmZhY2VFbmRwb2ludCgnU2VjcmV0c01hbmFnZXJFbmRwb2ludCcsIHtcbiAgICAgICAgICBzZXJ2aWNlOiBJbnRlcmZhY2VWcGNFbmRwb2ludEF3c1NlcnZpY2UuU0VDUkVUU19NQU5BR0VSLFxuICAgICAgICAgIHN1Ym5ldHM6IHtcbiAgICAgICAgICAgIHN1Ym5ldEZpbHRlcnM6IFtTdWJuZXRGaWx0ZXIuYnlJZHMoWycxMjM0J10pXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG5cbiAgICB0ZXN0KCdpbXBvcnQvZXhwb3J0JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBpbXBvcnRlZEVuZHBvaW50ID0gSW50ZXJmYWNlVnBjRW5kcG9pbnQuZnJvbUludGVyZmFjZVZwY0VuZHBvaW50QXR0cmlidXRlcyhzdGFjazIsICdJbXBvcnRlZEVuZHBvaW50Jywge1xuICAgICAgICBzZWN1cml0eUdyb3VwczogW1NlY3VyaXR5R3JvdXAuZnJvbVNlY3VyaXR5R3JvdXBJZChzdGFjazIsICdTRycsICdzZWN1cml0eS1ncm91cC1pZCcpXSxcbiAgICAgICAgdnBjRW5kcG9pbnRJZDogJ3ZwYy1lbmRwb2ludC1pZCcsXG4gICAgICAgIHBvcnQ6IDgwLFxuICAgICAgfSk7XG4gICAgICBpbXBvcnRlZEVuZHBvaW50LmNvbm5lY3Rpb25zLmFsbG93RGVmYXVsdFBvcnRGcm9tQW55SXB2NCgpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2syKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwSW5ncmVzcycsIHtcbiAgICAgICAgR3JvdXBJZDogJ3NlY3VyaXR5LWdyb3VwLWlkJyxcbiAgICAgIH0pO1xuICAgICAgZXhwZWN0KGltcG9ydGVkRW5kcG9pbnQudnBjRW5kcG9pbnRJZCkudG9FcXVhbCgndnBjLWVuZHBvaW50LWlkJyk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnaW1wb3J0L2V4cG9ydCB3aXRob3V0IHNlY3VyaXR5IGdyb3VwJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBpbXBvcnRlZEVuZHBvaW50ID0gSW50ZXJmYWNlVnBjRW5kcG9pbnQuZnJvbUludGVyZmFjZVZwY0VuZHBvaW50QXR0cmlidXRlcyhzdGFjazIsICdJbXBvcnRlZEVuZHBvaW50Jywge1xuICAgICAgICB2cGNFbmRwb2ludElkOiAndnBjLWVuZHBvaW50LWlkJyxcbiAgICAgICAgcG9ydDogODAsXG4gICAgICB9KTtcbiAgICAgIGltcG9ydGVkRW5kcG9pbnQuY29ubmVjdGlvbnMuYWxsb3dEZWZhdWx0UG9ydEZyb21BbnlJcHY0KCk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChpbXBvcnRlZEVuZHBvaW50LnZwY0VuZHBvaW50SWQpLnRvRXF1YWwoJ3ZwYy1lbmRwb2ludC1pZCcpO1xuICAgICAgZXhwZWN0KGltcG9ydGVkRW5kcG9pbnQuY29ubmVjdGlvbnMuc2VjdXJpdHlHcm91cHMubGVuZ3RoKS50b0VxdWFsKDApO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGggZXhpc3Rpbmcgc2VjdXJpdHkgZ3JvdXBzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVnBjTmV0d29yaycpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICB2cGMuYWRkSW50ZXJmYWNlRW5kcG9pbnQoJ0VjckRvY2tlcicsIHtcbiAgICAgICAgc2VydmljZTogSW50ZXJmYWNlVnBjRW5kcG9pbnRBd3NTZXJ2aWNlLkVDUl9ET0NLRVIsXG4gICAgICAgIHNlY3VyaXR5R3JvdXBzOiBbU2VjdXJpdHlHcm91cC5mcm9tU2VjdXJpdHlHcm91cElkKHN0YWNrLCAnU0cnLCAnZXhpc3RpbmctaWQnKV0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpWUENFbmRwb2ludCcsIHtcbiAgICAgICAgU2VjdXJpdHlHcm91cElkczogWydleGlzdGluZy1pZCddLFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuICAgIHRlc3QoJ3dpdGggZXhpc3Rpbmcgc2VjdXJpdHkgZ3JvdXBzIGZvciBlZnMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWcGNOZXR3b3JrJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIHZwYy5hZGRJbnRlcmZhY2VFbmRwb2ludCgnRWZzJywge1xuICAgICAgICBzZXJ2aWNlOiBJbnRlcmZhY2VWcGNFbmRwb2ludEF3c1NlcnZpY2UuRUxBU1RJQ19GSUxFU1lTVEVNLFxuICAgICAgICBzZWN1cml0eUdyb3VwczogW1NlY3VyaXR5R3JvdXAuZnJvbVNlY3VyaXR5R3JvdXBJZChzdGFjaywgJ1NHJywgJ2V4aXN0aW5nLWlkJyldLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBDRW5kcG9pbnQnLCB7XG4gICAgICAgIFNlY3VyaXR5R3JvdXBJZHM6IFsnZXhpc3RpbmctaWQnXSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcbiAgICB0ZXN0KCdzZWN1cml0eSBncm91cCBoYXMgaW5ncmVzcyBieSBkZWZhdWx0JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVnBjTmV0d29yaycpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICB2cGMuYWRkSW50ZXJmYWNlRW5kcG9pbnQoJ1NlY3JldHNNYW5hZ2VyRW5kcG9pbnQnLCB7XG4gICAgICAgIHNlcnZpY2U6IEludGVyZmFjZVZwY0VuZHBvaW50QXdzU2VydmljZS5TRUNSRVRTX01BTkFHRVIsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwJywge1xuICAgICAgICBTZWN1cml0eUdyb3VwSW5ncmVzczogW1xuICAgICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgICAgQ2lkcklwOiB7ICdGbjo6R2V0QXR0JzogWydWcGNOZXR3b3JrQjI1OEU4M0EnLCAnQ2lkckJsb2NrJ10gfSxcbiAgICAgICAgICAgIEZyb21Qb3J0OiA0NDMsXG4gICAgICAgICAgICBJcFByb3RvY29sOiAndGNwJyxcbiAgICAgICAgICAgIFRvUG9ydDogNDQzLFxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuICAgIHRlc3QoJ25vbi1BV1Mgc2VydmljZSBpbnRlcmZhY2UgZW5kcG9pbnQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWcGNOZXR3b3JrJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIHZwYy5hZGRJbnRlcmZhY2VFbmRwb2ludCgnWW91clNlcnZpY2UnLCB7XG4gICAgICAgIHNlcnZpY2U6IG5ldyBJbnRlcmZhY2VWcGNFbmRwb2ludFNlcnZpY2UoJ2NvbS5hbWF6b25hd3MudnBjZS51cy1lYXN0LTEudnBjZS1zdmMtdXVkZGxybHJiYXN0cnRzdmMnLCA0NDMpLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBDRW5kcG9pbnQnLCB7XG4gICAgICAgIFNlcnZpY2VOYW1lOiAnY29tLmFtYXpvbmF3cy52cGNlLnVzLWVhc3QtMS52cGNlLXN2Yy11dWRkbHJscmJhc3RydHN2YycsXG4gICAgICAgIFByaXZhdGVEbnNFbmFibGVkOiBmYWxzZSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcbiAgICB0ZXN0KCdtYXJrZXRwbGFjZSBwYXJ0bmVyIHNlcnZpY2UgaW50ZXJmYWNlIGVuZHBvaW50JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVnBjTmV0d29yaycpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICB2cGMuYWRkSW50ZXJmYWNlRW5kcG9pbnQoJ1lvdXJTZXJ2aWNlJywge1xuICAgICAgICBzZXJ2aWNlOiB7XG4gICAgICAgICAgbmFtZTogJ2NvbS5hbWF6b25hd3MudnBjZS51cy1lYXN0LTEudnBjZS1zdmMtbWt0cGxhY2VzdmN3cHJkbnMnLFxuICAgICAgICAgIHBvcnQ6IDQ0MyxcbiAgICAgICAgICBwcml2YXRlRG5zRGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZQQ0VuZHBvaW50Jywge1xuICAgICAgICBTZXJ2aWNlTmFtZTogJ2NvbS5hbWF6b25hd3MudnBjZS51cy1lYXN0LTEudnBjZS1zdmMtbWt0cGxhY2VzdmN3cHJkbnMnLFxuICAgICAgICBQcml2YXRlRG5zRW5hYmxlZDogdHJ1ZSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcbiAgICB0ZXN0KCd0ZXN0IGVuZHBvaW50IHNlcnZpY2UgY29udGV4dCBhenMgZGlzY292ZXJlZCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayh1bmRlZmluZWQsICdUZXN0U3RhY2snLCB7IGVudjogeyBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJywgcmVnaW9uOiAndXMtZWFzdC0xJyB9IH0pO1xuXG4gICAgICAvLyBTZXR1cCBjb250ZXh0IGZvciBzdGFjayBBWnNcbiAgICAgIHN0YWNrLm5vZGUuc2V0Q29udGV4dChcbiAgICAgICAgQ29udGV4dFByb3ZpZGVyLmdldEtleShzdGFjaywge1xuICAgICAgICAgIHByb3ZpZGVyOiBjeHNjaGVtYS5Db250ZXh0UHJvdmlkZXIuQVZBSUxBQklMSVRZX1pPTkVfUFJPVklERVIsXG4gICAgICAgIH0pLmtleSxcbiAgICAgICAgWyd1cy1lYXN0LTFhJywgJ3VzLWVhc3QtMWInLCAndXMtZWFzdC0xYyddKTtcbiAgICAgIC8vIFNldHVwIGNvbnRleHQgZm9yIGVuZHBvaW50IHNlcnZpY2UgQVpzXG4gICAgICBzdGFjay5ub2RlLnNldENvbnRleHQoXG4gICAgICAgIENvbnRleHRQcm92aWRlci5nZXRLZXkoc3RhY2ssIHtcbiAgICAgICAgICBwcm92aWRlcjogY3hzY2hlbWEuQ29udGV4dFByb3ZpZGVyLkVORFBPSU5UX1NFUlZJQ0VfQVZBSUxBQklMSVRZX1pPTkVfUFJPVklERVIsXG4gICAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICAgIHNlcnZpY2VOYW1lOiAnY29tLmFtYXpvbmF3cy52cGNlLnVzLWVhc3QtMS52cGNlLXN2Yy11dWRkbHJscmJhc3RydHN2YycsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSkua2V5LFxuICAgICAgICBbJ3VzLWVhc3QtMWEnLCAndXMtZWFzdC0xYyddKTtcblxuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICB2cGMuYWRkSW50ZXJmYWNlRW5kcG9pbnQoJ1lvdXJTZXJ2aWNlJywge1xuICAgICAgICBzZXJ2aWNlOiB7XG4gICAgICAgICAgbmFtZTogJ2NvbS5hbWF6b25hd3MudnBjZS51cy1lYXN0LTEudnBjZS1zdmMtdXVkZGxybHJiYXN0cnRzdmMnLFxuICAgICAgICAgIHBvcnQ6IDQ0MyxcbiAgICAgICAgfSxcbiAgICAgICAgbG9va3VwU3VwcG9ydGVkQXpzOiB0cnVlLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBDRW5kcG9pbnQnLCB7XG4gICAgICAgIFNlcnZpY2VOYW1lOiAnY29tLmFtYXpvbmF3cy52cGNlLnVzLWVhc3QtMS52cGNlLXN2Yy11dWRkbHJscmJhc3RydHN2YycsXG4gICAgICAgIFN1Ym5ldElkczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ1ZQQ1ByaXZhdGVTdWJuZXQxU3VibmV0OEJDQTEwRTAnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnVlBDUHJpdmF0ZVN1Ym5ldDNTdWJuZXQzRURDRDQ1NycsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcbiAgICB0ZXN0KCdlbmRwb2ludCBzZXJ2aWNlIHNldHVwIHdpdGggc3RhY2sgQVogY29udGV4dCBidXQgbm8gZW5kcG9pbnQgY29udGV4dCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayh1bmRlZmluZWQsICdUZXN0U3RhY2snLCB7IGVudjogeyBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJywgcmVnaW9uOiAndXMtZWFzdC0xJyB9IH0pO1xuXG4gICAgICAvLyBTZXR1cCBjb250ZXh0IGZvciBzdGFjayBBWnNcbiAgICAgIHN0YWNrLm5vZGUuc2V0Q29udGV4dChcbiAgICAgICAgQ29udGV4dFByb3ZpZGVyLmdldEtleShzdGFjaywge1xuICAgICAgICAgIHByb3ZpZGVyOiBjeHNjaGVtYS5Db250ZXh0UHJvdmlkZXIuQVZBSUxBQklMSVRZX1pPTkVfUFJPVklERVIsXG4gICAgICAgIH0pLmtleSxcbiAgICAgICAgWyd1cy1lYXN0LTFhJywgJ3VzLWVhc3QtMWInLCAndXMtZWFzdC0xYyddKTtcblxuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICB2cGMuYWRkSW50ZXJmYWNlRW5kcG9pbnQoJ1lvdXJTZXJ2aWNlJywge1xuICAgICAgICBzZXJ2aWNlOiB7XG4gICAgICAgICAgbmFtZTogJ2NvbS5hbWF6b25hd3MudnBjZS51cy1lYXN0LTEudnBjZS1zdmMtdXVkZGxybHJiYXN0cnRzdmMnLFxuICAgICAgICAgIHBvcnQ6IDQ0MyxcbiAgICAgICAgfSxcbiAgICAgICAgbG9va3VwU3VwcG9ydGVkQXpzOiB0cnVlLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBDRW5kcG9pbnQnLCB7XG4gICAgICAgIFNlcnZpY2VOYW1lOiAnY29tLmFtYXpvbmF3cy52cGNlLnVzLWVhc3QtMS52cGNlLXN2Yy11dWRkbHJscmJhc3RydHN2YycsXG4gICAgICAgIFN1Ym5ldElkczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ1ZQQ1ByaXZhdGVTdWJuZXQxU3VibmV0OEJDQTEwRTAnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnVlBDUHJpdmF0ZVN1Ym5ldDJTdWJuZXRDRkNEQUE3QScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWY6ICdWUENQcml2YXRlU3VibmV0M1N1Ym5ldDNFRENENDU3JyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuICAgIHRlc3QoJ3Rlc3QgZW5kcG9pbnQgc2VydmljZSBjb250ZXh0IHdpdGggYXdzIHNlcnZpY2UnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2sodW5kZWZpbmVkLCAnVGVzdFN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsIHJlZ2lvbjogJ3VzLWVhc3QtMScgfSB9KTtcblxuICAgICAgLy8gU2V0dXAgY29udGV4dCBmb3Igc3RhY2sgQVpzXG4gICAgICBzdGFjay5ub2RlLnNldENvbnRleHQoXG4gICAgICAgIENvbnRleHRQcm92aWRlci5nZXRLZXkoc3RhY2ssIHtcbiAgICAgICAgICBwcm92aWRlcjogY3hzY2hlbWEuQ29udGV4dFByb3ZpZGVyLkFWQUlMQUJJTElUWV9aT05FX1BST1ZJREVSLFxuICAgICAgICB9KS5rZXksXG4gICAgICAgIFsndXMtZWFzdC0xYScsICd1cy1lYXN0LTFiJywgJ3VzLWVhc3QtMWMnXSk7XG4gICAgICAvLyBTZXR1cCBjb250ZXh0IGZvciBlbmRwb2ludCBzZXJ2aWNlIEFac1xuICAgICAgc3RhY2subm9kZS5zZXRDb250ZXh0KFxuICAgICAgICBDb250ZXh0UHJvdmlkZXIuZ2V0S2V5KHN0YWNrLCB7XG4gICAgICAgICAgcHJvdmlkZXI6IGN4c2NoZW1hLkNvbnRleHRQcm92aWRlci5FTkRQT0lOVF9TRVJWSUNFX0FWQUlMQUJJTElUWV9aT05FX1BST1ZJREVSLFxuICAgICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgICBzZXJ2aWNlTmFtZTogJ2NvbS5hbWF6b25hd3MudXMtZWFzdC0xLmV4ZWN1dGUtYXBpJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KS5rZXksXG4gICAgICAgIFsndXMtZWFzdC0xYScsICd1cy1lYXN0LTFjJ10pO1xuXG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIHZwYy5hZGRJbnRlcmZhY2VFbmRwb2ludCgnQVBJIEdhdGV3YXknLCB7XG4gICAgICAgIHNlcnZpY2U6IEludGVyZmFjZVZwY0VuZHBvaW50QXdzU2VydmljZS5BUElHQVRFV0FZLFxuICAgICAgICBsb29rdXBTdXBwb3J0ZWRBenM6IHRydWUsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpWUENFbmRwb2ludCcsIHtcbiAgICAgICAgU2VydmljZU5hbWU6ICdjb20uYW1hem9uYXdzLnVzLWVhc3QtMS5leGVjdXRlLWFwaScsXG4gICAgICAgIFN1Ym5ldElkczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ1ZQQ1ByaXZhdGVTdWJuZXQxU3VibmV0OEJDQTEwRTAnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnVlBDUHJpdmF0ZVN1Ym5ldDNTdWJuZXQzRURDRDQ1NycsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcbiAgICB0ZXN0KCdsb29rdXBTdXBwb3J0ZWRBenMgZmFpbHMgaWYgYWNjb3VudCBpcyB1bnJlc29sdmVkJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgJ1Rlc3RTdGFjaycsIHsgZW52OiB7IHJlZ2lvbjogJ3VzLWVhc3QtMScgfSB9KTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcbiAgICAgIC8vIFdIRU5cbiAgICAgIGV4cGVjdCgoKSA9PnZwYy5hZGRJbnRlcmZhY2VFbmRwb2ludCgnWW91clNlcnZpY2UnLCB7XG4gICAgICAgIHNlcnZpY2U6IHtcbiAgICAgICAgICBuYW1lOiAnY29tLmFtYXpvbmF3cy52cGNlLnVzLWVhc3QtMS52cGNlLXN2Yy11dWRkbHJscmJhc3RydHN2YycsXG4gICAgICAgICAgcG9ydDogNDQzLFxuICAgICAgICB9LFxuICAgICAgICBsb29rdXBTdXBwb3J0ZWRBenM6IHRydWUsXG4gICAgICB9KSkudG9UaHJvdygpO1xuXG4gICAgfSk7XG4gICAgdGVzdCgnbG9va3VwU3VwcG9ydGVkQXpzIGZhaWxzIGlmIHJlZ2lvbiBpcyB1bnJlc29sdmVkJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgJ1Rlc3RTdGFjaycsIHsgZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3ODkwMTInIH0gfSk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgICAvLyBXSEVOXG4gICAgICBleHBlY3QoKCkgPT52cGMuYWRkSW50ZXJmYWNlRW5kcG9pbnQoJ1lvdXJTZXJ2aWNlJywge1xuICAgICAgICBzZXJ2aWNlOiB7XG4gICAgICAgICAgbmFtZTogJ2NvbS5hbWF6b25hd3MudnBjZS51cy1lYXN0LTEudnBjZS1zdmMtdXVkZGxybHJiYXN0cnRzdmMnLFxuICAgICAgICAgIHBvcnQ6IDQ0MyxcbiAgICAgICAgfSxcbiAgICAgICAgbG9va3VwU3VwcG9ydGVkQXpzOiB0cnVlLFxuICAgICAgfSkpLnRvVGhyb3coKTtcblxuICAgIH0pO1xuICAgIHRlc3QoJ2xvb2t1cFN1cHBvcnRlZEF6cyBmYWlscyBpZiBzdWJuZXQgQVpzIGFyZSB0b2tlbnMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2sodW5kZWZpbmVkLCAnVGVzdFN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsIHJlZ2lvbjogJ3VzLWVhc3QtMScgfSB9KTtcbiAgICAgIGNvbnN0IHRva2VuQVpzID0gW1xuICAgICAgICAndXMtZWFzdC0xYScsXG4gICAgICAgIEZuLnNlbGVjdCgxLCBGbi5nZXRBenMoKSksXG4gICAgICAgIEZuLnNlbGVjdCgyLCBGbi5nZXRBenMoKSksXG4gICAgICBdO1xuICAgICAgLy8gU2V0dXAgY29udGV4dCBmb3Igc3RhY2sgQVpzXG4gICAgICBzdGFjay5ub2RlLnNldENvbnRleHQoXG4gICAgICAgIENvbnRleHRQcm92aWRlci5nZXRLZXkoc3RhY2ssIHtcbiAgICAgICAgICBwcm92aWRlcjogY3hzY2hlbWEuQ29udGV4dFByb3ZpZGVyLkFWQUlMQUJJTElUWV9aT05FX1BST1ZJREVSLFxuICAgICAgICB9KS5rZXksXG4gICAgICAgIHRva2VuQVpzKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgZXhwZWN0KCgpID0+dnBjLmFkZEludGVyZmFjZUVuZHBvaW50KCdZb3VyU2VydmljZScsIHtcbiAgICAgICAgc2VydmljZToge1xuICAgICAgICAgIG5hbWU6ICdjb20uYW1hem9uYXdzLnZwY2UudXMtZWFzdC0xLnZwY2Utc3ZjLXV1ZGRscmxyYmFzdHJ0c3ZjJyxcbiAgICAgICAgICBwb3J0OiA0NDMsXG4gICAgICAgIH0sXG4gICAgICAgIGxvb2t1cFN1cHBvcnRlZEF6czogdHJ1ZSxcbiAgICAgIH0pKS50b1Rocm93KCk7XG5cbiAgICB9KTtcbiAgICB0ZXN0KCd2cGMgZW5kcG9pbnQgZmFpbHMgaWYgbm8gc3VibmV0cyBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayh1bmRlZmluZWQsICdUZXN0U3RhY2snLCB7IGVudjogeyBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJywgcmVnaW9uOiAndXMtZWFzdC0xJyB9IH0pO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuICAgICAgLy8gV0hFTlxuICAgICAgZXhwZWN0KCgpID0+dnBjLmFkZEludGVyZmFjZUVuZHBvaW50KCdZb3VyU2VydmljZScsIHtcbiAgICAgICAgc2VydmljZToge1xuICAgICAgICAgIG5hbWU6ICdjb20uYW1hem9uYXdzLnZwY2UudXMtZWFzdC0xLnZwY2Utc3ZjLXV1ZGRscmxyYmFzdHJ0c3ZjJyxcbiAgICAgICAgICBwb3J0OiA0NDMsXG4gICAgICAgIH0sXG4gICAgICAgIHN1Ym5ldHM6IHZwYy5zZWxlY3RTdWJuZXRzKHtcbiAgICAgICAgICBzdWJuZXRzOiBbXSxcbiAgICAgICAgfSksXG4gICAgICB9KSkudG9UaHJvdygpO1xuXG4gICAgfSk7XG4gICAgdGVzdCgndGVzdCB2cGMgaW50ZXJmYWNlIGVuZHBvaW50IHdpdGggY24uY29tLmFtYXpvbmF3cyBwcmVmaXggY2FuIGJlIGNyZWF0ZWQgY29ycmVjdGx5IGluIGNuLW5vcnRoLTEnLCAoKSA9PiB7XG4gICAgICAvL0dJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayh1bmRlZmluZWQsICdUZXN0U3RhY2snLCB7IGVudjogeyBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJywgcmVnaW9uOiAnY24tbm9ydGgtMScgfSB9KTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcblxuICAgICAgLy9XSEVOXG4gICAgICB2cGMuYWRkSW50ZXJmYWNlRW5kcG9pbnQoJ0VDUiBFbmRwb2ludCcsIHtcbiAgICAgICAgc2VydmljZTogSW50ZXJmYWNlVnBjRW5kcG9pbnRBd3NTZXJ2aWNlLkVDUixcbiAgICAgIH0pO1xuXG4gICAgICAvL1RIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBDRW5kcG9pbnQnLCB7XG4gICAgICAgIFNlcnZpY2VOYW1lOiAnY24uY29tLmFtYXpvbmF3cy5jbi1ub3J0aC0xLmVjci5hcGknLFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuICAgIHRlc3QoJ3Rlc3QgdnBjIGludGVyZmFjZSBlbmRwb2ludCB3aXRoIGNuLmNvbS5hbWF6b25hd3MgcHJlZml4IGNhbiBiZSBjcmVhdGVkIGNvcnJlY3RseSBpbiBjbi1ub3J0aHdlc3QtMScsICgpID0+IHtcbiAgICAgIC8vR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgJ1Rlc3RTdGFjaycsIHsgZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLCByZWdpb246ICdjbi1ub3J0aHdlc3QtMScgfSB9KTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcblxuICAgICAgLy9XSEVOXG4gICAgICB2cGMuYWRkSW50ZXJmYWNlRW5kcG9pbnQoJ0xhbWJkYSBFbmRwb2ludCcsIHtcbiAgICAgICAgc2VydmljZTogSW50ZXJmYWNlVnBjRW5kcG9pbnRBd3NTZXJ2aWNlLkxBTUJEQSxcbiAgICAgIH0pO1xuXG4gICAgICAvL1RIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBDRW5kcG9pbnQnLCB7XG4gICAgICAgIFNlcnZpY2VOYW1lOiAnY24uY29tLmFtYXpvbmF3cy5jbi1ub3J0aHdlc3QtMS5sYW1iZGEnLFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuICAgIHRlc3QoJ3Rlc3QgdnBjIGludGVyZmFjZSBlbmRwb2ludCB3aXRob3V0IGNuLmNvbS5hbWF6b25hd3MgcHJlZml4IGNhbiBiZSBjcmVhdGVkIGNvcnJlY3RseSBpbiBjbi1ub3J0aC0xJywgKCkgPT4ge1xuICAgICAgLy9HSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2sodW5kZWZpbmVkLCAnVGVzdFN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsIHJlZ2lvbjogJ2NuLW5vcnRoLTEnIH0gfSk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG5cbiAgICAgIC8vV0hFTlxuICAgICAgdnBjLmFkZEludGVyZmFjZUVuZHBvaW50KCdFQ1MgRW5kcG9pbnQnLCB7XG4gICAgICAgIHNlcnZpY2U6IEludGVyZmFjZVZwY0VuZHBvaW50QXdzU2VydmljZS5FQ1MsXG4gICAgICB9KTtcblxuICAgICAgLy9USEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZQQ0VuZHBvaW50Jywge1xuICAgICAgICBTZXJ2aWNlTmFtZTogJ2NvbS5hbWF6b25hd3MuY24tbm9ydGgtMS5lY3MnLFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuICAgIHRlc3QoJ3Rlc3QgdnBjIGludGVyZmFjZSBlbmRwb2ludCB3aXRob3V0IGNuLmNvbS5hbWF6b25hd3MgcHJlZml4IGNhbiBiZSBjcmVhdGVkIGNvcnJlY3RseSBpbiBjbi1ub3J0aHdlc3QtMScsICgpID0+IHtcbiAgICAgIC8vR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgJ1Rlc3RTdGFjaycsIHsgZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLCByZWdpb246ICdjbi1ub3J0aHdlc3QtMScgfSB9KTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcblxuICAgICAgLy9XSEVOXG4gICAgICB2cGMuYWRkSW50ZXJmYWNlRW5kcG9pbnQoJ0dsdWUgRW5kcG9pbnQnLCB7XG4gICAgICAgIHNlcnZpY2U6IEludGVyZmFjZVZwY0VuZHBvaW50QXdzU2VydmljZS5HTFVFLFxuICAgICAgfSk7XG5cbiAgICAgIC8vVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpWUENFbmRwb2ludCcsIHtcbiAgICAgICAgU2VydmljZU5hbWU6ICdjb20uYW1hem9uYXdzLmNuLW5vcnRod2VzdC0xLmdsdWUnLFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuICAgIHRlc3QoJ3Rlc3QgdnBjIGludGVyZmFjZSBlbmRwb2ludCBmb3IgdHJhbnNjcmliZSBjYW4gYmUgY3JlYXRlZCBjb3JyZWN0bHkgaW4gbm9uLWNoaW5hIHJlZ2lvbnMnLCAoKSA9PiB7XG4gICAgICAvL0dJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayh1bmRlZmluZWQsICdUZXN0U3RhY2snLCB7IGVudjogeyBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJywgcmVnaW9uOiAndXMtZWFzdC0xJyB9IH0pO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuXG4gICAgICAvL1dIRU5cbiAgICAgIHZwYy5hZGRJbnRlcmZhY2VFbmRwb2ludCgnVHJhbnNjcmliZSBFbmRwb2ludCcsIHtcbiAgICAgICAgc2VydmljZTogSW50ZXJmYWNlVnBjRW5kcG9pbnRBd3NTZXJ2aWNlLlRSQU5TQ1JJQkUsXG4gICAgICB9KTtcblxuICAgICAgLy9USEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZQQ0VuZHBvaW50Jywge1xuICAgICAgICBTZXJ2aWNlTmFtZTogJ2NvbS5hbWF6b25hd3MudXMtZWFzdC0xLnRyYW5zY3JpYmUnLFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuICAgIHRlc3QoJ3Rlc3QgdnBjIGludGVyZmFjZSBlbmRwb2ludCBmb3IgdHJhbnNjcmliZSBjYW4gYmUgY3JlYXRlZCBjb3JyZWN0bHkgaW4gY24tbm9ydGgtMScsICgpID0+IHtcbiAgICAgIC8vR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgJ1Rlc3RTdGFjaycsIHsgZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLCByZWdpb246ICdjbi1ub3J0aC0xJyB9IH0pO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuXG4gICAgICAvL1dIRU5cbiAgICAgIHZwYy5hZGRJbnRlcmZhY2VFbmRwb2ludCgnVHJhbnNjcmliZSBFbmRwb2ludCcsIHtcbiAgICAgICAgc2VydmljZTogSW50ZXJmYWNlVnBjRW5kcG9pbnRBd3NTZXJ2aWNlLlRSQU5TQ1JJQkUsXG4gICAgICB9KTtcblxuICAgICAgLy9USEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZQQ0VuZHBvaW50Jywge1xuICAgICAgICBTZXJ2aWNlTmFtZTogJ2NuLmNvbS5hbWF6b25hd3MuY24tbm9ydGgtMS50cmFuc2NyaWJlLmNuJyxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rlc3QgdnBjIGludGVyZmFjZSBlbmRwb2ludCBmb3IgdHJhbnNjcmliZSBjYW4gYmUgY3JlYXRlZCBjb3JyZWN0bHkgaW4gY24tbm9ydGh3ZXN0LTEnLCAoKSA9PiB7XG4gICAgICAvL0dJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayh1bmRlZmluZWQsICdUZXN0U3RhY2snLCB7IGVudjogeyBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJywgcmVnaW9uOiAnY24tbm9ydGh3ZXN0LTEnIH0gfSk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG5cbiAgICAgIC8vV0hFTlxuICAgICAgdnBjLmFkZEludGVyZmFjZUVuZHBvaW50KCdUcmFuc2NyaWJlIEVuZHBvaW50Jywge1xuICAgICAgICBzZXJ2aWNlOiBJbnRlcmZhY2VWcGNFbmRwb2ludEF3c1NlcnZpY2UuVFJBTlNDUklCRSxcbiAgICAgIH0pO1xuXG4gICAgICAvL1RIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBDRW5kcG9pbnQnLCB7XG4gICAgICAgIFNlcnZpY2VOYW1lOiAnY24uY29tLmFtYXpvbmF3cy5jbi1ub3J0aHdlc3QtMS50cmFuc2NyaWJlLmNuJyxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rlc3QgY29kZWFydGlmYWN0IHZwYyBpbnRlcmZhY2UgZW5kcG9pbnQgaW4gdXMtd2VzdC0yJywgKCkgPT4ge1xuICAgICAgLy9HSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2sodW5kZWZpbmVkLCAnVGVzdFN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsIHJlZ2lvbjogJ3VzLXdlc3QtMicgfSB9KTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcblxuICAgICAgLy9XSEVOXG4gICAgICB2cGMuYWRkSW50ZXJmYWNlRW5kcG9pbnQoJ0NvZGVBcnRpZmFjdCBBUEkgRW5kcG9pbnQnLCB7XG4gICAgICAgIHNlcnZpY2U6IEludGVyZmFjZVZwY0VuZHBvaW50QXdzU2VydmljZS5DT0RFQVJUSUZBQ1RfQVBJLFxuICAgICAgfSk7XG5cbiAgICAgIHZwYy5hZGRJbnRlcmZhY2VFbmRwb2ludCgnQ29kZUFydGlmYWN0IFJlcG9zaXRvcmllcyBFbmRwb2ludCcsIHtcbiAgICAgICAgc2VydmljZTogSW50ZXJmYWNlVnBjRW5kcG9pbnRBd3NTZXJ2aWNlLkNPREVBUlRJRkFDVF9SRVBPU0lUT1JJRVMsXG4gICAgICB9KTtcblxuICAgICAgLy9USEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZQQ0VuZHBvaW50Jywge1xuICAgICAgICBTZXJ2aWNlTmFtZTogJ2NvbS5hbWF6b25hd3MudXMtd2VzdC0yLmNvZGVhcnRpZmFjdC5yZXBvc2l0b3JpZXMnLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBDRW5kcG9pbnQnLCB7XG4gICAgICAgIFNlcnZpY2VOYW1lOiAnY29tLmFtYXpvbmF3cy51cy13ZXN0LTIuY29kZWFydGlmYWN0LmFwaScsXG4gICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgndGVzdCBzMyB2cGMgaW50ZXJmYWNlIGVuZHBvaW50IGluIHVzLXdlc3QtMicsICgpID0+IHtcbiAgICAgIC8vR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgJ1Rlc3RTdGFjaycsIHsgZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLCByZWdpb246ICd1cy13ZXN0LTInIH0gfSk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG5cbiAgICAgIC8vV0hFTlxuICAgICAgdnBjLmFkZEludGVyZmFjZUVuZHBvaW50KCdDb2RlQXJ0aWZhY3QgQVBJIEVuZHBvaW50Jywge1xuICAgICAgICBzZXJ2aWNlOiBJbnRlcmZhY2VWcGNFbmRwb2ludEF3c1NlcnZpY2UuUzMsXG4gICAgICB9KTtcblxuICAgICAgLy9USEVOXG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBDRW5kcG9pbnQnLCB7XG4gICAgICAgIFNlcnZpY2VOYW1lOiAnY29tLmFtYXpvbmF3cy51cy13ZXN0LTIuczMnLFxuICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rlc3QgYmF0Y2ggdnBjIGludGVyZmFjZSBlbmRwb2ludCBpbiB1cy13ZXN0LTInLCAoKSA9PiB7XG4gICAgICAvL0dJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayh1bmRlZmluZWQsICdUZXN0U3RhY2snLCB7IGVudjogeyBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJywgcmVnaW9uOiAndXMtd2VzdC0yJyB9IH0pO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuXG4gICAgICAvL1dIRU5cbiAgICAgIHZwYy5hZGRJbnRlcmZhY2VFbmRwb2ludCgnQ29kZUFydGlmYWN0IEFQSSBFbmRwb2ludCcsIHtcbiAgICAgICAgc2VydmljZTogSW50ZXJmYWNlVnBjRW5kcG9pbnRBd3NTZXJ2aWNlLkJBVENILFxuICAgICAgfSk7XG5cbiAgICAgIC8vVEhFTlxuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZQQ0VuZHBvaW50Jywge1xuICAgICAgICBTZXJ2aWNlTmFtZTogJ2NvbS5hbWF6b25hd3MudXMtd2VzdC0yLmJhdGNoJyxcbiAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0ZXN0IGF1dG9zY2FsaW5nIHZwYyBpbnRlcmZhY2UgZW5kcG9pbnQgaW4gdXMtd2VzdC0yJywgKCkgPT4ge1xuICAgICAgLy9HSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2sodW5kZWZpbmVkLCAnVGVzdFN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsIHJlZ2lvbjogJ3VzLXdlc3QtMicgfSB9KTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcblxuICAgICAgLy9XSEVOXG4gICAgICB2cGMuYWRkSW50ZXJmYWNlRW5kcG9pbnQoJ0F1dG9zY2FsaW5nIEFQSSBFbmRwb2ludCcsIHtcbiAgICAgICAgc2VydmljZTogSW50ZXJmYWNlVnBjRW5kcG9pbnRBd3NTZXJ2aWNlLkFVVE9TQ0FMSU5HLFxuICAgICAgfSk7XG5cbiAgICAgIHZwYy5hZGRJbnRlcmZhY2VFbmRwb2ludCgnQXV0b3NjYWxpbmctcGxhbiBBUEkgRW5kcG9pbnQnLCB7XG4gICAgICAgIHNlcnZpY2U6IEludGVyZmFjZVZwY0VuZHBvaW50QXdzU2VydmljZS5BVVRPU0NBTElOR19QTEFOUyxcbiAgICAgIH0pO1xuXG4gICAgICB2cGMuYWRkSW50ZXJmYWNlRW5kcG9pbnQoJ0FwcGxpY2F0aW9uLUF1dG9zY2FsaW5nIEFQSSBFbmRwb2ludCcsIHtcbiAgICAgICAgc2VydmljZTogSW50ZXJmYWNlVnBjRW5kcG9pbnRBd3NTZXJ2aWNlLkFQUExJQ0FUSU9OX0FVVE9TQ0FMSU5HLFxuICAgICAgfSk7XG5cbiAgICAgIC8vVEhFTlxuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZQQ0VuZHBvaW50Jywge1xuICAgICAgICBTZXJ2aWNlTmFtZTogJ2NvbS5hbWF6b25hd3MudXMtd2VzdC0yLmF1dG9zY2FsaW5nJyxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZQQ0VuZHBvaW50Jywge1xuICAgICAgICBTZXJ2aWNlTmFtZTogJ2NvbS5hbWF6b25hd3MudXMtd2VzdC0yLmF1dG9zY2FsaW5nLXBsYW5zJyxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZQQ0VuZHBvaW50Jywge1xuICAgICAgICBTZXJ2aWNlTmFtZTogJ2NvbS5hbWF6b25hd3MudXMtd2VzdC0yLmFwcGxpY2F0aW9uLWF1dG9zY2FsaW5nJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19