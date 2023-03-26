"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('query definition', () => {
    test('create a query definition', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.QueryDefinition(stack, 'QueryDefinition', {
            queryDefinitionName: 'MyQuery',
            queryString: new lib_1.QueryString({
                fields: ['@timestamp', '@message'],
                sort: '@timestamp desc',
                limit: 20,
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::QueryDefinition', {
            Name: 'MyQuery',
            QueryString: 'fields @timestamp, @message\n| sort @timestamp desc\n| limit 20',
        });
    });
    test('create a query definition against certain log groups', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const logGroup = new lib_1.LogGroup(stack, 'MyLogGroup');
        new lib_1.QueryDefinition(stack, 'QueryDefinition', {
            queryDefinitionName: 'MyQuery',
            queryString: new lib_1.QueryString({
                fields: ['@timestamp', '@message'],
                sort: '@timestamp desc',
                limit: 20,
            }),
            logGroups: [logGroup],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::QueryDefinition', {
            Name: 'MyQuery',
            QueryString: 'fields @timestamp, @message\n| sort @timestamp desc\n| limit 20',
            LogGroupNames: [{ Ref: 'MyLogGroup5C0DAD85' }],
        });
    });
    cdk_build_tools_1.testDeprecated('create a query definition with all commands', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const logGroup = new lib_1.LogGroup(stack, 'MyLogGroup');
        new lib_1.QueryDefinition(stack, 'QueryDefinition', {
            queryDefinitionName: 'MyQuery',
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
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::QueryDefinition', {
            Name: 'MyQuery',
            QueryString: 'fields @timestamp, @message\n| parse @message "[*] *" as loggingType, loggingMessage\n| filter loggingType = "ERROR"\n| sort @timestamp desc\n| limit 20\n| display loggingMessage',
        });
    });
    test('create a query definition with multiple statements for supported commands', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.QueryDefinition(stack, 'QueryDefinition', {
            queryDefinitionName: 'MyQuery',
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
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::QueryDefinition', {
            Name: 'MyQuery',
            QueryString: 'fields @timestamp, @message\n| parse @message "[*] *" as loggingType, loggingMessage\n| parse @message "<*>: *" as differentLoggingType, differentLoggingMessage\n| filter loggingType = "ERROR"\n| filter loggingMessage = "A very strange error occurred!"\n| sort @timestamp desc\n| limit 20',
        });
    });
    cdk_build_tools_1.testDeprecated('create a query with both single and multi statement properties for filtering and parsing', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.QueryDefinition(stack, 'QueryDefinition', {
            queryDefinitionName: 'MyQuery',
            queryString: new lib_1.QueryString({
                fields: ['@timestamp', '@message'],
                parse: '@message "[*] *" as loggingType, loggingMessage',
                parseStatements: [
                    '@message "[*] *" as loggingType, loggingMessage',
                    '@message "<*>: *" as differentLoggingType, differentLoggingMessage',
                ],
                filter: 'loggingType = "ERROR"',
                filterStatements: [
                    'loggingType = "ERROR"',
                    'loggingMessage = "A very strange error occurred!"',
                ],
                sort: '@timestamp desc',
                limit: 20,
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::QueryDefinition', {
            Name: 'MyQuery',
            QueryString: 'fields @timestamp, @message\n| parse @message "[*] *" as loggingType, loggingMessage\n| parse @message "<*>: *" as differentLoggingType, differentLoggingMessage\n| filter loggingType = "ERROR"\n| filter loggingMessage = "A very strange error occurred!"\n| sort @timestamp desc\n| limit 20',
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnktZGVmaW5pdGlvbi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicXVlcnktZGVmaW5pdGlvbi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLDhEQUEwRDtBQUMxRCx3Q0FBc0M7QUFDdEMsZ0NBQWdFO0FBRWhFLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7SUFDaEMsSUFBSSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRTtRQUNyQyxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixPQUFPO1FBQ1AsSUFBSSxxQkFBZSxDQUFDLEtBQUssRUFBRSxpQkFBaUIsRUFBRTtZQUM1QyxtQkFBbUIsRUFBRSxTQUFTO1lBQzlCLFdBQVcsRUFBRSxJQUFJLGlCQUFXLENBQUM7Z0JBQzNCLE1BQU0sRUFBRSxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUM7Z0JBQ2xDLElBQUksRUFBRSxpQkFBaUI7Z0JBQ3ZCLEtBQUssRUFBRSxFQUFFO2FBQ1YsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyw0QkFBNEIsRUFBRTtZQUM1RSxJQUFJLEVBQUUsU0FBUztZQUNmLFdBQVcsRUFBRSxpRUFBaUU7U0FDL0UsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsc0RBQXNELEVBQUUsR0FBRyxFQUFFO1FBQ2hFLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxNQUFNLFFBQVEsR0FBRyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFFbkQsSUFBSSxxQkFBZSxDQUFDLEtBQUssRUFBRSxpQkFBaUIsRUFBRTtZQUM1QyxtQkFBbUIsRUFB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LENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQztnQkFDbEMsS0FBSyxFQUFFLGlEQUFpRDtnQkFDeEQsZUFBZSxFQUFFO29CQUNmLGlEQUFpRDtvQkFDakQsb0VBQW9FO2lCQUNyRTtnQkFDRCxNQUFNLEVBQUUsdUJBQXVCO2dCQUMvQixnQkFBZ0IsRUFBRTtvQkFDaEIsdUJBQXVCO29CQUN2QixtREFBbUQ7aUJBQ3BEO2dCQUNELElBQUksRUFBRSxpQkFBaUI7Z0JBQ3ZCLEtBQUssRUFBRSxFQUFFO2FBQ1YsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyw0QkFBNEIsRUFBRTtZQUM1RSxJQUFJLEVBQUUsU0FBUztZQUNmLFdBQVcsRUFBRSxrU0FBa1M7U0FDaFQsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyB0ZXN0RGVwcmVjYXRlZCB9IGZyb20gJ0Bhd3MtY2RrL2Nkay1idWlsZC10b29scyc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgTG9nR3JvdXAsIFF1ZXJ5RGVmaW5pdGlvbiwgUXVlcnlTdHJpbmcgfSBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgncXVlcnkgZGVmaW5pdGlvbicsICgpID0+IHtcbiAgdGVzdCgnY3JlYXRlIGEgcXVlcnkgZGVmaW5pdGlvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFF1ZXJ5RGVmaW5pdGlvbihzdGFjaywgJ1F1ZXJ5RGVmaW5pdGlvbicsIHtcbiAgICAgIHF1ZXJ5RGVmaW5pdGlvbk5hbWU6ICdNeVF1ZXJ5JyxcbiAgICAgIHF1ZXJ5U3RyaW5nOiBuZXcgUXVlcnlTdHJpbmcoe1xuICAgICAgICBmaWVsZHM6IFsnQHRpbWVzdGFtcCcsICdAbWVzc2FnZSddLFxuICAgICAgICBzb3J0OiAnQHRpbWVzdGFtcCBkZXNjJyxcbiAgICAgICAgbGltaXQ6IDIwLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TG9nczo6UXVlcnlEZWZpbml0aW9uJywge1xuICAgICAgTmFtZTogJ015UXVlcnknLFxuICAgICAgUXVlcnlTdHJpbmc6ICdmaWVsZHMgQHRpbWVzdGFtcCwgQG1lc3NhZ2VcXG58IHNvcnQgQHRpbWVzdGFtcCBkZXNjXFxufCBsaW1pdCAyMCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZSBhIHF1ZXJ5IGRlZmluaXRpb24gYWdhaW5zdCBjZXJ0YWluIGxvZyBncm91cHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGxvZ0dyb3VwID0gbmV3IExvZ0dyb3VwKHN0YWNrLCAnTXlMb2dHcm91cCcpO1xuXG4gICAgbmV3IFF1ZXJ5RGVmaW5pdGlvbihzdGFjaywgJ1F1ZXJ5RGVmaW5pdGlvbicsIHtcbiAgICAgIHF1ZXJ5RGVmaW5pdGlvbk5hbWU6ICdNeVF1ZXJ5JyxcbiAgICAgIHF1ZXJ5U3RyaW5nOiBuZXcgUXVlcnlTdHJpbmcoe1xuICAgICAgICBmaWVsZHM6IFsnQHRpbWVzdGFtcCcsICdAbWVzc2FnZSddLFxuICAgICAgICBzb3J0OiAnQHRpbWVzdGFtcCBkZXNjJyxcbiAgICAgICAgbGltaXQ6IDIwLFxuICAgICAgfSksXG4gICAgICBsb2dHcm91cHM6IFtsb2dHcm91cF0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TG9nczo6UXVlcnlEZWZpbml0aW9uJywge1xuICAgICAgTmFtZTogJ015UXVlcnknLFxuICAgICAgUXVlcnlTdHJpbmc6ICdmaWVsZHMgQHRpbWVzdGFtcCwgQG1lc3NhZ2VcXG58IHNvcnQgQHRpbWVzdGFtcCBkZXNjXFxufCBsaW1pdCAyMCcsXG4gICAgICBMb2dHcm91cE5hbWVzOiBbeyBSZWY6ICdNeUxvZ0dyb3VwNUMwREFEODUnIH1dLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnY3JlYXRlIGEgcXVlcnkgZGVmaW5pdGlvbiB3aXRoIGFsbCBjb21tYW5kcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbG9nR3JvdXAgPSBuZXcgTG9nR3JvdXAoc3RhY2ssICdNeUxvZ0dyb3VwJyk7XG5cbiAgICBuZXcgUXVlcnlEZWZpbml0aW9uKHN0YWNrLCAnUXVlcnlEZWZpbml0aW9uJywge1xuICAgICAgcXVlcnlEZWZpbml0aW9uTmFtZTogJ015UXVlcnknLFxuICAgICAgcXVlcnlTdHJpbmc6IG5ldyBRdWVyeVN0cmluZyh7XG4gICAgICAgIGZpZWxkczogWydAdGltZXN0YW1wJywgJ0BtZXNzYWdlJ10sXG4gICAgICAgIHBhcnNlOiAnQG1lc3NhZ2UgXCJbKl0gKlwiIGFzIGxvZ2dpbmdUeXBlLCBsb2dnaW5nTWVzc2FnZScsXG4gICAgICAgIGZpbHRlcjogJ2xvZ2dpbmdUeXBlID0gXCJFUlJPUlwiJyxcbiAgICAgICAgc29ydDogJ0B0aW1lc3RhbXAgZGVzYycsXG4gICAgICAgIGxpbWl0OiAyMCxcbiAgICAgICAgZGlzcGxheTogJ2xvZ2dpbmdNZXNzYWdlJyxcbiAgICAgIH0pLFxuICAgICAgbG9nR3JvdXBzOiBbbG9nR3JvdXBdLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxvZ3M6OlF1ZXJ5RGVmaW5pdGlvbicsIHtcbiAgICAgIE5hbWU6ICdNeVF1ZXJ5JyxcbiAgICAgIFF1ZXJ5U3RyaW5nOiAnZmllbGRzIEB0aW1lc3RhbXAsIEBtZXNzYWdlXFxufCBwYXJzZSBAbWVzc2FnZSBcIlsqXSAqXCIgYXMgbG9nZ2luZ1R5cGUsIGxvZ2dpbmdNZXNzYWdlXFxufCBmaWx0ZXIgbG9nZ2luZ1R5cGUgPSBcIkVSUk9SXCJcXG58IHNvcnQgQHRpbWVzdGFtcCBkZXNjXFxufCBsaW1pdCAyMFxcbnwgZGlzcGxheSBsb2dnaW5nTWVzc2FnZScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZSBhIHF1ZXJ5IGRlZmluaXRpb24gd2l0aCBtdWx0aXBsZSBzdGF0ZW1lbnRzIGZvciBzdXBwb3J0ZWQgY29tbWFuZHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBRdWVyeURlZmluaXRpb24oc3RhY2ssICdRdWVyeURlZmluaXRpb24nLCB7XG4gICAgICBxdWVyeURlZmluaXRpb25OYW1lOiAnTXlRdWVyeScsXG4gICAgICBxdWVyeVN0cmluZzogbmV3IFF1ZXJ5U3RyaW5nKHtcbiAgICAgICAgZmllbGRzOiBbJ0B0aW1lc3RhbXAnLCAnQG1lc3NhZ2UnXSxcbiAgICAgICAgcGFyc2VTdGF0ZW1lbnRzOiBbXG4gICAgICAgICAgJ0BtZXNzYWdlIFwiWypdICpcIiBhcyBsb2dnaW5nVHlwZSwgbG9nZ2luZ01lc3NhZ2UnLFxuICAgICAgICAgICdAbWVzc2FnZSBcIjwqPjogKlwiIGFzIGRpZmZlcmVudExvZ2dpbmdUeXBlLCBkaWZmZXJlbnRMb2dnaW5nTWVzc2FnZScsXG4gICAgICAgIF0sXG4gICAgICAgIGZpbHRlclN0YXRlbWVudHM6IFtcbiAgICAgICAgICAnbG9nZ2luZ1R5cGUgPSBcIkVSUk9SXCInLFxuICAgICAgICAgICdsb2dnaW5nTWVzc2FnZSA9IFwiQSB2ZXJ5IHN0cmFuZ2UgZXJyb3Igb2NjdXJyZWQhXCInLFxuICAgICAgICBdLFxuICAgICAgICBzb3J0OiAnQHRpbWVzdGFtcCBkZXNjJyxcbiAgICAgICAgbGltaXQ6IDIwLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TG9nczo6UXVlcnlEZWZpbml0aW9uJywge1xuICAgICAgTmFtZTogJ015UXVlcnknLFxuICAgICAgUXVlcnlTdHJpbmc6ICdmaWVsZHMgQHRpbWVzdGFtcCwgQG1lc3NhZ2VcXG58IHBhcnNlIEBtZXNzYWdlIFwiWypdICpcIiBhcyBsb2dnaW5nVHlwZSwgbG9nZ2luZ01lc3NhZ2VcXG58IHBhcnNlIEBtZXNzYWdlIFwiPCo+OiAqXCIgYXMgZGlmZmVyZW50TG9nZ2luZ1R5cGUsIGRpZmZlcmVudExvZ2dpbmdNZXNzYWdlXFxufCBmaWx0ZXIgbG9nZ2luZ1R5cGUgPSBcIkVSUk9SXCJcXG58IGZpbHRlciBsb2dnaW5nTWVzc2FnZSA9IFwiQSB2ZXJ5IHN0cmFuZ2UgZXJyb3Igb2NjdXJyZWQhXCJcXG58IHNvcnQgQHRpbWVzdGFtcCBkZXNjXFxufCBsaW1pdCAyMCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCdjcmVhdGUgYSBxdWVyeSB3aXRoIGJvdGggc2luZ2xlIGFuZCBtdWx0aSBzdGF0ZW1lbnQgcHJvcGVydGllcyBmb3IgZmlsdGVyaW5nIGFuZCBwYXJzaW5nJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgUXVlcnlEZWZpbml0aW9uKHN0YWNrLCAnUXVlcnlEZWZpbml0aW9uJywge1xuICAgICAgcXVlcnlEZWZpbml0aW9uTmFtZTogJ015UXVlcnknLFxuICAgICAgcXVlcnlTdHJpbmc6IG5ldyBRdWVyeVN0cmluZyh7XG4gICAgICAgIGZpZWxkczogWydAdGltZXN0YW1wJywgJ0BtZXNzYWdlJ10sXG4gICAgICAgIHBhcnNlOiAnQG1lc3NhZ2UgXCJbKl0gKlwiIGFzIGxvZ2dpbmdUeXBlLCBsb2dnaW5nTWVzc2FnZScsXG4gICAgICAgIHBhcnNlU3RhdGVtZW50czogW1xuICAgICAgICAgICdAbWVzc2FnZSBcIlsqXSAqXCIgYXMgbG9nZ2luZ1R5cGUsIGxvZ2dpbmdNZXNzYWdlJyxcbiAgICAgICAgICAnQG1lc3NhZ2UgXCI8Kj46ICpcIiBhcyBkaWZmZXJlbnRMb2dnaW5nVHlwZSwgZGlmZmVyZW50TG9nZ2luZ01lc3NhZ2UnLFxuICAgICAgICBdLFxuICAgICAgICBmaWx0ZXI6ICdsb2dnaW5nVHlwZSA9IFwiRVJST1JcIicsXG4gICAgICAgIGZpbHRlclN0YXRlbWVudHM6IFtcbiAgICAgICAgICAnbG9nZ2luZ1R5cGUgPSBcIkVSUk9SXCInLFxuICAgICAgICAgICdsb2dnaW5nTWVzc2FnZSA9IFwiQSB2ZXJ5IHN0cmFuZ2UgZXJyb3Igb2NjdXJyZWQhXCInLFxuICAgICAgICBdLFxuICAgICAgICBzb3J0OiAnQHRpbWVzdGFtcCBkZXNjJyxcbiAgICAgICAgbGltaXQ6IDIwLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TG9nczo6UXVlcnlEZWZpbml0aW9uJywge1xuICAgICAgTmFtZTogJ015UXVlcnknLFxuICAgICAgUXVlcnlTdHJpbmc6ICdmaWVsZHMgQHRpbWVzdGFtcCwgQG1lc3NhZ2VcXG58IHBhcnNlIEBtZXNzYWdlIFwiWypdICpcIiBhcyBsb2dnaW5nVHlwZSwgbG9nZ2luZ01lc3NhZ2VcXG58IHBhcnNlIEBtZXNzYWdlIFwiPCo+OiAqXCIgYXMgZGlmZmVyZW50TG9nZ2luZ1R5cGUsIGRpZmZlcmVudExvZ2dpbmdNZXNzYWdlXFxufCBmaWx0ZXIgbG9nZ2luZ1R5cGUgPSBcIkVSUk9SXCJcXG58IGZpbHRlciBsb2dnaW5nTWVzc2FnZSA9IFwiQSB2ZXJ5IHN0cmFuZ2UgZXJyb3Igb2NjdXJyZWQhXCJcXG58IHNvcnQgQHRpbWVzdGFtcCBkZXNjXFxufCBsaW1pdCAyMCcsXG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=