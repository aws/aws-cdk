using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Events
{
    /// <summary>Defines a CloudWatch Event Rule in this stack.</summary>
    [JsiiClass(typeof(EventRule), "@aws-cdk/aws-events.EventRule", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.EventRuleProps\",\"optional\":true}}]")]
    public class EventRule : EventRuleRef
    {
        public EventRule(Construct parent, string name, IEventRuleProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected EventRule(ByRefValue reference): base(reference)
        {
        }

        protected EventRule(DeputyProps props): base(props)
        {
        }

        /// <summary>
        /// The value of the event rule Amazon Resource Name (ARN), such as
        /// arn:aws:events:us-east-2:123456789012:rule/example.
        /// </summary>
        [JsiiProperty("ruleArn", "{\"fqn\":\"@aws-cdk/aws-events.RuleArn\"}")]
        public override RuleArn RuleArn
        {
            get => GetInstanceProperty<RuleArn>();
        }

        /// <summary>
        /// Adds a target to the rule. The abstract class RuleTarget can be extended to define new
        /// targets.
        /// 
        /// No-op if target is undefined.
        /// </summary>
        [JsiiMethod("addTarget", null, "[{\"name\":\"target\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.IEventRuleTargetProps\",\"optional\":true}},{\"name\":\"inputOptions\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.TargetInputTemplate\",\"optional\":true}}]")]
        public virtual void AddTarget(IIEventRuleTargetProps target, ITargetInputTemplate inputOptions)
        {
            InvokeInstanceVoidMethod(new object[]{target, inputOptions});
        }

        /// <summary>
        /// Adds an event pattern filter to this rule. If a pattern was already specified,
        /// these values are merged into the existing pattern.
        /// 
        /// For example, if the rule already contains the pattern:
        /// 
        ///       {
        ///           "resources": [ "r1" ],
        ///           "detail": {
        ///               "hello": [ 1 ]
        ///           }
        ///       }
        /// 
        /// And `addEventPattern` is called with the pattern:
        /// 
        ///       {
        ///           "resources": [ "r2" ],
        ///           "detail": {
        ///               "foo": [ "bar" ]
        ///           }
        ///       }
        /// 
        /// The resulting event pattern will be:
        /// 
        ///       {
        ///           "resources": [ "r1", "r2" ],
        ///           "detail": {
        ///               "hello": [ 1 ],
        ///               "foo": [ "bar" ]
        ///           }
        ///       }
        /// </summary>
        [JsiiMethod("addEventPattern", null, "[{\"name\":\"eventPattern\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.EventPattern\",\"optional\":true}}]")]
        public virtual void AddEventPattern(IEventPattern eventPattern)
        {
            InvokeInstanceVoidMethod(new object[]{eventPattern});
        }

        /// <summary>
        /// This method can be implemented by derived constructs in order to perform
        /// validation logic. It is called on all constructs before synthesis.
        /// </summary>
        [JsiiMethod("validate", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}", "[]")]
        public override string[] Validate()
        {
            return InvokeInstanceMethod<string[]>(new object[]{});
        }
    }
}