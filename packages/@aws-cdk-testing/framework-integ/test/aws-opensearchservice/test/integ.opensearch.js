"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const iam = require("aws-cdk-lib/aws-iam");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const opensearch = require("aws-cdk-lib/aws-opensearchservice");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const domainProps = {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            version: opensearch.EngineVersion.ELASTICSEARCH_7_1,
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
        // create 2 domains to ensure that Cloudwatch Log Group policy names dont conflict
        new opensearch.Domain(this, 'Domain1', domainProps);
        new opensearch.Domain(this, 'Domain2', domainProps);
    }
}
const app = new aws_cdk_lib_1.App();
new TestStack(app, 'cdk-integ-opensearch');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcub3BlbnNlYXJjaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLm9wZW5zZWFyY2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpREFBMEQ7QUFDMUQsMkNBQTJDO0FBQzNDLDZDQUFvRTtBQUVwRSxnRUFBZ0U7QUFFaEUsTUFBTSxTQUFVLFNBQVEsbUJBQUs7SUFDM0IsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLFdBQVcsR0FBMkI7WUFDMUMsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztZQUNwQyxPQUFPLEVBQUUsVUFBVSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUI7WUFDbkQsR0FBRyxFQUFFO2dCQUNILFVBQVUsRUFBRSxFQUFFO2dCQUNkLFVBQVUsRUFBRSw2QkFBbUIsQ0FBQyxtQkFBbUI7YUFDcEQ7WUFDRCxPQUFPLEVBQUU7Z0JBQ1Asb0JBQW9CLEVBQUUsSUFBSTtnQkFDMUIsYUFBYSxFQUFFLElBQUk7YUFDcEI7WUFDRCxvQkFBb0IsRUFBRSxJQUFJO1lBQzFCLGdCQUFnQixFQUFFO2dCQUNoQixPQUFPLEVBQUUsSUFBSTthQUNkO1lBQ0QsZUFBZSxFQUFFO2dCQUNmLHdDQUF3QyxFQUFFLE9BQU87Z0JBQ2pELDhCQUE4QixFQUFFLElBQUk7Z0JBQ3BDLHFDQUFxQyxFQUFFLE1BQU07YUFDOUM7WUFDRCxpREFBaUQ7WUFDakQsY0FBYyxFQUFFO2dCQUNkLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztvQkFDdEIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSztvQkFDeEIsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUN2QixVQUFVLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO29CQUM1QyxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUM7aUJBQ2pCLENBQUM7YUFDSDtTQUNGLENBQUM7UUFFRixrRkFBa0Y7UUFDbEYsSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDcEQsSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDdEQsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFDdEIsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLHNCQUFzQixDQUFDLENBQUM7QUFDM0MsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRWJzRGV2aWNlVm9sdW1lVHlwZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0IHsgQXBwLCBSZW1vdmFsUG9saWN5LCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgb3BlbnNlYXJjaCBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtb3BlbnNlYXJjaHNlcnZpY2UnO1xuXG5jbGFzcyBUZXN0U3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgZG9tYWluUHJvcHM6IG9wZW5zZWFyY2guRG9tYWluUHJvcHMgPSB7XG4gICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICB2ZXJzaW9uOiBvcGVuc2VhcmNoLkVuZ2luZVZlcnNpb24uRUxBU1RJQ1NFQVJDSF83XzEsXG4gICAgICBlYnM6IHtcbiAgICAgICAgdm9sdW1lU2l6ZTogMTAsXG4gICAgICAgIHZvbHVtZVR5cGU6IEVic0RldmljZVZvbHVtZVR5cGUuR0VORVJBTF9QVVJQT1NFX1NTRCxcbiAgICAgIH0sXG4gICAgICBsb2dnaW5nOiB7XG4gICAgICAgIHNsb3dTZWFyY2hMb2dFbmFibGVkOiB0cnVlLFxuICAgICAgICBhcHBMb2dFbmFibGVkOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIG5vZGVUb05vZGVFbmNyeXB0aW9uOiB0cnVlLFxuICAgICAgZW5jcnlwdGlvbkF0UmVzdDoge1xuICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIGFkdmFuY2VkT3B0aW9uczoge1xuICAgICAgICAncmVzdC5hY3Rpb24ubXVsdGkuYWxsb3dfZXhwbGljaXRfaW5kZXgnOiAnZmFsc2UnLFxuICAgICAgICAnaW5kaWNlcy5maWVsZGRhdGEuY2FjaGUuc2l6ZSc6ICcyNScsXG4gICAgICAgICdpbmRpY2VzLnF1ZXJ5LmJvb2wubWF4X2NsYXVzZV9jb3VudCc6ICcyMDQ4JyxcbiAgICAgIH0sXG4gICAgICAvLyB0ZXN0IHRoZSBhY2Nlc3MgcG9saWNpZXMgY3VzdG9tIHJlc291cmNlIHdvcmtzXG4gICAgICBhY2Nlc3NQb2xpY2llczogW1xuICAgICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgICAgIGFjdGlvbnM6IFsnZXM6RVNIdHRwKiddLFxuICAgICAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLkFjY291bnRSb290UHJpbmNpcGFsKCldLFxuICAgICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9O1xuXG4gICAgLy8gY3JlYXRlIDIgZG9tYWlucyB0byBlbnN1cmUgdGhhdCBDbG91ZHdhdGNoIExvZyBHcm91cCBwb2xpY3kgbmFtZXMgZG9udCBjb25mbGljdFxuICAgIG5ldyBvcGVuc2VhcmNoLkRvbWFpbih0aGlzLCAnRG9tYWluMScsIGRvbWFpblByb3BzKTtcbiAgICBuZXcgb3BlbnNlYXJjaC5Eb21haW4odGhpcywgJ0RvbWFpbjInLCBkb21haW5Qcm9wcyk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xubmV3IFRlc3RTdGFjayhhcHAsICdjZGstaW50ZWctb3BlbnNlYXJjaCcpO1xuYXBwLnN5bnRoKCk7XG4iXX0=