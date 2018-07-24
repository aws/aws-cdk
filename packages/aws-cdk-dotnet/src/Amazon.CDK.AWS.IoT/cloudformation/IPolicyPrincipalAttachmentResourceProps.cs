using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IoT.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-policyprincipalattachment.html </remarks>
    [JsiiInterface(typeof(IPolicyPrincipalAttachmentResourceProps), "@aws-cdk/aws-iot.cloudformation.PolicyPrincipalAttachmentResourceProps")]
    public interface IPolicyPrincipalAttachmentResourceProps
    {
        /// <summary>``AWS::IoT::PolicyPrincipalAttachment.PolicyName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-policyprincipalattachment.html#cfn-iot-policyprincipalattachment-policyname </remarks>
        [JsiiProperty("policyName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object PolicyName
        {
            get;
            set;
        }

        /// <summary>``AWS::IoT::PolicyPrincipalAttachment.Principal``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-policyprincipalattachment.html#cfn-iot-policyprincipalattachment-principal </remarks>
        [JsiiProperty("principal", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Principal
        {
            get;
            set;
        }
    }
}