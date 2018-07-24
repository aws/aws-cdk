using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>The outbound traffic mode defines whether the VPC is configured to route outbound traffic.</summary>
    [JsiiEnum(typeof(OutboundTrafficMode), "@aws-cdk/aws-ec2.OutboundTrafficMode")]
    public enum OutboundTrafficMode
    {
        [JsiiEnumMember("None")]
        None,
        [JsiiEnumMember("FromPublicSubnetsOnly")]
        FromPublicSubnetsOnly,
        [JsiiEnumMember("FromPublicAndPrivateSubnets")]
        FromPublicAndPrivateSubnets
    }
}