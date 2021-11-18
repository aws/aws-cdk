'use strict';

const AWS = require('aws-sdk-mock');
const LambdaTester = require('lambda-tester').noVersionCheck();
const sinon = require('sinon');
const handler = require('..');
const nock = require('nock');
const ResponseURL = 'https://cloudwatch-response-mock.example.com/';

AWS.setSDK(require.resolve('aws-sdk'));

describe('DNS Validated Certificate Handler', () => {
  let origLog = console.log;
  const testRequestId = 'f4ef1b10-c39a-44e3-99c0-fbf7e53c3943';
  const testDomainName = 'test.example.com';
  const testSubjectAlternativeName = 'foo.example.com';
  const testHostedZoneId = '/hostedzone/Z3P5QSUBK4POTI';
  const testCertificateArn = 'arn:aws:acm:region:123456789012:certificate/12345678-1234-1234-1234-123456789012';
  const testRRName = '_3639ac514e785e898d2646601fa951d5.example.com';
  const testRRValue = '_x2.acm-validations.aws';
  const testAltRRName = '_3639ac514e785e898d2646601fa951d5.foo.example.com';
  const testAltRRValue = '_x3.acm-validations.aws';
  const testTags = { Tag1: 'Test1', Tag2: 'Test2' };
  const testTagsValue = [{ Key: 'Tag1', Value: 'Test1' }, { Key: 'Tag2', Value: 'Test2' }];
  const spySleep = sinon.spy(function (ms) {
    return Promise.resolve();
  });

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
    handler.withSleep(spySleep);
    console.log = function () { };
  });
  afterEach(() => {
    // Restore waiters and logger
    handler.resetWaiter();
    handler.resetSleep();
    handler.resetMaxAttempts();
    AWS.restore();
    console.log = origLog;
    spySleep.resetHistory();
  });

  test('Empty event payload fails', () => {
    const request = nock(ResponseURL).put('/', body => {
      return body.Status === 'FAILED' && body.Reason === 'Unsupported request type undefined';
    }).reply(200);
    return LambdaTester(handler.certificateRequestHandler)
      .event({})
      .expectResolve(() => {
        expect(request.isDone()).toBe(true);
      });
  });

  test('Bogus operation fails', () => {
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

  test('Create operation requests a certificate', () => {
    const requestCertificateFake = sinon.fake.resolves({
      CertificateArn: testCertificateArn,
    });

    const describeCertificateFake = sinon.stub();
    describeCertificateFake.onFirstCall().resolves({
      Certificate: {
        CertificateArn: testCertificateArn
      }
    });
    describeCertificateFake.resolves({
      Certificate: {
        CertificateArn: testCertificateArn,
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

    const addTagsToCertificateFake = sinon.fake.resolves({});

    const changeResourceRecordSetsFake = sinon.fake.resolves({
      ChangeInfo: {
        Id: 'bogus'
      }
    });

    AWS.mock('ACM', 'requestCertificate', requestCertificateFake);
    AWS.mock('ACM', 'describeCertificate', describeCertificateFake);
    AWS.mock('Route53', 'changeResourceRecordSets', changeResourceRecordSetsFake);
    AWS.mock('ACM', 'addTagsToCertificate', addTagsToCertificateFake);

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
          Tags: testTags
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
        sinon.assert.calledWith(addTagsToCertificateFake, sinon.match({
          "CertificateArn": testCertificateArn,
          "Tags": testTagsValue,
        }));
        expect(request.isDone()).toBe(true);
      });
  });

  test('Create operation with `SubjectAlternativeNames` requests a certificate with validation records for all options', () => {
    const requestCertificateFake = sinon.fake.resolves({
      CertificateArn: testCertificateArn,
    });

    const describeCertificateFake = sinon.stub();
    describeCertificateFake.onFirstCall().resolves({
      Certificate: {
        CertificateArn: testCertificateArn
      }
    });
    describeCertificateFake.resolves({
      Certificate: {
        CertificateArn: testCertificateArn,
        DomainValidationOptions: [
          {
            ValidationStatus: 'SUCCESS',
            ResourceRecord: {
              Name: testRRName,
              Type: 'CNAME',
              Value: testRRValue
            }
          }, {
            ValidationStatus: 'SUCCESS',
            ResourceRecord: {
              Name: testAltRRName,
              Type: 'CNAME',
              Value: testAltRRValue
            }
          }
        ]
      }
    });

    const addTagsToCertificateFake = sinon.fake.resolves({
      Certificate: testCertificateArn,
      Tags: testTags,
    });

    const changeResourceRecordSetsFake = sinon.fake.resolves({
      ChangeInfo: {
        Id: 'bogus'
      }
    });


    AWS.mock('ACM', 'requestCertificate', requestCertificateFake);
    AWS.mock('ACM', 'describeCertificate', describeCertificateFake);
    AWS.mock('ACM', 'addTagsToCertificate', addTagsToCertificateFake);
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
          SubjectAlternativeNames: [testSubjectAlternativeName],
          HostedZoneId: testHostedZoneId,
          Region: 'us-east-1',
          Tags: testTags,
        }
      })
      .expectResolve(() => {
        sinon.assert.calledWith(requestCertificateFake, sinon.match({
          DomainName: testDomainName,
          ValidationMethod: 'DNS',
          SubjectAlternativeNames: [testSubjectAlternativeName]
        }));
        sinon.assert.calledWith(changeResourceRecordSetsFake, sinon.match({
          ChangeBatch: {
            Changes: [
              {
                Action: 'UPSERT',
                ResourceRecordSet: {
                  Name: testRRName,
                  Type: 'CNAME',
                  TTL: 60,
                  ResourceRecords: [{
                    Value: testRRValue
                  }]
                }
              }, {
                Action: 'UPSERT',
                ResourceRecordSet: {
                  Name: testAltRRName,
                  Type: 'CNAME',
                  TTL: 60,
                  ResourceRecords: [{
                    Value: testAltRRValue
                  }]
                }
              }
            ]
          },
          HostedZoneId: testHostedZoneId
        }));
        sinon.assert.calledWith(addTagsToCertificateFake, sinon.match({
          "CertificateArn": testCertificateArn,
          "Tags": testTagsValue,
        }));
        expect(request.isDone()).toBe(true);
      });
  });

  test('Create operation with `SubjectAlternativeNames` requests a certificate for all options without duplicates', () => {
    const requestCertificateFake = sinon.fake.resolves({
      CertificateArn: testCertificateArn,
    });

    const describeCertificateFake = sinon.stub();
    describeCertificateFake.onFirstCall().resolves({
      Certificate: {
        CertificateArn: testCertificateArn
      }
    });
    describeCertificateFake.resolves({
      Certificate: {
        CertificateArn: testCertificateArn,
        DomainValidationOptions: [
          {
            ValidationStatus: 'SUCCESS',
            ResourceRecord: {
              Name: testRRName,
              Type: 'CNAME',
              Value: testRRValue
            }
          }, {
            ValidationStatus: 'SUCCESS',
            ResourceRecord: {
              Name: testAltRRName,
              Type: 'CNAME',
              Value: testAltRRValue
            }
          }, {
            ValidationStatus: 'SUCCESS',
            ResourceRecord: {
              Name: testRRName,
              Type: 'CNAME',
              Value: testRRValue
            }
          }
        ]
      }
    });

    const addTagsToCertificateFake = sinon.fake.resolves({
      Certificate: testCertificateArn,
      Tags: testTags,
    });

    const changeResourceRecordSetsFake = sinon.fake.resolves({
      ChangeInfo: {
        Id: 'bogus'
      }
    });

    AWS.mock('ACM', 'requestCertificate', requestCertificateFake);
    AWS.mock('ACM', 'describeCertificate', describeCertificateFake);
    AWS.mock('ACM', 'addTagsToCertificate', addTagsToCertificateFake);
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
          Tags: testTags,
        }
      })
      .expectResolve(() => {
        sinon.assert.calledWith(requestCertificateFake, sinon.match({
          DomainName: testDomainName,
          ValidationMethod: 'DNS'
        }));
        sinon.assert.calledWith(changeResourceRecordSetsFake, sinon.match({
          ChangeBatch: {
            Changes: [
              {
                Action: 'UPSERT',
                ResourceRecordSet: {
                  Name: testRRName,
                  Type: 'CNAME',
                  TTL: 60,
                  ResourceRecords: [{
                    Value: testRRValue
                  }]
                }
              }, {
                Action: 'UPSERT',
                ResourceRecordSet: {
                  Name: testAltRRName,
                  Type: 'CNAME',
                  TTL: 60,
                  ResourceRecords: [{
                    Value: testAltRRValue
                  }]
                }
              }
            ]
          },
          HostedZoneId: testHostedZoneId
        }));
        sinon.assert.calledWith(addTagsToCertificateFake, sinon.match({
          "CertificateArn": testCertificateArn,
          "Tags": testTagsValue,
        }));
        expect(request.isDone()).toBe(true);
      });
  });

  test('Create operation fails after more than 60s if certificate has no DomainValidationOptions', () => {
    handler.withRandom(() => 0);
    const requestCertificateFake = sinon.fake.resolves({
      CertificateArn: testCertificateArn,
    });

    const describeCertificateFake = sinon.fake.resolves({
      Certificate: {
        CertificateArn: testCertificateArn
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
        const totalSleep = spySleep.getCalls().map(call => call.args[0]).reduce((p, n) => p + n, 0);
        expect(totalSleep).toBeGreaterThan(60 * 1000);
      });
  });

  test('Create operation fails within 360s and 10 attempts if certificate has no DomainValidationOptions', () => {
    handler.withRandom(() => 1);
    const requestCertificateFake = sinon.fake.resolves({
      CertificateArn: testCertificateArn,
    });

    const describeCertificateFake = sinon.fake.resolves({
      Certificate: {
        CertificateArn: testCertificateArn
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
        expect(spySleep.callCount).toBe(10);
        const totalSleep = spySleep.getCalls().map(call => call.args[0]).reduce((p, n) => p + n, 0);
        expect(totalSleep).toBeLessThan(360 * 1000);
      });
  });

  test('Create operation with a maximum of 1 attempts describes the certificate once', () => {
    handler.withMaxAttempts(1);

    const requestCertificateFake = sinon.fake.resolves({
      CertificateArn: testCertificateArn,
    });
    AWS.mock('ACM', 'requestCertificate', requestCertificateFake);

    const describeCertificateFake = sinon.fake.resolves({
      Certificate: {
        CertificateArn: testCertificateArn,
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
    AWS.mock('ACM', 'describeCertificate', describeCertificateFake);

    const addTagsToCertificateFake = sinon.fake.resolves({
      Certificate: testCertificateArn,
      Tags: testTags,
    });
    AWS.mock('ACM', 'addTagsToCertificate', addTagsToCertificateFake);

    const changeResourceRecordSetsFake = sinon.fake.resolves({
      ChangeInfo: {
        Id: 'bogus'
      }
    });
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
          Tags: testTags,
        }
      })
      .expectResolve(() => {
        sinon.assert.calledOnce(describeCertificateFake);
        sinon.assert.calledWith(describeCertificateFake, sinon.match({
          CertificateArn: testCertificateArn,
        }));
        sinon.assert.calledWith(addTagsToCertificateFake, sinon.match({
          "CertificateArn": testCertificateArn,
          "Tags": testTagsValue,
        }));
        expect(request.isDone()).toBe(true);
      });
  });

  test('Create operation succeeds with no tags passed', () => {
    const requestCertificateFake = sinon.fake.resolves({
      CertificateArn: testCertificateArn,
    });

    const describeCertificateFake = sinon.stub();
    describeCertificateFake.onFirstCall().resolves({
      Certificate: {
        CertificateArn: testCertificateArn
      }
    });
    describeCertificateFake.resolves({
      Certificate: {
        CertificateArn: testCertificateArn,
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

    const addTagsToCertificateFake = sinon.fake.resolves({
      Certificate: testCertificateArn,
    });

    AWS.mock('ACM', 'requestCertificate', requestCertificateFake);
    AWS.mock('ACM', 'describeCertificate', describeCertificateFake);
    AWS.mock('Route53', 'changeResourceRecordSets', changeResourceRecordSetsFake);
    AWS.mock('ACM', 'addTagsToCertificate', addTagsToCertificateFake);

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
          Region: 'us-east-1'
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
        sinon.assert.neverCalledWith(addTagsToCertificateFake, sinon.match({
          "CertificateArn": testCertificateArn,
          "Tags": testTagsValue,
        }));
        expect(request.isDone()).toBe(true);
      });
  });

  test('Delete operation deletes the certificate', () => {
    const describeCertificateFake = sinon.fake.resolves({
      Certificate: {
        CertificateArn: testCertificateArn,
      }
    });
    AWS.mock('ACM', 'describeCertificate', describeCertificateFake);

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
        sinon.assert.calledWith(describeCertificateFake, sinon.match({
          CertificateArn: testCertificateArn
        }));
        sinon.assert.calledWith(deleteCertificateFake, sinon.match({
          CertificateArn: testCertificateArn
        }));
        expect(request.isDone()).toBe(true);
      });
  });

  test('Delete operation is idempotent', () => {
    const error = new Error();
    error.name = 'ResourceNotFoundException';

    const describeCertificateFake = sinon.fake.rejects(error);
    AWS.mock('ACM', 'describeCertificate', describeCertificateFake);

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
        sinon.assert.calledWith(describeCertificateFake, sinon.match({
          CertificateArn: testCertificateArn
        }));
        sinon.assert.neverCalledWith(deleteCertificateFake, sinon.match({
          CertificateArn: testCertificateArn
        }));
        expect(request.isDone()).toBe(true);
      });
  });

  test('Delete operation succeeds if certificate becomes not-in-use', () => {
    const usedByArn = 'arn:aws:cloudfront::123456789012:distribution/d111111abcdef8';

    const describeCertificateFake = sinon.stub();
    describeCertificateFake.onFirstCall().resolves({
      Certificate: {
        CertificateArn: testCertificateArn,
        InUseBy: [usedByArn],
      }
    });
    describeCertificateFake.resolves({
      Certificate: {
        CertificateArn: testCertificateArn,
        InUseBy: [],
      }
    });

    AWS.mock('ACM', 'describeCertificate', describeCertificateFake);

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
        sinon.assert.calledWith(describeCertificateFake, sinon.match({
          CertificateArn: testCertificateArn
        }));
        sinon.assert.calledWith(deleteCertificateFake, sinon.match({
          CertificateArn: testCertificateArn
        }));
        expect(request.isDone()).toBe(true);
      });
  });

  test('Delete operation fails within 360s and 10 attempts if certificate is in-use', () => {
    const usedByArn = 'arn:aws:cloudfront::123456789012:distribution/d111111abcdef8';

    const describeCertificateFake = sinon.fake.resolves({
      Certificate: {
        CertificateArn: testCertificateArn,
        InUseBy: [usedByArn],
      }
    });
    AWS.mock('ACM', 'describeCertificate', describeCertificateFake);

    const error = new Error();
    error.name = 'ResourceInUseException';
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
        sinon.assert.calledWith(describeCertificateFake, sinon.match({
          CertificateArn: testCertificateArn
        }));
        sinon.assert.neverCalledWith(deleteCertificateFake, sinon.match({
          CertificateArn: testCertificateArn
        }));
        const totalSleep = spySleep.getCalls().map(call => call.args[0]).reduce((p, n) => p + n, 0);
        expect(totalSleep).toBeLessThan(360 * 1000);
        expect(spySleep.callCount).toBe(10);
        expect(request.isDone()).toBe(true);
      });
  });

  test('Delete operation fails if some other error is encountered during describe', () => {
    const error = new Error();
    error.name = 'SomeOtherException';

    const describeCertificateFake = sinon.fake.rejects(error);
    AWS.mock('ACM', 'describeCertificate', describeCertificateFake);

    const deleteCertificateFake = sinon.fake.resolves({});
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
        sinon.assert.calledWith(describeCertificateFake, sinon.match({
          CertificateArn: testCertificateArn
        }));
        sinon.assert.neverCalledWith(deleteCertificateFake, sinon.match({
          CertificateArn: testCertificateArn
        }));
        expect(request.isDone()).toBe(true);
      });
  });

  test('Delete operation fails if some other error is encountered during delete', () => {
    const describeCertificateFake = sinon.fake.resolves({
      Certificate: {
        CertificateArn: testCertificateArn
      }
    });
    AWS.mock('ACM', 'describeCertificate', describeCertificateFake);

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
        sinon.assert.calledWith(describeCertificateFake, sinon.match({
          CertificateArn: testCertificateArn
        }));
        sinon.assert.calledWith(deleteCertificateFake, sinon.match({
          CertificateArn: testCertificateArn
        }));
        expect(request.isDone()).toBe(true);
      });
  });

  test('Delete operation with a maximum of 1 attempts describes the certificate once', () => {
    handler.withMaxAttempts(1);

    const describeCertificateFake = sinon.fake.resolves({
      Certificate: {
        CertificateArn: testCertificateArn,
      }
    });
    AWS.mock('ACM', 'describeCertificate', describeCertificateFake);

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
        sinon.assert.calledWith(describeCertificateFake, sinon.match({
          CertificateArn: testCertificateArn
        }));
        sinon.assert.calledWith(deleteCertificateFake, sinon.match({
          CertificateArn: testCertificateArn
        }));
        expect(request.isDone()).toBe(true);
      });
  });
});
