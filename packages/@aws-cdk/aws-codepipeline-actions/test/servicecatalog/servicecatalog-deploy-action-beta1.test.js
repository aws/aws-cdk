"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const codecommit = require("@aws-cdk/aws-codecommit");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const core_1 = require("@aws-cdk/core");
const cpactions = require("../../lib");
/* eslint-disable quote-props */
describe('ServiceCatalog Deploy Action', () => {
    test('addAction succesfully leads to creation of codepipeline service catalog action with properly formatted TemplateFilePath', () => {
        // GIVEN
        const stack = new TestFixture();
        // WHEN
        stack.deployStage.addAction(new cpactions.ServiceCatalogDeployActionBeta1({
            actionName: 'ServiceCatalogTest',
            templatePath: stack.sourceOutput.atPath('template.yaml'),
            productVersionDescription: 'This is a description of the version.',
            productVersionName: 'VersionName',
            productId: 'prod-xxxxxxxxx',
        }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
            'Stages': assertions_1.Match.arrayWith([
                assertions_1.Match.objectLike({ 'Name': 'Source' /* don't care about the rest */ }),
                assertions_1.Match.objectLike({
                    'Name': 'Deploy',
                    'Actions': assertions_1.Match.arrayWith([
                        assertions_1.Match.objectLike({
                            'ActionTypeId': {
                                'Category': 'Deploy',
                                'Owner': 'AWS',
                                'Provider': 'ServiceCatalog',
                                'Version': '1',
                            },
                            'Configuration': {
                                'TemplateFilePath': 'template.yaml',
                                'ProductVersionDescription': 'This is a description of the version.',
                                'ProductVersionName': 'VersionName',
                                'ProductType': 'CLOUD_FORMATION_TEMPLATE',
                                'ProductId': 'prod-xxxxxxxxx',
                            },
                            'InputArtifacts': [
                                {
                                    'Name': 'SourceArtifact',
                                },
                            ],
                            'Name': 'ServiceCatalogTest',
                        }),
                    ]),
                }),
            ]),
        });
    });
    test('deployment without a description works successfully', () => {
        // GIVEN
        const stack = new TestFixture();
        // WHEN
        stack.deployStage.addAction(new cpactions.ServiceCatalogDeployActionBeta1({
            actionName: 'ServiceCatalogTest',
            templatePath: stack.sourceOutput.atPath('template.yaml'),
            productVersionName: 'VersionName',
            productId: 'prod-xxxxxxxxx',
        }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
            'Stages': assertions_1.Match.arrayWith([
                assertions_1.Match.objectLike({ 'Name': 'Source' /* don't care about the rest */ }),
                assertions_1.Match.objectLike({
                    'Name': 'Deploy',
                    'Actions': assertions_1.Match.arrayWith([
                        assertions_1.Match.objectLike({
                            'ActionTypeId': {
                                'Category': 'Deploy',
                                'Owner': 'AWS',
                                'Provider': 'ServiceCatalog',
                                'Version': '1',
                            },
                            'Configuration': {
                                'TemplateFilePath': 'template.yaml',
                                'ProductVersionName': 'VersionName',
                                'ProductType': 'CLOUD_FORMATION_TEMPLATE',
                                'ProductId': 'prod-xxxxxxxxx',
                            },
                            'InputArtifacts': [
                                {
                                    'Name': 'SourceArtifact',
                                },
                            ],
                            'Name': 'ServiceCatalogTest',
                        }),
                    ]),
                }),
            ]),
        });
    });
});
/**
 * A test stack with a half-prepared pipeline ready to add CloudFormation actions to
 */
