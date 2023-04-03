"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../../lib");
describe('UserPoolIdentityProvider', () => {
    describe('apple', () => {
        test('defaults', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            new lib_1.UserPoolIdentityProviderApple(stack, 'userpoolidp', {
                userPool: pool,
                clientId: 'com.amzn.cdk',
                teamId: 'CDKTEAMCDK',
                keyId: 'CDKKEYCDK1',
                privateKey: 'PRIV_KEY_CDK',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
                ProviderName: 'SignInWithApple',
                ProviderType: 'SignInWithApple',
                ProviderDetails: {
                    client_id: 'com.amzn.cdk',
                    team_id: 'CDKTEAMCDK',
                    key_id: 'CDKKEYCDK1',
                    private_key: 'PRIV_KEY_CDK',
                    authorize_scopes: 'name',
                },
            });
        });
        test('scopes', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            new lib_1.UserPoolIdentityProviderApple(stack, 'userpoolidp', {
                userPool: pool,
                clientId: 'com.amzn.cdk',
                teamId: 'CDKTEAMCDK',
                keyId: 'CDKKEYCDK1',
                privateKey: 'PRIV_KEY_CDK',
                scopes: ['scope1', 'scope2'],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
                ProviderName: 'SignInWithApple',
                ProviderType: 'SignInWithApple',
                ProviderDetails: {
                    client_id: 'com.amzn.cdk',
                    team_id: 'CDKTEAMCDK',
                    key_id: 'CDKKEYCDK1',
                    private_key: 'PRIV_KEY_CDK',
                    authorize_scopes: 'scope1 scope2',
                },
            });
        });
        test('registered with user pool', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            const provider = new lib_1.UserPoolIdentityProviderApple(stack, 'userpoolidp', {
                userPool: pool,
                clientId: 'com.amzn.cdk',
                teamId: 'CDKTEAMCDK',
                keyId: 'CDKKEYCDK1',
                privateKey: 'PRIV_KEY_CDK',
            });
            // THEN
            expect(pool.identityProviders).toContain(provider);
        });
        test('attribute mapping', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            new lib_1.UserPoolIdentityProviderApple(stack, 'userpoolidp', {
                userPool: pool,
                clientId: 'com.amzn.cdk',
                teamId: 'CDKTEAMCDK',
                keyId: 'CDKKEYCDK1',
                privateKey: 'PRIV_KEY_CDK',
                attributeMapping: {
                    familyName: lib_1.ProviderAttribute.APPLE_LAST_NAME,
                    givenName: lib_1.ProviderAttribute.APPLE_FIRST_NAME,
                    custom: {
                        customAttr1: lib_1.ProviderAttribute.APPLE_EMAIL,
                        customAttr2: lib_1.ProviderAttribute.other('sub'),
                    },
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
                AttributeMapping: {
                    family_name: 'firstName',
                    given_name: 'lastName',
                    customAttr1: 'email',
                    customAttr2: 'sub',
                },
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcHBsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyx3Q0FBc0M7QUFDdEMsbUNBQXVGO0FBRXZGLFFBQVEsQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7SUFDeEMsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7UUFDckIsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUU7WUFDcEIsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBRTdDLE9BQU87WUFDUCxJQUFJLG1DQUE2QixDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7Z0JBQ3RELFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxjQUFjO2dCQUN4QixNQUFNLEVBQUUsWUFBWTtnQkFDcEIsS0FBSyxFQUFFLFlBQVk7Z0JBQ25CLFVBQVUsRUFBRSxjQUFjO2FBQzNCLENBQUMsQ0FBQztZQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdDQUF3QyxFQUFFO2dCQUN4RixZQUFZLEVBQUUsaUJBQWlCO2dCQUMvQixZQUFZLEVBQUUsaUJBQWlCO2dCQUMvQixlQUFlLEVBQUU7b0JBQ2YsU0FBUyxFQUFFLGNBQWM7b0JBQ3pCLE9BQU8sRUFBRSxZQUFZO29CQUNyQixNQUFNLEVBQUUsWUFBWTtvQkFDcEIsV0FBVyxFQUFFLGNBQWM7b0JBQzNCLGdCQUFnQixFQUFFLE1BQU07aUJBQ3pCO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtZQUNsQixRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FB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b3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IFByb3ZpZGVyQXR0cmlidXRlLCBVc2VyUG9vbCwgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyQXBwbGUgfSBmcm9tICcuLi8uLi9saWInO1xuXG5kZXNjcmliZSgnVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyJywgKCkgPT4ge1xuICBkZXNjcmliZSgnYXBwbGUnLCAoKSA9PiB7XG4gICAgdGVzdCgnZGVmYXVsdHMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICd1c2VycG9vbCcpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyQXBwbGUoc3RhY2ssICd1c2VycG9vbGlkcCcsIHtcbiAgICAgICAgdXNlclBvb2w6IHBvb2wsXG4gICAgICAgIGNsaWVudElkOiAnY29tLmFtem4uY2RrJyxcbiAgICAgICAgdGVhbUlkOiAnQ0RLVEVBTUNESycsXG4gICAgICAgIGtleUlkOiAnQ0RLS0VZQ0RLMScsXG4gICAgICAgIHByaXZhdGVLZXk6ICdQUklWX0tFWV9DREsnLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sSWRlbnRpdHlQcm92aWRlcicsIHtcbiAgICAgICAgUHJvdmlkZXJOYW1lOiAnU2lnbkluV2l0aEFwcGxlJyxcbiAgICAgICAgUHJvdmlkZXJUeXBlOiAnU2lnbkluV2l0aEFwcGxlJyxcbiAgICAgICAgUHJvdmlkZXJEZXRhaWxzOiB7XG4gICAgICAgICAgY2xpZW50X2lkOiAnY29tLmFtem4uY2RrJyxcbiAgICAgICAgICB0ZWFtX2lkOiAnQ0RLVEVBTUNESycsXG4gICAgICAgICAga2V5X2lkOiAnQ0RLS0VZQ0RLMScsXG4gICAgICAgICAgcHJpdmF0ZV9rZXk6ICdQUklWX0tFWV9DREsnLFxuICAgICAgICAgIGF1dGhvcml6ZV9zY29wZXM6ICduYW1lJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnc2NvcGVzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAndXNlcnBvb2wnKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IFVzZXJQb29sSWRlbnRpdHlQcm92aWRlckFwcGxlKHN0YWNrLCAndXNlcnBvb2xpZHAnLCB7XG4gICAgICAgIHVzZXJQb29sOiBwb29sLFxuICAgICAgICBjbGllbnRJZDogJ2NvbS5hbXpuLmNkaycsXG4gICAgICAgIHRlYW1JZDogJ0NES1RFQU1DREsnLFxuICAgICAgICBrZXlJZDogJ0NES0tFWUNESzEnLFxuICAgICAgICBwcml2YXRlS2V5OiAnUFJJVl9LRVlfQ0RLJyxcbiAgICAgICAgc2NvcGVzOiBbJ3Njb3BlMScsICdzY29wZTInXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbElkZW50aXR5UHJvdmlkZXInLCB7XG4gICAgICAgIFByb3ZpZGVyTmFtZTogJ1NpZ25JbldpdGhBcHBsZScsXG4gICAgICAgIFByb3ZpZGVyVHlwZTogJ1NpZ25JbldpdGhBcHBsZScsXG4gICAgICAgIFByb3ZpZGVyRGV0YWlsczoge1xuICAgICAgICAgIGNsaWVudF9pZDogJ2NvbS5hbXpuLmNkaycsXG4gICAgICAgICAgdGVhbV9pZDogJ0NES1RFQU1DREsnLFxuICAgICAgICAgIGtleV9pZDogJ0NES0tFWUNESzEnLFxuICAgICAgICAgIHByaXZhdGVfa2V5OiAnUFJJVl9LRVlfQ0RLJyxcbiAgICAgICAgICBhdXRob3JpemVfc2NvcGVzOiAnc2NvcGUxIHNjb3BlMicsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3JlZ2lzdGVyZWQgd2l0aCB1c2VyIHBvb2wnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICd1c2VycG9vbCcpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBwcm92aWRlciA9IG5ldyBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJBcHBsZShzdGFjaywgJ3VzZXJwb29saWRwJywge1xuICAgICAgICB1c2VyUG9vbDogcG9vbCxcbiAgICAgICAgY2xpZW50SWQ6ICdjb20uYW16bi5jZGsnLFxuICAgICAgICB0ZWFtSWQ6ICdDREtURUFNQ0RLJyxcbiAgICAgICAga2V5SWQ6ICdDREtLRVlDREsxJyxcbiAgICAgICAgcHJpdmF0ZUtleTogJ1BSSVZfS0VZX0NESycsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHBvb2wuaWRlbnRpdHlQcm92aWRlcnMpLnRvQ29udGFpbihwcm92aWRlcik7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhdHRyaWJ1dGUgbWFwcGluZycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ3VzZXJwb29sJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJBcHBsZShzdGFjaywgJ3VzZXJwb29saWRwJywge1xuICAgICAgICB1c2VyUG9vbDogcG9vbCxcbiAgICAgICAgY2xpZW50SWQ6ICdjb20uYW16bi5jZGsnLFxuICAgICAgICB0ZWFtSWQ6ICdDREtURUFNQ0RLJyxcbiAgICAgICAga2V5SWQ6ICdDREtLRVlDREsxJyxcbiAgICAgICAgcHJpdmF0ZUtleTogJ1BSSVZfS0VZX0NESycsXG4gICAgICAgIGF0dHJpYnV0ZU1hcHBpbmc6IHtcbiAgICAgICAgICBmYW1pbHlOYW1lOiBQcm92aWRlckF0dHJpYnV0ZS5BUFBMRV9MQVNUX05BTUUsXG4gICAgICAgICAgZ2l2ZW5OYW1lOiBQcm92aWRlckF0dHJpYnV0ZS5BUFBMRV9GSVJTVF9OQU1FLFxuICAgICAgICAgIGN1c3RvbToge1xuICAgICAgICAgICAgY3VzdG9tQXR0cjE6IFByb3ZpZGVyQXR0cmlidXRlLkFQUExFX0VNQUlMLFxuICAgICAgICAgICAgY3VzdG9tQXR0cjI6IFByb3ZpZGVyQXR0cmlidXRlLm90aGVyKCdzdWInKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sSWRlbnRpdHlQcm92aWRlcicsIHtcbiAgICAgICAgQXR0cmlidXRlTWFwcGluZzoge1xuICAgICAgICAgIGZhbWlseV9uYW1lOiAnZmlyc3ROYW1lJyxcbiAgICAgICAgICBnaXZlbl9uYW1lOiAnbGFzdE5hbWUnLFxuICAgICAgICAgIGN1c3RvbUF0dHIxOiAnZW1haWwnLFxuICAgICAgICAgIGN1c3RvbUF0dHIyOiAnc3ViJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19