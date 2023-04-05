"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iam = require("aws-cdk-lib/aws-iam");
const cdk = require("aws-cdk-lib");
const ec2 = require("aws-cdk-lib/aws-ec2");
const app = new cdk.App();
class VpcEndpointStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        /// !show
        // Add gateway endpoints when creating the VPC
        const vpc = new ec2.Vpc(this, 'MyVpc', {
            gatewayEndpoints: {
                S3: {
                    service: ec2.GatewayVpcEndpointAwsService.S3,
                },
            },
        });
        // Alternatively gateway endpoints can be added on the VPC
        const dynamoDbEndpoint = vpc.addGatewayEndpoint('DynamoDbEndpoint', {
            service: ec2.GatewayVpcEndpointAwsService.DYNAMODB,
        });
        // This allows to customize the endpoint policy
        dynamoDbEndpoint.addToPolicy(new iam.PolicyStatement({
            principals: [new iam.AnyPrincipal()],
            actions: ['dynamodb:DescribeTable', 'dynamodb:ListTables'],
            resources: ['*'],
        }));
        // Add an interface endpoint
        vpc.addInterfaceEndpoint('EcrDockerEndpoint', {
            service: ec2.InterfaceVpcEndpointAwsService.ECR_DOCKER,
            // Uncomment the following to allow more fine-grained control over
            // who can access the endpoint via the '.connections' object.
            // open: false
        });
        /// !hide
    }
}
new VpcEndpointStack(app, 'aws-cdk-ec2-vpc-endpoint');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcudnBjLWVuZHBvaW50LmxpdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnZwYy1lbmRwb2ludC5saXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBMkM7QUFDM0MsbUNBQW1DO0FBQ25DLDJDQUEyQztBQUUzQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixNQUFNLGdCQUFpQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ3RDLFlBQVksS0FBYyxFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM1RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixTQUFTO1FBQ1QsOENBQThDO1FBQzlDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO1lBQ3JDLGdCQUFnQixFQUFFO2dCQUNoQixFQUFFLEVBQUU7b0JBQ0YsT0FBTyxFQUFFLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxFQUFFO2lCQUM3QzthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsMERBQTBEO1FBQzFELE1BQU0sZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLGtCQUFrQixDQUFDLGtCQUFrQixFQUFFO1lBQ2xFLE9BQU8sRUFBRSxHQUFHLENBQUMsNEJBQTRCLENBQUMsUUFBUTtTQUNuRCxDQUFDLENBQUM7UUFFSCwrQ0FBK0M7UUFDL0MsZ0JBQWdCLENBQUMsV0FBVyxDQUMxQixJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDdEIsVUFBVSxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDcEMsT0FBTyxFQUFFLENBQUMsd0JBQXdCLEVBQUUscUJBQXFCLENBQUM7WUFDMUQsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDO1NBQ2pCLENBQUMsQ0FBQyxDQUFDO1FBRU4sNEJBQTRCO1FBQzVCLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxtQkFBbUIsRUFBRTtZQUM1QyxPQUFPLEVBQUUsR0FBRyxDQUFDLDhCQUE4QixDQUFDLFVBQVU7WUFFdEQsa0VBQWtFO1lBQ2xFLDZEQUE2RDtZQUM3RCxjQUFjO1NBQ2YsQ0FBQyxDQUFDO1FBQ0gsU0FBUztJQUNYLENBQUM7Q0FDRjtBQUVELElBQUksZ0JBQWdCLENBQUMsR0FBRyxFQUFFLDBCQUEwQixDQUFDLENBQUM7QUFDdEQsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuY2xhc3MgVnBjRW5kcG9pbnRTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvLy8gIXNob3dcbiAgICAvLyBBZGQgZ2F0ZXdheSBlbmRwb2ludHMgd2hlbiBjcmVhdGluZyB0aGUgVlBDXG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGModGhpcywgJ015VnBjJywge1xuICAgICAgZ2F0ZXdheUVuZHBvaW50czoge1xuICAgICAgICBTMzoge1xuICAgICAgICAgIHNlcnZpY2U6IGVjMi5HYXRld2F5VnBjRW5kcG9pbnRBd3NTZXJ2aWNlLlMzLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIEFsdGVybmF0aXZlbHkgZ2F0ZXdheSBlbmRwb2ludHMgY2FuIGJlIGFkZGVkIG9uIHRoZSBWUENcbiAgICBjb25zdCBkeW5hbW9EYkVuZHBvaW50ID0gdnBjLmFkZEdhdGV3YXlFbmRwb2ludCgnRHluYW1vRGJFbmRwb2ludCcsIHtcbiAgICAgIHNlcnZpY2U6IGVjMi5HYXRld2F5VnBjRW5kcG9pbnRBd3NTZXJ2aWNlLkRZTkFNT0RCLFxuICAgIH0pO1xuXG4gICAgLy8gVGhpcyBhbGxvd3MgdG8gY3VzdG9taXplIHRoZSBlbmRwb2ludCBwb2xpY3lcbiAgICBkeW5hbW9EYkVuZHBvaW50LmFkZFRvUG9saWN5KFxuICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoeyAvLyBSZXN0cmljdCB0byBsaXN0aW5nIGFuZCBkZXNjcmliaW5nIHRhYmxlc1xuICAgICAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5BbnlQcmluY2lwYWwoKV0sXG4gICAgICAgIGFjdGlvbnM6IFsnZHluYW1vZGI6RGVzY3JpYmVUYWJsZScsICdkeW5hbW9kYjpMaXN0VGFibGVzJ10sXG4gICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICB9KSk7XG5cbiAgICAvLyBBZGQgYW4gaW50ZXJmYWNlIGVuZHBvaW50XG4gICAgdnBjLmFkZEludGVyZmFjZUVuZHBvaW50KCdFY3JEb2NrZXJFbmRwb2ludCcsIHtcbiAgICAgIHNlcnZpY2U6IGVjMi5JbnRlcmZhY2VWcGNFbmRwb2ludEF3c1NlcnZpY2UuRUNSX0RPQ0tFUixcblxuICAgICAgLy8gVW5jb21tZW50IHRoZSBmb2xsb3dpbmcgdG8gYWxsb3cgbW9yZSBmaW5lLWdyYWluZWQgY29udHJvbCBvdmVyXG4gICAgICAvLyB3aG8gY2FuIGFjY2VzcyB0aGUgZW5kcG9pbnQgdmlhIHRoZSAnLmNvbm5lY3Rpb25zJyBvYmplY3QuXG4gICAgICAvLyBvcGVuOiBmYWxzZVxuICAgIH0pO1xuICAgIC8vLyAhaGlkZVxuICB9XG59XG5cbm5ldyBWcGNFbmRwb2ludFN0YWNrKGFwcCwgJ2F3cy1jZGstZWMyLXZwYy1lbmRwb2ludCcpO1xuYXBwLnN5bnRoKCk7XG4iXX0=