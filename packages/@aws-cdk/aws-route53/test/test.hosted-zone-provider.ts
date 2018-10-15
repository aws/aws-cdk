import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import { HostedZoneProvider } from '../lib';

export = {
  'Hosted Zone Provider': {
    'HostedZoneProvider will return context values if availble'(test: Test) {
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

      stack.setContext(key, fakeZone);

      const cdkZone = {
        hostedZoneId: fakeZone.Id,
        zoneName: 'example.com',
      };

      const zone = cdk.resolve(new HostedZoneProvider(stack, filter).findHostedZone());
      test.deepEqual(zone, cdkZone);
      test.done();
    },
  }
};
