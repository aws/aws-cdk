"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const lib_1 = require("../lib");
class LogsInsightsQueryDefinitionIntegStack extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const logGroup = new lib_1.LogGroup(this, 'LogGroup', {
            removalPolicy: core_1.RemovalPolicy.DESTROY,
        });
        // Test query creation with single parse and filter statements
        new lib_1.QueryDefinition(this, 'QueryDefinition', {
            queryDefinitionName: 'QueryDefinition',
            queryString: new lib_1.QueryString({
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
        new lib_1.QueryDefinition(this, 'QueryDefinitionWithMultipleStatements', {
            queryDefinitionName: 'QueryDefinitionWithMultipleStatements',
            queryString: new lib_1.QueryString({
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
const app = new core_1.App();
const stack = new LogsInsightsQueryDefinitionIntegStack(app, 'aws-cdk-logs-insights-querydefinition-integ');
new integ_tests_1.IntegTest(app, 'LogsInsightsQueryDefinitionIntegTest', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc2F2ZS1sb2dzLWluc2lnaHRzLXF1ZXJ5LWRlZmluaXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5zYXZlLWxvZ3MtaW5zaWdodHMtcXVlcnktZGVmaW5pdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdDQUFzRTtBQUN0RSxzREFBaUQ7QUFFakQsZ0NBQWdFO0FBRWhFLE1BQU0scUNBQXNDLFNBQVEsWUFBSztJQUN2RCxZQUFZLEtBQVUsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDcEQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxjQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUM5QyxhQUFhLEVBQUUsb0JBQWEsQ0FBQyxPQUFPO1NBQ3JDLENBQUMsQ0FBQztRQUVILDhEQUE4RDtRQUM5RCxJQUFJLHFCQUFlLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO1lBQzNDLG1CQUFtQixFQUFFLGlCQUFpQjtZQUN0QyxXQUFXLEVBQUUsSUFBSSxpQkFBVyxDQUFDO2dCQUMzQixNQUFNLEVBQUUsQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDO2dCQUNsQyxLQUFLLEVBQUUsaURBQWlEO2dCQUN4RCxNQUFNLEVBQUUsdUJBQXVCO2dCQUMvQixJQUFJLEVBQUUsaUJBQWlCO2dCQUN2QixLQUFLLEVBQUUsRUFBRTtnQkFDVCxPQUFPLEVBQUUsZ0JBQWdCO2FBQzFCLENBQUM7WUFDRixTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUM7U0FDdEIsQ0FBQyxDQUFDO1FBRUgsZ0VBQWdFO1FBQ2hFLElBQUkscUJBQWUsQ0FBQyxJQUFJLEVBQUUsdUNBQXVDLEVBQUU7WUFDakUsbUJBQW1CLEVBQUUsdUNBQXVDO1lBQzVELFdBQVcsRUFBRSxJQUFJLGlCQUFXLENBQUM7Z0JBQzNCLE1BQU0sRUFBRSxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUM7Z0JBQ2xDLGVBQWUsRUFBRTtvQkFDZixpREFBaUQ7b0JBQ2pELG9FQUFvRTtpQkFDckU7Z0JBQ0QsZ0JBQWdCLEVBQUU7b0JBQ2hCLHVCQUF1QjtvQkFDdkIsbURBQW1EO2lCQUNwRDtnQkFDRCxJQUFJLEVBQUUsaUJBQWlCO2dCQUN2QixLQUFLLEVBQUUsRUFBRTtnQkFDVCxPQUFPLEVBQUUsZ0JBQWdCO2FBQzFCLENBQUM7WUFDRixTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUM7U0FDdEIsQ0FBQyxDQUFDO0tBQ0o7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7QUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxxQ0FBcUMsQ0FBQyxHQUFHLEVBQUUsNkNBQTZDLENBQUMsQ0FBQztBQUM1RyxJQUFJLHVCQUFTLENBQUMsR0FBRyxFQUFFLHNDQUFzQyxFQUFFO0lBQ3pELFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztDQUNuQixDQUFDLENBQUM7QUFDSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHAsIFJlbW92YWxQb2xpY3ksIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cyc7XG5cbmltcG9ydCB7IExvZ0dyb3VwLCBRdWVyeURlZmluaXRpb24sIFF1ZXJ5U3RyaW5nIH0gZnJvbSAnLi4vbGliJztcblxuY2xhc3MgTG9nc0luc2lnaHRzUXVlcnlEZWZpbml0aW9uSW50ZWdTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IEFwcCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBsb2dHcm91cCA9IG5ldyBMb2dHcm91cCh0aGlzLCAnTG9nR3JvdXAnLCB7XG4gICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgfSk7XG5cbiAgICAvLyBUZXN0IHF1ZXJ5IGNyZWF0aW9uIHdpdGggc2luZ2xlIHBhcnNlIGFuZCBmaWx0ZXIgc3RhdGVtZW50c1xuICAgIG5ldyBRdWVyeURlZmluaXRpb24odGhpcywgJ1F1ZXJ5RGVmaW5pdGlvbicsIHtcbiAgICAgIHF1ZXJ5RGVmaW5pdGlvbk5hbWU6ICdRdWVyeURlZmluaXRpb24nLFxuICAgICAgcXVlcnlTdHJpbmc6IG5ldyBRdWVyeVN0cmluZyh7XG4gICAgICAgIGZpZWxkczogWydAdGltZXN0YW1wJywgJ0BtZXNzYWdlJ10sXG4gICAgICAgIHBhcnNlOiAnQG1lc3NhZ2UgXCJbKl0gKlwiIGFzIGxvZ2dpbmdUeXBlLCBsb2dnaW5nTWVzc2FnZScsXG4gICAgICAgIGZpbHRlcjogJ2xvZ2dpbmdUeXBlID0gXCJFUlJPUlwiJyxcbiAgICAgICAgc29ydDogJ0B0aW1lc3RhbXAgZGVzYycsXG4gICAgICAgIGxpbWl0OiAyMCxcbiAgICAgICAgZGlzcGxheTogJ2xvZ2dpbmdNZXNzYWdlJyxcbiAgICAgIH0pLFxuICAgICAgbG9nR3JvdXBzOiBbbG9nR3JvdXBdLFxuICAgIH0pO1xuXG4gICAgLy8gVGVzdCBxdWVyeSBjcmVhdGlvbiB3aXRoIG11bHRpcGxlIHBhcnNlIGFuZCBmaWx0ZXIgc3RhdGVtZW50c1xuICAgIG5ldyBRdWVyeURlZmluaXRpb24odGhpcywgJ1F1ZXJ5RGVmaW5pdGlvbldpdGhNdWx0aXBsZVN0YXRlbWVudHMnLCB7XG4gICAgICBxdWVyeURlZmluaXRpb25OYW1lOiAnUXVlcnlEZWZpbml0aW9uV2l0aE11bHRpcGxlU3RhdGVtZW50cycsXG4gICAgICBxdWVyeVN0cmluZzogbmV3IFF1ZXJ5U3RyaW5nKHtcbiAgICAgICAgZmllbGRzOiBbJ0B0aW1lc3RhbXAnLCAnQG1lc3NhZ2UnXSxcbiAgICAgICAgcGFyc2VTdGF0ZW1lbnRzOiBbXG4gICAgICAgICAgJ0BtZXNzYWdlIFwiWypdICpcIiBhcyBsb2dnaW5nVHlwZSwgbG9nZ2luZ01lc3NhZ2UnLFxuICAgICAgICAgICdAbWVzc2FnZSBcIjwqPjogKlwiIGFzIGRpZmZlcmVudExvZ2dpbmdUeXBlLCBkaWZmZXJlbnRMb2dnaW5nTWVzc2FnZScsXG4gICAgICAgIF0sXG4gICAgICAgIGZpbHRlclN0YXRlbWVudHM6IFtcbiAgICAgICAgICAnbG9nZ2luZ1R5cGUgPSBcIkVSUk9SXCInLFxuICAgICAgICAgICdsb2dnaW5nTWVzc2FnZSA9IFwiQSB2ZXJ5IHN0cmFuZ2UgZXJyb3Igb2NjdXJyZWQhXCInLFxuICAgICAgICBdLFxuICAgICAgICBzb3J0OiAnQHRpbWVzdGFtcCBkZXNjJyxcbiAgICAgICAgbGltaXQ6IDIwLFxuICAgICAgICBkaXNwbGF5OiAnbG9nZ2luZ01lc3NhZ2UnLFxuICAgICAgfSksXG4gICAgICBsb2dHcm91cHM6IFtsb2dHcm91cF0sXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuY29uc3Qgc3RhY2sgPSBuZXcgTG9nc0luc2lnaHRzUXVlcnlEZWZpbml0aW9uSW50ZWdTdGFjayhhcHAsICdhd3MtY2RrLWxvZ3MtaW5zaWdodHMtcXVlcnlkZWZpbml0aW9uLWludGVnJyk7XG5uZXcgSW50ZWdUZXN0KGFwcCwgJ0xvZ3NJbnNpZ2h0c1F1ZXJ5RGVmaW5pdGlvbkludGVnVGVzdCcsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxufSk7XG5hcHAuc3ludGgoKTtcbiJdfQ==