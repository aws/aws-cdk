'use strict';

const AWS = require('aws-sdk-mock');
const LambdaTester = require('lambda-tester').noVersionCheck();
const sinon = require('sinon');
const handler = require('..');
const nock = require('nock');
const ResponseURL = 'https://cloudwatch-response-mock.example.com/';

describe('DNS Validated Certificate Handler', () => {
  let origLog = console.log;
  const testRequestId = 'f4ef1b10-c39a-44e3-99c0-fbf7e53c3943';
  const testDomainName = 'test.example.com';
  const testHostedZoneId = '/hostedzone/Z3P5QSUBK4POTI';
  const testCertificateArn = 'arn:aws:acm:region:123456789012:certificate/12345678-1234-1234-1234-123456789012';
  const testRRName = '_3639ac514e785e898d2646601fa951d5.example.com';
  const testRRValue = '_x2.acm-validations.aws';

  beforeEach(() => {
    handler.withDefaultResponseURL(ResponseURL);
    handler.withWaiter(function () {
      // Mock waiter is merely a self-fulfilling promise
      return {
        promise: () => {
          return new Promise((resolve) => {
            resolve();
          });
        }
      };
    });
    handler.withSleep(() => Promise.resolve());
    console.log = function () { };
  });
  afterEach(() => {
    // Restore waiters and logger
    handler.resetWaiter();
    handler.resetSleep();
    AWS.restore();
    console.log = origLog;
  });

  test('Fails if the event payload is empty', () => {
    const request = nock(ResponseURL).put('/', body => {
      return body.Status === 'FAILED' && body.Reason === 'Unsupported request type undefined';
    }).reply(200);
    return LambdaTester(handler.certificateRequestHandler)
      .event({})
      .expectResolve(() => {
        expect(request.isDone()).toBe(true);
      });
  });

  test('Fails if the request type is bogus', () => {
    const bogusType = 'bogus';
    const request = nock(ResponseURL).put('/', body => {
      return body.Status === 'FAILED' && body.Reason === 'Unsupported request type ' + bogusType;
    }).reply(200);
    return LambdaTester(handler.certificateRequestHandler)
      .event({
        RequestType: bogusType
      })
      .expectResolve(() => {
        expect(request.isDone()).toBe(true);
      });
  });

  test('Requests a certificate if RequestType is Create', () => {
    const requestCertificateFake = sinon.fake.resolves({
      CertificateArn: testCertificateArn,
    });

    const describeCertificateFake = sinon.stub();
    describeCertificateFake.onFirstCall().resolves({
      CertificateArn: testCertificateArn,
      Certificate: {
      }
    });
    describeCertificateFake.resolves({
      CertificateArn: testCertificateArn,
      Certificate: {
        DomainValidationOptions: [{
          ValidationStatus: 'SUCCESS',
          ResourceRecord: {
            Name: testRRName,
            Type: 'CNAME',
            Value: testRRValue
          }
        }]
      }
    });

    const changeResourceRecordSetsFake = sinon.fake.resolves({
      ChangeInfo: {
        Id: 'bogus'
      }
    });

    AWS.mock('ACM', 'requestCertificate', requestCertificateFake);
    AWS.mock('ACM', 'describeCertificate', describeCertificateFake);
    AWS.mock('Route53', 'changeResourceRecordSets', changeResourceRecordSetsFake);

    const request = nock(ResponseURL).put('/', body => {
      return body.Status === 'SUCCESS';
    }).reply(200);

    return LambdaTester(handler.certificateRequestHandler)
      .event({
        RequestType: 'Create',
        RequestId: testRequestId,
        ResourceProperties: {
          DomainName: testDomainName,
          HostedZoneId: testHostedZoneId,
          Region: 'us-east-1',
        }
      })
      .expectResolve(() => {
        sinon.assert.calledWith(requestCertificateFake, sinon.match({
          DomainName: testDomainName,
          ValidationMethod: 'DNS'
        }));
        sinon.assert.calledWith(changeResourceRecordSetsFake, sinon.match({
          ChangeBatch: {
            Changes: [{
              Action: 'UPSERT',
              ResourceRecordSet: {
                Name: testRRName,
                Type: 'CNAME',
                TTL: 60,
                ResourceRecords: [{
                  Value: testRRValue
                }]
              }
            }]
          },
          HostedZoneId: testHostedZoneId
        }));
        expect(request.isDone()).toBe(true);
      });
  });

  test('Fails after at most 10 attempts if no DomainValidationOptions are available', () => {
    const requestCertificateFake = sinon.fake.resolves({
      CertificateArn: testCertificateArn,
    });

    const describeCertificateFake = sinon.fake.resolves({
      CertificateArn: testCertificateArn,
      Certificate: {
      }
    });

    AWS.mock('ACM', 'requestCertificate', requestCertificateFake);
    AWS.mock('ACM', 'describeCertificate', describeCertificateFake);

    const request = nock(ResponseURL).put('/', body => {
      return body.Status === 'FAILED' &&
        body.Reason.startsWith('Response from describeCertificate did not contain DomainValidationOptions');
    }).reply(200);

    return LambdaTester(handler.certificateRequestHandler)
      .event({
        RequestType: 'Create',
        RequestId: testRequestId,
        ResourceProperties: {
          DomainName: testDomainName,
          HostedZoneId: testHostedZoneId,
          Region: 'us-east-1',
        }
      })
      .expectResolve(() => {
        sinon.assert.calledWith(requestCertificateFake, sinon.match({
          DomainName: testDomainName,
          ValidationMethod: 'DNS'
        }));
        expect(request.isDone()).toBe(true);
      });
  });

  test('Deletes a certificate if RequestType is Delete', () => {
    const deleteCertificateFake = sinon.fake.resolves({});
    AWS.mock('ACM', 'deleteCertificate', deleteCertificateFake);

    const request = nock(ResponseURL).put('/', body => {
      return body.Status === 'SUCCESS';
    }).reply(200);

    return LambdaTester(handler.certificateRequestHandler)
      .event({
        RequestType: 'Delete',
        RequestId: testRequestId,
        PhysicalResourceId: testCertificateArn,
        ResourceProperties: {
          Region: 'us-east-1',
        }
      })
      .expectResolve(() => {
        sinon.assert.calledWith(deleteCertificateFake, sinon.match({
          CertificateArn: testCertificateArn
        }));
        expect(request.isDone()).toBe(true);
      });
  });

  test('Delete operation is idempotent', () => {
    const error = new Error();
    error.name = 'ResourceNotFoundException';
    const deleteCertificateFake = sinon.fake.rejects(error);
    AWS.mock('ACM', 'deleteCertificate', deleteCertificateFake);

    const request = nock(ResponseURL).put('/', body => {
      return body.Status === 'SUCCESS';
    }).reply(200);

    return LambdaTester(handler.certificateRequestHandler)
      .event({
        RequestType: 'Delete',
        RequestId: testRequestId,
        PhysicalResourceId: testCertificateArn,
        ResourceProperties: {
          Region: 'us-east-1',
        }
      })
      .expectResolve(() => {
        sinon.assert.calledWith(deleteCertificateFake, sinon.match({
          CertificateArn: testCertificateArn
        }));
        expect(request.isDone()).toBe(true);
      });
  });

  test('Delete operation fails if error is encountered', () => {
    const error = new Error();
    error.name = 'SomeOtherException';
    const deleteCertificateFake = sinon.fake.rejects(error);
    AWS.mock('ACM', 'deleteCertificate', deleteCertificateFake);

    const request = nock(ResponseURL).put('/', body => {
      return body.Status === 'FAILED';
    }).reply(200);

    return LambdaTester(handler.certificateRequestHandler)
      .event({
        RequestType: 'Delete',
        RequestId: testRequestId,
        PhysicalResourceId: testCertificateArn,
        ResourceProperties: {
          Region: 'us-east-1',
        }
      })
      .expectResolve(() => {
        sinon.assert.calledWith(deleteCertificateFake, sinon.match({
          CertificateArn: testCertificateArn
        }));
        expect(request.isDone()).toBe(true);
      });
  });
});
