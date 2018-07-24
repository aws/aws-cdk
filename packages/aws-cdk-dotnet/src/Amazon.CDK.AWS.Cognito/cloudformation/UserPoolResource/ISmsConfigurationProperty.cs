using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Cognito.cloudformation.UserPoolResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-smsconfiguration.html </remarks>
    [JsiiInterface(typeof(ISmsConfigurationProperty), "@aws-cdk/aws-cognito.cloudformation.UserPoolResource.SmsConfigurationProperty")]
    public interface ISmsConfigurationProperty
    {
        /// <summary>``UserPoolResource.SmsConfigurationProperty.ExternalId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-smsconfiguration.html#cfn-cognito-userpool-smsconfiguration-externalid </remarks>
        [JsiiProperty("externalId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ExternalId
        {
            get;
            set;
        }

        /// <summary>``UserPoolResource.SmsConfigurationProperty.SnsCallerArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-smsconfiguration.html#cfn-cognito-userpool-smsconfiguration-snscallerarn </remarks>
        [JsiiProperty("snsCallerArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object SnsCallerArn
        {
            get;
            set;
        }
    }
}