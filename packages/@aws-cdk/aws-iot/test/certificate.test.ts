import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import * as iot from '../lib';

// GIVEN
let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

describe('IoT Certificate', () => {
  test('default properties', () => {
    // WHEN
    new iot.Certificate(stack, 'MyCertificate', {
      caCertificatePem: 'pem',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IoT::Certificate', {
      Status: 'INACTIVE',
      CACertificatePem: 'pem',
      CertificateMode: 'DEFAULT',
    });
  });

  test('specify status', () => {
    // WHEN
    new iot.Certificate(stack, 'MyCertificate', {
      status: iot.CertificateStatus.ACTIVE,
      certificateSigningRequest: 'csr',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IoT::Certificate', {
      Status: 'ACTIVE',
      CertificateSigningRequest: 'csr',
    });
  });

  test('specify certificate mode', () => {
    // WHEN
    new iot.Certificate(stack, 'MyCertificate', {
      certificateMode: iot.CertificateMode.SNI_ONLY,
      certificatePem: 'pem',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IoT::Certificate', {
      Status: 'INACTIVE',
      CertificateMode: 'SNI_ONLY',
      CertificatePem: 'pem',
    });
  });
  test('throws if pem provided to SNI_ONLY certificate', () => {
    expect(() => {
      new iot.Certificate(stack, 'MyCertificate', {
        caCertificatePem: 'pem',
        certificateMode: iot.CertificateMode.SNI_ONLY,
      });
    }).toThrowError(/Certificate invalid./);
  });
  test('throws when nothing provided', () => {
    expect(() => {
      new iot.Certificate(stack, 'MyCertificate');
    }).toThrowError(/Certificate invalid./);
  });
  test('attachPolicy()', () => {
    // WHEN
    const statement = new iot.PolicyStatement();
    statement.addActions('iot:Connect');
    statement.addAllResources();

    const policy = new iot.Policy(stack, 'MyIotPolicy', {
      statements: [statement],
    });

    const cert = new iot.Certificate(stack, 'MyCertificate', {
      status: iot.CertificateStatus.ACTIVE,
      certificateSigningRequest: 'csr',
    });

    cert.attachPolicy(policy);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IoT::PolicyPrincipalAttachment', {
      PolicyName: 'MyIotPolicyCB76D4D8',
      Principal: { 'Fn::GetAtt': ['MyCertificate41357985', 'Arn'] },
    });
  });

  test('attachThing()', () => {

    // WHEN
    const cert = new iot.Certificate(stack, 'MyCertificate', {
      status: iot.CertificateStatus.ACTIVE,
      certificateSigningRequest: 'csr',
    });

    const thing = new iot.Thing(stack, 'MyThing');

    cert.attachThing(thing);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IoT::ThingPrincipalAttachment', {
      ThingName: 'MyThing0C5333DD',
      Principal: { 'Fn::GetAtt': ['MyCertificate41357985', 'Arn'] },
    });
  });

  test('fromCertificateId', () => {
    // WHEN
    const imported = iot.Certificate.fromCertificateId(stack, 'Imported', '1234567890');
    // THEN
    expect(imported.certificateArn.includes('1234567890')).toEqual(true);
  });
  test('fromCertificateArn', () => {
    // WHEN
    const imported = iot.Certificate.fromCertificateArn(
      stack,
      'Imported',
      'arn:aws:iot::us-east-2:*:cert/1234567890');

    // THEN
    expect(imported.certificateArn).toEqual('arn:aws:iot::us-east-2:*:cert/1234567890');
    expect(imported.certificateId).toEqual('1234567890');
  });
  test('provides certificate ARN', () => {
    // WHEN
    const cert = new iot.Certificate(stack, 'MyIotCertificate', {
      certificateSigningRequest: 'csr',
    });
    // THEN
    expect(stack.resolve(cert.certificateArn)).toEqual({
      'Fn::GetAtt': ['MyIotCertificate84152F23', 'Arn'],
    });
  });
});
