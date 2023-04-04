"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cloudwatch_1 = require("aws-cdk-lib/aws-cloudwatch");
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
            unit: aws_cloudwatch_1.Unit.MILLISECONDS,
        });
    }
}
const app = new aws_cdk_lib_1.App();
const testCase = new TestStack(app, 'aws-cdk-metricfilter-unit-integ');
new integ_tests_alpha_1.IntegTest(app, 'metricfilter-unit', {
    testCases: [testCase],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubWV0cmljZmlsdGVyLXVuaXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5tZXRyaWNmaWx0ZXItdW5pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtEQUFrRDtBQUNsRCw2Q0FBb0U7QUFDcEUsa0VBQXVEO0FBQ3ZELG1EQUE2RTtBQUU3RSxNQUFNLFNBQVUsU0FBUSxtQkFBSztJQUMzQixZQUFZLEtBQVUsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDcEQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxtQkFBUSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDOUMsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztTQUNyQyxDQUFDLENBQUM7UUFFSCxJQUFJLHVCQUFZLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUNyQyxRQUFRO1lBQ1IsZUFBZSxFQUFFLE9BQU87WUFDeEIsVUFBVSxFQUFFLFNBQVM7WUFDckIsYUFBYSxFQUFFLHdCQUFhLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztZQUNoRCxXQUFXLEVBQUUsV0FBVztZQUN4QixVQUFVLEVBQUU7Z0JBQ1YsU0FBUyxFQUFFLGFBQWE7YUFDekI7WUFDRCxJQUFJLEVBQUUscUJBQUksQ0FBQyxZQUFZO1NBQ3hCLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sUUFBUSxHQUFHLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSxpQ0FBaUMsQ0FBQyxDQUFDO0FBRXZFLElBQUksNkJBQVMsQ0FBQyxHQUFHLEVBQUUsbUJBQW1CLEVBQUU7SUFDdEMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDO0NBQ3RCLENBQUMsQ0FBQztBQUNILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFVuaXQgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY2xvdWR3YXRjaCc7XG5pbXBvcnQgeyBBcHAsIFJlbW92YWxQb2xpY3ksIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgRmlsdGVyUGF0dGVybiwgTG9nR3JvdXAsIE1ldHJpY0ZpbHRlciB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1sb2dzJztcblxuY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IGxvZ0dyb3VwID0gbmV3IExvZ0dyb3VwKHRoaXMsICdMb2dHcm91cCcsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICB9KTtcblxuICAgIG5ldyBNZXRyaWNGaWx0ZXIodGhpcywgJ01ldHJpY0ZpbHRlcicsIHtcbiAgICAgIGxvZ0dyb3VwLFxuICAgICAgbWV0cmljTmFtZXNwYWNlOiAnTXlBcHAnLFxuICAgICAgbWV0cmljTmFtZTogJ0xhdGVuY3knLFxuICAgICAgZmlsdGVyUGF0dGVybjogRmlsdGVyUGF0dGVybi5leGlzdHMoJyQubGF0ZW5jeScpLFxuICAgICAgbWV0cmljVmFsdWU6ICckLmxhdGVuY3knLFxuICAgICAgZGltZW5zaW9uczoge1xuICAgICAgICBFcnJvckNvZGU6ICckLmVycm9yQ29kZScsXG4gICAgICB9LFxuICAgICAgdW5pdDogVW5pdC5NSUxMSVNFQ09ORFMsXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuY29uc3QgdGVzdENhc2UgPSBuZXcgVGVzdFN0YWNrKGFwcCwgJ2F3cy1jZGstbWV0cmljZmlsdGVyLXVuaXQtaW50ZWcnKTtcblxubmV3IEludGVnVGVzdChhcHAsICdtZXRyaWNmaWx0ZXItdW5pdCcsIHtcbiAgdGVzdENhc2VzOiBbdGVzdENhc2VdLFxufSk7XG5hcHAuc3ludGgoKTtcbiJdfQ==