"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('metrics', () => {
    test('Can use addMetrics() to add a metric configuration', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const bucket = new lib_1.Bucket(stack, 'Bucket');
        bucket.addMetric({
            id: 'test',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
            MetricsConfigurations: [{
                    Id: 'test',
                }],
        });
    });
    test('Bucket with metrics on prefix', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.Bucket(stack, 'Bucket', {
            metrics: [{
                    id: 'test',
                    prefix: 'prefix',
                }],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
            MetricsConfigurations: [{
                    Id: 'test',
                    Prefix: 'prefix',
                }],
        });
    });
    test('Bucket with metrics on tag filter', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.Bucket(stack, 'Bucket', {
            metrics: [{
                    id: 'test',
                    tagFilters: { tagname1: 'tagvalue1', tagname2: 'tagvalue2' },
                }],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
            MetricsConfigurations: [{
                    Id: 'test',
                    TagFilters: [
                        { Key: 'tagname1', Value: 'tagvalue1' },
                        { Key: 'tagname2', Value: 'tagvalue2' },
                    ],
                }],
        });
    });
    test('Bucket with multiple metric configurations', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.Bucket(stack, 'Bucket', {
            metrics: [
                {
                    id: 'test',
                    tagFilters: { tagname1: 'tagvalue1', tagname2: 'tagvalue2' },
                },
                {
                    id: 'test2',
                    prefix: 'prefix',
                },
            ],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
            MetricsConfigurations: [{
                    Id: 'test',
                    TagFilters: [
                        { Key: 'tagname1', Value: 'tagvalue1' },
                        { Key: 'tagname2', Value: 'tagvalue2' },
                    ],
                },
                {
                    Id: 'test2',
                    Prefix: 'prefix',
                }],
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0cmljcy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWV0cmljcy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHdDQUFzQztBQUN0QyxnQ0FBZ0M7QUFFaEMsUUFBUSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7SUFDdkIsSUFBSSxDQUFDLG9EQUFvRCxFQUFFLEdBQUcsRUFBRTtRQUM5RCxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixPQUFPO1FBQ1AsTUFBTSxNQUFNLEdBQUcsSUFBSSxZQUFNLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDZixFQUFFLEVBQUUsTUFBTTtTQUNYLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxpQkFBaUIsRUFBRTtZQUNqRSxxQkFBcUIsRUFBRSxDQUFDO29CQUN0QixFQUFFLEVBQUUsTUFBTTtpQkFDWCxDQUFDO1NBQ0gsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsK0JBQStCLEVBQUUsR0FBRyxFQUFFO1FBQ3pDLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxJQUFJLFlBQU0sQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO1lBQzFCLE9BQU8sRUFBRSxDQUFDO29CQUNSLEVBQUUsRUFBRSxNQUFNO29CQUNWLE1BQU0sRUFBRSxRQUFRO2lCQUNqQixDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGlCQUFpQixFQUFFO1lBQ2pFLHFCQUFxQixFQUFFLENBQUM7b0JBQ3RCLEVBQUUsRUFBRSxNQUFNO29CQUNWLE1BQU0sRUFBRSxRQUFRO2lCQUNqQixDQUFDO1NBQ0gsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsbUNBQW1DLEVBQUUsR0FBRyxFQUFFO1FBQzdDLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxJQUFJLFlBQU0sQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO1lBQzFCLE9BQU8sRUFBRSxDQUFDO29CQUNSLEVBQUUsRUFBRSxNQUFNO29CQUNWLFVBQVUsRUFBRSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRTtpQkFDN0QsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxpQkFBaUIsRUFBRTtZQUNqRSxxQkFBcUIsRUFBRSxDQUFDO29CQUN0QixFQUFFLEVBQUUsTUFBTTtvQkFDVixVQUFVLEVBQUU7d0JBQ1YsRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUU7d0JBQ3ZDLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFO3FCQUN4QztpQkFDRixDQUFDO1NBQ0gsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsNENBQTRDLEVBQUUsR0FBRyxFQUFFO1FBQ3RELFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxJQUFJLFlBQU0sQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO1lBQzFCLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxFQUFFLEVBQUUsTUFBTTtvQkFDVixVQUFVLEVBQUUsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUU7aUJBRTdEO2dCQUNEO29CQUNFLEVBQUUsRUFBRSxPQUFPO29CQUNYLE1BQU0sRUFBRSxRQUFRO2lCQUNqQjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGlCQUFpQixFQUFFO1lBQ2pFLHFCQUFxQixFQUFFLENBQUM7b0JBQ3RCLEVBQUUsRUFBRSxNQUFNO29CQUNWLFVBQVUsRUFBRTt3QkFDVixFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRTt3QkFDdkMsRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUU7cUJBQ3hDO2lCQUNGO2dCQUNEO29CQUNFLEVBQUUsRUFBRSxPQUFPO29CQUNYLE1BQU0sRUFBRSxRQUFRO2lCQUNqQixDQUFDO1NBQ0gsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQnVja2V0IH0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ21ldHJpY3MnLCAoKSA9PiB7XG4gIHRlc3QoJ0NhbiB1c2UgYWRkTWV0cmljcygpIHRvIGFkZCBhIG1ldHJpYyBjb25maWd1cmF0aW9uJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBidWNrZXQgPSBuZXcgQnVja2V0KHN0YWNrLCAnQnVja2V0Jyk7XG4gICAgYnVja2V0LmFkZE1ldHJpYyh7XG4gICAgICBpZDogJ3Rlc3QnLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlMzOjpCdWNrZXQnLCB7XG4gICAgICBNZXRyaWNzQ29uZmlndXJhdGlvbnM6IFt7XG4gICAgICAgIElkOiAndGVzdCcsXG4gICAgICB9XSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQnVja2V0IHdpdGggbWV0cmljcyBvbiBwcmVmaXgnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBCdWNrZXQoc3RhY2ssICdCdWNrZXQnLCB7XG4gICAgICBtZXRyaWNzOiBbe1xuICAgICAgICBpZDogJ3Rlc3QnLFxuICAgICAgICBwcmVmaXg6ICdwcmVmaXgnLFxuICAgICAgfV0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIHtcbiAgICAgIE1ldHJpY3NDb25maWd1cmF0aW9uczogW3tcbiAgICAgICAgSWQ6ICd0ZXN0JyxcbiAgICAgICAgUHJlZml4OiAncHJlZml4JyxcbiAgICAgIH1dLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdCdWNrZXQgd2l0aCBtZXRyaWNzIG9uIHRhZyBmaWx0ZXInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBCdWNrZXQoc3RhY2ssICdCdWNrZXQnLCB7XG4gICAgICBtZXRyaWNzOiBbe1xuICAgICAgICBpZDogJ3Rlc3QnLFxuICAgICAgICB0YWdGaWx0ZXJzOiB7IHRhZ25hbWUxOiAndGFndmFsdWUxJywgdGFnbmFtZTI6ICd0YWd2YWx1ZTInIH0sXG4gICAgICB9XSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0Jywge1xuICAgICAgTWV0cmljc0NvbmZpZ3VyYXRpb25zOiBbe1xuICAgICAgICBJZDogJ3Rlc3QnLFxuICAgICAgICBUYWdGaWx0ZXJzOiBbXG4gICAgICAgICAgeyBLZXk6ICd0YWduYW1lMScsIFZhbHVlOiAndGFndmFsdWUxJyB9LFxuICAgICAgICAgIHsgS2V5OiAndGFnbmFtZTInLCBWYWx1ZTogJ3RhZ3ZhbHVlMicgfSxcbiAgICAgICAgXSxcbiAgICAgIH1dLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdCdWNrZXQgd2l0aCBtdWx0aXBsZSBtZXRyaWMgY29uZmlndXJhdGlvbnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBCdWNrZXQoc3RhY2ssICdCdWNrZXQnLCB7XG4gICAgICBtZXRyaWNzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ3Rlc3QnLFxuICAgICAgICAgIHRhZ0ZpbHRlcnM6IHsgdGFnbmFtZTE6ICd0YWd2YWx1ZTEnLCB0YWduYW1lMjogJ3RhZ3ZhbHVlMicgfSxcblxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICd0ZXN0MicsXG4gICAgICAgICAgcHJlZml4OiAncHJlZml4JyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIHtcbiAgICAgIE1ldHJpY3NDb25maWd1cmF0aW9uczogW3tcbiAgICAgICAgSWQ6ICd0ZXN0JyxcbiAgICAgICAgVGFnRmlsdGVyczogW1xuICAgICAgICAgIHsgS2V5OiAndGFnbmFtZTEnLCBWYWx1ZTogJ3RhZ3ZhbHVlMScgfSxcbiAgICAgICAgICB7IEtleTogJ3RhZ25hbWUyJywgVmFsdWU6ICd0YWd2YWx1ZTInIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBJZDogJ3Rlc3QyJyxcbiAgICAgICAgUHJlZml4OiAncHJlZml4JyxcbiAgICAgIH1dLFxuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19