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
        expect(util_1.toCloudFormation(stack)).toEqual({});
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
        expect(util_1.toCloudFormation(stack)).toEqual({
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
        expect(util_1.toCloudFormation(stack)).toEqual({ Resources: { MyResource: { Type: 'MyResourceType' } } });
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
        expect(util_1.toCloudFormation(stack)).toEqual({
            Description: 'StackDescription',
            Transform: ['Transform', 'DeprecatedField'],
            AWSTemplateFormatVersion: 'TemplateVersion',
            Metadata: { MetadataKey: 'MetadataValue' },
        });
    });
    test('stack.templateOptions.transforms removes duplicate values', () => {
        const stack = new lib_1.Stack();
        stack.templateOptions.transforms = ['A', 'B', 'C', 'A'];
        expect(util_1.toCloudFormation(stack)).toEqual({
            Transform: ['A', 'B', 'C'],
        });
    });
    test('stack.addTransform() adds a transform', () => {
        const stack = new lib_1.Stack();
        stack.addTransform('A');
        stack.addTransform('B');
        stack.addTransform('C');
        expect(util_1.toCloudFormation(stack)).toEqual({
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
        const output = util_1.toCloudFormation(stack);
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
    cdk_build_tools_1.testDeprecated('Include should support non-hash top-level template elements like "Description"', () => {
        const stack = new lib_1.Stack();
        const template = {
            Description: 'hello, world',
        };
        new lib_1.CfnInclude(stack, 'Include', { template });
        const output = util_1.toCloudFormation(stack);
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
                    lib_1.validateString(props).assertSuccess();
                });
            }
        }
        new CfnTest(stack, 'MyThing', { type: 'AWS::Type' });
        // THEN
        refs_1.resolveReferences(app);
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
        expect(util_1.toCloudFormation(stack)).toEqual({
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
        expect(util_1.toCloudFormation(stack)).toEqual({
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
        expect(util_1.toCloudFormation(stack)).toEqual({
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
        expect(util_1.toCloudFormation(stack)).toEqual({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2sudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0YWNrLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw4REFBMEQ7QUFDMUQseUNBQXlDO0FBQ3pDLHNEQUF3RDtBQUN4RCwyQ0FBNkM7QUFDN0MsaUNBQTBDO0FBQzFDLGdDQVVnQjtBQUNoQix3REFBcUQ7QUFDckQsOENBQXdEO0FBQ3hELHNDQUErQztBQUUvQyxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtJQUNyQixJQUFJLENBQUMsaUZBQWlGLEVBQUUsR0FBRyxFQUFFO1FBQzNGLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxFQUFFLENBQUM7UUFDMUIsTUFBTSxDQUFDLHVCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUcsQ0FBQyxDQUFDO0lBQy9DLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHlDQUF5QyxFQUFFLEdBQUcsRUFBRTtRQUNuRCxRQUFRO1FBQ1IsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDeEIsTUFBTSxtQkFBbUIsR0FBRyxtSkFBbUosQ0FBQztRQUVoTCxPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLElBQUksV0FBSyxDQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUU7Z0JBQ3hCLFNBQVMsRUFBRSxtQkFBbUI7YUFDL0IsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHNEQUFzRCxtQkFBbUIsR0FBRyxDQUFDLENBQUM7SUFDM0YsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsMkZBQTJGLEVBQUUsR0FBRyxFQUFFO1FBQ3JHLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxFQUFFLENBQUM7UUFDMUIsS0FBSyxDQUFDLGVBQWUsQ0FBQyxxQkFBcUIsR0FBRyxtQkFBbUIsQ0FBQztRQUNsRSxLQUFLLENB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QU8sUUFBUSxDQUFDO0tBQ2pCO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0ZXN0RGVwcmVjYXRlZCB9IGZyb20gJ0Bhd3MtY2RrL2Nkay1idWlsZC10b29scyc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgRmFjdCwgUmVnaW9uSW5mbyB9IGZyb20gJ0Bhd3MtY2RrL3JlZ2lvbi1pbmZvJztcbmltcG9ydCB7IENvbnN0cnVjdCwgTm9kZSB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgdG9DbG91ZEZvcm1hdGlvbiB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQge1xuICBBcHAsIENmbkNvbmRpdGlvbiwgQ2ZuSW5jbHVkZSwgQ2ZuT3V0cHV0LCBDZm5QYXJhbWV0ZXIsXG4gIENmblJlc291cmNlLCBMYXp5LCBTY29wZWRBd3MsIFN0YWNrLCB2YWxpZGF0ZVN0cmluZyxcbiAgVGFncywgTGVnYWN5U3RhY2tTeW50aGVzaXplciwgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIsXG4gIE5lc3RlZFN0YWNrLFxuICBBd3MsIEZuLCBSZXNvbHV0aW9uVHlwZUhpbnQsXG4gIFBlcm1pc3Npb25zQm91bmRhcnksXG4gIFBFUk1JU1NJT05TX0JPVU5EQVJZX0NPTlRFWFRfS0VZLFxuICBBc3BlY3RzLFxuICBTdGFnZSxcbn0gZnJvbSAnLi4vbGliJztcbmltcG9ydCB7IEludHJpbnNpYyB9IGZyb20gJy4uL2xpYi9wcml2YXRlL2ludHJpbnNpYyc7XG5pbXBvcnQgeyByZXNvbHZlUmVmZXJlbmNlcyB9IGZyb20gJy4uL2xpYi9wcml2YXRlL3JlZnMnO1xuaW1wb3J0IHsgUG9zdFJlc29sdmVUb2tlbiB9IGZyb20gJy4uL2xpYi91dGlsJztcblxuZGVzY3JpYmUoJ3N0YWNrJywgKCkgPT4ge1xuICB0ZXN0KCdhIHN0YWNrIGNhbiBiZSBzZXJpYWxpemVkIGludG8gYSBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZSwgaW5pdGlhbGx5IGl0XFwncyBlbXB0eScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7IH0pO1xuICB9KTtcblxuICB0ZXN0KCdzdGFjayBuYW1lIGNhbm5vdCBleGNlZWQgMTI4IGNoYXJhY3RlcnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHt9KTtcbiAgICBjb25zdCByZWFsbHlMb25nU3RhY2tOYW1lID0gJ0xvb2tBdE15UmVhbGx5TG9uZ1N0YWNrTmFtZVRoaXNTdGFja05hbWVJc0xvbmdlclRoYW4xMjhDaGFyYWN0ZXJzVGhhdElzTnV0c0lEb250VGhpbmtUaGVyZUlzRW5vdWdoQVdTQXZhaWxhYmxlVG9MZXRFdmVyeW9uZUhhdmVTdGFja05hbWVzVGhpc0xvbmcnO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgU3RhY2soYXBwLCAnTXlTdGFjaycsIHtcbiAgICAgICAgc3RhY2tOYW1lOiByZWFsbHlMb25nU3RhY2tOYW1lLFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdyhgU3RhY2sgbmFtZSBtdXN0IGJlIDw9IDEyOCBjaGFyYWN0ZXJzLiBTdGFjayBuYW1lOiAnJHtyZWFsbHlMb25nU3RhY2tOYW1lfSdgKTtcbiAgfSk7XG5cbiAgdGVzdCgnc3RhY2sgb2JqZWN0cyBoYXZlIHNvbWUgdGVtcGxhdGUtbGV2ZWwgcHJvcGV0aWVzLCBzdWNoIGFzIERlc2NyaXB0aW9uLCBWZXJzaW9uLCBUcmFuc2Zvcm0nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBzdGFjay50ZW1wbGF0ZU9wdGlvbnMudGVtcGxhdGVGb3JtYXRWZXJzaW9uID0gJ015VGVtcGxhdGVWZXJzaW9uJztcbiAgICBzdGFjay50ZW1wbGF0ZU9wdGlvbnMuZGVzY3JpcHRpb24gPSAnVGhpcyBpcyBteSBkZXNjcmlwdGlvbic7XG4gICAgc3RhY2sudGVtcGxhdGVPcHRpb25zLnRyYW5zZm9ybXMgPSBbJ1NBTXknXTtcbiAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgRGVzY3JpcHRpb246ICdUaGlzIGlzIG15IGRlc2NyaXB0aW9uJyxcbiAgICAgIEFXU1RlbXBsYXRlRm9ybWF0VmVyc2lvbjogJ015VGVtcGxhdGVWZXJzaW9uJyxcbiAgICAgIFRyYW5zZm9ybTogJ1NBTXknLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdTdGFjay5pc1N0YWNrIGluZGljYXRlcyB0aGF0IGEgY29uc3RydWN0IGlzIGEgc3RhY2snLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBjID0gbmV3IENvbnN0cnVjdChzdGFjaywgJ0NvbnN0cnVjdCcpO1xuICAgIGV4cGVjdChTdGFjay5pc1N0YWNrKHN0YWNrKSkudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3QoIVN0YWNrLmlzU3RhY2soYykpLnRvQmVEZWZpbmVkKCk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N0YWNrLmlkIGlzIG5vdCBpbmNsdWRlZCBpbiB0aGUgbG9naWNhbCBpZGVudGl0aWVzIG9mIHJlc291cmNlcyB3aXRoaW4gaXQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2sodW5kZWZpbmVkLCAnTXlTdGFjaycpO1xuICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ015UmVzb3VyY2UnLCB7IHR5cGU6ICdNeVJlc291cmNlVHlwZScgfSk7XG5cbiAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoeyBSZXNvdXJjZXM6IHsgTXlSZXNvdXJjZTogeyBUeXBlOiAnTXlSZXNvdXJjZVR5cGUnIH0gfSB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnd2hlbiBzdGFja1Jlc291cmNlTGltaXQgaXMgZGVmYXVsdCwgc2hvdWxkIGdpdmUgZXJyb3InLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHt9KTtcblxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ015U3RhY2snKTtcblxuICAgIC8vIFdIRU5cbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgMTAwMDsgaW5kZXgrKykge1xuICAgICAgbmV3IENmblJlc291cmNlKHN0YWNrLCBgTXlSZXNvdXJjZS0ke2luZGV4fWAsIHsgdHlwZTogJ015UmVzb3VyY2VUeXBlJyB9KTtcbiAgICB9XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgYXBwLnN5bnRoKCk7XG4gICAgfSkudG9UaHJvdygnTnVtYmVyIG9mIHJlc291cmNlcyBpbiBzdGFjayBcXCdNeVN0YWNrXFwnOiAxMDAwIGlzIGdyZWF0ZXIgdGhhbiBhbGxvd2VkIG1heGltdW0gb2YgNTAwJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3doZW4gc3RhY2tSZXNvdXJjZUxpbWl0IGlzIGRlZmluZWQsIHNob3VsZCBnaXZlIHRoZSBwcm9wZXIgZXJyb3InLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgJ0Bhd3MtY2RrL2NvcmU6c3RhY2tSZXNvdXJjZUxpbWl0JzogMTAwLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ015U3RhY2snKTtcblxuICAgIC8vIFdIRU5cbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgMjAwOyBpbmRleCsrKSB7XG4gICAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssIGBNeVJlc291cmNlLSR7aW5kZXh9YCwgeyB0eXBlOiAnTXlSZXNvdXJjZVR5cGUnIH0pO1xuICAgIH1cblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBhcHAuc3ludGgoKTtcbiAgICB9KS50b1Rocm93KCdOdW1iZXIgb2YgcmVzb3VyY2VzIGluIHN0YWNrIFxcJ015U3RhY2tcXCc6IDIwMCBpcyBncmVhdGVyIHRoYW4gYWxsb3dlZCBtYXhpbXVtIG9mIDEwMCcpO1xuICB9KTtcblxuICB0ZXN0KCd3aGVuIHN0YWNrUmVzb3VyY2VMaW1pdCBpcyAwLCBzaG91bGQgbm90IGdpdmUgZXJyb3InLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgJ0Bhd3MtY2RrL2NvcmU6c3RhY2tSZXNvdXJjZUxpbWl0JzogMCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdNeVN0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IDEwMDA7IGluZGV4KyspIHtcbiAgICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjaywgYE15UmVzb3VyY2UtJHtpbmRleH1gLCB7IHR5cGU6ICdNeVJlc291cmNlVHlwZScgfSk7XG4gICAgfVxuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGFwcC5zeW50aCgpO1xuICAgIH0pLm5vdC50b1Rocm93KCk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N0YWNrLnRlbXBsYXRlT3B0aW9ucyBjYW4gYmUgdXNlZCB0byBzZXQgdGVtcGxhdGUtbGV2ZWwgb3B0aW9ucycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgc3RhY2sudGVtcGxhdGVPcHRpb25zLmRlc2NyaXB0aW9uID0gJ1N0YWNrRGVzY3JpcHRpb24nO1xuICAgIHN0YWNrLnRlbXBsYXRlT3B0aW9ucy50ZW1wbGF0ZUZvcm1hdFZlcnNpb24gPSAnVGVtcGxhdGVWZXJzaW9uJztcbiAgICBzdGFjay50ZW1wbGF0ZU9wdGlvbnMudHJhbnNmb3JtID0gJ0RlcHJlY2F0ZWRGaWVsZCc7XG4gICAgc3RhY2sudGVtcGxhdGVPcHRpb25zLnRyYW5zZm9ybXMgPSBbJ1RyYW5zZm9ybSddO1xuICAgIHN0YWNrLnRlbXBsYXRlT3B0aW9ucy5tZXRhZGF0YSA9IHtcbiAgICAgIE1ldGFkYXRhS2V5OiAnTWV0YWRhdGFWYWx1ZScsXG4gICAgfTtcblxuICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICBEZXNjcmlwdGlvbjogJ1N0YWNrRGVzY3JpcHRpb24nLFxuICAgICAgVHJhbnNmb3JtOiBbJ1RyYW5zZm9ybScsICdEZXByZWNhdGVkRmllbGQnXSxcbiAgICAgIEFXU1RlbXBsYXRlRm9ybWF0VmVyc2lvbjogJ1RlbXBsYXRlVmVyc2lvbicsXG4gICAgICBNZXRhZGF0YTogeyBNZXRhZGF0YUtleTogJ01ldGFkYXRhVmFsdWUnIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N0YWNrLnRlbXBsYXRlT3B0aW9ucy50cmFuc2Zvcm1zIHJlbW92ZXMgZHVwbGljYXRlIHZhbHVlcycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgc3RhY2sudGVtcGxhdGVPcHRpb25zLnRyYW5zZm9ybXMgPSBbJ0EnLCAnQicsICdDJywgJ0EnXTtcblxuICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICBUcmFuc2Zvcm06IFsnQScsICdCJywgJ0MnXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnc3RhY2suYWRkVHJhbnNmb3JtKCkgYWRkcyBhIHRyYW5zZm9ybScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgc3RhY2suYWRkVHJhbnNmb3JtKCdBJyk7XG4gICAgc3RhY2suYWRkVHJhbnNmb3JtKCdCJyk7XG4gICAgc3RhY2suYWRkVHJhbnNmb3JtKCdDJyk7XG5cbiAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgVHJhbnNmb3JtOiBbJ0EnLCAnQicsICdDJ10sXG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIFRoaXMgYXBwcm9hY2ggd2lsbCBvbmx5IGFwcGx5IHRvIFR5cGVTY3JpcHQgY29kZSwgYnV0IGF0IGxlYXN0IGl0J3MgYSB0ZW1wb3JhcnlcbiAgLy8gd29ya2Fyb3VuZCBmb3IgcGVvcGxlIHJ1bm5pbmcgaW50byBpc3N1ZXMgY2F1c2VkIGJ5IFNESy0zMDAzLlxuICAvLyBXZSBzaG91bGQgY29tZSB1cCB3aXRoIGEgcHJvcGVyIHNvbHV0aW9uIHRoYXQgaW52b2x2ZWQganNpaSBjYWxsYmFja3MgKHdoZW4gdGhleSBleGlzdClcbiAgLy8gc28gdGhpcyBjYW4gYmUgaW1wbGVtZW50ZWQgYnkganNpaSBsYW5ndWFnZXMgYXMgd2VsbC5cbiAgdGVzdCgnT3ZlcnJpZGluZyBgU3RhY2suX3RvQ2xvdWRGb3JtYXRpb25gIGFsbG93cyBhcmJpdHJhcnkgcG9zdC1wcm9jZXNzaW5nIG9mIHRoZSBnZW5lcmF0ZWQgdGVtcGxhdGUgZHVyaW5nIHN5bnRoZXNpcycsICgpID0+IHtcblxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrV2l0aFBvc3RQcm9jZXNzb3IoKTtcblxuICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ215UmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnQVdTOjpNeVJlc291cmNlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgTXlQcm9wMTogJ2hlbGxvJyxcbiAgICAgICAgTXlQcm9wMjogJ2hvd2R5JyxcbiAgICAgICAgRW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICBLZXk6ICd2YWx1ZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHN0YWNrLl90b0Nsb3VkRm9ybWF0aW9uKCkpLnRvRXF1YWwoe1xuICAgICAgUmVzb3VyY2VzOlxuICAgICAge1xuICAgICAgICBteVJlc291cmNlOlxuICAgICAgICAge1xuICAgICAgICAgICBUeXBlOiAnQVdTOjpNeVJlc291cmNlJyxcbiAgICAgICAgICAgUHJvcGVydGllczpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBNeVByb3AxOiAnaGVsbG8nLFxuICAgICAgICAgICAgTXlQcm9wMjogJ2hvd2R5JyxcbiAgICAgICAgICAgIEVudmlyb25tZW50OiB7IGtleTogJ3ZhbHVlJyB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnU3RhY2suZ2V0QnlQYXRoIGNhbiBiZSB1c2VkIHRvIGZpbmQgYW55IENsb3VkRm9ybWF0aW9uIGVsZW1lbnQgKFBhcmFtZXRlciwgT3V0cHV0LCBldGMpJywgKCkgPT4ge1xuXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IHAgPSBuZXcgQ2ZuUGFyYW1ldGVyKHN0YWNrLCAnTXlQYXJhbScsIHsgdHlwZTogJ1N0cmluZycgfSk7XG4gICAgY29uc3QgbyA9IG5ldyBDZm5PdXRwdXQoc3RhY2ssICdNeU91dHB1dCcsIHsgdmFsdWU6ICdib29tJyB9KTtcbiAgICBjb25zdCBjID0gbmV3IENmbkNvbmRpdGlvbihzdGFjaywgJ015Q29uZGl0aW9uJyk7XG5cbiAgICBleHBlY3Qoc3RhY2subm9kZS5maW5kQ2hpbGQocC5ub2RlLmlkKSkudG9FcXVhbChwKTtcbiAgICBleHBlY3Qoc3RhY2subm9kZS5maW5kQ2hpbGQoby5ub2RlLmlkKSkudG9FcXVhbChvKTtcbiAgICBleHBlY3Qoc3RhY2subm9kZS5maW5kQ2hpbGQoYy5ub2RlLmlkKSkudG9FcXVhbChjKTtcbiAgfSk7XG5cbiAgdGVzdCgnU3RhY2sgbmFtZXMgY2FuIGhhdmUgaHlwaGVucyBpbiB0aGVtJywgKCkgPT4ge1xuICAgIGNvbnN0IHJvb3QgPSBuZXcgQXBwKCk7XG5cbiAgICBuZXcgU3RhY2socm9vdCwgJ0hlbGxvLVdvcmxkJyk7XG4gICAgLy8gRGlkIG5vdCB0aHJvd1xuICB9KTtcblxuICB0ZXN0KCdTdGFja3MgY2FuIGhhdmUgYSBkZXNjcmlwdGlvbiBnaXZlbiB0byB0aGVtJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKG5ldyBBcHAoKSwgJ015U3RhY2snLCB7IGRlc2NyaXB0aW9uOiAnTXkgc3RhY2ssIGhhbmRzIG9mZiEnIH0pO1xuICAgIGNvbnN0IG91dHB1dCA9IHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spO1xuICAgIGV4cGVjdChvdXRwdXQuRGVzY3JpcHRpb24pLnRvRXF1YWwoJ015IHN0YWNrLCBoYW5kcyBvZmYhJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ1N0YWNrIGRlc2NyaXB0aW9ucyBoYXZlIGEgbGltaXRlZCBsZW5ndGgnLCAoKSA9PiB7XG4gICAgY29uc3QgZGVzYyA9IGBMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LCBzZWQgZG8gZWl1c21vZCB0ZW1wb3JcbiAgICAgaW5jaWRpZHVudCB1dCBsYWJvcmUgZXQgZG9sb3JlIG1hZ25hIGFsaXF1YS4gQ29uc2VxdWF0IGludGVyZHVtIHZhcml1cyBzaXQgYW1ldCBtYXR0aXMgdnVscHV0YXRlXG4gICAgIGVuaW0gbnVsbGEgYWxpcXVldC4gQXQgaW1wZXJkaWV0IGR1aSBhY2N1bXNhbiBzaXQgYW1ldCBudWxsYSBmYWNpbGlzaSBtb3JiaS4gRWdldCBsb3JlbSBkb2xvciBzZWRcbiAgICAgdml2ZXJyYSBpcHN1bS4gRGlhbSB2b2x1dHBhdCBjb21tb2RvIHNlZCBlZ2VzdGFzIGVnZXN0YXMuIFNpdCBhbWV0IHBvcnR0aXRvciBlZ2V0IGRvbG9yIG1vcmJpIG5vbi5cbiAgICAgTG9yZW0gZG9sb3Igc2VkIHZpdmVycmEgaXBzdW0uIElkIHBvcnRhIG5pYmggdmVuZW5hdGlzIGNyYXMgc2VkIGZlbGlzLiBBdWd1ZSBpbnRlcmR1bSB2ZWxpdCBldWlzbW9kXG4gICAgIGluIHBlbGxlbnRlc3F1ZS4gU3VzY2lwaXQgYWRpcGlzY2luZyBiaWJlbmR1bSBlc3QgdWx0cmljaWVzIGludGVnZXIgcXVpcy4gQ29uZGltZW50dW0gaWQgdmVuZW5hdGlzIGFcbiAgICAgY29uZGltZW50dW0gdml0YWUgc2FwaWVuIHBlbGxlbnRlc3F1ZSBoYWJpdGFudCBtb3JiaS4gQ29uZ3VlIG1hdXJpcyByaG9uY3VzIGFlbmVhbiB2ZWwgZWxpdCBzY2VsZXJpc3F1ZVxuICAgICBtYXVyaXMgcGVsbGVudGVzcXVlIHB1bHZpbmFyLlxuICAgICBGYXVjaWJ1cyBwdXJ1cyBpbiBtYXNzYSB0ZW1wb3IgbmVjLiBSaXN1cyB2aXZlcnJhIGFkaXBpc2NpbmcgYXQgaW4uIEludGVnZXIgZmV1Z2lhdCBzY2VsZXJpc3F1ZSB2YXJpdXNcbiAgICAgbW9yYmkuIE1hbGVzdWFkYSBudW5jIHZlbCByaXN1cyBjb21tb2RvIHZpdmVycmEgbWFlY2VuYXMgYWNjdW1zYW4gbGFjdXMuIFZ1bHB1dGF0ZSBzYXBpZW4gbmVjIHNhZ2l0dGlzXG4gICAgIGFsaXF1YW0gbWFsZXN1YWRhIGJpYmVuZHVtIGFyY3Ugdml0YWUuIEF1Z3VlIG5lcXVlIGdyYXZpZGEgaW4gZmVybWVudHVtIGV0IHNvbGxpY2l0dWRpbiBhYyBvcmNpIHBoYXNlbGx1cy5cbiAgICAgVWx0cmljZXMgdGluY2lkdW50IGFyY3Ugbm9uIHNvZGFsZXMgbmVxdWUgc29kYWxlcy5gO1xuICAgIGV4cGVjdCgoKSA9PiBuZXcgU3RhY2sobmV3IEFwcCgpLCAnTXlTdGFjaycsIHsgZGVzY3JpcHRpb246IGRlc2MgfSkpO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnSW5jbHVkZSBzaG91bGQgc3VwcG9ydCBub24taGFzaCB0b3AtbGV2ZWwgdGVtcGxhdGUgZWxlbWVudHMgbGlrZSBcIkRlc2NyaXB0aW9uXCInLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IHRlbXBsYXRlID0ge1xuICAgICAgRGVzY3JpcHRpb246ICdoZWxsbywgd29ybGQnLFxuICAgIH07XG5cbiAgICBuZXcgQ2ZuSW5jbHVkZShzdGFjaywgJ0luY2x1ZGUnLCB7IHRlbXBsYXRlIH0pO1xuXG4gICAgY29uc3Qgb3V0cHV0ID0gdG9DbG91ZEZvcm1hdGlvbihzdGFjayk7XG5cbiAgICBleHBlY3QodHlwZW9mIG91dHB1dC5EZXNjcmlwdGlvbikudG9FcXVhbCgnc3RyaW5nJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ1BzZXVkbyB2YWx1ZXMgYXR0YWNoZWQgdG8gb25lIHN0YWNrIGNhbiBiZSByZWZlcmVuY2VkIGluIGFub3RoZXIgc3RhY2snLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHsgY29udGV4dDogeyBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UgfSB9KTtcbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2sxJyk7XG4gICAgY29uc3QgYWNjb3VudDEgPSBuZXcgU2NvcGVkQXdzKHN0YWNrMSkuYWNjb3VudElkO1xuICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhhcHAsICdTdGFjazInKTtcblxuICAgIC8vIFdIRU4gLSB1c2VkIGluIGFub3RoZXIgc3RhY2tcbiAgICBuZXcgQ2ZuUGFyYW1ldGVyKHN0YWNrMiwgJ1NvbWVQYXJhbWV0ZXInLCB7IHR5cGU6ICdTdHJpbmcnLCBkZWZhdWx0OiBhY2NvdW50MSB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgIGNvbnN0IHRlbXBsYXRlMSA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrMS5zdGFja05hbWUpLnRlbXBsYXRlO1xuICAgIGNvbnN0IHRlbXBsYXRlMiA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrMi5zdGFja05hbWUpLnRlbXBsYXRlO1xuXG4gICAgZXhwZWN0KHRlbXBsYXRlMSkudG9FcXVhbCh7XG4gICAgICBPdXRwdXRzOiB7XG4gICAgICAgIEV4cG9ydHNPdXRwdXRSZWZBV1NBY2NvdW50SWRBRDU2ODA1Nzoge1xuICAgICAgICAgIFZhbHVlOiB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LFxuICAgICAgICAgIEV4cG9ydDogeyBOYW1lOiAnU3RhY2sxOkV4cG9ydHNPdXRwdXRSZWZBV1NBY2NvdW50SWRBRDU2ODA1NycgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBleHBlY3QodGVtcGxhdGUyKS50b0VxdWFsKHtcbiAgICAgIFBhcmFtZXRlcnM6IHtcbiAgICAgICAgU29tZVBhcmFtZXRlcjoge1xuICAgICAgICAgIFR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIERlZmF1bHQ6IHsgJ0ZuOjpJbXBvcnRWYWx1ZSc6ICdTdGFjazE6RXhwb3J0c091dHB1dFJlZkFXU0FjY291bnRJZEFENTY4MDU3JyB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQ3Jvc3Mtc3RhY2sgcmVmZXJlbmNlcyBhcmUgZGV0ZWN0ZWQgaW4gcmVzb3VyY2UgcHJvcGVydGllcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2sxJyk7XG4gICAgY29uc3QgcmVzb3VyY2UxID0gbmV3IENmblJlc291cmNlKHN0YWNrMSwgJ1Jlc291cmNlJywgeyB0eXBlOiAnQkxBJyB9KTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJyk7XG5cbiAgICAvLyBXSEVOIC0gdXNlZCBpbiBhbm90aGVyIHJlc291cmNlXG4gICAgbmV3IENmblJlc291cmNlKHN0YWNrMiwgJ1NvbWVSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdBV1M6OlNvbWU6OlJlc291cmNlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgc29tZVByb3BlcnR5OiBuZXcgSW50cmluc2ljKHJlc291cmNlMS5yZWYpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgIGNvbnN0IHRlbXBsYXRlMiA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrMi5zdGFja05hbWUpLnRlbXBsYXRlO1xuXG4gICAgZXhwZWN0KHRlbXBsYXRlMj8uUmVzb3VyY2VzKS50b0VxdWFsKHtcbiAgICAgIFNvbWVSZXNvdXJjZToge1xuICAgICAgICBUeXBlOiAnQVdTOjpTb21lOjpSZXNvdXJjZScsXG4gICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICBzb21lUHJvcGVydHk6IHsgJ0ZuOjpJbXBvcnRWYWx1ZSc6ICdTdGFjazE6RXhwb3J0c091dHB1dFJlZlJlc291cmNlMUQ1RDkwNUEnIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdDcm9zcy1zdGFjayBleHBvcnQgbmFtZXMgYWNjb3VudCBmb3Igc3RhY2sgbmFtZSBsZW5ndGhzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdTdGFjazEnLCB7XG4gICAgICBzdGFja05hbWU6ICdTb1RoaXNDb3VsZFBvdGVudGlhbGx5QmVBVmVyeUxvbmdTdGFja05hbWUnLFxuICAgIH0pO1xuICAgIGxldCBzY29wZTogQ29uc3RydWN0ID0gc3RhY2sxO1xuXG4gICAgLy8gV0hFTiAtIGRlZXBseSBuZXN0ZWRcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDUwOyBpKyspIHtcbiAgICAgIHNjb3BlID0gbmV3IENvbnN0cnVjdChzY29wZSwgYENoaWxkQ29uc3RydWN0JHtpfWApO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc291cmNlMSA9IG5ldyBDZm5SZXNvdXJjZShzY29wZSwgJ1Jlc291cmNlJywgeyB0eXBlOiAnQkxBJyB9KTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJyk7XG5cbiAgICAvLyBXSEVOIC0gdXNlZCBpbiBhbm90aGVyIHJlc291cmNlXG4gICAgbmV3IENmblJlc291cmNlKHN0YWNrMiwgJ1NvbWVSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdBV1M6OlNvbWU6OlJlc291cmNlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgc29tZVByb3BlcnR5OiBuZXcgSW50cmluc2ljKHJlc291cmNlMS5yZWYpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgIGNvbnN0IHRlbXBsYXRlMSA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrMS5zdGFja05hbWUpLnRlbXBsYXRlO1xuXG4gICAgY29uc3QgdGhlT3V0cHV0ID0gdGVtcGxhdGUxLk91dHB1dHNbT2JqZWN0LmtleXModGVtcGxhdGUxLk91dHB1dHMpWzBdXTtcbiAgICBleHBlY3QodGhlT3V0cHV0LkV4cG9ydC5OYW1lLmxlbmd0aCkudG9FcXVhbCgyNTUpO1xuICB9KTtcblxuICB0ZXN0KCdDcm9zcy1zdGFjayByZWZlcmVuY2UgZXhwb3J0IG5hbWVzIGFyZSByZWxhdGl2ZSB0byB0aGUgc3RhY2sgKHdoZW4gdGhlIGZsYWcgaXMgc2V0KScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoe1xuICAgICAgY29udGV4dDoge1xuICAgICAgICAnQGF3cy1jZGsvY29yZTpzdGFja1JlbGF0aXZlRXhwb3J0cyc6ICd0cnVlJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3QgaW5kaWZmZXJlbnRTY29wZSA9IG5ldyBDb25zdHJ1Y3QoYXBwLCAnRXh0cmFTY29wZScpO1xuXG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGluZGlmZmVyZW50U2NvcGUsICdTdGFjazEnLCB7XG4gICAgICBzdGFja05hbWU6ICdTdGFjazEnLFxuICAgIH0pO1xuICAgIGNvbnN0IHJlc291cmNlMSA9IG5ldyBDZm5SZXNvdXJjZShzdGFjazEsICdSZXNvdXJjZScsIHsgdHlwZTogJ0JMQScgfSk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGluZGlmZmVyZW50U2NvcGUsICdTdGFjazInKTtcblxuICAgIC8vIFdIRU4gLSB1c2VkIGluIGFub3RoZXIgcmVzb3VyY2VcbiAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2syLCAnU29tZVJlc291cmNlJywge1xuICAgICAgdHlwZTogJ0FXUzo6U29tZTo6UmVzb3VyY2UnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBzb21lUHJvcGVydHk6IG5ldyBJbnRyaW5zaWMocmVzb3VyY2UxLnJlZiksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgY29uc3QgdGVtcGxhdGUyID0gYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoc3RhY2syLnN0YWNrTmFtZSkudGVtcGxhdGU7XG5cbiAgICBleHBlY3QodGVtcGxhdGUyPy5SZXNvdXJjZXMpLnRvRXF1YWwoe1xuICAgICAgU29tZVJlc291cmNlOiB7XG4gICAgICAgIFR5cGU6ICdBV1M6OlNvbWU6OlJlc291cmNlJyxcbiAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgIHNvbWVQcm9wZXJ0eTogeyAnRm46OkltcG9ydFZhbHVlJzogJ1N0YWNrMTpFeHBvcnRzT3V0cHV0UmVmUmVzb3VyY2UxRDVEOTA1QScgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Nyb3NzLXN0YWNrIHJlZmVyZW5jZXMgaW4gbGF6eSB0b2tlbnMgd29yaycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoeyBjb250ZXh0OiB7IFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSB9IH0pO1xuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdTdGFjazEnKTtcbiAgICBjb25zdCBhY2NvdW50MSA9IG5ldyBTY29wZWRBd3Moc3RhY2sxKS5hY2NvdW50SWQ7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMicpO1xuXG4gICAgLy8gV0hFTiAtIHVzZWQgaW4gYW5vdGhlciBzdGFja1xuICAgIG5ldyBDZm5QYXJhbWV0ZXIoc3RhY2syLCAnU29tZVBhcmFtZXRlcicsIHsgdHlwZTogJ1N0cmluZycsIGRlZmF1bHQ6IExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gYWNjb3VudDEgfSkgfSk7XG5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgIGNvbnN0IHRlbXBsYXRlMSA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrMS5zdGFja05hbWUpLnRlbXBsYXRlO1xuICAgIGNvbnN0IHRlbXBsYXRlMiA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrMi5zdGFja05hbWUpLnRlbXBsYXRlO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCh0ZW1wbGF0ZTEpLnRvRXF1YWwoe1xuICAgICAgT3V0cHV0czoge1xuICAgICAgICBFeHBvcnRzT3V0cHV0UmVmQVdTQWNjb3VudElkQUQ1NjgwNTc6IHtcbiAgICAgICAgICBWYWx1ZTogeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgICBFeHBvcnQ6IHsgTmFtZTogJ1N0YWNrMTpFeHBvcnRzT3V0cHV0UmVmQVdTQWNjb3VudElkQUQ1NjgwNTcnIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHRlbXBsYXRlMikudG9FcXVhbCh7XG4gICAgICBQYXJhbWV0ZXJzOiB7XG4gICAgICAgIFNvbWVQYXJhbWV0ZXI6IHtcbiAgICAgICAgICBUeXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBEZWZhdWx0OiB7ICdGbjo6SW1wb3J0VmFsdWUnOiAnU3RhY2sxOkV4cG9ydHNPdXRwdXRSZWZBV1NBY2NvdW50SWRBRDU2ODA1NycgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0Nyb3NzLXN0YWNrIHVzZSBvZiBSZWdpb24gYW5kIGFjY291bnQgcmV0dXJucyBub25zY29wZWQgaW50cmluc2ljIGJlY2F1c2UgdGhlIHR3byBzdGFja3MgbXVzdCBiZSBpbiB0aGUgc2FtZSByZWdpb24gYW55d2F5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdTdGFjazEnKTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJyk7XG5cbiAgICAvLyBXSEVOIC0gdXNlZCBpbiBhbm90aGVyIHN0YWNrXG4gICAgbmV3IENmbk91dHB1dChzdGFjazIsICdEZW1PdXRwdXQnLCB7IHZhbHVlOiBzdGFjazEucmVnaW9uIH0pO1xuICAgIG5ldyBDZm5PdXRwdXQoc3RhY2syLCAnRGVtQWNjb3VudCcsIHsgdmFsdWU6IHN0YWNrMS5hY2NvdW50IH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgY29uc3QgdGVtcGxhdGUyID0gYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoc3RhY2syLnN0YWNrTmFtZSkudGVtcGxhdGU7XG5cbiAgICBleHBlY3QodGVtcGxhdGUyPy5PdXRwdXRzKS50b0VxdWFsKHtcbiAgICAgIERlbU91dHB1dDoge1xuICAgICAgICBWYWx1ZTogeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgIH0sXG4gICAgICBEZW1BY2NvdW50OiB7XG4gICAgICAgIFZhbHVlOiB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3Jvc3Mtc3RhY2sgcmVmZXJlbmNlcyBpbiBzdHJpbmdzIHdvcmsnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHsgY29udGV4dDogeyBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UgfSB9KTtcbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2sxJyk7XG4gICAgY29uc3QgYWNjb3VudDEgPSBuZXcgU2NvcGVkQXdzKHN0YWNrMSkuYWNjb3VudElkO1xuICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhhcHAsICdTdGFjazInKTtcblxuICAgIC8vIFdIRU4gLSB1c2VkIGluIGFub3RoZXIgc3RhY2tcbiAgICBuZXcgQ2ZuUGFyYW1ldGVyKHN0YWNrMiwgJ1NvbWVQYXJhbWV0ZXInLCB7IHR5cGU6ICdTdHJpbmcnLCBkZWZhdWx0OiBgVGhlQWNjb3VudElzJHthY2NvdW50MX1gIH0pO1xuXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCB0ZW1wbGF0ZTIgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjazIuc3RhY2tOYW1lKS50ZW1wbGF0ZTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodGVtcGxhdGUyKS50b0VxdWFsKHtcbiAgICAgIFBhcmFtZXRlcnM6IHtcbiAgICAgICAgU29tZVBhcmFtZXRlcjoge1xuICAgICAgICAgIFR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIERlZmF1bHQ6IHsgJ0ZuOjpKb2luJzogWycnLCBbJ1RoZUFjY291bnRJcycsIHsgJ0ZuOjpJbXBvcnRWYWx1ZSc6ICdTdGFjazE6RXhwb3J0c091dHB1dFJlZkFXU0FjY291bnRJZEFENTY4MDU3JyB9XV0gfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Nyb3NzLXN0YWNrIHJlZmVyZW5jZXMgb2YgbGlzdHMgcmV0dXJuZWQgZnJvbSBGbjo6R2V0QXR0IHdvcmsnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMScpO1xuICAgIGNvbnN0IGV4cG9ydFJlc291cmNlID0gbmV3IENmblJlc291cmNlKHN0YWNrMSwgJ2V4cG9ydGVkUmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnQkxBJyxcbiAgICB9KTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJyk7XG4gICAgLy8gTDFzIHJlcHJlc2VudCBhdHRyaWJ1dGUgbmFtZXMgd2l0aCBgYXR0ciR7YXR0cmlidXRlTmFtZX1gXG4gICAgKGV4cG9ydFJlc291cmNlIGFzIGFueSkuYXR0ckxpc3QgPSBbJ21hZ2ljLWF0dHItdmFsdWUnXTtcblxuICAgIC8vIFdIRU4gLSB1c2VkIGluIGFub3RoZXIgc3RhY2tcbiAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2syLCAnU29tZVJlc291cmNlJywge1xuICAgICAgdHlwZTogJ0JMQScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIFByb3A6IGV4cG9ydFJlc291cmNlLmdldEF0dCgnTGlzdCcsIFJlc29sdXRpb25UeXBlSGludC5TVFJJTkdfTElTVCksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCB0ZW1wbGF0ZTEgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjazEuc3RhY2tOYW1lKS50ZW1wbGF0ZTtcbiAgICBjb25zdCB0ZW1wbGF0ZTIgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjazIuc3RhY2tOYW1lKS50ZW1wbGF0ZTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodGVtcGxhdGUxKS50b01hdGNoT2JqZWN0KHtcbiAgICAgIE91dHB1dHM6IHtcbiAgICAgICAgRXhwb3J0c091dHB1dEZuR2V0QXR0ZXhwb3J0ZWRSZXNvdXJjZUxpc3QwRUEzRTBEOToge1xuICAgICAgICAgIFZhbHVlOiB7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICd8fCcsIHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdleHBvcnRlZFJlc291cmNlJyxcbiAgICAgICAgICAgICAgICAgICdMaXN0JyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIEV4cG9ydDogeyBOYW1lOiAnU3RhY2sxOkV4cG9ydHNPdXRwdXRGbkdldEF0dGV4cG9ydGVkUmVzb3VyY2VMaXN0MEVBM0UwRDknIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHRlbXBsYXRlMikudG9NYXRjaE9iamVjdCh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgU29tZVJlc291cmNlOiB7XG4gICAgICAgICAgVHlwZTogJ0JMQScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgUHJvcDoge1xuICAgICAgICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICAgICAgICd8fCcsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpJbXBvcnRWYWx1ZSc6ICdTdGFjazE6RXhwb3J0c091dHB1dEZuR2V0QXR0ZXhwb3J0ZWRSZXNvdXJjZUxpc3QwRUEzRTBEOScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Nyb3NzLXN0YWNrIHJlZmVyZW5jZXMgb2YgbGlzdHMgcmV0dXJuZWQgZnJvbSBGbjo6R2V0QXR0IGNhbiBiZSB1c2VkIHdpdGggQ0ZOIGludHJpbnNpY3MnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMScpO1xuICAgIGNvbnN0IGV4cG9ydFJlc291cmNlID0gbmV3IENmblJlc291cmNlKHN0YWNrMSwgJ2V4cG9ydGVkUmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnQkxBJyxcbiAgICB9KTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJyk7XG4gICAgLy8gTDFzIHJlcHJlc2VudCBhdHRyaWJ1dGUgbmFtZXMgd2l0aCBgYXR0ciR7YXR0cmlidXRlTmFtZX1gXG4gICAgKGV4cG9ydFJlc291cmNlIGFzIGFueSkuYXR0ckxpc3QgPSBbJ21hZ2ljLWF0dHItdmFsdWUnXTtcblxuICAgIC8vIFdIRU4gLSB1c2VkIGluIGFub3RoZXIgc3RhY2tcbiAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2syLCAnU29tZVJlc291cmNlJywge1xuICAgICAgdHlwZTogJ0JMQScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIFByb3A6IEZuLnNlbGVjdCgzLCBleHBvcnRSZXNvdXJjZS5nZXRBdHQoJ0xpc3QnLCBSZXNvbHV0aW9uVHlwZUhpbnQuU1RSSU5HX0xJU1QpIGFzIGFueSksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCB0ZW1wbGF0ZTEgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjazEuc3RhY2tOYW1lKS50ZW1wbGF0ZTtcbiAgICBjb25zdCB0ZW1wbGF0ZTIgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjazIuc3RhY2tOYW1lKS50ZW1wbGF0ZTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodGVtcGxhdGUxKS50b01hdGNoT2JqZWN0KHtcbiAgICAgIE91dHB1dHM6IHtcbiAgICAgICAgRXhwb3J0c091dHB1dEZuR2V0QXR0ZXhwb3J0ZWRSZXNvdXJjZUxpc3QwRUEzRTBEOToge1xuICAgICAgICAgIFZhbHVlOiB7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICd8fCcsIHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdleHBvcnRlZFJlc291cmNlJyxcbiAgICAgICAgICAgICAgICAgICdMaXN0JyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIEV4cG9ydDogeyBOYW1lOiAnU3RhY2sxOkV4cG9ydHNPdXRwdXRGbkdldEF0dGV4cG9ydGVkUmVzb3VyY2VMaXN0MEVBM0UwRDknIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHRlbXBsYXRlMikudG9NYXRjaE9iamVjdCh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgU29tZVJlc291cmNlOiB7XG4gICAgICAgICAgVHlwZTogJ0JMQScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgUHJvcDoge1xuICAgICAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgICAgICAzLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgICAgICd8fCcsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OkltcG9ydFZhbHVlJzogJ1N0YWNrMTpFeHBvcnRzT3V0cHV0Rm5HZXRBdHRleHBvcnRlZFJlc291cmNlTGlzdDBFQTNFMEQ5JyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Nyb3NzLXN0YWNrIHJlZmVyZW5jZXMgb2YgbGlzdHMgcmV0dXJuZWQgZnJvbSBGbjo6UmVmIHdvcmsnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMScpO1xuICAgIGNvbnN0IHBhcmFtID0gbmV3IENmblBhcmFtZXRlcihzdGFjazEsICdtYWdpY1BhcmFtZXRlcicsIHtcbiAgICAgIGRlZmF1bHQ6ICdCTEFULEJMQUgnLFxuICAgICAgdHlwZTogJ0xpc3Q8U3RyaW5nPicsXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMicpO1xuXG4gICAgLy8gV0hFTiAtIHVzZWQgaW4gYW5vdGhlciBzdGFja1xuICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjazIsICdTb21lUmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnQkxBJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgUHJvcDogcGFyYW0udmFsdWUsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCB0ZW1wbGF0ZTEgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjazEuc3RhY2tOYW1lKS50ZW1wbGF0ZTtcbiAgICBjb25zdCB0ZW1wbGF0ZTIgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjazIuc3RhY2tOYW1lKS50ZW1wbGF0ZTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodGVtcGxhdGUxKS50b01hdGNoT2JqZWN0KHtcbiAgICAgIE91dHB1dHM6IHtcbiAgICAgICAgRXhwb3J0c091dHB1dFJlZm1hZ2ljUGFyYW1ldGVyNENDNkY3QkU6IHtcbiAgICAgICAgICBWYWx1ZToge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAnfHwnLCB7XG4gICAgICAgICAgICAgICAgUmVmOiAnbWFnaWNQYXJhbWV0ZXInLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIEV4cG9ydDogeyBOYW1lOiAnU3RhY2sxOkV4cG9ydHNPdXRwdXRSZWZtYWdpY1BhcmFtZXRlcjRDQzZGN0JFJyB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGV4cGVjdCh0ZW1wbGF0ZTIpLnRvTWF0Y2hPYmplY3Qoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIFNvbWVSZXNvdXJjZToge1xuICAgICAgICAgIFR5cGU6ICdCTEEnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIFByb3A6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAnfHwnLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdGbjo6SW1wb3J0VmFsdWUnOiAnU3RhY2sxOkV4cG9ydHNPdXRwdXRSZWZtYWdpY1BhcmFtZXRlcjRDQzZGN0JFJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3Jvc3MtcmVnaW9uIHN0YWNrIHJlZmVyZW5jZXMsIGNyb3NzUmVnaW9uUmVmZXJlbmNlcz10cnVlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdTdGFjazEnLCB7IGVudjogeyByZWdpb246ICd1cy1lYXN0LTEnIH0sIGNyb3NzUmVnaW9uUmVmZXJlbmNlczogdHJ1ZSB9KTtcbiAgICBjb25zdCBleHBvcnRSZXNvdXJjZSA9IG5ldyBDZm5SZXNvdXJjZShzdGFjazEsICdTb21lUmVzb3VyY2VFeHBvcnQnLCB7XG4gICAgICB0eXBlOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICB9KTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJywgeyBlbnY6IHsgcmVnaW9uOiAndXMtZWFzdC0yJyB9LCBjcm9zc1JlZ2lvblJlZmVyZW5jZXM6IHRydWUgfSk7XG5cbiAgICAvLyBXSEVOIC0gdXNlZCBpbiBhbm90aGVyIHN0YWNrXG4gICAgbmV3IENmblJlc291cmNlKHN0YWNrMiwgJ1NvbWVSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBOYW1lOiBleHBvcnRSZXNvdXJjZS5nZXRBdHQoJ25hbWUnKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgIGNvbnN0IHRlbXBsYXRlMiA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrMi5zdGFja05hbWUpLnRlbXBsYXRlO1xuICAgIGNvbnN0IHRlbXBsYXRlMSA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrMS5zdGFja05hbWUpLnRlbXBsYXRlO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCh0ZW1wbGF0ZTEpLnRvTWF0Y2hPYmplY3Qoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIFNvbWVSZXNvdXJjZUV4cG9ydDoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgICB9LFxuICAgICAgICBFeHBvcnRzV3JpdGVydXNlYXN0MjgyOEZBMjZCODZGQkVGQTc6IHtcbiAgICAgICAgICBUeXBlOiAnQ3VzdG9tOjpDcm9zc1JlZ2lvbkV4cG9ydFdyaXRlcicsXG4gICAgICAgICAgRGVsZXRpb25Qb2xpY3k6ICdEZWxldGUnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIFdyaXRlclByb3BzOiB7XG4gICAgICAgICAgICAgIGV4cG9ydHM6IHtcbiAgICAgICAgICAgICAgICAnL2Nkay9leHBvcnRzL1N0YWNrMi9TdGFjazF1c2Vhc3QxRm5HZXRBdHRTb21lUmVzb3VyY2VFeHBvcnRuYW1lNDdBRDMwNEYnOiB7XG4gICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgJ1NvbWVSZXNvdXJjZUV4cG9ydCcsXG4gICAgICAgICAgICAgICAgICAgICduYW1lJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0yJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTZXJ2aWNlVG9rZW46IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0N1c3RvbUNyb3NzUmVnaW9uRXhwb3J0V3JpdGVyQ3VzdG9tUmVzb3VyY2VQcm92aWRlckhhbmRsZXJEODc4NkU4QScsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHRlbXBsYXRlMikudG9NYXRjaE9iamVjdCh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgU29tZVJlc291cmNlOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgTmFtZToge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnRXhwb3J0c1JlYWRlcjhCMjQ5NTI0JyxcbiAgICAgICAgICAgICAgICAnL2Nkay9leHBvcnRzL1N0YWNrMi9TdGFjazF1c2Vhc3QxRm5HZXRBdHRTb21lUmVzb3VyY2VFeHBvcnRuYW1lNDdBRDMwNEYnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3Jvc3MtcmVnaW9uIHN0YWNrIHJlZmVyZW5jZXMgdGhyb3dzIGVycm9yJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdTdGFjazEnLCB7IGVudjogeyByZWdpb246ICd1cy1lYXN0LTEnIH0sIGNyb3NzUmVnaW9uUmVmZXJlbmNlczogdHJ1ZSB9KTtcbiAgICBjb25zdCBleHBvcnRSZXNvdXJjZSA9IG5ldyBDZm5SZXNvdXJjZShzdGFjazEsICdTb21lUmVzb3VyY2VFeHBvcnQnLCB7XG4gICAgICB0eXBlOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICB9KTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJywgeyBlbnY6IHsgcmVnaW9uOiAndXMtZWFzdC0yJyB9IH0pO1xuXG4gICAgLy8gV0hFTiAtIHVzZWQgaW4gYW5vdGhlciBzdGFja1xuICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjazIsICdTb21lUmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgTmFtZTogZXhwb3J0UmVzb3VyY2UuZ2V0QXR0KCduYW1lJyksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBhcHAuc3ludGgoKTtcbiAgICB9KS50b1Rocm93KC9TZXQgY3Jvc3NSZWdpb25SZWZlcmVuY2VzPXRydWUgdG8gZW5hYmxlIGNyb3NzIHJlZ2lvbiByZWZlcmVuY2VzLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Nyb3NzIHJlZ2lvbiBzdGFjayByZWZlcmVuY2VzIHdpdGggbXVsdGlwbGUgc3RhY2tzLCBjcm9zc1JlZ2lvblJlZmVyZW5jZXM9dHJ1ZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2sxJywgeyBlbnY6IHsgcmVnaW9uOiAndXMtZWFzdC0xJyB9LCBjcm9zc1JlZ2lvblJlZmVyZW5jZXM6IHRydWUgfSk7XG4gICAgY29uc3QgZXhwb3J0UmVzb3VyY2UgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2sxLCAnU29tZVJlc291cmNlRXhwb3J0Jywge1xuICAgICAgdHlwZTogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2szID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMycsIHsgZW52OiB7IHJlZ2lvbjogJ3VzLWVhc3QtMScgfSwgY3Jvc3NSZWdpb25SZWZlcmVuY2VzOiB0cnVlIH0pO1xuICAgIGNvbnN0IGV4cG9ydFJlc291cmNlMyA9IG5ldyBDZm5SZXNvdXJjZShzdGFjazMsICdTb21lUmVzb3VyY2VFeHBvcnQnLCB7XG4gICAgICB0eXBlOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICB9KTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJywgeyBlbnY6IHsgcmVnaW9uOiAndXMtZWFzdC0yJyB9LCBjcm9zc1JlZ2lvblJlZmVyZW5jZXM6IHRydWUgfSk7XG5cbiAgICAvLyBXSEVOIC0gdXNlZCBpbiBhbm90aGVyIHN0YWNrXG4gICAgbmV3IENmblJlc291cmNlKHN0YWNrMiwgJ1NvbWVSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBOYW1lOiBleHBvcnRSZXNvdXJjZS5nZXRBdHQoJ25hbWUnKSxcbiAgICAgICAgT3RoZXI6IGV4cG9ydFJlc291cmNlLmdldEF0dCgnb3RoZXInKSxcbiAgICAgICAgT3RoZXIyOiBleHBvcnRSZXNvdXJjZTMuZ2V0QXR0KCdvdGhlcjInKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgIGNvbnN0IHRlbXBsYXRlMiA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrMi5zdGFja05hbWUpLnRlbXBsYXRlO1xuICAgIGNvbnN0IHRlbXBsYXRlMyA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrMy5zdGFja05hbWUpLnRlbXBsYXRlO1xuICAgIGNvbnN0IHRlbXBsYXRlMSA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrMS5zdGFja05hbWUpLnRlbXBsYXRlO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCh0ZW1wbGF0ZTIpLnRvTWF0Y2hPYmplY3Qoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIEN1c3RvbUNyb3NzUmVnaW9uRXhwb3J0UmVhZGVyQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJvbGUxMDUzMUJCRDoge1xuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIFBvbGljaWVzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICdzc206QWRkVGFnc1RvUmVzb3VyY2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3NzbTpSZW1vdmVUYWdzRnJvbVJlc291cmNlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdzc206R2V0UGFyYW1ldGVycycsXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzpzc206dXMtZWFzdC0yOicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzpwYXJhbWV0ZXIvY2RrL2V4cG9ydHMvU3RhY2syLyonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFBvbGljeU5hbWU6ICdJbmxpbmUnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFR5cGU6ICdBV1M6OklBTTo6Um9sZScsXG4gICAgICAgIH0sXG4gICAgICAgIEV4cG9ydHNSZWFkZXI4QjI0OTUyNDoge1xuICAgICAgICAgIERlbGV0aW9uUG9saWN5OiAnRGVsZXRlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBSZWFkZXJQcm9wczoge1xuICAgICAgICAgICAgICBpbXBvcnRzOiB7XG4gICAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9TdGFjazIvU3RhY2sxdXNlYXN0MUZuR2V0QXR0U29tZVJlc291cmNlRXhwb3J0bmFtZTQ3QUQzMDRGJzogJ3t7cmVzb2x2ZTpzc206L2Nkay9leHBvcnRzL1N0YWNrMi9TdGFjazF1c2Vhc3QxRm5HZXRBdHRTb21lUmVzb3VyY2VFeHBvcnRuYW1lNDdBRDMwNEZ9fScsXG4gICAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9TdGFjazIvU3RhY2sxdXNlYXN0MUZuR2V0QXR0U29tZVJlc291cmNlRXhwb3J0b3RoZXJDNkY4Q0JEMSc6ICd7e3Jlc29sdmU6c3NtOi9jZGsvZXhwb3J0cy9TdGFjazIvU3RhY2sxdXNlYXN0MUZuR2V0QXR0U29tZVJlc291cmNlRXhwb3J0b3RoZXJDNkY4Q0JEMX19JyxcbiAgICAgICAgICAgICAgICAnL2Nkay9leHBvcnRzL1N0YWNrMi9TdGFjazN1c2Vhc3QxRm5HZXRBdHRTb21lUmVzb3VyY2VFeHBvcnRvdGhlcjIxOTBBNjc5Qic6ICd7e3Jlc29sdmU6c3NtOi9jZGsvZXhwb3J0cy9TdGFjazIvU3RhY2szdXNlYXN0MUZuR2V0QXR0U29tZVJlc291cmNlRXhwb3J0b3RoZXIyMTkwQTY3OUJ9fScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMicsXG4gICAgICAgICAgICAgIHByZWZpeDogJ1N0YWNrMicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU2VydmljZVRva2VuOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdDdXN0b21Dcm9zc1JlZ2lvbkV4cG9ydFJlYWRlckN1c3RvbVJlc291cmNlUHJvdmlkZXJIYW5kbGVyNDY2NDdCNjgnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFR5cGU6ICdDdXN0b206OkNyb3NzUmVnaW9uRXhwb3J0UmVhZGVyJyxcbiAgICAgICAgICBVcGRhdGVSZXBsYWNlUG9saWN5OiAnRGVsZXRlJyxcbiAgICAgICAgfSxcbiAgICAgICAgU29tZVJlc291cmNlOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgTmFtZToge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnRXhwb3J0c1JlYWRlcjhCMjQ5NTI0JyxcbiAgICAgICAgICAgICAgICAnL2Nkay9leHBvcnRzL1N0YWNrMi9TdGFjazF1c2Vhc3QxRm5HZXRBdHRTb21lUmVzb3VyY2VFeHBvcnRuYW1lNDdBRDMwNEYnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIE90aGVyOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdFeHBvcnRzUmVhZGVyOEIyNDk1MjQnLFxuICAgICAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvU3RhY2syL1N0YWNrMXVzZWFzdDFGbkdldEF0dFNvbWVSZXNvdXJjZUV4cG9ydG90aGVyQzZGOENCRDEnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIE90aGVyMjoge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnRXhwb3J0c1JlYWRlcjhCMjQ5NTI0JyxcbiAgICAgICAgICAgICAgICAnL2Nkay9leHBvcnRzL1N0YWNrMi9TdGFjazN1c2Vhc3QxRm5HZXRBdHRTb21lUmVzb3VyY2VFeHBvcnRvdGhlcjIxOTBBNjc5QicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGV4cGVjdCh0ZW1wbGF0ZTMpLnRvTWF0Y2hPYmplY3Qoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIFNvbWVSZXNvdXJjZUV4cG9ydDoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgICB9LFxuICAgICAgICBFeHBvcnRzV3JpdGVydXNlYXN0MjgyOEZBMjZCODZGQkVGQTc6IHtcbiAgICAgICAgICBUeXBlOiAnQ3VzdG9tOjpDcm9zc1JlZ2lvbkV4cG9ydFdyaXRlcicsXG4gICAgICAgICAgRGVsZXRpb25Qb2xpY3k6ICdEZWxldGUnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIFdyaXRlclByb3BzOiB7XG4gICAgICAgICAgICAgIGV4cG9ydHM6IHtcbiAgICAgICAgICAgICAgICAnL2Nkay9leHBvcnRzL1N0YWNrMi9TdGFjazN1c2Vhc3QxRm5HZXRBdHRTb21lUmVzb3VyY2VFeHBvcnRvdGhlcjIxOTBBNjc5Qic6IHtcbiAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAnU29tZVJlc291cmNlRXhwb3J0JyxcbiAgICAgICAgICAgICAgICAgICAgJ290aGVyMicsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU2VydmljZVRva2VuOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdDdXN0b21Dcm9zc1JlZ2lvbkV4cG9ydFdyaXRlckN1c3RvbVJlc291cmNlUHJvdmlkZXJIYW5kbGVyRDg3ODZFOEEnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBleHBlY3QodGVtcGxhdGUxKS50b01hdGNoT2JqZWN0KHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBTb21lUmVzb3VyY2VFeHBvcnQ6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgICAgfSxcbiAgICAgICAgRXhwb3J0c1dyaXRlcnVzZWFzdDI4MjhGQTI2Qjg2RkJFRkE3OiB7XG4gICAgICAgICAgVHlwZTogJ0N1c3RvbTo6Q3Jvc3NSZWdpb25FeHBvcnRXcml0ZXInLFxuICAgICAgICAgIERlbGV0aW9uUG9saWN5OiAnRGVsZXRlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBXcml0ZXJQcm9wczoge1xuICAgICAgICAgICAgICBleHBvcnRzOiB7XG4gICAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9TdGFjazIvU3RhY2sxdXNlYXN0MUZuR2V0QXR0U29tZVJlc291cmNlRXhwb3J0bmFtZTQ3QUQzMDRGJzoge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICdTb21lUmVzb3VyY2VFeHBvcnQnLFxuICAgICAgICAgICAgICAgICAgICAnbmFtZScsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9TdGFjazIvU3RhY2sxdXNlYXN0MUZuR2V0QXR0U29tZVJlc291cmNlRXhwb3J0b3RoZXJDNkY4Q0JEMSc6IHtcbiAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAnU29tZVJlc291cmNlRXhwb3J0JyxcbiAgICAgICAgICAgICAgICAgICAgJ290aGVyJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0yJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTZXJ2aWNlVG9rZW46IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0N1c3RvbUNyb3NzUmVnaW9uRXhwb3J0V3JpdGVyQ3VzdG9tUmVzb3VyY2VQcm92aWRlckhhbmRsZXJEODc4NkU4QScsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcm9zcyByZWdpb24gc3RhY2sgcmVmZXJlbmNlcyB3aXRoIG11bHRpcGxlIHN0YWNrcyBhbmQgbXVsdGlwbGUgcmVnaW9ucywgY3Jvc3NSZWdpb25SZWZlcmVuY2VzPXRydWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMScsIHsgZW52OiB7IHJlZ2lvbjogJ3VzLWVhc3QtMScgfSwgY3Jvc3NSZWdpb25SZWZlcmVuY2VzOiB0cnVlIH0pO1xuICAgIGNvbnN0IGV4cG9ydFJlc291cmNlID0gbmV3IENmblJlc291cmNlKHN0YWNrMSwgJ1NvbWVSZXNvdXJjZUV4cG9ydCcsIHtcbiAgICAgIHR5cGU6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgIH0pO1xuICAgIGNvbnN0IHN0YWNrMyA9IG5ldyBTdGFjayhhcHAsICdTdGFjazMnLCB7IGVudjogeyByZWdpb246ICd1cy13ZXN0LTEnIH0sIGNyb3NzUmVnaW9uUmVmZXJlbmNlczogdHJ1ZSB9KTtcbiAgICBjb25zdCBleHBvcnRSZXNvdXJjZTMgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2szLCAnU29tZVJlc291cmNlRXhwb3J0Jywge1xuICAgICAgdHlwZTogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMicsIHsgZW52OiB7IHJlZ2lvbjogJ3VzLWVhc3QtMicgfSwgY3Jvc3NSZWdpb25SZWZlcmVuY2VzOiB0cnVlIH0pO1xuXG4gICAgLy8gV0hFTiAtIHVzZWQgaW4gYW5vdGhlciBzdGFja1xuICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjazIsICdTb21lUmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgTmFtZTogZXhwb3J0UmVzb3VyY2UuZ2V0QXR0KCduYW1lJyksXG4gICAgICAgIE90aGVyOiBleHBvcnRSZXNvdXJjZS5nZXRBdHQoJ290aGVyJyksXG4gICAgICAgIE90aGVyMjogZXhwb3J0UmVzb3VyY2UzLmdldEF0dCgnb3RoZXIyJyksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCB0ZW1wbGF0ZTIgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjazIuc3RhY2tOYW1lKS50ZW1wbGF0ZTtcbiAgICBjb25zdCB0ZW1wbGF0ZTMgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjazMuc3RhY2tOYW1lKS50ZW1wbGF0ZTtcbiAgICBjb25zdCB0ZW1wbGF0ZTEgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjazEuc3RhY2tOYW1lKS50ZW1wbGF0ZTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodGVtcGxhdGUzKS50b01hdGNoT2JqZWN0KHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBTb21lUmVzb3VyY2VFeHBvcnQ6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgZXhwZWN0KHRlbXBsYXRlMikudG9NYXRjaE9iamVjdCh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgU29tZVJlc291cmNlOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgTmFtZToge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnRXhwb3J0c1JlYWRlcjhCMjQ5NTI0JyxcbiAgICAgICAgICAgICAgICAnL2Nkay9leHBvcnRzL1N0YWNrMi9TdGFjazF1c2Vhc3QxRm5HZXRBdHRTb21lUmVzb3VyY2VFeHBvcnRuYW1lNDdBRDMwNEYnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIE90aGVyOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdFeHBvcnRzUmVhZGVyOEIyNDk1MjQnLFxuICAgICAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvU3RhY2syL1N0YWNrMXVzZWFzdDFGbkdldEF0dFNvbWVSZXNvdXJjZUV4cG9ydG90aGVyQzZGOENCRDEnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIE90aGVyMjoge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnRXhwb3J0c1JlYWRlcjhCMjQ5NTI0JyxcbiAgICAgICAgICAgICAgICAnL2Nkay9leHBvcnRzL1N0YWNrMi9TdGFjazN1c3dlc3QxRm5HZXRBdHRTb21lUmVzb3VyY2VFeHBvcnRvdGhlcjI0OTFCNURBNycsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGV4cGVjdCh0ZW1wbGF0ZTMpLnRvTWF0Y2hPYmplY3Qoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIFNvbWVSZXNvdXJjZUV4cG9ydDoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgICB9LFxuICAgICAgICBFeHBvcnRzV3JpdGVydXNlYXN0MjgyOEZBMjZCODZGQkVGQTc6IHtcbiAgICAgICAgICBUeXBlOiAnQ3VzdG9tOjpDcm9zc1JlZ2lvbkV4cG9ydFdyaXRlcicsXG4gICAgICAgICAgRGVsZXRpb25Qb2xpY3k6ICdEZWxldGUnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIFdyaXRlclByb3BzOiB7XG4gICAgICAgICAgICAgIGV4cG9ydHM6IHtcbiAgICAgICAgICAgICAgICAnL2Nkay9leHBvcnRzL1N0YWNrMi9TdGFjazN1c3dlc3QxRm5HZXRBdHRTb21lUmVzb3VyY2VFeHBvcnRvdGhlcjI0OTFCNURBNyc6IHtcbiAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAnU29tZVJlc291cmNlRXhwb3J0JyxcbiAgICAgICAgICAgICAgICAgICAgJ290aGVyMicsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU2VydmljZVRva2VuOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdDdXN0b21Dcm9zc1JlZ2lvbkV4cG9ydFdyaXRlckN1c3RvbVJlc291cmNlUHJvdmlkZXJIYW5kbGVyRDg3ODZFOEEnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBleHBlY3QodGVtcGxhdGUxKS50b01hdGNoT2JqZWN0KHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBTb21lUmVzb3VyY2VFeHBvcnQ6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgICAgfSxcbiAgICAgICAgRXhwb3J0c1dyaXRlcnVzZWFzdDI4MjhGQTI2Qjg2RkJFRkE3OiB7XG4gICAgICAgICAgVHlwZTogJ0N1c3RvbTo6Q3Jvc3NSZWdpb25FeHBvcnRXcml0ZXInLFxuICAgICAgICAgIERlbGV0aW9uUG9saWN5OiAnRGVsZXRlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBXcml0ZXJQcm9wczoge1xuICAgICAgICAgICAgICBleHBvcnRzOiB7XG4gICAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9TdGFjazIvU3RhY2sxdXNlYXN0MUZuR2V0QXR0U29tZVJlc291cmNlRXhwb3J0bmFtZTQ3QUQzMDRGJzoge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICdTb21lUmVzb3VyY2VFeHBvcnQnLFxuICAgICAgICAgICAgICAgICAgICAnbmFtZScsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9TdGFjazIvU3RhY2sxdXNlYXN0MUZuR2V0QXR0U29tZVJlc291cmNlRXhwb3J0b3RoZXJDNkY4Q0JEMSc6IHtcbiAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAnU29tZVJlc291cmNlRXhwb3J0JyxcbiAgICAgICAgICAgICAgICAgICAgJ290aGVyJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0yJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTZXJ2aWNlVG9rZW46IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0N1c3RvbUNyb3NzUmVnaW9uRXhwb3J0V3JpdGVyQ3VzdG9tUmVzb3VyY2VQcm92aWRlckhhbmRsZXJEODc4NkU4QScsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcm9zcyBzdGFjayByZWZlcmVuY2VzIGFuZCBkZXBlbmRlbmNpZXMgd29yayB3aXRoaW4gY2hpbGQgc3RhY2tzIChub24tbmVzdGVkKScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoe1xuICAgICAgY29udGV4dDoge1xuICAgICAgICAnQGF3cy1jZGsvY29yZTpzdGFja1JlbGF0aXZlRXhwb3J0cyc6IHRydWUsXG4gICAgICAgIFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3QgcGFyZW50ID0gbmV3IFN0YWNrKGFwcCwgJ1BhcmVudCcpO1xuICAgIGNvbnN0IGNoaWxkMSA9IG5ldyBTdGFjayhwYXJlbnQsICdDaGlsZDEnKTtcbiAgICBjb25zdCBjaGlsZDIgPSBuZXcgU3RhY2socGFyZW50LCAnQ2hpbGQyJyk7XG4gICAgY29uc3QgcmVzb3VyY2VBID0gbmV3IENmblJlc291cmNlKGNoaWxkMSwgJ1Jlc291cmNlQScsIHsgdHlwZTogJ1JBJyB9KTtcbiAgICBjb25zdCByZXNvdXJjZUIgPSBuZXcgQ2ZuUmVzb3VyY2UoY2hpbGQxLCAnUmVzb3VyY2VCJywgeyB0eXBlOiAnUkInIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlc291cmNlMiA9IG5ldyBDZm5SZXNvdXJjZShjaGlsZDIsICdSZXNvdXJjZTEnLCB7XG4gICAgICB0eXBlOiAnUjInLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBSZWZUb1Jlc291cmNlMTogcmVzb3VyY2VBLnJlZixcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcmVzb3VyY2UyLmFkZERlcGVuZGVuY3kocmVzb3VyY2VCKTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgIGNvbnN0IHBhcmVudFRlbXBsYXRlID0gYXNzZW1ibHkuZ2V0U3RhY2tBcnRpZmFjdChwYXJlbnQuYXJ0aWZhY3RJZCkudGVtcGxhdGU7XG4gICAgY29uc3QgY2hpbGQxVGVtcGxhdGUgPSBhc3NlbWJseS5nZXRTdGFja0FydGlmYWN0KGNoaWxkMS5hcnRpZmFjdElkKS50ZW1wbGF0ZTtcbiAgICBjb25zdCBjaGlsZDJUZW1wbGF0ZSA9IGFzc2VtYmx5LmdldFN0YWNrQXJ0aWZhY3QoY2hpbGQyLmFydGlmYWN0SWQpLnRlbXBsYXRlO1xuXG4gICAgZXhwZWN0KHBhcmVudFRlbXBsYXRlKS50b0VxdWFsKHt9KTtcbiAgICBleHBlY3QoY2hpbGQxVGVtcGxhdGUpLnRvRXF1YWwoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIFJlc291cmNlQTogeyBUeXBlOiAnUkEnIH0sXG4gICAgICAgIFJlc291cmNlQjogeyBUeXBlOiAnUkInIH0sXG4gICAgICB9LFxuICAgICAgT3V0cHV0czoge1xuICAgICAgICBFeHBvcnRzT3V0cHV0UmVmUmVzb3VyY2VBNDYxQjRFRjk6IHtcbiAgICAgICAgICBWYWx1ZTogeyBSZWY6ICdSZXNvdXJjZUEnIH0sXG4gICAgICAgICAgRXhwb3J0OiB7IE5hbWU6ICdQYXJlbnRDaGlsZDE4RkFFRjQxOTpFeHBvcnRzT3V0cHV0UmVmUmVzb3VyY2VBNDYxQjRFRjknIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGV4cGVjdChjaGlsZDJUZW1wbGF0ZSkudG9FcXVhbCh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgUmVzb3VyY2UxOiB7XG4gICAgICAgICAgVHlwZTogJ1IyJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBSZWZUb1Jlc291cmNlMTogeyAnRm46OkltcG9ydFZhbHVlJzogJ1BhcmVudENoaWxkMThGQUVGNDE5OkV4cG9ydHNPdXRwdXRSZWZSZXNvdXJjZUE0NjFCNEVGOScgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGV4cGVjdChhc3NlbWJseS5nZXRTdGFja0FydGlmYWN0KGNoaWxkMS5hcnRpZmFjdElkKS5kZXBlbmRlbmNpZXMubWFwKCh4OiB7IGlkOiBhbnk7IH0pID0+IHguaWQpKS50b0VxdWFsKFtdKTtcbiAgICBleHBlY3QoYXNzZW1ibHkuZ2V0U3RhY2tBcnRpZmFjdChjaGlsZDIuYXJ0aWZhY3RJZCkuZGVwZW5kZW5jaWVzLm1hcCgoeDogeyBpZDogYW55OyB9KSA9PiB4LmlkKSkudG9FcXVhbChbJ1BhcmVudENoaWxkMThGQUVGNDE5J10pO1xuICB9KTtcblxuICB0ZXN0KCdfYWRkQXNzZW1ibHlEZXBlbmRlbmN5IGFkZHMgdG8gX3N0YWNrRGVwZW5kZW5jaWVzJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoe1xuICAgICAgY29udGV4dDoge1xuICAgICAgICAnQGF3cy1jZGsvY29yZTpzdGFja1JlbGF0aXZlRXhwb3J0cyc6IHRydWUsXG4gICAgICAgIFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3QgcGFyZW50ID0gbmV3IFN0YWNrKGFwcCwgJ1BhcmVudCcpO1xuICAgIGNvbnN0IGNoaWxkMSA9IG5ldyBTdGFjayhwYXJlbnQsICdDaGlsZDEnKTtcbiAgICBjb25zdCBjaGlsZEEgPSBuZXcgU3RhY2socGFyZW50LCAnQ2hpbGRBJyk7XG4gICAgY29uc3QgcmVzb3VyY2UxID0gbmV3IENmblJlc291cmNlKGNoaWxkMSwgJ1Jlc291cmNlMScsIHsgdHlwZTogJ1IxJyB9KTtcbiAgICBjb25zdCByZXNvdXJjZTIgPSBuZXcgQ2ZuUmVzb3VyY2UoY2hpbGQxLCAnUmVzb3VyY2UyJywgeyB0eXBlOiAnUjInIH0pO1xuICAgIGNvbnN0IHJlc291cmNlQSA9IG5ldyBDZm5SZXNvdXJjZShjaGlsZEEsICdSZXNvdXJjZUEnLCB7IHR5cGU6ICdSQScgfSk7XG5cbiAgICBjaGlsZEEuX2FkZEFzc2VtYmx5RGVwZW5kZW5jeShjaGlsZDEsIHsgc291cmNlOiByZXNvdXJjZUEsIHRhcmdldDogcmVzb3VyY2UxIH0pO1xuICAgIGNoaWxkQS5fYWRkQXNzZW1ibHlEZXBlbmRlbmN5KGNoaWxkMSwgeyBzb3VyY2U6IHJlc291cmNlQSwgdGFyZ2V0OiByZXNvdXJjZTIgfSk7XG5cbiAgICBleHBlY3QoY2hpbGRBLl9vYnRhaW5Bc3NlbWJseURlcGVuZGVuY2llcyh7IHNvdXJjZTogcmVzb3VyY2VBIH0pKVxuICAgICAgLnRvRXF1YWwoW3Jlc291cmNlMSwgcmVzb3VyY2UyXSk7XG5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuXG4gICAgZXhwZWN0KGFzc2VtYmx5LmdldFN0YWNrQXJ0aWZhY3QoY2hpbGQxLmFydGlmYWN0SWQpLmRlcGVuZGVuY2llcy5tYXAoKHg6IHsgaWQ6IGFueTsgfSkgPT4geC5pZCkpLnRvRXF1YWwoW10pO1xuICAgIGV4cGVjdChhc3NlbWJseS5nZXRTdGFja0FydGlmYWN0KGNoaWxkQS5hcnRpZmFjdElkKS5kZXBlbmRlbmNpZXMubWFwKCh4OiB7IGlkOiBhbnk7IH0pID0+IHguaWQpKS50b0VxdWFsKFsnUGFyZW50Q2hpbGQxOEZBRUY0MTknXSk7XG4gIH0pO1xuXG4gIHRlc3QoJ19hZGRBc3NlbWJseURlcGVuZGVuY3kgYWRkcyBvbmUgU3RhY2tEZXBlbmRlbmN5UmVhc29uIHdpdGggZGVmYXVsdHMnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7XG4gICAgICBjb250ZXh0OiB7XG4gICAgICAgICdAYXdzLWNkay9jb3JlOnN0YWNrUmVsYXRpdmVFeHBvcnRzJzogdHJ1ZSxcbiAgICAgICAgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBwYXJlbnQgPSBuZXcgU3RhY2soYXBwLCAnUGFyZW50Jyk7XG4gICAgY29uc3QgY2hpbGQxID0gbmV3IFN0YWNrKHBhcmVudCwgJ0NoaWxkMScpO1xuICAgIGNvbnN0IGNoaWxkQSA9IG5ldyBTdGFjayhwYXJlbnQsICdDaGlsZEEnKTtcblxuICAgIGNoaWxkQS5fYWRkQXNzZW1ibHlEZXBlbmRlbmN5KGNoaWxkMSk7XG5cbiAgICBleHBlY3QoY2hpbGRBLl9vYnRhaW5Bc3NlbWJseURlcGVuZGVuY2llcyh7IHNvdXJjZTogY2hpbGRBIH0pKVxuICAgICAgLnRvRXF1YWwoW2NoaWxkMV0pO1xuXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcblxuICAgIGV4cGVjdChhc3NlbWJseS5nZXRTdGFja0FydGlmYWN0KGNoaWxkMS5hcnRpZmFjdElkKS5kZXBlbmRlbmNpZXMubWFwKCh4OiB7IGlkOiBhbnk7IH0pID0+IHguaWQpKS50b0VxdWFsKFtdKTtcbiAgICBleHBlY3QoYXNzZW1ibHkuZ2V0U3RhY2tBcnRpZmFjdChjaGlsZEEuYXJ0aWZhY3RJZCkuZGVwZW5kZW5jaWVzLm1hcCgoeDogeyBpZDogYW55OyB9KSA9PiB4LmlkKSkudG9FcXVhbChbJ1BhcmVudENoaWxkMThGQUVGNDE5J10pO1xuICB9KTtcblxuICB0ZXN0KCdfYWRkQXNzZW1ibHlEZXBlbmRlbmN5IHJhaXNlcyBlcnJvciBvbiBjeWNsZScsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgJ0Bhd3MtY2RrL2NvcmU6c3RhY2tSZWxhdGl2ZUV4cG9ydHMnOiB0cnVlLFxuICAgICAgICBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnN0IHBhcmVudCA9IG5ldyBTdGFjayhhcHAsICdQYXJlbnQnKTtcbiAgICBjb25zdCBjaGlsZDEgPSBuZXcgU3RhY2socGFyZW50LCAnQ2hpbGQxJyk7XG4gICAgY29uc3QgY2hpbGQyID0gbmV3IFN0YWNrKHBhcmVudCwgJ0NoaWxkMicpO1xuXG4gICAgY2hpbGQyLl9hZGRBc3NlbWJseURlcGVuZGVuY3koY2hpbGQxKTtcbiAgICBleHBlY3QoKCkgPT4gY2hpbGQxLl9hZGRBc3NlbWJseURlcGVuZGVuY3koY2hpbGQyKSkudG9UaHJvdyhcIidQYXJlbnQvQ2hpbGQyJyBkZXBlbmRzIG9uXCIpO1xuICB9KTtcblxuICB0ZXN0KCdfYWRkQXNzZW1ibHlEZXBlbmRlbmN5IHJhaXNlcyBlcnJvciBmb3IgbmVzdGVkIHN0YWNrcycsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgJ0Bhd3MtY2RrL2NvcmU6c3RhY2tSZWxhdGl2ZUV4cG9ydHMnOiB0cnVlLFxuICAgICAgICBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnN0IHBhcmVudCA9IG5ldyBTdGFjayhhcHAsICdQYXJlbnQnKTtcbiAgICBjb25zdCBjaGlsZDEgPSBuZXcgTmVzdGVkU3RhY2socGFyZW50LCAnQ2hpbGQxJyk7XG4gICAgY29uc3QgY2hpbGQyID0gbmV3IE5lc3RlZFN0YWNrKHBhcmVudCwgJ0NoaWxkMicpO1xuXG4gICAgZXhwZWN0KCgpID0+IGNoaWxkMS5fYWRkQXNzZW1ibHlEZXBlbmRlbmN5KGNoaWxkMikpLnRvVGhyb3coJ0Nhbm5vdCBhZGQgYXNzZW1ibHktbGV2ZWwnKTtcbiAgfSk7XG5cbiAgdGVzdCgnX2FkZEFzc2VtYmx5RGVwZW5kZW5jeSBoYW5kbGVzIGR1cGxpY2F0ZSBkZXBlbmRlbmN5IHJlYXNvbnMnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7XG4gICAgICBjb250ZXh0OiB7XG4gICAgICAgICdAYXdzLWNkay9jb3JlOnN0YWNrUmVsYXRpdmVFeHBvcnRzJzogdHJ1ZSxcbiAgICAgICAgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBwYXJlbnQgPSBuZXcgU3RhY2soYXBwLCAnUGFyZW50Jyk7XG4gICAgY29uc3QgY2hpbGQxID0gbmV3IFN0YWNrKHBhcmVudCwgJ0NoaWxkMScpO1xuICAgIGNvbnN0IGNoaWxkMiA9IG5ldyBTdGFjayhwYXJlbnQsICdDaGlsZDInKTtcblxuICAgIGNoaWxkMi5fYWRkQXNzZW1ibHlEZXBlbmRlbmN5KGNoaWxkMSk7XG4gICAgY29uc3QgZGVwc0JlZm9yZSA9IGNoaWxkMi5fb2J0YWluQXNzZW1ibHlEZXBlbmRlbmNpZXMoeyBzb3VyY2U6IGNoaWxkMiB9KTtcbiAgICBjaGlsZDIuX2FkZEFzc2VtYmx5RGVwZW5kZW5jeShjaGlsZDEpO1xuICAgIGV4cGVjdChkZXBzQmVmb3JlKS50b0VxdWFsKGNoaWxkMi5fb2J0YWluQXNzZW1ibHlEZXBlbmRlbmNpZXMoeyBzb3VyY2U6IGNoaWxkMiB9KSk7XG4gIH0pO1xuXG4gIHRlc3QoJ19yZW1vdmVBc3NlbWJseURlcGVuZGVuY3kgcmVtb3ZlcyBvbmUgU3RhY2tEZXBlbmRlbmN5UmVhc29uIG9mIHR3byBmcm9tIF9zdGFja0RlcGVuZGVuY2llcycsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgJ0Bhd3MtY2RrL2NvcmU6c3RhY2tSZWxhdGl2ZUV4cG9ydHMnOiB0cnVlLFxuICAgICAgICBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnN0IHBhcmVudCA9IG5ldyBTdGFjayhhcHAsICdQYXJlbnQnKTtcbiAgICBjb25zdCBjaGlsZDEgPSBuZXcgU3RhY2socGFyZW50LCAnQ2hpbGQxJyk7XG4gICAgY29uc3QgY2hpbGRBID0gbmV3IFN0YWNrKHBhcmVudCwgJ0NoaWxkQScpO1xuICAgIGNvbnN0IHJlc291cmNlMSA9IG5ldyBDZm5SZXNvdXJjZShjaGlsZDEsICdSZXNvdXJjZTEnLCB7IHR5cGU6ICdSMScgfSk7XG4gICAgY29uc3QgcmVzb3VyY2UyID0gbmV3IENmblJlc291cmNlKGNoaWxkMSwgJ1Jlc291cmNlMicsIHsgdHlwZTogJ1IyJyB9KTtcbiAgICBjb25zdCByZXNvdXJjZUEgPSBuZXcgQ2ZuUmVzb3VyY2UoY2hpbGRBLCAnUmVzb3VyY2VBJywgeyB0eXBlOiAnUkEnIH0pO1xuXG4gICAgY2hpbGRBLl9hZGRBc3NlbWJseURlcGVuZGVuY3koY2hpbGQxLCB7IHNvdXJjZTogcmVzb3VyY2VBLCB0YXJnZXQ6IHJlc291cmNlMSB9KTtcbiAgICBjaGlsZEEuX2FkZEFzc2VtYmx5RGVwZW5kZW5jeShjaGlsZDEsIHsgc291cmNlOiByZXNvdXJjZUEsIHRhcmdldDogcmVzb3VyY2UyIH0pO1xuICAgIGNoaWxkQS5fcmVtb3ZlQXNzZW1ibHlEZXBlbmRlbmN5KGNoaWxkMSwgeyBzb3VyY2U6IHJlc291cmNlQSwgdGFyZ2V0OiByZXNvdXJjZTEgfSk7XG5cbiAgICBleHBlY3QoY2hpbGRBLl9vYnRhaW5Bc3NlbWJseURlcGVuZGVuY2llcyh7IHNvdXJjZTogcmVzb3VyY2VBIH0pKS50b0VxdWFsKFtyZXNvdXJjZTJdKTtcblxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG5cbiAgICBleHBlY3QoYXNzZW1ibHkuZ2V0U3RhY2tBcnRpZmFjdChjaGlsZDEuYXJ0aWZhY3RJZCkuZGVwZW5kZW5jaWVzLm1hcCgoeDogeyBpZDogYW55OyB9KSA9PiB4LmlkKSkudG9FcXVhbChbXSk7XG4gICAgZXhwZWN0KGFzc2VtYmx5LmdldFN0YWNrQXJ0aWZhY3QoY2hpbGRBLmFydGlmYWN0SWQpLmRlcGVuZGVuY2llcy5tYXAoKHg6IHsgaWQ6IGFueTsgfSkgPT4geC5pZCkpLnRvRXF1YWwoWydQYXJlbnRDaGlsZDE4RkFFRjQxOSddKTtcbiAgfSk7XG5cbiAgdGVzdCgnX3JlbW92ZUFzc2VtYmx5RGVwZW5kZW5jeSByZW1vdmVzIGEgU3RhY2tEZXBlbmRlbmN5IGZyb20gX3N0YWNrRGVwZW5kZW5jaWVzIHdpdGggdGhlIGxhc3QgcmVhc29uJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoe1xuICAgICAgY29udGV4dDoge1xuICAgICAgICAnQGF3cy1jZGsvY29yZTpzdGFja1JlbGF0aXZlRXhwb3J0cyc6IHRydWUsXG4gICAgICAgIFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3QgcGFyZW50ID0gbmV3IFN0YWNrKGFwcCwgJ1BhcmVudCcpO1xuICAgIGNvbnN0IGNoaWxkMSA9IG5ldyBTdGFjayhwYXJlbnQsICdDaGlsZDEnKTtcbiAgICBjb25zdCBjaGlsZEEgPSBuZXcgU3RhY2socGFyZW50LCAnQ2hpbGQyJyk7XG4gICAgY29uc3QgcmVzb3VyY2UxID0gbmV3IENmblJlc291cmNlKGNoaWxkMSwgJ1Jlc291cmNlMScsIHsgdHlwZTogJ1IxJyB9KTtcbiAgICBjb25zdCByZXNvdXJjZTIgPSBuZXcgQ2ZuUmVzb3VyY2UoY2hpbGQxLCAnUmVzb3VyY2UyJywgeyB0eXBlOiAnUjInIH0pO1xuICAgIGNvbnN0IHJlc291cmNlQSA9IG5ldyBDZm5SZXNvdXJjZShjaGlsZEEsICdSZXNvdXJjZUEnLCB7IHR5cGU6ICdSQScgfSk7XG5cbiAgICBjaGlsZEEuX2FkZEFzc2VtYmx5RGVwZW5kZW5jeShjaGlsZDEsIHsgc291cmNlOiByZXNvdXJjZUEsIHRhcmdldDogcmVzb3VyY2UxIH0pO1xuICAgIGNoaWxkQS5fYWRkQXNzZW1ibHlEZXBlbmRlbmN5KGNoaWxkMSwgeyBzb3VyY2U6IHJlc291cmNlQSwgdGFyZ2V0OiByZXNvdXJjZTIgfSk7XG4gICAgY2hpbGRBLl9yZW1vdmVBc3NlbWJseURlcGVuZGVuY3koY2hpbGQxLCB7IHNvdXJjZTogcmVzb3VyY2VBLCB0YXJnZXQ6IHJlc291cmNlMSB9KTtcbiAgICBjaGlsZEEuX3JlbW92ZUFzc2VtYmx5RGVwZW5kZW5jeShjaGlsZDEsIHsgc291cmNlOiByZXNvdXJjZUEsIHRhcmdldDogcmVzb3VyY2UyIH0pO1xuXG4gICAgZXhwZWN0KGNoaWxkQS5fb2J0YWluQXNzZW1ibHlEZXBlbmRlbmNpZXMoeyBzb3VyY2U6IGNoaWxkQSB9KSkudG9FcXVhbChbXSk7XG5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuXG4gICAgZXhwZWN0KGFzc2VtYmx5LmdldFN0YWNrQXJ0aWZhY3QoY2hpbGQxLmFydGlmYWN0SWQpLmRlcGVuZGVuY2llcy5tYXAoKHg6IHsgaWQ6IGFueTsgfSkgPT4geC5pZCkpLnRvRXF1YWwoW10pO1xuICAgIGV4cGVjdChhc3NlbWJseS5nZXRTdGFja0FydGlmYWN0KGNoaWxkQS5hcnRpZmFjdElkKS5kZXBlbmRlbmNpZXMubWFwKCh4OiB7IGlkOiBhbnk7IH0pID0+IHguaWQpKS50b0VxdWFsKFtdKTtcbiAgfSk7XG5cbiAgdGVzdCgnX3JlbW92ZUFzc2VtYmx5RGVwZW5kZW5jeSByZW1vdmVzIGEgU3RhY2tEZXBlbmRlbmN5IHdpdGggZGVmYXVsdCByZWFzb24nLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7XG4gICAgICBjb250ZXh0OiB7XG4gICAgICAgICdAYXdzLWNkay9jb3JlOnN0YWNrUmVsYXRpdmVFeHBvcnRzJzogdHJ1ZSxcbiAgICAgICAgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBwYXJlbnQgPSBuZXcgU3RhY2soYXBwLCAnUGFyZW50Jyk7XG4gICAgY29uc3QgY2hpbGQxID0gbmV3IFN0YWNrKHBhcmVudCwgJ0NoaWxkMScpO1xuICAgIGNvbnN0IGNoaWxkQSA9IG5ldyBTdGFjayhwYXJlbnQsICdDaGlsZDInKTtcblxuICAgIGNoaWxkQS5fYWRkQXNzZW1ibHlEZXBlbmRlbmN5KGNoaWxkMSk7XG4gICAgY2hpbGRBLl9yZW1vdmVBc3NlbWJseURlcGVuZGVuY3koY2hpbGQxKTtcblxuICAgIGV4cGVjdChjaGlsZEEuX29idGFpbkFzc2VtYmx5RGVwZW5kZW5jaWVzKHsgc291cmNlOiBjaGlsZEEgfSkpLnRvRXF1YWwoW10pO1xuXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcblxuICAgIGV4cGVjdChhc3NlbWJseS5nZXRTdGFja0FydGlmYWN0KGNoaWxkMS5hcnRpZmFjdElkKS5kZXBlbmRlbmNpZXMubWFwKCh4OiB7IGlkOiBhbnk7IH0pID0+IHguaWQpKS50b0VxdWFsKFtdKTtcbiAgICBleHBlY3QoYXNzZW1ibHkuZ2V0U3RhY2tBcnRpZmFjdChjaGlsZEEuYXJ0aWZhY3RJZCkuZGVwZW5kZW5jaWVzLm1hcCgoeDogeyBpZDogYW55OyB9KSA9PiB4LmlkKSkudG9FcXVhbChbXSk7XG4gIH0pO1xuXG4gIHRlc3QoJ19yZW1vdmVBc3NlbWJseURlcGVuZGVuY3kgcmFpc2VzIGFuIGVycm9yIGZvciBuZXN0ZWQgc3RhY2tzJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoe1xuICAgICAgY29udGV4dDoge1xuICAgICAgICAnQGF3cy1jZGsvY29yZTpzdGFja1JlbGF0aXZlRXhwb3J0cyc6IHRydWUsXG4gICAgICAgIFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3QgcGFyZW50ID0gbmV3IFN0YWNrKGFwcCwgJ1BhcmVudCcpO1xuICAgIGNvbnN0IGNoaWxkMSA9IG5ldyBOZXN0ZWRTdGFjayhwYXJlbnQsICdDaGlsZDEnKTtcbiAgICBjb25zdCBjaGlsZEEgPSBuZXcgTmVzdGVkU3RhY2socGFyZW50LCAnQ2hpbGQyJyk7XG5cbiAgICBleHBlY3QoKCkgPT4gY2hpbGRBLl9yZW1vdmVBc3NlbWJseURlcGVuZGVuY3koY2hpbGQxKSkudG9UaHJvdygnVGhlcmUgY2Fubm90IGJlIGFzc2VtYmx5LWxldmVsJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ19yZW1vdmVBc3NlbWJseURlcGVuZGVuY3kgaGFuZGxlcyBhIG5vbi1tYXRjaGluZyBkZXBlbmRlbmN5IHJlYXNvbicsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgJ0Bhd3MtY2RrL2NvcmU6c3RhY2tSZWxhdGl2ZUV4cG9ydHMnOiB0cnVlLFxuICAgICAgICBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnN0IHBhcmVudCA9IG5ldyBTdGFjayhhcHAsICdQYXJlbnQnKTtcbiAgICBjb25zdCBjaGlsZDEgPSBuZXcgU3RhY2socGFyZW50LCAnQ2hpbGQxJyk7XG4gICAgY29uc3QgY2hpbGRBID0gbmV3IFN0YWNrKHBhcmVudCwgJ0NoaWxkMicpO1xuICAgIGNvbnN0IHJlc291cmNlMSA9IG5ldyBDZm5SZXNvdXJjZShjaGlsZDEsICdSZXNvdXJjZTEnLCB7IHR5cGU6ICdSMScgfSk7XG4gICAgY29uc3QgcmVzb3VyY2VBID0gbmV3IENmblJlc291cmNlKGNoaWxkQSwgJ1Jlc291cmNlQScsIHsgdHlwZTogJ1JBJyB9KTtcblxuICAgIGNoaWxkQS5fYWRkQXNzZW1ibHlEZXBlbmRlbmN5KGNoaWxkMSk7XG4gICAgY2hpbGRBLl9yZW1vdmVBc3NlbWJseURlcGVuZGVuY3koY2hpbGQxLCB7IHNvdXJjZTogcmVzb3VyY2VBLCB0YXJnZXQ6IHJlc291cmNlMSB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYXV0b21hdGljIGNyb3NzLXN0YWNrIHJlZmVyZW5jZXMgYW5kIG1hbnVhbCBleHBvcnRzIGxvb2sgdGhlIHNhbWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU46IGF1dG9tYXRpY1xuICAgIGNvbnN0IGFwcEEgPSBuZXcgQXBwKHsgY29udGV4dDogeyAnQGF3cy1jZGsvY29yZTpzdGFja1JlbGF0aXZlRXhwb3J0cyc6IHRydWUgfSB9KTtcbiAgICBjb25zdCBwcm9kdWNlckEgPSBuZXcgU3RhY2soYXBwQSwgJ1Byb2R1Y2VyJyk7XG4gICAgY29uc3QgY29uc3VtZXJBID0gbmV3IFN0YWNrKGFwcEEsICdDb25zdW1lcicpO1xuICAgIGNvbnN0IHJlc291cmNlQSA9IG5ldyBDZm5SZXNvdXJjZShwcm9kdWNlckEsICdSZXNvdXJjZScsIHsgdHlwZTogJ0FXUzo6UmVzb3VyY2UnIH0pO1xuICAgIG5ldyBDZm5PdXRwdXQoY29uc3VtZXJBLCAnU29tZU91dHB1dCcsIHsgdmFsdWU6IGAke3Jlc291cmNlQS5nZXRBdHQoJ0F0dCcpfWAgfSk7XG5cbiAgICAvLyBHSVZFTjogbWFudWFsXG4gICAgY29uc3QgYXBwTSA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBwcm9kdWNlck0gPSBuZXcgU3RhY2soYXBwTSwgJ1Byb2R1Y2VyJyk7XG4gICAgY29uc3QgcmVzb3VyY2VNID0gbmV3IENmblJlc291cmNlKHByb2R1Y2VyTSwgJ1Jlc291cmNlJywgeyB0eXBlOiAnQVdTOjpSZXNvdXJjZScgfSk7XG4gICAgcHJvZHVjZXJNLmV4cG9ydFZhbHVlKHJlc291cmNlTS5nZXRBdHQoJ0F0dCcpKTtcblxuICAgIC8vIFRIRU4gLSBwcm9kdWNlcnMgYXJlIHRoZSBzYW1lXG4gICAgY29uc3QgdGVtcGxhdGVBID0gYXBwQS5zeW50aCgpLmdldFN0YWNrQnlOYW1lKHByb2R1Y2VyQS5zdGFja05hbWUpLnRlbXBsYXRlO1xuICAgIGNvbnN0IHRlbXBsYXRlTSA9IGFwcE0uc3ludGgoKS5nZXRTdGFja0J5TmFtZShwcm9kdWNlck0uc3RhY2tOYW1lKS50ZW1wbGF0ZTtcblxuICAgIGV4cGVjdCh0ZW1wbGF0ZUEpLnRvRXF1YWwodGVtcGxhdGVNKTtcbiAgfSk7XG5cbiAgdGVzdCgnYXV0b21hdGljIGNyb3NzLXN0YWNrIHJlZmVyZW5jZXMgYW5kIG1hbnVhbCBsaXN0IGV4cG9ydHMgbG9vayB0aGUgc2FtZScsICgpID0+IHtcbiAgICAvLyBHSVZFTjogYXV0b21hdGljXG4gICAgY29uc3QgYXBwQSA9IG5ldyBBcHAoeyBjb250ZXh0OiB7ICdAYXdzLWNkay9jb3JlOnN0YWNrUmVsYXRpdmVFeHBvcnRzJzogdHJ1ZSB9IH0pO1xuICAgIGNvbnN0IHByb2R1Y2VyQSA9IG5ldyBTdGFjayhhcHBBLCAnUHJvZHVjZXInKTtcbiAgICBjb25zdCBjb25zdW1lckEgPSBuZXcgU3RhY2soYXBwQSwgJ0NvbnN1bWVyJyk7XG4gICAgY29uc3QgcmVzb3VyY2VBID0gbmV3IENmblJlc291cmNlKHByb2R1Y2VyQSwgJ1Jlc291cmNlJywgeyB0eXBlOiAnQVdTOjpSZXNvdXJjZScgfSk7XG4gICAgKHJlc291cmNlQSBhcyBhbnkpLmF0dHJBdHQgPSBbJ0ZvbycsICdCYXInXTtcbiAgICBuZXcgQ2ZuT3V0cHV0KGNvbnN1bWVyQSwgJ1NvbWVPdXRwdXQnLCB7IHZhbHVlOiBgJHtyZXNvdXJjZUEuZ2V0QXR0KCdBdHQnLCBSZXNvbHV0aW9uVHlwZUhpbnQuU1RSSU5HX0xJU1QpfWAgfSk7XG5cbiAgICAvLyBHSVZFTjogbWFudWFsXG4gICAgY29uc3QgYXBwTSA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBwcm9kdWNlck0gPSBuZXcgU3RhY2soYXBwTSwgJ1Byb2R1Y2VyJyk7XG4gICAgY29uc3QgcmVzb3VyY2VNID0gbmV3IENmblJlc291cmNlKHByb2R1Y2VyTSwgJ1Jlc291cmNlJywgeyB0eXBlOiAnQVdTOjpSZXNvdXJjZScgfSk7XG4gICAgKHJlc291cmNlTSBhcyBhbnkpLmF0dHJBdHQgPSBbJ0ZvbycsICdCYXInXTtcbiAgICBwcm9kdWNlck0uZXhwb3J0U3RyaW5nTGlzdFZhbHVlKHJlc291cmNlTS5nZXRBdHQoJ0F0dCcsIFJlc29sdXRpb25UeXBlSGludC5TVFJJTkdfTElTVCkpO1xuXG4gICAgLy8gVEhFTiAtIHByb2R1Y2VycyBhcmUgdGhlIHNhbWVcbiAgICBjb25zdCB0ZW1wbGF0ZUEgPSBhcHBBLnN5bnRoKCkuZ2V0U3RhY2tCeU5hbWUocHJvZHVjZXJBLnN0YWNrTmFtZSkudGVtcGxhdGU7XG4gICAgY29uc3QgdGVtcGxhdGVNID0gYXBwTS5zeW50aCgpLmdldFN0YWNrQnlOYW1lKHByb2R1Y2VyTS5zdGFja05hbWUpLnRlbXBsYXRlO1xuXG4gICAgZXhwZWN0KHRlbXBsYXRlQSkudG9FcXVhbCh0ZW1wbGF0ZU0pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvdyBlcnJvciBpZiBvdmVycmlkZUxvZ2ljYWxJZCBpcyB1c2VkIGFuZCBsb2dpY2FsSWQgaXMgbG9ja2VkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOOiBtYW51YWxcbiAgICBjb25zdCBhcHBNID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHByb2R1Y2VyTSA9IG5ldyBTdGFjayhhcHBNLCAnUHJvZHVjZXInKTtcbiAgICBjb25zdCByZXNvdXJjZU0gPSBuZXcgQ2ZuUmVzb3VyY2UocHJvZHVjZXJNLCAnUmVzb3VyY2VYWFgnLCB7IHR5cGU6ICdBV1M6OlJlc291cmNlJyB9KTtcbiAgICBwcm9kdWNlck0uZXhwb3J0VmFsdWUocmVzb3VyY2VNLmdldEF0dCgnQXR0JykpO1xuXG4gICAgLy8gVEhFTiAtIHByb2R1Y2VycyBhcmUgdGhlIHNhbWVcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgcmVzb3VyY2VNLm92ZXJyaWRlTG9naWNhbElkKCdPVkVSUklERV9MT0dJQ0FMX0lEJyk7XG4gICAgfSkudG9UaHJvdygvVGhlIGxvZ2ljYWxJZCBmb3IgcmVzb3VyY2UgYXQgcGF0aCBQcm9kdWNlclxcL1Jlc291cmNlWFhYIGhhcyBiZWVuIGxvY2tlZCBhbmQgY2Fubm90IGJlIG92ZXJyaWRkZW4vKTtcbiAgfSk7XG5cbiAgdGVzdCgnZG8gbm90IHRocm93IGVycm9yIGlmIG92ZXJyaWRlTG9naWNhbElkIGlzIHVzZWQgYW5kIGxvZ2ljYWxJZCBpcyBub3QgbG9ja2VkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOOiBtYW51YWxcbiAgICBjb25zdCBhcHBNID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHByb2R1Y2VyTSA9IG5ldyBTdGFjayhhcHBNLCAnUHJvZHVjZXInKTtcbiAgICBjb25zdCByZXNvdXJjZU0gPSBuZXcgQ2ZuUmVzb3VyY2UocHJvZHVjZXJNLCAnUmVzb3VyY2VYWFgnLCB7IHR5cGU6ICdBV1M6OlJlc291cmNlJyB9KTtcblxuICAgIC8vIFRIRU4gLSBwcm9kdWNlcnMgYXJlIHRoZSBzYW1lXG4gICAgcmVzb3VyY2VNLm92ZXJyaWRlTG9naWNhbElkKCdPVkVSUklERV9MT0dJQ0FMX0lEJyk7XG4gICAgcHJvZHVjZXJNLmV4cG9ydFZhbHVlKHJlc291cmNlTS5nZXRBdHQoJ0F0dCcpKTtcblxuICAgIGNvbnN0IHRlbXBsYXRlID0gYXBwTS5zeW50aCgpLmdldFN0YWNrQnlOYW1lKHByb2R1Y2VyTS5zdGFja05hbWUpLnRlbXBsYXRlO1xuICAgIGV4cGVjdCh0ZW1wbGF0ZSkudG9NYXRjaE9iamVjdCh7XG4gICAgICBPdXRwdXRzOiB7XG4gICAgICAgIEV4cG9ydHNPdXRwdXRGbkdldEF0dE9WRVJSSURFTE9HSUNBTElEQXR0MkREMjgwMTk6IHtcbiAgICAgICAgICBFeHBvcnQ6IHtcbiAgICAgICAgICAgIE5hbWU6ICdQcm9kdWNlcjpFeHBvcnRzT3V0cHV0Rm5HZXRBdHRPVkVSUklERUxPR0lDQUxJREF0dDJERDI4MDE5JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFZhbHVlOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ09WRVJSSURFX0xPR0lDQUxfSUQnLFxuICAgICAgICAgICAgICAnQXR0JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgT1ZFUlJJREVfTE9HSUNBTF9JRDoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OlJlc291cmNlJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2F1dG9tYXRpYyBjcm9zcy1zdGFjayByZWZlcmVuY2VzIGFuZCBtYW51YWwgZXhwb3J0cyBsb29rIHRoZSBzYW1lOiBuZXN0ZWQgc3RhY2sgZWRpdGlvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTjogYXV0b21hdGljXG4gICAgY29uc3QgYXBwQSA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBwcm9kdWNlckEgPSBuZXcgU3RhY2soYXBwQSwgJ1Byb2R1Y2VyJyk7XG4gICAgY29uc3QgbmVzdGVkQSA9IG5ldyBOZXN0ZWRTdGFjayhwcm9kdWNlckEsICdOZXN0b3InKTtcbiAgICBjb25zdCByZXNvdXJjZUEgPSBuZXcgQ2ZuUmVzb3VyY2UobmVzdGVkQSwgJ1Jlc291cmNlJywgeyB0eXBlOiAnQVdTOjpSZXNvdXJjZScgfSk7XG5cbiAgICBjb25zdCBjb25zdW1lckEgPSBuZXcgU3RhY2soYXBwQSwgJ0NvbnN1bWVyJyk7XG4gICAgbmV3IENmbk91dHB1dChjb25zdW1lckEsICdTb21lT3V0cHV0JywgeyB2YWx1ZTogYCR7cmVzb3VyY2VBLmdldEF0dCgnQXR0Jyl9YCB9KTtcblxuICAgIC8vIEdJVkVOOiBtYW51YWxcbiAgICBjb25zdCBhcHBNID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHByb2R1Y2VyTSA9IG5ldyBTdGFjayhhcHBNLCAnUHJvZHVjZXInKTtcbiAgICBjb25zdCBuZXN0ZWRNID0gbmV3IE5lc3RlZFN0YWNrKHByb2R1Y2VyTSwgJ05lc3RvcicpO1xuICAgIGNvbnN0IHJlc291cmNlTSA9IG5ldyBDZm5SZXNvdXJjZShuZXN0ZWRNLCAnUmVzb3VyY2UnLCB7IHR5cGU6ICdBV1M6OlJlc291cmNlJyB9KTtcbiAgICBwcm9kdWNlck0uZXhwb3J0VmFsdWUocmVzb3VyY2VNLmdldEF0dCgnQXR0JykpO1xuXG4gICAgLy8gVEhFTiAtIHByb2R1Y2VycyBhcmUgdGhlIHNhbWVcbiAgICBjb25zdCB0ZW1wbGF0ZUEgPSBhcHBBLnN5bnRoKCkuZ2V0U3RhY2tCeU5hbWUocHJvZHVjZXJBLnN0YWNrTmFtZSkudGVtcGxhdGU7XG4gICAgY29uc3QgdGVtcGxhdGVNID0gYXBwTS5zeW50aCgpLmdldFN0YWNrQnlOYW1lKHByb2R1Y2VyTS5zdGFja05hbWUpLnRlbXBsYXRlO1xuXG4gICAgZXhwZWN0KHRlbXBsYXRlQSkudG9FcXVhbCh0ZW1wbGF0ZU0pO1xuICB9KTtcblxuICB0ZXN0KCdtYW51YWwgZXhwb3J0cyByZXF1aXJlIGEgbmFtZSBpZiBub3Qgc3VwcGx5aW5nIGEgcmVzb3VyY2UgYXR0cmlidXRlJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdTdGFjaycpO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIHN0YWNrLmV4cG9ydFZhbHVlKCdzb21lVmFsdWUnKTtcbiAgICB9KS50b1Rocm93KC9vciBtYWtlIHN1cmUgdG8gZXhwb3J0IGEgcmVzb3VyY2UgYXR0cmlidXRlLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ21hbnVhbCBsaXN0IGV4cG9ydHMgcmVxdWlyZSBhIG5hbWUgaWYgbm90IHN1cHBseWluZyBhIHJlc291cmNlIGF0dHJpYnV0ZScsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2snKTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBzdGFjay5leHBvcnRTdHJpbmdMaXN0VmFsdWUoWydzb21lVmFsdWUnXSk7XG4gICAgfSkudG9UaHJvdygvb3IgbWFrZSBzdXJlIHRvIGV4cG9ydCBhIHJlc291cmNlIGF0dHJpYnV0ZS8pO1xuICB9KTtcblxuICB0ZXN0KCdtYW51YWwgZXhwb3J0cyBjYW4gYWxzbyBqdXN0IGJlIHVzZWQgdG8gY3JlYXRlIGFuIGV4cG9ydCBvZiBhbnl0aGluZycsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2snKTtcblxuICAgIGNvbnN0IGltcG9ydFYgPSBzdGFjay5leHBvcnRWYWx1ZSgnc29tZVZhbHVlJywgeyBuYW1lOiAnTXlFeHBvcnQnIH0pO1xuXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoaW1wb3J0VikpLnRvRXF1YWwoeyAnRm46OkltcG9ydFZhbHVlJzogJ015RXhwb3J0JyB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnbWFudWFsIGxpc3QgZXhwb3J0cyBjYW4gYWxzbyBqdXN0IGJlIHVzZWQgdG8gY3JlYXRlIGFuIGV4cG9ydCBvZiBhbnl0aGluZycsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2snKTtcblxuICAgIGNvbnN0IGltcG9ydFYgPSBzdGFjay5leHBvcnRTdHJpbmdMaXN0VmFsdWUoWydzb21lVmFsdWUnLCAnYW5vdGhlclZhbHVlJ10sIHsgbmFtZTogJ015RXhwb3J0JyB9KTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGltcG9ydFYpKS50b0VxdWFsKFxuICAgICAge1xuICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICd8fCcsXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0ZuOjpJbXBvcnRWYWx1ZSc6ICdNeUV4cG9ydCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgKTtcblxuICAgIGNvbnN0IHRlbXBsYXRlID0gYXBwLnN5bnRoKCkuZ2V0U3RhY2tCeU5hbWUoc3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZTtcblxuICAgIGV4cGVjdCh0ZW1wbGF0ZSkudG9NYXRjaE9iamVjdCh7XG4gICAgICBPdXRwdXRzOiB7XG4gICAgICAgIEV4cG9ydE15RXhwb3J0OiB7XG4gICAgICAgICAgVmFsdWU6ICdzb21lVmFsdWV8fGFub3RoZXJWYWx1ZScsXG4gICAgICAgICAgRXhwb3J0OiB7XG4gICAgICAgICAgICBOYW1lOiAnTXlFeHBvcnQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdDZm5TeW50aGVzaXNFcnJvciBpcyBpZ25vcmVkIHdoZW4gcHJlcGFyaW5nIGNyb3NzIHJlZmVyZW5jZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnbXktc3RhY2snKTtcblxuICAgIC8vIFdIRU5cbiAgICBjbGFzcyBDZm5UZXN0IGV4dGVuZHMgQ2ZuUmVzb3VyY2Uge1xuICAgICAgcHVibGljIF90b0Nsb3VkRm9ybWF0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmV3IFBvc3RSZXNvbHZlVG9rZW4oe1xuICAgICAgICAgIHhvbzogMTIzNCxcbiAgICAgICAgfSwgcHJvcHMgPT4ge1xuICAgICAgICAgIHZhbGlkYXRlU3RyaW5nKHByb3BzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIG5ldyBDZm5UZXN0KHN0YWNrLCAnTXlUaGluZycsIHsgdHlwZTogJ0FXUzo6VHlwZScgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgcmVzb2x2ZVJlZmVyZW5jZXMoYXBwKTtcbiAgfSk7XG5cbiAgdGVzdCgnU3RhY2tzIGNhbiBiZSBjaGlsZHJlbiBvZiBvdGhlciBzdGFja3MgKHN1YnN0YWNrKSBhbmQgdGhleSB3aWxsIGJlIHN5bnRoZXNpemVkIHNlcGFyYXRlbHknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcGFyZW50U3RhY2sgPSBuZXcgU3RhY2soYXBwLCAncGFyZW50Jyk7XG4gICAgY29uc3QgY2hpbGRTdGFjayA9IG5ldyBTdGFjayhwYXJlbnRTdGFjaywgJ2NoaWxkJyk7XG4gICAgbmV3IENmblJlc291cmNlKHBhcmVudFN0YWNrLCAnTXlQYXJlbnRSZXNvdXJjZScsIHsgdHlwZTogJ1Jlc291cmNlOjpQYXJlbnQnIH0pO1xuICAgIG5ldyBDZm5SZXNvdXJjZShjaGlsZFN0YWNrLCAnTXlDaGlsZFJlc291cmNlJywgeyB0eXBlOiAnUmVzb3VyY2U6OkNoaWxkJyB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgIGV4cGVjdChhc3NlbWJseS5nZXRTdGFja0J5TmFtZShwYXJlbnRTdGFjay5zdGFja05hbWUpLnRlbXBsYXRlPy5SZXNvdXJjZXMpLnRvRXF1YWwoeyBNeVBhcmVudFJlc291cmNlOiB7IFR5cGU6ICdSZXNvdXJjZTo6UGFyZW50JyB9IH0pO1xuICAgIGV4cGVjdChhc3NlbWJseS5nZXRTdGFja0J5TmFtZShjaGlsZFN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGU/LlJlc291cmNlcykudG9FcXVhbCh7IE15Q2hpbGRSZXNvdXJjZTogeyBUeXBlOiAnUmVzb3VyY2U6OkNoaWxkJyB9IH0pO1xuICB9KTtcblxuICB0ZXN0KCdOZXN0ZWQgU3RhY2tzIGFyZSBzeW50aGVzaXplZCB3aXRoIERFU1RST1kgcG9saWN5JywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBwYXJlbnRTdGFjayA9IG5ldyBTdGFjayhhcHAsICdwYXJlbnQnKTtcbiAgICBjb25zdCBjaGlsZFN0YWNrID0gbmV3IE5lc3RlZFN0YWNrKHBhcmVudFN0YWNrLCAnY2hpbGQnKTtcbiAgICBuZXcgQ2ZuUmVzb3VyY2UoY2hpbGRTdGFjaywgJ0NoaWxkUmVzb3VyY2UnLCB7IHR5cGU6ICdSZXNvdXJjZTo6Q2hpbGQnIH0pO1xuXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBleHBlY3QoYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUocGFyZW50U3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZSkudG9FcXVhbChleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgY2hpbGROZXN0ZWRTdGFja2NoaWxkTmVzdGVkU3RhY2tSZXNvdXJjZTc0MDhEMDNGOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6Q2xvdWRGb3JtYXRpb246OlN0YWNrJyxcbiAgICAgICAgICBEZWxldGlvblBvbGljeTogJ0RlbGV0ZScsXG4gICAgICAgIH0pLFxuICAgICAgfSxcbiAgICB9KSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Fzc2V0IG1ldGFkYXRhIGFkZGVkIHRvIE5lc3RlZFN0YWNrIHJlc291cmNlIHRoYXQgY29udGFpbnMgYXNzZXQgcGF0aCBhbmQgcHJvcGVydHknLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHBhcmVudFN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ3BhcmVudCcpO1xuICAgIHBhcmVudFN0YWNrLm5vZGUuc2V0Q29udGV4dChjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9FTkFCTEVEX0NPTlRFWFQsIHRydWUpO1xuICAgIGNvbnN0IGNoaWxkU3RhY2sgPSBuZXcgTmVzdGVkU3RhY2socGFyZW50U3RhY2ssICdjaGlsZCcpO1xuICAgIG5ldyBDZm5SZXNvdXJjZShjaGlsZFN0YWNrLCAnQ2hpbGRSZXNvdXJjZScsIHsgdHlwZTogJ1Jlc291cmNlOjpDaGlsZCcgfSk7XG5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgIGV4cGVjdChhc3NlbWJseS5nZXRTdGFja0J5TmFtZShwYXJlbnRTdGFjay5zdGFja05hbWUpLnRlbXBsYXRlKS50b0VxdWFsKGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBjaGlsZE5lc3RlZFN0YWNrY2hpbGROZXN0ZWRTdGFja1Jlc291cmNlNzQwOEQwM0Y6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICBNZXRhZGF0YToge1xuICAgICAgICAgICAgJ2F3czphc3NldDpwYXRoJzogJ3BhcmVudGNoaWxkMTNGOTM1OUIubmVzdGVkLnRlbXBsYXRlLmpzb24nLFxuICAgICAgICAgICAgJ2F3czphc3NldDpwcm9wZXJ0eSc6ICdUZW1wbGF0ZVVSTCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICB9LFxuICAgIH0pKTtcbiAgfSk7XG5cbiAgdGVzdCgnY3Jvc3Mtc3RhY2sgcmVmZXJlbmNlIChzdWJzdGFjayByZWZlcmVuY2VzIHBhcmVudCBzdGFjayknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHsgY29udGV4dDogeyBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UgfSB9KTtcbiAgICBjb25zdCBwYXJlbnRTdGFjayA9IG5ldyBTdGFjayhhcHAsICdwYXJlbnQnKTtcbiAgICBjb25zdCBjaGlsZFN0YWNrID0gbmV3IFN0YWNrKHBhcmVudFN0YWNrLCAnY2hpbGQnKTtcblxuICAgIC8vIFdIRU4gKGEgcmVzb3VyY2UgZnJvbSB0aGUgY2hpbGQgc3RhY2sgcmVmZXJlbmNlcyBhIHJlc291cmNlIGZyb20gdGhlIHBhcmVudCBzdGFjaylcbiAgICBjb25zdCBwYXJlbnRSZXNvdXJjZSA9IG5ldyBDZm5SZXNvdXJjZShwYXJlbnRTdGFjaywgJ015UGFyZW50UmVzb3VyY2UnLCB7IHR5cGU6ICdSZXNvdXJjZTo6UGFyZW50JyB9KTtcbiAgICBuZXcgQ2ZuUmVzb3VyY2UoY2hpbGRTdGFjaywgJ015Q2hpbGRSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdSZXNvdXJjZTo6Q2hpbGQnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBDaGlsZFByb3A6IHBhcmVudFJlc291cmNlLmdldEF0dCgnQXR0T2ZQYXJlbnRSZXNvdXJjZScpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgIGV4cGVjdChhc3NlbWJseS5nZXRTdGFja0J5TmFtZShwYXJlbnRTdGFjay5zdGFja05hbWUpLnRlbXBsYXRlKS50b0VxdWFsKHtcbiAgICAgIFJlc291cmNlczogeyBNeVBhcmVudFJlc291cmNlOiB7IFR5cGU6ICdSZXNvdXJjZTo6UGFyZW50JyB9IH0sXG4gICAgICBPdXRwdXRzOiB7XG4gICAgICAgIEV4cG9ydHNPdXRwdXRGbkdldEF0dE15UGFyZW50UmVzb3VyY2VBdHRPZlBhcmVudFJlc291cmNlQzJEMEJCOUU6IHtcbiAgICAgICAgICBWYWx1ZTogeyAnRm46OkdldEF0dCc6IFsnTXlQYXJlbnRSZXNvdXJjZScsICdBdHRPZlBhcmVudFJlc291cmNlJ10gfSxcbiAgICAgICAgICBFeHBvcnQ6IHsgTmFtZTogJ3BhcmVudDpFeHBvcnRzT3V0cHV0Rm5HZXRBdHRNeVBhcmVudFJlc291cmNlQXR0T2ZQYXJlbnRSZXNvdXJjZUMyRDBCQjlFJyB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBleHBlY3QoYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoY2hpbGRTdGFjay5zdGFja05hbWUpLnRlbXBsYXRlKS50b0VxdWFsKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBNeUNoaWxkUmVzb3VyY2U6IHtcbiAgICAgICAgICBUeXBlOiAnUmVzb3VyY2U6OkNoaWxkJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBDaGlsZFByb3A6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpJbXBvcnRWYWx1ZSc6ICdwYXJlbnQ6RXhwb3J0c091dHB1dEZuR2V0QXR0TXlQYXJlbnRSZXNvdXJjZUF0dE9mUGFyZW50UmVzb3VyY2VDMkQwQkI5RScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcm9zcy1zdGFjayByZWZlcmVuY2UgKHBhcmVudCBzdGFjayByZWZlcmVuY2VzIHN1YnN0YWNrKScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoe1xuICAgICAgY29udGV4dDoge1xuICAgICAgICAnQGF3cy1jZGsvY29yZTpzdGFja1JlbGF0aXZlRXhwb3J0cyc6IHRydWUsXG4gICAgICAgIFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBwYXJlbnRTdGFjayA9IG5ldyBTdGFjayhhcHAsICdwYXJlbnQnKTtcbiAgICBjb25zdCBjaGlsZFN0YWNrID0gbmV3IFN0YWNrKHBhcmVudFN0YWNrLCAnY2hpbGQnKTtcblxuICAgIC8vIFdIRU4gKGEgcmVzb3VyY2UgZnJvbSB0aGUgY2hpbGQgc3RhY2sgcmVmZXJlbmNlcyBhIHJlc291cmNlIGZyb20gdGhlIHBhcmVudCBzdGFjaylcbiAgICBjb25zdCBjaGlsZFJlc291cmNlID0gbmV3IENmblJlc291cmNlKGNoaWxkU3RhY2ssICdNeUNoaWxkUmVzb3VyY2UnLCB7IHR5cGU6ICdSZXNvdXJjZTo6Q2hpbGQnIH0pO1xuICAgIG5ldyBDZm5SZXNvdXJjZShwYXJlbnRTdGFjaywgJ015UGFyZW50UmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnUmVzb3VyY2U6OlBhcmVudCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIFBhcmVudFByb3A6IGNoaWxkUmVzb3VyY2UuZ2V0QXR0KCdBdHRyaWJ1dGVPZkNoaWxkUmVzb3VyY2UnKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBleHBlY3QoYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUocGFyZW50U3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZSkudG9FcXVhbCh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgTXlQYXJlbnRSZXNvdXJjZToge1xuICAgICAgICAgIFR5cGU6ICdSZXNvdXJjZTo6UGFyZW50JyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBQYXJlbnRQcm9wOiB7ICdGbjo6SW1wb3J0VmFsdWUnOiAncGFyZW50Y2hpbGQxM0Y5MzU5QjpFeHBvcnRzT3V0cHV0Rm5HZXRBdHRNeUNoaWxkUmVzb3VyY2VBdHRyaWJ1dGVPZkNoaWxkUmVzb3VyY2U1MjgxMzI2NCcgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGV4cGVjdChhc3NlbWJseS5nZXRTdGFja0J5TmFtZShjaGlsZFN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGUpLnRvRXF1YWwoe1xuICAgICAgUmVzb3VyY2VzOiB7IE15Q2hpbGRSZXNvdXJjZTogeyBUeXBlOiAnUmVzb3VyY2U6OkNoaWxkJyB9IH0sXG4gICAgICBPdXRwdXRzOiB7XG4gICAgICAgIEV4cG9ydHNPdXRwdXRGbkdldEF0dE15Q2hpbGRSZXNvdXJjZUF0dHJpYnV0ZU9mQ2hpbGRSZXNvdXJjZTUyODEzMjY0OiB7XG4gICAgICAgICAgVmFsdWU6IHsgJ0ZuOjpHZXRBdHQnOiBbJ015Q2hpbGRSZXNvdXJjZScsICdBdHRyaWJ1dGVPZkNoaWxkUmVzb3VyY2UnXSB9LFxuICAgICAgICAgIEV4cG9ydDogeyBOYW1lOiAncGFyZW50Y2hpbGQxM0Y5MzU5QjpFeHBvcnRzT3V0cHV0Rm5HZXRBdHRNeUNoaWxkUmVzb3VyY2VBdHRyaWJ1dGVPZkNoaWxkUmVzb3VyY2U1MjgxMzI2NCcgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Nhbm5vdCBjcmVhdGUgY3ljbGljIHJlZmVyZW5jZSBiZXR3ZWVuIHN0YWNrcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2sxJyk7XG4gICAgY29uc3QgYWNjb3VudDEgPSBuZXcgU2NvcGVkQXdzKHN0YWNrMSkuYWNjb3VudElkO1xuICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhhcHAsICdTdGFjazInKTtcbiAgICBjb25zdCBhY2NvdW50MiA9IG5ldyBTY29wZWRBd3Moc3RhY2syKS5hY2NvdW50SWQ7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IENmblBhcmFtZXRlcihzdGFjazIsICdTb21lUGFyYW1ldGVyJywgeyB0eXBlOiAnU3RyaW5nJywgZGVmYXVsdDogYWNjb3VudDEgfSk7XG4gICAgbmV3IENmblBhcmFtZXRlcihzdGFjazEsICdTb21lUGFyYW1ldGVyJywgeyB0eXBlOiAnU3RyaW5nJywgZGVmYXVsdDogYWNjb3VudDIgfSk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgYXBwLnN5bnRoKCk7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgIH0pLnRvVGhyb3coXCInU3RhY2sxJyBkZXBlbmRzIG9uICdTdGFjazInIChTdGFjazEgLT4gU3RhY2syLkFXUzo6QWNjb3VudElkKS4gQWRkaW5nIHRoaXMgZGVwZW5kZW5jeSAoU3RhY2syIC0+IFN0YWNrMS5BV1M6OkFjY291bnRJZCkgd291bGQgY3JlYXRlIGEgY3ljbGljIHJlZmVyZW5jZS5cIik7XG4gIH0pO1xuXG4gIHRlc3QoJ3N0YWNrcyBrbm93IGFib3V0IHRoZWlyIGRlcGVuZGVuY2llcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2sxJyk7XG4gICAgY29uc3QgYWNjb3VudDEgPSBuZXcgU2NvcGVkQXdzKHN0YWNrMSkuYWNjb3VudElkO1xuICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhhcHAsICdTdGFjazInKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQ2ZuUGFyYW1ldGVyKHN0YWNrMiwgJ1NvbWVQYXJhbWV0ZXInLCB7IHR5cGU6ICdTdHJpbmcnLCBkZWZhdWx0OiBhY2NvdW50MSB9KTtcblxuICAgIGFwcC5zeW50aCgpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjazIuZGVwZW5kZW5jaWVzLm1hcChzID0+IHMubm9kZS5pZCkpLnRvRXF1YWwoWydTdGFjazEnXSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Nhbm5vdCBjcmVhdGUgcmVmZXJlbmNlcyB0byBzdGFja3MgaW4gb3RoZXIgYWNjb3VudHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMScsIHsgZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLCByZWdpb246ICdlcy1ub3JzdC0xJyB9IH0pO1xuICAgIGNvbnN0IGFjY291bnQxID0gbmV3IFNjb3BlZEF3cyhzdGFjazEpLmFjY291bnRJZDtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJywgeyBlbnY6IHsgYWNjb3VudDogJzExMTExMTExMTExJywgcmVnaW9uOiAnZXMtbm9yc3QtMicgfSB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQ2ZuUGFyYW1ldGVyKHN0YWNrMiwgJ1NvbWVQYXJhbWV0ZXInLCB7IHR5cGU6ICdTdHJpbmcnLCBkZWZhdWx0OiBhY2NvdW50MSB9KTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBhcHAuc3ludGgoKTtcbiAgICB9KS50b1Rocm93KC9TdGFjayBcIlN0YWNrMlwiIGNhbm5vdCByZWZlcmVuY2UgW14gXSsgaW4gc3RhY2sgXCJTdGFjazFcIi8pO1xuICB9KTtcblxuICB0ZXN0KCd1cmxTdWZmaXggZG9lcyBub3QgaW1wbHkgYSBzdGFjayBkZXBlbmRlbmN5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IGZpcnN0ID0gbmV3IFN0YWNrKGFwcCwgJ0ZpcnN0Jyk7XG4gICAgY29uc3Qgc2Vjb25kID0gbmV3IFN0YWNrKGFwcCwgJ1NlY29uZCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBDZm5PdXRwdXQoc2Vjb25kLCAnT3V0cHV0Jywge1xuICAgICAgdmFsdWU6IGZpcnN0LnVybFN1ZmZpeCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBhcHAuc3ludGgoKTtcblxuICAgIGV4cGVjdChzZWNvbmQuZGVwZW5kZW5jaWVzLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgfSk7XG5cbiAgdGVzdCgnc3RhY2sgd2l0aCByZWdpb24gc3VwcGxpZWQgdmlhIHByb3BzIHJldHVybnMgbGl0ZXJhbCB2YWx1ZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdTdGFjazEnLCB7IGVudjogeyBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJywgcmVnaW9uOiAnZXMtbm9yc3QtMScgfSB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzdGFjay5yZWdpb24pKS50b0VxdWFsKCdlcy1ub3JzdC0xJyk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdzdGFjayBwYXJ0aXRpb24gbGl0ZXJhbCBmZWF0dXJlIGZsYWcnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBmZWF0dXJlRmxhZyA9IHsgW2N4YXBpLkVOQUJMRV9QQVJUSVRJT05fTElURVJBTFNdOiB0cnVlIH07XG4gICAgY29uc3QgZW52Rm9yUmVnaW9uID0gKHJlZ2lvbjogc3RyaW5nKSA9PiB7IHJldHVybiB7IGVudjogeyBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJywgcmVnaW9uOiByZWdpb24gfSB9OyB9O1xuXG4gICAgLy8gVEhFTlxuICAgIGRlc2NyaWJlKCdkb2VzIG5vdCBjaGFuZ2UgbWlzc2luZyBvciB1bmtub3duIHJlZ2lvbiBiZWhhdmlvcnMnLCAoKSA9PiB7XG4gICAgICB0ZXN0KCdzdGFja3Mgd2l0aCBubyByZWdpb24gZGVmaW5lZCcsICgpID0+IHtcbiAgICAgICAgY29uc3Qgbm9SZWdpb25TdGFjayA9IG5ldyBTdGFjayhuZXcgQXBwKCksICdNaXNzaW5nUmVnaW9uJyk7XG4gICAgICAgIGV4cGVjdChub1JlZ2lvblN0YWNrLnBhcnRpdGlvbikudG9FcXVhbChBd3MuUEFSVElUSU9OKTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdzdGFja3Mgd2l0aCBhbiB1bmtub3duIHJlZ2lvbicsICgpID0+IHtcbiAgICAgICAgY29uc3QgaW1hZ2luYXJ5UmVnaW9uU3RhY2sgPSBuZXcgU3RhY2sobmV3IEFwcCgpLCAnSW1hZ2luYXJ5UmVnaW9uJywgZW52Rm9yUmVnaW9uKCd1cy1hcmVhNTEnKSk7XG4gICAgICAgIGV4cGVjdChpbWFnaW5hcnlSZWdpb25TdGFjay5wYXJ0aXRpb24pLnRvRXF1YWwoQXdzLlBBUlRJVElPTik7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdjaGFuZ2VzIGtub3duIHJlZ2lvbiBiZWhhdmlvcnMgb25seSB3aGVuIGVuYWJsZWQnLCAoKSA9PiB7XG4gICAgICB0ZXN0KCcoZGlzYWJsZWQpJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgICAgIFJlZ2lvbkluZm8ucmVnaW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHJlZ2lvbikge1xuICAgICAgICAgIGNvbnN0IHJlZ2lvblN0YWNrID0gbmV3IFN0YWNrKGFwcCwgYFJlZ2lvbi0ke3JlZ2lvbi5uYW1lfWAsIGVudkZvclJlZ2lvbihyZWdpb24ubmFtZSkpO1xuICAgICAgICAgIGV4cGVjdChyZWdpb25TdGFjay5wYXJ0aXRpb24pLnRvRXF1YWwoQXdzLlBBUlRJVElPTik7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJyhlbmFibGVkKScsICgpID0+IHtcbiAgICAgICAgY29uc3QgYXBwID0gbmV3IEFwcCh7IGNvbnRleHQ6IGZlYXR1cmVGbGFnIH0pO1xuICAgICAgICBSZWdpb25JbmZvLnJlZ2lvbnMuZm9yRWFjaChmdW5jdGlvbihyZWdpb24pIHtcbiAgICAgICAgICBjb25zdCByZWdpb25TdGFjayA9IG5ldyBTdGFjayhhcHAsIGBSZWdpb24tJHtyZWdpb24ubmFtZX1gLCBlbnZGb3JSZWdpb24ocmVnaW9uLm5hbWUpKTtcbiAgICAgICAgICBleHBlY3QocmVnaW9uU3RhY2sucGFydGl0aW9uKS50b0VxdWFsKFJlZ2lvbkluZm8uZ2V0KHJlZ2lvbi5uYW1lKS5wYXJ0aXRpb24pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdvdmVycmlkZUxvZ2ljYWxJZChpZCkgY2FuIGJlIHVzZWQgdG8gb3ZlcnJpZGUgdGhlIGxvZ2ljYWwgSUQgb2YgYSByZXNvdXJjZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgYm9uam91ciA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ0JvbmpvdXJSZXNvdXJjZScsIHsgdHlwZTogJ1Jlc291cmNlOjpUeXBlJyB9KTtcblxuICAgIC8vIHsgUmVmIH0gYW5kIHsgR2V0QXR0IH1cbiAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZWZUb0JvbmpvdXInLCB7XG4gICAgICB0eXBlOiAnT3RoZXI6OlJlc291cmNlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgUmVmVG9Cb25qb3VyOiBib25qb3VyLnJlZixcbiAgICAgICAgR2V0QXR0Qm9uam91cjogYm9uam91ci5nZXRBdHQoJ1RoZUF0dCcpLnRvU3RyaW5nKCksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgYm9uam91ci5vdmVycmlkZUxvZ2ljYWxJZCgnQk9PTScpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICBSZXNvdXJjZXM6XG4gICAgICB7XG4gICAgICAgIEJPT006IHsgVHlwZTogJ1Jlc291cmNlOjpUeXBlJyB9LFxuICAgICAgICBSZWZUb0JvbmpvdXI6XG4gICAgICAgICB7XG4gICAgICAgICAgIFR5cGU6ICdPdGhlcjo6UmVzb3VyY2UnLFxuICAgICAgICAgICBQcm9wZXJ0aWVzOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBSZWZUb0JvbmpvdXI6IHsgUmVmOiAnQk9PTScgfSxcbiAgICAgICAgICAgICAgR2V0QXR0Qm9uam91cjogeyAnRm46OkdldEF0dCc6IFsnQk9PTScsICdUaGVBdHQnXSB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdTdGFjayBuYW1lIGNhbiBiZSBvdmVycmlkZGVuIHZpYSBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayh1bmRlZmluZWQsICdTdGFjaycsIHsgc3RhY2tOYW1lOiAnb3RoZXJOYW1lJyB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2suc3RhY2tOYW1lKS50b0VxdWFsKCdvdGhlck5hbWUnKTtcbiAgfSk7XG5cbiAgdGVzdCgnU3RhY2sgbmFtZSBpcyBpbmhlcml0ZWQgZnJvbSBBcHAgbmFtZSBpZiBhdmFpbGFibGUnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJvb3QgPSBuZXcgQXBwKCk7XG4gICAgY29uc3QgYXBwID0gbmV3IENvbnN0cnVjdChyb290LCAnUHJvZCcpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnN0YWNrTmFtZSkudG9FcXVhbCgnUHJvZFN0YWNrRDUyNzlCMjInKTtcbiAgfSk7XG5cbiAgdGVzdCgnZ2VuZXJhdGVkIHN0YWNrIG5hbWVzIHdpbGwgbm90IGV4Y2VlZCAxMjggY2hhcmFjdGVycycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgcm9vdCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBhcHAgPSBuZXcgQ29uc3RydWN0KHJvb3QsICdQcm9kQXBwVGhpc05hbWVCdXRJdFdpbGxPbmx5QmVUb29Mb25nV2hlbkNvbWJpbmVkV2l0aFRoZVN0YWNrTmFtZScgKyAneicucmVwZWF0KDYwKSk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnVGhpc05hbWVJc1ZlcnlMb25nQnV0SXRXaWxsT25seUJlVG9vTG9uZ1doZW5Db21iaW5lZFdpdGhUaGVBcHBOYW1lU3RhY2snKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2suc3RhY2tOYW1lLmxlbmd0aCkudG9FcXVhbCgxMjgpO1xuICAgIGV4cGVjdChzdGFjay5zdGFja05hbWUpLnRvRXF1YWwoJ1Byb2RBcHBUaGlzTmFtZUJ1dEl0V2lsbE9ubHlCZVRvb0xvbmdXaGVuQ29tYmluZWRXaXRoVGhlU3RhY2VyeUxvbmdCdXRJdFdpbGxPbmx5QmVUb29Mb25nV2hlbkNvbWJpbmVkV2l0aFRoZUFwcE5hbWVTdGFjazg2NENDMUQzJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N0YWNrIGNvbnN0cnVjdCBpZCBkb2VzIG5vdCBnbyB0aHJvdWdoIHN0YWNrIG5hbWUgdmFsaWRhdGlvbiBpZiB0aGVyZSBpcyBhbiBleHBsaWNpdCBzdGFjayBuYW1lJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ2ludmFsaWQgYXMgOiBzdGFjayBuYW1lLCBidXQgdGhhdHMgZmluZScsIHtcbiAgICAgIHN0YWNrTmFtZTogJ3ZhbGlkLXN0YWNrLW5hbWUnLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IHNlc3Npb24gPSBhcHAuc3ludGgoKTtcbiAgICBleHBlY3Qoc3RhY2suc3RhY2tOYW1lKS50b0VxdWFsKCd2YWxpZC1zdGFjay1uYW1lJyk7XG4gICAgZXhwZWN0KHNlc3Npb24udHJ5R2V0QXJ0aWZhY3Qoc3RhY2suYXJ0aWZhY3RJZCkpLnRvQmVEZWZpbmVkKCk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N0YWNrIHZhbGlkYXRpb24gaXMgcGVyZm9ybWVkIG9uIGV4cGxpY2l0IHN0YWNrIG5hbWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IG5ldyBTdGFjayhhcHAsICdib29tJywgeyBzdGFja05hbWU6ICdpbnZhbGlkOnN0YWNrOm5hbWUnIH0pKVxuICAgICAgLnRvVGhyb3coL1N0YWNrIG5hbWUgbXVzdCBtYXRjaCB0aGUgcmVndWxhciBleHByZXNzaW9uLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ1N0YWNrLm9mKHN0YWNrKSByZXR1cm5zIHRoZSBjb3JyZWN0IHN0YWNrJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgZXhwZWN0KFN0YWNrLm9mKHN0YWNrKSkudG9CZShzdGFjayk7XG4gICAgY29uc3QgcGFyZW50ID0gbmV3IENvbnN0cnVjdChzdGFjaywgJ1BhcmVudCcpO1xuICAgIGNvbnN0IGNvbnN0cnVjdCA9IG5ldyBDb25zdHJ1Y3QocGFyZW50LCAnQ29uc3RydWN0Jyk7XG4gICAgZXhwZWN0KFN0YWNrLm9mKGNvbnN0cnVjdCkpLnRvQmUoc3RhY2spO1xuICB9KTtcblxuICB0ZXN0KCdTdGFjay5vZigpIHRocm93cyB3aGVuIHRoZXJlIGlzIG5vIHBhcmVudCBTdGFjaycsICgpID0+IHtcbiAgICBjb25zdCByb290ID0gbmV3IENvbnN0cnVjdCh1bmRlZmluZWQgYXMgYW55LCAnUm9vdCcpO1xuICAgIGNvbnN0IGNvbnN0cnVjdCA9IG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ0NvbnN0cnVjdCcpO1xuICAgIGV4cGVjdCgoKSA9PiBTdGFjay5vZihjb25zdHJ1Y3QpKS50b1Rocm93KC9zaG91bGQgYmUgY3JlYXRlZCBpbiB0aGUgc2NvcGUgb2YgYSBTdGFjaywgYnV0IG5vIFN0YWNrIGZvdW5kLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ1N0YWNrLm9mKCkgd29ya3MgZm9yIHN1YnN0YWNrcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBwYXJlbnRTdGFjayA9IG5ldyBTdGFjayhhcHAsICdQYXJlbnRTdGFjaycpO1xuICAgIGNvbnN0IHBhcmVudFJlc291cmNlID0gbmV3IENmblJlc291cmNlKHBhcmVudFN0YWNrLCAnUGFyZW50UmVzb3VyY2UnLCB7IHR5cGU6ICdwYXJlbnQ6OnJlc291cmNlJyB9KTtcblxuICAgIC8vIHdlIHdpbGwgZGVmaW5lIGEgc3Vic3RhY2sgdW5kZXIgdGhlIC9yZXNvdXJjZS8uLi4ganVzdCBmb3IgZ2lnZ2xlcy5cbiAgICBjb25zdCBjaGlsZFN0YWNrID0gbmV3IFN0YWNrKHBhcmVudFJlc291cmNlLCAnQ2hpbGRTdGFjaycpO1xuICAgIGNvbnN0IGNoaWxkUmVzb3VyY2UgPSBuZXcgQ2ZuUmVzb3VyY2UoY2hpbGRTdGFjaywgJ0NoaWxkUmVzb3VyY2UnLCB7IHR5cGU6ICdjaGlsZDo6cmVzb3VyY2UnIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChTdGFjay5vZihwYXJlbnRTdGFjaykpLnRvQmUocGFyZW50U3RhY2spO1xuICAgIGV4cGVjdChTdGFjay5vZihwYXJlbnRSZXNvdXJjZSkpLnRvQmUocGFyZW50U3RhY2spO1xuICAgIGV4cGVjdChTdGFjay5vZihjaGlsZFN0YWNrKSkudG9CZShjaGlsZFN0YWNrKTtcbiAgICBleHBlY3QoU3RhY2sub2YoY2hpbGRSZXNvdXJjZSkpLnRvQmUoY2hpbGRTdGFjayk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N0YWNrLmF2YWlsYWJpbGl0eVpvbmVzIGZhbGxzIGJhY2sgdG8gRm46OkdldEFaWzBdLFsyXSBpZiByZWdpb24gaXMgbm90IHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdNeVN0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYXpzID0gc3RhY2suYXZhaWxhYmlsaXR5Wm9uZXM7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoYXpzKSkudG9FcXVhbChbXG4gICAgICB7ICdGbjo6U2VsZWN0JzogWzAsIHsgJ0ZuOjpHZXRBWnMnOiAnJyB9XSB9LFxuICAgICAgeyAnRm46OlNlbGVjdCc6IFsxLCB7ICdGbjo6R2V0QVpzJzogJycgfV0gfSxcbiAgICBdKTtcbiAgfSk7XG5cblxuICB0ZXN0KCdhbGxvd3MgdXNpbmcgdGhlIHNhbWUgc3RhY2sgbmFtZSBmb3IgdHdvIHN0YWNrcyAoaS5lLiBpbiBkaWZmZXJlbnQgcmVnaW9ucyknLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnTXlTdGFjazEnLCB7IHN0YWNrTmFtZTogJ3RoZXN0YWNrJyB9KTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnTXlTdGFjazInLCB7IHN0YWNrTmFtZTogJ3RoZXN0YWNrJyB9KTtcbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChhc3NlbWJseS5nZXRTdGFja0FydGlmYWN0KHN0YWNrMS5hcnRpZmFjdElkKS50ZW1wbGF0ZUZpbGUpLnRvRXF1YWwoJ015U3RhY2sxLnRlbXBsYXRlLmpzb24nKTtcbiAgICBleHBlY3QoYXNzZW1ibHkuZ2V0U3RhY2tBcnRpZmFjdChzdGFjazIuYXJ0aWZhY3RJZCkudGVtcGxhdGVGaWxlKS50b0VxdWFsKCdNeVN0YWNrMi50ZW1wbGF0ZS5qc29uJyk7XG4gICAgZXhwZWN0KHN0YWNrMS50ZW1wbGF0ZUZpbGUpLnRvRXF1YWwoJ015U3RhY2sxLnRlbXBsYXRlLmpzb24nKTtcbiAgICBleHBlY3Qoc3RhY2syLnRlbXBsYXRlRmlsZSkudG9FcXVhbCgnTXlTdGFjazIudGVtcGxhdGUuanNvbicpO1xuICB9KTtcblxuICB0ZXN0KCdhcnRpZmFjdElkIGFuZCB0ZW1wbGF0ZUZpbGUgdXNlIHRoZSB1bmlxdWUgaWQgYW5kIG5vdCB0aGUgc3RhY2sgbmFtZScsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdNeVN0YWNrMScsIHsgc3RhY2tOYW1lOiAndGhlc3RhY2snIH0pO1xuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrMS5hcnRpZmFjdElkKS50b0VxdWFsKCdNeVN0YWNrMScpO1xuICAgIGV4cGVjdChzdGFjazEudGVtcGxhdGVGaWxlKS50b0VxdWFsKCdNeVN0YWNrMS50ZW1wbGF0ZS5qc29uJyk7XG4gICAgZXhwZWN0KGFzc2VtYmx5LmdldFN0YWNrQXJ0aWZhY3Qoc3RhY2sxLmFydGlmYWN0SWQpLnRlbXBsYXRlRmlsZSkudG9FcXVhbCgnTXlTdGFjazEudGVtcGxhdGUuanNvbicpO1xuICB9KTtcblxuICB0ZXN0KCd1c2UgdGhlIGFydGlmYWN0IGlkIGFzIHRoZSB0ZW1wbGF0ZSBuYW1lJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ015U3RhY2sxJyk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcCwgJ015U3RhY2syJywgeyBzdGFja05hbWU6ICdNeVJlYWxTdGFjazInIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjazEudGVtcGxhdGVGaWxlKS50b0VxdWFsKCdNeVN0YWNrMS50ZW1wbGF0ZS5qc29uJyk7XG4gICAgZXhwZWN0KHN0YWNrMi50ZW1wbGF0ZUZpbGUpLnRvRXF1YWwoJ015U3RhY2syLnRlbXBsYXRlLmpzb24nKTtcbiAgfSk7XG5cbiAgdGVzdCgnbWV0YWRhdGEgaXMgY29sbGVjdGVkIGF0IHRoZSBzdGFjayBib3VuZGFyeScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoe1xuICAgICAgY29udGV4dDoge1xuICAgICAgICBbY3hhcGkuRElTQUJMRV9NRVRBREFUQV9TVEFDS19UUkFDRV06ICd0cnVlJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3QgcGFyZW50ID0gbmV3IFN0YWNrKGFwcCwgJ3BhcmVudCcpO1xuICAgIGNvbnN0IGNoaWxkID0gbmV3IFN0YWNrKHBhcmVudCwgJ2NoaWxkJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY2hpbGQubm9kZS5hZGRNZXRhZGF0YSgnZm9vJywgJ2JhcicpO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzbSA9IGFwcC5zeW50aCgpO1xuICAgIGV4cGVjdChhc20uZ2V0U3RhY2tCeU5hbWUocGFyZW50LnN0YWNrTmFtZSkuZmluZE1ldGFkYXRhQnlUeXBlKCdmb28nKSkudG9FcXVhbChbXSk7XG4gICAgZXhwZWN0KGFzbS5nZXRTdGFja0J5TmFtZShjaGlsZC5zdGFja05hbWUpLmZpbmRNZXRhZGF0YUJ5VHlwZSgnZm9vJykpLnRvRXF1YWwoW1xuICAgICAgeyBwYXRoOiAnL3BhcmVudC9jaGlsZCcsIHR5cGU6ICdmb28nLCBkYXRhOiAnYmFyJyB9LFxuICAgIF0pO1xuICB9KTtcblxuICB0ZXN0KCdzdGFjayB0YWdzIGFyZSByZWZsZWN0ZWQgaW4gdGhlIHN0YWNrIGNsb3VkIGFzc2VtYmx5IGFydGlmYWN0IG1ldGFkYXRhJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7IHN0YWNrVHJhY2VzOiBmYWxzZSwgY29udGV4dDogeyBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UgfSB9KTtcblxuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdzdGFjazEnKTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soc3RhY2sxLCAnc3RhY2syJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgVGFncy5vZihhcHApLmFkZCgnZm9vJywgJ2JhcicpO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzbSA9IGFwcC5zeW50aCgpO1xuICAgIGNvbnN0IGV4cGVjdGVkID0gW1xuICAgICAge1xuICAgICAgICB0eXBlOiAnYXdzOmNkazpzdGFjay10YWdzJyxcbiAgICAgICAgZGF0YTogW3sga2V5OiAnZm9vJywgdmFsdWU6ICdiYXInIH1dLFxuICAgICAgfSxcbiAgICBdO1xuXG4gICAgZXhwZWN0KGFzbS5nZXRTdGFja0FydGlmYWN0KHN0YWNrMS5hcnRpZmFjdElkKS5tYW5pZmVzdC5tZXRhZGF0YSkudG9FcXVhbCh7ICcvc3RhY2sxJzogZXhwZWN0ZWQgfSk7XG4gICAgZXhwZWN0KGFzbS5nZXRTdGFja0FydGlmYWN0KHN0YWNrMi5hcnRpZmFjdElkKS5tYW5pZmVzdC5tZXRhZGF0YSkudG9FcXVhbCh7ICcvc3RhY2sxL3N0YWNrMic6IGV4cGVjdGVkIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzdGFjayB0YWdzIGFyZSByZWZsZWN0ZWQgaW4gdGhlIHN0YWNrIGFydGlmYWN0IHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHsgc3RhY2tUcmFjZXM6IGZhbHNlIH0pO1xuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdzdGFjazEnKTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soc3RhY2sxLCAnc3RhY2syJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgVGFncy5vZihhcHApLmFkZCgnZm9vJywgJ2JhcicpO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzbSA9IGFwcC5zeW50aCgpO1xuICAgIGNvbnN0IGV4cGVjdGVkID0geyBmb286ICdiYXInIH07XG5cbiAgICBleHBlY3QoYXNtLmdldFN0YWNrQXJ0aWZhY3Qoc3RhY2sxLmFydGlmYWN0SWQpLnRhZ3MpLnRvRXF1YWwoZXhwZWN0ZWQpO1xuICAgIGV4cGVjdChhc20uZ2V0U3RhY2tBcnRpZmFjdChzdGFjazIuYXJ0aWZhY3RJZCkudGFncykudG9FcXVhbChleHBlY3RlZCk7XG4gIH0pO1xuXG4gIHRlc3QoJ1Rlcm1pbmF0aW9uIFByb3RlY3Rpb24gaXMgcmVmbGVjdGVkIGluIENsb3VkIEFzc2VtYmx5IGFydGlmYWN0JywgKCkgPT4ge1xuICAgIC8vIGlmIHRoZSByb290IGlzIGFuIGFwcCwgaW52b2tlIFwic3ludGhcIiB0byBhdm9pZCBkb3VibGUgc3ludGhlc2lzXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrJywgeyB0ZXJtaW5hdGlvblByb3RlY3Rpb246IHRydWUgfSk7XG5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgIGNvbnN0IGFydGlmYWN0ID0gYXNzZW1ibHkuZ2V0U3RhY2tBcnRpZmFjdChzdGFjay5hcnRpZmFjdElkKTtcblxuICAgIGV4cGVjdChhcnRpZmFjdC50ZXJtaW5hdGlvblByb3RlY3Rpb24pLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NvbnRleHQgY2FuIGJlIHNldCBvbiBhIHN0YWNrIHVzaW5nIGEgTGVnYWN5U3ludGhlc2l6ZXInLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB7XG4gICAgICBzeW50aGVzaXplcjogbmV3IExlZ2FjeVN0YWNrU3ludGhlc2l6ZXIoKSxcbiAgICB9KTtcbiAgICBzdGFjay5ub2RlLnNldENvbnRleHQoJ3NvbWV0aGluZycsICd2YWx1ZScpO1xuXG4gICAgLy8gVEhFTjogbm8gZXhjZXB0aW9uXG4gIH0pO1xuXG4gIHRlc3QoJ2NvbnRleHQgY2FuIGJlIHNldCBvbiBhIHN0YWNrIHVzaW5nIGEgRGVmYXVsdFN5bnRoZXNpemVyJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayh1bmRlZmluZWQsIHVuZGVmaW5lZCwge1xuICAgICAgc3ludGhlc2l6ZXI6IG5ldyBEZWZhdWx0U3RhY2tTeW50aGVzaXplcigpLFxuICAgIH0pO1xuICAgIHN0YWNrLm5vZGUuc2V0Q29udGV4dCgnc29tZXRoaW5nJywgJ3ZhbHVlJyk7XG5cbiAgICAvLyBUSEVOOiBubyBleGNlcHRpb25cbiAgfSk7XG5cbiAgdGVzdCgndmVyc2lvbiByZXBvcnRpbmcgY2FuIGJlIGNvbmZpZ3VyZWQgb24gdGhlIGFwcCcsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHsgYW5hbHl0aWNzUmVwb3J0aW5nOiB0cnVlIH0pO1xuICAgIGV4cGVjdChuZXcgU3RhY2soYXBwLCAnU3RhY2snKS5fdmVyc2lvblJlcG9ydGluZ0VuYWJsZWQpLnRvQmVEZWZpbmVkKCk7XG4gIH0pO1xuXG4gIHRlc3QoJ3ZlcnNpb24gcmVwb3J0aW5nIGNhbiBiZSBjb25maWd1cmVkIHdpdGggY29udGV4dCcsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHsgY29udGV4dDogeyAnYXdzOmNkazp2ZXJzaW9uLXJlcG9ydGluZyc6IHRydWUgfSB9KTtcbiAgICBleHBlY3QobmV3IFN0YWNrKGFwcCwgJ1N0YWNrJykuX3ZlcnNpb25SZXBvcnRpbmdFbmFibGVkKS50b0JlRGVmaW5lZCgpO1xuICB9KTtcblxuICB0ZXN0KCd2ZXJzaW9uIHJlcG9ydGluZyBjYW4gYmUgY29uZmlndXJlZCBvbiB0aGUgc3RhY2snLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGV4cGVjdChuZXcgU3RhY2soYXBwLCAnU3RhY2snLCB7IGFuYWx5dGljc1JlcG9ydGluZzogdHJ1ZSB9KS5fdmVyc2lvblJlcG9ydGluZ0VuYWJsZWQpLnRvQmVEZWZpbmVkKCk7XG4gIH0pO1xuXG4gIHRlc3QoJ3JlcXVpcmVzIGJ1bmRsaW5nIHdoZW4gd2lsZGNhcmQgaXMgc3BlY2lmaWVkIGluIEJVTkRMSU5HX1NUQUNLUycsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2snKTtcbiAgICBzdGFjay5ub2RlLnNldENvbnRleHQoY3hhcGkuQlVORExJTkdfU1RBQ0tTLCBbJyonXSk7XG4gICAgZXhwZWN0KHN0YWNrLmJ1bmRsaW5nUmVxdWlyZWQpLnRvQmUodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3JlcXVpcmVzIGJ1bmRsaW5nIHdoZW4gc3RhY2tOYW1lIGhhcyBhbiBleGFjdCBtYXRjaCBpbiBCVU5ETElOR19TVEFDS1MnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrJyk7XG4gICAgc3RhY2subm9kZS5zZXRDb250ZXh0KGN4YXBpLkJVTkRMSU5HX1NUQUNLUywgWydTdGFjayddKTtcbiAgICBleHBlY3Qoc3RhY2suYnVuZGxpbmdSZXF1aXJlZCkudG9CZSh0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdCgnZG9lcyBub3QgcmVxdWlyZSBidW5kbGluZyB3aGVuIG5vIGl0ZW0gZnJvbSBCVUlMRElOR19TVEFDS1MgbWF0Y2hlcyBzdGFja05hbWUnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrJyk7XG4gICAgc3RhY2subm9kZS5zZXRDb250ZXh0KGN4YXBpLkJVTkRMSU5HX1NUQUNLUywgWydTdGFjJ10pO1xuICAgIGV4cGVjdChzdGFjay5idW5kbGluZ1JlcXVpcmVkKS50b0JlKGZhbHNlKTtcbiAgfSk7XG5cbiAgdGVzdCgnZG9lcyBub3QgcmVxdWlyZSBidW5kbGluZyB3aGVuIEJVTkRMSU5HX1NUQUNLUyBpcyBlbXB0eScsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2snKTtcbiAgICBzdGFjay5ub2RlLnNldENvbnRleHQoY3hhcGkuQlVORExJTkdfU1RBQ0tTLCBbXSk7XG4gICAgZXhwZWN0KHN0YWNrLmJ1bmRsaW5nUmVxdWlyZWQpLnRvQmUoZmFsc2UpO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgncGVybWlzc2lvbnMgYm91bmRhcnknLCAoKSA9PiB7XG4gIHRlc3QoJ2NhbiBzcGVjaWZ5IGEgdmFsaWQgcGVybWlzc2lvbnMgYm91bmRhcnkgbmFtZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdTdGFjaycsIHtcbiAgICAgIHBlcm1pc3Npb25zQm91bmRhcnk6IFBlcm1pc3Npb25zQm91bmRhcnkuZnJvbU5hbWUoJ3ZhbGlkJyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgcGJDb250ZXh0ID0gc3RhY2subm9kZS50cnlHZXRDb250ZXh0KFBFUk1JU1NJT05TX0JPVU5EQVJZX0NPTlRFWFRfS0VZKTtcbiAgICBleHBlY3QocGJDb250ZXh0KS50b0VxdWFsKHtcbiAgICAgIG5hbWU6ICd2YWxpZCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBzcGVjaWZ5IGEgdmFsaWQgcGVybWlzc2lvbnMgYm91bmRhcnkgYXJuJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrJywge1xuICAgICAgcGVybWlzc2lvbnNCb3VuZGFyeTogUGVybWlzc2lvbnNCb3VuZGFyeS5mcm9tQXJuKCdhcm46YXdzOmlhbTo6MTIzNDU2Nzg5MTI6cG9saWN5L3ZhbGlkJyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgcGJDb250ZXh0ID0gc3RhY2subm9kZS50cnlHZXRDb250ZXh0KFBFUk1JU1NJT05TX0JPVU5EQVJZX0NPTlRFWFRfS0VZKTtcbiAgICBleHBlY3QocGJDb250ZXh0KS50b0VxdWFsKHtcbiAgICAgIG5hbWU6IHVuZGVmaW5lZCxcbiAgICAgIGFybjogJ2Fybjphd3M6aWFtOjoxMjM0NTY3ODkxMjpwb2xpY3kvdmFsaWQnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzaW5nbGUgYXNwZWN0IGlzIGFkZGVkIHRvIHN0YWNrJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHN0YWdlID0gbmV3IFN0YWdlKGFwcCwgJ1N0YWdlJywge1xuICAgICAgcGVybWlzc2lvbnNCb3VuZGFyeTogUGVybWlzc2lvbnNCb3VuZGFyeS5mcm9tQXJuKCdhcm46YXdzOmlhbTo6MTIzNDU2Nzg5MTI6cG9saWN5L3N0YWdlJyksXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soc3RhZ2UsICdTdGFjaycsIHtcbiAgICAgIHBlcm1pc3Npb25zQm91bmRhcnk6IFBlcm1pc3Npb25zQm91bmRhcnkuZnJvbUFybignYXJuOmF3czppYW06OjEyMzQ1Njc4OTEyOnBvbGljeS92YWxpZCcpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzcGVjdHMgPSBBc3BlY3RzLm9mKHN0YWNrKS5hbGw7XG4gICAgZXhwZWN0KGFzcGVjdHMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgIGNvbnN0IHBiQ29udGV4dCA9IHN0YWNrLm5vZGUudHJ5R2V0Q29udGV4dChQRVJNSVNTSU9OU19CT1VOREFSWV9DT05URVhUX0tFWSk7XG4gICAgZXhwZWN0KHBiQ29udGV4dCkudG9FcXVhbCh7XG4gICAgICBuYW1lOiB1bmRlZmluZWQsXG4gICAgICBhcm46ICdhcm46YXdzOmlhbTo6MTIzNDU2Nzg5MTI6cG9saWN5L3ZhbGlkJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIGlmIHBzZXVkbyBwYXJhbWV0ZXJzIGFyZSBpbiB0aGUgbmFtZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IFN0YWNrKGFwcCwgJ1N0YWNrJywge1xuICAgICAgICBwZXJtaXNzaW9uc0JvdW5kYXJ5OiBQZXJtaXNzaW9uc0JvdW5kYXJ5LmZyb21Bcm4oJ2Fybjphd3M6aWFtOjoke0FXUzo6QWNjb3VudElkfTpwb2xpY3kvdmFsaWQnKSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL1RoZSBwZXJtaXNzaW9ucyBib3VuZGFyeSAuKiBpbmNsdWRlcyBhIHBzZXVkbyBwYXJhbWV0ZXIvKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ3JlZ2lvbmFsRmFjdCcsICgpID0+IHtcbiAgRmFjdC5yZWdpc3Rlcih7IG5hbWU6ICdNeUZhY3QnLCByZWdpb246ICd1cy1lYXN0LTEnLCB2YWx1ZTogJ3guYW1hem9uYXdzLmNvbScgfSk7XG4gIEZhY3QucmVnaXN0ZXIoeyBuYW1lOiAnTXlGYWN0JywgcmVnaW9uOiAnZXUtd2VzdC0xJywgdmFsdWU6ICd4LmFtYXpvbmF3cy5jb20nIH0pO1xuICBGYWN0LnJlZ2lzdGVyKHsgbmFtZTogJ015RmFjdCcsIHJlZ2lvbjogJ2NuLW5vcnRoLTEnLCB2YWx1ZTogJ3guYW1hem9uYXdzLmNvbS5jbicgfSk7XG5cbiAgRmFjdC5yZWdpc3Rlcih7IG5hbWU6ICdXZWlyZEZhY3QnLCByZWdpb246ICd1cy1lYXN0LTEnLCB2YWx1ZTogJ29uZWZvcm1hdCcgfSk7XG4gIEZhY3QucmVnaXN0ZXIoeyBuYW1lOiAnV2VpcmRGYWN0JywgcmVnaW9uOiAnZXUtd2VzdC0xJywgdmFsdWU6ICdvdGhlcmZvcm1hdCcgfSk7XG5cbiAgdGVzdCgncmVnaW9uYWwgZmFjdHMgcmV0dXJuIGEgbGl0ZXJhbCB2YWx1ZSBpZiBwb3NzaWJsZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayh1bmRlZmluZWQsICdTdGFjaycsIHsgZW52OiB7IHJlZ2lvbjogJ3VzLWVhc3QtMScgfSB9KTtcbiAgICBleHBlY3Qoc3RhY2sucmVnaW9uYWxGYWN0KCdNeUZhY3QnKSkudG9FcXVhbCgneC5hbWF6b25hd3MuY29tJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3JlZ2lvbmFsIGZhY3RzIGFyZSBzaW1wbGlmaWVkIHRvIHVzZSBVUkxfU1VGRklYIHRva2VuIGlmIHBvc3NpYmxlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgZXhwZWN0KHN0YWNrLnJlZ2lvbmFsRmFjdCgnTXlGYWN0JykpLnRvRXF1YWwoYHguJHtBd3MuVVJMX1NVRkZJWH1gKTtcbiAgfSk7XG5cbiAgdGVzdCgncmVnaW9uYWwgZmFjdHMgYXJlIHNpbXBsaWZpZWQgdG8gdXNlIGNvbmNyZXRlIHZhbHVlcyBpZiBVUkxfU1VGRklYIHRva2VuIGlzIG5vdCBuZWNlc3NhcnknLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBOb2RlLm9mKHN0YWNrKS5zZXRDb250ZXh0KGN4YXBpLlRBUkdFVF9QQVJUSVRJT05TLCBbJ2F3cyddKTtcbiAgICBleHBlY3Qoc3RhY2sucmVnaW9uYWxGYWN0KCdNeUZhY3QnKSkudG9FcXVhbCgneC5hbWF6b25hd3MuY29tJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3JlZ2lvbmFsIGZhY3RzIHVzZSB0aGUgZ2xvYmFsIGxvb2t1cCBtYXAgaWYgcGFydGl0aW9uIGlzIHRoZSBsaXRlcmFsIHN0cmluZyBvZiBcInVuZGVmaW5lZFwiJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgTm9kZS5vZihzdGFjaykuc2V0Q29udGV4dChjeGFwaS5UQVJHRVRfUEFSVElUSU9OUywgJ3VuZGVmaW5lZCcpO1xuICAgIG5ldyBDZm5PdXRwdXQoc3RhY2ssICdUaGVGYWN0Jywge1xuICAgICAgdmFsdWU6IHN0YWNrLnJlZ2lvbmFsRmFjdCgnV2VpcmRGYWN0JyksXG4gICAgfSk7XG5cbiAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgTWFwcGluZ3M6IHtcbiAgICAgICAgV2VpcmRGYWN0TWFwOiB7XG4gICAgICAgICAgJ2V1LXdlc3QtMSc6IHsgdmFsdWU6ICdvdGhlcmZvcm1hdCcgfSxcbiAgICAgICAgICAndXMtZWFzdC0xJzogeyB2YWx1ZTogJ29uZWZvcm1hdCcgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBPdXRwdXRzOiB7XG4gICAgICAgIFRoZUZhY3Q6IHtcbiAgICAgICAgICBWYWx1ZToge1xuICAgICAgICAgICAgJ0ZuOjpGaW5kSW5NYXAnOiBbJ1dlaXJkRmFjdE1hcCcsIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sICd2YWx1ZSddLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ3JlZ2lvbmFsIGZhY3RzIGdlbmVyYXRlIGEgbWFwcGluZyBpZiBuZWNlc3NhcnknLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBuZXcgQ2ZuT3V0cHV0KHN0YWNrLCAnVGhlRmFjdCcsIHtcbiAgICAgIHZhbHVlOiBzdGFjay5yZWdpb25hbEZhY3QoJ1dlaXJkRmFjdCcpLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spKS50b0VxdWFsKHtcbiAgICAgIE1hcHBpbmdzOiB7XG4gICAgICAgIFdlaXJkRmFjdE1hcDoge1xuICAgICAgICAgICdldS13ZXN0LTEnOiB7IHZhbHVlOiAnb3RoZXJmb3JtYXQnIH0sXG4gICAgICAgICAgJ3VzLWVhc3QtMSc6IHsgdmFsdWU6ICdvbmVmb3JtYXQnIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgT3V0cHV0czoge1xuICAgICAgICBUaGVGYWN0OiB7XG4gICAgICAgICAgVmFsdWU6IHtcbiAgICAgICAgICAgICdGbjo6RmluZEluTWFwJzogW1xuICAgICAgICAgICAgICAnV2VpcmRGYWN0TWFwJyxcbiAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICAgJ3ZhbHVlJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N0YWNrLmFkZE1ldGFkYXRhKCkgYWRkcyBtZXRhZGF0YScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgc3RhY2suYWRkTWV0YWRhdGEoJ0luc3RhbmNlcycsIHsgRGVzY3JpcHRpb246ICdJbmZvcm1hdGlvbiBhYm91dCB0aGUgaW5zdGFuY2VzJyB9KTtcbiAgICBzdGFjay5hZGRNZXRhZGF0YSgnRGF0YWJhc2VzJywgeyBEZXNjcmlwdGlvbjogJ0luZm9ybWF0aW9uIGFib3V0IHRoZSBkYXRhYmFzZXMnIH0gKTtcblxuICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICBNZXRhZGF0YToge1xuICAgICAgICBJbnN0YW5jZXM6IHsgRGVzY3JpcHRpb246ICdJbmZvcm1hdGlvbiBhYm91dCB0aGUgaW5zdGFuY2VzJyB9LFxuICAgICAgICBEYXRhYmFzZXM6IHsgRGVzY3JpcHRpb246ICdJbmZvcm1hdGlvbiBhYm91dCB0aGUgZGF0YWJhc2VzJyB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuY2xhc3MgU3RhY2tXaXRoUG9zdFByb2Nlc3NvciBleHRlbmRzIFN0YWNrIHtcblxuICAvLyAuLi5cblxuICBwdWJsaWMgX3RvQ2xvdWRGb3JtYXRpb24oKSB7XG4gICAgY29uc3QgdGVtcGxhdGUgPSBzdXBlci5fdG9DbG91ZEZvcm1hdGlvbigpO1xuXG4gICAgLy8gbWFuaXB1bGF0ZSB0ZW1wbGF0ZSAoZS5nLiByZW5hbWUgXCJLZXlcIiB0byBcImtleVwiKVxuICAgIHRlbXBsYXRlLlJlc291cmNlcy5teVJlc291cmNlLlByb3BlcnRpZXMuRW52aXJvbm1lbnQua2V5ID1cbiAgICAgIHRlbXBsYXRlLlJlc291cmNlcy5teVJlc291cmNlLlByb3BlcnRpZXMuRW52aXJvbm1lbnQuS2V5O1xuICAgIGRlbGV0ZSB0ZW1wbGF0ZS5SZXNvdXJjZXMubXlSZXNvdXJjZS5Qcm9wZXJ0aWVzLkVudmlyb25tZW50LktleTtcblxuICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgfVxufVxuIl19