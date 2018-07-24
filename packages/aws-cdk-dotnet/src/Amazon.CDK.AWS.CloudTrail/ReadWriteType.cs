using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudTrail
{
    [JsiiEnum(typeof(ReadWriteType), "@aws-cdk/aws-cloudtrail.ReadWriteType")]
    public enum ReadWriteType
    {
        [JsiiEnumMember("ReadOnly")]
        ReadOnly,
        [JsiiEnumMember("WriteOnly")]
        WriteOnly,
        [JsiiEnumMember("All")]
        All
    }
}