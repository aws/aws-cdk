"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const secretsmanager = require("../lib");
class ExampleStack extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        /// !show
        const loginSecret = secretsmanager.Secret.fromSecretAttributes(this, 'Secret', {
            secretArn: 'SomeLogin',
        });
        new iam.User(this, 'User', {
            // Get the 'password' field from the secret that looks like
            // { "username": "XXXX", "password": "YYYY" }
            password: loginSecret.secretValueFromJson('password'),
        });
    }
}
const app = new cdk.App();
new ExampleStack(app, 'aws-cdk-secret-integ');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhhbXBsZS5hcHAtd2l0aC1zZWNyZXQubGl0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXhhbXBsZS5hcHAtd2l0aC1zZWNyZXQubGl0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0NBQXdDO0FBQ3hDLHFDQUFxQztBQUNyQyx5Q0FBeUM7QUFFekMsTUFBTSxZQUFhLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDbEMsWUFBWSxLQUFjLEVBQUUsRUFBVTtRQUNwQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLFNBQVM7UUFDVCxNQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDN0UsU0FBUyxFQUFFLFdBQVc7U0FDdkIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUU7WUFDekIsMkRBQTJEO1lBQzNELDZDQUE2QztZQUM3QyxRQUFRLEVBQUUsV0FBVyxDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQztTQUN0RCxDQUFDLENBQUM7S0FHSjtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsSUFBSSxZQUFZLENBQUMsR0FBRyxFQUFFLHNCQUFzQixDQUFDLENBQUM7QUFDOUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgc2VjcmV0c21hbmFnZXIgZnJvbSAnLi4vbGliJztcblxuY2xhc3MgRXhhbXBsZVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgLy8vICFzaG93XG4gICAgY29uc3QgbG9naW5TZWNyZXQgPSBzZWNyZXRzbWFuYWdlci5TZWNyZXQuZnJvbVNlY3JldEF0dHJpYnV0ZXModGhpcywgJ1NlY3JldCcsIHtcbiAgICAgIHNlY3JldEFybjogJ1NvbWVMb2dpbicsXG4gICAgfSk7XG5cbiAgICBuZXcgaWFtLlVzZXIodGhpcywgJ1VzZXInLCB7XG4gICAgICAvLyBHZXQgdGhlICdwYXNzd29yZCcgZmllbGQgZnJvbSB0aGUgc2VjcmV0IHRoYXQgbG9va3MgbGlrZVxuICAgICAgLy8geyBcInVzZXJuYW1lXCI6IFwiWFhYWFwiLCBcInBhc3N3b3JkXCI6IFwiWVlZWVwiIH1cbiAgICAgIHBhc3N3b3JkOiBsb2dpblNlY3JldC5zZWNyZXRWYWx1ZUZyb21Kc29uKCdwYXNzd29yZCcpLFxuICAgIH0pO1xuICAgIC8vLyAhaGlkZVxuXG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbm5ldyBFeGFtcGxlU3RhY2soYXBwLCAnYXdzLWNkay1zZWNyZXQtaW50ZWcnKTtcbmFwcC5zeW50aCgpO1xuIl19