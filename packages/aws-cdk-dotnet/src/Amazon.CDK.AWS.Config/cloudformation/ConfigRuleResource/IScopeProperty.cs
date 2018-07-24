using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Config.cloudformation.ConfigRuleResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-scope.html </remarks>
    [JsiiInterface(typeof(IScopeProperty), "@aws-cdk/aws-config.cloudformation.ConfigRuleResource.ScopeProperty")]
    public interface IScopeProperty
    {
        /// <summary>``ConfigRuleResource.ScopeProperty.ComplianceResourceId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-scope.html#cfn-config-configrule-scope-complianceresourceid </remarks>
        [JsiiProperty("complianceResourceId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ComplianceResourceId
        {
            get;
            set;
        }

        /// <summary>``ConfigRuleResource.ScopeProperty.ComplianceResourceTypes``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-scope.html#cfn-config-configrule-scope-complianceresourcetypes </remarks>
        [JsiiProperty("complianceResourceTypes", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object ComplianceResourceTypes
        {
            get;
            set;
        }

        /// <summary>``ConfigRuleResource.ScopeProperty.TagKey``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-scope.html#cfn-config-configrule-scope-tagkey </remarks>
        [JsiiProperty("tagKey", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object TagKey
        {
            get;
            set;
        }

        /// <summary>``ConfigRuleResource.ScopeProperty.TagValue``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-scope.html#cfn-config-configrule-scope-tagvalue </remarks>
        [JsiiProperty("tagValue", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object TagValue
        {
            get;
            set;
        }
    }
}