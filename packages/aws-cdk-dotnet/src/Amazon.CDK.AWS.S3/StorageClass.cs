using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3
{
    /// <summary>Storage class to move an object to</summary>
    [JsiiEnum(typeof(StorageClass), "@aws-cdk/aws-s3.StorageClass")]
    public enum StorageClass
    {
        [JsiiEnumMember("InfrequentAccess")]
        InfrequentAccess,
        [JsiiEnumMember("OneZoneInfrequentAccess")]
        OneZoneInfrequentAccess,
        [JsiiEnumMember("Glacier")]
        Glacier
    }
}