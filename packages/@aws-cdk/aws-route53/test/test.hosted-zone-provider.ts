import { SynthUtils } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import { HostedZone, HostedZoneAttributes, HostedZoneProvider } from '../lib';

export = {
  'Hosted Zone Provider': {
    'HostedZoneProvider will return context values if availble'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack(undefined, 'TestStack', { env: { account: '12345', region: 'us-east-1' } });
      const filter = {domainName: 'test.com'};
      new HostedZoneProvider(stack, filter).findHostedZone();

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

      stack.node.setContext(missing[0].key, fakeZone);

      const cdkZoneProps: HostedZoneAttributes = {
        hostedZoneId: fakeZone.Id,
        zoneName: 'example.com',
      };

      const cdkZone = HostedZone.fromHostedZoneAttributes(stack, 'MyZone', cdkZoneProps);

      // WHEN
      const provider = new HostedZoneProvider(stack, filter);
      const zoneProps = stack.resolve(provider.findHostedZone());
      const zoneRef = provider.findAndImport(stack, 'MyZoneProvider');

      // THEN
      test.deepEqual(zoneProps, cdkZoneProps);
      test.deepEqual(zoneRef.hostedZoneId, cdkZone.hostedZoneId);
      test.done();
    },
  }
};
