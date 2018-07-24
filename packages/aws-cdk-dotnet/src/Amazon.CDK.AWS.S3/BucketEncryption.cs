using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3
{
    /// <summary>What kind of server-side encryption to apply to this bucket</summary>
    [JsiiEnum(typeof(BucketEncryption), "@aws-cdk/aws-s3.BucketEncryption")]
    public enum BucketEncryption
    {
        [JsiiEnumMember("Unencrypted")]
        Unencrypted,
        [JsiiEnumMember("KmsManaged")]
        KmsManaged,
        [JsiiEnumMember("S3Managed")]
        S3Managed,
        [JsiiEnumMember("Kms")]
        Kms
    }
}