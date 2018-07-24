using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Events.cloudformation.RuleResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-runcommandparameters.html </remarks>
    [JsiiInterfaceProxy(typeof(IRunCommandParametersProperty), "@aws-cdk/aws-events.cloudformation.RuleResource.RunCommandParametersProperty")]
    internal class RunCommandParametersPropertyProxy : DeputyBase, IRunCommandParametersProperty
    {
        private RunCommandParametersPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``RuleResource.RunCommandParametersProperty.RunCommandTargets``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-runcommandparameters.html#cfn-events-rule-runcommandparameters-runcommandtargets </remarks>
        [JsiiProperty("runCommandTargets", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-events.cloudformation.RuleResource.RunCommandTargetProperty\"}]}}}}]}}")]
        public virtual object RunCommandTargets
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}