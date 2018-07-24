using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFormation.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cfn-customresource.html </remarks>
    [JsiiInterfaceProxy(typeof(ICustomResourceProps), "@aws-cdk/aws-cloudformation.cloudformation.CustomResourceProps")]
    internal class CustomResourcePropsProxy : DeputyBase, ICustomResourceProps
    {
        private CustomResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::CloudFormation::CustomResource.ServiceToken``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cfn-customresource.html#cfn-customresource-servicetoken </remarks>
        [JsiiProperty("serviceToken", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object ServiceToken
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}