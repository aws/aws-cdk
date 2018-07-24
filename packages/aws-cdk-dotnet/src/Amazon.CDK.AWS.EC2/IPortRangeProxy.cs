using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Interface for classes that provide the connection-specification parts of a security group rule</summary>
    [JsiiInterfaceProxy(typeof(IIPortRange), "@aws-cdk/aws-ec2.IPortRange")]
    internal class IPortRangeProxy : DeputyBase, IIPortRange
    {
        private IPortRangeProxy(ByRefValue reference): base(reference)
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