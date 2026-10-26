import { Annotations, Match, Template } from '../../assertions';
import { AccountPrincipal, PolicyStatement, Role, ServicePrincipal } from '../../aws-iam';
import { Fn, PropertyInjectors, Stack } from '../../core';
import { NetworkConnector } from '../lib/network-connector';
import { WebFunction } from '../lib/webfunction';
import { WebFunctionCode } from '../lib/webfunction-code';
import {
  WebFunctionAuthType,
  WebFunctionEndpoint,
  WebFunctionEndpointLocation,
  WebFunctionEndpointType,
  WebFunctionTraffic,
  WebFunctionReplicaRegions,
} from '../lib/webfunction-endpoint';
import type { WebFunctionEndpointProps } from '../lib/webfunction-endpoint';
import { WebFunctionRuntime } from '../lib/webfunction-runtime';

const mockBucket = {
  bucketName: 'my-code-bucket',
  bucketArn: 'arn:aws:s3:::my-code-bucket',
  arnForObjects: (key: string) => `arn:aws:s3:::my-code-bucket/${key}`,
  addToResourcePolicy: () => ({ statementAdded: false }),
  node: { addr: '', defaultChild: undefined },
} as any;

const minimalProps = (overrides: Record<string, any> = {}) => ({
  code: WebFunctionCode.fromBucket(mockBucket, 'code.zip'),
  runtime: WebFunctionRuntime.NODEJS_24_X,
  defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
  ...overrides,
});

function endpoints(stack: Stack) {
  return Template.fromStack(stack).findResources('AWS::Lambda::WebFunctionEndpoint');
}

describe('default endpoint', () => {
  test('keeps the logical ID it had when the WebFunction created the L1 directly', () => {
    const stack = new Stack();
    const fn = new WebFunction(stack, 'Fn', minimalProps());

    expect(Object.keys(endpoints(stack))).toEqual(['FnEndpointAA26FDCA']);
    expect(stack.resolve(fn.endpoint.endpointArn)).toEqual({ 'Fn::GetAtt': ['FnEndpointAA26FDCA', 'EndpointArn'] });
    expect(fn.endpoint.node.defaultChild).toBe(fn.endpoint.resource);
  });

  test('is configured by the endpoint properties of the WebFunction', () => {
    const stack = new Stack();
    const fn = new WebFunction(stack, 'Fn', minimalProps({ defaultEndpoint: { endpointName: 'live', rateLimit: 100 } }));

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::WebFunctionEndpoint', {
      FunctionName: { Ref: Match.stringLikeRegexp('^FnFunction') },
      EndpointName: 'live',
      AuthType: 'IamAuth',
      ThrottleConfig: { RateLimit: 100 },
      RevisionWeights: [{ RevisionId: { 'Fn::GetAtt': [Match.stringLikeRegexp('^FnRevision'), 'RevisionId'] }, Weight: 100 }],
    });
    expect(fn.endpoint.endpointType).toEqual(WebFunctionEndpointType.HOME_REGION);
  });

  test('keeps its name and logical ID when a property injector rebuilds the endpoint props', () => {
    const stack = new Stack();
    PropertyInjectors.of(stack).add({
      constructUniqueId: WebFunctionEndpoint.PROPERTY_INJECTION_ID,
      inject: (props: WebFunctionEndpointProps) => ({
        webFunction: props.webFunction,
        traffic: props.traffic,
        authType: props.authType,
        endpointName: props.endpointName,
        endpointLocation: props.endpointLocation,
        endpointDescription: props.endpointDescription,
        maxEnvironments: props.maxEnvironments,
        rateLimit: props.rateLimit,
      }),
    });
    new WebFunction(stack, 'Fn', minimalProps());

    expect(Object.keys(endpoints(stack))).toEqual(['FnEndpointAA26FDCA']);
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::WebFunctionEndpoint', { EndpointName: 'prod' });
  });

  test('is named prod by default', () => {
    const stack = new Stack();
    new WebFunction(stack, 'Fn', minimalProps());

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::WebFunctionEndpoint', { EndpointName: 'prod' });
  });

  test('depends on the function and its revision', () => {
    const stack = new Stack();
    new WebFunction(stack, 'Fn', minimalProps());

    const [endpoint] = Object.values(endpoints(stack));
    expect(endpoint.DependsOn).toEqual(expect.arrayContaining([
      expect.stringMatching(/^FnFunction/),
      expect.stringMatching(/^FnRevision/),
    ]));
  });
});

