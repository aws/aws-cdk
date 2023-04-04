"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sfn = require("aws-cdk-lib/aws-stepfunctions");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_stepfunctions_tasks_1 = require("aws-cdk-lib/aws-stepfunctions-tasks");
/*
 * Stack verification steps:
 * * aws stepfunctions start-execution --input '{"hello": "world"}' --state-machine-arn <StateMachineARN>
 * * aws stepfunctions describe-execution --execution-arn <execution-arn>
 * * The output here should contain `status: "SUCCEEDED"` and `output`: '"Output": { "hello": "world"},'
 */
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        const child = new sfn.StateMachine(this, 'Child', {
            definition: new sfn.Pass(this, 'Pass'),
        });
        const parent = new sfn.StateMachine(this, 'Parent', {
            definition: new aws_stepfunctions_tasks_1.StepFunctionsStartExecution(this, 'Task', {
                stateMachine: child,
                input: sfn.TaskInput.fromObject({
                    hello: sfn.JsonPath.stringAt('$.hello'),
                }),
                integrationPattern: sfn.IntegrationPattern.RUN_JOB,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc3RhcnQtZXhlY3V0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuc3RhcnQtZXhlY3V0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscURBQXFEO0FBQ3JELDZDQUFvRDtBQUVwRCxpRkFBa0Y7QUFFbEY7Ozs7O0dBS0c7QUFFSCxNQUFNLFNBQVUsU0FBUSxtQkFBSztJQUMzQixZQUFZLEtBQWdCLEVBQUUsRUFBVTtRQUN0QyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO1lBQ2hELFVBQVUsRUFBRSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztTQUN2QyxDQUFDLENBQUM7UUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUNsRCxVQUFVLEVBQUUsSUFBSSxxREFBMkIsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFO2dCQUN4RCxZQUFZLEVBQUUsS0FBSztnQkFDbkIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO29CQUM5QixLQUFLLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDO2lCQUN4QyxDQUFDO2dCQUNGLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPO2FBQ25ELENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxJQUFJLHVCQUFTLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO1lBQ3JDLEtBQUssRUFBRSxNQUFNLENBQUMsZUFBZTtTQUM5QixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUV0QixJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztBQUVoRCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBzZm4gZnJvbSAnYXdzLWNkay1saWIvYXdzLXN0ZXBmdW5jdGlvbnMnO1xuaW1wb3J0IHsgQXBwLCBDZm5PdXRwdXQsIFN0YWNrIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBTdGVwRnVuY3Rpb25zU3RhcnRFeGVjdXRpb24gfSBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3RlcGZ1bmN0aW9ucy10YXNrcyc7XG5cbi8qXG4gKiBTdGFjayB2ZXJpZmljYXRpb24gc3RlcHM6XG4gKiAqIGF3cyBzdGVwZnVuY3Rpb25zIHN0YXJ0LWV4ZWN1dGlvbiAtLWlucHV0ICd7XCJoZWxsb1wiOiBcIndvcmxkXCJ9JyAtLXN0YXRlLW1hY2hpbmUtYXJuIDxTdGF0ZU1hY2hpbmVBUk4+XG4gKiAqIGF3cyBzdGVwZnVuY3Rpb25zIGRlc2NyaWJlLWV4ZWN1dGlvbiAtLWV4ZWN1dGlvbi1hcm4gPGV4ZWN1dGlvbi1hcm4+XG4gKiAqIFRoZSBvdXRwdXQgaGVyZSBzaG91bGQgY29udGFpbiBgc3RhdHVzOiBcIlNVQ0NFRURFRFwiYCBhbmQgYG91dHB1dGA6ICdcIk91dHB1dFwiOiB7IFwiaGVsbG9cIjogXCJ3b3JsZFwifSwnXG4gKi9cblxuY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IGNoaWxkID0gbmV3IHNmbi5TdGF0ZU1hY2hpbmUodGhpcywgJ0NoaWxkJywge1xuICAgICAgZGVmaW5pdGlvbjogbmV3IHNmbi5QYXNzKHRoaXMsICdQYXNzJyksXG4gICAgfSk7XG5cbiAgICBjb25zdCBwYXJlbnQgPSBuZXcgc2ZuLlN0YXRlTWFjaGluZSh0aGlzLCAnUGFyZW50Jywge1xuICAgICAgZGVmaW5pdGlvbjogbmV3IFN0ZXBGdW5jdGlvbnNTdGFydEV4ZWN1dGlvbih0aGlzLCAnVGFzaycsIHtcbiAgICAgICAgc3RhdGVNYWNoaW5lOiBjaGlsZCxcbiAgICAgICAgaW5wdXQ6IHNmbi5UYXNrSW5wdXQuZnJvbU9iamVjdCh7XG4gICAgICAgICAgaGVsbG86IHNmbi5Kc29uUGF0aC5zdHJpbmdBdCgnJC5oZWxsbycpLFxuICAgICAgICB9KSxcbiAgICAgICAgaW50ZWdyYXRpb25QYXR0ZXJuOiBzZm4uSW50ZWdyYXRpb25QYXR0ZXJuLlJVTl9KT0IsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgJ1N0YXRlTWFjaGluZUFSTicsIHtcbiAgICAgIHZhbHVlOiBwYXJlbnQuc3RhdGVNYWNoaW5lQXJuLFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxubmV3IFRlc3RTdGFjayhhcHAsICdpbnRlZy1zZm4tc3RhcnQtZXhlY3V0aW9uJyk7XG5cbmFwcC5zeW50aCgpO1xuIl19