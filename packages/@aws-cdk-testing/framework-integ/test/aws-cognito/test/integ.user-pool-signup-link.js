"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_cognito_1 = require("aws-cdk-lib/aws-cognito");
/*
 * Stack verification steps:
 * * `aws cognito-idp sign-up --client-id <cfnoutput-client-id> --username user-1 --password pass1234 \
 *   --user-attributes Name="phone_number",Value="<valid-phone-number-with-intl-extension>"
 * * `aws cognito-idp sign-up --client-id <cfnoutput-client-id> --username user-2 --password pass1234 \
 *   --user-attributes Name="email",Value="<valid-email-address>"
 * * An email with the message 'integ-test: Verify by clicking on <link>' should be received.
 * * An SMS with the message 'integ-test: Account verification code is <code>' should be received.
 */
const app = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(app, 'integ-user-pool-signup-link');
const userpool = new aws_cognito_1.UserPool(stack, 'myuserpool', {
    removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
    userPoolName: 'MyUserPool',
    autoVerify: {
        email: true,
        phone: true,
    },
    selfSignUpEnabled: true,
    userVerification: {
        emailStyle: aws_cognito_1.VerificationEmailStyle.LINK,
        emailSubject: 'integ-test: Verify your account',
        emailBody: 'integ-test: Verify by clicking on {##Verify Email##}',
        smsMessage: 'integ-test: Account verification code is {####}',
    },
    passwordPolicy: {
        requireUppercase: false,
        requireLowercase: false,
        requireDigits: false,
        requireSymbols: false,
    },
});
const client = new aws_cognito_1.UserPoolClient(stack, 'myuserpoolclient', {
    userPool: userpool,
    userPoolClientName: 'signup-test',
    generateSecret: false,
});
userpool.addDomain('myuserpooldomain', {
    cognitoDomain: {
        domainPrefix: 'integ-user-pool-signup-link',
    },
});
new aws_cdk_lib_1.CfnOutput(stack, 'user-pool-id', {
    value: userpool.userPoolId,
});
new aws_cdk_lib_1.CfnOutput(stack, 'client-id', {
    value: client.userPoolClientId,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcudXNlci1wb29sLXNpZ251cC1saW5rLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcudXNlci1wb29sLXNpZ251cC1saW5rLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkNBQW1FO0FBQ25FLHlEQUEyRjtBQUUzRjs7Ozs7Ozs7R0FRRztBQUVILE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksbUJBQUssQ0FBQyxHQUFHLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztBQUU1RCxNQUFNLFFBQVEsR0FBRyxJQUFJLHNCQUFRLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtJQUNqRCxhQUFhLEVBQUUsMkJBQWEsQ0FBQyxPQUFPO0lBQ3BDLFlBQVksRUFBRSxZQUFZO0lBQzFCLFVBQVUsRUFBRTtRQUNWLEtBQUssRUFBRSxJQUFJO1FBQ1gsS0FBSyxFQUFFLElBQUk7S0FDWjtJQUNELGlCQUFpQixFQUFFLElBQUk7SUFDdkIsZ0JBQWdCLEVBQUU7UUFDaEIsVUFBVSxFQUFFLG9DQUFzQixDQUFDLElBQUk7UUFDdkMsWUFBWSxFQUFFLGlDQUFpQztRQUMvQyxTQUFTLEVBQUUsc0RBQXNEO1FBQ2pFLFVBQVUsRUFBRSxpREFBaUQ7S0FDOUQ7SUFDRCxjQUFjLEVBQUU7UUFDZCxnQkFBZ0IsRUFBRSxLQUFLO1FBQ3ZCLGdCQUFnQixFQUFFLEtBQUs7UUFDdkIsYUFBYSxFQUFFLEtBQUs7UUFDcEIsY0FBYyxFQUFFLEtBQUs7S0FDdEI7Q0FDRixDQUFDLENBQUM7QUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLDRCQUFjLENBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFFO0lBQzNELFFBQVEsRUFBRSxRQUFRO0lBQ2xCLGtCQUFrQixFQUFFLGFBQWE7SUFDakMsY0FBYyxFQUFFLEtBQUs7Q0FDdEIsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsRUFBRTtJQUNyQyxhQUFhLEVBQUU7UUFDYixZQUFZLEVBQUUsNkJBQTZCO0tBQzVDO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsSUFBSSx1QkFBUyxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7SUFDbkMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxVQUFVO0NBQzNCLENBQUMsQ0FBQztBQUVILElBQUksdUJBQVMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO0lBQ2hDLEtBQUssRUFBRSxNQUFNLENBQUMsZ0JBQWdCO0NBQy9CLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcCwgQ2ZuT3V0cHV0LCBSZW1vdmFsUG9saWN5LCBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IFVzZXJQb29sLCBVc2VyUG9vbENsaWVudCwgVmVyaWZpY2F0aW9uRW1haWxTdHlsZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2duaXRvJztcblxuLypcbiAqIFN0YWNrIHZlcmlmaWNhdGlvbiBzdGVwczpcbiAqICogYGF3cyBjb2duaXRvLWlkcCBzaWduLXVwIC0tY2xpZW50LWlkIDxjZm5vdXRwdXQtY2xpZW50LWlkPiAtLXVzZXJuYW1lIHVzZXItMSAtLXBhc3N3b3JkIHBhc3MxMjM0IFxcXG4gKiAgIC0tdXNlci1hdHRyaWJ1dGVzIE5hbWU9XCJwaG9uZV9udW1iZXJcIixWYWx1ZT1cIjx2YWxpZC1waG9uZS1udW1iZXItd2l0aC1pbnRsLWV4dGVuc2lvbj5cIlxuICogKiBgYXdzIGNvZ25pdG8taWRwIHNpZ24tdXAgLS1jbGllbnQtaWQgPGNmbm91dHB1dC1jbGllbnQtaWQ+IC0tdXNlcm5hbWUgdXNlci0yIC0tcGFzc3dvcmQgcGFzczEyMzQgXFxcbiAqICAgLS11c2VyLWF0dHJpYnV0ZXMgTmFtZT1cImVtYWlsXCIsVmFsdWU9XCI8dmFsaWQtZW1haWwtYWRkcmVzcz5cIlxuICogKiBBbiBlbWFpbCB3aXRoIHRoZSBtZXNzYWdlICdpbnRlZy10ZXN0OiBWZXJpZnkgYnkgY2xpY2tpbmcgb24gPGxpbms+JyBzaG91bGQgYmUgcmVjZWl2ZWQuXG4gKiAqIEFuIFNNUyB3aXRoIHRoZSBtZXNzYWdlICdpbnRlZy10ZXN0OiBBY2NvdW50IHZlcmlmaWNhdGlvbiBjb2RlIGlzIDxjb2RlPicgc2hvdWxkIGJlIHJlY2VpdmVkLlxuICovXG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ2ludGVnLXVzZXItcG9vbC1zaWdudXAtbGluaycpO1xuXG5jb25zdCB1c2VycG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ215dXNlcnBvb2wnLCB7XG4gIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgdXNlclBvb2xOYW1lOiAnTXlVc2VyUG9vbCcsXG4gIGF1dG9WZXJpZnk6IHtcbiAgICBlbWFpbDogdHJ1ZSxcbiAgICBwaG9uZTogdHJ1ZSxcbiAgfSxcbiAgc2VsZlNpZ25VcEVuYWJsZWQ6IHRydWUsXG4gIHVzZXJWZXJpZmljYXRpb246IHtcbiAgICBlbWFpbFN0eWxlOiBWZXJpZmljYXRpb25FbWFpbFN0eWxlLkxJTkssXG4gICAgZW1haWxTdWJqZWN0OiAnaW50ZWctdGVzdDogVmVyaWZ5IHlvdXIgYWNjb3VudCcsXG4gICAgZW1haWxCb2R5OiAnaW50ZWctdGVzdDogVmVyaWZ5IGJ5IGNsaWNraW5nIG9uIHsjI1ZlcmlmeSBFbWFpbCMjfScsXG4gICAgc21zTWVzc2FnZTogJ2ludGVnLXRlc3Q6IEFjY291bnQgdmVyaWZpY2F0aW9uIGNvZGUgaXMgeyMjIyN9JyxcbiAgfSxcbiAgcGFzc3dvcmRQb2xpY3k6IHtcbiAgICByZXF1aXJlVXBwZXJjYXNlOiBmYWxzZSxcbiAgICByZXF1aXJlTG93ZXJjYXNlOiBmYWxzZSxcbiAgICByZXF1aXJlRGlnaXRzOiBmYWxzZSxcbiAgICByZXF1aXJlU3ltYm9sczogZmFsc2UsXG4gIH0sXG59KTtcblxuY29uc3QgY2xpZW50ID0gbmV3IFVzZXJQb29sQ2xpZW50KHN0YWNrLCAnbXl1c2VycG9vbGNsaWVudCcsIHtcbiAgdXNlclBvb2w6IHVzZXJwb29sLFxuICB1c2VyUG9vbENsaWVudE5hbWU6ICdzaWdudXAtdGVzdCcsXG4gIGdlbmVyYXRlU2VjcmV0OiBmYWxzZSxcbn0pO1xuXG51c2VycG9vbC5hZGREb21haW4oJ215dXNlcnBvb2xkb21haW4nLCB7XG4gIGNvZ25pdG9Eb21haW46IHtcbiAgICBkb21haW5QcmVmaXg6ICdpbnRlZy11c2VyLXBvb2wtc2lnbnVwLWxpbmsnLFxuICB9LFxufSk7XG5cbm5ldyBDZm5PdXRwdXQoc3RhY2ssICd1c2VyLXBvb2wtaWQnLCB7XG4gIHZhbHVlOiB1c2VycG9vbC51c2VyUG9vbElkLFxufSk7XG5cbm5ldyBDZm5PdXRwdXQoc3RhY2ssICdjbGllbnQtaWQnLCB7XG4gIHZhbHVlOiBjbGllbnQudXNlclBvb2xDbGllbnRJZCxcbn0pOyJdfQ==