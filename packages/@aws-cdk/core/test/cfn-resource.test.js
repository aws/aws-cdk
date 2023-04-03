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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLXJlc291cmNlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZm4tcmVzb3VyY2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJEQUEyRDtBQUMzRCw0Q0FBbUU7QUFDbkUsMkNBQXVDO0FBQ3ZDLGlDQUFxQztBQUNyQywrQkFBK0I7QUFDL0IsZ0NBQStCO0FBRS9CLFFBQVEsQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFO0lBQzVCLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUU7UUFDbEMsSUFBSSxDQUFDLHdEQUF3RCxFQUFFLEdBQUcsRUFBRTtZQUNsRSxNQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUMzQixNQUFNLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQy9DLE1BQU0sUUFBUSxHQUFHLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLEVBQUUsRUFBRSxJQUFJLEVBQUUsc0JBQXNCLEVBQUUsQ0FBQyxDQUFDO1lBRWxHLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQztZQUNsQixRQUFnQixDQUFDLGdCQUFnQixHQUFHLENBQUMsR0FBUSxFQUFFLEVBQUU7Z0JBQ2hELE1BQU0sR0FBRyxJQUFJLENBQUM7Z0JBQ2QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUM3QixDQUFDLENBQUM7WUFFRixNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDOUUsZUFBZSxFQUFFO29CQUNmLElBQUksRUFBRSxzQkFBc0I7aUJBQzdCO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFD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IGN4c2NoZW1hIGZyb20gJ0Bhd3MtY2RrL2Nsb3VkLWFzc2VtYmx5LXNjaGVtYSc7XG5pbXBvcnQgeyBWQUxJREFURV9TTkFQU0hPVF9SRU1PVkFMX1BPTElDWSB9IGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IGdldFdhcm5pbmdzIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCAqIGFzIGNvcmUgZnJvbSAnLi4vbGliJztcbmltcG9ydCB7IE5hbWVzIH0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ2NmbiByZXNvdXJjZScsICgpID0+IHtcbiAgZGVzY3JpYmUoJy5fdG9DbG91ZEZvcm1hdGlvbicsICgpID0+IHtcbiAgICB0ZXN0KCdkb2VzIG5vdCBjYWxsIHJlbmRlclByb3BlcnRpZXMgd2l0aCBhbiB1bmRlZmluZWQgdmFsdWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBhcHAgPSBuZXcgY29yZS5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNvcmUuU3RhY2soYXBwLCAnVGVzdFN0YWNrJyk7XG4gICAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBjb3JlLkNmblJlc291cmNlKHN0YWNrLCAnRGVmYXVsdFJlc291cmNlJywgeyB0eXBlOiAnVGVzdDo6UmVzb3VyY2U6OkZha2UnIH0pO1xuXG4gICAgICBsZXQgY2FsbGVkID0gZmFsc2U7XG4gICAgICAocmVzb3VyY2UgYXMgYW55KS5yZW5kZXJQcm9wZXJ0aWVzID0gKHZhbDogYW55KSA9PiB7XG4gICAgICAgIGNhbGxlZCA9IHRydWU7XG4gICAgICAgIGV4cGVjdCh2YWwpLm5vdC50b0JlTnVsbCgpO1xuICAgICAgfTtcblxuICAgICAgZXhwZWN0KGFwcC5zeW50aCgpLmdldFN0YWNrQnlOYW1lKHN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGU/LlJlc291cmNlcykudG9FcXVhbCh7XG4gICAgICAgIERlZmF1bHRSZXNvdXJjZToge1xuICAgICAgICAgIFR5cGU6ICdUZXN0OjpSZXNvdXJjZTo6RmFrZScsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGV4cGVjdChjYWxsZWQpLnRvRXF1YWwodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdyZW5kZXJzIFwiUHJvcGVydGllc1wiIGZvciBhIHJlc291cmNlIHRoYXQgaGFzIG9ubHkgcHJvcGVydGllcyBzZXQgdG8gXCJmYWxzZVwiJywgKCkgPT4ge1xuICAgICAgY29uc3QgYXBwID0gbmV3IGNvcmUuQXBwKCk7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjb3JlLlN0YWNrKGFwcCwgJ1Rlc3RTdGFjaycpO1xuICAgICAgbmV3IGNvcmUuQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZXNvdXJjZScsIHtcbiAgICAgICAgdHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlJyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIEZha2VQcm9wZXJ0eTogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KGFwcC5zeW50aCgpLmdldFN0YWNrQnlOYW1lKHN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGU/LlJlc291cmNlcykudG9FcXVhbCh7XG4gICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgVHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBGYWtlUHJvcGVydHk6IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3NuYXBzaG90IHJlbW92YWwgcG9saWN5JywgKCkgPT4ge1xuICAgIGNvbnN0IHN1cHBvcnRlZFJlc291cmNlcyA9IFtcbiAgICAgICdBV1M6OkVDMjo6Vm9sdW1lJyxcbiAgICAgICdBV1M6OkVsYXN0aUNhY2hlOjpDYWNoZUNsdXN0ZXInLFxuICAgICAgJ0FXUzo6RWxhc3RpQ2FjaGU6OlJlcGxpY2F0aW9uR3JvdXAnLFxuICAgICAgJ0FXUzo6TmVwdHVuZTo6REJDbHVzdGVyJyxcbiAgICAgICdBV1M6OlJEUzo6REJDbHVzdGVyJyxcbiAgICAgICdBV1M6OlJEUzo6REJJbnN0YW5jZScsXG4gICAgICAnQVdTOjpSZWRzaGlmdDo6Q2x1c3RlcicsXG4gICAgXTtcblxuICAgIHRlc3QuZWFjaChzdXBwb3J0ZWRSZXNvdXJjZXMpIChcbiAgICAgICd3b3JrcyBhcyBleHBlY3RlZCB3aGVuIHVzZWQgb24gc3VwcG9ydGVkIHJlc291cmNlcyAob2xkIGJlaGF2aW9yKScsIChyZXNvdXJjZVR5cGUpID0+IHtcbiAgICAgICAgLy8gR0lWRU5cbiAgICAgICAgY29uc3QgYXBwID0gbmV3IGNvcmUuQXBwKCk7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNvcmUuU3RhY2soYXBwLCAnVGVzdFN0YWNrJyk7XG4gICAgICAgIGNvbnN0IHJlc291cmNlID0gbmV3IGNvcmUuQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZXNvdXJjZScsIHtcbiAgICAgICAgICB0eXBlOiByZXNvdXJjZVR5cGUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFdIRU5cbiAgICAgICAgcmVzb3VyY2UuYXBwbHlSZW1vdmFsUG9saWN5KGNvcmUuUmVtb3ZhbFBvbGljeS5TTkFQU0hPVCk7XG5cbiAgICAgICAgLy8gVEhFTlxuICAgICAgICBleHBlY3QoYXBwLnN5bnRoKCkuZ2V0U3RhY2tCeU5hbWUoc3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZT8uUmVzb3VyY2VzKS50b0VxdWFsKHtcbiAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgVHlwZTogcmVzb3VyY2VUeXBlLFxuICAgICAgICAgICAgRGVsZXRpb25Qb2xpY3k6ICdTbmFwc2hvdCcsXG4gICAgICAgICAgICBVcGRhdGVSZXBsYWNlUG9saWN5OiAnU25hcHNob3QnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICApO1xuXG4gICAgdGVzdC5lYWNoKHN1cHBvcnRlZFJlc291cmNlcykgKFxuICAgICAgJ3dvcmtzIGFzIGV4cGVjdGVkIHdoZW4gdXNlZCBvbiBzdXBwb3J0ZWQgcmVzb3VyY2VzICh1bmRlciBmZWF0dXJlIGZsYWcpJywgKHJlc291cmNlVHlwZSkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBjb25zdCBhcHAgPSBuZXcgY29yZS5BcHAoeyBjb250ZXh0OiB7IFtWQUxJREFURV9TTkFQU0hPVF9SRU1PVkFMX1BPTElDWV06IHRydWUgfSB9KTtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY29yZS5TdGFjayhhcHAsICdUZXN0U3RhY2snKTtcbiAgICAgICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgY29yZS5DZm5SZXNvdXJjZShzdGFjaywgJ1Jlc291cmNlJywge1xuICAgICAgICAgIHR5cGU6IHJlc291cmNlVHlwZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gV0hFTlxuICAgICAgICByZXNvdXJjZS5hcHBseVJlbW92YWxQb2xpY3koY29yZS5SZW1vdmFsUG9saWN5LlNOQVBTSE9UKTtcblxuICAgICAgICAvLyBUSEVOXG4gICAgICAgIGV4cGVjdChhcHAuc3ludGgoKS5nZXRTdGFja0J5TmFtZShzdGFjay5zdGFja05hbWUpLnRlbXBsYXRlPy5SZXNvdXJjZXMpLnRvRXF1YWwoe1xuICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICBUeXBlOiByZXNvdXJjZVR5cGUsXG4gICAgICAgICAgICBEZWxldGlvblBvbGljeTogJ1NuYXBzaG90JyxcbiAgICAgICAgICAgIFVwZGF0ZVJlcGxhY2VQb2xpY3k6ICdTbmFwc2hvdCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICk7XG5cbiAgICB0ZXN0KCd3YXJucyBvbiB1bnN1cHBvcnRlZCByZXNvdXJjZXMgKHdpdGhvdXQgZmVhdHVyZSBmbGFnKScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBhcHAgPSBuZXcgY29yZS5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNvcmUuU3RhY2soYXBwKTtcbiAgICAgIGNvbnN0IHJlc291cmNlID0gbmV3IGNvcmUuQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZXNvdXJjZScsIHtcbiAgICAgICAgdHlwZTogJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgcmVzb3VyY2UuYXBwbHlSZW1vdmFsUG9saWN5KGNvcmUuUmVtb3ZhbFBvbGljeS5TTkFQU0hPVCk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChnZXRXYXJuaW5ncyhhcHAuc3ludGgoKSkpLnRvRXF1YWwoW1xuICAgICAgICB7XG4gICAgICAgICAgcGF0aDogJy9EZWZhdWx0L1Jlc291cmNlJyxcbiAgICAgICAgICBtZXNzYWdlOiAnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uIGRvZXMgbm90IHN1cHBvcnQgc25hcHNob3QgcmVtb3ZhbCBwb2xpY3kuIFRoaXMgcG9saWN5IHdpbGwgYmUgaWdub3JlZC4nLFxuICAgICAgICB9LFxuICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdmYWlscyBvbiB1bnN1cHBvcnRlZCByZXNvdXJjZXMgKHVuZGVyIGZlYXR1cmUgZmxhZyknLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYXBwID0gbmV3IGNvcmUuQXBwKHsgY29udGV4dDogeyBbVkFMSURBVEVfU05BUFNIT1RfUkVNT1ZBTF9QT0xJQ1ldOiB0cnVlIH0gfSk7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjb3JlLlN0YWNrKGFwcCk7XG4gICAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBjb3JlLkNmblJlc291cmNlKHN0YWNrLCAnUmVzb3VyY2UnLCB7XG4gICAgICAgIHR5cGU6ICdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiByZXNvdXJjZS5hcHBseVJlbW92YWxQb2xpY3koY29yZS5SZW1vdmFsUG9saWN5LlNOQVBTSE9UKSkudG9UaHJvd0Vycm9yKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24gZG9lcyBub3Qgc3VwcG9ydCBzbmFwc2hvdCByZW1vdmFsIHBvbGljeScpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnZGVwZW5kZW5jeSBtZXRob2RzJywgKCkgPT4ge1xuICAgIHRlc3QoJ2NhbiBleHBsaWNpdGx5IGFkZCBhIGRlcGVuZGVuY3kgYmV0d2VlbiByZXNvdXJjZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBhcHAgPSBuZXcgY29yZS5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNvcmUuU3RhY2soYXBwLCAnVGVzdFN0YWNrJyk7XG4gICAgICBjb25zdCByZXNvdXJjZTEgPSBuZXcgY29yZS5DZm5SZXNvdXJjZShzdGFjaywgJ1Jlc291cmNlMScsIHsgdHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlMScgfSk7XG4gICAgICBjb25zdCByZXNvdXJjZTIgPSBuZXcgY29yZS5DZm5SZXNvdXJjZShzdGFjaywgJ1Jlc291cmNlMicsIHsgdHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlMicgfSk7XG4gICAgICByZXNvdXJjZTEuYWRkRGVwZW5kZW5jeShyZXNvdXJjZTIpO1xuXG4gICAgICBleHBlY3QoYXBwLnN5bnRoKCkuZ2V0U3RhY2tCeU5hbWUoc3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZS5SZXNvdXJjZXMpLnRvRXF1YWwoe1xuICAgICAgICBSZXNvdXJjZTE6IHtcbiAgICAgICAgICBUeXBlOiAnVGVzdDo6UmVzb3VyY2U6OkZha2UxJyxcbiAgICAgICAgICBEZXBlbmRzT246IFtcbiAgICAgICAgICAgICdSZXNvdXJjZTInLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIFJlc291cmNlMjoge1xuICAgICAgICAgIFR5cGU6ICdUZXN0OjpSZXNvdXJjZTo6RmFrZTInLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gZXhwbGljaXRseSByZW1vdmUgYSBkZXBlbmRlbmN5IGJldHdlZW4gcmVzb3VyY2VzJywgKCkgPT4ge1xuICAgICAgY29uc3QgYXBwID0gbmV3IGNvcmUuQXBwKCk7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjb3JlLlN0YWNrKGFwcCwgJ1Rlc3RTdGFjaycpO1xuICAgICAgY29uc3QgcmVzb3VyY2UxID0gbmV3IGNvcmUuQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZXNvdXJjZTEnLCB7IHR5cGU6ICdUZXN0OjpSZXNvdXJjZTo6RmFrZTEnIH0pO1xuICAgICAgY29uc3QgcmVzb3VyY2UyID0gbmV3IGNvcmUuQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZXNvdXJjZTInLCB7IHR5cGU6ICdUZXN0OjpSZXNvdXJjZTo6RmFrZTInIH0pO1xuICAgICAgcmVzb3VyY2UxLmFkZERlcGVuZGVuY3kocmVzb3VyY2UyKTtcbiAgICAgIHJlc291cmNlMS5yZW1vdmVEZXBlbmRlbmN5KHJlc291cmNlMik7XG5cbiAgICAgIGV4cGVjdChhcHAuc3ludGgoKS5nZXRTdGFja0J5TmFtZShzdGFjay5zdGFja05hbWUpLnRlbXBsYXRlLlJlc291cmNlcykudG9FcXVhbCh7XG4gICAgICAgIFJlc291cmNlMToge1xuICAgICAgICAgIFR5cGU6ICdUZXN0OjpSZXNvdXJjZTo6RmFrZTEnLFxuICAgICAgICB9LFxuICAgICAgICBSZXNvdXJjZTI6IHtcbiAgICAgICAgICBUeXBlOiAnVGVzdDo6UmVzb3VyY2U6OkZha2UyJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIGV4cGxpY2l0bHkgYWRkLCBvYnRhaW4sIGFuZCByZW1vdmUgZGVwZW5kZW5jaWVzIGFjcm9zcyBzdGFja3MnLCAoKSA9PiB7XG4gICAgICBjb25zdCBhcHAgPSBuZXcgY29yZS5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBjb3JlLlN0YWNrKGFwcCwgJ1Rlc3RTdGFjazEnKTtcbiAgICAgIC8vIFVzZSBhIHJlYWxseSBsb25nIGNvbnN0cnVjdCBpZCB0byBpZGVudGlmeSBpc3N1ZXMgYmV0d2VlbiBOYW1lcy51bmlxdWVJZCBhbmQgTmFtZXMudW5pcXVlUmVzb3VyY2VOYW1lXG4gICAgICBjb25zdCByZWFsbHlMb25nQ29uc3RydWN0SWQgPSAnQScucmVwZWF0KDI0Nyk7XG4gICAgICBjb25zdCBzdGFjazIgPSBuZXcgY29yZS5TdGFjayhhcHAsIHJlYWxseUxvbmdDb25zdHJ1Y3RJZCwgeyBzdGFja05hbWU6ICdUZXN0U3RhY2syJyB9KTtcbiAgICAgIC8vIFNhbml0eSBjaGVjayBzaW5jZSB0aGlzIHRlc3QgZGVwZW5kcyBvbiB0aGUgZGlzY3JlcGFuY3lcbiAgICAgIGV4cGVjdChOYW1lcy51bmlxdWVJZChzdGFjazIpKS5ub3QudG9CZShOYW1lcy51bmlxdWVSZXNvdXJjZU5hbWUoc3RhY2syLCB7fSkpO1xuICAgICAgY29uc3QgcmVzb3VyY2UxID0gbmV3IGNvcmUuQ2ZuUmVzb3VyY2Uoc3RhY2sxLCAnUmVzb3VyY2UxJywgeyB0eXBlOiAnVGVzdDo6UmVzb3VyY2U6OkZha2UxJyB9KTtcbiAgICAgIGNvbnN0IHJlc291cmNlMiA9IG5ldyBjb3JlLkNmblJlc291cmNlKHN0YWNrMiwgJ1Jlc291cmNlMicsIHsgdHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlMicgfSk7XG4gICAgICBjb25zdCByZXNvdXJjZTMgPSBuZXcgY29yZS5DZm5SZXNvdXJjZShzdGFjazEsICdSZXNvdXJjZTMnLCB7IHR5cGU6ICdUZXN0OjpSZXNvdXJjZTo6RmFrZTMnIH0pO1xuXG4gICAgICByZXNvdXJjZTEuYWRkRGVwZW5kZW5jeShyZXNvdXJjZTIpO1xuICAgICAgLy8gQWRkaW5nIHRoZSBzYW1lIHJlc291cmNlIGRlcGVuZGVuY3kgdHdpY2Ugc2hvdWxkIGJlIGEgbm8tb3BcbiAgICAgIHJlc291cmNlMS5hZGREZXBlbmRlbmN5KHJlc291cmNlMik7XG4gICAgICByZXNvdXJjZTEuYWRkRGVwZW5kZW5jeShyZXNvdXJjZTMpO1xuICAgICAgZXhwZWN0KHN0YWNrMS5kZXBlbmRlbmNpZXMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgZXhwZWN0KHN0YWNrMS5kZXBlbmRlbmNpZXNbMF0ubm9kZS5pZCkudG9FcXVhbChzdGFjazIubm9kZS5pZCk7XG4gICAgICAvLyBvYnRhaW5EZXBlbmRlbmNpZXMgc2hvdWxkIGFzc2VtYmxlIGFuZCBmbGF0dGVuIHJlc291cmNlLXRvLXJlc291cmNlIGRlcGVuZGVuY2llcyBldmVuIGFjcm9zcyBzdGFja3NcbiAgICAgIGV4cGVjdChyZXNvdXJjZTEub2J0YWluRGVwZW5kZW5jaWVzKCkubWFwKHggPT4geC5ub2RlLnBhdGgpKS50b0VxdWFsKFtyZXNvdXJjZTMubm9kZS5wYXRoLCByZXNvdXJjZTIubm9kZS5wYXRoXSk7XG5cbiAgICAgIHJlc291cmNlMS5yZW1vdmVEZXBlbmRlbmN5KHJlc291cmNlMik7XG4gICAgICAvLyBGb3Igc3ltbWV0cnksIHJlbW92aW5nIGEgZGVwZW5kZW5jeSB0aGF0IGRvZXNuJ3QgZXhpc3Qgc2hvdWxkIGJlIGEgbm8tb3BcbiAgICAgIHJlc291cmNlMS5yZW1vdmVEZXBlbmRlbmN5KHJlc291cmNlMik7XG4gICAgICBleHBlY3Qoc3RhY2sxLmRlcGVuZGVuY2llcy5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gZXhwbGljaXRseSBhZGQsIHRoZW4gcmVwbGFjZSBkZXBlbmRlbmNpZXMgYWNyb3NzIHN0YWNrcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjb3JlLkFwcCgpO1xuICAgICAgY29uc3Qgc3RhY2sxID0gbmV3IGNvcmUuU3RhY2soYXBwLCAnVGVzdFN0YWNrMScpO1xuICAgICAgY29uc3Qgc3RhY2syID0gbmV3IGNvcmUuU3RhY2soYXBwLCAnVGVzdFN0YWNrMicpO1xuICAgICAgY29uc3Qgc3RhY2szID0gbmV3IGNvcmUuU3RhY2soYXBwLCAnVGVzdFN0YWNrMycpO1xuICAgICAgY29uc3QgcmVzb3VyY2UxID0gbmV3IGNvcmUuQ2ZuUmVzb3VyY2Uoc3RhY2sxLCAnUmVzb3VyY2UxJywgeyB0eXBlOiAnVGVzdDo6UmVzb3VyY2U6OkZha2UxJyB9KTtcbiAgICAgIGNvbnN0IHJlc291cmNlMiA9IG5ldyBjb3JlLkNmblJlc291cmNlKHN0YWNrMiwgJ1Jlc291cmNlMicsIHsgdHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlMicgfSk7XG4gICAgICBjb25zdCByZXNvdXJjZTMgPSBuZXcgY29yZS5DZm5SZXNvdXJjZShzdGFjazMsICdSZXNvdXJjZTMnLCB7IHR5cGU6ICdUZXN0OjpSZXNvdXJjZTo6RmFrZTMnIH0pO1xuXG4gICAgICByZXNvdXJjZTEuYWRkRGVwZW5kZW5jeShyZXNvdXJjZTIpO1xuICAgICAgLy8gQWRkaW5nIHRoZSBzYW1lIHJlc291cmNlIGRlcGVuZGVuY3kgdHdpY2Ugc2hvdWxkIGJlIGEgbm8tb3BcbiAgICAgIHJlc291cmNlMS5yZXBsYWNlRGVwZW5kZW5jeShyZXNvdXJjZTIsIHJlc291cmNlMyk7XG4gICAgICBleHBlY3Qoc3RhY2sxLmRlcGVuZGVuY2llcykudG9FcXVhbChbc3RhY2szXSk7XG4gICAgICAvLyBvYnRhaW5EZXBlbmRlbmNpZXMgc2hvdWxkIGFzc2VtYmxlIGFuZCBmbGF0dGVuIHJlc291cmNlLXRvLXJlc291cmNlIGRlcGVuZGVuY2llcyBldmVuIGFjcm9zcyBzdGFja3NcbiAgICAgIGV4cGVjdChyZXNvdXJjZTEub2J0YWluRGVwZW5kZW5jaWVzKCkubWFwKHggPT4geC5ub2RlLnBhdGgpKS50b0VxdWFsKFtyZXNvdXJjZTMubm9kZS5wYXRoXSk7XG5cbiAgICAgIC8vIFJlcGxhY2luZyBhIGRlcGVuZGVuY3kgdGhhdCBkb2Vzbid0IGV4aXN0IHNob3VsZCByYWlzZSBhbiBleGNlcHRpb25cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIHJlc291cmNlMS5yZXBsYWNlRGVwZW5kZW5jeShyZXNvdXJjZTIsIHJlc291cmNlMyk7XG4gICAgICB9KS50b1Rocm93KC8gZG9lcyBub3QgZGVwZW5kIG9uIC8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZG8gbm90aGluZyBpZiBzb3VyY2UgaXMgdGFyZ2V0JywgKCkgPT4ge1xuICAgICAgY29uc3QgYXBwID0gbmV3IGNvcmUuQXBwKCk7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjb3JlLlN0YWNrKGFwcCwgJ1Rlc3RTdGFjaycpO1xuICAgICAgY29uc3QgcmVzb3VyY2UxID0gbmV3IGNvcmUuQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZXNvdXJjZTEnLCB7IHR5cGU6ICdUZXN0OjpSZXNvdXJjZTo6RmFrZTEnIH0pO1xuICAgICAgcmVzb3VyY2UxLmFkZERlcGVuZGVuY3kocmVzb3VyY2UxKTtcblxuICAgICAgZXhwZWN0KGFwcC5zeW50aCgpLmdldFN0YWNrQnlOYW1lKHN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGUuUmVzb3VyY2VzKS50b0VxdWFsKHtcbiAgICAgICAgUmVzb3VyY2UxOiB7XG4gICAgICAgICAgVHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlMScsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2RvIG5vdGhpbmcgaWYgdGFyZ2V0IGRvZXMgbm90IHN5bnRoJywgKCkgPT4ge1xuICAgICAgY29uc3QgYXBwID0gbmV3IGNvcmUuQXBwKCk7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjb3JlLlN0YWNrKGFwcCwgJ1Rlc3RTdGFjaycpO1xuXG4gICAgICBjbGFzcyBOb1N5bnRoUmVzb3VyY2UgZXh0ZW5kcyBjb3JlLkNmblJlc291cmNlIHtcbiAgICAgICAgcHJvdGVjdGVkIHNob3VsZFN5bnRoZXNpemUoKTogYm9vbGVhbiB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlc291cmNlMSA9IG5ldyBjb3JlLkNmblJlc291cmNlKHN0YWNrLCAnUmVzb3VyY2UxJywgeyB0eXBlOiAnVGVzdDo6UmVzb3VyY2U6OkZha2UxJyB9KTtcbiAgICAgIGNvbnN0IHJlc291cmNlMiA9IG5ldyBOb1N5bnRoUmVzb3VyY2Uoc3RhY2ssICdSZXNvdXJjZTInLCB7IHR5cGU6ICdUZXN0OjpSZXNvdXJjZTo6RmFrZTInIH0pO1xuICAgICAgcmVzb3VyY2UxLnJlbW92ZURlcGVuZGVuY3kocmVzb3VyY2UyKTtcbiAgICAgIHJlc291cmNlMS5hZGREZXBlbmRlbmN5KHJlc291cmNlMik7XG5cbiAgICAgIGV4cGVjdChhcHAuc3ludGgoKS5nZXRTdGFja0J5TmFtZShzdGFjay5zdGFja05hbWUpLnRlbXBsYXRlLlJlc291cmNlcykudG9FcXVhbCh7XG4gICAgICAgIFJlc291cmNlMToge1xuICAgICAgICAgIFR5cGU6ICdUZXN0OjpSZXNvdXJjZTo6RmFrZTEnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdyZXBsYWNlIHRocm93cyBhbiBlcnJvciBpZiBvbGRUYXJnZXQgaXMgbm90IGRlcGVuZGVkIG9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgYXBwID0gbmV3IGNvcmUuQXBwKCk7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjb3JlLlN0YWNrKGFwcCwgJ1Rlc3RTdGFjaycpO1xuXG4gICAgICBjb25zdCByZXNvdXJjZTEgPSBuZXcgY29yZS5DZm5SZXNvdXJjZShzdGFjaywgJ1Jlc291cmNlMScsIHsgdHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlMScgfSk7XG4gICAgICBjb25zdCByZXNvdXJjZTIgPSBuZXcgY29yZS5DZm5SZXNvdXJjZShzdGFjaywgJ1Jlc291cmNlMicsIHsgdHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlMicgfSk7XG4gICAgICBjb25zdCByZXNvdXJjZTMgPSBuZXcgY29yZS5DZm5SZXNvdXJjZShzdGFjaywgJ1Jlc291cmNlMycsIHsgdHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlMycgfSk7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICByZXNvdXJjZTEucmVwbGFjZURlcGVuZGVuY3kocmVzb3VyY2UyLCByZXNvdXJjZTMpO1xuICAgICAgfSkudG9UaHJvdygvZG9lcyBub3QgZGVwZW5kIG9uLyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FwcGx5UmVtb3ZhbFBvbGljeSBkZWZhdWx0IGluY2x1ZGVzIFVwZGF0ZSBwb2xpY3knLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY29yZS5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjb3JlLlN0YWNrKGFwcCwgJ1Rlc3RTdGFjaycpO1xuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IGNvcmUuQ2ZuUmVzb3VyY2Uoc3RhY2ssICdEZWZhdWx0UmVzb3VyY2UnLCB7IHR5cGU6ICdUZXN0OjpSZXNvdXJjZTo6RmFrZScgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgcmVzb3VyY2UuYXBwbHlSZW1vdmFsUG9saWN5KGNvcmUuUmVtb3ZhbFBvbGljeS5SRVRBSU4pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChhcHAuc3ludGgoKS5nZXRTdGFja0J5TmFtZShzdGFjay5zdGFja05hbWUpLnRlbXBsYXRlPy5SZXNvdXJjZXMpLnRvRXF1YWwoe1xuICAgICAgRGVmYXVsdFJlc291cmNlOiB7XG4gICAgICAgIFR5cGU6ICdUZXN0OjpSZXNvdXJjZTo6RmFrZScsXG4gICAgICAgIERlbGV0aW9uUG9saWN5OiAnUmV0YWluJyxcbiAgICAgICAgVXBkYXRlUmVwbGFjZVBvbGljeTogJ1JldGFpbicsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gc3dpdGNoIG9mZiB1cGRhdGluZyBVcGRhdGUgcG9saWN5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNvcmUuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY29yZS5TdGFjayhhcHAsICdUZXN0U3RhY2snKTtcbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBjb3JlLkNmblJlc291cmNlKHN0YWNrLCAnRGVmYXVsdFJlc291cmNlJywgeyB0eXBlOiAnVGVzdDo6UmVzb3VyY2U6OkZha2UnIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIHJlc291cmNlLmFwcGx5UmVtb3ZhbFBvbGljeShjb3JlLlJlbW92YWxQb2xpY3kuUkVUQUlOLCB7XG4gICAgICBhcHBseVRvVXBkYXRlUmVwbGFjZVBvbGljeTogZmFsc2UsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGFwcC5zeW50aCgpLmdldFN0YWNrQnlOYW1lKHN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGU/LlJlc291cmNlcykudG9FcXVhbCh7XG4gICAgICBEZWZhdWx0UmVzb3VyY2U6IHtcbiAgICAgICAgVHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlJyxcbiAgICAgICAgRGVsZXRpb25Qb2xpY3k6ICdSZXRhaW4nLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGFkZCBtZXRhZGF0YScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjb3JlLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNvcmUuU3RhY2soYXBwLCAnVGVzdFN0YWNrJyk7XG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgY29yZS5DZm5SZXNvdXJjZShzdGFjaywgJ0RlZmF1bHRSZXNvdXJjZScsIHsgdHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlJyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICByZXNvdXJjZS5hZGRNZXRhZGF0YSgnQmVlcCcsICdCb29wJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGFwcC5zeW50aCgpLmdldFN0YWNrQnlOYW1lKHN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGU/LlJlc291cmNlcykudG9FcXVhbCh7XG4gICAgICBEZWZhdWx0UmVzb3VyY2U6IHtcbiAgICAgICAgVHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlJyxcbiAgICAgICAgTWV0YWRhdGE6IHtcbiAgICAgICAgICBCZWVwOiAnQm9vcCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gcmVhZCBtZXRhZGF0YScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjb3JlLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNvcmUuU3RhY2soYXBwLCAnVGVzdFN0YWNrJyk7XG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgY29yZS5DZm5SZXNvdXJjZShzdGFjaywgJ0RlZmF1bHRSZXNvdXJjZScsIHsgdHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlJyB9KTtcbiAgICByZXNvdXJjZS5hZGRNZXRhZGF0YSgnQmVlcCcsICdCb29wJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlc291cmNlLmdldE1ldGFkYXRhKCdCZWVwJykpLnRvRXF1YWwoJ0Jvb3AnKTtcbiAgfSk7XG5cbiAgdGVzdCgnc3ViY2xhc3NlcyBjYW4gb3ZlcnJpZGUgXCJzaG91bGRTeW50aGVzaXplXCIgdG8gbGF6eS1kZXRlcm1pbmUgaWYgdGhlIHJlc291cmNlIHNob3VsZCBiZSBpbmNsdWRlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNsYXNzIEhpZGRlbkNmblJlc291cmNlIGV4dGVuZHMgY29yZS5DZm5SZXNvdXJjZSB7XG4gICAgICBwcm90ZWN0ZWQgc2hvdWxkU3ludGhlc2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGFwcCA9IG5ldyBjb3JlLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNvcmUuU3RhY2soYXBwLCAnVGVzdFN0YWNrJyk7XG4gICAgY29uc3Qgc3VidHJlZSA9IG5ldyBDb25zdHJ1Y3Qoc3RhY2ssICdzdWJ0cmVlJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IEhpZGRlbkNmblJlc291cmNlKHN1YnRyZWUsICdSMScsIHsgdHlwZTogJ0Zvbzo6UjEnIH0pO1xuICAgIGNvbnN0IHIyID0gbmV3IGNvcmUuQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSMicsIHsgdHlwZTogJ0Zvbzo6UjInIH0pO1xuXG4gICAgLy8gYWxzbyB0cnkgdG8gdGFrZSBhIGRlcGVuZGVuY3kgb24gdGhlIHBhcmVudCBvZiBgcjFgIGFuZCBleHBlY3QgdGhlIGRlcGVuZGVuY3kgbm90IHRvIG1hdGVyaWFsaXplXG4gICAgcjIubm9kZS5hZGREZXBlbmRlbmN5KHN1YnRyZWUpO1xuXG4gICAgLy8gVEhFTiAtIG9ubHkgUjIgaXMgc3ludGhlc2l6ZWRcbiAgICBleHBlY3QoYXBwLnN5bnRoKCkuZ2V0U3RhY2tCeU5hbWUoc3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZT8uUmVzb3VyY2VzKS50b0VxdWFsKHtcbiAgICAgIFIyOiB7XG4gICAgICAgIFR5cGU6ICdGb286OlIyJyxcbiAgICAgICAgLy8gTm8gRGVwZW5kc09uIVxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQ2ZuUmVzb3VyY2UgY2Fubm90IGJlIGNyZWF0ZWQgb3V0c2lkZSBTdGFjaycsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgY29yZS5BcHAoKTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IGNvcmUuQ2ZuUmVzb3VyY2UoYXBwLCAnUmVzb3VyY2UnLCB7XG4gICAgICAgIHR5cGU6ICdTb21lOjpSZXNvdXJjZScsXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9zaG91bGQgYmUgY3JlYXRlZCBpbiB0aGUgc2NvcGUgb2YgYSBTdGFjaywgYnV0IG5vIFN0YWNrIGZvdW5kLyk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBTdGFnZXMgc3RhcnQgYSBuZXcgc2NvcGUsIHdoaWNoIGRvZXMgbm90IGNvdW50IGFzIGEgU3RhY2sgYW55bW9yZVxuICAgKi9cbiAgdGVzdCgnQ2ZuUmVzb3VyY2UgY2Fubm90IGJlIGluIFN0YWdlIGluIFN0YWNrJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBjb3JlLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNvcmUuU3RhY2soYXBwLCAnU3RhY2snKTtcbiAgICBjb25zdCBzdGFnZSA9IG5ldyBjb3JlLlN0YWdlKHN0YWNrLCAnU3RhZ2UnKTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IGNvcmUuQ2ZuUmVzb3VyY2Uoc3RhZ2UsICdSZXNvdXJjZScsIHtcbiAgICAgICAgdHlwZTogJ1NvbWU6OlJlc291cmNlJyxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL3Nob3VsZCBiZSBjcmVhdGVkIGluIHRoZSBzY29wZSBvZiBhIFN0YWNrLCBidXQgbm8gU3RhY2sgZm91bmQvKTtcbiAgfSk7XG5cbiAgdGVzdCgnQ2ZuUmVzb3VyY2UgaGFzIGxvZ2ljYWwgSUQgbWV0YWRhdGEgd2l0aCBzdGFjayB0cmFjZSBhdHRhY2hlZCcsICgpID0+IHtcbiAgICBwcm9jZXNzLmVudi5DREtfREVCVUcgPSAnMSc7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjb3JlLkFwcCgpO1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY29yZS5TdGFjayhhcHAsICdTdGFjaycpO1xuICAgICAgY29uc3QgcmVzID0gbmV3IGNvcmUuQ2ZuUmVzb3VyY2Uoc3RhY2ssICdTb21lQ2ZuUmVzb3VyY2UnLCB7XG4gICAgICAgIHR5cGU6ICdTb21lOjpSZXNvdXJjZScsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29uc3QgbWV0YWRhdGEgPSByZXMubm9kZS5tZXRhZGF0YS5maW5kKG0gPT4gbS50eXBlID09PSBjeHNjaGVtYS5BcnRpZmFjdE1ldGFkYXRhRW50cnlUeXBlLkxPR0lDQUxfSUQpO1xuICAgICAgZXhwZWN0KG1ldGFkYXRhKS50b0JlRGVmaW5lZCgpO1xuICAgICAgZXhwZWN0KG1ldGFkYXRhPy50cmFjZSkudG9CZURlZmluZWQoKTtcbiAgICAgIGV4cGVjdChtZXRhZGF0YT8udHJhY2U/Lmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBkZWxldGUgcHJvY2Vzcy5lbnYuQ0RLX0RFQlVHO1xuICAgIH1cbiAgfSk7XG59KTtcbiJdfQ==