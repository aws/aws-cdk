"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const iam = require("aws-cdk-lib/aws-iam");
const kms = require("aws-cdk-lib/aws-kms");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const es = require("aws-cdk-lib/aws-elasticsearch");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const key = new kms.Key(this, 'Key');
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
                kmsKey: key,
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
        new es.Domain(this, 'Domain', domainProps);
    }
}
const app = new aws_cdk_lib_1.App();
new TestStack(app, 'cdk-integ-elasticsearch-custom-kms-key');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWxhc3RpY3NlYXJjaC5jdXN0b20ta21zLWtleS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmVsYXN0aWNzZWFyY2guY3VzdG9tLWttcy1rZXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpREFBMEQ7QUFDMUQsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyw2Q0FBb0U7QUFFcEUsb0RBQW9EO0FBRXBELE1BQU0sU0FBVSxTQUFRLG1CQUFLO0lBQzNCLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVyQyxNQUFNLFdBQVcsR0FBbUI7WUFDbEMsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztZQUNwQyxPQUFPLEVBQUUsRUFBRSxDQUFDLG9CQUFvQixDQUFDLElBQUk7WUFDckMsR0FBRyxFQUFFO2dCQUNILFVBQVUsRUFBRSxFQUFFO2dCQUNkLFVBQVUsRUFBRSw2QkFBbUIsQ0FBQyxtQkFBbUI7YUFDcEQ7WUFDRCxPQUFPLEVBQUU7Z0JBQ1Asb0JBQW9CLEVBQUUsSUFBSTtnQkFDMUIsYUFBYSxFQUFFLElBQUk7YUFDcEI7WUFDRCxvQkFBb0IsRUFBRSxJQUFJO1lBQzFCLGdCQUFnQixFQUFFO2dCQUNoQixPQUFPLEVBQUUsSUFBSTtnQkFDYixNQUFNLEVBQUUsR0FBRzthQUNaO1lBQ0QsaURBQWlEO1lBQ2pELGNBQWMsRUFBRTtnQkFDZCxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7b0JBQ3RCLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUs7b0JBQ3hCLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDdkIsVUFBVSxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztvQkFDNUMsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDO2lCQUNqQixDQUFDO2FBQ0g7U0FDRixDQUFDO1FBRUYsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDN0MsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFDdEIsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLHdDQUF3QyxDQUFDLENBQUM7QUFDN0QsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRWJzRGV2aWNlVm9sdW1lVHlwZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMga21zIGZyb20gJ2F3cy1jZGstbGliL2F3cy1rbXMnO1xuaW1wb3J0IHsgQXBwLCBSZW1vdmFsUG9saWN5LCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgZXMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVsYXN0aWNzZWFyY2gnO1xuXG5jbGFzcyBUZXN0U3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3Qga2V5ID0gbmV3IGttcy5LZXkodGhpcywgJ0tleScpO1xuXG4gICAgY29uc3QgZG9tYWluUHJvcHM6IGVzLkRvbWFpblByb3BzID0ge1xuICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgdmVyc2lvbjogZXMuRWxhc3RpY3NlYXJjaFZlcnNpb24uVjdfMSxcbiAgICAgIGViczoge1xuICAgICAgICB2b2x1bWVTaXplOiAxMCxcbiAgICAgICAgdm9sdW1lVHlwZTogRWJzRGV2aWNlVm9sdW1lVHlwZS5HRU5FUkFMX1BVUlBPU0VfU1NELFxuICAgICAgfSxcbiAgICAgIGxvZ2dpbmc6IHtcbiAgICAgICAgc2xvd1NlYXJjaExvZ0VuYWJsZWQ6IHRydWUsXG4gICAgICAgIGFwcExvZ0VuYWJsZWQ6IHRydWUsXG4gICAgICB9LFxuICAgICAgbm9kZVRvTm9kZUVuY3J5cHRpb246IHRydWUsXG4gICAgICBlbmNyeXB0aW9uQXRSZXN0OiB7XG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIGttc0tleToga2V5LFxuICAgICAgfSxcbiAgICAgIC8vIHRlc3QgdGhlIGFjY2VzcyBwb2xpY2llcyBjdXN0b20gcmVzb3VyY2Ugd29ya3NcbiAgICAgIGFjY2Vzc1BvbGljaWVzOiBbXG4gICAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgICAgYWN0aW9uczogWydlczpFU0h0dHAqJ10sXG4gICAgICAgICAgcHJpbmNpcGFsczogW25ldyBpYW0uQWNjb3VudFJvb3RQcmluY2lwYWwoKV0sXG4gICAgICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH07XG5cbiAgICBuZXcgZXMuRG9tYWluKHRoaXMsICdEb21haW4nLCBkb21haW5Qcm9wcyk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xubmV3IFRlc3RTdGFjayhhcHAsICdjZGstaW50ZWctZWxhc3RpY3NlYXJjaC1jdXN0b20ta21zLWtleScpO1xuYXBwLnN5bnRoKCk7XG4iXX0=