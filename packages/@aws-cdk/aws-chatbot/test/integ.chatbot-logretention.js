"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iam = require("@aws-cdk/aws-iam");
const logs = require("@aws-cdk/aws-logs");
const cdk = require("@aws-cdk/core");
const chatbot = require("../lib");
class ChatbotLogRetentionInteg extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const slackChannel = new chatbot.SlackChannelConfiguration(this, 'MySlackChannel', {
            slackChannelConfigurationName: 'test-channel',
            slackWorkspaceId: 'T49239U4W',
            slackChannelId: 'C0187JABUE9',
            loggingLevel: chatbot.LoggingLevel.NONE,
            logRetention: logs.RetentionDays.ONE_MONTH,
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
new ChatbotLogRetentionInteg(app, 'ChatbotLogRetentionInteg');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY2hhdGJvdC1sb2dyZXRlbnRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5jaGF0Ym90LWxvZ3JldGVudGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdDQUF3QztBQUN4QywwQ0FBMEM7QUFDMUMscUNBQXFDO0FBQ3JDLGtDQUFrQztBQUVsQyxNQUFNLHdCQUF5QixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzlDLFlBQVksS0FBYyxFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM1RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLFlBQVksR0FBRyxJQUFJLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDakYsNkJBQTZCLEVBQUUsY0FBYztZQUM3QyxnQkFBZ0IsRUFBRSxXQUFXO1lBQzdCLGNBQWMsRUFBRSxhQUFhO1lBQzdCLFlBQVksRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUk7WUFDdkMsWUFBWSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUztTQUMzQyxDQUFDLENBQUM7UUFFSCxZQUFZLENBQUMsZUFBZSxDQUFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUNuRCxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLO1lBQ3hCLE9BQU8sRUFBRTtnQkFDUCxjQUFjO2FBQ2Y7WUFDRCxTQUFTLEVBQUUsQ0FBQyw4QkFBOEIsQ0FBQztTQUM1QyxDQUFDLENBQUMsQ0FBQztLQUNMO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixJQUFJLHdCQUF3QixDQUFDLEdBQUcsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO0FBRTlELEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGxvZ3MgZnJvbSAnQGF3cy1jZGsvYXdzLWxvZ3MnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY2hhdGJvdCBmcm9tICcuLi9saWInO1xuXG5jbGFzcyBDaGF0Ym90TG9nUmV0ZW50aW9uSW50ZWcgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3Qgc2xhY2tDaGFubmVsID0gbmV3IGNoYXRib3QuU2xhY2tDaGFubmVsQ29uZmlndXJhdGlvbih0aGlzLCAnTXlTbGFja0NoYW5uZWwnLCB7XG4gICAgICBzbGFja0NoYW5uZWxDb25maWd1cmF0aW9uTmFtZTogJ3Rlc3QtY2hhbm5lbCcsXG4gICAgICBzbGFja1dvcmtzcGFjZUlkOiAnVDQ5MjM5VTRXJywgLy8gbW9kaWZ5IHRvIHlvdXIgc2xhY2sgd29ya3NwYWNlIGlkXG4gICAgICBzbGFja0NoYW5uZWxJZDogJ0MwMTg3SkFCVUU5JywgLy8gbW9kaWZ5IHRvIHlvdXIgc2xhY2sgY2hhbm5lbCBpZFxuICAgICAgbG9nZ2luZ0xldmVsOiBjaGF0Ym90LkxvZ2dpbmdMZXZlbC5OT05FLFxuICAgICAgbG9nUmV0ZW50aW9uOiBsb2dzLlJldGVudGlvbkRheXMuT05FX01PTlRILFxuICAgIH0pO1xuXG4gICAgc2xhY2tDaGFubmVsLmFkZFRvUm9sZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgICdzMzpHZXRPYmplY3QnLFxuICAgICAgXSxcbiAgICAgIHJlc291cmNlczogWydhcm46YXdzOnMzOjo6YWJjL3h5ei8xMjMudHh0J10sXG4gICAgfSkpO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbm5ldyBDaGF0Ym90TG9nUmV0ZW50aW9uSW50ZWcoYXBwLCAnQ2hhdGJvdExvZ1JldGVudGlvbkludGVnJyk7XG5cbmFwcC5zeW50aCgpO1xuIl19