"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_kms_1 = require("aws-cdk-lib/aws-kms");
const aws_s3_1 = require("aws-cdk-lib/aws-s3");
const aws_stepfunctions_1 = require("aws-cdk-lib/aws-stepfunctions");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_stepfunctions_tasks_1 = require("aws-cdk-lib/aws-stepfunctions-tasks");
/*
 * Creates a state machine with a task state to create a training job in AWS SageMaker
 * SageMaker jobs need training algorithms. These can be found in the AWS marketplace
 * or created.
 *
 * Subscribe to demo Algorithm vended by Amazon (free):
 * https://aws.amazon.com/marketplace/ai/procurement?productId=cc5186a0-b8d6-4750-a9bb-1dcdf10e787a
 * FIXME - create Input data pertinent for the training model and insert into S3 location specified in inputDataConfig.
 *
 * Stack verification steps:
 * The generated State Machine can be executed from the CLI (or Step Functions console)
 * and runs with an execution status of `Succeeded`.
 *
 * -- aws stepfunctions start-execution --state-machine-arn <state-machine-arn-from-output> provides execution arn
 * -- aws stepfunctions describe-execution --execution-arn <state-machine-arn-from-output> returns a status of `Succeeded`
 */
const app = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(app, 'integ-stepfunctions-sagemaker');
const encryptionKey = new aws_kms_1.Key(stack, 'EncryptionKey', {
    removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
});
const trainingData = new aws_s3_1.Bucket(stack, 'TrainingData', {
    encryption: aws_s3_1.BucketEncryption.KMS,
    encryptionKey,
    removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
});
const sm = new aws_stepfunctions_1.StateMachine(stack, 'StateMachine', {
    definition: new aws_stepfunctions_tasks_1.SageMakerCreateTrainingJob(stack, 'TrainTask', {
        algorithmSpecification: {
            algorithmName: 'arn:aws:sagemaker:us-east-1:865070037744:algorithm/scikit-decision-trees-15423055-57b73412d2e93e9239e4e16f83298b8f',
        },
        inputDataConfig: [{
                channelName: 'InputData',
                dataSource: {
                    s3DataSource: {
                        s3Location: aws_stepfunctions_tasks_1.S3Location.fromBucket(trainingData, 'data/'),
                    },
                },
            }],
        outputDataConfig: { s3OutputLocation: aws_stepfunctions_tasks_1.S3Location.fromBucket(trainingData, 'result/') },
        trainingJobName: 'mytrainingjob',
    }),
});
new aws_cdk_lib_1.CfnOutput(stack, 'stateMachineArn', {
    value: sm.stateMachineArn,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY3JlYXRlLXRyYWluaW5nLWpvYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmNyZWF0ZS10cmFpbmluZy1qb2IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpREFBMEM7QUFDMUMsK0NBQThEO0FBQzlELHFFQUE2RDtBQUM3RCw2Q0FBbUU7QUFDbkUsaUZBQTZGO0FBRTdGOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksbUJBQUssQ0FBQyxHQUFHLEVBQUUsK0JBQStCLENBQUMsQ0FBQztBQUU5RCxNQUFNLGFBQWEsR0FBRyxJQUFJLGFBQUcsQ0FBQyxLQUFLLEVBQUUsZUFBZSxFQUFFO0lBQ3BELGFBQWEsRUFBRSwyQkFBYSxDQUFDLE9BQU87Q0FDckMsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxZQUFZLEdBQUcsSUFBSSxlQUFNLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRTtJQUNyRCxVQUFVLEVBQUUseUJBQWdCLENBQUMsR0FBRztJQUNoQyxhQUFhO0lBQ2IsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztDQUNyQyxDQUFDLENBQUM7QUFFSCxNQUFNLEVBQUUsR0FBRyxJQUFJLGdDQUFZLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRTtJQUNqRCxVQUFVLEVBQUUsSUFBSSxvREFBMEIsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO1FBQzdELHNCQUFzQixFQUFFO1lBQ3RCLGFBQWEsRUFBRSxvSEFBb0g7U0FDcEk7UUFDRCxlQUFlLEVBQUUsQ0FBQztnQkFDaEIsV0FBVyxFQUFFLFdBQVc7Z0JBQ3hCLFVBQVUsRUFBRTtvQkFDVixZQUFZLEVBQUU7d0JBQ1osVUFBVSxFQUFFLG9DQUFVLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUM7cUJBQ3pEO2lCQUNGO2FBQ0YsQ0FBQztRQUNGLGdCQUFnQixFQUFFLEVBQUUsZ0JBQWdCLEVBQUUsb0NBQVUsQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxFQUFFO1FBQ3RGLGVBQWUsRUFBRSxlQUFlO0tBQ2pDLENBQUM7Q0FDSCxDQUFDLENBQUM7QUFFSCxJQUFJLHVCQUFTLENBQUMsS0FBSyxFQUFFLGlCQUFpQixFQUFFO0lBQ3RDLEtBQUssRUFBRSxFQUFFLENBQUMsZUFBZTtDQUMxQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBLZXkgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3Mta21zJztcbmltcG9ydCB7IEJ1Y2tldCwgQnVja2V0RW5jcnlwdGlvbiB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgeyBTdGF0ZU1hY2hpbmUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3RlcGZ1bmN0aW9ucyc7XG5pbXBvcnQgeyBBcHAsIENmbk91dHB1dCwgUmVtb3ZhbFBvbGljeSwgU3RhY2sgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBTM0xvY2F0aW9uLCBTYWdlTWFrZXJDcmVhdGVUcmFpbmluZ0pvYiB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1zdGVwZnVuY3Rpb25zLXRhc2tzJztcblxuLypcbiAqIENyZWF0ZXMgYSBzdGF0ZSBtYWNoaW5lIHdpdGggYSB0YXNrIHN0YXRlIHRvIGNyZWF0ZSBhIHRyYWluaW5nIGpvYiBpbiBBV1MgU2FnZU1ha2VyXG4gKiBTYWdlTWFrZXIgam9icyBuZWVkIHRyYWluaW5nIGFsZ29yaXRobXMuIFRoZXNlIGNhbiBiZSBmb3VuZCBpbiB0aGUgQVdTIG1hcmtldHBsYWNlXG4gKiBvciBjcmVhdGVkLlxuICpcbiAqIFN1YnNjcmliZSB0byBkZW1vIEFsZ29yaXRobSB2ZW5kZWQgYnkgQW1hem9uIChmcmVlKTpcbiAqIGh0dHBzOi8vYXdzLmFtYXpvbi5jb20vbWFya2V0cGxhY2UvYWkvcHJvY3VyZW1lbnQ/cHJvZHVjdElkPWNjNTE4NmEwLWI4ZDYtNDc1MC1hOWJiLTFkY2RmMTBlNzg3YVxuICogRklYTUUgLSBjcmVhdGUgSW5wdXQgZGF0YSBwZXJ0aW5lbnQgZm9yIHRoZSB0cmFpbmluZyBtb2RlbCBhbmQgaW5zZXJ0IGludG8gUzMgbG9jYXRpb24gc3BlY2lmaWVkIGluIGlucHV0RGF0YUNvbmZpZy5cbiAqXG4gKiBTdGFjayB2ZXJpZmljYXRpb24gc3RlcHM6XG4gKiBUaGUgZ2VuZXJhdGVkIFN0YXRlIE1hY2hpbmUgY2FuIGJlIGV4ZWN1dGVkIGZyb20gdGhlIENMSSAob3IgU3RlcCBGdW5jdGlvbnMgY29uc29sZSlcbiAqIGFuZCBydW5zIHdpdGggYW4gZXhlY3V0aW9uIHN0YXR1cyBvZiBgU3VjY2VlZGVkYC5cbiAqXG4gKiAtLSBhd3Mgc3RlcGZ1bmN0aW9ucyBzdGFydC1leGVjdXRpb24gLS1zdGF0ZS1tYWNoaW5lLWFybiA8c3RhdGUtbWFjaGluZS1hcm4tZnJvbS1vdXRwdXQ+IHByb3ZpZGVzIGV4ZWN1dGlvbiBhcm5cbiAqIC0tIGF3cyBzdGVwZnVuY3Rpb25zIGRlc2NyaWJlLWV4ZWN1dGlvbiAtLWV4ZWN1dGlvbi1hcm4gPHN0YXRlLW1hY2hpbmUtYXJuLWZyb20tb3V0cHV0PiByZXR1cm5zIGEgc3RhdHVzIG9mIGBTdWNjZWVkZWRgXG4gKi9cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ2ludGVnLXN0ZXBmdW5jdGlvbnMtc2FnZW1ha2VyJyk7XG5cbmNvbnN0IGVuY3J5cHRpb25LZXkgPSBuZXcgS2V5KHN0YWNrLCAnRW5jcnlwdGlvbktleScsIHtcbiAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxufSk7XG5jb25zdCB0cmFpbmluZ0RhdGEgPSBuZXcgQnVja2V0KHN0YWNrLCAnVHJhaW5pbmdEYXRhJywge1xuICBlbmNyeXB0aW9uOiBCdWNrZXRFbmNyeXB0aW9uLktNUyxcbiAgZW5jcnlwdGlvbktleSxcbiAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxufSk7XG5cbmNvbnN0IHNtID0gbmV3IFN0YXRlTWFjaGluZShzdGFjaywgJ1N0YXRlTWFjaGluZScsIHtcbiAgZGVmaW5pdGlvbjogbmV3IFNhZ2VNYWtlckNyZWF0ZVRyYWluaW5nSm9iKHN0YWNrLCAnVHJhaW5UYXNrJywge1xuICAgIGFsZ29yaXRobVNwZWNpZmljYXRpb246IHtcbiAgICAgIGFsZ29yaXRobU5hbWU6ICdhcm46YXdzOnNhZ2VtYWtlcjp1cy1lYXN0LTE6ODY1MDcwMDM3NzQ0OmFsZ29yaXRobS9zY2lraXQtZGVjaXNpb24tdHJlZXMtMTU0MjMwNTUtNTdiNzM0MTJkMmU5M2U5MjM5ZTRlMTZmODMyOThiOGYnLFxuICAgIH0sXG4gICAgaW5wdXREYXRhQ29uZmlnOiBbe1xuICAgICAgY2hhbm5lbE5hbWU6ICdJbnB1dERhdGEnLFxuICAgICAgZGF0YVNvdXJjZToge1xuICAgICAgICBzM0RhdGFTb3VyY2U6IHtcbiAgICAgICAgICBzM0xvY2F0aW9uOiBTM0xvY2F0aW9uLmZyb21CdWNrZXQodHJhaW5pbmdEYXRhLCAnZGF0YS8nKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfV0sXG4gICAgb3V0cHV0RGF0YUNvbmZpZzogeyBzM091dHB1dExvY2F0aW9uOiBTM0xvY2F0aW9uLmZyb21CdWNrZXQodHJhaW5pbmdEYXRhLCAncmVzdWx0LycpIH0sXG4gICAgdHJhaW5pbmdKb2JOYW1lOiAnbXl0cmFpbmluZ2pvYicsXG4gIH0pLFxufSk7XG5cbm5ldyBDZm5PdXRwdXQoc3RhY2ssICdzdGF0ZU1hY2hpbmVBcm4nLCB7XG4gIHZhbHVlOiBzbS5zdGF0ZU1hY2hpbmVBcm4sXG59KTtcbiJdfQ==