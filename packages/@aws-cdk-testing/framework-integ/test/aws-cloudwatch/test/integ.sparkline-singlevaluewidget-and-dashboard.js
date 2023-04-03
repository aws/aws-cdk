"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_cloudwatch_1 = require("aws-cdk-lib/aws-cloudwatch");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const dashboard = new aws_cloudwatch_1.Dashboard(this, 'Dashboard');
        const testMetric = new aws_cloudwatch_1.Metric({
            namespace: 'CDK/Test',
            metricName: 'Metric',
        });
        const widget = new aws_cloudwatch_1.SingleValueWidget({
            metrics: [testMetric],
            sparkline: true,
        });
        dashboard.addWidgets(widget);
    }
}
const app = new aws_cdk_lib_1.App();
const testCase = new TestStack(app, 'aws-cdk-cloudwatch-singlevaluewidget-sparkline-integ');
new integ_tests_alpha_1.IntegTest(app, 'singlevaluewidget-with-sparkline', {
    testCases: [testCase],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc3BhcmtsaW5lLXNpbmdsZXZhbHVld2lkZ2V0LWFuZC1kYXNoYm9hcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5zcGFya2xpbmUtc2luZ2xldmFsdWV3aWRnZXQtYW5kLWRhc2hib2FyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUFxRDtBQUNyRCxrRUFBdUQ7QUFDdkQsK0RBQWtGO0FBRWxGLE1BQU0sU0FBVSxTQUFRLG1CQUFLO0lBQzNCLFlBQVksS0FBVSxFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUNwRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLFNBQVMsR0FBRyxJQUFJLDBCQUFTLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRW5ELE1BQU0sVUFBVSxHQUFHLElBQUksdUJBQU0sQ0FBQztZQUM1QixTQUFTLEVBQUUsVUFBVTtZQUNyQixVQUFVLEVBQUUsUUFBUTtTQUNyQixDQUFDLENBQUM7UUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLGtDQUFpQixDQUFDO1lBQ25DLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQztZQUNyQixTQUFTLEVBQUUsSUFBSTtTQUNoQixDQUFDLENBQUM7UUFFSCxTQUFTLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9CLENBQUM7Q0FDRjtBQUNELE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sUUFBUSxHQUFHLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSxzREFBc0QsQ0FBQyxDQUFDO0FBQzVGLElBQUksNkJBQVMsQ0FBQyxHQUFHLEVBQUUsa0NBQWtDLEVBQUU7SUFDckQsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDO0NBQ3RCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcCwgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5pbXBvcnQgeyBEYXNoYm9hcmQsIFNpbmdsZVZhbHVlV2lkZ2V0LCBNZXRyaWMgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY2xvdWR3YXRjaCc7XG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IEFwcCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBkYXNoYm9hcmQgPSBuZXcgRGFzaGJvYXJkKHRoaXMsICdEYXNoYm9hcmQnKTtcblxuICAgIGNvbnN0IHRlc3RNZXRyaWMgPSBuZXcgTWV0cmljKHtcbiAgICAgIG5hbWVzcGFjZTogJ0NESy9UZXN0JyxcbiAgICAgIG1ldHJpY05hbWU6ICdNZXRyaWMnLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgd2lkZ2V0ID0gbmV3IFNpbmdsZVZhbHVlV2lkZ2V0KHtcbiAgICAgIG1ldHJpY3M6IFt0ZXN0TWV0cmljXSxcbiAgICAgIHNwYXJrbGluZTogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGRhc2hib2FyZC5hZGRXaWRnZXRzKHdpZGdldCk7XG4gIH1cbn1cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbmNvbnN0IHRlc3RDYXNlID0gbmV3IFRlc3RTdGFjayhhcHAsICdhd3MtY2RrLWNsb3Vkd2F0Y2gtc2luZ2xldmFsdWV3aWRnZXQtc3BhcmtsaW5lLWludGVnJyk7XG5uZXcgSW50ZWdUZXN0KGFwcCwgJ3NpbmdsZXZhbHVld2lkZ2V0LXdpdGgtc3BhcmtsaW5lJywge1xuICB0ZXN0Q2FzZXM6IFt0ZXN0Q2FzZV0sXG59KTtcbiJdfQ==