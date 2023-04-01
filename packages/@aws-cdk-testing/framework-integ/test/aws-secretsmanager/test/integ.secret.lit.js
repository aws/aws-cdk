"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iam = require("aws-cdk-lib/aws-iam");
const cdk = require("aws-cdk-lib");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const secretsmanager = require("aws-cdk-lib/aws-secretsmanager");
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
                username: aws_cdk_lib_1.SecretValue.unsafePlainText(user.userName),
                database: aws_cdk_lib_1.SecretValue.unsafePlainText('foo'),
                password: accessKey.secretAccessKey,
            },
        });
        /// !hide
    }
}
const app = new cdk.App();
new SecretsManagerStack(app, 'Integ-SecretsManager-Secret');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc2VjcmV0LmxpdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnNlY3JldC5saXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBMkM7QUFDM0MsbUNBQW1DO0FBQ25DLDZDQUEwQztBQUMxQyxpRUFBaUU7QUFFakUsTUFBTSxtQkFBb0IsU0FBUSxHQUFHLENBQUMsS0FBSztJQUN6QyxZQUFZLEtBQWMsRUFBRSxFQUFVO1FBQ3BDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFM0YsU0FBUztRQUNULGlCQUFpQjtRQUNqQixNQUFNLE1BQU0sR0FBRyxJQUFJLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFdkIsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUU7WUFDdEMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxXQUFXO1NBQzdCLENBQUMsQ0FBQztRQUVILG1CQUFtQjtRQUNuQixNQUFNLGVBQWUsR0FBRyxJQUFJLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO1lBQ3pFLG9CQUFvQixFQUFFO2dCQUNwQixvQkFBb0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDO2dCQUMxRCxpQkFBaUIsRUFBRSxVQUFVO2FBQzlCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDOUIscUZBQXFGO1lBQ3JGLHFDQUFxQztZQUNyQyxRQUFRLEVBQUUsZUFBZSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxDQUFDLFlBQVksRUFBRTtZQUN4RSxRQUFRLEVBQUUsZUFBZSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQztTQUMxRCxDQUFDLENBQUM7UUFFSCwrQkFBK0I7UUFDL0IsTUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ2pFLElBQUksY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7WUFDbEQsaUJBQWlCLEVBQUUsU0FBUyxDQUFDLGVBQWU7U0FDN0MsQ0FBQyxDQUFDO1FBRUgsY0FBYztRQUNkLElBQUksY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQzVDLGlCQUFpQixFQUFFO2dCQUNqQixRQUFRLEVBQUUseUJBQVcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDcEQsUUFBUSxFQUFFLHlCQUFXLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQztnQkFDNUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxlQUFlO2FBQ3BDO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsU0FBUztJQUNYLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLElBQUksbUJBQW1CLENBQUMsR0FBRyxFQUFFLDZCQUE2QixDQUFDLENBQUM7QUFFNUQsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IFNlY3JldFZhbHVlIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgc2VjcmV0c21hbmFnZXIgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNlY3JldHNtYW5hZ2VyJztcblxuY2xhc3MgU2VjcmV0c01hbmFnZXJTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUodGhpcywgJ1Rlc3RSb2xlJywgeyBhc3N1bWVkQnk6IG5ldyBpYW0uQWNjb3VudFJvb3RQcmluY2lwYWwoKSB9KTtcblxuICAgIC8vLyAhc2hvd1xuICAgIC8vIERlZmF1bHQgc2VjcmV0XG4gICAgY29uc3Qgc2VjcmV0ID0gbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldCh0aGlzLCAnU2VjcmV0Jyk7XG4gICAgc2VjcmV0LmdyYW50UmVhZChyb2xlKTtcblxuICAgIGNvbnN0IHVzZXIgPSBuZXcgaWFtLlVzZXIodGhpcywgJ1VzZXInLCB7XG4gICAgICBwYXNzd29yZDogc2VjcmV0LnNlY3JldFZhbHVlLFxuICAgIH0pO1xuXG4gICAgLy8gVGVtcGxhdGVkIHNlY3JldFxuICAgIGNvbnN0IHRlbXBsYXRlZFNlY3JldCA9IG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQodGhpcywgJ1RlbXBsYXRlZFNlY3JldCcsIHtcbiAgICAgIGdlbmVyYXRlU2VjcmV0U3RyaW5nOiB7XG4gICAgICAgIHNlY3JldFN0cmluZ1RlbXBsYXRlOiBKU09OLnN0cmluZ2lmeSh7IHVzZXJuYW1lOiAndXNlcicgfSksXG4gICAgICAgIGdlbmVyYXRlU3RyaW5nS2V5OiAncGFzc3dvcmQnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIG5ldyBpYW0uVXNlcih0aGlzLCAnT3RoZXJVc2VyJywge1xuICAgICAgLy8gJ3VzZXJOYW1lJyBpcyBub3QgYWN0dWFsbHkgYSBzZWNyZXQsIHNvIGl0J3Mgb2theSB0byB1c2UgYHVuc2FmZVVud3JhcGAgdG8gY29udmVydFxuICAgICAgLy8gdGhlIGBTZWNyZXRWYWx1ZWAgaW50byBhICdzdHJpbmcnLlxuICAgICAgdXNlck5hbWU6IHRlbXBsYXRlZFNlY3JldC5zZWNyZXRWYWx1ZUZyb21Kc29uKCd1c2VybmFtZScpLnVuc2FmZVVud3JhcCgpLFxuICAgICAgcGFzc3dvcmQ6IHRlbXBsYXRlZFNlY3JldC5zZWNyZXRWYWx1ZUZyb21Kc29uKCdwYXNzd29yZCcpLFxuICAgIH0pO1xuXG4gICAgLy8gU2VjcmV0IHdpdGggcHJlZGVmaW5lZCB2YWx1ZVxuICAgIGNvbnN0IGFjY2Vzc0tleSA9IG5ldyBpYW0uQWNjZXNzS2V5KHRoaXMsICdBY2Nlc3NLZXknLCB7IHVzZXIgfSk7XG4gICAgbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldCh0aGlzLCAnUHJlZGVmaW5lZFNlY3JldCcsIHtcbiAgICAgIHNlY3JldFN0cmluZ1ZhbHVlOiBhY2Nlc3NLZXkuc2VjcmV0QWNjZXNzS2V5LFxuICAgIH0pO1xuXG4gICAgLy8gSlNPTiBzZWNyZXRcbiAgICBuZXcgc2VjcmV0c21hbmFnZXIuU2VjcmV0KHRoaXMsICdKU09OU2VjcmV0Jywge1xuICAgICAgc2VjcmV0T2JqZWN0VmFsdWU6IHtcbiAgICAgICAgdXNlcm5hbWU6IFNlY3JldFZhbHVlLnVuc2FmZVBsYWluVGV4dCh1c2VyLnVzZXJOYW1lKSxcbiAgICAgICAgZGF0YWJhc2U6IFNlY3JldFZhbHVlLnVuc2FmZVBsYWluVGV4dCgnZm9vJyksXG4gICAgICAgIHBhc3N3b3JkOiBhY2Nlc3NLZXkuc2VjcmV0QWNjZXNzS2V5LFxuICAgICAgfSxcbiAgICB9KTtcbiAgICAvLy8gIWhpZGVcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xubmV3IFNlY3JldHNNYW5hZ2VyU3RhY2soYXBwLCAnSW50ZWctU2VjcmV0c01hbmFnZXItU2VjcmV0Jyk7XG5cbmFwcC5zeW50aCgpO1xuIl19