using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IAM.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-accesskey.html </remarks>
    [JsiiInterfaceProxy(typeof(IAccessKeyResourceProps), "@aws-cdk/aws-iam.cloudformation.AccessKeyResourceProps")]
    internal class AccessKeyResourcePropsProxy : DeputyBase, IAccessKeyResourceProps
    {
        private AccessKeyResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::IAM::AccessKey.UserName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-accesskey.html#cfn-iam-accesskey-username </remarks>
        [JsiiProperty("userName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object UserName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::IAM::AccessKey.Serial``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-accesskey.html#cfn-iam-accesskey-serial </remarks>
        [JsiiProperty("serial", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Serial
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::IAM::AccessKey.Status``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-accesskey.html#cfn-iam-accesskey-status </remarks>
        [JsiiProperty("status", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Status
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}