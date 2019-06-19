import { SynthUtils } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import { HostedZone, HostedZoneAttributes } from '../lib';

export = {
  'Hosted Zone Provider': {
    'HostedZoneProvider will return context values if availble'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack(undefined, 'TestStack', { env: { account: '12345', region: 'us-east-1' } });
      const filter = {domainName: 'test.com'};

      HostedZone.fromLookup(stack, 'Ref', filter);

      const missing = SynthUtils.synthesize(stack).assembly.manifest.missing!;
      test.ok(missing && missing.length === 1);

      const fakeZone = {
        Id: "/hostedzone/11111111111111",
        Name: "example.com.",
        CallerReference: "TestLates-PublicZo-OESZPDFV7G6A",
        Config: {
          Comment: "CDK created",
          PrivateZone: false
        },
        ResourceRecordSetCount: 3
      };

      const stack2 = new cdk.Stack(undefined, 'TestStack', { env: { account: '12345', region: 'us-east-1' } });
      stack2.node.setContext(missing[0].key, fakeZone);

      const cdkZoneProps: HostedZoneAttributes = {
        hostedZoneId: fakeZone.Id,
        zoneName: 'example.com',
      };

      const cdkZone = HostedZone.fromHostedZoneAttributes(stack2, 'MyZone', cdkZoneProps);

      // WHEN
      const zoneRef = HostedZone.fromLookup(stack2, 'MyZoneProvider', filter);

      // THEN
      test.deepEqual(zoneRef.hostedZoneId, cdkZone.hostedZoneId);
      test.done();
    },
  }
};
