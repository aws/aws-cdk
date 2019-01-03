import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import { HostedZone, HostedZoneImportProps, HostedZoneProvider } from '../lib';

export = {
  'Hosted Zone Provider': {
    'HostedZoneProvider will return context values if availble'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack(undefined, 'TestStack', { env: { account: '12345', region: 'us-east-1' } });
      const filter = {domainName: 'test.com'};
      new HostedZoneProvider(stack, filter).findHostedZone();
      const key = Object.keys(stack.missingContext)[0];

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

      stack.node.setContext(key, fakeZone);

      const cdkZoneProps: HostedZoneImportProps = {
        hostedZoneId: fakeZone.Id,
        zoneName: 'example.com',
      };

      const cdkZone = HostedZone.import(stack, 'MyZone', cdkZoneProps);

      // WHEN
      const provider = new HostedZoneProvider(stack, filter);
      const zoneProps = cdk.resolve(provider.findHostedZone());
      const zoneRef = provider.findAndImport(stack, 'MyZoneProvider');

      // THEN
      test.deepEqual(zoneProps, cdkZoneProps);
      test.deepEqual(zoneRef.hostedZoneId, cdkZone.hostedZoneId);
      test.done();
    },
  }
};
