"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const iam = require("aws-cdk-lib/aws-iam");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const es = require("aws-cdk-lib/aws-elasticsearch");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const domainProps = {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            version: es.ElasticsearchVersion.V7_1,
            ebs: {
                volumeSize: 10,
                volumeType: aws_ec2_1.EbsDeviceVolumeType.GENERAL_PURPOSE_SSD,
            },
            logging: {
                slowSearchLogEnabled: true,
                appLogEnabled: true,
            },
            nodeToNodeEncryption: true,
            encryptionAtRest: {
                enabled: true,
            },
            advancedOptions: {
                'rest.action.multi.allow_explicit_index': 'false',
                'indices.fielddata.cache.size': '25',
                'indices.query.bool.max_clause_count': '2048',
            },
            // test the access policies custom resource works
            accessPolicies: [
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ['es:ESHttp*'],
                    principals: [new iam.AccountRootPrincipal()],
                    resources: ['*'],
                }),
            ],
        };
        // create 2 elasticsearch domains to ensure that Cloudwatch Log Group policy names dont conflict
        new es.Domain(this, 'Domain1', domainProps);
        new es.Domain(this, 'Domain2', domainProps);
    }
}
const app = new aws_cdk_lib_1.App();
new TestStack(app, 'cdk-integ-elasticsearch');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWxhc3RpY3NlYXJjaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmVsYXN0aWNzZWFyY2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpREFBMEQ7QUFDMUQsMkNBQTJDO0FBQzNDLDZDQUFvRTtBQUVwRSxvREFBb0Q7QUFFcEQsTUFBTSxTQUFVLFNBQVEsbUJBQUs7SUFDM0IsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLFdBQVcsR0FBbUI7WUFDbEMsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztZQUNwQyxPQUFPLEVBQUUsRUFBRSxDQUFDLG9CQUFvQixDQUFDLElBQUk7WUFDckMsR0FBRyxFQUFFO2dCQUNILFVBQVUsRUFBRSxFQUFFO2dCQUNkLFVBQVUsRUFBRSw2QkFBbUIsQ0FBQyxtQkFBbUI7YUFDcEQ7WUFDRCxPQUFPLEVBQUU7Z0JBQ1Asb0JBQW9CLEVBQUUsSUFBSTtnQkFDMUIsYUFBYSxFQUFFLElBQUk7YUFDcEI7WUFDRCxvQkFBb0IsRUFBRSxJQUFJO1lBQzFCLGdCQUFnQixFQUFFO2dCQUNoQixPQUFPLEVBQUUsSUFBSTthQUNkO1lBQ0QsZUFBZSxFQUFFO2dCQUNmLHdDQUF3QyxFQUFFLE9BQU87Z0JBQ2pELDhCQUE4QixFQUFFLElBQUk7Z0JBQ3BDLHFDQUFxQyxFQUFFLE1BQU07YUFDOUM7WUFDRCxpREFBaUQ7WUFDakQsY0FBYyxFQUFFO2dCQUNkLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztvQkFDdEIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSztvQkFDeEIsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUN2QixVQUFVLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO29CQUM1QyxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUM7aUJBQ2pCLENBQUM7YUFDSDtTQUNGLENBQUM7UUFFRixnR0FBZ0c7UUFDaEcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDNUMsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDOUMsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFDdEIsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLHlCQUF5QixDQUFDLENBQUM7QUFDOUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRWJzRGV2aWNlVm9sdW1lVHlwZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0IHsgQXBwLCBSZW1vdmFsUG9saWN5LCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgZXMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVsYXN0aWNzZWFyY2gnO1xuXG5jbGFzcyBUZXN0U3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgZG9tYWluUHJvcHM6IGVzLkRvbWFpblByb3BzID0ge1xuICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgdmVyc2lvbjogZXMuRWxhc3RpY3NlYXJjaFZlcnNpb24uVjdfMSxcbiAgICAgIGViczoge1xuICAgICAgICB2b2x1bWVTaXplOiAxMCxcbiAgICAgICAgdm9sdW1lVHlwZTogRWJzRGV2aWNlVm9sdW1lVHlwZS5HRU5FUkFMX1BVUlBPU0VfU1NELFxuICAgICAgfSxcbiAgICAgIGxvZ2dpbmc6IHtcbiAgICAgICAgc2xvd1NlYXJjaExvZ0VuYWJsZWQ6IHRydWUsXG4gICAgICAgIGFwcExvZ0VuYWJsZWQ6IHRydWUsXG4gICAgICB9LFxuICAgICAgbm9kZVRvTm9kZUVuY3J5cHRpb246IHRydWUsXG4gICAgICBlbmNyeXB0aW9uQXRSZXN0OiB7XG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICB9LFxuICAgICAgYWR2YW5jZWRPcHRpb25zOiB7XG4gICAgICAgICdyZXN0LmFjdGlvbi5tdWx0aS5hbGxvd19leHBsaWNpdF9pbmRleCc6ICdmYWxzZScsXG4gICAgICAgICdpbmRpY2VzLmZpZWxkZGF0YS5jYWNoZS5zaXplJzogJzI1JyxcbiAgICAgICAgJ2luZGljZXMucXVlcnkuYm9vbC5tYXhfY2xhdXNlX2NvdW50JzogJzIwNDgnLFxuICAgICAgfSxcbiAgICAgIC8vIHRlc3QgdGhlIGFjY2VzcyBwb2xpY2llcyBjdXN0b20gcmVzb3VyY2Ugd29ya3NcbiAgICAgIGFjY2Vzc1BvbGljaWVzOiBbXG4gICAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgICAgYWN0aW9uczogWydlczpFU0h0dHAqJ10sXG4gICAgICAgICAgcHJpbmNpcGFsczogW25ldyBpYW0uQWNjb3VudFJvb3RQcmluY2lwYWwoKV0sXG4gICAgICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH07XG5cbiAgICAvLyBjcmVhdGUgMiBlbGFzdGljc2VhcmNoIGRvbWFpbnMgdG8gZW5zdXJlIHRoYXQgQ2xvdWR3YXRjaCBMb2cgR3JvdXAgcG9saWN5IG5hbWVzIGRvbnQgY29uZmxpY3RcbiAgICBuZXcgZXMuRG9tYWluKHRoaXMsICdEb21haW4xJywgZG9tYWluUHJvcHMpO1xuICAgIG5ldyBlcy5Eb21haW4odGhpcywgJ0RvbWFpbjInLCBkb21haW5Qcm9wcyk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xubmV3IFRlc3RTdGFjayhhcHAsICdjZGstaW50ZWctZWxhc3RpY3NlYXJjaCcpO1xuYXBwLnN5bnRoKCk7XG4iXX0=