import { SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { HostedZone } from '../lib';

nodeunitShim({
  'Hosted Zone Provider': {
    'HostedZoneProvider will return context values if available'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '12345', region: 'us-east-1' },
      });
      const filter = { domainName: 'test.com' };

      HostedZone.fromLookup(stack, 'Ref', filter);

      const missing = SynthUtils.synthesize(stack).assembly.manifest.missing!;
      test.ok(missing && missing.length === 1);

      const fakeZoneId = '11111111111111';
      const fakeZone = {
        Id: `/hostedzone/${fakeZoneId}`,
        Name: 'example.com.',
        CallerReference: 'TestLates-PublicZo-OESZPDFV7G6A',
        Config: {
          Comment: 'CDK created',
          PrivateZone: false,
        },
        ResourceRecordSetCount: 3,
      };

      const stack2 = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '12345', region: 'us-east-1' },
      });
      stack2.node.setContext(missing[0].key, fakeZone);

      // WHEN
      const zoneRef = HostedZone.fromLookup(stack2, 'MyZoneProvider', filter);

      // THEN
      test.deepEqual(zoneRef.hostedZoneId, fakeZoneId);
      test.done();
    },
    'HostedZoneProvider will return context values if available when using plain hosted zone id'(
      test: Test,
    ) {
      // GIVEN
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '12345', region: 'us-east-1' },
      });
      const filter = { domainName: 'test.com' };

      HostedZone.fromLookup(stack, 'Ref', filter);

      const missing = SynthUtils.synthesize(stack).assembly.manifest.missing!;
      test.ok(missing && missing.length === 1);

      const fakeZoneId = '11111111111111';
      const fakeZone = {
        Id: `/hostedzone/${fakeZoneId}`,
        Name: 'example.com.',
        CallerReference: 'TestLates-PublicZo-OESZPDFV7G6A',
        Config: {
          Comment: 'CDK created',
          PrivateZone: false,
        },
        ResourceRecordSetCount: 3,
      };

      const stack2 = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '12345', region: 'us-east-1' },
      });
      stack2.node.setContext(missing[0].key, fakeZone);

      const zone = HostedZone.fromLookup(stack2, 'MyZoneProvider', filter);

      // WHEN
      const zoneId = zone.hostedZoneId;

      // THEN
      test.deepEqual(fakeZoneId, zoneId);
      test.done();
    },
  },
});
