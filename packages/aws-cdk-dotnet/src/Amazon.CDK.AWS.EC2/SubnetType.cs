using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>The type of Subnet</summary>
    [JsiiEnum(typeof(SubnetType), "@aws-cdk/aws-ec2.SubnetType")]
    public enum SubnetType
    {
        [JsiiEnumMember("Isolated")]
        Isolated,
        [JsiiEnumMember("Private")]
        Private,
        [JsiiEnumMember("Public")]
        Public
    }
}