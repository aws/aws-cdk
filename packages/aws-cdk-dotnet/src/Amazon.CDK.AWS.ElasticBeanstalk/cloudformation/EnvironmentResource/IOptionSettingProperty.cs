using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticBeanstalk.cloudformation.EnvironmentResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk-option-settings.html </remarks>
    [JsiiInterface(typeof(IOptionSettingProperty), "@aws-cdk/aws-elasticbeanstalk.cloudformation.EnvironmentResource.OptionSettingProperty")]
    public interface IOptionSettingProperty
    {
        /// <summary>``EnvironmentResource.OptionSettingProperty.Namespace``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk-option-settings.html#cfn-beanstalk-optionsettings-namespace </remarks>
        [JsiiProperty("namespace", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Namespace
        {
            get;
            set;
        }

        /// <summary>``EnvironmentResource.OptionSettingProperty.OptionName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk-option-settings.html#cfn-beanstalk-optionsettings-optionname </remarks>
        [JsiiProperty("optionName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object OptionName
        {
            get;
            set;
        }

        /// <summary>``EnvironmentResource.OptionSettingProperty.ResourceName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk-option-settings.html#cfn-elasticbeanstalk-environment-optionsetting-resourcename </remarks>
        [JsiiProperty("resourceName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ResourceName
        {
            get;
            set;
        }

        /// <summary>``EnvironmentResource.OptionSettingProperty.Value``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk-option-settings.html#cfn-beanstalk-optionsettings-value </remarks>
        [JsiiProperty("value", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Value
        {
            get;
            set;
        }
    }
}