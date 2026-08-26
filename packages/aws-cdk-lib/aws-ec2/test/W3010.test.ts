import type { VpcContextResponse } from '@aws-cdk/cloud-assembly-api';
import { VpcSubnetGroupType } from '@aws-cdk/cloud-assembly-api';
import { AssemblyValidationReport } from '../../assertions/lib/helpers-internal';
import * as cxschema from '../../cloud-assembly-schema';
import { ContextProvider } from '../../core';
import { App } from '../../core/lib/app';
import { Stack } from '../../core/lib/stack';
import { Validations } from '../../core/lib/validation/validations';
import { CfnSubnet, Vpc } from '../lib';

let previousAppHook: any;
const APP_INIT_HOOK_SYMBOL = Symbol.for('@aws-cdk/core.App#initHook');
// GIVEN
let app: App;
let stack: Stack;

// Temporarily unset the appHook config that silences W3010 automatically for all tests
// (see jest-global-app-testhook.ts)
beforeEach(() => {
  previousAppHook = (globalThis as any)[APP_INIT_HOOK_SYMBOL];
  (globalThis as any)[APP_INIT_HOOK_SYMBOL] = (a: App) => {
    Validations.of(a).acknowledge(
      { id: 'CloudFormation-Validate::E1151', reason: 'This VPC ID does not work, we do not care' },
    );
  };

  app = new App({
    postCliContext: AssemblyValidationReport.APP_CONTEXT,
  });
  stack = new Stack(app, 'Stack', {
    env: {
      account: '111111111111',
      region: 'us-east-1',
    },
  });

  // Pretend we've looked up the availability zones and found them (and ensure we did it right)
  stack.node.setContext(
    ContextProvider.getKey(stack, {
      provider: cxschema.ContextProvider.AVAILABILITY_ZONE_PROVIDER,
    }).key,
    ['us-east-1a', 'us-east-1b'],
  );

  stack.node.setContext(
    'vpc-provider:account=111111111111:filter.tag:Name=MyVpc:region=us-east-1:returnAsymmetricSubnets=true',
    {
      availabilityZones: ['us-east-1a', 'us-east-1b'],
      vpcId: 'vpc-1234',
      subnetGroups: [
        {
          name: 'Public',
          subnets: [
            { availabilityZone: 'us-east-1a', routeTableId: 'rt-1234', subnetId: 's-1' },
            { availabilityZone: 'us-east-1b', routeTableId: 'rt-1234', subnetId: 's-2' },
          ],
          type: VpcSubnetGroupType.PUBLIC,
        },
      ],
    } satisfies VpcContextResponse,
  );
});
afterEach(() => {
  (globalThis as any)[APP_INIT_HOOK_SYMBOL] = previousAppHook;
});

test('check that we did the Context Lookup faking correctly', () => {
  // If not this would have returned something like 'dummy1a'
  expect(stack.availabilityZones[0]).toEqual('us-east-1a');
});

test('hardcoded AZ should warn', () => {
  // WHEN
  new CfnSubnet(stack, 'Subnet', {
    vpcId: 'vpc-1234',
    cidrBlock: '10.0.0.0/24',
    availabilityZone: 'us-east-1a',
  });

  // THEN
  AssemblyValidationReport.fromApp(app).hasViolation({
    ruleName: 'W3010',
  });
});

test('using an AZ from stack.availabilityZones does not warn', () => {
  // WHEN
  new CfnSubnet(stack, 'Subnet', {
    vpcId: 'vpc-1234',
    cidrBlock: '10.0.0.0/24',
    availabilityZone: stack.availabilityZones[0],
  });

  // THEN
  AssemblyValidationReport.fromApp(app).hasNoViolation();
});

test('using AZs from a looked up VPC does not warn', () => {
  const vpc = Vpc.fromLookup(stack, 'Vpc', {
    vpcName: 'MyVpc',
  });

  // Did we do the seeding of the lookup correctly?
  expect(vpc.availabilityZones[0]).toEqual('us-east-1a');

  // WHEN
  new CfnSubnet(stack, 'Subnet', {
    vpcId: 'vpc-1234',
    cidrBlock: '10.0.0.0/24',
    availabilityZone: vpc.availabilityZones[0],
  });

  // THEN
  AssemblyValidationReport.fromApp(app).hasNoViolation();
});
