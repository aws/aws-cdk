"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cognito = require("aws-cdk-lib/aws-cognito");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_apigateway_1 = require("aws-cdk-lib/aws-apigateway");
/*
 * Stack verification steps:
 * * 1. Get the IdToken for the created pool by adding user/app-client and using aws cognito-idp:
 * *  a. aws cognito-idp create-user-pool-client --user-pool-id <value> --client-name <value> --no-generate-secret
 * *  b. aws cognito-idp admin-create-user --user-pool-id <value> --username <value> --temporary-password <value>
 * *  c. aws cognito-idp initiate-auth --client-id <value> --auth-flow USER_PASSWORD_AUTH --auth-parameters USERNAME=<value>,PASSWORD=<value>
 * *  d. aws cognito-idp respond-to-auth-challenge --client-id <value> --challenge-name <value> --session <value>
 * *
 * * 2. Verify the stack using above obtained token:
 * *  a. `curl -s -o /dev/null -w "%{http_code}" <url>` should return 401
 * *  b. `curl -s -o /dev/null -w "%{http_code}" -H 'Authorization: <Invalid-IdToken>' <url>` should return 403
 * *  c. `curl -s -o /dev/null -w "%{http_code}" -H 'Authorization: <Valid-IdToken>' <url>` should return 200
 */
