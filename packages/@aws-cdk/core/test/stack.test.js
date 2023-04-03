"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cxapi = require("@aws-cdk/cx-api");
const region_info_1 = require("@aws-cdk/region-info");
const constructs_1 = require("constructs");
const util_1 = require("./util");
const lib_1 = require("../lib");
const intrinsic_1 = require("../lib/private/intrinsic");
const refs_1 = require("../lib/private/refs");
const util_2 = require("../lib/util");
describe('stack', () => {
    test('a stack can be serialized into a CloudFormation template, initially it\'s empty', () => {
        const stack = new lib_1.Stack();
        expect((0, util_1.toCloudFormation)(stack)).toEqual({});
    });
    test('stack name cannot exceed 128 characters', () => {
        // GIVEN
        const app = new lib_1.App({});
        const reallyLongStackName = 'LookAtMyReallyLongStackNameThisStackNameIsLongerThan128CharactersThatIsNutsIDontThinkThereIsEnoughAWSAvailableToLetEveryoneHaveStackNamesThisLong';
        // THEN
        expect(() => {
            new lib_1.Stack(app, 'MyStack', {
                stackName: reallyLongStackName,
            });
        }).toThrow(`Stack name must be <= 128 characters. Stack name: '${reallyLongStackName}'`);
    });
    test('stack objects have some template-level propeties, such as Description, Version, Transform', () => {
        const stack = new lib_1.Stack();
        stack.templateOptions.templateFormatVersion = 'MyTemplateVersion';
        stack.templateOptions.description = 'This is my description';
        stack.templateOptions.transforms = ['SAMy'];
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Description: 'This is my description',
            AWSTemplateFormatVersion: 'MyTemplateVersion',
            Transform: 'SAMy',
        });
    });
    test('Stack.isStack indicates that a construct is a stack', () => {
        const stack = new lib_1.Stack();
        const c = new constructs_1.Construct(stack, 'Construct');
        expect(lib_1.Stack.isStack(stack)).toBeDefined();
        expect(!lib_1.Stack.isStack(c)).toBeDefined();
    });
    test('stack.id is not included in the logical identities of resources within it', () => {
        const stack = new lib_1.Stack(undefined, 'MyStack');
        new lib_1.CfnResource(stack, 'MyResource', { type: 'MyResourceType' });
        expect((0, util_1.toCloudFormation)(stack)).toEqual({ Resources: { MyResource: { Type: 'MyResourceType' } } });
    });
    test('when stackResourceLimit is default, should give error', () => {
        // GIVEN
        const app = new lib_1.App({});
        const stack = new lib_1.Stack(app, 'MyStack');
        // WHEN
        for (let index = 0; index < 1000; index++) {
            new lib_1.CfnResource(stack, `MyResource-${index}`, { type: 'MyResourceType' });
        }
        expect(() => {
            app.synth();
        }).toThrow('Number of resources in stack \'MyStack\': 1000 is greater than allowed maximum of 500');
    });
    test('when stackResourceLimit is defined, should give the proper error', () => {
        // GIVEN
        const app = new lib_1.App({
            context: {
                '@aws-cdk/core:stackResourceLimit': 100,
            },
        });
        const stack = new lib_1.Stack(app, 'MyStack');
        // WHEN
        for (let index = 0; index < 200; index++) {
            new lib_1.CfnResource(stack, `MyResource-${index}`, { type: 'MyResourceType' });
        }
        expect(() => {
            app.synth();
        }).toThrow('Number of resources in stack \'MyStack\': 200 is greater than allowed maximum of 100');
    });
    test('when stackResourceLimit is 0, should not give error', () => {
        // GIVEN
        const app = new lib_1.App({
            context: {
                '@aws-cdk/core:stackResourceLimit': 0,
            },
        });
        const stack = new lib_1.Stack(app, 'MyStack');
        // WHEN
        for (let index = 0; index < 1000; index++) {
            new lib_1.CfnResource(stack, `MyResource-${index}`, { type: 'MyResourceType' });
        }
        expect(() => {
            app.synth();
        }).not.toThrow();
    });
    test('stack.templateOptions can be used to set template-level options', () => {
        const stack = new lib_1.Stack();
        stack.templateOptions.description = 'StackDescription';
        stack.templateOptions.templateFormatVersion = 'TemplateVersion';
        stack.templateOptions.transform = 'DeprecatedField';
        stack.templateOptions.transforms = ['Transform'];
        stack.templateOptions.metadata = {
            MetadataKey: 'MetadataValue',
        };
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Description: 'StackDescription',
            Transform: ['Transform', 'DeprecatedField'],
            AWSTemplateFormatVersion: 'TemplateVersion',
            Metadata: { MetadataKey: 'MetadataValue' },
        });
    });
    test('stack.templateOptions.transforms removes duplicate values', () => {
        const stack = new lib_1.Stack();
        stack.templateOptions.transforms = ['A', 'B', 'C', 'A'];
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Transform: ['A', 'B', 'C'],
        });
    });
    test('stack.addTransform() adds a transform', () => {
        const stack = new lib_1.Stack();
        stack.addTransform('A');
        stack.addTransform('B');
        stack.addTransform('C');
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Transform: ['A', 'B', 'C'],
        });
    });
    // This approach will only apply to TypeScript code, but at least it's a temporary
    // workaround for people running into issues caused by SDK-3003.
    // We should come up with a proper solution that involved jsii callbacks (when they exist)
    // so this can be implemented by jsii languages as well.
    test('Overriding `Stack._toCloudFormation` allows arbitrary post-processing of the generated template during synthesis', () => {
        const stack = new StackWithPostProcessor();
        new lib_1.CfnResource(stack, 'myResource', {
            type: 'AWS::MyResource',
            properties: {
                MyProp1: 'hello',
                MyProp2: 'howdy',
                Environment: {
                    Key: 'value',
                },
            },
        });
        expect(stack._toCloudFormation()).toEqual({
            Resources: {
                myResource: {
                    Type: 'AWS::MyResource',
                    Properties: {
                        MyProp1: 'hello',
                        MyProp2: 'howdy',
                        Environment: { key: 'value' },
                    },
                },
            },
        });
    });
    test('Stack.getByPath can be used to find any CloudFormation element (Parameter, Output, etc)', () => {
        const stack = new lib_1.Stack();
        const p = new lib_1.CfnParameter(stack, 'MyParam', { type: 'String' });
        const o = new lib_1.CfnOutput(stack, 'MyOutput', { value: 'boom' });
        const c = new lib_1.CfnCondition(stack, 'MyCondition');
        expect(stack.node.findChild(p.node.id)).toEqual(p);
        expect(stack.node.findChild(o.node.id)).toEqual(o);
        expect(stack.node.findChild(c.node.id)).toEqual(c);
    });
    test('Stack names can have hyphens in them', () => {
        const root = new lib_1.App();
        new lib_1.Stack(root, 'Hello-World');
        // Did not throw
    });
    test('Stacks can have a description given to them', () => {
        const stack = new lib_1.Stack(new lib_1.App(), 'MyStack', { description: 'My stack, hands off!' });
        const output = (0, util_1.toCloudFormation)(stack);
        expect(output.Description).toEqual('My stack, hands off!');
    });
    test('Stack descriptions have a limited length', () => {
        const desc = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
     incididunt ut labore et dolore magna aliqua. Consequat interdum varius sit amet mattis vulputate
     enim nulla aliquet. At imperdiet dui accumsan sit amet nulla facilisi morbi. Eget lorem dolor sed
     viverra ipsum. Diam volutpat commodo sed egestas egestas. Sit amet porttitor eget dolor morbi non.
     Lorem dolor sed viverra ipsum. Id porta nibh venenatis cras sed felis. Augue interdum velit euismod
     in pellentesque. Suscipit adipiscing bibendum est ultricies integer quis. Condimentum id venenatis a
     condimentum vitae sapien pellentesque habitant morbi. Congue mauris rhoncus aenean vel elit scelerisque
     mauris pellentesque pulvinar.
     Faucibus purus in massa tempor nec. Risus viverra adipiscing at in. Integer feugiat scelerisque varius
     morbi. Malesuada nunc vel risus commodo viverra maecenas accumsan lacus. Vulputate sapien nec sagittis
     aliquam malesuada bibendum arcu vitae. Augue neque gravida in fermentum et sollicitudin ac orci phasellus.
     Ultrices tincidunt arcu non sodales neque sodales.`;
        expect(() => new lib_1.Stack(new lib_1.App(), 'MyStack', { description: desc }));
    });
    (0, cdk_build_tools_1.testDeprecated)('Include should support non-hash top-level template elements like "Description"', () => {
        const stack = new lib_1.Stack();
        const template = {
            Description: 'hello, world',
        };
        new lib_1.CfnInclude(stack, 'Include', { template });
        const output = (0, util_1.toCloudFormation)(stack);
        expect(typeof output.Description).toEqual('string');
    });
    test('Pseudo values attached to one stack can be referenced in another stack', () => {
        // GIVEN
        const app = new lib_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack1 = new lib_1.Stack(app, 'Stack1');
        const account1 = new lib_1.ScopedAws(stack1).accountId;
        const stack2 = new lib_1.Stack(app, 'Stack2');
        // WHEN - used in another stack
        new lib_1.CfnParameter(stack2, 'SomeParameter', { type: 'String', default: account1 });
        // THEN
        const assembly = app.synth();
        const template1 = assembly.getStackByName(stack1.stackName).template;
        const template2 = assembly.getStackByName(stack2.stackName).template;
        expect(template1).toEqual({
            Outputs: {
                ExportsOutputRefAWSAccountIdAD568057: {
                    Value: { Ref: 'AWS::AccountId' },
                    Export: { Name: 'Stack1:ExportsOutputRefAWSAccountIdAD568057' },
                },
            },
        });
        expect(template2).toEqual({
            Parameters: {
                SomeParameter: {
                    Type: 'String',
                    Default: { 'Fn::ImportValue': 'Stack1:ExportsOutputRefAWSAccountIdAD568057' },
                },
            },
        });
    });
    test('Cross-stack references are detected in resource properties', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack1 = new lib_1.Stack(app, 'Stack1');
        const resource1 = new lib_1.CfnResource(stack1, 'Resource', { type: 'BLA' });
        const stack2 = new lib_1.Stack(app, 'Stack2');
        // WHEN - used in another resource
        new lib_1.CfnResource(stack2, 'SomeResource', {
            type: 'AWS::Some::Resource',
            properties: {
                someProperty: new intrinsic_1.Intrinsic(resource1.ref),
            },
        });
        // THEN
        const assembly = app.synth();
        const template2 = assembly.getStackByName(stack2.stackName).template;
        expect(template2?.Resources).toEqual({
            SomeResource: {
                Type: 'AWS::Some::Resource',
                Properties: {
                    someProperty: { 'Fn::ImportValue': 'Stack1:ExportsOutputRefResource1D5D905A' },
                },
            },
        });
    });
    test('Cross-stack export names account for stack name lengths', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack1 = new lib_1.Stack(app, 'Stack1', {
            stackName: 'SoThisCouldPotentiallyBeAVeryLongStackName',
        });
        let scope = stack1;
        // WHEN - deeply nested
        for (let i = 0; i < 50; i++) {
            scope = new constructs_1.Construct(scope, `ChildConstruct${i}`);
        }
        const resource1 = new lib_1.CfnResource(scope, 'Resource', { type: 'BLA' });
        const stack2 = new lib_1.Stack(app, 'Stack2');
        // WHEN - used in another resource
        new lib_1.CfnResource(stack2, 'SomeResource', {
            type: 'AWS::Some::Resource',
            properties: {
                someProperty: new intrinsic_1.Intrinsic(resource1.ref),
            },
        });
        // THEN
        const assembly = app.synth();
        const template1 = assembly.getStackByName(stack1.stackName).template;
        const theOutput = template1.Outputs[Object.keys(template1.Outputs)[0]];
        expect(theOutput.Export.Name.length).toEqual(255);
    });
    test('Cross-stack reference export names are relative to the stack (when the flag is set)', () => {
        // GIVEN
        const app = new lib_1.App({
            context: {
                '@aws-cdk/core:stackRelativeExports': 'true',
            },
        });
        const indifferentScope = new constructs_1.Construct(app, 'ExtraScope');
        const stack1 = new lib_1.Stack(indifferentScope, 'Stack1', {
            stackName: 'Stack1',
        });
        const resource1 = new lib_1.CfnResource(stack1, 'Resource', { type: 'BLA' });
        const stack2 = new lib_1.Stack(indifferentScope, 'Stack2');
        // WHEN - used in another resource
        new lib_1.CfnResource(stack2, 'SomeResource', {
            type: 'AWS::Some::Resource',
            properties: {
                someProperty: new intrinsic_1.Intrinsic(resource1.ref),
            },
        });
        // THEN
        const assembly = app.synth();
        const template2 = assembly.getStackByName(stack2.stackName).template;
        expect(template2?.Resources).toEqual({
            SomeResource: {
                Type: 'AWS::Some::Resource',
                Properties: {
                    someProperty: { 'Fn::ImportValue': 'Stack1:ExportsOutputRefResource1D5D905A' },
                },
            },
        });
    });
    test('cross-stack references in lazy tokens work', () => {
        // GIVEN
        const app = new lib_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack1 = new lib_1.Stack(app, 'Stack1');
        const account1 = new lib_1.ScopedAws(stack1).accountId;
        const stack2 = new lib_1.Stack(app, 'Stack2');
        // WHEN - used in another stack
        new lib_1.CfnParameter(stack2, 'SomeParameter', { type: 'String', default: lib_1.Lazy.string({ produce: () => account1 }) });
        const assembly = app.synth();
        const template1 = assembly.getStackByName(stack1.stackName).template;
        const template2 = assembly.getStackByName(stack2.stackName).template;
        // THEN
        expect(template1).toEqual({
            Outputs: {
                ExportsOutputRefAWSAccountIdAD568057: {
                    Value: { Ref: 'AWS::AccountId' },
                    Export: { Name: 'Stack1:ExportsOutputRefAWSAccountIdAD568057' },
                },
            },
        });
        expect(template2).toEqual({
            Parameters: {
                SomeParameter: {
                    Type: 'String',
                    Default: { 'Fn::ImportValue': 'Stack1:ExportsOutputRefAWSAccountIdAD568057' },
                },
            },
        });
    });
    test('Cross-stack use of Region and account returns nonscoped intrinsic because the two stacks must be in the same region anyway', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack1 = new lib_1.Stack(app, 'Stack1');
        const stack2 = new lib_1.Stack(app, 'Stack2');
        // WHEN - used in another stack
        new lib_1.CfnOutput(stack2, 'DemOutput', { value: stack1.region });
        new lib_1.CfnOutput(stack2, 'DemAccount', { value: stack1.account });
        // THEN
        const assembly = app.synth();
        const template2 = assembly.getStackByName(stack2.stackName).template;
        expect(template2?.Outputs).toEqual({
            DemOutput: {
                Value: { Ref: 'AWS::Region' },
            },
            DemAccount: {
                Value: { Ref: 'AWS::AccountId' },
            },
        });
    });
    test('cross-stack references in strings work', () => {
        // GIVEN
        const app = new lib_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack1 = new lib_1.Stack(app, 'Stack1');
        const account1 = new lib_1.ScopedAws(stack1).accountId;
        const stack2 = new lib_1.Stack(app, 'Stack2');
        // WHEN - used in another stack
        new lib_1.CfnParameter(stack2, 'SomeParameter', { type: 'String', default: `TheAccountIs${account1}` });
        const assembly = app.synth();
        const template2 = assembly.getStackByName(stack2.stackName).template;
        // THEN
        expect(template2).toEqual({
            Parameters: {
                SomeParameter: {
                    Type: 'String',
                    Default: { 'Fn::Join': ['', ['TheAccountIs', { 'Fn::ImportValue': 'Stack1:ExportsOutputRefAWSAccountIdAD568057' }]] },
                },
            },
        });
    });
    test('cross-stack references of lists returned from Fn::GetAtt work', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack1 = new lib_1.Stack(app, 'Stack1');
        const exportResource = new lib_1.CfnResource(stack1, 'exportedResource', {
            type: 'BLA',
        });
        const stack2 = new lib_1.Stack(app, 'Stack2');
        // L1s represent attribute names with `attr${attributeName}`
        exportResource.attrList = ['magic-attr-value'];
        // WHEN - used in another stack
        new lib_1.CfnResource(stack2, 'SomeResource', {
            type: 'BLA',
            properties: {
                Prop: exportResource.getAtt('List', lib_1.ResolutionTypeHint.STRING_LIST),
            },
        });
        const assembly = app.synth();
        const template1 = assembly.getStackByName(stack1.stackName).template;
        const template2 = assembly.getStackByName(stack2.stackName).template;
        // THEN
        expect(template1).toMatchObject({
            Outputs: {
                ExportsOutputFnGetAttexportedResourceList0EA3E0D9: {
                    Value: {
                        'Fn::Join': [
                            '||', {
                                'Fn::GetAtt': [
                                    'exportedResource',
                                    'List',
                                ],
                            },
                        ],
                    },
                    Export: { Name: 'Stack1:ExportsOutputFnGetAttexportedResourceList0EA3E0D9' },
                },
            },
        });
        expect(template2).toMatchObject({
            Resources: {
                SomeResource: {
                    Type: 'BLA',
                    Properties: {
                        Prop: {
                            'Fn::Split': [
                                '||',
                                {
                                    'Fn::ImportValue': 'Stack1:ExportsOutputFnGetAttexportedResourceList0EA3E0D9',
                                },
                            ],
                        },
                    },
                },
            },
        });
    });
    test('cross-stack references of lists returned from Fn::GetAtt can be used with CFN intrinsics', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack1 = new lib_1.Stack(app, 'Stack1');
        const exportResource = new lib_1.CfnResource(stack1, 'exportedResource', {
            type: 'BLA',
        });
        const stack2 = new lib_1.Stack(app, 'Stack2');
        // L1s represent attribute names with `attr${attributeName}`
        exportResource.attrList = ['magic-attr-value'];
        // WHEN - used in another stack
        new lib_1.CfnResource(stack2, 'SomeResource', {
            type: 'BLA',
            properties: {
                Prop: lib_1.Fn.select(3, exportResource.getAtt('List', lib_1.ResolutionTypeHint.STRING_LIST)),
            },
        });
        const assembly = app.synth();
        const template1 = assembly.getStackByName(stack1.stackName).template;
        const template2 = assembly.getStackByName(stack2.stackName).template;
        // THEN
        expect(template1).toMatchObject({
            Outputs: {
                ExportsOutputFnGetAttexportedResourceList0EA3E0D9: {
                    Value: {
                        'Fn::Join': [
                            '||', {
                                'Fn::GetAtt': [
                                    'exportedResource',
                                    'List',
                                ],
                            },
                        ],
                    },
                    Export: { Name: 'Stack1:ExportsOutputFnGetAttexportedResourceList0EA3E0D9' },
                },
            },
        });
        expect(template2).toMatchObject({
            Resources: {
                SomeResource: {
                    Type: 'BLA',
                    Properties: {
                        Prop: {
                            'Fn::Select': [
                                3,
                                {
                                    'Fn::Split': [
                                        '||',
                                        {
                                            'Fn::ImportValue': 'Stack1:ExportsOutputFnGetAttexportedResourceList0EA3E0D9',
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                },
            },
        });
    });
    test('cross-stack references of lists returned from Fn::Ref work', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack1 = new lib_1.Stack(app, 'Stack1');
        const param = new lib_1.CfnParameter(stack1, 'magicParameter', {
            default: 'BLAT,BLAH',
            type: 'List<String>',
        });
        const stack2 = new lib_1.Stack(app, 'Stack2');
        // WHEN - used in another stack
        new lib_1.CfnResource(stack2, 'SomeResource', {
            type: 'BLA',
            properties: {
                Prop: param.value,
            },
        });
        const assembly = app.synth();
        const template1 = assembly.getStackByName(stack1.stackName).template;
        const template2 = assembly.getStackByName(stack2.stackName).template;
        // THEN
        expect(template1).toMatchObject({
            Outputs: {
                ExportsOutputRefmagicParameter4CC6F7BE: {
                    Value: {
                        'Fn::Join': [
                            '||', {
                                Ref: 'magicParameter',
                            },
                        ],
                    },
                    Export: { Name: 'Stack1:ExportsOutputRefmagicParameter4CC6F7BE' },
                },
            },
        });
        expect(template2).toMatchObject({
            Resources: {
                SomeResource: {
                    Type: 'BLA',
                    Properties: {
                        Prop: {
                            'Fn::Split': [
                                '||',
                                {
                                    'Fn::ImportValue': 'Stack1:ExportsOutputRefmagicParameter4CC6F7BE',
                                },
                            ],
                        },
                    },
                },
            },
        });
    });
    test('cross-region stack references, crossRegionReferences=true', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack1 = new lib_1.Stack(app, 'Stack1', { env: { region: 'us-east-1' }, crossRegionReferences: true });
        const exportResource = new lib_1.CfnResource(stack1, 'SomeResourceExport', {
            type: 'AWS::S3::Bucket',
        });
        const stack2 = new lib_1.Stack(app, 'Stack2', { env: { region: 'us-east-2' }, crossRegionReferences: true });
        // WHEN - used in another stack
        new lib_1.CfnResource(stack2, 'SomeResource', {
            type: 'AWS::S3::Bucket',
            properties: {
                Name: exportResource.getAtt('name'),
            },
        });
        const assembly = app.synth();
        const template2 = assembly.getStackByName(stack2.stackName).template;
        const template1 = assembly.getStackByName(stack1.stackName).template;
        // THEN
        expect(template1).toMatchObject({
            Resources: {
                SomeResourceExport: {
                    Type: 'AWS::S3::Bucket',
                },
                ExportsWriteruseast2828FA26B86FBEFA7: {
                    Type: 'Custom::CrossRegionExportWriter',
                    DeletionPolicy: 'Delete',
                    Properties: {
                        WriterProps: {
                            exports: {
                                '/cdk/exports/Stack2/Stack1useast1FnGetAttSomeResourceExportname47AD304F': {
                                    'Fn::GetAtt': [
                                        'SomeResourceExport',
                                        'name',
                                    ],
                                },
                            },
                            region: 'us-east-2',
                        },
                        ServiceToken: {
                            'Fn::GetAtt': [
                                'CustomCrossRegionExportWriterCustomResourceProviderHandlerD8786E8A',
                                'Arn',
                            ],
                        },
                    },
                },
            },
        });
        expect(template2).toMatchObject({
            Resources: {
                SomeResource: {
                    Type: 'AWS::S3::Bucket',
                    Properties: {
                        Name: {
                            'Fn::GetAtt': [
                                'ExportsReader8B249524',
                                '/cdk/exports/Stack2/Stack1useast1FnGetAttSomeResourceExportname47AD304F',
                            ],
                        },
                    },
                },
            },
        });
    });
    test('cross-region stack references throws error', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack1 = new lib_1.Stack(app, 'Stack1', { env: { region: 'us-east-1' }, crossRegionReferences: true });
        const exportResource = new lib_1.CfnResource(stack1, 'SomeResourceExport', {
            type: 'AWS::S3::Bucket',
        });
        const stack2 = new lib_1.Stack(app, 'Stack2', { env: { region: 'us-east-2' } });
        // WHEN - used in another stack
        new lib_1.CfnResource(stack2, 'SomeResource', {
            type: 'AWS::S3::Bucket',
            properties: {
                Name: exportResource.getAtt('name'),
            },
        });
        // THEN
        expect(() => {
            app.synth();
        }).toThrow(/Set crossRegionReferences=true to enable cross region references/);
    });
    test('cross region stack references with multiple stacks, crossRegionReferences=true', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack1 = new lib_1.Stack(app, 'Stack1', { env: { region: 'us-east-1' }, crossRegionReferences: true });
        const exportResource = new lib_1.CfnResource(stack1, 'SomeResourceExport', {
            type: 'AWS::S3::Bucket',
        });
        const stack3 = new lib_1.Stack(app, 'Stack3', { env: { region: 'us-east-1' }, crossRegionReferences: true });
        const exportResource3 = new lib_1.CfnResource(stack3, 'SomeResourceExport', {
            type: 'AWS::S3::Bucket',
        });
        const stack2 = new lib_1.Stack(app, 'Stack2', { env: { region: 'us-east-2' }, crossRegionReferences: true });
        // WHEN - used in another stack
        new lib_1.CfnResource(stack2, 'SomeResource', {
            type: 'AWS::S3::Bucket',
            properties: {
                Name: exportResource.getAtt('name'),
                Other: exportResource.getAtt('other'),
                Other2: exportResource3.getAtt('other2'),
            },
        });
        const assembly = app.synth();
        const template2 = assembly.getStackByName(stack2.stackName).template;
        const template3 = assembly.getStackByName(stack3.stackName).template;
        const template1 = assembly.getStackByName(stack1.stackName).template;
        // THEN
        expect(template2).toMatchObject({
            Resources: {
                CustomCrossRegionExportReaderCustomResourceProviderRole10531BBD: {
                    Properties: {
                        Policies: [
                            {
                                PolicyDocument: {
                                    Statement: [
                                        {
                                            Action: [
                                                'ssm:AddTagsToResource',
                                                'ssm:RemoveTagsFromResource',
                                                'ssm:GetParameters',
                                            ],
                                            Effect: 'Allow',
                                            Resource: {
                                                'Fn::Join': [
                                                    '',
                                                    [
                                                        'arn:',
                                                        {
                                                            Ref: 'AWS::Partition',
                                                        },
                                                        ':ssm:us-east-2:',
                                                        {
                                                            Ref: 'AWS::AccountId',
                                                        },
                                                        ':parameter/cdk/exports/Stack2/*',
                                                    ],
                                                ],
                                            },
                                        },
                                    ],
                                    Version: '2012-10-17',
                                },
                                PolicyName: 'Inline',
                            },
                        ],
                    },
                    Type: 'AWS::IAM::Role',
                },
                ExportsReader8B249524: {
                    DeletionPolicy: 'Delete',
                    Properties: {
                        ReaderProps: {
                            imports: {
                                '/cdk/exports/Stack2/Stack1useast1FnGetAttSomeResourceExportname47AD304F': '{{resolve:ssm:/cdk/exports/Stack2/Stack1useast1FnGetAttSomeResourceExportname47AD304F}}',
                                '/cdk/exports/Stack2/Stack1useast1FnGetAttSomeResourceExportotherC6F8CBD1': '{{resolve:ssm:/cdk/exports/Stack2/Stack1useast1FnGetAttSomeResourceExportotherC6F8CBD1}}',
                                '/cdk/exports/Stack2/Stack3useast1FnGetAttSomeResourceExportother2190A679B': '{{resolve:ssm:/cdk/exports/Stack2/Stack3useast1FnGetAttSomeResourceExportother2190A679B}}',
                            },
                            region: 'us-east-2',
                            prefix: 'Stack2',
                        },
                        ServiceToken: {
                            'Fn::GetAtt': [
                                'CustomCrossRegionExportReaderCustomResourceProviderHandler46647B68',
                                'Arn',
                            ],
                        },
                    },
                    Type: 'Custom::CrossRegionExportReader',
                    UpdateReplacePolicy: 'Delete',
                },
                SomeResource: {
                    Type: 'AWS::S3::Bucket',
                    Properties: {
                        Name: {
                            'Fn::GetAtt': [
                                'ExportsReader8B249524',
                                '/cdk/exports/Stack2/Stack1useast1FnGetAttSomeResourceExportname47AD304F',
                            ],
                        },
                        Other: {
                            'Fn::GetAtt': [
                                'ExportsReader8B249524',
                                '/cdk/exports/Stack2/Stack1useast1FnGetAttSomeResourceExportotherC6F8CBD1',
                            ],
                        },
                        Other2: {
                            'Fn::GetAtt': [
                                'ExportsReader8B249524',
                                '/cdk/exports/Stack2/Stack3useast1FnGetAttSomeResourceExportother2190A679B',
                            ],
                        },
                    },
                },
            },
        });
        expect(template3).toMatchObject({
            Resources: {
                SomeResourceExport: {
                    Type: 'AWS::S3::Bucket',
                },
                ExportsWriteruseast2828FA26B86FBEFA7: {
                    Type: 'Custom::CrossRegionExportWriter',
                    DeletionPolicy: 'Delete',
                    Properties: {
                        WriterProps: {
                            exports: {
                                '/cdk/exports/Stack2/Stack3useast1FnGetAttSomeResourceExportother2190A679B': {
                                    'Fn::GetAtt': [
                                        'SomeResourceExport',
                                        'other2',
                                    ],
                                },
                            },
                            region: 'us-east-2',
                        },
                        ServiceToken: {
                            'Fn::GetAtt': [
                                'CustomCrossRegionExportWriterCustomResourceProviderHandlerD8786E8A',
                                'Arn',
                            ],
                        },
                    },
                },
            },
        });
        expect(template1).toMatchObject({
            Resources: {
                SomeResourceExport: {
                    Type: 'AWS::S3::Bucket',
                },
                ExportsWriteruseast2828FA26B86FBEFA7: {
                    Type: 'Custom::CrossRegionExportWriter',
                    DeletionPolicy: 'Delete',
                    Properties: {
                        WriterProps: {
                            exports: {
                                '/cdk/exports/Stack2/Stack1useast1FnGetAttSomeResourceExportname47AD304F': {
                                    'Fn::GetAtt': [
                                        'SomeResourceExport',
                                        'name',
                                    ],
                                },
                                '/cdk/exports/Stack2/Stack1useast1FnGetAttSomeResourceExportotherC6F8CBD1': {
                                    'Fn::GetAtt': [
                                        'SomeResourceExport',
                                        'other',
                                    ],
                                },
                            },
                            region: 'us-east-2',
                        },
                        ServiceToken: {
                            'Fn::GetAtt': [
                                'CustomCrossRegionExportWriterCustomResourceProviderHandlerD8786E8A',
                                'Arn',
                            ],
                        },
                    },
                },
            },
        });
    });
    test('cross region stack references with multiple stacks and multiple regions, crossRegionReferences=true', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack1 = new lib_1.Stack(app, 'Stack1', { env: { region: 'us-east-1' }, crossRegionReferences: true });
        const exportResource = new lib_1.CfnResource(stack1, 'SomeResourceExport', {
            type: 'AWS::S3::Bucket',
        });
        const stack3 = new lib_1.Stack(app, 'Stack3', { env: { region: 'us-west-1' }, crossRegionReferences: true });
        const exportResource3 = new lib_1.CfnResource(stack3, 'SomeResourceExport', {
            type: 'AWS::S3::Bucket',
        });
        const stack2 = new lib_1.Stack(app, 'Stack2', { env: { region: 'us-east-2' }, crossRegionReferences: true });
        // WHEN - used in another stack
        new lib_1.CfnResource(stack2, 'SomeResource', {
            type: 'AWS::S3::Bucket',
            properties: {
                Name: exportResource.getAtt('name'),
                Other: exportResource.getAtt('other'),
                Other2: exportResource3.getAtt('other2'),
            },
        });
        const assembly = app.synth();
        const template2 = assembly.getStackByName(stack2.stackName).template;
        const template3 = assembly.getStackByName(stack3.stackName).template;
        const template1 = assembly.getStackByName(stack1.stackName).template;
        // THEN
        expect(template3).toMatchObject({
            Resources: {
                SomeResourceExport: {
                    Type: 'AWS::S3::Bucket',
                },
            },
        });
        expect(template2).toMatchObject({
            Resources: {
                SomeResource: {
                    Type: 'AWS::S3::Bucket',
                    Properties: {
                        Name: {
                            'Fn::GetAtt': [
                                'ExportsReader8B249524',
                                '/cdk/exports/Stack2/Stack1useast1FnGetAttSomeResourceExportname47AD304F',
                            ],
                        },
                        Other: {
                            'Fn::GetAtt': [
                                'ExportsReader8B249524',
                                '/cdk/exports/Stack2/Stack1useast1FnGetAttSomeResourceExportotherC6F8CBD1',
                            ],
                        },
                        Other2: {
                            'Fn::GetAtt': [
                                'ExportsReader8B249524',
                                '/cdk/exports/Stack2/Stack3uswest1FnGetAttSomeResourceExportother2491B5DA7',
                            ],
                        },
                    },
                },
            },
        });
        expect(template3).toMatchObject({
            Resources: {
                SomeResourceExport: {
                    Type: 'AWS::S3::Bucket',
                },
                ExportsWriteruseast2828FA26B86FBEFA7: {
                    Type: 'Custom::CrossRegionExportWriter',
                    DeletionPolicy: 'Delete',
                    Properties: {
                        WriterProps: {
                            exports: {
                                '/cdk/exports/Stack2/Stack3uswest1FnGetAttSomeResourceExportother2491B5DA7': {
                                    'Fn::GetAtt': [
                                        'SomeResourceExport',
                                        'other2',
                                    ],
                                },
                            },
                            region: 'us-east-2',
                        },
                        ServiceToken: {
                            'Fn::GetAtt': [
                                'CustomCrossRegionExportWriterCustomResourceProviderHandlerD8786E8A',
                                'Arn',
                            ],
                        },
                    },
                },
            },
        });
        expect(template1).toMatchObject({
            Resources: {
                SomeResourceExport: {
                    Type: 'AWS::S3::Bucket',
                },
                ExportsWriteruseast2828FA26B86FBEFA7: {
                    Type: 'Custom::CrossRegionExportWriter',
                    DeletionPolicy: 'Delete',
                    Properties: {
                        WriterProps: {
                            exports: {
                                '/cdk/exports/Stack2/Stack1useast1FnGetAttSomeResourceExportname47AD304F': {
                                    'Fn::GetAtt': [
                                        'SomeResourceExport',
                                        'name',
                                    ],
                                },
                                '/cdk/exports/Stack2/Stack1useast1FnGetAttSomeResourceExportotherC6F8CBD1': {
                                    'Fn::GetAtt': [
                                        'SomeResourceExport',
                                        'other',
                                    ],
                                },
                            },
                            region: 'us-east-2',
                        },
                        ServiceToken: {
                            'Fn::GetAtt': [
                                'CustomCrossRegionExportWriterCustomResourceProviderHandlerD8786E8A',
                                'Arn',
                            ],
                        },
                    },
                },
            },
        });
    });
    test('cross stack references and dependencies work within child stacks (non-nested)', () => {
        // GIVEN
        const app = new lib_1.App({
            context: {
                '@aws-cdk/core:stackRelativeExports': true,
                [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
            },
        });
        const parent = new lib_1.Stack(app, 'Parent');
        const child1 = new lib_1.Stack(parent, 'Child1');
        const child2 = new lib_1.Stack(parent, 'Child2');
        const resourceA = new lib_1.CfnResource(child1, 'ResourceA', { type: 'RA' });
        const resourceB = new lib_1.CfnResource(child1, 'ResourceB', { type: 'RB' });
        // WHEN
        const resource2 = new lib_1.CfnResource(child2, 'Resource1', {
            type: 'R2',
            properties: {
                RefToResource1: resourceA.ref,
            },
        });
        resource2.addDependency(resourceB);
        // THEN
        const assembly = app.synth();
        const parentTemplate = assembly.getStackArtifact(parent.artifactId).template;
        const child1Template = assembly.getStackArtifact(child1.artifactId).template;
        const child2Template = assembly.getStackArtifact(child2.artifactId).template;
        expect(parentTemplate).toEqual({});
        expect(child1Template).toEqual({
            Resources: {
                ResourceA: { Type: 'RA' },
                ResourceB: { Type: 'RB' },
            },
            Outputs: {
                ExportsOutputRefResourceA461B4EF9: {
                    Value: { Ref: 'ResourceA' },
                    Export: { Name: 'ParentChild18FAEF419:ExportsOutputRefResourceA461B4EF9' },
                },
            },
        });
        expect(child2Template).toEqual({
            Resources: {
                Resource1: {
                    Type: 'R2',
                    Properties: {
                        RefToResource1: { 'Fn::ImportValue': 'ParentChild18FAEF419:ExportsOutputRefResourceA461B4EF9' },
                    },
                },
            },
        });
        expect(assembly.getStackArtifact(child1.artifactId).dependencies.map((x) => x.id)).toEqual([]);
        expect(assembly.getStackArtifact(child2.artifactId).dependencies.map((x) => x.id)).toEqual(['ParentChild18FAEF419']);
    });
    test('_addAssemblyDependency adds to _stackDependencies', () => {
        const app = new lib_1.App({
            context: {
                '@aws-cdk/core:stackRelativeExports': true,
                [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
            },
        });
        const parent = new lib_1.Stack(app, 'Parent');
        const child1 = new lib_1.Stack(parent, 'Child1');
        const childA = new lib_1.Stack(parent, 'ChildA');
        const resource1 = new lib_1.CfnResource(child1, 'Resource1', { type: 'R1' });
        const resource2 = new lib_1.CfnResource(child1, 'Resource2', { type: 'R2' });
        const resourceA = new lib_1.CfnResource(childA, 'ResourceA', { type: 'RA' });
        childA._addAssemblyDependency(child1, { source: resourceA, target: resource1 });
        childA._addAssemblyDependency(child1, { source: resourceA, target: resource2 });
        expect(childA._obtainAssemblyDependencies({ source: resourceA }))
            .toEqual([resource1, resource2]);
        const assembly = app.synth();
        expect(assembly.getStackArtifact(child1.artifactId).dependencies.map((x) => x.id)).toEqual([]);
        expect(assembly.getStackArtifact(childA.artifactId).dependencies.map((x) => x.id)).toEqual(['ParentChild18FAEF419']);
    });
    test('_addAssemblyDependency adds one StackDependencyReason with defaults', () => {
        const app = new lib_1.App({
            context: {
                '@aws-cdk/core:stackRelativeExports': true,
                [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
            },
        });
        const parent = new lib_1.Stack(app, 'Parent');
        const child1 = new lib_1.Stack(parent, 'Child1');
        const childA = new lib_1.Stack(parent, 'ChildA');
        childA._addAssemblyDependency(child1);
        expect(childA._obtainAssemblyDependencies({ source: childA }))
            .toEqual([child1]);
        const assembly = app.synth();
        expect(assembly.getStackArtifact(child1.artifactId).dependencies.map((x) => x.id)).toEqual([]);
        expect(assembly.getStackArtifact(childA.artifactId).dependencies.map((x) => x.id)).toEqual(['ParentChild18FAEF419']);
    });
    test('_addAssemblyDependency raises error on cycle', () => {
        const app = new lib_1.App({
            context: {
                '@aws-cdk/core:stackRelativeExports': true,
                [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
            },
        });
        const parent = new lib_1.Stack(app, 'Parent');
        const child1 = new lib_1.Stack(parent, 'Child1');
        const child2 = new lib_1.Stack(parent, 'Child2');
        child2._addAssemblyDependency(child1);
        expect(() => child1._addAssemblyDependency(child2)).toThrow("'Parent/Child2' depends on");
    });
    test('_addAssemblyDependency raises error for nested stacks', () => {
        const app = new lib_1.App({
            context: {
                '@aws-cdk/core:stackRelativeExports': true,
                [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
            },
        });
        const parent = new lib_1.Stack(app, 'Parent');
        const child1 = new lib_1.NestedStack(parent, 'Child1');
        const child2 = new lib_1.NestedStack(parent, 'Child2');
        expect(() => child1._addAssemblyDependency(child2)).toThrow('Cannot add assembly-level');
    });
    test('_addAssemblyDependency handles duplicate dependency reasons', () => {
        const app = new lib_1.App({
            context: {
                '@aws-cdk/core:stackRelativeExports': true,
                [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
            },
        });
        const parent = new lib_1.Stack(app, 'Parent');
        const child1 = new lib_1.Stack(parent, 'Child1');
        const child2 = new lib_1.Stack(parent, 'Child2');
        child2._addAssemblyDependency(child1);
        const depsBefore = child2._obtainAssemblyDependencies({ source: child2 });
        child2._addAssemblyDependency(child1);
        expect(depsBefore).toEqual(child2._obtainAssemblyDependencies({ source: child2 }));
    });
    test('_removeAssemblyDependency removes one StackDependencyReason of two from _stackDependencies', () => {
        const app = new lib_1.App({
            context: {
                '@aws-cdk/core:stackRelativeExports': true,
                [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
            },
        });
        const parent = new lib_1.Stack(app, 'Parent');
        const child1 = new lib_1.Stack(parent, 'Child1');
        const childA = new lib_1.Stack(parent, 'ChildA');
        const resource1 = new lib_1.CfnResource(child1, 'Resource1', { type: 'R1' });
        const resource2 = new lib_1.CfnResource(child1, 'Resource2', { type: 'R2' });
        const resourceA = new lib_1.CfnResource(childA, 'ResourceA', { type: 'RA' });
        childA._addAssemblyDependency(child1, { source: resourceA, target: resource1 });
        childA._addAssemblyDependency(child1, { source: resourceA, target: resource2 });
        childA._removeAssemblyDependency(child1, { source: resourceA, target: resource1 });
        expect(childA._obtainAssemblyDependencies({ source: resourceA })).toEqual([resource2]);
        const assembly = app.synth();
        expect(assembly.getStackArtifact(child1.artifactId).dependencies.map((x) => x.id)).toEqual([]);
        expect(assembly.getStackArtifact(childA.artifactId).dependencies.map((x) => x.id)).toEqual(['ParentChild18FAEF419']);
    });
    test('_removeAssemblyDependency removes a StackDependency from _stackDependencies with the last reason', () => {
        const app = new lib_1.App({
            context: {
                '@aws-cdk/core:stackRelativeExports': true,
                [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
            },
        });
        const parent = new lib_1.Stack(app, 'Parent');
        const child1 = new lib_1.Stack(parent, 'Child1');
        const childA = new lib_1.Stack(parent, 'Child2');
        const resource1 = new lib_1.CfnResource(child1, 'Resource1', { type: 'R1' });
        const resource2 = new lib_1.CfnResource(child1, 'Resource2', { type: 'R2' });
        const resourceA = new lib_1.CfnResource(childA, 'ResourceA', { type: 'RA' });
        childA._addAssemblyDependency(child1, { source: resourceA, target: resource1 });
        childA._addAssemblyDependency(child1, { source: resourceA, target: resource2 });
        childA._removeAssemblyDependency(child1, { source: resourceA, target: resource1 });
        childA._removeAssemblyDependency(child1, { source: resourceA, target: resource2 });
        expect(childA._obtainAssemblyDependencies({ source: childA })).toEqual([]);
        const assembly = app.synth();
        expect(assembly.getStackArtifact(child1.artifactId).dependencies.map((x) => x.id)).toEqual([]);
        expect(assembly.getStackArtifact(childA.artifactId).dependencies.map((x) => x.id)).toEqual([]);
    });
    test('_removeAssemblyDependency removes a StackDependency with default reason', () => {
        const app = new lib_1.App({
            context: {
                '@aws-cdk/core:stackRelativeExports': true,
                [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
            },
        });
        const parent = new lib_1.Stack(app, 'Parent');
        const child1 = new lib_1.Stack(parent, 'Child1');
        const childA = new lib_1.Stack(parent, 'Child2');
        childA._addAssemblyDependency(child1);
        childA._removeAssemblyDependency(child1);
        expect(childA._obtainAssemblyDependencies({ source: childA })).toEqual([]);
        const assembly = app.synth();
        expect(assembly.getStackArtifact(child1.artifactId).dependencies.map((x) => x.id)).toEqual([]);
        expect(assembly.getStackArtifact(childA.artifactId).dependencies.map((x) => x.id)).toEqual([]);
    });
    test('_removeAssemblyDependency raises an error for nested stacks', () => {
        const app = new lib_1.App({
            context: {
                '@aws-cdk/core:stackRelativeExports': true,
                [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
            },
        });
        const parent = new lib_1.Stack(app, 'Parent');
        const child1 = new lib_1.NestedStack(parent, 'Child1');
        const childA = new lib_1.NestedStack(parent, 'Child2');
        expect(() => childA._removeAssemblyDependency(child1)).toThrow('There cannot be assembly-level');
    });
    test('_removeAssemblyDependency handles a non-matching dependency reason', () => {
        const app = new lib_1.App({
            context: {
                '@aws-cdk/core:stackRelativeExports': true,
                [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
            },
        });
        const parent = new lib_1.Stack(app, 'Parent');
        const child1 = new lib_1.Stack(parent, 'Child1');
        const childA = new lib_1.Stack(parent, 'Child2');
        const resource1 = new lib_1.CfnResource(child1, 'Resource1', { type: 'R1' });
        const resourceA = new lib_1.CfnResource(childA, 'ResourceA', { type: 'RA' });
        childA._addAssemblyDependency(child1);
        childA._removeAssemblyDependency(child1, { source: resourceA, target: resource1 });
    });
    test('automatic cross-stack references and manual exports look the same', () => {
        // GIVEN: automatic
        const appA = new lib_1.App({ context: { '@aws-cdk/core:stackRelativeExports': true } });
        const producerA = new lib_1.Stack(appA, 'Producer');
        const consumerA = new lib_1.Stack(appA, 'Consumer');
        const resourceA = new lib_1.CfnResource(producerA, 'Resource', { type: 'AWS::Resource' });
        new lib_1.CfnOutput(consumerA, 'SomeOutput', { value: `${resourceA.getAtt('Att')}` });
        // GIVEN: manual
        const appM = new lib_1.App();
        const producerM = new lib_1.Stack(appM, 'Producer');
        const resourceM = new lib_1.CfnResource(producerM, 'Resource', { type: 'AWS::Resource' });
        producerM.exportValue(resourceM.getAtt('Att'));
        // THEN - producers are the same
        const templateA = appA.synth().getStackByName(producerA.stackName).template;
        const templateM = appM.synth().getStackByName(producerM.stackName).template;
        expect(templateA).toEqual(templateM);
    });
    test('automatic cross-stack references and manual list exports look the same', () => {
        // GIVEN: automatic
        const appA = new lib_1.App({ context: { '@aws-cdk/core:stackRelativeExports': true } });
        const producerA = new lib_1.Stack(appA, 'Producer');
        const consumerA = new lib_1.Stack(appA, 'Consumer');
        const resourceA = new lib_1.CfnResource(producerA, 'Resource', { type: 'AWS::Resource' });
        resourceA.attrAtt = ['Foo', 'Bar'];
        new lib_1.CfnOutput(consumerA, 'SomeOutput', { value: `${resourceA.getAtt('Att', lib_1.ResolutionTypeHint.STRING_LIST)}` });
        // GIVEN: manual
        const appM = new lib_1.App();
        const producerM = new lib_1.Stack(appM, 'Producer');
        const resourceM = new lib_1.CfnResource(producerM, 'Resource', { type: 'AWS::Resource' });
        resourceM.attrAtt = ['Foo', 'Bar'];
        producerM.exportStringListValue(resourceM.getAtt('Att', lib_1.ResolutionTypeHint.STRING_LIST));
        // THEN - producers are the same
        const templateA = appA.synth().getStackByName(producerA.stackName).template;
        const templateM = appM.synth().getStackByName(producerM.stackName).template;
        expect(templateA).toEqual(templateM);
    });
    test('throw error if overrideLogicalId is used and logicalId is locked', () => {
        // GIVEN: manual
        const appM = new lib_1.App();
        const producerM = new lib_1.Stack(appM, 'Producer');
        const resourceM = new lib_1.CfnResource(producerM, 'ResourceXXX', { type: 'AWS::Resource' });
        producerM.exportValue(resourceM.getAtt('Att'));
        // THEN - producers are the same
        expect(() => {
            resourceM.overrideLogicalId('OVERRIDE_LOGICAL_ID');
        }).toThrow(/The logicalId for resource at path Producer\/ResourceXXX has been locked and cannot be overridden/);
    });
    test('do not throw error if overrideLogicalId is used and logicalId is not locked', () => {
        // GIVEN: manual
        const appM = new lib_1.App();
        const producerM = new lib_1.Stack(appM, 'Producer');
        const resourceM = new lib_1.CfnResource(producerM, 'ResourceXXX', { type: 'AWS::Resource' });
        // THEN - producers are the same
        resourceM.overrideLogicalId('OVERRIDE_LOGICAL_ID');
        producerM.exportValue(resourceM.getAtt('Att'));
        const template = appM.synth().getStackByName(producerM.stackName).template;
        expect(template).toMatchObject({
            Outputs: {
                ExportsOutputFnGetAttOVERRIDELOGICALIDAtt2DD28019: {
                    Export: {
                        Name: 'Producer:ExportsOutputFnGetAttOVERRIDELOGICALIDAtt2DD28019',
                    },
                    Value: {
                        'Fn::GetAtt': [
                            'OVERRIDE_LOGICAL_ID',
                            'Att',
                        ],
                    },
                },
            },
            Resources: {
                OVERRIDE_LOGICAL_ID: {
                    Type: 'AWS::Resource',
                },
            },
        });
    });
    test('automatic cross-stack references and manual exports look the same: nested stack edition', () => {
        // GIVEN: automatic
        const appA = new lib_1.App();
        const producerA = new lib_1.Stack(appA, 'Producer');
        const nestedA = new lib_1.NestedStack(producerA, 'Nestor');
        const resourceA = new lib_1.CfnResource(nestedA, 'Resource', { type: 'AWS::Resource' });
        const consumerA = new lib_1.Stack(appA, 'Consumer');
        new lib_1.CfnOutput(consumerA, 'SomeOutput', { value: `${resourceA.getAtt('Att')}` });
        // GIVEN: manual
        const appM = new lib_1.App();
        const producerM = new lib_1.Stack(appM, 'Producer');
        const nestedM = new lib_1.NestedStack(producerM, 'Nestor');
        const resourceM = new lib_1.CfnResource(nestedM, 'Resource', { type: 'AWS::Resource' });
        producerM.exportValue(resourceM.getAtt('Att'));
        // THEN - producers are the same
        const templateA = appA.synth().getStackByName(producerA.stackName).template;
        const templateM = appM.synth().getStackByName(producerM.stackName).template;
        expect(templateA).toEqual(templateM);
    });
    test('manual exports require a name if not supplying a resource attribute', () => {
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'Stack');
        expect(() => {
            stack.exportValue('someValue');
        }).toThrow(/or make sure to export a resource attribute/);
    });
    test('manual list exports require a name if not supplying a resource attribute', () => {
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'Stack');
        expect(() => {
            stack.exportStringListValue(['someValue']);
        }).toThrow(/or make sure to export a resource attribute/);
    });
    test('manual exports can also just be used to create an export of anything', () => {
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'Stack');
        const importV = stack.exportValue('someValue', { name: 'MyExport' });
        expect(stack.resolve(importV)).toEqual({ 'Fn::ImportValue': 'MyExport' });
    });
    test('manual list exports can also just be used to create an export of anything', () => {
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'Stack');
        const importV = stack.exportStringListValue(['someValue', 'anotherValue'], { name: 'MyExport' });
        expect(stack.resolve(importV)).toEqual({
            'Fn::Split': [
                '||',
                {
                    'Fn::ImportValue': 'MyExport',
                },
            ],
        });
        const template = app.synth().getStackByName(stack.stackName).template;
        expect(template).toMatchObject({
            Outputs: {
                ExportMyExport: {
                    Value: 'someValue||anotherValue',
                    Export: {
                        Name: 'MyExport',
                    },
                },
            },
        });
    });
    test('CfnSynthesisError is ignored when preparing cross references', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'my-stack');
        // WHEN
        class CfnTest extends lib_1.CfnResource {
            _toCloudFormation() {
                return new util_2.PostResolveToken({
                    xoo: 1234,
                }, props => {
                    (0, lib_1.validateString)(props).assertSuccess();
                });
            }
        }
        new CfnTest(stack, 'MyThing', { type: 'AWS::Type' });
        // THEN
        (0, refs_1.resolveReferences)(app);
    });
    test('Stacks can be children of other stacks (substack) and they will be synthesized separately', () => {
        // GIVEN
        const app = new lib_1.App();
        // WHEN
        const parentStack = new lib_1.Stack(app, 'parent');
        const childStack = new lib_1.Stack(parentStack, 'child');
        new lib_1.CfnResource(parentStack, 'MyParentResource', { type: 'Resource::Parent' });
        new lib_1.CfnResource(childStack, 'MyChildResource', { type: 'Resource::Child' });
        // THEN
        const assembly = app.synth();
        expect(assembly.getStackByName(parentStack.stackName).template?.Resources).toEqual({ MyParentResource: { Type: 'Resource::Parent' } });
        expect(assembly.getStackByName(childStack.stackName).template?.Resources).toEqual({ MyChildResource: { Type: 'Resource::Child' } });
    });
    test('Nested Stacks are synthesized with DESTROY policy', () => {
        const app = new lib_1.App();
        // WHEN
        const parentStack = new lib_1.Stack(app, 'parent');
        const childStack = new lib_1.NestedStack(parentStack, 'child');
        new lib_1.CfnResource(childStack, 'ChildResource', { type: 'Resource::Child' });
        const assembly = app.synth();
        expect(assembly.getStackByName(parentStack.stackName).template).toEqual(expect.objectContaining({
            Resources: {
                childNestedStackchildNestedStackResource7408D03F: expect.objectContaining({
                    Type: 'AWS::CloudFormation::Stack',
                    DeletionPolicy: 'Delete',
                }),
            },
        }));
    });
    test('asset metadata added to NestedStack resource that contains asset path and property', () => {
        const app = new lib_1.App();
        // WHEN
        const parentStack = new lib_1.Stack(app, 'parent');
        parentStack.node.setContext(cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT, true);
        const childStack = new lib_1.NestedStack(parentStack, 'child');
        new lib_1.CfnResource(childStack, 'ChildResource', { type: 'Resource::Child' });
        const assembly = app.synth();
        expect(assembly.getStackByName(parentStack.stackName).template).toEqual(expect.objectContaining({
            Resources: {
                childNestedStackchildNestedStackResource7408D03F: expect.objectContaining({
                    Metadata: {
                        'aws:asset:path': 'parentchild13F9359B.nested.template.json',
                        'aws:asset:property': 'TemplateURL',
                    },
                }),
            },
        }));
    });
    test('cross-stack reference (substack references parent stack)', () => {
        // GIVEN
        const app = new lib_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const parentStack = new lib_1.Stack(app, 'parent');
        const childStack = new lib_1.Stack(parentStack, 'child');
        // WHEN (a resource from the child stack references a resource from the parent stack)
        const parentResource = new lib_1.CfnResource(parentStack, 'MyParentResource', { type: 'Resource::Parent' });
        new lib_1.CfnResource(childStack, 'MyChildResource', {
            type: 'Resource::Child',
            properties: {
                ChildProp: parentResource.getAtt('AttOfParentResource'),
            },
        });
        // THEN
        const assembly = app.synth();
        expect(assembly.getStackByName(parentStack.stackName).template).toEqual({
            Resources: { MyParentResource: { Type: 'Resource::Parent' } },
            Outputs: {
                ExportsOutputFnGetAttMyParentResourceAttOfParentResourceC2D0BB9E: {
                    Value: { 'Fn::GetAtt': ['MyParentResource', 'AttOfParentResource'] },
                    Export: { Name: 'parent:ExportsOutputFnGetAttMyParentResourceAttOfParentResourceC2D0BB9E' },
                },
            },
        });
        expect(assembly.getStackByName(childStack.stackName).template).toEqual({
            Resources: {
                MyChildResource: {
                    Type: 'Resource::Child',
                    Properties: {
                        ChildProp: {
                            'Fn::ImportValue': 'parent:ExportsOutputFnGetAttMyParentResourceAttOfParentResourceC2D0BB9E',
                        },
                    },
                },
            },
        });
    });
    test('cross-stack reference (parent stack references substack)', () => {
        // GIVEN
        const app = new lib_1.App({
            context: {
                '@aws-cdk/core:stackRelativeExports': true,
                [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
            },
        });
        const parentStack = new lib_1.Stack(app, 'parent');
        const childStack = new lib_1.Stack(parentStack, 'child');
        // WHEN (a resource from the child stack references a resource from the parent stack)
        const childResource = new lib_1.CfnResource(childStack, 'MyChildResource', { type: 'Resource::Child' });
        new lib_1.CfnResource(parentStack, 'MyParentResource', {
            type: 'Resource::Parent',
            properties: {
                ParentProp: childResource.getAtt('AttributeOfChildResource'),
            },
        });
        // THEN
        const assembly = app.synth();
        expect(assembly.getStackByName(parentStack.stackName).template).toEqual({
            Resources: {
                MyParentResource: {
                    Type: 'Resource::Parent',
                    Properties: {
                        ParentProp: { 'Fn::ImportValue': 'parentchild13F9359B:ExportsOutputFnGetAttMyChildResourceAttributeOfChildResource52813264' },
                    },
                },
            },
        });
        expect(assembly.getStackByName(childStack.stackName).template).toEqual({
            Resources: { MyChildResource: { Type: 'Resource::Child' } },
            Outputs: {
                ExportsOutputFnGetAttMyChildResourceAttributeOfChildResource52813264: {
                    Value: { 'Fn::GetAtt': ['MyChildResource', 'AttributeOfChildResource'] },
                    Export: { Name: 'parentchild13F9359B:ExportsOutputFnGetAttMyChildResourceAttributeOfChildResource52813264' },
                },
            },
        });
    });
    test('cannot create cyclic reference between stacks', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack1 = new lib_1.Stack(app, 'Stack1');
        const account1 = new lib_1.ScopedAws(stack1).accountId;
        const stack2 = new lib_1.Stack(app, 'Stack2');
        const account2 = new lib_1.ScopedAws(stack2).accountId;
        // WHEN
        new lib_1.CfnParameter(stack2, 'SomeParameter', { type: 'String', default: account1 });
        new lib_1.CfnParameter(stack1, 'SomeParameter', { type: 'String', default: account2 });
        expect(() => {
            app.synth();
            // eslint-disable-next-line max-len
        }).toThrow("'Stack1' depends on 'Stack2' (Stack1 -> Stack2.AWS::AccountId). Adding this dependency (Stack2 -> Stack1.AWS::AccountId) would create a cyclic reference.");
    });
    test('stacks know about their dependencies', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack1 = new lib_1.Stack(app, 'Stack1');
        const account1 = new lib_1.ScopedAws(stack1).accountId;
        const stack2 = new lib_1.Stack(app, 'Stack2');
        // WHEN
        new lib_1.CfnParameter(stack2, 'SomeParameter', { type: 'String', default: account1 });
        app.synth();
        // THEN
        expect(stack2.dependencies.map(s => s.node.id)).toEqual(['Stack1']);
    });
    test('cannot create references to stacks in other accounts', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack1 = new lib_1.Stack(app, 'Stack1', { env: { account: '123456789012', region: 'es-norst-1' } });
        const account1 = new lib_1.ScopedAws(stack1).accountId;
        const stack2 = new lib_1.Stack(app, 'Stack2', { env: { account: '11111111111', region: 'es-norst-2' } });
        // WHEN
        new lib_1.CfnParameter(stack2, 'SomeParameter', { type: 'String', default: account1 });
        expect(() => {
            app.synth();
        }).toThrow(/Stack "Stack2" cannot reference [^ ]+ in stack "Stack1"/);
    });
    test('urlSuffix does not imply a stack dependency', () => {
        // GIVEN
        const app = new lib_1.App();
        const first = new lib_1.Stack(app, 'First');
        const second = new lib_1.Stack(app, 'Second');
        // WHEN
        new lib_1.CfnOutput(second, 'Output', {
            value: first.urlSuffix,
        });
        // THEN
        app.synth();
        expect(second.dependencies.length).toEqual(0);
    });
    test('stack with region supplied via props returns literal value', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'Stack1', { env: { account: '123456789012', region: 'es-norst-1' } });
        // THEN
        expect(stack.resolve(stack.region)).toEqual('es-norst-1');
    });
    describe('stack partition literal feature flag', () => {
        // GIVEN
        const featureFlag = { [cxapi.ENABLE_PARTITION_LITERALS]: true };
        const envForRegion = (region) => { return { env: { account: '123456789012', region: region } }; };
        // THEN
        describe('does not change missing or unknown region behaviors', () => {
            test('stacks with no region defined', () => {
                const noRegionStack = new lib_1.Stack(new lib_1.App(), 'MissingRegion');
                expect(noRegionStack.partition).toEqual(lib_1.Aws.PARTITION);
            });
            test('stacks with an unknown region', () => {
                const imaginaryRegionStack = new lib_1.Stack(new lib_1.App(), 'ImaginaryRegion', envForRegion('us-area51'));
                expect(imaginaryRegionStack.partition).toEqual(lib_1.Aws.PARTITION);
            });
        });
        describe('changes known region behaviors only when enabled', () => {
            test('(disabled)', () => {
                const app = new lib_1.App();
                region_info_1.RegionInfo.regions.forEach(function (region) {
                    const regionStack = new lib_1.Stack(app, `Region-${region.name}`, envForRegion(region.name));
                    expect(regionStack.partition).toEqual(lib_1.Aws.PARTITION);
                });
            });
            test('(enabled)', () => {
                const app = new lib_1.App({ context: featureFlag });
                region_info_1.RegionInfo.regions.forEach(function (region) {
                    const regionStack = new lib_1.Stack(app, `Region-${region.name}`, envForRegion(region.name));
                    expect(regionStack.partition).toEqual(region_info_1.RegionInfo.get(region.name).partition);
                });
            });
        });
    });
    test('overrideLogicalId(id) can be used to override the logical ID of a resource', () => {
        // GIVEN
        const stack = new lib_1.Stack();
        const bonjour = new lib_1.CfnResource(stack, 'BonjourResource', { type: 'Resource::Type' });
        // { Ref } and { GetAtt }
        new lib_1.CfnResource(stack, 'RefToBonjour', {
            type: 'Other::Resource',
            properties: {
                RefToBonjour: bonjour.ref,
                GetAttBonjour: bonjour.getAtt('TheAtt').toString(),
            },
        });
        bonjour.overrideLogicalId('BOOM');
        // THEN
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Resources: {
                BOOM: { Type: 'Resource::Type' },
                RefToBonjour: {
                    Type: 'Other::Resource',
                    Properties: {
                        RefToBonjour: { Ref: 'BOOM' },
                        GetAttBonjour: { 'Fn::GetAtt': ['BOOM', 'TheAtt'] },
                    },
                },
            },
        });
    });
    test('Stack name can be overridden via properties', () => {
        // WHEN
        const stack = new lib_1.Stack(undefined, 'Stack', { stackName: 'otherName' });
        // THEN
        expect(stack.stackName).toEqual('otherName');
    });
    test('Stack name is inherited from App name if available', () => {
        // WHEN
        const root = new lib_1.App();
        const app = new constructs_1.Construct(root, 'Prod');
        const stack = new lib_1.Stack(app, 'Stack');
        // THEN
        expect(stack.stackName).toEqual('ProdStackD5279B22');
    });
    test('generated stack names will not exceed 128 characters', () => {
        // WHEN
        const root = new lib_1.App();
        const app = new constructs_1.Construct(root, 'ProdAppThisNameButItWillOnlyBeTooLongWhenCombinedWithTheStackName' + 'z'.repeat(60));
        const stack = new lib_1.Stack(app, 'ThisNameIsVeryLongButItWillOnlyBeTooLongWhenCombinedWithTheAppNameStack');
        // THEN
        expect(stack.stackName.length).toEqual(128);
        expect(stack.stackName).toEqual('ProdAppThisNameButItWillOnlyBeTooLongWhenCombinedWithTheStaceryLongButItWillOnlyBeTooLongWhenCombinedWithTheAppNameStack864CC1D3');
    });
    test('stack construct id does not go through stack name validation if there is an explicit stack name', () => {
        // GIVEN
        const app = new lib_1.App();
        // WHEN
        const stack = new lib_1.Stack(app, 'invalid as : stack name, but thats fine', {
            stackName: 'valid-stack-name',
        });
        // THEN
        const session = app.synth();
        expect(stack.stackName).toEqual('valid-stack-name');
        expect(session.tryGetArtifact(stack.artifactId)).toBeDefined();
    });
    test('stack validation is performed on explicit stack name', () => {
        // GIVEN
        const app = new lib_1.App();
        // THEN
        expect(() => new lib_1.Stack(app, 'boom', { stackName: 'invalid:stack:name' }))
            .toThrow(/Stack name must match the regular expression/);
    });
    test('Stack.of(stack) returns the correct stack', () => {
        const stack = new lib_1.Stack();
        expect(lib_1.Stack.of(stack)).toBe(stack);
        const parent = new constructs_1.Construct(stack, 'Parent');
        const construct = new constructs_1.Construct(parent, 'Construct');
        expect(lib_1.Stack.of(construct)).toBe(stack);
    });
    test('Stack.of() throws when there is no parent Stack', () => {
        const root = new constructs_1.Construct(undefined, 'Root');
        const construct = new constructs_1.Construct(root, 'Construct');
        expect(() => lib_1.Stack.of(construct)).toThrow(/should be created in the scope of a Stack, but no Stack found/);
    });
    test('Stack.of() works for substacks', () => {
        // GIVEN
        const app = new lib_1.App();
        // WHEN
        const parentStack = new lib_1.Stack(app, 'ParentStack');
        const parentResource = new lib_1.CfnResource(parentStack, 'ParentResource', { type: 'parent::resource' });
        // we will define a substack under the /resource/... just for giggles.
        const childStack = new lib_1.Stack(parentResource, 'ChildStack');
        const childResource = new lib_1.CfnResource(childStack, 'ChildResource', { type: 'child::resource' });
        // THEN
        expect(lib_1.Stack.of(parentStack)).toBe(parentStack);
        expect(lib_1.Stack.of(parentResource)).toBe(parentStack);
        expect(lib_1.Stack.of(childStack)).toBe(childStack);
        expect(lib_1.Stack.of(childResource)).toBe(childStack);
    });
    test('stack.availabilityZones falls back to Fn::GetAZ[0],[2] if region is not specified', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'MyStack');
        // WHEN
        const azs = stack.availabilityZones;
        // THEN
        expect(stack.resolve(azs)).toEqual([
            { 'Fn::Select': [0, { 'Fn::GetAZs': '' }] },
            { 'Fn::Select': [1, { 'Fn::GetAZs': '' }] },
        ]);
    });
    test('allows using the same stack name for two stacks (i.e. in different regions)', () => {
        // WHEN
        const app = new lib_1.App();
        const stack1 = new lib_1.Stack(app, 'MyStack1', { stackName: 'thestack' });
        const stack2 = new lib_1.Stack(app, 'MyStack2', { stackName: 'thestack' });
        const assembly = app.synth();
        // THEN
        expect(assembly.getStackArtifact(stack1.artifactId).templateFile).toEqual('MyStack1.template.json');
        expect(assembly.getStackArtifact(stack2.artifactId).templateFile).toEqual('MyStack2.template.json');
        expect(stack1.templateFile).toEqual('MyStack1.template.json');
        expect(stack2.templateFile).toEqual('MyStack2.template.json');
    });
    test('artifactId and templateFile use the unique id and not the stack name', () => {
        // WHEN
        const app = new lib_1.App();
        const stack1 = new lib_1.Stack(app, 'MyStack1', { stackName: 'thestack' });
        const assembly = app.synth();
        // THEN
        expect(stack1.artifactId).toEqual('MyStack1');
        expect(stack1.templateFile).toEqual('MyStack1.template.json');
        expect(assembly.getStackArtifact(stack1.artifactId).templateFile).toEqual('MyStack1.template.json');
    });
    test('use the artifact id as the template name', () => {
        // WHEN
        const app = new lib_1.App();
        const stack1 = new lib_1.Stack(app, 'MyStack1');
        const stack2 = new lib_1.Stack(app, 'MyStack2', { stackName: 'MyRealStack2' });
        // THEN
        expect(stack1.templateFile).toEqual('MyStack1.template.json');
        expect(stack2.templateFile).toEqual('MyStack2.template.json');
    });
    test('metadata is collected at the stack boundary', () => {
        // GIVEN
        const app = new lib_1.App({
            context: {
                [cxapi.DISABLE_METADATA_STACK_TRACE]: 'true',
            },
        });
        const parent = new lib_1.Stack(app, 'parent');
        const child = new lib_1.Stack(parent, 'child');
        // WHEN
        child.node.addMetadata('foo', 'bar');
        // THEN
        const asm = app.synth();
        expect(asm.getStackByName(parent.stackName).findMetadataByType('foo')).toEqual([]);
        expect(asm.getStackByName(child.stackName).findMetadataByType('foo')).toEqual([
            { path: '/parent/child', type: 'foo', data: 'bar' },
        ]);
    });
    test('stack tags are reflected in the stack cloud assembly artifact metadata', () => {
        // GIVEN
        const app = new lib_1.App({ stackTraces: false, context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack1 = new lib_1.Stack(app, 'stack1');
        const stack2 = new lib_1.Stack(stack1, 'stack2');
        // WHEN
        lib_1.Tags.of(app).add('foo', 'bar');
        // THEN
        const asm = app.synth();
        const expected = [
            {
                type: 'aws:cdk:stack-tags',
                data: [{ key: 'foo', value: 'bar' }],
            },
        ];
        expect(asm.getStackArtifact(stack1.artifactId).manifest.metadata).toEqual({ '/stack1': expected });
        expect(asm.getStackArtifact(stack2.artifactId).manifest.metadata).toEqual({ '/stack1/stack2': expected });
    });
    test('stack tags are reflected in the stack artifact properties', () => {
        // GIVEN
        const app = new lib_1.App({ stackTraces: false });
        const stack1 = new lib_1.Stack(app, 'stack1');
        const stack2 = new lib_1.Stack(stack1, 'stack2');
        // WHEN
        lib_1.Tags.of(app).add('foo', 'bar');
        // THEN
        const asm = app.synth();
        const expected = { foo: 'bar' };
        expect(asm.getStackArtifact(stack1.artifactId).tags).toEqual(expected);
        expect(asm.getStackArtifact(stack2.artifactId).tags).toEqual(expected);
    });
    test('Termination Protection is reflected in Cloud Assembly artifact', () => {
        // if the root is an app, invoke "synth" to avoid double synthesis
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'Stack', { terminationProtection: true });
        const assembly = app.synth();
        const artifact = assembly.getStackArtifact(stack.artifactId);
        expect(artifact.terminationProtection).toEqual(true);
    });
    test('context can be set on a stack using a LegacySynthesizer', () => {
        // WHEN
        const stack = new lib_1.Stack(undefined, undefined, {
            synthesizer: new lib_1.LegacyStackSynthesizer(),
        });
        stack.node.setContext('something', 'value');
        // THEN: no exception
    });
    test('context can be set on a stack using a DefaultSynthesizer', () => {
        // WHEN
        const stack = new lib_1.Stack(undefined, undefined, {
            synthesizer: new lib_1.DefaultStackSynthesizer(),
        });
        stack.node.setContext('something', 'value');
        // THEN: no exception
    });
    test('version reporting can be configured on the app', () => {
        const app = new lib_1.App({ analyticsReporting: true });
        expect(new lib_1.Stack(app, 'Stack')._versionReportingEnabled).toBeDefined();
    });
    test('version reporting can be configured with context', () => {
        const app = new lib_1.App({ context: { 'aws:cdk:version-reporting': true } });
        expect(new lib_1.Stack(app, 'Stack')._versionReportingEnabled).toBeDefined();
    });
    test('version reporting can be configured on the stack', () => {
        const app = new lib_1.App();
        expect(new lib_1.Stack(app, 'Stack', { analyticsReporting: true })._versionReportingEnabled).toBeDefined();
    });
    test('requires bundling when wildcard is specified in BUNDLING_STACKS', () => {
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'Stack');
        stack.node.setContext(cxapi.BUNDLING_STACKS, ['*']);
        expect(stack.bundlingRequired).toBe(true);
    });
    test('requires bundling when stackName has an exact match in BUNDLING_STACKS', () => {
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'Stack');
        stack.node.setContext(cxapi.BUNDLING_STACKS, ['Stack']);
        expect(stack.bundlingRequired).toBe(true);
    });
    test('does not require bundling when no item from BUILDING_STACKS matches stackName', () => {
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'Stack');
        stack.node.setContext(cxapi.BUNDLING_STACKS, ['Stac']);
        expect(stack.bundlingRequired).toBe(false);
    });
    test('does not require bundling when BUNDLING_STACKS is empty', () => {
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'Stack');
        stack.node.setContext(cxapi.BUNDLING_STACKS, []);
        expect(stack.bundlingRequired).toBe(false);
    });
});
describe('permissions boundary', () => {
    test('can specify a valid permissions boundary name', () => {
        // GIVEN
        const app = new lib_1.App();
        // WHEN
        const stack = new lib_1.Stack(app, 'Stack', {
            permissionsBoundary: lib_1.PermissionsBoundary.fromName('valid'),
        });
        // THEN
        const pbContext = stack.node.tryGetContext(lib_1.PERMISSIONS_BOUNDARY_CONTEXT_KEY);
        expect(pbContext).toEqual({
            name: 'valid',
        });
    });
    test('can specify a valid permissions boundary arn', () => {
        // GIVEN
        const app = new lib_1.App();
        // WHEN
        const stack = new lib_1.Stack(app, 'Stack', {
            permissionsBoundary: lib_1.PermissionsBoundary.fromArn('arn:aws:iam::12345678912:policy/valid'),
        });
        // THEN
        const pbContext = stack.node.tryGetContext(lib_1.PERMISSIONS_BOUNDARY_CONTEXT_KEY);
        expect(pbContext).toEqual({
            name: undefined,
            arn: 'arn:aws:iam::12345678912:policy/valid',
        });
    });
    test('single aspect is added to stack', () => {
        // GIVEN
        const app = new lib_1.App();
        // WHEN
        const stage = new lib_1.Stage(app, 'Stage', {
            permissionsBoundary: lib_1.PermissionsBoundary.fromArn('arn:aws:iam::12345678912:policy/stage'),
        });
        const stack = new lib_1.Stack(stage, 'Stack', {
            permissionsBoundary: lib_1.PermissionsBoundary.fromArn('arn:aws:iam::12345678912:policy/valid'),
        });
        // THEN
        const aspects = lib_1.Aspects.of(stack).all;
        expect(aspects.length).toEqual(1);
        const pbContext = stack.node.tryGetContext(lib_1.PERMISSIONS_BOUNDARY_CONTEXT_KEY);
        expect(pbContext).toEqual({
            name: undefined,
            arn: 'arn:aws:iam::12345678912:policy/valid',
        });
    });
    test('throws if pseudo parameters are in the name', () => {
        // GIVEN
        const app = new lib_1.App();
        // THEN
        expect(() => {
            new lib_1.Stack(app, 'Stack', {
                permissionsBoundary: lib_1.PermissionsBoundary.fromArn('arn:aws:iam::${AWS::AccountId}:policy/valid'),
            });
        }).toThrow(/The permissions boundary .* includes a pseudo parameter/);
    });
});
describe('regionalFact', () => {
    region_info_1.Fact.register({ name: 'MyFact', region: 'us-east-1', value: 'x.amazonaws.com' });
    region_info_1.Fact.register({ name: 'MyFact', region: 'eu-west-1', value: 'x.amazonaws.com' });
    region_info_1.Fact.register({ name: 'MyFact', region: 'cn-north-1', value: 'x.amazonaws.com.cn' });
    region_info_1.Fact.register({ name: 'WeirdFact', region: 'us-east-1', value: 'oneformat' });
    region_info_1.Fact.register({ name: 'WeirdFact', region: 'eu-west-1', value: 'otherformat' });
    test('regional facts return a literal value if possible', () => {
        const stack = new lib_1.Stack(undefined, 'Stack', { env: { region: 'us-east-1' } });
        expect(stack.regionalFact('MyFact')).toEqual('x.amazonaws.com');
    });
    test('regional facts are simplified to use URL_SUFFIX token if possible', () => {
        const stack = new lib_1.Stack();
        expect(stack.regionalFact('MyFact')).toEqual(`x.${lib_1.Aws.URL_SUFFIX}`);
    });
    test('regional facts are simplified to use concrete values if URL_SUFFIX token is not necessary', () => {
        const stack = new lib_1.Stack();
        constructs_1.Node.of(stack).setContext(cxapi.TARGET_PARTITIONS, ['aws']);
        expect(stack.regionalFact('MyFact')).toEqual('x.amazonaws.com');
    });
    test('regional facts use the global lookup map if partition is the literal string of "undefined"', () => {
        const stack = new lib_1.Stack();
        constructs_1.Node.of(stack).setContext(cxapi.TARGET_PARTITIONS, 'undefined');
        new lib_1.CfnOutput(stack, 'TheFact', {
            value: stack.regionalFact('WeirdFact'),
        });
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Mappings: {
                WeirdFactMap: {
                    'eu-west-1': { value: 'otherformat' },
                    'us-east-1': { value: 'oneformat' },
                },
            },
            Outputs: {
                TheFact: {
                    Value: {
                        'Fn::FindInMap': ['WeirdFactMap', { Ref: 'AWS::Region' }, 'value'],
                    },
                },
            },
        });
    });
    test('regional facts generate a mapping if necessary', () => {
        const stack = new lib_1.Stack();
        new lib_1.CfnOutput(stack, 'TheFact', {
            value: stack.regionalFact('WeirdFact'),
        });
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Mappings: {
                WeirdFactMap: {
                    'eu-west-1': { value: 'otherformat' },
                    'us-east-1': { value: 'oneformat' },
                },
            },
            Outputs: {
                TheFact: {
                    Value: {
                        'Fn::FindInMap': [
                            'WeirdFactMap',
                            { Ref: 'AWS::Region' },
                            'value',
                        ],
                    },
                },
            },
        });
    });
    test('stack.addMetadata() adds metadata', () => {
        const stack = new lib_1.Stack();
        stack.addMetadata('Instances', { Description: 'Information about the instances' });
        stack.addMetadata('Databases', { Description: 'Information about the databases' });
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Metadata: {
                Instances: { Description: 'Information about the instances' },
                Databases: { Description: 'Information about the databases' },
            },
        });
    });
});
class StackWithPostProcessor extends lib_1.Stack {
    // ...
    _toCloudFormation() {
        const template = super._toCloudFormation();
        // manipulate template (e.g. rename "Key" to "key")
        template.Resources.myResource.Properties.Environment.key =
            template.Resources.myResource.Properties.Environment.Key;
        delete template.Resources.myResource.Properties.Environment.Key;
        return template;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2sudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0YWNrLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw4REFBMEQ7QUFDMUQseUNBQXlDO0FBQ3pDLHNEQUF3RDtBQUN4RCwyQ0FBNkM7QUFDN0MsaUNBQTBDO0FBQzFDLGdDQVVnQjtBQUNoQix3REFBcUQ7QUFDckQsOENBQXdEO0FBQ3hELHNDQUErQztBQUUvQyxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtJQUNyQixJQUFJLENBQUMsaUZBQWlGLEVBQUUsR0FBRyxFQUFFO1FBQzNGLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxFQUFFLENBQUM7UUFDMUIsTUFBTSxDQUFDLElBQUEsdUJBQWdCLEVBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRyxDQUFDLENBQUM7SUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMseUNBQXlDLEVBQUUsR0FBRyxFQUFFO1FBQ25ELFFBQVE7UUFDUixNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN4QixNQUFNLG1CQUFtQixHQUFHLG1KQUFtSixDQUFDO1FBRWhMLE9BQU87UUFDUCxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1YsSUFBSSxXQUFLLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRTtnQkFDeEIsU0FBUyxFQUFFLG1CQUFtQjthQUMvQixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsc0RBQXNELG1CQUFtQixHQUFHLENBQUMsQ0FBQztJQUMzRixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywyRkFBMkYsRUFBRSxHQUFHLEVBQUU7UUFDckcsTUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFLLEVBQUUsQ0FBQztRQUMxQixLQUFLLENBQUMsZUFBZSxDQUFDLHFCQUFxQixHQUFHLG1CQUFtQixDQUFDO1FBQ2xFLEtB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O1FBQzNELE9BQU8sUUFBUSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUM7UUFFaEUsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdGVzdERlcHJlY2F0ZWQgfSBmcm9tICdAYXdzLWNkay9jZGstYnVpbGQtdG9vbHMnO1xuaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IEZhY3QsIFJlZ2lvbkluZm8gfSBmcm9tICdAYXdzLWNkay9yZWdpb24taW5mbyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QsIE5vZGUgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IHRvQ2xvdWRGb3JtYXRpb24gfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHtcbiAgQXBwLCBDZm5Db25kaXRpb24sIENmbkluY2x1ZGUsIENmbk91dHB1dCwgQ2ZuUGFyYW1ldGVyLFxuICBDZm5SZXNvdXJjZSwgTGF6eSwgU2NvcGVkQXdzLCBTdGFjaywgdmFsaWRhdGVTdHJpbmcsXG4gIFRhZ3MsIExlZ2FjeVN0YWNrU3ludGhlc2l6ZXIsIERlZmF1bHRTdGFja1N5bnRoZXNpemVyLFxuICBOZXN0ZWRTdGFjayxcbiAgQXdzLCBGbiwgUmVzb2x1dGlvblR5cGVIaW50LFxuICBQZXJtaXNzaW9uc0JvdW5kYXJ5LFxuICBQRVJNSVNTSU9OU19CT1VOREFSWV9DT05URVhUX0tFWSxcbiAgQXNwZWN0cyxcbiAgU3RhZ2UsXG59IGZyb20gJy4uL2xpYic7XG5pbXBvcnQgeyBJbnRyaW5zaWMgfSBmcm9tICcuLi9saWIvcHJpdmF0ZS9pbnRyaW5zaWMnO1xuaW1wb3J0IHsgcmVzb2x2ZVJlZmVyZW5jZXMgfSBmcm9tICcuLi9saWIvcHJpdmF0ZS9yZWZzJztcbmltcG9ydCB7IFBvc3RSZXNvbHZlVG9rZW4gfSBmcm9tICcuLi9saWIvdXRpbCc7XG5cbmRlc2NyaWJlKCdzdGFjaycsICgpID0+IHtcbiAgdGVzdCgnYSBzdGFjayBjYW4gYmUgc2VyaWFsaXplZCBpbnRvIGEgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUsIGluaXRpYWxseSBpdFxcJ3MgZW1wdHknLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoeyB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnc3RhY2sgbmFtZSBjYW5ub3QgZXhjZWVkIDEyOCBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7fSk7XG4gICAgY29uc3QgcmVhbGx5TG9uZ1N0YWNrTmFtZSA9ICdMb29rQXRNeVJlYWxseUxvbmdTdGFja05hbWVUaGlzU3RhY2tOYW1lSXNMb25nZXJUaGFuMTI4Q2hhcmFjdGVyc1RoYXRJc051dHNJRG9udFRoaW5rVGhlcmVJc0Vub3VnaEFXU0F2YWlsYWJsZVRvTGV0RXZlcnlvbmVIYXZlU3RhY2tOYW1lc1RoaXNMb25nJztcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IFN0YWNrKGFwcCwgJ015U3RhY2snLCB7XG4gICAgICAgIHN0YWNrTmFtZTogcmVhbGx5TG9uZ1N0YWNrTmFtZSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coYFN0YWNrIG5hbWUgbXVzdCBiZSA8PSAxMjggY2hhcmFjdGVycy4gU3RhY2sgbmFtZTogJyR7cmVhbGx5TG9uZ1N0YWNrTmFtZX0nYCk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N0YWNrIG9iamVjdHMgaGF2ZSBzb21lIHRlbXBsYXRlLWxldmVsIHByb3BldGllcywgc3VjaCBhcyBEZXNjcmlwdGlvbiwgVmVyc2lvbiwgVHJhbnNmb3JtJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgc3RhY2sudGVtcGxhdGVPcHRpb25zLnRlbXBsYXRlRm9ybWF0VmVyc2lvbiA9ICdNeVRlbXBsYXRlVmVyc2lvbic7XG4gICAgc3RhY2sudGVtcGxhdGVPcHRpb25zLmRlc2NyaXB0aW9uID0gJ1RoaXMgaXMgbXkgZGVzY3JpcHRpb24nO1xuICAgIHN0YWNrLnRlbXBsYXRlT3B0aW9ucy50cmFuc2Zvcm1zID0gWydTQU15J107XG4gICAgZXhwZWN0KHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spKS50b0VxdWFsKHtcbiAgICAgIERlc2NyaXB0aW9uOiAnVGhpcyBpcyBteSBkZXNjcmlwdGlvbicsXG4gICAgICBBV1NUZW1wbGF0ZUZvcm1hdFZlcnNpb246ICdNeVRlbXBsYXRlVmVyc2lvbicsXG4gICAgICBUcmFuc2Zvcm06ICdTQU15JyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnU3RhY2suaXNTdGFjayBpbmRpY2F0ZXMgdGhhdCBhIGNvbnN0cnVjdCBpcyBhIHN0YWNrJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgYyA9IG5ldyBDb25zdHJ1Y3Qoc3RhY2ssICdDb25zdHJ1Y3QnKTtcbiAgICBleHBlY3QoU3RhY2suaXNTdGFjayhzdGFjaykpLnRvQmVEZWZpbmVkKCk7XG4gICAgZXhwZWN0KCFTdGFjay5pc1N0YWNrKGMpKS50b0JlRGVmaW5lZCgpO1xuICB9KTtcblxuICB0ZXN0KCdzdGFjay5pZCBpcyBub3QgaW5jbHVkZWQgaW4gdGhlIGxvZ2ljYWwgaWRlbnRpdGllcyBvZiByZXNvdXJjZXMgd2l0aGluIGl0JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgJ015U3RhY2snKTtcbiAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdNeVJlc291cmNlJywgeyB0eXBlOiAnTXlSZXNvdXJjZVR5cGUnIH0pO1xuXG4gICAgZXhwZWN0KHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spKS50b0VxdWFsKHsgUmVzb3VyY2VzOiB7IE15UmVzb3VyY2U6IHsgVHlwZTogJ015UmVzb3VyY2VUeXBlJyB9IH0gfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3doZW4gc3RhY2tSZXNvdXJjZUxpbWl0IGlzIGRlZmF1bHQsIHNob3VsZCBnaXZlIGVycm9yJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7fSk7XG5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdNeVN0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IDEwMDA7IGluZGV4KyspIHtcbiAgICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjaywgYE15UmVzb3VyY2UtJHtpbmRleH1gLCB7IHR5cGU6ICdNeVJlc291cmNlVHlwZScgfSk7XG4gICAgfVxuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGFwcC5zeW50aCgpO1xuICAgIH0pLnRvVGhyb3coJ051bWJlciBvZiByZXNvdXJjZXMgaW4gc3RhY2sgXFwnTXlTdGFja1xcJzogMTAwMCBpcyBncmVhdGVyIHRoYW4gYWxsb3dlZCBtYXhpbXVtIG9mIDUwMCcpO1xuICB9KTtcblxuICB0ZXN0KCd3aGVuIHN0YWNrUmVzb3VyY2VMaW1pdCBpcyBkZWZpbmVkLCBzaG91bGQgZ2l2ZSB0aGUgcHJvcGVyIGVycm9yJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7XG4gICAgICBjb250ZXh0OiB7XG4gICAgICAgICdAYXdzLWNkay9jb3JlOnN0YWNrUmVzb3VyY2VMaW1pdCc6IDEwMCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdNeVN0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IDIwMDsgaW5kZXgrKykge1xuICAgICAgbmV3IENmblJlc291cmNlKHN0YWNrLCBgTXlSZXNvdXJjZS0ke2luZGV4fWAsIHsgdHlwZTogJ015UmVzb3VyY2VUeXBlJyB9KTtcbiAgICB9XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgYXBwLnN5bnRoKCk7XG4gICAgfSkudG9UaHJvdygnTnVtYmVyIG9mIHJlc291cmNlcyBpbiBzdGFjayBcXCdNeVN0YWNrXFwnOiAyMDAgaXMgZ3JlYXRlciB0aGFuIGFsbG93ZWQgbWF4aW11bSBvZiAxMDAnKTtcbiAgfSk7XG5cbiAgdGVzdCgnd2hlbiBzdGFja1Jlc291cmNlTGltaXQgaXMgMCwgc2hvdWxkIG5vdCBnaXZlIGVycm9yJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7XG4gICAgICBjb250ZXh0OiB7XG4gICAgICAgICdAYXdzLWNkay9jb3JlOnN0YWNrUmVzb3VyY2VMaW1pdCc6IDAsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnTXlTdGFjaycpO1xuXG4gICAgLy8gV0hFTlxuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCAxMDAwOyBpbmRleCsrKSB7XG4gICAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssIGBNeVJlc291cmNlLSR7aW5kZXh9YCwgeyB0eXBlOiAnTXlSZXNvdXJjZVR5cGUnIH0pO1xuICAgIH1cblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBhcHAuc3ludGgoKTtcbiAgICB9KS5ub3QudG9UaHJvdygpO1xuICB9KTtcblxuICB0ZXN0KCdzdGFjay50ZW1wbGF0ZU9wdGlvbnMgY2FuIGJlIHVzZWQgdG8gc2V0IHRlbXBsYXRlLWxldmVsIG9wdGlvbnMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIHN0YWNrLnRlbXBsYXRlT3B0aW9ucy5kZXNjcmlwdGlvbiA9ICdTdGFja0Rlc2NyaXB0aW9uJztcbiAgICBzdGFjay50ZW1wbGF0ZU9wdGlvbnMudGVtcGxhdGVGb3JtYXRWZXJzaW9uID0gJ1RlbXBsYXRlVmVyc2lvbic7XG4gICAgc3RhY2sudGVtcGxhdGVPcHRpb25zLnRyYW5zZm9ybSA9ICdEZXByZWNhdGVkRmllbGQnO1xuICAgIHN0YWNrLnRlbXBsYXRlT3B0aW9ucy50cmFuc2Zvcm1zID0gWydUcmFuc2Zvcm0nXTtcbiAgICBzdGFjay50ZW1wbGF0ZU9wdGlvbnMubWV0YWRhdGEgPSB7XG4gICAgICBNZXRhZGF0YUtleTogJ01ldGFkYXRhVmFsdWUnLFxuICAgIH07XG5cbiAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgRGVzY3JpcHRpb246ICdTdGFja0Rlc2NyaXB0aW9uJyxcbiAgICAgIFRyYW5zZm9ybTogWydUcmFuc2Zvcm0nLCAnRGVwcmVjYXRlZEZpZWxkJ10sXG4gICAgICBBV1NUZW1wbGF0ZUZvcm1hdFZlcnNpb246ICdUZW1wbGF0ZVZlcnNpb24nLFxuICAgICAgTWV0YWRhdGE6IHsgTWV0YWRhdGFLZXk6ICdNZXRhZGF0YVZhbHVlJyB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzdGFjay50ZW1wbGF0ZU9wdGlvbnMudHJhbnNmb3JtcyByZW1vdmVzIGR1cGxpY2F0ZSB2YWx1ZXMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIHN0YWNrLnRlbXBsYXRlT3B0aW9ucy50cmFuc2Zvcm1zID0gWydBJywgJ0InLCAnQycsICdBJ107XG5cbiAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgVHJhbnNmb3JtOiBbJ0EnLCAnQicsICdDJ10sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N0YWNrLmFkZFRyYW5zZm9ybSgpIGFkZHMgYSB0cmFuc2Zvcm0nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIHN0YWNrLmFkZFRyYW5zZm9ybSgnQScpO1xuICAgIHN0YWNrLmFkZFRyYW5zZm9ybSgnQicpO1xuICAgIHN0YWNrLmFkZFRyYW5zZm9ybSgnQycpO1xuXG4gICAgZXhwZWN0KHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spKS50b0VxdWFsKHtcbiAgICAgIFRyYW5zZm9ybTogWydBJywgJ0InLCAnQyddLFxuICAgIH0pO1xuICB9KTtcblxuICAvLyBUaGlzIGFwcHJvYWNoIHdpbGwgb25seSBhcHBseSB0byBUeXBlU2NyaXB0IGNvZGUsIGJ1dCBhdCBsZWFzdCBpdCdzIGEgdGVtcG9yYXJ5XG4gIC8vIHdvcmthcm91bmQgZm9yIHBlb3BsZSBydW5uaW5nIGludG8gaXNzdWVzIGNhdXNlZCBieSBTREstMzAwMy5cbiAgLy8gV2Ugc2hvdWxkIGNvbWUgdXAgd2l0aCBhIHByb3BlciBzb2x1dGlvbiB0aGF0IGludm9sdmVkIGpzaWkgY2FsbGJhY2tzICh3aGVuIHRoZXkgZXhpc3QpXG4gIC8vIHNvIHRoaXMgY2FuIGJlIGltcGxlbWVudGVkIGJ5IGpzaWkgbGFuZ3VhZ2VzIGFzIHdlbGwuXG4gIHRlc3QoJ092ZXJyaWRpbmcgYFN0YWNrLl90b0Nsb3VkRm9ybWF0aW9uYCBhbGxvd3MgYXJiaXRyYXJ5IHBvc3QtcHJvY2Vzc2luZyBvZiB0aGUgZ2VuZXJhdGVkIHRlbXBsYXRlIGR1cmluZyBzeW50aGVzaXMnLCAoKSA9PiB7XG5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFja1dpdGhQb3N0UHJvY2Vzc29yKCk7XG5cbiAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdteVJlc291cmNlJywge1xuICAgICAgdHlwZTogJ0FXUzo6TXlSZXNvdXJjZScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIE15UHJvcDE6ICdoZWxsbycsXG4gICAgICAgIE15UHJvcDI6ICdob3dkeScsXG4gICAgICAgIEVudmlyb25tZW50OiB7XG4gICAgICAgICAgS2V5OiAndmFsdWUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGV4cGVjdChzdGFjay5fdG9DbG91ZEZvcm1hdGlvbigpKS50b0VxdWFsKHtcbiAgICAgIFJlc291cmNlczpcbiAgICAgIHtcbiAgICAgICAgbXlSZXNvdXJjZTpcbiAgICAgICAgIHtcbiAgICAgICAgICAgVHlwZTogJ0FXUzo6TXlSZXNvdXJjZScsXG4gICAgICAgICAgIFByb3BlcnRpZXM6XG4gICAgICAgICAge1xuICAgICAgICAgICAgTXlQcm9wMTogJ2hlbGxvJyxcbiAgICAgICAgICAgIE15UHJvcDI6ICdob3dkeScsXG4gICAgICAgICAgICBFbnZpcm9ubWVudDogeyBrZXk6ICd2YWx1ZScgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ1N0YWNrLmdldEJ5UGF0aCBjYW4gYmUgdXNlZCB0byBmaW5kIGFueSBDbG91ZEZvcm1hdGlvbiBlbGVtZW50IChQYXJhbWV0ZXIsIE91dHB1dCwgZXRjKScsICgpID0+IHtcblxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCBwID0gbmV3IENmblBhcmFtZXRlcihzdGFjaywgJ015UGFyYW0nLCB7IHR5cGU6ICdTdHJpbmcnIH0pO1xuICAgIGNvbnN0IG8gPSBuZXcgQ2ZuT3V0cHV0KHN0YWNrLCAnTXlPdXRwdXQnLCB7IHZhbHVlOiAnYm9vbScgfSk7XG4gICAgY29uc3QgYyA9IG5ldyBDZm5Db25kaXRpb24oc3RhY2ssICdNeUNvbmRpdGlvbicpO1xuXG4gICAgZXhwZWN0KHN0YWNrLm5vZGUuZmluZENoaWxkKHAubm9kZS5pZCkpLnRvRXF1YWwocCk7XG4gICAgZXhwZWN0KHN0YWNrLm5vZGUuZmluZENoaWxkKG8ubm9kZS5pZCkpLnRvRXF1YWwobyk7XG4gICAgZXhwZWN0KHN0YWNrLm5vZGUuZmluZENoaWxkKGMubm9kZS5pZCkpLnRvRXF1YWwoYyk7XG4gIH0pO1xuXG4gIHRlc3QoJ1N0YWNrIG5hbWVzIGNhbiBoYXZlIGh5cGhlbnMgaW4gdGhlbScsICgpID0+IHtcbiAgICBjb25zdCByb290ID0gbmV3IEFwcCgpO1xuXG4gICAgbmV3IFN0YWNrKHJvb3QsICdIZWxsby1Xb3JsZCcpO1xuICAgIC8vIERpZCBub3QgdGhyb3dcbiAgfSk7XG5cbiAgdGVzdCgnU3RhY2tzIGNhbiBoYXZlIGEgZGVzY3JpcHRpb24gZ2l2ZW4gdG8gdGhlbScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhuZXcgQXBwKCksICdNeVN0YWNrJywgeyBkZXNjcmlwdGlvbjogJ015IHN0YWNrLCBoYW5kcyBvZmYhJyB9KTtcbiAgICBjb25zdCBvdXRwdXQgPSB0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKTtcbiAgICBleHBlY3Qob3V0cHV0LkRlc2NyaXB0aW9uKS50b0VxdWFsKCdNeSBzdGFjaywgaGFuZHMgb2ZmIScpO1xuICB9KTtcblxuICB0ZXN0KCdTdGFjayBkZXNjcmlwdGlvbnMgaGF2ZSBhIGxpbWl0ZWQgbGVuZ3RoJywgKCkgPT4ge1xuICAgIGNvbnN0IGRlc2MgPSBgTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdCwgc2VkIGRvIGVpdXNtb2QgdGVtcG9yXG4gICAgIGluY2lkaWR1bnQgdXQgbGFib3JlIGV0IGRvbG9yZSBtYWduYSBhbGlxdWEuIENvbnNlcXVhdCBpbnRlcmR1bSB2YXJpdXMgc2l0IGFtZXQgbWF0dGlzIHZ1bHB1dGF0ZVxuICAgICBlbmltIG51bGxhIGFsaXF1ZXQuIEF0IGltcGVyZGlldCBkdWkgYWNjdW1zYW4gc2l0IGFtZXQgbnVsbGEgZmFjaWxpc2kgbW9yYmkuIEVnZXQgbG9yZW0gZG9sb3Igc2VkXG4gICAgIHZpdmVycmEgaXBzdW0uIERpYW0gdm9sdXRwYXQgY29tbW9kbyBzZWQgZWdlc3RhcyBlZ2VzdGFzLiBTaXQgYW1ldCBwb3J0dGl0b3IgZWdldCBkb2xvciBtb3JiaSBub24uXG4gICAgIExvcmVtIGRvbG9yIHNlZCB2aXZlcnJhIGlwc3VtLiBJZCBwb3J0YSBuaWJoIHZlbmVuYXRpcyBjcmFzIHNlZCBmZWxpcy4gQXVndWUgaW50ZXJkdW0gdmVsaXQgZXVpc21vZFxuICAgICBpbiBwZWxsZW50ZXNxdWUuIFN1c2NpcGl0IGFkaXBpc2NpbmcgYmliZW5kdW0gZXN0IHVsdHJpY2llcyBpbnRlZ2VyIHF1aXMuIENvbmRpbWVudHVtIGlkIHZlbmVuYXRpcyBhXG4gICAgIGNvbmRpbWVudHVtIHZpdGFlIHNhcGllbiBwZWxsZW50ZXNxdWUgaGFiaXRhbnQgbW9yYmkuIENvbmd1ZSBtYXVyaXMgcmhvbmN1cyBhZW5lYW4gdmVsIGVsaXQgc2NlbGVyaXNxdWVcbiAgICAgbWF1cmlzIHBlbGxlbnRlc3F1ZSBwdWx2aW5hci5cbiAgICAgRmF1Y2lidXMgcHVydXMgaW4gbWFzc2EgdGVtcG9yIG5lYy4gUmlzdXMgdml2ZXJyYSBhZGlwaXNjaW5nIGF0IGluLiBJbnRlZ2VyIGZldWdpYXQgc2NlbGVyaXNxdWUgdmFyaXVzXG4gICAgIG1vcmJpLiBNYWxlc3VhZGEgbnVuYyB2ZWwgcmlzdXMgY29tbW9kbyB2aXZlcnJhIG1hZWNlbmFzIGFjY3Vtc2FuIGxhY3VzLiBWdWxwdXRhdGUgc2FwaWVuIG5lYyBzYWdpdHRpc1xuICAgICBhbGlxdWFtIG1hbGVzdWFkYSBiaWJlbmR1bSBhcmN1IHZpdGFlLiBBdWd1ZSBuZXF1ZSBncmF2aWRhIGluIGZlcm1lbnR1bSBldCBzb2xsaWNpdHVkaW4gYWMgb3JjaSBwaGFzZWxsdXMuXG4gICAgIFVsdHJpY2VzIHRpbmNpZHVudCBhcmN1IG5vbiBzb2RhbGVzIG5lcXVlIHNvZGFsZXMuYDtcbiAgICBleHBlY3QoKCkgPT4gbmV3IFN0YWNrKG5ldyBBcHAoKSwgJ015U3RhY2snLCB7IGRlc2NyaXB0aW9uOiBkZXNjIH0pKTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ0luY2x1ZGUgc2hvdWxkIHN1cHBvcnQgbm9uLWhhc2ggdG9wLWxldmVsIHRlbXBsYXRlIGVsZW1lbnRzIGxpa2UgXCJEZXNjcmlwdGlvblwiJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IHtcbiAgICAgIERlc2NyaXB0aW9uOiAnaGVsbG8sIHdvcmxkJyxcbiAgICB9O1xuXG4gICAgbmV3IENmbkluY2x1ZGUoc3RhY2ssICdJbmNsdWRlJywgeyB0ZW1wbGF0ZSB9KTtcblxuICAgIGNvbnN0IG91dHB1dCA9IHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spO1xuXG4gICAgZXhwZWN0KHR5cGVvZiBvdXRwdXQuRGVzY3JpcHRpb24pLnRvRXF1YWwoJ3N0cmluZycpO1xuICB9KTtcblxuICB0ZXN0KCdQc2V1ZG8gdmFsdWVzIGF0dGFjaGVkIHRvIG9uZSBzdGFjayBjYW4gYmUgcmVmZXJlbmNlZCBpbiBhbm90aGVyIHN0YWNrJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7IGNvbnRleHQ6IHsgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlIH0gfSk7XG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMScpO1xuICAgIGNvbnN0IGFjY291bnQxID0gbmV3IFNjb3BlZEF3cyhzdGFjazEpLmFjY291bnRJZDtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJyk7XG5cbiAgICAvLyBXSEVOIC0gdXNlZCBpbiBhbm90aGVyIHN0YWNrXG4gICAgbmV3IENmblBhcmFtZXRlcihzdGFjazIsICdTb21lUGFyYW1ldGVyJywgeyB0eXBlOiAnU3RyaW5nJywgZGVmYXVsdDogYWNjb3VudDEgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCB0ZW1wbGF0ZTEgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjazEuc3RhY2tOYW1lKS50ZW1wbGF0ZTtcbiAgICBjb25zdCB0ZW1wbGF0ZTIgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjazIuc3RhY2tOYW1lKS50ZW1wbGF0ZTtcblxuICAgIGV4cGVjdCh0ZW1wbGF0ZTEpLnRvRXF1YWwoe1xuICAgICAgT3V0cHV0czoge1xuICAgICAgICBFeHBvcnRzT3V0cHV0UmVmQVdTQWNjb3VudElkQUQ1NjgwNTc6IHtcbiAgICAgICAgICBWYWx1ZTogeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgICBFeHBvcnQ6IHsgTmFtZTogJ1N0YWNrMTpFeHBvcnRzT3V0cHV0UmVmQVdTQWNjb3VudElkQUQ1NjgwNTcnIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHRlbXBsYXRlMikudG9FcXVhbCh7XG4gICAgICBQYXJhbWV0ZXJzOiB7XG4gICAgICAgIFNvbWVQYXJhbWV0ZXI6IHtcbiAgICAgICAgICBUeXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBEZWZhdWx0OiB7ICdGbjo6SW1wb3J0VmFsdWUnOiAnU3RhY2sxOkV4cG9ydHNPdXRwdXRSZWZBV1NBY2NvdW50SWRBRDU2ODA1NycgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0Nyb3NzLXN0YWNrIHJlZmVyZW5jZXMgYXJlIGRldGVjdGVkIGluIHJlc291cmNlIHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMScpO1xuICAgIGNvbnN0IHJlc291cmNlMSA9IG5ldyBDZm5SZXNvdXJjZShzdGFjazEsICdSZXNvdXJjZScsIHsgdHlwZTogJ0JMQScgfSk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMicpO1xuXG4gICAgLy8gV0hFTiAtIHVzZWQgaW4gYW5vdGhlciByZXNvdXJjZVxuICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjazIsICdTb21lUmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnQVdTOjpTb21lOjpSZXNvdXJjZScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHNvbWVQcm9wZXJ0eTogbmV3IEludHJpbnNpYyhyZXNvdXJjZTEucmVmKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCB0ZW1wbGF0ZTIgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjazIuc3RhY2tOYW1lKS50ZW1wbGF0ZTtcblxuICAgIGV4cGVjdCh0ZW1wbGF0ZTI/LlJlc291cmNlcykudG9FcXVhbCh7XG4gICAgICBTb21lUmVzb3VyY2U6IHtcbiAgICAgICAgVHlwZTogJ0FXUzo6U29tZTo6UmVzb3VyY2UnLFxuICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgc29tZVByb3BlcnR5OiB7ICdGbjo6SW1wb3J0VmFsdWUnOiAnU3RhY2sxOkV4cG9ydHNPdXRwdXRSZWZSZXNvdXJjZTFENUQ5MDVBJyB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQ3Jvc3Mtc3RhY2sgZXhwb3J0IG5hbWVzIGFjY291bnQgZm9yIHN0YWNrIG5hbWUgbGVuZ3RocycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2sxJywge1xuICAgICAgc3RhY2tOYW1lOiAnU29UaGlzQ291bGRQb3RlbnRpYWxseUJlQVZlcnlMb25nU3RhY2tOYW1lJyxcbiAgICB9KTtcbiAgICBsZXQgc2NvcGU6IENvbnN0cnVjdCA9IHN0YWNrMTtcblxuICAgIC8vIFdIRU4gLSBkZWVwbHkgbmVzdGVkXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1MDsgaSsrKSB7XG4gICAgICBzY29wZSA9IG5ldyBDb25zdHJ1Y3Qoc2NvcGUsIGBDaGlsZENvbnN0cnVjdCR7aX1gKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNvdXJjZTEgPSBuZXcgQ2ZuUmVzb3VyY2Uoc2NvcGUsICdSZXNvdXJjZScsIHsgdHlwZTogJ0JMQScgfSk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMicpO1xuXG4gICAgLy8gV0hFTiAtIHVzZWQgaW4gYW5vdGhlciByZXNvdXJjZVxuICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjazIsICdTb21lUmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnQVdTOjpTb21lOjpSZXNvdXJjZScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHNvbWVQcm9wZXJ0eTogbmV3IEludHJpbnNpYyhyZXNvdXJjZTEucmVmKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCB0ZW1wbGF0ZTEgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjazEuc3RhY2tOYW1lKS50ZW1wbGF0ZTtcblxuICAgIGNvbnN0IHRoZU91dHB1dCA9IHRlbXBsYXRlMS5PdXRwdXRzW09iamVjdC5rZXlzKHRlbXBsYXRlMS5PdXRwdXRzKVswXV07XG4gICAgZXhwZWN0KHRoZU91dHB1dC5FeHBvcnQuTmFtZS5sZW5ndGgpLnRvRXF1YWwoMjU1KTtcbiAgfSk7XG5cbiAgdGVzdCgnQ3Jvc3Mtc3RhY2sgcmVmZXJlbmNlIGV4cG9ydCBuYW1lcyBhcmUgcmVsYXRpdmUgdG8gdGhlIHN0YWNrICh3aGVuIHRoZSBmbGFnIGlzIHNldCknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgJ0Bhd3MtY2RrL2NvcmU6c3RhY2tSZWxhdGl2ZUV4cG9ydHMnOiAndHJ1ZScsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnN0IGluZGlmZmVyZW50U2NvcGUgPSBuZXcgQ29uc3RydWN0KGFwcCwgJ0V4dHJhU2NvcGUnKTtcblxuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhpbmRpZmZlcmVudFNjb3BlLCAnU3RhY2sxJywge1xuICAgICAgc3RhY2tOYW1lOiAnU3RhY2sxJyxcbiAgICB9KTtcbiAgICBjb25zdCByZXNvdXJjZTEgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2sxLCAnUmVzb3VyY2UnLCB7IHR5cGU6ICdCTEEnIH0pO1xuICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhpbmRpZmZlcmVudFNjb3BlLCAnU3RhY2syJyk7XG5cbiAgICAvLyBXSEVOIC0gdXNlZCBpbiBhbm90aGVyIHJlc291cmNlXG4gICAgbmV3IENmblJlc291cmNlKHN0YWNrMiwgJ1NvbWVSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdBV1M6OlNvbWU6OlJlc291cmNlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgc29tZVByb3BlcnR5OiBuZXcgSW50cmluc2ljKHJlc291cmNlMS5yZWYpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgIGNvbnN0IHRlbXBsYXRlMiA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrMi5zdGFja05hbWUpLnRlbXBsYXRlO1xuXG4gICAgZXhwZWN0KHRlbXBsYXRlMj8uUmVzb3VyY2VzKS50b0VxdWFsKHtcbiAgICAgIFNvbWVSZXNvdXJjZToge1xuICAgICAgICBUeXBlOiAnQVdTOjpTb21lOjpSZXNvdXJjZScsXG4gICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICBzb21lUHJvcGVydHk6IHsgJ0ZuOjpJbXBvcnRWYWx1ZSc6ICdTdGFjazE6RXhwb3J0c091dHB1dFJlZlJlc291cmNlMUQ1RDkwNUEnIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcm9zcy1zdGFjayByZWZlcmVuY2VzIGluIGxhenkgdG9rZW5zIHdvcmsnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHsgY29udGV4dDogeyBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UgfSB9KTtcbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2sxJyk7XG4gICAgY29uc3QgYWNjb3VudDEgPSBuZXcgU2NvcGVkQXdzKHN0YWNrMSkuYWNjb3VudElkO1xuICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhhcHAsICdTdGFjazInKTtcblxuICAgIC8vIFdIRU4gLSB1c2VkIGluIGFub3RoZXIgc3RhY2tcbiAgICBuZXcgQ2ZuUGFyYW1ldGVyKHN0YWNrMiwgJ1NvbWVQYXJhbWV0ZXInLCB7IHR5cGU6ICdTdHJpbmcnLCBkZWZhdWx0OiBMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+IGFjY291bnQxIH0pIH0pO1xuXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCB0ZW1wbGF0ZTEgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjazEuc3RhY2tOYW1lKS50ZW1wbGF0ZTtcbiAgICBjb25zdCB0ZW1wbGF0ZTIgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjazIuc3RhY2tOYW1lKS50ZW1wbGF0ZTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodGVtcGxhdGUxKS50b0VxdWFsKHtcbiAgICAgIE91dHB1dHM6IHtcbiAgICAgICAgRXhwb3J0c091dHB1dFJlZkFXU0FjY291bnRJZEFENTY4MDU3OiB7XG4gICAgICAgICAgVmFsdWU6IHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sXG4gICAgICAgICAgRXhwb3J0OiB7IE5hbWU6ICdTdGFjazE6RXhwb3J0c091dHB1dFJlZkFXU0FjY291bnRJZEFENTY4MDU3JyB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGV4cGVjdCh0ZW1wbGF0ZTIpLnRvRXF1YWwoe1xuICAgICAgUGFyYW1ldGVyczoge1xuICAgICAgICBTb21lUGFyYW1ldGVyOiB7XG4gICAgICAgICAgVHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgRGVmYXVsdDogeyAnRm46OkltcG9ydFZhbHVlJzogJ1N0YWNrMTpFeHBvcnRzT3V0cHV0UmVmQVdTQWNjb3VudElkQUQ1NjgwNTcnIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdDcm9zcy1zdGFjayB1c2Ugb2YgUmVnaW9uIGFuZCBhY2NvdW50IHJldHVybnMgbm9uc2NvcGVkIGludHJpbnNpYyBiZWNhdXNlIHRoZSB0d28gc3RhY2tzIG11c3QgYmUgaW4gdGhlIHNhbWUgcmVnaW9uIGFueXdheScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2sxJyk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMicpO1xuXG4gICAgLy8gV0hFTiAtIHVzZWQgaW4gYW5vdGhlciBzdGFja1xuICAgIG5ldyBDZm5PdXRwdXQoc3RhY2syLCAnRGVtT3V0cHV0JywgeyB2YWx1ZTogc3RhY2sxLnJlZ2lvbiB9KTtcbiAgICBuZXcgQ2ZuT3V0cHV0KHN0YWNrMiwgJ0RlbUFjY291bnQnLCB7IHZhbHVlOiBzdGFjazEuYWNjb3VudCB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgIGNvbnN0IHRlbXBsYXRlMiA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrMi5zdGFja05hbWUpLnRlbXBsYXRlO1xuXG4gICAgZXhwZWN0KHRlbXBsYXRlMj8uT3V0cHV0cykudG9FcXVhbCh7XG4gICAgICBEZW1PdXRwdXQ6IHtcbiAgICAgICAgVmFsdWU6IHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICB9LFxuICAgICAgRGVtQWNjb3VudDoge1xuICAgICAgICBWYWx1ZTogeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Nyb3NzLXN0YWNrIHJlZmVyZW5jZXMgaW4gc3RyaW5ncyB3b3JrJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7IGNvbnRleHQ6IHsgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlIH0gfSk7XG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMScpO1xuICAgIGNvbnN0IGFjY291bnQxID0gbmV3IFNjb3BlZEF3cyhzdGFjazEpLmFjY291bnRJZDtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJyk7XG5cbiAgICAvLyBXSEVOIC0gdXNlZCBpbiBhbm90aGVyIHN0YWNrXG4gICAgbmV3IENmblBhcmFtZXRlcihzdGFjazIsICdTb21lUGFyYW1ldGVyJywgeyB0eXBlOiAnU3RyaW5nJywgZGVmYXVsdDogYFRoZUFjY291bnRJcyR7YWNjb3VudDF9YCB9KTtcblxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgY29uc3QgdGVtcGxhdGUyID0gYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoc3RhY2syLnN0YWNrTmFtZSkudGVtcGxhdGU7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHRlbXBsYXRlMikudG9FcXVhbCh7XG4gICAgICBQYXJhbWV0ZXJzOiB7XG4gICAgICAgIFNvbWVQYXJhbWV0ZXI6IHtcbiAgICAgICAgICBUeXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBEZWZhdWx0OiB7ICdGbjo6Sm9pbic6IFsnJywgWydUaGVBY2NvdW50SXMnLCB7ICdGbjo6SW1wb3J0VmFsdWUnOiAnU3RhY2sxOkV4cG9ydHNPdXRwdXRSZWZBV1NBY2NvdW50SWRBRDU2ODA1NycgfV1dIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcm9zcy1zdGFjayByZWZlcmVuY2VzIG9mIGxpc3RzIHJldHVybmVkIGZyb20gRm46OkdldEF0dCB3b3JrJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdTdGFjazEnKTtcbiAgICBjb25zdCBleHBvcnRSZXNvdXJjZSA9IG5ldyBDZm5SZXNvdXJjZShzdGFjazEsICdleHBvcnRlZFJlc291cmNlJywge1xuICAgICAgdHlwZTogJ0JMQScsXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMicpO1xuICAgIC8vIEwxcyByZXByZXNlbnQgYXR0cmlidXRlIG5hbWVzIHdpdGggYGF0dHIke2F0dHJpYnV0ZU5hbWV9YFxuICAgIChleHBvcnRSZXNvdXJjZSBhcyBhbnkpLmF0dHJMaXN0ID0gWydtYWdpYy1hdHRyLXZhbHVlJ107XG5cbiAgICAvLyBXSEVOIC0gdXNlZCBpbiBhbm90aGVyIHN0YWNrXG4gICAgbmV3IENmblJlc291cmNlKHN0YWNrMiwgJ1NvbWVSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdCTEEnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBQcm9wOiBleHBvcnRSZXNvdXJjZS5nZXRBdHQoJ0xpc3QnLCBSZXNvbHV0aW9uVHlwZUhpbnQuU1RSSU5HX0xJU1QpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgY29uc3QgdGVtcGxhdGUxID0gYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoc3RhY2sxLnN0YWNrTmFtZSkudGVtcGxhdGU7XG4gICAgY29uc3QgdGVtcGxhdGUyID0gYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoc3RhY2syLnN0YWNrTmFtZSkudGVtcGxhdGU7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHRlbXBsYXRlMSkudG9NYXRjaE9iamVjdCh7XG4gICAgICBPdXRwdXRzOiB7XG4gICAgICAgIEV4cG9ydHNPdXRwdXRGbkdldEF0dGV4cG9ydGVkUmVzb3VyY2VMaXN0MEVBM0UwRDk6IHtcbiAgICAgICAgICBWYWx1ZToge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAnfHwnLCB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnZXhwb3J0ZWRSZXNvdXJjZScsXG4gICAgICAgICAgICAgICAgICAnTGlzdCcsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBFeHBvcnQ6IHsgTmFtZTogJ1N0YWNrMTpFeHBvcnRzT3V0cHV0Rm5HZXRBdHRleHBvcnRlZFJlc291cmNlTGlzdDBFQTNFMEQ5JyB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGV4cGVjdCh0ZW1wbGF0ZTIpLnRvTWF0Y2hPYmplY3Qoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIFNvbWVSZXNvdXJjZToge1xuICAgICAgICAgIFR5cGU6ICdCTEEnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIFByb3A6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAnfHwnLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdGbjo6SW1wb3J0VmFsdWUnOiAnU3RhY2sxOkV4cG9ydHNPdXRwdXRGbkdldEF0dGV4cG9ydGVkUmVzb3VyY2VMaXN0MEVBM0UwRDknLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcm9zcy1zdGFjayByZWZlcmVuY2VzIG9mIGxpc3RzIHJldHVybmVkIGZyb20gRm46OkdldEF0dCBjYW4gYmUgdXNlZCB3aXRoIENGTiBpbnRyaW5zaWNzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdTdGFjazEnKTtcbiAgICBjb25zdCBleHBvcnRSZXNvdXJjZSA9IG5ldyBDZm5SZXNvdXJjZShzdGFjazEsICdleHBvcnRlZFJlc291cmNlJywge1xuICAgICAgdHlwZTogJ0JMQScsXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMicpO1xuICAgIC8vIEwxcyByZXByZXNlbnQgYXR0cmlidXRlIG5hbWVzIHdpdGggYGF0dHIke2F0dHJpYnV0ZU5hbWV9YFxuICAgIChleHBvcnRSZXNvdXJjZSBhcyBhbnkpLmF0dHJMaXN0ID0gWydtYWdpYy1hdHRyLXZhbHVlJ107XG5cbiAgICAvLyBXSEVOIC0gdXNlZCBpbiBhbm90aGVyIHN0YWNrXG4gICAgbmV3IENmblJlc291cmNlKHN0YWNrMiwgJ1NvbWVSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdCTEEnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBQcm9wOiBGbi5zZWxlY3QoMywgZXhwb3J0UmVzb3VyY2UuZ2V0QXR0KCdMaXN0JywgUmVzb2x1dGlvblR5cGVIaW50LlNUUklOR19MSVNUKSBhcyBhbnkpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgY29uc3QgdGVtcGxhdGUxID0gYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoc3RhY2sxLnN0YWNrTmFtZSkudGVtcGxhdGU7XG4gICAgY29uc3QgdGVtcGxhdGUyID0gYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoc3RhY2syLnN0YWNrTmFtZSkudGVtcGxhdGU7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHRlbXBsYXRlMSkudG9NYXRjaE9iamVjdCh7XG4gICAgICBPdXRwdXRzOiB7XG4gICAgICAgIEV4cG9ydHNPdXRwdXRGbkdldEF0dGV4cG9ydGVkUmVzb3VyY2VMaXN0MEVBM0UwRDk6IHtcbiAgICAgICAgICBWYWx1ZToge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAnfHwnLCB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnZXhwb3J0ZWRSZXNvdXJjZScsXG4gICAgICAgICAgICAgICAgICAnTGlzdCcsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBFeHBvcnQ6IHsgTmFtZTogJ1N0YWNrMTpFeHBvcnRzT3V0cHV0Rm5HZXRBdHRleHBvcnRlZFJlc291cmNlTGlzdDBFQTNFMEQ5JyB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGV4cGVjdCh0ZW1wbGF0ZTIpLnRvTWF0Y2hPYmplY3Qoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIFNvbWVSZXNvdXJjZToge1xuICAgICAgICAgIFR5cGU6ICdCTEEnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIFByb3A6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgICAgICAgMyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICAgICAgICAgICAnfHwnLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpJbXBvcnRWYWx1ZSc6ICdTdGFjazE6RXhwb3J0c091dHB1dEZuR2V0QXR0ZXhwb3J0ZWRSZXNvdXJjZUxpc3QwRUEzRTBEOScsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcm9zcy1zdGFjayByZWZlcmVuY2VzIG9mIGxpc3RzIHJldHVybmVkIGZyb20gRm46OlJlZiB3b3JrJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdTdGFjazEnKTtcbiAgICBjb25zdCBwYXJhbSA9IG5ldyBDZm5QYXJhbWV0ZXIoc3RhY2sxLCAnbWFnaWNQYXJhbWV0ZXInLCB7XG4gICAgICBkZWZhdWx0OiAnQkxBVCxCTEFIJyxcbiAgICAgIHR5cGU6ICdMaXN0PFN0cmluZz4nLFxuICAgIH0pO1xuICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhhcHAsICdTdGFjazInKTtcblxuICAgIC8vIFdIRU4gLSB1c2VkIGluIGFub3RoZXIgc3RhY2tcbiAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2syLCAnU29tZVJlc291cmNlJywge1xuICAgICAgdHlwZTogJ0JMQScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIFByb3A6IHBhcmFtLnZhbHVlLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgY29uc3QgdGVtcGxhdGUxID0gYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoc3RhY2sxLnN0YWNrTmFtZSkudGVtcGxhdGU7XG4gICAgY29uc3QgdGVtcGxhdGUyID0gYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoc3RhY2syLnN0YWNrTmFtZSkudGVtcGxhdGU7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHRlbXBsYXRlMSkudG9NYXRjaE9iamVjdCh7XG4gICAgICBPdXRwdXRzOiB7XG4gICAgICAgIEV4cG9ydHNPdXRwdXRSZWZtYWdpY1BhcmFtZXRlcjRDQzZGN0JFOiB7XG4gICAgICAgICAgVmFsdWU6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgJ3x8Jywge1xuICAgICAgICAgICAgICAgIFJlZjogJ21hZ2ljUGFyYW1ldGVyJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBFeHBvcnQ6IHsgTmFtZTogJ1N0YWNrMTpFeHBvcnRzT3V0cHV0UmVmbWFnaWNQYXJhbWV0ZXI0Q0M2RjdCRScgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBleHBlY3QodGVtcGxhdGUyKS50b01hdGNoT2JqZWN0KHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBTb21lUmVzb3VyY2U6IHtcbiAgICAgICAgICBUeXBlOiAnQkxBJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBQcm9wOiB7XG4gICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgJ3x8JyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnRm46OkltcG9ydFZhbHVlJzogJ1N0YWNrMTpFeHBvcnRzT3V0cHV0UmVmbWFnaWNQYXJhbWV0ZXI0Q0M2RjdCRScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Nyb3NzLXJlZ2lvbiBzdGFjayByZWZlcmVuY2VzLCBjcm9zc1JlZ2lvblJlZmVyZW5jZXM9dHJ1ZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2sxJywgeyBlbnY6IHsgcmVnaW9uOiAndXMtZWFzdC0xJyB9LCBjcm9zc1JlZ2lvblJlZmVyZW5jZXM6IHRydWUgfSk7XG4gICAgY29uc3QgZXhwb3J0UmVzb3VyY2UgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2sxLCAnU29tZVJlc291cmNlRXhwb3J0Jywge1xuICAgICAgdHlwZTogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMicsIHsgZW52OiB7IHJlZ2lvbjogJ3VzLWVhc3QtMicgfSwgY3Jvc3NSZWdpb25SZWZlcmVuY2VzOiB0cnVlIH0pO1xuXG4gICAgLy8gV0hFTiAtIHVzZWQgaW4gYW5vdGhlciBzdGFja1xuICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjazIsICdTb21lUmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgTmFtZTogZXhwb3J0UmVzb3VyY2UuZ2V0QXR0KCduYW1lJyksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCB0ZW1wbGF0ZTIgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjazIuc3RhY2tOYW1lKS50ZW1wbGF0ZTtcbiAgICBjb25zdCB0ZW1wbGF0ZTEgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjazEuc3RhY2tOYW1lKS50ZW1wbGF0ZTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodGVtcGxhdGUxKS50b01hdGNoT2JqZWN0KHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBTb21lUmVzb3VyY2VFeHBvcnQ6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgICAgfSxcbiAgICAgICAgRXhwb3J0c1dyaXRlcnVzZWFzdDI4MjhGQTI2Qjg2RkJFRkE3OiB7XG4gICAgICAgICAgVHlwZTogJ0N1c3RvbTo6Q3Jvc3NSZWdpb25FeHBvcnRXcml0ZXInLFxuICAgICAgICAgIERlbGV0aW9uUG9saWN5OiAnRGVsZXRlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBXcml0ZXJQcm9wczoge1xuICAgICAgICAgICAgICBleHBvcnRzOiB7XG4gICAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9TdGFjazIvU3RhY2sxdXNlYXN0MUZuR2V0QXR0U29tZVJlc291cmNlRXhwb3J0bmFtZTQ3QUQzMDRGJzoge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICdTb21lUmVzb3VyY2VFeHBvcnQnLFxuICAgICAgICAgICAgICAgICAgICAnbmFtZScsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU2VydmljZVRva2VuOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdDdXN0b21Dcm9zc1JlZ2lvbkV4cG9ydFdyaXRlckN1c3RvbVJlc291cmNlUHJvdmlkZXJIYW5kbGVyRDg3ODZFOEEnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGV4cGVjdCh0ZW1wbGF0ZTIpLnRvTWF0Y2hPYmplY3Qoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIFNvbWVSZXNvdXJjZToge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIE5hbWU6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0V4cG9ydHNSZWFkZXI4QjI0OTUyNCcsXG4gICAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9TdGFjazIvU3RhY2sxdXNlYXN0MUZuR2V0QXR0U29tZVJlc291cmNlRXhwb3J0bmFtZTQ3QUQzMDRGJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Nyb3NzLXJlZ2lvbiBzdGFjayByZWZlcmVuY2VzIHRocm93cyBlcnJvcicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2sxJywgeyBlbnY6IHsgcmVnaW9uOiAndXMtZWFzdC0xJyB9LCBjcm9zc1JlZ2lvblJlZmVyZW5jZXM6IHRydWUgfSk7XG4gICAgY29uc3QgZXhwb3J0UmVzb3VyY2UgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2sxLCAnU29tZVJlc291cmNlRXhwb3J0Jywge1xuICAgICAgdHlwZTogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMicsIHsgZW52OiB7IHJlZ2lvbjogJ3VzLWVhc3QtMicgfSB9KTtcblxuICAgIC8vIFdIRU4gLSB1c2VkIGluIGFub3RoZXIgc3RhY2tcbiAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2syLCAnU29tZVJlc291cmNlJywge1xuICAgICAgdHlwZTogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIE5hbWU6IGV4cG9ydFJlc291cmNlLmdldEF0dCgnbmFtZScpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgYXBwLnN5bnRoKCk7XG4gICAgfSkudG9UaHJvdygvU2V0IGNyb3NzUmVnaW9uUmVmZXJlbmNlcz10cnVlIHRvIGVuYWJsZSBjcm9zcyByZWdpb24gcmVmZXJlbmNlcy8pO1xuICB9KTtcblxuICB0ZXN0KCdjcm9zcyByZWdpb24gc3RhY2sgcmVmZXJlbmNlcyB3aXRoIG11bHRpcGxlIHN0YWNrcywgY3Jvc3NSZWdpb25SZWZlcmVuY2VzPXRydWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMScsIHsgZW52OiB7IHJlZ2lvbjogJ3VzLWVhc3QtMScgfSwgY3Jvc3NSZWdpb25SZWZlcmVuY2VzOiB0cnVlIH0pO1xuICAgIGNvbnN0IGV4cG9ydFJlc291cmNlID0gbmV3IENmblJlc291cmNlKHN0YWNrMSwgJ1NvbWVSZXNvdXJjZUV4cG9ydCcsIHtcbiAgICAgIHR5cGU6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgIH0pO1xuICAgIGNvbnN0IHN0YWNrMyA9IG5ldyBTdGFjayhhcHAsICdTdGFjazMnLCB7IGVudjogeyByZWdpb246ICd1cy1lYXN0LTEnIH0sIGNyb3NzUmVnaW9uUmVmZXJlbmNlczogdHJ1ZSB9KTtcbiAgICBjb25zdCBleHBvcnRSZXNvdXJjZTMgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2szLCAnU29tZVJlc291cmNlRXhwb3J0Jywge1xuICAgICAgdHlwZTogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMicsIHsgZW52OiB7IHJlZ2lvbjogJ3VzLWVhc3QtMicgfSwgY3Jvc3NSZWdpb25SZWZlcmVuY2VzOiB0cnVlIH0pO1xuXG4gICAgLy8gV0hFTiAtIHVzZWQgaW4gYW5vdGhlciBzdGFja1xuICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjazIsICdTb21lUmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgTmFtZTogZXhwb3J0UmVzb3VyY2UuZ2V0QXR0KCduYW1lJyksXG4gICAgICAgIE90aGVyOiBleHBvcnRSZXNvdXJjZS5nZXRBdHQoJ290aGVyJyksXG4gICAgICAgIE90aGVyMjogZXhwb3J0UmVzb3VyY2UzLmdldEF0dCgnb3RoZXIyJyksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCB0ZW1wbGF0ZTIgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjazIuc3RhY2tOYW1lKS50ZW1wbGF0ZTtcbiAgICBjb25zdCB0ZW1wbGF0ZTMgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjazMuc3RhY2tOYW1lKS50ZW1wbGF0ZTtcbiAgICBjb25zdCB0ZW1wbGF0ZTEgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjazEuc3RhY2tOYW1lKS50ZW1wbGF0ZTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodGVtcGxhdGUyKS50b01hdGNoT2JqZWN0KHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBDdXN0b21Dcm9zc1JlZ2lvbkV4cG9ydFJlYWRlckN1c3RvbVJlc291cmNlUHJvdmlkZXJSb2xlMTA1MzFCQkQ6IHtcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBQb2xpY2llczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3NtOkFkZFRhZ3NUb1Jlc291cmNlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdzc206UmVtb3ZlVGFnc0Zyb21SZXNvdXJjZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3NtOkdldFBhcmFtZXRlcnMnLFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc6c3NtOnVzLWVhc3QtMjonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc6cGFyYW1ldGVyL2Nkay9leHBvcnRzL1N0YWNrMi8qJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBQb2xpY3lOYW1lOiAnSW5saW5lJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBUeXBlOiAnQVdTOjpJQU06OlJvbGUnLFxuICAgICAgICB9LFxuICAgICAgICBFeHBvcnRzUmVhZGVyOEIyNDk1MjQ6IHtcbiAgICAgICAgICBEZWxldGlvblBvbGljeTogJ0RlbGV0ZScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgUmVhZGVyUHJvcHM6IHtcbiAgICAgICAgICAgICAgaW1wb3J0czoge1xuICAgICAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvU3RhY2syL1N0YWNrMXVzZWFzdDFGbkdldEF0dFNvbWVSZXNvdXJjZUV4cG9ydG5hbWU0N0FEMzA0Ric6ICd7e3Jlc29sdmU6c3NtOi9jZGsvZXhwb3J0cy9TdGFjazIvU3RhY2sxdXNlYXN0MUZuR2V0QXR0U29tZVJlc291cmNlRXhwb3J0bmFtZTQ3QUQzMDRGfX0nLFxuICAgICAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvU3RhY2syL1N0YWNrMXVzZWFzdDFGbkdldEF0dFNvbWVSZXNvdXJjZUV4cG9ydG90aGVyQzZGOENCRDEnOiAne3tyZXNvbHZlOnNzbTovY2RrL2V4cG9ydHMvU3RhY2syL1N0YWNrMXVzZWFzdDFGbkdldEF0dFNvbWVSZXNvdXJjZUV4cG9ydG90aGVyQzZGOENCRDF9fScsXG4gICAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9TdGFjazIvU3RhY2szdXNlYXN0MUZuR2V0QXR0U29tZVJlc291cmNlRXhwb3J0b3RoZXIyMTkwQTY3OUInOiAne3tyZXNvbHZlOnNzbTovY2RrL2V4cG9ydHMvU3RhY2syL1N0YWNrM3VzZWFzdDFGbkdldEF0dFNvbWVSZXNvdXJjZUV4cG9ydG90aGVyMjE5MEE2NzlCfX0nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICByZWdpb246ICd1cy1lYXN0LTInLFxuICAgICAgICAgICAgICBwcmVmaXg6ICdTdGFjazInLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFNlcnZpY2VUb2tlbjoge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnQ3VzdG9tQ3Jvc3NSZWdpb25FeHBvcnRSZWFkZXJDdXN0b21SZXNvdXJjZVByb3ZpZGVySGFuZGxlcjQ2NjQ3QjY4JyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBUeXBlOiAnQ3VzdG9tOjpDcm9zc1JlZ2lvbkV4cG9ydFJlYWRlcicsXG4gICAgICAgICAgVXBkYXRlUmVwbGFjZVBvbGljeTogJ0RlbGV0ZScsXG4gICAgICAgIH0sXG4gICAgICAgIFNvbWVSZXNvdXJjZToge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIE5hbWU6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0V4cG9ydHNSZWFkZXI4QjI0OTUyNCcsXG4gICAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9TdGFjazIvU3RhY2sxdXNlYXN0MUZuR2V0QXR0U29tZVJlc291cmNlRXhwb3J0bmFtZTQ3QUQzMDRGJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBPdGhlcjoge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnRXhwb3J0c1JlYWRlcjhCMjQ5NTI0JyxcbiAgICAgICAgICAgICAgICAnL2Nkay9leHBvcnRzL1N0YWNrMi9TdGFjazF1c2Vhc3QxRm5HZXRBdHRTb21lUmVzb3VyY2VFeHBvcnRvdGhlckM2RjhDQkQxJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBPdGhlcjI6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0V4cG9ydHNSZWFkZXI4QjI0OTUyNCcsXG4gICAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9TdGFjazIvU3RhY2szdXNlYXN0MUZuR2V0QXR0U29tZVJlc291cmNlRXhwb3J0b3RoZXIyMTkwQTY3OUInLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBleHBlY3QodGVtcGxhdGUzKS50b01hdGNoT2JqZWN0KHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBTb21lUmVzb3VyY2VFeHBvcnQ6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgICAgfSxcbiAgICAgICAgRXhwb3J0c1dyaXRlcnVzZWFzdDI4MjhGQTI2Qjg2RkJFRkE3OiB7XG4gICAgICAgICAgVHlwZTogJ0N1c3RvbTo6Q3Jvc3NSZWdpb25FeHBvcnRXcml0ZXInLFxuICAgICAgICAgIERlbGV0aW9uUG9saWN5OiAnRGVsZXRlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBXcml0ZXJQcm9wczoge1xuICAgICAgICAgICAgICBleHBvcnRzOiB7XG4gICAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9TdGFjazIvU3RhY2szdXNlYXN0MUZuR2V0QXR0U29tZVJlc291cmNlRXhwb3J0b3RoZXIyMTkwQTY3OUInOiB7XG4gICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgJ1NvbWVSZXNvdXJjZUV4cG9ydCcsXG4gICAgICAgICAgICAgICAgICAgICdvdGhlcjInLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICByZWdpb246ICd1cy1lYXN0LTInLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFNlcnZpY2VUb2tlbjoge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnQ3VzdG9tQ3Jvc3NSZWdpb25FeHBvcnRXcml0ZXJDdXN0b21SZXNvdXJjZVByb3ZpZGVySGFuZGxlckQ4Nzg2RThBJyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgZXhwZWN0KHRlbXBsYXRlMSkudG9NYXRjaE9iamVjdCh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgU29tZVJlc291cmNlRXhwb3J0OiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgICAgIH0sXG4gICAgICAgIEV4cG9ydHNXcml0ZXJ1c2Vhc3QyODI4RkEyNkI4NkZCRUZBNzoge1xuICAgICAgICAgIFR5cGU6ICdDdXN0b206OkNyb3NzUmVnaW9uRXhwb3J0V3JpdGVyJyxcbiAgICAgICAgICBEZWxldGlvblBvbGljeTogJ0RlbGV0ZScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgV3JpdGVyUHJvcHM6IHtcbiAgICAgICAgICAgICAgZXhwb3J0czoge1xuICAgICAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvU3RhY2syL1N0YWNrMXVzZWFzdDFGbkdldEF0dFNvbWVSZXNvdXJjZUV4cG9ydG5hbWU0N0FEMzA0Ric6IHtcbiAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAnU29tZVJlc291cmNlRXhwb3J0JyxcbiAgICAgICAgICAgICAgICAgICAgJ25hbWUnLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvU3RhY2syL1N0YWNrMXVzZWFzdDFGbkdldEF0dFNvbWVSZXNvdXJjZUV4cG9ydG90aGVyQzZGOENCRDEnOiB7XG4gICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgJ1NvbWVSZXNvdXJjZUV4cG9ydCcsXG4gICAgICAgICAgICAgICAgICAgICdvdGhlcicsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU2VydmljZVRva2VuOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdDdXN0b21Dcm9zc1JlZ2lvbkV4cG9ydFdyaXRlckN1c3RvbVJlc291cmNlUHJvdmlkZXJIYW5kbGVyRDg3ODZFOEEnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3Jvc3MgcmVnaW9uIHN0YWNrIHJlZmVyZW5jZXMgd2l0aCBtdWx0aXBsZSBzdGFja3MgYW5kIG11bHRpcGxlIHJlZ2lvbnMsIGNyb3NzUmVnaW9uUmVmZXJlbmNlcz10cnVlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdTdGFjazEnLCB7IGVudjogeyByZWdpb246ICd1cy1lYXN0LTEnIH0sIGNyb3NzUmVnaW9uUmVmZXJlbmNlczogdHJ1ZSB9KTtcbiAgICBjb25zdCBleHBvcnRSZXNvdXJjZSA9IG5ldyBDZm5SZXNvdXJjZShzdGFjazEsICdTb21lUmVzb3VyY2VFeHBvcnQnLCB7XG4gICAgICB0eXBlOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICB9KTtcbiAgICBjb25zdCBzdGFjazMgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2szJywgeyBlbnY6IHsgcmVnaW9uOiAndXMtd2VzdC0xJyB9LCBjcm9zc1JlZ2lvblJlZmVyZW5jZXM6IHRydWUgfSk7XG4gICAgY29uc3QgZXhwb3J0UmVzb3VyY2UzID0gbmV3IENmblJlc291cmNlKHN0YWNrMywgJ1NvbWVSZXNvdXJjZUV4cG9ydCcsIHtcbiAgICAgIHR5cGU6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgIH0pO1xuICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhhcHAsICdTdGFjazInLCB7IGVudjogeyByZWdpb246ICd1cy1lYXN0LTInIH0sIGNyb3NzUmVnaW9uUmVmZXJlbmNlczogdHJ1ZSB9KTtcblxuICAgIC8vIFdIRU4gLSB1c2VkIGluIGFub3RoZXIgc3RhY2tcbiAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2syLCAnU29tZVJlc291cmNlJywge1xuICAgICAgdHlwZTogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIE5hbWU6IGV4cG9ydFJlc291cmNlLmdldEF0dCgnbmFtZScpLFxuICAgICAgICBPdGhlcjogZXhwb3J0UmVzb3VyY2UuZ2V0QXR0KCdvdGhlcicpLFxuICAgICAgICBPdGhlcjI6IGV4cG9ydFJlc291cmNlMy5nZXRBdHQoJ290aGVyMicpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgY29uc3QgdGVtcGxhdGUyID0gYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoc3RhY2syLnN0YWNrTmFtZSkudGVtcGxhdGU7XG4gICAgY29uc3QgdGVtcGxhdGUzID0gYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoc3RhY2szLnN0YWNrTmFtZSkudGVtcGxhdGU7XG4gICAgY29uc3QgdGVtcGxhdGUxID0gYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoc3RhY2sxLnN0YWNrTmFtZSkudGVtcGxhdGU7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHRlbXBsYXRlMykudG9NYXRjaE9iamVjdCh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgU29tZVJlc291cmNlRXhwb3J0OiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGV4cGVjdCh0ZW1wbGF0ZTIpLnRvTWF0Y2hPYmplY3Qoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIFNvbWVSZXNvdXJjZToge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIE5hbWU6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0V4cG9ydHNSZWFkZXI4QjI0OTUyNCcsXG4gICAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9TdGFjazIvU3RhY2sxdXNlYXN0MUZuR2V0QXR0U29tZVJlc291cmNlRXhwb3J0bmFtZTQ3QUQzMDRGJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBPdGhlcjoge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnRXhwb3J0c1JlYWRlcjhCMjQ5NTI0JyxcbiAgICAgICAgICAgICAgICAnL2Nkay9leHBvcnRzL1N0YWNrMi9TdGFjazF1c2Vhc3QxRm5HZXRBdHRTb21lUmVzb3VyY2VFeHBvcnRvdGhlckM2RjhDQkQxJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBPdGhlcjI6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0V4cG9ydHNSZWFkZXI4QjI0OTUyNCcsXG4gICAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9TdGFjazIvU3RhY2szdXN3ZXN0MUZuR2V0QXR0U29tZVJlc291cmNlRXhwb3J0b3RoZXIyNDkxQjVEQTcnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBleHBlY3QodGVtcGxhdGUzKS50b01hdGNoT2JqZWN0KHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBTb21lUmVzb3VyY2VFeHBvcnQ6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgICAgfSxcbiAgICAgICAgRXhwb3J0c1dyaXRlcnVzZWFzdDI4MjhGQTI2Qjg2RkJFRkE3OiB7XG4gICAgICAgICAgVHlwZTogJ0N1c3RvbTo6Q3Jvc3NSZWdpb25FeHBvcnRXcml0ZXInLFxuICAgICAgICAgIERlbGV0aW9uUG9saWN5OiAnRGVsZXRlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBXcml0ZXJQcm9wczoge1xuICAgICAgICAgICAgICBleHBvcnRzOiB7XG4gICAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9TdGFjazIvU3RhY2szdXN3ZXN0MUZuR2V0QXR0U29tZVJlc291cmNlRXhwb3J0b3RoZXIyNDkxQjVEQTcnOiB7XG4gICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgJ1NvbWVSZXNvdXJjZUV4cG9ydCcsXG4gICAgICAgICAgICAgICAgICAgICdvdGhlcjInLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICByZWdpb246ICd1cy1lYXN0LTInLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFNlcnZpY2VUb2tlbjoge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnQ3VzdG9tQ3Jvc3NSZWdpb25FeHBvcnRXcml0ZXJDdXN0b21SZXNvdXJjZVByb3ZpZGVySGFuZGxlckQ4Nzg2RThBJyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgZXhwZWN0KHRlbXBsYXRlMSkudG9NYXRjaE9iamVjdCh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgU29tZVJlc291cmNlRXhwb3J0OiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgICAgIH0sXG4gICAgICAgIEV4cG9ydHNXcml0ZXJ1c2Vhc3QyODI4RkEyNkI4NkZCRUZBNzoge1xuICAgICAgICAgIFR5cGU6ICdDdXN0b206OkNyb3NzUmVnaW9uRXhwb3J0V3JpdGVyJyxcbiAgICAgICAgICBEZWxldGlvblBvbGljeTogJ0RlbGV0ZScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgV3JpdGVyUHJvcHM6IHtcbiAgICAgICAgICAgICAgZXhwb3J0czoge1xuICAgICAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvU3RhY2syL1N0YWNrMXVzZWFzdDFGbkdldEF0dFNvbWVSZXNvdXJjZUV4cG9ydG5hbWU0N0FEMzA0Ric6IHtcbiAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAnU29tZVJlc291cmNlRXhwb3J0JyxcbiAgICAgICAgICAgICAgICAgICAgJ25hbWUnLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvU3RhY2syL1N0YWNrMXVzZWFzdDFGbkdldEF0dFNvbWVSZXNvdXJjZUV4cG9ydG90aGVyQzZGOENCRDEnOiB7XG4gICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgJ1NvbWVSZXNvdXJjZUV4cG9ydCcsXG4gICAgICAgICAgICAgICAgICAgICdvdGhlcicsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU2VydmljZVRva2VuOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdDdXN0b21Dcm9zc1JlZ2lvbkV4cG9ydFdyaXRlckN1c3RvbVJlc291cmNlUHJvdmlkZXJIYW5kbGVyRDg3ODZFOEEnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3Jvc3Mgc3RhY2sgcmVmZXJlbmNlcyBhbmQgZGVwZW5kZW5jaWVzIHdvcmsgd2l0aGluIGNoaWxkIHN0YWNrcyAobm9uLW5lc3RlZCknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgJ0Bhd3MtY2RrL2NvcmU6c3RhY2tSZWxhdGl2ZUV4cG9ydHMnOiB0cnVlLFxuICAgICAgICBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnN0IHBhcmVudCA9IG5ldyBTdGFjayhhcHAsICdQYXJlbnQnKTtcbiAgICBjb25zdCBjaGlsZDEgPSBuZXcgU3RhY2socGFyZW50LCAnQ2hpbGQxJyk7XG4gICAgY29uc3QgY2hpbGQyID0gbmV3IFN0YWNrKHBhcmVudCwgJ0NoaWxkMicpO1xuICAgIGNvbnN0IHJlc291cmNlQSA9IG5ldyBDZm5SZXNvdXJjZShjaGlsZDEsICdSZXNvdXJjZUEnLCB7IHR5cGU6ICdSQScgfSk7XG4gICAgY29uc3QgcmVzb3VyY2VCID0gbmV3IENmblJlc291cmNlKGNoaWxkMSwgJ1Jlc291cmNlQicsIHsgdHlwZTogJ1JCJyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByZXNvdXJjZTIgPSBuZXcgQ2ZuUmVzb3VyY2UoY2hpbGQyLCAnUmVzb3VyY2UxJywge1xuICAgICAgdHlwZTogJ1IyJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgUmVmVG9SZXNvdXJjZTE6IHJlc291cmNlQS5yZWYsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHJlc291cmNlMi5hZGREZXBlbmRlbmN5KHJlc291cmNlQik7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCBwYXJlbnRUZW1wbGF0ZSA9IGFzc2VtYmx5LmdldFN0YWNrQXJ0aWZhY3QocGFyZW50LmFydGlmYWN0SWQpLnRlbXBsYXRlO1xuICAgIGNvbnN0IGNoaWxkMVRlbXBsYXRlID0gYXNzZW1ibHkuZ2V0U3RhY2tBcnRpZmFjdChjaGlsZDEuYXJ0aWZhY3RJZCkudGVtcGxhdGU7XG4gICAgY29uc3QgY2hpbGQyVGVtcGxhdGUgPSBhc3NlbWJseS5nZXRTdGFja0FydGlmYWN0KGNoaWxkMi5hcnRpZmFjdElkKS50ZW1wbGF0ZTtcblxuICAgIGV4cGVjdChwYXJlbnRUZW1wbGF0ZSkudG9FcXVhbCh7fSk7XG4gICAgZXhwZWN0KGNoaWxkMVRlbXBsYXRlKS50b0VxdWFsKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBSZXNvdXJjZUE6IHsgVHlwZTogJ1JBJyB9LFxuICAgICAgICBSZXNvdXJjZUI6IHsgVHlwZTogJ1JCJyB9LFxuICAgICAgfSxcbiAgICAgIE91dHB1dHM6IHtcbiAgICAgICAgRXhwb3J0c091dHB1dFJlZlJlc291cmNlQTQ2MUI0RUY5OiB7XG4gICAgICAgICAgVmFsdWU6IHsgUmVmOiAnUmVzb3VyY2VBJyB9LFxuICAgICAgICAgIEV4cG9ydDogeyBOYW1lOiAnUGFyZW50Q2hpbGQxOEZBRUY0MTk6RXhwb3J0c091dHB1dFJlZlJlc291cmNlQTQ2MUI0RUY5JyB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBleHBlY3QoY2hpbGQyVGVtcGxhdGUpLnRvRXF1YWwoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIFJlc291cmNlMToge1xuICAgICAgICAgIFR5cGU6ICdSMicsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgUmVmVG9SZXNvdXJjZTE6IHsgJ0ZuOjpJbXBvcnRWYWx1ZSc6ICdQYXJlbnRDaGlsZDE4RkFFRjQxOTpFeHBvcnRzT3V0cHV0UmVmUmVzb3VyY2VBNDYxQjRFRjknIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBleHBlY3QoYXNzZW1ibHkuZ2V0U3RhY2tBcnRpZmFjdChjaGlsZDEuYXJ0aWZhY3RJZCkuZGVwZW5kZW5jaWVzLm1hcCgoeDogeyBpZDogYW55OyB9KSA9PiB4LmlkKSkudG9FcXVhbChbXSk7XG4gICAgZXhwZWN0KGFzc2VtYmx5LmdldFN0YWNrQXJ0aWZhY3QoY2hpbGQyLmFydGlmYWN0SWQpLmRlcGVuZGVuY2llcy5tYXAoKHg6IHsgaWQ6IGFueTsgfSkgPT4geC5pZCkpLnRvRXF1YWwoWydQYXJlbnRDaGlsZDE4RkFFRjQxOSddKTtcbiAgfSk7XG5cbiAgdGVzdCgnX2FkZEFzc2VtYmx5RGVwZW5kZW5jeSBhZGRzIHRvIF9zdGFja0RlcGVuZGVuY2llcycsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgJ0Bhd3MtY2RrL2NvcmU6c3RhY2tSZWxhdGl2ZUV4cG9ydHMnOiB0cnVlLFxuICAgICAgICBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnN0IHBhcmVudCA9IG5ldyBTdGFjayhhcHAsICdQYXJlbnQnKTtcbiAgICBjb25zdCBjaGlsZDEgPSBuZXcgU3RhY2socGFyZW50LCAnQ2hpbGQxJyk7XG4gICAgY29uc3QgY2hpbGRBID0gbmV3IFN0YWNrKHBhcmVudCwgJ0NoaWxkQScpO1xuICAgIGNvbnN0IHJlc291cmNlMSA9IG5ldyBDZm5SZXNvdXJjZShjaGlsZDEsICdSZXNvdXJjZTEnLCB7IHR5cGU6ICdSMScgfSk7XG4gICAgY29uc3QgcmVzb3VyY2UyID0gbmV3IENmblJlc291cmNlKGNoaWxkMSwgJ1Jlc291cmNlMicsIHsgdHlwZTogJ1IyJyB9KTtcbiAgICBjb25zdCByZXNvdXJjZUEgPSBuZXcgQ2ZuUmVzb3VyY2UoY2hpbGRBLCAnUmVzb3VyY2VBJywgeyB0eXBlOiAnUkEnIH0pO1xuXG4gICAgY2hpbGRBLl9hZGRBc3NlbWJseURlcGVuZGVuY3koY2hpbGQxLCB7IHNvdXJjZTogcmVzb3VyY2VBLCB0YXJnZXQ6IHJlc291cmNlMSB9KTtcbiAgICBjaGlsZEEuX2FkZEFzc2VtYmx5RGVwZW5kZW5jeShjaGlsZDEsIHsgc291cmNlOiByZXNvdXJjZUEsIHRhcmdldDogcmVzb3VyY2UyIH0pO1xuXG4gICAgZXhwZWN0KGNoaWxkQS5fb2J0YWluQXNzZW1ibHlEZXBlbmRlbmNpZXMoeyBzb3VyY2U6IHJlc291cmNlQSB9KSlcbiAgICAgIC50b0VxdWFsKFtyZXNvdXJjZTEsIHJlc291cmNlMl0pO1xuXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcblxuICAgIGV4cGVjdChhc3NlbWJseS5nZXRTdGFja0FydGlmYWN0KGNoaWxkMS5hcnRpZmFjdElkKS5kZXBlbmRlbmNpZXMubWFwKCh4OiB7IGlkOiBhbnk7IH0pID0+IHguaWQpKS50b0VxdWFsKFtdKTtcbiAgICBleHBlY3QoYXNzZW1ibHkuZ2V0U3RhY2tBcnRpZmFjdChjaGlsZEEuYXJ0aWZhY3RJZCkuZGVwZW5kZW5jaWVzLm1hcCgoeDogeyBpZDogYW55OyB9KSA9PiB4LmlkKSkudG9FcXVhbChbJ1BhcmVudENoaWxkMThGQUVGNDE5J10pO1xuICB9KTtcblxuICB0ZXN0KCdfYWRkQXNzZW1ibHlEZXBlbmRlbmN5IGFkZHMgb25lIFN0YWNrRGVwZW5kZW5jeVJlYXNvbiB3aXRoIGRlZmF1bHRzJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoe1xuICAgICAgY29udGV4dDoge1xuICAgICAgICAnQGF3cy1jZGsvY29yZTpzdGFja1JlbGF0aXZlRXhwb3J0cyc6IHRydWUsXG4gICAgICAgIFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3QgcGFyZW50ID0gbmV3IFN0YWNrKGFwcCwgJ1BhcmVudCcpO1xuICAgIGNvbnN0IGNoaWxkMSA9IG5ldyBTdGFjayhwYXJlbnQsICdDaGlsZDEnKTtcbiAgICBjb25zdCBjaGlsZEEgPSBuZXcgU3RhY2socGFyZW50LCAnQ2hpbGRBJyk7XG5cbiAgICBjaGlsZEEuX2FkZEFzc2VtYmx5RGVwZW5kZW5jeShjaGlsZDEpO1xuXG4gICAgZXhwZWN0KGNoaWxkQS5fb2J0YWluQXNzZW1ibHlEZXBlbmRlbmNpZXMoeyBzb3VyY2U6IGNoaWxkQSB9KSlcbiAgICAgIC50b0VxdWFsKFtjaGlsZDFdKTtcblxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG5cbiAgICBleHBlY3QoYXNzZW1ibHkuZ2V0U3RhY2tBcnRpZmFjdChjaGlsZDEuYXJ0aWZhY3RJZCkuZGVwZW5kZW5jaWVzLm1hcCgoeDogeyBpZDogYW55OyB9KSA9PiB4LmlkKSkudG9FcXVhbChbXSk7XG4gICAgZXhwZWN0KGFzc2VtYmx5LmdldFN0YWNrQXJ0aWZhY3QoY2hpbGRBLmFydGlmYWN0SWQpLmRlcGVuZGVuY2llcy5tYXAoKHg6IHsgaWQ6IGFueTsgfSkgPT4geC5pZCkpLnRvRXF1YWwoWydQYXJlbnRDaGlsZDE4RkFFRjQxOSddKTtcbiAgfSk7XG5cbiAgdGVzdCgnX2FkZEFzc2VtYmx5RGVwZW5kZW5jeSByYWlzZXMgZXJyb3Igb24gY3ljbGUnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7XG4gICAgICBjb250ZXh0OiB7XG4gICAgICAgICdAYXdzLWNkay9jb3JlOnN0YWNrUmVsYXRpdmVFeHBvcnRzJzogdHJ1ZSxcbiAgICAgICAgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBwYXJlbnQgPSBuZXcgU3RhY2soYXBwLCAnUGFyZW50Jyk7XG4gICAgY29uc3QgY2hpbGQxID0gbmV3IFN0YWNrKHBhcmVudCwgJ0NoaWxkMScpO1xuICAgIGNvbnN0IGNoaWxkMiA9IG5ldyBTdGFjayhwYXJlbnQsICdDaGlsZDInKTtcblxuICAgIGNoaWxkMi5fYWRkQXNzZW1ibHlEZXBlbmRlbmN5KGNoaWxkMSk7XG4gICAgZXhwZWN0KCgpID0+IGNoaWxkMS5fYWRkQXNzZW1ibHlEZXBlbmRlbmN5KGNoaWxkMikpLnRvVGhyb3coXCInUGFyZW50L0NoaWxkMicgZGVwZW5kcyBvblwiKTtcbiAgfSk7XG5cbiAgdGVzdCgnX2FkZEFzc2VtYmx5RGVwZW5kZW5jeSByYWlzZXMgZXJyb3IgZm9yIG5lc3RlZCBzdGFja3MnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7XG4gICAgICBjb250ZXh0OiB7XG4gICAgICAgICdAYXdzLWNkay9jb3JlOnN0YWNrUmVsYXRpdmVFeHBvcnRzJzogdHJ1ZSxcbiAgICAgICAgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBwYXJlbnQgPSBuZXcgU3RhY2soYXBwLCAnUGFyZW50Jyk7XG4gICAgY29uc3QgY2hpbGQxID0gbmV3IE5lc3RlZFN0YWNrKHBhcmVudCwgJ0NoaWxkMScpO1xuICAgIGNvbnN0IGNoaWxkMiA9IG5ldyBOZXN0ZWRTdGFjayhwYXJlbnQsICdDaGlsZDInKTtcblxuICAgIGV4cGVjdCgoKSA9PiBjaGlsZDEuX2FkZEFzc2VtYmx5RGVwZW5kZW5jeShjaGlsZDIpKS50b1Rocm93KCdDYW5ub3QgYWRkIGFzc2VtYmx5LWxldmVsJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ19hZGRBc3NlbWJseURlcGVuZGVuY3kgaGFuZGxlcyBkdXBsaWNhdGUgZGVwZW5kZW5jeSByZWFzb25zJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoe1xuICAgICAgY29udGV4dDoge1xuICAgICAgICAnQGF3cy1jZGsvY29yZTpzdGFja1JlbGF0aXZlRXhwb3J0cyc6IHRydWUsXG4gICAgICAgIFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3QgcGFyZW50ID0gbmV3IFN0YWNrKGFwcCwgJ1BhcmVudCcpO1xuICAgIGNvbnN0IGNoaWxkMSA9IG5ldyBTdGFjayhwYXJlbnQsICdDaGlsZDEnKTtcbiAgICBjb25zdCBjaGlsZDIgPSBuZXcgU3RhY2socGFyZW50LCAnQ2hpbGQyJyk7XG5cbiAgICBjaGlsZDIuX2FkZEFzc2VtYmx5RGVwZW5kZW5jeShjaGlsZDEpO1xuICAgIGNvbnN0IGRlcHNCZWZvcmUgPSBjaGlsZDIuX29idGFpbkFzc2VtYmx5RGVwZW5kZW5jaWVzKHsgc291cmNlOiBjaGlsZDIgfSk7XG4gICAgY2hpbGQyLl9hZGRBc3NlbWJseURlcGVuZGVuY3koY2hpbGQxKTtcbiAgICBleHBlY3QoZGVwc0JlZm9yZSkudG9FcXVhbChjaGlsZDIuX29idGFpbkFzc2VtYmx5RGVwZW5kZW5jaWVzKHsgc291cmNlOiBjaGlsZDIgfSkpO1xuICB9KTtcblxuICB0ZXN0KCdfcmVtb3ZlQXNzZW1ibHlEZXBlbmRlbmN5IHJlbW92ZXMgb25lIFN0YWNrRGVwZW5kZW5jeVJlYXNvbiBvZiB0d28gZnJvbSBfc3RhY2tEZXBlbmRlbmNpZXMnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7XG4gICAgICBjb250ZXh0OiB7XG4gICAgICAgICdAYXdzLWNkay9jb3JlOnN0YWNrUmVsYXRpdmVFeHBvcnRzJzogdHJ1ZSxcbiAgICAgICAgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBwYXJlbnQgPSBuZXcgU3RhY2soYXBwLCAnUGFyZW50Jyk7XG4gICAgY29uc3QgY2hpbGQxID0gbmV3IFN0YWNrKHBhcmVudCwgJ0NoaWxkMScpO1xuICAgIGNvbnN0IGNoaWxkQSA9IG5ldyBTdGFjayhwYXJlbnQsICdDaGlsZEEnKTtcbiAgICBjb25zdCByZXNvdXJjZTEgPSBuZXcgQ2ZuUmVzb3VyY2UoY2hpbGQxLCAnUmVzb3VyY2UxJywgeyB0eXBlOiAnUjEnIH0pO1xuICAgIGNvbnN0IHJlc291cmNlMiA9IG5ldyBDZm5SZXNvdXJjZShjaGlsZDEsICdSZXNvdXJjZTInLCB7IHR5cGU6ICdSMicgfSk7XG4gICAgY29uc3QgcmVzb3VyY2VBID0gbmV3IENmblJlc291cmNlKGNoaWxkQSwgJ1Jlc291cmNlQScsIHsgdHlwZTogJ1JBJyB9KTtcblxuICAgIGNoaWxkQS5fYWRkQXNzZW1ibHlEZXBlbmRlbmN5KGNoaWxkMSwgeyBzb3VyY2U6IHJlc291cmNlQSwgdGFyZ2V0OiByZXNvdXJjZTEgfSk7XG4gICAgY2hpbGRBLl9hZGRBc3NlbWJseURlcGVuZGVuY3koY2hpbGQxLCB7IHNvdXJjZTogcmVzb3VyY2VBLCB0YXJnZXQ6IHJlc291cmNlMiB9KTtcbiAgICBjaGlsZEEuX3JlbW92ZUFzc2VtYmx5RGVwZW5kZW5jeShjaGlsZDEsIHsgc291cmNlOiByZXNvdXJjZUEsIHRhcmdldDogcmVzb3VyY2UxIH0pO1xuXG4gICAgZXhwZWN0KGNoaWxkQS5fb2J0YWluQXNzZW1ibHlEZXBlbmRlbmNpZXMoeyBzb3VyY2U6IHJlc291cmNlQSB9KSkudG9FcXVhbChbcmVzb3VyY2UyXSk7XG5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuXG4gICAgZXhwZWN0KGFzc2VtYmx5LmdldFN0YWNrQXJ0aWZhY3QoY2hpbGQxLmFydGlmYWN0SWQpLmRlcGVuZGVuY2llcy5tYXAoKHg6IHsgaWQ6IGFueTsgfSkgPT4geC5pZCkpLnRvRXF1YWwoW10pO1xuICAgIGV4cGVjdChhc3NlbWJseS5nZXRTdGFja0FydGlmYWN0KGNoaWxkQS5hcnRpZmFjdElkKS5kZXBlbmRlbmNpZXMubWFwKCh4OiB7IGlkOiBhbnk7IH0pID0+IHguaWQpKS50b0VxdWFsKFsnUGFyZW50Q2hpbGQxOEZBRUY0MTknXSk7XG4gIH0pO1xuXG4gIHRlc3QoJ19yZW1vdmVBc3NlbWJseURlcGVuZGVuY3kgcmVtb3ZlcyBhIFN0YWNrRGVwZW5kZW5jeSBmcm9tIF9zdGFja0RlcGVuZGVuY2llcyB3aXRoIHRoZSBsYXN0IHJlYXNvbicsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgJ0Bhd3MtY2RrL2NvcmU6c3RhY2tSZWxhdGl2ZUV4cG9ydHMnOiB0cnVlLFxuICAgICAgICBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnN0IHBhcmVudCA9IG5ldyBTdGFjayhhcHAsICdQYXJlbnQnKTtcbiAgICBjb25zdCBjaGlsZDEgPSBuZXcgU3RhY2socGFyZW50LCAnQ2hpbGQxJyk7XG4gICAgY29uc3QgY2hpbGRBID0gbmV3IFN0YWNrKHBhcmVudCwgJ0NoaWxkMicpO1xuICAgIGNvbnN0IHJlc291cmNlMSA9IG5ldyBDZm5SZXNvdXJjZShjaGlsZDEsICdSZXNvdXJjZTEnLCB7IHR5cGU6ICdSMScgfSk7XG4gICAgY29uc3QgcmVzb3VyY2UyID0gbmV3IENmblJlc291cmNlKGNoaWxkMSwgJ1Jlc291cmNlMicsIHsgdHlwZTogJ1IyJyB9KTtcbiAgICBjb25zdCByZXNvdXJjZUEgPSBuZXcgQ2ZuUmVzb3VyY2UoY2hpbGRBLCAnUmVzb3VyY2VBJywgeyB0eXBlOiAnUkEnIH0pO1xuXG4gICAgY2hpbGRBLl9hZGRBc3NlbWJseURlcGVuZGVuY3koY2hpbGQxLCB7IHNvdXJjZTogcmVzb3VyY2VBLCB0YXJnZXQ6IHJlc291cmNlMSB9KTtcbiAgICBjaGlsZEEuX2FkZEFzc2VtYmx5RGVwZW5kZW5jeShjaGlsZDEsIHsgc291cmNlOiByZXNvdXJjZUEsIHRhcmdldDogcmVzb3VyY2UyIH0pO1xuICAgIGNoaWxkQS5fcmVtb3ZlQXNzZW1ibHlEZXBlbmRlbmN5KGNoaWxkMSwgeyBzb3VyY2U6IHJlc291cmNlQSwgdGFyZ2V0OiByZXNvdXJjZTEgfSk7XG4gICAgY2hpbGRBLl9yZW1vdmVBc3NlbWJseURlcGVuZGVuY3koY2hpbGQxLCB7IHNvdXJjZTogcmVzb3VyY2VBLCB0YXJnZXQ6IHJlc291cmNlMiB9KTtcblxuICAgIGV4cGVjdChjaGlsZEEuX29idGFpbkFzc2VtYmx5RGVwZW5kZW5jaWVzKHsgc291cmNlOiBjaGlsZEEgfSkpLnRvRXF1YWwoW10pO1xuXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcblxuICAgIGV4cGVjdChhc3NlbWJseS5nZXRTdGFja0FydGlmYWN0KGNoaWxkMS5hcnRpZmFjdElkKS5kZXBlbmRlbmNpZXMubWFwKCh4OiB7IGlkOiBhbnk7IH0pID0+IHguaWQpKS50b0VxdWFsKFtdKTtcbiAgICBleHBlY3QoYXNzZW1ibHkuZ2V0U3RhY2tBcnRpZmFjdChjaGlsZEEuYXJ0aWZhY3RJZCkuZGVwZW5kZW5jaWVzLm1hcCgoeDogeyBpZDogYW55OyB9KSA9PiB4LmlkKSkudG9FcXVhbChbXSk7XG4gIH0pO1xuXG4gIHRlc3QoJ19yZW1vdmVBc3NlbWJseURlcGVuZGVuY3kgcmVtb3ZlcyBhIFN0YWNrRGVwZW5kZW5jeSB3aXRoIGRlZmF1bHQgcmVhc29uJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoe1xuICAgICAgY29udGV4dDoge1xuICAgICAgICAnQGF3cy1jZGsvY29yZTpzdGFja1JlbGF0aXZlRXhwb3J0cyc6IHRydWUsXG4gICAgICAgIFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3QgcGFyZW50ID0gbmV3IFN0YWNrKGFwcCwgJ1BhcmVudCcpO1xuICAgIGNvbnN0IGNoaWxkMSA9IG5ldyBTdGFjayhwYXJlbnQsICdDaGlsZDEnKTtcbiAgICBjb25zdCBjaGlsZEEgPSBuZXcgU3RhY2socGFyZW50LCAnQ2hpbGQyJyk7XG5cbiAgICBjaGlsZEEuX2FkZEFzc2VtYmx5RGVwZW5kZW5jeShjaGlsZDEpO1xuICAgIGNoaWxkQS5fcmVtb3ZlQXNzZW1ibHlEZXBlbmRlbmN5KGNoaWxkMSk7XG5cbiAgICBleHBlY3QoY2hpbGRBLl9vYnRhaW5Bc3NlbWJseURlcGVuZGVuY2llcyh7IHNvdXJjZTogY2hpbGRBIH0pKS50b0VxdWFsKFtdKTtcblxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG5cbiAgICBleHBlY3QoYXNzZW1ibHkuZ2V0U3RhY2tBcnRpZmFjdChjaGlsZDEuYXJ0aWZhY3RJZCkuZGVwZW5kZW5jaWVzLm1hcCgoeDogeyBpZDogYW55OyB9KSA9PiB4LmlkKSkudG9FcXVhbChbXSk7XG4gICAgZXhwZWN0KGFzc2VtYmx5LmdldFN0YWNrQXJ0aWZhY3QoY2hpbGRBLmFydGlmYWN0SWQpLmRlcGVuZGVuY2llcy5tYXAoKHg6IHsgaWQ6IGFueTsgfSkgPT4geC5pZCkpLnRvRXF1YWwoW10pO1xuICB9KTtcblxuICB0ZXN0KCdfcmVtb3ZlQXNzZW1ibHlEZXBlbmRlbmN5IHJhaXNlcyBhbiBlcnJvciBmb3IgbmVzdGVkIHN0YWNrcycsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgJ0Bhd3MtY2RrL2NvcmU6c3RhY2tSZWxhdGl2ZUV4cG9ydHMnOiB0cnVlLFxuICAgICAgICBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnN0IHBhcmVudCA9IG5ldyBTdGFjayhhcHAsICdQYXJlbnQnKTtcbiAgICBjb25zdCBjaGlsZDEgPSBuZXcgTmVzdGVkU3RhY2socGFyZW50LCAnQ2hpbGQxJyk7XG4gICAgY29uc3QgY2hpbGRBID0gbmV3IE5lc3RlZFN0YWNrKHBhcmVudCwgJ0NoaWxkMicpO1xuXG4gICAgZXhwZWN0KCgpID0+IGNoaWxkQS5fcmVtb3ZlQXNzZW1ibHlEZXBlbmRlbmN5KGNoaWxkMSkpLnRvVGhyb3coJ1RoZXJlIGNhbm5vdCBiZSBhc3NlbWJseS1sZXZlbCcpO1xuICB9KTtcblxuICB0ZXN0KCdfcmVtb3ZlQXNzZW1ibHlEZXBlbmRlbmN5IGhhbmRsZXMgYSBub24tbWF0Y2hpbmcgZGVwZW5kZW5jeSByZWFzb24nLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7XG4gICAgICBjb250ZXh0OiB7XG4gICAgICAgICdAYXdzLWNkay9jb3JlOnN0YWNrUmVsYXRpdmVFeHBvcnRzJzogdHJ1ZSxcbiAgICAgICAgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBwYXJlbnQgPSBuZXcgU3RhY2soYXBwLCAnUGFyZW50Jyk7XG4gICAgY29uc3QgY2hpbGQxID0gbmV3IFN0YWNrKHBhcmVudCwgJ0NoaWxkMScpO1xuICAgIGNvbnN0IGNoaWxkQSA9IG5ldyBTdGFjayhwYXJlbnQsICdDaGlsZDInKTtcbiAgICBjb25zdCByZXNvdXJjZTEgPSBuZXcgQ2ZuUmVzb3VyY2UoY2hpbGQxLCAnUmVzb3VyY2UxJywgeyB0eXBlOiAnUjEnIH0pO1xuICAgIGNvbnN0IHJlc291cmNlQSA9IG5ldyBDZm5SZXNvdXJjZShjaGlsZEEsICdSZXNvdXJjZUEnLCB7IHR5cGU6ICdSQScgfSk7XG5cbiAgICBjaGlsZEEuX2FkZEFzc2VtYmx5RGVwZW5kZW5jeShjaGlsZDEpO1xuICAgIGNoaWxkQS5fcmVtb3ZlQXNzZW1ibHlEZXBlbmRlbmN5KGNoaWxkMSwgeyBzb3VyY2U6IHJlc291cmNlQSwgdGFyZ2V0OiByZXNvdXJjZTEgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2F1dG9tYXRpYyBjcm9zcy1zdGFjayByZWZlcmVuY2VzIGFuZCBtYW51YWwgZXhwb3J0cyBsb29rIHRoZSBzYW1lJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOOiBhdXRvbWF0aWNcbiAgICBjb25zdCBhcHBBID0gbmV3IEFwcCh7IGNvbnRleHQ6IHsgJ0Bhd3MtY2RrL2NvcmU6c3RhY2tSZWxhdGl2ZUV4cG9ydHMnOiB0cnVlIH0gfSk7XG4gICAgY29uc3QgcHJvZHVjZXJBID0gbmV3IFN0YWNrKGFwcEEsICdQcm9kdWNlcicpO1xuICAgIGNvbnN0IGNvbnN1bWVyQSA9IG5ldyBTdGFjayhhcHBBLCAnQ29uc3VtZXInKTtcbiAgICBjb25zdCByZXNvdXJjZUEgPSBuZXcgQ2ZuUmVzb3VyY2UocHJvZHVjZXJBLCAnUmVzb3VyY2UnLCB7IHR5cGU6ICdBV1M6OlJlc291cmNlJyB9KTtcbiAgICBuZXcgQ2ZuT3V0cHV0KGNvbnN1bWVyQSwgJ1NvbWVPdXRwdXQnLCB7IHZhbHVlOiBgJHtyZXNvdXJjZUEuZ2V0QXR0KCdBdHQnKX1gIH0pO1xuXG4gICAgLy8gR0lWRU46IG1hbnVhbFxuICAgIGNvbnN0IGFwcE0gPSBuZXcgQXBwKCk7XG4gICAgY29uc3QgcHJvZHVjZXJNID0gbmV3IFN0YWNrKGFwcE0sICdQcm9kdWNlcicpO1xuICAgIGNvbnN0IHJlc291cmNlTSA9IG5ldyBDZm5SZXNvdXJjZShwcm9kdWNlck0sICdSZXNvdXJjZScsIHsgdHlwZTogJ0FXUzo6UmVzb3VyY2UnIH0pO1xuICAgIHByb2R1Y2VyTS5leHBvcnRWYWx1ZShyZXNvdXJjZU0uZ2V0QXR0KCdBdHQnKSk7XG5cbiAgICAvLyBUSEVOIC0gcHJvZHVjZXJzIGFyZSB0aGUgc2FtZVxuICAgIGNvbnN0IHRlbXBsYXRlQSA9IGFwcEEuc3ludGgoKS5nZXRTdGFja0J5TmFtZShwcm9kdWNlckEuc3RhY2tOYW1lKS50ZW1wbGF0ZTtcbiAgICBjb25zdCB0ZW1wbGF0ZU0gPSBhcHBNLnN5bnRoKCkuZ2V0U3RhY2tCeU5hbWUocHJvZHVjZXJNLnN0YWNrTmFtZSkudGVtcGxhdGU7XG5cbiAgICBleHBlY3QodGVtcGxhdGVBKS50b0VxdWFsKHRlbXBsYXRlTSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2F1dG9tYXRpYyBjcm9zcy1zdGFjayByZWZlcmVuY2VzIGFuZCBtYW51YWwgbGlzdCBleHBvcnRzIGxvb2sgdGhlIHNhbWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU46IGF1dG9tYXRpY1xuICAgIGNvbnN0IGFwcEEgPSBuZXcgQXBwKHsgY29udGV4dDogeyAnQGF3cy1jZGsvY29yZTpzdGFja1JlbGF0aXZlRXhwb3J0cyc6IHRydWUgfSB9KTtcbiAgICBjb25zdCBwcm9kdWNlckEgPSBuZXcgU3RhY2soYXBwQSwgJ1Byb2R1Y2VyJyk7XG4gICAgY29uc3QgY29uc3VtZXJBID0gbmV3IFN0YWNrKGFwcEEsICdDb25zdW1lcicpO1xuICAgIGNvbnN0IHJlc291cmNlQSA9IG5ldyBDZm5SZXNvdXJjZShwcm9kdWNlckEsICdSZXNvdXJjZScsIHsgdHlwZTogJ0FXUzo6UmVzb3VyY2UnIH0pO1xuICAgIChyZXNvdXJjZUEgYXMgYW55KS5hdHRyQXR0ID0gWydGb28nLCAnQmFyJ107XG4gICAgbmV3IENmbk91dHB1dChjb25zdW1lckEsICdTb21lT3V0cHV0JywgeyB2YWx1ZTogYCR7cmVzb3VyY2VBLmdldEF0dCgnQXR0JywgUmVzb2x1dGlvblR5cGVIaW50LlNUUklOR19MSVNUKX1gIH0pO1xuXG4gICAgLy8gR0lWRU46IG1hbnVhbFxuICAgIGNvbnN0IGFwcE0gPSBuZXcgQXBwKCk7XG4gICAgY29uc3QgcHJvZHVjZXJNID0gbmV3IFN0YWNrKGFwcE0sICdQcm9kdWNlcicpO1xuICAgIGNvbnN0IHJlc291cmNlTSA9IG5ldyBDZm5SZXNvdXJjZShwcm9kdWNlck0sICdSZXNvdXJjZScsIHsgdHlwZTogJ0FXUzo6UmVzb3VyY2UnIH0pO1xuICAgIChyZXNvdXJjZU0gYXMgYW55KS5hdHRyQXR0ID0gWydGb28nLCAnQmFyJ107XG4gICAgcHJvZHVjZXJNLmV4cG9ydFN0cmluZ0xpc3RWYWx1ZShyZXNvdXJjZU0uZ2V0QXR0KCdBdHQnLCBSZXNvbHV0aW9uVHlwZUhpbnQuU1RSSU5HX0xJU1QpKTtcblxuICAgIC8vIFRIRU4gLSBwcm9kdWNlcnMgYXJlIHRoZSBzYW1lXG4gICAgY29uc3QgdGVtcGxhdGVBID0gYXBwQS5zeW50aCgpLmdldFN0YWNrQnlOYW1lKHByb2R1Y2VyQS5zdGFja05hbWUpLnRlbXBsYXRlO1xuICAgIGNvbnN0IHRlbXBsYXRlTSA9IGFwcE0uc3ludGgoKS5nZXRTdGFja0J5TmFtZShwcm9kdWNlck0uc3RhY2tOYW1lKS50ZW1wbGF0ZTtcblxuICAgIGV4cGVjdCh0ZW1wbGF0ZUEpLnRvRXF1YWwodGVtcGxhdGVNKTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3cgZXJyb3IgaWYgb3ZlcnJpZGVMb2dpY2FsSWQgaXMgdXNlZCBhbmQgbG9naWNhbElkIGlzIGxvY2tlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTjogbWFudWFsXG4gICAgY29uc3QgYXBwTSA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBwcm9kdWNlck0gPSBuZXcgU3RhY2soYXBwTSwgJ1Byb2R1Y2VyJyk7XG4gICAgY29uc3QgcmVzb3VyY2VNID0gbmV3IENmblJlc291cmNlKHByb2R1Y2VyTSwgJ1Jlc291cmNlWFhYJywgeyB0eXBlOiAnQVdTOjpSZXNvdXJjZScgfSk7XG4gICAgcHJvZHVjZXJNLmV4cG9ydFZhbHVlKHJlc291cmNlTS5nZXRBdHQoJ0F0dCcpKTtcblxuICAgIC8vIFRIRU4gLSBwcm9kdWNlcnMgYXJlIHRoZSBzYW1lXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIHJlc291cmNlTS5vdmVycmlkZUxvZ2ljYWxJZCgnT1ZFUlJJREVfTE9HSUNBTF9JRCcpO1xuICAgIH0pLnRvVGhyb3coL1RoZSBsb2dpY2FsSWQgZm9yIHJlc291cmNlIGF0IHBhdGggUHJvZHVjZXJcXC9SZXNvdXJjZVhYWCBoYXMgYmVlbiBsb2NrZWQgYW5kIGNhbm5vdCBiZSBvdmVycmlkZGVuLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RvIG5vdCB0aHJvdyBlcnJvciBpZiBvdmVycmlkZUxvZ2ljYWxJZCBpcyB1c2VkIGFuZCBsb2dpY2FsSWQgaXMgbm90IGxvY2tlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTjogbWFudWFsXG4gICAgY29uc3QgYXBwTSA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBwcm9kdWNlck0gPSBuZXcgU3RhY2soYXBwTSwgJ1Byb2R1Y2VyJyk7XG4gICAgY29uc3QgcmVzb3VyY2VNID0gbmV3IENmblJlc291cmNlKHByb2R1Y2VyTSwgJ1Jlc291cmNlWFhYJywgeyB0eXBlOiAnQVdTOjpSZXNvdXJjZScgfSk7XG5cbiAgICAvLyBUSEVOIC0gcHJvZHVjZXJzIGFyZSB0aGUgc2FtZVxuICAgIHJlc291cmNlTS5vdmVycmlkZUxvZ2ljYWxJZCgnT1ZFUlJJREVfTE9HSUNBTF9JRCcpO1xuICAgIHByb2R1Y2VyTS5leHBvcnRWYWx1ZShyZXNvdXJjZU0uZ2V0QXR0KCdBdHQnKSk7XG5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IGFwcE0uc3ludGgoKS5nZXRTdGFja0J5TmFtZShwcm9kdWNlck0uc3RhY2tOYW1lKS50ZW1wbGF0ZTtcbiAgICBleHBlY3QodGVtcGxhdGUpLnRvTWF0Y2hPYmplY3Qoe1xuICAgICAgT3V0cHV0czoge1xuICAgICAgICBFeHBvcnRzT3V0cHV0Rm5HZXRBdHRPVkVSUklERUxPR0lDQUxJREF0dDJERDI4MDE5OiB7XG4gICAgICAgICAgRXhwb3J0OiB7XG4gICAgICAgICAgICBOYW1lOiAnUHJvZHVjZXI6RXhwb3J0c091dHB1dEZuR2V0QXR0T1ZFUlJJREVMT0dJQ0FMSURBdHQyREQyODAxOScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBWYWx1ZToge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdPVkVSUklERV9MT0dJQ0FMX0lEJyxcbiAgICAgICAgICAgICAgJ0F0dCcsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIE9WRVJSSURFX0xPR0lDQUxfSUQ6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpSZXNvdXJjZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhdXRvbWF0aWMgY3Jvc3Mtc3RhY2sgcmVmZXJlbmNlcyBhbmQgbWFudWFsIGV4cG9ydHMgbG9vayB0aGUgc2FtZTogbmVzdGVkIHN0YWNrIGVkaXRpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU46IGF1dG9tYXRpY1xuICAgIGNvbnN0IGFwcEEgPSBuZXcgQXBwKCk7XG4gICAgY29uc3QgcHJvZHVjZXJBID0gbmV3IFN0YWNrKGFwcEEsICdQcm9kdWNlcicpO1xuICAgIGNvbnN0IG5lc3RlZEEgPSBuZXcgTmVzdGVkU3RhY2socHJvZHVjZXJBLCAnTmVzdG9yJyk7XG4gICAgY29uc3QgcmVzb3VyY2VBID0gbmV3IENmblJlc291cmNlKG5lc3RlZEEsICdSZXNvdXJjZScsIHsgdHlwZTogJ0FXUzo6UmVzb3VyY2UnIH0pO1xuXG4gICAgY29uc3QgY29uc3VtZXJBID0gbmV3IFN0YWNrKGFwcEEsICdDb25zdW1lcicpO1xuICAgIG5ldyBDZm5PdXRwdXQoY29uc3VtZXJBLCAnU29tZU91dHB1dCcsIHsgdmFsdWU6IGAke3Jlc291cmNlQS5nZXRBdHQoJ0F0dCcpfWAgfSk7XG5cbiAgICAvLyBHSVZFTjogbWFudWFsXG4gICAgY29uc3QgYXBwTSA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBwcm9kdWNlck0gPSBuZXcgU3RhY2soYXBwTSwgJ1Byb2R1Y2VyJyk7XG4gICAgY29uc3QgbmVzdGVkTSA9IG5ldyBOZXN0ZWRTdGFjayhwcm9kdWNlck0sICdOZXN0b3InKTtcbiAgICBjb25zdCByZXNvdXJjZU0gPSBuZXcgQ2ZuUmVzb3VyY2UobmVzdGVkTSwgJ1Jlc291cmNlJywgeyB0eXBlOiAnQVdTOjpSZXNvdXJjZScgfSk7XG4gICAgcHJvZHVjZXJNLmV4cG9ydFZhbHVlKHJlc291cmNlTS5nZXRBdHQoJ0F0dCcpKTtcblxuICAgIC8vIFRIRU4gLSBwcm9kdWNlcnMgYXJlIHRoZSBzYW1lXG4gICAgY29uc3QgdGVtcGxhdGVBID0gYXBwQS5zeW50aCgpLmdldFN0YWNrQnlOYW1lKHByb2R1Y2VyQS5zdGFja05hbWUpLnRlbXBsYXRlO1xuICAgIGNvbnN0IHRlbXBsYXRlTSA9IGFwcE0uc3ludGgoKS5nZXRTdGFja0J5TmFtZShwcm9kdWNlck0uc3RhY2tOYW1lKS50ZW1wbGF0ZTtcblxuICAgIGV4cGVjdCh0ZW1wbGF0ZUEpLnRvRXF1YWwodGVtcGxhdGVNKTtcbiAgfSk7XG5cbiAgdGVzdCgnbWFudWFsIGV4cG9ydHMgcmVxdWlyZSBhIG5hbWUgaWYgbm90IHN1cHBseWluZyBhIHJlc291cmNlIGF0dHJpYnV0ZScsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2snKTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBzdGFjay5leHBvcnRWYWx1ZSgnc29tZVZhbHVlJyk7XG4gICAgfSkudG9UaHJvdygvb3IgbWFrZSBzdXJlIHRvIGV4cG9ydCBhIHJlc291cmNlIGF0dHJpYnV0ZS8pO1xuICB9KTtcblxuICB0ZXN0KCdtYW51YWwgbGlzdCBleHBvcnRzIHJlcXVpcmUgYSBuYW1lIGlmIG5vdCBzdXBwbHlpbmcgYSByZXNvdXJjZSBhdHRyaWJ1dGUnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrJyk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgc3RhY2suZXhwb3J0U3RyaW5nTGlzdFZhbHVlKFsnc29tZVZhbHVlJ10pO1xuICAgIH0pLnRvVGhyb3coL29yIG1ha2Ugc3VyZSB0byBleHBvcnQgYSByZXNvdXJjZSBhdHRyaWJ1dGUvKTtcbiAgfSk7XG5cbiAgdGVzdCgnbWFudWFsIGV4cG9ydHMgY2FuIGFsc28ganVzdCBiZSB1c2VkIHRvIGNyZWF0ZSBhbiBleHBvcnQgb2YgYW55dGhpbmcnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrJyk7XG5cbiAgICBjb25zdCBpbXBvcnRWID0gc3RhY2suZXhwb3J0VmFsdWUoJ3NvbWVWYWx1ZScsIHsgbmFtZTogJ015RXhwb3J0JyB9KTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGltcG9ydFYpKS50b0VxdWFsKHsgJ0ZuOjpJbXBvcnRWYWx1ZSc6ICdNeUV4cG9ydCcgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ21hbnVhbCBsaXN0IGV4cG9ydHMgY2FuIGFsc28ganVzdCBiZSB1c2VkIHRvIGNyZWF0ZSBhbiBleHBvcnQgb2YgYW55dGhpbmcnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrJyk7XG5cbiAgICBjb25zdCBpbXBvcnRWID0gc3RhY2suZXhwb3J0U3RyaW5nTGlzdFZhbHVlKFsnc29tZVZhbHVlJywgJ2Fub3RoZXJWYWx1ZSddLCB7IG5hbWU6ICdNeUV4cG9ydCcgfSk7XG5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShpbXBvcnRWKSkudG9FcXVhbChcbiAgICAgIHtcbiAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAnfHwnLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdGbjo6SW1wb3J0VmFsdWUnOiAnTXlFeHBvcnQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICk7XG5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IGFwcC5zeW50aCgpLmdldFN0YWNrQnlOYW1lKHN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGU7XG5cbiAgICBleHBlY3QodGVtcGxhdGUpLnRvTWF0Y2hPYmplY3Qoe1xuICAgICAgT3V0cHV0czoge1xuICAgICAgICBFeHBvcnRNeUV4cG9ydDoge1xuICAgICAgICAgIFZhbHVlOiAnc29tZVZhbHVlfHxhbm90aGVyVmFsdWUnLFxuICAgICAgICAgIEV4cG9ydDoge1xuICAgICAgICAgICAgTmFtZTogJ015RXhwb3J0JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQ2ZuU3ludGhlc2lzRXJyb3IgaXMgaWdub3JlZCB3aGVuIHByZXBhcmluZyBjcm9zcyByZWZlcmVuY2VzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ215LXN0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY2xhc3MgQ2ZuVGVzdCBleHRlbmRzIENmblJlc291cmNlIHtcbiAgICAgIHB1YmxpYyBfdG9DbG91ZEZvcm1hdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb3N0UmVzb2x2ZVRva2VuKHtcbiAgICAgICAgICB4b286IDEyMzQsXG4gICAgICAgIH0sIHByb3BzID0+IHtcbiAgICAgICAgICB2YWxpZGF0ZVN0cmluZyhwcm9wcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBuZXcgQ2ZuVGVzdChzdGFjaywgJ015VGhpbmcnLCB7IHR5cGU6ICdBV1M6OlR5cGUnIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIHJlc29sdmVSZWZlcmVuY2VzKGFwcCk7XG4gIH0pO1xuXG4gIHRlc3QoJ1N0YWNrcyBjYW4gYmUgY2hpbGRyZW4gb2Ygb3RoZXIgc3RhY2tzIChzdWJzdGFjaykgYW5kIHRoZXkgd2lsbCBiZSBzeW50aGVzaXplZCBzZXBhcmF0ZWx5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHBhcmVudFN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ3BhcmVudCcpO1xuICAgIGNvbnN0IGNoaWxkU3RhY2sgPSBuZXcgU3RhY2socGFyZW50U3RhY2ssICdjaGlsZCcpO1xuICAgIG5ldyBDZm5SZXNvdXJjZShwYXJlbnRTdGFjaywgJ015UGFyZW50UmVzb3VyY2UnLCB7IHR5cGU6ICdSZXNvdXJjZTo6UGFyZW50JyB9KTtcbiAgICBuZXcgQ2ZuUmVzb3VyY2UoY2hpbGRTdGFjaywgJ015Q2hpbGRSZXNvdXJjZScsIHsgdHlwZTogJ1Jlc291cmNlOjpDaGlsZCcgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBleHBlY3QoYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUocGFyZW50U3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZT8uUmVzb3VyY2VzKS50b0VxdWFsKHsgTXlQYXJlbnRSZXNvdXJjZTogeyBUeXBlOiAnUmVzb3VyY2U6OlBhcmVudCcgfSB9KTtcbiAgICBleHBlY3QoYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoY2hpbGRTdGFjay5zdGFja05hbWUpLnRlbXBsYXRlPy5SZXNvdXJjZXMpLnRvRXF1YWwoeyBNeUNoaWxkUmVzb3VyY2U6IHsgVHlwZTogJ1Jlc291cmNlOjpDaGlsZCcgfSB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnTmVzdGVkIFN0YWNrcyBhcmUgc3ludGhlc2l6ZWQgd2l0aCBERVNUUk9ZIHBvbGljeScsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcGFyZW50U3RhY2sgPSBuZXcgU3RhY2soYXBwLCAncGFyZW50Jyk7XG4gICAgY29uc3QgY2hpbGRTdGFjayA9IG5ldyBOZXN0ZWRTdGFjayhwYXJlbnRTdGFjaywgJ2NoaWxkJyk7XG4gICAgbmV3IENmblJlc291cmNlKGNoaWxkU3RhY2ssICdDaGlsZFJlc291cmNlJywgeyB0eXBlOiAnUmVzb3VyY2U6OkNoaWxkJyB9KTtcblxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgZXhwZWN0KGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHBhcmVudFN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGUpLnRvRXF1YWwoZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIGNoaWxkTmVzdGVkU3RhY2tjaGlsZE5lc3RlZFN0YWNrUmVzb3VyY2U3NDA4RDAzRjogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIFR5cGU6ICdBV1M6OkNsb3VkRm9ybWF0aW9uOjpTdGFjaycsXG4gICAgICAgICAgRGVsZXRpb25Qb2xpY3k6ICdEZWxldGUnLFxuICAgICAgICB9KSxcbiAgICAgIH0sXG4gICAgfSkpO1xuICB9KTtcblxuICB0ZXN0KCdhc3NldCBtZXRhZGF0YSBhZGRlZCB0byBOZXN0ZWRTdGFjayByZXNvdXJjZSB0aGF0IGNvbnRhaW5zIGFzc2V0IHBhdGggYW5kIHByb3BlcnR5JywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBwYXJlbnRTdGFjayA9IG5ldyBTdGFjayhhcHAsICdwYXJlbnQnKTtcbiAgICBwYXJlbnRTdGFjay5ub2RlLnNldENvbnRleHQoY3hhcGkuQVNTRVRfUkVTT1VSQ0VfTUVUQURBVEFfRU5BQkxFRF9DT05URVhULCB0cnVlKTtcbiAgICBjb25zdCBjaGlsZFN0YWNrID0gbmV3IE5lc3RlZFN0YWNrKHBhcmVudFN0YWNrLCAnY2hpbGQnKTtcbiAgICBuZXcgQ2ZuUmVzb3VyY2UoY2hpbGRTdGFjaywgJ0NoaWxkUmVzb3VyY2UnLCB7IHR5cGU6ICdSZXNvdXJjZTo6Q2hpbGQnIH0pO1xuXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBleHBlY3QoYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUocGFyZW50U3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZSkudG9FcXVhbChleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgY2hpbGROZXN0ZWRTdGFja2NoaWxkTmVzdGVkU3RhY2tSZXNvdXJjZTc0MDhEMDNGOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgTWV0YWRhdGE6IHtcbiAgICAgICAgICAgICdhd3M6YXNzZXQ6cGF0aCc6ICdwYXJlbnRjaGlsZDEzRjkzNTlCLm5lc3RlZC50ZW1wbGF0ZS5qc29uJyxcbiAgICAgICAgICAgICdhd3M6YXNzZXQ6cHJvcGVydHknOiAnVGVtcGxhdGVVUkwnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgfSxcbiAgICB9KSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Nyb3NzLXN0YWNrIHJlZmVyZW5jZSAoc3Vic3RhY2sgcmVmZXJlbmNlcyBwYXJlbnQgc3RhY2spJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7IGNvbnRleHQ6IHsgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlIH0gfSk7XG4gICAgY29uc3QgcGFyZW50U3RhY2sgPSBuZXcgU3RhY2soYXBwLCAncGFyZW50Jyk7XG4gICAgY29uc3QgY2hpbGRTdGFjayA9IG5ldyBTdGFjayhwYXJlbnRTdGFjaywgJ2NoaWxkJyk7XG5cbiAgICAvLyBXSEVOIChhIHJlc291cmNlIGZyb20gdGhlIGNoaWxkIHN0YWNrIHJlZmVyZW5jZXMgYSByZXNvdXJjZSBmcm9tIHRoZSBwYXJlbnQgc3RhY2spXG4gICAgY29uc3QgcGFyZW50UmVzb3VyY2UgPSBuZXcgQ2ZuUmVzb3VyY2UocGFyZW50U3RhY2ssICdNeVBhcmVudFJlc291cmNlJywgeyB0eXBlOiAnUmVzb3VyY2U6OlBhcmVudCcgfSk7XG4gICAgbmV3IENmblJlc291cmNlKGNoaWxkU3RhY2ssICdNeUNoaWxkUmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnUmVzb3VyY2U6OkNoaWxkJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgQ2hpbGRQcm9wOiBwYXJlbnRSZXNvdXJjZS5nZXRBdHQoJ0F0dE9mUGFyZW50UmVzb3VyY2UnKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBleHBlY3QoYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUocGFyZW50U3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZSkudG9FcXVhbCh7XG4gICAgICBSZXNvdXJjZXM6IHsgTXlQYXJlbnRSZXNvdXJjZTogeyBUeXBlOiAnUmVzb3VyY2U6OlBhcmVudCcgfSB9LFxuICAgICAgT3V0cHV0czoge1xuICAgICAgICBFeHBvcnRzT3V0cHV0Rm5HZXRBdHRNeVBhcmVudFJlc291cmNlQXR0T2ZQYXJlbnRSZXNvdXJjZUMyRDBCQjlFOiB7XG4gICAgICAgICAgVmFsdWU6IHsgJ0ZuOjpHZXRBdHQnOiBbJ015UGFyZW50UmVzb3VyY2UnLCAnQXR0T2ZQYXJlbnRSZXNvdXJjZSddIH0sXG4gICAgICAgICAgRXhwb3J0OiB7IE5hbWU6ICdwYXJlbnQ6RXhwb3J0c091dHB1dEZuR2V0QXR0TXlQYXJlbnRSZXNvdXJjZUF0dE9mUGFyZW50UmVzb3VyY2VDMkQwQkI5RScgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgZXhwZWN0KGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKGNoaWxkU3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZSkudG9FcXVhbCh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgTXlDaGlsZFJlc291cmNlOiB7XG4gICAgICAgICAgVHlwZTogJ1Jlc291cmNlOjpDaGlsZCcsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgQ2hpbGRQcm9wOiB7XG4gICAgICAgICAgICAgICdGbjo6SW1wb3J0VmFsdWUnOiAncGFyZW50OkV4cG9ydHNPdXRwdXRGbkdldEF0dE15UGFyZW50UmVzb3VyY2VBdHRPZlBhcmVudFJlc291cmNlQzJEMEJCOUUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3Jvc3Mtc3RhY2sgcmVmZXJlbmNlIChwYXJlbnQgc3RhY2sgcmVmZXJlbmNlcyBzdWJzdGFjayknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgJ0Bhd3MtY2RrL2NvcmU6c3RhY2tSZWxhdGl2ZUV4cG9ydHMnOiB0cnVlLFxuICAgICAgICBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgcGFyZW50U3RhY2sgPSBuZXcgU3RhY2soYXBwLCAncGFyZW50Jyk7XG4gICAgY29uc3QgY2hpbGRTdGFjayA9IG5ldyBTdGFjayhwYXJlbnRTdGFjaywgJ2NoaWxkJyk7XG5cbiAgICAvLyBXSEVOIChhIHJlc291cmNlIGZyb20gdGhlIGNoaWxkIHN0YWNrIHJlZmVyZW5jZXMgYSByZXNvdXJjZSBmcm9tIHRoZSBwYXJlbnQgc3RhY2spXG4gICAgY29uc3QgY2hpbGRSZXNvdXJjZSA9IG5ldyBDZm5SZXNvdXJjZShjaGlsZFN0YWNrLCAnTXlDaGlsZFJlc291cmNlJywgeyB0eXBlOiAnUmVzb3VyY2U6OkNoaWxkJyB9KTtcbiAgICBuZXcgQ2ZuUmVzb3VyY2UocGFyZW50U3RhY2ssICdNeVBhcmVudFJlc291cmNlJywge1xuICAgICAgdHlwZTogJ1Jlc291cmNlOjpQYXJlbnQnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBQYXJlbnRQcm9wOiBjaGlsZFJlc291cmNlLmdldEF0dCgnQXR0cmlidXRlT2ZDaGlsZFJlc291cmNlJyksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgZXhwZWN0KGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHBhcmVudFN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGUpLnRvRXF1YWwoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIE15UGFyZW50UmVzb3VyY2U6IHtcbiAgICAgICAgICBUeXBlOiAnUmVzb3VyY2U6OlBhcmVudCcsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgUGFyZW50UHJvcDogeyAnRm46OkltcG9ydFZhbHVlJzogJ3BhcmVudGNoaWxkMTNGOTM1OUI6RXhwb3J0c091dHB1dEZuR2V0QXR0TXlDaGlsZFJlc291cmNlQXR0cmlidXRlT2ZDaGlsZFJlc291cmNlNTI4MTMyNjQnIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBleHBlY3QoYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoY2hpbGRTdGFjay5zdGFja05hbWUpLnRlbXBsYXRlKS50b0VxdWFsKHtcbiAgICAgIFJlc291cmNlczogeyBNeUNoaWxkUmVzb3VyY2U6IHsgVHlwZTogJ1Jlc291cmNlOjpDaGlsZCcgfSB9LFxuICAgICAgT3V0cHV0czoge1xuICAgICAgICBFeHBvcnRzT3V0cHV0Rm5HZXRBdHRNeUNoaWxkUmVzb3VyY2VBdHRyaWJ1dGVPZkNoaWxkUmVzb3VyY2U1MjgxMzI2NDoge1xuICAgICAgICAgIFZhbHVlOiB7ICdGbjo6R2V0QXR0JzogWydNeUNoaWxkUmVzb3VyY2UnLCAnQXR0cmlidXRlT2ZDaGlsZFJlc291cmNlJ10gfSxcbiAgICAgICAgICBFeHBvcnQ6IHsgTmFtZTogJ3BhcmVudGNoaWxkMTNGOTM1OUI6RXhwb3J0c091dHB1dEZuR2V0QXR0TXlDaGlsZFJlc291cmNlQXR0cmlidXRlT2ZDaGlsZFJlc291cmNlNTI4MTMyNjQnIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW5ub3QgY3JlYXRlIGN5Y2xpYyByZWZlcmVuY2UgYmV0d2VlbiBzdGFja3MnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMScpO1xuICAgIGNvbnN0IGFjY291bnQxID0gbmV3IFNjb3BlZEF3cyhzdGFjazEpLmFjY291bnRJZDtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJyk7XG4gICAgY29uc3QgYWNjb3VudDIgPSBuZXcgU2NvcGVkQXdzKHN0YWNrMikuYWNjb3VudElkO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBDZm5QYXJhbWV0ZXIoc3RhY2syLCAnU29tZVBhcmFtZXRlcicsIHsgdHlwZTogJ1N0cmluZycsIGRlZmF1bHQ6IGFjY291bnQxIH0pO1xuICAgIG5ldyBDZm5QYXJhbWV0ZXIoc3RhY2sxLCAnU29tZVBhcmFtZXRlcicsIHsgdHlwZTogJ1N0cmluZycsIGRlZmF1bHQ6IGFjY291bnQyIH0pO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGFwcC5zeW50aCgpO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICB9KS50b1Rocm93KFwiJ1N0YWNrMScgZGVwZW5kcyBvbiAnU3RhY2syJyAoU3RhY2sxIC0+IFN0YWNrMi5BV1M6OkFjY291bnRJZCkuIEFkZGluZyB0aGlzIGRlcGVuZGVuY3kgKFN0YWNrMiAtPiBTdGFjazEuQVdTOjpBY2NvdW50SWQpIHdvdWxkIGNyZWF0ZSBhIGN5Y2xpYyByZWZlcmVuY2UuXCIpO1xuICB9KTtcblxuICB0ZXN0KCdzdGFja3Mga25vdyBhYm91dCB0aGVpciBkZXBlbmRlbmNpZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMScpO1xuICAgIGNvbnN0IGFjY291bnQxID0gbmV3IFNjb3BlZEF3cyhzdGFjazEpLmFjY291bnRJZDtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IENmblBhcmFtZXRlcihzdGFjazIsICdTb21lUGFyYW1ldGVyJywgeyB0eXBlOiAnU3RyaW5nJywgZGVmYXVsdDogYWNjb3VudDEgfSk7XG5cbiAgICBhcHAuc3ludGgoKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2syLmRlcGVuZGVuY2llcy5tYXAocyA9PiBzLm5vZGUuaWQpKS50b0VxdWFsKFsnU3RhY2sxJ10pO1xuICB9KTtcblxuICB0ZXN0KCdjYW5ub3QgY3JlYXRlIHJlZmVyZW5jZXMgdG8gc3RhY2tzIGluIG90aGVyIGFjY291bnRzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdTdGFjazEnLCB7IGVudjogeyBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJywgcmVnaW9uOiAnZXMtbm9yc3QtMScgfSB9KTtcbiAgICBjb25zdCBhY2NvdW50MSA9IG5ldyBTY29wZWRBd3Moc3RhY2sxKS5hY2NvdW50SWQ7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMicsIHsgZW52OiB7IGFjY291bnQ6ICcxMTExMTExMTExMScsIHJlZ2lvbjogJ2VzLW5vcnN0LTInIH0gfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IENmblBhcmFtZXRlcihzdGFjazIsICdTb21lUGFyYW1ldGVyJywgeyB0eXBlOiAnU3RyaW5nJywgZGVmYXVsdDogYWNjb3VudDEgfSk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgYXBwLnN5bnRoKCk7XG4gICAgfSkudG9UaHJvdygvU3RhY2sgXCJTdGFjazJcIiBjYW5ub3QgcmVmZXJlbmNlIFteIF0rIGluIHN0YWNrIFwiU3RhY2sxXCIvKTtcbiAgfSk7XG5cbiAgdGVzdCgndXJsU3VmZml4IGRvZXMgbm90IGltcGx5IGEgc3RhY2sgZGVwZW5kZW5jeScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBmaXJzdCA9IG5ldyBTdGFjayhhcHAsICdGaXJzdCcpO1xuICAgIGNvbnN0IHNlY29uZCA9IG5ldyBTdGFjayhhcHAsICdTZWNvbmQnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQ2ZuT3V0cHV0KHNlY29uZCwgJ091dHB1dCcsIHtcbiAgICAgIHZhbHVlOiBmaXJzdC51cmxTdWZmaXgsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgYXBwLnN5bnRoKCk7XG5cbiAgICBleHBlY3Qoc2Vjb25kLmRlcGVuZGVuY2llcy5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N0YWNrIHdpdGggcmVnaW9uIHN1cHBsaWVkIHZpYSBwcm9wcyByZXR1cm5zIGxpdGVyYWwgdmFsdWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2sxJywgeyBlbnY6IHsgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsIHJlZ2lvbjogJ2VzLW5vcnN0LTEnIH0gfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc3RhY2sucmVnaW9uKSkudG9FcXVhbCgnZXMtbm9yc3QtMScpO1xuICB9KTtcblxuICBkZXNjcmliZSgnc3RhY2sgcGFydGl0aW9uIGxpdGVyYWwgZmVhdHVyZSBmbGFnJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgZmVhdHVyZUZsYWcgPSB7IFtjeGFwaS5FTkFCTEVfUEFSVElUSU9OX0xJVEVSQUxTXTogdHJ1ZSB9O1xuICAgIGNvbnN0IGVudkZvclJlZ2lvbiA9IChyZWdpb246IHN0cmluZykgPT4geyByZXR1cm4geyBlbnY6IHsgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsIHJlZ2lvbjogcmVnaW9uIH0gfTsgfTtcblxuICAgIC8vIFRIRU5cbiAgICBkZXNjcmliZSgnZG9lcyBub3QgY2hhbmdlIG1pc3Npbmcgb3IgdW5rbm93biByZWdpb24gYmVoYXZpb3JzJywgKCkgPT4ge1xuICAgICAgdGVzdCgnc3RhY2tzIHdpdGggbm8gcmVnaW9uIGRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG5vUmVnaW9uU3RhY2sgPSBuZXcgU3RhY2sobmV3IEFwcCgpLCAnTWlzc2luZ1JlZ2lvbicpO1xuICAgICAgICBleHBlY3Qobm9SZWdpb25TdGFjay5wYXJ0aXRpb24pLnRvRXF1YWwoQXdzLlBBUlRJVElPTik7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnc3RhY2tzIHdpdGggYW4gdW5rbm93biByZWdpb24nLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGltYWdpbmFyeVJlZ2lvblN0YWNrID0gbmV3IFN0YWNrKG5ldyBBcHAoKSwgJ0ltYWdpbmFyeVJlZ2lvbicsIGVudkZvclJlZ2lvbigndXMtYXJlYTUxJykpO1xuICAgICAgICBleHBlY3QoaW1hZ2luYXJ5UmVnaW9uU3RhY2sucGFydGl0aW9uKS50b0VxdWFsKEF3cy5QQVJUSVRJT04pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnY2hhbmdlcyBrbm93biByZWdpb24gYmVoYXZpb3JzIG9ubHkgd2hlbiBlbmFibGVkJywgKCkgPT4ge1xuICAgICAgdGVzdCgnKGRpc2FibGVkKScsICgpID0+IHtcbiAgICAgICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgICAgICBSZWdpb25JbmZvLnJlZ2lvbnMuZm9yRWFjaChmdW5jdGlvbihyZWdpb24pIHtcbiAgICAgICAgICBjb25zdCByZWdpb25TdGFjayA9IG5ldyBTdGFjayhhcHAsIGBSZWdpb24tJHtyZWdpb24ubmFtZX1gLCBlbnZGb3JSZWdpb24ocmVnaW9uLm5hbWUpKTtcbiAgICAgICAgICBleHBlY3QocmVnaW9uU3RhY2sucGFydGl0aW9uKS50b0VxdWFsKEF3cy5QQVJUSVRJT04pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCcoZW5hYmxlZCknLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoeyBjb250ZXh0OiBmZWF0dXJlRmxhZyB9KTtcbiAgICAgICAgUmVnaW9uSW5mby5yZWdpb25zLmZvckVhY2goZnVuY3Rpb24ocmVnaW9uKSB7XG4gICAgICAgICAgY29uc3QgcmVnaW9uU3RhY2sgPSBuZXcgU3RhY2soYXBwLCBgUmVnaW9uLSR7cmVnaW9uLm5hbWV9YCwgZW52Rm9yUmVnaW9uKHJlZ2lvbi5uYW1lKSk7XG4gICAgICAgICAgZXhwZWN0KHJlZ2lvblN0YWNrLnBhcnRpdGlvbikudG9FcXVhbChSZWdpb25JbmZvLmdldChyZWdpb24ubmFtZSkucGFydGl0aW9uKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnb3ZlcnJpZGVMb2dpY2FsSWQoaWQpIGNhbiBiZSB1c2VkIHRvIG92ZXJyaWRlIHRoZSBsb2dpY2FsIElEIG9mIGEgcmVzb3VyY2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGJvbmpvdXIgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdCb25qb3VyUmVzb3VyY2UnLCB7IHR5cGU6ICdSZXNvdXJjZTo6VHlwZScgfSk7XG5cbiAgICAvLyB7IFJlZiB9IGFuZCB7IEdldEF0dCB9XG4gICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnUmVmVG9Cb25qb3VyJywge1xuICAgICAgdHlwZTogJ090aGVyOjpSZXNvdXJjZScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIFJlZlRvQm9uam91cjogYm9uam91ci5yZWYsXG4gICAgICAgIEdldEF0dEJvbmpvdXI6IGJvbmpvdXIuZ2V0QXR0KCdUaGVBdHQnKS50b1N0cmluZygpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGJvbmpvdXIub3ZlcnJpZGVMb2dpY2FsSWQoJ0JPT00nKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgUmVzb3VyY2VzOlxuICAgICAge1xuICAgICAgICBCT09NOiB7IFR5cGU6ICdSZXNvdXJjZTo6VHlwZScgfSxcbiAgICAgICAgUmVmVG9Cb25qb3VyOlxuICAgICAgICAge1xuICAgICAgICAgICBUeXBlOiAnT3RoZXI6OlJlc291cmNlJyxcbiAgICAgICAgICAgUHJvcGVydGllczpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmVG9Cb25qb3VyOiB7IFJlZjogJ0JPT00nIH0sXG4gICAgICAgICAgICAgIEdldEF0dEJvbmpvdXI6IHsgJ0ZuOjpHZXRBdHQnOiBbJ0JPT00nLCAnVGhlQXR0J10gfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnU3RhY2sgbmFtZSBjYW4gYmUgb3ZlcnJpZGRlbiB2aWEgcHJvcGVydGllcycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2sodW5kZWZpbmVkLCAnU3RhY2snLCB7IHN0YWNrTmFtZTogJ290aGVyTmFtZScgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnN0YWNrTmFtZSkudG9FcXVhbCgnb3RoZXJOYW1lJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ1N0YWNrIG5hbWUgaXMgaW5oZXJpdGVkIGZyb20gQXBwIG5hbWUgaWYgYXZhaWxhYmxlJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCByb290ID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IGFwcCA9IG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ1Byb2QnKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdTdGFjaycpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjay5zdGFja05hbWUpLnRvRXF1YWwoJ1Byb2RTdGFja0Q1Mjc5QjIyJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2dlbmVyYXRlZCBzdGFjayBuYW1lcyB3aWxsIG5vdCBleGNlZWQgMTI4IGNoYXJhY3RlcnMnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJvb3QgPSBuZXcgQXBwKCk7XG4gICAgY29uc3QgYXBwID0gbmV3IENvbnN0cnVjdChyb290LCAnUHJvZEFwcFRoaXNOYW1lQnV0SXRXaWxsT25seUJlVG9vTG9uZ1doZW5Db21iaW5lZFdpdGhUaGVTdGFja05hbWUnICsgJ3onLnJlcGVhdCg2MCkpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1RoaXNOYW1lSXNWZXJ5TG9uZ0J1dEl0V2lsbE9ubHlCZVRvb0xvbmdXaGVuQ29tYmluZWRXaXRoVGhlQXBwTmFtZVN0YWNrJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnN0YWNrTmFtZS5sZW5ndGgpLnRvRXF1YWwoMTI4KTtcbiAgICBleHBlY3Qoc3RhY2suc3RhY2tOYW1lKS50b0VxdWFsKCdQcm9kQXBwVGhpc05hbWVCdXRJdFdpbGxPbmx5QmVUb29Mb25nV2hlbkNvbWJpbmVkV2l0aFRoZVN0YWNlcnlMb25nQnV0SXRXaWxsT25seUJlVG9vTG9uZ1doZW5Db21iaW5lZFdpdGhUaGVBcHBOYW1lU3RhY2s4NjRDQzFEMycpO1xuICB9KTtcblxuICB0ZXN0KCdzdGFjayBjb25zdHJ1Y3QgaWQgZG9lcyBub3QgZ28gdGhyb3VnaCBzdGFjayBuYW1lIHZhbGlkYXRpb24gaWYgdGhlcmUgaXMgYW4gZXhwbGljaXQgc3RhY2sgbmFtZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdpbnZhbGlkIGFzIDogc3RhY2sgbmFtZSwgYnV0IHRoYXRzIGZpbmUnLCB7XG4gICAgICBzdGFja05hbWU6ICd2YWxpZC1zdGFjay1uYW1lJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBzZXNzaW9uID0gYXBwLnN5bnRoKCk7XG4gICAgZXhwZWN0KHN0YWNrLnN0YWNrTmFtZSkudG9FcXVhbCgndmFsaWQtc3RhY2stbmFtZScpO1xuICAgIGV4cGVjdChzZXNzaW9uLnRyeUdldEFydGlmYWN0KHN0YWNrLmFydGlmYWN0SWQpKS50b0JlRGVmaW5lZCgpO1xuICB9KTtcblxuICB0ZXN0KCdzdGFjayB2YWxpZGF0aW9uIGlzIHBlcmZvcm1lZCBvbiBleHBsaWNpdCBzdGFjayBuYW1lJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBuZXcgU3RhY2soYXBwLCAnYm9vbScsIHsgc3RhY2tOYW1lOiAnaW52YWxpZDpzdGFjazpuYW1lJyB9KSlcbiAgICAgIC50b1Rocm93KC9TdGFjayBuYW1lIG11c3QgbWF0Y2ggdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbi8pO1xuICB9KTtcblxuICB0ZXN0KCdTdGFjay5vZihzdGFjaykgcmV0dXJucyB0aGUgY29ycmVjdCBzdGFjaycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGV4cGVjdChTdGFjay5vZihzdGFjaykpLnRvQmUoc3RhY2spO1xuICAgIGNvbnN0IHBhcmVudCA9IG5ldyBDb25zdHJ1Y3Qoc3RhY2ssICdQYXJlbnQnKTtcbiAgICBjb25zdCBjb25zdHJ1Y3QgPSBuZXcgQ29uc3RydWN0KHBhcmVudCwgJ0NvbnN0cnVjdCcpO1xuICAgIGV4cGVjdChTdGFjay5vZihjb25zdHJ1Y3QpKS50b0JlKHN0YWNrKTtcbiAgfSk7XG5cbiAgdGVzdCgnU3RhY2sub2YoKSB0aHJvd3Mgd2hlbiB0aGVyZSBpcyBubyBwYXJlbnQgU3RhY2snLCAoKSA9PiB7XG4gICAgY29uc3Qgcm9vdCA9IG5ldyBDb25zdHJ1Y3QodW5kZWZpbmVkIGFzIGFueSwgJ1Jvb3QnKTtcbiAgICBjb25zdCBjb25zdHJ1Y3QgPSBuZXcgQ29uc3RydWN0KHJvb3QsICdDb25zdHJ1Y3QnKTtcbiAgICBleHBlY3QoKCkgPT4gU3RhY2sub2YoY29uc3RydWN0KSkudG9UaHJvdygvc2hvdWxkIGJlIGNyZWF0ZWQgaW4gdGhlIHNjb3BlIG9mIGEgU3RhY2ssIGJ1dCBubyBTdGFjayBmb3VuZC8pO1xuICB9KTtcblxuICB0ZXN0KCdTdGFjay5vZigpIHdvcmtzIGZvciBzdWJzdGFja3MnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcGFyZW50U3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnUGFyZW50U3RhY2snKTtcbiAgICBjb25zdCBwYXJlbnRSZXNvdXJjZSA9IG5ldyBDZm5SZXNvdXJjZShwYXJlbnRTdGFjaywgJ1BhcmVudFJlc291cmNlJywgeyB0eXBlOiAncGFyZW50OjpyZXNvdXJjZScgfSk7XG5cbiAgICAvLyB3ZSB3aWxsIGRlZmluZSBhIHN1YnN0YWNrIHVuZGVyIHRoZSAvcmVzb3VyY2UvLi4uIGp1c3QgZm9yIGdpZ2dsZXMuXG4gICAgY29uc3QgY2hpbGRTdGFjayA9IG5ldyBTdGFjayhwYXJlbnRSZXNvdXJjZSwgJ0NoaWxkU3RhY2snKTtcbiAgICBjb25zdCBjaGlsZFJlc291cmNlID0gbmV3IENmblJlc291cmNlKGNoaWxkU3RhY2ssICdDaGlsZFJlc291cmNlJywgeyB0eXBlOiAnY2hpbGQ6OnJlc291cmNlJyB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoU3RhY2sub2YocGFyZW50U3RhY2spKS50b0JlKHBhcmVudFN0YWNrKTtcbiAgICBleHBlY3QoU3RhY2sub2YocGFyZW50UmVzb3VyY2UpKS50b0JlKHBhcmVudFN0YWNrKTtcbiAgICBleHBlY3QoU3RhY2sub2YoY2hpbGRTdGFjaykpLnRvQmUoY2hpbGRTdGFjayk7XG4gICAgZXhwZWN0KFN0YWNrLm9mKGNoaWxkUmVzb3VyY2UpKS50b0JlKGNoaWxkU3RhY2spO1xuICB9KTtcblxuICB0ZXN0KCdzdGFjay5hdmFpbGFiaWxpdHlab25lcyBmYWxscyBiYWNrIHRvIEZuOjpHZXRBWlswXSxbMl0gaWYgcmVnaW9uIGlzIG5vdCBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnTXlTdGFjaycpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGF6cyA9IHN0YWNrLmF2YWlsYWJpbGl0eVpvbmVzO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGF6cykpLnRvRXF1YWwoW1xuICAgICAgeyAnRm46OlNlbGVjdCc6IFswLCB7ICdGbjo6R2V0QVpzJzogJycgfV0gfSxcbiAgICAgIHsgJ0ZuOjpTZWxlY3QnOiBbMSwgeyAnRm46OkdldEFacyc6ICcnIH1dIH0sXG4gICAgXSk7XG4gIH0pO1xuXG5cbiAgdGVzdCgnYWxsb3dzIHVzaW5nIHRoZSBzYW1lIHN0YWNrIG5hbWUgZm9yIHR3byBzdGFja3MgKGkuZS4gaW4gZGlmZmVyZW50IHJlZ2lvbnMpJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ015U3RhY2sxJywgeyBzdGFja05hbWU6ICd0aGVzdGFjaycgfSk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcCwgJ015U3RhY2syJywgeyBzdGFja05hbWU6ICd0aGVzdGFjaycgfSk7XG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoYXNzZW1ibHkuZ2V0U3RhY2tBcnRpZmFjdChzdGFjazEuYXJ0aWZhY3RJZCkudGVtcGxhdGVGaWxlKS50b0VxdWFsKCdNeVN0YWNrMS50ZW1wbGF0ZS5qc29uJyk7XG4gICAgZXhwZWN0KGFzc2VtYmx5LmdldFN0YWNrQXJ0aWZhY3Qoc3RhY2syLmFydGlmYWN0SWQpLnRlbXBsYXRlRmlsZSkudG9FcXVhbCgnTXlTdGFjazIudGVtcGxhdGUuanNvbicpO1xuICAgIGV4cGVjdChzdGFjazEudGVtcGxhdGVGaWxlKS50b0VxdWFsKCdNeVN0YWNrMS50ZW1wbGF0ZS5qc29uJyk7XG4gICAgZXhwZWN0KHN0YWNrMi50ZW1wbGF0ZUZpbGUpLnRvRXF1YWwoJ015U3RhY2syLnRlbXBsYXRlLmpzb24nKTtcbiAgfSk7XG5cbiAgdGVzdCgnYXJ0aWZhY3RJZCBhbmQgdGVtcGxhdGVGaWxlIHVzZSB0aGUgdW5pcXVlIGlkIGFuZCBub3QgdGhlIHN0YWNrIG5hbWUnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnTXlTdGFjazEnLCB7IHN0YWNrTmFtZTogJ3RoZXN0YWNrJyB9KTtcbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjazEuYXJ0aWZhY3RJZCkudG9FcXVhbCgnTXlTdGFjazEnKTtcbiAgICBleHBlY3Qoc3RhY2sxLnRlbXBsYXRlRmlsZSkudG9FcXVhbCgnTXlTdGFjazEudGVtcGxhdGUuanNvbicpO1xuICAgIGV4cGVjdChhc3NlbWJseS5nZXRTdGFja0FydGlmYWN0KHN0YWNrMS5hcnRpZmFjdElkKS50ZW1wbGF0ZUZpbGUpLnRvRXF1YWwoJ015U3RhY2sxLnRlbXBsYXRlLmpzb24nKTtcbiAgfSk7XG5cbiAgdGVzdCgndXNlIHRoZSBhcnRpZmFjdCBpZCBhcyB0aGUgdGVtcGxhdGUgbmFtZScsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdNeVN0YWNrMScpO1xuICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhhcHAsICdNeVN0YWNrMicsIHsgc3RhY2tOYW1lOiAnTXlSZWFsU3RhY2syJyB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2sxLnRlbXBsYXRlRmlsZSkudG9FcXVhbCgnTXlTdGFjazEudGVtcGxhdGUuanNvbicpO1xuICAgIGV4cGVjdChzdGFjazIudGVtcGxhdGVGaWxlKS50b0VxdWFsKCdNeVN0YWNrMi50ZW1wbGF0ZS5qc29uJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ21ldGFkYXRhIGlzIGNvbGxlY3RlZCBhdCB0aGUgc3RhY2sgYm91bmRhcnknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgW2N4YXBpLkRJU0FCTEVfTUVUQURBVEFfU1RBQ0tfVFJBQ0VdOiAndHJ1ZScsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnN0IHBhcmVudCA9IG5ldyBTdGFjayhhcHAsICdwYXJlbnQnKTtcbiAgICBjb25zdCBjaGlsZCA9IG5ldyBTdGFjayhwYXJlbnQsICdjaGlsZCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNoaWxkLm5vZGUuYWRkTWV0YWRhdGEoJ2ZvbycsICdiYXInKTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhc20gPSBhcHAuc3ludGgoKTtcbiAgICBleHBlY3QoYXNtLmdldFN0YWNrQnlOYW1lKHBhcmVudC5zdGFja05hbWUpLmZpbmRNZXRhZGF0YUJ5VHlwZSgnZm9vJykpLnRvRXF1YWwoW10pO1xuICAgIGV4cGVjdChhc20uZ2V0U3RhY2tCeU5hbWUoY2hpbGQuc3RhY2tOYW1lKS5maW5kTWV0YWRhdGFCeVR5cGUoJ2ZvbycpKS50b0VxdWFsKFtcbiAgICAgIHsgcGF0aDogJy9wYXJlbnQvY2hpbGQnLCB0eXBlOiAnZm9vJywgZGF0YTogJ2JhcicgfSxcbiAgICBdKTtcbiAgfSk7XG5cbiAgdGVzdCgnc3RhY2sgdGFncyBhcmUgcmVmbGVjdGVkIGluIHRoZSBzdGFjayBjbG91ZCBhc3NlbWJseSBhcnRpZmFjdCBtZXRhZGF0YScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoeyBzdGFja1RyYWNlczogZmFsc2UsIGNvbnRleHQ6IHsgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlIH0gfSk7XG5cbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2sxJyk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKHN0YWNrMSwgJ3N0YWNrMicpO1xuXG4gICAgLy8gV0hFTlxuICAgIFRhZ3Mub2YoYXBwKS5hZGQoJ2ZvbycsICdiYXInKTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhc20gPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCBleHBlY3RlZCA9IFtcbiAgICAgIHtcbiAgICAgICAgdHlwZTogJ2F3czpjZGs6c3RhY2stdGFncycsXG4gICAgICAgIGRhdGE6IFt7IGtleTogJ2ZvbycsIHZhbHVlOiAnYmFyJyB9XSxcbiAgICAgIH0sXG4gICAgXTtcblxuICAgIGV4cGVjdChhc20uZ2V0U3RhY2tBcnRpZmFjdChzdGFjazEuYXJ0aWZhY3RJZCkubWFuaWZlc3QubWV0YWRhdGEpLnRvRXF1YWwoeyAnL3N0YWNrMSc6IGV4cGVjdGVkIH0pO1xuICAgIGV4cGVjdChhc20uZ2V0U3RhY2tBcnRpZmFjdChzdGFjazIuYXJ0aWZhY3RJZCkubWFuaWZlc3QubWV0YWRhdGEpLnRvRXF1YWwoeyAnL3N0YWNrMS9zdGFjazInOiBleHBlY3RlZCB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnc3RhY2sgdGFncyBhcmUgcmVmbGVjdGVkIGluIHRoZSBzdGFjayBhcnRpZmFjdCBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7IHN0YWNrVHJhY2VzOiBmYWxzZSB9KTtcbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2sxJyk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKHN0YWNrMSwgJ3N0YWNrMicpO1xuXG4gICAgLy8gV0hFTlxuICAgIFRhZ3Mub2YoYXBwKS5hZGQoJ2ZvbycsICdiYXInKTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhc20gPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCBleHBlY3RlZCA9IHsgZm9vOiAnYmFyJyB9O1xuXG4gICAgZXhwZWN0KGFzbS5nZXRTdGFja0FydGlmYWN0KHN0YWNrMS5hcnRpZmFjdElkKS50YWdzKS50b0VxdWFsKGV4cGVjdGVkKTtcbiAgICBleHBlY3QoYXNtLmdldFN0YWNrQXJ0aWZhY3Qoc3RhY2syLmFydGlmYWN0SWQpLnRhZ3MpLnRvRXF1YWwoZXhwZWN0ZWQpO1xuICB9KTtcblxuICB0ZXN0KCdUZXJtaW5hdGlvbiBQcm90ZWN0aW9uIGlzIHJlZmxlY3RlZCBpbiBDbG91ZCBBc3NlbWJseSBhcnRpZmFjdCcsICgpID0+IHtcbiAgICAvLyBpZiB0aGUgcm9vdCBpcyBhbiBhcHAsIGludm9rZSBcInN5bnRoXCIgdG8gYXZvaWQgZG91YmxlIHN5bnRoZXNpc1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdTdGFjaycsIHsgdGVybWluYXRpb25Qcm90ZWN0aW9uOiB0cnVlIH0pO1xuXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCBhcnRpZmFjdCA9IGFzc2VtYmx5LmdldFN0YWNrQXJ0aWZhY3Qoc3RhY2suYXJ0aWZhY3RJZCk7XG5cbiAgICBleHBlY3QoYXJ0aWZhY3QudGVybWluYXRpb25Qcm90ZWN0aW9uKS50b0VxdWFsKHRydWUpO1xuICB9KTtcblxuICB0ZXN0KCdjb250ZXh0IGNhbiBiZSBzZXQgb24gYSBzdGFjayB1c2luZyBhIExlZ2FjeVN5bnRoZXNpemVyJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayh1bmRlZmluZWQsIHVuZGVmaW5lZCwge1xuICAgICAgc3ludGhlc2l6ZXI6IG5ldyBMZWdhY3lTdGFja1N5bnRoZXNpemVyKCksXG4gICAgfSk7XG4gICAgc3RhY2subm9kZS5zZXRDb250ZXh0KCdzb21ldGhpbmcnLCAndmFsdWUnKTtcblxuICAgIC8vIFRIRU46IG5vIGV4Y2VwdGlvblxuICB9KTtcblxuICB0ZXN0KCdjb250ZXh0IGNhbiBiZSBzZXQgb24gYSBzdGFjayB1c2luZyBhIERlZmF1bHRTeW50aGVzaXplcicsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2sodW5kZWZpbmVkLCB1bmRlZmluZWQsIHtcbiAgICAgIHN5bnRoZXNpemVyOiBuZXcgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIoKSxcbiAgICB9KTtcbiAgICBzdGFjay5ub2RlLnNldENvbnRleHQoJ3NvbWV0aGluZycsICd2YWx1ZScpO1xuXG4gICAgLy8gVEhFTjogbm8gZXhjZXB0aW9uXG4gIH0pO1xuXG4gIHRlc3QoJ3ZlcnNpb24gcmVwb3J0aW5nIGNhbiBiZSBjb25maWd1cmVkIG9uIHRoZSBhcHAnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7IGFuYWx5dGljc1JlcG9ydGluZzogdHJ1ZSB9KTtcbiAgICBleHBlY3QobmV3IFN0YWNrKGFwcCwgJ1N0YWNrJykuX3ZlcnNpb25SZXBvcnRpbmdFbmFibGVkKS50b0JlRGVmaW5lZCgpO1xuICB9KTtcblxuICB0ZXN0KCd2ZXJzaW9uIHJlcG9ydGluZyBjYW4gYmUgY29uZmlndXJlZCB3aXRoIGNvbnRleHQnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7IGNvbnRleHQ6IHsgJ2F3czpjZGs6dmVyc2lvbi1yZXBvcnRpbmcnOiB0cnVlIH0gfSk7XG4gICAgZXhwZWN0KG5ldyBTdGFjayhhcHAsICdTdGFjaycpLl92ZXJzaW9uUmVwb3J0aW5nRW5hYmxlZCkudG9CZURlZmluZWQoKTtcbiAgfSk7XG5cbiAgdGVzdCgndmVyc2lvbiByZXBvcnRpbmcgY2FuIGJlIGNvbmZpZ3VyZWQgb24gdGhlIHN0YWNrJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBleHBlY3QobmV3IFN0YWNrKGFwcCwgJ1N0YWNrJywgeyBhbmFseXRpY3NSZXBvcnRpbmc6IHRydWUgfSkuX3ZlcnNpb25SZXBvcnRpbmdFbmFibGVkKS50b0JlRGVmaW5lZCgpO1xuICB9KTtcblxuICB0ZXN0KCdyZXF1aXJlcyBidW5kbGluZyB3aGVuIHdpbGRjYXJkIGlzIHNwZWNpZmllZCBpbiBCVU5ETElOR19TVEFDS1MnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrJyk7XG4gICAgc3RhY2subm9kZS5zZXRDb250ZXh0KGN4YXBpLkJVTkRMSU5HX1NUQUNLUywgWycqJ10pO1xuICAgIGV4cGVjdChzdGFjay5idW5kbGluZ1JlcXVpcmVkKS50b0JlKHRydWUpO1xuICB9KTtcblxuICB0ZXN0KCdyZXF1aXJlcyBidW5kbGluZyB3aGVuIHN0YWNrTmFtZSBoYXMgYW4gZXhhY3QgbWF0Y2ggaW4gQlVORExJTkdfU1RBQ0tTJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdTdGFjaycpO1xuICAgIHN0YWNrLm5vZGUuc2V0Q29udGV4dChjeGFwaS5CVU5ETElOR19TVEFDS1MsIFsnU3RhY2snXSk7XG4gICAgZXhwZWN0KHN0YWNrLmJ1bmRsaW5nUmVxdWlyZWQpLnRvQmUodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RvZXMgbm90IHJlcXVpcmUgYnVuZGxpbmcgd2hlbiBubyBpdGVtIGZyb20gQlVJTERJTkdfU1RBQ0tTIG1hdGNoZXMgc3RhY2tOYW1lJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdTdGFjaycpO1xuICAgIHN0YWNrLm5vZGUuc2V0Q29udGV4dChjeGFwaS5CVU5ETElOR19TVEFDS1MsIFsnU3RhYyddKTtcbiAgICBleHBlY3Qoc3RhY2suYnVuZGxpbmdSZXF1aXJlZCkudG9CZShmYWxzZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RvZXMgbm90IHJlcXVpcmUgYnVuZGxpbmcgd2hlbiBCVU5ETElOR19TVEFDS1MgaXMgZW1wdHknLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrJyk7XG4gICAgc3RhY2subm9kZS5zZXRDb250ZXh0KGN4YXBpLkJVTkRMSU5HX1NUQUNLUywgW10pO1xuICAgIGV4cGVjdChzdGFjay5idW5kbGluZ1JlcXVpcmVkKS50b0JlKGZhbHNlKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ3Blcm1pc3Npb25zIGJvdW5kYXJ5JywgKCkgPT4ge1xuICB0ZXN0KCdjYW4gc3BlY2lmeSBhIHZhbGlkIHBlcm1pc3Npb25zIGJvdW5kYXJ5IG5hbWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2snLCB7XG4gICAgICBwZXJtaXNzaW9uc0JvdW5kYXJ5OiBQZXJtaXNzaW9uc0JvdW5kYXJ5LmZyb21OYW1lKCd2YWxpZCcpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IHBiQ29udGV4dCA9IHN0YWNrLm5vZGUudHJ5R2V0Q29udGV4dChQRVJNSVNTSU9OU19CT1VOREFSWV9DT05URVhUX0tFWSk7XG4gICAgZXhwZWN0KHBiQ29udGV4dCkudG9FcXVhbCh7XG4gICAgICBuYW1lOiAndmFsaWQnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gc3BlY2lmeSBhIHZhbGlkIHBlcm1pc3Npb25zIGJvdW5kYXJ5IGFybicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdTdGFjaycsIHtcbiAgICAgIHBlcm1pc3Npb25zQm91bmRhcnk6IFBlcm1pc3Npb25zQm91bmRhcnkuZnJvbUFybignYXJuOmF3czppYW06OjEyMzQ1Njc4OTEyOnBvbGljeS92YWxpZCcpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IHBiQ29udGV4dCA9IHN0YWNrLm5vZGUudHJ5R2V0Q29udGV4dChQRVJNSVNTSU9OU19CT1VOREFSWV9DT05URVhUX0tFWSk7XG4gICAgZXhwZWN0KHBiQ29udGV4dCkudG9FcXVhbCh7XG4gICAgICBuYW1lOiB1bmRlZmluZWQsXG4gICAgICBhcm46ICdhcm46YXdzOmlhbTo6MTIzNDU2Nzg5MTI6cG9saWN5L3ZhbGlkJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnc2luZ2xlIGFzcGVjdCBpcyBhZGRlZCB0byBzdGFjaycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzdGFnZSA9IG5ldyBTdGFnZShhcHAsICdTdGFnZScsIHtcbiAgICAgIHBlcm1pc3Npb25zQm91bmRhcnk6IFBlcm1pc3Npb25zQm91bmRhcnkuZnJvbUFybignYXJuOmF3czppYW06OjEyMzQ1Njc4OTEyOnBvbGljeS9zdGFnZScpLFxuICAgIH0pO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHN0YWdlLCAnU3RhY2snLCB7XG4gICAgICBwZXJtaXNzaW9uc0JvdW5kYXJ5OiBQZXJtaXNzaW9uc0JvdW5kYXJ5LmZyb21Bcm4oJ2Fybjphd3M6aWFtOjoxMjM0NTY3ODkxMjpwb2xpY3kvdmFsaWQnKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhc3BlY3RzID0gQXNwZWN0cy5vZihzdGFjaykuYWxsO1xuICAgIGV4cGVjdChhc3BlY3RzLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICBjb25zdCBwYkNvbnRleHQgPSBzdGFjay5ub2RlLnRyeUdldENvbnRleHQoUEVSTUlTU0lPTlNfQk9VTkRBUllfQ09OVEVYVF9LRVkpO1xuICAgIGV4cGVjdChwYkNvbnRleHQpLnRvRXF1YWwoe1xuICAgICAgbmFtZTogdW5kZWZpbmVkLFxuICAgICAgYXJuOiAnYXJuOmF3czppYW06OjEyMzQ1Njc4OTEyOnBvbGljeS92YWxpZCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyBpZiBwc2V1ZG8gcGFyYW1ldGVycyBhcmUgaW4gdGhlIG5hbWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBTdGFjayhhcHAsICdTdGFjaycsIHtcbiAgICAgICAgcGVybWlzc2lvbnNCb3VuZGFyeTogUGVybWlzc2lvbnNCb3VuZGFyeS5mcm9tQXJuKCdhcm46YXdzOmlhbTo6JHtBV1M6OkFjY291bnRJZH06cG9saWN5L3ZhbGlkJyksXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9UaGUgcGVybWlzc2lvbnMgYm91bmRhcnkgLiogaW5jbHVkZXMgYSBwc2V1ZG8gcGFyYW1ldGVyLyk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdyZWdpb25hbEZhY3QnLCAoKSA9PiB7XG4gIEZhY3QucmVnaXN0ZXIoeyBuYW1lOiAnTXlGYWN0JywgcmVnaW9uOiAndXMtZWFzdC0xJywgdmFsdWU6ICd4LmFtYXpvbmF3cy5jb20nIH0pO1xuICBGYWN0LnJlZ2lzdGVyKHsgbmFtZTogJ015RmFjdCcsIHJlZ2lvbjogJ2V1LXdlc3QtMScsIHZhbHVlOiAneC5hbWF6b25hd3MuY29tJyB9KTtcbiAgRmFjdC5yZWdpc3Rlcih7IG5hbWU6ICdNeUZhY3QnLCByZWdpb246ICdjbi1ub3J0aC0xJywgdmFsdWU6ICd4LmFtYXpvbmF3cy5jb20uY24nIH0pO1xuXG4gIEZhY3QucmVnaXN0ZXIoeyBuYW1lOiAnV2VpcmRGYWN0JywgcmVnaW9uOiAndXMtZWFzdC0xJywgdmFsdWU6ICdvbmVmb3JtYXQnIH0pO1xuICBGYWN0LnJlZ2lzdGVyKHsgbmFtZTogJ1dlaXJkRmFjdCcsIHJlZ2lvbjogJ2V1LXdlc3QtMScsIHZhbHVlOiAnb3RoZXJmb3JtYXQnIH0pO1xuXG4gIHRlc3QoJ3JlZ2lvbmFsIGZhY3RzIHJldHVybiBhIGxpdGVyYWwgdmFsdWUgaWYgcG9zc2libGUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2sodW5kZWZpbmVkLCAnU3RhY2snLCB7IGVudjogeyByZWdpb246ICd1cy1lYXN0LTEnIH0gfSk7XG4gICAgZXhwZWN0KHN0YWNrLnJlZ2lvbmFsRmFjdCgnTXlGYWN0JykpLnRvRXF1YWwoJ3guYW1hem9uYXdzLmNvbScpO1xuICB9KTtcblxuICB0ZXN0KCdyZWdpb25hbCBmYWN0cyBhcmUgc2ltcGxpZmllZCB0byB1c2UgVVJMX1NVRkZJWCB0b2tlbiBpZiBwb3NzaWJsZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGV4cGVjdChzdGFjay5yZWdpb25hbEZhY3QoJ015RmFjdCcpKS50b0VxdWFsKGB4LiR7QXdzLlVSTF9TVUZGSVh9YCk7XG4gIH0pO1xuXG4gIHRlc3QoJ3JlZ2lvbmFsIGZhY3RzIGFyZSBzaW1wbGlmaWVkIHRvIHVzZSBjb25jcmV0ZSB2YWx1ZXMgaWYgVVJMX1NVRkZJWCB0b2tlbiBpcyBub3QgbmVjZXNzYXJ5JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgTm9kZS5vZihzdGFjaykuc2V0Q29udGV4dChjeGFwaS5UQVJHRVRfUEFSVElUSU9OUywgWydhd3MnXSk7XG4gICAgZXhwZWN0KHN0YWNrLnJlZ2lvbmFsRmFjdCgnTXlGYWN0JykpLnRvRXF1YWwoJ3guYW1hem9uYXdzLmNvbScpO1xuICB9KTtcblxuICB0ZXN0KCdyZWdpb25hbCBmYWN0cyB1c2UgdGhlIGdsb2JhbCBsb29rdXAgbWFwIGlmIHBhcnRpdGlvbiBpcyB0aGUgbGl0ZXJhbCBzdHJpbmcgb2YgXCJ1bmRlZmluZWRcIicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIE5vZGUub2Yoc3RhY2spLnNldENvbnRleHQoY3hhcGkuVEFSR0VUX1BBUlRJVElPTlMsICd1bmRlZmluZWQnKTtcbiAgICBuZXcgQ2ZuT3V0cHV0KHN0YWNrLCAnVGhlRmFjdCcsIHtcbiAgICAgIHZhbHVlOiBzdGFjay5yZWdpb25hbEZhY3QoJ1dlaXJkRmFjdCcpLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spKS50b0VxdWFsKHtcbiAgICAgIE1hcHBpbmdzOiB7XG4gICAgICAgIFdlaXJkRmFjdE1hcDoge1xuICAgICAgICAgICdldS13ZXN0LTEnOiB7IHZhbHVlOiAnb3RoZXJmb3JtYXQnIH0sXG4gICAgICAgICAgJ3VzLWVhc3QtMSc6IHsgdmFsdWU6ICdvbmVmb3JtYXQnIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgT3V0cHV0czoge1xuICAgICAgICBUaGVGYWN0OiB7XG4gICAgICAgICAgVmFsdWU6IHtcbiAgICAgICAgICAgICdGbjo6RmluZEluTWFwJzogWydXZWlyZEZhY3RNYXAnLCB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LCAndmFsdWUnXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICB9KTtcblxuICB0ZXN0KCdyZWdpb25hbCBmYWN0cyBnZW5lcmF0ZSBhIG1hcHBpbmcgaWYgbmVjZXNzYXJ5JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgbmV3IENmbk91dHB1dChzdGFjaywgJ1RoZUZhY3QnLCB7XG4gICAgICB2YWx1ZTogc3RhY2sucmVnaW9uYWxGYWN0KCdXZWlyZEZhY3QnKSxcbiAgICB9KTtcblxuICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICBNYXBwaW5nczoge1xuICAgICAgICBXZWlyZEZhY3RNYXA6IHtcbiAgICAgICAgICAnZXUtd2VzdC0xJzogeyB2YWx1ZTogJ290aGVyZm9ybWF0JyB9LFxuICAgICAgICAgICd1cy1lYXN0LTEnOiB7IHZhbHVlOiAnb25lZm9ybWF0JyB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIE91dHB1dHM6IHtcbiAgICAgICAgVGhlRmFjdDoge1xuICAgICAgICAgIFZhbHVlOiB7XG4gICAgICAgICAgICAnRm46OkZpbmRJbk1hcCc6IFtcbiAgICAgICAgICAgICAgJ1dlaXJkRmFjdE1hcCcsXG4gICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICAgICAgICd2YWx1ZScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzdGFjay5hZGRNZXRhZGF0YSgpIGFkZHMgbWV0YWRhdGEnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIHN0YWNrLmFkZE1ldGFkYXRhKCdJbnN0YW5jZXMnLCB7IERlc2NyaXB0aW9uOiAnSW5mb3JtYXRpb24gYWJvdXQgdGhlIGluc3RhbmNlcycgfSk7XG4gICAgc3RhY2suYWRkTWV0YWRhdGEoJ0RhdGFiYXNlcycsIHsgRGVzY3JpcHRpb246ICdJbmZvcm1hdGlvbiBhYm91dCB0aGUgZGF0YWJhc2VzJyB9ICk7XG5cbiAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgTWV0YWRhdGE6IHtcbiAgICAgICAgSW5zdGFuY2VzOiB7IERlc2NyaXB0aW9uOiAnSW5mb3JtYXRpb24gYWJvdXQgdGhlIGluc3RhbmNlcycgfSxcbiAgICAgICAgRGF0YWJhc2VzOiB7IERlc2NyaXB0aW9uOiAnSW5mb3JtYXRpb24gYWJvdXQgdGhlIGRhdGFiYXNlcycgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmNsYXNzIFN0YWNrV2l0aFBvc3RQcm9jZXNzb3IgZXh0ZW5kcyBTdGFjayB7XG5cbiAgLy8gLi4uXG5cbiAgcHVibGljIF90b0Nsb3VkRm9ybWF0aW9uKCkge1xuICAgIGNvbnN0IHRlbXBsYXRlID0gc3VwZXIuX3RvQ2xvdWRGb3JtYXRpb24oKTtcblxuICAgIC8vIG1hbmlwdWxhdGUgdGVtcGxhdGUgKGUuZy4gcmVuYW1lIFwiS2V5XCIgdG8gXCJrZXlcIilcbiAgICB0ZW1wbGF0ZS5SZXNvdXJjZXMubXlSZXNvdXJjZS5Qcm9wZXJ0aWVzLkVudmlyb25tZW50LmtleSA9XG4gICAgICB0ZW1wbGF0ZS5SZXNvdXJjZXMubXlSZXNvdXJjZS5Qcm9wZXJ0aWVzLkVudmlyb25tZW50LktleTtcbiAgICBkZWxldGUgdGVtcGxhdGUuUmVzb3VyY2VzLm15UmVzb3VyY2UuUHJvcGVydGllcy5FbnZpcm9ubWVudC5LZXk7XG5cbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH1cbn1cbiJdfQ==