import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import * as cdk from '@aws-cdk/core';
import * as elbv2 from '../../lib';
import { FakeSelfRegisteringTarget } from '../helpers';

describe('tests', () => {
  test('security groups are automatically opened bidi for default rule', () => {
    // GIVEN
    const fixture = new TestFixture();
    const target = new FakeSelfRegisteringTarget(fixture.stack, 'Target', fixture.vpc);

    // WHEN
    fixture.listener.addTargets('TargetGroup', {
      port: 8008,
      targets: [target],
    });

    // THEN
    expectSameStackSGRules(fixture.stack);
  });

  test('security groups are automatically opened bidi for additional rule', () => {
    // GIVEN
    const fixture = new TestFixture();
    const target1 = new FakeSelfRegisteringTarget(fixture.stack, 'DefaultTarget', fixture.vpc);
    const target2 = new FakeSelfRegisteringTarget(fixture.stack, 'Target', fixture.vpc);

    // WHEN
    fixture.listener.addTargets('TargetGroup1', {
      port: 80,
      targets: [target1],
    });

    fixture.listener.addTargetGroups('Rule', {
      priority: 10,
      conditions: [elbv2.ListenerCondition.hostHeaders(['example.com'])],
      targetGroups: [new elbv2.ApplicationTargetGroup(fixture.stack, 'TargetGroup2', {
        vpc: fixture.vpc,
        port: 8008,
        targets: [target2],
      })],
    });

    // THEN
    expectSameStackSGRules(fixture.stack);
  });

  test('adding the same targets twice also works', () => {
    // GIVEN
    const fixture = new TestFixture();
    const target = new FakeSelfRegisteringTarget(fixture.stack, 'Target', fixture.vpc);

    // WHEN
    const group = new elbv2.ApplicationTargetGroup(fixture.stack, 'TargetGroup', {
      vpc: fixture.vpc,
      port: 8008,
      targets: [target],
    });

    fixture.listener.addTargetGroups('Default', {
      targetGroups: [group],
    });
    fixture.listener.addTargetGroups('WithPath', {
      priority: 10,
      conditions: [elbv2.ListenerCondition.pathPatterns(['/hello'])],
      targetGroups: [group],
    });

    // THEN
    expectSameStackSGRules(fixture.stack);
  });

  test('same result if target is added to group after assigning to listener', () => {
    // GIVEN
    const fixture = new TestFixture();
    const group = new elbv2.ApplicationTargetGroup(fixture.stack, 'TargetGroup', {
      vpc: fixture.vpc,
      port: 8008,
    });
    fixture.listener.addTargetGroups('Default', {
      targetGroups: [group],
    });

    // WHEN
    const target = new FakeSelfRegisteringTarget(fixture.stack, 'Target', fixture.vpc);
    group.addTarget(target);

    // THEN
    expectSameStackSGRules(fixture.stack);
  });

  test('ingress is added to child stack SG instead of parent stack', () => {
    // GIVEN
    const fixture = new TestFixture(true);

    const parentGroup = new elbv2.ApplicationTargetGroup(fixture.stack, 'TargetGroup', {
      vpc: fixture.vpc,
      port: 8008,
      targets: [new FakeSelfRegisteringTarget(fixture.stack, 'Target', fixture.vpc)],
    });

    // listener requires at least one rule for ParentStack to create
    fixture.listener.addTargetGroups('Default', { targetGroups: [parentGroup] });

    const childStack = new cdk.Stack(fixture.app, 'childStack');

    // WHEN
    const childGroup = new elbv2.ApplicationTargetGroup(childStack, 'TargetGroup', {
      // We're assuming the 2nd VPC is peered to the 1st, or something.
      vpc: fixture.vpc,
      port: 8008,
      targets: [new FakeSelfRegisteringTarget(childStack, 'Target', fixture.vpc)],
    });

    new elbv2.ApplicationListenerRule(childStack, 'ListenerRule', {
      listener: fixture.listener,
      targetGroups: [childGroup],
      priority: 100,
      conditions: [elbv2.ListenerCondition.hostHeaders(['www.foo.com'])],
    });

    // THEN
    expectSameStackSGRules(fixture.stack);
    expectedImportedSGRules(childStack);
  });

  test('SG peering works on exported/imported load balancer', () => {
    // GIVEN
    const fixture = new TestFixture(false);
    const stack2 = new cdk.Stack(fixture.app, 'stack2');
    const vpc2 = new ec2.Vpc(stack2, 'VPC');
    const group = new elbv2.ApplicationTargetGroup(stack2, 'TargetGroup', {
      // We're assuming the 2nd VPC is peered to the 1st, or something.
      vpc: vpc2,
      port: 8008,
      targets: [new FakeSelfRegisteringTarget(stack2, 'Target', vpc2)],
    });

    // WHEN
    const lb2 = elbv2.ApplicationLoadBalancer.fromApplicationLoadBalancerAttributes(stack2, 'LB', {
      loadBalancerArn: fixture.lb.loadBalancerArn,
      securityGroupId: fixture.lb.connections.securityGroups[0].securityGroupId,
      securityGroupAllowsAllOutbound: false,
    });
    const listener2 = lb2.addListener('YetAnotherListener', { port: 80 });
    listener2.addTargetGroups('Default', { targetGroups: [group] });

    // THEN
    expectedImportedSGRules(stack2);
  });

  test('SG peering works on exported/imported listener', () => {
    // GIVEN
    const fixture = new TestFixture();
    const stack2 = new cdk.Stack(fixture.app, 'stack2');
    const vpc2 = new ec2.Vpc(stack2, 'VPC');
    const group = new elbv2.ApplicationTargetGroup(stack2, 'TargetGroup', {
      // We're assuming the 2nd VPC is peered to the 1st, or something.
      vpc: vpc2,
      port: 8008,
      targets: [new FakeSelfRegisteringTarget(stack2, 'Target', vpc2)],
    });
    fixture.listener.addTargets('default', { port: 80 });

    // WHEN
    const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(stack2, 'SecurityGroup',
      fixture.listener.connections.securityGroups[0].securityGroupId,
      { allowAllOutbound: false });
    const listener2 = elbv2.ApplicationListener.fromApplicationListenerAttributes(stack2, 'YetAnotherListener', {
      defaultPort: 8008,
      listenerArn: fixture.listener.listenerArn,
      securityGroup,
    });
    listener2.addTargetGroups('Default', {
      // Must be a non-default target
      priority: 10,
      conditions: [elbv2.ListenerCondition.hostHeaders(['example.com'])],
      targetGroups: [group],
    });

    // THEN
    expectedImportedSGRules(stack2);
  });

  testDeprecated('default port peering works on constructed listener', () => {
    // GIVEN
    const fixture = new TestFixture();
    fixture.listener.addTargets('Default', { port: 8080, targets: [new elbv2.InstanceTarget('i-12345')] });

    // WHEN
    fixture.listener.connections.allowDefaultPortFromAnyIpv4('Open to the world');

    // THEN
    Template.fromStack(fixture.stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
      SecurityGroupIngress: [
        {
          CidrIp: '0.0.0.0/0',
          Description: 'Open to the world',
          FromPort: 80,
          IpProtocol: 'tcp',
          ToPort: 80,
        },
      ],
    });
  });

  test('default port peering works on imported listener', () => {
    // GIVEN
    const stack2 = new cdk.Stack();
    const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(stack2, 'SecurityGroup', 'imported-security-group-id');

    // WHEN
    const listener2 = elbv2.ApplicationListener.fromApplicationListenerAttributes(stack2, 'YetAnotherListener', {
      listenerArn: 'listener-arn',
      securityGroup,
      defaultPort: 8080,
    });
    listener2.connections.allowDefaultPortFromAnyIpv4('Open to the world');

    // THEN
    Template.fromStack(stack2).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
      CidrIp: '0.0.0.0/0',
      Description: 'Open to the world',
      IpProtocol: 'tcp',
      FromPort: 8080,
      ToPort: 8080,
      GroupId: 'imported-security-group-id',
    });
  });
});

