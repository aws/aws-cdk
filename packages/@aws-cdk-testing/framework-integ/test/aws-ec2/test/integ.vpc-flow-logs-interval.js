"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const s3 = require("aws-cdk-lib/aws-s3");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const app = new aws_cdk_lib_1.App();
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const vpc = new aws_ec2_1.Vpc(this, 'VPC');
        new aws_ec2_1.FlowLog(this, 'FlowLogsCW', {
            resourceType: aws_ec2_1.FlowLogResourceType.fromVpc(vpc),
            maxAggregationInterval: aws_ec2_1.FlowLogMaxAggregationInterval.TEN_MINUTES,
        });
        vpc.addFlowLog('FlowLogsS3', {
            destination: aws_ec2_1.FlowLogDestination.toS3(),
            maxAggregationInterval: aws_ec2_1.FlowLogMaxAggregationInterval.ONE_MINUTE,
        });
        const bucket = new s3.Bucket(this, 'Bucket', {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });
        bucket.addToResourcePolicy(new aws_iam_1.PolicyStatement({
            effect: aws_iam_1.Effect.ALLOW,
            principals: [new aws_iam_1.ServicePrincipal('delivery.logs.amazonaws.com')],
            actions: ['s3:PutObject'],
            resources: [bucket.arnForObjects(`AWSLogs/${this.account}/*`)],
            conditions: {
                StringEquals: {
                    's3:x-amz-acl': 'bucket-owner-full-control',
                    'aws:SourceAccount': this.account,
                },
                ArnLike: {
                    'aws:SourceArn': this.formatArn({
                        service: 'logs',
                        resource: '*',
                    }),
                },
            },
        }));
        bucket.addToResourcePolicy(new aws_iam_1.PolicyStatement({
            effect: aws_iam_1.Effect.ALLOW,
            principals: [new aws_iam_1.ServicePrincipal('delivery.logs.amazonaws.com')],
            actions: ['s3:GetBucketAcl', 's3:ListBucket'],
            resources: [bucket.bucketArn],
            conditions: {
                StringEquals: {
                    'aws:SourceAccount': this.account,
                },
                ArnLike: {
                    'aws:SourceArn': this.formatArn({
                        service: 'logs',
                        resource: '*',
                    }),
                },
            },
        }));
        vpc.addFlowLog('FlowLogsS3KeyPrefix', {
            destination: aws_ec2_1.FlowLogDestination.toS3(bucket, 'prefix/'),
        });
    }
}
new integ_tests_alpha_1.IntegTest(app, 'FlowLogs', {
    testCases: [
        new TestStack(app, 'FlowLogsTestStack'),
    ],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcudnBjLWZsb3ctbG9ncy1pbnRlcnZhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnZwYy1mbG93LWxvZ3MtaW50ZXJ2YWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpREFBZ0Y7QUFDaEYseUNBQXlDO0FBQ3pDLDZDQUFvRTtBQUNwRSxrRUFBdUQ7QUFDdkQsaURBQTJIO0FBRTNILE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBR3RCLE1BQU0sU0FBVSxTQUFRLG1CQUFLO0lBQzNCLFlBQVksS0FBVSxFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUNwRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEdBQUcsR0FBRyxJQUFJLGFBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFakMsSUFBSSxpQkFBTyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDOUIsWUFBWSxFQUFFLDZCQUFtQixDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7WUFDOUMsc0JBQXNCLEVBQUUsdUNBQTZCLENBQUMsV0FBVztTQUNsRSxDQUFDLENBQUM7UUFFSCxHQUFHLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRTtZQUMzQixXQUFXLEVBQUUsNEJBQWtCLENBQUMsSUFBSSxFQUFFO1lBQ3RDLHNCQUFzQixFQUFFLHVDQUE2QixDQUFDLFVBQVU7U0FDakUsQ0FBQyxDQUFDO1FBRUgsTUFBTSxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDM0MsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztZQUNwQyxpQkFBaUIsRUFBRSxJQUFJO1NBQ3hCLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLHlCQUFlLENBQUM7WUFDN0MsTUFBTSxFQUFFLGdCQUFNLENBQUMsS0FBSztZQUNwQixVQUFVLEVBQUUsQ0FBQyxJQUFJLDBCQUFnQixDQUFDLDZCQUE2QixDQUFDLENBQUM7WUFDakUsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUFDO1lBQ3pCLFNBQVMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsV0FBVyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQztZQUM5RCxVQUFVLEVBQUU7Z0JBQ1YsWUFBWSxFQUFFO29CQUNaLGNBQWMsRUFBRSwyQkFBMkI7b0JBQzNDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxPQUFPO2lCQUNsQztnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsZUFBZSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7d0JBQzlCLE9BQU8sRUFBRSxNQUFNO3dCQUNmLFFBQVEsRUFBRSxHQUFHO3FCQUNkLENBQUM7aUJBQ0g7YUFDRjtTQUNGLENBQUMsQ0FBQyxDQUFDO1FBQ0osTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUkseUJBQWUsQ0FBQztZQUM3QyxNQUFNLEVBQUUsZ0JBQU0sQ0FBQyxLQUFLO1lBQ3BCLFVBQVUsRUFBRSxDQUFDLElBQUksMEJBQWdCLENBQUMsNkJBQTZCLENBQUMsQ0FBQztZQUNqRSxPQUFPLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxlQUFlLENBQUM7WUFDN0MsU0FBUyxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUM3QixVQUFVLEVBQUU7Z0JBQ1YsWUFBWSxFQUFFO29CQUNaLG1CQUFtQixFQUFFLElBQUksQ0FBQyxPQUFPO2lCQUNsQztnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsZUFBZSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7d0JBQzlCLE9BQU8sRUFBRSxNQUFNO3dCQUNmLFFBQVEsRUFBRSxHQUFHO3FCQUNkLENBQUM7aUJBQ0g7YUFDRjtTQUNGLENBQUMsQ0FBQyxDQUFDO1FBRUosR0FBRyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsRUFBRTtZQUNwQyxXQUFXLEVBQUUsNEJBQWtCLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUM7U0FDeEQsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBR0QsSUFBSSw2QkFBUyxDQUFDLEdBQUcsRUFBRSxVQUFVLEVBQUU7SUFDN0IsU0FBUyxFQUFFO1FBQ1QsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLG1CQUFtQixDQUFDO0tBQ3hDO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUG9saWN5U3RhdGVtZW50LCBFZmZlY3QsIFNlcnZpY2VQcmluY2lwYWwgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgeyBBcHAsIFJlbW92YWxQb2xpY3ksIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgRmxvd0xvZywgRmxvd0xvZ0Rlc3RpbmF0aW9uLCBGbG93TG9nUmVzb3VyY2VUeXBlLCBWcGMsIEZsb3dMb2dNYXhBZ2dyZWdhdGlvbkludGVydmFsIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxuXG5jbGFzcyBUZXN0U3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBBcHAsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgdnBjID0gbmV3IFZwYyh0aGlzLCAnVlBDJyk7XG5cbiAgICBuZXcgRmxvd0xvZyh0aGlzLCAnRmxvd0xvZ3NDVycsIHtcbiAgICAgIHJlc291cmNlVHlwZTogRmxvd0xvZ1Jlc291cmNlVHlwZS5mcm9tVnBjKHZwYyksXG4gICAgICBtYXhBZ2dyZWdhdGlvbkludGVydmFsOiBGbG93TG9nTWF4QWdncmVnYXRpb25JbnRlcnZhbC5URU5fTUlOVVRFUyxcbiAgICB9KTtcblxuICAgIHZwYy5hZGRGbG93TG9nKCdGbG93TG9nc1MzJywge1xuICAgICAgZGVzdGluYXRpb246IEZsb3dMb2dEZXN0aW5hdGlvbi50b1MzKCksXG4gICAgICBtYXhBZ2dyZWdhdGlvbkludGVydmFsOiBGbG93TG9nTWF4QWdncmVnYXRpb25JbnRlcnZhbC5PTkVfTUlOVVRFLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCAnQnVja2V0Jywge1xuICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWUsXG4gICAgfSk7XG4gICAgYnVja2V0LmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICBlZmZlY3Q6IEVmZmVjdC5BTExPVyxcbiAgICAgIHByaW5jaXBhbHM6IFtuZXcgU2VydmljZVByaW5jaXBhbCgnZGVsaXZlcnkubG9ncy5hbWF6b25hd3MuY29tJyldLFxuICAgICAgYWN0aW9uczogWydzMzpQdXRPYmplY3QnXSxcbiAgICAgIHJlc291cmNlczogW2J1Y2tldC5hcm5Gb3JPYmplY3RzKGBBV1NMb2dzLyR7dGhpcy5hY2NvdW50fS8qYCldLFxuICAgICAgY29uZGl0aW9uczoge1xuICAgICAgICBTdHJpbmdFcXVhbHM6IHtcbiAgICAgICAgICAnczM6eC1hbXotYWNsJzogJ2J1Y2tldC1vd25lci1mdWxsLWNvbnRyb2wnLFxuICAgICAgICAgICdhd3M6U291cmNlQWNjb3VudCc6IHRoaXMuYWNjb3VudCxcbiAgICAgICAgfSxcbiAgICAgICAgQXJuTGlrZToge1xuICAgICAgICAgICdhd3M6U291cmNlQXJuJzogdGhpcy5mb3JtYXRBcm4oe1xuICAgICAgICAgICAgc2VydmljZTogJ2xvZ3MnLFxuICAgICAgICAgICAgcmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSkpO1xuICAgIGJ1Y2tldC5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgZWZmZWN0OiBFZmZlY3QuQUxMT1csXG4gICAgICBwcmluY2lwYWxzOiBbbmV3IFNlcnZpY2VQcmluY2lwYWwoJ2RlbGl2ZXJ5LmxvZ3MuYW1hem9uYXdzLmNvbScpXSxcbiAgICAgIGFjdGlvbnM6IFsnczM6R2V0QnVja2V0QWNsJywgJ3MzOkxpc3RCdWNrZXQnXSxcbiAgICAgIHJlc291cmNlczogW2J1Y2tldC5idWNrZXRBcm5dLFxuICAgICAgY29uZGl0aW9uczoge1xuICAgICAgICBTdHJpbmdFcXVhbHM6IHtcbiAgICAgICAgICAnYXdzOlNvdXJjZUFjY291bnQnOiB0aGlzLmFjY291bnQsXG4gICAgICAgIH0sXG4gICAgICAgIEFybkxpa2U6IHtcbiAgICAgICAgICAnYXdzOlNvdXJjZUFybic6IHRoaXMuZm9ybWF0QXJuKHtcbiAgICAgICAgICAgIHNlcnZpY2U6ICdsb2dzJyxcbiAgICAgICAgICAgIHJlc291cmNlOiAnKicsXG4gICAgICAgICAgfSksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pKTtcblxuICAgIHZwYy5hZGRGbG93TG9nKCdGbG93TG9nc1MzS2V5UHJlZml4Jywge1xuICAgICAgZGVzdGluYXRpb246IEZsb3dMb2dEZXN0aW5hdGlvbi50b1MzKGJ1Y2tldCwgJ3ByZWZpeC8nKSxcbiAgICB9KTtcbiAgfVxufVxuXG5cbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnRmxvd0xvZ3MnLCB7XG4gIHRlc3RDYXNlczogW1xuICAgIG5ldyBUZXN0U3RhY2soYXBwLCAnRmxvd0xvZ3NUZXN0U3RhY2snKSxcbiAgXSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==