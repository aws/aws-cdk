using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>A single TCP port</summary>
    [JsiiClass(typeof(TcpPort), "@aws-cdk/aws-ec2.TcpPort", "[{\"name\":\"port\",\"type\":{\"primitive\":\"number\"}}]")]
    public class TcpPort : DeputyBase, IIPortRange
    {
        public TcpPort(double port): base(new DeputyProps(new object[]{port}))
        {
        }

        protected TcpPort(ByRefValue reference): base(reference)
        {
        }

        protected TcpPort(DeputyProps props): base(props)
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