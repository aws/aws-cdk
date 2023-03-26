"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const chatbot = require("../lib");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY2hhdGJvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmNoYXRib3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBQ3JDLGtDQUFrQztBQUVsQyxNQUFNLFlBQWEsU0FBUSxHQUFHLENBQUMsS0FBSztJQUNsQyxZQUFZLEtBQWMsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDNUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxZQUFZLEdBQUcsSUFBSSxPQUFPLENBQUMseUJBQXlCLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQ2pGLDZCQUE2QixFQUFFLGNBQWM7WUFDN0MsZ0JBQWdCLEVBQUUsV0FBVztZQUM3QixjQUFjLEVBQUUsYUFBYTtZQUM3QixZQUFZLEVBQUUsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJO1NBQ3hDLENBQUMsQ0FBQztRQUVILFlBQVksQ0FBQyxlQUFlLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ25ELE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUs7WUFDeEIsT0FBTyxFQUFFO2dCQUNQLGNBQWM7YUFDZjtZQUNELFNBQVMsRUFBRSxDQUFDLDhCQUE4QixDQUFDO1NBQzVDLENBQUMsQ0FBQyxDQUFDO0tBQ0w7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLElBQUksWUFBWSxDQUFDLEdBQUcsRUFBRSxjQUFjLENBQUMsQ0FBQztBQUV0QyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjaGF0Ym90IGZyb20gJy4uL2xpYic7XG5cbmNsYXNzIENoYXRib3RJbnRlZyBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBzbGFja0NoYW5uZWwgPSBuZXcgY2hhdGJvdC5TbGFja0NoYW5uZWxDb25maWd1cmF0aW9uKHRoaXMsICdNeVNsYWNrQ2hhbm5lbCcsIHtcbiAgICAgIHNsYWNrQ2hhbm5lbENvbmZpZ3VyYXRpb25OYW1lOiAndGVzdC1jaGFubmVsJyxcbiAgICAgIHNsYWNrV29ya3NwYWNlSWQ6ICdUNDkyMzlVNFcnLCAvLyBtb2RpZnkgdG8geW91ciBzbGFjayB3b3Jrc3BhY2UgaWRcbiAgICAgIHNsYWNrQ2hhbm5lbElkOiAnQzAxODdKQUJVRTknLCAvLyBtb2RpZnkgdG8geW91ciBzbGFjayBjaGFubmVsIGlkXG4gICAgICBsb2dnaW5nTGV2ZWw6IGNoYXRib3QuTG9nZ2luZ0xldmVsLk5PTkUsXG4gICAgfSk7XG5cbiAgICBzbGFja0NoYW5uZWwuYWRkVG9Sb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgJ3MzOkdldE9iamVjdCcsXG4gICAgICBdLFxuICAgICAgcmVzb3VyY2VzOiBbJ2Fybjphd3M6czM6OjphYmMveHl6LzEyMy50eHQnXSxcbiAgICB9KSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxubmV3IENoYXRib3RJbnRlZyhhcHAsICdDaGF0Ym90SW50ZWcnKTtcblxuYXBwLnN5bnRoKCk7XG5cbiJdfQ==