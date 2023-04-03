"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const iam = require("@aws-cdk/aws-iam");
const sns = require("@aws-cdk/aws-sns");
const core_1 = require("@aws-cdk/core");
const cpactions = require("../lib");
/* eslint-disable quote-props */
describe('manual approval', () => {
    describe('manual approval Action', () => {
        test('allows passing an SNS Topic when constructing it', () => {
            const stack = new core_1.Stack();
            const topic = new sns.Topic(stack, 'Topic');
            const manualApprovalAction = new cpactions.ManualApprovalAction({
                actionName: 'Approve',
                notificationTopic: topic,
            });
            const pipeline = new codepipeline.Pipeline(stack, 'pipeline');
            const stage = pipeline.addStage({ stageName: 'stage' });
            stage.addAction(manualApprovalAction);
            expect(manualApprovalAction.notificationTopic).toEqual(topic);
        });
        test('allows granting manual approval permissions to role', () => {
            const stack = new core_1.Stack();
            const role = new iam.Role(stack, 'Human', { assumedBy: new iam.AnyPrincipal() });
            const pipeline = new codepipeline.Pipeline(stack, 'pipeline');
            pipeline.addStage({
                stageName: 'Source',
                actions: [new cpactions.GitHubSourceAction({
                        actionName: 'Source',
                        output: new codepipeline.Artifact(),
                        oauthToken: core_1.SecretValue.unsafePlainText('secret'),
                        owner: 'aws',
                        repo: 'aws-cdk',
                    })],
            });
            const stage = pipeline.addStage({ stageName: 'stage' });
            const manualApprovalAction = new cpactions.ManualApprovalAction({
                actionName: 'Approve',
            });
            stage.addAction(manualApprovalAction);
            manualApprovalAction.grantManualApproval(role);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                'PolicyDocument': {
                    'Statement': [
                        {
                            'Action': 'codepipeline:ListPipelines',
                            'Effect': 'Allow',
                            'Resource': '*',
                        },
                        {
                            'Action': [
                                'codepipeline:GetPipeline',
                                'codepipeline:GetPipelineState',
                                'codepipeline:GetPipelineExecution',
                            ],
                            'Effect': 'Allow',
                            'Resource': {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        { 'Ref': 'AWS::Partition' },
                                        ':codepipeline:',
                                        { 'Ref': 'AWS::Region' },
                                        ':',
                                        { 'Ref': 'AWS::AccountId' },
                                        ':',
                                        { 'Ref': 'pipelineDBECAE49' },
                                    ],
                                ],
                            },
                        },
                        {
                            'Action': 'codepipeline:PutApprovalResult',
                            'Effect': 'Allow',
                            'Resource': {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        { 'Ref': 'AWS::Partition' },
                                        ':codepipeline:',
                                        { 'Ref': 'AWS::Region' },
                                        ':',
                                        { 'Ref': 'AWS::AccountId' },
                                        ':',
                                        { 'Ref': 'pipelineDBECAE49' },
                                        '/stage/Approve',
                                    ],
                                ],
                            },
                        },
                    ],
                    'Version': '2012-10-17',
                },
                'PolicyName': 'HumanDefaultPolicy49346D53',
                'Roles': [
                    {
                        'Ref': 'HumanD337C84C',
                    },
                ],
            });
        });
        test('rejects granting manual approval permissions before binding action to stage', () => {
            const stack = new core_1.Stack();
            const role = new iam.Role(stack, 'Human', { assumedBy: new iam.AnyPrincipal() });
            const manualApprovalAction = new cpactions.ManualApprovalAction({
                actionName: 'Approve',
            });
            expect(() => {
                manualApprovalAction.grantManualApproval(role);
            }).toThrow('Cannot grant permissions before binding action to a stage');
        });
        test('renders CustomData and ExternalEntityLink even if notificationTopic was not passed', () => {
            const stack = new core_1.Stack();
            new codepipeline.Pipeline(stack, 'pipeline', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [new cpactions.GitHubSourceAction({
                                actionName: 'Source',
                                output: new codepipeline.Artifact(),
                                oauthToken: core_1.SecretValue.unsafePlainText('secret'),
                                owner: 'aws',
                                repo: 'aws-cdk',
                            })],
                    },
                    {
                        stageName: 'Approve',
                        actions: [
                            new cpactions.ManualApprovalAction({
                                actionName: 'Approval',
                                additionalInformation: 'extra info',
                                externalEntityLink: 'external link',
                            }),
                        ],
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
                'Stages': [
                    {
                        'Name': 'Source',
                    },
                    {
                        'Name': 'Approve',
                        'Actions': [
                            {
                                'Name': 'Approval',
                                'Configuration': {
                                    'CustomData': 'extra info',
                                    'ExternalEntityLink': 'external link',
                                },
                            },
                        ],
                    },
                ],
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFudWFsLWFwcHJvdmFsLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYW51YWwtYXBwcm92YWwudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQywwREFBMEQ7QUFDMUQsd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4Qyx3Q0FBbUQ7QUFDbkQsb0NBQW9DO0FBRXBDLGdDQUFnQztBQUVoQyxRQUFRLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO0lBQy9CLFFBQVEsQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLEVBQUU7UUFDdEMsSUFBSSxDQUFDLGtEQUFrRCxFQUFFLEdBQUcsRUFBRTtZQUM1RCxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDNUMsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQztnQkFDOUQsVUFBVSxFQUFFLFNBQVM7Z0JBQ3JCLGlCQUFpQixFQUFFLEtBQUs7YUFDekIsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxRQUFRLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztZQUM5RCxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDeEQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBRXRDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUdoRSxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxxREFBcUQsRUFBRSxHQUFHLEVBQUU7WUFDL0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFL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RSxlQUFlOzZCQUNwQyxDQUFDO3lCQUNIO3FCQUNGO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1lBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsNkJBQTZCLEVBQUU7Z0JBQzdFLFFBQVEsRUFBRTtvQkFDUjt3QkFDRSxNQUFNLEVBQUUsUUFBUTtxQkFDakI7b0JBQ0Q7d0JBQ0UsTUFBTSxFQUFFLFNBQVM7d0JBQ2pCLFNBQVMsRUFBRTs0QkFDVDtnQ0FDRSxNQUFNLEVBQUUsVUFBVTtnQ0FDbEIsZUFBZSxFQUFFO29DQUNmLFlBQVksRUFBRSxZQUFZO29DQUMxQixvQkFBb0IsRUFBRSxlQUFlO2lDQUN0Qzs2QkFDRjt5QkFDRjtxQkFDRjtpQkFDRjthQUNGLENBQUMsQ0FBQztRQUdMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBzbnMgZnJvbSAnQGF3cy1jZGsvYXdzLXNucyc7XG5pbXBvcnQgeyBTZWNyZXRWYWx1ZSwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNwYWN0aW9ucyBmcm9tICcuLi9saWInO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBxdW90ZS1wcm9wcyAqL1xuXG5kZXNjcmliZSgnbWFudWFsIGFwcHJvdmFsJywgKCkgPT4ge1xuICBkZXNjcmliZSgnbWFudWFsIGFwcHJvdmFsIEFjdGlvbicsICgpID0+IHtcbiAgICB0ZXN0KCdhbGxvd3MgcGFzc2luZyBhbiBTTlMgVG9waWMgd2hlbiBjb25zdHJ1Y3RpbmcgaXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgdG9waWMgPSBuZXcgc25zLlRvcGljKHN0YWNrLCAnVG9waWMnKTtcbiAgICAgIGNvbnN0IG1hbnVhbEFwcHJvdmFsQWN0aW9uID0gbmV3IGNwYWN0aW9ucy5NYW51YWxBcHByb3ZhbEFjdGlvbih7XG4gICAgICAgIGFjdGlvbk5hbWU6ICdBcHByb3ZlJyxcbiAgICAgICAgbm90aWZpY2F0aW9uVG9waWM6IHRvcGljLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdwaXBlbGluZScpO1xuICAgICAgY29uc3Qgc3RhZ2UgPSBwaXBlbGluZS5hZGRTdGFnZSh7IHN0YWdlTmFtZTogJ3N0YWdlJyB9KTtcbiAgICAgIHN0YWdlLmFkZEFjdGlvbihtYW51YWxBcHByb3ZhbEFjdGlvbik7XG5cbiAgICAgIGV4cGVjdChtYW51YWxBcHByb3ZhbEFjdGlvbi5ub3RpZmljYXRpb25Ub3BpYykudG9FcXVhbCh0b3BpYyk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnYWxsb3dzIGdyYW50aW5nIG1hbnVhbCBhcHByb3ZhbCBwZXJtaXNzaW9ucyB0byByb2xlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdIdW1hbicsIHsgYXNzdW1lZEJ5OiBuZXcgaWFtLkFueVByaW5jaXBhbCgpIH0pO1xuICAgICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAncGlwZWxpbmUnKTtcbiAgICAgIHBpcGVsaW5lLmFkZFN0YWdlKHtcbiAgICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgICAgYWN0aW9uczogW25ldyBjcGFjdGlvbnMuR2l0SHViU291cmNlQWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25OYW1lOiAnU291cmNlJyxcbiAgICAgICAgICBvdXRwdXQ6IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKSxcbiAgICAgICAgICBvYXV0aFRva2VuOiBTZWNyZXRWYWx1ZS51bnNhZmVQbGFpblRleHQoJ3NlY3JldCcpLFxuICAgICAgICAgIG93bmVyOiAnYXdzJyxcbiAgICAgICAgICByZXBvOiAnYXdzLWNkaycsXG4gICAgICAgIH0pXSxcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgc3RhZ2UgPSBwaXBlbGluZS5hZGRTdGFnZSh7IHN0YWdlTmFtZTogJ3N0YWdlJyB9KTtcblxuICAgICAgY29uc3QgbWFudWFsQXBwcm92YWxBY3Rpb24gPSBuZXcgY3BhY3Rpb25zLk1hbnVhbEFwcHJvdmFsQWN0aW9uKHtcbiAgICAgICAgYWN0aW9uTmFtZTogJ0FwcHJvdmUnLFxuICAgICAgfSk7XG4gICAgICBzdGFnZS5hZGRBY3Rpb24obWFudWFsQXBwcm92YWxBY3Rpb24pO1xuXG4gICAgICBtYW51YWxBcHByb3ZhbEFjdGlvbi5ncmFudE1hbnVhbEFwcHJvdmFsKHJvbGUpO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdBY3Rpb24nOiAnY29kZXBpcGVsaW5lOkxpc3RQaXBlbGluZXMnLFxuICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgJ1Jlc291cmNlJzogJyonLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgICAnY29kZXBpcGVsaW5lOkdldFBpcGVsaW5lJyxcbiAgICAgICAgICAgICAgICAnY29kZXBpcGVsaW5lOkdldFBpcGVsaW5lU3RhdGUnLFxuICAgICAgICAgICAgICAgICdjb2RlcGlwZWxpbmU6R2V0UGlwZWxpbmVFeGVjdXRpb24nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgJ1Jlc291cmNlJzoge1xuICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICAgIHsgJ1JlZic6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgICAgICAgJzpjb2RlcGlwZWxpbmU6JyxcbiAgICAgICAgICAgICAgICAgICAgeyAnUmVmJzogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICAgIHsgJ1JlZic6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgICB7ICdSZWYnOiAncGlwZWxpbmVEQkVDQUU0OScgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdBY3Rpb24nOiAnY29kZXBpcGVsaW5lOlB1dEFwcHJvdmFsUmVzdWx0JyxcbiAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICdSZXNvdXJjZSc6IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICB7ICdSZWYnOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAgICAgICAgICc6Y29kZXBpcGVsaW5lOicsXG4gICAgICAgICAgICAgICAgICAgIHsgJ1JlZic6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgICB7ICdSZWYnOiAnQVdTOjpBY2NvdW50SWQnIH0sXG4gICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAgeyAnUmVmJzogJ3BpcGVsaW5lREJFQ0FFNDknIH0sXG4gICAgICAgICAgICAgICAgICAgICcvc3RhZ2UvQXBwcm92ZScsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIH0sXG4gICAgICAgICdQb2xpY3lOYW1lJzogJ0h1bWFuRGVmYXVsdFBvbGljeTQ5MzQ2RDUzJyxcbiAgICAgICAgJ1JvbGVzJzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdSZWYnOiAnSHVtYW5EMzM3Qzg0QycsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3JlamVjdHMgZ3JhbnRpbmcgbWFudWFsIGFwcHJvdmFsIHBlcm1pc3Npb25zIGJlZm9yZSBiaW5kaW5nIGFjdGlvbiB0byBzdGFnZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnSHVtYW4nLCB7IGFzc3VtZWRCeTogbmV3IGlhbS5BbnlQcmluY2lwYWwoKSB9KTtcbiAgICAgIGNvbnN0IG1hbnVhbEFwcHJvdmFsQWN0aW9uID0gbmV3IGNwYWN0aW9ucy5NYW51YWxBcHByb3ZhbEFjdGlvbih7XG4gICAgICAgIGFjdGlvbk5hbWU6ICdBcHByb3ZlJyxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBtYW51YWxBcHByb3ZhbEFjdGlvbi5ncmFudE1hbnVhbEFwcHJvdmFsKHJvbGUpO1xuICAgICAgfSkudG9UaHJvdygnQ2Fubm90IGdyYW50IHBlcm1pc3Npb25zIGJlZm9yZSBiaW5kaW5nIGFjdGlvbiB0byBhIHN0YWdlJyk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgncmVuZGVycyBDdXN0b21EYXRhIGFuZCBFeHRlcm5hbEVudGl0eUxpbmsgZXZlbiBpZiBub3RpZmljYXRpb25Ub3BpYyB3YXMgbm90IHBhc3NlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAncGlwZWxpbmUnLCB7XG4gICAgICAgIHN0YWdlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gICAgICAgICAgICBhY3Rpb25zOiBbbmV3IGNwYWN0aW9ucy5HaXRIdWJTb3VyY2VBY3Rpb24oe1xuICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnU291cmNlJyxcbiAgICAgICAgICAgICAgb3V0cHV0OiBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCksXG4gICAgICAgICAgICAgIG9hdXRoVG9rZW46IFNlY3JldFZhbHVlLnVuc2FmZVBsYWluVGV4dCgnc2VjcmV0JyksXG4gICAgICAgICAgICAgIG93bmVyOiAnYXdzJyxcbiAgICAgICAgICAgICAgcmVwbzogJ2F3cy1jZGsnLFxuICAgICAgICAgICAgfSldLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhZ2VOYW1lOiAnQXBwcm92ZScsXG4gICAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICAgIG5ldyBjcGFjdGlvbnMuTWFudWFsQXBwcm92YWxBY3Rpb24oe1xuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdBcHByb3ZhbCcsXG4gICAgICAgICAgICAgICAgYWRkaXRpb25hbEluZm9ybWF0aW9uOiAnZXh0cmEgaW5mbycsXG4gICAgICAgICAgICAgICAgZXh0ZXJuYWxFbnRpdHlMaW5rOiAnZXh0ZXJuYWwgbGluaycsXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCB7XG4gICAgICAgICdTdGFnZXMnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ05hbWUnOiAnU291cmNlJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdOYW1lJzogJ0FwcHJvdmUnLFxuICAgICAgICAgICAgJ0FjdGlvbnMnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnTmFtZSc6ICdBcHByb3ZhbCcsXG4gICAgICAgICAgICAgICAgJ0NvbmZpZ3VyYXRpb24nOiB7XG4gICAgICAgICAgICAgICAgICAnQ3VzdG9tRGF0YSc6ICdleHRyYSBpbmZvJyxcbiAgICAgICAgICAgICAgICAgICdFeHRlcm5hbEVudGl0eUxpbmsnOiAnZXh0ZXJuYWwgbGluaycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==