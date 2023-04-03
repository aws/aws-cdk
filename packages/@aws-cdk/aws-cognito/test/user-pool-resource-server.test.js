"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('User Pool Resource Server', () => {
    test('default setup', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        // WHEN
        new lib_1.UserPoolResourceServer(stack, 'Server', {
            userPool: pool,
            identifier: 'users',
        });
        //THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolResourceServer', {
            Identifier: 'users',
            Name: 'users',
            UserPoolId: stack.resolve(pool.userPoolId),
        });
    });
    test('can assign a custom name', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        // WHEN
        new lib_1.UserPoolResourceServer(stack, 'Server', {
            userPoolResourceServerName: 'internal-users',
            userPool: pool,
            identifier: 'users',
        });
        //THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolResourceServer', {
            Identifier: 'users',
            Name: 'internal-users',
        });
    });
    test('can assign scopes', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        // WHEN
        new lib_1.UserPoolResourceServer(stack, 'Server', {
            userPool: pool,
            identifier: 'users',
            scopes: [
                {
                    scopeName: 'read',
                    scopeDescription: 'read only access',
                },
            ],
        });
        //THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolResourceServer', {
            Scopes: [
                {
                    ScopeDescription: 'read only access',
                    ScopeName: 'read',
                },
            ],
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1wb29sLXJlc291cmNlLXNlcnZlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlci1wb29sLXJlc291cmNlLXNlcnZlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHdDQUFzQztBQUN0QyxnQ0FBMEQ7QUFFMUQsUUFBUSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRTtJQUN6QyxJQUFJLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtRQUN6QixRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUMxQixNQUFNLElBQUksR0FBRyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFekMsT0FBTztRQUNQLElBQUksNEJBQXNCLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtZQUMxQyxRQUFRLEVBQUUsSUFBSTtZQUNkLFVBQVUsRUFBRSxPQUFPO1NBQ3BCLENBQUMsQ0FBQztRQUVILE1BQU07UUFDTixxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxzQ0FBc0MsRUFBRTtZQUN0RixVQUFVLEVBQUUsT0FBTztZQUNuQixJQUFJLEVBQUUsT0FBTztZQUNiLFVBQVUsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7U0FDM0MsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO1FBQ3BDLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBQzFCLE1BQU0sSUFBSSxHQUFHLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUV6QyxPQUFPO1FBQ1AsSUFBSSw0QkFBc0IsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO1lBQzFDLDBCQUEwQixFQUFFLGdCQUFnQjtZQUM1QyxRQUFRLEVBQUUsSUFBSTtZQUNkLFVBQVUsRUFBRSxPQUFPO1NBQ3BCLENBQUMsQ0FBQztRQUVILE1BQU07UUFDTixxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxzQ0FBc0MsRUFBRTtZQUN0RixVQUFVLEVBQUUsT0FBTztZQUNuQixJQUFJLEVBQUUsZ0JBQWdCO1NBQ3ZCLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtRQUM3QixRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUMxQixNQUFNLElBQUksR0FBRyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFekMsT0FBTztRQUNQLElBQUksNEJBQXNCLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtZQUMxQyxRQUFRLEVBQUUsSUFBSTtZQUNkLFVBQVUsRUFBRSxPQUFPO1lBQ25CLE1BQU0sRUFBRTtnQkFDTjtvQkFDRSxTQUFTLEVBQUUsTUFBTTtvQkFDakIsZ0JBQWdCLEVBQUUsa0JBQWtCO2lCQUNyQzthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTTtRQUNOLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHNDQUFzQyxFQUFFO1lBQ3RGLE1BQU0sRUFBRTtnQkFDTjtvQkFDRSxnQkFBZ0IsRUFBRSxrQkFBa0I7b0JBQ3BDLFNBQVMsRUFBRSxNQUFNO2lCQUNsQjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgVXNlclBvb2wsIFVzZXJQb29sUmVzb3VyY2VTZXJ2ZXIgfSBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgnVXNlciBQb29sIFJlc291cmNlIFNlcnZlcicsICgpID0+IHtcbiAgdGVzdCgnZGVmYXVsdCBzZXR1cCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgVXNlclBvb2xSZXNvdXJjZVNlcnZlcihzdGFjaywgJ1NlcnZlcicsIHtcbiAgICAgIHVzZXJQb29sOiBwb29sLFxuICAgICAgaWRlbnRpZmllcjogJ3VzZXJzJyxcbiAgICB9KTtcblxuICAgIC8vVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sUmVzb3VyY2VTZXJ2ZXInLCB7XG4gICAgICBJZGVudGlmaWVyOiAndXNlcnMnLFxuICAgICAgTmFtZTogJ3VzZXJzJyxcbiAgICAgIFVzZXJQb29sSWQ6IHN0YWNrLnJlc29sdmUocG9vbC51c2VyUG9vbElkKSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGFzc2lnbiBhIGN1c3RvbSBuYW1lJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBVc2VyUG9vbFJlc291cmNlU2VydmVyKHN0YWNrLCAnU2VydmVyJywge1xuICAgICAgdXNlclBvb2xSZXNvdXJjZVNlcnZlck5hbWU6ICdpbnRlcm5hbC11c2VycycsXG4gICAgICB1c2VyUG9vbDogcG9vbCxcbiAgICAgIGlkZW50aWZpZXI6ICd1c2VycycsXG4gICAgfSk7XG5cbiAgICAvL1RIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbFJlc291cmNlU2VydmVyJywge1xuICAgICAgSWRlbnRpZmllcjogJ3VzZXJzJyxcbiAgICAgIE5hbWU6ICdpbnRlcm5hbC11c2VycycsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBhc3NpZ24gc2NvcGVzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBVc2VyUG9vbFJlc291cmNlU2VydmVyKHN0YWNrLCAnU2VydmVyJywge1xuICAgICAgdXNlclBvb2w6IHBvb2wsXG4gICAgICBpZGVudGlmaWVyOiAndXNlcnMnLFxuICAgICAgc2NvcGVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzY29wZU5hbWU6ICdyZWFkJyxcbiAgICAgICAgICBzY29wZURlc2NyaXB0aW9uOiAncmVhZCBvbmx5IGFjY2VzcycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgLy9USEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2xSZXNvdXJjZVNlcnZlcicsIHtcbiAgICAgIFNjb3BlczogW1xuICAgICAgICB7XG4gICAgICAgICAgU2NvcGVEZXNjcmlwdGlvbjogJ3JlYWQgb25seSBhY2Nlc3MnLFxuICAgICAgICAgIFNjb3BlTmFtZTogJ3JlYWQnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==