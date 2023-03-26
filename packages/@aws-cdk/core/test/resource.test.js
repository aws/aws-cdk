"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cxapi = require("@aws-cdk/cx-api");
const constructs_1 = require("constructs");
const util_1 = require("./util");
const lib_1 = require("../lib");
const synthesis_1 = require("../lib/private/synthesis");
describe('resource', () => {
    test('all resources derive from Resource, which derives from Entity', () => {
        const stack = new lib_1.Stack();
        new lib_1.CfnResource(stack, 'MyResource', {
            type: 'MyResourceType',
            properties: {
                Prop1: 'p1', Prop2: 123,
            },
        });
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Resources: {
                MyResource: {
                    Type: 'MyResourceType',
                    Properties: {
                        Prop1: 'p1',
                        Prop2: 123,
                    },
                },
            },
        });
    });
    test('resources must reside within a Stack and fail upon creation if not', () => {
        const root = new lib_1.App();
        expect(() => new lib_1.CfnResource(root, 'R1', { type: 'ResourceType' })).toThrow();
    });
    test('all entities have a logical ID calculated based on their full path in the tree', () => {
        const stack = new lib_1.Stack(undefined, 'TestStack');
        const level1 = new constructs_1.Construct(stack, 'level1');
        const level2 = new constructs_1.Construct(level1, 'level2');
        const level3 = new constructs_1.Construct(level2, 'level3');
        const res1 = new lib_1.CfnResource(level1, 'childoflevel1', { type: 'MyResourceType1' });
        const res2 = new lib_1.CfnResource(level3, 'childoflevel3', { type: 'MyResourceType2' });
        expect(withoutHash(stack.resolve(res1.logicalId))).toEqual('level1childoflevel1');
        expect(withoutHash(stack.resolve(res2.logicalId))).toEqual('level1level2level3childoflevel3');
    });
    test('resource.props can only be accessed by derived classes', () => {
        const stack = new lib_1.Stack();
        const res = new Counter(stack, 'MyResource', { Count: 10 });
        res.increment();
        res.increment(2);
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Resources: {
                MyResource: { Type: 'My::Counter', Properties: { Count: 13 } },
            },
        });
    });
    test('resource attributes can be retrieved using getAtt(s) or attribute properties', () => {
        const stack = new lib_1.Stack();
        const res = new Counter(stack, 'MyResource', { Count: 10 });
        new lib_1.CfnResource(stack, 'YourResource', {
            type: 'Type',
            properties: {
                CounterName: res.getAtt('Name'),
                CounterArn: res.arn,
                CounterURL: res.url,
            },
        });
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Resources: {
                MyResource: { Type: 'My::Counter', Properties: { Count: 10 } },
                YourResource: {
                    Type: 'Type',
                    Properties: {
                        CounterName: { 'Fn::GetAtt': ['MyResource', 'Name'] },
                        CounterArn: { 'Fn::GetAtt': ['MyResource', 'Arn'] },
                        CounterURL: { 'Fn::GetAtt': ['MyResource', 'URL'] },
                    },
                },
            },
        });
    });
    test('ARN-type resource attributes have some common functionality', () => {
        const stack = new lib_1.Stack();
        const res = new Counter(stack, 'MyResource', { Count: 1 });
        new lib_1.CfnResource(stack, 'MyResource2', {
            type: 'Type',
            properties: {
                Perm: res.arn,
            },
        });
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Resources: {
                MyResource: { Type: 'My::Counter', Properties: { Count: 1 } },
                MyResource2: {
                    Type: 'Type',
                    Properties: {
                        Perm: {
                            'Fn::GetAtt': ['MyResource', 'Arn'],
                        },
                    },
                },
            },
        });
    });
    test('resource.addDependency(e) can be used to add a DependsOn on another resource', () => {
        const stack = new lib_1.Stack();
        const r1 = new Counter(stack, 'Counter1', { Count: 1 });
        const r2 = new Counter(stack, 'Counter2', { Count: 1 });
        const r3 = new lib_1.CfnResource(stack, 'Resource3', { type: 'MyResourceType' });
        r2.node.addDependency(r1);
        r2.node.addDependency(r3);
        (0, synthesis_1.synthesize)(stack);
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Resources: {
                Counter1: {
                    Type: 'My::Counter',
                    Properties: { Count: 1 },
                },
                Counter2: {
                    Type: 'My::Counter',
                    Properties: { Count: 1 },
                    DependsOn: [
                        'Counter1',
                        'Resource3',
                    ],
                },
                Resource3: { Type: 'MyResourceType' },
            },
        });
    });
    test('if addDependency is called multiple times with the same resource, it will only appear once', () => {
        // GIVEN
        const stack = new lib_1.Stack();
        const r1 = new Counter(stack, 'Counter1', { Count: 1 });
        const dependent = new lib_1.CfnResource(stack, 'Dependent', { type: 'R' });
        // WHEN
        dependent.addDependency(r1);
        dependent.addDependency(r1);
        dependent.addDependency(r1);
        dependent.addDependency(r1);
        dependent.addDependency(r1);
        // THEN
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Resources: {
                Counter1: {
                    Type: 'My::Counter',
                    Properties: {
                        Count: 1,
                    },
                },
                Dependent: {
                    Type: 'R',
                    DependsOn: [
                        'Counter1',
                    ],
                },
            },
        });
    });
    test('conditions can be attached to a resource', () => {
        const stack = new lib_1.Stack();
        const r1 = new lib_1.CfnResource(stack, 'Resource', { type: 'Type' });
        const cond = new lib_1.CfnCondition(stack, 'MyCondition', { expression: lib_1.Fn.conditionNot(lib_1.Fn.conditionEquals('a', 'b')) });
        r1.cfnOptions.condition = cond;
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Resources: { Resource: { Type: 'Type', Condition: 'MyCondition' } },
            Conditions: { MyCondition: { 'Fn::Not': [{ 'Fn::Equals': ['a', 'b'] }] } },
        });
    });
    test('creation/update/updateReplace/deletion policies can be set on a resource', () => {
        const stack = new lib_1.Stack();
        const r1 = new lib_1.CfnResource(stack, 'Resource', { type: 'Type' });
        r1.cfnOptions.creationPolicy = {
            autoScalingCreationPolicy: { minSuccessfulInstancesPercent: 10 },
            startFleet: true,
        };
        // eslint-disable-next-line max-len
        r1.cfnOptions.updatePolicy = {
            autoScalingScheduledAction: { ignoreUnmodifiedGroupSizeProperties: false },
            autoScalingReplacingUpdate: { willReplace: true },
            codeDeployLambdaAliasUpdate: {
                applicationName: 'CodeDeployApplication',
                deploymentGroupName: 'CodeDeployDeploymentGroup',
                beforeAllowTrafficHook: 'lambda1',
            },
        };
        r1.cfnOptions.deletionPolicy = lib_1.CfnDeletionPolicy.RETAIN;
        r1.cfnOptions.updateReplacePolicy = lib_1.CfnDeletionPolicy.SNAPSHOT;
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Resources: {
                Resource: {
                    Type: 'Type',
                    CreationPolicy: {
                        AutoScalingCreationPolicy: { MinSuccessfulInstancesPercent: 10 },
                        StartFleet: true,
                    },
                    UpdatePolicy: {
                        AutoScalingScheduledAction: { IgnoreUnmodifiedGroupSizeProperties: false },
                        AutoScalingReplacingUpdate: { WillReplace: true },
                        CodeDeployLambdaAliasUpdate: {
                            ApplicationName: 'CodeDeployApplication',
                            DeploymentGroupName: 'CodeDeployDeploymentGroup',
                            BeforeAllowTrafficHook: 'lambda1',
                        },
                    },
                    DeletionPolicy: 'Retain',
                    UpdateReplacePolicy: 'Snapshot',
                },
            },
        });
    });
    test('update policies UseOnlineResharding flag', () => {
        const stack = new lib_1.Stack();
        const r1 = new lib_1.CfnResource(stack, 'Resource', { type: 'Type' });
        r1.cfnOptions.updatePolicy = { useOnlineResharding: true };
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Resources: {
                Resource: {
                    Type: 'Type',
                    UpdatePolicy: {
                        UseOnlineResharding: true,
                    },
                },
            },
        });
    });
    test('metadata can be set on a resource', () => {
        const stack = new lib_1.Stack();
        const r1 = new lib_1.CfnResource(stack, 'Resource', { type: 'Type' });
        r1.cfnOptions.metadata = {
            MyKey: 10,
            MyValue: 99,
        };
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Resources: {
                Resource: {
                    Type: 'Type',
                    Metadata: {
                        MyKey: 10,
                        MyValue: 99,
                    },
                },
            },
        });
    });
    test('the "type" property is required when creating a resource', () => {
        const stack = new lib_1.Stack();
        expect(() => new lib_1.CfnResource(stack, 'Resource', { notypehere: true })).toThrow();
    });
    test('removal policy is a high level abstraction of deletion policy used by l2', () => {
        const stack = new lib_1.Stack();
        const retain = new lib_1.CfnResource(stack, 'Retain', { type: 'T1' });
        const destroy = new lib_1.CfnResource(stack, 'Destroy', { type: 'T3' });
        const def = new lib_1.CfnResource(stack, 'Default1', { type: 'T4' });
        const def2 = new lib_1.CfnResource(stack, 'Default2', { type: 'T4' });
        retain.applyRemovalPolicy(lib_1.RemovalPolicy.RETAIN);
        destroy.applyRemovalPolicy(lib_1.RemovalPolicy.DESTROY);
        def.applyRemovalPolicy(undefined, { default: lib_1.RemovalPolicy.DESTROY });
        def2.applyRemovalPolicy(undefined);
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Resources: {
                Retain: { Type: 'T1', DeletionPolicy: 'Retain', UpdateReplacePolicy: 'Retain' },
                Destroy: { Type: 'T3', DeletionPolicy: 'Delete', UpdateReplacePolicy: 'Delete' },
                Default1: { Type: 'T4', DeletionPolicy: 'Delete', UpdateReplacePolicy: 'Delete' },
                Default2: { Type: 'T4', DeletionPolicy: 'Retain', UpdateReplacePolicy: 'Retain' }, // implicit default
            },
        });
    });
    test('applyRemovalPolicy available for interface resources', () => {
        class Child extends lib_1.Resource {
            constructor(scope, id) {
                super(scope, id);
                new lib_1.CfnResource(this, 'Resource', {
                    type: 'ChildResourceType',
                });
            }
        }
        const stack = new lib_1.Stack();
        const child = new Child(stack, 'Child');
        child.applyRemovalPolicy(lib_1.RemovalPolicy.RETAIN);
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Resources: {
                ChildDAB30558: {
                    DeletionPolicy: 'Retain',
                    Type: 'ChildResourceType',
                    UpdateReplacePolicy: 'Retain',
                },
            },
        });
    });
    test('addDependency adds all dependencyElements of dependent constructs', () => {
        class C1 extends constructs_1.Construct {
            constructor(scope, id) {
                super(scope, id);
                this.r1 = new lib_1.CfnResource(this, 'R1', { type: 'T1' });
                this.r2 = new lib_1.CfnResource(this, 'R2', { type: 'T2' });
            }
        }
        class C2 extends constructs_1.Construct {
            constructor(scope, id) {
                super(scope, id);
                this.r3 = new lib_1.CfnResource(this, 'R3', { type: 'T3' });
            }
        }
        // C3 returns [ c2 ] for it's dependency elements
        // this should result in 'flattening' the list of elements.
        class C3 extends constructs_1.Construct {
            constructor(scope, id) {
                super(scope, id);
                new C2(this, 'C2');
            }
        }
        const stack = new lib_1.Stack();
        const c1 = new C1(stack, 'MyC1');
        const c2 = new C2(stack, 'MyC2');
        const c3 = new C3(stack, 'MyC3');
        const dependingResource = new lib_1.CfnResource(stack, 'MyResource', { type: 'R' });
        dependingResource.node.addDependency(c1, c2);
        dependingResource.node.addDependency(c3);
        (0, synthesis_1.synthesize)(stack);
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Resources: {
                MyC1R1FB2A562F: { Type: 'T1' },
                MyC1R2AE2B5066: { Type: 'T2' },
                MyC2R3809EEAD6: { Type: 'T3' },
                MyC3C2R38CE6F9F7: { Type: 'T3' },
                MyResource: {
                    Type: 'R',
                    DependsOn: ['MyC1R1FB2A562F',
                        'MyC1R2AE2B5066',
                        'MyC2R3809EEAD6',
                        'MyC3C2R38CE6F9F7'],
                },
            },
        });
    });
    test('resource.ref returns the {Ref} token', () => {
        const stack = new lib_1.Stack();
        const r = new lib_1.CfnResource(stack, 'MyResource', { type: 'R' });
        expect(stack.resolve(r.ref)).toEqual({ Ref: 'MyResource' });
    });
    describe('overrides', () => {
        test('addOverride(p, v) allows assigning arbitrary values to synthesized resource definitions', () => {
            // GIVEN
            const stack = new lib_1.Stack();
            const r = new lib_1.CfnResource(stack, 'MyResource', { type: 'AWS::Resource::Type' });
            // WHEN
            r.addOverride('Type', 'YouCanEvenOverrideTheType');
            r.addOverride('Metadata', { Key: 12 });
            r.addOverride('Use.Dot.Notation', 'To create subtrees');
            // THEN
            expect((0, util_1.toCloudFormation)(stack)).toEqual({
                Resources: {
                    MyResource: {
                        Type: 'YouCanEvenOverrideTheType',
                        Use: { Dot: { Notation: 'To create subtrees' } },
                        Metadata: { Key: 12 },
                    },
                },
            });
        });
        test('addPropertyOverride() allows assigning an attribute of a different resource', () => {
            // GIVEN
            const stack = new lib_1.Stack();
            const r1 = new lib_1.CfnResource(stack, 'MyResource1', { type: 'AWS::Resource::Type' });
            const r2 = new lib_1.CfnResource(stack, 'MyResource2', { type: 'AWS::Resource::Type' });
            // WHEN
            r2.addPropertyOverride('A', {
                B: r1.getAtt('Arn'),
            });
            // THEN
            expect((0, util_1.toCloudFormation)(stack)).toEqual({
                Resources: {
                    MyResource1: {
                        Type: 'AWS::Resource::Type',
                    },
                    MyResource2: {
                        Type: 'AWS::Resource::Type',
                        Properties: {
                            A: {
                                B: { 'Fn::GetAtt': ['MyResource1', 'Arn'] },
                            },
                        },
                    },
                },
            });
        });
        test('addOverride(p, null) will assign an "null" value', () => {
            // GIVEN
            const stack = new lib_1.Stack();
            const r = new lib_1.CfnResource(stack, 'MyResource', {
                type: 'AWS::Resource::Type',
                properties: {
                    Hello: {
                        World: {
                            Value1: 'Hello',
                            Value2: 129,
                        },
                    },
                },
            });
            // WHEN
            r.addOverride('Properties.Hello.World.Value2', null);
            // THEN
            expect((0, util_1.toCloudFormation)(stack)).toEqual({
                Resources: {
                    MyResource: {
                        Type: 'AWS::Resource::Type',
                        Properties: { Hello: { World: { Value1: 'Hello', Value2: null } } },
                    },
                },
            });
        });
        test('addOverride(p, undefined) can be used to delete a value', () => {
            // GIVEN
            const stack = new lib_1.Stack();
            const r = new lib_1.CfnResource(stack, 'MyResource', {
                type: 'AWS::Resource::Type',
                properties: {
                    Hello: {
                        World: {
                            Value1: 'Hello',
                            Value2: 129,
                        },
                    },
                },
            });
            // WHEN
            r.addOverride('Properties.Hello.World.Value2', undefined);
            // THEN
            expect((0, util_1.toCloudFormation)(stack)).toEqual({
                Resources: {
                    MyResource: {
                        Type: 'AWS::Resource::Type',
                        Properties: { Hello: { World: { Value1: 'Hello' } } },
                    },
                },
            });
        });
        test('addOverride(p, undefined) will not create empty trees', () => {
            // GIVEN
            const stack = new lib_1.Stack();
            const r = new lib_1.CfnResource(stack, 'MyResource', { type: 'AWS::Resource::Type' });
            // WHEN
            r.addPropertyOverride('Tree.Exists', 42);
            r.addPropertyOverride('Tree.Does.Not.Exist', undefined);
            // THEN
            expect((0, util_1.toCloudFormation)(stack)).toEqual({
                Resources: {
                    MyResource: {
                        Type: 'AWS::Resource::Type',
                        Properties: { Tree: { Exists: 42 } },
                    },
                },
            });
        });
        test('addDeletionOverride(p) and addPropertyDeletionOverride(pp) are sugar for `undefined`', () => {
            // GIVEN
            const stack = new lib_1.Stack();
            const r = new lib_1.CfnResource(stack, 'MyResource', {
                type: 'AWS::Resource::Type',
                properties: {
                    Hello: {
                        World: {
                            Value1: 'Hello',
                            Value2: 129,
                            Value3: ['foo', 'bar'],
                        },
                    },
                },
            });
            // WHEN
            r.addDeletionOverride('Properties.Hello.World.Value2');
            r.addPropertyDeletionOverride('Hello.World.Value3');
            // THEN
            expect((0, util_1.toCloudFormation)(stack)).toEqual({
                Resources: {
                    MyResource: {
                        Type: 'AWS::Resource::Type',
                        Properties: { Hello: { World: { Value1: 'Hello' } } },
                    },
                },
            });
        });
        test('addOverride(p, v) will overwrite any non-objects along the path', () => {
            // GIVEN
            const stack = new lib_1.Stack();
            const r = new lib_1.CfnResource(stack, 'MyResource', {
                type: 'AWS::Resource::Type',
                properties: {
                    Hello: {
                        World: 42,
                    },
                },
            });
            // WHEN
            r.addOverride('Properties.Override1', ['Hello', 123]);
            r.addOverride('Properties.Override1.Override2', { Heyy: [1] });
            r.addOverride('Properties.Hello.World.Foo.Bar', 42);
            // THEN
            expect((0, util_1.toCloudFormation)(stack)).toEqual({
                Resources: {
                    MyResource: {
                        Type: 'AWS::Resource::Type',
                        Properties: {
                            Hello: { World: { Foo: { Bar: 42 } } },
                            Override1: {
                                Override2: { Heyy: [1] },
                            },
                        },
                    },
                },
            });
        });
        test('addOverride(p, v) will not split on escaped dots', () => {
            // GIVEN
            const stack = new lib_1.Stack();
            const r = new lib_1.CfnResource(stack, 'MyResource', { type: 'AWS::Resource::Type' });
            // WHEN
            r.addOverride(String.raw `Properties.Hello\.World.Foo\.Bar\.Baz`, 42);
            r.addOverride(String.raw `Properties.Single\Back\Slashes`, 42);
            r.addOverride(String.raw `Properties.Escaped\\.Back\\.Slashes`, 42);
            r.addOverride(String.raw `Properties.DoublyEscaped\\\\Back\\\\Slashes`, 42);
            r.addOverride('Properties.EndWith\\', 42); // Raw string cannot end with a backslash
            // THEN
            expect((0, util_1.toCloudFormation)(stack)).toEqual({
                Resources: {
                    MyResource: {
                        Type: 'AWS::Resource::Type',
                        Properties: {
                            'Hello.World': { 'Foo.Bar.Baz': 42 },
                            'SingleBackSlashes': 42,
                            'Escaped\\': { 'Back\\': { Slashes: 42 } },
                            'DoublyEscaped\\\\Back\\\\Slashes': 42,
                            'EndWith\\': 42,
                        },
                    },
                },
            });
        });
        test('addPropertyOverride(pp, v) is a sugar for overriding properties', () => {
            // GIVEN
            const stack = new lib_1.Stack();
            const r = new lib_1.CfnResource(stack, 'MyResource', {
                type: 'AWS::Resource::Type',
                properties: { Hello: { World: 42 } },
            });
            // WHEN
            r.addPropertyOverride('Hello.World', { Hey: 'Jude' });
            // THEN
            expect((0, util_1.toCloudFormation)(stack)).toEqual({
                Resources: {
                    MyResource: {
                        Type: 'AWS::Resource::Type',
                        Properties: { Hello: { World: { Hey: 'Jude' } } },
                    },
                },
            });
        });
        test('overrides are applied after render', () => {
            // GIVEN
            class MyResource extends lib_1.CfnResource {
                renderProperties() {
                    return { Fixed: 123 };
                }
            }
            const stack = new lib_1.Stack();
            const cfn = new MyResource(stack, 'rr', { type: 'AWS::Resource::Type' });
            // WHEN
            cfn.addPropertyOverride('Boom', 'Hi');
            cfn.addOverride('Properties.Foo.Bar', 'Bar');
            // THEN
            expect((0, util_1.toCloudFormation)(stack)).toEqual({
                Resources: {
                    rr: {
                        Type: 'AWS::Resource::Type',
                        Properties: {
                            Fixed: 123,
                            Boom: 'Hi',
                            Foo: {
                                Bar: 'Bar',
                            },
                        },
                    },
                },
            });
        });
        test('overrides allow overriding one intrinsic with another', () => {
            // GIVEN
            const stack = new lib_1.Stack();
            const resource = new lib_1.CfnResource(stack, 'MyResource', {
                type: 'MyResourceType',
                properties: {
                    prop1: lib_1.Fn.ref('Param'),
                },
            });
            // WHEN
            resource.addPropertyOverride('prop1', lib_1.Fn.join('-', ['hello', lib_1.Fn.ref('Param')]));
            const cfn = (0, util_1.toCloudFormation)(stack);
            // THEN
            expect(cfn.Resources.MyResource).toEqual({
                Type: 'MyResourceType',
                Properties: {
                    prop1: {
                        'Fn::Join': [
                            '-',
                            [
                                'hello',
                                {
                                    Ref: 'Param',
                                },
                            ],
                        ],
                    },
                },
            });
        });
        test('Can override a an object with an intrinsic', () => {
            // GIVEN
            const stack = new lib_1.Stack();
            const condition = new lib_1.CfnCondition(stack, 'MyCondition', {
                expression: lib_1.Fn.conditionEquals('us-east-1', 'us-east-1'),
            });
            const resource = new lib_1.CfnResource(stack, 'MyResource', {
                type: 'MyResourceType',
                properties: {
                    prop1: {
                        subprop: {
                            name: lib_1.Fn.getAtt('resource', 'abc'),
                        },
                    },
                },
            });
            const isEnabled = lib_1.Fn.conditionIf(condition.logicalId, {
                Ref: 'AWS::NoValue',
            }, {
                name: lib_1.Fn.getAtt('resource', 'abc'),
            });
            // WHEN
            resource.addPropertyOverride('prop1.subprop', isEnabled);
            const cfn = (0, util_1.toCloudFormation)(stack);
            // THEN
            expect(cfn.Resources.MyResource).toEqual({
                Type: 'MyResourceType',
                Properties: {
                    prop1: {
                        subprop: {
                            'Fn::If': [
                                'MyCondition',
                                {
                                    Ref: 'AWS::NoValue',
                                },
                                {
                                    name: {
                                        'Fn::GetAtt': [
                                            'resource',
                                            'abc',
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                },
            });
        });
        test('overrides allow overriding a nested intrinsic', () => {
            // GIVEN
            const stack = new lib_1.Stack();
            const resource = new lib_1.CfnResource(stack, 'MyResource', {
                type: 'MyResourceType',
                properties: {
                    prop1: lib_1.Fn.importValue(lib_1.Fn.sub('${Sub}', { Sub: 'Value' })),
                },
            });
            // WHEN
            resource.addPropertyOverride('prop1', lib_1.Fn.importValue(lib_1.Fn.join('-', ['abc', lib_1.Fn.sub('${Sub}', { Sub: 'Value' })])));
            const cfn = (0, util_1.toCloudFormation)(stack);
            // THEN
            expect(cfn.Resources.MyResource).toEqual({
                Type: 'MyResourceType',
                Properties: {
                    prop1: {
                        'Fn::ImportValue': {
                            'Fn::Join': [
                                '-',
                                [
                                    'abc',
                                    {
                                        'Fn::Sub': ['${Sub}', { Sub: 'Value' }],
                                    },
                                ],
                            ],
                        },
                    },
                },
            });
        });
        describe('using mutable properties', () => {
            test('can be used by derived classes to specify overrides before render()', () => {
                const stack = new lib_1.Stack();
                const r = new CustomizableResource(stack, 'MyResource', {
                    prop1: 'foo',
                });
                r.prop2 = 'bar';
                expect((0, util_1.toCloudFormation)(stack)).toEqual({
                    Resources: {
                        MyResource: {
                            Type: 'MyResourceType',
                            Properties: { PROP1: 'foo', PROP2: 'bar' },
                        },
                    },
                });
            });
            test('"properties" is undefined', () => {
                const stack = new lib_1.Stack();
                const r = new CustomizableResource(stack, 'MyResource');
                r.prop3 = 'zoo';
                expect((0, util_1.toCloudFormation)(stack)).toEqual({
                    Resources: {
                        MyResource: {
                            Type: 'MyResourceType',
                            Properties: { PROP3: 'zoo' },
                        },
                    },
                });
            });
            test('"properties" is empty', () => {
                const stack = new lib_1.Stack();
                const r = new CustomizableResource(stack, 'MyResource', {});
                r.prop3 = 'zoo';
                r.prop2 = 'hey';
                expect((0, util_1.toCloudFormation)(stack)).toEqual({
                    Resources: {
                        MyResource: {
                            Type: 'MyResourceType',
                            Properties: { PROP2: 'hey', PROP3: 'zoo' },
                        },
                    },
                });
            });
        });
    });
    test('"aws:cdk:path" metadata is added if "aws:cdk:path-metadata" context is set to true', () => {
        const stack = new lib_1.Stack();
        stack.node.setContext(cxapi.PATH_METADATA_ENABLE_CONTEXT, true);
        const parent = new constructs_1.Construct(stack, 'Parent');
        new lib_1.CfnResource(parent, 'MyResource', {
            type: 'MyResourceType',
        });
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Resources: {
                ParentMyResource4B1FDBCC: {
                    Type: 'MyResourceType',
                    Metadata: { [cxapi.PATH_METADATA_KEY]: 'Default/Parent/MyResource' },
                },
            },
        });
    });
    test('cross-stack construct dependencies are not rendered but turned into stack dependencies', () => {
        // GIVEN
        const app = new lib_1.App();
        const stackA = new lib_1.Stack(app, 'StackA');
        const resA = new lib_1.CfnResource(stackA, 'Resource', { type: 'R' });
        const stackB = new lib_1.Stack(app, 'StackB');
        const resB = new lib_1.CfnResource(stackB, 'Resource', { type: 'R' });
        // WHEN
        resB.node.addDependency(resA);
        // THEN
        const assembly = app.synth();
        const templateB = assembly.getStackByName(stackB.stackName).template;
        expect(templateB?.Resources?.Resource).toEqual({
            Type: 'R',
            // Notice absence of 'DependsOn'
        });
        expect(stackB.dependencies.map(s => s.node.id)).toEqual(['StackA']);
    });
    test('enableVersionUpgrade can be set on a resource', () => {
        const stack = new lib_1.Stack();
        const r1 = new lib_1.CfnResource(stack, 'Resource', { type: 'Type' });
        r1.cfnOptions.updatePolicy = {
            enableVersionUpgrade: true,
        };
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Resources: {
                Resource: {
                    Type: 'Type',
                    UpdatePolicy: {
                        EnableVersionUpgrade: true,
                    },
                },
            },
        });
    });
});
test('Resource can get account and Region from ARN', () => {
    const stack = new lib_1.Stack();
    // WHEN
    const resource = new TestResource(stack, 'Resource', {
        environmentFromArn: 'arn:partition:service:region:account:relative-id',
    });
    // THEN
    expect(resource.env.account).toEqual('account');
    expect(resource.env.region).toEqual('region');
});
class Counter extends lib_1.CfnResource {
    constructor(scope, id, props) {
        super(scope, id, { type: 'My::Counter', properties: { Count: props.Count } });
        this.arn = this.getAtt('Arn').toString();
        this.url = this.getAtt('URL').toString();
        this.count = props.Count;
    }
    increment(by = 1) {
        this.count += by;
    }
    get cfnProperties() {
        return { Count: this.count };
    }
}
function withoutHash(logId) {
    return logId.slice(0, -8);
}
class CustomizableResource extends lib_1.CfnResource {
    constructor(scope, id, props) {
        super(scope, id, { type: 'MyResourceType', properties: props });
        if (props !== undefined) {
            this.prop1 = props.prop1;
            this.prop2 = props.prop2;
            this.prop3 = props.prop3;
        }
    }
    renderProperties() {
        const props = this.updatedProperties;
        const render = {};
        for (const key of Object.keys(props)) {
            render[key.toUpperCase()] = props[key];
        }
        return render;
    }
    get updatedProperties() {
        const props = {
            prop1: this.prop1,
            prop2: this.prop2,
            prop3: this.prop3,
        };
        const cleanProps = {};
        for (const key of Object.keys(props)) {
            if (props[key] === undefined) {
                continue;
            }
            cleanProps[key] = props[key];
        }
        return cleanProps;
    }
}
/**
 * Because Resource is abstract
 */
