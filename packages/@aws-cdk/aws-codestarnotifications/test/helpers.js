"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeSlackTarget = exports.FakeSnsTopicTarget = exports.FakeCodeCommit = exports.FakeCodePipeline = exports.FakeCodeBuild = void 0;
class FakeCodeBuild {
    constructor() {
        this.projectArn = 'arn:aws:codebuild::1234567890:project/MyCodebuildProject';
        this.projectName = 'test-project';
    }
    bindAsNotificationRuleSource() {
        return {
            sourceArn: this.projectArn,
        };
    }
}
exports.FakeCodeBuild = FakeCodeBuild;
class FakeCodePipeline {
    constructor() {
        this.pipelineArn = 'arn:aws:codepipeline::1234567890:MyCodepipelineProject';
        this.pipelineName = 'test-pipeline';
    }
    bindAsNotificationRuleSource() {
        return {
            sourceArn: this.pipelineArn,
        };
    }
}
exports.FakeCodePipeline = FakeCodePipeline;
class FakeCodeCommit {
    constructor() {
        this.repositoryArn = 'arn:aws:codecommit::1234567890:MyCodecommitProject';
        this.repositoryName = 'test-repository';
    }
    bindAsNotificationRuleSource() {
        return {
            sourceArn: this.repositoryArn,
        };
    }
}
exports.FakeCodeCommit = FakeCodeCommit;
class FakeSnsTopicTarget {
    constructor() {
        this.topicArn = 'arn:aws:sns::1234567890:MyTopic';
    }
    bindAsNotificationRuleTarget() {
        return {
            targetType: 'SNS',
            targetAddress: this.topicArn,
        };
    }
}
exports.FakeSnsTopicTarget = FakeSnsTopicTarget;
class FakeSlackTarget {
    constructor() {
        this.slackChannelConfigurationArn = 'arn:aws:chatbot::1234567890:chat-configuration/slack-channel/MySlackChannel';
    }
    bindAsNotificationRuleTarget() {
        return {
            targetType: 'AWSChatbotSlack',
            targetAddress: this.slackChannelConfigurationArn,
        };
    }
}
exports.FakeSlackTarget = FakeSlackTarget;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsTUFBYSxhQUFhO0lBQTFCO1FBQ1csZUFBVSxHQUFHLDBEQUEwRCxDQUFDO1FBQ3hFLGdCQUFXLEdBQUcsY0FBYyxDQUFDO0lBT3hDLENBQUM7SUFMQyw0QkFBNEI7UUFDMUIsT0FBTztZQUNMLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVTtTQUMzQixDQUFDO0tBQ0g7Q0FDRjtBQVRELHNDQVNDO0FBRUQsTUFBYSxnQkFBZ0I7SUFBN0I7UUFDVyxnQkFBVyxHQUFHLHdEQUF3RCxDQUFDO1FBQ3ZFLGlCQUFZLEdBQUcsZUFBZSxDQUFDO0lBTzFDLENBQUM7SUFMQyw0QkFBNEI7UUFDMUIsT0FBTztZQUNMLFNBQVMsRUFBRSxJQUFJLENBQUMsV0FBVztTQUM1QixDQUFDO0tBQ0g7Q0FDRjtBQVRELDRDQVNDO0FBRUQsTUFBYSxjQUFjO0lBQTNCO1FBQ1csa0JBQWEsR0FBRyxvREFBb0QsQ0FBQztRQUNyRSxtQkFBYyxHQUFHLGlCQUFpQixDQUFDO0lBTzlDLENBQUM7SUFMQyw0QkFBNEI7UUFDMUIsT0FBTztZQUNMLFNBQVMsRUFBRSxJQUFJLENBQUMsYUFBYTtTQUM5QixDQUFDO0tBQ0g7Q0FDRjtBQVRELHdDQVNDO0FBRUQsTUFBYSxrQkFBa0I7SUFBL0I7UUFDVyxhQUFRLEdBQUcsaUNBQWlDLENBQUM7SUFReEQsQ0FBQztJQU5DLDRCQUE0QjtRQUMxQixPQUFPO1lBQ0wsVUFBVSxFQUFFLEtBQUs7WUFDakIsYUFBYSxFQUFFLElBQUksQ0FBQyxRQUFRO1NBQzdCLENBQUM7S0FDSDtDQUNGO0FBVEQsZ0RBU0M7QUFFRCxNQUFhLGVBQWU7SUFBNUI7UUFDVyxpQ0FBNEIsR0FBRyw2RUFBNkUsQ0FBQztJQVF4SCxDQUFDO0lBTkMsNEJBQTRCO1FBQzFCLE9BQU87WUFDTCxVQUFVLEVBQUUsaUJBQWlCO1lBQzdCLGFBQWEsRUFBRSxJQUFJLENBQUMsNEJBQTRCO1NBQ2pELENBQUM7S0FDSDtDQUNGO0FBVEQsMENBU0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBub3RpZmljYXRpb25zIGZyb20gJy4uL2xpYic7XG5cbmV4cG9ydCBjbGFzcyBGYWtlQ29kZUJ1aWxkIGltcGxlbWVudHMgbm90aWZpY2F0aW9ucy5JTm90aWZpY2F0aW9uUnVsZVNvdXJjZSB7XG4gIHJlYWRvbmx5IHByb2plY3RBcm4gPSAnYXJuOmF3czpjb2RlYnVpbGQ6OjEyMzQ1Njc4OTA6cHJvamVjdC9NeUNvZGVidWlsZFByb2plY3QnO1xuICByZWFkb25seSBwcm9qZWN0TmFtZSA9ICd0ZXN0LXByb2plY3QnO1xuXG4gIGJpbmRBc05vdGlmaWNhdGlvblJ1bGVTb3VyY2UoKTogbm90aWZpY2F0aW9ucy5Ob3RpZmljYXRpb25SdWxlU291cmNlQ29uZmlnIHtcbiAgICByZXR1cm4ge1xuICAgICAgc291cmNlQXJuOiB0aGlzLnByb2plY3RBcm4sXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRmFrZUNvZGVQaXBlbGluZSBpbXBsZW1lbnRzIG5vdGlmaWNhdGlvbnMuSU5vdGlmaWNhdGlvblJ1bGVTb3VyY2Uge1xuICByZWFkb25seSBwaXBlbGluZUFybiA9ICdhcm46YXdzOmNvZGVwaXBlbGluZTo6MTIzNDU2Nzg5MDpNeUNvZGVwaXBlbGluZVByb2plY3QnO1xuICByZWFkb25seSBwaXBlbGluZU5hbWUgPSAndGVzdC1waXBlbGluZSc7XG5cbiAgYmluZEFzTm90aWZpY2F0aW9uUnVsZVNvdXJjZSgpOiBub3RpZmljYXRpb25zLk5vdGlmaWNhdGlvblJ1bGVTb3VyY2VDb25maWcge1xuICAgIHJldHVybiB7XG4gICAgICBzb3VyY2VBcm46IHRoaXMucGlwZWxpbmVBcm4sXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRmFrZUNvZGVDb21taXQgaW1wbGVtZW50cyBub3RpZmljYXRpb25zLklOb3RpZmljYXRpb25SdWxlU291cmNlIHtcbiAgcmVhZG9ubHkgcmVwb3NpdG9yeUFybiA9ICdhcm46YXdzOmNvZGVjb21taXQ6OjEyMzQ1Njc4OTA6TXlDb2RlY29tbWl0UHJvamVjdCc7XG4gIHJlYWRvbmx5IHJlcG9zaXRvcnlOYW1lID0gJ3Rlc3QtcmVwb3NpdG9yeSc7XG5cbiAgYmluZEFzTm90aWZpY2F0aW9uUnVsZVNvdXJjZSgpOiBub3RpZmljYXRpb25zLk5vdGlmaWNhdGlvblJ1bGVTb3VyY2VDb25maWcge1xuICAgIHJldHVybiB7XG4gICAgICBzb3VyY2VBcm46IHRoaXMucmVwb3NpdG9yeUFybixcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBGYWtlU25zVG9waWNUYXJnZXQgaW1wbGVtZW50cyBub3RpZmljYXRpb25zLklOb3RpZmljYXRpb25SdWxlVGFyZ2V0IHtcbiAgcmVhZG9ubHkgdG9waWNBcm4gPSAnYXJuOmF3czpzbnM6OjEyMzQ1Njc4OTA6TXlUb3BpYyc7XG5cbiAgYmluZEFzTm90aWZpY2F0aW9uUnVsZVRhcmdldCgpOiBub3RpZmljYXRpb25zLk5vdGlmaWNhdGlvblJ1bGVUYXJnZXRDb25maWcge1xuICAgIHJldHVybiB7XG4gICAgICB0YXJnZXRUeXBlOiAnU05TJyxcbiAgICAgIHRhcmdldEFkZHJlc3M6IHRoaXMudG9waWNBcm4sXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRmFrZVNsYWNrVGFyZ2V0IGltcGxlbWVudHMgbm90aWZpY2F0aW9ucy5JTm90aWZpY2F0aW9uUnVsZVRhcmdldCB7XG4gIHJlYWRvbmx5IHNsYWNrQ2hhbm5lbENvbmZpZ3VyYXRpb25Bcm4gPSAnYXJuOmF3czpjaGF0Ym90OjoxMjM0NTY3ODkwOmNoYXQtY29uZmlndXJhdGlvbi9zbGFjay1jaGFubmVsL015U2xhY2tDaGFubmVsJztcblxuICBiaW5kQXNOb3RpZmljYXRpb25SdWxlVGFyZ2V0KCk6IG5vdGlmaWNhdGlvbnMuTm90aWZpY2F0aW9uUnVsZVRhcmdldENvbmZpZyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRhcmdldFR5cGU6ICdBV1NDaGF0Ym90U2xhY2snLFxuICAgICAgdGFyZ2V0QWRkcmVzczogdGhpcy5zbGFja0NoYW5uZWxDb25maWd1cmF0aW9uQXJuLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==