describe('addEndpoint', () => {
  test('adds an endpoint for the same revision, named so it does not collide', () => {
    const stack = new Stack();
    const fn = new WebFunction(stack, 'Fn', minimalProps({ defaultEndpointAuth: WebFunctionAuthType.APPLICATION_MANAGED }));
    const second = fn.addEndpoint('Cdn', { authType: WebFunctionAuthType.IAM_AUTH });

    const all = Object.values(endpoints(stack));
    expect(all).toHaveLength(2);
    const names = all.map((e) => e.Properties.EndpointName);
    expect(new Set(names).size).toBe(2);
    expect(names).toContain('prod');
    for (const name of names) {
      expect(name).toMatch(/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,62}[a-zA-Z0-9]$/);
    }

    const secondProps = endpoints(stack)[stack.resolve(second.endpointArn)['Fn::GetAtt'][0]].Properties;
    expect(secondProps.AuthType).toEqual('IamAuth');
    expect(secondProps.RevisionWeights).toEqual(endpoints(stack)[stack.resolve(fn.endpoint.endpointArn)['Fn::GetAtt'][0]].Properties.RevisionWeights);
  });

  test('takes its own settings, not those of the default endpoint', () => {
    const stack = new Stack();
    const fn = new WebFunction(stack, 'Fn', minimalProps({
      defaultEndpointAuth: WebFunctionAuthType.APPLICATION_MANAGED,
      defaultEndpoint: { endpointDescription: 'public', rateLimit: 100 },
    }));
    const second = fn.addEndpoint('Second', { authType: WebFunctionAuthType.IAM_AUTH });

    const props = endpoints(stack)[stack.resolve(second.endpointArn)['Fn::GetAtt'][0]].Properties;
    expect(props.AuthType).toEqual('IamAuth');
    expect(props).not.toHaveProperty('Description');
    expect(props).not.toHaveProperty('ThrottleConfig');
  });

  test('a second endpoint\'s default name changes with its endpoint type', () => {
    const name = (endpointLocation?: WebFunctionEndpointLocation) => {
      const stack = new Stack();
      const fn = new WebFunction(stack, 'Fn', minimalProps());
      const ep = fn.addEndpoint('Second', { authType: WebFunctionAuthType.IAM_AUTH, endpointLocation });
      return ep.resource.endpointName;
    };
    expect(name()).not.toEqual(name(WebFunctionEndpointLocation.multiRegion(WebFunctionReplicaRegions.of(['us-east-1']))));
  });

  test('validates the endpoint', () => {
    const stack = new Stack();
    const fn = new WebFunction(stack, 'Fn', minimalProps());

    expect(() => fn.addEndpoint('Bad', {
      authType: WebFunctionAuthType.IAM_AUTH,
      endpointDescription: 'x'.repeat(257),
    })).toThrow(/Endpoint description cannot be longer than 256 characters/);
  });

  test('only a home-Region endpoint can be added to a function with a network connector', () => {
    const stack = new Stack();
    const connector = NetworkConnector.fromNetworkConnectorVersionArn(stack, 'Connector',
      'arn:aws:lambda:us-east-1:123456789012:network-connector:my-connector:1');
    const fn = new WebFunction(stack, 'Fn', minimalProps({ egressNetworkConnector: connector }));

    expect(() => fn.addEndpoint('Global', {
      authType: WebFunctionAuthType.IAM_AUTH,
      endpointLocation: WebFunctionEndpointLocation.multiRegion(WebFunctionReplicaRegions.of(['us-east-1'])),
    })).toThrow(/egressNetworkConnector is only supported with a HomeRegion endpoint/);
    expect(() => fn.addEndpoint('Home', { authType: WebFunctionAuthType.IAM_AUTH })).not.toThrow();
  });

  test('warns on its own path for an APPLICATION_MANAGED endpoint', () => {
    const stack = new Stack();
    const fn = new WebFunction(stack, 'Fn', minimalProps());
    fn.addEndpoint('Public', { authType: WebFunctionAuthType.APPLICATION_MANAGED });

    Annotations.fromStack(stack).hasWarning('/Default/Fn/Public', Match.stringLikeRegexp('APPLICATION_MANAGED'));
    Annotations.fromStack(stack).hasNoWarning('/Default/Fn/Endpoint', Match.stringLikeRegexp('APPLICATION_MANAGED'));
  });
});

