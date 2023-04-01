"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("aws-cdk-lib/aws-ec2");
const iam = require("aws-cdk-lib/aws-iam");
const cdk = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const apigateway = require("aws-cdk-lib/aws-apigateway");
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
new integ_tests_alpha_1.IntegTest(app, 'apigateway-vpcendpoint', {
    testCases: [testCase],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucmVzdGFwaS52cGMtZW5kcG9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5yZXN0YXBpLnZwYy1lbmRwb2ludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUEyQztBQUMzQywyQ0FBMkM7QUFDM0MsbUNBQW1DO0FBQ25DLGtFQUF1RDtBQUN2RCx5REFBeUQ7QUFFekQ7Ozs7R0FJRztBQUNILE1BQU0sSUFBSyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzFCLFlBQVksS0FBYyxFQUFFLEVBQVU7UUFDcEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztRQUUzQyxNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsb0JBQW9CLENBQUMsZUFBZSxFQUFFO1lBQzVELE9BQU8sRUFBRSxHQUFHLENBQUMsOEJBQThCLENBQUMsVUFBVTtTQUN2RCxDQUFDLENBQUM7UUFFSCxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTtZQUNoRCxjQUFjLEVBQUUsSUFBSTtZQUNwQixxQkFBcUIsRUFBRTtnQkFDckIsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUM7Z0JBQ3hDLFlBQVksRUFBRSxDQUFDLFdBQVcsQ0FBQzthQUM1QjtZQUNELE1BQU0sRUFBRSxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUM7Z0JBQzdCLFVBQVUsRUFBRTtvQkFDVixJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7d0JBQ3RCLFVBQVUsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDO3dCQUNwQyxPQUFPLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQzt3QkFDL0IsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSztxQkFDekIsQ0FBQztpQkFDSDthQUNGLENBQUM7U0FDSCxDQUFDLENBQUM7UUFDSCxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1QixDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixNQUFNLFFBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztBQUM5RCxJQUFJLDZCQUFTLENBQUMsR0FBRyxFQUFFLHdCQUF3QixFQUFFO0lBQzNDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQztDQUN0QixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0ICogYXMgYXBpZ2F0ZXdheSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheSc7XG5cbi8qXG4gKiBTdGFjayB2ZXJpZmljYXRpb24gc3RlcHM6XG4gKiAqIGN1cmwgaHR0cHM6Ly88YXBpLWlkPi08dnBjZS1pZD4uZXhlY3V0ZS1hcGkudXMtZWFzdC0xLmFtYXpvbmF3cy5jb20vcHJvZC9cbiAqIFRoZSBhYm92ZSBjb21tYW5kIG11c3QgYmUgZXhlY3V0ZWQgaW4gdGhlIHZwY1xuICovXG5jbGFzcyBUZXN0IGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGModGhpcywgJ015VnBjJywge30pO1xuXG4gICAgY29uc3QgdnBjRW5kcG9pbnQgPSB2cGMuYWRkSW50ZXJmYWNlRW5kcG9pbnQoJ015VnBjRW5kcG9pbnQnLCB7XG4gICAgICBzZXJ2aWNlOiBlYzIuSW50ZXJmYWNlVnBjRW5kcG9pbnRBd3NTZXJ2aWNlLkFQSUdBVEVXQVksXG4gICAgfSk7XG5cbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHRoaXMsICdNeUFwaScsIHtcbiAgICAgIGNsb3VkV2F0Y2hSb2xlOiB0cnVlLFxuICAgICAgZW5kcG9pbnRDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIHR5cGVzOiBbYXBpZ2F0ZXdheS5FbmRwb2ludFR5cGUuUFJJVkFURV0sXG4gICAgICAgIHZwY0VuZHBvaW50czogW3ZwY0VuZHBvaW50XSxcbiAgICAgIH0sXG4gICAgICBwb2xpY3k6IG5ldyBpYW0uUG9saWN5RG9jdW1lbnQoe1xuICAgICAgICBzdGF0ZW1lbnRzOiBbXG4gICAgICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgICAgcHJpbmNpcGFsczogW25ldyBpYW0uQW55UHJpbmNpcGFsKCldLFxuICAgICAgICAgICAgYWN0aW9uczogWydleGVjdXRlLWFwaTpJbnZva2UnXSxcbiAgICAgICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJyk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuY29uc3QgdGVzdENhc2UgPSBuZXcgVGVzdChhcHAsICd0ZXN0LWFwaWdhdGV3YXktdnBjZW5kcG9pbnQnKTtcbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnYXBpZ2F0ZXdheS12cGNlbmRwb2ludCcsIHtcbiAgdGVzdENhc2VzOiBbdGVzdENhc2VdLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19