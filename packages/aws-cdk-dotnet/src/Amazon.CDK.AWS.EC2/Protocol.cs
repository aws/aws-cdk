using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Protocol for use in Connection Rules</summary>
    [JsiiEnum(typeof(Protocol), "@aws-cdk/aws-ec2.Protocol")]
    public enum Protocol
    {
        [JsiiEnumMember("All")]
        All,
        [JsiiEnumMember("Tcp")]
        Tcp,
        [JsiiEnumMember("Udp")]
        Udp,
        [JsiiEnumMember("Icmp")]
        Icmp,
        [JsiiEnumMember("Icmpv6")]
        Icmpv6
    }
}