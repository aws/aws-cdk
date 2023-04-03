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
        const cfn = util_1.toCloudFormation(stack);
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
        const lambda = util_1.toCloudFormation(stack).Resources.CustomMyResourceTypeCustomResourceProviderHandler29FBDD2A;
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
        const template = util_1.toCloudFormation(stack);
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
        const template = util_1.toCloudFormation(stack);
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
        const template = util_1.toCloudFormation(stack);
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
        const template = util_1.toCloudFormation(stack);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tLXJlc291cmNlLXByb3ZpZGVyLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjdXN0b20tcmVzb3VyY2UtcHJvdmlkZXIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFDN0IseUNBQXlDO0FBQ3pDLG1DQUFrUDtBQUNsUCxpRUFBeUU7QUFDekUsa0NBQTJDO0FBRTNDLE1BQU0sWUFBWSxHQUFHLEdBQUcsU0FBUyxnQkFBZ0IsQ0FBQztBQUVsRCxRQUFRLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7UUFDL0IsSUFBSSxDQUFDLGdEQUFnRCxFQUFFLEdBQUcsRUFBRTtZQUMxRCxRQUFRO1lBQ1IsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLEVBQUUsQ0FBQztZQUN0QixNQUFNLEtBQUssR0FBRyxJQUFJLFdBQUssQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDeEMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsOENBQTJCLEVBQUU7Z0JBQ2pELGtCQUFrQixFQUFFO29CQUNsQiwwREFBMEQsRUFBRSxxQkFBcUI7aUJBQ2xGO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxZQUFZLEdBQUcsSUFBSSxpQkFBVyxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7Z0JBQzFELElBQUksRUFBRSxtQkFBbUI7Z0JBQ3pCLFVBQVUsRUFBRSxFQUFFO2FBQ2YsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLE1BQU0sRUFBRSxHQUFHLDRCQUFzQixDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSx1QkFBdUIsRUFBRTtnQkFDcEYsYUFBYSxFQUFFLFlBQVk7Z0JBQzNCLE9BQU8sRUFBRSxtQ0FBNkIsQ0FBQyxXQUFXO2FBQ25ELENBQUMsQ0FBQztZQUNILEVBQUUsQ0FBQyxlQUFlLENBQUM7Z0JBQ2pCLE1BQU0sRUFBRSxjQUFjO2dCQUN0QixNQUFNLEVBQUUsT0FBTztnQkFDZixRQUFRLEVBQUUsWUFBWSxDQUFDLEdBQUc7YUFDM0IsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM3QixNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztZQUM3RCxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFVLEVBQUUsRUFBRTtnQkFDN0UsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQ3BCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsc0JBQXNCO1lBQ3RCLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDdEQsNkNBQTZDO1lBQzdDLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLHlEQUF5RCxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQzNHLFVBQVUsRUFBRTtvQkFDVixFQUFFO29CQUNGO3dCQUNFLE1BQU07d0JBQ047NEJBQ0UsR0FBRyxFQUFFLGdCQUFnQjt5QkFDdEI7d0JBQ0QsUUFBUTt3QkFDUjs0QkFDRSxHQUFHLEVBQUUsZ0JBQWdCO3lCQUN0Qjt3QkFDRCwyQkFBMkI7cUJBQzVCO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsZ0NBQWdDO1lBQ2hDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO1lBQ3pFLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDOUQsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQy9CLEtBQUssRUFBRSxDQUFDO3dCQUNOLGlCQUFpQixFQUFFLDBEQUEwRDt3QkFDN0UsUUFBUSxFQUFFLHFCQUFxQjt3QkFDL0IsT0FBTyxFQUFFLEtBQUs7d0JBQ2QsZ0JBQWdCLEVBQUUsQ0FBQztnQ0FDakIsTUFBTSxFQUFFLGdCQUFnQjtnQ0FDeEIsTUFBTSxFQUFFLE9BQU87Z0NBQ2YsU0FBUyxFQUFFO29DQUNULE9BQU8sRUFBRSxzQkFBc0I7aUNBQ2hDOzZCQUNGLENBQUM7d0JBQ0YsaUJBQWlCLEVBQUU7NEJBQ2pCLGdGQUFnRjt5QkFDakY7d0JBQ0QsdUJBQXVCLEVBQUUsRUFBRTt3QkFDM0Isd0JBQXdCLEVBQUUsQ0FBQztnQ0FDekIsTUFBTSxFQUFFLGNBQWM7Z0NBQ3RCLE1BQU0sRUFBRSxPQUFPO2dDQUNmLFFBQVEsRUFBRSw0QkFBNEI7NkJBQ3ZDLENBQUM7cUJBQ0gsQ0FBQzthQUNILENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDJDQUEyQyxFQUFFLEdBQUcsRUFBRTtZQUNyRCxRQUFRO1lBQ1IsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLEVBQUUsQ0FBQztZQUN0QixNQUFNLEtBQUssR0FBRyxJQUFJLFdBQUssQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDeEMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsOENBQTJCLEVBQUU7Z0JBQ2pELGdCQUFnQixFQUFFLEtBQUs7YUFDeEIsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxZQUFZLEdBQUcsSUFBSSxpQkFBVyxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7Z0JBQzFELElBQUksRUFBRSxtQkFBbUI7Z0JBQ3pCLFVBQVUsRUFBRSxFQUFFO2FBQ2YsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLE1BQU0sRUFBRSxHQUFHLDRCQUFzQixDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSx1QkFBdUIsRUFBRTtnQkFDcEYsYUFBYSxFQUFFLFlBQVk7Z0JBQzNCLE9BQU8sRUFBRSxtQ0FBNkIsQ0FBQyxXQUFXO2FBQ25ELENBQUMsQ0FBQztZQUNILEVBQUUsQ0FBQyxlQUFlLENBQUM7Z0JBQ2pCLE1BQU0sRUFBRSxjQUFjO2dCQUN0QixNQUFNLEVBQUUsT0FBTztnQkFDZixRQUFRLEVBQUUsWUFBWSxDQUFDLEdBQUc7YUFDM0IsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM3QixNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztZQUM3RCxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFVLEVBQUUsRUFBRTtnQkFDN0UsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQ3BCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsd0JBQXdCO1lBQ3hCLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUNsRCw4Q0FBOEM7WUFDOUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMseURBQXlELENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDM0csWUFBWSxFQUFFO29CQUNaLHdEQUF3RDtvQkFDeEQsS0FBSztpQkFDTjthQUNGLENBQUMsQ0FBQztZQUVILDRCQUE0QjtZQUM1QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztZQUN6RSxNQUFNLElBQUksR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQzlELE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUMvQixLQUFLLEVBQUUsQ0FBQzt3QkFDTixpQkFBaUIsRUFBRSwwREFBMEQ7d0JBQzdFLFFBQVEsRUFBRSxjQUFjO3dCQUN4QixPQUFPLEVBQUUsSUFBSTt3QkFDYixnQkFBZ0IsRUFBRSxDQUFDO2dDQUNqQixNQUFNLEVBQUUsZ0JBQWdCO2dDQUN4QixNQUFNLEVBQUUsT0FBTztnQ0FDZixTQUFTLEVBQUU7b0NBQ1QsT0FBTyxFQUFFLHNCQUFzQjtpQ0FDaEM7NkJBQ0YsQ0FBQzt3QkFDRixpQkFBaUIsRUFBRTs0QkFDakIsZ0ZBQWdGO3lCQUNqRjt3QkFDRCx1QkFBdUIsRUFBRSxFQUFFO3dCQUMzQix3QkFBd0IsRUFBRSxDQUFDO2dDQUN6QixNQUFNLEVBQUUsY0FBYztnQ0FDdEIsTUFBTSxFQUFFLE9BQU87Z0NBQ2YsUUFBUSxFQUFFLDRCQUE0Qjs2QkFDdkMsQ0FBQztxQkFDSCxDQUFDO2FBQ0gsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLEVBQUU7UUFDakMsUUFBUTtRQUNSLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBRyxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsaUNBQWlDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDdkYsTUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFN0IsT0FBTztRQUNQLDRCQUFzQixDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsdUJBQXVCLEVBQUU7WUFDakUsYUFBYSxFQUFFLFlBQVk7WUFDM0IsT0FBTyxFQUFFLG1DQUE2QixDQUFDLFdBQVc7U0FDbkQsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sR0FBRyxHQUFHLHVCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXBDLG9GQUFvRjtRQUNwRix5QkFBeUI7UUFDekIsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsNkNBQTZDLENBQUMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBaUIsQ0FBQztRQUNySSxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO1FBQ3BDLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7UUFDdEMsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDL0MsTUFBTSxXQUFXLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixNQUFNLFNBQVMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFaEMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWhGLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDbEIsU0FBUyxFQUFFO2dCQUNULHNEQUFzRCxFQUFFO29CQUN0RCxJQUFJLEVBQUUsZ0JBQWdCO29CQUN0QixVQUFVLEVBQUU7d0JBQ1Ysd0JBQXdCLEVBQUU7NEJBQ3hCLE9BQU8sRUFBRSxZQUFZOzRCQUNyQixTQUFTLEVBQUU7Z0NBQ1Q7b0NBQ0UsTUFBTSxFQUFFLGdCQUFnQjtvQ0FDeEIsTUFBTSxFQUFFLE9BQU87b0NBQ2YsU0FBUyxFQUFFO3dDQUNULE9BQU8sRUFBRSxzQkFBc0I7cUNBQ2hDO2lDQUNGOzZCQUNGO3lCQUNGO3dCQUNELGlCQUFpQixFQUFFOzRCQUNqQjtnQ0FDRSxTQUFTLEVBQUUsZ0ZBQWdGOzZCQUM1Rjt5QkFDRjtxQkFDRjtpQkFDRjtnQkFDRCx5REFBeUQsRUFBRTtvQkFDekQsSUFBSSxFQUFFLHVCQUF1QjtvQkFDN0IsVUFBVSxFQUFFO3dCQUNWLElBQUksRUFBRTs0QkFDSixRQUFRLEVBQUUsRUFBRSxHQUFHLEVBQUUsV0FBVyxFQUFFOzRCQUM5QixLQUFLLEVBQUU7Z0NBQ0wsVUFBVSxFQUFFO29DQUNWLEVBQUU7b0NBQ0Y7d0NBQ0U7NENBQ0UsWUFBWSxFQUFFO2dEQUNaLENBQUM7Z0RBQ0Q7b0RBQ0UsV0FBVyxFQUFFO3dEQUNYLElBQUk7d0RBQ0osRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFO3FEQUNsQjtpREFDRjs2Q0FDRjt5Q0FDRjt3Q0FDRDs0Q0FDRSxZQUFZLEVBQUU7Z0RBQ1osQ0FBQztnREFDRDtvREFDRSxXQUFXLEVBQUU7d0RBQ1gsSUFBSTt3REFDSixFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUU7cURBQ2xCO2lEQUNGOzZDQUNGO3lDQUNGO3FDQUNGO2lDQUNGOzZCQUNGO3lCQUNGO3dCQUNELE9BQU8sRUFBRSxHQUFHO3dCQUNaLFVBQVUsRUFBRSxHQUFHO3dCQUNmLE9BQU8sRUFBRSx3QkFBd0I7d0JBQ2pDLElBQUksRUFBRTs0QkFDSixZQUFZLEVBQUU7Z0NBQ1osd0RBQXdEO2dDQUN4RCxLQUFLOzZCQUNOO3lCQUNGO3dCQUNELE9BQU8sRUFBRSxZQUFZO3FCQUN0QjtvQkFDRCxTQUFTLEVBQUU7d0JBQ1Qsd0RBQXdEO3FCQUN6RDtpQkFDRjthQUNGO1lBQ0QsVUFBVSxFQUFFO2dCQUNWLENBQUMsV0FBVyxDQUFDLEVBQUU7b0JBQ2IsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsV0FBVyxFQUFFLHdCQUF3QixTQUFTLEdBQUc7aUJBQ2xEO2dCQUNELENBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQ1YsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsV0FBVyxFQUFFLDZCQUE2QixTQUFTLEdBQUc7aUJBQ3ZEO2dCQUNELENBQUMsU0FBUyxDQUFDLEVBQUU7b0JBQ1gsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsV0FBVyxFQUFFLDRCQUE0QixTQUFTLEdBQUc7aUJBQ3REO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFFTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx1RUFBdUUsRUFBRSxHQUFHLEVBQUU7UUFDakYsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxFQUFFLENBQUM7UUFDMUIsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLHVDQUF1QyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzNFLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVqRSxPQUFPO1FBQ1AsNEJBQXNCLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSx1QkFBdUIsRUFBRTtZQUNqRSxhQUFhLEVBQUUsWUFBWTtZQUMzQixPQUFPLEVBQUUsbUNBQTZCLENBQUMsV0FBVztTQUNuRCxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsTUFBTSxNQUFNLEdBQUcsdUJBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLHlEQUF5RCxDQUFDO1FBQzNHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFMUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxhQUFhLENBQUM7WUFDcEMsb0JBQW9CLEVBQUUsTUFBTTtZQUU1QixrRkFBa0Y7WUFDbEYsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxtQ0FBbUMsQ0FBQztTQUM3RSxDQUFDLENBQUM7SUFFTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxrRkFBa0YsRUFBRSxHQUFHLEVBQUU7UUFDNUYsUUFBUTtRQUVSLElBQUksYUFBa0MsQ0FBQztRQUV2QyxNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQUcsRUFBRSxDQUFDO1FBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUU7WUFDcEMsV0FBVyxFQUFFO2dCQUNYLElBQUksQ0FBQyxNQUFhLEtBQVc7Z0JBRTdCLFlBQVksQ0FBQyxLQUFzQjtvQkFDakMsYUFBYSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7b0JBQy9CLE9BQU8sRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxDQUFDO2lCQUNsRztnQkFFRCxtQkFBbUIsQ0FBQyxNQUE4QjtvQkFDaEQsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsY0FBYyxFQUFFLEVBQUUsRUFBRSxDQUFDO2lCQUM3QztnQkFFRCxVQUFVLENBQUMsUUFBMkIsS0FBVzthQUNsRDtTQUNGLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCw0QkFBc0IsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLHVCQUF1QixFQUFFO1lBQ2pFLGFBQWEsRUFBRSxZQUFZO1lBQzNCLE9BQU8sRUFBRSxtQ0FBNkIsQ0FBQyxXQUFXO1NBQ25ELENBQUMsQ0FBQztRQUVILHVCQUF1QjtRQUN2QixJQUFJLENBQUMsYUFBYSxJQUFJLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3hELE1BQU0sSUFBSSxLQUFLLENBQUMsZ0RBQWdELGFBQWEsRUFBRSxDQUFDLENBQUM7U0FDbEY7SUFHSCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxxRUFBcUUsRUFBRSxHQUFHLEVBQUU7UUFDL0UsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLDRCQUFzQixDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsdUJBQXVCLEVBQUU7WUFDakUsYUFBYSxFQUFFLFlBQVk7WUFDM0IsT0FBTyxFQUFFLG1DQUE2QixDQUFDLFdBQVc7WUFDbEQsZ0JBQWdCLEVBQUU7Z0JBQ2hCLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRTtnQkFDbkIsRUFBRSxVQUFVLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7YUFDN0I7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsTUFBTSxRQUFRLEdBQUcsdUJBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekMsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxzREFBc0QsQ0FBQztRQUN2RixNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDeEMsVUFBVSxFQUFFLFFBQVE7Z0JBQ3BCLGNBQWMsRUFBRTtvQkFDZCxPQUFPLEVBQUUsWUFBWTtvQkFDckIsU0FBUyxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQztpQkFDL0Q7YUFDRixDQUFDLENBQUMsQ0FBQztJQUVOLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHNFQUFzRSxFQUFFLEdBQUcsRUFBRTtRQUNoRixRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFLLEVBQUUsQ0FBQztRQUUxQixPQUFPO1FBQ1AsTUFBTSxRQUFRLEdBQUcsNEJBQXNCLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLHVCQUF1QixFQUFFO1lBQzFGLGFBQWEsRUFBRSxZQUFZO1lBQzNCLE9BQU8sRUFBRSxtQ0FBNkIsQ0FBQyxXQUFXO1lBQ2xELGdCQUFnQixFQUFFO2dCQUNoQixFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUU7Z0JBQ25CLEVBQUUsVUFBVSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO2FBQzdCO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBRTlDLE9BQU87UUFDUCxNQUFNLFFBQVEsR0FBRyx1QkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6QyxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLHNEQUFzRCxDQUFDO1FBQ3ZGLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN4QyxVQUFVLEVBQUUsUUFBUTtnQkFDcEIsY0FBYyxFQUFFO29CQUNkLE9BQU8sRUFBRSxZQUFZO29CQUNyQixTQUFTLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDO2lCQUNwRjthQUNGLENBQUMsQ0FBQyxDQUFDO0lBQ04sQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMscUNBQXFDLEVBQUUsR0FBRyxFQUFFO1FBQy9DLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFdBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCw0QkFBc0IsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLHVCQUF1QixFQUFFO1lBQ2pFLGFBQWEsRUFBRSxZQUFZO1lBQzNCLE9BQU8sRUFBRSxtQ0FBNkIsQ0FBQyxXQUFXO1lBQ2xELFVBQVUsRUFBRSxVQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUM3QixPQUFPLEVBQUUsY0FBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDNUIsV0FBVyxFQUFFLGdCQUFnQjtTQUM5QixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsTUFBTSxRQUFRLEdBQUcsdUJBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekMsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyx5REFBeUQsQ0FBQztRQUM1RixNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBRWxFLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHVCQUF1QixFQUFFLEdBQUcsRUFBRTtRQUNqQyxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFLLEVBQUUsQ0FBQztRQUUxQixPQUFPO1FBQ1AsNEJBQXNCLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSx1QkFBdUIsRUFBRTtZQUNqRSxhQUFhLEVBQUUsWUFBWTtZQUMzQixPQUFPLEVBQUUsbUNBQTZCLENBQUMsV0FBVztZQUNsRCxXQUFXLEVBQUU7Z0JBQ1gsQ0FBQyxFQUFFLEdBQUc7Z0JBQ04sQ0FBQyxFQUFFLEdBQUc7YUFDUDtTQUNGLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxNQUFNLFFBQVEsR0FBRyx1QkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6QyxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLHlEQUF5RCxDQUFDO1FBQzVGLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUM1QyxTQUFTLEVBQUUsTUFBTSxDQUFDLGdCQUFnQixDQUFDO2dCQUNqQyxDQUFDLEVBQUUsR0FBRztnQkFDTixDQUFDLEVBQUUsR0FBRzthQUNQLENBQUM7U0FDSCxDQUFDLENBQUM7SUFFTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO1FBQ25CLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFdBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxNQUFNLEVBQUUsR0FBRyw0QkFBc0IsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsdUJBQXVCLEVBQUU7WUFDcEYsYUFBYSxFQUFFLFlBQVk7WUFDM0IsT0FBTyxFQUFFLG1DQUE2QixDQUFDLFdBQVc7U0FDbkQsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUN4QyxZQUFZLEVBQUU7Z0JBQ1osd0RBQXdEO2dCQUN4RCxLQUFLO2FBQ047U0FDRixDQUFDLENBQUM7SUFFTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBBcHAsIEFzc2V0U3RhZ2luZywgQ3VzdG9tUmVzb3VyY2VQcm92aWRlciwgQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJ1bnRpbWUsIERvY2tlckltYWdlQXNzZXRMb2NhdGlvbiwgRG9ja2VySW1hZ2VBc3NldFNvdXJjZSwgRHVyYXRpb24sIEZpbGVBc3NldExvY2F0aW9uLCBGaWxlQXNzZXRTb3VyY2UsIElTeW50aGVzaXNTZXNzaW9uLCBTaXplLCBTdGFjaywgQ2ZuUmVzb3VyY2UgfSBmcm9tICcuLi8uLi9saWInO1xuaW1wb3J0IHsgQ1VTVE9NSVpFX1JPTEVTX0NPTlRFWFRfS0VZIH0gZnJvbSAnLi4vLi4vbGliL2hlbHBlcnMtaW50ZXJuYWwnO1xuaW1wb3J0IHsgdG9DbG91ZEZvcm1hdGlvbiB9IGZyb20gJy4uL3V0aWwnO1xuXG5jb25zdCBURVNUX0hBTkRMRVIgPSBgJHtfX2Rpcm5hbWV9L21vY2stcHJvdmlkZXJgO1xuXG5kZXNjcmliZSgnY3VzdG9tIHJlc291cmNlIHByb3ZpZGVyJywgKCkgPT4ge1xuICBkZXNjcmliZSgnY3VzdG9taXplIHJvbGVzJywgKCkgPT4ge1xuICAgIHRlc3QoJ3JvbGUgaXMgbm90IGNyZWF0ZWQgaWYgcHJldmVudFN5bnRoZXNpcyE9ZmFsc2UnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnTXlTdGFjaycpO1xuICAgICAgc3RhY2subm9kZS5zZXRDb250ZXh0KENVU1RPTUlaRV9ST0xFU19DT05URVhUX0tFWSwge1xuICAgICAgICB1c2VQcmVjcmVhdGVkUm9sZXM6IHtcbiAgICAgICAgICAnTXlTdGFjay9DdXN0b206TXlSZXNvdXJjZVR5cGVDdXN0b21SZXNvdXJjZVByb3ZpZGVyL1JvbGUnOiAnbXktY3VzdG9tLXJvbGUtbmFtZScsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHNvbWVSZXNvdXJjZSA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ1NvbWVSZXNvdXJjZScsIHtcbiAgICAgICAgdHlwZTogJ0FXUzo6U29tZVJlc291cmNlJyxcbiAgICAgICAgcHJvcGVydGllczoge30sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgY3IgPSBDdXN0b21SZXNvdXJjZVByb3ZpZGVyLmdldE9yQ3JlYXRlUHJvdmlkZXIoc3RhY2ssICdDdXN0b206TXlSZXNvdXJjZVR5cGUnLCB7XG4gICAgICAgIGNvZGVEaXJlY3Rvcnk6IFRFU1RfSEFORExFUixcbiAgICAgICAgcnVudGltZTogQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICB9KTtcbiAgICAgIGNyLmFkZFRvUm9sZVBvbGljeSh7XG4gICAgICAgIEFjdGlvbjogJ3MzOkdldEJ1Y2tldCcsXG4gICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgUmVzb3VyY2U6IHNvbWVSZXNvdXJjZS5yZWYsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoJ015U3RhY2snKS50ZW1wbGF0ZTtcbiAgICAgIGNvbnN0IHJlc291cmNlVHlwZXMgPSBPYmplY3QudmFsdWVzKHRlbXBsYXRlLlJlc291cmNlcykuZmxhdE1hcCgodmFsdWU6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gdmFsdWUuVHlwZTtcbiAgICAgIH0pO1xuICAgICAgLy8gcm9sZSBpcyBub3QgY3JlYXRlZFxuICAgICAgZXhwZWN0KHJlc291cmNlVHlwZXMpLm5vdC50b0NvbnRhaW4oJ0FXUzo6SUFNOjpSb2xlJyk7XG4gICAgICAvLyBsYW1iZGEgZnVuY3Rpb24gcmVmZXJlbmNlcyBwcmVjcmVhdGVkIHJvbGVcbiAgICAgIGV4cGVjdCh0ZW1wbGF0ZS5SZXNvdXJjZXMuQ3VzdG9tTXlSZXNvdXJjZVR5cGVDdXN0b21SZXNvdXJjZVByb3ZpZGVySGFuZGxlcjI5RkJERDJBLlByb3BlcnRpZXMuUm9sZSkudG9FcXVhbCh7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnOmlhbTo6JyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICc6cm9sZS9teS1jdXN0b20tcm9sZS1uYW1lJyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIHJlcG9ydCBpcyBnZW5lcmF0ZWQgY29ycmVjdGx5XG4gICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihhc3NlbWJseS5kaXJlY3RvcnksICdpYW0tcG9saWN5LXJlcG9ydC5qc29uJyk7XG4gICAgICBjb25zdCBmaWxlID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pO1xuICAgICAgZXhwZWN0KEpTT04ucGFyc2UoZmlsZSkpLnRvRXF1YWwoe1xuICAgICAgICByb2xlczogW3tcbiAgICAgICAgICByb2xlQ29uc3RydWN0UGF0aDogJ015U3RhY2svQ3VzdG9tOk15UmVzb3VyY2VUeXBlQ3VzdG9tUmVzb3VyY2VQcm92aWRlci9Sb2xlJyxcbiAgICAgICAgICByb2xlTmFtZTogJ215LWN1c3RvbS1yb2xlLW5hbWUnLFxuICAgICAgICAgIG1pc3Npbmc6IGZhbHNlLFxuICAgICAgICAgIGFzc3VtZVJvbGVQb2xpY3k6IFt7XG4gICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgU2VydmljZTogJ2xhbWJkYS5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfV0sXG4gICAgICAgICAgbWFuYWdlZFBvbGljeUFybnM6IFtcbiAgICAgICAgICAgICdhcm46JHtBV1M6OlBhcnRpdGlvbn06aWFtOjphd3M6cG9saWN5L3NlcnZpY2Utcm9sZS9BV1NMYW1iZGFCYXNpY0V4ZWN1dGlvblJvbGUnLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgbWFuYWdlZFBvbGljeVN0YXRlbWVudHM6IFtdLFxuICAgICAgICAgIGlkZW50aXR5UG9saWN5U3RhdGVtZW50czogW3tcbiAgICAgICAgICAgIEFjdGlvbjogJ3MzOkdldEJ1Y2tldCcsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZTogJyhNeVN0YWNrL1NvbWVSZXNvdXJjZS5SZWYpJyxcbiAgICAgICAgICB9XSxcbiAgICAgICAgfV0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3JvbGUgaXMgY3JlYXRlZCBpZiBwcmV2ZW50U3ludGhlc2lzPWZhbHNlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ015U3RhY2snKTtcbiAgICAgIHN0YWNrLm5vZGUuc2V0Q29udGV4dChDVVNUT01JWkVfUk9MRVNfQ09OVEVYVF9LRVksIHtcbiAgICAgICAgcHJldmVudFN5bnRoZXNpczogZmFsc2UsXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHNvbWVSZXNvdXJjZSA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ1NvbWVSZXNvdXJjZScsIHtcbiAgICAgICAgdHlwZTogJ0FXUzo6U29tZVJlc291cmNlJyxcbiAgICAgICAgcHJvcGVydGllczoge30sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgY3IgPSBDdXN0b21SZXNvdXJjZVByb3ZpZGVyLmdldE9yQ3JlYXRlUHJvdmlkZXIoc3RhY2ssICdDdXN0b206TXlSZXNvdXJjZVR5cGUnLCB7XG4gICAgICAgIGNvZGVEaXJlY3Rvcnk6IFRFU1RfSEFORExFUixcbiAgICAgICAgcnVudGltZTogQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICB9KTtcbiAgICAgIGNyLmFkZFRvUm9sZVBvbGljeSh7XG4gICAgICAgIEFjdGlvbjogJ3MzOkdldEJ1Y2tldCcsXG4gICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgUmVzb3VyY2U6IHNvbWVSZXNvdXJjZS5yZWYsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoJ015U3RhY2snKS50ZW1wbGF0ZTtcbiAgICAgIGNvbnN0IHJlc291cmNlVHlwZXMgPSBPYmplY3QudmFsdWVzKHRlbXBsYXRlLlJlc291cmNlcykuZmxhdE1hcCgodmFsdWU6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gdmFsdWUuVHlwZTtcbiAgICAgIH0pO1xuICAgICAgLy8gSUFNIHJvbGUgX2lzXyBjcmVhdGVkXG4gICAgICBleHBlY3QocmVzb3VyY2VUeXBlcykudG9Db250YWluKCdBV1M6OklBTTo6Um9sZScpO1xuICAgICAgLy8gbGFtYmRhIGZ1bmN0aW9uIHJlZmVyZW5jZXMgdGhlIGNyZWF0ZWQgcm9sZVxuICAgICAgZXhwZWN0KHRlbXBsYXRlLlJlc291cmNlcy5DdXN0b21NeVJlc291cmNlVHlwZUN1c3RvbVJlc291cmNlUHJvdmlkZXJIYW5kbGVyMjlGQkREMkEuUHJvcGVydGllcy5Sb2xlKS50b0VxdWFsKHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ0N1c3RvbU15UmVzb3VyY2VUeXBlQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJvbGVCRDVFNjU1RicsXG4gICAgICAgICAgJ0FybicsXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgLy8gcmVwb3J0IGlzIHN0aWxsIGdlbmVyYXRlZFxuICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4oYXNzZW1ibHkuZGlyZWN0b3J5LCAnaWFtLXBvbGljeS1yZXBvcnQuanNvbicpO1xuICAgICAgY29uc3QgZmlsZSA9IGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KTtcbiAgICAgIGV4cGVjdChKU09OLnBhcnNlKGZpbGUpKS50b0VxdWFsKHtcbiAgICAgICAgcm9sZXM6IFt7XG4gICAgICAgICAgcm9sZUNvbnN0cnVjdFBhdGg6ICdNeVN0YWNrL0N1c3RvbTpNeVJlc291cmNlVHlwZUN1c3RvbVJlc291cmNlUHJvdmlkZXIvUm9sZScsXG4gICAgICAgICAgcm9sZU5hbWU6ICdtaXNzaW5nIHJvbGUnLFxuICAgICAgICAgIG1pc3Npbmc6IHRydWUsXG4gICAgICAgICAgYXNzdW1lUm9sZVBvbGljeTogW3tcbiAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgICBTZXJ2aWNlOiAnbGFtYmRhLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XSxcbiAgICAgICAgICBtYW5hZ2VkUG9saWN5QXJuczogW1xuICAgICAgICAgICAgJ2Fybjoke0FXUzo6UGFydGl0aW9ufTppYW06OmF3czpwb2xpY3kvc2VydmljZS1yb2xlL0FXU0xhbWJkYUJhc2ljRXhlY3V0aW9uUm9sZScsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBtYW5hZ2VkUG9saWN5U3RhdGVtZW50czogW10sXG4gICAgICAgICAgaWRlbnRpdHlQb2xpY3lTdGF0ZW1lbnRzOiBbe1xuICAgICAgICAgICAgQWN0aW9uOiAnczM6R2V0QnVja2V0JyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiAnKE15U3RhY2svU29tZVJlc291cmNlLlJlZiknLFxuICAgICAgICAgIH1dLFxuICAgICAgICB9XSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdtaW5pbWFsIGNvbmZpZ3VyYXRpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHsgY29udGV4dDogeyBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UgfSB9KTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHApO1xuXG4gICAgLy8gV0hFTlxuICAgIEN1c3RvbVJlc291cmNlUHJvdmlkZXIuZ2V0T3JDcmVhdGUoc3RhY2ssICdDdXN0b206TXlSZXNvdXJjZVR5cGUnLCB7XG4gICAgICBjb2RlRGlyZWN0b3J5OiBURVNUX0hBTkRMRVIsXG4gICAgICBydW50aW1lOiBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBjZm4gPSB0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKTtcblxuICAgIC8vIFRoZSBhc3NldCBoYXNoIGNvbnN0YW50bHkgY2hhbmdlcywgc28gaW4gb3JkZXIgdG8gbm90IGhhdmUgdG8gY2hhc2UgaXQsIGp1c3QgbG9va1xuICAgIC8vIGl0IHVwIGZyb20gdGhlIG91dHB1dC5cbiAgICBjb25zdCBzdGFnaW5nID0gc3RhY2subm9kZS50cnlGaW5kQ2hpbGQoJ0N1c3RvbTpNeVJlc291cmNlVHlwZUN1c3RvbVJlc291cmNlUHJvdmlkZXInKT8ubm9kZS50cnlGaW5kQ2hpbGQoJ1N0YWdpbmcnKSBhcyBBc3NldFN0YWdpbmc7XG4gICAgY29uc3QgYXNzZXRIYXNoID0gc3RhZ2luZy5hc3NldEhhc2g7XG4gICAgY29uc3Qgc291cmNlUGF0aCA9IHN0YWdpbmcuc291cmNlUGF0aDtcbiAgICBjb25zdCBwYXJhbU5hbWVzID0gT2JqZWN0LmtleXMoY2ZuLlBhcmFtZXRlcnMpO1xuICAgIGNvbnN0IGJ1Y2tldFBhcmFtID0gcGFyYW1OYW1lc1swXTtcbiAgICBjb25zdCBrZXlQYXJhbSA9IHBhcmFtTmFtZXNbMV07XG4gICAgY29uc3QgaGFzaFBhcmFtID0gcGFyYW1OYW1lc1syXTtcblxuICAgIGV4cGVjdChmcy5leGlzdHNTeW5jKHBhdGguam9pbihzb3VyY2VQYXRoLCAnX19lbnRyeXBvaW50X18uanMnKSkpLnRvRXF1YWwodHJ1ZSk7XG5cbiAgICBleHBlY3QoY2ZuKS50b0VxdWFsKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBDdXN0b21NeVJlc291cmNlVHlwZUN1c3RvbVJlc291cmNlUHJvdmlkZXJSb2xlQkQ1RTY1NUY6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpJQU06OlJvbGUnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgICAgICAgICBTZXJ2aWNlOiAnbGFtYmRhLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIE1hbmFnZWRQb2xpY3lBcm5zOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnRm46OlN1Yic6ICdhcm46JHtBV1M6OlBhcnRpdGlvbn06aWFtOjphd3M6cG9saWN5L3NlcnZpY2Utcm9sZS9BV1NMYW1iZGFCYXNpY0V4ZWN1dGlvblJvbGUnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBDdXN0b21NeVJlc291cmNlVHlwZUN1c3RvbVJlc291cmNlUHJvdmlkZXJIYW5kbGVyMjlGQkREMkE6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBDb2RlOiB7XG4gICAgICAgICAgICAgIFMzQnVja2V0OiB7IFJlZjogYnVja2V0UGFyYW0gfSxcbiAgICAgICAgICAgICAgUzNLZXk6IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICdGbjo6U2VsZWN0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnfHwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgUmVmOiBrZXlQYXJhbSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAxLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd8fCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBSZWY6IGtleVBhcmFtIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgVGltZW91dDogOTAwLFxuICAgICAgICAgICAgTWVtb3J5U2l6ZTogMTI4LFxuICAgICAgICAgICAgSGFuZGxlcjogJ19fZW50cnlwb2ludF9fLmhhbmRsZXInLFxuICAgICAgICAgICAgUm9sZToge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnQ3VzdG9tTXlSZXNvdXJjZVR5cGVDdXN0b21SZXNvdXJjZVByb3ZpZGVyUm9sZUJENUU2NTVGJyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBSdW50aW1lOiAnbm9kZWpzMTQueCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBEZXBlbmRzT246IFtcbiAgICAgICAgICAgICdDdXN0b21NeVJlc291cmNlVHlwZUN1c3RvbVJlc291cmNlUHJvdmlkZXJSb2xlQkQ1RTY1NUYnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgUGFyYW1ldGVyczoge1xuICAgICAgICBbYnVja2V0UGFyYW1dOiB7XG4gICAgICAgICAgVHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgRGVzY3JpcHRpb246IGBTMyBidWNrZXQgZm9yIGFzc2V0IFwiJHthc3NldEhhc2h9XCJgLFxuICAgICAgICB9LFxuICAgICAgICBba2V5UGFyYW1dOiB7XG4gICAgICAgICAgVHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgRGVzY3JpcHRpb246IGBTMyBrZXkgZm9yIGFzc2V0IHZlcnNpb24gXCIke2Fzc2V0SGFzaH1cImAsXG4gICAgICAgIH0sXG4gICAgICAgIFtoYXNoUGFyYW1dOiB7XG4gICAgICAgICAgVHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgRGVzY3JpcHRpb246IGBBcnRpZmFjdCBoYXNoIGZvciBhc3NldCBcIiR7YXNzZXRIYXNofVwiYCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnYXNzZXQgbWV0YWRhdGEgYWRkZWQgdG8gY3VzdG9tIHJlc291cmNlIHRoYXQgY29udGFpbnMgY29kZSBkZWZpbml0aW9uJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBzdGFjay5ub2RlLnNldENvbnRleHQoY3hhcGkuQVNTRVRfUkVTT1VSQ0VfTUVUQURBVEFfRU5BQkxFRF9DT05URVhULCB0cnVlKTtcbiAgICBzdGFjay5ub2RlLnNldENvbnRleHQoY3hhcGkuRElTQUJMRV9BU1NFVF9TVEFHSU5HX0NPTlRFWFQsIHRydWUpO1xuXG4gICAgLy8gV0hFTlxuICAgIEN1c3RvbVJlc291cmNlUHJvdmlkZXIuZ2V0T3JDcmVhdGUoc3RhY2ssICdDdXN0b206TXlSZXNvdXJjZVR5cGUnLCB7XG4gICAgICBjb2RlRGlyZWN0b3J5OiBURVNUX0hBTkRMRVIsXG4gICAgICBydW50aW1lOiBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KTtcblxuICAgIC8vIFRoZW5cbiAgICBjb25zdCBsYW1iZGEgPSB0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKS5SZXNvdXJjZXMuQ3VzdG9tTXlSZXNvdXJjZVR5cGVDdXN0b21SZXNvdXJjZVByb3ZpZGVySGFuZGxlcjI5RkJERDJBO1xuICAgIGV4cGVjdChsYW1iZGEpLnRvSGF2ZVByb3BlcnR5KCdNZXRhZGF0YScpO1xuXG4gICAgZXhwZWN0KGxhbWJkYS5NZXRhZGF0YSkudG9NYXRjaE9iamVjdCh7XG4gICAgICAnYXdzOmFzc2V0OnByb3BlcnR5JzogJ0NvZGUnLFxuXG4gICAgICAvLyBUaGUgYXNzZXQgcGF0aCBzaG91bGQgYmUgYSB0ZW1wb3JhcnkgZm9sZGVyIHByZWZpeGVkIHdpdGggJ2Nkay1jdXN0b20tcmVzb3VyY2UnXG4gICAgICAnYXdzOmFzc2V0OnBhdGgnOiBleHBlY3Quc3RyaW5nTWF0Y2hpbmcoL14uKlxcL2Nkay1jdXN0b20tcmVzb3VyY2VcXHd7Nn1cXC8/JC8pLFxuICAgIH0pO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ2N1c3RvbSByZXNvdXJjZSBwcm92aWRlZCBjcmVhdGVzIGFzc2V0IGluIG5ldy1zdHlsZSBzeW50aGVzaXMgd2l0aCByZWxhdGl2ZSBwYXRoJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG5cbiAgICBsZXQgYXNzZXRGaWxlbmFtZSA6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdTdGFjaycsIHtcbiAgICAgIHN5bnRoZXNpemVyOiB7XG4gICAgICAgIGJpbmQoX3N0YWNrOiBTdGFjayk6IHZvaWQgeyB9LFxuXG4gICAgICAgIGFkZEZpbGVBc3NldChhc3NldDogRmlsZUFzc2V0U291cmNlKTogRmlsZUFzc2V0TG9jYXRpb24ge1xuICAgICAgICAgIGFzc2V0RmlsZW5hbWUgPSBhc3NldC5maWxlTmFtZTtcbiAgICAgICAgICByZXR1cm4geyBidWNrZXROYW1lOiAnJywgaHR0cFVybDogJycsIG9iamVjdEtleTogJycsIHMzT2JqZWN0VXJsOiAnJywgczNVcmw6ICcnLCBrbXNLZXlBcm46ICcnIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWRkRG9ja2VySW1hZ2VBc3NldChfYXNzZXQ6IERvY2tlckltYWdlQXNzZXRTb3VyY2UpOiBEb2NrZXJJbWFnZUFzc2V0TG9jYXRpb24ge1xuICAgICAgICAgIHJldHVybiB7IGltYWdlVXJpOiAnJywgcmVwb3NpdG9yeU5hbWU6ICcnIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgc3ludGhlc2l6ZShfc2Vzc2lvbjogSVN5bnRoZXNpc1Nlc3Npb24pOiB2b2lkIHsgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgQ3VzdG9tUmVzb3VyY2VQcm92aWRlci5nZXRPckNyZWF0ZShzdGFjaywgJ0N1c3RvbTpNeVJlc291cmNlVHlwZScsIHtcbiAgICAgIGNvZGVEaXJlY3Rvcnk6IFRFU1RfSEFORExFUixcbiAgICAgIHJ1bnRpbWU6IEN1c3RvbVJlc291cmNlUHJvdmlkZXJSdW50aW1lLk5PREVKU18xNF9YLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTiAtLSBubyBleGNlcHRpb25cbiAgICBpZiAoIWFzc2V0RmlsZW5hbWUgfHwgYXNzZXRGaWxlbmFtZS5zdGFydHNXaXRoKHBhdGguc2VwKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBc3NldCBmaWxlbmFtZSBtdXN0IGJlIGEgcmVsYXRpdmUgcGF0aCwgZ290OiAke2Fzc2V0RmlsZW5hbWV9YCk7XG4gICAgfVxuXG5cbiAgfSk7XG5cbiAgdGVzdCgncG9saWN5U3RhdGVtZW50cyBjYW4gYmUgdXNlZCB0byBhZGQgc3RhdGVtZW50cyB0byB0aGUgaW5saW5lIHBvbGljeScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgQ3VzdG9tUmVzb3VyY2VQcm92aWRlci5nZXRPckNyZWF0ZShzdGFjaywgJ0N1c3RvbTpNeVJlc291cmNlVHlwZScsIHtcbiAgICAgIGNvZGVEaXJlY3Rvcnk6IFRFU1RfSEFORExFUixcbiAgICAgIHJ1bnRpbWU6IEN1c3RvbVJlc291cmNlUHJvdmlkZXJSdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgcG9saWN5U3RhdGVtZW50czogW1xuICAgICAgICB7IHN0YXRlbWVudDE6IDEyMyB9LFxuICAgICAgICB7IHN0YXRlbWVudDI6IHsgZm9vOiAxMTEgfSB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spO1xuICAgIGNvbnN0IHJvbGUgPSB0ZW1wbGF0ZS5SZXNvdXJjZXMuQ3VzdG9tTXlSZXNvdXJjZVR5cGVDdXN0b21SZXNvdXJjZVByb3ZpZGVyUm9sZUJENUU2NTVGO1xuICAgIGV4cGVjdChyb2xlLlByb3BlcnRpZXMuUG9saWNpZXMpLnRvRXF1YWwoW3tcbiAgICAgIFBvbGljeU5hbWU6ICdJbmxpbmUnLFxuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICBTdGF0ZW1lbnQ6IFt7IHN0YXRlbWVudDE6IDEyMyB9LCB7IHN0YXRlbWVudDI6IHsgZm9vOiAxMTEgfSB9XSxcbiAgICAgIH0sXG4gICAgfV0pO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ2FkZFRvUm9sZVBvbGljeSgpIGNhbiBiZSB1c2VkIHRvIGFkZCBzdGF0ZW1lbnRzIHRvIHRoZSBpbmxpbmUgcG9saWN5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBwcm92aWRlciA9IEN1c3RvbVJlc291cmNlUHJvdmlkZXIuZ2V0T3JDcmVhdGVQcm92aWRlcihzdGFjaywgJ0N1c3RvbTpNeVJlc291cmNlVHlwZScsIHtcbiAgICAgIGNvZGVEaXJlY3Rvcnk6IFRFU1RfSEFORExFUixcbiAgICAgIHJ1bnRpbWU6IEN1c3RvbVJlc291cmNlUHJvdmlkZXJSdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgcG9saWN5U3RhdGVtZW50czogW1xuICAgICAgICB7IHN0YXRlbWVudDE6IDEyMyB9LFxuICAgICAgICB7IHN0YXRlbWVudDI6IHsgZm9vOiAxMTEgfSB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgICBwcm92aWRlci5hZGRUb1JvbGVQb2xpY3koeyBzdGF0ZW1lbnQzOiA0NTYgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgdGVtcGxhdGUgPSB0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKTtcbiAgICBjb25zdCByb2xlID0gdGVtcGxhdGUuUmVzb3VyY2VzLkN1c3RvbU15UmVzb3VyY2VUeXBlQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJvbGVCRDVFNjU1RjtcbiAgICBleHBlY3Qocm9sZS5Qcm9wZXJ0aWVzLlBvbGljaWVzKS50b0VxdWFsKFt7XG4gICAgICBQb2xpY3lOYW1lOiAnSW5saW5lJyxcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgU3RhdGVtZW50OiBbeyBzdGF0ZW1lbnQxOiAxMjMgfSwgeyBzdGF0ZW1lbnQyOiB7IGZvbzogMTExIH0gfSwgeyBzdGF0ZW1lbnQzOiA0NTYgfV0sXG4gICAgICB9LFxuICAgIH1dKTtcbiAgfSk7XG5cbiAgdGVzdCgnbWVtb3J5U2l6ZSwgdGltZW91dCBhbmQgZGVzY3JpcHRpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIEN1c3RvbVJlc291cmNlUHJvdmlkZXIuZ2V0T3JDcmVhdGUoc3RhY2ssICdDdXN0b206TXlSZXNvdXJjZVR5cGUnLCB7XG4gICAgICBjb2RlRGlyZWN0b3J5OiBURVNUX0hBTkRMRVIsXG4gICAgICBydW50aW1lOiBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIG1lbW9yeVNpemU6IFNpemUuZ2liaWJ5dGVzKDIpLFxuICAgICAgdGltZW91dDogRHVyYXRpb24ubWludXRlcyg1KSxcbiAgICAgIGRlc2NyaXB0aW9uOiAndmVuaSB2aWRpIHZpY2knLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IHRlbXBsYXRlID0gdG9DbG91ZEZvcm1hdGlvbihzdGFjayk7XG4gICAgY29uc3QgbGFtYmRhID0gdGVtcGxhdGUuUmVzb3VyY2VzLkN1c3RvbU15UmVzb3VyY2VUeXBlQ3VzdG9tUmVzb3VyY2VQcm92aWRlckhhbmRsZXIyOUZCREQyQTtcbiAgICBleHBlY3QobGFtYmRhLlByb3BlcnRpZXMuTWVtb3J5U2l6ZSkudG9FcXVhbCgyMDQ4KTtcbiAgICBleHBlY3QobGFtYmRhLlByb3BlcnRpZXMuVGltZW91dCkudG9FcXVhbCgzMDApO1xuICAgIGV4cGVjdChsYW1iZGEuUHJvcGVydGllcy5EZXNjcmlwdGlvbikudG9FcXVhbCgndmVuaSB2aWRpIHZpY2knKTtcblxuICB9KTtcblxuICB0ZXN0KCdlbnZpcm9ubWVudCB2YXJpYWJsZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIEN1c3RvbVJlc291cmNlUHJvdmlkZXIuZ2V0T3JDcmVhdGUoc3RhY2ssICdDdXN0b206TXlSZXNvdXJjZVR5cGUnLCB7XG4gICAgICBjb2RlRGlyZWN0b3J5OiBURVNUX0hBTkRMRVIsXG4gICAgICBydW50aW1lOiBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIEI6ICdiJyxcbiAgICAgICAgQTogJ2EnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spO1xuICAgIGNvbnN0IGxhbWJkYSA9IHRlbXBsYXRlLlJlc291cmNlcy5DdXN0b21NeVJlc291cmNlVHlwZUN1c3RvbVJlc291cmNlUHJvdmlkZXJIYW5kbGVyMjlGQkREMkE7XG4gICAgZXhwZWN0KGxhbWJkYS5Qcm9wZXJ0aWVzLkVudmlyb25tZW50KS50b0VxdWFsKHtcbiAgICAgIFZhcmlhYmxlczogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICBBOiAnYScsXG4gICAgICAgIEI6ICdiJyxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ3JvbGVBcm4nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNyID0gQ3VzdG9tUmVzb3VyY2VQcm92aWRlci5nZXRPckNyZWF0ZVByb3ZpZGVyKHN0YWNrLCAnQ3VzdG9tOk15UmVzb3VyY2VUeXBlJywge1xuICAgICAgY29kZURpcmVjdG9yeTogVEVTVF9IQU5ETEVSLFxuICAgICAgcnVudGltZTogQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoY3Iucm9sZUFybikpLnRvRXF1YWwoe1xuICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICdDdXN0b21NeVJlc291cmNlVHlwZUN1c3RvbVJlc291cmNlUHJvdmlkZXJSb2xlQkQ1RTY1NUYnLFxuICAgICAgICAnQXJuJyxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgfSk7XG59KTtcblxuIl19