describe('grants.invoke', () => {
  let stack: Stack;
  let caller: Role;
  beforeEach(() => {
    stack = new Stack();
    caller = new Role(stack, 'Caller', { assumedBy: new ServicePrincipal('ec2.amazonaws.com') });
  });

  test('grants InvokeWebFunctionEndpoint on the endpoint', () => {
    const fn = new WebFunction(stack, 'Fn', minimalProps());
    fn.endpoint.grants.invoke(caller);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      Roles: [{ Ref: Match.stringLikeRegexp('Caller') }],
      PolicyDocument: {
        Statement: [{
          Action: 'lambda:InvokeWebFunctionEndpoint',
          Effect: 'Allow',
          Resource: stack.resolve(fn.endpoint.endpointArn),
        }],
      },
    });
  });

  test('each endpoint grants only on itself', () => {
    const fn = new WebFunction(stack, 'Fn', minimalProps());
    const second = fn.addEndpoint('Second', { authType: WebFunctionAuthType.IAM_AUTH });
    second.grants.invoke(caller);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [Match.objectLike({ Resource: stack.resolve(second.endpointArn) })],
      },
    });
  });
});

describe('resource-based policy', () => {
  let stack: Stack;
  beforeEach(() => {
    stack = new Stack(undefined, undefined, { env: { account: '111111111111', region: 'us-east-1' } });
  });

  test('a same-account role is granted in its own policy, not in a resource policy', () => {
    const fn = new WebFunction(stack, 'Fn', minimalProps());
    fn.endpoint.grants.invoke(new Role(stack, 'Caller', { assumedBy: new ServicePrincipal('ec2.amazonaws.com') }));

    Template.fromStack(stack).resourceCountIs('AWS::Lambda::ResourcePolicy', 0);
  });

  test('a service principal is granted in the function\'s resource policy, with its conditions', () => {
    const fn = new WebFunction(stack, 'Fn', minimalProps());
    const distributionArn = 'arn:aws:cloudfront::111111111111:distribution/EDFDVBD6EXAMPLE';
    fn.endpoint.grants.invoke(new ServicePrincipal('cloudfront.amazonaws.com', {
      conditions: { ArnLike: { 'aws:SourceArn': distributionArn } },
    }));

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::ResourcePolicy', {
      ResourceArn: stack.resolve(fn.webFunctionArn),
      PolicyDocument: {
        Statement: [{
          Sid: Match.anyValue(),
          Action: 'lambda:InvokeWebFunctionEndpoint',
          Effect: 'Allow',
          Principal: { Service: 'cloudfront.amazonaws.com' },
          Resource: stack.resolve(fn.endpoint.endpointArn),
          Condition: { ArnLike: { 'aws:SourceArn': distributionArn } },
        }],
      },
    });
  });

  test('another account is granted in the function\'s resource policy', () => {
    const fn = new WebFunction(stack, 'Fn', minimalProps());
    fn.endpoint.grants.invoke(new AccountPrincipal('222222222222'));

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::ResourcePolicy', {
      PolicyDocument: {
        Statement: [Match.objectLike({
          Principal: { AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::222222222222:root']] } },
        })],
      },
    });
  });

  test('grants on several endpoints and direct statements share one policy', () => {
    const fn = new WebFunction(stack, 'Fn', minimalProps());
    const second = fn.addEndpoint('Second', { authType: WebFunctionAuthType.IAM_AUTH });
    fn.endpoint.grants.invoke(new ServicePrincipal('cloudfront.amazonaws.com'));
    second.grants.invoke(new ServicePrincipal('cloudfront.amazonaws.com'));
    fn.addToResourcePolicy(new PolicyStatement({
      actions: ['lambda:InvokeWebFunctionEndpoint'],
      principals: [new AccountPrincipal('333333333333')],
      resources: [second.endpointArn],
    }));

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::Lambda::ResourcePolicy', 1);
    template.hasResourceProperties('AWS::Lambda::ResourcePolicy', {
      PolicyDocument: {
        Statement: [
          Match.objectLike({ Resource: stack.resolve(fn.endpoint.endpointArn) }),
          Match.objectLike({ Resource: stack.resolve(second.endpointArn) }),
          Match.objectLike({ Principal: Match.objectLike({ AWS: Match.anyValue() }) }),
        ],
      },
    });
  });

  test('a standalone endpoint of a WebFunction defined in the app adds to that function\'s policy', () => {
    const fn = new WebFunction(stack, 'Fn', minimalProps());
    const endpoint = new WebFunctionEndpoint(stack, 'Standalone', {
      webFunction: fn,
      traffic: WebFunctionTraffic.single(fn.revisionId),
      authType: WebFunctionAuthType.IAM_AUTH,
    });
    endpoint.grants.invoke(new ServicePrincipal('cloudfront.amazonaws.com'));

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::ResourcePolicy', {
      ResourceArn: stack.resolve(fn.webFunctionArn),
      PolicyDocument: { Statement: [Match.objectLike({ Resource: stack.resolve(endpoint.endpointArn) })] },
    });
  });

  test('an imported WebFunction does not get a resource policy and warns', () => {
    const fn = WebFunction.fromWebFunctionArn(stack, 'Fn', 'arn:aws:lambda:us-east-1:111111111111:web-function/existing');
    const result = fn.addToResourcePolicy(new PolicyStatement({
      actions: ['lambda:InvokeWebFunctionEndpoint'],
      principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
      resources: ['*'],
    }));

    expect(result.statementAdded).toBe(false);
    Template.fromStack(stack).resourceCountIs('AWS::Lambda::ResourcePolicy', 0);
    Annotations.fromStack(stack).hasWarning('*', Match.stringLikeRegexp('imported WebFunction cannot be added to'));
  });

  test('an imported endpoint warns when a service principal is granted', () => {
    const imported = WebFunctionEndpoint.fromWebFunctionEndpointAttributes(stack, 'Imported', {
      endpointArn: 'arn:aws:lambda:us-east-1:111111111111:web-function/existing/endpoint/prod',
      domainName: 'abc.lambda-web.global.on.aws',
      endpointType: WebFunctionEndpointType.HOME_REGION,
    });
    imported.grants.invoke(new ServicePrincipal('cloudfront.amazonaws.com'));

    Template.fromStack(stack).resourceCountIs('AWS::Lambda::ResourcePolicy', 0);
    Annotations.fromStack(stack).hasWarning('*', Match.stringLikeRegexp('function is not defined in this app'));
  });
});

