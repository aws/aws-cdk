"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cxschema = require("@aws-cdk/cloud-assembly-schema");
const core_1 = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const lib_1 = require("../lib");
describe('vpc from lookup', () => {
    describe('Vpc.fromLookup()', () => {
        test('requires concrete values', () => {
            // GIVEN
            const stack = new core_1.Stack();
            expect(() => {
                lib_1.Vpc.fromLookup(stack, 'Vpc', {
                    vpcId: core_1.Lazy.string({ produce: () => 'some-id' }),
                });
            }).toThrow('All arguments to Vpc.fromLookup() must be concrete');
        });
        test('selecting subnets by name from a looked-up VPC does not throw', () => {
            // GIVEN
            const stack = new core_1.Stack(undefined, undefined, { env: { region: 'us-east-1', account: '123456789012' } });
            const vpc = lib_1.Vpc.fromLookup(stack, 'VPC', {
                vpcId: 'vpc-1234',
            });
            // WHEN
            vpc.selectSubnets({ subnetName: 'Bleep' });
            // THEN: no exception
        });
        test('accepts asymmetric subnets', () => {
            const previous = mockVpcContextProviderWith({
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
                expect(options.filter).toEqual({
                    isDefault: 'true',
                });
                expect(options.subnetGroupNameTag).toEqual(undefined);
            });
            const stack = new core_1.Stack();
            const vpc = lib_1.Vpc.fromLookup(stack, 'Vpc', {
                isDefault: true,
            });
            expect(vpc.availabilityZones).toEqual(['us-east-1a', 'us-east-1b', 'us-east-1c', 'us-east-1d']);
            expect(vpc.publicSubnets.length).toEqual(2);
            expect(vpc.privateSubnets.length).toEqual(4);
            expect(vpc.isolatedSubnets.length).toEqual(0);
            restoreContextProvider(previous);
        });
        test('selectSubnets onePerAz works on imported VPC', () => {
            const previous = mockVpcContextProviderWith({
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
                expect(options.filter).toEqual({
                    isDefault: 'true',
                });
                expect(options.subnetGroupNameTag).toEqual(undefined);
            });
            const stack = new core_1.Stack();
            const vpc = lib_1.Vpc.fromLookup(stack, 'Vpc', {
                isDefault: true,
            });
            // WHEN
            const subnets = vpc.selectSubnets({ subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS, onePerAz: true });
            // THEN: we got 2 subnets and not 4
            expect(subnets.subnets.map(s => s.availabilityZone)).toEqual(['us-east-1c', 'us-east-1d']);
            restoreContextProvider(previous);
        });
        test('AZ in dummy lookup VPC matches AZ in Stack', () => {
            // GIVEN
            const stack = new core_1.Stack(undefined, 'MyTestStack', { env: { account: '1234567890', region: 'dummy' } });
            const vpc = lib_1.Vpc.fromLookup(stack, 'vpc', { isDefault: true });
            // WHEN
            const subnets = vpc.selectSubnets({
                availabilityZones: stack.availabilityZones,
            });
            // THEN
            expect(subnets.subnets.length).toEqual(2);
        });
        test('don\'t crash when using subnetgroup name in lookup VPC', () => {
            // GIVEN
            const stack = new core_1.Stack(undefined, 'MyTestStack', { env: { account: '1234567890', region: 'dummy' } });
            const vpc = lib_1.Vpc.fromLookup(stack, 'vpc', { isDefault: true });
            // WHEN
            new lib_1.Instance(stack, 'Instance', {
                vpc,
                instanceType: new lib_1.InstanceType('t2.large'),
                machineImage: new lib_1.GenericLinuxImage({ dummy: 'ami-1234' }),
                vpcSubnets: {
                    subnetGroupName: 'application_layer',
                },
            });
            // THEN -- no exception occurred
        });
        test('subnets in imported VPC has all expected attributes', () => {
            const previous = mockVpcContextProviderWith({
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
                                cidr: '10.100.0.0/24',
                            },
                        ],
                    },
                ],
            }, options => {
                expect(options.filter).toEqual({
                    isDefault: 'true',
                });
                expect(options.subnetGroupNameTag).toEqual(undefined);
            });
            const stack = new core_1.Stack();
            const vpc = lib_1.Vpc.fromLookup(stack, 'Vpc', {
                isDefault: true,
            });
            let subnet = vpc.publicSubnets[0];
            expect(subnet.availabilityZone).toEqual('us-east-1a');
            expect(subnet.subnetId).toEqual('pub-sub-in-us-east-1a');
            expect(subnet.routeTable.routeTableId).toEqual('rt-123');
            expect(subnet.ipv4CidrBlock).toEqual('10.100.0.0/24');
            restoreContextProvider(previous);
        });
        test('passes account and region', () => {
            const previous = mockVpcContextProviderWith({
                vpcId: 'vpc-1234',
                subnetGroups: [],
            }, options => {
                expect(options.region).toEqual('region-1234');
            });
            const stack = new core_1.Stack();
            const vpc = lib_1.Vpc.fromLookup(stack, 'Vpc', {
                vpcId: 'vpc-1234',
                region: 'region-1234',
            });
            expect(vpc.vpcId).toEqual('vpc-1234');
            restoreContextProvider(previous);
        });
        test('passes region to LookedUpVpc correctly', () => {
            const previous = mockVpcContextProviderWith({
                vpcId: 'vpc-1234',
                subnetGroups: [],
                region: 'region-1234',
            }, options => {
                expect(options.region).toEqual('region-1234');
            });
            const stack = new core_1.Stack();
            const vpc = lib_1.Vpc.fromLookup(stack, 'Vpc', {
                vpcId: 'vpc-1234',
                region: 'region-1234',
            });
            expect(vpc.env.region).toEqual('region-1234');
            restoreContextProvider(previous);
        });
    });
});
function mockVpcContextProviderWith(response, paramValidator) {
    const previous = core_1.ContextProvider.getValue;
    core_1.ContextProvider.getValue = (_scope, options) => {
        // do some basic sanity checks
        expect(options.provider).toEqual(cxschema.ContextProvider.VPC_PROVIDER);
        expect((options.props || {}).returnAsymmetricSubnets).toEqual(true);
        if (paramValidator) {
            paramValidator(options.props);
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
            },
        };
    };
    return previous;
}
function restoreContextProvider(previous) {
    core_1.ContextProvider.getValue = previous;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnBjLmZyb20tbG9va3VwLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2cGMuZnJvbS1sb29rdXAudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJEQUEyRDtBQUMzRCx3Q0FBNEc7QUFDNUcseUNBQXlDO0FBRXpDLGdDQUFvRjtBQUVwRixRQUFRLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO0lBQy9CLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7UUFDaEMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtZQUNwQyxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUUxQixNQUFNLENBQUMsR0FBRyxFQUFFO2dCQUNWLFNBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtvQkFDM0IsS0FBSyxFQUFFLFdBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7aUJBQ2pELENBQUMsQ0FBQztZQUVMLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxvREFBb0QsQ0FBQyxDQUFDO1FBR25FLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLCtEQUErRCxFQUFFLEdBQUcsRUFBRTtZQUN6RSxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN6RyxNQUFNLEdBQUcsR0FBRyxTQUFHLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQ3ZDLEtBQUssRUFBRSxVQUFVO2FBQ2xCLENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUUsVUFB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QyxRQUFRLENBQUM7SUFDMUMsc0JBQWUsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxNQUFpQixFQUFFLE9BQStCLEVBQUUsRUFBRTtRQUNoRiw4QkFBOEI7UUFDOUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN4RSxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXBFLElBQUksY0FBYyxFQUFFO1lBQ2xCLGNBQWMsQ0FBQyxPQUFPLENBQUMsS0FBWSxDQUFDLENBQUM7U0FDdEM7UUFFRCxPQUFPO1lBQ0wsS0FBSyxFQUFFO2dCQUNMLGlCQUFpQixFQUFFLEVBQUU7Z0JBQ3JCLGlCQUFpQixFQUFFLFNBQVM7Z0JBQzVCLG1CQUFtQixFQUFFLFNBQVM7Z0JBQzlCLDJCQUEyQixFQUFFLFNBQVM7Z0JBQ3RDLGdCQUFnQixFQUFFLFNBQVM7Z0JBQzNCLGtCQUFrQixFQUFFLFNBQVM7Z0JBQzdCLDBCQUEwQixFQUFFLFNBQVM7Z0JBQ3JDLGVBQWUsRUFBRSxTQUFTO2dCQUMxQixpQkFBaUIsRUFBRSxTQUFTO2dCQUM1Qix5QkFBeUIsRUFBRSxTQUFTO2dCQUNwQyxHQUFHLFFBQVE7YUFDZ0I7U0FDOUIsQ0FBQztJQUNKLENBQUMsQ0FBQztJQUNGLE9BQU8sUUFBUSxDQUFDO0FBQ2xCLENBQUM7QUFFRCxTQUFTLHNCQUFzQixDQUFDLFFBQXNGO0lBQ3BILHNCQUFlLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUN0QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY3hzY2hlbWEgZnJvbSAnQGF3cy1jZGsvY2xvdWQtYXNzZW1ibHktc2NoZW1hJztcbmltcG9ydCB7IENvbnRleHRQcm92aWRlciwgR2V0Q29udGV4dFZhbHVlT3B0aW9ucywgR2V0Q29udGV4dFZhbHVlUmVzdWx0LCBMYXp5LCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgR2VuZXJpY0xpbnV4SW1hZ2UsIEluc3RhbmNlLCBJbnN0YW5jZVR5cGUsIFN1Ym5ldFR5cGUsIFZwYyB9IGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCd2cGMgZnJvbSBsb29rdXAnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdWcGMuZnJvbUxvb2t1cCgpJywgKCkgPT4ge1xuICAgIHRlc3QoJ3JlcXVpcmVzIGNvbmNyZXRlIHZhbHVlcycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBWcGMuZnJvbUxvb2t1cChzdGFjaywgJ1ZwYycsIHtcbiAgICAgICAgICB2cGNJZDogTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiAnc29tZS1pZCcgfSksXG4gICAgICAgIH0pO1xuXG4gICAgICB9KS50b1Rocm93KCdBbGwgYXJndW1lbnRzIHRvIFZwYy5mcm9tTG9va3VwKCkgbXVzdCBiZSBjb25jcmV0ZScpO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3NlbGVjdGluZyBzdWJuZXRzIGJ5IG5hbWUgZnJvbSBhIGxvb2tlZC11cCBWUEMgZG9lcyBub3QgdGhyb3cnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2sodW5kZWZpbmVkLCB1bmRlZmluZWQsIHsgZW52OiB7IHJlZ2lvbjogJ3VzLWVhc3QtMScsIGFjY291bnQ6ICcxMjM0NTY3ODkwMTInIH0gfSk7XG4gICAgICBjb25zdCB2cGMgPSBWcGMuZnJvbUxvb2t1cChzdGFjaywgJ1ZQQycsIHtcbiAgICAgICAgdnBjSWQ6ICd2cGMtMTIzNCcsXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgdnBjLnNlbGVjdFN1Ym5ldHMoeyBzdWJuZXROYW1lOiAnQmxlZXAnIH0pO1xuXG4gICAgICAvLyBUSEVOOiBubyBleGNlcHRpb25cblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhY2NlcHRzIGFzeW1tZXRyaWMgc3VibmV0cycsICgpID0+IHtcbiAgICAgIGNvbnN0IHByZXZpb3VzID0gbW9ja1ZwY0NvbnRleHRQcm92aWRlcldpdGgoe1xuICAgICAgICB2cGNJZDogJ3ZwYy0xMjM0JyxcbiAgICAgICAgc3VibmV0R3JvdXBzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ1B1YmxpYycsXG4gICAgICAgICAgICB0eXBlOiBjeGFwaS5WcGNTdWJuZXRHcm91cFR5cGUuUFVCTElDLFxuICAgICAgICAgICAgc3VibmV0czogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3VibmV0SWQ6ICdwdWItc3ViLWluLXVzLWVhc3QtMWEnLFxuICAgICAgICAgICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgICAgICAgICAgICByb3V0ZVRhYmxlSWQ6ICdydC0xMjMnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3VibmV0SWQ6ICdwdWItc3ViLWluLXVzLWVhc3QtMWInLFxuICAgICAgICAgICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFiJyxcbiAgICAgICAgICAgICAgICByb3V0ZVRhYmxlSWQ6ICdydC0xMjMnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdQcml2YXRlJyxcbiAgICAgICAgICAgIHR5cGU6IGN4YXBpLlZwY1N1Ym5ldEdyb3VwVHlwZS5QUklWQVRFLFxuICAgICAgICAgICAgc3VibmV0czogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3VibmV0SWQ6ICdwcmktc3ViLTEtaW4tdXMtZWFzdC0xYycsXG4gICAgICAgICAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ3VzLWVhc3QtMWMnLFxuICAgICAgICAgICAgICAgIHJvdXRlVGFibGVJZDogJ3J0LTEyMycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdWJuZXRJZDogJ3ByaS1zdWItMi1pbi11cy1lYXN0LTFjJyxcbiAgICAgICAgICAgICAgICBhdmFpbGFiaWxpdHlab25lOiAndXMtZWFzdC0xYycsXG4gICAgICAgICAgICAgICAgcm91dGVUYWJsZUlkOiAncnQtMTIzJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN1Ym5ldElkOiAncHJpLXN1Yi0xLWluLXVzLWVhc3QtMWQnLFxuICAgICAgICAgICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFkJyxcbiAgICAgICAgICAgICAgICByb3V0ZVRhYmxlSWQ6ICdydC0xMjMnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3VibmV0SWQ6ICdwcmktc3ViLTItaW4tdXMtZWFzdC0xZCcsXG4gICAgICAgICAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ3VzLWVhc3QtMWQnLFxuICAgICAgICAgICAgICAgIHJvdXRlVGFibGVJZDogJ3J0LTEyMycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LCBvcHRpb25zID0+IHtcbiAgICAgICAgZXhwZWN0KG9wdGlvbnMuZmlsdGVyKS50b0VxdWFsKHtcbiAgICAgICAgICBpc0RlZmF1bHQ6ICd0cnVlJyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZXhwZWN0KG9wdGlvbnMuc3VibmV0R3JvdXBOYW1lVGFnKS50b0VxdWFsKHVuZGVmaW5lZCk7XG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IFZwYy5mcm9tTG9va3VwKHN0YWNrLCAnVnBjJywge1xuICAgICAgICBpc0RlZmF1bHQ6IHRydWUsXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KHZwYy5hdmFpbGFiaWxpdHlab25lcykudG9FcXVhbChbJ3VzLWVhc3QtMWEnLCAndXMtZWFzdC0xYicsICd1cy1lYXN0LTFjJywgJ3VzLWVhc3QtMWQnXSk7XG4gICAgICBleHBlY3QodnBjLnB1YmxpY1N1Ym5ldHMubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgICAgZXhwZWN0KHZwYy5wcml2YXRlU3VibmV0cy5sZW5ndGgpLnRvRXF1YWwoNCk7XG4gICAgICBleHBlY3QodnBjLmlzb2xhdGVkU3VibmV0cy5sZW5ndGgpLnRvRXF1YWwoMCk7XG5cbiAgICAgIHJlc3RvcmVDb250ZXh0UHJvdmlkZXIocHJldmlvdXMpO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdzZWxlY3RTdWJuZXRzIG9uZVBlckF6IHdvcmtzIG9uIGltcG9ydGVkIFZQQycsICgpID0+IHtcbiAgICAgIGNvbnN0IHByZXZpb3VzID0gbW9ja1ZwY0NvbnRleHRQcm92aWRlcldpdGgoe1xuICAgICAgICB2cGNJZDogJ3ZwYy0xMjM0JyxcbiAgICAgICAgc3VibmV0R3JvdXBzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ1B1YmxpYycsXG4gICAgICAgICAgICB0eXBlOiBjeGFwaS5WcGNTdWJuZXRHcm91cFR5cGUuUFVCTElDLFxuICAgICAgICAgICAgc3VibmV0czogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3VibmV0SWQ6ICdwdWItc3ViLWluLXVzLWVhc3QtMWEnLFxuICAgICAgICAgICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgICAgICAgICAgICByb3V0ZVRhYmxlSWQ6ICdydC0xMjMnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3VibmV0SWQ6ICdwdWItc3ViLWluLXVzLWVhc3QtMWInLFxuICAgICAgICAgICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFiJyxcbiAgICAgICAgICAgICAgICByb3V0ZVRhYmxlSWQ6ICdydC0xMjMnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdQcml2YXRlJyxcbiAgICAgICAgICAgIHR5cGU6IGN4YXBpLlZwY1N1Ym5ldEdyb3VwVHlwZS5QUklWQVRFLFxuICAgICAgICAgICAgc3VibmV0czogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3VibmV0SWQ6ICdwcmktc3ViLTEtaW4tdXMtZWFzdC0xYycsXG4gICAgICAgICAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ3VzLWVhc3QtMWMnLFxuICAgICAgICAgICAgICAgIHJvdXRlVGFibGVJZDogJ3J0LTEyMycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdWJuZXRJZDogJ3ByaS1zdWItMi1pbi11cy1lYXN0LTFjJyxcbiAgICAgICAgICAgICAgICBhdmFpbGFiaWxpdHlab25lOiAndXMtZWFzdC0xYycsXG4gICAgICAgICAgICAgICAgcm91dGVUYWJsZUlkOiAncnQtMTIzJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN1Ym5ldElkOiAncHJpLXN1Yi0xLWluLXVzLWVhc3QtMWQnLFxuICAgICAgICAgICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFkJyxcbiAgICAgICAgICAgICAgICByb3V0ZVRhYmxlSWQ6ICdydC0xMjMnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3VibmV0SWQ6ICdwcmktc3ViLTItaW4tdXMtZWFzdC0xZCcsXG4gICAgICAgICAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ3VzLWVhc3QtMWQnLFxuICAgICAgICAgICAgICAgIHJvdXRlVGFibGVJZDogJ3J0LTEyMycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LCBvcHRpb25zID0+IHtcbiAgICAgICAgZXhwZWN0KG9wdGlvbnMuZmlsdGVyKS50b0VxdWFsKHtcbiAgICAgICAgICBpc0RlZmF1bHQ6ICd0cnVlJyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZXhwZWN0KG9wdGlvbnMuc3VibmV0R3JvdXBOYW1lVGFnKS50b0VxdWFsKHVuZGVmaW5lZCk7XG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IFZwYy5mcm9tTG9va3VwKHN0YWNrLCAnVnBjJywge1xuICAgICAgICBpc0RlZmF1bHQ6IHRydWUsXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3Qgc3VibmV0cyA9IHZwYy5zZWxlY3RTdWJuZXRzKHsgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTLCBvbmVQZXJBejogdHJ1ZSB9KTtcblxuICAgICAgLy8gVEhFTjogd2UgZ290IDIgc3VibmV0cyBhbmQgbm90IDRcbiAgICAgIGV4cGVjdChzdWJuZXRzLnN1Ym5ldHMubWFwKHMgPT4gcy5hdmFpbGFiaWxpdHlab25lKSkudG9FcXVhbChbJ3VzLWVhc3QtMWMnLCAndXMtZWFzdC0xZCddKTtcblxuICAgICAgcmVzdG9yZUNvbnRleHRQcm92aWRlcihwcmV2aW91cyk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ0FaIGluIGR1bW15IGxvb2t1cCBWUEMgbWF0Y2hlcyBBWiBpbiBTdGFjaycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayh1bmRlZmluZWQsICdNeVRlc3RTdGFjaycsIHsgZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3ODkwJywgcmVnaW9uOiAnZHVtbXknIH0gfSk7XG4gICAgICBjb25zdCB2cGMgPSBWcGMuZnJvbUxvb2t1cChzdGFjaywgJ3ZwYycsIHsgaXNEZWZhdWx0OiB0cnVlIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBzdWJuZXRzID0gdnBjLnNlbGVjdFN1Ym5ldHMoe1xuICAgICAgICBhdmFpbGFiaWxpdHlab25lczogc3RhY2suYXZhaWxhYmlsaXR5Wm9uZXMsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHN1Ym5ldHMuc3VibmV0cy5sZW5ndGgpLnRvRXF1YWwoMik7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnZG9uXFwndCBjcmFzaCB3aGVuIHVzaW5nIHN1Ym5ldGdyb3VwIG5hbWUgaW4gbG9va3VwIFZQQycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayh1bmRlZmluZWQsICdNeVRlc3RTdGFjaycsIHsgZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3ODkwJywgcmVnaW9uOiAnZHVtbXknIH0gfSk7XG4gICAgICBjb25zdCB2cGMgPSBWcGMuZnJvbUxvb2t1cChzdGFjaywgJ3ZwYycsIHsgaXNEZWZhdWx0OiB0cnVlIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgSW5zdGFuY2Uoc3RhY2ssICdJbnN0YW5jZScsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoJ3QyLmxhcmdlJyksXG4gICAgICAgIG1hY2hpbmVJbWFnZTogbmV3IEdlbmVyaWNMaW51eEltYWdlKHsgZHVtbXk6ICdhbWktMTIzNCcgfSksXG4gICAgICAgIHZwY1N1Ym5ldHM6IHtcbiAgICAgICAgICBzdWJuZXRHcm91cE5hbWU6ICdhcHBsaWNhdGlvbl9sYXllcicsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTiAtLSBubyBleGNlcHRpb24gb2NjdXJyZWRcblxuXG4gICAgfSk7XG4gICAgdGVzdCgnc3VibmV0cyBpbiBpbXBvcnRlZCBWUEMgaGFzIGFsbCBleHBlY3RlZCBhdHRyaWJ1dGVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJldmlvdXMgPSBtb2NrVnBjQ29udGV4dFByb3ZpZGVyV2l0aCh7XG4gICAgICAgIHZwY0lkOiAndnBjLTEyMzQnLFxuICAgICAgICBzdWJuZXRHcm91cHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnUHVibGljJyxcbiAgICAgICAgICAgIHR5cGU6IGN4YXBpLlZwY1N1Ym5ldEdyb3VwVHlwZS5QVUJMSUMsXG4gICAgICAgICAgICBzdWJuZXRzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdWJuZXRJZDogJ3B1Yi1zdWItaW4tdXMtZWFzdC0xYScsXG4gICAgICAgICAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ3VzLWVhc3QtMWEnLFxuICAgICAgICAgICAgICAgIHJvdXRlVGFibGVJZDogJ3J0LTEyMycsXG4gICAgICAgICAgICAgICAgY2lkcjogJzEwLjEwMC4wLjAvMjQnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSwgb3B0aW9ucyA9PiB7XG4gICAgICAgIGV4cGVjdChvcHRpb25zLmZpbHRlcikudG9FcXVhbCh7XG4gICAgICAgICAgaXNEZWZhdWx0OiAndHJ1ZScsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV4cGVjdChvcHRpb25zLnN1Ym5ldEdyb3VwTmFtZVRhZykudG9FcXVhbCh1bmRlZmluZWQpO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBWcGMuZnJvbUxvb2t1cChzdGFjaywgJ1ZwYycsIHtcbiAgICAgICAgaXNEZWZhdWx0OiB0cnVlLFxuICAgICAgfSk7XG5cbiAgICAgIGxldCBzdWJuZXQgPSB2cGMucHVibGljU3VibmV0c1swXTtcblxuICAgICAgZXhwZWN0KHN1Ym5ldC5hdmFpbGFiaWxpdHlab25lKS50b0VxdWFsKCd1cy1lYXN0LTFhJyk7XG4gICAgICBleHBlY3Qoc3VibmV0LnN1Ym5ldElkKS50b0VxdWFsKCdwdWItc3ViLWluLXVzLWVhc3QtMWEnKTtcbiAgICAgIGV4cGVjdChzdWJuZXQucm91dGVUYWJsZS5yb3V0ZVRhYmxlSWQpLnRvRXF1YWwoJ3J0LTEyMycpO1xuICAgICAgZXhwZWN0KHN1Ym5ldC5pcHY0Q2lkckJsb2NrKS50b0VxdWFsKCcxMC4xMDAuMC4wLzI0Jyk7XG5cblxuICAgICAgcmVzdG9yZUNvbnRleHRQcm92aWRlcihwcmV2aW91cyk7XG5cbiAgICB9KTtcbiAgICB0ZXN0KCdwYXNzZXMgYWNjb3VudCBhbmQgcmVnaW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJldmlvdXMgPSBtb2NrVnBjQ29udGV4dFByb3ZpZGVyV2l0aCh7XG4gICAgICAgIHZwY0lkOiAndnBjLTEyMzQnLFxuICAgICAgICBzdWJuZXRHcm91cHM6IFtdLFxuICAgICAgfSwgb3B0aW9ucyA9PiB7XG4gICAgICAgIGV4cGVjdChvcHRpb25zLnJlZ2lvbikudG9FcXVhbCgncmVnaW9uLTEyMzQnKTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gVnBjLmZyb21Mb29rdXAoc3RhY2ssICdWcGMnLCB7XG4gICAgICAgIHZwY0lkOiAndnBjLTEyMzQnLFxuICAgICAgICByZWdpb246ICdyZWdpb24tMTIzNCcsXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KHZwYy52cGNJZCkudG9FcXVhbCgndnBjLTEyMzQnKTtcblxuICAgICAgcmVzdG9yZUNvbnRleHRQcm92aWRlcihwcmV2aW91cyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdwYXNzZXMgcmVnaW9uIHRvIExvb2tlZFVwVnBjIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIGNvbnN0IHByZXZpb3VzID0gbW9ja1ZwY0NvbnRleHRQcm92aWRlcldpdGgoe1xuICAgICAgICB2cGNJZDogJ3ZwYy0xMjM0JyxcbiAgICAgICAgc3VibmV0R3JvdXBzOiBbXSxcbiAgICAgICAgcmVnaW9uOiAncmVnaW9uLTEyMzQnLFxuICAgICAgfSwgb3B0aW9ucyA9PiB7XG4gICAgICAgIGV4cGVjdChvcHRpb25zLnJlZ2lvbikudG9FcXVhbCgncmVnaW9uLTEyMzQnKTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gVnBjLmZyb21Mb29rdXAoc3RhY2ssICdWcGMnLCB7XG4gICAgICAgIHZwY0lkOiAndnBjLTEyMzQnLFxuICAgICAgICByZWdpb246ICdyZWdpb24tMTIzNCcsXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KHZwYy5lbnYucmVnaW9uKS50b0VxdWFsKCdyZWdpb24tMTIzNCcpO1xuICAgICAgcmVzdG9yZUNvbnRleHRQcm92aWRlcihwcmV2aW91cyk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmludGVyZmFjZSBNb2NrVmNwQ29udGV4dFJlc3BvbnNlIHtcbiAgcmVhZG9ubHkgdnBjSWQ6IHN0cmluZztcbiAgcmVhZG9ubHkgc3VibmV0R3JvdXBzOiBjeGFwaS5WcGNTdWJuZXRHcm91cFtdO1xuICByZWFkb25seSByZWdpb24/OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIG1vY2tWcGNDb250ZXh0UHJvdmlkZXJXaXRoKFxuICByZXNwb25zZTogTW9ja1ZjcENvbnRleHRSZXNwb25zZSxcbiAgcGFyYW1WYWxpZGF0b3I/OiAob3B0aW9uczogY3hzY2hlbWEuVnBjQ29udGV4dFF1ZXJ5KSA9PiB2b2lkKSB7XG4gIGNvbnN0IHByZXZpb3VzID0gQ29udGV4dFByb3ZpZGVyLmdldFZhbHVlO1xuICBDb250ZXh0UHJvdmlkZXIuZ2V0VmFsdWUgPSAoX3Njb3BlOiBDb25zdHJ1Y3QsIG9wdGlvbnM6IEdldENvbnRleHRWYWx1ZU9wdGlvbnMpID0+IHtcbiAgICAvLyBkbyBzb21lIGJhc2ljIHNhbml0eSBjaGVja3NcbiAgICBleHBlY3Qob3B0aW9ucy5wcm92aWRlcikudG9FcXVhbChjeHNjaGVtYS5Db250ZXh0UHJvdmlkZXIuVlBDX1BST1ZJREVSKTtcbiAgICBleHBlY3QoKG9wdGlvbnMucHJvcHMgfHwge30pLnJldHVybkFzeW1tZXRyaWNTdWJuZXRzKS50b0VxdWFsKHRydWUpO1xuXG4gICAgaWYgKHBhcmFtVmFsaWRhdG9yKSB7XG4gICAgICBwYXJhbVZhbGlkYXRvcihvcHRpb25zLnByb3BzIGFzIGFueSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbHVlOiB7XG4gICAgICAgIGF2YWlsYWJpbGl0eVpvbmVzOiBbXSxcbiAgICAgICAgaXNvbGF0ZWRTdWJuZXRJZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgaXNvbGF0ZWRTdWJuZXROYW1lczogdW5kZWZpbmVkLFxuICAgICAgICBpc29sYXRlZFN1Ym5ldFJvdXRlVGFibGVJZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgcHJpdmF0ZVN1Ym5ldElkczogdW5kZWZpbmVkLFxuICAgICAgICBwcml2YXRlU3VibmV0TmFtZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgcHJpdmF0ZVN1Ym5ldFJvdXRlVGFibGVJZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgcHVibGljU3VibmV0SWRzOiB1bmRlZmluZWQsXG4gICAgICAgIHB1YmxpY1N1Ym5ldE5hbWVzOiB1bmRlZmluZWQsXG4gICAgICAgIHB1YmxpY1N1Ym5ldFJvdXRlVGFibGVJZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgLi4ucmVzcG9uc2UsXG4gICAgICB9IGFzIGN4YXBpLlZwY0NvbnRleHRSZXNwb25zZSxcbiAgICB9O1xuICB9O1xuICByZXR1cm4gcHJldmlvdXM7XG59XG5cbmZ1bmN0aW9uIHJlc3RvcmVDb250ZXh0UHJvdmlkZXIocHJldmlvdXM6IChzY29wZTogQ29uc3RydWN0LCBvcHRpb25zOiBHZXRDb250ZXh0VmFsdWVPcHRpb25zKSA9PiBHZXRDb250ZXh0VmFsdWVSZXN1bHQpOiB2b2lkIHtcbiAgQ29udGV4dFByb3ZpZGVyLmdldFZhbHVlID0gcHJldmlvdXM7XG59XG4iXX0=