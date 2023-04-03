"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const lib_1 = require("../lib");
class TestStack extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const dashboard = new lib_1.Dashboard(this, 'Dashboard');
        const testMetric = new lib_1.Metric({
            namespace: 'CDK/Test',
            metricName: 'Metric',
        });
        const widget = new lib_1.SingleValueWidget({
            metrics: [testMetric],
            sparkline: true,
        });
        dashboard.addWidgets(widget);
    }
}
const app = new core_1.App();
const testCase = new TestStack(app, 'aws-cdk-cloudwatch-singlevaluewidget-sparkline-integ');
new integ_tests_1.IntegTest(app, 'singlevaluewidget-with-sparkline', {
    testCases: [testCase],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc3BhcmtsaW5lLXNpbmdsZXZhbHVld2lkZ2V0LWFuZC1kYXNoYm9hcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5zcGFya2xpbmUtc2luZ2xldmFsdWV3aWRnZXQtYW5kLWRhc2hib2FyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdDQUF1RDtBQUN2RCxzREFBaUQ7QUFDakQsZ0NBQThEO0FBRTlELE1BQU0sU0FBVSxTQUFRLFlBQUs7SUFDM0IsWUFBWSxLQUFVLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQ3BELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sU0FBUyxHQUFHLElBQUksZUFBUyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztRQUVuRCxNQUFNLFVBQVUsR0FBRyxJQUFJLFlBQU0sQ0FBQztZQUM1QixTQUFTLEVBQUUsVUFBVTtZQUNyQixVQUFVLEVBQUUsUUFBUTtTQUNyQixDQUFDLENBQUM7UUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLHVCQUFpQixDQUFDO1lBQ25DLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQztZQUNyQixTQUFTLEVBQUUsSUFBSTtTQUNoQixDQUFDLENBQUM7UUFFSCxTQUFTLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzlCO0NBQ0Y7QUFDRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sUUFBUSxHQUFHLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSxzREFBc0QsQ0FBQyxDQUFDO0FBQzVGLElBQUksdUJBQVMsQ0FBQyxHQUFHLEVBQUUsa0NBQWtDLEVBQUU7SUFDckQsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDO0NBQ3RCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcCwgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEludGVnVGVzdCB9IGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzJztcbmltcG9ydCB7IERhc2hib2FyZCwgU2luZ2xlVmFsdWVXaWRnZXQsIE1ldHJpYyB9IGZyb20gJy4uL2xpYic7XG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IEFwcCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBkYXNoYm9hcmQgPSBuZXcgRGFzaGJvYXJkKHRoaXMsICdEYXNoYm9hcmQnKTtcblxuICAgIGNvbnN0IHRlc3RNZXRyaWMgPSBuZXcgTWV0cmljKHtcbiAgICAgIG5hbWVzcGFjZTogJ0NESy9UZXN0JyxcbiAgICAgIG1ldHJpY05hbWU6ICdNZXRyaWMnLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgd2lkZ2V0ID0gbmV3IFNpbmdsZVZhbHVlV2lkZ2V0KHtcbiAgICAgIG1ldHJpY3M6IFt0ZXN0TWV0cmljXSxcbiAgICAgIHNwYXJrbGluZTogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGRhc2hib2FyZC5hZGRXaWRnZXRzKHdpZGdldCk7XG4gIH1cbn1cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbmNvbnN0IHRlc3RDYXNlID0gbmV3IFRlc3RTdGFjayhhcHAsICdhd3MtY2RrLWNsb3Vkd2F0Y2gtc2luZ2xldmFsdWV3aWRnZXQtc3BhcmtsaW5lLWludGVnJyk7XG5uZXcgSW50ZWdUZXN0KGFwcCwgJ3NpbmdsZXZhbHVld2lkZ2V0LXdpdGgtc3BhcmtsaW5lJywge1xuICB0ZXN0Q2FzZXM6IFt0ZXN0Q2FzZV0sXG59KTtcbiJdfQ==