import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { HostedZone, PrivateHostedZone, PublicHostedZone, TxtRecord } from '../lib';

describe('route53', () => {
  describe('default properties', () => {
    test('public hosted zone', () => {
      const app = new TestApp();
      new PublicHostedZone(app.stack, 'HostedZone', { zoneName: 'test.public' });
      Template.fromStack(app.stack).hasResourceProperties('AWS::Route53::HostedZone', {
        Name: 'test.public.',
      });

    });
    test('private hosted zone', () => {
      const app = new TestApp();
      const vpcNetwork = new ec2.Vpc(app.stack, 'VPC');
      new PrivateHostedZone(app.stack, 'HostedZone', { zoneName: 'test.private', vpc: vpcNetwork });
      Template.fromStack(app.stack).hasResourceProperties('AWS::Route53::HostedZone', {
        Name: 'test.private.',
        VPCs: [{
          VPCId: { Ref: 'VPCB9E5F0B4' },
          VPCRegion: 'bermuda-triangle',
        }],
      });
    });

    test('when specifying multiple VPCs', () => {
      const app = new TestApp();
      const vpcNetworkA = new ec2.Vpc(app.stack, 'VPC1');
      const vpcNetworkB = new ec2.Vpc(app.stack, 'VPC2');
      new PrivateHostedZone(app.stack, 'HostedZone', { zoneName: 'test.private', vpc: vpcNetworkA })
        .addVpc(vpcNetworkB);
      Template.fromStack(app.stack).hasResourceProperties('AWS::Route53::HostedZone', {
        Name: 'test.private.',
        VPCs: [{
          VPCId: { Ref: 'VPC17DE2CF87' },
          VPCRegion: 'bermuda-triangle',
        },
        {
          VPCId: { Ref: 'VPC2C1F0E711' },
          VPCRegion: 'bermuda-triangle',
        }],
      });
    });
  });

  test('exporting and importing works', () => {
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

    Template.fromStack(stack2).hasResourceProperties('AWS::Route53::RecordSet', {
      HostedZoneId: 'hosted-zone-id',
      Name: 'lookHere.cdk.local.',
      ResourceRecords: ['"SeeThere"'],
      Type: 'TXT',
    });
  });

  test('adds period to name if not provided', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new HostedZone(stack, 'MyHostedZone', {
      zoneName: 'zonename',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::HostedZone', {
      Name: 'zonename.',
    });
  });

  test('fails if zone name ends with a trailing dot', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    expect(() => new HostedZone(stack, 'MyHostedZone', { zoneName: 'zonename.' })).toThrow(/zone name must not end with a trailing dot/);
  });

  test('a hosted zone can be assiciated with a VPC either upon creation or using "addVpc"', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::HostedZone', {
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
    });
  });

  test('public zone cannot be associated with a vpc (runtime error)', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const zone = new PublicHostedZone(stack, 'MyHostedZone', { zoneName: 'zonename' });
    const vpc = new ec2.Vpc(stack, 'VPC');

    // THEN
    expect(() => zone.addVpc(vpc)).toThrow(/Cannot associate public hosted zones with a VPC/);
  });

  test('setting up zone delegation', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const zone = new PublicHostedZone(stack, 'TopZone', { zoneName: 'top.test' });
    const delegate = new PublicHostedZone(stack, 'SubZone', { zoneName: 'sub.top.test' });

    // WHEN
    zone.addDelegation(delegate, { ttl: cdk.Duration.seconds(1337) });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
      Type: 'NS',
      Name: 'sub.top.test.',
      HostedZoneId: stack.resolve(zone.hostedZoneId),
      ResourceRecords: stack.resolve(delegate.hostedZoneNameServers),
      TTL: '1337',
    });
  });

  test('public hosted zone wiht caaAmazon set to true', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new PublicHostedZone(stack, 'MyHostedZone', {
      zoneName: 'protected.com',
      caaAmazon: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
      Type: 'CAA',
      Name: 'protected.com.',
      ResourceRecords: [
        '0 issue "amazon.com"',
      ],
    });
  });
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
