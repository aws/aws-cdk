"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
/*
 * Stack verification steps
 * * Visit the URL provided by stack output 'SignInLink' in a browser, and verify the 'cdk' sign in link shows up.
 */
const app = new core_1.App();
const stack = new core_1.Stack(app, 'integ-user-pool-idp-google');
const userpool = new lib_1.UserPool(stack, 'pool', {
    removalPolicy: core_1.RemovalPolicy.DESTROY,
});
new lib_1.UserPoolIdentityProviderOidc(stack, 'cdk', {
    userPool: userpool,
    name: 'cdk',
    clientId: 'client-id',
    clientSecret: 'client-secret',
    issuerUrl: 'https://www.issuer-url.com',
    endpoints: {
        authorization: 'https://www.issuer-url.com/authorize',
        token: 'https://www.issuer-url.com/token',
        userInfo: 'https://www.issuer-url.com/userinfo',
        jwksUri: 'https://www.issuer-url.com/jwks',
    },
    scopes: ['openid', 'phone'],
    attributeMapping: {
        phoneNumber: lib_1.ProviderAttribute.other('phone_number'),
    },
});
const client = userpool.addClient('client');
const domain = userpool.addDomain('domain', {
    cognitoDomain: {
        domainPrefix: 'cdk-test-pool',
    },
});
new core_1.CfnOutput(stack, 'SignInLink', {
    value: domain.signInUrl(client, {
        redirectUri: 'https://example.com',
    }),
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcudXNlci1wb29sLWlkcC5vaWRjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcudXNlci1wb29sLWlkcC5vaWRjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0NBQXFFO0FBQ3JFLGdDQUFtRjtBQUVuRjs7O0dBR0c7QUFDSCxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO0FBRTNELE1BQU0sUUFBUSxHQUFHLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7SUFDM0MsYUFBYSxFQUFFLG9CQUFhLENBQUMsT0FBTztDQUNyQyxDQUFDLENBQUM7QUFFSCxJQUFJLGtDQUE0QixDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7SUFDN0MsUUFBUSxFQUFFLFFBQVE7SUFDbEIsSUFBSSxFQUFFLEtBQUs7SUFDWCxRQUFRLEVBQUUsV0FBVztJQUNyQixZQUFZLEVBQUUsZUFBZTtJQUM3QixTQUFTLEVBQUUsNEJBQTRCO0lBQ3ZDLFNBQVMsRUFBRTtRQUNULGFBQWEsRUFBRSxzQ0FBc0M7UUFDckQsS0FBSyxFQUFFLGtDQUFrQztRQUN6QyxRQUFRLEVBQUUscUNBQXFDO1FBQy9DLE9BQU8sRUFBRSxpQ0FBaUM7S0FDM0M7SUFDRCxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDO0lBQzNCLGdCQUFnQixFQUFFO1FBQ2hCLFdBQVcsRUFBRSx1QkFBaUIsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDO0tBQ3JEO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUU1QyxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRTtJQUMxQyxhQUFhLEVBQUU7UUFDYixZQUFZLEVBQUUsZUFBZTtLQUM5QjtDQUNGLENBQUMsQ0FBQztBQUVILElBQUksZ0JBQVMsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO0lBQ2pDLEtBQUssRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRTtRQUM5QixXQUFXLEVBQUUscUJBQXFCO0tBQ25DLENBQUM7Q0FDSCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHAsIENmbk91dHB1dCwgUmVtb3ZhbFBvbGljeSwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IFByb3ZpZGVyQXR0cmlidXRlLCBVc2VyUG9vbCwgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyT2lkYyB9IGZyb20gJy4uL2xpYic7XG5cbi8qXG4gKiBTdGFjayB2ZXJpZmljYXRpb24gc3RlcHNcbiAqICogVmlzaXQgdGhlIFVSTCBwcm92aWRlZCBieSBzdGFjayBvdXRwdXQgJ1NpZ25JbkxpbmsnIGluIGEgYnJvd3NlciwgYW5kIHZlcmlmeSB0aGUgJ2Nkaycgc2lnbiBpbiBsaW5rIHNob3dzIHVwLlxuICovXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdpbnRlZy11c2VyLXBvb2wtaWRwLWdvb2dsZScpO1xuXG5jb25zdCB1c2VycG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ3Bvb2wnLCB7XG4gIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbn0pO1xuXG5uZXcgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyT2lkYyhzdGFjaywgJ2NkaycsIHtcbiAgdXNlclBvb2w6IHVzZXJwb29sLFxuICBuYW1lOiAnY2RrJyxcbiAgY2xpZW50SWQ6ICdjbGllbnQtaWQnLFxuICBjbGllbnRTZWNyZXQ6ICdjbGllbnQtc2VjcmV0JyxcbiAgaXNzdWVyVXJsOiAnaHR0cHM6Ly93d3cuaXNzdWVyLXVybC5jb20nLFxuICBlbmRwb2ludHM6IHtcbiAgICBhdXRob3JpemF0aW9uOiAnaHR0cHM6Ly93d3cuaXNzdWVyLXVybC5jb20vYXV0aG9yaXplJyxcbiAgICB0b2tlbjogJ2h0dHBzOi8vd3d3Lmlzc3Vlci11cmwuY29tL3Rva2VuJyxcbiAgICB1c2VySW5mbzogJ2h0dHBzOi8vd3d3Lmlzc3Vlci11cmwuY29tL3VzZXJpbmZvJyxcbiAgICBqd2tzVXJpOiAnaHR0cHM6Ly93d3cuaXNzdWVyLXVybC5jb20vandrcycsXG4gIH0sXG4gIHNjb3BlczogWydvcGVuaWQnLCAncGhvbmUnXSxcbiAgYXR0cmlidXRlTWFwcGluZzoge1xuICAgIHBob25lTnVtYmVyOiBQcm92aWRlckF0dHJpYnV0ZS5vdGhlcigncGhvbmVfbnVtYmVyJyksXG4gIH0sXG59KTtcblxuY29uc3QgY2xpZW50ID0gdXNlcnBvb2wuYWRkQ2xpZW50KCdjbGllbnQnKTtcblxuY29uc3QgZG9tYWluID0gdXNlcnBvb2wuYWRkRG9tYWluKCdkb21haW4nLCB7XG4gIGNvZ25pdG9Eb21haW46IHtcbiAgICBkb21haW5QcmVmaXg6ICdjZGstdGVzdC1wb29sJyxcbiAgfSxcbn0pO1xuXG5uZXcgQ2ZuT3V0cHV0KHN0YWNrLCAnU2lnbkluTGluaycsIHtcbiAgdmFsdWU6IGRvbWFpbi5zaWduSW5VcmwoY2xpZW50LCB7XG4gICAgcmVkaXJlY3RVcmk6ICdodHRwczovL2V4YW1wbGUuY29tJyxcbiAgfSksXG59KTtcbiJdfQ==