"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('ResponseHeadersPolicy', () => {
    let app;
    let stack;
    beforeEach(() => {
        app = new core_1.App();
        stack = new core_1.Stack(app, 'Stack', {
            env: { account: '123456789012', region: 'testregion' },
        });
    });
    test('import existing policy by id', () => {
        const responseHeadersPolicyId = '344f6fe5-7ce5-4df0-a470-3f14177c549c';
        const responseHeadersPolicy = lib_1.ResponseHeadersPolicy.fromResponseHeadersPolicyId(stack, 'MyPolicy', responseHeadersPolicyId);
        expect(responseHeadersPolicy.responseHeadersPolicyId).toEqual(responseHeadersPolicyId);
    });
    test('managed policies are provided', () => {
        expect(lib_1.ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS.responseHeadersPolicyId).toEqual('60669652-455b-4ae9-85a4-c4c02393f86c');
        expect(lib_1.ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT.responseHeadersPolicyId).toEqual('5cc3b908-e619-4b99-88e5-2cf7f45965bd');
        expect(lib_1.ResponseHeadersPolicy.SECURITY_HEADERS.responseHeadersPolicyId).toEqual('67f7725c-6f97-4210-82d7-5512b31e9d03');
        expect(lib_1.ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_AND_SECURITY_HEADERS.responseHeadersPolicyId).toEqual('e61eb60c-9c35-4d20-a928-2b84e02af89c');
        expect(lib_1.ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT_AND_SECURITY_HEADERS.responseHeadersPolicyId).toEqual('eaab4381-ed33-4a86-88ca-d9558dc6cd63');
    });
    test('minimal example', () => {
        new lib_1.ResponseHeadersPolicy(stack, 'ResponseHeadersPolicy');
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::ResponseHeadersPolicy', {
            ResponseHeadersPolicyConfig: {
                Name: 'StackResponseHeadersPolicy7B76F936',
            },
        });
    });
    test('maximum example', () => {
        new lib_1.ResponseHeadersPolicy(stack, 'ResponseHeadersPolicy', {
            responseHeadersPolicyName: 'MyPolicy',
            comment: 'A default policy',
            corsBehavior: {
                accessControlAllowCredentials: false,
                accessControlAllowHeaders: ['X-Custom-Header-1', 'X-Custom-Header-2'],
                accessControlAllowMethods: ['GET', 'POST'],
                accessControlAllowOrigins: ['*'],
                accessControlExposeHeaders: ['X-Custom-Header-1', 'X-Custom-Header-2'],
                accessControlMaxAge: core_1.Duration.seconds(600),
                originOverride: true,
            },
            customHeadersBehavior: {
                customHeaders: [
                    { header: 'X-Custom-Header-1', value: 'application/json', override: true },
                    { header: 'X-Custom-Header-2', value: '0', override: false },
                ],
            },
            securityHeadersBehavior: {
                contentSecurityPolicy: { contentSecurityPolicy: 'default-src https:;', override: true },
                contentTypeOptions: { override: true },
                frameOptions: { frameOption: lib_1.HeadersFrameOption.DENY, override: true },
                referrerPolicy: { referrerPolicy: lib_1.HeadersReferrerPolicy.NO_REFERRER, override: true },
                strictTransportSecurity: { accessControlMaxAge: core_1.Duration.seconds(600), includeSubdomains: true, override: true },
                xssProtection: { protection: true, modeBlock: true, reportUri: 'https://example.com/csp-report', override: true },
            },
            removeHeaders: ['Server'],
            serverTimingSamplingRate: 12.3456,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::ResponseHeadersPolicy', {
            ResponseHeadersPolicyConfig: {
                Comment: 'A default policy',
                CorsConfig: {
                    AccessControlAllowCredentials: false,
                    AccessControlAllowHeaders: {
                        Items: [
                            'X-Custom-Header-1',
                            'X-Custom-Header-2',
                        ],
                    },
                    AccessControlAllowMethods: {
                        Items: [
                            'GET',
                            'POST',
                        ],
                    },
                    AccessControlAllowOrigins: {
                        Items: [
                            '*',
                        ],
                    },
                    AccessControlExposeHeaders: {
                        Items: [
                            'X-Custom-Header-1',
                            'X-Custom-Header-2',
                        ],
                    },
                    AccessControlMaxAgeSec: 600,
                    OriginOverride: true,
                },
                CustomHeadersConfig: {
                    Items: [
                        {
                            Header: 'X-Custom-Header-1',
                            Override: true,
                            Value: 'application/json',
                        },
                        {
                            Header: 'X-Custom-Header-2',
                            Override: false,
                            Value: '0',
                        },
                    ],
                },
                Name: 'MyPolicy',
                SecurityHeadersConfig: {
                    ContentSecurityPolicy: {
                        ContentSecurityPolicy: 'default-src https:;',
                        Override: true,
                    },
                    ContentTypeOptions: {
                        Override: true,
                    },
                    FrameOptions: {
                        FrameOption: 'DENY',
                        Override: true,
                    },
                    ReferrerPolicy: {
                        Override: true,
                        ReferrerPolicy: 'no-referrer',
                    },
                    StrictTransportSecurity: {
                        AccessControlMaxAgeSec: 600,
                        IncludeSubdomains: true,
                        Override: true,
                    },
                    XSSProtection: {
                        ModeBlock: true,
                        Override: true,
                        Protection: true,
                        ReportUri: 'https://example.com/csp-report',
                    },
                },
                RemoveHeadersConfig: {
                    Items: [{ Header: 'Server' }],
                },
                ServerTimingHeadersConfig: {
                    Enabled: true,
                    SamplingRate: 12.3456,
                },
            },
        });
    });
    test('throws when removing read-only headers', () => {
        expect(() => new lib_1.ResponseHeadersPolicy(stack, 'ResponseHeadersPolicy', {
            removeHeaders: ['Content-Encoding'],
        })).toThrow('Cannot remove read-only header Content-Encoding');
    });
    test('throws with out of range sampling rate', () => {
        expect(() => new lib_1.ResponseHeadersPolicy(stack, 'ResponseHeadersPolicy', {
            serverTimingSamplingRate: 110,
        })).toThrow('Sampling rate must be between 0 and 100 (inclusive), received 110');
    });
    test('throws with sampling rate with more than 4 decimal places', () => {
        expect(() => new lib_1.ResponseHeadersPolicy(stack, 'ResponseHeadersPolicy', {
            serverTimingSamplingRate: 50.12345,
        })).toThrow('Sampling rate can have up to four decimal places, received 50.12345');
    });
    test('it truncates long auto-generated names', () => {
        new lib_1.ResponseHeadersPolicy(stack, 'AVeryLongIdThatMightSeemRidiculousButSometimesHappensInCdkPipelinesBecauseTheStageNamesConcatenatedWithTheRegionAreQuiteLongMuchLongerThanYouWouldExpect');
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::ResponseHeadersPolicy', {
            ResponseHeadersPolicyConfig: {
                Name: 'StackAVeryLongIdThatMightSeemRidiculousButSometimesHappensIntenatedWithTheRegionAreQuiteLongMuchLongerThanYouWouldExpect39083892',
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzcG9uc2UtaGVhZGVycy1wb2xpY3kudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlc3BvbnNlLWhlYWRlcnMtcG9saWN5LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0Msd0NBQXFEO0FBQ3JELGdDQUEwRjtBQUUxRixRQUFRLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxFQUFFO0lBQ3JDLElBQUksR0FBUSxDQUFDO0lBQ2IsSUFBSSxLQUFZLENBQUM7SUFFakIsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEdBQUcsR0FBRyxJQUFJLFVBQUcsRUFBRSxDQUFDO1FBQ2hCLEtBQUssR0FBRyxJQUFJLFlBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFO1lBQzlCLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRTtTQUN2RCxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw4QkFBOEIsRUFBRSxHQUFHLEVBQUU7UUFDeEMsTUFBTSx1QkFBdUIsR0FBRyxzQ0FBc0MsQ0FBQztRQUN2RSxNQUFNLHFCQUFxQixHQUFHLDJCQUFxQixDQUFDLDJCQUEyQixDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztRQUM1SCxNQUFNLENBQUMscUJBQXFCLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUN6RixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywrQkFBK0IsRUFBRSxHQUFHLEVBQUU7UUFDekMsTUFBTSxDQUFDLDJCQUFxQixDQUFDLHNCQUFzQixDQUFDLHVCQUF1QixDQUFDLENBQUMsT0FBTyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7UUFDN0gsTUFBTSxDQUFDLDJCQUFxQixDQUFDLHFDQUFxQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsT0FBTyxD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d0JBQXdCLEVBQUUsUUFBUTtTQUNuQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMscUVBQXFFLENBQUMsQ0FBQztJQUNyRixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx3Q0FBd0MsRUFBRSxHQUFHLEVBQUU7UUFDbEQsSUFBSSwyQkFBcUIsQ0FBQyxLQUFLLEVBQUUsMEpBQTBKLENBQUMsQ0FBQztRQUU3TCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3Q0FBd0MsRUFBRTtZQUN4RiwyQkFBMkIsRUFBRTtnQkFDM0IsSUFBSSxFQUFFLGtJQUFrSTthQUN6STtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgQXBwLCBEdXJhdGlvbiwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEhlYWRlcnNGcmFtZU9wdGlvbiwgSGVhZGVyc1JlZmVycmVyUG9saWN5LCBSZXNwb25zZUhlYWRlcnNQb2xpY3kgfSBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgnUmVzcG9uc2VIZWFkZXJzUG9saWN5JywgKCkgPT4ge1xuICBsZXQgYXBwOiBBcHA7XG4gIGxldCBzdGFjazogU3RhY2s7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgYXBwID0gbmV3IEFwcCgpO1xuICAgIHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrJywge1xuICAgICAgZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLCByZWdpb246ICd0ZXN0cmVnaW9uJyB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdpbXBvcnQgZXhpc3RpbmcgcG9saWN5IGJ5IGlkJywgKCkgPT4ge1xuICAgIGNvbnN0IHJlc3BvbnNlSGVhZGVyc1BvbGljeUlkID0gJzM0NGY2ZmU1LTdjZTUtNGRmMC1hNDcwLTNmMTQxNzdjNTQ5Yyc7XG4gICAgY29uc3QgcmVzcG9uc2VIZWFkZXJzUG9saWN5ID0gUmVzcG9uc2VIZWFkZXJzUG9saWN5LmZyb21SZXNwb25zZUhlYWRlcnNQb2xpY3lJZChzdGFjaywgJ015UG9saWN5JywgcmVzcG9uc2VIZWFkZXJzUG9saWN5SWQpO1xuICAgIGV4cGVjdChyZXNwb25zZUhlYWRlcnNQb2xpY3kucmVzcG9uc2VIZWFkZXJzUG9saWN5SWQpLnRvRXF1YWwocmVzcG9uc2VIZWFkZXJzUG9saWN5SWQpO1xuICB9KTtcblxuICB0ZXN0KCdtYW5hZ2VkIHBvbGljaWVzIGFyZSBwcm92aWRlZCcsICgpID0+IHtcbiAgICBleHBlY3QoUmVzcG9uc2VIZWFkZXJzUG9saWN5LkNPUlNfQUxMT1dfQUxMX09SSUdJTlMucmVzcG9uc2VIZWFkZXJzUG9saWN5SWQpLnRvRXF1YWwoJzYwNjY5NjUyLTQ1NWItNGFlOS04NWE0LWM0YzAyMzkzZjg2YycpO1xuICAgIGV4cGVjdChSZXNwb25zZUhlYWRlcnNQb2xpY3kuQ09SU19BTExPV19BTExfT1JJR0lOU19XSVRIX1BSRUZMSUdIVC5yZXNwb25zZUhlYWRlcnNQb2xpY3lJZCkudG9FcXVhbCgnNWNjM2I5MDgtZTYxOS00Yjk5LTg4ZTUtMmNmN2Y0NTk2NWJkJyk7XG4gICAgZXhwZWN0KFJlc3BvbnNlSGVhZGVyc1BvbGljeS5TRUNVUklUWV9IRUFERVJTLnJlc3BvbnNlSGVhZGVyc1BvbGljeUlkKS50b0VxdWFsKCc2N2Y3NzI1Yy02Zjk3LTQyMTAtODJkNy01NTEyYjMxZTlkMDMnKTtcbiAgICBleHBlY3QoUmVzcG9uc2VIZWFkZXJzUG9saWN5LkNPUlNfQUxMT1dfQUxMX09SSUdJTlNfQU5EX1NFQ1VSSVRZX0hFQURFUlMucmVzcG9uc2VIZWFkZXJzUG9saWN5SWQpLnRvRXF1YWwoJ2U2MWViNjBjLTljMzUtNGQyMC1hOTI4LTJiODRlMDJhZjg5YycpO1xuICAgIGV4cGVjdChSZXNwb25zZUhlYWRlcnNQb2xpY3kuQ09SU19BTExPV19BTExfT1JJR0lOU19XSVRIX1BSRUZMSUdIVF9BTkRfU0VDVVJJVFlfSEVBREVSUy5yZXNwb25zZUhlYWRlcnNQb2xpY3lJZCkudG9FcXVhbCgnZWFhYjQzODEtZWQzMy00YTg2LTg4Y2EtZDk1NThkYzZjZDYzJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ21pbmltYWwgZXhhbXBsZScsICgpID0+IHtcbiAgICBuZXcgUmVzcG9uc2VIZWFkZXJzUG9saWN5KHN0YWNrLCAnUmVzcG9uc2VIZWFkZXJzUG9saWN5Jyk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZEZyb250OjpSZXNwb25zZUhlYWRlcnNQb2xpY3knLCB7XG4gICAgICBSZXNwb25zZUhlYWRlcnNQb2xpY3lDb25maWc6IHtcbiAgICAgICAgTmFtZTogJ1N0YWNrUmVzcG9uc2VIZWFkZXJzUG9saWN5N0I3NkY5MzYnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnbWF4aW11bSBleGFtcGxlJywgKCkgPT4ge1xuICAgIG5ldyBSZXNwb25zZUhlYWRlcnNQb2xpY3koc3RhY2ssICdSZXNwb25zZUhlYWRlcnNQb2xpY3knLCB7XG4gICAgICByZXNwb25zZUhlYWRlcnNQb2xpY3lOYW1lOiAnTXlQb2xpY3knLFxuICAgICAgY29tbWVudDogJ0EgZGVmYXVsdCBwb2xpY3knLFxuICAgICAgY29yc0JlaGF2aW9yOiB7XG4gICAgICAgIGFjY2Vzc0NvbnRyb2xBbGxvd0NyZWRlbnRpYWxzOiBmYWxzZSxcbiAgICAgICAgYWNjZXNzQ29udHJvbEFsbG93SGVhZGVyczogWydYLUN1c3RvbS1IZWFkZXItMScsICdYLUN1c3RvbS1IZWFkZXItMiddLFxuICAgICAgICBhY2Nlc3NDb250cm9sQWxsb3dNZXRob2RzOiBbJ0dFVCcsICdQT1NUJ10sXG4gICAgICAgIGFjY2Vzc0NvbnRyb2xBbGxvd09yaWdpbnM6IFsnKiddLFxuICAgICAgICBhY2Nlc3NDb250cm9sRXhwb3NlSGVhZGVyczogWydYLUN1c3RvbS1IZWFkZXItMScsICdYLUN1c3RvbS1IZWFkZXItMiddLFxuICAgICAgICBhY2Nlc3NDb250cm9sTWF4QWdlOiBEdXJhdGlvbi5zZWNvbmRzKDYwMCksXG4gICAgICAgIG9yaWdpbk92ZXJyaWRlOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIGN1c3RvbUhlYWRlcnNCZWhhdmlvcjoge1xuICAgICAgICBjdXN0b21IZWFkZXJzOiBbXG4gICAgICAgICAgeyBoZWFkZXI6ICdYLUN1c3RvbS1IZWFkZXItMScsIHZhbHVlOiAnYXBwbGljYXRpb24vanNvbicsIG92ZXJyaWRlOiB0cnVlIH0sXG4gICAgICAgICAgeyBoZWFkZXI6ICdYLUN1c3RvbS1IZWFkZXItMicsIHZhbHVlOiAnMCcsIG92ZXJyaWRlOiBmYWxzZSB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIHNlY3VyaXR5SGVhZGVyc0JlaGF2aW9yOiB7XG4gICAgICAgIGNvbnRlbnRTZWN1cml0eVBvbGljeTogeyBjb250ZW50U2VjdXJpdHlQb2xpY3k6ICdkZWZhdWx0LXNyYyBodHRwczo7Jywgb3ZlcnJpZGU6IHRydWUgfSxcbiAgICAgICAgY29udGVudFR5cGVPcHRpb25zOiB7IG92ZXJyaWRlOiB0cnVlIH0sXG4gICAgICAgIGZyYW1lT3B0aW9uczogeyBmcmFtZU9wdGlvbjogSGVhZGVyc0ZyYW1lT3B0aW9uLkRFTlksIG92ZXJyaWRlOiB0cnVlIH0sXG4gICAgICAgIHJlZmVycmVyUG9saWN5OiB7IHJlZmVycmVyUG9saWN5OiBIZWFkZXJzUmVmZXJyZXJQb2xpY3kuTk9fUkVGRVJSRVIsIG92ZXJyaWRlOiB0cnVlIH0sXG4gICAgICAgIHN0cmljdFRyYW5zcG9ydFNlY3VyaXR5OiB7IGFjY2Vzc0NvbnRyb2xNYXhBZ2U6IER1cmF0aW9uLnNlY29uZHMoNjAwKSwgaW5jbHVkZVN1YmRvbWFpbnM6IHRydWUsIG92ZXJyaWRlOiB0cnVlIH0sXG4gICAgICAgIHhzc1Byb3RlY3Rpb246IHsgcHJvdGVjdGlvbjogdHJ1ZSwgbW9kZUJsb2NrOiB0cnVlLCByZXBvcnRVcmk6ICdodHRwczovL2V4YW1wbGUuY29tL2NzcC1yZXBvcnQnLCBvdmVycmlkZTogdHJ1ZSB9LFxuICAgICAgfSxcbiAgICAgIHJlbW92ZUhlYWRlcnM6IFsnU2VydmVyJ10sXG4gICAgICBzZXJ2ZXJUaW1pbmdTYW1wbGluZ1JhdGU6IDEyLjM0NTYsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZEZyb250OjpSZXNwb25zZUhlYWRlcnNQb2xpY3knLCB7XG4gICAgICBSZXNwb25zZUhlYWRlcnNQb2xpY3lDb25maWc6IHtcbiAgICAgICAgQ29tbWVudDogJ0EgZGVmYXVsdCBwb2xpY3knLFxuICAgICAgICBDb3JzQ29uZmlnOiB7XG4gICAgICAgICAgQWNjZXNzQ29udHJvbEFsbG93Q3JlZGVudGlhbHM6IGZhbHNlLFxuICAgICAgICAgIEFjY2Vzc0NvbnRyb2xBbGxvd0hlYWRlcnM6IHtcbiAgICAgICAgICAgIEl0ZW1zOiBbXG4gICAgICAgICAgICAgICdYLUN1c3RvbS1IZWFkZXItMScsXG4gICAgICAgICAgICAgICdYLUN1c3RvbS1IZWFkZXItMicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgQWNjZXNzQ29udHJvbEFsbG93TWV0aG9kczoge1xuICAgICAgICAgICAgSXRlbXM6IFtcbiAgICAgICAgICAgICAgJ0dFVCcsXG4gICAgICAgICAgICAgICdQT1NUJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBBY2Nlc3NDb250cm9sQWxsb3dPcmlnaW5zOiB7XG4gICAgICAgICAgICBJdGVtczogW1xuICAgICAgICAgICAgICAnKicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgQWNjZXNzQ29udHJvbEV4cG9zZUhlYWRlcnM6IHtcbiAgICAgICAgICAgIEl0ZW1zOiBbXG4gICAgICAgICAgICAgICdYLUN1c3RvbS1IZWFkZXItMScsXG4gICAgICAgICAgICAgICdYLUN1c3RvbS1IZWFkZXItMicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgQWNjZXNzQ29udHJvbE1heEFnZVNlYzogNjAwLFxuICAgICAgICAgIE9yaWdpbk92ZXJyaWRlOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICBDdXN0b21IZWFkZXJzQ29uZmlnOiB7XG4gICAgICAgICAgSXRlbXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgSGVhZGVyOiAnWC1DdXN0b20tSGVhZGVyLTEnLFxuICAgICAgICAgICAgICBPdmVycmlkZTogdHJ1ZSxcbiAgICAgICAgICAgICAgVmFsdWU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEhlYWRlcjogJ1gtQ3VzdG9tLUhlYWRlci0yJyxcbiAgICAgICAgICAgICAgT3ZlcnJpZGU6IGZhbHNlLFxuICAgICAgICAgICAgICBWYWx1ZTogJzAnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBOYW1lOiAnTXlQb2xpY3knLFxuICAgICAgICBTZWN1cml0eUhlYWRlcnNDb25maWc6IHtcbiAgICAgICAgICBDb250ZW50U2VjdXJpdHlQb2xpY3k6IHtcbiAgICAgICAgICAgIENvbnRlbnRTZWN1cml0eVBvbGljeTogJ2RlZmF1bHQtc3JjIGh0dHBzOjsnLFxuICAgICAgICAgICAgT3ZlcnJpZGU6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBDb250ZW50VHlwZU9wdGlvbnM6IHtcbiAgICAgICAgICAgIE92ZXJyaWRlOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgRnJhbWVPcHRpb25zOiB7XG4gICAgICAgICAgICBGcmFtZU9wdGlvbjogJ0RFTlknLFxuICAgICAgICAgICAgT3ZlcnJpZGU6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBSZWZlcnJlclBvbGljeToge1xuICAgICAgICAgICAgT3ZlcnJpZGU6IHRydWUsXG4gICAgICAgICAgICBSZWZlcnJlclBvbGljeTogJ25vLXJlZmVycmVyJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFN0cmljdFRyYW5zcG9ydFNlY3VyaXR5OiB7XG4gICAgICAgICAgICBBY2Nlc3NDb250cm9sTWF4QWdlU2VjOiA2MDAsXG4gICAgICAgICAgICBJbmNsdWRlU3ViZG9tYWluczogdHJ1ZSxcbiAgICAgICAgICAgIE92ZXJyaWRlOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgWFNTUHJvdGVjdGlvbjoge1xuICAgICAgICAgICAgTW9kZUJsb2NrOiB0cnVlLFxuICAgICAgICAgICAgT3ZlcnJpZGU6IHRydWUsXG4gICAgICAgICAgICBQcm90ZWN0aW9uOiB0cnVlLFxuICAgICAgICAgICAgUmVwb3J0VXJpOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9jc3AtcmVwb3J0JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBSZW1vdmVIZWFkZXJzQ29uZmlnOiB7XG4gICAgICAgICAgSXRlbXM6IFt7IEhlYWRlcjogJ1NlcnZlcicgfV0sXG4gICAgICAgIH0sXG4gICAgICAgIFNlcnZlclRpbWluZ0hlYWRlcnNDb25maWc6IHtcbiAgICAgICAgICBFbmFibGVkOiB0cnVlLFxuICAgICAgICAgIFNhbXBsaW5nUmF0ZTogMTIuMzQ1NixcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyB3aGVuIHJlbW92aW5nIHJlYWQtb25seSBoZWFkZXJzJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiBuZXcgUmVzcG9uc2VIZWFkZXJzUG9saWN5KHN0YWNrLCAnUmVzcG9uc2VIZWFkZXJzUG9saWN5Jywge1xuICAgICAgcmVtb3ZlSGVhZGVyczogWydDb250ZW50LUVuY29kaW5nJ10sXG4gICAgfSkpLnRvVGhyb3coJ0Nhbm5vdCByZW1vdmUgcmVhZC1vbmx5IGhlYWRlciBDb250ZW50LUVuY29kaW5nJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyB3aXRoIG91dCBvZiByYW5nZSBzYW1wbGluZyByYXRlJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiBuZXcgUmVzcG9uc2VIZWFkZXJzUG9saWN5KHN0YWNrLCAnUmVzcG9uc2VIZWFkZXJzUG9saWN5Jywge1xuICAgICAgc2VydmVyVGltaW5nU2FtcGxpbmdSYXRlOiAxMTAsXG4gICAgfSkpLnRvVGhyb3coJ1NhbXBsaW5nIHJhdGUgbXVzdCBiZSBiZXR3ZWVuIDAgYW5kIDEwMCAoaW5jbHVzaXZlKSwgcmVjZWl2ZWQgMTEwJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyB3aXRoIHNhbXBsaW5nIHJhdGUgd2l0aCBtb3JlIHRoYW4gNCBkZWNpbWFsIHBsYWNlcycsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gbmV3IFJlc3BvbnNlSGVhZGVyc1BvbGljeShzdGFjaywgJ1Jlc3BvbnNlSGVhZGVyc1BvbGljeScsIHtcbiAgICAgIHNlcnZlclRpbWluZ1NhbXBsaW5nUmF0ZTogNTAuMTIzNDUsXG4gICAgfSkpLnRvVGhyb3coJ1NhbXBsaW5nIHJhdGUgY2FuIGhhdmUgdXAgdG8gZm91ciBkZWNpbWFsIHBsYWNlcywgcmVjZWl2ZWQgNTAuMTIzNDUnKTtcbiAgfSk7XG5cbiAgdGVzdCgnaXQgdHJ1bmNhdGVzIGxvbmcgYXV0by1nZW5lcmF0ZWQgbmFtZXMnLCAoKSA9PiB7XG4gICAgbmV3IFJlc3BvbnNlSGVhZGVyc1BvbGljeShzdGFjaywgJ0FWZXJ5TG9uZ0lkVGhhdE1pZ2h0U2VlbVJpZGljdWxvdXNCdXRTb21ldGltZXNIYXBwZW5zSW5DZGtQaXBlbGluZXNCZWNhdXNlVGhlU3RhZ2VOYW1lc0NvbmNhdGVuYXRlZFdpdGhUaGVSZWdpb25BcmVRdWl0ZUxvbmdNdWNoTG9uZ2VyVGhhbllvdVdvdWxkRXhwZWN0Jyk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZEZyb250OjpSZXNwb25zZUhlYWRlcnNQb2xpY3knLCB7XG4gICAgICBSZXNwb25zZUhlYWRlcnNQb2xpY3lDb25maWc6IHtcbiAgICAgICAgTmFtZTogJ1N0YWNrQVZlcnlMb25nSWRUaGF0TWlnaHRTZWVtUmlkaWN1bG91c0J1dFNvbWV0aW1lc0hhcHBlbnNJbnRlbmF0ZWRXaXRoVGhlUmVnaW9uQXJlUXVpdGVMb25nTXVjaExvbmdlclRoYW5Zb3VXb3VsZEV4cGVjdDM5MDgzODkyJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=