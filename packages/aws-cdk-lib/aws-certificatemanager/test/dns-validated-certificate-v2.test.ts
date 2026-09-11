import { Template, Match } from '../../assertions';
import { Distribution } from '../../aws-cloudfront';
import { HttpOrigin } from '../../aws-cloudfront-origins';
import { HostedZone, PublicHostedZone } from '../../aws-route53';
import { App, CfnOutput, CfnResource, Duration, RemovalPolicy, Stack, Token } from '../../core';
import { DnsValidatedCertificateV2 } from '../lib';

test('creates certificate in us-east-1 support stack by default', () => {
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'eu-west-1' },
  });
  const hostedZone = HostedZone.fromHostedZoneId(stack, 'HostedZone', 'Z123456');

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
    CertificateArn: weakCertificateArnReference(stack),
  });
});

test('certificate arn can be used as an output in the containing stack', () => {
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'eu-west-1' },
  });
  const hostedZone = HostedZone.fromHostedZoneId(stack, 'HostedZone', 'Z123456');

  const certificate = new DnsValidatedCertificateV2(stack, 'Certificate', {
    domainName: 'test.example.com',
    hostedZone,
  });
  new CfnOutput(stack, 'CertificateArn', {
    value: certificate.certificateArn,
  });

  Template.fromStack(stack).hasOutput('CertificateArn', {
    Value: weakCertificateArnReference(stack),
  });
});

test('creates certificate in containing stack when the target region is the containing stack region', () => {
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'us-east-1' },
  });
  const hostedZone = HostedZone.fromHostedZoneId(stack, 'HostedZone', 'Z123456');

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
  const hostedZone = HostedZone.fromHostedZoneId(stack, 'HostedZone', 'Z123456');

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
  const hostedZone = HostedZone.fromHostedZoneId(stack, 'HostedZone', 'Z123456');

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
  const hostedZone = HostedZone.fromHostedZoneId(stack, 'HostedZone', 'Z123456');

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
  const hostedZone = HostedZone.fromHostedZoneId(stack, 'HostedZone', 'Z123456');

  new DnsValidatedCertificateV2(stack, 'Certificate', {
    domainName: 'test.example.com',
    hostedZone,
    stackId: 'CertificateStack',
  });

  expect(app.node.tryFindChild('CertificateStack')).toBeInstanceOf(Stack);
});

test('throws when custom support stack id resolves to a stack in another region', () => {
  const app = new App();
  new Stack(app, 'CertificateStack', {
    env: { account: '111111111111', region: 'us-west-2' },
  });
  const stack = new Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'eu-west-1' },
  });
  const hostedZone = HostedZone.fromHostedZoneId(stack, 'HostedZone', 'Z123456');

  expect(() => new DnsValidatedCertificateV2(stack, 'Certificate', {
    domainName: 'test.example.com',
    hostedZone,
    stackId: 'CertificateStack',
  })).toThrow(/must be in region "us-east-1", got "us-west-2"/);
});

test('throws when custom support stack id resolves to a stack in another account', () => {
  const app = new App();
  new Stack(app, 'CertificateStack', {
    env: { account: '222222222222', region: 'us-east-1' },
  });
  const stack = new Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'eu-west-1' },
  });
  const hostedZone = HostedZone.fromHostedZoneId(stack, 'HostedZone', 'Z123456');

  expect(() => new DnsValidatedCertificateV2(stack, 'Certificate', {
    domainName: 'test.example.com',
    hostedZone,
    stackId: 'CertificateStack',
  })).toThrow(/must be in account "111111111111", got "222222222222"/);
});

test('can tag the certificate in the support stack', () => {
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'eu-west-1' },
  });
  const hostedZone = HostedZone.fromHostedZoneId(stack, 'HostedZone', 'Z123456');

  new DnsValidatedCertificateV2(stack, 'Certificate', {
    domainName: 'test.example.com',
    hostedZone,
    tags: {
      application: 'edge',
      costCenter: 'web',
    },
  });

  Template.fromStack(getCertificateStack(app, stack)).hasResourceProperties('AWS::CertificateManager::Certificate', {
    Tags: Match.arrayWith([
      { Key: 'application', Value: 'edge' },
      { Key: 'costCenter', Value: 'web' },
    ]),
  });
});

test('can tag the certificate in the containing stack', () => {
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'us-east-1' },
  });
  const hostedZone = HostedZone.fromHostedZoneId(stack, 'HostedZone', 'Z123456');

  new DnsValidatedCertificateV2(stack, 'Certificate', {
    domainName: 'test.example.com',
    hostedZone,
    tags: {
      application: 'edge',
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
    Tags: Match.arrayWith([
      { Key: 'application', Value: 'edge' },
    ]),
  });
});

test('certificate name takes precedence over the Name tag', () => {
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'eu-west-1' },
  });
  const hostedZone = HostedZone.fromHostedZoneId(stack, 'HostedZone', 'Z123456');

  new DnsValidatedCertificateV2(stack, 'Certificate', {
    domainName: 'test.example.com',
    hostedZone,
    certificateName: 'FriendlyCertificateName',
    tags: {
      Name: 'IgnoredNameTag',
      application: 'edge',
    },
  });

  Template.fromStack(getCertificateStack(app, stack)).hasResourceProperties('AWS::CertificateManager::Certificate', {
    Tags: Match.arrayWith([
      { Key: 'application', Value: 'edge' },
      { Key: 'Name', Value: 'FriendlyCertificateName' },
    ]),
  });
  Template.fromStack(getCertificateStack(app, stack)).hasResourceProperties('AWS::CertificateManager::Certificate', {
    Tags: Match.not(Match.arrayWith([
      { Key: 'Name', Value: 'IgnoredNameTag' },
    ])),
  });
});

