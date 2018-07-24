using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Cognito.cloudformation.UserPoolResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-smsconfiguration.html </remarks>
    [JsiiInterfaceProxy(typeof(ISmsConfigurationProperty), "@aws-cdk/aws-cognito.cloudformation.UserPoolResource.SmsConfigurationProperty")]
    internal class SmsConfigurationPropertyProxy : DeputyBase, ISmsConfigurationProperty
    {
        private SmsConfigurationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``UserPoolResource.SmsConfigurationProperty.ExternalId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-smsconfiguration.html#cfn-cognito-userpool-smsconfiguration-externalid </remarks>
        [JsiiProperty("externalId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ExternalId
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``UserPoolResource.SmsConfigurationProperty.SnsCallerArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-smsconfiguration.html#cfn-cognito-userpool-smsconfiguration-snscallerarn </remarks>
        [JsiiProperty("snsCallerArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object SnsCallerArn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}