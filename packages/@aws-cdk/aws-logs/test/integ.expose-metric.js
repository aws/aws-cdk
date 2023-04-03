"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cloudwatch_1 = require("@aws-cdk/aws-cloudwatch");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
/*
 * Stack verification steps:
 *
 * -- aws cloudwatch describe-alarms --alarm-name-prefix aws-cdk-expose-metric-integ
 * has Namespace of `MyApp` and Statistic of `Average`
 */
class ExposeMetricIntegStack extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const logGroup = new lib_1.LogGroup(this, 'LogGroup', {
            removalPolicy: core_1.RemovalPolicy.DESTROY,
        });
        /// !show
        const mf = new lib_1.MetricFilter(this, 'MetricFilter', {
            logGroup,
            metricNamespace: 'MyApp',
            metricName: 'Latency',
            filterPattern: lib_1.FilterPattern.exists('$.latency'),
            metricValue: '$.latency',
        });
        new aws_cloudwatch_1.Alarm(this, 'alarm from metric filter', {
            metric: mf.metric(),
            threshold: 100,
            evaluationPeriods: 2,
        });
    }
}
const app = new core_1.App();
new ExposeMetricIntegStack(app, 'aws-cdk-expose-metric-integ');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZXhwb3NlLW1ldHJpYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmV4cG9zZS1tZXRyaWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0REFBZ0Q7QUFDaEQsd0NBQXNFO0FBQ3RFLGdDQUErRDtBQUUvRDs7Ozs7R0FLRztBQUVILE1BQU0sc0JBQXVCLFNBQVEsWUFBSztJQUN4QyxZQUFZLEtBQVUsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDcEQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxjQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUM5QyxhQUFhLEVBQUUsb0JBQWEsQ0FBQyxPQUFPO1NBQ3JDLENBQUMsQ0FBQztRQUVILFNBQVM7UUFDVCxNQUFNLEVBQUUsR0FBRyxJQUFJLGtCQUFZLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUNoRCxRQUFRO1lBQ1IsZUFBZSxFQUFFLE9BQU87WUFDeEIsVUFBVSxFQUFFLFNBQVM7WUFDckIsYUFBYSxFQUFFLG1CQUFhLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztZQUNoRCxXQUFXLEVBQUUsV0FBVztTQUN6QixDQUFDLENBQUM7UUFFSCxJQUFJLHNCQUFLLENBQUMsSUFBSSxFQUFFLDBCQUEwQixFQUFFO1lBQzFDLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTSxFQUFFO1lBQ25CLFNBQVMsRUFBRSxHQUFHO1lBQ2QsaUJBQWlCLEVBQUUsQ0FBQztTQUNyQixDQUFDLENBQUM7S0FHSjtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztBQUN0QixJQUFJLHNCQUFzQixDQUFDLEdBQUcsRUFBRSw2QkFBNkIsQ0FBQyxDQUFDO0FBQy9ELEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFsYXJtIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3Vkd2F0Y2gnO1xuaW1wb3J0IHsgQXBwLCBSZW1vdmFsUG9saWN5LCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgRmlsdGVyUGF0dGVybiwgTG9nR3JvdXAsIE1ldHJpY0ZpbHRlciB9IGZyb20gJy4uL2xpYic7XG5cbi8qXG4gKiBTdGFjayB2ZXJpZmljYXRpb24gc3RlcHM6XG4gKlxuICogLS0gYXdzIGNsb3Vkd2F0Y2ggZGVzY3JpYmUtYWxhcm1zIC0tYWxhcm0tbmFtZS1wcmVmaXggYXdzLWNkay1leHBvc2UtbWV0cmljLWludGVnXG4gKiBoYXMgTmFtZXNwYWNlIG9mIGBNeUFwcGAgYW5kIFN0YXRpc3RpYyBvZiBgQXZlcmFnZWBcbiAqL1xuXG5jbGFzcyBFeHBvc2VNZXRyaWNJbnRlZ1N0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IGxvZ0dyb3VwID0gbmV3IExvZ0dyb3VwKHRoaXMsICdMb2dHcm91cCcsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICB9KTtcblxuICAgIC8vLyAhc2hvd1xuICAgIGNvbnN0IG1mID0gbmV3IE1ldHJpY0ZpbHRlcih0aGlzLCAnTWV0cmljRmlsdGVyJywge1xuICAgICAgbG9nR3JvdXAsXG4gICAgICBtZXRyaWNOYW1lc3BhY2U6ICdNeUFwcCcsXG4gICAgICBtZXRyaWNOYW1lOiAnTGF0ZW5jeScsXG4gICAgICBmaWx0ZXJQYXR0ZXJuOiBGaWx0ZXJQYXR0ZXJuLmV4aXN0cygnJC5sYXRlbmN5JyksXG4gICAgICBtZXRyaWNWYWx1ZTogJyQubGF0ZW5jeScsXG4gICAgfSk7XG5cbiAgICBuZXcgQWxhcm0odGhpcywgJ2FsYXJtIGZyb20gbWV0cmljIGZpbHRlcicsIHtcbiAgICAgIG1ldHJpYzogbWYubWV0cmljKCksXG4gICAgICB0aHJlc2hvbGQ6IDEwMCxcbiAgICAgIGV2YWx1YXRpb25QZXJpb2RzOiAyLFxuICAgIH0pO1xuXG4gICAgLy8vICFoaWRlXG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xubmV3IEV4cG9zZU1ldHJpY0ludGVnU3RhY2soYXBwLCAnYXdzLWNkay1leHBvc2UtbWV0cmljLWludGVnJyk7XG5hcHAuc3ludGgoKTsiXX0=