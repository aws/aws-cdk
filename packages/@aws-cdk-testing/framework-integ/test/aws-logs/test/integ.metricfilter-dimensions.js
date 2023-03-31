"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_logs_1 = require("aws-cdk-lib/aws-logs");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const logGroup = new aws_logs_1.LogGroup(this, 'LogGroup', {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
        });
        new aws_logs_1.MetricFilter(this, 'MetricFilter', {
            logGroup,
            metricNamespace: 'MyApp',
            metricName: 'Latency',
            filterPattern: aws_logs_1.FilterPattern.exists('$.latency'),
            metricValue: '$.latency',
            dimensions: {
                ErrorCode: '$.errorCode',
            },
        });
    }
}
const app = new aws_cdk_lib_1.App();
const testCase = new TestStack(app, 'aws-cdk-metricfilter-dimensions-integ');
new integ_tests_alpha_1.IntegTest(app, 'metricfilter-dimensions', {
    testCases: [testCase],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubWV0cmljZmlsdGVyLWRpbWVuc2lvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5tZXRyaWNmaWx0ZXItZGltZW5zaW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUFvRTtBQUNwRSxrRUFBdUQ7QUFDdkQsbURBQTZFO0FBRTdFLE1BQU0sU0FBVSxTQUFRLG1CQUFLO0lBQzNCLFlBQVksS0FBVSxFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUNwRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLFFBQVEsR0FBRyxJQUFJLG1CQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUM5QyxhQUFhLEVBQUUsMkJBQWEsQ0FBQyxPQUFPO1NBQ3JDLENBQUMsQ0FBQztRQUVILElBQUksdUJBQVksQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ3JDLFFBQVE7WUFDUixlQUFlLEVBQUUsT0FBTztZQUN4QixVQUFVLEVBQUUsU0FBUztZQUNyQixhQUFhLEVBQUUsd0JBQWEsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO1lBQ2hELFdBQVcsRUFBRSxXQUFXO1lBQ3hCLFVBQVUsRUFBRTtnQkFDVixTQUFTLEVBQUUsYUFBYTthQUN6QjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sUUFBUSxHQUFHLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSx1Q0FBdUMsQ0FBQyxDQUFDO0FBRTdFLElBQUksNkJBQVMsQ0FBQyxHQUFHLEVBQUUseUJBQXlCLEVBQUU7SUFDNUMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDO0NBQ3RCLENBQUMsQ0FBQztBQUNILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcCwgUmVtb3ZhbFBvbGljeSwgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5pbXBvcnQgeyBGaWx0ZXJQYXR0ZXJuLCBMb2dHcm91cCwgTWV0cmljRmlsdGVyIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWxvZ3MnO1xuXG5jbGFzcyBUZXN0U3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBBcHAsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgbG9nR3JvdXAgPSBuZXcgTG9nR3JvdXAodGhpcywgJ0xvZ0dyb3VwJywge1xuICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgIH0pO1xuXG4gICAgbmV3IE1ldHJpY0ZpbHRlcih0aGlzLCAnTWV0cmljRmlsdGVyJywge1xuICAgICAgbG9nR3JvdXAsXG4gICAgICBtZXRyaWNOYW1lc3BhY2U6ICdNeUFwcCcsXG4gICAgICBtZXRyaWNOYW1lOiAnTGF0ZW5jeScsXG4gICAgICBmaWx0ZXJQYXR0ZXJuOiBGaWx0ZXJQYXR0ZXJuLmV4aXN0cygnJC5sYXRlbmN5JyksXG4gICAgICBtZXRyaWNWYWx1ZTogJyQubGF0ZW5jeScsXG4gICAgICBkaW1lbnNpb25zOiB7XG4gICAgICAgIEVycm9yQ29kZTogJyQuZXJyb3JDb2RlJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuY29uc3QgdGVzdENhc2UgPSBuZXcgVGVzdFN0YWNrKGFwcCwgJ2F3cy1jZGstbWV0cmljZmlsdGVyLWRpbWVuc2lvbnMtaW50ZWcnKTtcblxubmV3IEludGVnVGVzdChhcHAsICdtZXRyaWNmaWx0ZXItZGltZW5zaW9ucycsIHtcbiAgdGVzdENhc2VzOiBbdGVzdENhc2VdLFxufSk7XG5hcHAuc3ludGgoKTtcbiJdfQ==