import { beASupersetOfTemplate, exactlyMatchTemplate, expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import { HostedZoneRef, PrivateHostedZone, PublicHostedZone, TXTRecord } from '../lib';

export = {
  'default properties': {
    'public hosted zone'(test: Test) {
      const app = new TestApp();
      new PublicHostedZone(app.stack, 'HostedZone', { zoneName: 'test.public' });
      expect(app.synthesizeTemplate()).to(exactlyMatchTemplate({
        Resources: {
          HostedZoneDB99F866: {
            Type: "AWS::Route53::HostedZone",
            Properties: {
              Name: "test.public."
            }
          }
        }
      }));
      test.done();
    },
    'private hosted zone'(test: Test) {
      const app = new TestApp();
      const vpcNetwork = new ec2.VpcNetwork(app.stack, 'VPC');
      new PrivateHostedZone(app.stack, 'HostedZone', { zoneName: 'test.private', vpc: vpcNetwork });
      expect(app.synthesizeTemplate()).to(beASupersetOfTemplate({
        Resources: {
          HostedZoneDB99F866: {
            Type: "AWS::Route53::HostedZone",
            Properties: {
              Name: "test.private.",
              VPCs: [{
                VPCId: { Ref: 'VPCB9E5F0B4' },
                VPCRegion: { Ref: 'AWS::Region' }
              }]
            }
          }
        }
      }));
      test.done();
    },
    'when specifying multiple VPCs'(test: Test) {
      const app = new TestApp();
      const vpcNetworkA = new ec2.VpcNetwork(app.stack, 'VPC1');
      const vpcNetworkB = new ec2.VpcNetwork(app.stack, 'VPC2');
      new PrivateHostedZone(app.stack, 'HostedZone', { zoneName: 'test.private', vpc: vpcNetworkA })
        .addVpc(vpcNetworkB);
      expect(app.synthesizeTemplate()).to(beASupersetOfTemplate({
        Resources: {
          HostedZoneDB99F866: {
            Type: "AWS::Route53::HostedZone",
            Properties: {
              Name: "test.private.",
              VPCs: [{
                VPCId: { Ref: 'VPC17DE2CF87' },
                VPCRegion: { Ref: 'AWS::Region' }
              },
              {
                VPCId: { Ref: 'VPC2C1F0E711' },
                VPCRegion: { Ref: 'AWS::Region' }
              }]
            }
          }
        }
      }));
      test.done();
    }
  },

  'exporting and importing works'(test: Test) {
    const stack1 = new cdk.Stack();
    const stack2 = new cdk.Stack();

    const zone = new PublicHostedZone(stack1, 'Zone', {
      zoneName: 'cdk.local',
    });

    const zoneRef = zone.export();
    const importedZone = HostedZoneRef.import(stack2, 'Imported', zoneRef);
    new TXTRecord(importedZone, 'Record', {
      recordName: 'lookHere',
      recordValue: 'SeeThere'
    });

    expect(stack1).to(exactlyMatchTemplate({
      Resources: {
        ZoneA5DE4B68: {
          Type: "AWS::Route53::HostedZone",
          Properties: {
            Name: "cdk.local."
          }
        }
      },
      Outputs: {
        ZoneHostedZoneId413B8768: {
          Value: { Ref: "ZoneA5DE4B68" },
          Export: { Name: "ZoneHostedZoneId413B8768" }
        }
      }
    }));

    expect(stack2).to(haveResource("AWS::Route53::RecordSet", {
      HostedZoneId: { "Fn::ImportValue": "ZoneHostedZoneId413B8768" },
      Name: "lookHere.cdk.local.",
      ResourceRecords: [ "\"SeeThere\"" ],
      Type: "TXT"
    }));

    test.done();
  }
};

class TestApp {
  public readonly stack: cdk.Stack;
  private readonly app = new cdk.App();

  constructor() {
    const account = '123456789012';
    const region = 'bermuda-triangle';
    this.app.setContext(`availability-zones:${account}:${region}`,
      [`${region}-1a`]);
    this.stack = new cdk.Stack(this.app, 'MyStack', { env: { account, region } });
  }

  public synthesizeTemplate() {
    return this.app.synthesizeStack(this.stack.name);
  }
}
