"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const lib_1 = require("../lib");
class TestStack extends core_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        const userpool = new lib_1.UserPool(this, 'pool', {
            removalPolicy: core_1.RemovalPolicy.DESTROY,
        });
        new lib_1.UserPoolIdentityProviderSaml(this, 'cdk', {
            userPool: userpool,
            name: 'cdk',
            metadata: lib_1.UserPoolIdentityProviderSamlMetadata.url('https://fujifish.github.io/samling/public/metadata.xml'),
        });
        const client = userpool.addClient('client');
        const domain = userpool.addDomain('domain', {
            cognitoDomain: {
                domainPrefix: 'cdk-test-pool',
            },
        });
        new core_1.CfnOutput(this, 'SignInLink', {
            value: domain.signInUrl(client, {
                redirectUri: 'https://example.com',
            }),
        });
    }
}
const app = new core_1.App();
const testCase = new TestStack(app, 'integ-user-pool-identity-provider-saml-stack');
new integ_tests_1.IntegTest(app, 'integ-user-pool-identity-provider-saml-test', {
    testCases: [testCase],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcudXNlci1wb29sLWlkcC5zYW1sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcudXNlci1wb29sLWlkcC5zYW1sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0NBQXFFO0FBQ3JFLHNEQUFpRDtBQUVqRCxnQ0FBc0c7QUFFdEcsTUFBTSxTQUFVLFNBQVEsWUFBSztJQUMzQixZQUFZLEtBQWdCLEVBQUUsRUFBVTtRQUN0QyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2pCLE1BQU0sUUFBUSxHQUFHLElBQUksY0FBUSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUU7WUFDMUMsYUFBYSxFQUFFLG9CQUFhLENBQUMsT0FBTztTQUNyQyxDQUFDLENBQUM7UUFFSCxJQUFJLGtDQUE0QixDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7WUFDNUMsUUFBUSxFQUFFLFFBQVE7WUFDbEIsSUFBSSxFQUFFLEtBQUs7WUFDWCxRQUFRLEVBQUUsMENBQW9DLENBQUMsR0FBRyxDQUFDLHdEQUF3RCxDQUFDO1NBQzdHLENBQUMsQ0FBQztRQUVILE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFNUMsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUU7WUFDMUMsYUFBYSxFQUFFO2dCQUNiLFlBQVksRUFBRSxlQUFlO2FBQzlCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxnQkFBUyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDaEMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO2dCQUM5QixXQUFXLEVBQUUscUJBQXFCO2FBQ25DLENBQUM7U0FDSCxDQUFDLENBQUM7S0FDSjtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztBQUN0QixNQUFNLFFBQVEsR0FBRyxJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsOENBQThDLENBQUMsQ0FBQztBQUVwRixJQUFJLHVCQUFTLENBQUMsR0FBRyxFQUFFLDZDQUE2QyxFQUFFO0lBQ2hFLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQztDQUN0QixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHAsIENmbk91dHB1dCwgUmVtb3ZhbFBvbGljeSwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEludGVnVGVzdCB9IGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgVXNlclBvb2wsIFVzZXJQb29sSWRlbnRpdHlQcm92aWRlclNhbWwsIFVzZXJQb29sSWRlbnRpdHlQcm92aWRlclNhbWxNZXRhZGF0YSB9IGZyb20gJy4uL2xpYic7XG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG4gICAgY29uc3QgdXNlcnBvb2wgPSBuZXcgVXNlclBvb2wodGhpcywgJ3Bvb2wnLCB7XG4gICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgfSk7XG5cbiAgICBuZXcgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyU2FtbCh0aGlzLCAnY2RrJywge1xuICAgICAgdXNlclBvb2w6IHVzZXJwb29sLFxuICAgICAgbmFtZTogJ2NkaycsXG4gICAgICBtZXRhZGF0YTogVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyU2FtbE1ldGFkYXRhLnVybCgnaHR0cHM6Ly9mdWppZmlzaC5naXRodWIuaW8vc2FtbGluZy9wdWJsaWMvbWV0YWRhdGEueG1sJyksXG4gICAgfSk7XG5cbiAgICBjb25zdCBjbGllbnQgPSB1c2VycG9vbC5hZGRDbGllbnQoJ2NsaWVudCcpO1xuXG4gICAgY29uc3QgZG9tYWluID0gdXNlcnBvb2wuYWRkRG9tYWluKCdkb21haW4nLCB7XG4gICAgICBjb2duaXRvRG9tYWluOiB7XG4gICAgICAgIGRvbWFpblByZWZpeDogJ2Nkay10ZXN0LXBvb2wnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgJ1NpZ25JbkxpbmsnLCB7XG4gICAgICB2YWx1ZTogZG9tYWluLnNpZ25JblVybChjbGllbnQsIHtcbiAgICAgICAgcmVkaXJlY3RVcmk6ICdodHRwczovL2V4YW1wbGUuY29tJyxcbiAgICAgIH0pLFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbmNvbnN0IHRlc3RDYXNlID0gbmV3IFRlc3RTdGFjayhhcHAsICdpbnRlZy11c2VyLXBvb2wtaWRlbnRpdHktcHJvdmlkZXItc2FtbC1zdGFjaycpO1xuXG5uZXcgSW50ZWdUZXN0KGFwcCwgJ2ludGVnLXVzZXItcG9vbC1pZGVudGl0eS1wcm92aWRlci1zYW1sLXRlc3QnLCB7XG4gIHRlc3RDYXNlczogW3Rlc3RDYXNlXSxcbn0pO1xuIl19