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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlc291cmNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBeUM7QUFDekMsMkNBQXVDO0FBQ3ZDLGlDQUEwQztBQUMxQyxnQ0FJZ0I7QUFDaEIsd0RBQXNEO0FBRXRELFFBQVEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFO0lBQ3hCLElBQUksQ0FBQywrREFBK0QsRUFBRSxHQUFHLEVBQUU7UUFDekUsTUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFLLEVBQUUsQ0FBQztRQUUxQixJQUFJLGlCQUFXLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtZQUNuQyxJQUFJLEVBQUUsZ0JBQWdCO1lBQ3RCLFVBQVUsRUFBRTtnQkFDVixLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHO2FBQ3hCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLElBQUEsdUJBQWdCLEVBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDdEMsU0FBUyxFQUFFO2dCQUNULFVBQVUsRUFBRTtvQkFDVixJQUFJLEVBQUUsZ0JBQWdCO29CQUN0QixVQUFVLEVBQUU7d0JBQ1YsS0FBSyxFQUFFLElBQUk7d0JBQ1gsS0FBSyxFQUFFLEdBQUc7cUJBQ1g7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG9FQUFvRSxFQUFFLEdBQUcsRUFBRTtRQUM5RSxNQUFNLElBQUksR0FBRyxJQUFJLFNBQUksRUFBRSxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLGlCQUFXLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDaEYsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsZ0ZB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SyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3hDO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVELElBQWMsaUJBQWlCO1FBQzdCLE1BQU0sS0FBSyxHQUEyQjtZQUNwQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDakIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztTQUNsQixDQUFDO1FBQ0YsTUFBTSxVQUFVLEdBQTJCLEVBQUcsQ0FBQztRQUMvQyxLQUFLLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDcEMsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssU0FBUyxFQUFFO2dCQUM1QixTQUFTO2FBQ1Y7WUFDRCxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzlCO1FBQ0QsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQztDQUNGO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLFlBQWEsU0FBUSxjQUFRO0NBQUciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyB0b0Nsb3VkRm9ybWF0aW9uIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7XG4gIEFwcCwgQXBwIGFzIFJvb3QsIENmbkNvbmRpdGlvbixcbiAgQ2ZuRGVsZXRpb25Qb2xpY3ksIENmblJlc291cmNlLFxuICBGbiwgSVJlc291cmNlLCBSZW1vdmFsUG9saWN5LCBSZXNvdXJjZSwgU3RhY2ssXG59IGZyb20gJy4uL2xpYic7XG5pbXBvcnQgeyBzeW50aGVzaXplIH0gZnJvbSAnLi4vbGliL3ByaXZhdGUvc3ludGhlc2lzJztcblxuZGVzY3JpYmUoJ3Jlc291cmNlJywgKCkgPT4ge1xuICB0ZXN0KCdhbGwgcmVzb3VyY2VzIGRlcml2ZSBmcm9tIFJlc291cmNlLCB3aGljaCBkZXJpdmVzIGZyb20gRW50aXR5JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdNeVJlc291cmNlJywge1xuICAgICAgdHlwZTogJ015UmVzb3VyY2VUeXBlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgUHJvcDE6ICdwMScsIFByb3AyOiAxMjMsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spKS50b0VxdWFsKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBNeVJlc291cmNlOiB7XG4gICAgICAgICAgVHlwZTogJ015UmVzb3VyY2VUeXBlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBQcm9wMTogJ3AxJyxcbiAgICAgICAgICAgIFByb3AyOiAxMjMsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Jlc291cmNlcyBtdXN0IHJlc2lkZSB3aXRoaW4gYSBTdGFjayBhbmQgZmFpbCB1cG9uIGNyZWF0aW9uIGlmIG5vdCcsICgpID0+IHtcbiAgICBjb25zdCByb290ID0gbmV3IFJvb3QoKTtcbiAgICBleHBlY3QoKCkgPT4gbmV3IENmblJlc291cmNlKHJvb3QsICdSMScsIHsgdHlwZTogJ1Jlc291cmNlVHlwZScgfSkpLnRvVGhyb3coKTtcbiAgfSk7XG5cbiAgdGVzdCgnYWxsIGVudGl0aWVzIGhhdmUgYSBsb2dpY2FsIElEIGNhbGN1bGF0ZWQgYmFzZWQgb24gdGhlaXIgZnVsbCBwYXRoIGluIHRoZSB0cmVlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgJ1Rlc3RTdGFjaycpO1xuICAgIGNvbnN0IGxldmVsMSA9IG5ldyBDb25zdHJ1Y3Qoc3RhY2ssICdsZXZlbDEnKTtcbiAgICBjb25zdCBsZXZlbDIgPSBuZXcgQ29uc3RydWN0KGxldmVsMSwgJ2xldmVsMicpO1xuICAgIGNvbnN0IGxldmVsMyA9IG5ldyBDb25zdHJ1Y3QobGV2ZWwyLCAnbGV2ZWwzJyk7XG4gICAgY29uc3QgcmVzMSA9IG5ldyBDZm5SZXNvdXJjZShsZXZlbDEsICdjaGlsZG9mbGV2ZWwxJywgeyB0eXBlOiAnTXlSZXNvdXJjZVR5cGUxJyB9KTtcbiAgICBjb25zdCByZXMyID0gbmV3IENmblJlc291cmNlKGxldmVsMywgJ2NoaWxkb2ZsZXZlbDMnLCB7IHR5cGU6ICdNeVJlc291cmNlVHlwZTInIH0pO1xuXG4gICAgZXhwZWN0KHdpdGhvdXRIYXNoKHN0YWNrLnJlc29sdmUocmVzMS5sb2dpY2FsSWQpKSkudG9FcXVhbCgnbGV2ZWwxY2hpbGRvZmxldmVsMScpO1xuICAgIGV4cGVjdCh3aXRob3V0SGFzaChzdGFjay5yZXNvbHZlKHJlczIubG9naWNhbElkKSkpLnRvRXF1YWwoJ2xldmVsMWxldmVsMmxldmVsM2NoaWxkb2ZsZXZlbDMnKTtcbiAgfSk7XG5cbiAgdGVzdCgncmVzb3VyY2UucHJvcHMgY2FuIG9ubHkgYmUgYWNjZXNzZWQgYnkgZGVyaXZlZCBjbGFzc2VzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgcmVzID0gbmV3IENvdW50ZXIoc3RhY2ssICdNeVJlc291cmNlJywgeyBDb3VudDogMTAgfSk7XG4gICAgcmVzLmluY3JlbWVudCgpO1xuICAgIHJlcy5pbmNyZW1lbnQoMik7XG5cbiAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIE15UmVzb3VyY2U6IHsgVHlwZTogJ015OjpDb3VudGVyJywgUHJvcGVydGllczogeyBDb3VudDogMTMgfSB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncmVzb3VyY2UgYXR0cmlidXRlcyBjYW4gYmUgcmV0cmlldmVkIHVzaW5nIGdldEF0dChzKSBvciBhdHRyaWJ1dGUgcHJvcGVydGllcycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHJlcyA9IG5ldyBDb3VudGVyKHN0YWNrLCAnTXlSZXNvdXJjZScsIHsgQ291bnQ6IDEwIH0pO1xuXG4gICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnWW91clJlc291cmNlJywge1xuICAgICAgdHlwZTogJ1R5cGUnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBDb3VudGVyTmFtZTogcmVzLmdldEF0dCgnTmFtZScpLFxuICAgICAgICBDb3VudGVyQXJuOiByZXMuYXJuLFxuICAgICAgICBDb3VudGVyVVJMOiByZXMudXJsLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgTXlSZXNvdXJjZTogeyBUeXBlOiAnTXk6OkNvdW50ZXInLCBQcm9wZXJ0aWVzOiB7IENvdW50OiAxMCB9IH0sXG4gICAgICAgIFlvdXJSZXNvdXJjZToge1xuICAgICAgICAgIFR5cGU6ICdUeXBlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBDb3VudGVyTmFtZTogeyAnRm46OkdldEF0dCc6IFsnTXlSZXNvdXJjZScsICdOYW1lJ10gfSxcbiAgICAgICAgICAgIENvdW50ZXJBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ015UmVzb3VyY2UnLCAnQXJuJ10gfSxcbiAgICAgICAgICAgIENvdW50ZXJVUkw6IHsgJ0ZuOjpHZXRBdHQnOiBbJ015UmVzb3VyY2UnLCAnVVJMJ10gfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQVJOLXR5cGUgcmVzb3VyY2UgYXR0cmlidXRlcyBoYXZlIHNvbWUgY29tbW9uIGZ1bmN0aW9uYWxpdHknLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCByZXMgPSBuZXcgQ291bnRlcihzdGFjaywgJ015UmVzb3VyY2UnLCB7IENvdW50OiAxIH0pO1xuICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ015UmVzb3VyY2UyJywge1xuICAgICAgdHlwZTogJ1R5cGUnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBQZXJtOiByZXMuYXJuLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgTXlSZXNvdXJjZTogeyBUeXBlOiAnTXk6OkNvdW50ZXInLCBQcm9wZXJ0aWVzOiB7IENvdW50OiAxIH0gfSxcbiAgICAgICAgTXlSZXNvdXJjZTI6IHtcbiAgICAgICAgICBUeXBlOiAnVHlwZScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgUGVybToge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFsnTXlSZXNvdXJjZScsICdBcm4nXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Jlc291cmNlLmFkZERlcGVuZGVuY3koZSkgY2FuIGJlIHVzZWQgdG8gYWRkIGEgRGVwZW5kc09uIG9uIGFub3RoZXIgcmVzb3VyY2UnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCByMSA9IG5ldyBDb3VudGVyKHN0YWNrLCAnQ291bnRlcjEnLCB7IENvdW50OiAxIH0pO1xuICAgIGNvbnN0IHIyID0gbmV3IENvdW50ZXIoc3RhY2ssICdDb3VudGVyMicsIHsgQ291bnQ6IDEgfSk7XG4gICAgY29uc3QgcjMgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZXNvdXJjZTMnLCB7IHR5cGU6ICdNeVJlc291cmNlVHlwZScgfSk7XG4gICAgcjIubm9kZS5hZGREZXBlbmRlbmN5KHIxKTtcbiAgICByMi5ub2RlLmFkZERlcGVuZGVuY3kocjMpO1xuXG4gICAgc3ludGhlc2l6ZShzdGFjayk7XG5cbiAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIENvdW50ZXIxOiB7XG4gICAgICAgICAgVHlwZTogJ015OjpDb3VudGVyJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7IENvdW50OiAxIH0sXG4gICAgICAgIH0sXG4gICAgICAgIENvdW50ZXIyOiB7XG4gICAgICAgICAgVHlwZTogJ015OjpDb3VudGVyJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7IENvdW50OiAxIH0sXG4gICAgICAgICAgRGVwZW5kc09uOiBbXG4gICAgICAgICAgICAnQ291bnRlcjEnLFxuICAgICAgICAgICAgJ1Jlc291cmNlMycsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgUmVzb3VyY2UzOiB7IFR5cGU6ICdNeVJlc291cmNlVHlwZScgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2lmIGFkZERlcGVuZGVuY3kgaXMgY2FsbGVkIG11bHRpcGxlIHRpbWVzIHdpdGggdGhlIHNhbWUgcmVzb3VyY2UsIGl0IHdpbGwgb25seSBhcHBlYXIgb25jZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgcjEgPSBuZXcgQ291bnRlcihzdGFjaywgJ0NvdW50ZXIxJywgeyBDb3VudDogMSB9KTtcbiAgICBjb25zdCBkZXBlbmRlbnQgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdEZXBlbmRlbnQnLCB7IHR5cGU6ICdSJyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBkZXBlbmRlbnQuYWRkRGVwZW5kZW5jeShyMSk7XG4gICAgZGVwZW5kZW50LmFkZERlcGVuZGVuY3kocjEpO1xuICAgIGRlcGVuZGVudC5hZGREZXBlbmRlbmN5KHIxKTtcbiAgICBkZXBlbmRlbnQuYWRkRGVwZW5kZW5jeShyMSk7XG4gICAgZGVwZW5kZW50LmFkZERlcGVuZGVuY3kocjEpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgQ291bnRlcjE6IHtcbiAgICAgICAgICBUeXBlOiAnTXk6OkNvdW50ZXInLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIENvdW50OiAxLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIERlcGVuZGVudDoge1xuICAgICAgICAgIFR5cGU6ICdSJyxcbiAgICAgICAgICBEZXBlbmRzT246IFtcbiAgICAgICAgICAgICdDb3VudGVyMScsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NvbmRpdGlvbnMgY2FuIGJlIGF0dGFjaGVkIHRvIGEgcmVzb3VyY2UnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCByMSA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ1Jlc291cmNlJywgeyB0eXBlOiAnVHlwZScgfSk7XG4gICAgY29uc3QgY29uZCA9IG5ldyBDZm5Db25kaXRpb24oc3RhY2ssICdNeUNvbmRpdGlvbicsIHsgZXhwcmVzc2lvbjogRm4uY29uZGl0aW9uTm90KEZuLmNvbmRpdGlvbkVxdWFscygnYScsICdiJykpIH0pO1xuICAgIHIxLmNmbk9wdGlvbnMuY29uZGl0aW9uID0gY29uZDtcblxuICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICBSZXNvdXJjZXM6IHsgUmVzb3VyY2U6IHsgVHlwZTogJ1R5cGUnLCBDb25kaXRpb246ICdNeUNvbmRpdGlvbicgfSB9LFxuICAgICAgQ29uZGl0aW9uczogeyBNeUNvbmRpdGlvbjogeyAnRm46Ok5vdCc6IFt7ICdGbjo6RXF1YWxzJzogWydhJywgJ2InXSB9XSB9IH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0aW9uL3VwZGF0ZS91cGRhdGVSZXBsYWNlL2RlbGV0aW9uIHBvbGljaWVzIGNhbiBiZSBzZXQgb24gYSByZXNvdXJjZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHIxID0gbmV3IENmblJlc291cmNlKHN0YWNrLCAnUmVzb3VyY2UnLCB7IHR5cGU6ICdUeXBlJyB9KTtcblxuICAgIHIxLmNmbk9wdGlvbnMuY3JlYXRpb25Qb2xpY3kgPSB7XG4gICAgICBhdXRvU2NhbGluZ0NyZWF0aW9uUG9saWN5OiB7IG1pblN1Y2Nlc3NmdWxJbnN0YW5jZXNQZXJjZW50OiAxMCB9LFxuICAgICAgc3RhcnRGbGVldDogdHJ1ZSxcbiAgICB9O1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgcjEuY2ZuT3B0aW9ucy51cGRhdGVQb2xpY3kgPSB7XG4gICAgICBhdXRvU2NhbGluZ1NjaGVkdWxlZEFjdGlvbjogeyBpZ25vcmVVbm1vZGlmaWVkR3JvdXBTaXplUHJvcGVydGllczogZmFsc2UgfSxcbiAgICAgIGF1dG9TY2FsaW5nUmVwbGFjaW5nVXBkYXRlOiB7IHdpbGxSZXBsYWNlOiB0cnVlIH0sXG4gICAgICBjb2RlRGVwbG95TGFtYmRhQWxpYXNVcGRhdGU6IHtcbiAgICAgICAgYXBwbGljYXRpb25OYW1lOiAnQ29kZURlcGxveUFwcGxpY2F0aW9uJyxcbiAgICAgICAgZGVwbG95bWVudEdyb3VwTmFtZTogJ0NvZGVEZXBsb3lEZXBsb3ltZW50R3JvdXAnLFxuICAgICAgICBiZWZvcmVBbGxvd1RyYWZmaWNIb29rOiAnbGFtYmRhMScsXG4gICAgICB9LFxuICAgIH07XG4gICAgcjEuY2ZuT3B0aW9ucy5kZWxldGlvblBvbGljeSA9IENmbkRlbGV0aW9uUG9saWN5LlJFVEFJTjtcbiAgICByMS5jZm5PcHRpb25zLnVwZGF0ZVJlcGxhY2VQb2xpY3kgPSBDZm5EZWxldGlvblBvbGljeS5TTkFQU0hPVDtcblxuICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICBUeXBlOiAnVHlwZScsXG4gICAgICAgICAgQ3JlYXRpb25Qb2xpY3k6IHtcbiAgICAgICAgICAgIEF1dG9TY2FsaW5nQ3JlYXRpb25Qb2xpY3k6IHsgTWluU3VjY2Vzc2Z1bEluc3RhbmNlc1BlcmNlbnQ6IDEwIH0sXG4gICAgICAgICAgICBTdGFydEZsZWV0OiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgVXBkYXRlUG9saWN5OiB7XG4gICAgICAgICAgICBBdXRvU2NhbGluZ1NjaGVkdWxlZEFjdGlvbjogeyBJZ25vcmVVbm1vZGlmaWVkR3JvdXBTaXplUHJvcGVydGllczogZmFsc2UgfSxcbiAgICAgICAgICAgIEF1dG9TY2FsaW5nUmVwbGFjaW5nVXBkYXRlOiB7IFdpbGxSZXBsYWNlOiB0cnVlIH0sXG4gICAgICAgICAgICBDb2RlRGVwbG95TGFtYmRhQWxpYXNVcGRhdGU6IHtcbiAgICAgICAgICAgICAgQXBwbGljYXRpb25OYW1lOiAnQ29kZURlcGxveUFwcGxpY2F0aW9uJyxcbiAgICAgICAgICAgICAgRGVwbG95bWVudEdyb3VwTmFtZTogJ0NvZGVEZXBsb3lEZXBsb3ltZW50R3JvdXAnLFxuICAgICAgICAgICAgICBCZWZvcmVBbGxvd1RyYWZmaWNIb29rOiAnbGFtYmRhMScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgRGVsZXRpb25Qb2xpY3k6ICdSZXRhaW4nLFxuICAgICAgICAgIFVwZGF0ZVJlcGxhY2VQb2xpY3k6ICdTbmFwc2hvdCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd1cGRhdGUgcG9saWNpZXMgVXNlT25saW5lUmVzaGFyZGluZyBmbGFnJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgcjEgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZXNvdXJjZScsIHsgdHlwZTogJ1R5cGUnIH0pO1xuXG4gICAgcjEuY2ZuT3B0aW9ucy51cGRhdGVQb2xpY3kgPSB7IHVzZU9ubGluZVJlc2hhcmRpbmc6IHRydWUgfTtcblxuICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICBUeXBlOiAnVHlwZScsXG4gICAgICAgICAgVXBkYXRlUG9saWN5OiB7XG4gICAgICAgICAgICBVc2VPbmxpbmVSZXNoYXJkaW5nOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdtZXRhZGF0YSBjYW4gYmUgc2V0IG9uIGEgcmVzb3VyY2UnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCByMSA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ1Jlc291cmNlJywgeyB0eXBlOiAnVHlwZScgfSk7XG5cbiAgICByMS5jZm5PcHRpb25zLm1ldGFkYXRhID0ge1xuICAgICAgTXlLZXk6IDEwLFxuICAgICAgTXlWYWx1ZTogOTksXG4gICAgfTtcblxuICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICBUeXBlOiAnVHlwZScsXG4gICAgICAgICAgTWV0YWRhdGE6IHtcbiAgICAgICAgICAgIE15S2V5OiAxMCxcbiAgICAgICAgICAgIE15VmFsdWU6IDk5LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0aGUgXCJ0eXBlXCIgcHJvcGVydHkgaXMgcmVxdWlyZWQgd2hlbiBjcmVhdGluZyBhIHJlc291cmNlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgZXhwZWN0KCgpID0+IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ1Jlc291cmNlJywgeyBub3R5cGVoZXJlOiB0cnVlIH0gYXMgYW55KSkudG9UaHJvdygpO1xuICB9KTtcblxuICB0ZXN0KCdyZW1vdmFsIHBvbGljeSBpcyBhIGhpZ2ggbGV2ZWwgYWJzdHJhY3Rpb24gb2YgZGVsZXRpb24gcG9saWN5IHVzZWQgYnkgbDInLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IHJldGFpbiA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ1JldGFpbicsIHsgdHlwZTogJ1QxJyB9KTtcbiAgICBjb25zdCBkZXN0cm95ID0gbmV3IENmblJlc291cmNlKHN0YWNrLCAnRGVzdHJveScsIHsgdHlwZTogJ1QzJyB9KTtcbiAgICBjb25zdCBkZWYgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdEZWZhdWx0MScsIHsgdHlwZTogJ1Q0JyB9KTtcbiAgICBjb25zdCBkZWYyID0gbmV3IENmblJlc291cmNlKHN0YWNrLCAnRGVmYXVsdDInLCB7IHR5cGU6ICdUNCcgfSk7XG5cbiAgICByZXRhaW4uYXBwbHlSZW1vdmFsUG9saWN5KFJlbW92YWxQb2xpY3kuUkVUQUlOKTtcbiAgICBkZXN0cm95LmFwcGx5UmVtb3ZhbFBvbGljeShSZW1vdmFsUG9saWN5LkRFU1RST1kpO1xuICAgIGRlZi5hcHBseVJlbW92YWxQb2xpY3kodW5kZWZpbmVkLCB7IGRlZmF1bHQ6IFJlbW92YWxQb2xpY3kuREVTVFJPWSB9KTtcbiAgICBkZWYyLmFwcGx5UmVtb3ZhbFBvbGljeSh1bmRlZmluZWQpO1xuXG4gICAgZXhwZWN0KHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spKS50b0VxdWFsKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBSZXRhaW46IHsgVHlwZTogJ1QxJywgRGVsZXRpb25Qb2xpY3k6ICdSZXRhaW4nLCBVcGRhdGVSZXBsYWNlUG9saWN5OiAnUmV0YWluJyB9LFxuICAgICAgICBEZXN0cm95OiB7IFR5cGU6ICdUMycsIERlbGV0aW9uUG9saWN5OiAnRGVsZXRlJywgVXBkYXRlUmVwbGFjZVBvbGljeTogJ0RlbGV0ZScgfSxcbiAgICAgICAgRGVmYXVsdDE6IHsgVHlwZTogJ1Q0JywgRGVsZXRpb25Qb2xpY3k6ICdEZWxldGUnLCBVcGRhdGVSZXBsYWNlUG9saWN5OiAnRGVsZXRlJyB9LCAvLyBleHBsaWNpdCBkZWZhdWx0XG4gICAgICAgIERlZmF1bHQyOiB7IFR5cGU6ICdUNCcsIERlbGV0aW9uUG9saWN5OiAnUmV0YWluJywgVXBkYXRlUmVwbGFjZVBvbGljeTogJ1JldGFpbicgfSwgLy8gaW1wbGljaXQgZGVmYXVsdFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYXBwbHlSZW1vdmFsUG9saWN5IGF2YWlsYWJsZSBmb3IgaW50ZXJmYWNlIHJlc291cmNlcycsICgpID0+IHtcbiAgICBjbGFzcyBDaGlsZCBleHRlbmRzIFJlc291cmNlIHtcbiAgICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgICAgICBuZXcgQ2ZuUmVzb3VyY2UodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgICAgIHR5cGU6ICdDaGlsZFJlc291cmNlVHlwZScsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgY2hpbGQ6IElSZXNvdXJjZSA9IG5ldyBDaGlsZChzdGFjaywgJ0NoaWxkJyk7XG5cbiAgICBjaGlsZC5hcHBseVJlbW92YWxQb2xpY3koUmVtb3ZhbFBvbGljeS5SRVRBSU4pO1xuXG4gICAgZXhwZWN0KHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spKS50b0VxdWFsKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBDaGlsZERBQjMwNTU4OiB7XG4gICAgICAgICAgRGVsZXRpb25Qb2xpY3k6ICdSZXRhaW4nLFxuICAgICAgICAgIFR5cGU6ICdDaGlsZFJlc291cmNlVHlwZScsXG4gICAgICAgICAgVXBkYXRlUmVwbGFjZVBvbGljeTogJ1JldGFpbicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhZGREZXBlbmRlbmN5IGFkZHMgYWxsIGRlcGVuZGVuY3lFbGVtZW50cyBvZiBkZXBlbmRlbnQgY29uc3RydWN0cycsICgpID0+IHtcblxuICAgIGNsYXNzIEMxIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgICAgIHB1YmxpYyByZWFkb25seSByMTogQ2ZuUmVzb3VyY2U7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcjI6IENmblJlc291cmNlO1xuXG4gICAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAgICAgdGhpcy5yMSA9IG5ldyBDZm5SZXNvdXJjZSh0aGlzLCAnUjEnLCB7IHR5cGU6ICdUMScgfSk7XG4gICAgICAgIHRoaXMucjIgPSBuZXcgQ2ZuUmVzb3VyY2UodGhpcywgJ1IyJywgeyB0eXBlOiAnVDInIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNsYXNzIEMyIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgICAgIHB1YmxpYyByZWFkb25seSByMzogQ2ZuUmVzb3VyY2U7XG5cbiAgICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgICAgICB0aGlzLnIzID0gbmV3IENmblJlc291cmNlKHRoaXMsICdSMycsIHsgdHlwZTogJ1QzJyB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDMyByZXR1cm5zIFsgYzIgXSBmb3IgaXQncyBkZXBlbmRlbmN5IGVsZW1lbnRzXG4gICAgLy8gdGhpcyBzaG91bGQgcmVzdWx0IGluICdmbGF0dGVuaW5nJyB0aGUgbGlzdCBvZiBlbGVtZW50cy5cbiAgICBjbGFzcyBDMyBleHRlbmRzIENvbnN0cnVjdCB7XG4gICAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAgICAgbmV3IEMyKHRoaXMsICdDMicpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgYzEgPSBuZXcgQzEoc3RhY2ssICdNeUMxJyk7XG4gICAgY29uc3QgYzIgPSBuZXcgQzIoc3RhY2ssICdNeUMyJyk7XG4gICAgY29uc3QgYzMgPSBuZXcgQzMoc3RhY2ssICdNeUMzJyk7XG5cbiAgICBjb25zdCBkZXBlbmRpbmdSZXNvdXJjZSA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ015UmVzb3VyY2UnLCB7IHR5cGU6ICdSJyB9KTtcbiAgICBkZXBlbmRpbmdSZXNvdXJjZS5ub2RlLmFkZERlcGVuZGVuY3koYzEsIGMyKTtcbiAgICBkZXBlbmRpbmdSZXNvdXJjZS5ub2RlLmFkZERlcGVuZGVuY3koYzMpO1xuXG4gICAgc3ludGhlc2l6ZShzdGFjayk7XG5cbiAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgUmVzb3VyY2VzOlxuICAgICAge1xuICAgICAgICBNeUMxUjFGQjJBNTYyRjogeyBUeXBlOiAnVDEnIH0sXG4gICAgICAgIE15QzFSMkFFMkI1MDY2OiB7IFR5cGU6ICdUMicgfSxcbiAgICAgICAgTXlDMlIzODA5RUVBRDY6IHsgVHlwZTogJ1QzJyB9LFxuICAgICAgICBNeUMzQzJSMzhDRTZGOUY3OiB7IFR5cGU6ICdUMycgfSxcbiAgICAgICAgTXlSZXNvdXJjZTpcbiAgICAgICAge1xuICAgICAgICAgIFR5cGU6ICdSJyxcbiAgICAgICAgICBEZXBlbmRzT246XG4gICAgICAgICAgWydNeUMxUjFGQjJBNTYyRicsXG4gICAgICAgICAgICAnTXlDMVIyQUUyQjUwNjYnLFxuICAgICAgICAgICAgJ015QzJSMzgwOUVFQUQ2JyxcbiAgICAgICAgICAgICdNeUMzQzJSMzhDRTZGOUY3J10sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyZXNvdXJjZS5yZWYgcmV0dXJucyB0aGUge1JlZn0gdG9rZW4nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCByID0gbmV3IENmblJlc291cmNlKHN0YWNrLCAnTXlSZXNvdXJjZScsIHsgdHlwZTogJ1InIH0pO1xuXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoci5yZWYpKS50b0VxdWFsKHsgUmVmOiAnTXlSZXNvdXJjZScgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdvdmVycmlkZXMnLCAoKSA9PiB7XG4gICAgdGVzdCgnYWRkT3ZlcnJpZGUocCwgdikgYWxsb3dzIGFzc2lnbmluZyBhcmJpdHJhcnkgdmFsdWVzIHRvIHN5bnRoZXNpemVkIHJlc291cmNlIGRlZmluaXRpb25zJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCByID0gbmV3IENmblJlc291cmNlKHN0YWNrLCAnTXlSZXNvdXJjZScsIHsgdHlwZTogJ0FXUzo6UmVzb3VyY2U6OlR5cGUnIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICByLmFkZE92ZXJyaWRlKCdUeXBlJywgJ1lvdUNhbkV2ZW5PdmVycmlkZVRoZVR5cGUnKTtcbiAgICAgIHIuYWRkT3ZlcnJpZGUoJ01ldGFkYXRhJywgeyBLZXk6IDEyIH0pO1xuICAgICAgci5hZGRPdmVycmlkZSgnVXNlLkRvdC5Ob3RhdGlvbicsICdUbyBjcmVhdGUgc3VidHJlZXMnKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spKS50b0VxdWFsKHtcbiAgICAgICAgUmVzb3VyY2VzOlxuICAgICAgICB7XG4gICAgICAgICAgTXlSZXNvdXJjZTpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBUeXBlOiAnWW91Q2FuRXZlbk92ZXJyaWRlVGhlVHlwZScsXG4gICAgICAgICAgICBVc2U6IHsgRG90OiB7IE5vdGF0aW9uOiAnVG8gY3JlYXRlIHN1YnRyZWVzJyB9IH0sXG4gICAgICAgICAgICBNZXRhZGF0YTogeyBLZXk6IDEyIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYWRkUHJvcGVydHlPdmVycmlkZSgpIGFsbG93cyBhc3NpZ25pbmcgYW4gYXR0cmlidXRlIG9mIGEgZGlmZmVyZW50IHJlc291cmNlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCByMSA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ015UmVzb3VyY2UxJywgeyB0eXBlOiAnQVdTOjpSZXNvdXJjZTo6VHlwZScgfSk7XG4gICAgICBjb25zdCByMiA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ015UmVzb3VyY2UyJywgeyB0eXBlOiAnQVdTOjpSZXNvdXJjZTo6VHlwZScgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIHIyLmFkZFByb3BlcnR5T3ZlcnJpZGUoJ0EnLCB7XG4gICAgICAgIEI6IHIxLmdldEF0dCgnQXJuJyksXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spKS50b0VxdWFsKHtcbiAgICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgICAgTXlSZXNvdXJjZTE6IHtcbiAgICAgICAgICAgIFR5cGU6ICdBV1M6OlJlc291cmNlOjpUeXBlJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIE15UmVzb3VyY2UyOiB7XG4gICAgICAgICAgICBUeXBlOiAnQVdTOjpSZXNvdXJjZTo6VHlwZScsXG4gICAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIEE6IHtcbiAgICAgICAgICAgICAgICBCOiB7ICdGbjo6R2V0QXR0JzogWydNeVJlc291cmNlMScsICdBcm4nXSB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhZGRPdmVycmlkZShwLCBudWxsKSB3aWxsIGFzc2lnbiBhbiBcIm51bGxcIiB2YWx1ZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICBjb25zdCByID0gbmV3IENmblJlc291cmNlKHN0YWNrLCAnTXlSZXNvdXJjZScsIHtcbiAgICAgICAgdHlwZTogJ0FXUzo6UmVzb3VyY2U6OlR5cGUnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgSGVsbG86IHtcbiAgICAgICAgICAgIFdvcmxkOiB7XG4gICAgICAgICAgICAgIFZhbHVlMTogJ0hlbGxvJyxcbiAgICAgICAgICAgICAgVmFsdWUyOiAxMjksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgci5hZGRPdmVycmlkZSgnUHJvcGVydGllcy5IZWxsby5Xb3JsZC5WYWx1ZTInLCBudWxsKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spKS50b0VxdWFsKHtcbiAgICAgICAgUmVzb3VyY2VzOlxuICAgICAgICB7XG4gICAgICAgICAgTXlSZXNvdXJjZTpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBUeXBlOiAnQVdTOjpSZXNvdXJjZTo6VHlwZScsXG4gICAgICAgICAgICBQcm9wZXJ0aWVzOiB7IEhlbGxvOiB7IFdvcmxkOiB7IFZhbHVlMTogJ0hlbGxvJywgVmFsdWUyOiBudWxsIH0gfSB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FkZE92ZXJyaWRlKHAsIHVuZGVmaW5lZCkgY2FuIGJlIHVzZWQgdG8gZGVsZXRlIGEgdmFsdWUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgY29uc3QgciA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ015UmVzb3VyY2UnLCB7XG4gICAgICAgIHR5cGU6ICdBV1M6OlJlc291cmNlOjpUeXBlJyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIEhlbGxvOiB7XG4gICAgICAgICAgICBXb3JsZDoge1xuICAgICAgICAgICAgICBWYWx1ZTE6ICdIZWxsbycsXG4gICAgICAgICAgICAgIFZhbHVlMjogMTI5LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIHIuYWRkT3ZlcnJpZGUoJ1Byb3BlcnRpZXMuSGVsbG8uV29ybGQuVmFsdWUyJywgdW5kZWZpbmVkKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spKS50b0VxdWFsKHtcbiAgICAgICAgUmVzb3VyY2VzOlxuICAgICAgICB7XG4gICAgICAgICAgTXlSZXNvdXJjZTpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBUeXBlOiAnQVdTOjpSZXNvdXJjZTo6VHlwZScsXG4gICAgICAgICAgICBQcm9wZXJ0aWVzOiB7IEhlbGxvOiB7IFdvcmxkOiB7IFZhbHVlMTogJ0hlbGxvJyB9IH0gfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhZGRPdmVycmlkZShwLCB1bmRlZmluZWQpIHdpbGwgbm90IGNyZWF0ZSBlbXB0eSB0cmVlcycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICBjb25zdCByID0gbmV3IENmblJlc291cmNlKHN0YWNrLCAnTXlSZXNvdXJjZScsIHsgdHlwZTogJ0FXUzo6UmVzb3VyY2U6OlR5cGUnIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICByLmFkZFByb3BlcnR5T3ZlcnJpZGUoJ1RyZWUuRXhpc3RzJywgNDIpO1xuICAgICAgci5hZGRQcm9wZXJ0eU92ZXJyaWRlKCdUcmVlLkRvZXMuTm90LkV4aXN0JywgdW5kZWZpbmVkKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spKS50b0VxdWFsKHtcbiAgICAgICAgUmVzb3VyY2VzOlxuICAgICAgICB7XG4gICAgICAgICAgTXlSZXNvdXJjZTpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBUeXBlOiAnQVdTOjpSZXNvdXJjZTo6VHlwZScsXG4gICAgICAgICAgICBQcm9wZXJ0aWVzOiB7IFRyZWU6IHsgRXhpc3RzOiA0MiB9IH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYWRkRGVsZXRpb25PdmVycmlkZShwKSBhbmQgYWRkUHJvcGVydHlEZWxldGlvbk92ZXJyaWRlKHBwKSBhcmUgc3VnYXIgZm9yIGB1bmRlZmluZWRgJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IHIgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdNeVJlc291cmNlJywge1xuICAgICAgICB0eXBlOiAnQVdTOjpSZXNvdXJjZTo6VHlwZScsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBIZWxsbzoge1xuICAgICAgICAgICAgV29ybGQ6IHtcbiAgICAgICAgICAgICAgVmFsdWUxOiAnSGVsbG8nLFxuICAgICAgICAgICAgICBWYWx1ZTI6IDEyOSxcbiAgICAgICAgICAgICAgVmFsdWUzOiBbJ2ZvbycsICdiYXInXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICByLmFkZERlbGV0aW9uT3ZlcnJpZGUoJ1Byb3BlcnRpZXMuSGVsbG8uV29ybGQuVmFsdWUyJyk7XG4gICAgICByLmFkZFByb3BlcnR5RGVsZXRpb25PdmVycmlkZSgnSGVsbG8uV29ybGQuVmFsdWUzJyk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICAgIFJlc291cmNlczpcbiAgICAgICAge1xuICAgICAgICAgIE15UmVzb3VyY2U6XG4gICAgICAgICAge1xuICAgICAgICAgICAgVHlwZTogJ0FXUzo6UmVzb3VyY2U6OlR5cGUnLFxuICAgICAgICAgICAgUHJvcGVydGllczogeyBIZWxsbzogeyBXb3JsZDogeyBWYWx1ZTE6ICdIZWxsbycgfSB9IH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYWRkT3ZlcnJpZGUocCwgdikgd2lsbCBvdmVyd3JpdGUgYW55IG5vbi1vYmplY3RzIGFsb25nIHRoZSBwYXRoJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCByID0gbmV3IENmblJlc291cmNlKHN0YWNrLCAnTXlSZXNvdXJjZScsIHtcbiAgICAgICAgdHlwZTogJ0FXUzo6UmVzb3VyY2U6OlR5cGUnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgSGVsbG86IHtcbiAgICAgICAgICAgIFdvcmxkOiA0MixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIHIuYWRkT3ZlcnJpZGUoJ1Byb3BlcnRpZXMuT3ZlcnJpZGUxJywgWydIZWxsbycsIDEyM10pO1xuICAgICAgci5hZGRPdmVycmlkZSgnUHJvcGVydGllcy5PdmVycmlkZTEuT3ZlcnJpZGUyJywgeyBIZXl5OiBbMV0gfSk7XG4gICAgICByLmFkZE92ZXJyaWRlKCdQcm9wZXJ0aWVzLkhlbGxvLldvcmxkLkZvby5CYXInLCA0Mik7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICAgIFJlc291cmNlczpcbiAgICAgICAge1xuICAgICAgICAgIE15UmVzb3VyY2U6XG4gICAgICAgICAge1xuICAgICAgICAgICAgVHlwZTogJ0FXUzo6UmVzb3VyY2U6OlR5cGUnLFxuICAgICAgICAgICAgUHJvcGVydGllczpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgSGVsbG86IHsgV29ybGQ6IHsgRm9vOiB7IEJhcjogNDIgfSB9IH0sXG4gICAgICAgICAgICAgIE92ZXJyaWRlMToge1xuICAgICAgICAgICAgICAgIE92ZXJyaWRlMjogeyBIZXl5OiBbMV0gfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYWRkT3ZlcnJpZGUocCwgdikgd2lsbCBub3Qgc3BsaXQgb24gZXNjYXBlZCBkb3RzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCByID0gbmV3IENmblJlc291cmNlKHN0YWNrLCAnTXlSZXNvdXJjZScsIHsgdHlwZTogJ0FXUzo6UmVzb3VyY2U6OlR5cGUnIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICByLmFkZE92ZXJyaWRlKFN0cmluZy5yYXdgUHJvcGVydGllcy5IZWxsb1xcLldvcmxkLkZvb1xcLkJhclxcLkJhemAsIDQyKTtcbiAgICAgIHIuYWRkT3ZlcnJpZGUoU3RyaW5nLnJhd2BQcm9wZXJ0aWVzLlNpbmdsZVxcQmFja1xcU2xhc2hlc2AsIDQyKTtcbiAgICAgIHIuYWRkT3ZlcnJpZGUoU3RyaW5nLnJhd2BQcm9wZXJ0aWVzLkVzY2FwZWRcXFxcLkJhY2tcXFxcLlNsYXNoZXNgLCA0Mik7XG4gICAgICByLmFkZE92ZXJyaWRlKFN0cmluZy5yYXdgUHJvcGVydGllcy5Eb3VibHlFc2NhcGVkXFxcXFxcXFxCYWNrXFxcXFxcXFxTbGFzaGVzYCwgNDIpO1xuICAgICAgci5hZGRPdmVycmlkZSgnUHJvcGVydGllcy5FbmRXaXRoXFxcXCcsIDQyKTsgLy8gUmF3IHN0cmluZyBjYW5ub3QgZW5kIHdpdGggYSBiYWNrc2xhc2hcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spKS50b0VxdWFsKHtcbiAgICAgICAgUmVzb3VyY2VzOlxuICAgICAgICB7XG4gICAgICAgICAgTXlSZXNvdXJjZTpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBUeXBlOiAnQVdTOjpSZXNvdXJjZTo6VHlwZScsXG4gICAgICAgICAgICBQcm9wZXJ0aWVzOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnSGVsbG8uV29ybGQnOiB7ICdGb28uQmFyLkJheic6IDQyIH0sXG4gICAgICAgICAgICAgICdTaW5nbGVCYWNrU2xhc2hlcyc6IDQyLFxuICAgICAgICAgICAgICAnRXNjYXBlZFxcXFwnOiB7ICdCYWNrXFxcXCc6IHsgU2xhc2hlczogNDIgfSB9LFxuICAgICAgICAgICAgICAnRG91Ymx5RXNjYXBlZFxcXFxcXFxcQmFja1xcXFxcXFxcU2xhc2hlcyc6IDQyLFxuICAgICAgICAgICAgICAnRW5kV2l0aFxcXFwnOiA0MixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYWRkUHJvcGVydHlPdmVycmlkZShwcCwgdikgaXMgYSBzdWdhciBmb3Igb3ZlcnJpZGluZyBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCByID0gbmV3IENmblJlc291cmNlKHN0YWNrLCAnTXlSZXNvdXJjZScsIHtcbiAgICAgICAgdHlwZTogJ0FXUzo6UmVzb3VyY2U6OlR5cGUnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7IEhlbGxvOiB7IFdvcmxkOiA0MiB9IH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgci5hZGRQcm9wZXJ0eU92ZXJyaWRlKCdIZWxsby5Xb3JsZCcsIHsgSGV5OiAnSnVkZScgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICAgIFJlc291cmNlczpcbiAgICAgICAge1xuICAgICAgICAgIE15UmVzb3VyY2U6XG4gICAgICAgICAge1xuICAgICAgICAgICAgVHlwZTogJ0FXUzo6UmVzb3VyY2U6OlR5cGUnLFxuICAgICAgICAgICAgUHJvcGVydGllczogeyBIZWxsbzogeyBXb3JsZDogeyBIZXk6ICdKdWRlJyB9IH0gfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdvdmVycmlkZXMgYXJlIGFwcGxpZWQgYWZ0ZXIgcmVuZGVyJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNsYXNzIE15UmVzb3VyY2UgZXh0ZW5kcyBDZm5SZXNvdXJjZSB7XG4gICAgICAgIHB1YmxpYyByZW5kZXJQcm9wZXJ0aWVzKCkge1xuICAgICAgICAgIHJldHVybiB7IEZpeGVkOiAxMjMgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IGNmbiA9IG5ldyBNeVJlc291cmNlKHN0YWNrLCAncnInLCB7IHR5cGU6ICdBV1M6OlJlc291cmNlOjpUeXBlJyB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY2ZuLmFkZFByb3BlcnR5T3ZlcnJpZGUoJ0Jvb20nLCAnSGknKTtcbiAgICAgIGNmbi5hZGRPdmVycmlkZSgnUHJvcGVydGllcy5Gb28uQmFyJywgJ0JhcicpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgICBycjoge1xuICAgICAgICAgICAgVHlwZTogJ0FXUzo6UmVzb3VyY2U6OlR5cGUnLFxuICAgICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgICBGaXhlZDogMTIzLFxuICAgICAgICAgICAgICBCb29tOiAnSGknLFxuICAgICAgICAgICAgICBGb286IHtcbiAgICAgICAgICAgICAgICBCYXI6ICdCYXInLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdvdmVycmlkZXMgYWxsb3cgb3ZlcnJpZGluZyBvbmUgaW50cmluc2ljIHdpdGggYW5vdGhlcicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ015UmVzb3VyY2UnLCB7XG4gICAgICAgIHR5cGU6ICdNeVJlc291cmNlVHlwZScsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBwcm9wMTogRm4ucmVmKCdQYXJhbScpLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIHJlc291cmNlLmFkZFByb3BlcnR5T3ZlcnJpZGUoJ3Byb3AxJywgRm4uam9pbignLScsIFsnaGVsbG8nLCBGbi5yZWYoJ1BhcmFtJyldKSk7XG4gICAgICBjb25zdCBjZm4gPSB0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KGNmbi5SZXNvdXJjZXMuTXlSZXNvdXJjZSkudG9FcXVhbCh7XG4gICAgICAgIFR5cGU6ICdNeVJlc291cmNlVHlwZScsXG4gICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICBwcm9wMToge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAnLScsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnaGVsbG8nLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ1BhcmFtJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdDYW4gb3ZlcnJpZGUgYSBhbiBvYmplY3Qgd2l0aCBhbiBpbnRyaW5zaWMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgY29uc3QgY29uZGl0aW9uID0gbmV3IENmbkNvbmRpdGlvbihzdGFjaywgJ015Q29uZGl0aW9uJywge1xuICAgICAgICBleHByZXNzaW9uOiBGbi5jb25kaXRpb25FcXVhbHMoJ3VzLWVhc3QtMScsICd1cy1lYXN0LTEnKSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdNeVJlc291cmNlJywge1xuICAgICAgICB0eXBlOiAnTXlSZXNvdXJjZVR5cGUnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgcHJvcDE6IHtcbiAgICAgICAgICAgIHN1YnByb3A6IHtcbiAgICAgICAgICAgICAgbmFtZTogRm4uZ2V0QXR0KCdyZXNvdXJjZScsICdhYmMnKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgaXNFbmFibGVkID0gRm4uY29uZGl0aW9uSWYoY29uZGl0aW9uLmxvZ2ljYWxJZCwge1xuICAgICAgICBSZWY6ICdBV1M6Ok5vVmFsdWUnLFxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiBGbi5nZXRBdHQoJ3Jlc291cmNlJywgJ2FiYycpLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIHJlc291cmNlLmFkZFByb3BlcnR5T3ZlcnJpZGUoJ3Byb3AxLnN1YnByb3AnLCBpc0VuYWJsZWQpO1xuICAgICAgY29uc3QgY2ZuID0gdG9DbG91ZEZvcm1hdGlvbihzdGFjayk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChjZm4uUmVzb3VyY2VzLk15UmVzb3VyY2UpLnRvRXF1YWwoe1xuICAgICAgICBUeXBlOiAnTXlSZXNvdXJjZVR5cGUnLFxuICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgcHJvcDE6IHtcbiAgICAgICAgICAgIHN1YnByb3A6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpJZic6IFtcbiAgICAgICAgICAgICAgICAnTXlDb25kaXRpb24nLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6Tm9WYWx1ZScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiB7XG4gICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICdyZXNvdXJjZScsXG4gICAgICAgICAgICAgICAgICAgICAgJ2FiYycsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ292ZXJyaWRlcyBhbGxvdyBvdmVycmlkaW5nIGEgbmVzdGVkIGludHJpbnNpYycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ015UmVzb3VyY2UnLCB7XG4gICAgICAgIHR5cGU6ICdNeVJlc291cmNlVHlwZScsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBwcm9wMTogRm4uaW1wb3J0VmFsdWUoRm4uc3ViKCcke1N1Yn0nLCB7IFN1YjogJ1ZhbHVlJyB9KSksXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgcmVzb3VyY2UuYWRkUHJvcGVydHlPdmVycmlkZSgncHJvcDEnLCBGbi5pbXBvcnRWYWx1ZShGbi5qb2luKCctJywgWydhYmMnLCBGbi5zdWIoJyR7U3VifScsIHsgU3ViOiAnVmFsdWUnIH0pXSkpKTtcbiAgICAgIGNvbnN0IGNmbiA9IHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoY2ZuLlJlc291cmNlcy5NeVJlc291cmNlKS50b0VxdWFsKHtcbiAgICAgICAgVHlwZTogJ015UmVzb3VyY2VUeXBlJyxcbiAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgIHByb3AxOiB7XG4gICAgICAgICAgICAnRm46OkltcG9ydFZhbHVlJzoge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJy0nLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICdhYmMnLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAnRm46OlN1Yic6IFsnJHtTdWJ9JywgeyBTdWI6ICdWYWx1ZScgfV0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd1c2luZyBtdXRhYmxlIHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgICB0ZXN0KCdjYW4gYmUgdXNlZCBieSBkZXJpdmVkIGNsYXNzZXMgdG8gc3BlY2lmeSBvdmVycmlkZXMgYmVmb3JlIHJlbmRlcigpJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICAgIGNvbnN0IHIgPSBuZXcgQ3VzdG9taXphYmxlUmVzb3VyY2Uoc3RhY2ssICdNeVJlc291cmNlJywge1xuICAgICAgICAgIHByb3AxOiAnZm9vJyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgci5wcm9wMiA9ICdiYXInO1xuXG4gICAgICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICAgICAgUmVzb3VyY2VzOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIE15UmVzb3VyY2U6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFR5cGU6ICdNeVJlc291cmNlVHlwZScsXG4gICAgICAgICAgICAgIFByb3BlcnRpZXM6IHsgUFJPUDE6ICdmb28nLCBQUk9QMjogJ2JhcicgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnXCJwcm9wZXJ0aWVzXCIgaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICAgIGNvbnN0IHIgPSBuZXcgQ3VzdG9taXphYmxlUmVzb3VyY2Uoc3RhY2ssICdNeVJlc291cmNlJyk7XG5cbiAgICAgICAgci5wcm9wMyA9ICd6b28nO1xuXG4gICAgICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICAgICAgUmVzb3VyY2VzOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIE15UmVzb3VyY2U6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFR5cGU6ICdNeVJlc291cmNlVHlwZScsXG4gICAgICAgICAgICAgIFByb3BlcnRpZXM6IHsgUFJPUDM6ICd6b28nIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ1wicHJvcGVydGllc1wiIGlzIGVtcHR5JywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICAgIGNvbnN0IHIgPSBuZXcgQ3VzdG9taXphYmxlUmVzb3VyY2Uoc3RhY2ssICdNeVJlc291cmNlJywgeyB9KTtcblxuICAgICAgICByLnByb3AzID0gJ3pvbyc7XG4gICAgICAgIHIucHJvcDIgPSAnaGV5JztcblxuICAgICAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgICAgIFJlc291cmNlczpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBNeVJlc291cmNlOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBUeXBlOiAnTXlSZXNvdXJjZVR5cGUnLFxuICAgICAgICAgICAgICBQcm9wZXJ0aWVzOiB7IFBST1AyOiAnaGV5JywgUFJPUDM6ICd6b28nIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ1wiYXdzOmNkazpwYXRoXCIgbWV0YWRhdGEgaXMgYWRkZWQgaWYgXCJhd3M6Y2RrOnBhdGgtbWV0YWRhdGFcIiBjb250ZXh0IGlzIHNldCB0byB0cnVlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgc3RhY2subm9kZS5zZXRDb250ZXh0KGN4YXBpLlBBVEhfTUVUQURBVEFfRU5BQkxFX0NPTlRFWFQsIHRydWUpO1xuXG4gICAgY29uc3QgcGFyZW50ID0gbmV3IENvbnN0cnVjdChzdGFjaywgJ1BhcmVudCcpO1xuXG4gICAgbmV3IENmblJlc291cmNlKHBhcmVudCwgJ015UmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnTXlSZXNvdXJjZVR5cGUnLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spKS50b0VxdWFsKHtcbiAgICAgIFJlc291cmNlczpcbiAgICAgIHtcbiAgICAgICAgUGFyZW50TXlSZXNvdXJjZTRCMUZEQkNDOlxuICAgICAgICAge1xuICAgICAgICAgICBUeXBlOiAnTXlSZXNvdXJjZVR5cGUnLFxuICAgICAgICAgICBNZXRhZGF0YTogeyBbY3hhcGkuUEFUSF9NRVRBREFUQV9LRVldOiAnRGVmYXVsdC9QYXJlbnQvTXlSZXNvdXJjZScgfSxcbiAgICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcm9zcy1zdGFjayBjb25zdHJ1Y3QgZGVwZW5kZW5jaWVzIGFyZSBub3QgcmVuZGVyZWQgYnV0IHR1cm5lZCBpbnRvIHN0YWNrIGRlcGVuZGVuY2llcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFja0EgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2tBJyk7XG4gICAgY29uc3QgcmVzQSA9IG5ldyBDZm5SZXNvdXJjZShzdGFja0EsICdSZXNvdXJjZScsIHsgdHlwZTogJ1InIH0pO1xuICAgIGNvbnN0IHN0YWNrQiA9IG5ldyBTdGFjayhhcHAsICdTdGFja0InKTtcbiAgICBjb25zdCByZXNCID0gbmV3IENmblJlc291cmNlKHN0YWNrQiwgJ1Jlc291cmNlJywgeyB0eXBlOiAnUicgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgcmVzQi5ub2RlLmFkZERlcGVuZGVuY3kocmVzQSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCB0ZW1wbGF0ZUIgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFja0Iuc3RhY2tOYW1lKS50ZW1wbGF0ZTtcblxuICAgIGV4cGVjdCh0ZW1wbGF0ZUI/LlJlc291cmNlcz8uUmVzb3VyY2UpLnRvRXF1YWwoe1xuICAgICAgVHlwZTogJ1InLFxuICAgICAgLy8gTm90aWNlIGFic2VuY2Ugb2YgJ0RlcGVuZHNPbidcbiAgICB9KTtcbiAgICBleHBlY3Qoc3RhY2tCLmRlcGVuZGVuY2llcy5tYXAocyA9PiBzLm5vZGUuaWQpKS50b0VxdWFsKFsnU3RhY2tBJ10pO1xuICB9KTtcblxuICB0ZXN0KCdlbmFibGVWZXJzaW9uVXBncmFkZSBjYW4gYmUgc2V0IG9uIGEgcmVzb3VyY2UnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCByMSA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ1Jlc291cmNlJywgeyB0eXBlOiAnVHlwZScgfSk7XG5cbiAgICByMS5jZm5PcHRpb25zLnVwZGF0ZVBvbGljeSA9IHtcbiAgICAgIGVuYWJsZVZlcnNpb25VcGdyYWRlOiB0cnVlLFxuICAgIH07XG5cbiAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgVHlwZTogJ1R5cGUnLFxuICAgICAgICAgIFVwZGF0ZVBvbGljeToge1xuICAgICAgICAgICAgRW5hYmxlVmVyc2lvblVwZ3JhZGU6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbnRlc3QoJ1Jlc291cmNlIGNhbiBnZXQgYWNjb3VudCBhbmQgUmVnaW9uIGZyb20gQVJOJywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgY29uc3QgcmVzb3VyY2UgPSBuZXcgVGVzdFJlc291cmNlKHN0YWNrLCAnUmVzb3VyY2UnLCB7XG4gICAgZW52aXJvbm1lbnRGcm9tQXJuOiAnYXJuOnBhcnRpdGlvbjpzZXJ2aWNlOnJlZ2lvbjphY2NvdW50OnJlbGF0aXZlLWlkJyxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3QocmVzb3VyY2UuZW52LmFjY291bnQpLnRvRXF1YWwoJ2FjY291bnQnKTtcbiAgZXhwZWN0KHJlc291cmNlLmVudi5yZWdpb24pLnRvRXF1YWwoJ3JlZ2lvbicpO1xufSk7XG5cbmludGVyZmFjZSBDb3VudGVyUHJvcHMge1xuICBDb3VudDogbnVtYmVyO1xufVxuXG5jbGFzcyBDb3VudGVyIGV4dGVuZHMgQ2ZuUmVzb3VyY2Uge1xuICBwdWJsaWMgcmVhZG9ubHkgYXJuOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSB1cmw6IHN0cmluZztcblxuICBwdWJsaWMgY291bnQ6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ291bnRlclByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7IHR5cGU6ICdNeTo6Q291bnRlcicsIHByb3BlcnRpZXM6IHsgQ291bnQ6IHByb3BzLkNvdW50IH0gfSk7XG4gICAgdGhpcy5hcm4gPSB0aGlzLmdldEF0dCgnQXJuJykudG9TdHJpbmcoKTtcbiAgICB0aGlzLnVybCA9IHRoaXMuZ2V0QXR0KCdVUkwnKS50b1N0cmluZygpO1xuICAgIHRoaXMuY291bnQgPSBwcm9wcy5Db3VudDtcbiAgfVxuXG4gIHB1YmxpYyBpbmNyZW1lbnQoYnkgPSAxKSB7XG4gICAgdGhpcy5jb3VudCArPSBieTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXQgY2ZuUHJvcGVydGllcygpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9IHtcbiAgICByZXR1cm4geyBDb3VudDogdGhpcy5jb3VudCB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIHdpdGhvdXRIYXNoKGxvZ0lkOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGxvZ0lkLnNsaWNlKDAsIC04KTtcbn1cblxuY2xhc3MgQ3VzdG9taXphYmxlUmVzb3VyY2UgZXh0ZW5kcyBDZm5SZXNvdXJjZSB7XG4gIHB1YmxpYyBwcm9wMTogYW55O1xuICBwdWJsaWMgcHJvcDI6IGFueTtcbiAgcHVibGljIHByb3AzOiBhbnk7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBhbnkpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHsgdHlwZTogJ015UmVzb3VyY2VUeXBlJywgcHJvcGVydGllczogcHJvcHMgfSk7XG4gICAgaWYgKHByb3BzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMucHJvcDEgPSBwcm9wcy5wcm9wMTtcbiAgICAgIHRoaXMucHJvcDIgPSBwcm9wcy5wcm9wMjtcbiAgICAgIHRoaXMucHJvcDMgPSBwcm9wcy5wcm9wMztcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVuZGVyUHJvcGVydGllcygpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9IHtcbiAgICBjb25zdCBwcm9wcyA9IHRoaXMudXBkYXRlZFByb3BlcnRpZXM7XG4gICAgY29uc3QgcmVuZGVyOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ID0ge307XG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMocHJvcHMpKSB7XG4gICAgICByZW5kZXJba2V5LnRvVXBwZXJDYXNlKCldID0gcHJvcHNba2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIHJlbmRlcjtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXQgdXBkYXRlZFByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gICAgY29uc3QgcHJvcHM6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7XG4gICAgICBwcm9wMTogdGhpcy5wcm9wMSxcbiAgICAgIHByb3AyOiB0aGlzLnByb3AyLFxuICAgICAgcHJvcDM6IHRoaXMucHJvcDMsXG4gICAgfTtcbiAgICBjb25zdCBjbGVhblByb3BzOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ID0geyB9O1xuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHByb3BzKSkge1xuICAgICAgaWYgKHByb3BzW2tleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNsZWFuUHJvcHNba2V5XSA9IHByb3BzW2tleV07XG4gICAgfVxuICAgIHJldHVybiBjbGVhblByb3BzO1xuICB9XG59XG5cbi8qKlxuICogQmVjYXVzZSBSZXNvdXJjZSBpcyBhYnN0cmFjdFxuICovXG5jbGFzcyBUZXN0UmVzb3VyY2UgZXh0ZW5kcyBSZXNvdXJjZSB7fVxuIl19