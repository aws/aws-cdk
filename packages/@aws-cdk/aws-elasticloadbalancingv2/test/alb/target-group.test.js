"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const ec2 = require("@aws-cdk/aws-ec2");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cdk = require("@aws-cdk/core");
const elbv2 = require("../../lib");
const helpers_1 = require("../helpers");
describe('tests', () => {
    test('Empty target Group without type still requires a VPC', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        // WHEN
        new elbv2.ApplicationTargetGroup(stack, 'LB', {});
        // THEN
        expect(() => {
            app.synth();
        }).toThrow(/'vpc' is required for a non-Lambda TargetGroup/);
    });
    test('Lambda target should not have stickiness.enabled set', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        new elbv2.ApplicationTargetGroup(stack, 'TG', {
            targetType: elbv2.TargetType.LAMBDA,
        });
        const tg = new elbv2.ApplicationTargetGroup(stack, 'TG2');
        tg.addTarget({
            attachToApplicationTargetGroup(_targetGroup) {
                return {
                    targetType: elbv2.TargetType.LAMBDA,
                    targetJson: { id: 'arn:aws:lambda:eu-west-1:123456789012:function:myFn' },
                };
            },
        });
        const matches = assertions_1.Template.fromStack(stack).findResources('AWS::ElasticLoadBalancingV2::TargetGroup', {
            TargetGroupAttributes: [
                {
                    Key: 'stickiness.enabled',
                },
            ],
        });
        expect(Object.keys(matches).length).toBe(0);
    });
    test('Lambda target should not have port set', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const tg = new elbv2.ApplicationTargetGroup(stack, 'TG2', {
            protocol: elbv2.ApplicationProtocol.HTTPS,
        });
        tg.addTarget({
            attachToApplicationTargetGroup(_targetGroup) {
                return {
                    targetType: elbv2.TargetType.LAMBDA,
                    targetJson: { id: 'arn:aws:lambda:eu-west-1:123456789012:function:myFn' },
                };
            },
        });
        expect(() => app.synth()).toThrow(/port\/protocol should not be specified for Lambda targets/);
    });
    test('Lambda target should not have protocol set', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        new elbv2.ApplicationTargetGroup(stack, 'TG', {
            port: 443,
            targetType: elbv2.TargetType.LAMBDA,
        });
        expect(() => app.synth()).toThrow(/port\/protocol should not be specified for Lambda targets/);
    });
    test('Can add self-registering target to imported TargetGroup', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'Vpc');
        // WHEN
        const tg = elbv2.ApplicationTargetGroup.fromTargetGroupAttributes(stack, 'TG', {
            targetGroupArn: 'arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/myAlbTargetGroup/73e2d6bc24d8a067',
        });
        tg.addTarget(new helpers_1.FakeSelfRegisteringTarget(stack, 'Target', vpc));
    });
    cdk_build_tools_1.testDeprecated('Cannot add direct target to imported TargetGroup', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const tg = elbv2.ApplicationTargetGroup.fromTargetGroupAttributes(stack, 'TG', {
            targetGroupArn: 'arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/myAlbTargetGroup/73e2d6bc24d8a067',
        });
        // WHEN
        expect(() => {
            tg.addTarget(new elbv2.InstanceTarget('i-1234'));
        }).toThrow(/Cannot add a non-self registering target to an imported TargetGroup/);
    });
    cdk_build_tools_1.testDeprecated('HealthCheck fields set if provided', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'VPC', {});
        const alb = new elbv2.ApplicationLoadBalancer(stack, 'ALB', { vpc });
        const listener = new elbv2.ApplicationListener(stack, 'Listener', {
            port: 80,
            loadBalancer: alb,
            open: false,
        });
        // WHEN
        const ipTarget = new elbv2.IpTarget('10.10.12.12');
        listener.addTargets('TargetGroup', {
            targets: [ipTarget],
            port: 80,
            healthCheck: {
                enabled: true,
                healthyHttpCodes: '255',
                interval: cdk.Duration.seconds(255),
                timeout: cdk.Duration.seconds(192),
                healthyThresholdCount: 29,
                unhealthyThresholdCount: 27,
                path: '/arbitrary',
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
            HealthCheckEnabled: true,
            HealthCheckIntervalSeconds: 255,
            HealthCheckPath: '/arbitrary',
            HealthCheckTimeoutSeconds: 192,
            HealthyThresholdCount: 29,
            Matcher: {
                HttpCode: '255',
            },
            Port: 80,
            UnhealthyThresholdCount: 27,
        });
    });
    test('Load balancer duration cookie stickiness', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'VPC', {});
        // WHEN
        new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', {
            stickinessCookieDuration: cdk.Duration.minutes(5),
            vpc,
        });
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
                    Value: '300',
                },
            ],
        });
    });
    test('Load balancer app cookie stickiness', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'VPC', {});
        // WHEN
        new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', {
            stickinessCookieDuration: cdk.Duration.minutes(5),
            stickinessCookieName: 'MyDeliciousCookie',
            vpc,
        });
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
                    Value: '300',
                },
            ],
        });
    });
    test('Custom Load balancer algorithm type', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'VPC', {});
        // WHEN
        new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', {
            loadBalancingAlgorithmType: elbv2.TargetGroupLoadBalancingAlgorithmType.LEAST_OUTSTANDING_REQUESTS,
            vpc,
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
    test('Can set a protocol version', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'VPC', {});
        // WHEN
        new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', {
            vpc,
            protocolVersion: elbv2.ApplicationProtocolVersion.GRPC,
            healthCheck: {
                enabled: true,
                healthyGrpcCodes: '0-99',
                interval: cdk.Duration.seconds(255),
                timeout: cdk.Duration.seconds(192),
                healthyThresholdCount: 29,
                unhealthyThresholdCount: 27,
                path: '/arbitrary',
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
            ProtocolVersion: 'GRPC',
            HealthCheckEnabled: true,
            HealthCheckIntervalSeconds: 255,
            HealthCheckPath: '/arbitrary',
            HealthCheckTimeoutSeconds: 192,
            HealthyThresholdCount: 29,
            Matcher: {
                GrpcCode: '0-99',
            },
            UnhealthyThresholdCount: 27,
        });
    });
    test('Bad stickiness cookie names', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'VPC', {});
        const errMessage = 'App cookie names that start with the following prefixes are not allowed: AWSALB, AWSALBAPP, and AWSALBTG; they\'re reserved for use by the load balancer';
        // THEN
        ['AWSALBCookieName', 'AWSALBstickinessCookieName', 'AWSALBTGCookieName'].forEach((badCookieName, i) => {
            expect(() => {
                new elbv2.ApplicationTargetGroup(stack, `TargetGroup${i}`, {
                    stickinessCookieDuration: cdk.Duration.minutes(5),
                    stickinessCookieName: badCookieName,
                    vpc,
                });
            }).toThrow(errMessage);
        });
    });
    test('Empty stickiness cookie name', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'VPC', {});
        // THEN
        expect(() => {
            new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', {
                stickinessCookieDuration: cdk.Duration.minutes(5),
                stickinessCookieName: '',
                vpc,
            });
        }).toThrow(/App cookie name cannot be an empty string./);
    });
    test('Bad stickiness duration value', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'VPC', {});
        // THEN
        expect(() => {
            new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', {
                stickinessCookieDuration: cdk.Duration.days(8),
                vpc,
            });
        }).toThrow(/Stickiness cookie duration value must be between 1 second and 7 days \(604800 seconds\)./);
    });
    test('Bad slow start duration value', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'VPC', {});
        // THEN
        [cdk.Duration.minutes(16), cdk.Duration.seconds(29)].forEach((badDuration, i) => {
            expect(() => {
                new elbv2.ApplicationTargetGroup(stack, `TargetGroup${i}`, {
                    slowStart: badDuration,
                    vpc,
                });
            }).toThrow(/Slow start duration value must be between 30 and 900 seconds./);
        });
    });
    test.each([elbv2.Protocol.UDP, elbv2.Protocol.TCP_UDP, elbv2.Protocol.TLS])('Throws validation error, when `healthCheck` has `protocol` set to %s', (protocol) => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'VPC', {});
        // WHEN
        new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', {
            vpc,
            healthCheck: {
                protocol: protocol,
            },
        });
        // THEN
        expect(() => {
            app.synth();
        }).toThrow(`Health check protocol '${protocol}' is not supported. Must be one of [HTTP, HTTPS]`);
    });
    test.each([elbv2.Protocol.UDP, elbv2.Protocol.TCP_UDP, elbv2.Protocol.TLS])('Throws validation error, when `configureHealthCheck()` has `protocol` set to %s', (protocol) => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'VPC', {});
        const tg = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', {
            vpc,
        });
        // WHEN
        tg.configureHealthCheck({
            protocol: protocol,
        });
        // THEN
        expect(() => {
            app.synth();
        }).toThrow(`Health check protocol '${protocol}' is not supported. Must be one of [HTTP, HTTPS]`);
    });
    test.each([elbv2.Protocol.HTTP, elbv2.Protocol.HTTPS])('Does not throw validation error, when `healthCheck` has `protocol` set to %s', (protocol) => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'VPC', {});
        // WHEN
        new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', {
            vpc,
            healthCheck: {
                protocol: protocol,
            },
        });
        // THEN
        expect(() => {
            app.synth();
        }).not.toThrowError();
    });
    test.each([elbv2.Protocol.HTTP, elbv2.Protocol.HTTPS])('Does not throw validation error, when `configureHealthCheck()` has `protocol` set to %s', (protocol) => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'VPC', {});
        const tg = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', {
            vpc,
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
    test.each([elbv2.Protocol.HTTP, elbv2.Protocol.HTTPS])('Throws validation error, when `healthCheck` has `protocol` set to %s and `interval` is equal to `timeout`', (protocol) => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'VPC', {});
        // WHEN
        new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', {
            vpc,
            healthCheck: {
                interval: cdk.Duration.seconds(60),
                timeout: cdk.Duration.seconds(60),
                protocol: protocol,
            },
        });
        // THEN
        expect(() => {
            app.synth();
        }).toThrow('Healthcheck interval 1 minute must be greater than the timeout 1 minute');
    });
    test.each([elbv2.Protocol.HTTP, elbv2.Protocol.HTTPS])('Throws validation error, when `healthCheck` has `protocol` set to %s and `interval` is smaller than `timeout`', (protocol) => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'VPC', {});
        // WHEN
        new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', {
            vpc,
            healthCheck: {
                interval: cdk.Duration.seconds(60),
                timeout: cdk.Duration.seconds(120),
                protocol: protocol,
            },
        });
        // THEN
        expect(() => {
            app.synth();
        }).toThrow('Healthcheck interval 1 minute must be greater than the timeout 2 minutes');
    });
    test.each([elbv2.Protocol.HTTP, elbv2.Protocol.HTTPS])('Throws validation error, when `configureHealthCheck()` has `protocol` set to %s and `interval` is equal to `timeout`', (protocol) => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'VPC', {});
        const tg = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', {
            vpc,
        });
        // WHEN
        tg.configureHealthCheck({
            interval: cdk.Duration.seconds(60),
            timeout: cdk.Duration.seconds(60),
            protocol: protocol,
        });
        // THEN
        expect(() => {
            app.synth();
        }).toThrow('Healthcheck interval 1 minute must be greater than the timeout 1 minute');
    });
    test.each([elbv2.Protocol.HTTP, elbv2.Protocol.HTTPS])('Throws validation error, when `configureHealthCheck()` has `protocol` set to %s and `interval` is smaller than `timeout`', (protocol) => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'VPC', {});
        const tg = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', {
            vpc,
        });
        // WHEN
        tg.configureHealthCheck({
            interval: cdk.Duration.seconds(60),
            timeout: cdk.Duration.seconds(120),
            protocol: protocol,
        });
        // THEN
        expect(() => {
            app.synth();
        }).toThrow('Healthcheck interval 1 minute must be greater than the timeout 2 minutes');
    });
    test('Throws validation error, when `configureHealthCheck()`protocol is undefined and `interval` is smaller than `timeout`', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const vpc = new ec2.Vpc(stack, 'VPC', {});
        const tg = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', {
            vpc,
        });
        // WHEN
        tg.configureHealthCheck({
            interval: cdk.Duration.seconds(60),
            timeout: cdk.Duration.seconds(120),
        });
        // THEN
        expect(() => {
            app.synth();
        }).toThrow('Healthcheck interval 1 minute must be greater than the timeout 2 minute');
    });
    test('imported targetGroup has targetGroupName', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        // WHEN
        const importedTg = elbv2.ApplicationTargetGroup.fromTargetGroupAttributes(stack, 'importedTg', {
            targetGroupArn: 'arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/myAlbTargetGroup/73e2d6bc24d8a067',
        });
        // THEN
        expect(importedTg.targetGroupName).toEqual('myAlbTargetGroup');
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
                    // myAlbTargetGroup
                    1,
                    {
                        'Fn::Split': [
                            // [targetgroup, myAlbTargetGroup, 73e2d6bc24d8a067]
                            '/',
                            {
                                'Fn::Select': [
                                    // targetgroup/myAlbTargetGroup/73e2d6bc24d8a067
                                    5,
                                    {
                                        'Fn::Split': [
                                            // [arn, aws, elasticloadbalancing, us-west-2, 123456789012, targetgroup/myAlbTargetGroup/73e2d6bc24d8a067]
                                            ':',
                                            {
                                                // arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/myAlbTargetGroup/73e2d6bc24d8a067
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
        const targetGroup = elbv2.ApplicationTargetGroup.fromTargetGroupAttributes(stack, 'importedTg', {
            targetGroupArn: 'arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/my-target-group/50dc6c495c0c9188',
            loadBalancerArns: 'arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/app/my-load-balancer/73e2d6bc24d8a067',
        });
        const metric = targetGroup.metrics.custom('MetricName');
        // THEN
        expect(metric.namespace).toEqual('AWS/ApplicationELB');
        expect(stack.resolve(metric.dimensions)).toEqual({
            LoadBalancer: 'app/my-load-balancer/73e2d6bc24d8a067',
            TargetGroup: 'targetgroup/my-target-group/50dc6c495c0c9188',
        });
    });
    test('imported targetGroup without load balancer cannot have metrics', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        // WHEN
        const targetGroup = elbv2.ApplicationTargetGroup.fromTargetGroupAttributes(stack, 'importedTg', {
            targetGroupArn: 'arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/my-target-group/50dc6c495c0c9188',
        });
        expect(() => targetGroup.metrics.custom('MetricName')).toThrow();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFyZ2V0LWdyb3VwLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0YXJnZXQtZ3JvdXAudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyx3Q0FBd0M7QUFDeEMsOERBQTBEO0FBQzFELHFDQUFxQztBQUNyQyxtQ0FBbUM7QUFDbkMsd0NBQXVEO0FBRXZELFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0lBQ3JCLElBQUksQ0FBQyxzREFBc0QsRUFBRSxHQUFHLEVBQUU7UUFDaEUsUUFBUTtRQUNSLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFMUMsT0FBTztRQUNQLElBQUksS0FBSyxDQUFDLHNCQUFzQixDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFbEQsT0FBTztRQUNQLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDVixHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDZCxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0RBQWdELENBQUMsQ0FBQztJQUMvRCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxzREFBc0QsRUFBRSxHQUFHLEVBQUU7UUFDaEUsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUUxQyxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO1lBQzVDLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU07U0FDcEMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxFQUFFLEdB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QUU7UUFDMUUsUUFBUTtRQUNSLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFMUMsT0FBTztRQUNQLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO1lBQzlGLGNBQWMsRUFBRSxrR0FBa0c7U0FDbkgsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDbkUsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgeyB0ZXN0RGVwcmVjYXRlZCB9IGZyb20gJ0Bhd3MtY2RrL2Nkay1idWlsZC10b29scyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBlbGJ2MiBmcm9tICcuLi8uLi9saWInO1xuaW1wb3J0IHsgRmFrZVNlbGZSZWdpc3RlcmluZ1RhcmdldCB9IGZyb20gJy4uL2hlbHBlcnMnO1xuXG5kZXNjcmliZSgndGVzdHMnLCAoKSA9PiB7XG4gIHRlc3QoJ0VtcHR5IHRhcmdldCBHcm91cCB3aXRob3V0IHR5cGUgc3RpbGwgcmVxdWlyZXMgYSBWUEMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdTdGFjaycpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBlbGJ2Mi5BcHBsaWNhdGlvblRhcmdldEdyb3VwKHN0YWNrLCAnTEInLCB7fSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGFwcC5zeW50aCgpO1xuICAgIH0pLnRvVGhyb3coLyd2cGMnIGlzIHJlcXVpcmVkIGZvciBhIG5vbi1MYW1iZGEgVGFyZ2V0R3JvdXAvKTtcbiAgfSk7XG5cbiAgdGVzdCgnTGFtYmRhIHRhcmdldCBzaG91bGQgbm90IGhhdmUgc3RpY2tpbmVzcy5lbmFibGVkIHNldCcsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdTdGFjaycpO1xuXG4gICAgbmV3IGVsYnYyLkFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAoc3RhY2ssICdURycsIHtcbiAgICAgIHRhcmdldFR5cGU6IGVsYnYyLlRhcmdldFR5cGUuTEFNQkRBLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdGcgPSBuZXcgZWxidjIuQXBwbGljYXRpb25UYXJnZXRHcm91cChzdGFjaywgJ1RHMicpO1xuICAgIHRnLmFkZFRhcmdldCh7XG4gICAgICBhdHRhY2hUb0FwcGxpY2F0aW9uVGFyZ2V0R3JvdXAoX3RhcmdldEdyb3VwOiBlbGJ2Mi5JQXBwbGljYXRpb25UYXJnZXRHcm91cCk6IGVsYnYyLkxvYWRCYWxhbmNlclRhcmdldFByb3BzIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0YXJnZXRUeXBlOiBlbGJ2Mi5UYXJnZXRUeXBlLkxBTUJEQSxcbiAgICAgICAgICB0YXJnZXRKc29uOiB7IGlkOiAnYXJuOmF3czpsYW1iZGE6ZXUtd2VzdC0xOjEyMzQ1Njc4OTAxMjpmdW5jdGlvbjpteUZuJyB9LFxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IG1hdGNoZXMgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmZpbmRSZXNvdXJjZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6VGFyZ2V0R3JvdXAnLCB7XG4gICAgICBUYXJnZXRHcm91cEF0dHJpYnV0ZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEtleTogJ3N0aWNraW5lc3MuZW5hYmxlZCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICAgIGV4cGVjdChPYmplY3Qua2V5cyhtYXRjaGVzKS5sZW5ndGgpLnRvQmUoMCk7XG4gIH0pO1xuXG4gIHRlc3QoJ0xhbWJkYSB0YXJnZXQgc2hvdWxkIG5vdCBoYXZlIHBvcnQgc2V0JywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1N0YWNrJyk7XG5cbiAgICBjb25zdCB0ZyA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvblRhcmdldEdyb3VwKHN0YWNrLCAnVEcyJywge1xuICAgICAgcHJvdG9jb2w6IGVsYnYyLkFwcGxpY2F0aW9uUHJvdG9jb2wuSFRUUFMsXG4gICAgfSk7XG4gICAgdGcuYWRkVGFyZ2V0KHtcbiAgICAgIGF0dGFjaFRvQXBwbGljYXRpb25UYXJnZXRHcm91cChfdGFyZ2V0R3JvdXA6IGVsYnYyLklBcHBsaWNhdGlvblRhcmdldEdyb3VwKTogZWxidjIuTG9hZEJhbGFuY2VyVGFyZ2V0UHJvcHMge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHRhcmdldFR5cGU6IGVsYnYyLlRhcmdldFR5cGUuTEFNQkRBLFxuICAgICAgICAgIHRhcmdldEpzb246IHsgaWQ6ICdhcm46YXdzOmxhbWJkYTpldS13ZXN0LTE6MTIzNDU2Nzg5MDEyOmZ1bmN0aW9uOm15Rm4nIH0sXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgIH0pO1xuICAgIGV4cGVjdCgoKSA9PiBhcHAuc3ludGgoKSkudG9UaHJvdygvcG9ydFxcL3Byb3RvY29sIHNob3VsZCBub3QgYmUgc3BlY2lmaWVkIGZvciBMYW1iZGEgdGFyZ2V0cy8pO1xuICB9KTtcblxuICB0ZXN0KCdMYW1iZGEgdGFyZ2V0IHNob3VsZCBub3QgaGF2ZSBwcm90b2NvbCBzZXQnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnU3RhY2snKTtcblxuICAgIG5ldyBlbGJ2Mi5BcHBsaWNhdGlvblRhcmdldEdyb3VwKHN0YWNrLCAnVEcnLCB7XG4gICAgICBwb3J0OiA0NDMsXG4gICAgICB0YXJnZXRUeXBlOiBlbGJ2Mi5UYXJnZXRUeXBlLkxBTUJEQSxcbiAgICB9KTtcbiAgICBleHBlY3QoKCkgPT4gYXBwLnN5bnRoKCkpLnRvVGhyb3coL3BvcnRcXC9wcm90b2NvbCBzaG91bGQgbm90IGJlIHNwZWNpZmllZCBmb3IgTGFtYmRhIHRhcmdldHMvKTtcbiAgfSk7XG5cbiAgdGVzdCgnQ2FuIGFkZCBzZWxmLXJlZ2lzdGVyaW5nIHRhcmdldCB0byBpbXBvcnRlZCBUYXJnZXRHcm91cCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1N0YWNrJyk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB0ZyA9IGVsYnYyLkFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAuZnJvbVRhcmdldEdyb3VwQXR0cmlidXRlcyhzdGFjaywgJ1RHJywge1xuICAgICAgdGFyZ2V0R3JvdXBBcm46ICdhcm46YXdzOmVsYXN0aWNsb2FkYmFsYW5jaW5nOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6dGFyZ2V0Z3JvdXAvbXlBbGJUYXJnZXRHcm91cC83M2UyZDZiYzI0ZDhhMDY3JyxcbiAgICB9KTtcbiAgICB0Zy5hZGRUYXJnZXQobmV3IEZha2VTZWxmUmVnaXN0ZXJpbmdUYXJnZXQoc3RhY2ssICdUYXJnZXQnLCB2cGMpKTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ0Nhbm5vdCBhZGQgZGlyZWN0IHRhcmdldCB0byBpbXBvcnRlZCBUYXJnZXRHcm91cCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1N0YWNrJyk7XG4gICAgY29uc3QgdGcgPSBlbGJ2Mi5BcHBsaWNhdGlvblRhcmdldEdyb3VwLmZyb21UYXJnZXRHcm91cEF0dHJpYnV0ZXMoc3RhY2ssICdURycsIHtcbiAgICAgIHRhcmdldEdyb3VwQXJuOiAnYXJuOmF3czplbGFzdGljbG9hZGJhbGFuY2luZzp1cy13ZXN0LTI6MTIzNDU2Nzg5MDEyOnRhcmdldGdyb3VwL215QWxiVGFyZ2V0R3JvdXAvNzNlMmQ2YmMyNGQ4YTA2NycsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIHRnLmFkZFRhcmdldChuZXcgZWxidjIuSW5zdGFuY2VUYXJnZXQoJ2ktMTIzNCcpKTtcbiAgICB9KS50b1Rocm93KC9DYW5ub3QgYWRkIGEgbm9uLXNlbGYgcmVnaXN0ZXJpbmcgdGFyZ2V0IHRvIGFuIGltcG9ydGVkIFRhcmdldEdyb3VwLyk7XG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCdIZWFsdGhDaGVjayBmaWVsZHMgc2V0IGlmIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnU3RhY2snKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycsIHt9KTtcbiAgICBjb25zdCBhbGIgPSBuZXcgZWxidjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc3RhY2ssICdBTEInLCB7IHZwYyB9KTtcbiAgICBjb25zdCBsaXN0ZW5lciA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxpc3RlbmVyKHN0YWNrLCAnTGlzdGVuZXInLCB7XG4gICAgICBwb3J0OiA4MCxcbiAgICAgIGxvYWRCYWxhbmNlcjogYWxiLFxuICAgICAgb3BlbjogZmFsc2UsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgaXBUYXJnZXQgPSBuZXcgZWxidjIuSXBUYXJnZXQoJzEwLjEwLjEyLjEyJyk7XG4gICAgbGlzdGVuZXIuYWRkVGFyZ2V0cygnVGFyZ2V0R3JvdXAnLCB7XG4gICAgICB0YXJnZXRzOiBbaXBUYXJnZXRdLFxuICAgICAgcG9ydDogODAsXG4gICAgICBoZWFsdGhDaGVjazoge1xuICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICBoZWFsdGh5SHR0cENvZGVzOiAnMjU1JyxcbiAgICAgICAgaW50ZXJ2YWw6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDI1NSksXG4gICAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDE5MiksXG4gICAgICAgIGhlYWx0aHlUaHJlc2hvbGRDb3VudDogMjksXG4gICAgICAgIHVuaGVhbHRoeVRocmVzaG9sZENvdW50OiAyNyxcbiAgICAgICAgcGF0aDogJy9hcmJpdHJhcnknLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpUYXJnZXRHcm91cCcsIHtcbiAgICAgIEhlYWx0aENoZWNrRW5hYmxlZDogdHJ1ZSxcbiAgICAgIEhlYWx0aENoZWNrSW50ZXJ2YWxTZWNvbmRzOiAyNTUsXG4gICAgICBIZWFsdGhDaGVja1BhdGg6ICcvYXJiaXRyYXJ5JyxcbiAgICAgIEhlYWx0aENoZWNrVGltZW91dFNlY29uZHM6IDE5MixcbiAgICAgIEhlYWx0aHlUaHJlc2hvbGRDb3VudDogMjksXG4gICAgICBNYXRjaGVyOiB7XG4gICAgICAgIEh0dHBDb2RlOiAnMjU1JyxcbiAgICAgIH0sXG4gICAgICBQb3J0OiA4MCxcbiAgICAgIFVuaGVhbHRoeVRocmVzaG9sZENvdW50OiAyNyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnTG9hZCBiYWxhbmNlciBkdXJhdGlvbiBjb29raWUgc3RpY2tpbmVzcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1N0YWNrJyk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnLCB7fSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVsYnYyLkFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAoc3RhY2ssICdUYXJnZXRHcm91cCcsIHtcbiAgICAgIHN0aWNraW5lc3NDb29raWVEdXJhdGlvbjogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoNSksXG4gICAgICB2cGMsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6VGFyZ2V0R3JvdXAnLCB7XG4gICAgICBUYXJnZXRHcm91cEF0dHJpYnV0ZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEtleTogJ3N0aWNraW5lc3MuZW5hYmxlZCcsXG4gICAgICAgICAgVmFsdWU6ICd0cnVlJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIEtleTogJ3N0aWNraW5lc3MudHlwZScsXG4gICAgICAgICAgVmFsdWU6ICdsYl9jb29raWUnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgS2V5OiAnc3RpY2tpbmVzcy5sYl9jb29raWUuZHVyYXRpb25fc2Vjb25kcycsXG4gICAgICAgICAgVmFsdWU6ICczMDAnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnTG9hZCBiYWxhbmNlciBhcHAgY29va2llIHN0aWNraW5lc3MnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdTdGFjaycpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJywge30pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBlbGJ2Mi5BcHBsaWNhdGlvblRhcmdldEdyb3VwKHN0YWNrLCAnVGFyZ2V0R3JvdXAnLCB7XG4gICAgICBzdGlja2luZXNzQ29va2llRHVyYXRpb246IGNkay5EdXJhdGlvbi5taW51dGVzKDUpLFxuICAgICAgc3RpY2tpbmVzc0Nvb2tpZU5hbWU6ICdNeURlbGljaW91c0Nvb2tpZScsXG4gICAgICB2cGMsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6VGFyZ2V0R3JvdXAnLCB7XG4gICAgICBUYXJnZXRHcm91cEF0dHJpYnV0ZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEtleTogJ3N0aWNraW5lc3MuZW5hYmxlZCcsXG4gICAgICAgICAgVmFsdWU6ICd0cnVlJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIEtleTogJ3N0aWNraW5lc3MudHlwZScsXG4gICAgICAgICAgVmFsdWU6ICdhcHBfY29va2llJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIEtleTogJ3N0aWNraW5lc3MuYXBwX2Nvb2tpZS5jb29raWVfbmFtZScsXG4gICAgICAgICAgVmFsdWU6ICdNeURlbGljaW91c0Nvb2tpZScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBLZXk6ICdzdGlja2luZXNzLmFwcF9jb29raWUuZHVyYXRpb25fc2Vjb25kcycsXG4gICAgICAgICAgVmFsdWU6ICczMDAnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQ3VzdG9tIExvYWQgYmFsYW5jZXIgYWxnb3JpdGhtIHR5cGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdTdGFjaycpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJywge30pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBlbGJ2Mi5BcHBsaWNhdGlvblRhcmdldEdyb3VwKHN0YWNrLCAnVGFyZ2V0R3JvdXAnLCB7XG4gICAgICBsb2FkQmFsYW5jaW5nQWxnb3JpdGhtVHlwZTogZWxidjIuVGFyZ2V0R3JvdXBMb2FkQmFsYW5jaW5nQWxnb3JpdGhtVHlwZS5MRUFTVF9PVVRTVEFORElOR19SRVFVRVNUUyxcbiAgICAgIHZwYyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpUYXJnZXRHcm91cCcsIHtcbiAgICAgIFRhcmdldEdyb3VwQXR0cmlidXRlczogW1xuICAgICAgICB7XG4gICAgICAgICAgS2V5OiAnc3RpY2tpbmVzcy5lbmFibGVkJyxcbiAgICAgICAgICBWYWx1ZTogJ2ZhbHNlJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIEtleTogJ2xvYWRfYmFsYW5jaW5nLmFsZ29yaXRobS50eXBlJyxcbiAgICAgICAgICBWYWx1ZTogJ2xlYXN0X291dHN0YW5kaW5nX3JlcXVlc3RzJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0NhbiBzZXQgYSBwcm90b2NvbCB2ZXJzaW9uJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnU3RhY2snKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycsIHt9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWxidjIuQXBwbGljYXRpb25UYXJnZXRHcm91cChzdGFjaywgJ1RhcmdldEdyb3VwJywge1xuICAgICAgdnBjLFxuICAgICAgcHJvdG9jb2xWZXJzaW9uOiBlbGJ2Mi5BcHBsaWNhdGlvblByb3RvY29sVmVyc2lvbi5HUlBDLFxuICAgICAgaGVhbHRoQ2hlY2s6IHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgaGVhbHRoeUdycGNDb2RlczogJzAtOTknLFxuICAgICAgICBpbnRlcnZhbDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMjU1KSxcbiAgICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMTkyKSxcbiAgICAgICAgaGVhbHRoeVRocmVzaG9sZENvdW50OiAyOSxcbiAgICAgICAgdW5oZWFsdGh5VGhyZXNob2xkQ291bnQ6IDI3LFxuICAgICAgICBwYXRoOiAnL2FyYml0cmFyeScsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OlRhcmdldEdyb3VwJywge1xuICAgICAgUHJvdG9jb2xWZXJzaW9uOiAnR1JQQycsXG4gICAgICBIZWFsdGhDaGVja0VuYWJsZWQ6IHRydWUsXG4gICAgICBIZWFsdGhDaGVja0ludGVydmFsU2Vjb25kczogMjU1LFxuICAgICAgSGVhbHRoQ2hlY2tQYXRoOiAnL2FyYml0cmFyeScsXG4gICAgICBIZWFsdGhDaGVja1RpbWVvdXRTZWNvbmRzOiAxOTIsXG4gICAgICBIZWFsdGh5VGhyZXNob2xkQ291bnQ6IDI5LFxuICAgICAgTWF0Y2hlcjoge1xuICAgICAgICBHcnBjQ29kZTogJzAtOTknLFxuICAgICAgfSxcbiAgICAgIFVuaGVhbHRoeVRocmVzaG9sZENvdW50OiAyNyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQmFkIHN0aWNraW5lc3MgY29va2llIG5hbWVzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnU3RhY2snKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycsIHt9KTtcbiAgICBjb25zdCBlcnJNZXNzYWdlID0gJ0FwcCBjb29raWUgbmFtZXMgdGhhdCBzdGFydCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJlZml4ZXMgYXJlIG5vdCBhbGxvd2VkOiBBV1NBTEIsIEFXU0FMQkFQUCwgYW5kIEFXU0FMQlRHOyB0aGV5XFwncmUgcmVzZXJ2ZWQgZm9yIHVzZSBieSB0aGUgbG9hZCBiYWxhbmNlcic7XG5cbiAgICAvLyBUSEVOXG4gICAgWydBV1NBTEJDb29raWVOYW1lJywgJ0FXU0FMQnN0aWNraW5lc3NDb29raWVOYW1lJywgJ0FXU0FMQlRHQ29va2llTmFtZSddLmZvckVhY2goKGJhZENvb2tpZU5hbWUsIGkpID0+IHtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBlbGJ2Mi5BcHBsaWNhdGlvblRhcmdldEdyb3VwKHN0YWNrLCBgVGFyZ2V0R3JvdXAke2l9YCwge1xuICAgICAgICAgIHN0aWNraW5lc3NDb29raWVEdXJhdGlvbjogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoNSksXG4gICAgICAgICAgc3RpY2tpbmVzc0Nvb2tpZU5hbWU6IGJhZENvb2tpZU5hbWUsXG4gICAgICAgICAgdnBjLFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coZXJyTWVzc2FnZSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0VtcHR5IHN0aWNraW5lc3MgY29va2llIG5hbWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdTdGFjaycpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJywge30pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgZWxidjIuQXBwbGljYXRpb25UYXJnZXRHcm91cChzdGFjaywgJ1RhcmdldEdyb3VwJywge1xuICAgICAgICBzdGlja2luZXNzQ29va2llRHVyYXRpb246IGNkay5EdXJhdGlvbi5taW51dGVzKDUpLFxuICAgICAgICBzdGlja2luZXNzQ29va2llTmFtZTogJycsXG4gICAgICAgIHZwYyxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL0FwcCBjb29raWUgbmFtZSBjYW5ub3QgYmUgYW4gZW1wdHkgc3RyaW5nLi8pO1xuICB9KTtcblxuICB0ZXN0KCdCYWQgc3RpY2tpbmVzcyBkdXJhdGlvbiB2YWx1ZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1N0YWNrJyk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnLCB7fSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBlbGJ2Mi5BcHBsaWNhdGlvblRhcmdldEdyb3VwKHN0YWNrLCAnVGFyZ2V0R3JvdXAnLCB7XG4gICAgICAgIHN0aWNraW5lc3NDb29raWVEdXJhdGlvbjogY2RrLkR1cmF0aW9uLmRheXMoOCksXG4gICAgICAgIHZwYyxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL1N0aWNraW5lc3MgY29va2llIGR1cmF0aW9uIHZhbHVlIG11c3QgYmUgYmV0d2VlbiAxIHNlY29uZCBhbmQgNyBkYXlzIFxcKDYwNDgwMCBzZWNvbmRzXFwpLi8pO1xuICB9KTtcblxuICB0ZXN0KCdCYWQgc2xvdyBzdGFydCBkdXJhdGlvbiB2YWx1ZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1N0YWNrJyk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnLCB7fSk7XG5cbiAgICAvLyBUSEVOXG4gICAgW2Nkay5EdXJhdGlvbi5taW51dGVzKDE2KSwgY2RrLkR1cmF0aW9uLnNlY29uZHMoMjkpXS5mb3JFYWNoKChiYWREdXJhdGlvbiwgaSkgPT4ge1xuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IGVsYnYyLkFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAoc3RhY2ssIGBUYXJnZXRHcm91cCR7aX1gLCB7XG4gICAgICAgICAgc2xvd1N0YXJ0OiBiYWREdXJhdGlvbixcbiAgICAgICAgICB2cGMsXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvU2xvdyBzdGFydCBkdXJhdGlvbiB2YWx1ZSBtdXN0IGJlIGJldHdlZW4gMzAgYW5kIDkwMCBzZWNvbmRzLi8pO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0LmVhY2goW2VsYnYyLlByb3RvY29sLlVEUCwgZWxidjIuUHJvdG9jb2wuVENQX1VEUCwgZWxidjIuUHJvdG9jb2wuVExTXSkoXG4gICAgJ1Rocm93cyB2YWxpZGF0aW9uIGVycm9yLCB3aGVuIGBoZWFsdGhDaGVja2AgaGFzIGBwcm90b2NvbGAgc2V0IHRvICVzJyxcbiAgICAocHJvdG9jb2wpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1N0YWNrJyk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycsIHt9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGVsYnYyLkFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAoc3RhY2ssICdUYXJnZXRHcm91cCcsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBoZWFsdGhDaGVjazoge1xuICAgICAgICAgIHByb3RvY29sOiBwcm90b2NvbCxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBhcHAuc3ludGgoKTtcbiAgICAgIH0pLnRvVGhyb3coYEhlYWx0aCBjaGVjayBwcm90b2NvbCAnJHtwcm90b2NvbH0nIGlzIG5vdCBzdXBwb3J0ZWQuIE11c3QgYmUgb25lIG9mIFtIVFRQLCBIVFRQU11gKTtcbiAgICB9KTtcblxuICB0ZXN0LmVhY2goW2VsYnYyLlByb3RvY29sLlVEUCwgZWxidjIuUHJvdG9jb2wuVENQX1VEUCwgZWxidjIuUHJvdG9jb2wuVExTXSkoXG4gICAgJ1Rocm93cyB2YWxpZGF0aW9uIGVycm9yLCB3aGVuIGBjb25maWd1cmVIZWFsdGhDaGVjaygpYCBoYXMgYHByb3RvY29sYCBzZXQgdG8gJXMnLFxuICAgIChwcm90b2NvbCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnU3RhY2snKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJywge30pO1xuICAgICAgY29uc3QgdGcgPSBuZXcgZWxidjIuQXBwbGljYXRpb25UYXJnZXRHcm91cChzdGFjaywgJ1RhcmdldEdyb3VwJywge1xuICAgICAgICB2cGMsXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgdGcuY29uZmlndXJlSGVhbHRoQ2hlY2soe1xuICAgICAgICBwcm90b2NvbDogcHJvdG9jb2wsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgYXBwLnN5bnRoKCk7XG4gICAgICB9KS50b1Rocm93KGBIZWFsdGggY2hlY2sgcHJvdG9jb2wgJyR7cHJvdG9jb2x9JyBpcyBub3Qgc3VwcG9ydGVkLiBNdXN0IGJlIG9uZSBvZiBbSFRUUCwgSFRUUFNdYCk7XG4gICAgfSk7XG5cbiAgdGVzdC5lYWNoKFtlbGJ2Mi5Qcm90b2NvbC5IVFRQLCBlbGJ2Mi5Qcm90b2NvbC5IVFRQU10pKFxuICAgICdEb2VzIG5vdCB0aHJvdyB2YWxpZGF0aW9uIGVycm9yLCB3aGVuIGBoZWFsdGhDaGVja2AgaGFzIGBwcm90b2NvbGAgc2V0IHRvICVzJyxcbiAgICAocHJvdG9jb2wpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1N0YWNrJyk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycsIHt9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGVsYnYyLkFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAoc3RhY2ssICdUYXJnZXRHcm91cCcsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBoZWFsdGhDaGVjazoge1xuICAgICAgICAgIHByb3RvY29sOiBwcm90b2NvbCxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBhcHAuc3ludGgoKTtcbiAgICAgIH0pLm5vdC50b1Rocm93RXJyb3IoKTtcbiAgICB9KTtcblxuICB0ZXN0LmVhY2goW2VsYnYyLlByb3RvY29sLkhUVFAsIGVsYnYyLlByb3RvY29sLkhUVFBTXSkoXG4gICAgJ0RvZXMgbm90IHRocm93IHZhbGlkYXRpb24gZXJyb3IsIHdoZW4gYGNvbmZpZ3VyZUhlYWx0aENoZWNrKClgIGhhcyBgcHJvdG9jb2xgIHNldCB0byAlcycsXG4gICAgKHByb3RvY29sKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdTdGFjaycpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnLCB7fSk7XG4gICAgICBjb25zdCB0ZyA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvblRhcmdldEdyb3VwKHN0YWNrLCAnVGFyZ2V0R3JvdXAnLCB7XG4gICAgICAgIHZwYyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICB0Zy5jb25maWd1cmVIZWFsdGhDaGVjayh7XG4gICAgICAgIHByb3RvY29sOiBwcm90b2NvbCxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBhcHAuc3ludGgoKTtcbiAgICAgIH0pLm5vdC50b1Rocm93RXJyb3IoKTtcbiAgICB9KTtcblxuICB0ZXN0LmVhY2goW2VsYnYyLlByb3RvY29sLkhUVFAsIGVsYnYyLlByb3RvY29sLkhUVFBTXSkoXG4gICAgJ1Rocm93cyB2YWxpZGF0aW9uIGVycm9yLCB3aGVuIGBoZWFsdGhDaGVja2AgaGFzIGBwcm90b2NvbGAgc2V0IHRvICVzIGFuZCBgaW50ZXJ2YWxgIGlzIGVxdWFsIHRvIGB0aW1lb3V0YCcsXG4gICAgKHByb3RvY29sKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdTdGFjaycpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnLCB7fSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBlbGJ2Mi5BcHBsaWNhdGlvblRhcmdldEdyb3VwKHN0YWNrLCAnVGFyZ2V0R3JvdXAnLCB7XG4gICAgICAgIHZwYyxcbiAgICAgICAgaGVhbHRoQ2hlY2s6IHtcbiAgICAgICAgICBpbnRlcnZhbDogY2RrLkR1cmF0aW9uLnNlY29uZHMoNjApLFxuICAgICAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDYwKSxcbiAgICAgICAgICBwcm90b2NvbDogcHJvdG9jb2wsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgYXBwLnN5bnRoKCk7XG4gICAgICB9KS50b1Rocm93KCdIZWFsdGhjaGVjayBpbnRlcnZhbCAxIG1pbnV0ZSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiB0aGUgdGltZW91dCAxIG1pbnV0ZScpO1xuICAgIH0pO1xuXG4gIHRlc3QuZWFjaChbZWxidjIuUHJvdG9jb2wuSFRUUCwgZWxidjIuUHJvdG9jb2wuSFRUUFNdKShcbiAgICAnVGhyb3dzIHZhbGlkYXRpb24gZXJyb3IsIHdoZW4gYGhlYWx0aENoZWNrYCBoYXMgYHByb3RvY29sYCBzZXQgdG8gJXMgYW5kIGBpbnRlcnZhbGAgaXMgc21hbGxlciB0aGFuIGB0aW1lb3V0YCcsXG4gICAgKHByb3RvY29sKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdTdGFjaycpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnLCB7fSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBlbGJ2Mi5BcHBsaWNhdGlvblRhcmdldEdyb3VwKHN0YWNrLCAnVGFyZ2V0R3JvdXAnLCB7XG4gICAgICAgIHZwYyxcbiAgICAgICAgaGVhbHRoQ2hlY2s6IHtcbiAgICAgICAgICBpbnRlcnZhbDogY2RrLkR1cmF0aW9uLnNlY29uZHMoNjApLFxuICAgICAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDEyMCksXG4gICAgICAgICAgcHJvdG9jb2w6IHByb3RvY29sLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIGFwcC5zeW50aCgpO1xuICAgICAgfSkudG9UaHJvdygnSGVhbHRoY2hlY2sgaW50ZXJ2YWwgMSBtaW51dGUgbXVzdCBiZSBncmVhdGVyIHRoYW4gdGhlIHRpbWVvdXQgMiBtaW51dGVzJyk7XG4gICAgfSk7XG5cbiAgdGVzdC5lYWNoKFtlbGJ2Mi5Qcm90b2NvbC5IVFRQLCBlbGJ2Mi5Qcm90b2NvbC5IVFRQU10pKFxuICAgICdUaHJvd3MgdmFsaWRhdGlvbiBlcnJvciwgd2hlbiBgY29uZmlndXJlSGVhbHRoQ2hlY2soKWAgaGFzIGBwcm90b2NvbGAgc2V0IHRvICVzIGFuZCBgaW50ZXJ2YWxgIGlzIGVxdWFsIHRvIGB0aW1lb3V0YCcsXG4gICAgKHByb3RvY29sKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdTdGFjaycpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnLCB7fSk7XG4gICAgICBjb25zdCB0ZyA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvblRhcmdldEdyb3VwKHN0YWNrLCAnVGFyZ2V0R3JvdXAnLCB7XG4gICAgICAgIHZwYyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICB0Zy5jb25maWd1cmVIZWFsdGhDaGVjayh7XG4gICAgICAgIGludGVydmFsOiBjZGsuRHVyYXRpb24uc2Vjb25kcyg2MCksXG4gICAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDYwKSxcbiAgICAgICAgcHJvdG9jb2w6IHByb3RvY29sLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIGFwcC5zeW50aCgpO1xuICAgICAgfSkudG9UaHJvdygnSGVhbHRoY2hlY2sgaW50ZXJ2YWwgMSBtaW51dGUgbXVzdCBiZSBncmVhdGVyIHRoYW4gdGhlIHRpbWVvdXQgMSBtaW51dGUnKTtcbiAgICB9KTtcblxuICB0ZXN0LmVhY2goW2VsYnYyLlByb3RvY29sLkhUVFAsIGVsYnYyLlByb3RvY29sLkhUVFBTXSkoXG4gICAgJ1Rocm93cyB2YWxpZGF0aW9uIGVycm9yLCB3aGVuIGBjb25maWd1cmVIZWFsdGhDaGVjaygpYCBoYXMgYHByb3RvY29sYCBzZXQgdG8gJXMgYW5kIGBpbnRlcnZhbGAgaXMgc21hbGxlciB0aGFuIGB0aW1lb3V0YCcsXG4gICAgKHByb3RvY29sKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdTdGFjaycpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnLCB7fSk7XG4gICAgICBjb25zdCB0ZyA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvblRhcmdldEdyb3VwKHN0YWNrLCAnVGFyZ2V0R3JvdXAnLCB7XG4gICAgICAgIHZwYyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICB0Zy5jb25maWd1cmVIZWFsdGhDaGVjayh7XG4gICAgICAgIGludGVydmFsOiBjZGsuRHVyYXRpb24uc2Vjb25kcyg2MCksXG4gICAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDEyMCksXG4gICAgICAgIHByb3RvY29sOiBwcm90b2NvbCxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBhcHAuc3ludGgoKTtcbiAgICAgIH0pLnRvVGhyb3coJ0hlYWx0aGNoZWNrIGludGVydmFsIDEgbWludXRlIG11c3QgYmUgZ3JlYXRlciB0aGFuIHRoZSB0aW1lb3V0IDIgbWludXRlcycpO1xuICAgIH0pO1xuXG4gIHRlc3QoJ1Rocm93cyB2YWxpZGF0aW9uIGVycm9yLCB3aGVuIGBjb25maWd1cmVIZWFsdGhDaGVjaygpYHByb3RvY29sIGlzIHVuZGVmaW5lZCBhbmQgYGludGVydmFsYCBpcyBzbWFsbGVyIHRoYW4gYHRpbWVvdXRgJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnU3RhY2snKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycsIHt9KTtcbiAgICBjb25zdCB0ZyA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvblRhcmdldEdyb3VwKHN0YWNrLCAnVGFyZ2V0R3JvdXAnLCB7XG4gICAgICB2cGMsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgdGcuY29uZmlndXJlSGVhbHRoQ2hlY2soe1xuICAgICAgaW50ZXJ2YWw6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDYwKSxcbiAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDEyMCksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGFwcC5zeW50aCgpO1xuICAgIH0pLnRvVGhyb3coJ0hlYWx0aGNoZWNrIGludGVydmFsIDEgbWludXRlIG11c3QgYmUgZ3JlYXRlciB0aGFuIHRoZSB0aW1lb3V0IDIgbWludXRlJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ltcG9ydGVkIHRhcmdldEdyb3VwIGhhcyB0YXJnZXRHcm91cE5hbWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdTdGFjaycpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGltcG9ydGVkVGcgPSBlbGJ2Mi5BcHBsaWNhdGlvblRhcmdldEdyb3VwLmZyb21UYXJnZXRHcm91cEF0dHJpYnV0ZXMoc3RhY2ssICdpbXBvcnRlZFRnJywge1xuICAgICAgdGFyZ2V0R3JvdXBBcm46ICdhcm46YXdzOmVsYXN0aWNsb2FkYmFsYW5jaW5nOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6dGFyZ2V0Z3JvdXAvbXlBbGJUYXJnZXRHcm91cC83M2UyZDZiYzI0ZDhhMDY3JyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoaW1wb3J0ZWRUZy50YXJnZXRHcm91cE5hbWUpLnRvRXF1YWwoJ215QWxiVGFyZ2V0R3JvdXAnKTtcbiAgfSk7XG5cbiAgdGVzdCgnaW1wb3J0ZWQgdGFyZ2V0R3JvdXAgd2l0aCBpbXBvcnRlZCBBUk4gaGFzIHRhcmdldEdyb3VwTmFtZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1N0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgaW1wb3J0ZWRUZ0FybiA9IGNkay5Gbi5pbXBvcnRWYWx1ZSgnSW1wb3J0VGFyZ2V0R3JvdXBBcm4nKTtcbiAgICBjb25zdCBpbXBvcnRlZFRnID0gZWxidjIuQXBwbGljYXRpb25UYXJnZXRHcm91cC5mcm9tVGFyZ2V0R3JvdXBBdHRyaWJ1dGVzKHN0YWNrLCAnaW1wb3J0ZWRUZycsIHtcbiAgICAgIHRhcmdldEdyb3VwQXJuOiBpbXBvcnRlZFRnQXJuLFxuICAgIH0pO1xuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrLCAnVGFyZ2V0R3JvdXBPdXRwdXQnLCB7XG4gICAgICB2YWx1ZTogaW1wb3J0ZWRUZy50YXJnZXRHcm91cE5hbWUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNPdXRwdXQoJ1RhcmdldEdyb3VwT3V0cHV0Jywge1xuICAgICAgVmFsdWU6IHtcbiAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgLy8gbXlBbGJUYXJnZXRHcm91cFxuICAgICAgICAgIDEsXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgLy8gW3RhcmdldGdyb3VwLCBteUFsYlRhcmdldEdyb3VwLCA3M2UyZDZiYzI0ZDhhMDY3XVxuICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgICAgICAgIC8vIHRhcmdldGdyb3VwL215QWxiVGFyZ2V0R3JvdXAvNzNlMmQ2YmMyNGQ4YTA2N1xuICAgICAgICAgICAgICAgICAgNSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAvLyBbYXJuLCBhd3MsIGVsYXN0aWNsb2FkYmFsYW5jaW5nLCB1cy13ZXN0LTIsIDEyMzQ1Njc4OTAxMiwgdGFyZ2V0Z3JvdXAvbXlBbGJUYXJnZXRHcm91cC83M2UyZDZiYzI0ZDhhMDY3XVxuICAgICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhcm46YXdzOmVsYXN0aWNsb2FkYmFsYW5jaW5nOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6dGFyZ2V0Z3JvdXAvbXlBbGJUYXJnZXRHcm91cC83M2UyZDZiYzI0ZDhhMDY3XG4gICAgICAgICAgICAgICAgICAgICAgICAnRm46OkltcG9ydFZhbHVlJzogJ0ltcG9ydFRhcmdldEdyb3VwQXJuJyxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnaW1wb3J0ZWQgdGFyZ2V0R3JvdXAgaGFzIG1ldHJpY3MnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdTdGFjaycpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHRhcmdldEdyb3VwID0gZWxidjIuQXBwbGljYXRpb25UYXJnZXRHcm91cC5mcm9tVGFyZ2V0R3JvdXBBdHRyaWJ1dGVzKHN0YWNrLCAnaW1wb3J0ZWRUZycsIHtcbiAgICAgIHRhcmdldEdyb3VwQXJuOiAnYXJuOmF3czplbGFzdGljbG9hZGJhbGFuY2luZzp1cy13ZXN0LTI6MTIzNDU2Nzg5MDEyOnRhcmdldGdyb3VwL215LXRhcmdldC1ncm91cC81MGRjNmM0OTVjMGM5MTg4JyxcbiAgICAgIGxvYWRCYWxhbmNlckFybnM6ICdhcm46YXdzOmVsYXN0aWNsb2FkYmFsYW5jaW5nOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6bG9hZGJhbGFuY2VyL2FwcC9teS1sb2FkLWJhbGFuY2VyLzczZTJkNmJjMjRkOGEwNjcnLFxuICAgIH0pO1xuXG4gICAgY29uc3QgbWV0cmljID0gdGFyZ2V0R3JvdXAubWV0cmljcy5jdXN0b20oJ01ldHJpY05hbWUnKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QobWV0cmljLm5hbWVzcGFjZSkudG9FcXVhbCgnQVdTL0FwcGxpY2F0aW9uRUxCJyk7XG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUobWV0cmljLmRpbWVuc2lvbnMpKS50b0VxdWFsKHtcbiAgICAgIExvYWRCYWxhbmNlcjogJ2FwcC9teS1sb2FkLWJhbGFuY2VyLzczZTJkNmJjMjRkOGEwNjcnLFxuICAgICAgVGFyZ2V0R3JvdXA6ICd0YXJnZXRncm91cC9teS10YXJnZXQtZ3JvdXAvNTBkYzZjNDk1YzBjOTE4OCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ltcG9ydGVkIHRhcmdldEdyb3VwIHdpdGhvdXQgbG9hZCBiYWxhbmNlciBjYW5ub3QgaGF2ZSBtZXRyaWNzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnU3RhY2snKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB0YXJnZXRHcm91cCA9IGVsYnYyLkFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAuZnJvbVRhcmdldEdyb3VwQXR0cmlidXRlcyhzdGFjaywgJ2ltcG9ydGVkVGcnLCB7XG4gICAgICB0YXJnZXRHcm91cEFybjogJ2Fybjphd3M6ZWxhc3RpY2xvYWRiYWxhbmNpbmc6dXMtd2VzdC0yOjEyMzQ1Njc4OTAxMjp0YXJnZXRncm91cC9teS10YXJnZXQtZ3JvdXAvNTBkYzZjNDk1YzBjOTE4OCcsXG4gICAgfSk7XG5cbiAgICBleHBlY3QoKCkgPT4gdGFyZ2V0R3JvdXAubWV0cmljcy5jdXN0b20oJ01ldHJpY05hbWUnKSkudG9UaHJvdygpO1xuICB9KTtcbn0pO1xuIl19