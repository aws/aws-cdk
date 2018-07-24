using Amazon.CDK;
using Amazon.CDK.AWS.RDS.cloudformation.OptionGroupResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.RDS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-optiongroup.html </remarks>
    [JsiiInterface(typeof(IOptionGroupResourceProps), "@aws-cdk/aws-rds.cloudformation.OptionGroupResourceProps")]
    public interface IOptionGroupResourceProps
    {
        /// <summary>``AWS::RDS::OptionGroup.EngineName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-optiongroup.html#cfn-rds-optiongroup-enginename </remarks>
        [JsiiProperty("engineName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object EngineName
        {
            get;
            set;
        }

        /// <summary>``AWS::RDS::OptionGroup.MajorEngineVersion``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-optiongroup.html#cfn-rds-optiongroup-majorengineversion </remarks>
        [JsiiProperty("majorEngineVersion", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object MajorEngineVersion
        {
            get;
            set;
        }

        /// <summary>``AWS::RDS::OptionGroup.OptionConfigurations``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-optiongroup.html#cfn-rds-optiongroup-optionconfigurations </remarks>
        [JsiiProperty("optionConfigurations", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-rds.cloudformation.OptionGroupResource.OptionConfigurationProperty\"}]}}}}]}}")]
        object OptionConfigurations
        {
            get;
            set;
        }

        /// <summary>``AWS::RDS::OptionGroup.OptionGroupDescription``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-optiongroup.html#cfn-rds-optiongroup-optiongroupdescription </remarks>
        [JsiiProperty("optionGroupDescription", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object OptionGroupDescription
        {
            get;
            set;
        }

        /// <summary>``AWS::RDS::OptionGroup.Tags``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-optiongroup.html#cfn-rds-optiongroup-tags </remarks>
        [JsiiProperty("tags", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/cdk.Tag\"}]}}}}]},\"optional\":true}")]
        object Tags
        {
            get;
            set;
        }
    }
}