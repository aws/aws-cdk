"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const core_1 = require("@aws-cdk/core");
const cx_api_1 = require("@aws-cdk/cx-api");
const lambda = require("../lib");
class TestStack extends core_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        const handler = new lambda.Function(this, 'MyLambda', {
            code: lambda.Code.fromAsset(path.join(__dirname, 'layer-code')),
            handler: 'index.main',
            runtime: lambda.Runtime.PYTHON_3_8,
            currentVersionOptions: {
                removalPolicy: core_1.RemovalPolicy.RETAIN,
                retryAttempts: 1,
            },
        });
        handler.currentVersion.addAlias('live');
    }
}
const app = new core_1.App();
const stack = new TestStack(app, 'lambda-test-current-version');
// Changes the function description when the feature flag is present
// to validate the changed function hash.
core_1.Aspects.of(stack).add(new lambda.FunctionVersionUpgrade(cx_api_1.LAMBDA_RECOGNIZE_LAYER_VERSION));
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY3VycmVudC12ZXJzaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuY3VycmVudC12ZXJzaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZCO0FBQzdCLHdDQUFtRTtBQUNuRSw0Q0FBaUU7QUFDakUsaUNBQWlDO0FBRWpDLE1BQU0sU0FBVSxTQUFRLFlBQUs7SUFDM0IsWUFBWSxLQUFVLEVBQUUsRUFBVTtRQUNoQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sT0FBTyxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3BELElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUMvRCxPQUFPLEVBQUUsWUFBWTtZQUNyQixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVO1lBQ2xDLHFCQUFxQixFQUFFO2dCQUNyQixhQUFhLEVBQUUsb0JBQWEsQ0FBQyxNQUFNO2dCQUNuQyxhQUFhLEVBQUUsQ0FBQzthQUNqQjtTQUNGLENBQUMsQ0FBQztRQUVILE9BQU8sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ3pDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQUcsRUFBRSxDQUFDO0FBRXRCLE1BQU0sS0FBSyxHQUFHLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSw2QkFBNkIsQ0FBQyxDQUFDO0FBRWhFLG9FQUFvRTtBQUNwRSx5Q0FBeUM7QUFDekMsY0FBTyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxNQUFNLENBQUMsc0JBQXNCLENBQUMsdUNBQThCLENBQUMsQ0FBQyxDQUFDO0FBRXpGLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBBc3BlY3RzLCBBcHAsIFJlbW92YWxQb2xpY3ksIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBMQU1CREFfUkVDT0dOSVpFX0xBWUVSX1ZFUlNJT04gfSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJy4uL2xpYic7XG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IEFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBoYW5kbGVyID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnTXlMYW1iZGEnLCB7XG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ2xheWVyLWNvZGUnKSksXG4gICAgICBoYW5kbGVyOiAnaW5kZXgubWFpbicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5QWVRIT05fM184LFxuICAgICAgY3VycmVudFZlcnNpb25PcHRpb25zOiB7XG4gICAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuUkVUQUlOLFxuICAgICAgICByZXRyeUF0dGVtcHRzOiAxLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGhhbmRsZXIuY3VycmVudFZlcnNpb24uYWRkQWxpYXMoJ2xpdmUnKTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IFRlc3RTdGFjayhhcHAsICdsYW1iZGEtdGVzdC1jdXJyZW50LXZlcnNpb24nKTtcblxuLy8gQ2hhbmdlcyB0aGUgZnVuY3Rpb24gZGVzY3JpcHRpb24gd2hlbiB0aGUgZmVhdHVyZSBmbGFnIGlzIHByZXNlbnRcbi8vIHRvIHZhbGlkYXRlIHRoZSBjaGFuZ2VkIGZ1bmN0aW9uIGhhc2guXG5Bc3BlY3RzLm9mKHN0YWNrKS5hZGQobmV3IGxhbWJkYS5GdW5jdGlvblZlcnNpb25VcGdyYWRlKExBTUJEQV9SRUNPR05JWkVfTEFZRVJfVkVSU0lPTikpO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==