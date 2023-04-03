"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../../lib");
describe('UserPoolIdentityProvider', () => {
    describe('amazon', () => {
        test('defaults', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            new lib_1.UserPoolIdentityProviderAmazon(stack, 'userpoolidp', {
                userPool: pool,
                clientId: 'amzn-client-id',
                clientSecret: 'amzn-client-secret',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
                ProviderName: 'LoginWithAmazon',
                ProviderType: 'LoginWithAmazon',
                ProviderDetails: {
                    client_id: 'amzn-client-id',
                    client_secret: 'amzn-client-secret',
                    authorize_scopes: 'profile',
                },
            });
        });
        test('scopes', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            new lib_1.UserPoolIdentityProviderAmazon(stack, 'userpoolidp', {
                userPool: pool,
                clientId: 'amzn-client-id',
                clientSecret: 'amzn-client-secret',
                scopes: ['scope1', 'scope2'],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
                ProviderName: 'LoginWithAmazon',
                ProviderType: 'LoginWithAmazon',
                ProviderDetails: {
                    client_id: 'amzn-client-id',
                    client_secret: 'amzn-client-secret',
                    authorize_scopes: 'scope1 scope2',
                },
            });
        });
        test('registered with user pool', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            const provider = new lib_1.UserPoolIdentityProviderAmazon(stack, 'userpoolidp', {
                userPool: pool,
                clientId: 'amzn-client-id',
                clientSecret: 'amzn-client-secret',
            });
            // THEN
            expect(pool.identityProviders).toContain(provider);
        });
        test('attribute mapping', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            new lib_1.UserPoolIdentityProviderAmazon(stack, 'userpoolidp', {
                userPool: pool,
                clientId: 'amazn-client-id',
                clientSecret: 'amzn-client-secret',
                attributeMapping: {
                    givenName: lib_1.ProviderAttribute.AMAZON_NAME,
                    address: lib_1.ProviderAttribute.other('amzn-address'),
                    custom: {
                        customAttr1: lib_1.ProviderAttribute.AMAZON_EMAIL,
                        customAttr2: lib_1.ProviderAttribute.other('amzn-custom-attr'),
                    },
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
                AttributeMapping: {
                    given_name: 'name',
                    address: 'amzn-address',
                    customAttr1: 'email',
                    customAttr2: 'amzn-custom-attr',
                },
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1hem9uLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhbWF6b24udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyx3Q0FBc0M7QUFDdEMsbUNBQXdGO0FBRXhGLFFBQVEsQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7SUFDeEMsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7UUFDdEIsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUU7WUFDcEIsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBRTdDLE9BQU87WUFDUCxJQUFJLG9DQUE4QixDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7Z0JBQ3ZELFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxnQkFBZ0I7Z0JBQzFCLFlBQVksRUFBRSxvQkFBb0I7YUFDbkMsQ0FBQyxDQUFDO1lBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsd0NBQXdDLEVBQUU7Z0JBQ3hGLFlBQVksRUFBRSxpQkFBaUI7Z0JBQy9CLFlBQVksRUFBRSxpQkFBaUI7Z0JBQy9CLGVBQWUsRUFBRTtvQkFDZixTQUFTLEVBQUUsZ0JBQWdCO29CQUMzQixhQUFhLEVBQUUsb0JBQW9CO29CQUNuQyxnQkFBZ0IsRUFBRSxTQUFTO2lCQUM1QjthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7WUFDbEIsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBRTdDLE9BQU87WUFDUCxJQUFJLG9DQUE4QixDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7Z0JBQ3ZELFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxnQkFBZ0I7Z0JBQzFCLFlBQVksRUFBRSxvQkFBb0I7Z0JBQ2xDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUM7YUFDN0IsQ0FBQyxDQUFDO1lBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsd0NBQXdDLEVBQUU7Z0JBQ3hGLFlBQVksRUFBRSxpQkFBaUI7Z0JBQy9CLFlBQVksRUFBRSxpQkFBaUI7Z0JBQy9CLGVBQWUsRUFBRTtvQkFDZixTQUFTLEVBQUUsZ0JBQWdCO29CQUMzQixhQUFhLEVBQUUsb0JBQW9CO29CQUNuQyxnQkFBZ0IsRUFBRSxlQUFlO2lCQUNsQzthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRTtZQUNyQyxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixNQUFNLElBQUksR0FBRyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFFN0MsT0FBTztZQUNQLE1BQU0sUUFBUSxHQUFHLElBQUksb0NBQThCLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRTtnQkFDeEUsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsWUFBWSxFQUFFLG9CQUFvQjthQUNuQyxDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyRCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7WUFDN0IsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBRTdDLE9BQU87WUFDUCxJQUFJLG9DQUE4QixDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7Z0JBQ3ZELFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLFlBQVksRUFBRSxvQkFBb0I7Z0JBQ2xDLGdCQUFnQixFQUFFO29CQUNoQixTQUFTLEVBQUUsdUJBQWlCLENBQUMsV0FBVztvQkFDeEMsT0FBTyxFQUFFLHVCQUFpQixDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUM7b0JBQ2hELE1BQU0sRUFBRTt3QkFDTixXQUFXLEVBQUUsdUJBQWlCLENBQUMsWUFBWTt3QkFDM0MsV0FBVyxFQUFFLHVCQUFpQixDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQztxQkFDekQ7aUJBQ0Y7YUFDRixDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsd0NBQXdDLEVBQUU7Z0JBQ3hGLGdCQUFnQixFQUFFO29CQUNoQixVQUFVLEVBQUUsTUFBTTtvQkFDbEIsT0FBTyxFQUFFLGNBQWM7b0JBQ3ZCLFdBQVcsRUFBRSxPQUFPO29CQUNwQixXQUFXLEVBQUUsa0JBQWtCO2lCQUNoQzthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgUHJvdmlkZXJBdHRyaWJ1dGUsIFVzZXJQb29sLCBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJBbWF6b24gfSBmcm9tICcuLi8uLi9saWInO1xuXG5kZXNjcmliZSgnVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyJywgKCkgPT4ge1xuICBkZXNjcmliZSgnYW1hem9uJywgKCkgPT4ge1xuICAgIHRlc3QoJ2RlZmF1bHRzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAndXNlcnBvb2wnKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IFVzZXJQb29sSWRlbnRpdHlQcm92aWRlckFtYXpvbihzdGFjaywgJ3VzZXJwb29saWRwJywge1xuICAgICAgICB1c2VyUG9vbDogcG9vbCxcbiAgICAgICAgY2xpZW50SWQ6ICdhbXpuLWNsaWVudC1pZCcsXG4gICAgICAgIGNsaWVudFNlY3JldDogJ2Ftem4tY2xpZW50LXNlY3JldCcsXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2xJZGVudGl0eVByb3ZpZGVyJywge1xuICAgICAgICBQcm92aWRlck5hbWU6ICdMb2dpbldpdGhBbWF6b24nLFxuICAgICAgICBQcm92aWRlclR5cGU6ICdMb2dpbldpdGhBbWF6b24nLFxuICAgICAgICBQcm92aWRlckRldGFpbHM6IHtcbiAgICAgICAgICBjbGllbnRfaWQ6ICdhbXpuLWNsaWVudC1pZCcsXG4gICAgICAgICAgY2xpZW50X3NlY3JldDogJ2Ftem4tY2xpZW50LXNlY3JldCcsXG4gICAgICAgICAgYXV0aG9yaXplX3Njb3BlczogJ3Byb2ZpbGUnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdzY29wZXMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICd1c2VycG9vbCcpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyQW1hem9uKHN0YWNrLCAndXNlcnBvb2xpZHAnLCB7XG4gICAgICAgIHVzZXJQb29sOiBwb29sLFxuICAgICAgICBjbGllbnRJZDogJ2Ftem4tY2xpZW50LWlkJyxcbiAgICAgICAgY2xpZW50U2VjcmV0OiAnYW16bi1jbGllbnQtc2VjcmV0JyxcbiAgICAgICAgc2NvcGVzOiBbJ3Njb3BlMScsICdzY29wZTInXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbElkZW50aXR5UHJvdmlkZXInLCB7XG4gICAgICAgIFByb3ZpZGVyTmFtZTogJ0xvZ2luV2l0aEFtYXpvbicsXG4gICAgICAgIFByb3ZpZGVyVHlwZTogJ0xvZ2luV2l0aEFtYXpvbicsXG4gICAgICAgIFByb3ZpZGVyRGV0YWlsczoge1xuICAgICAgICAgIGNsaWVudF9pZDogJ2Ftem4tY2xpZW50LWlkJyxcbiAgICAgICAgICBjbGllbnRfc2VjcmV0OiAnYW16bi1jbGllbnQtc2VjcmV0JyxcbiAgICAgICAgICBhdXRob3JpemVfc2NvcGVzOiAnc2NvcGUxIHNjb3BlMicsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3JlZ2lzdGVyZWQgd2l0aCB1c2VyIHBvb2wnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICd1c2VycG9vbCcpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBwcm92aWRlciA9IG5ldyBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJBbWF6b24oc3RhY2ssICd1c2VycG9vbGlkcCcsIHtcbiAgICAgICAgdXNlclBvb2w6IHBvb2wsXG4gICAgICAgIGNsaWVudElkOiAnYW16bi1jbGllbnQtaWQnLFxuICAgICAgICBjbGllbnRTZWNyZXQ6ICdhbXpuLWNsaWVudC1zZWNyZXQnLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChwb29sLmlkZW50aXR5UHJvdmlkZXJzKS50b0NvbnRhaW4ocHJvdmlkZXIpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYXR0cmlidXRlIG1hcHBpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICd1c2VycG9vbCcpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyQW1hem9uKHN0YWNrLCAndXNlcnBvb2xpZHAnLCB7XG4gICAgICAgIHVzZXJQb29sOiBwb29sLFxuICAgICAgICBjbGllbnRJZDogJ2FtYXpuLWNsaWVudC1pZCcsXG4gICAgICAgIGNsaWVudFNlY3JldDogJ2Ftem4tY2xpZW50LXNlY3JldCcsXG4gICAgICAgIGF0dHJpYnV0ZU1hcHBpbmc6IHtcbiAgICAgICAgICBnaXZlbk5hbWU6IFByb3ZpZGVyQXR0cmlidXRlLkFNQVpPTl9OQU1FLFxuICAgICAgICAgIGFkZHJlc3M6IFByb3ZpZGVyQXR0cmlidXRlLm90aGVyKCdhbXpuLWFkZHJlc3MnKSxcbiAgICAgICAgICBjdXN0b206IHtcbiAgICAgICAgICAgIGN1c3RvbUF0dHIxOiBQcm92aWRlckF0dHJpYnV0ZS5BTUFaT05fRU1BSUwsXG4gICAgICAgICAgICBjdXN0b21BdHRyMjogUHJvdmlkZXJBdHRyaWJ1dGUub3RoZXIoJ2Ftem4tY3VzdG9tLWF0dHInKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sSWRlbnRpdHlQcm92aWRlcicsIHtcbiAgICAgICAgQXR0cmlidXRlTWFwcGluZzoge1xuICAgICAgICAgIGdpdmVuX25hbWU6ICduYW1lJyxcbiAgICAgICAgICBhZGRyZXNzOiAnYW16bi1hZGRyZXNzJyxcbiAgICAgICAgICBjdXN0b21BdHRyMTogJ2VtYWlsJyxcbiAgICAgICAgICBjdXN0b21BdHRyMjogJ2Ftem4tY3VzdG9tLWF0dHInLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=