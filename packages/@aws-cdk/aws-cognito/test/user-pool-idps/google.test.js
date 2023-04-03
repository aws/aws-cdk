"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../../lib");
describe('UserPoolIdentityProvider', () => {
    describe('google', () => {
        test('defaults', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            new lib_1.UserPoolIdentityProviderGoogle(stack, 'userpoolidp', {
                userPool: pool,
                clientId: 'google-client-id',
                clientSecretValue: core_1.SecretValue.unsafePlainText('google-client-secret'),
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
                ProviderName: 'Google',
                ProviderType: 'Google',
                ProviderDetails: {
                    client_id: 'google-client-id',
                    client_secret: 'google-client-secret',
                    authorize_scopes: 'profile',
                },
            });
        });
        test('scopes', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            new lib_1.UserPoolIdentityProviderGoogle(stack, 'userpoolidp', {
                userPool: pool,
                clientId: 'google-client-id',
                clientSecretValue: core_1.SecretValue.unsafePlainText('google-client-secret'),
                scopes: ['scope1', 'scope2'],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
                ProviderName: 'Google',
                ProviderType: 'Google',
                ProviderDetails: {
                    client_id: 'google-client-id',
                    client_secret: 'google-client-secret',
                    authorize_scopes: 'scope1 scope2',
                },
            });
        });
        test('registered with user pool', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            const provider = new lib_1.UserPoolIdentityProviderGoogle(stack, 'userpoolidp', {
                userPool: pool,
                clientId: 'google-client-id',
                clientSecretValue: core_1.SecretValue.unsafePlainText('google-client-secret'),
            });
            // THEN
            expect(pool.identityProviders).toContain(provider);
        });
        test('attribute mapping', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            new lib_1.UserPoolIdentityProviderGoogle(stack, 'userpoolidp', {
                userPool: pool,
                clientId: 'google-client-id',
                clientSecretValue: core_1.SecretValue.unsafePlainText('google-client-secret'),
                attributeMapping: {
                    givenName: lib_1.ProviderAttribute.GOOGLE_NAME,
                    address: lib_1.ProviderAttribute.other('google-address'),
                    custom: {
                        customAttr1: lib_1.ProviderAttribute.GOOGLE_EMAIL,
                        customAttr2: lib_1.ProviderAttribute.other('google-custom-attr'),
                    },
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
                AttributeMapping: {
                    given_name: 'name',
                    address: 'google-address',
                    customAttr1: 'email',
                    customAttr2: 'google-custom-attr',
                },
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnb29nbGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyx3Q0FBbUQ7QUFDbkQsbUNBQXdGO0FBRXhGLFFBQVEsQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7SUFDeEMsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7UUFDdEIsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUU7WUFDcEIsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBRTdDLE9BQU87WUFDUCxJQUFJLG9DQUE4QixDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7Z0JBQ3ZELFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxrQkFBa0I7Z0JBQzVCLGlCQUFpQixFQUFFLGtCQUFXLENBQUMsZUFBZSxDQUFDLHNCQUFzQixDQUFDO2FBQ3ZFLENBQUMsQ0FBQztZQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdDQUF3QyxFQUFFO2dCQUN4RixZQUFZLEVBQUUsUUFBUTtnQkFDdEIsWUFBWSxFQUFFLFFBQVE7Z0JBQ3RCLGVBQWUsRUFBRTtvQkFDZixTQUFTLEVBQUUsa0JBQWtCO29CQUM3QixhQUFhLEVBQUUsc0JBQXNCO29CQUNyQyxnQkFBZ0IsRUFBRSxTQUFTO2lCQUM1QjthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7WUFDbEIsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBRTdDLE9BQU87WUFDUCxJQUFJLG9DQUE4QixDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7Z0JBQ3ZELFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxrQkFBa0I7Z0JBQzVCLGlCQUFpQixFQUFFLGtCQUFXLENBQUMsZUFBZSxDQUFDLHNCQUFzQixDQUFDO2dCQUN0RSxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDO2FBQzdCLENBQUMsQ0FBQztZQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdDQUF3QyxFQUFFO2dCQUN4RixZQUFZLEVBQUUsUUFBUTtnQkFDdEIsWUFBWSxFQUFFLFFBQVE7Z0JBQ3RCLGVBQWUsRUFBRTtvQkFDZixTQUFTLEVBQUUsa0JBQWtCO29CQUM3QixhQUFhLEVBQUUsc0JBQXNCO29CQUNyQyxnQkFBZ0IsRUFBRSxlQUFlO2lCQUNsQzthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRTtZQUNyQyxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixNQUFNLElBQUksR0FBRyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFFN0MsT0FBTztZQUNQLE1BQU0sUUFBUSxHQUFHLElBQUksb0NBQThCLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRTtnQkFDeEUsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLGtCQUFrQjtnQkFDNUIsaUJBQWlCLEVBQUUsa0JBQVcsQ0FBQyxlQUFlLENBQUMsc0JBQXNCLENBQUM7YUFDdkUsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFO1lBQzdCLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBQzFCLE1BQU0sSUFBSSxHQUFHLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztZQUU3QyxPQUFPO1lBQ1AsSUFBSSxvQ0FBOEIsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO2dCQUN2RCxRQUFRLEVBQUUsSUFBSTtnQkFDZCxRQUFRLEVBQUUsa0JBQWtCO2dCQUM1QixpQkFBaUIsRUFBRSxrQkFBVyxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsQ0FBQztnQkFDdEUsZ0JBQWdCLEVBQUU7b0JBQ2hCLFNBQVMsRUFBRSx1QkFBaUIsQ0FBQyxXQUFXO29CQUN4QyxPQUFPLEVBQUUsdUJBQWlCLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDO29CQUNsRCxNQUFNLEVBQUU7d0JBQ04sV0FBVyxFQUFFLHVCQUFpQixDQUFDLFlBQVk7d0JBQzNDLFdBQVcsRUFBRSx1QkFBaUIsQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUM7cUJBQzNEO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdDQUF3QyxFQUFFO2dCQUN4RixnQkFBZ0IsRUFBRTtvQkFDaEIsVUFBVSxFQUFFLE1BQU07b0JBQ2xCLE9BQU8sRUFBRSxnQkFBZ0I7b0JBQ3pCLFdBQVcsRUFBRSxPQUFPO29CQUNwQixXQUFXLEVBQUUsb0JBQW9CO2lCQUNsQzthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBTZWNyZXRWYWx1ZSwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IFByb3ZpZGVyQXR0cmlidXRlLCBVc2VyUG9vbCwgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyR29vZ2xlIH0gZnJvbSAnLi4vLi4vbGliJztcblxuZGVzY3JpYmUoJ1VzZXJQb29sSWRlbnRpdHlQcm92aWRlcicsICgpID0+IHtcbiAgZGVzY3JpYmUoJ2dvb2dsZScsICgpID0+IHtcbiAgICB0ZXN0KCdkZWZhdWx0cycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ3VzZXJwb29sJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJHb29nbGUoc3RhY2ssICd1c2VycG9vbGlkcCcsIHtcbiAgICAgICAgdXNlclBvb2w6IHBvb2wsXG4gICAgICAgIGNsaWVudElkOiAnZ29vZ2xlLWNsaWVudC1pZCcsXG4gICAgICAgIGNsaWVudFNlY3JldFZhbHVlOiBTZWNyZXRWYWx1ZS51bnNhZmVQbGFpblRleHQoJ2dvb2dsZS1jbGllbnQtc2VjcmV0JyksXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2xJZGVudGl0eVByb3ZpZGVyJywge1xuICAgICAgICBQcm92aWRlck5hbWU6ICdHb29nbGUnLFxuICAgICAgICBQcm92aWRlclR5cGU6ICdHb29nbGUnLFxuICAgICAgICBQcm92aWRlckRldGFpbHM6IHtcbiAgICAgICAgICBjbGllbnRfaWQ6ICdnb29nbGUtY2xpZW50LWlkJyxcbiAgICAgICAgICBjbGllbnRfc2VjcmV0OiAnZ29vZ2xlLWNsaWVudC1zZWNyZXQnLFxuICAgICAgICAgIGF1dGhvcml6ZV9zY29wZXM6ICdwcm9maWxlJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnc2NvcGVzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAndXNlcnBvb2wnKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IFVzZXJQb29sSWRlbnRpdHlQcm92aWRlckdvb2dsZShzdGFjaywgJ3VzZXJwb29saWRwJywge1xuICAgICAgICB1c2VyUG9vbDogcG9vbCxcbiAgICAgICAgY2xpZW50SWQ6ICdnb29nbGUtY2xpZW50LWlkJyxcbiAgICAgICAgY2xpZW50U2VjcmV0VmFsdWU6IFNlY3JldFZhbHVlLnVuc2FmZVBsYWluVGV4dCgnZ29vZ2xlLWNsaWVudC1zZWNyZXQnKSxcbiAgICAgICAgc2NvcGVzOiBbJ3Njb3BlMScsICdzY29wZTInXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbElkZW50aXR5UHJvdmlkZXInLCB7XG4gICAgICAgIFByb3ZpZGVyTmFtZTogJ0dvb2dsZScsXG4gICAgICAgIFByb3ZpZGVyVHlwZTogJ0dvb2dsZScsXG4gICAgICAgIFByb3ZpZGVyRGV0YWlsczoge1xuICAgICAgICAgIGNsaWVudF9pZDogJ2dvb2dsZS1jbGllbnQtaWQnLFxuICAgICAgICAgIGNsaWVudF9zZWNyZXQ6ICdnb29nbGUtY2xpZW50LXNlY3JldCcsXG4gICAgICAgICAgYXV0aG9yaXplX3Njb3BlczogJ3Njb3BlMSBzY29wZTInLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdyZWdpc3RlcmVkIHdpdGggdXNlciBwb29sJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAndXNlcnBvb2wnKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgcHJvdmlkZXIgPSBuZXcgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyR29vZ2xlKHN0YWNrLCAndXNlcnBvb2xpZHAnLCB7XG4gICAgICAgIHVzZXJQb29sOiBwb29sLFxuICAgICAgICBjbGllbnRJZDogJ2dvb2dsZS1jbGllbnQtaWQnLFxuICAgICAgICBjbGllbnRTZWNyZXRWYWx1ZTogU2VjcmV0VmFsdWUudW5zYWZlUGxhaW5UZXh0KCdnb29nbGUtY2xpZW50LXNlY3JldCcpLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChwb29sLmlkZW50aXR5UHJvdmlkZXJzKS50b0NvbnRhaW4ocHJvdmlkZXIpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYXR0cmlidXRlIG1hcHBpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICd1c2VycG9vbCcpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyR29vZ2xlKHN0YWNrLCAndXNlcnBvb2xpZHAnLCB7XG4gICAgICAgIHVzZXJQb29sOiBwb29sLFxuICAgICAgICBjbGllbnRJZDogJ2dvb2dsZS1jbGllbnQtaWQnLFxuICAgICAgICBjbGllbnRTZWNyZXRWYWx1ZTogU2VjcmV0VmFsdWUudW5zYWZlUGxhaW5UZXh0KCdnb29nbGUtY2xpZW50LXNlY3JldCcpLFxuICAgICAgICBhdHRyaWJ1dGVNYXBwaW5nOiB7XG4gICAgICAgICAgZ2l2ZW5OYW1lOiBQcm92aWRlckF0dHJpYnV0ZS5HT09HTEVfTkFNRSxcbiAgICAgICAgICBhZGRyZXNzOiBQcm92aWRlckF0dHJpYnV0ZS5vdGhlcignZ29vZ2xlLWFkZHJlc3MnKSxcbiAgICAgICAgICBjdXN0b206IHtcbiAgICAgICAgICAgIGN1c3RvbUF0dHIxOiBQcm92aWRlckF0dHJpYnV0ZS5HT09HTEVfRU1BSUwsXG4gICAgICAgICAgICBjdXN0b21BdHRyMjogUHJvdmlkZXJBdHRyaWJ1dGUub3RoZXIoJ2dvb2dsZS1jdXN0b20tYXR0cicpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2xJZGVudGl0eVByb3ZpZGVyJywge1xuICAgICAgICBBdHRyaWJ1dGVNYXBwaW5nOiB7XG4gICAgICAgICAgZ2l2ZW5fbmFtZTogJ25hbWUnLFxuICAgICAgICAgIGFkZHJlc3M6ICdnb29nbGUtYWRkcmVzcycsXG4gICAgICAgICAgY3VzdG9tQXR0cjE6ICdlbWFpbCcsXG4gICAgICAgICAgY3VzdG9tQXR0cjI6ICdnb29nbGUtY3VzdG9tLWF0dHInLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=