using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Cognito.cloudformation.UserPoolResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-deviceconfiguration.html </remarks>
    [JsiiInterfaceProxy(typeof(IDeviceConfigurationProperty), "@aws-cdk/aws-cognito.cloudformation.UserPoolResource.DeviceConfigurationProperty")]
    internal class DeviceConfigurationPropertyProxy : DeputyBase, IDeviceConfigurationProperty
    {
        private DeviceConfigurationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``UserPoolResource.DeviceConfigurationProperty.ChallengeRequiredOnNewDevice``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-deviceconfiguration.html#cfn-cognito-userpool-deviceconfiguration-challengerequiredonnewdevice </remarks>
        [JsiiProperty("challengeRequiredOnNewDevice", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ChallengeRequiredOnNewDevice
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``UserPoolResource.DeviceConfigurationProperty.DeviceOnlyRememberedOnUserPrompt``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-deviceconfiguration.html#cfn-cognito-userpool-deviceconfiguration-deviceonlyrememberedonuserprompt </remarks>
        [JsiiProperty("deviceOnlyRememberedOnUserPrompt", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object DeviceOnlyRememberedOnUserPrompt
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}