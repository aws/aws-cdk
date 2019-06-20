'use strict';

const aws = require('aws-sdk');

const sleep = function (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// These are used for test purposes only
let defaultResponseURL;
let waiter;

/**
 * Upload a CloudFormation response object to S3.
 *
 * @param {object} event the Lambda event payload received by the handler function
 * @param {object} context the Lambda context received by the handler function
 * @param {string} responseStatus the response status, either 'SUCCESS' or 'FAILED'
 * @param {string} physicalResourceId CloudFormation physical resource ID
 * @param {object} [responseData] arbitrary response data object
 * @param {string} [reason] reason for failure, if any, to convey to the user
 * @returns {Promise} Promise that is resolved on success, or rejected on connection error or HTTP error response
 */
let report = function (event, context, responseStatus, physicalResourceId, responseData, reason) {
  return new Promise((resolve, reject) => {
    const https = require('https');
    const { URL } = require('url');

    var responseBody = JSON.stringify({
      Status: responseStatus,
      Reason: reason,
      PhysicalResourceId: physicalResourceId || context.logStreamName,
      StackId: event.StackId,
      RequestId: event.RequestId,
      LogicalResourceId: event.LogicalResourceId,
      Data: responseData
    });

    const parsedUrl = new URL(event.ResponseURL || defaultResponseURL);
    const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'PUT',
      headers: {
        'Content-Type': '',
        'Content-Length': responseBody.length
      }
    };

    https.request(options)
      .on('error', reject)
      .on('response', res => {
        res.resume();
        if (res.statusCode >= 400) {
          reject(new Error(`Server returned error ${res.statusCode}: ${res.statusMessage}`));
        } else {
          resolve();
        }
      })
      .end(responseBody, 'utf8');
  });
};

/**
 * Requests a public certificate from AWS Certificate Manager, using DNS validation.
 * The hosted zone ID must refer to a **public** Route53-managed DNS zone that is authoritative
 * for the suffix of the certificate's Common Name (CN).  For example, if the CN is
 * `*.example.com`, the hosted zone ID must point to a Route 53 zone authoritative
 * for `example.com`.
 *
 * @param {string} requestId the CloudFormation request ID
 * @param {string} domainName the Common Name (CN) field for the requested certificate
 * @param {string} hostedZoneId the Route53 Hosted Zone ID
 * @returns {string} Validated certificate ARN
 */
const requestCertificate = async function (requestId, domainName, subjectAlternativeNames, hostedZoneId, region) {
  const crypto = require('crypto');
  const acm = new aws.ACM({region});
  const route53 = new aws.Route53();
  if (waiter) {
    // Used by the test suite, since waiters aren't mockable yet
    route53.waitFor = acm.waitFor = waiter;
  }

  console.log(`Requesting certificate for ${domainName}`);

  const reqCertResponse = await acm.requestCertificate({
    DomainName: domainName,
    SubjectAlternativeNames: subjectAlternativeNames,
    IdempotencyToken: crypto.createHash('sha256').update(requestId).digest('hex').substr(0, 32),
    ValidationMethod: 'DNS'
  }).promise();

  console.log(`Certificate ARN: ${reqCertResponse.CertificateArn}`);

  console.log('Waiting for ACM to provide DNS records for validation...');

  var describeCertResponse;
  let attempt = 0;
  do {
    // Exponential backoff with jitter based on 100ms base
    await sleep(Math.random() * (Math.pow(attempt, 2) * 100));
    describeCertResponse = await acm.describeCertificate({
      CertificateArn: reqCertResponse.CertificateArn
    }).promise();
  } while (describeCertResponse.Certificate.DomainValidationOptions < 1 ||
    'ResourceRecord' in describeCertResponse.Certificate.DomainValidationOptions[0] === false);

  const record = describeCertResponse.Certificate.DomainValidationOptions[0].ResourceRecord;

  console.log(`Upserting DNS record into zone ${hostedZoneId}: ${record.Name} ${record.Type} ${record.Value}`);

  const changeBatch = await route53.changeResourceRecordSets({
    ChangeBatch: {
      Changes: [{
        Action: 'UPSERT',
        ResourceRecordSet: {
          Name: record.Name,
          Type: record.Type,
          TTL: 60,
          ResourceRecords: [{
            Value: record.Value
          }]
        }
      }]
    },
    HostedZoneId: hostedZoneId
  }).promise();

  console.log('Waiting for DNS records to commit...');
  await route53.waitFor('resourceRecordSetsChanged', {
    // Wait up to 5 minutes
    $waiter: {
      delay: 30,
      maxAttempts: 10
    },
    Id: changeBatch.ChangeInfo.Id
  }).promise();

  console.log('Waiting for validation...');
  await acm.waitFor('certificateValidated', {
    // Wait up to 9 minutes and 30 seconds
    $waiter: {
      delay: 30,
      maxAttempts: 19
    },
    CertificateArn: reqCertResponse.CertificateArn
  }).promise();

  return reqCertResponse.CertificateArn;
};

/**
 * Deletes a certificate from AWS Certificate Manager (ACM) by its ARN.
 * If the certificate does not exist, the function will return normally.
 *
 * @param {string} arn The certificate ARN
 */
const deleteCertificate = async function (arn, region) {
  const acm = new aws.ACM({region});

  console.log(`Deleting certificate ${arn}`);

  try {
    await acm.deleteCertificate({
      CertificateArn: arn
    }).promise();
  } catch (err) {
    if (err.name !== 'ResourceNotFoundException') {
      throw err;
    }
  }
};

/**
 * Main handler, invoked by Lambda
 */
exports.certificateRequestHandler = async function (event, context) {
  var responseData = {};
  var physicalResourceId;
  var certificateArn;

  try {
    switch (event.RequestType) {
      case 'Create':
      case 'Update':
        certificateArn = await requestCertificate(
          event.RequestId,
          event.ResourceProperties.DomainName,
          event.ResourceProperties.SubjectAlternativeNames,
          event.ResourceProperties.HostedZoneId,
          event.ResourceProperties.Region,
        );
        responseData.Arn = physicalResourceId = certificateArn;
        break;
      case 'Delete':
        physicalResourceId = event.PhysicalResourceId;
        // If the resource didn't create correctly, the physical resource ID won't be the
        // certificate ARN, so don't try to delete it in that case.
        if (physicalResourceId.startsWith('arn:')) {
          await deleteCertificate(physicalResourceId, event.ResourceProperties.Region);
        }
        break;
      default:
        throw new Error(`Unsupported request type ${event.RequestType}`);
    }

    console.log(`Uploading SUCCESS response to S3...`);
    await report(event, context, 'SUCCESS', physicalResourceId, responseData);
    console.log('Done.');
  } catch (err) {
    console.log(`Caught error ${err}. Uploading FAILED message to S3.`);
    await report(event, context, 'FAILED', physicalResourceId, null, err.message);
  }
};

/**
 * @private
 */
exports.withReporter = function (reporter) {
  report = reporter;
};

/**
 * @private
 */
exports.withDefaultResponseURL = function (url) {
  defaultResponseURL = url;
};

/**
 * @private
 */
exports.withWaiter = function (w) {
  waiter = w;
};

/**
 * @private
 */
exports.resetWaiter = function () {
  waiter = undefined;
};
