"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const lib_1 = require("../lib");
class DashboardWithGraphWidgetWithStatisticIntegrationTest extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const dashboard = new lib_1.Dashboard(this, 'Dash');
        const widget = new lib_1.GraphWidget({
            title: 'My fancy graph',
            left: [
                new lib_1.Metric({
                    namespace: 'CDK/Test',
                    metricName: 'Metric',
                    label: 'Metric left 1 - p99',
                    statistic: lib_1.Stats.p(99),
                }),
                new lib_1.Metric({
                    namespace: 'CDK/Test',
                    metricName: 'Metric',
                    label: 'Metric left 2 - TC_10P_90P',
                    statistic: lib_1.Stats.tc(10, 90),
                }),
                new lib_1.Metric({
                    namespace: 'CDK/Test',
                    metricName: 'Metric',
                    label: 'Metric left 3 - TS(5%:95%)',
                    statistic: 'TS(5%:95%)',
                }),
            ],
            right: [
                new lib_1.Metric({
                    namespace: 'CDK/Test',
                    metricName: 'Metric',
                    label: 'Metric right 1 - p90.1234',
                    statistic: 'p90.1234',
                }),
            ],
        });
        dashboard.addWidgets(widget);
    }
}
const app = new core_1.App();
new integ_tests_1.IntegTest(app, 'cdk-integ-dashboard-with-graph-widget-with-statistic', {
    testCases: [new DashboardWithGraphWidgetWithStatisticIntegrationTest(app, 'DashboardWithGraphWidgetWithStatisticIntegrationTest')],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZGFzaGJvYXJkLXdpdGgtZ3JhcGh3aWRnZXQtd2l0aC1zdGF0aXN0aWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5kYXNoYm9hcmQtd2l0aC1ncmFwaHdpZGdldC13aXRoLXN0YXRpc3RpYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdDQUF1RDtBQUN2RCxzREFBaUQ7QUFDakQsZ0NBQStEO0FBRS9ELE1BQU0sb0RBQXFELFNBQVEsWUFBSztJQUN0RSxZQUFZLEtBQVUsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDcEQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxTQUFTLEdBQUcsSUFBSSxlQUFTLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRTlDLE1BQU0sTUFBTSxHQUFHLElBQUksaUJBQVcsQ0FBQztZQUM3QixLQUFLLEVBQUUsZ0JBQWdCO1lBQ3ZCLElBQUksRUFBRTtnQkFDSixJQUFJLFlBQU0sQ0FBQztvQkFDVCxTQUFTLEVBQUUsVUFBVTtvQkFDckIsVUFBVSxFQUFFLFFBQVE7b0JBQ3BCLEtBQUssRUFBRSxxQkFBcUI7b0JBQzVCLFNBQVMsRUFBRSxXQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztpQkFDdkIsQ0FBQztnQkFFRixJQUFJLFlBQU0sQ0FBQztvQkFDVCxTQUFTLEVBQUUsVUFBVTtvQkFDckIsVUFBVSxFQUFFLFFBQVE7b0JBQ3BCLEtBQUssRUFBRSw0QkFBNEI7b0JBQ25DLFNBQVMsRUFBRSxXQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7aUJBQzVCLENBQUM7Z0JBRUYsSUFBSSxZQUFNLENBQUM7b0JBQ1QsU0FBUyxFQUFFLFVBQVU7b0JBQ3JCLFVBQVUsRUFBRSxRQUFRO29CQUNwQixLQUFLLEVBQUUsNEJBQTRCO29CQUNuQyxTQUFTLEVBQUUsWUFBWTtpQkFDeEIsQ0FBQzthQUNIO1lBQ0QsS0FBSyxFQUFFO2dCQUNMLElBQUksWUFBTSxDQUFDO29CQUNULFNBQVMsRUFBRSxVQUFVO29CQUNyQixVQUFVLEVBQUUsUUFBUTtvQkFDcEIsS0FBSyxFQUFFLDJCQUEyQjtvQkFDbEMsU0FBUyxFQUFFLFVBQVU7aUJBQ3RCLENBQUM7YUFDSDtTQUNGLENBQUMsQ0FBQztRQUVILFNBQVMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDOUI7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7QUFDdEIsSUFBSSx1QkFBUyxDQUFDLEdBQUcsRUFBRSxzREFBc0QsRUFBRTtJQUN6RSxTQUFTLEVBQUUsQ0FBQyxJQUFJLG9EQUFvRCxDQUFDLEdBQUcsRUFBRSxzREFBc0QsQ0FBQyxDQUFDO0NBQ25JLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcCwgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEludGVnVGVzdCB9IGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzJztcbmltcG9ydCB7IERhc2hib2FyZCwgTWV0cmljLCBTdGF0cywgR3JhcGhXaWRnZXQgfSBmcm9tICcuLi9saWInO1xuXG5jbGFzcyBEYXNoYm9hcmRXaXRoR3JhcGhXaWRnZXRXaXRoU3RhdGlzdGljSW50ZWdyYXRpb25UZXN0IGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IGRhc2hib2FyZCA9IG5ldyBEYXNoYm9hcmQodGhpcywgJ0Rhc2gnKTtcblxuICAgIGNvbnN0IHdpZGdldCA9IG5ldyBHcmFwaFdpZGdldCh7XG4gICAgICB0aXRsZTogJ015IGZhbmN5IGdyYXBoJyxcbiAgICAgIGxlZnQ6IFtcbiAgICAgICAgbmV3IE1ldHJpYyh7XG4gICAgICAgICAgbmFtZXNwYWNlOiAnQ0RLL1Rlc3QnLFxuICAgICAgICAgIG1ldHJpY05hbWU6ICdNZXRyaWMnLFxuICAgICAgICAgIGxhYmVsOiAnTWV0cmljIGxlZnQgMSAtIHA5OScsXG4gICAgICAgICAgc3RhdGlzdGljOiBTdGF0cy5wKDk5KSxcbiAgICAgICAgfSksXG5cbiAgICAgICAgbmV3IE1ldHJpYyh7XG4gICAgICAgICAgbmFtZXNwYWNlOiAnQ0RLL1Rlc3QnLFxuICAgICAgICAgIG1ldHJpY05hbWU6ICdNZXRyaWMnLFxuICAgICAgICAgIGxhYmVsOiAnTWV0cmljIGxlZnQgMiAtIFRDXzEwUF85MFAnLFxuICAgICAgICAgIHN0YXRpc3RpYzogU3RhdHMudGMoMTAsIDkwKSxcbiAgICAgICAgfSksXG5cbiAgICAgICAgbmV3IE1ldHJpYyh7XG4gICAgICAgICAgbmFtZXNwYWNlOiAnQ0RLL1Rlc3QnLFxuICAgICAgICAgIG1ldHJpY05hbWU6ICdNZXRyaWMnLFxuICAgICAgICAgIGxhYmVsOiAnTWV0cmljIGxlZnQgMyAtIFRTKDUlOjk1JSknLFxuICAgICAgICAgIHN0YXRpc3RpYzogJ1RTKDUlOjk1JSknLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgICByaWdodDogW1xuICAgICAgICBuZXcgTWV0cmljKHtcbiAgICAgICAgICBuYW1lc3BhY2U6ICdDREsvVGVzdCcsXG4gICAgICAgICAgbWV0cmljTmFtZTogJ01ldHJpYycsXG4gICAgICAgICAgbGFiZWw6ICdNZXRyaWMgcmlnaHQgMSAtIHA5MC4xMjM0JyxcbiAgICAgICAgICBzdGF0aXN0aWM6ICdwOTAuMTIzNCcsXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIGRhc2hib2FyZC5hZGRXaWRnZXRzKHdpZGdldCk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xubmV3IEludGVnVGVzdChhcHAsICdjZGstaW50ZWctZGFzaGJvYXJkLXdpdGgtZ3JhcGgtd2lkZ2V0LXdpdGgtc3RhdGlzdGljJywge1xuICB0ZXN0Q2FzZXM6IFtuZXcgRGFzaGJvYXJkV2l0aEdyYXBoV2lkZ2V0V2l0aFN0YXRpc3RpY0ludGVncmF0aW9uVGVzdChhcHAsICdEYXNoYm9hcmRXaXRoR3JhcGhXaWRnZXRXaXRoU3RhdGlzdGljSW50ZWdyYXRpb25UZXN0JyldLFxufSk7XG4iXX0=