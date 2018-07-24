using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Events
{
    [JsiiInterface(typeof(IEventRuleRefProps), "@aws-cdk/aws-events.EventRuleRefProps")]
    public interface IEventRuleRefProps
    {
        /// <summary>
        /// The value of the event rule Amazon Resource Name (ARN), such as
        /// arn:aws:events:us-east-2:123456789012:rule/example.
        /// </summary>
        [JsiiProperty("eventRuleArn", "{\"fqn\":\"@aws-cdk/aws-events.RuleArn\"}")]
        RuleArn EventRuleArn
        {
            get;
            set;
        }
    }
}