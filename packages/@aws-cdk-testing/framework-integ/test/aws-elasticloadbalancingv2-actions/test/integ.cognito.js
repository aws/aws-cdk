"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cognito = require("aws-cdk-lib/aws-cognito");
const ec2 = require("aws-cdk-lib/aws-ec2");
const elbv2 = require("aws-cdk-lib/aws-elasticloadbalancingv2");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const actions = require("aws-cdk-lib/aws-elasticloadbalancingv2-actions");
// This test can only be run as a dry-run at this time due to requiring a certificate
class CognitoStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        const vpc = new ec2.Vpc(this, 'Stack', {
            maxAzs: 2,
        });
        const certificate = {
            certificateArn: process.env.SELF_SIGNED_CERT_ARN ?? '',
        };
        const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', {
            vpc,
            internetFacing: true,
        });
        const userPool = new cognito.UserPool(this, 'UserPool');
        const userPoolClient = new cognito.UserPoolClient(this, 'Client', {
            userPool,
            // Required minimal configuration for use with an ELB
            generateSecret: true,
            authFlows: {
                userPassword: true,
            },
            oAuth: {
                flows: {
                    authorizationCodeGrant: true,
                },
                scopes: [cognito.OAuthScope.EMAIL],
                callbackUrls: [
                    `https://${lb.loadBalancerDnsName}/oauth2/idpresponse`,
                ],
            },
        });
        const cfnClient = userPoolClient.node.defaultChild;
        cfnClient.addPropertyOverride('RefreshTokenValidity', 1);
        cfnClient.addPropertyOverride('SupportedIdentityProviders', ['COGNITO']);
        const userPoolDomain = new cognito.UserPoolDomain(this, 'Domain', {
            userPool,
            cognitoDomain: {
                domainPrefix: 'test-cdk-prefix',
            },
        });
        lb.addListener('Listener', {
            port: 443,
            certificates: [certificate],
            defaultAction: new actions.AuthenticateCognitoAction({
                userPool,
                userPoolClient,
                userPoolDomain,
                next: elbv2.ListenerAction.fixedResponse(200, {
                    contentType: 'text/plain',
                    messageBody: 'Authenticated',
                }),
            }),
        });
        new aws_cdk_lib_1.CfnOutput(this, 'DNS', {
            value: lb.loadBalancerDnsName,
        });
    }
}
const app = new aws_cdk_lib_1.App();
const testCase = new CognitoStack(app, 'integ-cognito');
new integ.IntegTest(app, 'integ-test-cognito', {
    testCases: [testCase],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY29nbml0by5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmNvZ25pdG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtREFBbUQ7QUFDbkQsMkNBQTJDO0FBQzNDLGdFQUFnRTtBQUNoRSw2Q0FBb0Q7QUFDcEQsb0RBQW9EO0FBRXBELDBFQUEwRTtBQUUxRSxxRkFBcUY7QUFDckYsTUFBTSxZQUFhLFNBQVEsbUJBQUs7SUFFOUIsWUFBWSxLQUFnQixFQUFFLEVBQVU7UUFDdEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTtZQUNyQyxNQUFNLEVBQUUsQ0FBQztTQUNWLENBQUMsQ0FBQztRQUVILE1BQU0sV0FBVyxHQUErQjtZQUM5QyxjQUFjLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsSUFBSSxFQUFFO1NBQ3ZELENBQUM7UUFFRixNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFO1lBQ3ZELEdBQUc7WUFDSCxjQUFjLEVBQUUsSUFBSTtTQUNyQixDQUFDLENBQUM7UUFFSCxNQUFNLFFBQVEsR0FBRyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3hELE1BQU0sY0FBYyxHQUFHLElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQ2hFLFFBQVE7WUFFUixxREFBcUQ7WUFDckQsY0FBYyxFQUFFLElBQUk7WUFDcEIsU0FBUyxFQUFFO2dCQUNULFlBQVksRUFBRSxJQUFJO2FBQ25CO1lBQ0QsS0FBSyxFQUFFO2dCQUNMLEtBQUssRUFBRTtvQkFDTCxzQkFBc0IsRUFBRSxJQUFJO2lCQUM3QjtnQkFDRCxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQztnQkFDbEMsWUFBWSxFQUFFO29CQUNaLFdBQVcsRUFBRSxDQUFDLG1CQUFtQixxQkFBcUI7aUJBQ3ZEO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFDSCxNQUFNLFNBQVMsR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLFlBQXlDLENBQUM7UUFDaEYsU0FBUyxDQUFDLG1CQUFtQixDQUFDLHNCQUFzQixFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3pELFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyw0QkFBNEIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFFekUsTUFBTSxjQUFjLEdBQUcsSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDaEUsUUFBUTtZQUNSLGFBQWEsRUFBRTtnQkFDYixZQUFZLEVBQUUsaUJBQWlCO2FBQ2hDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUU7WUFDekIsSUFBSSxFQUFFLEdBQUc7WUFDVCxZQUFZLEVBQUUsQ0FBQyxXQUFXLENBQUM7WUFDM0IsYUFBYSxFQUFFLElBQUksT0FBTyxDQUFDLHlCQUF5QixDQUFDO2dCQUNuRCxRQUFRO2dCQUNSLGNBQWM7Z0JBQ2QsY0FBYztnQkFDZCxJQUFJLEVBQUUsS0FBSyxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFO29CQUM1QyxXQUFXLEVBQUUsWUFBWTtvQkFDekIsV0FBVyxFQUFFLGVBQWU7aUJBQzdCLENBQUM7YUFDSCxDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBRUgsSUFBSSx1QkFBUyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7WUFDekIsS0FBSyxFQUFFLEVBQUUsQ0FBQyxtQkFBbUI7U0FDOUIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFDdEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxZQUFZLENBQUMsR0FBRyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQ3hELElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsb0JBQW9CLEVBQUU7SUFDN0MsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDO0NBQ3RCLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvZ25pdG8gZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZ25pdG8nO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgZWxidjIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVsYXN0aWNsb2FkYmFsYW5jaW5ndjInO1xuaW1wb3J0IHsgQXBwLCBDZm5PdXRwdXQsIFN0YWNrIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgaW50ZWcgZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lbGFzdGljbG9hZGJhbGFuY2luZ3YyLWFjdGlvbnMnO1xuXG4vLyBUaGlzIHRlc3QgY2FuIG9ubHkgYmUgcnVuIGFzIGEgZHJ5LXJ1biBhdCB0aGlzIHRpbWUgZHVlIHRvIHJlcXVpcmluZyBhIGNlcnRpZmljYXRlXG5jbGFzcyBDb2duaXRvU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCAnU3RhY2snLCB7XG4gICAgICBtYXhBenM6IDIsXG4gICAgfSk7XG5cbiAgICBjb25zdCBjZXJ0aWZpY2F0ZTogZWxidjIuSUxpc3RlbmVyQ2VydGlmaWNhdGUgPSB7XG4gICAgICBjZXJ0aWZpY2F0ZUFybjogcHJvY2Vzcy5lbnYuU0VMRl9TSUdORURfQ0VSVF9BUk4gPz8gJycsXG4gICAgfTtcblxuICAgIGNvbnN0IGxiID0gbmV3IGVsYnYyLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKHRoaXMsICdMQicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGludGVybmV0RmFjaW5nOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdXNlclBvb2wgPSBuZXcgY29nbml0by5Vc2VyUG9vbCh0aGlzLCAnVXNlclBvb2wnKTtcbiAgICBjb25zdCB1c2VyUG9vbENsaWVudCA9IG5ldyBjb2duaXRvLlVzZXJQb29sQ2xpZW50KHRoaXMsICdDbGllbnQnLCB7XG4gICAgICB1c2VyUG9vbCxcblxuICAgICAgLy8gUmVxdWlyZWQgbWluaW1hbCBjb25maWd1cmF0aW9uIGZvciB1c2Ugd2l0aCBhbiBFTEJcbiAgICAgIGdlbmVyYXRlU2VjcmV0OiB0cnVlLFxuICAgICAgYXV0aEZsb3dzOiB7XG4gICAgICAgIHVzZXJQYXNzd29yZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICBvQXV0aDoge1xuICAgICAgICBmbG93czoge1xuICAgICAgICAgIGF1dGhvcml6YXRpb25Db2RlR3JhbnQ6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIHNjb3BlczogW2NvZ25pdG8uT0F1dGhTY29wZS5FTUFJTF0sXG4gICAgICAgIGNhbGxiYWNrVXJsczogW1xuICAgICAgICAgIGBodHRwczovLyR7bGIubG9hZEJhbGFuY2VyRG5zTmFtZX0vb2F1dGgyL2lkcHJlc3BvbnNlYCxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3QgY2ZuQ2xpZW50ID0gdXNlclBvb2xDbGllbnQubm9kZS5kZWZhdWx0Q2hpbGQgYXMgY29nbml0by5DZm5Vc2VyUG9vbENsaWVudDtcbiAgICBjZm5DbGllbnQuYWRkUHJvcGVydHlPdmVycmlkZSgnUmVmcmVzaFRva2VuVmFsaWRpdHknLCAxKTtcbiAgICBjZm5DbGllbnQuYWRkUHJvcGVydHlPdmVycmlkZSgnU3VwcG9ydGVkSWRlbnRpdHlQcm92aWRlcnMnLCBbJ0NPR05JVE8nXSk7XG5cbiAgICBjb25zdCB1c2VyUG9vbERvbWFpbiA9IG5ldyBjb2duaXRvLlVzZXJQb29sRG9tYWluKHRoaXMsICdEb21haW4nLCB7XG4gICAgICB1c2VyUG9vbCxcbiAgICAgIGNvZ25pdG9Eb21haW46IHtcbiAgICAgICAgZG9tYWluUHJlZml4OiAndGVzdC1jZGstcHJlZml4JyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBsYi5hZGRMaXN0ZW5lcignTGlzdGVuZXInLCB7XG4gICAgICBwb3J0OiA0NDMsXG4gICAgICBjZXJ0aWZpY2F0ZXM6IFtjZXJ0aWZpY2F0ZV0sXG4gICAgICBkZWZhdWx0QWN0aW9uOiBuZXcgYWN0aW9ucy5BdXRoZW50aWNhdGVDb2duaXRvQWN0aW9uKHtcbiAgICAgICAgdXNlclBvb2wsXG4gICAgICAgIHVzZXJQb29sQ2xpZW50LFxuICAgICAgICB1c2VyUG9vbERvbWFpbixcbiAgICAgICAgbmV4dDogZWxidjIuTGlzdGVuZXJBY3Rpb24uZml4ZWRSZXNwb25zZSgyMDAsIHtcbiAgICAgICAgICBjb250ZW50VHlwZTogJ3RleHQvcGxhaW4nLFxuICAgICAgICAgIG1lc3NhZ2VCb2R5OiAnQXV0aGVudGljYXRlZCcsXG4gICAgICAgIH0pLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdETlMnLCB7XG4gICAgICB2YWx1ZTogbGIubG9hZEJhbGFuY2VyRG5zTmFtZSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5jb25zdCB0ZXN0Q2FzZSA9IG5ldyBDb2duaXRvU3RhY2soYXBwLCAnaW50ZWctY29nbml0bycpO1xubmV3IGludGVnLkludGVnVGVzdChhcHAsICdpbnRlZy10ZXN0LWNvZ25pdG8nLCB7XG4gIHRlc3RDYXNlczogW3Rlc3RDYXNlXSxcbn0pO1xuXG5hcHAuc3ludGgoKTsiXX0=