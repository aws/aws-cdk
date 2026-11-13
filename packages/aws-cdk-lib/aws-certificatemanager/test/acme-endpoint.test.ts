import { Match, Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as route53 from '../../aws-route53';
import { Duration, Stack, Tags } from '../../core';
import {
  AcmeAuthorizationBehavior,
  AcmeCertificateAuthority,
  AcmeDomainValidation,
  AcmeEndpoint,
  AcmeExternalAccountBinding,
  KeyAlgorithm,
} from '../lib';

const ENDPOINT_ARN = 'arn:aws:acm:us-east-1:123456789012:acme-endpoint/11111111-2222-3333-4444-555555555555';

describe('AcmeEndpoint', () => {
  test('defaults to a public certificate authority with pre-approved authorization', () => {
    const stack = new Stack();

    new AcmeEndpoint(stack, 'Endpoint');

    Template.fromStack(stack).templateMatches({
      Resources: {
        EndpointEEF1FD8F: {
          Type: 'AWS::CertificateManager::AcmeEndpoint',
          Properties: {
            AuthorizationBehavior: 'PRE_APPROVED',
            CertificateAuthority: { PublicCertificateAuthority: {} },
          },
        },
      },
    });
  });

  test('renders all properties', () => {
    const stack = new Stack();

    new AcmeEndpoint(stack, 'Endpoint', {
      certificateAuthority: AcmeCertificateAuthority.public({
        allowedKeyAlgorithms: [KeyAlgorithm.EC_PRIME256V1, KeyAlgorithm.RSA_2048],
      }),
      authorizationBehavior: AcmeAuthorizationBehavior.PRE_APPROVED,
      contactRequired: true,
      certificateTags: { team: 'pki' },
      tags: { env: 'test' },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::AcmeEndpoint', {
      AuthorizationBehavior: 'PRE_APPROVED',
      CertificateAuthority: {
        PublicCertificateAuthority: { AllowedKeyAlgorithms: ['EC_prime256v1', 'RSA_2048'] },
      },
      Contact: 'REQUIRED',
      CertificateTags: [{ Key: 'team', Value: 'pki' }],
      Tags: [{ Key: 'env', Value: 'test' }],
    });
  });

  test.each([KeyAlgorithm.RSA_1024, KeyAlgorithm.RSA_3072, KeyAlgorithm.RSA_4096, KeyAlgorithm.EC_SECP521R1])(
    'fails for unsupported key algorithm %s', (algorithm) => {
      expect(() => AcmeCertificateAuthority.public({ allowedKeyAlgorithms: [KeyAlgorithm.EC_PRIME256V1, algorithm] }))
        .toThrow(`key algorithm ${JSON.stringify(algorithm.name)} is not supported by ACME endpoints, use one of RSA_2048, EC_prime256v1, EC_secp384r1`);
    });

  test('accepts all supported key algorithms', () => {
    const stack = new Stack();

    new AcmeEndpoint(stack, 'Endpoint', {
      certificateAuthority: AcmeCertificateAuthority.public({
        allowedKeyAlgorithms: [KeyAlgorithm.RSA_2048, KeyAlgorithm.EC_PRIME256V1, KeyAlgorithm.EC_SECP384R1],
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::AcmeEndpoint', {
      CertificateAuthority: {
        PublicCertificateAuthority: { AllowedKeyAlgorithms: ['RSA_2048', 'EC_prime256v1', 'EC_secp384r1'] },
      },
    });
  });

  test('omits AllowedKeyAlgorithms for an empty list', () => {
    const stack = new Stack();

    new AcmeEndpoint(stack, 'Endpoint', {
      certificateAuthority: AcmeCertificateAuthority.public({ allowedKeyAlgorithms: [] }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::AcmeEndpoint', {
      CertificateAuthority: { PublicCertificateAuthority: Match.objectEquals({}) },
    });
  });

  test('contactRequired false renders NOT_REQUIRED', () => {
    const stack = new Stack();

    new AcmeEndpoint(stack, 'Endpoint', { contactRequired: false });

    Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::AcmeEndpoint', {
      Contact: 'NOT_REQUIRED',
    });
  });

  test('omits contact and tags when not set', () => {
    const stack = new Stack();

    new AcmeEndpoint(stack, 'Endpoint', { certificateTags: {}, tags: {} });

    Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::AcmeEndpoint', {
      Contact: Match.absent(),
      CertificateTags: Match.absent(),
      Tags: Match.absent(),
    });
  });

  test('exposes the endpoint ARN and URL attributes', () => {
    const stack = new Stack();

    const endpoint = new AcmeEndpoint(stack, 'Endpoint');

    expect(stack.resolve(endpoint.acmeEndpointArn)).toEqual({ 'Fn::GetAtt': ['EndpointEEF1FD8F', 'AcmeEndpointArn'] });
    expect(stack.resolve(endpoint.endpointUrl)).toEqual({ 'Fn::GetAtt': ['EndpointEEF1FD8F', 'EndpointUrl'] });
    expect(stack.resolve(endpoint.acmeEndpointRef.acmeEndpointArn)).toEqual({ 'Fn::GetAtt': ['EndpointEEF1FD8F', 'AcmeEndpointArn'] });
  });

  test('can be tagged with Tags.of', () => {
    const stack = new Stack();

    const endpoint = new AcmeEndpoint(stack, 'Endpoint');
    Tags.of(endpoint).add('owner', 'platform');

    Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::AcmeEndpoint', {
      Tags: [{ Key: 'owner', Value: 'platform' }],
    });
  });

  describe('import', () => {
    test('fromAcmeEndpointArn', () => {
      const stack = new Stack();

      const endpoint = AcmeEndpoint.fromAcmeEndpointArn(stack, 'Endpoint', ENDPOINT_ARN);

      expect(endpoint.acmeEndpointArn).toEqual(ENDPOINT_ARN);
      expect(endpoint.acmeEndpointRef.acmeEndpointArn).toEqual(ENDPOINT_ARN);
      expect(endpoint.env.region).toEqual('us-east-1');
      expect(endpoint.env.account).toEqual('123456789012');
    });

    test('fails to access endpointUrl when imported by ARN', () => {
      const stack = new Stack();

      const endpoint = AcmeEndpoint.fromAcmeEndpointArn(stack, 'Endpoint', ENDPOINT_ARN);

      expect(() => endpoint.endpointUrl).toThrow(/the endpoint URL is not available on an ACME endpoint imported by ARN/);
    });

    test('fromAcmeEndpointAttributes', () => {
      const stack = new Stack();
      const url = 'https://acm-acme-enroll.us-east-1.api.aws/11111111-2222-3333-4444-555555555555/directory';

      const endpoint = AcmeEndpoint.fromAcmeEndpointAttributes(stack, 'Endpoint', {
        acmeEndpointArn: ENDPOINT_ARN,
        endpointUrl: url,
      });

      expect(endpoint.acmeEndpointArn).toEqual(ENDPOINT_ARN);
      expect(endpoint.endpointUrl).toEqual(url);
    });

    test('imported endpoint can create domain validations and bindings', () => {
      const stack = new Stack();

      const endpoint = AcmeEndpoint.fromAcmeEndpointArn(stack, 'Endpoint', ENDPOINT_ARN);
      endpoint.addDomainValidation('Example', { domainName: 'example.com' });
      endpoint.addExternalAccountBinding('Binding');

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::CertificateManager::AcmeDomainValidation', {
        AcmeEndpointArn: ENDPOINT_ARN,
      });
      template.hasResourceProperties('AWS::CertificateManager::AcmeExternalAccountBinding', {
        AcmeEndpointArn: ENDPOINT_ARN,
      });
    });
  });

  describe('metrics', () => {
    test('metricCertificateIssuanceSuccess', () => {
      const stack = new Stack();
      const endpoint = new AcmeEndpoint(stack, 'Endpoint');

      const metric = endpoint.metrics.metricCertificateIssuanceSuccess();

      expect(metric.namespace).toEqual('AWS/CertificateManager');
      expect(metric.metricName).toEqual('CertificateIssuanceSuccess');
      expect(metric.statistic).toEqual('Sum');
      expect(metric.period.toMinutes()).toEqual(5);
      expect(stack.resolve(metric.dimensions)).toEqual({
        AcmeEndpointArn: { 'Fn::GetAtt': ['EndpointEEF1FD8F', 'AcmeEndpointArn'] },
      });
    });

    test('metricCertificateIssuanceFailed with overrides', () => {
      const stack = new Stack();
      const endpoint = AcmeEndpoint.fromAcmeEndpointArn(stack, 'Endpoint', ENDPOINT_ARN);

      const metric = endpoint.metrics.metricCertificateIssuanceFailed({ period: Duration.hours(1) });

      expect(metric.metricName).toEqual('CertificateIssuanceFailed');
      expect(metric.period.toHours()).toEqual(1);
      expect(metric.dimensions).toEqual({ AcmeEndpointArn: ENDPOINT_ARN });
    });

    test('dimensionsMap in props cannot replace the endpoint dimension', () => {
      const stack = new Stack();
      const endpoint = AcmeEndpoint.fromAcmeEndpointArn(stack, 'Endpoint', ENDPOINT_ARN);

      const metric = endpoint.metrics.metric('CertificateIssuanceSuccess', {
        dimensionsMap: { AcmeEndpointArn: 'arn:aws:acm:us-east-1:123456789012:acme-endpoint/other' },
      });

      expect(metric.dimensions).toEqual({ AcmeEndpointArn: ENDPOINT_ARN });
    });
  });
});

