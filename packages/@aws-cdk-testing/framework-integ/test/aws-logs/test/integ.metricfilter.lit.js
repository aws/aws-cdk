"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_logs_1 = require("aws-cdk-lib/aws-logs");
class MetricFilterIntegStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const logGroup = new aws_logs_1.LogGroup(this, 'LogGroup', {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
        });
        /// !show
        new aws_logs_1.MetricFilter(this, 'MetricFilter', {
            logGroup,
            metricNamespace: 'MyApp',
            metricName: 'Latency',
            filterPattern: aws_logs_1.FilterPattern.exists('$.latency'),
            metricValue: '$.latency',
        });
        /// !hide
    }
}
const app = new aws_cdk_lib_1.App();
new MetricFilterIntegStack(app, 'aws-cdk-metricfilter-integ');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubWV0cmljZmlsdGVyLmxpdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLm1ldHJpY2ZpbHRlci5saXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBb0U7QUFDcEUsbURBQTZFO0FBRTdFLE1BQU0sc0JBQXVCLFNBQVEsbUJBQUs7SUFDeEMsWUFBWSxLQUFVLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQ3BELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sUUFBUSxHQUFHLElBQUksbUJBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzlDLGFBQWEsRUFBRSwyQkFBYSxDQUFDLE9BQU87U0FDckMsQ0FBQyxDQUFDO1FBRUgsU0FBUztRQUNULElBQUksdUJBQVksQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ3JDLFFBQVE7WUFDUixlQUFlLEVBQUUsT0FBTztZQUN4QixVQUFVLEVBQUUsU0FBUztZQUNyQixhQUFhLEVBQUUsd0JBQWEsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO1lBQ2hELFdBQVcsRUFBRSxXQUFXO1NBQ3pCLENBQUMsQ0FBQztRQUNILFNBQVM7SUFDWCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUN0QixJQUFJLHNCQUFzQixDQUFDLEdBQUcsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO0FBQzlELEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcCwgUmVtb3ZhbFBvbGljeSwgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBGaWx0ZXJQYXR0ZXJuLCBMb2dHcm91cCwgTWV0cmljRmlsdGVyIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWxvZ3MnO1xuXG5jbGFzcyBNZXRyaWNGaWx0ZXJJbnRlZ1N0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IGxvZ0dyb3VwID0gbmV3IExvZ0dyb3VwKHRoaXMsICdMb2dHcm91cCcsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICB9KTtcblxuICAgIC8vLyAhc2hvd1xuICAgIG5ldyBNZXRyaWNGaWx0ZXIodGhpcywgJ01ldHJpY0ZpbHRlcicsIHtcbiAgICAgIGxvZ0dyb3VwLFxuICAgICAgbWV0cmljTmFtZXNwYWNlOiAnTXlBcHAnLFxuICAgICAgbWV0cmljTmFtZTogJ0xhdGVuY3knLFxuICAgICAgZmlsdGVyUGF0dGVybjogRmlsdGVyUGF0dGVybi5leGlzdHMoJyQubGF0ZW5jeScpLFxuICAgICAgbWV0cmljVmFsdWU6ICckLmxhdGVuY3knLFxuICAgIH0pO1xuICAgIC8vLyAhaGlkZVxuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbm5ldyBNZXRyaWNGaWx0ZXJJbnRlZ1N0YWNrKGFwcCwgJ2F3cy1jZGstbWV0cmljZmlsdGVyLWludGVnJyk7XG5hcHAuc3ludGgoKTtcbiJdfQ==