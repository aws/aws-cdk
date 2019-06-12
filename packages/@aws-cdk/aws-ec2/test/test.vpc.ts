import { countResources, expect, haveResource, haveResourceLike, isSuperObject } from '@aws-cdk/assert';
import { Construct, Context, Stack, Tag } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { CfnVPC, DefaultInstanceTenancy, IVpc, SubnetType, Vpc } from '../lib';
import { exportVpc } from './export-helper';

export = {
  "When creating a VPC": {
    "with the default CIDR range": {

      "vpc.vpcId returns a token to the VPC ID"(test: Test) {
        const stack = getTestStack();
        const vpc = new Vpc(stack, 'TheVPC');
        test.deepEqual(stack.resolve(vpc.vpcId), {Ref: 'TheVPC92636AB0' } );
        test.done();
      },

      "it uses the correct network range"(test: Test) {
        const stack = getTestStack();
        new Vpc(stack, 'TheVPC');
        expect(stack).to(haveResource('AWS::EC2::VPC', {
          CidrBlock: Vpc.DEFAULT_CIDR_RANGE,
          EnableDnsHostnames: true,
          EnableDnsSupport: true,
          InstanceTenancy: DefaultInstanceTenancy.Default,
        }));
        test.done();
      },
      'the Name tag is defaulted to path'(test: Test) {
        const stack = getTestStack();
        new Vpc(stack, 'TheVPC');
        expect(stack).to(
          haveResource('AWS::EC2::VPC',
            hasTags( [ {Key: 'Name', Value: 'TheVPC'} ]))
        );
        expect(stack).to(
          haveResource('AWS::EC2::InternetGateway',
            hasTags( [ {Key: 'Name', Value: 'TheVPC'} ]))
        );
        test.done();
      },

    },

    "with all of the properties set, it successfully sets the correct VPC properties"(test: Test) {
      const stack = getTestStack();
      new Vpc(stack, 'TheVPC', {
        cidr: "192.168.0.0/16",
        enableDnsHostnames: false,
        enableDnsSupport: false,
        defaultInstanceTenancy: DefaultInstanceTenancy.Dedicated,
      });

      expect(stack).to(haveResource('AWS::EC2::VPC', {
        CidrBlock: '192.168.0.0/16',
        EnableDnsHostnames: false,
        EnableDnsSupport: false,
        InstanceTenancy: DefaultInstanceTenancy.Dedicated,
      }));
      test.done();
    },

    "contains the correct number of subnets"(test: Test) {
      const stack = getTestStack();
      const vpc = new Vpc(stack, 'TheVPC');
      const zones = Context.getAvailabilityZones(stack).length;
      test.equal(vpc.publicSubnets.length, zones);
      test.equal(vpc.privateSubnets.length, zones);
      test.deepEqual(stack.resolve(vpc.vpcId), { Ref: 'TheVPC92636AB0' });
      test.done();
    },

    "with only isolated subnets, the VPC should not contain an IGW or NAT Gateways"(test: Test) {
      const stack = getTestStack();
      new Vpc(stack, 'TheVPC', {
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
      new Vpc(stack, 'TheVPC', {
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
      const zones = Context.getAvailabilityZones(stack).length;
      new Vpc(stack, 'TheVPC', { });
      expect(stack).to(countResources("AWS::EC2::InternetGateway", 1));
      expect(stack).to(countResources("AWS::EC2::NatGateway", zones));
      test.done();
    },

    "with subnets and reserved subnets defined, VPC subnet count should not contain reserved subnets "(test: Test) {
      const stack = getTestStack();
      new Vpc(stack, 'TheVPC', {
        cidr: '10.0.0.0/16',
        subnetConfiguration: [
          {
            cidrMask: 24,
            subnetType: SubnetType.Private,
            name: 'Private',
          },
          {
            cidrMask: 24,
            name: 'reserved',
            subnetType: SubnetType.Private,
            reserved: true,
          },
          {
            cidrMask: 28,
            name: 'rds',
            subnetType: SubnetType.Isolated,
          }
        ],
        maxAZs: 3
      });
      expect(stack).to(countResources("AWS::EC2::Subnet", 6));
      test.done();
    },
    "with reserved subnets, any other subnets should not have cidrBlock from within reserved space"(test: Test) {
      const stack = getTestStack();
      new Vpc(stack, 'TheVPC', {
        cidr: '10.0.0.0/16',
        subnetConfiguration: [
          {
            cidrMask: 24,
            name: 'ingress',
            subnetType: SubnetType.Private,
          },
          {
            cidrMask: 24,
            name: 'reserved',
            subnetType: SubnetType.Private,
            reserved: true,
          },
          {
            cidrMask: 24,
            name: 'rds',
            subnetType: SubnetType.Private,
          }
        ],
        maxAZs: 3
      });
      for (let i = 0; i < 3; i++) {
        expect(stack).to(haveResource("AWS::EC2::Subnet", {
          CidrBlock: `10.0.${i}.0/24`
        }));
      }
      for (let i = 3; i < 6; i++) {
        expect(stack).notTo(haveResource("AWS::EC2::Subnet", {
          CidrBlock: `10.0.${i}.0/24`
        }));
      }
      for (let i = 6; i < 9; i++) {
        expect(stack).to(haveResource("AWS::EC2::Subnet", {
          CidrBlock: `10.0.${i}.0/24`
        }));
      }
      test.done();
    },
    "with custom subnets, the VPC should have the right number of subnets, an IGW, and a NAT Gateway per AZ"(test: Test) {
      const stack = getTestStack();
      const zones = Context.getAvailabilityZones(stack).length;
      new Vpc(stack, 'TheVPC', {
        cidr: '10.0.0.0/21',
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
      test.done();
    },
    "with custom subents and natGateways = 2 there should be only two NATGW"(test: Test) {
      const stack = getTestStack();
      new Vpc(stack, 'TheVPC', {
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
      test.throws(() => new Vpc(stack, 'TheVPC', {
        enableDnsHostnames: true,
        enableDnsSupport: false
      }));
      test.done();
    },
    "with public subnets MapPublicIpOnLaunch is true"(test: Test) {
      const stack = getTestStack();
      new Vpc(stack, 'VPC', {
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

    "maxAZs defaults to 3 if unset"(test: Test) {
      const stack = getTestStack();
      new Vpc(stack, 'VPC');
      expect(stack).to(countResources("AWS::EC2::Subnet", 6));
      expect(stack).to(countResources("AWS::EC2::Route", 6));
      for (let i = 0; i < 6; i++) {
        expect(stack).to(haveResource("AWS::EC2::Subnet", {
          CidrBlock: `10.0.${i * 32}.0/19`
        }));
      }
      expect(stack).to(haveResourceLike("AWS::EC2::Route", {
        DestinationCidrBlock: '0.0.0.0/0',
        NatGatewayId: { },
      }));

      test.done();
    },

    "with maxAZs set to 2"(test: Test) {
      const stack = getTestStack();
      new Vpc(stack, 'VPC', { maxAZs: 2 });
      expect(stack).to(countResources("AWS::EC2::Subnet", 4));
      expect(stack).to(countResources("AWS::EC2::Route", 4));
      for (let i = 0; i < 4; i++) {
        expect(stack).to(haveResource("AWS::EC2::Subnet", {
          CidrBlock: `10.0.${i * 64}.0/18`
        }));
      }
      expect(stack).to(haveResourceLike("AWS::EC2::Route", {
        DestinationCidrBlock: '0.0.0.0/0',
        NatGatewayId: { },
      }));
      test.done();
    },
    "with natGateway set to 1"(test: Test) {
      const stack = getTestStack();
      new Vpc(stack, 'VPC', {
        natGateways: 1,
      });
      expect(stack).to(countResources("AWS::EC2::Subnet", 6));
      expect(stack).to(countResources("AWS::EC2::Route", 6));
      expect(stack).to(countResources("AWS::EC2::NatGateway", 1));
      expect(stack).to(haveResourceLike("AWS::EC2::Route", {
        DestinationCidrBlock: '0.0.0.0/0',
        NatGatewayId: { },
      }));
      test.done();
    },
    'with natGateway subnets defined'(test: Test) {
      const stack = getTestStack();
      new Vpc(stack, 'VPC', {
        subnetConfiguration: [
          {
            cidrMask: 24,
            name: 'ingress',
            subnetType: SubnetType.Public,
          },
          {
            cidrMask: 24,
            name: 'egress',
            subnetType: SubnetType.Public,
          },
          {
            cidrMask: 24,
            name: 'private',
            subnetType: SubnetType.Private,
          },
        ],
        natGatewaySubnets: {
          subnetName: 'egress'
        },
      });
      expect(stack).to(countResources("AWS::EC2::NatGateway", 3));
      for (let i = 1; i < 4; i++) {
        expect(stack).to(haveResource('AWS::EC2::Subnet', hasTags([{
          Key: 'Name',
          Value: `VPC/egressSubnet${i}`,
        }])));
      }
      test.done();
    },
    'with mis-matched nat and subnet configs it throws'(test: Test) {
      const stack = getTestStack();
      test.throws(() => new Vpc(stack, 'VPC', {
        subnetConfiguration: [
          {
            cidrMask: 24,
            name: 'ingress',
            subnetType: SubnetType.Public,
          },
          {
            cidrMask: 24,
            name: 'private',
            subnetType: SubnetType.Private,
          },
        ],
        natGatewaySubnets: {
          subnetName: 'notthere',
        },
      }));
      test.done();
    },
    'with a vpn gateway'(test: Test) {
      const stack = getTestStack();
      new Vpc(stack, 'VPC', {
        vpnGateway: true,
        vpnGatewayAsn: 65000
      });

      expect(stack).to(haveResource('AWS::EC2::VPNGateway', {
        AmazonSideAsn: 65000,
        Type: 'ipsec.1'
      }));

      expect(stack).to(haveResource('AWS::EC2::VPCGatewayAttachment', {
        VpcId: {
          Ref: 'VPCB9E5F0B4'
        },
        VpnGatewayId: {
          Ref: 'VPCVpnGatewayB5ABAE68'
        }
      }));

      expect(stack).to(haveResource('AWS::EC2::VPNGatewayRoutePropagation', {
        RouteTableIds: [
          {
            Ref: 'VPCPrivateSubnet1RouteTableBE8A6027'
          },
          {
            Ref: 'VPCPrivateSubnet2RouteTable0A19E10E'
          },
          {
            Ref: 'VPCPrivateSubnet3RouteTable192186F8'
          }
        ],
        VpnGatewayId: {
          Ref: 'VPCVpnGatewayB5ABAE68'
        }
      }));

      test.done();
    },
    'with a vpn gateway and route propagation on isolated subnets'(test: Test) {
      const stack = getTestStack();
      new Vpc(stack, 'VPC', {
        subnetConfiguration: [
          { subnetType: SubnetType.Private, name: 'Private' },
          { subnetType: SubnetType.Isolated, name: 'Isolated' },
        ],
        vpnGateway: true,
        vpnRoutePropagation: [
          {
            subnetType: SubnetType.Isolated
          }
        ]
      });

      expect(stack).to(haveResource('AWS::EC2::VPNGatewayRoutePropagation', {
        RouteTableIds: [
          {
            Ref: 'VPCIsolatedSubnet1RouteTableEB156210'
          },
          {
            Ref: 'VPCIsolatedSubnet2RouteTable9B4F78DC'
          },
          {
            Ref: 'VPCIsolatedSubnet3RouteTableCB6A1FDA'
          }
        ],
        VpnGatewayId: {
          Ref: 'VPCVpnGatewayB5ABAE68'
        }
      }));

      test.done();
    },
    'with a vpn gateway and route propagation on private and isolated subnets'(test: Test) {
      const stack = getTestStack();
      new Vpc(stack, 'VPC', {
        subnetConfiguration: [
          { subnetType: SubnetType.Private, name: 'Private' },
          { subnetType: SubnetType.Isolated, name: 'Isolated' },
        ],
        vpnGateway: true,
        vpnRoutePropagation: [
          {
            subnetType: SubnetType.Private
          },
          {
            subnetType: SubnetType.Isolated
          }
        ]
      });

      expect(stack).to(haveResource('AWS::EC2::VPNGatewayRoutePropagation', {
        RouteTableIds: [
          {
            Ref: 'VPCPrivateSubnet1RouteTableBE8A6027'
          },
          {
            Ref: 'VPCPrivateSubnet2RouteTable0A19E10E'
          },
          {
            Ref: 'VPCPrivateSubnet3RouteTable192186F8'
          },
          {
            Ref: 'VPCIsolatedSubnet1RouteTableEB156210'
          },
          {
            Ref: 'VPCIsolatedSubnet2RouteTable9B4F78DC'
          },
          {
            Ref: 'VPCIsolatedSubnet3RouteTableCB6A1FDA'
          }
        ],
        VpnGatewayId: {
          Ref: 'VPCVpnGatewayB5ABAE68'
        }
      }));

      test.done();
    },
    'fails when specifying vpnConnections with vpnGateway set to false'(test: Test) {
      // GIVEN
      const stack = new Stack();

      test.throws(() => new Vpc(stack, 'VpcNetwork', {
        vpnGateway: false,
        vpnConnections: {
          VpnConnection: {
            asn: 65000,
            ip: '192.0.2.1'
          }
        }
      }), /`vpnConnections`.+`vpnGateway`.+false/);

      test.done();
    },
    'fails when specifying vpnGatewayAsn with vpnGateway set to false'(test: Test) {
      // GIVEN
      const stack = new Stack();

      test.throws(() => new Vpc(stack, 'VpcNetwork', {
        vpnGateway: false,
        vpnGatewayAsn: 65000,
      }), /`vpnGatewayAsn`.+`vpnGateway`.+false/);

      test.done();
    }

  },

  "When creating a VPC with a custom CIDR range": {
    "vpc.vpcCidrBlock is the correct network range"(test: Test) {
      const stack = getTestStack();
      new Vpc(stack, 'TheVPC', { cidr: '192.168.0.0/16' });
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
      const allTags  = {...tags, ...noPropTags};

      const vpc = new Vpc(stack, 'TheVPC');
      // overwrite to set propagate
      vpc.node.applyAspect(new Tag('BusinessUnit', 'Marketing', {includeResourceTypes: [CfnVPC.resourceTypeName]}));
      vpc.node.applyAspect(new Tag('VpcType', 'Good'));
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
      const vpc = new Vpc(stack, 'TheVPC');
      for (const subnet of vpc.publicSubnets) {
        const tag = {Key: 'Name', Value: subnet.node.path};
        expect(stack).to(haveResource('AWS::EC2::NatGateway', hasTags([tag])));
        expect(stack).to(haveResource('AWS::EC2::RouteTable', hasTags([tag])));
      }
      for (const subnet of vpc.privateSubnets) {
        const tag = {Key: 'Name', Value: subnet.node.path};
        expect(stack).to(haveResource('AWS::EC2::RouteTable', hasTags([tag])));
      }
      test.done();
    },
    'Tags can be added after the Vpc is created with `vpc.tags.setTag(...)`'(test: Test) {
      const stack = getTestStack();

      const vpc = new Vpc(stack, 'TheVPC');
      const tag = {Key: 'Late', Value: 'Adder'};
      expect(stack).notTo(haveResource('AWS::EC2::VPC', hasTags([tag])));
      vpc.node.applyAspect(new Tag(tag.Key, tag.Value));
      expect(stack).to(haveResource('AWS::EC2::VPC', hasTags([tag])));
      test.done();
    },
  },

  'subnet selection': {
    'selecting default subnets returns the private ones'(test: Test) {
      // GIVEN
      const stack = getTestStack();
      const vpc = new Vpc(stack, 'VPC');

      // WHEN
      const { subnetIds } = vpc.selectSubnets();

      // THEN
      test.deepEqual(subnetIds, vpc.privateSubnets.map(s => s.subnetId));
      test.done();
    },

    'can select public subnets'(test: Test) {
      // GIVEN
      const stack = getTestStack();
      const vpc = new Vpc(stack, 'VPC');

      // WHEN
      const { subnetIds } = vpc.selectSubnets({ subnetType: SubnetType.Public });

      // THEN
      test.deepEqual(subnetIds, vpc.publicSubnets.map(s => s.subnetId));

      test.done();
    },

    'can select isolated subnets'(test: Test) {
      // GIVEN
      const stack = getTestStack();
      const vpc = new Vpc(stack, 'VPC', {
        subnetConfiguration: [
          { subnetType: SubnetType.Private, name: 'Private' },
          { subnetType: SubnetType.Isolated, name: 'Isolated' },
        ]
      });

      // WHEN
      const { subnetIds } = vpc.selectSubnets({ subnetType: SubnetType.Isolated });

      // THEN
      test.deepEqual(subnetIds, vpc.isolatedSubnets.map(s => s.subnetId));

      test.done();
    },

    'can select subnets by name'(test: Test) {
      // GIVEN
      const stack = getTestStack();
      const vpc = new Vpc(stack, 'VPC', {
        subnetConfiguration: [
          { subnetType: SubnetType.Private, name: 'DontTalkToMe' },
          { subnetType: SubnetType.Isolated, name: 'DontTalkAtAll' },
        ]
      });

      // WHEN
      const { subnetIds } = vpc.selectSubnets({ subnetName: 'DontTalkToMe' });

      // THEN
      test.deepEqual(subnetIds, vpc.privateSubnets.map(s => s.subnetId));
      test.done();
    },

    'selecting default subnets in a VPC with only public subnets throws an error'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const vpc = Vpc.fromVpcAttributes(stack, 'VPC', {
        vpcId: 'vpc-1234',
        availabilityZones: ['dummy1a', 'dummy1b', 'dummy1c'],
        publicSubnetIds: ['pub-1', 'pub-2', 'pub-3'],
      });

      test.throws(() => {
        vpc.selectSubnets();
      }, /There are no 'Private' subnets in this VPC/);

      test.done();
    },

    'select subnets with az restriction'(test: Test) {
      // GIVEN
      const stack = getTestStack();
      const vpc = new Vpc(stack, 'VpcNetwork', {
        maxAZs: 1,
        subnetConfiguration: [
          {name: 'app', subnetType: SubnetType.Private },
          {name: 'db', subnetType: SubnetType.Private },
        ]
      });

      // WHEN
      const { subnetIds } = vpc.selectSubnets({ onePerAz: true });

      // THEN
      test.deepEqual(subnetIds.length, 1);
      test.deepEqual(subnetIds[0], vpc.privateSubnets[0].subnetId);
      test.done();
    }
  },

  'export/import': {
    'simple VPC'(test: Test) {
      // WHEN
      const vpc2 = doImportExportTest(stack => {
        return new Vpc(stack, 'TheVPC');
      });

      // THEN
      test.deepEqual(Stack.of(vpc2).resolve(vpc2.vpcId), {
        'Fn::ImportValue': 'TestStack:TheVPCVpcIdD346CDBA'
      });

      test.done();
    },

    'multiple subnets of the same type'(test: Test) {
      // WHEN
      const imported = doImportExportTest(stack => {
        return new Vpc(stack, 'TheVPC', {
          subnetConfiguration: [
            { name: 'Ingress', subnetType: SubnetType.Public },
            { name: 'Egress', subnetType: SubnetType.Public },
          ]
        });
      });

      // THEN
      test.deepEqual(Stack.of(imported).resolve(imported.vpcId), {
        'Fn::ImportValue': 'TestStack:TheVPCVpcIdD346CDBA'
      });

      test.equal(6, imported.publicSubnets.length);

      for (let i = 0; i < 3; i++) {
        // tslint:disable-next-line:max-line-length
        test.equal(true, imported.publicSubnets[i].node.id.startsWith('Ingress'), `${imported.publicSubnets[i].node.id} does not start with "Ingress"`);
      }
      for (let i = 3; i < 6; i++) {
        // tslint:disable-next-line:max-line-length
        test.equal(true, imported.publicSubnets[i].node.id.startsWith('Egress'), `${imported.publicSubnets[i].node.id} does not start with "Egress"`);
      }

      test.done();
    },

    'can select isolated subnets by type'(test: Test) {
      // GIVEN
      const importedVpc = doImportExportTest(stack => {
        return new Vpc(stack, 'TheVPC', {
          subnetConfiguration: [
            { subnetType: SubnetType.Private, name: 'Private' },
            { subnetType: SubnetType.Isolated, name: 'Isolated' },
          ]
        });
      });

      // WHEN
      const { subnetIds } = importedVpc.selectSubnets({ subnetType: SubnetType.Isolated });

      // THEN
      test.equal(3, importedVpc.isolatedSubnets.length);
      test.deepEqual(subnetIds, importedVpc.isolatedSubnets.map(s => s.subnetId));

      test.done();
    },

    'can select isolated subnets by name'(test: Test) {
      // Do the test with both default name and custom name
      for (const isolatedName of ['Isolated', 'LeaveMeAlone']) {
        // GIVEN
        const importedVpc = doImportExportTest(stack => {
          return new Vpc(stack, 'TheVPC', {
            subnetConfiguration: [
              { subnetType: SubnetType.Private, name: 'Private' },
              { subnetType: SubnetType.Isolated, name: isolatedName },
            ]
          });
        });

        // WHEN
        const { subnetIds } = importedVpc.selectSubnets({ subnetName: isolatedName });

        // THEN
        test.equal(3, importedVpc.isolatedSubnets.length);
        test.deepEqual(subnetIds, importedVpc.isolatedSubnets.map(s => s.subnetId));
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
function doImportExportTest(constructFn: (scope: Construct) => Vpc): IVpc {
  // GIVEN
  const stack1 = getTestStack();
  const stack2 = getTestStack();

  const vpc1 = constructFn(stack1);

  // WHEN
  return Vpc.fromVpcAttributes(stack2, 'VPC2', exportVpc(vpc1));
}

function toCfnTags(tags: any): Array<{Key: string, Value: string}> {
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
      // tslint:disable:no-console
      console.error('Tags are incorrect');
      console.error('found tags ', props.Tags);
      console.error('expected tags ', expectedTags);
      // tslint:enable:no-console
      throw e;
    }
  };
}
