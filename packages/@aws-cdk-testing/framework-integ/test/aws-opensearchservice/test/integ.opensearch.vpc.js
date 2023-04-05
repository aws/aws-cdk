"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("aws-cdk-lib/aws-ec2");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const opensearch = require("aws-cdk-lib/aws-opensearchservice");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const serviceLinkedRole = new aws_cdk_lib_1.CfnResource(this, 'ServiceLinkedRole', {
            type: 'AWS::IAM::ServiceLinkedRole',
            properties: {
                AWSServiceName: 'opensearchservice.amazonaws.com',
                Description: 'Role for OpenSearch VPC Test',
            },
        });
        const vpc = new ec2.Vpc(this, 'Vpc');
        const domainProps = {
            version: opensearch.EngineVersion.ELASTICSEARCH_7_1,
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            vpc,
            zoneAwareness: {
                enabled: true,
            },
            capacity: {
                dataNodes: 2,
            },
        };
        const domain = new opensearch.Domain(this, 'Domain', domainProps);
        domain.node.addDependency(serviceLinkedRole);
    }
}
const app = new aws_cdk_lib_1.App();
const testCase = new TestStack(app, 'cdk-integ-opensearch-vpc');
new integ.IntegTest(app, 'cdk-integ-opensearch-vpc-test', {
    testCases: [testCase],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcub3BlbnNlYXJjaC52cGMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5vcGVuc2VhcmNoLnZwYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUEyQztBQUMzQyw2Q0FBaUY7QUFDakYsb0RBQW9EO0FBRXBELGdFQUFnRTtBQUVoRSxNQUFNLFNBQVUsU0FBUSxtQkFBSztJQUMzQixZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0saUJBQWlCLEdBQUcsSUFBSSx5QkFBVyxDQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBRTtZQUNuRSxJQUFJLEVBQUUsNkJBQTZCO1lBQ25DLFVBQVUsRUFBRTtnQkFDVixjQUFjLEVBQUUsaUNBQWlDO2dCQUNqRCxXQUFXLEVBQUUsOEJBQThCO2FBQzVDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNyQyxNQUFNLFdBQVcsR0FBMkI7WUFDMUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxhQUFhLENBQUMsaUJBQWlCO1lBQ25ELGFBQWEsRUFBRSwyQkFBYSxDQUFDLE9BQU87WUFDcEMsR0FBRztZQUNILGFBQWEsRUFBRTtnQkFDYixPQUFPLEVBQUUsSUFBSTthQUNkO1lBQ0QsUUFBUSxFQUFFO2dCQUNSLFNBQVMsRUFBRSxDQUFDO2FBQ2I7U0FDRixDQUFDO1FBRUYsTUFBTSxNQUFNLEdBQUcsSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDbEUsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUMvQyxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUN0QixNQUFNLFFBQVEsR0FBRyxJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztBQUNoRSxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLCtCQUErQixFQUFFO0lBQ3hELFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQztDQUN0QixDQUFDLENBQUM7QUFDSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgeyBBcHAsIFN0YWNrLCBTdGFja1Byb3BzLCBSZW1vdmFsUG9saWN5LCBDZm5SZXNvdXJjZSB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgb3BlbnNlYXJjaCBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtb3BlbnNlYXJjaHNlcnZpY2UnO1xuXG5jbGFzcyBUZXN0U3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3Qgc2VydmljZUxpbmtlZFJvbGUgPSBuZXcgQ2ZuUmVzb3VyY2UodGhpcywgJ1NlcnZpY2VMaW5rZWRSb2xlJywge1xuICAgICAgdHlwZTogJ0FXUzo6SUFNOjpTZXJ2aWNlTGlua2VkUm9sZScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIEFXU1NlcnZpY2VOYW1lOiAnb3BlbnNlYXJjaHNlcnZpY2UuYW1hem9uYXdzLmNvbScsXG4gICAgICAgIERlc2NyaXB0aW9uOiAnUm9sZSBmb3IgT3BlblNlYXJjaCBWUEMgVGVzdCcsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGModGhpcywgJ1ZwYycpO1xuICAgIGNvbnN0IGRvbWFpblByb3BzOiBvcGVuc2VhcmNoLkRvbWFpblByb3BzID0ge1xuICAgICAgdmVyc2lvbjogb3BlbnNlYXJjaC5FbmdpbmVWZXJzaW9uLkVMQVNUSUNTRUFSQ0hfN18xLFxuICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgdnBjLFxuICAgICAgem9uZUF3YXJlbmVzczoge1xuICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIGNhcGFjaXR5OiB7XG4gICAgICAgIGRhdGFOb2RlczogMixcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGNvbnN0IGRvbWFpbiA9IG5ldyBvcGVuc2VhcmNoLkRvbWFpbih0aGlzLCAnRG9tYWluJywgZG9tYWluUHJvcHMpO1xuICAgIGRvbWFpbi5ub2RlLmFkZERlcGVuZGVuY3koc2VydmljZUxpbmtlZFJvbGUpO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbmNvbnN0IHRlc3RDYXNlID0gbmV3IFRlc3RTdGFjayhhcHAsICdjZGstaW50ZWctb3BlbnNlYXJjaC12cGMnKTtcbm5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnY2RrLWludGVnLW9wZW5zZWFyY2gtdnBjLXRlc3QnLCB7XG4gIHRlc3RDYXNlczogW3Rlc3RDYXNlXSxcbn0pO1xuYXBwLnN5bnRoKCk7XG4iXX0=