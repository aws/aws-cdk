using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Events.cloudformation.RuleResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-runcommandparameters.html </remarks>
    [JsiiInterface(typeof(IRunCommandParametersProperty), "@aws-cdk/aws-events.cloudformation.RuleResource.RunCommandParametersProperty")]
    public interface IRunCommandParametersProperty
    {
        /// <summary>``RuleResource.RunCommandParametersProperty.RunCommandTargets``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-runcommandparameters.html#cfn-events-rule-runcommandparameters-runcommandtargets </remarks>
        [JsiiProperty("runCommandTargets", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-events.cloudformation.RuleResource.RunCommandTargetProperty\"}]}}}}]}}")]
        object RunCommandTargets
        {
            get;
            set;
        }
    }
}