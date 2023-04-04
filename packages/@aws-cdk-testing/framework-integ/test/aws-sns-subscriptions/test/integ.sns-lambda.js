"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lambda = require("aws-cdk-lib/aws-lambda");
const sns = require("aws-cdk-lib/aws-sns");
const sqs = require("aws-cdk-lib/aws-sqs");
const cdk = require("aws-cdk-lib");
const subs = require("aws-cdk-lib/aws-sns-subscriptions");
class SnsToLambda extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const topic = new sns.Topic(this, 'MyTopic');
        const func = new lambda.Function(this, 'Echo', {
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
        });
        topic.addSubscription(new subs.LambdaSubscription(func, {
            deadLetterQueue: new sqs.Queue(this, 'DeadLetterQueue'),
        }));
        const funcFiltered = new lambda.Function(this, 'Filtered', {
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
        });
        topic.addSubscription(new subs.LambdaSubscription(funcFiltered, {
            filterPolicy: {
                color: sns.SubscriptionFilter.stringFilter({
                    allowlist: ['red'],
                    matchPrefixes: ['bl', 'ye'],
                }),
                size: sns.SubscriptionFilter.stringFilter({
                    denylist: ['small', 'medium'],
                }),
                price: sns.SubscriptionFilter.numericFilter({
                    between: { start: 100, stop: 200 },
                }),
            },
        }));
        const funcFilteredWithMessageBody = new lambda.Function(this, 'FilteredMessageBody', {
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
        });
        topic.addSubscription(new subs.LambdaSubscription(funcFilteredWithMessageBody, {
            filterPolicyWithMessageBody: {
                background: sns.FilterOrPolicy.policy({
                    color: sns.FilterOrPolicy.filter(sns.SubscriptionFilter.stringFilter({
                        allowlist: ['red'],
                        matchPrefixes: ['bl', 'ye'],
                    })),
                }),
            },
        }));
    }
}
const app = new cdk.App();
new SnsToLambda(app, 'aws-cdk-sns-lambda');
app.synth();
function handler(event, _context, callback) {
    /* eslint-disable no-console */
    console.log('====================================================');
    console.log(JSON.stringify(event, undefined, 2));
    console.log('====================================================');
    return callback(undefined, event);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc25zLWxhbWJkYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnNucy1sYW1iZGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxpREFBaUQ7QUFDakQsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyxtQ0FBbUM7QUFDbkMsMERBQTBEO0FBRTFELE1BQU0sV0FBWSxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ2pDLFlBQVksS0FBYyxFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM1RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRTdDLE1BQU0sSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFO1lBQzdDLE9BQU8sRUFBRSxlQUFlO1lBQ3hCLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLHFCQUFxQixPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQztTQUN4RSxDQUFDLENBQUM7UUFFSCxLQUFLLENBQUMsZUFBZSxDQUFDLElBQUksSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRTtZQUN0RCxlQUFlLEVBQUUsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxpQkFBaUIsQ0FBQztTQUN4RCxDQUFDLENBQUMsQ0FBQztRQUVKLE1BQU0sWUFBWSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3pELE9BQU8sRUFBRSxlQUFlO1lBQ3hCLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLHFCQUFxQixPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQztTQUN4RSxDQUFDLENBQUM7UUFFSCxLQUFLLENBQUMsZUFBZSxDQUFDLElBQUksSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRTtZQUM5RCxZQUFZLEVBQUU7Z0JBQ1osS0FBSyxFQUFFLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUM7b0JBQ3pDLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztvQkFDbEIsYUFBYSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztpQkFDNUIsQ0FBQztnQkFDRixJQUFJLEVBQUUsR0FBRyxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQztvQkFDeEMsUUFBUSxFQUFFLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQztpQkFDOUIsQ0FBQztnQkFDRixLQUFLLEVBQUUsR0FBRyxDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBQztvQkFDMUMsT0FBTyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFO2lCQUNuQyxDQUFDO2FBQ0g7U0FDRixDQUFDLENBQUMsQ0FBQztRQUVKLE1BQU0sMkJBQTJCLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRTtZQUNuRixPQUFPLEVBQUUsZUFBZTtZQUN4QixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ25DLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUM7U0FDeEUsQ0FBQyxDQUFDO1FBRUgsS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQywyQkFBMkIsRUFBRTtZQUM3RSwyQkFBMkIsRUFBRTtnQkFDM0IsVUFBVSxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDO29CQUNwQyxLQUFLLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQzt3QkFDbkUsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO3dCQUNsQixhQUFhLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO3FCQUM1QixDQUFDLENBQUM7aUJBQ0osQ0FBQzthQUNIO1NBQ0YsQ0FBQyxDQUFDLENBQUM7SUFDTixDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixJQUFJLFdBQVcsQ0FBQyxHQUFHLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztBQUUzQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7QUFFWixTQUFTLE9BQU8sQ0FBQyxLQUFVLEVBQUUsUUFBYSxFQUFFLFFBQWE7SUFDdkQsK0JBQStCO0lBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0RBQXNELENBQUMsQ0FBQztJQUNwRSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pELE9BQU8sQ0FBQyxHQUFHLENBQUMsc0RBQXNELENBQUMsQ0FBQztJQUNwRSxPQUFPLFFBQVEsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDcEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlxuXG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBzbnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNucyc7XG5pbXBvcnQgKiBhcyBzcXMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNxcyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgc3VicyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc25zLXN1YnNjcmlwdGlvbnMnO1xuXG5jbGFzcyBTbnNUb0xhbWJkYSBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCB0b3BpYyA9IG5ldyBzbnMuVG9waWModGhpcywgJ015VG9waWMnKTtcblxuICAgIGNvbnN0IGZ1bmMgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdFY2hvJywge1xuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKGBleHBvcnRzLmhhbmRsZXIgPSAke2hhbmRsZXIudG9TdHJpbmcoKX1gKSxcbiAgICB9KTtcblxuICAgIHRvcGljLmFkZFN1YnNjcmlwdGlvbihuZXcgc3Vicy5MYW1iZGFTdWJzY3JpcHRpb24oZnVuYywge1xuICAgICAgZGVhZExldHRlclF1ZXVlOiBuZXcgc3FzLlF1ZXVlKHRoaXMsICdEZWFkTGV0dGVyUXVldWUnKSxcbiAgICB9KSk7XG5cbiAgICBjb25zdCBmdW5jRmlsdGVyZWQgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdGaWx0ZXJlZCcsIHtcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZShgZXhwb3J0cy5oYW5kbGVyID0gJHtoYW5kbGVyLnRvU3RyaW5nKCl9YCksXG4gICAgfSk7XG5cbiAgICB0b3BpYy5hZGRTdWJzY3JpcHRpb24obmV3IHN1YnMuTGFtYmRhU3Vic2NyaXB0aW9uKGZ1bmNGaWx0ZXJlZCwge1xuICAgICAgZmlsdGVyUG9saWN5OiB7XG4gICAgICAgIGNvbG9yOiBzbnMuU3Vic2NyaXB0aW9uRmlsdGVyLnN0cmluZ0ZpbHRlcih7XG4gICAgICAgICAgYWxsb3dsaXN0OiBbJ3JlZCddLFxuICAgICAgICAgIG1hdGNoUHJlZml4ZXM6IFsnYmwnLCAneWUnXSxcbiAgICAgICAgfSksXG4gICAgICAgIHNpemU6IHNucy5TdWJzY3JpcHRpb25GaWx0ZXIuc3RyaW5nRmlsdGVyKHtcbiAgICAgICAgICBkZW55bGlzdDogWydzbWFsbCcsICdtZWRpdW0nXSxcbiAgICAgICAgfSksXG4gICAgICAgIHByaWNlOiBzbnMuU3Vic2NyaXB0aW9uRmlsdGVyLm51bWVyaWNGaWx0ZXIoe1xuICAgICAgICAgIGJldHdlZW46IHsgc3RhcnQ6IDEwMCwgc3RvcDogMjAwIH0sXG4gICAgICAgIH0pLFxuICAgICAgfSxcbiAgICB9KSk7XG5cbiAgICBjb25zdCBmdW5jRmlsdGVyZWRXaXRoTWVzc2FnZUJvZHkgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdGaWx0ZXJlZE1lc3NhZ2VCb2R5Jywge1xuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKGBleHBvcnRzLmhhbmRsZXIgPSAke2hhbmRsZXIudG9TdHJpbmcoKX1gKSxcbiAgICB9KTtcblxuICAgIHRvcGljLmFkZFN1YnNjcmlwdGlvbihuZXcgc3Vicy5MYW1iZGFTdWJzY3JpcHRpb24oZnVuY0ZpbHRlcmVkV2l0aE1lc3NhZ2VCb2R5LCB7XG4gICAgICBmaWx0ZXJQb2xpY3lXaXRoTWVzc2FnZUJvZHk6IHtcbiAgICAgICAgYmFja2dyb3VuZDogc25zLkZpbHRlck9yUG9saWN5LnBvbGljeSh7XG4gICAgICAgICAgY29sb3I6IHNucy5GaWx0ZXJPclBvbGljeS5maWx0ZXIoc25zLlN1YnNjcmlwdGlvbkZpbHRlci5zdHJpbmdGaWx0ZXIoe1xuICAgICAgICAgICAgYWxsb3dsaXN0OiBbJ3JlZCddLFxuICAgICAgICAgICAgbWF0Y2hQcmVmaXhlczogWydibCcsICd5ZSddLFxuICAgICAgICAgIH0pKSxcbiAgICAgICAgfSksXG4gICAgICB9LFxuICAgIH0pKTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5uZXcgU25zVG9MYW1iZGEoYXBwLCAnYXdzLWNkay1zbnMtbGFtYmRhJyk7XG5cbmFwcC5zeW50aCgpO1xuXG5mdW5jdGlvbiBoYW5kbGVyKGV2ZW50OiBhbnksIF9jb250ZXh0OiBhbnksIGNhbGxiYWNrOiBhbnkpIHtcbiAgLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuICBjb25zb2xlLmxvZygnPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PScpO1xuICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShldmVudCwgdW5kZWZpbmVkLCAyKSk7XG4gIGNvbnNvbGUubG9nKCc9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Jyk7XG4gIHJldHVybiBjYWxsYmFjayh1bmRlZmluZWQsIGV2ZW50KTtcbn1cbiJdfQ==