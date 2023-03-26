"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk = require("@aws-cdk/core");
const lib_1 = require("../lib");
test('construct an AWS::Serverless::Application', () => {
    const app = new cdk.App({
        context: {
            '@aws-cdk/core:newStyleStackSynthesis': false,
        },
    });
    const stack = new cdk.Stack(app);
    new lib_1.CfnApplication(stack, 'App', {
        location: {
            applicationId: 'arn:aws:serverlessrepo:us-east-1:077246666028:applications/aws-serverless-twitter-event-source',
            semanticVersion: '2.0.0',
        },
        parameters: {
            SearchText: '#serverless -filter:nativeretweets',
            TweetProcessorFunctionName: 'test',
        },
    });
    assertions_1.Template.fromStack(stack).templateMatches({
        Transform: 'AWS::Serverless-2016-10-31',
        Resources: {
            App: {
                Type: 'AWS::Serverless::Application',
                Properties: {
                    Location: {
                        ApplicationId: 'arn:aws:serverlessrepo:us-east-1:077246666028:applications/aws-serverless-twitter-event-source',
                        SemanticVersion: '2.0.0',
                    },
                    Parameters: {
                        SearchText: '#serverless -filter:nativeretweets',
                        TweetProcessorFunctionName: 'test',
                    },
                },
            },
        },
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb24udGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcGxpY2F0aW9uLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0MscUNBQXFDO0FBQ3JDLGdDQUF3QztBQUV4QyxJQUFJLENBQUMsMkNBQTJDLEVBQUUsR0FBRyxFQUFFO0lBQ3JELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQztRQUN0QixPQUFPLEVBQUU7WUFDUCxzQ0FBc0MsRUFBRSxLQUFLO1NBQzlDO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRWpDLElBQUksb0JBQWMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO1FBQy9CLFFBQVEsRUFBRTtZQUNSLGFBQWEsRUFBRSxnR0FBZ0c7WUFDL0csZUFBZSxFQUFFLE9BQU87U0FDekI7UUFDRCxVQUFVLEVBQUU7WUFDVixVQUFVLEVBQUUsb0NBQW9DO1lBQ2hELDBCQUEwQixFQUFFLE1BQU07U0FDbkM7S0FDRixDQUFDLENBQUM7SUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLENBQUM7UUFDeEMsU0FBUyxFQUFFLDRCQUE0QjtRQUN2QyxTQUFTLEVBQUU7WUFDVCxHQUFHLEVBQUU7Z0JBQ0gsSUFBSSxFQUFFLDhCQUE4QjtnQkFDcEMsVUFBVSxFQUFFO29CQUNWLFFBQVEsRUFBRTt3QkFDUixhQUFhLEVBQUUsZ0dBQWdHO3dCQUMvRyxlQUFlLEVBQUUsT0FBTztxQkFDekI7b0JBQ0QsVUFBVSxFQUFFO3dCQUNWLFVBQVUsRUFBRSxvQ0FBb0M7d0JBQ2hELDBCQUEwQixFQUFFLE1BQU07cUJBQ25DO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENmbkFwcGxpY2F0aW9uIH0gZnJvbSAnLi4vbGliJztcblxudGVzdCgnY29uc3RydWN0IGFuIEFXUzo6U2VydmVybGVzczo6QXBwbGljYXRpb24nLCAoKSA9PiB7XG4gIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKHtcbiAgICBjb250ZXh0OiB7XG4gICAgICAnQGF3cy1jZGsvY29yZTpuZXdTdHlsZVN0YWNrU3ludGhlc2lzJzogZmFsc2UsXG4gICAgfSxcbiAgfSk7XG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHApO1xuXG4gIG5ldyBDZm5BcHBsaWNhdGlvbihzdGFjaywgJ0FwcCcsIHtcbiAgICBsb2NhdGlvbjoge1xuICAgICAgYXBwbGljYXRpb25JZDogJ2Fybjphd3M6c2VydmVybGVzc3JlcG86dXMtZWFzdC0xOjA3NzI0NjY2NjAyODphcHBsaWNhdGlvbnMvYXdzLXNlcnZlcmxlc3MtdHdpdHRlci1ldmVudC1zb3VyY2UnLFxuICAgICAgc2VtYW50aWNWZXJzaW9uOiAnMi4wLjAnLFxuICAgIH0sXG4gICAgcGFyYW1ldGVyczoge1xuICAgICAgU2VhcmNoVGV4dDogJyNzZXJ2ZXJsZXNzIC1maWx0ZXI6bmF0aXZlcmV0d2VldHMnLFxuICAgICAgVHdlZXRQcm9jZXNzb3JGdW5jdGlvbk5hbWU6ICd0ZXN0JyxcbiAgICB9LFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgVHJhbnNmb3JtOiAnQVdTOjpTZXJ2ZXJsZXNzLTIwMTYtMTAtMzEnLFxuICAgIFJlc291cmNlczoge1xuICAgICAgQXBwOiB7XG4gICAgICAgIFR5cGU6ICdBV1M6OlNlcnZlcmxlc3M6OkFwcGxpY2F0aW9uJyxcbiAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgIExvY2F0aW9uOiB7XG4gICAgICAgICAgICBBcHBsaWNhdGlvbklkOiAnYXJuOmF3czpzZXJ2ZXJsZXNzcmVwbzp1cy1lYXN0LTE6MDc3MjQ2NjY2MDI4OmFwcGxpY2F0aW9ucy9hd3Mtc2VydmVybGVzcy10d2l0dGVyLWV2ZW50LXNvdXJjZScsXG4gICAgICAgICAgICBTZW1hbnRpY1ZlcnNpb246ICcyLjAuMCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICBTZWFyY2hUZXh0OiAnI3NlcnZlcmxlc3MgLWZpbHRlcjpuYXRpdmVyZXR3ZWV0cycsXG4gICAgICAgICAgICBUd2VldFByb2Nlc3NvckZ1bmN0aW9uTmFtZTogJ3Rlc3QnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufSk7XG4iXX0=