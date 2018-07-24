using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Events
{
    /// <summary>An abstract target for EventRules.</summary>
    public class IEventRuleTargetProps : DeputyBase, IIEventRuleTargetProps
    {
        /// <summary>
        /// Returns the rule target specification.
        /// NOTE: Do not use the various `inputXxx` options. They can be set in a call to `addTarget`.
        /// </summary>
        [JsiiProperty("eventRuleTarget", "{\"fqn\":\"@aws-cdk/aws-events.EventRuleTarget\"}", true)]
        public IEventRuleTarget EventRuleTarget
        {
            get;
        }
    }
}