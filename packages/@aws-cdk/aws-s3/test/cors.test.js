"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('cors', () => {
    test('Can use addCors() to add a CORS configuration', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const bucket = new lib_1.Bucket(stack, 'Bucket');
        bucket.addCorsRule({
            allowedMethods: [lib_1.HttpMethods.GET, lib_1.HttpMethods.HEAD],
            allowedOrigins: ['https://example.com'],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
            CorsConfiguration: {
                CorsRules: [{
                        AllowedMethods: ['GET', 'HEAD'],
                        AllowedOrigins: ['https://example.com'],
                    }],
            },
        });
    });
    test('Bucket with multiple cors configurations', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.Bucket(stack, 'Bucket', {
            cors: [
                {
                    allowedHeaders: [
                        '*',
                    ],
                    allowedMethods: [
                        lib_1.HttpMethods.GET,
                    ],
                    allowedOrigins: [
                        '*',
                    ],
                    exposedHeaders: [
                        'Date',
                    ],
                    id: 'myCORSRuleId1',
                    maxAge: 3600,
                },
                {
                    allowedHeaders: [
                        'x-amz-*',
                    ],
                    allowedMethods: [
                        lib_1.HttpMethods.DELETE,
                    ],
                    allowedOrigins: [
                        'http://www.example1.com',
                        'http://www.example2.com',
                    ],
                    exposedHeaders: [
                        'Connection',
                        'Server',
                        'Date',
                    ],
                    id: 'myCORSRuleId2',
                    maxAge: 1800,
                },
            ],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
            CorsConfiguration: {
                CorsRules: [
                    {
                        AllowedHeaders: [
                            '*',
                        ],
                        AllowedMethods: [
                            'GET',
                        ],
                        AllowedOrigins: [
                            '*',
                        ],
                        ExposedHeaders: [
                            'Date',
                        ],
                        Id: 'myCORSRuleId1',
                        MaxAge: 3600,
                    },
                    {
                        AllowedHeaders: [
                            'x-amz-*',
                        ],
                        AllowedMethods: [
                            'DELETE',
                        ],
                        AllowedOrigins: [
                            'http://www.example1.com',
                            'http://www.example2.com',
                        ],
                        ExposedHeaders: [
                            'Connection',
                            'Server',
                            'Date',
                        ],
                        Id: 'myCORSRuleId2',
                        MaxAge: 1800,
                    },
                ],
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ycy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29ycy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHdDQUFzQztBQUN0QyxnQ0FBNkM7QUFFN0MsUUFBUSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7SUFDcEIsSUFBSSxDQUFDLCtDQUErQyxFQUFFLEdBQUcsRUFBRTtRQUN6RCxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixPQUFPO1FBQ1AsTUFBTSxNQUFNLEdBQUcsSUFBSSxZQUFNLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxXQUFXLENBQUM7WUFDakIsY0FBYyxFQUFFLENBQUMsaUJBQVcsQ0FBQyxHQUFHLEVBQUUsaUJBQVcsQ0FBQyxJQUFJLENBQUM7WUFDbkQsY0FBYyxFQUFFLENBQUMscUJBQXFCLENBQUM7U0FDeEMsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGlCQUFpQixFQUFFO1lBQ2pFLGlCQUFpQixFQUFFO2dCQUNqQixTQUFTLEVBQUUsQ0FBQzt3QkFDVixjQUFjLEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDO3dCQUMvQixjQUFjLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztxQkFDeEMsQ0FBQzthQUNIO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsMENBQTBDLEVBQUUsR0FBRyxFQUFFO1FBQ3BELFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxJQUFJLFlBQU0sQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO1lBQzFCLElBQUksRUFBRTtnQkFDSjtvQkFDRSxjQUFjLEVBQUU7d0JBQ2QsR0FBRztxQkFDSjtvQkFDRCxjQUFjLEVBQUU7d0JBQ2QsaUJBQVcsQ0FBQyxHQUFHO3FCQUNoQjtvQkFDRCxjQUFjLEVBQUU7d0JBQ2QsR0FBRztxQkFDSjtvQkFDRCxjQUFjLEVBQUU7d0JBQ2QsTUFBTTtxQkFDUDtvQkFDRCxFQUFFLEVBQUUsZUFBZTtvQkFDbkIsTUFBTSxFQUFFLElBQUk7aUJBQ2I7Z0JBQ0Q7b0JBQ0UsY0FBYyxFQUFFO3dCQUNkLFNBQVM7cUJBQ1Y7b0JBQ0QsY0FBYyxFQUFFO3dCQUNkLGlCQUFXLENBQUMsTUFBTTtxQkFDbkI7b0JBQ0QsY0FBYyxFQUFFO3dCQUNkLHlCQUF5Qjt3QkFDekIseUJBQXlCO3FCQUMxQjtvQkFDRCxjQUFjLEVBQUU7d0JBQ2QsWUFBWTt3QkFDWixRQUFRO3dCQUNSLE1BQU07cUJBQ1A7b0JBQ0QsRUFBRSxFQUFFLGVBQWU7b0JBQ25CLE1BQU0sRUFBRSxJQUFJO2lCQUNiO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsaUJBQWlCLEVBQUU7WUFDakUsaUJBQWlCLEVBQUU7Z0JBQ2pCLFNBQVMsRUFBRTtvQkFDVDt3QkFDRSxjQUFjLEVBQUU7NEJBQ2QsR0FBRzt5QkFDSjt3QkFDRCxjQUFjLEVBQUU7NEJBQ2QsS0FBSzt5QkFDTjt3QkFDRCxjQUFjLEVBQUU7NEJBQ2QsR0FBRzt5QkFDSjt3QkFDRCxjQUFjLEVBQUU7NEJBQ2QsTUFBTTt5QkFDUDt3QkFDRCxFQUFFLEVBQUUsZUFBZTt3QkFDbkIsTUFBTSxFQUFFLElBQUk7cUJBQ2I7b0JBQ0Q7d0JBQ0UsY0FBYyxFQUFFOzRCQUNkLFNBQVM7eUJBQ1Y7d0JBQ0QsY0FBYyxFQUFFOzRCQUNkLFFBQVE7eUJBQ1Q7d0JBQ0QsY0FBYyxFQUFFOzRCQUNkLHlCQUF5Qjs0QkFDekIseUJBQXlCO3lCQUMxQjt3QkFDRCxjQUFjLEVBQUU7NEJBQ2QsWUFBWTs0QkFDWixRQUFROzRCQUNSLE1BQU07eUJBQ1A7d0JBQ0QsRUFBRSxFQUFFLGVBQWU7d0JBQ25CLE1BQU0sRUFBRSxJQUFJO3FCQUNiO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBCdWNrZXQsIEh0dHBNZXRob2RzIH0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ2NvcnMnLCAoKSA9PiB7XG4gIHRlc3QoJ0NhbiB1c2UgYWRkQ29ycygpIHRvIGFkZCBhIENPUlMgY29uZmlndXJhdGlvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYnVja2V0ID0gbmV3IEJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpO1xuICAgIGJ1Y2tldC5hZGRDb3JzUnVsZSh7XG4gICAgICBhbGxvd2VkTWV0aG9kczogW0h0dHBNZXRob2RzLkdFVCwgSHR0cE1ldGhvZHMuSEVBRF0sXG4gICAgICBhbGxvd2VkT3JpZ2luczogWydodHRwczovL2V4YW1wbGUuY29tJ10sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIHtcbiAgICAgIENvcnNDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIENvcnNSdWxlczogW3tcbiAgICAgICAgICBBbGxvd2VkTWV0aG9kczogWydHRVQnLCAnSEVBRCddLFxuICAgICAgICAgIEFsbG93ZWRPcmlnaW5zOiBbJ2h0dHBzOi8vZXhhbXBsZS5jb20nXSxcbiAgICAgICAgfV0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdCdWNrZXQgd2l0aCBtdWx0aXBsZSBjb3JzIGNvbmZpZ3VyYXRpb25zJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQnVja2V0KHN0YWNrLCAnQnVja2V0Jywge1xuICAgICAgY29yczogW1xuICAgICAgICB7XG4gICAgICAgICAgYWxsb3dlZEhlYWRlcnM6IFtcbiAgICAgICAgICAgICcqJyxcbiAgICAgICAgICBdLFxuICAgICAgICAgIGFsbG93ZWRNZXRob2RzOiBbXG4gICAgICAgICAgICBIdHRwTWV0aG9kcy5HRVQsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBhbGxvd2VkT3JpZ2luczogW1xuICAgICAgICAgICAgJyonLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgZXhwb3NlZEhlYWRlcnM6IFtcbiAgICAgICAgICAgICdEYXRlJyxcbiAgICAgICAgICBdLFxuICAgICAgICAgIGlkOiAnbXlDT1JTUnVsZUlkMScsXG4gICAgICAgICAgbWF4QWdlOiAzNjAwLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgYWxsb3dlZEhlYWRlcnM6IFtcbiAgICAgICAgICAgICd4LWFtei0qJyxcbiAgICAgICAgICBdLFxuICAgICAgICAgIGFsbG93ZWRNZXRob2RzOiBbXG4gICAgICAgICAgICBIdHRwTWV0aG9kcy5ERUxFVEUsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBhbGxvd2VkT3JpZ2luczogW1xuICAgICAgICAgICAgJ2h0dHA6Ly93d3cuZXhhbXBsZTEuY29tJyxcbiAgICAgICAgICAgICdodHRwOi8vd3d3LmV4YW1wbGUyLmNvbScsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBleHBvc2VkSGVhZGVyczogW1xuICAgICAgICAgICAgJ0Nvbm5lY3Rpb24nLFxuICAgICAgICAgICAgJ1NlcnZlcicsXG4gICAgICAgICAgICAnRGF0ZScsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBpZDogJ215Q09SU1J1bGVJZDInLFxuICAgICAgICAgIG1heEFnZTogMTgwMCxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIHtcbiAgICAgIENvcnNDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIENvcnNSdWxlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFsbG93ZWRIZWFkZXJzOiBbXG4gICAgICAgICAgICAgICcqJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBBbGxvd2VkTWV0aG9kczogW1xuICAgICAgICAgICAgICAnR0VUJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBBbGxvd2VkT3JpZ2luczogW1xuICAgICAgICAgICAgICAnKicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgRXhwb3NlZEhlYWRlcnM6IFtcbiAgICAgICAgICAgICAgJ0RhdGUnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIElkOiAnbXlDT1JTUnVsZUlkMScsXG4gICAgICAgICAgICBNYXhBZ2U6IDM2MDAsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBbGxvd2VkSGVhZGVyczogW1xuICAgICAgICAgICAgICAneC1hbXotKicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgQWxsb3dlZE1ldGhvZHM6IFtcbiAgICAgICAgICAgICAgJ0RFTEVURScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgQWxsb3dlZE9yaWdpbnM6IFtcbiAgICAgICAgICAgICAgJ2h0dHA6Ly93d3cuZXhhbXBsZTEuY29tJyxcbiAgICAgICAgICAgICAgJ2h0dHA6Ly93d3cuZXhhbXBsZTIuY29tJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBFeHBvc2VkSGVhZGVyczogW1xuICAgICAgICAgICAgICAnQ29ubmVjdGlvbicsXG4gICAgICAgICAgICAgICdTZXJ2ZXInLFxuICAgICAgICAgICAgICAnRGF0ZScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgSWQ6ICdteUNPUlNSdWxlSWQyJyxcbiAgICAgICAgICAgIE1heEFnZTogMTgwMCxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==