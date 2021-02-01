import { beASupersetOfTemplate, exactlyMatchTemplate, expect, haveResource } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { HostedZone, PrivateHostedZone, PublicHostedZone, TxtRecord } from '../lib';

nodeunitShim({
  'default properties': {
    'public hosted zone'(test: Test) {
      const app = new TestApp();
      new PublicHostedZone(app.stack, 'HostedZone', { zoneName: 'test.public' });
      expect(app.stack).to(exactlyMatchTemplate({
        Resources: {
          HostedZoneDB99F866: {
            Type: 'AWS::Route53::HostedZone',
            Properties: {
              Name: 'test.public.',
            },
          },
        },
      }));
      test.done();
    },
    'private hosted zone'(test: Test) {
      const app = new TestApp();
      const vpcNetwork = new ec2.Vpc(app.stack, 'VPC');
      new PrivateHostedZone(app.stack, 'HostedZone', { zoneName: 'test.private', vpc: vpcNetwork });
      expect(app.stack).to(beASupersetOfTemplate({
        Resources: {
          HostedZoneDB99F866: {
            Type: 'AWS::Route53::HostedZone',
            Properties: {
              Name: 'test.private.',
              VPCs: [{
                VPCId: { Ref: 'VPCB9E5F0B4' },
                VPCRegion: 'bermuda-triangle',
              }],
            },
          },
        },
      }));
      test.done();
    },
    'when specifying multiple VPCs'(test: Test) {
      const app = new TestApp();
      const vpcNetworkA = new ec2.Vpc(app.stack, 'VPC1');
      const vpcNetworkB = new ec2.Vpc(app.stack, 'VPC2');
      new PrivateHostedZone(app.stack, 'HostedZone', { zoneName: 'test.private', vpc: vpcNetworkA })
        .addVpc(vpcNetworkB);
      expect(app.stack).to(beASupersetOfTemplate({
        Resources: {
          HostedZoneDB99F866: {
            Type: 'AWS::Route53::HostedZone',
            Properties: {
              Name: 'test.private.',
              VPCs: [{
                VPCId: { Ref: 'VPC17DE2CF87' },
                VPCRegion: 'bermuda-triangle',
              },
              {
                VPCId: { Ref: 'VPC2C1F0E711' },
                VPCRegion: 'bermuda-triangle',
              }],
            },
          },
        },
      }));
      test.done();
    },
  },

  'exporting and importing works'(test: Test) {
    const stack2 = new cdk.Stack();

    const importedZone = HostedZone.fromHostedZoneAttributes(stack2, 'Imported', {
      hostedZoneId: 'hosted-zone-id',
      zoneName: 'cdk.local',
    });

    new TxtRecord(importedZone as any, 'Record', {
      zone: importedZone,
      recordName: 'lookHere',
      values: ['SeeThere'],
    });

    expect(stack2).to(haveResource('AWS::Route53::RecordSet', {
      HostedZoneId: 'hosted-zone-id',
      Name: 'lookHere.cdk.local.',
      ResourceRecords: ['"SeeThere"'],
      Type: 'TXT',
    }));

    test.done();
  },

  'adds period to name if not provided'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new HostedZone(stack, 'MyHostedZone', {
      zoneName: 'zonename',
    });

    // THEN
    expect(stack).to(haveResource('AWS::Route53::HostedZone', {
      Name: 'zonename.',
    }));
    test.done();
  },

  'fails if zone name ends with a trailing dot'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    test.throws(() => new HostedZone(stack, 'MyHostedZone', { zoneName: 'zonename.' }), /zone name must not end with a trailing dot/);
    test.done();
  },

  'a hosted zone can be assiciated with a VPC either upon creation or using "addVpc"'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc1 = new ec2.Vpc(stack, 'VPC1');
    const vpc2 = new ec2.Vpc(stack, 'VPC2');
    const vpc3 = new ec2.Vpc(stack, 'VPC3');

    // WHEN
    const zone = new HostedZone(stack, 'MyHostedZone', {
      zoneName: 'zonename',
      vpcs: [vpc1, vpc2],
    });
    zone.addVpc(vpc3);

    // THEN
    expect(stack).to(haveResource('AWS::Route53::HostedZone', {
      VPCs: [
        {
          VPCId: {
            Ref: 'VPC17DE2CF87',
          },
          VPCRegion: {
            Ref: 'AWS::Region',
          },
        },
        {
          VPCId: {
            Ref: 'VPC2C1F0E711',
          },
          VPCRegion: {
            Ref: 'AWS::Region',
          },
        },
        {
          VPCId: {
            Ref: 'VPC3CB5FCDA8',
          },
          VPCRegion: {
            Ref: 'AWS::Region',
          },
        },
      ],
    }));
    test.done();
  },

  'public zone cannot be associated with a vpc (runtime error)'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const zone = new PublicHostedZone(stack, 'MyHostedZone', { zoneName: 'zonename' });
    const vpc = new ec2.Vpc(stack, 'VPC');

    // THEN
    test.throws(() => zone.addVpc(vpc), /Cannot associate public hosted zones with a VPC/);
    test.done();
  },

  'setting up zone delegation'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const zone = new PublicHostedZone(stack, 'TopZone', { zoneName: 'top.test' });
    const delegate = new PublicHostedZone(stack, 'SubZone', { zoneName: 'sub.top.test' });

    // WHEN
    zone.addDelegation(delegate, { ttl: cdk.Duration.seconds(1337) });

    // THEN
    expect(stack).to(haveResource('AWS::Route53::RecordSet', {
      Type: 'NS',
      Name: 'sub.top.test.',
      HostedZoneId: stack.resolve(zone.hostedZoneId),
      ResourceRecords: stack.resolve(delegate.hostedZoneNameServers),
      TTL: '1337',
    }));
    test.done();
  },

  'public hosted zone wiht caaAmazon set to true'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new PublicHostedZone(stack, 'MyHostedZone', {
      zoneName: 'protected.com',
      caaAmazon: true,
    });

    // THEN
    expect(stack).to(haveResource('AWS::Route53::RecordSet', {
      Type: 'CAA',
      Name: 'protected.com.',
      ResourceRecords: [
        '0 issue "amazon.com"',
      ],
    }));
    test.done();
  },
});

class TestApp {
  public readonly stack: cdk.Stack;
  private readonly app: cdk.App;

  constructor() {
    const account = '123456789012';
    const region = 'bermuda-triangle';
    const context = {
      [`availability-zones:${account}:${region}`]: `${region}-1a`,
    };
    this.app = new cdk.App({ context });
    this.stack = new cdk.Stack(this.app, 'MyStack', { env: { account, region } });
  }
}
