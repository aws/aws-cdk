"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const s3 = require("@aws-cdk/aws-s3");
const core_1 = require("@aws-cdk/core");
const fake_build_action_1 = require("./fake-build-action");
const fake_source_action_1 = require("./fake-source-action");
const codepipeline = require("../lib");
describe.each([
    ['legacy', false],
    ['legacy', true],
    ['modern', false],
    ['modern', true],
])('with %s synthesis, in Stage=%p', (synthesisStyle, inStage) => {
    let app;
    let stackScope;
    let stack;
    let sourceArtifact;
    let initialStages;
    beforeEach(() => {
        app = new core_1.App({
            context: {
                ...synthesisStyle === 'modern' ? { '@aws-cdk/core:newStyleStackSynthesis': true } : undefined,
            },
        });
        stackScope = inStage ? new core_1.Stage(app, 'MyStage') : app;
        stack = new core_1.Stack(stackScope, 'PipelineStack', { env: { account: '2222', region: 'us-east-1' } });
        sourceArtifact = new codepipeline.Artifact();
        initialStages = [
            {
                stageName: 'Source',
                actions: [new fake_source_action_1.FakeSourceAction({
                        actionName: 'Source',
                        output: sourceArtifact,
                    })],
            },
            {
                stageName: 'Build',
                actions: [new fake_build_action_1.FakeBuildAction({
                        actionName: 'Build',
                        input: sourceArtifact,
                    })],
            },
        ];
    });
    describe('crossAccountKeys=false', () => {
        let pipeline;
        beforeEach(() => {
            pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
                crossAccountKeys: false,
                stages: initialStages,
            });
        });
        test('creates a bucket but no keys', () => {
            // THEN
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::KMS::Key', 0);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 1);
        });
        describe('prevents adding a cross-account action', () => {
            const expectedError = 'crossAccountKeys: true';
            let stage;
            beforeEach(() => {
                stage = pipeline.addStage({ stageName: 'Deploy' });
            });
            test('by role', () => {
                // WHEN
                expect(() => {
                    stage.addAction(new fake_build_action_1.FakeBuildAction({
                        actionName: 'Deploy',
                        input: sourceArtifact,
                        role: iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::1111:role/some-role'),
                    }));
                }).toThrow(expectedError);
            });
            test('by resource', () => {
                // WHEN
                expect(() => {
                    stage.addAction(new fake_build_action_1.FakeBuildAction({
                        actionName: 'Deploy',
                        input: sourceArtifact,
                        resource: s3.Bucket.fromBucketAttributes(stack, 'Bucket', {
                            bucketName: 'foo',
                            account: '1111',
                        }),
                    }));
                }).toThrow(expectedError);
            });
            test('by declared account', () => {
                // WHEN
                expect(() => {
                    stage.addAction(new fake_build_action_1.FakeBuildAction({
                        actionName: 'Deploy',
                        input: sourceArtifact,
                        account: '1111',
                    }));
                }).toThrow(expectedError);
            });
        });
        describe('also affects cross-region support stacks', () => {
            let stage;
            beforeEach(() => {
                stage = pipeline.addStage({ stageName: 'Deploy' });
            });
            test('when making a support stack', () => {
                // WHEN
                stage.addAction(new fake_build_action_1.FakeBuildAction({
                    actionName: 'Deploy',
                    input: sourceArtifact,
                    // No resource to grab onto forces creating a fresh support stack
                    region: 'eu-west-1',
                }));
                // THEN
                let asm = app.synth();
                asm = inStage ? asm.getNestedAssembly('assembly-MyStage') : asm;
                const supportStack = asm.getStackByName(`${stack.stackName}-support-eu-west-1`);
                // THEN
                assertions_1.Template.fromJSON(supportStack.template).resourceCountIs('AWS::KMS::Key', 0);
                assertions_1.Template.fromJSON(supportStack.template).hasResourceProperties('AWS::S3::Bucket', {
                    PublicAccessBlockConfiguration: {
                        BlockPublicAcls: true,
                        BlockPublicPolicy: true,
                        IgnorePublicAcls: true,
                        RestrictPublicBuckets: true,
                    },
                });
            });
            test('when twiddling another stack', () => {
                const stack2 = new core_1.Stack(stackScope, 'Stack2', { env: { account: '2222', region: 'eu-west-1' } });
                // WHEN
                stage.addAction(new fake_build_action_1.FakeBuildAction({
                    actionName: 'Deploy',
                    input: sourceArtifact,
                    resource: new iam.User(stack2, 'DoesntMatterWhatThisIs'),
                }));
                // THEN
                assertions_1.Template.fromStack(stack2).resourceCountIs('AWS::KMS::Key', 0);
                assertions_1.Template.fromStack(stack2).resourceCountIs('AWS::S3::Bucket', 1);
            });
        });
    });
});
describe('cross-environment CodePipeline', function () {
    test('correctly detects that an Action is cross-account from the account of the resource backing the Action', () => {
        const app = new core_1.App();
        const pipelineStack = new core_1.Stack(app, 'PipelineStack', {
            env: { account: '123', region: 'my-region' },
        });
        const sourceOutput = new codepipeline.Artifact();
        const pipeline = new codepipeline.Pipeline(pipelineStack, 'Pipeline', {
            stages: [
                {
                    stageName: 'Source',
                    actions: [
                        new fake_source_action_1.FakeSourceAction({
                            actionName: 'Source',
                            output: sourceOutput,
                        }),
                    ],
                },
            ],
        });
        // Import a resource backing the FakeBuildAction into the pipeline's Stack,
        // but specify a different account for it during the import.
        // This should be correctly detected by the CodePipeline construct,
        // and a correct support Stack should be created.
        const deployBucket = s3.Bucket.fromBucketAttributes(pipelineStack, 'DeployBucket', {
            bucketName: 'my-bucket',
            account: '456',
        });
        pipeline.addStage({
            stageName: 'Build',
            actions: [
                new fake_build_action_1.FakeBuildAction({
                    actionName: 'Build',
                    input: sourceOutput,
                    resource: deployBucket,
                }),
            ],
        });
        const asm = app.synth();
        const supportStack = asm.getStackByName(`${pipelineStack.stackName}-support-456`);
        assertions_1.Template.fromJSON(supportStack.template).hasResourceProperties('AWS::IAM::Role', {
            RoleName: 'pipelinestack-support-456dbuildactionrole91c6f1a469fd11d52dfe',
        });
        assertions_1.Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
            Stages: [
                { Name: 'Source' },
                {
                    Name: 'Build',
                    Actions: [
                        {
                            Name: 'Build',
                            RoleArn: {
                                'Fn::Join': ['', [
                                        'arn:',
                                        { Ref: 'AWS::Partition' },
                                        ':iam::456:role/pipelinestack-support-456dbuildactionrole91c6f1a469fd11d52dfe',
                                    ]],
                            },
                        },
                    ],
                },
            ],
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3Jvc3MtZW52LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjcm9zcy1lbnYudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyx3Q0FBd0M7QUFDeEMsc0NBQXNDO0FBQ3RDLHdDQUE4RDtBQUU5RCwyREFBc0Q7QUFDdEQsNkRBQXdEO0FBQ3hELHVDQUF1QztBQUV2QyxRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ1osQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDO0lBQ2pCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQztJQUNoQixDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUM7SUFDakIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDO0NBQ2pCLENBQUMsQ0FBQyxnQ0FBZ0MsRUFBRSxDQUFDLGNBQXNCLEVBQUUsT0FBZ0IsRUFBRSxFQUFFO0lBQ2hGLElBQUksR0FBUSxDQUFDO0lBQ2IsSUFBSSxVQUFxQixDQUFDO0lBQzFCLElBQUksS0FBWSxDQUFDO0lBQ2pCLElBQUksY0FBcUMsQ0FBQztJQUMxQyxJQUFJLGFBQXdDLENBQUM7SUFFN0MsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEdBQUcsR0FBRyxJQUFJLFVBQUcsQ0FBQztZQUNaLE9BQU8sRUFBRTtnQkFDUCxHQUFHLGNBQWMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsc0NBQXNDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVM7YUFDOUY7U0FDRixDQUFDLENBQUM7UUFDSCxVQUFVLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLFlBQVEsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUUxRCxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsVUFBVSxFQUFFLGVBQWUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFdBQVcs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LE1BQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxhQUFhLENBQUMsU0FBUyxjQUFjLENBQUMsQ0FBQztRQUNsRixxQkFBUSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMscUJBQXFCLENBQUMsZ0JBQWdCLEVBQUU7WUFDL0UsUUFBUSxFQUFFLCtEQUErRDtTQUMxRSxDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyw2QkFBNkIsRUFBRTtZQUNyRixNQUFNLEVBQUU7Z0JBQ04sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO2dCQUNsQjtvQkFDRSxJQUFJLEVBQUUsT0FBTztvQkFDYixPQUFPLEVBQUU7d0JBQ1A7NEJBQ0UsSUFBSSxFQUFFLE9BQU87NEJBQ2IsT0FBTyxFQUFFO2dDQUNQLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRTt3Q0FDZixNQUFNO3dDQUNOLEVBQUUsR0FBRyxFQUFFLGdCQUFnQixFQUFFO3dDQUN6Qiw4RUFBOEU7cUNBQy9FLENBQUM7NkJBQ0g7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCB7IFN0YWNrLCBBcHAsIFN0YWdlIGFzIENka1N0YWdlIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEZha2VCdWlsZEFjdGlvbiB9IGZyb20gJy4vZmFrZS1idWlsZC1hY3Rpb24nO1xuaW1wb3J0IHsgRmFrZVNvdXJjZUFjdGlvbiB9IGZyb20gJy4vZmFrZS1zb3VyY2UtYWN0aW9uJztcbmltcG9ydCAqIGFzIGNvZGVwaXBlbGluZSBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZS5lYWNoKFtcbiAgWydsZWdhY3knLCBmYWxzZV0sXG4gIFsnbGVnYWN5JywgdHJ1ZV0sXG4gIFsnbW9kZXJuJywgZmFsc2VdLFxuICBbJ21vZGVybicsIHRydWVdLFxuXSkoJ3dpdGggJXMgc3ludGhlc2lzLCBpbiBTdGFnZT0lcCcsIChzeW50aGVzaXNTdHlsZTogc3RyaW5nLCBpblN0YWdlOiBib29sZWFuKSA9PiB7XG4gIGxldCBhcHA6IEFwcDtcbiAgbGV0IHN0YWNrU2NvcGU6IENvbnN0cnVjdDtcbiAgbGV0IHN0YWNrOiBTdGFjaztcbiAgbGV0IHNvdXJjZUFydGlmYWN0OiBjb2RlcGlwZWxpbmUuQXJ0aWZhY3Q7XG4gIGxldCBpbml0aWFsU3RhZ2VzOiBjb2RlcGlwZWxpbmUuU3RhZ2VQcm9wc1tdO1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIGFwcCA9IG5ldyBBcHAoe1xuICAgICAgY29udGV4dDoge1xuICAgICAgICAuLi5zeW50aGVzaXNTdHlsZSA9PT0gJ21vZGVybicgPyB7ICdAYXdzLWNkay9jb3JlOm5ld1N0eWxlU3RhY2tTeW50aGVzaXMnOiB0cnVlIH0gOiB1bmRlZmluZWQsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHN0YWNrU2NvcGUgPSBpblN0YWdlID8gbmV3IENka1N0YWdlKGFwcCwgJ015U3RhZ2UnKSA6IGFwcDtcblxuICAgIHN0YWNrID0gbmV3IFN0YWNrKHN0YWNrU2NvcGUsICdQaXBlbGluZVN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogJzIyMjInLCByZWdpb246ICd1cy1lYXN0LTEnIH0gfSk7XG4gICAgc291cmNlQXJ0aWZhY3QgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG4gICAgaW5pdGlhbFN0YWdlcyA9IFtcbiAgICAgIHtcbiAgICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgICAgYWN0aW9uczogW25ldyBGYWtlU291cmNlQWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25OYW1lOiAnU291cmNlJyxcbiAgICAgICAgICBvdXRwdXQ6IHNvdXJjZUFydGlmYWN0LFxuICAgICAgICB9KV0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBzdGFnZU5hbWU6ICdCdWlsZCcsXG4gICAgICAgIGFjdGlvbnM6IFtuZXcgRmFrZUJ1aWxkQWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25OYW1lOiAnQnVpbGQnLFxuICAgICAgICAgIGlucHV0OiBzb3VyY2VBcnRpZmFjdCxcbiAgICAgICAgfSldLFxuICAgICAgfSxcbiAgICBdO1xuICB9KTtcblxuICBkZXNjcmliZSgnY3Jvc3NBY2NvdW50S2V5cz1mYWxzZScsICgpID0+IHtcbiAgICBsZXQgcGlwZWxpbmU6IGNvZGVwaXBlbGluZS5QaXBlbGluZTtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIHBpcGVsaW5lID0gbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ1BpcGVsaW5lJywge1xuICAgICAgICBjcm9zc0FjY291bnRLZXlzOiBmYWxzZSxcbiAgICAgICAgc3RhZ2VzOiBpbml0aWFsU3RhZ2VzLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjcmVhdGVzIGEgYnVja2V0IGJ1dCBubyBrZXlzJywgKCkgPT4ge1xuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6S01TOjpLZXknLCAwKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OlMzOjpCdWNrZXQnLCAxKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdwcmV2ZW50cyBhZGRpbmcgYSBjcm9zcy1hY2NvdW50IGFjdGlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IGV4cGVjdGVkRXJyb3IgPSAnY3Jvc3NBY2NvdW50S2V5czogdHJ1ZSc7XG5cbiAgICAgIGxldCBzdGFnZTogY29kZXBpcGVsaW5lLklTdGFnZTtcbiAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBzdGFnZSA9IHBpcGVsaW5lLmFkZFN0YWdlKHsgc3RhZ2VOYW1lOiAnRGVwbG95JyB9KTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdieSByb2xlJywgKCkgPT4ge1xuICAgICAgICAvLyBXSEVOXG4gICAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgICAgc3RhZ2UuYWRkQWN0aW9uKG5ldyBGYWtlQnVpbGRBY3Rpb24oe1xuICAgICAgICAgICAgYWN0aW9uTmFtZTogJ0RlcGxveScsXG4gICAgICAgICAgICBpbnB1dDogc291cmNlQXJ0aWZhY3QsXG4gICAgICAgICAgICByb2xlOiBpYW0uUm9sZS5mcm9tUm9sZUFybihzdGFjaywgJ1JvbGUnLCAnYXJuOmF3czppYW06OjExMTE6cm9sZS9zb21lLXJvbGUnKSxcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0pLnRvVGhyb3coZXhwZWN0ZWRFcnJvcik7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnYnkgcmVzb3VyY2UnLCAoKSA9PiB7XG4gICAgICAgIC8vIFdIRU5cbiAgICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgICBzdGFnZS5hZGRBY3Rpb24obmV3IEZha2VCdWlsZEFjdGlvbih7XG4gICAgICAgICAgICBhY3Rpb25OYW1lOiAnRGVwbG95JyxcbiAgICAgICAgICAgIGlucHV0OiBzb3VyY2VBcnRpZmFjdCxcbiAgICAgICAgICAgIHJlc291cmNlOiBzMy5CdWNrZXQuZnJvbUJ1Y2tldEF0dHJpYnV0ZXMoc3RhY2ssICdCdWNrZXQnLCB7XG4gICAgICAgICAgICAgIGJ1Y2tldE5hbWU6ICdmb28nLFxuICAgICAgICAgICAgICBhY2NvdW50OiAnMTExMScsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0pLnRvVGhyb3coZXhwZWN0ZWRFcnJvcik7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnYnkgZGVjbGFyZWQgYWNjb3VudCcsICgpID0+IHtcbiAgICAgICAgLy8gV0hFTlxuICAgICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICAgIHN0YWdlLmFkZEFjdGlvbihuZXcgRmFrZUJ1aWxkQWN0aW9uKHtcbiAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdEZXBsb3knLFxuICAgICAgICAgICAgaW5wdXQ6IHNvdXJjZUFydGlmYWN0LFxuICAgICAgICAgICAgYWNjb3VudDogJzExMTEnLFxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfSkudG9UaHJvdyhleHBlY3RlZEVycm9yKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2Fsc28gYWZmZWN0cyBjcm9zcy1yZWdpb24gc3VwcG9ydCBzdGFja3MnLCAoKSA9PiB7XG4gICAgICBsZXQgc3RhZ2U6IGNvZGVwaXBlbGluZS5JU3RhZ2U7XG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgc3RhZ2UgPSBwaXBlbGluZS5hZGRTdGFnZSh7IHN0YWdlTmFtZTogJ0RlcGxveScgfSk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnd2hlbiBtYWtpbmcgYSBzdXBwb3J0IHN0YWNrJywgKCkgPT4ge1xuICAgICAgICAvLyBXSEVOXG4gICAgICAgIHN0YWdlLmFkZEFjdGlvbihuZXcgRmFrZUJ1aWxkQWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25OYW1lOiAnRGVwbG95JyxcbiAgICAgICAgICBpbnB1dDogc291cmNlQXJ0aWZhY3QsXG4gICAgICAgICAgLy8gTm8gcmVzb3VyY2UgdG8gZ3JhYiBvbnRvIGZvcmNlcyBjcmVhdGluZyBhIGZyZXNoIHN1cHBvcnQgc3RhY2tcbiAgICAgICAgICByZWdpb246ICdldS13ZXN0LTEnLFxuICAgICAgICB9KSk7XG5cbiAgICAgICAgLy8gVEhFTlxuICAgICAgICBsZXQgYXNtID0gYXBwLnN5bnRoKCk7XG4gICAgICAgIGFzbSA9IGluU3RhZ2UgPyBhc20uZ2V0TmVzdGVkQXNzZW1ibHkoJ2Fzc2VtYmx5LU15U3RhZ2UnKSA6IGFzbTtcbiAgICAgICAgY29uc3Qgc3VwcG9ydFN0YWNrID0gYXNtLmdldFN0YWNrQnlOYW1lKGAke3N0YWNrLnN0YWNrTmFtZX0tc3VwcG9ydC1ldS13ZXN0LTFgKTtcblxuICAgICAgICAvLyBUSEVOXG4gICAgICAgIFRlbXBsYXRlLmZyb21KU09OKHN1cHBvcnRTdGFjay50ZW1wbGF0ZSkucmVzb3VyY2VDb3VudElzKCdBV1M6OktNUzo6S2V5JywgMCk7XG4gICAgICAgIFRlbXBsYXRlLmZyb21KU09OKHN1cHBvcnRTdGFjay50ZW1wbGF0ZSkuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlMzOjpCdWNrZXQnLCB7XG4gICAgICAgICAgUHVibGljQWNjZXNzQmxvY2tDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBCbG9ja1B1YmxpY0FjbHM6IHRydWUsXG4gICAgICAgICAgICBCbG9ja1B1YmxpY1BvbGljeTogdHJ1ZSxcbiAgICAgICAgICAgIElnbm9yZVB1YmxpY0FjbHM6IHRydWUsXG4gICAgICAgICAgICBSZXN0cmljdFB1YmxpY0J1Y2tldHM6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnd2hlbiB0d2lkZGxpbmcgYW5vdGhlciBzdGFjaycsICgpID0+IHtcbiAgICAgICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKHN0YWNrU2NvcGUsICdTdGFjazInLCB7IGVudjogeyBhY2NvdW50OiAnMjIyMicsIHJlZ2lvbjogJ2V1LXdlc3QtMScgfSB9KTtcblxuICAgICAgICAvLyBXSEVOXG4gICAgICAgIHN0YWdlLmFkZEFjdGlvbihuZXcgRmFrZUJ1aWxkQWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25OYW1lOiAnRGVwbG95JyxcbiAgICAgICAgICBpbnB1dDogc291cmNlQXJ0aWZhY3QsXG4gICAgICAgICAgcmVzb3VyY2U6IG5ldyBpYW0uVXNlcihzdGFjazIsICdEb2VzbnRNYXR0ZXJXaGF0VGhpc0lzJyksXG4gICAgICAgIH0pKTtcblxuICAgICAgICAvLyBUSEVOXG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjazIpLnJlc291cmNlQ291bnRJcygnQVdTOjpLTVM6OktleScsIDApO1xuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2syKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIDEpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdjcm9zcy1lbnZpcm9ubWVudCBDb2RlUGlwZWxpbmUnLCBmdW5jdGlvbiAoKSB7XG4gIHRlc3QoJ2NvcnJlY3RseSBkZXRlY3RzIHRoYXQgYW4gQWN0aW9uIGlzIGNyb3NzLWFjY291bnQgZnJvbSB0aGUgYWNjb3VudCBvZiB0aGUgcmVzb3VyY2UgYmFja2luZyB0aGUgQWN0aW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxuICAgIGNvbnN0IHBpcGVsaW5lU3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnUGlwZWxpbmVTdGFjaycsIHtcbiAgICAgIGVudjogeyBhY2NvdW50OiAnMTIzJywgcmVnaW9uOiAnbXktcmVnaW9uJyB9LFxuICAgIH0pO1xuICAgIGNvbnN0IHNvdXJjZU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbiAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUocGlwZWxpbmVTdGFjaywgJ1BpcGVsaW5lJywge1xuICAgICAgc3RhZ2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgIG5ldyBGYWtlU291cmNlQWN0aW9uKHtcbiAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ1NvdXJjZScsXG4gICAgICAgICAgICAgIG91dHB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICAvLyBJbXBvcnQgYSByZXNvdXJjZSBiYWNraW5nIHRoZSBGYWtlQnVpbGRBY3Rpb24gaW50byB0aGUgcGlwZWxpbmUncyBTdGFjayxcbiAgICAvLyBidXQgc3BlY2lmeSBhIGRpZmZlcmVudCBhY2NvdW50IGZvciBpdCBkdXJpbmcgdGhlIGltcG9ydC5cbiAgICAvLyBUaGlzIHNob3VsZCBiZSBjb3JyZWN0bHkgZGV0ZWN0ZWQgYnkgdGhlIENvZGVQaXBlbGluZSBjb25zdHJ1Y3QsXG4gICAgLy8gYW5kIGEgY29ycmVjdCBzdXBwb3J0IFN0YWNrIHNob3VsZCBiZSBjcmVhdGVkLlxuICAgIGNvbnN0IGRlcGxveUJ1Y2tldCA9IHMzLkJ1Y2tldC5mcm9tQnVja2V0QXR0cmlidXRlcyhwaXBlbGluZVN0YWNrLCAnRGVwbG95QnVja2V0Jywge1xuICAgICAgYnVja2V0TmFtZTogJ215LWJ1Y2tldCcsXG4gICAgICBhY2NvdW50OiAnNDU2JyxcbiAgICB9KTtcbiAgICBwaXBlbGluZS5hZGRTdGFnZSh7XG4gICAgICBzdGFnZU5hbWU6ICdCdWlsZCcsXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgIG5ldyBGYWtlQnVpbGRBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvbk5hbWU6ICdCdWlsZCcsXG4gICAgICAgICAgaW5wdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgICAgICByZXNvdXJjZTogZGVwbG95QnVja2V0LFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBhc20gPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCBzdXBwb3J0U3RhY2sgPSBhc20uZ2V0U3RhY2tCeU5hbWUoYCR7cGlwZWxpbmVTdGFjay5zdGFja05hbWV9LXN1cHBvcnQtNDU2YCk7XG4gICAgVGVtcGxhdGUuZnJvbUpTT04oc3VwcG9ydFN0YWNrLnRlbXBsYXRlKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgICAgUm9sZU5hbWU6ICdwaXBlbGluZXN0YWNrLXN1cHBvcnQtNDU2ZGJ1aWxkYWN0aW9ucm9sZTkxYzZmMWE0NjlmZDExZDUyZGZlJyxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhwaXBlbGluZVN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIHtcbiAgICAgIFN0YWdlczogW1xuICAgICAgICB7IE5hbWU6ICdTb3VyY2UnIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBOYW1lOiAnQnVpbGQnLFxuICAgICAgICAgIEFjdGlvbnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgTmFtZTogJ0J1aWxkJyxcbiAgICAgICAgICAgICAgUm9sZUFybjoge1xuICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgICAgICc6aWFtOjo0NTY6cm9sZS9waXBlbGluZXN0YWNrLXN1cHBvcnQtNDU2ZGJ1aWxkYWN0aW9ucm9sZTkxYzZmMWE0NjlmZDExZDUyZGZlJyxcbiAgICAgICAgICAgICAgICBdXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=