using Amazon.CDK;
using Amazon.CDK.AWS.ElasticBeanstalk.cloudformation.ConfigurationTemplateResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticBeanstalk.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html </remarks>
    [JsiiInterface(typeof(IConfigurationTemplateResourceProps), "@aws-cdk/aws-elasticbeanstalk.cloudformation.ConfigurationTemplateResourceProps")]
    public interface IConfigurationTemplateResourceProps
    {
        /// <summary>``AWS::ElasticBeanstalk::ConfigurationTemplate.ApplicationName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html#cfn-elasticbeanstalk-configurationtemplate-applicationname </remarks>
        [JsiiProperty("applicationName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object ApplicationName
        {
            get;
            set;
        }

        /// <summary>``AWS::ElasticBeanstalk::ConfigurationTemplate.Description``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html#cfn-elasticbeanstalk-configurationtemplate-description </remarks>
        [JsiiProperty("description", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Description
        {
            get;
            set;
        }

        /// <summary>``AWS::ElasticBeanstalk::ConfigurationTemplate.EnvironmentId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html#cfn-elasticbeanstalk-configurationtemplate-environmentid </remarks>
        [JsiiProperty("environmentId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object EnvironmentId
        {
            get;
            set;
        }

        /// <summary>``AWS::ElasticBeanstalk::ConfigurationTemplate.OptionSettings``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html#cfn-elasticbeanstalk-configurationtemplate-optionsettings </remarks>
        [JsiiProperty("optionSettings", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-elasticbeanstalk.cloudformation.ConfigurationTemplateResource.ConfigurationOptionSettingProperty\"}]}}}}]},\"optional\":true}")]
        object OptionSettings
        {
            get;
            set;
        }

        /// <summary>``AWS::ElasticBeanstalk::ConfigurationTemplate.PlatformArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html#cfn-elasticbeanstalk-configurationtemplate-platformarn </remarks>
        [JsiiProperty("platformArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object PlatformArn
        {
            get;
            set;
        }

        /// <summary>``AWS::ElasticBeanstalk::ConfigurationTemplate.SolutionStackName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html#cfn-elasticbeanstalk-configurationtemplate-solutionstackname </remarks>
        [JsiiProperty("solutionStackName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object SolutionStackName
        {
            get;
            set;
        }

        /// <summary>``AWS::ElasticBeanstalk::ConfigurationTemplate.SourceConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html#cfn-elasticbeanstalk-configurationtemplate-sourceconfiguration </remarks>
        [JsiiProperty("sourceConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-elasticbeanstalk.cloudformation.ConfigurationTemplateResource.SourceConfigurationProperty\"}]},\"optional\":true}")]
        object SourceConfiguration
        {
            get;
            set;
        }
    }
}