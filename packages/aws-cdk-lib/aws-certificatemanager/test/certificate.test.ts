import { Template, Match } from '../../assertions';
import * as route53 from '../../aws-route53';
import { Aws, Duration, Lazy, Stack } from '../../core';
import { Certificate, CertificateValidation, KeyAlgorithm } from '../lib';

test('apex domain selection by default', () => {
  const stack = new Stack();

  new Certificate(stack, 'Certificate', {
    domainName: 'test.example.com',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
    DomainName: 'test.example.com',
    DomainValidationOptions: [{
      DomainName: 'test.example.com',
      ValidationDomain: 'example.com',
    }],
  });
});

test('metricDaysToExpiry', () => {
  const stack = new Stack();

  const certificate = new Certificate(stack, 'Certificate', {
    domainName: 'test.example.com',
  });

  expect(stack.resolve(certificate.metricDaysToExpiry().toMetricConfig())).toEqual({
    metricStat: {
      dimensions: [{ name: 'CertificateArn', value: stack.resolve(certificate.certificateArn) }],
      metricName: 'DaysToExpiry',
      namespace: 'AWS/CertificateManager',
      period: Duration.days(1),
      statistic: 'Minimum',
    },
    renderingProperties: expect.anything(),
  });
});

test('validation domain can be overridden', () => {
  const stack = new Stack();

  new Certificate(stack, 'Certificate', {
    domainName: 'test.example.com',
    validation: CertificateValidation.fromEmail({
      'test.example.com': 'test.example.com',
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
    DomainValidationOptions: [{
      DomainName: 'test.example.com',
      ValidationDomain: 'test.example.com',
    }],
  });
});

test('export and import', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const c = Certificate.fromCertificateArn(stack, 'Imported', 'cert-arn');

  // THEN
  expect(c.certificateArn).toBe('cert-arn');
});

test('can configure validation method', () => {
  const stack = new Stack();

  new Certificate(stack, 'Certificate', {
    domainName: 'test.example.com',
    validation: CertificateValidation.fromDns(),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
    DomainName: 'test.example.com',
    ValidationMethod: 'DNS',
  });
});

test('throws when domain name is longer than 64 characters', () => {
  const stack = new Stack();

  expect(() => {
    new Certificate(stack, 'Certificate', {
      domainName: 'example.com'.repeat(7),
    });
  }).toThrow(/Domain name must be 64 characters or less/);
});

test('does not throw when domain name is longer than 64 characters with tokens', () => {
  const stack = new Stack();
  const embededToken = Aws.REGION;
  const baseDomain = 'a'.repeat(65-embededToken.length);
  const domainName = `${embededToken}${baseDomain}`;
  new Certificate(stack, 'Certificate', {
    domainName,
    validation: CertificateValidation.fromEmail({
      [domainName]: 'example.com',
    }),
  });

  const domainNameJoin = {
    'Fn::Join': [
      '',
      [
        {
          Ref: 'AWS::Region',
        },
        baseDomain,
      ],
    ],
  };
  Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
    DomainName: domainNameJoin,
    DomainValidationOptions: [{
      DomainName: domainNameJoin,
      ValidationDomain: 'example.com',
    }],
  });
});

test('accepts valid domain names', () => {
  const stack = new Stack();

  // Test standard domain
  new Certificate(stack, 'Certificate1', {
    domainName: 'example.com',
  });

  // Test subdomain
  new Certificate(stack, 'Certificate2', {
    domainName: 'sub.example.com',
  });

  // Test wildcard domain
  new Certificate(stack, 'Certificate3', {
    domainName: '*.example.com',
  });

  // Test multi-level subdomain
  new Certificate(stack, 'Certificate4', {
    domainName: 'deep.sub.example.com',
  });

  // Test single character labels
  new Certificate(stack, 'Certificate5', {
    domainName: 'a.b.com',
  });

  // Test numeric labels
  new Certificate(stack, 'Certificate6', {
    domainName: '123.example.com',
  });

  // Test mixed alphanumeric
  new Certificate(stack, 'Certificate7', {
    domainName: 'test123.example456.com',
  });

  // Test hyphens in middle of labels
  new Certificate(stack, 'Certificate8', {
    domainName: 'test-sub.example-domain.com',
  });

  // Test maximum label length (63 characters) - but keep total under 64
  new Certificate(stack, 'Certificate9', {
    domainName: 'a'.repeat(50) + '.example.com',
  });

  // Test wildcard with multi-level subdomain
  new Certificate(stack, 'Certificate10', {
    domainName: '*.deep.sub.example.com',
  });

  // Should not throw for any of these valid domains
});

