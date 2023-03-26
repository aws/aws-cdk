"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const signer = require("@aws-cdk/aws-signer");
const cdk = require("@aws-cdk/core");
const lambda = require("../lib");
let app;
let stack;
beforeEach(() => {
    app = new cdk.App({});
    stack = new cdk.Stack(app);
});
describe('code signing config', () => {
    test('default', () => {
        const platform = signer.Platform.AWS_LAMBDA_SHA384_ECDSA;
        const signingProfile = new signer.SigningProfile(stack, 'SigningProfile', { platform });
        new lambda.CodeSigningConfig(stack, 'CodeSigningConfig', {
            signingProfiles: [signingProfile],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::CodeSigningConfig', {
            AllowedPublishers: {
                SigningProfileVersionArns: [{
                        'Fn::GetAtt': [
                            'SigningProfile2139A0F9',
                            'ProfileVersionArn',
                        ],
                    }],
            },
            CodeSigningPolicies: {
                UntrustedArtifactOnDeployment: 'Warn',
            },
        });
    });
    test('with multiple signing profiles', () => {
        const signingProfile1 = new signer.SigningProfile(stack, 'SigningProfile1', { platform: signer.Platform.AWS_LAMBDA_SHA384_ECDSA });
        const signingProfile2 = new signer.SigningProfile(stack, 'SigningProfile2', { platform: signer.Platform.AMAZON_FREE_RTOS_DEFAULT });
        const signingProfile3 = new signer.SigningProfile(stack, 'SigningProfile3', { platform: signer.Platform.AWS_IOT_DEVICE_MANAGEMENT_SHA256_ECDSA });
        new lambda.CodeSigningConfig(stack, 'CodeSigningConfig', {
            signingProfiles: [signingProfile1, signingProfile2, signingProfile3],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::CodeSigningConfig', {
            AllowedPublishers: {
                SigningProfileVersionArns: [
                    {
                        'Fn::GetAtt': [
                            'SigningProfile1D4191686',
                            'ProfileVersionArn',
                        ],
                    },
                    {
                        'Fn::GetAtt': [
                            'SigningProfile2E013C934',
                            'ProfileVersionArn',
                        ],
                    },
                    {
                        'Fn::GetAtt': [
                            'SigningProfile3A38DE231',
                            'ProfileVersionArn',
                        ],
                    },
                ],
            },
        });
    });
    test('with description and with untrustedArtifactOnDeployment of "ENFORCE"', () => {
        const platform = signer.Platform.AWS_LAMBDA_SHA384_ECDSA;
        const signingProfile = new signer.SigningProfile(stack, 'SigningProfile', { platform });
        new lambda.CodeSigningConfig(stack, 'CodeSigningConfig', {
            signingProfiles: [signingProfile],
            untrustedArtifactOnDeployment: lambda.UntrustedArtifactOnDeployment.ENFORCE,
            description: 'test description',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::CodeSigningConfig', {
            CodeSigningPolicies: {
                UntrustedArtifactOnDeployment: 'Enforce',
            },
            Description: 'test description',
        });
    });
    test('import does not create any resources', () => {
        const codeSigningConfigId = 'aaa-xxxxxxxxxx';
        const codeSigningConfigArn = `arn:aws:lambda:::code-signing-config:${codeSigningConfigId}`;
        const codeSigningConfig = lambda.CodeSigningConfig.fromCodeSigningConfigArn(stack, 'Imported', codeSigningConfigArn);
        expect(codeSigningConfig.codeSigningConfigArn).toBe(codeSigningConfigArn);
        expect(codeSigningConfig.codeSigningConfigId).toBe(codeSigningConfigId);
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Lambda::CodeSigningConfig', 0);
    });
    test('fail import with malformed code signing config arn', () => {
        const codeSigningConfigArn = 'arn:aws:lambda:::code-signing-config';
        expect(() => lambda.CodeSigningConfig.fromCodeSigningConfigArn(stack, 'Imported', codeSigningConfigArn)).toThrow(/ARN must be in the format/);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS1zaWduaW5nLWNvbmZpZy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29kZS1zaWduaW5nLWNvbmZpZy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLDhDQUE4QztBQUM5QyxxQ0FBcUM7QUFDckMsaUNBQWlDO0FBRWpDLElBQUksR0FBWSxDQUFDO0FBQ2pCLElBQUksS0FBZ0IsQ0FBQztBQUNyQixVQUFVLENBQUUsR0FBRyxFQUFFO0lBQ2YsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBRSxFQUFFLENBQUUsQ0FBQztJQUN4QixLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFFLEdBQUcsQ0FBRSxDQUFDO0FBQy9CLENBQUMsQ0FBRSxDQUFDO0FBRUosUUFBUSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtJQUNuQyxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRTtRQUNuQixNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLHVCQUF1QixDQUFDO1FBQ3pELE1BQU0sY0FBYyxHQUFHLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3hGLElBQUksTUFBTSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxtQkFBbUIsRUFBRTtZQUN2RCxlQUFlLEVBQUUsQ0FBQyxjQUFjLENBQUM7U0FDbEMsQ0FBQyxDQUFDO1FBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsZ0NBQWdDLEVBQUU7WUFDaEYsaUJBQWlCLEVBQUU7Z0JBQ2pCLHlCQUF5QixFQUFFLENBQUM7d0JBQzFCLFlBQVksRUFBRTs0QkFDWix3QkFBd0I7NEJBQ3hCLG1CQUFtQjt5QkFDcEI7cUJBQ0YsQ0FBQzthQUNIO1lBQ0QsbUJBQW1CLEVBQUU7Z0JBQ25CLDZCQUE2QixFQUFFLE1BQU07YUFDdEM7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxHQUFHLEVBQUU7UUFDMUMsTUFBTSxlQUFlLEdBQUcsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxpQkFBaUIsRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLHVCQUF1QixFQUFFLENBQUMsQ0FBQztRQUNuSSxNQUFNLGVBQWUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLGlCQUFpQixFQUFFLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxDQUFDO1FBQ3BJLE1BQU0sZUFBZSxHQUFHLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxzQ0FBc0MsRUFBRSxDQUFDLENBQUM7UUFDbEosSUFBSSxNQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLG1CQUFtQixFQUFFO1lBQ3ZELGVBQWUsRUFBRSxDQUFDLGVBQWUsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDO1NBQ3JFLENBQUMsQ0FBQztRQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGdDQUFnQyxFQUFFO1lBQ2hGLGlCQUFpQixFQUFFO2dCQUNqQix5QkFBeUIsRUFBRTtvQkFDekI7d0JBQ0UsWUFBWSxFQUFFOzRCQUNaLHlCQUF5Qjs0QkFDekIsbUJBQW1CO3lCQUNwQjtxQkFDRjtvQkFDRDt3QkFDRSxZQUFZLEVBQUU7NEJBQ1oseUJBQXlCOzRCQUN6QixtQkFBbUI7eUJBQ3BCO3FCQUNGO29CQUNEO3dCQUNFLFlBQVksRUFBRTs0QkFDWix5QkFBeUI7NEJBQ3pCLG1CQUFtQjt5QkFDcEI7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHNFQUFzRSxFQUFFLEdBQUcsRUFBRTtRQUNoRixNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLHVCQUF1QixDQUFDO1FBQ3pELE1BQU0sY0FBYyxHQUFHLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3hGLElBQUksTUFBTSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxtQkFBbUIsRUFBRTtZQUN2RCxlQUFlLEVBQUUsQ0FBQyxjQUFjLENBQUM7WUFDakMsNkJBQTZCLEVBQUUsTUFBTSxDQUFDLDZCQUE2QixDQUFDLE9BQU87WUFDM0UsV0FBVyxFQUFFLGtCQUFrQjtTQUNoQyxDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxnQ0FBZ0MsRUFBRTtZQUNoRixtQkFBbUIsRUFBRTtnQkFDbkIsNkJBQTZCLEVBQUUsU0FBUzthQUN6QztZQUNELFdBQVcsRUFBRSxrQkFBa0I7U0FDaEMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsc0NBQXNDLEVBQUUsR0FBRyxFQUFFO1FBQ2hELE1BQU0sbUJBQW1CLEdBQUcsZ0JBQWdCLENBQUM7UUFDN0MsTUFBTSxvQkFBb0IsR0FBRyx3Q0FBd0MsbUJBQW1CLEVBQUUsQ0FBQztRQUMzRixNQUFNLGlCQUFpQixHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyx3QkFBd0IsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLG9CQUFvQixDQUFFLENBQUM7UUFFdEgsTUFBTSxDQUFDLGlCQUFpQixDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDMUUsTUFBTSxDQUFDLGlCQUFpQixDQUFDLG1CQUFtQixDQUFDLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDeEUscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDLGdDQUFnQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2pGLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG9EQUFvRCxFQUFFLEdBQUcsRUFBRTtRQUM5RCxNQUFNLG9CQUFvQixHQUFHLHNDQUFzQyxDQUFDO1FBRXBFLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsd0JBQXdCLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxvQkFBb0IsQ0FBRSxDQUFFLENBQUMsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFDbEosQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBzaWduZXIgZnJvbSAnQGF3cy1jZGsvYXdzLXNpZ25lcic7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnLi4vbGliJztcblxubGV0IGFwcDogY2RrLkFwcDtcbmxldCBzdGFjazogY2RrLlN0YWNrO1xuYmVmb3JlRWFjaCggKCkgPT4ge1xuICBhcHAgPSBuZXcgY2RrLkFwcCgge30gKTtcbiAgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCBhcHAgKTtcbn0gKTtcblxuZGVzY3JpYmUoJ2NvZGUgc2lnbmluZyBjb25maWcnLCAoKSA9PiB7XG4gIHRlc3QoJ2RlZmF1bHQnLCAoKSA9PiB7XG4gICAgY29uc3QgcGxhdGZvcm0gPSBzaWduZXIuUGxhdGZvcm0uQVdTX0xBTUJEQV9TSEEzODRfRUNEU0E7XG4gICAgY29uc3Qgc2lnbmluZ1Byb2ZpbGUgPSBuZXcgc2lnbmVyLlNpZ25pbmdQcm9maWxlKHN0YWNrLCAnU2lnbmluZ1Byb2ZpbGUnLCB7IHBsYXRmb3JtIH0pO1xuICAgIG5ldyBsYW1iZGEuQ29kZVNpZ25pbmdDb25maWcoc3RhY2ssICdDb2RlU2lnbmluZ0NvbmZpZycsIHtcbiAgICAgIHNpZ25pbmdQcm9maWxlczogW3NpZ25pbmdQcm9maWxlXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6Q29kZVNpZ25pbmdDb25maWcnLCB7XG4gICAgICBBbGxvd2VkUHVibGlzaGVyczoge1xuICAgICAgICBTaWduaW5nUHJvZmlsZVZlcnNpb25Bcm5zOiBbe1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ1NpZ25pbmdQcm9maWxlMjEzOUEwRjknLFxuICAgICAgICAgICAgJ1Byb2ZpbGVWZXJzaW9uQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9XSxcbiAgICAgIH0sXG4gICAgICBDb2RlU2lnbmluZ1BvbGljaWVzOiB7XG4gICAgICAgIFVudHJ1c3RlZEFydGlmYWN0T25EZXBsb3ltZW50OiAnV2FybicsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd3aXRoIG11bHRpcGxlIHNpZ25pbmcgcHJvZmlsZXMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc2lnbmluZ1Byb2ZpbGUxID0gbmV3IHNpZ25lci5TaWduaW5nUHJvZmlsZShzdGFjaywgJ1NpZ25pbmdQcm9maWxlMScsIHsgcGxhdGZvcm06IHNpZ25lci5QbGF0Zm9ybS5BV1NfTEFNQkRBX1NIQTM4NF9FQ0RTQSB9KTtcbiAgICBjb25zdCBzaWduaW5nUHJvZmlsZTIgPSBuZXcgc2lnbmVyLlNpZ25pbmdQcm9maWxlKHN0YWNrLCAnU2lnbmluZ1Byb2ZpbGUyJywgeyBwbGF0Zm9ybTogc2lnbmVyLlBsYXRmb3JtLkFNQVpPTl9GUkVFX1JUT1NfREVGQVVMVCB9KTtcbiAgICBjb25zdCBzaWduaW5nUHJvZmlsZTMgPSBuZXcgc2lnbmVyLlNpZ25pbmdQcm9maWxlKHN0YWNrLCAnU2lnbmluZ1Byb2ZpbGUzJywgeyBwbGF0Zm9ybTogc2lnbmVyLlBsYXRmb3JtLkFXU19JT1RfREVWSUNFX01BTkFHRU1FTlRfU0hBMjU2X0VDRFNBIH0pO1xuICAgIG5ldyBsYW1iZGEuQ29kZVNpZ25pbmdDb25maWcoc3RhY2ssICdDb2RlU2lnbmluZ0NvbmZpZycsIHtcbiAgICAgIHNpZ25pbmdQcm9maWxlczogW3NpZ25pbmdQcm9maWxlMSwgc2lnbmluZ1Byb2ZpbGUyLCBzaWduaW5nUHJvZmlsZTNdLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpDb2RlU2lnbmluZ0NvbmZpZycsIHtcbiAgICAgIEFsbG93ZWRQdWJsaXNoZXJzOiB7XG4gICAgICAgIFNpZ25pbmdQcm9maWxlVmVyc2lvbkFybnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ1NpZ25pbmdQcm9maWxlMUQ0MTkxNjg2JyxcbiAgICAgICAgICAgICAgJ1Byb2ZpbGVWZXJzaW9uQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ1NpZ25pbmdQcm9maWxlMkUwMTNDOTM0JyxcbiAgICAgICAgICAgICAgJ1Byb2ZpbGVWZXJzaW9uQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ1NpZ25pbmdQcm9maWxlM0EzOERFMjMxJyxcbiAgICAgICAgICAgICAgJ1Byb2ZpbGVWZXJzaW9uQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3dpdGggZGVzY3JpcHRpb24gYW5kIHdpdGggdW50cnVzdGVkQXJ0aWZhY3RPbkRlcGxveW1lbnQgb2YgXCJFTkZPUkNFXCInLCAoKSA9PiB7XG4gICAgY29uc3QgcGxhdGZvcm0gPSBzaWduZXIuUGxhdGZvcm0uQVdTX0xBTUJEQV9TSEEzODRfRUNEU0E7XG4gICAgY29uc3Qgc2lnbmluZ1Byb2ZpbGUgPSBuZXcgc2lnbmVyLlNpZ25pbmdQcm9maWxlKHN0YWNrLCAnU2lnbmluZ1Byb2ZpbGUnLCB7IHBsYXRmb3JtIH0pO1xuICAgIG5ldyBsYW1iZGEuQ29kZVNpZ25pbmdDb25maWcoc3RhY2ssICdDb2RlU2lnbmluZ0NvbmZpZycsIHtcbiAgICAgIHNpZ25pbmdQcm9maWxlczogW3NpZ25pbmdQcm9maWxlXSxcbiAgICAgIHVudHJ1c3RlZEFydGlmYWN0T25EZXBsb3ltZW50OiBsYW1iZGEuVW50cnVzdGVkQXJ0aWZhY3RPbkRlcGxveW1lbnQuRU5GT1JDRSxcbiAgICAgIGRlc2NyaXB0aW9uOiAndGVzdCBkZXNjcmlwdGlvbicsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkNvZGVTaWduaW5nQ29uZmlnJywge1xuICAgICAgQ29kZVNpZ25pbmdQb2xpY2llczoge1xuICAgICAgICBVbnRydXN0ZWRBcnRpZmFjdE9uRGVwbG95bWVudDogJ0VuZm9yY2UnLFxuICAgICAgfSxcbiAgICAgIERlc2NyaXB0aW9uOiAndGVzdCBkZXNjcmlwdGlvbicsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ltcG9ydCBkb2VzIG5vdCBjcmVhdGUgYW55IHJlc291cmNlcycsICgpID0+IHtcbiAgICBjb25zdCBjb2RlU2lnbmluZ0NvbmZpZ0lkID0gJ2FhYS14eHh4eHh4eHh4JztcbiAgICBjb25zdCBjb2RlU2lnbmluZ0NvbmZpZ0FybiA9IGBhcm46YXdzOmxhbWJkYTo6OmNvZGUtc2lnbmluZy1jb25maWc6JHtjb2RlU2lnbmluZ0NvbmZpZ0lkfWA7XG4gICAgY29uc3QgY29kZVNpZ25pbmdDb25maWcgPSBsYW1iZGEuQ29kZVNpZ25pbmdDb25maWcuZnJvbUNvZGVTaWduaW5nQ29uZmlnQXJuKHN0YWNrLCAnSW1wb3J0ZWQnLCBjb2RlU2lnbmluZ0NvbmZpZ0FybiApO1xuXG4gICAgZXhwZWN0KGNvZGVTaWduaW5nQ29uZmlnLmNvZGVTaWduaW5nQ29uZmlnQXJuKS50b0JlKGNvZGVTaWduaW5nQ29uZmlnQXJuKTtcbiAgICBleHBlY3QoY29kZVNpZ25pbmdDb25maWcuY29kZVNpZ25pbmdDb25maWdJZCkudG9CZShjb2RlU2lnbmluZ0NvbmZpZ0lkKTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpMYW1iZGE6OkNvZGVTaWduaW5nQ29uZmlnJywgMCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWwgaW1wb3J0IHdpdGggbWFsZm9ybWVkIGNvZGUgc2lnbmluZyBjb25maWcgYXJuJywgKCkgPT4ge1xuICAgIGNvbnN0IGNvZGVTaWduaW5nQ29uZmlnQXJuID0gJ2Fybjphd3M6bGFtYmRhOjo6Y29kZS1zaWduaW5nLWNvbmZpZyc7XG5cbiAgICBleHBlY3QoKCkgPT4gbGFtYmRhLkNvZGVTaWduaW5nQ29uZmlnLmZyb21Db2RlU2lnbmluZ0NvbmZpZ0FybihzdGFjaywgJ0ltcG9ydGVkJywgY29kZVNpZ25pbmdDb25maWdBcm4gKSApLnRvVGhyb3coL0FSTiBtdXN0IGJlIGluIHRoZSBmb3JtYXQvKTtcbiAgfSk7XG59KTtcbiJdfQ==