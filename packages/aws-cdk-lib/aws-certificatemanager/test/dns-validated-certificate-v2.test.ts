import { Template, Match } from '../../assertions';
import * as cloudfront from '../../aws-cloudfront';
import * as origins from '../../aws-cloudfront-origins';
import * as route53 from '../../aws-route53';
import { App, CfnResource, Duration, RemovalPolicy, Stack, Token } from '../../core';
import { DnsValidatedCertificateV2 } from '../lib';

test('creates certificate in us-east-1 support stack by default', () => {
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'eu-west-1' },
  });
  const hostedZone = route53.HostedZone.fromHostedZoneId(stack, 'HostedZone', 'Z123456');

  const certificate = new DnsValidatedCertificateV2(stack, 'Certificate', {
    domainName: 'test.example.com',
    hostedZone,
    subjectAlternativeNames: ['test2.example.com'],
  });
  new CfnResource(stack, 'Consumer', {
    type: 'AWS::Test::Consumer',
    properties: {
      CertificateArn: certificate.certificateArn,
    },
  });

  const certificateStack = getCertificateStack(app, stack);
  Template.fromStack(certificateStack).hasResourceProperties('AWS::CertificateManager::Certificate', {
    DomainName: 'test.example.com',
    SubjectAlternativeNames: ['test2.example.com'],
    DomainValidationOptions: Match.arrayWith([{
      DomainName: 'test.example.com',
      HostedZoneId: 'Z123456',
    }]),
    ValidationMethod: 'DNS',
  });
  Template.fromStack(stack).hasResourceProperties('AWS::Test::Consumer', {
    CertificateArn: {
      'Fn::GetStackOutput': {
        StackName: Match.stringLikeRegexp(`dns-validated-certificate-stack-${stack.node.addr}-us-east-1`),
        Region: 'us-east-1',
        OutputName: Match.stringLikeRegexp('Certificate.*Arn'),
      },
    },
  });
});

test('creates certificate in containing stack when the target region is the containing stack region', () => {
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'us-east-1' },
  });
  const hostedZone = route53.HostedZone.fromHostedZoneId(stack, 'HostedZone', 'Z123456');

  new DnsValidatedCertificateV2(stack, 'Certificate', {
    domainName: 'test.example.com',
    hostedZone,
  });

  expect(app.node.tryFindChild(`dns-validated-certificate-stack-${stack.node.addr}-us-east-1`)).toBeUndefined();
  Template.fromStack(stack).resourceCountIs('AWS::CertificateManager::Certificate', 1);
});

test('can create certificate in an explicit non-default region', () => {
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'eu-west-1' },
  });
  const hostedZone = route53.HostedZone.fromHostedZoneId(stack, 'HostedZone', 'Z123456');

  new DnsValidatedCertificateV2(stack, 'Certificate', {
    domainName: 'test.example.com',
    hostedZone,
    region: 'us-west-2',
  });

  expect(getCertificateStack(app, stack, 'us-west-2').region).toEqual('us-west-2');
});

test('support stack inherits containing stack account and stack tags', () => {
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'eu-west-1' },
    tags: { team: 'edge' },
  });
  const hostedZone = route53.HostedZone.fromHostedZoneId(stack, 'HostedZone', 'Z123456');

  new DnsValidatedCertificateV2(stack, 'Certificate', {
    domainName: 'test.example.com',
    hostedZone,
  });

  const certificateStack = getCertificateStack(app, stack);
  expect(certificateStack.account).toEqual('111111111111');
  expect(certificateStack.tags.tagValues()).toEqual({ team: 'edge' });
});

test('reuses one support stack for multiple certificates in the same containing stack and region', () => {
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'eu-west-1' },
  });
  const hostedZone = route53.HostedZone.fromHostedZoneId(stack, 'HostedZone', 'Z123456');

  new DnsValidatedCertificateV2(stack, 'FirstCertificate', {
    domainName: 'first.example.com',
    hostedZone,
  });
  new DnsValidatedCertificateV2(stack, 'SecondCertificate', {
    domainName: 'second.example.com',
    hostedZone,
  });

  const certificateStack = getCertificateStack(app, stack);
  Template.fromStack(certificateStack).resourceCountIs('AWS::CertificateManager::Certificate', 2);
});

