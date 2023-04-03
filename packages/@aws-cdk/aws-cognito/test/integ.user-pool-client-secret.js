"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const secretsmanager = require("@aws-cdk/aws-secretsmanager");
const core_1 = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const lib_1 = require("../lib");
class TestStack extends core_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        const userpool = new lib_1.UserPool(this, 'pool', {
            removalPolicy: core_1.RemovalPolicy.DESTROY,
        });
        const client = userpool.addClient('client', { generateSecret: true });
        const secret = new secretsmanager.Secret(this, 'secret', {
            secretStringValue: client.userPoolClientSecret,
        });
        new core_1.CfnOutput(this, 'ClientSecretName', {
            value: secret.secretName,
        });
    }
}
const app = new core_1.App();
const testCase = new TestStack(app, 'integ-user-pool-client-secret');
new integ_tests_1.IntegTest(app, 'integ-user-pool-client-secret-test', {
    testCases: [testCase],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcudXNlci1wb29sLWNsaWVudC1zZWNyZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy51c2VyLXBvb2wtY2xpZW50LXNlY3JldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhEQUE4RDtBQUM5RCx3Q0FBcUU7QUFDckUsc0RBQWlEO0FBRWpELGdDQUFrQztBQUVsQyxNQUFNLFNBQVUsU0FBUSxZQUFLO0lBQzNCLFlBQVksS0FBZ0IsRUFBRSxFQUFVO1FBQ3RDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDakIsTUFBTSxRQUFRLEdBQUcsSUFBSSxjQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtZQUMxQyxhQUFhLEVBQUUsb0JBQWEsQ0FBQyxPQUFPO1NBQ3JDLENBQUMsQ0FBQztRQUVILE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDdEUsTUFBTSxNQUFNLEdBQUcsSUFBSSxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDdkQsaUJBQWlCLEVBQUUsTUFBTSxDQUFDLG9CQUFvQjtTQUMvQyxDQUFDLENBQUM7UUFFSCxJQUFJLGdCQUFTLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQ3RDLEtBQUssRUFBRSxNQUFNLENBQUMsVUFBVTtTQUN6QixDQUFDLENBQUM7S0FDSjtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztBQUN0QixNQUFNLFFBQVEsR0FBRyxJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsK0JBQStCLENBQUMsQ0FBQztBQUVyRSxJQUFJLHVCQUFTLENBQUMsR0FBRyxFQUFFLG9DQUFvQyxFQUFFO0lBQ3ZELFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQztDQUN0QixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBzZWNyZXRzbWFuYWdlciBmcm9tICdAYXdzLWNkay9hd3Mtc2VjcmV0c21hbmFnZXInO1xuaW1wb3J0IHsgQXBwLCBDZm5PdXRwdXQsIFJlbW92YWxQb2xpY3ksIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IFVzZXJQb29sIH0gZnJvbSAnLi4vbGliJztcblxuY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcbiAgICBjb25zdCB1c2VycG9vbCA9IG5ldyBVc2VyUG9vbCh0aGlzLCAncG9vbCcsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGNsaWVudCA9IHVzZXJwb29sLmFkZENsaWVudCgnY2xpZW50JywgeyBnZW5lcmF0ZVNlY3JldDogdHJ1ZSB9KTtcbiAgICBjb25zdCBzZWNyZXQgPSBuZXcgc2VjcmV0c21hbmFnZXIuU2VjcmV0KHRoaXMsICdzZWNyZXQnLCB7XG4gICAgICBzZWNyZXRTdHJpbmdWYWx1ZTogY2xpZW50LnVzZXJQb29sQ2xpZW50U2VjcmV0LFxuICAgIH0pO1xuXG4gICAgbmV3IENmbk91dHB1dCh0aGlzLCAnQ2xpZW50U2VjcmV0TmFtZScsIHtcbiAgICAgIHZhbHVlOiBzZWNyZXQuc2VjcmV0TmFtZSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5jb25zdCB0ZXN0Q2FzZSA9IG5ldyBUZXN0U3RhY2soYXBwLCAnaW50ZWctdXNlci1wb29sLWNsaWVudC1zZWNyZXQnKTtcblxubmV3IEludGVnVGVzdChhcHAsICdpbnRlZy11c2VyLXBvb2wtY2xpZW50LXNlY3JldC10ZXN0Jywge1xuICB0ZXN0Q2FzZXM6IFt0ZXN0Q2FzZV0sXG59KTtcbiJdfQ==