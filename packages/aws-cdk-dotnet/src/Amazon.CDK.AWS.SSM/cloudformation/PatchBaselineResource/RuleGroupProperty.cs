using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SSM.cloudformation.PatchBaselineResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-rulegroup.html </remarks>
    public class RuleGroupProperty : DeputyBase, IRuleGroupProperty
    {
        /// <summary>``PatchBaselineResource.RuleGroupProperty.PatchRules``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-rulegroup.html#cfn-ssm-patchbaseline-rulegroup-patchrules </remarks>
        [JsiiProperty("patchRules", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ssm.cloudformation.PatchBaselineResource.RuleProperty\"}]}}}}]},\"optional\":true}", true)]
        public object PatchRules
        {
            get;
            set;
        }
    }
}