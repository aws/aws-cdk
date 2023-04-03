"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const sns = require("@aws-cdk/aws-sns");
const cdk = require("@aws-cdk/core");
const codecommit = require("../lib");
describe('notification rule', () => {
    test('CodeCommit Repositories - can create notification rule', () => {
        const stack = new cdk.Stack();
        const repository = new codecommit.Repository(stack, 'MyCodecommitRepository', {
            repositoryName: 'my-test-repository',
        });
        const target = new sns.Topic(stack, 'MyTopic');
        repository.notifyOnPullRequestCreated('NotifyOnPullRequestCreated', target);
        repository.notifyOnPullRequestMerged('NotifyOnPullRequestMerged', target);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeStarNotifications::NotificationRule', {
            Name: 'MyCodecommitRepositoryNotifyOnPullRequestCreatedBB14EA32',
            DetailType: 'FULL',
            EventTypeIds: [
                'codecommit-repository-pull-request-created',
            ],
            Resource: {
                'Fn::GetAtt': [
                    'MyCodecommitRepository26DB372B',
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
            Name: 'MyCodecommitRepositoryNotifyOnPullRequestMerged34A7EDF1',
            DetailType: 'FULL',
            EventTypeIds: [
                'codecommit-repository-pull-request-merged',
            ],
            Resource: {
                'Fn::GetAtt': [
                    'MyCodecommitRepository26DB372B',
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpY2F0aW9uLXJ1bGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5vdGlmaWNhdGlvbi1ydWxlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0Msd0NBQXdDO0FBQ3hDLHFDQUFxQztBQUNyQyxxQ0FBcUM7QUFFckMsUUFBUSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtJQUNqQyxJQUFJLENBQUMsd0RBQXdELEVBQUUsR0FBRyxFQUFFO1FBQ2xFLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzlCLE1BQU0sVUFBVSxHQUFHLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsd0JBQXdCLEVBQUU7WUFDNUUsY0FBYyxFQUFFLG9CQUFvQjtTQUNyQyxDQUFDLENBQUM7UUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRS9DLFVBQVUsQ0FBQywwQkFBMEIsQ0FBQyw0QkFBNEIsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUU1RSxVQUFVLENBQUMseUJBQXlCLENBQUMsMkJBQTJCLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFMUUscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsOENBQThDLEVBQUU7WUFDOUYsSUFBSSxFQUFFLDBEQUEwRDtZQUNoRSxVQUFVLEVBQUUsTUFBTTtZQUNsQixZQUFZLEVBQUU7Z0JBQ1osNENBQTRDO2FBQzdDO1lBQ0QsUUFBUSxFQUFFO2dCQUNSLFlBQVksRUFBRTtvQkFDWixnQ0FBZ0M7b0JBQ2hDLEtBQUs7aUJBQ047YUFDRjtZQUNELE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxhQUFhLEVBQUU7d0JBQ2IsR0FBRyxFQUFFLGlCQUFpQjtxQkFDdkI7b0JBQ0QsVUFBVSxFQUFFLEtBQUs7aUJBQ2xCO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyw4Q0FBOEMsRUFBRTtZQUM5RixJQUFJLEVBQUUseURBQXlEO1lBQy9ELFVBQVUsRUFBRSxNQUFNO1lBQ2xCLFlBQVksRUFBRTtnQkFDWiwyQ0FBMkM7YUFDNUM7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsWUFBWSxFQUFFO29CQUNaLGdDQUFnQztvQkFDaEMsS0FBSztpQkFDTjthQUNGO1lBQ0QsT0FBTyxFQUFFO2dCQUNQO29CQUNFLGFBQWEsRUFBRTt3QkFDYixHQUFHLEVBQUUsaUJBQWlCO3FCQUN2QjtvQkFDRCxVQUFVLEVBQUUsS0FBSztpQkFDbEI7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUdMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgc25zIGZyb20gJ0Bhd3MtY2RrL2F3cy1zbnMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY29kZWNvbW1pdCBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgnbm90aWZpY2F0aW9uIHJ1bGUnLCAoKSA9PiB7XG4gIHRlc3QoJ0NvZGVDb21taXQgUmVwb3NpdG9yaWVzIC0gY2FuIGNyZWF0ZSBub3RpZmljYXRpb24gcnVsZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCByZXBvc2l0b3J5ID0gbmV3IGNvZGVjb21taXQuUmVwb3NpdG9yeShzdGFjaywgJ015Q29kZWNvbW1pdFJlcG9zaXRvcnknLCB7XG4gICAgICByZXBvc2l0b3J5TmFtZTogJ215LXRlc3QtcmVwb3NpdG9yeScsXG4gICAgfSk7XG5cbiAgICBjb25zdCB0YXJnZXQgPSBuZXcgc25zLlRvcGljKHN0YWNrLCAnTXlUb3BpYycpO1xuXG4gICAgcmVwb3NpdG9yeS5ub3RpZnlPblB1bGxSZXF1ZXN0Q3JlYXRlZCgnTm90aWZ5T25QdWxsUmVxdWVzdENyZWF0ZWQnLCB0YXJnZXQpO1xuXG4gICAgcmVwb3NpdG9yeS5ub3RpZnlPblB1bGxSZXF1ZXN0TWVyZ2VkKCdOb3RpZnlPblB1bGxSZXF1ZXN0TWVyZ2VkJywgdGFyZ2V0KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVTdGFyTm90aWZpY2F0aW9uczo6Tm90aWZpY2F0aW9uUnVsZScsIHtcbiAgICAgIE5hbWU6ICdNeUNvZGVjb21taXRSZXBvc2l0b3J5Tm90aWZ5T25QdWxsUmVxdWVzdENyZWF0ZWRCQjE0RUEzMicsXG4gICAgICBEZXRhaWxUeXBlOiAnRlVMTCcsXG4gICAgICBFdmVudFR5cGVJZHM6IFtcbiAgICAgICAgJ2NvZGVjb21taXQtcmVwb3NpdG9yeS1wdWxsLXJlcXVlc3QtY3JlYXRlZCcsXG4gICAgICBdLFxuICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ015Q29kZWNvbW1pdFJlcG9zaXRvcnkyNkRCMzcyQicsXG4gICAgICAgICAgJ0FybicsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgVGFyZ2V0czogW1xuICAgICAgICB7XG4gICAgICAgICAgVGFyZ2V0QWRkcmVzczoge1xuICAgICAgICAgICAgUmVmOiAnTXlUb3BpYzg2ODY5NDM0JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFRhcmdldFR5cGU6ICdTTlMnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVTdGFyTm90aWZpY2F0aW9uczo6Tm90aWZpY2F0aW9uUnVsZScsIHtcbiAgICAgIE5hbWU6ICdNeUNvZGVjb21taXRSZXBvc2l0b3J5Tm90aWZ5T25QdWxsUmVxdWVzdE1lcmdlZDM0QTdFREYxJyxcbiAgICAgIERldGFpbFR5cGU6ICdGVUxMJyxcbiAgICAgIEV2ZW50VHlwZUlkczogW1xuICAgICAgICAnY29kZWNvbW1pdC1yZXBvc2l0b3J5LXB1bGwtcmVxdWVzdC1tZXJnZWQnLFxuICAgICAgXSxcbiAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdNeUNvZGVjb21taXRSZXBvc2l0b3J5MjZEQjM3MkInLFxuICAgICAgICAgICdBcm4nLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIFRhcmdldHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFRhcmdldEFkZHJlc3M6IHtcbiAgICAgICAgICAgIFJlZjogJ015VG9waWM4Njg2OTQzNCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBUYXJnZXRUeXBlOiAnU05TJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cblxuICB9KTtcbn0pOyJdfQ==