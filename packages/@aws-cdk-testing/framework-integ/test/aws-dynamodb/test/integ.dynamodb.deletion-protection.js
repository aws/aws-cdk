"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_dynamodb_1 = require("aws-cdk-lib/aws-dynamodb");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        this.table = new aws_dynamodb_1.Table(this, 'Table', {
            partitionKey: { name: 'pk', type: aws_dynamodb_1.AttributeType.STRING },
            deletionProtection: true,
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            tableName: 'deletion-protection-test',
        });
    }
}
exports.TestStack = TestStack;
const app = new aws_cdk_lib_1.App();
const stack = new TestStack(app, 'deletion-protection-stack', {
    env: {
        region: 'us-east-1',
        account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    },
});
new integ_tests_alpha_1.IntegTest(app, 'deletion-protection-integ-test', {
    testCases: [stack],
    regions: ['us-east-1'],
    cdkCommandOptions: {
        deploy: {
            args: {
                rollback: true,
            },
        },
    },
    hooks: {
        postDeploy: [
            'aws dynamodb update-table --no-cli-pager --region us-east-1 --table-name deletion-protection-test --no-deletion-protection-enabled',
        ],
    },
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZHluYW1vZGIuZGVsZXRpb24tcHJvdGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmR5bmFtb2RiLmRlbGV0aW9uLXByb3RlY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkNBQW9FO0FBQ3BFLGtFQUF1RDtBQUV2RCwyREFBZ0U7QUFFaEUsTUFBYSxTQUFVLFNBQVEsbUJBQUs7SUFHbEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksb0JBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO1lBQ3BDLFlBQVksRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLDRCQUFhLENBQUMsTUFBTSxFQUFFO1lBQ3hELGtCQUFrQixFQUFFLElBQUk7WUFDeEIsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztZQUNwQyxTQUFTLEVBQUUsMEJBQTBCO1NBQ3RDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQWJELDhCQWFDO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLDJCQUEyQixFQUFFO0lBQzVELEdBQUcsRUFBRTtRQUNILE1BQU0sRUFBRSxXQUFXO1FBQ25CLE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CO0tBQzFFO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsSUFBSSw2QkFBUyxDQUFDLEdBQUcsRUFBRSxnQ0FBZ0MsRUFBRTtJQUNuRCxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7SUFDbEIsT0FBTyxFQUFFLENBQUMsV0FBVyxDQUFDO0lBQ3RCLGlCQUFpQixFQUFFO1FBQ2pCLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRTtnQkFDSixRQUFRLEVBQUUsSUFBSTthQUNmO1NBQ0Y7S0FDRjtJQUNELEtBQUssRUFBRTtRQUNMLFVBQVUsRUFBRTtZQUNWLG9JQUFvSTtTQUNySTtLQUNGO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwLCBSZW1vdmFsUG9saWN5LCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEludGVnVGVzdCB9IGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQXR0cmlidXRlVHlwZSwgVGFibGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZHluYW1vZGInO1xuXG5leHBvcnQgY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgU3RhY2sge1xuXG4gIHJlYWRvbmx5IHRhYmxlOiBUYWJsZTtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICB0aGlzLnRhYmxlID0gbmV3IFRhYmxlKHRoaXMsICdUYWJsZScsIHtcbiAgICAgIHBhcnRpdGlvbktleTogeyBuYW1lOiAncGsnLCB0eXBlOiBBdHRyaWJ1dGVUeXBlLlNUUklORyB9LFxuICAgICAgZGVsZXRpb25Qcm90ZWN0aW9uOiB0cnVlLFxuICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgdGFibGVOYW1lOiAnZGVsZXRpb24tcHJvdGVjdGlvbi10ZXN0JyxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBUZXN0U3RhY2soYXBwLCAnZGVsZXRpb24tcHJvdGVjdGlvbi1zdGFjaycsIHtcbiAgZW52OiB7XG4gICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICBhY2NvdW50OiBwcm9jZXNzLmVudi5DREtfSU5URUdfQUNDT1VOVCB8fCBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9BQ0NPVU5ULFxuICB9LFxufSk7XG5cbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnZGVsZXRpb24tcHJvdGVjdGlvbi1pbnRlZy10ZXN0Jywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG4gIHJlZ2lvbnM6IFsndXMtZWFzdC0xJ10sXG4gIGNka0NvbW1hbmRPcHRpb25zOiB7XG4gICAgZGVwbG95OiB7XG4gICAgICBhcmdzOiB7XG4gICAgICAgIHJvbGxiYWNrOiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBob29rczoge1xuICAgIHBvc3REZXBsb3k6IFtcbiAgICAgICdhd3MgZHluYW1vZGIgdXBkYXRlLXRhYmxlIC0tbm8tY2xpLXBhZ2VyIC0tcmVnaW9uIHVzLWVhc3QtMSAtLXRhYmxlLW5hbWUgZGVsZXRpb24tcHJvdGVjdGlvbi10ZXN0IC0tbm8tZGVsZXRpb24tcHJvdGVjdGlvbi1lbmFibGVkJyxcbiAgICBdLFxuICB9LFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19