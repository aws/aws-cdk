import { Construct, ContextProvider, GetContextValueOptions, GetContextValueResult, Lazy, Stack } from "@aws-cdk/core";
import cxapi = require('@aws-cdk/cx-api');
import { Test } from 'nodeunit';
import { Vpc } from "../lib";

export = {
  'Vpc.fromLookup()': {
    'requires concrete values'(test: Test) {
      // GIVEN
      const stack = new Stack();

      test.throws(() => {
        Vpc.fromLookup(stack, 'Vpc', {
          vpcId: Lazy.stringValue({ produce: () => 'some-id' })
        });

      }, 'All arguments to Vpc.fromLookup() must be concrete');

      test.done();
    },

    'selecting subnets by name from a looked-up VPC does not throw'(test: Test) {
      // GIVEN
      const stack = new Stack(undefined, undefined, { env: { region: 'us-east-1', account: '123456789012' }});
      const vpc = Vpc.fromLookup(stack, 'VPC', {
        vpcId: 'vpc-1234'
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
  },
};

interface MockVcpContextResponse {
  readonly vpcId: string;
  readonly subnetGroups: cxapi.VpcSubnetGroup[];
}

function mockVpcContextProviderWith(test: Test, response: MockVcpContextResponse,
                                    paramValidator?: (options: cxapi.VpcContextQuery) => void) {
  const previous = ContextProvider.getValue;
  ContextProvider.getValue = (_scope: Construct, options: GetContextValueOptions) => {
    // do some basic sanity checks
    test.equal(options.provider, cxapi.VPC_PROVIDER,
      `Expected provider to be: '${cxapi.VPC_PROVIDER}', got: '${options.provider}'`);
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
