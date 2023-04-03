"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const secretsmanager = require("../lib");
class TestStack extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        const secret = new secretsmanager.Secret(this, 'Secret');
        secret.addRotationSchedule('Schedule', {
            hostedRotation: secretsmanager.HostedRotation.mysqlSingleUser(),
        });
        const customSecret = new secretsmanager.Secret(this, 'CustomSecret', {
            generateSecretString: {
                excludeCharacters: '&@/',
            },
        });
        customSecret.addRotationSchedule('Schedule', {
            hostedRotation: secretsmanager.HostedRotation.mysqlSingleUser(),
        });
    }
}
const app = new cdk.App();
new TestStack(app, 'cdk-integ-secret-hosted-rotation');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuaG9zdGVkLXJvdGF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuaG9zdGVkLXJvdGF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQXFDO0FBQ3JDLHlDQUF5QztBQUV6QyxNQUFNLFNBQVUsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMvQixZQUFZLEtBQWMsRUFBRSxFQUFVO1FBQ3BDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxNQUFNLEdBQUcsSUFBSSxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN6RCxNQUFNLENBQUMsbUJBQW1CLENBQUMsVUFBVSxFQUFFO1lBQ3JDLGNBQWMsRUFBRSxjQUFjLENBQUMsY0FBYyxDQUFDLGVBQWUsRUFBRTtTQUNoRSxDQUFDLENBQUM7UUFFSCxNQUFNLFlBQVksR0FBRyxJQUFJLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUNuRSxvQkFBb0IsRUFBRTtnQkFDcEIsaUJBQWlCLEVBQUUsS0FBSzthQUN6QjtTQUNGLENBQUMsQ0FBQztRQUNILFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUU7WUFDM0MsY0FBYyxFQUFFLGNBQWMsQ0FBQyxjQUFjLENBQUMsZUFBZSxFQUFFO1NBQ2hFLENBQUMsQ0FBQztLQUNKO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsa0NBQWtDLENBQUMsQ0FBQztBQUN2RCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBzZWNyZXRzbWFuYWdlciBmcm9tICcuLi9saWInO1xuXG5jbGFzcyBUZXN0U3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBzZWNyZXQgPSBuZXcgc2VjcmV0c21hbmFnZXIuU2VjcmV0KHRoaXMsICdTZWNyZXQnKTtcbiAgICBzZWNyZXQuYWRkUm90YXRpb25TY2hlZHVsZSgnU2NoZWR1bGUnLCB7XG4gICAgICBob3N0ZWRSb3RhdGlvbjogc2VjcmV0c21hbmFnZXIuSG9zdGVkUm90YXRpb24ubXlzcWxTaW5nbGVVc2VyKCksXG4gICAgfSk7XG5cbiAgICBjb25zdCBjdXN0b21TZWNyZXQgPSBuZXcgc2VjcmV0c21hbmFnZXIuU2VjcmV0KHRoaXMsICdDdXN0b21TZWNyZXQnLCB7XG4gICAgICBnZW5lcmF0ZVNlY3JldFN0cmluZzoge1xuICAgICAgICBleGNsdWRlQ2hhcmFjdGVyczogJyZALycsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGN1c3RvbVNlY3JldC5hZGRSb3RhdGlvblNjaGVkdWxlKCdTY2hlZHVsZScsIHtcbiAgICAgIGhvc3RlZFJvdGF0aW9uOiBzZWNyZXRzbWFuYWdlci5Ib3N0ZWRSb3RhdGlvbi5teXNxbFNpbmdsZVVzZXIoKSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xubmV3IFRlc3RTdGFjayhhcHAsICdjZGstaW50ZWctc2VjcmV0LWhvc3RlZC1yb3RhdGlvbicpO1xuYXBwLnN5bnRoKCk7XG4iXX0=