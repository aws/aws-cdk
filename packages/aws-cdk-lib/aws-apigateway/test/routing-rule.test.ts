import { Template } from '../../assertions';
import * as acm from '../../aws-certificatemanager';
import { Stack } from '../../core';
import * as apigw from '../lib';

describe('RoutingRule', () => {
  test('creates AWS::ApiGatewayV2::RoutingRule with path condition', () => {
    const stack = new Stack();
    const cert = acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:111:certificate/11');
    const api = new apigw.RestApi(stack, 'Api');
    api.root.addMethod('GET');

    const domain = new apigw.DomainName(stack, 'Domain', {
      domainName: 'api.example.com',
      certificate: cert,
      endpointType: apigw.EndpointType.REGIONAL,
      routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
    });

    domain.addRoutingRule('UsersRule', {
      priority: 100,
      conditions: { basePaths: ['users'] },
      action: {
        restApi: api,
        stripBasePath: true,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::DomainName', {
      DomainName: 'api.example.com',
      RoutingMode: 'ROUTING_RULE_ONLY',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::RoutingRule', {
      Priority: 100,
      Conditions: [
        {
          MatchBasePaths: { AnyOf: ['users'] },
        },
      ],
      Actions: [
        {
          InvokeApi: {
            ApiId: { Ref: 'Api49610EDF' },
            Stage: { Ref: 'ApiDeploymentStageprodE1054AF0' },
            StripBasePath: true,
          },
        },
      ],
    });
  });

  test('creates routing rule with header condition', () => {
    const stack = new Stack();
    const cert = acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:111:certificate/11');
    const api = new apigw.RestApi(stack, 'Api');
    api.root.addMethod('GET');

    const domain = new apigw.DomainName(stack, 'Domain', {
      domainName: 'api.example.com',
      certificate: cert,
      endpointType: apigw.EndpointType.REGIONAL,
      routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
    });

    domain.addRoutingRule('HeaderRule', {
      priority: 50,
      conditions: {
        headers: [{ header: 'x-api-version', valueGlob: 'v2' }],
      },
      action: { restApi: api },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::RoutingRule', {
      Priority: 50,
      Conditions: [
        {
          MatchHeaders: {
            AnyOf: [{ Header: 'x-api-version', ValueGlob: 'v2' }],
          },
        },
      ],
    });
  });

  test('creates routing rule with base path and headers (AND)', () => {
    const stack = new Stack();
    const cert = acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:111:certificate/11');
    const api = new apigw.RestApi(stack, 'Api');
    api.root.addMethod('GET');

    const domain = new apigw.DomainName(stack, 'Domain', {
      domainName: 'api.example.com',
      certificate: cert,
      endpointType: apigw.EndpointType.REGIONAL,
      routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
    });

    domain.addRoutingRule('CombinedRule', {
      priority: 75,
      conditions: {
        basePaths: ['orders'],
        headers: [{ header: 'x-api-version', valueGlob: 'v2' }],
      },
      action: { restApi: api, stripBasePath: true },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::RoutingRule', {
      Priority: 75,
      Conditions: [
        {
          MatchBasePaths: { AnyOf: ['orders'] },
          MatchHeaders: {
            AnyOf: [{ Header: 'x-api-version', ValueGlob: 'v2' }],
          },
        },
      ],
      Actions: [
        {
          InvokeApi: {
            StripBasePath: true,
          },
        },
      ],
    });
  });

  test('standalone RoutingRule with imported domain', () => {
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'Api');
    api.root.addMethod('GET');

    const domain = apigw.DomainName.fromDomainNameAttributes(stack, 'ImportedDomain', {
      domainName: 'api.example.com',
      domainNameAliasTarget: 'd-xxx.execute-api.us-east-1.amazonaws.com',
      domainNameAliasHostedZoneId: 'Z123',
    });

    new apigw.RoutingRule(stack, 'Rule', {
      domainName: domain,
      priority: 100,
      conditions: { basePaths: ['users'] },
      action: {
        restApi: api,
        stage: api.deploymentStage,
        stripBasePath: true,
      },
    });

    Template.fromStack(stack).resourceCountIs('AWS::ApiGateway::DomainName', 0);
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::RoutingRule', {
      Priority: 100,
      Conditions: [{ MatchBasePaths: { AnyOf: ['users'] } }],
    });
  });

  test('throws when priority out of range', () => {
    const stack = new Stack();
    const cert = acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:111:certificate/11');
    const api = new apigw.RestApi(stack, 'Api');
    api.root.addMethod('GET');
    const domain = new apigw.DomainName(stack, 'Domain', {
      domainName: 'api.example.com',
      certificate: cert,
      endpointType: apigw.EndpointType.REGIONAL,
      routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
    });

    expect(() => {
      domain.addRoutingRule('Bad', {
        priority: 1000000,
        action: { restApi: api },
      });
    }).toThrow(/priority must be between 0 and 999999/);
  });

  test('throws when header name too long', () => {
    const stack = new Stack();
    const cert = acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:111:certificate/11');
    const api = new apigw.RestApi(stack, 'Api');
    api.root.addMethod('GET');
    const domain = new apigw.DomainName(stack, 'Domain', {
      domainName: 'api.example.com',
      certificate: cert,
      endpointType: apigw.EndpointType.REGIONAL,
      routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
    });

    expect(() => {
      domain.addRoutingRule('Bad', {
        priority: 100,
        conditions: {
          headers: [{ header: 'x'.repeat(41), valueGlob: 'v2' }],
        },
        action: { restApi: api },
      });
    }).toThrow(/header name must be at most 40/);
  });

  test('throws when more than 2 header conditions', () => {
    const stack = new Stack();
    const cert = acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:111:certificate/11');
    const api = new apigw.RestApi(stack, 'Api');
    api.root.addMethod('GET');
    const domain = new apigw.DomainName(stack, 'Domain', {
      domainName: 'api.example.com',
      certificate: cert,
      endpointType: apigw.EndpointType.REGIONAL,
      routingMode: apigw.RoutingMode.ROUTING_RULE_ONLY,
    });

    expect(() => {
      domain.addRoutingRule('Bad', {
        priority: 100,
        conditions: {
          headers: [
            { header: 'a', valueGlob: '1' },
            { header: 'b', valueGlob: '2' },
            { header: 'c', valueGlob: '3' },
          ],
        },
        action: { restApi: api },
      });
    }).toThrow(/at most 2 matchHeaders conditions/);
  });
});
