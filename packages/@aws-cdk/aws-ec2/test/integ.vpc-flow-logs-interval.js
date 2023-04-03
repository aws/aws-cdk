"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_iam_1 = require("@aws-cdk/aws-iam");
const s3 = require("@aws-cdk/aws-s3");
const core_1 = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const lib_1 = require("../lib");
const app = new core_1.App();
class TestStack extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const vpc = new lib_1.Vpc(this, 'VPC');
        new lib_1.FlowLog(this, 'FlowLogsCW', {
            resourceType: lib_1.FlowLogResourceType.fromVpc(vpc),
            maxAggregationInterval: lib_1.FlowLogMaxAggregationInterval.TEN_MINUTES,
        });
        vpc.addFlowLog('FlowLogsS3', {
            destination: lib_1.FlowLogDestination.toS3(),
            maxAggregationInterval: lib_1.FlowLogMaxAggregationInterval.ONE_MINUTE,
        });
        const bucket = new s3.Bucket(this, 'Bucket', {
            removalPolicy: core_1.RemovalPolicy.DESTROY,
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
            destination: lib_1.FlowLogDestination.toS3(bucket, 'prefix/'),
        });
    }
}
new integ_tests_1.IntegTest(app, 'FlowLogs', {
    testCases: [
        new TestStack(app, 'FlowLogsTestStack'),
    ],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcudnBjLWZsb3ctbG9ncy1pbnRlcnZhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnZwYy1mbG93LWxvZ3MtaW50ZXJ2YWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw4Q0FBNkU7QUFDN0Usc0NBQXNDO0FBQ3RDLHdDQUFzRTtBQUN0RSxzREFBaUQ7QUFDakQsZ0NBQThHO0FBRTlHLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7QUFHdEIsTUFBTSxTQUFVLFNBQVEsWUFBSztJQUMzQixZQUFZLEtBQVUsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDcEQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRWpDLElBQUksYUFBTyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDOUIsWUFBWSxFQUFFLHlCQUFtQixDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7WUFDOUMsc0JBQXNCLEVBQUUsbUNBQTZCLENBQUMsV0FBVztTQUNsRSxDQUFDLENBQUM7UUFFSCxHQUFHLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRTtZQUMzQixXQUFXLEVBQUUsd0JBQWtCLENBQUMsSUFBSSxFQUFFO1lBQ3RDLHNCQUFzQixFQUFFLG1DQUE2QixDQUFDLFVBQVU7U0FDakUsQ0FBQyxDQUFDO1FBRUgsTUFBTSxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDM0MsYUFBYSxFQUFFLG9CQUFhLENBQUMsT0FBTztZQUNwQyxpQkFBaUIsRUFBRSxJQUFJO1NBQ3hCLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLHlCQUFlLENBQUM7WUFDN0MsTUFBTSxFQUFFLGdCQUFNLENBQUMsS0FBSztZQUNwQixVQUFVLEVBQUUsQ0FBQyxJQUFJLDBCQUFnQixDQUFDLDZCQUE2QixDQUFDLENBQUM7WUFDakUsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUFDO1lBQ3pCLFNBQVMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsV0FBVyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQztZQUM5RCxVQUFVLEVBQUU7Z0JBQ1YsWUFBWSxFQUFFO29CQUNaLGNBQWMsRUFBRSwyQkFBMkI7b0JBQzNDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxPQUFPO2lCQUNsQztnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsZUFBZSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7d0JBQzlCLE9BQU8sRUFBRSxNQUFNO3dCQUNmLFFBQVEsRUFBRSxHQUFHO3FCQUNkLENBQUM7aUJBQ0g7YUFDRjtTQUNGLENBQUMsQ0FBQyxDQUFDO1FBQ0osTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUkseUJBQWUsQ0FBQztZQUM3QyxNQUFNLEVBQUUsZ0JBQU0sQ0FBQyxLQUFLO1lBQ3BCLFVBQVUsRUFBRSxDQUFDLElBQUksMEJBQWdCLENBQUMsNkJBQTZCLENBQUMsQ0FBQztZQUNqRSxPQUFPLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxlQUFlLENBQUM7WUFDN0MsU0FBUyxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUM3QixVQUFVLEVBQUU7Z0JBQ1YsWUFBWSxFQUFFO29CQUNaLG1CQUFtQixFQUFFLElBQUksQ0FBQyxPQUFPO2lCQUNsQztnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsZUFBZSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7d0JBQzlCLE9BQU8sRUFBRSxNQUFNO3dCQUNmLFFBQVEsRUFBRSxHQUFHO3FCQUNkLENBQUM7aUJBQ0g7YUFDRjtTQUNGLENBQUMsQ0FBQyxDQUFDO1FBRUosR0FBRyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsRUFBRTtZQUNwQyxXQUFXLEVBQUUsd0JBQWtCLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUM7U0FDeEQsQ0FBQyxDQUFDO0tBQ0o7Q0FDRjtBQUdELElBQUksdUJBQVMsQ0FBQyxHQUFHLEVBQUUsVUFBVSxFQUFFO0lBQzdCLFNBQVMsRUFBRTtRQUNULElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSxtQkFBbUIsQ0FBQztLQUN4QztDQUNGLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBvbGljeVN0YXRlbWVudCwgRWZmZWN0LCBTZXJ2aWNlUHJpbmNpcGFsIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xuaW1wb3J0IHsgQXBwLCBSZW1vdmFsUG9saWN5LCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMnO1xuaW1wb3J0IHsgRmxvd0xvZywgRmxvd0xvZ0Rlc3RpbmF0aW9uLCBGbG93TG9nUmVzb3VyY2VUeXBlLCBWcGMsIEZsb3dMb2dNYXhBZ2dyZWdhdGlvbkludGVydmFsIH0gZnJvbSAnLi4vbGliJztcblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IEFwcCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHRoaXMsICdWUEMnKTtcblxuICAgIG5ldyBGbG93TG9nKHRoaXMsICdGbG93TG9nc0NXJywge1xuICAgICAgcmVzb3VyY2VUeXBlOiBGbG93TG9nUmVzb3VyY2VUeXBlLmZyb21WcGModnBjKSxcbiAgICAgIG1heEFnZ3JlZ2F0aW9uSW50ZXJ2YWw6IEZsb3dMb2dNYXhBZ2dyZWdhdGlvbkludGVydmFsLlRFTl9NSU5VVEVTLFxuICAgIH0pO1xuXG4gICAgdnBjLmFkZEZsb3dMb2coJ0Zsb3dMb2dzUzMnLCB7XG4gICAgICBkZXN0aW5hdGlvbjogRmxvd0xvZ0Rlc3RpbmF0aW9uLnRvUzMoKSxcbiAgICAgIG1heEFnZ3JlZ2F0aW9uSW50ZXJ2YWw6IEZsb3dMb2dNYXhBZ2dyZWdhdGlvbkludGVydmFsLk9ORV9NSU5VVEUsXG4gICAgfSk7XG5cbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsICdCdWNrZXQnLCB7XG4gICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZSxcbiAgICB9KTtcbiAgICBidWNrZXQuYWRkVG9SZXNvdXJjZVBvbGljeShuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGVmZmVjdDogRWZmZWN0LkFMTE9XLFxuICAgICAgcHJpbmNpcGFsczogW25ldyBTZXJ2aWNlUHJpbmNpcGFsKCdkZWxpdmVyeS5sb2dzLmFtYXpvbmF3cy5jb20nKV0sXG4gICAgICBhY3Rpb25zOiBbJ3MzOlB1dE9iamVjdCddLFxuICAgICAgcmVzb3VyY2VzOiBbYnVja2V0LmFybkZvck9iamVjdHMoYEFXU0xvZ3MvJHt0aGlzLmFjY291bnR9LypgKV0sXG4gICAgICBjb25kaXRpb25zOiB7XG4gICAgICAgIFN0cmluZ0VxdWFsczoge1xuICAgICAgICAgICdzMzp4LWFtei1hY2wnOiAnYnVja2V0LW93bmVyLWZ1bGwtY29udHJvbCcsXG4gICAgICAgICAgJ2F3czpTb3VyY2VBY2NvdW50JzogdGhpcy5hY2NvdW50LFxuICAgICAgICB9LFxuICAgICAgICBBcm5MaWtlOiB7XG4gICAgICAgICAgJ2F3czpTb3VyY2VBcm4nOiB0aGlzLmZvcm1hdEFybih7XG4gICAgICAgICAgICBzZXJ2aWNlOiAnbG9ncycsXG4gICAgICAgICAgICByZXNvdXJjZTogJyonLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KSk7XG4gICAgYnVja2V0LmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICBlZmZlY3Q6IEVmZmVjdC5BTExPVyxcbiAgICAgIHByaW5jaXBhbHM6IFtuZXcgU2VydmljZVByaW5jaXBhbCgnZGVsaXZlcnkubG9ncy5hbWF6b25hd3MuY29tJyldLFxuICAgICAgYWN0aW9uczogWydzMzpHZXRCdWNrZXRBY2wnLCAnczM6TGlzdEJ1Y2tldCddLFxuICAgICAgcmVzb3VyY2VzOiBbYnVja2V0LmJ1Y2tldEFybl0sXG4gICAgICBjb25kaXRpb25zOiB7XG4gICAgICAgIFN0cmluZ0VxdWFsczoge1xuICAgICAgICAgICdhd3M6U291cmNlQWNjb3VudCc6IHRoaXMuYWNjb3VudCxcbiAgICAgICAgfSxcbiAgICAgICAgQXJuTGlrZToge1xuICAgICAgICAgICdhd3M6U291cmNlQXJuJzogdGhpcy5mb3JtYXRBcm4oe1xuICAgICAgICAgICAgc2VydmljZTogJ2xvZ3MnLFxuICAgICAgICAgICAgcmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSkpO1xuXG4gICAgdnBjLmFkZEZsb3dMb2coJ0Zsb3dMb2dzUzNLZXlQcmVmaXgnLCB7XG4gICAgICBkZXN0aW5hdGlvbjogRmxvd0xvZ0Rlc3RpbmF0aW9uLnRvUzMoYnVja2V0LCAncHJlZml4LycpLFxuICAgIH0pO1xuICB9XG59XG5cblxubmV3IEludGVnVGVzdChhcHAsICdGbG93TG9ncycsIHtcbiAgdGVzdENhc2VzOiBbXG4gICAgbmV3IFRlc3RTdGFjayhhcHAsICdGbG93TG9nc1Rlc3RTdGFjaycpLFxuICBdLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19