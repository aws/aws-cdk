"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const core_1 = require("@aws-cdk/core");
const secretsmanager = require("../lib");
class SecretsManagerStack extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        const role = new iam.Role(this, 'TestRole', { assumedBy: new iam.AccountRootPrincipal() });
        /// !show
        // Default secret
        const secret = new secretsmanager.Secret(this, 'Secret');
        secret.grantRead(role);
        const user = new iam.User(this, 'User', {
            password: secret.secretValue,
        });
        // Templated secret
        const templatedSecret = new secretsmanager.Secret(this, 'TemplatedSecret', {
            generateSecretString: {
                secretStringTemplate: JSON.stringify({ username: 'user' }),
                generateStringKey: 'password',
            },
        });
        new iam.User(this, 'OtherUser', {
            // 'userName' is not actually a secret, so it's okay to use `unsafeUnwrap` to convert
            // the `SecretValue` into a 'string'.
            userName: templatedSecret.secretValueFromJson('username').unsafeUnwrap(),
            password: templatedSecret.secretValueFromJson('password'),
        });
        // Secret with predefined value
        const accessKey = new iam.AccessKey(this, 'AccessKey', { user });
        new secretsmanager.Secret(this, 'PredefinedSecret', {
            secretStringValue: accessKey.secretAccessKey,
        });
        // JSON secret
        new secretsmanager.Secret(this, 'JSONSecret', {
            secretObjectValue: {
                username: core_1.SecretValue.unsafePlainText(user.userName),
                database: core_1.SecretValue.unsafePlainText('foo'),
                password: accessKey.secretAccessKey,
            },
        });
    }
}
const app = new cdk.App();
new SecretsManagerStack(app, 'Integ-SecretsManager-Secret');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc2VjcmV0LmxpdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnNlY3JldC5saXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBQ3JDLHdDQUE0QztBQUM1Qyx5Q0FBeUM7QUFFekMsTUFBTSxtQkFBb0IsU0FBUSxHQUFHLENBQUMsS0FBSztJQUN6QyxZQUFZLEtBQWMsRUFBRSxFQUFVO1FBQ3BDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFM0YsU0FBUztRQUNULGlCQUFpQjtRQUNqQixNQUFNLE1BQU0sR0FBRyxJQUFJLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFdkIsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUU7WUFDdEMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxXQUFXO1NBQzdCLENBQUMsQ0FBQztRQUVILG1CQUFtQjtRQUNuQixNQUFNLGVBQWUsR0FBRyxJQUFJLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO1lBQ3pFLG9CQUFvQixFQUFFO2dCQUNwQixvQkFBb0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDO2dCQUMxRCxpQkFBaUIsRUFBRSxVQUFVO2FBQzlCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDOUIscUZBQXFGO1lBQ3JGLHFDQUFxQztZQUNyQyxRQUFRLEVBQUUsZUFBZSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxDQUFDLFlBQVksRUFBRTtZQUN4RSxRQUFRLEVBQUUsZUFBZSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQztTQUMxRCxDQUFDLENBQUM7UUFFSCwrQkFBK0I7UUFDL0IsTUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ2pFLElBQUksY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7WUFDbEQsaUJBQWlCLEVBQUUsU0FBUyxDQUFDLGVBQWU7U0FDN0MsQ0FBQyxDQUFDO1FBRUgsY0FBYztRQUNkLElBQUksY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQzVDLGlCQUFpQixFQUFFO2dCQUNqQixRQUFRLEVBQUUsa0JBQVcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDcEQsUUFBUSxFQUFFLGtCQUFXLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQztnQkFDNUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxlQUFlO2FBQ3BDO1NBQ0YsQ0FBQyxDQUFDO0tBRUo7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLElBQUksbUJBQW1CLENBQUMsR0FBRyxFQUFFLDZCQUE2QixDQUFDLENBQUM7QUFFNUQsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgU2VjcmV0VmFsdWUgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIHNlY3JldHNtYW5hZ2VyIGZyb20gJy4uL2xpYic7XG5cbmNsYXNzIFNlY3JldHNNYW5hZ2VyU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsICdUZXN0Um9sZScsIHsgYXNzdW1lZEJ5OiBuZXcgaWFtLkFjY291bnRSb290UHJpbmNpcGFsKCkgfSk7XG5cbiAgICAvLy8gIXNob3dcbiAgICAvLyBEZWZhdWx0IHNlY3JldFxuICAgIGNvbnN0IHNlY3JldCA9IG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQodGhpcywgJ1NlY3JldCcpO1xuICAgIHNlY3JldC5ncmFudFJlYWQocm9sZSk7XG5cbiAgICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHRoaXMsICdVc2VyJywge1xuICAgICAgcGFzc3dvcmQ6IHNlY3JldC5zZWNyZXRWYWx1ZSxcbiAgICB9KTtcblxuICAgIC8vIFRlbXBsYXRlZCBzZWNyZXRcbiAgICBjb25zdCB0ZW1wbGF0ZWRTZWNyZXQgPSBuZXcgc2VjcmV0c21hbmFnZXIuU2VjcmV0KHRoaXMsICdUZW1wbGF0ZWRTZWNyZXQnLCB7XG4gICAgICBnZW5lcmF0ZVNlY3JldFN0cmluZzoge1xuICAgICAgICBzZWNyZXRTdHJpbmdUZW1wbGF0ZTogSlNPTi5zdHJpbmdpZnkoeyB1c2VybmFtZTogJ3VzZXInIH0pLFxuICAgICAgICBnZW5lcmF0ZVN0cmluZ0tleTogJ3Bhc3N3b3JkJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBuZXcgaWFtLlVzZXIodGhpcywgJ090aGVyVXNlcicsIHtcbiAgICAgIC8vICd1c2VyTmFtZScgaXMgbm90IGFjdHVhbGx5IGEgc2VjcmV0LCBzbyBpdCdzIG9rYXkgdG8gdXNlIGB1bnNhZmVVbndyYXBgIHRvIGNvbnZlcnRcbiAgICAgIC8vIHRoZSBgU2VjcmV0VmFsdWVgIGludG8gYSAnc3RyaW5nJy5cbiAgICAgIHVzZXJOYW1lOiB0ZW1wbGF0ZWRTZWNyZXQuc2VjcmV0VmFsdWVGcm9tSnNvbigndXNlcm5hbWUnKS51bnNhZmVVbndyYXAoKSxcbiAgICAgIHBhc3N3b3JkOiB0ZW1wbGF0ZWRTZWNyZXQuc2VjcmV0VmFsdWVGcm9tSnNvbigncGFzc3dvcmQnKSxcbiAgICB9KTtcblxuICAgIC8vIFNlY3JldCB3aXRoIHByZWRlZmluZWQgdmFsdWVcbiAgICBjb25zdCBhY2Nlc3NLZXkgPSBuZXcgaWFtLkFjY2Vzc0tleSh0aGlzLCAnQWNjZXNzS2V5JywgeyB1c2VyIH0pO1xuICAgIG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQodGhpcywgJ1ByZWRlZmluZWRTZWNyZXQnLCB7XG4gICAgICBzZWNyZXRTdHJpbmdWYWx1ZTogYWNjZXNzS2V5LnNlY3JldEFjY2Vzc0tleSxcbiAgICB9KTtcblxuICAgIC8vIEpTT04gc2VjcmV0XG4gICAgbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldCh0aGlzLCAnSlNPTlNlY3JldCcsIHtcbiAgICAgIHNlY3JldE9iamVjdFZhbHVlOiB7XG4gICAgICAgIHVzZXJuYW1lOiBTZWNyZXRWYWx1ZS51bnNhZmVQbGFpblRleHQodXNlci51c2VyTmFtZSksXG4gICAgICAgIGRhdGFiYXNlOiBTZWNyZXRWYWx1ZS51bnNhZmVQbGFpblRleHQoJ2ZvbycpLFxuICAgICAgICBwYXNzd29yZDogYWNjZXNzS2V5LnNlY3JldEFjY2Vzc0tleSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgLy8vICFoaWRlXG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbm5ldyBTZWNyZXRzTWFuYWdlclN0YWNrKGFwcCwgJ0ludGVnLVNlY3JldHNNYW5hZ2VyLVNlY3JldCcpO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==