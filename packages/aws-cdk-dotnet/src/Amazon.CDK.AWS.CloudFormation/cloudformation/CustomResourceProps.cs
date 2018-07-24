using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFormation.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cfn-customresource.html </remarks>
    public class CustomResourceProps : DeputyBase, ICustomResourceProps
    {
        /// <summary>``AWS::CloudFormation::CustomResource.ServiceToken``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cfn-customresource.html#cfn-customresource-servicetoken </remarks>
        [JsiiProperty("serviceToken", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object ServiceToken
        {
            get;
            set;
        }
    }
}