const app = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(app, 'CognitoUserPoolsAuthorizerInteg');
const userPool = new cognito.UserPool(stack, 'UserPool');
const authorizer = new aws_apigateway_1.CognitoUserPoolsAuthorizer(stack, 'myauthorizer', {
    cognitoUserPools: [userPool],
});
const restApi = new aws_apigateway_1.RestApi(stack, 'myrestapi', { cloudWatchRole: true });
restApi.root.addMethod('ANY', new aws_apigateway_1.MockIntegration({
    integrationResponses: [
        { statusCode: '200' },
    ],
    passthroughBehavior: aws_apigateway_1.PassthroughBehavior.NEVER,
    requestTemplates: {
        'application/json': '{ "statusCode": 200 }',
    },
}), {
    methodResponses: [
        { statusCode: '200' },
    ],
    authorizer,
    authorizationType: aws_apigateway_1.AuthorizationType.COGNITO,
});
new integ_tests_alpha_1.IntegTest(app, 'cognito-authorizer', {
    testCases: [stack],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY29nbml0by1hdXRob3JpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuY29nbml0by1hdXRob3JpemVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbURBQW1EO0FBQ25ELDZDQUF5QztBQUN6QyxrRUFBdUQ7QUFDdkQsK0RBQTBJO0FBRTFJOzs7Ozs7Ozs7Ozs7R0FZRztBQUVILE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksbUJBQUssQ0FBQyxHQUFHLEVBQUUsaUNBQWlDLENBQUMsQ0FBQztBQUVoRSxNQUFNLFFBQVEsR0FBRyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBRXpELE1BQU0sVUFBVSxHQUFHLElBQUksMkNBQTBCLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRTtJQUN2RSxnQkFBZ0IsRUFBRSxDQUFDLFFBQVEsQ0FBQztDQUM3QixDQUFDLENBQUM7QUFFSCxNQUFNLE9BQU8sR0FBRyxJQUFJLHdCQUFPLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLGdDQUFlLENBQUM7SUFDaEQsb0JBQW9CLEVBQUU7UUFDcEIsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFO0tBQ3RCO0lBQ0QsbUJBQW1CLEVBQUUsb0NBQW1CLENBQUMsS0FBSztJQUM5QyxnQkFBZ0IsRUFBRTtRQUNoQixrQkFBa0IsRUFBRSx1QkFBdUI7S0FDNUM7Q0FDRixDQUFDLEVBQUU7SUFDRixlQUFlLEVBQUU7UUFDZixFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUU7S0FDdEI7SUFDRCxVQUFVO0lBQ1YsaUJBQWlCLEVBQUUsa0NBQWlCLENBQUMsT0FBTztDQUM3QyxDQUFDLENBQUM7QUFFSCxJQUFJLDZCQUFTLENBQUMsR0FBRyxFQUFFLG9CQUFvQixFQUFFO0lBQ3ZDLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztDQUNuQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjb2duaXRvIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2duaXRvJztcbmltcG9ydCB7IEFwcCwgU3RhY2sgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5pbXBvcnQgeyBBdXRob3JpemF0aW9uVHlwZSwgQ29nbml0b1VzZXJQb29sc0F1dGhvcml6ZXIsIE1vY2tJbnRlZ3JhdGlvbiwgUGFzc3Rocm91Z2hCZWhhdmlvciwgUmVzdEFwaSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1hcGlnYXRld2F5JztcblxuLypcbiAqIFN0YWNrIHZlcmlmaWNhdGlvbiBzdGVwczpcbiAqICogMS4gR2V0IHRoZSBJZFRva2VuIGZvciB0aGUgY3JlYXRlZCBwb29sIGJ5IGFkZGluZyB1c2VyL2FwcC1jbGllbnQgYW5kIHVzaW5nIGF3cyBjb2duaXRvLWlkcDpcbiAqICogIGEuIGF3cyBjb2duaXRvLWlkcCBjcmVhdGUtdXNlci1wb29sLWNsaWVudCAtLXVzZXItcG9vbC1pZCA8dmFsdWU+IC0tY2xpZW50LW5hbWUgPHZhbHVlPiAtLW5vLWdlbmVyYXRlLXNlY3JldFxuICogKiAgYi4gYXdzIGNvZ25pdG8taWRwIGFkbWluLWNyZWF0ZS11c2VyIC0tdXNlci1wb29sLWlkIDx2YWx1ZT4gLS11c2VybmFtZSA8dmFsdWU+IC0tdGVtcG9yYXJ5LXBhc3N3b3JkIDx2YWx1ZT5cbiAqICogIGMuIGF3cyBjb2duaXRvLWlkcCBpbml0aWF0ZS1hdXRoIC0tY2xpZW50LWlkIDx2YWx1ZT4gLS1hdXRoLWZsb3cgVVNFUl9QQVNTV09SRF9BVVRIIC0tYXV0aC1wYXJhbWV0ZXJzIFVTRVJOQU1FPTx2YWx1ZT4sUEFTU1dPUkQ9PHZhbHVlPlxuICogKiAgZC4gYXdzIGNvZ25pdG8taWRwIHJlc3BvbmQtdG8tYXV0aC1jaGFsbGVuZ2UgLS1jbGllbnQtaWQgPHZhbHVlPiAtLWNoYWxsZW5nZS1uYW1lIDx2YWx1ZT4gLS1zZXNzaW9uIDx2YWx1ZT5cbiAqICpcbiAqICogMi4gVmVyaWZ5IHRoZSBzdGFjayB1c2luZyBhYm92ZSBvYnRhaW5lZCB0b2tlbjpcbiAqICogIGEuIGBjdXJsIC1zIC1vIC9kZXYvbnVsbCAtdyBcIiV7aHR0cF9jb2RlfVwiIDx1cmw+YCBzaG91bGQgcmV0dXJuIDQwMVxuICogKiAgYi4gYGN1cmwgLXMgLW8gL2Rldi9udWxsIC13IFwiJXtodHRwX2NvZGV9XCIgLUggJ0F1dGhvcml6YXRpb246IDxJbnZhbGlkLUlkVG9rZW4+JyA8dXJsPmAgc2hvdWxkIHJldHVybiA0MDNcbiAqICogIGMuIGBjdXJsIC1zIC1vIC9kZXYvbnVsbCAtdyBcIiV7aHR0cF9jb2RlfVwiIC1IICdBdXRob3JpemF0aW9uOiA8VmFsaWQtSWRUb2tlbj4nIDx1cmw+YCBzaG91bGQgcmV0dXJuIDIwMFxuICovXG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ0NvZ25pdG9Vc2VyUG9vbHNBdXRob3JpemVySW50ZWcnKTtcblxuY29uc3QgdXNlclBvb2wgPSBuZXcgY29nbml0by5Vc2VyUG9vbChzdGFjaywgJ1VzZXJQb29sJyk7XG5cbmNvbnN0IGF1dGhvcml6ZXIgPSBuZXcgQ29nbml0b1VzZXJQb29sc0F1dGhvcml6ZXIoc3RhY2ssICdteWF1dGhvcml6ZXInLCB7XG4gIGNvZ25pdG9Vc2VyUG9vbHM6IFt1c2VyUG9vbF0sXG59KTtcblxuY29uc3QgcmVzdEFwaSA9IG5ldyBSZXN0QXBpKHN0YWNrLCAnbXlyZXN0YXBpJywgeyBjbG91ZFdhdGNoUm9sZTogdHJ1ZSB9KTtcbnJlc3RBcGkucm9vdC5hZGRNZXRob2QoJ0FOWScsIG5ldyBNb2NrSW50ZWdyYXRpb24oe1xuICBpbnRlZ3JhdGlvblJlc3BvbnNlczogW1xuICAgIHsgc3RhdHVzQ29kZTogJzIwMCcgfSxcbiAgXSxcbiAgcGFzc3Rocm91Z2hCZWhhdmlvcjogUGFzc3Rocm91Z2hCZWhhdmlvci5ORVZFUixcbiAgcmVxdWVzdFRlbXBsYXRlczoge1xuICAgICdhcHBsaWNhdGlvbi9qc29uJzogJ3sgXCJzdGF0dXNDb2RlXCI6IDIwMCB9JyxcbiAgfSxcbn0pLCB7XG4gIG1ldGhvZFJlc3BvbnNlczogW1xuICAgIHsgc3RhdHVzQ29kZTogJzIwMCcgfSxcbiAgXSxcbiAgYXV0aG9yaXplcixcbiAgYXV0aG9yaXphdGlvblR5cGU6IEF1dGhvcml6YXRpb25UeXBlLkNPR05JVE8sXG59KTtcblxubmV3IEludGVnVGVzdChhcHAsICdjb2duaXRvLWF1dGhvcml6ZXInLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbn0pO1xuIl19