test('throws for cross-region certificates when hosted zone id is unresolved', () => {
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'eu-west-1' },
  });
  const hostedZone = new PublicHostedZone(stack, 'HostedZone', {
    zoneName: 'example.com',
  });

  expect(() => new DnsValidatedCertificateV2(stack, 'Certificate', {
    domainName: 'test.example.com',
    hostedZone,
  })).toThrow(/require a concrete hostedZoneId/);
});

test('throws for cross-partition certificate references', () => {
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'cn-north-1' },
  });
  const hostedZone = HostedZone.fromHostedZoneId(stack, 'HostedZone', 'Z123456');

  expect(() => new DnsValidatedCertificateV2(stack, 'Certificate', {
    domainName: 'test.example.com',
    hostedZone,
  })).toThrow(/cross-partition references are not supported/);
});

test('adds validation error on domain mismatch when hosted zone name is available', () => {
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'eu-west-1' },
  });
  const hostedZone = HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
    hostedZoneId: 'Z123456',
    zoneName: 'hello.com',
  });

  new DnsValidatedCertificateV2(stack, 'Certificate', {
    domainName: 'example.com',
    hostedZone,
  });

  expect(() => Template.fromStack(stack)).toThrow(/DNS zone hello.com is not authoritative for certificate domain name example.com/);
});

test('adds validation error on subject alternative name mismatch when hosted zone name is available', () => {
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'eu-west-1' },
  });
  const hostedZone = HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
    hostedZoneId: 'Z123456',
    zoneName: 'example.com',
  });

  new DnsValidatedCertificateV2(stack, 'Certificate', {
    domainName: 'test.example.com',
    hostedZone,
    subjectAlternativeNames: ['test.hello.com'],
  });

  expect(() => Template.fromStack(stack)).toThrow(/DNS zone example.com is not authoritative for certificate domain name test.hello.com/);
});

test('does not add validation error when domain names differ only by case', () => {
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'eu-west-1' },
  });
  const hostedZone = HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
    hostedZoneId: 'Z123456',
    zoneName: 'example.com',
  });

  new DnsValidatedCertificateV2(stack, 'Certificate', {
    domainName: 'Test.Example.Com',
    hostedZone,
    subjectAlternativeNames: ['Api.Example.Com'],
  });

  Template.fromStack(stack);
});

test('does not try to validate unresolved tokens', () => {
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'eu-west-1' },
  });
  const hostedZone = HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
    hostedZoneId: 'Z123456',
    zoneName: Token.asString('example.com'),
  });

  new DnsValidatedCertificateV2(stack, 'Certificate', {
    domainName: 'test.example.com',
    hostedZone,
  });

  Template.fromStack(stack);
});

test('can set removal policy on the certificate in the support stack with props', () => {
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'eu-west-1' },
  });
  const hostedZone = HostedZone.fromHostedZoneId(stack, 'HostedZone', 'Z123456');

  new DnsValidatedCertificateV2(stack, 'Certificate', {
    domainName: 'test.example.com',
    hostedZone,
    removalPolicy: RemovalPolicy.RETAIN,
  });

  Template.fromStack(getCertificateStack(app, stack)).hasResource('AWS::CertificateManager::Certificate', {
    DeletionPolicy: 'Retain',
  });
});

test('can set removal policy on the certificate in the containing stack with props', () => {
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'us-east-1' },
  });
  const hostedZone = HostedZone.fromHostedZoneId(stack, 'HostedZone', 'Z123456');

  new DnsValidatedCertificateV2(stack, 'Certificate', {
    domainName: 'test.example.com',
    hostedZone,
    removalPolicy: RemovalPolicy.RETAIN,
  });

  Template.fromStack(stack).hasResource('AWS::CertificateManager::Certificate', {
    DeletionPolicy: 'Retain',
  });
});

test('can set removal policy on the certificate in the support stack', () => {
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'eu-west-1' },
  });
  const hostedZone = HostedZone.fromHostedZoneId(stack, 'HostedZone', 'Z123456');

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
  const hostedZone = HostedZone.fromHostedZoneId(stack, 'HostedZone', 'Z123456');

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
  const hostedZone = HostedZone.fromHostedZoneId(stack, 'HostedZone', 'Z123456');
  const certificate = new DnsValidatedCertificateV2(stack, 'Certificate', {
    domainName: 'test.example.com',
    hostedZone,
  });

  new Distribution(stack, 'Distribution', {
    defaultBehavior: {
      origin: new HttpOrigin('example.com'),
    },
    domainNames: ['test.example.com'],
    certificate,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      ViewerCertificate: {
        AcmCertificateArn: weakCertificateArnReference(stack),
        SslSupportMethod: 'sni-only',
      },
    },
  });
});

function getCertificateStack(app: App, stack: Stack, region = 'us-east-1'): Stack {
  return app.node.findChild(`dns-validated-certificate-stack-${stack.node.addr}-${region}`) as Stack;
}

function weakCertificateArnReference(stack: Stack, region = 'us-east-1') {
  return {
    'Fn::Join': [
      '',
      Match.arrayWith([
        {
          'Fn::GetStackOutput': {
            StackName: Match.stringLikeRegexp(`dns-validated-certificate-stack-${stack.node.addr}-${region}`),
            Region: region,
            OutputName: Match.anyValue(),
          },
        },
      ]),
    ],
  };
}
