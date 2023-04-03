"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const ec2 = require("@aws-cdk/aws-ec2");
const route53 = require("@aws-cdk/aws-route53");
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/core");
const elbv2 = require("../../lib");
describe('tests', () => {
    test('Trivial construction: internet facing', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        // WHEN
        new elbv2.NetworkLoadBalancer(stack, 'LB', {
            vpc,
            internetFacing: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
            Scheme: 'internet-facing',
            Subnets: [
                { Ref: 'StackPublicSubnet1Subnet0AD81D22' },
                { Ref: 'StackPublicSubnet2Subnet3C7D2288' },
            ],
            Type: 'network',
        });
    });
    test('Trivial construction: internal', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        // WHEN
        new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
            Scheme: 'internal',
            Subnets: [
                { Ref: 'StackPrivateSubnet1Subnet47AC2BC7' },
                { Ref: 'StackPrivateSubnet2SubnetA2F8EDD8' },
            ],
            Type: 'network',
        });
    });
    test('VpcEndpointService with Domain Name imported from public hosted zone', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Vpc');
        const nlb = new elbv2.NetworkLoadBalancer(stack, 'Nlb', { vpc });
        const endpointService = new ec2.VpcEndpointService(stack, 'EndpointService', { vpcEndpointServiceLoadBalancers: [nlb] });
        // WHEN
        const importedPHZ = route53.PublicHostedZone.fromPublicHostedZoneAttributes(stack, 'MyPHZ', {
            hostedZoneId: 'sampleid',
            zoneName: 'MyZone',
        });
        new route53.VpcEndpointServiceDomainName(stack, 'EndpointServiceDomainName', {
            endpointService,
            domainName: 'MyDomain',
            publicHostedZone: importedPHZ,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
            HostedZoneId: 'sampleid',
        });
    });
    test('Attributes', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        // WHEN
        new elbv2.NetworkLoadBalancer(stack, 'LB', {
            vpc,
            crossZoneEnabled: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
            LoadBalancerAttributes: assertions_1.Match.arrayWith([
                {
                    Key: 'load_balancing.cross_zone.enabled',
                    Value: 'true',
                },
            ]),
        });
    });
    test('Access logging', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, undefined, { env: { region: 'us-east-1' } });
        const vpc = new ec2.Vpc(stack, 'Stack');
        const bucket = new s3.Bucket(stack, 'AccessLoggingBucket');
        const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
        // WHEN
        lb.logAccessLogs(bucket);
        // THEN
        // verify that the LB attributes reference the bucket
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
            LoadBalancerAttributes: assertions_1.Match.arrayWith([
                {
                    Key: 'access_logs.s3.enabled',
                    Value: 'true',
                },
                {
                    Key: 'access_logs.s3.bucket',
                    Value: { Ref: 'AccessLoggingBucketA6D88F29' },
                },
                {
                    Key: 'access_logs.s3.prefix',
                    Value: '',
                },
            ]),
        });
        // verify the bucket policy allows the ALB to put objects in the bucket
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
            PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: [
                            's3:PutObject',
                            's3:PutObjectLegalHold',
                            's3:PutObjectRetention',
                            's3:PutObjectTagging',
                            's3:PutObjectVersionTagging',
                            's3:Abort*',
                        ],
                        Effect: 'Allow',
                        Principal: { AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::127311923021:root']] } },
                        Resource: {
                            'Fn::Join': ['', [{ 'Fn::GetAtt': ['AccessLoggingBucketA6D88F29', 'Arn'] }, '/AWSLogs/',
                                    { Ref: 'AWS::AccountId' }, '/*']],
                        },
                    },
                    {
                        Action: 's3:PutObject',
                        Condition: { StringEquals: { 's3:x-amz-acl': 'bucket-owner-full-control' } },
                        Effect: 'Allow',
                        Principal: { Service: 'delivery.logs.amazonaws.com' },
                        Resource: {
                            'Fn::Join': ['', [{ 'Fn::GetAtt': ['AccessLoggingBucketA6D88F29', 'Arn'] }, '/AWSLogs/',
                                    { Ref: 'AWS::AccountId' }, '/*']],
                        },
                    },
                    {
                        Action: 's3:GetBucketAcl',
                        Effect: 'Allow',
                        Principal: { Service: 'delivery.logs.amazonaws.com' },
                        Resource: {
                            'Fn::GetAtt': ['AccessLoggingBucketA6D88F29', 'Arn'],
                        },
                    },
                ],
            },
        });
        // verify the ALB depends on the bucket *and* the bucket policy
        assertions_1.Template.fromStack(stack).hasResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
            DependsOn: ['AccessLoggingBucketPolicy700D7CC6', 'AccessLoggingBucketA6D88F29'],
        });
    });
    test('access logging with prefix', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, undefined, { env: { region: 'us-east-1' } });
        const vpc = new ec2.Vpc(stack, 'Stack');
        const bucket = new s3.Bucket(stack, 'AccessLoggingBucket');
        const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
        // WHEN
        lb.logAccessLogs(bucket, 'prefix-of-access-logs');
        // THEN
        // verify that the LB attributes reference the bucket
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
            LoadBalancerAttributes: assertions_1.Match.arrayWith([
                {
                    Key: 'access_logs.s3.enabled',
                    Value: 'true',
                },
                {
                    Key: 'access_logs.s3.bucket',
                    Value: { Ref: 'AccessLoggingBucketA6D88F29' },
                },
                {
                    Key: 'access_logs.s3.prefix',
                    Value: 'prefix-of-access-logs',
                },
            ]),
        });
        // verify the bucket policy allows the ALB to put objects in the bucket
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
            PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: [
                            's3:PutObject',
                            's3:PutObjectLegalHold',
                            's3:PutObjectRetention',
                            's3:PutObjectTagging',
                            's3:PutObjectVersionTagging',
                            's3:Abort*',
                        ],
                        Effect: 'Allow',
                        Principal: { AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::127311923021:root']] } },
                        Resource: {
                            'Fn::Join': ['', [{ 'Fn::GetAtt': ['AccessLoggingBucketA6D88F29', 'Arn'] }, '/prefix-of-access-logs/AWSLogs/',
                                    { Ref: 'AWS::AccountId' }, '/*']],
                        },
                    },
                    {
                        Action: 's3:PutObject',
                        Condition: { StringEquals: { 's3:x-amz-acl': 'bucket-owner-full-control' } },
                        Effect: 'Allow',
                        Principal: { Service: 'delivery.logs.amazonaws.com' },
                        Resource: {
                            'Fn::Join': ['', [{ 'Fn::GetAtt': ['AccessLoggingBucketA6D88F29', 'Arn'] }, '/prefix-of-access-logs/AWSLogs/',
                                    { Ref: 'AWS::AccountId' }, '/*']],
                        },
                    },
                    {
                        Action: 's3:GetBucketAcl',
                        Effect: 'Allow',
                        Principal: { Service: 'delivery.logs.amazonaws.com' },
                        Resource: {
                            'Fn::GetAtt': ['AccessLoggingBucketA6D88F29', 'Arn'],
                        },
                    },
                ],
            },
        });
    });
    test('loadBalancerName', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        // WHEN
        new elbv2.NetworkLoadBalancer(stack, 'ALB', {
            loadBalancerName: 'myLoadBalancer',
            vpc,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
            Name: 'myLoadBalancer',
        });
    });
    test('loadBalancerName unallowed: more than 32 characters', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app);
        const vpc = new ec2.Vpc(stack, 'Stack');
        // WHEN
        new elbv2.NetworkLoadBalancer(stack, 'NLB', {
            loadBalancerName: 'a'.repeat(33),
            vpc,
        });
        // THEN
        expect(() => {
            app.synth();
        }).toThrow('Load balancer name: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" can have a maximum of 32 characters.');
    });
    test('loadBalancerName unallowed: starts with "internal-"', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app);
        const vpc = new ec2.Vpc(stack, 'Stack');
        // WHEN
        new elbv2.NetworkLoadBalancer(stack, 'NLB', {
            loadBalancerName: 'internal-myLoadBalancer',
            vpc,
        });
        // THEN
        expect(() => {
            app.synth();
        }).toThrow('Load balancer name: "internal-myLoadBalancer" must not begin with "internal-".');
    });
    test('loadBalancerName unallowed: starts with hyphen', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app);
        const vpc = new ec2.Vpc(stack, 'Stack');
        // WHEN
        new elbv2.NetworkLoadBalancer(stack, 'NLB', {
            loadBalancerName: '-myLoadBalancer',
            vpc,
        });
        // THEN
        expect(() => {
            app.synth();
        }).toThrow('Load balancer name: "-myLoadBalancer" must not begin or end with a hyphen.');
    });
    test('loadBalancerName unallowed: ends with hyphen', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app);
        const vpc = new ec2.Vpc(stack, 'Stack');
        // WHEN
        new elbv2.NetworkLoadBalancer(stack, 'NLB', {
            loadBalancerName: 'myLoadBalancer-',
            vpc,
        });
        // THEN
        expect(() => {
            app.synth();
        }).toThrow('Load balancer name: "myLoadBalancer-" must not begin or end with a hyphen.');
    });
    test('loadBalancerName unallowed: unallowed characters', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app);
        const vpc = new ec2.Vpc(stack, 'Stack');
        // WHEN
        new elbv2.NetworkLoadBalancer(stack, 'NLB', {
            loadBalancerName: 'my load balancer',
            vpc,
        });
        // THEN
        expect(() => {
            app.synth();
        }).toThrow('Load balancer name: "my load balancer" must contain only alphanumeric characters or hyphens.');
    });
    test('imported network load balancer with no vpc specified throws error when calling addTargets', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const nlbArn = 'arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/app/my-load-balancer/50dc6c495c0c9188';
        const nlb = elbv2.NetworkLoadBalancer.fromNetworkLoadBalancerAttributes(stack, 'NLB', {
            loadBalancerArn: nlbArn,
        });
        // WHEN
        const listener = nlb.addListener('Listener', { port: 80 });
        expect(() => listener.addTargets('targetgroup', { port: 8080 })).toThrow();
    });
    test('imported network load balancer with vpc does not throw error when calling addTargets', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Vpc');
        const nlbArn = 'arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/app/my-load-balancer/50dc6c495c0c9188';
        const nlb = elbv2.NetworkLoadBalancer.fromNetworkLoadBalancerAttributes(stack, 'NLB', {
            loadBalancerArn: nlbArn,
            vpc,
        });
        // WHEN
        const listener = nlb.addListener('Listener', { port: 80 });
        expect(() => listener.addTargets('targetgroup', { port: 8080 })).not.toThrow();
    });
    test('imported load balancer knows its region', () => {
        const stack = new cdk.Stack();
        // WHEN
        const albArn = 'arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/app/my-load-balancer/50dc6c495c0c9188';
        const alb = elbv2.NetworkLoadBalancer.fromNetworkLoadBalancerAttributes(stack, 'ALB', {
            loadBalancerArn: albArn,
        });
        // THEN
        expect(alb.env.region).toEqual('us-west-2');
    });
    test('imported load balancer can have metrics', () => {
        const stack = new cdk.Stack();
        // WHEN
        const arn = 'arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/network/my-load-balancer/50dc6c495c0c9188';
        const nlb = elbv2.NetworkLoadBalancer.fromNetworkLoadBalancerAttributes(stack, 'NLB', {
            loadBalancerArn: arn,
        });
        const metric = nlb.metrics.custom('MetricName');
        // THEN
        expect(metric.namespace).toEqual('AWS/NetworkELB');
        expect(stack.resolve(metric.dimensions)).toEqual({
            LoadBalancer: 'network/my-load-balancer/50dc6c495c0c9188',
        });
    });
    test('Trivial construction: internal with Isolated subnets only', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC', {
            subnetConfiguration: [{
                    cidrMask: 20,
                    name: 'Isolated',
                    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                }],
        });
        // WHEN
        new elbv2.NetworkLoadBalancer(stack, 'LB', {
            vpc,
            internetFacing: false,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
            Scheme: 'internal',
            Subnets: [
                { Ref: 'VPCIsolatedSubnet1SubnetEBD00FC6' },
                { Ref: 'VPCIsolatedSubnet2Subnet4B1C8CAA' },
            ],
            Type: 'network',
        });
    });
    test('Internal with Public, Private, and Isolated subnets', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC', {
            subnetConfiguration: [{
                    cidrMask: 24,
                    name: 'Public',
                    subnetType: ec2.SubnetType.PUBLIC,
                }, {
                    cidrMask: 24,
                    name: 'Private',
                    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
                }, {
                    cidrMask: 28,
                    name: 'Isolated',
                    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                }],
        });
        // WHEN
        new elbv2.NetworkLoadBalancer(stack, 'LB', {
            vpc,
            internetFacing: false,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
            Scheme: 'internal',
            Subnets: [
                { Ref: 'VPCPrivateSubnet1Subnet8BCA10E0' },
                { Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A' },
            ],
            Type: 'network',
        });
    });
    test('Internet-facing with Public, Private, and Isolated subnets', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC', {
            subnetConfiguration: [{
                    cidrMask: 24,
                    name: 'Public',
                    subnetType: ec2.SubnetType.PUBLIC,
                }, {
                    cidrMask: 24,
                    name: 'Private',
                    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
                }, {
                    cidrMask: 28,
                    name: 'Isolated',
                    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                }],
        });
        // WHEN
        new elbv2.NetworkLoadBalancer(stack, 'LB', {
            vpc,
            internetFacing: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
            Scheme: 'internet-facing',
            Subnets: [
                { Ref: 'VPCPublicSubnet1SubnetB4246D30' },
                { Ref: 'VPCPublicSubnet2Subnet74179F39' },
            ],
            Type: 'network',
        });
    });
    test('Internal load balancer supplying public subnets', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        // WHEN
        new elbv2.NetworkLoadBalancer(stack, 'LB', {
            vpc,
            internetFacing: false,
            vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
            Scheme: 'internal',
            Subnets: [
                { Ref: 'VPCPublicSubnet1SubnetB4246D30' },
                { Ref: 'VPCPublicSubnet2Subnet74179F39' },
            ],
            Type: 'network',
        });
    });
    test('Internal load balancer supplying isolated subnets', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC', {
            subnetConfiguration: [{
                    cidrMask: 24,
                    name: 'Public',
                    subnetType: ec2.SubnetType.PUBLIC,
                }, {
                    cidrMask: 24,
                    name: 'Private',
                    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
                }, {
                    cidrMask: 28,
                    name: 'Isolated',
                    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                }],
        });
        // WHEN
        new elbv2.NetworkLoadBalancer(stack, 'LB', {
            vpc,
            internetFacing: false,
            vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
            Scheme: 'internal',
            Subnets: [
                { Ref: 'VPCIsolatedSubnet1SubnetEBD00FC6' },
                { Ref: 'VPCIsolatedSubnet2Subnet4B1C8CAA' },
            ],
            Type: 'network',
        });
    });
    describe('lookup', () => {
        test('Can look up a NetworkLoadBalancer', () => {
            // GIVEN
            const app = new cdk.App();
            const stack = new cdk.Stack(app, 'stack', {
                env: {
                    account: '123456789012',
                    region: 'us-west-2',
                },
            });
            // WHEN
            const loadBalancer = elbv2.NetworkLoadBalancer.fromLookup(stack, 'a', {
                loadBalancerTags: {
                    some: 'tag',
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::ElasticLoadBalancingV2::NetworkLoadBalancer', 0);
            expect(loadBalancer.loadBalancerArn).toEqual('arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/network/my-load-balancer/50dc6c495c0c9188');
            expect(loadBalancer.loadBalancerCanonicalHostedZoneId).toEqual('Z3DZXE0EXAMPLE');
            expect(loadBalancer.loadBalancerDnsName).toEqual('my-load-balancer-1234567890.us-west-2.elb.amazonaws.com');
            expect(loadBalancer.env.region).toEqual('us-west-2');
        });
        test('Can add listeners to a looked-up NetworkLoadBalancer', () => {
            // GIVEN
            const app = new cdk.App();
            const stack = new cdk.Stack(app, 'stack', {
                env: {
                    account: '123456789012',
                    region: 'us-west-2',
                },
            });
            const loadBalancer = elbv2.NetworkLoadBalancer.fromLookup(stack, 'a', {
                loadBalancerTags: {
                    some: 'tag',
                },
            });
            const targetGroup = new elbv2.NetworkTargetGroup(stack, 'tg', {
                vpc: loadBalancer.vpc,
                port: 3000,
            });
            // WHEN
            loadBalancer.addListener('listener', {
                protocol: elbv2.Protocol.TCP_UDP,
                port: 3000,
                defaultAction: elbv2.NetworkListenerAction.forward([targetGroup]),
            });
            // THEN
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::ElasticLoadBalancingV2::NetworkLoadBalancer', 0);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::ElasticLoadBalancingV2::Listener', 1);
        });
        test('Can create metrics from a looked-up NetworkLoadBalancer', () => {
            // GIVEN
            const app = new cdk.App();
            const stack = new cdk.Stack(app, 'stack', {
                env: {
                    account: '123456789012',
                    region: 'us-west-2',
                },
            });
            const loadBalancer = elbv2.NetworkLoadBalancer.fromLookup(stack, 'a', {
                loadBalancerTags: {
                    some: 'tag',
                },
            });
            // WHEN
            const metric = loadBalancer.metrics.custom('MetricName');
            // THEN
            expect(metric.namespace).toEqual('AWS/NetworkELB');
            expect(stack.resolve(metric.dimensions)).toEqual({
                LoadBalancer: 'network/my-load-balancer/50dc6c495c0c9188',
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZC1iYWxhbmNlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9hZC1iYWxhbmNlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQXNEO0FBQ3RELHdDQUF3QztBQUN4QyxnREFBZ0Q7QUFDaEQsc0NBQXNDO0FBQ3RDLHFDQUFxQztBQUNyQyxtQ0FBbUM7QUFFbkMsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7SUFDckIsSUFBSSxDQUFDLHVDQUF1QyxFQUFFLEdBQUcsRUFBRTtRQUNqRCxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUV4QyxPQUFPO1FBQ1AsSUFBSSxLQUFLLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRTtZQUN6QyxHQUFHO1lBQ0gsY0FBYyxFQUFFLElBQUk7U0FDckIsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDJDQUEyQyxFQUFFO1lBQzNGLE1BQU0sRUFBRSxpQkFBaUI7WUFDekIsT0FBTyxFQUFFO2dCQUNQLEVBQUUsR0FBRyxFQUFFLGtDQUFrQyxFQUFFO2dCQUMzQyxFQUFFLEdBQUcsRUFBRSxrQ0FBa0MsRUFBRTthQUM1QztZQUNELElBQUksRUFBRSxTQUFTO1NBQ2hCLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGdDQUFnQyxFQUFFLEdBQUcsRUFBRTtRQUMxQyxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFD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RUFBRSxjQUFjO29CQUN2QixNQUFNLEVBQUUsV0FBVztpQkFDcEI7YUFDRixDQUFDLENBQUM7WUFFSCxNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUU7Z0JBQ3BFLGdCQUFnQixFQUFFO29CQUNoQixJQUFJLEVBQUUsS0FBSztpQkFDWjthQUNGLENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxNQUFNLE1BQU0sR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUV6RCxPQUFPO1lBQ1AsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUNuRCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQy9DLFlBQVksRUFBRSwyQ0FBMkM7YUFDMUQsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWF0Y2gsIFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyByb3V0ZTUzIGZyb20gJ0Bhd3MtY2RrL2F3cy1yb3V0ZTUzJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBlbGJ2MiBmcm9tICcuLi8uLi9saWInO1xuXG5kZXNjcmliZSgndGVzdHMnLCAoKSA9PiB7XG4gIHRlc3QoJ1RyaXZpYWwgY29uc3RydWN0aW9uOiBpbnRlcm5ldCBmYWNpbmcnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVsYnYyLk5ldHdvcmtMb2FkQmFsYW5jZXIoc3RhY2ssICdMQicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGludGVybmV0RmFjaW5nOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OkxvYWRCYWxhbmNlcicsIHtcbiAgICAgIFNjaGVtZTogJ2ludGVybmV0LWZhY2luZycsXG4gICAgICBTdWJuZXRzOiBbXG4gICAgICAgIHsgUmVmOiAnU3RhY2tQdWJsaWNTdWJuZXQxU3VibmV0MEFEODFEMjInIH0sXG4gICAgICAgIHsgUmVmOiAnU3RhY2tQdWJsaWNTdWJuZXQyU3VibmV0M0M3RDIyODgnIH0sXG4gICAgICBdLFxuICAgICAgVHlwZTogJ25ldHdvcmsnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdUcml2aWFsIGNvbnN0cnVjdGlvbjogaW50ZXJuYWwnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVsYnYyLk5ldHdvcmtMb2FkQmFsYW5jZXIoc3RhY2ssICdMQicsIHsgdnBjIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OkxvYWRCYWxhbmNlcicsIHtcbiAgICAgIFNjaGVtZTogJ2ludGVybmFsJyxcbiAgICAgIFN1Ym5ldHM6IFtcbiAgICAgICAgeyBSZWY6ICdTdGFja1ByaXZhdGVTdWJuZXQxU3VibmV0NDdBQzJCQzcnIH0sXG4gICAgICAgIHsgUmVmOiAnU3RhY2tQcml2YXRlU3VibmV0MlN1Ym5ldEEyRjhFREQ4JyB9LFxuICAgICAgXSxcbiAgICAgIFR5cGU6ICduZXR3b3JrJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnVnBjRW5kcG9pbnRTZXJ2aWNlIHdpdGggRG9tYWluIE5hbWUgaW1wb3J0ZWQgZnJvbSBwdWJsaWMgaG9zdGVkIHpvbmUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZwYycpO1xuICAgIGNvbnN0IG5sYiA9IG5ldyBlbGJ2Mi5OZXR3b3JrTG9hZEJhbGFuY2VyKHN0YWNrLCAnTmxiJywgeyB2cGMgfSk7XG4gICAgY29uc3QgZW5kcG9pbnRTZXJ2aWNlID0gbmV3IGVjMi5WcGNFbmRwb2ludFNlcnZpY2Uoc3RhY2ssICdFbmRwb2ludFNlcnZpY2UnLCB7IHZwY0VuZHBvaW50U2VydmljZUxvYWRCYWxhbmNlcnM6IFtubGJdIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGltcG9ydGVkUEhaID0gcm91dGU1My5QdWJsaWNIb3N0ZWRab25lLmZyb21QdWJsaWNIb3N0ZWRab25lQXR0cmlidXRlcyhzdGFjaywgJ015UEhaJywge1xuICAgICAgaG9zdGVkWm9uZUlkOiAnc2FtcGxlaWQnLFxuICAgICAgem9uZU5hbWU6ICdNeVpvbmUnLFxuICAgIH0pO1xuICAgIG5ldyByb3V0ZTUzLlZwY0VuZHBvaW50U2VydmljZURvbWFpbk5hbWUoc3RhY2ssICdFbmRwb2ludFNlcnZpY2VEb21haW5OYW1lJywge1xuICAgICAgZW5kcG9pbnRTZXJ2aWNlLFxuICAgICAgZG9tYWluTmFtZTogJ015RG9tYWluJyxcbiAgICAgIHB1YmxpY0hvc3RlZFpvbmU6IGltcG9ydGVkUEhaLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlJvdXRlNTM6OlJlY29yZFNldCcsIHtcbiAgICAgIEhvc3RlZFpvbmVJZDogJ3NhbXBsZWlkJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQXR0cmlidXRlcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnU3RhY2snKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWxidjIuTmV0d29ya0xvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywge1xuICAgICAgdnBjLFxuICAgICAgY3Jvc3Nab25lRW5hYmxlZDogdHJ1ZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMb2FkQmFsYW5jZXInLCB7XG4gICAgICBMb2FkQmFsYW5jZXJBdHRyaWJ1dGVzOiBNYXRjaC5hcnJheVdpdGgoW1xuICAgICAgICB7XG4gICAgICAgICAgS2V5OiAnbG9hZF9iYWxhbmNpbmcuY3Jvc3Nfem9uZS5lbmFibGVkJyxcbiAgICAgICAgICBWYWx1ZTogJ3RydWUnLFxuICAgICAgICB9LFxuICAgICAgXSksXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0FjY2VzcyBsb2dnaW5nJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCB1bmRlZmluZWQsIHsgZW52OiB7IHJlZ2lvbjogJ3VzLWVhc3QtMScgfSB9KTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG4gICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0FjY2Vzc0xvZ2dpbmdCdWNrZXQnKTtcbiAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5OZXR3b3JrTG9hZEJhbGFuY2VyKHN0YWNrLCAnTEInLCB7IHZwYyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBsYi5sb2dBY2Nlc3NMb2dzKGJ1Y2tldCk7XG5cbiAgICAvLyBUSEVOXG5cbiAgICAvLyB2ZXJpZnkgdGhhdCB0aGUgTEIgYXR0cmlidXRlcyByZWZlcmVuY2UgdGhlIGJ1Y2tldFxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OkxvYWRCYWxhbmNlcicsIHtcbiAgICAgIExvYWRCYWxhbmNlckF0dHJpYnV0ZXM6IE1hdGNoLmFycmF5V2l0aChbXG4gICAgICAgIHtcbiAgICAgICAgICBLZXk6ICdhY2Nlc3NfbG9ncy5zMy5lbmFibGVkJyxcbiAgICAgICAgICBWYWx1ZTogJ3RydWUnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgS2V5OiAnYWNjZXNzX2xvZ3MuczMuYnVja2V0JyxcbiAgICAgICAgICBWYWx1ZTogeyBSZWY6ICdBY2Nlc3NMb2dnaW5nQnVja2V0QTZEODhGMjknIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBLZXk6ICdhY2Nlc3NfbG9ncy5zMy5wcmVmaXgnLFxuICAgICAgICAgIFZhbHVlOiAnJyxcbiAgICAgICAgfSxcbiAgICAgIF0pLFxuICAgIH0pO1xuXG4gICAgLy8gdmVyaWZ5IHRoZSBidWNrZXQgcG9saWN5IGFsbG93cyB0aGUgQUxCIHRvIHB1dCBvYmplY3RzIGluIHRoZSBidWNrZXRcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0UG9saWN5Jywge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdCcsXG4gICAgICAgICAgICAgICdzMzpQdXRPYmplY3RMZWdhbEhvbGQnLFxuICAgICAgICAgICAgICAnczM6UHV0T2JqZWN0UmV0ZW50aW9uJyxcbiAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdFRhZ2dpbmcnLFxuICAgICAgICAgICAgICAnczM6UHV0T2JqZWN0VmVyc2lvblRhZ2dpbmcnLFxuICAgICAgICAgICAgICAnczM6QWJvcnQqJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHsgQVdTOiB7ICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzppYW06OjEyNzMxMTkyMzAyMTpyb290J11dIH0gfSxcbiAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgW3sgJ0ZuOjpHZXRBdHQnOiBbJ0FjY2Vzc0xvZ2dpbmdCdWNrZXRBNkQ4OEYyOScsICdBcm4nXSB9LCAnL0FXU0xvZ3MvJyxcbiAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LCAnLyonXV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnczM6UHV0T2JqZWN0JyxcbiAgICAgICAgICAgIENvbmRpdGlvbjogeyBTdHJpbmdFcXVhbHM6IHsgJ3MzOngtYW16LWFjbCc6ICdidWNrZXQtb3duZXItZnVsbC1jb250cm9sJyB9IH0sXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHsgU2VydmljZTogJ2RlbGl2ZXJ5LmxvZ3MuYW1hem9uYXdzLmNvbScgfSxcbiAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgW3sgJ0ZuOjpHZXRBdHQnOiBbJ0FjY2Vzc0xvZ2dpbmdCdWNrZXRBNkQ4OEYyOScsICdBcm4nXSB9LCAnL0FXU0xvZ3MvJyxcbiAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LCAnLyonXV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnczM6R2V0QnVja2V0QWNsJyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFByaW5jaXBhbDogeyBTZXJ2aWNlOiAnZGVsaXZlcnkubG9ncy5hbWF6b25hd3MuY29tJyB9LFxuICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ0FjY2Vzc0xvZ2dpbmdCdWNrZXRBNkQ4OEYyOScsICdBcm4nXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyB2ZXJpZnkgdGhlIEFMQiBkZXBlbmRzIG9uIHRoZSBidWNrZXQgKmFuZCogdGhlIGJ1Y2tldCBwb2xpY3lcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OkxvYWRCYWxhbmNlcicsIHtcbiAgICAgIERlcGVuZHNPbjogWydBY2Nlc3NMb2dnaW5nQnVja2V0UG9saWN5NzAwRDdDQzYnLCAnQWNjZXNzTG9nZ2luZ0J1Y2tldEE2RDg4RjI5J10sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FjY2VzcyBsb2dnaW5nIHdpdGggcHJlZml4JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCB1bmRlZmluZWQsIHsgZW52OiB7IHJlZ2lvbjogJ3VzLWVhc3QtMScgfSB9KTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG4gICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0FjY2Vzc0xvZ2dpbmdCdWNrZXQnKTtcbiAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5OZXR3b3JrTG9hZEJhbGFuY2VyKHN0YWNrLCAnTEInLCB7IHZwYyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBsYi5sb2dBY2Nlc3NMb2dzKGJ1Y2tldCwgJ3ByZWZpeC1vZi1hY2Nlc3MtbG9ncycpO1xuXG4gICAgLy8gVEhFTlxuICAgIC8vIHZlcmlmeSB0aGF0IHRoZSBMQiBhdHRyaWJ1dGVzIHJlZmVyZW5jZSB0aGUgYnVja2V0XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TG9hZEJhbGFuY2VyJywge1xuICAgICAgTG9hZEJhbGFuY2VyQXR0cmlidXRlczogTWF0Y2guYXJyYXlXaXRoKFtcbiAgICAgICAge1xuICAgICAgICAgIEtleTogJ2FjY2Vzc19sb2dzLnMzLmVuYWJsZWQnLFxuICAgICAgICAgIFZhbHVlOiAndHJ1ZScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBLZXk6ICdhY2Nlc3NfbG9ncy5zMy5idWNrZXQnLFxuICAgICAgICAgIFZhbHVlOiB7IFJlZjogJ0FjY2Vzc0xvZ2dpbmdCdWNrZXRBNkQ4OEYyOScgfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIEtleTogJ2FjY2Vzc19sb2dzLnMzLnByZWZpeCcsXG4gICAgICAgICAgVmFsdWU6ICdwcmVmaXgtb2YtYWNjZXNzLWxvZ3MnLFxuICAgICAgICB9LFxuICAgICAgXSksXG4gICAgfSk7XG5cbiAgICAvLyB2ZXJpZnkgdGhlIGJ1Y2tldCBwb2xpY3kgYWxsb3dzIHRoZSBBTEIgdG8gcHV0IG9iamVjdHMgaW4gdGhlIGJ1Y2tldFxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlMzOjpCdWNrZXRQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAnczM6UHV0T2JqZWN0JyxcbiAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdExlZ2FsSG9sZCcsXG4gICAgICAgICAgICAgICdzMzpQdXRPYmplY3RSZXRlbnRpb24nLFxuICAgICAgICAgICAgICAnczM6UHV0T2JqZWN0VGFnZ2luZycsXG4gICAgICAgICAgICAgICdzMzpQdXRPYmplY3RWZXJzaW9uVGFnZ2luZycsXG4gICAgICAgICAgICAgICdzMzpBYm9ydConLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFByaW5jaXBhbDogeyBBV1M6IHsgJ0ZuOjpKb2luJzogWycnLCBbJ2FybjonLCB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LCAnOmlhbTo6MTI3MzExOTIzMDIxOnJvb3QnXV0gfSB9LFxuICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbeyAnRm46OkdldEF0dCc6IFsnQWNjZXNzTG9nZ2luZ0J1Y2tldEE2RDg4RjI5JywgJ0FybiddIH0sICcvcHJlZml4LW9mLWFjY2Vzcy1sb2dzL0FXU0xvZ3MvJyxcbiAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LCAnLyonXV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnczM6UHV0T2JqZWN0JyxcbiAgICAgICAgICAgIENvbmRpdGlvbjogeyBTdHJpbmdFcXVhbHM6IHsgJ3MzOngtYW16LWFjbCc6ICdidWNrZXQtb3duZXItZnVsbC1jb250cm9sJyB9IH0sXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHsgU2VydmljZTogJ2RlbGl2ZXJ5LmxvZ3MuYW1hem9uYXdzLmNvbScgfSxcbiAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgW3sgJ0ZuOjpHZXRBdHQnOiBbJ0FjY2Vzc0xvZ2dpbmdCdWNrZXRBNkQ4OEYyOScsICdBcm4nXSB9LCAnL3ByZWZpeC1vZi1hY2Nlc3MtbG9ncy9BV1NMb2dzLycsXG4gICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSwgJy8qJ11dLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ3MzOkdldEJ1Y2tldEFjbCcsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHsgU2VydmljZTogJ2RlbGl2ZXJ5LmxvZ3MuYW1hem9uYXdzLmNvbScgfSxcbiAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydBY2Nlc3NMb2dnaW5nQnVja2V0QTZEODhGMjknLCAnQXJuJ10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdsb2FkQmFsYW5jZXJOYW1lJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdTdGFjaycpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBlbGJ2Mi5OZXR3b3JrTG9hZEJhbGFuY2VyKHN0YWNrLCAnQUxCJywge1xuICAgICAgbG9hZEJhbGFuY2VyTmFtZTogJ215TG9hZEJhbGFuY2VyJyxcbiAgICAgIHZwYyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMb2FkQmFsYW5jZXInLCB7XG4gICAgICBOYW1lOiAnbXlMb2FkQmFsYW5jZXInLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdsb2FkQmFsYW5jZXJOYW1lIHVuYWxsb3dlZDogbW9yZSB0aGFuIDMyIGNoYXJhY3RlcnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHApO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnU3RhY2snKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWxidjIuTmV0d29ya0xvYWRCYWxhbmNlcihzdGFjaywgJ05MQicsIHtcbiAgICAgIGxvYWRCYWxhbmNlck5hbWU6ICdhJy5yZXBlYXQoMzMpLFxuICAgICAgdnBjLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBhcHAuc3ludGgoKTtcbiAgICB9KS50b1Rocm93KCdMb2FkIGJhbGFuY2VyIG5hbWU6IFwiYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhXCIgY2FuIGhhdmUgYSBtYXhpbXVtIG9mIDMyIGNoYXJhY3RlcnMuJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2xvYWRCYWxhbmNlck5hbWUgdW5hbGxvd2VkOiBzdGFydHMgd2l0aCBcImludGVybmFsLVwiJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVsYnYyLk5ldHdvcmtMb2FkQmFsYW5jZXIoc3RhY2ssICdOTEInLCB7XG4gICAgICBsb2FkQmFsYW5jZXJOYW1lOiAnaW50ZXJuYWwtbXlMb2FkQmFsYW5jZXInLFxuICAgICAgdnBjLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBhcHAuc3ludGgoKTtcbiAgICB9KS50b1Rocm93KCdMb2FkIGJhbGFuY2VyIG5hbWU6IFwiaW50ZXJuYWwtbXlMb2FkQmFsYW5jZXJcIiBtdXN0IG5vdCBiZWdpbiB3aXRoIFwiaW50ZXJuYWwtXCIuJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2xvYWRCYWxhbmNlck5hbWUgdW5hbGxvd2VkOiBzdGFydHMgd2l0aCBoeXBoZW4nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHApO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnU3RhY2snKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWxidjIuTmV0d29ya0xvYWRCYWxhbmNlcihzdGFjaywgJ05MQicsIHtcbiAgICAgIGxvYWRCYWxhbmNlck5hbWU6ICctbXlMb2FkQmFsYW5jZXInLFxuICAgICAgdnBjLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBhcHAuc3ludGgoKTtcbiAgICB9KS50b1Rocm93KCdMb2FkIGJhbGFuY2VyIG5hbWU6IFwiLW15TG9hZEJhbGFuY2VyXCIgbXVzdCBub3QgYmVnaW4gb3IgZW5kIHdpdGggYSBoeXBoZW4uJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2xvYWRCYWxhbmNlck5hbWUgdW5hbGxvd2VkOiBlbmRzIHdpdGggaHlwaGVuJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVsYnYyLk5ldHdvcmtMb2FkQmFsYW5jZXIoc3RhY2ssICdOTEInLCB7XG4gICAgICBsb2FkQmFsYW5jZXJOYW1lOiAnbXlMb2FkQmFsYW5jZXItJyxcbiAgICAgIHZwYyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgYXBwLnN5bnRoKCk7XG4gICAgfSkudG9UaHJvdygnTG9hZCBiYWxhbmNlciBuYW1lOiBcIm15TG9hZEJhbGFuY2VyLVwiIG11c3Qgbm90IGJlZ2luIG9yIGVuZCB3aXRoIGEgaHlwaGVuLicpO1xuICB9KTtcblxuICB0ZXN0KCdsb2FkQmFsYW5jZXJOYW1lIHVuYWxsb3dlZDogdW5hbGxvd2VkIGNoYXJhY3RlcnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHApO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnU3RhY2snKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWxidjIuTmV0d29ya0xvYWRCYWxhbmNlcihzdGFjaywgJ05MQicsIHtcbiAgICAgIGxvYWRCYWxhbmNlck5hbWU6ICdteSBsb2FkIGJhbGFuY2VyJyxcbiAgICAgIHZwYyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgYXBwLnN5bnRoKCk7XG4gICAgfSkudG9UaHJvdygnTG9hZCBiYWxhbmNlciBuYW1lOiBcIm15IGxvYWQgYmFsYW5jZXJcIiBtdXN0IGNvbnRhaW4gb25seSBhbHBoYW51bWVyaWMgY2hhcmFjdGVycyBvciBoeXBoZW5zLicpO1xuICB9KTtcblxuICB0ZXN0KCdpbXBvcnRlZCBuZXR3b3JrIGxvYWQgYmFsYW5jZXIgd2l0aCBubyB2cGMgc3BlY2lmaWVkIHRocm93cyBlcnJvciB3aGVuIGNhbGxpbmcgYWRkVGFyZ2V0cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IG5sYkFybiA9ICdhcm46YXdzOmVsYXN0aWNsb2FkYmFsYW5jaW5nOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6bG9hZGJhbGFuY2VyL2FwcC9teS1sb2FkLWJhbGFuY2VyLzUwZGM2YzQ5NWMwYzkxODgnO1xuICAgIGNvbnN0IG5sYiA9IGVsYnYyLk5ldHdvcmtMb2FkQmFsYW5jZXIuZnJvbU5ldHdvcmtMb2FkQmFsYW5jZXJBdHRyaWJ1dGVzKHN0YWNrLCAnTkxCJywge1xuICAgICAgbG9hZEJhbGFuY2VyQXJuOiBubGJBcm4sXG4gICAgfSk7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGxpc3RlbmVyID0gbmxiLmFkZExpc3RlbmVyKCdMaXN0ZW5lcicsIHsgcG9ydDogODAgfSk7XG4gICAgZXhwZWN0KCgpID0+IGxpc3RlbmVyLmFkZFRhcmdldHMoJ3RhcmdldGdyb3VwJywgeyBwb3J0OiA4MDgwIH0pKS50b1Rocm93KCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ltcG9ydGVkIG5ldHdvcmsgbG9hZCBiYWxhbmNlciB3aXRoIHZwYyBkb2VzIG5vdCB0aHJvdyBlcnJvciB3aGVuIGNhbGxpbmcgYWRkVGFyZ2V0cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVnBjJyk7XG4gICAgY29uc3QgbmxiQXJuID0gJ2Fybjphd3M6ZWxhc3RpY2xvYWRiYWxhbmNpbmc6dXMtd2VzdC0yOjEyMzQ1Njc4OTAxMjpsb2FkYmFsYW5jZXIvYXBwL215LWxvYWQtYmFsYW5jZXIvNTBkYzZjNDk1YzBjOTE4OCc7XG4gICAgY29uc3QgbmxiID0gZWxidjIuTmV0d29ya0xvYWRCYWxhbmNlci5mcm9tTmV0d29ya0xvYWRCYWxhbmNlckF0dHJpYnV0ZXMoc3RhY2ssICdOTEInLCB7XG4gICAgICBsb2FkQmFsYW5jZXJBcm46IG5sYkFybixcbiAgICAgIHZwYyxcbiAgICB9KTtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbGlzdGVuZXIgPSBubGIuYWRkTGlzdGVuZXIoJ0xpc3RlbmVyJywgeyBwb3J0OiA4MCB9KTtcbiAgICBleHBlY3QoKCkgPT4gbGlzdGVuZXIuYWRkVGFyZ2V0cygndGFyZ2V0Z3JvdXAnLCB7IHBvcnQ6IDgwODAgfSkpLm5vdC50b1Rocm93KCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ltcG9ydGVkIGxvYWQgYmFsYW5jZXIga25vd3MgaXRzIHJlZ2lvbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhbGJBcm4gPSAnYXJuOmF3czplbGFzdGljbG9hZGJhbGFuY2luZzp1cy13ZXN0LTI6MTIzNDU2Nzg5MDEyOmxvYWRiYWxhbmNlci9hcHAvbXktbG9hZC1iYWxhbmNlci81MGRjNmM0OTVjMGM5MTg4JztcbiAgICBjb25zdCBhbGIgPSBlbGJ2Mi5OZXR3b3JrTG9hZEJhbGFuY2VyLmZyb21OZXR3b3JrTG9hZEJhbGFuY2VyQXR0cmlidXRlcyhzdGFjaywgJ0FMQicsIHtcbiAgICAgIGxvYWRCYWxhbmNlckFybjogYWxiQXJuLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChhbGIuZW52LnJlZ2lvbikudG9FcXVhbCgndXMtd2VzdC0yJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ltcG9ydGVkIGxvYWQgYmFsYW5jZXIgY2FuIGhhdmUgbWV0cmljcycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhcm4gPSAnYXJuOmF3czplbGFzdGljbG9hZGJhbGFuY2luZzp1cy13ZXN0LTI6MTIzNDU2Nzg5MDEyOmxvYWRiYWxhbmNlci9uZXR3b3JrL215LWxvYWQtYmFsYW5jZXIvNTBkYzZjNDk1YzBjOTE4OCc7XG4gICAgY29uc3QgbmxiID0gZWxidjIuTmV0d29ya0xvYWRCYWxhbmNlci5mcm9tTmV0d29ya0xvYWRCYWxhbmNlckF0dHJpYnV0ZXMoc3RhY2ssICdOTEInLCB7XG4gICAgICBsb2FkQmFsYW5jZXJBcm46IGFybixcbiAgICB9KTtcblxuICAgIGNvbnN0IG1ldHJpYyA9IG5sYi5tZXRyaWNzLmN1c3RvbSgnTWV0cmljTmFtZScpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChtZXRyaWMubmFtZXNwYWNlKS50b0VxdWFsKCdBV1MvTmV0d29ya0VMQicpO1xuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKG1ldHJpYy5kaW1lbnNpb25zKSkudG9FcXVhbCh7XG4gICAgICBMb2FkQmFsYW5jZXI6ICduZXR3b3JrL215LWxvYWQtYmFsYW5jZXIvNTBkYzZjNDk1YzBjOTE4OCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ1RyaXZpYWwgY29uc3RydWN0aW9uOiBpbnRlcm5hbCB3aXRoIElzb2xhdGVkIHN1Ym5ldHMgb25seScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJywge1xuICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW3tcbiAgICAgICAgY2lkck1hc2s6IDIwLFxuICAgICAgICBuYW1lOiAnSXNvbGF0ZWQnLFxuICAgICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVELFxuICAgICAgfV0sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVsYnYyLk5ldHdvcmtMb2FkQmFsYW5jZXIoc3RhY2ssICdMQicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGludGVybmV0RmFjaW5nOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMb2FkQmFsYW5jZXInLCB7XG4gICAgICBTY2hlbWU6ICdpbnRlcm5hbCcsXG4gICAgICBTdWJuZXRzOiBbXG4gICAgICAgIHsgUmVmOiAnVlBDSXNvbGF0ZWRTdWJuZXQxU3VibmV0RUJEMDBGQzYnIH0sXG4gICAgICAgIHsgUmVmOiAnVlBDSXNvbGF0ZWRTdWJuZXQyU3VibmV0NEIxQzhDQUEnIH0sXG4gICAgICBdLFxuICAgICAgVHlwZTogJ25ldHdvcmsnLFxuICAgIH0pO1xuICB9KTtcbiAgdGVzdCgnSW50ZXJuYWwgd2l0aCBQdWJsaWMsIFByaXZhdGUsIGFuZCBJc29sYXRlZCBzdWJuZXRzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnLCB7XG4gICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbe1xuICAgICAgICBjaWRyTWFzazogMjQsXG4gICAgICAgIG5hbWU6ICdQdWJsaWMnLFxuICAgICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICB9LCB7XG4gICAgICAgIGNpZHJNYXNrOiAyNCxcbiAgICAgICAgbmFtZTogJ1ByaXZhdGUnLFxuICAgICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTLFxuICAgICAgfSwge1xuICAgICAgICBjaWRyTWFzazogMjgsXG4gICAgICAgIG5hbWU6ICdJc29sYXRlZCcsXG4gICAgICAgIHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURUQsXG4gICAgICB9XSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWxidjIuTmV0d29ya0xvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywge1xuICAgICAgdnBjLFxuICAgICAgaW50ZXJuZXRGYWNpbmc6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OkxvYWRCYWxhbmNlcicsIHtcbiAgICAgIFNjaGVtZTogJ2ludGVybmFsJyxcbiAgICAgIFN1Ym5ldHM6IFtcbiAgICAgICAgeyBSZWY6ICdWUENQcml2YXRlU3VibmV0MVN1Ym5ldDhCQ0ExMEUwJyB9LFxuICAgICAgICB7IFJlZjogJ1ZQQ1ByaXZhdGVTdWJuZXQyU3VibmV0Q0ZDREFBN0EnIH0sXG4gICAgICBdLFxuICAgICAgVHlwZTogJ25ldHdvcmsnLFxuICAgIH0pO1xuICB9KTtcbiAgdGVzdCgnSW50ZXJuZXQtZmFjaW5nIHdpdGggUHVibGljLCBQcml2YXRlLCBhbmQgSXNvbGF0ZWQgc3VibmV0cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJywge1xuICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW3tcbiAgICAgICAgY2lkck1hc2s6IDI0LFxuICAgICAgICBuYW1lOiAnUHVibGljJyxcbiAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgfSwge1xuICAgICAgICBjaWRyTWFzazogMjQsXG4gICAgICAgIG5hbWU6ICdQcml2YXRlJyxcbiAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUyxcbiAgICAgIH0sIHtcbiAgICAgICAgY2lkck1hc2s6IDI4LFxuICAgICAgICBuYW1lOiAnSXNvbGF0ZWQnLFxuICAgICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVELFxuICAgICAgfV0sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVsYnYyLk5ldHdvcmtMb2FkQmFsYW5jZXIoc3RhY2ssICdMQicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGludGVybmV0RmFjaW5nOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OkxvYWRCYWxhbmNlcicsIHtcbiAgICAgIFNjaGVtZTogJ2ludGVybmV0LWZhY2luZycsXG4gICAgICBTdWJuZXRzOiBbXG4gICAgICAgIHsgUmVmOiAnVlBDUHVibGljU3VibmV0MVN1Ym5ldEI0MjQ2RDMwJyB9LFxuICAgICAgICB7IFJlZjogJ1ZQQ1B1YmxpY1N1Ym5ldDJTdWJuZXQ3NDE3OUYzOScgfSxcbiAgICAgIF0sXG4gICAgICBUeXBlOiAnbmV0d29yaycsXG4gICAgfSk7XG4gIH0pO1xuICB0ZXN0KCdJbnRlcm5hbCBsb2FkIGJhbGFuY2VyIHN1cHBseWluZyBwdWJsaWMgc3VibmV0cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVsYnYyLk5ldHdvcmtMb2FkQmFsYW5jZXIoc3RhY2ssICdMQicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGludGVybmV0RmFjaW5nOiBmYWxzZSxcbiAgICAgIHZwY1N1Ym5ldHM6IHsgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFVCTElDIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TG9hZEJhbGFuY2VyJywge1xuICAgICAgU2NoZW1lOiAnaW50ZXJuYWwnLFxuICAgICAgU3VibmV0czogW1xuICAgICAgICB7IFJlZjogJ1ZQQ1B1YmxpY1N1Ym5ldDFTdWJuZXRCNDI0NkQzMCcgfSxcbiAgICAgICAgeyBSZWY6ICdWUENQdWJsaWNTdWJuZXQyU3VibmV0NzQxNzlGMzknIH0sXG4gICAgICBdLFxuICAgICAgVHlwZTogJ25ldHdvcmsnLFxuICAgIH0pO1xuICB9KTtcbiAgdGVzdCgnSW50ZXJuYWwgbG9hZCBiYWxhbmNlciBzdXBwbHlpbmcgaXNvbGF0ZWQgc3VibmV0cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJywge1xuICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW3tcbiAgICAgICAgY2lkck1hc2s6IDI0LFxuICAgICAgICBuYW1lOiAnUHVibGljJyxcbiAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgfSwge1xuICAgICAgICBjaWRyTWFzazogMjQsXG4gICAgICAgIG5hbWU6ICdQcml2YXRlJyxcbiAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUyxcbiAgICAgIH0sIHtcbiAgICAgICAgY2lkck1hc2s6IDI4LFxuICAgICAgICBuYW1lOiAnSXNvbGF0ZWQnLFxuICAgICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVELFxuICAgICAgfV0sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVsYnYyLk5ldHdvcmtMb2FkQmFsYW5jZXIoc3RhY2ssICdMQicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGludGVybmV0RmFjaW5nOiBmYWxzZSxcbiAgICAgIHZwY1N1Ym5ldHM6IHsgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFJJVkFURV9JU09MQVRFRCB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OkxvYWRCYWxhbmNlcicsIHtcbiAgICAgIFNjaGVtZTogJ2ludGVybmFsJyxcbiAgICAgIFN1Ym5ldHM6IFtcbiAgICAgICAgeyBSZWY6ICdWUENJc29sYXRlZFN1Ym5ldDFTdWJuZXRFQkQwMEZDNicgfSxcbiAgICAgICAgeyBSZWY6ICdWUENJc29sYXRlZFN1Ym5ldDJTdWJuZXQ0QjFDOENBQScgfSxcbiAgICAgIF0sXG4gICAgICBUeXBlOiAnbmV0d29yaycsXG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdsb29rdXAnLCAoKSA9PiB7XG4gICAgdGVzdCgnQ2FuIGxvb2sgdXAgYSBOZXR3b3JrTG9hZEJhbGFuY2VyJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnc3RhY2snLCB7XG4gICAgICAgIGVudjoge1xuICAgICAgICAgIGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLFxuICAgICAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMicsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgbG9hZEJhbGFuY2VyID0gZWxidjIuTmV0d29ya0xvYWRCYWxhbmNlci5mcm9tTG9va3VwKHN0YWNrLCAnYScsIHtcbiAgICAgICAgbG9hZEJhbGFuY2VyVGFnczoge1xuICAgICAgICAgIHNvbWU6ICd0YWcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Ok5ldHdvcmtMb2FkQmFsYW5jZXInLCAwKTtcbiAgICAgIGV4cGVjdChsb2FkQmFsYW5jZXIubG9hZEJhbGFuY2VyQXJuKS50b0VxdWFsKCdhcm46YXdzOmVsYXN0aWNsb2FkYmFsYW5jaW5nOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6bG9hZGJhbGFuY2VyL25ldHdvcmsvbXktbG9hZC1iYWxhbmNlci81MGRjNmM0OTVjMGM5MTg4Jyk7XG4gICAgICBleHBlY3QobG9hZEJhbGFuY2VyLmxvYWRCYWxhbmNlckNhbm9uaWNhbEhvc3RlZFpvbmVJZCkudG9FcXVhbCgnWjNEWlhFMEVYQU1QTEUnKTtcbiAgICAgIGV4cGVjdChsb2FkQmFsYW5jZXIubG9hZEJhbGFuY2VyRG5zTmFtZSkudG9FcXVhbCgnbXktbG9hZC1iYWxhbmNlci0xMjM0NTY3ODkwLnVzLXdlc3QtMi5lbGIuYW1hem9uYXdzLmNvbScpO1xuICAgICAgZXhwZWN0KGxvYWRCYWxhbmNlci5lbnYucmVnaW9uKS50b0VxdWFsKCd1cy13ZXN0LTInKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ0NhbiBhZGQgbGlzdGVuZXJzIHRvIGEgbG9va2VkLXVwIE5ldHdvcmtMb2FkQmFsYW5jZXInLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdzdGFjaycsIHtcbiAgICAgICAgZW52OiB7XG4gICAgICAgICAgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsXG4gICAgICAgICAgcmVnaW9uOiAndXMtd2VzdC0yJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBsb2FkQmFsYW5jZXIgPSBlbGJ2Mi5OZXR3b3JrTG9hZEJhbGFuY2VyLmZyb21Mb29rdXAoc3RhY2ssICdhJywge1xuICAgICAgICBsb2FkQmFsYW5jZXJUYWdzOiB7XG4gICAgICAgICAgc29tZTogJ3RhZycsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgdGFyZ2V0R3JvdXAgPSBuZXcgZWxidjIuTmV0d29ya1RhcmdldEdyb3VwKHN0YWNrLCAndGcnLCB7XG4gICAgICAgIHZwYzogbG9hZEJhbGFuY2VyLnZwYyxcbiAgICAgICAgcG9ydDogMzAwMCxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBsb2FkQmFsYW5jZXIuYWRkTGlzdGVuZXIoJ2xpc3RlbmVyJywge1xuICAgICAgICBwcm90b2NvbDogZWxidjIuUHJvdG9jb2wuVENQX1VEUCxcbiAgICAgICAgcG9ydDogMzAwMCxcbiAgICAgICAgZGVmYXVsdEFjdGlvbjogZWxidjIuTmV0d29ya0xpc3RlbmVyQWN0aW9uLmZvcndhcmQoW3RhcmdldEdyb3VwXSksXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TmV0d29ya0xvYWRCYWxhbmNlcicsIDApO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TGlzdGVuZXInLCAxKTtcbiAgICB9KTtcbiAgICB0ZXN0KCdDYW4gY3JlYXRlIG1ldHJpY3MgZnJvbSBhIGxvb2tlZC11cCBOZXR3b3JrTG9hZEJhbGFuY2VyJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnc3RhY2snLCB7XG4gICAgICAgIGVudjoge1xuICAgICAgICAgIGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLFxuICAgICAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMicsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgbG9hZEJhbGFuY2VyID0gZWxidjIuTmV0d29ya0xvYWRCYWxhbmNlci5mcm9tTG9va3VwKHN0YWNrLCAnYScsIHtcbiAgICAgICAgbG9hZEJhbGFuY2VyVGFnczoge1xuICAgICAgICAgIHNvbWU6ICd0YWcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IG1ldHJpYyA9IGxvYWRCYWxhbmNlci5tZXRyaWNzLmN1c3RvbSgnTWV0cmljTmFtZScpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QobWV0cmljLm5hbWVzcGFjZSkudG9FcXVhbCgnQVdTL05ldHdvcmtFTEInKTtcbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKG1ldHJpYy5kaW1lbnNpb25zKSkudG9FcXVhbCh7XG4gICAgICAgIExvYWRCYWxhbmNlcjogJ25ldHdvcmsvbXktbG9hZC1iYWxhbmNlci81MGRjNmM0OTVjMGM5MTg4JyxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19