"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
class MetricFilterIntegStack extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const logGroup = new lib_1.LogGroup(this, 'LogGroup', {
            removalPolicy: core_1.RemovalPolicy.DESTROY,
        });
        /// !show
        new lib_1.MetricFilter(this, 'MetricFilter', {
            logGroup,
            metricNamespace: 'MyApp',
            metricName: 'Latency',
            filterPattern: lib_1.FilterPattern.exists('$.latency'),
            metricValue: '$.latency',
        });
    }
}
const app = new core_1.App();
new MetricFilterIntegStack(app, 'aws-cdk-metricfilter-integ');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubWV0cmljZmlsdGVyLmxpdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLm1ldHJpY2ZpbHRlci5saXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3Q0FBc0U7QUFDdEUsZ0NBQStEO0FBRS9ELE1BQU0sc0JBQXVCLFNBQVEsWUFBSztJQUN4QyxZQUFZLEtBQVUsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDcEQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxjQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUM5QyxhQUFhLEVBQUUsb0JBQWEsQ0FBQyxPQUFPO1NBQ3JDLENBQUMsQ0FBQztRQUVILFNBQVM7UUFDVCxJQUFJLGtCQUFZLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUNyQyxRQUFRO1lBQ1IsZUFBZSxFQUFFLE9BQU87WUFDeEIsVUFBVSxFQUFFLFNBQVM7WUFDckIsYUFBYSxFQUFFLG1CQUFhLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztZQUNoRCxXQUFXLEVBQUUsV0FBVztTQUN6QixDQUFDLENBQUM7S0FFSjtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztBQUN0QixJQUFJLHNCQUFzQixDQUFDLEdBQUcsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO0FBQzlELEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcCwgUmVtb3ZhbFBvbGljeSwgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEZpbHRlclBhdHRlcm4sIExvZ0dyb3VwLCBNZXRyaWNGaWx0ZXIgfSBmcm9tICcuLi9saWInO1xuXG5jbGFzcyBNZXRyaWNGaWx0ZXJJbnRlZ1N0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IGxvZ0dyb3VwID0gbmV3IExvZ0dyb3VwKHRoaXMsICdMb2dHcm91cCcsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICB9KTtcblxuICAgIC8vLyAhc2hvd1xuICAgIG5ldyBNZXRyaWNGaWx0ZXIodGhpcywgJ01ldHJpY0ZpbHRlcicsIHtcbiAgICAgIGxvZ0dyb3VwLFxuICAgICAgbWV0cmljTmFtZXNwYWNlOiAnTXlBcHAnLFxuICAgICAgbWV0cmljTmFtZTogJ0xhdGVuY3knLFxuICAgICAgZmlsdGVyUGF0dGVybjogRmlsdGVyUGF0dGVybi5leGlzdHMoJyQubGF0ZW5jeScpLFxuICAgICAgbWV0cmljVmFsdWU6ICckLmxhdGVuY3knLFxuICAgIH0pO1xuICAgIC8vLyAhaGlkZVxuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbm5ldyBNZXRyaWNGaWx0ZXJJbnRlZ1N0YWNrKGFwcCwgJ2F3cy1jZGstbWV0cmljZmlsdGVyLWludGVnJyk7XG5hcHAuc3ludGgoKTtcbiJdfQ==