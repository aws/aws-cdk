"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("@aws-cdk/aws-ec2");
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const apigateway = require("../lib");
/*
 * Stack verification steps:
 * * curl https://<api-id>-<vpce-id>.execute-api.us-east-1.amazonaws.com/prod/
 * The above command must be executed in the vpc
 */
class Test extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        const vpc = new ec2.Vpc(this, 'MyVpc', {});
        const vpcEndpoint = vpc.addInterfaceEndpoint('MyVpcEndpoint', {
            service: ec2.InterfaceVpcEndpointAwsService.APIGATEWAY,
        });
        const api = new apigateway.RestApi(this, 'MyApi', {
            cloudWatchRole: true,
            endpointConfiguration: {
                types: [apigateway.EndpointType.PRIVATE],
                vpcEndpoints: [vpcEndpoint],
            },
            policy: new iam.PolicyDocument({
                statements: [
                    new iam.PolicyStatement({
                        principals: [new iam.AnyPrincipal()],
                        actions: ['execute-api:Invoke'],
                        effect: iam.Effect.ALLOW,
                    }),
                ],
            }),
        });
        api.root.addMethod('GET');
    }
}
const app = new cdk.App();
const testCase = new Test(app, 'test-apigateway-vpcendpoint');
new integ_tests_1.IntegTest(app, 'apigateway-vpcendpoint', {
    testCases: [testCase],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucmVzdGFwaS52cGMtZW5kcG9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5yZXN0YXBpLnZwYy1lbmRwb2ludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBQ3JDLHNEQUFpRDtBQUNqRCxxQ0FBcUM7QUFFckM7Ozs7R0FJRztBQUNILE1BQU0sSUFBSyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzFCLFlBQVksS0FBYyxFQUFFLEVBQVU7UUFDcEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztRQUUzQyxNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsb0JBQW9CLENBQUMsZUFBZSxFQUFFO1lBQzVELE9BQU8sRUFBRSxHQUFHLENBQUMsOEJBQThCLENBQUMsVUFBVTtTQUN2RCxDQUFDLENBQUM7UUFFSCxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTtZQUNoRCxjQUFjLEVBQUUsSUFBSTtZQUNwQixxQkFBcUIsRUFBRTtnQkFDckIsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUM7Z0JBQ3hDLFlBQVksRUFBRSxDQUFDLFdBQVcsQ0FBQzthQUM1QjtZQUNELE1BQU0sRUFBRSxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUM7Z0JBQzdCLFVBQVUsRUFBRTtvQkFDVixJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7d0JBQ3RCLFVBQVUsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDO3dCQUNwQyxPQUFPLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQzt3QkFDL0IsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSztxQkFDekIsQ0FBQztpQkFDSDthQUNGLENBQUM7U0FDSCxDQUFDLENBQUM7UUFDSCxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMzQjtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsTUFBTSxRQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLDZCQUE2QixDQUFDLENBQUM7QUFDOUQsSUFBSSx1QkFBUyxDQUFDLEdBQUcsRUFBRSx3QkFBd0IsRUFBRTtJQUMzQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUM7Q0FDdEIsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMnO1xuaW1wb3J0ICogYXMgYXBpZ2F0ZXdheSBmcm9tICcuLi9saWInO1xuXG4vKlxuICogU3RhY2sgdmVyaWZpY2F0aW9uIHN0ZXBzOlxuICogKiBjdXJsIGh0dHBzOi8vPGFwaS1pZD4tPHZwY2UtaWQ+LmV4ZWN1dGUtYXBpLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tL3Byb2QvXG4gKiBUaGUgYWJvdmUgY29tbWFuZCBtdXN0IGJlIGV4ZWN1dGVkIGluIHRoZSB2cGNcbiAqL1xuY2xhc3MgVGVzdCBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdNeVZwYycsIHt9KTtcblxuICAgIGNvbnN0IHZwY0VuZHBvaW50ID0gdnBjLmFkZEludGVyZmFjZUVuZHBvaW50KCdNeVZwY0VuZHBvaW50Jywge1xuICAgICAgc2VydmljZTogZWMyLkludGVyZmFjZVZwY0VuZHBvaW50QXdzU2VydmljZS5BUElHQVRFV0FZLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaSh0aGlzLCAnTXlBcGknLCB7XG4gICAgICBjbG91ZFdhdGNoUm9sZTogdHJ1ZSxcbiAgICAgIGVuZHBvaW50Q29uZmlndXJhdGlvbjoge1xuICAgICAgICB0eXBlczogW2FwaWdhdGV3YXkuRW5kcG9pbnRUeXBlLlBSSVZBVEVdLFxuICAgICAgICB2cGNFbmRwb2ludHM6IFt2cGNFbmRwb2ludF0sXG4gICAgICB9LFxuICAgICAgcG9saWN5OiBuZXcgaWFtLlBvbGljeURvY3VtZW50KHtcbiAgICAgICAgc3RhdGVtZW50czogW1xuICAgICAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLkFueVByaW5jaXBhbCgpXSxcbiAgICAgICAgICAgIGFjdGlvbnM6IFsnZXhlY3V0ZS1hcGk6SW52b2tlJ10sXG4gICAgICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICB9KSxcbiAgICB9KTtcbiAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcpO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNvbnN0IHRlc3RDYXNlID0gbmV3IFRlc3QoYXBwLCAndGVzdC1hcGlnYXRld2F5LXZwY2VuZHBvaW50Jyk7XG5uZXcgSW50ZWdUZXN0KGFwcCwgJ2FwaWdhdGV3YXktdnBjZW5kcG9pbnQnLCB7XG4gIHRlc3RDYXNlczogW3Rlc3RDYXNlXSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==