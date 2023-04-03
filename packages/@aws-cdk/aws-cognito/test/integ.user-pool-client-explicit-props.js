"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_secretsmanager_1 = require("@aws-cdk/aws-secretsmanager");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
const app = new core_1.App();
const stack = new core_1.Stack(app, 'integ-user-pool-client-explicit-props');
const userpool = new lib_1.UserPool(stack, 'myuserpool', {
    removalPolicy: core_1.RemovalPolicy.DESTROY,
    customAttributes: {
        attribute_one: new lib_1.StringAttribute(),
        attribute_two: new lib_1.StringAttribute(),
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
            lib_1.OAuthScope.PHONE,
            lib_1.OAuthScope.EMAIL,
            lib_1.OAuthScope.OPENID,
            lib_1.OAuthScope.PROFILE,
            lib_1.OAuthScope.COGNITO_ADMIN,
        ],
        callbackUrls: ['https://redirect-here.myapp.com'],
    },
    preventUserExistenceErrors: true,
    authSessionValidity: core_1.Duration.minutes(3),
    writeAttributes: (new lib_1.ClientAttributes()).withStandardAttributes({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcudXNlci1wb29sLWNsaWVudC1leHBsaWNpdC1wcm9wcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnVzZXItcG9vbC1jbGllbnQtZXhwbGljaXQtcHJvcHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvRUFBcUQ7QUFDckQsd0NBQW9FO0FBQ3BFLGdDQUFpRjtBQUVqRixNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsRUFBRSx1Q0FBdUMsQ0FBQyxDQUFDO0FBRXRFLE1BQU0sUUFBUSxHQUFHLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7SUFDakQsYUFBYSxFQUFFLG9CQUFhLENBQUMsT0FBTztJQUNwQyxnQkFBZ0IsRUFBRTtRQUNoQixhQUFhLEVBQUUsSUFBSSxxQkFBZSxFQUFFO1FBQ3BDLGFBQWEsRUFBRSxJQUFJLHFCQUFlLEVBQUU7S0FDckM7Q0FDRixDQUFDLENBQUM7QUFFSCxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLGtCQUFrQixFQUFFO0lBQ3BELGtCQUFrQixFQUFFLGtCQUFrQjtJQUN0QyxTQUFTLEVBQUU7UUFDVCxpQkFBaUIsRUFBRSxJQUFJO1FBQ3ZCLE1BQU0sRUFBRSxJQUFJO1FBQ1osWUFBWSxFQUFFLElBQUk7UUFDbEIsT0FBTyxFQUFFLElBQUk7S0FDZDtJQUNELGNBQWMsRUFBRSxJQUFJO0lBQ3BCLEtBQUssRUFBRTtRQUNMLEtBQUssRUFBRTtZQUNMLGlCQUFpQixFQUFFLElBQUk7WUFDdkIsc0JBQXNCLEVBQUUsSUFBSTtTQUM3QjtRQUNELE1BQU0sRUFBRTtZQUNOLGdCQUFVLENBQUMsS0FBSztZQUNoQixnQkFBVSxDQUFDLEtBQUs7WUFDaEIsZ0JBQVUsQ0FBQyxNQUFNO1lBQ2pCLGdCQUFVLENBQUMsT0FBTztZQUNsQixnQkFBVSxDQUFDLGFBQWE7U0FDekI7UUFDRCxZQUFZLEVBQUUsQ0FBQyxpQ0FBaUMsQ0FBQztLQUNsRDtJQUNELDBCQUEwQixFQUFFLElBQUk7SUFDaEMsbUJBQW1CLEVBQUUsZUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDeEMsZUFBZSxFQUFFLENBQUMsSUFBSSxzQkFBZ0IsRUFBRSxDQUFDLENBQUMsc0JBQXNCLENBQzlEO1FBQ0UsT0FBTyxFQUFFLElBQUk7UUFDYixTQUFTLEVBQUUsSUFBSTtRQUNmLEtBQUssRUFBRSxJQUFJO1FBQ1gsVUFBVSxFQUFFLElBQUk7UUFDaEIsUUFBUSxFQUFFLElBQUk7UUFDZCxNQUFNLEVBQUUsSUFBSTtRQUNaLFNBQVMsRUFBRSxJQUFJO1FBQ2YsY0FBYyxFQUFFLElBQUk7UUFDcEIsTUFBTSxFQUFFLElBQUk7UUFDWixVQUFVLEVBQUUsSUFBSTtRQUNoQixRQUFRLEVBQUUsSUFBSTtRQUNkLFdBQVcsRUFBRSxJQUFJO1FBQ2pCLGlCQUFpQixFQUFFLElBQUk7UUFDdkIsV0FBVyxFQUFFLElBQUk7UUFDakIsY0FBYyxFQUFFLElBQUk7UUFDcEIsUUFBUSxFQUFFLElBQUk7UUFDZCxPQUFPLEVBQUUsSUFBSTtLQUNkLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxlQUFlLEVBQUUsZUFBZSxDQUFDO0NBQzVELENBQUMsQ0FBQztBQUVILElBQUksMkJBQU0sQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO0lBQzFCLGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxvQkFBb0I7Q0FDL0MsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2VjcmV0IH0gZnJvbSAnQGF3cy1jZGsvYXdzLXNlY3JldHNtYW5hZ2VyJztcbmltcG9ydCB7IEFwcCwgRHVyYXRpb24sIFJlbW92YWxQb2xpY3ksIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDbGllbnRBdHRyaWJ1dGVzLCBPQXV0aFNjb3BlLCBTdHJpbmdBdHRyaWJ1dGUsIFVzZXJQb29sIH0gZnJvbSAnLi4vbGliJztcblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnaW50ZWctdXNlci1wb29sLWNsaWVudC1leHBsaWNpdC1wcm9wcycpO1xuXG5jb25zdCB1c2VycG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ215dXNlcnBvb2wnLCB7XG4gIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgY3VzdG9tQXR0cmlidXRlczoge1xuICAgIGF0dHJpYnV0ZV9vbmU6IG5ldyBTdHJpbmdBdHRyaWJ1dGUoKSxcbiAgICBhdHRyaWJ1dGVfdHdvOiBuZXcgU3RyaW5nQXR0cmlidXRlKCksXG4gIH0sXG59KTtcblxuY29uc3QgY2xpZW50ID0gdXNlcnBvb2wuYWRkQ2xpZW50KCdteXVzZXJwb29sY2xpZW50Jywge1xuICB1c2VyUG9vbENsaWVudE5hbWU6ICdteXVzZXJwb29sY2xpZW50JyxcbiAgYXV0aEZsb3dzOiB7XG4gICAgYWRtaW5Vc2VyUGFzc3dvcmQ6IHRydWUsXG4gICAgY3VzdG9tOiB0cnVlLFxuICAgIHVzZXJQYXNzd29yZDogdHJ1ZSxcbiAgICB1c2VyU3JwOiB0cnVlLFxuICB9LFxuICBnZW5lcmF0ZVNlY3JldDogdHJ1ZSxcbiAgb0F1dGg6IHtcbiAgICBmbG93czoge1xuICAgICAgaW1wbGljaXRDb2RlR3JhbnQ6IHRydWUsXG4gICAgICBhdXRob3JpemF0aW9uQ29kZUdyYW50OiB0cnVlLFxuICAgIH0sXG4gICAgc2NvcGVzOiBbXG4gICAgICBPQXV0aFNjb3BlLlBIT05FLFxuICAgICAgT0F1dGhTY29wZS5FTUFJTCxcbiAgICAgIE9BdXRoU2NvcGUuT1BFTklELFxuICAgICAgT0F1dGhTY29wZS5QUk9GSUxFLFxuICAgICAgT0F1dGhTY29wZS5DT0dOSVRPX0FETUlOLFxuICAgIF0sXG4gICAgY2FsbGJhY2tVcmxzOiBbJ2h0dHBzOi8vcmVkaXJlY3QtaGVyZS5teWFwcC5jb20nXSxcbiAgfSxcbiAgcHJldmVudFVzZXJFeGlzdGVuY2VFcnJvcnM6IHRydWUsXG4gIGF1dGhTZXNzaW9uVmFsaWRpdHk6IER1cmF0aW9uLm1pbnV0ZXMoMyksXG4gIHdyaXRlQXR0cmlidXRlczogKG5ldyBDbGllbnRBdHRyaWJ1dGVzKCkpLndpdGhTdGFuZGFyZEF0dHJpYnV0ZXMoXG4gICAge1xuICAgICAgYWRkcmVzczogdHJ1ZSxcbiAgICAgIGJpcnRoZGF0ZTogdHJ1ZSxcbiAgICAgIGVtYWlsOiB0cnVlLFxuICAgICAgZmFtaWx5TmFtZTogdHJ1ZSxcbiAgICAgIGZ1bGxuYW1lOiB0cnVlLFxuICAgICAgZ2VuZGVyOiB0cnVlLFxuICAgICAgZ2l2ZW5OYW1lOiB0cnVlLFxuICAgICAgbGFzdFVwZGF0ZVRpbWU6IHRydWUsXG4gICAgICBsb2NhbGU6IHRydWUsXG4gICAgICBtaWRkbGVOYW1lOiB0cnVlLFxuICAgICAgbmlja25hbWU6IHRydWUsXG4gICAgICBwaG9uZU51bWJlcjogdHJ1ZSxcbiAgICAgIHByZWZlcnJlZFVzZXJuYW1lOiB0cnVlLFxuICAgICAgcHJvZmlsZVBhZ2U6IHRydWUsXG4gICAgICBwcm9maWxlUGljdHVyZTogdHJ1ZSxcbiAgICAgIHRpbWV6b25lOiB0cnVlLFxuICAgICAgd2Vic2l0ZTogdHJ1ZSxcbiAgICB9KS53aXRoQ3VzdG9tQXR0cmlidXRlcygnYXR0cmlidXRlX29uZScsICdhdHRyaWJ1dGVfdHdvJyksXG59KTtcblxubmV3IFNlY3JldChzdGFjaywgJ1NlY3JldCcsIHtcbiAgc2VjcmV0U3RyaW5nVmFsdWU6IGNsaWVudC51c2VyUG9vbENsaWVudFNlY3JldCxcbn0pOyJdfQ==