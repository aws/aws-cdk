using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Interface for classes that provide the peer-specification parts of a security group rule</summary>
    [JsiiInterface(typeof(IIConnectionPeer), "@aws-cdk/aws-ec2.IConnectionPeer")]
    public interface IIConnectionPeer
    {
        /// <summary>Whether the rule can be inlined into a SecurityGroup or not</summary>
        [JsiiProperty("canInlineRule", "{\"primitive\":\"boolean\"}")]
        bool CanInlineRule
        {
            get;
        }

        /// <summary>Produce the ingress rule JSON for the given connection</summary>
        [JsiiMethod("toIngressRuleJSON", "{\"primitive\":\"any\"}", "[]")]
        object ToIngressRuleJSON();
        /// <summary>Produce the egress rule JSON for the given connection</summary>
        [JsiiMethod("toEgressRuleJSON", "{\"primitive\":\"any\"}", "[]")]
        object ToEgressRuleJSON();
    }
}