describe('AcmeDomainValidation', () => {
  test('minimal domain validation', () => {
    const stack = new Stack();
    const endpoint = new AcmeEndpoint(stack, 'Endpoint');

    endpoint.addDomainValidation('Example', { domainName: 'example.com' });

    Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::AcmeDomainValidation', {
      AcmeEndpointArn: { 'Fn::GetAtt': ['EndpointEEF1FD8F', 'AcmeEndpointArn'] },
      DomainName: 'example.com',
      PrevalidationOptions: {
        DnsPrevalidation: {
          HostedZoneId: Match.absent(),
          DomainScope: Match.absent(),
        },
      },
    });
  });

  test('renders hosted zone, domain scope and tags', () => {
    const stack = new Stack();
    const endpoint = new AcmeEndpoint(stack, 'Endpoint');
    const zone = route53.HostedZone.fromHostedZoneId(stack, 'Zone', 'Z0123456789ABCDEFGHIJ');

    new AcmeDomainValidation(stack, 'Example', {
      endpoint,
      domainName: 'example.com',
      hostedZone: zone,
      allowExactDomain: true,
      allowSubdomains: true,
      allowWildcards: false,
      tags: { env: 'test' },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::AcmeDomainValidation', {
      DomainName: 'example.com',
      PrevalidationOptions: {
        DnsPrevalidation: {
          HostedZoneId: 'Z0123456789ABCDEFGHIJ',
          DomainScope: { ExactDomain: 'ENABLED', Subdomains: 'ENABLED', Wildcards: 'DISABLED' },
        },
      },
      Tags: [{ Key: 'env', Value: 'test' }],
    });
  });

  test('only renders the domain scope settings that are set', () => {
    const stack = new Stack();
    const endpoint = new AcmeEndpoint(stack, 'Endpoint');

    endpoint.addDomainValidation('Example', { domainName: 'example.com', allowWildcards: false });

    Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::AcmeDomainValidation', {
      PrevalidationOptions: {
        DnsPrevalidation: {
          DomainScope: Match.objectEquals({ Wildcards: 'DISABLED' }),
        },
      },
    });
  });

  test('exposes the ARN attribute', () => {
    const stack = new Stack();
    const endpoint = new AcmeEndpoint(stack, 'Endpoint');

    const validation = endpoint.addDomainValidation('Example', { domainName: 'example.com' });

    expect(stack.resolve(validation.acmeDomainValidationArn)).toEqual({
      'Fn::GetAtt': [expect.stringMatching(/^EndpointExample/), 'Arn'],
    });
    expect(stack.resolve(validation.acmeDomainValidationRef.acmeDomainValidationArn))
      .toEqual(stack.resolve(validation.acmeDomainValidationArn));
  });

  test('fromAcmeDomainValidationArn', () => {
    const stack = new Stack();
    const arn = `${ENDPOINT_ARN}/acme-domain-validation/66666666-7777-8888-9999-000000000000`;

    const validation = AcmeDomainValidation.fromAcmeDomainValidationArn(stack, 'Validation', arn);

    expect(validation.acmeDomainValidationArn).toEqual(arn);
    expect(validation.acmeDomainValidationRef.acmeDomainValidationArn).toEqual(arn);
  });
});