class TestResource extends lib_1.Resource {
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlc291cmNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBeUM7QUFDekMsMkNBQXVDO0FBQ3ZDLGlDQUEwQztBQUMxQyxnQ0FJZ0I7QUFDaEIsd0RBQXNEO0FBRXRELFFBQVEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFO0lBQ3hCLElBQUksQ0FBQywrREFBK0QsRUFBRSxHQUFHLEVBQUU7UUFDekUsTUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFLLEVBQUUsQ0FBQztRQUUxQixJQUFJLGlCQUFXLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtZQUNuQyxJQUFJLEVBQUUsZ0JBQWdCO1lBQ3RCLFVBQVUsRUFBRTtnQkFDVixLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHO2FBQ3hCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLElBQUEsdUJBQWdCLEVBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDdEMsU0FBUyxFQUFFO2dCQUNULFVBQVUsRUFBRTtvQkFDVixJQUFJLEVBQUUsZ0JBQWdCO29CQUN0QixVQUFVLEVBQUU7d0JBQ1YsS0FBSyxFQUFFLElBQUk7d0JBQ1gsS0FBSyxFQUFFLEdBQUc7cUJBQ1g7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG9FQUFvRSxFQUFFLEdBQUcsRUFBRTtRQUM5RSxNQUFNLElBQUksR0FBRyxJQUFJLFNBQUksRUFBRSxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLGlCQUFXLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDaEYsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsZ0ZB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QUM7S0FDZjtJQUVELElBQWMsaUJBQWlCO1FBQzdCLE1BQU0sS0FBSyxHQUEyQjtZQUNwQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDakIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztTQUNsQixDQUFDO1FBQ0YsTUFBTSxVQUFVLEdBQTJCLEVBQUcsQ0FBQztRQUMvQyxLQUFLLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDcEMsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssU0FBUyxFQUFFO2dCQUM1QixTQUFTO2FBQ1Y7WUFDRCxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzlCO1FBQ0QsT0FBTyxVQUFVLENBQUM7S0FDbkI7Q0FDRjtBQUVEOztHQUVHO0FBQ0gsTUFBTSxZQUFhLFNBQVEsY0FBUTtDQUFHIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgdG9DbG91ZEZvcm1hdGlvbiB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQge1xuICBBcHAsIEFwcCBhcyBSb290LCBDZm5Db25kaXRpb24sXG4gIENmbkRlbGV0aW9uUG9saWN5LCBDZm5SZXNvdXJjZSxcbiAgRm4sIElSZXNvdXJjZSwgUmVtb3ZhbFBvbGljeSwgUmVzb3VyY2UsIFN0YWNrLFxufSBmcm9tICcuLi9saWInO1xuaW1wb3J0IHsgc3ludGhlc2l6ZSB9IGZyb20gJy4uL2xpYi9wcml2YXRlL3N5bnRoZXNpcyc7XG5cbmRlc2NyaWJlKCdyZXNvdXJjZScsICgpID0+IHtcbiAgdGVzdCgnYWxsIHJlc291cmNlcyBkZXJpdmUgZnJvbSBSZXNvdXJjZSwgd2hpY2ggZGVyaXZlcyBmcm9tIEVudGl0eScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnTXlSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdNeVJlc291cmNlVHlwZScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIFByb3AxOiAncDEnLCBQcm9wMjogMTIzLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgTXlSZXNvdXJjZToge1xuICAgICAgICAgIFR5cGU6ICdNeVJlc291cmNlVHlwZScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgUHJvcDE6ICdwMScsXG4gICAgICAgICAgICBQcm9wMjogMTIzLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyZXNvdXJjZXMgbXVzdCByZXNpZGUgd2l0aGluIGEgU3RhY2sgYW5kIGZhaWwgdXBvbiBjcmVhdGlvbiBpZiBub3QnLCAoKSA9PiB7XG4gICAgY29uc3Qgcm9vdCA9IG5ldyBSb290KCk7XG4gICAgZXhwZWN0KCgpID0+IG5ldyBDZm5SZXNvdXJjZShyb290LCAnUjEnLCB7IHR5cGU6ICdSZXNvdXJjZVR5cGUnIH0pKS50b1Rocm93KCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FsbCBlbnRpdGllcyBoYXZlIGEgbG9naWNhbCBJRCBjYWxjdWxhdGVkIGJhc2VkIG9uIHRoZWlyIGZ1bGwgcGF0aCBpbiB0aGUgdHJlZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayh1bmRlZmluZWQsICdUZXN0U3RhY2snKTtcbiAgICBjb25zdCBsZXZlbDEgPSBuZXcgQ29uc3RydWN0KHN0YWNrLCAnbGV2ZWwxJyk7XG4gICAgY29uc3QgbGV2ZWwyID0gbmV3IENvbnN0cnVjdChsZXZlbDEsICdsZXZlbDInKTtcbiAgICBjb25zdCBsZXZlbDMgPSBuZXcgQ29uc3RydWN0KGxldmVsMiwgJ2xldmVsMycpO1xuICAgIGNvbnN0IHJlczEgPSBuZXcgQ2ZuUmVzb3VyY2UobGV2ZWwxLCAnY2hpbGRvZmxldmVsMScsIHsgdHlwZTogJ015UmVzb3VyY2VUeXBlMScgfSk7XG4gICAgY29uc3QgcmVzMiA9IG5ldyBDZm5SZXNvdXJjZShsZXZlbDMsICdjaGlsZG9mbGV2ZWwzJywgeyB0eXBlOiAnTXlSZXNvdXJjZVR5cGUyJyB9KTtcblxuICAgIGV4cGVjdCh3aXRob3V0SGFzaChzdGFjay5yZXNvbHZlKHJlczEubG9naWNhbElkKSkpLnRvRXF1YWwoJ2xldmVsMWNoaWxkb2ZsZXZlbDEnKTtcbiAgICBleHBlY3Qod2l0aG91dEhhc2goc3RhY2sucmVzb2x2ZShyZXMyLmxvZ2ljYWxJZCkpKS50b0VxdWFsKCdsZXZlbDFsZXZlbDJsZXZlbDNjaGlsZG9mbGV2ZWwzJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Jlc291cmNlLnByb3BzIGNhbiBvbmx5IGJlIGFjY2Vzc2VkIGJ5IGRlcml2ZWQgY2xhc3NlcycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHJlcyA9IG5ldyBDb3VudGVyKHN0YWNrLCAnTXlSZXNvdXJjZScsIHsgQ291bnQ6IDEwIH0pO1xuICAgIHJlcy5pbmNyZW1lbnQoKTtcbiAgICByZXMuaW5jcmVtZW50KDIpO1xuXG4gICAgZXhwZWN0KHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spKS50b0VxdWFsKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBNeVJlc291cmNlOiB7IFR5cGU6ICdNeTo6Q291bnRlcicsIFByb3BlcnRpZXM6IHsgQ291bnQ6IDEzIH0gfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Jlc291cmNlIGF0dHJpYnV0ZXMgY2FuIGJlIHJldHJpZXZlZCB1c2luZyBnZXRBdHQocykgb3IgYXR0cmlidXRlIHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCByZXMgPSBuZXcgQ291bnRlcihzdGFjaywgJ015UmVzb3VyY2UnLCB7IENvdW50OiAxMCB9KTtcblxuICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ1lvdXJSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdUeXBlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgQ291bnRlck5hbWU6IHJlcy5nZXRBdHQoJ05hbWUnKSxcbiAgICAgICAgQ291bnRlckFybjogcmVzLmFybixcbiAgICAgICAgQ291bnRlclVSTDogcmVzLnVybCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIE15UmVzb3VyY2U6IHsgVHlwZTogJ015OjpDb3VudGVyJywgUHJvcGVydGllczogeyBDb3VudDogMTAgfSB9LFxuICAgICAgICBZb3VyUmVzb3VyY2U6IHtcbiAgICAgICAgICBUeXBlOiAnVHlwZScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgQ291bnRlck5hbWU6IHsgJ0ZuOjpHZXRBdHQnOiBbJ015UmVzb3VyY2UnLCAnTmFtZSddIH0sXG4gICAgICAgICAgICBDb3VudGVyQXJuOiB7ICdGbjo6R2V0QXR0JzogWydNeVJlc291cmNlJywgJ0FybiddIH0sXG4gICAgICAgICAgICBDb3VudGVyVVJMOiB7ICdGbjo6R2V0QXR0JzogWydNeVJlc291cmNlJywgJ1VSTCddIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0FSTi10eXBlIHJlc291cmNlIGF0dHJpYnV0ZXMgaGF2ZSBzb21lIGNvbW1vbiBmdW5jdGlvbmFsaXR5JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgcmVzID0gbmV3IENvdW50ZXIoc3RhY2ssICdNeVJlc291cmNlJywgeyBDb3VudDogMSB9KTtcbiAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdNeVJlc291cmNlMicsIHtcbiAgICAgIHR5cGU6ICdUeXBlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgUGVybTogcmVzLmFybixcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIE15UmVzb3VyY2U6IHsgVHlwZTogJ015OjpDb3VudGVyJywgUHJvcGVydGllczogeyBDb3VudDogMSB9IH0sXG4gICAgICAgIE15UmVzb3VyY2UyOiB7XG4gICAgICAgICAgVHlwZTogJ1R5cGUnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIFBlcm06IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ015UmVzb3VyY2UnLCAnQXJuJ10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyZXNvdXJjZS5hZGREZXBlbmRlbmN5KGUpIGNhbiBiZSB1c2VkIHRvIGFkZCBhIERlcGVuZHNPbiBvbiBhbm90aGVyIHJlc291cmNlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgcjEgPSBuZXcgQ291bnRlcihzdGFjaywgJ0NvdW50ZXIxJywgeyBDb3VudDogMSB9KTtcbiAgICBjb25zdCByMiA9IG5ldyBDb3VudGVyKHN0YWNrLCAnQ291bnRlcjInLCB7IENvdW50OiAxIH0pO1xuICAgIGNvbnN0IHIzID0gbmV3IENmblJlc291cmNlKHN0YWNrLCAnUmVzb3VyY2UzJywgeyB0eXBlOiAnTXlSZXNvdXJjZVR5cGUnIH0pO1xuICAgIHIyLm5vZGUuYWRkRGVwZW5kZW5jeShyMSk7XG4gICAgcjIubm9kZS5hZGREZXBlbmRlbmN5KHIzKTtcblxuICAgIHN5bnRoZXNpemUoc3RhY2spO1xuXG4gICAgZXhwZWN0KHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spKS50b0VxdWFsKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBDb3VudGVyMToge1xuICAgICAgICAgIFR5cGU6ICdNeTo6Q291bnRlcicsXG4gICAgICAgICAgUHJvcGVydGllczogeyBDb3VudDogMSB9LFxuICAgICAgICB9LFxuICAgICAgICBDb3VudGVyMjoge1xuICAgICAgICAgIFR5cGU6ICdNeTo6Q291bnRlcicsXG4gICAgICAgICAgUHJvcGVydGllczogeyBDb3VudDogMSB9LFxuICAgICAgICAgIERlcGVuZHNPbjogW1xuICAgICAgICAgICAgJ0NvdW50ZXIxJyxcbiAgICAgICAgICAgICdSZXNvdXJjZTMnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIFJlc291cmNlMzogeyBUeXBlOiAnTXlSZXNvdXJjZVR5cGUnIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdpZiBhZGREZXBlbmRlbmN5IGlzIGNhbGxlZCBtdWx0aXBsZSB0aW1lcyB3aXRoIHRoZSBzYW1lIHJlc291cmNlLCBpdCB3aWxsIG9ubHkgYXBwZWFyIG9uY2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHIxID0gbmV3IENvdW50ZXIoc3RhY2ssICdDb3VudGVyMScsIHsgQ291bnQ6IDEgfSk7XG4gICAgY29uc3QgZGVwZW5kZW50ID0gbmV3IENmblJlc291cmNlKHN0YWNrLCAnRGVwZW5kZW50JywgeyB0eXBlOiAnUicgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgZGVwZW5kZW50LmFkZERlcGVuZGVuY3kocjEpO1xuICAgIGRlcGVuZGVudC5hZGREZXBlbmRlbmN5KHIxKTtcbiAgICBkZXBlbmRlbnQuYWRkRGVwZW5kZW5jeShyMSk7XG4gICAgZGVwZW5kZW50LmFkZERlcGVuZGVuY3kocjEpO1xuICAgIGRlcGVuZGVudC5hZGREZXBlbmRlbmN5KHIxKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIENvdW50ZXIxOiB7XG4gICAgICAgICAgVHlwZTogJ015OjpDb3VudGVyJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBDb3VudDogMSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBEZXBlbmRlbnQ6IHtcbiAgICAgICAgICBUeXBlOiAnUicsXG4gICAgICAgICAgRGVwZW5kc09uOiBbXG4gICAgICAgICAgICAnQ291bnRlcjEnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjb25kaXRpb25zIGNhbiBiZSBhdHRhY2hlZCB0byBhIHJlc291cmNlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgcjEgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZXNvdXJjZScsIHsgdHlwZTogJ1R5cGUnIH0pO1xuICAgIGNvbnN0IGNvbmQgPSBuZXcgQ2ZuQ29uZGl0aW9uKHN0YWNrLCAnTXlDb25kaXRpb24nLCB7IGV4cHJlc3Npb246IEZuLmNvbmRpdGlvbk5vdChGbi5jb25kaXRpb25FcXVhbHMoJ2EnLCAnYicpKSB9KTtcbiAgICByMS5jZm5PcHRpb25zLmNvbmRpdGlvbiA9IGNvbmQ7XG5cbiAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgUmVzb3VyY2VzOiB7IFJlc291cmNlOiB7IFR5cGU6ICdUeXBlJywgQ29uZGl0aW9uOiAnTXlDb25kaXRpb24nIH0gfSxcbiAgICAgIENvbmRpdGlvbnM6IHsgTXlDb25kaXRpb246IHsgJ0ZuOjpOb3QnOiBbeyAnRm46OkVxdWFscyc6IFsnYScsICdiJ10gfV0gfSB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGlvbi91cGRhdGUvdXBkYXRlUmVwbGFjZS9kZWxldGlvbiBwb2xpY2llcyBjYW4gYmUgc2V0IG9uIGEgcmVzb3VyY2UnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCByMSA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ1Jlc291cmNlJywgeyB0eXBlOiAnVHlwZScgfSk7XG5cbiAgICByMS5jZm5PcHRpb25zLmNyZWF0aW9uUG9saWN5ID0ge1xuICAgICAgYXV0b1NjYWxpbmdDcmVhdGlvblBvbGljeTogeyBtaW5TdWNjZXNzZnVsSW5zdGFuY2VzUGVyY2VudDogMTAgfSxcbiAgICAgIHN0YXJ0RmxlZXQ6IHRydWUsXG4gICAgfTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgIHIxLmNmbk9wdGlvbnMudXBkYXRlUG9saWN5ID0ge1xuICAgICAgYXV0b1NjYWxpbmdTY2hlZHVsZWRBY3Rpb246IHsgaWdub3JlVW5tb2RpZmllZEdyb3VwU2l6ZVByb3BlcnRpZXM6IGZhbHNlIH0sXG4gICAgICBhdXRvU2NhbGluZ1JlcGxhY2luZ1VwZGF0ZTogeyB3aWxsUmVwbGFjZTogdHJ1ZSB9LFxuICAgICAgY29kZURlcGxveUxhbWJkYUFsaWFzVXBkYXRlOiB7XG4gICAgICAgIGFwcGxpY2F0aW9uTmFtZTogJ0NvZGVEZXBsb3lBcHBsaWNhdGlvbicsXG4gICAgICAgIGRlcGxveW1lbnRHcm91cE5hbWU6ICdDb2RlRGVwbG95RGVwbG95bWVudEdyb3VwJyxcbiAgICAgICAgYmVmb3JlQWxsb3dUcmFmZmljSG9vazogJ2xhbWJkYTEnLFxuICAgICAgfSxcbiAgICB9O1xuICAgIHIxLmNmbk9wdGlvbnMuZGVsZXRpb25Qb2xpY3kgPSBDZm5EZWxldGlvblBvbGljeS5SRVRBSU47XG4gICAgcjEuY2ZuT3B0aW9ucy51cGRhdGVSZXBsYWNlUG9saWN5ID0gQ2ZuRGVsZXRpb25Qb2xpY3kuU05BUFNIT1Q7XG5cbiAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgVHlwZTogJ1R5cGUnLFxuICAgICAgICAgIENyZWF0aW9uUG9saWN5OiB7XG4gICAgICAgICAgICBBdXRvU2NhbGluZ0NyZWF0aW9uUG9saWN5OiB7IE1pblN1Y2Nlc3NmdWxJbnN0YW5jZXNQZXJjZW50OiAxMCB9LFxuICAgICAgICAgICAgU3RhcnRGbGVldDogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFVwZGF0ZVBvbGljeToge1xuICAgICAgICAgICAgQXV0b1NjYWxpbmdTY2hlZHVsZWRBY3Rpb246IHsgSWdub3JlVW5tb2RpZmllZEdyb3VwU2l6ZVByb3BlcnRpZXM6IGZhbHNlIH0sXG4gICAgICAgICAgICBBdXRvU2NhbGluZ1JlcGxhY2luZ1VwZGF0ZTogeyBXaWxsUmVwbGFjZTogdHJ1ZSB9LFxuICAgICAgICAgICAgQ29kZURlcGxveUxhbWJkYUFsaWFzVXBkYXRlOiB7XG4gICAgICAgICAgICAgIEFwcGxpY2F0aW9uTmFtZTogJ0NvZGVEZXBsb3lBcHBsaWNhdGlvbicsXG4gICAgICAgICAgICAgIERlcGxveW1lbnRHcm91cE5hbWU6ICdDb2RlRGVwbG95RGVwbG95bWVudEdyb3VwJyxcbiAgICAgICAgICAgICAgQmVmb3JlQWxsb3dUcmFmZmljSG9vazogJ2xhbWJkYTEnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIERlbGV0aW9uUG9saWN5OiAnUmV0YWluJyxcbiAgICAgICAgICBVcGRhdGVSZXBsYWNlUG9saWN5OiAnU25hcHNob3QnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndXBkYXRlIHBvbGljaWVzIFVzZU9ubGluZVJlc2hhcmRpbmcgZmxhZycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHIxID0gbmV3IENmblJlc291cmNlKHN0YWNrLCAnUmVzb3VyY2UnLCB7IHR5cGU6ICdUeXBlJyB9KTtcblxuICAgIHIxLmNmbk9wdGlvbnMudXBkYXRlUG9saWN5ID0geyB1c2VPbmxpbmVSZXNoYXJkaW5nOiB0cnVlIH07XG5cbiAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgVHlwZTogJ1R5cGUnLFxuICAgICAgICAgIFVwZGF0ZVBvbGljeToge1xuICAgICAgICAgICAgVXNlT25saW5lUmVzaGFyZGluZzogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnbWV0YWRhdGEgY2FuIGJlIHNldCBvbiBhIHJlc291cmNlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgcjEgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZXNvdXJjZScsIHsgdHlwZTogJ1R5cGUnIH0pO1xuXG4gICAgcjEuY2ZuT3B0aW9ucy5tZXRhZGF0YSA9IHtcbiAgICAgIE15S2V5OiAxMCxcbiAgICAgIE15VmFsdWU6IDk5LFxuICAgIH07XG5cbiAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgVHlwZTogJ1R5cGUnLFxuICAgICAgICAgIE1ldGFkYXRhOiB7XG4gICAgICAgICAgICBNeUtleTogMTAsXG4gICAgICAgICAgICBNeVZhbHVlOiA5OSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndGhlIFwidHlwZVwiIHByb3BlcnR5IGlzIHJlcXVpcmVkIHdoZW4gY3JlYXRpbmcgYSByZXNvdXJjZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGV4cGVjdCgoKSA9PiBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZXNvdXJjZScsIHsgbm90eXBlaGVyZTogdHJ1ZSB9IGFzIGFueSkpLnRvVGhyb3coKTtcbiAgfSk7XG5cbiAgdGVzdCgncmVtb3ZhbCBwb2xpY3kgaXMgYSBoaWdoIGxldmVsIGFic3RyYWN0aW9uIG9mIGRlbGV0aW9uIHBvbGljeSB1c2VkIGJ5IGwyJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCByZXRhaW4gPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZXRhaW4nLCB7IHR5cGU6ICdUMScgfSk7XG4gICAgY29uc3QgZGVzdHJveSA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ0Rlc3Ryb3knLCB7IHR5cGU6ICdUMycgfSk7XG4gICAgY29uc3QgZGVmID0gbmV3IENmblJlc291cmNlKHN0YWNrLCAnRGVmYXVsdDEnLCB7IHR5cGU6ICdUNCcgfSk7XG4gICAgY29uc3QgZGVmMiA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ0RlZmF1bHQyJywgeyB0eXBlOiAnVDQnIH0pO1xuXG4gICAgcmV0YWluLmFwcGx5UmVtb3ZhbFBvbGljeShSZW1vdmFsUG9saWN5LlJFVEFJTik7XG4gICAgZGVzdHJveS5hcHBseVJlbW92YWxQb2xpY3koUmVtb3ZhbFBvbGljeS5ERVNUUk9ZKTtcbiAgICBkZWYuYXBwbHlSZW1vdmFsUG9saWN5KHVuZGVmaW5lZCwgeyBkZWZhdWx0OiBSZW1vdmFsUG9saWN5LkRFU1RST1kgfSk7XG4gICAgZGVmMi5hcHBseVJlbW92YWxQb2xpY3kodW5kZWZpbmVkKTtcblxuICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgUmV0YWluOiB7IFR5cGU6ICdUMScsIERlbGV0aW9uUG9saWN5OiAnUmV0YWluJywgVXBkYXRlUmVwbGFjZVBvbGljeTogJ1JldGFpbicgfSxcbiAgICAgICAgRGVzdHJveTogeyBUeXBlOiAnVDMnLCBEZWxldGlvblBvbGljeTogJ0RlbGV0ZScsIFVwZGF0ZVJlcGxhY2VQb2xpY3k6ICdEZWxldGUnIH0sXG4gICAgICAgIERlZmF1bHQxOiB7IFR5cGU6ICdUNCcsIERlbGV0aW9uUG9saWN5OiAnRGVsZXRlJywgVXBkYXRlUmVwbGFjZVBvbGljeTogJ0RlbGV0ZScgfSwgLy8gZXhwbGljaXQgZGVmYXVsdFxuICAgICAgICBEZWZhdWx0MjogeyBUeXBlOiAnVDQnLCBEZWxldGlvblBvbGljeTogJ1JldGFpbicsIFVwZGF0ZVJlcGxhY2VQb2xpY3k6ICdSZXRhaW4nIH0sIC8vIGltcGxpY2l0IGRlZmF1bHRcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FwcGx5UmVtb3ZhbFBvbGljeSBhdmFpbGFibGUgZm9yIGludGVyZmFjZSByZXNvdXJjZXMnLCAoKSA9PiB7XG4gICAgY2xhc3MgQ2hpbGQgZXh0ZW5kcyBSZXNvdXJjZSB7XG4gICAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAgICAgbmV3IENmblJlc291cmNlKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgICAgICB0eXBlOiAnQ2hpbGRSZXNvdXJjZVR5cGUnLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGNoaWxkOiBJUmVzb3VyY2UgPSBuZXcgQ2hpbGQoc3RhY2ssICdDaGlsZCcpO1xuXG4gICAgY2hpbGQuYXBwbHlSZW1vdmFsUG9saWN5KFJlbW92YWxQb2xpY3kuUkVUQUlOKTtcblxuICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgQ2hpbGREQUIzMDU1ODoge1xuICAgICAgICAgIERlbGV0aW9uUG9saWN5OiAnUmV0YWluJyxcbiAgICAgICAgICBUeXBlOiAnQ2hpbGRSZXNvdXJjZVR5cGUnLFxuICAgICAgICAgIFVwZGF0ZVJlcGxhY2VQb2xpY3k6ICdSZXRhaW4nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkRGVwZW5kZW5jeSBhZGRzIGFsbCBkZXBlbmRlbmN5RWxlbWVudHMgb2YgZGVwZW5kZW50IGNvbnN0cnVjdHMnLCAoKSA9PiB7XG5cbiAgICBjbGFzcyBDMSBleHRlbmRzIENvbnN0cnVjdCB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcjE6IENmblJlc291cmNlO1xuICAgICAgcHVibGljIHJlYWRvbmx5IHIyOiBDZm5SZXNvdXJjZTtcblxuICAgICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgICAgIHRoaXMucjEgPSBuZXcgQ2ZuUmVzb3VyY2UodGhpcywgJ1IxJywgeyB0eXBlOiAnVDEnIH0pO1xuICAgICAgICB0aGlzLnIyID0gbmV3IENmblJlc291cmNlKHRoaXMsICdSMicsIHsgdHlwZTogJ1QyJyB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjbGFzcyBDMiBleHRlbmRzIENvbnN0cnVjdCB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcjM6IENmblJlc291cmNlO1xuXG4gICAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAgICAgdGhpcy5yMyA9IG5ldyBDZm5SZXNvdXJjZSh0aGlzLCAnUjMnLCB7IHR5cGU6ICdUMycgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQzMgcmV0dXJucyBbIGMyIF0gZm9yIGl0J3MgZGVwZW5kZW5jeSBlbGVtZW50c1xuICAgIC8vIHRoaXMgc2hvdWxkIHJlc3VsdCBpbiAnZmxhdHRlbmluZycgdGhlIGxpc3Qgb2YgZWxlbWVudHMuXG4gICAgY2xhc3MgQzMgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICAgICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgICAgIG5ldyBDMih0aGlzLCAnQzInKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGMxID0gbmV3IEMxKHN0YWNrLCAnTXlDMScpO1xuICAgIGNvbnN0IGMyID0gbmV3IEMyKHN0YWNrLCAnTXlDMicpO1xuICAgIGNvbnN0IGMzID0gbmV3IEMzKHN0YWNrLCAnTXlDMycpO1xuXG4gICAgY29uc3QgZGVwZW5kaW5nUmVzb3VyY2UgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdNeVJlc291cmNlJywgeyB0eXBlOiAnUicgfSk7XG4gICAgZGVwZW5kaW5nUmVzb3VyY2Uubm9kZS5hZGREZXBlbmRlbmN5KGMxLCBjMik7XG4gICAgZGVwZW5kaW5nUmVzb3VyY2Uubm9kZS5hZGREZXBlbmRlbmN5KGMzKTtcblxuICAgIHN5bnRoZXNpemUoc3RhY2spO1xuXG4gICAgZXhwZWN0KHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spKS50b0VxdWFsKHtcbiAgICAgIFJlc291cmNlczpcbiAgICAgIHtcbiAgICAgICAgTXlDMVIxRkIyQTU2MkY6IHsgVHlwZTogJ1QxJyB9LFxuICAgICAgICBNeUMxUjJBRTJCNTA2NjogeyBUeXBlOiAnVDInIH0sXG4gICAgICAgIE15QzJSMzgwOUVFQUQ2OiB7IFR5cGU6ICdUMycgfSxcbiAgICAgICAgTXlDM0MyUjM4Q0U2RjlGNzogeyBUeXBlOiAnVDMnIH0sXG4gICAgICAgIE15UmVzb3VyY2U6XG4gICAgICAgIHtcbiAgICAgICAgICBUeXBlOiAnUicsXG4gICAgICAgICAgRGVwZW5kc09uOlxuICAgICAgICAgIFsnTXlDMVIxRkIyQTU2MkYnLFxuICAgICAgICAgICAgJ015QzFSMkFFMkI1MDY2JyxcbiAgICAgICAgICAgICdNeUMyUjM4MDlFRUFENicsXG4gICAgICAgICAgICAnTXlDM0MyUjM4Q0U2RjlGNyddLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncmVzb3VyY2UucmVmIHJldHVybnMgdGhlIHtSZWZ9IHRva2VuJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgciA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ015UmVzb3VyY2UnLCB7IHR5cGU6ICdSJyB9KTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHIucmVmKSkudG9FcXVhbCh7IFJlZjogJ015UmVzb3VyY2UnIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnb3ZlcnJpZGVzJywgKCkgPT4ge1xuICAgIHRlc3QoJ2FkZE92ZXJyaWRlKHAsIHYpIGFsbG93cyBhc3NpZ25pbmcgYXJiaXRyYXJ5IHZhbHVlcyB0byBzeW50aGVzaXplZCByZXNvdXJjZSBkZWZpbml0aW9ucycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgciA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ015UmVzb3VyY2UnLCB7IHR5cGU6ICdBV1M6OlJlc291cmNlOjpUeXBlJyB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgci5hZGRPdmVycmlkZSgnVHlwZScsICdZb3VDYW5FdmVuT3ZlcnJpZGVUaGVUeXBlJyk7XG4gICAgICByLmFkZE92ZXJyaWRlKCdNZXRhZGF0YScsIHsgS2V5OiAxMiB9KTtcbiAgICAgIHIuYWRkT3ZlcnJpZGUoJ1VzZS5Eb3QuTm90YXRpb24nLCAnVG8gY3JlYXRlIHN1YnRyZWVzJyk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICAgIFJlc291cmNlczpcbiAgICAgICAge1xuICAgICAgICAgIE15UmVzb3VyY2U6XG4gICAgICAgICAge1xuICAgICAgICAgICAgVHlwZTogJ1lvdUNhbkV2ZW5PdmVycmlkZVRoZVR5cGUnLFxuICAgICAgICAgICAgVXNlOiB7IERvdDogeyBOb3RhdGlvbjogJ1RvIGNyZWF0ZSBzdWJ0cmVlcycgfSB9LFxuICAgICAgICAgICAgTWV0YWRhdGE6IHsgS2V5OiAxMiB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FkZFByb3BlcnR5T3ZlcnJpZGUoKSBhbGxvd3MgYXNzaWduaW5nIGFuIGF0dHJpYnV0ZSBvZiBhIGRpZmZlcmVudCByZXNvdXJjZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgcjEgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdNeVJlc291cmNlMScsIHsgdHlwZTogJ0FXUzo6UmVzb3VyY2U6OlR5cGUnIH0pO1xuICAgICAgY29uc3QgcjIgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdNeVJlc291cmNlMicsIHsgdHlwZTogJ0FXUzo6UmVzb3VyY2U6OlR5cGUnIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICByMi5hZGRQcm9wZXJ0eU92ZXJyaWRlKCdBJywge1xuICAgICAgICBCOiByMS5nZXRBdHQoJ0FybicpLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICAgIFJlc291cmNlczoge1xuICAgICAgICAgIE15UmVzb3VyY2UxOiB7XG4gICAgICAgICAgICBUeXBlOiAnQVdTOjpSZXNvdXJjZTo6VHlwZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBNeVJlc291cmNlMjoge1xuICAgICAgICAgICAgVHlwZTogJ0FXUzo6UmVzb3VyY2U6OlR5cGUnLFxuICAgICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgICBBOiB7XG4gICAgICAgICAgICAgICAgQjogeyAnRm46OkdldEF0dCc6IFsnTXlSZXNvdXJjZTEnLCAnQXJuJ10gfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYWRkT3ZlcnJpZGUocCwgbnVsbCkgd2lsbCBhc3NpZ24gYW4gXCJudWxsXCIgdmFsdWUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgY29uc3QgciA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ015UmVzb3VyY2UnLCB7XG4gICAgICAgIHR5cGU6ICdBV1M6OlJlc291cmNlOjpUeXBlJyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIEhlbGxvOiB7XG4gICAgICAgICAgICBXb3JsZDoge1xuICAgICAgICAgICAgICBWYWx1ZTE6ICdIZWxsbycsXG4gICAgICAgICAgICAgIFZhbHVlMjogMTI5LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIHIuYWRkT3ZlcnJpZGUoJ1Byb3BlcnRpZXMuSGVsbG8uV29ybGQuVmFsdWUyJywgbnVsbCk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICAgIFJlc291cmNlczpcbiAgICAgICAge1xuICAgICAgICAgIE15UmVzb3VyY2U6XG4gICAgICAgICAge1xuICAgICAgICAgICAgVHlwZTogJ0FXUzo6UmVzb3VyY2U6OlR5cGUnLFxuICAgICAgICAgICAgUHJvcGVydGllczogeyBIZWxsbzogeyBXb3JsZDogeyBWYWx1ZTE6ICdIZWxsbycsIFZhbHVlMjogbnVsbCB9IH0gfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhZGRPdmVycmlkZShwLCB1bmRlZmluZWQpIGNhbiBiZSB1c2VkIHRvIGRlbGV0ZSBhIHZhbHVlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IHIgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdNeVJlc291cmNlJywge1xuICAgICAgICB0eXBlOiAnQVdTOjpSZXNvdXJjZTo6VHlwZScsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBIZWxsbzoge1xuICAgICAgICAgICAgV29ybGQ6IHtcbiAgICAgICAgICAgICAgVmFsdWUxOiAnSGVsbG8nLFxuICAgICAgICAgICAgICBWYWx1ZTI6IDEyOSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICByLmFkZE92ZXJyaWRlKCdQcm9wZXJ0aWVzLkhlbGxvLldvcmxkLlZhbHVlMicsIHVuZGVmaW5lZCk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICAgIFJlc291cmNlczpcbiAgICAgICAge1xuICAgICAgICAgIE15UmVzb3VyY2U6XG4gICAgICAgICAge1xuICAgICAgICAgICAgVHlwZTogJ0FXUzo6UmVzb3VyY2U6OlR5cGUnLFxuICAgICAgICAgICAgUHJvcGVydGllczogeyBIZWxsbzogeyBXb3JsZDogeyBWYWx1ZTE6ICdIZWxsbycgfSB9IH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYWRkT3ZlcnJpZGUocCwgdW5kZWZpbmVkKSB3aWxsIG5vdCBjcmVhdGUgZW1wdHkgdHJlZXMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgY29uc3QgciA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ015UmVzb3VyY2UnLCB7IHR5cGU6ICdBV1M6OlJlc291cmNlOjpUeXBlJyB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgci5hZGRQcm9wZXJ0eU92ZXJyaWRlKCdUcmVlLkV4aXN0cycsIDQyKTtcbiAgICAgIHIuYWRkUHJvcGVydHlPdmVycmlkZSgnVHJlZS5Eb2VzLk5vdC5FeGlzdCcsIHVuZGVmaW5lZCk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICAgIFJlc291cmNlczpcbiAgICAgICAge1xuICAgICAgICAgIE15UmVzb3VyY2U6XG4gICAgICAgICAge1xuICAgICAgICAgICAgVHlwZTogJ0FXUzo6UmVzb3VyY2U6OlR5cGUnLFxuICAgICAgICAgICAgUHJvcGVydGllczogeyBUcmVlOiB7IEV4aXN0czogNDIgfSB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FkZERlbGV0aW9uT3ZlcnJpZGUocCkgYW5kIGFkZFByb3BlcnR5RGVsZXRpb25PdmVycmlkZShwcCkgYXJlIHN1Z2FyIGZvciBgdW5kZWZpbmVkYCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICBjb25zdCByID0gbmV3IENmblJlc291cmNlKHN0YWNrLCAnTXlSZXNvdXJjZScsIHtcbiAgICAgICAgdHlwZTogJ0FXUzo6UmVzb3VyY2U6OlR5cGUnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgSGVsbG86IHtcbiAgICAgICAgICAgIFdvcmxkOiB7XG4gICAgICAgICAgICAgIFZhbHVlMTogJ0hlbGxvJyxcbiAgICAgICAgICAgICAgVmFsdWUyOiAxMjksXG4gICAgICAgICAgICAgIFZhbHVlMzogWydmb28nLCAnYmFyJ10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgci5hZGREZWxldGlvbk92ZXJyaWRlKCdQcm9wZXJ0aWVzLkhlbGxvLldvcmxkLlZhbHVlMicpO1xuICAgICAgci5hZGRQcm9wZXJ0eURlbGV0aW9uT3ZlcnJpZGUoJ0hlbGxvLldvcmxkLlZhbHVlMycpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgICBSZXNvdXJjZXM6XG4gICAgICAgIHtcbiAgICAgICAgICBNeVJlc291cmNlOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFR5cGU6ICdBV1M6OlJlc291cmNlOjpUeXBlJyxcbiAgICAgICAgICAgIFByb3BlcnRpZXM6IHsgSGVsbG86IHsgV29ybGQ6IHsgVmFsdWUxOiAnSGVsbG8nIH0gfSB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FkZE92ZXJyaWRlKHAsIHYpIHdpbGwgb3ZlcndyaXRlIGFueSBub24tb2JqZWN0cyBhbG9uZyB0aGUgcGF0aCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgciA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ015UmVzb3VyY2UnLCB7XG4gICAgICAgIHR5cGU6ICdBV1M6OlJlc291cmNlOjpUeXBlJyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIEhlbGxvOiB7XG4gICAgICAgICAgICBXb3JsZDogNDIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICByLmFkZE92ZXJyaWRlKCdQcm9wZXJ0aWVzLk92ZXJyaWRlMScsIFsnSGVsbG8nLCAxMjNdKTtcbiAgICAgIHIuYWRkT3ZlcnJpZGUoJ1Byb3BlcnRpZXMuT3ZlcnJpZGUxLk92ZXJyaWRlMicsIHsgSGV5eTogWzFdIH0pO1xuICAgICAgci5hZGRPdmVycmlkZSgnUHJvcGVydGllcy5IZWxsby5Xb3JsZC5Gb28uQmFyJywgNDIpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgICBSZXNvdXJjZXM6XG4gICAgICAgIHtcbiAgICAgICAgICBNeVJlc291cmNlOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFR5cGU6ICdBV1M6OlJlc291cmNlOjpUeXBlJyxcbiAgICAgICAgICAgIFByb3BlcnRpZXM6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEhlbGxvOiB7IFdvcmxkOiB7IEZvbzogeyBCYXI6IDQyIH0gfSB9LFxuICAgICAgICAgICAgICBPdmVycmlkZTE6IHtcbiAgICAgICAgICAgICAgICBPdmVycmlkZTI6IHsgSGV5eTogWzFdIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FkZE92ZXJyaWRlKHAsIHYpIHdpbGwgbm90IHNwbGl0IG9uIGVzY2FwZWQgZG90cycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgciA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ015UmVzb3VyY2UnLCB7IHR5cGU6ICdBV1M6OlJlc291cmNlOjpUeXBlJyB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgci5hZGRPdmVycmlkZShTdHJpbmcucmF3YFByb3BlcnRpZXMuSGVsbG9cXC5Xb3JsZC5Gb29cXC5CYXJcXC5CYXpgLCA0Mik7XG4gICAgICByLmFkZE92ZXJyaWRlKFN0cmluZy5yYXdgUHJvcGVydGllcy5TaW5nbGVcXEJhY2tcXFNsYXNoZXNgLCA0Mik7XG4gICAgICByLmFkZE92ZXJyaWRlKFN0cmluZy5yYXdgUHJvcGVydGllcy5Fc2NhcGVkXFxcXC5CYWNrXFxcXC5TbGFzaGVzYCwgNDIpO1xuICAgICAgci5hZGRPdmVycmlkZShTdHJpbmcucmF3YFByb3BlcnRpZXMuRG91Ymx5RXNjYXBlZFxcXFxcXFxcQmFja1xcXFxcXFxcU2xhc2hlc2AsIDQyKTtcbiAgICAgIHIuYWRkT3ZlcnJpZGUoJ1Byb3BlcnRpZXMuRW5kV2l0aFxcXFwnLCA0Mik7IC8vIFJhdyBzdHJpbmcgY2Fubm90IGVuZCB3aXRoIGEgYmFja3NsYXNoXG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICAgIFJlc291cmNlczpcbiAgICAgICAge1xuICAgICAgICAgIE15UmVzb3VyY2U6XG4gICAgICAgICAge1xuICAgICAgICAgICAgVHlwZTogJ0FXUzo6UmVzb3VyY2U6OlR5cGUnLFxuICAgICAgICAgICAgUHJvcGVydGllczpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0hlbGxvLldvcmxkJzogeyAnRm9vLkJhci5CYXonOiA0MiB9LFxuICAgICAgICAgICAgICAnU2luZ2xlQmFja1NsYXNoZXMnOiA0MixcbiAgICAgICAgICAgICAgJ0VzY2FwZWRcXFxcJzogeyAnQmFja1xcXFwnOiB7IFNsYXNoZXM6IDQyIH0gfSxcbiAgICAgICAgICAgICAgJ0RvdWJseUVzY2FwZWRcXFxcXFxcXEJhY2tcXFxcXFxcXFNsYXNoZXMnOiA0MixcbiAgICAgICAgICAgICAgJ0VuZFdpdGhcXFxcJzogNDIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FkZFByb3BlcnR5T3ZlcnJpZGUocHAsIHYpIGlzIGEgc3VnYXIgZm9yIG92ZXJyaWRpbmcgcHJvcGVydGllcycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgciA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ015UmVzb3VyY2UnLCB7XG4gICAgICAgIHR5cGU6ICdBV1M6OlJlc291cmNlOjpUeXBlJyxcbiAgICAgICAgcHJvcGVydGllczogeyBIZWxsbzogeyBXb3JsZDogNDIgfSB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIHIuYWRkUHJvcGVydHlPdmVycmlkZSgnSGVsbG8uV29ybGQnLCB7IEhleTogJ0p1ZGUnIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgICBSZXNvdXJjZXM6XG4gICAgICAgIHtcbiAgICAgICAgICBNeVJlc291cmNlOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFR5cGU6ICdBV1M6OlJlc291cmNlOjpUeXBlJyxcbiAgICAgICAgICAgIFByb3BlcnRpZXM6IHsgSGVsbG86IHsgV29ybGQ6IHsgSGV5OiAnSnVkZScgfSB9IH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnb3ZlcnJpZGVzIGFyZSBhcHBsaWVkIGFmdGVyIHJlbmRlcicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjbGFzcyBNeVJlc291cmNlIGV4dGVuZHMgQ2ZuUmVzb3VyY2Uge1xuICAgICAgICBwdWJsaWMgcmVuZGVyUHJvcGVydGllcygpIHtcbiAgICAgICAgICByZXR1cm4geyBGaXhlZDogMTIzIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBjZm4gPSBuZXcgTXlSZXNvdXJjZShzdGFjaywgJ3JyJywgeyB0eXBlOiAnQVdTOjpSZXNvdXJjZTo6VHlwZScgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNmbi5hZGRQcm9wZXJ0eU92ZXJyaWRlKCdCb29tJywgJ0hpJyk7XG4gICAgICBjZm4uYWRkT3ZlcnJpZGUoJ1Byb3BlcnRpZXMuRm9vLkJhcicsICdCYXInKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spKS50b0VxdWFsKHtcbiAgICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgICAgcnI6IHtcbiAgICAgICAgICAgIFR5cGU6ICdBV1M6OlJlc291cmNlOjpUeXBlJyxcbiAgICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgRml4ZWQ6IDEyMyxcbiAgICAgICAgICAgICAgQm9vbTogJ0hpJyxcbiAgICAgICAgICAgICAgRm9vOiB7XG4gICAgICAgICAgICAgICAgQmFyOiAnQmFyJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnb3ZlcnJpZGVzIGFsbG93IG92ZXJyaWRpbmcgb25lIGludHJpbnNpYyB3aXRoIGFub3RoZXInLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdNeVJlc291cmNlJywge1xuICAgICAgICB0eXBlOiAnTXlSZXNvdXJjZVR5cGUnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgcHJvcDE6IEZuLnJlZignUGFyYW0nKSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICByZXNvdXJjZS5hZGRQcm9wZXJ0eU92ZXJyaWRlKCdwcm9wMScsIEZuLmpvaW4oJy0nLCBbJ2hlbGxvJywgRm4ucmVmKCdQYXJhbScpXSkpO1xuICAgICAgY29uc3QgY2ZuID0gdG9DbG91ZEZvcm1hdGlvbihzdGFjayk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChjZm4uUmVzb3VyY2VzLk15UmVzb3VyY2UpLnRvRXF1YWwoe1xuICAgICAgICBUeXBlOiAnTXlSZXNvdXJjZVR5cGUnLFxuICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgcHJvcDE6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgJy0nLFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJ2hlbGxvJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdQYXJhbScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnQ2FuIG92ZXJyaWRlIGEgYW4gb2JqZWN0IHdpdGggYW4gaW50cmluc2ljJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IG5ldyBDZm5Db25kaXRpb24oc3RhY2ssICdNeUNvbmRpdGlvbicsIHtcbiAgICAgICAgZXhwcmVzc2lvbjogRm4uY29uZGl0aW9uRXF1YWxzKCd1cy1lYXN0LTEnLCAndXMtZWFzdC0xJyksXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmblJlc291cmNlKHN0YWNrLCAnTXlSZXNvdXJjZScsIHtcbiAgICAgICAgdHlwZTogJ015UmVzb3VyY2VUeXBlJyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHByb3AxOiB7XG4gICAgICAgICAgICBzdWJwcm9wOiB7XG4gICAgICAgICAgICAgIG5hbWU6IEZuLmdldEF0dCgncmVzb3VyY2UnLCAnYWJjJyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGlzRW5hYmxlZCA9IEZuLmNvbmRpdGlvbklmKGNvbmRpdGlvbi5sb2dpY2FsSWQsIHtcbiAgICAgICAgUmVmOiAnQVdTOjpOb1ZhbHVlJyxcbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogRm4uZ2V0QXR0KCdyZXNvdXJjZScsICdhYmMnKSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICByZXNvdXJjZS5hZGRQcm9wZXJ0eU92ZXJyaWRlKCdwcm9wMS5zdWJwcm9wJywgaXNFbmFibGVkKTtcbiAgICAgIGNvbnN0IGNmbiA9IHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoY2ZuLlJlc291cmNlcy5NeVJlc291cmNlKS50b0VxdWFsKHtcbiAgICAgICAgVHlwZTogJ015UmVzb3VyY2VUeXBlJyxcbiAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgIHByb3AxOiB7XG4gICAgICAgICAgICBzdWJwcm9wOiB7XG4gICAgICAgICAgICAgICdGbjo6SWYnOiBbXG4gICAgICAgICAgICAgICAgJ015Q29uZGl0aW9uJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6Ok5vVmFsdWUnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgbmFtZToge1xuICAgICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAncmVzb3VyY2UnLFxuICAgICAgICAgICAgICAgICAgICAgICdhYmMnLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdvdmVycmlkZXMgYWxsb3cgb3ZlcnJpZGluZyBhIG5lc3RlZCBpbnRyaW5zaWMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdNeVJlc291cmNlJywge1xuICAgICAgICB0eXBlOiAnTXlSZXNvdXJjZVR5cGUnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgcHJvcDE6IEZuLmltcG9ydFZhbHVlKEZuLnN1YignJHtTdWJ9JywgeyBTdWI6ICdWYWx1ZScgfSkpLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIHJlc291cmNlLmFkZFByb3BlcnR5T3ZlcnJpZGUoJ3Byb3AxJywgRm4uaW1wb3J0VmFsdWUoRm4uam9pbignLScsIFsnYWJjJywgRm4uc3ViKCcke1N1Yn0nLCB7IFN1YjogJ1ZhbHVlJyB9KV0pKSk7XG4gICAgICBjb25zdCBjZm4gPSB0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KGNmbi5SZXNvdXJjZXMuTXlSZXNvdXJjZSkudG9FcXVhbCh7XG4gICAgICAgIFR5cGU6ICdNeVJlc291cmNlVHlwZScsXG4gICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICBwcm9wMToge1xuICAgICAgICAgICAgJ0ZuOjpJbXBvcnRWYWx1ZSc6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICctJyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAnYWJjJyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJ0ZuOjpTdWInOiBbJyR7U3VifScsIHsgU3ViOiAnVmFsdWUnIH1dLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgndXNpbmcgbXV0YWJsZSBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgICAgdGVzdCgnY2FuIGJlIHVzZWQgYnkgZGVyaXZlZCBjbGFzc2VzIHRvIHNwZWNpZnkgb3ZlcnJpZGVzIGJlZm9yZSByZW5kZXIoKScsICgpID0+IHtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgICBjb25zdCByID0gbmV3IEN1c3RvbWl6YWJsZVJlc291cmNlKHN0YWNrLCAnTXlSZXNvdXJjZScsIHtcbiAgICAgICAgICBwcm9wMTogJ2ZvbycsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHIucHJvcDIgPSAnYmFyJztcblxuICAgICAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgICAgIFJlc291cmNlczpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBNeVJlc291cmNlOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBUeXBlOiAnTXlSZXNvdXJjZVR5cGUnLFxuICAgICAgICAgICAgICBQcm9wZXJ0aWVzOiB7IFBST1AxOiAnZm9vJywgUFJPUDI6ICdiYXInIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ1wicHJvcGVydGllc1wiIGlzIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgICBjb25zdCByID0gbmV3IEN1c3RvbWl6YWJsZVJlc291cmNlKHN0YWNrLCAnTXlSZXNvdXJjZScpO1xuXG4gICAgICAgIHIucHJvcDMgPSAnem9vJztcblxuICAgICAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgICAgIFJlc291cmNlczpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBNeVJlc291cmNlOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBUeXBlOiAnTXlSZXNvdXJjZVR5cGUnLFxuICAgICAgICAgICAgICBQcm9wZXJ0aWVzOiB7IFBST1AzOiAnem9vJyB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdcInByb3BlcnRpZXNcIiBpcyBlbXB0eScsICgpID0+IHtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgICBjb25zdCByID0gbmV3IEN1c3RvbWl6YWJsZVJlc291cmNlKHN0YWNrLCAnTXlSZXNvdXJjZScsIHsgfSk7XG5cbiAgICAgICAgci5wcm9wMyA9ICd6b28nO1xuICAgICAgICByLnByb3AyID0gJ2hleSc7XG5cbiAgICAgICAgZXhwZWN0KHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spKS50b0VxdWFsKHtcbiAgICAgICAgICBSZXNvdXJjZXM6XG4gICAgICAgICAge1xuICAgICAgICAgICAgTXlSZXNvdXJjZTpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgVHlwZTogJ015UmVzb3VyY2VUeXBlJyxcbiAgICAgICAgICAgICAgUHJvcGVydGllczogeyBQUk9QMjogJ2hleScsIFBST1AzOiAnem9vJyB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdcImF3czpjZGs6cGF0aFwiIG1ldGFkYXRhIGlzIGFkZGVkIGlmIFwiYXdzOmNkazpwYXRoLW1ldGFkYXRhXCIgY29udGV4dCBpcyBzZXQgdG8gdHJ1ZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIHN0YWNrLm5vZGUuc2V0Q29udGV4dChjeGFwaS5QQVRIX01FVEFEQVRBX0VOQUJMRV9DT05URVhULCB0cnVlKTtcblxuICAgIGNvbnN0IHBhcmVudCA9IG5ldyBDb25zdHJ1Y3Qoc3RhY2ssICdQYXJlbnQnKTtcblxuICAgIG5ldyBDZm5SZXNvdXJjZShwYXJlbnQsICdNeVJlc291cmNlJywge1xuICAgICAgdHlwZTogJ015UmVzb3VyY2VUeXBlJyxcbiAgICB9KTtcblxuICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICBSZXNvdXJjZXM6XG4gICAgICB7XG4gICAgICAgIFBhcmVudE15UmVzb3VyY2U0QjFGREJDQzpcbiAgICAgICAgIHtcbiAgICAgICAgICAgVHlwZTogJ015UmVzb3VyY2VUeXBlJyxcbiAgICAgICAgICAgTWV0YWRhdGE6IHsgW2N4YXBpLlBBVEhfTUVUQURBVEFfS0VZXTogJ0RlZmF1bHQvUGFyZW50L015UmVzb3VyY2UnIH0sXG4gICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3Jvc3Mtc3RhY2sgY29uc3RydWN0IGRlcGVuZGVuY2llcyBhcmUgbm90IHJlbmRlcmVkIGJ1dCB0dXJuZWQgaW50byBzdGFjayBkZXBlbmRlbmNpZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2tBID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrQScpO1xuICAgIGNvbnN0IHJlc0EgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2tBLCAnUmVzb3VyY2UnLCB7IHR5cGU6ICdSJyB9KTtcbiAgICBjb25zdCBzdGFja0IgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2tCJyk7XG4gICAgY29uc3QgcmVzQiA9IG5ldyBDZm5SZXNvdXJjZShzdGFja0IsICdSZXNvdXJjZScsIHsgdHlwZTogJ1InIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIHJlc0Iubm9kZS5hZGREZXBlbmRlbmN5KHJlc0EpO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgY29uc3QgdGVtcGxhdGVCID0gYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoc3RhY2tCLnN0YWNrTmFtZSkudGVtcGxhdGU7XG5cbiAgICBleHBlY3QodGVtcGxhdGVCPy5SZXNvdXJjZXM/LlJlc291cmNlKS50b0VxdWFsKHtcbiAgICAgIFR5cGU6ICdSJyxcbiAgICAgIC8vIE5vdGljZSBhYnNlbmNlIG9mICdEZXBlbmRzT24nXG4gICAgfSk7XG4gICAgZXhwZWN0KHN0YWNrQi5kZXBlbmRlbmNpZXMubWFwKHMgPT4gcy5ub2RlLmlkKSkudG9FcXVhbChbJ1N0YWNrQSddKTtcbiAgfSk7XG5cbiAgdGVzdCgnZW5hYmxlVmVyc2lvblVwZ3JhZGUgY2FuIGJlIHNldCBvbiBhIHJlc291cmNlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgcjEgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZXNvdXJjZScsIHsgdHlwZTogJ1R5cGUnIH0pO1xuXG4gICAgcjEuY2ZuT3B0aW9ucy51cGRhdGVQb2xpY3kgPSB7XG4gICAgICBlbmFibGVWZXJzaW9uVXBncmFkZTogdHJ1ZSxcbiAgICB9O1xuXG4gICAgZXhwZWN0KHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spKS50b0VxdWFsKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgIFR5cGU6ICdUeXBlJyxcbiAgICAgICAgICBVcGRhdGVQb2xpY3k6IHtcbiAgICAgICAgICAgIEVuYWJsZVZlcnNpb25VcGdyYWRlOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG50ZXN0KCdSZXNvdXJjZSBjYW4gZ2V0IGFjY291bnQgYW5kIFJlZ2lvbiBmcm9tIEFSTicsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAvLyBXSEVOXG4gIGNvbnN0IHJlc291cmNlID0gbmV3IFRlc3RSZXNvdXJjZShzdGFjaywgJ1Jlc291cmNlJywge1xuICAgIGVudmlyb25tZW50RnJvbUFybjogJ2FybjpwYXJ0aXRpb246c2VydmljZTpyZWdpb246YWNjb3VudDpyZWxhdGl2ZS1pZCcsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KHJlc291cmNlLmVudi5hY2NvdW50KS50b0VxdWFsKCdhY2NvdW50Jyk7XG4gIGV4cGVjdChyZXNvdXJjZS5lbnYucmVnaW9uKS50b0VxdWFsKCdyZWdpb24nKTtcbn0pO1xuXG5pbnRlcmZhY2UgQ291bnRlclByb3BzIHtcbiAgQ291bnQ6IG51bWJlcjtcbn1cblxuY2xhc3MgQ291bnRlciBleHRlbmRzIENmblJlc291cmNlIHtcbiAgcHVibGljIHJlYWRvbmx5IGFybjogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgdXJsOiBzdHJpbmc7XG5cbiAgcHVibGljIGNvdW50OiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENvdW50ZXJQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiAnTXk6OkNvdW50ZXInLCBwcm9wZXJ0aWVzOiB7IENvdW50OiBwcm9wcy5Db3VudCB9IH0pO1xuICAgIHRoaXMuYXJuID0gdGhpcy5nZXRBdHQoJ0FybicpLnRvU3RyaW5nKCk7XG4gICAgdGhpcy51cmwgPSB0aGlzLmdldEF0dCgnVVJMJykudG9TdHJpbmcoKTtcbiAgICB0aGlzLmNvdW50ID0gcHJvcHMuQ291bnQ7XG4gIH1cblxuICBwdWJsaWMgaW5jcmVtZW50KGJ5ID0gMSkge1xuICAgIHRoaXMuY291bnQgKz0gYnk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IGNmblByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gICAgcmV0dXJuIHsgQ291bnQ6IHRoaXMuY291bnQgfTtcbiAgfVxufVxuXG5mdW5jdGlvbiB3aXRob3V0SGFzaChsb2dJZDogc3RyaW5nKSB7XG4gIHJldHVybiBsb2dJZC5zbGljZSgwLCAtOCk7XG59XG5cbmNsYXNzIEN1c3RvbWl6YWJsZVJlc291cmNlIGV4dGVuZHMgQ2ZuUmVzb3VyY2Uge1xuICBwdWJsaWMgcHJvcDE6IGFueTtcbiAgcHVibGljIHByb3AyOiBhbnk7XG4gIHB1YmxpYyBwcm9wMzogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogYW55KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7IHR5cGU6ICdNeVJlc291cmNlVHlwZScsIHByb3BlcnRpZXM6IHByb3BzIH0pO1xuICAgIGlmIChwcm9wcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnByb3AxID0gcHJvcHMucHJvcDE7XG4gICAgICB0aGlzLnByb3AyID0gcHJvcHMucHJvcDI7XG4gICAgICB0aGlzLnByb3AzID0gcHJvcHMucHJvcDM7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlbmRlclByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gICAgY29uc3QgcHJvcHMgPSB0aGlzLnVwZGF0ZWRQcm9wZXJ0aWVzO1xuICAgIGNvbnN0IHJlbmRlcjogeyBba2V5OiBzdHJpbmddOiBhbnkgfSA9IHt9O1xuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHByb3BzKSkge1xuICAgICAgcmVuZGVyW2tleS50b1VwcGVyQ2FzZSgpXSA9IHByb3BzW2tleV07XG4gICAgfVxuICAgIHJldHVybiByZW5kZXI7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IHVwZGF0ZWRQcm9wZXJ0aWVzKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0ge1xuICAgIGNvbnN0IHByb3BzOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ID0ge1xuICAgICAgcHJvcDE6IHRoaXMucHJvcDEsXG4gICAgICBwcm9wMjogdGhpcy5wcm9wMixcbiAgICAgIHByb3AzOiB0aGlzLnByb3AzLFxuICAgIH07XG4gICAgY29uc3QgY2xlYW5Qcm9wczogeyBba2V5OiBzdHJpbmddOiBhbnkgfSA9IHsgfTtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhwcm9wcykpIHtcbiAgICAgIGlmIChwcm9wc1trZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBjbGVhblByb3BzW2tleV0gPSBwcm9wc1trZXldO1xuICAgIH1cbiAgICByZXR1cm4gY2xlYW5Qcm9wcztcbiAgfVxufVxuXG4vKipcbiAqIEJlY2F1c2UgUmVzb3VyY2UgaXMgYWJzdHJhY3RcbiAqL1xuY2xhc3MgVGVzdFJlc291cmNlIGV4dGVuZHMgUmVzb3VyY2Uge31cbiJdfQ==