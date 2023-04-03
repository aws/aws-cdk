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
    (0, cdk_build_tools_1.testDeprecated)('create a query definition with all commands', () => {
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
    (0, cdk_build_tools_1.testDeprecated)('create a query with both single and multi statement properties for filtering and parsing', () => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnktZGVmaW5pdGlvbi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicXVlcnktZGVmaW5pdGlvbi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLDhEQUEwRDtBQUMxRCx3Q0FBc0M7QUFDdEMsZ0NBQWdFO0FBRWhFLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7SUFDaEMsSUFBSSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRTtRQUNyQyxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixPQUFPO1FBQ1AsSUFBSSxxQkFBZSxDQUFDLEtBQUssRUFBRSxpQkFBaUIsRUFBRTtZQUM1QyxtQkFBbUIsRUFBRSxTQUFTO1lBQzlCLFdBQVcsRUFBRSxJQUFJLGlCQUFXLENBQUM7Z0JBQzNCLE1BQU0sRUFBRSxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUM7Z0JBQ2xDLElBQUksRUFBRSxpQkFBaUI7Z0JBQ3ZCLEtBQUssRUFBRSxFQUFFO2FBQ1YsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyw0QkFBNEIsRUFBRTtZQUM1RSxJQUFJLEVBQUUsU0FBUztZQUNmLFdBQVcsRUFBRSxpRUFBaUU7U0FDL0UsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsc0RBQXNELEVBQUUsR0FBRyxFQUFFO1FBQ2hFLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxNQUFNLFFBQVEsR0FBRyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFFbkQsSUFBSSxxQkFBZSxDQUFDLEtBQUssRUFBRSxpQkFBaUIsRUFBRTtZQUM1QyxtQkFBbUIsRUFB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LE1BQU0sRUFBRSxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUM7Z0JBQ2xDLEtBQUssRUFBRSxpREFBaUQ7Z0JBQ3hELGVBQWUsRUFBRTtvQkFDZixpREFBaUQ7b0JBQ2pELG9FQUFvRTtpQkFDckU7Z0JBQ0QsTUFBTSxFQUFFLHVCQUF1QjtnQkFDL0IsZ0JBQWdCLEVBQUU7b0JBQ2hCLHVCQUF1QjtvQkFDdkIsbURBQW1EO2lCQUNwRDtnQkFDRCxJQUFJLEVBQUUsaUJBQWlCO2dCQUN2QixLQUFLLEVBQUUsRUFBRTthQUNWLENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsNEJBQTRCLEVBQUU7WUFDNUUsSUFBSSxFQUFFLFNBQVM7WUFDZixXQUFXLEVBQUUsa1NBQWtTO1NBQ2hULENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgdGVzdERlcHJlY2F0ZWQgfSBmcm9tICdAYXdzLWNkay9jZGstYnVpbGQtdG9vbHMnO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IExvZ0dyb3VwLCBRdWVyeURlZmluaXRpb24sIFF1ZXJ5U3RyaW5nIH0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ3F1ZXJ5IGRlZmluaXRpb24nLCAoKSA9PiB7XG4gIHRlc3QoJ2NyZWF0ZSBhIHF1ZXJ5IGRlZmluaXRpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBRdWVyeURlZmluaXRpb24oc3RhY2ssICdRdWVyeURlZmluaXRpb24nLCB7XG4gICAgICBxdWVyeURlZmluaXRpb25OYW1lOiAnTXlRdWVyeScsXG4gICAgICBxdWVyeVN0cmluZzogbmV3IFF1ZXJ5U3RyaW5nKHtcbiAgICAgICAgZmllbGRzOiBbJ0B0aW1lc3RhbXAnLCAnQG1lc3NhZ2UnXSxcbiAgICAgICAgc29ydDogJ0B0aW1lc3RhbXAgZGVzYycsXG4gICAgICAgIGxpbWl0OiAyMCxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxvZ3M6OlF1ZXJ5RGVmaW5pdGlvbicsIHtcbiAgICAgIE5hbWU6ICdNeVF1ZXJ5JyxcbiAgICAgIFF1ZXJ5U3RyaW5nOiAnZmllbGRzIEB0aW1lc3RhbXAsIEBtZXNzYWdlXFxufCBzb3J0IEB0aW1lc3RhbXAgZGVzY1xcbnwgbGltaXQgMjAnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGUgYSBxdWVyeSBkZWZpbml0aW9uIGFnYWluc3QgY2VydGFpbiBsb2cgZ3JvdXBzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBsb2dHcm91cCA9IG5ldyBMb2dHcm91cChzdGFjaywgJ015TG9nR3JvdXAnKTtcblxuICAgIG5ldyBRdWVyeURlZmluaXRpb24oc3RhY2ssICdRdWVyeURlZmluaXRpb24nLCB7XG4gICAgICBxdWVyeURlZmluaXRpb25OYW1lOiAnTXlRdWVyeScsXG4gICAgICBxdWVyeVN0cmluZzogbmV3IFF1ZXJ5U3RyaW5nKHtcbiAgICAgICAgZmllbGRzOiBbJ0B0aW1lc3RhbXAnLCAnQG1lc3NhZ2UnXSxcbiAgICAgICAgc29ydDogJ0B0aW1lc3RhbXAgZGVzYycsXG4gICAgICAgIGxpbWl0OiAyMCxcbiAgICAgIH0pLFxuICAgICAgbG9nR3JvdXBzOiBbbG9nR3JvdXBdLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxvZ3M6OlF1ZXJ5RGVmaW5pdGlvbicsIHtcbiAgICAgIE5hbWU6ICdNeVF1ZXJ5JyxcbiAgICAgIFF1ZXJ5U3RyaW5nOiAnZmllbGRzIEB0aW1lc3RhbXAsIEBtZXNzYWdlXFxufCBzb3J0IEB0aW1lc3RhbXAgZGVzY1xcbnwgbGltaXQgMjAnLFxuICAgICAgTG9nR3JvdXBOYW1lczogW3sgUmVmOiAnTXlMb2dHcm91cDVDMERBRDg1JyB9XSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ2NyZWF0ZSBhIHF1ZXJ5IGRlZmluaXRpb24gd2l0aCBhbGwgY29tbWFuZHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGxvZ0dyb3VwID0gbmV3IExvZ0dyb3VwKHN0YWNrLCAnTXlMb2dHcm91cCcpO1xuXG4gICAgbmV3IFF1ZXJ5RGVmaW5pdGlvbihzdGFjaywgJ1F1ZXJ5RGVmaW5pdGlvbicsIHtcbiAgICAgIHF1ZXJ5RGVmaW5pdGlvbk5hbWU6ICdNeVF1ZXJ5JyxcbiAgICAgIHF1ZXJ5U3RyaW5nOiBuZXcgUXVlcnlTdHJpbmcoe1xuICAgICAgICBmaWVsZHM6IFsnQHRpbWVzdGFtcCcsICdAbWVzc2FnZSddLFxuICAgICAgICBwYXJzZTogJ0BtZXNzYWdlIFwiWypdICpcIiBhcyBsb2dnaW5nVHlwZSwgbG9nZ2luZ01lc3NhZ2UnLFxuICAgICAgICBmaWx0ZXI6ICdsb2dnaW5nVHlwZSA9IFwiRVJST1JcIicsXG4gICAgICAgIHNvcnQ6ICdAdGltZXN0YW1wIGRlc2MnLFxuICAgICAgICBsaW1pdDogMjAsXG4gICAgICAgIGRpc3BsYXk6ICdsb2dnaW5nTWVzc2FnZScsXG4gICAgICB9KSxcbiAgICAgIGxvZ0dyb3VwczogW2xvZ0dyb3VwXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMb2dzOjpRdWVyeURlZmluaXRpb24nLCB7XG4gICAgICBOYW1lOiAnTXlRdWVyeScsXG4gICAgICBRdWVyeVN0cmluZzogJ2ZpZWxkcyBAdGltZXN0YW1wLCBAbWVzc2FnZVxcbnwgcGFyc2UgQG1lc3NhZ2UgXCJbKl0gKlwiIGFzIGxvZ2dpbmdUeXBlLCBsb2dnaW5nTWVzc2FnZVxcbnwgZmlsdGVyIGxvZ2dpbmdUeXBlID0gXCJFUlJPUlwiXFxufCBzb3J0IEB0aW1lc3RhbXAgZGVzY1xcbnwgbGltaXQgMjBcXG58IGRpc3BsYXkgbG9nZ2luZ01lc3NhZ2UnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGUgYSBxdWVyeSBkZWZpbml0aW9uIHdpdGggbXVsdGlwbGUgc3RhdGVtZW50cyBmb3Igc3VwcG9ydGVkIGNvbW1hbmRzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgUXVlcnlEZWZpbml0aW9uKHN0YWNrLCAnUXVlcnlEZWZpbml0aW9uJywge1xuICAgICAgcXVlcnlEZWZpbml0aW9uTmFtZTogJ015UXVlcnknLFxuICAgICAgcXVlcnlTdHJpbmc6IG5ldyBRdWVyeVN0cmluZyh7XG4gICAgICAgIGZpZWxkczogWydAdGltZXN0YW1wJywgJ0BtZXNzYWdlJ10sXG4gICAgICAgIHBhcnNlU3RhdGVtZW50czogW1xuICAgICAgICAgICdAbWVzc2FnZSBcIlsqXSAqXCIgYXMgbG9nZ2luZ1R5cGUsIGxvZ2dpbmdNZXNzYWdlJyxcbiAgICAgICAgICAnQG1lc3NhZ2UgXCI8Kj46ICpcIiBhcyBkaWZmZXJlbnRMb2dnaW5nVHlwZSwgZGlmZmVyZW50TG9nZ2luZ01lc3NhZ2UnLFxuICAgICAgICBdLFxuICAgICAgICBmaWx0ZXJTdGF0ZW1lbnRzOiBbXG4gICAgICAgICAgJ2xvZ2dpbmdUeXBlID0gXCJFUlJPUlwiJyxcbiAgICAgICAgICAnbG9nZ2luZ01lc3NhZ2UgPSBcIkEgdmVyeSBzdHJhbmdlIGVycm9yIG9jY3VycmVkIVwiJyxcbiAgICAgICAgXSxcbiAgICAgICAgc29ydDogJ0B0aW1lc3RhbXAgZGVzYycsXG4gICAgICAgIGxpbWl0OiAyMCxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxvZ3M6OlF1ZXJ5RGVmaW5pdGlvbicsIHtcbiAgICAgIE5hbWU6ICdNeVF1ZXJ5JyxcbiAgICAgIFF1ZXJ5U3RyaW5nOiAnZmllbGRzIEB0aW1lc3RhbXAsIEBtZXNzYWdlXFxufCBwYXJzZSBAbWVzc2FnZSBcIlsqXSAqXCIgYXMgbG9nZ2luZ1R5cGUsIGxvZ2dpbmdNZXNzYWdlXFxufCBwYXJzZSBAbWVzc2FnZSBcIjwqPjogKlwiIGFzIGRpZmZlcmVudExvZ2dpbmdUeXBlLCBkaWZmZXJlbnRMb2dnaW5nTWVzc2FnZVxcbnwgZmlsdGVyIGxvZ2dpbmdUeXBlID0gXCJFUlJPUlwiXFxufCBmaWx0ZXIgbG9nZ2luZ01lc3NhZ2UgPSBcIkEgdmVyeSBzdHJhbmdlIGVycm9yIG9jY3VycmVkIVwiXFxufCBzb3J0IEB0aW1lc3RhbXAgZGVzY1xcbnwgbGltaXQgMjAnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnY3JlYXRlIGEgcXVlcnkgd2l0aCBib3RoIHNpbmdsZSBhbmQgbXVsdGkgc3RhdGVtZW50IHByb3BlcnRpZXMgZm9yIGZpbHRlcmluZyBhbmQgcGFyc2luZycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFF1ZXJ5RGVmaW5pdGlvbihzdGFjaywgJ1F1ZXJ5RGVmaW5pdGlvbicsIHtcbiAgICAgIHF1ZXJ5RGVmaW5pdGlvbk5hbWU6ICdNeVF1ZXJ5JyxcbiAgICAgIHF1ZXJ5U3RyaW5nOiBuZXcgUXVlcnlTdHJpbmcoe1xuICAgICAgICBmaWVsZHM6IFsnQHRpbWVzdGFtcCcsICdAbWVzc2FnZSddLFxuICAgICAgICBwYXJzZTogJ0BtZXNzYWdlIFwiWypdICpcIiBhcyBsb2dnaW5nVHlwZSwgbG9nZ2luZ01lc3NhZ2UnLFxuICAgICAgICBwYXJzZVN0YXRlbWVudHM6IFtcbiAgICAgICAgICAnQG1lc3NhZ2UgXCJbKl0gKlwiIGFzIGxvZ2dpbmdUeXBlLCBsb2dnaW5nTWVzc2FnZScsXG4gICAgICAgICAgJ0BtZXNzYWdlIFwiPCo+OiAqXCIgYXMgZGlmZmVyZW50TG9nZ2luZ1R5cGUsIGRpZmZlcmVudExvZ2dpbmdNZXNzYWdlJyxcbiAgICAgICAgXSxcbiAgICAgICAgZmlsdGVyOiAnbG9nZ2luZ1R5cGUgPSBcIkVSUk9SXCInLFxuICAgICAgICBmaWx0ZXJTdGF0ZW1lbnRzOiBbXG4gICAgICAgICAgJ2xvZ2dpbmdUeXBlID0gXCJFUlJPUlwiJyxcbiAgICAgICAgICAnbG9nZ2luZ01lc3NhZ2UgPSBcIkEgdmVyeSBzdHJhbmdlIGVycm9yIG9jY3VycmVkIVwiJyxcbiAgICAgICAgXSxcbiAgICAgICAgc29ydDogJ0B0aW1lc3RhbXAgZGVzYycsXG4gICAgICAgIGxpbWl0OiAyMCxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxvZ3M6OlF1ZXJ5RGVmaW5pdGlvbicsIHtcbiAgICAgIE5hbWU6ICdNeVF1ZXJ5JyxcbiAgICAgIFF1ZXJ5U3RyaW5nOiAnZmllbGRzIEB0aW1lc3RhbXAsIEBtZXNzYWdlXFxufCBwYXJzZSBAbWVzc2FnZSBcIlsqXSAqXCIgYXMgbG9nZ2luZ1R5cGUsIGxvZ2dpbmdNZXNzYWdlXFxufCBwYXJzZSBAbWVzc2FnZSBcIjwqPjogKlwiIGFzIGRpZmZlcmVudExvZ2dpbmdUeXBlLCBkaWZmZXJlbnRMb2dnaW5nTWVzc2FnZVxcbnwgZmlsdGVyIGxvZ2dpbmdUeXBlID0gXCJFUlJPUlwiXFxufCBmaWx0ZXIgbG9nZ2luZ01lc3NhZ2UgPSBcIkEgdmVyeSBzdHJhbmdlIGVycm9yIG9jY3VycmVkIVwiXFxufCBzb3J0IEB0aW1lc3RhbXAgZGVzY1xcbnwgbGltaXQgMjAnLFxuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19