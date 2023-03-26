"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cxschema = require("@aws-cdk/cloud-assembly-schema");
const cx_api_1 = require("@aws-cdk/cx-api");
const constructs_1 = require("constructs");
const util_1 = require("./util");
const core = require("../lib");
const lib_1 = require("../lib");
describe('cfn resource', () => {
    describe('._toCloudFormation', () => {
        test('does not call renderProperties with an undefined value', () => {
            const app = new core.App();
            const stack = new core.Stack(app, 'TestStack');
            const resource = new core.CfnResource(stack, 'DefaultResource', { type: 'Test::Resource::Fake' });
            let called = false;
            resource.renderProperties = (val) => {
                called = true;
                expect(val).not.toBeNull();
            };
            expect(app.synth().getStackByName(stack.stackName).template?.Resources).toEqual({
                DefaultResource: {
                    Type: 'Test::Resource::Fake',
                },
            });
            expect(called).toEqual(true);
        });
        test('renders "Properties" for a resource that has only properties set to "false"', () => {
            const app = new core.App();
            const stack = new core.Stack(app, 'TestStack');
            new core.CfnResource(stack, 'Resource', {
                type: 'Test::Resource::Fake',
                properties: {
                    FakeProperty: false,
                },
            });
            expect(app.synth().getStackByName(stack.stackName).template?.Resources).toEqual({
                Resource: {
                    Type: 'Test::Resource::Fake',
                    Properties: {
                        FakeProperty: false,
                    },
                },
            });
        });
    });
    describe('snapshot removal policy', () => {
        const supportedResources = [
            'AWS::EC2::Volume',
            'AWS::ElastiCache::CacheCluster',
            'AWS::ElastiCache::ReplicationGroup',
            'AWS::Neptune::DBCluster',
            'AWS::RDS::DBCluster',
            'AWS::RDS::DBInstance',
            'AWS::Redshift::Cluster',
        ];
        test.each(supportedResources)('works as expected when used on supported resources (old behavior)', (resourceType) => {
            // GIVEN
            const app = new core.App();
            const stack = new core.Stack(app, 'TestStack');
            const resource = new core.CfnResource(stack, 'Resource', {
                type: resourceType,
            });
            // WHEN
            resource.applyRemovalPolicy(core.RemovalPolicy.SNAPSHOT);
            // THEN
            expect(app.synth().getStackByName(stack.stackName).template?.Resources).toEqual({
                Resource: {
                    Type: resourceType,
                    DeletionPolicy: 'Snapshot',
                    UpdateReplacePolicy: 'Snapshot',
                },
            });
        });
        test.each(supportedResources)('works as expected when used on supported resources (under feature flag)', (resourceType) => {
            // GIVEN
            const app = new core.App({ context: { [cx_api_1.VALIDATE_SNAPSHOT_REMOVAL_POLICY]: true } });
            const stack = new core.Stack(app, 'TestStack');
            const resource = new core.CfnResource(stack, 'Resource', {
                type: resourceType,
            });
            // WHEN
            resource.applyRemovalPolicy(core.RemovalPolicy.SNAPSHOT);
            // THEN
            expect(app.synth().getStackByName(stack.stackName).template?.Resources).toEqual({
                Resource: {
                    Type: resourceType,
                    DeletionPolicy: 'Snapshot',
                    UpdateReplacePolicy: 'Snapshot',
                },
            });
        });
        test('warns on unsupported resources (without feature flag)', () => {
            // GIVEN
            const app = new core.App();
            const stack = new core.Stack(app);
            const resource = new core.CfnResource(stack, 'Resource', {
                type: 'AWS::Lambda::Function',
            });
            // WHEN
            resource.applyRemovalPolicy(core.RemovalPolicy.SNAPSHOT);
            // THEN
            expect((0, util_1.getWarnings)(app.synth())).toEqual([
                {
                    path: '/Default/Resource',
                    message: 'AWS::Lambda::Function does not support snapshot removal policy. This policy will be ignored.',
                },
            ]);
        });
        test('fails on unsupported resources (under feature flag)', () => {
            // GIVEN
            const app = new core.App({ context: { [cx_api_1.VALIDATE_SNAPSHOT_REMOVAL_POLICY]: true } });
            const stack = new core.Stack(app);
            const resource = new core.CfnResource(stack, 'Resource', {
                type: 'AWS::Lambda::Function',
            });
            // THEN
            expect(() => resource.applyRemovalPolicy(core.RemovalPolicy.SNAPSHOT)).toThrowError('AWS::Lambda::Function does not support snapshot removal policy');
        });
    });
    describe('dependency methods', () => {
        test('can explicitly add a dependency between resources', () => {
            const app = new core.App();
            const stack = new core.Stack(app, 'TestStack');
            const resource1 = new core.CfnResource(stack, 'Resource1', { type: 'Test::Resource::Fake1' });
            const resource2 = new core.CfnResource(stack, 'Resource2', { type: 'Test::Resource::Fake2' });
            resource1.addDependency(resource2);
            expect(app.synth().getStackByName(stack.stackName).template.Resources).toEqual({
                Resource1: {
                    Type: 'Test::Resource::Fake1',
                    DependsOn: [
                        'Resource2',
                    ],
                },
                Resource2: {
                    Type: 'Test::Resource::Fake2',
                },
            });
        });
        test('can explicitly remove a dependency between resources', () => {
            const app = new core.App();
            const stack = new core.Stack(app, 'TestStack');
            const resource1 = new core.CfnResource(stack, 'Resource1', { type: 'Test::Resource::Fake1' });
            const resource2 = new core.CfnResource(stack, 'Resource2', { type: 'Test::Resource::Fake2' });
            resource1.addDependency(resource2);
            resource1.removeDependency(resource2);
            expect(app.synth().getStackByName(stack.stackName).template.Resources).toEqual({
                Resource1: {
                    Type: 'Test::Resource::Fake1',
                },
                Resource2: {
                    Type: 'Test::Resource::Fake2',
                },
            });
        });
        test('can explicitly add, obtain, and remove dependencies across stacks', () => {
            const app = new core.App();
            const stack1 = new core.Stack(app, 'TestStack1');
            // Use a really long construct id to identify issues between Names.uniqueId and Names.uniqueResourceName
            const reallyLongConstructId = 'A'.repeat(247);
            const stack2 = new core.Stack(app, reallyLongConstructId, { stackName: 'TestStack2' });
            // Sanity check since this test depends on the discrepancy
            expect(lib_1.Names.uniqueId(stack2)).not.toBe(lib_1.Names.uniqueResourceName(stack2, {}));
            const resource1 = new core.CfnResource(stack1, 'Resource1', { type: 'Test::Resource::Fake1' });
            const resource2 = new core.CfnResource(stack2, 'Resource2', { type: 'Test::Resource::Fake2' });
            const resource3 = new core.CfnResource(stack1, 'Resource3', { type: 'Test::Resource::Fake3' });
            resource1.addDependency(resource2);
            // Adding the same resource dependency twice should be a no-op
            resource1.addDependency(resource2);
            resource1.addDependency(resource3);
            expect(stack1.dependencies.length).toEqual(1);
            expect(stack1.dependencies[0].node.id).toEqual(stack2.node.id);
            // obtainDependencies should assemble and flatten resource-to-resource dependencies even across stacks
            expect(resource1.obtainDependencies().map(x => x.node.path)).toEqual([resource3.node.path, resource2.node.path]);
            resource1.removeDependency(resource2);
            // For symmetry, removing a dependency that doesn't exist should be a no-op
            resource1.removeDependency(resource2);
            expect(stack1.dependencies.length).toEqual(0);
        });
        test('can explicitly add, then replace dependencies across stacks', () => {
            const app = new core.App();
            const stack1 = new core.Stack(app, 'TestStack1');
            const stack2 = new core.Stack(app, 'TestStack2');
            const stack3 = new core.Stack(app, 'TestStack3');
            const resource1 = new core.CfnResource(stack1, 'Resource1', { type: 'Test::Resource::Fake1' });
            const resource2 = new core.CfnResource(stack2, 'Resource2', { type: 'Test::Resource::Fake2' });
            const resource3 = new core.CfnResource(stack3, 'Resource3', { type: 'Test::Resource::Fake3' });
            resource1.addDependency(resource2);
            // Adding the same resource dependency twice should be a no-op
            resource1.replaceDependency(resource2, resource3);
            expect(stack1.dependencies).toEqual([stack3]);
            // obtainDependencies should assemble and flatten resource-to-resource dependencies even across stacks
            expect(resource1.obtainDependencies().map(x => x.node.path)).toEqual([resource3.node.path]);
            // Replacing a dependency that doesn't exist should raise an exception
            expect(() => {
                resource1.replaceDependency(resource2, resource3);
            }).toThrow(/ does not depend on /);
        });
        test('do nothing if source is target', () => {
            const app = new core.App();
            const stack = new core.Stack(app, 'TestStack');
            const resource1 = new core.CfnResource(stack, 'Resource1', { type: 'Test::Resource::Fake1' });
            resource1.addDependency(resource1);
            expect(app.synth().getStackByName(stack.stackName).template.Resources).toEqual({
                Resource1: {
                    Type: 'Test::Resource::Fake1',
                },
            });
        });
        test('do nothing if target does not synth', () => {
            const app = new core.App();
            const stack = new core.Stack(app, 'TestStack');
            class NoSynthResource extends core.CfnResource {
                shouldSynthesize() {
                    return false;
                }
            }
            const resource1 = new core.CfnResource(stack, 'Resource1', { type: 'Test::Resource::Fake1' });
            const resource2 = new NoSynthResource(stack, 'Resource2', { type: 'Test::Resource::Fake2' });
            resource1.removeDependency(resource2);
            resource1.addDependency(resource2);
            expect(app.synth().getStackByName(stack.stackName).template.Resources).toEqual({
                Resource1: {
                    Type: 'Test::Resource::Fake1',
                },
            });
        });
        test('replace throws an error if oldTarget is not depended on', () => {
            const app = new core.App();
            const stack = new core.Stack(app, 'TestStack');
            const resource1 = new core.CfnResource(stack, 'Resource1', { type: 'Test::Resource::Fake1' });
            const resource2 = new core.CfnResource(stack, 'Resource2', { type: 'Test::Resource::Fake2' });
            const resource3 = new core.CfnResource(stack, 'Resource3', { type: 'Test::Resource::Fake3' });
            expect(() => {
                resource1.replaceDependency(resource2, resource3);
            }).toThrow(/does not depend on/);
        });
    });
    test('applyRemovalPolicy default includes Update policy', () => {
        // GIVEN
        const app = new core.App();
        const stack = new core.Stack(app, 'TestStack');
        const resource = new core.CfnResource(stack, 'DefaultResource', { type: 'Test::Resource::Fake' });
        // WHEN
        resource.applyRemovalPolicy(core.RemovalPolicy.RETAIN);
        // THEN
        expect(app.synth().getStackByName(stack.stackName).template?.Resources).toEqual({
            DefaultResource: {
                Type: 'Test::Resource::Fake',
                DeletionPolicy: 'Retain',
                UpdateReplacePolicy: 'Retain',
            },
        });
    });
    test('can switch off updating Update policy', () => {
        // GIVEN
        const app = new core.App();
        const stack = new core.Stack(app, 'TestStack');
        const resource = new core.CfnResource(stack, 'DefaultResource', { type: 'Test::Resource::Fake' });
        // WHEN
        resource.applyRemovalPolicy(core.RemovalPolicy.RETAIN, {
            applyToUpdateReplacePolicy: false,
        });
        // THEN
        expect(app.synth().getStackByName(stack.stackName).template?.Resources).toEqual({
            DefaultResource: {
                Type: 'Test::Resource::Fake',
                DeletionPolicy: 'Retain',
            },
        });
    });
    test('can add metadata', () => {
        // GIVEN
        const app = new core.App();
        const stack = new core.Stack(app, 'TestStack');
        const resource = new core.CfnResource(stack, 'DefaultResource', { type: 'Test::Resource::Fake' });
        // WHEN
        resource.addMetadata('Beep', 'Boop');
        // THEN
        expect(app.synth().getStackByName(stack.stackName).template?.Resources).toEqual({
            DefaultResource: {
                Type: 'Test::Resource::Fake',
                Metadata: {
                    Beep: 'Boop',
                },
            },
        });
    });
    test('can read metadata', () => {
        // GIVEN
        const app = new core.App();
        const stack = new core.Stack(app, 'TestStack');
        const resource = new core.CfnResource(stack, 'DefaultResource', { type: 'Test::Resource::Fake' });
        resource.addMetadata('Beep', 'Boop');
        // THEN
        expect(resource.getMetadata('Beep')).toEqual('Boop');
    });
    test('subclasses can override "shouldSynthesize" to lazy-determine if the resource should be included', () => {
        // GIVEN
        class HiddenCfnResource extends core.CfnResource {
            shouldSynthesize() {
                return false;
            }
        }
        const app = new core.App();
        const stack = new core.Stack(app, 'TestStack');
        const subtree = new constructs_1.Construct(stack, 'subtree');
        // WHEN
        new HiddenCfnResource(subtree, 'R1', { type: 'Foo::R1' });
        const r2 = new core.CfnResource(stack, 'R2', { type: 'Foo::R2' });
        // also try to take a dependency on the parent of `r1` and expect the dependency not to materialize
        r2.node.addDependency(subtree);
        // THEN - only R2 is synthesized
        expect(app.synth().getStackByName(stack.stackName).template?.Resources).toEqual({
            R2: {
                Type: 'Foo::R2',
                // No DependsOn!
            },
        });
    });
    test('CfnResource cannot be created outside Stack', () => {
        const app = new core.App();
        expect(() => {
            new core.CfnResource(app, 'Resource', {
                type: 'Some::Resource',
            });
        }).toThrow(/should be created in the scope of a Stack, but no Stack found/);
    });
    /**
     * Stages start a new scope, which does not count as a Stack anymore
     */
    test('CfnResource cannot be in Stage in Stack', () => {
        const app = new core.App();
        const stack = new core.Stack(app, 'Stack');
        const stage = new core.Stage(stack, 'Stage');
        expect(() => {
            new core.CfnResource(stage, 'Resource', {
                type: 'Some::Resource',
            });
        }).toThrow(/should be created in the scope of a Stack, but no Stack found/);
    });
    test('CfnResource has logical ID metadata with stack trace attached', () => {
        process.env.CDK_DEBUG = '1';
        try {
            const app = new core.App();
            const stack = new core.Stack(app, 'Stack');
            const res = new core.CfnResource(stack, 'SomeCfnResource', {
                type: 'Some::Resource',
            });
            // THEN
            const metadata = res.node.metadata.find(m => m.type === cxschema.ArtifactMetadataEntryType.LOGICAL_ID);
            expect(metadata).toBeDefined();
            expect(metadata?.trace).toBeDefined();
            expect(metadata?.trace?.length).toBeGreaterThan(0);
        }
        finally {
            delete process.env.CDK_DEBUG;
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLXJlc291cmNlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZm4tcmVzb3VyY2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJEQUEyRDtBQUMzRCw0Q0FBbUU7QUFDbkUsMkNBQXVDO0FBQ3ZDLGlDQUFxQztBQUNyQywrQkFBK0I7QUFDL0IsZ0NBQStCO0FBRS9CLFFBQVEsQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFO0lBQzVCLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUU7UUFDbEMsSUFBSSxDQUFDLHdEQUF3RCxFQUFFLEdBQUcsRUFBRTtZQUNsRSxNQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUMzQixNQUFNLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQy9DLE1BQU0sUUFBUSxHQUFHLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLEVBQUUsRUFBRSxJQUFJLEVBQUUsc0JBQXNCLEVBQUUsQ0FBQyxDQUFDO1lBRWxHLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQztZQUNsQixRQUFnQixDQUFDLGdCQUFnQixHQUFHLENBQUMsR0FBUSxFQUFFLEVBQUU7Z0JBQ2hELE1BQU0sR0FBRyxJQUFJLENBQUM7Z0JBQ2QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUM3QixDQUFDLENBQUM7WUFFRixNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDOUUsZUFBZSxFQUFFO29CQUNmLElBQUksRUFBRSxzQkFBc0I7aUJBQzdCO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyw2RUFBNkUsRUFBRSxHQUFHLEVBQUU7WUFDdkYsTUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDM0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUMvQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtnQkFDdEMsSUFBSSxFQUFFLHNCQUFzQjtnQkFDNUIsVUFBVSxFQUFFO29CQUNWLFlBQVksRUFBRSxLQUFLO2lCQUNwQjthQUNGLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUM5RSxRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLHNCQUFzQjtvQkFDNUIsVUFBVSxFQUFFO3dCQUNWLFlBQVksRUFBRSxLQUFLO3FCQUNwQjtpQkFDRjthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMseUJBQXlCLEVBQUUsR0FBRyxFQUFFO1FBQ3ZDLE1BQU0sa0JBQWtCLEdBQUc7WUFDekIsa0JBQWtCO1lBQ2xCLGdDQUFnQztZQUNoQyxvQ0FBb0M7WUFDcEMseUJBQXlCO1lBQ3pCLHFCQUFxQjtZQUNyQixzQkFBc0I7WUFDdEIsd0JBQXdCO1NBQ3pCLENBQUM7UUFFRixJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQzNCLG1FQUFtRSxFQUFFLENBQUMsWUFBWSxFQUFFLEVBQUU7WUFDcEYsUUFBUTtZQUNSLE1BQU0sR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQzNCLE1BQU0sS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDL0MsTUFBTSxRQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7Z0JBQ3ZELElBQUksRUFBRSxZQUFZO2FBQ25CLENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxRQUFRLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUV6RCxPQUFPO1lBQ1AsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQzlFLFFBQVEsRUFBRTtvQkFDUixJQUFJLEVBQUUsWUFBWTtvQkFDbEIsY0FBYyxFQUFFLFVBQVU7b0JBQzFCLG1CQUFtQixFQUFFLFVBQVU7aUJBQ2hDO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUNGLENBQUM7UUFFRixJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQzNCLHlFQUF5RSxFQUFFLENBQUMsWUFBWSxFQUFFLEVBQUU7WUFDMUYsUUFBUTtZQUNSLE1BQU0sR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMseUNBQWdDLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDcEYsTUFBTSxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUMvQyxNQUFNLFFBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtnQkFDdkQsSUFBSSxFQUFFLFlBQVk7YUFDbkIsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRXpELE9BQU87WUFDUCxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDOUUsUUFBUSxFQUFFO29CQUNSLElBQUksRUFBRSxZQUFZO29CQUNsQixjQUFjLEVBQUUsVUFBVTtvQkFDMUIsbUJBQW1CLEVBQUUsVUFBVTtpQkFDaEM7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQ0YsQ0FBQztRQUVGLElBQUksQ0FBQyx1REFBdUQsRUFBRSxHQUFHLEVBQUU7WUFDakUsUUFBUTtZQUNSLE1BQU0sR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQzNCLE1BQU0sS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNsQyxNQUFNLFFBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtnQkFDdkQsSUFBSSxFQUFFLHVCQUF1QjthQUM5QixDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AsUUFBUSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFekQsT0FBTztZQUNQLE1BQU0sQ0FBQyxJQUFBLGtCQUFXLEVBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3ZDO29CQUNFLElBQUksRUFBRSxtQkFBbUI7b0JBQ3pCLE9BQU8sRUFBRSw4RkFBOEY7aUJBQ3hHO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMscURBQXFELEVBQUUsR0FBRyxFQUFFO1lBQy9ELFFBQVE7WUFDUixNQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLHlDQUFnQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3BGLE1BQU0sS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNsQyxNQUFNLFFBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtnQkFDdkQsSUFBSSxFQUFFLHVCQUF1QjthQUM5QixDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLGdFQUFnRSxDQUFDLENBQUM7UUFDeEosQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUU7UUFDbEMsSUFBSSxDQUFDLG1EQUFtRCxFQUFFLEdBQUcsRUFBRTtZQUM3RCxNQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUMzQixNQUFNLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQy9DLE1BQU0sU0FBUyxHQUFHLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLEVBQUUsSUFBSSxFQUFFLHVCQUF1QixFQUFFLENBQUMsQ0FBQztZQUM5RixNQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxFQUFFLElBQUksRUFBRSx1QkFBdUIsRUFBRSxDQUFDLENBQUM7WUFDOUYsU0FBUyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUVuQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDN0UsU0FBUyxFQUFFO29CQUNULElBQUksRUFBRSx1QkFBdUI7b0JBQzdCLFNBQVMsRUFBRTt3QkFDVCxXQUFXO3FCQUNaO2lCQUNGO2dCQUNELFNBQVMsRUFBRTtvQkFDVCxJQUFJLEVBQUUsdUJBQXVCO2lCQUM5QjthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHNEQUFzRCxFQUFFLEdBQUcsRUFBRTtZQUNoRSxNQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUMzQixNQUFNLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQy9DLE1BQU0sU0FBUyxHQUFHLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLEVBQUUsSUFBSSxFQUFFLHVCQUF1QixFQUFFLENBQUMsQ0FBQztZQUM5RixNQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxFQUFFLElBQUksRUFBRSx1QkFBdUIsRUFBRSxDQUFDLENBQUM7WUFDOUYsU0FBUyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNuQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFdEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQzdFLFNBQVMsRUFBRTtvQkFDVCxJQUFJLEVBQUUsdUJBQXVCO2lCQUM5QjtnQkFDRCxTQUFTLEVBQUU7b0JBQ1QsSUFBSSxFQUFFLHVCQUF1QjtpQkFDOUI7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxtRUFBbUUsRUFBRSxHQUFHLEVBQUU7WUFDN0UsTUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDM0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUNqRCx3R0FBd0c7WUFDeEcsTUFBTSxxQkFBcUIsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzlDLE1BQU0sTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUscUJBQXFCLEVBQUUsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQztZQUN2RiwwREFBMEQ7WUFDMUQsTUFBTSxDQUFDLFdBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQUssQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM5RSxNQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxFQUFFLElBQUksRUFBRSx1QkFBdUIsRUFBRSxDQUFDLENBQUM7WUFDL0YsTUFBTSxTQUFTLEdBQUcsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxJQUFJLEVBQUUsdUJBQXVCLEVBQUUsQ0FBQyxDQUFDO1lBQy9GLE1BQU0sU0FBUyxHQUFHLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLEVBQUUsSUFBSSxFQUFFLHVCQUF1QixFQUFFLENBQUMsQ0FBQztZQUUvRixTQUFTLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ25DLDhEQUE4RDtZQUM5RCxTQUFTLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ25DLFNBQVMsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDbkMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlDLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMvRCxzR0FBc0c7WUFDdEcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFakgsU0FBUyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3RDLDJFQUEyRTtZQUMzRSxTQUFTLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hELENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDZEQUE2RCxFQUFFLEdBQUcsRUFBRTtZQUN2RSxNQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUMzQixNQUFNLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQ2pELE1BQU0sTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDakQsTUFBTSxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUNqRCxNQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxFQUFFLElBQUksRUFBRSx1QkFBdUIsRUFBRSxDQUFDLENBQUM7WUFDL0YsTUFBTSxTQUFTLEdBQUcsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxJQUFJLEVBQUUsdUJBQXVCLEVBQUUsQ0FBQyxDQUFDO1lBQy9GLE1BQU0sU0FBUyxHQUFHLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLEVBQUUsSUFBSSxFQUFFLHVCQUF1QixFQUFFLENBQUMsQ0FBQztZQUUvRixTQUFTLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ25DLDhEQUE4RDtZQUM5RCxTQUFTLENBQUMsaUJBQWlCLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ2xELE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUM5QyxzR0FBc0c7WUFDdEcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFNUYsc0VBQXNFO1lBQ3RFLE1BQU0sQ0FBQyxHQUFHLEVBQUU7Z0JBQ1YsU0FBUyxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUNwRCxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxHQUFHLEVBQUU7WUFDMUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDM0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUMvQyxNQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxFQUFFLElBQUksRUFBRSx1QkFBdUIsRUFBRSxDQUFDLENBQUM7WUFDOUYsU0FBUyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUVuQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDN0UsU0FBUyxFQUFFO29CQUNULElBQUksRUFBRSx1QkFBdUI7aUJBQzlCO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMscUNBQXFDLEVBQUUsR0FBRyxFQUFFO1lBQy9DLE1BQU0sR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQzNCLE1BQU0sS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFFL0MsTUFBTSxlQUFnQixTQUFRLElBQUksQ0FBQyxXQUFXO2dCQUNsQyxnQkFBZ0I7b0JBQ3hCLE9BQU8sS0FBSyxDQUFDO2lCQUNkO2FBQ0Y7WUFFRCxNQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxFQUFFLElBQUksRUFBRSx1QkFBdUIsRUFBRSxDQUFDLENBQUM7WUFDOUYsTUFBTSxTQUFTLEdBQUcsSUFBSSxlQUFlLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxFQUFFLElBQUksRUFBRSx1QkFBdUIsRUFBRSxDQUFDLENBQUM7WUFDN0YsU0FBUyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3RDLFNBQVMsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFbkMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQzdFLFNBQVMsRUFBRTtvQkFDVCxJQUFJLEVBQUUsdUJBQXVCO2lCQUM5QjthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHlEQUF5RCxFQUFFLEdBQUcsRUFBRTtZQUNuRSxNQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUMzQixNQUFNLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBRS9DLE1BQU0sU0FBUyxHQUFHLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLEVBQUUsSUFBSSxFQUFFLHVCQUF1QixFQUFFLENBQUMsQ0FBQztZQUM5RixNQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxFQUFFLElBQUksRUFBRSx1QkFBdUIsRUFBRSxDQUFDLENBQUM7WUFDOUYsTUFBTSxTQUFTLEdBQUcsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUUsRUFBRSxJQUFJLEVBQUUsdUJBQXVCLEVBQUUsQ0FBQyxDQUFDO1lBQzlGLE1BQU0sQ0FBQyxHQUFHLEVBQUU7Z0JBQ1YsU0FBUyxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUNwRCxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG1EQUFtRCxFQUFFLEdBQUcsRUFBRTtRQUM3RCxRQUFRO1FBQ1IsTUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDM0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUMvQyxNQUFNLFFBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLGlCQUFpQixFQUFFLEVBQUUsSUFBSSxFQUFFLHNCQUFzQixFQUFFLENBQUMsQ0FBQztRQUVsRyxPQUFPO1FBQ1AsUUFBUSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdkQsT0FBTztRQUNQLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQzlFLGVBQWUsRUFBRTtnQkFDZixJQUFJLEVBQUUsc0JBQXNCO2dCQUM1QixjQUFjLEVBQUUsUUFBUTtnQkFDeEIsbUJBQW1CLEVBQUUsUUFBUTthQUM5QjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHVDQUF1QyxFQUFFLEdBQUcsRUFBRTtRQUNqRCxRQUFRO1FBQ1IsTUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDM0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUMvQyxNQUFNLFFBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLGlCQUFpQixFQUFFLEVBQUUsSUFBSSxFQUFFLHNCQUFzQixFQUFFLENBQUMsQ0FBQztRQUVsRyxPQUFPO1FBQ1AsUUFBUSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFO1lBQ3JELDBCQUEwQixFQUFFLEtBQUs7U0FDbEMsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQzlFLGVBQWUsRUFBRTtnQkFDZixJQUFJLEVBQUUsc0JBQXNCO2dCQUM1QixjQUFjLEVBQUUsUUFBUTthQUN6QjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtRQUM1QixRQUFRO1FBQ1IsTUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDM0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUMvQyxNQUFNLFFBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLGlCQUFpQixFQUFFLEVBQUUsSUFBSSxFQUFFLHNCQUFzQixFQUFFLENBQUMsQ0FBQztRQUVsRyxPQUFPO1FBQ1AsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFckMsT0FBTztRQUNQLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQzlFLGVBQWUsRUFBRTtnQkFDZixJQUFJLEVBQUUsc0JBQXNCO2dCQUM1QixRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLE1BQU07aUJBQ2I7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtRQUM3QixRQUFRO1FBQ1IsTUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDM0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUMvQyxNQUFNLFFBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLGlCQUFpQixFQUFFLEVBQUUsSUFBSSxFQUFFLHNCQUFzQixFQUFFLENBQUMsQ0FBQztRQUNsRyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVyQyxPQUFPO1FBQ1AsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdkQsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsaUdBQWlHLEVBQUUsR0FBRyxFQUFFO1FBQzNHLFFBQVE7UUFDUixNQUFNLGlCQUFrQixTQUFRLElBQUksQ0FBQyxXQUFXO1lBQ3BDLGdCQUFnQjtnQkFDeEIsT0FBTyxLQUFLLENBQUM7YUFDZDtTQUNGO1FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDM0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUMvQyxNQUFNLE9BQU8sR0FBRyxJQUFJLHNCQUFTLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRWhELE9BQU87UUFDUCxJQUFJLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUMxRCxNQUFNLEVBQUUsR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO1FBRWxFLG1HQUFtRztRQUNuRyxFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUvQixnQ0FBZ0M7UUFDaEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDOUUsRUFBRSxFQUFFO2dCQUNGLElBQUksRUFBRSxTQUFTO2dCQUNmLGdCQUFnQjthQUNqQjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDZDQUE2QyxFQUFFLEdBQUcsRUFBRTtRQUN2RCxNQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUMzQixNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1YsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxVQUFVLEVBQUU7Z0JBQ3BDLElBQUksRUFBRSxnQkFBZ0I7YUFDdkIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLCtEQUErRCxDQUFDLENBQUM7SUFDOUUsQ0FBQyxDQUFDLENBQUM7SUFFSDs7T0FFRztJQUNILElBQUksQ0FBQyx5Q0FBeUMsRUFBRSxHQUFHLEVBQUU7UUFDbkQsTUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDM0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMzQyxNQUFNLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDVixJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtnQkFDdEMsSUFBSSxFQUFFLGdCQUFnQjthQUN2QixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsK0RBQStELENBQUMsQ0FBQztJQUM5RSxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywrREFBK0QsRUFBRSxHQUFHLEVBQUU7UUFDekUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO1FBQzVCLElBQUk7WUFDRixNQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUMzQixNQUFNLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzNDLE1BQU0sR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLEVBQUU7Z0JBQ3pELElBQUksRUFBRSxnQkFBZ0I7YUFDdkIsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDLHlCQUF5QixDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3ZHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUMvQixNQUFNLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3RDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNwRDtnQkFBUztZQUNSLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUM7U0FDOUI7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY3hzY2hlbWEgZnJvbSAnQGF3cy1jZGsvY2xvdWQtYXNzZW1ibHktc2NoZW1hJztcbmltcG9ydCB7IFZBTElEQVRFX1NOQVBTSE9UX1JFTU9WQUxfUE9MSUNZIH0gZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgZ2V0V2FybmluZ3MgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0ICogYXMgY29yZSBmcm9tICcuLi9saWInO1xuaW1wb3J0IHsgTmFtZXMgfSBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgnY2ZuIHJlc291cmNlJywgKCkgPT4ge1xuICBkZXNjcmliZSgnLl90b0Nsb3VkRm9ybWF0aW9uJywgKCkgPT4ge1xuICAgIHRlc3QoJ2RvZXMgbm90IGNhbGwgcmVuZGVyUHJvcGVydGllcyB3aXRoIGFuIHVuZGVmaW5lZCB2YWx1ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjb3JlLkFwcCgpO1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY29yZS5TdGFjayhhcHAsICdUZXN0U3RhY2snKTtcbiAgICAgIGNvbnN0IHJlc291cmNlID0gbmV3IGNvcmUuQ2ZuUmVzb3VyY2Uoc3RhY2ssICdEZWZhdWx0UmVzb3VyY2UnLCB7IHR5cGU6ICdUZXN0OjpSZXNvdXJjZTo6RmFrZScgfSk7XG5cbiAgICAgIGxldCBjYWxsZWQgPSBmYWxzZTtcbiAgICAgIChyZXNvdXJjZSBhcyBhbnkpLnJlbmRlclByb3BlcnRpZXMgPSAodmFsOiBhbnkpID0+IHtcbiAgICAgICAgY2FsbGVkID0gdHJ1ZTtcbiAgICAgICAgZXhwZWN0KHZhbCkubm90LnRvQmVOdWxsKCk7XG4gICAgICB9O1xuXG4gICAgICBleHBlY3QoYXBwLnN5bnRoKCkuZ2V0U3RhY2tCeU5hbWUoc3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZT8uUmVzb3VyY2VzKS50b0VxdWFsKHtcbiAgICAgICAgRGVmYXVsdFJlc291cmNlOiB7XG4gICAgICAgICAgVHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgZXhwZWN0KGNhbGxlZCkudG9FcXVhbCh0cnVlKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3JlbmRlcnMgXCJQcm9wZXJ0aWVzXCIgZm9yIGEgcmVzb3VyY2UgdGhhdCBoYXMgb25seSBwcm9wZXJ0aWVzIHNldCB0byBcImZhbHNlXCInLCAoKSA9PiB7XG4gICAgICBjb25zdCBhcHAgPSBuZXcgY29yZS5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNvcmUuU3RhY2soYXBwLCAnVGVzdFN0YWNrJyk7XG4gICAgICBuZXcgY29yZS5DZm5SZXNvdXJjZShzdGFjaywgJ1Jlc291cmNlJywge1xuICAgICAgICB0eXBlOiAnVGVzdDo6UmVzb3VyY2U6OkZha2UnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgRmFrZVByb3BlcnR5OiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QoYXBwLnN5bnRoKCkuZ2V0U3RhY2tCeU5hbWUoc3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZT8uUmVzb3VyY2VzKS50b0VxdWFsKHtcbiAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICBUeXBlOiAnVGVzdDo6UmVzb3VyY2U6OkZha2UnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIEZha2VQcm9wZXJ0eTogZmFsc2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnc25hcHNob3QgcmVtb3ZhbCBwb2xpY3knLCAoKSA9PiB7XG4gICAgY29uc3Qgc3VwcG9ydGVkUmVzb3VyY2VzID0gW1xuICAgICAgJ0FXUzo6RUMyOjpWb2x1bWUnLFxuICAgICAgJ0FXUzo6RWxhc3RpQ2FjaGU6OkNhY2hlQ2x1c3RlcicsXG4gICAgICAnQVdTOjpFbGFzdGlDYWNoZTo6UmVwbGljYXRpb25Hcm91cCcsXG4gICAgICAnQVdTOjpOZXB0dW5lOjpEQkNsdXN0ZXInLFxuICAgICAgJ0FXUzo6UkRTOjpEQkNsdXN0ZXInLFxuICAgICAgJ0FXUzo6UkRTOjpEQkluc3RhbmNlJyxcbiAgICAgICdBV1M6OlJlZHNoaWZ0OjpDbHVzdGVyJyxcbiAgICBdO1xuXG4gICAgdGVzdC5lYWNoKHN1cHBvcnRlZFJlc291cmNlcykgKFxuICAgICAgJ3dvcmtzIGFzIGV4cGVjdGVkIHdoZW4gdXNlZCBvbiBzdXBwb3J0ZWQgcmVzb3VyY2VzIChvbGQgYmVoYXZpb3IpJywgKHJlc291cmNlVHlwZSkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBjb25zdCBhcHAgPSBuZXcgY29yZS5BcHAoKTtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY29yZS5TdGFjayhhcHAsICdUZXN0U3RhY2snKTtcbiAgICAgICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgY29yZS5DZm5SZXNvdXJjZShzdGFjaywgJ1Jlc291cmNlJywge1xuICAgICAgICAgIHR5cGU6IHJlc291cmNlVHlwZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gV0hFTlxuICAgICAgICByZXNvdXJjZS5hcHBseVJlbW92YWxQb2xpY3koY29yZS5SZW1vdmFsUG9saWN5LlNOQVBTSE9UKTtcblxuICAgICAgICAvLyBUSEVOXG4gICAgICAgIGV4cGVjdChhcHAuc3ludGgoKS5nZXRTdGFja0J5TmFtZShzdGFjay5zdGFja05hbWUpLnRlbXBsYXRlPy5SZXNvdXJjZXMpLnRvRXF1YWwoe1xuICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICBUeXBlOiByZXNvdXJjZVR5cGUsXG4gICAgICAgICAgICBEZWxldGlvblBvbGljeTogJ1NuYXBzaG90JyxcbiAgICAgICAgICAgIFVwZGF0ZVJlcGxhY2VQb2xpY3k6ICdTbmFwc2hvdCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICk7XG5cbiAgICB0ZXN0LmVhY2goc3VwcG9ydGVkUmVzb3VyY2VzKSAoXG4gICAgICAnd29ya3MgYXMgZXhwZWN0ZWQgd2hlbiB1c2VkIG9uIHN1cHBvcnRlZCByZXNvdXJjZXMgKHVuZGVyIGZlYXR1cmUgZmxhZyknLCAocmVzb3VyY2VUeXBlKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IGFwcCA9IG5ldyBjb3JlLkFwcCh7IGNvbnRleHQ6IHsgW1ZBTElEQVRFX1NOQVBTSE9UX1JFTU9WQUxfUE9MSUNZXTogdHJ1ZSB9IH0pO1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjb3JlLlN0YWNrKGFwcCwgJ1Rlc3RTdGFjaycpO1xuICAgICAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBjb3JlLkNmblJlc291cmNlKHN0YWNrLCAnUmVzb3VyY2UnLCB7XG4gICAgICAgICAgdHlwZTogcmVzb3VyY2VUeXBlLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBXSEVOXG4gICAgICAgIHJlc291cmNlLmFwcGx5UmVtb3ZhbFBvbGljeShjb3JlLlJlbW92YWxQb2xpY3kuU05BUFNIT1QpO1xuXG4gICAgICAgIC8vIFRIRU5cbiAgICAgICAgZXhwZWN0KGFwcC5zeW50aCgpLmdldFN0YWNrQnlOYW1lKHN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGU/LlJlc291cmNlcykudG9FcXVhbCh7XG4gICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgIFR5cGU6IHJlc291cmNlVHlwZSxcbiAgICAgICAgICAgIERlbGV0aW9uUG9saWN5OiAnU25hcHNob3QnLFxuICAgICAgICAgICAgVXBkYXRlUmVwbGFjZVBvbGljeTogJ1NuYXBzaG90JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgKTtcblxuICAgIHRlc3QoJ3dhcm5zIG9uIHVuc3VwcG9ydGVkIHJlc291cmNlcyAod2l0aG91dCBmZWF0dXJlIGZsYWcpJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjb3JlLkFwcCgpO1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY29yZS5TdGFjayhhcHApO1xuICAgICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgY29yZS5DZm5SZXNvdXJjZShzdGFjaywgJ1Jlc291cmNlJywge1xuICAgICAgICB0eXBlOiAnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICByZXNvdXJjZS5hcHBseVJlbW92YWxQb2xpY3koY29yZS5SZW1vdmFsUG9saWN5LlNOQVBTSE9UKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KGdldFdhcm5pbmdzKGFwcC5zeW50aCgpKSkudG9FcXVhbChbXG4gICAgICAgIHtcbiAgICAgICAgICBwYXRoOiAnL0RlZmF1bHQvUmVzb3VyY2UnLFxuICAgICAgICAgIG1lc3NhZ2U6ICdBV1M6OkxhbWJkYTo6RnVuY3Rpb24gZG9lcyBub3Qgc3VwcG9ydCBzbmFwc2hvdCByZW1vdmFsIHBvbGljeS4gVGhpcyBwb2xpY3kgd2lsbCBiZSBpZ25vcmVkLicsXG4gICAgICAgIH0sXG4gICAgICBdKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2ZhaWxzIG9uIHVuc3VwcG9ydGVkIHJlc291cmNlcyAodW5kZXIgZmVhdHVyZSBmbGFnKScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBhcHAgPSBuZXcgY29yZS5BcHAoeyBjb250ZXh0OiB7IFtWQUxJREFURV9TTkFQU0hPVF9SRU1PVkFMX1BPTElDWV06IHRydWUgfSB9KTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNvcmUuU3RhY2soYXBwKTtcbiAgICAgIGNvbnN0IHJlc291cmNlID0gbmV3IGNvcmUuQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZXNvdXJjZScsIHtcbiAgICAgICAgdHlwZTogJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IHJlc291cmNlLmFwcGx5UmVtb3ZhbFBvbGljeShjb3JlLlJlbW92YWxQb2xpY3kuU05BUFNIT1QpKS50b1Rocm93RXJyb3IoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbiBkb2VzIG5vdCBzdXBwb3J0IHNuYXBzaG90IHJlbW92YWwgcG9saWN5Jyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdkZXBlbmRlbmN5IG1ldGhvZHMnLCAoKSA9PiB7XG4gICAgdGVzdCgnY2FuIGV4cGxpY2l0bHkgYWRkIGEgZGVwZW5kZW5jeSBiZXR3ZWVuIHJlc291cmNlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjb3JlLkFwcCgpO1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY29yZS5TdGFjayhhcHAsICdUZXN0U3RhY2snKTtcbiAgICAgIGNvbnN0IHJlc291cmNlMSA9IG5ldyBjb3JlLkNmblJlc291cmNlKHN0YWNrLCAnUmVzb3VyY2UxJywgeyB0eXBlOiAnVGVzdDo6UmVzb3VyY2U6OkZha2UxJyB9KTtcbiAgICAgIGNvbnN0IHJlc291cmNlMiA9IG5ldyBjb3JlLkNmblJlc291cmNlKHN0YWNrLCAnUmVzb3VyY2UyJywgeyB0eXBlOiAnVGVzdDo6UmVzb3VyY2U6OkZha2UyJyB9KTtcbiAgICAgIHJlc291cmNlMS5hZGREZXBlbmRlbmN5KHJlc291cmNlMik7XG5cbiAgICAgIGV4cGVjdChhcHAuc3ludGgoKS5nZXRTdGFja0J5TmFtZShzdGFjay5zdGFja05hbWUpLnRlbXBsYXRlLlJlc291cmNlcykudG9FcXVhbCh7XG4gICAgICAgIFJlc291cmNlMToge1xuICAgICAgICAgIFR5cGU6ICdUZXN0OjpSZXNvdXJjZTo6RmFrZTEnLFxuICAgICAgICAgIERlcGVuZHNPbjogW1xuICAgICAgICAgICAgJ1Jlc291cmNlMicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgUmVzb3VyY2UyOiB7XG4gICAgICAgICAgVHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlMicsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiBleHBsaWNpdGx5IHJlbW92ZSBhIGRlcGVuZGVuY3kgYmV0d2VlbiByZXNvdXJjZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBhcHAgPSBuZXcgY29yZS5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNvcmUuU3RhY2soYXBwLCAnVGVzdFN0YWNrJyk7XG4gICAgICBjb25zdCByZXNvdXJjZTEgPSBuZXcgY29yZS5DZm5SZXNvdXJjZShzdGFjaywgJ1Jlc291cmNlMScsIHsgdHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlMScgfSk7XG4gICAgICBjb25zdCByZXNvdXJjZTIgPSBuZXcgY29yZS5DZm5SZXNvdXJjZShzdGFjaywgJ1Jlc291cmNlMicsIHsgdHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlMicgfSk7XG4gICAgICByZXNvdXJjZTEuYWRkRGVwZW5kZW5jeShyZXNvdXJjZTIpO1xuICAgICAgcmVzb3VyY2UxLnJlbW92ZURlcGVuZGVuY3kocmVzb3VyY2UyKTtcblxuICAgICAgZXhwZWN0KGFwcC5zeW50aCgpLmdldFN0YWNrQnlOYW1lKHN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGUuUmVzb3VyY2VzKS50b0VxdWFsKHtcbiAgICAgICAgUmVzb3VyY2UxOiB7XG4gICAgICAgICAgVHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlMScsXG4gICAgICAgIH0sXG4gICAgICAgIFJlc291cmNlMjoge1xuICAgICAgICAgIFR5cGU6ICdUZXN0OjpSZXNvdXJjZTo6RmFrZTInLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gZXhwbGljaXRseSBhZGQsIG9idGFpbiwgYW5kIHJlbW92ZSBkZXBlbmRlbmNpZXMgYWNyb3NzIHN0YWNrcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjb3JlLkFwcCgpO1xuICAgICAgY29uc3Qgc3RhY2sxID0gbmV3IGNvcmUuU3RhY2soYXBwLCAnVGVzdFN0YWNrMScpO1xuICAgICAgLy8gVXNlIGEgcmVhbGx5IGxvbmcgY29uc3RydWN0IGlkIHRvIGlkZW50aWZ5IGlzc3VlcyBiZXR3ZWVuIE5hbWVzLnVuaXF1ZUlkIGFuZCBOYW1lcy51bmlxdWVSZXNvdXJjZU5hbWVcbiAgICAgIGNvbnN0IHJlYWxseUxvbmdDb25zdHJ1Y3RJZCA9ICdBJy5yZXBlYXQoMjQ3KTtcbiAgICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBjb3JlLlN0YWNrKGFwcCwgcmVhbGx5TG9uZ0NvbnN0cnVjdElkLCB7IHN0YWNrTmFtZTogJ1Rlc3RTdGFjazInIH0pO1xuICAgICAgLy8gU2FuaXR5IGNoZWNrIHNpbmNlIHRoaXMgdGVzdCBkZXBlbmRzIG9uIHRoZSBkaXNjcmVwYW5jeVxuICAgICAgZXhwZWN0KE5hbWVzLnVuaXF1ZUlkKHN0YWNrMikpLm5vdC50b0JlKE5hbWVzLnVuaXF1ZVJlc291cmNlTmFtZShzdGFjazIsIHt9KSk7XG4gICAgICBjb25zdCByZXNvdXJjZTEgPSBuZXcgY29yZS5DZm5SZXNvdXJjZShzdGFjazEsICdSZXNvdXJjZTEnLCB7IHR5cGU6ICdUZXN0OjpSZXNvdXJjZTo6RmFrZTEnIH0pO1xuICAgICAgY29uc3QgcmVzb3VyY2UyID0gbmV3IGNvcmUuQ2ZuUmVzb3VyY2Uoc3RhY2syLCAnUmVzb3VyY2UyJywgeyB0eXBlOiAnVGVzdDo6UmVzb3VyY2U6OkZha2UyJyB9KTtcbiAgICAgIGNvbnN0IHJlc291cmNlMyA9IG5ldyBjb3JlLkNmblJlc291cmNlKHN0YWNrMSwgJ1Jlc291cmNlMycsIHsgdHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlMycgfSk7XG5cbiAgICAgIHJlc291cmNlMS5hZGREZXBlbmRlbmN5KHJlc291cmNlMik7XG4gICAgICAvLyBBZGRpbmcgdGhlIHNhbWUgcmVzb3VyY2UgZGVwZW5kZW5jeSB0d2ljZSBzaG91bGQgYmUgYSBuby1vcFxuICAgICAgcmVzb3VyY2UxLmFkZERlcGVuZGVuY3kocmVzb3VyY2UyKTtcbiAgICAgIHJlc291cmNlMS5hZGREZXBlbmRlbmN5KHJlc291cmNlMyk7XG4gICAgICBleHBlY3Qoc3RhY2sxLmRlcGVuZGVuY2llcy5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICBleHBlY3Qoc3RhY2sxLmRlcGVuZGVuY2llc1swXS5ub2RlLmlkKS50b0VxdWFsKHN0YWNrMi5ub2RlLmlkKTtcbiAgICAgIC8vIG9idGFpbkRlcGVuZGVuY2llcyBzaG91bGQgYXNzZW1ibGUgYW5kIGZsYXR0ZW4gcmVzb3VyY2UtdG8tcmVzb3VyY2UgZGVwZW5kZW5jaWVzIGV2ZW4gYWNyb3NzIHN0YWNrc1xuICAgICAgZXhwZWN0KHJlc291cmNlMS5vYnRhaW5EZXBlbmRlbmNpZXMoKS5tYXAoeCA9PiB4Lm5vZGUucGF0aCkpLnRvRXF1YWwoW3Jlc291cmNlMy5ub2RlLnBhdGgsIHJlc291cmNlMi5ub2RlLnBhdGhdKTtcblxuICAgICAgcmVzb3VyY2UxLnJlbW92ZURlcGVuZGVuY3kocmVzb3VyY2UyKTtcbiAgICAgIC8vIEZvciBzeW1tZXRyeSwgcmVtb3ZpbmcgYSBkZXBlbmRlbmN5IHRoYXQgZG9lc24ndCBleGlzdCBzaG91bGQgYmUgYSBuby1vcFxuICAgICAgcmVzb3VyY2UxLnJlbW92ZURlcGVuZGVuY3kocmVzb3VyY2UyKTtcbiAgICAgIGV4cGVjdChzdGFjazEuZGVwZW5kZW5jaWVzLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiBleHBsaWNpdGx5IGFkZCwgdGhlbiByZXBsYWNlIGRlcGVuZGVuY2llcyBhY3Jvc3Mgc3RhY2tzJywgKCkgPT4ge1xuICAgICAgY29uc3QgYXBwID0gbmV3IGNvcmUuQXBwKCk7XG4gICAgICBjb25zdCBzdGFjazEgPSBuZXcgY29yZS5TdGFjayhhcHAsICdUZXN0U3RhY2sxJyk7XG4gICAgICBjb25zdCBzdGFjazIgPSBuZXcgY29yZS5TdGFjayhhcHAsICdUZXN0U3RhY2syJyk7XG4gICAgICBjb25zdCBzdGFjazMgPSBuZXcgY29yZS5TdGFjayhhcHAsICdUZXN0U3RhY2szJyk7XG4gICAgICBjb25zdCByZXNvdXJjZTEgPSBuZXcgY29yZS5DZm5SZXNvdXJjZShzdGFjazEsICdSZXNvdXJjZTEnLCB7IHR5cGU6ICdUZXN0OjpSZXNvdXJjZTo6RmFrZTEnIH0pO1xuICAgICAgY29uc3QgcmVzb3VyY2UyID0gbmV3IGNvcmUuQ2ZuUmVzb3VyY2Uoc3RhY2syLCAnUmVzb3VyY2UyJywgeyB0eXBlOiAnVGVzdDo6UmVzb3VyY2U6OkZha2UyJyB9KTtcbiAgICAgIGNvbnN0IHJlc291cmNlMyA9IG5ldyBjb3JlLkNmblJlc291cmNlKHN0YWNrMywgJ1Jlc291cmNlMycsIHsgdHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlMycgfSk7XG5cbiAgICAgIHJlc291cmNlMS5hZGREZXBlbmRlbmN5KHJlc291cmNlMik7XG4gICAgICAvLyBBZGRpbmcgdGhlIHNhbWUgcmVzb3VyY2UgZGVwZW5kZW5jeSB0d2ljZSBzaG91bGQgYmUgYSBuby1vcFxuICAgICAgcmVzb3VyY2UxLnJlcGxhY2VEZXBlbmRlbmN5KHJlc291cmNlMiwgcmVzb3VyY2UzKTtcbiAgICAgIGV4cGVjdChzdGFjazEuZGVwZW5kZW5jaWVzKS50b0VxdWFsKFtzdGFjazNdKTtcbiAgICAgIC8vIG9idGFpbkRlcGVuZGVuY2llcyBzaG91bGQgYXNzZW1ibGUgYW5kIGZsYXR0ZW4gcmVzb3VyY2UtdG8tcmVzb3VyY2UgZGVwZW5kZW5jaWVzIGV2ZW4gYWNyb3NzIHN0YWNrc1xuICAgICAgZXhwZWN0KHJlc291cmNlMS5vYnRhaW5EZXBlbmRlbmNpZXMoKS5tYXAoeCA9PiB4Lm5vZGUucGF0aCkpLnRvRXF1YWwoW3Jlc291cmNlMy5ub2RlLnBhdGhdKTtcblxuICAgICAgLy8gUmVwbGFjaW5nIGEgZGVwZW5kZW5jeSB0aGF0IGRvZXNuJ3QgZXhpc3Qgc2hvdWxkIHJhaXNlIGFuIGV4Y2VwdGlvblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgcmVzb3VyY2UxLnJlcGxhY2VEZXBlbmRlbmN5KHJlc291cmNlMiwgcmVzb3VyY2UzKTtcbiAgICAgIH0pLnRvVGhyb3coLyBkb2VzIG5vdCBkZXBlbmQgb24gLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdkbyBub3RoaW5nIGlmIHNvdXJjZSBpcyB0YXJnZXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBhcHAgPSBuZXcgY29yZS5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNvcmUuU3RhY2soYXBwLCAnVGVzdFN0YWNrJyk7XG4gICAgICBjb25zdCByZXNvdXJjZTEgPSBuZXcgY29yZS5DZm5SZXNvdXJjZShzdGFjaywgJ1Jlc291cmNlMScsIHsgdHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlMScgfSk7XG4gICAgICByZXNvdXJjZTEuYWRkRGVwZW5kZW5jeShyZXNvdXJjZTEpO1xuXG4gICAgICBleHBlY3QoYXBwLnN5bnRoKCkuZ2V0U3RhY2tCeU5hbWUoc3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZS5SZXNvdXJjZXMpLnRvRXF1YWwoe1xuICAgICAgICBSZXNvdXJjZTE6IHtcbiAgICAgICAgICBUeXBlOiAnVGVzdDo6UmVzb3VyY2U6OkZha2UxJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZG8gbm90aGluZyBpZiB0YXJnZXQgZG9lcyBub3Qgc3ludGgnLCAoKSA9PiB7XG4gICAgICBjb25zdCBhcHAgPSBuZXcgY29yZS5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNvcmUuU3RhY2soYXBwLCAnVGVzdFN0YWNrJyk7XG5cbiAgICAgIGNsYXNzIE5vU3ludGhSZXNvdXJjZSBleHRlbmRzIGNvcmUuQ2ZuUmVzb3VyY2Uge1xuICAgICAgICBwcm90ZWN0ZWQgc2hvdWxkU3ludGhlc2l6ZSgpOiBib29sZWFuIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzb3VyY2UxID0gbmV3IGNvcmUuQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZXNvdXJjZTEnLCB7IHR5cGU6ICdUZXN0OjpSZXNvdXJjZTo6RmFrZTEnIH0pO1xuICAgICAgY29uc3QgcmVzb3VyY2UyID0gbmV3IE5vU3ludGhSZXNvdXJjZShzdGFjaywgJ1Jlc291cmNlMicsIHsgdHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlMicgfSk7XG4gICAgICByZXNvdXJjZTEucmVtb3ZlRGVwZW5kZW5jeShyZXNvdXJjZTIpO1xuICAgICAgcmVzb3VyY2UxLmFkZERlcGVuZGVuY3kocmVzb3VyY2UyKTtcblxuICAgICAgZXhwZWN0KGFwcC5zeW50aCgpLmdldFN0YWNrQnlOYW1lKHN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGUuUmVzb3VyY2VzKS50b0VxdWFsKHtcbiAgICAgICAgUmVzb3VyY2UxOiB7XG4gICAgICAgICAgVHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlMScsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3JlcGxhY2UgdGhyb3dzIGFuIGVycm9yIGlmIG9sZFRhcmdldCBpcyBub3QgZGVwZW5kZWQgb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBhcHAgPSBuZXcgY29yZS5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNvcmUuU3RhY2soYXBwLCAnVGVzdFN0YWNrJyk7XG5cbiAgICAgIGNvbnN0IHJlc291cmNlMSA9IG5ldyBjb3JlLkNmblJlc291cmNlKHN0YWNrLCAnUmVzb3VyY2UxJywgeyB0eXBlOiAnVGVzdDo6UmVzb3VyY2U6OkZha2UxJyB9KTtcbiAgICAgIGNvbnN0IHJlc291cmNlMiA9IG5ldyBjb3JlLkNmblJlc291cmNlKHN0YWNrLCAnUmVzb3VyY2UyJywgeyB0eXBlOiAnVGVzdDo6UmVzb3VyY2U6OkZha2UyJyB9KTtcbiAgICAgIGNvbnN0IHJlc291cmNlMyA9IG5ldyBjb3JlLkNmblJlc291cmNlKHN0YWNrLCAnUmVzb3VyY2UzJywgeyB0eXBlOiAnVGVzdDo6UmVzb3VyY2U6OkZha2UzJyB9KTtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIHJlc291cmNlMS5yZXBsYWNlRGVwZW5kZW5jeShyZXNvdXJjZTIsIHJlc291cmNlMyk7XG4gICAgICB9KS50b1Rocm93KC9kb2VzIG5vdCBkZXBlbmQgb24vKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYXBwbHlSZW1vdmFsUG9saWN5IGRlZmF1bHQgaW5jbHVkZXMgVXBkYXRlIHBvbGljeScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjb3JlLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNvcmUuU3RhY2soYXBwLCAnVGVzdFN0YWNrJyk7XG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgY29yZS5DZm5SZXNvdXJjZShzdGFjaywgJ0RlZmF1bHRSZXNvdXJjZScsIHsgdHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlJyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICByZXNvdXJjZS5hcHBseVJlbW92YWxQb2xpY3koY29yZS5SZW1vdmFsUG9saWN5LlJFVEFJTik7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGFwcC5zeW50aCgpLmdldFN0YWNrQnlOYW1lKHN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGU/LlJlc291cmNlcykudG9FcXVhbCh7XG4gICAgICBEZWZhdWx0UmVzb3VyY2U6IHtcbiAgICAgICAgVHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlJyxcbiAgICAgICAgRGVsZXRpb25Qb2xpY3k6ICdSZXRhaW4nLFxuICAgICAgICBVcGRhdGVSZXBsYWNlUG9saWN5OiAnUmV0YWluJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBzd2l0Y2ggb2ZmIHVwZGF0aW5nIFVwZGF0ZSBwb2xpY3knLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY29yZS5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjb3JlLlN0YWNrKGFwcCwgJ1Rlc3RTdGFjaycpO1xuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IGNvcmUuQ2ZuUmVzb3VyY2Uoc3RhY2ssICdEZWZhdWx0UmVzb3VyY2UnLCB7IHR5cGU6ICdUZXN0OjpSZXNvdXJjZTo6RmFrZScgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgcmVzb3VyY2UuYXBwbHlSZW1vdmFsUG9saWN5KGNvcmUuUmVtb3ZhbFBvbGljeS5SRVRBSU4sIHtcbiAgICAgIGFwcGx5VG9VcGRhdGVSZXBsYWNlUG9saWN5OiBmYWxzZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoYXBwLnN5bnRoKCkuZ2V0U3RhY2tCeU5hbWUoc3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZT8uUmVzb3VyY2VzKS50b0VxdWFsKHtcbiAgICAgIERlZmF1bHRSZXNvdXJjZToge1xuICAgICAgICBUeXBlOiAnVGVzdDo6UmVzb3VyY2U6OkZha2UnLFxuICAgICAgICBEZWxldGlvblBvbGljeTogJ1JldGFpbicsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gYWRkIG1ldGFkYXRhJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNvcmUuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY29yZS5TdGFjayhhcHAsICdUZXN0U3RhY2snKTtcbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBjb3JlLkNmblJlc291cmNlKHN0YWNrLCAnRGVmYXVsdFJlc291cmNlJywgeyB0eXBlOiAnVGVzdDo6UmVzb3VyY2U6OkZha2UnIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIHJlc291cmNlLmFkZE1ldGFkYXRhKCdCZWVwJywgJ0Jvb3AnKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoYXBwLnN5bnRoKCkuZ2V0U3RhY2tCeU5hbWUoc3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZT8uUmVzb3VyY2VzKS50b0VxdWFsKHtcbiAgICAgIERlZmF1bHRSZXNvdXJjZToge1xuICAgICAgICBUeXBlOiAnVGVzdDo6UmVzb3VyY2U6OkZha2UnLFxuICAgICAgICBNZXRhZGF0YToge1xuICAgICAgICAgIEJlZXA6ICdCb29wJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiByZWFkIG1ldGFkYXRhJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNvcmUuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY29yZS5TdGFjayhhcHAsICdUZXN0U3RhY2snKTtcbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBjb3JlLkNmblJlc291cmNlKHN0YWNrLCAnRGVmYXVsdFJlc291cmNlJywgeyB0eXBlOiAnVGVzdDo6UmVzb3VyY2U6OkZha2UnIH0pO1xuICAgIHJlc291cmNlLmFkZE1ldGFkYXRhKCdCZWVwJywgJ0Jvb3AnKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QocmVzb3VyY2UuZ2V0TWV0YWRhdGEoJ0JlZXAnKSkudG9FcXVhbCgnQm9vcCcpO1xuICB9KTtcblxuICB0ZXN0KCdzdWJjbGFzc2VzIGNhbiBvdmVycmlkZSBcInNob3VsZFN5bnRoZXNpemVcIiB0byBsYXp5LWRldGVybWluZSBpZiB0aGUgcmVzb3VyY2Ugc2hvdWxkIGJlIGluY2x1ZGVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY2xhc3MgSGlkZGVuQ2ZuUmVzb3VyY2UgZXh0ZW5kcyBjb3JlLkNmblJlc291cmNlIHtcbiAgICAgIHByb3RlY3RlZCBzaG91bGRTeW50aGVzaXplKCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgYXBwID0gbmV3IGNvcmUuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY29yZS5TdGFjayhhcHAsICdUZXN0U3RhY2snKTtcbiAgICBjb25zdCBzdWJ0cmVlID0gbmV3IENvbnN0cnVjdChzdGFjaywgJ3N1YnRyZWUnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgSGlkZGVuQ2ZuUmVzb3VyY2Uoc3VidHJlZSwgJ1IxJywgeyB0eXBlOiAnRm9vOjpSMScgfSk7XG4gICAgY29uc3QgcjIgPSBuZXcgY29yZS5DZm5SZXNvdXJjZShzdGFjaywgJ1IyJywgeyB0eXBlOiAnRm9vOjpSMicgfSk7XG5cbiAgICAvLyBhbHNvIHRyeSB0byB0YWtlIGEgZGVwZW5kZW5jeSBvbiB0aGUgcGFyZW50IG9mIGByMWAgYW5kIGV4cGVjdCB0aGUgZGVwZW5kZW5jeSBub3QgdG8gbWF0ZXJpYWxpemVcbiAgICByMi5ub2RlLmFkZERlcGVuZGVuY3koc3VidHJlZSk7XG5cbiAgICAvLyBUSEVOIC0gb25seSBSMiBpcyBzeW50aGVzaXplZFxuICAgIGV4cGVjdChhcHAuc3ludGgoKS5nZXRTdGFja0J5TmFtZShzdGFjay5zdGFja05hbWUpLnRlbXBsYXRlPy5SZXNvdXJjZXMpLnRvRXF1YWwoe1xuICAgICAgUjI6IHtcbiAgICAgICAgVHlwZTogJ0Zvbzo6UjInLFxuICAgICAgICAvLyBObyBEZXBlbmRzT24hXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdDZm5SZXNvdXJjZSBjYW5ub3QgYmUgY3JlYXRlZCBvdXRzaWRlIFN0YWNrJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBjb3JlLkFwcCgpO1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgY29yZS5DZm5SZXNvdXJjZShhcHAsICdSZXNvdXJjZScsIHtcbiAgICAgICAgdHlwZTogJ1NvbWU6OlJlc291cmNlJyxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL3Nob3VsZCBiZSBjcmVhdGVkIGluIHRoZSBzY29wZSBvZiBhIFN0YWNrLCBidXQgbm8gU3RhY2sgZm91bmQvKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIFN0YWdlcyBzdGFydCBhIG5ldyBzY29wZSwgd2hpY2ggZG9lcyBub3QgY291bnQgYXMgYSBTdGFjayBhbnltb3JlXG4gICAqL1xuICB0ZXN0KCdDZm5SZXNvdXJjZSBjYW5ub3QgYmUgaW4gU3RhZ2UgaW4gU3RhY2snLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IGNvcmUuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY29yZS5TdGFjayhhcHAsICdTdGFjaycpO1xuICAgIGNvbnN0IHN0YWdlID0gbmV3IGNvcmUuU3RhZ2Uoc3RhY2ssICdTdGFnZScpO1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgY29yZS5DZm5SZXNvdXJjZShzdGFnZSwgJ1Jlc291cmNlJywge1xuICAgICAgICB0eXBlOiAnU29tZTo6UmVzb3VyY2UnLFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvc2hvdWxkIGJlIGNyZWF0ZWQgaW4gdGhlIHNjb3BlIG9mIGEgU3RhY2ssIGJ1dCBubyBTdGFjayBmb3VuZC8pO1xuICB9KTtcblxuICB0ZXN0KCdDZm5SZXNvdXJjZSBoYXMgbG9naWNhbCBJRCBtZXRhZGF0YSB3aXRoIHN0YWNrIHRyYWNlIGF0dGFjaGVkJywgKCkgPT4ge1xuICAgIHByb2Nlc3MuZW52LkNES19ERUJVRyA9ICcxJztcbiAgICB0cnkge1xuICAgICAgY29uc3QgYXBwID0gbmV3IGNvcmUuQXBwKCk7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjb3JlLlN0YWNrKGFwcCwgJ1N0YWNrJyk7XG4gICAgICBjb25zdCByZXMgPSBuZXcgY29yZS5DZm5SZXNvdXJjZShzdGFjaywgJ1NvbWVDZm5SZXNvdXJjZScsIHtcbiAgICAgICAgdHlwZTogJ1NvbWU6OlJlc291cmNlJyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb25zdCBtZXRhZGF0YSA9IHJlcy5ub2RlLm1ldGFkYXRhLmZpbmQobSA9PiBtLnR5cGUgPT09IGN4c2NoZW1hLkFydGlmYWN0TWV0YWRhdGFFbnRyeVR5cGUuTE9HSUNBTF9JRCk7XG4gICAgICBleHBlY3QobWV0YWRhdGEpLnRvQmVEZWZpbmVkKCk7XG4gICAgICBleHBlY3QobWV0YWRhdGE/LnRyYWNlKS50b0JlRGVmaW5lZCgpO1xuICAgICAgZXhwZWN0KG1ldGFkYXRhPy50cmFjZT8ubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4oMCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGRlbGV0ZSBwcm9jZXNzLmVudi5DREtfREVCVUc7XG4gICAgfVxuICB9KTtcbn0pO1xuIl19