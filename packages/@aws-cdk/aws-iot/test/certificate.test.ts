
import '@aws-cdk/assert/jest';
import { expect, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import * as iot from '../lib';

// to make it easy to copy & paste from output:
/* eslint-disable quote-props */


nodeunitShim({
  'default properties'(test: Test) {
    const stack = new Stack();

    new iot.Certificate(stack, 'MyCertificate');

    expect(stack).to(haveResource('AWS::IoT::Certificate', {
      'Status': 'INACTIVE',
    }));
    test.done();
  },
  'specify status'(test: Test) {
    const stack = new Stack();

    new iot.Certificate(stack, 'MyCertificate', {
      status: iot.CertificateStatus.ACTIVE,
    });

    expect(stack).to(haveResource('AWS::IoT::Certificate', {
      'Status': 'ACTIVE',
    }));
    test.done();
  },
  'specify certificate mode'(test: Test) {
    const stack = new Stack();

    new iot.Certificate(stack, 'MyCertificate', {
      certificateMode: iot.CertificateMode.SNI_ONLY,
    });

    expect(stack).to(haveResource('AWS::IoT::Certificate', {
      'Status': 'INACTIVE',
      'CertificateMode': 'SNI_ONLY',
    }));
    test.done();
  },
  'throws if pem provided to SNI_ONLY certificate'(test: Test) {
    const stack = new Stack();

    test.throws(() => new iot.Certificate(stack, 'MyCertificate', {
      caCertificatePem: 'pem',
      certificateMode: iot.CertificateMode.SNI_ONLY,
    }), /Certificate invalid./);

    test.done();
  },
  'attachPolicy()'(test: Test) {
    const stack = new Stack();
    const policy = new iot.Policy(stack, 'MyIotPolicy', {
      statements: [new iot.PolicyStatement({})],
    });

    const cert = new iot.Certificate(stack, 'MyCertificate', {
      status: iot.CertificateStatus.ACTIVE,
    });

    cert.attachPolicy(policy);

    expect(stack).to(haveResource('AWS::IoT::PolicyPrincipalAttachment', {
      'PolicyName': 'MyIotPolicyCB76D4D8',
      'Principal': { 'Fn::GetAtt': ['MyCertificate41357985', 'Arn'] },
    }));
    test.done();
  },
  'fromCertificateId'(test: Test) {
    // GIVEN
    const stack2 = new Stack();

    // WHEN
    const imported = iot.Certificate.fromCertificateId(stack2, 'Imported', '1234567890');

    // THEN
    test.deepEqual(stack2.resolve(imported.certificateArn), {
      'Fn::Join':
        ['',
          ['arn:',
            { Ref: 'AWS::Partition' },
            ':iot:',
            { Ref: 'AWS::Region' },
            ':',
            { Ref: 'AWS::AccountId' },
            ':cert/1234567890']],
    });
    test.deepEqual(imported.certificateId, '1234567890');
    test.done();
  },
  'fromCertificateArn'(test: Test) {
    // GIVEN
    const stack2 = new Stack();

    // WHEN
    const imported = iot.Certificate.fromCertificateArn(stack2, 'Imported', 'arn:aws:iot::us-east-2:*:cert/1234567890');

    // THEN
    test.deepEqual(imported.certificateArn, 'arn:aws:iot::us-east-2:*:cert/1234567890');
    test.deepEqual(imported.certificateId, '1234567890');
    test.done();
  },
});
