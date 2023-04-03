"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const assertions_1 = require("@aws-cdk/assertions");
const s3_assets = require("@aws-cdk/aws-s3-assets");
const sns = require("@aws-cdk/aws-sns");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const core_1 = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const constructs_1 = require("constructs");
const nested_stack_1 = require("../lib/nested-stack");
/* eslint-disable @aws-cdk/no-core-construct */
/* eslint-disable max-len */
cdk_build_tools_1.describeDeprecated('NestedStack', () => {
    test('fails if defined as a root', () => {
        // THEN
        expect(() => new nested_stack_1.NestedStack(undefined, 'boom')).toThrow(/Nested stacks cannot be defined as a root construct/);
    });
    test('fails if defined without a parent stack', () => {
        // GIVEN
        const app = new core_1.App();
        const group = new constructs_1.Construct(app, 'group');
        // THEN
        expect(() => new nested_stack_1.NestedStack(app, 'boom')).toThrow(/must be defined within scope of another non-nested stack/);
        expect(() => new nested_stack_1.NestedStack(group, 'bam')).toThrow(/must be defined within scope of another non-nested stack/);
    });
    test('can be defined as a direct child or an indirect child of a Stack', () => {
        // GIVEN
        const parent = new core_1.Stack();
        // THEN
        expect(() => new nested_stack_1.NestedStack(parent, 'direct')).not.toThrow();
        expect(() => new nested_stack_1.NestedStack(new constructs_1.Construct(parent, 'group'), 'indirect')).not.toThrow();
    });
    test('nested stack is not synthesized as a stack artifact into the assembly', () => {
        // GIVEN
        const app = new core_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const parentStack = new core_1.Stack(app, 'parent-stack');
        new nested_stack_1.NestedStack(parentStack, 'nested-stack');
        // WHEN
        const assembly = app.synth();
        // THEN
        expect(assembly.artifacts.length).toEqual(2);
    });
    test('the template of the nested stack is synthesized into the cloud assembly', () => {
        // GIVEN
        const app = new core_1.App();
        const parent = new core_1.Stack(app, 'parent-stack');
        const nested = new nested_stack_1.NestedStack(parent, 'nested-stack');
        new core_1.CfnResource(nested, 'ResourceInNestedStack', { type: 'AWS::Resource::Nested' });
        // WHEN
        const assembly = app.synth();
        // THEN
        const template = JSON.parse(fs.readFileSync(path.join(assembly.directory, `${core_1.Names.uniqueId(nested)}.nested.template.json`), 'utf-8'));
        expect(template).toEqual({
            Resources: {
                ResourceInNestedStack: {
                    Type: 'AWS::Resource::Nested',
                },
            },
        });
    });
    test('file asset metadata is associated with the parent stack', () => {
        // GIVEN
        const app = new core_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const parent = new core_1.Stack(app, 'parent-stack');
        const nested = new nested_stack_1.NestedStack(parent, 'nested-stack');
        new core_1.CfnResource(nested, 'ResourceInNestedStack', { type: 'AWS::Resource::Nested' });
        // WHEN
        const assembly = app.synth();
        // THEN
        expect(assembly.getStackByName(parent.stackName).assets).toEqual([{
                path: 'parentstacknestedstack844892C0.nested.template.json',
                id: 'c639c0a5e7320758aa22589669ecebc98f185b711300b074f53998c8f9a45096',
                packaging: 'file',
                sourceHash: 'c639c0a5e7320758aa22589669ecebc98f185b711300b074f53998c8f9a45096',
                s3BucketParameter: 'AssetParametersc639c0a5e7320758aa22589669ecebc98f185b711300b074f53998c8f9a45096S3BucketDA8C3345',
                s3KeyParameter: 'AssetParametersc639c0a5e7320758aa22589669ecebc98f185b711300b074f53998c8f9a45096S3VersionKey09D03EE6',
                artifactHashParameter: 'AssetParametersc639c0a5e7320758aa22589669ecebc98f185b711300b074f53998c8f9a45096ArtifactHash8DE450C7',
            }]);
    });
    test('aws::cloudformation::stack is synthesized in the parent scope', () => {
        // GIVEN
        const app = new core_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const parent = new core_1.Stack(app, 'parent-stack');
        // WHEN
        const nested = new nested_stack_1.NestedStack(parent, 'nested-stack');
        new core_1.CfnResource(nested, 'ResourceInNestedStack', { type: 'AWS::Resource::Nested' });
        // THEN
        const assembly = app.synth();
        // assembly has one stack (the parent)
        expect(assembly.stacks.length).toEqual(1);
        // but this stack has an asset that points to the synthesized template
        expect(assembly.stacks[0].assets[0].path).toEqual('parentstacknestedstack844892C0.nested.template.json');
        // the template includes our resource
        const filePath = path.join(assembly.directory, assembly.stacks[0].assets[0].path);
        expect(JSON.parse(fs.readFileSync(filePath).toString('utf-8'))).toEqual({
            Resources: { ResourceInNestedStack: { Type: 'AWS::Resource::Nested' } },
        });
        // the parent template includes the parameters and the nested stack resource which points to the s3 url
        assertions_1.Template.fromStack(parent).templateMatches({
            Resources: {
                nestedstackNestedStacknestedstackNestedStackResource71CDD241: {
                    Type: 'AWS::CloudFormation::Stack',
                    DeletionPolicy: 'Delete',
                    UpdateReplacePolicy: 'Delete',
                    Properties: {
                        TemplateURL: {
                            'Fn::Join': [
                                '',
                                [
                                    'https://s3.',
                                    {
                                        Ref: 'AWS::Region',
                                    },
                                    '.',
                                    {
                                        Ref: 'AWS::URLSuffix',
                                    },
                                    '/',
                                    {
                                        Ref: 'AssetParametersc639c0a5e7320758aa22589669ecebc98f185b711300b074f53998c8f9a45096S3BucketDA8C3345',
                                    },
                                    '/',
                                    {
                                        'Fn::Select': [
                                            0,
                                            {
                                                'Fn::Split': [
                                                    '||',
                                                    {
                                                        Ref: 'AssetParametersc639c0a5e7320758aa22589669ecebc98f185b711300b074f53998c8f9a45096S3VersionKey09D03EE6',
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        'Fn::Select': [
                                            1,
                                            {
                                                'Fn::Split': [
                                                    '||',
                                                    {
                                                        Ref: 'AssetParametersc639c0a5e7320758aa22589669ecebc98f185b711300b074f53998c8f9a45096S3VersionKey09D03EE6',
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            ],
                        },
                    },
                },
            },
            Parameters: {
                AssetParametersc639c0a5e7320758aa22589669ecebc98f185b711300b074f53998c8f9a45096S3BucketDA8C3345: {
                    Type: 'String',
                    Description: 'S3 bucket for asset "c639c0a5e7320758aa22589669ecebc98f185b711300b074f53998c8f9a45096"',
                },
                AssetParametersc639c0a5e7320758aa22589669ecebc98f185b711300b074f53998c8f9a45096S3VersionKey09D03EE6: {
                    Type: 'String',
                    Description: 'S3 key for asset version "c639c0a5e7320758aa22589669ecebc98f185b711300b074f53998c8f9a45096"',
                },
                AssetParametersc639c0a5e7320758aa22589669ecebc98f185b711300b074f53998c8f9a45096ArtifactHash8DE450C7: {
                    Type: 'String',
                    Description: 'Artifact hash for asset "c639c0a5e7320758aa22589669ecebc98f185b711300b074f53998c8f9a45096"',
                },
            },
        });
    });
    test('Stack.of()', () => {
        class MyNestedStack extends nested_stack_1.NestedStack {
            constructor(scope, id) {
                super(scope, id);
                const param = new core_1.CfnParameter(this, 'param', { type: 'String' });
                this.stackOfChild = core_1.Stack.of(param);
            }
        }
        const parent = new core_1.Stack();
        const nested = new MyNestedStack(parent, 'nested');
        expect(nested.stackOfChild).toEqual(nested);
        expect(core_1.Stack.of(nested)).toEqual(nested);
    });
    test('references within the nested stack are not reported as cross stack references', () => {
        class MyNestedStack extends nested_stack_1.NestedStack {
            constructor(scope, id) {
                super(scope, id);
                const param = new core_1.CfnParameter(this, 'param', { type: 'String' });
                new core_1.CfnResource(this, 'resource', {
                    type: 'My::Resource',
                    properties: {
                        SomeProp: param.valueAsString,
                    },
                });
            }
        }
        const app = new core_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const parent = new core_1.Stack(app, 'parent');
        new MyNestedStack(parent, 'nested');
        // references are added during "prepare"
        const assembly = app.synth();
        expect(assembly.stacks.length).toEqual(1);
        expect(assembly.stacks[0].dependencies).toEqual([]);
    });
    test('references to a resource from the parent stack in a nested stack is translated into a cfn parameter', () => {
        // WHEN
        class MyNestedStack extends nested_stack_1.NestedStack {
            constructor(scope, id, resourceFromParent) {
                super(scope, id);
                new core_1.CfnResource(this, 'resource', {
                    type: 'AWS::Child::Resource',
                    properties: {
                        ReferenceToResourceInParentStack: resourceFromParent.ref,
                    },
                });
                new core_1.CfnResource(this, 'resource2', {
                    type: 'My::Resource::2',
                    properties: {
                        Prop1: resourceFromParent.getAtt('Attr'),
                        Prop2: resourceFromParent.ref,
                    },
                });
            }
        }
        const app = new core_1.App();
        const parentStack = new core_1.Stack(app, 'parent');
        const resource = new core_1.CfnResource(parentStack, 'parent-resource', { type: 'AWS::Parent::Resource' });
        const nested = new MyNestedStack(parentStack, 'nested', resource);
        // THEN
        app.synth();
        // nested template should use a parameter to reference the resource from the parent stack
        assertions_1.Template.fromStack(nested).templateMatches({
            Resources: {
                resource: {
                    Type: 'AWS::Child::Resource',
                    Properties: { ReferenceToResourceInParentStack: { Ref: 'referencetoparentparentresourceD56EA8F7Ref' } },
                },
                resource2: {
                    Type: 'My::Resource::2',
                    Properties: {
                        Prop1: { Ref: 'referencetoparentparentresourceD56EA8F7Attr' },
                        Prop2: { Ref: 'referencetoparentparentresourceD56EA8F7Ref' },
                    },
                },
            },
            Parameters: {
                referencetoparentparentresourceD56EA8F7Ref: { Type: 'String' },
                referencetoparentparentresourceD56EA8F7Attr: { Type: 'String' },
            },
        });
        // parent template should pass in the value through the parameter
        assertions_1.Template.fromStack(parentStack).hasResourceProperties('AWS::CloudFormation::Stack', {
            Parameters: {
                referencetoparentparentresourceD56EA8F7Ref: {
                    Ref: 'parentresource',
                },
                referencetoparentparentresourceD56EA8F7Attr: {
                    'Fn::GetAtt': [
                        'parentresource',
                        'Attr',
                    ],
                },
            },
        });
    });
    test('references to a resource in the nested stack in the parent is translated into a cfn output', () => {
        class MyNestedStack extends nested_stack_1.NestedStack {
            constructor(scope, id) {
                super(scope, id);
                this.resourceFromChild = new core_1.CfnResource(this, 'resource', {
                    type: 'AWS::Child::Resource',
                });
            }
        }
        const app = new core_1.App();
        const parentStack = new core_1.Stack(app, 'parent');
        const nested = new MyNestedStack(parentStack, 'nested');
        new core_1.CfnResource(parentStack, 'another-parent-resource', {
            type: 'AWS::Parent::Resource',
            properties: {
                RefToResourceInNestedStack: nested.resourceFromChild.ref,
            },
        });
        // references are added during "prepare"
        app.synth();
        // nested template should use a parameter to reference the resource from the parent stack
        assertions_1.Template.fromStack(nested).templateMatches({
            Resources: {
                resource: { Type: 'AWS::Child::Resource' },
            },
            Outputs: {
                parentnestedresource4D680677Ref: { Value: { Ref: 'resource' } },
            },
        });
        // parent template should pass in the value through the parameter
        assertions_1.Template.fromStack(parentStack).hasResourceProperties('AWS::Parent::Resource', {
            RefToResourceInNestedStack: {
                'Fn::GetAtt': [
                    'nestedNestedStacknestedNestedStackResource3DD143BF',
                    'Outputs.parentnestedresource4D680677Ref',
                ],
            },
        });
    });
    test('nested stack references a resource from another non-nested stack (not the parent)', () => {
        // GIVEN
        const app = new core_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack1 = new core_1.Stack(app, 'Stack1');
        const stack2 = new core_1.Stack(app, 'Stack2');
        const nestedUnderStack1 = new nested_stack_1.NestedStack(stack1, 'NestedUnderStack1');
        const resourceInStack2 = new core_1.CfnResource(stack2, 'ResourceInStack2', { type: 'MyResource' });
        // WHEN
        new core_1.CfnResource(nestedUnderStack1, 'ResourceInNestedStack1', {
            type: 'Nested::Resource',
            properties: {
                RefToSibling: resourceInStack2.getAtt('MyAttribute'),
            },
        });
        // THEN
        const assembly = app.synth();
        // producing stack should have an export
        assertions_1.Template.fromStack(stack2).templateMatches({
            Resources: {
                ResourceInStack2: { Type: 'MyResource' },
            },
            Outputs: {
                ExportsOutputFnGetAttResourceInStack2MyAttributeC15F1009: {
                    Value: { 'Fn::GetAtt': ['ResourceInStack2', 'MyAttribute'] },
                    Export: { Name: 'Stack2:ExportsOutputFnGetAttResourceInStack2MyAttributeC15F1009' },
                },
            },
        });
        // nested stack uses Fn::ImportValue like normal
        assertions_1.Template.fromStack(nestedUnderStack1).templateMatches({
            Resources: {
                ResourceInNestedStack1: {
                    Type: 'Nested::Resource',
                    Properties: {
                        RefToSibling: {
                            'Fn::ImportValue': 'Stack2:ExportsOutputFnGetAttResourceInStack2MyAttributeC15F1009',
                        },
                    },
                },
            },
        });
        // verify a depedency was established between the parents
        const stack1Artifact = assembly.getStackByName(stack1.stackName);
        const stack2Artifact = assembly.getStackByName(stack2.stackName);
        expect(stack1Artifact.dependencies.length).toEqual(1);
        expect(stack2Artifact.dependencies.length).toEqual(0);
        expect(stack1Artifact.dependencies[0]).toEqual(stack2Artifact);
    });
    test('nested stack within a nested stack references a resource in a sibling top-level stack', () => {
        // GIVEN
        const app = new core_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const consumerTopLevel = new core_1.Stack(app, 'ConsumerTopLevel');
        const consumerNested1 = new nested_stack_1.NestedStack(consumerTopLevel, 'ConsumerNested1');
        const consumerNested2 = new nested_stack_1.NestedStack(consumerNested1, 'ConsumerNested2');
        const producerTopLevel = new core_1.Stack(app, 'ProducerTopLevel');
        const producer = new core_1.CfnResource(producerTopLevel, 'Producer', { type: 'Producer' });
        // WHEN
        new core_1.CfnResource(consumerNested2, 'Consumer', {
            type: 'Consumer',
            properties: {
                Ref: producer.ref,
            },
        });
        // THEN
        const manifest = app.synth();
        const consumerDeps = manifest.getStackArtifact(consumerTopLevel.artifactId).dependencies.map(d => d.id);
        expect(consumerDeps).toEqual(['ProducerTopLevel']);
    });
    test('another non-nested stack takes a reference on a resource within the nested stack (the parent exports)', () => {
        // GIVEN
        const app = new core_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack1 = new core_1.Stack(app, 'Stack1');
        const stack2 = new core_1.Stack(app, 'Stack2');
        const nestedUnderStack1 = new nested_stack_1.NestedStack(stack1, 'NestedUnderStack1');
        const resourceInNestedStack = new core_1.CfnResource(nestedUnderStack1, 'ResourceInNestedStack', { type: 'MyResource' });
        // WHEN
        new core_1.CfnResource(stack2, 'ResourceInStack2', {
            type: 'JustResource',
            properties: {
                RefToSibling: resourceInNestedStack.getAtt('MyAttribute'),
            },
        });
        // THEN
        const assembly = app.synth();
        // nested stack should output this value as if it was referenced by the parent (without the export)
        assertions_1.Template.fromStack(nestedUnderStack1).templateMatches({
            Resources: {
                ResourceInNestedStack: {
                    Type: 'MyResource',
                },
            },
            Outputs: {
                Stack1NestedUnderStack1ResourceInNestedStack6EE9DCD2MyAttribute: {
                    Value: {
                        'Fn::GetAtt': [
                            'ResourceInNestedStack',
                            'MyAttribute',
                        ],
                    },
                },
            },
        });
        // parent stack (stack1) should export this value
        expect(assembly.getStackByName(stack1.stackName).template.Outputs).toEqual({
            ExportsOutputFnGetAttNestedUnderStack1NestedStackNestedUnderStack1NestedStackResourceF616305BOutputsStack1NestedUnderStack1ResourceInNestedStack6EE9DCD2MyAttribute564EECF3: {
                Value: { 'Fn::GetAtt': ['NestedUnderStack1NestedStackNestedUnderStack1NestedStackResourceF616305B', 'Outputs.Stack1NestedUnderStack1ResourceInNestedStack6EE9DCD2MyAttribute'] },
                Export: { Name: 'Stack1:ExportsOutputFnGetAttNestedUnderStack1NestedStackNestedUnderStack1NestedStackResourceF616305BOutputsStack1NestedUnderStack1ResourceInNestedStack6EE9DCD2MyAttribute564EECF3' },
            },
        });
        // consuming stack should use ImportValue to import the value from the parent stack
        assertions_1.Template.fromStack(stack2).templateMatches({
            Resources: {
                ResourceInStack2: {
                    Type: 'JustResource',
                    Properties: {
                        RefToSibling: {
                            'Fn::ImportValue': 'Stack1:ExportsOutputFnGetAttNestedUnderStack1NestedStackNestedUnderStack1NestedStackResourceF616305BOutputsStack1NestedUnderStack1ResourceInNestedStack6EE9DCD2MyAttribute564EECF3',
                        },
                    },
                },
            },
        });
        expect(assembly.stacks.length).toEqual(2);
        const stack1Artifact = assembly.getStackByName(stack1.stackName);
        const stack2Artifact = assembly.getStackByName(stack2.stackName);
        expect(stack1Artifact.dependencies.length).toEqual(0);
        expect(stack2Artifact.dependencies.length).toEqual(1);
        expect(stack2Artifact.dependencies[0]).toEqual(stack1Artifact);
    });
    test('references between sibling nested stacks should output from one and getAtt from the other', () => {
        // GIVEN
        const app = new core_1.App();
        const parent = new core_1.Stack(app, 'Parent');
        const nested1 = new nested_stack_1.NestedStack(parent, 'Nested1');
        const nested2 = new nested_stack_1.NestedStack(parent, 'Nested2');
        const resource1 = new core_1.CfnResource(nested1, 'Resource1', { type: 'Resource1' });
        // WHEN
        new core_1.CfnResource(nested2, 'Resource2', {
            type: 'Resource2',
            properties: {
                RefToResource1: resource1.ref,
            },
        });
        // THEN
        app.synth();
        // producing nested stack
        assertions_1.Template.fromStack(nested1).templateMatches({
            Resources: {
                Resource1: {
                    Type: 'Resource1',
                },
            },
            Outputs: {
                ParentNested1Resource15F3F0657Ref: {
                    Value: {
                        Ref: 'Resource1',
                    },
                },
            },
        });
        // consuming nested stack
        assertions_1.Template.fromStack(nested2).templateMatches({
            Resources: {
                Resource2: {
                    Type: 'Resource2',
                    Properties: {
                        RefToResource1: {
                            Ref: 'referencetoParentNested1NestedStackNested1NestedStackResource9C05342COutputsParentNested1Resource15F3F0657Ref',
                        },
                    },
                },
            },
            Parameters: {
                referencetoParentNested1NestedStackNested1NestedStackResource9C05342COutputsParentNested1Resource15F3F0657Ref: {
                    Type: 'String',
                },
            },
        });
        // parent
        assertions_1.Template.fromStack(parent).hasResourceProperties('AWS::CloudFormation::Stack', {
            Parameters: {
                referencetoParentNested1NestedStackNested1NestedStackResource9C05342COutputsParentNested1Resource15F3F0657Ref: {
                    'Fn::GetAtt': [
                        'Nested1NestedStackNested1NestedStackResourceCD0AD36B',
                        'Outputs.ParentNested1Resource15F3F0657Ref',
                    ],
                },
            },
        });
    });
    test('stackId returns AWS::StackId when referenced from the context of the nested stack', () => {
        // GIVEN
        const parent = new core_1.Stack();
        const nested = new nested_stack_1.NestedStack(parent, 'NestedStack');
        // WHEN
        new core_1.CfnResource(nested, 'NestedResource', {
            type: 'Nested::Resource',
            properties: { MyStackId: nested.stackId },
        });
        // THEN
        assertions_1.Template.fromStack(nested).hasResourceProperties('Nested::Resource', {
            MyStackId: { Ref: 'AWS::StackId' },
        });
    });
    test('stackId returns the REF of the CloudFormation::Stack resource when referenced from the parent stack', () => {
        // GIVEN
        const parent = new core_1.Stack();
        const nested = new nested_stack_1.NestedStack(parent, 'NestedStack');
        // WHEN
        new core_1.CfnResource(parent, 'ParentResource', {
            type: 'Parent::Resource',
            properties: { NestedStackId: nested.stackId },
        });
        // THEN
        assertions_1.Template.fromStack(parent).hasResourceProperties('Parent::Resource', {
            NestedStackId: { Ref: 'NestedStackNestedStackNestedStackNestedStackResourceB70834FD' },
        });
    });
    test('stackName returns AWS::StackName when referenced from the context of the nested stack', () => {
        // GIVEN
        const parent = new core_1.Stack();
        const nested = new nested_stack_1.NestedStack(parent, 'NestedStack');
        // WHEN
        new core_1.CfnResource(nested, 'NestedResource', {
            type: 'Nested::Resource',
            properties: { MyStackName: nested.stackName },
        });
        // THEN
        assertions_1.Template.fromStack(nested).hasResourceProperties('Nested::Resource', {
            MyStackName: { Ref: 'AWS::StackName' },
        });
    });
    test('stackName returns the REF of the CloudFormation::Stack resource when referenced from the parent stack', () => {
        // GIVEN
        const parent = new core_1.Stack();
        const nested = new nested_stack_1.NestedStack(parent, 'NestedStack');
        // WHEN
        new core_1.CfnResource(parent, 'ParentResource', {
            type: 'Parent::Resource',
            properties: { NestedStackName: nested.stackName },
        });
        // THEN
        assertions_1.Template.fromStack(parent).hasResourceProperties('Parent::Resource', {
            NestedStackName: {
                'Fn::Select': [
                    1,
                    {
                        'Fn::Split': [
                            '/',
                            {
                                Ref: 'NestedStackNestedStackNestedStackNestedStackResourceB70834FD',
                            },
                        ],
                    },
                ],
            },
        });
    });
    test('"account", "region" and "environment" are all derived from the parent', () => {
        // GIVEN
        const app = new core_1.App();
        const parent = new core_1.Stack(app, 'ParentStack', { env: { account: '1234account', region: 'us-east-44' } });
        // WHEN
        const nested = new nested_stack_1.NestedStack(parent, 'NestedStack');
        // THEN
        expect(nested.environment).toEqual(parent.environment);
        expect(nested.account).toEqual(parent.account);
        expect(nested.region).toEqual(parent.region);
    });
    test('double-nested stack', () => {
        // GIVEN
        const app = new core_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const parent = new core_1.Stack(app, 'stack');
        // WHEN
        const nested1 = new nested_stack_1.NestedStack(parent, 'Nested1');
        const nested2 = new nested_stack_1.NestedStack(nested1, 'Nested2');
        new core_1.CfnResource(nested1, 'Resource1', { type: 'Resource::1' });
        new core_1.CfnResource(nested2, 'Resource2', { type: 'Resource::2' });
        // THEN
        const assembly = app.synth();
        // nested2 is a "leaf", so it's just the resource
        assertions_1.Template.fromStack(nested2).templateMatches({
            Resources: {
                Resource2: { Type: 'Resource::2' },
            },
        });
        const middleStackHash = '7c426f7299a739900279ac1ece040397c1913cdf786f5228677b289f4d5e4c48';
        const bucketSuffix = 'C706B101';
        const versionSuffix = '4B193AA5';
        const hashSuffix = 'E28F0693';
        // nested1 wires the nested2 template through parameters, so we expect those
        const nested1Template = assertions_1.Template.fromStack(nested1);
        nested1Template.resourceCountIs('Resource::1', 1);
        const nested2Template = nested1Template.toJSON();
        expect(nested2Template.Parameters).toEqual({
            referencetostackAssetParameters8169c6f8aaeaf5e2e8620f5f895ffe2099202ccb4b6889df48fe0967a894235cS3BucketE8768F5CRef: { Type: 'String' },
            referencetostackAssetParameters8169c6f8aaeaf5e2e8620f5f895ffe2099202ccb4b6889df48fe0967a894235cS3VersionKey49DD83A2Ref: { Type: 'String' },
        });
        // parent stack should have two sets of parameters. one for the first nested stack and the second
        // for the second nested stack, passed in as parameters to the first
        const template = assertions_1.Template.fromStack(parent).toJSON();
        expect(template.Parameters).toEqual({
            AssetParameters8169c6f8aaeaf5e2e8620f5f895ffe2099202ccb4b6889df48fe0967a894235cS3BucketDE3B88D6: { Type: 'String', Description: 'S3 bucket for asset "8169c6f8aaeaf5e2e8620f5f895ffe2099202ccb4b6889df48fe0967a894235c"' },
            AssetParameters8169c6f8aaeaf5e2e8620f5f895ffe2099202ccb4b6889df48fe0967a894235cS3VersionKey3A62EFEA: { Type: 'String', Description: 'S3 key for asset version "8169c6f8aaeaf5e2e8620f5f895ffe2099202ccb4b6889df48fe0967a894235c"' },
            AssetParameters8169c6f8aaeaf5e2e8620f5f895ffe2099202ccb4b6889df48fe0967a894235cArtifactHash7DC546E0: { Type: 'String', Description: 'Artifact hash for asset "8169c6f8aaeaf5e2e8620f5f895ffe2099202ccb4b6889df48fe0967a894235c"' },
            [`AssetParameters${middleStackHash}S3Bucket${bucketSuffix}`]: { Type: 'String', Description: `S3 bucket for asset "${middleStackHash}"` },
            [`AssetParameters${middleStackHash}S3VersionKey${versionSuffix}`]: { Type: 'String', Description: `S3 key for asset version "${middleStackHash}"` },
            [`AssetParameters${middleStackHash}ArtifactHash${hashSuffix}`]: { Type: 'String', Description: `Artifact hash for asset "${middleStackHash}"` },
        });
        // proxy asset params to nested stack
        assertions_1.Template.fromStack(parent).hasResourceProperties('AWS::CloudFormation::Stack', {
            Parameters: {
                referencetostackAssetParameters8169c6f8aaeaf5e2e8620f5f895ffe2099202ccb4b6889df48fe0967a894235cS3BucketE8768F5CRef: { Ref: 'AssetParameters8169c6f8aaeaf5e2e8620f5f895ffe2099202ccb4b6889df48fe0967a894235cS3BucketDE3B88D6' },
                referencetostackAssetParameters8169c6f8aaeaf5e2e8620f5f895ffe2099202ccb4b6889df48fe0967a894235cS3VersionKey49DD83A2Ref: { Ref: 'AssetParameters8169c6f8aaeaf5e2e8620f5f895ffe2099202ccb4b6889df48fe0967a894235cS3VersionKey3A62EFEA' },
            },
        });
        // parent stack should have 2 assets
        expect(assembly.getStackByName(parent.stackName).assets.length).toEqual(2);
    });
    test('reference resource in a double nested stack (#15155)', () => {
        // GIVEN
        const app = new core_1.App();
        const producerStack = new core_1.Stack(app, 'Producer');
        const nested2 = new nested_stack_1.NestedStack(new nested_stack_1.NestedStack(producerStack, 'Nested1'), 'Nested2');
        const producerResource = new core_1.CfnResource(nested2, 'Resource', { type: 'MyResource' });
        const consumerStack = new core_1.Stack(app, 'Consumer');
        // WHEN
        new core_1.CfnResource(consumerStack, 'ConsumingResource', {
            type: 'YourResource',
            properties: { RefToResource: producerResource.ref },
        });
        // THEN
        const casm = app.synth(); // before #15155 was fixed this threw an error
        const producerTemplate = casm.getStackArtifact(producerStack.artifactId).template;
        const consumerTemplate = casm.getStackArtifact(consumerStack.artifactId).template;
        // check that the consuming resource references the expected export name
        const outputName = 'ExportsOutputFnGetAttNested1NestedStackNested1NestedStackResourceCD0AD36BOutputsProducerNested1Nested2NestedStackNested2NestedStackResource1E6FA3C3OutputsProducerNested1Nested238A89CC5Ref2E9E52EA';
        const exportName = producerTemplate.Outputs[outputName].Export.Name;
        const importName = consumerTemplate.Resources.ConsumingResource.Properties.RefToResource['Fn::ImportValue'];
        expect(exportName).toEqual(importName);
    });
    test('assets within nested stacks are proxied from the parent', () => {
        // GIVEN
        const app = new core_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const parent = new core_1.Stack(app, 'ParentStack');
        const nested = new nested_stack_1.NestedStack(parent, 'NestedStack');
        // WHEN
        const asset = new s3_assets.Asset(nested, 'asset', {
            path: path.join(__dirname, 'asset-fixture.txt'),
        });
        new core_1.CfnResource(nested, 'NestedResource', {
            type: 'Nested::Resource',
            properties: {
                AssetBucket: asset.s3BucketName,
                AssetKey: asset.s3ObjectKey,
            },
        });
        // THEN
        const assembly = app.synth();
        const template = assertions_1.Template.fromStack(parent).toJSON();
        // two sets of asset parameters: one for the nested stack itself and one as a proxy for the asset within the stack
        expect(template.Parameters).toEqual({
            AssetParametersdb01ee2eb7adc7915e364dc410d861e569543f9be3761d535a68d5c2cc181281S3BucketC188F637: { Type: 'String', Description: 'S3 bucket for asset "db01ee2eb7adc7915e364dc410d861e569543f9be3761d535a68d5c2cc181281"' },
            AssetParametersdb01ee2eb7adc7915e364dc410d861e569543f9be3761d535a68d5c2cc181281S3VersionKeyC7F4DBF2: { Type: 'String', Description: 'S3 key for asset version "db01ee2eb7adc7915e364dc410d861e569543f9be3761d535a68d5c2cc181281"' },
            AssetParametersdb01ee2eb7adc7915e364dc410d861e569543f9be3761d535a68d5c2cc181281ArtifactHash373B14D2: { Type: 'String', Description: 'Artifact hash for asset "db01ee2eb7adc7915e364dc410d861e569543f9be3761d535a68d5c2cc181281"' },
            AssetParameters46b107d6db798ca46046b8669d057a4debcbdbaaddb6170400748c2f9e4f9d71S3Bucket3C4265E9: { Type: 'String', Description: 'S3 bucket for asset "46b107d6db798ca46046b8669d057a4debcbdbaaddb6170400748c2f9e4f9d71"' },
            AssetParameters46b107d6db798ca46046b8669d057a4debcbdbaaddb6170400748c2f9e4f9d71S3VersionKey8E981535: { Type: 'String', Description: 'S3 key for asset version "46b107d6db798ca46046b8669d057a4debcbdbaaddb6170400748c2f9e4f9d71"' },
            AssetParameters46b107d6db798ca46046b8669d057a4debcbdbaaddb6170400748c2f9e4f9d71ArtifactHash45A28583: { Type: 'String', Description: 'Artifact hash for asset "46b107d6db798ca46046b8669d057a4debcbdbaaddb6170400748c2f9e4f9d71"' },
        });
        // asset proxy parameters are passed to the nested stack
        assertions_1.Template.fromStack(parent).hasResourceProperties('AWS::CloudFormation::Stack', {
            Parameters: {
                referencetoParentStackAssetParametersdb01ee2eb7adc7915e364dc410d861e569543f9be3761d535a68d5c2cc181281S3Bucket82C55B96Ref: { Ref: 'AssetParametersdb01ee2eb7adc7915e364dc410d861e569543f9be3761d535a68d5c2cc181281S3BucketC188F637' },
                referencetoParentStackAssetParametersdb01ee2eb7adc7915e364dc410d861e569543f9be3761d535a68d5c2cc181281S3VersionKeyA43C3CC6Ref: { Ref: 'AssetParametersdb01ee2eb7adc7915e364dc410d861e569543f9be3761d535a68d5c2cc181281S3VersionKeyC7F4DBF2' },
            },
        });
        // parent stack should have 2 assets
        expect(assembly.getStackByName(parent.stackName).assets.length).toEqual(2);
    });
    test('docker image assets are wired through the top-level stack', () => {
        // GIVEN
        const app = new core_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const parent = new core_1.Stack(app, 'my-stack');
        const nested = new nested_stack_1.NestedStack(parent, 'nested-stack');
        // WHEN
        const location = nested.synthesizer.addDockerImageAsset({
            directoryName: 'my-image',
            dockerBuildArgs: { key: 'value', boom: 'bam' },
            dockerBuildTarget: 'buildTarget',
            sourceHash: 'hash-of-source',
        });
        // use the asset, so the parameters will be wired.
        new sns.Topic(nested, 'MyTopic', {
            displayName: `image location is ${location.imageUri}`,
        });
        // THEN
        const asm = app.synth();
        expect(asm.getStackArtifact(parent.artifactId).assets).toEqual([
            {
                repositoryName: 'aws-cdk/assets',
                imageTag: 'hash-of-source',
                id: 'hash-of-source',
                packaging: 'container-image',
                path: 'my-image',
                sourceHash: 'hash-of-source',
                buildArgs: { key: 'value', boom: 'bam' },
                target: 'buildTarget',
            },
            {
                path: 'mystacknestedstackFAE12FB5.nested.template.json',
                id: 'fcdaee79eb79f37eca3a9b1cc0cc9ba150e4eea8c5d6d0c343cb6cd9dc68e2e5',
                packaging: 'file',
                sourceHash: 'fcdaee79eb79f37eca3a9b1cc0cc9ba150e4eea8c5d6d0c343cb6cd9dc68e2e5',
                s3BucketParameter: 'AssetParametersfcdaee79eb79f37eca3a9b1cc0cc9ba150e4eea8c5d6d0c343cb6cd9dc68e2e5S3Bucket67A749F8',
                s3KeyParameter: 'AssetParametersfcdaee79eb79f37eca3a9b1cc0cc9ba150e4eea8c5d6d0c343cb6cd9dc68e2e5S3VersionKeyE1E6A8D4',
                artifactHashParameter: 'AssetParametersfcdaee79eb79f37eca3a9b1cc0cc9ba150e4eea8c5d6d0c343cb6cd9dc68e2e5ArtifactHash0AEDBE8A',
            },
        ]);
    });
    test('metadata defined in nested stacks is reported at the parent stack level in the cloud assembly', () => {
        // GIVEN
        const app = new core_1.App({ stackTraces: false });
        const parent = new core_1.Stack(app, 'parent');
        const child = new core_1.Stack(parent, 'child');
        const nested = new nested_stack_1.NestedStack(child, 'nested');
        const resource = new core_1.CfnResource(nested, 'resource', { type: 'foo' });
        // WHEN
        resource.node.addMetadata('foo', 'bar');
        // THEN: the first non-nested stack records the assembly metadata
        const asm = app.synth();
        expect(asm.stacks.length).toEqual(2); // only one stack is defined as an artifact
        expect(asm.getStackByName(parent.stackName).findMetadataByType('foo')).toEqual([]);
        expect(asm.getStackByName(child.stackName).findMetadataByType('foo')).toEqual([
            {
                path: '/parent/child/nested/resource',
                type: 'foo',
                data: 'bar',
            },
        ]);
    });
    test('referencing attributes with period across stacks', () => {
        // GIVEN
        const parent = new core_1.Stack();
        const nested = new nested_stack_1.NestedStack(parent, 'nested');
        const consumed = new core_1.CfnResource(nested, 'resource-in-nested', { type: 'CONSUMED' });
        // WHEN
        new core_1.CfnResource(parent, 'resource-in-parent', {
            type: 'CONSUMER',
            properties: {
                ConsumedAttribute: consumed.getAtt('Consumed.Attribute'),
            },
        });
        // THEN
        assertions_1.Template.fromStack(nested).templateMatches({
            Resources: {
                resourceinnested: {
                    Type: 'CONSUMED',
                },
            },
            Outputs: {
                nestedresourceinnested59B1F01CConsumedAttribute: {
                    Value: {
                        'Fn::GetAtt': [
                            'resourceinnested',
                            'Consumed.Attribute',
                        ],
                    },
                },
            },
        });
        assertions_1.Template.fromStack(parent).hasResourceProperties('CONSUMER', {
            ConsumedAttribute: {
                'Fn::GetAtt': [
                    'nestedNestedStacknestedNestedStackResource3DD143BF',
                    'Outputs.nestedresourceinnested59B1F01CConsumedAttribute',
                ],
            },
        });
    });
    test('missing context in nested stack is reported if the context is not available', () => {
        // GIVEN
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'ParentStack', { env: { account: '1234account', region: 'us-east-44' } });
        const nestedStack = new nested_stack_1.NestedStack(stack, 'nested');
        const provider = 'availability-zones';
        const expectedKey = core_1.ContextProvider.getKey(nestedStack, {
            provider,
        }).key;
        // WHEN
        core_1.ContextProvider.getValue(nestedStack, {
            provider,
            dummyValue: ['dummy1a', 'dummy1b', 'dummy1c'],
        });
        // THEN: missing context is reported in the cloud assembly
        const asm = app.synth();
        const missing = asm.manifest.missing;
        expect(missing && missing.find(m => {
            return (m.key === expectedKey);
        })).toBeTruthy();
    });
    test('3-level stacks: legacy synthesizer parameters are added to the middle-level stack', () => {
        // GIVEN
        const app = new core_1.App();
        const top = new core_1.Stack(app, 'stack', {
            synthesizer: new core_1.LegacyStackSynthesizer(),
        });
        const middle = new nested_stack_1.NestedStack(top, 'nested1');
        const bottom = new nested_stack_1.NestedStack(middle, 'nested2');
        // WHEN
        new core_1.CfnResource(bottom, 'Something', {
            type: 'BottomLevel',
        });
        // THEN
        const asm = app.synth();
        const middleTemplate = JSON.parse(fs.readFileSync(path.join(asm.directory, middle.templateFile), { encoding: 'utf-8' }));
        const hash = 'bc3c51e4d3545ee0a0069401e5a32c37b66d044b983f12de416ba1576ecaf0a4';
        expect(middleTemplate.Parameters ?? {}).toEqual({
            [`referencetostackAssetParameters${hash}S3BucketD7C30435Ref`]: {
                Type: 'String',
            },
            [`referencetostackAssetParameters${hash}S3VersionKeyB667DBE1Ref`]: {
                Type: 'String',
            },
        });
    });
    test('references to a resource from a deeply nested stack', () => {
        // GIVEN
        const app = new core_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const top = new core_1.Stack(app, 'stack');
        const topLevel = new core_1.CfnResource(top, 'toplevel', { type: 'TopLevel' });
        const nested1 = new nested_stack_1.NestedStack(top, 'nested1');
        const nested2 = new nested_stack_1.NestedStack(nested1, 'nested2');
        // WHEN
        new core_1.CfnResource(nested2, 'refToTopLevel', {
            type: 'BottomLevel',
            properties: { RefToTopLevel: topLevel.ref },
        });
        // THEN
        assertions_1.Template.fromStack(top).hasResourceProperties('AWS::CloudFormation::Stack', {
            Parameters: {
                referencetostackAssetParameters842982bd421cce9742ba27151ef12ed699d44d22801f41e8029f63f2358a3f2fS3Bucket5DA5D2E7Ref: {
                    Ref: 'AssetParameters842982bd421cce9742ba27151ef12ed699d44d22801f41e8029f63f2358a3f2fS3BucketDD4D96B5',
                },
                referencetostackAssetParameters842982bd421cce9742ba27151ef12ed699d44d22801f41e8029f63f2358a3f2fS3VersionKey8FBE5C12Ref: {
                    Ref: 'AssetParameters842982bd421cce9742ba27151ef12ed699d44d22801f41e8029f63f2358a3f2fS3VersionKey83E381F3',
                },
                referencetostacktoplevelBB16BF13Ref: {
                    Ref: 'toplevel',
                },
            },
        });
        assertions_1.Template.fromStack(nested1).hasResourceProperties('AWS::CloudFormation::Stack', {
            Parameters: {
                referencetostacktoplevelBB16BF13Ref: {
                    Ref: 'referencetostacktoplevelBB16BF13Ref',
                },
            },
        });
        assertions_1.Template.fromStack(nested2).templateMatches({
            Resources: {
                refToTopLevel: {
                    Type: 'BottomLevel',
                    Properties: {
                        RefToTopLevel: {
                            Ref: 'referencetostacktoplevelBB16BF13Ref',
                        },
                    },
                },
            },
            Parameters: {
                referencetostacktoplevelBB16BF13Ref: {
                    Type: 'String',
                },
            },
        });
    });
    test('bottom nested stack consumes value from a top-level stack through a parameter in a middle nested stack', () => {
        // GIVEN
        const app = new core_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const top = new core_1.Stack(app, 'Grandparent');
        const middle = new nested_stack_1.NestedStack(top, 'Parent');
        const bottom = new nested_stack_1.NestedStack(middle, 'Child');
        const resourceInGrandparent = new core_1.CfnResource(top, 'ResourceInGrandparent', { type: 'ResourceInGrandparent' });
        // WHEN
        new core_1.CfnResource(bottom, 'ResourceInChild', {
            type: 'ResourceInChild',
            properties: {
                RefToGrandparent: resourceInGrandparent.ref,
            },
        });
        // THEN
        // this is the name allocated for the parameter that's propagated through
        // the hierarchy.
        const paramName = 'referencetoGrandparentResourceInGrandparent010E997ARef';
        // child (bottom) references through a parameter.
        assertions_1.Template.fromStack(bottom).templateMatches({
            Resources: {
                ResourceInChild: {
                    Type: 'ResourceInChild',
                    Properties: {
                        RefToGrandparent: { Ref: paramName },
                    },
                },
            },
            Parameters: {
                [paramName]: { Type: 'String' },
            },
        });
        // the parent (middle) sets the value of this parameter to be a reference to another parameter
        assertions_1.Template.fromStack(middle).hasResourceProperties('AWS::CloudFormation::Stack', {
            Parameters: {
                [paramName]: { Ref: paramName },
            },
        });
        // grandparent (top) assigns the actual value to the parameter
        assertions_1.Template.fromStack(top).hasResourceProperties('AWS::CloudFormation::Stack', {
            Parameters: {
                [paramName]: { Ref: 'ResourceInGrandparent' },
                // these are for the asset of the bottom nested stack
                referencetoGrandparentAssetParameters3208f43b793a1dbe28ca02cf31fb975489071beb42c492b22dc3d32decc3b4b7S3Bucket06EEE58DRef: {
                    Ref: 'AssetParameters3208f43b793a1dbe28ca02cf31fb975489071beb42c492b22dc3d32decc3b4b7S3Bucket01877C2E',
                },
                referencetoGrandparentAssetParameters3208f43b793a1dbe28ca02cf31fb975489071beb42c492b22dc3d32decc3b4b7S3VersionKeyD3B04909Ref: {
                    Ref: 'AssetParameters3208f43b793a1dbe28ca02cf31fb975489071beb42c492b22dc3d32decc3b4b7S3VersionKey5765F084',
                },
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVzdGVkLXN0YWNrLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZXN0ZWQtc3RhY2sudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFDN0Isb0RBQStDO0FBQy9DLG9EQUFvRDtBQUNwRCx3Q0FBd0M7QUFDeEMsOERBQThEO0FBQzlELHdDQUFzSDtBQUN0SCx5Q0FBeUM7QUFDekMsMkNBQXVDO0FBQ3ZDLHNEQUFrRDtBQUVsRCwrQ0FBK0M7QUFDL0MsNEJBQTRCO0FBRTVCLG9DQUFrQixDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUU7SUFDckMsSUFBSSxDQUFDLDRCQUE0QixFQUFFLEdBQUcsRUFBRTtRQUN0QyxPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksMEJBQVcsQ0FBQyxTQUFnQixFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHFEQUFxRCxDQUFDLENBQUM7SUFDekgsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMseUNBQXlDLEVBQUUsR0FBRyxFQUFFO1FBQ25ELFFBQVE7UUFDUixNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQUcsRUFBRSxDQUFDO1FBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksc0JBQVMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFMUMsT0FBTztRQUNQLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLDBCQUFXLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7UUFDL0csTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksMEJBQVcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsMERBQTBELENBQUMsQ0FBQztJQUNsSCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxrRUFBa0UsRUFB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QUFFO2dCQUNWLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFO2FBQ2hDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsOERBQThEO1FBQzlELHFCQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDRCQUE0QixFQUFFO1lBQzFFLFVBQVUsRUFBRTtnQkFDVixDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLHVCQUF1QixFQUFFO2dCQUU3QyxxREFBcUQ7Z0JBQ3JELHdIQUF3SCxFQUFFO29CQUN4SCxHQUFHLEVBQUUsaUdBQWlHO2lCQUN2RztnQkFDRCw0SEFBNEgsRUFBRTtvQkFDNUgsR0FBRyxFQUFFLHFHQUFxRztpQkFDM0c7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIHMzX2Fzc2V0cyBmcm9tICdAYXdzLWNkay9hd3MtczMtYXNzZXRzJztcbmltcG9ydCAqIGFzIHNucyBmcm9tICdAYXdzLWNkay9hd3Mtc25zJztcbmltcG9ydCB7IGRlc2NyaWJlRGVwcmVjYXRlZCB9IGZyb20gJ0Bhd3MtY2RrL2Nkay1idWlsZC10b29scyc7XG5pbXBvcnQgeyBBcHAsIENmblBhcmFtZXRlciwgQ2ZuUmVzb3VyY2UsIENvbnRleHRQcm92aWRlciwgTGVnYWN5U3RhY2tTeW50aGVzaXplciwgTmFtZXMsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBOZXN0ZWRTdGFjayB9IGZyb20gJy4uL2xpYi9uZXN0ZWQtc3RhY2snO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBAYXdzLWNkay9uby1jb3JlLWNvbnN0cnVjdCAqL1xuLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqL1xuXG5kZXNjcmliZURlcHJlY2F0ZWQoJ05lc3RlZFN0YWNrJywgKCkgPT4ge1xuICB0ZXN0KCdmYWlscyBpZiBkZWZpbmVkIGFzIGEgcm9vdCcsICgpID0+IHtcbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IG5ldyBOZXN0ZWRTdGFjayh1bmRlZmluZWQgYXMgYW55LCAnYm9vbScpKS50b1Rocm93KC9OZXN0ZWQgc3RhY2tzIGNhbm5vdCBiZSBkZWZpbmVkIGFzIGEgcm9vdCBjb25zdHJ1Y3QvKTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgaWYgZGVmaW5lZCB3aXRob3V0IGEgcGFyZW50IHN0YWNrJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IGdyb3VwID0gbmV3IENvbnN0cnVjdChhcHAsICdncm91cCcpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBuZXcgTmVzdGVkU3RhY2soYXBwLCAnYm9vbScpKS50b1Rocm93KC9tdXN0IGJlIGRlZmluZWQgd2l0aGluIHNjb3BlIG9mIGFub3RoZXIgbm9uLW5lc3RlZCBzdGFjay8pO1xuICAgIGV4cGVjdCgoKSA9PiBuZXcgTmVzdGVkU3RhY2soZ3JvdXAsICdiYW0nKSkudG9UaHJvdygvbXVzdCBiZSBkZWZpbmVkIHdpdGhpbiBzY29wZSBvZiBhbm90aGVyIG5vbi1uZXN0ZWQgc3RhY2svKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGJlIGRlZmluZWQgYXMgYSBkaXJlY3QgY2hpbGQgb3IgYW4gaW5kaXJlY3QgY2hpbGQgb2YgYSBTdGFjaycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHBhcmVudCA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBuZXcgTmVzdGVkU3RhY2socGFyZW50LCAnZGlyZWN0JykpLm5vdC50b1Rocm93KCk7XG4gICAgZXhwZWN0KCgpID0+IG5ldyBOZXN0ZWRTdGFjayhuZXcgQ29uc3RydWN0KHBhcmVudCwgJ2dyb3VwJyksICdpbmRpcmVjdCcpKS5ub3QudG9UaHJvdygpO1xuICB9KTtcblxuICB0ZXN0KCduZXN0ZWQgc3RhY2sgaXMgbm90IHN5bnRoZXNpemVkIGFzIGEgc3RhY2sgYXJ0aWZhY3QgaW50byB0aGUgYXNzZW1ibHknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHsgY29udGV4dDogeyBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UgfSB9KTtcbiAgICBjb25zdCBwYXJlbnRTdGFjayA9IG5ldyBTdGFjayhhcHAsICdwYXJlbnQtc3RhY2snKTtcbiAgICBuZXcgTmVzdGVkU3RhY2socGFyZW50U3RhY2ssICduZXN0ZWQtc3RhY2snKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChhc3NlbWJseS5hcnRpZmFjdHMubGVuZ3RoKS50b0VxdWFsKDIpO1xuICB9KTtcblxuICB0ZXN0KCd0aGUgdGVtcGxhdGUgb2YgdGhlIG5lc3RlZCBzdGFjayBpcyBzeW50aGVzaXplZCBpbnRvIHRoZSBjbG91ZCBhc3NlbWJseScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBwYXJlbnQgPSBuZXcgU3RhY2soYXBwLCAncGFyZW50LXN0YWNrJyk7XG4gICAgY29uc3QgbmVzdGVkID0gbmV3IE5lc3RlZFN0YWNrKHBhcmVudCwgJ25lc3RlZC1zdGFjaycpO1xuICAgIG5ldyBDZm5SZXNvdXJjZShuZXN0ZWQsICdSZXNvdXJjZUluTmVzdGVkU3RhY2snLCB7IHR5cGU6ICdBV1M6OlJlc291cmNlOjpOZXN0ZWQnIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgdGVtcGxhdGUgPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oYXNzZW1ibHkuZGlyZWN0b3J5LCBgJHtOYW1lcy51bmlxdWVJZChuZXN0ZWQpfS5uZXN0ZWQudGVtcGxhdGUuanNvbmApLCAndXRmLTgnKSk7XG4gICAgZXhwZWN0KHRlbXBsYXRlKS50b0VxdWFsKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBSZXNvdXJjZUluTmVzdGVkU3RhY2s6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpSZXNvdXJjZTo6TmVzdGVkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZpbGUgYXNzZXQgbWV0YWRhdGEgaXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBwYXJlbnQgc3RhY2snLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHsgY29udGV4dDogeyBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UgfSB9KTtcbiAgICBjb25zdCBwYXJlbnQgPSBuZXcgU3RhY2soYXBwLCAncGFyZW50LXN0YWNrJyk7XG4gICAgY29uc3QgbmVzdGVkID0gbmV3IE5lc3RlZFN0YWNrKHBhcmVudCwgJ25lc3RlZC1zdGFjaycpO1xuICAgIG5ldyBDZm5SZXNvdXJjZShuZXN0ZWQsICdSZXNvdXJjZUluTmVzdGVkU3RhY2snLCB7IHR5cGU6ICdBV1M6OlJlc291cmNlOjpOZXN0ZWQnIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHBhcmVudC5zdGFja05hbWUpLmFzc2V0cykudG9FcXVhbChbe1xuICAgICAgcGF0aDogJ3BhcmVudHN0YWNrbmVzdGVkc3RhY2s4NDQ4OTJDMC5uZXN0ZWQudGVtcGxhdGUuanNvbicsXG4gICAgICBpZDogJ2M2MzljMGE1ZTczMjA3NThhYTIyNTg5NjY5ZWNlYmM5OGYxODViNzExMzAwYjA3NGY1Mzk5OGM4ZjlhNDUwOTYnLFxuICAgICAgcGFja2FnaW5nOiAnZmlsZScsXG4gICAgICBzb3VyY2VIYXNoOiAnYzYzOWMwYTVlNzMyMDc1OGFhMjI1ODk2NjllY2ViYzk4ZjE4NWI3MTEzMDBiMDc0ZjUzOTk4YzhmOWE0NTA5NicsXG4gICAgICBzM0J1Y2tldFBhcmFtZXRlcjogJ0Fzc2V0UGFyYW1ldGVyc2M2MzljMGE1ZTczMjA3NThhYTIyNTg5NjY5ZWNlYmM5OGYxODViNzExMzAwYjA3NGY1Mzk5OGM4ZjlhNDUwOTZTM0J1Y2tldERBOEMzMzQ1JyxcbiAgICAgIHMzS2V5UGFyYW1ldGVyOiAnQXNzZXRQYXJhbWV0ZXJzYzYzOWMwYTVlNzMyMDc1OGFhMjI1ODk2NjllY2ViYzk4ZjE4NWI3MTEzMDBiMDc0ZjUzOTk4YzhmOWE0NTA5NlMzVmVyc2lvbktleTA5RDAzRUU2JyxcbiAgICAgIGFydGlmYWN0SGFzaFBhcmFtZXRlcjogJ0Fzc2V0UGFyYW1ldGVyc2M2MzljMGE1ZTczMjA3NThhYTIyNTg5NjY5ZWNlYmM5OGYxODViNzExMzAwYjA3NGY1Mzk5OGM4ZjlhNDUwOTZBcnRpZmFjdEhhc2g4REU0NTBDNycsXG4gICAgfV0pO1xuICB9KTtcblxuICB0ZXN0KCdhd3M6OmNsb3VkZm9ybWF0aW9uOjpzdGFjayBpcyBzeW50aGVzaXplZCBpbiB0aGUgcGFyZW50IHNjb3BlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7IGNvbnRleHQ6IHsgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlIH0gfSk7XG4gICAgY29uc3QgcGFyZW50ID0gbmV3IFN0YWNrKGFwcCwgJ3BhcmVudC1zdGFjaycpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IG5lc3RlZCA9IG5ldyBOZXN0ZWRTdGFjayhwYXJlbnQsICduZXN0ZWQtc3RhY2snKTtcbiAgICBuZXcgQ2ZuUmVzb3VyY2UobmVzdGVkLCAnUmVzb3VyY2VJbk5lc3RlZFN0YWNrJywgeyB0eXBlOiAnQVdTOjpSZXNvdXJjZTo6TmVzdGVkJyB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuXG4gICAgLy8gYXNzZW1ibHkgaGFzIG9uZSBzdGFjayAodGhlIHBhcmVudClcbiAgICBleHBlY3QoYXNzZW1ibHkuc3RhY2tzLmxlbmd0aCkudG9FcXVhbCgxKTtcblxuICAgIC8vIGJ1dCB0aGlzIHN0YWNrIGhhcyBhbiBhc3NldCB0aGF0IHBvaW50cyB0byB0aGUgc3ludGhlc2l6ZWQgdGVtcGxhdGVcbiAgICBleHBlY3QoYXNzZW1ibHkuc3RhY2tzWzBdLmFzc2V0c1swXS5wYXRoKS50b0VxdWFsKCdwYXJlbnRzdGFja25lc3RlZHN0YWNrODQ0ODkyQzAubmVzdGVkLnRlbXBsYXRlLmpzb24nKTtcblxuICAgIC8vIHRoZSB0ZW1wbGF0ZSBpbmNsdWRlcyBvdXIgcmVzb3VyY2VcbiAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihhc3NlbWJseS5kaXJlY3RvcnksIGFzc2VtYmx5LnN0YWNrc1swXS5hc3NldHNbMF0ucGF0aCk7XG4gICAgZXhwZWN0KEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoKS50b1N0cmluZygndXRmLTgnKSkpLnRvRXF1YWwoe1xuICAgICAgUmVzb3VyY2VzOiB7IFJlc291cmNlSW5OZXN0ZWRTdGFjazogeyBUeXBlOiAnQVdTOjpSZXNvdXJjZTo6TmVzdGVkJyB9IH0sXG4gICAgfSk7XG5cbiAgICAvLyB0aGUgcGFyZW50IHRlbXBsYXRlIGluY2x1ZGVzIHRoZSBwYXJhbWV0ZXJzIGFuZCB0aGUgbmVzdGVkIHN0YWNrIHJlc291cmNlIHdoaWNoIHBvaW50cyB0byB0aGUgczMgdXJsXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHBhcmVudCkudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBuZXN0ZWRzdGFja05lc3RlZFN0YWNrbmVzdGVkc3RhY2tOZXN0ZWRTdGFja1Jlc291cmNlNzFDREQyNDE6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpDbG91ZEZvcm1hdGlvbjo6U3RhY2snLFxuICAgICAgICAgIERlbGV0aW9uUG9saWN5OiAnRGVsZXRlJyxcbiAgICAgICAgICBVcGRhdGVSZXBsYWNlUG9saWN5OiAnRGVsZXRlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBUZW1wbGF0ZVVSTDoge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgJ2h0dHBzOi8vczMuJyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICcuJyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpVUkxTdWZmaXgnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICcvJyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQXNzZXRQYXJhbWV0ZXJzYzYzOWMwYTVlNzMyMDc1OGFhMjI1ODk2NjllY2ViYzk4ZjE4NWI3MTEzMDBiMDc0ZjUzOTk4YzhmOWE0NTA5NlMzQnVja2V0REE4QzMzNDUnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICcvJyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnfHwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQXNzZXRQYXJhbWV0ZXJzYzYzOWMwYTVlNzMyMDc1OGFhMjI1ODk2NjllY2ViYzk4ZjE4NWI3MTEzMDBiMDc0ZjUzOTk4YzhmOWE0NTA5NlMzVmVyc2lvbktleTA5RDAzRUU2JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICdGbjo6U2VsZWN0JzogW1xuICAgICAgICAgICAgICAgICAgICAgIDEsXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ3x8JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0Fzc2V0UGFyYW1ldGVyc2M2MzljMGE1ZTczMjA3NThhYTIyNTg5NjY5ZWNlYmM5OGYxODViNzExMzAwYjA3NGY1Mzk5OGM4ZjlhNDUwOTZTM1ZlcnNpb25LZXkwOUQwM0VFNicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgUGFyYW1ldGVyczoge1xuICAgICAgICBBc3NldFBhcmFtZXRlcnNjNjM5YzBhNWU3MzIwNzU4YWEyMjU4OTY2OWVjZWJjOThmMTg1YjcxMTMwMGIwNzRmNTM5OThjOGY5YTQ1MDk2UzNCdWNrZXREQThDMzM0NToge1xuICAgICAgICAgIFR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIERlc2NyaXB0aW9uOiAnUzMgYnVja2V0IGZvciBhc3NldCBcImM2MzljMGE1ZTczMjA3NThhYTIyNTg5NjY5ZWNlYmM5OGYxODViNzExMzAwYjA3NGY1Mzk5OGM4ZjlhNDUwOTZcIicsXG4gICAgICAgIH0sXG4gICAgICAgIEFzc2V0UGFyYW1ldGVyc2M2MzljMGE1ZTczMjA3NThhYTIyNTg5NjY5ZWNlYmM5OGYxODViNzExMzAwYjA3NGY1Mzk5OGM4ZjlhNDUwOTZTM1ZlcnNpb25LZXkwOUQwM0VFNjoge1xuICAgICAgICAgIFR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIERlc2NyaXB0aW9uOiAnUzMga2V5IGZvciBhc3NldCB2ZXJzaW9uIFwiYzYzOWMwYTVlNzMyMDc1OGFhMjI1ODk2NjllY2ViYzk4ZjE4NWI3MTEzMDBiMDc0ZjUzOTk4YzhmOWE0NTA5NlwiJyxcbiAgICAgICAgfSxcbiAgICAgICAgQXNzZXRQYXJhbWV0ZXJzYzYzOWMwYTVlNzMyMDc1OGFhMjI1ODk2NjllY2ViYzk4ZjE4NWI3MTEzMDBiMDc0ZjUzOTk4YzhmOWE0NTA5NkFydGlmYWN0SGFzaDhERTQ1MEM3OiB7XG4gICAgICAgICAgVHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgRGVzY3JpcHRpb246ICdBcnRpZmFjdCBoYXNoIGZvciBhc3NldCBcImM2MzljMGE1ZTczMjA3NThhYTIyNTg5NjY5ZWNlYmM5OGYxODViNzExMzAwYjA3NGY1Mzk5OGM4ZjlhNDUwOTZcIicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdTdGFjay5vZigpJywgKCkgPT4ge1xuICAgIGNsYXNzIE15TmVzdGVkU3RhY2sgZXh0ZW5kcyBOZXN0ZWRTdGFjayB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgc3RhY2tPZkNoaWxkOiBTdGFjaztcblxuICAgICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgICAgIGNvbnN0IHBhcmFtID0gbmV3IENmblBhcmFtZXRlcih0aGlzLCAncGFyYW0nLCB7IHR5cGU6ICdTdHJpbmcnIH0pO1xuICAgICAgICB0aGlzLnN0YWNrT2ZDaGlsZCA9IFN0YWNrLm9mKHBhcmFtKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBwYXJlbnQgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBuZXN0ZWQgPSBuZXcgTXlOZXN0ZWRTdGFjayhwYXJlbnQsICduZXN0ZWQnKTtcblxuICAgIGV4cGVjdChuZXN0ZWQuc3RhY2tPZkNoaWxkKS50b0VxdWFsKG5lc3RlZCk7XG4gICAgZXhwZWN0KFN0YWNrLm9mKG5lc3RlZCkpLnRvRXF1YWwobmVzdGVkKTtcbiAgfSk7XG5cbiAgdGVzdCgncmVmZXJlbmNlcyB3aXRoaW4gdGhlIG5lc3RlZCBzdGFjayBhcmUgbm90IHJlcG9ydGVkIGFzIGNyb3NzIHN0YWNrIHJlZmVyZW5jZXMnLCAoKSA9PiB7XG4gICAgY2xhc3MgTXlOZXN0ZWRTdGFjayBleHRlbmRzIE5lc3RlZFN0YWNrIHtcbiAgICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgICAgICBjb25zdCBwYXJhbSA9IG5ldyBDZm5QYXJhbWV0ZXIodGhpcywgJ3BhcmFtJywgeyB0eXBlOiAnU3RyaW5nJyB9KTtcbiAgICAgICAgbmV3IENmblJlc291cmNlKHRoaXMsICdyZXNvdXJjZScsIHtcbiAgICAgICAgICB0eXBlOiAnTXk6OlJlc291cmNlJyxcbiAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBTb21lUHJvcDogcGFyYW0udmFsdWVBc1N0cmluZyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHsgY29udGV4dDogeyBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UgfSB9KTtcbiAgICBjb25zdCBwYXJlbnQgPSBuZXcgU3RhY2soYXBwLCAncGFyZW50Jyk7XG5cbiAgICBuZXcgTXlOZXN0ZWRTdGFjayhwYXJlbnQsICduZXN0ZWQnKTtcblxuICAgIC8vIHJlZmVyZW5jZXMgYXJlIGFkZGVkIGR1cmluZyBcInByZXBhcmVcIlxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG5cbiAgICBleHBlY3QoYXNzZW1ibHkuc3RhY2tzLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoYXNzZW1ibHkuc3RhY2tzWzBdLmRlcGVuZGVuY2llcykudG9FcXVhbChbXSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3JlZmVyZW5jZXMgdG8gYSByZXNvdXJjZSBmcm9tIHRoZSBwYXJlbnQgc3RhY2sgaW4gYSBuZXN0ZWQgc3RhY2sgaXMgdHJhbnNsYXRlZCBpbnRvIGEgY2ZuIHBhcmFtZXRlcicsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY2xhc3MgTXlOZXN0ZWRTdGFjayBleHRlbmRzIE5lc3RlZFN0YWNrIHtcblxuICAgICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcmVzb3VyY2VGcm9tUGFyZW50OiBDZm5SZXNvdXJjZSkge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgICAgIG5ldyBDZm5SZXNvdXJjZSh0aGlzLCAncmVzb3VyY2UnLCB7XG4gICAgICAgICAgdHlwZTogJ0FXUzo6Q2hpbGQ6OlJlc291cmNlJyxcbiAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBSZWZlcmVuY2VUb1Jlc291cmNlSW5QYXJlbnRTdGFjazogcmVzb3VyY2VGcm9tUGFyZW50LnJlZixcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICBuZXcgQ2ZuUmVzb3VyY2UodGhpcywgJ3Jlc291cmNlMicsIHtcbiAgICAgICAgICB0eXBlOiAnTXk6OlJlc291cmNlOjoyJyxcbiAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBQcm9wMTogcmVzb3VyY2VGcm9tUGFyZW50LmdldEF0dCgnQXR0cicpLFxuICAgICAgICAgICAgUHJvcDI6IHJlc291cmNlRnJvbVBhcmVudC5yZWYsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHBhcmVudFN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ3BhcmVudCcpO1xuXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuUmVzb3VyY2UocGFyZW50U3RhY2ssICdwYXJlbnQtcmVzb3VyY2UnLCB7IHR5cGU6ICdBV1M6OlBhcmVudDo6UmVzb3VyY2UnIH0pO1xuXG4gICAgY29uc3QgbmVzdGVkID0gbmV3IE15TmVzdGVkU3RhY2socGFyZW50U3RhY2ssICduZXN0ZWQnLCByZXNvdXJjZSk7XG5cbiAgICAvLyBUSEVOXG4gICAgYXBwLnN5bnRoKCk7XG5cbiAgICAvLyBuZXN0ZWQgdGVtcGxhdGUgc2hvdWxkIHVzZSBhIHBhcmFtZXRlciB0byByZWZlcmVuY2UgdGhlIHJlc291cmNlIGZyb20gdGhlIHBhcmVudCBzdGFja1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhuZXN0ZWQpLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6XG4gICAgICB7XG4gICAgICAgIHJlc291cmNlOlxuICAgICAgICB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6Q2hpbGQ6OlJlc291cmNlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOlxuICAgICAgICAgICAgeyBSZWZlcmVuY2VUb1Jlc291cmNlSW5QYXJlbnRTdGFjazogeyBSZWY6ICdyZWZlcmVuY2V0b3BhcmVudHBhcmVudHJlc291cmNlRDU2RUE4RjdSZWYnIH0gfSxcbiAgICAgICAgfSxcbiAgICAgICAgcmVzb3VyY2UyOlxuICAgICAgICB7XG4gICAgICAgICAgVHlwZTogJ015OjpSZXNvdXJjZTo6MicsXG4gICAgICAgICAgUHJvcGVydGllczpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBQcm9wMTogeyBSZWY6ICdyZWZlcmVuY2V0b3BhcmVudHBhcmVudHJlc291cmNlRDU2RUE4RjdBdHRyJyB9LFxuICAgICAgICAgICAgUHJvcDI6IHsgUmVmOiAncmVmZXJlbmNldG9wYXJlbnRwYXJlbnRyZXNvdXJjZUQ1NkVBOEY3UmVmJyB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgUGFyYW1ldGVyczpcbiAgICAgIHtcbiAgICAgICAgcmVmZXJlbmNldG9wYXJlbnRwYXJlbnRyZXNvdXJjZUQ1NkVBOEY3UmVmOiB7IFR5cGU6ICdTdHJpbmcnIH0sXG4gICAgICAgIHJlZmVyZW5jZXRvcGFyZW50cGFyZW50cmVzb3VyY2VENTZFQThGN0F0dHI6IHsgVHlwZTogJ1N0cmluZycgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBwYXJlbnQgdGVtcGxhdGUgc2hvdWxkIHBhc3MgaW4gdGhlIHZhbHVlIHRocm91Z2ggdGhlIHBhcmFtZXRlclxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhwYXJlbnRTdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkRm9ybWF0aW9uOjpTdGFjaycsIHtcbiAgICAgIFBhcmFtZXRlcnM6IHtcbiAgICAgICAgcmVmZXJlbmNldG9wYXJlbnRwYXJlbnRyZXNvdXJjZUQ1NkVBOEY3UmVmOiB7XG4gICAgICAgICAgUmVmOiAncGFyZW50cmVzb3VyY2UnLFxuICAgICAgICB9LFxuICAgICAgICByZWZlcmVuY2V0b3BhcmVudHBhcmVudHJlc291cmNlRDU2RUE4RjdBdHRyOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAncGFyZW50cmVzb3VyY2UnLFxuICAgICAgICAgICAgJ0F0dHInLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyZWZlcmVuY2VzIHRvIGEgcmVzb3VyY2UgaW4gdGhlIG5lc3RlZCBzdGFjayBpbiB0aGUgcGFyZW50IGlzIHRyYW5zbGF0ZWQgaW50byBhIGNmbiBvdXRwdXQnLCAoKSA9PiB7XG4gICAgY2xhc3MgTXlOZXN0ZWRTdGFjayBleHRlbmRzIE5lc3RlZFN0YWNrIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSByZXNvdXJjZUZyb21DaGlsZDogQ2ZuUmVzb3VyY2U7XG5cbiAgICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgICAgICB0aGlzLnJlc291cmNlRnJvbUNoaWxkID0gbmV3IENmblJlc291cmNlKHRoaXMsICdyZXNvdXJjZScsIHtcbiAgICAgICAgICB0eXBlOiAnQVdTOjpDaGlsZDo6UmVzb3VyY2UnLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3QgcGFyZW50U3RhY2sgPSBuZXcgU3RhY2soYXBwLCAncGFyZW50Jyk7XG5cbiAgICBjb25zdCBuZXN0ZWQgPSBuZXcgTXlOZXN0ZWRTdGFjayhwYXJlbnRTdGFjaywgJ25lc3RlZCcpO1xuXG4gICAgbmV3IENmblJlc291cmNlKHBhcmVudFN0YWNrLCAnYW5vdGhlci1wYXJlbnQtcmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnQVdTOjpQYXJlbnQ6OlJlc291cmNlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgUmVmVG9SZXNvdXJjZUluTmVzdGVkU3RhY2s6IG5lc3RlZC5yZXNvdXJjZUZyb21DaGlsZC5yZWYsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gcmVmZXJlbmNlcyBhcmUgYWRkZWQgZHVyaW5nIFwicHJlcGFyZVwiXG4gICAgYXBwLnN5bnRoKCk7XG5cbiAgICAvLyBuZXN0ZWQgdGVtcGxhdGUgc2hvdWxkIHVzZSBhIHBhcmFtZXRlciB0byByZWZlcmVuY2UgdGhlIHJlc291cmNlIGZyb20gdGhlIHBhcmVudCBzdGFja1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhuZXN0ZWQpLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgcmVzb3VyY2U6IHsgVHlwZTogJ0FXUzo6Q2hpbGQ6OlJlc291cmNlJyB9LFxuICAgICAgfSxcbiAgICAgIE91dHB1dHM6IHtcbiAgICAgICAgcGFyZW50bmVzdGVkcmVzb3VyY2U0RDY4MDY3N1JlZjogeyBWYWx1ZTogeyBSZWY6ICdyZXNvdXJjZScgfSB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIHBhcmVudCB0ZW1wbGF0ZSBzaG91bGQgcGFzcyBpbiB0aGUgdmFsdWUgdGhyb3VnaCB0aGUgcGFyYW1ldGVyXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHBhcmVudFN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UGFyZW50OjpSZXNvdXJjZScsIHtcbiAgICAgIFJlZlRvUmVzb3VyY2VJbk5lc3RlZFN0YWNrOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICduZXN0ZWROZXN0ZWRTdGFja25lc3RlZE5lc3RlZFN0YWNrUmVzb3VyY2UzREQxNDNCRicsXG4gICAgICAgICAgJ091dHB1dHMucGFyZW50bmVzdGVkcmVzb3VyY2U0RDY4MDY3N1JlZicsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCduZXN0ZWQgc3RhY2sgcmVmZXJlbmNlcyBhIHJlc291cmNlIGZyb20gYW5vdGhlciBub24tbmVzdGVkIHN0YWNrIChub3QgdGhlIHBhcmVudCknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHsgY29udGV4dDogeyBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UgfSB9KTtcbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2sxJyk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMicpO1xuICAgIGNvbnN0IG5lc3RlZFVuZGVyU3RhY2sxID0gbmV3IE5lc3RlZFN0YWNrKHN0YWNrMSwgJ05lc3RlZFVuZGVyU3RhY2sxJyk7XG4gICAgY29uc3QgcmVzb3VyY2VJblN0YWNrMiA9IG5ldyBDZm5SZXNvdXJjZShzdGFjazIsICdSZXNvdXJjZUluU3RhY2syJywgeyB0eXBlOiAnTXlSZXNvdXJjZScgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IENmblJlc291cmNlKG5lc3RlZFVuZGVyU3RhY2sxLCAnUmVzb3VyY2VJbk5lc3RlZFN0YWNrMScsIHtcbiAgICAgIHR5cGU6ICdOZXN0ZWQ6OlJlc291cmNlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgUmVmVG9TaWJsaW5nOiByZXNvdXJjZUluU3RhY2syLmdldEF0dCgnTXlBdHRyaWJ1dGUnKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcblxuICAgIC8vIHByb2R1Y2luZyBzdGFjayBzaG91bGQgaGF2ZSBhbiBleHBvcnRcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2syKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIFJlc291cmNlSW5TdGFjazI6IHsgVHlwZTogJ015UmVzb3VyY2UnIH0sXG4gICAgICB9LFxuICAgICAgT3V0cHV0czoge1xuICAgICAgICBFeHBvcnRzT3V0cHV0Rm5HZXRBdHRSZXNvdXJjZUluU3RhY2syTXlBdHRyaWJ1dGVDMTVGMTAwOToge1xuICAgICAgICAgIFZhbHVlOiB7ICdGbjo6R2V0QXR0JzogWydSZXNvdXJjZUluU3RhY2syJywgJ015QXR0cmlidXRlJ10gfSxcbiAgICAgICAgICBFeHBvcnQ6IHsgTmFtZTogJ1N0YWNrMjpFeHBvcnRzT3V0cHV0Rm5HZXRBdHRSZXNvdXJjZUluU3RhY2syTXlBdHRyaWJ1dGVDMTVGMTAwOScgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBuZXN0ZWQgc3RhY2sgdXNlcyBGbjo6SW1wb3J0VmFsdWUgbGlrZSBub3JtYWxcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2sobmVzdGVkVW5kZXJTdGFjazEpLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgUmVzb3VyY2VJbk5lc3RlZFN0YWNrMToge1xuICAgICAgICAgIFR5cGU6ICdOZXN0ZWQ6OlJlc291cmNlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBSZWZUb1NpYmxpbmc6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpJbXBvcnRWYWx1ZSc6ICdTdGFjazI6RXhwb3J0c091dHB1dEZuR2V0QXR0UmVzb3VyY2VJblN0YWNrMk15QXR0cmlidXRlQzE1RjEwMDknLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIHZlcmlmeSBhIGRlcGVkZW5jeSB3YXMgZXN0YWJsaXNoZWQgYmV0d2VlbiB0aGUgcGFyZW50c1xuICAgIGNvbnN0IHN0YWNrMUFydGlmYWN0ID0gYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoc3RhY2sxLnN0YWNrTmFtZSk7XG4gICAgY29uc3Qgc3RhY2syQXJ0aWZhY3QgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjazIuc3RhY2tOYW1lKTtcbiAgICBleHBlY3Qoc3RhY2sxQXJ0aWZhY3QuZGVwZW5kZW5jaWVzLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICBleHBlY3Qoc3RhY2syQXJ0aWZhY3QuZGVwZW5kZW5jaWVzLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICBleHBlY3Qoc3RhY2sxQXJ0aWZhY3QuZGVwZW5kZW5jaWVzWzBdKS50b0VxdWFsKHN0YWNrMkFydGlmYWN0KTtcbiAgfSk7XG5cbiAgdGVzdCgnbmVzdGVkIHN0YWNrIHdpdGhpbiBhIG5lc3RlZCBzdGFjayByZWZlcmVuY2VzIGEgcmVzb3VyY2UgaW4gYSBzaWJsaW5nIHRvcC1sZXZlbCBzdGFjaycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoeyBjb250ZXh0OiB7IFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSB9IH0pO1xuICAgIGNvbnN0IGNvbnN1bWVyVG9wTGV2ZWwgPSBuZXcgU3RhY2soYXBwLCAnQ29uc3VtZXJUb3BMZXZlbCcpO1xuICAgIGNvbnN0IGNvbnN1bWVyTmVzdGVkMSA9IG5ldyBOZXN0ZWRTdGFjayhjb25zdW1lclRvcExldmVsLCAnQ29uc3VtZXJOZXN0ZWQxJyk7XG4gICAgY29uc3QgY29uc3VtZXJOZXN0ZWQyID0gbmV3IE5lc3RlZFN0YWNrKGNvbnN1bWVyTmVzdGVkMSwgJ0NvbnN1bWVyTmVzdGVkMicpO1xuICAgIGNvbnN0IHByb2R1Y2VyVG9wTGV2ZWwgPSBuZXcgU3RhY2soYXBwLCAnUHJvZHVjZXJUb3BMZXZlbCcpO1xuICAgIGNvbnN0IHByb2R1Y2VyID0gbmV3IENmblJlc291cmNlKHByb2R1Y2VyVG9wTGV2ZWwsICdQcm9kdWNlcicsIHsgdHlwZTogJ1Byb2R1Y2VyJyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQ2ZuUmVzb3VyY2UoY29uc3VtZXJOZXN0ZWQyLCAnQ29uc3VtZXInLCB7XG4gICAgICB0eXBlOiAnQ29uc3VtZXInLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBSZWY6IHByb2R1Y2VyLnJlZixcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgbWFuaWZlc3QgPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCBjb25zdW1lckRlcHMgPSBtYW5pZmVzdC5nZXRTdGFja0FydGlmYWN0KGNvbnN1bWVyVG9wTGV2ZWwuYXJ0aWZhY3RJZCkuZGVwZW5kZW5jaWVzLm1hcChkID0+IGQuaWQpO1xuICAgIGV4cGVjdChjb25zdW1lckRlcHMpLnRvRXF1YWwoWydQcm9kdWNlclRvcExldmVsJ10pO1xuICB9KTtcblxuICB0ZXN0KCdhbm90aGVyIG5vbi1uZXN0ZWQgc3RhY2sgdGFrZXMgYSByZWZlcmVuY2Ugb24gYSByZXNvdXJjZSB3aXRoaW4gdGhlIG5lc3RlZCBzdGFjayAodGhlIHBhcmVudCBleHBvcnRzKScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoeyBjb250ZXh0OiB7IFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSB9IH0pO1xuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdTdGFjazEnKTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJyk7XG4gICAgY29uc3QgbmVzdGVkVW5kZXJTdGFjazEgPSBuZXcgTmVzdGVkU3RhY2soc3RhY2sxLCAnTmVzdGVkVW5kZXJTdGFjazEnKTtcbiAgICBjb25zdCByZXNvdXJjZUluTmVzdGVkU3RhY2sgPSBuZXcgQ2ZuUmVzb3VyY2UobmVzdGVkVW5kZXJTdGFjazEsICdSZXNvdXJjZUluTmVzdGVkU3RhY2snLCB7IHR5cGU6ICdNeVJlc291cmNlJyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2syLCAnUmVzb3VyY2VJblN0YWNrMicsIHtcbiAgICAgIHR5cGU6ICdKdXN0UmVzb3VyY2UnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBSZWZUb1NpYmxpbmc6IHJlc291cmNlSW5OZXN0ZWRTdGFjay5nZXRBdHQoJ015QXR0cmlidXRlJyksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG5cbiAgICAvLyBuZXN0ZWQgc3RhY2sgc2hvdWxkIG91dHB1dCB0aGlzIHZhbHVlIGFzIGlmIGl0IHdhcyByZWZlcmVuY2VkIGJ5IHRoZSBwYXJlbnQgKHdpdGhvdXQgdGhlIGV4cG9ydClcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2sobmVzdGVkVW5kZXJTdGFjazEpLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgUmVzb3VyY2VJbk5lc3RlZFN0YWNrOiB7XG4gICAgICAgICAgVHlwZTogJ015UmVzb3VyY2UnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIE91dHB1dHM6IHtcbiAgICAgICAgU3RhY2sxTmVzdGVkVW5kZXJTdGFjazFSZXNvdXJjZUluTmVzdGVkU3RhY2s2RUU5RENEMk15QXR0cmlidXRlOiB7XG4gICAgICAgICAgVmFsdWU6IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnUmVzb3VyY2VJbk5lc3RlZFN0YWNrJyxcbiAgICAgICAgICAgICAgJ015QXR0cmlidXRlJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBwYXJlbnQgc3RhY2sgKHN0YWNrMSkgc2hvdWxkIGV4cG9ydCB0aGlzIHZhbHVlXG4gICAgZXhwZWN0KGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrMS5zdGFja05hbWUpLnRlbXBsYXRlLk91dHB1dHMpLnRvRXF1YWwoe1xuICAgICAgRXhwb3J0c091dHB1dEZuR2V0QXR0TmVzdGVkVW5kZXJTdGFjazFOZXN0ZWRTdGFja05lc3RlZFVuZGVyU3RhY2sxTmVzdGVkU3RhY2tSZXNvdXJjZUY2MTYzMDVCT3V0cHV0c1N0YWNrMU5lc3RlZFVuZGVyU3RhY2sxUmVzb3VyY2VJbk5lc3RlZFN0YWNrNkVFOURDRDJNeUF0dHJpYnV0ZTU2NEVFQ0YzOiB7XG4gICAgICAgIFZhbHVlOiB7ICdGbjo6R2V0QXR0JzogWydOZXN0ZWRVbmRlclN0YWNrMU5lc3RlZFN0YWNrTmVzdGVkVW5kZXJTdGFjazFOZXN0ZWRTdGFja1Jlc291cmNlRjYxNjMwNUInLCAnT3V0cHV0cy5TdGFjazFOZXN0ZWRVbmRlclN0YWNrMVJlc291cmNlSW5OZXN0ZWRTdGFjazZFRTlEQ0QyTXlBdHRyaWJ1dGUnXSB9LFxuICAgICAgICBFeHBvcnQ6IHsgTmFtZTogJ1N0YWNrMTpFeHBvcnRzT3V0cHV0Rm5HZXRBdHROZXN0ZWRVbmRlclN0YWNrMU5lc3RlZFN0YWNrTmVzdGVkVW5kZXJTdGFjazFOZXN0ZWRTdGFja1Jlc291cmNlRjYxNjMwNUJPdXRwdXRzU3RhY2sxTmVzdGVkVW5kZXJTdGFjazFSZXNvdXJjZUluTmVzdGVkU3RhY2s2RUU5RENEMk15QXR0cmlidXRlNTY0RUVDRjMnIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gY29uc3VtaW5nIHN0YWNrIHNob3VsZCB1c2UgSW1wb3J0VmFsdWUgdG8gaW1wb3J0IHRoZSB2YWx1ZSBmcm9tIHRoZSBwYXJlbnQgc3RhY2tcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2syKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIFJlc291cmNlSW5TdGFjazI6IHtcbiAgICAgICAgICBUeXBlOiAnSnVzdFJlc291cmNlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBSZWZUb1NpYmxpbmc6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpJbXBvcnRWYWx1ZSc6ICdTdGFjazE6RXhwb3J0c091dHB1dEZuR2V0QXR0TmVzdGVkVW5kZXJTdGFjazFOZXN0ZWRTdGFja05lc3RlZFVuZGVyU3RhY2sxTmVzdGVkU3RhY2tSZXNvdXJjZUY2MTYzMDVCT3V0cHV0c1N0YWNrMU5lc3RlZFVuZGVyU3RhY2sxUmVzb3VyY2VJbk5lc3RlZFN0YWNrNkVFOURDRDJNeUF0dHJpYnV0ZTU2NEVFQ0YzJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBleHBlY3QoYXNzZW1ibHkuc3RhY2tzLmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgICBjb25zdCBzdGFjazFBcnRpZmFjdCA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrMS5zdGFja05hbWUpO1xuICAgIGNvbnN0IHN0YWNrMkFydGlmYWN0ID0gYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoc3RhY2syLnN0YWNrTmFtZSk7XG4gICAgZXhwZWN0KHN0YWNrMUFydGlmYWN0LmRlcGVuZGVuY2llcy5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgZXhwZWN0KHN0YWNrMkFydGlmYWN0LmRlcGVuZGVuY2llcy5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KHN0YWNrMkFydGlmYWN0LmRlcGVuZGVuY2llc1swXSkudG9FcXVhbChzdGFjazFBcnRpZmFjdCk7XG4gIH0pO1xuXG4gIHRlc3QoJ3JlZmVyZW5jZXMgYmV0d2VlbiBzaWJsaW5nIG5lc3RlZCBzdGFja3Mgc2hvdWxkIG91dHB1dCBmcm9tIG9uZSBhbmQgZ2V0QXR0IGZyb20gdGhlIG90aGVyJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHBhcmVudCA9IG5ldyBTdGFjayhhcHAsICdQYXJlbnQnKTtcbiAgICBjb25zdCBuZXN0ZWQxID0gbmV3IE5lc3RlZFN0YWNrKHBhcmVudCwgJ05lc3RlZDEnKTtcbiAgICBjb25zdCBuZXN0ZWQyID0gbmV3IE5lc3RlZFN0YWNrKHBhcmVudCwgJ05lc3RlZDInKTtcbiAgICBjb25zdCByZXNvdXJjZTEgPSBuZXcgQ2ZuUmVzb3VyY2UobmVzdGVkMSwgJ1Jlc291cmNlMScsIHsgdHlwZTogJ1Jlc291cmNlMScgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IENmblJlc291cmNlKG5lc3RlZDIsICdSZXNvdXJjZTInLCB7XG4gICAgICB0eXBlOiAnUmVzb3VyY2UyJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgUmVmVG9SZXNvdXJjZTE6IHJlc291cmNlMS5yZWYsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGFwcC5zeW50aCgpO1xuXG4gICAgLy8gcHJvZHVjaW5nIG5lc3RlZCBzdGFja1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhuZXN0ZWQxKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIFJlc291cmNlMToge1xuICAgICAgICAgIFR5cGU6ICdSZXNvdXJjZTEnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIE91dHB1dHM6IHtcbiAgICAgICAgUGFyZW50TmVzdGVkMVJlc291cmNlMTVGM0YwNjU3UmVmOiB7XG4gICAgICAgICAgVmFsdWU6IHtcbiAgICAgICAgICAgIFJlZjogJ1Jlc291cmNlMScsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBjb25zdW1pbmcgbmVzdGVkIHN0YWNrXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKG5lc3RlZDIpLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgUmVzb3VyY2UyOiB7XG4gICAgICAgICAgVHlwZTogJ1Jlc291cmNlMicsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgUmVmVG9SZXNvdXJjZTE6IHtcbiAgICAgICAgICAgICAgUmVmOiAncmVmZXJlbmNldG9QYXJlbnROZXN0ZWQxTmVzdGVkU3RhY2tOZXN0ZWQxTmVzdGVkU3RhY2tSZXNvdXJjZTlDMDUzNDJDT3V0cHV0c1BhcmVudE5lc3RlZDFSZXNvdXJjZTE1RjNGMDY1N1JlZicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgUGFyYW1ldGVyczoge1xuICAgICAgICByZWZlcmVuY2V0b1BhcmVudE5lc3RlZDFOZXN0ZWRTdGFja05lc3RlZDFOZXN0ZWRTdGFja1Jlc291cmNlOUMwNTM0MkNPdXRwdXRzUGFyZW50TmVzdGVkMVJlc291cmNlMTVGM0YwNjU3UmVmOiB7XG4gICAgICAgICAgVHlwZTogJ1N0cmluZycsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gcGFyZW50XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHBhcmVudCkuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkRm9ybWF0aW9uOjpTdGFjaycsIHtcbiAgICAgIFBhcmFtZXRlcnM6IHtcbiAgICAgICAgcmVmZXJlbmNldG9QYXJlbnROZXN0ZWQxTmVzdGVkU3RhY2tOZXN0ZWQxTmVzdGVkU3RhY2tSZXNvdXJjZTlDMDUzNDJDT3V0cHV0c1BhcmVudE5lc3RlZDFSZXNvdXJjZTE1RjNGMDY1N1JlZjoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ05lc3RlZDFOZXN0ZWRTdGFja05lc3RlZDFOZXN0ZWRTdGFja1Jlc291cmNlQ0QwQUQzNkInLFxuICAgICAgICAgICAgJ091dHB1dHMuUGFyZW50TmVzdGVkMVJlc291cmNlMTVGM0YwNjU3UmVmJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnc3RhY2tJZCByZXR1cm5zIEFXUzo6U3RhY2tJZCB3aGVuIHJlZmVyZW5jZWQgZnJvbSB0aGUgY29udGV4dCBvZiB0aGUgbmVzdGVkIHN0YWNrJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgcGFyZW50ID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgbmVzdGVkID0gbmV3IE5lc3RlZFN0YWNrKHBhcmVudCwgJ05lc3RlZFN0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IENmblJlc291cmNlKG5lc3RlZCwgJ05lc3RlZFJlc291cmNlJywge1xuICAgICAgdHlwZTogJ05lc3RlZDo6UmVzb3VyY2UnLFxuICAgICAgcHJvcGVydGllczogeyBNeVN0YWNrSWQ6IG5lc3RlZC5zdGFja0lkIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKG5lc3RlZCkuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdOZXN0ZWQ6OlJlc291cmNlJywge1xuICAgICAgTXlTdGFja0lkOiB7IFJlZjogJ0FXUzo6U3RhY2tJZCcgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnc3RhY2tJZCByZXR1cm5zIHRoZSBSRUYgb2YgdGhlIENsb3VkRm9ybWF0aW9uOjpTdGFjayByZXNvdXJjZSB3aGVuIHJlZmVyZW5jZWQgZnJvbSB0aGUgcGFyZW50IHN0YWNrJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgcGFyZW50ID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgbmVzdGVkID0gbmV3IE5lc3RlZFN0YWNrKHBhcmVudCwgJ05lc3RlZFN0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IENmblJlc291cmNlKHBhcmVudCwgJ1BhcmVudFJlc291cmNlJywge1xuICAgICAgdHlwZTogJ1BhcmVudDo6UmVzb3VyY2UnLFxuICAgICAgcHJvcGVydGllczogeyBOZXN0ZWRTdGFja0lkOiBuZXN0ZWQuc3RhY2tJZCB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhwYXJlbnQpLmhhc1Jlc291cmNlUHJvcGVydGllcygnUGFyZW50OjpSZXNvdXJjZScsIHtcbiAgICAgIE5lc3RlZFN0YWNrSWQ6IHsgUmVmOiAnTmVzdGVkU3RhY2tOZXN0ZWRTdGFja05lc3RlZFN0YWNrTmVzdGVkU3RhY2tSZXNvdXJjZUI3MDgzNEZEJyB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzdGFja05hbWUgcmV0dXJucyBBV1M6OlN0YWNrTmFtZSB3aGVuIHJlZmVyZW5jZWQgZnJvbSB0aGUgY29udGV4dCBvZiB0aGUgbmVzdGVkIHN0YWNrJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgcGFyZW50ID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgbmVzdGVkID0gbmV3IE5lc3RlZFN0YWNrKHBhcmVudCwgJ05lc3RlZFN0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IENmblJlc291cmNlKG5lc3RlZCwgJ05lc3RlZFJlc291cmNlJywge1xuICAgICAgdHlwZTogJ05lc3RlZDo6UmVzb3VyY2UnLFxuICAgICAgcHJvcGVydGllczogeyBNeVN0YWNrTmFtZTogbmVzdGVkLnN0YWNrTmFtZSB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhuZXN0ZWQpLmhhc1Jlc291cmNlUHJvcGVydGllcygnTmVzdGVkOjpSZXNvdXJjZScsIHtcbiAgICAgIE15U3RhY2tOYW1lOiB7IFJlZjogJ0FXUzo6U3RhY2tOYW1lJyB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzdGFja05hbWUgcmV0dXJucyB0aGUgUkVGIG9mIHRoZSBDbG91ZEZvcm1hdGlvbjo6U3RhY2sgcmVzb3VyY2Ugd2hlbiByZWZlcmVuY2VkIGZyb20gdGhlIHBhcmVudCBzdGFjaycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHBhcmVudCA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IG5lc3RlZCA9IG5ldyBOZXN0ZWRTdGFjayhwYXJlbnQsICdOZXN0ZWRTdGFjaycpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBDZm5SZXNvdXJjZShwYXJlbnQsICdQYXJlbnRSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdQYXJlbnQ6OlJlc291cmNlJyxcbiAgICAgIHByb3BlcnRpZXM6IHsgTmVzdGVkU3RhY2tOYW1lOiBuZXN0ZWQuc3RhY2tOYW1lIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHBhcmVudCkuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdQYXJlbnQ6OlJlc291cmNlJywge1xuICAgICAgTmVzdGVkU3RhY2tOYW1lOiB7XG4gICAgICAgICdGbjo6U2VsZWN0JzogW1xuICAgICAgICAgIDEsXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgJy8nLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnTmVzdGVkU3RhY2tOZXN0ZWRTdGFja05lc3RlZFN0YWNrTmVzdGVkU3RhY2tSZXNvdXJjZUI3MDgzNEZEJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ1wiYWNjb3VudFwiLCBcInJlZ2lvblwiIGFuZCBcImVudmlyb25tZW50XCIgYXJlIGFsbCBkZXJpdmVkIGZyb20gdGhlIHBhcmVudCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBwYXJlbnQgPSBuZXcgU3RhY2soYXBwLCAnUGFyZW50U3RhY2snLCB7IGVudjogeyBhY2NvdW50OiAnMTIzNGFjY291bnQnLCByZWdpb246ICd1cy1lYXN0LTQ0JyB9IH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IG5lc3RlZCA9IG5ldyBOZXN0ZWRTdGFjayhwYXJlbnQsICdOZXN0ZWRTdGFjaycpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChuZXN0ZWQuZW52aXJvbm1lbnQpLnRvRXF1YWwocGFyZW50LmVudmlyb25tZW50KTtcbiAgICBleHBlY3QobmVzdGVkLmFjY291bnQpLnRvRXF1YWwocGFyZW50LmFjY291bnQpO1xuICAgIGV4cGVjdChuZXN0ZWQucmVnaW9uKS50b0VxdWFsKHBhcmVudC5yZWdpb24pO1xuICB9KTtcblxuICB0ZXN0KCdkb3VibGUtbmVzdGVkIHN0YWNrJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7IGNvbnRleHQ6IHsgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlIH0gfSk7XG4gICAgY29uc3QgcGFyZW50ID0gbmV3IFN0YWNrKGFwcCwgJ3N0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbmVzdGVkMSA9IG5ldyBOZXN0ZWRTdGFjayhwYXJlbnQsICdOZXN0ZWQxJyk7XG4gICAgY29uc3QgbmVzdGVkMiA9IG5ldyBOZXN0ZWRTdGFjayhuZXN0ZWQxLCAnTmVzdGVkMicpO1xuXG4gICAgbmV3IENmblJlc291cmNlKG5lc3RlZDEsICdSZXNvdXJjZTEnLCB7IHR5cGU6ICdSZXNvdXJjZTo6MScgfSk7XG4gICAgbmV3IENmblJlc291cmNlKG5lc3RlZDIsICdSZXNvdXJjZTInLCB7IHR5cGU6ICdSZXNvdXJjZTo6MicgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcblxuICAgIC8vIG5lc3RlZDIgaXMgYSBcImxlYWZcIiwgc28gaXQncyBqdXN0IHRoZSByZXNvdXJjZVxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhuZXN0ZWQyKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIFJlc291cmNlMjogeyBUeXBlOiAnUmVzb3VyY2U6OjInIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgbWlkZGxlU3RhY2tIYXNoID0gJzdjNDI2ZjcyOTlhNzM5OTAwMjc5YWMxZWNlMDQwMzk3YzE5MTNjZGY3ODZmNTIyODY3N2IyODlmNGQ1ZTRjNDgnO1xuICAgIGNvbnN0IGJ1Y2tldFN1ZmZpeCA9ICdDNzA2QjEwMSc7XG4gICAgY29uc3QgdmVyc2lvblN1ZmZpeCA9ICc0QjE5M0FBNSc7XG4gICAgY29uc3QgaGFzaFN1ZmZpeCA9ICdFMjhGMDY5Myc7XG5cbiAgICAvLyBuZXN0ZWQxIHdpcmVzIHRoZSBuZXN0ZWQyIHRlbXBsYXRlIHRocm91Z2ggcGFyYW1ldGVycywgc28gd2UgZXhwZWN0IHRob3NlXG4gICAgY29uc3QgbmVzdGVkMVRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKG5lc3RlZDEpO1xuICAgIG5lc3RlZDFUZW1wbGF0ZS5yZXNvdXJjZUNvdW50SXMoJ1Jlc291cmNlOjoxJywgMSk7XG4gICAgY29uc3QgbmVzdGVkMlRlbXBsYXRlID0gbmVzdGVkMVRlbXBsYXRlLnRvSlNPTigpO1xuICAgIGV4cGVjdChuZXN0ZWQyVGVtcGxhdGUuUGFyYW1ldGVycykudG9FcXVhbCh7XG4gICAgICByZWZlcmVuY2V0b3N0YWNrQXNzZXRQYXJhbWV0ZXJzODE2OWM2ZjhhYWVhZjVlMmU4NjIwZjVmODk1ZmZlMjA5OTIwMmNjYjRiNjg4OWRmNDhmZTA5NjdhODk0MjM1Y1MzQnVja2V0RTg3NjhGNUNSZWY6IHsgVHlwZTogJ1N0cmluZycgfSxcbiAgICAgIHJlZmVyZW5jZXRvc3RhY2tBc3NldFBhcmFtZXRlcnM4MTY5YzZmOGFhZWFmNWUyZTg2MjBmNWY4OTVmZmUyMDk5MjAyY2NiNGI2ODg5ZGY0OGZlMDk2N2E4OTQyMzVjUzNWZXJzaW9uS2V5NDlERDgzQTJSZWY6IHsgVHlwZTogJ1N0cmluZycgfSxcbiAgICB9KTtcblxuICAgIC8vIHBhcmVudCBzdGFjayBzaG91bGQgaGF2ZSB0d28gc2V0cyBvZiBwYXJhbWV0ZXJzLiBvbmUgZm9yIHRoZSBmaXJzdCBuZXN0ZWQgc3RhY2sgYW5kIHRoZSBzZWNvbmRcbiAgICAvLyBmb3IgdGhlIHNlY29uZCBuZXN0ZWQgc3RhY2ssIHBhc3NlZCBpbiBhcyBwYXJhbWV0ZXJzIHRvIHRoZSBmaXJzdFxuICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHBhcmVudCkudG9KU09OKCk7XG4gICAgZXhwZWN0KHRlbXBsYXRlLlBhcmFtZXRlcnMpLnRvRXF1YWwoe1xuICAgICAgQXNzZXRQYXJhbWV0ZXJzODE2OWM2ZjhhYWVhZjVlMmU4NjIwZjVmODk1ZmZlMjA5OTIwMmNjYjRiNjg4OWRmNDhmZTA5NjdhODk0MjM1Y1MzQnVja2V0REUzQjg4RDY6IHsgVHlwZTogJ1N0cmluZycsIERlc2NyaXB0aW9uOiAnUzMgYnVja2V0IGZvciBhc3NldCBcIjgxNjljNmY4YWFlYWY1ZTJlODYyMGY1Zjg5NWZmZTIwOTkyMDJjY2I0YjY4ODlkZjQ4ZmUwOTY3YTg5NDIzNWNcIicgfSxcbiAgICAgIEFzc2V0UGFyYW1ldGVyczgxNjljNmY4YWFlYWY1ZTJlODYyMGY1Zjg5NWZmZTIwOTkyMDJjY2I0YjY4ODlkZjQ4ZmUwOTY3YTg5NDIzNWNTM1ZlcnNpb25LZXkzQTYyRUZFQTogeyBUeXBlOiAnU3RyaW5nJywgRGVzY3JpcHRpb246ICdTMyBrZXkgZm9yIGFzc2V0IHZlcnNpb24gXCI4MTY5YzZmOGFhZWFmNWUyZTg2MjBmNWY4OTVmZmUyMDk5MjAyY2NiNGI2ODg5ZGY0OGZlMDk2N2E4OTQyMzVjXCInIH0sXG4gICAgICBBc3NldFBhcmFtZXRlcnM4MTY5YzZmOGFhZWFmNWUyZTg2MjBmNWY4OTVmZmUyMDk5MjAyY2NiNGI2ODg5ZGY0OGZlMDk2N2E4OTQyMzVjQXJ0aWZhY3RIYXNoN0RDNTQ2RTA6IHsgVHlwZTogJ1N0cmluZycsIERlc2NyaXB0aW9uOiAnQXJ0aWZhY3QgaGFzaCBmb3IgYXNzZXQgXCI4MTY5YzZmOGFhZWFmNWUyZTg2MjBmNWY4OTVmZmUyMDk5MjAyY2NiNGI2ODg5ZGY0OGZlMDk2N2E4OTQyMzVjXCInIH0sXG4gICAgICBbYEFzc2V0UGFyYW1ldGVycyR7bWlkZGxlU3RhY2tIYXNofVMzQnVja2V0JHtidWNrZXRTdWZmaXh9YF06IHsgVHlwZTogJ1N0cmluZycsIERlc2NyaXB0aW9uOiBgUzMgYnVja2V0IGZvciBhc3NldCBcIiR7bWlkZGxlU3RhY2tIYXNofVwiYCB9LFxuICAgICAgW2BBc3NldFBhcmFtZXRlcnMke21pZGRsZVN0YWNrSGFzaH1TM1ZlcnNpb25LZXkke3ZlcnNpb25TdWZmaXh9YF06IHsgVHlwZTogJ1N0cmluZycsIERlc2NyaXB0aW9uOiBgUzMga2V5IGZvciBhc3NldCB2ZXJzaW9uIFwiJHttaWRkbGVTdGFja0hhc2h9XCJgIH0sXG4gICAgICBbYEFzc2V0UGFyYW1ldGVycyR7bWlkZGxlU3RhY2tIYXNofUFydGlmYWN0SGFzaCR7aGFzaFN1ZmZpeH1gXTogeyBUeXBlOiAnU3RyaW5nJywgRGVzY3JpcHRpb246IGBBcnRpZmFjdCBoYXNoIGZvciBhc3NldCBcIiR7bWlkZGxlU3RhY2tIYXNofVwiYCB9LFxuICAgIH0pO1xuXG4gICAgLy8gcHJveHkgYXNzZXQgcGFyYW1zIHRvIG5lc3RlZCBzdGFja1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhwYXJlbnQpLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZEZvcm1hdGlvbjo6U3RhY2snLCB7XG4gICAgICBQYXJhbWV0ZXJzOiB7XG4gICAgICAgIHJlZmVyZW5jZXRvc3RhY2tBc3NldFBhcmFtZXRlcnM4MTY5YzZmOGFhZWFmNWUyZTg2MjBmNWY4OTVmZmUyMDk5MjAyY2NiNGI2ODg5ZGY0OGZlMDk2N2E4OTQyMzVjUzNCdWNrZXRFODc2OEY1Q1JlZjogeyBSZWY6ICdBc3NldFBhcmFtZXRlcnM4MTY5YzZmOGFhZWFmNWUyZTg2MjBmNWY4OTVmZmUyMDk5MjAyY2NiNGI2ODg5ZGY0OGZlMDk2N2E4OTQyMzVjUzNCdWNrZXRERTNCODhENicgfSxcbiAgICAgICAgcmVmZXJlbmNldG9zdGFja0Fzc2V0UGFyYW1ldGVyczgxNjljNmY4YWFlYWY1ZTJlODYyMGY1Zjg5NWZmZTIwOTkyMDJjY2I0YjY4ODlkZjQ4ZmUwOTY3YTg5NDIzNWNTM1ZlcnNpb25LZXk0OUREODNBMlJlZjogeyBSZWY6ICdBc3NldFBhcmFtZXRlcnM4MTY5YzZmOGFhZWFmNWUyZTg2MjBmNWY4OTVmZmUyMDk5MjAyY2NiNGI2ODg5ZGY0OGZlMDk2N2E4OTQyMzVjUzNWZXJzaW9uS2V5M0E2MkVGRUEnIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gcGFyZW50IHN0YWNrIHNob3VsZCBoYXZlIDIgYXNzZXRzXG4gICAgZXhwZWN0KGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHBhcmVudC5zdGFja05hbWUpLmFzc2V0cy5sZW5ndGgpLnRvRXF1YWwoMik7XG4gIH0pO1xuXG4gIHRlc3QoJ3JlZmVyZW5jZSByZXNvdXJjZSBpbiBhIGRvdWJsZSBuZXN0ZWQgc3RhY2sgKCMxNTE1NSknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3QgcHJvZHVjZXJTdGFjayA9IG5ldyBTdGFjayhhcHAsICdQcm9kdWNlcicpO1xuICAgIGNvbnN0IG5lc3RlZDIgPSBuZXcgTmVzdGVkU3RhY2sobmV3IE5lc3RlZFN0YWNrKHByb2R1Y2VyU3RhY2ssICdOZXN0ZWQxJyksICdOZXN0ZWQyJyk7XG4gICAgY29uc3QgcHJvZHVjZXJSZXNvdXJjZSA9IG5ldyBDZm5SZXNvdXJjZShuZXN0ZWQyLCAnUmVzb3VyY2UnLCB7IHR5cGU6ICdNeVJlc291cmNlJyB9KTtcbiAgICBjb25zdCBjb25zdW1lclN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ0NvbnN1bWVyJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IENmblJlc291cmNlKGNvbnN1bWVyU3RhY2ssICdDb25zdW1pbmdSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdZb3VyUmVzb3VyY2UnLFxuICAgICAgcHJvcGVydGllczogeyBSZWZUb1Jlc291cmNlOiBwcm9kdWNlclJlc291cmNlLnJlZiB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGNhc20gPSBhcHAuc3ludGgoKTsgLy8gYmVmb3JlICMxNTE1NSB3YXMgZml4ZWQgdGhpcyB0aHJldyBhbiBlcnJvclxuXG4gICAgY29uc3QgcHJvZHVjZXJUZW1wbGF0ZSA9IGNhc20uZ2V0U3RhY2tBcnRpZmFjdChwcm9kdWNlclN0YWNrLmFydGlmYWN0SWQpLnRlbXBsYXRlO1xuICAgIGNvbnN0IGNvbnN1bWVyVGVtcGxhdGUgPSBjYXNtLmdldFN0YWNrQXJ0aWZhY3QoY29uc3VtZXJTdGFjay5hcnRpZmFjdElkKS50ZW1wbGF0ZTtcblxuICAgIC8vIGNoZWNrIHRoYXQgdGhlIGNvbnN1bWluZyByZXNvdXJjZSByZWZlcmVuY2VzIHRoZSBleHBlY3RlZCBleHBvcnQgbmFtZVxuICAgIGNvbnN0IG91dHB1dE5hbWUgPSAnRXhwb3J0c091dHB1dEZuR2V0QXR0TmVzdGVkMU5lc3RlZFN0YWNrTmVzdGVkMU5lc3RlZFN0YWNrUmVzb3VyY2VDRDBBRDM2Qk91dHB1dHNQcm9kdWNlck5lc3RlZDFOZXN0ZWQyTmVzdGVkU3RhY2tOZXN0ZWQyTmVzdGVkU3RhY2tSZXNvdXJjZTFFNkZBM0MzT3V0cHV0c1Byb2R1Y2VyTmVzdGVkMU5lc3RlZDIzOEE4OUNDNVJlZjJFOUU1MkVBJztcbiAgICBjb25zdCBleHBvcnROYW1lID0gcHJvZHVjZXJUZW1wbGF0ZS5PdXRwdXRzW291dHB1dE5hbWVdLkV4cG9ydC5OYW1lO1xuICAgIGNvbnN0IGltcG9ydE5hbWUgPSBjb25zdW1lclRlbXBsYXRlLlJlc291cmNlcy5Db25zdW1pbmdSZXNvdXJjZS5Qcm9wZXJ0aWVzLlJlZlRvUmVzb3VyY2VbJ0ZuOjpJbXBvcnRWYWx1ZSddO1xuICAgIGV4cGVjdChleHBvcnROYW1lKS50b0VxdWFsKGltcG9ydE5hbWUpO1xuICB9KTtcblxuICB0ZXN0KCdhc3NldHMgd2l0aGluIG5lc3RlZCBzdGFja3MgYXJlIHByb3hpZWQgZnJvbSB0aGUgcGFyZW50JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7IGNvbnRleHQ6IHsgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlIH0gfSk7XG4gICAgY29uc3QgcGFyZW50ID0gbmV3IFN0YWNrKGFwcCwgJ1BhcmVudFN0YWNrJyk7XG4gICAgY29uc3QgbmVzdGVkID0gbmV3IE5lc3RlZFN0YWNrKHBhcmVudCwgJ05lc3RlZFN0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYXNzZXQgPSBuZXcgczNfYXNzZXRzLkFzc2V0KG5lc3RlZCwgJ2Fzc2V0Jywge1xuICAgICAgcGF0aDogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2Fzc2V0LWZpeHR1cmUudHh0JyksXG4gICAgfSk7XG5cbiAgICBuZXcgQ2ZuUmVzb3VyY2UobmVzdGVkLCAnTmVzdGVkUmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnTmVzdGVkOjpSZXNvdXJjZScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIEFzc2V0QnVja2V0OiBhc3NldC5zM0J1Y2tldE5hbWUsXG4gICAgICAgIEFzc2V0S2V5OiBhc3NldC5zM09iamVjdEtleSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IFRlbXBsYXRlLmZyb21TdGFjayhwYXJlbnQpLnRvSlNPTigpO1xuXG4gICAgLy8gdHdvIHNldHMgb2YgYXNzZXQgcGFyYW1ldGVyczogb25lIGZvciB0aGUgbmVzdGVkIHN0YWNrIGl0c2VsZiBhbmQgb25lIGFzIGEgcHJveHkgZm9yIHRoZSBhc3NldCB3aXRoaW4gdGhlIHN0YWNrXG4gICAgZXhwZWN0KHRlbXBsYXRlLlBhcmFtZXRlcnMpLnRvRXF1YWwoe1xuICAgICAgQXNzZXRQYXJhbWV0ZXJzZGIwMWVlMmViN2FkYzc5MTVlMzY0ZGM0MTBkODYxZTU2OTU0M2Y5YmUzNzYxZDUzNWE2OGQ1YzJjYzE4MTI4MVMzQnVja2V0QzE4OEY2Mzc6IHsgVHlwZTogJ1N0cmluZycsIERlc2NyaXB0aW9uOiAnUzMgYnVja2V0IGZvciBhc3NldCBcImRiMDFlZTJlYjdhZGM3OTE1ZTM2NGRjNDEwZDg2MWU1Njk1NDNmOWJlMzc2MWQ1MzVhNjhkNWMyY2MxODEyODFcIicgfSxcbiAgICAgIEFzc2V0UGFyYW1ldGVyc2RiMDFlZTJlYjdhZGM3OTE1ZTM2NGRjNDEwZDg2MWU1Njk1NDNmOWJlMzc2MWQ1MzVhNjhkNWMyY2MxODEyODFTM1ZlcnNpb25LZXlDN0Y0REJGMjogeyBUeXBlOiAnU3RyaW5nJywgRGVzY3JpcHRpb246ICdTMyBrZXkgZm9yIGFzc2V0IHZlcnNpb24gXCJkYjAxZWUyZWI3YWRjNzkxNWUzNjRkYzQxMGQ4NjFlNTY5NTQzZjliZTM3NjFkNTM1YTY4ZDVjMmNjMTgxMjgxXCInIH0sXG4gICAgICBBc3NldFBhcmFtZXRlcnNkYjAxZWUyZWI3YWRjNzkxNWUzNjRkYzQxMGQ4NjFlNTY5NTQzZjliZTM3NjFkNTM1YTY4ZDVjMmNjMTgxMjgxQXJ0aWZhY3RIYXNoMzczQjE0RDI6IHsgVHlwZTogJ1N0cmluZycsIERlc2NyaXB0aW9uOiAnQXJ0aWZhY3QgaGFzaCBmb3IgYXNzZXQgXCJkYjAxZWUyZWI3YWRjNzkxNWUzNjRkYzQxMGQ4NjFlNTY5NTQzZjliZTM3NjFkNTM1YTY4ZDVjMmNjMTgxMjgxXCInIH0sXG4gICAgICBBc3NldFBhcmFtZXRlcnM0NmIxMDdkNmRiNzk4Y2E0NjA0NmI4NjY5ZDA1N2E0ZGViY2JkYmFhZGRiNjE3MDQwMDc0OGMyZjllNGY5ZDcxUzNCdWNrZXQzQzQyNjVFOTogeyBUeXBlOiAnU3RyaW5nJywgRGVzY3JpcHRpb246ICdTMyBidWNrZXQgZm9yIGFzc2V0IFwiNDZiMTA3ZDZkYjc5OGNhNDYwNDZiODY2OWQwNTdhNGRlYmNiZGJhYWRkYjYxNzA0MDA3NDhjMmY5ZTRmOWQ3MVwiJyB9LFxuICAgICAgQXNzZXRQYXJhbWV0ZXJzNDZiMTA3ZDZkYjc5OGNhNDYwNDZiODY2OWQwNTdhNGRlYmNiZGJhYWRkYjYxNzA0MDA3NDhjMmY5ZTRmOWQ3MVMzVmVyc2lvbktleThFOTgxNTM1OiB7IFR5cGU6ICdTdHJpbmcnLCBEZXNjcmlwdGlvbjogJ1MzIGtleSBmb3IgYXNzZXQgdmVyc2lvbiBcIjQ2YjEwN2Q2ZGI3OThjYTQ2MDQ2Yjg2NjlkMDU3YTRkZWJjYmRiYWFkZGI2MTcwNDAwNzQ4YzJmOWU0ZjlkNzFcIicgfSxcbiAgICAgIEFzc2V0UGFyYW1ldGVyczQ2YjEwN2Q2ZGI3OThjYTQ2MDQ2Yjg2NjlkMDU3YTRkZWJjYmRiYWFkZGI2MTcwNDAwNzQ4YzJmOWU0ZjlkNzFBcnRpZmFjdEhhc2g0NUEyODU4MzogeyBUeXBlOiAnU3RyaW5nJywgRGVzY3JpcHRpb246ICdBcnRpZmFjdCBoYXNoIGZvciBhc3NldCBcIjQ2YjEwN2Q2ZGI3OThjYTQ2MDQ2Yjg2NjlkMDU3YTRkZWJjYmRiYWFkZGI2MTcwNDAwNzQ4YzJmOWU0ZjlkNzFcIicgfSxcbiAgICB9KTtcblxuICAgIC8vIGFzc2V0IHByb3h5IHBhcmFtZXRlcnMgYXJlIHBhc3NlZCB0byB0aGUgbmVzdGVkIHN0YWNrXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHBhcmVudCkuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkRm9ybWF0aW9uOjpTdGFjaycsIHtcbiAgICAgIFBhcmFtZXRlcnM6IHtcbiAgICAgICAgcmVmZXJlbmNldG9QYXJlbnRTdGFja0Fzc2V0UGFyYW1ldGVyc2RiMDFlZTJlYjdhZGM3OTE1ZTM2NGRjNDEwZDg2MWU1Njk1NDNmOWJlMzc2MWQ1MzVhNjhkNWMyY2MxODEyODFTM0J1Y2tldDgyQzU1Qjk2UmVmOiB7IFJlZjogJ0Fzc2V0UGFyYW1ldGVyc2RiMDFlZTJlYjdhZGM3OTE1ZTM2NGRjNDEwZDg2MWU1Njk1NDNmOWJlMzc2MWQ1MzVhNjhkNWMyY2MxODEyODFTM0J1Y2tldEMxODhGNjM3JyB9LFxuICAgICAgICByZWZlcmVuY2V0b1BhcmVudFN0YWNrQXNzZXRQYXJhbWV0ZXJzZGIwMWVlMmViN2FkYzc5MTVlMzY0ZGM0MTBkODYxZTU2OTU0M2Y5YmUzNzYxZDUzNWE2OGQ1YzJjYzE4MTI4MVMzVmVyc2lvbktleUE0M0MzQ0M2UmVmOiB7IFJlZjogJ0Fzc2V0UGFyYW1ldGVyc2RiMDFlZTJlYjdhZGM3OTE1ZTM2NGRjNDEwZDg2MWU1Njk1NDNmOWJlMzc2MWQ1MzVhNjhkNWMyY2MxODEyODFTM1ZlcnNpb25LZXlDN0Y0REJGMicgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBwYXJlbnQgc3RhY2sgc2hvdWxkIGhhdmUgMiBhc3NldHNcbiAgICBleHBlY3QoYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUocGFyZW50LnN0YWNrTmFtZSkuYXNzZXRzLmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgfSk7XG5cbiAgdGVzdCgnZG9ja2VyIGltYWdlIGFzc2V0cyBhcmUgd2lyZWQgdGhyb3VnaCB0aGUgdG9wLWxldmVsIHN0YWNrJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7IGNvbnRleHQ6IHsgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlIH0gfSk7XG4gICAgY29uc3QgcGFyZW50ID0gbmV3IFN0YWNrKGFwcCwgJ215LXN0YWNrJyk7XG4gICAgY29uc3QgbmVzdGVkID0gbmV3IE5lc3RlZFN0YWNrKHBhcmVudCwgJ25lc3RlZC1zdGFjaycpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGxvY2F0aW9uID0gbmVzdGVkLnN5bnRoZXNpemVyLmFkZERvY2tlckltYWdlQXNzZXQoe1xuICAgICAgZGlyZWN0b3J5TmFtZTogJ215LWltYWdlJyxcbiAgICAgIGRvY2tlckJ1aWxkQXJnczogeyBrZXk6ICd2YWx1ZScsIGJvb206ICdiYW0nIH0sXG4gICAgICBkb2NrZXJCdWlsZFRhcmdldDogJ2J1aWxkVGFyZ2V0JyxcbiAgICAgIHNvdXJjZUhhc2g6ICdoYXNoLW9mLXNvdXJjZScsXG4gICAgfSk7XG5cbiAgICAvLyB1c2UgdGhlIGFzc2V0LCBzbyB0aGUgcGFyYW1ldGVycyB3aWxsIGJlIHdpcmVkLlxuICAgIG5ldyBzbnMuVG9waWMobmVzdGVkLCAnTXlUb3BpYycsIHtcbiAgICAgIGRpc3BsYXlOYW1lOiBgaW1hZ2UgbG9jYXRpb24gaXMgJHtsb2NhdGlvbi5pbWFnZVVyaX1gLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzbSA9IGFwcC5zeW50aCgpO1xuICAgIGV4cGVjdChhc20uZ2V0U3RhY2tBcnRpZmFjdChwYXJlbnQuYXJ0aWZhY3RJZCkuYXNzZXRzKS50b0VxdWFsKFtcbiAgICAgIHtcbiAgICAgICAgcmVwb3NpdG9yeU5hbWU6ICdhd3MtY2RrL2Fzc2V0cycsXG4gICAgICAgIGltYWdlVGFnOiAnaGFzaC1vZi1zb3VyY2UnLFxuICAgICAgICBpZDogJ2hhc2gtb2Ytc291cmNlJyxcbiAgICAgICAgcGFja2FnaW5nOiAnY29udGFpbmVyLWltYWdlJyxcbiAgICAgICAgcGF0aDogJ215LWltYWdlJyxcbiAgICAgICAgc291cmNlSGFzaDogJ2hhc2gtb2Ytc291cmNlJyxcbiAgICAgICAgYnVpbGRBcmdzOiB7IGtleTogJ3ZhbHVlJywgYm9vbTogJ2JhbScgfSxcbiAgICAgICAgdGFyZ2V0OiAnYnVpbGRUYXJnZXQnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0aDogJ215c3RhY2tuZXN0ZWRzdGFja0ZBRTEyRkI1Lm5lc3RlZC50ZW1wbGF0ZS5qc29uJyxcbiAgICAgICAgaWQ6ICdmY2RhZWU3OWViNzlmMzdlY2EzYTliMWNjMGNjOWJhMTUwZTRlZWE4YzVkNmQwYzM0M2NiNmNkOWRjNjhlMmU1JyxcbiAgICAgICAgcGFja2FnaW5nOiAnZmlsZScsXG4gICAgICAgIHNvdXJjZUhhc2g6ICdmY2RhZWU3OWViNzlmMzdlY2EzYTliMWNjMGNjOWJhMTUwZTRlZWE4YzVkNmQwYzM0M2NiNmNkOWRjNjhlMmU1JyxcbiAgICAgICAgczNCdWNrZXRQYXJhbWV0ZXI6ICdBc3NldFBhcmFtZXRlcnNmY2RhZWU3OWViNzlmMzdlY2EzYTliMWNjMGNjOWJhMTUwZTRlZWE4YzVkNmQwYzM0M2NiNmNkOWRjNjhlMmU1UzNCdWNrZXQ2N0E3NDlGOCcsXG4gICAgICAgIHMzS2V5UGFyYW1ldGVyOiAnQXNzZXRQYXJhbWV0ZXJzZmNkYWVlNzllYjc5ZjM3ZWNhM2E5YjFjYzBjYzliYTE1MGU0ZWVhOGM1ZDZkMGMzNDNjYjZjZDlkYzY4ZTJlNVMzVmVyc2lvbktleUUxRTZBOEQ0JyxcbiAgICAgICAgYXJ0aWZhY3RIYXNoUGFyYW1ldGVyOiAnQXNzZXRQYXJhbWV0ZXJzZmNkYWVlNzllYjc5ZjM3ZWNhM2E5YjFjYzBjYzliYTE1MGU0ZWVhOGM1ZDZkMGMzNDNjYjZjZDlkYzY4ZTJlNUFydGlmYWN0SGFzaDBBRURCRThBJyxcbiAgICAgIH0sXG4gICAgXSk7XG4gIH0pO1xuXG4gIHRlc3QoJ21ldGFkYXRhIGRlZmluZWQgaW4gbmVzdGVkIHN0YWNrcyBpcyByZXBvcnRlZCBhdCB0aGUgcGFyZW50IHN0YWNrIGxldmVsIGluIHRoZSBjbG91ZCBhc3NlbWJseScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoeyBzdGFja1RyYWNlczogZmFsc2UgfSk7XG4gICAgY29uc3QgcGFyZW50ID0gbmV3IFN0YWNrKGFwcCwgJ3BhcmVudCcpO1xuICAgIGNvbnN0IGNoaWxkID0gbmV3IFN0YWNrKHBhcmVudCwgJ2NoaWxkJyk7XG4gICAgY29uc3QgbmVzdGVkID0gbmV3IE5lc3RlZFN0YWNrKGNoaWxkLCAnbmVzdGVkJyk7XG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuUmVzb3VyY2UobmVzdGVkLCAncmVzb3VyY2UnLCB7IHR5cGU6ICdmb28nIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIHJlc291cmNlLm5vZGUuYWRkTWV0YWRhdGEoJ2ZvbycsICdiYXInKTtcblxuICAgIC8vIFRIRU46IHRoZSBmaXJzdCBub24tbmVzdGVkIHN0YWNrIHJlY29yZHMgdGhlIGFzc2VtYmx5IG1ldGFkYXRhXG4gICAgY29uc3QgYXNtID0gYXBwLnN5bnRoKCk7XG4gICAgZXhwZWN0KGFzbS5zdGFja3MubGVuZ3RoKS50b0VxdWFsKDIpOyAvLyBvbmx5IG9uZSBzdGFjayBpcyBkZWZpbmVkIGFzIGFuIGFydGlmYWN0XG4gICAgZXhwZWN0KGFzbS5nZXRTdGFja0J5TmFtZShwYXJlbnQuc3RhY2tOYW1lKS5maW5kTWV0YWRhdGFCeVR5cGUoJ2ZvbycpKS50b0VxdWFsKFtdKTtcbiAgICBleHBlY3QoYXNtLmdldFN0YWNrQnlOYW1lKGNoaWxkLnN0YWNrTmFtZSkuZmluZE1ldGFkYXRhQnlUeXBlKCdmb28nKSkudG9FcXVhbChbXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICcvcGFyZW50L2NoaWxkL25lc3RlZC9yZXNvdXJjZScsXG4gICAgICAgIHR5cGU6ICdmb28nLFxuICAgICAgICBkYXRhOiAnYmFyJyxcbiAgICAgIH0sXG4gICAgXSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3JlZmVyZW5jaW5nIGF0dHJpYnV0ZXMgd2l0aCBwZXJpb2QgYWNyb3NzIHN0YWNrcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHBhcmVudCA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IG5lc3RlZCA9IG5ldyBOZXN0ZWRTdGFjayhwYXJlbnQsICduZXN0ZWQnKTtcbiAgICBjb25zdCBjb25zdW1lZCA9IG5ldyBDZm5SZXNvdXJjZShuZXN0ZWQsICdyZXNvdXJjZS1pbi1uZXN0ZWQnLCB7IHR5cGU6ICdDT05TVU1FRCcgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IENmblJlc291cmNlKHBhcmVudCwgJ3Jlc291cmNlLWluLXBhcmVudCcsIHtcbiAgICAgIHR5cGU6ICdDT05TVU1FUicsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIENvbnN1bWVkQXR0cmlidXRlOiBjb25zdW1lZC5nZXRBdHQoJ0NvbnN1bWVkLkF0dHJpYnV0ZScpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2sobmVzdGVkKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIHJlc291cmNlaW5uZXN0ZWQ6IHtcbiAgICAgICAgICBUeXBlOiAnQ09OU1VNRUQnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIE91dHB1dHM6IHtcbiAgICAgICAgbmVzdGVkcmVzb3VyY2Vpbm5lc3RlZDU5QjFGMDFDQ29uc3VtZWRBdHRyaWJ1dGU6IHtcbiAgICAgICAgICBWYWx1ZToge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdyZXNvdXJjZWlubmVzdGVkJyxcbiAgICAgICAgICAgICAgJ0NvbnN1bWVkLkF0dHJpYnV0ZScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHBhcmVudCkuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdDT05TVU1FUicsIHtcbiAgICAgIENvbnN1bWVkQXR0cmlidXRlOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICduZXN0ZWROZXN0ZWRTdGFja25lc3RlZE5lc3RlZFN0YWNrUmVzb3VyY2UzREQxNDNCRicsXG4gICAgICAgICAgJ091dHB1dHMubmVzdGVkcmVzb3VyY2Vpbm5lc3RlZDU5QjFGMDFDQ29uc3VtZWRBdHRyaWJ1dGUnLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnbWlzc2luZyBjb250ZXh0IGluIG5lc3RlZCBzdGFjayBpcyByZXBvcnRlZCBpZiB0aGUgY29udGV4dCBpcyBub3QgYXZhaWxhYmxlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1BhcmVudFN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogJzEyMzRhY2NvdW50JywgcmVnaW9uOiAndXMtZWFzdC00NCcgfSB9KTtcbiAgICBjb25zdCBuZXN0ZWRTdGFjayA9IG5ldyBOZXN0ZWRTdGFjayhzdGFjaywgJ25lc3RlZCcpO1xuICAgIGNvbnN0IHByb3ZpZGVyID0gJ2F2YWlsYWJpbGl0eS16b25lcyc7XG4gICAgY29uc3QgZXhwZWN0ZWRLZXkgPSBDb250ZXh0UHJvdmlkZXIuZ2V0S2V5KG5lc3RlZFN0YWNrLCB7XG4gICAgICBwcm92aWRlcixcbiAgICB9KS5rZXk7XG5cbiAgICAvLyBXSEVOXG4gICAgQ29udGV4dFByb3ZpZGVyLmdldFZhbHVlKG5lc3RlZFN0YWNrLCB7XG4gICAgICBwcm92aWRlcixcbiAgICAgIGR1bW15VmFsdWU6IFsnZHVtbXkxYScsICdkdW1teTFiJywgJ2R1bW15MWMnXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU46IG1pc3NpbmcgY29udGV4dCBpcyByZXBvcnRlZCBpbiB0aGUgY2xvdWQgYXNzZW1ibHlcbiAgICBjb25zdCBhc20gPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCBtaXNzaW5nID0gYXNtLm1hbmlmZXN0Lm1pc3Npbmc7XG5cbiAgICBleHBlY3QobWlzc2luZyAmJiBtaXNzaW5nLmZpbmQobSA9PiB7XG4gICAgICByZXR1cm4gKG0ua2V5ID09PSBleHBlY3RlZEtleSk7XG4gICAgfSkpLnRvQmVUcnV0aHkoKTtcbiAgfSk7XG5cbiAgdGVzdCgnMy1sZXZlbCBzdGFja3M6IGxlZ2FjeSBzeW50aGVzaXplciBwYXJhbWV0ZXJzIGFyZSBhZGRlZCB0byB0aGUgbWlkZGxlLWxldmVsIHN0YWNrJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHRvcCA9IG5ldyBTdGFjayhhcHAsICdzdGFjaycsIHtcbiAgICAgIHN5bnRoZXNpemVyOiBuZXcgTGVnYWN5U3RhY2tTeW50aGVzaXplcigpLFxuICAgIH0pO1xuICAgIGNvbnN0IG1pZGRsZSA9IG5ldyBOZXN0ZWRTdGFjayh0b3AsICduZXN0ZWQxJyk7XG4gICAgY29uc3QgYm90dG9tID0gbmV3IE5lc3RlZFN0YWNrKG1pZGRsZSwgJ25lc3RlZDInKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQ2ZuUmVzb3VyY2UoYm90dG9tLCAnU29tZXRoaW5nJywge1xuICAgICAgdHlwZTogJ0JvdHRvbUxldmVsJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhc20gPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCBtaWRkbGVUZW1wbGF0ZSA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihhc20uZGlyZWN0b3J5LCBtaWRkbGUudGVtcGxhdGVGaWxlKSwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KSk7XG5cbiAgICBjb25zdCBoYXNoID0gJ2JjM2M1MWU0ZDM1NDVlZTBhMDA2OTQwMWU1YTMyYzM3YjY2ZDA0NGI5ODNmMTJkZTQxNmJhMTU3NmVjYWYwYTQnO1xuICAgIGV4cGVjdChtaWRkbGVUZW1wbGF0ZS5QYXJhbWV0ZXJzID8/IHt9KS50b0VxdWFsKHtcbiAgICAgIFtgcmVmZXJlbmNldG9zdGFja0Fzc2V0UGFyYW1ldGVycyR7aGFzaH1TM0J1Y2tldEQ3QzMwNDM1UmVmYF06IHtcbiAgICAgICAgVHlwZTogJ1N0cmluZycsXG4gICAgICB9LFxuICAgICAgW2ByZWZlcmVuY2V0b3N0YWNrQXNzZXRQYXJhbWV0ZXJzJHtoYXNofVMzVmVyc2lvbktleUI2NjdEQkUxUmVmYF06IHtcbiAgICAgICAgVHlwZTogJ1N0cmluZycsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyZWZlcmVuY2VzIHRvIGEgcmVzb3VyY2UgZnJvbSBhIGRlZXBseSBuZXN0ZWQgc3RhY2snLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHsgY29udGV4dDogeyBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UgfSB9KTtcbiAgICBjb25zdCB0b3AgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2snKTtcbiAgICBjb25zdCB0b3BMZXZlbCA9IG5ldyBDZm5SZXNvdXJjZSh0b3AsICd0b3BsZXZlbCcsIHsgdHlwZTogJ1RvcExldmVsJyB9KTtcbiAgICBjb25zdCBuZXN0ZWQxID0gbmV3IE5lc3RlZFN0YWNrKHRvcCwgJ25lc3RlZDEnKTtcbiAgICBjb25zdCBuZXN0ZWQyID0gbmV3IE5lc3RlZFN0YWNrKG5lc3RlZDEsICduZXN0ZWQyJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IENmblJlc291cmNlKG5lc3RlZDIsICdyZWZUb1RvcExldmVsJywge1xuICAgICAgdHlwZTogJ0JvdHRvbUxldmVsJyxcbiAgICAgIHByb3BlcnRpZXM6IHsgUmVmVG9Ub3BMZXZlbDogdG9wTGV2ZWwucmVmIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHRvcCkuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkRm9ybWF0aW9uOjpTdGFjaycsIHtcbiAgICAgIFBhcmFtZXRlcnM6IHtcbiAgICAgICAgcmVmZXJlbmNldG9zdGFja0Fzc2V0UGFyYW1ldGVyczg0Mjk4MmJkNDIxY2NlOTc0MmJhMjcxNTFlZjEyZWQ2OTlkNDRkMjI4MDFmNDFlODAyOWY2M2YyMzU4YTNmMmZTM0J1Y2tldDVEQTVEMkU3UmVmOiB7XG4gICAgICAgICAgUmVmOiAnQXNzZXRQYXJhbWV0ZXJzODQyOTgyYmQ0MjFjY2U5NzQyYmEyNzE1MWVmMTJlZDY5OWQ0NGQyMjgwMWY0MWU4MDI5ZjYzZjIzNThhM2YyZlMzQnVja2V0REQ0RDk2QjUnLFxuICAgICAgICB9LFxuICAgICAgICByZWZlcmVuY2V0b3N0YWNrQXNzZXRQYXJhbWV0ZXJzODQyOTgyYmQ0MjFjY2U5NzQyYmEyNzE1MWVmMTJlZDY5OWQ0NGQyMjgwMWY0MWU4MDI5ZjYzZjIzNThhM2YyZlMzVmVyc2lvbktleThGQkU1QzEyUmVmOiB7XG4gICAgICAgICAgUmVmOiAnQXNzZXRQYXJhbWV0ZXJzODQyOTgyYmQ0MjFjY2U5NzQyYmEyNzE1MWVmMTJlZDY5OWQ0NGQyMjgwMWY0MWU4MDI5ZjYzZjIzNThhM2YyZlMzVmVyc2lvbktleTgzRTM4MUYzJyxcbiAgICAgICAgfSxcbiAgICAgICAgcmVmZXJlbmNldG9zdGFja3RvcGxldmVsQkIxNkJGMTNSZWY6IHtcbiAgICAgICAgICBSZWY6ICd0b3BsZXZlbCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKG5lc3RlZDEpLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZEZvcm1hdGlvbjo6U3RhY2snLCB7XG4gICAgICBQYXJhbWV0ZXJzOiB7XG4gICAgICAgIHJlZmVyZW5jZXRvc3RhY2t0b3BsZXZlbEJCMTZCRjEzUmVmOiB7XG4gICAgICAgICAgUmVmOiAncmVmZXJlbmNldG9zdGFja3RvcGxldmVsQkIxNkJGMTNSZWYnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhuZXN0ZWQyKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIHJlZlRvVG9wTGV2ZWw6IHtcbiAgICAgICAgICBUeXBlOiAnQm90dG9tTGV2ZWwnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIFJlZlRvVG9wTGV2ZWw6IHtcbiAgICAgICAgICAgICAgUmVmOiAncmVmZXJlbmNldG9zdGFja3RvcGxldmVsQkIxNkJGMTNSZWYnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIFBhcmFtZXRlcnM6IHtcbiAgICAgICAgcmVmZXJlbmNldG9zdGFja3RvcGxldmVsQkIxNkJGMTNSZWY6IHtcbiAgICAgICAgICBUeXBlOiAnU3RyaW5nJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2JvdHRvbSBuZXN0ZWQgc3RhY2sgY29uc3VtZXMgdmFsdWUgZnJvbSBhIHRvcC1sZXZlbCBzdGFjayB0aHJvdWdoIGEgcGFyYW1ldGVyIGluIGEgbWlkZGxlIG5lc3RlZCBzdGFjaycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoeyBjb250ZXh0OiB7IFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSB9IH0pO1xuICAgIGNvbnN0IHRvcCA9IG5ldyBTdGFjayhhcHAsICdHcmFuZHBhcmVudCcpO1xuICAgIGNvbnN0IG1pZGRsZSA9IG5ldyBOZXN0ZWRTdGFjayh0b3AsICdQYXJlbnQnKTtcbiAgICBjb25zdCBib3R0b20gPSBuZXcgTmVzdGVkU3RhY2sobWlkZGxlLCAnQ2hpbGQnKTtcbiAgICBjb25zdCByZXNvdXJjZUluR3JhbmRwYXJlbnQgPSBuZXcgQ2ZuUmVzb3VyY2UodG9wLCAnUmVzb3VyY2VJbkdyYW5kcGFyZW50JywgeyB0eXBlOiAnUmVzb3VyY2VJbkdyYW5kcGFyZW50JyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQ2ZuUmVzb3VyY2UoYm90dG9tLCAnUmVzb3VyY2VJbkNoaWxkJywge1xuICAgICAgdHlwZTogJ1Jlc291cmNlSW5DaGlsZCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIFJlZlRvR3JhbmRwYXJlbnQ6IHJlc291cmNlSW5HcmFuZHBhcmVudC5yZWYsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuXG4gICAgLy8gdGhpcyBpcyB0aGUgbmFtZSBhbGxvY2F0ZWQgZm9yIHRoZSBwYXJhbWV0ZXIgdGhhdCdzIHByb3BhZ2F0ZWQgdGhyb3VnaFxuICAgIC8vIHRoZSBoaWVyYXJjaHkuXG4gICAgY29uc3QgcGFyYW1OYW1lID0gJ3JlZmVyZW5jZXRvR3JhbmRwYXJlbnRSZXNvdXJjZUluR3JhbmRwYXJlbnQwMTBFOTk3QVJlZic7XG5cbiAgICAvLyBjaGlsZCAoYm90dG9tKSByZWZlcmVuY2VzIHRocm91Z2ggYSBwYXJhbWV0ZXIuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKGJvdHRvbSkudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBSZXNvdXJjZUluQ2hpbGQ6IHtcbiAgICAgICAgICBUeXBlOiAnUmVzb3VyY2VJbkNoaWxkJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBSZWZUb0dyYW5kcGFyZW50OiB7IFJlZjogcGFyYW1OYW1lIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBQYXJhbWV0ZXJzOiB7XG4gICAgICAgIFtwYXJhbU5hbWVdOiB7IFR5cGU6ICdTdHJpbmcnIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gdGhlIHBhcmVudCAobWlkZGxlKSBzZXRzIHRoZSB2YWx1ZSBvZiB0aGlzIHBhcmFtZXRlciB0byBiZSBhIHJlZmVyZW5jZSB0byBhbm90aGVyIHBhcmFtZXRlclxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhtaWRkbGUpLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZEZvcm1hdGlvbjo6U3RhY2snLCB7XG4gICAgICBQYXJhbWV0ZXJzOiB7XG4gICAgICAgIFtwYXJhbU5hbWVdOiB7IFJlZjogcGFyYW1OYW1lIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gZ3JhbmRwYXJlbnQgKHRvcCkgYXNzaWducyB0aGUgYWN0dWFsIHZhbHVlIHRvIHRoZSBwYXJhbWV0ZXJcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2sodG9wKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2xvdWRGb3JtYXRpb246OlN0YWNrJywge1xuICAgICAgUGFyYW1ldGVyczoge1xuICAgICAgICBbcGFyYW1OYW1lXTogeyBSZWY6ICdSZXNvdXJjZUluR3JhbmRwYXJlbnQnIH0sXG5cbiAgICAgICAgLy8gdGhlc2UgYXJlIGZvciB0aGUgYXNzZXQgb2YgdGhlIGJvdHRvbSBuZXN0ZWQgc3RhY2tcbiAgICAgICAgcmVmZXJlbmNldG9HcmFuZHBhcmVudEFzc2V0UGFyYW1ldGVyczMyMDhmNDNiNzkzYTFkYmUyOGNhMDJjZjMxZmI5NzU0ODkwNzFiZWI0MmM0OTJiMjJkYzNkMzJkZWNjM2I0YjdTM0J1Y2tldDA2RUVFNThEUmVmOiB7XG4gICAgICAgICAgUmVmOiAnQXNzZXRQYXJhbWV0ZXJzMzIwOGY0M2I3OTNhMWRiZTI4Y2EwMmNmMzFmYjk3NTQ4OTA3MWJlYjQyYzQ5MmIyMmRjM2QzMmRlY2MzYjRiN1MzQnVja2V0MDE4NzdDMkUnLFxuICAgICAgICB9LFxuICAgICAgICByZWZlcmVuY2V0b0dyYW5kcGFyZW50QXNzZXRQYXJhbWV0ZXJzMzIwOGY0M2I3OTNhMWRiZTI4Y2EwMmNmMzFmYjk3NTQ4OTA3MWJlYjQyYzQ5MmIyMmRjM2QzMmRlY2MzYjRiN1MzVmVyc2lvbktleUQzQjA0OTA5UmVmOiB7XG4gICAgICAgICAgUmVmOiAnQXNzZXRQYXJhbWV0ZXJzMzIwOGY0M2I3OTNhMWRiZTI4Y2EwMmNmMzFmYjk3NTQ4OTA3MWJlYjQyYzQ5MmIyMmRjM2QzMmRlY2MzYjRiN1MzVmVyc2lvbktleTU3NjVGMDg0JyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=