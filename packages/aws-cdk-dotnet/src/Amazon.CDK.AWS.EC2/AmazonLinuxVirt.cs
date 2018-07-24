using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Virtualization type for Amazon Linux</summary>
    [JsiiEnum(typeof(AmazonLinuxVirt), "@aws-cdk/aws-ec2.AmazonLinuxVirt")]
    public enum AmazonLinuxVirt
    {
        [JsiiEnumMember("HVM")]
        HVM,
        [JsiiEnumMember("PV")]
        PV
    }
}