describe('AcmeExternalAccountBinding', () => {
  test('creates a default role trusted by the ACME service', () => {
    const stack = new Stack();
    const endpoint = new AcmeEndpoint(stack, 'Endpoint');

    endpoint.addExternalAccountBinding('Binding');

    const template = Template.fromStack(stack);
    const trustConditions = {
      StringLikeIfExists: { 'sts:SourceIdentity': 'acm-acme-*' },
      StringEquals: { 'aws:SourceAccount': { Ref: 'AWS::AccountId' } },
    };
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: ['sts:AssumeRole', 'sts:TagSession'],
            Effect: 'Allow',
            Principal: { Service: 'acm-acme.amazonaws.com' },
            Condition: trustConditions,
          },
          {
            Action: 'sts:SetSourceIdentity',
            Effect: 'Allow',
            Principal: { Service: 'acm-acme.amazonaws.com' },
            Condition: trustConditions,
          },
        ],
      },
    });
    template.hasResourceProperties('AWS::CertificateManager::AcmeExternalAccountBinding', {
      AcmeEndpointArn: { 'Fn::GetAtt': ['EndpointEEF1FD8F', 'AcmeEndpointArn'] },
      RoleArn: { 'Fn::GetAtt': [Match.stringLikeRegexp('^EndpointBindingRole'), 'Arn'] },
      Expiration: Match.absent(),
    });
  });

  test('default role may issue, tag and revoke ACME certificates only', () => {
    const stack = new Stack();
    const endpoint = new AcmeEndpoint(stack, 'Endpoint');

    endpoint.addExternalAccountBinding('Binding');

    const acmeOrigin = {
      StringEquals: {
        'acm:CertificateKeyPairOrigin': 'ACME',
        'aws:PrincipalTag/acme-endpoint-arn': { 'Fn::GetAtt': ['EndpointEEF1FD8F', 'AcmeEndpointArn'] },
      },
    };
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'acm:RequestCertificate',
            Effect: 'Allow',
            Resource: '*',
            Condition: acmeOrigin,
          },
          {
            Action: ['acm:AddTagsToCertificate', 'acm:RevokeCertificate'],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': ['', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':acm:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':certificate/*',
              ]],
            },
            Condition: acmeOrigin,
          },
        ],
      },
    });
  });

  test('uses the provided role without adding permissions', () => {
    const stack = new Stack();
    const endpoint = new AcmeEndpoint(stack, 'Endpoint');
    const role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/AcmeIssuance');

    const binding = new AcmeExternalAccountBinding(stack, 'Binding', { endpoint, role });

    expect(binding.role).toBe(role);
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::CertificateManager::AcmeExternalAccountBinding', {
      RoleArn: 'arn:aws:iam::123456789012:role/AcmeIssuance',
    });
    template.resourceCountIs('AWS::IAM::Role', 0);
    template.resourceCountIs('AWS::IAM::Policy', 0);
  });

  test('binding is created after its default role and the role policy', () => {
    const stack = new Stack();
    const endpoint = new AcmeEndpoint(stack, 'Endpoint');

    endpoint.addExternalAccountBinding('Binding');

    const template = Template.fromStack(stack);
    const roleId = Object.keys(template.findResources('AWS::IAM::Role'))[0];
    const policyId = Object.keys(template.findResources('AWS::IAM::Policy'))[0];
    const binding = Object.values(template.findResources('AWS::CertificateManager::AcmeExternalAccountBinding'))[0];
    expect(binding.DependsOn).toEqual(expect.arrayContaining([roleId, policyId]));
  });

  test('binding is created after a provided role and its policy in the same stack', () => {
    const stack = new Stack();
    const endpoint = new AcmeEndpoint(stack, 'Endpoint');
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.ServicePrincipal('acm-acme.amazonaws.com') });
    role.addToPrincipalPolicy(new iam.PolicyStatement({ actions: ['acm:RequestCertificate'], resources: ['*'] }));

    endpoint.addExternalAccountBinding('Binding', { role });

    const template = Template.fromStack(stack);
    const roleId = Object.keys(template.findResources('AWS::IAM::Role'))[0];
    const policyId = Object.keys(template.findResources('AWS::IAM::Policy'))[0];
    const binding = Object.values(template.findResources('AWS::CertificateManager::AcmeExternalAccountBinding'))[0];
    expect(binding.DependsOn).toEqual(expect.arrayContaining([roleId, policyId]));
  });

  test('uses a provided role created in the stack without adding permissions', () => {
    const stack = new Stack();
    const endpoint = new AcmeEndpoint(stack, 'Endpoint');
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.ServicePrincipal('acm-acme.amazonaws.com') });

    endpoint.addExternalAccountBinding('Binding', { role });

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::IAM::Policy', 0);
  });

  test('default role of a binding on an imported endpoint is scoped to that endpoint', () => {
    const stack = new Stack();
    const endpoint = AcmeEndpoint.fromAcmeEndpointArn(stack, 'Endpoint', ENDPOINT_ARN);

    endpoint.addExternalAccountBinding('Binding');

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'acm:RequestCertificate',
            Condition: {
              StringEquals: {
                'acm:CertificateKeyPairOrigin': 'ACME',
                'aws:PrincipalTag/acme-endpoint-arn': ENDPOINT_ARN,
              },
            },
          }),
        ]),
      },
    });
  });

  test.each([
    [Duration.days(30), 'DAYS', 30],
    [Duration.hours(48), 'DAYS', 2],
    [Duration.hours(36), 'HOURS', 36],
    [Duration.minutes(120), 'HOURS', 2],
    [Duration.minutes(90), 'MINUTES', 90],
    [Duration.seconds(60), 'MINUTES', 1],
  ])('renders expiration %s as %s', (expiration, type, value) => {
    const stack = new Stack();
    const endpoint = new AcmeEndpoint(stack, 'Endpoint');

    endpoint.addExternalAccountBinding('Binding', { expiration });

    Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::AcmeExternalAccountBinding', {
      Expiration: { Type: type, Value: value },
    });
  });

  test.each([Duration.seconds(30), Duration.seconds(90), Duration.millis(0)])('fails for expiration %s', (expiration) => {
    const stack = new Stack();
    const endpoint = new AcmeEndpoint(stack, 'Endpoint');

    expect(() => endpoint.addExternalAccountBinding('Binding', { expiration }))
      .toThrow(/expiration must be a whole number of minutes and at least 1 minute/);
  });

  test('renders tags', () => {
    const stack = new Stack();
    const endpoint = new AcmeEndpoint(stack, 'Endpoint');

    endpoint.addExternalAccountBinding('Binding', { tags: { team: 'web' } });

    Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::AcmeExternalAccountBinding', {
      Tags: [{ Key: 'team', Value: 'web' }],
    });
  });

  test('fromAcmeExternalAccountBindingArn', () => {
    const stack = new Stack();
    const arn = `${ENDPOINT_ARN}/acme-external-account-binding/66666666-7777-8888-9999-000000000000`;

    const binding = AcmeExternalAccountBinding.fromAcmeExternalAccountBindingArn(stack, 'Binding', arn);

    expect(binding.acmeExternalAccountBindingArn).toEqual(arn);
    expect(binding.acmeExternalAccountBindingRef.acmeExternalAccountBindingArn).toEqual(arn);
  });
});
