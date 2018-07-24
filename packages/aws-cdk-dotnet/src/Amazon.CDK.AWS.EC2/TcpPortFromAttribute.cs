using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>A single TCP port that is provided by a resource attribute</summary>
    [JsiiClass(typeof(TcpPortFromAttribute), "@aws-cdk/aws-ec2.TcpPortFromAttribute", "[{\"name\":\"port\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Token\"}}]")]
    public class TcpPortFromAttribute : DeputyBase, IIPortRange
    {
        public TcpPortFromAttribute(Token port): base(new DeputyProps(new object[]{port}))
        {
        }

        protected TcpPortFromAttribute(ByRefValue reference): base(reference)
        {
        }

        protected TcpPortFromAttribute(DeputyProps props): base(props)
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