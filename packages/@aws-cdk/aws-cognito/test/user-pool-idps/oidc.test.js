"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../../lib");
describe('UserPoolIdentityProvider', () => {
    describe('oidc', () => {
        test('defaults', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            new lib_1.UserPoolIdentityProviderOidc(stack, 'userpoolidp', {
                userPool: pool,
                clientId: 'client-id',
                clientSecret: 'client-secret',
                issuerUrl: 'https://my-issuer-url.com',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
                ProviderName: 'userpoolidp',
                ProviderType: 'OIDC',
                ProviderDetails: {
                    client_id: 'client-id',
                    client_secret: 'client-secret',
                    authorize_scopes: 'openid',
                    attributes_request_method: 'GET',
                    oidc_issuer: 'https://my-issuer-url.com',
                },
            });
        });
        test('endpoints', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            new lib_1.UserPoolIdentityProviderOidc(stack, 'userpoolidp', {
                userPool: pool,
                clientId: 'client-id',
                clientSecret: 'client-secret',
                issuerUrl: 'https://my-issuer-url.com',
                endpoints: {
                    authorization: 'https://my-issuer-url.com/authorize',
                    token: 'https://my-issuer-url.com/token',
                    userInfo: 'https://my-issuer-url.com/userinfo',
                    jwksUri: 'https://my-issuer-url.com/jwks',
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
                ProviderDetails: {
                    client_id: 'client-id',
                    client_secret: 'client-secret',
                    authorize_scopes: 'openid',
                    attributes_request_method: 'GET',
                    oidc_issuer: 'https://my-issuer-url.com',
                    authorize_url: 'https://my-issuer-url.com/authorize',
                    token_url: 'https://my-issuer-url.com/token',
                    attributes_url: 'https://my-issuer-url.com/userinfo',
                    jwks_uri: 'https://my-issuer-url.com/jwks',
                },
            });
        });
        test('scopes', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            new lib_1.UserPoolIdentityProviderOidc(stack, 'userpoolidp', {
                userPool: pool,
                clientId: 'client-id',
                clientSecret: 'client-secret',
                issuerUrl: 'https://my-issuer-url.com',
                scopes: ['scope1', 'scope2'],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
                ProviderDetails: {
                    client_id: 'client-id',
                    client_secret: 'client-secret',
                    authorize_scopes: 'scope1 scope2',
                    attributes_request_method: 'GET',
                    oidc_issuer: 'https://my-issuer-url.com',
                },
            });
        });
        test('registered with user pool', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            const provider = new lib_1.UserPoolIdentityProviderOidc(stack, 'userpoolidp', {
                userPool: pool,
                clientId: 'client-id',
                clientSecret: 'client-secret',
                issuerUrl: 'https://my-issuer-url.com',
            });
            // THEN
            expect(pool.identityProviders).toContain(provider);
        });
        test('attribute mapping', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            new lib_1.UserPoolIdentityProviderOidc(stack, 'userpoolidp', {
                userPool: pool,
                clientId: 'client-id',
                clientSecret: 'client-secret',
                issuerUrl: 'https://my-issuer-url.com',
                attributeMapping: {
                    familyName: lib_1.ProviderAttribute.other('family_name'),
                    givenName: lib_1.ProviderAttribute.other('given_name'),
                    custom: {
                        customAttr1: lib_1.ProviderAttribute.other('email'),
                        customAttr2: lib_1.ProviderAttribute.other('sub'),
                    },
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
                AttributeMapping: {
                    family_name: 'family_name',
                    given_name: 'given_name',
                    customAttr1: 'email',
                    customAttr2: 'sub',
                },
            });
        });
        test('with provider name', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            new lib_1.UserPoolIdentityProviderOidc(stack, 'userpoolidp', {
                userPool: pool,
                name: 'my-provider',
                clientId: 'client-id',
                clientSecret: 'client-secret',
                issuerUrl: 'https://my-issuer-url.com',
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
                ProviderName: 'my-provider',
            });
        });
        test('throws with invalid provider name', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // THEN
            expect(() => new lib_1.UserPoolIdentityProviderOidc(stack, 'userpoolidp', {
                userPool: pool,
                name: 'xy',
                clientId: 'client-id',
                clientSecret: 'client-secret',
                issuerUrl: 'https://my-issuer-url.com',
            })).toThrow(/Expected provider name to be between 3 and 32 characters/);
        });
        test('generates a valid name when unique id is too short', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            new lib_1.UserPoolIdentityProviderOidc(stack, 'xy', {
                userPool: pool,
                clientId: 'client-id',
                clientSecret: 'client-secret',
                issuerUrl: 'https://my-issuer-url.com',
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
                ProviderName: 'xyoidc',
            });
        });
        test('generates a valid name when unique id is too long', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            new lib_1.UserPoolIdentityProviderOidc(stack, `${'oidc'.repeat(10)}xyz`, {
                userPool: pool,
                clientId: 'client-id',
                clientSecret: 'client-secret',
                issuerUrl: 'https://my-issuer-url.com',
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
                ProviderName: 'oidcoidcoidcoidccoidcoidcoidcxyz',
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsib2lkYy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHdDQUFzQztBQUN0QyxtQ0FBc0Y7QUFFdEYsUUFBUSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtJQUN4QyxRQUFRLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtRQUNwQixJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtZQUNwQixRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixNQUFNLElBQUksR0FBRyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFFN0MsT0FBTztZQUNQLElBQUksa0NBQTRCLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRTtnQkFDckQsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLFdBQVc7Z0JBQ3JCLFlBQVksRUFBRSxlQUFlO2dCQUM3QixTQUFTLEVBQUUsMkJBQTJCO2FBQ3ZDLENBQUMsQ0FBQztZQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdDQUF3QyxFQUFFO2dCQUN4RixZQUFZLEVBQUUsYUFBYTtnQkFDM0IsWUFBWSxFQUFFLE1BQU07Z0JBQ3BCLGVBQWUsRUFBRTtvQkFDZixTQUFTLEVBQUUsV0FBVztvQkFDdEIsYUFBYSxFQUFFLGVBQWU7b0JBQzlCLGdCQUFnQixFQUFFLFFBQVE7b0JBQzFCLHlCQUF5QixFQUFFLEtBQUs7b0JBQ2hDLFdBQVcsRUFBRSwyQkFBMkI7aUJBQ3pDO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtZQUNyQixRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixNQUFN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O2FBQ3ZDLENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3Q0FBd0MsRUFBRTtnQkFDeEYsWUFBWSxFQUFFLFFBQVE7YUFDdkIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsbURBQW1ELEVBQUUsR0FBRyxFQUFFO1lBQzdELFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBQzFCLE1BQU0sSUFBSSxHQUFHLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztZQUU3QyxPQUFPO1lBQ1AsSUFBSSxrQ0FBNEIsQ0FBQyxLQUFLLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2pFLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxXQUFXO2dCQUNyQixZQUFZLEVBQUUsZUFBZTtnQkFDN0IsU0FBUyxFQUFFLDJCQUEyQjthQUN2QyxDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsd0NBQXdDLEVBQUU7Z0JBQ3hGLFlBQVksRUFBRSxrQ0FBa0M7YUFDakQsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBQcm92aWRlckF0dHJpYnV0ZSwgVXNlclBvb2wsIFVzZXJQb29sSWRlbnRpdHlQcm92aWRlck9pZGMgfSBmcm9tICcuLi8uLi9saWInO1xuXG5kZXNjcmliZSgnVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyJywgKCkgPT4ge1xuICBkZXNjcmliZSgnb2lkYycsICgpID0+IHtcbiAgICB0ZXN0KCdkZWZhdWx0cycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ3VzZXJwb29sJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJPaWRjKHN0YWNrLCAndXNlcnBvb2xpZHAnLCB7XG4gICAgICAgIHVzZXJQb29sOiBwb29sLFxuICAgICAgICBjbGllbnRJZDogJ2NsaWVudC1pZCcsXG4gICAgICAgIGNsaWVudFNlY3JldDogJ2NsaWVudC1zZWNyZXQnLFxuICAgICAgICBpc3N1ZXJVcmw6ICdodHRwczovL215LWlzc3Vlci11cmwuY29tJyxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbElkZW50aXR5UHJvdmlkZXInLCB7XG4gICAgICAgIFByb3ZpZGVyTmFtZTogJ3VzZXJwb29saWRwJyxcbiAgICAgICAgUHJvdmlkZXJUeXBlOiAnT0lEQycsXG4gICAgICAgIFByb3ZpZGVyRGV0YWlsczoge1xuICAgICAgICAgIGNsaWVudF9pZDogJ2NsaWVudC1pZCcsXG4gICAgICAgICAgY2xpZW50X3NlY3JldDogJ2NsaWVudC1zZWNyZXQnLFxuICAgICAgICAgIGF1dGhvcml6ZV9zY29wZXM6ICdvcGVuaWQnLFxuICAgICAgICAgIGF0dHJpYnV0ZXNfcmVxdWVzdF9tZXRob2Q6ICdHRVQnLFxuICAgICAgICAgIG9pZGNfaXNzdWVyOiAnaHR0cHM6Ly9teS1pc3N1ZXItdXJsLmNvbScsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2VuZHBvaW50cycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ3VzZXJwb29sJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJPaWRjKHN0YWNrLCAndXNlcnBvb2xpZHAnLCB7XG4gICAgICAgIHVzZXJQb29sOiBwb29sLFxuICAgICAgICBjbGllbnRJZDogJ2NsaWVudC1pZCcsXG4gICAgICAgIGNsaWVudFNlY3JldDogJ2NsaWVudC1zZWNyZXQnLFxuICAgICAgICBpc3N1ZXJVcmw6ICdodHRwczovL215LWlzc3Vlci11cmwuY29tJyxcbiAgICAgICAgZW5kcG9pbnRzOiB7XG4gICAgICAgICAgYXV0aG9yaXphdGlvbjogJ2h0dHBzOi8vbXktaXNzdWVyLXVybC5jb20vYXV0aG9yaXplJyxcbiAgICAgICAgICB0b2tlbjogJ2h0dHBzOi8vbXktaXNzdWVyLXVybC5jb20vdG9rZW4nLFxuICAgICAgICAgIHVzZXJJbmZvOiAnaHR0cHM6Ly9teS1pc3N1ZXItdXJsLmNvbS91c2VyaW5mbycsXG4gICAgICAgICAgandrc1VyaTogJ2h0dHBzOi8vbXktaXNzdWVyLXVybC5jb20vandrcycsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2xJZGVudGl0eVByb3ZpZGVyJywge1xuICAgICAgICBQcm92aWRlckRldGFpbHM6IHtcbiAgICAgICAgICBjbGllbnRfaWQ6ICdjbGllbnQtaWQnLFxuICAgICAgICAgIGNsaWVudF9zZWNyZXQ6ICdjbGllbnQtc2VjcmV0JyxcbiAgICAgICAgICBhdXRob3JpemVfc2NvcGVzOiAnb3BlbmlkJyxcbiAgICAgICAgICBhdHRyaWJ1dGVzX3JlcXVlc3RfbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICBvaWRjX2lzc3VlcjogJ2h0dHBzOi8vbXktaXNzdWVyLXVybC5jb20nLFxuICAgICAgICAgIGF1dGhvcml6ZV91cmw6ICdodHRwczovL215LWlzc3Vlci11cmwuY29tL2F1dGhvcml6ZScsXG4gICAgICAgICAgdG9rZW5fdXJsOiAnaHR0cHM6Ly9teS1pc3N1ZXItdXJsLmNvbS90b2tlbicsXG4gICAgICAgICAgYXR0cmlidXRlc191cmw6ICdodHRwczovL215LWlzc3Vlci11cmwuY29tL3VzZXJpbmZvJyxcbiAgICAgICAgICBqd2tzX3VyaTogJ2h0dHBzOi8vbXktaXNzdWVyLXVybC5jb20vandrcycsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Njb3BlcycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ3VzZXJwb29sJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJPaWRjKHN0YWNrLCAndXNlcnBvb2xpZHAnLCB7XG4gICAgICAgIHVzZXJQb29sOiBwb29sLFxuICAgICAgICBjbGllbnRJZDogJ2NsaWVudC1pZCcsXG4gICAgICAgIGNsaWVudFNlY3JldDogJ2NsaWVudC1zZWNyZXQnLFxuICAgICAgICBpc3N1ZXJVcmw6ICdodHRwczovL215LWlzc3Vlci11cmwuY29tJyxcbiAgICAgICAgc2NvcGVzOiBbJ3Njb3BlMScsICdzY29wZTInXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbElkZW50aXR5UHJvdmlkZXInLCB7XG4gICAgICAgIFByb3ZpZGVyRGV0YWlsczoge1xuICAgICAgICAgIGNsaWVudF9pZDogJ2NsaWVudC1pZCcsXG4gICAgICAgICAgY2xpZW50X3NlY3JldDogJ2NsaWVudC1zZWNyZXQnLFxuICAgICAgICAgIGF1dGhvcml6ZV9zY29wZXM6ICdzY29wZTEgc2NvcGUyJyxcbiAgICAgICAgICBhdHRyaWJ1dGVzX3JlcXVlc3RfbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICBvaWRjX2lzc3VlcjogJ2h0dHBzOi8vbXktaXNzdWVyLXVybC5jb20nLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdyZWdpc3RlcmVkIHdpdGggdXNlciBwb29sJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAndXNlcnBvb2wnKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgcHJvdmlkZXIgPSBuZXcgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyT2lkYyhzdGFjaywgJ3VzZXJwb29saWRwJywge1xuICAgICAgICB1c2VyUG9vbDogcG9vbCxcbiAgICAgICAgY2xpZW50SWQ6ICdjbGllbnQtaWQnLFxuICAgICAgICBjbGllbnRTZWNyZXQ6ICdjbGllbnQtc2VjcmV0JyxcbiAgICAgICAgaXNzdWVyVXJsOiAnaHR0cHM6Ly9teS1pc3N1ZXItdXJsLmNvbScsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHBvb2wuaWRlbnRpdHlQcm92aWRlcnMpLnRvQ29udGFpbihwcm92aWRlcik7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhdHRyaWJ1dGUgbWFwcGluZycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ3VzZXJwb29sJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJPaWRjKHN0YWNrLCAndXNlcnBvb2xpZHAnLCB7XG4gICAgICAgIHVzZXJQb29sOiBwb29sLFxuICAgICAgICBjbGllbnRJZDogJ2NsaWVudC1pZCcsXG4gICAgICAgIGNsaWVudFNlY3JldDogJ2NsaWVudC1zZWNyZXQnLFxuICAgICAgICBpc3N1ZXJVcmw6ICdodHRwczovL215LWlzc3Vlci11cmwuY29tJyxcbiAgICAgICAgYXR0cmlidXRlTWFwcGluZzoge1xuICAgICAgICAgIGZhbWlseU5hbWU6IFByb3ZpZGVyQXR0cmlidXRlLm90aGVyKCdmYW1pbHlfbmFtZScpLFxuICAgICAgICAgIGdpdmVuTmFtZTogUHJvdmlkZXJBdHRyaWJ1dGUub3RoZXIoJ2dpdmVuX25hbWUnKSxcbiAgICAgICAgICBjdXN0b206IHtcbiAgICAgICAgICAgIGN1c3RvbUF0dHIxOiBQcm92aWRlckF0dHJpYnV0ZS5vdGhlcignZW1haWwnKSxcbiAgICAgICAgICAgIGN1c3RvbUF0dHIyOiBQcm92aWRlckF0dHJpYnV0ZS5vdGhlcignc3ViJyksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbElkZW50aXR5UHJvdmlkZXInLCB7XG4gICAgICAgIEF0dHJpYnV0ZU1hcHBpbmc6IHtcbiAgICAgICAgICBmYW1pbHlfbmFtZTogJ2ZhbWlseV9uYW1lJyxcbiAgICAgICAgICBnaXZlbl9uYW1lOiAnZ2l2ZW5fbmFtZScsXG4gICAgICAgICAgY3VzdG9tQXR0cjE6ICdlbWFpbCcsXG4gICAgICAgICAgY3VzdG9tQXR0cjI6ICdzdWInLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd3aXRoIHByb3ZpZGVyIG5hbWUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICd1c2VycG9vbCcpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyT2lkYyhzdGFjaywgJ3VzZXJwb29saWRwJywge1xuICAgICAgICB1c2VyUG9vbDogcG9vbCxcbiAgICAgICAgbmFtZTogJ215LXByb3ZpZGVyJyxcbiAgICAgICAgY2xpZW50SWQ6ICdjbGllbnQtaWQnLFxuICAgICAgICBjbGllbnRTZWNyZXQ6ICdjbGllbnQtc2VjcmV0JyxcbiAgICAgICAgaXNzdWVyVXJsOiAnaHR0cHM6Ly9teS1pc3N1ZXItdXJsLmNvbScsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2xJZGVudGl0eVByb3ZpZGVyJywge1xuICAgICAgICBQcm92aWRlck5hbWU6ICdteS1wcm92aWRlcicsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyB3aXRoIGludmFsaWQgcHJvdmlkZXIgbmFtZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ3VzZXJwb29sJyk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiBuZXcgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyT2lkYyhzdGFjaywgJ3VzZXJwb29saWRwJywge1xuICAgICAgICB1c2VyUG9vbDogcG9vbCxcbiAgICAgICAgbmFtZTogJ3h5JyxcbiAgICAgICAgY2xpZW50SWQ6ICdjbGllbnQtaWQnLFxuICAgICAgICBjbGllbnRTZWNyZXQ6ICdjbGllbnQtc2VjcmV0JyxcbiAgICAgICAgaXNzdWVyVXJsOiAnaHR0cHM6Ly9teS1pc3N1ZXItdXJsLmNvbScsXG4gICAgICB9KSkudG9UaHJvdygvRXhwZWN0ZWQgcHJvdmlkZXIgbmFtZSB0byBiZSBiZXR3ZWVuIDMgYW5kIDMyIGNoYXJhY3RlcnMvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2dlbmVyYXRlcyBhIHZhbGlkIG5hbWUgd2hlbiB1bmlxdWUgaWQgaXMgdG9vIHNob3J0JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAndXNlcnBvb2wnKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IFVzZXJQb29sSWRlbnRpdHlQcm92aWRlck9pZGMoc3RhY2ssICd4eScsIHtcbiAgICAgICAgdXNlclBvb2w6IHBvb2wsXG4gICAgICAgIGNsaWVudElkOiAnY2xpZW50LWlkJyxcbiAgICAgICAgY2xpZW50U2VjcmV0OiAnY2xpZW50LXNlY3JldCcsXG4gICAgICAgIGlzc3VlclVybDogJ2h0dHBzOi8vbXktaXNzdWVyLXVybC5jb20nLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sSWRlbnRpdHlQcm92aWRlcicsIHtcbiAgICAgICAgUHJvdmlkZXJOYW1lOiAneHlvaWRjJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZ2VuZXJhdGVzIGEgdmFsaWQgbmFtZSB3aGVuIHVuaXF1ZSBpZCBpcyB0b28gbG9uZycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ3VzZXJwb29sJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJPaWRjKHN0YWNrLCBgJHsnb2lkYycucmVwZWF0KDEwKX14eXpgLCB7XG4gICAgICAgIHVzZXJQb29sOiBwb29sLFxuICAgICAgICBjbGllbnRJZDogJ2NsaWVudC1pZCcsXG4gICAgICAgIGNsaWVudFNlY3JldDogJ2NsaWVudC1zZWNyZXQnLFxuICAgICAgICBpc3N1ZXJVcmw6ICdodHRwczovL215LWlzc3Vlci11cmwuY29tJyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbElkZW50aXR5UHJvdmlkZXInLCB7XG4gICAgICAgIFByb3ZpZGVyTmFtZTogJ29pZGNvaWRjb2lkY29pZGNjb2lkY29pZGNvaWRjeHl6JyxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19