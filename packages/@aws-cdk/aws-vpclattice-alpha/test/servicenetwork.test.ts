import { Template } from 'aws-cdk-lib/assertions';
import * as core from 'aws-cdk-lib';
import {
  aws_ec2 as ec2,
  aws_s3 as s3,
  aws_kinesis as kinesis,
  aws_logs as log,
  aws_lambda as lambda,
  aws_iam as iam,
  aws_elasticloadbalancingv2 as elbv2,
}
  from 'aws-cdk-lib';

import {
  TargetGroup,
  Target,
  Service,
  ServiceNetwork,
  LoggingDestination,
  HTTPMethods,
  Protocol,
  PathMatchType,
  MatchOperator,
  FixedResponse,
  Listener,
}
  from '../lib';

/* We allow quotes in the object keys used for CloudFormation template assertions */
/* eslint-disable quote-props */

describe('VPC Lattice', () => {
  let stack: core.Stack;

  beforeEach(() => {
    // try to factor out as much boilerplate test setup to before methods -
    // makes the tests much more readable
    stack = new core.Stack();
  });

  describe('created with default properties', () => {

    beforeEach(() => {

      const latticeService = new Service(stack, 'Service', {
        shares: [{
          name: 'LatticeService',
          allowExternalPrincipals: false,
          accounts: [
            '123456123456',
          ],
        }],
      });

      const listener = new Listener(stack, 'Listener', {
        service: latticeService,
      });

      // line 259 service.ts
      latticeService.grantAccess([new iam.AccountPrincipal('123456789000')]);

      // line 293 service.ts
      latticeService.addPolicyStatement(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['vpc-lattice-svcs:Invoke'],
        resources: ['*'],
        principals: [new iam.AccountPrincipal('123456789000')],
      }));

      listener.addListenerRule({
        name: 'FixedReponse',
        priority: 99,
        action: FixedResponse.NOT_FOUND,
        httpMatch: {
          pathMatches: { path: '/' },
        },
      });

      listener.addListenerRule({
        name: 'ListenerRule100',
        priority: 10,
        action: [
          {
            targetGroup: new TargetGroup(stack, 'lambdaTargets', {
              name: 'lambda1',
              target: Target.lambda([
                new lambda.Function(stack, 'lambdafunction', {
                  runtime: lambda.Runtime.PYTHON_3_10,
                  handler: 'handler',
                  code: lambda.Code.fromInline('return {"statusCode": 200}'),
                }),
              ]),
            }),
          },
        ],
        httpMatch: {
          pathMatches: { path: '/path1' },
          method: HTTPMethods.GET,
        },
        allowedPrincipals: [new iam.AccountPrincipal('123456123456')],
      });

      listener.addListenerRule({
        name: 'ListenerRule200',
        priority: 20,
        action: [
          {
            targetGroup: new TargetGroup(stack, 'ipTargets', {
              name: 'ipTargets',
              target: Target.ipAddress(
                ['10.10.10.10'],
                {
                  port: 443,
                  protocol: Protocol.HTTPS,
                  vpcIdentifier: 'Vpc1',
                },
              ),
            }),
          },
        ],
        httpMatch: {
          pathMatches: {
            path: '/path2',
            pathMatchType: PathMatchType.PREFIX,
          },
          method: HTTPMethods.GET,
        },
        allowedPrincipals: [new iam.AccountPrincipal('123456123456')],
      });

      listener.addListenerRule({
        name: 'ListenerRule300',
        priority: 30,
        httpMatch: {
          pathMatches: { path: '/path3' },
          method: HTTPMethods.GET,
        },
        allowedPrincipals: [new iam.AccountPrincipal('123456123456')],
        action: [
          {
            targetGroup: new TargetGroup(stack, 'instanceTargets', {
              name: 'instanceTargets',
              target: Target.ec2instance(
                [
                  new ec2.Instance(stack, 'Instance1', {
                    instanceType: new ec2.InstanceType('t2.micro'),
                    machineImage: ec2.MachineImage.latestAmazonLinux2022(),
                    vpc: new ec2.Vpc(stack, 'ec2instanceTarget'),
                  }),
                ],
                { port: 443, protocol: Protocol.HTTPS, vpcIdentifier: 'Vpc1' },
              ),
            }),
          },
        ],
      });

      listener.addListenerRule({
        name: 'ListenerRule400',
        priority: 40,
        action: [
          {
            targetGroup: new TargetGroup(stack, 'albv2Targets', {
              name: 'albv2Targets',
              target: Target.applicationLoadBalancer(
                [
                  new elbv2.ApplicationLoadBalancer(stack, 'albv2', {
                    vpc: new ec2.Vpc(stack, 'albv2TargetVpc'),
                  }),
                ],
                {
                  port: 443,
                  protocol: Protocol.HTTPS,
                  vpcIdentifier: 'Vpc1',
                },
              ),
            }),
          },
        ],
        httpMatch: {
          pathMatches: { path: '/path4' },
          method: HTTPMethods.GET,
        },
        allowedPrincipals: [new iam.AccountPrincipal('123456123456')],
      });

      listener.addListenerRule({
        name: 'ListenerRule500',
        priority: 50,
        action: [
          {
            targetGroup: new TargetGroup(stack, 'albv2Targets2', {
              name: 'albv2Targets',
              target: Target.applicationLoadBalancer(
                [
                  new elbv2.ApplicationLoadBalancer(stack, 'albv22', {
                    vpc: new ec2.Vpc(stack, 'albv2TargetVpc2'),
                  }),
                ],
                {
                  port: 443,
                  protocol: Protocol.HTTPS,
                  vpcIdentifier: 'Vpc1',
                },
              ),
            }),
          },
        ],
        httpMatch: {
          headerMatches: [
            {
              headername: 'header1',
              matchValue: 'value1',
              matchOperator: MatchOperator.EXACT,
            },
            {
              headername: 'header2',
              matchValue: 'value2',
              matchOperator: MatchOperator.CONTAINS,
            },
            {
              headername: 'header3',
              matchValue: 'value3',
              matchOperator: MatchOperator.PREFIX,
            },
          ],
          pathMatches: { path: '/path5' },
          method: HTTPMethods.GET,
        },
        allowedPrincipals: [new iam.AccountPrincipal('123456123456')],
      });

      const servicenetwork = new ServiceNetwork(stack, 'ServiceNetwork', {
        services: [latticeService],
        vpcs: [
          new ec2.Vpc(stack, 'Vpc1'),
          new ec2.Vpc(stack, 'Vpc2'),
        ],
        loggingDestinations: [
          LoggingDestination.s3(new s3.Bucket(stack, 'S3Bucket')),
          LoggingDestination.kinesis(new kinesis.Stream(stack, 'KinesisStream')),
          LoggingDestination.cloudwatch(new log.LogGroup(stack, 'CloudWatchLogGroup')),
        ],
      });

      servicenetwork.applyAuthPolicyToServiceNetwork();
      latticeService.applyAuthPolicy();

    });

    test('creates a lattice network', () => {
      Template.fromStack(stack).resourceCountIs('AWS::VpcLattice::ServiceNetwork', 1);
    });

    test('creates a lattice service', () => {
      Template.fromStack(stack).resourceCountIs('AWS::VpcLattice::Service', 1);
    });

    test('creates logging destinations', () => {
      Template.fromStack(stack).resourceCountIs('AWS::VpcLattice::AccessLogSubscription', 3);
    });

  });
});
