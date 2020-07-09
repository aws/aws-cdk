import { expect, haveResource } from '@aws-cdk/assert';
import * as route53 from '@aws-cdk/aws-route53';
import { Lazy, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Certificate, CertificateValidation, ValidationMethod } from '../lib';

export = {
  'apex domain selection by default'(test: Test) {
    const stack = new Stack();

    new Certificate(stack, 'Certificate', {
      domainName: 'test.example.com',
    });

    expect(stack).to(haveResource('AWS::CertificateManager::Certificate', {
      DomainName: 'test.example.com',
      DomainValidationOptions: [{
        DomainName: 'test.example.com',
        ValidationDomain: 'example.com',
      }],
    }));

    test.done();
  },

  'validation domain can be overridden'(test: Test) {
    const stack = new Stack();

    new Certificate(stack, 'Certificate', {
      domainName: 'test.example.com',
      validationDomains: {
        'test.example.com': 'test.example.com',
      },
    });

    expect(stack).to(haveResource('AWS::CertificateManager::Certificate', {
      DomainValidationOptions: [{
        DomainName: 'test.example.com',
        ValidationDomain: 'test.example.com',
      }],
    }));

    test.done();
  },

  'export and import'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const c = Certificate.fromCertificateArn(stack, 'Imported', 'cert-arn');

    // THEN
    test.deepEqual(c.certificateArn, 'cert-arn');
    test.done();
  },

  'can configure validation method'(test: Test) {
    const stack = new Stack();

    new Certificate(stack, 'Certificate', {
      domainName: 'test.example.com',
      validationMethod: ValidationMethod.DNS,
    });

    expect(stack).to(haveResource('AWS::CertificateManager::Certificate', {
      DomainName: 'test.example.com',
      ValidationMethod: 'DNS',
    }));

    test.done();
  },

  'needs validation domain supplied if domain contains a token'(test: Test) {
    const stack = new Stack();

    test.throws(() => {
      const domainName = Lazy.stringValue({ produce: () => 'example.com' });
      new Certificate(stack, 'Certificate', {
        domainName,
      });
    }, /'validationDomains' needs to be supplied/);

    test.done();
  },

  'validationdomains can be given for a Token'(test: Test) {
    const stack = new Stack();

    const domainName = Lazy.stringValue({ produce: () => 'my.example.com' });
    new Certificate(stack, 'Certificate', {
      domainName,
      validationDomains: {
        [domainName]: 'example.com',
      },
    });

    expect(stack).to(haveResource('AWS::CertificateManager::Certificate', {
      DomainName: 'my.example.com',
      DomainValidationOptions: [{
        DomainName: 'my.example.com',
        ValidationDomain: 'example.com',
      }],
    }));

    test.done();
  },

  'CertificateValidation.fromEmail'(test: Test) {
    const stack = new Stack();

    new Certificate(stack, 'Certificate', {
      domainName: 'test.example.com',
      subjectAlternativeNames: ['extra.example.com'],
      validation: CertificateValidation.fromEmail({
        'test.example.com': 'example.com',
      }),
    });

    expect(stack).to(haveResource('AWS::CertificateManager::Certificate', {
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
    }));

    test.done();
  },

  'CertificateValidation.fromDns'(test: Test) {
    const stack = new Stack();

    new Certificate(stack, 'Certificate', {
      domainName: 'test.example.com',
      subjectAlternativeNames: ['extra.example.com'],
      validation: CertificateValidation.fromDns(),
    });

    expect(stack).to(haveResource('AWS::CertificateManager::Certificate', {
      DomainName: 'test.example.com',
      SubjectAlternativeNames: ['extra.example.com'],
      ValidationMethod: 'DNS',
    }));

    test.done();
  },

  'CertificateValidation.fromDns with hosted zone'(test: Test) {
    const stack = new Stack();

    const exampleCom = new route53.HostedZone(stack, 'ExampleCom', {
      zoneName: 'example.com',
    });

    new Certificate(stack, 'Certificate', {
      domainName: 'test.example.com',
      validation: CertificateValidation.fromDns(exampleCom),
    });

    expect(stack).to(haveResource('AWS::CertificateManager::Certificate', {
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
    }));

    test.done();
  },

  'CertificateValidation.fromDnsMultiZone'(test: Test) {
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

    expect(stack).to(haveResource('AWS::CertificateManager::Certificate', {
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
    }));

    test.done();
  },
};
