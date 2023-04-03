"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("@aws-cdk/aws-ec2");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const elbv2 = require("../lib");
const app = new cdk.App();
class VpcEndpointServiceStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const vpc = new ec2.Vpc(this, 'VPC');
        const nlbNoPrincipals = new elbv2.NetworkLoadBalancer(this, 'NLBNoPrincipals', {
            vpc,
        });
        const service1 = new ec2.VpcEndpointService(this, 'MyVpcEndpointServiceWithNoPrincipals', {
            vpcEndpointServiceLoadBalancers: [nlbNoPrincipals],
            acceptanceRequired: false,
            allowedPrincipals: [],
        });
        const nlbWithPrincipals = new elbv2.NetworkLoadBalancer(this, 'NLBWithPrincipals', {
            vpc,
        });
        const principalArn = new aws_iam_1.ArnPrincipal('arn:aws:iam::123456789012:root');
        const service2 = new ec2.VpcEndpointService(this, 'MyVpcEndpointServiceWithPrincipals', {
            vpcEndpointServiceLoadBalancers: [nlbWithPrincipals],
            acceptanceRequired: false,
            allowedPrincipals: [principalArn],
        });
        new cdk.CfnOutput(this, 'MyVpcEndpointServiceWithNoPrincipalsServiceName', {
            exportName: 'ServiceName',
            value: service1.vpcEndpointServiceName,
            description: 'Give this to service consumers so they can connect via VPC Endpoint',
        });
        new cdk.CfnOutput(this, 'MyVpcEndpointServiceWithPrincipalsEndpointServiceId', {
            exportName: 'EndpointServiceId',
            value: service2.vpcEndpointServiceId,
            description: 'Reference this service from other stacks',
        });
    }
}
new VpcEndpointServiceStack(app, 'aws-cdk-ec2-vpc-endpoint-service');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcudnBjLWVuZHBvaW50LXNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy52cGMtZW5kcG9pbnQtc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdDQUF3QztBQUN4Qyw4Q0FBZ0Q7QUFDaEQscUNBQXFDO0FBQ3JDLGdDQUFnQztBQUVoQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixNQUFNLHVCQUF3QixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzdDLFlBQVksS0FBYyxFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM1RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sZUFBZSxHQUFHLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUM3RSxHQUFHO1NBQ0osQ0FBQyxDQUFDO1FBRUgsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLHNDQUFzQyxFQUFFO1lBQ3hGLCtCQUErQixFQUFFLENBQUMsZUFBZSxDQUFDO1lBQ2xELGtCQUFrQixFQUFFLEtBQUs7WUFDekIsaUJBQWlCLEVBQUUsRUFBRTtTQUN0QixDQUFDLENBQUM7UUFFSCxNQUFNLGlCQUFpQixHQUFHLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBRTtZQUNqRixHQUFHO1NBQ0osQ0FBQyxDQUFDO1FBQ0gsTUFBTSxZQUFZLEdBQUcsSUFBSSxzQkFBWSxDQUFDLGdDQUFnQyxDQUFDLENBQUM7UUFFeEUsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLG9DQUFvQyxFQUFFO1lBQ3RGLCtCQUErQixFQUFFLENBQUMsaUJBQWlCLENBQUM7WUFDcEQsa0JBQWtCLEVBQUUsS0FBSztZQUN6QixpQkFBaUIsRUFBRSxDQUFDLFlBQVksQ0FBQztTQUNsQyxDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGlEQUFpRCxFQUFFO1lBQ3pFLFVBQVUsRUFBRSxhQUFhO1lBQ3pCLEtBQUssRUFBRSxRQUFRLENBQUMsc0JBQXNCO1lBQ3RDLFdBQVcsRUFBRSxxRUFBcUU7U0FDbkYsQ0FBQyxDQUFDO1FBRUgsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxxREFBcUQsRUFBRTtZQUM3RSxVQUFVLEVBQUUsbUJBQW1CO1lBQy9CLEtBQUssRUFBRSxRQUFRLENBQUMsb0JBQW9CO1lBQ3BDLFdBQVcsRUFBRSwwQ0FBMEM7U0FDeEQsQ0FBQyxDQUFDO0tBQ0o7Q0FDRjtBQUVELElBQUksdUJBQXVCLENBQUMsR0FBRyxFQUFFLGtDQUFrQyxDQUFDLENBQUM7QUFDckUsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0IHsgQXJuUHJpbmNpcGFsIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBlbGJ2MiBmcm9tICcuLi9saWInO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5jbGFzcyBWcGNFbmRwb2ludFNlcnZpY2VTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCAnVlBDJyk7XG4gICAgY29uc3QgbmxiTm9QcmluY2lwYWxzID0gbmV3IGVsYnYyLk5ldHdvcmtMb2FkQmFsYW5jZXIodGhpcywgJ05MQk5vUHJpbmNpcGFscycsIHtcbiAgICAgIHZwYyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHNlcnZpY2UxID0gbmV3IGVjMi5WcGNFbmRwb2ludFNlcnZpY2UodGhpcywgJ015VnBjRW5kcG9pbnRTZXJ2aWNlV2l0aE5vUHJpbmNpcGFscycsIHtcbiAgICAgIHZwY0VuZHBvaW50U2VydmljZUxvYWRCYWxhbmNlcnM6IFtubGJOb1ByaW5jaXBhbHNdLFxuICAgICAgYWNjZXB0YW5jZVJlcXVpcmVkOiBmYWxzZSxcbiAgICAgIGFsbG93ZWRQcmluY2lwYWxzOiBbXSxcbiAgICB9KTtcblxuICAgIGNvbnN0IG5sYldpdGhQcmluY2lwYWxzID0gbmV3IGVsYnYyLk5ldHdvcmtMb2FkQmFsYW5jZXIodGhpcywgJ05MQldpdGhQcmluY2lwYWxzJywge1xuICAgICAgdnBjLFxuICAgIH0pO1xuICAgIGNvbnN0IHByaW5jaXBhbEFybiA9IG5ldyBBcm5QcmluY2lwYWwoJ2Fybjphd3M6aWFtOjoxMjM0NTY3ODkwMTI6cm9vdCcpO1xuXG4gICAgY29uc3Qgc2VydmljZTIgPSBuZXcgZWMyLlZwY0VuZHBvaW50U2VydmljZSh0aGlzLCAnTXlWcGNFbmRwb2ludFNlcnZpY2VXaXRoUHJpbmNpcGFscycsIHtcbiAgICAgIHZwY0VuZHBvaW50U2VydmljZUxvYWRCYWxhbmNlcnM6IFtubGJXaXRoUHJpbmNpcGFsc10sXG4gICAgICBhY2NlcHRhbmNlUmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgYWxsb3dlZFByaW5jaXBhbHM6IFtwcmluY2lwYWxBcm5dLFxuICAgIH0pO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ015VnBjRW5kcG9pbnRTZXJ2aWNlV2l0aE5vUHJpbmNpcGFsc1NlcnZpY2VOYW1lJywge1xuICAgICAgZXhwb3J0TmFtZTogJ1NlcnZpY2VOYW1lJyxcbiAgICAgIHZhbHVlOiBzZXJ2aWNlMS52cGNFbmRwb2ludFNlcnZpY2VOYW1lLFxuICAgICAgZGVzY3JpcHRpb246ICdHaXZlIHRoaXMgdG8gc2VydmljZSBjb25zdW1lcnMgc28gdGhleSBjYW4gY29ubmVjdCB2aWEgVlBDIEVuZHBvaW50JyxcbiAgICB9KTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdNeVZwY0VuZHBvaW50U2VydmljZVdpdGhQcmluY2lwYWxzRW5kcG9pbnRTZXJ2aWNlSWQnLCB7XG4gICAgICBleHBvcnROYW1lOiAnRW5kcG9pbnRTZXJ2aWNlSWQnLFxuICAgICAgdmFsdWU6IHNlcnZpY2UyLnZwY0VuZHBvaW50U2VydmljZUlkLFxuICAgICAgZGVzY3JpcHRpb246ICdSZWZlcmVuY2UgdGhpcyBzZXJ2aWNlIGZyb20gb3RoZXIgc3RhY2tzJyxcbiAgICB9KTtcbiAgfVxufVxuXG5uZXcgVnBjRW5kcG9pbnRTZXJ2aWNlU3RhY2soYXBwLCAnYXdzLWNkay1lYzItdnBjLWVuZHBvaW50LXNlcnZpY2UnKTtcbmFwcC5zeW50aCgpO1xuIl19