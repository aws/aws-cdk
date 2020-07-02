import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as apigw from '../lib';

export = {
  'integration "credentialsRole" and "credentialsPassthrough" are mutually exclusive'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'MyRole', { assumedBy: new iam.ServicePrincipal('foo') });

    // THEN
    test.throws(() => new apigw.Integration({
      type: apigw.IntegrationType.AWS_PROXY,
      options: {
        credentialsPassthrough: true,
        credentialsRole: role,
      },
    }), /'credentialsPassthrough' and 'credentialsRole' are mutually exclusive/);
    test.done();
  },

  'integration connectionType VpcLink requires vpcLink to be set'(test: Test) {
    test.throws(() => new apigw.Integration({
      type: apigw.IntegrationType.HTTP_PROXY,
      integrationHttpMethod: 'ANY',
      options: {
        connectionType: apigw.ConnectionType.VPC_LINK,
      },
    }), /'connectionType' of VPC_LINK requires 'vpcLink' prop to be set/);
    test.done();
  },

  'connectionType of INTERNET and vpcLink are mutually exclusive'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const nlb = new elbv2.NetworkLoadBalancer(stack, 'NLB', {
      vpc,
    });
    const link = new apigw.VpcLink(stack, 'link', {
      targets: [nlb],
    });

    // THEN
    test.throws(() => new apigw.Integration({
      type: apigw.IntegrationType.HTTP_PROXY,
      integrationHttpMethod: 'ANY',
      options: {
        connectionType: apigw.ConnectionType.INTERNET,
        vpcLink: link,
      },
    }), /cannot set 'vpcLink' where 'connectionType' is INTERNET/);
    test.done();
  },
};