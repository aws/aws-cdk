"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const s3 = require("aws-cdk-lib/aws-s3");
const sfn = require("aws-cdk-lib/aws-stepfunctions");
const aws_stepfunctions_1 = require("aws-cdk-lib/aws-stepfunctions");
const cdk = require("aws-cdk-lib");
const tasks = require("aws-cdk-lib/aws-stepfunctions-tasks");
/**
 *
 * Stack verification steps:
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> --input {"body": "hello world!"} : should return execution arn
 * *
 * * aws stepfunctions describe-execution --execution-arn <execution-arn generated before> --query 'status': should return status as SUCCEEDED
 * * aws stepfunctions describe-execution --execution-arn <execution-arn generated before> --query 'output': should return "hello world!"
 */
class TestStack extends cdk.Stack {
    constructor(scope, id, props = {}) {
        super(scope, id, props);
        const bucket = new s3.Bucket(this, 'Bucket');
        const commonParameters = {
            Bucket: bucket.bucketName,
            Key: 'test.txt',
        };
        const iamResources = [bucket.arnForObjects('*')];
        const putObject = new tasks.CallAwsService(this, 'PutObject', {
            service: 's3',
            action: 'putObject',
            parameters: {
                Body: sfn.JsonPath.stringAt('$.body'),
                ...commonParameters,
            },
            iamResources,
        });
        const getObject = new tasks.CallAwsService(this, 'GetObject', {
            service: 's3',
            action: 'getObject',
            parameters: commonParameters,
            iamResources,
        });
        const deleteObject = new tasks.CallAwsService(this, 'DeleteObject', {
            service: 's3',
            action: 'deleteObject',
            parameters: commonParameters,
            iamResources,
            resultPath: aws_stepfunctions_1.JsonPath.DISCARD,
        });
        const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
            definition: putObject.next(getObject).next(deleteObject),
        });
        new cdk.CfnOutput(this, 'StateMachineArn', {
            value: stateMachine.stateMachineArn,
        });
    }
}
const app = new cdk.App();
new TestStack(app, 'aws-stepfunctions-aws-sdk-integ');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY2FsbC1hd3Mtc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmNhbGwtYXdzLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBeUM7QUFDekMscURBQXFEO0FBQ3JELHFFQUF5RDtBQUN6RCxtQ0FBbUM7QUFDbkMsNkRBQTZEO0FBRTdEOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLFNBQVUsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMvQixZQUFZLEtBQWMsRUFBRSxFQUFVLEVBQUUsUUFBd0IsRUFBRTtRQUNoRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRTdDLE1BQU0sZ0JBQWdCLEdBQUc7WUFDdkIsTUFBTSxFQUFFLE1BQU0sQ0FBQyxVQUFVO1lBQ3pCLEdBQUcsRUFBRSxVQUFVO1NBQ2hCLENBQUM7UUFFRixNQUFNLFlBQVksR0FBRyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUVqRCxNQUFNLFNBQVMsR0FBRyxJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUM1RCxPQUFPLEVBQUUsSUFBSTtZQUNiLE1BQU0sRUFBRSxXQUFXO1lBQ25CLFVBQVUsRUFBRTtnQkFDVixJQUFJLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO2dCQUNyQyxHQUFHLGdCQUFnQjthQUNwQjtZQUNELFlBQVk7U0FDYixDQUFDLENBQUM7UUFFSCxNQUFNLFNBQVMsR0FBRyxJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUM1RCxPQUFPLEVBQUUsSUFBSTtZQUNiLE1BQU0sRUFBRSxXQUFXO1lBQ25CLFVBQVUsRUFBRSxnQkFBZ0I7WUFDNUIsWUFBWTtTQUNiLENBQUMsQ0FBQztRQUVILE1BQU0sWUFBWSxHQUFHLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ2xFLE9BQU8sRUFBRSxJQUFJO1lBQ2IsTUFBTSxFQUFFLGNBQWM7WUFDdEIsVUFBVSxFQUFFLGdCQUFnQjtZQUM1QixZQUFZO1lBQ1osVUFBVSxFQUFFLDRCQUFRLENBQUMsT0FBTztTQUM3QixDQUFDLENBQUM7UUFFSCxNQUFNLFlBQVksR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUM5RCxVQUFVLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO1NBQ3pELENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDekMsS0FBSyxFQUFFLFlBQVksQ0FBQyxlQUFlO1NBQ3BDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSxpQ0FBaUMsQ0FBQyxDQUFDO0FBQ3RELEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBzZm4gZnJvbSAnYXdzLWNkay1saWIvYXdzLXN0ZXBmdW5jdGlvbnMnO1xuaW1wb3J0IHsgSnNvblBhdGggfSBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3RlcGZ1bmN0aW9ucyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgdGFza3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLXN0ZXBmdW5jdGlvbnMtdGFza3MnO1xuXG4vKipcbiAqXG4gKiBTdGFjayB2ZXJpZmljYXRpb24gc3RlcHM6XG4gKiAqIGF3cyBzdGVwZnVuY3Rpb25zIHN0YXJ0LWV4ZWN1dGlvbiAtLXN0YXRlLW1hY2hpbmUtYXJuIDxkZXBsb3llZCBzdGF0ZSBtYWNoaW5lIGFybj4gLS1pbnB1dCB7XCJib2R5XCI6IFwiaGVsbG8gd29ybGQhXCJ9IDogc2hvdWxkIHJldHVybiBleGVjdXRpb24gYXJuXG4gKiAqXG4gKiAqIGF3cyBzdGVwZnVuY3Rpb25zIGRlc2NyaWJlLWV4ZWN1dGlvbiAtLWV4ZWN1dGlvbi1hcm4gPGV4ZWN1dGlvbi1hcm4gZ2VuZXJhdGVkIGJlZm9yZT4gLS1xdWVyeSAnc3RhdHVzJzogc2hvdWxkIHJldHVybiBzdGF0dXMgYXMgU1VDQ0VFREVEXG4gKiAqIGF3cyBzdGVwZnVuY3Rpb25zIGRlc2NyaWJlLWV4ZWN1dGlvbiAtLWV4ZWN1dGlvbi1hcm4gPGV4ZWN1dGlvbi1hcm4gZ2VuZXJhdGVkIGJlZm9yZT4gLS1xdWVyeSAnb3V0cHV0Jzogc2hvdWxkIHJldHVybiBcImhlbGxvIHdvcmxkIVwiXG4gKi9cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nLCBwcm9wczogY2RrLlN0YWNrUHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCAnQnVja2V0Jyk7XG5cbiAgICBjb25zdCBjb21tb25QYXJhbWV0ZXJzID0ge1xuICAgICAgQnVja2V0OiBidWNrZXQuYnVja2V0TmFtZSxcbiAgICAgIEtleTogJ3Rlc3QudHh0JyxcbiAgICB9O1xuXG4gICAgY29uc3QgaWFtUmVzb3VyY2VzID0gW2J1Y2tldC5hcm5Gb3JPYmplY3RzKCcqJyldO1xuXG4gICAgY29uc3QgcHV0T2JqZWN0ID0gbmV3IHRhc2tzLkNhbGxBd3NTZXJ2aWNlKHRoaXMsICdQdXRPYmplY3QnLCB7XG4gICAgICBzZXJ2aWNlOiAnczMnLFxuICAgICAgYWN0aW9uOiAncHV0T2JqZWN0JyxcbiAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgQm9keTogc2ZuLkpzb25QYXRoLnN0cmluZ0F0KCckLmJvZHknKSxcbiAgICAgICAgLi4uY29tbW9uUGFyYW1ldGVycyxcbiAgICAgIH0sXG4gICAgICBpYW1SZXNvdXJjZXMsXG4gICAgfSk7XG5cbiAgICBjb25zdCBnZXRPYmplY3QgPSBuZXcgdGFza3MuQ2FsbEF3c1NlcnZpY2UodGhpcywgJ0dldE9iamVjdCcsIHtcbiAgICAgIHNlcnZpY2U6ICdzMycsXG4gICAgICBhY3Rpb246ICdnZXRPYmplY3QnLFxuICAgICAgcGFyYW1ldGVyczogY29tbW9uUGFyYW1ldGVycyxcbiAgICAgIGlhbVJlc291cmNlcyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGRlbGV0ZU9iamVjdCA9IG5ldyB0YXNrcy5DYWxsQXdzU2VydmljZSh0aGlzLCAnRGVsZXRlT2JqZWN0Jywge1xuICAgICAgc2VydmljZTogJ3MzJyxcbiAgICAgIGFjdGlvbjogJ2RlbGV0ZU9iamVjdCcsXG4gICAgICBwYXJhbWV0ZXJzOiBjb21tb25QYXJhbWV0ZXJzLFxuICAgICAgaWFtUmVzb3VyY2VzLFxuICAgICAgcmVzdWx0UGF0aDogSnNvblBhdGguRElTQ0FSRCxcbiAgICB9KTtcblxuICAgIGNvbnN0IHN0YXRlTWFjaGluZSA9IG5ldyBzZm4uU3RhdGVNYWNoaW5lKHRoaXMsICdTdGF0ZU1hY2hpbmUnLCB7XG4gICAgICBkZWZpbml0aW9uOiBwdXRPYmplY3QubmV4dChnZXRPYmplY3QpLm5leHQoZGVsZXRlT2JqZWN0KSxcbiAgICB9KTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdTdGF0ZU1hY2hpbmVBcm4nLCB7XG4gICAgICB2YWx1ZTogc3RhdGVNYWNoaW5lLnN0YXRlTWFjaGluZUFybixcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xubmV3IFRlc3RTdGFjayhhcHAsICdhd3Mtc3RlcGZ1bmN0aW9ucy1hd3Mtc2RrLWludGVnJyk7XG5hcHAuc3ludGgoKTtcbiJdfQ==