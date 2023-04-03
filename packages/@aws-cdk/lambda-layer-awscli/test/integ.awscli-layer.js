"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const lambda = require("@aws-cdk/aws-lambda");
const cdk = require("@aws-cdk/core");
const cr = require("@aws-cdk/custom-resources");
const integ = require("@aws-cdk/integ-tests");
const lib_1 = require("../lib");
/**
 * Test verifies that AWS CLI is invoked successfully inside Lambda runtime.
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'lambda-layer-awscli-integ-stack');
const layer = new lib_1.AwsCliLayer(stack, 'AwsCliLayer');
const runtimes = [
    lambda.Runtime.PYTHON_3_7,
    lambda.Runtime.PYTHON_3_9,
];
for (const runtime of runtimes) {
    const provider = new cr.Provider(stack, `Provider${runtime.name}`, {
        onEventHandler: new lambda.Function(stack, `Lambda$${runtime.name}`, {
            code: lambda.Code.fromAsset(path.join(__dirname, 'lambda-handler')),
            handler: 'index.handler',
            runtime: runtime,
            layers: [layer],
            memorySize: 512,
            timeout: cdk.Duration.seconds(30),
        }),
    });
    new cdk.CustomResource(stack, `CustomResource${runtime.name}`, {
        serviceToken: provider.serviceToken,
    });
}
new integ.IntegTest(app, 'lambda-layer-awscli-integ-test', {
    testCases: [stack],
    cdkCommandOptions: {
        deploy: {
            args: {
                rollback: true,
            },
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYXdzY2xpLWxheWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuYXdzY2xpLWxheWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZCO0FBQzdCLDhDQUE4QztBQUM5QyxxQ0FBcUM7QUFDckMsZ0RBQWdEO0FBQ2hELDhDQUE4QztBQUU5QyxnQ0FBcUM7QUFFckM7O0dBRUc7QUFFSCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLGlDQUFpQyxDQUFDLENBQUM7QUFDcEUsTUFBTSxLQUFLLEdBQUcsSUFBSSxpQkFBVyxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztBQUVwRCxNQUFNLFFBQVEsR0FBRztJQUNmLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVTtJQUN6QixNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVU7Q0FDMUIsQ0FBQztBQUVGLEtBQUssTUFBTSxPQUFPLElBQUksUUFBUSxFQUFFO0lBQzlCLE1BQU0sUUFBUSxHQUFHLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsV0FBVyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDakUsY0FBYyxFQUFFLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDbkUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFDbkUsT0FBTyxFQUFFLGVBQWU7WUFDeEIsT0FBTyxFQUFFLE9BQU87WUFDaEIsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDO1lBQ2YsVUFBVSxFQUFFLEdBQUc7WUFDZixPQUFPLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1NBQ2xDLENBQUM7S0FDSCxDQUFDLENBQUM7SUFFSCxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLGlCQUFpQixPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDN0QsWUFBWSxFQUFFLFFBQVEsQ0FBQyxZQUFZO0tBQ3BDLENBQUMsQ0FBQztDQUNKO0FBRUQsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxnQ0FBZ0MsRUFBRTtJQUN6RCxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7SUFDbEIsaUJBQWlCLEVBQUU7UUFDakIsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFO2dCQUNKLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7U0FDRjtLQUNGO0NBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNyIGZyb20gJ0Bhd3MtY2RrL2N1c3RvbS1yZXNvdXJjZXMnO1xuaW1wb3J0ICogYXMgaW50ZWcgZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMnO1xuXG5pbXBvcnQgeyBBd3NDbGlMYXllciB9IGZyb20gJy4uL2xpYic7XG5cbi8qKlxuICogVGVzdCB2ZXJpZmllcyB0aGF0IEFXUyBDTEkgaXMgaW52b2tlZCBzdWNjZXNzZnVsbHkgaW5zaWRlIExhbWJkYSBydW50aW1lLlxuICovXG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnbGFtYmRhLWxheWVyLWF3c2NsaS1pbnRlZy1zdGFjaycpO1xuY29uc3QgbGF5ZXIgPSBuZXcgQXdzQ2xpTGF5ZXIoc3RhY2ssICdBd3NDbGlMYXllcicpO1xuXG5jb25zdCBydW50aW1lcyA9IFtcbiAgbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfNyxcbiAgbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfOSxcbl07XG5cbmZvciAoY29uc3QgcnVudGltZSBvZiBydW50aW1lcykge1xuICBjb25zdCBwcm92aWRlciA9IG5ldyBjci5Qcm92aWRlcihzdGFjaywgYFByb3ZpZGVyJHtydW50aW1lLm5hbWV9YCwge1xuICAgIG9uRXZlbnRIYW5kbGVyOiBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCBgTGFtYmRhJCR7cnVudGltZS5uYW1lfWAsIHtcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnbGFtYmRhLWhhbmRsZXInKSksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBydW50aW1lLFxuICAgICAgbGF5ZXJzOiBbbGF5ZXJdLFxuICAgICAgbWVtb3J5U2l6ZTogNTEyLFxuICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMzApLFxuICAgIH0pLFxuICB9KTtcblxuICBuZXcgY2RrLkN1c3RvbVJlc291cmNlKHN0YWNrLCBgQ3VzdG9tUmVzb3VyY2Uke3J1bnRpbWUubmFtZX1gLCB7XG4gICAgc2VydmljZVRva2VuOiBwcm92aWRlci5zZXJ2aWNlVG9rZW4sXG4gIH0pO1xufVxuXG5uZXcgaW50ZWcuSW50ZWdUZXN0KGFwcCwgJ2xhbWJkYS1sYXllci1hd3NjbGktaW50ZWctdGVzdCcsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxuICBjZGtDb21tYW5kT3B0aW9uczoge1xuICAgIGRlcGxveToge1xuICAgICAgYXJnczoge1xuICAgICAgICByb2xsYmFjazogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pO1xuIl19