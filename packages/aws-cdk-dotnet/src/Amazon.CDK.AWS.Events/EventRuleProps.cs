using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Events
{
    public class EventRuleProps : DeputyBase, IEventRuleProps
    {
        /// <summary>A description of the rule's purpose.</summary>
        [JsiiProperty("description", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string Description
        {
            get;
            set;
        }

        /// <summary>
        /// A name for the rule. If you don't specify a name, AWS CloudFormation
        /// generates a unique physical ID and uses that ID for the rule name. For
        /// more information, see Name Type.
        /// </summary>
        [JsiiProperty("ruleName", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string RuleName
        {
            get;
            set;
        }

        /// <summary>Indicates whether the rule is enabled.</summary>
        /// <remarks>default: Rule is enabled</remarks>
        [JsiiProperty("enabled", "{\"primitive\":\"boolean\",\"optional\":true}", true)]
        public bool? Enabled
        {
            get;
            set;
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
        [JsiiProperty("scheduleExpression", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string ScheduleExpression
        {
            get;
            set;
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
        [JsiiProperty("eventPattern", "{\"fqn\":\"@aws-cdk/aws-events.EventPattern\",\"optional\":true}", true)]
        public IEventPattern EventPattern
        {
            get;
            set;
        }

        /// <summary>
        /// Targets to invoke when this rule matches an event.
        /// 
        /// Input will be the full matched event. If you wish to specify custom
        /// target input, use `addTarget(target[, inputOptions])`.
        /// </summary>
        [JsiiProperty("targets", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-events.IEventRuleTargetProps\"}},\"optional\":true}", true)]
        public IIEventRuleTargetProps[] Targets
        {
            get;
            set;
        }
    }
}