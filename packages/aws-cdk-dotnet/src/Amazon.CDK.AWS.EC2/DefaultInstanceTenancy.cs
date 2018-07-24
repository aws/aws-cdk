using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>The default tenancy of instances launched into the VPC.</summary>
    [JsiiEnum(typeof(DefaultInstanceTenancy), "@aws-cdk/aws-ec2.DefaultInstanceTenancy")]
    public enum DefaultInstanceTenancy
    {
        [JsiiEnumMember("Default")]
        Default,
        [JsiiEnumMember("Dedicated")]
        Dedicated
    }
}