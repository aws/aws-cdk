using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Events
{
    [JsiiInterfaceProxy(typeof(IEventRuleProps), "@aws-cdk/aws-events.EventRuleProps")]
    internal class EventRulePropsProxy : DeputyBase, IEventRuleProps
    {
        private EventRulePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>A description of the rule's purpose.</summary>
        [JsiiProperty("description", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Description
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// A name for the rule. If you don't specify a name, AWS CloudFormation
        /// generates a unique physical ID and uses that ID for the rule name. For
        /// more information, see Name Type.
        /// </summary>
        [JsiiProperty("ruleName", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string RuleName
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Indicates whether the rule is enabled.</summary>
        /// <remarks>default: Rule is enabled</remarks>
        [JsiiProperty("enabled", "{\"primitive\":\"boolean\",\"optional\":true}")]
        public virtual bool? Enabled
        {
            get => GetInstanceProperty<bool? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// The schedule or rate (frequency) that determines when CloudWatch Events
        /// runs the rule. For more information, see Schedule Expression Syntax for
        /// Rules in the Amazon CloudWatch User Guide.
        /// </summary>
        /// <remarks>
        /// see: http://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html
        /// 
        /// You must specify this property, the `eventPattern` property, or both.
        /// </remarks>
        [JsiiProperty("scheduleExpression", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string ScheduleExpression
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Describes which events CloudWatch Events routes to the specified target.
        /// These routed events are matched events. For more information, see Events
        /// and Event Patterns in the Amazon CloudWatch User Guide.
        /// </summary>
        /// <remarks>
        /// see: http://docs.aws.amazon.com/AmazonCloudWatch/latest/DeveloperGuide/CloudWatchEventsandEventPatterns.html
        /// 
        /// You must specify this property (either via props or via
        /// `addEventPattern`), the `scheduleExpression` property, or both. The
        /// method `addEventPattern` can be used to add filter values to the event
        /// pattern.
        /// </remarks>
        [JsiiProperty("eventPattern", "{\"fqn\":\"@aws-cdk/aws-events.EventPattern\",\"optional\":true}")]
        public virtual IEventPattern EventPattern
        {
            get => GetInstanceProperty<IEventPattern>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Targets to invoke when this rule matches an event.
        /// 
        /// Input will be the full matched event. If you wish to specify custom
        /// target input, use `addTarget(target[, inputOptions])`.
        /// </summary>
        [JsiiProperty("targets", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-events.IEventRuleTargetProps\"}},\"optional\":true}")]
        public virtual IIEventRuleTargetProps[] Targets
        {
            get => GetInstanceProperty<IIEventRuleTargetProps[]>();
            set => SetInstanceProperty(value);
        }
    }
}