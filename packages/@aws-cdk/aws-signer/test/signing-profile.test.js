"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk = require("@aws-cdk/core");
const signer = require("../lib");
let app;
let stack;
beforeEach(() => {
    app = new cdk.App({});
    stack = new cdk.Stack(app);
});
describe('signing profile', () => {
    test('default', () => {
        const platform = signer.Platform.AWS_LAMBDA_SHA384_ECDSA;
        new signer.SigningProfile(stack, 'SigningProfile', { platform });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Signer::SigningProfile', {
            PlatformId: platform.platformId,
            SignatureValidityPeriod: {
                Type: 'MONTHS',
                Value: 135,
            },
        });
    });
    test('default with signature validity period', () => {
        const platform = signer.Platform.AWS_LAMBDA_SHA384_ECDSA;
        new signer.SigningProfile(stack, 'SigningProfile', {
            platform,
            signatureValidity: cdk.Duration.days(7),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Signer::SigningProfile', {
            PlatformId: platform.platformId,
            SignatureValidityPeriod: {
                Type: 'DAYS',
                Value: 7,
            },
        });
    });
    test('default with some tags', () => {
        const platform = signer.Platform.AWS_LAMBDA_SHA384_ECDSA;
        const signing = new signer.SigningProfile(stack, 'SigningProfile', { platform });
        cdk.Tags.of(signing).add('tag1', 'value1');
        cdk.Tags.of(signing).add('tag2', 'value2');
        cdk.Tags.of(signing).add('tag3', '');
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Signer::SigningProfile', {
            PlatformId: platform.platformId,
            SignatureValidityPeriod: {
                Type: 'MONTHS',
                Value: 135,
            },
            Tags: [
                {
                    Key: 'tag1',
                    Value: 'value1',
                },
                {
                    Key: 'tag2',
                    Value: 'value2',
                },
                {
                    Key: 'tag3',
                    Value: '',
                },
            ],
        });
    });
    describe('import', () => {
        test('from signingProfileProfileName and signingProfileProfileVersion', () => {
            const signingProfileName = 'test';
            const signingProfileVersion = 'xxxxxxxx';
            const signingProfile = signer.SigningProfile.fromSigningProfileAttributes(stack, 'Imported', {
                signingProfileName,
                signingProfileVersion,
            });
            expect(stack.resolve(signingProfile.signingProfileArn)).toStrictEqual({
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        { Ref: 'AWS::Partition' },
                        ':signer:',
                        { Ref: 'AWS::Region' },
                        ':',
                        { Ref: 'AWS::AccountId' },
                        `://signing-profiles/${signingProfileName}`,
                    ],
                ],
            });
            expect(stack.resolve(signingProfile.signingProfileVersionArn)).toStrictEqual({
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        { Ref: 'AWS::Partition' },
                        ':signer:',
                        { Ref: 'AWS::Region' },
                        ':',
                        { Ref: 'AWS::AccountId' },
                        `://signing-profiles/${signingProfileName}/${signingProfileVersion}`,
                    ],
                ],
            });
            assertions_1.Template.fromStack(stack).templateMatches({});
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmluZy1wcm9maWxlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzaWduaW5nLXByb2ZpbGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyxxQ0FBcUM7QUFDckMsaUNBQWlDO0FBRWpDLElBQUksR0FBWSxDQUFDO0FBQ2pCLElBQUksS0FBZ0IsQ0FBQztBQUNyQixVQUFVLENBQUUsR0FBRyxFQUFFO0lBQ2YsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBRSxFQUFFLENBQUUsQ0FBQztJQUN4QixLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFFLEdBQUcsQ0FBRSxDQUFDO0FBQy9CLENBQUMsQ0FBRSxDQUFDO0FBRUosUUFBUSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRTtJQUMvQixJQUFJLENBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRTtRQUNwQixNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLHVCQUF1QixDQUFDO1FBQ3pELElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBRSxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBRSxDQUFDO1FBRW5FLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDZCQUE2QixFQUFFO1lBQzdFLFVBQVUsRUFBRSxRQUFRLENBQUMsVUFBVTtZQUMvQix1QkFBdUIsRUFBRTtnQkFDdkIsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsS0FBSyxFQUFFLEdBQUc7YUFDWDtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFFLHdDQUF3QyxFQUFFLEdBQUcsRUFBRTtRQUNuRCxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLHVCQUF1QixDQUFDO1FBQ3pELElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBRSxLQUFLLEVBQUUsZ0JB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QUFHLEVBQUUsZ0JBQWdCLEVBQUU7d0JBQ3pCLFVBQVU7d0JBQ1YsRUFBRSxHQUFHLEVBQUUsYUFBYSxFQUFFO3dCQUN0QixHQUFHO3dCQUNILEVBQUUsR0FBRyxFQUFFLGdCQUFnQixFQUFFO3dCQUN6Qix1QkFBdUIsa0JBQWtCLElBQUkscUJBQXFCLEVBQUU7cUJBQ3JFO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2hELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFFLENBQUM7QUFDTixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBzaWduZXIgZnJvbSAnLi4vbGliJztcblxubGV0IGFwcDogY2RrLkFwcDtcbmxldCBzdGFjazogY2RrLlN0YWNrO1xuYmVmb3JlRWFjaCggKCkgPT4ge1xuICBhcHAgPSBuZXcgY2RrLkFwcCgge30gKTtcbiAgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCBhcHAgKTtcbn0gKTtcblxuZGVzY3JpYmUoJ3NpZ25pbmcgcHJvZmlsZScsICgpID0+IHtcbiAgdGVzdCggJ2RlZmF1bHQnLCAoKSA9PiB7XG4gICAgY29uc3QgcGxhdGZvcm0gPSBzaWduZXIuUGxhdGZvcm0uQVdTX0xBTUJEQV9TSEEzODRfRUNEU0E7XG4gICAgbmV3IHNpZ25lci5TaWduaW5nUHJvZmlsZSggc3RhY2ssICdTaWduaW5nUHJvZmlsZScsIHsgcGxhdGZvcm0gfSApO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U2lnbmVyOjpTaWduaW5nUHJvZmlsZScsIHtcbiAgICAgIFBsYXRmb3JtSWQ6IHBsYXRmb3JtLnBsYXRmb3JtSWQsXG4gICAgICBTaWduYXR1cmVWYWxpZGl0eVBlcmlvZDoge1xuICAgICAgICBUeXBlOiAnTU9OVEhTJyxcbiAgICAgICAgVmFsdWU6IDEzNSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoICdkZWZhdWx0IHdpdGggc2lnbmF0dXJlIHZhbGlkaXR5IHBlcmlvZCcsICgpID0+IHtcbiAgICBjb25zdCBwbGF0Zm9ybSA9IHNpZ25lci5QbGF0Zm9ybS5BV1NfTEFNQkRBX1NIQTM4NF9FQ0RTQTtcbiAgICBuZXcgc2lnbmVyLlNpZ25pbmdQcm9maWxlKCBzdGFjaywgJ1NpZ25pbmdQcm9maWxlJywge1xuICAgICAgcGxhdGZvcm0sXG4gICAgICBzaWduYXR1cmVWYWxpZGl0eTogY2RrLkR1cmF0aW9uLmRheXMoIDcgKSxcbiAgICB9ICk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTaWduZXI6OlNpZ25pbmdQcm9maWxlJywge1xuICAgICAgUGxhdGZvcm1JZDogcGxhdGZvcm0ucGxhdGZvcm1JZCxcbiAgICAgIFNpZ25hdHVyZVZhbGlkaXR5UGVyaW9kOiB7XG4gICAgICAgIFR5cGU6ICdEQVlTJyxcbiAgICAgICAgVmFsdWU6IDcsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCAnZGVmYXVsdCB3aXRoIHNvbWUgdGFncycsICgpID0+IHtcbiAgICBjb25zdCBwbGF0Zm9ybSA9IHNpZ25lci5QbGF0Zm9ybS5BV1NfTEFNQkRBX1NIQTM4NF9FQ0RTQTtcbiAgICBjb25zdCBzaWduaW5nID0gbmV3IHNpZ25lci5TaWduaW5nUHJvZmlsZSggc3RhY2ssICdTaWduaW5nUHJvZmlsZScsIHsgcGxhdGZvcm0gfSApO1xuXG4gICAgY2RrLlRhZ3Mub2Yoc2lnbmluZykuYWRkKCd0YWcxJywgJ3ZhbHVlMScpO1xuICAgIGNkay5UYWdzLm9mKHNpZ25pbmcpLmFkZCgndGFnMicsICd2YWx1ZTInKTtcbiAgICBjZGsuVGFncy5vZihzaWduaW5nKS5hZGQoJ3RhZzMnLCAnJyk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTaWduZXI6OlNpZ25pbmdQcm9maWxlJywge1xuICAgICAgUGxhdGZvcm1JZDogcGxhdGZvcm0ucGxhdGZvcm1JZCxcbiAgICAgIFNpZ25hdHVyZVZhbGlkaXR5UGVyaW9kOiB7XG4gICAgICAgIFR5cGU6ICdNT05USFMnLFxuICAgICAgICBWYWx1ZTogMTM1LFxuICAgICAgfSxcbiAgICAgIFRhZ3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIEtleTogJ3RhZzEnLFxuICAgICAgICAgIFZhbHVlOiAndmFsdWUxJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIEtleTogJ3RhZzInLFxuICAgICAgICAgIFZhbHVlOiAndmFsdWUyJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIEtleTogJ3RhZzMnLFxuICAgICAgICAgIFZhbHVlOiAnJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdpbXBvcnQnLCAoKSA9PiB7XG4gICAgdGVzdCgnZnJvbSBzaWduaW5nUHJvZmlsZVByb2ZpbGVOYW1lIGFuZCBzaWduaW5nUHJvZmlsZVByb2ZpbGVWZXJzaW9uJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc2lnbmluZ1Byb2ZpbGVOYW1lID0gJ3Rlc3QnO1xuICAgICAgY29uc3Qgc2lnbmluZ1Byb2ZpbGVWZXJzaW9uID0gJ3h4eHh4eHh4JztcbiAgICAgIGNvbnN0IHNpZ25pbmdQcm9maWxlID0gc2lnbmVyLlNpZ25pbmdQcm9maWxlLmZyb21TaWduaW5nUHJvZmlsZUF0dHJpYnV0ZXMoc3RhY2ssICdJbXBvcnRlZCcsIHtcbiAgICAgICAgc2lnbmluZ1Byb2ZpbGVOYW1lLFxuICAgICAgICBzaWduaW5nUHJvZmlsZVZlcnNpb24sXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc2lnbmluZ1Byb2ZpbGUuc2lnbmluZ1Byb2ZpbGVBcm4pKS50b1N0cmljdEVxdWFsKFxuICAgICAgICB7XG4gICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgJzpzaWduZXI6JyxcbiAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LFxuICAgICAgICAgICAgICBgOi8vc2lnbmluZy1wcm9maWxlcy8ke3NpZ25pbmdQcm9maWxlTmFtZX1gLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgKTtcbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHNpZ25pbmdQcm9maWxlLnNpZ25pbmdQcm9maWxlVmVyc2lvbkFybikpLnRvU3RyaWN0RXF1YWwoe1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICc6c2lnbmVyOicsXG4gICAgICAgICAgICB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgICAgIGA6Ly9zaWduaW5nLXByb2ZpbGVzLyR7c2lnbmluZ1Byb2ZpbGVOYW1lfS8ke3NpZ25pbmdQcm9maWxlVmVyc2lvbn1gLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHt9KTtcbiAgICB9KTtcbiAgfSApO1xufSk7XG4iXX0=