"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../../lib");
describe('UserPoolIdentityProvider', () => {
    describe('saml', () => {
        test('metadata URL', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            new lib_1.UserPoolIdentityProviderSaml(stack, 'userpoolidp', {
                userPool: pool,
                metadata: lib_1.UserPoolIdentityProviderSamlMetadata.url('https://my-metadata-url.com'),
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
                ProviderName: 'userpoolidp',
                ProviderType: 'SAML',
                ProviderDetails: {
                    MetadataURL: 'https://my-metadata-url.com',
                    IDPSignout: false,
                },
            });
        });
        test('metadata file', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            new lib_1.UserPoolIdentityProviderSaml(stack, 'userpoolidp', {
                userPool: pool,
                metadata: lib_1.UserPoolIdentityProviderSamlMetadata.file('my-file-contents'),
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
                ProviderName: 'userpoolidp',
                ProviderType: 'SAML',
                ProviderDetails: {
                    MetadataFile: 'my-file-contents',
                    IDPSignout: false,
                },
            });
        });
        test('idpSignout', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            new lib_1.UserPoolIdentityProviderSaml(stack, 'userpoolidp', {
                userPool: pool,
                metadata: lib_1.UserPoolIdentityProviderSamlMetadata.file('my-file-contents'),
                idpSignout: true,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
                ProviderName: 'userpoolidp',
                ProviderType: 'SAML',
                ProviderDetails: {
                    MetadataFile: 'my-file-contents',
                    IDPSignout: true,
                },
            });
        });
        test('registered with user pool', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            const provider = new lib_1.UserPoolIdentityProviderSaml(stack, 'userpoolidp', {
                userPool: pool,
                metadata: lib_1.UserPoolIdentityProviderSamlMetadata.file('my-file-contents'),
            });
            // THEN
            expect(pool.identityProviders).toContain(provider);
        });
        test('attribute mapping', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            new lib_1.UserPoolIdentityProviderSaml(stack, 'userpoolidp', {
                userPool: pool,
                metadata: lib_1.UserPoolIdentityProviderSamlMetadata.file('my-file-contents'),
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
            new lib_1.UserPoolIdentityProviderSaml(stack, 'userpoolidp', {
                userPool: pool,
                name: 'my-provider',
                metadata: lib_1.UserPoolIdentityProviderSamlMetadata.file('my-file-contents'),
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
            expect(() => new lib_1.UserPoolIdentityProviderSaml(stack, 'userpoolidp', {
                userPool: pool,
                name: 'xy',
                metadata: lib_1.UserPoolIdentityProviderSamlMetadata.file('my-file-contents'),
            })).toThrow(/Expected provider name to be between 3 and 32 characters/);
        });
        test('generates a valid name when unique id is too short', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            new lib_1.UserPoolIdentityProviderSaml(stack, 'xy', {
                userPool: pool,
                metadata: lib_1.UserPoolIdentityProviderSamlMetadata.file('my-file-contents'),
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
                ProviderName: 'xysaml',
            });
        });
        test('generates a valid name when unique id is too long', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'userpool');
            // WHEN
            new lib_1.UserPoolIdentityProviderSaml(stack, `${'saml'.repeat(10)}xyz`, {
                userPool: pool,
                metadata: lib_1.UserPoolIdentityProviderSamlMetadata.file('my-file-contents'),
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
                ProviderName: assertions_1.Match.stringLikeRegexp('^\\w{3,32}$'),
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtbC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2FtbC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQXNEO0FBQ3RELHdDQUFzQztBQUN0QyxtQ0FBNEg7QUFFNUgsUUFBUSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtJQUN4QyxRQUFRLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtRQUNwQixJQUFJLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtZQUN4QixRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixNQUFNLElBQUksR0FBRyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFFN0MsT0FBTztZQUNQLElBQUksa0NBQTRCLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRTtnQkFDckQsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLDBDQUFvQyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQzthQUNsRixDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsd0NBQXdDLEVBQUU7Z0JBQ3hGLFlBQVksRUFBRSxhQUFhO2dCQUMzQixZQUFZLEVBQUUsTUFBTTtnQkFDcEIsZUFBZSxFQUFFO29CQUNmLFdBQVcsRUFBRSw2QkFBNkI7b0JBQzFDLFVBQVUsRUFBRSxLQUFLO2lCQUNsQjthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUU7WUFDekIsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBRTdDLE9BQU87WUFDUCxJQUFJLGtDQUE0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eEUsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdDQUF3QyxFQUFFO2dCQUN4RixZQUFZLEVBQUUsa0JBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUM7YUFDcEQsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUsIE1hdGNoIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgUHJvdmlkZXJBdHRyaWJ1dGUsIFVzZXJQb29sLCBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJTYW1sLCBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJTYW1sTWV0YWRhdGEgfSBmcm9tICcuLi8uLi9saWInO1xuXG5kZXNjcmliZSgnVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyJywgKCkgPT4ge1xuICBkZXNjcmliZSgnc2FtbCcsICgpID0+IHtcbiAgICB0ZXN0KCdtZXRhZGF0YSBVUkwnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICd1c2VycG9vbCcpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyU2FtbChzdGFjaywgJ3VzZXJwb29saWRwJywge1xuICAgICAgICB1c2VyUG9vbDogcG9vbCxcbiAgICAgICAgbWV0YWRhdGE6IFVzZXJQb29sSWRlbnRpdHlQcm92aWRlclNhbWxNZXRhZGF0YS51cmwoJ2h0dHBzOi8vbXktbWV0YWRhdGEtdXJsLmNvbScpLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sSWRlbnRpdHlQcm92aWRlcicsIHtcbiAgICAgICAgUHJvdmlkZXJOYW1lOiAndXNlcnBvb2xpZHAnLFxuICAgICAgICBQcm92aWRlclR5cGU6ICdTQU1MJyxcbiAgICAgICAgUHJvdmlkZXJEZXRhaWxzOiB7XG4gICAgICAgICAgTWV0YWRhdGFVUkw6ICdodHRwczovL215LW1ldGFkYXRhLXVybC5jb20nLFxuICAgICAgICAgIElEUFNpZ25vdXQ6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdtZXRhZGF0YSBmaWxlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAndXNlcnBvb2wnKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IFVzZXJQb29sSWRlbnRpdHlQcm92aWRlclNhbWwoc3RhY2ssICd1c2VycG9vbGlkcCcsIHtcbiAgICAgICAgdXNlclBvb2w6IHBvb2wsXG4gICAgICAgIG1ldGFkYXRhOiBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJTYW1sTWV0YWRhdGEuZmlsZSgnbXktZmlsZS1jb250ZW50cycpLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sSWRlbnRpdHlQcm92aWRlcicsIHtcbiAgICAgICAgUHJvdmlkZXJOYW1lOiAndXNlcnBvb2xpZHAnLFxuICAgICAgICBQcm92aWRlclR5cGU6ICdTQU1MJyxcbiAgICAgICAgUHJvdmlkZXJEZXRhaWxzOiB7XG4gICAgICAgICAgTWV0YWRhdGFGaWxlOiAnbXktZmlsZS1jb250ZW50cycsXG4gICAgICAgICAgSURQU2lnbm91dDogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2lkcFNpZ25vdXQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICd1c2VycG9vbCcpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyU2FtbChzdGFjaywgJ3VzZXJwb29saWRwJywge1xuICAgICAgICB1c2VyUG9vbDogcG9vbCxcbiAgICAgICAgbWV0YWRhdGE6IFVzZXJQb29sSWRlbnRpdHlQcm92aWRlclNhbWxNZXRhZGF0YS5maWxlKCdteS1maWxlLWNvbnRlbnRzJyksXG4gICAgICAgIGlkcFNpZ25vdXQ6IHRydWUsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2xJZGVudGl0eVByb3ZpZGVyJywge1xuICAgICAgICBQcm92aWRlck5hbWU6ICd1c2VycG9vbGlkcCcsXG4gICAgICAgIFByb3ZpZGVyVHlwZTogJ1NBTUwnLFxuICAgICAgICBQcm92aWRlckRldGFpbHM6IHtcbiAgICAgICAgICBNZXRhZGF0YUZpbGU6ICdteS1maWxlLWNvbnRlbnRzJyxcbiAgICAgICAgICBJRFBTaWdub3V0OiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdyZWdpc3RlcmVkIHdpdGggdXNlciBwb29sJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAndXNlcnBvb2wnKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgcHJvdmlkZXIgPSBuZXcgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyU2FtbChzdGFjaywgJ3VzZXJwb29saWRwJywge1xuICAgICAgICB1c2VyUG9vbDogcG9vbCxcbiAgICAgICAgbWV0YWRhdGE6IFVzZXJQb29sSWRlbnRpdHlQcm92aWRlclNhbWxNZXRhZGF0YS5maWxlKCdteS1maWxlLWNvbnRlbnRzJyksXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHBvb2wuaWRlbnRpdHlQcm92aWRlcnMpLnRvQ29udGFpbihwcm92aWRlcik7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhdHRyaWJ1dGUgbWFwcGluZycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ3VzZXJwb29sJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJTYW1sKHN0YWNrLCAndXNlcnBvb2xpZHAnLCB7XG4gICAgICAgIHVzZXJQb29sOiBwb29sLFxuICAgICAgICBtZXRhZGF0YTogVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyU2FtbE1ldGFkYXRhLmZpbGUoJ215LWZpbGUtY29udGVudHMnKSxcbiAgICAgICAgYXR0cmlidXRlTWFwcGluZzoge1xuICAgICAgICAgIGZhbWlseU5hbWU6IFByb3ZpZGVyQXR0cmlidXRlLm90aGVyKCdmYW1pbHlfbmFtZScpLFxuICAgICAgICAgIGdpdmVuTmFtZTogUHJvdmlkZXJBdHRyaWJ1dGUub3RoZXIoJ2dpdmVuX25hbWUnKSxcbiAgICAgICAgICBjdXN0b206IHtcbiAgICAgICAgICAgIGN1c3RvbUF0dHIxOiBQcm92aWRlckF0dHJpYnV0ZS5vdGhlcignZW1haWwnKSxcbiAgICAgICAgICAgIGN1c3RvbUF0dHIyOiBQcm92aWRlckF0dHJpYnV0ZS5vdGhlcignc3ViJyksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbElkZW50aXR5UHJvdmlkZXInLCB7XG4gICAgICAgIEF0dHJpYnV0ZU1hcHBpbmc6IHtcbiAgICAgICAgICBmYW1pbHlfbmFtZTogJ2ZhbWlseV9uYW1lJyxcbiAgICAgICAgICBnaXZlbl9uYW1lOiAnZ2l2ZW5fbmFtZScsXG4gICAgICAgICAgY3VzdG9tQXR0cjE6ICdlbWFpbCcsXG4gICAgICAgICAgY3VzdG9tQXR0cjI6ICdzdWInLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd3aXRoIHByb3ZpZGVyIG5hbWUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICd1c2VycG9vbCcpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyU2FtbChzdGFjaywgJ3VzZXJwb29saWRwJywge1xuICAgICAgICB1c2VyUG9vbDogcG9vbCxcbiAgICAgICAgbmFtZTogJ215LXByb3ZpZGVyJyxcbiAgICAgICAgbWV0YWRhdGE6IFVzZXJQb29sSWRlbnRpdHlQcm92aWRlclNhbWxNZXRhZGF0YS5maWxlKCdteS1maWxlLWNvbnRlbnRzJyksXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2xJZGVudGl0eVByb3ZpZGVyJywge1xuICAgICAgICBQcm92aWRlck5hbWU6ICdteS1wcm92aWRlcicsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyB3aXRoIGludmFsaWQgcHJvdmlkZXIgbmFtZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ3VzZXJwb29sJyk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiBuZXcgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyU2FtbChzdGFjaywgJ3VzZXJwb29saWRwJywge1xuICAgICAgICB1c2VyUG9vbDogcG9vbCxcbiAgICAgICAgbmFtZTogJ3h5JyxcbiAgICAgICAgbWV0YWRhdGE6IFVzZXJQb29sSWRlbnRpdHlQcm92aWRlclNhbWxNZXRhZGF0YS5maWxlKCdteS1maWxlLWNvbnRlbnRzJyksXG4gICAgICB9KSkudG9UaHJvdygvRXhwZWN0ZWQgcHJvdmlkZXIgbmFtZSB0byBiZSBiZXR3ZWVuIDMgYW5kIDMyIGNoYXJhY3RlcnMvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2dlbmVyYXRlcyBhIHZhbGlkIG5hbWUgd2hlbiB1bmlxdWUgaWQgaXMgdG9vIHNob3J0JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAndXNlcnBvb2wnKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IFVzZXJQb29sSWRlbnRpdHlQcm92aWRlclNhbWwoc3RhY2ssICd4eScsIHtcbiAgICAgICAgdXNlclBvb2w6IHBvb2wsXG4gICAgICAgIG1ldGFkYXRhOiBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJTYW1sTWV0YWRhdGEuZmlsZSgnbXktZmlsZS1jb250ZW50cycpLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sSWRlbnRpdHlQcm92aWRlcicsIHtcbiAgICAgICAgUHJvdmlkZXJOYW1lOiAneHlzYW1sJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZ2VuZXJhdGVzIGEgdmFsaWQgbmFtZSB3aGVuIHVuaXF1ZSBpZCBpcyB0b28gbG9uZycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ3VzZXJwb29sJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJTYW1sKHN0YWNrLCBgJHsnc2FtbCcucmVwZWF0KDEwKX14eXpgLCB7XG4gICAgICAgIHVzZXJQb29sOiBwb29sLFxuICAgICAgICBtZXRhZGF0YTogVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyU2FtbE1ldGFkYXRhLmZpbGUoJ215LWZpbGUtY29udGVudHMnKSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbElkZW50aXR5UHJvdmlkZXInLCB7XG4gICAgICAgIFByb3ZpZGVyTmFtZTogTWF0Y2guc3RyaW5nTGlrZVJlZ2V4cCgnXlxcXFx3ezMsMzJ9JCcpLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=