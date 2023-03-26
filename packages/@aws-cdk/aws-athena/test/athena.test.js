"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('Athena Workgroup Tags', () => {
    test('test tag spec correction', () => {
        const stack = new cdk.Stack();
        new lib_1.CfnWorkGroup(stack, 'Athena-Workgroup', {
            name: 'HelloWorld',
            description: 'A WorkGroup',
            recursiveDeleteOption: true,
            state: 'ENABLED',
            tags: [
                {
                    key: 'key1',
                    value: 'value1',
                },
                {
                    key: 'key2',
                    value: 'value2',
                },
            ],
            workGroupConfiguration: {
                requesterPaysEnabled: true,
                resultConfiguration: {
                    outputLocation: 's3://fakebucketme/athena/results/',
                },
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Athena::WorkGroup', {
            Tags: [
                {
                    Key: 'key1',
                    Value: 'value1',
                },
                {
                    Key: 'key2',
                    Value: 'value2',
                },
            ],
        });
    });
    test('test tag aspect spec correction', () => {
        const stack = new cdk.Stack();
        cdk.Tags.of(stack).add('key1', 'value1');
        cdk.Tags.of(stack).add('key2', 'value2');
        new lib_1.CfnWorkGroup(stack, 'Athena-Workgroup', {
            name: 'HelloWorld',
            description: 'A WorkGroup',
            recursiveDeleteOption: true,
            state: 'ENABLED',
            workGroupConfiguration: {
                requesterPaysEnabled: true,
                resultConfiguration: {
                    outputLocation: 's3://fakebucketme/athena/results/',
                },
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Athena::WorkGroup', {
            Tags: [
                {
                    Key: 'key1',
                    Value: 'value1',
                },
                {
                    Key: 'key2',
                    Value: 'value2',
                },
            ],
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXRoZW5hLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhdGhlbmEudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyxxQ0FBcUM7QUFDckMsZ0NBQXNDO0FBRXRDLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLEVBQUU7SUFDckMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtRQUNwQyxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM5QixJQUFJLGtCQUFZLENBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFFO1lBQzFDLElBQUksRUFBRSxZQUFZO1lBQ2xCLFdBQVcsRUFBRSxhQUFhO1lBQzFCLHFCQUFxQixFQUFFLElBQUk7WUFDM0IsS0FBSyxFQUFFLFNBQVM7WUFDaEIsSUFBSSxFQUFFO2dCQUNKO29CQUNFLEdBQUcsRUFBRSxNQUFNO29CQUNYLEtBQUssRUFBRSxRQUFRO2lCQUNoQjtnQkFDRDtvQkFDRSxHQUFHLEVBQUUsTUFBTTtvQkFDWCxLQUFLLEVBQUUsUUFBUTtpQkFDaEI7YUFDRjtZQUNELHNCQUFzQixFQUFFO2dCQUN0QixvQkFBb0IsRUFBRSxJQUFJO2dCQUMxQixtQkFBbUIsRUFBRTtvQkFDbkIsY0FBYyxFQUFFLG1DQUFtQztpQkFDcEQ7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUNILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdCQUF3QixFQUFFO1lBQ3hFLElBQUksRUFBRTtnQkFDSjtvQkFDRSxHQUFHLEVBQUUsTUFBTTtvQkFDWCxLQUFLLEVBQUUsUUFBUTtpQkFDaEI7Z0JBQ0Q7b0JBQ0UsR0FBRyxFQUFFLE1BQU07b0JBQ1gsS0FBSyxFQUFFLFFBQVE7aUJBQ2hCO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUNILElBQUksQ0FBQyxpQ0FBaUMsRUFBRSxHQUFHLEVBQUU7UUFDM0MsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN6QyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3pDLElBQUksa0JBQVksQ0FBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUU7WUFDMUMsSUFBSSxFQUFFLFlBQVk7WUFDbEIsV0FBVyxFQUFFLGFBQWE7WUFDMUIscUJBQXFCLEVBQUUsSUFBSTtZQUMzQixLQUFLLEVBQUUsU0FBUztZQUNoQixzQkFBc0IsRUFBRTtnQkFDdEIsb0JBQW9CLEVBQUUsSUFBSTtnQkFDMUIsbUJBQW1CLEVBQUU7b0JBQ25CLGNBQWMsRUFBRSxtQ0FBbUM7aUJBQ3BEO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFDSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtZQUN4RSxJQUFJLEVBQUU7Z0JBQ0o7b0JBQ0UsR0FBRyxFQUFFLE1BQU07b0JBQ1gsS0FBSyxFQUFFLFFBQVE7aUJBQ2hCO2dCQUNEO29CQUNFLEdBQUcsRUFBRSxNQUFNO29CQUNYLEtBQUssRUFBRSxRQUFRO2lCQUNoQjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDZm5Xb3JrR3JvdXAgfSBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgnQXRoZW5hIFdvcmtncm91cCBUYWdzJywgKCkgPT4ge1xuICB0ZXN0KCd0ZXN0IHRhZyBzcGVjIGNvcnJlY3Rpb24nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgbmV3IENmbldvcmtHcm91cChzdGFjaywgJ0F0aGVuYS1Xb3JrZ3JvdXAnLCB7XG4gICAgICBuYW1lOiAnSGVsbG9Xb3JsZCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ0EgV29ya0dyb3VwJyxcbiAgICAgIHJlY3Vyc2l2ZURlbGV0ZU9wdGlvbjogdHJ1ZSxcbiAgICAgIHN0YXRlOiAnRU5BQkxFRCcsXG4gICAgICB0YWdzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBrZXk6ICdrZXkxJyxcbiAgICAgICAgICB2YWx1ZTogJ3ZhbHVlMScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBrZXk6ICdrZXkyJyxcbiAgICAgICAgICB2YWx1ZTogJ3ZhbHVlMicsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgd29ya0dyb3VwQ29uZmlndXJhdGlvbjoge1xuICAgICAgICByZXF1ZXN0ZXJQYXlzRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgcmVzdWx0Q29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIG91dHB1dExvY2F0aW9uOiAnczM6Ly9mYWtlYnVja2V0bWUvYXRoZW5hL3Jlc3VsdHMvJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXRoZW5hOjpXb3JrR3JvdXAnLCB7XG4gICAgICBUYWdzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBLZXk6ICdrZXkxJyxcbiAgICAgICAgICBWYWx1ZTogJ3ZhbHVlMScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBLZXk6ICdrZXkyJyxcbiAgICAgICAgICBWYWx1ZTogJ3ZhbHVlMicsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcbiAgdGVzdCgndGVzdCB0YWcgYXNwZWN0IHNwZWMgY29ycmVjdGlvbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjZGsuVGFncy5vZihzdGFjaykuYWRkKCdrZXkxJywgJ3ZhbHVlMScpO1xuICAgIGNkay5UYWdzLm9mKHN0YWNrKS5hZGQoJ2tleTInLCAndmFsdWUyJyk7XG4gICAgbmV3IENmbldvcmtHcm91cChzdGFjaywgJ0F0aGVuYS1Xb3JrZ3JvdXAnLCB7XG4gICAgICBuYW1lOiAnSGVsbG9Xb3JsZCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ0EgV29ya0dyb3VwJyxcbiAgICAgIHJlY3Vyc2l2ZURlbGV0ZU9wdGlvbjogdHJ1ZSxcbiAgICAgIHN0YXRlOiAnRU5BQkxFRCcsXG4gICAgICB3b3JrR3JvdXBDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIHJlcXVlc3RlclBheXNFbmFibGVkOiB0cnVlLFxuICAgICAgICByZXN1bHRDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgb3V0cHV0TG9jYXRpb246ICdzMzovL2Zha2VidWNrZXRtZS9hdGhlbmEvcmVzdWx0cy8nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBdGhlbmE6OldvcmtHcm91cCcsIHtcbiAgICAgIFRhZ3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIEtleTogJ2tleTEnLFxuICAgICAgICAgIFZhbHVlOiAndmFsdWUxJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIEtleTogJ2tleTInLFxuICAgICAgICAgIFZhbHVlOiAndmFsdWUyJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=