class TestFixture extends core_1.Stack {
    constructor() {
        super();
        this.pipeline = new codepipeline.Pipeline(this, 'Pipeline');
        this.sourceStage = this.pipeline.addStage({ stageName: 'Source' });
        this.deployStage = this.pipeline.addStage({ stageName: 'Deploy' });
        this.repo = new codecommit.Repository(this, 'MyVeryImportantRepo', {
            repositoryName: 'my-very-important-repo',
        });
        this.sourceOutput = new codepipeline.Artifact('SourceArtifact');
        const source = new cpactions.CodeCommitSourceAction({
            actionName: 'Source',
            output: this.sourceOutput,
            repository: this.repo,
        });
        this.sourceStage.addAction(source);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZWNhdGFsb2ctZGVwbG95LWFjdGlvbi1iZXRhMS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VydmljZWNhdGFsb2ctZGVwbG95LWFjdGlvbi1iZXRhMS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQXNEO0FBQ3RELHNEQUFzRDtBQUN0RCwwREFBMEQ7QUFDMUQsd0NBQXNDO0FBQ3RDLHVDQUF1QztBQUV2QyxnQ0FBZ0M7QUFFaEMsUUFBUSxDQUFDLDhCQUE4QixFQUFFLEdBQUcsRUFBRTtJQUM1QyxJQUFJLENBQUMseUhBQXlILEVBQUUsR0FBRyxFQUFFO1FBQ25JLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQ2hDLE9BQU87UUFDUCxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLFNBQVMsQ0FBQywrQkFBK0IsQ0FBQztZQUN4RSxVQUFVLEVBQUUsb0JBQW9CO1lBQ2hDLFlBQVksRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUM7WUFDeEQseUJBQXlCLEVBQUUsdUNBQXVDO1lBQ2xFLGtCQUFrQixFQUFFLGFBQWE7WUFDakMsU0FBUyxFQUFFLGdCQUFnQjtTQUM1QixDQUFDLENBQUMsQ0FBQztRQUNKLE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyw2QkFBNkIsRUFBRTtZQUM3RSxRQUFRLEVBQUUsa0JBQUssQ0FBQyxTQUFTLENBQUM7Z0JBQ3hCLGtCQUFLLENBQUMsVUFBVSxDQUFDLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQywrQkFBK0IsRUFBRSxDQUFDO2dCQUN0RSxrQkFBSyxDQUFDLFVBQVUsQ0FBQztvQkFDZixNQUFNLEVBQUUsUUFBUTtvQkFDaEIsU0FBUyxFQUFFLGtCQUFLLENBQUMsU0FBUyxDQUFDO3dCQUN6QixrQkFBSyxDQUFDLFVB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VUFBVSxDQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRTtZQUNqRSxjQUFjLEVBQUUsd0JBQXdCO1NBQ3pDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDaEUsTUFBTSxNQUFNLEdBQUcsSUFBSSxTQUFTLENBQUMsc0JBQXNCLENBQUM7WUFDbEQsVUFBVSxFQUFFLFFBQVE7WUFDcEIsTUFBTSxFQUFFLElBQUksQ0FBQyxZQUFZO1lBQ3pCLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSTtTQUN0QixDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNwQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUsIE1hdGNoIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBjb2RlY29tbWl0IGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlY29tbWl0JztcbmltcG9ydCAqIGFzIGNvZGVwaXBlbGluZSBmcm9tICdAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjcGFjdGlvbnMgZnJvbSAnLi4vLi4vbGliJztcblxuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cblxuZGVzY3JpYmUoJ1NlcnZpY2VDYXRhbG9nIERlcGxveSBBY3Rpb24nLCAoKSA9PiB7XG4gIHRlc3QoJ2FkZEFjdGlvbiBzdWNjZXNmdWxseSBsZWFkcyB0byBjcmVhdGlvbiBvZiBjb2RlcGlwZWxpbmUgc2VydmljZSBjYXRhbG9nIGFjdGlvbiB3aXRoIHByb3Blcmx5IGZvcm1hdHRlZCBUZW1wbGF0ZUZpbGVQYXRoJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgVGVzdEZpeHR1cmUoKTtcbiAgICAvLyBXSEVOXG4gICAgc3RhY2suZGVwbG95U3RhZ2UuYWRkQWN0aW9uKG5ldyBjcGFjdGlvbnMuU2VydmljZUNhdGFsb2dEZXBsb3lBY3Rpb25CZXRhMSh7XG4gICAgICBhY3Rpb25OYW1lOiAnU2VydmljZUNhdGFsb2dUZXN0JyxcbiAgICAgIHRlbXBsYXRlUGF0aDogc3RhY2suc291cmNlT3V0cHV0LmF0UGF0aCgndGVtcGxhdGUueWFtbCcpLFxuICAgICAgcHJvZHVjdFZlcnNpb25EZXNjcmlwdGlvbjogJ1RoaXMgaXMgYSBkZXNjcmlwdGlvbiBvZiB0aGUgdmVyc2lvbi4nLFxuICAgICAgcHJvZHVjdFZlcnNpb25OYW1lOiAnVmVyc2lvbk5hbWUnLFxuICAgICAgcHJvZHVjdElkOiAncHJvZC14eHh4eHh4eHgnLFxuICAgIH0pKTtcbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIHtcbiAgICAgICdTdGFnZXMnOiBNYXRjaC5hcnJheVdpdGgoW1xuICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHsgJ05hbWUnOiAnU291cmNlJyAvKiBkb24ndCBjYXJlIGFib3V0IHRoZSByZXN0ICovIH0pLFxuICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICAnTmFtZSc6ICdEZXBsb3knLFxuICAgICAgICAgICdBY3Rpb25zJzogTWF0Y2guYXJyYXlXaXRoKFtcbiAgICAgICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgICAgICAnQWN0aW9uVHlwZUlkJzoge1xuICAgICAgICAgICAgICAgICdDYXRlZ29yeSc6ICdEZXBsb3knLFxuICAgICAgICAgICAgICAgICdPd25lcic6ICdBV1MnLFxuICAgICAgICAgICAgICAgICdQcm92aWRlcic6ICdTZXJ2aWNlQ2F0YWxvZycsXG4gICAgICAgICAgICAgICAgJ1ZlcnNpb24nOiAnMScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdDb25maWd1cmF0aW9uJzoge1xuICAgICAgICAgICAgICAgICdUZW1wbGF0ZUZpbGVQYXRoJzogJ3RlbXBsYXRlLnlhbWwnLFxuICAgICAgICAgICAgICAgICdQcm9kdWN0VmVyc2lvbkRlc2NyaXB0aW9uJzogJ1RoaXMgaXMgYSBkZXNjcmlwdGlvbiBvZiB0aGUgdmVyc2lvbi4nLFxuICAgICAgICAgICAgICAgICdQcm9kdWN0VmVyc2lvbk5hbWUnOiAnVmVyc2lvbk5hbWUnLFxuICAgICAgICAgICAgICAgICdQcm9kdWN0VHlwZSc6ICdDTE9VRF9GT1JNQVRJT05fVEVNUExBVEUnLFxuICAgICAgICAgICAgICAgICdQcm9kdWN0SWQnOiAncHJvZC14eHh4eHh4eHgnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnSW5wdXRBcnRpZmFjdHMnOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ05hbWUnOiAnU291cmNlQXJ0aWZhY3QnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICdOYW1lJzogJ1NlcnZpY2VDYXRhbG9nVGVzdCcsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICBdKSxcbiAgICAgICAgfSksXG4gICAgICBdKSxcbiAgICB9KTtcblxuXG4gIH0pO1xuICB0ZXN0KCdkZXBsb3ltZW50IHdpdGhvdXQgYSBkZXNjcmlwdGlvbiB3b3JrcyBzdWNjZXNzZnVsbHknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBUZXN0Rml4dHVyZSgpO1xuICAgIC8vIFdIRU5cbiAgICBzdGFjay5kZXBsb3lTdGFnZS5hZGRBY3Rpb24obmV3IGNwYWN0aW9ucy5TZXJ2aWNlQ2F0YWxvZ0RlcGxveUFjdGlvbkJldGExKHtcbiAgICAgIGFjdGlvbk5hbWU6ICdTZXJ2aWNlQ2F0YWxvZ1Rlc3QnLFxuICAgICAgdGVtcGxhdGVQYXRoOiBzdGFjay5zb3VyY2VPdXRwdXQuYXRQYXRoKCd0ZW1wbGF0ZS55YW1sJyksXG4gICAgICBwcm9kdWN0VmVyc2lvbk5hbWU6ICdWZXJzaW9uTmFtZScsXG4gICAgICBwcm9kdWN0SWQ6ICdwcm9kLXh4eHh4eHh4eCcsXG4gICAgfSkpO1xuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywge1xuICAgICAgJ1N0YWdlcyc6IE1hdGNoLmFycmF5V2l0aChbXG4gICAgICAgIE1hdGNoLm9iamVjdExpa2UoeyAnTmFtZSc6ICdTb3VyY2UnIC8qIGRvbid0IGNhcmUgYWJvdXQgdGhlIHJlc3QgKi8gfSksXG4gICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgICdOYW1lJzogJ0RlcGxveScsXG4gICAgICAgICAgJ0FjdGlvbnMnOiBNYXRjaC5hcnJheVdpdGgoW1xuICAgICAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICAgICdBY3Rpb25UeXBlSWQnOiB7XG4gICAgICAgICAgICAgICAgJ0NhdGVnb3J5JzogJ0RlcGxveScsXG4gICAgICAgICAgICAgICAgJ093bmVyJzogJ0FXUycsXG4gICAgICAgICAgICAgICAgJ1Byb3ZpZGVyJzogJ1NlcnZpY2VDYXRhbG9nJyxcbiAgICAgICAgICAgICAgICAnVmVyc2lvbic6ICcxJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJ0NvbmZpZ3VyYXRpb24nOiB7XG4gICAgICAgICAgICAgICAgJ1RlbXBsYXRlRmlsZVBhdGgnOiAndGVtcGxhdGUueWFtbCcsXG4gICAgICAgICAgICAgICAgJ1Byb2R1Y3RWZXJzaW9uTmFtZSc6ICdWZXJzaW9uTmFtZScsXG4gICAgICAgICAgICAgICAgJ1Byb2R1Y3RUeXBlJzogJ0NMT1VEX0ZPUk1BVElPTl9URU1QTEFURScsXG4gICAgICAgICAgICAgICAgJ1Byb2R1Y3RJZCc6ICdwcm9kLXh4eHh4eHh4eCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdJbnB1dEFydGlmYWN0cyc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnTmFtZSc6ICdTb3VyY2VBcnRpZmFjdCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ05hbWUnOiAnU2VydmljZUNhdGFsb2dUZXN0JyxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIF0pLFxuICAgICAgICB9KSxcbiAgICAgIF0pLFxuICAgIH0pO1xuXG5cbiAgfSk7XG59KTtcblxuLyoqXG4gKiBBIHRlc3Qgc3RhY2sgd2l0aCBhIGhhbGYtcHJlcGFyZWQgcGlwZWxpbmUgcmVhZHkgdG8gYWRkIENsb3VkRm9ybWF0aW9uIGFjdGlvbnMgdG9cbiAqL1xuY2xhc3MgVGVzdEZpeHR1cmUgZXh0ZW5kcyBTdGFjayB7XG4gIHB1YmxpYyByZWFkb25seSBwaXBlbGluZTogY29kZXBpcGVsaW5lLlBpcGVsaW5lO1xuICBwdWJsaWMgcmVhZG9ubHkgc291cmNlU3RhZ2U6IGNvZGVwaXBlbGluZS5JU3RhZ2U7XG4gIHB1YmxpYyByZWFkb25seSBkZXBsb3lTdGFnZTogY29kZXBpcGVsaW5lLklTdGFnZTtcbiAgcHVibGljIHJlYWRvbmx5IHJlcG86IGNvZGVjb21taXQuUmVwb3NpdG9yeTtcbiAgcHVibGljIHJlYWRvbmx5IHNvdXJjZU91dHB1dDogY29kZXBpcGVsaW5lLkFydGlmYWN0O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnBpcGVsaW5lID0gbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZSh0aGlzLCAnUGlwZWxpbmUnKTtcbiAgICB0aGlzLnNvdXJjZVN0YWdlID0gdGhpcy5waXBlbGluZS5hZGRTdGFnZSh7IHN0YWdlTmFtZTogJ1NvdXJjZScgfSk7XG4gICAgdGhpcy5kZXBsb3lTdGFnZSA9IHRoaXMucGlwZWxpbmUuYWRkU3RhZ2UoeyBzdGFnZU5hbWU6ICdEZXBsb3knIH0pO1xuICAgIHRoaXMucmVwbyA9IG5ldyBjb2RlY29tbWl0LlJlcG9zaXRvcnkodGhpcywgJ015VmVyeUltcG9ydGFudFJlcG8nLCB7XG4gICAgICByZXBvc2l0b3J5TmFtZTogJ215LXZlcnktaW1wb3J0YW50LXJlcG8nLFxuICAgIH0pO1xuICAgIHRoaXMuc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgnU291cmNlQXJ0aWZhY3QnKTtcbiAgICBjb25zdCBzb3VyY2UgPSBuZXcgY3BhY3Rpb25zLkNvZGVDb21taXRTb3VyY2VBY3Rpb24oe1xuICAgICAgYWN0aW9uTmFtZTogJ1NvdXJjZScsXG4gICAgICBvdXRwdXQ6IHRoaXMuc291cmNlT3V0cHV0LFxuICAgICAgcmVwb3NpdG9yeTogdGhpcy5yZXBvLFxuICAgIH0pO1xuICAgIHRoaXMuc291cmNlU3RhZ2UuYWRkQWN0aW9uKHNvdXJjZSk7XG4gIH1cbn1cbiJdfQ==