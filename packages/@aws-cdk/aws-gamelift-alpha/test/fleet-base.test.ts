import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as gamelift from '../lib';

describe('Fleet base', () => {
  describe('FleetBase.fromFleetAttributes()', () => {
    let stack: cdk.Stack;
    const fleetId = 'fleet-test-identifier';
    const fleetArn = `arn:aws:gamelift:fleet-region:123456789012:fleet/${fleetId}`;

    beforeEach(() => {
      const app = new cdk.App();
      stack = new cdk.Stack(app, 'Base', {
        env: { account: '111111111111', region: 'stack-region' },
      });
    });

    describe('', () => {
      test('with required attrs only', () => {
        const importedFleet = gamelift.FleetBase.fromFleetAttributes(stack, 'ImportedScript', { fleetArn });

        expect(importedFleet.fleetId).toEqual(fleetId);
        expect(importedFleet.fleetArn).toEqual(fleetArn);
        expect(importedFleet.env.account).toEqual('123456789012');
        expect(importedFleet.env.region).toEqual('fleet-region');
        expect(importedFleet.grantPrincipal).toEqual(new iam.UnknownPrincipal({ resource: importedFleet }));
      });

      test('with all attrs', () => {
        const role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/TestRole');
        const importedFleet = gamelift.FleetBase.fromFleetAttributes(stack, 'ImportedScript', { fleetArn, role });

        expect(importedFleet.fleetId).toEqual(fleetId);
        expect(importedFleet.grantPrincipal).toEqual(role);
      });

      test('with missing attrs', () => {
        const role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/TestRole');
        expect(() => gamelift.FleetBase.fromFleetAttributes(stack, 'ImportedScript', { role }))
          .toThrow(/Either fleetId or fleetArn must be provided in FleetAttributes/);
      });

      test('with invalid ARN', () => {
        expect(() => gamelift.FleetBase.fromFleetAttributes(stack, 'ImportedScript', { fleetArn: 'arn:aws:gamelift:fleet-region:123456789012:fleet' }))
          .toThrow(/No fleet identifier found in ARN: 'arn:aws:gamelift:fleet-region:123456789012:fleet'/);
      });
    });

    describe('for a fleet in a different account and region', () => {
      let fleet: gamelift.IFleet;

      beforeEach(() => {
        fleet = gamelift.FleetBase.fromFleetAttributes(stack, 'Fleet', { fleetArn });
      });

      test("the fleet's region is taken from the ARN", () => {
        expect(fleet.env.region).toBe('fleet-region');
      });

      test("the fleet's account is taken from the ARN", () => {
        expect(fleet.env.account).toBe('123456789012');
      });
    });
  });
});
