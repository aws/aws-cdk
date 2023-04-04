"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lambda = require("aws-cdk-lib/aws-lambda");
const s3 = require("aws-cdk-lib/aws-s3");
const cdk = require("aws-cdk-lib");
const cloudfront = require("aws-cdk-lib/aws-cloudfront");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-cloudfront');
const sourceBucket = new s3.Bucket(stack, 'Bucket', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const lambdaFunction = new lambda.Function(stack, 'Lambda', {
    code: lambda.Code.fromInline('foo'),
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_14_X,
});
const lambdaVersion = new lambda.Version(stack, 'LambdaVersion', {
    lambda: lambdaFunction,
});
new cloudfront.CloudFrontWebDistribution(stack, 'MyDistribution', {
    originConfigs: [
        {
            s3OriginSource: {
                s3BucketSource: sourceBucket,
            },
            behaviors: [{
                    isDefaultBehavior: true,
                    lambdaFunctionAssociations: [{
                            eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
                            lambdaFunction: lambdaVersion,
                        }],
                }],
        },
    ],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY2xvdWRmcm9udC1sYW1iZGEtYXNzb2NpYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5jbG91ZGZyb250LWxhbWJkYS1hc3NvY2lhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlEQUFpRDtBQUNqRCx5Q0FBeUM7QUFDekMsbUNBQW1DO0FBQ25DLHlEQUF5RDtBQUV6RCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLG9CQUFvQixDQUFDLENBQUM7QUFFdkQsTUFBTSxZQUFZLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7SUFDbEQsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztDQUN6QyxDQUFDLENBQUM7QUFFSCxNQUFNLGNBQWMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtJQUMxRCxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO0lBQ25DLE9BQU8sRUFBRSxlQUFlO0lBQ3hCLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7Q0FDcEMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxhQUFhLEdBQUcsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUU7SUFDL0QsTUFBTSxFQUFFLGNBQWM7Q0FDdkIsQ0FBQyxDQUFDO0FBRUgsSUFBSSxVQUFVLENBQUMseUJBQXlCLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFO0lBQ2hFLGFBQWEsRUFBRTtRQUNiO1lBQ0UsY0FBYyxFQUFFO2dCQUNkLGNBQWMsRUFBRSxZQUFZO2FBQzdCO1lBQ0QsU0FBUyxFQUFFLENBQUM7b0JBQ1YsaUJBQWlCLEVBQUUsSUFBSTtvQkFDdkIsMEJBQTBCLEVBQUUsQ0FBQzs0QkFDM0IsU0FBUyxFQUFFLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxjQUFjOzRCQUN4RCxjQUFjLEVBQUUsYUFBYTt5QkFDOUIsQ0FBQztpQkFDSCxDQUFDO1NBQ0g7S0FDRjtDQUNGLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgY2xvdWRmcm9udCBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY2xvdWRmcm9udCc7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdhd3MtY2RrLWNsb3VkZnJvbnQnKTtcblxuY29uc3Qgc291cmNlQnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcsIHtcbiAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbn0pO1xuXG5jb25zdCBsYW1iZGFGdW5jdGlvbiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdMYW1iZGEnLCB7XG4gIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2ZvbycpLFxuICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxufSk7XG5cbmNvbnN0IGxhbWJkYVZlcnNpb24gPSBuZXcgbGFtYmRhLlZlcnNpb24oc3RhY2ssICdMYW1iZGFWZXJzaW9uJywge1xuICBsYW1iZGE6IGxhbWJkYUZ1bmN0aW9uLFxufSk7XG5cbm5ldyBjbG91ZGZyb250LkNsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24oc3RhY2ssICdNeURpc3RyaWJ1dGlvbicsIHtcbiAgb3JpZ2luQ29uZmlnczogW1xuICAgIHtcbiAgICAgIHMzT3JpZ2luU291cmNlOiB7XG4gICAgICAgIHMzQnVja2V0U291cmNlOiBzb3VyY2VCdWNrZXQsXG4gICAgICB9LFxuICAgICAgYmVoYXZpb3JzOiBbe1xuICAgICAgICBpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZSxcbiAgICAgICAgbGFtYmRhRnVuY3Rpb25Bc3NvY2lhdGlvbnM6IFt7XG4gICAgICAgICAgZXZlbnRUeXBlOiBjbG91ZGZyb250LkxhbWJkYUVkZ2VFdmVudFR5cGUuT1JJR0lOX1JFUVVFU1QsXG4gICAgICAgICAgbGFtYmRhRnVuY3Rpb246IGxhbWJkYVZlcnNpb24sXG4gICAgICAgIH1dLFxuICAgICAgfV0sXG4gICAgfSxcbiAgXSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==