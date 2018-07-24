using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Events
{
    [JsiiClass(typeof(EventRuleRef), "@aws-cdk/aws-events.EventRuleRef", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}}]")]
    public abstract class EventRuleRef : Construct
    {
        protected EventRuleRef(Construct parent, string name): base(new DeputyProps(new object[]{parent, name}))
        {
        }

        protected EventRuleRef(ByRefValue reference): base(reference)
        {
        }

        protected EventRuleRef(DeputyProps props): base(props)
        {
        }

        /// <summary>
        /// The value of the event rule Amazon Resource Name (ARN), such as
        /// arn:aws:events:us-east-2:123456789012:rule/example.
        /// </summary>
        [JsiiProperty("ruleArn", "{\"fqn\":\"@aws-cdk/aws-events.RuleArn\"}")]
        public virtual RuleArn RuleArn
        {
            get => GetInstanceProperty<RuleArn>();
        }

        /// <summary>Imports a rule by ARN into this stack.</summary>
        [JsiiMethod("import", "{\"fqn\":\"@aws-cdk/aws-events.EventRuleRef\"}", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.EventRuleRefProps\"}}]")]
        public static EventRuleRef Import(Construct parent, string name, IEventRuleRefProps props)
        {
            return InvokeStaticMethod<EventRuleRef>(typeof(EventRuleRef), new object[]{parent, name, props});
        }

        /// <summary>Exports this rule resource from this stack and returns an import token.</summary>
        [JsiiMethod("export", "{\"fqn\":\"@aws-cdk/aws-events.EventRuleRefProps\"}", "[]")]
        public virtual IEventRuleRefProps Export()
        {
            return InvokeInstanceMethod<IEventRuleRefProps>(new object[]{});
        }
    }
}