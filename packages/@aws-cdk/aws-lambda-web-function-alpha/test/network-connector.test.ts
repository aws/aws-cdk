import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import {
  NetworkConnector,
  NetworkProtocol,
  WebFunction,
  WebFunctionAuthType,
  WebFunctionCode,
  WebFunctionEndpoint,
} from '../lib';

const FIXTURE_DIR = path.join(__dirname, 'fixture-app');

let app: cdk.App;
let stack: cdk.Stack;
let vpc: ec2.Vpc;

beforeEach(() => {
  app = new cdk.App();
  stack = new cdk.Stack(app, 'Stack', { env: { account: '123456789012', region: 'us-east-1' } });
  vpc = new ec2.Vpc(stack, 'Vpc');
});

describe('NetworkConnector', () => {
  test('creates a connector with VPC egress for web functions', () => {
    new NetworkConnector(stack, 'NetworkConnector', { vpc, networkConnectorName: 'egress' });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::NetworkConnector', {
      Name: 'egress',
      Configuration: {
        VpcEgressConfiguration: {
          SubnetIds: Match.anyValue(),
          SecurityGroupIds: [{ 'Fn::GetAtt': [Match.stringLikeRegexp('^NetworkConnectorSecurityGroup'), 'GroupId'] }],
          NetworkProtocol: 'IPv4',
          AssociatedComputeResourceTypes: ['WebFunction'],
        },
      },
      OperatorRole: { 'Fn::GetAtt': [Match.stringLikeRegexp('^NetworkConnectorOperatorRole'), 'Arn'] },
    });
  });

  test('creates an operator role with the managed policy that lets the service manage network interfaces', () => {
    new NetworkConnector(stack, 'NetworkConnector', { vpc });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: Match.objectLike({
        Statement: [Match.objectLike({ Principal: { Service: 'lambda.amazonaws.com' } })],
      }),
      ManagedPolicyArns: [Match.objectLike({
        'Fn::Join': ['', Match.arrayWith([':iam::aws:policy/AWSLambdaNetworkConnectorOperatorPolicy'])],
      })],
    });
  });

  test('uses DualStack when requested and the given security groups', () => {
    const sg = new ec2.SecurityGroup(stack, 'Sg', { vpc });
    new NetworkConnector(stack, 'NetworkConnector', {
      vpc,
      securityGroups: [sg],
      networkProtocol: NetworkProtocol.DUAL_STACK,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::NetworkConnector', {
      Configuration: {
        VpcEgressConfiguration: {
          NetworkProtocol: 'DualStack',
          SecurityGroupIds: [{ 'Fn::GetAtt': [Match.stringLikeRegexp('^Sg'), 'GroupId'] }],
        },
      },
    });
  });

  test('pins a web function revision to the latest version of the connector', () => {
    const connector = new NetworkConnector(stack, 'NetworkConnector', { vpc });
    new WebFunction(stack, 'WebFunction', {
      code: WebFunctionCode.fromAsset(FIXTURE_DIR),
      egressNetworkConnector: connector,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::WebFunctionRevision', {
      ServiceConfig: {
        EgressNetworkConnectorArn: {
          'Fn::GetAtt': [Match.stringLikeRegexp('^NetworkConnector[0-9A-F]{8}$'), 'LatestVersionArn'],
        },
      },
    });
  });

  test('rejects a connector defined in another stack', () => {
    const other = new cdk.Stack(app, 'Other', { env: { account: '123456789012', region: 'us-east-1' } });
    const otherVpc = new ec2.Vpc(other, 'Vpc');
    const connector = new NetworkConnector(other, 'NetworkConnector', { vpc: otherVpc });

    expect(() => new WebFunction(stack, 'WebFunction', {
      code: WebFunctionCode.fromAsset(FIXTURE_DIR),
      egressNetworkConnector: connector,
    })).toThrow(/same stack/);
  });

  test('a web function without egress has no egress connector ARN', () => {
    new WebFunction(stack, 'WebFunction', {
      code: WebFunctionCode.fromAsset(FIXTURE_DIR),
    });

    const revision = Template.fromStack(stack).findResources('AWS::Lambda::WebFunctionRevision');
    const serviceConfig = Object.values(revision)[0].Properties.ServiceConfig;
    expect(serviceConfig.EgressNetworkConnectorArn).toBeUndefined();
  });

  test('endpoints of a web function with egress are still created normally', () => {
    const connector = new NetworkConnector(stack, 'NetworkConnector', { vpc });
    const fn = new WebFunction(stack, 'WebFunction', {
      code: WebFunctionCode.fromAsset(FIXTURE_DIR),
      egressNetworkConnector: connector,
    });
    new WebFunctionEndpoint(stack, 'Endpoint', { webFunction: fn, authType: WebFunctionAuthType.IAM_AUTH });

    Template.fromStack(stack).resourceCountIs('AWS::Lambda::WebFunctionEndpoint', 1);
  });
});
