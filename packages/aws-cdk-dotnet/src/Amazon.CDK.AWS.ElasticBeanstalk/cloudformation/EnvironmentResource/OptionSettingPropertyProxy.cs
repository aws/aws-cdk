using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticBeanstalk.cloudformation.EnvironmentResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk-option-settings.html </remarks>
    [JsiiInterfaceProxy(typeof(IOptionSettingProperty), "@aws-cdk/aws-elasticbeanstalk.cloudformation.EnvironmentResource.OptionSettingProperty")]
    internal class OptionSettingPropertyProxy : DeputyBase, IOptionSettingProperty
    {
        private OptionSettingPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``EnvironmentResource.OptionSettingProperty.Namespace``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk-option-settings.html#cfn-beanstalk-optionsettings-namespace </remarks>
        [JsiiProperty("namespace", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Namespace
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``EnvironmentResource.OptionSettingProperty.OptionName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk-option-settings.html#cfn-beanstalk-optionsettings-optionname </remarks>
        [JsiiProperty("optionName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object OptionName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``EnvironmentResource.OptionSettingProperty.ResourceName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk-option-settings.html#cfn-elasticbeanstalk-environment-optionsetting-resourcename </remarks>
        [JsiiProperty("resourceName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ResourceName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``EnvironmentResource.OptionSettingProperty.Value``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk-option-settings.html#cfn-beanstalk-optionsettings-value </remarks>
        [JsiiProperty("value", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Value
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}