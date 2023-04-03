"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_secretsmanager_1 = require("aws-cdk-lib/aws-secretsmanager");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_cognito_1 = require("aws-cdk-lib/aws-cognito");
const app = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(app, 'integ-user-pool-client-explicit-props');
const userpool = new aws_cognito_1.UserPool(stack, 'myuserpool', {
    removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
    customAttributes: {
        attribute_one: new aws_cognito_1.StringAttribute(),
        attribute_two: new aws_cognito_1.StringAttribute(),
    },
});
const client = userpool.addClient('myuserpoolclient', {
    userPoolClientName: 'myuserpoolclient',
    authFlows: {
        adminUserPassword: true,
        custom: true,
        userPassword: true,
        userSrp: true,
    },
    generateSecret: true,
    oAuth: {
        flows: {
            implicitCodeGrant: true,
            authorizationCodeGrant: true,
        },
        scopes: [
            aws_cognito_1.OAuthScope.PHONE,
            aws_cognito_1.OAuthScope.EMAIL,
            aws_cognito_1.OAuthScope.OPENID,
            aws_cognito_1.OAuthScope.PROFILE,
            aws_cognito_1.OAuthScope.COGNITO_ADMIN,
        ],
        callbackUrls: ['https://redirect-here.myapp.com'],
    },
    preventUserExistenceErrors: true,
    authSessionValidity: aws_cdk_lib_1.Duration.minutes(3),
    writeAttributes: (new aws_cognito_1.ClientAttributes()).withStandardAttributes({
        address: true,
        birthdate: true,
        email: true,
        familyName: true,
        fullname: true,
        gender: true,
        givenName: true,
        lastUpdateTime: true,
        locale: true,
        middleName: true,
        nickname: true,
        phoneNumber: true,
        preferredUsername: true,
        profilePage: true,
        profilePicture: true,
        timezone: true,
        website: true,
    }).withCustomAttributes('attribute_one', 'attribute_two'),
});
new aws_secretsmanager_1.Secret(stack, 'Secret', {
    secretStringValue: client.userPoolClientSecret,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcudXNlci1wb29sLWNsaWVudC1leHBsaWNpdC1wcm9wcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnVzZXItcG9vbC1jbGllbnQtZXhwbGljaXQtcHJvcHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1RUFBd0Q7QUFDeEQsNkNBQWtFO0FBQ2xFLHlEQUFrRztBQUVsRyxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUN0QixNQUFNLEtBQUssR0FBRyxJQUFJLG1CQUFLLENBQUMsR0FBRyxFQUFFLHVDQUF1QyxDQUFDLENBQUM7QUFFdEUsTUFBTSxRQUFRLEdBQUcsSUFBSSxzQkFBUSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7SUFDakQsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztJQUNwQyxnQkFBZ0IsRUFBRTtRQUNoQixhQUFhLEVBQUUsSUFBSSw2QkFBZSxFQUFFO1FBQ3BDLGFBQWEsRUFBRSxJQUFJLDZCQUFlLEVBQUU7S0FDckM7Q0FDRixDQUFDLENBQUM7QUFFSCxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLGtCQUFrQixFQUFFO0lBQ3BELGtCQUFrQixFQUFFLGtCQUFrQjtJQUN0QyxTQUFTLEVBQUU7UUFDVCxpQkFBaUIsRUFBRSxJQUFJO1FBQ3ZCLE1BQU0sRUFBRSxJQUFJO1FBQ1osWUFBWSxFQUFFLElBQUk7UUFDbEIsT0FBTyxFQUFFLElBQUk7S0FDZDtJQUNELGNBQWMsRUFBRSxJQUFJO0lBQ3BCLEtBQUssRUFBRTtRQUNMLEtBQUssRUFBRTtZQUNMLGlCQUFpQixFQUFFLElBQUk7WUFDdkIsc0JBQXNCLEVBQUUsSUFBSTtTQUM3QjtRQUNELE1BQU0sRUFBRTtZQUNOLHdCQUFVLENBQUMsS0FBSztZQUNoQix3QkFBVSxDQUFDLEtBQUs7WUFDaEIsd0JBQVUsQ0FBQyxNQUFNO1lBQ2pCLHdCQUFVLENBQUMsT0FBTztZQUNsQix3QkFBVSxDQUFDLGFBQWE7U0FDekI7UUFDRCxZQUFZLEVBQUUsQ0FBQyxpQ0FBaUMsQ0FBQztLQUNsRDtJQUNELDBCQUEwQixFQUFFLElBQUk7SUFDaEMsbUJBQW1CLEVBQUUsc0JBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3hDLGVBQWUsRUFBRSxDQUFDLElBQUksOEJBQWdCLEVBQUUsQ0FBQyxDQUFDLHNCQUFzQixDQUM5RDtRQUNFLE9BQU8sRUFBRSxJQUFJO1FBQ2IsU0FBUyxFQUFFLElBQUk7UUFDZixLQUFLLEVBQUUsSUFBSTtRQUNYLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLFFBQVEsRUFBRSxJQUFJO1FBQ2QsTUFBTSxFQUFFLElBQUk7UUFDWixTQUFTLEVBQUUsSUFBSTtRQUNmLGNBQWMsRUFBRSxJQUFJO1FBQ3BCLE1BQU0sRUFBRSxJQUFJO1FBQ1osVUFBVSxFQUFFLElBQUk7UUFDaEIsUUFBUSxFQUFFLElBQUk7UUFDZCxXQUFXLEVBQUUsSUFBSTtRQUNqQixpQkFBaUIsRUFBRSxJQUFJO1FBQ3ZCLFdBQVcsRUFBRSxJQUFJO1FBQ2pCLGNBQWMsRUFBRSxJQUFJO1FBQ3BCLFFBQVEsRUFBRSxJQUFJO1FBQ2QsT0FBTyxFQUFFLElBQUk7S0FDZCxDQUFDLENBQUMsb0JBQW9CLENBQUMsZUFBZSxFQUFFLGVBQWUsQ0FBQztDQUM1RCxDQUFDLENBQUM7QUFFSCxJQUFJLDJCQUFNLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtJQUMxQixpQkFBaUIsRUFBRSxNQUFNLENBQUMsb0JBQW9CO0NBQy9DLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNlY3JldCB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1zZWNyZXRzbWFuYWdlcic7XG5pbXBvcnQgeyBBcHAsIER1cmF0aW9uLCBSZW1vdmFsUG9saWN5LCBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENsaWVudEF0dHJpYnV0ZXMsIE9BdXRoU2NvcGUsIFN0cmluZ0F0dHJpYnV0ZSwgVXNlclBvb2wgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29nbml0byc7XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ2ludGVnLXVzZXItcG9vbC1jbGllbnQtZXhwbGljaXQtcHJvcHMnKTtcblxuY29uc3QgdXNlcnBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICdteXVzZXJwb29sJywge1xuICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gIGN1c3RvbUF0dHJpYnV0ZXM6IHtcbiAgICBhdHRyaWJ1dGVfb25lOiBuZXcgU3RyaW5nQXR0cmlidXRlKCksXG4gICAgYXR0cmlidXRlX3R3bzogbmV3IFN0cmluZ0F0dHJpYnV0ZSgpLFxuICB9LFxufSk7XG5cbmNvbnN0IGNsaWVudCA9IHVzZXJwb29sLmFkZENsaWVudCgnbXl1c2VycG9vbGNsaWVudCcsIHtcbiAgdXNlclBvb2xDbGllbnROYW1lOiAnbXl1c2VycG9vbGNsaWVudCcsXG4gIGF1dGhGbG93czoge1xuICAgIGFkbWluVXNlclBhc3N3b3JkOiB0cnVlLFxuICAgIGN1c3RvbTogdHJ1ZSxcbiAgICB1c2VyUGFzc3dvcmQ6IHRydWUsXG4gICAgdXNlclNycDogdHJ1ZSxcbiAgfSxcbiAgZ2VuZXJhdGVTZWNyZXQ6IHRydWUsXG4gIG9BdXRoOiB7XG4gICAgZmxvd3M6IHtcbiAgICAgIGltcGxpY2l0Q29kZUdyYW50OiB0cnVlLFxuICAgICAgYXV0aG9yaXphdGlvbkNvZGVHcmFudDogdHJ1ZSxcbiAgICB9LFxuICAgIHNjb3BlczogW1xuICAgICAgT0F1dGhTY29wZS5QSE9ORSxcbiAgICAgIE9BdXRoU2NvcGUuRU1BSUwsXG4gICAgICBPQXV0aFNjb3BlLk9QRU5JRCxcbiAgICAgIE9BdXRoU2NvcGUuUFJPRklMRSxcbiAgICAgIE9BdXRoU2NvcGUuQ09HTklUT19BRE1JTixcbiAgICBdLFxuICAgIGNhbGxiYWNrVXJsczogWydodHRwczovL3JlZGlyZWN0LWhlcmUubXlhcHAuY29tJ10sXG4gIH0sXG4gIHByZXZlbnRVc2VyRXhpc3RlbmNlRXJyb3JzOiB0cnVlLFxuICBhdXRoU2Vzc2lvblZhbGlkaXR5OiBEdXJhdGlvbi5taW51dGVzKDMpLFxuICB3cml0ZUF0dHJpYnV0ZXM6IChuZXcgQ2xpZW50QXR0cmlidXRlcygpKS53aXRoU3RhbmRhcmRBdHRyaWJ1dGVzKFxuICAgIHtcbiAgICAgIGFkZHJlc3M6IHRydWUsXG4gICAgICBiaXJ0aGRhdGU6IHRydWUsXG4gICAgICBlbWFpbDogdHJ1ZSxcbiAgICAgIGZhbWlseU5hbWU6IHRydWUsXG4gICAgICBmdWxsbmFtZTogdHJ1ZSxcbiAgICAgIGdlbmRlcjogdHJ1ZSxcbiAgICAgIGdpdmVuTmFtZTogdHJ1ZSxcbiAgICAgIGxhc3RVcGRhdGVUaW1lOiB0cnVlLFxuICAgICAgbG9jYWxlOiB0cnVlLFxuICAgICAgbWlkZGxlTmFtZTogdHJ1ZSxcbiAgICAgIG5pY2tuYW1lOiB0cnVlLFxuICAgICAgcGhvbmVOdW1iZXI6IHRydWUsXG4gICAgICBwcmVmZXJyZWRVc2VybmFtZTogdHJ1ZSxcbiAgICAgIHByb2ZpbGVQYWdlOiB0cnVlLFxuICAgICAgcHJvZmlsZVBpY3R1cmU6IHRydWUsXG4gICAgICB0aW1lem9uZTogdHJ1ZSxcbiAgICAgIHdlYnNpdGU6IHRydWUsXG4gICAgfSkud2l0aEN1c3RvbUF0dHJpYnV0ZXMoJ2F0dHJpYnV0ZV9vbmUnLCAnYXR0cmlidXRlX3R3bycpLFxufSk7XG5cbm5ldyBTZWNyZXQoc3RhY2ssICdTZWNyZXQnLCB7XG4gIHNlY3JldFN0cmluZ1ZhbHVlOiBjbGllbnQudXNlclBvb2xDbGllbnRTZWNyZXQsXG59KTsiXX0=