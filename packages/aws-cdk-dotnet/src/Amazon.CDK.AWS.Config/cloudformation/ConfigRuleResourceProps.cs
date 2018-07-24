using Amazon.CDK;
using Amazon.CDK.AWS.Config.cloudformation.ConfigRuleResource;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK.AWS.Config.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html </remarks>
    public class ConfigRuleResourceProps : DeputyBase, IConfigRuleResourceProps
    {
        /// <summary>``AWS::Config::ConfigRule.Source``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html#cfn-config-configrule-source </remarks>
        [JsiiProperty("source", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/aws-config.cloudformation.ConfigRuleResource.SourceProperty\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object Source
        {
            get;
            set;
        }

        /// <summary>``AWS::Config::ConfigRule.ConfigRuleName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html#cfn-config-configrule-configrulename </remarks>
        [JsiiProperty("configRuleName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object ConfigRuleName
        {
            get;
            set;
        }

        /// <summary>``AWS::Config::ConfigRule.Description``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html#cfn-config-configrule-description </remarks>
        [JsiiProperty("description", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Description
        {
            get;
            set;
        }

        /// <summary>``AWS::Config::ConfigRule.InputParameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html#cfn-config-configrule-inputparameters </remarks>
        [JsiiProperty("inputParameters", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object InputParameters
        {
            get;
            set;
        }

        /// <summary>``AWS::Config::ConfigRule.MaximumExecutionFrequency``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html#cfn-config-configrule-maximumexecutionfrequency </remarks>
        [JsiiProperty("maximumExecutionFrequency", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object MaximumExecutionFrequency
        {
            get;
            set;
        }

        /// <summary>``AWS::Config::ConfigRule.Scope``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html#cfn-config-configrule-scope </remarks>
        [JsiiProperty("scope", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-config.cloudformation.ConfigRuleResource.ScopeProperty\"}]},\"optional\":true}", true)]
        public object Scope
        {
            get;
            set;
        }
    }
}