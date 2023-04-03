"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kms = require("aws-cdk-lib/aws-kms");
const lambda = require("aws-cdk-lib/aws-lambda");
const cdk = require("aws-cdk-lib");
const secretsmanager = require("aws-cdk-lib/aws-secretsmanager");
class TestStack extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        const key = new kms.Key(this, 'Key', { removalPolicy: cdk.RemovalPolicy.DESTROY });
        const secret = new secretsmanager.Secret(this, 'Secret', {
            encryptionKey: key,
        });
        secret.addRotationSchedule('Schedule', {
            rotationLambda: new lambda.Function(this, 'Lambda', {
                runtime: lambda.Runtime.NODEJS_14_X,
                handler: 'index.handler',
                code: lambda.Code.fromInline('NOOP'),
            }),
        });
    }
}
const app = new cdk.App();
new TestStack(app, 'cdk-integ-secret-lambda-rotation');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubGFtYmRhLXJvdGF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcubGFtYmRhLXJvdGF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkNBQTJDO0FBQzNDLGlEQUFpRDtBQUNqRCxtQ0FBbUM7QUFDbkMsaUVBQWlFO0FBRWpFLE1BQU0sU0FBVSxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQy9CLFlBQVksS0FBYyxFQUFFLEVBQVU7UUFDcEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFFbkYsTUFBTSxNQUFNLEdBQUcsSUFBSSxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDdkQsYUFBYSxFQUFFLEdBQUc7U0FDbkIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsRUFBRTtZQUNyQyxjQUFjLEVBQUUsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7Z0JBQ2xELE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7Z0JBQ25DLE9BQU8sRUFBRSxlQUFlO2dCQUN4QixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO2FBQ3JDLENBQUM7U0FDSCxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsa0NBQWtDLENBQUMsQ0FBQztBQUN2RCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBrbXMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWttcyc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgc2VjcmV0c21hbmFnZXIgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNlY3JldHNtYW5hZ2VyJztcblxuY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3Qga2V5ID0gbmV3IGttcy5LZXkodGhpcywgJ0tleScsIHsgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSB9KTtcblxuICAgIGNvbnN0IHNlY3JldCA9IG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQodGhpcywgJ1NlY3JldCcsIHtcbiAgICAgIGVuY3J5cHRpb25LZXk6IGtleSxcbiAgICB9KTtcblxuICAgIHNlY3JldC5hZGRSb3RhdGlvblNjaGVkdWxlKCdTY2hlZHVsZScsIHtcbiAgICAgIHJvdGF0aW9uTGFtYmRhOiBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdMYW1iZGEnLCB7XG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ05PT1AnKSxcbiAgICAgIH0pLFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5uZXcgVGVzdFN0YWNrKGFwcCwgJ2Nkay1pbnRlZy1zZWNyZXQtbGFtYmRhLXJvdGF0aW9uJyk7XG5hcHAuc3ludGgoKTtcbiJdfQ==