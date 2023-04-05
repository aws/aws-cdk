"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iam = require("aws-cdk-lib/aws-iam");
const cdk = require("aws-cdk-lib");
const chatbot = require("aws-cdk-lib/aws-chatbot");
class ChatbotInteg extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const slackChannel = new chatbot.SlackChannelConfiguration(this, 'MySlackChannel', {
            slackChannelConfigurationName: 'test-channel',
            slackWorkspaceId: 'T49239U4W',
            slackChannelId: 'C0187JABUE9',
            loggingLevel: chatbot.LoggingLevel.NONE,
        });
        slackChannel.addToRolePolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
                's3:GetObject',
            ],
            resources: ['arn:aws:s3:::abc/xyz/123.txt'],
        }));
    }
}
const app = new cdk.App();
new ChatbotInteg(app, 'ChatbotInteg');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY2hhdGJvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmNoYXRib3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBMkM7QUFDM0MsbUNBQW1DO0FBQ25DLG1EQUFtRDtBQUVuRCxNQUFNLFlBQWEsU0FBUSxHQUFHLENBQUMsS0FBSztJQUNsQyxZQUFZLEtBQWMsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDNUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxZQUFZLEdBQUcsSUFBSSxPQUFPLENBQUMseUJBQXlCLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQ2pGLDZCQUE2QixFQUFFLGNBQWM7WUFDN0MsZ0JBQWdCLEVBQUUsV0FBVztZQUM3QixjQUFjLEVBQUUsYUFBYTtZQUM3QixZQUFZLEVBQUUsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJO1NBQ3hDLENBQUMsQ0FBQztRQUVILFlBQVksQ0FBQyxlQUFlLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ25ELE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUs7WUFDeEIsT0FBTyxFQUFFO2dCQUNQLGNBQWM7YUFDZjtZQUNELFNBQVMsRUFBRSxDQUFDLDhCQUE4QixDQUFDO1NBQzVDLENBQUMsQ0FBQyxDQUFDO0lBQ04sQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsSUFBSSxZQUFZLENBQUMsR0FBRyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBRXRDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBjaGF0Ym90IGZyb20gJ2F3cy1jZGstbGliL2F3cy1jaGF0Ym90JztcblxuY2xhc3MgQ2hhdGJvdEludGVnIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHNsYWNrQ2hhbm5lbCA9IG5ldyBjaGF0Ym90LlNsYWNrQ2hhbm5lbENvbmZpZ3VyYXRpb24odGhpcywgJ015U2xhY2tDaGFubmVsJywge1xuICAgICAgc2xhY2tDaGFubmVsQ29uZmlndXJhdGlvbk5hbWU6ICd0ZXN0LWNoYW5uZWwnLFxuICAgICAgc2xhY2tXb3Jrc3BhY2VJZDogJ1Q0OTIzOVU0VycsIC8vIG1vZGlmeSB0byB5b3VyIHNsYWNrIHdvcmtzcGFjZSBpZFxuICAgICAgc2xhY2tDaGFubmVsSWQ6ICdDMDE4N0pBQlVFOScsIC8vIG1vZGlmeSB0byB5b3VyIHNsYWNrIGNoYW5uZWwgaWRcbiAgICAgIGxvZ2dpbmdMZXZlbDogY2hhdGJvdC5Mb2dnaW5nTGV2ZWwuTk9ORSxcbiAgICB9KTtcblxuICAgIHNsYWNrQ2hhbm5lbC5hZGRUb1JvbGVQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgYWN0aW9uczogW1xuICAgICAgICAnczM6R2V0T2JqZWN0JyxcbiAgICAgIF0sXG4gICAgICByZXNvdXJjZXM6IFsnYXJuOmF3czpzMzo6OmFiYy94eXovMTIzLnR4dCddLFxuICAgIH0pKTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5uZXcgQ2hhdGJvdEludGVnKGFwcCwgJ0NoYXRib3RJbnRlZycpO1xuXG5hcHAuc3ludGgoKTtcblxuIl19