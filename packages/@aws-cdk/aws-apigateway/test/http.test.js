"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk = require("@aws-cdk/core");
const apigateway = require("../lib");
describe('http integration', () => {
    test('minimal setup', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigateway.RestApi(stack, 'my-api');
        // WHEN
        const integ = new apigateway.HttpIntegration('http://foo/bar');
        api.root.addMethod('GET', integ);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            Integration: {
                IntegrationHttpMethod: 'GET',
                Type: 'HTTP_PROXY',
                Uri: 'http://foo/bar',
            },
        });
    });
    test('options can be passed via props', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigateway.RestApi(stack, 'my-api');
        // WHEN
        const integ = new apigateway.HttpIntegration('http://foo/bar', {
            httpMethod: 'POST',
            proxy: false,
            options: {
                cacheNamespace: 'hey',
            },
        });
        api.root.addMethod('GET', integ);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            Integration: {
                CacheNamespace: 'hey',
                IntegrationHttpMethod: 'POST',
                Type: 'HTTP',
                Uri: 'http://foo/bar',
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaHR0cC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHFDQUFxQztBQUNyQyxxQ0FBcUM7QUFFckMsUUFBUSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtJQUNoQyxJQUFJLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtRQUN6QixRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUVwRCxPQUFPO1FBQ1AsTUFBTSxLQUFLLEdBQUcsSUFBSSxVQUFVLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFFL0QsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRWpDLE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx5QkFBeUIsRUFBRTtZQUN6RSxXQUFXLEVBQUU7Z0JBQ1gscUJBQXFCLEVBQUUsS0FBSztnQkFDNUIsSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLEdBQUcsRUFBRSxnQkFBZ0I7YUFDdEI7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxpQ0FBaUMsRUFBRSxHQUFHLEVBQUU7UUFDM0MsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzlCLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFcEQsT0FBTztRQUNQLE1BQU0sS0FBSyxHQUFHLElBQUksVUFBVSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRTtZQUM3RCxVQUFVLEVBQUUsTUFBTTtZQUNsQixLQUFLLEVBQUUsS0FBSztZQUNaLE9BQU8sRUFBRTtnQkFDUCxjQUFjLEVBQUUsS0FBSzthQUN0QjtTQUNGLENBQUMsQ0FBQztRQUVILEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVqQyxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMseUJBQXlCLEVBQUU7WUFDekUsV0FBVyxFQUFFO2dCQUNYLGNBQWMsRUFBRSxLQUFLO2dCQUNyQixxQkFBcUIsRUFBRSxNQUFNO2dCQUM3QixJQUFJLEVBQUUsTUFBTTtnQkFDWixHQUFHLEVBQUUsZ0JBQWdCO2FBQ3RCO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBhcGlnYXRld2F5IGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCdodHRwIGludGVncmF0aW9uJywgKCkgPT4ge1xuICB0ZXN0KCdtaW5pbWFsIHNldHVwJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaShzdGFjaywgJ215LWFwaScpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGludGVnID0gbmV3IGFwaWdhdGV3YXkuSHR0cEludGVncmF0aW9uKCdodHRwOi8vZm9vL2JhcicpO1xuXG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnLCBpbnRlZyk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6TWV0aG9kJywge1xuICAgICAgSW50ZWdyYXRpb246IHtcbiAgICAgICAgSW50ZWdyYXRpb25IdHRwTWV0aG9kOiAnR0VUJyxcbiAgICAgICAgVHlwZTogJ0hUVFBfUFJPWFknLFxuICAgICAgICBVcmk6ICdodHRwOi8vZm9vL2JhcicsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdvcHRpb25zIGNhbiBiZSBwYXNzZWQgdmlhIHByb3BzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaShzdGFjaywgJ215LWFwaScpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGludGVnID0gbmV3IGFwaWdhdGV3YXkuSHR0cEludGVncmF0aW9uKCdodHRwOi8vZm9vL2JhcicsIHtcbiAgICAgIGh0dHBNZXRob2Q6ICdQT1NUJyxcbiAgICAgIHByb3h5OiBmYWxzZSxcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgY2FjaGVOYW1lc3BhY2U6ICdoZXknLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJywgaW50ZWcpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsIHtcbiAgICAgIEludGVncmF0aW9uOiB7XG4gICAgICAgIENhY2hlTmFtZXNwYWNlOiAnaGV5JyxcbiAgICAgICAgSW50ZWdyYXRpb25IdHRwTWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIFR5cGU6ICdIVFRQJyxcbiAgICAgICAgVXJpOiAnaHR0cDovL2Zvby9iYXInLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==