test('throws when domain name format is invalid', () => {
  const stack = new Stack();

  // Test domain starting with hyphen
  expect(() => {
    new Certificate(stack, 'Certificate1', {
      domainName: '-example.com',
    });
  }).toThrow(/Domain name format is invalid/);

  // Test domain ending with hyphen
  expect(() => {
    new Certificate(stack, 'Certificate2', {
      domainName: 'example-.com',
    });
  }).toThrow(/Domain name format is invalid/);

  // Test label starting with hyphen
  expect(() => {
    new Certificate(stack, 'Certificate3', {
      domainName: 'sub.-example.com',
    });
  }).toThrow(/Domain name format is invalid/);

  // Test label ending with hyphen
  expect(() => {
    new Certificate(stack, 'Certificate4', {
      domainName: 'sub.example-.com',
    });
  }).toThrow(/Domain name format is invalid/);

  // Test domain with consecutive dots
  expect(() => {
    new Certificate(stack, 'Certificate5', {
      domainName: 'example..com',
    });
  }).toThrow(/Domain name format is invalid/);

  // Test domain ending with dot
  expect(() => {
    new Certificate(stack, 'Certificate6', {
      domainName: 'example.com.',
    });
  }).toThrow(/Domain name format is invalid/);

  // Test invalid wildcard (not at start)
  expect(() => {
    new Certificate(stack, 'Certificate7', {
      domainName: 'sub.*.example.com',
    });
  }).toThrow(/Domain name format is invalid/);

  // Test empty label
  expect(() => {
    new Certificate(stack, 'Certificate8', {
      domainName: '.example.com',
    });
  }).toThrow(/Domain name format is invalid/);

  // Test single character domain (no TLD)
  expect(() => {
    new Certificate(stack, 'Certificate9', {
      domainName: 'a',
    });
  }).toThrow(/Domain name format is invalid/);

  // Test total domain length too long (over 64 characters)
  expect(() => {
    new Certificate(stack, 'Certificate10', {
      domainName: 'a'.repeat(60) + '.example.com', // 72 characters total
    });
  }).toThrow(/Domain name must be 64 characters or less/);
});

test('validates domain name format with regex within length limits', () => {
  const stack = new Stack();

  // Test valid domain with exactly 63-character label (within 64 total limit)
  new Certificate(stack, 'ValidCert', {
    domainName: 'a'.repeat(59) + '.com', // 63 characters total
  });

  // Test invalid: label with hyphen at start (within length limit)
  expect(() => {
    new Certificate(stack, 'InvalidCert1', {
      domainName: '-test.com',
    });
  }).toThrow(/Domain name format is invalid/);

  // Test invalid: label with hyphen at end (within length limit)
  expect(() => {
    new Certificate(stack, 'InvalidCert2', {
      domainName: 'test-.com',
    });
  }).toThrow(/Domain name format is invalid/);

  // Test invalid: empty label (within length limit)
  expect(() => {
    new Certificate(stack, 'InvalidCert3', {
      domainName: '.com',
    });
  }).toThrow(/Domain name format is invalid/);

  // Test invalid: no TLD structure
  expect(() => {
    new Certificate(stack, 'InvalidCert4', {
      domainName: 'example',
    });
  }).toThrow(/Domain name format is invalid/);

  // Test valid: wildcard with valid subdomain
  new Certificate(stack, 'ValidWildcard', {
    domainName: '*.test.com',
  });

  // Test invalid: wildcard not at beginning
  expect(() => {
    new Certificate(stack, 'InvalidCert5', {
      domainName: 'test.*.com',
    });
  }).toThrow(/Domain name format is invalid/);

  // Test valid: numbers in domain
  new Certificate(stack, 'ValidNumbers', {
    domainName: '123.test456.com',
  });

  // Test valid: hyphens in middle of labels
  new Certificate(stack, 'ValidHyphens', {
    domainName: 'test-1.sub-domain.com',
  });

  // Test invalid: consecutive dots
  expect(() => {
    new Certificate(stack, 'InvalidCert6', {
      domainName: 'test..com',
    });
  }).toThrow(/Domain name format is invalid/);

  // Test invalid: ending with dot
  expect(() => {
    new Certificate(stack, 'InvalidCert7', {
      domainName: 'test.com.',
    });
  }).toThrow(/Domain name format is invalid/);
});

