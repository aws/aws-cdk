using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Cognito.cloudformation.UserPoolResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-deviceconfiguration.html </remarks>
    [JsiiInterface(typeof(IDeviceConfigurationProperty), "@aws-cdk/aws-cognito.cloudformation.UserPoolResource.DeviceConfigurationProperty")]
    public interface IDeviceConfigurationProperty
    {
        /// <summary>``UserPoolResource.DeviceConfigurationProperty.ChallengeRequiredOnNewDevice``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-deviceconfiguration.html#cfn-cognito-userpool-deviceconfiguration-challengerequiredonnewdevice </remarks>
        [JsiiProperty("challengeRequiredOnNewDevice", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ChallengeRequiredOnNewDevice
        {
            get;
            set;
        }

        /// <summary>``UserPoolResource.DeviceConfigurationProperty.DeviceOnlyRememberedOnUserPrompt``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-deviceconfiguration.html#cfn-cognito-userpool-deviceconfiguration-deviceonlyrememberedonuserprompt </remarks>
        [JsiiProperty("deviceOnlyRememberedOnUserPrompt", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DeviceOnlyRememberedOnUserPrompt
        {
            get;
            set;
        }
    }
}