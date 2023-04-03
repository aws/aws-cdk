"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Test = void 0;
const cdk = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const apigateway = require("../lib");
class Test extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        const api = new apigateway.RestApi(this, 'my-api', {
            retainDeployments: true,
        });
        api.root.addMethod('GET'); // must have at least one method or an API definition
    }
}
exports.Test = Test;
const app = new cdk.App();
new integ_tests_1.IntegTest(app, 'cloudwatch-logs-disabled', {
    testCases: [
        new Test(app, 'default-api'),
    ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY2xvdWR3YXRjaC1kaXNhYmxlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmNsb3Vkd2F0Y2gtZGlzYWJsZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXFDO0FBQ3JDLHNEQUFpRDtBQUNqRCxxQ0FBcUM7QUFFckMsTUFBYSxJQUFLLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDakMsWUFBWSxLQUFjLEVBQUUsRUFBVTtRQUNwQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2pCLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQ2pELGlCQUFpQixFQUFFLElBQUk7U0FDeEIsQ0FBQyxDQUFDO1FBQ0gsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxxREFBcUQ7S0FDakY7Q0FDRjtBQVJELG9CQVFDO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsSUFBSSx1QkFBUyxDQUFDLEdBQUcsRUFBRSwwQkFBMEIsRUFBRTtJQUM3QyxTQUFTLEVBQUU7UUFDVCxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsYUFBYSxDQUFDO0tBQzdCO0NBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMnO1xuaW1wb3J0ICogYXMgYXBpZ2F0ZXdheSBmcm9tICcuLi9saWInO1xuXG5leHBvcnQgY2xhc3MgVGVzdCBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHRoaXMsICdteS1hcGknLCB7XG4gICAgICByZXRhaW5EZXBsb3ltZW50czogdHJ1ZSxcbiAgICB9KTtcbiAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcpOyAvLyBtdXN0IGhhdmUgYXQgbGVhc3Qgb25lIG1ldGhvZCBvciBhbiBBUEkgZGVmaW5pdGlvblxuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5uZXcgSW50ZWdUZXN0KGFwcCwgJ2Nsb3Vkd2F0Y2gtbG9ncy1kaXNhYmxlZCcsIHtcbiAgdGVzdENhc2VzOiBbXG4gICAgbmV3IFRlc3QoYXBwLCAnZGVmYXVsdC1hcGknKSxcbiAgXSxcbn0pO1xuIl19