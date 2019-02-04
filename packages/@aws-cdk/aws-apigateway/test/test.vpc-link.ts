import { expect, haveResourceLike } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import apigateway = require('../lib');

export = {
  'default setup'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'VPC');
    const nlb = new elbv2.NetworkLoadBalancer(stack, 'NLB', {
      vpc
    });

    // WHEN
    new apigateway.VpcLink(stack, 'VpcLink', {
      name: 'MyLink',
      targets: [nlb]
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ApiGateway::VpcLink', {
      Name: "MyLink",
      TargetArns: [ { Ref: "NLB55158F82" } ]
    }));

    test.done();
  },
};