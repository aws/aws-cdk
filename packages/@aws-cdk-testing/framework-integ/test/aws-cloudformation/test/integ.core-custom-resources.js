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
const aws_cdk_lib_1 = require("aws-cdk-lib");
/* eslint-disable @aws-cdk/no-core-construct */
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        const resourceType = 'Custom::Reflect';
        const lengthyResourceType = 'Custom::Given_Resource_Type_Is_Exactly_Sixty_Characters_Long';
        const serviceToken = aws_cdk_lib_1.CustomResourceProvider.getOrCreate(this, resourceType, {
            codeDirectory: `${__dirname}/core-custom-resource-provider-fixture`,
            runtime: aws_cdk_lib_1.CustomResourceProviderRuntime.NODEJS_14_X,
            description: 'veni vidi vici',
        });
        const cr = new aws_cdk_lib_1.CustomResource(this, 'MyResource', {
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
        new aws_cdk_lib_1.CustomResource(this, 'MyLengthyTypeResource', {
            resourceType: lengthyResourceType,
            serviceToken,
            properties: {
                physicalResourceId: 'MyPhysicalLengthyType',
            },
        });
        new aws_cdk_lib_1.CfnOutput(this, 'Ref', { value: cr.ref });
        new aws_cdk_lib_1.CfnOutput(this, 'GetAtt.Attribute1', { value: aws_cdk_lib_1.Token.asString(cr.getAtt('Attribute1')) });
        new aws_cdk_lib_1.CfnOutput(this, 'GetAtt.Attribute2', { value: aws_cdk_lib_1.Token.asString(cr.getAtt('Attribute2')) });
    }
}
const app = new aws_cdk_lib_1.App();
new TestStack(app, 'custom-resource-test');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY29yZS1jdXN0b20tcmVzb3VyY2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuY29yZS1jdXN0b20tcmVzb3VyY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7R0FPRztBQUNILDZDQUFrSTtBQUdsSSwrQ0FBK0M7QUFFL0MsTUFBTSxTQUFVLFNBQVEsbUJBQUs7SUFDM0IsWUFBWSxLQUFnQixFQUFFLEVBQVU7UUFDdEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLFlBQVksR0FBRyxpQkFBaUIsQ0FBQztRQUN2QyxNQUFNLG1CQUFtQixHQUFHLDhEQUE4RCxDQUFDO1FBRTNGLE1BQU0sWUFBWSxHQUFHLG9DQUFzQixDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQzFFLGFBQWEsRUFBRSxHQUFHLFNBQVMsd0NBQXdDO1lBQ25FLE9BQU8sRUFBRSwyQ0FBNkIsQ0FBQyxXQUFXO1lBQ2xELFdBQVcsRUFBRSxnQkFBZ0I7U0FDOUIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxFQUFFLEdBQUcsSUFBSSw0QkFBYyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDaEQsWUFBWTtZQUNaLFlBQVk7WUFDWixVQUFVLEVBQUU7Z0JBQ1Ysa0JBQWtCLEVBQUUsdUJBQXVCO2dCQUMzQyxVQUFVLEVBQUU7b0JBQ1YsVUFBVSxFQUFFLEtBQUs7b0JBQ2pCLFVBQVUsRUFBRSxJQUFJO2lCQUNqQjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSw0QkFBYyxDQUFDLElBQUksRUFBRSx1QkFBdUIsRUFBRTtZQUNoRCxZQUFZLEVBQUUsbUJBQW1CO1lBQ2pDLFlBQVk7WUFDWixVQUFVLEVBQUU7Z0JBQ1Ysa0JBQWtCLEVBQUUsdUJBQXVCO2FBQzVDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSx1QkFBUyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDOUMsSUFBSSx1QkFBUyxDQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBRSxFQUFFLEtBQUssRUFBRSxtQkFBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdGLElBQUksdUJBQVMsQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsRUFBRSxLQUFLLEVBQUUsbUJBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMvRixDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUN0QixJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztBQUMzQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogU3RhY2sgdmVyaWZpY2F0aW9uIHN0ZXBzOlxuICogLSBEZXBsb3kgd2l0aCBgLS1uby1jbGVhbmBcbiAqIC0gVmVyaWZ5IHRoYXQgdGhlIENsb3VkRm9ybWF0aW9uIHN0YWNrIG91dHB1dHMgaGF2ZSB0aGUgZm9sbG93aW5nIHZhbHVlczpcbiAqICAgLSBSZWY6IFwiTXlQaHlzaWNhbFJlZmxlY3RCYWNrXCJcbiAqICAgLSBHZXRBdHQuQXR0cmlidXRlMTogXCJmb29cIlxuICogICAtIEdldEF0dC5BdHRyaWJ1dGUyOiAxMjM0XG4gKi9cbmltcG9ydCB7IEFwcCwgQ2ZuT3V0cHV0LCBDdXN0b21SZXNvdXJjZSwgQ3VzdG9tUmVzb3VyY2VQcm92aWRlciwgQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJ1bnRpbWUsIFN0YWNrLCBUb2tlbiB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBAYXdzLWNkay9uby1jb3JlLWNvbnN0cnVjdCAqL1xuXG5jbGFzcyBUZXN0U3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgcmVzb3VyY2VUeXBlID0gJ0N1c3RvbTo6UmVmbGVjdCc7XG4gICAgY29uc3QgbGVuZ3RoeVJlc291cmNlVHlwZSA9ICdDdXN0b206OkdpdmVuX1Jlc291cmNlX1R5cGVfSXNfRXhhY3RseV9TaXh0eV9DaGFyYWN0ZXJzX0xvbmcnO1xuXG4gICAgY29uc3Qgc2VydmljZVRva2VuID0gQ3VzdG9tUmVzb3VyY2VQcm92aWRlci5nZXRPckNyZWF0ZSh0aGlzLCByZXNvdXJjZVR5cGUsIHtcbiAgICAgIGNvZGVEaXJlY3Rvcnk6IGAke19fZGlybmFtZX0vY29yZS1jdXN0b20tcmVzb3VyY2UtcHJvdmlkZXItZml4dHVyZWAsXG4gICAgICBydW50aW1lOiBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGRlc2NyaXB0aW9uOiAndmVuaSB2aWRpIHZpY2knLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY3IgPSBuZXcgQ3VzdG9tUmVzb3VyY2UodGhpcywgJ015UmVzb3VyY2UnLCB7XG4gICAgICByZXNvdXJjZVR5cGUsXG4gICAgICBzZXJ2aWNlVG9rZW4sXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogJ015UGh5c2ljYWxSZWZsZWN0QmFjaycsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBBdHRyaWJ1dGUxOiAnZm9vJyxcbiAgICAgICAgICBBdHRyaWJ1dGUyOiAxMjM0LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIG5ldyBDdXN0b21SZXNvdXJjZSh0aGlzLCAnTXlMZW5ndGh5VHlwZVJlc291cmNlJywge1xuICAgICAgcmVzb3VyY2VUeXBlOiBsZW5ndGh5UmVzb3VyY2VUeXBlLFxuICAgICAgc2VydmljZVRva2VuLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQ6ICdNeVBoeXNpY2FsTGVuZ3RoeVR5cGUnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgJ1JlZicsIHsgdmFsdWU6IGNyLnJlZiB9KTtcbiAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdHZXRBdHQuQXR0cmlidXRlMScsIHsgdmFsdWU6IFRva2VuLmFzU3RyaW5nKGNyLmdldEF0dCgnQXR0cmlidXRlMScpKSB9KTtcbiAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdHZXRBdHQuQXR0cmlidXRlMicsIHsgdmFsdWU6IFRva2VuLmFzU3RyaW5nKGNyLmdldEF0dCgnQXR0cmlidXRlMicpKSB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5uZXcgVGVzdFN0YWNrKGFwcCwgJ2N1c3RvbS1yZXNvdXJjZS10ZXN0Jyk7XG5hcHAuc3ludGgoKTtcbiJdfQ==