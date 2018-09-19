import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import elbv2 = require('../../lib');
import { FakeSelfRegisteringTarget } from '../helpers';

export = {
    'security groups are automatically opened bidi for default rule'(test: Test) {
        // GIVEN
        const fixture = new TestFixture();
        const target = new FakeSelfRegisteringTarget(fixture.stack, 'Target', fixture.vpc);

        // WHEN
        fixture.listener.addTargets('TargetGroup', {
            port: 8008,
            targets: [target]
        });

        // THEN
        expectStandardBidi(fixture.stack);

        test.done();
    },

    'security groups are automatically opened bidi for additional rule'(test: Test) {
        // GIVEN
        const fixture = new TestFixture();
        const target1 = new FakeSelfRegisteringTarget(fixture.stack, 'DefaultTarget', fixture.vpc);
        const target2 = new FakeSelfRegisteringTarget(fixture.stack, 'Target', fixture.vpc);

        // WHEN
        fixture.listener.addTargets('TargetGroup1', {
            port: 80,
            targets: [target1]
        });

        fixture.listener.addTargetGroups('Rule', {
            priority: 10,
            hostHeader: 'example.com',
            targetGroups: [new elbv2.ApplicationTargetGroup(fixture.stack, 'TargetGroup2', {
                vpc: fixture.vpc,
                port: 8008,
                targets: [target2]
            })]
        });

        // THEN
        expectStandardBidi(fixture.stack);

        test.done();
    },

    'adding the same targets twice also works'(test: Test) {
        // GIVEN
        const fixture = new TestFixture();
        const target = new FakeSelfRegisteringTarget(fixture.stack, 'Target', fixture.vpc);

        // WHEN
        const group = new elbv2.ApplicationTargetGroup(fixture.stack, 'TargetGroup', {
            vpc: fixture.vpc,
            port: 8008,
            targets: [target]
        });

        fixture.listener.addTargetGroups('Default', {
            targetGroups: [group]
        });
        fixture.listener.addTargetGroups('WithPath', {
            priority: 10,
            pathPattern: '/hello',
            targetGroups: [group]
        });

        // THEN
        expectStandardBidi(fixture.stack);

        test.done();
    },

    'same result if target is added to group after assigning to listener'(test: Test) {
        // GIVEN
        const fixture = new TestFixture();
        const group = new elbv2.ApplicationTargetGroup(fixture.stack, 'TargetGroup', {
            vpc: fixture.vpc,
            port: 8008
        });
        fixture.listener.addTargetGroups('Default', {
            targetGroups: [group]
        });

        // WHEN
        const target = new FakeSelfRegisteringTarget(fixture.stack, 'Target', fixture.vpc);
        group.addTarget(target);

        // THEN
        expectStandardBidi(fixture.stack);

        test.done();
    },
};

function expectStandardBidi(stack: cdk.Stack) {
    expect(stack).to(haveResource('AWS::EC2::SecurityGroupEgress', {
        IpProtocol: "tcp",
        Description: "Load balancer to target",
        DestinationSecurityGroupId: { "Fn::GetAtt": [ "TargetSGDB98152D", "GroupId" ] },
        FromPort: 8008,
        ToPort: 8008
    }));
    expect(stack).to(haveResource('AWS::EC2::SecurityGroupIngress', {
        IpProtocol: "tcp",
        Description: "Load balancer to target",
        FromPort: 8008,
        GroupId: { "Fn::GetAtt": [ "TargetSGDB98152D", "GroupId" ] },
        SourceSecurityGroupId: { "Fn::GetAtt": [ "LBSecurityGroup8A41EA2B", "GroupId" ] },
        ToPort: 8008
    }));
}

class TestFixture {
    public readonly stack: cdk.Stack;
    public readonly vpc: ec2.VpcNetwork;
    public readonly lb: elbv2.ApplicationLoadBalancer;
    public readonly listener: elbv2.ApplicationListener;

    constructor() {
        this.stack = new cdk.Stack();
        this.vpc = new ec2.VpcNetwork(this.stack, 'VPC', {
            maxAZs: 2
        });
        this.lb = new elbv2.ApplicationLoadBalancer(this.stack, 'LB', { vpc: this.vpc });
        this.listener = this.lb.addListener('Listener', { port: 80 });
    }
}
