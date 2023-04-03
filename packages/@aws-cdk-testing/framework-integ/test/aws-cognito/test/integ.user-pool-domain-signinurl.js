"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_cognito_1 = require("aws-cdk-lib/aws-cognito");
/*
 * Stack verification steps:
 * * Run the command `curl -sS -D - '<stack output SignInUrl>' -o /dev/null` should return HTTP/2 200.
 * * It didn't work if it returns 302 or 400.
 */
const app = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(app, 'integ-user-pool-domain-signinurl');
const userpool = new aws_cognito_1.UserPool(stack, 'UserPool', {
    removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
});
const domain = userpool.addDomain('Domain', {
    cognitoDomain: {
        domainPrefix: 'cdk-integ-user-pool-domain',
    },
});
const client = userpool.addClient('UserPoolClient', {
    oAuth: {
        callbackUrls: ['https://example.com'],
    },
});
new aws_cdk_lib_1.CfnOutput(stack, 'SignInUrl', {
    value: domain.signInUrl(client, {
        redirectUri: 'https://example.com',
    }),
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcudXNlci1wb29sLWRvbWFpbi1zaWduaW51cmwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy51c2VyLXBvb2wtZG9tYWluLXNpZ25pbnVybC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUFtRTtBQUNuRSx5REFBbUQ7QUFFbkQ7Ozs7R0FJRztBQUVILE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksbUJBQUssQ0FBQyxHQUFHLEVBQUUsa0NBQWtDLENBQUMsQ0FBQztBQUVqRSxNQUFNLFFBQVEsR0FBRyxJQUFJLHNCQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtJQUMvQyxhQUFhLEVBQUUsMkJBQWEsQ0FBQyxPQUFPO0NBQ3JDLENBQUMsQ0FBQztBQUVILE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFO0lBQzFDLGFBQWEsRUFBRTtRQUNiLFlBQVksRUFBRSw0QkFBNEI7S0FDM0M7Q0FDRixDQUFDLENBQUM7QUFFSCxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLGdCQUFnQixFQUFFO0lBQ2xELEtBQUssRUFBRTtRQUNMLFlBQVksRUFBRSxDQUFDLHFCQUFxQixDQUFDO0tBQ3RDO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsSUFBSSx1QkFBUyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUU7SUFDaEMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO1FBQzlCLFdBQVcsRUFBRSxxQkFBcUI7S0FDbkMsQ0FBQztDQUNILENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcCwgQ2ZuT3V0cHV0LCBSZW1vdmFsUG9saWN5LCBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IFVzZXJQb29sIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZ25pdG8nO1xuXG4vKlxuICogU3RhY2sgdmVyaWZpY2F0aW9uIHN0ZXBzOlxuICogKiBSdW4gdGhlIGNvbW1hbmQgYGN1cmwgLXNTIC1EIC0gJzxzdGFjayBvdXRwdXQgU2lnbkluVXJsPicgLW8gL2Rldi9udWxsYCBzaG91bGQgcmV0dXJuIEhUVFAvMiAyMDAuXG4gKiAqIEl0IGRpZG4ndCB3b3JrIGlmIGl0IHJldHVybnMgMzAyIG9yIDQwMC5cbiAqL1xuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdpbnRlZy11c2VyLXBvb2wtZG9tYWluLXNpZ25pbnVybCcpO1xuXG5jb25zdCB1c2VycG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ1VzZXJQb29sJywge1xuICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXG59KTtcblxuY29uc3QgZG9tYWluID0gdXNlcnBvb2wuYWRkRG9tYWluKCdEb21haW4nLCB7XG4gIGNvZ25pdG9Eb21haW46IHtcbiAgICBkb21haW5QcmVmaXg6ICdjZGstaW50ZWctdXNlci1wb29sLWRvbWFpbicsXG4gIH0sXG59KTtcblxuY29uc3QgY2xpZW50ID0gdXNlcnBvb2wuYWRkQ2xpZW50KCdVc2VyUG9vbENsaWVudCcsIHtcbiAgb0F1dGg6IHtcbiAgICBjYWxsYmFja1VybHM6IFsnaHR0cHM6Ly9leGFtcGxlLmNvbSddLFxuICB9LFxufSk7XG5cbm5ldyBDZm5PdXRwdXQoc3RhY2ssICdTaWduSW5VcmwnLCB7XG4gIHZhbHVlOiBkb21haW4uc2lnbkluVXJsKGNsaWVudCwge1xuICAgIHJlZGlyZWN0VXJpOiAnaHR0cHM6Ly9leGFtcGxlLmNvbScsXG4gIH0pLFxufSk7Il19