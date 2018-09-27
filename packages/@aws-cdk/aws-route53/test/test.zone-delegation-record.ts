import { exactlyMatchTemplate, expect } from '@aws-cdk/assert';
import { App, Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { PublicHostedZone, ZoneDelegationRecord } from '../lib';

export = {
  'Zone Delegation records': {
    NS(test: Test) {
      const app = new TestApp();
      const zone = new PublicHostedZone(app.stack, 'HostedZone', { zoneName: 'test.public' });
      new ZoneDelegationRecord(zone, 'NS', {
        delegatedZoneName: 'foo',
        nameServers: ['ns-1777.awsdns-30.co.uk']
      });
      expect(app.synthesizeTemplate()).to(exactlyMatchTemplate({
        Resources: {
          HostedZoneDB99F866: {
            Type: 'AWS::Route53::HostedZone',
            Properties: {
              Name: 'test.public.'
            }
          },
          HostedZoneNS1BB87CC3: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
              HostedZoneId: {
              Ref: 'HostedZoneDB99F866'
              },
              Name: 'foo.test.public.',
              ResourceRecords: ['ns-1777.awsdns-30.co.uk.'],
              Type: 'NS',
              TTL: '172800'
            }
            }
        }
      }));
      test.done();
    }
  }
};

class TestApp {
  public readonly stack: Stack;
  private readonly app = new App();

  constructor() {
    const account = '123456789012';
    const region = 'bermuda-triangle';
    this.app.setContext(`availability-zones:${account}:${region}`,
              [`${region}-1a`]);
    this.stack = new Stack(this.app, 'MyStack', { env: { account, region } });
  }

  public synthesizeTemplate() {
    return this.app.synthesizeStack(this.stack.name);
  }
}
