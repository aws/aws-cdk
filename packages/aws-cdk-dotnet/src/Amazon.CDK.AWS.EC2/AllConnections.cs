using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>All TCP Ports</summary>
    [JsiiClass(typeof(AllConnections), "@aws-cdk/aws-ec2.AllConnections", "[]")]
    public class AllConnections : DeputyBase, IIPortRange
    {
        public AllConnections(): base(new DeputyProps(new object[]{}))
        {
        }

        protected AllConnections(ByRefValue reference): base(reference)
        {
        }

        protected AllConnections(DeputyProps props): base(props)
        {
        }

        [JsiiProperty("canInlineRule", "{\"primitive\":\"boolean\"}")]
        public virtual bool CanInlineRule
        {
            get => GetInstanceProperty<bool>();
        }

        /// <summary>Produce the ingress/egress rule JSON for the given connection</summary>
        [JsiiMethod("toRuleJSON", "{\"primitive\":\"any\"}", "[]")]
        public virtual object ToRuleJSON()
        {
            return InvokeInstanceMethod<object>(new object[]{});
        }
    }
}