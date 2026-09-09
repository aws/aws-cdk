import { Match, Template } from '../../assertions';
import * as acm from '../../aws-certificatemanager';
import { Stack } from '../../core';
import * as apigw from '../lib';

function newStack() {
  const stack = new Stack();
  const cert = new acm.Certificate(stack, 'Cert', { domainName: 'example.com' });
  const api = new apigw.RestApi(stack, 'Api');
  api.root.addMethod('GET');
  return { stack, cert, api };
}

describe('routing rule', () => {
  test('addRoutingRule with a base path condition renders a CfnRoutingRule', () => {
    // GIVEN
    const { stack, cert, api } = newStack();
    const domain = new apigw.DomainName(stack, 'Domain', {
      domainName: 'api.example.com',
      certificate: cert,
      routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
    });

    // WHEN
    domain.addRoutingRule('UsersRule', {
      priority: 100,
      conditions: { basePath: 'users' },
      action: { restApi: api, stripBasePath: true },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::RoutingRule', {
      Priority: 100,
      Conditions: [{ MatchBasePaths: { AnyOf: ['users'] } }],
      Actions: [{
        InvokeApi: {
          ApiId: { Ref: Match.stringLikeRegexp('Api') },
          Stage: { Ref: Match.stringLikeRegexp('ApiDeploymentStage') },
          StripBasePath: true,
        },
      }],
    });
  });

  test('sets the routingMode on the domain name', () => {
    // GIVEN
    const { stack, cert } = newStack();

    // WHEN
    new apigw.DomainName(stack, 'Domain', {
      domainName: 'api.example.com',
      certificate: cert,
      routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::DomainName', {
      RoutingMode: 'ROUTING_RULE_ONLY',
    });
  });

  test('header condition', () => {
    // GIVEN
    const { stack, cert, api } = newStack();
    const domain = new apigw.DomainName(stack, 'Domain', {
      domainName: 'api.example.com',
      certificate: cert,
      routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
    });

    // WHEN
    domain.addRoutingRule('HeaderRule', {
      priority: 50,
      conditions: { headers: [{ header: 'x-api-version', valueGlob: 'v2' }] },
      action: { restApi: api },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::RoutingRule', {
      Priority: 50,
      Conditions: [{ MatchHeaders: { AnyOf: [{ Header: 'x-api-version', ValueGlob: 'v2' }] } }],
    });
  });

  test('combined base path and header conditions', () => {
    // GIVEN
    const { stack, cert, api } = newStack();
    const domain = new apigw.DomainName(stack, 'Domain', {
      domainName: 'api.example.com',
      certificate: cert,
      routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
    });

    // WHEN
    domain.addRoutingRule('CombinedRule', {
      priority: 75,
      conditions: {
        basePath: 'orders',
        headers: [{ header: 'x-api-version', valueGlob: 'v2' }],
      },
      action: { restApi: api, stripBasePath: true },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::RoutingRule', {
      Conditions: [
        { MatchBasePaths: { AnyOf: ['orders'] } },
        { MatchHeaders: { AnyOf: [{ Header: 'x-api-version', ValueGlob: 'v2' }] } },
      ],
    });
  });

  test('catch-all rule with no conditions', () => {
    // GIVEN
    const { stack, cert, api } = newStack();
    const domain = new apigw.DomainName(stack, 'Domain', {
      domainName: 'api.example.com',
      certificate: cert,
      routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
    });

    // WHEN
    domain.addRoutingRule('CatchAll', {
      priority: 999999,
      action: { restApi: api },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::RoutingRule', {
      Priority: 999999,
      Conditions: [],
    });
  });

  test('standalone RoutingRule construct with imported domain', () => {
    // GIVEN
    const { stack, api } = newStack();
    const domain = apigw.DomainName.fromDomainNameAttributes(stack, 'Imported', {
      domainName: 'api.example.com',
      domainNameAliasTarget: 'target',
      domainNameAliasHostedZoneId: 'Z123',
    });

    // WHEN
    new apigw.RoutingRule(stack, 'Rule', {
      domainName: domain,
      priority: 100,
      conditions: { basePath: 'users' },
      action: { restApi: api },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::RoutingRule', {
      DomainNameArn: {
        'Fn::Join': ['', Match.arrayWith([Match.stringLikeRegexp(':apigateway:')])],
      },
      Priority: 100,
    });
  });

  test('ROUTING_RULE_THEN_BASE_PATH_MAPPING allows both routing rules and api mappings', () => {
    // GIVEN
    const { stack, cert, api } = newStack();
    const domain = new apigw.DomainName(stack, 'Domain', {
      domainName: 'api.example.com',
      certificate: cert,
      routingMode: apigw.RoutingMode.ROUTING_RULE_THEN_BASE_PATH_MAPPING,
    });

    // WHEN
    domain.addRoutingRule('Rule', { priority: 1, action: { restApi: api } });
    domain.addApiMapping(api.deploymentStage, { basePath: 'legacy' });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::ApiGatewayV2::RoutingRule', 1);
    Template.fromStack(stack).resourceCountIs('AWS::ApiGatewayV2::ApiMapping', 1);
  });

  describe('routing mode enforcement', () => {
    test('addRoutingRule fails in BASE_PATH_MAPPING_ONLY mode', () => {
      const { stack, cert, api } = newStack();
      const domain = new apigw.DomainName(stack, 'Domain', {
        domainName: 'api.example.com',
        certificate: cert,
      });

      expect(() => domain.addRoutingRule('Rule', { priority: 1, action: { restApi: api } }))
        .toThrow(/addRoutingRule\(\) requires the routingMode to be/);
    });

    test('addBasePathMapping fails in ROUTING_RULE_ONLY mode', () => {
      const { stack, cert, api } = newStack();
      const domain = new apigw.DomainName(stack, 'Domain', {
        domainName: 'api.example.com',
        certificate: cert,
        routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
      });

      expect(() => domain.addBasePathMapping(api))
        .toThrow(/addBasePathMapping\(\) is only supported when routingMode is RoutingMode.BASE_PATH_MAPPING_ONLY/);
    });

    test('addApiMapping fails in ROUTING_RULE_ONLY mode', () => {
      const { stack, cert, api } = newStack();
      const domain = new apigw.DomainName(stack, 'Domain', {
        domainName: 'api.example.com',
        certificate: cert,
        routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
      });

      expect(() => domain.addApiMapping(api.deploymentStage))
        .toThrow(/addApiMapping\(\) is not supported when routingMode is RoutingMode.ROUTING_RULE_ONLY/);
    });

    test('routing mode fails for EDGE endpoint', () => {
      const { stack, cert } = newStack();

      expect(() => new apigw.DomainName(stack, 'Domain', {
        domainName: 'api.example.com',
        certificate: cert,
        endpointType: apigw.EndpointType.EDGE,
        routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
      })).toThrow(/routing rules are only supported for EndpointType.REGIONAL/);
    });

    test('duplicate priority fails', () => {
      const { stack, cert, api } = newStack();
      const domain = new apigw.DomainName(stack, 'Domain', {
        domainName: 'api.example.com',
        certificate: cert,
        routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
      });
      domain.addRoutingRule('Rule1', { priority: 100, action: { restApi: api } });

      expect(() => domain.addRoutingRule('Rule2', { priority: 100, action: { restApi: api } }))
        .toThrow(/already has a routing rule with priority 100/);
    });
  });

  describe('priority validation', () => {
    test.each([0, -1, 1_000_001, 1.5])('fails for invalid priority %d', (priority) => {
      const { stack, cert, api } = newStack();
      const domain = new apigw.DomainName(stack, 'Domain', {
        domainName: 'api.example.com',
        certificate: cert,
        routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
      });

      expect(() => domain.addRoutingRule('Rule', { priority, action: { restApi: api } }))
        .toThrow(/priority must be an integer between 1 and 1000000/);
    });

    test.each([1, 500000, 1_000_000])('accepts valid priority %d', (priority) => {
      const { stack, cert, api } = newStack();
      const domain = new apigw.DomainName(stack, 'Domain', {
        domainName: 'api.example.com',
        certificate: cert,
        routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
      });

      expect(() => domain.addRoutingRule('Rule', { priority, action: { restApi: api } })).not.toThrow();
    });
  });

  describe('base path validation', () => {
    test('fails for base path with backslash', () => {
      const { stack, cert, api } = newStack();
      const domain = new apigw.DomainName(stack, 'Domain', {
        domainName: 'api.example.com',
        certificate: cert,
        routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
      });

      expect(() => domain.addRoutingRule('Rule', {
        priority: 1,
        conditions: { basePath: 'users\\admin' },
        action: { restApi: api },
      })).toThrow(/cannot contain a backslash/);
    });

    test('fails for base path that is too long', () => {
      const { stack, cert, api } = newStack();
      const domain = new apigw.DomainName(stack, 'Domain', {
        domainName: 'api.example.com',
        certificate: cert,
        routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
      });

      expect(() => domain.addRoutingRule('Rule', {
        priority: 1,
        conditions: { basePath: 'a'.repeat(128) },
        action: { restApi: api },
      })).toThrow(/must be less than 128 characters/);
    });

    test('fails for empty base path', () => {
      const { stack, cert, api } = newStack();
      const domain = new apigw.DomainName(stack, 'Domain', {
        domainName: 'api.example.com',
        certificate: cert,
        routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
      });

      expect(() => domain.addRoutingRule('Rule', {
        priority: 1,
        conditions: { basePath: '' },
        action: { restApi: api },
      })).toThrow(/base path condition cannot be empty/);
    });
  });

  describe('header validation', () => {
    test('fails for more than 2 header conditions', () => {
      const { stack, cert, api } = newStack();
      const domain = new apigw.DomainName(stack, 'Domain', {
        domainName: 'api.example.com',
        certificate: cert,
        routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
      });

      expect(() => domain.addRoutingRule('Rule', {
        priority: 1,
        conditions: {
          headers: [
            { header: 'a', valueGlob: '1' },
            { header: 'b', valueGlob: '2' },
            { header: 'c', valueGlob: '3' },
          ],
        },
        action: { restApi: api },
      })).toThrow(/at most 2 header conditions/);
    });

    test.each(['Authorization', 'x-amz-date', 'apigw-something', 'X-Forwarded-For'])(
      'fails for restricted header %s', (header) => {
        const { stack, cert, api } = newStack();
        const domain = new apigw.DomainName(stack, 'Domain', {
          domainName: 'api.example.com',
          certificate: cert,
          routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
        });

        expect(() => domain.addRoutingRule('Rule', {
          priority: 1,
          conditions: { headers: [{ header, valueGlob: 'v' }] },
          action: { restApi: api },
        })).toThrow(/is not supported as a routing rule condition/);
      });

    test('fails for header name that is too long', () => {
      const { stack, cert, api } = newStack();
      const domain = new apigw.DomainName(stack, 'Domain', {
        domainName: 'api.example.com',
        certificate: cert,
        routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
      });

      expect(() => domain.addRoutingRule('Rule', {
        priority: 1,
        conditions: { headers: [{ header: 'x'.repeat(40), valueGlob: 'v' }] },
        action: { restApi: api },
      })).toThrow(/header name must be less than 40 characters/);
    });

    test('fails for empty header name', () => {
      const { stack, cert, api } = newStack();
      const domain = new apigw.DomainName(stack, 'Domain', {
        domainName: 'api.example.com',
        certificate: cert,
        routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
      });

      expect(() => domain.addRoutingRule('Rule', {
        priority: 1,
        conditions: { headers: [{ header: '', valueGlob: 'v' }] },
        action: { restApi: api },
      })).toThrow(/header name cannot be empty/);
    });

    // Verified against the service: an empty header glob value is rejected
    // ("Header value glob is required").
    test('fails for empty header glob value', () => {
      const { stack, cert, api } = newStack();
      const domain = new apigw.DomainName(stack, 'Domain', {
        domainName: 'api.example.com',
        certificate: cert,
        routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
      });

      expect(() => domain.addRoutingRule('Rule', {
        priority: 1,
        conditions: { headers: [{ header: 'x-version', valueGlob: '' }] },
        action: { restApi: api },
      })).toThrow(/header glob value cannot be empty/);
    });

    // Verified against the service: a wildcard in the header NAME is accepted
    // (despite the docs stating otherwise), so we must not reject it.
    test('allows a wildcard in the header name', () => {
      const { stack, cert, api } = newStack();
      const domain = new apigw.DomainName(stack, 'Domain', {
        domainName: 'api.example.com',
        certificate: cert,
        routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
      });

      expect(() => domain.addRoutingRule('Rule', {
        priority: 1,
        conditions: { headers: [{ header: 'x-*', valueGlob: 'v' }] },
        action: { restApi: api },
      })).not.toThrow();
    });

    test.each(['a*b', '*a*b*', '**'])('fails for invalid wildcard glob %s', (valueGlob) => {
      const { stack, cert, api } = newStack();
      const domain = new apigw.DomainName(stack, 'Domain', {
        domainName: 'api.example.com',
        certificate: cert,
        routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
      });

      expect(() => domain.addRoutingRule('Rule', {
        priority: 1,
        conditions: { headers: [{ header: 'x-version', valueGlob }] },
        action: { restApi: api },
      })).toThrow(/may only use a wildcard/);
    });

    test.each(['*prefix', 'suffix*', '*infix*', 'exact'])('accepts valid glob %s', (valueGlob) => {
      const { stack, cert, api } = newStack();
      const domain = new apigw.DomainName(stack, 'Domain', {
        domainName: 'api.example.com',
        certificate: cert,
        routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
      });

      expect(() => domain.addRoutingRule('Rule', {
        priority: 1,
        conditions: { headers: [{ header: 'x-version', valueGlob }] },
        action: { restApi: api },
      })).not.toThrow();
    });

    // Verified against the service: an infix glob is valid up to 40 chars total
    // (including the surrounding wildcards); 41 is rejected.
    test('accepts an infix glob of exactly 40 characters total', () => {
      const { stack, cert, api } = newStack();
      const domain = new apigw.DomainName(stack, 'Domain', {
        domainName: 'api.example.com',
        certificate: cert,
        routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
      });
      const valueGlob = `*${'a'.repeat(38)}*`; // 40 total

      expect(() => domain.addRoutingRule('Rule', {
        priority: 1,
        conditions: { headers: [{ header: 'x-version', valueGlob }] },
        action: { restApi: api },
      })).not.toThrow();
    });

    test('fails for an infix glob longer than 40 characters total', () => {
      const { stack, cert, api } = newStack();
      const domain = new apigw.DomainName(stack, 'Domain', {
        domainName: 'api.example.com',
        certificate: cert,
        routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
      });
      const valueGlob = `*${'a'.repeat(39)}*`; // 41 total

      expect(() => domain.addRoutingRule('Rule', {
        priority: 1,
        conditions: { headers: [{ header: 'x-version', valueGlob }] },
        action: { restApi: api },
      })).toThrow(/infix match must be at most 40 characters/);
    });
  });

  test('uses explicit stage when provided', () => {
    // GIVEN
    const { stack, cert, api } = newStack();
    const deployment = new apigw.Deployment(stack, 'Deploy', { api });
    const stage = new apigw.Stage(stack, 'CustomStage', { deployment, stageName: 'beta' });
    const domain = new apigw.DomainName(stack, 'Domain', {
      domainName: 'api.example.com',
      certificate: cert,
      routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
    });

    // WHEN
    domain.addRoutingRule('Rule', {
      priority: 1,
      action: { restApi: api, stage },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::RoutingRule', {
      Actions: [{ InvokeApi: { Stage: { Ref: Match.stringLikeRegexp('CustomStage') } } }],
    });
  });

  // Verified against the service: the CloudFormation handler rejects stripBasePath
  // without a base path condition ("Only one basePath is supported to use StripBasePath").
  test('fails when stripBasePath is set without a basePath condition', () => {
    const { stack, cert, api } = newStack();
    const domain = new apigw.DomainName(stack, 'Domain', {
      domainName: 'api.example.com',
      certificate: cert,
      routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
    });

    expect(() => domain.addRoutingRule('Rule', {
      priority: 1,
      conditions: { headers: [{ header: 'x-version', valueGlob: 'v2' }] },
      action: { restApi: api, stripBasePath: true },
    })).toThrow(/stripBasePath can only be set when the routing rule has a basePath condition/);
  });

  test('allows stripBasePath together with a basePath condition', () => {
    const { stack, cert, api } = newStack();
    const domain = new apigw.DomainName(stack, 'Domain', {
      domainName: 'api.example.com',
      certificate: cert,
      routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
    });

    expect(() => domain.addRoutingRule('Rule', {
      priority: 1,
      conditions: { basePath: 'users' },
      action: { restApi: api, stripBasePath: true },
    })).not.toThrow();
  });
});
