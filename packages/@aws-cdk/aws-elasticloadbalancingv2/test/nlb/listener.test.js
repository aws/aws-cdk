"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const acm = require("@aws-cdk/aws-certificatemanager");
const ec2 = require("@aws-cdk/aws-ec2");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cdk = require("@aws-cdk/core");
const elbv2 = require("../../lib");
const helpers_1 = require("../helpers");
describe('tests', () => {
    test('Trivial add listener', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
        // WHEN
        lb.addListener('Listener', {
            port: 443,
            defaultTargetGroups: [new elbv2.NetworkTargetGroup(stack, 'Group', { vpc, port: 80 })],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
            Protocol: 'TCP',
            Port: 443,
        });
    });
    test('Can add target groups', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
        const listener = lb.addListener('Listener', { port: 443 });
        const group = new elbv2.NetworkTargetGroup(stack, 'TargetGroup', { vpc, port: 80 });
        // WHEN
        listener.addTargetGroups('Default', group);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
            DefaultActions: [
                {
                    TargetGroupArn: { Ref: 'TargetGroup3D7CD9B8' },
                    Type: 'forward',
                },
            ],
        });
    });
    cdk_build_tools_1.testDeprecated('Can implicitly create target groups', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
        const listener = lb.addListener('Listener', { port: 443 });
        // WHEN
        listener.addTargets('Targets', {
            port: 80,
            targets: [new elbv2.InstanceTarget('i-12345')],
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
            Protocol: 'TCP',
            Targets: [
                { Id: 'i-12345' },
            ],
        });
    });
    cdk_build_tools_1.testDeprecated('implicitly created target group inherits protocol', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
        const listener = lb.addListener('Listener', { port: 9700, protocol: elbv2.Protocol.TCP_UDP });
        // WHEN
        listener.addTargets('Targets', {
            port: 9700,
            targets: [new elbv2.InstanceTarget('i-12345')],
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
            Port: 9700,
            Protocol: 'TCP_UDP',
            Targets: [
                { Id: 'i-12345' },
            ],
        });
    });
    cdk_build_tools_1.testDeprecated('implicitly created target group but overrides inherited protocol', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
        const cert = new acm.Certificate(stack, 'Certificate', {
            domainName: 'example.com',
        });
        // WHEN
        const listener = lb.addListener('Listener', {
            port: 443,
            protocol: elbv2.Protocol.TLS,
            certificates: [elbv2.ListenerCertificate.fromCertificateManager(cert)],
            sslPolicy: elbv2.SslPolicy.TLS12,
        });
        // WHEN
        listener.addTargets('Targets', {
            port: 80,
            protocol: elbv2.Protocol.TCP,
            targets: [new elbv2.InstanceTarget('i-12345')],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
            Protocol: 'TLS',
            Port: 443,
            Certificates: [
                { CertificateArn: { Ref: 'Certificate4E7ABB08' } },
            ],
            SslPolicy: 'ELBSecurityPolicy-TLS-1-2-2017-01',
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
            Protocol: 'TCP',
            Targets: [
                { Id: 'i-12345' },
            ],
        });
    });
    test('Enable health check for targets', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
        const listener = lb.addListener('Listener', { port: 443 });
        // WHEN
        const group = listener.addTargets('Group', {
            port: 80,
            targets: [new helpers_1.FakeSelfRegisteringTarget(stack, 'Target', vpc)],
        });
        group.configureHealthCheck({
            interval: cdk.Duration.seconds(30),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
            HealthCheckIntervalSeconds: 30,
        });
    });
    test('Enable taking a dependency on an NLB target group\'s load balancer', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
        const listener = lb.addListener('Listener', { port: 443 });
        const group = listener.addTargets('Group', {
            port: 80,
            targets: [new helpers_1.FakeSelfRegisteringTarget(stack, 'Target', vpc)],
        });
        // WHEN
        new ResourceWithLBDependency(stack, 'MyResource', group);
        // THEN
        assertions_1.Template.fromStack(stack).templateMatches(assertions_1.Match.objectLike({
            Resources: {
                MyResource: {
                    Type: 'Test::Resource',
                    DependsOn: [
                        // 2nd dependency is there because of the structure of the construct tree.
                        // It does not harm.
                        'LBListenerGroupGroup79B304FF',
                        'LBListener49E825B4',
                    ],
                },
            },
        }));
    });
    test('Trivial add TLS listener', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
        const cert = new acm.Certificate(stack, 'Certificate', {
            domainName: 'example.com',
        });
        // WHEN
        lb.addListener('Listener', {
            port: 443,
            protocol: elbv2.Protocol.TLS,
            certificates: [elbv2.ListenerCertificate.fromCertificateManager(cert)],
            sslPolicy: elbv2.SslPolicy.TLS12,
            defaultTargetGroups: [new elbv2.NetworkTargetGroup(stack, 'Group', { vpc, port: 80 })],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
            Protocol: 'TLS',
            Port: 443,
            Certificates: [
                { CertificateArn: { Ref: 'Certificate4E7ABB08' } },
            ],
            SslPolicy: 'ELBSecurityPolicy-TLS-1-2-2017-01',
        });
    });
    test('Trivial add TLS listener with ALPN', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
        const cert = new acm.Certificate(stack, 'Certificate', {
            domainName: 'example.com',
        });
        // WHEN
        lb.addListener('Listener', {
            port: 443,
            protocol: elbv2.Protocol.TLS,
            alpnPolicy: elbv2.AlpnPolicy.HTTP2_ONLY,
            certificates: [elbv2.ListenerCertificate.fromCertificateManager(cert)],
            sslPolicy: elbv2.SslPolicy.TLS12,
            defaultTargetGroups: [
                new elbv2.NetworkTargetGroup(stack, 'Group', { vpc, port: 80 }),
            ],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
            Protocol: 'TLS',
            Port: 443,
            AlpnPolicy: ['HTTP2Only'],
            Certificates: [{ CertificateArn: { Ref: 'Certificate4E7ABB08' } }],
            SslPolicy: 'ELBSecurityPolicy-TLS-1-2-2017-01',
        });
    });
    test('Incompatible Protocol with ALPN', () => {
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
        expect(() => lb.addListener('Listener', {
            port: 443,
            protocol: elbv2.Protocol.TCP,
            alpnPolicy: elbv2.AlpnPolicy.HTTP2_OPTIONAL,
            defaultTargetGroups: [new elbv2.NetworkTargetGroup(stack, 'Group', { vpc, port: 80 })],
        })).toThrow(/Protocol must be TLS when alpnPolicy have been specified/);
    });
    test('Invalid Protocol listener', () => {
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
        expect(() => lb.addListener('Listener', {
            port: 443,
            protocol: elbv2.Protocol.HTTP,
            defaultTargetGroups: [new elbv2.NetworkTargetGroup(stack, 'Group', { vpc, port: 80 })],
        })).toThrow(/The protocol must be one of TCP, TLS, UDP, TCP_UDP\. Found HTTP/);
    });
    test('Invalid Listener Target Healthcheck Interval', () => {
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
        const listener = lb.addListener('PublicListener', { port: 80 });
        const targetGroup = listener.addTargets('ECS', {
            port: 80,
            healthCheck: {
                interval: cdk.Duration.seconds(350),
            },
        });
        const validationErrors = targetGroup.node.validate();
        const intervalError = validationErrors.find((err) => /Health check interval '350' not supported. Must be between/.test(err));
        expect(intervalError).toBeDefined();
    });
    test('validation error if invalid health check protocol', () => {
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
        const listener = lb.addListener('PublicListener', { port: 80 });
        const targetGroup = listener.addTargets('ECS', {
            port: 80,
            healthCheck: {
                interval: cdk.Duration.seconds(60),
            },
        });
        targetGroup.configureHealthCheck({
            interval: cdk.Duration.seconds(30),
            protocol: elbv2.Protocol.UDP,
        });
        // THEN
        const validationErrors = targetGroup.node.validate();
        expect(validationErrors).toEqual(["Health check protocol 'UDP' is not supported. Must be one of [HTTP, HTTPS, TCP]"]);
    });
    test('validation error if invalid path health check protocol', () => {
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
        const listener = lb.addListener('PublicListener', { port: 80 });
        const targetGroup = listener.addTargets('ECS', {
            port: 80,
            healthCheck: {
                interval: cdk.Duration.seconds(60),
            },
        });
        targetGroup.configureHealthCheck({
            interval: cdk.Duration.seconds(30),
            protocol: elbv2.Protocol.TCP,
            path: '/',
        });
        // THEN
        const validationErrors = targetGroup.node.validate();
        expect(validationErrors).toEqual([
            "'TCP' health checks do not support the path property. Must be one of [HTTP, HTTPS]",
        ]);
    });
    test('validation error if invalid timeout health check', () => {
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
        const listener = lb.addListener('PublicListener', { port: 80 });
        const targetGroup = listener.addTargets('ECS', {
            port: 80,
            healthCheck: {
                interval: cdk.Duration.seconds(60),
            },
        });
        targetGroup.configureHealthCheck({
            interval: cdk.Duration.seconds(30),
            protocol: elbv2.Protocol.HTTP,
            timeout: cdk.Duration.seconds(10),
        });
        // THEN
        const validationErrors = targetGroup.node.validate();
        expect(validationErrors).toEqual([
            'Custom health check timeouts are not supported for Network Load Balancer health checks. Expected 6 seconds for HTTP, got 10',
        ]);
    });
    test('Protocol & certs TLS listener', () => {
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
        expect(() => lb.addListener('Listener', {
            port: 443,
            protocol: elbv2.Protocol.TLS,
            defaultTargetGroups: [new elbv2.NetworkTargetGroup(stack, 'Group', { vpc, port: 80 })],
        })).toThrow(/When the protocol is set to TLS, you must specify certificates/);
    });
    test('TLS and certs specified listener', () => {
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
        const cert = new acm.Certificate(stack, 'Certificate', {
            domainName: 'example.com',
        });
        expect(() => lb.addListener('Listener', {
            port: 443,
            protocol: elbv2.Protocol.TCP,
            certificates: [{ certificateArn: cert.certificateArn }],
            defaultTargetGroups: [new elbv2.NetworkTargetGroup(stack, 'Group', { vpc, port: 80 })],
        })).toThrow(/Protocol must be TLS when certificates have been specified/);
    });
    test('Can pass multiple certificates to network listener constructor', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
        // WHEN
        lb.addListener('Listener', {
            port: 443,
            certificates: [
                importedCertificate(stack, 'cert1'),
                importedCertificate(stack, 'cert2'),
            ],
            defaultTargetGroups: [new elbv2.NetworkTargetGroup(stack, 'Group', { vpc, port: 80 })],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
            Protocol: 'TLS',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerCertificate', {
            Certificates: [{ CertificateArn: 'cert2' }],
        });
    });
    test('Can add multiple certificates to network listener after construction', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
        // WHEN
        const listener = lb.addListener('Listener', {
            port: 443,
            certificates: [
                importedCertificate(stack, 'cert1'),
            ],
            defaultTargetGroups: [new elbv2.NetworkTargetGroup(stack, 'Group', { vpc, port: 80 })],
        });
        listener.addCertificates('extra', [
            importedCertificate(stack, 'cert2'),
        ]);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
            Protocol: 'TLS',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerCertificate', {
            Certificates: [{ CertificateArn: 'cert2' }],
        });
    });
    test('not allowed to specify defaultTargetGroups and defaultAction together', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Stack');
        const group = new elbv2.NetworkTargetGroup(stack, 'TargetGroup', { vpc, port: 80 });
        const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
        // WHEN
        expect(() => {
            lb.addListener('Listener1', {
                port: 80,
                defaultTargetGroups: [group],
                defaultAction: elbv2.NetworkListenerAction.forward([group]),
            });
        }).toThrow(/Specify at most one/);
    });
    test('Can look up an NetworkListener', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'stack', {
            env: {
                account: '123456789012',
                region: 'us-west-2',
            },
        });
        // WHEN
        const listener = elbv2.NetworkListener.fromLookup(stack, 'a', {
            loadBalancerTags: {
                some: 'tag',
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::ElasticLoadBalancingV2::Listener', 0);
        expect(listener.listenerArn).toEqual('arn:aws:elasticloadbalancing:us-west-2:123456789012:listener/network/my-load-balancer/50dc6c495c0c9188/f2f7dc8efc522ab2');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdGVuZXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpc3RlbmVyLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBc0Q7QUFDdEQsdURBQXVEO0FBQ3ZELHdDQUF3QztBQUN4Qyw4REFBMEQ7QUFDMUQscUNBQXFDO0FBRXJDLG1DQUFtQztBQUNuQyx3Q0FBdUQ7QUFFdkQsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7SUFDckIsSUFBSSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRTtRQUNoQyxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN4QyxNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUUvRCxPQUFPO1FBQ1AsRUFBRSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUU7WUFDekIsSUFBSSxFQUFFLEdBQUc7WUFDVCxtQkFBbUIsRUFBRSxDQUFDLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDdkYsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHVDQUF1QyxFQUFFO1lBQ3ZGLFFBQVEsRUFBRSxLQUFLO1lBQ2YsSUFBSSxFQUFFLEdBQUc7U0FDVixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLEVBQUU7UUFDakMsUUFBUTtRQUNS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QUUsRUFBRSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLG9CQUFvQixDQUFDLENBQUM7S0FDM0Q7Q0FDRjtBQUVELFNBQVMsbUJBQW1CLENBQUMsS0FBZ0IsRUFDM0MsY0FBYyxHQUFHLHFHQUFxRztJQUN0SCxPQUFPLEdBQUcsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRSxjQUFjLENBQUMsQ0FBQztBQUNuRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWF0Y2gsIFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBhY20gZnJvbSAnQGF3cy1jZGsvYXdzLWNlcnRpZmljYXRlbWFuYWdlcic7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgeyB0ZXN0RGVwcmVjYXRlZCB9IGZyb20gJ0Bhd3MtY2RrL2Nkay1idWlsZC10b29scyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjb25zdHJ1Y3RzIGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgZWxidjIgZnJvbSAnLi4vLi4vbGliJztcbmltcG9ydCB7IEZha2VTZWxmUmVnaXN0ZXJpbmdUYXJnZXQgfSBmcm9tICcuLi9oZWxwZXJzJztcblxuZGVzY3JpYmUoJ3Rlc3RzJywgKCkgPT4ge1xuICB0ZXN0KCdUcml2aWFsIGFkZCBsaXN0ZW5lcicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnU3RhY2snKTtcbiAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5OZXR3b3JrTG9hZEJhbGFuY2VyKHN0YWNrLCAnTEInLCB7IHZwYyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBsYi5hZGRMaXN0ZW5lcignTGlzdGVuZXInLCB7XG4gICAgICBwb3J0OiA0NDMsXG4gICAgICBkZWZhdWx0VGFyZ2V0R3JvdXBzOiBbbmV3IGVsYnYyLk5ldHdvcmtUYXJnZXRHcm91cChzdGFjaywgJ0dyb3VwJywgeyB2cGMsIHBvcnQ6IDgwIH0pXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lcicsIHtcbiAgICAgIFByb3RvY29sOiAnVENQJyxcbiAgICAgIFBvcnQ6IDQ0MyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQ2FuIGFkZCB0YXJnZXQgZ3JvdXBzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdTdGFjaycpO1xuICAgIGNvbnN0IGxiID0gbmV3IGVsYnYyLk5ldHdvcmtMb2FkQmFsYW5jZXIoc3RhY2ssICdMQicsIHsgdnBjIH0pO1xuICAgIGNvbnN0IGxpc3RlbmVyID0gbGIuYWRkTGlzdGVuZXIoJ0xpc3RlbmVyJywgeyBwb3J0OiA0NDMgfSk7XG4gICAgY29uc3QgZ3JvdXAgPSBuZXcgZWxidjIuTmV0d29ya1RhcmdldEdyb3VwKHN0YWNrLCAnVGFyZ2V0R3JvdXAnLCB7IHZwYywgcG9ydDogODAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbGlzdGVuZXIuYWRkVGFyZ2V0R3JvdXBzKCdEZWZhdWx0JywgZ3JvdXApO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyJywge1xuICAgICAgRGVmYXVsdEFjdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFRhcmdldEdyb3VwQXJuOiB7IFJlZjogJ1RhcmdldEdyb3VwM0Q3Q0Q5QjgnIH0sXG4gICAgICAgICAgVHlwZTogJ2ZvcndhcmQnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ0NhbiBpbXBsaWNpdGx5IGNyZWF0ZSB0YXJnZXQgZ3JvdXBzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdTdGFjaycpO1xuICAgIGNvbnN0IGxiID0gbmV3IGVsYnYyLk5ldHdvcmtMb2FkQmFsYW5jZXIoc3RhY2ssICdMQicsIHsgdnBjIH0pO1xuICAgIGNvbnN0IGxpc3RlbmVyID0gbGIuYWRkTGlzdGVuZXIoJ0xpc3RlbmVyJywgeyBwb3J0OiA0NDMgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbGlzdGVuZXIuYWRkVGFyZ2V0cygnVGFyZ2V0cycsIHtcbiAgICAgIHBvcnQ6IDgwLFxuICAgICAgdGFyZ2V0czogW25ldyBlbGJ2Mi5JbnN0YW5jZVRhcmdldCgnaS0xMjM0NScpXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lcicsIHtcbiAgICAgIERlZmF1bHRBY3Rpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBUYXJnZXRHcm91cEFybjogeyBSZWY6ICdMQkxpc3RlbmVyVGFyZ2V0c0dyb3VwNzZFRjgxRTgnIH0sXG4gICAgICAgICAgVHlwZTogJ2ZvcndhcmQnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpUYXJnZXRHcm91cCcsIHtcbiAgICAgIFZwY0lkOiB7IFJlZjogJ1N0YWNrOEE0MjMyNTQnIH0sXG4gICAgICBQb3J0OiA4MCxcbiAgICAgIFByb3RvY29sOiAnVENQJyxcbiAgICAgIFRhcmdldHM6IFtcbiAgICAgICAgeyBJZDogJ2ktMTIzNDUnIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnaW1wbGljaXRseSBjcmVhdGVkIHRhcmdldCBncm91cCBpbmhlcml0cyBwcm90b2NvbCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnU3RhY2snKTtcbiAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5OZXR3b3JrTG9hZEJhbGFuY2VyKHN0YWNrLCAnTEInLCB7IHZwYyB9KTtcbiAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdMaXN0ZW5lcicsIHsgcG9ydDogOTcwMCwgcHJvdG9jb2w6IGVsYnYyLlByb3RvY29sLlRDUF9VRFAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbGlzdGVuZXIuYWRkVGFyZ2V0cygnVGFyZ2V0cycsIHtcbiAgICAgIHBvcnQ6IDk3MDAsXG4gICAgICB0YXJnZXRzOiBbbmV3IGVsYnYyLkluc3RhbmNlVGFyZ2V0KCdpLTEyMzQ1JyldLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyJywge1xuICAgICAgRGVmYXVsdEFjdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFRhcmdldEdyb3VwQXJuOiB7IFJlZjogJ0xCTGlzdGVuZXJUYXJnZXRzR3JvdXA3NkVGODFFOCcgfSxcbiAgICAgICAgICBUeXBlOiAnZm9yd2FyZCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OlRhcmdldEdyb3VwJywge1xuICAgICAgVnBjSWQ6IHsgUmVmOiAnU3RhY2s4QTQyMzI1NCcgfSxcbiAgICAgIFBvcnQ6IDk3MDAsXG4gICAgICBQcm90b2NvbDogJ1RDUF9VRFAnLFxuICAgICAgVGFyZ2V0czogW1xuICAgICAgICB7IElkOiAnaS0xMjM0NScgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCdpbXBsaWNpdGx5IGNyZWF0ZWQgdGFyZ2V0IGdyb3VwIGJ1dCBvdmVycmlkZXMgaW5oZXJpdGVkIHByb3RvY29sJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdTdGFjaycpO1xuICAgIGNvbnN0IGxiID0gbmV3IGVsYnYyLk5ldHdvcmtMb2FkQmFsYW5jZXIoc3RhY2ssICdMQicsIHsgdnBjIH0pO1xuICAgIGNvbnN0IGNlcnQgPSBuZXcgYWNtLkNlcnRpZmljYXRlKHN0YWNrLCAnQ2VydGlmaWNhdGUnLCB7XG4gICAgICBkb21haW5OYW1lOiAnZXhhbXBsZS5jb20nLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGxpc3RlbmVyID0gbGIuYWRkTGlzdGVuZXIoJ0xpc3RlbmVyJywge1xuICAgICAgcG9ydDogNDQzLFxuICAgICAgcHJvdG9jb2w6IGVsYnYyLlByb3RvY29sLlRMUyxcbiAgICAgIGNlcnRpZmljYXRlczogW2VsYnYyLkxpc3RlbmVyQ2VydGlmaWNhdGUuZnJvbUNlcnRpZmljYXRlTWFuYWdlcihjZXJ0KV0sXG4gICAgICBzc2xQb2xpY3k6IGVsYnYyLlNzbFBvbGljeS5UTFMxMixcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBsaXN0ZW5lci5hZGRUYXJnZXRzKCdUYXJnZXRzJywge1xuICAgICAgcG9ydDogODAsXG4gICAgICBwcm90b2NvbDogZWxidjIuUHJvdG9jb2wuVENQLFxuICAgICAgdGFyZ2V0czogW25ldyBlbGJ2Mi5JbnN0YW5jZVRhcmdldCgnaS0xMjM0NScpXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lcicsIHtcbiAgICAgIFByb3RvY29sOiAnVExTJyxcbiAgICAgIFBvcnQ6IDQ0MyxcbiAgICAgIENlcnRpZmljYXRlczogW1xuICAgICAgICB7IENlcnRpZmljYXRlQXJuOiB7IFJlZjogJ0NlcnRpZmljYXRlNEU3QUJCMDgnIH0gfSxcbiAgICAgIF0sXG4gICAgICBTc2xQb2xpY3k6ICdFTEJTZWN1cml0eVBvbGljeS1UTFMtMS0yLTIwMTctMDEnLFxuICAgICAgRGVmYXVsdEFjdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFRhcmdldEdyb3VwQXJuOiB7IFJlZjogJ0xCTGlzdGVuZXJUYXJnZXRzR3JvdXA3NkVGODFFOCcgfSxcbiAgICAgICAgICBUeXBlOiAnZm9yd2FyZCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OlRhcmdldEdyb3VwJywge1xuICAgICAgVnBjSWQ6IHsgUmVmOiAnU3RhY2s4QTQyMzI1NCcgfSxcbiAgICAgIFBvcnQ6IDgwLFxuICAgICAgUHJvdG9jb2w6ICdUQ1AnLFxuICAgICAgVGFyZ2V0czogW1xuICAgICAgICB7IElkOiAnaS0xMjM0NScgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0VuYWJsZSBoZWFsdGggY2hlY2sgZm9yIHRhcmdldHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG4gICAgY29uc3QgbGIgPSBuZXcgZWxidjIuTmV0d29ya0xvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywgeyB2cGMgfSk7XG4gICAgY29uc3QgbGlzdGVuZXIgPSBsYi5hZGRMaXN0ZW5lcignTGlzdGVuZXInLCB7IHBvcnQ6IDQ0MyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBncm91cCA9IGxpc3RlbmVyLmFkZFRhcmdldHMoJ0dyb3VwJywge1xuICAgICAgcG9ydDogODAsXG4gICAgICB0YXJnZXRzOiBbbmV3IEZha2VTZWxmUmVnaXN0ZXJpbmdUYXJnZXQoc3RhY2ssICdUYXJnZXQnLCB2cGMpXSxcbiAgICB9KTtcbiAgICBncm91cC5jb25maWd1cmVIZWFsdGhDaGVjayh7XG4gICAgICBpbnRlcnZhbDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMzApLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OlRhcmdldEdyb3VwJywge1xuICAgICAgSGVhbHRoQ2hlY2tJbnRlcnZhbFNlY29uZHM6IDMwLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdFbmFibGUgdGFraW5nIGEgZGVwZW5kZW5jeSBvbiBhbiBOTEIgdGFyZ2V0IGdyb3VwXFwncyBsb2FkIGJhbGFuY2VyJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdTdGFjaycpO1xuICAgIGNvbnN0IGxiID0gbmV3IGVsYnYyLk5ldHdvcmtMb2FkQmFsYW5jZXIoc3RhY2ssICdMQicsIHsgdnBjIH0pO1xuICAgIGNvbnN0IGxpc3RlbmVyID0gbGIuYWRkTGlzdGVuZXIoJ0xpc3RlbmVyJywgeyBwb3J0OiA0NDMgfSk7XG4gICAgY29uc3QgZ3JvdXAgPSBsaXN0ZW5lci5hZGRUYXJnZXRzKCdHcm91cCcsIHtcbiAgICAgIHBvcnQ6IDgwLFxuICAgICAgdGFyZ2V0czogW25ldyBGYWtlU2VsZlJlZ2lzdGVyaW5nVGFyZ2V0KHN0YWNrLCAnVGFyZ2V0JywgdnBjKV0sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFJlc291cmNlV2l0aExCRGVwZW5kZW5jeShzdGFjaywgJ015UmVzb3VyY2UnLCBncm91cCk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgTXlSZXNvdXJjZToge1xuICAgICAgICAgIFR5cGU6ICdUZXN0OjpSZXNvdXJjZScsXG4gICAgICAgICAgRGVwZW5kc09uOiBbXG4gICAgICAgICAgICAvLyAybmQgZGVwZW5kZW5jeSBpcyB0aGVyZSBiZWNhdXNlIG9mIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIGNvbnN0cnVjdCB0cmVlLlxuICAgICAgICAgICAgLy8gSXQgZG9lcyBub3QgaGFybS5cbiAgICAgICAgICAgICdMQkxpc3RlbmVyR3JvdXBHcm91cDc5QjMwNEZGJyxcbiAgICAgICAgICAgICdMQkxpc3RlbmVyNDlFODI1QjQnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pKTtcbiAgfSk7XG5cbiAgdGVzdCgnVHJpdmlhbCBhZGQgVExTIGxpc3RlbmVyJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdTdGFjaycpO1xuICAgIGNvbnN0IGxiID0gbmV3IGVsYnYyLk5ldHdvcmtMb2FkQmFsYW5jZXIoc3RhY2ssICdMQicsIHsgdnBjIH0pO1xuICAgIGNvbnN0IGNlcnQgPSBuZXcgYWNtLkNlcnRpZmljYXRlKHN0YWNrLCAnQ2VydGlmaWNhdGUnLCB7XG4gICAgICBkb21haW5OYW1lOiAnZXhhbXBsZS5jb20nLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGxiLmFkZExpc3RlbmVyKCdMaXN0ZW5lcicsIHtcbiAgICAgIHBvcnQ6IDQ0MyxcbiAgICAgIHByb3RvY29sOiBlbGJ2Mi5Qcm90b2NvbC5UTFMsXG4gICAgICBjZXJ0aWZpY2F0ZXM6IFtlbGJ2Mi5MaXN0ZW5lckNlcnRpZmljYXRlLmZyb21DZXJ0aWZpY2F0ZU1hbmFnZXIoY2VydCldLFxuICAgICAgc3NsUG9saWN5OiBlbGJ2Mi5Tc2xQb2xpY3kuVExTMTIsXG4gICAgICBkZWZhdWx0VGFyZ2V0R3JvdXBzOiBbbmV3IGVsYnYyLk5ldHdvcmtUYXJnZXRHcm91cChzdGFjaywgJ0dyb3VwJywgeyB2cGMsIHBvcnQ6IDgwIH0pXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lcicsIHtcbiAgICAgIFByb3RvY29sOiAnVExTJyxcbiAgICAgIFBvcnQ6IDQ0MyxcbiAgICAgIENlcnRpZmljYXRlczogW1xuICAgICAgICB7IENlcnRpZmljYXRlQXJuOiB7IFJlZjogJ0NlcnRpZmljYXRlNEU3QUJCMDgnIH0gfSxcbiAgICAgIF0sXG4gICAgICBTc2xQb2xpY3k6ICdFTEJTZWN1cml0eVBvbGljeS1UTFMtMS0yLTIwMTctMDEnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdUcml2aWFsIGFkZCBUTFMgbGlzdGVuZXIgd2l0aCBBTFBOJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdTdGFjaycpO1xuICAgIGNvbnN0IGxiID0gbmV3IGVsYnYyLk5ldHdvcmtMb2FkQmFsYW5jZXIoc3RhY2ssICdMQicsIHsgdnBjIH0pO1xuICAgIGNvbnN0IGNlcnQgPSBuZXcgYWNtLkNlcnRpZmljYXRlKHN0YWNrLCAnQ2VydGlmaWNhdGUnLCB7XG4gICAgICBkb21haW5OYW1lOiAnZXhhbXBsZS5jb20nLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGxiLmFkZExpc3RlbmVyKCdMaXN0ZW5lcicsIHtcbiAgICAgIHBvcnQ6IDQ0MyxcbiAgICAgIHByb3RvY29sOiBlbGJ2Mi5Qcm90b2NvbC5UTFMsXG4gICAgICBhbHBuUG9saWN5OiBlbGJ2Mi5BbHBuUG9saWN5LkhUVFAyX09OTFksXG4gICAgICBjZXJ0aWZpY2F0ZXM6IFtlbGJ2Mi5MaXN0ZW5lckNlcnRpZmljYXRlLmZyb21DZXJ0aWZpY2F0ZU1hbmFnZXIoY2VydCldLFxuICAgICAgc3NsUG9saWN5OiBlbGJ2Mi5Tc2xQb2xpY3kuVExTMTIsXG4gICAgICBkZWZhdWx0VGFyZ2V0R3JvdXBzOiBbXG4gICAgICAgIG5ldyBlbGJ2Mi5OZXR3b3JrVGFyZ2V0R3JvdXAoc3RhY2ssICdHcm91cCcsIHsgdnBjLCBwb3J0OiA4MCB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TGlzdGVuZXInLCB7XG4gICAgICBQcm90b2NvbDogJ1RMUycsXG4gICAgICBQb3J0OiA0NDMsXG4gICAgICBBbHBuUG9saWN5OiBbJ0hUVFAyT25seSddLFxuICAgICAgQ2VydGlmaWNhdGVzOiBbeyBDZXJ0aWZpY2F0ZUFybjogeyBSZWY6ICdDZXJ0aWZpY2F0ZTRFN0FCQjA4JyB9IH1dLFxuICAgICAgU3NsUG9saWN5OiAnRUxCU2VjdXJpdHlQb2xpY3ktVExTLTEtMi0yMDE3LTAxJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnSW5jb21wYXRpYmxlIFByb3RvY29sIHdpdGggQUxQTicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG4gICAgY29uc3QgbGIgPSBuZXcgZWxidjIuTmV0d29ya0xvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywgeyB2cGMgfSk7XG5cbiAgICBleHBlY3QoKCkgPT4gbGIuYWRkTGlzdGVuZXIoJ0xpc3RlbmVyJywge1xuICAgICAgcG9ydDogNDQzLFxuICAgICAgcHJvdG9jb2w6IGVsYnYyLlByb3RvY29sLlRDUCxcbiAgICAgIGFscG5Qb2xpY3k6IGVsYnYyLkFscG5Qb2xpY3kuSFRUUDJfT1BUSU9OQUwsXG4gICAgICBkZWZhdWx0VGFyZ2V0R3JvdXBzOiBbbmV3IGVsYnYyLk5ldHdvcmtUYXJnZXRHcm91cChzdGFjaywgJ0dyb3VwJywgeyB2cGMsIHBvcnQ6IDgwIH0pXSxcbiAgICB9KSkudG9UaHJvdygvUHJvdG9jb2wgbXVzdCBiZSBUTFMgd2hlbiBhbHBuUG9saWN5IGhhdmUgYmVlbiBzcGVjaWZpZWQvKTtcbiAgfSk7XG5cbiAgdGVzdCgnSW52YWxpZCBQcm90b2NvbCBsaXN0ZW5lcicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG4gICAgY29uc3QgbGIgPSBuZXcgZWxidjIuTmV0d29ya0xvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywgeyB2cGMgfSk7XG5cbiAgICBleHBlY3QoKCkgPT4gbGIuYWRkTGlzdGVuZXIoJ0xpc3RlbmVyJywge1xuICAgICAgcG9ydDogNDQzLFxuICAgICAgcHJvdG9jb2w6IGVsYnYyLlByb3RvY29sLkhUVFAsXG4gICAgICBkZWZhdWx0VGFyZ2V0R3JvdXBzOiBbbmV3IGVsYnYyLk5ldHdvcmtUYXJnZXRHcm91cChzdGFjaywgJ0dyb3VwJywgeyB2cGMsIHBvcnQ6IDgwIH0pXSxcbiAgICB9KSkudG9UaHJvdygvVGhlIHByb3RvY29sIG11c3QgYmUgb25lIG9mIFRDUCwgVExTLCBVRFAsIFRDUF9VRFBcXC4gRm91bmQgSFRUUC8pO1xuICB9KTtcblxuICB0ZXN0KCdJbnZhbGlkIExpc3RlbmVyIFRhcmdldCBIZWFsdGhjaGVjayBJbnRlcnZhbCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG4gICAgY29uc3QgbGIgPSBuZXcgZWxidjIuTmV0d29ya0xvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywgeyB2cGMgfSk7XG4gICAgY29uc3QgbGlzdGVuZXIgPSBsYi5hZGRMaXN0ZW5lcignUHVibGljTGlzdGVuZXInLCB7IHBvcnQ6IDgwIH0pO1xuICAgIGNvbnN0IHRhcmdldEdyb3VwID0gbGlzdGVuZXIuYWRkVGFyZ2V0cygnRUNTJywge1xuICAgICAgcG9ydDogODAsXG4gICAgICBoZWFsdGhDaGVjazoge1xuICAgICAgICBpbnRlcnZhbDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMzUwKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzOiBzdHJpbmdbXSA9IHRhcmdldEdyb3VwLm5vZGUudmFsaWRhdGUoKTtcbiAgICBjb25zdCBpbnRlcnZhbEVycm9yID0gdmFsaWRhdGlvbkVycm9ycy5maW5kKChlcnIpID0+IC9IZWFsdGggY2hlY2sgaW50ZXJ2YWwgJzM1MCcgbm90IHN1cHBvcnRlZC4gTXVzdCBiZSBiZXR3ZWVuLy50ZXN0KGVycikpO1xuICAgIGV4cGVjdChpbnRlcnZhbEVycm9yKS50b0JlRGVmaW5lZCgpO1xuICB9KTtcblxuICB0ZXN0KCd2YWxpZGF0aW9uIGVycm9yIGlmIGludmFsaWQgaGVhbHRoIGNoZWNrIHByb3RvY29sJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnU3RhY2snKTtcbiAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5OZXR3b3JrTG9hZEJhbGFuY2VyKHN0YWNrLCAnTEInLCB7IHZwYyB9KTtcbiAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdQdWJsaWNMaXN0ZW5lcicsIHsgcG9ydDogODAgfSk7XG4gICAgY29uc3QgdGFyZ2V0R3JvdXAgPSBsaXN0ZW5lci5hZGRUYXJnZXRzKCdFQ1MnLCB7XG4gICAgICBwb3J0OiA4MCxcbiAgICAgIGhlYWx0aENoZWNrOiB7XG4gICAgICAgIGludGVydmFsOiBjZGsuRHVyYXRpb24uc2Vjb25kcyg2MCksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgdGFyZ2V0R3JvdXAuY29uZmlndXJlSGVhbHRoQ2hlY2soe1xuICAgICAgaW50ZXJ2YWw6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDMwKSxcbiAgICAgIHByb3RvY29sOiBlbGJ2Mi5Qcm90b2NvbC5VRFAsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgdmFsaWRhdGlvbkVycm9yczogc3RyaW5nW10gPSB0YXJnZXRHcm91cC5ub2RlLnZhbGlkYXRlKCk7XG4gICAgZXhwZWN0KHZhbGlkYXRpb25FcnJvcnMpLnRvRXF1YWwoW1wiSGVhbHRoIGNoZWNrIHByb3RvY29sICdVRFAnIGlzIG5vdCBzdXBwb3J0ZWQuIE11c3QgYmUgb25lIG9mIFtIVFRQLCBIVFRQUywgVENQXVwiXSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3ZhbGlkYXRpb24gZXJyb3IgaWYgaW52YWxpZCBwYXRoIGhlYWx0aCBjaGVjayBwcm90b2NvbCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG4gICAgY29uc3QgbGIgPSBuZXcgZWxidjIuTmV0d29ya0xvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywgeyB2cGMgfSk7XG4gICAgY29uc3QgbGlzdGVuZXIgPSBsYi5hZGRMaXN0ZW5lcignUHVibGljTGlzdGVuZXInLCB7IHBvcnQ6IDgwIH0pO1xuICAgIGNvbnN0IHRhcmdldEdyb3VwID0gbGlzdGVuZXIuYWRkVGFyZ2V0cygnRUNTJywge1xuICAgICAgcG9ydDogODAsXG4gICAgICBoZWFsdGhDaGVjazoge1xuICAgICAgICBpbnRlcnZhbDogY2RrLkR1cmF0aW9uLnNlY29uZHMoNjApLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRhcmdldEdyb3VwLmNvbmZpZ3VyZUhlYWx0aENoZWNrKHtcbiAgICAgIGludGVydmFsOiBjZGsuRHVyYXRpb24uc2Vjb25kcygzMCksXG4gICAgICBwcm90b2NvbDogZWxidjIuUHJvdG9jb2wuVENQLFxuICAgICAgcGF0aDogJy8nLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnM6IHN0cmluZ1tdID0gdGFyZ2V0R3JvdXAubm9kZS52YWxpZGF0ZSgpO1xuICAgIGV4cGVjdCh2YWxpZGF0aW9uRXJyb3JzKS50b0VxdWFsKFtcbiAgICAgIFwiJ1RDUCcgaGVhbHRoIGNoZWNrcyBkbyBub3Qgc3VwcG9ydCB0aGUgcGF0aCBwcm9wZXJ0eS4gTXVzdCBiZSBvbmUgb2YgW0hUVFAsIEhUVFBTXVwiLFxuICAgIF0pO1xuICB9KTtcblxuICB0ZXN0KCd2YWxpZGF0aW9uIGVycm9yIGlmIGludmFsaWQgdGltZW91dCBoZWFsdGggY2hlY2snLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdTdGFjaycpO1xuICAgIGNvbnN0IGxiID0gbmV3IGVsYnYyLk5ldHdvcmtMb2FkQmFsYW5jZXIoc3RhY2ssICdMQicsIHsgdnBjIH0pO1xuICAgIGNvbnN0IGxpc3RlbmVyID0gbGIuYWRkTGlzdGVuZXIoJ1B1YmxpY0xpc3RlbmVyJywgeyBwb3J0OiA4MCB9KTtcbiAgICBjb25zdCB0YXJnZXRHcm91cCA9IGxpc3RlbmVyLmFkZFRhcmdldHMoJ0VDUycsIHtcbiAgICAgIHBvcnQ6IDgwLFxuICAgICAgaGVhbHRoQ2hlY2s6IHtcbiAgICAgICAgaW50ZXJ2YWw6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDYwKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0YXJnZXRHcm91cC5jb25maWd1cmVIZWFsdGhDaGVjayh7XG4gICAgICBpbnRlcnZhbDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMzApLFxuICAgICAgcHJvdG9jb2w6IGVsYnYyLlByb3RvY29sLkhUVFAsXG4gICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcygxMCksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgdmFsaWRhdGlvbkVycm9yczogc3RyaW5nW10gPSB0YXJnZXRHcm91cC5ub2RlLnZhbGlkYXRlKCk7XG4gICAgZXhwZWN0KHZhbGlkYXRpb25FcnJvcnMpLnRvRXF1YWwoW1xuICAgICAgJ0N1c3RvbSBoZWFsdGggY2hlY2sgdGltZW91dHMgYXJlIG5vdCBzdXBwb3J0ZWQgZm9yIE5ldHdvcmsgTG9hZCBCYWxhbmNlciBoZWFsdGggY2hlY2tzLiBFeHBlY3RlZCA2IHNlY29uZHMgZm9yIEhUVFAsIGdvdCAxMCcsXG4gICAgXSk7XG4gIH0pO1xuXG4gIHRlc3QoJ1Byb3RvY29sICYgY2VydHMgVExTIGxpc3RlbmVyJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnU3RhY2snKTtcbiAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5OZXR3b3JrTG9hZEJhbGFuY2VyKHN0YWNrLCAnTEInLCB7IHZwYyB9KTtcblxuICAgIGV4cGVjdCgoKSA9PiBsYi5hZGRMaXN0ZW5lcignTGlzdGVuZXInLCB7XG4gICAgICBwb3J0OiA0NDMsXG4gICAgICBwcm90b2NvbDogZWxidjIuUHJvdG9jb2wuVExTLFxuICAgICAgZGVmYXVsdFRhcmdldEdyb3VwczogW25ldyBlbGJ2Mi5OZXR3b3JrVGFyZ2V0R3JvdXAoc3RhY2ssICdHcm91cCcsIHsgdnBjLCBwb3J0OiA4MCB9KV0sXG4gICAgfSkpLnRvVGhyb3coL1doZW4gdGhlIHByb3RvY29sIGlzIHNldCB0byBUTFMsIHlvdSBtdXN0IHNwZWNpZnkgY2VydGlmaWNhdGVzLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ1RMUyBhbmQgY2VydHMgc3BlY2lmaWVkIGxpc3RlbmVyJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnU3RhY2snKTtcbiAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5OZXR3b3JrTG9hZEJhbGFuY2VyKHN0YWNrLCAnTEInLCB7IHZwYyB9KTtcbiAgICBjb25zdCBjZXJ0ID0gbmV3IGFjbS5DZXJ0aWZpY2F0ZShzdGFjaywgJ0NlcnRpZmljYXRlJywge1xuICAgICAgZG9tYWluTmFtZTogJ2V4YW1wbGUuY29tJyxcbiAgICB9KTtcblxuICAgIGV4cGVjdCgoKSA9PiBsYi5hZGRMaXN0ZW5lcignTGlzdGVuZXInLCB7XG4gICAgICBwb3J0OiA0NDMsXG4gICAgICBwcm90b2NvbDogZWxidjIuUHJvdG9jb2wuVENQLFxuICAgICAgY2VydGlmaWNhdGVzOiBbeyBjZXJ0aWZpY2F0ZUFybjogY2VydC5jZXJ0aWZpY2F0ZUFybiB9XSxcbiAgICAgIGRlZmF1bHRUYXJnZXRHcm91cHM6IFtuZXcgZWxidjIuTmV0d29ya1RhcmdldEdyb3VwKHN0YWNrLCAnR3JvdXAnLCB7IHZwYywgcG9ydDogODAgfSldLFxuICAgIH0pKS50b1Rocm93KC9Qcm90b2NvbCBtdXN0IGJlIFRMUyB3aGVuIGNlcnRpZmljYXRlcyBoYXZlIGJlZW4gc3BlY2lmaWVkLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ0NhbiBwYXNzIG11bHRpcGxlIGNlcnRpZmljYXRlcyB0byBuZXR3b3JrIGxpc3RlbmVyIGNvbnN0cnVjdG9yJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdTdGFjaycpO1xuICAgIGNvbnN0IGxiID0gbmV3IGVsYnYyLk5ldHdvcmtMb2FkQmFsYW5jZXIoc3RhY2ssICdMQicsIHsgdnBjIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGxiLmFkZExpc3RlbmVyKCdMaXN0ZW5lcicsIHtcbiAgICAgIHBvcnQ6IDQ0MyxcbiAgICAgIGNlcnRpZmljYXRlczogW1xuICAgICAgICBpbXBvcnRlZENlcnRpZmljYXRlKHN0YWNrLCAnY2VydDEnKSxcbiAgICAgICAgaW1wb3J0ZWRDZXJ0aWZpY2F0ZShzdGFjaywgJ2NlcnQyJyksXG4gICAgICBdLFxuICAgICAgZGVmYXVsdFRhcmdldEdyb3VwczogW25ldyBlbGJ2Mi5OZXR3b3JrVGFyZ2V0R3JvdXAoc3RhY2ssICdHcm91cCcsIHsgdnBjLCBwb3J0OiA4MCB9KV0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TGlzdGVuZXInLCB7XG4gICAgICBQcm90b2NvbDogJ1RMUycsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lckNlcnRpZmljYXRlJywge1xuICAgICAgQ2VydGlmaWNhdGVzOiBbeyBDZXJ0aWZpY2F0ZUFybjogJ2NlcnQyJyB9XSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQ2FuIGFkZCBtdWx0aXBsZSBjZXJ0aWZpY2F0ZXMgdG8gbmV0d29yayBsaXN0ZW5lciBhZnRlciBjb25zdHJ1Y3Rpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG4gICAgY29uc3QgbGIgPSBuZXcgZWxidjIuTmV0d29ya0xvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywgeyB2cGMgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbGlzdGVuZXIgPSBsYi5hZGRMaXN0ZW5lcignTGlzdGVuZXInLCB7XG4gICAgICBwb3J0OiA0NDMsXG4gICAgICBjZXJ0aWZpY2F0ZXM6IFtcbiAgICAgICAgaW1wb3J0ZWRDZXJ0aWZpY2F0ZShzdGFjaywgJ2NlcnQxJyksXG4gICAgICBdLFxuICAgICAgZGVmYXVsdFRhcmdldEdyb3VwczogW25ldyBlbGJ2Mi5OZXR3b3JrVGFyZ2V0R3JvdXAoc3RhY2ssICdHcm91cCcsIHsgdnBjLCBwb3J0OiA4MCB9KV0sXG4gICAgfSk7XG5cbiAgICBsaXN0ZW5lci5hZGRDZXJ0aWZpY2F0ZXMoJ2V4dHJhJywgW1xuICAgICAgaW1wb3J0ZWRDZXJ0aWZpY2F0ZShzdGFjaywgJ2NlcnQyJyksXG4gICAgXSk7XG5cblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lcicsIHtcbiAgICAgIFByb3RvY29sOiAnVExTJyxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyQ2VydGlmaWNhdGUnLCB7XG4gICAgICBDZXJ0aWZpY2F0ZXM6IFt7IENlcnRpZmljYXRlQXJuOiAnY2VydDInIH1dLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdub3QgYWxsb3dlZCB0byBzcGVjaWZ5IGRlZmF1bHRUYXJnZXRHcm91cHMgYW5kIGRlZmF1bHRBY3Rpb24gdG9nZXRoZXInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG4gICAgY29uc3QgZ3JvdXAgPSBuZXcgZWxidjIuTmV0d29ya1RhcmdldEdyb3VwKHN0YWNrLCAnVGFyZ2V0R3JvdXAnLCB7IHZwYywgcG9ydDogODAgfSk7XG4gICAgY29uc3QgbGIgPSBuZXcgZWxidjIuTmV0d29ya0xvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywgeyB2cGMgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGxiLmFkZExpc3RlbmVyKCdMaXN0ZW5lcjEnLCB7XG4gICAgICAgIHBvcnQ6IDgwLFxuICAgICAgICBkZWZhdWx0VGFyZ2V0R3JvdXBzOiBbZ3JvdXBdLFxuICAgICAgICBkZWZhdWx0QWN0aW9uOiBlbGJ2Mi5OZXR3b3JrTGlzdGVuZXJBY3Rpb24uZm9yd2FyZChbZ3JvdXBdKSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL1NwZWNpZnkgYXQgbW9zdCBvbmUvKTtcbiAgfSk7XG5cbiAgdGVzdCgnQ2FuIGxvb2sgdXAgYW4gTmV0d29ya0xpc3RlbmVyJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnc3RhY2snLCB7XG4gICAgICBlbnY6IHtcbiAgICAgICAgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsXG4gICAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMicsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGxpc3RlbmVyID0gZWxidjIuTmV0d29ya0xpc3RlbmVyLmZyb21Mb29rdXAoc3RhY2ssICdhJywge1xuICAgICAgbG9hZEJhbGFuY2VyVGFnczoge1xuICAgICAgICBzb21lOiAndGFnJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TGlzdGVuZXInLCAwKTtcbiAgICBleHBlY3QobGlzdGVuZXIubGlzdGVuZXJBcm4pLnRvRXF1YWwoJ2Fybjphd3M6ZWxhc3RpY2xvYWRiYWxhbmNpbmc6dXMtd2VzdC0yOjEyMzQ1Njc4OTAxMjpsaXN0ZW5lci9uZXR3b3JrL215LWxvYWQtYmFsYW5jZXIvNTBkYzZjNDk1YzBjOTE4OC9mMmY3ZGM4ZWZjNTIyYWIyJyk7XG4gIH0pO1xufSk7XG5cbmNsYXNzIFJlc291cmNlV2l0aExCRGVwZW5kZW5jeSBleHRlbmRzIGNkay5DZm5SZXNvdXJjZSB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgdGFyZ2V0R3JvdXA6IGVsYnYyLklUYXJnZXRHcm91cCkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiAnVGVzdDo6UmVzb3VyY2UnIH0pO1xuICAgIHRoaXMubm9kZS5hZGREZXBlbmRlbmN5KHRhcmdldEdyb3VwLmxvYWRCYWxhbmNlckF0dGFjaGVkKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpbXBvcnRlZENlcnRpZmljYXRlKHN0YWNrOiBjZGsuU3RhY2ssXG4gIGNlcnRpZmljYXRlQXJuID0gJ2Fybjphd3M6Y2VydGlmaWNhdGVtYW5hZ2VyOjEyMzQ1Njc4OTAxMjp0ZXN0cmVnaW9uOmNlcnRpZmljYXRlL2ZkMGI4MzkyLTNjMGUtNDcwNC04MWI2LThlZGY4NjEyYzg1MicpIHtcbiAgcmV0dXJuIGFjbS5DZXJ0aWZpY2F0ZS5mcm9tQ2VydGlmaWNhdGVBcm4oc3RhY2ssIGNlcnRpZmljYXRlQXJuLCBjZXJ0aWZpY2F0ZUFybik7XG59XG4iXX0=