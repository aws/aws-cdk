using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Config.cloudformation.ConfigRuleResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-source.html </remarks>
    [JsiiInterfaceProxy(typeof(ISourceProperty), "@aws-cdk/aws-config.cloudformation.ConfigRuleResource.SourceProperty")]
    internal class SourcePropertyProxy : DeputyBase, ISourceProperty
    {
        private SourcePropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ConfigRuleResource.SourceProperty.Owner``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-source.html#cfn-config-configrule-source-owner </remarks>
        [JsiiProperty("owner", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Owner
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ConfigRuleResource.SourceProperty.SourceDetails``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-source.html#cfn-config-configrule-source-sourcedetails </remarks>
        [JsiiProperty("sourceDetails", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-config.cloudformation.ConfigRuleResource.SourceDetailProperty\"}]}}}}]},\"optional\":true}")]
        public virtual object SourceDetails
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ConfigRuleResource.SourceProperty.SourceIdentifier``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configrule-source.html#cfn-config-configrule-source-sourceidentifier </remarks>
        [JsiiProperty("sourceIdentifier", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object SourceIdentifier
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}