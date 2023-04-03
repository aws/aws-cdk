"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const cxapi = require("@aws-cdk/cx-api");
const lib_1 = require("../../lib");
const helpers_internal_1 = require("../../lib/helpers-internal");
const util_1 = require("../util");
const TEST_HANDLER = `${__dirname}/mock-provider`;
describe('custom resource provider', () => {
    describe('customize roles', () => {
        test('role is not created if preventSynthesis!=false', () => {
            // GIVEN
            const app = new lib_1.App();
            const stack = new lib_1.Stack(app, 'MyStack');
            stack.node.setContext(helpers_internal_1.CUSTOMIZE_ROLES_CONTEXT_KEY, {
                usePrecreatedRoles: {
                    'MyStack/Custom:MyResourceTypeCustomResourceProvider/Role': 'my-custom-role-name',
                },
            });
            const someResource = new lib_1.CfnResource(stack, 'SomeResource', {
                type: 'AWS::SomeResource',
                properties: {},
            });
            // WHEN
            const cr = lib_1.CustomResourceProvider.getOrCreateProvider(stack, 'Custom:MyResourceType', {
                codeDirectory: TEST_HANDLER,
                runtime: lib_1.CustomResourceProviderRuntime.NODEJS_14_X,
            });
            cr.addToRolePolicy({
                Action: 's3:GetBucket',
                Effect: 'Allow',
                Resource: someResource.ref,
            });
            // THEN
            const assembly = app.synth();
            const template = assembly.getStackByName('MyStack').template;
            const resourceTypes = Object.values(template.Resources).flatMap((value) => {
                return value.Type;
            });
            // role is not created
            expect(resourceTypes).not.toContain('AWS::IAM::Role');
            // lambda function references precreated role
            expect(template.Resources.CustomMyResourceTypeCustomResourceProviderHandler29FBDD2A.Properties.Role).toEqual({
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        {
                            Ref: 'AWS::Partition',
                        },
                        ':iam::',
                        {
                            Ref: 'AWS::AccountId',
                        },
                        ':role/my-custom-role-name',
                    ],
                ],
            });
            // report is generated correctly
            const filePath = path.join(assembly.directory, 'iam-policy-report.json');
            const file = fs.readFileSync(filePath, { encoding: 'utf-8' });
            expect(JSON.parse(file)).toEqual({
                roles: [{
                        roleConstructPath: 'MyStack/Custom:MyResourceTypeCustomResourceProvider/Role',
                        roleName: 'my-custom-role-name',
                        missing: false,
                        assumeRolePolicy: [{
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Principal: {
                                    Service: 'lambda.amazonaws.com',
                                },
                            }],
                        managedPolicyArns: [
                            'arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
                        ],
                        managedPolicyStatements: [],
                        identityPolicyStatements: [{
                                Action: 's3:GetBucket',
                                Effect: 'Allow',
                                Resource: '(MyStack/SomeResource.Ref)',
                            }],
                    }],
            });
        });
        test('role is created if preventSynthesis=false', () => {
            // GIVEN
            const app = new lib_1.App();
            const stack = new lib_1.Stack(app, 'MyStack');
            stack.node.setContext(helpers_internal_1.CUSTOMIZE_ROLES_CONTEXT_KEY, {
                preventSynthesis: false,
            });
            const someResource = new lib_1.CfnResource(stack, 'SomeResource', {
                type: 'AWS::SomeResource',
                properties: {},
            });
            // WHEN
            const cr = lib_1.CustomResourceProvider.getOrCreateProvider(stack, 'Custom:MyResourceType', {
                codeDirectory: TEST_HANDLER,
                runtime: lib_1.CustomResourceProviderRuntime.NODEJS_14_X,
            });
            cr.addToRolePolicy({
                Action: 's3:GetBucket',
                Effect: 'Allow',
                Resource: someResource.ref,
            });
            // THEN
            const assembly = app.synth();
            const template = assembly.getStackByName('MyStack').template;
            const resourceTypes = Object.values(template.Resources).flatMap((value) => {
                return value.Type;
            });
            // IAM role _is_ created
            expect(resourceTypes).toContain('AWS::IAM::Role');
            // lambda function references the created role
            expect(template.Resources.CustomMyResourceTypeCustomResourceProviderHandler29FBDD2A.Properties.Role).toEqual({
                'Fn::GetAtt': [
                    'CustomMyResourceTypeCustomResourceProviderRoleBD5E655F',
                    'Arn',
                ],
            });
            // report is still generated
            const filePath = path.join(assembly.directory, 'iam-policy-report.json');
            const file = fs.readFileSync(filePath, { encoding: 'utf-8' });
            expect(JSON.parse(file)).toEqual({
                roles: [{
                        roleConstructPath: 'MyStack/Custom:MyResourceTypeCustomResourceProvider/Role',
                        roleName: 'missing role',
                        missing: true,
                        assumeRolePolicy: [{
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Principal: {
                                    Service: 'lambda.amazonaws.com',
                                },
                            }],
                        managedPolicyArns: [
                            'arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
                        ],
                        managedPolicyStatements: [],
                        identityPolicyStatements: [{
                                Action: 's3:GetBucket',
                                Effect: 'Allow',
                                Resource: '(MyStack/SomeResource.Ref)',
                            }],
                    }],
            });
        });
    });
    test('minimal configuration', () => {
        // GIVEN
        const app = new lib_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack = new lib_1.Stack(app);
        // WHEN
        lib_1.CustomResourceProvider.getOrCreate(stack, 'Custom:MyResourceType', {
            codeDirectory: TEST_HANDLER,
            runtime: lib_1.CustomResourceProviderRuntime.NODEJS_14_X,
        });
        // THEN
        const cfn = (0, util_1.toCloudFormation)(stack);
        // The asset hash constantly changes, so in order to not have to chase it, just look
        // it up from the output.
        const staging = stack.node.tryFindChild('Custom:MyResourceTypeCustomResourceProvider')?.node.tryFindChild('Staging');
        const assetHash = staging.assetHash;
        const sourcePath = staging.sourcePath;
        const paramNames = Object.keys(cfn.Parameters);
        const bucketParam = paramNames[0];
        const keyParam = paramNames[1];
        const hashParam = paramNames[2];
        expect(fs.existsSync(path.join(sourcePath, '__entrypoint__.js'))).toEqual(true);
        expect(cfn).toEqual({
            Resources: {
                CustomMyResourceTypeCustomResourceProviderRoleBD5E655F: {
                    Type: 'AWS::IAM::Role',
                    Properties: {
                        AssumeRolePolicyDocument: {
                            Version: '2012-10-17',
                            Statement: [
                                {
                                    Action: 'sts:AssumeRole',
                                    Effect: 'Allow',
                                    Principal: {
                                        Service: 'lambda.amazonaws.com',
                                    },
                                },
                            ],
                        },
                        ManagedPolicyArns: [
                            {
                                'Fn::Sub': 'arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
                            },
                        ],
                    },
                },
                CustomMyResourceTypeCustomResourceProviderHandler29FBDD2A: {
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Code: {
                            S3Bucket: { Ref: bucketParam },
                            S3Key: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            'Fn::Select': [
                                                0,
                                                {
                                                    'Fn::Split': [
                                                        '||',
                                                        { Ref: keyParam },
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
                                                        { Ref: keyParam },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                ],
                            },
                        },
                        Timeout: 900,
                        MemorySize: 128,
                        Handler: '__entrypoint__.handler',
                        Role: {
                            'Fn::GetAtt': [
                                'CustomMyResourceTypeCustomResourceProviderRoleBD5E655F',
                                'Arn',
                            ],
                        },
                        Runtime: 'nodejs14.x',
                    },
                    DependsOn: [
                        'CustomMyResourceTypeCustomResourceProviderRoleBD5E655F',
                    ],
                },
            },
            Parameters: {
                [bucketParam]: {
                    Type: 'String',
                    Description: `S3 bucket for asset "${assetHash}"`,
                },
                [keyParam]: {
                    Type: 'String',
                    Description: `S3 key for asset version "${assetHash}"`,
                },
                [hashParam]: {
                    Type: 'String',
                    Description: `Artifact hash for asset "${assetHash}"`,
                },
            },
        });
    });
    test('asset metadata added to custom resource that contains code definition', () => {
        // GIVEN
        const stack = new lib_1.Stack();
        stack.node.setContext(cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT, true);
        stack.node.setContext(cxapi.DISABLE_ASSET_STAGING_CONTEXT, true);
        // WHEN
        lib_1.CustomResourceProvider.getOrCreate(stack, 'Custom:MyResourceType', {
            codeDirectory: TEST_HANDLER,
            runtime: lib_1.CustomResourceProviderRuntime.NODEJS_14_X,
        });
        // Then
        const lambda = (0, util_1.toCloudFormation)(stack).Resources.CustomMyResourceTypeCustomResourceProviderHandler29FBDD2A;
        expect(lambda).toHaveProperty('Metadata');
        expect(lambda.Metadata).toMatchObject({
            'aws:asset:property': 'Code',
            // The asset path should be a temporary folder prefixed with 'cdk-custom-resource'
            'aws:asset:path': expect.stringMatching(/^.*\/cdk-custom-resource\w{6}\/?$/),
        });
    });
    test('custom resource provided creates asset in new-style synthesis with relative path', () => {
        // GIVEN
        let assetFilename;
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'Stack', {
            synthesizer: {
                bind(_stack) { },
                addFileAsset(asset) {
                    assetFilename = asset.fileName;
                    return { bucketName: '', httpUrl: '', objectKey: '', s3ObjectUrl: '', s3Url: '', kmsKeyArn: '' };
                },
                addDockerImageAsset(_asset) {
                    return { imageUri: '', repositoryName: '' };
                },
                synthesize(_session) { },
            },
        });
        // WHEN
        lib_1.CustomResourceProvider.getOrCreate(stack, 'Custom:MyResourceType', {
            codeDirectory: TEST_HANDLER,
            runtime: lib_1.CustomResourceProviderRuntime.NODEJS_14_X,
        });
        // THEN -- no exception
        if (!assetFilename || assetFilename.startsWith(path.sep)) {
            throw new Error(`Asset filename must be a relative path, got: ${assetFilename}`);
        }
    });
    test('policyStatements can be used to add statements to the inline policy', () => {
        // GIVEN
        const stack = new lib_1.Stack();
        // WHEN
        lib_1.CustomResourceProvider.getOrCreate(stack, 'Custom:MyResourceType', {
            codeDirectory: TEST_HANDLER,
            runtime: lib_1.CustomResourceProviderRuntime.NODEJS_14_X,
            policyStatements: [
                { statement1: 123 },
                { statement2: { foo: 111 } },
            ],
        });
        // THEN
        const template = (0, util_1.toCloudFormation)(stack);
        const role = template.Resources.CustomMyResourceTypeCustomResourceProviderRoleBD5E655F;
        expect(role.Properties.Policies).toEqual([{
                PolicyName: 'Inline',
                PolicyDocument: {
                    Version: '2012-10-17',
                    Statement: [{ statement1: 123 }, { statement2: { foo: 111 } }],
                },
            }]);
    });
    test('addToRolePolicy() can be used to add statements to the inline policy', () => {
        // GIVEN
        const stack = new lib_1.Stack();
        // WHEN
        const provider = lib_1.CustomResourceProvider.getOrCreateProvider(stack, 'Custom:MyResourceType', {
            codeDirectory: TEST_HANDLER,
            runtime: lib_1.CustomResourceProviderRuntime.NODEJS_14_X,
            policyStatements: [
                { statement1: 123 },
                { statement2: { foo: 111 } },
            ],
        });
        provider.addToRolePolicy({ statement3: 456 });
        // THEN
        const template = (0, util_1.toCloudFormation)(stack);
        const role = template.Resources.CustomMyResourceTypeCustomResourceProviderRoleBD5E655F;
        expect(role.Properties.Policies).toEqual([{
                PolicyName: 'Inline',
                PolicyDocument: {
                    Version: '2012-10-17',
                    Statement: [{ statement1: 123 }, { statement2: { foo: 111 } }, { statement3: 456 }],
                },
            }]);
    });
    test('memorySize, timeout and description', () => {
        // GIVEN
        const stack = new lib_1.Stack();
        // WHEN
        lib_1.CustomResourceProvider.getOrCreate(stack, 'Custom:MyResourceType', {
            codeDirectory: TEST_HANDLER,
            runtime: lib_1.CustomResourceProviderRuntime.NODEJS_14_X,
            memorySize: lib_1.Size.gibibytes(2),
            timeout: lib_1.Duration.minutes(5),
            description: 'veni vidi vici',
        });
        // THEN
        const template = (0, util_1.toCloudFormation)(stack);
        const lambda = template.Resources.CustomMyResourceTypeCustomResourceProviderHandler29FBDD2A;
        expect(lambda.Properties.MemorySize).toEqual(2048);
        expect(lambda.Properties.Timeout).toEqual(300);
        expect(lambda.Properties.Description).toEqual('veni vidi vici');
    });
    test('environment variables', () => {
        // GIVEN
        const stack = new lib_1.Stack();
        // WHEN
        lib_1.CustomResourceProvider.getOrCreate(stack, 'Custom:MyResourceType', {
            codeDirectory: TEST_HANDLER,
            runtime: lib_1.CustomResourceProviderRuntime.NODEJS_14_X,
            environment: {
                B: 'b',
                A: 'a',
            },
        });
        // THEN
        const template = (0, util_1.toCloudFormation)(stack);
        const lambda = template.Resources.CustomMyResourceTypeCustomResourceProviderHandler29FBDD2A;
        expect(lambda.Properties.Environment).toEqual({
            Variables: expect.objectContaining({
                A: 'a',
                B: 'b',
            }),
        });
    });
    test('roleArn', () => {
        // GIVEN
        const stack = new lib_1.Stack();
        // WHEN
        const cr = lib_1.CustomResourceProvider.getOrCreateProvider(stack, 'Custom:MyResourceType', {
            codeDirectory: TEST_HANDLER,
            runtime: lib_1.CustomResourceProviderRuntime.NODEJS_14_X,
        });
        // THEN
        expect(stack.resolve(cr.roleArn)).toEqual({
            'Fn::GetAtt': [
                'CustomMyResourceTypeCustomResourceProviderRoleBD5E655F',
                'Arn',
            ],
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tLXJlc291cmNlLXByb3ZpZGVyLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjdXN0b20tcmVzb3VyY2UtcHJvdmlkZXIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFDN0IseUNBQXlDO0FBQ3pDLG1DQUFrUDtBQUNsUCxpRUFBeUU7QUFDekUsa0NBQTJDO0FBRTNDLE1BQU0sWUFBWSxHQUFHLEdBQUcsU0FBUyxnQkFBZ0IsQ0FBQztBQUVsRCxRQUFRLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7UUFDL0IsSUFBSSxDQUFDLGdEQUFnRCxFQUFFLEdBQUcsRUFBRTtZQUMxRCxRQUFRO1lBQ1IsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLEVBQUUsQ0FBQztZQUN0QixNQUFNLEtBQUssR0FBRyxJQUFJLFdBQUssQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDeEMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsOENBQTJCLEVBQUU7Z0JBQ2pELGtCQUFrQixFQUFFO29CQUNsQiwwREFBMEQsRUFBRSxxQkFBcUI7aUJBQ2xGO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxZQUFZLEdBQUcsSUFBSSxpQkFBVyxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7Z0JBQzFELElBQUksRUFBRSxtQkFBbUI7Z0JBQ3pCLFVBQVUsRUFBRSxFQUFFO2FBQ2YsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLE1BQU0sRUFBRSxHQUFHLDRCQUFzQixDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSx1QkFBdUIsRUFBRTtnQkFDcEYsYUFBYSxFQUFFLFlBQVk7Z0JBQzNCLE9BQU8sRUFBRSxtQ0FBNkIsQ0FBQyxXQUFXO2FBQ25ELENBQUMsQ0FBQztZQUNILEVBQUUsQ0FBQyxlQUFlLENBQUM7Z0JBQ2pC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QUNQLE1BQU0sRUFBRSxHQUFHLDRCQUFzQixDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSx1QkFBdUIsRUFBRTtZQUNwRixhQUFhLEVBQUUsWUFBWTtZQUMzQixPQUFPLEVBQUUsbUNBQTZCLENBQUMsV0FBVztTQUNuRCxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ3hDLFlBQVksRUFBRTtnQkFDWix3REFBd0Q7Z0JBQ3hELEtBQUs7YUFDTjtTQUNGLENBQUMsQ0FBQztJQUVMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IEFwcCwgQXNzZXRTdGFnaW5nLCBDdXN0b21SZXNvdXJjZVByb3ZpZGVyLCBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZSwgRG9ja2VySW1hZ2VBc3NldExvY2F0aW9uLCBEb2NrZXJJbWFnZUFzc2V0U291cmNlLCBEdXJhdGlvbiwgRmlsZUFzc2V0TG9jYXRpb24sIEZpbGVBc3NldFNvdXJjZSwgSVN5bnRoZXNpc1Nlc3Npb24sIFNpemUsIFN0YWNrLCBDZm5SZXNvdXJjZSB9IGZyb20gJy4uLy4uL2xpYic7XG5pbXBvcnQgeyBDVVNUT01JWkVfUk9MRVNfQ09OVEVYVF9LRVkgfSBmcm9tICcuLi8uLi9saWIvaGVscGVycy1pbnRlcm5hbCc7XG5pbXBvcnQgeyB0b0Nsb3VkRm9ybWF0aW9uIH0gZnJvbSAnLi4vdXRpbCc7XG5cbmNvbnN0IFRFU1RfSEFORExFUiA9IGAke19fZGlybmFtZX0vbW9jay1wcm92aWRlcmA7XG5cbmRlc2NyaWJlKCdjdXN0b20gcmVzb3VyY2UgcHJvdmlkZXInLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdjdXN0b21pemUgcm9sZXMnLCAoKSA9PiB7XG4gICAgdGVzdCgncm9sZSBpcyBub3QgY3JlYXRlZCBpZiBwcmV2ZW50U3ludGhlc2lzIT1mYWxzZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdNeVN0YWNrJyk7XG4gICAgICBzdGFjay5ub2RlLnNldENvbnRleHQoQ1VTVE9NSVpFX1JPTEVTX0NPTlRFWFRfS0VZLCB7XG4gICAgICAgIHVzZVByZWNyZWF0ZWRSb2xlczoge1xuICAgICAgICAgICdNeVN0YWNrL0N1c3RvbTpNeVJlc291cmNlVHlwZUN1c3RvbVJlc291cmNlUHJvdmlkZXIvUm9sZSc6ICdteS1jdXN0b20tcm9sZS1uYW1lJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgc29tZVJlc291cmNlID0gbmV3IENmblJlc291cmNlKHN0YWNrLCAnU29tZVJlc291cmNlJywge1xuICAgICAgICB0eXBlOiAnQVdTOjpTb21lUmVzb3VyY2UnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7fSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBjciA9IEN1c3RvbVJlc291cmNlUHJvdmlkZXIuZ2V0T3JDcmVhdGVQcm92aWRlcihzdGFjaywgJ0N1c3RvbTpNeVJlc291cmNlVHlwZScsIHtcbiAgICAgICAgY29kZURpcmVjdG9yeTogVEVTVF9IQU5ETEVSLFxuICAgICAgICBydW50aW1lOiBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIH0pO1xuICAgICAgY3IuYWRkVG9Sb2xlUG9saWN5KHtcbiAgICAgICAgQWN0aW9uOiAnczM6R2V0QnVja2V0JyxcbiAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICBSZXNvdXJjZTogc29tZVJlc291cmNlLnJlZixcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZSgnTXlTdGFjaycpLnRlbXBsYXRlO1xuICAgICAgY29uc3QgcmVzb3VyY2VUeXBlcyA9IE9iamVjdC52YWx1ZXModGVtcGxhdGUuUmVzb3VyY2VzKS5mbGF0TWFwKCh2YWx1ZTogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5UeXBlO1xuICAgICAgfSk7XG4gICAgICAvLyByb2xlIGlzIG5vdCBjcmVhdGVkXG4gICAgICBleHBlY3QocmVzb3VyY2VUeXBlcykubm90LnRvQ29udGFpbignQVdTOjpJQU06OlJvbGUnKTtcbiAgICAgIC8vIGxhbWJkYSBmdW5jdGlvbiByZWZlcmVuY2VzIHByZWNyZWF0ZWQgcm9sZVxuICAgICAgZXhwZWN0KHRlbXBsYXRlLlJlc291cmNlcy5DdXN0b21NeVJlc291cmNlVHlwZUN1c3RvbVJlc291cmNlUHJvdmlkZXJIYW5kbGVyMjlGQkREMkEuUHJvcGVydGllcy5Sb2xlKS50b0VxdWFsKHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICc6aWFtOjonLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJzpyb2xlL215LWN1c3RvbS1yb2xlLW5hbWUnLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgLy8gcmVwb3J0IGlzIGdlbmVyYXRlZCBjb3JyZWN0bHlcbiAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKGFzc2VtYmx5LmRpcmVjdG9yeSwgJ2lhbS1wb2xpY3ktcmVwb3J0Lmpzb24nKTtcbiAgICAgIGNvbnN0IGZpbGUgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSk7XG4gICAgICBleHBlY3QoSlNPTi5wYXJzZShmaWxlKSkudG9FcXVhbCh7XG4gICAgICAgIHJvbGVzOiBbe1xuICAgICAgICAgIHJvbGVDb25zdHJ1Y3RQYXRoOiAnTXlTdGFjay9DdXN0b206TXlSZXNvdXJjZVR5cGVDdXN0b21SZXNvdXJjZVByb3ZpZGVyL1JvbGUnLFxuICAgICAgICAgIHJvbGVOYW1lOiAnbXktY3VzdG9tLXJvbGUtbmFtZScsXG4gICAgICAgICAgbWlzc2luZzogZmFsc2UsXG4gICAgICAgICAgYXNzdW1lUm9sZVBvbGljeTogW3tcbiAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgICBTZXJ2aWNlOiAnbGFtYmRhLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XSxcbiAgICAgICAgICBtYW5hZ2VkUG9saWN5QXJuczogW1xuICAgICAgICAgICAgJ2Fybjoke0FXUzo6UGFydGl0aW9ufTppYW06OmF3czpwb2xpY3kvc2VydmljZS1yb2xlL0FXU0xhbWJkYUJhc2ljRXhlY3V0aW9uUm9sZScsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBtYW5hZ2VkUG9saWN5U3RhdGVtZW50czogW10sXG4gICAgICAgICAgaWRlbnRpdHlQb2xpY3lTdGF0ZW1lbnRzOiBbe1xuICAgICAgICAgICAgQWN0aW9uOiAnczM6R2V0QnVja2V0JyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiAnKE15U3RhY2svU29tZVJlc291cmNlLlJlZiknLFxuICAgICAgICAgIH1dLFxuICAgICAgICB9XSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncm9sZSBpcyBjcmVhdGVkIGlmIHByZXZlbnRTeW50aGVzaXM9ZmFsc2UnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnTXlTdGFjaycpO1xuICAgICAgc3RhY2subm9kZS5zZXRDb250ZXh0KENVU1RPTUlaRV9ST0xFU19DT05URVhUX0tFWSwge1xuICAgICAgICBwcmV2ZW50U3ludGhlc2lzOiBmYWxzZSxcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgc29tZVJlc291cmNlID0gbmV3IENmblJlc291cmNlKHN0YWNrLCAnU29tZVJlc291cmNlJywge1xuICAgICAgICB0eXBlOiAnQVdTOjpTb21lUmVzb3VyY2UnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7fSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBjciA9IEN1c3RvbVJlc291cmNlUHJvdmlkZXIuZ2V0T3JDcmVhdGVQcm92aWRlcihzdGFjaywgJ0N1c3RvbTpNeVJlc291cmNlVHlwZScsIHtcbiAgICAgICAgY29kZURpcmVjdG9yeTogVEVTVF9IQU5ETEVSLFxuICAgICAgICBydW50aW1lOiBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIH0pO1xuICAgICAgY3IuYWRkVG9Sb2xlUG9saWN5KHtcbiAgICAgICAgQWN0aW9uOiAnczM6R2V0QnVja2V0JyxcbiAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICBSZXNvdXJjZTogc29tZVJlc291cmNlLnJlZixcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZSgnTXlTdGFjaycpLnRlbXBsYXRlO1xuICAgICAgY29uc3QgcmVzb3VyY2VUeXBlcyA9IE9iamVjdC52YWx1ZXModGVtcGxhdGUuUmVzb3VyY2VzKS5mbGF0TWFwKCh2YWx1ZTogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5UeXBlO1xuICAgICAgfSk7XG4gICAgICAvLyBJQU0gcm9sZSBfaXNfIGNyZWF0ZWRcbiAgICAgIGV4cGVjdChyZXNvdXJjZVR5cGVzKS50b0NvbnRhaW4oJ0FXUzo6SUFNOjpSb2xlJyk7XG4gICAgICAvLyBsYW1iZGEgZnVuY3Rpb24gcmVmZXJlbmNlcyB0aGUgY3JlYXRlZCByb2xlXG4gICAgICBleHBlY3QodGVtcGxhdGUuUmVzb3VyY2VzLkN1c3RvbU15UmVzb3VyY2VUeXBlQ3VzdG9tUmVzb3VyY2VQcm92aWRlckhhbmRsZXIyOUZCREQyQS5Qcm9wZXJ0aWVzLlJvbGUpLnRvRXF1YWwoe1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnQ3VzdG9tTXlSZXNvdXJjZVR5cGVDdXN0b21SZXNvdXJjZVByb3ZpZGVyUm9sZUJENUU2NTVGJyxcbiAgICAgICAgICAnQXJuJyxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyByZXBvcnQgaXMgc3RpbGwgZ2VuZXJhdGVkXG4gICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihhc3NlbWJseS5kaXJlY3RvcnksICdpYW0tcG9saWN5LXJlcG9ydC5qc29uJyk7XG4gICAgICBjb25zdCBmaWxlID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pO1xuICAgICAgZXhwZWN0KEpTT04ucGFyc2UoZmlsZSkpLnRvRXF1YWwoe1xuICAgICAgICByb2xlczogW3tcbiAgICAgICAgICByb2xlQ29uc3RydWN0UGF0aDogJ015U3RhY2svQ3VzdG9tOk15UmVzb3VyY2VUeXBlQ3VzdG9tUmVzb3VyY2VQcm92aWRlci9Sb2xlJyxcbiAgICAgICAgICByb2xlTmFtZTogJ21pc3Npbmcgcm9sZScsXG4gICAgICAgICAgbWlzc2luZzogdHJ1ZSxcbiAgICAgICAgICBhc3N1bWVSb2xlUG9saWN5OiBbe1xuICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICAgIFNlcnZpY2U6ICdsYW1iZGEuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1dLFxuICAgICAgICAgIG1hbmFnZWRQb2xpY3lBcm5zOiBbXG4gICAgICAgICAgICAnYXJuOiR7QVdTOjpQYXJ0aXRpb259OmlhbTo6YXdzOnBvbGljeS9zZXJ2aWNlLXJvbGUvQVdTTGFtYmRhQmFzaWNFeGVjdXRpb25Sb2xlJyxcbiAgICAgICAgICBdLFxuICAgICAgICAgIG1hbmFnZWRQb2xpY3lTdGF0ZW1lbnRzOiBbXSxcbiAgICAgICAgICBpZGVudGl0eVBvbGljeVN0YXRlbWVudHM6IFt7XG4gICAgICAgICAgICBBY3Rpb246ICdzMzpHZXRCdWNrZXQnLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6ICcoTXlTdGFjay9Tb21lUmVzb3VyY2UuUmVmKScsXG4gICAgICAgICAgfV0sXG4gICAgICAgIH1dLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ21pbmltYWwgY29uZmlndXJhdGlvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoeyBjb250ZXh0OiB7IFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSB9IH0pO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCk7XG5cbiAgICAvLyBXSEVOXG4gICAgQ3VzdG9tUmVzb3VyY2VQcm92aWRlci5nZXRPckNyZWF0ZShzdGFjaywgJ0N1c3RvbTpNeVJlc291cmNlVHlwZScsIHtcbiAgICAgIGNvZGVEaXJlY3Rvcnk6IFRFU1RfSEFORExFUixcbiAgICAgIHJ1bnRpbWU6IEN1c3RvbVJlc291cmNlUHJvdmlkZXJSdW50aW1lLk5PREVKU18xNF9YLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGNmbiA9IHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spO1xuXG4gICAgLy8gVGhlIGFzc2V0IGhhc2ggY29uc3RhbnRseSBjaGFuZ2VzLCBzbyBpbiBvcmRlciB0byBub3QgaGF2ZSB0byBjaGFzZSBpdCwganVzdCBsb29rXG4gICAgLy8gaXQgdXAgZnJvbSB0aGUgb3V0cHV0LlxuICAgIGNvbnN0IHN0YWdpbmcgPSBzdGFjay5ub2RlLnRyeUZpbmRDaGlsZCgnQ3VzdG9tOk15UmVzb3VyY2VUeXBlQ3VzdG9tUmVzb3VyY2VQcm92aWRlcicpPy5ub2RlLnRyeUZpbmRDaGlsZCgnU3RhZ2luZycpIGFzIEFzc2V0U3RhZ2luZztcbiAgICBjb25zdCBhc3NldEhhc2ggPSBzdGFnaW5nLmFzc2V0SGFzaDtcbiAgICBjb25zdCBzb3VyY2VQYXRoID0gc3RhZ2luZy5zb3VyY2VQYXRoO1xuICAgIGNvbnN0IHBhcmFtTmFtZXMgPSBPYmplY3Qua2V5cyhjZm4uUGFyYW1ldGVycyk7XG4gICAgY29uc3QgYnVja2V0UGFyYW0gPSBwYXJhbU5hbWVzWzBdO1xuICAgIGNvbnN0IGtleVBhcmFtID0gcGFyYW1OYW1lc1sxXTtcbiAgICBjb25zdCBoYXNoUGFyYW0gPSBwYXJhbU5hbWVzWzJdO1xuXG4gICAgZXhwZWN0KGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHNvdXJjZVBhdGgsICdfX2VudHJ5cG9pbnRfXy5qcycpKSkudG9FcXVhbCh0cnVlKTtcblxuICAgIGV4cGVjdChjZm4pLnRvRXF1YWwoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIEN1c3RvbU15UmVzb3VyY2VUeXBlQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJvbGVCRDVFNjU1Rjoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OklBTTo6Um9sZScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICAgICAgICAgIFNlcnZpY2U6ICdsYW1iZGEuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgTWFuYWdlZFBvbGljeUFybnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdGbjo6U3ViJzogJ2Fybjoke0FXUzo6UGFydGl0aW9ufTppYW06OmF3czpwb2xpY3kvc2VydmljZS1yb2xlL0FXU0xhbWJkYUJhc2ljRXhlY3V0aW9uUm9sZScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIEN1c3RvbU15UmVzb3VyY2VUeXBlQ3VzdG9tUmVzb3VyY2VQcm92aWRlckhhbmRsZXIyOUZCREQyQToge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIENvZGU6IHtcbiAgICAgICAgICAgICAgUzNCdWNrZXQ6IHsgUmVmOiBidWNrZXRQYXJhbSB9LFxuICAgICAgICAgICAgICBTM0tleToge1xuICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd8fCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBSZWY6IGtleVBhcmFtIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3x8JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IFJlZjoga2V5UGFyYW0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBUaW1lb3V0OiA5MDAsXG4gICAgICAgICAgICBNZW1vcnlTaXplOiAxMjgsXG4gICAgICAgICAgICBIYW5kbGVyOiAnX19lbnRyeXBvaW50X18uaGFuZGxlcicsXG4gICAgICAgICAgICBSb2xlOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdDdXN0b21NeVJlc291cmNlVHlwZUN1c3RvbVJlc291cmNlUHJvdmlkZXJSb2xlQkQ1RTY1NUYnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFJ1bnRpbWU6ICdub2RlanMxNC54JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIERlcGVuZHNPbjogW1xuICAgICAgICAgICAgJ0N1c3RvbU15UmVzb3VyY2VUeXBlQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJvbGVCRDVFNjU1RicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBQYXJhbWV0ZXJzOiB7XG4gICAgICAgIFtidWNrZXRQYXJhbV06IHtcbiAgICAgICAgICBUeXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBEZXNjcmlwdGlvbjogYFMzIGJ1Y2tldCBmb3IgYXNzZXQgXCIke2Fzc2V0SGFzaH1cImAsXG4gICAgICAgIH0sXG4gICAgICAgIFtrZXlQYXJhbV06IHtcbiAgICAgICAgICBUeXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBEZXNjcmlwdGlvbjogYFMzIGtleSBmb3IgYXNzZXQgdmVyc2lvbiBcIiR7YXNzZXRIYXNofVwiYCxcbiAgICAgICAgfSxcbiAgICAgICAgW2hhc2hQYXJhbV06IHtcbiAgICAgICAgICBUeXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBEZXNjcmlwdGlvbjogYEFydGlmYWN0IGhhc2ggZm9yIGFzc2V0IFwiJHthc3NldEhhc2h9XCJgLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICB9KTtcblxuICB0ZXN0KCdhc3NldCBtZXRhZGF0YSBhZGRlZCB0byBjdXN0b20gcmVzb3VyY2UgdGhhdCBjb250YWlucyBjb2RlIGRlZmluaXRpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIHN0YWNrLm5vZGUuc2V0Q29udGV4dChjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9FTkFCTEVEX0NPTlRFWFQsIHRydWUpO1xuICAgIHN0YWNrLm5vZGUuc2V0Q29udGV4dChjeGFwaS5ESVNBQkxFX0FTU0VUX1NUQUdJTkdfQ09OVEVYVCwgdHJ1ZSk7XG5cbiAgICAvLyBXSEVOXG4gICAgQ3VzdG9tUmVzb3VyY2VQcm92aWRlci5nZXRPckNyZWF0ZShzdGFjaywgJ0N1c3RvbTpNeVJlc291cmNlVHlwZScsIHtcbiAgICAgIGNvZGVEaXJlY3Rvcnk6IFRFU1RfSEFORExFUixcbiAgICAgIHJ1bnRpbWU6IEN1c3RvbVJlc291cmNlUHJvdmlkZXJSdW50aW1lLk5PREVKU18xNF9YLFxuICAgIH0pO1xuXG4gICAgLy8gVGhlblxuICAgIGNvbnN0IGxhbWJkYSA9IHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spLlJlc291cmNlcy5DdXN0b21NeVJlc291cmNlVHlwZUN1c3RvbVJlc291cmNlUHJvdmlkZXJIYW5kbGVyMjlGQkREMkE7XG4gICAgZXhwZWN0KGxhbWJkYSkudG9IYXZlUHJvcGVydHkoJ01ldGFkYXRhJyk7XG5cbiAgICBleHBlY3QobGFtYmRhLk1ldGFkYXRhKS50b01hdGNoT2JqZWN0KHtcbiAgICAgICdhd3M6YXNzZXQ6cHJvcGVydHknOiAnQ29kZScsXG5cbiAgICAgIC8vIFRoZSBhc3NldCBwYXRoIHNob3VsZCBiZSBhIHRlbXBvcmFyeSBmb2xkZXIgcHJlZml4ZWQgd2l0aCAnY2RrLWN1c3RvbS1yZXNvdXJjZSdcbiAgICAgICdhd3M6YXNzZXQ6cGF0aCc6IGV4cGVjdC5zdHJpbmdNYXRjaGluZygvXi4qXFwvY2RrLWN1c3RvbS1yZXNvdXJjZVxcd3s2fVxcLz8kLyksXG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnY3VzdG9tIHJlc291cmNlIHByb3ZpZGVkIGNyZWF0ZXMgYXNzZXQgaW4gbmV3LXN0eWxlIHN5bnRoZXNpcyB3aXRoIHJlbGF0aXZlIHBhdGgnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cblxuICAgIGxldCBhc3NldEZpbGVuYW1lIDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrJywge1xuICAgICAgc3ludGhlc2l6ZXI6IHtcbiAgICAgICAgYmluZChfc3RhY2s6IFN0YWNrKTogdm9pZCB7IH0sXG5cbiAgICAgICAgYWRkRmlsZUFzc2V0KGFzc2V0OiBGaWxlQXNzZXRTb3VyY2UpOiBGaWxlQXNzZXRMb2NhdGlvbiB7XG4gICAgICAgICAgYXNzZXRGaWxlbmFtZSA9IGFzc2V0LmZpbGVOYW1lO1xuICAgICAgICAgIHJldHVybiB7IGJ1Y2tldE5hbWU6ICcnLCBodHRwVXJsOiAnJywgb2JqZWN0S2V5OiAnJywgczNPYmplY3RVcmw6ICcnLCBzM1VybDogJycsIGttc0tleUFybjogJycgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBhZGREb2NrZXJJbWFnZUFzc2V0KF9hc3NldDogRG9ja2VySW1hZ2VBc3NldFNvdXJjZSk6IERvY2tlckltYWdlQXNzZXRMb2NhdGlvbiB7XG4gICAgICAgICAgcmV0dXJuIHsgaW1hZ2VVcmk6ICcnLCByZXBvc2l0b3J5TmFtZTogJycgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBzeW50aGVzaXplKF9zZXNzaW9uOiBJU3ludGhlc2lzU2Vzc2lvbik6IHZvaWQgeyB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBDdXN0b21SZXNvdXJjZVByb3ZpZGVyLmdldE9yQ3JlYXRlKHN0YWNrLCAnQ3VzdG9tOk15UmVzb3VyY2VUeXBlJywge1xuICAgICAgY29kZURpcmVjdG9yeTogVEVTVF9IQU5ETEVSLFxuICAgICAgcnVudGltZTogQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOIC0tIG5vIGV4Y2VwdGlvblxuICAgIGlmICghYXNzZXRGaWxlbmFtZSB8fCBhc3NldEZpbGVuYW1lLnN0YXJ0c1dpdGgocGF0aC5zZXApKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFzc2V0IGZpbGVuYW1lIG11c3QgYmUgYSByZWxhdGl2ZSBwYXRoLCBnb3Q6ICR7YXNzZXRGaWxlbmFtZX1gKTtcbiAgICB9XG5cblxuICB9KTtcblxuICB0ZXN0KCdwb2xpY3lTdGF0ZW1lbnRzIGNhbiBiZSB1c2VkIHRvIGFkZCBzdGF0ZW1lbnRzIHRvIHRoZSBpbmxpbmUgcG9saWN5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBDdXN0b21SZXNvdXJjZVByb3ZpZGVyLmdldE9yQ3JlYXRlKHN0YWNrLCAnQ3VzdG9tOk15UmVzb3VyY2VUeXBlJywge1xuICAgICAgY29kZURpcmVjdG9yeTogVEVTVF9IQU5ETEVSLFxuICAgICAgcnVudGltZTogQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBwb2xpY3lTdGF0ZW1lbnRzOiBbXG4gICAgICAgIHsgc3RhdGVtZW50MTogMTIzIH0sXG4gICAgICAgIHsgc3RhdGVtZW50MjogeyBmb286IDExMSB9IH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IHRlbXBsYXRlID0gdG9DbG91ZEZvcm1hdGlvbihzdGFjayk7XG4gICAgY29uc3Qgcm9sZSA9IHRlbXBsYXRlLlJlc291cmNlcy5DdXN0b21NeVJlc291cmNlVHlwZUN1c3RvbVJlc291cmNlUHJvdmlkZXJSb2xlQkQ1RTY1NUY7XG4gICAgZXhwZWN0KHJvbGUuUHJvcGVydGllcy5Qb2xpY2llcykudG9FcXVhbChbe1xuICAgICAgUG9saWN5TmFtZTogJ0lubGluZScsXG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIFN0YXRlbWVudDogW3sgc3RhdGVtZW50MTogMTIzIH0sIHsgc3RhdGVtZW50MjogeyBmb286IDExMSB9IH1dLFxuICAgICAgfSxcbiAgICB9XSk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnYWRkVG9Sb2xlUG9saWN5KCkgY2FuIGJlIHVzZWQgdG8gYWRkIHN0YXRlbWVudHMgdG8gdGhlIGlubGluZSBwb2xpY3knLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHByb3ZpZGVyID0gQ3VzdG9tUmVzb3VyY2VQcm92aWRlci5nZXRPckNyZWF0ZVByb3ZpZGVyKHN0YWNrLCAnQ3VzdG9tOk15UmVzb3VyY2VUeXBlJywge1xuICAgICAgY29kZURpcmVjdG9yeTogVEVTVF9IQU5ETEVSLFxuICAgICAgcnVudGltZTogQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBwb2xpY3lTdGF0ZW1lbnRzOiBbXG4gICAgICAgIHsgc3RhdGVtZW50MTogMTIzIH0sXG4gICAgICAgIHsgc3RhdGVtZW50MjogeyBmb286IDExMSB9IH0sXG4gICAgICBdLFxuICAgIH0pO1xuICAgIHByb3ZpZGVyLmFkZFRvUm9sZVBvbGljeSh7IHN0YXRlbWVudDM6IDQ1NiB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spO1xuICAgIGNvbnN0IHJvbGUgPSB0ZW1wbGF0ZS5SZXNvdXJjZXMuQ3VzdG9tTXlSZXNvdXJjZVR5cGVDdXN0b21SZXNvdXJjZVByb3ZpZGVyUm9sZUJENUU2NTVGO1xuICAgIGV4cGVjdChyb2xlLlByb3BlcnRpZXMuUG9saWNpZXMpLnRvRXF1YWwoW3tcbiAgICAgIFBvbGljeU5hbWU6ICdJbmxpbmUnLFxuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICBTdGF0ZW1lbnQ6IFt7IHN0YXRlbWVudDE6IDEyMyB9LCB7IHN0YXRlbWVudDI6IHsgZm9vOiAxMTEgfSB9LCB7IHN0YXRlbWVudDM6IDQ1NiB9XSxcbiAgICAgIH0sXG4gICAgfV0pO1xuICB9KTtcblxuICB0ZXN0KCdtZW1vcnlTaXplLCB0aW1lb3V0IGFuZCBkZXNjcmlwdGlvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgQ3VzdG9tUmVzb3VyY2VQcm92aWRlci5nZXRPckNyZWF0ZShzdGFjaywgJ0N1c3RvbTpNeVJlc291cmNlVHlwZScsIHtcbiAgICAgIGNvZGVEaXJlY3Rvcnk6IFRFU1RfSEFORExFUixcbiAgICAgIHJ1bnRpbWU6IEN1c3RvbVJlc291cmNlUHJvdmlkZXJSdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgbWVtb3J5U2l6ZTogU2l6ZS5naWJpYnl0ZXMoMiksXG4gICAgICB0aW1lb3V0OiBEdXJhdGlvbi5taW51dGVzKDUpLFxuICAgICAgZGVzY3JpcHRpb246ICd2ZW5pIHZpZGkgdmljaScsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgdGVtcGxhdGUgPSB0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKTtcbiAgICBjb25zdCBsYW1iZGEgPSB0ZW1wbGF0ZS5SZXNvdXJjZXMuQ3VzdG9tTXlSZXNvdXJjZVR5cGVDdXN0b21SZXNvdXJjZVByb3ZpZGVySGFuZGxlcjI5RkJERDJBO1xuICAgIGV4cGVjdChsYW1iZGEuUHJvcGVydGllcy5NZW1vcnlTaXplKS50b0VxdWFsKDIwNDgpO1xuICAgIGV4cGVjdChsYW1iZGEuUHJvcGVydGllcy5UaW1lb3V0KS50b0VxdWFsKDMwMCk7XG4gICAgZXhwZWN0KGxhbWJkYS5Qcm9wZXJ0aWVzLkRlc2NyaXB0aW9uKS50b0VxdWFsKCd2ZW5pIHZpZGkgdmljaScpO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ2Vudmlyb25tZW50IHZhcmlhYmxlcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgQ3VzdG9tUmVzb3VyY2VQcm92aWRlci5nZXRPckNyZWF0ZShzdGFjaywgJ0N1c3RvbTpNeVJlc291cmNlVHlwZScsIHtcbiAgICAgIGNvZGVEaXJlY3Rvcnk6IFRFU1RfSEFORExFUixcbiAgICAgIHJ1bnRpbWU6IEN1c3RvbVJlc291cmNlUHJvdmlkZXJSdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgQjogJ2InLFxuICAgICAgICBBOiAnYScsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IHRlbXBsYXRlID0gdG9DbG91ZEZvcm1hdGlvbihzdGFjayk7XG4gICAgY29uc3QgbGFtYmRhID0gdGVtcGxhdGUuUmVzb3VyY2VzLkN1c3RvbU15UmVzb3VyY2VUeXBlQ3VzdG9tUmVzb3VyY2VQcm92aWRlckhhbmRsZXIyOUZCREQyQTtcbiAgICBleHBlY3QobGFtYmRhLlByb3BlcnRpZXMuRW52aXJvbm1lbnQpLnRvRXF1YWwoe1xuICAgICAgVmFyaWFibGVzOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgIEE6ICdhJyxcbiAgICAgICAgQjogJ2InLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgdGVzdCgncm9sZUFybicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY3IgPSBDdXN0b21SZXNvdXJjZVByb3ZpZGVyLmdldE9yQ3JlYXRlUHJvdmlkZXIoc3RhY2ssICdDdXN0b206TXlSZXNvdXJjZVR5cGUnLCB7XG4gICAgICBjb2RlRGlyZWN0b3J5OiBURVNUX0hBTkRMRVIsXG4gICAgICBydW50aW1lOiBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShjci5yb2xlQXJuKSkudG9FcXVhbCh7XG4gICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgJ0N1c3RvbU15UmVzb3VyY2VUeXBlQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJvbGVCRDVFNjU1RicsXG4gICAgICAgICdBcm4nLFxuICAgICAgXSxcbiAgICB9KTtcblxuICB9KTtcbn0pO1xuXG4iXX0=