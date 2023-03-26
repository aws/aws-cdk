"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const lib_1 = require("../lib");
class TestStack extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const logGroup = new lib_1.LogGroup(this, 'LogGroup', {
            removalPolicy: core_1.RemovalPolicy.DESTROY,
        });
        new lib_1.MetricFilter(this, 'MetricFilter', {
            logGroup,
            metricNamespace: 'MyApp',
            metricName: 'Latency',
            filterPattern: lib_1.FilterPattern.exists('$.latency'),
            metricValue: '$.latency',
            dimensions: {
                ErrorCode: '$.errorCode',
            },
        });
    }
}
const app = new core_1.App();
const testCase = new TestStack(app, 'aws-cdk-metricfilter-dimensions-integ');
new integ_tests_1.IntegTest(app, 'metricfilter-dimensions', {
    testCases: [testCase],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubWV0cmljZmlsdGVyLWRpbWVuc2lvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5tZXRyaWNmaWx0ZXItZGltZW5zaW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdDQUFzRTtBQUN0RSxzREFBaUQ7QUFDakQsZ0NBQStEO0FBRS9ELE1BQU0sU0FBVSxTQUFRLFlBQUs7SUFDM0IsWUFBWSxLQUFVLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQ3BELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sUUFBUSxHQUFHLElBQUksY0FBUSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDOUMsYUFBYSxFQUFFLG9CQUFhLENBQUMsT0FBTztTQUNyQyxDQUFDLENBQUM7UUFFSCxJQUFJLGtCQUFZLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUNyQyxRQUFRO1lBQ1IsZUFBZSxFQUFFLE9BQU87WUFDeEIsVUFBVSxFQUFFLFNBQVM7WUFDckIsYUFBYSxFQUFFLG1CQUFhLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztZQUNoRCxXQUFXLEVBQUUsV0FBVztZQUN4QixVQUFVLEVBQUU7Z0JBQ1YsU0FBUyxFQUFFLGFBQWE7YUFDekI7U0FDRixDQUFDLENBQUM7S0FDSjtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztBQUN0QixNQUFNLFFBQVEsR0FBRyxJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsdUNBQXVDLENBQUMsQ0FBQztBQUU3RSxJQUFJLHVCQUFTLENBQUMsR0FBRyxFQUFFLHlCQUF5QixFQUFFO0lBQzVDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQztDQUN0QixDQUFDLENBQUM7QUFDSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHAsIFJlbW92YWxQb2xpY3ksIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cyc7XG5pbXBvcnQgeyBGaWx0ZXJQYXR0ZXJuLCBMb2dHcm91cCwgTWV0cmljRmlsdGVyIH0gZnJvbSAnLi4vbGliJztcblxuY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IGxvZ0dyb3VwID0gbmV3IExvZ0dyb3VwKHRoaXMsICdMb2dHcm91cCcsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICB9KTtcblxuICAgIG5ldyBNZXRyaWNGaWx0ZXIodGhpcywgJ01ldHJpY0ZpbHRlcicsIHtcbiAgICAgIGxvZ0dyb3VwLFxuICAgICAgbWV0cmljTmFtZXNwYWNlOiAnTXlBcHAnLFxuICAgICAgbWV0cmljTmFtZTogJ0xhdGVuY3knLFxuICAgICAgZmlsdGVyUGF0dGVybjogRmlsdGVyUGF0dGVybi5leGlzdHMoJyQubGF0ZW5jeScpLFxuICAgICAgbWV0cmljVmFsdWU6ICckLmxhdGVuY3knLFxuICAgICAgZGltZW5zaW9uczoge1xuICAgICAgICBFcnJvckNvZGU6ICckLmVycm9yQ29kZScsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbmNvbnN0IHRlc3RDYXNlID0gbmV3IFRlc3RTdGFjayhhcHAsICdhd3MtY2RrLW1ldHJpY2ZpbHRlci1kaW1lbnNpb25zLWludGVnJyk7XG5cbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnbWV0cmljZmlsdGVyLWRpbWVuc2lvbnMnLCB7XG4gIHRlc3RDYXNlczogW3Rlc3RDYXNlXSxcbn0pO1xuYXBwLnN5bnRoKCk7XG4iXX0=