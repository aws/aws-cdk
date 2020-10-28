import '@aws-cdk/assert/jest';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as cdk from '@aws-cdk/core';
import * as apigateway from '../lib';

describe('vpc link', () => {
  test('default setup', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const nlb = new elbv2.NetworkLoadBalancer(stack, 'NLB', {
      vpc,
    });

    // WHEN
    new apigateway.VpcLink(stack, 'VpcLink', {
      vpcLinkName: 'MyLink',
      targets: [nlb],
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::ApiGateway::VpcLink', {
      Name: 'MyLink',
      TargetArns: [{ Ref: 'NLB55158F82' }],
    });
  });

  test('targets can be added using addTargets', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const nlb0 = new elbv2.NetworkLoadBalancer(stack, 'NLB0', { vpc });
    const nlb1 = new elbv2.NetworkLoadBalancer(stack, 'NLB1', { vpc });
    const nlb2 = new elbv2.NetworkLoadBalancer(stack, 'NLB2', { vpc });
    const nlb3 = new elbv2.NetworkLoadBalancer(stack, 'NLB3', { vpc });

    // WHEN
    const link = new apigateway.VpcLink(stack, 'VpcLink', {
      targets: [nlb0],
    });
    link.addTargets(nlb1, nlb2);
    link.addTargets(nlb3);

    // THEN
    expect(stack).toHaveResourceLike('AWS::ApiGateway::VpcLink', {
      Name: 'VpcLink',
      TargetArns: [
        { Ref: 'NLB03D178991' },
        { Ref: 'NLB13224D47C' },
        { Ref: 'NLB2BEBACE62' },
        { Ref: 'NLB372DB3895' },
      ],
    });
  });

  test('import', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    apigateway.VpcLink.fromVpcLinkId(stack, 'ImportedVpcLink', 'vpclink-id');

    // THEN
    expect(stack).not.toHaveResource('AWS::ApiGateway::VpcLink');
  });

  test('validation error if vpc link is created and no targets are added', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');

    // WHEN
    new apigateway.VpcLink(stack, 'vpclink');

    // TEST
    expect(() => app.synth()).toThrow(/No targets added to vpc link/);
  });
});
