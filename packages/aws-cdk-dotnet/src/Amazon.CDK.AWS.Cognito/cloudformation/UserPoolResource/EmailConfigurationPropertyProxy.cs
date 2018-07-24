using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Cognito.cloudformation.UserPoolResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-emailconfiguration.html </remarks>
    [JsiiInterfaceProxy(typeof(IEmailConfigurationProperty), "@aws-cdk/aws-cognito.cloudformation.UserPoolResource.EmailConfigurationProperty")]
    internal class EmailConfigurationPropertyProxy : DeputyBase, IEmailConfigurationProperty
    {
        private EmailConfigurationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``UserPoolResource.EmailConfigurationProperty.ReplyToEmailAddress``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-emailconfiguration.html#cfn-cognito-userpool-emailconfiguration-replytoemailaddress </remarks>
        [JsiiProperty("replyToEmailAddress", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ReplyToEmailAddress
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``UserPoolResource.EmailConfigurationProperty.SourceArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-emailconfiguration.html#cfn-cognito-userpool-emailconfiguration-sourcearn </remarks>
        [JsiiProperty("sourceArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object SourceArn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}