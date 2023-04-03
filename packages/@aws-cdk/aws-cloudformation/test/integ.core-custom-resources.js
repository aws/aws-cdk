"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Stack verification steps:
 * - Deploy with `--no-clean`
 * - Verify that the CloudFormation stack outputs have the following values:
 *   - Ref: "MyPhysicalReflectBack"
 *   - GetAtt.Attribute1: "foo"
 *   - GetAtt.Attribute2: 1234
 */
const core_1 = require("@aws-cdk/core");
/* eslint-disable @aws-cdk/no-core-construct */
class TestStack extends core_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        const resourceType = 'Custom::Reflect';
        const lengthyResourceType = 'Custom::Given_Resource_Type_Is_Exactly_Sixty_Characters_Long';
        const serviceToken = core_1.CustomResourceProvider.getOrCreate(this, resourceType, {
            codeDirectory: `${__dirname}/core-custom-resource-provider-fixture`,
            runtime: core_1.CustomResourceProviderRuntime.NODEJS_14_X,
            description: 'veni vidi vici',
        });
        const cr = new core_1.CustomResource(this, 'MyResource', {
            resourceType,
            serviceToken,
            properties: {
                physicalResourceId: 'MyPhysicalReflectBack',
                attributes: {
                    Attribute1: 'foo',
                    Attribute2: 1234,
                },
            },
        });
        new core_1.CustomResource(this, 'MyLengthyTypeResource', {
            resourceType: lengthyResourceType,
            serviceToken,
            properties: {
                physicalResourceId: 'MyPhysicalLengthyType',
            },
        });
        new core_1.CfnOutput(this, 'Ref', { value: cr.ref });
        new core_1.CfnOutput(this, 'GetAtt.Attribute1', { value: core_1.Token.asString(cr.getAtt('Attribute1')) });
        new core_1.CfnOutput(this, 'GetAtt.Attribute2', { value: core_1.Token.asString(cr.getAtt('Attribute2')) });
    }
}
const app = new core_1.App();
new TestStack(app, 'custom-resource-test');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY29yZS1jdXN0b20tcmVzb3VyY2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuY29yZS1jdXN0b20tcmVzb3VyY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7R0FPRztBQUNILHdDQUFvSTtBQUdwSSwrQ0FBK0M7QUFFL0MsTUFBTSxTQUFVLFNBQVEsWUFBSztJQUMzQixZQUFZLEtBQWdCLEVBQUUsRUFBVTtRQUN0QyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sWUFBWSxHQUFHLGlCQUFpQixDQUFDO1FBQ3ZDLE1BQU0sbUJBQW1CLEdBQUcsOERBQThELENBQUM7UUFFM0YsTUFBTSxZQUFZLEdBQUcsNkJBQXNCLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDMUUsYUFBYSxFQUFFLEdBQUcsU0FBUyx3Q0FBd0M7WUFDbkUsT0FBTyxFQUFFLG9DQUE2QixDQUFDLFdBQVc7WUFDbEQsV0FBVyxFQUFFLGdCQUFnQjtTQUM5QixDQUFDLENBQUM7UUFFSCxNQUFNLEVBQUUsR0FBRyxJQUFJLHFCQUFjLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUNoRCxZQUFZO1lBQ1osWUFBWTtZQUNaLFVBQVUsRUFBRTtnQkFDVixrQkFBa0IsRUFBRSx1QkFBdUI7Z0JBQzNDLFVBQVUsRUFBRTtvQkFDVixVQUFVLEVBQUUsS0FBSztvQkFDakIsVUFBVSxFQUFFLElBQUk7aUJBQ2pCO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLHFCQUFjLENBQUMsSUFBSSxFQUFFLHVCQUF1QixFQUFFO1lBQ2hELFlBQVksRUFBRSxtQkFBbUI7WUFDakMsWUFBWTtZQUNaLFVBQVUsRUFBRTtnQkFDVixrQkFBa0IsRUFBRSx1QkFBdUI7YUFDNUM7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLGdCQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUM5QyxJQUFJLGdCQUFTLENBQUMsSUFBSSxFQUFFLG1CQUFtQixFQUFFLEVBQUUsS0FBSyxFQUFFLFlBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM3RixJQUFJLGdCQUFTLENBQUMsSUFBSSxFQUFFLG1CQUFtQixFQUFFLEVBQUUsS0FBSyxFQUFFLFlBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUM5RjtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztBQUN0QixJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztBQUMzQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogU3RhY2sgdmVyaWZpY2F0aW9uIHN0ZXBzOlxuICogLSBEZXBsb3kgd2l0aCBgLS1uby1jbGVhbmBcbiAqIC0gVmVyaWZ5IHRoYXQgdGhlIENsb3VkRm9ybWF0aW9uIHN0YWNrIG91dHB1dHMgaGF2ZSB0aGUgZm9sbG93aW5nIHZhbHVlczpcbiAqICAgLSBSZWY6IFwiTXlQaHlzaWNhbFJlZmxlY3RCYWNrXCJcbiAqICAgLSBHZXRBdHQuQXR0cmlidXRlMTogXCJmb29cIlxuICogICAtIEdldEF0dC5BdHRyaWJ1dGUyOiAxMjM0XG4gKi9cbmltcG9ydCB7IEFwcCwgQ2ZuT3V0cHV0LCBDdXN0b21SZXNvdXJjZSwgQ3VzdG9tUmVzb3VyY2VQcm92aWRlciwgQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJ1bnRpbWUsIFN0YWNrLCBUb2tlbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbi8qIGVzbGludC1kaXNhYmxlIEBhd3MtY2RrL25vLWNvcmUtY29uc3RydWN0ICovXG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCByZXNvdXJjZVR5cGUgPSAnQ3VzdG9tOjpSZWZsZWN0JztcbiAgICBjb25zdCBsZW5ndGh5UmVzb3VyY2VUeXBlID0gJ0N1c3RvbTo6R2l2ZW5fUmVzb3VyY2VfVHlwZV9Jc19FeGFjdGx5X1NpeHR5X0NoYXJhY3RlcnNfTG9uZyc7XG5cbiAgICBjb25zdCBzZXJ2aWNlVG9rZW4gPSBDdXN0b21SZXNvdXJjZVByb3ZpZGVyLmdldE9yQ3JlYXRlKHRoaXMsIHJlc291cmNlVHlwZSwge1xuICAgICAgY29kZURpcmVjdG9yeTogYCR7X19kaXJuYW1lfS9jb3JlLWN1c3RvbS1yZXNvdXJjZS1wcm92aWRlci1maXh0dXJlYCxcbiAgICAgIHJ1bnRpbWU6IEN1c3RvbVJlc291cmNlUHJvdmlkZXJSdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgZGVzY3JpcHRpb246ICd2ZW5pIHZpZGkgdmljaScsXG4gICAgfSk7XG5cbiAgICBjb25zdCBjciA9IG5ldyBDdXN0b21SZXNvdXJjZSh0aGlzLCAnTXlSZXNvdXJjZScsIHtcbiAgICAgIHJlc291cmNlVHlwZSxcbiAgICAgIHNlcnZpY2VUb2tlbixcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkOiAnTXlQaHlzaWNhbFJlZmxlY3RCYWNrJyxcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgIEF0dHJpYnV0ZTE6ICdmb28nLFxuICAgICAgICAgIEF0dHJpYnV0ZTI6IDEyMzQsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgbmV3IEN1c3RvbVJlc291cmNlKHRoaXMsICdNeUxlbmd0aHlUeXBlUmVzb3VyY2UnLCB7XG4gICAgICByZXNvdXJjZVR5cGU6IGxlbmd0aHlSZXNvdXJjZVR5cGUsXG4gICAgICBzZXJ2aWNlVG9rZW4sXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogJ015UGh5c2ljYWxMZW5ndGh5VHlwZScsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgbmV3IENmbk91dHB1dCh0aGlzLCAnUmVmJywgeyB2YWx1ZTogY3IucmVmIH0pO1xuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgJ0dldEF0dC5BdHRyaWJ1dGUxJywgeyB2YWx1ZTogVG9rZW4uYXNTdHJpbmcoY3IuZ2V0QXR0KCdBdHRyaWJ1dGUxJykpIH0pO1xuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgJ0dldEF0dC5BdHRyaWJ1dGUyJywgeyB2YWx1ZTogVG9rZW4uYXNTdHJpbmcoY3IuZ2V0QXR0KCdBdHRyaWJ1dGUyJykpIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbm5ldyBUZXN0U3RhY2soYXBwLCAnY3VzdG9tLXJlc291cmNlLXRlc3QnKTtcbmFwcC5zeW50aCgpO1xuIl19