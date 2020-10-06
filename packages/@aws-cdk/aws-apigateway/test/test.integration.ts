import { expect, haveResourceLike } from '@aws-cdk/assert';
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

  'uri is self determined from the NLB'(test: Test) {
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const nlb = new elbv2.NetworkLoadBalancer(stack, 'NLB', { vpc });
    const link = new apigw.VpcLink(stack, 'link', {
      targets: [nlb],
    });
    const api = new apigw.RestApi(stack, 'restapi');
    const integration = new apigw.Integration({
      type: apigw.IntegrationType.HTTP_PROXY,
      integrationHttpMethod: 'ANY',
      options: {
        connectionType: apigw.ConnectionType.VPC_LINK,
        vpcLink: link,
      },
    });
    api.root.addMethod('GET', integration);

    expect(stack).to(haveResourceLike('AWS::ApiGateway::Method', {
      Integration: {
        Uri: {
          'Fn::Join': [
            '',
            [
              'http://',
              {
                'Fn::GetAtt': [
                  'NLB55158F82',
                  'DNSName',
                ],
              },
            ],
          ],
        },
      },
    }));

    test.done();
  },

  'uri must be set for VpcLink with multiple NLBs'(test: Test) {
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    const vpc = new ec2.Vpc(stack, 'VPC');
    const nlb1 = new elbv2.NetworkLoadBalancer(stack, 'NLB1', { vpc });
    const nlb2 = new elbv2.NetworkLoadBalancer(stack, 'NLB2', { vpc });
    const link = new apigw.VpcLink(stack, 'link', {
      targets: [nlb1, nlb2],
    });
    const api = new apigw.RestApi(stack, 'restapi');
    const integration = new apigw.Integration({
      type: apigw.IntegrationType.HTTP_PROXY,
      integrationHttpMethod: 'ANY',
      options: {
        connectionType: apigw.ConnectionType.VPC_LINK,
        vpcLink: link,
      },
    });
    api.root.addMethod('GET', integration);
    test.throws(() => app.synth(), /'uri' is required when there are more than one NLBs in the VPC Link/);

    test.done();
  },

  'uri must be set when using an imported VpcLink'(test: Test) {
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    const link = apigw.VpcLink.fromVpcLinkId(stack, 'link', 'vpclinkid');
    const api = new apigw.RestApi(stack, 'restapi');
    const integration = new apigw.Integration({
      type: apigw.IntegrationType.HTTP_PROXY,
      integrationHttpMethod: 'ANY',
      options: {
        connectionType: apigw.ConnectionType.VPC_LINK,
        vpcLink: link,
      },
    });
    api.root.addMethod('GET', integration);
    test.throws(() => app.synth(), /'uri' is required when the 'connectionType' is VPC_LINK/);

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