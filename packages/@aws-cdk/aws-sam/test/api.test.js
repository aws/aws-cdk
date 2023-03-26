"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk = require("@aws-cdk/core");
const sam = require("../lib");
describe('AWS::Serverless::Api', () => {
    let stack;
    beforeEach(() => {
        stack = new cdk.Stack();
    });
    test('can be created by passing a complex type to EndpointConfiguration', () => {
        new sam.CfnApi(stack, 'Api', {
            stageName: 'prod',
            definitionBody: {
                body: 'definitionBody',
            },
            endpointConfiguration: {
                type: 'GLOBAL',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Serverless::Api', {
            StageName: 'prod',
            EndpointConfiguration: {
                Type: 'GLOBAL',
            },
        });
    });
    test('can be created by passing a string to EndpointConfiguration', () => {
        new sam.CfnApi(stack, 'Api', {
            stageName: 'prod',
            definitionBody: {
                body: 'definitionBody',
            },
            endpointConfiguration: 'GLOBAL',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Serverless::Api', {
            StageName: 'prod',
            EndpointConfiguration: 'GLOBAL',
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcGkudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyxxQ0FBcUM7QUFDckMsOEJBQThCO0FBRTlCLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUU7SUFDcEMsSUFBSSxLQUFnQixDQUFDO0lBQ3JCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDMUIsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsbUVBQW1FLEVBQUUsR0FBRyxFQUFFO1FBQzdFLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO1lBQzNCLFNBQVMsRUFBRSxNQUFNO1lBQ2pCLGNBQWMsRUFBRTtnQkFDZCxJQUFJLEVBQUUsZ0JBQWdCO2FBQ3ZCO1lBQ0QscUJBQXFCLEVBQUU7Z0JBQ3JCLElBQUksRUFBRSxRQUFRO2FBQ2Y7U0FDRixDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxzQkFBc0IsRUFBRTtZQUN0RSxTQUFTLEVBQUUsTUFBTTtZQUNqQixxQkFBcUIsRUFBRTtnQkFDckIsSUFBSSxFQUFFLFFBQVE7YUFDZjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDZEQUE2RCxFQUFFLEdBQUcsRUFBRTtRQUN2RSxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtZQUMzQixTQUFTLEVBQUUsTUFBTTtZQUNqQixjQUFjLEVBQUU7Z0JBQ2QsSUFBSSxFQUFFLGdCQUFnQjthQUN2QjtZQUNELHFCQUFxQixFQUFFLFFBQVE7U0FDaEMsQ0FBQyxDQUFDO1FBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsc0JBQXNCLEVBQUU7WUFDdEUsU0FBUyxFQUFFLE1BQU07WUFDakIscUJBQXFCLEVBQUUsUUFBUTtTQUNoQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIHNhbSBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgnQVdTOjpTZXJ2ZXJsZXNzOjpBcGknLCAoKSA9PiB7XG4gIGxldCBzdGFjazogY2RrLlN0YWNrO1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGJlIGNyZWF0ZWQgYnkgcGFzc2luZyBhIGNvbXBsZXggdHlwZSB0byBFbmRwb2ludENvbmZpZ3VyYXRpb24nLCAoKSA9PiB7XG4gICAgbmV3IHNhbS5DZm5BcGkoc3RhY2ssICdBcGknLCB7XG4gICAgICBzdGFnZU5hbWU6ICdwcm9kJyxcbiAgICAgIGRlZmluaXRpb25Cb2R5OiB7XG4gICAgICAgIGJvZHk6ICdkZWZpbml0aW9uQm9keScsXG4gICAgICB9LFxuICAgICAgZW5kcG9pbnRDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIHR5cGU6ICdHTE9CQUwnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNlcnZlcmxlc3M6OkFwaScsIHtcbiAgICAgIFN0YWdlTmFtZTogJ3Byb2QnLFxuICAgICAgRW5kcG9pbnRDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIFR5cGU6ICdHTE9CQUwnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGJlIGNyZWF0ZWQgYnkgcGFzc2luZyBhIHN0cmluZyB0byBFbmRwb2ludENvbmZpZ3VyYXRpb24nLCAoKSA9PiB7XG4gICAgbmV3IHNhbS5DZm5BcGkoc3RhY2ssICdBcGknLCB7XG4gICAgICBzdGFnZU5hbWU6ICdwcm9kJyxcbiAgICAgIGRlZmluaXRpb25Cb2R5OiB7XG4gICAgICAgIGJvZHk6ICdkZWZpbml0aW9uQm9keScsXG4gICAgICB9LFxuICAgICAgZW5kcG9pbnRDb25maWd1cmF0aW9uOiAnR0xPQkFMJyxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNlcnZlcmxlc3M6OkFwaScsIHtcbiAgICAgIFN0YWdlTmFtZTogJ3Byb2QnLFxuICAgICAgRW5kcG9pbnRDb25maWd1cmF0aW9uOiAnR0xPQkFMJyxcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==