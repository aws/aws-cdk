"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../../lib");
describe('UserPoolIdentityProvider', () => {
    describe('facebook', () => {
        test('defaults', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            new lib_1.UserPoolIdentityProviderFacebook(stack, 'userpoolidp', {
                userPool: pool,
                clientId: 'fb-client-id',
                clientSecret: 'fb-client-secret',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
                ProviderName: 'Facebook',
                ProviderType: 'Facebook',
                ProviderDetails: {
                    client_id: 'fb-client-id',
                    client_secret: 'fb-client-secret',
                    authorize_scopes: 'public_profile',
                },
            });
        });
        test('scopes & api_version', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            new lib_1.UserPoolIdentityProviderFacebook(stack, 'userpoolidp', {
                userPool: pool,
                clientId: 'fb-client-id',
                clientSecret: 'fb-client-secret',
                scopes: ['scope1', 'scope2'],
                apiVersion: 'version1',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
                ProviderName: 'Facebook',
                ProviderType: 'Facebook',
                ProviderDetails: {
                    client_id: 'fb-client-id',
                    client_secret: 'fb-client-secret',
                    authorize_scopes: 'scope1,scope2',
                    api_version: 'version1',
                },
            });
        });
        test('registered with user pool', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            const provider = new lib_1.UserPoolIdentityProviderFacebook(stack, 'userpoolidp', {
                userPool: pool,
                clientId: 'fb-client-id',
                clientSecret: 'fb-client-secret',
            });
            // THEN
            expect(pool.identityProviders).toContain(provider);
        });
        test('attribute mapping', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            new lib_1.UserPoolIdentityProviderFacebook(stack, 'userpoolidp', {
                userPool: pool,
                clientId: 'fb-client-id',
                clientSecret: 'fb-client-secret',
                attributeMapping: {
                    givenName: lib_1.ProviderAttribute.FACEBOOK_NAME,
                    address: lib_1.ProviderAttribute.other('fb-address'),
                    custom: {
                        customAttr1: lib_1.ProviderAttribute.FACEBOOK_EMAIL,
                        customAttr2: lib_1.ProviderAttribute.other('fb-custom-attr'),
                    },
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
                AttributeMapping: {
                    given_name: 'name',
                    address: 'fb-address',
                    customAttr1: 'email',
                    customAttr2: 'fb-custom-attr',
                },
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZWJvb2sudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZhY2Vib29rLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0Msd0NBQXNDO0FBQ3RDLG1DQUEwRjtBQUUxRixRQUFRLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFO1FBQ3hCLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFO1lBQ3BCLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBQzFCLE1BQU0sSUFBSSxHQUFHLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztZQUU3QyxPQUFPO1lBQ1AsSUFBSSxzQ0FBZ0MsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO2dCQUN6RCxRQUFRLEVBQUUsSUFBSTtnQkFDZCxRQUFRLEVBQUUsY0FBYztnQkFDeEIsWUFBWSxFQUFFLGtCQUFrQjthQUNqQyxDQUFDLENBQUM7WUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3Q0FBd0MsRUFBRTtnQkFDeEYsWUFBWSxFQUFFLFVBQVU7Z0JBQ3hCLFlBQVksRUFBRSxVQUFVO2dCQUN4QixlQUFlLEVBQUU7b0JBQ2YsU0FBUyxFQUFFLGNBQWM7b0JBQ3pCLGFBQWEsRUFBRSxrQkFBa0I7b0JBQ2pDLGdCQUFnQixFQUFFLGdCQUFnQjtpQkFDbkM7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUU7WUFDaEMsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBRTdDLE9BQU87WUFDUCxJQUFJLHNDQUFnQyxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7Z0JBQ3pELFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxjQUFjO2dCQUN4QixZQUFZLEVBQUUsa0JBQWtCO2dCQUNoQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDO2dCQUM1QixVQUFVLEVBQUUsVUFBVTthQUN2QixDQUFDLENBQUM7WUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3Q0FBd0MsRUFBRTtnQkFDeEYsWUFBWSxFQUFFLFVBQVU7Z0JBQ3hCLFlBQVksRUFBRSxVQUFVO2dCQUN4QixlQUFlLEVBQUU7b0JBQ2YsU0FBUyxFQUFFLGNBQWM7b0JBQ3pCLGFBQWEsRUFBRSxrQkFBa0I7b0JBQ2pDLGdCQUFnQixFQUFFLGVBQWU7b0JBQ2pDLFdBQVcsRUFBRSxVQUFVO2lCQUN4QjthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRTtZQUNyQyxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixNQUFNLElBQUksR0FBRyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFFN0MsT0FBTztZQUNQLE1BQU0sUUFBUSxHQUFHLElBQUksc0NBQWdDLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRTtnQkFDMUUsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLGNBQWM7Z0JBQ3hCLFlBQVksRUFBRSxrQkFBa0I7YUFDakMsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFO1lBQzdCLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBQzFCLE1BQU0sSUFBSSxHQUFHLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztZQUU3QyxPQUFPO1lBQ1AsSUFBSSxzQ0FBZ0MsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO2dCQUN6RCxRQUFRLEVBQUUsSUFBSTtnQkFDZCxRQUFRLEVBQUUsY0FBYztnQkFDeEIsWUFBWSxFQUFFLGtCQUFrQjtnQkFDaEMsZ0JBQWdCLEVBQUU7b0JBQ2hCLFNBQVMsRUFBRSx1QkFBaUIsQ0FBQyxhQUFhO29CQUMxQyxPQUFPLEVBQUUsdUJBQWlCLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQztvQkFDOUMsTUFBTSxFQUFFO3dCQUNOLFdBQVcsRUFBRSx1QkFBaUIsQ0FBQyxjQUFjO3dCQUM3QyxXQUFXLEVBQUUsdUJBQWlCLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDO3FCQUN2RDtpQkFDRjthQUNGLENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3Q0FBd0MsRUFBRTtnQkFDeEYsZ0JBQWdCLEVBQUU7b0JBQ2hCLFVBQVUsRUFBRSxNQUFNO29CQUNsQixPQUFPLEVBQUUsWUFBWTtvQkFDckIsV0FBVyxFQUFFLE9BQU87b0JBQ3BCLFdBQVcsRUFBRSxnQkFBZ0I7aUJBQzlCO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBQcm92aWRlckF0dHJpYnV0ZSwgVXNlclBvb2wsIFVzZXJQb29sSWRlbnRpdHlQcm92aWRlckZhY2Vib29rIH0gZnJvbSAnLi4vLi4vbGliJztcblxuZGVzY3JpYmUoJ1VzZXJQb29sSWRlbnRpdHlQcm92aWRlcicsICgpID0+IHtcbiAgZGVzY3JpYmUoJ2ZhY2Vib29rJywgKCkgPT4ge1xuICAgIHRlc3QoJ2RlZmF1bHRzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAndXNlcnBvb2wnKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IFVzZXJQb29sSWRlbnRpdHlQcm92aWRlckZhY2Vib29rKHN0YWNrLCAndXNlcnBvb2xpZHAnLCB7XG4gICAgICAgIHVzZXJQb29sOiBwb29sLFxuICAgICAgICBjbGllbnRJZDogJ2ZiLWNsaWVudC1pZCcsXG4gICAgICAgIGNsaWVudFNlY3JldDogJ2ZiLWNsaWVudC1zZWNyZXQnLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sSWRlbnRpdHlQcm92aWRlcicsIHtcbiAgICAgICAgUHJvdmlkZXJOYW1lOiAnRmFjZWJvb2snLFxuICAgICAgICBQcm92aWRlclR5cGU6ICdGYWNlYm9vaycsXG4gICAgICAgIFByb3ZpZGVyRGV0YWlsczoge1xuICAgICAgICAgIGNsaWVudF9pZDogJ2ZiLWNsaWVudC1pZCcsXG4gICAgICAgICAgY2xpZW50X3NlY3JldDogJ2ZiLWNsaWVudC1zZWNyZXQnLFxuICAgICAgICAgIGF1dGhvcml6ZV9zY29wZXM6ICdwdWJsaWNfcHJvZmlsZScsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Njb3BlcyAmIGFwaV92ZXJzaW9uJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAndXNlcnBvb2wnKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IFVzZXJQb29sSWRlbnRpdHlQcm92aWRlckZhY2Vib29rKHN0YWNrLCAndXNlcnBvb2xpZHAnLCB7XG4gICAgICAgIHVzZXJQb29sOiBwb29sLFxuICAgICAgICBjbGllbnRJZDogJ2ZiLWNsaWVudC1pZCcsXG4gICAgICAgIGNsaWVudFNlY3JldDogJ2ZiLWNsaWVudC1zZWNyZXQnLFxuICAgICAgICBzY29wZXM6IFsnc2NvcGUxJywgJ3Njb3BlMiddLFxuICAgICAgICBhcGlWZXJzaW9uOiAndmVyc2lvbjEnLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sSWRlbnRpdHlQcm92aWRlcicsIHtcbiAgICAgICAgUHJvdmlkZXJOYW1lOiAnRmFjZWJvb2snLFxuICAgICAgICBQcm92aWRlclR5cGU6ICdGYWNlYm9vaycsXG4gICAgICAgIFByb3ZpZGVyRGV0YWlsczoge1xuICAgICAgICAgIGNsaWVudF9pZDogJ2ZiLWNsaWVudC1pZCcsXG4gICAgICAgICAgY2xpZW50X3NlY3JldDogJ2ZiLWNsaWVudC1zZWNyZXQnLFxuICAgICAgICAgIGF1dGhvcml6ZV9zY29wZXM6ICdzY29wZTEsc2NvcGUyJyxcbiAgICAgICAgICBhcGlfdmVyc2lvbjogJ3ZlcnNpb24xJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncmVnaXN0ZXJlZCB3aXRoIHVzZXIgcG9vbCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ3VzZXJwb29sJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHByb3ZpZGVyID0gbmV3IFVzZXJQb29sSWRlbnRpdHlQcm92aWRlckZhY2Vib29rKHN0YWNrLCAndXNlcnBvb2xpZHAnLCB7XG4gICAgICAgIHVzZXJQb29sOiBwb29sLFxuICAgICAgICBjbGllbnRJZDogJ2ZiLWNsaWVudC1pZCcsXG4gICAgICAgIGNsaWVudFNlY3JldDogJ2ZiLWNsaWVudC1zZWNyZXQnLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChwb29sLmlkZW50aXR5UHJvdmlkZXJzKS50b0NvbnRhaW4ocHJvdmlkZXIpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYXR0cmlidXRlIG1hcHBpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICd1c2VycG9vbCcpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyRmFjZWJvb2soc3RhY2ssICd1c2VycG9vbGlkcCcsIHtcbiAgICAgICAgdXNlclBvb2w6IHBvb2wsXG4gICAgICAgIGNsaWVudElkOiAnZmItY2xpZW50LWlkJyxcbiAgICAgICAgY2xpZW50U2VjcmV0OiAnZmItY2xpZW50LXNlY3JldCcsXG4gICAgICAgIGF0dHJpYnV0ZU1hcHBpbmc6IHtcbiAgICAgICAgICBnaXZlbk5hbWU6IFByb3ZpZGVyQXR0cmlidXRlLkZBQ0VCT09LX05BTUUsXG4gICAgICAgICAgYWRkcmVzczogUHJvdmlkZXJBdHRyaWJ1dGUub3RoZXIoJ2ZiLWFkZHJlc3MnKSxcbiAgICAgICAgICBjdXN0b206IHtcbiAgICAgICAgICAgIGN1c3RvbUF0dHIxOiBQcm92aWRlckF0dHJpYnV0ZS5GQUNFQk9PS19FTUFJTCxcbiAgICAgICAgICAgIGN1c3RvbUF0dHIyOiBQcm92aWRlckF0dHJpYnV0ZS5vdGhlcignZmItY3VzdG9tLWF0dHInKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sSWRlbnRpdHlQcm92aWRlcicsIHtcbiAgICAgICAgQXR0cmlidXRlTWFwcGluZzoge1xuICAgICAgICAgIGdpdmVuX25hbWU6ICduYW1lJyxcbiAgICAgICAgICBhZGRyZXNzOiAnZmItYWRkcmVzcycsXG4gICAgICAgICAgY3VzdG9tQXR0cjE6ICdlbWFpbCcsXG4gICAgICAgICAgY3VzdG9tQXR0cjI6ICdmYi1jdXN0b20tYXR0cicsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==