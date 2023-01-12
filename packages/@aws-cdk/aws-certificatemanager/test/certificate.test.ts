import { Template, Match } from '@aws-cdk/assertions';
import * as route53 from '@aws-cdk/aws-route53';
import { Aws, Duration, Lazy, Stack } from '@aws-cdk/core';
import { Certificate, CertificateValidation } from '../lib';

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

    //Wildcard domain names are de-duped.
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

    //Wildcard domain names are de-duped.
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


describe('Certifcate Name setting', () => {
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

function hasTags(expectedTags: Array<{Key: string, Value: string}>) {
  return {
    Properties: {
      Tags: Match.arrayWith(expectedTags),
    },
  };
}
