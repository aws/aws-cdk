"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const cdk = require("@aws-cdk/core");
const lambda = require("../lib");
class TestStack extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        /// !show
        new lambda.Function(this, 'MyLambda', {
            code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
            handler: 'index.main',
            runtime: lambda.Runtime.PYTHON_3_9,
        });
    }
}
const app = new cdk.App();
new TestStack(app, 'lambda-test-assets-file');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYXNzZXRzLmZpbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5hc3NldHMuZmlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE2QjtBQUM3QixxQ0FBcUM7QUFDckMsaUNBQWlDO0FBRWpDLE1BQU0sU0FBVSxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQy9CLFlBQVksS0FBYyxFQUFFLEVBQVU7UUFDcEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixTQUFTO1FBQ1QsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDcEMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQ2hFLE9BQU8sRUFBRSxZQUFZO1lBQ3JCLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVU7U0FDbkMsQ0FBQyxDQUFDO0tBRUo7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO0FBRTlDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnLi4vbGliJztcblxuY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgLy8vICFzaG93XG4gICAgbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnTXlMYW1iZGEnLCB7XG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ2hhbmRsZXIuemlwJykpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4Lm1haW4nLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfOSxcbiAgICB9KTtcbiAgICAvLy8gIWhpZGVcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5uZXcgVGVzdFN0YWNrKGFwcCwgJ2xhbWJkYS10ZXN0LWFzc2V0cy1maWxlJyk7XG5cbmFwcC5zeW50aCgpO1xuIl19