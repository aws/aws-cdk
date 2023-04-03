"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const ec2 = require("@aws-cdk/aws-ec2");
const cdk = require("@aws-cdk/core");
const elbv2 = require("../../lib");
describe('tests', () => {
    test('Enable proxy protocol v2 attribute for target group', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Vpc');
        // WHEN
        new elbv2.NetworkTargetGroup(stack, 'Group', {
            vpc,
            port: 80,
            proxyProtocolV2: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
            TargetGroupAttributes: [
                {
                    Key: 'proxy_protocol_v2.enabled',
                    Value: 'true',
                },
            ],
        });
    });
    test('Enable preserve_client_ip attribute for target group', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Vpc');
        // WHEN
        new elbv2.NetworkTargetGroup(stack, 'Group', {
            vpc,
            port: 80,
            preserveClientIp: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
            TargetGroupAttributes: [
                {
                    Key: 'preserve_client_ip.enabled',
                    Value: 'true',
                },
            ],
        });
    });
    test('Disable proxy protocol v2 for attribute target group', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Vpc');
        // WHEN
        new elbv2.NetworkTargetGroup(stack, 'Group', {
            vpc,
            port: 80,
            proxyProtocolV2: false,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
            TargetGroupAttributes: [
                {
                    Key: 'proxy_protocol_v2.enabled',
                    Value: 'false',
                },
            ],
        });
    });
    test('Disable preserve_client_ip attribute for target group', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Vpc');
        // WHEN
        new elbv2.NetworkTargetGroup(stack, 'Group', {
            vpc,
            port: 80,
            preserveClientIp: false,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
            TargetGroupAttributes: [
                {
                    Key: 'preserve_client_ip.enabled',
                    Value: 'false',
                },
            ],
        });
    });
    test('Configure protocols for target group', () => {
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Vpc');
        new elbv2.NetworkTargetGroup(stack, 'Group', {
            vpc,
            port: 80,
            protocol: elbv2.Protocol.UDP,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
            Protocol: 'UDP',
        });
    });
    test('Target group defaults to TCP', () => {
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Vpc');
        new elbv2.NetworkTargetGroup(stack, 'Group', {
            vpc,
            port: 80,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
            Protocol: 'TCP',
        });
    });
    test('Throws error for invalid health check interval', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'Vpc');
        new elbv2.NetworkTargetGroup(stack, 'Group', {
            vpc,
            port: 80,
            healthCheck: {
                interval: cdk.Duration.seconds(3),
            },
        });
        expect(() => {
            app.synth();
        }).toThrow(/Health check interval '3' not supported. Must be between 5 and 300./);
    });
    test('targetGroupName unallowed: more than 32 characters', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app);
        const vpc = new ec2.Vpc(stack, 'Stack');
        // WHEN
        new elbv2.NetworkTargetGroup(stack, 'Group', {
            vpc,
            port: 80,
            targetGroupName: 'a'.repeat(33),
        });
        // THEN
        expect(() => {
            app.synth();
        }).toThrow('Target group name: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" can have a maximum of 32 characters.');
    });
    test('targetGroupName unallowed: starts with hyphen', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app);
        const vpc = new ec2.Vpc(stack, 'Stack');
        // WHEN
        new elbv2.NetworkTargetGroup(stack, 'Group', {
            vpc,
            port: 80,
            targetGroupName: '-myTargetGroup',
        });
        // THEN
        expect(() => {
            app.synth();
        }).toThrow('Target group name: "-myTargetGroup" must not begin or end with a hyphen.');
    });
    test('targetGroupName unallowed: ends with hyphen', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app);
        const vpc = new ec2.Vpc(stack, 'Stack');
        // WHEN
        new elbv2.NetworkTargetGroup(stack, 'Group', {
            vpc,
            port: 80,
            targetGroupName: 'myTargetGroup-',
        });
        // THEN
        expect(() => {
            app.synth();
        }).toThrow('Target group name: "myTargetGroup-" must not begin or end with a hyphen.');
    });
    test('targetGroupName unallowed: unallowed characters', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app);
        const vpc = new ec2.Vpc(stack, 'Stack');
        // WHEN
        new elbv2.NetworkTargetGroup(stack, 'Group', {
            vpc,
            port: 80,
            targetGroupName: 'my target group',
        });
        // THEN
        expect(() => {
            app.synth();
        }).toThrow('Target group name: "my target group" must contain only alphanumeric characters or hyphens.');
    });
    test('Disable deregistration_delay.connection_termination.enabled attribute for target group', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Vpc');
        // WHEN
        new elbv2.NetworkTargetGroup(stack, 'Group', {
            vpc,
            port: 80,
            connectionTermination: false,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
            TargetGroupAttributes: [
                {
                    Key: 'deregistration_delay.connection_termination.enabled',
                    Value: 'false',
                },
            ],
        });
    });
    test('Enable deregistration_delay.connection_termination.enabled attribute for target group', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Vpc');
        // WHEN
        new elbv2.NetworkTargetGroup(stack, 'Group', {
            vpc,
            port: 80,
            connectionTermination: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
            TargetGroupAttributes: [
                {
                    Key: 'deregistration_delay.connection_termination.enabled',
                    Value: 'true',
                },
            ],
        });
    });
    test.each([elbv2.Protocol.UDP, elbv2.Protocol.TCP_UDP, elbv2.Protocol.TLS])('Throws validation error, when `healthCheck` has `protocol` set to %s', (protocol) => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'VPC', {});
        // WHEN
        new elbv2.NetworkTargetGroup(stack, 'TargetGroup', {
            vpc,
            port: 80,
            healthCheck: {
                protocol: protocol,
            },
        });
        // THEN
        expect(() => {
            app.synth();
        }).toThrow(`Health check protocol '${protocol}' is not supported. Must be one of [HTTP, HTTPS, TCP]`);
    });
    test.each([elbv2.Protocol.UDP, elbv2.Protocol.TCP_UDP, elbv2.Protocol.TLS])('Throws validation error, when `configureHealthCheck()` has `protocol` set to %s', (protocol) => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'VPC', {});
        const tg = new elbv2.NetworkTargetGroup(stack, 'TargetGroup', {
            vpc,
            port: 80,
        });
        // WHEN
        tg.configureHealthCheck({
            protocol: protocol,
        });
        // THEN
        expect(() => {
            app.synth();
        }).toThrow(`Health check protocol '${protocol}' is not supported. Must be one of [HTTP, HTTPS, TCP]`);
    });
    test.each([elbv2.Protocol.HTTP, elbv2.Protocol.HTTPS, elbv2.Protocol.TCP])('Does not throw validation error, when `healthCheck` has `protocol` set to %s', (protocol) => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'VPC', {});
        // WHEN
        new elbv2.NetworkTargetGroup(stack, 'TargetGroup', {
            vpc,
            port: 80,
            healthCheck: {
                protocol: protocol,
            },
        });
        // THEN
        expect(() => {
            app.synth();
        }).not.toThrowError();
    });
    test.each([elbv2.Protocol.HTTP, elbv2.Protocol.HTTPS, elbv2.Protocol.TCP])('Does not throw validation error, when `configureHealthCheck()` has `protocol` set to %s', (protocol) => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'VPC', {});
        const tg = new elbv2.NetworkTargetGroup(stack, 'TargetGroup', {
            vpc,
            port: 80,
        });
        // WHEN
        tg.configureHealthCheck({
            protocol: protocol,
        });
        // THEN
        expect(() => {
            app.synth();
        }).not.toThrowError();
    });
    test.each([elbv2.Protocol.TCP, elbv2.Protocol.HTTPS])('Does not throw a validation error, when `healthCheck` has `protocol` set to %s and `interval` is equal to `timeout`', (protocol) => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'VPC', {});
        // WHEN
        new elbv2.NetworkTargetGroup(stack, 'TargetGroup', {
            vpc,
            port: 80,
            healthCheck: {
                interval: cdk.Duration.seconds(10),
                timeout: cdk.Duration.seconds(10),
                protocol: protocol,
            },
        });
        // THEN
        expect(() => {
            app.synth();
        }).not.toThrowError();
    });
    test.each([elbv2.Protocol.TCP, elbv2.Protocol.HTTPS])('Does not throw a validation error, when `configureHealthCheck()` has `protocol` set to %s and `interval` is equal to `timeout`', (protocol) => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'VPC', {});
        const tg = new elbv2.NetworkTargetGroup(stack, 'TargetGroup', {
            vpc,
            port: 80,
        });
        // WHEN
        tg.configureHealthCheck({
            interval: cdk.Duration.seconds(10),
            timeout: cdk.Duration.seconds(10),
            protocol: protocol,
        });
        // THEN
        expect(() => {
            app.synth();
        }).not.toThrowError();
    });
    test.each([elbv2.Protocol.UDP, elbv2.Protocol.TCP_UDP, elbv2.Protocol.TLS])('Throws validation error,`healthCheck` has `protocol` set to %s and `path` is provided', (protocol) => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'VPC', {});
        // WHEN
        new elbv2.NetworkTargetGroup(stack, 'TargetGroup', {
            vpc,
            port: 80,
            healthCheck: {
                path: '/my-path',
                protocol: protocol,
            },
        });
        // THEN
        expect(() => {
            app.synth();
        }).toThrow(`'${protocol}' health checks do not support the path property. Must be one of [HTTP, HTTPS]`);
    });
    test.each([elbv2.Protocol.UDP, elbv2.Protocol.TCP_UDP, elbv2.Protocol.TLS])('Throws validation error, when `configureHealthCheck()` has `protocol` set to %s and  `path` is provided', (protocol) => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'VPC', {});
        const tg = new elbv2.NetworkTargetGroup(stack, 'TargetGroup', {
            vpc,
            port: 80,
        });
        // WHEN
        tg.configureHealthCheck({
            path: '/my-path',
            protocol: protocol,
        });
        // THEN
        expect(() => {
            app.synth();
        }).toThrow(`'${protocol}' health checks do not support the path property. Must be one of [HTTP, HTTPS]`);
    });
    test.each([elbv2.Protocol.HTTP, elbv2.Protocol.HTTPS])('Does not throw validation error, when `healthCheck` has `protocol` set to %s and `path` is provided', (protocol) => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'VPC', {});
        // WHEN
        new elbv2.NetworkTargetGroup(stack, 'TargetGroup', {
            vpc,
            port: 80,
            healthCheck: {
                path: '/my-path',
                protocol: protocol,
            },
        });
        // THEN
        expect(() => {
            app.synth();
        }).not.toThrowError();
    });
    test.each([elbv2.Protocol.HTTP, elbv2.Protocol.HTTPS])('Does not throw validation error, when `configureHealthCheck()` has `protocol` set to %s and `path` is provided', (protocol) => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'VPC', {});
        const tg = new elbv2.NetworkTargetGroup(stack, 'TargetGroup', {
            vpc,
            port: 80,
        });
        // WHEN
        tg.configureHealthCheck({
            path: '/my-path',
            protocol: protocol,
        });
        // THEN
        expect(() => {
            app.synth();
        }).not.toThrowError();
    });
    test('Throws error for invalid health check healthy threshold', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'Vpc');
        new elbv2.NetworkTargetGroup(stack, 'Group', {
            vpc,
            port: 80,
            healthCheck: {
                protocol: elbv2.Protocol.TCP,
                healthyThresholdCount: 11,
            },
        });
        expect(() => {
            app.synth();
        }).toThrow(/Healthy Threshold Count '11' not supported. Must be a number between 2 and 10./);
    });
    test('Throws error for invalid health check unhealthy threshold', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'Vpc');
        new elbv2.NetworkTargetGroup(stack, 'Group', {
            vpc,
            port: 80,
            healthCheck: {
                protocol: elbv2.Protocol.TCP,
                unhealthyThresholdCount: 1,
            },
        });
        expect(() => {
            app.synth();
        }).toThrow(/Unhealthy Threshold Count '1' not supported. Must be a number between 2 and 10./);
    });
    test('Throws error for unequal healthy and unhealthy threshold counts', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'Vpc');
        new elbv2.NetworkTargetGroup(stack, 'Group', {
            vpc,
            port: 80,
            healthCheck: {
                protocol: elbv2.Protocol.TCP,
                healthyThresholdCount: 5,
                unhealthyThresholdCount: 3,
            },
        });
        expect(() => {
            app.synth();
        }).toThrow(/Healthy and Unhealthy Threshold Counts must be the same: 5 is not equal to 3./);
    });
    test('Exercise metrics', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
        const listener = new elbv2.NetworkListener(stack, 'Listener', {
            loadBalancer: lb,
            port: 80,
        });
        const targetGroup = new elbv2.NetworkTargetGroup(stack, 'Group', {
            vpc,
            port: 80,
        });
        listener.addTargetGroups('unused', targetGroup);
        // WHEN
        const metrics = new Array();
        metrics.push(targetGroup.metrics.healthyHostCount());
        metrics.push(targetGroup.metrics.unHealthyHostCount());
        // THEN
        // Ideally, this would just be a GetAtt of the LB name, but the target group
        // doesn't have a direct reference to the LB, and instead builds up the LB name
        // from the listener ARN.
        const splitListenerName = { 'Fn::Split': ['/', { Ref: 'Listener828B0E81' }] };
        const loadBalancerNameFromListener = {
            'Fn::Join': ['',
                [
                    { 'Fn::Select': [1, splitListenerName] },
                    '/',
                    { 'Fn::Select': [2, splitListenerName] },
                    '/',
                    { 'Fn::Select': [3, splitListenerName] },
                ]],
        };
        for (const metric of metrics) {
            expect(metric.namespace).toEqual('AWS/NetworkELB');
            expect(stack.resolve(metric.dimensions)).toEqual({
                LoadBalancer: loadBalancerNameFromListener,
                TargetGroup: { 'Fn::GetAtt': ['GroupC77FDACD', 'TargetGroupFullName'] },
            });
        }
    });
    test('Metrics requires a listener to be present', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const targetGroup = new elbv2.NetworkTargetGroup(stack, 'Group', {
            vpc,
            port: 80,
        });
        // THEN
        expect(() => targetGroup.metrics.healthyHostCount()).toThrow(/The TargetGroup needs to be attached to a LoadBalancer/);
        expect(() => targetGroup.metrics.unHealthyHostCount()).toThrow(/The TargetGroup needs to be attached to a LoadBalancer/);
    });
    test('imported targetGroup has targetGroupName', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        // WHEN
        const importedTg = elbv2.NetworkTargetGroup.fromTargetGroupAttributes(stack, 'importedTg', {
            targetGroupArn: 'arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/myNlbTargetGroup/73e2d6bc24d8a067',
        });
        // THEN
        expect(importedTg.targetGroupName).toEqual('myNlbTargetGroup');
    });
    test('imported targetGroup with imported ARN has targetGroupName', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        // WHEN
        const importedTgArn = cdk.Fn.importValue('ImportTargetGroupArn');
        const importedTg = elbv2.ApplicationTargetGroup.fromTargetGroupAttributes(stack, 'importedTg', {
            targetGroupArn: importedTgArn,
        });
        new cdk.CfnOutput(stack, 'TargetGroupOutput', {
            value: importedTg.targetGroupName,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasOutput('TargetGroupOutput', {
            Value: {
                'Fn::Select': [
                    // myNlbTargetGroup
                    1,
                    {
                        'Fn::Split': [
                            // [targetgroup, myNlbTargetGroup, 73e2d6bc24d8a067]
                            '/',
                            {
                                'Fn::Select': [
                                    // targetgroup/myNlbTargetGroup/73e2d6bc24d8a067
                                    5,
                                    {
                                        'Fn::Split': [
                                            // [arn, aws, elasticloadbalancing, us-west-2, 123456789012, targetgroup/myNlbTargetGroup/73e2d6bc24d8a067]
                                            ':',
                                            {
                                                // arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/myNlbTargetGroup/73e2d6bc24d8a067
                                                'Fn::ImportValue': 'ImportTargetGroupArn',
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        });
    });
    test('imported targetGroup has metrics', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        // WHEN
        const targetGroup = elbv2.NetworkTargetGroup.fromTargetGroupAttributes(stack, 'importedTg', {
            targetGroupArn: 'arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/my-target-group/50dc6c495c0c9188',
            loadBalancerArns: 'arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/net/my-load-balancer/73e2d6bc24d8a067',
        });
        const metric = targetGroup.metrics.custom('MetricName');
        // THEN
        expect(metric.namespace).toEqual('AWS/NetworkELB');
        expect(stack.resolve(metric.dimensions)).toEqual({
            LoadBalancer: 'net/my-load-balancer/73e2d6bc24d8a067',
            TargetGroup: 'targetgroup/my-target-group/50dc6c495c0c9188',
        });
    });
    test('imported targetGroup without load balancer cannot have metrics', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        // WHEN
        const targetGroup = elbv2.NetworkTargetGroup.fromTargetGroupAttributes(stack, 'importedTg', {
            targetGroupArn: 'arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/my-target-group/50dc6c495c0c9188',
        });
        expect(() => targetGroup.metrics.custom('MetricName')).toThrow();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFyZ2V0LWdyb3VwLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0YXJnZXQtZ3JvdXAudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUUvQyx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBQ3JDLG1DQUFtQztBQUVuQyxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtJQUNyQixJQUFJLENBQUMscURBQXFELEVBQUUsR0FBRyxFQUFFO1FBQy9ELFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM5QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXRDLE9BQU87UUFDUCxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1lBQzNDLEdBQUc7WUFDSCxJQUFJLEVBQUUsRUFBRTtZQUNSLGVBQWUsRUFBRSxJQUFJO1NBQ3RCLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQywwQ0FBMEMsRUFBRTtZQUMxRixxQkFBcUIsRUFBRTtnQkFDckI7b0JBQ0UsR0FBRyxFQUFFLDJCQUEyQjtvQkFDaEMsS0FBSyxFQUFFLE1BQU07aUJBQ2Q7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHNEQUFzRCxFQUFFLEdBQUcsRUFBRTtRQUNoRSxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV0QyxPQUFPO1FBQ1AsSUFBSSxLQUFLLENBQUMsa0JB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QUUsdUNBQXVDO1lBQ3JELFdBQVcsRUFBRSw4Q0FBOEM7U0FDNUQsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsZ0VBQWdFLEVBQUUsR0FBRyxFQUFFO1FBQzFFLFFBQVE7UUFDUixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRTFDLE9BQU87UUFDUCxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMseUJBQXlCLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtZQUMxRixjQUFjLEVBQUUsa0dBQWtHO1NBQ25ILENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ25FLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgY2xvdWR3YXRjaCBmcm9tICdAYXdzLWNkay9hd3MtY2xvdWR3YXRjaCc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBlbGJ2MiBmcm9tICcuLi8uLi9saWInO1xuXG5kZXNjcmliZSgndGVzdHMnLCAoKSA9PiB7XG4gIHRlc3QoJ0VuYWJsZSBwcm94eSBwcm90b2NvbCB2MiBhdHRyaWJ1dGUgZm9yIHRhcmdldCBncm91cCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVnBjJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVsYnYyLk5ldHdvcmtUYXJnZXRHcm91cChzdGFjaywgJ0dyb3VwJywge1xuICAgICAgdnBjLFxuICAgICAgcG9ydDogODAsXG4gICAgICBwcm94eVByb3RvY29sVjI6IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6VGFyZ2V0R3JvdXAnLCB7XG4gICAgICBUYXJnZXRHcm91cEF0dHJpYnV0ZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEtleTogJ3Byb3h5X3Byb3RvY29sX3YyLmVuYWJsZWQnLFxuICAgICAgICAgIFZhbHVlOiAndHJ1ZScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdFbmFibGUgcHJlc2VydmVfY2xpZW50X2lwIGF0dHJpYnV0ZSBmb3IgdGFyZ2V0IGdyb3VwJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWxidjIuTmV0d29ya1RhcmdldEdyb3VwKHN0YWNrLCAnR3JvdXAnLCB7XG4gICAgICB2cGMsXG4gICAgICBwb3J0OiA4MCxcbiAgICAgIHByZXNlcnZlQ2xpZW50SXA6IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6VGFyZ2V0R3JvdXAnLCB7XG4gICAgICBUYXJnZXRHcm91cEF0dHJpYnV0ZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEtleTogJ3ByZXNlcnZlX2NsaWVudF9pcC5lbmFibGVkJyxcbiAgICAgICAgICBWYWx1ZTogJ3RydWUnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnRGlzYWJsZSBwcm94eSBwcm90b2NvbCB2MiBmb3IgYXR0cmlidXRlIHRhcmdldCBncm91cCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVnBjJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVsYnYyLk5ldHdvcmtUYXJnZXRHcm91cChzdGFjaywgJ0dyb3VwJywge1xuICAgICAgdnBjLFxuICAgICAgcG9ydDogODAsXG4gICAgICBwcm94eVByb3RvY29sVjI6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OlRhcmdldEdyb3VwJywge1xuICAgICAgVGFyZ2V0R3JvdXBBdHRyaWJ1dGVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBLZXk6ICdwcm94eV9wcm90b2NvbF92Mi5lbmFibGVkJyxcbiAgICAgICAgICBWYWx1ZTogJ2ZhbHNlJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0Rpc2FibGUgcHJlc2VydmVfY2xpZW50X2lwIGF0dHJpYnV0ZSBmb3IgdGFyZ2V0IGdyb3VwJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWxidjIuTmV0d29ya1RhcmdldEdyb3VwKHN0YWNrLCAnR3JvdXAnLCB7XG4gICAgICB2cGMsXG4gICAgICBwb3J0OiA4MCxcbiAgICAgIHByZXNlcnZlQ2xpZW50SXA6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OlRhcmdldEdyb3VwJywge1xuICAgICAgVGFyZ2V0R3JvdXBBdHRyaWJ1dGVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBLZXk6ICdwcmVzZXJ2ZV9jbGllbnRfaXAuZW5hYmxlZCcsXG4gICAgICAgICAgVmFsdWU6ICdmYWxzZScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdDb25maWd1cmUgcHJvdG9jb2xzIGZvciB0YXJnZXQgZ3JvdXAnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnKTtcblxuICAgIG5ldyBlbGJ2Mi5OZXR3b3JrVGFyZ2V0R3JvdXAoc3RhY2ssICdHcm91cCcsIHtcbiAgICAgIHZwYyxcbiAgICAgIHBvcnQ6IDgwLFxuICAgICAgcHJvdG9jb2w6IGVsYnYyLlByb3RvY29sLlVEUCxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OlRhcmdldEdyb3VwJywge1xuICAgICAgUHJvdG9jb2w6ICdVRFAnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdUYXJnZXQgZ3JvdXAgZGVmYXVsdHMgdG8gVENQJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVnBjJyk7XG5cbiAgICBuZXcgZWxidjIuTmV0d29ya1RhcmdldEdyb3VwKHN0YWNrLCAnR3JvdXAnLCB7XG4gICAgICB2cGMsXG4gICAgICBwb3J0OiA4MCxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OlRhcmdldEdyb3VwJywge1xuICAgICAgUHJvdG9jb2w6ICdUQ1AnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdUaHJvd3MgZXJyb3IgZm9yIGludmFsaWQgaGVhbHRoIGNoZWNrIGludGVydmFsJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1N0YWNrJyk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnKTtcblxuICAgIG5ldyBlbGJ2Mi5OZXR3b3JrVGFyZ2V0R3JvdXAoc3RhY2ssICdHcm91cCcsIHtcbiAgICAgIHZwYyxcbiAgICAgIHBvcnQ6IDgwLFxuICAgICAgaGVhbHRoQ2hlY2s6IHtcbiAgICAgICAgaW50ZXJ2YWw6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDMpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBhcHAuc3ludGgoKTtcbiAgICB9KS50b1Rocm93KC9IZWFsdGggY2hlY2sgaW50ZXJ2YWwgJzMnIG5vdCBzdXBwb3J0ZWQuIE11c3QgYmUgYmV0d2VlbiA1IGFuZCAzMDAuLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3RhcmdldEdyb3VwTmFtZSB1bmFsbG93ZWQ6IG1vcmUgdGhhbiAzMiBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVsYnYyLk5ldHdvcmtUYXJnZXRHcm91cChzdGFjaywgJ0dyb3VwJywge1xuICAgICAgdnBjLFxuICAgICAgcG9ydDogODAsXG4gICAgICB0YXJnZXRHcm91cE5hbWU6ICdhJy5yZXBlYXQoMzMpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBhcHAuc3ludGgoKTtcbiAgICB9KS50b1Rocm93KCdUYXJnZXQgZ3JvdXAgbmFtZTogXCJhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFcIiBjYW4gaGF2ZSBhIG1heGltdW0gb2YgMzIgY2hhcmFjdGVycy4nKTtcbiAgfSk7XG5cbiAgdGVzdCgndGFyZ2V0R3JvdXBOYW1lIHVuYWxsb3dlZDogc3RhcnRzIHdpdGggaHlwaGVuJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVsYnYyLk5ldHdvcmtUYXJnZXRHcm91cChzdGFjaywgJ0dyb3VwJywge1xuICAgICAgdnBjLFxuICAgICAgcG9ydDogODAsXG4gICAgICB0YXJnZXRHcm91cE5hbWU6ICctbXlUYXJnZXRHcm91cCcsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGFwcC5zeW50aCgpO1xuICAgIH0pLnRvVGhyb3coJ1RhcmdldCBncm91cCBuYW1lOiBcIi1teVRhcmdldEdyb3VwXCIgbXVzdCBub3QgYmVnaW4gb3IgZW5kIHdpdGggYSBoeXBoZW4uJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3RhcmdldEdyb3VwTmFtZSB1bmFsbG93ZWQ6IGVuZHMgd2l0aCBoeXBoZW4nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHApO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnU3RhY2snKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWxidjIuTmV0d29ya1RhcmdldEdyb3VwKHN0YWNrLCAnR3JvdXAnLCB7XG4gICAgICB2cGMsXG4gICAgICBwb3J0OiA4MCxcbiAgICAgIHRhcmdldEdyb3VwTmFtZTogJ215VGFyZ2V0R3JvdXAtJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgYXBwLnN5bnRoKCk7XG4gICAgfSkudG9UaHJvdygnVGFyZ2V0IGdyb3VwIG5hbWU6IFwibXlUYXJnZXRHcm91cC1cIiBtdXN0IG5vdCBiZWdpbiBvciBlbmQgd2l0aCBhIGh5cGhlbi4nKTtcbiAgfSk7XG5cbiAgdGVzdCgndGFyZ2V0R3JvdXBOYW1lIHVuYWxsb3dlZDogdW5hbGxvd2VkIGNoYXJhY3RlcnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHApO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnU3RhY2snKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWxidjIuTmV0d29ya1RhcmdldEdyb3VwKHN0YWNrLCAnR3JvdXAnLCB7XG4gICAgICB2cGMsXG4gICAgICBwb3J0OiA4MCxcbiAgICAgIHRhcmdldEdyb3VwTmFtZTogJ215IHRhcmdldCBncm91cCcsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGFwcC5zeW50aCgpO1xuICAgIH0pLnRvVGhyb3coJ1RhcmdldCBncm91cCBuYW1lOiBcIm15IHRhcmdldCBncm91cFwiIG11c3QgY29udGFpbiBvbmx5IGFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzIG9yIGh5cGhlbnMuJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ0Rpc2FibGUgZGVyZWdpc3RyYXRpb25fZGVsYXkuY29ubmVjdGlvbl90ZXJtaW5hdGlvbi5lbmFibGVkIGF0dHJpYnV0ZSBmb3IgdGFyZ2V0IGdyb3VwJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWxidjIuTmV0d29ya1RhcmdldEdyb3VwKHN0YWNrLCAnR3JvdXAnLCB7XG4gICAgICB2cGMsXG4gICAgICBwb3J0OiA4MCxcbiAgICAgIGNvbm5lY3Rpb25UZXJtaW5hdGlvbjogZmFsc2UsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6VGFyZ2V0R3JvdXAnLCB7XG4gICAgICBUYXJnZXRHcm91cEF0dHJpYnV0ZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEtleTogJ2RlcmVnaXN0cmF0aW9uX2RlbGF5LmNvbm5lY3Rpb25fdGVybWluYXRpb24uZW5hYmxlZCcsXG4gICAgICAgICAgVmFsdWU6ICdmYWxzZScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdFbmFibGUgZGVyZWdpc3RyYXRpb25fZGVsYXkuY29ubmVjdGlvbl90ZXJtaW5hdGlvbi5lbmFibGVkIGF0dHJpYnV0ZSBmb3IgdGFyZ2V0IGdyb3VwJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWxidjIuTmV0d29ya1RhcmdldEdyb3VwKHN0YWNrLCAnR3JvdXAnLCB7XG4gICAgICB2cGMsXG4gICAgICBwb3J0OiA4MCxcbiAgICAgIGNvbm5lY3Rpb25UZXJtaW5hdGlvbjogdHJ1ZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpUYXJnZXRHcm91cCcsIHtcbiAgICAgIFRhcmdldEdyb3VwQXR0cmlidXRlczogW1xuICAgICAgICB7XG4gICAgICAgICAgS2V5OiAnZGVyZWdpc3RyYXRpb25fZGVsYXkuY29ubmVjdGlvbl90ZXJtaW5hdGlvbi5lbmFibGVkJyxcbiAgICAgICAgICBWYWx1ZTogJ3RydWUnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdC5lYWNoKFtlbGJ2Mi5Qcm90b2NvbC5VRFAsIGVsYnYyLlByb3RvY29sLlRDUF9VRFAsIGVsYnYyLlByb3RvY29sLlRMU10pKFxuICAgICdUaHJvd3MgdmFsaWRhdGlvbiBlcnJvciwgd2hlbiBgaGVhbHRoQ2hlY2tgIGhhcyBgcHJvdG9jb2xgIHNldCB0byAlcycsXG4gICAgKHByb3RvY29sKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdTdGFjaycpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnLCB7fSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBlbGJ2Mi5OZXR3b3JrVGFyZ2V0R3JvdXAoc3RhY2ssICdUYXJnZXRHcm91cCcsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBwb3J0OiA4MCxcbiAgICAgICAgaGVhbHRoQ2hlY2s6IHtcbiAgICAgICAgICBwcm90b2NvbDogcHJvdG9jb2wsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgYXBwLnN5bnRoKCk7XG4gICAgICB9KS50b1Rocm93KGBIZWFsdGggY2hlY2sgcHJvdG9jb2wgJyR7cHJvdG9jb2x9JyBpcyBub3Qgc3VwcG9ydGVkLiBNdXN0IGJlIG9uZSBvZiBbSFRUUCwgSFRUUFMsIFRDUF1gKTtcbiAgICB9KTtcblxuICB0ZXN0LmVhY2goW2VsYnYyLlByb3RvY29sLlVEUCwgZWxidjIuUHJvdG9jb2wuVENQX1VEUCwgZWxidjIuUHJvdG9jb2wuVExTXSkoXG4gICAgJ1Rocm93cyB2YWxpZGF0aW9uIGVycm9yLCB3aGVuIGBjb25maWd1cmVIZWFsdGhDaGVjaygpYCBoYXMgYHByb3RvY29sYCBzZXQgdG8gJXMnLFxuICAgIChwcm90b2NvbCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnU3RhY2snKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJywge30pO1xuICAgICAgY29uc3QgdGcgPSBuZXcgZWxidjIuTmV0d29ya1RhcmdldEdyb3VwKHN0YWNrLCAnVGFyZ2V0R3JvdXAnLCB7XG4gICAgICAgIHZwYyxcbiAgICAgICAgcG9ydDogODAsXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgdGcuY29uZmlndXJlSGVhbHRoQ2hlY2soe1xuICAgICAgICBwcm90b2NvbDogcHJvdG9jb2wsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgYXBwLnN5bnRoKCk7XG4gICAgICB9KS50b1Rocm93KGBIZWFsdGggY2hlY2sgcHJvdG9jb2wgJyR7cHJvdG9jb2x9JyBpcyBub3Qgc3VwcG9ydGVkLiBNdXN0IGJlIG9uZSBvZiBbSFRUUCwgSFRUUFMsIFRDUF1gKTtcbiAgICB9KTtcblxuICB0ZXN0LmVhY2goW2VsYnYyLlByb3RvY29sLkhUVFAsIGVsYnYyLlByb3RvY29sLkhUVFBTLCBlbGJ2Mi5Qcm90b2NvbC5UQ1BdKShcbiAgICAnRG9lcyBub3QgdGhyb3cgdmFsaWRhdGlvbiBlcnJvciwgd2hlbiBgaGVhbHRoQ2hlY2tgIGhhcyBgcHJvdG9jb2xgIHNldCB0byAlcycsXG4gICAgKHByb3RvY29sKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdTdGFjaycpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnLCB7fSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBlbGJ2Mi5OZXR3b3JrVGFyZ2V0R3JvdXAoc3RhY2ssICdUYXJnZXRHcm91cCcsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBwb3J0OiA4MCxcbiAgICAgICAgaGVhbHRoQ2hlY2s6IHtcbiAgICAgICAgICBwcm90b2NvbDogcHJvdG9jb2wsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgYXBwLnN5bnRoKCk7XG4gICAgICB9KS5ub3QudG9UaHJvd0Vycm9yKCk7XG4gICAgfSk7XG5cbiAgdGVzdC5lYWNoKFtlbGJ2Mi5Qcm90b2NvbC5IVFRQLCBlbGJ2Mi5Qcm90b2NvbC5IVFRQUywgZWxidjIuUHJvdG9jb2wuVENQXSkoXG4gICAgJ0RvZXMgbm90IHRocm93IHZhbGlkYXRpb24gZXJyb3IsIHdoZW4gYGNvbmZpZ3VyZUhlYWx0aENoZWNrKClgIGhhcyBgcHJvdG9jb2xgIHNldCB0byAlcycsXG4gICAgKHByb3RvY29sKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdTdGFjaycpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnLCB7fSk7XG4gICAgICBjb25zdCB0ZyA9IG5ldyBlbGJ2Mi5OZXR3b3JrVGFyZ2V0R3JvdXAoc3RhY2ssICdUYXJnZXRHcm91cCcsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBwb3J0OiA4MCxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICB0Zy5jb25maWd1cmVIZWFsdGhDaGVjayh7XG4gICAgICAgIHByb3RvY29sOiBwcm90b2NvbCxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBhcHAuc3ludGgoKTtcbiAgICAgIH0pLm5vdC50b1Rocm93RXJyb3IoKTtcbiAgICB9KTtcblxuICB0ZXN0LmVhY2goW2VsYnYyLlByb3RvY29sLlRDUCwgZWxidjIuUHJvdG9jb2wuSFRUUFNdKShcbiAgICAnRG9lcyBub3QgdGhyb3cgYSB2YWxpZGF0aW9uIGVycm9yLCB3aGVuIGBoZWFsdGhDaGVja2AgaGFzIGBwcm90b2NvbGAgc2V0IHRvICVzIGFuZCBgaW50ZXJ2YWxgIGlzIGVxdWFsIHRvIGB0aW1lb3V0YCcsXG4gICAgKHByb3RvY29sKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdTdGFjaycpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnLCB7fSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBlbGJ2Mi5OZXR3b3JrVGFyZ2V0R3JvdXAoc3RhY2ssICdUYXJnZXRHcm91cCcsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBwb3J0OiA4MCxcbiAgICAgICAgaGVhbHRoQ2hlY2s6IHtcbiAgICAgICAgICBpbnRlcnZhbDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMTApLFxuICAgICAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDEwKSxcbiAgICAgICAgICBwcm90b2NvbDogcHJvdG9jb2wsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgYXBwLnN5bnRoKCk7XG4gICAgICB9KS5ub3QudG9UaHJvd0Vycm9yKCk7XG4gICAgfSk7XG5cbiAgdGVzdC5lYWNoKFtlbGJ2Mi5Qcm90b2NvbC5UQ1AsIGVsYnYyLlByb3RvY29sLkhUVFBTXSkoXG4gICAgJ0RvZXMgbm90IHRocm93IGEgdmFsaWRhdGlvbiBlcnJvciwgd2hlbiBgY29uZmlndXJlSGVhbHRoQ2hlY2soKWAgaGFzIGBwcm90b2NvbGAgc2V0IHRvICVzIGFuZCBgaW50ZXJ2YWxgIGlzIGVxdWFsIHRvIGB0aW1lb3V0YCcsXG4gICAgKHByb3RvY29sKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdTdGFjaycpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnLCB7fSk7XG4gICAgICBjb25zdCB0ZyA9IG5ldyBlbGJ2Mi5OZXR3b3JrVGFyZ2V0R3JvdXAoc3RhY2ssICdUYXJnZXRHcm91cCcsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBwb3J0OiA4MCxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICB0Zy5jb25maWd1cmVIZWFsdGhDaGVjayh7XG4gICAgICAgIGludGVydmFsOiBjZGsuRHVyYXRpb24uc2Vjb25kcygxMCksXG4gICAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDEwKSxcbiAgICAgICAgcHJvdG9jb2w6IHByb3RvY29sLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIGFwcC5zeW50aCgpO1xuICAgICAgfSkubm90LnRvVGhyb3dFcnJvcigpO1xuICAgIH0pO1xuXG4gIHRlc3QuZWFjaChbZWxidjIuUHJvdG9jb2wuVURQLCBlbGJ2Mi5Qcm90b2NvbC5UQ1BfVURQLCBlbGJ2Mi5Qcm90b2NvbC5UTFNdKShcbiAgICAnVGhyb3dzIHZhbGlkYXRpb24gZXJyb3IsYGhlYWx0aENoZWNrYCBoYXMgYHByb3RvY29sYCBzZXQgdG8gJXMgYW5kIGBwYXRoYCBpcyBwcm92aWRlZCcsXG4gICAgKHByb3RvY29sKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdTdGFjaycpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnLCB7fSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBlbGJ2Mi5OZXR3b3JrVGFyZ2V0R3JvdXAoc3RhY2ssICdUYXJnZXRHcm91cCcsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBwb3J0OiA4MCxcbiAgICAgICAgaGVhbHRoQ2hlY2s6IHtcbiAgICAgICAgICBwYXRoOiAnL215LXBhdGgnLFxuICAgICAgICAgIHByb3RvY29sOiBwcm90b2NvbCxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBhcHAuc3ludGgoKTtcbiAgICAgIH0pLnRvVGhyb3coYCcke3Byb3RvY29sfScgaGVhbHRoIGNoZWNrcyBkbyBub3Qgc3VwcG9ydCB0aGUgcGF0aCBwcm9wZXJ0eS4gTXVzdCBiZSBvbmUgb2YgW0hUVFAsIEhUVFBTXWApO1xuICAgIH0pO1xuXG4gIHRlc3QuZWFjaChbZWxidjIuUHJvdG9jb2wuVURQLCBlbGJ2Mi5Qcm90b2NvbC5UQ1BfVURQLCBlbGJ2Mi5Qcm90b2NvbC5UTFNdKShcbiAgICAnVGhyb3dzIHZhbGlkYXRpb24gZXJyb3IsIHdoZW4gYGNvbmZpZ3VyZUhlYWx0aENoZWNrKClgIGhhcyBgcHJvdG9jb2xgIHNldCB0byAlcyBhbmQgIGBwYXRoYCBpcyBwcm92aWRlZCcsXG4gICAgKHByb3RvY29sKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdTdGFjaycpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnLCB7fSk7XG4gICAgICBjb25zdCB0ZyA9IG5ldyBlbGJ2Mi5OZXR3b3JrVGFyZ2V0R3JvdXAoc3RhY2ssICdUYXJnZXRHcm91cCcsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBwb3J0OiA4MCxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICB0Zy5jb25maWd1cmVIZWFsdGhDaGVjayh7XG4gICAgICAgIHBhdGg6ICcvbXktcGF0aCcsXG4gICAgICAgIHByb3RvY29sOiBwcm90b2NvbCxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBhcHAuc3ludGgoKTtcbiAgICAgIH0pLnRvVGhyb3coYCcke3Byb3RvY29sfScgaGVhbHRoIGNoZWNrcyBkbyBub3Qgc3VwcG9ydCB0aGUgcGF0aCBwcm9wZXJ0eS4gTXVzdCBiZSBvbmUgb2YgW0hUVFAsIEhUVFBTXWApO1xuICAgIH0pO1xuXG4gIHRlc3QuZWFjaChbZWxidjIuUHJvdG9jb2wuSFRUUCwgZWxidjIuUHJvdG9jb2wuSFRUUFNdKShcbiAgICAnRG9lcyBub3QgdGhyb3cgdmFsaWRhdGlvbiBlcnJvciwgd2hlbiBgaGVhbHRoQ2hlY2tgIGhhcyBgcHJvdG9jb2xgIHNldCB0byAlcyBhbmQgYHBhdGhgIGlzIHByb3ZpZGVkJyxcbiAgICAocHJvdG9jb2wpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1N0YWNrJyk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycsIHt9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGVsYnYyLk5ldHdvcmtUYXJnZXRHcm91cChzdGFjaywgJ1RhcmdldEdyb3VwJywge1xuICAgICAgICB2cGMsXG4gICAgICAgIHBvcnQ6IDgwLFxuICAgICAgICBoZWFsdGhDaGVjazoge1xuICAgICAgICAgIHBhdGg6ICcvbXktcGF0aCcsXG4gICAgICAgICAgcHJvdG9jb2w6IHByb3RvY29sLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIGFwcC5zeW50aCgpO1xuICAgICAgfSkubm90LnRvVGhyb3dFcnJvcigpO1xuICAgIH0pO1xuXG4gIHRlc3QuZWFjaChbZWxidjIuUHJvdG9jb2wuSFRUUCwgZWxidjIuUHJvdG9jb2wuSFRUUFNdKShcbiAgICAnRG9lcyBub3QgdGhyb3cgdmFsaWRhdGlvbiBlcnJvciwgd2hlbiBgY29uZmlndXJlSGVhbHRoQ2hlY2soKWAgaGFzIGBwcm90b2NvbGAgc2V0IHRvICVzIGFuZCBgcGF0aGAgaXMgcHJvdmlkZWQnLFxuICAgIChwcm90b2NvbCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnU3RhY2snKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJywge30pO1xuICAgICAgY29uc3QgdGcgPSBuZXcgZWxidjIuTmV0d29ya1RhcmdldEdyb3VwKHN0YWNrLCAnVGFyZ2V0R3JvdXAnLCB7XG4gICAgICAgIHZwYyxcbiAgICAgICAgcG9ydDogODAsXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgdGcuY29uZmlndXJlSGVhbHRoQ2hlY2soe1xuICAgICAgICBwYXRoOiAnL215LXBhdGgnLFxuICAgICAgICBwcm90b2NvbDogcHJvdG9jb2wsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgYXBwLnN5bnRoKCk7XG4gICAgICB9KS5ub3QudG9UaHJvd0Vycm9yKCk7XG4gICAgfSk7XG5cbiAgdGVzdCgnVGhyb3dzIGVycm9yIGZvciBpbnZhbGlkIGhlYWx0aCBjaGVjayBoZWFsdGh5IHRocmVzaG9sZCcsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdTdGFjaycpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVnBjJyk7XG5cbiAgICBuZXcgZWxidjIuTmV0d29ya1RhcmdldEdyb3VwKHN0YWNrLCAnR3JvdXAnLCB7XG4gICAgICB2cGMsXG4gICAgICBwb3J0OiA4MCxcbiAgICAgIGhlYWx0aENoZWNrOiB7XG4gICAgICAgIHByb3RvY29sOiBlbGJ2Mi5Qcm90b2NvbC5UQ1AsXG4gICAgICAgIGhlYWx0aHlUaHJlc2hvbGRDb3VudDogMTEsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGFwcC5zeW50aCgpO1xuICAgIH0pLnRvVGhyb3coL0hlYWx0aHkgVGhyZXNob2xkIENvdW50ICcxMScgbm90IHN1cHBvcnRlZC4gTXVzdCBiZSBhIG51bWJlciBiZXR3ZWVuIDIgYW5kIDEwLi8pO1xuICB9KTtcblxuICB0ZXN0KCdUaHJvd3MgZXJyb3IgZm9yIGludmFsaWQgaGVhbHRoIGNoZWNrIHVuaGVhbHRoeSB0aHJlc2hvbGQnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnU3RhY2snKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZwYycpO1xuXG4gICAgbmV3IGVsYnYyLk5ldHdvcmtUYXJnZXRHcm91cChzdGFjaywgJ0dyb3VwJywge1xuICAgICAgdnBjLFxuICAgICAgcG9ydDogODAsXG4gICAgICBoZWFsdGhDaGVjazoge1xuICAgICAgICBwcm90b2NvbDogZWxidjIuUHJvdG9jb2wuVENQLFxuICAgICAgICB1bmhlYWx0aHlUaHJlc2hvbGRDb3VudDogMSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgYXBwLnN5bnRoKCk7XG4gICAgfSkudG9UaHJvdygvVW5oZWFsdGh5IFRocmVzaG9sZCBDb3VudCAnMScgbm90IHN1cHBvcnRlZC4gTXVzdCBiZSBhIG51bWJlciBiZXR3ZWVuIDIgYW5kIDEwLi8pO1xuICB9KTtcblxuICB0ZXN0KCdUaHJvd3MgZXJyb3IgZm9yIHVuZXF1YWwgaGVhbHRoeSBhbmQgdW5oZWFsdGh5IHRocmVzaG9sZCBjb3VudHMnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnU3RhY2snKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZwYycpO1xuXG4gICAgbmV3IGVsYnYyLk5ldHdvcmtUYXJnZXRHcm91cChzdGFjaywgJ0dyb3VwJywge1xuICAgICAgdnBjLFxuICAgICAgcG9ydDogODAsXG4gICAgICBoZWFsdGhDaGVjazoge1xuICAgICAgICBwcm90b2NvbDogZWxidjIuUHJvdG9jb2wuVENQLFxuICAgICAgICBoZWFsdGh5VGhyZXNob2xkQ291bnQ6IDUsXG4gICAgICAgIHVuaGVhbHRoeVRocmVzaG9sZENvdW50OiAzLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBhcHAuc3ludGgoKTtcbiAgICB9KS50b1Rocm93KC9IZWFsdGh5IGFuZCBVbmhlYWx0aHkgVGhyZXNob2xkIENvdW50cyBtdXN0IGJlIHRoZSBzYW1lOiA1IGlzIG5vdCBlcXVhbCB0byAzLi8pO1xuICB9KTtcblxuICB0ZXN0KCdFeGVyY2lzZSBtZXRyaWNzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdTdGFjaycpO1xuICAgIGNvbnN0IGxiID0gbmV3IGVsYnYyLk5ldHdvcmtMb2FkQmFsYW5jZXIoc3RhY2ssICdMQicsIHsgdnBjIH0pO1xuICAgIGNvbnN0IGxpc3RlbmVyID0gbmV3IGVsYnYyLk5ldHdvcmtMaXN0ZW5lcihzdGFjaywgJ0xpc3RlbmVyJywge1xuICAgICAgbG9hZEJhbGFuY2VyOiBsYixcbiAgICAgIHBvcnQ6IDgwLFxuICAgIH0pO1xuICAgIGNvbnN0IHRhcmdldEdyb3VwID0gbmV3IGVsYnYyLk5ldHdvcmtUYXJnZXRHcm91cChzdGFjaywgJ0dyb3VwJywge1xuICAgICAgdnBjLFxuICAgICAgcG9ydDogODAsXG4gICAgfSk7XG4gICAgbGlzdGVuZXIuYWRkVGFyZ2V0R3JvdXBzKCd1bnVzZWQnLCB0YXJnZXRHcm91cCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbWV0cmljcyA9IG5ldyBBcnJheTxjbG91ZHdhdGNoLk1ldHJpYz4oKTtcbiAgICBtZXRyaWNzLnB1c2godGFyZ2V0R3JvdXAubWV0cmljcy5oZWFsdGh5SG9zdENvdW50KCkpO1xuICAgIG1ldHJpY3MucHVzaCh0YXJnZXRHcm91cC5tZXRyaWNzLnVuSGVhbHRoeUhvc3RDb3VudCgpKTtcblxuICAgIC8vIFRIRU5cblxuICAgIC8vIElkZWFsbHksIHRoaXMgd291bGQganVzdCBiZSBhIEdldEF0dCBvZiB0aGUgTEIgbmFtZSwgYnV0IHRoZSB0YXJnZXQgZ3JvdXBcbiAgICAvLyBkb2Vzbid0IGhhdmUgYSBkaXJlY3QgcmVmZXJlbmNlIHRvIHRoZSBMQiwgYW5kIGluc3RlYWQgYnVpbGRzIHVwIHRoZSBMQiBuYW1lXG4gICAgLy8gZnJvbSB0aGUgbGlzdGVuZXIgQVJOLlxuICAgIGNvbnN0IHNwbGl0TGlzdGVuZXJOYW1lID0geyAnRm46OlNwbGl0JzogWycvJywgeyBSZWY6ICdMaXN0ZW5lcjgyOEIwRTgxJyB9XSB9O1xuICAgIGNvbnN0IGxvYWRCYWxhbmNlck5hbWVGcm9tTGlzdGVuZXIgPSB7XG4gICAgICAnRm46OkpvaW4nOiBbJycsXG4gICAgICAgIFtcbiAgICAgICAgICB7ICdGbjo6U2VsZWN0JzogWzEsIHNwbGl0TGlzdGVuZXJOYW1lXSB9LFxuICAgICAgICAgICcvJyxcbiAgICAgICAgICB7ICdGbjo6U2VsZWN0JzogWzIsIHNwbGl0TGlzdGVuZXJOYW1lXSB9LFxuICAgICAgICAgICcvJyxcbiAgICAgICAgICB7ICdGbjo6U2VsZWN0JzogWzMsIHNwbGl0TGlzdGVuZXJOYW1lXSB9LFxuICAgICAgICBdXSxcbiAgICB9O1xuXG4gICAgZm9yIChjb25zdCBtZXRyaWMgb2YgbWV0cmljcykge1xuICAgICAgZXhwZWN0KG1ldHJpYy5uYW1lc3BhY2UpLnRvRXF1YWwoJ0FXUy9OZXR3b3JrRUxCJyk7XG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShtZXRyaWMuZGltZW5zaW9ucykpLnRvRXF1YWwoe1xuICAgICAgICBMb2FkQmFsYW5jZXI6IGxvYWRCYWxhbmNlck5hbWVGcm9tTGlzdGVuZXIsXG4gICAgICAgIFRhcmdldEdyb3VwOiB7ICdGbjo6R2V0QXR0JzogWydHcm91cEM3N0ZEQUNEJywgJ1RhcmdldEdyb3VwRnVsbE5hbWUnXSB9LFxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICB0ZXN0KCdNZXRyaWNzIHJlcXVpcmVzIGEgbGlzdGVuZXIgdG8gYmUgcHJlc2VudCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnU3RhY2snKTtcbiAgICBjb25zdCB0YXJnZXRHcm91cCA9IG5ldyBlbGJ2Mi5OZXR3b3JrVGFyZ2V0R3JvdXAoc3RhY2ssICdHcm91cCcsIHtcbiAgICAgIHZwYyxcbiAgICAgIHBvcnQ6IDgwLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB0YXJnZXRHcm91cC5tZXRyaWNzLmhlYWx0aHlIb3N0Q291bnQoKSkudG9UaHJvdygvVGhlIFRhcmdldEdyb3VwIG5lZWRzIHRvIGJlIGF0dGFjaGVkIHRvIGEgTG9hZEJhbGFuY2VyLyk7XG4gICAgZXhwZWN0KCgpID0+IHRhcmdldEdyb3VwLm1ldHJpY3MudW5IZWFsdGh5SG9zdENvdW50KCkpLnRvVGhyb3coL1RoZSBUYXJnZXRHcm91cCBuZWVkcyB0byBiZSBhdHRhY2hlZCB0byBhIExvYWRCYWxhbmNlci8pO1xuICB9KTtcblxuICB0ZXN0KCdpbXBvcnRlZCB0YXJnZXRHcm91cCBoYXMgdGFyZ2V0R3JvdXBOYW1lJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnU3RhY2snKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBpbXBvcnRlZFRnID0gZWxidjIuTmV0d29ya1RhcmdldEdyb3VwLmZyb21UYXJnZXRHcm91cEF0dHJpYnV0ZXMoc3RhY2ssICdpbXBvcnRlZFRnJywge1xuICAgICAgdGFyZ2V0R3JvdXBBcm46ICdhcm46YXdzOmVsYXN0aWNsb2FkYmFsYW5jaW5nOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6dGFyZ2V0Z3JvdXAvbXlObGJUYXJnZXRHcm91cC83M2UyZDZiYzI0ZDhhMDY3JyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoaW1wb3J0ZWRUZy50YXJnZXRHcm91cE5hbWUpLnRvRXF1YWwoJ215TmxiVGFyZ2V0R3JvdXAnKTtcbiAgfSk7XG5cbiAgdGVzdCgnaW1wb3J0ZWQgdGFyZ2V0R3JvdXAgd2l0aCBpbXBvcnRlZCBBUk4gaGFzIHRhcmdldEdyb3VwTmFtZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1N0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgaW1wb3J0ZWRUZ0FybiA9IGNkay5Gbi5pbXBvcnRWYWx1ZSgnSW1wb3J0VGFyZ2V0R3JvdXBBcm4nKTtcbiAgICBjb25zdCBpbXBvcnRlZFRnID0gZWxidjIuQXBwbGljYXRpb25UYXJnZXRHcm91cC5mcm9tVGFyZ2V0R3JvdXBBdHRyaWJ1dGVzKHN0YWNrLCAnaW1wb3J0ZWRUZycsIHtcbiAgICAgIHRhcmdldEdyb3VwQXJuOiBpbXBvcnRlZFRnQXJuLFxuICAgIH0pO1xuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrLCAnVGFyZ2V0R3JvdXBPdXRwdXQnLCB7XG4gICAgICB2YWx1ZTogaW1wb3J0ZWRUZy50YXJnZXRHcm91cE5hbWUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNPdXRwdXQoJ1RhcmdldEdyb3VwT3V0cHV0Jywge1xuICAgICAgVmFsdWU6IHtcbiAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgLy8gbXlObGJUYXJnZXRHcm91cFxuICAgICAgICAgIDEsXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgLy8gW3RhcmdldGdyb3VwLCBteU5sYlRhcmdldEdyb3VwLCA3M2UyZDZiYzI0ZDhhMDY3XVxuICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgICAgICAgIC8vIHRhcmdldGdyb3VwL215TmxiVGFyZ2V0R3JvdXAvNzNlMmQ2YmMyNGQ4YTA2N1xuICAgICAgICAgICAgICAgICAgNSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAvLyBbYXJuLCBhd3MsIGVsYXN0aWNsb2FkYmFsYW5jaW5nLCB1cy13ZXN0LTIsIDEyMzQ1Njc4OTAxMiwgdGFyZ2V0Z3JvdXAvbXlObGJUYXJnZXRHcm91cC83M2UyZDZiYzI0ZDhhMDY3XVxuICAgICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhcm46YXdzOmVsYXN0aWNsb2FkYmFsYW5jaW5nOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6dGFyZ2V0Z3JvdXAvbXlObGJUYXJnZXRHcm91cC83M2UyZDZiYzI0ZDhhMDY3XG4gICAgICAgICAgICAgICAgICAgICAgICAnRm46OkltcG9ydFZhbHVlJzogJ0ltcG9ydFRhcmdldEdyb3VwQXJuJyxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnaW1wb3J0ZWQgdGFyZ2V0R3JvdXAgaGFzIG1ldHJpY3MnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdTdGFjaycpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHRhcmdldEdyb3VwID0gZWxidjIuTmV0d29ya1RhcmdldEdyb3VwLmZyb21UYXJnZXRHcm91cEF0dHJpYnV0ZXMoc3RhY2ssICdpbXBvcnRlZFRnJywge1xuICAgICAgdGFyZ2V0R3JvdXBBcm46ICdhcm46YXdzOmVsYXN0aWNsb2FkYmFsYW5jaW5nOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6dGFyZ2V0Z3JvdXAvbXktdGFyZ2V0LWdyb3VwLzUwZGM2YzQ5NWMwYzkxODgnLFxuICAgICAgbG9hZEJhbGFuY2VyQXJuczogJ2Fybjphd3M6ZWxhc3RpY2xvYWRiYWxhbmNpbmc6dXMtd2VzdC0yOjEyMzQ1Njc4OTAxMjpsb2FkYmFsYW5jZXIvbmV0L215LWxvYWQtYmFsYW5jZXIvNzNlMmQ2YmMyNGQ4YTA2NycsXG4gICAgfSk7XG5cbiAgICBjb25zdCBtZXRyaWMgPSB0YXJnZXRHcm91cC5tZXRyaWNzLmN1c3RvbSgnTWV0cmljTmFtZScpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChtZXRyaWMubmFtZXNwYWNlKS50b0VxdWFsKCdBV1MvTmV0d29ya0VMQicpO1xuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKG1ldHJpYy5kaW1lbnNpb25zKSkudG9FcXVhbCh7XG4gICAgICBMb2FkQmFsYW5jZXI6ICduZXQvbXktbG9hZC1iYWxhbmNlci83M2UyZDZiYzI0ZDhhMDY3JyxcbiAgICAgIFRhcmdldEdyb3VwOiAndGFyZ2V0Z3JvdXAvbXktdGFyZ2V0LWdyb3VwLzUwZGM2YzQ5NWMwYzkxODgnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdpbXBvcnRlZCB0YXJnZXRHcm91cCB3aXRob3V0IGxvYWQgYmFsYW5jZXIgY2Fubm90IGhhdmUgbWV0cmljcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1N0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgdGFyZ2V0R3JvdXAgPSBlbGJ2Mi5OZXR3b3JrVGFyZ2V0R3JvdXAuZnJvbVRhcmdldEdyb3VwQXR0cmlidXRlcyhzdGFjaywgJ2ltcG9ydGVkVGcnLCB7XG4gICAgICB0YXJnZXRHcm91cEFybjogJ2Fybjphd3M6ZWxhc3RpY2xvYWRiYWxhbmNpbmc6dXMtd2VzdC0yOjEyMzQ1Njc4OTAxMjp0YXJnZXRncm91cC9teS10YXJnZXQtZ3JvdXAvNTBkYzZjNDk1YzBjOTE4OCcsXG4gICAgfSk7XG5cbiAgICBleHBlY3QoKCkgPT4gdGFyZ2V0R3JvdXAubWV0cmljcy5jdXN0b20oJ01ldHJpY05hbWUnKSkudG9UaHJvdygpO1xuICB9KTtcbn0pO1xuIl19