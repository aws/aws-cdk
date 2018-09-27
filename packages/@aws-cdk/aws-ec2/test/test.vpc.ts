import { countResources, expect, haveResource, isSuperObject } from '@aws-cdk/assert';
import { AvailabilityZoneProvider, Construct, resolve, Stack, Tags } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { DefaultInstanceTenancy, SubnetType, VpcNetwork, VpcNetworkRef } from '../lib';

export = {
  "When creating a VPC": {
    "with the default CIDR range": {

      "vpc.vpcId returns a token to the VPC ID"(test: Test) {
        const stack = getTestStack();
        const vpc = new VpcNetwork(stack, 'TheVPC');
        test.deepEqual(resolve(vpc.vpcId), {Ref: 'TheVPC92636AB0' } );
        test.done();
      },

      "it uses the correct network range"(test: Test) {
        const stack = getTestStack();
        new VpcNetwork(stack, 'TheVPC');
        expect(stack).to(haveResource('AWS::EC2::VPC', {
          CidrBlock: VpcNetwork.DEFAULT_CIDR_RANGE,
          EnableDnsHostnames: true,
          EnableDnsSupport: true,
          InstanceTenancy: DefaultInstanceTenancy.Default,
        }));
        test.done();
      },
      'the Name tag is defaulted to path'(test: Test) {
        const stack = getTestStack();
        new VpcNetwork(stack, 'TheVPC');
        expect(stack).to(haveResource('AWS::EC2::VPC',
          hasTags( [ {Key: 'Name', Value: 'TheVPC'} ])));
        test.done();
      },

    },

    "with all of the properties set, it successfully sets the correct VPC properties"(test: Test) {
      const stack = getTestStack();
      const tags = {
        first: 'foo',
        second: 'bar',
        third: 'barz',

      };
      new VpcNetwork(stack, 'TheVPC', {
        cidr: "192.168.0.0/16",
        enableDnsHostnames: false,
        enableDnsSupport: false,
        defaultInstanceTenancy: DefaultInstanceTenancy.Dedicated,
        tags,
      });

      const cfnTags = toCfnTags(tags);
      expect(stack).to(haveResource('AWS::EC2::VPC', {
        CidrBlock: '192.168.0.0/16',
        EnableDnsHostnames: false,
        EnableDnsSupport: false,
        InstanceTenancy: DefaultInstanceTenancy.Dedicated,
      }));
      expect(stack).to(haveResource('AWS::EC2::VPC', hasTags(cfnTags)));
      test.done();
    },

    "contains the correct number of subnets"(test: Test) {
      const stack = getTestStack();
      const vpc = new VpcNetwork(stack, 'TheVPC');
      const zones = new AvailabilityZoneProvider(stack).availabilityZones.length;
      test.equal(vpc.publicSubnets.length, zones);
      test.equal(vpc.privateSubnets.length, zones);
      test.deepEqual(resolve(vpc.vpcId), { Ref: 'TheVPC92636AB0' });
      test.done();
    },

    "with only isolated subnets, the VPC should not contain an IGW or NAT Gateways"(test: Test) {
      const stack = getTestStack();
      new VpcNetwork(stack, 'TheVPC', {
        subnetConfiguration: [
          {
            subnetType: SubnetType.Isolated,
            name: 'Isolated',
          }
        ]
      });
      expect(stack).notTo(haveResource("AWS::EC2::InternetGateway"));
      expect(stack).notTo(haveResource("AWS::EC2::NatGateway"));
      expect(stack).to(haveResource("AWS::EC2::Subnet", {
        MapPublicIpOnLaunch: false
      }));
      test.done();
    },

    "with no private subnets, the VPC should have an IGW but no NAT Gateways"(test: Test) {
      const stack = getTestStack();
      new VpcNetwork(stack, 'TheVPC', {
        subnetConfiguration: [
          {
            subnetType: SubnetType.Public,
            name: 'Public',
          },
          {
            subnetType: SubnetType.Isolated,
            name: 'Isolated',
          }
        ]
      });
      expect(stack).to(countResources('AWS::EC2::InternetGateway', 1));
      expect(stack).notTo(haveResource("AWS::EC2::NatGateway"));
      test.done();
    },

    "with no subnets defined, the VPC should have an IGW, and a NAT Gateway per AZ"(test: Test) {
      const stack = getTestStack();
      const zones = new AvailabilityZoneProvider(stack).availabilityZones.length;
      new VpcNetwork(stack, 'TheVPC', { });
      expect(stack).to(countResources("AWS::EC2::InternetGateway", 1));
      expect(stack).to(countResources("AWS::EC2::NatGateway", zones));
      test.done();
    },

    "with custom subents, the VPC should have the right number of subnets, an IGW, and a NAT Gateway per AZ"(test: Test) {
      const stack = getTestStack();
      const zones = new AvailabilityZoneProvider(stack).availabilityZones.length;
      new VpcNetwork(stack, 'TheVPC', {
        cidr: '10.0.0.0/21',
        subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'ingress',
          subnetType: SubnetType.Public,
          tags: {
            type: 'Public',
            init: 'No',
          },
        },
        {
          cidrMask: 24,
          name: 'application',
          subnetType: SubnetType.Private,
        },
        {
          cidrMask: 28,
          name: 'rds',
          subnetType: SubnetType.Isolated,
        }
        ],
        maxAZs: 3
      });
      expect(stack).to(countResources("AWS::EC2::InternetGateway", 1));
      expect(stack).to(countResources("AWS::EC2::NatGateway", zones));
      expect(stack).to(countResources("AWS::EC2::Subnet", 9));
      for (let i = 0; i < 6; i++) {
        expect(stack).to(haveResource("AWS::EC2::Subnet", {
        CidrBlock: `10.0.${i}.0/24`
        }));
      }
      for (let i = 0; i < 3; i++) {
        expect(stack).to(haveResource("AWS::EC2::Subnet", {
        CidrBlock: `10.0.6.${i * 16}/28`
        }));
      }
      expect(stack).to(haveResource("AWS::EC2::Subnet", hasTags(
        [
          { Key: 'type', Value: 'Public'},
          { Key: 'init', Value: 'No'},
        ],
      )));
      test.done();
    },
    "with custom subents and natGateways = 2 there should be only two NATGW"(test: Test) {
      const stack = getTestStack();
      new VpcNetwork(stack, 'TheVPC', {
        cidr: '10.0.0.0/21',
        natGateways: 2,
        subnetConfiguration: [
          {
            cidrMask: 24,
            name: 'ingress',
            subnetType: SubnetType.Public,
          },
          {
            cidrMask: 24,
            name: 'application',
            subnetType: SubnetType.Private,
          },
          {
            cidrMask: 28,
            name: 'rds',
            subnetType: SubnetType.Isolated,
          }
        ],
        maxAZs: 3
      });
      expect(stack).to(countResources("AWS::EC2::InternetGateway", 1));
      expect(stack).to(countResources("AWS::EC2::NatGateway", 2));
      expect(stack).to(countResources("AWS::EC2::Subnet", 9));
      for (let i = 0; i < 6; i++) {
        expect(stack).to(haveResource("AWS::EC2::Subnet", {
          CidrBlock: `10.0.${i}.0/24`
        }));
      }
      for (let i = 0; i < 3; i++) {
        expect(stack).to(haveResource("AWS::EC2::Subnet", {
          CidrBlock: `10.0.6.${i * 16}/28`
        }));
      }
      test.done();
    },
    "with enableDnsHostnames enabled but enableDnsSupport disabled, should throw an Error"(test: Test) {
      const stack = getTestStack();
      test.throws(() => new VpcNetwork(stack, 'TheVPC', {
        enableDnsHostnames: true,
        enableDnsSupport: false
      }));
      test.done();
    },
    "with public subnets MapPublicIpOnLaunch is true"(test: Test) {
      const stack = getTestStack();
      new VpcNetwork(stack, 'VPC', {
        maxAZs: 1,
        subnetConfiguration: [
          {
            cidrMask: 24,
            name: 'ingress',
            subnetType: SubnetType.Public,
          }
        ],
      });
      expect(stack).to(countResources("AWS::EC2::Subnet", 1));
      expect(stack).notTo(haveResource("AWS::EC2::NatGateway"));
      expect(stack).to(haveResource("AWS::EC2::Subnet", {
        MapPublicIpOnLaunch: true
      }));
      test.done();
    },
    "with maxAZs set to 2"(test: Test) {
      const stack = getTestStack();
      new VpcNetwork(stack, 'VPC', { maxAZs: 2 });
      expect(stack).to(countResources("AWS::EC2::Subnet", 4));
      expect(stack).to(countResources("AWS::EC2::Route", 4));
      for (let i = 0; i < 4; i++) {
        expect(stack).to(haveResource("AWS::EC2::Subnet", {
          CidrBlock: `10.0.${i * 64}.0/18`
        }));
      }
      expect(stack).to(haveResource("AWS::EC2::Route", {
        DestinationCidrBlock: '0.0.0.0/0',
        NatGatewayId: { },
      }));
      test.done();
    },
    "with natGateway set to 1"(test: Test) {
      const stack = getTestStack();
      new VpcNetwork(stack, 'VPC', { natGateways: 1 });
      expect(stack).to(countResources("AWS::EC2::Subnet", 6));
      expect(stack).to(countResources("AWS::EC2::Route", 6));
      expect(stack).to(countResources("AWS::EC2::Subnet", 6));
      expect(stack).to(countResources("AWS::EC2::NatGateway", 1));
      expect(stack).to(haveResource("AWS::EC2::Route", {
        DestinationCidrBlock: '0.0.0.0/0',
        NatGatewayId: { },
      }));
      test.done();
    }

  },

  "When creating a VPC with a custom CIDR range": {
    "vpc.vpcCidrBlock is the correct network range"(test: Test) {
      const stack = getTestStack();
      new VpcNetwork(stack, 'TheVPC', { cidr: '192.168.0.0/16' });
      expect(stack).to(haveResource("AWS::EC2::VPC", {
        CidrBlock: '192.168.0.0/16'
      }));
      test.done();
    }
  },
  'When tagging': {
    'VPC propagated tags will be on subnet, IGW, routetables, NATGW'(test: Test) {
      const stack = getTestStack();
      const tags =  {
        VpcType: 'Good',
      };
      const noPropTags = {
        BusinessUnit: 'Marketing',
      };
      const allTags: Tags = {...tags, ...noPropTags};

      const vpc = new VpcNetwork(stack, 'TheVPC', { tags: allTags });
      // overwrite to set propagate
      vpc.tags.setTag('BusinessUnit', 'Marketing', {propagate: false});
      expect(stack).to(haveResource("AWS::EC2::VPC", hasTags(toCfnTags(allTags))));
      const taggables = ['Subnet', 'InternetGateway', 'NatGateway', 'RouteTable'];
      const propTags = toCfnTags(tags);
      const noProp = toCfnTags(noPropTags);
      for (const resource of taggables) {
        expect(stack).to(haveResource(`AWS::EC2::${resource}`, hasTags(propTags)));
        expect(stack).notTo(haveResource(`AWS::EC2::${resource}`, hasTags(noProp)));
      }
      test.done();
    },
    'Subnet Name will propagate to route tables and NATGW'(test: Test) {
      const stack = getTestStack();
      const vpc = new VpcNetwork(stack, 'TheVPC');
      for (const subnet of vpc.publicSubnets) {
        const tag = {Key: 'Name', Value: subnet.path};
        expect(stack).to(haveResource('AWS::EC2::NatGateway', hasTags([tag])));
        expect(stack).to(haveResource('AWS::EC2::RouteTable', hasTags([tag])));
      }
      for (const subnet of vpc.privateSubnets) {
        const tag = {Key: 'Name', Value: subnet.path};
        expect(stack).to(haveResource('AWS::EC2::RouteTable', hasTags([tag])));
      }
      test.done();
    },
    'Tags can be added after the Vpc is created with `vpc.tags.setTag(...)`'(test: Test) {
      const stack = getTestStack();
      const vpc = new VpcNetwork(stack, 'TheVPC');
      const tag = {Key: 'Late', Value: 'Adder'};
      expect(stack).notTo(haveResource('AWS::EC2::VPC', hasTags([tag])));
      vpc.tags.setTag(tag.Key, tag.Value);
      expect(stack).to(haveResource('AWS::EC2::VPC', hasTags([tag])));
      test.done();
    },
  },

  'can select public subnets'(test: Test) {
    // GIVEN
    const stack = getTestStack();
    const vpc = new VpcNetwork(stack, 'VPC');

    // WHEN
    const nets = vpc.subnets({ subnetsToUse: SubnetType.Public });

    // THEN
    test.deepEqual(nets, vpc.publicSubnets);

    test.done();
  },

  'can select isolated subnets'(test: Test) {
    // GIVEN
    const stack = getTestStack();
    const vpc = new VpcNetwork(stack, 'VPC', {
      subnetConfiguration: [
        { subnetType: SubnetType.Private, name: 'Private' },
        { subnetType: SubnetType.Isolated, name: 'Isolated' },
      ]
    });

    // WHEN
    const nets = vpc.subnets({ subnetsToUse: SubnetType.Isolated });

    // THEN
    test.deepEqual(nets, vpc.isolatedSubnets);

    test.done();
  },

  'can select subnets by name'(test: Test) {
    // GIVEN
    const stack = getTestStack();
    const vpc = new VpcNetwork(stack, 'VPC', {
      subnetConfiguration: [
        { subnetType: SubnetType.Private, name: 'DontTalkToMe' },
        { subnetType: SubnetType.Isolated, name: 'DontTalkAtAll' },
      ]
    });

    // WHEN
    const nets = vpc.subnets({ subnetName: 'DontTalkToMe' });

    // THEN
    test.deepEqual(nets, vpc.privateSubnets);
    test.done();
  },

  'export/import': {
    'simple VPC'(test: Test) {
      // WHEN
      const vpc2 = doImportExportTest(stack => {
        return new VpcNetwork(stack, 'TheVPC');
      });

      // THEN
      test.deepEqual(resolve(vpc2.vpcId), {
        'Fn::ImportValue': 'TestStack:TheVPCVpcIdD346CDBA'
      });

      test.done();
    },

    'multiple subnets of the same type'(test: Test) {
      // WHEN
      const imported = doImportExportTest(stack => {
        return new VpcNetwork(stack, 'TheVPC', {
          subnetConfiguration: [
            { name: 'Ingress', subnetType: SubnetType.Public },
            { name: 'Egress', subnetType: SubnetType.Public },
          ]
        });
      });

      // THEN
      test.deepEqual(resolve(imported.vpcId), {
        'Fn::ImportValue': 'TestStack:TheVPCVpcIdD346CDBA'
      });

      test.equal(6, imported.publicSubnets.length);

      for (let i = 0; i < 3; i++) {
        test.equal(true, imported.publicSubnets[i].id.startsWith('Ingress'), `${imported.publicSubnets[i].id} does not start with "Ingress"`);
      }
      for (let i = 3; i < 6; i++) {
        test.equal(true, imported.publicSubnets[i].id.startsWith('Egress'), `${imported.publicSubnets[i].id} does not start with "Egress"`);
      }

      test.done();
    },

    'can select isolated subnets by type'(test: Test) {
      // GIVEN
      const importedVpc = doImportExportTest(stack => {
        return new VpcNetwork(stack, 'TheVPC', {
          subnetConfiguration: [
            { subnetType: SubnetType.Private, name: 'Private' },
            { subnetType: SubnetType.Isolated, name: 'Isolated' },
          ]
        });
      });

      // WHEN
      const nets = importedVpc.subnets({ subnetsToUse: SubnetType.Isolated });

      // THEN
      test.equal(3, importedVpc.isolatedSubnets.length);
      test.deepEqual(nets, importedVpc.isolatedSubnets);

      test.done();
    },

    'can select isolated subnets by name'(test: Test) {
      // Do the test with both default name and custom name
      for (const isolatedName of ['Isolated', 'LeaveMeAlone']) {
        // GIVEN
        const importedVpc = doImportExportTest(stack => {
          return new VpcNetwork(stack, 'TheVPC', {
            subnetConfiguration: [
              { subnetType: SubnetType.Private, name: 'Private' },
              { subnetType: SubnetType.Isolated, name: isolatedName },
            ]
          });
        });

        // WHEN
        const nets = importedVpc.subnets({ subnetName: isolatedName });

        // THEN
        test.equal(3, importedVpc.isolatedSubnets.length);
        test.deepEqual(nets, importedVpc.isolatedSubnets);
      }

      test.done();
    },
  },
};

function getTestStack(): Stack {
  return new Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-east-1' } });
}

/**
 * Do a complete import/export test, return the imported VPC
 */
function doImportExportTest(constructFn: (parent: Construct) => VpcNetwork): VpcNetworkRef {
  // GIVEN
  const stack1 = getTestStack();
  const stack2 = getTestStack();

  const vpc1 = constructFn(stack1);

  // WHEN
  return VpcNetwork.import(stack2, 'VPC2', vpc1.export());
}

function toCfnTags(tags: Tags): Array<{Key: string, Value: string}> {
  return Object.keys(tags).map( key => {
    return {Key: key, Value: tags[key]};
  });
}

function hasTags(expectedTags: Array<{Key: string, Value: string}>): (props: any) => boolean {
  return (props: any) => {
    try {
      const tags = props.Tags;
      const actualTags = tags.filter( (tag: {Key: string, Value: string}) => {
        for (const expectedTag of expectedTags) {
          if (isSuperObject(expectedTag, tag)) {
            return true;
          } else {
            continue;
          }
        }
        // no values in array so expecting empty
        return false;
      });
      return actualTags.length === expectedTags.length;
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.error('Invalid Tags array in ', props);
      throw e;
    }
  };
}
