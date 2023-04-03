"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const sns = require("@aws-cdk/aws-sns");
const cdk = require("@aws-cdk/core");
const codebuild = require("../lib");
test('notifications rule', () => {
    const stack = new cdk.Stack();
    const project = new codebuild.Project(stack, 'MyCodebuildProject', {
        buildSpec: codebuild.BuildSpec.fromObject({
            version: '0.2',
            phases: {
                build: {
                    commands: [
                        'echo "Hello, CodeBuild!"',
                    ],
                },
            },
        }),
    });
    const target = new sns.Topic(stack, 'MyTopic');
    project.notifyOnBuildSucceeded('NotifyOnBuildSucceeded', target);
    project.notifyOnBuildFailed('NotifyOnBuildFailed', target);
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeStarNotifications::NotificationRule', {
        Name: 'MyCodebuildProjectNotifyOnBuildSucceeded77719592',
        DetailType: 'FULL',
        EventTypeIds: [
            'codebuild-project-build-state-succeeded',
        ],
        Resource: {
            'Fn::GetAtt': [
                'MyCodebuildProjectB0479580',
                'Arn',
            ],
        },
        Targets: [
            {
                TargetAddress: {
                    Ref: 'MyTopic86869434',
                },
                TargetType: 'SNS',
            },
        ],
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeStarNotifications::NotificationRule', {
        Name: 'MyCodebuildProjectNotifyOnBuildFailedF680E310',
        DetailType: 'FULL',
        EventTypeIds: [
            'codebuild-project-build-state-failed',
        ],
        Resource: {
            'Fn::GetAtt': [
                'MyCodebuildProjectB0479580',
                'Arn',
            ],
        },
        Targets: [
            {
                TargetAddress: {
                    Ref: 'MyTopic86869434',
                },
                TargetType: 'SNS',
            },
        ],
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpY2F0aW9uLXJ1bGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5vdGlmaWNhdGlvbi1ydWxlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0Msd0NBQXdDO0FBQ3hDLHFDQUFxQztBQUNyQyxvQ0FBb0M7QUFFcEMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRTtJQUM5QixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUM5QixNQUFNLE9BQU8sR0FBRyxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLG9CQUFvQixFQUFFO1FBQ2pFLFNBQVMsRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztZQUN4QyxPQUFPLEVBQUUsS0FBSztZQUNkLE1BQU0sRUFBRTtnQkFDTixLQUFLLEVBQUU7b0JBQ0wsUUFBUSxFQUFFO3dCQUNSLDBCQUEwQjtxQkFDM0I7aUJBQ0Y7YUFDRjtTQUNGLENBQUM7S0FDSCxDQUFDLENBQUM7SUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBRS9DLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyx3QkFBd0IsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUVqRSxPQUFPLENBQUMsbUJBQW1CLENBQUMscUJBQXFCLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFFM0QscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsOENBQThDLEVBQUU7UUFDOUYsSUFBSSxFQUFFLGtEQUFrRDtRQUN4RCxVQUFVLEVBQUUsTUFBTTtRQUNsQixZQUFZLEVBQUU7WUFDWix5Q0FBeUM7U0FDMUM7UUFDRCxRQUFRLEVBQUU7WUFDUixZQUFZLEVBQUU7Z0JBQ1osNEJBQTRCO2dCQUM1QixLQUFLO2FBQ047U0FDRjtRQUNELE9BQU8sRUFBRTtZQUNQO2dCQUNFLGFBQWEsRUFBRTtvQkFDYixHQUFHLEVBQUUsaUJBQWlCO2lCQUN2QjtnQkFDRCxVQUFVLEVBQUUsS0FBSzthQUNsQjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0lBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsOENBQThDLEVBQUU7UUFDOUYsSUFBSSxFQUFFLCtDQUErQztRQUNyRCxVQUFVLEVBQUUsTUFBTTtRQUNsQixZQUFZLEVBQUU7WUFDWixzQ0FBc0M7U0FDdkM7UUFDRCxRQUFRLEVBQUU7WUFDUixZQUFZLEVBQUU7Z0JBQ1osNEJBQTRCO2dCQUM1QixLQUFLO2FBQ047U0FDRjtRQUNELE9BQU8sRUFBRTtZQUNQO2dCQUNFLGFBQWEsRUFBRTtvQkFDYixHQUFHLEVBQUUsaUJBQWlCO2lCQUN2QjtnQkFDRCxVQUFVLEVBQUUsS0FBSzthQUNsQjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgc25zIGZyb20gJ0Bhd3MtY2RrL2F3cy1zbnMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJy4uL2xpYic7XG5cbnRlc3QoJ25vdGlmaWNhdGlvbnMgcnVsZScsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IHByb2plY3QgPSBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdNeUNvZGVidWlsZFByb2plY3QnLCB7XG4gICAgYnVpbGRTcGVjOiBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3Qoe1xuICAgICAgdmVyc2lvbjogJzAuMicsXG4gICAgICBwaGFzZXM6IHtcbiAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICBjb21tYW5kczogW1xuICAgICAgICAgICAgJ2VjaG8gXCJIZWxsbywgQ29kZUJ1aWxkIVwiJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KSxcbiAgfSk7XG5cbiAgY29uc3QgdGFyZ2V0ID0gbmV3IHNucy5Ub3BpYyhzdGFjaywgJ015VG9waWMnKTtcblxuICBwcm9qZWN0Lm5vdGlmeU9uQnVpbGRTdWNjZWVkZWQoJ05vdGlmeU9uQnVpbGRTdWNjZWVkZWQnLCB0YXJnZXQpO1xuXG4gIHByb2plY3Qubm90aWZ5T25CdWlsZEZhaWxlZCgnTm90aWZ5T25CdWlsZEZhaWxlZCcsIHRhcmdldCk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVN0YXJOb3RpZmljYXRpb25zOjpOb3RpZmljYXRpb25SdWxlJywge1xuICAgIE5hbWU6ICdNeUNvZGVidWlsZFByb2plY3ROb3RpZnlPbkJ1aWxkU3VjY2VlZGVkNzc3MTk1OTInLFxuICAgIERldGFpbFR5cGU6ICdGVUxMJyxcbiAgICBFdmVudFR5cGVJZHM6IFtcbiAgICAgICdjb2RlYnVpbGQtcHJvamVjdC1idWlsZC1zdGF0ZS1zdWNjZWVkZWQnLFxuICAgIF0sXG4gICAgUmVzb3VyY2U6IHtcbiAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAnTXlDb2RlYnVpbGRQcm9qZWN0QjA0Nzk1ODAnLFxuICAgICAgICAnQXJuJyxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBUYXJnZXRzOiBbXG4gICAgICB7XG4gICAgICAgIFRhcmdldEFkZHJlc3M6IHtcbiAgICAgICAgICBSZWY6ICdNeVRvcGljODY4Njk0MzQnLFxuICAgICAgICB9LFxuICAgICAgICBUYXJnZXRUeXBlOiAnU05TJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVN0YXJOb3RpZmljYXRpb25zOjpOb3RpZmljYXRpb25SdWxlJywge1xuICAgIE5hbWU6ICdNeUNvZGVidWlsZFByb2plY3ROb3RpZnlPbkJ1aWxkRmFpbGVkRjY4MEUzMTAnLFxuICAgIERldGFpbFR5cGU6ICdGVUxMJyxcbiAgICBFdmVudFR5cGVJZHM6IFtcbiAgICAgICdjb2RlYnVpbGQtcHJvamVjdC1idWlsZC1zdGF0ZS1mYWlsZWQnLFxuICAgIF0sXG4gICAgUmVzb3VyY2U6IHtcbiAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAnTXlDb2RlYnVpbGRQcm9qZWN0QjA0Nzk1ODAnLFxuICAgICAgICAnQXJuJyxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBUYXJnZXRzOiBbXG4gICAgICB7XG4gICAgICAgIFRhcmdldEFkZHJlc3M6IHtcbiAgICAgICAgICBSZWY6ICdNeVRvcGljODY4Njk0MzQnLFxuICAgICAgICB9LFxuICAgICAgICBUYXJnZXRUeXBlOiAnU05TJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG59KTtcbiJdfQ==