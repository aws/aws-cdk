"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_cognito_1 = require("aws-cdk-lib/aws-cognito");
const app = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(app, 'integ-user-pool');
const userpool = new aws_cognito_1.UserPool(stack, 'myuserpool', {
    removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
    userPoolName: 'MyUserPool',
    userInvitation: {
        emailSubject: 'invitation email subject from the integ test',
        emailBody: 'invitation email body from the integ test for {username}. Temp password is {####}.',
        smsMessage: 'invitation sms message from the integ test for {username}. Temp password is {####}.',
    },
    selfSignUpEnabled: true,
    userVerification: {
        emailBody: 'verification email body from the integ test. Code is {####}.',
        emailSubject: 'verification email subject from the integ test',
        smsMessage: 'verification sms message from the integ test. Code is {####}.',
    },
    signInAliases: {
        username: true,
        email: true,
    },
    autoVerify: {
        email: true,
        phone: true,
    },
    keepOriginal: {
        email: true,
        phone: true,
    },
    standardAttributes: {
        fullname: {
            required: true,
            mutable: true,
        },
        email: {
            required: true,
        },
    },
    customAttributes: {
        'some-string-attr': new aws_cognito_1.StringAttribute(),
        'another-string-attr': new aws_cognito_1.StringAttribute({ minLen: 4, maxLen: 100 }),
        'some-number-attr': new aws_cognito_1.NumberAttribute(),
        'another-number-attr': new aws_cognito_1.NumberAttribute({ min: 10, max: 50 }),
        'some-boolean-attr': new aws_cognito_1.BooleanAttribute(),
        'some-datetime-attr': new aws_cognito_1.DateTimeAttribute(),
    },
    mfa: aws_cognito_1.Mfa.OFF,
    mfaSecondFactor: {
        sms: true,
        otp: true,
    },
    passwordPolicy: {
        tempPasswordValidity: aws_cdk_lib_1.Duration.days(10),
        minLength: 12,
        requireDigits: true,
        requireLowercase: true,
        requireUppercase: true,
        requireSymbols: true,
    },
    lambdaTriggers: {
        createAuthChallenge: dummyTrigger('createAuthChallenge'),
        customMessage: dummyTrigger('customMessage'),
        defineAuthChallenge: dummyTrigger('defineAuthChallenge'),
        postAuthentication: dummyTrigger('postAuthentication'),
        postConfirmation: dummyTrigger('postConfirmation'),
        preAuthentication: dummyTrigger('preAuthentication'),
        preSignUp: dummyTrigger('preSignUp'),
        preTokenGeneration: dummyTrigger('preTokenGeneration'),
        userMigration: dummyTrigger('userMigration'),
        verifyAuthChallengeResponse: dummyTrigger('verifyAuthChallengeResponse'),
    },
    advancedSecurityMode: aws_cognito_1.AdvancedSecurityMode.ENFORCED,
    snsRegion: aws_cdk_lib_1.Stack.of(stack).region,
});
const cognitoDomain = userpool.addDomain('myuserpooldomain', {
    cognitoDomain: {
        domainPrefix: 'cdkintegrationtestuserpoolexplicitprops',
    },
});
new aws_cdk_lib_1.CfnOutput(stack, 'userpoolId', {
    value: userpool.userPoolId,
});
new aws_cdk_lib_1.CfnOutput(stack, 'cognitoDomainName', {
    value: `${cognitoDomain.domainName}.auth.${stack.region}.amazoncognito.com`,
});
function dummyTrigger(name) {
    return new aws_lambda_1.Function(stack, name, {
        functionName: name,
        handler: 'index.handler',
        runtime: aws_lambda_1.Runtime.NODEJS_14_X,
        code: aws_lambda_1.Code.fromInline('foo'),
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcudXNlci1wb29sLWV4cGxpY2l0LXByb3BzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcudXNlci1wb29sLWV4cGxpY2l0LXByb3BzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdURBQTRFO0FBQzVFLDZDQUE2RTtBQUM3RSx5REFBcUo7QUFFckosTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxtQkFBSyxDQUFDLEdBQUcsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0FBRWhELE1BQU0sUUFBUSxHQUFHLElBQUksc0JBQVEsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO0lBQ2pELGFBQWEsRUFBRSwyQkFBYSxDQUFDLE9BQU87SUFDcEMsWUFBWSxFQUFFLFlBQVk7SUFDMUIsY0FBYyxFQUFFO1FBQ2QsWUFBWSxFQUFFLDhDQUE4QztRQUM1RCxTQUFTLEVBQUUsb0ZBQW9GO1FBQy9GLFVBQVUsRUFBRSxxRkFBcUY7S0FDbEc7SUFDRCxpQkFBaUIsRUFBRSxJQUFJO0lBQ3ZCLGdCQUFnQixFQUFFO1FBQ2hCLFNBQVMsRUFBRSw4REFBOEQ7UUFDekUsWUFBWSxFQUFFLGdEQUFnRDtRQUM5RCxVQUFVLEVBQUUsK0RBQStEO0tBQzVFO0lBQ0QsYUFBYSxFQUFFO1FBQ2IsUUFBUSxFQUFFLElBQUk7UUFDZCxLQUFLLEVBQUUsSUFBSTtLQUNaO0lBQ0QsVUFBVSxFQUFFO1FBQ1YsS0FBSyxFQUFFLElBQUk7UUFDWCxLQUFLLEVBQUUsSUFBSTtLQUNaO0lBQ0QsWUFBWSxFQUFFO1FBQ1osS0FBSyxFQUFFLElBQUk7UUFDWCxLQUFLLEVBQUUsSUFBSTtLQUNaO0lBQ0Qsa0JBQWtCLEVBQUU7UUFDbEIsUUFBUSxFQUFFO1lBQ1IsUUFBUSxFQUFFLElBQUk7WUFDZCxPQUFPLEVBQUUsSUFBSTtTQUNkO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsUUFBUSxFQUFFLElBQUk7U0FDZjtLQUNGO0lBQ0QsZ0JBQWdCLEVBQUU7UUFDaEIsa0JBQWtCLEVBQUUsSUFBSSw2QkFBZSxFQUFFO1FBQ3pDLHFCQUFxQixFQUFFLElBQUksNkJBQWUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ3RFLGtCQUFrQixFQUFFLElBQUksNkJBQWUsRUFBRTtRQUN6QyxxQkFBcUIsRUFBRSxJQUFJLDZCQUFlLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQztRQUNoRSxtQkFBbUIsRUFBRSxJQUFJLDhCQUFnQixFQUFFO1FBQzNDLG9CQUFvQixFQUFFLElBQUksK0JBQWlCLEVBQUU7S0FDOUM7SUFDRCxHQUFHLEVBQUUsaUJBQUcsQ0FBQyxHQUFHO0lBQ1osZUFBZSxFQUFFO1FBQ2YsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsSUFBSTtLQUNWO0lBQ0QsY0FBYyxFQUFFO1FBQ2Qsb0JBQW9CLEVBQUUsc0JBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ3ZDLFNBQVMsRUFBRSxFQUFFO1FBQ2IsYUFBYSxFQUFFLElBQUk7UUFDbkIsZ0JBQWdCLEVBQUUsSUFBSTtRQUN0QixnQkFBZ0IsRUFBRSxJQUFJO1FBQ3RCLGNBQWMsRUFBRSxJQUFJO0tBQ3JCO0lBQ0QsY0FBYyxFQUFFO1FBQ2QsbUJBQW1CLEVBQUUsWUFBWSxDQUFDLHFCQUFxQixDQUFDO1FBQ3hELGFBQWEsRUFBRSxZQUFZLENBQUMsZUFBZSxDQUFDO1FBQzVDLG1CQUFtQixFQUFFLFlBQVksQ0FBQyxxQkFBcUIsQ0FBQztRQUN4RCxrQkFBa0IsRUFBRSxZQUFZLENBQUMsb0JBQW9CLENBQUM7UUFDdEQsZ0JBQWdCLEVBQUUsWUFBWSxDQUFDLGtCQUFrQixDQUFDO1FBQ2xELGlCQUFpQixFQUFFLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQztRQUNwRCxTQUFTLEVBQUUsWUFBWSxDQUFDLFdBQVcsQ0FBQztRQUNwQyxrQkFBa0IsRUFBRSxZQUFZLENBQUMsb0JBQW9CLENBQUM7UUFDdEQsYUFBYSxFQUFFLFlBQVksQ0FBQyxlQUFlLENBQUM7UUFDNUMsMkJBQTJCLEVBQUUsWUFBWSxDQUFDLDZCQUE2QixDQUFDO0tBQ3pFO0lBQ0Qsb0JBQW9CLEVBQUUsa0NBQW9CLENBQUMsUUFBUTtJQUNuRCxTQUFTLEVBQUUsbUJBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTTtDQUNsQyxDQUFDLENBQUM7QUFFSCxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLGtCQUFrQixFQUFFO0lBQzNELGFBQWEsRUFBRTtRQUNiLFlBQVksRUFBRSx5Q0FBeUM7S0FDeEQ7Q0FDRixDQUFDLENBQUM7QUFFSCxJQUFJLHVCQUFTLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtJQUNqQyxLQUFLLEVBQUUsUUFBUSxDQUFDLFVBQVU7Q0FDM0IsQ0FBQyxDQUFDO0FBRUgsSUFBSSx1QkFBUyxDQUFDLEtBQUssRUFBRSxtQkFBbUIsRUFBRTtJQUN4QyxLQUFLLEVBQUUsR0FBRyxhQUFhLENBQUMsVUFBVSxTQUFTLEtBQUssQ0FBQyxNQUFNLG9CQUFvQjtDQUM1RSxDQUFDLENBQUM7QUFFSCxTQUFTLFlBQVksQ0FBQyxJQUFZO0lBQ2hDLE9BQU8sSUFBSSxxQkFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUU7UUFDL0IsWUFBWSxFQUFFLElBQUk7UUFDbEIsT0FBTyxFQUFFLGVBQWU7UUFDeEIsT0FBTyxFQUFFLG9CQUFPLENBQUMsV0FBVztRQUM1QixJQUFJLEVBQUUsaUJBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO0tBQzdCLENBQUMsQ0FBQztBQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb2RlLCBGdW5jdGlvbiwgSUZ1bmN0aW9uLCBSdW50aW1lIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgeyBBcHAsIENmbk91dHB1dCwgRHVyYXRpb24sIFJlbW92YWxQb2xpY3ksIFN0YWNrIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQWR2YW5jZWRTZWN1cml0eU1vZGUsIEJvb2xlYW5BdHRyaWJ1dGUsIERhdGVUaW1lQXR0cmlidXRlLCBNZmEsIE51bWJlckF0dHJpYnV0ZSwgU3RyaW5nQXR0cmlidXRlLCBVc2VyUG9vbCB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2duaXRvJztcblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnaW50ZWctdXNlci1wb29sJyk7XG5cbmNvbnN0IHVzZXJwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAnbXl1c2VycG9vbCcsIHtcbiAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICB1c2VyUG9vbE5hbWU6ICdNeVVzZXJQb29sJyxcbiAgdXNlckludml0YXRpb246IHtcbiAgICBlbWFpbFN1YmplY3Q6ICdpbnZpdGF0aW9uIGVtYWlsIHN1YmplY3QgZnJvbSB0aGUgaW50ZWcgdGVzdCcsXG4gICAgZW1haWxCb2R5OiAnaW52aXRhdGlvbiBlbWFpbCBib2R5IGZyb20gdGhlIGludGVnIHRlc3QgZm9yIHt1c2VybmFtZX0uIFRlbXAgcGFzc3dvcmQgaXMgeyMjIyN9LicsXG4gICAgc21zTWVzc2FnZTogJ2ludml0YXRpb24gc21zIG1lc3NhZ2UgZnJvbSB0aGUgaW50ZWcgdGVzdCBmb3Ige3VzZXJuYW1lfS4gVGVtcCBwYXNzd29yZCBpcyB7IyMjI30uJyxcbiAgfSxcbiAgc2VsZlNpZ25VcEVuYWJsZWQ6IHRydWUsXG4gIHVzZXJWZXJpZmljYXRpb246IHtcbiAgICBlbWFpbEJvZHk6ICd2ZXJpZmljYXRpb24gZW1haWwgYm9keSBmcm9tIHRoZSBpbnRlZyB0ZXN0LiBDb2RlIGlzIHsjIyMjfS4nLFxuICAgIGVtYWlsU3ViamVjdDogJ3ZlcmlmaWNhdGlvbiBlbWFpbCBzdWJqZWN0IGZyb20gdGhlIGludGVnIHRlc3QnLFxuICAgIHNtc01lc3NhZ2U6ICd2ZXJpZmljYXRpb24gc21zIG1lc3NhZ2UgZnJvbSB0aGUgaW50ZWcgdGVzdC4gQ29kZSBpcyB7IyMjI30uJyxcbiAgfSxcbiAgc2lnbkluQWxpYXNlczoge1xuICAgIHVzZXJuYW1lOiB0cnVlLFxuICAgIGVtYWlsOiB0cnVlLFxuICB9LFxuICBhdXRvVmVyaWZ5OiB7XG4gICAgZW1haWw6IHRydWUsXG4gICAgcGhvbmU6IHRydWUsXG4gIH0sXG4gIGtlZXBPcmlnaW5hbDoge1xuICAgIGVtYWlsOiB0cnVlLFxuICAgIHBob25lOiB0cnVlLFxuICB9LFxuICBzdGFuZGFyZEF0dHJpYnV0ZXM6IHtcbiAgICBmdWxsbmFtZToge1xuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBtdXRhYmxlOiB0cnVlLFxuICAgIH0sXG4gICAgZW1haWw6IHtcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgIH0sXG4gIH0sXG4gIGN1c3RvbUF0dHJpYnV0ZXM6IHtcbiAgICAnc29tZS1zdHJpbmctYXR0cic6IG5ldyBTdHJpbmdBdHRyaWJ1dGUoKSxcbiAgICAnYW5vdGhlci1zdHJpbmctYXR0cic6IG5ldyBTdHJpbmdBdHRyaWJ1dGUoeyBtaW5MZW46IDQsIG1heExlbjogMTAwIH0pLFxuICAgICdzb21lLW51bWJlci1hdHRyJzogbmV3IE51bWJlckF0dHJpYnV0ZSgpLFxuICAgICdhbm90aGVyLW51bWJlci1hdHRyJzogbmV3IE51bWJlckF0dHJpYnV0ZSh7IG1pbjogMTAsIG1heDogNTAgfSksXG4gICAgJ3NvbWUtYm9vbGVhbi1hdHRyJzogbmV3IEJvb2xlYW5BdHRyaWJ1dGUoKSxcbiAgICAnc29tZS1kYXRldGltZS1hdHRyJzogbmV3IERhdGVUaW1lQXR0cmlidXRlKCksXG4gIH0sXG4gIG1mYTogTWZhLk9GRixcbiAgbWZhU2Vjb25kRmFjdG9yOiB7XG4gICAgc21zOiB0cnVlLFxuICAgIG90cDogdHJ1ZSxcbiAgfSxcbiAgcGFzc3dvcmRQb2xpY3k6IHtcbiAgICB0ZW1wUGFzc3dvcmRWYWxpZGl0eTogRHVyYXRpb24uZGF5cygxMCksXG4gICAgbWluTGVuZ3RoOiAxMixcbiAgICByZXF1aXJlRGlnaXRzOiB0cnVlLFxuICAgIHJlcXVpcmVMb3dlcmNhc2U6IHRydWUsXG4gICAgcmVxdWlyZVVwcGVyY2FzZTogdHJ1ZSxcbiAgICByZXF1aXJlU3ltYm9sczogdHJ1ZSxcbiAgfSxcbiAgbGFtYmRhVHJpZ2dlcnM6IHtcbiAgICBjcmVhdGVBdXRoQ2hhbGxlbmdlOiBkdW1teVRyaWdnZXIoJ2NyZWF0ZUF1dGhDaGFsbGVuZ2UnKSxcbiAgICBjdXN0b21NZXNzYWdlOiBkdW1teVRyaWdnZXIoJ2N1c3RvbU1lc3NhZ2UnKSxcbiAgICBkZWZpbmVBdXRoQ2hhbGxlbmdlOiBkdW1teVRyaWdnZXIoJ2RlZmluZUF1dGhDaGFsbGVuZ2UnKSxcbiAgICBwb3N0QXV0aGVudGljYXRpb246IGR1bW15VHJpZ2dlcigncG9zdEF1dGhlbnRpY2F0aW9uJyksXG4gICAgcG9zdENvbmZpcm1hdGlvbjogZHVtbXlUcmlnZ2VyKCdwb3N0Q29uZmlybWF0aW9uJyksXG4gICAgcHJlQXV0aGVudGljYXRpb246IGR1bW15VHJpZ2dlcigncHJlQXV0aGVudGljYXRpb24nKSxcbiAgICBwcmVTaWduVXA6IGR1bW15VHJpZ2dlcigncHJlU2lnblVwJyksXG4gICAgcHJlVG9rZW5HZW5lcmF0aW9uOiBkdW1teVRyaWdnZXIoJ3ByZVRva2VuR2VuZXJhdGlvbicpLFxuICAgIHVzZXJNaWdyYXRpb246IGR1bW15VHJpZ2dlcigndXNlck1pZ3JhdGlvbicpLFxuICAgIHZlcmlmeUF1dGhDaGFsbGVuZ2VSZXNwb25zZTogZHVtbXlUcmlnZ2VyKCd2ZXJpZnlBdXRoQ2hhbGxlbmdlUmVzcG9uc2UnKSxcbiAgfSxcbiAgYWR2YW5jZWRTZWN1cml0eU1vZGU6IEFkdmFuY2VkU2VjdXJpdHlNb2RlLkVORk9SQ0VELFxuICBzbnNSZWdpb246IFN0YWNrLm9mKHN0YWNrKS5yZWdpb24sXG59KTtcblxuY29uc3QgY29nbml0b0RvbWFpbiA9IHVzZXJwb29sLmFkZERvbWFpbignbXl1c2VycG9vbGRvbWFpbicsIHtcbiAgY29nbml0b0RvbWFpbjoge1xuICAgIGRvbWFpblByZWZpeDogJ2Nka2ludGVncmF0aW9udGVzdHVzZXJwb29sZXhwbGljaXRwcm9wcycsXG4gIH0sXG59KTtcblxubmV3IENmbk91dHB1dChzdGFjaywgJ3VzZXJwb29sSWQnLCB7XG4gIHZhbHVlOiB1c2VycG9vbC51c2VyUG9vbElkLFxufSk7XG5cbm5ldyBDZm5PdXRwdXQoc3RhY2ssICdjb2duaXRvRG9tYWluTmFtZScsIHtcbiAgdmFsdWU6IGAke2NvZ25pdG9Eb21haW4uZG9tYWluTmFtZX0uYXV0aC4ke3N0YWNrLnJlZ2lvbn0uYW1hem9uY29nbml0by5jb21gLFxufSk7XG5cbmZ1bmN0aW9uIGR1bW15VHJpZ2dlcihuYW1lOiBzdHJpbmcpOiBJRnVuY3Rpb24ge1xuICByZXR1cm4gbmV3IEZ1bmN0aW9uKHN0YWNrLCBuYW1lLCB7XG4gICAgZnVuY3Rpb25OYW1lOiBuYW1lLFxuICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICBydW50aW1lOiBSdW50aW1lLk5PREVKU18xNF9YLFxuICAgIGNvZGU6IENvZGUuZnJvbUlubGluZSgnZm9vJyksXG4gIH0pO1xufVxuIl19