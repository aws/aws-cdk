"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sfn = require("aws-cdk-lib/aws-stepfunctions");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const tasks = require("aws-cdk-lib/aws-stepfunctions-tasks");
/*
 * Stack verification steps:
 * * aws stepfunctions start-execution --input '{"hello": "world"}' --state-machine-arn <StateMachineARN>
 * * aws stepfunctions describe-execution --execution-arn <execution-arn>
 * * The output here should contain `status: "SUCCEEDED"` and `output:"{...\"Output\":\"{\\\"hello\\\":\\\"world\\\"}\"...}"`
 */
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        const child = new sfn.StateMachine(this, 'Child', {
            definition: new sfn.Pass(this, 'Pass'),
        });
        const parent = new sfn.StateMachine(this, 'Parent', {
            definition: new sfn.Task(this, 'Task', {
                task: new tasks.StartExecution(child, {
                    input: {
                        hello: sfn.JsonPath.stringAt('$.hello'),
                    },
                    integrationPattern: sfn.ServiceIntegrationPattern.SYNC,
                }),
            }),
        });
        new aws_cdk_lib_1.CfnOutput(this, 'StateMachineARN', {
            value: parent.stateMachineArn,
        });
    }
}
const app = new aws_cdk_lib_1.App();
new TestStack(app, 'integ-sfn-start-execution');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc3RhcnQtZXhlY3V0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuc3RhcnQtZXhlY3V0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscURBQXFEO0FBQ3JELDZDQUFvRDtBQUVwRCw2REFBNkQ7QUFFN0Q7Ozs7O0dBS0c7QUFFSCxNQUFNLFNBQVUsU0FBUSxtQkFBSztJQUMzQixZQUFZLEtBQWdCLEVBQUUsRUFBVTtRQUN0QyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO1lBQ2hELFVBQVUsRUFBRSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztTQUN2QyxDQUFDLENBQUM7UUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUNsRCxVQUFVLEVBQUUsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUU7Z0JBQ3JDLElBQUksRUFBRSxJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFO29CQUNwQyxLQUFLLEVBQUU7d0JBQ0wsS0FBSyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQztxQkFDeEM7b0JBQ0Qsa0JBQWtCLEVBQUUsR0FBRyxDQUFDLHlCQUF5QixDQUFDLElBQUk7aUJBQ3ZELENBQUM7YUFDSCxDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBRUgsSUFBSSx1QkFBUyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUNyQyxLQUFLLEVBQUUsTUFBTSxDQUFDLGVBQWU7U0FDOUIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFFdEIsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLDJCQUEyQixDQUFDLENBQUM7QUFFaEQsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgc2ZuIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zdGVwZnVuY3Rpb25zJztcbmltcG9ydCB7IEFwcCwgQ2ZuT3V0cHV0LCBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgdGFza3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLXN0ZXBmdW5jdGlvbnMtdGFza3MnO1xuXG4vKlxuICogU3RhY2sgdmVyaWZpY2F0aW9uIHN0ZXBzOlxuICogKiBhd3Mgc3RlcGZ1bmN0aW9ucyBzdGFydC1leGVjdXRpb24gLS1pbnB1dCAne1wiaGVsbG9cIjogXCJ3b3JsZFwifScgLS1zdGF0ZS1tYWNoaW5lLWFybiA8U3RhdGVNYWNoaW5lQVJOPlxuICogKiBhd3Mgc3RlcGZ1bmN0aW9ucyBkZXNjcmliZS1leGVjdXRpb24gLS1leGVjdXRpb24tYXJuIDxleGVjdXRpb24tYXJuPlxuICogKiBUaGUgb3V0cHV0IGhlcmUgc2hvdWxkIGNvbnRhaW4gYHN0YXR1czogXCJTVUNDRUVERURcImAgYW5kIGBvdXRwdXQ6XCJ7Li4uXFxcIk91dHB1dFxcXCI6XFxcIntcXFxcXFxcImhlbGxvXFxcXFxcXCI6XFxcXFxcXCJ3b3JsZFxcXFxcXFwifVxcXCIuLi59XCJgXG4gKi9cblxuY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IGNoaWxkID0gbmV3IHNmbi5TdGF0ZU1hY2hpbmUodGhpcywgJ0NoaWxkJywge1xuICAgICAgZGVmaW5pdGlvbjogbmV3IHNmbi5QYXNzKHRoaXMsICdQYXNzJyksXG4gICAgfSk7XG5cbiAgICBjb25zdCBwYXJlbnQgPSBuZXcgc2ZuLlN0YXRlTWFjaGluZSh0aGlzLCAnUGFyZW50Jywge1xuICAgICAgZGVmaW5pdGlvbjogbmV3IHNmbi5UYXNrKHRoaXMsICdUYXNrJywge1xuICAgICAgICB0YXNrOiBuZXcgdGFza3MuU3RhcnRFeGVjdXRpb24oY2hpbGQsIHtcbiAgICAgICAgICBpbnB1dDoge1xuICAgICAgICAgICAgaGVsbG86IHNmbi5Kc29uUGF0aC5zdHJpbmdBdCgnJC5oZWxsbycpLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgaW50ZWdyYXRpb25QYXR0ZXJuOiBzZm4uU2VydmljZUludGVncmF0aW9uUGF0dGVybi5TWU5DLFxuICAgICAgICB9KSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgbmV3IENmbk91dHB1dCh0aGlzLCAnU3RhdGVNYWNoaW5lQVJOJywge1xuICAgICAgdmFsdWU6IHBhcmVudC5zdGF0ZU1hY2hpbmVBcm4sXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG5uZXcgVGVzdFN0YWNrKGFwcCwgJ2ludGVnLXNmbi1zdGFydC1leGVjdXRpb24nKTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=