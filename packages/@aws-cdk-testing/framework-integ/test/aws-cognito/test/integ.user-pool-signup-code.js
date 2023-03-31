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
 * * An email with the message 'integ-test: Account verification code is <code>' should be received.
 * * An SMS with the message 'integ-test: Account verification code is <code>' should be received.
 */
const app = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(app, 'integ-user-pool-signup-code');
const userpool = new aws_cognito_1.UserPool(stack, 'myuserpool', {
    removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
    userPoolName: 'MyUserPool',
    autoVerify: {
        email: true,
        phone: true,
    },
    selfSignUpEnabled: true,
    userVerification: {
        emailStyle: aws_cognito_1.VerificationEmailStyle.CODE,
        emailSubject: 'integ-test: Verify your account',
        emailBody: 'integ-test: Account verification code is {####}',
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
new aws_cdk_lib_1.CfnOutput(stack, 'user-pool-id', {
    value: userpool.userPoolId,
});
new aws_cdk_lib_1.CfnOutput(stack, 'client-id', {
    value: client.userPoolClientId,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcudXNlci1wb29sLXNpZ251cC1jb2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcudXNlci1wb29sLXNpZ251cC1jb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkNBQW1FO0FBQ25FLHlEQUEyRjtBQUUzRjs7Ozs7Ozs7R0FRRztBQUVILE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksbUJBQUssQ0FBQyxHQUFHLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztBQUU1RCxNQUFNLFFBQVEsR0FBRyxJQUFJLHNCQUFRLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtJQUNqRCxhQUFhLEVBQUUsMkJBQWEsQ0FBQyxPQUFPO0lBQ3BDLFlBQVksRUFBRSxZQUFZO0lBQzFCLFVBQVUsRUFBRTtRQUNWLEtBQUssRUFBRSxJQUFJO1FBQ1gsS0FBSyxFQUFFLElBQUk7S0FDWjtJQUNELGlCQUFpQixFQUFFLElBQUk7SUFDdkIsZ0JBQWdCLEVBQUU7UUFDaEIsVUFBVSxFQUFFLG9DQUFzQixDQUFDLElBQUk7UUFDdkMsWUFBWSxFQUFFLGlDQUFpQztRQUMvQyxTQUFTLEVBQUUsaURBQWlEO1FBQzVELFVBQVUsRUFBRSxpREFBaUQ7S0FDOUQ7SUFDRCxjQUFjLEVBQUU7UUFDZCxnQkFBZ0IsRUFBRSxLQUFLO1FBQ3ZCLGdCQUFnQixFQUFFLEtBQUs7UUFDdkIsYUFBYSxFQUFFLEtBQUs7UUFDcEIsY0FBYyxFQUFFLEtBQUs7S0FDdEI7Q0FDRixDQUFDLENBQUM7QUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLDRCQUFjLENBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFFO0lBQzNELFFBQVEsRUFBRSxRQUFRO0lBQ2xCLGtCQUFrQixFQUFFLGFBQWE7SUFDakMsY0FBYyxFQUFFLEtBQUs7Q0FDdEIsQ0FBQyxDQUFDO0FBRUgsSUFBSSx1QkFBUyxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7SUFDbkMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxVQUFVO0NBQzNCLENBQUMsQ0FBQztBQUVILElBQUksdUJBQVMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO0lBQ2hDLEtBQUssRUFBRSxNQUFNLENBQUMsZ0JBQWdCO0NBQy9CLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcCwgQ2ZuT3V0cHV0LCBSZW1vdmFsUG9saWN5LCBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IFVzZXJQb29sLCBVc2VyUG9vbENsaWVudCwgVmVyaWZpY2F0aW9uRW1haWxTdHlsZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2duaXRvJztcblxuLypcbiAqIFN0YWNrIHZlcmlmaWNhdGlvbiBzdGVwczpcbiAqICogYGF3cyBjb2duaXRvLWlkcCBzaWduLXVwIC0tY2xpZW50LWlkIDxjZm5vdXRwdXQtY2xpZW50LWlkPiAtLXVzZXJuYW1lIHVzZXItMSAtLXBhc3N3b3JkIHBhc3MxMjM0IFxcXG4gKiAgIC0tdXNlci1hdHRyaWJ1dGVzIE5hbWU9XCJwaG9uZV9udW1iZXJcIixWYWx1ZT1cIjx2YWxpZC1waG9uZS1udW1iZXItd2l0aC1pbnRsLWV4dGVuc2lvbj5cIlxuICogKiBgYXdzIGNvZ25pdG8taWRwIHNpZ24tdXAgLS1jbGllbnQtaWQgPGNmbm91dHB1dC1jbGllbnQtaWQ+IC0tdXNlcm5hbWUgdXNlci0yIC0tcGFzc3dvcmQgcGFzczEyMzQgXFxcbiAqICAgLS11c2VyLWF0dHJpYnV0ZXMgTmFtZT1cImVtYWlsXCIsVmFsdWU9XCI8dmFsaWQtZW1haWwtYWRkcmVzcz5cIlxuICogKiBBbiBlbWFpbCB3aXRoIHRoZSBtZXNzYWdlICdpbnRlZy10ZXN0OiBBY2NvdW50IHZlcmlmaWNhdGlvbiBjb2RlIGlzIDxjb2RlPicgc2hvdWxkIGJlIHJlY2VpdmVkLlxuICogKiBBbiBTTVMgd2l0aCB0aGUgbWVzc2FnZSAnaW50ZWctdGVzdDogQWNjb3VudCB2ZXJpZmljYXRpb24gY29kZSBpcyA8Y29kZT4nIHNob3VsZCBiZSByZWNlaXZlZC5cbiAqL1xuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdpbnRlZy11c2VyLXBvb2wtc2lnbnVwLWNvZGUnKTtcblxuY29uc3QgdXNlcnBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICdteXVzZXJwb29sJywge1xuICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gIHVzZXJQb29sTmFtZTogJ015VXNlclBvb2wnLFxuICBhdXRvVmVyaWZ5OiB7XG4gICAgZW1haWw6IHRydWUsXG4gICAgcGhvbmU6IHRydWUsXG4gIH0sXG4gIHNlbGZTaWduVXBFbmFibGVkOiB0cnVlLFxuICB1c2VyVmVyaWZpY2F0aW9uOiB7XG4gICAgZW1haWxTdHlsZTogVmVyaWZpY2F0aW9uRW1haWxTdHlsZS5DT0RFLFxuICAgIGVtYWlsU3ViamVjdDogJ2ludGVnLXRlc3Q6IFZlcmlmeSB5b3VyIGFjY291bnQnLFxuICAgIGVtYWlsQm9keTogJ2ludGVnLXRlc3Q6IEFjY291bnQgdmVyaWZpY2F0aW9uIGNvZGUgaXMgeyMjIyN9JyxcbiAgICBzbXNNZXNzYWdlOiAnaW50ZWctdGVzdDogQWNjb3VudCB2ZXJpZmljYXRpb24gY29kZSBpcyB7IyMjI30nLFxuICB9LFxuICBwYXNzd29yZFBvbGljeToge1xuICAgIHJlcXVpcmVVcHBlcmNhc2U6IGZhbHNlLFxuICAgIHJlcXVpcmVMb3dlcmNhc2U6IGZhbHNlLFxuICAgIHJlcXVpcmVEaWdpdHM6IGZhbHNlLFxuICAgIHJlcXVpcmVTeW1ib2xzOiBmYWxzZSxcbiAgfSxcbn0pO1xuXG5jb25zdCBjbGllbnQgPSBuZXcgVXNlclBvb2xDbGllbnQoc3RhY2ssICdteXVzZXJwb29sY2xpZW50Jywge1xuICB1c2VyUG9vbDogdXNlcnBvb2wsXG4gIHVzZXJQb29sQ2xpZW50TmFtZTogJ3NpZ251cC10ZXN0JyxcbiAgZ2VuZXJhdGVTZWNyZXQ6IGZhbHNlLFxufSk7XG5cbm5ldyBDZm5PdXRwdXQoc3RhY2ssICd1c2VyLXBvb2wtaWQnLCB7XG4gIHZhbHVlOiB1c2VycG9vbC51c2VyUG9vbElkLFxufSk7XG5cbm5ldyBDZm5PdXRwdXQoc3RhY2ssICdjbGllbnQtaWQnLCB7XG4gIHZhbHVlOiBjbGllbnQudXNlclBvb2xDbGllbnRJZCxcbn0pOyJdfQ==