const LB_SECURITY_GROUP = { 'Fn::GetAtt': ['LBSecurityGroup8A41EA2B', 'GroupId'] };
const IMPORTED_LB_SECURITY_GROUP = { 'Fn::ImportValue': 'Stack:ExportsOutputFnGetAttLBSecurityGroup8A41EA2BGroupId851EE1F6' };

function expectSameStackSGRules(stack: cdk.Stack) {
  expectSGRules(stack, LB_SECURITY_GROUP);
}

function expectedImportedSGRules(stack: cdk.Stack) {
  expectSGRules(stack, IMPORTED_LB_SECURITY_GROUP);
}

function expectSGRules(stack: cdk.Stack, lbGroup: any) {
  Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
    GroupId: lbGroup,
    IpProtocol: 'tcp',
    Description: 'Load balancer to target',
    DestinationSecurityGroupId: { 'Fn::GetAtt': ['TargetSGDB98152D', 'GroupId'] },
    FromPort: 8008,
    ToPort: 8008,
  });
  Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
    IpProtocol: 'tcp',
    Description: 'Load balancer to target',
    FromPort: 8008,
    GroupId: { 'Fn::GetAtt': ['TargetSGDB98152D', 'GroupId'] },
    SourceSecurityGroupId: lbGroup,
    ToPort: 8008,
  });
}

class TestFixture {
  public readonly app: cdk.App;
  public readonly stack: cdk.Stack;
  public readonly vpc: ec2.Vpc;
  public readonly lb: elbv2.ApplicationLoadBalancer;
  public readonly _listener: elbv2.ApplicationListener | undefined;

  constructor(createListener?: boolean) {
    this.app = new cdk.App();
    this.stack = new cdk.Stack(this.app, 'Stack');
    this.vpc = new ec2.Vpc(this.stack, 'VPC', {
      maxAzs: 2,
    });
    this.lb = new elbv2.ApplicationLoadBalancer(this.stack, 'LB', { vpc: this.vpc });

    createListener = createListener ?? true;
    if (createListener) {
      this._listener = this.lb.addListener('Listener', { port: 80, open: false });
    }
  }

  public get listener(): elbv2.ApplicationListener {
    if (this._listener === undefined) { throw new Error('Did not create a listener'); }
    return this._listener;
  }
}
