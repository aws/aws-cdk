"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_cognito_1 = require("aws-cdk-lib/aws-cognito");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        const userpool = new aws_cognito_1.UserPool(this, 'pool', {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
        });
        new aws_cognito_1.UserPoolIdentityProviderSaml(this, 'cdk', {
            userPool: userpool,
            name: 'cdk',
            metadata: aws_cognito_1.UserPoolIdentityProviderSamlMetadata.url('https://fujifish.github.io/samling/public/metadata.xml'),
        });
        const client = userpool.addClient('client');
        const domain = userpool.addDomain('domain', {
            cognitoDomain: {
                domainPrefix: 'cdk-test-pool',
            },
        });
        new aws_cdk_lib_1.CfnOutput(this, 'SignInLink', {
            value: domain.signInUrl(client, {
                redirectUri: 'https://example.com',
            }),
        });
    }
}
const app = new aws_cdk_lib_1.App();
const testCase = new TestStack(app, 'integ-user-pool-identity-provider-saml-stack');
new integ_tests_alpha_1.IntegTest(app, 'integ-user-pool-identity-provider-saml-test', {
    testCases: [testCase],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcudXNlci1wb29sLWlkcC5zYW1sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcudXNlci1wb29sLWlkcC5zYW1sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkNBQW1FO0FBQ25FLGtFQUF1RDtBQUV2RCx5REFBdUg7QUFFdkgsTUFBTSxTQUFVLFNBQVEsbUJBQUs7SUFDM0IsWUFBWSxLQUFnQixFQUFFLEVBQVU7UUFDdEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNqQixNQUFNLFFBQVEsR0FBRyxJQUFJLHNCQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtZQUMxQyxhQUFhLEVBQUUsMkJBQWEsQ0FBQyxPQUFPO1NBQ3JDLENBQUMsQ0FBQztRQUVILElBQUksMENBQTRCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtZQUM1QyxRQUFRLEVBQUUsUUFBUTtZQUNsQixJQUFJLEVBQUUsS0FBSztZQUNYLFFBQVEsRUFBRSxrREFBb0MsQ0FBQyxHQUFHLENBQUMsd0RBQXdELENBQUM7U0FDN0csQ0FBQyxDQUFDO1FBRUgsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUU1QyxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRTtZQUMxQyxhQUFhLEVBQUU7Z0JBQ2IsWUFBWSxFQUFFLGVBQWU7YUFDOUI7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLHVCQUFTLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUNoQyxLQUFLLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUU7Z0JBQzlCLFdBQVcsRUFBRSxxQkFBcUI7YUFDbkMsQ0FBQztTQUNILENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sUUFBUSxHQUFHLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSw4Q0FBOEMsQ0FBQyxDQUFDO0FBRXBGLElBQUksNkJBQVMsQ0FBQyxHQUFHLEVBQUUsNkNBQTZDLEVBQUU7SUFDaEUsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDO0NBQ3RCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcCwgQ2ZuT3V0cHV0LCBSZW1vdmFsUG9saWN5LCBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEludGVnVGVzdCB9IGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgVXNlclBvb2wsIFVzZXJQb29sSWRlbnRpdHlQcm92aWRlclNhbWwsIFVzZXJQb29sSWRlbnRpdHlQcm92aWRlclNhbWxNZXRhZGF0YSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2duaXRvJztcblxuY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcbiAgICBjb25zdCB1c2VycG9vbCA9IG5ldyBVc2VyUG9vbCh0aGlzLCAncG9vbCcsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICB9KTtcblxuICAgIG5ldyBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJTYW1sKHRoaXMsICdjZGsnLCB7XG4gICAgICB1c2VyUG9vbDogdXNlcnBvb2wsXG4gICAgICBuYW1lOiAnY2RrJyxcbiAgICAgIG1ldGFkYXRhOiBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJTYW1sTWV0YWRhdGEudXJsKCdodHRwczovL2Z1amlmaXNoLmdpdGh1Yi5pby9zYW1saW5nL3B1YmxpYy9tZXRhZGF0YS54bWwnKSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGNsaWVudCA9IHVzZXJwb29sLmFkZENsaWVudCgnY2xpZW50Jyk7XG5cbiAgICBjb25zdCBkb21haW4gPSB1c2VycG9vbC5hZGREb21haW4oJ2RvbWFpbicsIHtcbiAgICAgIGNvZ25pdG9Eb21haW46IHtcbiAgICAgICAgZG9tYWluUHJlZml4OiAnY2RrLXRlc3QtcG9vbCcsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgbmV3IENmbk91dHB1dCh0aGlzLCAnU2lnbkluTGluaycsIHtcbiAgICAgIHZhbHVlOiBkb21haW4uc2lnbkluVXJsKGNsaWVudCwge1xuICAgICAgICByZWRpcmVjdFVyaTogJ2h0dHBzOi8vZXhhbXBsZS5jb20nLFxuICAgICAgfSksXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuY29uc3QgdGVzdENhc2UgPSBuZXcgVGVzdFN0YWNrKGFwcCwgJ2ludGVnLXVzZXItcG9vbC1pZGVudGl0eS1wcm92aWRlci1zYW1sLXN0YWNrJyk7XG5cbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnaW50ZWctdXNlci1wb29sLWlkZW50aXR5LXByb3ZpZGVyLXNhbWwtdGVzdCcsIHtcbiAgdGVzdENhc2VzOiBbdGVzdENhc2VdLFxufSk7XG4iXX0=