test('throws when subject alternative name format is invalid', () => {
  const stack = new Stack();

  expect(() => {
    new Certificate(stack, 'Certificate', {
      domainName: 'example.com',
      subjectAlternativeNames: ['valid.com', '-invalid.com'],
    });
  }).toThrow(/Subject alternative name "-invalid.com" format is invalid/);
});

test('does not throw when domain name format validation is bypassed with tokens', () => {
  const stack = new Stack();
  const tokenDomain = Lazy.string({ produce: () => '-invalid.com' });

  new Certificate(stack, 'Certificate', {
    domainName: tokenDomain,
    validation: CertificateValidation.fromEmail({
      [tokenDomain]: 'example.com',
    }),
  });

  // Should not throw because tokens bypass validation
});

test('needs validation domain supplied if domain contains a token', () => {
  const stack = new Stack();

  expect(() => {
    const domainName = Lazy.string({ produce: () => 'example.com' });
    new Certificate(stack, 'Certificate', {
      domainName,
    });
  }).toThrow(/'validationDomains' needs to be supplied/);
});

test('validationdomains can be given for a Token', () => {
  const stack = new Stack();

  const domainName = Lazy.string({ produce: () => 'my.example.com' });
  new Certificate(stack, 'Certificate', {
    domainName,
    validation: CertificateValidation.fromEmail({
      [domainName]: 'example.com',
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
    DomainName: 'my.example.com',
    DomainValidationOptions: [{
      DomainName: 'my.example.com',
      ValidationDomain: 'example.com',
    }],
  });
});

test('CertificateValidation.fromEmail', () => {
  const stack = new Stack();

  new Certificate(stack, 'Certificate', {
    domainName: 'test.example.com',
    subjectAlternativeNames: ['extra.example.com'],
    validation: CertificateValidation.fromEmail({
      'test.example.com': 'example.com',
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
    DomainName: 'test.example.com',
    SubjectAlternativeNames: ['extra.example.com'],
    DomainValidationOptions: [
      {
        DomainName: 'test.example.com',
        ValidationDomain: 'example.com',
      },
      {
        DomainName: 'extra.example.com',
        ValidationDomain: 'example.com',
      },
    ],
    ValidationMethod: 'EMAIL',
  });
});

describe('CertificateValidation.fromDns', () => {
  test('without a hosted zone', () => {
    const stack = new Stack();

    new Certificate(stack, 'Certificate', {
      domainName: 'test.example.com',
      subjectAlternativeNames: ['extra.example.com'],
      validation: CertificateValidation.fromDns(),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
      DomainName: 'test.example.com',
      SubjectAlternativeNames: ['extra.example.com'],
      ValidationMethod: 'DNS',
    });
  });

  test('with a hosted zone', () => {
    const stack = new Stack();

    const exampleCom = new route53.HostedZone(stack, 'ExampleCom', {
      zoneName: 'example.com',
    });

    new Certificate(stack, 'Certificate', {
      domainName: 'test.example.com',
      validation: CertificateValidation.fromDns(exampleCom),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
      DomainName: 'test.example.com',
      DomainValidationOptions: [
        {
          DomainName: 'test.example.com',
          HostedZoneId: {
            Ref: 'ExampleCom20E1324B',
          },
        },
      ],
      ValidationMethod: 'DNS',
    });
  });

  test('with an imported hosted zone', () => {
    const stack = new Stack();

    const exampleCom = route53.PublicHostedZone.fromHostedZoneId(stack, 'ExampleCom', 'sampleid');

    new Certificate(stack, 'Certificate', {
      domainName: 'test.example.com',
      validation: CertificateValidation.fromDns(exampleCom),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
      DomainName: 'test.example.com',
      DomainValidationOptions: [
        {
          DomainName: 'test.example.com',
          HostedZoneId: 'sampleid',
        },
      ],
      ValidationMethod: 'DNS',
    });
  });

  test('with hosted zone and a wildcard name', () => {
    const stack = new Stack();

    const exampleCom = new route53.HostedZone(stack, 'ExampleCom', {
      zoneName: 'example.com',
    });

    new Certificate(stack, 'Certificate', {
      domainName: 'test.example.com',
      validation: CertificateValidation.fromDns(exampleCom),
      subjectAlternativeNames: ['*.test.example.com'],
    });

    // Wildcard domain names are de-duped.
    Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
      DomainName: 'test.example.com',
      DomainValidationOptions: [
        {
          DomainName: 'test.example.com',
          HostedZoneId: {
            Ref: 'ExampleCom20E1324B',
          },
        },
      ],
      ValidationMethod: 'DNS',
    });
  });

  test('with hosted zone and multiple wildcard names', () => {
    const stack = new Stack();

    const exampleCom = new route53.HostedZone(stack, 'ExampleCom', {
      zoneName: 'example.com',
    });

    new Certificate(stack, 'Certificate', {
      domainName: 'test.example.com',
      validation: CertificateValidation.fromDns(exampleCom),
      subjectAlternativeNames: ['*.test.example.com', '*.foo.test.example.com', 'bar.test.example.com'],
    });

    // Wildcard domain names are de-duped.
    Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
      DomainName: 'test.example.com',
      DomainValidationOptions: [
        {
          DomainName: 'test.example.com',
          HostedZoneId: {
            Ref: 'ExampleCom20E1324B',
          },
        },
        {
          DomainName: '*.foo.test.example.com',
          HostedZoneId: {
            Ref: 'ExampleCom20E1324B',
          },
        },
        {
          DomainName: 'bar.test.example.com',
          HostedZoneId: {
            Ref: 'ExampleCom20E1324B',
          },
        },
      ],
      ValidationMethod: 'DNS',
    });
  });
});

