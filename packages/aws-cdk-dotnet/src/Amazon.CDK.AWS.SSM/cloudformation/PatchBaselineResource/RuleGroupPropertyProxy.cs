using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SSM.cloudformation.PatchBaselineResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-rulegroup.html </remarks>
    [JsiiInterfaceProxy(typeof(IRuleGroupProperty), "@aws-cdk/aws-ssm.cloudformation.PatchBaselineResource.RuleGroupProperty")]
    internal class RuleGroupPropertyProxy : DeputyBase, IRuleGroupProperty
    {
        private RuleGroupPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``PatchBaselineResource.RuleGroupProperty.PatchRules``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-rulegroup.html#cfn-ssm-patchbaseline-rulegroup-patchrules </remarks>
        [JsiiProperty("patchRules", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ssm.cloudformation.PatchBaselineResource.RuleProperty\"}]}}}}]},\"optional\":true}")]
        public virtual object PatchRules
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}