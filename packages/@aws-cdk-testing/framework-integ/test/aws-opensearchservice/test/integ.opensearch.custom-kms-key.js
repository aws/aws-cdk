"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iam = require("aws-cdk-lib/aws-iam");
const kms = require("aws-cdk-lib/aws-kms");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const opensearch = require("aws-cdk-lib/aws-opensearchservice");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const key = new kms.Key(this, 'Key');
        const domainProps = {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            version: opensearch.EngineVersion.ELASTICSEARCH_7_1,
            encryptionAtRest: {
                enabled: true,
                kmsKey: key,
            },
            accessPolicies: [
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ['es:ESHttp*'],
                    principals: [new iam.AccountRootPrincipal()],
                    resources: ['*'],
                }),
            ],
        };
        new opensearch.Domain(this, 'Domain', domainProps);
    }
}
const app = new aws_cdk_lib_1.App();
new TestStack(app, 'cdk-integ-opensearch-custom-kms-key');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcub3BlbnNlYXJjaC5jdXN0b20ta21zLWtleS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLm9wZW5zZWFyY2guY3VzdG9tLWttcy1rZXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBMkM7QUFDM0MsMkNBQTJDO0FBQzNDLDZDQUFvRTtBQUVwRSxnRUFBZ0U7QUFFaEUsTUFBTSxTQUFVLFNBQVEsbUJBQUs7SUFDM0IsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXJDLE1BQU0sV0FBVyxHQUEyQjtZQUMxQyxhQUFhLEVBQUUsMkJBQWEsQ0FBQyxPQUFPO1lBQ3BDLE9BQU8sRUFBRSxVQUFVLENBQUMsYUFBYSxDQUFDLGlCQUFpQjtZQUNuRCxnQkFBZ0IsRUFBRTtnQkFDaEIsT0FBTyxFQUFFLElBQUk7Z0JBQ2IsTUFBTSxFQUFFLEdBQUc7YUFDWjtZQUNELGNBQWMsRUFBRTtnQkFDZCxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7b0JBQ3RCLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUs7b0JBQ3hCLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDdkIsVUFBVSxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztvQkFDNUMsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDO2lCQUNqQixDQUFDO2FBQ0g7U0FDRixDQUFDO1FBRUYsSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDckQsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFDdEIsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLHFDQUFxQyxDQUFDLENBQUM7QUFDMUQsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMga21zIGZyb20gJ2F3cy1jZGstbGliL2F3cy1rbXMnO1xuaW1wb3J0IHsgQXBwLCBSZW1vdmFsUG9saWN5LCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgb3BlbnNlYXJjaCBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtb3BlbnNlYXJjaHNlcnZpY2UnO1xuXG5jbGFzcyBUZXN0U3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3Qga2V5ID0gbmV3IGttcy5LZXkodGhpcywgJ0tleScpO1xuXG4gICAgY29uc3QgZG9tYWluUHJvcHM6IG9wZW5zZWFyY2guRG9tYWluUHJvcHMgPSB7XG4gICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICB2ZXJzaW9uOiBvcGVuc2VhcmNoLkVuZ2luZVZlcnNpb24uRUxBU1RJQ1NFQVJDSF83XzEsXG4gICAgICBlbmNyeXB0aW9uQXRSZXN0OiB7XG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIGttc0tleToga2V5LFxuICAgICAgfSxcbiAgICAgIGFjY2Vzc1BvbGljaWVzOiBbXG4gICAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgICAgYWN0aW9uczogWydlczpFU0h0dHAqJ10sXG4gICAgICAgICAgcHJpbmNpcGFsczogW25ldyBpYW0uQWNjb3VudFJvb3RQcmluY2lwYWwoKV0sXG4gICAgICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH07XG5cbiAgICBuZXcgb3BlbnNlYXJjaC5Eb21haW4odGhpcywgJ0RvbWFpbicsIGRvbWFpblByb3BzKTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5uZXcgVGVzdFN0YWNrKGFwcCwgJ2Nkay1pbnRlZy1vcGVuc2VhcmNoLWN1c3RvbS1rbXMta2V5Jyk7XG5hcHAuc3ludGgoKTtcbiJdfQ==