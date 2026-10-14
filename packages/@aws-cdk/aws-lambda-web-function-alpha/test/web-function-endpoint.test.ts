import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import { CfnWebFunctionEndpoint } from 'aws-cdk-lib/aws-lambda';
import {
  WebFunction,
  WebFunctionAuthType,
  WebFunctionCode,
  WebFunctionEndpoint,
  WebFunctionEndpointType,
} from '../lib';

const FIXTURE_DIR = path.join(__dirname, 'fixture-app');

let stack: cdk.Stack;
let fn: WebFunction;

beforeEach(() => {
  const app = new cdk.App();
  stack = new cdk.Stack(app, 'Stack', { env: { account: '123456789012', region: 'us-east-1' } });
  fn = new WebFunction(stack, 'WebFunction', {
    code: WebFunctionCode.fromAsset(FIXTURE_DIR),
    webFunctionName: 'my-web-function',
  });
});

describe('WebFunctionEndpoint', () => {
  test('routes all traffic to the revision of the function by default', () => {
    new WebFunctionEndpoint(stack, 'Endpoint', { webFunction: fn, webFunctionEndpointName: 'prod' });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::WebFunctionEndpoint', {
      FunctionName: 'my-web-function',
      EndpointName: 'prod',
      EndpointType: 'HomeRegion',
      AuthType: 'IamAuth',
      RevisionWeights: [{
        RevisionId: { 'Fn::GetAtt': [Match.stringLikeRegexp('^WebFunctionRevision'), 'RevisionId'] },
        Weight: 100,
      }],
    });
  });

  test('depends on the function so it is created after it', () => {
    new WebFunctionEndpoint(stack, 'Endpoint', { webFunction: fn });

    Template.fromStack(stack).hasResource('AWS::Lambda::WebFunctionEndpoint', {
      DependsOn: Match.arrayWith([Match.stringLikeRegexp('^WebFunction[0-9A-F]{8}$')]),
    });
  });

  test('maps type, auth, regions, scaling and throttling', () => {
    new WebFunctionEndpoint(stack, 'Endpoint', {
      webFunction: fn,
      description: 'public API',
      endpointType: WebFunctionEndpointType.MULTI_REGION,
      authType: WebFunctionAuthType.APPLICATION_MANAGED,
      regions: ['us-east-1', 'eu-west-1'],
      maxEnvironments: 20,
      rateLimit: 500,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::WebFunctionEndpoint', {
      Description: 'public API',
      EndpointType: 'MultiRegion',
      AuthType: 'ApplicationManaged',
      Regions: ['us-east-1', 'eu-west-1'],
      ScalingConfig: { MaxEnvironments: 20 },
      ThrottleConfig: { RateLimit: 500 },
    });
  });

  test('splits traffic between two revisions', () => {
    new WebFunctionEndpoint(stack, 'Endpoint', {
      webFunction: fn,
      revisionWeights: [
        { revisionId: 'rev-old', weight: 90 },
        { revisionId: 'rev-new', weight: 10 },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::WebFunctionEndpoint', {
      RevisionWeights: [
        { RevisionId: 'rev-old', Weight: 90 },
        { RevisionId: 'rev-new', Weight: 10 },
      ],
    });
  });

  test('exposes L1 escape hatch and attributes', () => {
    const endpoint = new WebFunctionEndpoint(stack, 'Endpoint', { webFunction: fn });

    expect(endpoint.cfnEndpoint).toBeInstanceOf(CfnWebFunctionEndpoint);
    expect(endpoint.endpointArn).toBeDefined();
    expect(endpoint.domainName).toBeDefined();
  });

  test.each([
    ['no entries', [], /1 or 2 entries/],
    ['three entries', [
      { revisionId: 'a', weight: 40 },
      { revisionId: 'b', weight: 30 },
      { revisionId: 'c', weight: 30 },
    ], /1 or 2 entries/],
    ['single entry below 100', [{ revisionId: 'a', weight: 50 }], /weight of 100/],
    ['two entries not summing to 100', [
      { revisionId: 'a', weight: 60 },
      { revisionId: 'b', weight: 30 },
    ], /sum to 100/],
    ['weight above 100', [{ revisionId: 'a', weight: 101 }], /from 0 to 100/],
  ])('rejects revision weights with %s', (_label, revisionWeights, message) => {
    expect(() => new WebFunctionEndpoint(stack, 'Endpoint', {
      webFunction: fn,
      revisionWeights,
    })).toThrow(message);
  });

  test('grants invoke permission on the endpoint', () => {
    const endpoint = new WebFunctionEndpoint(stack, 'Endpoint', { webFunction: fn });
    const role = new iam.Role(stack, 'Caller', { assumedBy: new iam.AccountRootPrincipal() });

    endpoint.grants.invoke(role);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
          Action: 'lambda:InvokeWebFunctionEndpoint',
          Effect: 'Allow',
          Resource: { 'Fn::GetAtt': [Match.stringLikeRegexp('^Endpoint'), 'EndpointArn'] },
        }],
      },
    });
  });

  test('routes an endpoint of an imported function to its revision', () => {
    const imported = WebFunction.fromWebFunctionAttributes(stack, 'Imported', {
      functionArn: 'arn:aws:lambda:us-east-1:123456789012:web-function/existing-fn',
      functionName: 'existing-fn',
      revisionId: 'rev-1',
    });

    new WebFunctionEndpoint(stack, 'Endpoint', { webFunction: imported });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::WebFunctionEndpoint', {
      FunctionName: 'existing-fn',
      RevisionWeights: [{ RevisionId: 'rev-1', Weight: 100 }],
    });
  });

  test('imports an existing endpoint and grants invoke permission on it', () => {
    const imported = WebFunctionEndpoint.fromWebFunctionEndpointAttributes(stack, 'Imported', {
      endpointArn: 'arn:aws:lambda:us-east-1:123456789012:web-function/existing-fn/endpoint/prod',
      endpointName: 'prod',
    });
    const role = new iam.Role(stack, 'Caller', { assumedBy: new iam.AccountRootPrincipal() });

    imported.grants.invoke(role);

    expect(imported.endpointName).toBe('prod');
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
          Action: 'lambda:InvokeWebFunctionEndpoint',
          Resource: 'arn:aws:lambda:us-east-1:123456789012:web-function/existing-fn/endpoint/prod',
        }],
      },
    });
  });

  test('exposes a reference to the endpoint', () => {
    const endpoint = new WebFunctionEndpoint(stack, 'Endpoint', { webFunction: fn });

    expect(endpoint.webFunctionEndpointRef).toEqual({ endpointArn: endpoint.endpointArn });
  });

  test('rejects a rate limit above 10000', () => {
    expect(() => new WebFunctionEndpoint(stack, 'Endpoint', {
      webFunction: fn,
      rateLimit: 10001,
    })).toThrow(/rateLimit/);
  });

  test('rejects an empty list of Regions', () => {
    expect(() => new WebFunctionEndpoint(stack, 'Endpoint', {
      webFunction: fn,
      regions: [],
    })).toThrow(/regions/);
  });
});
