"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const ec2 = require("../lib");
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
    }
}
new VpcEndpointStack(app, 'aws-cdk-ec2-vpc-endpoint');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcudnBjLWVuZHBvaW50LmxpdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnZwYy1lbmRwb2ludC5saXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBQ3JDLDhCQUE4QjtBQUU5QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixNQUFNLGdCQUFpQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ3RDLFlBQVksS0FBYyxFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM1RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixTQUFTO1FBQ1QsOENBQThDO1FBQzlDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO1lBQ3JDLGdCQUFnQixFQUFFO2dCQUNoQixFQUFFLEVBQUU7b0JBQ0YsT0FBTyxFQUFFLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxFQUFFO2lCQUM3QzthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsMERBQTBEO1FBQzFELE1BQU0sZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLGtCQUFrQixDQUFDLGtCQUFrQixFQUFFO1lBQ2xFLE9BQU8sRUFBRSxHQUFHLENBQUMsNEJBQTRCLENBQUMsUUFBUTtTQUNuRCxDQUFDLENBQUM7UUFFSCwrQ0FBK0M7UUFDL0MsZ0JBQWdCLENBQUMsV0FBVyxDQUMxQixJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDdEIsVUFBVSxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDcEMsT0FBTyxFQUFFLENBQUMsd0JBQXdCLEVBQUUscUJBQXFCLENBQUM7WUFDMUQsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDO1NBQ2pCLENBQUMsQ0FBQyxDQUFDO1FBRU4sNEJBQTRCO1FBQzVCLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxtQkFBbUIsRUFBRTtZQUM1QyxPQUFPLEVBQUUsR0FBRyxDQUFDLDhCQUE4QixDQUFDLFVBQVU7WUFFdEQsa0VBQWtFO1lBQ2xFLDZEQUE2RDtZQUM3RCxjQUFjO1NBQ2YsQ0FBQyxDQUFDO0tBRUo7Q0FDRjtBQUVELElBQUksZ0JBQWdCLENBQUMsR0FBRyxFQUFFLDBCQUEwQixDQUFDLENBQUM7QUFDdEQsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJy4uL2xpYic7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNsYXNzIFZwY0VuZHBvaW50U3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy8vICFzaG93XG4gICAgLy8gQWRkIGdhdGV3YXkgZW5kcG9pbnRzIHdoZW4gY3JlYXRpbmcgdGhlIFZQQ1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdNeVZwYycsIHtcbiAgICAgIGdhdGV3YXlFbmRwb2ludHM6IHtcbiAgICAgICAgUzM6IHtcbiAgICAgICAgICBzZXJ2aWNlOiBlYzIuR2F0ZXdheVZwY0VuZHBvaW50QXdzU2VydmljZS5TMyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBBbHRlcm5hdGl2ZWx5IGdhdGV3YXkgZW5kcG9pbnRzIGNhbiBiZSBhZGRlZCBvbiB0aGUgVlBDXG4gICAgY29uc3QgZHluYW1vRGJFbmRwb2ludCA9IHZwYy5hZGRHYXRld2F5RW5kcG9pbnQoJ0R5bmFtb0RiRW5kcG9pbnQnLCB7XG4gICAgICBzZXJ2aWNlOiBlYzIuR2F0ZXdheVZwY0VuZHBvaW50QXdzU2VydmljZS5EWU5BTU9EQixcbiAgICB9KTtcblxuICAgIC8vIFRoaXMgYWxsb3dzIHRvIGN1c3RvbWl6ZSB0aGUgZW5kcG9pbnQgcG9saWN5XG4gICAgZHluYW1vRGJFbmRwb2ludC5hZGRUb1BvbGljeShcbiAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHsgLy8gUmVzdHJpY3QgdG8gbGlzdGluZyBhbmQgZGVzY3JpYmluZyB0YWJsZXNcbiAgICAgICAgcHJpbmNpcGFsczogW25ldyBpYW0uQW55UHJpbmNpcGFsKCldLFxuICAgICAgICBhY3Rpb25zOiBbJ2R5bmFtb2RiOkRlc2NyaWJlVGFibGUnLCAnZHluYW1vZGI6TGlzdFRhYmxlcyddLFxuICAgICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgfSkpO1xuXG4gICAgLy8gQWRkIGFuIGludGVyZmFjZSBlbmRwb2ludFxuICAgIHZwYy5hZGRJbnRlcmZhY2VFbmRwb2ludCgnRWNyRG9ja2VyRW5kcG9pbnQnLCB7XG4gICAgICBzZXJ2aWNlOiBlYzIuSW50ZXJmYWNlVnBjRW5kcG9pbnRBd3NTZXJ2aWNlLkVDUl9ET0NLRVIsXG5cbiAgICAgIC8vIFVuY29tbWVudCB0aGUgZm9sbG93aW5nIHRvIGFsbG93IG1vcmUgZmluZS1ncmFpbmVkIGNvbnRyb2wgb3ZlclxuICAgICAgLy8gd2hvIGNhbiBhY2Nlc3MgdGhlIGVuZHBvaW50IHZpYSB0aGUgJy5jb25uZWN0aW9ucycgb2JqZWN0LlxuICAgICAgLy8gb3BlbjogZmFsc2VcbiAgICB9KTtcbiAgICAvLy8gIWhpZGVcbiAgfVxufVxuXG5uZXcgVnBjRW5kcG9pbnRTdGFjayhhcHAsICdhd3MtY2RrLWVjMi12cGMtZW5kcG9pbnQnKTtcbmFwcC5zeW50aCgpO1xuIl19