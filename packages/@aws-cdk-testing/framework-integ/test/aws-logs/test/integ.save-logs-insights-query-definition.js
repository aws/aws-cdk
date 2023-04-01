"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_logs_1 = require("aws-cdk-lib/aws-logs");
class LogsInsightsQueryDefinitionIntegStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const logGroup = new aws_logs_1.LogGroup(this, 'LogGroup', {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
        });
        // Test query creation with single parse and filter statements
        new aws_logs_1.QueryDefinition(this, 'QueryDefinition', {
            queryDefinitionName: 'QueryDefinition',
            queryString: new aws_logs_1.QueryString({
                fields: ['@timestamp', '@message'],
                parse: '@message "[*] *" as loggingType, loggingMessage',
                filter: 'loggingType = "ERROR"',
                sort: '@timestamp desc',
                limit: 20,
                display: 'loggingMessage',
            }),
            logGroups: [logGroup],
        });
        // Test query creation with multiple parse and filter statements
        new aws_logs_1.QueryDefinition(this, 'QueryDefinitionWithMultipleStatements', {
            queryDefinitionName: 'QueryDefinitionWithMultipleStatements',
            queryString: new aws_logs_1.QueryString({
                fields: ['@timestamp', '@message'],
                parseStatements: [
                    '@message "[*] *" as loggingType, loggingMessage',
                    '@message "<*>: *" as differentLoggingType, differentLoggingMessage',
                ],
                filterStatements: [
                    'loggingType = "ERROR"',
                    'loggingMessage = "A very strange error occurred!"',
                ],
                sort: '@timestamp desc',
                limit: 20,
                display: 'loggingMessage',
            }),
            logGroups: [logGroup],
        });
    }
}
const app = new aws_cdk_lib_1.App();
const stack = new LogsInsightsQueryDefinitionIntegStack(app, 'aws-cdk-logs-insights-querydefinition-integ');
new integ_tests_alpha_1.IntegTest(app, 'LogsInsightsQueryDefinitionIntegTest', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc2F2ZS1sb2dzLWluc2lnaHRzLXF1ZXJ5LWRlZmluaXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5zYXZlLWxvZ3MtaW5zaWdodHMtcXVlcnktZGVmaW5pdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUFvRTtBQUNwRSxrRUFBdUQ7QUFFdkQsbURBQThFO0FBRTlFLE1BQU0scUNBQXNDLFNBQVEsbUJBQUs7SUFDdkQsWUFBWSxLQUFVLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQ3BELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sUUFBUSxHQUFHLElBQUksbUJBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzlDLGFBQWEsRUFBRSwyQkFBYSxDQUFDLE9BQU87U0FDckMsQ0FBQyxDQUFDO1FBRUgsOERBQThEO1FBQzlELElBQUksMEJBQWUsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDM0MsbUJBQW1CLEVBQUUsaUJBQWlCO1lBQ3RDLFdBQVcsRUFBRSxJQUFJLHNCQUFXLENBQUM7Z0JBQzNCLE1BQU0sRUFBRSxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUM7Z0JBQ2xDLEtBQUssRUFBRSxpREFBaUQ7Z0JBQ3hELE1BQU0sRUFBRSx1QkFBdUI7Z0JBQy9CLElBQUksRUFBRSxpQkFBaUI7Z0JBQ3ZCLEtBQUssRUFBRSxFQUFFO2dCQUNULE9BQU8sRUFBRSxnQkFBZ0I7YUFDMUIsQ0FBQztZQUNGLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQztTQUN0QixDQUFDLENBQUM7UUFFSCxnRUFBZ0U7UUFDaEUsSUFBSSwwQkFBZSxDQUFDLElBQUksRUFBRSx1Q0FBdUMsRUFBRTtZQUNqRSxtQkFBbUIsRUFBRSx1Q0FBdUM7WUFDNUQsV0FBVyxFQUFFLElBQUksc0JBQVcsQ0FBQztnQkFDM0IsTUFBTSxFQUFFLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQztnQkFDbEMsZUFBZSxFQUFFO29CQUNmLGlEQUFpRDtvQkFDakQsb0VBQW9FO2lCQUNyRTtnQkFDRCxnQkFBZ0IsRUFBRTtvQkFDaEIsdUJBQXVCO29CQUN2QixtREFBbUQ7aUJBQ3BEO2dCQUNELElBQUksRUFBRSxpQkFBaUI7Z0JBQ3ZCLEtBQUssRUFBRSxFQUFFO2dCQUNULE9BQU8sRUFBRSxnQkFBZ0I7YUFDMUIsQ0FBQztZQUNGLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQztTQUN0QixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUN0QixNQUFNLEtBQUssR0FBRyxJQUFJLHFDQUFxQyxDQUFDLEdBQUcsRUFBRSw2Q0FBNkMsQ0FBQyxDQUFDO0FBQzVHLElBQUksNkJBQVMsQ0FBQyxHQUFHLEVBQUUsc0NBQXNDLEVBQUU7SUFDekQsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0NBQ25CLENBQUMsQ0FBQztBQUNILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcCwgUmVtb3ZhbFBvbGljeSwgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5cbmltcG9ydCB7IExvZ0dyb3VwLCBRdWVyeURlZmluaXRpb24sIFF1ZXJ5U3RyaW5nIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWxvZ3MnO1xuXG5jbGFzcyBMb2dzSW5zaWdodHNRdWVyeURlZmluaXRpb25JbnRlZ1N0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IGxvZ0dyb3VwID0gbmV3IExvZ0dyb3VwKHRoaXMsICdMb2dHcm91cCcsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICB9KTtcblxuICAgIC8vIFRlc3QgcXVlcnkgY3JlYXRpb24gd2l0aCBzaW5nbGUgcGFyc2UgYW5kIGZpbHRlciBzdGF0ZW1lbnRzXG4gICAgbmV3IFF1ZXJ5RGVmaW5pdGlvbih0aGlzLCAnUXVlcnlEZWZpbml0aW9uJywge1xuICAgICAgcXVlcnlEZWZpbml0aW9uTmFtZTogJ1F1ZXJ5RGVmaW5pdGlvbicsXG4gICAgICBxdWVyeVN0cmluZzogbmV3IFF1ZXJ5U3RyaW5nKHtcbiAgICAgICAgZmllbGRzOiBbJ0B0aW1lc3RhbXAnLCAnQG1lc3NhZ2UnXSxcbiAgICAgICAgcGFyc2U6ICdAbWVzc2FnZSBcIlsqXSAqXCIgYXMgbG9nZ2luZ1R5cGUsIGxvZ2dpbmdNZXNzYWdlJyxcbiAgICAgICAgZmlsdGVyOiAnbG9nZ2luZ1R5cGUgPSBcIkVSUk9SXCInLFxuICAgICAgICBzb3J0OiAnQHRpbWVzdGFtcCBkZXNjJyxcbiAgICAgICAgbGltaXQ6IDIwLFxuICAgICAgICBkaXNwbGF5OiAnbG9nZ2luZ01lc3NhZ2UnLFxuICAgICAgfSksXG4gICAgICBsb2dHcm91cHM6IFtsb2dHcm91cF0sXG4gICAgfSk7XG5cbiAgICAvLyBUZXN0IHF1ZXJ5IGNyZWF0aW9uIHdpdGggbXVsdGlwbGUgcGFyc2UgYW5kIGZpbHRlciBzdGF0ZW1lbnRzXG4gICAgbmV3IFF1ZXJ5RGVmaW5pdGlvbih0aGlzLCAnUXVlcnlEZWZpbml0aW9uV2l0aE11bHRpcGxlU3RhdGVtZW50cycsIHtcbiAgICAgIHF1ZXJ5RGVmaW5pdGlvbk5hbWU6ICdRdWVyeURlZmluaXRpb25XaXRoTXVsdGlwbGVTdGF0ZW1lbnRzJyxcbiAgICAgIHF1ZXJ5U3RyaW5nOiBuZXcgUXVlcnlTdHJpbmcoe1xuICAgICAgICBmaWVsZHM6IFsnQHRpbWVzdGFtcCcsICdAbWVzc2FnZSddLFxuICAgICAgICBwYXJzZVN0YXRlbWVudHM6IFtcbiAgICAgICAgICAnQG1lc3NhZ2UgXCJbKl0gKlwiIGFzIGxvZ2dpbmdUeXBlLCBsb2dnaW5nTWVzc2FnZScsXG4gICAgICAgICAgJ0BtZXNzYWdlIFwiPCo+OiAqXCIgYXMgZGlmZmVyZW50TG9nZ2luZ1R5cGUsIGRpZmZlcmVudExvZ2dpbmdNZXNzYWdlJyxcbiAgICAgICAgXSxcbiAgICAgICAgZmlsdGVyU3RhdGVtZW50czogW1xuICAgICAgICAgICdsb2dnaW5nVHlwZSA9IFwiRVJST1JcIicsXG4gICAgICAgICAgJ2xvZ2dpbmdNZXNzYWdlID0gXCJBIHZlcnkgc3RyYW5nZSBlcnJvciBvY2N1cnJlZCFcIicsXG4gICAgICAgIF0sXG4gICAgICAgIHNvcnQ6ICdAdGltZXN0YW1wIGRlc2MnLFxuICAgICAgICBsaW1pdDogMjAsXG4gICAgICAgIGRpc3BsYXk6ICdsb2dnaW5nTWVzc2FnZScsXG4gICAgICB9KSxcbiAgICAgIGxvZ0dyb3VwczogW2xvZ0dyb3VwXSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBMb2dzSW5zaWdodHNRdWVyeURlZmluaXRpb25JbnRlZ1N0YWNrKGFwcCwgJ2F3cy1jZGstbG9ncy1pbnNpZ2h0cy1xdWVyeWRlZmluaXRpb24taW50ZWcnKTtcbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnTG9nc0luc2lnaHRzUXVlcnlEZWZpbml0aW9uSW50ZWdUZXN0Jywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG59KTtcbmFwcC5zeW50aCgpO1xuIl19