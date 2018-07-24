using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticBeanstalk.cloudformation.ConfigurationTemplateResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-configurationtemplate-sourceconfiguration.html </remarks>
    [JsiiInterfaceProxy(typeof(ISourceConfigurationProperty), "@aws-cdk/aws-elasticbeanstalk.cloudformation.ConfigurationTemplateResource.SourceConfigurationProperty")]
    internal class SourceConfigurationPropertyProxy : DeputyBase, ISourceConfigurationProperty
    {
        private SourceConfigurationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ConfigurationTemplateResource.SourceConfigurationProperty.ApplicationName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-configurationtemplate-sourceconfiguration.html#cfn-elasticbeanstalk-configurationtemplate-sourceconfiguration-applicationname </remarks>
        [JsiiProperty("applicationName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object ApplicationName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ConfigurationTemplateResource.SourceConfigurationProperty.TemplateName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-configurationtemplate-sourceconfiguration.html#cfn-elasticbeanstalk-configurationtemplate-sourceconfiguration-templatename </remarks>
        [JsiiProperty("templateName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object TemplateName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}