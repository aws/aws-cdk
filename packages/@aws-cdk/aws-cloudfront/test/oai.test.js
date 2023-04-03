"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cdk = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('Origin Access Identity', () => {
    test('With automatic comment', () => {
        const stack = new cdk.Stack();
        new lib_1.OriginAccessIdentity(stack, 'OAI');
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                OAIE1EFC67F: {
                    Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
                    Properties: {
                        CloudFrontOriginAccessIdentityConfig: {
                            Comment: 'Allows CloudFront to reach the bucket',
                        },
                    },
                },
            },
        });
    });
    test('With provided comment', () => {
        const stack = new cdk.Stack();
        new lib_1.OriginAccessIdentity(stack, 'OAI', {
            comment: 'test comment',
        });
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                OAIE1EFC67F: {
                    Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
                    Properties: {
                        CloudFrontOriginAccessIdentityConfig: {
                            Comment: 'test comment',
                        },
                    },
                },
            },
        });
    });
    test('Truncates long comments', () => {
        const stack = new cdk.Stack();
        new lib_1.OriginAccessIdentity(stack, 'OAI', {
            comment: 'This is a really long comment. Auto-generated comments based on ids of origins might sometimes be this long or even longer and that will break',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::CloudFrontOriginAccessIdentity', {
            CloudFrontOriginAccessIdentityConfig: {
                Comment: 'This is a really long comment. Auto-generated comments based on ids of origins might sometimes be this long or even longer and t',
            },
        });
    });
    cdk_build_tools_1.testDeprecated('Builds ARN of CloudFront user for fromOriginAccessIdentityName', () => {
        const stack = new cdk.Stack();
        const oai = lib_1.OriginAccessIdentity.fromOriginAccessIdentityName(stack, 'OAI', 'OAITest');
        expect(oai.grantPrincipal.policyFragment.principalJson.AWS[0]).toMatch(/:iam::cloudfront:user\/CloudFront Origin Access Identity OAITest$/);
    });
    test('Builds ARN of CloudFront user for fromOriginAccessIdentityId', () => {
        const stack = new cdk.Stack();
        const oai = lib_1.OriginAccessIdentity.fromOriginAccessIdentityId(stack, 'OAI', 'OAITest');
        expect(oai.grantPrincipal.policyFragment.principalJson.AWS[0]).toMatch(/:iam::cloudfront:user\/CloudFront Origin Access Identity OAITest$/);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2FpLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJvYWkudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyw4REFBMEQ7QUFDMUQscUNBQXFDO0FBQ3JDLGdDQUE4QztBQUU5QyxRQUFRLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLEVBQUU7UUFDbEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFOUIsSUFBSSwwQkFBb0IsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFdkMscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUN2QztZQUNFLFNBQVMsRUFBRTtnQkFDVCxXQUFXLEVBQUU7b0JBQ1gsSUFBSSxFQUFFLGlEQUFpRDtvQkFDdkQsVUFBVSxFQUFFO3dCQUNWLG9DQUFvQyxFQUFFOzRCQUNwQyxPQUFPLEVBQUUsdUNBQXVDO3lCQUNqRDtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FDRixDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxFQUFFO1FBQ2pDLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTlCLElBQUksMEJBQW9CLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtZQUNyQyxPQUFPLEVBQUUsY0FBYztTQUN4QixDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLENBQ3ZDO1lBQ0UsU0FBUyxFQUFFO2dCQUNULFdBQVcsRUFBRTtvQkFDWCxJQUFJLEVBQUUsaURBQWlEO29CQUN2RCxVQUFVLEVBQUU7d0JBQ1Ysb0NBQW9DLEVBQUU7NEJBQ3BDLE9BQU8sRUFBRSxjQUFjO3lCQUN4QjtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FDRixDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMseUJBQXlCLEVBQUUsR0FBRyxFQUFFO1FBQ25DLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTlCLElBQUksMEJBQW9CLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtZQUNyQyxPQUFPLEVBQUUsZ0pBQWdKO1NBQzFKLENBQUMsQ0FBQztRQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGlEQUFpRCxFQUFFO1lBQ2pHLG9DQUFvQyxFQUFFO2dCQUNwQyxPQUFPLEVBQUUsa0lBQWtJO2FBQzVJO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxnQ0FBYyxDQUFDLGdFQUFnRSxFQUFFLEdBQUcsRUFBRTtRQUNwRixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUU5QixNQUFNLEdBQUcsR0FBRywwQkFBb0IsQ0FBQyw0QkFBNEIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRXZGLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG1FQUFtRSxDQUFDLENBQUM7SUFDOUksQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsOERBQThELEVBQUUsR0FBRyxFQUFFO1FBQ3hFLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTlCLE1BQU0sR0FBRyxHQUFHLDBCQUFvQixDQUFDLDBCQUEwQixDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFckYsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsbUVBQW1FLENBQUMsQ0FBQztJQUM5SSxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCB7IHRlc3REZXByZWNhdGVkIH0gZnJvbSAnQGF3cy1jZGsvY2RrLWJ1aWxkLXRvb2xzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IE9yaWdpbkFjY2Vzc0lkZW50aXR5IH0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ09yaWdpbiBBY2Nlc3MgSWRlbnRpdHknLCAoKSA9PiB7XG4gIHRlc3QoJ1dpdGggYXV0b21hdGljIGNvbW1lbnQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBuZXcgT3JpZ2luQWNjZXNzSWRlbnRpdHkoc3RhY2ssICdPQUknKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKFxuICAgICAge1xuICAgICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgICBPQUlFMUVGQzY3Rjoge1xuICAgICAgICAgICAgVHlwZTogJ0FXUzo6Q2xvdWRGcm9udDo6Q2xvdWRGcm9udE9yaWdpbkFjY2Vzc0lkZW50aXR5JyxcbiAgICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgQ2xvdWRGcm9udE9yaWdpbkFjY2Vzc0lkZW50aXR5Q29uZmlnOiB7XG4gICAgICAgICAgICAgICAgQ29tbWVudDogJ0FsbG93cyBDbG91ZEZyb250IHRvIHJlYWNoIHRoZSBidWNrZXQnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICApO1xuICB9KTtcblxuICB0ZXN0KCdXaXRoIHByb3ZpZGVkIGNvbW1lbnQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBuZXcgT3JpZ2luQWNjZXNzSWRlbnRpdHkoc3RhY2ssICdPQUknLCB7XG4gICAgICBjb21tZW50OiAndGVzdCBjb21tZW50JyxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKFxuICAgICAge1xuICAgICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgICBPQUlFMUVGQzY3Rjoge1xuICAgICAgICAgICAgVHlwZTogJ0FXUzo6Q2xvdWRGcm9udDo6Q2xvdWRGcm9udE9yaWdpbkFjY2Vzc0lkZW50aXR5JyxcbiAgICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgQ2xvdWRGcm9udE9yaWdpbkFjY2Vzc0lkZW50aXR5Q29uZmlnOiB7XG4gICAgICAgICAgICAgICAgQ29tbWVudDogJ3Rlc3QgY29tbWVudCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICk7XG4gIH0pO1xuXG4gIHRlc3QoJ1RydW5jYXRlcyBsb25nIGNvbW1lbnRzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgbmV3IE9yaWdpbkFjY2Vzc0lkZW50aXR5KHN0YWNrLCAnT0FJJywge1xuICAgICAgY29tbWVudDogJ1RoaXMgaXMgYSByZWFsbHkgbG9uZyBjb21tZW50LiBBdXRvLWdlbmVyYXRlZCBjb21tZW50cyBiYXNlZCBvbiBpZHMgb2Ygb3JpZ2lucyBtaWdodCBzb21ldGltZXMgYmUgdGhpcyBsb25nIG9yIGV2ZW4gbG9uZ2VyIGFuZCB0aGF0IHdpbGwgYnJlYWsnLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2xvdWRGcm9udDo6Q2xvdWRGcm9udE9yaWdpbkFjY2Vzc0lkZW50aXR5Jywge1xuICAgICAgQ2xvdWRGcm9udE9yaWdpbkFjY2Vzc0lkZW50aXR5Q29uZmlnOiB7XG4gICAgICAgIENvbW1lbnQ6ICdUaGlzIGlzIGEgcmVhbGx5IGxvbmcgY29tbWVudC4gQXV0by1nZW5lcmF0ZWQgY29tbWVudHMgYmFzZWQgb24gaWRzIG9mIG9yaWdpbnMgbWlnaHQgc29tZXRpbWVzIGJlIHRoaXMgbG9uZyBvciBldmVuIGxvbmdlciBhbmQgdCcsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnQnVpbGRzIEFSTiBvZiBDbG91ZEZyb250IHVzZXIgZm9yIGZyb21PcmlnaW5BY2Nlc3NJZGVudGl0eU5hbWUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCBvYWkgPSBPcmlnaW5BY2Nlc3NJZGVudGl0eS5mcm9tT3JpZ2luQWNjZXNzSWRlbnRpdHlOYW1lKHN0YWNrLCAnT0FJJywgJ09BSVRlc3QnKTtcblxuICAgIGV4cGVjdChvYWkuZ3JhbnRQcmluY2lwYWwucG9saWN5RnJhZ21lbnQucHJpbmNpcGFsSnNvbi5BV1NbMF0pLnRvTWF0Y2goLzppYW06OmNsb3VkZnJvbnQ6dXNlclxcL0Nsb3VkRnJvbnQgT3JpZ2luIEFjY2VzcyBJZGVudGl0eSBPQUlUZXN0JC8pO1xuICB9KTtcblxuICB0ZXN0KCdCdWlsZHMgQVJOIG9mIENsb3VkRnJvbnQgdXNlciBmb3IgZnJvbU9yaWdpbkFjY2Vzc0lkZW50aXR5SWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCBvYWkgPSBPcmlnaW5BY2Nlc3NJZGVudGl0eS5mcm9tT3JpZ2luQWNjZXNzSWRlbnRpdHlJZChzdGFjaywgJ09BSScsICdPQUlUZXN0Jyk7XG5cbiAgICBleHBlY3Qob2FpLmdyYW50UHJpbmNpcGFsLnBvbGljeUZyYWdtZW50LnByaW5jaXBhbEpzb24uQVdTWzBdKS50b01hdGNoKC86aWFtOjpjbG91ZGZyb250OnVzZXJcXC9DbG91ZEZyb250IE9yaWdpbiBBY2Nlc3MgSWRlbnRpdHkgT0FJVGVzdCQvKTtcbiAgfSk7XG59KTtcbiJdfQ==