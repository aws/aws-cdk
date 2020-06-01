import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { Construct, ContextProvider, GetContextValueOptions, GetContextValueResult, Lazy, Stack } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { Test } from 'nodeunit';
import { GenericLinuxImage, Instance, InstanceType, ISubnet, SubnetType, Vpc } from '../lib';

export = {
  'Vpc.fromLookup()': {
    'requires concrete values'(test: Test) {
      // GIVEN
      const stack = new Stack();

      test.throws(() => {
        Vpc.fromLookup(stack, 'Vpc', {
          vpcId: Lazy.stringValue({ produce: () => 'some-id' }),
        });

      }, 'All arguments to Vpc.fromLookup() must be concrete');

      test.done();
    },

    'selecting subnets by name from a looked-up VPC does not throw'(test: Test) {
      // GIVEN
      const stack = new Stack(undefined, undefined, { env: { region: 'us-east-1', account: '123456789012' }});
      const vpc = Vpc.fromLookup(stack, 'VPC', {
        vpcId: 'vpc-1234',
      });

      // WHEN
      vpc.selectSubnets({ subnetName: 'Bleep' });

      // THEN: no exception

      test.done();
    },

    'accepts asymmetric subnets'(test: Test) {
      const previous = mockVpcContextProviderWith(test, {
        vpcId: 'vpc-1234',
        subnetGroups: [
          {
            name: 'Public',
            type: cxapi.VpcSubnetGroupType.PUBLIC,
            subnets: [
              {
                subnetId: 'pub-sub-in-us-east-1a',
                availabilityZone: 'us-east-1a',
                routeTableId: 'rt-123',
              },
              {
                subnetId: 'pub-sub-in-us-east-1b',
                availabilityZone: 'us-east-1b',
                routeTableId: 'rt-123',
              },
            ],
          },
          {
            name: 'Private',
            type: cxapi.VpcSubnetGroupType.PRIVATE,
            subnets: [
              {
                subnetId: 'pri-sub-1-in-us-east-1c',
                availabilityZone: 'us-east-1c',
                routeTableId: 'rt-123',
              },
              {
                subnetId: 'pri-sub-2-in-us-east-1c',
                availabilityZone: 'us-east-1c',
                routeTableId: 'rt-123',
              },
              {
                subnetId: 'pri-sub-1-in-us-east-1d',
                availabilityZone: 'us-east-1d',
                routeTableId: 'rt-123',
              },
              {
                subnetId: 'pri-sub-2-in-us-east-1d',
                availabilityZone: 'us-east-1d',
                routeTableId: 'rt-123',
              },
            ],
          },
        ],
      }, options => {
        test.deepEqual(options.filter, {
          isDefault: 'true',
        });

        test.equal(options.subnetGroupNameTag, undefined);
      });

      const stack = new Stack();
      const vpc = Vpc.fromLookup(stack, 'Vpc', {
        isDefault: true,
      });

      test.deepEqual(vpc.availabilityZones, ['us-east-1a', 'us-east-1b', 'us-east-1c', 'us-east-1d']);
      test.equal(vpc.publicSubnets.length, 2);
      test.equal(vpc.privateSubnets.length, 4);
      test.equal(vpc.isolatedSubnets.length, 0);

      restoreContextProvider(previous);
      test.done();
    },

    'populates subnet available ip count info'(test: Test) {
      const previous = mockVpcContextProviderWith(test, {
        vpcId: 'vpc-1234',
        subnetGroups: [
          {
            name: 'Public',
            type: cxapi.VpcSubnetGroupType.PUBLIC,
            subnets: [
              {
                subnetId: 'pub-exh-sub-in-us-east-1a',
                availabilityZone: 'us-east-1a',
                routeTableId: 'rt-123',
                availableIpAddressCount: 0,
              },
              {
                subnetId: 'pub-sub-in-us-east-1b',
                availabilityZone: 'us-east-1b',
                routeTableId: 'rt-123',
              },
            ],
          },
          {
            name: 'Private',
            type: cxapi.VpcSubnetGroupType.PRIVATE,
            subnets: [
              {
                subnetId: 'pri-sub-1-in-us-east-1c',
                availabilityZone: 'us-east-1c',
                routeTableId: 'rt-123',
              },
              {
                subnetId: 'pri-exh-sub-2-in-us-east-1c',
                availabilityZone: 'us-east-1c',
                routeTableId: 'rt-123',
                availableIpAddressCount: 0,
              },
              {
                subnetId: 'pri-ip-avail-sub-1-in-us-east-1d',
                availabilityZone: 'us-east-1d',
                routeTableId: 'rt-123',
                availableIpAddressCount: 10,
              },
              {
                subnetId: 'pri-sub-2-in-us-east-1d',
                availabilityZone: 'us-east-1d',
                routeTableId: 'rt-123',
              },
            ],
          },
        ],
      }, options => {
        test.deepEqual(options.filter, {
          isDefault: 'true',
        });

        test.equal(options.subnetGroupNameTag, undefined);
      });

      const stack = new Stack();
      const vpc = Vpc.fromLookup(stack, 'Vpc', {
        isDefault: true,
      });

      test.deepEqual(vpc.availabilityZones, ['us-east-1a', 'us-east-1b', 'us-east-1c', 'us-east-1d']);
      test.equal(vpc.publicSubnets.length, 2);
      test.equal(vpc.privateSubnets.length, 4);
      test.equal(vpc.isolatedSubnets.length, 0);

      const filterSubnets = (subnets: ISubnet[], filterExpression: ((x: ISubnet) => boolean)) => subnets.filter(subnet => filterExpression(subnet));
      const ipExhaustedSubnet = (subnet: ISubnet) => subnet.availableIpAddressCount! === 0;
      const explicitlyIpAvailableSubnet = (subnet: ISubnet) => subnet.availableIpAddressCount! > 0;
      const implicitlyIpAvailableSubnet = (subnet: ISubnet) => !ipExhaustedSubnet(subnet) && !explicitlyIpAvailableSubnet(subnet);

      test.strictEqual(filterSubnets(vpc.publicSubnets, ipExhaustedSubnet).length, 1);
      test.strictEqual(filterSubnets(vpc.publicSubnets, explicitlyIpAvailableSubnet).length, 0);
      test.strictEqual(filterSubnets(vpc.publicSubnets, implicitlyIpAvailableSubnet).length, 1);
      test.strictEqual(filterSubnets(vpc.privateSubnets, ipExhaustedSubnet).length, 1);
      test.strictEqual(filterSubnets(vpc.privateSubnets, explicitlyIpAvailableSubnet).length, 1);
      test.strictEqual(filterSubnets(vpc.privateSubnets, implicitlyIpAvailableSubnet).length, 2);

      restoreContextProvider(previous);
      test.done();
    },

    'filters out IP exhausted subnets'(test: Test) {
      const exhaustedSubnetId: string = 'pri-exh-sub-2-in-us-east-1c';

      const previous = mockVpcContextProviderWith(test, {
        vpcId: 'vpc-1234',
        subnetGroups: [
          {
            name: 'Private',
            type: cxapi.VpcSubnetGroupType.PRIVATE,
            subnets: [
              {
                subnetId: 'pri-sub-1-in-us-east-1c',
                availabilityZone: 'us-east-1c',
                routeTableId: 'rt-123',
              },
              {
                subnetId: exhaustedSubnetId,
                availabilityZone: 'us-east-1c',
                routeTableId: 'rt-123',
                availableIpAddressCount: 0,
              },
              {
                subnetId: 'pri-ip-avail-sub-1-in-us-east-1d',
                availabilityZone: 'us-east-1d',
                routeTableId: 'rt-123',
                availableIpAddressCount: 10,
              },
              {
                subnetId: 'pri-sub-2-in-us-east-1d',
                availabilityZone: 'us-east-1d',
                routeTableId: 'rt-123',
              },
            ],
          },
        ],
      }, options => {
        test.deepEqual(options.filter, {
          isDefault: 'true',
        });

        test.equal(options.subnetGroupNameTag, undefined);
      });

      const stack = new Stack();
      const vpc = Vpc.fromLookup(stack, 'Vpc', {
        isDefault: true,
      });

      const { subnetIds } = vpc.selectSubnets({ filterOutIpExhausted: true });

      test.equal(vpc.privateSubnets.length, 4);

      test.equal(subnetIds.length, 3);
      test.ok(!subnetIds.includes(exhaustedSubnetId));

      restoreContextProvider(previous);
      test.done();
    },

    'selectSubnets onePerAz works on imported VPC'(test: Test) {
      const previous = mockVpcContextProviderWith(test, {
        vpcId: 'vpc-1234',
        subnetGroups: [
          {
            name: 'Public',
            type: cxapi.VpcSubnetGroupType.PUBLIC,
            subnets: [
              {
                subnetId: 'pub-sub-in-us-east-1a',
                availabilityZone: 'us-east-1a',
                routeTableId: 'rt-123',
              },
              {
                subnetId: 'pub-sub-in-us-east-1b',
                availabilityZone: 'us-east-1b',
                routeTableId: 'rt-123',
              },
            ],
          },
          {
            name: 'Private',
            type: cxapi.VpcSubnetGroupType.PRIVATE,
            subnets: [
              {
                subnetId: 'pri-sub-1-in-us-east-1c',
                availabilityZone: 'us-east-1c',
                routeTableId: 'rt-123',
              },
              {
                subnetId: 'pri-sub-2-in-us-east-1c',
                availabilityZone: 'us-east-1c',
                routeTableId: 'rt-123',
              },
              {
                subnetId: 'pri-sub-1-in-us-east-1d',
                availabilityZone: 'us-east-1d',
                routeTableId: 'rt-123',
              },
              {
                subnetId: 'pri-sub-2-in-us-east-1d',
                availabilityZone: 'us-east-1d',
                routeTableId: 'rt-123',
              },
            ],
          },
        ],
      }, options => {
        test.deepEqual(options.filter, {
          isDefault: 'true',
        });

        test.equal(options.subnetGroupNameTag, undefined);
      });

      const stack = new Stack();
      const vpc = Vpc.fromLookup(stack, 'Vpc', {
        isDefault: true,
      });

      // WHEN
      const subnets = vpc.selectSubnets({ subnetType: SubnetType.PRIVATE, onePerAz: true });

      // THEN: we got 2 subnets and not 4
      test.deepEqual(subnets.subnets.map(s => s.availabilityZone), ['us-east-1c', 'us-east-1d']);

      restoreContextProvider(previous);
      test.done();
    },

    'AZ in dummy lookup VPC matches AZ in Stack'(test: Test) {
      // GIVEN
      const stack = new Stack(undefined, 'MyTestStack', { env: { account: '1234567890', region: 'dummy' } });
      const vpc = Vpc.fromLookup(stack, 'vpc', { isDefault: true });

      // WHEN
      const subnets = vpc.selectSubnets({
        availabilityZones: stack.availabilityZones,
      });

      // THEN
      test.equals(subnets.subnets.length, 2);

      test.done();
    },

    'don\'t crash when using subnetgroup name in lookup VPC'(test: Test) {
      // GIVEN
      const stack = new Stack(undefined, 'MyTestStack', { env: { account: '1234567890', region: 'dummy' } });
      const vpc = Vpc.fromLookup(stack, 'vpc', { isDefault: true });

      // WHEN
      new Instance(stack, 'Instance', {
        vpc,
        instanceType: new InstanceType('t2.large'),
        machineImage: new GenericLinuxImage({ dummy: 'ami-1234' }),
        vpcSubnets: {
          subnetGroupName: 'application_layer',
        },
      });

      // THEN -- no exception occurred

      test.done();
    },
  },
};