test('can customize support stack id', () => {
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'eu-west-1' },
  });
  const hostedZone = route53.HostedZone.fromHostedZoneId(stack, 'HostedZone', 'Z123456');

  new DnsValidatedCertificateV2(stack, 'Certificate', {
    domainName: 'test.example.com',
    hostedZone,
    stackId: 'CertificateStack',
  });

  expect(app.node.tryFindChild('CertificateStack')).toBeInstanceOf(Stack);
});

test('throws for cross-region certificates when hosted zone id is unresolved', () => {
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'eu-west-1' },
  });
  const hostedZone = new route53.PublicHostedZone(stack, 'HostedZone', {
    zoneName: 'example.com',
  });

  expect(() => new DnsValidatedCertificateV2(stack, 'Certificate', {
    domainName: 'test.example.com',
    hostedZone,
  })).toThrow(/requires a concrete hostedZoneId/);
});

test('adds validation error on domain mismatch when hosted zone name is available', () => {
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'eu-west-1' },
  });
  const hostedZone = route53.HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
    hostedZoneId: 'Z123456',
    zoneName: 'hello.com',
  });

  new DnsValidatedCertificateV2(stack, 'Certificate', {
    domainName: 'example.com',
    hostedZone,
  });

  expect(() => Template.fromStack(stack)).toThrow(/DNS zone hello.com is not authoritative for certificate domain name example.com/);
});

test('does not try to validate unresolved tokens', () => {
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'eu-west-1' },
  });
  const hostedZone = route53.HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
    hostedZoneId: 'Z123456',
    zoneName: Token.asString('example.com'),
  });

  new DnsValidatedCertificateV2(stack, 'Certificate', {
    domainName: 'test.example.com',
    hostedZone,
  });

  Template.fromStack(stack);
});

test('can set removal policy on the certificate in the support stack', () => {
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'eu-west-1' },
  });
  const hostedZone = route53.HostedZone.fromHostedZoneId(stack, 'HostedZone', 'Z123456');

  const certificate = new DnsValidatedCertificateV2(stack, 'Certificate', {
    domainName: 'test.example.com',
    hostedZone,
  });
  certificate.applyRemovalPolicy(RemovalPolicy.RETAIN);

  Template.fromStack(getCertificateStack(app, stack)).hasResource('AWS::CertificateManager::Certificate', {
    DeletionPolicy: 'Retain',
  });
});

test('metricDaysToExpiry uses certificate region', () => {
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'eu-west-1' },
  });
  const hostedZone = route53.HostedZone.fromHostedZoneId(stack, 'HostedZone', 'Z123456');

  const certificate = new DnsValidatedCertificateV2(stack, 'Certificate', {
    domainName: 'test.example.com',
    hostedZone,
  });

  expect(stack.resolve(certificate.metricDaysToExpiry().toMetricConfig())).toEqual({
    metricStat: expect.objectContaining({
      dimensions: [{ name: 'CertificateArn', value: stack.resolve(certificate.certificateArn) }],
      metricName: 'DaysToExpiry',
      namespace: 'AWS/CertificateManager',
      period: stack.resolve(Duration.days(1)),
      region: 'us-east-1',
      regionOverride: 'us-east-1',
      statistic: 'Minimum',
    }),
    renderingProperties: expect.anything(),
  });
});

test('cloudfront distribution can consume cross-region certificate weak reference', () => {
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'eu-west-1' },
  });
  const hostedZone = route53.HostedZone.fromHostedZoneId(stack, 'HostedZone', 'Z123456');
  const certificate = new DnsValidatedCertificateV2(stack, 'Certificate', {
    domainName: 'test.example.com',
    hostedZone,
  });

  new cloudfront.Distribution(stack, 'Distribution', {
    defaultBehavior: {
      origin: new origins.HttpOrigin('example.com'),
    },
    domainNames: ['test.example.com'],
    certificate,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      ViewerCertificate: {
        AcmCertificateArn: {
          'Fn::GetStackOutput': {
            StackName: Match.stringLikeRegexp(`dns-validated-certificate-stack-${stack.node.addr}-us-east-1`),
            Region: 'us-east-1',
            OutputName: Match.stringLikeRegexp('Certificate.*Arn'),
          },
        },
        SslSupportMethod: 'sni-only',
      },
    },
  });
});

function getCertificateStack(app: App, stack: Stack, region = 'us-east-1'): Stack {
  return app.node.findChild(`dns-validated-certificate-stack-${stack.node.addr}-${region}`) as Stack;
}