describe('WebFunctionEndpoint.fromWebFunctionEndpointAttributes', () => {
  const endpointArn = 'arn:aws:lambda:us-east-1:123456789012:web-function/existing/endpoint/prod';

  test('carries the given attributes and the function ARN derived from the endpoint ARN', () => {
    const stack = new Stack();
    const imported = WebFunctionEndpoint.fromWebFunctionEndpointAttributes(stack, 'Imported', {
      endpointArn,
      domainName: 'abc.lambda-web.global.on.aws',
      endpointType: WebFunctionEndpointType.MULTI_REGION,
    });

    expect(imported.endpointArn).toEqual(endpointArn);
    expect(imported.domainName).toEqual('abc.lambda-web.global.on.aws');
    expect(imported.endpointType).toEqual(WebFunctionEndpointType.MULTI_REGION);
    expect(imported.webFunctionArn).toEqual('arn:aws:lambda:us-east-1:123456789012:web-function/existing');
    expect(imported.env).toEqual({ account: '123456789012', region: 'us-east-1' });
  });

  test('derives the function ARN at deploy time from a token endpoint ARN', () => {
    const stack = new Stack();
    const token = Fn.importValue('EndpointArn');
    const imported = WebFunctionEndpoint.fromWebFunctionEndpointAttributes(stack, 'Imported', {
      endpointArn: token,
      domainName: 'abc.lambda-web.global.on.aws',
      endpointType: WebFunctionEndpointType.HOME_REGION,
    });

    expect(stack.resolve(imported.webFunctionArn)).toEqual({
      'Fn::Select': [0, { 'Fn::Split': ['/endpoint/', { 'Fn::ImportValue': 'EndpointArn' }] }],
    });
  });

  test('can be granted on', () => {
    const stack = new Stack();
    const caller = new Role(stack, 'Caller', { assumedBy: new ServicePrincipal('ec2.amazonaws.com') });
    const imported = WebFunctionEndpoint.fromWebFunctionEndpointAttributes(stack, 'Imported', {
      endpointArn,
      domainName: 'abc.lambda-web.global.on.aws',
      endpointType: WebFunctionEndpointType.HOME_REGION,
    });
    imported.grants.invoke(caller);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [Match.objectLike({ Action: 'lambda:InvokeWebFunctionEndpoint', Resource: endpointArn })],
      },
    });
  });
});

describe('a standalone WebFunctionEndpoint', () => {
  test('serves an imported function\'s revision', () => {
    const stack = new Stack();
    const fn = WebFunction.fromWebFunctionArn(stack, 'Fn', 'arn:aws:lambda:us-east-1:123456789012:web-function/existing');
    new WebFunctionEndpoint(stack, 'Endpoint', {
      webFunction: fn,
      traffic: WebFunctionTraffic.single('rev-abc'),
      authType: WebFunctionAuthType.IAM_AUTH,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::WebFunctionEndpoint', {
      FunctionName: 'existing',
      RevisionWeights: [{ RevisionId: 'rev-abc', Weight: 100 }],
      EndpointName: Match.stringLikeRegexp('^Endpoint.*-[0-9a-f]{8}$'),
    });
  });
});
