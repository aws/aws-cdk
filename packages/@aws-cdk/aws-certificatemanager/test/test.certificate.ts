import { expect, haveResource } from '@aws-cdk/assert';
import { Lazy, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Certificate, ValidationMethod } from '../lib';

export = {
  'apex domain selection by default'(test: Test) {
    const stack = new Stack();

    new Certificate(stack, 'Certificate', {
      domainName: 'test.example.com'
    });

    expect(stack).to(haveResource('AWS::CertificateManager::Certificate', {
      DomainName: 'test.example.com',
      DomainValidationOptions: [{
        DomainName: "test.example.com",
        ValidationDomain: "example.com"
      }]
    }));

    test.done();
  },

  'validation domain can be overridden'(test: Test) {
    const stack = new Stack();

    new Certificate(stack, 'Certificate', {
      domainName: 'test.example.com',
      validationDomains: {
        'test.example.com': 'test.example.com'
      }
    });

    expect(stack).to(haveResource('AWS::CertificateManager::Certificate', {
      DomainValidationOptions: [{
        DomainName: "test.example.com",
        ValidationDomain: "test.example.com"
      }]
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
      validationMethod: ValidationMethod.DNS
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
        [domainName]: 'example.com'
      }
    });

    expect(stack).to(haveResource('AWS::CertificateManager::Certificate', {
      DomainName: 'my.example.com',
      DomainValidationOptions: [{
        DomainName: 'my.example.com',
        ValidationDomain: 'example.com'
      }]
    }));

    test.done();
  },
};
