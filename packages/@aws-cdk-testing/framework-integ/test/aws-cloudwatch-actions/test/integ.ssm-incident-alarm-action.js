"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudwatch = require("aws-cdk-lib/aws-cloudwatch");
const kms = require("aws-cdk-lib/aws-kms");
const ssmIncidents = require("aws-cdk-lib/aws-ssmincidents");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const cloudwatchActions = require("aws-cdk-lib/aws-cloudwatch-actions");
class SsmIncidentAlarmActionIntegrationTestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const responsePlanName = 'test-response-plan';
        const key = new kms.Key(this, 'Key', {
            pendingWindow: aws_cdk_lib_1.Duration.days(7),
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
        });
        const replicationSet = new ssmIncidents.CfnReplicationSet(this, 'ReplicationSet', {
            deletionProtected: false,
            regions: [{
                    regionName: this.region,
                    regionConfiguration: {
                        sseKmsKeyId: key.keyArn,
                    },
                }],
        });
        const responsePlan = new ssmIncidents.CfnResponsePlan(this, 'ResponsePlan', {
            name: responsePlanName,
            incidentTemplate: {
                title: 'Incident Title',
                impact: 1,
            },
        });
        responsePlan.node.addDependency(replicationSet);
        const metric = new cloudwatch.Metric({
            namespace: 'CDK/Test',
            metricName: 'Metric',
            label: 'Metric [AVG: ${AVG}]',
        });
        const alarm = new cloudwatch.Alarm(this, 'Alarm1', {
            metric,
            threshold: 100,
            evaluationPeriods: 3,
        });
        alarm.node.addDependency(responsePlan);
        alarm.addAlarmAction(new cloudwatchActions.SsmIncidentAction(responsePlanName));
    }
}
const app = new aws_cdk_lib_1.App();
const stack = new SsmIncidentAlarmActionIntegrationTestStack(app, 'SsmIncidentAlarmActionIntegrationTestStack');
new integ.IntegTest(app, 'SsmIncidentManagerAlarmActionTest', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc3NtLWluY2lkZW50LWFsYXJtLWFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnNzbS1pbmNpZGVudC1hbGFybS1hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5REFBeUQ7QUFDekQsMkNBQTJDO0FBQzNDLDZEQUE2RDtBQUM3RCw2Q0FBOEU7QUFDOUUsb0RBQW9EO0FBRXBELHdFQUF3RTtBQUV4RSxNQUFNLDBDQUEyQyxTQUFRLG1CQUFLO0lBRTVELFlBQVksS0FBVSxFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUNwRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLGdCQUFnQixHQUFHLG9CQUFvQixDQUFDO1FBRTlDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO1lBQ25DLGFBQWEsRUFBRSxzQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDL0IsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztTQUNyQyxDQUFDLENBQUM7UUFDSCxNQUFNLGNBQWMsR0FBRyxJQUFJLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDaEYsaUJBQWlCLEVBQUUsS0FBSztZQUN4QixPQUFPLEVBQUUsQ0FBQztvQkFDUixVQUFVLEVBQUUsSUFBSSxDQUFDLE1BQU07b0JBQ3ZCLG1CQUFtQixFQUFFO3dCQUNuQixXQUFXLEVBQUUsR0FBRyxDQUFDLE1BQU07cUJBQ3hCO2lCQUNGLENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxNQUFNLFlBQVksR0FBRyxJQUFJLFlBQVksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUMxRSxJQUFJLEVBQUUsZ0JBQWdCO1lBQ3RCLGdCQUFnQixFQUFFO2dCQUNoQixLQUFLLEVBQUUsZ0JBQWdCO2dCQUN2QixNQUFNLEVBQUUsQ0FBQzthQUNWO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7UUFHaEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDO1lBQ25DLFNBQVMsRUFBRSxVQUFVO1lBQ3JCLFVBQVUsRUFBRSxRQUFRO1lBQ3BCLEtBQUssRUFBRSxzQkFBc0I7U0FDOUIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxLQUFLLEdBQUcsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDakQsTUFBTTtZQUNOLFNBQVMsRUFBRSxHQUFHO1lBQ2QsaUJBQWlCLEVBQUUsQ0FBQztTQUNyQixDQUFDLENBQUM7UUFDSCxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUV2QyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0lBQ2xGLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBRXRCLE1BQU0sS0FBSyxHQUFHLElBQUksMENBQTBDLENBQUMsR0FBRyxFQUFFLDRDQUE0QyxDQUFDLENBQUM7QUFFaEgsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxtQ0FBbUMsRUFBRTtJQUM1RCxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7Q0FDbkIsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWR3YXRjaCBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY2xvdWR3YXRjaCc7XG5pbXBvcnQgKiBhcyBrbXMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWttcyc7XG5pbXBvcnQgKiBhcyBzc21JbmNpZGVudHMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNzbWluY2lkZW50cyc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrLCBTdGFja1Byb3BzLCBSZW1vdmFsUG9saWN5LCBEdXJhdGlvbiB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcblxuaW1wb3J0ICogYXMgY2xvdWR3YXRjaEFjdGlvbnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNsb3Vkd2F0Y2gtYWN0aW9ucyc7XG5cbmNsYXNzIFNzbUluY2lkZW50QWxhcm1BY3Rpb25JbnRlZ3JhdGlvblRlc3RTdGFjayBleHRlbmRzIFN0YWNrIHtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHJlc3BvbnNlUGxhbk5hbWUgPSAndGVzdC1yZXNwb25zZS1wbGFuJztcblxuICAgIGNvbnN0IGtleSA9IG5ldyBrbXMuS2V5KHRoaXMsICdLZXknLCB7XG4gICAgICBwZW5kaW5nV2luZG93OiBEdXJhdGlvbi5kYXlzKDcpLFxuICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgIH0pO1xuICAgIGNvbnN0IHJlcGxpY2F0aW9uU2V0ID0gbmV3IHNzbUluY2lkZW50cy5DZm5SZXBsaWNhdGlvblNldCh0aGlzLCAnUmVwbGljYXRpb25TZXQnLCB7XG4gICAgICBkZWxldGlvblByb3RlY3RlZDogZmFsc2UsXG4gICAgICByZWdpb25zOiBbe1xuICAgICAgICByZWdpb25OYW1lOiB0aGlzLnJlZ2lvbixcbiAgICAgICAgcmVnaW9uQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIHNzZUttc0tleUlkOiBrZXkua2V5QXJuLFxuICAgICAgICB9LFxuICAgICAgfV0sXG4gICAgfSk7XG5cbiAgICBjb25zdCByZXNwb25zZVBsYW4gPSBuZXcgc3NtSW5jaWRlbnRzLkNmblJlc3BvbnNlUGxhbih0aGlzLCAnUmVzcG9uc2VQbGFuJywge1xuICAgICAgbmFtZTogcmVzcG9uc2VQbGFuTmFtZSxcbiAgICAgIGluY2lkZW50VGVtcGxhdGU6IHtcbiAgICAgICAgdGl0bGU6ICdJbmNpZGVudCBUaXRsZScsXG4gICAgICAgIGltcGFjdDogMSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICByZXNwb25zZVBsYW4ubm9kZS5hZGREZXBlbmRlbmN5KHJlcGxpY2F0aW9uU2V0KTtcblxuXG4gICAgY29uc3QgbWV0cmljID0gbmV3IGNsb3Vkd2F0Y2guTWV0cmljKHtcbiAgICAgIG5hbWVzcGFjZTogJ0NESy9UZXN0JyxcbiAgICAgIG1ldHJpY05hbWU6ICdNZXRyaWMnLFxuICAgICAgbGFiZWw6ICdNZXRyaWMgW0FWRzogJHtBVkd9XScsXG4gICAgfSk7XG5cbiAgICBjb25zdCBhbGFybSA9IG5ldyBjbG91ZHdhdGNoLkFsYXJtKHRoaXMsICdBbGFybTEnLCB7XG4gICAgICBtZXRyaWMsXG4gICAgICB0aHJlc2hvbGQ6IDEwMCxcbiAgICAgIGV2YWx1YXRpb25QZXJpb2RzOiAzLFxuICAgIH0pO1xuICAgIGFsYXJtLm5vZGUuYWRkRGVwZW5kZW5jeShyZXNwb25zZVBsYW4pO1xuXG4gICAgYWxhcm0uYWRkQWxhcm1BY3Rpb24obmV3IGNsb3Vkd2F0Y2hBY3Rpb25zLlNzbUluY2lkZW50QWN0aW9uKHJlc3BvbnNlUGxhbk5hbWUpKTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IFNzbUluY2lkZW50QWxhcm1BY3Rpb25JbnRlZ3JhdGlvblRlc3RTdGFjayhhcHAsICdTc21JbmNpZGVudEFsYXJtQWN0aW9uSW50ZWdyYXRpb25UZXN0U3RhY2snKTtcblxubmV3IGludGVnLkludGVnVGVzdChhcHAsICdTc21JbmNpZGVudE1hbmFnZXJBbGFybUFjdGlvblRlc3QnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==