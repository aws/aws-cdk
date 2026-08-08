import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { CfnRecordSet } from 'aws-cdk-lib/aws-route53';
import * as cdk from 'aws-cdk-lib';
import {
  IntegTest,
  ExpectedResult,
} from '@aws-cdk/integ-tests-alpha';
import * as apigw from 'aws-cdk-lib/aws-apigateway';

const domainName = process.env.CDK_INTEG_DOMAIN_NAME || process.env.DOMAIN_NAME;
const hostedZoneId = process.env.CDK_INTEG_HOSTED_ZONE_ID || process.env.HOSTED_ZONE_ID;
const certArn = process.env.CDK_INTEG_CERT_ARN || process.env.CERT_ARN;
if (!domainName || !certArn || !hostedZoneId) {
  throw new Error('Env vars DOMAIN_NAME, HOSTED_ZONE_ID, and CERT_ARN must be set');
}

/**
 * -------------------------------------------------------
 * ------------------------- GIVEN------------------------
 * -------------------------------------------------------
 */
const app = new cdk.App();
const testCase = new cdk.Stack(app, 'integ-apigw-domain-name-dualstack');

const certificate = Certificate.fromCertificateArn(testCase, 'Cert', certArn);

/**
 * -------------------------------------------------------
 * ------------------------- WHEN ------------------------
 * -------------------------------------------------------
 */
const api = new apigw.RestApi(testCase, 'IntegApi');
api.root.addMethod('GET', new apigw.MockIntegration({
  requestTemplates: { 'application/json': '{ "statusCode": 200 }' },
  integrationResponses: [{
    statusCode: '200',
    responseTemplates: {
      'application/json': JSON.stringify({ message: 'Hello, world' }),
    },
  }],
}), {
  methodResponses: [{ statusCode: '200' }],
});

/**
 * Test dualstack custom domain endpoint.
 */
const dualstackDomain = new apigw.DomainName(testCase, 'DualstackDomain', {
  domainName: `dualstack-${domainName}`,
  certificate,
  mapping: api,
  endpointConfiguration: { ipAddressType: apigw.IpAddressType.DUAL_STACK },
});
new CfnRecordSet(testCase, 'DualstackDomainRecord', {
  name: `dualstack-${domainName}`,
  type: 'AAAA',
  hostedZoneId,
  aliasTarget: {
    hostedZoneId: dualstackDomain.domainNameAliasHostedZoneId,
    dnsName: dualstackDomain.domainNameAliasDomainName,
  },
});

/**
 * -------------------------------------------------------
 * ------------------------- THEN ------------------------
 * -------------------------------------------------------
 */
const integ = new IntegTest(app, 'domain-name-dualstack-test', {
  testCases: [testCase],
  enableLookups: true,
});

const dualstackDomainInvoke = integ.assertions.httpApiCall(`https://${dualstackDomain.domainName}/`, { });
dualstackDomainInvoke.expect(ExpectedResult.objectLike({
  body: { message: 'Hello, world' },
  ok: true,
  status: 200,
}));