test('CertificateValidation.fromDnsMultiZone', () => {
  const stack = new Stack();

  const exampleCom = new route53.HostedZone(stack, 'ExampleCom', {
    zoneName: 'example.com',
  });

  const exampleNet = new route53.HostedZone(stack, 'ExampleNet', {
    zoneName: 'example.com',
  });

  new Certificate(stack, 'Certificate', {
    domainName: 'test.example.com',
    subjectAlternativeNames: ['cool.example.com', 'test.example.net'],
    validation: CertificateValidation.fromDnsMultiZone({
      'test.example.com': exampleCom,
      'cool.example.com': exampleCom,
      'test.example.net': exampleNet,
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
    DomainName: 'test.example.com',
    DomainValidationOptions: [
      {
        DomainName: 'test.example.com',
        HostedZoneId: {
          Ref: 'ExampleCom20E1324B',
        },
      },
      {
        DomainName: 'cool.example.com',
        HostedZoneId: {
          Ref: 'ExampleCom20E1324B',
        },
      },
      {
        DomainName: 'test.example.net',
        HostedZoneId: {
          Ref: 'ExampleNetF7CA40C9',
        },
      },
    ],
    ValidationMethod: 'DNS',
  });
});

describe('Certificate export setting', () => {
  test('leaves certificate export setting untouched by default', () => {
    const stack = new Stack();

    new Certificate(stack, 'Certificate', {
      domainName: 'test.example.com',
    });

    const certificateNodes = Template.fromStack(stack).findResources('AWS::CertificateManager::Certificate');
    expect(certificateNodes.Certificate4E7ABB08).toBeDefined();
    expect(certificateNodes.Certificate4E7ABB08.CertificateTransparencyLoggingPreference).toBeUndefined();
  });

  test('can enable certificate export', () => {
    const stack = new Stack();

    new Certificate(stack, 'Certificate', {
      domainName: 'test.example.com',
      allowExport: true,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
      DomainName: 'test.example.com',
      CertificateExport: 'ENABLED',
    });
  });

  test('can disable certificate export', () => {
    const stack = new Stack();

    new Certificate(stack, 'Certificate', {
      domainName: 'test.example.com',
      allowExport: false,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
      DomainName: 'test.example.com',
      CertificateExport: Match.absent(),
    });
  });
});

describe('Transparency logging settings', () => {
  test('leaves transparency logging untouched by default', () => {
    const stack = new Stack();

    new Certificate(stack, 'Certificate', {
      domainName: 'test.example.com',
    });

    const certificateNodes = Template.fromStack(stack).findResources('AWS::CertificateManager::Certificate');
    expect(certificateNodes.Certificate4E7ABB08).toBeDefined();
    expect(certificateNodes.Certificate4E7ABB08.CertificateTransparencyLoggingPreference).toBeUndefined();
  });

  test('can enable transparency logging', () => {
    const stack = new Stack();

    new Certificate(stack, 'Certificate', {
      domainName: 'test.example.com',
      transparencyLoggingEnabled: true,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
      DomainName: 'test.example.com',
      CertificateTransparencyLoggingPreference: 'ENABLED',
    });
  });

  test('can disable transparency logging', () => {
    const stack = new Stack();

    new Certificate(stack, 'Certificate', {
      domainName: 'test.example.com',
      transparencyLoggingEnabled: false,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
      DomainName: 'test.example.com',
      CertificateTransparencyLoggingPreference: 'DISABLED',
    });
  });
});

describe('Certificate Name setting', () => {
  test('the Name tag is defaulted to path', () => {
    const stack = new Stack(undefined, 'TestStack');

    new Certificate(stack, 'TheCertificate', {
      domainName: 'test.example.com',
    });

    Template.fromStack(stack).hasResource('AWS::CertificateManager::Certificate',
      hasTags([{ Key: 'Name', Value: 'TestStack/TheCertificate' }]),
    );
  });

  test('Can provide a custom certificate name', () => {
    const stack = new Stack(undefined, 'TestStack');

    new Certificate(stack, 'TheCertificate', {
      domainName: 'test.example.com',
      certificateName: 'Custom Certificate Name',
    });

    Template.fromStack(stack).hasResource('AWS::CertificateManager::Certificate',
      hasTags([{ Key: 'Name', Value: 'Custom Certificate Name' }]),
    );
  });
});

function hasTags(expectedTags: Array<{Key: string; Value: string}>) {
  return {
    Properties: {
      Tags: Match.arrayWith(expectedTags),
    },
  };
}

describe('Key Algorithm', () => {
  test('key algorithm is undefined if not provided', () => {
    const stack = new Stack();

    new Certificate(stack, 'Certificate', {
      domainName: 'test.example.com',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
      KeyAlgorithm: Match.absent(),
    });
  });

  test('Can specify algorithm', () => {
    const stack = new Stack();

    new Certificate(stack, 'Certificate', {
      domainName: 'test.example.com',
      keyAlgorithm: KeyAlgorithm.EC_SECP384R1,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
      KeyAlgorithm: 'EC_secp384r1',
    });
  });

  test('Can specify any arbitrary algorithm', () => {
    const stack = new Stack();

    new Certificate(stack, 'Certificate', {
      domainName: 'test.example.com',
      keyAlgorithm: new KeyAlgorithm('any value'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
      KeyAlgorithm: 'any value',
    });
  });
});
