using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Events
{
    [JsiiInterfaceProxy(typeof(IEventRuleRefProps), "@aws-cdk/aws-events.EventRuleRefProps")]
    internal class EventRuleRefPropsProxy : DeputyBase, IEventRuleRefProps
    {
        private EventRuleRefPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>
        /// The value of the event rule Amazon Resource Name (ARN), such as
        /// arn:aws:events:us-east-2:123456789012:rule/example.
        /// </summary>
        [JsiiProperty("eventRuleArn", "{\"fqn\":\"@aws-cdk/aws-events.RuleArn\"}")]
        public virtual RuleArn EventRuleArn
        {
            get => GetInstanceProperty<RuleArn>();
            set => SetInstanceProperty(value);
        }
    }
}