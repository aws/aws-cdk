"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const ec2 = require("@aws-cdk/aws-ec2");
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/core");
const elbv2 = require("../../lib");
describe('tests', () => {
    test('Trivial construction: internet facing', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        // WHEN
        new elbv2.ApplicationLoadBalancer(stack, 'LB', {
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
            Type: 'application',
        });
    });
    test('internet facing load balancer has dependency on IGW', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        // WHEN
        new elbv2.ApplicationLoadBalancer(stack, 'LB', {
            vpc,
            internetFacing: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
            DependsOn: [
                'StackPublicSubnet1DefaultRoute16154E3D',
                'StackPublicSubnet1RouteTableAssociation74F1C1B6',
                'StackPublicSubnet2DefaultRoute0319539B',
                'StackPublicSubnet2RouteTableAssociation5E8F73F1',
            ],
        });
    });
    test('Trivial construction: internal', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        // WHEN
        new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
            Scheme: 'internal',
            Subnets: [
                { Ref: 'StackPrivateSubnet1Subnet47AC2BC7' },
                { Ref: 'StackPrivateSubnet2SubnetA2F8EDD8' },
            ],
            Type: 'application',
        });
    });
    test('Attributes', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        // WHEN
        new elbv2.ApplicationLoadBalancer(stack, 'LB', {
            vpc,
            deletionProtection: true,
            http2Enabled: false,
            idleTimeout: cdk.Duration.seconds(1000),
            dropInvalidHeaderFields: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
            LoadBalancerAttributes: [
                {
                    Key: 'deletion_protection.enabled',
                    Value: 'true',
                },
                {
                    Key: 'routing.http2.enabled',
                    Value: 'false',
                },
                {
                    Key: 'idle_timeout.timeout_seconds',
                    Value: '1000',
                },
                {
                    Key: 'routing.http.drop_invalid_header_fields.enabled',
                    Value: 'true',
                },
            ],
        });
    });
    describe('Desync mitigation mode', () => {
        test('Defensive', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'Stack');
            // WHEN
            new elbv2.ApplicationLoadBalancer(stack, 'LB', {
                vpc,
                desyncMitigationMode: elbv2.DesyncMitigationMode.DEFENSIVE,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
                LoadBalancerAttributes: [
                    {
                        Key: 'deletion_protection.enabled',
                        Value: 'false',
                    },
                    {
                        Key: 'routing.http.desync_mitigation_mode',
                        Value: 'defensive',
                    },
                ],
            });
        });
        test('Monitor', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'Stack');
            // WHEN
            new elbv2.ApplicationLoadBalancer(stack, 'LB', {
                vpc,
                desyncMitigationMode: elbv2.DesyncMitigationMode.MONITOR,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
                LoadBalancerAttributes: [
                    {
                        Key: 'deletion_protection.enabled',
                        Value: 'false',
                    },
                    {
                        Key: 'routing.http.desync_mitigation_mode',
                        Value: 'monitor',
                    },
                ],
            });
        });
        test('Strictest', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'Stack');
            // WHEN
            new elbv2.ApplicationLoadBalancer(stack, 'LB', {
                vpc,
                desyncMitigationMode: elbv2.DesyncMitigationMode.STRICTEST,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
                LoadBalancerAttributes: [
                    {
                        Key: 'deletion_protection.enabled',
                        Value: 'false',
                    },
                    {
                        Key: 'routing.http.desync_mitigation_mode',
                        Value: 'strictest',
                    },
                ],
            });
        });
    });
    test('Deletion protection false', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        // WHEN
        new elbv2.ApplicationLoadBalancer(stack, 'LB', {
            vpc,
            deletionProtection: false,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
            LoadBalancerAttributes: assertions_1.Match.arrayWith([
                {
                    Key: 'deletion_protection.enabled',
                    Value: 'false',
                },
            ]),
        });
    });
    test('Can add and list listeners for an owned ApplicationLoadBalancer', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        // WHEN
        const loadBalancer = new elbv2.ApplicationLoadBalancer(stack, 'LB', {
            vpc,
            internetFacing: true,
        });
        const listener = loadBalancer.addListener('listener', {
            protocol: elbv2.ApplicationProtocol.HTTP,
            defaultAction: elbv2.ListenerAction.fixedResponse(200),
        });
        // THEN
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::ElasticLoadBalancingV2::Listener', 1);
        expect(loadBalancer.listeners).toContain(listener);
    });
    describe('logAccessLogs', () => {
        function loggingSetup() {
            const app = new cdk.App();
            const stack = new cdk.Stack(app, undefined, { env: { region: 'us-east-1' } });
            const vpc = new ec2.Vpc(stack, 'Stack');
            const bucket = new s3.Bucket(stack, 'AccessLoggingBucket');
            const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
            return { stack, bucket, lb };
        }
        test('sets load balancer attributes', () => {
            // GIVEN
            const { stack, bucket, lb } = loggingSetup();
            // WHEN
            lb.logAccessLogs(bucket);
            //THEN
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
        });
        test('adds a dependency on the bucket', () => {
            // GIVEN
            const { stack, bucket, lb } = loggingSetup();
            // WHEN
            lb.logAccessLogs(bucket);
            // THEN
            // verify the ALB depends on the bucket *and* the bucket policy
            assertions_1.Template.fromStack(stack).hasResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
                DependsOn: ['AccessLoggingBucketPolicy700D7CC6', 'AccessLoggingBucketA6D88F29'],
            });
        });
        test('logging bucket permissions', () => {
            // GIVEN
            const { stack, bucket, lb } = loggingSetup();
            // WHEN
            lb.logAccessLogs(bucket);
            // THEN
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
                            Effect: 'Allow',
                            Principal: { Service: 'delivery.logs.amazonaws.com' },
                            Resource: {
                                'Fn::Join': ['', [{ 'Fn::GetAtt': ['AccessLoggingBucketA6D88F29', 'Arn'] }, '/AWSLogs/',
                                        { Ref: 'AWS::AccountId' }, '/*']],
                            },
                            Condition: { StringEquals: { 's3:x-amz-acl': 'bucket-owner-full-control' } },
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
        test('access logging with prefix', () => {
            // GIVEN
            const { stack, bucket, lb } = loggingSetup();
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
                            Effect: 'Allow',
                            Principal: { Service: 'delivery.logs.amazonaws.com' },
                            Resource: {
                                'Fn::Join': ['', [{ 'Fn::GetAtt': ['AccessLoggingBucketA6D88F29', 'Arn'] }, '/prefix-of-access-logs/AWSLogs/',
                                        { Ref: 'AWS::AccountId' }, '/*']],
                            },
                            Condition: { StringEquals: { 's3:x-amz-acl': 'bucket-owner-full-control' } },
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
    });
    test('Exercise metrics', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
        // WHEN
        const metrics = new Array();
        metrics.push(lb.metrics.activeConnectionCount());
        metrics.push(lb.metrics.clientTlsNegotiationErrorCount());
        metrics.push(lb.metrics.consumedLCUs());
        metrics.push(lb.metrics.elbAuthError());
        metrics.push(lb.metrics.elbAuthFailure());
        metrics.push(lb.metrics.elbAuthLatency());
        metrics.push(lb.metrics.elbAuthSuccess());
        metrics.push(lb.metrics.httpCodeElb(elbv2.HttpCodeElb.ELB_3XX_COUNT));
        metrics.push(lb.metrics.httpCodeTarget(elbv2.HttpCodeTarget.TARGET_3XX_COUNT));
        metrics.push(lb.metrics.httpFixedResponseCount());
        metrics.push(lb.metrics.httpRedirectCount());
        metrics.push(lb.metrics.httpRedirectUrlLimitExceededCount());
        metrics.push(lb.metrics.ipv6ProcessedBytes());
        metrics.push(lb.metrics.ipv6RequestCount());
        metrics.push(lb.metrics.newConnectionCount());
        metrics.push(lb.metrics.processedBytes());
        metrics.push(lb.metrics.rejectedConnectionCount());
        metrics.push(lb.metrics.requestCount());
        metrics.push(lb.metrics.ruleEvaluations());
        metrics.push(lb.metrics.targetConnectionErrorCount());
        metrics.push(lb.metrics.targetResponseTime());
        metrics.push(lb.metrics.targetTLSNegotiationErrorCount());
        for (const metric of metrics) {
            expect(metric.namespace).toEqual('AWS/ApplicationELB');
            expect(stack.resolve(metric.dimensions)).toEqual({
                LoadBalancer: { 'Fn::GetAtt': ['LB8A12904C', 'LoadBalancerFullName'] },
            });
        }
    });
    test('loadBalancerName', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        // WHEN
        new elbv2.ApplicationLoadBalancer(stack, 'ALB', {
            loadBalancerName: 'myLoadBalancer',
            vpc,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
            Name: 'myLoadBalancer',
        });
    });
    test('imported load balancer with no vpc throws error when calling addTargets', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Vpc');
        const albArn = 'arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/app/my-load-balancer/50dc6c495c0c9188';
        const sg = new ec2.SecurityGroup(stack, 'sg', {
            vpc,
            securityGroupName: 'mySg',
        });
        const alb = elbv2.ApplicationLoadBalancer.fromApplicationLoadBalancerAttributes(stack, 'ALB', {
            loadBalancerArn: albArn,
            securityGroupId: sg.securityGroupId,
        });
        // WHEN
        const listener = alb.addListener('Listener', { port: 80 });
        expect(() => listener.addTargets('Targets', { port: 8080 })).toThrow();
    });
    test('imported load balancer with vpc does not throw error when calling addTargets', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Vpc');
        const albArn = 'arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/app/my-load-balancer/50dc6c495c0c9188';
        const sg = new ec2.SecurityGroup(stack, 'sg', {
            vpc,
            securityGroupName: 'mySg',
        });
        const alb = elbv2.ApplicationLoadBalancer.fromApplicationLoadBalancerAttributes(stack, 'ALB', {
            loadBalancerArn: albArn,
            securityGroupId: sg.securityGroupId,
            vpc,
        });
        // WHEN
        const listener = alb.addListener('Listener', { port: 80 });
        expect(() => listener.addTargets('Targets', { port: 8080 })).not.toThrow();
    });
    test('imported load balancer with vpc can add but not list listeners', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Vpc');
        const albArn = 'arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/app/my-load-balancer/50dc6c495c0c9188';
        const sg = new ec2.SecurityGroup(stack, 'sg', {
            vpc,
            securityGroupName: 'mySg',
        });
        const alb = elbv2.ApplicationLoadBalancer.fromApplicationLoadBalancerAttributes(stack, 'ALB', {
            loadBalancerArn: albArn,
            securityGroupId: sg.securityGroupId,
            vpc,
        });
        // WHEN
        const listener = alb.addListener('Listener', { port: 80 });
        listener.addTargets('Targets', { port: 8080 });
        // THEN
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::ElasticLoadBalancingV2::Listener', 1);
        expect(() => alb.listeners).toThrow();
    });
    test('imported load balancer knows its region', () => {
        const stack = new cdk.Stack();
        // WHEN
        const albArn = 'arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/app/my-load-balancer/50dc6c495c0c9188';
        const alb = elbv2.ApplicationLoadBalancer.fromApplicationLoadBalancerAttributes(stack, 'ALB', {
            loadBalancerArn: albArn,
            securityGroupId: 'sg-1234',
        });
        // THEN
        expect(alb.env.region).toEqual('us-west-2');
    });
    test('imported load balancer can produce metrics', () => {
        const stack = new cdk.Stack();
        // WHEN
        const albArn = 'arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/app/my-load-balancer/50dc6c495c0c9188';
        const alb = elbv2.ApplicationLoadBalancer.fromApplicationLoadBalancerAttributes(stack, 'ALB', {
            loadBalancerArn: albArn,
            securityGroupId: 'sg-1234',
        });
        // THEN
        const metric = alb.metrics.activeConnectionCount();
        expect(metric.namespace).toEqual('AWS/ApplicationELB');
        expect(stack.resolve(metric.dimensions)).toEqual({
            LoadBalancer: 'app/my-load-balancer/50dc6c495c0c9188',
        });
        expect(alb.env.region).toEqual('us-west-2');
    });
    test('can add secondary security groups', () => {
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const alb = new elbv2.ApplicationLoadBalancer(stack, 'LB', {
            vpc,
            securityGroup: new ec2.SecurityGroup(stack, 'SecurityGroup1', { vpc }),
        });
        alb.addSecurityGroup(new ec2.SecurityGroup(stack, 'SecurityGroup2', { vpc }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
            SecurityGroups: [
                { 'Fn::GetAtt': ['SecurityGroup1F554B36F', 'GroupId'] },
                { 'Fn::GetAtt': ['SecurityGroup23BE86BB7', 'GroupId'] },
            ],
            Type: 'application',
        });
    });
    describe('lookup', () => {
        test('Can look up an ApplicationLoadBalancer', () => {
            // GIVEN
            const app = new cdk.App();
            const stack = new cdk.Stack(app, 'stack', {
                env: {
                    account: '123456789012',
                    region: 'us-west-2',
                },
            });
            // WHEN
            const loadBalancer = elbv2.ApplicationLoadBalancer.fromLookup(stack, 'a', {
                loadBalancerTags: {
                    some: 'tag',
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::ElasticLoadBalancingV2::ApplicationLoadBalancer', 0);
            expect(loadBalancer.loadBalancerArn).toEqual('arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/application/my-load-balancer/50dc6c495c0c9188');
            expect(loadBalancer.loadBalancerCanonicalHostedZoneId).toEqual('Z3DZXE0EXAMPLE');
            expect(loadBalancer.loadBalancerDnsName).toEqual('my-load-balancer-1234567890.us-west-2.elb.amazonaws.com');
            expect(loadBalancer.ipAddressType).toEqual(elbv2.IpAddressType.DUAL_STACK);
            expect(loadBalancer.connections.securityGroups[0].securityGroupId).toEqual('sg-12345678');
            expect(loadBalancer.env.region).toEqual('us-west-2');
        });
        test('Can add but not list listeners for a looked-up ApplicationLoadBalancer', () => {
            // GIVEN
            const app = new cdk.App();
            const stack = new cdk.Stack(app, 'stack', {
                env: {
                    account: '123456789012',
                    region: 'us-west-2',
                },
            });
            const loadBalancer = elbv2.ApplicationLoadBalancer.fromLookup(stack, 'a', {
                loadBalancerTags: {
                    some: 'tag',
                },
            });
            // WHEN
            loadBalancer.addListener('listener', {
                protocol: elbv2.ApplicationProtocol.HTTP,
                defaultAction: elbv2.ListenerAction.fixedResponse(200),
            });
            // THEN
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::ElasticLoadBalancingV2::Listener', 1);
            expect(() => loadBalancer.listeners).toThrow();
        });
        test('Can create metrics for a looked-up ApplicationLoadBalancer', () => {
            // GIVEN
            const app = new cdk.App();
            const stack = new cdk.Stack(app, 'stack', {
                env: {
                    account: '123456789012',
                    region: 'us-west-2',
                },
            });
            const loadBalancer = elbv2.ApplicationLoadBalancer.fromLookup(stack, 'a', {
                loadBalancerTags: {
                    some: 'tag',
                },
            });
            // WHEN
            const metric = loadBalancer.metrics.activeConnectionCount();
            // THEN
            expect(metric.namespace).toEqual('AWS/ApplicationELB');
            expect(stack.resolve(metric.dimensions)).toEqual({
                LoadBalancer: 'application/my-load-balancer/50dc6c495c0c9188',
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZC1iYWxhbmNlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9hZC1iYWxhbmNlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQXNEO0FBRXRELHdDQUF3QztBQUN4QyxzQ0FBc0M7QUFDdEMscUNBQXFDO0FBQ3JDLG1DQUFtQztBQUduQyxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtJQUNyQixJQUFJLENBQUMsdUNBQXVDLEVBQUUsR0FBRyxFQUFFO1FBQ2pELFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM5QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXhDLE9BQU87UUFDUCxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO1lBQzdDLEdBQUc7WUFDSCxjQUFjLEVBQUUsSUFBSTtTQUNyQixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsMkNBQTJDLEVBQUU7WUFDM0YsTUFBTSxFQUFFLGlCQUFpQjtZQUN6QixPQUFPLEVBQUU7Z0JBQ1AsRUFBRSxHQUFHLEVBQUUsa0NBQWtDLEVBQUU7Z0JBQzNDLEVBQUUsR0FBRyxFQUFFLGtDQUFrQyxFQUFFO2FBQzVDO1lBQ0QsSUFBSSxFQUFFLGFBQWE7U0FDcEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMscURBQXFELEVBQUUsR0FBRyxFQUFFO1FBQy9ELFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM5QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE9B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QUU7b0JBQ0gsT0FBTyxFQUFFLGNBQWM7b0JBQ3ZCLE1BQU0sRUFBRSxXQUFXO2lCQUNwQjthQUNGLENBQUMsQ0FBQztZQUVILE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRTtnQkFDeEUsZ0JBQWdCLEVBQUU7b0JBQ2hCLElBQUksRUFBRSxLQUFLO2lCQUNaO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLE1BQU0sTUFBTSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUU1RCxPQUFPO1lBQ1AsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUN2RCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQy9DLFlBQVksRUFBRSwrQ0FBK0M7YUFDOUQsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWF0Y2gsIFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBNZXRyaWMgfSBmcm9tICdAYXdzLWNkay9hd3MtY2xvdWR3YXRjaCc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgZWxidjIgZnJvbSAnLi4vLi4vbGliJztcblxuXG5kZXNjcmliZSgndGVzdHMnLCAoKSA9PiB7XG4gIHRlc3QoJ1RyaXZpYWwgY29uc3RydWN0aW9uOiBpbnRlcm5ldCBmYWNpbmcnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVsYnYyLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKHN0YWNrLCAnTEInLCB7XG4gICAgICB2cGMsXG4gICAgICBpbnRlcm5ldEZhY2luZzogdHJ1ZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMb2FkQmFsYW5jZXInLCB7XG4gICAgICBTY2hlbWU6ICdpbnRlcm5ldC1mYWNpbmcnLFxuICAgICAgU3VibmV0czogW1xuICAgICAgICB7IFJlZjogJ1N0YWNrUHVibGljU3VibmV0MVN1Ym5ldDBBRDgxRDIyJyB9LFxuICAgICAgICB7IFJlZjogJ1N0YWNrUHVibGljU3VibmV0MlN1Ym5ldDNDN0QyMjg4JyB9LFxuICAgICAgXSxcbiAgICAgIFR5cGU6ICdhcHBsaWNhdGlvbicsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ludGVybmV0IGZhY2luZyBsb2FkIGJhbGFuY2VyIGhhcyBkZXBlbmRlbmN5IG9uIElHVycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnU3RhY2snKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWxidjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc3RhY2ssICdMQicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGludGVybmV0RmFjaW5nOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TG9hZEJhbGFuY2VyJywge1xuICAgICAgRGVwZW5kc09uOiBbXG4gICAgICAgICdTdGFja1B1YmxpY1N1Ym5ldDFEZWZhdWx0Um91dGUxNjE1NEUzRCcsXG4gICAgICAgICdTdGFja1B1YmxpY1N1Ym5ldDFSb3V0ZVRhYmxlQXNzb2NpYXRpb243NEYxQzFCNicsXG4gICAgICAgICdTdGFja1B1YmxpY1N1Ym5ldDJEZWZhdWx0Um91dGUwMzE5NTM5QicsXG4gICAgICAgICdTdGFja1B1YmxpY1N1Ym5ldDJSb3V0ZVRhYmxlQXNzb2NpYXRpb241RThGNzNGMScsXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdUcml2aWFsIGNvbnN0cnVjdGlvbjogaW50ZXJuYWwnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVsYnYyLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKHN0YWNrLCAnTEInLCB7IHZwYyB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMb2FkQmFsYW5jZXInLCB7XG4gICAgICBTY2hlbWU6ICdpbnRlcm5hbCcsXG4gICAgICBTdWJuZXRzOiBbXG4gICAgICAgIHsgUmVmOiAnU3RhY2tQcml2YXRlU3VibmV0MVN1Ym5ldDQ3QUMyQkM3JyB9LFxuICAgICAgICB7IFJlZjogJ1N0YWNrUHJpdmF0ZVN1Ym5ldDJTdWJuZXRBMkY4RUREOCcgfSxcbiAgICAgIF0sXG4gICAgICBUeXBlOiAnYXBwbGljYXRpb24nLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdBdHRyaWJ1dGVzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdTdGFjaycpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywge1xuICAgICAgdnBjLFxuICAgICAgZGVsZXRpb25Qcm90ZWN0aW9uOiB0cnVlLFxuICAgICAgaHR0cDJFbmFibGVkOiBmYWxzZSxcbiAgICAgIGlkbGVUaW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcygxMDAwKSxcbiAgICAgIGRyb3BJbnZhbGlkSGVhZGVyRmllbGRzOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OkxvYWRCYWxhbmNlcicsIHtcbiAgICAgIExvYWRCYWxhbmNlckF0dHJpYnV0ZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEtleTogJ2RlbGV0aW9uX3Byb3RlY3Rpb24uZW5hYmxlZCcsXG4gICAgICAgICAgVmFsdWU6ICd0cnVlJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIEtleTogJ3JvdXRpbmcuaHR0cDIuZW5hYmxlZCcsXG4gICAgICAgICAgVmFsdWU6ICdmYWxzZScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBLZXk6ICdpZGxlX3RpbWVvdXQudGltZW91dF9zZWNvbmRzJyxcbiAgICAgICAgICBWYWx1ZTogJzEwMDAnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgS2V5OiAncm91dGluZy5odHRwLmRyb3BfaW52YWxpZF9oZWFkZXJfZmllbGRzLmVuYWJsZWQnLFxuICAgICAgICAgIFZhbHVlOiAndHJ1ZScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnRGVzeW5jIG1pdGlnYXRpb24gbW9kZScsICgpID0+IHtcbiAgICB0ZXN0KCdEZWZlbnNpdmUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywge1xuICAgICAgICB2cGMsXG4gICAgICAgIGRlc3luY01pdGlnYXRpb25Nb2RlOiBlbGJ2Mi5EZXN5bmNNaXRpZ2F0aW9uTW9kZS5ERUZFTlNJVkUsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TG9hZEJhbGFuY2VyJywge1xuICAgICAgICBMb2FkQmFsYW5jZXJBdHRyaWJ1dGVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgS2V5OiAnZGVsZXRpb25fcHJvdGVjdGlvbi5lbmFibGVkJyxcbiAgICAgICAgICAgIFZhbHVlOiAnZmFsc2UnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgS2V5OiAncm91dGluZy5odHRwLmRlc3luY19taXRpZ2F0aW9uX21vZGUnLFxuICAgICAgICAgICAgVmFsdWU6ICdkZWZlbnNpdmUnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICB0ZXN0KCdNb25pdG9yJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdTdGFjaycpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgZWxidjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc3RhY2ssICdMQicsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBkZXN5bmNNaXRpZ2F0aW9uTW9kZTogZWxidjIuRGVzeW5jTWl0aWdhdGlvbk1vZGUuTU9OSVRPUixcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMb2FkQmFsYW5jZXInLCB7XG4gICAgICAgIExvYWRCYWxhbmNlckF0dHJpYnV0ZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBLZXk6ICdkZWxldGlvbl9wcm90ZWN0aW9uLmVuYWJsZWQnLFxuICAgICAgICAgICAgVmFsdWU6ICdmYWxzZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBLZXk6ICdyb3V0aW5nLmh0dHAuZGVzeW5jX21pdGlnYXRpb25fbW9kZScsXG4gICAgICAgICAgICBWYWx1ZTogJ21vbml0b3InLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICB0ZXN0KCdTdHJpY3Rlc3QnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywge1xuICAgICAgICB2cGMsXG4gICAgICAgIGRlc3luY01pdGlnYXRpb25Nb2RlOiBlbGJ2Mi5EZXN5bmNNaXRpZ2F0aW9uTW9kZS5TVFJJQ1RFU1QsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TG9hZEJhbGFuY2VyJywge1xuICAgICAgICBMb2FkQmFsYW5jZXJBdHRyaWJ1dGVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgS2V5OiAnZGVsZXRpb25fcHJvdGVjdGlvbi5lbmFibGVkJyxcbiAgICAgICAgICAgIFZhbHVlOiAnZmFsc2UnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgS2V5OiAncm91dGluZy5odHRwLmRlc3luY19taXRpZ2F0aW9uX21vZGUnLFxuICAgICAgICAgICAgVmFsdWU6ICdzdHJpY3Rlc3QnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnRGVsZXRpb24gcHJvdGVjdGlvbiBmYWxzZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnU3RhY2snKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWxidjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc3RhY2ssICdMQicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGRlbGV0aW9uUHJvdGVjdGlvbjogZmFsc2UsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TG9hZEJhbGFuY2VyJywge1xuICAgICAgTG9hZEJhbGFuY2VyQXR0cmlidXRlczogTWF0Y2guYXJyYXlXaXRoKFtcbiAgICAgICAge1xuICAgICAgICAgIEtleTogJ2RlbGV0aW9uX3Byb3RlY3Rpb24uZW5hYmxlZCcsXG4gICAgICAgICAgVmFsdWU6ICdmYWxzZScsXG4gICAgICAgIH0sXG4gICAgICBdKSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQ2FuIGFkZCBhbmQgbGlzdCBsaXN0ZW5lcnMgZm9yIGFuIG93bmVkIEFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdTdGFjaycpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGxvYWRCYWxhbmNlciA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywge1xuICAgICAgdnBjLFxuICAgICAgaW50ZXJuZXRGYWNpbmc6IHRydWUsXG4gICAgfSk7XG5cbiAgICBjb25zdCBsaXN0ZW5lciA9IGxvYWRCYWxhbmNlci5hZGRMaXN0ZW5lcignbGlzdGVuZXInLCB7XG4gICAgICBwcm90b2NvbDogZWxidjIuQXBwbGljYXRpb25Qcm90b2NvbC5IVFRQLFxuICAgICAgZGVmYXVsdEFjdGlvbjogZWxidjIuTGlzdGVuZXJBY3Rpb24uZml4ZWRSZXNwb25zZSgyMDApLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyJywgMSk7XG4gICAgZXhwZWN0KGxvYWRCYWxhbmNlci5saXN0ZW5lcnMpLnRvQ29udGFpbihsaXN0ZW5lcik7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdsb2dBY2Nlc3NMb2dzJywgKCkgPT4ge1xuXG4gICAgZnVuY3Rpb24gbG9nZ2luZ1NldHVwKCk6IHsgc3RhY2s6IGNkay5TdGFjaywgYnVja2V0OiBzMy5CdWNrZXQsIGxiOiBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlciB9IHtcbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCB1bmRlZmluZWQsIHsgZW52OiB7IHJlZ2lvbjogJ3VzLWVhc3QtMScgfSB9KTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnU3RhY2snKTtcbiAgICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdBY2Nlc3NMb2dnaW5nQnVja2V0Jyk7XG4gICAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywgeyB2cGMgfSk7XG4gICAgICByZXR1cm4geyBzdGFjaywgYnVja2V0LCBsYiB9O1xuICAgIH1cblxuICAgIHRlc3QoJ3NldHMgbG9hZCBiYWxhbmNlciBhdHRyaWJ1dGVzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHsgc3RhY2ssIGJ1Y2tldCwgbGIgfSA9IGxvZ2dpbmdTZXR1cCgpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBsYi5sb2dBY2Nlc3NMb2dzKGJ1Y2tldCk7XG5cbiAgICAgIC8vVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TG9hZEJhbGFuY2VyJywge1xuICAgICAgICBMb2FkQmFsYW5jZXJBdHRyaWJ1dGVzOiBNYXRjaC5hcnJheVdpdGgoW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEtleTogJ2FjY2Vzc19sb2dzLnMzLmVuYWJsZWQnLFxuICAgICAgICAgICAgVmFsdWU6ICd0cnVlJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIEtleTogJ2FjY2Vzc19sb2dzLnMzLmJ1Y2tldCcsXG4gICAgICAgICAgICBWYWx1ZTogeyBSZWY6ICdBY2Nlc3NMb2dnaW5nQnVja2V0QTZEODhGMjknIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBLZXk6ICdhY2Nlc3NfbG9ncy5zMy5wcmVmaXgnLFxuICAgICAgICAgICAgVmFsdWU6ICcnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0pLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhZGRzIGEgZGVwZW5kZW5jeSBvbiB0aGUgYnVja2V0JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHsgc3RhY2ssIGJ1Y2tldCwgbGIgfSA9IGxvZ2dpbmdTZXR1cCgpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBsYi5sb2dBY2Nlc3NMb2dzKGJ1Y2tldCk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIC8vIHZlcmlmeSB0aGUgQUxCIGRlcGVuZHMgb24gdGhlIGJ1Y2tldCAqYW5kKiB0aGUgYnVja2V0IHBvbGljeVxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMb2FkQmFsYW5jZXInLCB7XG4gICAgICAgIERlcGVuZHNPbjogWydBY2Nlc3NMb2dnaW5nQnVja2V0UG9saWN5NzAwRDdDQzYnLCAnQWNjZXNzTG9nZ2luZ0J1Y2tldEE2RDg4RjI5J10sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2xvZ2dpbmcgYnVja2V0IHBlcm1pc3Npb25zJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHsgc3RhY2ssIGJ1Y2tldCwgbGIgfSA9IGxvZ2dpbmdTZXR1cCgpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBsYi5sb2dBY2Nlc3NMb2dzKGJ1Y2tldCk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIC8vIHZlcmlmeSB0aGUgYnVja2V0IHBvbGljeSBhbGxvd3MgdGhlIEFMQiB0byBwdXQgb2JqZWN0cyBpbiB0aGUgYnVja2V0XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0UG9saWN5Jywge1xuICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdCcsXG4gICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdExlZ2FsSG9sZCcsXG4gICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdFJldGVudGlvbicsXG4gICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdFRhZ2dpbmcnLFxuICAgICAgICAgICAgICAgICdzMzpQdXRPYmplY3RWZXJzaW9uVGFnZ2luZycsXG4gICAgICAgICAgICAgICAgJ3MzOkFib3J0KicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUHJpbmNpcGFsOiB7IEFXUzogeyAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6aWFtOjoxMjczMTE5MjMwMjE6cm9vdCddXSB9IH0sXG4gICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbeyAnRm46OkdldEF0dCc6IFsnQWNjZXNzTG9nZ2luZ0J1Y2tldEE2RDg4RjI5JywgJ0FybiddIH0sICcvQVdTTG9ncy8nLFxuICAgICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSwgJy8qJ11dLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiAnczM6UHV0T2JqZWN0JyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBQcmluY2lwYWw6IHsgU2VydmljZTogJ2RlbGl2ZXJ5LmxvZ3MuYW1hem9uYXdzLmNvbScgfSxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFt7ICdGbjo6R2V0QXR0JzogWydBY2Nlc3NMb2dnaW5nQnVja2V0QTZEODhGMjknLCAnQXJuJ10gfSwgJy9BV1NMb2dzLycsXG4gICAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LCAnLyonXV0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIENvbmRpdGlvbjogeyBTdHJpbmdFcXVhbHM6IHsgJ3MzOngtYW16LWFjbCc6ICdidWNrZXQtb3duZXItZnVsbC1jb250cm9sJyB9IH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246ICdzMzpHZXRCdWNrZXRBY2wnLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFByaW5jaXBhbDogeyBTZXJ2aWNlOiAnZGVsaXZlcnkubG9ncy5hbWF6b25hd3MuY29tJyB9LFxuICAgICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydBY2Nlc3NMb2dnaW5nQnVja2V0QTZEODhGMjknLCAnQXJuJ10sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FjY2VzcyBsb2dnaW5nIHdpdGggcHJlZml4JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHsgc3RhY2ssIGJ1Y2tldCwgbGIgfSA9IGxvZ2dpbmdTZXR1cCgpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBsYi5sb2dBY2Nlc3NMb2dzKGJ1Y2tldCwgJ3ByZWZpeC1vZi1hY2Nlc3MtbG9ncycpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICAvLyB2ZXJpZnkgdGhhdCB0aGUgTEIgYXR0cmlidXRlcyByZWZlcmVuY2UgdGhlIGJ1Y2tldFxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TG9hZEJhbGFuY2VyJywge1xuICAgICAgICBMb2FkQmFsYW5jZXJBdHRyaWJ1dGVzOiBNYXRjaC5hcnJheVdpdGgoW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEtleTogJ2FjY2Vzc19sb2dzLnMzLmVuYWJsZWQnLFxuICAgICAgICAgICAgVmFsdWU6ICd0cnVlJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIEtleTogJ2FjY2Vzc19sb2dzLnMzLmJ1Y2tldCcsXG4gICAgICAgICAgICBWYWx1ZTogeyBSZWY6ICdBY2Nlc3NMb2dnaW5nQnVja2V0QTZEODhGMjknIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBLZXk6ICdhY2Nlc3NfbG9ncy5zMy5wcmVmaXgnLFxuICAgICAgICAgICAgVmFsdWU6ICdwcmVmaXgtb2YtYWNjZXNzLWxvZ3MnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0pLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIHZlcmlmeSB0aGUgYnVja2V0IHBvbGljeSBhbGxvd3MgdGhlIEFMQiB0byBwdXQgb2JqZWN0cyBpbiB0aGUgYnVja2V0XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0UG9saWN5Jywge1xuICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdCcsXG4gICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdExlZ2FsSG9sZCcsXG4gICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdFJldGVudGlvbicsXG4gICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdFRhZ2dpbmcnLFxuICAgICAgICAgICAgICAgICdzMzpQdXRPYmplY3RWZXJzaW9uVGFnZ2luZycsXG4gICAgICAgICAgICAgICAgJ3MzOkFib3J0KicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUHJpbmNpcGFsOiB7IEFXUzogeyAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6aWFtOjoxMjczMTE5MjMwMjE6cm9vdCddXSB9IH0sXG4gICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbeyAnRm46OkdldEF0dCc6IFsnQWNjZXNzTG9nZ2luZ0J1Y2tldEE2RDg4RjI5JywgJ0FybiddIH0sICcvcHJlZml4LW9mLWFjY2Vzcy1sb2dzL0FXU0xvZ3MvJyxcbiAgICAgICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sICcvKiddXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ3MzOlB1dE9iamVjdCcsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUHJpbmNpcGFsOiB7IFNlcnZpY2U6ICdkZWxpdmVyeS5sb2dzLmFtYXpvbmF3cy5jb20nIH0sXG4gICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbeyAnRm46OkdldEF0dCc6IFsnQWNjZXNzTG9nZ2luZ0J1Y2tldEE2RDg4RjI5JywgJ0FybiddIH0sICcvcHJlZml4LW9mLWFjY2Vzcy1sb2dzL0FXU0xvZ3MvJyxcbiAgICAgICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sICcvKiddXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgQ29uZGl0aW9uOiB7IFN0cmluZ0VxdWFsczogeyAnczM6eC1hbXotYWNsJzogJ2J1Y2tldC1vd25lci1mdWxsLWNvbnRyb2wnIH0gfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ3MzOkdldEJ1Y2tldEFjbCcsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUHJpbmNpcGFsOiB7IFNlcnZpY2U6ICdkZWxpdmVyeS5sb2dzLmFtYXpvbmF3cy5jb20nIH0sXG4gICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ0FjY2Vzc0xvZ2dpbmdCdWNrZXRBNkQ4OEYyOScsICdBcm4nXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdFeGVyY2lzZSBtZXRyaWNzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdTdGFjaycpO1xuICAgIGNvbnN0IGxiID0gbmV3IGVsYnYyLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKHN0YWNrLCAnTEInLCB7IHZwYyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBtZXRyaWNzID0gbmV3IEFycmF5PE1ldHJpYz4oKTtcbiAgICBtZXRyaWNzLnB1c2gobGIubWV0cmljcy5hY3RpdmVDb25uZWN0aW9uQ291bnQoKSk7XG4gICAgbWV0cmljcy5wdXNoKGxiLm1ldHJpY3MuY2xpZW50VGxzTmVnb3RpYXRpb25FcnJvckNvdW50KCkpO1xuICAgIG1ldHJpY3MucHVzaChsYi5tZXRyaWNzLmNvbnN1bWVkTENVcygpKTtcbiAgICBtZXRyaWNzLnB1c2gobGIubWV0cmljcy5lbGJBdXRoRXJyb3IoKSk7XG4gICAgbWV0cmljcy5wdXNoKGxiLm1ldHJpY3MuZWxiQXV0aEZhaWx1cmUoKSk7XG4gICAgbWV0cmljcy5wdXNoKGxiLm1ldHJpY3MuZWxiQXV0aExhdGVuY3koKSk7XG4gICAgbWV0cmljcy5wdXNoKGxiLm1ldHJpY3MuZWxiQXV0aFN1Y2Nlc3MoKSk7XG4gICAgbWV0cmljcy5wdXNoKGxiLm1ldHJpY3MuaHR0cENvZGVFbGIoZWxidjIuSHR0cENvZGVFbGIuRUxCXzNYWF9DT1VOVCkpO1xuICAgIG1ldHJpY3MucHVzaChsYi5tZXRyaWNzLmh0dHBDb2RlVGFyZ2V0KGVsYnYyLkh0dHBDb2RlVGFyZ2V0LlRBUkdFVF8zWFhfQ09VTlQpKTtcbiAgICBtZXRyaWNzLnB1c2gobGIubWV0cmljcy5odHRwRml4ZWRSZXNwb25zZUNvdW50KCkpO1xuICAgIG1ldHJpY3MucHVzaChsYi5tZXRyaWNzLmh0dHBSZWRpcmVjdENvdW50KCkpO1xuICAgIG1ldHJpY3MucHVzaChsYi5tZXRyaWNzLmh0dHBSZWRpcmVjdFVybExpbWl0RXhjZWVkZWRDb3VudCgpKTtcbiAgICBtZXRyaWNzLnB1c2gobGIubWV0cmljcy5pcHY2UHJvY2Vzc2VkQnl0ZXMoKSk7XG4gICAgbWV0cmljcy5wdXNoKGxiLm1ldHJpY3MuaXB2NlJlcXVlc3RDb3VudCgpKTtcbiAgICBtZXRyaWNzLnB1c2gobGIubWV0cmljcy5uZXdDb25uZWN0aW9uQ291bnQoKSk7XG4gICAgbWV0cmljcy5wdXNoKGxiLm1ldHJpY3MucHJvY2Vzc2VkQnl0ZXMoKSk7XG4gICAgbWV0cmljcy5wdXNoKGxiLm1ldHJpY3MucmVqZWN0ZWRDb25uZWN0aW9uQ291bnQoKSk7XG4gICAgbWV0cmljcy5wdXNoKGxiLm1ldHJpY3MucmVxdWVzdENvdW50KCkpO1xuICAgIG1ldHJpY3MucHVzaChsYi5tZXRyaWNzLnJ1bGVFdmFsdWF0aW9ucygpKTtcbiAgICBtZXRyaWNzLnB1c2gobGIubWV0cmljcy50YXJnZXRDb25uZWN0aW9uRXJyb3JDb3VudCgpKTtcbiAgICBtZXRyaWNzLnB1c2gobGIubWV0cmljcy50YXJnZXRSZXNwb25zZVRpbWUoKSk7XG4gICAgbWV0cmljcy5wdXNoKGxiLm1ldHJpY3MudGFyZ2V0VExTTmVnb3RpYXRpb25FcnJvckNvdW50KCkpO1xuXG4gICAgZm9yIChjb25zdCBtZXRyaWMgb2YgbWV0cmljcykge1xuICAgICAgZXhwZWN0KG1ldHJpYy5uYW1lc3BhY2UpLnRvRXF1YWwoJ0FXUy9BcHBsaWNhdGlvbkVMQicpO1xuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUobWV0cmljLmRpbWVuc2lvbnMpKS50b0VxdWFsKHtcbiAgICAgICAgTG9hZEJhbGFuY2VyOiB7ICdGbjo6R2V0QXR0JzogWydMQjhBMTI5MDRDJywgJ0xvYWRCYWxhbmNlckZ1bGxOYW1lJ10gfSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgdGVzdCgnbG9hZEJhbGFuY2VyTmFtZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnU3RhY2snKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWxidjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc3RhY2ssICdBTEInLCB7XG4gICAgICBsb2FkQmFsYW5jZXJOYW1lOiAnbXlMb2FkQmFsYW5jZXInLFxuICAgICAgdnBjLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OkxvYWRCYWxhbmNlcicsIHtcbiAgICAgIE5hbWU6ICdteUxvYWRCYWxhbmNlcicsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ltcG9ydGVkIGxvYWQgYmFsYW5jZXIgd2l0aCBubyB2cGMgdGhyb3dzIGVycm9yIHdoZW4gY2FsbGluZyBhZGRUYXJnZXRzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnKTtcbiAgICBjb25zdCBhbGJBcm4gPSAnYXJuOmF3czplbGFzdGljbG9hZGJhbGFuY2luZzp1cy13ZXN0LTI6MTIzNDU2Nzg5MDEyOmxvYWRiYWxhbmNlci9hcHAvbXktbG9hZC1iYWxhbmNlci81MGRjNmM0OTVjMGM5MTg4JztcbiAgICBjb25zdCBzZyA9IG5ldyBlYzIuU2VjdXJpdHlHcm91cChzdGFjaywgJ3NnJywge1xuICAgICAgdnBjLFxuICAgICAgc2VjdXJpdHlHcm91cE5hbWU6ICdteVNnJyxcbiAgICB9KTtcbiAgICBjb25zdCBhbGIgPSBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlci5mcm9tQXBwbGljYXRpb25Mb2FkQmFsYW5jZXJBdHRyaWJ1dGVzKHN0YWNrLCAnQUxCJywge1xuICAgICAgbG9hZEJhbGFuY2VyQXJuOiBhbGJBcm4sXG4gICAgICBzZWN1cml0eUdyb3VwSWQ6IHNnLnNlY3VyaXR5R3JvdXBJZCxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBsaXN0ZW5lciA9IGFsYi5hZGRMaXN0ZW5lcignTGlzdGVuZXInLCB7IHBvcnQ6IDgwIH0pO1xuICAgIGV4cGVjdCgoKSA9PiBsaXN0ZW5lci5hZGRUYXJnZXRzKCdUYXJnZXRzJywgeyBwb3J0OiA4MDgwIH0pKS50b1Rocm93KCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ltcG9ydGVkIGxvYWQgYmFsYW5jZXIgd2l0aCB2cGMgZG9lcyBub3QgdGhyb3cgZXJyb3Igd2hlbiBjYWxsaW5nIGFkZFRhcmdldHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZwYycpO1xuICAgIGNvbnN0IGFsYkFybiA9ICdhcm46YXdzOmVsYXN0aWNsb2FkYmFsYW5jaW5nOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6bG9hZGJhbGFuY2VyL2FwcC9teS1sb2FkLWJhbGFuY2VyLzUwZGM2YzQ5NWMwYzkxODgnO1xuICAgIGNvbnN0IHNnID0gbmV3IGVjMi5TZWN1cml0eUdyb3VwKHN0YWNrLCAnc2cnLCB7XG4gICAgICB2cGMsXG4gICAgICBzZWN1cml0eUdyb3VwTmFtZTogJ215U2cnLFxuICAgIH0pO1xuICAgIGNvbnN0IGFsYiA9IGVsYnYyLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyLmZyb21BcHBsaWNhdGlvbkxvYWRCYWxhbmNlckF0dHJpYnV0ZXMoc3RhY2ssICdBTEInLCB7XG4gICAgICBsb2FkQmFsYW5jZXJBcm46IGFsYkFybixcbiAgICAgIHNlY3VyaXR5R3JvdXBJZDogc2cuc2VjdXJpdHlHcm91cElkLFxuICAgICAgdnBjLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGxpc3RlbmVyID0gYWxiLmFkZExpc3RlbmVyKCdMaXN0ZW5lcicsIHsgcG9ydDogODAgfSk7XG4gICAgZXhwZWN0KCgpID0+IGxpc3RlbmVyLmFkZFRhcmdldHMoJ1RhcmdldHMnLCB7IHBvcnQ6IDgwODAgfSkpLm5vdC50b1Rocm93KCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ltcG9ydGVkIGxvYWQgYmFsYW5jZXIgd2l0aCB2cGMgY2FuIGFkZCBidXQgbm90IGxpc3QgbGlzdGVuZXJzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnKTtcbiAgICBjb25zdCBhbGJBcm4gPSAnYXJuOmF3czplbGFzdGljbG9hZGJhbGFuY2luZzp1cy13ZXN0LTI6MTIzNDU2Nzg5MDEyOmxvYWRiYWxhbmNlci9hcHAvbXktbG9hZC1iYWxhbmNlci81MGRjNmM0OTVjMGM5MTg4JztcbiAgICBjb25zdCBzZyA9IG5ldyBlYzIuU2VjdXJpdHlHcm91cChzdGFjaywgJ3NnJywge1xuICAgICAgdnBjLFxuICAgICAgc2VjdXJpdHlHcm91cE5hbWU6ICdteVNnJyxcbiAgICB9KTtcbiAgICBjb25zdCBhbGIgPSBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlci5mcm9tQXBwbGljYXRpb25Mb2FkQmFsYW5jZXJBdHRyaWJ1dGVzKHN0YWNrLCAnQUxCJywge1xuICAgICAgbG9hZEJhbGFuY2VyQXJuOiBhbGJBcm4sXG4gICAgICBzZWN1cml0eUdyb3VwSWQ6IHNnLnNlY3VyaXR5R3JvdXBJZCxcbiAgICAgIHZwYyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBsaXN0ZW5lciA9IGFsYi5hZGRMaXN0ZW5lcignTGlzdGVuZXInLCB7IHBvcnQ6IDgwIH0pO1xuICAgIGxpc3RlbmVyLmFkZFRhcmdldHMoJ1RhcmdldHMnLCB7IHBvcnQ6IDgwODAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TGlzdGVuZXInLCAxKTtcbiAgICBleHBlY3QoKCkgPT4gYWxiLmxpc3RlbmVycykudG9UaHJvdygpO1xuICB9KTtcblxuICB0ZXN0KCdpbXBvcnRlZCBsb2FkIGJhbGFuY2VyIGtub3dzIGl0cyByZWdpb24nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYWxiQXJuID0gJ2Fybjphd3M6ZWxhc3RpY2xvYWRiYWxhbmNpbmc6dXMtd2VzdC0yOjEyMzQ1Njc4OTAxMjpsb2FkYmFsYW5jZXIvYXBwL215LWxvYWQtYmFsYW5jZXIvNTBkYzZjNDk1YzBjOTE4OCc7XG4gICAgY29uc3QgYWxiID0gZWxidjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIuZnJvbUFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyQXR0cmlidXRlcyhzdGFjaywgJ0FMQicsIHtcbiAgICAgIGxvYWRCYWxhbmNlckFybjogYWxiQXJuLFxuICAgICAgc2VjdXJpdHlHcm91cElkOiAnc2ctMTIzNCcsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGFsYi5lbnYucmVnaW9uKS50b0VxdWFsKCd1cy13ZXN0LTInKTtcbiAgfSk7XG5cbiAgdGVzdCgnaW1wb3J0ZWQgbG9hZCBiYWxhbmNlciBjYW4gcHJvZHVjZSBtZXRyaWNzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFsYkFybiA9ICdhcm46YXdzOmVsYXN0aWNsb2FkYmFsYW5jaW5nOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6bG9hZGJhbGFuY2VyL2FwcC9teS1sb2FkLWJhbGFuY2VyLzUwZGM2YzQ5NWMwYzkxODgnO1xuICAgIGNvbnN0IGFsYiA9IGVsYnYyLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyLmZyb21BcHBsaWNhdGlvbkxvYWRCYWxhbmNlckF0dHJpYnV0ZXMoc3RhY2ssICdBTEInLCB7XG4gICAgICBsb2FkQmFsYW5jZXJBcm46IGFsYkFybixcbiAgICAgIHNlY3VyaXR5R3JvdXBJZDogJ3NnLTEyMzQnLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IG1ldHJpYyA9IGFsYi5tZXRyaWNzLmFjdGl2ZUNvbm5lY3Rpb25Db3VudCgpO1xuICAgIGV4cGVjdChtZXRyaWMubmFtZXNwYWNlKS50b0VxdWFsKCdBV1MvQXBwbGljYXRpb25FTEInKTtcbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShtZXRyaWMuZGltZW5zaW9ucykpLnRvRXF1YWwoe1xuICAgICAgTG9hZEJhbGFuY2VyOiAnYXBwL215LWxvYWQtYmFsYW5jZXIvNTBkYzZjNDk1YzBjOTE4OCcsXG4gICAgfSk7XG4gICAgZXhwZWN0KGFsYi5lbnYucmVnaW9uKS50b0VxdWFsKCd1cy13ZXN0LTInKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGFkZCBzZWNvbmRhcnkgc2VjdXJpdHkgZ3JvdXBzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnU3RhY2snKTtcblxuICAgIGNvbnN0IGFsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywge1xuICAgICAgdnBjLFxuICAgICAgc2VjdXJpdHlHcm91cDogbmV3IGVjMi5TZWN1cml0eUdyb3VwKHN0YWNrLCAnU2VjdXJpdHlHcm91cDEnLCB7IHZwYyB9KSxcbiAgICB9KTtcbiAgICBhbGIuYWRkU2VjdXJpdHlHcm91cChuZXcgZWMyLlNlY3VyaXR5R3JvdXAoc3RhY2ssICdTZWN1cml0eUdyb3VwMicsIHsgdnBjIH0pKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMb2FkQmFsYW5jZXInLCB7XG4gICAgICBTZWN1cml0eUdyb3VwczogW1xuICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydTZWN1cml0eUdyb3VwMUY1NTRCMzZGJywgJ0dyb3VwSWQnXSB9LFxuICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydTZWN1cml0eUdyb3VwMjNCRTg2QkI3JywgJ0dyb3VwSWQnXSB9LFxuICAgICAgXSxcbiAgICAgIFR5cGU6ICdhcHBsaWNhdGlvbicsXG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdsb29rdXAnLCAoKSA9PiB7XG4gICAgdGVzdCgnQ2FuIGxvb2sgdXAgYW4gQXBwbGljYXRpb25Mb2FkQmFsYW5jZXInLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdzdGFjaycsIHtcbiAgICAgICAgZW52OiB7XG4gICAgICAgICAgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsXG4gICAgICAgICAgcmVnaW9uOiAndXMtd2VzdC0yJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBsb2FkQmFsYW5jZXIgPSBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlci5mcm9tTG9va3VwKHN0YWNrLCAnYScsIHtcbiAgICAgICAgbG9hZEJhbGFuY2VyVGFnczoge1xuICAgICAgICAgIHNvbWU6ICd0YWcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyJywgMCk7XG4gICAgICBleHBlY3QobG9hZEJhbGFuY2VyLmxvYWRCYWxhbmNlckFybikudG9FcXVhbCgnYXJuOmF3czplbGFzdGljbG9hZGJhbGFuY2luZzp1cy13ZXN0LTI6MTIzNDU2Nzg5MDEyOmxvYWRiYWxhbmNlci9hcHBsaWNhdGlvbi9teS1sb2FkLWJhbGFuY2VyLzUwZGM2YzQ5NWMwYzkxODgnKTtcbiAgICAgIGV4cGVjdChsb2FkQmFsYW5jZXIubG9hZEJhbGFuY2VyQ2Fub25pY2FsSG9zdGVkWm9uZUlkKS50b0VxdWFsKCdaM0RaWEUwRVhBTVBMRScpO1xuICAgICAgZXhwZWN0KGxvYWRCYWxhbmNlci5sb2FkQmFsYW5jZXJEbnNOYW1lKS50b0VxdWFsKCdteS1sb2FkLWJhbGFuY2VyLTEyMzQ1Njc4OTAudXMtd2VzdC0yLmVsYi5hbWF6b25hd3MuY29tJyk7XG4gICAgICBleHBlY3QobG9hZEJhbGFuY2VyLmlwQWRkcmVzc1R5cGUpLnRvRXF1YWwoZWxidjIuSXBBZGRyZXNzVHlwZS5EVUFMX1NUQUNLKTtcbiAgICAgIGV4cGVjdChsb2FkQmFsYW5jZXIuY29ubmVjdGlvbnMuc2VjdXJpdHlHcm91cHNbMF0uc2VjdXJpdHlHcm91cElkKS50b0VxdWFsKCdzZy0xMjM0NTY3OCcpO1xuICAgICAgZXhwZWN0KGxvYWRCYWxhbmNlci5lbnYucmVnaW9uKS50b0VxdWFsKCd1cy13ZXN0LTInKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ0NhbiBhZGQgYnV0IG5vdCBsaXN0IGxpc3RlbmVycyBmb3IgYSBsb29rZWQtdXAgQXBwbGljYXRpb25Mb2FkQmFsYW5jZXInLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdzdGFjaycsIHtcbiAgICAgICAgZW52OiB7XG4gICAgICAgICAgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsXG4gICAgICAgICAgcmVnaW9uOiAndXMtd2VzdC0yJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBsb2FkQmFsYW5jZXIgPSBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlci5mcm9tTG9va3VwKHN0YWNrLCAnYScsIHtcbiAgICAgICAgbG9hZEJhbGFuY2VyVGFnczoge1xuICAgICAgICAgIHNvbWU6ICd0YWcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGxvYWRCYWxhbmNlci5hZGRMaXN0ZW5lcignbGlzdGVuZXInLCB7XG4gICAgICAgIHByb3RvY29sOiBlbGJ2Mi5BcHBsaWNhdGlvblByb3RvY29sLkhUVFAsXG4gICAgICAgIGRlZmF1bHRBY3Rpb246IGVsYnYyLkxpc3RlbmVyQWN0aW9uLmZpeGVkUmVzcG9uc2UoMjAwKSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lcicsIDEpO1xuICAgICAgZXhwZWN0KCgpID0+IGxvYWRCYWxhbmNlci5saXN0ZW5lcnMpLnRvVGhyb3coKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ0NhbiBjcmVhdGUgbWV0cmljcyBmb3IgYSBsb29rZWQtdXAgQXBwbGljYXRpb25Mb2FkQmFsYW5jZXInLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdzdGFjaycsIHtcbiAgICAgICAgZW52OiB7XG4gICAgICAgICAgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsXG4gICAgICAgICAgcmVnaW9uOiAndXMtd2VzdC0yJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBsb2FkQmFsYW5jZXIgPSBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlci5mcm9tTG9va3VwKHN0YWNrLCAnYScsIHtcbiAgICAgICAgbG9hZEJhbGFuY2VyVGFnczoge1xuICAgICAgICAgIHNvbWU6ICd0YWcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IG1ldHJpYyA9IGxvYWRCYWxhbmNlci5tZXRyaWNzLmFjdGl2ZUNvbm5lY3Rpb25Db3VudCgpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QobWV0cmljLm5hbWVzcGFjZSkudG9FcXVhbCgnQVdTL0FwcGxpY2F0aW9uRUxCJyk7XG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShtZXRyaWMuZGltZW5zaW9ucykpLnRvRXF1YWwoe1xuICAgICAgICBMb2FkQmFsYW5jZXI6ICdhcHBsaWNhdGlvbi9teS1sb2FkLWJhbGFuY2VyLzUwZGM2YzQ5NWMwYzkxODgnLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=