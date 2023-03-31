"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_cloudwatch_1 = require("aws-cdk-lib/aws-cloudwatch");
class DashboardWithGraphWidgetWithStatisticIntegrationTest extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const dashboard = new aws_cloudwatch_1.Dashboard(this, 'Dash');
        const widget = new aws_cloudwatch_1.GraphWidget({
            title: 'My fancy graph',
            left: [
                new aws_cloudwatch_1.Metric({
                    namespace: 'CDK/Test',
                    metricName: 'Metric',
                    label: 'Metric left 1 - p99',
                    statistic: aws_cloudwatch_1.Stats.p(99),
                }),
                new aws_cloudwatch_1.Metric({
                    namespace: 'CDK/Test',
                    metricName: 'Metric',
                    label: 'Metric left 2 - TC_10P_90P',
                    statistic: aws_cloudwatch_1.Stats.tc(10, 90),
                }),
                new aws_cloudwatch_1.Metric({
                    namespace: 'CDK/Test',
                    metricName: 'Metric',
                    label: 'Metric left 3 - TS(5%:95%)',
                    statistic: 'TS(5%:95%)',
                }),
            ],
            right: [
                new aws_cloudwatch_1.Metric({
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
const app = new aws_cdk_lib_1.App();
new integ_tests_alpha_1.IntegTest(app, 'cdk-integ-dashboard-with-graph-widget-with-statistic', {
    testCases: [new DashboardWithGraphWidgetWithStatisticIntegrationTest(app, 'DashboardWithGraphWidgetWithStatisticIntegrationTest')],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZGFzaGJvYXJkLXdpdGgtZ3JhcGh3aWRnZXQtd2l0aC1zdGF0aXN0aWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5kYXNoYm9hcmQtd2l0aC1ncmFwaHdpZGdldC13aXRoLXN0YXRpc3RpYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUFxRDtBQUNyRCxrRUFBdUQ7QUFDdkQsK0RBQW1GO0FBRW5GLE1BQU0sb0RBQXFELFNBQVEsbUJBQUs7SUFDdEUsWUFBWSxLQUFVLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQ3BELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sU0FBUyxHQUFHLElBQUksMEJBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFOUMsTUFBTSxNQUFNLEdBQUcsSUFBSSw0QkFBVyxDQUFDO1lBQzdCLEtBQUssRUFBRSxnQkFBZ0I7WUFDdkIsSUFBSSxFQUFFO2dCQUNKLElBQUksdUJBQU0sQ0FBQztvQkFDVCxTQUFTLEVBQUUsVUFBVTtvQkFDckIsVUFBVSxFQUFFLFFBQVE7b0JBQ3BCLEtBQUssRUFBRSxxQkFBcUI7b0JBQzVCLFNBQVMsRUFBRSxzQkFBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7aUJBQ3ZCLENBQUM7Z0JBRUYsSUFBSSx1QkFBTSxDQUFDO29CQUNULFNBQVMsRUFBRSxVQUFVO29CQUNyQixVQUFVLEVBQUUsUUFBUTtvQkFDcEIsS0FBSyxFQUFFLDRCQUE0QjtvQkFDbkMsU0FBUyxFQUFFLHNCQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7aUJBQzVCLENBQUM7Z0JBRUYsSUFBSSx1QkFBTSxDQUFDO29CQUNULFNBQVMsRUFBRSxVQUFVO29CQUNyQixVQUFVLEVBQUUsUUFBUTtvQkFDcEIsS0FBSyxFQUFFLDRCQUE0QjtvQkFDbkMsU0FBUyxFQUFFLFlBQVk7aUJBQ3hCLENBQUM7YUFDSDtZQUNELEtBQUssRUFBRTtnQkFDTCxJQUFJLHVCQUFNLENBQUM7b0JBQ1QsU0FBUyxFQUFFLFVBQVU7b0JBQ3JCLFVBQVUsRUFBRSxRQUFRO29CQUNwQixLQUFLLEVBQUUsMkJBQTJCO29CQUNsQyxTQUFTLEVBQUUsVUFBVTtpQkFDdEIsQ0FBQzthQUNIO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsU0FBUyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMvQixDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUN0QixJQUFJLDZCQUFTLENBQUMsR0FBRyxFQUFFLHNEQUFzRCxFQUFFO0lBQ3pFLFNBQVMsRUFBRSxDQUFDLElBQUksb0RBQW9ELENBQUMsR0FBRyxFQUFFLHNEQUFzRCxDQUFDLENBQUM7Q0FDbkksQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwLCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEludGVnVGVzdCB9IGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCB7IERhc2hib2FyZCwgTWV0cmljLCBTdGF0cywgR3JhcGhXaWRnZXQgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY2xvdWR3YXRjaCc7XG5cbmNsYXNzIERhc2hib2FyZFdpdGhHcmFwaFdpZGdldFdpdGhTdGF0aXN0aWNJbnRlZ3JhdGlvblRlc3QgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBBcHAsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgZGFzaGJvYXJkID0gbmV3IERhc2hib2FyZCh0aGlzLCAnRGFzaCcpO1xuXG4gICAgY29uc3Qgd2lkZ2V0ID0gbmV3IEdyYXBoV2lkZ2V0KHtcbiAgICAgIHRpdGxlOiAnTXkgZmFuY3kgZ3JhcGgnLFxuICAgICAgbGVmdDogW1xuICAgICAgICBuZXcgTWV0cmljKHtcbiAgICAgICAgICBuYW1lc3BhY2U6ICdDREsvVGVzdCcsXG4gICAgICAgICAgbWV0cmljTmFtZTogJ01ldHJpYycsXG4gICAgICAgICAgbGFiZWw6ICdNZXRyaWMgbGVmdCAxIC0gcDk5JyxcbiAgICAgICAgICBzdGF0aXN0aWM6IFN0YXRzLnAoOTkpLFxuICAgICAgICB9KSxcblxuICAgICAgICBuZXcgTWV0cmljKHtcbiAgICAgICAgICBuYW1lc3BhY2U6ICdDREsvVGVzdCcsXG4gICAgICAgICAgbWV0cmljTmFtZTogJ01ldHJpYycsXG4gICAgICAgICAgbGFiZWw6ICdNZXRyaWMgbGVmdCAyIC0gVENfMTBQXzkwUCcsXG4gICAgICAgICAgc3RhdGlzdGljOiBTdGF0cy50YygxMCwgOTApLFxuICAgICAgICB9KSxcblxuICAgICAgICBuZXcgTWV0cmljKHtcbiAgICAgICAgICBuYW1lc3BhY2U6ICdDREsvVGVzdCcsXG4gICAgICAgICAgbWV0cmljTmFtZTogJ01ldHJpYycsXG4gICAgICAgICAgbGFiZWw6ICdNZXRyaWMgbGVmdCAzIC0gVFMoNSU6OTUlKScsXG4gICAgICAgICAgc3RhdGlzdGljOiAnVFMoNSU6OTUlKScsXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICAgIHJpZ2h0OiBbXG4gICAgICAgIG5ldyBNZXRyaWMoe1xuICAgICAgICAgIG5hbWVzcGFjZTogJ0NESy9UZXN0JyxcbiAgICAgICAgICBtZXRyaWNOYW1lOiAnTWV0cmljJyxcbiAgICAgICAgICBsYWJlbDogJ01ldHJpYyByaWdodCAxIC0gcDkwLjEyMzQnLFxuICAgICAgICAgIHN0YXRpc3RpYzogJ3A5MC4xMjM0JyxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgZGFzaGJvYXJkLmFkZFdpZGdldHMod2lkZ2V0KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5uZXcgSW50ZWdUZXN0KGFwcCwgJ2Nkay1pbnRlZy1kYXNoYm9hcmQtd2l0aC1ncmFwaC13aWRnZXQtd2l0aC1zdGF0aXN0aWMnLCB7XG4gIHRlc3RDYXNlczogW25ldyBEYXNoYm9hcmRXaXRoR3JhcGhXaWRnZXRXaXRoU3RhdGlzdGljSW50ZWdyYXRpb25UZXN0KGFwcCwgJ0Rhc2hib2FyZFdpdGhHcmFwaFdpZGdldFdpdGhTdGF0aXN0aWNJbnRlZ3JhdGlvblRlc3QnKV0sXG59KTtcbiJdfQ==