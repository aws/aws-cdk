import { PublicHostedZone } from 'aws-cdk-lib/aws-route53';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { AcmeCertificateAuthority, AcmeEndpoint, KeyAlgorithm } from 'aws-cdk-lib/aws-certificatemanager';

/**
 * In order to test this you need
 * to have a valid public hosted zone whose domain
 * can be pre-approved on the ACME endpoint.
 */
const hostedZoneId = process.env.CDK_INTEG_HOSTED_ZONE_ID ?? process.env.HOSTED_ZONE_ID;
if (!hostedZoneId) throw new Error('For this test you must provide your own HostedZoneId as an env var "HOSTED_ZONE_ID". See framework-integ/README.md for details.');
const hostedZoneName = process.env.CDK_INTEG_HOSTED_ZONE_NAME ?? process.env.HOSTED_ZONE_NAME;
if (!hostedZoneName) throw new Error('For this test you must provide your own HostedZoneName as an env var "HOSTED_ZONE_NAME". See framework-integ/README.md for details.');

const app = new App();
const stack = new Stack(app, 'integ-acme-endpoint');

const hostedZone = PublicHostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
  hostedZoneId,
  zoneName: hostedZoneName,
});

const endpoint = new AcmeEndpoint(stack, 'AcmeEndpoint', {
  certificateAuthority: AcmeCertificateAuthority.public({
    allowedKeyAlgorithms: [KeyAlgorithm.EC_PRIME256V1, KeyAlgorithm.EC_SECP384R1],
  }),
  contactRequired: true,
  certificateTags: { purpose: 'integ' },
});

const validation = endpoint.addDomainValidation('DomainValidation', {
  domainName: hostedZoneName,
  hostedZone,
  allowExactDomain: true,
  allowSubdomains: true,
  allowWildcards: false,
});

const binding = endpoint.addExternalAccountBinding('ExternalAccountBinding', {
  expiration: Duration.days(1),
});

const integ = new IntegTest(app, 'integ-test', {
  testCases: [stack],
  diffAssets: true,
  enableLookups: true,
});

integ.assertions.awsApiCall('ACM', 'describeAcmeEndpoint', {
  AcmeEndpointArn: endpoint.acmeEndpointArn,
}).expect(ExpectedResult.objectLike({
  AcmeEndpoint: {
    Status: 'ACTIVE',
    AuthorizationBehavior: 'PRE_APPROVED',
    Contact: 'REQUIRED',
  },
}));

integ.assertions.awsApiCall('ACM', 'describeAcmeDomainValidation', {
  AcmeDomainValidationArn: validation.acmeDomainValidationArn,
}).expect(ExpectedResult.objectLike({
  AcmeDomainValidation: {
    DomainName: hostedZoneName,
  },
}));

integ.assertions.awsApiCall('ACM', 'describeAcmeExternalAccountBinding', {
  AcmeExternalAccountBindingArn: binding.acmeExternalAccountBindingArn,
}).expect(ExpectedResult.objectLike({
  ExternalAccountBinding: {
    AcmeEndpointArn: endpoint.acmeEndpointArn,
  },
}));
