"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cognito = require("aws-cdk-lib/aws-cognito");
const iam = require("aws-cdk-lib/aws-iam");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const opensearch = require("aws-cdk-lib/aws-opensearchservice");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Adding required resources per https://docs.aws.amazon.com/opensearch-service/latest/developerguide/cognito-auth.html#cognito-auth-config
        const identityPool = new cognito.CfnIdentityPool(this, 'IdentityPool', {
            allowUnauthenticatedIdentities: true,
        });
        const userPool = new cognito.UserPool(this, 'UserPool', {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
        });
        userPool.addDomain('UserPoolDomain', {
            cognitoDomain: {
                domainPrefix: 'integ-test-domain-prefix',
            },
        });
        const role = new iam.Role(this, 'Role', {
            assumedBy: new iam.ServicePrincipal('opensearchservice.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonOpenSearchServiceCognitoAccess'),
            ],
        });
        // Adding a domain with cognito dashboards auth configured
        new opensearch.Domain(this, 'Domain', {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            version: opensearch.EngineVersion.OPENSEARCH_1_0,
            cognitoDashboardsAuth: {
                role,
                identityPoolId: identityPool.ref,
                userPoolId: userPool.userPoolId,
            },
        });
    }
}
const app = new aws_cdk_lib_1.App();
const stack = new TestStack(app, 'cdk-integ-opensearch-cognitodashboardsauth');
new integ_tests_alpha_1.IntegTest(app, 'CognitoAuthForOpenSearchDashboards', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcub3BlbnNlYXJjaC5jb2duaXRvZGFzaGJvYXJkc2F1dGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5vcGVuc2VhcmNoLmNvZ25pdG9kYXNoYm9hcmRzYXV0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1EQUFtRDtBQUNuRCwyQ0FBMkM7QUFDM0MsNkNBQW9FO0FBQ3BFLGtFQUF1RDtBQUV2RCxnRUFBZ0U7QUFFaEUsTUFBTSxTQUFVLFNBQVEsbUJBQUs7SUFDM0IsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QiwySUFBMkk7UUFDM0ksTUFBTSxZQUFZLEdBQUcsSUFBSSxPQUFPLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDckUsOEJBQThCLEVBQUUsSUFBSTtTQUNyQyxDQUFDLENBQUM7UUFFSCxNQUFNLFFBQVEsR0FBRyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUN0RCxhQUFhLEVBQUUsMkJBQWEsQ0FBQyxPQUFPO1NBQ3JDLENBQUMsQ0FBQztRQUNILFFBQVEsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLEVBQUU7WUFDbkMsYUFBYSxFQUFFO2dCQUNiLFlBQVksRUFBRSwwQkFBMEI7YUFDekM7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtZQUN0QyxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsaUNBQWlDLENBQUM7WUFDdEUsZUFBZSxFQUFFO2dCQUNmLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsc0NBQXNDLENBQUM7YUFDbkY7U0FDRixDQUFDLENBQUM7UUFFSCwwREFBMEQ7UUFDMUQsSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDcEMsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztZQUNwQyxPQUFPLEVBQUUsVUFBVSxDQUFDLGFBQWEsQ0FBQyxjQUFjO1lBQ2hELHFCQUFxQixFQUFFO2dCQUNyQixJQUFJO2dCQUNKLGNBQWMsRUFBRSxZQUFZLENBQUMsR0FBRztnQkFDaEMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxVQUFVO2FBQ2hDO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLDRDQUE0QyxDQUFDLENBQUM7QUFFL0UsSUFBSSw2QkFBUyxDQUFDLEdBQUcsRUFBRSxvQ0FBb0MsRUFBRTtJQUN2RCxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7Q0FDbkIsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY29nbml0byBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29nbml0byc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgeyBBcHAsIFJlbW92YWxQb2xpY3ksIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBvcGVuc2VhcmNoIGZyb20gJ2F3cy1jZGstbGliL2F3cy1vcGVuc2VhcmNoc2VydmljZSc7XG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvLyBBZGRpbmcgcmVxdWlyZWQgcmVzb3VyY2VzIHBlciBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vb3BlbnNlYXJjaC1zZXJ2aWNlL2xhdGVzdC9kZXZlbG9wZXJndWlkZS9jb2duaXRvLWF1dGguaHRtbCNjb2duaXRvLWF1dGgtY29uZmlnXG4gICAgY29uc3QgaWRlbnRpdHlQb29sID0gbmV3IGNvZ25pdG8uQ2ZuSWRlbnRpdHlQb29sKHRoaXMsICdJZGVudGl0eVBvb2wnLCB7XG4gICAgICBhbGxvd1VuYXV0aGVudGljYXRlZElkZW50aXRpZXM6IHRydWUsXG4gICAgfSk7XG5cbiAgICBjb25zdCB1c2VyUG9vbCA9IG5ldyBjb2duaXRvLlVzZXJQb29sKHRoaXMsICdVc2VyUG9vbCcsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICB9KTtcbiAgICB1c2VyUG9vbC5hZGREb21haW4oJ1VzZXJQb29sRG9tYWluJywge1xuICAgICAgY29nbml0b0RvbWFpbjoge1xuICAgICAgICBkb21haW5QcmVmaXg6ICdpbnRlZy10ZXN0LWRvbWFpbi1wcmVmaXgnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUodGhpcywgJ1JvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnb3BlbnNlYXJjaHNlcnZpY2UuYW1hem9uYXdzLmNvbScpLFxuICAgICAgbWFuYWdlZFBvbGljaWVzOiBbXG4gICAgICAgIGlhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnQW1hem9uT3BlblNlYXJjaFNlcnZpY2VDb2duaXRvQWNjZXNzJyksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgLy8gQWRkaW5nIGEgZG9tYWluIHdpdGggY29nbml0byBkYXNoYm9hcmRzIGF1dGggY29uZmlndXJlZFxuICAgIG5ldyBvcGVuc2VhcmNoLkRvbWFpbih0aGlzLCAnRG9tYWluJywge1xuICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgdmVyc2lvbjogb3BlbnNlYXJjaC5FbmdpbmVWZXJzaW9uLk9QRU5TRUFSQ0hfMV8wLFxuICAgICAgY29nbml0b0Rhc2hib2FyZHNBdXRoOiB7XG4gICAgICAgIHJvbGUsXG4gICAgICAgIGlkZW50aXR5UG9vbElkOiBpZGVudGl0eVBvb2wucmVmLFxuICAgICAgICB1c2VyUG9vbElkOiB1c2VyUG9vbC51c2VyUG9vbElkLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBUZXN0U3RhY2soYXBwLCAnY2RrLWludGVnLW9wZW5zZWFyY2gtY29nbml0b2Rhc2hib2FyZHNhdXRoJyk7XG5cbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnQ29nbml0b0F1dGhGb3JPcGVuU2VhcmNoRGFzaGJvYXJkcycsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19