interface MockVcpContextResponse {
  readonly vpcId: string;
  readonly subnetGroups: cxapi.VpcSubnetGroup[];
}

function mockVpcContextProviderWith(
  test: Test, response: MockVcpContextResponse,
  paramValidator?: (options: cxschema.VpcContextQuery) => void) {
  const previous = ContextProvider.getValue;
  ContextProvider.getValue = (_scope: Construct, options: GetContextValueOptions) => {
    // do some basic sanity checks
    test.equal(options.provider, cxschema.ContextProvider.VPC_PROVIDER,
      `Expected provider to be: '${cxschema.ContextProvider.VPC_PROVIDER}', got: '${options.provider}'`);
    test.equal((options.props || {}).returnAsymmetricSubnets, true,
      `Expected options.props.returnAsymmetricSubnets to be true, got: '${(options.props || {}).returnAsymmetricSubnets}'`);

    if (paramValidator) {
      paramValidator(options.props as any);
    }

    return {
      value: {
        availabilityZones: [],
        isolatedSubnetIds: undefined,
        isolatedSubnetNames: undefined,
        isolatedSubnetRouteTableIds: undefined,
        privateSubnetIds: undefined,
        privateSubnetNames: undefined,
        privateSubnetRouteTableIds: undefined,
        publicSubnetIds: undefined,
        publicSubnetNames: undefined,
        publicSubnetRouteTableIds: undefined,
        ...response,
      } as cxapi.VpcContextResponse,
    };
  };
  return previous;
}

function restoreContextProvider(previous: (scope: Construct, options: GetContextValueOptions) => GetContextValueResult): void {
  ContextProvider.getValue = previous;
}
