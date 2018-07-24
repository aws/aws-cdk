using Amazon.CDK;
using Amazon.CDK.AWS.Config.cloudformation.ConfigurationRecorderResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Config.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationrecorder.html </remarks>
    [JsiiInterfaceProxy(typeof(IConfigurationRecorderResourceProps), "@aws-cdk/aws-config.cloudformation.ConfigurationRecorderResourceProps")]
    internal class ConfigurationRecorderResourcePropsProxy : DeputyBase, IConfigurationRecorderResourceProps
    {
        private ConfigurationRecorderResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::Config::ConfigurationRecorder.RoleARN``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationrecorder.html#cfn-config-configurationrecorder-rolearn </remarks>
        [JsiiProperty("roleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object RoleArn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::Config::ConfigurationRecorder.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationrecorder.html#cfn-config-configurationrecorder-name </remarks>
        [JsiiProperty("configurationRecorderName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ConfigurationRecorderName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::Config::ConfigurationRecorder.RecordingGroup``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configurationrecorder.html#cfn-config-configurationrecorder-recordinggroup </remarks>
        [JsiiProperty("recordingGroup", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-config.cloudformation.ConfigurationRecorderResource.RecordingGroupProperty\"}]},\"optional\":true}")]
        public virtual object RecordingGroup
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}