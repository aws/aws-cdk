"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const acm = require("@aws-cdk/aws-certificatemanager");
const ec2 = require("@aws-cdk/aws-ec2");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cdk = require("@aws-cdk/core");
const core_1 = require("@aws-cdk/core");
const elbv2 = require("../../lib");
const helpers_1 = require("../helpers");
describe('tests', () => {
    test('Listener guesses protocol from port', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
        // WHEN
        lb.addListener('Listener', {
            port: 443,
            certificates: [importedCertificate(stack)],
            defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 })],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
            Protocol: 'HTTPS',
        });
    });
    test('Listener guesses port from protocol', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
        // WHEN
        lb.addListener('Listener', {
            protocol: elbv2.ApplicationProtocol.HTTP,
            defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 })],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
            Port: 80,
        });
    });
    test('Listener default to open - IPv4', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const loadBalancer = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
        // WHEN
        loadBalancer.addListener('MyListener', {
            port: 80,
            defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 })],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
            SecurityGroupIngress: [
                {
                    Description: 'Allow from anyone on port 80',
                    CidrIp: '0.0.0.0/0',
                    FromPort: 80,
                    IpProtocol: 'tcp',
                    ToPort: 80,
                },
            ],
        });
    });
    test('Listener default to open - IPv4 and IPv6 (dual stack)', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const loadBalancer = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc, ipAddressType: elbv2.IpAddressType.DUAL_STACK });
        // WHEN
        loadBalancer.addListener('MyListener', {
            port: 80,
            defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 })],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
            SecurityGroupIngress: [
                {
                    Description: 'Allow from anyone on port 80',
                    CidrIp: '0.0.0.0/0',
                    FromPort: 80,
                    IpProtocol: 'tcp',
                    ToPort: 80,
                },
                {
                    Description: 'Allow from anyone on port 80',
                    CidrIpv6: '::/0',
                    FromPort: 80,
                    IpProtocol: 'tcp',
                    ToPort: 80,
                },
            ],
        });
    });
    test('HTTPS listener requires certificate', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
        // WHEN
        const listener = lb.addListener('Listener', {
            port: 443,
            defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 })],
        });
        // THEN
        const errors = listener.node.validate();
        expect(errors).toEqual(['HTTPS Listener needs at least one certificate (call addCertificates)']);
    });
    test('HTTPS listener can add certificate after construction', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
        // WHEN
        const listener = lb.addListener('Listener', {
            port: 443,
            defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 })],
        });
        listener.addCertificates('Certs', [importedCertificate(stack, 'cert')]);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
            Certificates: [
                { CertificateArn: 'cert' },
            ],
        });
    });
    test('HTTPS listener can add more than two certificates', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
        // WHEN
        const listener = lb.addListener('Listener', {
            port: 443,
            defaultTargetGroups: [
                new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 }),
            ],
            certificates: [
                elbv2.ListenerCertificate.fromArn('cert1'),
                elbv2.ListenerCertificate.fromArn('cert2'),
                elbv2.ListenerCertificate.fromArn('cert3'),
            ],
        });
        expect(listener.node.tryFindChild('DefaultCertificates1')).toBeDefined();
        expect(listener.node.tryFindChild('DefaultCertificates2')).toBeDefined();
        expect(listener.node.tryFindChild('DefaultCertificates3')).not.toBeDefined();
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
            Certificates: [{ CertificateArn: 'cert1' }],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerCertificate', {
            Certificates: [{ CertificateArn: 'cert2' }],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerCertificate', {
            Certificates: [{ CertificateArn: 'cert3' }],
        });
    });
    test('Can configure targetType on TargetGroups', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        // WHEN
        new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', {
            vpc,
            port: 80,
            targetType: elbv2.TargetType.IP,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
            TargetType: 'ip',
        });
    });
    test('Can configure name on TargetGroups', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        // WHEN
        new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', {
            vpc,
            port: 80,
            targetGroupName: 'foo',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
            Name: 'foo',
        });
    });
    test('Can add target groups with and without conditions', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
        const listener = lb.addListener('Listener', { port: 80 });
        const group = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', { vpc, port: 80 });
        // WHEN
        listener.addTargetGroups('Default', {
            targetGroups: [group],
        });
        listener.addTargetGroups('WithPath', {
            priority: 10,
            conditions: [elbv2.ListenerCondition.pathPatterns(['/hello'])],
            targetGroups: [group],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
            DefaultActions: [
                {
                    TargetGroupArn: { Ref: 'TargetGroup3D7CD9B8' },
                    Type: 'forward',
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
            Priority: 10,
            Conditions: [
                {
                    Field: 'path-pattern',
                    PathPatternConfig: { Values: ['/hello'] },
                },
            ],
            Actions: [
                {
                    TargetGroupArn: { Ref: 'TargetGroup3D7CD9B8' },
                    Type: 'forward',
                },
            ],
        });
    });
    test('bind is called for all next targets', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
        const listener = lb.addListener('Listener', { port: 80 });
        const fake = new helpers_1.FakeSelfRegisteringTarget(stack, 'FakeTG', vpc);
        const group = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', {
            vpc,
            port: 80,
            targets: [fake],
        });
        // WHEN
        listener.addAction('first-action', {
            action: elbv2.ListenerAction.authenticateOidc({
                next: elbv2.ListenerAction.forward([group]),
                issuer: 'dummy',
                clientId: 'dummy',
                clientSecret: core_1.SecretValue.unsafePlainText('dummy'),
                tokenEndpoint: 'dummy',
                userInfoEndpoint: 'dummy',
                authorizationEndpoint: 'dummy',
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
            IpProtocol: 'tcp',
            Description: 'Load balancer to target',
            FromPort: 80,
            ToPort: 80,
            GroupId: {
                'Fn::GetAtt': [
                    'FakeTGSG50E257DF',
                    'GroupId',
                ],
            },
            SourceSecurityGroupId: {
                'Fn::GetAtt': [
                    'LBSecurityGroup8A41EA2B',
                    'GroupId',
                ],
            },
        });
    });
    cdk_build_tools_1.testDeprecated('Can implicitly create target groups with and without conditions', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
        const listener = lb.addListener('Listener', { port: 80 });
        // WHEN
        listener.addTargets('Targets', {
            port: 80,
            targets: [new elbv2.InstanceTarget('i-12345')],
        });
        listener.addTargets('WithPath', {
            priority: 10,
            conditions: [elbv2.ListenerCondition.pathPatterns(['/hello'])],
            port: 80,
            targets: [new elbv2.InstanceTarget('i-5678')],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
            DefaultActions: [
                {
                    TargetGroupArn: { Ref: 'LBListenerTargetsGroup76EF81E8' },
                    Type: 'forward',
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
            VpcId: { Ref: 'Stack8A423254' },
            Port: 80,
            Protocol: 'HTTP',
            Targets: [
                { Id: 'i-12345' },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
            Actions: [
                {
                    TargetGroupArn: { Ref: 'LBListenerWithPathGroupE889F9E5' },
                    Type: 'forward',
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
            VpcId: { Ref: 'Stack8A423254' },
            Port: 80,
            Protocol: 'HTTP',
            Targets: [
                { Id: 'i-5678' },
            ],
        });
    });
    cdk_build_tools_1.testDeprecated('Add certificate to constructed listener', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
        const listener = lb.addListener('Listener', { port: 443 });
        // WHEN
        listener.addCertificates('Certs', [importedCertificate(stack, 'cert')]);
        listener.addTargets('Targets', { port: 8080, targets: [new elbv2.IpTarget('1.2.3.4')] });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
            Certificates: [
                { CertificateArn: 'cert' },
            ],
        });
    });
    test('Add certificate to imported listener', () => {
        // GIVEN
        const stack2 = new cdk.Stack();
        const listener2 = elbv2.ApplicationListener.fromApplicationListenerAttributes(stack2, 'Listener', {
            listenerArn: 'listener-arn',
            defaultPort: 443,
            securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack2, 'SG', 'security-group-id'),
        });
        // WHEN
        listener2.addCertificates('Certs', [importedCertificate(stack2, 'cert')]);
        // THEN
        assertions_1.Template.fromStack(stack2).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerCertificate', {
            Certificates: [
                { CertificateArn: 'cert' },
            ],
        });
    });
    test('Enable alb stickiness for targets', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
        const listener = lb.addListener('Listener', { port: 80 });
        // WHEN
        const group = listener.addTargets('Group', {
            port: 80,
            targets: [new helpers_1.FakeSelfRegisteringTarget(stack, 'Target', vpc)],
        });
        group.enableCookieStickiness(cdk.Duration.hours(1));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
            TargetGroupAttributes: [
                {
                    Key: 'stickiness.enabled',
                    Value: 'true',
                },
                {
                    Key: 'stickiness.type',
                    Value: 'lb_cookie',
                },
                {
                    Key: 'stickiness.lb_cookie.duration_seconds',
                    Value: '3600',
                },
            ],
        });
    });
    test('Enable app stickiness for targets', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
        const listener = lb.addListener('Listener', { port: 80 });
        // WHEN
        const group = listener.addTargets('Group', {
            port: 80,
            targets: [new helpers_1.FakeSelfRegisteringTarget(stack, 'Target', vpc)],
        });
        group.enableCookieStickiness(cdk.Duration.hours(1), 'MyDeliciousCookie');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
            TargetGroupAttributes: [
                {
                    Key: 'stickiness.enabled',
                    Value: 'true',
                },
                {
                    Key: 'stickiness.type',
                    Value: 'app_cookie',
                },
                {
                    Key: 'stickiness.app_cookie.cookie_name',
                    Value: 'MyDeliciousCookie',
                },
                {
                    Key: 'stickiness.app_cookie.duration_seconds',
                    Value: '3600',
                },
            ],
        });
    });
    test('Enable health check for targets', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
        const listener = lb.addListener('Listener', { port: 80 });
        // WHEN
        const group = listener.addTargets('Group', {
            port: 80,
            targets: [new helpers_1.FakeSelfRegisteringTarget(stack, 'Target', vpc)],
        });
        group.configureHealthCheck({
            unhealthyThresholdCount: 3,
            timeout: cdk.Duration.seconds(30),
            interval: cdk.Duration.seconds(60),
            path: '/test',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
            UnhealthyThresholdCount: 3,
            HealthCheckIntervalSeconds: 60,
            HealthCheckPath: '/test',
            HealthCheckTimeoutSeconds: 30,
        });
    });
    test('validation error if invalid health check protocol', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
        const listener = lb.addListener('Listener', { port: 80 });
        // WHEN
        const group = listener.addTargets('Group', {
            port: 80,
            targets: [new helpers_1.FakeSelfRegisteringTarget(stack, 'Target', vpc)],
        });
        group.configureHealthCheck({
            unhealthyThresholdCount: 3,
            timeout: cdk.Duration.seconds(30),
            interval: cdk.Duration.seconds(60),
            path: '/test',
            protocol: elbv2.Protocol.TCP,
        });
        // THEN
        const validationErrors = group.node.validate();
        expect(validationErrors).toEqual(["Health check protocol 'TCP' is not supported. Must be one of [HTTP, HTTPS]"]);
    });
    test('adding targets passes in provided protocol version', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
        const listener = lb.addListener('Listener', { port: 443, certificates: [importedCertificate(stack, 'arn:someCert')] });
        // WHEN
        listener.addTargets('Group', {
            port: 443,
            protocolVersion: elbv2.ApplicationProtocolVersion.GRPC,
            targets: [new helpers_1.FakeSelfRegisteringTarget(stack, 'Target', vpc)],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
            ProtocolVersion: 'GRPC',
        });
    });
    test('Can call addTargetGroups on imported listener', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const listener = elbv2.ApplicationListener.fromApplicationListenerAttributes(stack, 'Listener', {
            listenerArn: 'ieks',
            securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'sg-12345'),
        });
        const group = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', { vpc, port: 80 });
        // WHEN
        listener.addTargetGroups('Gruuup', {
            priority: 30,
            conditions: [elbv2.ListenerCondition.hostHeaders(['example.com'])],
            targetGroups: [group],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
            ListenerArn: 'ieks',
            Priority: 30,
            Actions: [
                {
                    TargetGroupArn: { Ref: 'TargetGroup3D7CD9B8' },
                    Type: 'forward',
                },
            ],
        });
    });
    test('Can call addTargetGroups on imported listener with conditions prop', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const listener = elbv2.ApplicationListener.fromApplicationListenerAttributes(stack, 'Listener', {
            listenerArn: 'ieks',
            securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'sg-12345'),
        });
        const group = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', { vpc, port: 80 });
        // WHEN
        listener.addTargetGroups('Gruuup', {
            priority: 30,
            conditions: [elbv2.ListenerCondition.hostHeaders(['example.com'])],
            targetGroups: [group],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
            ListenerArn: 'ieks',
            Priority: 30,
            Actions: [
                {
                    TargetGroupArn: { Ref: 'TargetGroup3D7CD9B8' },
                    Type: 'forward',
                },
            ],
        });
    });
    test('Can depend on eventual listener via TargetGroup', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const loadBalancer = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', { vpc });
        const group = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', { vpc, port: 80 });
        // WHEN
        new ResourceWithLBDependency(stack, 'SomeResource', group);
        loadBalancer.addListener('Listener', {
            port: 80,
            defaultTargetGroups: [group],
        });
        // THEN
        assertions_1.Template.fromStack(stack).templateMatches(assertions_1.Match.objectLike({
            Resources: {
                SomeResource: {
                    Type: 'Test::Resource',
                    DependsOn: ['LoadBalancerListenerE1A099B9'],
                },
            },
        }));
    });
    test('Exercise metrics', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
        const group = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', { vpc, port: 80 });
        lb.addListener('SomeListener', {
            port: 80,
            defaultTargetGroups: [group],
        });
        // WHEN
        const metrics = new Array();
        metrics.push(group.metrics.httpCodeTarget(elbv2.HttpCodeTarget.TARGET_3XX_COUNT));
        metrics.push(group.metrics.ipv6RequestCount());
        metrics.push(group.metrics.unhealthyHostCount());
        metrics.push(group.metrics.unhealthyHostCount());
        metrics.push(group.metrics.requestCount());
        metrics.push(group.metrics.targetConnectionErrorCount());
        metrics.push(group.metrics.targetResponseTime());
        metrics.push(group.metrics.targetTLSNegotiationErrorCount());
        for (const metric of metrics) {
            expect(metric.namespace).toEqual('AWS/ApplicationELB');
            const loadBalancerArn = { Ref: 'LBSomeListenerCA01F1A0' };
            expect(stack.resolve(metric.dimensions)).toEqual({
                TargetGroup: { 'Fn::GetAtt': ['TargetGroup3D7CD9B8', 'TargetGroupFullName'] },
                LoadBalancer: {
                    'Fn::Join': ['',
                        [{ 'Fn::Select': [1, { 'Fn::Split': ['/', loadBalancerArn] }] },
                            '/',
                            { 'Fn::Select': [2, { 'Fn::Split': ['/', loadBalancerArn] }] },
                            '/',
                            { 'Fn::Select': [3, { 'Fn::Split': ['/', loadBalancerArn] }] }]],
                },
            });
        }
    });
    test('Can add dependency on ListenerRule via TargetGroup', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const loadBalancer = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', { vpc });
        const group1 = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup1', { vpc, port: 80 });
        const group2 = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup2', { vpc, port: 80 });
        const listener = loadBalancer.addListener('Listener', {
            port: 80,
            defaultTargetGroups: [group1],
        });
        // WHEN
        new ResourceWithLBDependency(stack, 'SomeResource', group2);
        listener.addTargetGroups('SecondGroup', {
            conditions: [elbv2.ListenerCondition.pathPatterns(['/bla'])],
            priority: 10,
            targetGroups: [group2],
        });
        // THEN
        assertions_1.Template.fromStack(stack).templateMatches(assertions_1.Match.objectLike({
            Resources: {
                SomeResource: {
                    Type: 'Test::Resource',
                    DependsOn: ['LoadBalancerListenerSecondGroupRuleF5FDC196'],
                },
            },
        }));
    });
    test('Can add fixed responses', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
            vpc,
        });
        const listener = lb.addListener('Listener', {
            port: 80,
        });
        // WHEN
        listener.addAction('Default', {
            action: elbv2.ListenerAction.fixedResponse(404, {
                contentType: 'text/plain',
                messageBody: 'Not Found',
            }),
        });
        listener.addAction('Hello', {
            action: elbv2.ListenerAction.fixedResponse(503),
            conditions: [elbv2.ListenerCondition.pathPatterns(['/hello'])],
            priority: 10,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
            DefaultActions: [
                {
                    FixedResponseConfig: {
                        ContentType: 'text/plain',
                        MessageBody: 'Not Found',
                        StatusCode: '404',
                    },
                    Type: 'fixed-response',
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
            Actions: [
                {
                    FixedResponseConfig: {
                        StatusCode: '503',
                    },
                    Type: 'fixed-response',
                },
            ],
        });
    });
    test('imported listener only need securityGroup and listenerArn as attributes', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const importedListener = elbv2.ApplicationListener.fromApplicationListenerAttributes(stack, 'listener', {
            listenerArn: 'listener-arn',
            defaultPort: 443,
            securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'security-group-id', {
                allowAllOutbound: false,
            }),
        });
        importedListener.addAction('Hello', {
            action: elbv2.ListenerAction.fixedResponse(503),
            conditions: [elbv2.ListenerCondition.pathPatterns(['/hello'])],
            priority: 10,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
            ListenerArn: 'listener-arn',
            Priority: 10,
            Actions: [
                {
                    FixedResponseConfig: {
                        StatusCode: '503',
                    },
                    Type: 'fixed-response',
                },
            ],
        });
    });
    test('Can add actions to an imported listener', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const stack2 = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
            vpc,
        });
        const listener = lb.addListener('Listener', {
            port: 80,
        });
        // WHEN
        listener.addAction('Default', {
            action: elbv2.ListenerAction.fixedResponse(404, {
                contentType: 'text/plain',
                messageBody: 'Not Found',
            }),
        });
        const importedListener = elbv2.ApplicationListener.fromApplicationListenerAttributes(stack2, 'listener', {
            listenerArn: 'listener-arn',
            defaultPort: 443,
            securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack2, 'SG', 'security-group-id', {
                allowAllOutbound: false,
            }),
        });
        importedListener.addAction('Hello', {
            action: elbv2.ListenerAction.fixedResponse(503),
            conditions: [elbv2.ListenerCondition.pathPatterns(['/hello'])],
            priority: 10,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
            DefaultActions: [
                {
                    FixedResponseConfig: {
                        ContentType: 'text/plain',
                        MessageBody: 'Not Found',
                        StatusCode: '404',
                    },
                    Type: 'fixed-response',
                },
            ],
        });
        assertions_1.Template.fromStack(stack2).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
            ListenerArn: 'listener-arn',
            Priority: 10,
            Actions: [
                {
                    FixedResponseConfig: {
                        StatusCode: '503',
                    },
                    Type: 'fixed-response',
                },
            ],
        });
    });
    test('actions added to an imported listener must have a priority', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const importedListener = elbv2.ApplicationListener.fromApplicationListenerAttributes(stack, 'listener', {
            listenerArn: 'listener-arn',
            defaultPort: 443,
            securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'security-group-id', {
                allowAllOutbound: false,
            }),
        });
        expect(() => {
            importedListener.addAction('Hello', {
                action: elbv2.ListenerAction.fixedResponse(503),
            });
        }).toThrow(/priority must be set for actions added to an imported listener/);
    });
    cdk_build_tools_1.testDeprecated('Can add redirect responses', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
            vpc,
        });
        const listener = lb.addListener('Listener', {
            port: 80,
        });
        // WHEN
        listener.addRedirectResponse('Default', {
            statusCode: 'HTTP_301',
            port: '443',
            protocol: 'HTTPS',
        });
        listener.addRedirectResponse('Hello', {
            priority: 10,
            conditions: [elbv2.ListenerCondition.pathPatterns(['/hello'])],
            path: '/new/#{path}',
            statusCode: 'HTTP_302',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
            DefaultActions: [
                {
                    RedirectConfig: {
                        Port: '443',
                        Protocol: 'HTTPS',
                        StatusCode: 'HTTP_301',
                    },
                    Type: 'redirect',
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
            Actions: [
                {
                    RedirectConfig: {
                        Path: '/new/#{path}',
                        StatusCode: 'HTTP_302',
                    },
                    Type: 'redirect',
                },
            ],
        });
    });
    test('Can add simple redirect responses', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
            vpc,
        });
        // WHEN
        lb.addRedirect();
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
            Port: 80,
            Protocol: 'HTTP',
            DefaultActions: [
                {
                    RedirectConfig: {
                        Port: '443',
                        Protocol: 'HTTPS',
                        StatusCode: 'HTTP_301',
                    },
                    Type: 'redirect',
                },
            ],
        });
    });
    test('Can supress default ingress rules on a simple redirect response', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const loadBalancer = new elbv2.ApplicationLoadBalancer(stack, 'LB', {
            vpc,
        });
        // WHEN
        loadBalancer.addRedirect({ open: false });
        // THEN
        const matchingGroups = assertions_1.Template.fromStack(stack).findResources('AWS::EC2::SecurityGroup', {
            SecurityGroupIngress: [
                {
                    CidrIp: '0.0.0.0/0',
                    Description: 'Allow from anyone on port 80',
                    IpProtocol: 'tcp',
                },
            ],
        });
        expect(Object.keys(matchingGroups).length).toBe(0);
    });
    test('Can add simple redirect responses with custom values', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
            vpc,
        });
        // WHEN
        const listener = lb.addRedirect({
            sourceProtocol: elbv2.ApplicationProtocol.HTTPS,
            sourcePort: 8443,
            targetProtocol: elbv2.ApplicationProtocol.HTTP,
            targetPort: 8080,
        });
        listener.addCertificates('ListenerCertificateX', [importedCertificate(stack, 'cert3')]);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
            Port: 8443,
            Protocol: 'HTTPS',
            DefaultActions: [
                {
                    RedirectConfig: {
                        Port: '8080',
                        Protocol: 'HTTP',
                        StatusCode: 'HTTP_301',
                    },
                    Type: 'redirect',
                },
            ],
        });
    });
    test('Can configure deregistration_delay for targets', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        // WHEN
        new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', {
            vpc,
            port: 80,
            deregistrationDelay: cdk.Duration.seconds(30),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
            TargetGroupAttributes: [
                {
                    Key: 'deregistration_delay.timeout_seconds',
                    Value: '30',
                },
                {
                    Key: 'stickiness.enabled',
                    Value: 'false',
                },
            ],
        });
    });
    test('Custom Load balancer algorithm type', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
        const listener = lb.addListener('Listener', { port: 80 });
        // WHEN
        listener.addTargets('Group', {
            port: 80,
            targets: [new helpers_1.FakeSelfRegisteringTarget(stack, 'Target', vpc)],
            loadBalancingAlgorithmType: elbv2.TargetGroupLoadBalancingAlgorithmType.LEAST_OUTSTANDING_REQUESTS,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
            TargetGroupAttributes: [
                {
                    Key: 'stickiness.enabled',
                    Value: 'false',
                },
                {
                    Key: 'load_balancing.algorithm.type',
                    Value: 'least_outstanding_requests',
                },
            ],
        });
    });
    cdk_build_tools_1.describeDeprecated('Throws with bad fixed responses', () => {
        test('status code', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'VPC');
            const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
                vpc,
            });
            const listener = lb.addListener('Listener', {
                port: 80,
            });
            // THEN
            expect(() => listener.addFixedResponse('Default', {
                statusCode: '301',
            })).toThrow(/`statusCode`/);
        });
        test('message body', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'VPC');
            const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
                vpc,
            });
            const listener = lb.addListener('Listener', {
                port: 80,
            });
            // THEN
            expect(() => listener.addFixedResponse('Default', {
                messageBody: 'a'.repeat(1025),
                statusCode: '500',
            })).toThrow(/`messageBody`/);
        });
    });
    cdk_build_tools_1.describeDeprecated('Throws with bad redirect responses', () => {
        test('status code', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'VPC');
            const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
                vpc,
            });
            const listener = lb.addListener('Listener', {
                port: 80,
            });
            // THEN
            expect(() => listener.addRedirectResponse('Default', {
                statusCode: '301',
            })).toThrow(/`statusCode`/);
        });
        test('protocol', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'VPC');
            const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
                vpc,
            });
            const listener = lb.addListener('Listener', {
                port: 80,
            });
            // THEN
            expect(() => listener.addRedirectResponse('Default', {
                protocol: 'tcp',
                statusCode: 'HTTP_301',
            })).toThrow(/`protocol`/);
        });
    });
    test('Throws when specifying both target groups and an action', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
            vpc,
        });
        const listener = lb.addListener('Listener', {
            port: 80,
        });
        // THEN
        expect(() => new elbv2.ApplicationListenerRule(stack, 'Rule', {
            action: elbv2.ListenerAction.fixedResponse(500),
            listener,
            priority: 10,
            conditions: [elbv2.ListenerCondition.pathPatterns(['/hello'])],
            targetGroups: [new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', { vpc, port: 80 })],
        })).toThrow(/'action,targetGroups'.*/);
    });
    test('Throws when specifying priority 0', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
            vpc,
        });
        const listener = lb.addListener('Listener', {
            port: 80,
        });
        // THEN
        expect(() => new elbv2.ApplicationListenerRule(stack, 'Rule', {
            action: elbv2.ListenerAction.fixedResponse(500),
            listener,
            priority: 0,
            conditions: [elbv2.ListenerCondition.pathPatterns(['/hello'])],
        })).toThrowError('Priority must have value greater than or equal to 1');
    });
    test('Accepts unresolved priority', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
            vpc,
        });
        const listener = lb.addListener('Listener', {
            port: 80,
        });
        // THEN
        expect(() => new elbv2.ApplicationListenerRule(stack, 'Rule', {
            listener,
            priority: new cdk.CfnParameter(stack, 'PriorityParam', { type: 'Number' }).valueAsNumber,
            conditions: [elbv2.ListenerCondition.pathPatterns(['/hello'])],
            fixedResponse: {
                statusCode: '500',
            },
        })).not.toThrowError('Priority must have value greater than or equal to 1');
    });
    cdk_build_tools_1.testDeprecated('Throws when specifying both target groups and redirect response', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
            vpc,
        });
        const listener = lb.addListener('Listener', {
            port: 80,
        });
        // THEN
        expect(() => new elbv2.ApplicationListenerRule(stack, 'Rule', {
            listener,
            priority: 10,
            conditions: [elbv2.ListenerCondition.pathPatterns(['/hello'])],
            targetGroups: [new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', { vpc, port: 80 })],
            redirectResponse: {
                statusCode: 'HTTP_301',
            },
        })).toThrow(/'targetGroups,redirectResponse'.*/);
        expect(() => new elbv2.ApplicationListenerRule(stack, 'Rule2', {
            listener,
            priority: 10,
            conditions: [elbv2.ListenerCondition.pathPatterns(['/hello'])],
            targetGroups: [new elbv2.ApplicationTargetGroup(stack, 'TargetGroup2', { vpc, port: 80 })],
            fixedResponse: {
                statusCode: '500',
            },
            redirectResponse: {
                statusCode: 'HTTP_301',
            },
        })).toThrow(/'targetGroups,fixedResponse,redirectResponse'.*/);
    });
    test('Imported listener with imported security group and allowAllOutbound set to false', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const listener = elbv2.ApplicationListener.fromApplicationListenerAttributes(stack, 'Listener', {
            listenerArn: 'listener-arn',
            defaultPort: 443,
            securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'security-group-id', {
                allowAllOutbound: false,
            }),
        });
        // WHEN
        listener.connections.allowToAnyIpv4(ec2.Port.tcp(443));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
            GroupId: 'security-group-id',
        });
    });
    test('Can pass multiple certificate arns to application listener constructor', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
        // WHEN
        lb.addListener('Listener', {
            port: 443,
            certificates: [
                importedCertificate(stack, 'cert1'),
                importedCertificate(stack, 'cert2'),
            ],
            defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 })],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
            Protocol: 'HTTPS',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerCertificate', {
            Certificates: [{ CertificateArn: 'cert2' }],
        });
    });
    test('Can use certificate wrapper class', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
        // WHEN
        lb.addListener('Listener', {
            port: 443,
            certificates: [elbv2.ListenerCertificate.fromArn('cert1'), elbv2.ListenerCertificate.fromArn('cert2')],
            defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 })],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
            Protocol: 'HTTPS',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerCertificate', {
            Certificates: [{ CertificateArn: 'cert2' }],
        });
    });
    cdk_build_tools_1.testDeprecated('Can add additional certificates via addCertificateArns to application listener', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
        // WHEN
        const listener = lb.addListener('Listener', {
            port: 443,
            certificateArns: ['cert1', 'cert2'],
            defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 })],
        });
        listener.addCertificateArns('ListenerCertificateX', ['cert3']);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
            Protocol: 'HTTPS',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerCertificate', {
            Certificates: [{ CertificateArn: 'cert2' }],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerCertificate', {
            Certificates: [{ CertificateArn: 'cert3' }],
        });
    });
    test('Can add multiple path patterns to listener rule', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
        // WHEN
        const listener = lb.addListener('Listener', {
            port: 443,
            certificates: [importedCertificate(stack, 'cert1'), importedCertificate(stack, 'cert2')],
            defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 })],
        });
        listener.addTargets('Target1', {
            priority: 10,
            conditions: [elbv2.ListenerCondition.pathPatterns(['/test/path/1', '/test/path/2'])],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
            Priority: 10,
            Conditions: [
                {
                    Field: 'path-pattern',
                    PathPatternConfig: { Values: ['/test/path/1', '/test/path/2'] },
                },
            ],
        });
    });
    cdk_build_tools_1.testDeprecated('Cannot add pathPattern and pathPatterns to listener rule', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
        // WHEN
        const listener = lb.addListener('Listener', {
            port: 443,
            certificates: [importedCertificate(stack, 'cert1'), importedCertificate(stack, 'cert2')],
            defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 })],
        });
        // THEN
        expect(() => listener.addTargets('Target1', {
            priority: 10,
            pathPatterns: ['/test/path/1', '/test/path/2'],
            pathPattern: '/test/path/3',
        })).toThrowError('Both `pathPatterns` and `pathPattern` are specified, specify only one');
    });
    test('Add additional condition to listener rule', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
        const group1 = new elbv2.ApplicationTargetGroup(stack, 'Group1', { vpc, port: 80 });
        const group2 = new elbv2.ApplicationTargetGroup(stack, 'Group2', { vpc, port: 81, protocol: elbv2.ApplicationProtocol.HTTP });
        // WHEN
        const listener = lb.addListener('Listener', {
            port: 443,
            certificates: [importedCertificate(stack, 'cert1')],
            defaultTargetGroups: [group2],
        });
        listener.addTargetGroups('TargetGroup1', {
            priority: 10,
            conditions: [
                elbv2.ListenerCondition.hostHeaders(['app.test']),
                elbv2.ListenerCondition.httpHeader('Accept', ['application/vnd.myapp.v2+json']),
            ],
            targetGroups: [group1],
        });
        listener.addTargetGroups('TargetGroup2', {
            priority: 20,
            conditions: [
                elbv2.ListenerCondition.hostHeaders(['app.test']),
            ],
            targetGroups: [group2],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
            Priority: 10,
            Conditions: [
                {
                    Field: 'host-header',
                    HostHeaderConfig: {
                        Values: ['app.test'],
                    },
                },
                {
                    Field: 'http-header',
                    HttpHeaderConfig: {
                        HttpHeaderName: 'Accept',
                        Values: ['application/vnd.myapp.v2+json'],
                    },
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
            Priority: 20,
            Conditions: [
                {
                    Field: 'host-header',
                    HostHeaderConfig: {
                        Values: ['app.test'],
                    },
                },
            ],
        });
    });
    test('Add multiple additonal condition to listener rule', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
        const group1 = new elbv2.ApplicationTargetGroup(stack, 'Group1', { vpc, port: 80 });
        const group2 = new elbv2.ApplicationTargetGroup(stack, 'Group2', { vpc, port: 81, protocol: elbv2.ApplicationProtocol.HTTP });
        const group3 = new elbv2.ApplicationTargetGroup(stack, 'Group3', { vpc, port: 82, protocol: elbv2.ApplicationProtocol.HTTP });
        // WHEN
        const listener = lb.addListener('Listener', {
            port: 443,
            certificates: [importedCertificate(stack, 'cert1')],
            defaultTargetGroups: [group3],
        });
        listener.addTargetGroups('TargetGroup1', {
            priority: 10,
            conditions: [
                elbv2.ListenerCondition.hostHeaders(['app.test']),
                elbv2.ListenerCondition.sourceIps(['192.0.2.0/24']),
                elbv2.ListenerCondition.queryStrings([{ key: 'version', value: '2' }, { value: 'foo*' }]),
            ],
            targetGroups: [group1],
        });
        listener.addTargetGroups('TargetGroup2', {
            priority: 20,
            conditions: [
                elbv2.ListenerCondition.hostHeaders(['app.test']),
                elbv2.ListenerCondition.httpHeader('Accept', ['application/vnd.myapp.v2+json']),
            ],
            targetGroups: [group1],
        });
        listener.addTargetGroups('TargetGroup3', {
            priority: 30,
            conditions: [
                elbv2.ListenerCondition.hostHeaders(['app.test']),
                elbv2.ListenerCondition.httpRequestMethods(['PUT', 'COPY', 'LOCK', 'MKCOL', 'MOVE', 'PROPFIND', 'PROPPATCH', 'UNLOCK']),
            ],
            targetGroups: [group2],
        });
        listener.addTargetGroups('TargetGroup4', {
            priority: 40,
            conditions: [
                elbv2.ListenerCondition.hostHeaders(['app.test']),
            ],
            targetGroups: [group3],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
            Priority: 10,
            Conditions: [
                {
                    Field: 'host-header',
                    HostHeaderConfig: {
                        Values: ['app.test'],
                    },
                },
                {
                    Field: 'source-ip',
                    SourceIpConfig: {
                        Values: ['192.0.2.0/24'],
                    },
                },
                {
                    Field: 'query-string',
                    QueryStringConfig: {
                        Values: [
                            {
                                Key: 'version',
                                Value: '2',
                            },
                            {
                                Value: 'foo*',
                            },
                        ],
                    },
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
            Priority: 20,
            Conditions: [
                {
                    Field: 'host-header',
                    HostHeaderConfig: {
                        Values: ['app.test'],
                    },
                },
                {
                    Field: 'http-header',
                    HttpHeaderConfig: {
                        HttpHeaderName: 'Accept',
                        Values: ['application/vnd.myapp.v2+json'],
                    },
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
            Priority: 30,
            Conditions: [
                {
                    Field: 'host-header',
                    HostHeaderConfig: {
                        Values: ['app.test'],
                    },
                },
                {
                    Field: 'http-request-method',
                    HttpRequestMethodConfig: {
                        Values: ['PUT', 'COPY', 'LOCK', 'MKCOL', 'MOVE', 'PROPFIND', 'PROPPATCH', 'UNLOCK'],
                    },
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
            Priority: 40,
            Conditions: [
                {
                    Field: 'host-header',
                    HostHeaderConfig: {
                        Values: ['app.test'],
                    },
                },
            ],
        });
    });
    cdk_build_tools_1.testDeprecated('Can exist together legacy style conditions and modern style conditions', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
        const group1 = new elbv2.ApplicationTargetGroup(stack, 'Group1', { vpc, port: 80 });
        const group2 = new elbv2.ApplicationTargetGroup(stack, 'Group2', { vpc, port: 81, protocol: elbv2.ApplicationProtocol.HTTP });
        // WHEN
        const listener = lb.addListener('Listener', {
            port: 443,
            certificates: [importedCertificate(stack, 'cert1')],
            defaultTargetGroups: [group2],
        });
        listener.addTargetGroups('TargetGroup1', {
            hostHeader: 'app.test',
            pathPattern: '/test',
            conditions: [
                elbv2.ListenerCondition.sourceIps(['192.0.2.0/24']),
            ],
            priority: 10,
            targetGroups: [group1],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
            Priority: 10,
            Conditions: [
                {
                    Field: 'host-header',
                    Values: ['app.test'],
                },
                {
                    Field: 'path-pattern',
                    Values: ['/test'],
                },
                {
                    Field: 'source-ip',
                    SourceIpConfig: {
                        Values: ['192.0.2.0/24'],
                    },
                },
            ],
        });
    });
    test('Add condition to imported application listener', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const group = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', { vpc, port: 80 });
        const listener = elbv2.ApplicationListener.fromApplicationListenerAttributes(stack, 'Listener', {
            listenerArn: 'listener-arn',
            defaultPort: 443,
            securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'security-group-id'),
        });
        // WHEN
        listener.addTargetGroups('OtherTG', {
            targetGroups: [group],
            priority: 1,
            conditions: [elbv2.ListenerCondition.pathPatterns(['/path1', '/path2'])],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
            Priority: 1,
            Conditions: [
                {
                    Field: 'path-pattern',
                    PathPatternConfig: { Values: ['/path1', '/path2'] },
                },
            ],
        });
    });
    cdk_build_tools_1.testDeprecated('not allowed to combine action specifiers when instantiating a Rule directly', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const group = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', { vpc, port: 80 });
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
        const listener = lb.addListener('Listener', { port: 80 });
        const baseProps = { listener, priority: 1, pathPatterns: ['/path1', '/path2'] };
        // WHEN
        expect(() => {
            new elbv2.ApplicationListenerRule(stack, 'Rule1', {
                ...baseProps,
                fixedResponse: { statusCode: '200' },
                action: elbv2.ListenerAction.fixedResponse(200),
            });
        }).toThrow(/specify only one/);
        expect(() => {
            new elbv2.ApplicationListenerRule(stack, 'Rule2', {
                ...baseProps,
                targetGroups: [group],
                action: elbv2.ListenerAction.fixedResponse(200),
            });
        }).toThrow(/specify only one/);
    });
    test('not allowed to specify defaultTargetGroups and defaultAction together', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const group = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', { vpc, port: 80 });
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
        // WHEN
        expect(() => {
            lb.addListener('Listener1', {
                port: 80,
                defaultTargetGroups: [group],
                defaultAction: elbv2.ListenerAction.fixedResponse(200),
            });
        }).toThrow(/Specify at most one/);
    });
    describe('lookup', () => {
        test('Can look up an ApplicationListener', () => {
            // GIVEN
            const app = new cdk.App();
            const stack = new cdk.Stack(app, 'stack', {
                env: {
                    account: '123456789012',
                    region: 'us-west-2',
                },
            });
            // WHEN
            const listener = elbv2.ApplicationListener.fromLookup(stack, 'a', {
                loadBalancerTags: {
                    some: 'tag',
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::ElasticLoadBalancingV2::Listener', 0);
            expect(listener.listenerArn).toEqual('arn:aws:elasticloadbalancing:us-west-2:123456789012:listener/application/my-load-balancer/50dc6c495c0c9188/f2f7dc8efc522ab2');
            expect(listener.connections.securityGroups[0].securityGroupId).toEqual('sg-12345678');
        });
        test('Can add rules to a looked-up ApplicationListener', () => {
            // GIVEN
            const app = new cdk.App();
            const stack = new cdk.Stack(app, 'stack', {
                env: {
                    account: '123456789012',
                    region: 'us-west-2',
                },
            });
            const listener = elbv2.ApplicationListener.fromLookup(stack, 'a', {
                loadBalancerTags: {
                    some: 'tag',
                },
            });
            // WHEN
            new elbv2.ApplicationListenerRule(stack, 'rule', {
                listener,
                conditions: [
                    elbv2.ListenerCondition.hostHeaders(['example.com']),
                ],
                action: elbv2.ListenerAction.fixedResponse(200),
                priority: 5,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
                Priority: 5,
            });
        });
        test('Can add certificates to a looked-up ApplicationListener', () => {
            // GIVEN
            const app = new cdk.App();
            const stack = new cdk.Stack(app, 'stack', {
                env: {
                    account: '123456789012',
                    region: 'us-west-2',
                },
            });
            const listener = elbv2.ApplicationListener.fromLookup(stack, 'a', {
                loadBalancerTags: {
                    some: 'tag',
                },
            });
            // WHEN
            listener.addCertificates('certs', [
                importedCertificate(stack, 'arn:something'),
            ]);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerCertificate', {
                Certificates: [
                    { CertificateArn: 'arn:something' },
                ],
            });
        });
    });
});
class ResourceWithLBDependency extends cdk.CfnResource {
    constructor(scope, id, targetGroup) {
        super(scope, id, { type: 'Test::Resource' });
        this.node.addDependency(targetGroup.loadBalancerAttached);
    }
}
function importedCertificate(stack, certificateArn = 'arn:aws:certificatemanager:123456789012:testregion:certificate/fd0b8392-3c0e-4704-81b6-8edf8612c852') {
    return acm.Certificate.fromCertificateArn(stack, certificateArn, certificateArn);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdGVuZXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpc3RlbmVyLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBc0Q7QUFDdEQsdURBQXVEO0FBRXZELHdDQUF3QztBQUN4Qyw4REFBOEU7QUFDOUUscUNBQXFDO0FBQ3JDLHdDQUE0QztBQUU1QyxtQ0FBbUM7QUFDbkMsd0NBQXVEO0FBRXZELFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0lBQ3JCLElBQUksQ0FBQyxxQ0FBcUMsRUFBRSxHQUFHLEVBQUU7UUFDL0MsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzlCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDeEMsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFFbkUsT0FBTztRQUNQLEVBQUUsQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFO1lBQ3pCLElBQUksRUFBRSxHQUFHO1lBQ1QsWUFBWSxFQUFFLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUMsbUJBQW1CLEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQzNGLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx1Q0FBdUMsRUFBRTtZQUN2RixRQUFRLEVBQUUsT0FBTztTQUNsQixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUks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QzVDLENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxrREFBa0QsRUFBRTtnQkFDbEcsWUFBWSxFQUFFO29CQUNaLEVBQUUsY0FBYyxFQUFFLGVBQWUsRUFBRTtpQkFDcEM7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxNQUFNLHdCQUF5QixTQUFRLEdBQUcsQ0FBQyxXQUFXO0lBQ3BELFlBQVksS0FBMkIsRUFBRSxFQUFVLEVBQUUsV0FBK0I7UUFDbEYsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0tBQzNEO0NBQ0Y7QUFFRCxTQUFTLG1CQUFtQixDQUFDLEtBQWdCLEVBQzNDLGNBQWMsR0FBRyxxR0FBcUc7SUFDdEgsT0FBTyxHQUFHLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDbkYsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hdGNoLCBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgYWNtIGZyb20gJ0Bhd3MtY2RrL2F3cy1jZXJ0aWZpY2F0ZW1hbmFnZXInO1xuaW1wb3J0IHsgTWV0cmljIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3Vkd2F0Y2gnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0IHsgZGVzY3JpYmVEZXByZWNhdGVkLCB0ZXN0RGVwcmVjYXRlZCB9IGZyb20gJ0Bhd3MtY2RrL2Nkay1idWlsZC10b29scyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBTZWNyZXRWYWx1ZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY29uc3RydWN0cyBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGVsYnYyIGZyb20gJy4uLy4uL2xpYic7XG5pbXBvcnQgeyBGYWtlU2VsZlJlZ2lzdGVyaW5nVGFyZ2V0IH0gZnJvbSAnLi4vaGVscGVycyc7XG5cbmRlc2NyaWJlKCd0ZXN0cycsICgpID0+IHtcbiAgdGVzdCgnTGlzdGVuZXIgZ3Vlc3NlcyBwcm90b2NvbCBmcm9tIHBvcnQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG4gICAgY29uc3QgbGIgPSBuZXcgZWxidjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc3RhY2ssICdMQicsIHsgdnBjIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGxiLmFkZExpc3RlbmVyKCdMaXN0ZW5lcicsIHtcbiAgICAgIHBvcnQ6IDQ0MyxcbiAgICAgIGNlcnRpZmljYXRlczogW2ltcG9ydGVkQ2VydGlmaWNhdGUoc3RhY2spXSxcbiAgICAgIGRlZmF1bHRUYXJnZXRHcm91cHM6IFtuZXcgZWxidjIuQXBwbGljYXRpb25UYXJnZXRHcm91cChzdGFjaywgJ0dyb3VwJywgeyB2cGMsIHBvcnQ6IDgwIH0pXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lcicsIHtcbiAgICAgIFByb3RvY29sOiAnSFRUUFMnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdMaXN0ZW5lciBndWVzc2VzIHBvcnQgZnJvbSBwcm90b2NvbCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnU3RhY2snKTtcbiAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywgeyB2cGMgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbGIuYWRkTGlzdGVuZXIoJ0xpc3RlbmVyJywge1xuICAgICAgcHJvdG9jb2w6IGVsYnYyLkFwcGxpY2F0aW9uUHJvdG9jb2wuSFRUUCxcbiAgICAgIGRlZmF1bHRUYXJnZXRHcm91cHM6IFtuZXcgZWxidjIuQXBwbGljYXRpb25UYXJnZXRHcm91cChzdGFjaywgJ0dyb3VwJywgeyB2cGMsIHBvcnQ6IDgwIH0pXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lcicsIHtcbiAgICAgIFBvcnQ6IDgwLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdMaXN0ZW5lciBkZWZhdWx0IHRvIG9wZW4gLSBJUHY0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdTdGFjaycpO1xuICAgIGNvbnN0IGxvYWRCYWxhbmNlciA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywgeyB2cGMgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbG9hZEJhbGFuY2VyLmFkZExpc3RlbmVyKCdNeUxpc3RlbmVyJywge1xuICAgICAgcG9ydDogODAsXG4gICAgICBkZWZhdWx0VGFyZ2V0R3JvdXBzOiBbbmV3IGVsYnYyLkFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAoc3RhY2ssICdHcm91cCcsIHsgdnBjLCBwb3J0OiA4MCB9KV0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwJywge1xuICAgICAgU2VjdXJpdHlHcm91cEluZ3Jlc3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIERlc2NyaXB0aW9uOiAnQWxsb3cgZnJvbSBhbnlvbmUgb24gcG9ydCA4MCcsXG4gICAgICAgICAgQ2lkcklwOiAnMC4wLjAuMC8wJyxcbiAgICAgICAgICBGcm9tUG9ydDogODAsXG4gICAgICAgICAgSXBQcm90b2NvbDogJ3RjcCcsXG4gICAgICAgICAgVG9Qb3J0OiA4MCxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0xpc3RlbmVyIGRlZmF1bHQgdG8gb3BlbiAtIElQdjQgYW5kIElQdjYgKGR1YWwgc3RhY2spJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdTdGFjaycpO1xuICAgIGNvbnN0IGxvYWRCYWxhbmNlciA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywgeyB2cGMsIGlwQWRkcmVzc1R5cGU6IGVsYnYyLklwQWRkcmVzc1R5cGUuRFVBTF9TVEFDSyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBsb2FkQmFsYW5jZXIuYWRkTGlzdGVuZXIoJ015TGlzdGVuZXInLCB7XG4gICAgICBwb3J0OiA4MCxcbiAgICAgIGRlZmF1bHRUYXJnZXRHcm91cHM6IFtuZXcgZWxidjIuQXBwbGljYXRpb25UYXJnZXRHcm91cChzdGFjaywgJ0dyb3VwJywgeyB2cGMsIHBvcnQ6IDgwIH0pXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXAnLCB7XG4gICAgICBTZWN1cml0eUdyb3VwSW5ncmVzczogW1xuICAgICAgICB7XG4gICAgICAgICAgRGVzY3JpcHRpb246ICdBbGxvdyBmcm9tIGFueW9uZSBvbiBwb3J0IDgwJyxcbiAgICAgICAgICBDaWRySXA6ICcwLjAuMC4wLzAnLFxuICAgICAgICAgIEZyb21Qb3J0OiA4MCxcbiAgICAgICAgICBJcFByb3RvY29sOiAndGNwJyxcbiAgICAgICAgICBUb1BvcnQ6IDgwLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgRGVzY3JpcHRpb246ICdBbGxvdyBmcm9tIGFueW9uZSBvbiBwb3J0IDgwJyxcbiAgICAgICAgICBDaWRySXB2NjogJzo6LzAnLFxuICAgICAgICAgIEZyb21Qb3J0OiA4MCxcbiAgICAgICAgICBJcFByb3RvY29sOiAndGNwJyxcbiAgICAgICAgICBUb1BvcnQ6IDgwLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnSFRUUFMgbGlzdGVuZXIgcmVxdWlyZXMgY2VydGlmaWNhdGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG4gICAgY29uc3QgbGIgPSBuZXcgZWxidjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc3RhY2ssICdMQicsIHsgdnBjIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGxpc3RlbmVyID0gbGIuYWRkTGlzdGVuZXIoJ0xpc3RlbmVyJywge1xuICAgICAgcG9ydDogNDQzLFxuICAgICAgZGVmYXVsdFRhcmdldEdyb3VwczogW25ldyBlbGJ2Mi5BcHBsaWNhdGlvblRhcmdldEdyb3VwKHN0YWNrLCAnR3JvdXAnLCB7IHZwYywgcG9ydDogODAgfSldLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGVycm9ycyA9IGxpc3RlbmVyLm5vZGUudmFsaWRhdGUoKTtcbiAgICBleHBlY3QoZXJyb3JzKS50b0VxdWFsKFsnSFRUUFMgTGlzdGVuZXIgbmVlZHMgYXQgbGVhc3Qgb25lIGNlcnRpZmljYXRlIChjYWxsIGFkZENlcnRpZmljYXRlcyknXSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0hUVFBTIGxpc3RlbmVyIGNhbiBhZGQgY2VydGlmaWNhdGUgYWZ0ZXIgY29uc3RydWN0aW9uJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdTdGFjaycpO1xuICAgIGNvbnN0IGxiID0gbmV3IGVsYnYyLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKHN0YWNrLCAnTEInLCB7IHZwYyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdMaXN0ZW5lcicsIHtcbiAgICAgIHBvcnQ6IDQ0MyxcbiAgICAgIGRlZmF1bHRUYXJnZXRHcm91cHM6IFtuZXcgZWxidjIuQXBwbGljYXRpb25UYXJnZXRHcm91cChzdGFjaywgJ0dyb3VwJywgeyB2cGMsIHBvcnQ6IDgwIH0pXSxcbiAgICB9KTtcblxuICAgIGxpc3RlbmVyLmFkZENlcnRpZmljYXRlcygnQ2VydHMnLCBbaW1wb3J0ZWRDZXJ0aWZpY2F0ZShzdGFjaywgJ2NlcnQnKV0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyJywge1xuICAgICAgQ2VydGlmaWNhdGVzOiBbXG4gICAgICAgIHsgQ2VydGlmaWNhdGVBcm46ICdjZXJ0JyB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnSFRUUFMgbGlzdGVuZXIgY2FuIGFkZCBtb3JlIHRoYW4gdHdvIGNlcnRpZmljYXRlcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnU3RhY2snKTtcbiAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywgeyB2cGMgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbGlzdGVuZXIgPSBsYi5hZGRMaXN0ZW5lcignTGlzdGVuZXInLCB7XG4gICAgICBwb3J0OiA0NDMsXG4gICAgICBkZWZhdWx0VGFyZ2V0R3JvdXBzOiBbXG4gICAgICAgIG5ldyBlbGJ2Mi5BcHBsaWNhdGlvblRhcmdldEdyb3VwKHN0YWNrLCAnR3JvdXAnLCB7IHZwYywgcG9ydDogODAgfSksXG4gICAgICBdLFxuICAgICAgY2VydGlmaWNhdGVzOiBbXG4gICAgICAgIGVsYnYyLkxpc3RlbmVyQ2VydGlmaWNhdGUuZnJvbUFybignY2VydDEnKSxcbiAgICAgICAgZWxidjIuTGlzdGVuZXJDZXJ0aWZpY2F0ZS5mcm9tQXJuKCdjZXJ0MicpLFxuICAgICAgICBlbGJ2Mi5MaXN0ZW5lckNlcnRpZmljYXRlLmZyb21Bcm4oJ2NlcnQzJyksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KGxpc3RlbmVyLm5vZGUudHJ5RmluZENoaWxkKCdEZWZhdWx0Q2VydGlmaWNhdGVzMScpKS50b0JlRGVmaW5lZCgpO1xuICAgIGV4cGVjdChsaXN0ZW5lci5ub2RlLnRyeUZpbmRDaGlsZCgnRGVmYXVsdENlcnRpZmljYXRlczInKSkudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3QobGlzdGVuZXIubm9kZS50cnlGaW5kQ2hpbGQoJ0RlZmF1bHRDZXJ0aWZpY2F0ZXMzJykpLm5vdC50b0JlRGVmaW5lZCgpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyJywge1xuICAgICAgQ2VydGlmaWNhdGVzOiBbeyBDZXJ0aWZpY2F0ZUFybjogJ2NlcnQxJyB9XSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyQ2VydGlmaWNhdGUnLCB7XG4gICAgICBDZXJ0aWZpY2F0ZXM6IFt7IENlcnRpZmljYXRlQXJuOiAnY2VydDInIH1dLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TGlzdGVuZXJDZXJ0aWZpY2F0ZScsIHtcbiAgICAgIENlcnRpZmljYXRlczogW3sgQ2VydGlmaWNhdGVBcm46ICdjZXJ0MycgfV0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0NhbiBjb25maWd1cmUgdGFyZ2V0VHlwZSBvbiBUYXJnZXRHcm91cHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVsYnYyLkFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAoc3RhY2ssICdUYXJnZXRHcm91cCcsIHtcbiAgICAgIHZwYyxcbiAgICAgIHBvcnQ6IDgwLFxuICAgICAgdGFyZ2V0VHlwZTogZWxidjIuVGFyZ2V0VHlwZS5JUCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpUYXJnZXRHcm91cCcsIHtcbiAgICAgIFRhcmdldFR5cGU6ICdpcCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0NhbiBjb25maWd1cmUgbmFtZSBvbiBUYXJnZXRHcm91cHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVsYnYyLkFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAoc3RhY2ssICdUYXJnZXRHcm91cCcsIHtcbiAgICAgIHZwYyxcbiAgICAgIHBvcnQ6IDgwLFxuICAgICAgdGFyZ2V0R3JvdXBOYW1lOiAnZm9vJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpUYXJnZXRHcm91cCcsIHtcbiAgICAgIE5hbWU6ICdmb28nLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdDYW4gYWRkIHRhcmdldCBncm91cHMgd2l0aCBhbmQgd2l0aG91dCBjb25kaXRpb25zJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdTdGFjaycpO1xuICAgIGNvbnN0IGxiID0gbmV3IGVsYnYyLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKHN0YWNrLCAnTEInLCB7IHZwYyB9KTtcbiAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdMaXN0ZW5lcicsIHsgcG9ydDogODAgfSk7XG4gICAgY29uc3QgZ3JvdXAgPSBuZXcgZWxidjIuQXBwbGljYXRpb25UYXJnZXRHcm91cChzdGFjaywgJ1RhcmdldEdyb3VwJywgeyB2cGMsIHBvcnQ6IDgwIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGxpc3RlbmVyLmFkZFRhcmdldEdyb3VwcygnRGVmYXVsdCcsIHtcbiAgICAgIHRhcmdldEdyb3VwczogW2dyb3VwXSxcbiAgICB9KTtcbiAgICBsaXN0ZW5lci5hZGRUYXJnZXRHcm91cHMoJ1dpdGhQYXRoJywge1xuICAgICAgcHJpb3JpdHk6IDEwLFxuICAgICAgY29uZGl0aW9uczogW2VsYnYyLkxpc3RlbmVyQ29uZGl0aW9uLnBhdGhQYXR0ZXJucyhbJy9oZWxsbyddKV0sXG4gICAgICB0YXJnZXRHcm91cHM6IFtncm91cF0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TGlzdGVuZXInLCB7XG4gICAgICBEZWZhdWx0QWN0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgVGFyZ2V0R3JvdXBBcm46IHsgUmVmOiAnVGFyZ2V0R3JvdXAzRDdDRDlCOCcgfSxcbiAgICAgICAgICBUeXBlOiAnZm9yd2FyZCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyUnVsZScsIHtcbiAgICAgIFByaW9yaXR5OiAxMCxcbiAgICAgIENvbmRpdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEZpZWxkOiAncGF0aC1wYXR0ZXJuJyxcbiAgICAgICAgICBQYXRoUGF0dGVybkNvbmZpZzogeyBWYWx1ZXM6IFsnL2hlbGxvJ10gfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBBY3Rpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBUYXJnZXRHcm91cEFybjogeyBSZWY6ICdUYXJnZXRHcm91cDNEN0NEOUI4JyB9LFxuICAgICAgICAgIFR5cGU6ICdmb3J3YXJkJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2JpbmQgaXMgY2FsbGVkIGZvciBhbGwgbmV4dCB0YXJnZXRzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdTdGFjaycpO1xuICAgIGNvbnN0IGxiID0gbmV3IGVsYnYyLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKHN0YWNrLCAnTEInLCB7IHZwYyB9KTtcbiAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdMaXN0ZW5lcicsIHsgcG9ydDogODAgfSk7XG4gICAgY29uc3QgZmFrZSA9IG5ldyBGYWtlU2VsZlJlZ2lzdGVyaW5nVGFyZ2V0KHN0YWNrLCAnRmFrZVRHJywgdnBjKTtcbiAgICBjb25zdCBncm91cCA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvblRhcmdldEdyb3VwKHN0YWNrLCAnVGFyZ2V0R3JvdXAnLCB7XG4gICAgICB2cGMsXG4gICAgICBwb3J0OiA4MCxcbiAgICAgIHRhcmdldHM6IFtmYWtlXSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBsaXN0ZW5lci5hZGRBY3Rpb24oJ2ZpcnN0LWFjdGlvbicsIHtcbiAgICAgIGFjdGlvbjogZWxidjIuTGlzdGVuZXJBY3Rpb24uYXV0aGVudGljYXRlT2lkYyh7XG4gICAgICAgIG5leHQ6IGVsYnYyLkxpc3RlbmVyQWN0aW9uLmZvcndhcmQoW2dyb3VwXSksXG4gICAgICAgIGlzc3VlcjogJ2R1bW15JyxcbiAgICAgICAgY2xpZW50SWQ6ICdkdW1teScsXG4gICAgICAgIGNsaWVudFNlY3JldDogU2VjcmV0VmFsdWUudW5zYWZlUGxhaW5UZXh0KCdkdW1teScpLFxuICAgICAgICB0b2tlbkVuZHBvaW50OiAnZHVtbXknLFxuICAgICAgICB1c2VySW5mb0VuZHBvaW50OiAnZHVtbXknLFxuICAgICAgICBhdXRob3JpemF0aW9uRW5kcG9pbnQ6ICdkdW1teScsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXBJbmdyZXNzJywge1xuICAgICAgSXBQcm90b2NvbDogJ3RjcCcsXG4gICAgICBEZXNjcmlwdGlvbjogJ0xvYWQgYmFsYW5jZXIgdG8gdGFyZ2V0JyxcbiAgICAgIEZyb21Qb3J0OiA4MCxcbiAgICAgIFRvUG9ydDogODAsXG4gICAgICBHcm91cElkOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdGYWtlVEdTRzUwRTI1N0RGJyxcbiAgICAgICAgICAnR3JvdXBJZCcsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgU291cmNlU2VjdXJpdHlHcm91cElkOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdMQlNlY3VyaXR5R3JvdXA4QTQxRUEyQicsXG4gICAgICAgICAgJ0dyb3VwSWQnLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ0NhbiBpbXBsaWNpdGx5IGNyZWF0ZSB0YXJnZXQgZ3JvdXBzIHdpdGggYW5kIHdpdGhvdXQgY29uZGl0aW9ucycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnU3RhY2snKTtcbiAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywgeyB2cGMgfSk7XG4gICAgY29uc3QgbGlzdGVuZXIgPSBsYi5hZGRMaXN0ZW5lcignTGlzdGVuZXInLCB7IHBvcnQ6IDgwIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGxpc3RlbmVyLmFkZFRhcmdldHMoJ1RhcmdldHMnLCB7XG4gICAgICBwb3J0OiA4MCxcbiAgICAgIHRhcmdldHM6IFtuZXcgZWxidjIuSW5zdGFuY2VUYXJnZXQoJ2ktMTIzNDUnKV0sXG4gICAgfSk7XG4gICAgbGlzdGVuZXIuYWRkVGFyZ2V0cygnV2l0aFBhdGgnLCB7XG4gICAgICBwcmlvcml0eTogMTAsXG4gICAgICBjb25kaXRpb25zOiBbZWxidjIuTGlzdGVuZXJDb25kaXRpb24ucGF0aFBhdHRlcm5zKFsnL2hlbGxvJ10pXSxcbiAgICAgIHBvcnQ6IDgwLFxuICAgICAgdGFyZ2V0czogW25ldyBlbGJ2Mi5JbnN0YW5jZVRhcmdldCgnaS01Njc4JyldLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyJywge1xuICAgICAgRGVmYXVsdEFjdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFRhcmdldEdyb3VwQXJuOiB7IFJlZjogJ0xCTGlzdGVuZXJUYXJnZXRzR3JvdXA3NkVGODFFOCcgfSxcbiAgICAgICAgICBUeXBlOiAnZm9yd2FyZCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OlRhcmdldEdyb3VwJywge1xuICAgICAgVnBjSWQ6IHsgUmVmOiAnU3RhY2s4QTQyMzI1NCcgfSxcbiAgICAgIFBvcnQ6IDgwLFxuICAgICAgUHJvdG9jb2w6ICdIVFRQJyxcbiAgICAgIFRhcmdldHM6IFtcbiAgICAgICAgeyBJZDogJ2ktMTIzNDUnIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyUnVsZScsIHtcbiAgICAgIEFjdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFRhcmdldEdyb3VwQXJuOiB7IFJlZjogJ0xCTGlzdGVuZXJXaXRoUGF0aEdyb3VwRTg4OUY5RTUnIH0sXG4gICAgICAgICAgVHlwZTogJ2ZvcndhcmQnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpUYXJnZXRHcm91cCcsIHtcbiAgICAgIFZwY0lkOiB7IFJlZjogJ1N0YWNrOEE0MjMyNTQnIH0sXG4gICAgICBQb3J0OiA4MCxcbiAgICAgIFByb3RvY29sOiAnSFRUUCcsXG4gICAgICBUYXJnZXRzOiBbXG4gICAgICAgIHsgSWQ6ICdpLTU2NzgnIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnQWRkIGNlcnRpZmljYXRlIHRvIGNvbnN0cnVjdGVkIGxpc3RlbmVyJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdTdGFjaycpO1xuICAgIGNvbnN0IGxiID0gbmV3IGVsYnYyLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKHN0YWNrLCAnTEInLCB7IHZwYyB9KTtcbiAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdMaXN0ZW5lcicsIHsgcG9ydDogNDQzIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGxpc3RlbmVyLmFkZENlcnRpZmljYXRlcygnQ2VydHMnLCBbaW1wb3J0ZWRDZXJ0aWZpY2F0ZShzdGFjaywgJ2NlcnQnKV0pO1xuICAgIGxpc3RlbmVyLmFkZFRhcmdldHMoJ1RhcmdldHMnLCB7IHBvcnQ6IDgwODAsIHRhcmdldHM6IFtuZXcgZWxidjIuSXBUYXJnZXQoJzEuMi4zLjQnKV0gfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TGlzdGVuZXInLCB7XG4gICAgICBDZXJ0aWZpY2F0ZXM6IFtcbiAgICAgICAgeyBDZXJ0aWZpY2F0ZUFybjogJ2NlcnQnIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdBZGQgY2VydGlmaWNhdGUgdG8gaW1wb3J0ZWQgbGlzdGVuZXInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjazIgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgbGlzdGVuZXIyID0gZWxidjIuQXBwbGljYXRpb25MaXN0ZW5lci5mcm9tQXBwbGljYXRpb25MaXN0ZW5lckF0dHJpYnV0ZXMoc3RhY2syLCAnTGlzdGVuZXInLCB7XG4gICAgICBsaXN0ZW5lckFybjogJ2xpc3RlbmVyLWFybicsXG4gICAgICBkZWZhdWx0UG9ydDogNDQzLFxuICAgICAgc2VjdXJpdHlHcm91cDogZWMyLlNlY3VyaXR5R3JvdXAuZnJvbVNlY3VyaXR5R3JvdXBJZChzdGFjazIsICdTRycsICdzZWN1cml0eS1ncm91cC1pZCcpLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGxpc3RlbmVyMi5hZGRDZXJ0aWZpY2F0ZXMoJ0NlcnRzJywgW2ltcG9ydGVkQ2VydGlmaWNhdGUoc3RhY2syLCAnY2VydCcpXSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrMikuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyQ2VydGlmaWNhdGUnLCB7XG4gICAgICBDZXJ0aWZpY2F0ZXM6IFtcbiAgICAgICAgeyBDZXJ0aWZpY2F0ZUFybjogJ2NlcnQnIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdFbmFibGUgYWxiIHN0aWNraW5lc3MgZm9yIHRhcmdldHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG4gICAgY29uc3QgbGIgPSBuZXcgZWxidjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc3RhY2ssICdMQicsIHsgdnBjIH0pO1xuICAgIGNvbnN0IGxpc3RlbmVyID0gbGIuYWRkTGlzdGVuZXIoJ0xpc3RlbmVyJywgeyBwb3J0OiA4MCB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBncm91cCA9IGxpc3RlbmVyLmFkZFRhcmdldHMoJ0dyb3VwJywge1xuICAgICAgcG9ydDogODAsXG4gICAgICB0YXJnZXRzOiBbbmV3IEZha2VTZWxmUmVnaXN0ZXJpbmdUYXJnZXQoc3RhY2ssICdUYXJnZXQnLCB2cGMpXSxcbiAgICB9KTtcbiAgICBncm91cC5lbmFibGVDb29raWVTdGlja2luZXNzKGNkay5EdXJhdGlvbi5ob3VycygxKSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6VGFyZ2V0R3JvdXAnLCB7XG4gICAgICBUYXJnZXRHcm91cEF0dHJpYnV0ZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEtleTogJ3N0aWNraW5lc3MuZW5hYmxlZCcsXG4gICAgICAgICAgVmFsdWU6ICd0cnVlJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIEtleTogJ3N0aWNraW5lc3MudHlwZScsXG4gICAgICAgICAgVmFsdWU6ICdsYl9jb29raWUnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgS2V5OiAnc3RpY2tpbmVzcy5sYl9jb29raWUuZHVyYXRpb25fc2Vjb25kcycsXG4gICAgICAgICAgVmFsdWU6ICczNjAwJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0VuYWJsZSBhcHAgc3RpY2tpbmVzcyBmb3IgdGFyZ2V0cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnU3RhY2snKTtcbiAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywgeyB2cGMgfSk7XG4gICAgY29uc3QgbGlzdGVuZXIgPSBsYi5hZGRMaXN0ZW5lcignTGlzdGVuZXInLCB7IHBvcnQ6IDgwIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGdyb3VwID0gbGlzdGVuZXIuYWRkVGFyZ2V0cygnR3JvdXAnLCB7XG4gICAgICBwb3J0OiA4MCxcbiAgICAgIHRhcmdldHM6IFtuZXcgRmFrZVNlbGZSZWdpc3RlcmluZ1RhcmdldChzdGFjaywgJ1RhcmdldCcsIHZwYyldLFxuICAgIH0pO1xuICAgIGdyb3VwLmVuYWJsZUNvb2tpZVN0aWNraW5lc3MoY2RrLkR1cmF0aW9uLmhvdXJzKDEpLCAnTXlEZWxpY2lvdXNDb29raWUnKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpUYXJnZXRHcm91cCcsIHtcbiAgICAgIFRhcmdldEdyb3VwQXR0cmlidXRlczogW1xuICAgICAgICB7XG4gICAgICAgICAgS2V5OiAnc3RpY2tpbmVzcy5lbmFibGVkJyxcbiAgICAgICAgICBWYWx1ZTogJ3RydWUnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgS2V5OiAnc3RpY2tpbmVzcy50eXBlJyxcbiAgICAgICAgICBWYWx1ZTogJ2FwcF9jb29raWUnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgS2V5OiAnc3RpY2tpbmVzcy5hcHBfY29va2llLmNvb2tpZV9uYW1lJyxcbiAgICAgICAgICBWYWx1ZTogJ015RGVsaWNpb3VzQ29va2llJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIEtleTogJ3N0aWNraW5lc3MuYXBwX2Nvb2tpZS5kdXJhdGlvbl9zZWNvbmRzJyxcbiAgICAgICAgICBWYWx1ZTogJzM2MDAnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnRW5hYmxlIGhlYWx0aCBjaGVjayBmb3IgdGFyZ2V0cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnU3RhY2snKTtcbiAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywgeyB2cGMgfSk7XG4gICAgY29uc3QgbGlzdGVuZXIgPSBsYi5hZGRMaXN0ZW5lcignTGlzdGVuZXInLCB7IHBvcnQ6IDgwIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGdyb3VwID0gbGlzdGVuZXIuYWRkVGFyZ2V0cygnR3JvdXAnLCB7XG4gICAgICBwb3J0OiA4MCxcbiAgICAgIHRhcmdldHM6IFtuZXcgRmFrZVNlbGZSZWdpc3RlcmluZ1RhcmdldChzdGFjaywgJ1RhcmdldCcsIHZwYyldLFxuICAgIH0pO1xuICAgIGdyb3VwLmNvbmZpZ3VyZUhlYWx0aENoZWNrKHtcbiAgICAgIHVuaGVhbHRoeVRocmVzaG9sZENvdW50OiAzLFxuICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMzApLFxuICAgICAgaW50ZXJ2YWw6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDYwKSxcbiAgICAgIHBhdGg6ICcvdGVzdCcsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6VGFyZ2V0R3JvdXAnLCB7XG4gICAgICBVbmhlYWx0aHlUaHJlc2hvbGRDb3VudDogMyxcbiAgICAgIEhlYWx0aENoZWNrSW50ZXJ2YWxTZWNvbmRzOiA2MCxcbiAgICAgIEhlYWx0aENoZWNrUGF0aDogJy90ZXN0JyxcbiAgICAgIEhlYWx0aENoZWNrVGltZW91dFNlY29uZHM6IDMwLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd2YWxpZGF0aW9uIGVycm9yIGlmIGludmFsaWQgaGVhbHRoIGNoZWNrIHByb3RvY29sJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdTdGFjaycpO1xuICAgIGNvbnN0IGxiID0gbmV3IGVsYnYyLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKHN0YWNrLCAnTEInLCB7IHZwYyB9KTtcbiAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdMaXN0ZW5lcicsIHsgcG9ydDogODAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgZ3JvdXAgPSBsaXN0ZW5lci5hZGRUYXJnZXRzKCdHcm91cCcsIHtcbiAgICAgIHBvcnQ6IDgwLFxuICAgICAgdGFyZ2V0czogW25ldyBGYWtlU2VsZlJlZ2lzdGVyaW5nVGFyZ2V0KHN0YWNrLCAnVGFyZ2V0JywgdnBjKV0sXG4gICAgfSk7XG5cbiAgICBncm91cC5jb25maWd1cmVIZWFsdGhDaGVjayh7XG4gICAgICB1bmhlYWx0aHlUaHJlc2hvbGRDb3VudDogMyxcbiAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDMwKSxcbiAgICAgIGludGVydmFsOiBjZGsuRHVyYXRpb24uc2Vjb25kcyg2MCksXG4gICAgICBwYXRoOiAnL3Rlc3QnLFxuICAgICAgcHJvdG9jb2w6IGVsYnYyLlByb3RvY29sLlRDUCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzOiBzdHJpbmdbXSA9IGdyb3VwLm5vZGUudmFsaWRhdGUoKTtcbiAgICBleHBlY3QodmFsaWRhdGlvbkVycm9ycykudG9FcXVhbChbXCJIZWFsdGggY2hlY2sgcHJvdG9jb2wgJ1RDUCcgaXMgbm90IHN1cHBvcnRlZC4gTXVzdCBiZSBvbmUgb2YgW0hUVFAsIEhUVFBTXVwiXSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZGluZyB0YXJnZXRzIHBhc3NlcyBpbiBwcm92aWRlZCBwcm90b2NvbCB2ZXJzaW9uJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdTdGFjaycpO1xuICAgIGNvbnN0IGxiID0gbmV3IGVsYnYyLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKHN0YWNrLCAnTEInLCB7IHZwYyB9KTtcbiAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdMaXN0ZW5lcicsIHsgcG9ydDogNDQzLCBjZXJ0aWZpY2F0ZXM6IFtpbXBvcnRlZENlcnRpZmljYXRlKHN0YWNrLCAnYXJuOnNvbWVDZXJ0JyldIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGxpc3RlbmVyLmFkZFRhcmdldHMoJ0dyb3VwJywge1xuICAgICAgcG9ydDogNDQzLFxuICAgICAgcHJvdG9jb2xWZXJzaW9uOiBlbGJ2Mi5BcHBsaWNhdGlvblByb3RvY29sVmVyc2lvbi5HUlBDLFxuICAgICAgdGFyZ2V0czogW25ldyBGYWtlU2VsZlJlZ2lzdGVyaW5nVGFyZ2V0KHN0YWNrLCAnVGFyZ2V0JywgdnBjKV0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6VGFyZ2V0R3JvdXAnLCB7XG4gICAgICBQcm90b2NvbFZlcnNpb246ICdHUlBDJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQ2FuIGNhbGwgYWRkVGFyZ2V0R3JvdXBzIG9uIGltcG9ydGVkIGxpc3RlbmVyJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKTtcbiAgICBjb25zdCBsaXN0ZW5lciA9IGVsYnYyLkFwcGxpY2F0aW9uTGlzdGVuZXIuZnJvbUFwcGxpY2F0aW9uTGlzdGVuZXJBdHRyaWJ1dGVzKHN0YWNrLCAnTGlzdGVuZXInLCB7XG4gICAgICBsaXN0ZW5lckFybjogJ2lla3MnLFxuICAgICAgc2VjdXJpdHlHcm91cDogZWMyLlNlY3VyaXR5R3JvdXAuZnJvbVNlY3VyaXR5R3JvdXBJZChzdGFjaywgJ1NHJywgJ3NnLTEyMzQ1JyksXG4gICAgfSk7XG4gICAgY29uc3QgZ3JvdXAgPSBuZXcgZWxidjIuQXBwbGljYXRpb25UYXJnZXRHcm91cChzdGFjaywgJ1RhcmdldEdyb3VwJywgeyB2cGMsIHBvcnQ6IDgwIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGxpc3RlbmVyLmFkZFRhcmdldEdyb3VwcygnR3J1dXVwJywge1xuICAgICAgcHJpb3JpdHk6IDMwLFxuICAgICAgY29uZGl0aW9uczogW2VsYnYyLkxpc3RlbmVyQ29uZGl0aW9uLmhvc3RIZWFkZXJzKFsnZXhhbXBsZS5jb20nXSldLFxuICAgICAgdGFyZ2V0R3JvdXBzOiBbZ3JvdXBdLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyUnVsZScsIHtcbiAgICAgIExpc3RlbmVyQXJuOiAnaWVrcycsXG4gICAgICBQcmlvcml0eTogMzAsXG4gICAgICBBY3Rpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBUYXJnZXRHcm91cEFybjogeyBSZWY6ICdUYXJnZXRHcm91cDNEN0NEOUI4JyB9LFxuICAgICAgICAgIFR5cGU6ICdmb3J3YXJkJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0NhbiBjYWxsIGFkZFRhcmdldEdyb3VwcyBvbiBpbXBvcnRlZCBsaXN0ZW5lciB3aXRoIGNvbmRpdGlvbnMgcHJvcCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgY29uc3QgbGlzdGVuZXIgPSBlbGJ2Mi5BcHBsaWNhdGlvbkxpc3RlbmVyLmZyb21BcHBsaWNhdGlvbkxpc3RlbmVyQXR0cmlidXRlcyhzdGFjaywgJ0xpc3RlbmVyJywge1xuICAgICAgbGlzdGVuZXJBcm46ICdpZWtzJyxcbiAgICAgIHNlY3VyaXR5R3JvdXA6IGVjMi5TZWN1cml0eUdyb3VwLmZyb21TZWN1cml0eUdyb3VwSWQoc3RhY2ssICdTRycsICdzZy0xMjM0NScpLFxuICAgIH0pO1xuICAgIGNvbnN0IGdyb3VwID0gbmV3IGVsYnYyLkFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAoc3RhY2ssICdUYXJnZXRHcm91cCcsIHsgdnBjLCBwb3J0OiA4MCB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBsaXN0ZW5lci5hZGRUYXJnZXRHcm91cHMoJ0dydXV1cCcsIHtcbiAgICAgIHByaW9yaXR5OiAzMCxcbiAgICAgIGNvbmRpdGlvbnM6IFtlbGJ2Mi5MaXN0ZW5lckNvbmRpdGlvbi5ob3N0SGVhZGVycyhbJ2V4YW1wbGUuY29tJ10pXSxcbiAgICAgIHRhcmdldEdyb3VwczogW2dyb3VwXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lclJ1bGUnLCB7XG4gICAgICBMaXN0ZW5lckFybjogJ2lla3MnLFxuICAgICAgUHJpb3JpdHk6IDMwLFxuICAgICAgQWN0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgVGFyZ2V0R3JvdXBBcm46IHsgUmVmOiAnVGFyZ2V0R3JvdXAzRDdDRDlCOCcgfSxcbiAgICAgICAgICBUeXBlOiAnZm9yd2FyZCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdDYW4gZGVwZW5kIG9uIGV2ZW50dWFsIGxpc3RlbmVyIHZpYSBUYXJnZXRHcm91cCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgY29uc3QgbG9hZEJhbGFuY2VyID0gbmV3IGVsYnYyLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKHN0YWNrLCAnTG9hZEJhbGFuY2VyJywgeyB2cGMgfSk7XG4gICAgY29uc3QgZ3JvdXAgPSBuZXcgZWxidjIuQXBwbGljYXRpb25UYXJnZXRHcm91cChzdGFjaywgJ1RhcmdldEdyb3VwJywgeyB2cGMsIHBvcnQ6IDgwIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBSZXNvdXJjZVdpdGhMQkRlcGVuZGVuY3koc3RhY2ssICdTb21lUmVzb3VyY2UnLCBncm91cCk7XG5cbiAgICBsb2FkQmFsYW5jZXIuYWRkTGlzdGVuZXIoJ0xpc3RlbmVyJywge1xuICAgICAgcG9ydDogODAsXG4gICAgICBkZWZhdWx0VGFyZ2V0R3JvdXBzOiBbZ3JvdXBdLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIFNvbWVSZXNvdXJjZToge1xuICAgICAgICAgIFR5cGU6ICdUZXN0OjpSZXNvdXJjZScsXG4gICAgICAgICAgRGVwZW5kc09uOiBbJ0xvYWRCYWxhbmNlckxpc3RlbmVyRTFBMDk5QjknXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSkpO1xuICB9KTtcblxuICB0ZXN0KCdFeGVyY2lzZSBtZXRyaWNzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKTtcbiAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywgeyB2cGMgfSk7XG4gICAgY29uc3QgZ3JvdXAgPSBuZXcgZWxidjIuQXBwbGljYXRpb25UYXJnZXRHcm91cChzdGFjaywgJ1RhcmdldEdyb3VwJywgeyB2cGMsIHBvcnQ6IDgwIH0pO1xuICAgIGxiLmFkZExpc3RlbmVyKCdTb21lTGlzdGVuZXInLCB7XG4gICAgICBwb3J0OiA4MCxcbiAgICAgIGRlZmF1bHRUYXJnZXRHcm91cHM6IFtncm91cF0sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbWV0cmljcyA9IG5ldyBBcnJheTxNZXRyaWM+KCk7XG4gICAgbWV0cmljcy5wdXNoKGdyb3VwLm1ldHJpY3MuaHR0cENvZGVUYXJnZXQoZWxidjIuSHR0cENvZGVUYXJnZXQuVEFSR0VUXzNYWF9DT1VOVCkpO1xuICAgIG1ldHJpY3MucHVzaChncm91cC5tZXRyaWNzLmlwdjZSZXF1ZXN0Q291bnQoKSk7XG4gICAgbWV0cmljcy5wdXNoKGdyb3VwLm1ldHJpY3MudW5oZWFsdGh5SG9zdENvdW50KCkpO1xuICAgIG1ldHJpY3MucHVzaChncm91cC5tZXRyaWNzLnVuaGVhbHRoeUhvc3RDb3VudCgpKTtcbiAgICBtZXRyaWNzLnB1c2goZ3JvdXAubWV0cmljcy5yZXF1ZXN0Q291bnQoKSk7XG4gICAgbWV0cmljcy5wdXNoKGdyb3VwLm1ldHJpY3MudGFyZ2V0Q29ubmVjdGlvbkVycm9yQ291bnQoKSk7XG4gICAgbWV0cmljcy5wdXNoKGdyb3VwLm1ldHJpY3MudGFyZ2V0UmVzcG9uc2VUaW1lKCkpO1xuICAgIG1ldHJpY3MucHVzaChncm91cC5tZXRyaWNzLnRhcmdldFRMU05lZ290aWF0aW9uRXJyb3JDb3VudCgpKTtcblxuICAgIGZvciAoY29uc3QgbWV0cmljIG9mIG1ldHJpY3MpIHtcbiAgICAgIGV4cGVjdChtZXRyaWMubmFtZXNwYWNlKS50b0VxdWFsKCdBV1MvQXBwbGljYXRpb25FTEInKTtcbiAgICAgIGNvbnN0IGxvYWRCYWxhbmNlckFybiA9IHsgUmVmOiAnTEJTb21lTGlzdGVuZXJDQTAxRjFBMCcgfTtcblxuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUobWV0cmljLmRpbWVuc2lvbnMpKS50b0VxdWFsKHtcbiAgICAgICAgVGFyZ2V0R3JvdXA6IHsgJ0ZuOjpHZXRBdHQnOiBbJ1RhcmdldEdyb3VwM0Q3Q0Q5QjgnLCAnVGFyZ2V0R3JvdXBGdWxsTmFtZSddIH0sXG4gICAgICAgIExvYWRCYWxhbmNlcjoge1xuICAgICAgICAgICdGbjo6Sm9pbic6XG4gICAgICAgICAgICBbJycsXG4gICAgICAgICAgICAgIFt7ICdGbjo6U2VsZWN0JzogWzEsIHsgJ0ZuOjpTcGxpdCc6IFsnLycsIGxvYWRCYWxhbmNlckFybl0gfV0gfSxcbiAgICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgICAgeyAnRm46OlNlbGVjdCc6IFsyLCB7ICdGbjo6U3BsaXQnOiBbJy8nLCBsb2FkQmFsYW5jZXJBcm5dIH1dIH0sXG4gICAgICAgICAgICAgICAgJy8nLFxuICAgICAgICAgICAgICAgIHsgJ0ZuOjpTZWxlY3QnOiBbMywgeyAnRm46OlNwbGl0JzogWycvJywgbG9hZEJhbGFuY2VyQXJuXSB9XSB9XV0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIHRlc3QoJ0NhbiBhZGQgZGVwZW5kZW5jeSBvbiBMaXN0ZW5lclJ1bGUgdmlhIFRhcmdldEdyb3VwJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKTtcbiAgICBjb25zdCBsb2FkQmFsYW5jZXIgPSBuZXcgZWxidjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc3RhY2ssICdMb2FkQmFsYW5jZXInLCB7IHZwYyB9KTtcbiAgICBjb25zdCBncm91cDEgPSBuZXcgZWxidjIuQXBwbGljYXRpb25UYXJnZXRHcm91cChzdGFjaywgJ1RhcmdldEdyb3VwMScsIHsgdnBjLCBwb3J0OiA4MCB9KTtcbiAgICBjb25zdCBncm91cDIgPSBuZXcgZWxidjIuQXBwbGljYXRpb25UYXJnZXRHcm91cChzdGFjaywgJ1RhcmdldEdyb3VwMicsIHsgdnBjLCBwb3J0OiA4MCB9KTtcbiAgICBjb25zdCBsaXN0ZW5lciA9IGxvYWRCYWxhbmNlci5hZGRMaXN0ZW5lcignTGlzdGVuZXInLCB7XG4gICAgICBwb3J0OiA4MCxcbiAgICAgIGRlZmF1bHRUYXJnZXRHcm91cHM6IFtncm91cDFdLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBSZXNvdXJjZVdpdGhMQkRlcGVuZGVuY3koc3RhY2ssICdTb21lUmVzb3VyY2UnLCBncm91cDIpO1xuXG4gICAgbGlzdGVuZXIuYWRkVGFyZ2V0R3JvdXBzKCdTZWNvbmRHcm91cCcsIHtcbiAgICAgIGNvbmRpdGlvbnM6IFtlbGJ2Mi5MaXN0ZW5lckNvbmRpdGlvbi5wYXRoUGF0dGVybnMoWycvYmxhJ10pXSxcbiAgICAgIHByaW9yaXR5OiAxMCxcbiAgICAgIHRhcmdldEdyb3VwczogW2dyb3VwMl0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgU29tZVJlc291cmNlOiB7XG4gICAgICAgICAgVHlwZTogJ1Rlc3Q6OlJlc291cmNlJyxcbiAgICAgICAgICBEZXBlbmRzT246IFsnTG9hZEJhbGFuY2VyTGlzdGVuZXJTZWNvbmRHcm91cFJ1bGVGNUZEQzE5NiddLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0NhbiBhZGQgZml4ZWQgcmVzcG9uc2VzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKTtcbiAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ0xvYWRCYWxhbmNlcicsIHtcbiAgICAgIHZwYyxcbiAgICB9KTtcbiAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdMaXN0ZW5lcicsIHtcbiAgICAgIHBvcnQ6IDgwLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGxpc3RlbmVyLmFkZEFjdGlvbignRGVmYXVsdCcsIHtcbiAgICAgIGFjdGlvbjogZWxidjIuTGlzdGVuZXJBY3Rpb24uZml4ZWRSZXNwb25zZSg0MDQsIHtcbiAgICAgICAgY29udGVudFR5cGU6ICd0ZXh0L3BsYWluJyxcbiAgICAgICAgbWVzc2FnZUJvZHk6ICdOb3QgRm91bmQnLFxuICAgICAgfSksXG4gICAgfSk7XG4gICAgbGlzdGVuZXIuYWRkQWN0aW9uKCdIZWxsbycsIHtcbiAgICAgIGFjdGlvbjogZWxidjIuTGlzdGVuZXJBY3Rpb24uZml4ZWRSZXNwb25zZSg1MDMpLFxuICAgICAgY29uZGl0aW9uczogW2VsYnYyLkxpc3RlbmVyQ29uZGl0aW9uLnBhdGhQYXR0ZXJucyhbJy9oZWxsbyddKV0sXG4gICAgICBwcmlvcml0eTogMTAsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TGlzdGVuZXInLCB7XG4gICAgICBEZWZhdWx0QWN0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgRml4ZWRSZXNwb25zZUNvbmZpZzoge1xuICAgICAgICAgICAgQ29udGVudFR5cGU6ICd0ZXh0L3BsYWluJyxcbiAgICAgICAgICAgIE1lc3NhZ2VCb2R5OiAnTm90IEZvdW5kJyxcbiAgICAgICAgICAgIFN0YXR1c0NvZGU6ICc0MDQnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgVHlwZTogJ2ZpeGVkLXJlc3BvbnNlJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lclJ1bGUnLCB7XG4gICAgICBBY3Rpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBGaXhlZFJlc3BvbnNlQ29uZmlnOiB7XG4gICAgICAgICAgICBTdGF0dXNDb2RlOiAnNTAzJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFR5cGU6ICdmaXhlZC1yZXNwb25zZScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdpbXBvcnRlZCBsaXN0ZW5lciBvbmx5IG5lZWQgc2VjdXJpdHlHcm91cCBhbmQgbGlzdGVuZXJBcm4gYXMgYXR0cmlidXRlcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgaW1wb3J0ZWRMaXN0ZW5lciA9IGVsYnYyLkFwcGxpY2F0aW9uTGlzdGVuZXIuZnJvbUFwcGxpY2F0aW9uTGlzdGVuZXJBdHRyaWJ1dGVzKHN0YWNrLCAnbGlzdGVuZXInLCB7XG4gICAgICBsaXN0ZW5lckFybjogJ2xpc3RlbmVyLWFybicsXG4gICAgICBkZWZhdWx0UG9ydDogNDQzLFxuICAgICAgc2VjdXJpdHlHcm91cDogZWMyLlNlY3VyaXR5R3JvdXAuZnJvbVNlY3VyaXR5R3JvdXBJZChzdGFjaywgJ1NHJywgJ3NlY3VyaXR5LWdyb3VwLWlkJywge1xuICAgICAgICBhbGxvd0FsbE91dGJvdW5kOiBmYWxzZSxcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIGltcG9ydGVkTGlzdGVuZXIuYWRkQWN0aW9uKCdIZWxsbycsIHtcbiAgICAgIGFjdGlvbjogZWxidjIuTGlzdGVuZXJBY3Rpb24uZml4ZWRSZXNwb25zZSg1MDMpLFxuICAgICAgY29uZGl0aW9uczogW2VsYnYyLkxpc3RlbmVyQ29uZGl0aW9uLnBhdGhQYXR0ZXJucyhbJy9oZWxsbyddKV0sXG4gICAgICBwcmlvcml0eTogMTAsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lclJ1bGUnLCB7XG4gICAgICBMaXN0ZW5lckFybjogJ2xpc3RlbmVyLWFybicsXG4gICAgICBQcmlvcml0eTogMTAsXG4gICAgICBBY3Rpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBGaXhlZFJlc3BvbnNlQ29uZmlnOiB7XG4gICAgICAgICAgICBTdGF0dXNDb2RlOiAnNTAzJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFR5cGU6ICdmaXhlZC1yZXNwb25zZScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdDYW4gYWRkIGFjdGlvbnMgdG8gYW4gaW1wb3J0ZWQgbGlzdGVuZXInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKTtcbiAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ0xvYWRCYWxhbmNlcicsIHtcbiAgICAgIHZwYyxcbiAgICB9KTtcbiAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdMaXN0ZW5lcicsIHtcbiAgICAgIHBvcnQ6IDgwLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGxpc3RlbmVyLmFkZEFjdGlvbignRGVmYXVsdCcsIHtcbiAgICAgIGFjdGlvbjogZWxidjIuTGlzdGVuZXJBY3Rpb24uZml4ZWRSZXNwb25zZSg0MDQsIHtcbiAgICAgICAgY29udGVudFR5cGU6ICd0ZXh0L3BsYWluJyxcbiAgICAgICAgbWVzc2FnZUJvZHk6ICdOb3QgRm91bmQnLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICBjb25zdCBpbXBvcnRlZExpc3RlbmVyID0gZWxidjIuQXBwbGljYXRpb25MaXN0ZW5lci5mcm9tQXBwbGljYXRpb25MaXN0ZW5lckF0dHJpYnV0ZXMoc3RhY2syLCAnbGlzdGVuZXInLCB7XG4gICAgICBsaXN0ZW5lckFybjogJ2xpc3RlbmVyLWFybicsXG4gICAgICBkZWZhdWx0UG9ydDogNDQzLFxuICAgICAgc2VjdXJpdHlHcm91cDogZWMyLlNlY3VyaXR5R3JvdXAuZnJvbVNlY3VyaXR5R3JvdXBJZChzdGFjazIsICdTRycsICdzZWN1cml0eS1ncm91cC1pZCcsIHtcbiAgICAgICAgYWxsb3dBbGxPdXRib3VuZDogZmFsc2UsXG4gICAgICB9KSxcbiAgICB9KTtcbiAgICBpbXBvcnRlZExpc3RlbmVyLmFkZEFjdGlvbignSGVsbG8nLCB7XG4gICAgICBhY3Rpb246IGVsYnYyLkxpc3RlbmVyQWN0aW9uLmZpeGVkUmVzcG9uc2UoNTAzKSxcbiAgICAgIGNvbmRpdGlvbnM6IFtlbGJ2Mi5MaXN0ZW5lckNvbmRpdGlvbi5wYXRoUGF0dGVybnMoWycvaGVsbG8nXSldLFxuICAgICAgcHJpb3JpdHk6IDEwLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyJywge1xuICAgICAgRGVmYXVsdEFjdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEZpeGVkUmVzcG9uc2VDb25maWc6IHtcbiAgICAgICAgICAgIENvbnRlbnRUeXBlOiAndGV4dC9wbGFpbicsXG4gICAgICAgICAgICBNZXNzYWdlQm9keTogJ05vdCBGb3VuZCcsXG4gICAgICAgICAgICBTdGF0dXNDb2RlOiAnNDA0JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFR5cGU6ICdmaXhlZC1yZXNwb25zZScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrMikuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyUnVsZScsIHtcbiAgICAgIExpc3RlbmVyQXJuOiAnbGlzdGVuZXItYXJuJyxcbiAgICAgIFByaW9yaXR5OiAxMCxcbiAgICAgIEFjdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEZpeGVkUmVzcG9uc2VDb25maWc6IHtcbiAgICAgICAgICAgIFN0YXR1c0NvZGU6ICc1MDMnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgVHlwZTogJ2ZpeGVkLXJlc3BvbnNlJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FjdGlvbnMgYWRkZWQgdG8gYW4gaW1wb3J0ZWQgbGlzdGVuZXIgbXVzdCBoYXZlIGEgcHJpb3JpdHknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IGltcG9ydGVkTGlzdGVuZXIgPSBlbGJ2Mi5BcHBsaWNhdGlvbkxpc3RlbmVyLmZyb21BcHBsaWNhdGlvbkxpc3RlbmVyQXR0cmlidXRlcyhzdGFjaywgJ2xpc3RlbmVyJywge1xuICAgICAgbGlzdGVuZXJBcm46ICdsaXN0ZW5lci1hcm4nLFxuICAgICAgZGVmYXVsdFBvcnQ6IDQ0MyxcbiAgICAgIHNlY3VyaXR5R3JvdXA6IGVjMi5TZWN1cml0eUdyb3VwLmZyb21TZWN1cml0eUdyb3VwSWQoc3RhY2ssICdTRycsICdzZWN1cml0eS1ncm91cC1pZCcsIHtcbiAgICAgICAgYWxsb3dBbGxPdXRib3VuZDogZmFsc2UsXG4gICAgICB9KSxcbiAgICB9KTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgaW1wb3J0ZWRMaXN0ZW5lci5hZGRBY3Rpb24oJ0hlbGxvJywge1xuICAgICAgICBhY3Rpb246IGVsYnYyLkxpc3RlbmVyQWN0aW9uLmZpeGVkUmVzcG9uc2UoNTAzKSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL3ByaW9yaXR5IG11c3QgYmUgc2V0IGZvciBhY3Rpb25zIGFkZGVkIHRvIGFuIGltcG9ydGVkIGxpc3RlbmVyLyk7XG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCdDYW4gYWRkIHJlZGlyZWN0IHJlc3BvbnNlcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgY29uc3QgbGIgPSBuZXcgZWxidjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc3RhY2ssICdMb2FkQmFsYW5jZXInLCB7XG4gICAgICB2cGMsXG4gICAgfSk7XG4gICAgY29uc3QgbGlzdGVuZXIgPSBsYi5hZGRMaXN0ZW5lcignTGlzdGVuZXInLCB7XG4gICAgICBwb3J0OiA4MCxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBsaXN0ZW5lci5hZGRSZWRpcmVjdFJlc3BvbnNlKCdEZWZhdWx0Jywge1xuICAgICAgc3RhdHVzQ29kZTogJ0hUVFBfMzAxJyxcbiAgICAgIHBvcnQ6ICc0NDMnLFxuICAgICAgcHJvdG9jb2w6ICdIVFRQUycsXG4gICAgfSk7XG4gICAgbGlzdGVuZXIuYWRkUmVkaXJlY3RSZXNwb25zZSgnSGVsbG8nLCB7XG4gICAgICBwcmlvcml0eTogMTAsXG4gICAgICBjb25kaXRpb25zOiBbZWxidjIuTGlzdGVuZXJDb25kaXRpb24ucGF0aFBhdHRlcm5zKFsnL2hlbGxvJ10pXSxcbiAgICAgIHBhdGg6ICcvbmV3LyN7cGF0aH0nLFxuICAgICAgc3RhdHVzQ29kZTogJ0hUVFBfMzAyJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lcicsIHtcbiAgICAgIERlZmF1bHRBY3Rpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZWRpcmVjdENvbmZpZzoge1xuICAgICAgICAgICAgUG9ydDogJzQ0MycsXG4gICAgICAgICAgICBQcm90b2NvbDogJ0hUVFBTJyxcbiAgICAgICAgICAgIFN0YXR1c0NvZGU6ICdIVFRQXzMwMScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBUeXBlOiAncmVkaXJlY3QnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyUnVsZScsIHtcbiAgICAgIEFjdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFJlZGlyZWN0Q29uZmlnOiB7XG4gICAgICAgICAgICBQYXRoOiAnL25ldy8je3BhdGh9JyxcbiAgICAgICAgICAgIFN0YXR1c0NvZGU6ICdIVFRQXzMwMicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBUeXBlOiAncmVkaXJlY3QnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQ2FuIGFkZCBzaW1wbGUgcmVkaXJlY3QgcmVzcG9uc2VzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKTtcbiAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ0xvYWRCYWxhbmNlcicsIHtcbiAgICAgIHZwYyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBsYi5hZGRSZWRpcmVjdCgpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyJywge1xuICAgICAgUG9ydDogODAsXG4gICAgICBQcm90b2NvbDogJ0hUVFAnLFxuICAgICAgRGVmYXVsdEFjdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFJlZGlyZWN0Q29uZmlnOiB7XG4gICAgICAgICAgICBQb3J0OiAnNDQzJyxcbiAgICAgICAgICAgIFByb3RvY29sOiAnSFRUUFMnLFxuICAgICAgICAgICAgU3RhdHVzQ29kZTogJ0hUVFBfMzAxJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFR5cGU6ICdyZWRpcmVjdCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdDYW4gc3VwcmVzcyBkZWZhdWx0IGluZ3Jlc3MgcnVsZXMgb24gYSBzaW1wbGUgcmVkaXJlY3QgcmVzcG9uc2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG5cbiAgICBjb25zdCBsb2FkQmFsYW5jZXIgPSBuZXcgZWxidjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc3RhY2ssICdMQicsIHtcbiAgICAgIHZwYyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBsb2FkQmFsYW5jZXIuYWRkUmVkaXJlY3QoeyBvcGVuOiBmYWxzZSB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBtYXRjaGluZ0dyb3VwcyA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuZmluZFJlc291cmNlcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXAnLCB7XG4gICAgICBTZWN1cml0eUdyb3VwSW5ncmVzczogW1xuICAgICAgICB7XG4gICAgICAgICAgQ2lkcklwOiAnMC4wLjAuMC8wJyxcbiAgICAgICAgICBEZXNjcmlwdGlvbjogJ0FsbG93IGZyb20gYW55b25lIG9uIHBvcnQgODAnLFxuICAgICAgICAgIElwUHJvdG9jb2w6ICd0Y3AnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgICBleHBlY3QoT2JqZWN0LmtleXMobWF0Y2hpbmdHcm91cHMpLmxlbmd0aCkudG9CZSgwKTtcbiAgfSk7XG5cbiAgdGVzdCgnQ2FuIGFkZCBzaW1wbGUgcmVkaXJlY3QgcmVzcG9uc2VzIHdpdGggY3VzdG9tIHZhbHVlcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgY29uc3QgbGIgPSBuZXcgZWxidjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc3RhY2ssICdMb2FkQmFsYW5jZXInLCB7XG4gICAgICB2cGMsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbGlzdGVuZXIgPSBsYi5hZGRSZWRpcmVjdCh7XG4gICAgICBzb3VyY2VQcm90b2NvbDogZWxidjIuQXBwbGljYXRpb25Qcm90b2NvbC5IVFRQUyxcbiAgICAgIHNvdXJjZVBvcnQ6IDg0NDMsXG4gICAgICB0YXJnZXRQcm90b2NvbDogZWxidjIuQXBwbGljYXRpb25Qcm90b2NvbC5IVFRQLFxuICAgICAgdGFyZ2V0UG9ydDogODA4MCxcbiAgICB9KTtcbiAgICBsaXN0ZW5lci5hZGRDZXJ0aWZpY2F0ZXMoJ0xpc3RlbmVyQ2VydGlmaWNhdGVYJywgW2ltcG9ydGVkQ2VydGlmaWNhdGUoc3RhY2ssICdjZXJ0MycpXSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TGlzdGVuZXInLCB7XG4gICAgICBQb3J0OiA4NDQzLFxuICAgICAgUHJvdG9jb2w6ICdIVFRQUycsXG4gICAgICBEZWZhdWx0QWN0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgUmVkaXJlY3RDb25maWc6IHtcbiAgICAgICAgICAgIFBvcnQ6ICc4MDgwJyxcbiAgICAgICAgICAgIFByb3RvY29sOiAnSFRUUCcsXG4gICAgICAgICAgICBTdGF0dXNDb2RlOiAnSFRUUF8zMDEnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgVHlwZTogJ3JlZGlyZWN0JyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0NhbiBjb25maWd1cmUgZGVyZWdpc3RyYXRpb25fZGVsYXkgZm9yIHRhcmdldHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVsYnYyLkFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAoc3RhY2ssICdUYXJnZXRHcm91cCcsIHtcbiAgICAgIHZwYyxcbiAgICAgIHBvcnQ6IDgwLFxuICAgICAgZGVyZWdpc3RyYXRpb25EZWxheTogY2RrLkR1cmF0aW9uLnNlY29uZHMoMzApLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OlRhcmdldEdyb3VwJywge1xuICAgICAgVGFyZ2V0R3JvdXBBdHRyaWJ1dGVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBLZXk6ICdkZXJlZ2lzdHJhdGlvbl9kZWxheS50aW1lb3V0X3NlY29uZHMnLFxuICAgICAgICAgIFZhbHVlOiAnMzAnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgS2V5OiAnc3RpY2tpbmVzcy5lbmFibGVkJyxcbiAgICAgICAgICBWYWx1ZTogJ2ZhbHNlJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0N1c3RvbSBMb2FkIGJhbGFuY2VyIGFsZ29yaXRobSB0eXBlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKTtcbiAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywgeyB2cGMgfSk7XG4gICAgY29uc3QgbGlzdGVuZXIgPSBsYi5hZGRMaXN0ZW5lcignTGlzdGVuZXInLCB7IHBvcnQ6IDgwIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGxpc3RlbmVyLmFkZFRhcmdldHMoJ0dyb3VwJywge1xuICAgICAgcG9ydDogODAsXG4gICAgICB0YXJnZXRzOiBbbmV3IEZha2VTZWxmUmVnaXN0ZXJpbmdUYXJnZXQoc3RhY2ssICdUYXJnZXQnLCB2cGMpXSxcbiAgICAgIGxvYWRCYWxhbmNpbmdBbGdvcml0aG1UeXBlOiBlbGJ2Mi5UYXJnZXRHcm91cExvYWRCYWxhbmNpbmdBbGdvcml0aG1UeXBlLkxFQVNUX09VVFNUQU5ESU5HX1JFUVVFU1RTLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OlRhcmdldEdyb3VwJywge1xuICAgICAgVGFyZ2V0R3JvdXBBdHRyaWJ1dGVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBLZXk6ICdzdGlja2luZXNzLmVuYWJsZWQnLFxuICAgICAgICAgIFZhbHVlOiAnZmFsc2UnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgS2V5OiAnbG9hZF9iYWxhbmNpbmcuYWxnb3JpdGhtLnR5cGUnLFxuICAgICAgICAgIFZhbHVlOiAnbGVhc3Rfb3V0c3RhbmRpbmdfcmVxdWVzdHMnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmVEZXByZWNhdGVkKCdUaHJvd3Mgd2l0aCBiYWQgZml4ZWQgcmVzcG9uc2VzJywgKCkgPT4ge1xuXG4gICAgdGVzdCgnc3RhdHVzIGNvZGUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycpO1xuICAgICAgY29uc3QgbGIgPSBuZXcgZWxidjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc3RhY2ssICdMb2FkQmFsYW5jZXInLCB7XG4gICAgICAgIHZwYyxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgbGlzdGVuZXIgPSBsYi5hZGRMaXN0ZW5lcignTGlzdGVuZXInLCB7XG4gICAgICAgIHBvcnQ6IDgwLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiBsaXN0ZW5lci5hZGRGaXhlZFJlc3BvbnNlKCdEZWZhdWx0Jywge1xuICAgICAgICBzdGF0dXNDb2RlOiAnMzAxJyxcbiAgICAgIH0pKS50b1Rocm93KC9gc3RhdHVzQ29kZWAvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ21lc3NhZ2UgYm9keScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ0xvYWRCYWxhbmNlcicsIHtcbiAgICAgICAgdnBjLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdMaXN0ZW5lcicsIHtcbiAgICAgICAgcG9ydDogODAsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IGxpc3RlbmVyLmFkZEZpeGVkUmVzcG9uc2UoJ0RlZmF1bHQnLCB7XG4gICAgICAgIG1lc3NhZ2VCb2R5OiAnYScucmVwZWF0KDEwMjUpLFxuICAgICAgICBzdGF0dXNDb2RlOiAnNTAwJyxcbiAgICAgIH0pKS50b1Rocm93KC9gbWVzc2FnZUJvZHlgLyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlRGVwcmVjYXRlZCgnVGhyb3dzIHdpdGggYmFkIHJlZGlyZWN0IHJlc3BvbnNlcycsICgpID0+IHtcblxuICAgIHRlc3QoJ3N0YXR1cyBjb2RlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKTtcbiAgICAgIGNvbnN0IGxiID0gbmV3IGVsYnYyLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKHN0YWNrLCAnTG9hZEJhbGFuY2VyJywge1xuICAgICAgICB2cGMsXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGxpc3RlbmVyID0gbGIuYWRkTGlzdGVuZXIoJ0xpc3RlbmVyJywge1xuICAgICAgICBwb3J0OiA4MCxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4gbGlzdGVuZXIuYWRkUmVkaXJlY3RSZXNwb25zZSgnRGVmYXVsdCcsIHtcbiAgICAgICAgc3RhdHVzQ29kZTogJzMwMScsXG4gICAgICB9KSkudG9UaHJvdygvYHN0YXR1c0NvZGVgLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdwcm90b2NvbCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ0xvYWRCYWxhbmNlcicsIHtcbiAgICAgICAgdnBjLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdMaXN0ZW5lcicsIHtcbiAgICAgICAgcG9ydDogODAsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IGxpc3RlbmVyLmFkZFJlZGlyZWN0UmVzcG9uc2UoJ0RlZmF1bHQnLCB7XG4gICAgICAgIHByb3RvY29sOiAndGNwJyxcbiAgICAgICAgc3RhdHVzQ29kZTogJ0hUVFBfMzAxJyxcbiAgICAgIH0pKS50b1Rocm93KC9gcHJvdG9jb2xgLyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ1Rocm93cyB3aGVuIHNwZWNpZnlpbmcgYm90aCB0YXJnZXQgZ3JvdXBzIGFuZCBhbiBhY3Rpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycpO1xuICAgIGNvbnN0IGxiID0gbmV3IGVsYnYyLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKHN0YWNrLCAnTG9hZEJhbGFuY2VyJywge1xuICAgICAgdnBjLFxuICAgIH0pO1xuICAgIGNvbnN0IGxpc3RlbmVyID0gbGIuYWRkTGlzdGVuZXIoJ0xpc3RlbmVyJywge1xuICAgICAgcG9ydDogODAsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxpc3RlbmVyUnVsZShzdGFjaywgJ1J1bGUnLCB7XG4gICAgICBhY3Rpb246IGVsYnYyLkxpc3RlbmVyQWN0aW9uLmZpeGVkUmVzcG9uc2UoNTAwKSxcbiAgICAgIGxpc3RlbmVyLFxuICAgICAgcHJpb3JpdHk6IDEwLFxuICAgICAgY29uZGl0aW9uczogW2VsYnYyLkxpc3RlbmVyQ29uZGl0aW9uLnBhdGhQYXR0ZXJucyhbJy9oZWxsbyddKV0sXG4gICAgICB0YXJnZXRHcm91cHM6IFtuZXcgZWxidjIuQXBwbGljYXRpb25UYXJnZXRHcm91cChzdGFjaywgJ1RhcmdldEdyb3VwJywgeyB2cGMsIHBvcnQ6IDgwIH0pXSxcbiAgICB9KSkudG9UaHJvdygvJ2FjdGlvbix0YXJnZXRHcm91cHMnLiovKTtcbiAgfSk7XG5cbiAgdGVzdCgnVGhyb3dzIHdoZW4gc3BlY2lmeWluZyBwcmlvcml0eSAwJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKTtcbiAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ0xvYWRCYWxhbmNlcicsIHtcbiAgICAgIHZwYyxcbiAgICB9KTtcbiAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdMaXN0ZW5lcicsIHtcbiAgICAgIHBvcnQ6IDgwLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBuZXcgZWxidjIuQXBwbGljYXRpb25MaXN0ZW5lclJ1bGUoc3RhY2ssICdSdWxlJywge1xuICAgICAgYWN0aW9uOiBlbGJ2Mi5MaXN0ZW5lckFjdGlvbi5maXhlZFJlc3BvbnNlKDUwMCksXG4gICAgICBsaXN0ZW5lcixcbiAgICAgIHByaW9yaXR5OiAwLFxuICAgICAgY29uZGl0aW9uczogW2VsYnYyLkxpc3RlbmVyQ29uZGl0aW9uLnBhdGhQYXR0ZXJucyhbJy9oZWxsbyddKV0sXG4gICAgfSkpLnRvVGhyb3dFcnJvcignUHJpb3JpdHkgbXVzdCBoYXZlIHZhbHVlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byAxJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ0FjY2VwdHMgdW5yZXNvbHZlZCBwcmlvcml0eScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgY29uc3QgbGIgPSBuZXcgZWxidjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc3RhY2ssICdMb2FkQmFsYW5jZXInLCB7XG4gICAgICB2cGMsXG4gICAgfSk7XG4gICAgY29uc3QgbGlzdGVuZXIgPSBsYi5hZGRMaXN0ZW5lcignTGlzdGVuZXInLCB7XG4gICAgICBwb3J0OiA4MCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gbmV3IGVsYnYyLkFwcGxpY2F0aW9uTGlzdGVuZXJSdWxlKHN0YWNrLCAnUnVsZScsIHtcbiAgICAgIGxpc3RlbmVyLFxuICAgICAgcHJpb3JpdHk6IG5ldyBjZGsuQ2ZuUGFyYW1ldGVyKHN0YWNrLCAnUHJpb3JpdHlQYXJhbScsIHsgdHlwZTogJ051bWJlcicgfSkudmFsdWVBc051bWJlcixcbiAgICAgIGNvbmRpdGlvbnM6IFtlbGJ2Mi5MaXN0ZW5lckNvbmRpdGlvbi5wYXRoUGF0dGVybnMoWycvaGVsbG8nXSldLFxuICAgICAgZml4ZWRSZXNwb25zZToge1xuICAgICAgICBzdGF0dXNDb2RlOiAnNTAwJyxcbiAgICAgIH0sXG4gICAgfSkpLm5vdC50b1Rocm93RXJyb3IoJ1ByaW9yaXR5IG11c3QgaGF2ZSB2YWx1ZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gMScpO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnVGhyb3dzIHdoZW4gc3BlY2lmeWluZyBib3RoIHRhcmdldCBncm91cHMgYW5kIHJlZGlyZWN0IHJlc3BvbnNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKTtcbiAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ0xvYWRCYWxhbmNlcicsIHtcbiAgICAgIHZwYyxcbiAgICB9KTtcbiAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdMaXN0ZW5lcicsIHtcbiAgICAgIHBvcnQ6IDgwLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBuZXcgZWxidjIuQXBwbGljYXRpb25MaXN0ZW5lclJ1bGUoc3RhY2ssICdSdWxlJywge1xuICAgICAgbGlzdGVuZXIsXG4gICAgICBwcmlvcml0eTogMTAsXG4gICAgICBjb25kaXRpb25zOiBbZWxidjIuTGlzdGVuZXJDb25kaXRpb24ucGF0aFBhdHRlcm5zKFsnL2hlbGxvJ10pXSxcbiAgICAgIHRhcmdldEdyb3VwczogW25ldyBlbGJ2Mi5BcHBsaWNhdGlvblRhcmdldEdyb3VwKHN0YWNrLCAnVGFyZ2V0R3JvdXAnLCB7IHZwYywgcG9ydDogODAgfSldLFxuICAgICAgcmVkaXJlY3RSZXNwb25zZToge1xuICAgICAgICBzdGF0dXNDb2RlOiAnSFRUUF8zMDEnLFxuICAgICAgfSxcbiAgICB9KSkudG9UaHJvdygvJ3RhcmdldEdyb3VwcyxyZWRpcmVjdFJlc3BvbnNlJy4qLyk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IGVsYnYyLkFwcGxpY2F0aW9uTGlzdGVuZXJSdWxlKHN0YWNrLCAnUnVsZTInLCB7XG4gICAgICBsaXN0ZW5lcixcbiAgICAgIHByaW9yaXR5OiAxMCxcbiAgICAgIGNvbmRpdGlvbnM6IFtlbGJ2Mi5MaXN0ZW5lckNvbmRpdGlvbi5wYXRoUGF0dGVybnMoWycvaGVsbG8nXSldLFxuICAgICAgdGFyZ2V0R3JvdXBzOiBbbmV3IGVsYnYyLkFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAoc3RhY2ssICdUYXJnZXRHcm91cDInLCB7IHZwYywgcG9ydDogODAgfSldLFxuICAgICAgZml4ZWRSZXNwb25zZToge1xuICAgICAgICBzdGF0dXNDb2RlOiAnNTAwJyxcbiAgICAgIH0sXG4gICAgICByZWRpcmVjdFJlc3BvbnNlOiB7XG4gICAgICAgIHN0YXR1c0NvZGU6ICdIVFRQXzMwMScsXG4gICAgICB9LFxuICAgIH0pKS50b1Rocm93KC8ndGFyZ2V0R3JvdXBzLGZpeGVkUmVzcG9uc2UscmVkaXJlY3RSZXNwb25zZScuKi8pO1xuICB9KTtcblxuICB0ZXN0KCdJbXBvcnRlZCBsaXN0ZW5lciB3aXRoIGltcG9ydGVkIHNlY3VyaXR5IGdyb3VwIGFuZCBhbGxvd0FsbE91dGJvdW5kIHNldCB0byBmYWxzZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGxpc3RlbmVyID0gZWxidjIuQXBwbGljYXRpb25MaXN0ZW5lci5mcm9tQXBwbGljYXRpb25MaXN0ZW5lckF0dHJpYnV0ZXMoc3RhY2ssICdMaXN0ZW5lcicsIHtcbiAgICAgIGxpc3RlbmVyQXJuOiAnbGlzdGVuZXItYXJuJyxcbiAgICAgIGRlZmF1bHRQb3J0OiA0NDMsXG4gICAgICBzZWN1cml0eUdyb3VwOiBlYzIuU2VjdXJpdHlHcm91cC5mcm9tU2VjdXJpdHlHcm91cElkKHN0YWNrLCAnU0cnLCAnc2VjdXJpdHktZ3JvdXAtaWQnLCB7XG4gICAgICAgIGFsbG93QWxsT3V0Ym91bmQ6IGZhbHNlLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbGlzdGVuZXIuY29ubmVjdGlvbnMuYWxsb3dUb0FueUlwdjQoZWMyLlBvcnQudGNwKDQ0MykpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U2VjdXJpdHlHcm91cEVncmVzcycsIHtcbiAgICAgIEdyb3VwSWQ6ICdzZWN1cml0eS1ncm91cC1pZCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0NhbiBwYXNzIG11bHRpcGxlIGNlcnRpZmljYXRlIGFybnMgdG8gYXBwbGljYXRpb24gbGlzdGVuZXIgY29uc3RydWN0b3InLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG4gICAgY29uc3QgbGIgPSBuZXcgZWxidjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc3RhY2ssICdMQicsIHsgdnBjIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGxiLmFkZExpc3RlbmVyKCdMaXN0ZW5lcicsIHtcbiAgICAgIHBvcnQ6IDQ0MyxcbiAgICAgIGNlcnRpZmljYXRlczogW1xuICAgICAgICBpbXBvcnRlZENlcnRpZmljYXRlKHN0YWNrLCAnY2VydDEnKSxcbiAgICAgICAgaW1wb3J0ZWRDZXJ0aWZpY2F0ZShzdGFjaywgJ2NlcnQyJyksXG4gICAgICBdLFxuICAgICAgZGVmYXVsdFRhcmdldEdyb3VwczogW25ldyBlbGJ2Mi5BcHBsaWNhdGlvblRhcmdldEdyb3VwKHN0YWNrLCAnR3JvdXAnLCB7IHZwYywgcG9ydDogODAgfSldLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyJywge1xuICAgICAgUHJvdG9jb2w6ICdIVFRQUycsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lckNlcnRpZmljYXRlJywge1xuICAgICAgQ2VydGlmaWNhdGVzOiBbeyBDZXJ0aWZpY2F0ZUFybjogJ2NlcnQyJyB9XSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQ2FuIHVzZSBjZXJ0aWZpY2F0ZSB3cmFwcGVyIGNsYXNzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdTdGFjaycpO1xuICAgIGNvbnN0IGxiID0gbmV3IGVsYnYyLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKHN0YWNrLCAnTEInLCB7IHZwYyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBsYi5hZGRMaXN0ZW5lcignTGlzdGVuZXInLCB7XG4gICAgICBwb3J0OiA0NDMsXG4gICAgICBjZXJ0aWZpY2F0ZXM6IFtlbGJ2Mi5MaXN0ZW5lckNlcnRpZmljYXRlLmZyb21Bcm4oJ2NlcnQxJyksIGVsYnYyLkxpc3RlbmVyQ2VydGlmaWNhdGUuZnJvbUFybignY2VydDInKV0sXG4gICAgICBkZWZhdWx0VGFyZ2V0R3JvdXBzOiBbbmV3IGVsYnYyLkFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAoc3RhY2ssICdHcm91cCcsIHsgdnBjLCBwb3J0OiA4MCB9KV0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TGlzdGVuZXInLCB7XG4gICAgICBQcm90b2NvbDogJ0hUVFBTJyxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyQ2VydGlmaWNhdGUnLCB7XG4gICAgICBDZXJ0aWZpY2F0ZXM6IFt7IENlcnRpZmljYXRlQXJuOiAnY2VydDInIH1dLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnQ2FuIGFkZCBhZGRpdGlvbmFsIGNlcnRpZmljYXRlcyB2aWEgYWRkQ2VydGlmaWNhdGVBcm5zIHRvIGFwcGxpY2F0aW9uIGxpc3RlbmVyJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdTdGFjaycpO1xuICAgIGNvbnN0IGxiID0gbmV3IGVsYnYyLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKHN0YWNrLCAnTEInLCB7IHZwYyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdMaXN0ZW5lcicsIHtcbiAgICAgIHBvcnQ6IDQ0MyxcbiAgICAgIGNlcnRpZmljYXRlQXJuczogWydjZXJ0MScsICdjZXJ0MiddLFxuICAgICAgZGVmYXVsdFRhcmdldEdyb3VwczogW25ldyBlbGJ2Mi5BcHBsaWNhdGlvblRhcmdldEdyb3VwKHN0YWNrLCAnR3JvdXAnLCB7IHZwYywgcG9ydDogODAgfSldLFxuICAgIH0pO1xuXG4gICAgbGlzdGVuZXIuYWRkQ2VydGlmaWNhdGVBcm5zKCdMaXN0ZW5lckNlcnRpZmljYXRlWCcsIFsnY2VydDMnXSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TGlzdGVuZXInLCB7XG4gICAgICBQcm90b2NvbDogJ0hUVFBTJyxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyQ2VydGlmaWNhdGUnLCB7XG4gICAgICBDZXJ0aWZpY2F0ZXM6IFt7IENlcnRpZmljYXRlQXJuOiAnY2VydDInIH1dLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TGlzdGVuZXJDZXJ0aWZpY2F0ZScsIHtcbiAgICAgIENlcnRpZmljYXRlczogW3sgQ2VydGlmaWNhdGVBcm46ICdjZXJ0MycgfV0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0NhbiBhZGQgbXVsdGlwbGUgcGF0aCBwYXR0ZXJucyB0byBsaXN0ZW5lciBydWxlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdTdGFjaycpO1xuICAgIGNvbnN0IGxiID0gbmV3IGVsYnYyLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKHN0YWNrLCAnTEInLCB7IHZwYyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdMaXN0ZW5lcicsIHtcbiAgICAgIHBvcnQ6IDQ0MyxcbiAgICAgIGNlcnRpZmljYXRlczogW2ltcG9ydGVkQ2VydGlmaWNhdGUoc3RhY2ssICdjZXJ0MScpLCBpbXBvcnRlZENlcnRpZmljYXRlKHN0YWNrLCAnY2VydDInKV0sXG4gICAgICBkZWZhdWx0VGFyZ2V0R3JvdXBzOiBbbmV3IGVsYnYyLkFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAoc3RhY2ssICdHcm91cCcsIHsgdnBjLCBwb3J0OiA4MCB9KV0sXG4gICAgfSk7XG5cbiAgICBsaXN0ZW5lci5hZGRUYXJnZXRzKCdUYXJnZXQxJywge1xuICAgICAgcHJpb3JpdHk6IDEwLFxuICAgICAgY29uZGl0aW9uczogW2VsYnYyLkxpc3RlbmVyQ29uZGl0aW9uLnBhdGhQYXR0ZXJucyhbJy90ZXN0L3BhdGgvMScsICcvdGVzdC9wYXRoLzInXSldLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyUnVsZScsIHtcbiAgICAgIFByaW9yaXR5OiAxMCxcbiAgICAgIENvbmRpdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEZpZWxkOiAncGF0aC1wYXR0ZXJuJyxcbiAgICAgICAgICBQYXRoUGF0dGVybkNvbmZpZzogeyBWYWx1ZXM6IFsnL3Rlc3QvcGF0aC8xJywgJy90ZXN0L3BhdGgvMiddIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnQ2Fubm90IGFkZCBwYXRoUGF0dGVybiBhbmQgcGF0aFBhdHRlcm5zIHRvIGxpc3RlbmVyIHJ1bGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG4gICAgY29uc3QgbGIgPSBuZXcgZWxidjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc3RhY2ssICdMQicsIHsgdnBjIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGxpc3RlbmVyID0gbGIuYWRkTGlzdGVuZXIoJ0xpc3RlbmVyJywge1xuICAgICAgcG9ydDogNDQzLFxuICAgICAgY2VydGlmaWNhdGVzOiBbaW1wb3J0ZWRDZXJ0aWZpY2F0ZShzdGFjaywgJ2NlcnQxJyksIGltcG9ydGVkQ2VydGlmaWNhdGUoc3RhY2ssICdjZXJ0MicpXSxcbiAgICAgIGRlZmF1bHRUYXJnZXRHcm91cHM6IFtuZXcgZWxidjIuQXBwbGljYXRpb25UYXJnZXRHcm91cChzdGFjaywgJ0dyb3VwJywgeyB2cGMsIHBvcnQ6IDgwIH0pXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gbGlzdGVuZXIuYWRkVGFyZ2V0cygnVGFyZ2V0MScsIHtcbiAgICAgIHByaW9yaXR5OiAxMCxcbiAgICAgIHBhdGhQYXR0ZXJuczogWycvdGVzdC9wYXRoLzEnLCAnL3Rlc3QvcGF0aC8yJ10sXG4gICAgICBwYXRoUGF0dGVybjogJy90ZXN0L3BhdGgvMycsXG4gICAgfSkpLnRvVGhyb3dFcnJvcignQm90aCBgcGF0aFBhdHRlcm5zYCBhbmQgYHBhdGhQYXR0ZXJuYCBhcmUgc3BlY2lmaWVkLCBzcGVjaWZ5IG9ubHkgb25lJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ0FkZCBhZGRpdGlvbmFsIGNvbmRpdGlvbiB0byBsaXN0ZW5lciBydWxlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdTdGFjaycpO1xuICAgIGNvbnN0IGxiID0gbmV3IGVsYnYyLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKHN0YWNrLCAnTEInLCB7IHZwYyB9KTtcbiAgICBjb25zdCBncm91cDEgPSBuZXcgZWxidjIuQXBwbGljYXRpb25UYXJnZXRHcm91cChzdGFjaywgJ0dyb3VwMScsIHsgdnBjLCBwb3J0OiA4MCB9KTtcbiAgICBjb25zdCBncm91cDIgPSBuZXcgZWxidjIuQXBwbGljYXRpb25UYXJnZXRHcm91cChzdGFjaywgJ0dyb3VwMicsIHsgdnBjLCBwb3J0OiA4MSwgcHJvdG9jb2w6IGVsYnYyLkFwcGxpY2F0aW9uUHJvdG9jb2wuSFRUUCB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdMaXN0ZW5lcicsIHtcbiAgICAgIHBvcnQ6IDQ0MyxcbiAgICAgIGNlcnRpZmljYXRlczogW2ltcG9ydGVkQ2VydGlmaWNhdGUoc3RhY2ssICdjZXJ0MScpXSxcbiAgICAgIGRlZmF1bHRUYXJnZXRHcm91cHM6IFtncm91cDJdLFxuICAgIH0pO1xuICAgIGxpc3RlbmVyLmFkZFRhcmdldEdyb3VwcygnVGFyZ2V0R3JvdXAxJywge1xuICAgICAgcHJpb3JpdHk6IDEwLFxuICAgICAgY29uZGl0aW9uczogW1xuICAgICAgICBlbGJ2Mi5MaXN0ZW5lckNvbmRpdGlvbi5ob3N0SGVhZGVycyhbJ2FwcC50ZXN0J10pLFxuICAgICAgICBlbGJ2Mi5MaXN0ZW5lckNvbmRpdGlvbi5odHRwSGVhZGVyKCdBY2NlcHQnLCBbJ2FwcGxpY2F0aW9uL3ZuZC5teWFwcC52Mitqc29uJ10pLFxuICAgICAgXSxcbiAgICAgIHRhcmdldEdyb3VwczogW2dyb3VwMV0sXG4gICAgfSk7XG4gICAgbGlzdGVuZXIuYWRkVGFyZ2V0R3JvdXBzKCdUYXJnZXRHcm91cDInLCB7XG4gICAgICBwcmlvcml0eTogMjAsXG4gICAgICBjb25kaXRpb25zOiBbXG4gICAgICAgIGVsYnYyLkxpc3RlbmVyQ29uZGl0aW9uLmhvc3RIZWFkZXJzKFsnYXBwLnRlc3QnXSksXG4gICAgICBdLFxuICAgICAgdGFyZ2V0R3JvdXBzOiBbZ3JvdXAyXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lclJ1bGUnLCB7XG4gICAgICBQcmlvcml0eTogMTAsXG4gICAgICBDb25kaXRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBGaWVsZDogJ2hvc3QtaGVhZGVyJyxcbiAgICAgICAgICBIb3N0SGVhZGVyQ29uZmlnOiB7XG4gICAgICAgICAgICBWYWx1ZXM6IFsnYXBwLnRlc3QnXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgRmllbGQ6ICdodHRwLWhlYWRlcicsXG4gICAgICAgICAgSHR0cEhlYWRlckNvbmZpZzoge1xuICAgICAgICAgICAgSHR0cEhlYWRlck5hbWU6ICdBY2NlcHQnLFxuICAgICAgICAgICAgVmFsdWVzOiBbJ2FwcGxpY2F0aW9uL3ZuZC5teWFwcC52Mitqc29uJ10sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lclJ1bGUnLCB7XG4gICAgICBQcmlvcml0eTogMjAsXG4gICAgICBDb25kaXRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBGaWVsZDogJ2hvc3QtaGVhZGVyJyxcbiAgICAgICAgICBIb3N0SGVhZGVyQ29uZmlnOiB7XG4gICAgICAgICAgICBWYWx1ZXM6IFsnYXBwLnRlc3QnXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQWRkIG11bHRpcGxlIGFkZGl0b25hbCBjb25kaXRpb24gdG8gbGlzdGVuZXIgcnVsZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnU3RhY2snKTtcbiAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywgeyB2cGMgfSk7XG4gICAgY29uc3QgZ3JvdXAxID0gbmV3IGVsYnYyLkFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAoc3RhY2ssICdHcm91cDEnLCB7IHZwYywgcG9ydDogODAgfSk7XG4gICAgY29uc3QgZ3JvdXAyID0gbmV3IGVsYnYyLkFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAoc3RhY2ssICdHcm91cDInLCB7IHZwYywgcG9ydDogODEsIHByb3RvY29sOiBlbGJ2Mi5BcHBsaWNhdGlvblByb3RvY29sLkhUVFAgfSk7XG4gICAgY29uc3QgZ3JvdXAzID0gbmV3IGVsYnYyLkFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAoc3RhY2ssICdHcm91cDMnLCB7IHZwYywgcG9ydDogODIsIHByb3RvY29sOiBlbGJ2Mi5BcHBsaWNhdGlvblByb3RvY29sLkhUVFAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbGlzdGVuZXIgPSBsYi5hZGRMaXN0ZW5lcignTGlzdGVuZXInLCB7XG4gICAgICBwb3J0OiA0NDMsXG4gICAgICBjZXJ0aWZpY2F0ZXM6IFtpbXBvcnRlZENlcnRpZmljYXRlKHN0YWNrLCAnY2VydDEnKV0sXG4gICAgICBkZWZhdWx0VGFyZ2V0R3JvdXBzOiBbZ3JvdXAzXSxcbiAgICB9KTtcbiAgICBsaXN0ZW5lci5hZGRUYXJnZXRHcm91cHMoJ1RhcmdldEdyb3VwMScsIHtcbiAgICAgIHByaW9yaXR5OiAxMCxcbiAgICAgIGNvbmRpdGlvbnM6IFtcbiAgICAgICAgZWxidjIuTGlzdGVuZXJDb25kaXRpb24uaG9zdEhlYWRlcnMoWydhcHAudGVzdCddKSxcbiAgICAgICAgZWxidjIuTGlzdGVuZXJDb25kaXRpb24uc291cmNlSXBzKFsnMTkyLjAuMi4wLzI0J10pLFxuICAgICAgICBlbGJ2Mi5MaXN0ZW5lckNvbmRpdGlvbi5xdWVyeVN0cmluZ3MoW3sga2V5OiAndmVyc2lvbicsIHZhbHVlOiAnMicgfSwgeyB2YWx1ZTogJ2ZvbyonIH1dKSxcbiAgICAgIF0sXG4gICAgICB0YXJnZXRHcm91cHM6IFtncm91cDFdLFxuICAgIH0pO1xuICAgIGxpc3RlbmVyLmFkZFRhcmdldEdyb3VwcygnVGFyZ2V0R3JvdXAyJywge1xuICAgICAgcHJpb3JpdHk6IDIwLFxuICAgICAgY29uZGl0aW9uczogW1xuICAgICAgICBlbGJ2Mi5MaXN0ZW5lckNvbmRpdGlvbi5ob3N0SGVhZGVycyhbJ2FwcC50ZXN0J10pLFxuICAgICAgICBlbGJ2Mi5MaXN0ZW5lckNvbmRpdGlvbi5odHRwSGVhZGVyKCdBY2NlcHQnLCBbJ2FwcGxpY2F0aW9uL3ZuZC5teWFwcC52Mitqc29uJ10pLFxuICAgICAgXSxcbiAgICAgIHRhcmdldEdyb3VwczogW2dyb3VwMV0sXG4gICAgfSk7XG4gICAgbGlzdGVuZXIuYWRkVGFyZ2V0R3JvdXBzKCdUYXJnZXRHcm91cDMnLCB7XG4gICAgICBwcmlvcml0eTogMzAsXG4gICAgICBjb25kaXRpb25zOiBbXG4gICAgICAgIGVsYnYyLkxpc3RlbmVyQ29uZGl0aW9uLmhvc3RIZWFkZXJzKFsnYXBwLnRlc3QnXSksXG4gICAgICAgIGVsYnYyLkxpc3RlbmVyQ29uZGl0aW9uLmh0dHBSZXF1ZXN0TWV0aG9kcyhbJ1BVVCcsICdDT1BZJywgJ0xPQ0snLCAnTUtDT0wnLCAnTU9WRScsICdQUk9QRklORCcsICdQUk9QUEFUQ0gnLCAnVU5MT0NLJ10pLFxuICAgICAgXSxcbiAgICAgIHRhcmdldEdyb3VwczogW2dyb3VwMl0sXG4gICAgfSk7XG4gICAgbGlzdGVuZXIuYWRkVGFyZ2V0R3JvdXBzKCdUYXJnZXRHcm91cDQnLCB7XG4gICAgICBwcmlvcml0eTogNDAsXG4gICAgICBjb25kaXRpb25zOiBbXG4gICAgICAgIGVsYnYyLkxpc3RlbmVyQ29uZGl0aW9uLmhvc3RIZWFkZXJzKFsnYXBwLnRlc3QnXSksXG4gICAgICBdLFxuICAgICAgdGFyZ2V0R3JvdXBzOiBbZ3JvdXAzXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lclJ1bGUnLCB7XG4gICAgICBQcmlvcml0eTogMTAsXG4gICAgICBDb25kaXRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBGaWVsZDogJ2hvc3QtaGVhZGVyJyxcbiAgICAgICAgICBIb3N0SGVhZGVyQ29uZmlnOiB7XG4gICAgICAgICAgICBWYWx1ZXM6IFsnYXBwLnRlc3QnXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgRmllbGQ6ICdzb3VyY2UtaXAnLFxuICAgICAgICAgIFNvdXJjZUlwQ29uZmlnOiB7XG4gICAgICAgICAgICBWYWx1ZXM6IFsnMTkyLjAuMi4wLzI0J10sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIEZpZWxkOiAncXVlcnktc3RyaW5nJyxcbiAgICAgICAgICBRdWVyeVN0cmluZ0NvbmZpZzoge1xuICAgICAgICAgICAgVmFsdWVzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBLZXk6ICd2ZXJzaW9uJyxcbiAgICAgICAgICAgICAgICBWYWx1ZTogJzInLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgVmFsdWU6ICdmb28qJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lclJ1bGUnLCB7XG4gICAgICBQcmlvcml0eTogMjAsXG4gICAgICBDb25kaXRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBGaWVsZDogJ2hvc3QtaGVhZGVyJyxcbiAgICAgICAgICBIb3N0SGVhZGVyQ29uZmlnOiB7XG4gICAgICAgICAgICBWYWx1ZXM6IFsnYXBwLnRlc3QnXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgRmllbGQ6ICdodHRwLWhlYWRlcicsXG4gICAgICAgICAgSHR0cEhlYWRlckNvbmZpZzoge1xuICAgICAgICAgICAgSHR0cEhlYWRlck5hbWU6ICdBY2NlcHQnLFxuICAgICAgICAgICAgVmFsdWVzOiBbJ2FwcGxpY2F0aW9uL3ZuZC5teWFwcC52Mitqc29uJ10sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lclJ1bGUnLCB7XG4gICAgICBQcmlvcml0eTogMzAsXG4gICAgICBDb25kaXRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBGaWVsZDogJ2hvc3QtaGVhZGVyJyxcbiAgICAgICAgICBIb3N0SGVhZGVyQ29uZmlnOiB7XG4gICAgICAgICAgICBWYWx1ZXM6IFsnYXBwLnRlc3QnXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgRmllbGQ6ICdodHRwLXJlcXVlc3QtbWV0aG9kJyxcbiAgICAgICAgICBIdHRwUmVxdWVzdE1ldGhvZENvbmZpZzoge1xuICAgICAgICAgICAgVmFsdWVzOiBbJ1BVVCcsICdDT1BZJywgJ0xPQ0snLCAnTUtDT0wnLCAnTU9WRScsICdQUk9QRklORCcsICdQUk9QUEFUQ0gnLCAnVU5MT0NLJ10sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lclJ1bGUnLCB7XG4gICAgICBQcmlvcml0eTogNDAsXG4gICAgICBDb25kaXRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBGaWVsZDogJ2hvc3QtaGVhZGVyJyxcbiAgICAgICAgICBIb3N0SGVhZGVyQ29uZmlnOiB7XG4gICAgICAgICAgICBWYWx1ZXM6IFsnYXBwLnRlc3QnXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ0NhbiBleGlzdCB0b2dldGhlciBsZWdhY3kgc3R5bGUgY29uZGl0aW9ucyBhbmQgbW9kZXJuIHN0eWxlIGNvbmRpdGlvbnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG4gICAgY29uc3QgbGIgPSBuZXcgZWxidjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc3RhY2ssICdMQicsIHsgdnBjIH0pO1xuICAgIGNvbnN0IGdyb3VwMSA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvblRhcmdldEdyb3VwKHN0YWNrLCAnR3JvdXAxJywgeyB2cGMsIHBvcnQ6IDgwIH0pO1xuICAgIGNvbnN0IGdyb3VwMiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvblRhcmdldEdyb3VwKHN0YWNrLCAnR3JvdXAyJywgeyB2cGMsIHBvcnQ6IDgxLCBwcm90b2NvbDogZWxidjIuQXBwbGljYXRpb25Qcm90b2NvbC5IVFRQIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGxpc3RlbmVyID0gbGIuYWRkTGlzdGVuZXIoJ0xpc3RlbmVyJywge1xuICAgICAgcG9ydDogNDQzLFxuICAgICAgY2VydGlmaWNhdGVzOiBbaW1wb3J0ZWRDZXJ0aWZpY2F0ZShzdGFjaywgJ2NlcnQxJyldLFxuICAgICAgZGVmYXVsdFRhcmdldEdyb3VwczogW2dyb3VwMl0sXG4gICAgfSk7XG4gICAgbGlzdGVuZXIuYWRkVGFyZ2V0R3JvdXBzKCdUYXJnZXRHcm91cDEnLCB7XG4gICAgICBob3N0SGVhZGVyOiAnYXBwLnRlc3QnLFxuICAgICAgcGF0aFBhdHRlcm46ICcvdGVzdCcsXG4gICAgICBjb25kaXRpb25zOiBbXG4gICAgICAgIGVsYnYyLkxpc3RlbmVyQ29uZGl0aW9uLnNvdXJjZUlwcyhbJzE5Mi4wLjIuMC8yNCddKSxcbiAgICAgIF0sXG4gICAgICBwcmlvcml0eTogMTAsXG4gICAgICB0YXJnZXRHcm91cHM6IFtncm91cDFdLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyUnVsZScsIHtcbiAgICAgIFByaW9yaXR5OiAxMCxcbiAgICAgIENvbmRpdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEZpZWxkOiAnaG9zdC1oZWFkZXInLFxuICAgICAgICAgIFZhbHVlczogWydhcHAudGVzdCddLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgRmllbGQ6ICdwYXRoLXBhdHRlcm4nLFxuICAgICAgICAgIFZhbHVlczogWycvdGVzdCddLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgRmllbGQ6ICdzb3VyY2UtaXAnLFxuICAgICAgICAgIFNvdXJjZUlwQ29uZmlnOiB7XG4gICAgICAgICAgICBWYWx1ZXM6IFsnMTkyLjAuMi4wLzI0J10sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0FkZCBjb25kaXRpb24gdG8gaW1wb3J0ZWQgYXBwbGljYXRpb24gbGlzdGVuZXInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG4gICAgY29uc3QgZ3JvdXAgPSBuZXcgZWxidjIuQXBwbGljYXRpb25UYXJnZXRHcm91cChzdGFjaywgJ1RhcmdldEdyb3VwJywgeyB2cGMsIHBvcnQ6IDgwIH0pO1xuICAgIGNvbnN0IGxpc3RlbmVyID0gZWxidjIuQXBwbGljYXRpb25MaXN0ZW5lci5mcm9tQXBwbGljYXRpb25MaXN0ZW5lckF0dHJpYnV0ZXMoc3RhY2ssICdMaXN0ZW5lcicsIHtcbiAgICAgIGxpc3RlbmVyQXJuOiAnbGlzdGVuZXItYXJuJyxcbiAgICAgIGRlZmF1bHRQb3J0OiA0NDMsXG4gICAgICBzZWN1cml0eUdyb3VwOiBlYzIuU2VjdXJpdHlHcm91cC5mcm9tU2VjdXJpdHlHcm91cElkKHN0YWNrLCAnU0cnLCAnc2VjdXJpdHktZ3JvdXAtaWQnKSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBsaXN0ZW5lci5hZGRUYXJnZXRHcm91cHMoJ090aGVyVEcnLCB7XG4gICAgICB0YXJnZXRHcm91cHM6IFtncm91cF0sXG4gICAgICBwcmlvcml0eTogMSxcbiAgICAgIGNvbmRpdGlvbnM6IFtlbGJ2Mi5MaXN0ZW5lckNvbmRpdGlvbi5wYXRoUGF0dGVybnMoWycvcGF0aDEnLCAnL3BhdGgyJ10pXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lclJ1bGUnLCB7XG4gICAgICBQcmlvcml0eTogMSxcbiAgICAgIENvbmRpdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEZpZWxkOiAncGF0aC1wYXR0ZXJuJyxcbiAgICAgICAgICBQYXRoUGF0dGVybkNvbmZpZzogeyBWYWx1ZXM6IFsnL3BhdGgxJywgJy9wYXRoMiddIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnbm90IGFsbG93ZWQgdG8gY29tYmluZSBhY3Rpb24gc3BlY2lmaWVycyB3aGVuIGluc3RhbnRpYXRpbmcgYSBSdWxlIGRpcmVjdGx5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdTdGFjaycpO1xuICAgIGNvbnN0IGdyb3VwID0gbmV3IGVsYnYyLkFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAoc3RhY2ssICdUYXJnZXRHcm91cCcsIHsgdnBjLCBwb3J0OiA4MCB9KTtcbiAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywgeyB2cGMgfSk7XG4gICAgY29uc3QgbGlzdGVuZXIgPSBsYi5hZGRMaXN0ZW5lcignTGlzdGVuZXInLCB7IHBvcnQ6IDgwIH0pO1xuXG4gICAgY29uc3QgYmFzZVByb3BzID0geyBsaXN0ZW5lciwgcHJpb3JpdHk6IDEsIHBhdGhQYXR0ZXJuczogWycvcGF0aDEnLCAnL3BhdGgyJ10gfTtcblxuICAgIC8vIFdIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IGVsYnYyLkFwcGxpY2F0aW9uTGlzdGVuZXJSdWxlKHN0YWNrLCAnUnVsZTEnLCB7XG4gICAgICAgIC4uLmJhc2VQcm9wcyxcbiAgICAgICAgZml4ZWRSZXNwb25zZTogeyBzdGF0dXNDb2RlOiAnMjAwJyB9LFxuICAgICAgICBhY3Rpb246IGVsYnYyLkxpc3RlbmVyQWN0aW9uLmZpeGVkUmVzcG9uc2UoMjAwKSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL3NwZWNpZnkgb25seSBvbmUvKTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgZWxidjIuQXBwbGljYXRpb25MaXN0ZW5lclJ1bGUoc3RhY2ssICdSdWxlMicsIHtcbiAgICAgICAgLi4uYmFzZVByb3BzLFxuICAgICAgICB0YXJnZXRHcm91cHM6IFtncm91cF0sXG4gICAgICAgIGFjdGlvbjogZWxidjIuTGlzdGVuZXJBY3Rpb24uZml4ZWRSZXNwb25zZSgyMDApLFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvc3BlY2lmeSBvbmx5IG9uZS8pO1xuICB9KTtcblxuICB0ZXN0KCdub3QgYWxsb3dlZCB0byBzcGVjaWZ5IGRlZmF1bHRUYXJnZXRHcm91cHMgYW5kIGRlZmF1bHRBY3Rpb24gdG9nZXRoZXInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG4gICAgY29uc3QgZ3JvdXAgPSBuZXcgZWxidjIuQXBwbGljYXRpb25UYXJnZXRHcm91cChzdGFjaywgJ1RhcmdldEdyb3VwJywgeyB2cGMsIHBvcnQ6IDgwIH0pO1xuICAgIGNvbnN0IGxiID0gbmV3IGVsYnYyLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKHN0YWNrLCAnTEInLCB7IHZwYyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbGIuYWRkTGlzdGVuZXIoJ0xpc3RlbmVyMScsIHtcbiAgICAgICAgcG9ydDogODAsXG4gICAgICAgIGRlZmF1bHRUYXJnZXRHcm91cHM6IFtncm91cF0sXG4gICAgICAgIGRlZmF1bHRBY3Rpb246IGVsYnYyLkxpc3RlbmVyQWN0aW9uLmZpeGVkUmVzcG9uc2UoMjAwKSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL1NwZWNpZnkgYXQgbW9zdCBvbmUvKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2xvb2t1cCcsICgpID0+IHtcbiAgICB0ZXN0KCdDYW4gbG9vayB1cCBhbiBBcHBsaWNhdGlvbkxpc3RlbmVyJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnc3RhY2snLCB7XG4gICAgICAgIGVudjoge1xuICAgICAgICAgIGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLFxuICAgICAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMicsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgbGlzdGVuZXIgPSBlbGJ2Mi5BcHBsaWNhdGlvbkxpc3RlbmVyLmZyb21Mb29rdXAoc3RhY2ssICdhJywge1xuICAgICAgICBsb2FkQmFsYW5jZXJUYWdzOiB7XG4gICAgICAgICAgc29tZTogJ3RhZycsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TGlzdGVuZXInLCAwKTtcbiAgICAgIGV4cGVjdChsaXN0ZW5lci5saXN0ZW5lckFybikudG9FcXVhbCgnYXJuOmF3czplbGFzdGljbG9hZGJhbGFuY2luZzp1cy13ZXN0LTI6MTIzNDU2Nzg5MDEyOmxpc3RlbmVyL2FwcGxpY2F0aW9uL215LWxvYWQtYmFsYW5jZXIvNTBkYzZjNDk1YzBjOTE4OC9mMmY3ZGM4ZWZjNTIyYWIyJyk7XG4gICAgICBleHBlY3QobGlzdGVuZXIuY29ubmVjdGlvbnMuc2VjdXJpdHlHcm91cHNbMF0uc2VjdXJpdHlHcm91cElkKS50b0VxdWFsKCdzZy0xMjM0NTY3OCcpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnQ2FuIGFkZCBydWxlcyB0byBhIGxvb2tlZC11cCBBcHBsaWNhdGlvbkxpc3RlbmVyJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnc3RhY2snLCB7XG4gICAgICAgIGVudjoge1xuICAgICAgICAgIGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLFxuICAgICAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMicsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgbGlzdGVuZXIgPSBlbGJ2Mi5BcHBsaWNhdGlvbkxpc3RlbmVyLmZyb21Mb29rdXAoc3RhY2ssICdhJywge1xuICAgICAgICBsb2FkQmFsYW5jZXJUYWdzOiB7XG4gICAgICAgICAgc29tZTogJ3RhZycsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGVsYnYyLkFwcGxpY2F0aW9uTGlzdGVuZXJSdWxlKHN0YWNrLCAncnVsZScsIHtcbiAgICAgICAgbGlzdGVuZXIsXG4gICAgICAgIGNvbmRpdGlvbnM6IFtcbiAgICAgICAgICBlbGJ2Mi5MaXN0ZW5lckNvbmRpdGlvbi5ob3N0SGVhZGVycyhbJ2V4YW1wbGUuY29tJ10pLFxuICAgICAgICBdLFxuICAgICAgICBhY3Rpb246IGVsYnYyLkxpc3RlbmVyQWN0aW9uLmZpeGVkUmVzcG9uc2UoMjAwKSxcbiAgICAgICAgcHJpb3JpdHk6IDUsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TGlzdGVuZXJSdWxlJywge1xuICAgICAgICBQcmlvcml0eTogNSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnQ2FuIGFkZCBjZXJ0aWZpY2F0ZXMgdG8gYSBsb29rZWQtdXAgQXBwbGljYXRpb25MaXN0ZW5lcicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ3N0YWNrJywge1xuICAgICAgICBlbnY6IHtcbiAgICAgICAgICBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJyxcbiAgICAgICAgICByZWdpb246ICd1cy13ZXN0LTInLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGxpc3RlbmVyID0gZWxidjIuQXBwbGljYXRpb25MaXN0ZW5lci5mcm9tTG9va3VwKHN0YWNrLCAnYScsIHtcbiAgICAgICAgbG9hZEJhbGFuY2VyVGFnczoge1xuICAgICAgICAgIHNvbWU6ICd0YWcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGxpc3RlbmVyLmFkZENlcnRpZmljYXRlcygnY2VydHMnLCBbXG4gICAgICAgIGltcG9ydGVkQ2VydGlmaWNhdGUoc3RhY2ssICdhcm46c29tZXRoaW5nJyksXG4gICAgICBdKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TGlzdGVuZXJDZXJ0aWZpY2F0ZScsIHtcbiAgICAgICAgQ2VydGlmaWNhdGVzOiBbXG4gICAgICAgICAgeyBDZXJ0aWZpY2F0ZUFybjogJ2Fybjpzb21ldGhpbmcnIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuY2xhc3MgUmVzb3VyY2VXaXRoTEJEZXBlbmRlbmN5IGV4dGVuZHMgY2RrLkNmblJlc291cmNlIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCB0YXJnZXRHcm91cDogZWxidjIuSVRhcmdldEdyb3VwKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7IHR5cGU6ICdUZXN0OjpSZXNvdXJjZScgfSk7XG4gICAgdGhpcy5ub2RlLmFkZERlcGVuZGVuY3kodGFyZ2V0R3JvdXAubG9hZEJhbGFuY2VyQXR0YWNoZWQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGltcG9ydGVkQ2VydGlmaWNhdGUoc3RhY2s6IGNkay5TdGFjayxcbiAgY2VydGlmaWNhdGVBcm4gPSAnYXJuOmF3czpjZXJ0aWZpY2F0ZW1hbmFnZXI6MTIzNDU2Nzg5MDEyOnRlc3RyZWdpb246Y2VydGlmaWNhdGUvZmQwYjgzOTItM2MwZS00NzA0LTgxYjYtOGVkZjg2MTJjODUyJykge1xuICByZXR1cm4gYWNtLkNlcnRpZmljYXRlLmZyb21DZXJ0aWZpY2F0ZUFybihzdGFjaywgY2VydGlmaWNhdGVBcm4sIGNlcnRpZmljYXRlQXJuKTtcbn1cbiJdfQ==