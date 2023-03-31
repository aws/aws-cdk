"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("aws-cdk-lib/aws-ec2");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const es = require("aws-cdk-lib/aws-elasticsearch");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const serviceLinkedRole = new aws_cdk_lib_1.CfnResource(this, 'ServiceLinkedRole', {
            type: 'AWS::IAM::ServiceLinkedRole',
            properties: {
                AWSServiceName: 'es.amazonaws.com',
                Description: 'Role for ElasticSearch VPC Test',
            },
        });
        const vpc = new ec2.Vpc(this, 'Vpc');
        const domainProps = {
            version: es.ElasticsearchVersion.V7_1,
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            vpc,
            zoneAwareness: {
                enabled: true,
            },
            capacity: {
                dataNodes: 2,
            },
        };
        const domain = new es.Domain(this, 'Domain', domainProps);
        domain.node.addDependency(serviceLinkedRole);
    }
}
const app = new aws_cdk_lib_1.App();
const testCase = new TestStack(app, 'cdk-integ-elasticsearch-vpc');
new integ.IntegTest(app, 'cdk-integ-elasticsearch-vpc-test', {
    testCases: [testCase],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWxhc3RpY3NlYXJjaC12cGMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5lbGFzdGljc2VhcmNoLXZwYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUEyQztBQUMzQyw2Q0FBaUY7QUFDakYsb0RBQW9EO0FBRXBELG9EQUFvRDtBQUVwRCxNQUFNLFNBQVUsU0FBUSxtQkFBSztJQUMzQixZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0saUJBQWlCLEdBQUcsSUFBSSx5QkFBVyxDQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBRTtZQUNuRSxJQUFJLEVBQUUsNkJBQTZCO1lBQ25DLFVBQVUsRUFBRTtnQkFDVixjQUFjLEVBQUUsa0JBQWtCO2dCQUNsQyxXQUFXLEVBQUUsaUNBQWlDO2FBQy9DO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNyQyxNQUFNLFdBQVcsR0FBbUI7WUFDbEMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJO1lBQ3JDLGFBQWEsRUFBRSwyQkFBYSxDQUFDLE9BQU87WUFDcEMsR0FBRztZQUNILGFBQWEsRUFBRTtnQkFDYixPQUFPLEVBQUUsSUFBSTthQUNkO1lBQ0QsUUFBUSxFQUFFO2dCQUNSLFNBQVMsRUFBRSxDQUFDO2FBQ2I7U0FDRixDQUFDO1FBQ0YsTUFBTSxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDMUQsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUMvQyxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUN0QixNQUFNLFFBQVEsR0FBRyxJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztBQUNuRSxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLGtDQUFrQyxFQUFFO0lBQzNELFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQztDQUN0QixDQUFDLENBQUM7QUFDSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgeyBBcHAsIFN0YWNrLCBTdGFja1Byb3BzLCBSZW1vdmFsUG9saWN5LCBDZm5SZXNvdXJjZSB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgZXMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVsYXN0aWNzZWFyY2gnO1xuXG5jbGFzcyBUZXN0U3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3Qgc2VydmljZUxpbmtlZFJvbGUgPSBuZXcgQ2ZuUmVzb3VyY2UodGhpcywgJ1NlcnZpY2VMaW5rZWRSb2xlJywge1xuICAgICAgdHlwZTogJ0FXUzo6SUFNOjpTZXJ2aWNlTGlua2VkUm9sZScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIEFXU1NlcnZpY2VOYW1lOiAnZXMuYW1hem9uYXdzLmNvbScsXG4gICAgICAgIERlc2NyaXB0aW9uOiAnUm9sZSBmb3IgRWxhc3RpY1NlYXJjaCBWUEMgVGVzdCcsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGModGhpcywgJ1ZwYycpO1xuICAgIGNvbnN0IGRvbWFpblByb3BzOiBlcy5Eb21haW5Qcm9wcyA9IHtcbiAgICAgIHZlcnNpb246IGVzLkVsYXN0aWNzZWFyY2hWZXJzaW9uLlY3XzEsXG4gICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICB2cGMsXG4gICAgICB6b25lQXdhcmVuZXNzOiB7XG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICB9LFxuICAgICAgY2FwYWNpdHk6IHtcbiAgICAgICAgZGF0YU5vZGVzOiAyLFxuICAgICAgfSxcbiAgICB9O1xuICAgIGNvbnN0IGRvbWFpbiA9IG5ldyBlcy5Eb21haW4odGhpcywgJ0RvbWFpbicsIGRvbWFpblByb3BzKTtcbiAgICBkb21haW4ubm9kZS5hZGREZXBlbmRlbmN5KHNlcnZpY2VMaW5rZWRSb2xlKTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5jb25zdCB0ZXN0Q2FzZSA9IG5ldyBUZXN0U3RhY2soYXBwLCAnY2RrLWludGVnLWVsYXN0aWNzZWFyY2gtdnBjJyk7XG5uZXcgaW50ZWcuSW50ZWdUZXN0KGFwcCwgJ2Nkay1pbnRlZy1lbGFzdGljc2VhcmNoLXZwYy10ZXN0Jywge1xuICB0ZXN0Q2FzZXM6IFt0ZXN0Q2FzZV0sXG59KTtcbmFwcC5zeW50aCgpO1xuIl19