import { App, Stack } from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';

const app = new App({ stackTraces: false });
const stack = new Stack(app, 'RecordSetProtectionStack');
const zone = new route53.PublicHostedZone(stack, 'Zone', { zoneName: 'record-set-protection.cdk-integ-test.com' });
const [blue, green] = ['Blue', 'Green'].map((id, i) => new route53.ARecord(stack, id, {
  zone,
  recordName: 'www',
  setIdentifier: id,
  weight: 50,
  target: route53.RecordTarget.fromIpAddresses(`192.0.2.${i + 1}`),
}));
blue.with(new route53.mixins.RecordSetProtection({ additionalRecords: [green], comment: 'Production DNS' }));

const test = new IntegTest(app, 'RecordSetProtection', { testCases: [stack] });
const name = `www.${zone.zoneName}`;
// Use Cloud Control because the SDK bundled with Lambda may lack the Route 53 protection APIs.
const read = test.assertions.awsApiCall('CloudControl', 'getResource', {
  TypeName: 'AWS::Route53::RecordSetProtection',
  Identifier: `${zone.hostedZoneId}|${name}|A`,
});
read.provider.addPolicyStatementFromSdkCall('CloudFormation', 'getResource');
read.provider.addPolicyStatementFromSdkCall('Route53', 'listResourceRecordSetProtections', [zone.hostedZoneArn]);
read.expect(ExpectedResult.objectLike({
  ResourceDescription: {
    Properties: Match.serializedJson({
      HostedZoneId: zone.hostedZoneId,
      RecordName: name,
      RecordType: 'A',
      Comment: 'Production DNS',
    }),
  },
}));
