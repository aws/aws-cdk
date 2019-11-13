import { PublicHostedZone } from '@aws-cdk/aws-route53';
import { App, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Certificate, DnsValidatedCertificate } from '../lib';
import { apexDomain, getCertificateRegion, isDnsValidatedCertificate } from '../lib/util';

export = {
  'apex domain': {
    'returns right domain'(test: Test) {
      test.equals('domain.com', apexDomain('domain.com'));
      test.equals('domain.com', apexDomain('test.domain.com'));
      test.done();
    },

    'understands eTLDs'(test: Test) {
      test.equals('domain.co.uk', apexDomain('test.domain.co.uk'));
      test.done();
    },
  },
  'isDnsValidatedCertificate': {
    'new DnsValidatedCertificate is a DnsValidatedCertificate'(test: Test) {
      const stack = new Stack();

      const hostedZone = new PublicHostedZone(stack, 'ExampleDotCom', {
        zoneName: 'example.com'
      });
      const cert = new DnsValidatedCertificate(stack, 'Certificate', {
        domainName: 'test.example.com',
        hostedZone
      });

      test.ok(isDnsValidatedCertificate(cert));
      test.done();
    },
    'new Certificate is not a DnsValidatedCertificate'(test: Test) {
      const stack = new Stack();

      const cert = new Certificate(stack, 'Certificate', {
        domainName: 'test.example.com'
      });

      test.ok(!isDnsValidatedCertificate(cert));
      test.done();
    },
    'fromCertificateArn is not a DnsValidatedCertificate'(test: Test) {
      const stack = new Stack();

      const cert = Certificate.fromCertificateArn(stack, 'Certificate', 'cert-arn');

      test.ok(!isDnsValidatedCertificate(cert));
      test.done();
    },
  },
  'getCertificateRegion': {
    'from stack'(test: Test) {
      // GIVEN
      const app = new App();
      const stack = new Stack(app, 'RegionStack', {env: {region: 'eu-west-1'}});

      const certificate = new Certificate(stack, 'TestCertificate', {
        domainName: 'www.example.com',
      });

      test.equals(getCertificateRegion(certificate), 'eu-west-1');
      test.done();
    },
    'from DnsValidatedCertificate region'(test: Test) {
      // GIVEN
      const app = new App();
      const stack = new Stack(app, 'RegionStack', {env: {region: 'eu-west-1'}});
      const hostedZone = new PublicHostedZone(stack, 'ExampleDotCom', {
        zoneName: 'example.com'
      });

      const certificate = new DnsValidatedCertificate(stack, 'TestCertificate', {
        domainName: 'www.example.com',
        hostedZone,
        region: 'eu-west-3'
      });

      test.equals(getCertificateRegion(certificate), 'eu-west-3');
      test.done();
    },
    'fromCertificateArn'(test: Test) {
      // GIVEN
      const app = new App();
      const stack = new Stack(app, 'RegionStack', {env: {region: 'eu-west-1'}});

      const certificate = Certificate.fromCertificateArn(
        stack, 'TestCertificate', 'arn:aws:acm:us-east-2:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d'
        );

      test.equals(getCertificateRegion(certificate), 'us-east-2');
      test.done();
    },
    'region agnostic stack'(test: Test) {
      // GIVEN
      const stack = new Stack();

      const certificate = new Certificate(stack, 'TestCertificate', {
        domainName: 'www.example.com',
      });

      test.equals(getCertificateRegion(certificate), '${Token[AWS::Region.4]}');
      test.done();
    },
  },
};
