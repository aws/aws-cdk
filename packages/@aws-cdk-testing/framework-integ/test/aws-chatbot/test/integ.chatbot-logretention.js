"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iam = require("aws-cdk-lib/aws-iam");
const logs = require("aws-cdk-lib/aws-logs");
const cdk = require("aws-cdk-lib");
const chatbot = require("aws-cdk-lib/aws-chatbot");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY2hhdGJvdC1sb2dyZXRlbnRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5jaGF0Ym90LWxvZ3JldGVudGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUEyQztBQUMzQyw2Q0FBNkM7QUFDN0MsbUNBQW1DO0FBQ25DLG1EQUFtRDtBQUVuRCxNQUFNLHdCQUF5QixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzlDLFlBQVksS0FBYyxFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM1RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLFlBQVksR0FBRyxJQUFJLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDakYsNkJBQTZCLEVBQUUsY0FBYztZQUM3QyxnQkFBZ0IsRUFBRSxXQUFXO1lBQzdCLGNBQWMsRUFBRSxhQUFhO1lBQzdCLFlBQVksRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUk7WUFDdkMsWUFBWSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUztTQUMzQyxDQUFDLENBQUM7UUFFSCxZQUFZLENBQUMsZUFBZSxDQUFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUNuRCxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLO1lBQ3hCLE9BQU8sRUFBRTtnQkFDUCxjQUFjO2FBQ2Y7WUFDRCxTQUFTLEVBQUUsQ0FBQyw4QkFBOEIsQ0FBQztTQUM1QyxDQUFDLENBQUMsQ0FBQztJQUNOLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLElBQUksd0JBQXdCLENBQUMsR0FBRyxFQUFFLDBCQUEwQixDQUFDLENBQUM7QUFFOUQsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgbG9ncyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbG9ncyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgY2hhdGJvdCBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY2hhdGJvdCc7XG5cbmNsYXNzIENoYXRib3RMb2dSZXRlbnRpb25JbnRlZyBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBzbGFja0NoYW5uZWwgPSBuZXcgY2hhdGJvdC5TbGFja0NoYW5uZWxDb25maWd1cmF0aW9uKHRoaXMsICdNeVNsYWNrQ2hhbm5lbCcsIHtcbiAgICAgIHNsYWNrQ2hhbm5lbENvbmZpZ3VyYXRpb25OYW1lOiAndGVzdC1jaGFubmVsJyxcbiAgICAgIHNsYWNrV29ya3NwYWNlSWQ6ICdUNDkyMzlVNFcnLCAvLyBtb2RpZnkgdG8geW91ciBzbGFjayB3b3Jrc3BhY2UgaWRcbiAgICAgIHNsYWNrQ2hhbm5lbElkOiAnQzAxODdKQUJVRTknLCAvLyBtb2RpZnkgdG8geW91ciBzbGFjayBjaGFubmVsIGlkXG4gICAgICBsb2dnaW5nTGV2ZWw6IGNoYXRib3QuTG9nZ2luZ0xldmVsLk5PTkUsXG4gICAgICBsb2dSZXRlbnRpb246IGxvZ3MuUmV0ZW50aW9uRGF5cy5PTkVfTU9OVEgsXG4gICAgfSk7XG5cbiAgICBzbGFja0NoYW5uZWwuYWRkVG9Sb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgJ3MzOkdldE9iamVjdCcsXG4gICAgICBdLFxuICAgICAgcmVzb3VyY2VzOiBbJ2Fybjphd3M6czM6OjphYmMveHl6LzEyMy50eHQnXSxcbiAgICB9KSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxubmV3IENoYXRib3RMb2dSZXRlbnRpb25JbnRlZyhhcHAsICdDaGF0Ym90TG9nUmV0ZW50aW9uSW50ZWcnKTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=