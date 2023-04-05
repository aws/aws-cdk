"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sfn = require("aws-cdk-lib/aws-stepfunctions");
const cdk = require("aws-cdk-lib");
const tasks = require("aws-cdk-lib/aws-stepfunctions-tasks");
/*
 * Stack verification steps:
 * * aws stepfunctions start-execution --input '{"a": 3, "b": 4}' --state-machine-arn <StateMachineARN>
 * * aws stepfunctions describe-execution --execution-arn <execution-arn>
 * * The output here should contain `status: "SUCCEEDED"` and `output: "{ a: 3, b: 4, c: 7, d: 14, now: <current date> }"
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-integ');
const sum = new tasks.EvaluateExpression(stack, 'Sum', {
    expression: '$.a + $.b',
    resultPath: '$.c',
});
const multiply = new tasks.EvaluateExpression(stack, 'Multiply', {
    expression: '$.c * 2',
    resultPath: '$.d',
});
const now = new tasks.EvaluateExpression(stack, 'Now', {
    expression: '(new Date()).toUTCString()',
    resultPath: '$.now',
});
const statemachine = new sfn.StateMachine(stack, 'StateMachine', {
    definition: sum
        .next(multiply)
        .next(new sfn.Wait(stack, 'Wait', {
        time: sfn.WaitTime.secondsPath('$.d'),
    }))
        .next(now),
});
new cdk.CfnOutput(stack, 'StateMachineARN', {
    value: statemachine.stateMachineArn,
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZXZhbHVhdGUtZXhwcmVzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmV2YWx1YXRlLWV4cHJlc3Npb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBcUQ7QUFDckQsbUNBQW1DO0FBQ25DLDZEQUE2RDtBQUU3RDs7Ozs7R0FLRztBQUVILE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUseUJBQXlCLENBQUMsQ0FBQztBQUU1RCxNQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO0lBQ3JELFVBQVUsRUFBRSxXQUFXO0lBQ3ZCLFVBQVUsRUFBRSxLQUFLO0NBQ2xCLENBQUMsQ0FBQztBQUVILE1BQU0sUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7SUFDL0QsVUFBVSxFQUFFLFNBQVM7SUFDckIsVUFBVSxFQUFFLEtBQUs7Q0FDbEIsQ0FBQyxDQUFDO0FBRUgsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtJQUNyRCxVQUFVLEVBQUUsNEJBQTRCO0lBQ3hDLFVBQVUsRUFBRSxPQUFPO0NBQ3BCLENBQUMsQ0FBQztBQUVILE1BQU0sWUFBWSxHQUFHLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsY0FBYyxFQUFFO0lBQy9ELFVBQVUsRUFBRSxHQUFHO1NBQ1osSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUNkLElBQUksQ0FDSCxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtRQUMxQixJQUFJLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO0tBQ3RDLENBQUMsQ0FDSDtTQUNBLElBQUksQ0FBQyxHQUFHLENBQUM7Q0FDYixDQUFDLENBQUM7QUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLGlCQUFpQixFQUFFO0lBQzFDLEtBQUssRUFBRSxZQUFZLENBQUMsZUFBZTtDQUNwQyxDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBzZm4gZnJvbSAnYXdzLWNkay1saWIvYXdzLXN0ZXBmdW5jdGlvbnMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIHRhc2tzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zdGVwZnVuY3Rpb25zLXRhc2tzJztcblxuLypcbiAqIFN0YWNrIHZlcmlmaWNhdGlvbiBzdGVwczpcbiAqICogYXdzIHN0ZXBmdW5jdGlvbnMgc3RhcnQtZXhlY3V0aW9uIC0taW5wdXQgJ3tcImFcIjogMywgXCJiXCI6IDR9JyAtLXN0YXRlLW1hY2hpbmUtYXJuIDxTdGF0ZU1hY2hpbmVBUk4+XG4gKiAqIGF3cyBzdGVwZnVuY3Rpb25zIGRlc2NyaWJlLWV4ZWN1dGlvbiAtLWV4ZWN1dGlvbi1hcm4gPGV4ZWN1dGlvbi1hcm4+XG4gKiAqIFRoZSBvdXRwdXQgaGVyZSBzaG91bGQgY29udGFpbiBgc3RhdHVzOiBcIlNVQ0NFRURFRFwiYCBhbmQgYG91dHB1dDogXCJ7IGE6IDMsIGI6IDQsIGM6IDcsIGQ6IDE0LCBub3c6IDxjdXJyZW50IGRhdGU+IH1cIlxuICovXG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnYXdzLXN0ZXBmdW5jdGlvbnMtaW50ZWcnKTtcblxuY29uc3Qgc3VtID0gbmV3IHRhc2tzLkV2YWx1YXRlRXhwcmVzc2lvbihzdGFjaywgJ1N1bScsIHtcbiAgZXhwcmVzc2lvbjogJyQuYSArICQuYicsXG4gIHJlc3VsdFBhdGg6ICckLmMnLFxufSk7XG5cbmNvbnN0IG11bHRpcGx5ID0gbmV3IHRhc2tzLkV2YWx1YXRlRXhwcmVzc2lvbihzdGFjaywgJ011bHRpcGx5Jywge1xuICBleHByZXNzaW9uOiAnJC5jICogMicsXG4gIHJlc3VsdFBhdGg6ICckLmQnLFxufSk7XG5cbmNvbnN0IG5vdyA9IG5ldyB0YXNrcy5FdmFsdWF0ZUV4cHJlc3Npb24oc3RhY2ssICdOb3cnLCB7XG4gIGV4cHJlc3Npb246ICcobmV3IERhdGUoKSkudG9VVENTdHJpbmcoKScsXG4gIHJlc3VsdFBhdGg6ICckLm5vdycsXG59KTtcblxuY29uc3Qgc3RhdGVtYWNoaW5lID0gbmV3IHNmbi5TdGF0ZU1hY2hpbmUoc3RhY2ssICdTdGF0ZU1hY2hpbmUnLCB7XG4gIGRlZmluaXRpb246IHN1bVxuICAgIC5uZXh0KG11bHRpcGx5KVxuICAgIC5uZXh0KFxuICAgICAgbmV3IHNmbi5XYWl0KHN0YWNrLCAnV2FpdCcsIHtcbiAgICAgICAgdGltZTogc2ZuLldhaXRUaW1lLnNlY29uZHNQYXRoKCckLmQnKSxcbiAgICAgIH0pLFxuICAgIClcbiAgICAubmV4dChub3cpLFxufSk7XG5cbm5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrLCAnU3RhdGVNYWNoaW5lQVJOJywge1xuICB2YWx1ZTogc3RhdGVtYWNoaW5lLnN0YXRlTWFjaGluZUFybixcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==